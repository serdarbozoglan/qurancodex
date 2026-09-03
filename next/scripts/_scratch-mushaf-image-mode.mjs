import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();

async function shot(name, showTranslation) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript((showTr) => {
    localStorage.setItem('qurancodex_settings_version', '4');
    localStorage.setItem('qurancodex_mushaf_mode', 'true');
    localStorage.setItem('qurancodex_book_mode', 'true');
    localStorage.setItem('qurancodex_show_translation', showTr ? 'true' : 'false');
    localStorage.setItem('qurancodex_prefer_single_page', 'false');
  }, showTranslation);
  await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `scratch-mushaf-${name}.png`, fullPage: false });
  console.log(name, 'errors:', errors.length);
  errors.forEach((e) => console.log('  ' + e));
  await page.close();
}

await shot('meal-on', true);
await shot('meal-off', false);

await browser.close();
