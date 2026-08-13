import { test } from '@playwright/test';
test('platform adi dogru mu', async ({ page }) => {
  for (const [slug, bekle] of [['iki-nedensellik','Substack'], ['tugyan','Medium']]) {
    await page.goto(`/tr/tefekkur/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const t = await page.evaluate(() => document.body.innerText);
    const sub = /Substack/.test(t), med = /Medium/.test(t);
    console.log(`  ${slug.padEnd(18)} beklenen=${bekle} · sayfada Substack=${sub} Medium=${med}`);
  }
});
