// Anasayfa ölçüm turu — puanlamayı koddan değil GERÇEK RENDER'dan çıkarmak için.
// Kalıcı bir regresyon testi değil; ölçüm aracı. İstenirse silinebilir.
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  test(`anasayfa ölçüm — ${vp.name}`, async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/tr', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200); // animasyon/hydration otursun

    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const secs = [...document.querySelectorAll('section[id], div[id]')]
        .filter(el => el.id && el.getBoundingClientRect().height > 120)
        .map(el => ({ id: el.id, h: Math.round(el.getBoundingClientRect().height) }));
      // yatay taşma yapan ögeler
      const overflow = [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > doc.clientWidth + 1)
        .slice(0, 6)
        .map(el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} → ${Math.round(el.getBoundingClientRect().right)}px`);
      return {
        scrollHeight: doc.scrollHeight,
        clientWidth: doc.clientWidth,
        hasHorizontalScroll: doc.scrollWidth > doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        sections: secs,
        buttons: document.querySelectorAll('button').length,
        buttonsNoLabel: [...document.querySelectorAll('button')]
          .filter(b => !b.getAttribute('aria-label') && !(b.innerText || '').trim()).length,
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('h2').length,
        h3: document.querySelectorAll('h3').length,
      };
    });

    console.log(`\n──── ${vp.name} ────`);
    console.log(`sayfa yüksekliği : ${m.scrollHeight}px  (~${(m.scrollHeight / vp.height).toFixed(1)} ekran)`);
    console.log(`yatay kaydırma   : ${m.hasHorizontalScroll ? 'VAR ❌ (' + m.scrollWidth + ' > ' + m.clientWidth + ')' : 'yok ✓'}`);
    if (m.hasHorizontalScroll) console.log('  taşan ögeler:', JSON.stringify(m.sectionsOverflow || [], null, 1));
    console.log(`başlıklar        : h1=${m.h1} h2=${m.h2} h3=${m.h3}`);
    console.log(`buton            : ${m.buttons} (metinsiz+etiketsiz: ${m.buttonsNoLabel})`);
    console.log(`console error    : ${errors.length}`);
    errors.slice(0, 5).forEach(e => console.log('   ! ' + e.slice(0, 160)));
    console.log('bölüm yükseklikleri:');
    m.sections.forEach(s => console.log(`   ${String(s.h).padStart(5)}px  ${s.id}`));

    await page.screenshot({ path: `test-results/home-${vp.name}.png`, fullPage: false });
    await page.screenshot({ path: `test-results/home-${vp.name}-full.png`, fullPage: true });

    expect(m.h1, 'tam olarak bir h1 olmalı').toBe(1);
  });
}
