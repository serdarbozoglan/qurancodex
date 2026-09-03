import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });

await page.addInitScript(() => {
  localStorage.setItem('qurancodex_settings_version', '4');
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'true');
});
await page.goto(BASE + '/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

async function logImgSrc(label) {
  const src = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].filter(i => i.src.includes('mushaf-hayrat'));
    return imgs.map(i => i.src);
  });
  console.log(label, '-> img src(s):', src);
}

await logImgSrc('initial');

for (let i = 1; i <= 4; i++) {
  const nextBtn = await page.$('button[aria-label="Sonraki sayfa"]');
  if (!nextBtn) { console.log('no next button at step', i); break; }
  await nextBtn.click();
  await page.waitForTimeout(1000);
  await logImgSrc(`after click ${i}`);
}

await page.close();
await browser.close();
