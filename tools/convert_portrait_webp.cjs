// One-off tool: convert the master portrait PNG to an optimized WebP.
// The master PNG lives in tools/assets-master/ (copy it to public/images/
// first if re-converting). Re-run with:  npm i -D sharp && node tools/convert_portrait_webp.cjs
const sharp = require('sharp');

(async () => {
  const out = 'public/images/portrait.webp';
  const info = await sharp('public/images/portrait.png')
    .webp({ quality: 85, effort: 6 })
    .toFile(out);
  console.log(`portrait.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
})().catch((e) => { console.error(e); process.exit(1); });
