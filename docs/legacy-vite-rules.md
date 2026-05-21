# Legacy Vite Implementation Rules — Archived

> **Bağlam:** Bu dosya CLAUDE.md'nin Vite + React SPA'ya özgü bölümlerini arşivler. `migration-to-next.js` branch'inde Next.js 15 App Router'a geçiş yapılıyor; aşağıdaki patternlar Next.js mimarisinde geçerli olmadığı için ana CLAUDE.md'den çıkarıldı. "Eskisini nasıl yapmıştık" referansı olarak — özellikle Faz 4 (Overlay → Route Dönüşümü) sırasında — kullanılabilir.
>
> **Arşivlenme tarihi:** 2026-05-21
> **Branch:** `migration-to-next.js`
> **Migration planı:** `tasks/todo_next.js_migration.md`
>
> **Çıkarılan bölümler:** §2 (Tech Stack), §5 (File Structure), §13.3 (Overlay Pattern), §13.4 (Navbar Integration), §13.12 (Cross-Tool Navigation), §15 (Kaynak Dizin Kuralı)

---

## 2. TECH STACK (Vite)

- **React 18 + Vite** (component-driven, lazy-loaded overlays)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Framer Motion** for scroll animations and transitions
- **React Context** for lightweight i18n (TR + EN)
- **Fonts:** KFGQPC + ShaykhHamdullah (Arabic), Inter (UI), Playfair Display (headings), Amiri (fallback)
- Fully responsive (mobile-first), static deploy (Netlify/Vercel)

> **KURAL — Arapça Font:** Kur'an metni için kullanılan tek font **KFGQPC** (King Fahd Complex, Kral Fahd Basımevi Uthmani fontu) olacaktır. `currentFont` değişkeni her zaman `"'KFGQPC', 'Amiri Quran', serif"` olarak kalmalıdır. İstisna: ReadingMode ve InterlinearView, `"'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif"` zincirini kullanır (bkz. CLAUDE.md §13.15). KFGQPC, api.acikkuran.com verisinin tasarlandığı fonttur ve tüm Kur'ani karakterleri (hareke, işaret, vaqf) eksiksiz destekler.

*Next.js'te:* React 19 + Next.js 15 + Tailwind v4 + Framer Motion + next-intl. Tech stack ayrıntıları için `tasks/todo_next.js_migration.md` Faz 1.

---

## 5. FILE STRUCTURE (Vite)

> **Kural:** Listeler statik değildir — dosya envanteri için `ls src/components/` / `ls src/sections/` kullan. Aşağıdaki harita yalnızca klasör **amaçlarını** belirtir.

```
qurancodex/
├── index.html, package.json, vite.config.js
├── public/                     # statik veri + medya
│   ├── *.json                  # section/tool veri dosyaları (addressees, kavimler, melekler, vs.)
│   ├── audio/                  # tilavet ses dosyaları
│   ├── icons/                  # SVG ikonlar
│   └── amthal/                 # meseller veri klasörü
├── src/
│   ├── main.jsx, App.jsx, index.css, tokens.js
│   ├── i18n/
│   │   ├── LanguageContext.jsx
│   │   ├── tr.json             # Türkçe tüm metinler — tek doğru kaynak
│   │   └── en.json             # İngilizce tüm metinler — tek doğru kaynak
│   ├── components/             # reusable + overlay/tool bileşenleri
│   │   ├── (temel)  Navbar · Hero · Footer · SectionWrapper · ParticleBackground
│   │   ├── (okuma)  ReadingMode · InterlinearView · ChapterProgress
│   │   ├── (atlas)  KissaAtlas · KavimlerAtlasi · DogaAtlasi · MeselAtlasi · FurukAtlasi · MunasebatAtlasi · ProphetAtlas · KiraatAtlasi
│   │   ├── (graf)   VerseGraph · ConceptGraph · DiyalogAgi · RevelationTimeline · SurahComparator · WordHeatmap
│   │   └── (diğer)  AddresseeSystem · CennetCehennem · DuaVerses · EsmaFrekans · KiyametSahneleri · KuranRenkleri · KuranRetorigi · KuranYeminleri · Melekler · QuranCommands · SebebiNuzul · ToolsBrowser · WowFacts · ZamanBoyutlari · …
│   ├── sections/               # ana sayfa section bileşenleri (Hero altındaki scroll-story)
│   │   └── MathMiracle · LinguisticDNA · ImpossibleRhythm · SoundArchitecture · HiddenArchitecture · ScientificSigns · HistoricalProof · LivingPreservation · ZeroRedundancy · Highlights · AllTopics · ToolsHighlight · ToolsShowcase · PathCards · ProphetMap · PsychologySection · QuranDua · QuranRhetoric · HumanDefinition · Conclusion
│   └── utils/                  # cleanArabic, tajweed, pathContext, vs.
├── docs/reviews/               # denetim raporları (content, UX, visual, source)
├── tasks/                      # todo.md, lessons.md (çalışma notları)
└── CLAUDE.md                   # bu dosya
```

**Önemli:**
- `src/i18n/*.json` tüm marketing / içerik metninin **tek doğru kaynağıdır**. Section bileşenleri bu JSON'ları `t('...')` ile okur. CLAUDE.md içerik kopyası tutmaz.
- Her yeni overlay/tool `src/components/` altına gelir, `src/sections/` yalnızca ana sayfa scroll-story blokları içindir.
- Veri dosyalarının tam şeması için CLAUDE.md §13.9 "Yeni JSON Data Dosyası Kuralı"na bakın.

*Next.js'te:* `next/src/app/[locale]/...` (route-based), `next/src/components/`, `next/src/lib/`, `next/src/data/`. Yeni layout için `tasks/todo_next.js_migration.md` Faz 1.

---

## 13.3 Overlay / Tool Bileşeni Pattern (Vite)

Her yeni tool overlay'i aynı iskelet ile başlar:

```jsx
import { OVERLAY_BASE, FONTS, COLORS } from '../tokens';

export default function YeniArac({ onClose }) {
  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={OVERLAY_BASE} role="dialog">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 24px', borderBottom:`1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)', flexShrink:0 }}>
        ...
        <button onClick={onClose}>×</button>
      </div>
      {/* Body */}
    </div>
  );
}
```

- Tüm overlay'ler `position:fixed, inset:0, zIndex:9999`
- Header: `padding: 16px 24px`, altın bordür, yarı saydam arka plan
- Escape ile kapanma zorunlu
- Close butonu sağ üstte, daima mevcut

*Next.js'te:* Bu pattern artık geçerli değil — her tool full-page route'a (`app/atlas/...`, `app/arac/...`) dönüşür. `onClose` yerine `router.back()` veya `<Link href="/">`. `OVERLAY_BASE` (`position:fixed inset:0`) yerine layout-based container. Escape handler kaldırılır. CLOSE_BTN / OVERLAY_TITLE token'ları yine modal/dialog component'lerinde (örn. settings modal, search) kullanılabilir.

---

## 13.4 Navbar Entegrasyon Pattern (Vite)

Yeni bir tool eklenirken sıra:

1. `const YeniArac = lazy(() => import('./YeniArac'))` — üste lazy import
2. `const [yeniOpen, setYeniOpen] = useState(false)` — state
3. `anyOpen` satırına `|| yeniOpen` ekle
4. `popstate` handler'ına `if (yeniOpen) { setYeniOpen(false); return; }` ekle
5. `tools` array'ine yeni obje ekle (labelTr, labelEn, descTr, descEn, icon, action)
6. `vizTools` veya `researchTools` array'ini güncelle (dropdown için)
7. JSX'in sonuna `{yeniOpen && <Suspense fallback={null}><YeniArac onClose={() => setYeniOpen(false)} /></Suspense>}` ekle

*Next.js'te:* State-based overlay açma tamamen ortadan kalkar — Navbar `<Link to="/atlas/kissa">` ile gerçek navigation kullanır. `popstate` handler'ları gereksiz (App Router yönetir). `tools` array'i yine bir registry olarak kalabilir ama `action` callback yerine `href` taşır.

---

## 13.12 Cross-Tool Navigasyon Kuralı — Back Navigation (Vite)

Bir tool başka bir overlay'i açtığında (örn. ConceptGraph → VerseGraph), back butonu direkt kaynak tool'a dönmelidir.

**Event dispatch pattern:**
```js
window.dispatchEvent(new CustomEvent('openVerseGraph', {
  detail: { search: `${surah}:${ayah}`, returnToConcept: true },
}));
onClose(); // kaynak tool kapanır
```

**Navbar popstate handler** `returnToConcept` veya `returnToWow` true iken VerseGraph'ın iç navigasyonunu (clusters view) atlar:

```js
if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow) {
  graphBackRef.current(); // VerseGraph iç nav
} else {
  setGraphOpen(false);
  if (graphReturnToConcept) { setGraphReturnToConcept(false); setConceptOpen(true); }
  if (graphReturnToWow)     { setGraphReturnToWow(false);     setWowOpen(true); }
}
```

- ❌ YANLIŞ: `if (graphBackRef.current)` — iç nav her zaman tetiklenir, kullanıcı 2 kez back basmak zorunda kalır
- ✅ DOĞRU: `if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow)`

*Next.js'te:* `window.dispatchEvent` pattern'ı kaldırılır. Cross-tool navigasyon `router.push('/graf/ayet?q=2:255&from=concept')` ile yapılır. Back için browser geçmişi (`router.back()`) doğal olarak doğru sayfaya döner — manual returnTo* state'leri gereksiz. Origin tracking gerekirse `?from=...` query param'ı ile aktarılır.

---

## 15. KAYNAK DİZİN KURALI (Vite)

**Proje kökü:** `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/`

**Tüm kaynak dosyalar proje kökündeki `src/` dizininde bulunur.**

```text
01_qurancodex/
├── src/          ← ASIL KOD BURADADIR (git tracked, vite serves this)
├── public/       ← statik veri + medya
├── docs/         ← denetim raporları (docs/reviews/)
├── tasks/        ← todo.md, lessons.md
├── CLAUDE.md     ← bu dosya
└── vite.config.js
```

- ✅ Düzenlenecek: `src/components/...`, `src/sections/...`, `src/i18n/...`
- Dev server: `npm run dev` proje kökünden çalıştırılır
- Git repo: proje kökündeki `.git`

*Next.js'te:* Yeni dizin yapısı paralel kurulur — `next/` klasörü altında Next.js projesi. Migration tamamlandığında Vite kodu `legacy-vite/` altına arşivlenir. Yeni layout için `tasks/todo_next.js_migration.md` Faz 1.
