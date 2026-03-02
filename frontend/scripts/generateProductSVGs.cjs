/**
 * Generates realistic SVG product images for every product in the GameON catalogue.
 * Run once from the frontend folder: node scripts/generateProductSVGs.js
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const slug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* ─── colour palettes per sport ───────────────────────────────────────── */
const PALETTES = {
  cricket:      { bg: '#1a3a5c', accent: '#e8c84a', light: '#2d5986', icon: '#ffffff' },
  gymnastics:   { bg: '#6b21a8', accent: '#e879f9', light: '#9333ea', icon: '#ffffff' },
  athletics:    { bg: '#c2410c', accent: '#fb923c', light: '#ea580c', icon: '#ffffff' },
  aquatics:     { bg: '#0369a1', accent: '#38bdf8', light: '#0ea5e9', icon: '#ffffff' },
  basketball:   { bg: '#b45309', accent: '#fbbf24', light: '#d97706', icon: '#ffffff' },
  football:     { bg: '#166534', accent: '#4ade80', light: '#16a34a', icon: '#ffffff' },
  tennis:       { bg: '#854d0e', accent: '#86efac', light: '#ca8a04', icon: '#ffffff' },
  cycling:      { bg: '#1e3a8a', accent: '#60a5fa', light: '#2563eb', icon: '#ffffff' },
  weightlifting:{ bg: '#374151', accent: '#9ca3af', light: '#4b5563', icon: '#ffffff' },
  combat:       { bg: '#7f1d1d', accent: '#f87171', light: '#991b1b', icon: '#ffffff' },
  volleyball:   { bg: '#155e75', accent: '#67e8f9', light: '#0e7490', icon: '#ffffff' },
  tabletennis:  { bg: '#4c1d95', accent: '#c4b5fd', light: '#6d28d9', icon: '#ffffff' },
  badminton:    { bg: '#064e3b', accent: '#6ee7b7', light: '#059669', icon: '#ffffff' },
  archery:      { bg: '#451a03', accent: '#fcd34d', light: '#92400e', icon: '#ffffff' },
  hockey:       { bg: '#0c4a6e', accent: '#7dd3fc', light: '#075985', icon: '#ffffff' },
  default:      { bg: '#1e293b', accent: '#94a3b8', light: '#334155', icon: '#ffffff' },
};

/* ─── low-level SVG helpers ────────────────────────────────────────────── */
const card = (p, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${p.bg}"/>
      <stop offset="100%" style="stop-color:${p.light}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#00000066"/></filter>
  </defs>
  <!-- background -->
  <rect width="300" height="300" fill="url(#bg)"/>
  <rect width="300" height="300" fill="url(#shine)"/>
  <!-- subtle grid -->
  <line x1="0" y1="150" x2="300" y2="150" stroke="${p.accent}" stroke-width="0.4" opacity="0.2"/>
  <line x1="150" y1="0" x2="150" y2="300" stroke="${p.accent}" stroke-width="0.4" opacity="0.2"/>
  ${inner}
</svg>`;

const label = (text, p) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach(w => {
    if ((line + ' ' + w).trim().length > 18) { lines.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  });
  lines.push(line.trim());
  const startY = 245 - (lines.length - 1) * 14;
  return lines.map((l, i) =>
    `<text x="150" y="${startY + i * 16}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${p.accent}" letter-spacing="0.5">${l}</text>`
  ).join('\n');
};

const brand = (b, p) =>
  `<text x="150" y="283" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="${p.icon}" opacity="0.6">${b}</text>`;

/* ─── reusable icon shapes ──────────────────────────────────────────────── */
const cricketBat = (p) => `
<g transform="translate(100,55)" filter="url(#shadow)">
  <rect x="40" y="0" width="18" height="90" rx="4" fill="${p.accent}"/>
  <rect x="40" y="85" width="18" height="20" rx="3" fill="${p.icon}" opacity="0.8"/>
  <ellipse cx="49" cy="100" rx="9" ry="5" fill="${p.icon}" opacity="0.5"/>
  <line x1="49" y1="105" x2="49" y2="140" stroke="${p.icon}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
</g>`;

const cricketBall = (p) => `
<g transform="translate(150,140)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="38" fill="#cc2200"/>
  <circle cx="0" cy="0" r="38" fill="none" stroke="#8b0000" stroke-width="2" opacity="0.4"/>
  <path d="M-20,-30 Q0,-10 -20,30" fill="none" stroke="#f5f5dc" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M20,-30 Q0,-10 20,30" fill="none" stroke="#f5f5dc" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M-15,-35 Q0,0 -15,35" fill="none" stroke="#f5f5dc" stroke-width="1.5" stroke-dasharray="3,3" stroke-linecap="round" opacity="0.6"/>
  <path d="M15,-35 Q0,0 15,35" fill="none" stroke="#f5f5dc" stroke-width="1.5" stroke-dasharray="3,3" stroke-linecap="round" opacity="0.6"/>
</g>`;

const glove = (p) => `
<g transform="translate(95,60)" filter="url(#shadow)">
  <rect x="20" y="50" width="70" height="80" rx="15" fill="${p.accent}"/>
  <rect x="20" y="50" width="70" height="25" rx="10" fill="${p.icon}" opacity="0.3"/>
  <rect x="10" y="90" width="20" height="55" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="80" y="90" width="20" height="50" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="25" y="30" width="18" height="30" rx="7" fill="${p.accent}"/>
  <rect x="47" y="20" width="18" height="40" rx="7" fill="${p.accent}"/>
  <rect x="69" y="25" width="18" height="35" rx="7" fill="${p.accent}"/>
  <line x1="40" y1="70" x2="80" y2="70" stroke="${p.light}" stroke-width="2" opacity="0.5"/>
</g>`;

const helmet = (p) => `
<g transform="translate(95,55)" filter="url(#shadow)">
  <ellipse cx="55" cy="80" rx="52" ry="58" fill="${p.accent}"/>
  <ellipse cx="55" cy="80" rx="45" ry="50" fill="${p.light}"/>
  <rect x="3" y="100" width="104" height="18" rx="5" fill="${p.accent}"/>
  <line x1="10" y1="110" x2="100" y2="110" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
  <line x1="10" y1="118" x2="100" y2="118" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
  <!-- grill bars -->
  <rect x="12" y="118" width="86" height="65" rx="4" fill="none" stroke="${p.accent}" stroke-width="3"/>
  <line x1="12" y1="132" x2="98" y2="132" stroke="${p.accent}" stroke-width="2"/>
  <line x1="12" y1="146" x2="98" y2="146" stroke="${p.accent}" stroke-width="2"/>
  <line x1="12" y1="160" x2="98" y2="160" stroke="${p.accent}" stroke-width="2"/>
  <line x1="12" y1="174" x2="98" y2="174" stroke="${p.accent}" stroke-width="2"/>
  <line x1="30" y1="118" x2="30" y2="183" stroke="${p.accent}" stroke-width="2"/>
  <line x1="55" y1="118" x2="55" y2="183" stroke="${p.accent}" stroke-width="2"/>
  <line x1="80" y1="118" x2="80" y2="183" stroke="${p.accent}" stroke-width="2"/>
</g>`;

const pads = (p) => `
<g transform="translate(80,50)" filter="url(#shadow)">
  <rect x="10" y="10" width="55" height="165" rx="20" fill="${p.accent}"/>
  <rect x="15" y="10" width="45" height="165" rx="18" fill="${p.light}"/>
  <rect x="85" y="10" width="55" height="165" rx="20" fill="${p.accent}"/>
  <rect x="90" y="10" width="45" height="165" rx="18" fill="${p.light}"/>
  <!-- straps -->
  <rect x="5" y="50" width="65" height="8" rx="3" fill="${p.accent}"/>
  <rect x="5" y="90" width="65" height="8" rx="3" fill="${p.accent}"/>
  <rect x="5" y="130" width="65" height="8" rx="3" fill="${p.accent}"/>
  <rect x="80" y="50" width="65" height="8" rx="3" fill="${p.accent}"/>
  <rect x="80" y="90" width="65" height="8" rx="3" fill="${p.accent}"/>
  <rect x="80" y="130" width="65" height="8" rx="3" fill="${p.accent}"/>
</g>`;

const stumps = (p) => `
<g transform="translate(60,50)" filter="url(#shadow)">
  <rect x="25" y="20" width="10" height="155" rx="4" fill="${p.accent}"/>
  <rect x="80" y="20" width="10" height="155" rx="4" fill="${p.accent}"/>
  <rect x="135" y="20" width="10" height="155" rx="4" fill="${p.accent}"/>
  <!-- bails -->
  <rect x="20" y="15" width="50" height="10" rx="4" fill="${p.icon}"/>
  <rect x="75" y="15" width="50" height="10" rx="4" fill="${p.icon}"/>
  <!-- ground line -->
  <rect x="10" y="172" width="150" height="6" rx="2" fill="${p.light}"/>
</g>`;

const kitBag = (p) => `
<g transform="translate(60,70)" filter="url(#shadow)">
  <rect x="0" y="30" width="180" height="110" rx="20" fill="${p.accent}"/>
  <rect x="0" y="30" width="180" height="30" rx="15" fill="${p.light}"/>
  <!-- handle -->
  <path d="M60,30 Q90,0 120,30" fill="none" stroke="${p.accent}" stroke-width="10" stroke-linecap="round"/>
  <!-- zip -->
  <line x1="15" y1="58" x2="165" y2="58" stroke="${p.icon}" stroke-width="2" opacity="0.5" stroke-dasharray="5,3"/>
  <!-- logo circle -->
  <circle cx="90" cy="100" r="28" fill="${p.light}" opacity="0.6"/>
  <text x="90" y="106" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="${p.icon}">GO</text>
  <!-- pockets -->
  <rect x="10" y="75" width="30" height="55" rx="8" fill="${p.light}" opacity="0.5"/>
  <rect x="140" y="75" width="30" height="55" rx="8" fill="${p.light}" opacity="0.5"/>
</g>`;

const thighGuard = (p) => `
<g transform="translate(90,55)" filter="url(#shadow)">
  <rect x="10" y="10" width="100" height="170" rx="18" fill="${p.accent}"/>
  <rect x="18" y="10" width="84" height="170" rx="14" fill="${p.light}"/>
  <!-- padding ribs -->
  <rect x="18" y="50"  width="84" height="12" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="18" y="75"  width="84" height="12" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="18" y="100" width="84" height="12" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="18" y="125" width="84" height="12" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="18" y="150" width="84" height="12" rx="4" fill="${p.accent}" opacity="0.5"/>
  <!-- straps -->
  <rect x="5"  y="80"  width="110" height="8" rx="3" fill="${p.accent}"/>
  <rect x="5"  y="130" width="110" height="8" rx="3" fill="${p.accent}"/>
</g>`;

const abGuard = (p) => `
<g transform="translate(95,60)" filter="url(#shadow)">
  <ellipse cx="55" cy="100" rx="52" ry="70" fill="${p.accent}"/>
  <ellipse cx="55" cy="100" rx="42" ry="58" fill="${p.light}"/>
  <!-- inner cup -->
  <ellipse cx="55" cy="100" rx="28" ry="35" fill="${p.accent}" opacity="0.7"/>
  <!-- strap -->
  <rect x="0"  y="85" width="18" height="30" rx="6" fill="${p.accent}" opacity="0.8"/>
  <rect x="92" y="85" width="18" height="30" rx="6" fill="${p.accent}" opacity="0.8"/>
</g>`;

const wkGloves = (p) => `
<g transform="translate(50,55)" filter="url(#shadow)">
  <!-- left glove -->
  <rect x="5"  y="60" width="85" height="95" rx="15" fill="${p.accent}"/>
  <rect x="5"  y="60" width="85" height="28" rx="10" fill="${p.icon}" opacity="0.25"/>
  <rect x="0"  y="105" width="22" height="58" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="73" y="105" width="22" height="52" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="20" y="38"  width="18" height="32" rx="7" fill="${p.accent}"/>
  <rect x="42" y="28"  width="18" height="42" rx="7" fill="${p.accent}"/>
  <rect x="64" y="33"  width="18" height="37" rx="7" fill="${p.accent}"/>
  <!-- right glove -->
  <rect x="110" y="60" width="85" height="95" rx="15" fill="${p.accent}"/>
  <rect x="110" y="60" width="85" height="28" rx="10" fill="${p.icon}" opacity="0.25"/>
  <rect x="105" y="105" width="22" height="52" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="178" y="105" width="22" height="58" rx="8" fill="${p.accent}" opacity="0.9"/>
  <rect x="118" y="38" width="18" height="32" rx="7" fill="${p.accent}"/>
  <rect x="140" y="28" width="18" height="42" rx="7" fill="${p.accent}"/>
  <rect x="162" y="33" width="18" height="37" rx="7" fill="${p.accent}"/>
</g>`;

const basketball = (p) => `
<g transform="translate(150,145)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="60" fill="#e85d04"/>
  <path d="M-60,0 Q-30,-55 0,-60 Q30,-55 60,0" fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <path d="M-60,0 Q-30,55 0,60 Q30,55 60,0"  fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <line x1="-60" y1="0" x2="60" y2="0"   stroke="#1a1a1a" stroke-width="3"/>
  <line x1="0" y1="-60" x2="0" y2="60"   stroke="#1a1a1a" stroke-width="3"/>
</g>`;

const basketball2 = (p) => `
<g transform="translate(150,145)">
  <ellipse cx="0" cy="0" rx="70" ry="35" fill="${p.accent}" opacity="0.25"/>
  <rect x="-18" y="-65" width="8" height="130" rx="3" fill="${p.icon}"/>
  <rect x="10" y="-65" width="8" height="130" rx="3" fill="${p.icon}"/>
  <rect x="-70" y="-15" width="140" height="8" rx="3" fill="${p.icon}"/>
  <rect x="-70" y="8" width="140" height="8" rx="3" fill="${p.icon}"/>
</g>`;

const footballSVG = (p) => `
<g transform="translate(150,145)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="62" fill="#f0f0f0"/>
  <polygon points="0,-40 22,-15 14,18 -14,18 -22,-15" fill="#1a1a1a"/>
  <polygon points="0,-62 24,-50 38,-22 24,6 0,14 -24,6 -38,-22 -24,-50" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <polygon points="30,40 55,25 60,0 38,-22 24,6"  fill="#1a1a1a" opacity="0.5"/>
  <polygon points="-30,40 -55,25 -60,0 -38,-22 -24,6" fill="#1a1a1a" opacity="0.5"/>
</g>`;

const tennisBall = (p) => `
<g transform="translate(150,145)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="55" fill="#ccff00"/>
  <path d="M-55,0 Q-20,-50 20,-50 Q55,-20 55,0" fill="none" stroke="white" stroke-width="5"/>
  <path d="M-55,0 Q-20,50 20,50 Q55,20 55,0"  fill="none" stroke="white" stroke-width="5"/>
</g>`;

const racket = (p) => `
<g transform="translate(80,40)" filter="url(#shadow)">
  <ellipse cx="70" cy="75" rx="60" ry="72" fill="none" stroke="${p.accent}" stroke-width="8"/>
  <!-- strings horizontal -->
  <line x1="12" y1="40"  x2="128" y2="40"  stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="12" y1="55"  x2="128" y2="55"  stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="12" y1="70"  x2="128" y2="70"  stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="12" y1="85"  x2="128" y2="85"  stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="12" y1="100" x2="128" y2="100" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="12" y1="115" x2="128" y2="115" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <!-- strings vertical -->
  <line x1="30"  y1="10" x2="30"  y2="145" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="50"  y1="5"  x2="50"  y2="148" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="70"  y1="3"  x2="70"  y2="148" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="90"  y1="5"  x2="90"  y2="148" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <line x1="110" y1="10" x2="110" y2="145" stroke="${p.accent}" stroke-width="1.5" opacity="0.7"/>
  <!-- handle -->
  <rect x="60" y="144" width="20" height="80" rx="5" fill="${p.accent}"/>
  <rect x="57" y="144" width="26" height="10" rx="3" fill="${p.icon}" opacity="0.4"/>
</g>`;

const bike = (p) => `
<g transform="translate(30,60)" filter="url(#shadow)">
  <!-- wheels -->
  <circle cx="55"  cy="170" r="52" fill="none" stroke="${p.accent}" stroke-width="10"/>
  <circle cx="185" cy="170" r="52" fill="none" stroke="${p.accent}" stroke-width="10"/>
  <circle cx="55"  cy="170" r="8" fill="${p.accent}"/>
  <circle cx="185" cy="170" r="8" fill="${p.accent}"/>
  <!-- spokes -->
  <line x1="55"  y1="118" x2="55"  y2="222" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="3"   y1="170" x2="107" y2="170" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="18"  y1="133" x2="92"  y2="207" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="18"  y1="207" x2="92"  y2="133" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="185" y1="118" x2="185" y2="222" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="133" y1="170" x2="237" y2="170" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="148" y1="133" x2="222" y2="207" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <line x1="148" y1="207" x2="222" y2="133" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
  <!-- frame -->
  <line x1="55"  y1="170" x2="120" y2="90"  stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
  <line x1="120" y1="90"  x2="185" y2="170" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
  <line x1="120" y1="90"  x2="120" y2="50"  stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
  <line x1="55"  y1="120" x2="120" y2="90"  stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
  <!-- saddle / handle -->
  <rect x="105" y="43" width="30" height="8" rx="4" fill="${p.icon}"/>
  <rect x="108" y="35" width="6"  height="15" rx="2" fill="${p.accent}"/>
</g>`;

const barbell = (p) => `
<g transform="translate(30,120)" filter="url(#shadow)">
  <!-- left plates -->
  <rect x="0"  y="-45" width="22" height="90" rx="4" fill="${p.accent}"/>
  <rect x="22" y="-35" width="14" height="70" rx="3" fill="${p.light}"/>
  <!-- bar -->
  <rect x="36" y="-10" width="168" height="20" rx="6" fill="${p.icon}"/>
  <!-- right plates -->
  <rect x="204" y="-35" width="14" height="70" rx="3" fill="${p.light}"/>
  <rect x="218" y="-45" width="22" height="90" rx="4" fill="${p.accent}"/>
  <!-- centre knurl -->
  <rect x="100" y="-10" width="40" height="20" rx="4" fill="${p.accent}" opacity="0.4"/>
</g>`;

const boxingGloves = (p) => `
<g transform="translate(55,50)" filter="url(#shadow)">
  <!-- left glove -->
  <rect x="0"   y="50" width="75" height="100" rx="25" fill="${p.accent}"/>
  <ellipse cx="37" cy="50" rx="37" ry="40" fill="${p.accent}"/>
  <rect x="10" y="148" width="55" height="20" rx="6" fill="${p.icon}" opacity="0.3"/>
  <!-- right glove -->
  <rect x="115" y="50" width="75" height="100" rx="25" fill="${p.accent}"/>
  <ellipse cx="152" cy="50" rx="37" ry="40" fill="${p.accent}"/>
  <rect x="125" y="148" width="55" height="20" rx="6" fill="${p.icon}" opacity="0.3"/>
  <!-- lace lines -->
  <line x1="20" y1="120" x2="66" y2="120" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
  <line x1="20" y1="130" x2="66" y2="130" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
  <line x1="134" y1="120" x2="180" y2="120" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
  <line x1="134" y1="130" x2="180" y2="130" stroke="${p.icon}" stroke-width="2" opacity="0.4"/>
</g>`;

const judoGi = (p) => `
<g transform="translate(60,35)" filter="url(#shadow)">
  <!-- collar v -->
  <polygon points="90,0 60,40 90,55 120,40" fill="${p.icon}" opacity="0.9"/>
  <!-- jacket body -->
  <rect x="10" y="30" width="160" height="130" rx="10" fill="${p.icon}" opacity="0.85"/>
  <!-- sleeves -->
  <rect x="-30" y="25" width="65" height="60" rx="15" fill="${p.icon}" opacity="0.85"/>
  <rect x="145" y="25" width="65" height="60" rx="15" fill="${p.icon}" opacity="0.85"/>
  <!-- belt -->
  <rect x="10" y="155" width="160" height="12" rx="4" fill="${p.accent}"/>
  <text x="90" y="165" text-anchor="middle" font-family="Arial" font-size="9" fill="${p.bg}">IJF</text>
  <!-- pants -->
  <rect x="30" y="165" width="55" height="60" rx="8" fill="${p.icon}" opacity="0.75"/>
  <rect x="95" y="165" width="55" height="60" rx="8" fill="${p.icon}" opacity="0.75"/>
</g>`;

const volleyball2 = (p) => `
<g transform="translate(150,145)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="60" fill="#f0f0f0"/>
  <path d="M-60,0 C-40,-50 40,-50 60,0"   fill="none" stroke="${p.accent}" stroke-width="5"/>
  <path d="M-60,0 C-40,50 40,50 60,0"    fill="none" stroke="${p.accent}" stroke-width="5"/>
  <path d="M0,-60 C30,-30 30,30 0,60"    fill="none" stroke="#1e3a8a" stroke-width="5"/>
  <path d="M0,-60 C-30,-30 -30,30 0,60"  fill="none" stroke="#1e3a8a" stroke-width="5"/>
  <line x1="-60" y1="0" x2="60" y2="0"  stroke="#6b7280" stroke-width="2" opacity="0.4"/>
</g>`;

const tableTennisBat = (p) => `
<g transform="translate(70,45)" filter="url(#shadow)">
  <ellipse cx="90" cy="90" rx="80" ry="85" fill="${p.accent}"/>
  <ellipse cx="90" cy="90" rx="68" ry="73" fill="#cc2222"/>
  <!-- handle -->
  <rect x="75" y="173" width="30" height="65" rx="8" fill="${p.accent}"/>
  <ellipse cx="90" cy="90" rx="15" ry="15" fill="${p.accent}" opacity="0.4"/>
  <!-- brand text -->
  <text x="90" y="96" text-anchor="middle" font-family="Arial" font-size="11" fill="${p.icon}" font-weight="bold" opacity="0.7">PRO</text>
</g>`;

const shuttlecock = (p) => `
<g transform="translate(110,45)" filter="url(#shadow)">
  <!-- base cork -->
  <ellipse cx="40" cy="190" rx="22" ry="18" fill="#e8c84a"/>
  <!-- feather spread -->
  <g opacity="0.9">
    <line x1="40" y1="175" x2="0"  y2="30" stroke="${p.icon}" stroke-width="2"/>
    <line x1="40" y1="175" x2="15" y2="15" stroke="${p.icon}" stroke-width="2"/>
    <line x1="40" y1="175" x2="30" y2="10" stroke="${p.icon}" stroke-width="2"/>
    <line x1="40" y1="175" x2="40" y2="8"  stroke="${p.icon}" stroke-width="2.5"/>
    <line x1="40" y1="175" x2="55" y2="10" stroke="${p.icon}" stroke-width="2"/>
    <line x1="40" y1="175" x2="68" y2="15" stroke="${p.icon}" stroke-width="2"/>
    <line x1="40" y1="175" x2="80" y2="30" stroke="${p.icon}" stroke-width="2"/>
  </g>
  <!-- circular connectors -->
  <ellipse cx="40" cy="95"  rx="28" ry="5" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.7"/>
  <ellipse cx="40" cy="135" rx="22" ry="4" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.7"/>
  <ellipse cx="40" cy="60"  rx="34" ry="5" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.5"/>
</g>`;

const bow = (p) => `
<g transform="translate(60,30)" filter="url(#shadow)">
  <!-- bow curve -->
  <path d="M30,10 C-10,80 -10,160 30,230" fill="none" stroke="${p.accent}" stroke-width="12" stroke-linecap="round"/>
  <!-- string -->
  <line x1="30" y1="10" x2="30" y2="230" stroke="${p.icon}" stroke-width="2"/>
  <!-- arrow -->
  <line x1="30" y1="120" x2="165" y2="120" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
  <polygon points="165,120 150,113 150,127" fill="${p.accent}"/>
  <!-- arrow fletching -->
  <polygon points="35,120 30,113 42,115" fill="${p.accent}" opacity="0.7"/>
  <polygon points="35,120 30,127 42,125" fill="${p.accent}" opacity="0.7"/>
  <!-- grip -->
  <rect x="20" y="105" width="20" height="30" rx="5" fill="${p.light}"/>
</g>`;

const hockeyStick = (p) => `
<g transform="translate(80,25)" filter="url(#shadow)">
  <rect x="60" y="0" width="18" height="180" rx="6" fill="${p.accent}"/>
  <path d="M60,175 Q30,195 10,220 L35,225 Q65,200 78,180" fill="${p.accent}"/>
  <!-- grip tape bands -->
  <rect x="58" y="20"  width="22" height="8"  rx="2" fill="${p.icon}" opacity="0.3"/>
  <rect x="58" y="35"  width="22" height="8"  rx="2" fill="${p.icon}" opacity="0.3"/>
  <rect x="58" y="50"  width="22" height="8"  rx="2" fill="${p.icon}" opacity="0.3"/>
  <!-- ball -->
  <circle cx="130" cy="215" r="22" fill="white"/>
  <circle cx="130" cy="215" r="22" fill="none" stroke="#ccc" stroke-width="1.5"/>
</g>`;

const balanceBeam = (p) => `
<g transform="translate(30,90)" filter="url(#shadow)">
  <!-- beam -->
  <rect x="0" y="55" width="240" height="18" rx="6" fill="${p.accent}"/>
  <!-- legs -->
  <rect x="25"  y="73" width="18" height="60" rx="4" fill="${p.light}"/>
  <rect x="197" y="73" width="18" height="60" rx="4" fill="${p.light}"/>
  <!-- feet -->
  <rect x="15"  y="130" width="38" height="10" rx="4" fill="${p.light}"/>
  <rect x="187" y="130" width="38" height="10" rx="4" fill="${p.light}"/>
  <!-- figure -->
  <circle cx="120" cy="30" r="14" fill="${p.icon}"/>
  <line x1="120" y1="44" x2="120" y2="55" stroke="${p.icon}" stroke-width="4"/>
  <line x1="90"  y1="52" x2="150" y2="40" stroke="${p.icon}" stroke-width="4"/>
  <line x1="108" y1="55" x2="100" y2="78" stroke="${p.icon}" stroke-width="4"/>
  <line x1="132" y1="55" x2="140" y2="78" stroke="${p.icon}" stroke-width="4"/>
</g>`;

const gymRings = (p) => `
<g transform="translate(60,25)" filter="url(#shadow)">
  <line x1="60"  y1="0" x2="60"  y2="60" stroke="${p.icon}" stroke-width="5"/>
  <line x1="120" y1="0" x2="120" y2="60" stroke="${p.icon}" stroke-width="5"/>
  <circle cx="60"  cy="85" r="28" fill="none" stroke="${p.accent}" stroke-width="12"/>
  <circle cx="120" cy="85" r="28" fill="none" stroke="${p.accent}" stroke-width="12"/>
  <circle cx="60"  cy="85" r="16" fill="none" stroke="${p.light}" stroke-width="4"/>
  <circle cx="120" cy="85" r="16" fill="none" stroke="${p.light}" stroke-width="4"/>
  <!-- athlete -->
  <circle cx="90" cy="175" r="14" fill="${p.icon}"/>
  <line x1="90"  y1="189" x2="90"  y2="220" stroke="${p.icon}" stroke-width="4"/>
  <line x1="63"  y1="115" x2="90"  y2="200" stroke="${p.icon}" stroke-width="4"/>
  <line x1="117" y1="115" x2="90"  y2="200" stroke="${p.icon}" stroke-width="4"/>
  <line x1="80"  y1="220" x2="70"  y2="245" stroke="${p.icon}" stroke-width="4"/>
  <line x1="100" y1="220" x2="110" y2="245" stroke="${p.icon}" stroke-width="4"/>
</g>`;

const ribbon = (p) => `
<g transform="translate(120,25)" filter="url(#shadow)">
  <line x1="30" y1="230" x2="30" y2="230" stroke="${p.accent}" stroke-width="3"/>
  <path d="M30,230 C-10,180 60,150 20,100 C-15,55 50,30 30,0" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="30" cy="0" rx="20" ry="8" fill="${p.accent}" opacity="0.6"/>
  <circle cx="30" cy="230" r="6" fill="${p.icon}"/>
  <rect x="25" y="230" width="10" height="30" rx="4" fill="${p.icon}" opacity="0.6"/>
</g>`;

const gymMat = (p) => `
<g transform="translate(20,80)" filter="url(#shadow)">
  <rect x="0" y="0" width="260" height="130" rx="12" fill="${p.accent}"/>
  <rect x="6" y="6" width="248" height="118" rx="8" fill="${p.light}"/>
  <!-- texture lines -->
  <line x1="6"   y1="38" x2="254" y2="38" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
  <line x1="6"   y1="67" x2="254" y2="67" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
  <line x1="6"   y1="96" x2="254" y2="96" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
  <line x1="65"  y1="6"  x2="65"  y2="124" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
  <line x1="131" y1="6"  x2="131" y2="124" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
  <line x1="195" y1="6"  x2="195" y2="124" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
</g>`;

const javelin = (p) => `
<g transform="translate(30,130)" filter="url(#shadow)">
  <line x1="0"   y1="0"   x2="240" y2="0"   stroke="${p.accent}" stroke-width="8"  stroke-linecap="round"/>
  <polygon points="240,0 220,-8 220,8" fill="${p.icon}"/>
  <rect x="80" y="-6" width="50" height="12" rx="4" fill="${p.light}"/>
  <line x1="0" y1="0" x2="20" y2="-14" stroke="${p.accent}" stroke-width="4"/>
  <line x1="0" y1="0" x2="20" y2="14"  stroke="${p.accent}" stroke-width="4"/>
</g>`;

const runningSpikes = (p) => `
<g transform="translate(50,60)" filter="url(#shadow)">
  <!-- shoe body -->
  <path d="M10,130 Q20,80 80,70 Q140,60 180,80 L190,130 Z" fill="${p.accent}"/>
  <path d="M10,130 Q40,145 100,145 Q160,145 190,130 L190,130 Z" fill="${p.light}"/>
  <!-- sole -->
  <rect x="10" y="128" width="180" height="12" rx="4" fill="${p.icon}" opacity="0.5"/>
  <!-- spikes -->
  <line x1="35"  y1="140" x2="35"  y2="165" stroke="${p.icon}" stroke-width="4" stroke-linecap="round"/>
  <line x1="65"  y1="140" x2="65"  y2="165" stroke="${p.icon}" stroke-width="4" stroke-linecap="round"/>
  <line x1="95"  y1="140" x2="95"  y2="165" stroke="${p.icon}" stroke-width="4" stroke-linecap="round"/>
  <line x1="125" y1="140" x2="125" y2="165" stroke="${p.icon}" stroke-width="4" stroke-linecap="round"/>
  <line x1="155" y1="140" x2="155" y2="168" stroke="${p.icon}" stroke-width="4" stroke-linecap="round"/>
  <!-- laces -->
  <line x1="50"  y1="90"  x2="160" y2="90"  stroke="${p.icon}" stroke-width="2" opacity="0.5"/>
  <line x1="55"  y1="100" x2="155" y2="100" stroke="${p.icon}" stroke-width="2" opacity="0.5"/>
  <line x1="60"  y1="110" x2="150" y2="110" stroke="${p.icon}" stroke-width="2" opacity="0.5"/>
</g>`;

const shotPut = (p) => `
<g transform="translate(150,150)" filter="url(#shadow)">
  <circle cx="0" cy="0" r="65" fill="${p.accent}"/>
  <circle cx="-18" cy="-18" r="18" fill="${p.light}" opacity="0.4"/>
  <text x="0" y="8" text-anchor="middle" font-family="Arial" font-size="14" fill="${p.icon}" opacity="0.6">7.26 kg</text>
</g>`;

const jumpMat = (p) => `
<g transform="translate(20,55)" filter="url(#shadow)">
  <!-- pit -->
  <rect x="0" y="60" width="260" height="160" rx="10" fill="${p.accent}"/>
  <rect x="8" y="68" width="244" height="144" rx="6" fill="${p.light}"/>
  <!-- foam blocks -->
  <rect x="15" y="75" width="50" height="50" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="70" y="75" width="50" height="50" rx="4" fill="${p.accent}" opacity="0.6"/>
  <rect x="125" y="75" width="50" height="50" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="180" y="75" width="60" height="50" rx="4" fill="${p.accent}" opacity="0.6"/>
  <rect x="15" y="130" width="70" height="50" rx="4" fill="${p.accent}" opacity="0.6"/>
  <rect x="90" y="130" width="70" height="50" rx="4" fill="${p.accent}" opacity="0.5"/>
  <rect x="165" y="130" width="75" height="50" rx="4" fill="${p.accent}" opacity="0.6"/>
  <!-- bar -->
  <rect x="0" y="50" width="260" height="12" rx="4" fill="${p.icon}" opacity="0.8"/>
  <rect x="0" y="40" width="10" height="30" rx="3" fill="${p.icon}" opacity="0.6"/>
  <rect x="250" y="40" width="10" height="30" rx="3" fill="${p.icon}" opacity="0.6"/>
</g>`;

const swimsuit = (p) => `
<g transform="translate(70,30)" filter="url(#shadow)">
  <!-- torso -->
  <rect x="40" y="40" width="80" height="130" rx="15" fill="${p.accent}"/>
  <!-- shoulder straps -->
  <rect x="48" y="10" width="18" height="50" rx="6" fill="${p.accent}"/>
  <rect x="94" y="10" width="18" height="50" rx="6" fill="${p.accent}"/>
  <!-- front panel -->
  <rect x="48" y="55" width="64" height="100" rx="8" fill="${p.light}" opacity="0.5"/>
  <!-- logo area -->
  <text x="80" y="115" text-anchor="middle" font-family="Arial" font-size="11" fill="${p.icon}" font-weight="bold">FINA</text>
</g>`;

const goggles = (p) => `
<g transform="translate(50,85)" filter="url(#shadow)">
  <ellipse cx="75"  cy="70" rx="65" ry="50" fill="${p.accent}"/>
  <ellipse cx="75"  cy="70" rx="52" ry="38" fill="${p.bg}" opacity="0.8"/>
  <ellipse cx="75"  cy="70" rx="52" ry="38" fill="${p.light}" opacity="0.4"/>
  <ellipse cx="125" cy="70" rx="65" ry="50" fill="${p.accent}"/>
  <ellipse cx="125" cy="70" rx="52" ry="38" fill="${p.bg}" opacity="0.8"/>
  <ellipse cx="125" cy="70" rx="52" ry="38" fill="${p.light}" opacity="0.4"/>
  <!-- strap -->
  <rect x="0" y="58" width="200" height="24" rx="10" fill="${p.accent}" opacity="0.5"/>
  <!-- nose bridge -->
  <rect x="73" y="60" width="54" height="18" rx="6" fill="${p.accent}"/>
</g>`;

const fins = (p) => `
<g transform="translate(35,40)" filter="url(#shadow)">
  <!-- left fin -->
  <path d="M10,130 Q0,60 40,20 Q80,-5 90,50 L90,130 Z" fill="${p.accent}"/>
  <path d="M10,130 Q0,60 40,20 Q80,-5 90,50 L90,130 Z" fill="${p.light}" opacity="0.4"/>
  <!-- foot pocket -->
  <rect x="15" y="110" width="72" height="35" rx="10" fill="${p.bg}" opacity="0.6"/>
  <!-- right fin -->
  <path d="M125,130 Q115,60 155,20 Q195,-5 205,50 L205,130 Z" fill="${p.accent}"/>
  <path d="M125,130 Q115,60 155,20 Q195,-5 205,50 L205,130 Z" fill="${p.light}" opacity="0.4"/>
  <rect x="130" y="110" width="72" height="35" rx="10" fill="${p.bg}" opacity="0.6"/>
</g>`;

const pullBuoy = (p) => `
<g transform="translate(55,65)" filter="url(#shadow)">
  <ellipse cx="95" cy="70"  rx="85" ry="52" fill="${p.accent}"/>
  <ellipse cx="95" cy="165" rx="85" ry="52" fill="${p.accent}"/>
  <rect x="55" y="68" width="80" height="99" rx="5" fill="${p.light}" opacity="0.3"/>
  <!-- strap in middle -->
  <rect x="80" y="115" width="30" height="12" rx="4" fill="${p.icon}" opacity="0.7"/>
</g>`;

const cycHelmet = (p) => `
<g transform="translate(60,30)" filter="url(#shadow)">
  <ellipse cx="90" cy="90" rx="88" ry="70" fill="${p.accent}"/>
  <!-- vents -->
  <rect x="25" y="50"  width="18" height="45" rx="7" fill="${p.bg}" opacity="0.6"/>
  <rect x="51" y="40"  width="18" height="55" rx="7" fill="${p.bg}" opacity="0.6"/>
  <rect x="77" y="35"  width="18" height="60" rx="7" fill="${p.bg}" opacity="0.6"/>
  <rect x="103" y="35" width="18" height="60" rx="7" fill="${p.bg}" opacity="0.6"/>
  <rect x="129" y="40" width="18" height="55" rx="7" fill="${p.bg}" opacity="0.6"/>
  <rect x="155" y="50" width="18" height="45" rx="7" fill="${p.bg}" opacity="0.6"/>
  <!-- brim -->
  <rect x="2" y="130" width="176" height="22" rx="6" fill="${p.light}"/>
  <!-- straps -->
  <line x1="30"  y1="152" x2="10"  y2="185" stroke="${p.accent}" stroke-width="4"/>
  <line x1="150" y1="152" x2="170" y2="185" stroke="${p.accent}" stroke-width="4"/>
  <rect x="78" y="175" width="24" height="12" rx="4" fill="${p.accent}"/>
</g>`;

const cycShoes = (p) => `
<g transform="translate(40,60)" filter="url(#shadow)">
  <path d="M10,130 Q15,70 90,55 Q160,45 195,75 L205,130 Z" fill="${p.accent}"/>
  <path d="M10,130 Q50,150 110,150 Q170,150 205,130" fill="${p.light}"/>
  <!-- sole  -->
  <rect x="10" y="128" width="195" height="14" rx="4" fill="${p.icon}" opacity="0.4"/>
  <!-- cleat -->
  <rect x="85" y="138" width="45" height="18" rx="4" fill="${p.icon}"/>
  <rect x="92" y="141" width="10" height="12" rx="2" fill="${p.accent}"/>
  <rect x="108" y="141" width="10" height="12" rx="2" fill="${p.accent}"/>
  <!-- boa dial -->
  <circle cx="155" cy="95" r="16" fill="${p.light}"/>
  <circle cx="155" cy="95" r="10" fill="${p.accent}"/>
</g>`;

const liftBelt = (p) => `
<g transform="translate(35,70)" filter="url(#shadow)">
  <rect x="0" y="30" width="230" height="100" rx="18" fill="${p.accent}"/>
  <rect x="6" y="36" width="218" height="88" rx="14" fill="${p.light}" opacity="0.35"/>
  <!-- stitching -->
  <rect x="6"  y="36" width="218" height="10" rx="4" fill="${p.icon}" opacity="0.15"/>
  <rect x="6"  y="114" width="218" height="10" rx="4" fill="${p.icon}" opacity="0.15"/>
  <!-- buckle -->
  <rect x="96" y="10" width="38" height="40" rx="6" fill="${p.icon}" opacity="0.7"/>
  <rect x="105" y="18" width="20" height="24" rx="4" fill="${p.light}"/>
</g>`;

const tkdGear = (p) => `
<g transform="translate(35,30)" filter="url(#shadow)">
  <!-- chest protector -->
  <rect x="45" y="40" width="140" height="130" rx="18" fill="${p.accent}"/>
  <!-- neck guard -->
  <rect x="80" y="28" width="70" height="22" rx="8" fill="${p.accent}"/>
  <!-- shin guard L -->
  <rect x="5"  y="180" width="44" height="90" rx="12" fill="${p.light}"/>
  <!-- shin guard R -->
  <rect x="181" y="180" width="44" height="90" rx="12" fill="${p.light}"/>
  <!-- helmet -->
  <ellipse cx="115" cy="15" rx="50" ry="22" fill="${p.light}"/>
  <!-- logos -->
  <text x="115" y="112" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="${p.icon}" opacity="0.5">WTF</text>
</g>`;

const kneePads = (p) => `
<g transform="translate(65,45)" filter="url(#shadow)">
  <!-- left -->
  <rect x="0"   y="20" width="68" height="200" rx="20" fill="${p.accent}"/>
  <ellipse cx="34" cy="110" rx="28" ry="30" fill="${p.light}" opacity="0.5"/>
  <!-- right -->
  <rect x="102" y="20" width="68" height="200" rx="20" fill="${p.accent}"/>
  <ellipse cx="136" cy="110" rx="28" ry="30" fill="${p.light}" opacity="0.5"/>
</g>`;

const balls6 = (p) =>  `
<g filter="url(#shadow)">
  <circle cx="75"  cy="100" r="35" fill="#f87171"/>
  <circle cx="150" cy="100" r="35" fill="#f87171"/>
  <circle cx="225" cy="100" r="35" fill="#f87171"/>
  <circle cx="75"  cy="175" r="35" fill="#f87171"/>
  <circle cx="150" cy="175" r="35" fill="#f87171"/>
  <circle cx="225" cy="175" r="35" fill="#f87171"/>
  <line x1="75" y1="65" x2="75" y2="135" stroke="#1a1a1a" stroke-width="2" opacity="0.3"/>
  <line x1="40" y1="100" x2="110" y2="100" stroke="#1a1a1a" stroke-width="2" opacity="0.3"/>
</g>`;

/* ─── mapping: product name → SVG inner content ────────────────────────── */
const PRODUCTS = [
  // Gymnastics
  { name: 'Professional Balance Beam',   pal: 'gymnastics',   svg: (p) => balanceBeam(p) },
  { name: 'Gymnastic Rings Set',         pal: 'gymnastics',   svg: (p) => gymRings(p) },
  { name: 'Rhythmic Gymnastics Ribbon',  pal: 'gymnastics',   svg: (p) => ribbon(p) },
  { name: 'Gymnastics Mat 4x8ft',        pal: 'gymnastics',   svg: (p) => gymMat(p) },
  // Athletics
  { name: 'Carbon Fiber Javelin',        pal: 'athletics',    svg: (p) => javelin(p) },
  { name: 'Competition Running Spikes',  pal: 'athletics',    svg: (p) => runningSpikes(p) },
  { name: 'Shot Put 7.26kg',             pal: 'athletics',    svg: (p) => shotPut(p) },
  { name: 'High Jump Landing Mat',       pal: 'athletics',    svg: (p) => jumpMat(p) },
  // Aquatics
  { name: 'Competition Swimsuit',        pal: 'aquatics',     svg: (p) => swimsuit(p) },
  { name: 'Swimming Goggles Pro',        pal: 'aquatics',     svg: (p) => goggles(p) },
  { name: 'Training Fins',               pal: 'aquatics',     svg: (p) => fins(p) },
  { name: 'Pull Buoy Set',               pal: 'aquatics',     svg: (p) => pullBuoy(p) },
  // Basketball
  { name: 'Official Basketball',         pal: 'basketball',   svg: (p) => basketball(p) },
  { name: 'Basketball Shoes High-Top',   pal: 'basketball',   svg: (p) => runningSpikes(p) },
  { name: 'Adjustable Basketball Hoop',  pal: 'basketball',   svg: (p) => basketball2(p) },
  // Football
  { name: 'Match Football Size 5',       pal: 'football',     svg: (p) => footballSVG(p) },
  { name: 'Football Cleats',             pal: 'football',     svg: (p) => runningSpikes(p) },
  { name: 'Goalkeeper Gloves Pro',       pal: 'football',     svg: (p) => glove(p) },
  // Tennis
  { name: 'Professional Tennis Racket',  pal: 'tennis',       svg: (p) => racket(p) },
  { name: 'Tennis Ball Can (3 balls)',   pal: 'tennis',       svg: (p) => tennisBall(p) },
  { name: 'Tennis Shoes Clay Court',     pal: 'tennis',       svg: (p) => runningSpikes(p) },
  // Cycling
  { name: 'Road Bike Carbon Frame',      pal: 'cycling',      svg: (p) => bike(p) },
  { name: 'Cycling Helmet Aero',         pal: 'cycling',      svg: (p) => cycHelmet(p) },
  { name: 'Cycling Shoes Clipless',      pal: 'cycling',      svg: (p) => cycShoes(p) },
  // Weightlifting
  { name: 'Olympic Barbell 20kg',        pal: 'weightlifting',svg: (p) => barbell(p) },
  { name: 'Bumper Plates Set',           pal: 'weightlifting',svg: (p) => barbell(p) },
  { name: 'Weightlifting Belt',          pal: 'weightlifting',svg: (p) => liftBelt(p) },
  // Combat
  { name: 'Boxing Gloves 16oz',          pal: 'combat',       svg: (p) => boxingGloves(p) },
  { name: 'Judo Gi White',               pal: 'combat',       svg: (p) => judoGi(p) },
  { name: 'Taekwondo Sparring Gear',     pal: 'combat',       svg: (p) => tkdGear(p) },
  // Volleyball
  { name: 'Indoor Volleyball',           pal: 'volleyball',   svg: (p) => volleyball2(p) },
  { name: 'Volleyball Knee Pads',        pal: 'volleyball',   svg: (p) => kneePads(p) },
  // Table Tennis
  { name: 'Professional Table Tennis Bat',  pal: 'tabletennis',  svg: (p) => tableTennisBat(p) },
  { name: 'Table Tennis Balls 3-Star',      pal: 'tabletennis',  svg: (p) => balls6(p) },
  // Badminton
  { name: 'Carbon Badminton Racket',     pal: 'badminton',    svg: (p) => racket(p) },
  { name: 'Feather Shuttlecocks',        pal: 'badminton',    svg: (p) => shuttlecock(p) },
  // Archery
  { name: 'Recurve Bow 70"',             pal: 'archery',      svg: (p) => bow(p) },
  { name: 'Carbon Arrows Set of 12',     pal: 'archery',      svg: (p) => javelin(p) },
  // Hockey
  { name: 'Field Hockey Stick Composite',pal: 'hockey',       svg: (p) => hockeyStick(p) },
  { name: 'Hockey Ball Official',         pal: 'hockey',       svg: (p) => tennisBall(p) },
  // Cricket
  { name: 'English Willow Cricket Bat',  pal: 'cricket',      svg: (p) => cricketBat(p) },
  { name: 'Kashmir Willow Cricket Bat',  pal: 'cricket',      svg: (p) => cricketBat(p) },
  { name: 'Cricket Ball Leather Red',    pal: 'cricket',      svg: (p) => cricketBall(p) },
  { name: 'Cricket Ball Leather White',  pal: 'cricket',      svg: (p) => {
    const pp = { ...p, accent: '#f0f0f0', light: '#2d5986', icon: '#ffffff' };
    return cricketBall(pp).replace('fill="#cc2200"', 'fill="#f0f0f0"').replace(/fill="#8b0000"/g, 'fill="#aaaaaa"').replace(/fill="#f5f5dc"/g, 'fill="#e85d04"');
  }},
  { name: 'Batting Gloves Professional', pal: 'cricket',      svg: (p) => glove(p) },
  { name: 'Wicket Keeping Gloves',       pal: 'cricket',      svg: (p) => wkGloves(p) },
  { name: 'Cricket Pads Leg Guards',     pal: 'cricket',      svg: (p) => pads(p) },
  { name: 'Cricket Helmet with Grill',   pal: 'cricket',      svg: (p) => helmet(p) },
  { name: 'Cricket Thigh Guard',         pal: 'cricket',      svg: (p) => thighGuard(p) },
  { name: 'Cricket Abdominal Guard',     pal: 'cricket',      svg: (p) => abGuard(p) },
  { name: 'Cricket Stumps Set',          pal: 'cricket',      svg: (p) => stumps(p) },
  { name: 'Cricket Kit Bag',             pal: 'cricket',      svg: (p) => kitBag(p) },
];

let created = 0;
for (const product of PRODUCTS) {
  const p = PALETTES[product.pal] || PALETTES.default;
  const inner = product.svg(p) + '\n' + label(product.name, p) + '\n' + brand('GameON', p);
  const svgContent = card(p, inner);
  const filename = slug(product.name) + '.svg';
  fs.writeFileSync(path.join(outDir, filename), svgContent, 'utf8');
  console.log(`✅ ${filename}`);
  created++;
}

console.log(`\n✔ Generated ${created} product SVG images → ${outDir}`);
