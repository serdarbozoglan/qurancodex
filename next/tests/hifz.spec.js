// ─── Ezber modu (Faz 1) — uçtan uca doğrulama ───────────────────────────────
// A'lâ sûresi (87) üzerinde tek ayet A–B tekrarını gerçek tarayıcıda sınar.
//
// Ses <audio> DOM elementi DEĞİL — ReadingMode `new Audio()` ile imperatif
// oluşturur. Testler window.Audio'yu sarmalayıp örneği yakalar; böylece
// currentTime'ın pencere içinde kalıp geri sardığı doğrudan ölçülebilir.
// A–B döngüsünün gözlemlenebilir imzası budur.
//
// Gerçek CDN'e (qurancdn/everyayah) bağımlıdır — ağ yoksa atlanır.
// Çalıştırma: dev server ayaktayken `npx playwright test tests/hifz.spec.js`
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

const SURAH = 87;                          // A'lâ — kısa, ezber için tipik
const VERSE_1_MEAL = 'Yüce Rabbinin adını,'; // 87:1 meali (Suat Yıldırım, varsayılan)

async function openSurah(page) {
  await page.goto(`/tr/oku/${SURAH}`);
  await expect(page.getByRole('button', { name: /^Ezber$/ })).toBeVisible({ timeout: 30_000 });
}

// window.Audio'yu sarmala — imperatif ses örneklerini test'e görünür kıl.
async function instrumentAudio(page) {
  await page.evaluate(() => {
    window.__aud = [];
    const Orig = window.Audio;
    window.Audio = function (...a) { const el = new Orig(...a); window.__aud.push(el); return el; };
  });
}

const audioState = (page) => page.evaluate(() => {
  const a = (window.__aud || []).find(x => !x.paused) || (window.__aud || [])[0];
  return a ? { ct: a.currentTime, paused: a.paused } : null;
});

test('toolbar butonu paneli açar, tekrar ön ayarları görünür', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();

  const panel = page.getByRole('region', { name: 'Ezber' });
  await expect(panel).toBeVisible();

  for (const n of ['3', '5', '7', '10']) {
    await expect(panel.getByRole('button', { name: n, exact: true })).toBeVisible();
  }
  // Varsayılan tekrar sayısı 5
  await expect(panel.getByRole('button', { name: '5', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('ayet seçilince Başlat etkinleşir', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await page.getByText(VERSE_1_MEAL).click();
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeEnabled({ timeout: 10_000 });
});

test('A–B döngüsü: ses pencereye geri sarar, sayaç ilerler, hedefte durur', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await openSurah(page);
  await instrumentAudio(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();  // test süresi kısalsın
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  const bar = panel.getByRole('progressbar', { name: 'Tekrar' });
  await expect(bar).toBeVisible({ timeout: 20_000 });
  await expect(bar).toHaveAttribute('aria-valuemax', '3');

  // Ses gerçekten ilerliyor mu (CDN ulaşılabilir mi)
  await expect.poll(async () => (await audioState(page))?.ct ?? 0, { timeout: 20_000 })
    .toBeGreaterThan(0.5);

  // Zirve currentTime'ı izle: pencerenin sonuna varıp başa dönmeli.
  // Geri sarma = ölçülen ct'nin bir öncekinden BELİRGİN küçülmesi.
  let peak = 0, wrapped = false;
  for (let i = 0; i < 40 && !wrapped; i++) {
    await page.waitForTimeout(500);
    const s = await audioState(page);
    if (!s) continue;
    if (s.ct + 1 < peak) wrapped = true;     // en az 1 sn geri gitti → geri sarma
    peak = Math.max(peak, s.ct);
  }
  expect(wrapped, 'ses pencere sonunda başa geri sarmalı').toBe(true);

  // Sayaç ilerledi mi
  await expect.poll(async () => Number(await bar.getAttribute('aria-valuenow')), { timeout: 60_000 })
    .toBeGreaterThan(0);

  // Hedefe ulaşınca oturum biter → panel boşta duruma döner
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeVisible({ timeout: 90_000 });

  expect(errors.filter(e => !/favicon|manifest/i.test(e))).toEqual([]);
});

test('Durdur oturumu sonlandırır ve sesi keser', async ({ page }) => {
  await openSurah(page);
  await instrumentAudio(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();
  await expect(panel.getByRole('button', { name: 'Durdur' })).toBeVisible({ timeout: 20_000 });

  await panel.getByRole('button', { name: 'Durdur' }).click();
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeVisible();

  // Nefes payı timer'ı temizlenmeli — durdurduktan sonra ses geri BAŞLAMAMALI.
  // (400ms'lik pauseMs'in iki katından fazlasını bekle.)
  await page.waitForTimeout(1500);
  expect((await audioState(page))?.paused, 'durdurulduktan sonra ses çalmamalı').toBe(true);
});
