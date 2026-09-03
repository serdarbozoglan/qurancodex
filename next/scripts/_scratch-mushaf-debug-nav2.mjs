import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
page.on('console', (m) => console.log('BROWSER:', m.type(), m.text()));
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
});
await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

for (let i = 1; i <= 3; i++) {
  const btns = await page.$$('button[aria-label="Sonraki sayfa"]');
  console.log(`step ${i}: found ${btns.length} next-buttons`);
  if (btns.length) {
    const box = await btns[0].boundingBox();
    console.log('  boundingBox:', box);
    await btns[0].click({ force: true });
  }
  await page.waitForTimeout(1000);
  const src = await page.evaluate(() => [...document.querySelectorAll('img')].filter(i => i.src.includes('mushaf-hayrat')).map(i => i.src));
  console.log('  img src:', src);
}

await page.close();
await browser.close();
