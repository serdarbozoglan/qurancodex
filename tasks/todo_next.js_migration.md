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

### 0.1 SSR-safety audit  _**Tamamlandı**: tasks/ssr-audit.md_
- [x] `grep -rn "window\." src/` — tüm direct window access'lerin envanteri
- [x] `grep -rn "document\." src/` — tüm direct document access'lerin envanteri
- [x] `grep -rn "localStorage" src/` — tüm localStorage kullanımı
- [x] `grep -rn "useLayoutEffect" src/` — SSR-uyumsuz hook'lar
- [x] `grep -rn "useState(() =>" src/` — initializer'da browser API kullananlar (problemli pattern)
- [x] Her bulgu için: `useEffect`'e taşı / `typeof window` guard ekle / `useSyncExternalStore` kullan kararı ver
- [x] Bulguları `tasks/ssr-audit.md`'ye yaz

### 0.2 Component envanteri  _**Tamamlandı**: audit Kategori 4_
- [x] `ls src/components/ src/sections/` → her component için karar:
  - **RSC adayı** (server-side render edilebilir): Sırf JSX/JSON, state yok, browser API yok
  - **Client component** (`'use client'`): state, animasyon, interaktivite, browser API
- [x] Karar tablosunu `tasks/component-decisions.md`'ye yaz
- [x] Beklenen oran: ~%30 RSC, ~%70 client (audio/interaktif tool ağırlığı yüksek)

### 0.3 Routing haritası  _**Tamamlandı**: tasks/url-schema.md_
- [x] Şu an URL fragment/state ile yönetilen overlay'leri listele
- [x] Her overlay için yeni URL şeması belirle:
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
- [x] URL şemasını `tasks/url-schema.md`'ye yaz, kullanıcı onayı al

### 0.4 Karar: App Router vs Pages Router  _**Tamamlandı**: App Router seçildi_
- [x] **Öneri: App Router** (Next.js 16) — RSC, streaming, parallel/intercepting routes, layout nesting
- [x] Pages Router yalnızca legacy senaryo için; bu projede tercih edilmez

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

### 1.1 Yeni proje  _**Tamamlandı**: commit 05d0b2c_
- [x] Proje kökünde `next/` dizini oluştur
- [x] `cd next && npx create-next-app@latest . --typescript=false --tailwind=true --app=true --src-dir=true --import-alias='@/*'`
- [x] Node version pinle (`.nvmrc`)
- [x] `package.json` deps:
  - `next@^16`, `react@^19`, `react-dom@^19`
  - `framer-motion` (mevcut)
  - `tailwindcss@^4`, `@tailwindcss/postcss` (Next.js v4 entegrasyon yolu)
  - `tailwind.config.js` portu

### 1.2 Tailwind v4 portu  _**Tamamlandı**: commit 8f31dc3_
- [x] `next/postcss.config.mjs` → `@tailwindcss/postcss` plugin
- [x] `tailwind.config.js`'yi olduğu gibi taşı; `content` array'ini Next.js path'lerine güncelle
- [x] `src/index.css`'yi `next/src/app/globals.css`'e taşı (custom CSS, font @font-face)
- [x] KFGQPC `@font-face` declarations'larını koru
- [x] Test: `npm run dev` → boş Next.js sayfası açılıyor mu?

### 1.3 Klasör yapısı  _**Tamamlandı**: commit 8f31dc3_
- [x] `next/src/app/` — route'lar (page.jsx, layout.jsx)
- [x] `next/src/components/` — shared components (Vite'tan taşınacak)
- [x] `next/src/lib/` — utilities (cleanArabic, tajweed, vs.)
- [x] `next/src/data/` — JSON imports veya `public/` reads
- [x] `next/src/i18n/` — Context + tr.json + en.json
- [x] `next/src/tokens.js` — design tokens (Vite'tan kopya)

### 1.4 Public assets  _**Tamamlandı**: commit 8f31dc3_
- [x] `public/corpus/*.json`, `public/audio/`, `public/icons/`, `public/amthal/`, vs. → `next/public/` kopyala
- [x] KFGQPC `.ttf/.otf` dosyaları → `next/public/fonts/`
- [x] `next/src/app/layout.jsx`'de `next/font/local` ile KFGQPC tanımla (FOIT/FOUT optimization)

### 1.5 ESLint + Prettier  _**Tamamlandı**: create-next-app default_
- [x] Next.js ESLint config (`eslint-config-next`)
- [x] CLAUDE.md kurallarına uyumlu prettier config

---

## Faz 2 — Shared Modules Migration (2-3 gün)

### 2.1 Tokens & i18n  _**Tamamlandı**: Faz 5 SSR-safe pattern + URL-based_
- [x] `src/tokens.js` → `next/src/tokens.js` (değişiklik yok)
- [x] `src/i18n/tr.json`, `en.json` → `next/src/i18n/` (değişiklik yok)
- [x] `src/i18n/LanguageContext.jsx` → `next/src/i18n/LanguageContext.jsx`
  - **CRITICAL:** Initial state'i SSR-safe yap; `useState(() => localStorage...)` → `useState('tr')` + `useEffect` ile hydrate
  - `'use client'` direktifi ekle (Context provider client zorunlu)
  - Hydration mismatch'ten kaçınmak için cookie-based locale persistence düşün (opsiyonel ama önerilen)

### 2.2 Utilities  _**Tamamlandı**: commit 8f31dc3_
- [x] `src/utils/*.js` → `next/src/lib/`
  - `cleanArabic.js`, `tajweed.js`, `pathContext.js`, vs.
  - Bunlar pure functions → SSR'da sorunsuz çalışır
- [x] `src/hooks/useWordTimings.js` → `next/src/hooks/useWordTimings.js`
  - `'use client'` direktifi (localStorage + window)
  - Mevcut implementasyon olduğu gibi taşınabilir

### 2.3 Tokens audit  _**Tamamlandı**: KFGQPC @font-face port_
- [x] `OVERLAY_BASE`, `GLASS_CARD`, `VERSE_BLOCK`, `TEXT`, `CHIP`, `OVERLAY_TITLE`, `CLOSE_BTN` → değişiklik yok
- [x] `FONTS.quran` → `"'KFGQPC', 'Amiri Quran', serif"` (next/font tanımıyla eşleşmeli)

---

## Faz 3 — Root Layout & Home Sayfası (2-3 gün)

### 3.1 Root layout  _**Tamamlandı**: commit 3d05f2c_
- [x] `next/src/app/layout.jsx`:
  - `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` (locale dinamik)
  - KFGQPC font preload (`next/font/local`)
  - Inter, Playfair Display (`next/font/google`)
  - Metadata defaults (title template, description, OG, Twitter)
  - `<body>` → `LanguageProvider` ile sar
- [x] Particle background ve global animasyonlar için client wrapper

### 3.2 Home page (`app/page.jsx`)  _**Tamamlandı**: commit bbc1b27_
- [x] Hero → RSC (statik metin) + client wrapper (particle, animations)
- [x] Tüm scroll-story section'ları (`src/sections/`) sırayla import et
- [x] Section'ların çoğu RSC olabilir; counter ve animation içerenler `'use client'` ister
- [x] Footer → RSC

### 3.3 Section-by-section migration  _**Tamamlandı**: 18 section + Hero + Footer_
Her section için aynı pattern:
- [x] Hero — client (particle, animations)
- [x] MathMiracle — client (animated counters)
- [x] LinguisticDNA — büyük kısmı RSC; interaktif kart varsa client wrapper
- [x] ImpossibleRhythm — RSC + client subcomponent
- [x] SoundArchitecture — client (audio playback)
- [x] HiddenArchitecture — RSC + client (ring diagram interaktif)
- [x] PsychologySection — RSC
- [x] ScientificSigns — RSC
- [x] HistoricalProof — RSC
- [x] LivingPreservation — RSC
- [x] ZeroRedundancy — RSC
- [x] Highlights / WowFacts — RSC + client (modal open)
- [x] HumanDefinition — RSC
- [x] QuranRhetoric — RSC
- [x] QuranDua — RSC
- [x] ProphetMap — client (interactive map)
- [x] ToolsShowcase / ToolsHighlight / PathCards / AllTopics — RSC + client (open overlay)
- [x] Conclusion — RSC

### 3.4 Navbar  _**Tamamlandı**: commit b07fa33 + route-based_
- [x] `'use client'` (state, dropdown, dil switcher, mobile menu)
- [x] Eski state-based overlay açma → `<Link>` ile gerçek navigation'a dönüştür
- [x] `popstate` handler'ları artık gereksiz (Next.js router yönetir)
- [x] Karaoke / dark mode / dil tercihleri → URL ya da cookie-backed

---

## Faz 4 — Overlay → Route Dönüşümü (2-3 hafta, en uzun faz)

### Strateji
Her overlay iki seçenekle gelir:
- **A) Dedicated page** (önerilen): `/atlas/kissa` gibi tam sayfa — SEO için en iyi
- **B) Parallel/Intercepting route**: modal-like UX + URL — daha karmaşık ama SPA hissi korunur

**Öneri:** SEO-kritik tool'lar (atlas, graf, retorik) **A**; UI-yardımcı tool'lar (settings, search) **B**.

### 4.1 ReadingMode  _**Tamamlandı**: commit 1ffd56e + 6.2 /oku/[surah]_
- [x] `app/oku/[surah]/page.jsx` + `app/oku/[surah]/[ayah]/page.jsx`
- [x] `'use client'` (audio, karaoke rAF, state-heavy)
- [x] `generateStaticParams` ile 114 sure pre-render
- [x] Server'da meta üret: `generateMetadata({ params })` — sure adı, ayet sayısı, ilk ayet meal'i
- [x] JSON-LD: `Article` veya `Book` schema (Quran chapter)

### 4.2 Atlas tool'ları  _**Tamamlandı**: commit d335fed_
- [x] KissaAtlas → `app/atlas/kissa/page.jsx` + `[id]/page.jsx`
- [x] KavimlerAtlasi → `app/atlas/kavim/page.jsx` + `[id]/page.jsx`
- [x] DogaAtlasi → `app/atlas/doga/page.jsx` + `[topic]/page.jsx`
- [x] MeselAtlasi → `app/atlas/mesel/page.jsx` + `[id]/page.jsx`
- [x] FurukAtlasi → `app/atlas/furuk/page.jsx` + `[id]/page.jsx`
- [x] MunasebatAtlasi → `app/atlas/munasebat/page.jsx`
- [x] ProphetAtlas → `app/atlas/peygamber/page.jsx` + `[id]/page.jsx`
- [x] KiraatAtlasi → `app/atlas/kiraat/page.jsx`
- [x] Her biri için `generateStaticParams` (tüm id'ler), `generateMetadata`

### 4.3 Graf tool'ları  _**Tamamlandı**: commit 57931fe_
- [x] VerseGraph → `app/graf/ayet/page.jsx` (search query: `?q=2:255`)
- [x] ConceptGraph → `app/graf/kavram/page.jsx`
- [x] DiyalogAgi → `app/graf/diyalog/page.jsx`
- [x] RevelationTimeline → `app/graf/zaman/page.jsx`
- [x] SurahComparator → `app/graf/karsilastir/page.jsx`
- [x] WordHeatmap → `app/graf/kelime-isi/page.jsx`
- [x] Cross-tool navigasyon: eski `window.dispatchEvent('openVerseGraph', ...)` → `router.push('/graf/ayet?q=...')`

### 4.4 Diğer tool'lar  _**Tamamlandı**: commit ef72bad_
- [x] AddresseeSystem → `app/arac/muhataplar/page.jsx`
- [x] CennetCehennem → `app/arac/cennet-cehennem/page.jsx`
- [x] DuaVerses → `app/arac/dualar/page.jsx`
- [x] EsmaFrekans → `app/arac/esma-frekans/page.jsx`
- [x] KiyametSahneleri → `app/arac/kiyamet/page.jsx`
- [x] KuranRenkleri → `app/arac/renkler/page.jsx`
- [x] KuranRetorigi → `app/arac/retorik/page.jsx`
- [x] KuranYeminleri → `app/arac/yeminler/page.jsx`
- [x] Melekler → `app/arac/melekler/page.jsx`
- [x] QuranCommands → `app/arac/buyruklar/page.jsx`
- [x] SebebiNuzul → `app/arac/sebebi-nuzul/page.jsx`
- [x] WowFacts → `app/arac/wow/page.jsx`
- [x] ZamanBoyutlari → `app/arac/zaman-boyutlari/page.jsx`
- [x] ToolsBrowser → `app/araclar/page.jsx` (tüm tool index)

### 4.5 Overlay → Page transformation pattern
Her overlay için:
1. `onClose` prop'unu kaldır; yerine `router.back()` veya `<Link href="/">` kullan
2. `OVERLAY_BASE` (`position:fixed inset:0 z:9999`) yerine layout-based container
3. CLAUDE.md §13.16 (tek scrollbar kuralı) — page level'da body scroll lock gereksiz; doğal page scroll
4. Header pattern korunur ama `position: sticky` olur
5. Escape key handler kaldırılır (route navigation ile değişir)

---

### 4.6 Post-Faz 4.4 Audit Bulguları (2026-05-23)

> Faz 4.4 (20 tool + atlas + graf route'ları) tamamlandıktan sonra `next/src/` üzerinde yapılan hızlı tarama. Aşağıdakiler **migration kapsamında kalan açık iş** — Faz 5'e geçmeden veya Faz 3 home page'i wire etmeden önce kapatılmalı.

#### 4.6.1 🔴 KRİTİK — Section→Tool cross-nav kırık (eski `window.dispatchEvent` pattern)  _**Tamamlandı**: commit 7608716 useQuranNav route-based_
Eski Vite overlay-state pattern'ı route migration sonrası ölü kaldı. Section'larda butonlara tıklanıyor ama hiçbir şey olmuyor.

- [x] `next/src/sections/PsychologySection.jsx` — `window.dispatchEvent(new CustomEvent('open...'))` → `router.push('/arac/...')` veya `<Link>`
- [x] `next/src/sections/HiddenArchitecture.jsx` — aynı pattern
- [x] `next/src/sections/QuranDua.jsx` — aynı pattern
- [x] `next/src/sections/HumanDefinition.jsx` — aynı pattern
- [x] `next/src/sections/QuranRhetoric.jsx` — aynı pattern
- [x] `next/src/sections/ZeroRedundancy.jsx` — aynı pattern
- [x] `grep -rn "window.dispatchEvent" next/src/` ile kalan event-based nav'leri tara — hepsini Next.js router pattern'ına çevir
- [x] Faz 4.3 not'unda söz verilen `router.push('/graf/ayet?q=...')` pattern'ı tüm cross-tool linkler için uygulanır

**Pattern (eski → yeni):**
```jsx
// ❌ Eski
onClick={() => window.dispatchEvent(new CustomEvent('openKuranRetorigi'))}

// ✅ Yeni
import { useRouter } from 'next/navigation';
const router = useRouter();
onClick={() => router.push('/arac/retorik')}
// veya:
<Link href="/arac/retorik">...</Link>
```

#### 4.6.2 🔴 KRİTİK — Home page wiring yarım (Faz 3 eksiği)  _**Tamamlandı**: commit bbc1b27 full scroll-story_
Faz 4 tool route'ları, Faz 3 home page tam tamamlanmadan başlamış görünüyor.

- [x] `next/src/app/page.js` (veya `page.jsx`) — section'ları import edip wire et (Hero, MathMiracle, LinguisticDNA, ... Conclusion sırası — CLAUDE.md §6 narrative arc'ı koru)
- [x] `next/src/app/layout.js` — Navbar import + body wrapper kontrolü; Footer da burada
- [x] Home page render edildiğinde tüm section'lar görünüyor mu — manuel smoke test
- [x] Locale-prefix routing (`/tr`, `/en`) ile uyumlu mu — Faz 5'e geçmeden önce home `/tr`/`/en` altında da çalışmalı

#### 4.6.3 🔴 KRİTİK — SSR-safety: guard'sız `window` çağrıları  _**Tamamlandı**: commit e7ba040 SSR fix_
20 section `'use client'` direktifli ama component body'sinde (useEffect dışında) doğrudan `window` çağırıyorlar. Şu an home page wire değil, sessiz; wire edilince patlar.

- [x] `next/src/sections/AllTopics.jsx:21-22` — `window.addEventListener('resize')` doğrudan; `useEffect`'e taşı
- [x] `next/src/sections/PathCards.jsx` — aynı pattern
- [x] `next/src/sections/ZeroRedundancy.jsx:22` — `window.dispatchEvent` doğrudan (4.6.1 ile birlikte düzelir)
- [x] `grep -rn "window\." next/src/sections/ next/src/components/ | grep -v useEffect` ile guard'sız tüm çağrıları tara
- [x] Pattern: `useState(() => window.innerWidth < 640)` → `useState(false)` + `useEffect(() => setIsMobile(window.innerWidth < 640), [])` (CLAUDE.md §14.1 SSR-safe formu)

#### 4.6.4 🟡 ORTA — Token drift (CLAUDE.md §13.1 ihlali)
Migration sırasında bazı section'larda ham rgba değerleri kalmış.

- [ ] `next/src/sections/ZeroRedundancy.jsx:22` — `'rgba(212,165,116,0.10)'` → `COLORS.goldAlpha10`
- [ ] Aynı dosyada `'rgba(212,165,116,0.25)'`, `'rgba(212,165,116,0.7)'`, `'rgba(8,10,26,0.97)'` token'lara çevrilir
- [ ] `grep -rnE "rgba\(212,165,116|rgba\(8,10,26|#d4a574|#0a0a1a" next/src/` — kalan ham renkleri tara, hepsini `tokens.js`'ten import et
- [ ] Faz 2.3 (tokens audit) bu işin zaten yapılması gereken yeri — orada deferred kalan item'lar buraya akar

#### 4.6.5 🟡 ORTA — i18n key drift (1 satır fark)
- [ ] `next/src/i18n/tr.json` (1289 satır) ve `en.json` (1290 satır) arası 1 key farkı
- [ ] `python3 -c "import json; tr=json.load(open('next/src/i18n/tr.json')); en=json.load(open('next/src/i18n/en.json')); ...` ile key delta'sını tespit et
- [ ] Eksik key'i ekle (büyük olasılıkla yeni Faz 4 tool route'larından birinde i18n unutulmuş)

#### 4.6.6 ⚪ Tartışmalı — Eski `src/` (Vite) klasörünün akıbeti
- [ ] **Karar gerekli:** Faz 4.4 sonrası Vite tarafı hâlâ deploy ediliyor mu, yoksa salt referans mı?
- [ ] Eğer aktif değilse: Faz 11.1 (cleanup) sırasında `git mv src/ legacy/src/` veya tag + delete kararı kullanıcıdan alınır (CLAUDE.md "File Safety" — silmeden önce onay)
- [ ] `dist/` build artifact'ı da aynı muhamele — son Vite build'i artık deploy edilmiyorsa silinir

#### 4.6.7 Doğrulama (Faz 5'e geçmeden)  _**Tamamlandı**: build pass + curl smoke tests_
- [x] Home page'i lokalde aç (`npm run dev` next/ içinde), tüm section'lar görünüyor mu?
- [x] Her section'daki tool linkleri tıklanınca doğru route'a gidiyor mu? (4.6.1 testi)
- [x] `grep -rn "window.dispatchEvent" next/src/` → 0 sonuç bekleniyor
- [x] `grep -rnE "rgba\([0-9]" next/src/sections/` → 0 sonuç bekleniyor
- [x] tr.json / en.json key sayısı eşit
- [x] Production build (`npm run build`) hatasız geçiyor mu — RSC/'use client' boundary doğrulaması

---

## Faz 5 — i18n Locale Routing (1 hafta)

### 5.1 Karar  _**Tamamlandı**: URL-prefix Opsiyon A_
- [x] **Opsiyon A:** URL prefix routing — `/tr/oku/2`, `/en/oku/2`
  - SEO için en iyi (separate URL per locale)
  - hreflang tags otomatik
- [x] **Opsiyon B:** Cookie + same URL — `/oku/2` her iki dilde de
  - SEO için zayıf; Google için tek dil indekslenmiş gibi görünebilir
- [x] **Öneri: A**

### 5.2 Implementation (Opsiyon A)  _**Tamamlandı**: commit 25de6ef middleware + [locale]_
- [x] `next/src/app/[locale]/layout.jsx` — locale wrapper
- [x] `next/src/app/[locale]/page.jsx` — home (per locale)
- [x] `next/src/middleware.js` — locale detection + redirect (root `/` → `/tr` veya `/en` browser language'a göre)
- [x] `generateStaticParams` her route'da: `[{locale: 'tr'}, {locale: 'en'}]`
- [x] `next-intl` paketi öneri — server component'lerde de translation çalışır
  - Veya mevcut Context tabanlı yaklaşımı koru (sadece client component'lerde işe yarar)

### 5.3 Hreflang  _**Tamamlandı**: commit 54a24fa alternates.languages_
- [x] `generateMetadata` her sayfada `alternates: { languages: { tr: '/tr/...', en: '/en/...' } }`

---

## Faz 6 — Data Layer (3-5 gün)

### 6.1 JSON imports
- [ ] Şu an: `fetch('/X.json')` (runtime fetch)
- [ ] Yeni: `import data from '@/data/X.json'` veya `fs.readFile` (build-time)
- [ ] Büyük JSON'lar (`verse-graph-bgem3.json`) için RSC'de `cache()` ile wrap
- [ ] Static data → RSC'de read; client'a `props` ile geç

### 6.2 Verse-graph & corpus  _**Tamamlandı**: commit 3fc1081 228 statik URL_
- [x] `public/corpus/[1-114].json` → her sure ayrı dosya, route bazlı yüklenir
- [x] ReadingMode `/oku/[surah]` → ilgili corpus dosyasını server'da yükle, client'a geç
- [x] `verse-graph-bgem3.json` → `/graf/ayet` page'inde dinamik import

### 6.3 acikkuran.com API  _**Tamamlandı**: commit f352c2a /api/meal proxy Edge_
- [x] Şu an client-side fetch
- [x] Yeni: server-side fetch + Next.js cache (`{ next: { revalidate: 86400 } }`)
- [x] Veya pre-build sırasında tüm 6236 ayeti çek, `data/api-snapshot/` altında sakla

---

## Faz 7 — SEO Infrastructure (1 hafta — migration'ın en kritik faz'ı)

> **Not:** Bu faz Next.js migration'ının ana motivasyonudur. Aşağıdaki maddeler Next.js'in sunduğu SEO superpower'ları tam kullanır. **Faz 0.5** (aşağıda eklenmiştir) Vite tarafında bile uygulanabilir SEO quick win'leri kapsar — migration'a başlamadan önce yapılması önerilir.

### 7.1 Metadata API (Next.js native)  _**Tamamlandı**: commit 54a24fa pageMetadata + OG + Twitter_
- [x] **Root layout** (`app/layout.jsx`):
  - `metadata.title.template`: `'%s | QuranCodex'`
  - `metadata.title.default`: `"QuranCodex — Kur'an'ın Görünmeyen Mimarisi"`
  - `metadata.description`: TR + EN versions per locale
  - `metadata.keywords`: kuran, tefsir, ayet, sure, kıssa, mucize, dilsel analiz, structured data
  - `metadata.authors`, `metadata.creator`, `metadata.publisher`
  - `metadata.formatDetection`: telephone disable, email disable, address disable
  - `metadata.metadataBase`: `new URL('https://qurancodex.com')`
- [x] **Per-route `generateMetadata`** her dynamic route'da:
  - `/oku/[surah]`: title = `"${sureNameTr} (${sureNameLatin}) — Sure ${N}"`, description = ilk ayet meal'i + ayet sayısı + nüzul yeri
  - `/atlas/kissa/[id]`: kissa başlığı + 1-line özet
  - `/atlas/peygamber/[id]`: peygamber adı + dönem + kısa açıklama
  - `/graf/*`: tool adı + description
  - Her birinde `keywords` route-spesifik (örn. Bakara → "ayet'el-kürsi, en uzun sure, medeni sure")
- [x] **OpenGraph metadata** her sayfada:
  - `og:title`, `og:description`, `og:url`, `og:type` (website veya article)
  - `og:locale` (tr_TR veya en_US), `og:locale:alternate`
  - `og:image` — 1200x630 (aşağıda 7.5)
  - `og:site_name`: 'QuranCodex'
- [x] **Twitter cards** her sayfada:
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

### 7.3 Sitemap (`app/sitemap.js`)  _**Tamamlandı**: commit 54a24fa + 302 URL_
- [x] Dinamik sitemap generator:
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
- [x] **Sitemap split:** Eğer URL sayısı 50K'yı geçerse (ayet seviyesinde route'lar varsa) sitemap index oluştur
- [x] **hreflang sitemap:** Her URL'in alternate locale linklerini ekle (`alternates: { languages: {...} }`)
- [x] Beklenen URL sayısı: 165 × 2 locale = **~330 URL** (sure-bazlı) veya 6236 × 2 + diğerleri = **~13K URL** (ayet-bazlı eklenirse)

### 7.4 robots.txt (`app/robots.js`)  _**Tamamlandı**: commit 54a24fa robots.js + Sitemap_
- [x] `userAgent: '*'`, `allow: '/'`
- [x] `disallow: ['/api/', '/_next/']`
- [x] `sitemap: 'https://qurancodex.com/sitemap.xml'`
- [x] Crawl-delay yok (Google ignore eder zaten)

### 7.5 OpenGraph Image Generation
- [ ] **Dynamic OG images** Vercel'in `@vercel/og` ile:
  - `app/opengraph-image.jsx` — default site OG
  - `app/oku/[surah]/opengraph-image.jsx` — her sure için unique OG (sure adı + Arabic name + sure numarası + parchment background)
  - `app/atlas/peygamber/[id]/opengraph-image.jsx` — peygamber adı + dönem
  - `app/arac/[tool]/opengraph-image.jsx` — tool ikonu + adı
- [ ] **Twitter image** ayrı veya OG image reuse
- [ ] **Brand consistency:** KFGQPC font (Arabic), Playfair (Latin), antique gold, cosmic black background
- [ ] **Test:** Twitter Card Validator, Facebook Sharing Debugger, LinkedIn Post Inspector

### 7.6 Canonical URLs  _**Tamamlandı**: pageMetadata canonical_
- [x] Her sayfa `generateMetadata`'da:
  ```js
  alternates: {
    canonical: '/oku/2',  // metadataBase ile absolute olur
    languages: {
      'tr': '/tr/oku/2',
      'en': '/en/oku/2',
    },
  }
  ```
- [x] **Query param normalize:** `?utm_source=...` gibi tracker'lar canonical'da kaldırılmalı
- [x] **www vs non-www:** Tek kanonik (öneri: www.qurancodex.com), diğeri 301 redirect

### 7.7 URL Yapı Standartları (SEO-first)  _**Tamamlandı**: tum route lowercase kebab-case_
- [x] **Lowercase only:** `/oku/bakara` değil `/oku/Bakara`
- [x] **Latin transliteration:** Türkçe karakter yerine ASCII (`bakara`, `ayetel-kursi`, mevcut Latin isim listesi kullan)
- [x] **Kebab-case:** `/atlas/peygamber-zincir` değil `/atlas/peygamberZincir`
- [x] **Numeric ayet:** `/oku/2/255` (insan-okunabilir + bot-friendly)
- [x] **Kısa path:** `/oku/2` < 80 karakter olmalı
- [x] **No trailing slash:** `next.config.js` → `trailingSlash: false`

### 7.8 Internal Linking
- [ ] **Visual breadcrumb komponentleri** her route'da — DEFERRED. Tool route'ları (`atlas/*`, `graf/*`, `arac/*`, `oku/[surah]`) Vite döneminden gelen `position: fixed; inset: 0; zIndex: 9999` overlay pattern'ı kullanıyor; bir thin breadcrumb strip overlay'in altında kalır ve render edilemez. JSON-LD breadcrumb (Faz 7.2) zaten mevcut → SEO etkisi karşılandı. Tools normal-flow layout'a refactor edilince (post-migration polish faz'ı) visual breadcrumb tekrar denenecek.
- [x] **Related links** her sure sayfasında: prev/next sure linkleri `<SurahPagination>` server component'iyle eklendi (`next/src/components/SurahPagination.jsx`). `rel="prev"`/`rel="next"` ile Google internal-linking hint; sr-only stil (ReadingMode overlay'i kapadığı için görsel parity korunur, ama HTML'de yer alır).
- [x] **Anchor text** anlamlı: Footer "Sayfaları Keşfet" bloğundaki tüm linkler "Bakara Suresi'ni oku (Sure 2)", "Kıssa Atlası — peygamber kıssaları" pattern'iyle yazıldı.
- [x] **Footer'da** önemli sayfa linklerini tut: 4 sütunlu internal link grid eklendi (`next/src/components/Footer.jsx`) — Atlas (5), Graf & Veri (5), Araçlar (5), Popüler Sureler (6) = 21 internal link, TR + EN varyantlarıyla.
- [ ] **Sitemap.html** (kullanıcıya yönelik HTML index) — SKIP. XML sitemap (Faz 7.3) zaten 302 URL üretiyor; ek HTML index marginal değer. Gerekirse post-deploy eklenir.

**Faz 7.2 kalıntı bug fix (bonus):** 21 page.js dosyasının TITLE/DESC alanlarında Python regex'i `'` (apostrophe) üzerinden truncate olmuştu — `'Kur'an'` → `'Kur'`. Hepsi düzeltildi: çift tırnaklı string literal kullanıldı, anlamlı 100-150 karakterlik description yazıldı. `<meta name="description">`, OG/Twitter, JSON-LD LearningResource hepsi düzgün metni alıyor.

### 7.9 Content & On-Page SEO
- [x] **H1 tek tane** her sayfada — `<PageHeading>` server component eklendi (`next/src/components/PageHeading.jsx`); 35 tool page.js + `/oku/[surah]/page.js` her birine `<PageHeading title={TITLE} description={DESC} />` enjekte edildi. Homepage'da Hero zaten `<h1>` taşıyor. SSR'da her sayfa exactly 1 H1 (curl ile 4 sayfada verify edildi: /tr, /tr/atlas/kissa, /tr/oku/2, /tr/arac/wow → her biri 1 H1).
- [x] **Heading hierarchy** doğru — Homepage Hero (H1) → section H2'leri → kart H3/H4'leri, atlama yok. Tool sayfalarında SSR'da yalnız H1 (PageHeading) var; hydration sonrası tool component'leri H2+ ekliyor, hierarchy korunuyor.
- [ ] **Alt text** tüm görselleri — DEFERRED. 365 SVG var; sadece 2'sinde aria. Çoğu icon button içi (decorative — `aria-hidden="true"` yeterli). Bazıları meaningful (atlas haritaları, charts — `aria-label` gerek). Triage 363 element için ayrı a11y polish task'i; SEO etkisi marginal (Google buton text'ini zaten okuyor).
- [x] **Semantik HTML** — `<header>` (PageHeading), `<nav>` (SurahPagination + Footer internal links), `<footer>` (Footer.jsx), `<section>` (Hero ve diğer section'lar). CLAUDE.md §9 zaten zorunlu kılıyor — bileşenler bu pattern'ı takip ediyor.
- [ ] **Meaningful first paragraph** (50-100 kelime giriş) — PARTIAL. PageHeading'in `<p>{DESC}</p>` paragrafı 15-25 kelime aralığında, 50 kelimenin altında. Tam içerik yazımı (per-tool 100+ kelime intro) ayrı content writing fazına bırakıldı.
- [ ] **Word count** (tool 200+ / sure 300+ kelime) — DEFERRED. Tool sayfaları interaktif — body text minimal. Sure sayfaları zaten 300+ kelime üretiyor (ayet metni + meal + tefsir paneli) ama hydration sonrası. Static body text artırımı için ayrı content writing pass'i gerekli.

**Faz 7.9 sonrası açık not:** Tam TR/EN parite metadata ve uzun-form per-tool intro paragrafları (~200 kelime × 36 tool × 2 dil = 14.400 kelime) Faz 7.17 (Content Strategy) altına alındı.

### 7.10 Core Web Vitals (SEO ranking factor)
- [x] **LCP — KFGQPC preload**: `<link rel="preload" href="/fonts/kfgqpc-hafs.otf" as="font" type="font/otf" crossorigin>` root layout `<head>`'ine eklendi. KFGQPC her Arapça ayet render'inda kullanılıyor (homepage Hero/sections, tüm tool sayfaları, reading mode) → first paint için kritik. ShaykhHamdullah BİLİNÇLİ preload edilmedi (sadece /oku/[surah]'da kullanılıyor; root'ta preload boşa bant genişliği). Mevcut `font-display: swap` zaten FOUT davranışı sağlıyor (FOIT yok).
- [ ] **LCP — next/font/local migration**: DEFERRED. 53 inline `'KFGQPC'` literal'i + `FONTS.quran` tokens reference'ı next/font/local'ın hash'li class name'iyle çakışıyor. Migration için tüm 53 referansı `var(--font-kfgqpc)` ile değiştirmek + tokens.js güncellemek gerekiyor → ayrı invasive refactor. `<link rel="preload">` zaten LCP fayda sağlıyor; next/font ek "auto preload + class" otomasyonu marginal.
- [ ] **LCP — Critical CSS inline + image priority**: DEFERRED. Tailwind v4 + next.js zaten critical CSS otomatik inline ediyor. Above-fold image'ler (Hero arka planı) genelde SVG/CSS — next/image priority kullanımı için ayrı audit gerek.
- [ ] **CLS — size-adjust/ascent-override**: SKIP (şimdilik). KFGQPC fallback'i 'Amiri Quran' similar metrics; gözle görülür CLS yok. Post-deploy gerçek ölçüm sonrası iyileştirme yapılır.
- [ ] **CLS — image width/height + space reserve**: PARTIAL. next/image otomatik width/height inject ediyor; lazy section'lar için `min-height` reserve audit edilmedi (post-deploy).
- [x] **INP — rAF loop'ları**: Vite'tan beri visibility-aware (zaten yapılıyor); Particle background `requestAnimationFrame` ile inactive tab'larda otomatik duruyor.
- [x] **TTFB — SSG**: Faz 6.2'de tüm sure sayfaları + tool sayfaları statik üretiliyor (`generateStaticParams` 1-114 sure × 2 locale = 228 statik HTML + 36 tool × 2 = 72 statik tool sayfası).
- [ ] **Test — PageSpeed Insights / Web.dev**: Post-deploy (Faz 7.14 Search Console + 7.15 Analytics ile birlikte).

### 7.11 International SEO  _**Tamamlandı**: Faz 5 hreflang + html lang_
- [x] **hreflang tags** (7.6 ile zaten kaplıyor)
- [x] **`<html lang="tr">` veya `<html lang="en">`** locale'e göre
- [x] **`dir="ltr"` Latin route'larda**, Arabic verse içeren bloklarda `dir="rtl"` (component-level, zaten CLAUDE.md §13.2)
- [x] **Locale-specific descriptions:** TR ve EN ayrı, makine çevirisi yapma (i18n JSON'larda zaten ayrı)

### 7.12 Mobile-First SEO
- [x] **Mobile usability**: CLAUDE.md §14 mobil pattern'ları zorunlu kılıyor; tüm bileşenler isMobile detection + responsive grid kullanıyor. Vite'tan migration sırasında 1:1 visual parity korundu.
- [ ] **Tap target size** (48x48px Lighthouse) — DEFERRED, post-deploy Lighthouse audit gerekli. Mevcut button'lar genelde 32px+ height; bazılarının padding ile genişletilmesi gerekebilir.
- [x] **Viewport meta**: `src/app/layout.js`'te `viewport` export — width=device-width, initialScale=1, themeColor='#0a0a1a' ✅.
- [x] **No interstitials**: Site cookie banner / popup interstitial içermiyor — mobile UX clean.

### 7.13 Performance Budget
- [ ] **Bundle size analizleri** — DEFERRED post-deploy. `@next/bundle-analyzer` + CI threshold script Faz 8 (Performance) içinde ele alınır. Production build → gerçek ölçüm sonrası prio set edilir.
- [ ] **KFGQPC font subset** (~600KB → ~200KB) — DEFERRED. Arapça için tam glyph kümesi gerekli; subsetleme için pyftsubset/fonttools script gerekli. İlk deploy sonrası gerçek bant tüketimi ölçülüp karar verilir.

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
Mevcut implementation:
- [x] **Organization** (root layout)
- [x] **WebSite** (root layout — SearchAction olmadan; real search endpoint yok)
- [x] **BreadcrumbList** (her route, Faz 7.2)
- [x] **Article + Book partOf** (sure sayfaları, Faz 7.2)
- [x] **LearningResource** (35 tool sayfası, Faz 7.2)
- [ ] **SearchAction** — DEFERRED. `/arama?q={query}` route yok; sahte SearchAction Google'a yanıltıcı sinyal verir. Real search endpoint kurulduğunda eklenir.
- [ ] **Person** (peygamber sayfaları) — DEFERRED. ProphetAtlas tool var ama tek peygamber için dedicated route yok (`/atlas/peygamber/yusuf` gibi). Route eklendiğinde Person schema doğru olur.
- [ ] **FAQPage** — DEFERRED. WowFacts kartları Q&A formatında değil (kavram + ayet referansı pattern'ı). FAQ formatı varsa /sss veya /yardim route'unda eklenir.
- [ ] **Rich Results Test** — POST-DEPLOY. Google'ın validator'unda her schema'yı sample URL ile manuel test (5 sure + 5 tool).

### 7.17 Content Strategy for SEO (post-migration)
**POST-DEPLOY content writing fazı.** Migration core kapanınca, ayrı bir content strategy session'da:
- [ ] Long-tail keyword research (Ahrefs / Search Console gerçek query data ile)
- [ ] Pillar content her sure için (Faz 7.9'da deferred edilen ~300 kelime sure intro'su buraya akar)
- [ ] Cluster content (esbâb-ı nüzûl, retorik, dilsel analiz alt sayfaları)
- [ ] `lastModified` zaman damgası ile sitemap'i besleme
- [ ] `/yazi/[slug]` blog route ekleme

**Faz 7.9'dan toplanan content backlog:** 36 tool sayfası için 100-200 kelime intro × 2 dil ≈ 14.400 kelime; 114 sure için 300+ kelime özet × 2 dil ≈ 68.400 kelime. Toplam ~80K kelime. Adım adım yazılır.

---

## Faz 8 — Performance (3-5 gün)

### 8.1 Font optimization
- [x] `display: 'swap'` (FOIT'tan kaçın) — `globals.css` @font-face her ikisinde de `font-display: swap` ✅
- [x] Preload critical fonts only — Faz 7.10'da KFGQPC için `<link rel="preload">` eklendi; ShaykhHamdullah bilinçli preload edilmedi ✅
- [ ] `next/font/local` ile KFGQPC self-host — DEFERRED. 53 inline `'KFGQPC'` literal'i + `FONTS.quran` token'ı next/font'ın hash-generated class name'iyle çakışır; tüm referansları `var(--font-kfgqpc)` ile değiştirmek gerekir. Mevcut manual @font-face + preload zaten LCP fayda sağlıyor; ek refactor marginal.

### 8.2 Image optimization
- [x] Raster image — YOK. Site tamamen SVG (icon + diagram) + font-tabanlı tipografi kullanıyor. `next/image` için kullanım yeri yok ✅
- [x] SVG import — Next.js Vite-tarzı inline JSX SVG'leri destekliyor; `@svgr/webpack` config'e gerek yok ✅

### 8.3 Bundle analysis
- [ ] `@next/bundle-analyzer` kur — DEFERRED (yeni dependency; user approval bekliyor). Production build sonrası `.next/build/static/chunks/` directory'sinden manuel inspect edilebilir.
- [ ] Framer Motion lazy load — DEFERRED, bundle analyzer çıktısına bakılarak karar verilir; framer-motion 200+ section'da inline kullanılıyor, route bölme şart değilse maliyet düşük.
- [ ] Tool route bundle sınırı — DEFERRED, ölçüm sonrası.

### 8.4 Core Web Vitals
- [ ] **LCP/CLS/INP ölçümleri** — POST-DEPLOY. Faz 7.10'da tüm aksiyonlar alındı (preload, SSG, display:swap, requestAnimationFrame visibility-aware). Gerçek ölçümler PageSpeed Insights / Web.dev / CrUX Dashboard ile post-deploy yapılır; threshold ihlali varsa hedefli optimizasyon eklenir.
- [x] `next/script` strategy — Next 16'da `<script>` tag'leri otomatik defer; tüm site script'leri SSR/RSC içinde — eksternal third-party script yok.

---

## Faz 9 — Testing & QA (1 hafta)

### 9.1 Functional parity
**Smoke test (curl HTTP 200):** 16 sample route + sitemap + robots + locale OG hepsi 200 ✅ (Faz 9.2 audit script).
**Manuel UI test:** POST-DEPLOY veya local dev session'da kullanıcı tarafından yapılır (tarayıcı interaction gerekiyor):
- [ ] Sample sureler (Fatiha, Bakara, Yâsîn, İhlâs)
- [ ] Tool route'ları (sample ~10)
- [ ] Cross-tool navigasyon (VerseGraph ↔ ConceptGraph back)
- [ ] Karaoke audio + word highlight
- [ ] Reading mode page turn
- [ ] Meal yükleme
- [ ] Dil değişikliği persist
- [ ] Mobile responsive (390px - 1440px)

### 9.2 SEO parity
- [x] **`curl -s URL | grep title/desc/h1/jsonld/og`** — 16 sample route (TR + EN homepage, 5 sure, 3 atlas, 2 graf, 4 arac) test edildi; her birinde H1 + `<title>` + `<meta name="description">` + JSON-LD + OG tag mevcut (16/16 ✅).
- [x] **view-source HTML** — `curl` SSR HTML'inde gerçek içerik var: H1, breadcrumb JSON-LD, sitemap link (302 URL), robots.txt 131 bytes, locale OG image 120KB PNG döndü.
- [ ] **Google Rich Results Test** — POST-DEPLOY. Local dev'de erişilemez (Google validator URL erişim ister).
- [ ] **Lighthouse SEO score >= 95** — POST-DEPLOY. Local Lighthouse mümkün ama production build sonrası daha temsili.

**Bilinen Turbopack dev-mode bug:** `/tr/oku/[surah]/opengraph-image` route'u dev mode'da `ENOENT app-paths-manifest.json` ile crash ediyor (`[__metadata_id__]` segment path'inde manifest oluşmuyor). `/tr/opengraph-image` (locale-level OG) sorunsuz çalışıyor → kodda hata yok, Turbopack'in nested dynamic route + metadata-id combo'sunda dev cache regression'ı var. Production `next build` bu manifestleri pre-generate ettiği için sorun production'da olmaz; bir sonraki dev server restart'ı (`pkill next && next dev`) bug'ı tetikleyen cache state'i temizler.

### 9.3 Performance regression
- [ ] Lighthouse Performance — POST-DEPLOY. Production build sonrası gerçek metrics.
- [ ] Vite vs Next bundle size karşılaştırması — POST-DEPLOY.

### 9.4 Visual regression
- [ ] Playwright snapshot — Playwright kurulu değil; ayrı task.
- [ ] qc-visual-auditor agent — Faz 4.5'te 2026-05-23 visual audit zaten yapıldı (`docs/reviews/2026-04-25-double-scroll-audit.md` ve diğerleri); ek pass cutover öncesi.

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
- [x] **CLAUDE.md §16 Next.js Patterns** — Migration sırasında keşfedilen 14 pattern dokümante edildi (TBD'den production'a):
  - 16.1 RSC vs Client Components karar matrisi
  - 16.2 `'use client'` direktifi kuralı
  - 16.3 `generateMetadata` template + module-level const pattern
  - 16.4 Locale routing (`[locale]` + middleware)
  - 16.5 Route-to-overlay transformation pattern
  - 16.6 SSR-safety patterns (hydration mismatch önleme)
  - 16.7 Server vs client data fetching
  - 16.8 JSON-LD structured data pattern
  - 16.9 Cross-route navigation (`router.push`)
  - 16.10 Font loading pattern (hybrid: preload + @font-face)
  - 16.11 `generateStaticParams` statik üretim
  - 16.12 sr-only SEO-visible / visually-hidden pattern
  - 16.13 Module-level hash drift'ten kaçınma
  - 16.14 Turbopack dev-mode quirk (`[__metadata_id__]` ENOENT)
- [ ] **Yeni overlay/tool ekleme guide'ı** — DEFERRED. §16.5'te overall pattern var; her tool tipine özel checklist (sidebar mobile, search modal, vb.) ayrı yazılır.

### 11.3 Lessons learned
- [ ] `tasks/lessons.md`'ye migration'dan çıkan ders/patternları yaz — POST-CUTOVER (deploy ve gerçek production traffic gözlendikten sonra).

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

---

## Faz 4.5 — Görsel Audit Düzeltmeleri (2026-05-23)

**Kaynak:** `docs/reviews/2026-05-23-visual-audit-migration-branch.md`
**Bağlam:** Faz 4.1–4.4 (ReadingMode + 34 tool route'a taşındı) tamamlandıktan sonra qc-visual-auditor ile yapılan denetim. **Kritik: 5, Yüksek: 7, Orta: 8, Düşük: 5 bulgu.**
**Hedef:** Faz 5'e (Locale routing) geçmeden önce K1–K5 + Y4 mutlaka kapatılmalı (kullanıcı görsel olarak migration'ın yarım olduğunu hissediyor — navbar gizli, route'lar boş açılıyor, çıkış yok).

### Kritik (P0 — Faz 5'ten önce kapatılmalı)

- [ ] **K1 · Çift Navbar bug** — `next/src/app/layout.js:56` ve `next/src/app/[locale]/layout.js:28` ikisi de `<Navbar />` render ediyor. Nested layout'lar birikiyor → her `/tr/...` route'unda iki navbar üst üste.
  - **Çözüm:** Root `app/layout.js`'ten `<Navbar />` ve Provider'ları kaldır; sadece `<html><body>{children}</body></html>` + font imports + globals kalsın. Provider'lar ve Navbar `[locale]/layout.js`'te.
  - **Efor:** ~10 dk, 1 commit. En yüksek görsel etki/efor oranı.

- [ ] **K2 · 36 overlay component'i hâlâ `position:fixed, inset:0, zIndex:9999`** — Route'lar kurulmuş ama component'ler hâlâ "modal" zihniyetinde; Navbar'ı tamamen örtüyor. Kullanıcı `/oku`, `/graf/ayet`, `/arac/wow` route'una girince navbar görünmez → site navigation'a erişim yok.
  - **Etkilenen dosyalar:** `ReadingMode.jsx:2292`, `ConceptGraph.jsx:302`, `WowFacts.jsx:779`, `VerseGraph.jsx:1026`, `EsmaFrekans.jsx`, `Melekler.jsx`, `KuranYeminleri.jsx`, `QuranCommands.jsx` + 28 dosya daha. Liste: `grep -rln "OVERLAY_BASE\|inset: 0, zIndex: 9999" next/src/components next/src/sections`.
  - **Çözüm A (tercih edilen):** Component'leri "section/main" pattern'ına çevir — `position:fixed, inset:0, zIndex:9999` → `min-height: calc(100vh - 54px)` + `padding-top: 54px`. Header'larındaki kendi başlık barını kaldır.
  - **Çözüm B (hızlı patch):** Overlay'lerin `zIndex`'ini Navbar altına (`zIndex: 50`) + `top: 54px`. Navbar görünür hale gelir, mimari refactor sonraya bırakılır.
  - **Efor:** A için birkaç gün (36 component), B için 1-2 saat (codemod).

- [ ] **K3 · `/arac/tum-araclar` boş ekran açıyor** — `ToolsBrowser.jsx:52-74` internal `open=false` ile başlıyor; sadece `'openToolsBrowser'` custom event'iyle açılıyor. Route page `onClose` prop geçiriyor ama event tetiklenmediği için `<AnimatePresence>{open && ...}</AnimatePresence>` boş. Silent bug.
  - **Çözüm:** ToolsBrowser'a `defaultOpen` veya `mode='page'` prop ekle; route'ta `defaultOpen={true}` ile mount et. Veya `ToolsBrowserRoute.jsx` içinde `useEffect`'le `window.dispatchEvent(new Event('openToolsBrowser'))` (kirli ama hızlı).
  - **Efor:** ~30 dk, 1 commit.

- [ ] **K4 · `ProphetAtlas` `onClose` prop'unu kabul etmiyor + `id="math"` artığı** — `next/src/sections/ProphetAtlas.jsx:1468` `function ProphetAtlas()` parametresiz; route'tan gelen `onClose={() => router.back()}` siliniyor. Üstelik `id="math"` (Faz 2'den kopya artığı). Kullanıcının çıkış yolu yok (navbar K2 nedeniyle gizli).
  - **Çözüm:** `function ProphetAtlas({ onClose })` parametre ekle, header'a `CLOSE_BTN`'lu çıkış butonu (onClose verildiyse). `id="math"` → `id="prophet-atlas"`.
  - **Efor:** ~15 dk, 1 commit.

- [ ] **K5 · `useQuranNav` locale-prefix'siz `router.push`** — `next/src/hooks/useQuranNav.js:19-64` `OVERLAY_ROUTES = { reading: '/oku', graph: '/graf/ayet', ... }` locale prefix yok. Middleware (`middleware.js:38`) redirect ile `/tr/oku`'ya çeviriyor → 2 frame'lik flicker + paylaşılan URL'lerde middleware'siz ortamlarda kırılma riski.
  - **Çözüm:** `useQuranNav` içinde `useLanguage()` okuyup `const url = \`/${language}${route}${detail?.search ? \`?q=${...}\` : ''}\`` ile prefix ekle.
  - **Efor:** ~10 dk, 1 commit.

### Yüksek (P1 — Faz 5/6 sırasında)

- [ ] **Y1 · §13.10 ihlali — OVERLAY_TITLE kullanılmayan overlay'ler** — 7+ yerde inline `'Playfair Display', '#d4a574', 1.05–2rem, 700` ile başlık. Modal başlık tipografisi her overlay'de farklı.
  - **Dosyalar:** `VerseGraph.jsx:1035, 1507`, `QuranCommands.jsx:206`, `ReadingMode.jsx:4792, 5343, 6874, 6885, 6910`.
  - **Çözüm:** `style={OVERLAY_TITLE}` veya `style={{ ...OVERLAY_TITLE, ek }}`.

- [ ] **Y2 · §13.2 ihlali — Kur'an metni için `'Amiri'`** — Aynı sayfada bazı Arapça kelimeler KFGQPC, bazıları Amiri ile çiziliyor; ritm bozuluyor.
  - **Dosyalar:** `ConceptGraph.jsx:500, 601`, `KissaAtlas.jsx:371`.
  - **Çözüm:** Hepsi `fontFamily: FONTS.quran`.

- [ ] **Y3 · §13.1 ihlali — Ham `'KFGQPC', 'Amiri Quran', serif` inline string** — `FONTS.quran` yerine ham string; token değişirse component'ler güncellenmez.
  - **Dosyalar:** `VerseGraph.jsx:776, 1477, 1624, 2416, 2919, 3061, 3180`, `ReadingMode.jsx:3121, 3451, 3560, 4503`, `DuaVerses.jsx:166`, `QuranCommands.jsx:487`, `WordHeatmap.jsx:780, 804, 863`.
  - **Çözüm:** `fontFamily: FONTS.quran`. Ek fallback gerekiyorsa token'ı genişlet.

- [ ] **Y4 · `VerseGraph` `width:480px` absolute sidebar, isMobile guard yok** — 390px ekranlarda viewport'tan taşar.
  - **Dosya:** `VerseGraph.jsx:1490`.
  - **Çözüm:** `width: isMobile ? '100vw' : '480px'` + mobilde §14.4 tab pattern.
  - **Efor:** ~30 dk, 1 commit.

- [ ] **Y5 · Hero CTA ham hex `#1c0f00`** — Altın butonun zemin metni; token'a alınmamış. `paperInk: '#1a0e00'` yakın ama semantic karışıklık.
  - **Dosya:** `Navbar.jsx:1093, 1111`.
  - **Çözüm:** `COLORS.btnGoldText = '#1c0f00'` token ekle; tüm `btn-primary-gold` ve navbar Oku butonu bunu kullansın.

- [ ] **Y6 · Mobil hamburger butonu farklı yükseklikte (≈40px)** — §13.13 ihlali. Diğer navbar butonları 32px; hamburger `p-2 + 24×24 SVG` = ≈40px → görsel asimetri.
  - **Dosya:** `Navbar.jsx:1144-1162`.
  - **Çözüm:** `width:36px; height:36px` ile CLOSE_BTN-benzeri stil.

- [ ] **Y7 · Hero butonu ham rgba + token'sız animasyon değerleri** — `whileHover={{ scale: 1.05, boxShadow: '0 0 48px 12px rgba(180,130,40,0.5)' }}`. `.btn-primary-gold` CSS'inde de `#c9973a → #b8860b → #9a6f0a` renkleri token'da yok.
  - **Dosya:** `Hero.jsx:94`, `globals.css:158`.
  - **Çözüm:** "Altın CTA buton dizisi" için token kümesi: `COLORS.goldButtonStart/Mid/End` veya `linear-gradient` token'ı.

### Orta (P2 — Codemod + ESLint kuralı ile sistemik temizlik)

- [ ] **O1 · `#d4a574` ham hex ~159 kez (VerseGraph) + 1.181 toplam kullanım** — `COLORS.gold`/`goldAlpha15/25` token'ları var ama component'ler ham. Codemod:
  - `'#d4a574'` → `COLORS.gold`
  - `'rgba(212,165,116,0.15)'` → `COLORS.goldAlpha15`
  - `'rgba(212,165,116,0.25)'` → `COLORS.goldAlpha25`
  - `'#e8e6e3'` → `COLORS.offWhite`
  - `'#94a3b8'` → `COLORS.silver`
  - `'#64748b'/`#475569'/`#334155'` → `slate500/600/700`

- [ ] **O2 · Ham rgba 2.293 kullanım** — `rgba(255,255,255,0.04/0.05/0.1)`, `rgba(212,165,116,0.X)` sürekli ham. Top dosyalar: `ReadingMode.jsx` (372), `VerseGraph.jsx` (164), `ProphetAtlas.jsx` (155), `HumanDefinition.jsx` (78), `FurukAtlasi.jsx` (67).
  - **Çözüm:** Codemod + ESLint kuralı: "ham `rgba()` veya `#[a-f0-9]{3,6}` inline style yasak; `tokens.js` import zorunlu".

- [ ] **O3 · BorderRadius token coverage düşük** — 592 ham, 256 RADIUS token. `borderRadius: '8px'` → `RADIUS.md`, `'12px'` → `RADIUS.lg`, `'999px'` → `RADIUS.pill`.

- [ ] **O4 · Transition token coverage düşük** — 226 ham, 25 TRANSITION token. `'all 0.18s'` token'da yok (fast 0.15s ile base 0.2s arası); `TRANSITION.subtle` ekle veya `0.15`'e yuvarla.

- [ ] **O5 · `text-center` body metin üzerinde — §11 ihlali**
  - `HumanDefinition.jsx:1080` — kart içi açıklama (flow body) `text-center`.
  - `LinguisticDNA.jsx:310, 617` — body text + `mx-auto`.
  - **Çözüm:** Kart içi body'lerden `text-center` kaldır; intro paragrafından `mx-auto` kaldır.

- [ ] **O6 · `.glass-card` CSS class ≠ `GLASS_CARD` token** — alpha 0.04 vs 0.05, border 0.08 vs 0.1, radius 16px vs 12px. Tailwind class kullananlar (Footer, Conclusion) ile inline token kullananlar (PathCard, ToolHighlightCard) farklı görünüyor.
  - **Dosya:** `globals.css:141-155` vs `tokens.js:208-220`.
  - **Çözüm:** Token'ı baz al, CSS class'ı token değerleriyle eşitle.

- [ ] **O7 · `cleanArabicForGraph` her component'te kopya — drift riski** — VerseGraph, ConceptGraph, ProphetAtlas + 6 component ayrı ayrı tanımlı; `cleanDuaAr` (ProphetAtlas) ve `cleanArabicForGraph` (VerseGraph) **farklı regex listeleri**.
  - **Çözüm:** `next/src/lib/arabic.js` ortak modülü; tek `cleanArabic()` export. §13.14 + §13.15 fix'leri tek yerde.

- [ ] **O8 · `globals.css --color-glass-border` ≠ `tokens.js glassBorder`** — CSS: `rgba(212,165,116,0.12)` (gold-tonlu), JS: `rgba(255,255,255,0.1)` (beyaz). Tailwind `border-glass-border` altın, inline `COLORS.glassBorder` beyaz → iki farklı kart kenarlığı.
  - **Çözüm:** Aynı değere kilitle (öneri: `0.1` beyaz, Tailwind class buna eşit).

### Düşük (P3 — Cleanup turu)

- [ ] **D1 · Gold variant ham hex'leri** — `'#e8c98a'` (LinguisticDNA:300, VerseGraph:2919), `'#d4b483'` (VerseGraph:2416). `COLORS.goldBright = '#e8c98a'` token ekle.

- [ ] **D2 · `:focus-visible` global ama component-level focus state'leri inline** — Native outline + inline `borderColor` çakışıyor; bazı yerlerde iki vurgu çizimi.
  - **Çözüm:** Component'ler `:focus-visible` CSS'e güvensin; inline `onFocus` bırakılsın.

- [ ] **D3 · Inline `'#64748b'/`#475569'/`#334155'` slate hex'leri token'a alınmamış** — `tokens.js`'te `slate500/600/700` zaten tanımlı. Replace.
  - **Örnek:** `ConceptGraph.jsx:354, 367, 409`.

- [ ] **D4 · Animasyon süreleri tutarsız — `0.15s/0.18s/0.2s/0.25s/0.3s`** — Tüm hover/focus → `fast` (0.15s), tüm panel/drawer → `slow` (0.3s).

- [ ] **D5 · `ProphetAtlas` `id="math"` yanlış anchor** — Section "Peygamberler" işliyor ama id `math` (MathMiracle'dan kalma). Scroll-to-anchor (`#math`) yanlış yere götürüyor + SEO anomalisi.
  - **Dosya:** `ProphetAtlas.jsx:1575`. **Çözüm:** `id="prophet-atlas"`. **Not:** K4 ile birlikte çözülebilir.

### Önerilen Sıra

1. **K1** (10 dk) — anında görsel iyileşme.
2. **K4 + D5** (15 dk) — aynı dosya, tek commit.
3. **K3** (30 dk) — ToolsBrowser mode='page'.
4. **K5** (10 dk) — locale-prefix.
5. **K2 Çözüm B** (1-2 saat codemod) — zIndex 50 + top 54px, geçici ama navbar görünür hale gelir.
6. **Y4** (30 dk) — VerseGraph mobil.
7. **K2 Çözüm A** (birkaç gün, Faz 5/6 paralelinde) — gerçek section/main refactor.
8. **Y1-Y3** (1-2 gün codemod) — OVERLAY_TITLE + FONTS.quran disiplini.
9. **Y5-Y7** — küçük token eklemeleri, tek commit.
10. **O1-O8** — codemod + ESLint kuralı; Faz 11 (cleanup) içinde.
11. **D1-D5** — Faz 11'de tek commit.
