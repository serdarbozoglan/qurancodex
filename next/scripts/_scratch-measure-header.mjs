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
  function findByText(txt) {
    const all = [...document.querySelectorAll('div,span')];
    return all.find(el => el.textContent.trim() === txt || el.textContent.includes(txt));
  }
  const labelAr = [...document.querySelectorAll('div')].find(el => el.textContent.trim().startsWith('السُّورَةُ'));
  const labelTr = [...document.querySelectorAll('div')].find(el => el.textContent.trim().startsWith('SÛRE') || el.textContent.trim().startsWith('SURAH'));
  const heroAr = [...document.querySelectorAll('div')].find(el => el.textContent.trim() === 'الأعراف');
  const heroTr = [...document.querySelectorAll('div')].find(el => el.textContent.trim() === "EL-A'RÂF" || el.textContent.trim() === "EL-A'RAF");
  const metaAr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('النُّزُول'));
  const metaTr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('NÜZUL'));
  const besmeleAr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('بِسْمِ اللَّهِ'));
  const besmeleTr = [...document.querySelectorAll('div')].find(el => el.textContent.includes('Rahmân ve Rahîm'));
  function top(el) { return el ? Math.round(el.getBoundingClientRect().top) : null; }
  return {
    labelAr: top(labelAr), labelTr: top(labelTr),
    heroAr: top(heroAr), heroTr: top(heroTr),
    metaAr: top(metaAr), metaTr: top(metaTr),
    besmeleAr: top(besmeleAr), besmeleTr: top(besmeleTr),
    heroTextAr: heroAr?.textContent, heroTextTr: heroTr?.textContent,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
