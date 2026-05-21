# SSR-safety Audit — Faz 0.1

**Tarih:** 2026-05-21
**Branch:** `migration-to-next.js`
**Hedef:** Next.js 15 App Router (`'use client'` boundary stratejisi için altyapı)

---

## Genel İstatistik

| Metrik | Sayı |
|---|---|
| Toplam component dosyası (`src/components/` + `src/sections/`) | **75** |
| `window.*` kullanımı (toplam) | **430** |
| `document.*` kullanımı (toplam) | **119** |
| `localStorage` kullanımı (toplam) | **85** |
| `sessionStorage` kullanımı (toplam) | **24** |
| `navigator.*` kullanımı (toplam) | **7** |
| `useLayoutEffect` (yalnızca 1 dosya) | **5 satır referans** |
| `useState(() => ...)` lazy initializer + browser API | **32** |
| Module-level browser API | **1** (VerseGraph, SSR-guard'lı) |
| `localStorage` useState initializer'da | **0** ✅ |

---

## Kategori 1 — Pure RSC Adayları (8 component) ✅

Hiç hook ve browser API içermeyen, **server-side render edilebilir** static component'ler. Next.js'te direkt RSC olarak kullanılır:

- `components/PathCard.jsx`
- `components/ToolHighlightCard.jsx`
- `components/Footer.jsx`
- `components/SectionWrapper.jsx`
- `components/TopicCard.jsx`
- `components/StatCard.jsx`
- `sections/LivingPreservation.jsx`
- `sections/ToolsShowcase.jsx`

**Migration aksiyonu:** Bu dosyalar dokunmadan taşınır, `'use client'` direktifi eklemez. JSON-LD + metadata propagation buradan başlatılabilir.

---

## Kategori 2 — `useState` Lazy Initializer ile Browser API (32 instance)

**Pattern:** `const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT)`

Bu pattern Next.js client component'lerinde **çalışır** ama:
- ❌ Server component olarak kullanılamaz
- ⚠️ Hydration mismatch riski — server "false" render edip client "true" render eder
- ✅ `'use client'` ile working, ama temizlemek için: `useState(false)` initial + `useEffect` ile güncelle

### SSR-aware (typeof window guard'lı — 6 instance) ✅

Bu instance'lar zaten SSR-aware yazılmış, `'use client'` ile sorunsuz:
- `components/ConceptGraph.jsx:149` (isMobile)
- `components/MunasebatAtlasi.jsx:539` (isMobile)
- `components/PathBreadcrumb.jsx:38` (isMobile)
- `components/ReadingMode.jsx:1086` (isMobile), `:1091` (isWide)
- `components/WordHeatmap.jsx:576` (isMobile)
- `sections/ScientificSigns.jsx:95` (isMobile)

### SSR-unsafe (typeof window guard YOK — 26 instance) ⚠️

`'use client'` zorunlu. Eğer üst component bunları lazy import edip SSR'da render etmeye çalışırsa patlar.

**Tüm liste:**
- `components/AddresseeSystem.jsx:12`
- `components/CennetCehennem.jsx:147`
- `components/DiyalogAgi.jsx:128`
- `components/DogaAtlasi.jsx:986`
- `components/FurukAtlasi.jsx:101`
- `components/IlkSonKelimeler.jsx:48`
- `components/KadinlarAtlasi.jsx:81`
- `components/KavimlerAtlasi.jsx:84`
- `components/KiraatAtlasi.jsx:1540`
- `components/KissaAtlas.jsx:94`
- `components/KiyametSahneleri.jsx:437`
- `components/KuranRenkleri.jsx:1205`
- `components/KuranRetorigi.jsx:53`
- `components/Melekler.jsx:1068`
- `components/MeselAtlasi.jsx:1321`
- `components/MihverDemoLauncher.jsx:21` (`URLSearchParams(window.location.search)`)
- `components/NefisMertebeleri.jsx:62`
- `components/QuranCommands.jsx:85`
- `components/SebebiNuzul.jsx:1657`
- `components/SemanticMap.jsx:31`
- `components/SurahComparator.jsx:473`
- `components/ToolsBrowser.jsx:54`
- `sections/AllTopics.jsx:24` (`getColumnCount(window.innerWidth)`)
- `sections/PathCards.jsx:118`
- `sections/ToolsHighlight.jsx:126` (`getColumnCount(window.innerWidth)`)

**Migration aksiyonu (Faz 4.5'te her component route'a dönüşürken):**
1. Dosyaya `'use client'` direktifi ekle (üstte)
2. **Önerilen refactor pattern** (hydration mismatch'i kalıcı çöz):
   ```jsx
   // Önce — hydration mismatch riski
   const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_MOBILE);

   // Sonra — SSR-safe (server "false", client doğru değer)
   const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
     const check = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
     check();
     window.addEventListener('resize', check);
     return () => window.removeEventListener('resize', check);
   }, []);
   ```
3. Veya `useSyncExternalStore` ile media query subscription:
   ```jsx
   const isMobile = useSyncExternalStore(
     (callback) => {
       const mql = window.matchMedia(`(max-width: ${BREAKPOINT_MOBILE - 1}px)`);
       mql.addEventListener('change', callback);
       return () => mql.removeEventListener('change', callback);
     },
     () => window.matchMedia(`(max-width: ${BREAKPOINT_MOBILE - 1}px)`).matches,
     () => false, // server snapshot
   );
   ```

---

## Kategori 3 — Module-Level Browser API (1 instance) ✅

```js
// src/components/VerseGraph.jsx:2547
const IS_MOBILE_3D_BLOCKED = typeof window !== 'undefined' && window.innerWidth < 640;
```

✅ SSR-guard'lı; modül load anında `undefined` window'a takılmaz, sadece `false` döndürür.

**Migration aksiyonu:** VerseGraph zaten `'use client'` olacak (Three.js + state heavy). Bu sabit korunabilir veya component scope'a taşınabilir. Düşük öncelik.

---

## Kategori 4 — Yoğun Browser API Kullanımı (`'use client'` zorunlu)

Top-20 component, browser API kullanımına göre:

| Sıra | Component | Browser API satır sayısı | RSC mümkün mü? |
|---|---|---|---|
| 1 | `components/ReadingMode.jsx` | 102 | ❌ Hayır — heavy state, audio, scroll, karaoke rAF |
| 2 | `components/Navbar.jsx` | 62 | ❌ Hayır — state, dropdown, popstate |
| 3 | `components/VerseGraph.jsx` | 37 | ❌ Hayır — Three.js, force-graph, interactive |
| 4 | `components/ToolsBrowser.jsx` | 16 | ❌ Hayır — search, filter state |
| 5 | `components/MeselAtlasi.jsx` | 14 | ❌ Hayır — overlay, isMobile |
| 6 | `components/IlkSonKelimeler.jsx` | 13 | ❌ Hayır — search, filter |
| 7 | `components/WordHeatmap.jsx` | 12 | ❌ Hayır — interactive heatmap |
| 8 | `components/ConceptGraph.jsx` | 12 | ❌ Hayır — graph state |
| 9-16 | ZamanBoyutlari, SunnetullahAtlasi, NefisMertebeleri, MunafikProfili, Melekler, KiyametSahneleri, KavimlerAtlasi, KadinlarAtlasi, DiyalogAgi | 10 | ❌ Hayır — overlay state |
| 17-20 | SemanticMap, SebebiNuzul, MunasebatAtlasi | 9 | ❌ Hayır — overlay state |

**Migration aksiyonu:** Hepsi `'use client'` ile route'a dönüşür. Faz 4'ün ana iş yükü bu component'leri taşımak.

---

## Kategori 5 — `useLayoutEffect` (1 dosya, 1 kullanım)

- `components/WordTooltip.jsx:38` — tooltip viewport içinde pozisyonlama için canonical `useLayoutEffect` measure-then-position pattern'ı.

**Migration aksiyonu:** `'use client'` ile uyumlu, refactor gerekmez. Sadece Next.js'in `useLayoutEffect` warning'ini (SSR'da boş çağrı) yememek için: zaten bu dosya `'use client'` olduğu için sorun yok.

---

## Kategori 6 — `localStorage` Erişimi (85 satır, 0 lazy initializer)

İyi haber: `useState(() => localStorage...)` pattern'ı **yok**. Tüm `localStorage` erişimleri ya:
- `useEffect` içinde (SSR-safe, hydration sonrası çalışır)
- Event handler içinde
- `try/catch` ile sarmalanmış

**Migration aksiyonu:** Mevcut pattern Next.js client component'lerinde direkt çalışır. Sadece `'use client'` zorunlu (zaten state olan dosyalar). Hydration mismatch için cookie-based persistence alternatifi düşünülebilir (özellikle dil tercihi için).

**Persist edilen anahtarlar (örnek):**
- `qurancodex_lang` (LanguageContext)
- `qurancodex_tafsir_source` (TafsirPanel)
- `qurancodex_karaoke_on` (ReadingMode)
- `qurancodex_timings_*` (useWordTimings LRU cache)
- Diğer `qurancodex_*` prefix'li tercihler

---

## Kategori 7 — `addEventListener` (Toplam yüksek, module-level 1)

Module-level `addEventListener` ataması yok (sadece 1 import-time setup var ve o da useEffect sırasında). Tüm event listener'lar component scope'unda useEffect içinde — SSR-safe.

---

## Migration Stratejisi Özeti

### Faz 1.3 (Next.js iskelet) — yapılacaklar:
- [ ] Root layout: `<html lang>` dinamik, `next/font/local` ile KFGQPC
- [ ] `LanguageContext` `'use client'` direktifi ile, cookie-backed locale önerilir

### Faz 2 (Shared modules) — yapılacaklar:
- [ ] `tokens.js`, `utils/*` taşı (pure functions, RSC-safe)
- [ ] `LanguageContext.jsx`'e `'use client'`
- [ ] `useWordTimings.js`, diğer hooks → `'use client'` (state kullanan tüm hook'lar)

### Faz 3 (Home + sections):
- [ ] **8 RSC adayı** (Footer, LivingPreservation, ToolsShowcase, kart component'leri) RSC olarak
- [ ] Hero (particle) → client wrapper
- [ ] Diğer section'lar → karar matrisi:
  - State + animasyon var → client
  - Sadece JSX + tip text → RSC + client child'lar

### Faz 4 (Overlay → Route dönüşümü):
- [ ] Her overlay component'i route'a taşırken üste `'use client'`
- [ ] **26 SSR-unsafe lazy initializer**'ı `useEffect`-pattern'ına çevir (hydration mismatch'i kalıcı çöz)
- [ ] Veya minimum refactor: dosyaya `'use client'` ekle, lazy initializer'a `typeof window` guard'ı ekle (6 dosyada zaten var, 20 dosyaya eklenir)

### Faz 4.5 (Transformation pattern):
- [ ] **Per-component checklist** uygula:
  1. `'use client'` direktifi
  2. `onClose` → `router.back()` veya `<Link href="/">`
  3. SSR-safe isMobile pattern
  4. Escape handler kaldır (Next.js navigation ile değişir)
  5. State persistence (URL params veya cookie)

---

## Risk Değerlendirme

| Risk | Olasılık | Etki | Mitigation |
|---|---|---|---|
| Hydration mismatch (isMobile false→true) | **Yüksek** | Orta (UI flash) | useState(false) + useEffect pattern; her 26 dosyaya uygula |
| localStorage SSR'da `undefined` | Düşük | Yüksek (crash) | `'use client'` direktifi zorunlu |
| Audio API / rAF SSR'da | Düşük | Yüksek (crash) | ReadingMode hepsi useEffect içinde, sorunsuz |
| Three.js / WebGL SSR | Düşük | Yüksek (crash) | VerseGraph zaten dynamic import patternına uygun |
| `useLayoutEffect` Next.js warning | Düşük | Düşük | WordTooltip `'use client'` ile uyumlu |
| Module-level window check | Düşük | Düşük | VerseGraph zaten guard'lı |

---

## Sonuç

**SSR-safety şu an:** Genel olarak kabul edilebilir. 26 SSR-unsafe lazy initializer (`isMobile` pattern'ı) **client component olarak yaşayabilir** ama hydration mismatch ihtimali var. Faz 4'te her component route'a dönüşürken bunlar SSR-safe pattern'a refactor edilmelidir.

**Hızlı kazanım yolu:** İlk olarak Faz 1-3'te shared modules ve RSC adayları taşı; Faz 4'te tek tek overlay'leri migrate ederken her birinde isMobile pattern'ı SSR-safe hale getir. Toplu refactor riskli olur — tek tek yapmak daha güvenli.

**Pure RSC adayları (8 component) Faz 1'in başında taşınabilir** ve "Next.js skeleton yaşıyor" hissi erken yakalanır.
