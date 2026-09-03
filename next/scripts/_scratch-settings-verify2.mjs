import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'false');
  localStorage.setItem('qurancodex_book_mode', 'false');
  localStorage.setItem('qurancodex_interlinear_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'false');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1200);
const gear = await page.$('button[title*="Ayarlar"]');
if (gear) { await gear.click(); await page.waitForTimeout(400); }

const info = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const tajweedBtn = btns.find(b => b.textContent.includes('Tecvid Renkleri'));
  const kitapModuBtn = btns.find(b => b.textContent.trim().startsWith('Kitap Modu') || b.textContent.trim().startsWith('Kitap\nModu'));
  function summarize(b) {
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { disabled: b.disabled, opacity: getComputedStyle(b).opacity, height: Math.round(r.height), text: b.textContent.replace(/\s+/g,' ').trim() };
  }
  return { tajweed: summarize(tajweedBtn), kitapModu: summarize(kitapModuBtn) };
});
console.log(JSON.stringify(info, null, 2));
console.log('errors:', errors.length);
errors.forEach(e => console.log(' ', e));
await page.screenshot({ path: 'scratch-settings-kirikmeal.png', fullPage: true });
await browser.close();
