// Builds projected SVG geometry for the map: base land, states, acquisitions, inset for Hawaii.
const d3 = require('d3-geo');
const topo = require('topojson-client');
const turf = require('@turf/turf');
const fs = require('fs');
const R = require('./regions');

const us = require('us-atlas/states-10m.json');
const simp = require('topojson-simplify');
const world0 = require('world-atlas/countries-50m.json');
const world = simp.simplify(simp.presimplify(world0), 0.02);

const FIPS = {"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY","72":"PR"};

const geoms = us.objects.states.geometries.filter(g => FIPS[g.id]);
const byPostal = {};
for (const g of geoms) byPostal[FIPS[g.id]] = g;
const feat = p => topo.feature(us, byPostal[p]);
const merge = list => ({ type: 'Feature', properties: {}, geometry: topo.merge(us, list.map(p => byPostal[p])) });
const poly = ring => turf.polygon([ring]);
const clip = (p, ring) => turf.intersect(turf.featureCollection([feat(p), poly(ring)]));
const union = fs_ => turf.union(turf.featureCollection(fs_.filter(Boolean)));
const minus = (a, b) => b ? turf.difference(turf.featureCollection([a, b])) : a;
// turf follows RFC 7946 winding; d3-geo wants the opposite (clockwise exterior rings)
const d3wind = f => turf.rewind(f, { reverse: true });

// --- acquisitions (lon/lat) ---
const EAST = ['ME','NH','VT','MA','RI','CT','NY','NJ','PA','DE','MD','DC','VA','WV','NC','SC','GA','KY','TN','OH','IN','IL','MI','WI'];
const acq = {};
acq.a1783 = union([merge(EAST), clip('AL', R.north31), clip('MS', R.north31), clip('MN', R.mnEast)]);
let done = acq.a1783;
const lp = union([merge(['LA','AR','MO','IA','NE','SD','ND','MN']),
  ...['KS','OK','CO','WY','MT'].map(p => clip(p, R.lpWest))]);
acq.a1803 = minus(lp, done); done = union([done, acq.a1803]);
acq.a1819 = minus(union([feat('FL'), clip('AL', R.south31), clip('MS', R.south31)]), done); done = union([done, acq.a1819]);
const west = merge(['TX','OK','KS','CO','NM','WY','UT','AZ','NV','CA','OR','WA','ID','MT']);
const inWest = ring => turf.intersect(turf.featureCollection([west, poly(ring)]));
acq.a1845 = minus(union([feat('TX'), inWest(R.texasClaim)]), done); done = union([done, acq.a1845]);
acq.a1846 = minus(inWest(R.oregon), done); done = union([done, acq.a1846]);
acq.a1848 = minus(inWest(R.mexicanCession), done); done = union([done, acq.a1848]);
acq.a1853 = minus(inWest(R.gadsden), done); done = union([done, acq.a1853]);
// anything in the lower 48 still uncovered (tiny slivers) gets folded into 1853
const lower48 = merge(Object.keys(byPostal).filter(p => !['AK','HI','PR'].includes(p)));
const leftover = minus(lower48, done);
if (leftover) {
  const area = turf.area(leftover) / 2.59e6;
  console.error('leftover sq mi:', area.toFixed(0));
}
acq.a1867 = feat('AK');
acq.a1898 = feat('PR'); // Hawaii is drawn in its inset
// sanity: report areas in sq mi
for (const k of Object.keys(acq)) if (!['a1867','a1898'].includes(k)) acq[k] = d3wind(acq[k]);
for (const [k, v] of Object.entries(acq)) console.error(k, (turf.area(v) / 2.59e6).toFixed(0), 'sq mi', 'sphere frac', (d3.geoArea(v)/(4*Math.PI)).toFixed(4));

// --- projection ---
const W = +(process.env.W||1000), H = +(process.env.H||720);
const PAR0=+(process.env.P0||29.5), PAR1=+(process.env.P1||55), ROT=+(process.env.ROT||100);
const proj = ((process.env.EA ?? "1") === "1" ? d3.geoConicEqualArea() : d3.geoConicConformal()).parallels([PAR0, PAR1]).rotate([ROT, 0]);
const frame = { type: 'MultiPoint', coordinates: [[-167, 66], [-156, 71.4], [-66.8, 47.4], [-80, 24.3], [-117, 25], [-65.4, 17.7], [-125, 49], [-88, 50], [-141, 60]] };
proj.fitExtent([[10, 10], [W - 10, H - 10]], frame);
const path = d3.geoPath(proj).digits(1);
const projWide = proj.clipExtent([[-450, -320], [W + 450, H + 320]]);

// Hawaii inset (bottom-left)
const HI_BOX = { x: 18, y: H - 150, w: 230, h: 130 };
const hiProj = d3.geoConicConformal().parallels([8, 18]).rotate([157, 0]);
hiProj.fitExtent([[HI_BOX.x + 8, HI_BOX.y + 8], [HI_BOX.x + HI_BOX.w - 8, HI_BOX.y + HI_BOX.h - 8]], feat('HI'));
const hiPath = d3.geoPath(hiProj).digits(1);

// --- base land: other countries ---
const countries = topo.feature(world, world.objects.countries).features
  .filter(f => f.properties.name !== 'United States of America' && f.properties.name !== 'Puerto Rico');
const pathLand = d3.geoPath(proj).digits(0);
const landD = countries.map(f => pathLand(f)).filter(Boolean).join('');
const usLand = pathLand(topo.feature(us, us.objects.nation));

// graticule
const grat = path(d3.geoGraticule().step([10, 10]).extentMajor([[-180, 10], [-40, 85]])());

const states = {};
for (const [p, g] of Object.entries(byPostal)) {
  if (p === 'DC') continue;
  const f = topo.feature(us, g);
  const P = p === 'HI' ? hiPath : path;
  const pr = p === 'HI' ? hiProj : proj;
  let c = P.centroid(f);
  // use largest polygon centroid for multi-part states
  if (f.geometry.type === 'MultiPolygon') {
    let best = null, ba = -1;
    for (const coords of f.geometry.coordinates) {
      const pf = { type: 'Polygon', coordinates: coords };
      const a = P.area(pf);
      if (a > ba) { ba = a; best = pf; }
    }
    c = P.centroid(best);
  }
  const b = P.bounds(f).map(pt => pt.map(v => +v.toFixed(1)));
  states[p] = { d: P(f), c: c.map(v => +v.toFixed(1)), b, name: f.properties.name };
}
const acqPaths = {};
for (const [k, v] of Object.entries(acq)) {
  const pr = path(v);
  const c = path.centroid(v);
  acqPaths[k] = { d: pr, c: c.map(v => +v.toFixed(1)), b: path.bounds(v).map(pt => pt.map(v => +v.toFixed(1))) };
}
acqPaths.a1898hi = { d: hiPath(feat('HI')), c: hiPath.centroid(feat('HI')).map(v => +v.toFixed(1)), b: [[HI_BOX.x, HI_BOX.y], [HI_BOX.x + HI_BOX.w, HI_BOX.y + HI_BOX.h]] };
states.HI.b = [[HI_BOX.x, HI_BOX.y], [HI_BOX.x + HI_BOX.w, HI_BOX.y + HI_BOX.h]];

const project = (lon, lat) => {
  if (lon < -150 && lat < 25) return hiProj([lon, lat]).map(v => +v.toFixed(1));
  return proj([lon, lat]).map(v => +v.toFixed(1));
};

module.exports = { W, H, HI_BOX, landD, usLand, grat, states, acqPaths, project };

if (require.main === module) {
  const out = { W, H, HI_BOX, landD, usLand, grat, states, acqPaths };
  fs.writeFileSync(__dirname + '/geo.json', JSON.stringify(out));
  console.error('geo.json bytes', fs.statSync(__dirname + '/geo.json').size);
}
