// marks.jsx — Outlined skyline mark with deco character.
// Three buildings on top of a V (heart-bottom), drawn as a single stroked
// path. Outline only — never fill the silhouette.

const AMBER = '#c9803a';
const CREAM = '#f0ece4';

// Single closed path: clockwise from bottom-left of left building →
// around the three building tops → V back to start. Buildings sit on
// y=0 baseline; V apex at (0, 14). Composition is symmetric around x=0.
//
// Buildings:
//   Left  (x: -16 → -6)  — stepped deco tower with pyramid peak at y=-23
//   Mid   (x: -4 → 2)    — narrower stepped crown peaking at y=-19
//   Right (x: 5 → 16)    — simple block with a stepped corner on the right
const SKY_PATH = [
  // ─ Left tower (stepped deco) ─
  'M -16 0',
  'L -16 -10',     // up main body
  'L -14 -10',     // step in
  'L -14 -16',     // up mid section
  'L -12 -16',     // step in
  'L -12 -20',     // up to pyramid base
  'L -11 -23',     // pyramid peak (centered on building midpoint x=-11)
  'L -10 -20',     // down right side of pyramid
  'L -10 -16',     // down mid section
  'L -8 -16',      // step out
  'L -8 -10',      // down
  'L -6 -10',      // step out
  'L -6 0',        // down to baseline
  // ─ Gap to middle building ─
  'L -4 0',
  // ─ Middle tower (stepped pyramid crown) ─
  'L -4 -14',      // up main body
  'L -3 -14',      // step in
  'L -3 -16',      // up to crown
  'L -1 -19',      // diagonal up to peak (midpoint of -4..2 is -1)
  'L 1 -16',       // diagonal down off peak
  'L 1 -14',       // down
  'L 2 -14',       // step out
  'L 2 0',         // down to baseline
  // ─ Gap to right building ─
  'L 5 0',
  // ─ Right tower (block with stepped corner) ─
  'L 5 -8',        // up
  'L 14 -8',       // across top
  'L 14 -11',      // step up (small set-back at right corner)
  'L 16 -11',      // across stepped top
  'L 16 0',        // down to baseline
  // ─ V (heart-bottom) ─
  'L 0 14',        // diagonal to V apex
  'Z',             // close — back to (-16, 0)
].join(' ');

// Outline mark — the canonical form. Stroke uses non-scaling so the line
// stays at a constant on-screen weight regardless of SVG render size,
// keeping the editorial hairline feel at every scale.
function SkyHeart({ size = 40, color = AMBER, strokeWidth = 1.5, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-22 -26 44 44"
      style={{ display: 'block', ...style }}
    >
      <path
        d={SKY_PATH}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Tiny dot — used as a separator between mono detail tags.
function Dot({ size = 3, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 4 4" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="2" cy="2" r="1.6" fill={color} />
    </svg>
  );
}

Object.assign(window, { SkyHeart, Dot, AMBER, CREAM });
