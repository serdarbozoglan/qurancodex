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
const VERSE_1_MEAL = 'Yüce Rabbinin adını,';      // 87:1 meali (Suat Yıldırım, varsayılan)
const VERSE_3_MEAL = 'Takdir edip yol gösteren,'; // 87:3 — öncesi ve sonrası ayet var

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

// Regresyon — 2026-07-31 kullanıcı raporu: "ayet bitince öbürüne geçiyormuş
// gibi oluyor ve sayfa zıplıyor ileri ve geri". Kök neden: sınır karesinde
// highlight kodu tick'ten önce çalışıp setActiveVerse(N+1) ateşliyordu.
// Oturum boyunca aktif ayet vurgusu pencerede SABİT kalmalı.
test('vurgu pencere dışına taşmaz (sayfa zıplamaz)', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  await page.getByText(VERSE_3_MEAL).click();
  await page.waitForTimeout(1200);   // tıklama kaynaklı scroll otursun

  // Arapça sütunda ARKA PLANI OLAN (vurgulu) metinleri sürekli örnekle —
  // aktif ayetin gerçek görsel imzası budur.
  await page.evaluate(() => {
    window.__hi = [];
    window.__tick = setInterval(() => {
      Array.from(document.querySelectorAll('span,div')).forEach(e => {
        const bg = getComputedStyle(e).backgroundColor;
        if (!bg || bg === 'rgba(0, 0, 0, 0)') return;
        const t = (e.textContent || '').trim();
        if (t.length > 2 && t.length < 60 && /[ء-ي]/.test(t)) window.__hi.push(t);
      });
    }, 120);
  });

  await panel.getByRole('button', { name: 'Başlat' }).click();
  for (let i = 0; i < 70; i++) {
    await page.waitForTimeout(500);
    if (i > 4 && await panel.getByRole('button', { name: 'Başlat' }).isVisible().catch(() => false)) break;
  }
  const seen = await page.evaluate(() => { clearInterval(window.__tick); return window.__hi; });

  expect(seen.length, 'vurgu örneklenebilmeli').toBeGreaterThan(10);
  // 87:4'ün ayırt edici kelimesi (اَخْرَجَ / الْمَرْعٰى). Düzeltme öncesi
  // sınır karesinde setActiveVerse(87:4) ateşleniyordu ve bu kelimeler
  // vurgulanıyordu — sayfa ileri-geri zıplamasının kök nedeni.
  const leaked = seen.filter(t => /اَخْرَجَ|الْمَرْعٰى/.test(t));
  expect(leaked, 'ezber penceresi dışındaki ayet vurgulanmamalı').toEqual([]);
});

// Regresyon — 2026-07-31 kullanıcı raporu: "ayet sonunda teyp kapanışı gibi
// bir ses" + "ikinci ayetin ilk harfinin bir kısmı duyuluyor".
// Kök neden: qdc damgaları BİTİŞİK (to === sonraki from; A'lâ'da 19/19 ayette
// boşluk 0 ms), sınır `to`da olunca rAF granülerliği yüzünden sonraki ayete
// taşıyor ve sert pause() tık üretiyordu.
// Beklenen: duraklama `to`dan ÖNCE ve volume 0'a rampalanmış olarak gerçekleşir,
// ayetin ortası ise tam sesle çalar.
test('duraklama ayet sınırını aşmaz ve sesi rampayla keser', async ({ page }) => {
  const TO_87_3 = 11050;   // qdc damgası — Meşarî/87

  await openSurah(page);
  await page.evaluate(() => {
    window.__ev = []; window.__ts = [];
    const Orig = window.Audio;
    window.Audio = function (...a) {
      const el = new Orig(...a);
      el.addEventListener('pause', () => window.__ev.push({ ct: el.currentTime * 1000, v: el.volume }));
      window.__a = el;
      return el;
    };
    setInterval(() => {
      const a = window.__a;
      if (a && !a.paused) window.__ts.push([a.currentTime * 1000, a.volume]);
    }, 50);
  });

  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await page.getByText(VERSE_3_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  for (let i = 0; i < 70; i++) {
    await page.waitForTimeout(500);
    if (i > 4 && await panel.getByRole('button', { name: 'Başlat' }).isVisible().catch(() => false)) break;
  }

  const { ev, ts } = await page.evaluate(() => ({ ev: window.__ev, ts: window.__ts }));

  // (a) Taşma yok — her duraklama ayetin `to` damgasından önce.
  const endPauses = ev.filter(x => x.ct > 9000);
  expect(endPauses.length, 'tekrar döngüsü duraklamaları gözlenmeli').toBeGreaterThan(0);
  for (const x of endPauses) {
    expect(x.ct, `duraklama ${Math.round(x.ct)}ms — sonraki ayete taşıyor`).toBeLessThanOrEqual(TO_87_3);
  }

  // (b) Kesmeden önce rampa çalışmış — ses ZAMAN SERİSİNDEN ölçülür.
  // `pause` olayındaki volume'e BAKILMAZ: olay asenkron dispatch edilir ve
  // oturum sonunda stopAudio → restoreVolume(1) araya girip 1 okutur. Ses
  // fiilen rampalanmıştır; doğru ölçüm noktası çalma anındaki son örneklerdir.
  const tail = ts.filter(([ct]) => ct > TO_87_3 - 250 && ct <= TO_87_3);
  expect(tail.length, 'ayet kuyruğu örneklenebilmeli').toBeGreaterThan(0);
  expect(
    Math.min(...tail.map(([, v]) => v)),
    'kesmeden önce ses 0\'a rampalanmalı (aksi halde tık sesi)',
  ).toBeLessThan(0.2);

  // Ayetin ORTASI tam sesle çalmalı — fade-in çalışmazsa burası kısık kalır
  const mid = ts.filter(([ct]) => ct > 8200 && ct < 10500);
  expect(mid.length, 'ayet ortası örneklenebilmeli').toBeGreaterThan(10);
  expect(mid.filter(([, v]) => v < 0.9), 'ayet ortasında ses kısılmamalı').toEqual([]);
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
