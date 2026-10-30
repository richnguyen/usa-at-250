// Assembles index.html from the template, geometry, content and image manifest.
const fs = require('fs');
const path = require('path');
const G = require('./geo.js');
const C = require('./content.js');
const OUT = path.resolve(__dirname, '..');
const images = fs.existsSync(__dirname + '/images.json') ? JSON.parse(fs.readFileSync(__dirname + '/images.json', 'utf8')) : {};

// small northeastern states get callout labels out in the Atlantic
const CALL = { VT: [697, 389], NH: [757, 401], MA: [765, 421], RI: [765, 439], CT: [753, 457], NJ: [744, 474], DE: [740, 491], MD: [736, 507] };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const P = [];
P.push(`<svg id="map" viewBox="0 0 ${G.W} ${G.H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of North America. U.S. states are colored by when they joined the Union.">`);
P.push(`<rect class="water" x="-600" y="-500" width="${G.W + 1200}" height="${G.H + 1000}"/>`);
P.push(`<path class="grat" d="${G.grat}"/>`);
P.push(`<path class="land" d="${G.landD}"/>`);
P.push(`<path class="usland" d="${G.usLand}"/>`);
P.push('<g>');
for (const [k, v] of Object.entries(G.acqPaths)) P.push(`<path class="acq" data-a="${k}" d="${v.d}"/>`);
P.push('</g><g>');
for (const [p, v] of Object.entries(G.states)) if (C.STATES[p]) P.push(`<path class="st" data-p="${p}" d="${v.d}"><title>${esc(C.STATES[p][0])}</title></path>`);
P.push('</g><g>');
for (const [k, v] of Object.entries(G.acqPaths)) P.push(`<path class="acq-edge" data-a="${k}" d="${v.d}"/>`);
P.push('</g>');
const hb = G.HI_BOX;
P.push(`<g id="inset"><rect class="inset" x="${hb.x}" y="${hb.y}" width="${hb.w}" height="${hb.h}" rx="4"/>`);
P.push(`<text class="inset-lbl" x="${hb.x + 2}" y="${hb.y - 7}">HAWAII (inset)</text></g>`);
const geoLbl = [['CANADA', -101, 57, ''], ['MEXICO', -103.5, 26.5, ''], ['PACIFIC OCEAN', -133, 37, 'sea'], ['ATLANTIC OCEAN', -63, 33, 'sea'], ['CUBA', -79.5, 22.6, '']];
P.push('<g>');
for (const [t, lon, lat, c] of geoLbl) { const [x, y] = G.project(lon, lat); P.push(`<text class="geo-lbl ${c}" x="${x}" y="${y}">${t}</text>`); }
P.push('</g><g>');
for (const [p, v] of Object.entries(G.states)) {
  if (!C.STATES[p]) continue;
  if (CALL[p]) {
    const [x, y] = CALL[p];
    P.push(`<line class="leader" data-p="${p}" x1="${v.c[0]}" y1="${v.c[1]}" x2="${x - 9}" y2="${y}"/>`);
    P.push(`<text class="lbl call" data-p="${p}" x="${x}" y="${y}">${p}</text>`);
  } else P.push(`<text class="lbl" data-p="${p}" x="${v.c[0]}" y="${v.c[1]}">${p}</text>`);
}
P.push('</g><g>');
const SHORT = { a1783: 'Treaty of Paris, 1783', a1803: 'Louisiana Purchase', a1819: 'Florida', a1845: 'Texas', a1846: 'Oregon Country',
  a1848: 'Mexican Cession', a1853: 'Gadsden Purchase', a1867: 'Alaska Purchase', a1898: 'Puerto Rico', a1898hi: 'Hawaii' };
for (const [k, v] of Object.entries(G.acqPaths)) {
  let [x, y] = v.c;
  let anchor = 'middle';
  if (k === 'a1783') { x -= 40; y += 30; }
  if (k === 'a1803') { y += 10; }
  if (k === 'a1853') { y += 26; }
  if (k === 'a1898') { x -= 14; y -= 14; anchor = 'end'; }
  if (k === 'a1898hi') { y = hb.y + hb.h - 14; x = hb.x + 60; }
  P.push(`<text class="acq-lbl" data-a="${k}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(SHORT[k])}</text>`);
}
P.push('</g>');
P.push(`<g id="pin" hidden><circle class="ring" r="11"/><circle class="dot" r="4.5"/><text x="11" y="-9">place</text></g>`);
P.push('</svg>');

const stops = C.STOPS.map(s => Object.assign({}, s, { placeXY: s.place ? G.project(s.place.lon, s.place.lat) : null }));
const geoRuntime = { W: G.W, H: G.H, states: {}, acq: {} };
for (const [p, v] of Object.entries(G.states)) if (C.STATES[p]) geoRuntime.states[p] = { b: v.b, lab: CALL[p] || null };
for (const [k, v] of Object.entries(G.acqPaths)) geoRuntime.acq[k] = { b: v.b };

// About panel: sources and full image credits
const credits = C.STOPS.map(s => {
  const im = images[s.id] || {};
  const li = [];
  for (const [kind, x] of [['Illustration', im.ill], ['Portrait', im.person]]) if (x)
    li.push(`<li><b>${esc(s.label)}</b> ${kind}: <i>${esc(x.title)}</i>${x.artist ? ' by ' + esc(x.artist) : ''}${x.date ? ' (' + esc(x.date) + ')' : ''}. <a href="${esc(x.page)}" target="_blank" rel="noopener">Wikimedia Commons</a>, ${esc(x.license)}.</li>`);
  return li.join('');
}).join('');
const about = `
<p>Move the slider, use the arrow buttons, or press ← and → on your keyboard to travel through ${stops.length} milestones, from the Declaration of Independence in 1776 to the 250th anniversary in 2026. Tap any underlined word for a simple meaning. Tap a state on the map to jump to the moment it joined.</p>
<h3>How to read the map</h3>
<p>Blue states are part of the Union at that moment. Red marks what is new. Light blue is land the United States owned that was not yet a state. In 1861–65, gray shows the 11 states that left the Union. The map uses today’s state borders for clarity. The borders of territorial acquisitions are approximate and follow the usual U.S. history maps (for example, the 1818 Red River Basin is shown as part of the Louisiana Purchase). Hawaii is shown in a box closer to the mainland.</p>
<h3>Sources</h3>
<p>Statehood and ratification dates: U.S. National Archives and state records. Land added by each acquisition: U.S. Census Bureau and Bureau of Land Management tables of territorial acquisitions (square miles, land and water; published tables differ by less than 1%, so figures are rounded); the 2026 figure is today’s official total area of the 50 states and D.C. Population: U.S. decennial census counts, with estimates for 1776 and 1780 and the Census Bureau’s 2024 estimate. State shapes: U.S. Census Bureau cartographic boundaries, via the us-atlas project. Other countries: Natural Earth, via the world-atlas project.</p>
<h3>Image credits</h3>
<ol>${credits || '<li>Images are added from Wikimedia Commons.</li>'}</ol>`;

const DATA = {
  stops, states: C.STATES, acq: C.ACQ, pop: C.POP, eras: C.ERAS, glossary: C.GLOSSARY,
  original13: C.ORIGINAL13, confederacy: C.CONFEDERACY, geo: geoRuntime, images, about
};
let html = fs.readFileSync(__dirname + '/app.html', 'utf8');
html = html.replace('%%SVG%%', () => P.join('\n')).replace('%%DATA%%', () => JSON.stringify(DATA).replace(/</g, '\\u003c'));

// artifact.html: body-only page for hosts that add their own document skeleton (claude.ai artifacts)
fs.writeFileSync(__dirname + '/artifact.html', html);

// index.html: a complete standalone document (open locally or serve with GitHub Pages)
const cut = html.indexOf('<div class="app">');
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-family:system-ui,sans-serif;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
${html.slice(0, cut).trim()}
</head>
<body>
${html.slice(cut).trim()}
</body>
</html>
`;
fs.writeFileSync(OUT + '/index.html', standalone);
console.log('index.html', (fs.statSync(OUT + '/index.html').size / 1024).toFixed(0), 'KB');
