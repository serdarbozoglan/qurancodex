import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle' });

const marks = [400, 1500, 3400, 3800]; // absolute ms since goto resolved
let prev = 0;
for (const m of marks) {
  await page.waitForTimeout(m - prev);
  prev = m;
  await page.screenshot({ path: `scratch-toast-${m}ms.png` });
}
console.log('errors:', errors.length);
errors.forEach(e => console.log(' ', e));
await browser.close();
