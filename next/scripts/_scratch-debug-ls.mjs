import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.addInitScript(() => {
  localStorage.setItem('qurancodex_mushaf_mode', 'true');
  localStorage.setItem('qurancodex_book_mode', 'true');
  localStorage.setItem('qurancodex_show_translation', 'false');
  localStorage.setItem('qurancodex_prefer_single_page', 'false');
});
await page.goto('http://localhost:4321/tr/oku', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
const ls = await page.evaluate(() => ({
  mushaf: localStorage.getItem('qurancodex_mushaf_mode'),
  book: localStorage.getItem('qurancodex_book_mode'),
  trans: localStorage.getItem('qurancodex_show_translation'),
  single: localStorage.getItem('qurancodex_prefer_single_page'),
  innerWidth: window.innerWidth,
}));
console.log(ls);
await page.close();
await browser.close();
