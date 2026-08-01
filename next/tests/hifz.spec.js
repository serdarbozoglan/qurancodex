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
  const btn = panel.getByRole('button', { name: /Otomatik/ });
  if ((await btn.getAttribute('aria-pressed')) === 'true') await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
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

// Regresyon — 2026-07-31 kullanıcı raporu: "ayet sonunda teyp kapanışı gibi
// bir ses" + "ikinci ayetin ilk harfinin bir kısmı duyuluyor".
// Kök neden: qdc damgaları BİTİŞİK (to === sonraki from; A'lâ'da 19/19 ayette
// boşluk 0 ms), sınır `to`da olunca rAF granülerliği yüzünden sonraki ayete
// taşıyor ve sert pause() tık üretiyordu.
// Beklenen: duraklama `to`dan ÖNCE ve volume 0'a rampalanmış olarak gerçekleşir,
// ayetin ortası ise tam sesle çalar.
test('duraklatmadan önce flush seek — sonraki ayetin sesi kuyruktan atılır', async ({ page }) => {
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
    // 10 ms — rampa 25 ms sürüyor; 50 ms'lik örnekleme onu tamamen kaçırır.
    setInterval(() => {
      const a = window.__a;
      if (a && !a.paused) window.__ts.push([a.currentTime * 1000, a.volume]);
    }, 10);
  });

  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });
  await panel.getByRole('button', { name: '3', exact: true }).click();
  await disableAuto(panel);
  await page.getByText(VERSE_3_MEAL).click();
  await panel.getByRole('button', { name: 'Başlat' }).click();

  for (let i = 0; i < 70; i++) {
    await page.waitForTimeout(500);
    if (i > 4 && await panel.getByRole('button', { name: 'Başlat' }).isVisible().catch(() => false)) break;
  }

  const { ev, ts } = await page.evaluate(() => ({ ev: window.__ev, ts: window.__ts }));

  const FROM_87_3 = 7550;
  const TAIL_END = 10905;    // 87:3'ün duyulabilir ses kuyruğunun bitişi (ölçüm)

  // (a) FLUSH SEEK ÇALIŞMIŞ OLMALI — her duraklama pencere BAŞINDA.
  //
  // Kritik değişmez budur. `pause()` tek başına yetmiyor: ses donanım
  // kuyruğunda ~100-200 ms içerik varken duraklatılırsa o içerik yine
  // çalınır ve sonraki ayetin ilk harfi duyulur (kullanıcı raporu
  // 2026-08-01, iPhone). Duraklatmadan ÖNCE pencere başına seek edilirse
  // çıkış tamponu boşalır ve kuyruktaki ses atılır.
  //
  // Duraklamanın `from`da gerçekleşmesi = seek'in pause'dan önce çalıştığının
  // gözlemlenebilir kanıtı. `to` civarında bir duraklama görülürse flush
  // atlanmış demektir.
  expect(ev.length, 'duraklama gözlenmeli').toBeGreaterThan(0);
  for (const x of ev) {
    expect(
      Math.abs(x.ct - FROM_87_3),
      `duraklama ct=${Math.round(x.ct)} — pencere başında değil, flush seek atlanmış`,
    ).toBeLessThan(300);
  }

  // (b) Ses kuyruğu KIRPILMAMALI — kesme, konuşma bitmeden başlamamalı.
  // 87:3'ün duyulabilir kuyruğu 10905'te bitiyor (genlik ölçümü). O ana
  // kadar tam seviyede çalınmış olmalı.
  const beforeTail = ts.filter(([ct]) => ct > 10600 && ct < TAIL_END);
  expect(beforeTail.length, 'kuyruk bölgesi örneklenebilmeli').toBeGreaterThan(0);
  expect(
    Math.min(...beforeTail.map(([, v]) => v)),
    'ayetin ses kuyruğu tam seviyede çalmalı',
  ).toBeGreaterThan(0.9);

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

// ─── Faz 2 — kartopu programı + otomatik ilerleme ───────────────────────────

test('kartopu programı sırayla ilerler: Ayet 1 → Ayet 2 → 1–2 birlikte', async ({ page }) => {
  test.setTimeout(180_000);   // 3 adım × 3 tekrar + geçişler

  await openSurah(page);
  await page.getByRole('button', { name: /^Ezber$/ }).click();
  const panel = page.getByRole('region', { name: 'Ezber' });

  await panel.getByRole('button', { name: '3', exact: true }).click();
  // Otomatik ilerleme AÇIK kalmalı — test edilen şey bu.
  await expect(panel.getByRole('button', { name: /Otomatik/ })).toHaveAttribute('aria-pressed', 'true');

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
// 34 = 19 tek ayet adımı + 15 birleştirme adımı. Sayı "adım" etiketiyle
// gelmeli, aksi halde kullanıcı sûrenin 34 ayeti olduğunu sanır.
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
  // A'lâ 19 ayet: 19 tek + 15 birleştirme = 34 adım
  expect(t).toContain('adım 1/34');

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
  expect(t).toContain('Geçişlerde');
});

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

  test('panel ekrana sığar, yatay taşma yapmaz', async ({ page }) => {
    await page.goto(`/tr/oku/${SURAH}`);
    await expect(page.getByRole('button', { name: /AYAR/i })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /AYAR/i }).click();
    await page.getByRole('button', { name: /Ezber/ }).first().click();

    const panel = page.getByRole('region', { name: 'Ezber' });
    const box = await panel.boundingBox();
    expect(box.x, 'sol kenar ekran içinde').toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, 'sağ kenar ekran içinde').toBeLessThanOrEqual(390);
    // Dar sütuna sarmamalı — tam genişliğe yakın olmalı (regresyon: 192px ölçülmüştü)
    expect(box.width, 'panel tam genişliğe yayılmalı').toBeGreaterThan(320);

    // §14: mobilde yatay sayfa kaydırması olmamalı
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

    // Yardım baloncuğu da ekrana sığmalı
    await panel.getByRole('button', { name: 'Nasıl çalışır?' }).click();
    const box2 = await panel.boundingBox();
    expect(box2.height, 'yardım açıkken ekranı taşırmamalı').toBeLessThan(844);
  });
});
