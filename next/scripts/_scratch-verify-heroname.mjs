import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'false');
  localStorage.setItem('qurancodex_book_mode', 'false');
  localStorage.setItem('qurancodex_interlinear_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
  localStorage.setItem('qurancodex_day_mode', 'true');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 150 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'scratch-heroname.png', clip: { x: 0, y: 0, width: 700, height: 700 } });
await browser.close();
