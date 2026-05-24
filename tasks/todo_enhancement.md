# QuranCodex — Enhancement TODO (2026-05-24)

> **Bağlam:** Next.js migration sonrası kapsamlı görsel + içerik + UX audit. Bulgular:
> 1. Playwright ile 24 sample route screenshot (`docs/screenshots/2026-05-24/`)
> 2. Homepage section-by-section (41 viewport, `docs/screenshots/2026-05-24/homepage-sections/`)
> 3. Kod tabanı inspection (Next.js `next/`)
>
> **Triage notasyonu:**
> 🔴 Kritik (UX bozar, SEO penalize, build bozar)
> 🟡 Önemli (yakın vadede)
> 🟢 Polish (görsel ince ayar)
> ⭐ 10/10 strateji (büyüme/derinleştirme)

---

## I. KRİTİK BULGULAR (🔴)

### K-1. `/tr/oku/36` React error #418 — Hydration Mismatch
- **Tespit:** Playwright `pageerror` event'i: `Minified React error #418` (text mismatch server↔client).
- **Etki:** SSR'da render edilen DOM ile client hydration arasında fark var; React tüm subtree'yi yeniden render etmek zorunda kalıyor → flash + INP regression + console error.
- **Olasılık:** `useWordTimings` veya `useInterlinearData` hook'larının initial state'inde locale-dependent veya `Math.random()`/timestamp-bağımlı bir şey var.
- **Sonraki adım:** ReadingMode'u dev mode'da (`next dev`, prod minify yok) açıp full React error mesajını al; subtree'yi izole et.
- **Dosyalar:** `next/src/components/ReadingMode.jsx`, `next/src/hooks/useWordTimings.js`, `next/src/hooks/useInterlinearData.js`

### K-2. Peygamber Atlası Active State — Palette İhlali
- **Tespit:** `atlas-peygamber-desktop.png` — "Hz. Nuh" aktif chip'i **pembe/rose** çerçeve; geri kalanı default. Site palette'i gold (#d4a574) + emerald (#1a7a4c). Rose **dışarıda**.
- **Etki:** Visual identity bozulması; CLAUDE.md §4 design system'a aykırı.
- **Çözüm:** ProphetAtlas component'inde aktif chip border/text → `COLORS.gold` veya `COLORS.softGold`'a çevir.
- **Dosya:** `next/src/components/ProphetAtlas.jsx` (active-state styling)

### K-3. /oku/[surah] Reading Mode Mobile — Meal Görünmüyor
- **Tespit:** `reading-bakara-mobile.png` — Sadece Arapça mushaf rendering; Türkçe meal/açıklama default ekranda görünmüyor.
- **Etki:** Mobile kullanıcı (≥50% trafik beklenir) ayet metnine ulaşırken Türkçe karşılığını göremiyor → temel okuma deneyimi kırık.
- **Çözüm seçenekleri:**
  - (A) Mobile default'unda "meal alta katlanmış" görünür (collapsible drawer/sheet).
  - (B) Üst veya altta toggle button (`Aç meal`) — kullanıcı tek tıkla açar.
- **Dosya:** `next/src/components/ReadingMode.jsx` mobile branch

### K-4. TR/EN Metadata Tool Sayfalarında Tek-Dil
- **Tespit:** `/en/atlas/kissa` page.js'inde TITLE/DESC sadece TR ("Kıssa Atlası", "Kur'an'daki peygamber kıssaları..."). EN locale'inde de aynı TR metin metadata'da. Sadece `/oku/[surah]` ve `/`'da TR/EN ayrımı var.
- **Etki:** EN locale arama sonuçlarında Türkçe başlık görünür → İngilizce kullanıcı için relevance düşer → SEO bounce.
- **Çözüm:** 35 tool page.js'i `isEN`-aware'e çevir: `const TITLE_TR/EN`, `const DESC_TR/EN`, `generateMetadata` locale'a göre seç.
- **Dosya:** `next/src/app/[locale]/{atlas,graf,arac}/*/page.js` (35 dosya)

### K-5. /api/meal/* Edge Runtime — Acikkuran API CORS/Rate Limit Risk
- **Tespit:** Edge proxy `next/src/app/api/meal/[author]/[surah]/route.js` 24 saatlik cache var, ama acikkuran.com'un kendi rate limit'i belirsiz. Production'da 114 sure × 6 meal author = 684 unique request olabilir.
- **Çözüm:** Build-time prefetch (ana 6 meal author × 114 sure'i `public/meal-cache/` altına dump et), runtime proxy sadece fallback olarak kalsın.
- **Dosya:** `scripts/prefetch-meals.mjs` (yeni)

---

## II. ÖNEMLİ BULGULAR (🟡)

### Ö-1. Footer "Sayfaları Keşfet" — Görsel Hierarchy Zayıf
- **Tespit:** `section-41.png` — yeni eklenen 4-sütun internal link nav, sources bloğu ile aynı `glass-card` stil; ikisi de göz seviyesinde aynı ağırlıkta yarışıyor.
- **Çözüm:** İç link nav'ın background'ı biraz daha hafif (`rgba(255,255,255,0.02)` vs sources'un `0.05`'i), border-radius azalt, padding'i azalt → ikincil hierarchy.
- **Dosya:** `next/src/components/Footer.jsx` lines 130-158

### Ö-2. Tool Overlay Navbar Görünür — Z-Index Belirsizliği
- **Tespit:** `/atlas/kissa`, `/arac/wow`, `/arac/dualar` tool overlay'leri `position: fixed; inset: 0; z: 9999` olduğu halde, navbar görünüyor (`z-[9999]` de). Stacking belirsiz, DOM order'a bağlı.
- **Etki:** Navbar bazı tool'larda tool UI ile overlap edebilir.
- **Çözüm:** Navbar z-index'i `10000`'e yükselt (mobile menu zaten 10001/10002 kullanıyor); tool overlay'leri `9999`'da kalsın.
- **Dosya:** `next/src/components/Navbar.jsx` line 698

### Ö-3. Reading Mode Header (Mobile) — Çok Yoğun
- **Tespit:** `reading-bakara-mobile.png` üst kısımda ~6 ikon/buton sığmaya çalışıyor (cüz, sure no, audio control, reciter, font size, vs.). 390px'de çok sıkışık.
- **Çözüm:** CLAUDE.md §14.5 pattern'ı uygula — Row 1: title + close, Row 2: scrollable chip row.
- **Dosya:** `next/src/components/ReadingMode.jsx` mobile header

### Ö-4. Homepage Section Transitions — Gradient Seam
- **Tespit:** `section-10.png` üst kısmında SoundArchitecture (deep navy) → ImpossibleRhythm geçişinde hafif "seam" görünüyor — iki section arasındaki gradient overlap yeterli değil (CLAUDE.md §4 "200px gradient overlap" diyor).
- **Çözüm:** Section'ların alt 200px'ine `linear-gradient(to bottom, transparent, next-section-bg)` ekle.
- **Dosya:** `next/src/sections/SoundArchitecture.jsx`, ImpossibleRhythm.jsx, vs.

### Ö-5. Loading States — Spinner Tutarsız
- **Tespit:** KissaAtlas loading state'inde spinner var, fakat tool component'leri arasında loading UI tutarsız. WowFacts, DuaVerses, Peygamber Atlas — her biri farklı loading pattern (veya hiç).
- **Çözüm:** `next/src/components/LoadingOverlay.jsx` global component oluştur; tüm tool'lar bunu kullansın.

### Ö-6. SurahPagination Sr-Only — Visible Surah Navigation Yok
- **Tespit:** SurahPagination component sr-only render ediyor (SEO için). ReadingMode kendi içinde page-turn var, ama surah-to-surah navigasyon (Bakara → Âl-i İmrân) net değil.
- **Çözüm:** Reading mode footer/header'a "Önceki sure: El-Fatiha (1) | Sonraki sure: Âl-i İmrân (3)" şeritleri ekle (visible).

### Ö-7. Bilimsel İşaretler — "Devamını oku" Default Collapsed
- **Tespit:** `section-25.png` — Demir bölümünde "Demirin Kozmik Yolculuğu" başlığı altında metin "..." ile truncate, "Devamını oku" link'i. Ana içerik gizli.
- **Etki:** Kullanıcı tıklamadan ana içeriği göremez → engagement düşer, SEO için server-side content görünmez.
- **Çözüm:** Default expanded; "Daha az göster" toggle.
- **Dosya:** `next/src/sections/ScientificSigns.jsx`

### Ö-8. Yusuf/İbrahim/İsa Sayıları — Sahne Sayısı Tutarsız
- **Tespit:** `atlas-kissa-desktop.png` tabs: "Musa 32 | Yusuf 3 | İbrahim 3 | İsa 3". 32 vs 3 dramatic discrepancy — Musa için 32 ana sahne varken Yusuf için 3 mü? Yusuf suresi başlı başına Yusuf kıssası, daha fazla sahne olmalı.
- **Doğrulama:** `KissaAtlas` data dosyasını incele, eksik sahne ekle.
- **Dosya:** `next/public/kissa-atlas.json` veya KissaAtlas component data prop

### Ö-9. Footer Kaynaklar — Görsel Çekiciliği Düşük
- **Tespit:** `section-41.png` "Kaynaklar" bloğu küçük punto, dense list. Akademik kaynak listesinin önemine yakışmıyor.
- **Çözüm:** Kaynaklar bloğu için ayrı `/kaynakca` route — detaylı bibliyografya + footer'da sadece top 5 + "Tüm kaynaklar →" link.

### Ö-10. ToolsBrowser Modal — Search Bar Empty State
- **Tespit:** `arac-tum-araclar-desktop.png` üst arama input'u var, ama placeholder/empty state pop-up'lı bir öneri sistemi yok. Kullanıcı ne arayacağını bilmiyorsa boş kalıyor.
- **Çözüm:** Empty state'te "Popüler aramalar: dua · esma · kıssa · ..." öneri chip'leri.

---

## III. POLISH (🟢)

### P-1. Hero "İNCELEMEYE BAŞLA" Button — Mevcut Görsel İyi, Mikro İyileştirme
- Hero CTA buton boyutu OK, ama padding biraz dar; +12px horizontal padding ile daha "tappable".
- Hover state: gold→lighter-gold transition daha yavaş (`200ms ease`).

### P-2. Karaoke Highlight — Animasyon Smoothness
- Kelime highlight switch animation: opacity/background fade 80ms; biraz sert. 150ms ease-in-out → daha akıcı.

### P-3. Reading Mode Page Turn — Visual Continuity
- Page turn animation: page çevrilirken Arabic glyph'ler subtle parallax kazandırırsa lüks his verir.

### P-4. Tool Card Hover — Lift Effect
- Tool browser kartlarında hover'da `transform: translateY(-2px)` + `box-shadow` yumuşatma — şu an statik.

### P-5. Footer "Sayfaları Keşfet" — Item Underline on Hover
- Link hover'da text-decoration: underline (gold/30 color) — şu an sadece color transition.

### P-6. Mobile Hamburger Menu — Transition Smoothness
- Hamburger açılırken slide-in animation 200ms cubic-bezier; visual quality için yumuşat.

### P-7. Particle Background — Mobile Performance
- Hero particle background mobile'da count azalt (40→15) — battery life + perceived smoothness.

### P-8. Footer Bottom — bismillah Süs Pozisyonu
- Footer altındaki "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" gold/30 opacity; biraz daha belirgin (gold/50) → görsel "kapanış mührü" hissi.

### P-9. Glassmorphism — Backdrop Blur Tutarlılığı
- Bazı kartlarda `backdrop-filter: blur(20px)`, bazılarında `blur(12px)`. Token'da `GLASS_CARD` tek değer olmalı (already in tokens.js, audit ihtiyacı).

### P-10. Scroll Progress Indicator
- Homepage'in solunda 41 nokta görüyoruz (section indicator). Active section gold dot. Click → o section'a smooth scroll → zaten var? Mobile'da görünmüyor — desktop only OK.

### P-11. KFGQPC Font Rendering — Font-Feature-Settings
- `font-feature-settings: 'liga' 1, 'kern' 1` global ekle (Arapça ligature + kerning kalitesi).
- `font-variant-ligatures: contextual` — Arabic contextual forms.

### P-12. Atlas-Kissa Sidebar — Scrollbar Stilizasyonu
- `atlas-kissa-desktop.png` sol sidebar scrollbar default system. `scrollbar-width: thin` + `::-webkit-scrollbar-thumb` gold/15 tint.

---

## IV. UX & FONKSİYONELLİK

### U-1. Locale Switcher — URL Persistence
- Kullanıcı /tr/atlas/kissa'dayken EN tıklarsa → /en/atlas/kissa olsun. Mevcut Navbar `toggleLanguage` doğru implement edilmiş mi audit.

### U-2. Browser Back/Forward — Tool Overlay
- Tool overlay'de browser back → homepage'e dönsün, tool kapansın. Mevcut `router.push('/')` `onClose`'da çalışıyor mu doğrula.

### U-3. Keyboard Navigation — Tab Order
- Tab key ile navbar → main content → footer logical order. Modal açıldığında focus trap (modal kapanınca focus restore).

### U-4. Escape Key — Tool Overlay Close
- Esc → tool overlay close. Tüm tool'larda mevcut mu?

### U-5. Empty States
- `/oku/200` (geçersiz sure) → 404 not-found.jsx with helpful message.
- ConceptGraph node tıklandığında veri yoksa → "Bu kavram için veri bulunamadı" empty state.
- API meal fetch fail → "Meal yüklenemedi, daha sonra dene" toast.

### U-6. Loading Spinner Position — Centered, Mobile
- Mobile'da spinner ortalanmış mı? Bazı tool'larda spinner header'a yapışık görünüyor.

### U-7. Tooltip Behavior — Word Hover
- ReadingMode kelime hover'da Türkçe/transliteration tooltip görünüyor — mobile'da tap-and-hold yerine tap-to-toggle olmalı.

### U-8. Settings Persistence — Encoding
- localStorage'da reciter/font/locale settings hangi key altında? Schema versionlama var mı? (key migration için).

### U-9. Audio Pause on Navigation
- Tool overlay açılınca ReadingMode audio pause olmuyorsa background'da çalmaya devam ediyor — UX hatası.

### U-10. Tab Title Updates
- Tool overlay açıldığında document.title değişiyor mu? `/atlas/kissa` ise "Kıssa Atlası | QuranCodex" olmalı (Next metadata yapıyor mu).

---

## V. SEO & ACCESSIBILITY (post-Faz 7-9 kalıntıları)

### S-1. SVG aria-* — 363 Decorative SVG
- Yeni a11y polish pass: tüm decorative SVG'lere `aria-hidden="true"`. Meaningful diagrams için `<title>`+`<desc>` ekle.

### S-2. Color Contrast — silver/40 vs cosmic-black
- Footer'da `text-silver/75` veya `text-silver/40` bazı yerlerde WCAG AA başarısız olabilir (3:1 minimum bg-cosmic-black üstünde). Lighthouse audit.

### S-3. Skip Link
- "Ana içeriğe geç" skip link (visible on focus) — keyboard nav için.

### S-4. Heading Hierarchy — Tool Pages
- Tool sayfalarında SSR'da PageHeading H1 var, ama hydration sonrası tool component kendi H2'sini eklediğinde hierarchy doğru kalıyor mu? Audit.

### S-5. Alternate URL — hreflang Test
- Google Search Console URL inspection: hreflang alternates her route için doğru mu? Sample: `/tr/atlas/kissa` ile `/en/atlas/kissa` ikisi de canonical kendine, alternates karşılıklı.

### S-6. Sitemap — Tool Sayfaları
- Mevcut sitemap 302 URL üretiyor. Tool sayfalarının `lastmod` tarihi statik. İçerik güncellendiğinde `lastModified` dinamik olsun (file mtime'dan).

### S-7. Sosyal Paylaşım — Twitter Card Preview
- Twitter Card validator'da test et: `/tr/oku/2` paylaşıldığında "El-Bakara" branded kart görünür mü?

### S-8. PWA Manifest
- `public/manifest.json` ekle: name, short_name, theme_color, icons (192px + 512px). "Add to Home Screen" mobile UX.

### S-9. robots.txt — Crawl-Delay
- Sitemap büyüdükçe `Crawl-delay: 1` ekle (acikkuran.com sub-fetch'leri için politeness).

### S-10. Open Graph Locale
- `/tr` için `og:locale: tr_TR`, `/en` için `en_US`. Mevcut implementation kontrol et.

---

## VI. KOD KALİTESİ & TEKNİK BORÇ

### T-1. 53 Inline `'KFGQPC'` Literal'i
- Refactor: `var(--font-kfgqpc)` ile değiştir + `next/font/local`'a tam migrate. Faz 8.1'de DEFERRED edilmişti — düzeltme zamanı geldiğinde.

### T-2. SSR-safe `useState` Pattern Audit
- 22 hook dosyasında `useState(() => window.X)` veya `useState(localStorage.getItem(...))` kalmış mı son taraması.

### T-3. Tool Overlay Pattern — Normal Flow Refactor
- Uzun vadeli: tüm tool overlay'lerini `position: fixed inset:0` yerine normal flow + page layout'a refactor et. Bu yapıldığında:
  - Visual breadcrumb component eklenebilir (Faz 7.8 deferred)
  - Browser back button çalışır
  - Print friendly
  - Mobile experience iyileşir

### T-4. i18n Key Parity
- `next/public/i18n/tr.json` ve `en.json` aynı key set'i mi? Script: `diff <(jq -r 'paths|join(".")' tr.json | sort) <(jq -r 'paths|join(".")' en.json | sort)`.

### T-5. Image Optimization — Per Tool icon SVG
- Tool browser'daki icon'lar inline SVG. Çoğu repeat — sprite olarak optimize et veya `next/image` SVG handling.

### T-6. Bundle Analyzer
- `@next/bundle-analyzer` kur (Faz 8.3 deferred). Per-route bundle size raporu.

### T-7. Edge Runtime Audit
- API route'lar + OG image route'lar edge runtime'da. Cold start time ölçümü gerekli.

### T-8. CSS Variables — Token Sync
- `tokens.js` (JS) ve `globals.css` (CSS variables) sync mi? `--color-gold` vs `COLORS.gold` aynı değer mi?

---

## VII. ⭐ 10/10 SITE — STRATEJİK İÇERİK / GENİŞLEME ÖNERİLERİ

**Bağlam:** Mevcut site teknik altyapı (SEO, performance, accessibility) açısından zaten 8/10. 10/10 olmak için **içerik derinleştirme + kullanıcı tutma + paylaşılabilirlik** boyutları gerekir. Aşağıdaki öneriler ürünü "araçlar koleksiyonu"ndan "Kur'an çalışma platformu"na taşır.

### ⭐ İ-1. Per-Surah Landing Page Upgrade (öncelik 1)
Şu an `/oku/[surah]` sadece ReadingMode overlay'i açıyor. Asıl sayfa SEO için boş. **Eklenecek (server-rendered, ReadingMode'un üstünde scroll'lanabilir):**

- **Sure özeti** (~200 kelime TR + EN) — ana temalar, iniş dönemi, en bilinen ayetler
- **Tarihsel bağlam** — Mekkî/Medenî, iniş sırası, anekdotlar
- **Ana temalar** — chip'ler (örn. Bakara: hidayet, ehl-i kitap, kıssa-i Adem, namaz, Beytullah)
- **Önemli ayetler** — Bakara için: Ayet-el Kürsî (255), 286 (kapanış), 165-167; tıkla → o ayete jump
- **İlgili tool'lar** — "Bu surede İbrahim kıssası → Kıssa Atlas'a git"
- **Sebebi nüzul** notları (varsa) — disclaimer ile
- **Önceki/sonraki sure** — visible navigation (SurahPagination'ı sr-only'den çıkar)

**Etkisi:** Her sure sayfası ~500+ kelime → SEO long-tail keyword'ler için pillar content. Faz 7.17 backlog'unun büyük kısmı.

### ⭐ İ-2. Tool Sayfaları İçin Long-Form Intro (öncelik 2)
Şu an tool sayfası tıklanınca direk overlay. Server-rendered intro paragraph yok (PageHeading sr-only).

**Eklenecek (overlay'in ÜSTÜNDE, scroll'lu hero):**
- Tool nedir (50 kelime)
- Nasıl kullanılır (100 kelime + screenshot)
- Notable findings — tool'un en şaşırtıcı 3 bulgusu (preview)
- Metodoloji + kaynaklar
- "Aracı aç" CTA — overlay'i başlat

**Format örneği** (`/atlas/kissa` için):
> # Kıssa Atlası — Kur'an'daki Peygamber Kıssaları
> Kur'an, dört ana peygamberin (Yusuf, Musa, İbrahim, İsa) hayatlarını lineer bir biyografi olarak değil, **parça parça** anlatır. Aynı kıssa farklı surelerde farklı açılardan tekrar eder. Bu atlas, hangi sahnenin hangi surede geçtiğini görselleştirir.
> ## Nasıl kullanılır
> [Sahne tıkla → ayet preview]
> ## Şaşırtıcı bulgular
> 1. Yusuf kıssası tek bir surede tam anlatılır...
> 2. Musa kıssası 32+ ayrı sahnede tekrar eder...
> ## Metodoloji
> [Klasik tefsir referansları + kümeleme yöntemi]
> [Aracı Aç →]

**Etkisi:** Her tool sayfası ~250 kelime → Google için "interactive tool" + "explanatory content" dual signal. Lighthouse SEO score boost.

### ⭐ İ-3. Daily Verse / Günün Ayeti
Homepage'de sticky veya hero altında **rotating** günün ayeti (server-rendered, gün bazlı deterministic).
- Format: Arapça + meal + sure:ayet + 1 paragraf bağlam
- Click → o sure sayfasına link
- Sosyal paylaşım butonu

**Etkisi:** Geri dönen kullanıcı için ritüel, daily engagement metric, SEO için daily-fresh content sinyali.

### ⭐ İ-4. Search — Global Cross-Content
`/arama?q=...` route. Kapsam:
- Sure adları, isimler (peygamber, sahabe), kavramlar
- Ayet metni (Arapça transliteration + meal)
- Tool isimleri
- Glossary terimleri

**Implementation:** İlk versiyon client-side `lunr.js` indexed (pre-built JSON). Daha sonra: Algolia/Meilisearch.

**Etkisi:** SearchAction schema.org desteklenir → Google sitelinks searchbox'ı. Internal search log → user intent data.

### ⭐ İ-5. Bookmark / Favoriler
LocalStorage tabanlı:
- Ayet bookmark (sure:ayet)
- Sure bookmark
- Kavram bookmark (ConceptGraph node)
- Reading plan progress

UI: Navbar'da kalp ikonu → drawer/modal listing.

**Etkisi:** Stickiness — kullanıcı kendi koleksiyonunu oluşturduğunda site'e bağlanır.

### ⭐ İ-6. Reading Plans / Okuma Planları
`/plan` route:
- 30-Day Quran (hatim) — her gün 1 cüz
- Tematic plan — "Sabır ile ilgili 30 ayet"
- Yusuf kıssası plan — 10 günde tüm sahneler
- Custom plan oluşturucu

Her plan: ilerleme tracker (localStorage), ICS calendar export, daily email opt-in (post-MVP).

**Etkisi:** Recurring user, mission-driven engagement, sosyal paylaşım ("Day 12/30").

### ⭐ İ-7. Comparative Meal Side-by-Side
Şu an reading mode'da tek meal görünür. Yan yana karşılaştırma:
- Diyanet × Elmalılı × Yazır × Suat Yıldırım × Edip Yüksel
- Anahtar kelimelerin (örn. "kafir", "salat") farklı çevirileri vurgulanır
- Click word → tool-tip: bu kelime hangi meal'de nasıl çevrilmiş

**Etkisi:** Akademik kullanıcı için lüks özellik. Furuk Atlası ile sinerji.

### ⭐ İ-8. Audio Quality Upgrade — Reciter Variety + Word-Sync
Mevcut: 6 reciter, karaoke (per CLAUDE.md memory: gold bg + cream + glow word highlight onaylı).
**Genişletme:**
- 12+ reciter (Mishary Rashid, Sudais, Maher al-Muaiqly, Hudhaify, Aboubakar Shatri, vs.)
- Reciter karşılaştırma — aynı ayeti yan yana 2 reciter
- Word-level audio sync downloadable as MP3 (offline listening)
- Custom playlist — kullanıcı ayet/sure seçer, sıralı oynat

### ⭐ İ-9. Glossary / Sözlük
`/sozluk` route — Quranic terms + classical Islamic terminology:
- Sünnetullah, esbâb-ı nüzûl, mukattaa, fasıla, iltifât, makasıd, vs.
- Her terim için: Arabic, transliteration, definition, ilk kullanım, related verses, source
- Search/filter
- Tool/section cross-link (Sünnetullah → /atlas/sunnetullah)

**Etkisi:** SEO long-tail (her terim ayrı sayfa). Akademik authority signal.

### ⭐ İ-10. About / Hakkında + Methodology
`/hakkinda` — Site'in arkasındaki vizyon, metodoloji, kaynaklara yaklaşım, akademik nüans politikası (eleştirel notlar neden var).
`/metodoloji` — Detaylı: korpus kaynağı, ayet sayım kararları, semantic embedding modeli (bgem3), Leeds verification süreci, Bucaillism eleştirisine cevap.

**Etkisi:** Trust/credibility. Akademik atıf kabul edilebilirliği. Bias şüphesini önler.

### ⭐ İ-11. Blog/Articles — `/yazi/[slug]`
Long-form deep dives (1500+ kelime):
- "Bakara 2:255 — Ayet-el Kürsî'nin İçindeki 17 Allah İsmi"
- "Mukattaa Harflerinin 14 Asrlık Sırrı: Modern Filolojik Bakış"
- "Sound Symbolism in Quranic Arabic — A Cognitive Linguistics Approach"
- "Why the Quran Doesn't Have a Foreword — A Comparative Religious Studies Perspective"

Her yazı: author/date, schema.org Article, related tools/sections, comments (Disqus opsiyonel post-MVP).

**Etkisi:** Topical authority. Long-tail SEO. Repeat traffic. Sosyal media share-bait.

### ⭐ İ-12. Email Newsletter
Subscribe footer + dedicated page. Haftalık:
- 1 günün ayeti haftası
- 1 yeni tool spotlight
- 1 yeni blog yazısı
- 1 user spotlight (community)

**Tech:** Buttondown / ConvertKit / Mailchimp.

### ⭐ İ-13. Multilingual Roadmap
Şu an TR + EN. Beklenen yüksek talep:
- Arabic native — mushaf okuma araçları + scholarly content
- Indonesian — dünyanın en büyük Müslüman nüfusu
- Urdu — Pakistan, Hindistan
- French — Maghreb + diaspora

Faz: önce static UI çevirisi, sonra meal/content lokalizasyonu.

### ⭐ İ-14. Community / Discord + Forum
Site dışında kalmasın — `/topluluk` route'undan link:
- Discord server (real-time discussion)
- Discourse forum (long-form, indexed by Google)

**Etkisi:** Stickiness, contributor pool, organic content (user-generated → SEO).

### ⭐ İ-15. Print / PDF Export
- ReadingMode'tan "PDF olarak indir" — seçili sure mushaf PDF (KFGQPC'li)
- Tool'tan "Bu görüntüyü indir" — ConceptGraph snapshot PNG
- Sure intro page → "Yazdır"

**Etkisi:** Offline kullanım, eğitim/öğretmen use-case.

### ⭐ İ-16. Comparative Religious Studies Mode
Niche ama yüksek SEO + authority potansiyeli:
- "Kur'an'da Yusuf vs Tora'daki Yosef"
- "İsa anlatısı: Kur'an vs İnciller"
- "Tufan: Kur'an, Tora, Gilgamesh"

Akademik ton + disclaimer + karşılaştırmalı tablo + ayet/pasaj eşleştirme. Disinterested comparison; polemic değil.

### ⭐ İ-17. API / Developer Mode
`/gelistirici` veya `/api/v1/...`:
- Public API: GET surah/{n}, GET verse/{s}/{a}, GET concept/{name}
- Rate limit, API key (opsiyonel)
- Embed widget: <script src="qurancodex.com/embed/verse/2/255"></script>
- OpenAPI spec

**Etkisi:** Backlinks from developer projects, SEO referral, partnership.

### ⭐ İ-18. Dark/Light Theme Toggle
Mevcut dark-only. Light theme implement (akşam kullanıcı için bile dark mı? Açık/kapalı seçeneği lüks).
- `prefers-color-scheme` respect
- localStorage override
- Print için zorunlu light theme (zaten standard)

### ⭐ İ-19. Mobile App — PWA → Native
PWA'dan başla (S-8). Sonra Capacitor/React Native wrapping → App Store + Google Play. Offline mushaf okuma, push notifications, daily verse widget.

### ⭐ İ-20. Donation / Support
`/destekle` route:
- One-time donation (Stripe/Payoneer)
- Recurring (Patreon/Buy Me a Coffee)
- "Bu siteyi yaşatın" appeal — şeffaf maliyet açıklaması
- Donor wall (opt-in)

**Etkisi:** Sustainability, no-ads commitment, trust signal.

---

## VIII. ÖLÇÜM & PRİORİTİZASYON

### Önerilen Sıralama (90 günlük yol haritası)

**Ay 1 — Kritik fixleri kapat + foundation:**
- K-1 (hydration), K-2 (palette), K-3 (mobile meal), K-4 (TR/EN metadata)
- Ö-2, Ö-3, Ö-7 (önemli UX'ler)
- S-1 (a11y) — Lighthouse score boost
- ⭐İ-1 (sure landing page) — 5-10 popüler sure ile başla
- ⭐İ-3 (daily verse)

**Ay 2 — İçerik derinleştirme:**
- ⭐İ-2 (tool intros — 36 tool × 250 kelime)
- ⭐İ-9 (glossary)
- ⭐İ-10 (about + methodology)
- ⭐İ-11 (ilk 5 blog yazısı)
- Faz 7.17 backlog devam

**Ay 3 — Engagement + scale:**
- ⭐İ-4 (search)
- ⭐İ-5 (bookmarks)
- ⭐İ-6 (reading plans)
- ⭐İ-7 (comparative meal)
- ⭐İ-12 (newsletter)
- PWA (S-8)

**Sonraki çeyrek:**
- ⭐İ-13 (multilingual)
- ⭐İ-14 (community)
- ⭐İ-15-20

### Başarı KPI'ları
- **SEO:** Lighthouse SEO score 95+, Organic search traffic 3-aylık 5× artış, sitelinks görünür
- **Engagement:** Avg session duration > 4 dakika, bounce < 50%, pages/session > 3
- **Stickiness:** Returning visitor % > 30%, bookmark/reading-plan kullanım > 10%
- **Authority:** Backlink growth 50+ unique domains, akademik referans (Google Scholar)
- **Conversion:** Newsletter signup rate > 2%, donation rate > 0.5% (opsiyonel)

---

## IX. NOTLAR — Bulgular Dışında Gözlem

1. **Akademik nüans** zaten çok güçlü (`section-25.png` "Bucaillism" disclaimer'ı). Bu, sitenin **en büyük farklılaştırıcısı**. 10/10 site için bunu **vitrine çıkar** — Hero altında küçük bir "Bizim Yaklaşımımız" bandı, About page'de detaylı manifesto.

2. **Visual identity** (gold + emerald + cosmic black) tutarlı ve premium. Sadece K-2 (pembe peygamber chip) anomali.

3. **Tipografi** (Playfair Display + Inter + KFGQPC) çok iyi seçim. KFGQPC native Quranic glyph kalitesi rakipsiz.

4. **Mobile experience** beklendiği kadar düzgün; CLAUDE.md §14 disiplini ödülünü vermiş.

5. **Reading mode** ürünün en güçlü yanı — mushaf two-page layout + karaoke + tafsir + interlinear hepsi bir arada. Bu olay başlı başına viral potansiyele sahip.

6. **Tool çeşitliliği** (38 tool) impressive. Kategorize edilmiş (atlas/graf/araç) — bilişsel yük yönetilmiş.

7. **Eksiklik:** **Geri-dönüş loop'u zayıf** — kullanıcı bir tool'u kullanır, çıkış noktası belirsiz; ana sayfaya scroll geri dön gerekir. ⭐İ-1 (sure landing) bunu çözecek hub görevi görür.

---

**Rapor sonu.** 60+ aksiyona dönüştürülebilir bulgu/öneri. Sıralama Bölüm VIII'de.

---

# EK A — Visual Audit Agent (qc-visual-auditor) Bulguları

> **Kaynak:** `docs/reviews/2026-05-24-next-migration-visual-audit.md` (268 satır, kod tabanı statik denetimi)
> **Yöntem:** Token adoption rate, layout pattern, glassmorphism tutarlılığı, gradient ritmi, mobile pattern, codemod hedefleri
> **Toplam bulgu:** 5 kritik (K) + 8 önemli (O) + 10 polish (P) + 10 iyi yapılmış (İ)

## EK A.1 — Kritik (Hemen)

### EK-K1. KissaAtlas overlay token bypass'ı (`KissaAtlas.jsx:179-200`)
- **Sorun:** `OVERLAY_BASE` ve `OVERLAY_HEADER` token'larını kullanmıyor; kendi 60px header'ını inline yazıyor (token 54px). Background `#06080e` (token `#0a0a1a`), blur `16px` (token `20px = BLUR.md`), border `rgba(255,255,255,0.07)` (token `glassBorderSoft = 0.06`). Sonuç: KissaAtlas'a girince Navbar altında 6px içerik kayması; header tonu DuaVerses/WowFacts'tan koyu görünür.
- **Fix:** `style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}` + `style={OVERLAY_HEADER}`. ProphetAtlas referans alınabilir (zaten `CLOSE_BTN`'i doğru kullanıyor).

### EK-K2. Tool header yükseklikleri tutarsız (54 / 60 / 64 / absolute)
- **Sorun:**
  - `WowFacts.jsx:788` — 54px ✓
  - `DuaVerses.jsx:391` — 54px ✓
  - `KissaAtlas.jsx:198` — 60px ✗
  - `VerseGraph.jsx:1010-1015` — header `position: absolute`, hesap edilebilir yükseklik yok, search input SVG canvas üstüne biniyor
  - `ReadingMode.jsx:2228` — 64px (kendi tam ekran; tolere edilebilir ama 6px zıplama hissedilir)
- **Fix:** Tüm tool overlay header'ları **54px**'e sabitlensin. VerseGraph absolute → DuaVerses tipi flex-shrink:0 normal header.

### EK-K3. Section'lar arası "200px gradient overlap" eksik
- **Sorun:** `globals.css:209-242`'de `.gradient-divider` (96px → mobile 64px, gold mid-line ile cosmic→navy fade) ve `.gradient-divider-reverse` **tanımlı**, ama `next/src/` taramasında **hiç çağrılmıyor**. Homepage 19 section sert renk kesimiyle dizilmiş. Üstelik dark/light ritmi bozuk:
  - ToolsHighlight(L) → LinguisticDNA(L) — iki ardışık light
  - SoundArchitecture(L) → PsychologySection(L) — iki ardışık light
  - HiddenArchitecture(D) → ScientificSigns(D) — iki ardışık dark (aynı renk, sınır kayboluyor)
  - Highlights(D) → HumanDefinition(D) — iki ardışık dark
- **Fix:** `app/[locale]/page.js` içinde her section arasına `<div className="gradient-divider" />` (önceki dark → sonraki light) veya reverse. Ardışık aynı-renk için "soft mid-line only" mini varyantı tanımla.

### EK-K4. `.btn-primary-gold` CSS class'ı yalnız Hero kullanıyor
- **Sorun:** Hero `className="btn-primary-gold"` doğru kullanırken Conclusion CTA (`Conclusion.jsx:178-200`), Navbar desktop Oku, mobile menu Oku (`Navbar.jsx:1097-1126, 1251`) inline `background: linear-gradient(135deg, #c9973a → #b8860b → #9a6f0a)`, `color: '#1c0f00'`, `boxShadow: '0 0 20px 4px rgba(180,130,40,0.3)'` duplicate ediyor.
- **Fix:** Conclusion + mobile menu Oku → `className="btn-primary-gold"`. Navbar outline Oku → `.btn-ghost-dark` (zaten `globals.css:175`'te tanımlı).

### EK-K5. 19 yerde inline `'KFGQPC', 'Amiri Quran', serif` — §13.2 mutlak kural ihlali
- **Dosyalar:** `QuranDua.jsx:246, 300, 361, 404, 420, 560, 736, 847`, `QuranRhetoric.jsx:592`, `HiddenArchitecture.jsx:330`, vs.
- **Sorun:** Kur'an metni için tek geçerli yazım `fontFamily: FONTS.quran` (§13.2). 19 yer ayrı ayrı edit gerektirir, font değişikliği için.
- **Fix:** Codemod — `"'KFGQPC', 'Amiri Quran', serif"` → `FONTS.quran`. Ayrıca `SurahComparator.jsx:214, 315, 834, 881` inline `'Amiri', serif` → `FONTS.arabic`.

## EK A.2 — Önemli

### EK-O1. 350+ ham hex + 1.300+ ham rgba — Token adoption %66
- **En sık:**
  - `'#d4a574'` → `COLORS.gold` (~80 yer)
  - `'#94a3b8'` → `COLORS.silver` (~60 yer)
  - `'#e8e6e3'` → `COLORS.offWhite` (~45 yer)
  - `'rgba(212,165,116,0.15)'` → `COLORS.goldAlpha15`
  - `'rgba(255,255,255,0.05/0.06/0.08/0.1)'` → `COLORS.glassBg / glassBorderSoft / glassBgStrong / glassBorder`
- **Fix:** AST-tabanlı codemod sprint — tek geçişte temizlenir.

### EK-O2. 123 inline `transition: 'all 0.Xs'` — TRANSITION token bypass
- **Sorun:** 6 farklı varyasyon (0.15, 0.18, 0.2, 0.25, 0.3, 0.35s); `TRANSITION.fast/base/slow` token'ları (0.15/0.2/0.3) kullanılmıyor.
- **Fix:** Codemod ile `\`all \${TRANSITION.fast}\`` veya Tailwind `transition-colors duration-150`.

### EK-O3. borderRadius scale dışı — 16, 18, 20px ad-hoc
- `Conclusion.jsx:93`, `PsychologySection.jsx:514`, `ScientificSigns.jsx:255`, `HumanDefinition.jsx:427`, `ProphetMap.jsx:237` — 16px
- `ProphetAtlas.jsx:2906` — 18px
- `HiddenArchitecture.jsx:255`, `QuranRhetoric.jsx:441`, `ScientificSigns.jsx:272` — 20px (RADIUS.pillSm = 20 var ama çağrılmamış)
- `ImpossibleRhythm.jsx:833, 837` — 3px (xs=4'ten küçük)
- **Fix:** 16→`RADIUS.xl(14)` veya `RADIUS.pillSm(20)`. 18 → 14/20. 3 → `RADIUS.xs(4)`.

### EK-O4. Glassmorphism inline & CSS-class iki ayrı kanal
- `Footer.jsx:130, 161` — `className="glass-card"` ✓
- `Conclusion.jsx:90-97` — ne `glass-card` ne `GLASS_CARD`; border 2px (token 1px), `borderRadius: '16px'` ad-hoc
- DuaVerses, WowFacts, KissaAtlas — 3 farklı `'rgba(8,10,18,0.95)' / '(8,10,18,0.96)' / '(8,9,26,0.95)'` backdrop kombinasyonu (aynı tema, 3 farklı renk).
- **Fix:** §13.7'ye sadık kalın — `OVERLAY_HEADER.background` zaten doğru değer.

### EK-O5. Navbar dropdown hover renkleri 3 yerde duplicate (Navbar.jsx:815-816, 895-896, 999-1000)
- Hover background `0.07 / 0.10 / 0.18` arasında oynuyor — hangisi neye karşılık geliyor belirsiz.
- **Fix:** `dropdownItemHover` helper + tek `goldAlpha07` token.

### EK-O6. DuaVerses + WowFacts mobile pattern (§14) eksik
- `WowFacts.jsx:780-820` — `padding: '0 20px'` sabit, search input maxWidth 480 sabit, `isMobile` state yok
- `DuaVerses.jsx:382-487` — aynı problem, grid `minmax(min(100%, 520px), 1fr)` ama gap/padding sabit
- **Fix:** §14.1 SSR-safe `isMobile` ekle; padding `isMobile ? '12px' : '20px'`, kart minmax `isMobile ? 'min(100%, 280px)' : 'min(100%, 340px)'`. KissaAtlas örnek model.

### EK-O7. Ardışık aynı-renk section'lar (page.js:52-75)
- 4 yerde light/light veya dark/dark (EK-K3'te listelendi).
- **Fix:** Section `dark` prop'larını revize et VEYA EK-K3 ile beraber "mid-line only" mini-divider.

### EK-O8. 16+ inline `"'Playfair Display', serif"` — FONTS.display bypass
- `HiddenArchitecture.jsx:933`, `QuranDua.jsx:532, 601`, `SoundArchitecture.jsx:243, 405, 433, 620, 723, 738, 805, 847, 860, 1045`, `ScientificSigns.jsx:329`, `VerseGraph.jsx:1515, 2281`, `ReadingMode.jsx:5241, 6772, 6783, 6808`
- **Fix:** Codemod → `FONTS.display`.

## EK A.3 — Polish

- **EK-P1.** `PathCard.jsx:67` `minHeight: '215px'` — mobile'da `minHeight: isMobile ? 'auto' : '215px'`.
- **EK-P2.** AllTopics legend icon mobile'da 18px'e indir.
- **EK-P3.** ToolsHighlight "Tüm Araçları Gör" CTA — `boxShadow: '0 0 16px goldAlpha04'` → `goldAlpha15` (durağan), hover `goldAlpha25`.
- **EK-P4.** Hero CTA `clamp(13px,1.5vw,15px) clamp(32px,6vw,56px)` vs Conclusion `14px 36px` sabit — eşitle.
- **EK-P5.** Footer "Sayfaları Keşfet" — `text-sm` (14px) yerine `text-xs` mu daha iyi? Karar tasarım tonuna göre.
- **EK-P6.** Mobile menu close button (Navbar.jsx:1209-1232) — `CLOSE_BTN` token kullanmıyor (44×44 vs 36×36). Yeni `CLOSE_BTN_LG` token tanımla veya spread+override.
- **EK-P7.** Badge etiket opacity 0.6/0.7 tutarsızlık. `BADGE_LABEL` token tanımla.
- **EK-P8.** ParticleBackground sadece Hero'da; CLAUDE.md §4 "**between sections** also" diyor. Highlights/Conclusion gibi reflection section'larda kullan.
- **EK-P9.** `Conclusion.jsx:95` verse box `boxShadow` inline; `box-glow-gold` CSS class mevcut (`globals.css:196`) — class'ı kullan.
- **EK-P10.** HiddenArchitecture mobile sidebar pattern (§14.3) yok mu? Audit gerekli.

## EK A.4 — İyi Yapılmış (referans)

- **EK-İ1.** `tokens.js` 318 satır, senior-grade tasarım sistemi (softGoldAlpha 16 varyant, paperX 12 reading-mode rengi, RADIUS 9 değer, Z_INDEX 4 katman, BLUR 3 değer, TRANSITION 3 değer).
- **EK-İ2.** Hero/PathCards/AllTopics/ToolsHighlight tipografi tutarlılığı **gerçekten zarif** — aynı clamp H2, aynı offWhiteAlpha78 body, aynı 0.3em letter-spacing etiket.
- **EK-İ3.** OVERLAY_TITLE adoption %66 (37/56). EK-K1 fixlenirse %68'e çıkar.
- **EK-İ4.** Hero gradient halo + radial glow + particle + slow-rotating Islamic pattern — cinematic derinlik.
- **EK-İ5.** PathCard `whileHover` spring (stiffness:320, damping:24) + `whileTap: scale 0.985` — kaliteli mikro-etkileşim.
- **EK-İ6.** Footer "Sayfaları Keşfet" görsel uyumu (yeni eklenen — kusursuz entegre).
- **EK-İ7.** `CLOSE_BTN` token 37 yerde tutarlı.
- **EK-İ8.** ReadingMode day/night palette belgelenmiş ve kasıtlı (paperCream/Gold/Ink/Sepia/Red tuning'i).
- **EK-İ9.** `:focus-visible` baseline `globals.css:345-348` — accessibility tabanı doğru.

## EK A.5 — Genel Değerlendirme (Visual)

> **Senior-grade tasarım sistemi, %66 uygulama disiplini.** Eksiklerin tamamı eyleme dönüştürülebilir; hiçbiri yeniden tasarım gerektirmez. Bir codemod sprint'i (O1+O2+O8) + 4 kritik dosya fix'i (K1-K5) ile A+ seviyesine çıkar.
>
> **Eylem önceliği (visual axis):**
> 1. EK-K3 (gradient transitions) → cinematic ritmi geri getirir
> 2. EK-K1 + EK-K2 (overlay token bypass + header harmonization) → tool deneyimini bütünleştirir
> 3. EK-K4 + EK-K5 (CTA + KFGQPC codemod) → 30 dakika
> 4. EK-O1 + EK-O2 + EK-O8 (renk/transition/font codemod) → 1 günlük AST script sprint
> 5. EK-O6 (mobile pattern eksikleri) → DuaVerses + WowFacts'i KissaAtlas modeline taşı

---

# EK B — Content Audit Agent (qc-content-auditor) Bulguları

> **Yöntem:** Akademik gözle her section, tool page.js TITLE/DESC, i18n parity, ayet referansları
> **Toplam:** 6 kritik + 9 önemli + 12 iyileştirme + 10 iyi-yapılmış

## EK B.1 — Kritik (İçerik Yanlışları)

### EK-CK1. HiddenArchitecture.jsx — Uthmani encoding (KFGQPC ile uyumsuz)
- **Dosya:** `next/src/sections/HiddenArchitecture.jsx:28-72`
- **Sorun:** Fatiha ve Âyetel Kürsî inline metinlerinde `ٱ` (alef wasla, U+0671), `ۥ` (dagger waw), `ۦ` (dagger ya) karakterleri var. CLAUDE.md §13.15 ihlali — KFGQPC bu karakterleri "ص" veya tofu render eder.
- **Örnek:** `بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ`, `لَّهُۥ`, `بِإِذْنِهِۦ`
- **Fix:** `cleanArabic()` ile build-time normalize. Doğru: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ`.

### EK-CK2. ScientificSigns — Embriyoloji audio yanlış ayet
- **Dosya:** `next/src/sections/ScientificSigns.jsx:15`
- **Sorun:** `embryo: { surah: 23, ayah: 13 }` — ama tab içeriği ve i18n (tr.json:374, en.json:376) "23:14" diyor. 23:13 "nutfetin fî qarârin mekîn"; "nutfeyi alakaya çevirdik" 23:14'tedir.
- **Fix:** `TAB_VERSE.embryo = { surah: 23, ayah: 14 }`.

### EK-CK3. /arac/melekler DESC — Kur'an'da Geçmeyen İsimleri "Kur'an'da" Olarak Sunuyor
- **Dosya:** `next/src/app/[locale]/arac/melekler/page.js:9`
- **Sorun:** "Kur'an'da melekler — Cebrâil, Mikâil, **İsrâfil**, **Azrail** ve sınıfları" — İsrâfil ve Azrail Kur'an'da **isim olarak geçmez** (hadis/sonraki gelenek). Bu sınırı çiğneyerek hadis-kaynaklı isimleri "Kur'an'da" diye sunmak akademik dürüstlük açığı.
- **Fix:** "Kur'an'da Cebrâil ve Mikâil isimleriyle anılır; İsrâfil ve Azrail isimleri hadis ve klasik geleneğin katkısıdır" şeklinde nüanslandır VEYA fonksiyonel isimler ("vahiy meleği, sûr meleği, ölüm meleği") kullan.

### EK-CK4. /atlas/kadinlar — page.js DESC vs tools.jsx Çelişki
- **Dosyalar:** `app/[locale]/atlas/kadinlar/page.js:9` vs `data/tools.jsx:429`
- **page.js:** "Meryem, Asiye, **Hacer**, Belkıs ve daha fazlası"
- **tools.jsx:** "7 figür: Meryem, Asiye, **Havva**, Saba Melikesi (Belkıs), Sara, Musa'nın annesi, İmran'ın eşi" — Hacer YOK
- **Fix:** İki dosyayı tek kaynağa bağla; Kur'an'da isim-olarak geçmeyen kadınlar (Hacer, Asiye, Belkıs) için "klasik tefsirde adlandırılan" işaretle.

### EK-CK5. /arac/wow DESC — Bucaillism Nüansı Eksik
- **Dosya:** `next/src/app/[locale]/arac/wow/page.js:9`
- **Sorun:** "Modern bilimle **örtüşen** Kur'an ayetleri" — ScientificSigns `bucaillismFrame` ile apodictic "bilimsel mucize" iddiasını reddederken, WowFacts DESC aynı malzemeyi "örtüşen" diye sunuyor.
- **Fix:** "Modern bilimle paralel okunmuş Kur'an ayetleri ve dilbilimsel-tarihsel az bilinen olgular; akademik tartışmalar her kart altında nüanslı".

### EK-CK6. Rûm 30:1-4 Referansı Yanıltıcı
- **Dosya:** `next/src/i18n/tr.json:454`, `en.json:454`
- **Sorun:** Rum 30:1 mukattaa "Alif-Lâm-Mîm"dir; "Rumlar yenildi" anlatımı **30:2**'den başlar.
- **Fix:** `"reference": "Rum, 30:2-4"`.

### EK-CK7. ⚠️ Eksik: MathMiracle Section
- **Sorun:** CLAUDE.md §6'da listelenmiş MathMiracle section'ı (#2) `next/src/app/[locale]/page.js` import listesinde YOK. Counter pairs (hayat/ölüm, melek/şeytan, dünya/ahiret) sayısal mucize katmanı kayıp.
- **Karar gerekli:** Bilinçli kaldırma mı (apolojetik counter pair'ların akademik problemli olması) yoksa migration unutkanlığı mı? Eğer bilinçli → CLAUDE.md §6 update. Değil ise → section'ı eski Vite'tan port et + Leeds-verified veriyle.

## EK B.2 — Önemli (Eksik/Zayıf İçerik)

- **EK-CO1.** `/arac/buyruklar` "88 emir" sayısı kaynaksız — klasik fıkıh ~500 ahkâm ayeti söyler.
- **EK-CO2.** `/atlas/mesel` "~50 mesel" kaynaksız.
- **EK-CO3.** `/arac/sebebi-nuzul` "~570 ayet" kaynaksız (Süyûtî ~340-400).
- **EK-CO4.** `/atlas/nefs-mertebeleri` "kâmile" 7. makâm ekol nüansı yok (Necmeddin Kübra/Said Nursi geleneği: sâfiye).
- **EK-CO5.** `Füruk` Atlası transliterasyon tutarsız — `page.js: 'Füruk'` vs `tools.jsx: 'Furûk'`. Akademik literatür "Furûk".
- **EK-CO6.** `/arac/yeminler` DESC "**jaweb**-i kasem" yanlış yazım → "cevâb-ı kasem" (جواب القسم).
- **EK-CO7.** LivingPreservation EN/TR — Birmingham 568-645 tarih aralığı alt-sınır açık değil.
- **EK-CO8.** HistoricalProof Hâmân — tek ayet (Kasas 28:38) verilmiş; Kur'an'da 6 yerde geçer.
- **EK-CO9.** `/atlas/sunnetullah` DESC vague — Kur'anî terim (Ahzab 33:38, Fetih 48:23) atfı yok.

## EK B.3 — İyileştirme

- **EK-Cİ1.** ⚠️ **Tool page.js'ler i18n'e bağlı DEĞİL** — `/en/atlas/peygamber` rotasında DESC hâlâ TR. Faz 7 SEO açığı, EN organic kaybı. **Çözüm:** generateMetadata içinde `if (locale === 'en') return en-TITLE/DESC`.
- **EK-Cİ2.** DESC'lerin çoğu 80-120 char; Google SEO için 150-160 ideal.
- **EK-Cİ3.** Kadınlar Atlası "ve daha fazlası" → açık 7 isim ver.
- **EK-Cİ4.** Cennet & Cehennem DESC — 8 cennet / 7 cehennem sayıları eklenebilir.
- **EK-Cİ5.** Esmâ'ül-Hüsnâ DESC'e Tirmizî hadis kaynağı atfı ekle.
- **EK-Cİ6.** Renkler tool — Kur'an'da renk frekansı eşitsiz (zurq tek ayet Tâhâ 20:102; vird tek ayet Rahmân 55:37); "6 renk" listesi yanıltıcı.
- **EK-Cİ7.** Doğa Atlası "~40 unsur" kaynaksız — "QuranCodex sentezi" olarak işaretle.
- **EK-Cİ8.** Footer Popüler Sureler — Felak (113) / Nâs (114) ekle (Mu'avvizetân).
- **EK-Cİ9.** tools.jsx wow `descLongTr` — "kaynaklı, şaşırtan" → "kaynaklı ve şaşırtıcı".
- **EK-Cİ10.** KissaAtlas — tools.jsx "Musa, İbrahim, Yusuf, Nuh" vs page.js "Yusuf, Musa, İbrahim, İsa" çelişki.
- **EK-Cİ11.** Kavim Atlas — "Lût, Medyen" kavim değil; "Lût kavmi, Medyen halkı".
- **EK-Cİ12.** Diyalog Ağı "~300" kaynaksız — "QuranCodex sentezi".

## EK B.4 — İyi Yapılmış (Korunsun)

1. **`bucaillismFrame`** akademik dürüstlük altın standardı (Sardar, Bigliardi, Edis adlarıyla).
2. **`criticalNote` flag** her science tab'da (embriyolojide Moore Suudi baskısı, Galen-Musallam atfı, Bucaille tuz argümanı reddi).
3. **Cousteau hikayesinin reddi** (`ocean.criticalNote`).
4. **HistoricalProof üç vakanın akademik gücüne göre sıralanması** (Rum > Firavun > Hâmân).
5. **PsychologySection methodologyNote** (Frankl/Freud/Maslow paralelliklerinin "Kur'an öngördü" iddiasından kaçınması).
6. **ZeroRedundancy** Zerkeşî/Süyûtî/Râzî/İbn Âşur klasik tasnif.
7. **LinguisticDNA Şûrâ hibrit** (حم + عسق iki ayrı ayet, İtkân kaynaklı).
8. **livingPreservation Sana'a parşömeni** Sadeghi & Bergmann (2010), karbon-mürekkep ayrımı.
9. **Tüm ayet referansları** Quran.com spot-check uyumlu.
10. **Footer kaynakçası** geniş (Farrin, Corpus Coranicum, Leeds, Bucaille uyarılı, Zemahşerî, Zerkeşî, Birmingham, Süyûtî, Râzî, Tanzil).

---

# EK C — UX/Fonksiyonellik Agent (qc-ux-auditor) Bulguları

> **Yöntem:** Route flow, state machine, hydration, mobile pattern, i18n behavior, error boundaries
> **Toplam:** 7 kritik + 10 önemli + iyi yapılmış

## EK C.1 — Kritik

### EK-UK1. ⚠️ Tüm 36 Tool Route'unda `router.back()` Direct-Link Ziyaretçiyi Siteden Atıyor
- **Sorun:** Tool overlay close handler `router.back()` çağırıyor. Twitter/Google'dan `/tr/atlas/kissa`'ya gelen kullanıcı kapatınca **siteye değil önceki tab'a** dönüyor (browser history boş ise blank page).
- **Etki:** Bounce rate yüksek, paylaşım/referral trafik kaybı.
- **Fix:** `router.back()` → `router.push(\`/\${language}\`)` (veya `router.push('/')` + middleware redirect). 36 dosyada `*Route.jsx` (KissaAtlasRoute, ProphetAtlasRoute, vs.).

### EK-UK2. ⚠️ `/tr/oku/page.js` TITLE = 'Kur' (Apostrof Truncation HÂLÂ VAR)
- **Dosya:** `next/src/app/[locale]/oku/page.js:7`
- **Sorun:** Faz 7.2 bug fix sweep'i sırasında `/oku/page.js` (sure listesi, parametre yok) atlanmış. TITLE hâlâ truncate.
- **Fix:** `const TITLE = "Kur'an'ı Oku";` (çift tırnak).

### EK-UK3. ⚠️ `app/` Dizininde `not-found.js`, `loading.js`, `error.js` YOK
- **Sorun:** Geçersiz route → Next.js default 404. Yüklenirken spinner yok. Server error → boş ekran.
- **Etki:** UX cilası eksik; brand-tutarlı error/loading UI yok.
- **Fix:**
  - `app/not-found.jsx` — branded 404 (gold + cosmic-black + "Aradığınız sayfayı bulamadık")
  - `app/loading.jsx` — global loading spinner
  - `app/error.jsx` — error boundary ("Bir hata oluştu, [home]'a dön")

### EK-UK4. ReadingMode 19+ `useState(() => localStorage.getItem(...))` — SSR Hidrasyon Riski
- **Dosya:** `next/src/components/ReadingMode.jsx`
- **Sorun:** Lazy initializer'larda localStorage; SSR'da `localStorage undefined` → hydration mismatch. Component `dynamic({ ssr: false })` ile sarılmamış.
- **Fix:** Pattern: `useState(default)` + `useEffect(() => setState(localStorage.getItem(...)), [])`. VEYA ReadingMode'u `dynamic` ile `ssr: false` wrap et (leaflet pattern'i gibi).

### EK-UK5. `/oku/200` (Geçersiz Sure) `notFound()` Çağırmıyor
- **Dosya:** `next/src/app/[locale]/oku/[surah]/page.js`
- **Sorun:** Geçersiz sure numarası Fâtiha'ya düşüyor ama metadata "Sure Bulunamadı" diyor — inconsistent.
- **Fix:** `if (!valid) notFound();` import `next/navigation`.

### EK-UK6. ToolsShowcase "Keşfet" / "Araçlar" CTA'ları Ölü
- **Sorun:** `OVERLAY_ROUTES`'a `exploreMenu`/`toolsMenu` key'leri eklenmemiş; çağrı sessizce başarısız.
- **Fix:** Bu CTA'lar Navbar mega-menu açan event veya scroll-to action olarak yeniden tanımlanmalı.

### EK-UK7. Cross-Tool Jump Hâlâ `window.dispatchEvent` ile
- **Dosyalar:** `ConceptGraph.jsx`, `WowFacts.jsx`, `VerseGraph.jsx`
- **Sorun:** Bir tool'dan diğerine geçiş hâlâ event-based; URL değişmiyor → SEO için inconsistent state, paylaşılamaz.
- **Fix:** `router.push('/tr/graf/kavram?q=...')` pattern'ı; `useSearchParams` ile karşı tarafta okuma.

## EK C.2 — Önemli

- **EK-UO1.** Navbar **1592 satır + 34 ölü overlay state** + 33-dependency'li useEffect. Migration sonrası ~1000 satır temizlenebilir (eski event-based overlay state machine kalıntıları).
- **EK-UO2.** Footer "Sayfaları Keşfet" **sadece 20/38 tool** listeli — iblisSatan, ilkSon, melekler, retorik internal-linking dışında.
- **EK-UO3.** Locale switcher → URL persist (audit gerekli — Navbar `toggleLanguage` doğru implement mi?).
- **EK-UO4.** SurahPagination EN locale'de hâlâ `SURAH_NAMES_TR` kullanıyor.
- **EK-UO5.** EN dictionary lazy load → 50-100ms TR flash on EN locale boot.
- **EK-UO6.** Tool overlay open → audio (ReadingMode) pause olmuyor; background'da çalmaya devam.
- **EK-UO7.** Modal/dialog Escape key handling — tüm tool'larda var mı? audit.
- **EK-UO8.** Tab focus order ve focus-trap modallarda — keyboard nav audit.
- **EK-UO9.** Empty state — ConceptGraph node tıkla, veri yoksa? API meal fail? Toast / empty state'ler yok.
- **EK-UO10.** Mobile tooltip (kelime hover) — tap-and-hold yerine tap-to-toggle.

## EK C.3 — İyi Yapılanlar

1. Middleware locale routing (matcher kurulu).
2. 228 statik surah HTML pre-rendered (Faz 6.2).
3. `pageMetadata` + JSON-LD per-route (Faz 7.1, 7.2).
4. `OVERLAY_BASE` token sistemi (kullanım %66 ama tanım sağlam).
5. PathContext SSR-safety (`typeof window` guard).
6. 6-reciter audio fallback chain (`useAudioWithFallback`).

---

# EK D — KONSOLİDE EYLEM LİSTESİ (3 ajan + screenshot)

## D.1 — Hot Path (Bu Hafta)

| # | Bulgu | Kaynak | Etki | Eylem |
|---|---|---|---|---|
| 1 | `/tr/oku/page.js` TITLE = 'Kur' truncation | UX-K2 | SEO + sosyal kart bozuk | TITLE'ı çift-tırnak ile düzelt |
| 2 | Tool route `router.back()` direct-link kullanıcıyı atıyor | UX-K1 | Bounce, paylaşım kaybı | 36 *Route.jsx'te `router.back()` → `router.push('/')` |
| 3 | HiddenArchitecture Uthmani encoding | Content-K1 | KFGQPC render bozulur | `cleanArabic()` build-time normalize |
| 4 | ScientificSigns audio 23:13 vs içerik 23:14 | Content-K2 | Yanlış ayet seslendiriliyor | `embryo.ayah = 14` |
| 5 | /arac/melekler DESC Kur'an-dışı isimler | Content-K3 | Akademik dürüstlük | DESC nüanslandır |
| 6 | /tr/oku/36 React hydration error #418 | Benim-K1 | Console error, INP regression | useState lazy init audit |
| 7 | Peygamber Atlas active state pink | Benim-K2 | Palette ihlali | active border → COLORS.gold |
| 8 | `not-found.js`, `loading.js`, `error.js` YOK | UX-K3 | Generic 404, no spinner | 3 dosya ekle (branded) |

## D.2 — Codemod Sprint (1 Gün)

Tek script ile temizlenir:
- 350+ ham hex → `COLORS.*` token
- 1.300+ ham rgba → `COLORS.*Alpha*` token
- 123 inline `'all 0.Xs'` → `TRANSITION.fast/base/slow`
- 19 inline `'KFGQPC', 'Amiri Quran'` → `FONTS.quran`
- 16+ inline `'Playfair Display'` → `FONTS.display`

Tool: `jscodeshift` veya `ts-morph` AST transformation.

## D.3 — Major Refactors (Ay 1)

| # | Görev | Effort | Etki |
|---|---|---|---|
| 1 | Tool page.js TR/EN parity (35 dosya) | 2-3 gün | EN SEO kazanımı |
| 2 | Section gradient transitions (`.gradient-divider`) | 1 gün | Cinematic ritim |
| 3 | Overlay header harmonization (54px universal) | 1 gün | Tool deneyimi bütünleşir |
| 4 | KissaAtlas → OVERLAY_BASE token migration | 4 saat | §13.10 uyumlu |
| 5 | Mobile pattern: DuaVerses + WowFacts | 1 gün | §14 uyumlu |
| 6 | ReadingMode mobile meal toggle | 1 gün | Mobile UX kurtarma |
| 7 | Navbar ölü state temizlik (~1000 satır) | 1 gün | Code clarity |
| 8 | MathMiracle section karar + restore | 1 gün | İçerik hub'ı |

## D.4 — Ay 2-3 (Stratejik İçerik)

⭐ İ-1, İ-2, İ-3, İ-4, İ-9, İ-10, İ-11 (Bölüm VII) — sure landing, tool intros, daily verse, search, glossary, about, blog.

## D.5 — Önceliklendirme Mantığı

**Yüksek etki / düşük effort:** D.1 #1-#7 (yarım gün ile çoğu)
**Yüksek etki / yüksek effort:** D.3 #1, #6, #8 (TR/EN parity, mobile meal, MathMiracle)
**Sistemik temizlik:** D.2 codemod sprint (1 gün, bir geçişte)
**Uzun vadeli yatırım:** D.4 stratejik içerik (çeyrek bazlı)

---

**Rapor sonu.** Konsolide bulgu sayısı: 21 kritik + 27 önemli + 32 polish + 20 ⭐ stratejik. Sıralama D.5'te.

