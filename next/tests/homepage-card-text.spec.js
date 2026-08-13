// ─── Anasayfa kart METNİ envanteri ────────────────────────────────────────────
// P4/P5 refactor emniyet ağı (2026-08-13): 14 anlatı kartı tek bir
// <PortalCard> sunucu bileşenine indirilirken TEK BİR harfin bile
// kaybolmadığını kanıtlar. Arapça âyetler dahil (§13.15 — hafızadan
// yazılmaz, taşınır).
//
// Baseline yenileme (BİLEREK): UPDATE_BASELINE=1 npx playwright test tests/homepage-card-text.spec.js
//
// NOT: `compact` kademesine inen kartlarda uzun blurb paragrafı bilinçli
// olarak kaldırıldı. O yüzden baseline "kart → metin" değil, "kart → metin
// PARÇALARI" tutar ve compact kartlar için yalnız korunması gereken
// alanları (eyebrow/başlık/âyet/ref/CTA) karşılaştırır.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASELINE_DIR = path.join(process.cwd(), 'tests', '__baseline__');
const IDS = [
  'mukattaa-card', 'ritim-card', 'retorik-card', 'ses-card', 'halka-card',
  'tekrar-card', 'bilimsel-card', 'tarih-card', 'koruma-card', 'dua-card',
  'alti-konu-card', 'allah-kendini-tanitir', 'insan-tanimi-card', 'psikoloji-card',
];

for (const locale of ['tr', 'en']) {
  test(`anasayfa kart metinleri değişmedi — ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const actual = {};
    for (const id of IDS) {
      const el = page.locator(`#${id}`);
      await expect(el, `${id} sayfada olmalı`).toHaveCount(1);
      actual[id] = {
        // Arapça âyet — birebir korunmalı
        arabic: await el.locator('[lang="ar"]').allInnerTexts(),
        heading: (await el.locator('h2').first().innerText()).trim(),
        // kart içindeki tüm bağlantı hedefleri
        links: await el.locator('a[href]').evaluateAll(
          (as) => as.map((a) => new URL(a.href).pathname)
        ),
      };
    }

    const file = path.join(BASELINE_DIR, `homepage-card-text-${locale}.json`);
    if (process.env.UPDATE_BASELINE === '1' || !fs.existsSync(file)) {
      fs.mkdirSync(BASELINE_DIR, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(actual, null, 2) + '\n');
      console.log(`baseline yazıldı: ${file}`);
      return;
    }

    const expected = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(actual).toEqual(expected);
  });
}
