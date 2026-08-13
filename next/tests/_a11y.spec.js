import { test } from '@playwright/test';
test('aria-label eksik Arapça ögeler', async ({ page }) => {
  await page.goto('/tr', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-revealed')));
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('[dir="rtl"],[lang="ar"]')) {
      if (el.getAttribute('aria-label')) continue;
      const sec = el.closest('section[id],div[id]');
      const k = (sec ? sec.id : '(id yok)') + ' :: ' + el.tagName;
      out[k] = (out[k] || 0) + 1;
    }
    return out;
  });
  Object.entries(r).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log('  ' + String(v).padStart(3) + ' x ' + k));
  console.log('  TOPLAM =', Object.values(r).reduce((a,b)=>a+b,0));
});
