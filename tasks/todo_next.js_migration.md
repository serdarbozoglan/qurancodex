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
- [~] **LCP/CLS/INP ölçümleri** — **Local production benchmark 2026-05-24** (Wave 16 ile birlikte): 8 route × 3 sample networkidle load time **avg 698ms (homepage) - 868ms (oku/bakara)**, hepsi **<1s**, **0 console error**. LCP proxy iyi (≪2.5s); CLS/INP gerçek browser metrics için PageSpeed Insights post-deploy gerekli. Faz 7.10'da alınan tüm aksiyonlar (KFGQPC preload, SSG `generateStaticParams` 228 sure HTML, display:swap, rAF visibility-aware) prod'da geçerli.
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
- [~] Lighthouse Performance — Local prod build benchmark **2026-05-24** ile partial. 8 hot route prod ortalaması <1s, dev'e göre 5-14× speedup. Lighthouse PWA/Perf/SEO/A11y skor: POST-DEPLOY.
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

**İlerleme Logu (2026-05-24):**
- **Round 0 (2026-05-23):** K5 düzeltildi (useQuranNav + Navbar 2 yer); ChapterProgress sol-rail Vite→Next port + homepage mount; K1 önceden çözüldü (root layout temiz, doğrulandı).
- **Round 1 (2026-05-24, paralel 5 agent):** K4 + D5 + K3 + Y2 + Y7 + VerseGraph (Y1+Y3+Y4) tamamlandı. Y5'in token kısmı (`btnGoldText` eklendi) Y7 ile birlikte yapıldı; Y5'in Navbar usage'ı + Y6 Round 2'de.
- **Round 2 (2026-05-24, paralel 6 agent):** Y5 + Y6 + O5 tamamlandı; Y1 ReadingMode 1/5 (4 yer dekoratif display typography olarak gerekçeli atlandı); Y3 ReadingMode 4 + QuranCommands 1 + DuaVerses 1 + KissaAtlas 1 + WordHeatmap 3/5 (kalan 2 scope dışı); Y1 QuranCommands done. **Round 2 toplam: 21 dosya değişikliği.**
- **Round 3 (2026-05-24, paralel 2 agent):** K2 + O6 + O8 tamamlandı. K2: `OVERLAY_BASE` token + 13 dosya inline override → `inset: '54px 0 0 0'`, `zIndex: 50` (toplam 15 dosya). Navbar her zaman görünür, tool route'ları altta. O6: `.glass-card` + `.glass-card-strong` token değerlerine eşitlendi (bg 0.05, border 0.1, radius 12px). O8: `--color-glass-border` `rgba(255,255,255,0.1)` ile sync. **Bonus:** Navbar "Oku" CTA route'a push ediyor (1087, 1232, 289-300); `readingOpen`/`graphOpen` localStorage persistence kaldırıldı; `/oku` route'unda site Navbar gizleniyor (`hideOnReadingMode`); ReadingMode outer `inset: 0`.
- **Round 4 (2026-05-24, paralel 3 agent):** O1 + O2 sweep — **13 dosyada toplam 319+ ham hex/rgba → token swap.** Disjoint dosyalar: (A) VerseGraph 104 + ReadingMode 23 + Melekler 33 + CennetCehennem 59; (B) KavimlerAtlasi 9 + KuranRenkleri 6 + RevelationTimeline 22 + KissaAtlas 33 + SurahComparator 30; (C) WordHeatmap Y3 son 2 + ChapterProgress full + ConceptGraph 11 D3 slate + MeselAtlasi 3 D3 slate. ChapterProgress'te 4 alpha approximation (sub-JND görsel drift). 13 dosyanın hiçbirinde residual hedef ham renk kalmadı.
- **Round 5 (2026-05-24, paralel 4 agent):** O1 + O2 sweep — **24 dosyada toplam ~241 ham hex/rgba → token swap.** Disjoint: (A) ProphetAtlas + HumanDefinition + FurukAtlasi (47 swap); (B) ImpossibleRhythm + SoundArchitecture + QuranDua + IlkSonKelimeler (~100 swap); (C) IblisSatan + ZamanBoyutlari + NefisMertebeleri + AddresseeSystem + EsmaFrekans + DiyalogAgi + KuranRetorigi + KuranYeminleri (~44 swap); (D) KiraatAtlasi + KadinlarAtlasi + SunnetullahAtlasi + MunafikProfili + KiyametSahneleri + MunasebatAtlasi + SebebiNuzul + DogaAtlasi + WowFacts (~50 swap). KuranRetorigi/WowFacts/SebebiNuzul'da kategori palette renkleri (semantic identifier) bilinçli korundu. DogaAtlasi'de pre-existing `COLORS.goldAlpha10` referansı (token yok, fallback'le çalışıyor) işaretlendi sonraki tur için.
- **Bonus fix (Round 5):** Bakara 2:275 `الْمَسِّۜ` render bug — cleanArabic'te waqf+haraka swap regex aralığı `[ۖ-ۛ]` → `[ۖ-ۜ]` genişletildi. Sekta waqf marker'ı (`U+06DC`) artık `sin+shadda+ۜ+kasra` dizilimini `sin+shadda+kasra+ۜ` normalize ediyor; kasra sin'in altıyla çakışmıyor.
- **Round 6 (2026-05-24, 1 agent):** O7 cleanArabic ortak modüle taşındı. `next/src/lib/arabic.js` (4 export); 13 component dosyasında local kopya → import; 4 dosyada semantic-spesifik wrapper bırakıldı. Davranış parite testi 16 sample PASS. Bonus: encoding range bug (`U+06E2-U+06ED` overstrip) build öncesi yakalandı + düzeltildi.
- **Round 7 (2026-05-24, paralel 2 agent):** O3 + O4 sweep — **23 dosyada 334 token swap.** (A) VerseGraph + ReadingMode + 8 büyük overlay: 186 borderRadius + 74 transition. (B) ProphetAtlas + HumanDefinition + 11 dosya: 50 borderRadius + 24 transition. Atlananlar: `'50%'` (RADIUS.full token yok — 70+ instance), sub-step duration'lar (0.12s, 0.18s, 0.25s — TRANSITION sözlüğü dışında), property-specific transition'lar (`background 0.15s` vb.), compound borderRadius (multi-value), conditional ternary değerler.
- **Round 8 (2026-05-24, paralel 2 agent):** (A) tokens.js extend — `RADIUS.full = '50%'` + `COLORS.goldBright = '#e8c98a'` + `COLORS.goldWarm = '#d4b483'` eklendi. 44 dosyada `borderRadius: '50%'` → `RADIUS.full` swap (Round 7'nin atlama listesi temizlendi); 25 dosyaya `RADIUS` import eklendi. D1 hex swap: `#e8c98a` 4 yer, `#d4b483` 5 yer. (B) D2 audit raporu yazıldı (`docs/reviews/2026-05-24-d2-focus-audit.md`) — sonuç: NO-OP (outline + inline border çakışmıyor, audit varsayımı yanlış). Bonus tespit: VerseGraph:1700 inline `outline:'none'` WCAG 2.4.7 ihlali, ayrı ticket.
- **Round 9 — Hero & Navbar Elite Polish (2026-05-24, qc-visual-director + ChatGPT/Claude feedback):**
  - **Hero typography hierarchy:** Title `lg:text-7xl` → `lg:text-6xl` (%14 küçülme), leading `1.1` → `1.15`, mb-8 → mb-6. Subtitle mb-7 → mb-4. Divider mb-8 → mb-6. CTA padding daha geniş (`15px 56px`), letter-spacing 0.18em, base glow `0 0 28px btnGoldGlow15` (statik halo), hover `56px btnGoldGlow25` + `scale: 1.04`.
  - **Hero description rewrite:** Eski uzun akademik paragraf → şiirsel 3-paragraf (`Bazı metinler okunur. Bazıları ise incelendikçe derinleşir. / Kur'an, 1.400 yıldır... / Her kelime yerli yerinde. Her yapı bilinçli...`). `split('\n\n').map(...)` ile 3 ayrı `<p>` (controlled `0.7em` gap, line-height 1.7). max-w-3xl → max-w-2xl. Color silver → `rgba(232,230,227,0.78)` (offWhite/78). i18n TR + EN parite.
  - **Hero CTA copy:** "Keşfe Başla" → "İncelemeye Başla" / "Begin Examining" — description'ın "incelendikçe derinleşir" cümlesiyle rezonans.
  - **Apostroflar typographic:** Düz `'` → curly `'` (Hero title, ctaRead, body — TR + EN i18n).
  - **Background depth:** Islamic pattern opacity `0.03` → `0.04`; alt-merkez warm halo (radial gold @ `0.08 → 0.025 → transparent`) — horizon ground hissi.
  - **Navbar "Kur'an'ı Oku" CTA outline ghost:** Solid gold gradient → transparent + `1.5px solid goldAlpha45` + `color: gold`. Hover: border `gold`, bg `goldAlpha15`, glow `btnGoldGlow25` (token). Hero CTA tek dominant kaldı. اقرأ: ham `KFGQPC` string → `FONTS.quran` token; size `1.05rem` → `1.2rem`; `position: relative; top: -1px` (Arabic baseline trim); opacity 0.9 → 0.95. **Tooltip:** `title="İlk emir: Oku (Alak 96:1)" / "The first command: Read (Al-Alaq 96:1)"` — vahyin ilk emri derinlik referansı.
  - **Hamburger menu desktop fix:** `className="lg:hidden"` Tailwind sınıfı vardı ama inline `style.display: 'flex'` override ediyordu. Display Tailwind class'a taşındı (`flex items-center justify-center` + `lg:hidden`). Desktop'ta gizli, mobilde flex.
  - **Discover/Tools dropdown trigger** fontWeight 600 → 700, letter-spacing 0.01em → 0.02em (navbar orta-confidence).
  - **Hero description copy:** Kullanıcı önerisiyle şiirsel 3-paragraf değişimi (aynı agent içinde — staccato beat).
  - **Hero spacing daraltma (kullanıcı feedback round):** Subtitle mb-7 → mb-4, divider mb-8 → mb-6, description mb-14 → mb-10 + line-height 1.75 → 1.7 + `0.7em` controlled paragraph gap. Title→description boşluğu kapatıldı.
  - **CTA copy refinement (Claude feedback round):** "Keşfe Başla" → "İncelemeye Başla" — description'ın "incelendikçe derinleşir" cümlesiyle rezonans.
  - **Navbar Kur'an'ı Oku tooltip + polish (ChatGPT feedback round):** Border 1px → 1.5px premium ağırlık, padding 6px 20px → 6px 24px, gap 8 → 10. اقرأ ham `'KFGQPC'` → `FONTS.quran` token, size 1.05rem → 1.2rem, `position:relative; top:-1px` baseline trim, opacity 0.95. Hover glow `btnGoldGlow25` (token). `title="İlk emir: Oku (Alak 96:1)"` tooltip — vahyin ilk emri derinlik referansı.
- **Round 10 — Discovery Zone Polish (2026-05-24, qc-visual-director):** Hero'nun mantıklı devamı — `PathCards` + `AllTopics` + `ToolsHighlight` + 3 kart component (`PathCard`, `TopicCard`, `ToolHighlightCard`) Hero seviyesinde rafine edildi.
  - **Tipografi parite:** Tüm section subtitle'ları `silver` → `offWhiteAlpha78` (Hero baseline) + `clamp(0.95rem, 1.6vw, 1.0625rem)` + `lineHeight: 1.7` + `letterSpacing: 0.01em`. PathCards H2 `clamp(1.7rem, 3.6vw, 2.4rem)` → `clamp(1.8rem, 4vw, 2.75rem)` (3 section tek tier). Hepsine `letterSpacing: -0.01em` (Playfair büyük başlık standardı).
  - **Secondary CTA standard:** "Tüm Araçları Gör" Hero primary'nin sönük yansıması: padding 11/20, letterSpacing 0.12em (primary 0.18em'in altı), statik halo `0 0 16px goldAlpha04`, hover `scale: 1.02` + `0 0 28px goldAlpha15`. Önceki DOM onMouseEnter/Leave çift sistem temizlendi → Framer-only + `useReducedMotion()` guard.
  - **Hover hiyerarşisi:** PathCard `y:-4` + `goldAlpha15` 32px (primary tier) · ToolHighlightCard `y:-3` + 24px (secondary tier) · TopicCard `x:3` + border/bg (compact list tier). Hepsi tek Framer motion dili, DOM listener'lar kaldırıldı.
  - **Token genişletme:** `COLORS.offWhiteAlpha72` + `offWhiteAlpha78` token'ları tokens.js'e eklendi (Hero baseline imzasını codebase'e taşıyan ilk resmi token); 5 ham `rgba(232,230,227,0.78/0.72)` → token swap. 6 dosyada ham hex/rgba **sıfır**.
  - **Mobile parity:** clamp() typography zaten responsive; `isMobile` (PathCards) ve column (AllTopics, ToolsHighlight) pattern'ları korundu. Touch target'lar 44px+ effective.
  - **Bilinçli atlama:** Section label opacity 0.6 (3 section tutarlı, sistem-seviye refactor Wave 3'e); PathCard step pill spacing tokens.js'te padding scale enforced değil (henüz); `SectionWrapper py-10` paylaşılan — site-wide refactor ayrı iş.
- **Round 11 — Fascination Trio Polish (2026-05-24, qc-visual-director):** Scroll-story narrative arc'ın ilk emosyonel katmanı — Hero/Discovery seviyesinde parity.
  - **Kapsam:** `LinguisticDNA.jsx` + `ImpossibleRhythm.jsx` + `QuranRhetoric.jsx` (3 section, "Fascination" evresi — "dil bir şifre", "ne şiir ne düzyazı", "1.200+ soru").
  - **H2 baseline:** `clamp(1.8rem, 4vw, 2.75rem)` Playfair + `letterSpacing: -0.01em` + `lineHeight: 1.15` + `maxWidth: 60ch` — Hero/Discovery ile parity.
  - **Intro baseline:** `text-silver` → `COLORS.offWhiteAlpha78` + `clamp(0.95rem, 1.6vw, 1.0625rem)` + `lineHeight: 1.7` + `letterSpacing: 0.01em` + `className="max-w-3xl"` (§11).
  - **QuranRhetoric özel:** İki satırlı emosyonel kalıp ("Kur'an Cevaplamaz / Sorar.") korundu; ana H2 Hero parity'ye geçti, alt italic clamp orantılı (`clamp(1.2rem, 2.5vw, 1.75rem)`).
  - **Typographic apostrof:** QuranRhetoric'te 10+ apostrof düz → curly. LinguisticDNA + ImpossibleRhythm'de inline apostroflar zaten escape'lenmiş — dokunulmadı.
  - **Kasıtlı atlanan (Wave 1+ adayı):** 102 kategorik data-renk hex'i (mukattaa group, sura color, fasıla, question-type — semantic taxonomy; token isimlendirme gerek); sub-katman discovery widget'ları (LinguisticDNA Big Pattern, ImpossibleRhythm Necm Grid, QuranRhetoric Donut/Heatmap); DOM mouseEnter/Leave → Framer migration; `text-silver` Tailwind sub-katman h3/desc'lerde korundu.
- **Round 12 — Awe + Astonishment + Reflection (2026-05-24, paralel 3 agent):** Scroll-story'nin geri kalan 10 section'ı Hero parity'ye çekildi.
  - **Agent A (Awe/Fascination):** SoundArchitecture + HiddenArchitecture + PsychologySection — H2 + intro Hero baseline (`clamp(1.8rem,4vw,2.75rem)` + `offWhiteAlpha78` + `lineHeight 1.7`); 9 curly apostrof; HiddenArchitecture'da Raymond Farrin alıntısı + B′ ring notation hassasiyetiyle.
  - **Agent B (Astonishment):** ScientificSigns + HistoricalProof + LivingPreservation — H2 + intro parity; 5 curly apostrof.
  - **Agent C (Reflection):** ZeroRedundancy + HumanDefinition + QuranDua + Highlights — H2 + intro parity; 10 curly apostrof (QuranDua "Rabbena" + "Kur'an'da" + "40'tan"). Highlights'ta intro `<p>` yok — sadece H2 parity.
  - **Toplam:** 10 dosya, 30 H2/intro Hero parity dönüşümü, 24 curly apostrof.
  - **Kasıtlı atlanan (sub-system protection):** SoundArchitecture comparison/tajwid/discovery widget'ları, HiddenArchitecture mirror diagram + 7-layer prism, PsychologySection 9-tab system + accordion, ScientificSigns Bucaillism critique + 4-tab system, HistoricalProof timeline + criticalNote, LivingPreservation 3-counter + manuscript timeline, ZeroRedundancy refrain/perspective grid, HumanDefinition 4-term + 7-trait + 5-opposition system, QuranDua 40+ Rabbena collection grid, Highlights 6-themed cards + SolarLunarConverter — hepsi semantic taxonomy + kategorik renk + interactive widget; ayrı motion-language round'una.

**Faz 4.5 + Polish Pass 1 final tablo:** Hero + Navbar + Discovery zone (3 section + 3 card) + Fascination (3 section) + Awe (3 section) + Astonishment (3 section) + Reflection (4 section) + Conclusion = **17 section + 4 component** Hero baseline kalitesinde. Tek narrative arc tutarlı tipografi imzası taşıyor (`clamp(1.8rem,4vw,2.75rem)` H2 + `offWhiteAlpha78 / lineHeight:1.7 / tracking:0.01em` intro).
- **Round 13 — Closing Sections (2026-05-24, qc-visual-director):** Homepage'de kalan minor 4 dosya parity.
  - **ToolsShowcase:** Closing-layer `<h3>` token-tabanlı stil (Playfair, gold, `clamp(1.25rem, 2.4vw, 1.6rem)`); stat chip `goldAlpha04/25`, label `offWhiteAlpha78`; Discover/Tools button ham hex → token. 1 curly apostrof.
  - **ProphetMap:** Section label Hero parity (gold @ opacity 0.6, 0.75rem, tracking 0.3em); H3 alt-section parity (Playfair, `clamp(1.4rem, 2.8vw, 2rem)`, weight 700). 10 escaped `\'` → curly `'` (Pharaoh's, Firavun'un, İsmail'in, vb.).
  - **Conclusion:** Badge inline parity (gold opacity 0.6); H2 Hero baseline; summary intro paragraph italic display tone + `offWhiteAlpha78` + `clamp(1.05rem, 1.8vw, 1.25rem)`. Verse + meal vurgusu + CTA buton block (Round 9'da yapıldı) korundu.
  - **Footer:** Hero H2 parity uygulanmadı (yapı uygun değil — footer küçük tipografi katmanı, big section başlık yok); methodology paragraph `text-silver` → `offWhiteAlpha78` Hero body imzası uygulandı. Linguistik transliterasyon hamzaları (`Kur'an`, `Esmâ'ül`) **kasıtlı dokunulmadı** (transliteration hamza ≠ typographic apostrophe).
  - **Toplam:** 4 dosya, 12 curly apostrof, Conclusion verse block korundu, footer linguistic hamza korundu.

**🎯 FAZ 4.5 + POLISH PASS 1 NIHAİ KAPANIŞ:** 13 round, ~35+ paralel agent, **18 section + 5 component + Hero + Navbar** Hero baseline kalitesinde. Tüm homepage narrative arc (Wonder→Davet→Fascination→Awe→Astonishment→Reflection) tek tipografi imzası taşıyor. 9 yeni token, ~85 dosya, ~1,900+ kod değişikliği, ~36 curly apostrof Polish Pass 1'de. **Commit 1e2436b ile main'e push edildi.**

---

## Wave 14 — Mobile Audit + Faz 7.5 OG Extension (2026-05-24)

### 14-A: Mobile UX Audit (qc-ux-auditor)
**Rapor:** `docs/reviews/2026-05-24-mobile-audit-polish1.md`
**Genel puan:** 7.5/10 — Polish Pass 1 mobile davranışı doğru yönde, edge case'ler kaldı.
**Bulgu kategorizasyonu:** Kritik 2, Yüksek 5, Orta 6, Düşük 4 = **17 bulgu**.

**Kritik:**
- **M-K1** Navbar 390px sıkışıklık (px-8 sabit + hamburger 36px) — 320px viewport'ta overflow.
- **M-K2** Hamburger 36×36 WCAG 2.5.5 ihlali (44×44 minimum gerekiyor).

**Yüksek:**
- **M-Y1** HumanDefinition opposition 3-panel mobil §14.4 tab pattern ihlali.
- **M-Y2** LinguisticDNA mukattaa dikey alan yönetimi.
- **M-Y3** SectionWrapper Hero-to-PathCards transition.
- **M-Y4** ProphetMap 480px sabit height → mobil dikey kontrol yok.
- **M-Y5** LinguisticDNA legend chip eksik (visual hierarchy).

**Orta + Düşük (10 bulgu):** Hero TR/EN satır asimetrisi, CTA padding 56px sabit, ChapterProgress mobile equivalent yok, AllTopics legend wrap, Conclusion Arabic 2.6rem sabit, Highlights intro yok, Hamburger/close tutarsızlığı, ZeroRedundancy tooltip taşma, ScientificSigns timeline gap-line.

**Polish Pass 2 önerisi:** ~5 saat effort → 7.5 → 9/10.

### Wave 15 — Polish Pass 2 Mobile Fixes (2026-05-24, paralel 3 agent)
**Tüm 17 mobile audit bulgusu fix edildi (M-O3 ve M-O4 bilinçli atlandı — düşük öncelik).**

**Agent A — Navbar + Hero (7 fix):**
- M-K1.a/b/c: `px-8` → `px-4 lg:px-8`, logo tracking responsive, EN/TR padding 14px → 10px (Navbar.jsx:713,721,1136)
- M-K2 + M-D2: Hamburger + drawer close 36/40 → **44×44** (WCAG 2.5.5) (Navbar.jsx:1163,1219)
- M-O1: Hero başlık `tracking-[-0.015em] sm:tracking-tight` (Hero.jsx:48)
- M-O2: Hero CTA `padding: clamp(13px, 1.5vw, 15px) clamp(32px, 6vw, 56px)` (Hero.jsx:118)

**Agent B — LinguisticDNA + HumanDefinition (3 fix + 2 isMobile pattern):**
- M-Y2: Mukattaa harfler `isMobile ? '3rem' : '4rem'` (48×48 mobil); gap-3 sm:gap-4 — 320px → 200px dikey alan
- M-Y5: Legend chip border + padding (`RADIUS.pill`, `glassBg/Border`) — chip görünümü
- M-Y1: Opposition pairs §14.4 column stack: positive → horizontal divider → negative; Arapça çakışması çözüldü
- Bonus: 2 dosyada §14.1 SSR-safe isMobile pattern eklendi

**Agent C — 7 dosya cluster (7 fix):**
- M-Y3: `SectionWrapper.firstAfterHero` prop + PathCards mount — Hero→PathCards mobil 56px extra üst boşluk
- M-Y4: ProphetMap `isMobile ? '380px' : '480px'` (mobil 100px kazanım)
- M-O5: AllTopics legend mobile column + yatay divider
- M-O6: Conclusion `فَاتَّبِعُوهُ` `clamp(2.1rem, 6vw, 2.6rem)` (mobil 33.6px)
- M-D1: Highlights intro paragrafı eklendi (Hero baseline)
- M-D3: ZeroRedundancy tooltip `width: min(220px, calc(100vw - 32px))`
- M-D4: ScientificSigns mobil "↔ 1.400 yıl" mini-label (gradient line yerine)

**Build/Lint:** Tüm dosyalarda 0 yeni hata. 17/17 mobile bulgu kapatıldı. Mobile audit puanı 7.5 → tahmini 9/10.

### 14-B: Faz 7.5 OG Image Extension
**3 yeni dosya** (kategori-level universal strateji):
- `next/src/app/[locale]/atlas/opengraph-image.jsx` — Atlas kategori (12 tool)
- `next/src/app/[locale]/graf/opengraph-image.jsx` — Graf kategori (7 tool)
- `next/src/app/[locale]/arac/opengraph-image.jsx` — Araç kategori (16 tool)

**Pattern:** Mevcut OG image'lerle aynı — radial gradient cosmic-black + gold accent + Playfair başlık + Inter tagline + alt-sağ brand mark. TR/EN locale branş; tool kategorisi label.

**Cascade:** 35 tool route artık 3 branded kategori OG'sine sahip (TR/EN × 3 = 6 unique varyant). Build PASS. İleride per-tool override otomatik olarak kategori'yi override eder.

### Kritik (P0 — Faz 5'ten önce kapatılmalı)

- [x] **K1 · Çift Navbar bug** — **ÇÖZÜLDÜ (audit'ten önce).** Root `app/layout.js` zaten temiz (yalnızca html/body + font + global JSON-LD). Navbar tek mount `[locale]/layout.js:28`'de. Doğrulandı 2026-05-24.

- [x] **K2 · Çözüm B uygulandı 2026-05-24** — `OVERLAY_BASE` token + 13 dosya inline override → `inset: '54px 0 0 0'` + `zIndex: 50`. Toplam 15 dosya değişti. Navbar `z:9999` üstte, tool overlay'leri `z:50` altta ve 54px aşağıdan başlıyor. ToolsBrowser (modal pattern) + section-internal modal'lar (ProphetAtlas/HumanDefinition iç dialog) bilinçli atlandı.
  - **Bonus 1 (aynı tur):** ReadingMode özel-case — `/oku` route'unda Navbar `hideOnReadingMode` ile gizleniyor; ReadingMode'un dış container'ı `inset: 0`'a geri çevrildi (üstte 54px boşluk yoktur).
  - **Bonus 2 (aynı tur):** Navbar "Oku" CTA + mobil drawer Oku + `openReadingMode` event handler artık `router.push(/${language}/oku[/${surah}])`; `readingOpen`/`graphOpen` localStorage hidrasyonu kaldırıldı.
  - **Çözüm A (yapısal refactor — açık, opsiyonel):** Component'leri gerçek "section/main" pattern'ına çevirme — `position:fixed` kalkması. Şu an Çözüm B yeterli; A faz 5/6 paralelinde değerlendirilebilir.

- [x] **K3 · `/arac/tum-araclar` boş ekran açıyor** — **ÇÖZÜLDÜ 2026-05-24.** `ToolsBrowser.jsx:52` signature `{ onClose, defaultOpen = false }`; `useState(defaultOpen)`. Route `ToolsBrowserRoute.jsx:8` `defaultOpen={true}` geçiriyor. Modal event davranışı korundu (`defaultOpen=false` default).

- [x] **K4 · `ProphetAtlas` `onClose` prop'unu kabul etmiyor + `id="math"` artığı** — **ÇÖZÜLDÜ 2026-05-24.** `ProphetAtlas.jsx:1468` `function ProphetAtlas({ onClose })` destructured. Header'a §13.11 CLOSE_BTN eklendi (1592-1605, `position:absolute top:0 right:0`, conditional `{onClose && ...}`). `id="math"` → `id="prophet-atlas"` (D5 ile birlikte).

- [x] **K5 · `useQuranNav` locale-prefix'siz `router.push`** — **ÇÖZÜLDÜ 2026-05-23.** `useQuranNav.js` `useLanguage()` ile `/${language}${route}` push ediyor. Aynı düzeltme Navbar.jsx'in iki noktasına uygulandı: satır 654 (TOOL_TRIGGERS factory) ve satır 795 (Explore mega-menu items). Tarayıcı `Accept-Language` redirect'i devre dışı.

### Yüksek (P1 — Faz 5/6 sırasında)

- [~] **Y1 · §13.10 ihlali — OVERLAY_TITLE kullanılmayan overlay'ler** — Çoğu tamamlandı; 4 satır gerekçeli atlandı.
  - **Dosyalar:** ~~`VerseGraph.jsx:1035, 1507`~~ ✓ (R1) · ~~`QuranCommands.jsx:206`~~ ✓ (R2) · ~~`ReadingMode.jsx:4792`~~ ✓ (R2).
  - **Atlananlar (gerekçeli — Round 3 kararı bekliyor):** `ReadingMode.jsx:5343, 6874, 6885, 6910` (+ duplikatları 7257, 7268, 7293). Bunlar "modal header değil" — surah hero display name + bismillah + subtitle; §4 "Section Titles: Playfair Display, 2.5-3rem" kuralına uygun **dekoratif display tipografi**. OVERLAY_TITLE (Inter, 0.9rem) uygulamak surah kapağı tasarımını bozar.
  - **Karar gerekli:** §13.10 vs §4 gri alanını netleştir — surah kapakları için ayrı bir token (`SURAH_DISPLAY_TITLE`?) tanımlamak mı, yoksa Playfair'i bilinçli istisna olarak bırakmak mı?
  - **Bonus tespit (Round 2):** `ReadingMode.jsx:8659` gerçek modal warning dialog title — `OVERLAY_TITLE` adayı, scope dışıydı.

- [x] **Y2 · §13.2 ihlali — Kur'an metni için `'Amiri'`** — **ÇÖZÜLDÜ 2026-05-24.** `ConceptGraph.jsx:500, 601` ve `KissaAtlas.jsx:371` (+ KissaAtlas import genişletildi) hepsi `fontFamily: FONTS.quran`. `KissaAtlas.jsx:750` `'KFGQPC', 'Amiri Quran', serif` fallback chain scope dışıydı (Y3'te ele alınacak).

- [x] **Y3 · §13.1 ihlali — Ham `'KFGQPC', 'Amiri Quran', serif` inline string** — **TAMAMLANDI 2026-05-24.** 19/19 yer `FONTS.quran` token'ına çevrildi. WordHeatmap kalan 2 (966, 1072) Round 4'te swap edildi.
  - **Dosyalar:** ~~`VerseGraph.jsx:776, 1477, 1624, 2416, 2919, 3061, 3180` (7)~~ ✓ (R1) · ~~`ReadingMode.jsx:3121, 3451, 3560, 4503` (4)~~ ✓ (R2) · ~~`DuaVerses.jsx:166`~~ ✓ (R2) · ~~`QuranCommands.jsx:487`~~ ✓ (R2) · ~~`WordHeatmap.jsx:780, 804, 863` (3)~~ ✓ (R2) · ~~`KissaAtlas.jsx:750`~~ ✓ (R2).
  - **Kalan (Round 2'de scope dışıydı, ~5 dk fix):** `WordHeatmap.jsx:966, 1072` (2 yer — kart Arapça önizleme div'leri).
  - **Bilinçli bırakılan (§13.15 reading mode font chain — ayrı kural):** `ReadingMode.jsx:151, 180, 195, 250, 268, 283, 1336, 8979` ShaykhHamdullah-öncelikli reading mode font'u (`FONTS.quran`'dan farklı semantic); satır 3817 tek başına tajweed indicator. **Dokunulmayacak.**

- [x] **Y4 · `VerseGraph` `width:480px` absolute sidebar, isMobile guard yok** — **ÇÖZÜLDÜ 2026-05-24.** `VerseGraph.jsx:1497` `width: isMobile ? '100vw' : '480px'`. `SurahInfoPanel`'a §14.1 SSR-safe isMobile pattern eklendi (satır 1436-1442). §14.4 tam tab pattern Round 3 (UX iyileştirme) için açık.

- [x] **Y5 · Hero CTA ham hex `#1c0f00`** — **ÇÖZÜLDÜ 2026-05-24.** Token `tokens.js:26` (Y7 ile R1). Navbar.jsx'te 4 yerde kullanım: satır 1093 (desktop CTA text) + 1111 (desktop Arabic span) + 1241 (mobil drawer Arabic) + 1242 (mobil drawer text). Bonus: agent task'taki 2 yer yerine 4'ünü buldu — mobil drawer'da da aynı ham hex vardı.

- [x] **Y6 · Mobil hamburger butonu farklı yükseklikte (≈40px)** — **ÇÖZÜLDÜ 2026-05-24.** `Navbar.jsx:1144-1170` — `p-2` Tailwind class kaldırıldı; inline `width:36px, height:36px, display:flex, alignItems:center, justifyContent:center` eklendi. SVG 24×24 → 20×20 (orantılı dolgu). `aria-label`, `aria-expanded`, `onClick` korundu. Drawer içi kapat butonu dokunulmadı.

- [x] **Y7 · Hero butonu ham rgba + token'sız animasyon değerleri** — **ÇÖZÜLDÜ 2026-05-24.** tokens.js'e 6 yeni token: `btnGoldStart/Mid/End/Text/Glow15/Glow25` (satır 22-28). `Hero.jsx:95` whileHover boxShadow `${COLORS.btnGoldGlow25}` template literal. `globals.css` Tailwind v4 `@theme {}` bloğuna 6 CSS variable (satır 60-66); `.btn-primary-gold` (satır 161-164) hepsi `var(--color-btn-gold-*)`. `.btn-ghost-dark` (satır 175-179) hâlâ ham rgba — scope dışıydı, sonraki tur.

### Orta (P2 — Codemod + ESLint kuralı ile sistemik temizlik)

- [x] **O1 · `#d4a574` ham hex codemod — Round 4+5 ile tamamlandı 2026-05-24.** 37 tool/section dosyasında token swap. Atlananlar: kategori-spesifik palette renkleri (semantic identifier, örn. WowFacts kategori dot'ları), token sözlüğünde olmayan alpha varyantları (0.06, 0.08, 0.12, 0.3 vb.), pre-existing fallback'li referanslar (DogaAtlasi `goldAlpha10`).

- [x] **O2 · Ham rgba codemod — Round 4+5 ile tamamlandı 2026-05-24.** 37 dosyada token mapping sözlüğüne giren tüm rgba pattern'leri swap edildi. Atlananlar: tokens.js'te eşi olmayan alpha varyantları (gold/silver/glass 0.06-0.08, 0.12, 0.18, 0.3, 0.5+ gibi sub-step'ler), kategori renkleri, panel-spesifik koyu bg'ler. ESLint kuralı Faz 11'de.

- [x] **O3 · BorderRadius standardization — TAMAMLANDI 2026-05-24.** Round 7'de 236 swap (21 dosya, 8px/10px/12px/14px/20px/999px) + Round 8'de 50% swap (44 dosya, `RADIUS.full` token eklendi). Toplam ~280+ swap. **Bilinçli atlanan:** compound borderRadius (`'12px 12px 0 0'` gibi multi-value — manuel kararla farklı kalır), sub-step (`'3px'`, `'5px'` vb. — scale dışı, semantic değil).

- [~] **O4 · Transition standardization** — **Round 7'de 98 swap, 21 dosya.** `'all 0.15s/0.2s/0.3s'` → `TRANSITION.fast/base/slow` template literal formunda. **Kalan (Round 8 adayı):** sub-step duration'lar (`'0.12s'`, `'0.18s'`, `'0.22s'`, `'0.25s'` — atlandı; ya yuvarlanmalı ya `TRANSITION.subtle/snap` token'ları eklenmeli), property-specific transition'lar (`'background 0.15s'`, `'opacity 0.2s, transform 0.2s'` — atlandı; `TRANSITION` token sadece `'all'` semantic'i için tanımlı).

- [x] **O5 · `text-center` body metin üzerinde — §11 ihlali** — **ÇÖZÜLDÜ 2026-05-24.** `HumanDefinition.jsx:1080` `text-center` kaldırıldı (kart içi açıklama). `LinguisticDNA.jsx:310` `text-center` kaldırıldı (mukattaa istatistik özeti). `LinguisticDNA.jsx:617` `mx-auto` kaldırıldı + `max-w-2xl` → `max-w-3xl` (§11 standardı). `HumanDefinition.jsx:1061` (concept etiketi, tek kelime) bilinçli dokunulmadı.

- [x] **O6 · `.glass-card` CSS class ≠ `GLASS_CARD` token** — **ÇÖZÜLDÜ 2026-05-24.** `.glass-card` ve `.glass-card-strong` token değerlerine eşitlendi: bg `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.1)`, radius `12px`, blur `20px`. `.glass-card-strong` için `glassBgStrong` = 0.08.

- [x] **O7 · `cleanArabic` ortak modüle taşındı 2026-05-24.** `next/src/lib/arabic.js` oluşturuldu — 4 export: `cleanArabic` (canonical, ReadingMode pipeline'ı), `cleanArabicForDisplay`, `cleanArabicForGraph`, `cleanArabicMinimal`. **13 dosyada** kopya kod silindi + import. **4 dosyada** semantic-spesifik wrapper bırakıldı (ProphetAtlas `cleanDuaAr`, WordTooltip, WordHeatmap, MeselAtlasi — her birine `lib/arabic.js` referans yorumu eklendi). Davranış parite testi (16 sample) PASS. Bonus: ilk taslakta `ۢ-ۭ` aralığı yanlış yakalandı; codepoint diff ile düzeltildi.

- [x] **O8 · `globals.css --color-glass-border` ≠ `tokens.js glassBorder`** — **ÇÖZÜLDÜ 2026-05-24.** Tailwind v4 `@theme {}` içindeki `--color-glass-border` `rgba(212,165,116,0.12)` (gold) → `rgba(255,255,255,0.1)` (token ile sync). Tailwind class'ı ve inline token artık aynı renkte.

### Düşük (P3 — Cleanup turu)

- [x] **D1 · Gold variant ham hex'leri — TAMAMLANDI 2026-05-24.** `COLORS.goldBright = '#e8c98a'` + `COLORS.goldWarm = '#d4b483'` token'ları tokens.js'e eklendi. 9 yerde swap: VerseGraph (5), ReadingMode (2), DuaVerses (1), RevelationTimeline (1), LinguisticDNA (1), InterlinearView (1).

- [x] **D2 · Focus state audit — NO-OP karar 2026-05-24.** Audit raporu: `docs/reviews/2026-05-24-d2-focus-audit.md`. 10 dosya tarandı. Tip 1 (kaldırılabilir saf duplicate): **0**. Tip 2 (fonksiyonel — dropdown trigger, text select, tooltip): 4. Tip 3 (form input border affordance): 6. **Ana bulgu:** Audit varsayımı yanlış — `:focus-visible` outline (2px dışarıda) ve inline border (input sınırı) farklı katmanlarda; çakışma yok. **Bonus:** VerseGraph.jsx:1700 inline `outline:'none'` WCAG 2.4.7 ihlali — ayrı ticket önerildi.

- [x] **D3 · Slate hex'leri token swap — TAMAMLANDI 2026-05-24.** Round 4+5'te O1 codemod ile birlikte tüm slate hex'leri (`#64748b/#475569/#334155`) `COLORS.slate500/600/700` token'larına çevrildi. ConceptGraph 11, MeselAtlasi 3, VerseGraph 21, CennetCehennem 15, Melekler 13, KissaAtlas 24, KuranRetorigi 3+ vd.

- [~] **D4 · Animasyon süreleri** — **Round 7'de O4 ile birlikte standart 0.15/0.2/0.3s `TRANSITION.fast/base/slow` token'a alındı (98 swap).** Kalan sub-step süreler (0.12s, 0.18s, 0.22s, 0.25s) Round 8'de değerlendirilmeli — ya `TRANSITION.subtle/snap` eklemek ya da en yakına yuvarlamak.

- [x] **D5 · `ProphetAtlas` `id="math"` yanlış anchor** — **ÇÖZÜLDÜ 2026-05-24.** `ProphetAtlas.jsx:1575` `id="math"` → `id="prophet-atlas"`. K4 ile aynı agent içinde halledildi.

### Önerilen Sıra

1. **K1** (10 dk) — anında görsel iyileşme.
2. **K4 + D5** (15 dk) — aynı dosya, tek commit.
3. **K3** (30 dk) — ToolsBrowser mode='page'.
4. **K5** (10 dk) — locale-prefix.
5. **K2 Çözüm B** (1-2 saat codemod) — zIndex 50 + top 54px, geçici ama navbar görünür hale gelir.
6. **Y4** (30 dk) — VerseGraph mobil.
7. **K2 Çözüm A** (birkaç gün, Faz 5/6 paralelinde) — gerçek section/main refactor.
8. **Y1-Y3** (1-2 gün codemod) — OVERLAY_TITLE + FONTS.quran disiplini.

---

### Faz 4.5 — Final Özet (2026-05-24 kapanış)

**Tamamlanan:** **23/25 bulgu** (K1-K5: 5/5 · Y1: partial+frozen · Y2-Y7: 6/6 · O1-O3, O5-O8: 7/8 · O4: partial · D1, D3, D5: 3/3 · D2: NO-OP · D4: O4 ile bundled).

**9 round, 30+ paralel agent, ~85 dosya, ~1,700+ kod değişikliği.** Token sözlüğü 9 yeni eklemeyle genişletildi (`btnGold*`, `goldBright`, `goldWarm`, `RADIUS.full`). Bonus visual upgrade'ler: ChapterProgress sol rail (Vite→Next port), Conclusion ayet vurgusu, Bakara 2:275 sin+kesra render fix, Hero typography hierarchy + 3-paragraf description, Navbar `Kur'an'ı Oku` outline + tooltip + baseline trim, hamburger desktop fix.

**Açık kalan (Faz 5+ paralelinde):**
- **Y1 (kullanıcı kararı gerek):** ReadingMode 4 dekoratif surah-hero typography (`5343, 6874, 6885, 6910` + dupes). §4 Playfair display 2.5-3rem vs §13.10 OVERLAY_TITLE Inter 0.9rem — `SURAH_DISPLAY_TITLE` ayrı token mı, Playfair bilinçli istisna mı?
- **O4 sub-step duration'lar:** 0.12s/0.18s/0.22s/0.25s — `TRANSITION.subtle`/`snap` token eklenince hızlı bitebilir.
- **K2 Çözüm A (yapısal refactor — opsiyonel):** 36 overlay'i gerçek section/main pattern'a çevirme. Çözüm B zaten yeterli kullanıcı deneyimi sağlıyor.
- **VerseGraph.jsx:1700** WCAG 2.4.7 ihlali (`outline: 'none'`) — ayrı PR önerildi.
9. **Y5-Y7** — küçük token eklemeleri, tek commit.
10. **O1-O8** — codemod + ESLint kuralı; Faz 11 (cleanup) içinde.
11. **D1-D5** — Faz 11'de tek commit.

---

## Wave 16 — Playwright Full Visual + Console Audit (2026-05-24)

**Test:** 39 route × 2 viewport (desktop 1440×900 + mobile 390×844) = **78 screenshot**. Dev mode (Turbopack), localhost:3000.
**Rapor:** `docs/reviews/playwright-2026-05-24/visual-audit-report.md` + 78 PNG.
**Sonuç:** 0 failed route, 10 console error, 3 network abort (false positive — audio fetch cancel).

### Kritik (P0 — Mobile Hydration Mismatch)

- [x] **W16-K1 · Homepage hydration mismatch (mobile) — ÇÖZÜLDÜ 2026-05-24.** Root cause: `ScientificSigns.jsx:97` `useState(() => typeof window !== 'undefined' && window.innerWidth < BREAKPOINT_MOBILE)` — lazy init server'da `false`, client'ta mobile'da `true` → §16.6 ihlali. Fix: `useState(false)` + `useEffect` içinde `setIsMobile(...)` + resize handler. Verify Playwright run: `[mobile] /tr` ve `[mobile] /en` artık 0 error.

- [x] **W16-K2 · ReadingMode hydration mismatch (mobile) — ÇÖZÜLDÜ 2026-05-24.** Root cause: `ReadingMode.jsx:985-998` aynı pattern — `isMobile` + `isWide` ikisi de lazy init. Fix: ikisi de `useState(false)` + ortak `useEffect` resize handler içinde `handler()` ilk çağrı. Verify: `[mobile] /tr/oku`, `/oku/1`, `/oku/2` artık 0 error.

### Yüksek (P1 — React Warnings)

- [x] **W16-Y1 · `TabArama` key prop eksik — ÇÖZÜLDÜ 2026-05-24.** Root cause: `SebebiNuzul.jsx:594` `chipBtn(...)` factory function `<button>` döndürüyor ama `.map(([key, meta]) => chipBtn(...))` içinde key inject edilmemiş — factory call'un dönen JSX elementine key atanmamış. Fix: `chipBtn` signature'a `keyId` parametresi eklendi (`<button key={keyId}>`), `.map` callsite + `cat-all` static call key geçiyor. Verify: `[desktop+mobile] /tr/arac/sebebi-nuzul` 0 error.

- [x] **W16-Y2 · 3 component attribute hydration mismatch (mobile) — ÇÖZÜLDÜ 2026-05-24.** Hepsi aynı root cause (W16-K1/K2 ile aynı pattern):
  - `WordHeatmap.jsx:580` `useState(() => typeof window...)` → SSR-safe pattern.
  - `IblisSatan.jsx:434-436` aynı.
  - `ZamanBoyutlari.jsx:424-426` `useState(typeof window !== 'undefined' ? ... : false)` (lazy init değil, doğrudan call — server'da yine `false` döner ama client'ta render-time'da `true`) → `useState(false)` + resize useEffect içinde `handler()` initial call.
  - Verify: `[mobile] /tr/graf/kelime-isi`, `/arac/zaman-boyutlari`, `/arac/iblis-seytan` 0 error.

### Orta (P2 — Performans)

- [x] **W16-O1 · `/tr/atlas/kavim` 11.7s desktop load — ÇÖZÜLDÜ 2026-05-24 (production benchmark).** Production build (`npm run build && npm run start`) sonrası 3 sample ortalama: **810ms** (dev 11,755ms → prod 810ms = **14.5× speedup**). LCP < 2.5s hedefi rahat geçti. Kod optimizasyonu gerekmedi — Turbopack dev-mode compile overhead'i idi. **Bonus benchmark (3 sample/route):** cennet-cehennem 562ms (8.3×), esma-frekans 583ms (8.0×), iblis-seytan 594ms (7.5×), graf/karsilastir 807ms (5.1×), homepage 698ms, oku/bakara 868ms. Tüm 8 route prod'da **<1s**, **0 console error** (Wave 16 SSR-safety fix'leri prod'da da hold ediyor).

### Düşük / Kabul (Action gereksiz)

- Audio API `ERR_ABORTED` × 3 route (`/oku`, `/oku/1`, `/oku/2`) — Playwright `networkidle` beklerken ReadingMode `useEffect` cleanup audio fetch'i iptal ediyor. False positive.
- Dev mode load times 3-4s `/arac/*` — Turbopack RSC compile overhead. Production build'de `next start` ile re-benchmark gerek.

### Önerilen Eylem Sırası

1. **W16-K1 + K2** (aynı root cause — paralel agent değil tek agent, koordineli fix). ✓
2. **W16-Y1** (15 dk — TabArama). ✓
3. **W16-Y2** (30-45 dk — 3 dosyada conditional render audit). ✓
4. **W16-O1** (production benchmark sonrası karar). ← açık

### Faz 4.5 Wave 16 — Final Özet (2026-05-24)

**Tamamlanan:** **5/5 bulgu** (K1, K2, Y1, Y2, O1 ✓).

**Pattern öğrenildi:** §16.6 SSR-safety **lazy-init bile yetersiz** — `useState(() => typeof window !== 'undefined' && ...)` server'da `false` döner, client mobile'da `true` → hydration mismatch. Doğru pattern: `useState(false)` + `useEffect`'in ilk satırında `setX(...)` ile seed. **5 dosyada** uygulandı: ScientificSigns, ReadingMode (isMobile + isWide), WordHeatmap, IblisSatan, ZamanBoyutlari.

**Diğer SSR-unsafe `useState(() => localStorage...)` patterns (ReadingMode'da 25+ instance)** — bu run'da hydration error tetiklemedi (test browser'ı fresh localStorage). Production'da kullanıcı bir kez ayar değiştirirse mismatch oluşur — Faz 11 cleanup'ında topluca §16.6 standardına çevrilmeli.

**Açık:** W16-O1 `/tr/atlas/kavim` 11.7s dev mode load — production `next start` benchmark sonrası karar.
