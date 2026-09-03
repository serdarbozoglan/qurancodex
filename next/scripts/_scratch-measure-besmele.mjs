import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
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

const info = await page.evaluate(() => {
  const besmeleAr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('بِسْمِ اللَّهِ') && el.children.length === 0);
  const besmeleTr = [...document.querySelectorAll('div')].find(el => el.textContent.trim() === 'Rahmân ve Rahîm olan Allah\'ın adıyla');
  const metaAr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('النُّزُول'));
  const metaTr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('NÜZUL'));
  function rect(el) { return el ? el.getBoundingClientRect() : null; }
  const csAr = besmeleAr ? getComputedStyle(besmeleAr) : null;
  return {
    besmeleAr: rect(besmeleAr), besmeleTr: rect(besmeleTr),
    metaAr: rect(metaAr), metaTr: rect(metaTr),
    besmeleArStyle: csAr ? { fontSize: csAr.fontSize, lineHeight: csAr.lineHeight, marginTop: csAr.marginTop, marginBottom: csAr.marginBottom, whiteSpace: csAr.whiteSpace } : null,
    besmeleArHTML: besmeleAr ? besmeleAr.outerHTML.slice(0, 400) : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
