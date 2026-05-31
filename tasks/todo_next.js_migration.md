# QuranCodex Next.js Migration — Yol Haritası

> **Branch:** `migration-to-next.js`
> **İlerleme (2026-05-24):**
> - **Pre-deploy core migration:** ~%95 ✓ (Faz 0-9 done, deploy edilebilir)
> - **Toplam aksiyon item'ı:** 26 done / 79 open = **%25** (Faz 12 post-cutover content writing dahil)
> - **Cutover-blocker olmayan kalanlar:** Wave 20-24 polish + Faz 12 content & growth (90-day roadmap)
> - **Production build PASS**, 8 hot route benchmark <1s avg (0 console error).
> **Tamamlanan faz ve wave detayları için:** git log + `docs/reviews/` + CLAUDE.md §16 Next.js patterns.

---

## Tamamlanan

- [x] Faz 0, 0.5, 1, 2, 3
- [x] Faz 4 (4.1-4.5)
- [x] Wave 14-17
- [x] Faz 5, 6
- [x] Faz 7 core
- [x] Faz 8.1, 8.2, 8.4
- [x] Faz 9.2, 9.4
- [x] Faz 11.2

---

## Mimari Kararlar (sabit referans — 2026-05-21 kullanıcı onayı)

- **Router:** App Router (Next.js 16)
- **Dil:** JavaScript (TypeScript YOK)
- **i18n:** URL prefix routing — `/tr/...` ve `/en/...`
- **Tool migration:** Tool overlay'ler full-page route (SEO için)
- **Deploy:** Vercel (Next.js native + Edge functions + OG image)
- **Cutover:** Kademeli — Vite SPA `legacy.qurancodex.com`'a, Next `www.qurancodex.com`'a

---

## Yapılacaklar — Pre-Cutover (P0)

### Faz 7.5 Açık
- [x] **Per-prophet OG image** — `docs/reviews/2026-05-26-per-prophet-og-image-audit.md`. **IMPLEMENTED**. Yeni: `next/src/app/[locale]/atlas/peygamber/[id]/{page.js, ProphetDetailRoute.jsx, opengraph-image.jsx}`. 4 peygamber × 2 locale = 8 statik HTML pre-rendered. OG image Edge runtime + 24h CDN cache (audit pattern). Bilingual metadata + JsonLd (Breadcrumb + LearningResource) + sr-only H1. ProphetAtlas `initialProphetId` prop'u henüz desteklemiyor (page.js metadata SEO için yeterli, deep-link enhancement sonraki tur).
- [ ] **Twitter Card / FB Sharing / LinkedIn Inspector test** — POST-DEPLOY (gerçek public URL gerekli)

### Faz 7.13 / 8.3 / 8.4 Açık (post-deploy)
- [ ] **Bundle size analizleri** — `@next/bundle-analyzer` kur (yeni dep, kullanıcı onayı bekliyor)
- [ ] **Framer Motion lazy load** — bundle analyzer çıktısına göre karar
- [~] **KFGQPC font subset** — `scripts/subset_kfgqpc.py` + `docs/reviews/2026-05-25-kfgqpc-subset-analysis.md`. Subset artifacts: 240.7 KB → 66.0 KB (%72.6 reduction). 79 unique Arabic codepoint + 21-char safety net. **Production switch YAPILMADI** — globals.css `@font-face` + layout.js preload migration ayrı tur; Fatiha visual-parity check gerekli.
- [ ] **LCP/CLS/INP gerçek ölçümler** — PageSpeed Insights + CrUX Dashboard

### Faz 9.1 / 9.3 / 9.4 Açık
- [ ] **Manual UI test execution** — `docs/test-plans/manual-ui-checklist.md` (70-90 dk). Kullanıcı task'i, deploy öncesi
- [ ] **Lighthouse Performance + Vite vs Next bundle karşılaştırma** — POST-DEPLOY
- [ ] **qc-visual-auditor pre-cutover pass** — opsiyonel ek tur

### Wave 18 — Mobile Reading Mode UX (K-3)
- [ ] **W18-K3 · Mobile meal default-visible** — UX karar gerekli:
  - Seçenek A: Bottom sheet (modern app pattern — Quran.com, MuslimPro)
  - Seçenek B: Üst toggle button (`Meal Göster`)
  - Seçenek C: Default split-screen 50/50
  - **Karar bekliyor — kullanıcı input**
  - Dosya: `next/src/components/ReadingMode.jsx` mobile branch

### Wave 19 — Acikkuran API Prefetch (K-5)
- [x] **W19-K5 · Build-time meal prefetch script** — `scripts/prefetch-meals.mjs` yazıldı (262 satır). 6 author × 114 sure = 684 fetch, sıralı + 200ms throttle, ~3 dk. Atomic write + idempotent (skip existing). Sample test PASS (3 fetch). Tahmini output ~50-80MB. Runtime proxy fallback wiring + `package.json` script ekleme sonraki turda.

---

## Faz 10 — Deploy & Cutover

**Detaylı plan:** `docs/migration-cutover/deploy-checklist.md` (444 satır, 10 bölüm + komut referansı)

- [ ] **10.1 Vercel deployment** — Pre-deploy → Vercel setup → Preview validation → Production deploy
- [ ] **10.2 DNS strategy** — TTL düşür → cutover → Vite `legacy.qurancodex.com`'a
- [ ] **10.3 Redirects** — `next.config.js` redirects() (Vite tool'ları state-driven; public URL minimal: `?verse`, `?lang`, `?mihver`)
- [ ] **10.4 Search Console** — GSC + Bing Webmaster sitemap submit, URL inspection sample
- [ ] **10.5 Monitoring** — Vercel Analytics + Sentry (opsiyonel) + UptimeRobot + CrUX rolling

**E2E süre:** ~10-12 saat (T-7 → T+0)

---

## Faz 11 — Post-Migration Cleanup

**Detaylı plan:** `docs/migration-cutover/vite-legacy-archive.md` (389 satır, 8 bölüm + cheat sheet)

- [ ] **11.1 Vite legacy archive** — POST-CUTOVER T+30 stabilite sonrası
  - Strateji: Seçenek B (tag + delete) — `v1.0-vite-final` tag + offline bundle backup
  - 4 fazlı delete: source → deps → CI → README
  - Kritik bulgu: Root `public/` (56MB) silinebilir — Next kendi `next/public/`'inden okuyor
- [ ] **11.2 Dokümantasyon — yeni overlay/tool ekleme guide** — DEFERRED (her tool tipine özel checklist)
- [ ] **11.3 `tasks/lessons.md`** — POST-CUTOVER (deploy + gerçek prod traffic sonrası)

---

## Wave 20 — Önemli UX Polish (Ö findings)

Kaynak: `tasks/todo_enhancement.md` II. Önemli

- [x] **W20-Ö1 · Footer "Sayfaları Keşfet" hierarchy** — inline `glassBgFaint` (0.025) + `glassBorderSoft` (0.06) + `RADIUS.md` + `16px 20px` padding (Sources block'tan hafif). İki tier net ayrıldı.
- [x] **W20-Ö3 · Reading mode mobile header §14.5 pattern** — Mobile Row 1 (title gold + close 36×36 red hover) + Row 2 scrollable chips (search, day/night, TR/EN, settings). §14.6 padding `10px 16px`. Desktop `display: contents` ile struct değişmedi (sıfır regression).
- [x] **W20-Ö4 · Section gradient seam (200px overlap)** — `.section-seam-into-deep` + `.section-seam-into-black` global utility class (globals.css). 200px desktop / 100px mobile, `::before` pseudo, pointer-events none. 8 yüksek-kontrast section'a uygulandı (AllTopics, ImpossibleRhythm, QuranRhetoric, QuranDua, HiddenArchitecture, HistoricalProof, LivingPreservation, Highlights).
- [x] **W20-Ö5 · Global LoadingOverlay component** — `LoadingOverlay.jsx` token-only renkler, role=status + aria-live. **7 tool entegre**: DogaAtlasi, KiraatAtlasi, MeselAtlasi, SemanticMap, ConceptGraph (2 farklı loading mesajı: data + graph build), KissaAtlas, WordHeatmap. Inline expansion loader'lar (row-level) korundu.
- [x] **W20-Ö6 · SurahPagination visible navigation** — `srOnly` prop eklendi (default `true` backward compat). `srOnly={false}` ile visible grid (2 col → mobile stack), arrow + sure adı + (Sure N), hover gold transition, edge cases (Fatiha/Nas). page.js wiring sonraki turda.
- [x] **W20-Ö7 · ScientificSigns "Devamını oku" default expanded** — `expandedTabs` initial state `{ iron: true, universe: true, ocean: true, embryo: true }`. Toggle korundu (kullanıcı isterse collapse edebilir). Build PASS.
- [x] **W20-Ö8 · KissaAtlas sahne sayısı tutarsızlığı** — audit yanlış yorumlamış: ekrandaki "3" sahne sayısı değil `surahCount`'tu (Musa 32 sure'de geçer). Mevcut sahneler zaten zengin (12-18). Yine de +13 sahne eklendi: Yusuf 12→18, İbrahim 14→18, İsa 11→14.
- [x] **W20-Ö9 · `/kaynakca` route** — 7 kategori 47 kaynak (Tefsir Klasik 7 + Modern 6 + Akademik 11 + Belağat 5 + Hadis/Siyer 6 + Bilim tartışmalı 3 + Yazılım/Veri 7). page.js + KaynakcaRoute.jsx (668L) bilingual. Footer link ekleme sonraki turda.
- [x] **W20-Ö10 · ToolsBrowser search empty state** — search input + 6 popüler chip (TR: dua, esma, kıssa, peygamber, ayet, mucize / EN: prayer, names of god, story, prophet, verse, miracle). Locale-reactive, `!query` koşulu ile chip'ler boş arama'da görünür.

---

## Wave 21 — Visual Polish Backlog

Kaynak: enhancement III. Polish. Batched sprint.

- [x] **W21-P1** Hero CTA padding clamp 32-56 → 44-68 (+12px), hover 200ms ease inline (Tailwind `duration-300` kaldırıldı, çakışma engellendi)
- [x] **W21-P2** Karaoke highlight 6 render bloğunda 120ms linear → 150ms ease-in-out (Material standard). ReadingMode.jsx L6385/6482/7317/7366/7529/7578. Renk/stil değişmedi (memory'deki "gold bg + cream + glow" baseline korundu), sadece timing/easing.
- [x] **W21-P3** Page turn glyph subtle parallax — ReadingMode book mode arrowBtn (2 glyph: left/right). `<span data-rm-page-glyph>` wrapper + `transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)`. Hover'da 4px page-turn yönünde slide. Mobile excluded.
- [x] **W21-P4** Tool card hover lift — ToolsBrowser `BigToolCard` `translateY(-2px)` + `COLORS.shadowCardHover` (yeni token: 0 8px 24px rgba(0,0,0,0.25)) + explicit transition prop list (transform + box-shadow + background + border-color)
- [x] **W21-P5** Footer link hover gold/30 underline — `hover:underline hover:decoration-gold/30 hover:underline-offset-[3px]` hem internal nav hem Sources link'lerine
- [x] **W21-P6** Hamburger drawer 250ms easeInOut → 200ms cubic-bezier [0.4, 0, 0.2, 1] (Material Design standard easing) via framer-motion
- [x] **W21-P7** Particle count `100 → isMobile ? 15 : 40` via ParticleBackground prop. SSR-safe isMobile (§16.6 useState(false) + useEffect)
- [x] **W21-P8** Footer bismillah opacity gold/30 → gold/50 (kapanış mührü hissi)
- [x] **W21-P9** `GLASS_CARD` blur tutarlılık audit — `docs/reviews/2026-05-25-glass-card-audit.md`. tokens.js ↔ globals.css TAM uyumlu (drift yok). 74 inline backdropFilter: 49 token-uyumlu (%66), 18 minor drift, 4 outlier (HumanDefinition, VerseGraph, ReadingMode, ToolsBrowser). Visual impact LOW, arch hygiene MEDIUM.
- [x] **W21-P10** Mobile scroll progress indicator — `ScrollProgress.jsx` client component (`< 640px` only). 2px gold bar, rAF-throttled passive scroll listener, `[locale]/layout.js` global mount. SSR-safe (useState(false) + useEffect).
- [x] **W21-P11** KFGQPC `font-feature-settings: 'liga' 1, 'kern' 1, 'calt' 1` + `font-variant-ligatures: contextual common-ligatures` — `globals.css` `[lang="ar"], [dir="rtl"]` selector
- [x] **W21-P12** KissaAtlas sidebar scrollbar — Firefox `scrollbar-width: thin` + `scrollbar-color` gold/15 + WebKit Tailwind arbitrary class. Sadece Scene list sidebar (center grid + detail panel dokunulmadı).

---

## Wave 22 — UX & Functionality Audit

Kaynak: enhancement IV. UX. Audit + fix gerekli.

- [x] **W22-U1** Locale switcher URL persistence — audit PASS, fix gerekmedi. `LanguageContext.jsx:58-66` zaten `pathname.replace(/^\/(tr|en)/, /${next})` + `router.push(swapped)` pattern'i ile path swap yapıyor.
- [x] **W22-U2** Browser back audit + HIGH/MED fixes — `docs/reviews/2026-05-25-browser-back-audit.md`. **2 HIGH FIXED** + **MED FULL**: Toplam 9 component'ta `dispatchEvent('openX')` → `useQuranNav.openOverlay(key)` migrate (KiyametSahneleri, SunnetullahAtlasi, NefisMertebeleri, ZamanBoyutlari, Melekler, MeselAtlasi, WowFacts, ConceptGraph, IlkSonKelimeler). Navbar 16 dead listener temizlendi (2+14). data/paths.jsx no-op (static map). Cross-tool deep-link artık route-based.
- [x] **W22-U3** Keyboard focus trap (audit + hook + 10 modal/overlay entegrasyon) — `docs/reviews/2026-05-25-keyboard-focus-trap-audit.md`. **`useFocusTrap()` hook**: trigger capture + Tab/Shift+Tab boundary loop + focus return. **Entegre: TafsirPanel + WordPopover + FurukAtlasi + KavimlerAtlasi + KadinlarAtlasi + IblisSatan + SebebiNuzul + MunafikProfili + KuranYeminleri + DiyalogAgi**. WCAG 2.1 SC 2.4.3 compliance. role=dialog + aria-modal + aria-label tutarlandı.
- [x] **W22-U4** Escape key audit + fix — 37 tool component tarandı, 35'i temiz. 2 fix: `ProphetAtlas.jsx` ve `TafsirPanel.jsx`'e standart Esc useEffect handler eklendi. ReadingMode.jsx ve MeselAtlasi.jsx bilinçli tasarım kararı (no-op).
- [~] **W22-U5** Empty states — **`/oku/[surah]` partial done:** invalid surah (NaN/0/115+) → `notFound()` early return + locale-aware `not-found.jsx` (Arabic "لَا" decorative, h1 + helpful CTA "Tüm Sureleri Gör"). Verify: `/oku/200` `/oku/0` `/oku/abc` 404, `/oku/1` 200. Kalan: ConceptGraph empty + API meal fail toast (sonraki tur)
- [x] **W22-U6** Mobile spinner centered — 3 dosya fix (KiyametSahneleri:646, Melekler:1209, KuranRenkleri:223) bare/top-left loader → flex-center + minHeight 40vh. Mevcut overlay-level loader'ların 20+'ı zaten doğru flex-center pattern'da.
- [x] **W22-U7** ReadingMode kelime tooltip mobile tap-to-toggle — 4 word render block'una mobile gating: desktop'ta hover korunur, mobilde tap toggle eder, tekrar tap kapatır, dışarı tap kapatır (pointerdown listener + `[data-rm-word]` + `[data-rm-tooltip]` selector'leri). Mevcut isMobile state'i reuse edildi.
- [x] **W22-U8** Settings localStorage schema versionlama — `qurancodex_settings_version` sentinel key + `migrateReadingModeSettings()` namespace versioning. 16 UI prefs purge-on-mismatch (theme, font, audio, karaoke, vb); navigation state + bookmarks + meal/corpus cache KORUNUR. Schema __v: 2. Future bump = silent reset.
- [x] **W22-U9** Audio pause on tool route change — `docs/reviews/2026-05-25-audio-pause-audit.md`. Per-verse audio unmount cleanup eksikti (ReadingMode'da iki audio system var: per-verse + karaoke). ReadingMode.jsx line 1730-1741'e unmount cleanup useEffect eklendi.
- [x] **W22-U10** Document title audit — 15/15 route temiz, unique + locale-aware (`pageMetadata` + module-level TITLE/DESC pattern prod'da hatasız). Generic "QuranCodex" placeholder hiçbir tool route'unda yok.
 
---

## Wave 23 — SEO & A11y Polish

Kaynak: enhancement V. SEO/A11y. Post-cutover.

- [x] **W23-S1** SVG aria triage — sections (16 dosya, 72 SVG) + components (34 dosya, 154 SVG) = **226 decorative SVG'ye `aria-hidden="true"`** eklendi. Data viz SVG'leri skip (ConceptGraph canvas, IsnadTree, MeselAtlasi ring, donut chart, VerseGraph canvas, DiyalogAgi network — ayrı tur için `<title>+<desc>`). Interactive icon button'lar parent aria-label kontrolüyle korundu.
- [x] **W23-S2** WCAG AA color contrast audit — `docs/reviews/2026-05-25-wcag-contrast-audit.md`. 30 color pair, sRGB relative luminance hesaplamasıyla. **26 PASS / 4 FAIL (0 HIGH).** Primary text (offWhite 15.74:1, silver 7.65:1) çok güvenli. MED: silverAlpha70 (4.23:1) + paperGold day-mode (4.14:1). LOW: emerald large-text only. Token önerileri: silverAlpha85, paperGoldDark.
- [x] **W23-S3** "Ana içeriğe geç" skip link — `layout.js`'e statik link (locale-aware TR/EN), `<main id="main">` wrap, `globals.css` `.skip-link` z-index 10003 (navbar üstünde). focus + focus-visible.
- [x] **W23-S4** Heading hierarchy audit + fix — 8 sample route'ta 7/8 temiz. `QuranDua.jsx:532` H4 → H3 atlaması fix (Hz. İbrahim chip aynı section'da). Tool overlay'lerde SSR H1 sonra hydration H2 §16.5/16.12 pattern'iyle uyumlu.
- [x] **W23-S5** hreflang audit — 8/8 route temiz, tr + en + x-default üçlüsü doğru URL'lerle mevcut. Canonical `tr` hreflang ile eşit. `pageMetadata` helper prod'da düzgün çalışıyor.
- [x] **W23-S6** Sitemap dynamic lastModified — `node:fs.statSync` + mtimeCache; 302 entry, **112 unique mtime** (sabit damga olsa 1 olurdu). Mapping: corpus/N.json (sure), page.js (tool + homepage). Fallback BUILD_TIME.
- [ ] **W23-S7** Twitter Card validator test (deploy sonrası)
- [x] **W23-S8** PWA manifest — `public/manifest.json` (name, theme_color gold, bg cosmic-black, standalone, lang tr, 3 icon slot favicon+kaaba+masjid) + `app/layout.js` root metadata.manifest. Apple-touch-icon ve dedike 192px raster skip (asset eksik — sonraki turda).
- [x] **W23-S9** robots.txt tier'li politeness — 3 user-agent grup: `*` (Bingbot/Yandex `Crawl-delay: 1`), Googlebot (no delay), AI scrapers (GPTBot/ClaudeBot/Google-Extended/CCBot/PerplexityBot `Crawl-delay: 2`). +Host direktifi (Yandex)
- [x] **W23-S10** OG locale audit — 8/8 sample (4 TR + 4 EN) doğru `og:locale`: `/tr/*` → `tr_TR`, `/en/*` → `en_US`.

---

## Wave 24 — Tech Debt

Kaynak: enhancement VI. Kod Kalitesi. Faz 11 cleanup ile birleşir.

- [ ] **W24-T1** 53 inline `'KFGQPC'` → `var(--font-kfgqpc)` + `next/font/local`
- [x] **W24-T2** SSR-safe `useState` audit + fix — `docs/reviews/2026-05-25-ssr-usestate-audit.md`. 30 lazy init, 21 HIGH (çoğu ReadingMode.jsx). **Quick win uygulandı**: `ReadingModeRoute` `dynamic({ssr:false})` ile yüklenir → 21 HIGH → LOW (ReadingMode artık client-only render, SSR mismatch riski 0). SEO sinyalleri server-side korundu (PageHeading + JsonLd page.js'te).
- [ ] **W24-T3** Tool overlay → normal-flow refactor (uzun vadeli) — visual breadcrumb + browser back + print + mobile UX
- [x] **W24-T4** i18n key parity son audit — `docs/reviews/2026-05-25-i18n-parity-audit.md`. 934 TR / 935 EN leaf key. Strict path parity ✅ (suffix filtering sonrası 0/0). 1 gerçek missing: `soundArchitecture.phonetics.noteEn` var ama `noteTr` yok. Edge case'ler (kasıtlı `*Tr` suffix EN tarafta) ayrıştırıldı.
- [x] **W24-T5** SVG icon optimization audit — `docs/reviews/2026-05-26-svg-sprite-audit.md`. 351 inline SVG / 57 dosya / 62 duplicate icon type / 244 tekrar kullanım. Top: CloseIcon ×46, ArrowRight ×17, ChevronDown ×12. Tahmini tasarruf ~8-12 KB gzip. **Önerilen: Approach A** (local Icon components `next/src/components/icons/`) — tree-shakable, mevcut CLOSE_BTN token uyumlu. Implementation deferred (Faz 1: 6 core icon ≈ 92 duplicate elimine).
- [ ] **W24-T6** `@next/bundle-analyzer` kurulumu (Faz 8.3 — user dep approval)
- [x] **W24-T7** Edge runtime cold start ölçümü + fix — `docs/reviews/2026-05-25-edge-runtime-cold-start.md`. Meal API sağlıklı (cold 1.2s → warm 154ms CDN HIT). **OG image CDN cache yoktu** (her social-share re-render, p95 3.28s). **P1 fix uygulandı**: 7 OG route + twitter-image'a `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800` eklendi. TTFB ~%75 düşmeli.
- [x] **W24-T8** CSS variables ↔ `tokens.js` sync audit — `docs/reviews/2026-05-25-css-vars-tokens-sync-audit.md`. 23 shared key value-for-value match. **2 HIGH drift**: glassBg warm-cream vs pure-white (dead code; .glass-card hardcoded), FONTS.quran var counterpart yok (.arabic-verse §13.2 violation). 3 MED: softGold/goldBright/goldWarm JS-only.

---

## Faz 12 — Content & Growth (POST-CUTOVER, 90-day roadmap)

Kaynak: enhancement VII. ⭐ Strategic + VIII. KPI'lar.
**Bağlam:** Migration core (Faz 0-11) bittikten sonra başlar. Site "araç koleksiyonu"ndan "Kur'an çalışma platformu"na taşınır.

### Ay 1 — Foundation (P0 — Critical / SEO Multiplier)

- [ ] **F12-İ1 · Per-Surah Landing Page Upgrade** (öncelik 1)
  - Sure özeti (~200 kelime TR+EN), tarihsel bağlam, ana temalar, önemli ayetler, ilgili tool'lar cross-link, sebebi nüzul, prev/next navigation
  - **Scope:** 10 popüler sure ile başla (Fatiha, Bakara, Yâsîn, Mülk, İhlâs, Felak, Nâs, Kehf, Rahman, Vâkıa)
  - **Etki:** Her sure ~500 kelime → SEO long-tail pillar content

- [ ] **F12-İ3 · Daily Verse** (low-effort/high-impact)
  - Homepage hero altında deterministic-by-date rotating ayet
  - Arapça + meal + bağlam + share button
  - Etki: daily-fresh content sinyali, return user ritüel

- [ ] **F12-İ10 · About + Methodology**
  - `/hakkinda` (vizyon, kaynaklara yaklaşım, akademik nüans)
  - `/metodoloji` (korpus, ayet sayım, bgem3, Leeds verification)
  - Etki: Trust/credibility, akademik atıf kabul edilebilirliği

- [ ] **F12-İ20 · Donation / Support**
  - `/destekle` — Stripe one-time + Patreon/BMC recurring + şeffaf maliyet
  - Etki: Sustainability, no-ads commitment

### Ay 2 — Content Depth (P1 — Content Writing Sprint)

- [ ] **F12-İ1 devam** — kalan 104 sure landing page (~114k kelime total TR+EN)
- [ ] **F12-İ2 · Tool Sayfaları Long-Form Intro** — 36 tool × 250 kelime ≈ 9k kelime. Format: tool nedir + nasıl kullanılır + 3 bulgu + metodoloji + CTA
- [ ] **F12-İ9 · Glossary** — `/sozluk` 50+ Quranic + Islamic term (sünnetullah, esbâb-ı nüzûl, mukattaa, fasıla, iltifât, makasıd)

### Ay 3 — Engagement (P2 — Stickiness)

- [ ] **F12-İ5 · Bookmark / Favoriler** — localStorage (ayet/sure/kavram/progress), Navbar kalp ikonu drawer
- [ ] **F12-İ6 · Reading Plans** — `/plan` (30-Day hatim, tematik, custom builder), progress tracker, ICS export
- [ ] **F12-İ7 · Comparative Meal** — Diyanet × Elmalılı × Yazır × Yıldırım × Yüksel yan yana
- [ ] **F12-PWA** (W23-S8 ile) — offline mushaf, install prompt

### Sonraki çeyrek (P3 — Authority & Scale)

- [ ] **F12-İ4 · Global Search** — `/arama?q=...` lunr.js client-side index
- [ ] **F12-İ11 · Blog** — `/yazi/[slug]` long-form (1500+ kelime) deep dives
- [ ] **F12-İ12 · Email Newsletter** — Buttondown/ConvertKit weekly
- [ ] **F12-İ8 · Audio Upgrade** — 12+ reciter, comparison, word-sync MP3
- [ ] **F12-İ15 · Print/PDF Export** — ReadingMode PDF (KFGQPC'li)
- [ ] **F12-İ16 · Comparative Religious Studies** — Yusuf vs Yosef, İsa anlatısı, Tufan (disinterested ton)
- [ ] **F12-İ18 · Light Theme** — `prefers-color-scheme` + localStorage override

### Geleceğe Ertelenen (P4 — Premature)

- [ ] **F12-İ13 · Multilingual (Ar/Id/Ur/Fr)** — TR/EN stabil sonrası 6+ ay
- [ ] **F12-İ14 · Community Discord/Forum** — content kritik kütle + moderasyon kapasitesi sonrası
- [ ] **F12-İ17 · Developer API** — gerçek talep sonrası
- [ ] **F12-İ19 · Native App** — 1k+ MAU sonrası

### Faz 12 Eksik bulgular (audit kapsamadı)

- [ ] **F12-X1 · AI/Embedding Transparency** — bgem3 modeli disclosure (Google E-E-A-T 2025+)
- [ ] **F12-X2 · Citation Guidelines** — akademik atıf (DOI? stable URL? archive.org?)
- [ ] **F12-X3 · `/kaynakca` Genişlemesi** — detaylı bibliyografya (W20-Ö9 ile birleşik)
- [ ] **F12-X4 · Content Moderation Policy** — community için
- [ ] **F12-X5 · Performance Budget CI** — `@lhci/cli` GitHub Actions, LCP > 2.5s → fail
- [ ] **F12-X6 · 404/500/Offline Page Parity** — error pages tutarlılık audit
- [ ] **F12-X7 · EN Section/Tool Inline Text Quality** — K-4 metadata fix etti, component inline EN audit'lenmedi

### Faz 12 KPI'lar

- **SEO:** Lighthouse 95+, organik trafik 3-ay 5× artış, sitelinks görünür
- **Engagement:** Session > 4 dk, bounce < 50%, pages/session > 3
- **Stickiness:** Returning visitor > 30%, bookmark/reading-plan kullanım > 10%
- **Authority:** Backlinks 50+ unique domain, Google Scholar akademik atıf
- **Conversion:** Newsletter signup > 2%, donation > 0.5% (opsiyonel)

---

## Referans dokümanlar

- **CLAUDE.md** — site mimarisi (§16 Next.js patterns 14 alt başlık)
- **`docs/test-plans/manual-ui-checklist.md`** — Faz 9.1 manuel UI test (339 satır)
- **`docs/migration-cutover/deploy-checklist.md`** — Faz 10 deploy plan (444 satır)
- **`docs/migration-cutover/vite-legacy-archive.md`** — Faz 11.1 cleanup plan (389 satır)
- **`tasks/todo_enhancement.md`** — orijinal enhancement audit (630 satır referans snapshot)
- **`docs/reviews/`** — visual + UX + Playwright audit raporları (8+ doküman)
