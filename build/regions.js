// Approximate historical boundary lines (lon, lat) used to carve acquisitions out of modern state shapes.
// Sources: conventional U.S. territorial-acquisition maps (Mississippi River, Adams–Onís line 1819,
// Continental Divide, Texas claim to the Rio Grande, Gila River / Gadsden line 1853).

// Mississippi River in Minnesota, south (Iowa line) to its source at Lake Itasca
const MISSISSIPPI_MN = [
  [-91.22, 43.50], [-91.64, 44.05], [-92.53, 44.56], [-92.80, 44.75], [-93.09, 44.94],
  [-93.27, 44.98], [-93.39, 45.20], [-94.16, 45.56], [-94.36, 45.98], [-94.20, 46.36],
  [-93.70, 46.53], [-93.50, 46.90], [-93.53, 47.24], [-94.10, 47.45], [-94.60, 47.38],
  [-94.88, 47.47], [-95.20, 47.24]
];

// Continental Divide from the Canadian border south to South Pass, Wyoming
const DIVIDE_N = [
  [-114.05, 49.60], [-114.05, 49.00], [-113.66, 48.57], [-113.32, 48.32], [-112.85, 47.60],
  [-112.38, 47.08], [-112.31, 46.56], [-112.50, 46.25], [-112.40, 45.92], [-112.95, 45.95],
  [-113.50, 45.80], [-113.93, 45.68], [-113.44, 44.97], [-112.80, 44.40], [-112.30, 44.56],
  [-111.60, 44.55], [-111.30, 44.68], [-111.05, 44.50], [-110.60, 44.40], [-110.40, 44.10],
  [-110.07, 43.75], [-109.80, 43.30], [-109.30, 42.80], [-108.90, 42.35], [-108.90, 42.00]
];

// Adams–Onís line (1819): 42°N east to 106.3°W, south to the Arkansas River source,
// down the Arkansas to 100°W, then south along 100°W
const ARKANSAS_LINE = [
  [-106.30, 42.00], [-106.30, 39.25], [-106.08, 38.85], [-106.00, 38.53], [-105.20, 38.45],
  [-104.60, 38.26], [-103.54, 38.00], [-102.60, 38.08], [-102.05, 38.03], [-101.60, 37.98],
  [-100.87, 37.97], [-100.00, 37.75]
];

// Rio Grande from its source down to El Paso
const RIO_GRANDE = [
  [-107.55, 37.79], [-106.93, 37.85], [-106.35, 37.68], [-105.87, 37.47], [-105.73, 37.00],
  [-105.70, 36.40], [-106.07, 36.00], [-106.60, 35.40], [-106.67, 35.10], [-106.75, 34.60],
  [-106.90, 34.06], [-107.00, 33.60], [-107.25, 33.13], [-106.95, 32.70], [-106.85, 32.42]
];
const RIO_GRANDE_LOWER = [[-106.85, 32.42], [-106.78, 32.30], [-106.60, 31.95], [-106.49, 31.76]];

// Northern edge of the Gadsden Purchase: about 32°25'N west from the Rio Grande, then the Gila River to the Colorado
const GILA_LINE = [
  [-106.85, 32.42], [-109.00, 32.42], [-109.10, 32.75], [-109.70, 32.83], [-110.40, 33.17],
  [-110.77, 32.99], [-111.39, 33.03], [-111.70, 33.10], [-112.00, 33.25], [-112.30, 33.38],
  [-112.60, 33.36], [-112.72, 32.95], [-113.20, 32.95], [-113.50, 32.80], [-114.20, 32.78],
  [-114.62, 32.73]
];

const rev = a => a.slice().reverse();
const ring = pts => { const r = pts.slice(); r.push(pts[0]); return r; };

module.exports = {
  // Minnesota east of the Mississippi (part of the 1783 territory)
  mnEast: ring([...MISSISSIPPI_MN, [-95.20, 49.60], [-88.0, 49.60], [-88.0, 43.50]]),
  // Everything east of the Divide / Adams–Onís line (Louisiana Purchase side)
  lpWest: ring([...DIVIDE_N, ...ARKANSAS_LINE, [-100.0, 25.0], [-80.0, 25.0], [-80.0, 49.60]]),
  // Texas claim north and west of today's Texas: the Rio Grande up to its source, then north to 42°N
  texasClaim: ring([
    [-100.0, 30.0], [-100.0, 37.75], ...rev(ARKANSAS_LINE), [-107.55, 42.0], ...RIO_GRANDE,
    ...RIO_GRANDE_LOWER, [-104.0, 29.0]
  ]),
  // Oregon Country: north of 42°N, west of the Divide
  oregon: ring([[-130.0, 42.0], ...rev(DIVIDE_N), [-130.0, 49.60]]),
  // Mexican Cession: south of 42°N, west of the Texas claim, north of the Gila line
  mexicanCession: ring([
    [-131.0, 42.0], [-107.55, 42.0], ...RIO_GRANDE, ...GILA_LINE.slice(1),
    [-114.72, 32.71], [-114.75, 31.0], [-131.0, 31.0]
  ]),
  // Gadsden Purchase: the rest of southern Arizona and New Mexico
  gadsden: ring([[-115.2, 31.0], [-115.2, 32.75], ...rev(GILA_LINE), [-106.4, 32.0], [-106.4, 31.0]]),
  south31: ring([[-92, 24], [-84, 24], [-84, 31], [-92, 31]]),
  north31: ring([[-92, 31], [-84, 31], [-84, 36], [-92, 36]]),
  westOf100: ring([[-104, 33], [-100, 33], [-100, 38], [-104, 38]])
};
