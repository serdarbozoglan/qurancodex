import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();

async function measure(label, localStorageSetup, selectorMeal, selectorArabic) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(localStorageSetup);
  await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(([selMeal]) => {
    function info(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        background: cs.backgroundImage !== 'none' ? cs.backgroundImage : cs.backgroundColor,
        borderRadius: cs.borderRadius,
        borderColor: cs.borderColor,
        boxShadow: cs.boxShadow,
      };
    }
    const meal = document.querySelector(selMeal);
    // Arabic-side badge: an inline-flex span, fully round, whose text is
    // Arabic-Indic digits (٠-٩).
    const candidates = [...document.querySelectorAll('span')].filter(el => {
      const t = (el.textContent || '').trim();
      if (!/^[٠-٩]+$/.test(t)) return false;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display.includes('flex') && r.width > 0 && cs.borderRadius === '50%';
    });
    const ar = candidates[0] || null;
    return { meal: info(meal), arabic: info(ar), arabicCandidateCount: candidates.length };
  }, [selectorMeal]);

  console.log(`\n=== ${label} ===`);
  console.log('meal  :', JSON.stringify(result.meal));
  console.log('arabic:', JSON.stringify(result.arabic), 'candidates:', result.arabicCandidateCount);
  if (errors.length) { console.log('errors:', errors); }
  await page.close();
  return result;
}

// Kitap mode — page 175 (Surah 7 area), meal on
await measure(
  'KITAP',
  () => {
    localStorage.setItem('qurancodex_settings_version', '4');
    localStorage.setItem('qurancodex_mushaf_mode', 'false');
    localStorage.setItem('qurancodex_book_mode', 'true');
    localStorage.setItem('qurancodex_interlinear_mode', 'false');
    localStorage.setItem('qurancodex_show_translation', 'true');
    localStorage.setItem('qurancodex_day_mode', 'false');
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
  },
  'button[aria-label*="mealleri karşılaştır"]',
  'span[lang="ar"] ~ * , span'
);

// Ayet mode
await measure(
  'AYET',
  () => {
    localStorage.setItem('qurancodex_settings_version', '4');
    localStorage.setItem('qurancodex_mushaf_mode', 'false');
    localStorage.setItem('qurancodex_book_mode', 'false');
    localStorage.setItem('qurancodex_interlinear_mode', 'false');
    localStorage.setItem('qurancodex_show_translation', 'true');
    localStorage.setItem('qurancodex_day_mode', 'false');
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
  },
  'button[aria-label*="mealleri karşılaştır"]',
  null
);

// Kirik Meal (interlinear) mode
await measure(
  'KIRIK MEAL',
  () => {
    localStorage.setItem('qurancodex_settings_version', '4');
    localStorage.setItem('qurancodex_mushaf_mode', 'false');
    localStorage.setItem('qurancodex_book_mode', 'false');
    localStorage.setItem('qurancodex_interlinear_mode', 'true');
    localStorage.setItem('qurancodex_show_translation', 'true');
    localStorage.setItem('qurancodex_day_mode', 'false');
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 7, page: 175 }));
  },
  'button[aria-label*="mealleri karşılaştır"]',
  null
);

await browser.close();
