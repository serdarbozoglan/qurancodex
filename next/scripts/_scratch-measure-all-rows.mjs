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
  // Reset any custom font-size overrides so we measure the TRUE default state.
  localStorage.removeItem('qurancodex_arabic_font_size');
  localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 150 }));
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  function isVisible(el) {
    return !!(el.offsetParent || el.getClientRects().length);
  }
  function findByExact(txt) {
    return [...document.querySelectorAll('div')].find(el => el.children.length === 0 && el.textContent.trim() === txt && isVisible(el));
  }
  function findByIncludes(txt) {
    return [...document.querySelectorAll('div')].find(el => el.children.length === 0 && el.textContent.includes(txt) && isVisible(el));
  }
  const debugHero = [...document.querySelectorAll('div')].filter(el => el.children.length === 0 && (el.textContent.includes('RÂF') || el.textContent.includes('أعراف'))).map(el => ({ text: el.textContent, visible: isVisible(el), top: el.getBoundingClientRect().top }));
  const labelTr = findByIncludes('SÛRE 7');
  const labelAr = findByIncludes('السُّورَةُ');
  const heroTr = findByExact("EL-A'RÂF");
  const heroAr = findByExact('الأعراف');
  const metaTr = findByIncludes('NÜZUL');
  const metaAr = findByIncludes('النُّزُول');
  const besmeleTr = findByExact("Rahmân ve Rahîm olan Allah'ın adıyla");
  const besmeleAr = findByIncludes('بِسْمِ اللَّهِ');
  function top(el) { return el ? Math.round(el.getBoundingClientRect().top * 100) / 100 : null; }
  function fontSize(el) { return el ? getComputedStyle(el).fontSize : null; }
  const rows = { labelTr, labelAr, heroTr, heroAr, metaTr, metaAr, besmeleTr, besmeleAr };
  const out = {};
  for (const [k, el] of Object.entries(rows)) out[k] = { top: top(el), fontSize: fontSize(el), found: !!el };
  out.deltas = {
    label: (out.labelAr.top ?? 0) - (out.labelTr.top ?? 0),
    hero: (out.heroAr.top ?? 0) - (out.heroTr.top ?? 0),
    meta: (out.metaAr.top ?? 0) - (out.metaTr.top ?? 0),
    besmele: (out.besmeleAr.top ?? 0) - (out.besmeleTr.top ?? 0),
  };
  out.debugHero = debugHero;
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
