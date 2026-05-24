# QuranCodex Next.js Migration — UX/Fonksiyonellik Denetimi (2026-05-24)

Denetçi: qc-ux-auditor
Kapsam: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/` — Next.js (App Router, `[locale]` URL-prefix routing) migration sonrası hali.
Tarandı: 181 jsx/js dosyası, 38 route, 50+ tool component, middleware, i18n dictionaries.

---

## Özet

Migration genel olarak iyi tasarlanmış — locale routing, `generateStaticParams`, tool route'ları, JSON-LD schemas, hreflang alternates yerinde. Ama **route'lardan overlay-event sistemine geçiş yarım kalmış**: aynı app içinde iki paralel navigation sistemi çalışıyor (route push + window CustomEvent), çoğu yerde tutarsız hâlde. ReadingMode SSR-safety değil. Tüm tool route'larının back-button davranışı kullanıcıyı siteden atıyor. Footer mega-menüsünde 50+ tool'un sadece 21'i listeli.

**Kritik: 7 · Önemli: 11 · İyileştirme: 9**

---

## 🔴 Kritik (Bozuk / çalışmıyor)

### K1. Tüm tool route'larında `router.back()` direct-link kullanıcısını siteden çıkarıyor

**Dosya:** 36 route wrapper'ının HEPSİ — örn:
- `next/src/app/[locale]/atlas/kissa/KissaAtlasRoute.jsx:13`
- `next/src/app/[locale]/arac/wow/WowFactsRoute.jsx:8`
- `next/src/app/[locale]/graf/ayet/VerseGraphRoute.jsx:12`
- (+ 33 diğer route)

**Senaryo:** Kullanıcı Twitter / Google / WhatsApp paylaşımından `/tr/atlas/kissa` URL'sine direkt geliyor. Sayfada ✕ butonuna basıyor. `router.back()` browser history'de ilk sayfaya dönmek yerine **referrer'a (Twitter / Google) geri gider**. Eğer hiç referrer yoksa (yeni tab), back butonu hiç çalışmıyor; sayfa açık kalır.

**Doğru pattern:**
```jsx
const router = useRouter();
const { language } = useLanguage();
return <Tool onClose={() => router.push(`/${language}`)} />;
```

`oku/[surah]/ReadingModeRoute.jsx:8`'de `router.push('/')` (locale-aware değil) kullanılıyor — bu da **inconsistent**: `oku/page.js` (no surah) ile `oku/[surah]/page.js` farklı close davranışı veriyor.

---

### K2. ReadingMode SSR'da `localStorage` çağırıyor → hidrasyon mismatch + console error

**Dosya:** `next/src/components/ReadingMode.jsx:933, 938, 943, 950, 1012, 1016, 1020, 1024, 1040, 1058, 1069, 1075, 1112, 1119, 1125, 1130, 1138, 1146, 1152` (en az 19 yerde useState initializer'da `localStorage.getItem`)

**Sorun:** ReadingMode `'use client'` direktifi taşıyor ama bu, Next.js'in onu SSR aşamasında HTML çıktısına render etmesini engellemiyor (RSC değil ≠ SSR'da skip). useState'in lazy initializer'ları **server'da bir kez çalışır**. `localStorage` server'da `undefined` → try/catch tüm error'ları yutuyor → fallback değer (örn. surah 1) HTML'e gömülür. Client mount edince localStorage'tan gerçek değer (örn. surah 36) gelir → **React hidrasyon mismatch warning** + ekran 1 frame flicker.

**ReadingMode'un sarıldığı route:** `oku/ReadingModeRoute.jsx` `'use client'` ama `dynamic({ ssr: false })` kullanmıyor.

**Karşılaştırma:** Aynı pattern VerseGraph / KiraatAtlasi / ProphetAtlas / KavimlerAtlasi için `dynamic ssr: false` kullanılmış (4 route). ReadingMode bu 4 route ile aynı kategoriye giriyor (heavy localStorage state) ama treatment farklı.

**Doğru pattern:** `oku/ReadingModeRoute.jsx`'i `dynamic(() => import(...), { ssr: false })` ile sar. Veya localStorage okuma `useEffect` içine taşı, initial state `null`/`undefined` olsun.

---

### K3. `oku/page.js` metadata title `"Kur"` — kesik string

**Dosya:** `next/src/app/[locale]/oku/page.js:7`
```js
const TITLE = 'Kur';
```

**Sorun:** Muhtemelen `"Kur'an'ı Oku"` apostrof escape hatası nedeniyle truncate olmuş. `pageMetadata` bu değeri `<title>`, OpenGraph, Twitter card metadata'sına geçiriyor → **Google sonuçlarında ve sosyal medya kartlarında "Kur" gözüküyor**.

**Doğru:** `const TITLE = "Kur'an'ı Oku";` (`'` yerine `"` ile string)

---

### K4. `oku/[surah]/page.js` geçersiz sure numarasında `notFound()` çağırmıyor

**Dosya:** `next/src/app/[locale]/oku/[surah]/page.js:38-67`

**Sorun:** `s < 1 || s > 114` veya `NaN` durumunda `valid = false` set ediliyor, title "Sure Bulunamadı" yapılıyor ama page yine render ediliyor. `<ReadingModeRoute initialSurah={undefined} />` → ReadingMode fallback olarak Fâtiha (1) yükler. Kullanıcı `/tr/oku/999` URL'sini görür → Fâtiha okuyor, ama metadata'da "Sure Bulunamadı" yazıyor. **404 fırlatması eksik.**

**Doğru:**
```js
import { notFound } from 'next/navigation';
if (!valid) notFound();
```

---

### K5. `app/` dizininde `not-found.js`, `loading.js`, `error.js` HİÇ YOK

**Tarama:** `find next/src/app -name "not-found.*" -o -name "loading.*" -o -name "error.*"` → çıktı boş.

**Etki:**
- Geçersiz route → Next.js'in **varsayılan** 404 (locale-aware değil, EN ham metin, tasarım dışı)
- Runtime error → ham React error boundary çıktısı, kullanıcıya "Application error" mesajı
- Heavy route load (VerseGraph 3D, KiraatAtlasi audio) sırasında loading state yok — beyaz/boş ekran

**Önerilen:**
- `next/src/app/[locale]/not-found.js` — site temasına uygun 404 (gold + cosmic black)
- `next/src/app/[locale]/error.js` — error boundary, retry CTA
- `next/src/app/[locale]/graf/loading.js`, `atlas/loading.js`, `arac/loading.js` — gold spinner / skeleton
- `next/src/app/[locale]/oku/[surah]/loading.js` — mushaf-tarzı skeleton

---

### K6. `ToolsShowcase` "Keşfet / Araçlar" butonları ÖLÜ

**Dosya:** `next/src/sections/ToolsShowcase.jsx:26, 30`
```js
const openExplore = () => openOverlay('exploreMenu');
const openTools   = () => openOverlay('toolsMenu');
```

**Sorun:** `useQuranNav.openOverlay` artık route push yapıyor. `OVERLAY_ROUTES` haritasında `exploreMenu` ve `toolsMenu` key'leri **YOK** (`hooks/useQuranNav.js:20-65`). Çağrı yapılınca:
```js
console.warn('useQuranNav.openOverlay: unknown overlay "exploreMenu"');
return;  // hiçbir şey yapmaz
```

**Vite'te:** `dispatchEvent('openExploreMenu')` → Navbar dropdown açardı.
**Next.js'te:** Çağrı sessizce başarısız. Buton tıklanır ama hiçbir şey olmaz.

**Doğru çözüm:** `OVERLAY_ROUTES`'a `exploreMenu` ve `toolsMenu` eklemek anlamsız (mega-menu route değil, dropdown'dur). `useQuranNav`'a `openMenu(name)` ayrı bir helper eklenmeli, ya da bu butonlar event dispatch'e geri dönmeli — Navbar zaten `openExploreMenu` / `openToolsMenu` listener'ı tutuyor (`Navbar.jsx:304-314`).

---

### K7. ConceptGraph / WowFacts / IlkSonKelimeler içinde cross-tool nav hâlâ `dispatchEvent` ile yapılıyor

**Dosyalar:**
- `next/src/components/ConceptGraph.jsx:757-763` — `dispatchEvent('openVerseGraph')`
- `next/src/components/WowFacts.jsx:577` — `dispatchEvent('openVerseGraph')`
- `next/src/components/VerseGraph.jsx:2581, 2664, 2675` — `dispatchEvent('openReadingMode')`
- `next/src/components/IlkSonKelimeler.jsx:624` — `dispatchEvent('openTafsirPanel')`
- `next/src/components/SunnetullahAtlasi.jsx:710` — `dispatchEvent('openKavimlerAtlasi')`
- `next/src/components/NefisMertebeleri.jsx:382` — `dispatchEvent('openMunafikProfili')`

**Senaryo:** Kullanıcı `/tr/graf/kavram`'da. ConceptGraph içinden bir ayete tıklıyor → `dispatchEvent('openVerseGraph')`. Navbar bu event'i yakalar (`Navbar.jsx:275-286`), `setGraphOpen(true)` ile **overlay olarak** açar.
- URL hâlâ `/tr/graf/kavram` → URL ile state inconsistent
- Browser back tuşu önce overlay'i kapatır, ama URL hâlâ `/tr/graf/kavram` → ConceptGraph state taze değil
- Bu URL'i paylaşırsa kimse VerseGraph'ı göremez

**Doğru çözüm:** Tüm cross-tool jump'lar `router.push(\`/${locale}/graf/ayet?verse=2:255\`)` olarak değiştirilmeli.

---

## 🟡 Önemli (Tutarsız / zorlayıcı)

### Ö1. Navbar'da 34 adet ölü overlay state + lazy import

**Dosya:** `next/src/components/Navbar.jsx:200-249, 1310-1589`

**Sorun:** Migration sonrası tool'lar route'a dönüştü ama Navbar hâlâ:
- 34 `useState` overlay open/close state
- 34 `lazy()` import
- 34 conditional `{xOpen && <X onClose={...} />}` render bloğu
- 34 event listener (`openX` event'leri için)

Bu state'ler artık `TOOL_ROUTES` route push üzerinden açılmıyor (dropdown'lar route'a navigate ediyor) ama:
1. Cross-tool event'ler (K7'deki) hâlâ Navbar listener'ları üzerinden overlay açıyor — yarı çalışıyor
2. Cross-tool listener'lar (`openCennetCehennem`, `openKavimlerAtlasi`, vb.) hâlâ kayıtlı (`Navbar.jsx:324-403`)
3. 1592 satırlık component — bakım yükü astronomik

**Önerilen:** Cross-tool nav router-push'a çevrildikten sonra (K7 çözümü) tüm overlay state + render blok + event listener'lar silinebilir. Navbar ~500 satıra iner.

---

### Ö2. Tool route'larında PageHeading ile overlay header çakışıyor

**Dosya:** Tüm tool route page.js'ler — örn. `atlas/kissa/page.js:25-26`

```jsx
<PageHeading title={...} description={...} />
<KissaAtlasRoute />
```

`PageHeading` sr-only — görsel olarak yok ama DOM'da var. `KissaAtlasRoute` ise `position: fixed; inset: 54px 0 0 0; z-50` ile ekranı kaplıyor. Sorun değil — sadece **JSON-LD breadcrumb tasarımdan farklı** (kullanıcıya navigation breadcrumb yok). Mobile kullanıcısı "burada nerede olduğumu nasıl anlarım?" der.

**Önerilen:** Görsel breadcrumb (Ana > Atlas > Kıssa Atlası) header tarafına eklenebilir.

---

### Ö3. SurahPagination sr-only — kullanıcıya görünür sure navigasyonu yok

**Dosya:** `next/src/components/SurahPagination.jsx:36`

```jsx
<nav aria-label="..." style={SR_ONLY}>
```

**Sorun:** /oku/[surah] route'unda kullanıcı önceki/sonraki sureye geçmek istiyor. SurahPagination sr-only — sadece screen reader/Googlebot için. ReadingMode kendi internal next/prev butonlarını taşıyor ama:
- URL değişmiyor (state üzerinden surah switch yapıyor olabilir)
- Bookmarklenamiyor, paylaşılamıyor

**Karşılaştırma:** Sitemap'te 228 surah route'u var ama kullanıcı arasında sure navigasyonu hâlâ "internal" — SEO için harika, UX için tutarsız.

**Önerilen:** SurahPagination'ı görünür yap (en azından mobilde footer link olarak) veya ReadingMode internal nav'ı `router.push(\`/oku/${nextSurah}\`)`'e bağla.

---

### Ö4. SurahPagination'da İngilizce locale için sure adları hâlâ TÜRKÇE

**Dosya:** `next/src/components/SurahPagination.jsx:29-31`
```js
const prevName = prev ? SURAH_NAMES_TR[prev - 1] : null;
const nextName = next ? SURAH_NAMES_TR[next - 1] : null;
const currentName = SURAH_NAMES_TR[s - 1];
```

İngilizce kullanıcıya "Read previous surah: Bakara (Surah 2)" gösteriliyor — TR adı. EN için `SURAH_NAMES_EN` veya transliteration yok.

---

### Ö5. Footer "Sayfaları Keşfet" navigasyonu eksik — sadece 20 tool listeli

**Dosya:** `next/src/components/Footer.jsx:7-94`

20 link var: Atlas (5), Graf (5), Araçlar (5), Sureler (5+1=6) — Kuşkulu kalanlar: iblisSatan, ilkSon, kadinlar, melekler, retorik, esma, addressee, commands, comparator, diyalog, semantik, furuk, munasebat, munafik, nefis, sunnetullah, zaman-boyutlari, cennet-cehennem, kiyamet, sebebi-nuzul, kavramAgi, mesel, doga ... 

Mevcut Site Map ile karşılaştırma (route'lar): 38 tool route var ama Footer'da sadece **20 link var**. **Yaklaşık 18 tool keşfedilemiyor.** SEO açısından da internal-linking eksik.

**Önerilen:** Tüm 38 route'u listele veya `/arac/tum-araclar` linkini Featured yap.

---

### Ö6. Tools mega-menüsünde IblisSatan + IlkSonKelimeler YOK

**Dosya:** `next/src/data/tools.jsx` — 20 event entry'si, ama `openIblisSatan` ve `openIlkSonKelimeler` YOK.

**Karşılaştırma:** `Navbar.jsx:632-654`'teki `TOOL_ROUTES` map'inde her ikisi de var (21 entry). Tools mega-menüsünde 20, route map'inde 21 — **bilinçli tutarsızlık mı kaza mı belirsiz**. Ölü buton oluşmuyor (TOOL_ROUTES navigate edilebilir route'lar için tek truth), ama discovery yüzeyleri arasında tutarsızlık.

---

### Ö7. Navbar overlay history hijyeni — 36 dependency'li useEffect

**Dosya:** `next/src/components/Navbar.jsx:429-450, 461-586`

`anyOpen` hesabı 33 state'i OR'larken `useEffect` dependency array da 33 state. Her overlay state değişiminde effect re-run + popstate handler re-register. Tek bir overlay state değişimi 33 dependency'li bir array değişimi tetikliyor — perf sızıntısı.

**Önerilen:** Bu 33 state'i tek bir `activeOverlay: 'X' | null` enum state'ine konsolide et veya overlay event sistemi tamamen söküldükten sonra useEffect silinir.

---

### Ö8. Mobile menu — 50+ tool tek liste, kategori başlığı yok

**Dosya:** `next/src/components/Navbar.jsx:1293-1303`
```jsx
{[...vizTools, ...analysisTools, ...researchTools].map(tool => (
```

Mobile'da kategori divider'ı yok — kullanıcı 20+ tool'u bir tek scroll'da görüyor. Desktop'ta 3 kategoriye ayrı sütun ama mobile'da hepsi tek liste.

---

### Ö9. `ReadingMode` route'una `dynamic({ ssr: false })` uygulanmamış (K2 ile aynı sorun)

**Dosya:** `next/src/app/[locale]/oku/ReadingModeRoute.jsx:1-9`

Performans + SEO için `dynamic(() => import('@/components/ReadingMode'), { ssr: false, loading: () => <ReadingSkeleton /> })` olmalı. Şu an SSR'da 9511 satırlık ReadingMode render edilmeye çalışıyor — server CPU yakıyor + hidrasyon mismatch riski.

---

### Ö10. i18n EN dictionary lazy load — initial paint'te 50-100ms TR fallback flash

**Dosya:** `next/src/i18n/LanguageContext.jsx:33-40`

```js
useEffect(() => {
  if (language === 'en' && translations.en === null) {
    import('./en.json').then(...);
  }
}, [language]);
```

**Senaryo:** Kullanıcı doğrudan `/en/atlas/kissa` URL'sine girince:
1. Server `initialLocale = 'en'` HTML render — ama `translations.en === null`, `t()` TR fallback döner
2. Client mount → useEffect → en.json fetch (~50-100ms)
3. EN dict yüklenince re-render → tüm metinler TR'den EN'e flick

**Önerilen:** `[locale]/layout.js` `'en'` locale ise `import('@/i18n/en.json')`'u server-side yap, `initialLocale` prop'unun yanında dict de geç. (`SUPPORTED_LOCALES`'in tek source'tan import edilmesi).

---

### Ö11. Aria/dialog role 12 component'te var, 38 component'te yok

**Dosya:** Sadece 12 component `role="dialog"` taşıyor (KuranRenkleri, DiyalogAgi, KiyametSahneleri, ReadingMode, IblisSatan, FurukAtlasi, MunasebatAtlasi, ToolStub, ToolsBrowser, EsmaFrekans, Melekler, SebebiNuzul). Diğer 38+ overlay component (KissaAtlas, KavimlerAtlasi, ConceptGraph, VerseGraph, WowFacts, AddresseeSystem, …) `role="dialog"`, `aria-modal="true"`, `aria-labelledby` yok.

Screen reader kullanıcısı bu tool'lara girince dialog context'i alamıyor.

---

## 🟢 İyileştirme önerileri

### İ1. Locale switcher direkt URL replace — query string kaybı

**Dosya:** `LanguageContext.jsx:60-65`
```js
const swapped = pathname.replace(/^\/(tr|en)/, `/${next}`);
router.push(swapped);
```

Query param (`?verse=2:255`) ve hash kaybediliyor. `useSearchParams` ile birleştir:
```js
const params = useSearchParams();
const qs = params.toString();
router.push(qs ? `${swapped}?${qs}` : swapped);
```

---

### İ2. Hero CTA "Keşfe Başla" → path-cards section'a smooth scroll

Doğru, ama `id="path-cards"` `SectionWrapper` içinde — eğer SSR'da JS henüz hidrate olmadıysa CTA tıklanırsa `scrollIntoView` çalışır ama yumuşak değil hard jump olabilir. Tailwind `scroll-mt-*` ile section'a margin verilirse navbar overlap önlenir.

---

### İ3. ReadingMode'da `useEffect` ile localStorage write 19+ kez

Her state değişiminde `localStorage.setItem` ayrı useEffect — toplam 19 useEffect'le write. Bir reducer + tek write effect ile konsolide edilebilir.

---

### İ4. `useQuranNav.openOverlay('graph', { search: '2:255' })` → `?q=2:255` ama VerseGraph `?verse=2:255` okuyor

**Dosya:**
- `next/src/hooks/useQuranNav.js:108` push'larken `?q=` kullanıyor
- `next/src/components/VerseGraph.jsx:2574` ise `?verse=` okuyor

Kullanım hâli mevcut çağrılarda görülmedi (hiç `search` payload geçilmemiş) ama mismatch riski. Tek bir parametre adına standardize edilmeli.

---

### İ5. Middleware'de Accept-Language redirect — ilk kez giren TR kullanıcısı için 1 ekstra round-trip

`/atlas/kissa` → 307 redirect → `/tr/atlas/kissa`. Bu Vercel/CDN cache'leniyorsa OK ama her sıfırdan ziyaret 1 hop daha.

---

### İ6. Hero alt scroll indicator → "Scroll" yazısı kapalı

`Hero.jsx:139-141` text-gold/25 (alpha 0.25) — okunmaz seviyede. WCAG AA için min %3:1 oranı gerekli — bu kontrast %1'in altında.

---

### İ7. Tüm tool component'lerinde Escape key handler eksik

Sadece 11 component'te `Escape` keydown handler var (`grep "key === 'Escape'"` ile). Diğer 27 tool'da Escape ile kapama yok. Bazıları Navbar'ın global popstate handler'ına güveniyor ama bu sadece state-based, doğrudan onClose tetiklemiyor.

---

### İ8. Footer mobile — `columns-1 md:columns-2` sources liste mobilde alt alta dağılıyor

`Footer.jsx:165` `columns-1 md:columns-2` — OK ama her source mobile'da ayrı sütun değil tek sütun. break-inside-avoid var ama uzun source isimleri scroll yapıyor.

---

### İ9. CHAPTERS array'i `next/src/components/ChapterProgress.jsx:7-20` ve `navSections` array'i `next/src/components/Navbar.jsx:66-186` — duplicate "section ID + label" listesi

İki yerde manuel olarak senkronize edilmiş. Birinde değişirse diğeri stale kalır. Tek source'a (data/sections.js) çekilmeli.

---

## ✅ İyi yapılmış

1. **Middleware locale routing** (`middleware.js:26-49`) — Accept-Language fallback + matcher ile static asset bypass. Default `tr` net.
2. **`generateStaticParams` 114 surah pre-render** (`oku/[surah]/page.js:11-15`) — build-time'da 228 statik HTML (TR + EN).
3. **SEO helper `pageMetadata`** (`lib/seo.js`) — canonical + hreflang alternates otomatik. her route minimal kod ile schema kazanıyor.
4. **JSON-LD breadcrumb + Article + LearningResource** (`lib/jsonld.js`) — site-genel + per-route schema yerinde.
5. **OVERLAY_BASE token sistemi** (`tokens.js:177-225`) — z-index/inset/header standartize. Tüm tool'lar aynı görsel chrome.
6. **PathContext SSR-safe storage helpers** (`contexts/PathContext.jsx:64-108`) — `typeof window === 'undefined'` guard'ları doğru.
7. **`useAudioWithFallback` 6-reciter CDN chain** (`hooks/useAudioWithFallback.js:34-61`) — fallback mantığı sağlam.
8. **Navbar `hideOnReadingMode` regex** (`Navbar.jsx:194`) — /oku route'larında Navbar gizlenir, ReadingMode kendi navigation chrome'u taşır.
9. **`LanguageContext` `<div lang={language}>` wrapper** (`LanguageContext.jsx:83`) — CSS `text-transform: uppercase` lokale bağlı (TR-İ vs EN-I sorunu çözülmüş).
10. **Locale-aware `Link href={\`/${language}${item.href}\`}`** Footer'da tutarlı (`Footer.jsx:146`) — locale prefix korunuyor.

---

## Konu-konu bulgular

### 1. Cross-route navigation

| Senaryo | Durum |
|---------|-------|
| Navbar mega-menu (Keşfet) → route push | ✅ Çalışıyor (`Navbar.jsx:801`) |
| Navbar Araçlar → route push | ✅ Çalışıyor (TOOL_TRIGGERS) |
| Tool close → router.back() | ❌ Direct-link'te siteden çıkarır (K1) |
| Cross-tool jump (ConceptGraph→VerseGraph) | ❌ dispatchEvent ile overlay açılır, URL'ye yazılmaz (K7) |
| URL changes per tool | ✅ Her tool unique path (`/atlas/X`, `/graf/X`, `/arac/X`) |
| Browser back/forward | ⚠️ Tool route'unda OK, overlay-içi (K7 nedeniyle) belirsiz |
| openExploreMenu / openToolsMenu | ❌ ÖLÜ (K6) |
| openReadingMode event → /oku push | ✅ Çalışıyor (`Navbar.jsx:291-302`) |

### 2. Locale switcher

| Senaryo | Durum |
|---------|-------|
| `/tr/atlas/kissa` → toggle → `/en/atlas/kissa` | ✅ regex swap (`LanguageContext.jsx:61`) |
| Query string preservation | ❌ kayıp (İ1) |
| Default locale (boş URL) | ✅ Accept-Language fallback `tr` |
| Middleware redirect | ✅ Doğru |
| `document.documentElement.lang` sync | ✅ `LanguageContext.jsx:43` |

### 3. Reading Mode

| Özellik | Durum |
|---------|-------|
| 6 reciter audio playback | ✅ |
| Karaoke word highlight | ✅ |
| Page turn (sağ/sol) | ✅ ReadingMode internal nav |
| Tafsir panel toggle | ✅ |
| Interlinear translation toggle | ✅ |
| Surah navigation (next/prev) | ⚠️ İçeride state-based, URL değişmiyor (Ö3) |
| `?ayah=X` query param | ✅ `pendingScrollAyah` (`ReadingMode.jsx:1030`) |
| Geçersiz surah (`/oku/200`) | ❌ Fâtiha'ya düşer, notFound yok (K4) |

### 4. State persistence

| Konu | Durum |
|------|-------|
| localStorage settings hydration | ❌ SSR'da localStorage `undefined` → mismatch (K2) |
| sessionStorage (PathContext) | ✅ guard'lı |
| Sayfa scroll position | ⚠️ Tool route'a girince scroll restore yok; geri dönünce homepage top'a düşer |
| Reciter / font size / dayMode persist | ✅ localStorage |

### 5. Modal/dialog hijyeni (CLAUDE.md §13.16)

| Kural | Durum |
|------|-------|
| Body scroll lock | ✅ ReadingMode (`ReadingMode.jsx:1001-1010`), Navbar mobileMenu (`Navbar.jsx:453-458`) |
| Single scrollbar | ⚠️ Tool route'larında PageHeading + overlay birlikte; `body overflow: hidden` overlay-içi var ama route header yok |
| Body overflow restoration on close | ✅ useEffect cleanup |
| `<html>` overflow lock | ✅ ReadingMode'da |

### 6. Mobile responsive (CLAUDE.md §14)

| Tool | 390px durumu |
|------|-------------|
| Hero | ✅ clamp + responsive tailwind |
| Navbar mobil drawer | ✅ z-10001, slide-in, body lock |
| ReadingMode | ✅ isMobile (BREAKPOINT_MOBILE 640) |
| Tool overlay header chip row | ⚠️ Spesifik dosyalara bakılmadı, sample KissaAtlas mobile-aware görünüyor |
| Mobile menu kategori divider | ❌ tek liste (Ö8) |
| Tap target min 44×44 | ✅ Navbar close 44×44 (`Navbar.jsx:1219`) |

### 7. Empty/loading/error states

| State | Durum |
|------|-------|
| `loading.js` | ❌ HİÇ YOK (K5) |
| `not-found.js` | ❌ HİÇ YOK (K5) |
| `error.js` | ❌ HİÇ YOK (K5) |
| Tool internal loading (örn KissaAtlas spinner) | ✅ var (`KissaAtlas.jsx:149`) |
| API fallback (acikkuran down) | ⚠️ Try/catch silent, kullanıcıya feedback yok |
| Invalid surah `/oku/200` | ❌ Fâtiha fallback (K4) |

### 8. Klavye/Erişilebilirlik

| Test | Durum |
|------|-------|
| Tab navigation | ⚠️ Genel OK, ama tool'larda focus trap eksik |
| Focus visible | ✅ Tailwind default + bazı componentlerde explicit |
| Escape modal close | ⚠️ Sadece ~30% tool'da explicit (İ7) |
| `aria-label` | ✅ 66 yerde |
| `role="dialog"` | ❌ 12/50 tool'da var (Ö11) |
| `aria-modal="true"` | ❌ Hiç yok |
| `aria-labelledby` | ❌ Hiç yok |
| `dir="rtl"` Arapça'da | ✅ Footer + Arapça bloklar |

### 9. Footer "Sayfaları Keşfet" navigasyonu

| Kontrol | Durum |
|---------|-------|
| Next.js `<Link>` kullanımı | ✅ `Footer.jsx:145` |
| Locale-aware href | ✅ `/${language}${href}` |
| 4 sütun desktop (lg:grid-cols-4) | ✅ |
| Mobile 1 sütun (grid-cols-1) | ✅ |
| Tam tool coverage | ❌ Sadece 20/38 (Ö5) |
| ARIA `aria-label={exploreHeading}` | ✅ |

### 10. i18n switching

| Test | Durum |
|------|-------|
| Dil değişimi tüm UI etkilenir | ⚠️ EN ilk yüklemede 50-100ms TR flash (Ö10) |
| Arapça ayet sabit | ✅ `verseAr` locale-independent |
| Türkçe karakter `text-transform` doğru | ✅ `<div lang={language}>` wrapper |
| URL locale routing tutarlı | ✅ `/tr/...` veya `/en/...` |
| `hreflang` tags | ✅ `lib/seo.js:14-15` `alternates.languages` |

---

## Sonuç ve öncelik sırası

**1. acil — direct-link UX kıran kritik:**
- K1 (router.back her yerde — siteyi terk ediyor)
- K3 (TITLE = 'Kur')
- K5 (not-found/error/loading hiç yok)

**2. acil — fonksiyonellik:**
- K6 (ToolsShowcase ölü buton)
- K7 (cross-tool dispatchEvent — URL inconsistent)
- K4 (geçersiz surah → notFound çağırılmalı)

**3. orta vade — SSR/perf:**
- K2 (ReadingMode SSR localStorage)
- Ö9 (ReadingMode dynamic ssr:false)
- Ö1 (Navbar 1592 satır + 34 ölü state — temizlik)

**4. düşük — UX polish:**
- Ö4 (SurahPagination EN sure isimleri)
- Ö5 (Footer 38 tool listele)
- Ö11 (dialog ARIA)
- İ6 (scroll indicator kontrastı)

Migration mimari olarak sağlam ama "yarı-geçiş" durumunda — eski event sistemi yan yana yaşıyor ve route güvenliği (back, 404) eksik. Bu 7 kritik bulgu çözüldükten sonra Navbar ve cross-tool event sistemi tamamen temizlenebilir, kod tabanı ~1500 satır küçülür.
