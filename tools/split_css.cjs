// One-off tool: partition src/index.css into src/styles/*.css modules.
// Ranges are 1-based inclusive line numbers verified against the original file
// (1868 lines). Every boundary sits on a blank line / comment start, so no CSS
// rule is ever cut in half. Import order in src/index.css preserves the
// original cascade order exactly.
const fs = require('fs');

const lines = fs.readFileSync('src/index.css', 'utf8').split('\n');
const get = (a, b) => lines.slice(a - 1, b).join('\n').replace(/\s+$/, '');

// Replaces the Tailwind Preflight that lived on lines 2-4 (being removed).
const RESET = `/* Minimal reset — parity with the removed Tailwind Preflight */
*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: currentColor; }
html { line-height: 1.5; -webkit-text-size-adjust: 100%; }
body { line-height: inherit; }
h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd { margin: 0; }
ul, ol { margin: 0; padding: 0; list-style: none; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
img, video { max-width: 100%; height: auto; }
button, input, optgroup, select, textarea { font: inherit; color: inherit; margin: 0; padding: 0; background: transparent; }
button { cursor: pointer; }
.text-center { text-align: center; }`;

const parts = [
  ['curtain.css', 84, 188],
  ['portrait.css', 189, 708],
  ['layout.css', 709, 856],
  ['intro-responsive.css', 857, 918],
  ['experience.css', 919, 1190],
  ['projects.css', 1191, 1468],
  ['certifications.css', 1469, 1811],
  ['responsive.css', 1812, 1868],
];

fs.mkdirSync('src/styles', { recursive: true });

// base.css = font import (line 1) + reset block + original lines 5-83
fs.writeFileSync('src/styles/base.css', get(1, 1) + '\n\n' + RESET + '\n\n' + get(5, 83) + '\n');

for (const [name, a, b] of parts) {
  fs.writeFileSync('src/styles/' + name, get(a, b) + '\n');
}

const covered = 1 + (83 - 5 + 1) + parts.reduce((n, [, a, b]) => n + (b - a + 1), 0);
console.log(`covered ${covered} of ${lines.length} source lines (excluded: 3 @tailwind lines)`);
console.log(`base.css`.padEnd(24), `--`);
for (const [name, a, b] of parts) {
  const first = get(a, b).split('\n')[0].slice(0, 56);
  console.log(name.padEnd(24), String(b - a + 1).padStart(5) + ' lines | ' + first);
}
