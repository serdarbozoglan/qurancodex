# W22-U2 — Browser Back Button Audit (Tool Routes → Homepage)

**Tarih:** 2026-05-25
**Branch:** `migration-to-next.js`
**Kapsam:** Next.js 16 App Router'da tool route'larından (`/atlas/*`, `/graf/*`, `/arac/*`, `/oku/*`) homepage'e dönerken browser back button davranışı.
**Yöntem:** Statik kod analizi — `router.push` / `router.back` / `onClose` / `popstate` / cross-tool nav pattern'ları incelendi.

---

## TL;DR

5 senaryo audit edildi. **2 sorun (1 HIGH, 1 MED), 1 ek inconsistency.** Tool route'ların büyük çoğunluğu (37 route) doğru pattern (`router.back()`) kullanıyor; ancak **`ReadingMode` route'ları** sorunlu (`router.push('/')`) ve **`useQuranNav` ↔ `VerseGraph` query param uyumsuzluğu** searchParams preserve'ünü kıran ayrı bir kusur.

---

## Senaryo 1 — Homepage → tool route → browser back → homepage

**Beklenen:** Browser history'de [homepage, tool] bulunur; back → homepage'e döner, scroll position restore edilir.

**Gözlemlenen:**
- Navbar tool tıklaması → `router.push(\`/${language}${route}\`)` (Navbar.jsx:660) — locale-prefix'li, tek history entry pushlanır.
- Tool'un `onClose` (37 route'ta) → `router.back()` — browser-native back ile aynı, history pop'lar.
- Next.js default `scrollRestoration` aktif (Next 16 App Router default'u manual değil; `next.config.mjs` özelleştirme yok).

**Verdict:** ✅ Doğru çalışıyor. **Risk: LOW.**

---

## Senaryo 2 — Tool A → Tool B (cross-tool nav) → browser back → Tool A mı, Homepage mi?

**Beklenen:** Tool A → Tool B route push'u history entry ekler; back → Tool A'ya döner.

**Gözlemlenen:** **İki ayrı pattern** karışık kullanılıyor:

**Pattern A (route-based, doğru):**
- `WordPopover` (`{ event: 'openVerseGraph', detail: { search: '2:255' } }`) ve `WowFacts.jsx:577` `window.dispatchEvent(new CustomEvent('openVerseGraph', { detail: { search, returnToWow: true } }))` → Navbar `useEffect` handler'ı **eski state-based** `setGraphOpen(true)` yapıyor (Navbar.jsx:277-288), router.push yapmıyor.
- Sonuç: URL **değişmez**. Browser back, "Tool A → Tool B"yi tek entry sayar; back ile Tool A görünmez, doğrudan homepage'e gider (veya bir önceki section'a).

**Pattern B (event-then-state-overlay, daha kötü):**
- `KiyametSahneleri.jsx:666` "Cennet & Cehennem →" → `dispatchEvent('openCennetCehennem')` → Navbar `setCennetOpen(true)` (Navbar.jsx:328) → **CennetCehennem overlay'i state olarak açılır**, URL hâlâ `/arac/kiyamet`.
- Sonuç: Görsel olarak iki tool üst üste açık, ancak URL bar yanıltıcı. Browser back overlay'i kapatmaz; tek seferde homepage'e atar.
- `SunnetullahAtlasi.jsx:710` → `openKavimlerAtlasi`, `NefisMertebeleri.jsx:382` → `openMunafikProfili`, `MeselAtlasi.jsx:1284-1285` → `openCennetCehennem`/`openKiyametSahneleri`, `ZamanBoyutlari.jsx:1234` → `openKiyametSahneleri`, `Melekler.jsx:768` → `openKiyametSahneleri` aynı pattern.

**Verdict:** ⚠️ **Risk: MED.** Cross-tool nav URL'i güncellemiyor → SEO sinyali kayıp, paylaşım yanlış URL paylaşıyor, back behavior öngörülemez. **Vite'tan kalan event-dispatch legacy'si full-page route'lara migrate edilmemiş.**

**Önerilen fix:**

```jsx
// next/src/components/KiyametSahneleri.jsx:666 ve diğer tüm cross-tool linkler
// Eski:
{ event: 'openCennetCehennem', ... onClick: () => window.dispatchEvent(new CustomEvent('openCennetCehennem')) }

// Yeni — useQuranNav hook kullan:
import { useQuranNav } from '@/hooks/useQuranNav';
const { openOverlay } = useQuranNav();
// ...
onClick={() => openOverlay('cennet')}  // useQuranNav.js OVERLAY_ROUTES'taki key
```

Bu sayede her cross-tool tıklama `router.push('/tr/arac/cennet-cehennem')` ile yeni history entry ekler — back doğru çalışır.

---

## Senaryo 3 — Hard refresh tool route'unda → browser back → boş history

**Beklenen:** Hard refresh sonrası history'de yalnız 1 entry. Back → tarayıcının "previous tab/origin"e dönmesi gerekir; uygulama açısından no-op.

**Gözlemlenen:**
- `router.back()` boş history'de **no-op** (Next.js client navigation davranışı) — tool overlay açık kalır.
- Kullanıcı "geri" tuşuna basıp hiçbir şey olmadığını görür → confusing UX.

**Verdict:** ⚠️ **Risk: LOW** (edge case). Çoğu kullanıcı doğrudan tool URL'iyle açılıp back basmaz; ama browser tab açılış senaryosunda mümkün.

**Önerilen fix (opsiyonel):**

```jsx
// Generic FallbackBack: router.back() boş ise homepage'e
// next/src/lib/navHelpers.js — yeni helper
export function safeBack(router, locale, fallback = '/') {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    router.push(`/${locale}${fallback}`);
  }
}

// Route wrapper'larda:
onClose={() => safeBack(router, language)}
```

37 route'un her birinde tek satır değişiklik; veya merkezi bir `useToolClose()` hook'u oluşturulabilir.

---

## Senaryo 4 — ReadingMode (`/tr/oku/X`) → browser back → ne oluyor?

**Beklenen:** Route'a homepage'den gelinmişse → back → homepage; başka tool'dan gelinmişse → o tool'a.

**Gözlemlenen:** ❌ **BUG.**

```jsx
// next/src/app/[locale]/oku/ReadingModeRoute.jsx:8
// next/src/app/[locale]/oku/[surah]/ReadingModeRoute.jsx:8
return <ReadingMode onClose={() => router.push('/')} initialSurah={initialSurah} />;
```

İki problem:

1. **Locale prefix yok:** `router.push('/')` → middleware redirect ile `/tr`'ye atar (Network roundtrip + history'de 2 entry birikir; back ile homepage → reading mode → reading mode... loop riski).
2. **`router.push` ≠ `router.back`:** Cross-tool nav (örn. `WordPopover` → Reading Mode) sonrası kapanışta **homepage'e** atılır, gelinen tool kaybolur. Kullanıcı navigation context'ini kaybeder.

**Verdict:** ❌ **Risk: HIGH** — locale-broken redirect + cross-tool context loss. Diğer 37 route `router.back()` kullanıyor; ReadingMode neden farklı?

**Önerilen fix:**

```jsx
// next/src/app/[locale]/oku/ReadingModeRoute.jsx
'use client';
import { useRouter } from 'next/navigation';
import ReadingMode from '@/components/ReadingMode';

export default function ReadingModeRoute() {
  const router = useRouter();
  return <ReadingMode onClose={() => router.back()} />;
}

// Aynısı /oku/[surah]/ReadingModeRoute.jsx için
```

Eğer back history boş olabiliyorsa (kullanıcı doğrudan `/tr/oku/2` URL'iyle açtı), Senaryo 3'teki `safeBack()` helper'ı kullanılabilir.

---

## Senaryo 5 — searchParams (`?q=2:255`) preserve

**Beklenen:** `openOverlay('graph', { search: '2:255' })` → URL'de `?q=2:255` → back ile gelinen URL aynı param'ı korur.

**Gözlemlenen:** ⚠️ **2 ayrı bug.**

**Bug 5a — Query param adı uyumsuz:**

```js
// next/src/hooks/useQuranNav.js:108
const url = detail?.search ? `${localizedRoute}?q=${encodeURIComponent(detail.search)}` : localizedRoute;
//                                            ^^^ q

// next/src/components/VerseGraph.jsx:2574
const urlVerse = new URLSearchParams(window.location.search).get('verse');
//                                                              ^^^^^^ verse
```

`useQuranNav` `?q=` ile push ediyor ama VerseGraph `?verse=` okuyor — query param **işe yaramaz**. Dolayısıyla cross-tool deep-link de bozuk.

**Bug 5b — Route wrapper `initialSearch` prop'unu geçirmiyor:**

```jsx
// next/src/app/[locale]/graf/ayet/VerseGraphRoute.jsx
return <VerseGraph onClose={() => router.back()} />;  // initialSearch prop YOK
```

VerseGraph `initialSearch=''` default'u alıyor — URL'deki query'yi `useSearchParams()` ile okumadan ekstra path yok. Sadece `window.location.search` ile `?verse=` aranıyor (Bug 5a yüzünden bu da yanlış key arıyor).

**Verdict:** ❌ **Risk: HIGH** — Cross-tool deep-link (örn. `/tr/graf/ayet?q=2:255`) **çalışmıyor**. Back/forward param preserve etse bile içerik focus değişmez.

**Önerilen fix — iki seçenek:**

**Opsiyon A — `useQuranNav` tarafında düzelt (geriye uyumlu):**

```js
// next/src/hooks/useQuranNav.js:108
const url = detail?.search ? `${localizedRoute}?verse=${encodeURIComponent(detail.search)}` : localizedRoute;
//                                            ^^^^^^ verse  (VerseGraph'ın okuduğu key)
```

**Opsiyon B — Route wrapper'ı searchParams-aware yap (önerilen):**

```jsx
// next/src/app/[locale]/graf/ayet/page.js — server component
export default async function Page({ params, searchParams }) {
  const { q, verse } = await searchParams;  // her iki key'i de destekle
  const initialSearch = q || verse || '';
  // ...
  return <VerseGraphRoute initialSearch={initialSearch} />;
}

// next/src/app/[locale]/graf/ayet/VerseGraphRoute.jsx
export default function VerseGraphRoute({ initialSearch = '' }) {
  const router = useRouter();
  return <VerseGraph onClose={() => router.back()} initialSearch={initialSearch} />;
}
```

Opsiyon B ayrıca SEO'ya yarar — `?q=2:255` URL'i pre-render edilebilir crawl-friendly.

---

## Ek Bulgular

### Bulgu A — `?verse=` URL handler'ı VerseGraph'ta race condition'a yatkın

```jsx
// next/src/components/VerseGraph.jsx:2563
useEffect(() => {
  Promise.all([fetch('/verse-graph-bgem3.json'), fetch('/surah-clusters.json')])
    .then(([verseData, clusterData]) => {
      // ...
      const urlVerse = new URLSearchParams(window.location.search).get('verse');
      if (urlVerse) {
        // ... process ...
        const url = new URL(window.location.href);
        url.searchParams.delete('verse');
        window.history.replaceState({}, '', url);  // ← URL'i temizler
      }
    });
}, []);
```

URL'den `?verse=`i sildiği için **browser back ile geri gelirse query reset olur** — Senaryo 5 kapsamında bonus risk. `replaceState` doğru API (history entry değiştirmez) ancak param-preserve test edilmemiş.

### Bulgu B — `next/next.config.mjs`'te `scrollRestoration` opt-in yok

Next.js 16 App Router default'unda router navigation'larda scroll'u top'a alır. Homepage'e back ile dönerken kullanıcının önceki scroll position'a dönmesini garanti etmiyor. **Mevcut davranış nedir test edilmedi**; ancak `experimental.scrollRestoration` artık default behavior'da olduğundan büyük olasılıkla çalışıyor.

### Bulgu C — `useQuranNav.scrollToSection` `pushState` yapıyor

```js
// next/src/hooks/useQuranNav.js:75-90
const scrollToSection = useCallback((id) => {
  // ...
  window.history.pushState({ section: id }, '');  // ← her section scroll'u history entry ekler
  // ...
});
```

Homepage içi section nav'ları **history kirletiyor** — kullanıcı tool route'tan back basınca beklenmedik ara entry'lerle karşılaşır. `pushState` yerine `replaceState` veya hiç push etmemek daha temiz olur. **Risk: LOW** (etkilenenler section nav kullananlar; kontrol için Navbar'daki section linklerle test gerekir).

---

## Özet Tablosu

| # | Senaryo | Verdict | Risk |
|---|---------|---------|------|
| 1 | Homepage → tool → back → homepage | ✅ | LOW |
| 2 | Tool A → Tool B (cross-tool) → back | ⚠️ Event-dispatch state-overlay legacy | MED |
| 3 | Hard refresh → boş history → back | ⚠️ `router.back()` no-op | LOW |
| 4 | ReadingMode (`/oku/X`) → back | ❌ `router.push('/')` locale-broken + context loss | **HIGH** |
| 5 | searchParams preserve | ❌ `?q=` vs `?verse=` uyumsuz + route prop missing | **HIGH** |
| A | `?verse=` race / replaceState | ⚠️ untested | LOW |
| B | `scrollRestoration` config | ⚠️ untested | LOW |
| C | `scrollToSection` pushState | ⚠️ history kirletme | LOW |

---

## Önerilen Fix Sırası (Severity-Driven)

1. **HIGH — Senaryo 4** (1 dakikalık fix): İki `ReadingModeRoute.jsx`'i `router.back()` ile değiştir.
2. **HIGH — Senaryo 5** (15 dakika): `useQuranNav` `?q=` → `?verse=` veya route page.js'i `searchParams`'tan `initialSearch` okuyacak şekilde refactor et + `VerseGraphRoute` prop passthrough.
3. **MED — Senaryo 2** (1-2 saat): Cross-tool legacy event-dispatch pattern'larını `useQuranNav.openOverlay` çağrılarına migrate et. Etkilenen dosyalar:
   - `KiyametSahneleri.jsx`, `SunnetullahAtlasi.jsx`, `NefisMertebeleri.jsx`, `MeselAtlasi.jsx`, `ZamanBoyutlari.jsx`, `Melekler.jsx`, `WowFacts.jsx`, `ConceptGraph.jsx`, `WordPopover.jsx`, `IlkSonKelimeler.jsx`
   - `useQuranNav.js` `OVERLAY_ROUTES`'a eksik mapping varsa ekle (`exploreMenu`, `toolsMenu` halen scroll/menu pattern'ı; route migrate edilmemiş — ayrı bir audit gerek).
   - Navbar'daki bu event'ler için `useEffect` listener'lar (Navbar.jsx:326-406) **silinmeli** (artık dead code).
4. **LOW — Senaryo 3 + Bulgu C** (30 dakika): `useToolClose()` hook'u + `safeBack()` helper'ı + `scrollToSection` `pushState` davranışını gözden geçir.

---

result: 5 senaryo audit; 2 HIGH + 1 MED + 3 LOW sorun; 4 fix önerisi (Senaryo 4 immediate, Senaryo 5 short-term, Senaryo 2 cleanup, Bulgu C polish).
