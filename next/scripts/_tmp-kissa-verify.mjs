import { chromium } from 'playwright';
import { CONTRAST_PROBE } from '/Users/serdar/Developer/01_qurancodex/qurancodex/next/tests/lib/contrast.mjs';

const BASE_URL = 'http://localhost:3000';
const browser = await chromium.launch();

for (const locale of ['tr', 'en']) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await page.goto(BASE_URL + `/${locale}/atlas/kissa`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(1600);
  const violations = await page.evaluate(CONTRAST_PROBE);
  console.log(`\n=== ${locale} — ${violations.length} violations ===`);
  const grouped = {};
  for (const v of violations) {
    const key = `${v.color}|${v.opacity}|${v.fontSize}`;
    grouped[key] = (grouped[key] || 0) + 1;
  }
  for (const [k, c] of Object.entries(grouped)) {
    console.log(`  ${c}x  ${k}`);
  }
  if (violations.length > 0 && violations.length <= 10) {
    for (const v of violations) console.log(JSON.stringify(v));
  }
  await page.close();
}

await browser.close();
