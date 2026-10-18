// Flat illustrations for blog share images (og:image). Drawn in code so they
// are free to use, consistent in style, and regenerate for every new post.
// Shapes only, no <text>: the SVGs are rasterised without access to fonts.

const INK = "#1F2937";
const CREAM = "#FBF7EF";
const GREEN = "#2F855A";
const GOLD = "#D69E2E";
const GOLD_LIGHT = "#F6E05E";
const TERRACOTTA = "#C05621";
const BLUE_LIGHT = "#BEE3F8";

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${body}</svg>`;

const coin = (cx, cy, r = 22) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${GOLD_LIGHT}" stroke="${GOLD}" stroke-width="5"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="none" stroke="${GOLD}" stroke-width="3"/>`;

const coinStack = (x, baseY, count) =>
  Array.from({ length: count }, (_, i) => {
    const y = baseY - i * 18;
    return (
      `<ellipse cx="${x}" cy="${y + 6}" rx="44" ry="14" fill="${GOLD}"/>` +
      `<ellipse cx="${x}" cy="${y}" rx="44" ry="14" fill="${GOLD_LIGHT}" stroke="${GOLD}" stroke-width="4"/>`
    );
  }).join("");

const envelope = (x, y, w, h, fill, rotate) =>
  `<g transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})">` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${INK}" stroke-width="6"/>` +
  `<path d="M${x} ${y + 8} L${x + w / 2} ${y + h * 0.58} L${x + w} ${y + 8}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  `</g>`;

export const MOTIFS = {
  jar: svg(
    `<rect x="130" y="58" width="140" height="34" rx="8" fill="${GREEN}" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M140 92 h120 v18 c40 18 50 44 50 80 v130 c0 26 -20 42 -46 42 h-128 c-26 0 -46 -16 -46 -42 v-130 c0 -36 10 -62 50 -80 z" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      coinStack(200, 330, 5) +
      coin(160, 236, 20) +
      coin(240, 222, 20) +
      coin(205, 186, 20) +
      `<path d="M120 170 c-6 30 -6 70 0 110" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.8"/>`
  ),
  envelopes: svg(
    envelope(52, 150, 190, 128, BLUE_LIGHT, -12) +
      envelope(158, 122, 190, 128, GOLD_LIGHT, 8) +
      envelope(104, 214, 190, 128, CREAM, -2) +
      coin(300, 92, 26) +
      coin(338, 132, 18)
  ),
  house: svg(
    `<path d="M70 196 L200 82 L330 196" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M98 180 L200 92 L302 180 V330 H98 Z" fill="${CREAM}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M70 196 L200 82 L330 196 L314 210 L200 112 L86 210 Z" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<rect x="176" y="250" width="50" height="80" rx="4" fill="${GREEN}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="120" y="222" width="42" height="42" rx="4" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="240" y="222" width="42" height="42" rx="4" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="250" y="104" width="26" height="50" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="6"/>` +
      `<line x1="60" y1="334" x2="340" y2="334" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      coin(330, 280, 24)
  ),
  chart: svg(
    `<line x1="60" y1="330" x2="350" y2="330" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      `<line x1="64" y1="70" x2="64" y2="330" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      `<rect x="96" y="250" width="44" height="80" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="160" y="208" width="44" height="122" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="224" y="160" width="44" height="170" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="288" y="104" width="44" height="226" rx="6" fill="${GREEN}" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M96 214 L178 168 L238 124 L318 64" fill="none" stroke="${TERRACOTTA}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M290 60 L322 62 L316 94" fill="none" stroke="${TERRACOTTA}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  fees: svg(
    `<line x1="60" y1="330" x2="350" y2="330" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      `<line x1="64" y1="70" x2="64" y2="330" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      `<rect x="96" y="110" width="44" height="220" rx="6" fill="${GREEN}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="160" y="160" width="44" height="170" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="224" y="208" width="44" height="122" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="288" y="250" width="44" height="80" rx="6" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M100 74 L180 120 L246 164 L318 212" fill="none" stroke="${TERRACOTTA}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M286 214 L320 214 L312 182" fill="none" stroke="${TERRACOTTA}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      coin(352, 96, 18) +
      coin(330, 150, 14)
  ),
  coins: svg(
    coinStack(118, 330, 3) +
      coinStack(212, 330, 6) +
      coinStack(306, 330, 9) +
      `<line x1="56" y1="350" x2="360" y2="350" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
      coin(110, 120, 30)
  ),
  scales: svg(
    `<line x1="200" y1="70" x2="200" y2="320" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M140 340 h120 l-20 -24 h-80 z" fill="${GREEN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<line x1="80" y1="112" x2="320" y2="96" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
      `<circle cx="200" cy="104" r="14" fill="${GOLD}" stroke="${INK}" stroke-width="6"/>` +
      `<line x1="88" y1="112" x2="60" y2="210" stroke="${INK}" stroke-width="4"/>` +
      `<line x1="88" y1="112" x2="116" y2="210" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M44 210 h88 c0 30 -20 44 -44 44 s-44 -14 -44 -44 z" fill="${GOLD_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      `<line x1="312" y1="96" x2="284" y2="194" stroke="${INK}" stroke-width="4"/>` +
      `<line x1="312" y1="96" x2="340" y2="194" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M268 194 h88 c0 30 -20 44 -44 44 s-44 -14 -44 -44 z" fill="${BLUE_LIGHT}" stroke="${INK}" stroke-width="6"/>` +
      coin(88, 192, 16) +
      `<rect x="292" y="160" width="40" height="30" rx="4" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="5"/>`
  ),
};

export const DEFAULT_MOTIF = "jar";

// First matching rule wins, so the more specific topics come first.
const RULES = [
  ["fees", /fees/],
  ["house", /mortgage|property|afford|home/],
  ["envelopes", /budget|envelope|sinking|50-30-20|balance|lifestyle-creep|below-your-means|operating-system|taking-control|keeping-what-you-earn/],
  ["chart", /invest|dividend|index|portfolio|platform-fees|rebalanc|owning-a-piece|net-worth|pension|lifetime|stability|wealth/],
  ["jar", /sav|safety-net|emergency|freedom-fund|isa|fscs|10-percent|protect/],
  ["coins", /debt|credit|inflation|money-is-made|fiat|bretton|gold|hard-assets|heavy-money|barter|invisible-tax/],
  ["scales", /price|trade|profit|economics|choice|wage|earn|reward|borders|purpose|numbers/],
];

export function motifForPost(id, override) {
  if (override && Object.hasOwn(MOTIFS, override)) return override;
  const match = RULES.find(([, pattern]) => pattern.test(id));
  return match ? match[0] : DEFAULT_MOTIF;
}
