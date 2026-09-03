import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
});
await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

// Click the "next page" chevron overlay button 3 times: 0 -> 1 -> 2 -> 3
for (let i = 0; i < 3; i++) {
  const nextBtn = await page.$('button[aria-label="Sonraki sayfa"]');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(600); }
  else console.log('next button not found at step', i);
}
await page.screenshot({ path: 'scratch-mushaf-page3.png' });

const nextBtn2 = await page.$('button[aria-label="Sonraki sayfa"]');
if (nextBtn2) { await nextBtn2.click(); await page.waitForTimeout(600); }
await page.screenshot({ path: 'scratch-mushaf-page4.png' });

console.log('errors:', errors.length);
errors.forEach((e) => console.log('  ' + e));
await page.close();
await browser.close();
