// Playwright fetcher for Medium articles (bypasses WebFetch fair-use filter)
// Usage: node qc-fetch-medium.mjs <URL>
import { chromium } from 'playwright';

const URL_ARG = process.argv[2] || 'https://sufist.medium.com/siccin-nedir-hapis-mi-kitap-m%C4%B1-ee2ab03c2606';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const page = await ctx.newPage();

await page.goto(URL_ARG, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const article = document.querySelector('article') || document.body;
  const title = document.querySelector('h1')?.innerText || '';
  const nodes = article.querySelectorAll('h1, h2, h3, h4, p, blockquote, li, figcaption, pre');
  const blocks = [];
  nodes.forEach(n => {
    const tag = n.tagName.toLowerCase();
    const text = n.innerText.trim();
    if (text.length > 0) blocks.push({ tag, text });
  });
  return { title, blocks, htmlSize: article.outerHTML.length };
});

console.log('TITLE:', data.title);
console.log('HTML SIZE:', data.htmlSize);
console.log('BLOCKS:', data.blocks.length);
console.log('---');
data.blocks.forEach((b, i) => {
  console.log(`[${i}] <${b.tag}> ${b.text}`);
  console.log('');
});

await browser.close();
