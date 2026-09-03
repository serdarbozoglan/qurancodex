import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();

const samplePages = [0, 1, 2, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 603, 604];
let anyFail = false;

for (const target of samplePages) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.addInitScript((p) => {
    localStorage.setItem('qurancodex_settings_version', '4');
    localStorage.setItem('qurancodex_mushaf_mode', 'true');
    localStorage.setItem('qurancodex_book_mode', 'true');
    localStorage.setItem('qurancodex_show_translation', 'false');
    localStorage.setItem('qurancodex_prefer_single_page', 'true');
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: 1, page: p }));
  }, target);

  const res = await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);

  const info = await page.evaluate(() => {
    const img = document.querySelector('img[src*="mushaf-hayrat"]');
    const stripBtns = [...document.querySelectorAll('button')].filter(b => /^\d+$/.test(b.textContent.trim()) && b.getAttribute('aria-label')?.includes(':'));
    return {
      imgSrc: img?.src || null,
      imgComplete: img?.complete || false,
      imgNaturalWidth: img?.naturalWidth || 0,
      stripCount: stripBtns.length,
    };
  });

  const expectedSrc = `mushaf-hayrat/${target}.webp`;
  const srcOk = info.imgSrc?.includes(expectedSrc);
  const imgOk = info.imgNaturalWidth > 100;
  const ok = res.status() === 200 && srcOk && imgOk && errors.length === 0;
  if (!ok) anyFail = true;
  console.log(
    `page ${target}: http=${res.status()} src_ok=${srcOk} img_natural_w=${info.imgNaturalWidth} strip_verses=${info.stripCount} errors=${errors.length}`,
    ok ? '' : '  <-- CHECK'
  );
  errors.forEach(e => console.log('    ' + e));
  await page.close();
}

await browser.close();
console.log(anyFail ? '\n=> Some pages need attention.' : '\n=> All sampled pages OK.');
