import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'false');
  localStorage.setItem('qurancodex_prefer_single_page', 'false');
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
const btn = await page.$('button[aria-label="1:3"]');
console.log('found button for 1:3?', !!btn);
if (btn) {
  await btn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'scratch-mushaf-strip-clicked.png', clip: { x: 1000, y: 1120, width: 600, height: 60 } });
}
console.log('errors:', errors.length);
errors.forEach(e => console.log(' ', e));
await page.close();
await browser.close();
