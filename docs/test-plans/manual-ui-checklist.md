# Manuel UI Test Checklist — Faz 9.1 Functional Parity

> **Amaç:** Vite → Next.js 16 App Router migration sonrası ana kullanıcı yolculuklarının görsel ve davranışsal denkliğini (parity) doğrulamak.
>
> **Branch:** `migration-to-next.js`
> **Test ortamı:** Local production build (`cd next && npm run build && npm run start`)
> **Browser matrisi:** Chrome (desktop), Safari iOS (mobile)
> **Çözünürlük matrisi:** 1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile)
> **Toplam tahmini süre:** 70–90 dk
>
> **Kapsam:** 39 ana route × 2 locale = ~78 sayfa. Tool kategorileri sample'lanır (her kategoriden 3–5 tool); tüm tool'ları teker teker test etmek 4+ saat sürer ve bu checklist'in amacı değildir.

---

## Pass / Fail Kriterleri

- **PASS:** Tüm checkbox işaretli, console 0 error, görsel parity Vite ile eşit veya daha iyi.
- **CONDITIONAL PASS:** 1–2 minor visual drift veya non-blocking warning (örn. hydration mismatch console warning olmaksızın). Ticket açılır, release blocker değildir.
- **FAIL:** Console error, broken route (404/500), kritik UI bozuk (örn. Arapça metin tofu), navigation circular loop, hydration mismatch error.

---

## 1. Smoke Test (5 dk)

İlk dakikada sitenin "ayağa kalktığını" doğrula.

- [ ] `localhost:3000` ziyaret edilir, otomatik redirect `/tr` veya `/en` (`Accept-Language` header'a göre)
- [ ] DevTools Network sekmesi: ana HTML 200, redirect 307/308 (404 veya 500 yok)
- [ ] Hero render olur: başlık + 3 paragraflık açıklama + "İncelemeye Başla" CTA görünür
- [ ] Navbar render olur: logo (sol) + "Keşfet" mega-menu + "Kur'an'ı Oku" CTA + TR/EN dil switch (sağ)
- [ ] Footer render olur: internal link grid (kategoriler) + Bismillah süslemesi
- [ ] DevTools Console: **0 error, 0 hydration warning**
- [ ] Sayfa kaynak kodunda (`view-source:`): `<html lang="tr">` veya `lang="en"` doğru
- [ ] `<head>` içinde `<link rel="alternate" hreflang="tr">`, `hreflang="en"`, `hreflang="x-default"` mevcut

**Pass kriteri:** Tüm yukarıdakiler tamam ve console temiz.

---

## 2. Homepage Scroll Story (10 dk)

Tek sayfalık scroll-driven anlatı; 19 section'ın tamamı.

- [ ] Mouse wheel ile yumuşak scroll, jank yok (60fps hedef)
- [ ] 19 section sırayla görünür (Hero → MathMiracle → LinguisticDNA → ... → Conclusion → Footer)
- [ ] MathMiracle counter'ları görsel viewport'a girince başlar (0'dan target'a animasyon, ~1.5s)
- [ ] LinguisticDNA: 14 mukattaa harfi chip'leri render olur, hover'da glow
- [ ] ImpossibleRhythm: 16 vezin tab'ı, Şiir / Kur'an / Düzyazı karşılaştırma kart'ları
- [ ] SoundArchitecture: Azap ↔ Rahmet sesleri toggle çalışıyor
- [ ] HiddenArchitecture: Fatiha ring diyagramı görünür ve interaktif
- [ ] ScientificSigns: `criticalNote` tartışmalı alanlarda görünür (Demir/Hadid kartı)
- [ ] Tüm Arapça ayetler `dir="rtl" lang="ar"` ile, KFGQPC font yüklenmiş
- [ ] Cezimler (sükun) yarım daire değil, tam daire (encoding fix doğrulaması)
- [ ] Desktop'ta sol-rail ChapterProgress göstergesi scroll ile dolar (mobile'da gizli)
- [ ] Scroll position browser back/forward sonrası restore edilir
- [ ] CTA butonları (Kur'an'ı Oku, Atlas, Graf, Araçlar) doğru route'a gider
- [ ] Mobile (390×844): hamburger button 44×44 dokunulabilir, drawer açılır + kapanır

**Pass kriteri:** 19 section tamam, animation jank yok, Arapça doğru render.

---

## 3. Reading Mode — `/tr/oku/[surah]` (15 dk)

Sitenin en kritik tool'u: Kur'an okuma modu.

- [ ] `/tr/oku` sure listesi (114 sure) render olur, her sure tıklanabilir link
- [ ] `/tr/oku/1` Fatiha açılır, 7 ayet görünür
- [ ] Arapça metin KFGQPC font, harekeler doğru pozisyonda (dikey, harfin üstünde/altında)
- [ ] Cezimler tam daire (yarım daire encoding hatası göstergesidir)
- [ ] Tofu (□) veya boş kare yok
- [ ] **Regression — Wave 16:** Bakara 2:275 sin+kesra doğru render (الَّذِينَ يَأْكُلُونَ الرِّبَا)
- [ ] Settings overlay açılır (sağ üst gear icon): font size slider, mode toggle (scroll/book), tajweed renkleri, day/night
- [ ] Tafsir paneli açılır (ayet tıklayınca veya sidebar)
- [ ] Meal değiştirme (Diyanet, Yaşar Nuri Öztürk, Elmalılı, …) — seçim persist eder
- [ ] Book mode: sayfa çevirme animasyonu çalışıyor (page turn, swipe destekli)
- [ ] Bookmark ekle (yıldız icon) → persist (localStorage), sayfa refresh sonrası mevcut
- [ ] Bookmark kaldır → persist
- [ ] Karaoke audio: oynat butonu → kelime highlight (gold bg + cream text + glow) — onaylı baseline (bkz. memory feedback)
- [ ] Audio fetch: `api.qurancdn.com` veya benzeri CDN, 200 response
- [ ] Interlinear (word-by-word) modu: her kelime altında TR + EN gloss
- [ ] Day mode toggle: dark → light tema geçişi, kontrast WCAG AA
- [ ] **SR-only navigation:** view-source ile `<nav aria-label="Sure navigation">` içinde prev/next link doğrula
- [ ] Prev/Next sure linkleri (icon button) çalışıyor, route değişiyor (Fatiha → Bakara)
- [ ] Browser back: sure listesine dön

**Pass kriteri:** Tüm modlar çalışıyor, Arapça encoding temiz, bookmark/settings persist.

---

## 4. Cross-tool Navigation (5 dk)

Tool'lar arası navigation'ın Next.js router üzerinden bozulmamış olduğu.

- [ ] Navbar "Keşfet" mega-menu açılır, kategoriler (Atlas, Graf, Araç) görünür
- [ ] Mega-menu'den herhangi bir tool seçimi → ilgili `/tr/{kategori}/{slug}` route
- [ ] `/tr/graf/ayet?q=2:255` deep link doğrudan açılır, VerseGraph 2:255 (Ayetü'l-Kürsi) ile bootstrap olur
- [ ] VerseGraph içinden kavram tıkla → ConceptGraph'a geçiş, browser back ile geri dönüş
- [ ] Tool sayfasından logo tıkla → homepage'e dönüş (`/tr` veya `/en`)
- [ ] Browser back/forward birden fazla kez (3+ adım) → history stack doğru
- [ ] `window.location.href` kullanılmadığı doğrulanır (full page reload yok, sadece soft navigation)

**Pass kriteri:** Tüm linkler soft navigation, history doğru, deep link çalışıyor.

---

## 5. Atlas Tool Tests (12 dk — 4 sample)

12 atlas tool'undan kritik 4 tanesi.

### 5.1 `/tr/atlas/kissa` — Kıssa Atlası
- [ ] Peygamber kıssaları kartları render olur
- [ ] Kıssa-detay paneli açılır (kart tıklayınca)
- [ ] Fairy mode (özel görsel mod) toggle çalışıyor
- [ ] Ayet referansları tıklanabilir, doğru sure/ayete götürür
- [ ] Mobile: tek sütun, sidebar gizli, header'da scrollable chip row

### 5.2 `/tr/atlas/peygamber` — Peygamber Atlası
- [ ] Zaman çizelgesi render olur
- [ ] Harita component (Leaflet) yüklenir — `dynamic({ ssr: false })` ile
- [ ] Marker tıkla → peygamber detayı popup
- [ ] Mobile: 380px height (kural §14)

### 5.3 `/tr/atlas/kavim` — Kavim Atlası
- [ ] Kavim cards (Ad, Semud, Lut kavmi, …) render olur
- [ ] Helak haritası açılır
- [ ] **Wave 16 perf regression:** Production load < 1s (önceki ölçüm 810ms)
- [ ] No layout shift (CLS < 0.1)

### 5.4 `/tr/atlas/doga` — Doğa Atlası
- [ ] Doğa fenomenleri tab'ları (Su, Yıldızlar, Bitkiler, …)
- [ ] Tab geçişinde scroll position iç tab'ın sorumluluğunda (kural §13.16 — tek scrollbar)
- [ ] Her tab'da ayet bloğu `VERSE_BLOCK` stilinde

**Pass kriteri:** 4 atlas tool sorunsuz, görsel parity Vite ile eşit.

---

## 6. Graf Tool Tests (6 dk — 3 sample)

6 graf tool'undan kritik 3 tanesi.

### 6.1 `/tr/graf/ayet?q=2:255` — Ayet Grafiği
- [ ] Kelime ağı render olur (force-directed veya benzeri)
- [ ] Sidebar açılır, seçili ayetin kelime listesi
- [ ] Search bar ile başka ayete geçiş (`?q=` query param güncellenir)
- [ ] URL paylaşılabilir (deep link)

### 6.2 `/tr/graf/kavram` — Kavram Grafiği
- [ ] 80+ kavram node'u görünür
- [ ] Cluster filtreleme dropdown'ı (örn. Akide, Ahlak, Tarih)
- [ ] Search input ile kavram filtreleme
- [ ] Node tıkla → kavram detay paneli + ilgili ayetler

### 6.3 `/tr/graf/kelime-isi` — Kelime Isı Haritası (WordHeatmap)
- [ ] 7 hot kelime grid render olur
- [ ] Density görselleştirme (heatmap renkleri)
- [ ] Kelime tıkla → o kelimenin tüm geçtiği ayetler
- [ ] Mobile: grid responsive (tek/çift sütun)

**Pass kriteri:** 3 graf tool render olur, interaksiyon çalışıyor.

---

## 7. Araç Tool Tests (8 dk — 5 sample)

16 araç tool'undan kritik 5 tanesi.

### 7.1 `/tr/arac/tum-araclar` — Tüm Araçlar Gallery
- [ ] 36 tool kartı grid'de render olur
- [ ] Her kart link, doğru route'a yönlendirir
- [ ] Mobile: tek sütun, kart genişliği fluid

### 7.2 `/tr/arac/sebebi-nuzul` — Sebeb-i Nüzul
- [ ] TabArama render olur, kategori chips
- [ ] **Wave 16 regression:** React `key` warning yok (console temiz)
- [ ] Arama input ile filtreleme çalışıyor
- [ ] Sonuçlarda ayet bloğu doğru stillenmiş

### 7.3 `/tr/arac/iblis-seytan` — İblis & Şeytan
- [ ] 7 stat card render olur
- [ ] Ayet bloğu `VERSE_BLOCK` stilinde
- [ ] **Wave 16 regression:** Hydration mismatch yok (initial value SSR-safe)

### 7.4 `/tr/arac/wow` — Wow Facts
- [ ] WowFacts kategori filter chip'leri
- [ ] Kategori değişince fact listesi güncellenir
- [ ] Each fact: başlık + açıklama + ayet ref

### 7.5 `/tr/arac/cennet-cehennem` — Cennet & Cehennem
- [ ] 3D-feel cards (depth, glow, parallax) render olur
- [ ] Tab switch (Cennet ↔ Cehennem) çalışıyor
- [ ] Ayet referansları tıklanabilir

**Pass kriteri:** 5 araç tool sorunsuz, Wave 16 regression yok.

---

## 8. Mobile Parity (10 dk)

390×844 (iPhone 14) çözünürlükte.

- [ ] Hero başlığı responsive font-clamp, CTA buton tam genişlik
- [ ] Hamburger buton 44×44 minimum (WCAG 2.5.5)
- [ ] Drawer slide-in animation, backdrop tıkla → kapanır
- [ ] Drawer içinde tüm navigation linkleri tıklanabilir
- [ ] LinguisticDNA: 14 mukattaa harfi chip 48×48 mobile boyut
- [ ] ProphetMap: 380px height, harita drag/zoom dokunmatik
- [ ] Conclusion ayet: font-clamp ile tek satırda taşma yok
- [ ] Tooltip width: `min(220px, calc(100vw - 32px))` — ekranı taşmaz
- [ ] Yatay scroll YOK (`overflow-x: hidden` global)
- [ ] Safari iOS test (Chrome ek olarak): Webkit-specific CSS bug yok
- [ ] Address bar gizlenince layout shift yok (dvh / svh kullanımı)
- [ ] Sidebar pattern: mobil sidebar gizli, header chip row scrollable

**Pass kriteri:** Tüm sayfalar 390px'te tam kullanılabilir, taşma yok.

---

## 9. Locale & i18n (5 dk)

İki dilli site kritik kontrol.

- [ ] `/tr` ↔ `/en` URL switch (Navbar TR/EN button)
- [ ] Dil değişince mevcut sayfa karşılığı açılır (örn. `/tr/atlas/kissa` → `/en/atlas/kissa`)
- [ ] Dil tercihi localStorage'da persist (manuel set → refresh sonrası korunur)
- [ ] Yeni tab açıldığında localStorage tercihi okunur veya `Accept-Language` fallback
- [ ] View-source'ta `<link rel="alternate" hreflang="tr" href="...">`, `hreflang="en"`, `hreflang="x-default"` mevcut
- [ ] OG tags doğru locale ile (`og:locale="tr_TR"` veya `en_US`)
- [ ] Arapça metin her iki locale'de byte-byte aynı (verse content invariant — locale-bağımsız)
- [ ] EN sayfasında TR metin sızıntısı yok ve tersi
- [ ] i18n key parity: TR'de var EN'de yok veya tersi → 0 (kural §13)

**Pass kriteri:** TR/EN switch çalışıyor, hreflang doğru, key parity tam.

---

## 10. Accessibility Smoke (5 dk)

WCAG 2.1 AA minimum.

- [ ] Tab tuşu ile sıralı focus navigation (Navbar → Hero CTA → section'lar → Footer)
- [ ] Enter / Space ile aktivasyon (link + button)
- [ ] Esc ile overlay/modal kapanır (settings, search, drawer)
- [ ] Focus visible: gold outline, transparent background dışında görünür
- [ ] Screen reader test (VoiceOver / NVDA): PageHeading H1 okunur (sr-only ama announce edilir)
- [ ] SurahPagination sr-only nav: "Önceki sure: Fatiha, Sonraki sure: Al-i İmran" okunur
- [ ] Tüm icon-only butonlarda `aria-label` mevcut (hamburger, close, settings, bookmark)
- [ ] Form input'larda `<label>` veya `aria-label`
- [ ] Renk kontrast oranı: body text ≥ 4.5:1, large text ≥ 3:1 (DevTools Accessibility panel)
- [ ] `prefers-reduced-motion: reduce` → animasyonlar disable veya azaltılmış

**Pass kriteri:** Keyboard nav çalışıyor, focus visible, sr-only sinyali var.

---

## 11. Performans Gözlem (3 dk)

Local prod build'de hızlı bakış (kapsamlı Lighthouse Faz 7.10'da).

- [ ] DevTools Network: first paint < 1s (cache cold)
- [ ] No 404, no 500 (Network tab kırmızı satır yok)
- [ ] Audio fetch (api.qurancdn.com) 200, audio çalıyor
- [ ] API meal proxy `/api/meal/[author]/[surah]` ilk istek `MISS`, ikinci `HIT` (Cache-Control header)
- [ ] JSON public asset'leri (verse-graph-bgem3.json, vb.) gzip/brotli compressed (Content-Encoding header)
- [ ] No layout shift (CLS < 0.1) — Hero, Atlas, Graf sayfalarında
- [ ] LCP element Hero başlığı veya ilk büyük görsel, < 2.5s
- [ ] DevTools Performance tab kısa kayıt: long task (> 50ms) sayısı minimum

**Pass kriteri:** Network temiz, audio + API proxy çalışıyor, kritik sayfa < 1s.

---

## 12. Edge Case Tests (4 dk)

Sınır durumları + recovery senaryoları.

- [ ] `/tr/oku/115` (invalid sure, > 114) → 404 sayfası veya `/tr/oku`'ya redirect
- [ ] `/tr/oku/0` (sure 0) → 404
- [ ] `/tr/oku/-1` (negatif) → 404
- [ ] `/tr/oku/abc` (non-numeric) → 404
- [ ] `/tr/atlas/nonexistent` → 404 (`not-found.js` render olur)
- [ ] Reading mode'da bookmark eklendikten sonra sayfa refresh → bookmark korunur
- [ ] Settings'te font size değişikliği → refresh sonrası korunur (localStorage)
- [ ] Browser back/forward navigation: 5+ adım, history stack bozulmadan
- [ ] Network offline (DevTools throttle): graceful error message, white-screen yok
- [ ] Çok hızlı navigation (10 link arka arkaya): race condition / memory leak yok
- [ ] Audio çalarken sayfa değiştir → audio durur (cleanup useEffect)
- [ ] Reading mode'da query param `?ayah=5` deep link → ilgili ayet'e scroll

**Pass kriteri:** Tüm invalid URL'ler 404, persist state korunur, recovery temiz.

---

## Test Sonuç Şablonu

Aşağıdaki tabloyu test sonunda doldur:

| Bölüm | Süre | Pass / Fail | Notlar |
|---|---|---|---|
| 1. Smoke | 5 dk | | |
| 2. Homepage scroll | 10 dk | | |
| 3. Reading mode | 15 dk | | |
| 4. Cross-tool nav | 5 dk | | |
| 5. Atlas (4 sample) | 12 dk | | |
| 6. Graf (3 sample) | 6 dk | | |
| 7. Araç (5 sample) | 8 dk | | |
| 8. Mobile parity | 10 dk | | |
| 9. Locale & i18n | 5 dk | | |
| 10. A11y smoke | 5 dk | | |
| 11. Performans | 3 dk | | |
| 12. Edge cases | 4 dk | | |
| **TOPLAM** | **~88 dk** | | |

**Test tarihi:** ____________________
**Test eden:** ____________________
**Branch / commit:** `migration-to-next.js` @ ____________________
**Genel sonuç:** [ ] PASS  [ ] CONDITIONAL PASS  [ ] FAIL

---

## Bilinen Limit ve Atlanan Alanlar

- **39 route × 2 locale × tüm derinlikler:** Bu checklist sample-based; her tool'un tüm tab/state kombinasyonu test edilmez. Otomatik E2E test (Playwright) Faz 9.2'de.
- **Lighthouse skoru:** Bu checklist sadece gözlem; Lighthouse audit Faz 7.10 / 9.3'te.
- **Cross-browser (Firefox, Edge):** Chrome + Safari iOS yeterli; ek browser Faz 9.3.
- **Production deploy parity (Vercel / preview):** Bu checklist local prod build için. Preview URL testi ayrıca yapılır.
- **Stress test (yüksek load):** Tek kullanıcı testi; yük testi scope dışı.

---

## İlgili Dökümanlar

- Migration planı: `tasks/todo_next.js_migration.md`
- Next.js patternları: `CLAUDE.md` §16
- Arapça encoding kuralı: `CLAUDE.md` §13.15
- Mobil kuralı: `CLAUDE.md` §14
- Tek scrollbar hijyeni: `CLAUDE.md` §13.16
- Faz 7 / 8 / 9 commit history: `git log --oneline migration-to-next.js`
