# Next.js Migration Plan — QuranCodex

**Mevcut durum:** React 19.2 + Vite 7.3 SPA, Tailwind v4, Framer Motion, React Context i18n, 50+ overlay/tool, localStorage-heavy, KFGQPC Arabic font, audio karaoke, ~165 statik route potansiyeli (114 sure + tools).

**Hedef:** Next.js 16 (App Router) — SSG-first, RSC nerede mümkünse, client components nerede gerek varsa.

**Toplam efor tahmini:** 4-6 hafta full-time (faz bazlı paralelleştirilebilir).

**Strateji kararı:** Big-bang yerine **kademeli paralel migration** — yeni `next/` klasöründe Next.js projesi kur, route route taşı, son adımda cutover. Vite proje migration süresince çalışır kalır.

---

## Pre-existing Technical Debt (Mutlaka Okunmalı)

> **UNUTMA:** Migration sırasında çözülmesi planlanan ön-mevcut sorunlar `tasks/copilot_findings.md`'de detaylı listelenmiştir. 2026-05-21 commit'inde 34 lint error sıfırlandı, **56 warning bilinçli olarak deferred** edildi çünkü migration ile doğal olarak çözülecek. Faz başlamadan önce `tasks/copilot_findings.md`'nin **"Deferred to Next.js migration"** bölümünü oku.

**Deferred item'ların Faz eşleştirmesi:**

| Copilot finding | Migration fazı | Çözüm yaklaşımı |
|---|---|---|
| `react-refresh/only-export-components` × 43 (data/exploreCategories.jsx, data/tools.jsx) | **Faz 1.3 + 6.1** | RSC'lerde data import'u + dedicated `lib/data/` modülleri; component + helper karışık export ortadan kalkar |
| `react-refresh/only-export-components` × 3 (PathContext, LanguageContext, SectionWrapper) | **Faz 2.1 + 2.2** | Context provider'lar `'use client'` boundary'sine ayrılır; helper'lar ayrı dosyalara taşınır |
| `react-hooks/exhaustive-deps` × 13 (ConceptGraph, ReadingMode, SebebiNuzul, SurahComparator, VerseGraph) | **Faz 4.5** (Route dönüşüm pattern'ı sırasında) | Her overlay route'a dönüşürken dep array'ler yeniden değerlendirilir; gereksizler temizlenir, eksikler eklenir |
| `dangerouslySetInnerHTML` × 18+ (ReadingMode tajweed, TafsirPanel, ProphetAtlas) | **Faz 4** (manuel review #1, #2) | Merkezi `safeHtml()` helper + DOMPurify entegrasyonu; sanitize boundary açıkça tanımlanır |
| ProphetAtlas design token drift (CLAUDE.md §13.1 ihlali) | **Faz 4.2** (atlas tool migration sırasında) | ProphetAtlas → `app/atlas/peygamber/page.jsx` taşınırken hardcoded hex/rgba'lar `COLORS.*` token'larına çevrilir |

**Aksiyon:** Her ilgili faza başlarken `tasks/copilot_findings.md`'yi açıp o faza ait `[DEFERRED]` veya `[OPEN]` item'larını kontrol et. Yeni keşfedilen lint/audit bulguları da aynı dosyaya inline annotate edilebilir.

---

## Faz 0 — Hazırlık & Audit (3-5 gün)

### 0.1 SSR-safety audit
- [ ] `grep -rn "window\." src/` — tüm direct window access'lerin envanteri
- [ ] `grep -rn "document\." src/` — tüm direct document access'lerin envanteri
- [ ] `grep -rn "localStorage" src/` — tüm localStorage kullanımı
- [ ] `grep -rn "useLayoutEffect" src/` — SSR-uyumsuz hook'lar
- [ ] `grep -rn "useState(() =>" src/` — initializer'da browser API kullananlar (problemli pattern)
- [ ] Her bulgu için: `useEffect`'e taşı / `typeof window` guard ekle / `useSyncExternalStore` kullan kararı ver
- [ ] Bulguları `tasks/ssr-audit.md`'ye yaz

### 0.2 Component envanteri
- [ ] `ls src/components/ src/sections/` → her component için karar:
  - **RSC adayı** (server-side render edilebilir): Sırf JSX/JSON, state yok, browser API yok
  - **Client component** (`'use client'`): state, animasyon, interaktivite, browser API
- [ ] Karar tablosunu `tasks/component-decisions.md`'ye yaz
- [ ] Beklenen oran: ~%30 RSC, ~%70 client (audio/interaktif tool ağırlığı yüksek)

### 0.3 Routing haritası
- [ ] Şu an URL fragment/state ile yönetilen overlay'leri listele
- [ ] Her overlay için yeni URL şeması belirle:
  - `/` — Hero + sections (home)
  - `/oku/[surah]` — ReadingMode
  - `/oku/[surah]/[ayah]` — ReadingMode + deep-link
  - `/atlas/kissa/[id]` — KissaAtlas
  - `/atlas/kavim/[id]` — KavimlerAtlasi
  - `/atlas/peygamber/[id]` — ProphetAtlas
  - `/graf/ayet` — VerseGraph
  - `/graf/kavram` — ConceptGraph
  - `/graf/diyalog` — DiyalogAgi
  - `/arac/[slug]` — generic tool wrapper (ToolsBrowser)
  - vs.
- [ ] URL şemasını `tasks/url-schema.md`'ye yaz, kullanıcı onayı al

### 0.4 Karar: App Router vs Pages Router
- [ ] **Öneri: App Router** (Next.js 16) — RSC, streaming, parallel/intercepting routes, layout nesting
- [ ] Pages Router yalnızca legacy senaryo için; bu projede tercih edilmez

---

## Faz 0.5 — Pre-Migration SEO Quick Wins (Vite tarafında, 3-5 gün)

> **Mantık:** Migration 4-6 hafta sürerken Google'da index pozisyonunu erkenden iyileştir. Bu çalışmaların büyük kısmı Next.js'e taşındığında zaten yeniden yazılacak ama: **(a)** bu süre boyunca SEO geliri başlıyor, **(b)** SEO patternlerine alışıyorsun, **(c)** structured data / metadata payload'larını migration'a hazır halde getiriyorsun.

### 0.5.1 react-helmet-async kurulum
- [ ] `npm install react-helmet-async`
- [ ] `App.jsx` → `<HelmetProvider>` ile sar
- [ ] Her major component (ReadingMode, KissaAtlas, ProphetAtlas, vb.) içinde:
  ```jsx
  <Helmet>
    <title>{`${sureName} | QuranCodex`}</title>
    <meta name="description" content={...} />
    <meta property="og:title" content={...} />
    <meta property="og:description" content={...} />
    <meta property="og:image" content="/og/default.png" />
    <link rel="canonical" href={canonicalUrl} />
  </Helmet>
  ```
- [ ] Hem TR hem EN için ayrı description (locale'e göre)

### 0.5.2 URL routing refactor (en yüksek SEO etkisi)
- [ ] `npm install react-router-dom@6`
- [ ] `BrowserRouter` ile App.jsx wrap
- [ ] Mevcut overlay state-management'i yavaş yavaş route'a çevir:
  - `/oku/:surah/:ayah?` — ReadingMode
  - `/atlas/kissa/:id?` — KissaAtlas
  - `/atlas/peygamber/:id?` — ProphetAtlas
  - vb. (Faz 0.3 URL şeması ile aynı)
- [ ] Navbar `onClick={() => setX(true)}` → `<Link to="/atlas/kissa">`
- [ ] popstate handler'lar kaldır (React Router yönetir)
- [ ] **Önemli:** Bu refactor migration'a hazırlığın da en önemli parçası — URL şeması Next.js'te aynen kullanılacak

### 0.5.3 Static metadata + OG defaults
- [ ] `index.html` head bölümüne defaults ekle:
  ```html
  <meta name="description" content="...">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="QuranCodex">
  <meta property="og:image" content="https://qurancodex.com/og/default.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://qurancodex.com/">
  ```
- [ ] Helmet ile her route'ta override edilecek

### 0.5.4 Sitemap.xml (build-time generation)
- [ ] Vite plugin veya post-build script:
  ```js
  // scripts/generate-sitemap.js
  import fs from 'fs';
  const SURAH_COUNT = 114;
  const TOOLS = ['kissa', 'peygamber', 'kavim', 'doga', 'mesel', ...]; // 50+
  const urls = [];
  urls.push({ loc: 'https://qurancodex.com/', priority: 1.0 });
  for (let i = 1; i <= SURAH_COUNT; i++) urls.push({ loc: `https://qurancodex.com/oku/${i}`, priority: 0.9 });
  for (const tool of TOOLS) urls.push({ loc: `https://qurancodex.com/atlas/${tool}`, priority: 0.8 });
  // XML write
  ```
- [ ] `package.json` → `"build": "vite build && node scripts/generate-sitemap.js"`
- [ ] `public/sitemap.xml` çıktısı

### 0.5.5 robots.txt
- [ ] `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://qurancodex.com/sitemap.xml
  ```

### 0.5.6 JSON-LD structured data (Helmet ile inline)
- [ ] Root layout:
  ```jsx
  <Helmet>
    <script type="application/ld+json">{JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QuranCodex',
      url: 'https://qurancodex.com',
      logo: 'https://qurancodex.com/logo.png',
    })}</script>
  </Helmet>
  ```
- [ ] Sure sayfaları: `Article` schema (Faz 7.2'deki ile aynı yapı)
- [ ] Tool sayfaları: `LearningResource` schema
- [ ] WowFacts: `FAQPage` schema

### 0.5.7 OG image generation (static)
- [ ] **Quick win:** Tek bir default OG image (1200x630) yap, tüm sayfalar bunu paylaşsın
- [ ] **Phase 2:** Her sure için statik OG (114 PNG) — Figma export veya Sharp ile programatik
- [ ] `public/og/default.png` (1200x630, brand-consistent)

### 0.5.8 Pre-rendering (opsiyonel, agresif SEO için)
- [ ] **react-snap** veya **vite-plugin-prerender-spa** kur
- [ ] Build sonrası kendi siteni gez, HTML snapshot oluştur
- [ ] Hedef: en az home + 10 popüler sure (Fatiha, Bakara, Yasin, İhlas, vb.) için statik HTML
- [ ] **Trade-off:** Migration zaten yaklaşıyorsa bu adımı atla — emek tekrar olur

### 0.5.9 Performance audit (baseline)
- [ ] Lighthouse rapor → baseline metrik (LCP, CLS, TBT)
- [ ] PageSpeed Insights TR + EN versions
- [ ] Bunları migration sonrasıyla karşılaştır

### 0.5.10 Google Search Console setup
- [ ] Property verification
- [ ] Mevcut sitemap submit
- [ ] Beklenen: 2-4 hafta içinde indexing başlar
- [ ] Bu metrikler migration'ın success criteria'sı için baseline olacak

**Faz 0.5 tahmini etki:** Migration'dan önce ~%40-50 SEO altyapı kazanımı. Tam Next.js gücü değil ama Search Console'a erkenden gözükmeye başlar.

---

## Faz 1 — Next.js Proje Kurulumu (1-2 gün)

### 1.1 Yeni proje
- [ ] Proje kökünde `next/` dizini oluştur
- [ ] `cd next && npx create-next-app@latest . --typescript=false --tailwind=true --app=true --src-dir=true --import-alias='@/*'`
- [ ] Node version pinle (`.nvmrc`)
- [ ] `package.json` deps:
  - `next@^16`, `react@^19`, `react-dom@^19`
  - `framer-motion` (mevcut)
  - `tailwindcss@^4`, `@tailwindcss/postcss` (Next.js v4 entegrasyon yolu)
  - `tailwind.config.js` portu

### 1.2 Tailwind v4 portu
- [ ] `next/postcss.config.mjs` → `@tailwindcss/postcss` plugin
- [ ] `tailwind.config.js`'yi olduğu gibi taşı; `content` array'ini Next.js path'lerine güncelle
- [ ] `src/index.css`'yi `next/src/app/globals.css`'e taşı (custom CSS, font @font-face)
- [ ] KFGQPC `@font-face` declarations'larını koru
- [ ] Test: `npm run dev` → boş Next.js sayfası açılıyor mu?

### 1.3 Klasör yapısı
- [ ] `next/src/app/` — route'lar (page.jsx, layout.jsx)
- [ ] `next/src/components/` — shared components (Vite'tan taşınacak)
- [ ] `next/src/lib/` — utilities (cleanArabic, tajweed, vs.)
- [ ] `next/src/data/` — JSON imports veya `public/` reads
- [ ] `next/src/i18n/` — Context + tr.json + en.json
- [ ] `next/src/tokens.js` — design tokens (Vite'tan kopya)

### 1.4 Public assets
- [ ] `public/corpus/*.json`, `public/audio/`, `public/icons/`, `public/amthal/`, vs. → `next/public/` kopyala
- [ ] KFGQPC `.ttf/.otf` dosyaları → `next/public/fonts/`
- [ ] `next/src/app/layout.jsx`'de `next/font/local` ile KFGQPC tanımla (FOIT/FOUT optimization)

### 1.5 ESLint + Prettier
- [ ] Next.js ESLint config (`eslint-config-next`)
- [ ] CLAUDE.md kurallarına uyumlu prettier config

---

## Faz 2 — Shared Modules Migration (2-3 gün)

### 2.1 Tokens & i18n
- [ ] `src/tokens.js` → `next/src/tokens.js` (değişiklik yok)
- [ ] `src/i18n/tr.json`, `en.json` → `next/src/i18n/` (değişiklik yok)
- [ ] `src/i18n/LanguageContext.jsx` → `next/src/i18n/LanguageContext.jsx`
  - **CRITICAL:** Initial state'i SSR-safe yap; `useState(() => localStorage...)` → `useState('tr')` + `useEffect` ile hydrate
  - `'use client'` direktifi ekle (Context provider client zorunlu)
  - Hydration mismatch'ten kaçınmak için cookie-based locale persistence düşün (opsiyonel ama önerilen)

### 2.2 Utilities
- [ ] `src/utils/*.js` → `next/src/lib/`
  - `cleanArabic.js`, `tajweed.js`, `pathContext.js`, vs.
  - Bunlar pure functions → SSR'da sorunsuz çalışır
- [ ] `src/hooks/useWordTimings.js` → `next/src/hooks/useWordTimings.js`
  - `'use client'` direktifi (localStorage + window)
  - Mevcut implementasyon olduğu gibi taşınabilir

### 2.3 Tokens audit
- [ ] `OVERLAY_BASE`, `GLASS_CARD`, `VERSE_BLOCK`, `TEXT`, `CHIP`, `OVERLAY_TITLE`, `CLOSE_BTN` → değişiklik yok
- [ ] `FONTS.quran` → `"'KFGQPC', 'Amiri Quran', serif"` (next/font tanımıyla eşleşmeli)

---

## Faz 3 — Root Layout & Home Sayfası (2-3 gün)

### 3.1 Root layout
- [ ] `next/src/app/layout.jsx`:
  - `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` (locale dinamik)
  - KFGQPC font preload (`next/font/local`)
  - Inter, Playfair Display (`next/font/google`)
  - Metadata defaults (title template, description, OG, Twitter)
  - `<body>` → `LanguageProvider` ile sar
- [ ] Particle background ve global animasyonlar için client wrapper

### 3.2 Home page (`app/page.jsx`)
- [ ] Hero → RSC (statik metin) + client wrapper (particle, animations)
- [ ] Tüm scroll-story section'ları (`src/sections/`) sırayla import et
- [ ] Section'ların çoğu RSC olabilir; counter ve animation içerenler `'use client'` ister
- [ ] Footer → RSC

### 3.3 Section-by-section migration
Her section için aynı pattern:
- [ ] Hero — client (particle, animations)
- [ ] MathMiracle — client (animated counters)
- [ ] LinguisticDNA — büyük kısmı RSC; interaktif kart varsa client wrapper
- [ ] ImpossibleRhythm — RSC + client subcomponent
- [ ] SoundArchitecture — client (audio playback)
- [ ] HiddenArchitecture — RSC + client (ring diagram interaktif)
- [ ] PsychologySection — RSC
- [ ] ScientificSigns — RSC
- [ ] HistoricalProof — RSC
- [ ] LivingPreservation — RSC
- [ ] ZeroRedundancy — RSC
- [ ] Highlights / WowFacts — RSC + client (modal open)
- [ ] HumanDefinition — RSC
- [ ] QuranRhetoric — RSC
- [ ] QuranDua — RSC
- [ ] ProphetMap — client (interactive map)
- [ ] ToolsShowcase / ToolsHighlight / PathCards / AllTopics — RSC + client (open overlay)
- [ ] Conclusion — RSC

### 3.4 Navbar
- [ ] `'use client'` (state, dropdown, dil switcher, mobile menu)
- [ ] Eski state-based overlay açma → `<Link>` ile gerçek navigation'a dönüştür
- [ ] `popstate` handler'ları artık gereksiz (Next.js router yönetir)
- [ ] Karaoke / dark mode / dil tercihleri → URL ya da cookie-backed

---

## Faz 4 — Overlay → Route Dönüşümü (2-3 hafta, en uzun faz)

### Strateji
Her overlay iki seçenekle gelir:
- **A) Dedicated page** (önerilen): `/atlas/kissa` gibi tam sayfa — SEO için en iyi
- **B) Parallel/Intercepting route**: modal-like UX + URL — daha karmaşık ama SPA hissi korunur

**Öneri:** SEO-kritik tool'lar (atlas, graf, retorik) **A**; UI-yardımcı tool'lar (settings, search) **B**.

### 4.1 ReadingMode
- [ ] `app/oku/[surah]/page.jsx` + `app/oku/[surah]/[ayah]/page.jsx`
- [ ] `'use client'` (audio, karaoke rAF, state-heavy)
- [ ] `generateStaticParams` ile 114 sure pre-render
- [ ] Server'da meta üret: `generateMetadata({ params })` — sure adı, ayet sayısı, ilk ayet meal'i
- [ ] JSON-LD: `Article` veya `Book` schema (Quran chapter)

### 4.2 Atlas tool'ları
- [ ] KissaAtlas → `app/atlas/kissa/page.jsx` + `[id]/page.jsx`
- [ ] KavimlerAtlasi → `app/atlas/kavim/page.jsx` + `[id]/page.jsx`
- [ ] DogaAtlasi → `app/atlas/doga/page.jsx` + `[topic]/page.jsx`
- [ ] MeselAtlasi → `app/atlas/mesel/page.jsx` + `[id]/page.jsx`
- [ ] FurukAtlasi → `app/atlas/furuk/page.jsx` + `[id]/page.jsx`
- [ ] MunasebatAtlasi → `app/atlas/munasebat/page.jsx`
- [ ] ProphetAtlas → `app/atlas/peygamber/page.jsx` + `[id]/page.jsx`
- [ ] KiraatAtlasi → `app/atlas/kiraat/page.jsx`
- [ ] Her biri için `generateStaticParams` (tüm id'ler), `generateMetadata`

### 4.3 Graf tool'ları
- [ ] VerseGraph → `app/graf/ayet/page.jsx` (search query: `?q=2:255`)
- [ ] ConceptGraph → `app/graf/kavram/page.jsx`
- [ ] DiyalogAgi → `app/graf/diyalog/page.jsx`
- [ ] RevelationTimeline → `app/graf/zaman/page.jsx`
- [ ] SurahComparator → `app/graf/karsilastir/page.jsx`
- [ ] WordHeatmap → `app/graf/kelime-isi/page.jsx`
- [ ] Cross-tool navigasyon: eski `window.dispatchEvent('openVerseGraph', ...)` → `router.push('/graf/ayet?q=...')`

### 4.4 Diğer tool'lar
- [ ] AddresseeSystem → `app/arac/muhataplar/page.jsx`
- [ ] CennetCehennem → `app/arac/cennet-cehennem/page.jsx`
- [ ] DuaVerses → `app/arac/dualar/page.jsx`
- [ ] EsmaFrekans → `app/arac/esma-frekans/page.jsx`
- [ ] KiyametSahneleri → `app/arac/kiyamet/page.jsx`
- [ ] KuranRenkleri → `app/arac/renkler/page.jsx`
- [ ] KuranRetorigi → `app/arac/retorik/page.jsx`
- [ ] KuranYeminleri → `app/arac/yeminler/page.jsx`
- [ ] Melekler → `app/arac/melekler/page.jsx`
- [ ] QuranCommands → `app/arac/buyruklar/page.jsx`
- [ ] SebebiNuzul → `app/arac/sebebi-nuzul/page.jsx`
- [ ] WowFacts → `app/arac/wow/page.jsx`
- [ ] ZamanBoyutlari → `app/arac/zaman-boyutlari/page.jsx`
- [ ] ToolsBrowser → `app/araclar/page.jsx` (tüm tool index)

### 4.5 Overlay → Page transformation pattern
Her overlay için:
1. `onClose` prop'unu kaldır; yerine `router.back()` veya `<Link href="/">` kullan
2. `OVERLAY_BASE` (`position:fixed inset:0 z:9999`) yerine layout-based container
3. CLAUDE.md §13.16 (tek scrollbar kuralı) — page level'da body scroll lock gereksiz; doğal page scroll
4. Header pattern korunur ama `position: sticky` olur
5. Escape key handler kaldırılır (route navigation ile değişir)

---

## Faz 5 — i18n Locale Routing (1 hafta)

### 5.1 Karar
- [ ] **Opsiyon A:** URL prefix routing — `/tr/oku/2`, `/en/oku/2`
  - SEO için en iyi (separate URL per locale)
  - hreflang tags otomatik
- [ ] **Opsiyon B:** Cookie + same URL — `/oku/2` her iki dilde de
  - SEO için zayıf; Google için tek dil indekslenmiş gibi görünebilir
- [ ] **Öneri: A**

### 5.2 Implementation (Opsiyon A)
- [ ] `next/src/app/[locale]/layout.jsx` — locale wrapper
- [ ] `next/src/app/[locale]/page.jsx` — home (per locale)
- [ ] `next/src/middleware.js` — locale detection + redirect (root `/` → `/tr` veya `/en` browser language'a göre)
- [ ] `generateStaticParams` her route'da: `[{locale: 'tr'}, {locale: 'en'}]`
- [ ] `next-intl` paketi öneri — server component'lerde de translation çalışır
  - Veya mevcut Context tabanlı yaklaşımı koru (sadece client component'lerde işe yarar)

### 5.3 Hreflang
- [ ] `generateMetadata` her sayfada `alternates: { languages: { tr: '/tr/...', en: '/en/...' } }`

---

## Faz 6 — Data Layer (3-5 gün)

### 6.1 JSON imports
- [ ] Şu an: `fetch('/X.json')` (runtime fetch)
- [ ] Yeni: `import data from '@/data/X.json'` veya `fs.readFile` (build-time)
- [ ] Büyük JSON'lar (`verse-graph-bgem3.json`) için RSC'de `cache()` ile wrap
- [ ] Static data → RSC'de read; client'a `props` ile geç

### 6.2 Verse-graph & corpus
- [ ] `public/corpus/[1-114].json` → her sure ayrı dosya, route bazlı yüklenir
- [ ] ReadingMode `/oku/[surah]` → ilgili corpus dosyasını server'da yükle, client'a geç
- [ ] `verse-graph-bgem3.json` → `/graf/ayet` page'inde dinamik import

### 6.3 acikkuran.com API
- [ ] Şu an client-side fetch
- [ ] Yeni: server-side fetch + Next.js cache (`{ next: { revalidate: 86400 } }`)
- [ ] Veya pre-build sırasında tüm 6236 ayeti çek, `data/api-snapshot/` altında sakla

---

## Faz 7 — SEO Infrastructure (1 hafta — migration'ın en kritik faz'ı)

> **Not:** Bu faz Next.js migration'ının ana motivasyonudur. Aşağıdaki maddeler Next.js'in sunduğu SEO superpower'ları tam kullanır. **Faz 0.5** (aşağıda eklenmiştir) Vite tarafında bile uygulanabilir SEO quick win'leri kapsar — migration'a başlamadan önce yapılması önerilir.

### 7.1 Metadata API (Next.js native)
- [ ] **Root layout** (`app/layout.jsx`):
  - `metadata.title.template`: `'%s | QuranCodex'`
  - `metadata.title.default`: `"QuranCodex — Kur'an'ın Görünmeyen Mimarisi"`
  - `metadata.description`: TR + EN versions per locale
  - `metadata.keywords`: kuran, tefsir, ayet, sure, kıssa, mucize, dilsel analiz, structured data
  - `metadata.authors`, `metadata.creator`, `metadata.publisher`
  - `metadata.formatDetection`: telephone disable, email disable, address disable
  - `metadata.metadataBase`: `new URL('https://qurancodex.com')`
- [ ] **Per-route `generateMetadata`** her dynamic route'da:
  - `/oku/[surah]`: title = `"${sureNameTr} (${sureNameLatin}) — Sure ${N}"`, description = ilk ayet meal'i + ayet sayısı + nüzul yeri
  - `/atlas/kissa/[id]`: kissa başlığı + 1-line özet
  - `/atlas/peygamber/[id]`: peygamber adı + dönem + kısa açıklama
  - `/graf/*`: tool adı + description
  - Her birinde `keywords` route-spesifik (örn. Bakara → "ayet'el-kürsi, en uzun sure, medeni sure")
- [ ] **OpenGraph metadata** her sayfada:
  - `og:title`, `og:description`, `og:url`, `og:type` (website veya article)
  - `og:locale` (tr_TR veya en_US), `og:locale:alternate`
  - `og:image` — 1200x630 (aşağıda 7.5)
  - `og:site_name`: 'QuranCodex'
- [ ] **Twitter cards** her sayfada:
  - `card`: 'summary_large_image'
  - `site`, `creator` (varsa Twitter handle)
  - `title`, `description`, `image`

### 7.2 Structured Data (JSON-LD) — schema.org
- [ ] **Site geneli** (root layout'a):
  - `@type: Organization` (logo, sameAs social links)
  - `@type: WebSite` (name, url, potentialAction: SearchAction `/ara?q={query}`)
- [ ] **Home page:**
  - `@type: WebPage` + breadcrumb
- [ ] **Sure sayfaları** (`/oku/[surah]`):
  - `@type: Article` + custom `Book` veya `CreativeWork` properties
  - `headline`: sure adı
  - `articleBody`: sure özetinden snippet
  - `inLanguage`: ar, alternate tr/en
  - `isPartOf`: `{ @type: 'Book', name: "The Quran", numberOfPages: 604 }`
  - `position`: surah number
  - `numberOfWords`: kelime sayısı (varsa)
- [ ] **Ayet sayfaları** (`/oku/[surah]/[ayah]`):
  - `@type: Quotation` veya custom Verse schema
  - `text`: Arabic verse + translation
  - `citation`: `{ @type: 'CreativeWork', name: 'Quran', identifier: '${S}:${A}' }`
- [ ] **Kıssa sayfaları:**
  - `@type: Article` + `about` (peygamber/kavim)
  - `character`: ilgili peygamberler (`@type: Person`)
- [ ] **Tool sayfaları:**
  - `@type: LearningResource` veya `WebApplication`
  - `educationalLevel`, `learningResourceType`
- [ ] **WowFacts, FAQ-style içerikler:**
  - `@type: FAQPage` → `mainEntity: [{ @type: Question, name: ..., acceptedAnswer: { @type: Answer, text: ... } }]`
- [ ] **Breadcrumb** her route'da:
  - `@type: BreadcrumbList` → Ana Sayfa > Kategori > Sayfa
- [ ] JSON-LD'yi component olarak yaz: `<JsonLd data={...} />` server component
- [ ] Test: Google Rich Results Test (https://search.google.com/test/rich-results) — tüm schema'lar geçmeli

### 7.3 Sitemap (`app/sitemap.js`)
- [ ] Dinamik sitemap generator:
  ```js
  export default async function sitemap() {
    const locales = ['tr', 'en'];
    const routes = [];
    // Home
    for (const locale of locales) routes.push({ url: `/${locale}`, lastModified, priority: 1.0 });
    // 114 sure
    for (const locale of locales)
      for (let i = 1; i <= 114; i++)
        routes.push({ url: `/${locale}/oku/${i}`, lastModified, priority: 0.9, changeFrequency: 'monthly' });
    // Atlas tool'ları (tüm id'ler için)
    // Graf tool'ları
    // Diğer tool'lar
    return routes;
  }
  ```
- [ ] **Sitemap split:** Eğer URL sayısı 50K'yı geçerse (ayet seviyesinde route'lar varsa) sitemap index oluştur
- [ ] **hreflang sitemap:** Her URL'in alternate locale linklerini ekle (`alternates: { languages: {...} }`)
- [ ] Beklenen URL sayısı: 165 × 2 locale = **~330 URL** (sure-bazlı) veya 6236 × 2 + diğerleri = **~13K URL** (ayet-bazlı eklenirse)

### 7.4 robots.txt (`app/robots.js`)
- [ ] `userAgent: '*'`, `allow: '/'`
- [ ] `disallow: ['/api/', '/_next/']`
- [ ] `sitemap: 'https://qurancodex.com/sitemap.xml'`
- [ ] Crawl-delay yok (Google ignore eder zaten)

### 7.5 OpenGraph Image Generation
- [ ] **Dynamic OG images** Vercel'in `@vercel/og` ile:
  - `app/opengraph-image.jsx` — default site OG
  - `app/oku/[surah]/opengraph-image.jsx` — her sure için unique OG (sure adı + Arabic name + sure numarası + parchment background)
  - `app/atlas/peygamber/[id]/opengraph-image.jsx` — peygamber adı + dönem
  - `app/arac/[tool]/opengraph-image.jsx` — tool ikonu + adı
- [ ] **Twitter image** ayrı veya OG image reuse
- [ ] **Brand consistency:** KFGQPC font (Arabic), Playfair (Latin), antique gold, cosmic black background
- [ ] **Test:** Twitter Card Validator, Facebook Sharing Debugger, LinkedIn Post Inspector

### 7.6 Canonical URLs
- [ ] Her sayfa `generateMetadata`'da:
  ```js
  alternates: {
    canonical: '/oku/2',  // metadataBase ile absolute olur
    languages: {
      'tr': '/tr/oku/2',
      'en': '/en/oku/2',
    },
  }
  ```
- [ ] **Query param normalize:** `?utm_source=...` gibi tracker'lar canonical'da kaldırılmalı
- [ ] **www vs non-www:** Tek kanonik (öneri: www.qurancodex.com), diğeri 301 redirect

### 7.7 URL Yapı Standartları (SEO-first)
- [ ] **Lowercase only:** `/oku/bakara` değil `/oku/Bakara`
- [ ] **Latin transliteration:** Türkçe karakter yerine ASCII (`bakara`, `ayetel-kursi`, mevcut Latin isim listesi kullan)
- [ ] **Kebab-case:** `/atlas/peygamber-zincir` değil `/atlas/peygamberZincir`
- [ ] **Numeric ayet:** `/oku/2/255` (insan-okunabilir + bot-friendly)
- [ ] **Kısa path:** `/oku/2` < 80 karakter olmalı
- [ ] **No trailing slash:** `next.config.js` → `trailingSlash: false`

### 7.8 Internal Linking
- [ ] **Breadcrumb komponentleri** her route'da (zaten 7.2'de structured data var, görsel olarak da render et)
- [ ] **Related links** her sure sayfasında: bir önceki/sonraki sure, ilgili kıssalar, ilgili tool'lar
- [ ] **Anchor text** anlamlı: "buraya tıkla" değil "Bakara Suresi'ni oku"
- [ ] **Footer'da** önemli sayfa linklerini tut (kıssa atlası, peygamber atlası, ayet grafı)
- [ ] **Sitemap.html** (kullanıcıya yönelik HTML index) opsiyonel ama faydalı

### 7.9 Content & On-Page SEO
- [ ] **H1 tek tane** her sayfada, sure adı veya tool adı
- [ ] **Heading hierarchy** doğru (H1 → H2 → H3, atlama yok)
- [ ] **Alt text** tüm görselleri (SVG ikonlar dahil) — TR + EN
- [ ] **Semantik HTML:** `<article>`, `<section>`, `<nav>`, `<aside>` doğru kullan (CLAUDE.md §9 zaten zorunlu kılıyor)
- [ ] **Meaningful first paragraph:** Her sayfa giriş paragrafı en azından 50-100 kelime, sayfa özetini açık verir
- [ ] **Word count:** Sure sayfaları minimum 300 kelime içerik (ayet metni + meal + kısa tanıtım), tool sayfaları minimum 200 kelime tanıtım

### 7.10 Core Web Vitals (SEO ranking factor)
- [ ] **LCP < 2.5s:**
  - KFGQPC font preload (`next/font/local`)
  - Critical CSS inline
  - Above-fold image'ler `priority` (next/image)
- [ ] **CLS < 0.1:**
  - Font swap'ta layout shift'i önle (`size-adjust`, `ascent-override`)
  - Image'lere `width` + `height` zorunlu
  - Lazy-loaded content için space reserve
- [ ] **INP < 200ms:**
  - Heavy hooks defer
  - rAF loop'ları aktif olmayan tab'larda durdur (zaten yapılıyor)
- [ ] **TTFB < 800ms:**
  - Vercel Edge / CDN
  - Static rendering (SSG) kullan, SSR'dan kaçın
- [ ] Test: PageSpeed Insights, Web.dev Measure, CrUX Dashboard

### 7.11 International SEO
- [ ] **hreflang tags** (7.6 ile zaten kaplıyor)
- [ ] **`<html lang="tr">` veya `<html lang="en">`** locale'e göre
- [ ] **`dir="ltr"` Latin route'larda**, Arabic verse içeren bloklarda `dir="rtl"` (component-level, zaten CLAUDE.md §13.2)
- [ ] **Locale-specific descriptions:** TR ve EN ayrı, makine çevirisi yapma (i18n JSON'larda zaten ayrı)

### 7.12 Mobile-First SEO
- [ ] **Mobile usability:** Tüm route'lar 390px'de tam çalışmalı (CLAUDE.md §14 zaten zorunlu kılıyor)
- [ ] **Tap target size:** Minimum 48x48px (Lighthouse Mobile audit)
- [ ] **Viewport meta:** Next.js root layout `viewport` export'unda — `width=device-width, initial-scale=1`
- [ ] **No interstitials:** Cookie banner gibi şeyler içeriği gizlememeli (mobile penalty)

### 7.13 Performance Budget
- [ ] **Initial JS bundle < 100KB** (gzip) — Next.js shared chunks dahil
- [ ] **Per-route JS bundle < 50KB** (gzip)
- [ ] **Total page weight < 500KB** (first load)
- [ ] **Font weight:** KFGQPC subset (sadece kullanılan glyph'ler) — büyük font dosyası
- [ ] CI'da bundle size threshold kontrolü (`@next/bundle-analyzer` + budget script)

### 7.14 Search Console & Bing Webmaster
- [ ] **Google Search Console:**
  - Property verification (DNS TXT veya HTML file)
  - Sitemap submit (`/sitemap.xml`)
  - URL inspection — örnekleme: 5 sure + 5 tool URL'i manuel test
  - Coverage report — index hataları gözlemle
  - Mobile usability report
- [ ] **Bing Webmaster Tools:** Aynı şekilde submit
- [ ] **Yandex Webmaster** (opsiyonel, MENA bölgesi için)

### 7.15 Analytics & SEO Monitoring
- [ ] **Vercel Analytics** veya **Plausible Analytics** (privacy-friendly)
- [ ] **Google Analytics 4** (opsiyonel — GDPR/KVKK uyum gerekli)
- [ ] **Web Vitals tracking:** `web-vitals` paketi + custom endpoint veya Vercel Analytics
- [ ] **Search ranking monitoring:** Ahrefs, SEMrush, veya manuel SERP check (haftalık)
- [ ] **404 monitoring:** `app/not-found.jsx` + log to analytics

### 7.16 Schema.org Validation Checklist
Her sayfa için Rich Results Test geçmeli:
- [ ] Organization (root)
- [ ] WebSite + SearchAction (home)
- [ ] BreadcrumbList (her sayfa)
- [ ] Article / Book (sure sayfaları)
- [ ] Person (peygamber sayfaları)
- [ ] FAQPage (WowFacts, Q&A içerikler)
- [ ] LearningResource (tool sayfaları)

### 7.17 Content Strategy for SEO (post-migration)
- [ ] **Long-tail keyword research:** "ayetel kürsi anlamı", "yusuf kıssası tefsir", "kuran sayısal mucize", vb.
- [ ] **Pillar content** her sure için: tam tefsir özet sayfası
- [ ] **Cluster content:** Pillar'a bağlı yan sayfalar (esbâb-ı nüzûl, retorik, dilsel analiz)
- [ ] **Update frequency:** Sure sayfaları içerik güncellemesi (yeni tefsir notu, yeni connection) — `lastModified` zaman damgası ile sitemap'i besle
- [ ] **Blog/Articles route** (gelecek): `/yazi/[slug]` — derinleştirilmiş makaleler için SEO bridge

---

## Faz 8 — Performance (3-5 gün)

### 8.1 Font optimization
- [ ] `next/font/local` ile KFGQPC self-host
- [ ] `display: 'swap'` (FOIT'tan kaçın)
- [ ] Preload critical fonts only

### 8.2 Image optimization
- [ ] Eğer raster image varsa `next/image` ile değiştir
- [ ] SVG'ler doğrudan import (`@svgr/webpack` Next.js config)

### 8.3 Bundle analysis
- [ ] `@next/bundle-analyzer` kur
- [ ] Per-route bundle size kontrol et
- [ ] Framer Motion lazy load (`dynamic(() => import('framer-motion'))`)
- [ ] Tool route'ları zaten kendi bundle'ında — verify

### 8.4 Core Web Vitals
- [ ] LCP target: < 2.5s
- [ ] CLS target: < 0.1
- [ ] INP target: < 200ms
- [ ] `next/script` strategy doğru ayarlanmış mı?

---

## Faz 9 — Testing & QA (1 hafta)

### 9.1 Functional parity
- [ ] Her route'u manuel test et (114 sure değil — örnekleme: Fatiha, Bakara, Yâsîn, İhlas + 5 random)
- [ ] Her tool route'unu test et (50+ tool)
- [ ] Cross-tool navigasyon (VerseGraph ↔ ConceptGraph back)
- [ ] Karaoke audio + word highlight
- [ ] Reading mode page turn
- [ ] Tüm meal'ler düzgün yükleniyor
- [ ] Dil değişikliği persist ediyor
- [ ] Dark mode toggle
- [ ] Mobile responsive (390px - 1440px)

### 9.2 SEO parity
- [ ] `curl -s URL | grep -i "<title>"` — her sayfa için doğru title
- [ ] `view-source:` HTML'de gerçek içerik var mı (JS olmadan)
- [ ] Google Rich Results Test — structured data validate
- [ ] Lighthouse SEO score >= 95

### 9.3 Performance regression
- [ ] Lighthouse Performance >= 90 (mobile & desktop)
- [ ] Bundle size karşılaştır: Vite vs Next.js (bazı route'larda Next.js daha büyük olabilir — bu kabul edilebilir trade-off)

### 9.4 Visual regression
- [ ] Playwright/Chromatic ile key route'lar için snapshot
- [ ] qc-visual-auditor agent ile manuel kontrol

---

## Faz 10 — Deploy & Cutover (2-3 gün)

### 10.1 Vercel deployment
- [ ] Yeni Vercel projesi (Next.js)
- [ ] Environment variables setup
- [ ] Preview deployment test
- [ ] Production deployment to staging URL

### 10.2 DNS strategi
- [ ] Şu anki Vite deployment → staging.qurancodex.com (yedek)
- [ ] Next.js → www.qurancodex.com (cutover)
- [ ] DNS TTL'i önceden düşür
- [ ] Cutover gününde DNS swap

### 10.3 Redirects
- [ ] Eski Vite SPA fragment URL'leri → yeni Next.js path'leri için `next.config.js` redirects
- [ ] Örnek: eski `/?tool=verseGraph&q=2:255` → yeni `/graf/ayet?q=2:255`
- [ ] 301 redirect kullan (SEO equity transfer)

### 10.4 Search Console
- [ ] Google Search Console'a yeni sitemap submit
- [ ] Bing Webmaster Tools'a submit
- [ ] İlk 2 hafta crawl errors monitör et

### 10.5 Monitoring
- [ ] Vercel Analytics aç
- [ ] Web Vitals tracking
- [ ] Sentry veya benzer error tracking (opsiyonel)

---

## Faz 11 — Post-migration cleanup (2-3 gün)

### 11.1 Vite proje sonlandır
- [ ] Eski Vite proje kodu `legacy-vite/` altına taşı (silme — referans için sakla)
- [ ] Vite spesifik bağımlılıkları kaldır
- [ ] CI/CD pipeline güncelle

### 11.2 Dokümantasyon güncelle
- [ ] CLAUDE.md'yi Next.js'e uyarla:
  - §2 tech stack → React 19 + Next.js 16 (App Router)
  - §5 file structure → Next.js layout
  - §13 implementation rules → `'use client'` direktifi pattern'ı, server component vs client kararları
- [ ] Yeni overlay/tool ekleme guide'ı (Faz 4.5 transformation pattern)

### 11.3 Lessons learned
- [ ] `tasks/lessons.md`'ye migration'dan çıkan ders/patternları yaz

---

## Risk Matrisi

| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|-----------|
| SSR hydration mismatch (localStorage init) | Yüksek | Orta | Cookie-based persistence; `useState` initial value sabit, `useEffect` hydration |
| KFGQPC font loading regression | Orta | Yüksek | `next/font/local` preload, FOUT yerine FOIT kabul et veya swap |
| Audio karaoke rAF bozulması | Düşük | Yüksek | useWordTimings hook olduğu gibi taşınır, `'use client'` zorunlu |
| Tailwind v4 + Next.js uyumsuzluk | Düşük | Orta | `@tailwindcss/postcss` resmi yol; v4 zaten Next.js'i destekliyor |
| Build time şişmesi (165 statik route + locale) | Orta | Düşük | ISR (incremental static regeneration) kullan; tüm route'ları force-static yapma |
| URL değişikliği nedeniyle SEO geri-adım | Orta | Yüksek | 301 redirect, sitemap submit, 4-8 hafta indeks geri kazanma süreci kabul et |
| Tool cross-navigasyon kırılması (returnToConcept, returnToWow) | Yüksek | Orta | Yeni router.push pattern'ı + query param ile back state |
| Bundle size artışı (Next.js runtime) | Düşük | Düşük | Bundle analyzer ile takip; ~30-50KB ek runtime kabul edilebilir |
| Vercel vendor lock-in | Orta | Düşük | Self-host alternative (Node.js + Next.js standalone build) her zaman mevcut |

---

## Checkpoint'ler — Stop & Re-plan

Her faz sonunda **STOP** ve şunları doğrula:
1. Önceki faz tam çalışıyor mu (regression yok)?
2. Sonraki faz için ek bilgi/karar gerekli mi?
3. Efor tahmini güncel mi?
4. Risk matrisi değişti mi?

Eğer herhangi biri kırmızı → kullanıcıya geri rapor et, re-plan yap.

---

## Toplam Efor (Optimistic / Realistic / Pessimistic)

- **Optimistic:** 4 hafta (full-time, 1 senior dev)
- **Realistic:** 6-7 hafta
- **Pessimistic:** 10-12 hafta (SSR-safety sorunları + visual regression çıkarsa)

---

## Önerilen Sıra (priority-ordered, SEO-first)

Eğer kademeli migration yapılacaksa:
1. **Faz 0 (Audit)** — 3-5 gün, SSR-safety + URL şeması + component decisions
2. **Faz 0.5 (Vite SEO quick wins)** — 3-5 gün, paralel olarak Search Console'a giriş
   - react-helmet-async + meta + JSON-LD + sitemap + robots.txt
   - URL routing refactor (React Router) — Next.js'e migration'da birebir kullanılacak
3. **Faz 1-2 (Next.js iskelet + shared modules)** — 3-5 gün
4. **Faz 3 (Home)** — 2-3 gün, sadece landing'i Next.js'te canlıya al (preview deploy), early validation
5. **Faz 7 (SEO infrastructure)** — Faz 3'le paralel, çünkü Next.js metadata API'si home'dan itibaren kullanılır
6. **Faz 4 (Routes)** — 2-3 hafta, en SEO-kritik route'larla başla:
   - Önce: `/oku/[surah]` (114 sure × 2 locale = 228 URL, en yüksek SEO değeri)
   - Sonra: atlas tool'ları (kıssa, peygamber, kavim — narrative-rich content)
   - Sonra: graf tool'ları
   - Sonra: kalan utility tool'lar
7. **Faz 5 (i18n)** — Faz 4'le paralel, locale-prefix routing
8. **Faz 6 (Data)** — Faz 4 ile birlikte, route bazlı veri yükleme
9. **Faz 8 (Performance)** — Faz 4-7 sonrası, Core Web Vitals optimize
10. **Faz 9 (Testing)** — Pre-cutover QA
11. **Faz 10 (Cutover)** — Production swap, 301 redirects, Search Console resubmit
12. **Faz 11 (Cleanup)** — Vite legacy archive, docs update

**Toplam timeline:** ~6 hafta full-time, SEO geliri Faz 0.5'ten itibaren akmaya başlar.

---

## Mimari Kararlar (kullanıcı onayı: 2026-05-21)

Tüm öneriler kullanıcı tarafından onaylandı. Migration bu kararlarla başlayacak:

- [x] **Router:** App Router (Next.js 16)
- [x] **Dil:** JavaScript (TypeScript'e geçilmeyecek — mevcut kod base'i ile uyum, migration scope'unu küçük tutmak)
- [x] **i18n:** URL prefix routing — `/tr/...` ve `/en/...`
- [x] **Tool migration stratejisi:** Tool overlay'ler full page olarak taşınacak (SEO için optimal)
- [x] **Deploy:** Vercel (Next.js'in native platformu, Edge functions + OG image generation)
- [x] **Cutover stratejisi:** Kademeli — yeni Next.js projesi paralel kurulacak, Faz 3 sonunda live deploy ile early validation, ardından route route migration
- [x] **i18n kütüphanesi:** next-intl (RSC'lerde de translation desteği — Context-tabanlı yaklaşıma göre daha güçlü)

**Bu kararlar `migration-to-next.js` branch'inde uygulanacak. Main branch sadece bu plan dosyası için kullanılır.**
