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
  localStorage.setItem('qurancodex_interlinear_mode', 'false');
  localStorage.setItem('qurancodex_show_translation', 'true');
  localStorage.setItem('qurancodex_day_mode', 'true');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 150 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
const gear = await page.$('button[title*="Ayarlar"]');
console.log('gear found?', !!gear);
if (gear) { await gear.click(); await page.waitForTimeout(300); }
const allBtnTexts = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(Boolean));
console.log('button texts:', JSON.stringify(allBtnTexts));
const wordBtn = await page.evaluateHandle(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Kelime Modu')));
const wordEl = wordBtn.asElement();
console.log('word mode button found?', !!wordEl);
if (wordEl) { await wordEl.click(); await page.waitForTimeout(300); }
const closeBtn = await page.$('button[aria-label="Ayarları kapat"], button[title*="Kapat"]');
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(500);
const text = await page.evaluate(() => document.body.innerText.includes('كِتَٰبٌ') || document.body.innerHTML.includes('بِهِ.'));
console.log('still has raw artifact text?', text);
const found = await page.evaluate(() => {
  const html = document.body.innerHTML;
  return { hasDot: /بِهِ\./.test(html), hasDoubleFatha: /كِتَٰبٌ/.test(html) };
});
console.log(JSON.stringify(found));
await page.screenshot({ path: 'scratch-araf-wordmode.png', fullPage: false });
console.log('errors:', errors.length);
errors.forEach(e => console.log(' ', e));
await browser.close();
