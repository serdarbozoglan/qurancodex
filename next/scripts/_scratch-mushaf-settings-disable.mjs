import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1200);

// Open settings gear
const gear = await page.$('button[title*="Ayarlar"]');
console.log('gear found?', !!gear);
if (gear) { await gear.click(); await page.waitForTimeout(400); }

const kariBtn = await page.evaluateHandle(() => {
  return [...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('Kari') || b.textContent.includes('Kâri'));
});
const kariEl = kariBtn.asElement();
console.log('kari button found?', !!kariEl);
if (kariEl) { await kariEl.click(); await page.waitForTimeout(400); }

const info = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const tajweedBtn = btns.find(b => b.textContent.includes('Tecvid Renkleri'));
  const karaokeBtn = btns.find(b => b.textContent.trim().includes('Karaoke'));
  return {
    tajweed: tajweedBtn ? { disabled: tajweedBtn.disabled, opacity: getComputedStyle(tajweedBtn).opacity, text: tajweedBtn.textContent } : null,
    karaoke: karaokeBtn ? { disabled: karaokeBtn.disabled, opacity: getComputedStyle(karaokeBtn).opacity, text: karaokeBtn.textContent } : null,
  };
});
console.log(JSON.stringify(info, null, 2));
console.log('errors:', errors.length);
errors.forEach(e => console.log(' ', e));
await browser.close();
