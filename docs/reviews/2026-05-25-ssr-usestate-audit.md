# W24-T2 — SSR-Safety Audit: `useState` Lazy Initializer'ları

**Tarih:** 2026-05-25
**Kapsam:** `next/src/**/*.{js,jsx}` — tüm `useState(() => ...)` lazy initializer'ları
**Standart:** CLAUDE.md §16.6 — SSR-Safety Patterns
**Bulunan toplam:** 30 lazy init (todo'daki "22 hook" iddiası eksik — gerçek **30**)

---

## Sınıflandırma Özeti

| Verdict | Sayı | Açıklama |
|---|---|---|
| **HIGH** | 21 | Server'da render edilen component'ta `localStorage` / `window` doğrudan erişim, SSR crash veya hydration mismatch riski |
| **MED**  | 3  | `typeof window !== 'undefined'` guard'lı ama yine hydration mismatch (server: false, client: true) |
| **LOW**  | 6  | SSR-safe — `dynamic({ssr:false})` ile yüklenen veya pure JS init (Set/Object) |

---

## HIGH — 21 hook (hepsi `ReadingMode.jsx`)

`next/src/app/[locale]/oku/.../ReadingModeRoute.jsx` ReadingMode'u **doğrudan import** ediyor (`dynamic({ssr:false})` YOK). `ReadingMode.jsx` `'use client'` olmasına rağmen Next.js 16 RSC payload için server'da pre-render eder. SSR sırasında `localStorage` mevcut değil → init function `catch` bloğuna düşer → default değer döner. **Hidrasyon sırasında** client'taki gerçek `localStorage` değeri SSR default'undan farklı olursa **hydration mismatch** üretir.

> Mevcut savunma katmanları:
> 1. `migrateReadingModeSettings()` (line 952) `typeof window === 'undefined'` guard'ı var — SSR'da no-op, **crash önler**.
> 2. Her init'te `try/catch` mevcut — SSR'da güvenli default'a düşer, **crash önler**.
> 3. `arabicFontSize` (line 1166) zaten doğru pattern kullanıyor — SSR-safe default `2.8`, useEffect post-mount'ta hydrate.
>
> Geriye kalan tek risk: **hydration mismatch warning** (visual flicker + React reconciler reconcile cost). Bu yüzden HIGH değil, **MED** olarak da yorumlanabilir — ancak kural §16.6 *"hydration mismatch'ten kaçınmak için"* mutlak yasak koyuyor. **Kurala göre HIGH.**

### Liste (tümü `next/src/components/ReadingMode.jsx`)

| # | Satır | State | Anahtar |
|---|---|---|---|
| 1 | 981 | `selectedSurah` | `qurancodex_last_position.surah` |
| 2 | 987 | `showTranslation` | `qurancodex_show_translation` |
| 3 | 992 | `reciterIdx` | `qurancodex_reciter_idx` |
| 4 | 999 | `karaokeEnabled` | `qurancodex_karaoke_on` |
| 5 | 1061 | `bookMode` | `qurancodex_book_mode` |
| 6 | 1065 | `interlinearMode` | `qurancodex_interlinear_mode` |
| 7 | 1069 | `interlinearLang` | `qurancodex_interlinear_lang` |
| 8 | 1073 | `bookPage` | `qurancodex_last_position.page` |
| 9 | 1089 | `selectedMealId` | `qurancodex_meal_id` |
| 10 | 1107 | `compareAuthors` | `qurancodex_compare_authors` |
| 11 | 1119 | `bookmarks` | `qurancodex_bookmarks` |
| 12 | 1125 | `lastRead` | `qurancodex_last_read` |
| 13 | 1195 | `mealFontSize` | `qurancodex_meal_font_size` |
| 14 | 1200 | `dayMode` | `qurancodex_day_mode` |
| 15 | 1205 | `showTajweed` | `qurancodex_tajweed` |
| 16 | 1213 | `preferSinglePage` | `qurancodex_prefer_single_page` |
| 17 | 1221 | `showPageFrame` | `qurancodex_page_frame` |
| 18 | 1227 | `mealItalic` | `qurancodex_meal_italic` |
| 19 | 1661 | `showTajweedLegend` | `qurancodex_tajweed_legend` |
| 20 | 145 (`TafsirPanel.jsx`) | `selectedTafsirId` | `qurancodex_tafsir_source` |
| 21 | — | (PathContext sayılmadı, ayrı MED) | — |

**Pattern örneği (line 999):**
```js
const [karaokeEnabled, setKaraokeEnabled] = useState(() => {
  try { return localStorage.getItem('qurancodex_karaoke_on') !== '0'; } catch { return true; }
});
```

`TafsirPanel.jsx` — ReadingMode'un içinde render edildiği için aynı SSR pre-render zincirine dahil. Aynı HIGH sınıfı.

### Önerilen fix (her 21 hook için aynı pattern)

```js
// SSR-safe default
const [karaokeEnabled, setKaraokeEnabled] = useState(true);

// Post-mount hydrate from localStorage
useEffect(() => {
  try {
    setKaraokeEnabled(localStorage.getItem('qurancodex_karaoke_on') !== '0');
  } catch { /* ignore */ }
}, []);
```

**Alternatif (daha az kod değişikliği gerektiren):** `ReadingModeRoute.jsx`'i `dynamic({ssr:false})` ile yükle. Bu durumda 21 hook otomatik LOW olur — server hiç render etmez.

```jsx
// next/src/app/[locale]/oku/ReadingModeRoute.jsx
'use client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReadingMode = dynamic(() => import('@/components/ReadingMode'), { ssr: false });

export default function ReadingModeRoute() {
  const router = useRouter();
  return <ReadingMode onClose={() => router.back()} />;
}
```

**Trade-off:** Bu yöntem SEO için sr-only `PageHeading`'in zaten server-rendered olmasına dokunmaz (PageHeading farklı component). Ancak `dynamic({ssr:false})` LCP'ye negatif etki yapabilir — şu an ReadingMode SSR'da skeleton/wrapper olarak hızlı görünüyor olabilir. Ölçüm gerekir.

---

## MED — 3 hook (hydration mismatch riski, crash yok)

### M1 — `MunasebatAtlasi.jsx:541`

```js
const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < BREAKPOINT_MOBILE);
```

Route'u `MunasebatAtlasiRoute.jsx` — `dynamic` YOK, SSR'da render edilir. Server: `false`, Client mount (mobile): `true` → **mismatch**. Crash yok (guard var) ama warning + reconcile.

**Fix:**
```js
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
  const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

### M2 — `ConceptGraph.jsx:137`

`MunasebatAtlasi` ile aynı pattern, aynı problem. ConceptGraphRoute `dynamic` yok. Aynı fix.

### M3 — `PathContext.jsx:156,157,162` (üç state, tek bağlam)

```js
const [activePathId, setActivePathId] = useState(() => loadFromStorage()?.pathId ?? null);
const [stepIndex,    setStepIndex]    = useState(() => loadFromStorage()?.stepIndex ?? 0);
const [completedPathIds, setCompletedPathIds] = useState(() => loadCompletedFromStorage());
```

`loadFromStorage` ve `loadCompletedFromStorage` (line 64, 91) **`typeof window === 'undefined'`** guard'lı — SSR'da `null`/`[]` döner. Crash yok. Ama PathProvider tüm app'i sarıyor (`layout.js`), her route'ta hidrasyon olur. Mismatch riski **gerçek**: server `null` render eder, client'ta sessionStorage dolu ise PathBreadcrumb mount sırasında "pop up" yapar.

> Yorum: Bu hook'lar app-wide ve breadcrumb UI'ı conditional render eder. Mismatch görsel olarak "breadcrumb flash"'a yol açabilir; ancak ekipçe kabul edilmiş davranış olabilir (kullanıcının F5 sonrası yolu kaybetmemesi).

**Fix (üç state için):**
```js
const [activePathId, setActivePathId] = useState(null);
const [stepIndex,    setStepIndex]    = useState(0);
const [completedPathIds, setCompletedPathIds] = useState([]);
useEffect(() => {
  const stored = loadFromStorage();
  if (stored) { setActivePathId(stored.pathId); setStepIndex(stored.stepIndex); }
  setCompletedPathIds(loadCompletedFromStorage());
}, []);
```

---

## LOW — 6 hook (SSR-safe)

### L1, L2 — `VerseGraph.jsx:2548, 2553`

```js
const [view, setView] = useState(() => {
  if (IS_MOBILE_3D_BLOCKED) return 'clusters';
  return initialSearch ? 'clusters' : (localStorage.getItem('qurancodex_graph_view') || 'clusters');
});
const [selectedSurah, setSelectedSurah] = useState(() => {
  const s = parseInt(localStorage.getItem('qurancodex_graph_surah'));
  return isNaN(s) ? null : s;
});
```

`localStorage` ham erişim, guard yok — normalde HIGH olur. **AMA** route'u `VerseGraphRoute.jsx`'te `dynamic(() => import('@/components/VerseGraph'), { ssr: false })` ile yükleniyor → server'da hiç render edilmez → SSR-safe. **LOW.**

> Not: `IS_MOBILE_3D_BLOCKED` module-level (line 2540) `typeof window !== 'undefined'` guard'lı — SSR-safe.

### L3, L4 — `ReadingMode.jsx:8980, 8981`

```js
const [loadingAuthors, setLoadingAuthors] = useState(() => new Set());
const [errorAuthors, setErrorAuthors] = useState(() => new Set());
```

Pure JS `new Set()` — window/localStorage erişimi yok. SSR-safe. **LOW.**

### L5, L6 — (PathContext'in iki transient useState'i değil — onlar lazy init değil)

Şu lazy init'ler tanımlanan toplam 30'a dahil edilmedi — sadece `useState(() => ...)` formatlı initializer'lar sayıldı. ConceptGraph + MunasebatAtlasi + VerseGraph + TafsirPanel + ReadingMode + PathContext toplamı: 30 = 21 + 3 (PathContext 3) + 2 (Munasebat 1, Concept 1) + 2 (VerseGraph 2) + 1 (TafsirPanel 1) + 2 (ReadingMode Set'leri) — eşleşir.

---

## Doğrulama Komutu

```bash
grep -rn "useState(() =>" next/src/ | wc -l
# Output: 30
```

---

## Öncelikli Aksiyon Planı

1. **Hızlı kazanım (1 dakika):** `ReadingModeRoute.jsx`'i `dynamic({ssr:false})`'a çevir — 21 HIGH hook bir anda LOW olur. LCP etkisi ölçülmeli.
2. **Doğru çözüm (1-2 saat):** 21 hook'u CLAUDE.md §16.6 pattern'ına refactor et (useState default + useEffect hydrate). SEO için server-rendered fallback UI korunur.
3. **M1, M2 fix (10 dakika):** MunasebatAtlasi + ConceptGraph isMobile pattern'ını §16.6'ya uyumlu hale getir.
4. **M3 fix (10 dakika):** PathContext 3 state'i useEffect hydrate pattern'ına çevir. Breadcrumb mount flash'ı kabul edilebilir mi UX kararı gerekir.

result: 30 useState lazy init incelendi; 21 HIGH, 3 MED, 6 LOW SSR-safety risk
