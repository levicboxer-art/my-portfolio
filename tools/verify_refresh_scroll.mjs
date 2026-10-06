/**
 * Verifies: after scrolling deep into the page, a refresh (reload) starts the
 * visitor back at the very first screen (scrollY === 0) instead of restoring
 * the previous offset. Uses the system Google Chrome browser (playwright-core
 * ships without bundled browsers).
 *
 * Usage: node tools/verify_refresh_scroll.mjs   (preview server must be up)
 */
import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:4173/';
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. Initial load must begin at the first screen.
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);
const initial = await page.evaluate(() => window.scrollY);

// 2. Scroll all the way to the last chapter.
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(800);
const before = await page.evaluate(() => window.scrollY);

// 3. Refresh — must come back at the top, not resume mid-page.
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2500);
const after = await page.evaluate(() => window.scrollY);

await browser.close();

console.log(JSON.stringify({ initial, before, after }, null, 2));
const pass = initial === 0 && before > 500 && after === 0;
console.log(pass ? 'PASS: refresh restarts from the first screen' : 'FAIL');
process.exit(pass ? 0 : 1);
