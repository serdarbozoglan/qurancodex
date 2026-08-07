// ─── Ezber modu — uçtan uca doğrulama ───────────────────────────────────────
// A'lâ sûresi (87) üzerinde A–B tekrarını ve kartopu programını gerçek
// tarayıcıda sınar.
//
// ⚠ Tek-adım davranışını ölçen testler otomatik ilerlemeyi KAPATIR
// (`disableAuto`). Açıkken adım bitince programa devam edilir — bu doğru
// davranıştır ama tek pencerelik ölçümü bozar.
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

// Tek adımı izole et — otomatik ilerleme kapalıysa adım bitince oturum durur.
async function disableAuto(panel) {
  // Alt sayfa tasarımında (2026-08-02) gerçek bir anahtar: role=switch.
  const sw = panel.getByRole('switch');
  if ((await sw.getAttribute('aria-checked')) === 'true') await sw.click();
  await expect(sw).toHaveAttribute('aria-checked', 'false');
}

// Panelin görünen metni — adım etiketi, konum ve geçiş bilgisini içerir.
const panelText = (panel) => panel.innerText();

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
  await disableAuto(panel);
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
  await disableAuto(panel);
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

// Regresyon — 2026-08-02 mimari değişikliği: ezber AYET AYET dosya çalar.
// Önceki üç sürüm tek sûre mp3'ünü ortasından kesmeye çalışıyordu ve her
// seferinde ya kuyruk kırpılıyordu ya sonraki ayet sızıyordu (kullanıcı
// raporları: "teyp kapanışı gibi ses", "ikinci ayetin ilk harfi duyuluyor",
// "başka bir harf sesi truncate edilmiş gibi"). Ayet dosyaları kendi
// sessizlikleriyle başlayıp bittiği için kesme diye bir işlem KALMADI.
//
// Değişmez: çalınan her ses kaynağı TEK ayetin dosyası olmalı ve doğal
// sonuna kadar çalmalı. Sûre mp3'ü (…/qdc/…/87.mp3) ezberde KULLANILMAZ.
test('ezberde ÇALAN ses hep ayet dosyasıdır, sûre mp3\'i çalmaz', async ({ page }) => {
  await openSurah(page);
  // Her audio örneğinin `play` olayını kaynağıyla birlikte kaydet.
  // Ölçüt "sûre elementi oluşturulmasın" DEĞİL — karaoke katmanı kendi
  // işini yapabilir; ölçüt ezber sırasında ONUN ÇALMAMASI.
  await page.evaluate(() => {
    window.__played = [];
    const Orig = window.Audio;
    window.Audio = function (...a) {
      const el = new Orig(...a);
      el.addEventListener('play', () => window.__played.push(el.currentSrc || el.src || a[0] || ''));
      return el;
    };
  });

  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await disableAuto(panel);
  await page.getByText(VERSE_3_MEAL).click();
  await page.evaluate(() => { window.__played = []; });   // seçim öncesini ele
  await panel.getByRole('button', { name: 'Başlat' }).click();

  await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeVisible({ timeout: 90_000 });

  const played = await page.evaluate(() => window.__played);
  expect(played.length, 'ses çalınmalı').toBeGreaterThan(0);
  // Sûre mp3'ü: .../87.mp3 — ezberde ASLA çalmamalı
  const surahPlays = played.filter(u => /\/\d{1,3}\.mp3(\?|$)/.test(u));
  expect(surahPlays, 'ezberde sûre mp3\'i çalmamalı').toEqual([]);
  // Çalanların hepsi 87:3'ün ayet dosyası olmalı (SSSAAA.mp3)
  expect(played.every(u => /087003\.mp3(\?|$)/.test(u)), `beklenmeyen kaynak: ${played.join(', ')}`).toBe(true);
});

test('ayet dosyası doğal sonuna kadar çalar, ortasından kesilmez', async ({ page }) => {
  await openSurah(page);
  await page.evaluate(() => {
    window.__ends = []; window.__cuts = [];
    const Orig = window.Audio;
    window.Audio = function (...a) {
      const el = new Orig(...a);
      const isVerseFile = () => /\d{6}\.mp3(\?|$)/.test(el.currentSrc || el.src || '');
      el.addEventListener('ended', () => { if (isVerseFile()) window.__ends.push(+el.currentTime.toFixed(2)); });
      el.addEventListener('pause', () => {
        // Ayet dosyası ORTASINDA duraklatma = erken kesme (kaldırılan mekanizma)
        if (isVerseFile() && !el.ended && el.currentTime > 0.5) window.__cuts.push(+el.currentTime.toFixed(2));
      });
      return el;
    };
  });

  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await disableAuto(panel);
  await page.getByText(VERSE_3_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeVisible({ timeout: 90_000 });

  const { ends, cuts } = await page.evaluate(() => ({ ends: window.__ends, cuts: window.__cuts }));
  expect(ends.length, 'her tekrar doğal `ended` ile bitmeli').toBeGreaterThanOrEqual(3);
  expect(cuts, 'ayet ortasında duraklatma olmamalı (erken kesme)').toEqual([]);
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

// ─── Faz 2 — kartopu programı + otomatik ilerleme ───────────────────────────

test('kartopu programı sırayla ilerler: Ayet 1 → Ayet 2 → 1–2 birlikte', async ({ page }) => {
  test.setTimeout(180_000);   // 3 adım × 3 tekrar + geçişler

  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  // Otomatik ilerleme AÇIK kalmalı — test edilen şey bu.
  await expect(panel.getByRole('switch')).toHaveAttribute('aria-checked', 'true');

  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  // Panelde görülen adım etiketlerini sırayla topla
  const seq = [];
  for (let i = 0; i < 300; i++) {
    await page.waitForTimeout(400);
    const t = await panelText(panel).catch(() => '');
    const m = t.match(/Ayet \d+|\d+–\d+ birlikte/);
    if (m && seq[seq.length - 1] !== m[0]) seq.push(m[0]);
    if (seq.length >= 3) break;
  }

  // Kartopu sırası: tek ayet, tek ayet, sonra birleştirme
  expect(seq.slice(0, 3)).toEqual(['Ayet 1', 'Ayet 2', '1–2 birlikte']);
});

test('geçiş penceresinde sıradaki adım duyurulur ve Tekrarla adımı geri alır', async ({ page }) => {
  test.setTimeout(180_000);

  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  // İlk adım bitince geçiş penceresi açılır: "Tekrarla" belirir
  const again = panel.getByRole('button', { name: /Tekrarla/ });
  await expect(again).toBeVisible({ timeout: 90_000 });

  // Sıradaki adım duyurulmalı
  expect(await panelText(panel)).toContain('Sıradaki');

  // Kaçışa bas → aynı adım (Ayet 1) baştan çalmalı, Ayet 2'ye GEÇMEMELİ
  await again.click();
  await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 15_000 });
  const t = await panelText(panel);
  expect(t).toContain('Ayet 1');
  expect(t).not.toContain('Ayet 2');
  // Program konumu ilerlememeli — ilk adımdayız
  expect(t).toMatch(/adım\s+1\/\d+/);
});

// Regresyon — 2026-07-31 kullanıcı raporu: A'lâ 19 ayet olmasına rağmen
// panelde etiketsiz "5/34" görünüyordu ve ayet numarası gibi okunuyordu.
// 38 = 19 tek ayet + 15 birleştirme + 3 blok bağlantısı + 1 kapanış. Sayı
// "adım" etiketiyle gelmeli, aksi halde kullanıcı sûrenin 38 ayeti olduğunu
// sanır. (34 → 37 dikiş, → 38 kapanış; 2026-08-07.)
test('program konumu "adım" olarak etiketlenir (ayet numarasıyla karışmasın)', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  await disableAuto(panel);
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();
  await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });

  const t = await panelText(panel);
  // Sayı MUTLAKA "adım" etiketiyle gelmeli
  expect(t).toMatch(/adım\s+\d+\/\d+/);
  // A'lâ 19 ayet: 19 tek + 15 birleştirme + 3 bağlantı + 1 kapanış = 38 adım
  expect(t).toContain('adım 1/38');

  // Yardım baloncuğunda da açıklanmalı
  await panel.getByRole('button', { name: 'Nasıl çalışır?' }).click();
  expect(await panelText(panel)).toMatch(/adım.*ne demek|Program adımını gösterir/s);
});

test('otomatik ilerleme kapalıyken adım sonunda durur', async ({ page }) => {
  test.setTimeout(120_000);

  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  await disableAuto(panel);
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  // 3 tekrar sonunda boşta duruma dönmeli — geçiş penceresi AÇILMAMALI
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeVisible({ timeout: 90_000 });
  expect(await panelText(panel)).not.toContain('Sıradaki');
});

test('yardım baloncuğu kartopu yöntemini açıklar', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  const help = panel.getByRole('button', { name: 'Nasıl çalışır?' });
  await expect(help).toHaveAttribute('aria-expanded', 'false');
  await help.click();
  await expect(help).toHaveAttribute('aria-expanded', 'true');

  const t = await panelText(panel);
  expect(t).toContain('Kartopu');
  expect(t).toContain('Bloklar');
  expect(t).toContain('Bağlantı');   // blok dikişi (2026-08-07)
  expect(t).toContain('Kapanış');    // baştan sona okuma (2026-08-07)
  expect(t).toContain('Geçişlerde');
});

// ⚠ Kapanış adımını ([1-19] ×3) da uçtan uca sınamıyoruz — programın EN
// sonunda geldiği için tüm oturumu beklemek gerekir. Varlığı yine adım
// sayısıyla kanıtlanıyor (37 → 38).
//
// ⚠ Blok dikişini ([1-10] gibi) uçtan uca sınamıyoruz: ilk dikiş İKİ tam
// bloktan sonra gelir — A'lâ'da en düşük tekrar ayarıyla bile ~7 dakikalık
// ses. Dikişin varlığını ADIM SAYISI kanıtlıyor (yukarıdaki 'adım 1/37'
// testi: 34 → 37, üç dikiş). Dikişin sabit tekrarı (SEAM_REPEAT) ise
// loadStep'te tek satır; e2e'de gözlemlemenin bedeli faydasından büyük.

// ─── Mobil giriş (390px — CLAUDE.md §14 minimum genişlik) ───────────────────
// Toolbar'da yer olmadığı için buton masaüstüne özel; mobilde AYAR panelinden
// açılır (Tahta ile aynı kalıp).
test.describe('mobil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Ezber, toolbar yerine AYAR panelinden açılır', async ({ page }) => {
    await page.goto(`/tr/oku/${SURAH}`);
    await expect(page.getByRole('button', { name: /AYAR/i })).toBeVisible({ timeout: 30_000 });

    // Masaüstü toolbar butonu mobilde OLMAMALI (yer yok)
    await expect(page.getByRole('button', { name: /^Ezber$/ })).toHaveCount(0);

    await page.getByRole('button', { name: /AYAR/i }).click();
    const entry = page.getByRole('button', { name: /Ezber/ });
    await expect(entry.first()).toBeVisible();
    await entry.first().click();

    await expect(page.getByRole('region', { name: 'Ezber' })).toBeVisible();
  });

  test('alt sayfa tam genişlikte, yatay taşma yapmaz', async ({ page }) => {
    await page.goto(`/tr/oku/${SURAH}`);
    await expect(page.getByRole('button', { name: /AYAR/i })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /AYAR/i }).click();
    await page.getByRole('button', { name: /Ezber/ }).first().click();

    const panel = page.getByRole('region', { name: 'Ezber' });
    const box = await panel.boundingBox();

    // Alt sayfa BİLEREK tam kenara taşar (100vw) — ekranın altına yapışık,
    // kenar boşluğu yok. Eski "x >= 0" kuralı yüzen şerit içindi.
    // Neredeyse tam genişlik: `fixed` kutu transform'lu ataya göre çözüldüğü
    // için containing block 390 değil ~384px. Her iki yanda eşit ~3px kalır.
    expect(box.width, 'neredeyse tam genişlik olmalı').toBeGreaterThanOrEqual(380);
    expect(box.x, 'sol kenarı aşmamalı').toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, 'sağ kenarı aşmamalı').toBeLessThanOrEqual(390);
    // Ekranın ALTINA yapışık
    expect(box.y + box.height, 'alta yapışık olmalı').toBeGreaterThanOrEqual(840);

    // §14: mobilde yatay sayfa kaydırması olmamalı
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

    // Yardım sayfanın İÇİNDE açılır, ayrı yüzen kutu değil
    await panel.getByRole('button', { name: 'Nasıl çalışır?' }).click();
    const box2 = await panel.boundingBox();
    expect(box2.height, 'yardım açıkken ekranı taşırmamalı').toBeLessThan(844);
    expect(await panelText(panel)).toContain('Kartopu');
  });

  test('çalışırken ince şerite döner (metni az kapatır)', async ({ page }) => {
    await page.goto(`/tr/oku/${SURAH}`);
    await expect(page.getByRole('button', { name: /AYAR/i })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /AYAR/i }).click();
    await page.getByRole('button', { name: /Ezber/ }).first().click();

    const panel = page.getByRole('region', { name: 'Ezber' });
    const sheetH = (await panel.boundingBox()).height;

    await page.getByText(VERSE_1_MEAL).click();
    await panel.getByRole('button', { name: '3', exact: true }).click();
    await panel.getByRole('button', { name: 'Başlat' }).click();
    await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });

    // Kurulum sayfası kapanır, yerine ince şerit gelir — metin açılır.
    const stripH = (await panel.boundingBox()).height;
    expect(stripH, 'çalışma şeridi kurulum sayfasından belirgin kısa olmalı').toBeLessThan(sheetH * 0.5);
    expect(stripH, 'şerit makul yükseklikte olmalı').toBeLessThan(90);

    // Duraklat / devam
    await panel.getByRole('button', { name: 'Duraklat' }).click();
    await expect(panel.getByRole('button', { name: 'Devam et' })).toBeVisible();
    expect(await panelText(panel)).toContain('Duraklatıldı');
    await panel.getByRole('button', { name: 'Devam et' }).click();
    await expect(panel.getByRole('button', { name: 'Duraklat' })).toBeVisible();
  });
});

// Kullanıcı önerisi 2026-08-02: "manuel seçmeyi zorunlu kılmak yerine"
// Başlat'a doğrudan basılabilmeli. Başlangıç şu sırayla çözülür:
//   seçili ayet → açık sayfadaki İLK ayet → sûrenin ilk ayeti
test('ayet seçmeden Başlat çalışır (sayfadaki ilk ayetten başlar)', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  // Hiçbir ayet seçilmedi — yine de başlatılabilmeli
  await expect(panel.getByRole('button', { name: 'Başlat' })).toBeEnabled();
  expect(await panelText(panel), 'başlangıç ayeti gösterilmeli').toMatch(/Başlangıç[\s\S]*Ayet \d+/);
});

// Bir mushaf sayfası birden çok sûre içerebilir (s.604 = İhlâs+Felak+Nâs).
// Oturum, başlangıç ayetinin KENDİ sûresine kurulmalı; ses URL'si
// `selectedSurah`tan kurulursa yanlış sûre çalar.
test('çok sûreli sayfada oturum doğru sûreye bağlanır', async ({ page }) => {
  await page.goto('/tr/oku/112');                       // son sayfa: İhlâs+Felak+Nâs
  await expect(page.getByRole('button', { name: /^Ezber$/ })).toBeVisible({ timeout: 30_000 });

  await page.evaluate(() => {
    window.__src = [];
    const O = window.Audio;
    window.Audio = function (...a) {
      const el = new O(...a);
      el.addEventListener('play', () => {
        const m = (el.currentSrc || el.src || '').match(/(\d{3})(\d{3})\.mp3/);
        if (m) window.__src.push(`${Number(m[1])}:${Number(m[2])}`);
      });
      return el;
    };
  });

  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();
  await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });

  // Adım sayısı HEMEN okunur: geçiş fazında (gap) şerit adım sayacı yerine
  // "Sıradaki …" gösterir, o an ölçmek yanıltıcı olur.
  // İhlâs 4 ayet → 4 tek + 3 birleştirme = 7 adım.
  expect(await panelText(panel), 'plan İhlâs için kurulmalı').toMatch(/adım \d+\/7/);

  await page.waitForTimeout(12_000);
  const src = await page.evaluate(() => window.__src);
  expect(src.length, 'ses çalınmalı').toBeGreaterThan(0);
  const surahs = [...new Set(src.map(x => Number(x.split(':')[0])))];
  expect(surahs, 'yalnız tek sûre çalmalı (sayfadaki diğer sûreler sızmamalı)').toEqual([112]);
});

// ─── G1–G4 sertleştirmeleri (ChatGPT incelemesi, 2026-08-02) ────────────────

test('G1: Tekrarla yalnız geçiş/duraklama fazında etkili', async ({ page }) => {
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();
  await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });

  // 'playing' fazında "Tekrarla" UI'da GÖSTERİLMEZ — kaçış yalnız geçişte.
  await expect(panel.getByRole('button', { name: /Tekrarla/ })).toHaveCount(0);
});

test('adımlar arası geçiş 1.2 sn (kaçış penceresi)', async ({ page }) => {
  test.setTimeout(120_000);
  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await page.getByText(VERSE_1_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  // İlk adım bitince geçiş penceresi açılır
  const again = panel.getByRole('button', { name: /Tekrarla/ });
  await expect(again).toBeVisible({ timeout: 90_000 });
  const t0 = Date.now();
  // Pencere kapanana kadar (Tekrarla kaybolur) geçen süre ~1.2 sn olmalı
  await expect(again).toHaveCount(0, { timeout: 10_000 });
  const dur = Date.now() - t0;
  expect(dur, `geçiş penceresi ${dur}ms — 1.2 sn civarı bekleniyor`).toBeGreaterThan(900);
  expect(dur, `geçiş penceresi ${dur}ms — 1.2 sn civarı bekleniyor`).toBeLessThan(2600);
});

// Regresyon — 2026-08-02: hata bildirim FAB'ı çalışma şeridiyle çakışıyordu.
// Panel GÖRÜNÜR olduğu sürece (alt sayfa VE şerit) gizlenmeli.
test.describe('mobil FAB', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('ezber şeridi açıkken hata bildirim FAB gizlenir', async ({ page }) => {
    await page.goto(`/tr/oku/${SURAH}`);
    await expect(page.getByRole('button', { name: /AYAR/i })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /AYAR/i }).click();
    await page.getByRole('button', { name: /Ezber/ }).first().click();

    const fab = page.locator('[data-fab="bug-report"]');
    await expect(fab, 'alt sayfa açıkken gizli').toBeHidden();

    const panel = page.getByRole('region', { name: 'Ezber' });
    await panel.getByRole('button', { name: '3', exact: true }).click();
    await panel.getByRole('button', { name: 'Başlat' }).click();
    await expect(panel.getByRole('progressbar', { name: 'Tekrar' })).toBeVisible({ timeout: 20_000 });
    await expect(fab, 'çalışma şeridinde de gizli kalmalı').toBeHidden();
  });
});
