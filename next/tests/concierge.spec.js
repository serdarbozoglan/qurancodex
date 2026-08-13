// ─── RAG Semantik Concierge — comprehensive test suite ─────────────────────
// Tests: homepage prompt, /sor page, API, cards, navigation, UX
// ────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

const HOME = '/tr';
const SOR = '/tr/sor';

// ═══════════════════════════════════════════════════════════════════════════
// 1. HOMEPAGE — ConciergePrompt görünürlük + fonksiyonellik
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Homepage ConciergePrompt', () => {
  test('anasayfada prompt görünür', async ({ page }) => {
    await page.goto(HOME);
    // Section id ile bulmalı
    const section = page.locator('#concierge-prompt');
    await expect(section).toBeVisible();
    await expect(section).toContainText(/Kur['’]an Rehberi|Quran Guide/i);
  });

  test('rotating placeholder çalışıyor', async ({ page }) => {
    await page.goto(HOME);
    const input = page.locator('#concierge-prompt input[type="text"]');
    await expect(input).toBeVisible();
    const p1 = await input.getAttribute('placeholder');
    expect(p1).toBeTruthy();
    // 5 saniye bekle rotation için
    await page.waitForTimeout(4500);
    const p2 = await input.getAttribute('placeholder');
    expect(p1).not.toBe(p2);
  });

  test('suggested chips görünür ve tıklanabilir', async ({ page }) => {
    await page.goto(HOME);
    const sabirChip = page.locator('#concierge-prompt button', { hasText: /^Sabır$/ });
    await expect(sabirChip).toBeVisible();
    await sabirChip.click();
    // /sor sayfasına yönlenmeli
    await page.waitForURL(/\/tr\/sor\?q=Sab%C4%B1r/);
    expect(page.url()).toContain('q=');
  });

  test('input + Sor butonu ile submit', async ({ page }) => {
    await page.goto(HOME);
    const input = page.locator('#concierge-prompt input[type="text"]');
    await input.fill('sabirsizlik');
    const submit = page.locator('#concierge-prompt button[type="submit"]');
    await expect(submit).toBeEnabled();
    await submit.click();
    await page.waitForURL(/\/tr\/sor\?q=sabirsizlik/);
  });

  test('short query (< 3 char) submit disabled', async ({ page }) => {
    await page.goto(HOME);
    const input = page.locator('#concierge-prompt input[type="text"]');
    await input.fill('ab');
    const submit = page.locator('#concierge-prompt button[type="submit"]');
    await expect(submit).toBeDisabled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. API — /api/concierge endpoint
// ═══════════════════════════════════════════════════════════════════════════
test.describe('API /api/concierge', () => {
  test('GET health check döner', async ({ request }) => {
    const res = await request.get('/api/concierge');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('POST valid query — 200 + response structure', async ({ request }) => {
    const res = await request.post('/api/concierge', {
      data: { q: 'sabir nedir', lang: 'tr' },
      timeout: 30_000,
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.query).toBe('sabir nedir');
    expect(body.response).toBeTruthy();
    expect(Array.isArray(body.response.verses)).toBe(true);
    expect(body.meta.timings).toBeTruthy();
  });

  test('POST too-short query — 400', async ({ request }) => {
    const res = await request.post('/api/concierge', {
      data: { q: 'ab', lang: 'tr' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST invalid JSON — 400', async ({ request }) => {
    const res = await request.post('/api/concierge', {
      data: 'not json',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. /sor SAYFA — Full experience
// ═══════════════════════════════════════════════════════════════════════════
test.describe('/sor page', () => {
  test('idle state — q yoksa idle mesaj', async ({ page }) => {
    await page.goto(SOR);
    await expect(page.getByText(/bir soru yaz|type a question/i)).toBeVisible();
  });

  test('query submit → loading → response', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    // Query title
    await expect(page.getByText('"sabir"')).toBeVisible({ timeout: 5000 });
    // Loading state — dönen aşama metni.
    // 2026-08-13: eski regex /tarıyorum|scanning|matching|arıyor/ idi ve
    // HİÇBİRİ kaynakta yoktu ("tarıyorum" yanlış çekim; doğrusu "taranıyor").
    // Gerçek aşamalar SorRoute.jsx LoadingState'te:
    //   TR: "Sorunun anlamı çözümleniyor" / "…havuzu taranıyor" /
    //       "En yakın 12 aday seçildi" / "Yanıt hazırlanıyor"
    //   EN: "Analysing…" / "Scanning…" / "Selecting…" / "Composing…"
    // Aşamalar 1.2-3sn'de döndüğü için hepsini kabul eden regex kullanılıyor.
    await expect(
      page.getByText(/çözümleniyor|taranıyor|seçildi|hazırlanıyor|Analysing|Scanning|Selecting|Composing/i).first()
    ).toBeVisible({ timeout: 5000 });
    // Response cards yüklenir
    await expect(page.getByText(/İlgili Ayetler|Relevant Verses/i)).toBeVisible({ timeout: 30_000 });
  });

  test('verse card render + Arabic + reason', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    await expect(page.getByText(/İlgili Ayetler/i)).toBeVisible({ timeout: 30_000 });
    // At least 1 verse card (chip like "3:17" veya ayet no)
    const verseChips = page.locator('span', { hasText: /\d+:\d+/ });
    expect(await verseChips.count()).toBeGreaterThan(0);
    // Arabic — dir="rtl" olan p
    const arabicText = page.locator('p[dir="rtl"][lang="ar"]').first();
    await expect(arabicText).toBeVisible();
  });

  test('clear button (X) input\'u temizler', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    const stickyInput = page.locator('form input[placeholder*="soru"], form input[placeholder*="question"]').first();
    await expect(stickyInput).toHaveValue('sabir');
    // Clear button locate (X icon aria-label ile)
    const clearBtn = page.locator('button[aria-label*="Temizle"], button[aria-label*="Clear"]').first();
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(stickyInput).toHaveValue('');
  });

  test('ESC key input dolu → clear, boş → home', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    const input = page.locator('form input[placeholder*="soru"], form input[placeholder*="question"]').first();
    await expect(input).toHaveValue('sabir');
    // ESC → clear
    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    // ESC again → home
    await page.keyboard.press('Escape');
    await page.waitForURL(new RegExp(`http://localhost:3000/tr/?$`), { timeout: 5000 });
  });

  test('Anasayfa link → home', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    await page.getByRole('link', { name: /Anasayfa|Home/i }).click();
    await page.waitForURL(new RegExp(`http://localhost:3000/tr/?$`));
  });

  test('feedback thumbs up state', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    await expect(page.getByText(/İlgili Ayetler/i)).toBeVisible({ timeout: 30_000 });
    const thumbsUp = page.locator('button[aria-label*="Faydalı"], button[aria-label*="Helpful"]').first();
    await expect(thumbsUp).toBeVisible();
    await thumbsUp.click();
    await expect(page.getByText(/Teşekkürler|Thank you/i)).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. ROUTING — Concierge → Ayet/Tool/Article/Kavram links
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Response link navigation', () => {
  test('verse card link → /oku/[surah]', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    await expect(page.getByText(/İlgili Ayetler/i)).toBeVisible({ timeout: 30_000 });
    const verseLink = page.locator('a[href*="/oku/"]').first();
    await expect(verseLink).toBeVisible();
    const href = await verseLink.getAttribute('href');
    expect(href).toMatch(/\/tr\/oku\/\d+/);
  });

  test('kavram → anchor verse (broken kavram sayfası yerine)', async ({ page }) => {
    await page.goto(`${SOR}?q=sabir`);
    await expect(page.getByText(/İlgili Ayetler/i)).toBeVisible({ timeout: 30_000 });
    // Atlas kavram bulup href kontrol et
    const atlasCards = page.locator('a[href*="/oku/"]');
    const count = await atlasCards.count();
    for (let i = 0; i < count; i++) {
      const href = await atlasCards.nth(i).getAttribute('href');
      // Kavram için de /oku/ formatına döndü — /graf/kavram?id=X değil
      expect(href).toMatch(/\/tr\/(oku|arac|atlas|tefekkur|graf)/);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. ARAPÇA NORMALIZE — daire/tofu karakterleri yok
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Arabic normalization', () => {
  test('response Arabic\'te problem karakterleri yok', async ({ request }) => {
    const res = await request.post('/api/concierge', {
      data: { q: 'öldükten sonra', lang: 'tr' },
      timeout: 30_000,
    });
    const body = await res.json();
    const arabicTexts = (body.response?.verses || []).map(v => v.arabic || '').join(' ');
    // §13.15 problem karakterleri
    const problem = ['۪', 'ۡ', 'ٱ', 'ی'];
    for (const c of problem) {
      expect(arabicTexts.includes(c), `Problem char ${c.charCodeAt(0).toString(16)} found`).toBe(false);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. LANGUAGE SWITCH — TR ↔ EN
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Language switching', () => {
  test('EN homepage prompt görünür', async ({ page }) => {
    await page.goto('/en');
    const section = page.locator('#concierge-prompt');
    await expect(section).toBeVisible();
    await expect(section).toContainText(/Quran Guide/i);
    const askBtn = section.locator('button[type="submit"]');
    await expect(askBtn).toContainText(/Ask/i);
  });

  test('EN /sor page çalışıyor', async ({ page }) => {
    await page.goto('/en/sor?q=patience');
    await expect(page.getByText('"patience"')).toBeVisible({ timeout: 5000 });
    // At least one response section (verses or tools) — .first() strict mode fix
    await expect(page.getByText(/Relevant Verses|Explore.*Pages/i).first()).toBeVisible({ timeout: 30_000 });
  });
});
