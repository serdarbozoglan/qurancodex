# QuranCodex Next.js Migration — Yol Haritası

> **Branch:** `migration-to-next.js`
> **Mevcut durum (2026-05-24):** Migration ~%95 pre-deploy hazır. Production build PASS, 8 hot route benchmark <1s avg (0 console error). Faz 0-9 functional + SEO done, 35 tool bilingual metadata, Wave 16 hydration fixes. Faz 10 cutover'a hazır.
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
- [ ] **Per-prophet OG image** — `/atlas/peygamber/[id]` dynamic route eklendiğinde otomatik fallback'ten çıkar
- [ ] **Twitter Card / FB Sharing / LinkedIn Inspector test** — POST-DEPLOY (gerçek public URL gerekli)

### Faz 7.13 / 8.3 / 8.4 Açık (post-deploy)
- [ ] **Bundle size analizleri** — `@next/bundle-analyzer` kur (yeni dep, kullanıcı onayı bekliyor)
- [ ] **Framer Motion lazy load** — bundle analyzer çıktısına göre karar
- [ ] **KFGQPC font subset** (~600KB → ~200KB) — pyftsubset/fonttools script
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
- [ ] **W19-K5 · Build-time meal prefetch script** — `scripts/prefetch-meals.mjs`:
  - 6 ana meal author × 114 sure = 684 fetch
  - Output: `public/meal-cache/{author}/{surah}.json`
  - Runtime proxy sadece fallback
  - Önkoşul: Post-deploy gerçek traffic ölçümü

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

- [ ] **W20-Ö1 · Footer "Sayfaları Keşfet" hierarchy** — nav bg `rgba(255,255,255,0.02)` (sources `0.05`'in altında). Dosya: `Footer.jsx:130-158`
- [ ] **W20-Ö3 · Reading mode mobile header §14.5 pattern** — Row 1: title+close, Row 2: scrollable chips. Dosya: `ReadingMode.jsx` mobile header
- [ ] **W20-Ö4 · Section gradient seam (200px overlap CLAUDE.md §4)** — bazı section geçişlerinde eksik. Dosyalar: `sections/*.jsx` sistematik
- [ ] **W20-Ö5 · Global LoadingOverlay component** — `next/src/components/LoadingOverlay.jsx`, tüm tool'lar kullansın
- [ ] **W20-Ö6 · SurahPagination visible navigation** — şu an sr-only; reading mode footer/header'a "Önceki: Fatiha | Sonraki: Âl-i İmrân" şeritleri
- [ ] **W20-Ö7 · ScientificSigns "Devamını oku" default expanded** — server-side content gizli, engagement düşüyor. Dosya: `sections/ScientificSigns.jsx`
- [ ] **W20-Ö8 · KissaAtlas sahne sayısı tutarsızlığı** — "Musa 32 / Yusuf 3" anormal. Data audit `next/public/kissa-atlas.json`. Content task
- [ ] **W20-Ö9 · `/kaynakca` route** — detaylı bibliyografya, footer'da top 5 + "Tüm kaynaklar →" (F12-X3 ile birleşik)
- [ ] **W20-Ö10 · ToolsBrowser search empty state** — "Popüler aramalar: dua · esma · kıssa" öneri chip'leri

---

## Wave 21 — Visual Polish Backlog

Kaynak: enhancement III. Polish. Batched sprint.

- [ ] **W21-P1** Hero CTA +12px horizontal padding, hover 200ms ease
- [ ] **W21-P2** Karaoke highlight 80ms → 150ms ease-in-out
- [ ] **W21-P3** Page turn glyph subtle parallax
- [ ] **W21-P4** Tool card hover `translateY(-2px)` + box-shadow lift
- [ ] **W21-P5** Footer link hover gold/30 underline
- [ ] **W21-P6** Hamburger 200ms cubic-bezier slide-in
- [ ] **W21-P7** Mobile particle count 40 → 15
- [ ] **W21-P8** Footer bismillah opacity gold/30 → gold/50
- [ ] **W21-P9** `GLASS_CARD` blur tutarlılık audit
- [ ] **W21-P10** Mobile scroll progress indicator (opsiyonel)
- [ ] **W21-P11** KFGQPC `font-feature-settings: 'liga' 1, 'kern' 1` + `font-variant-ligatures: contextual` global
- [ ] **W21-P12** KissaAtlas sidebar scrollbar thin + gold/15 webkit-thumb

---

## Wave 22 — UX & Functionality Audit

Kaynak: enhancement IV. UX. Audit + fix gerekli.

- [ ] **W22-U1** Locale switcher URL persistence — `/tr/X` ↔ `/en/X` (Navbar `toggleLanguage` audit)
- [ ] **W22-U2** Browser back: tool overlay → homepage (`onClose router.push('/')` doğrula)
- [ ] **W22-U3** Keyboard nav tab order + focus trap on modal open + restore on close
- [ ] **W22-U4** Escape key tool overlay close — tüm tool'larda?
- [ ] **W22-U5** Empty states: `/oku/200` 404 not-found.jsx, ConceptGraph empty data, API meal fail toast
- [ ] **W22-U6** Mobile spinner centered
- [ ] **W22-U7** ReadingMode kelime tooltip mobile: tap-to-toggle
- [ ] **W22-U8** Settings localStorage schema versionlama
- [ ] **W22-U9** Audio pause on tool overlay open
- [ ] **W22-U10** Tool overlay'de document.title update kontrol

---

## Wave 23 — SEO & A11y Polish

Kaynak: enhancement V. SEO/A11y. Post-cutover.

- [ ] **W23-S1** SVG aria-* triage — 363 SVG'ye `aria-hidden="true"` / meaningful'lara `<title>+<desc>`
- [ ] **W23-S2** Color contrast WCAG AA (`text-silver/75` /`40` audit; Lighthouse)
- [ ] **W23-S3** "Ana içeriğe geç" skip link (focus visible)
- [ ] **W23-S4** Heading hierarchy tool sayfaları SSR H1 + hydration H2 audit
- [ ] **W23-S5** hreflang URL Inspection per route
- [ ] **W23-S6** Sitemap `lastModified` dinamik (file mtime)
- [ ] **W23-S7** Twitter Card validator test (deploy sonrası)
- [ ] **W23-S8** PWA manifest (`public/manifest.json`)
- [ ] **W23-S9** robots.txt `Crawl-delay: 1` (sitemap büyüdükçe)
- [ ] **W23-S10** Open Graph locale verify (`/tr` `tr_TR`, `/en` `en_US`)

---

## Wave 24 — Tech Debt

Kaynak: enhancement VI. Kod Kalitesi. Faz 11 cleanup ile birleşir.

- [ ] **W24-T1** 53 inline `'KFGQPC'` → `var(--font-kfgqpc)` + `next/font/local`
- [ ] **W24-T2** SSR-safe `useState` audit — 22 hook'ta kalan `localStorage` lazy init → §16.6 standardı
- [ ] **W24-T3** Tool overlay → normal-flow refactor (uzun vadeli) — visual breadcrumb + browser back + print + mobile UX
- [ ] **W24-T4** i18n key parity son audit (W17'de `*Tr/*En` suffix pattern false positive çıktı)
- [ ] **W24-T5** Tool icon SVG sprite optimization
- [ ] **W24-T6** `@next/bundle-analyzer` kurulumu (Faz 8.3 — user dep approval)
- [ ] **W24-T7** Edge runtime cold start time ölçümü (API + OG routes)
- [ ] **W24-T8** CSS variables ↔ `tokens.js` sync audit

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
