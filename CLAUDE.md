# KUR'AN-I KERİM'İN GÖRÜNMEYEN MİMARİSİ
## Comprehensive Website Design Document

---

## 1. PROJECT VISION

A mesmerizing, cinematic single-page website that reveals the hidden architecture of the Quran through an immersive storytelling journey. The website transforms dense academic research into breathtaking visual narratives that make visitors say "wow" at every scroll.

**Core Philosophy:** This is NOT a lecture. It's a revelation. Each section peels back another layer of an invisible design that has been hiding in plain sight for 1,400 years. The visitor doesn't just read information - they experience discovery.

**Narrative Arc:** The website follows a deliberate emotional journey:
1. **Wonder** (Hero) → "What am I about to discover?"
2. **Shock** (Mathematical Miracle) → "This can't be coincidence..."
3. **Fascination** (Linguistic DNA, Rhythm, Sounds) → "The language itself is alive..."
4. **Awe** (Symmetry, Layers, Time) → "There's a blueprint within the blueprint..."
5. **Astonishment** (Science, History) → "How could anyone have known this?"
6. **Reflection** (Conclusion) → "What does this all mean?"

---

## 2. TECH STACK

- **React 18 + Vite** (component-driven, lazy-loaded overlays)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Framer Motion** for scroll animations and transitions
- **React Context** for lightweight i18n (TR + EN)
- **Fonts:** KFGQPC + ShaykhHamdullah (Arabic), Inter (UI), Playfair Display (headings), Amiri (fallback)
- Fully responsive (mobile-first), static deploy (Netlify/Vercel)

> **KURAL — Arapça Font:** Kur'an metni için kullanılan tek font **KFGQPC** (King Fahd Complex, Kral Fahd Basımevi Uthmani fontu) olacaktır. `currentFont` değişkeni her zaman `"'KFGQPC', 'Amiri Quran', serif"` olarak kalmalıdır. İstisna: ReadingMode ve InterlinearView, `"'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif"` zincirini kullanır (bkz. §13.15). KFGQPC, api.acikkuran.com verisinin tasarlandığı fonttur ve tüm Kur'ani karakterleri (hareke, işaret, vaqf) eksiksiz destekler.

---

## 3. BILINGUAL SUPPORT (TR + EN)

- Language switcher in navbar (TR | EN toggle)
- All content in `src/i18n/tr.json` and `src/i18n/en.json`
- Arabic Quranic verses remain in Arabic in both languages
- Verse translations switch with selected language
- Language preference saved in localStorage
- Default: Turkish

---

## 4. DESIGN SYSTEM

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background (deep) | Cosmic Black | `#0a0a1a` |
| Background (section) | Deep Navy | `#0d1b2a` |
| Primary accent | Antique Gold | `#d4a574` |
| Secondary accent | Royal Gold | `#c9a227` |
| Quranic Green | Emerald | `#1a7a4c` |
| Quranic Green (light) | Soft Emerald | `#2ecc71` |
| Text (primary) | Off-White | `#e8e6e3` |
| Text (muted) | Silver | `#94a3b8` |
| Danger/Warning accent | Soft Red | `#e74c3c` |
| Calm/Mercy accent | Sky Blue | `#3498db` |
| Card background | Glass | `rgba(255,255,255,0.05)` |
| Card border | Glass edge | `rgba(255,255,255,0.1)` |

### Typography
- **Hero Title:** Playfair Display, 900 weight, 4-6rem
- **Section Titles:** Playfair Display, 700 weight, 2.5-3rem
- **Body Text:** Inter, 400 weight, 1.1rem, line-height 1.8
- **Arabic Verses:** KFGQPC (veya ShaykhHamdullah — okuma modunda), 1.6–2.5rem, RTL
- **Stats/Numbers:** Inter, 800 weight, various sizes
- **Captions/Labels:** Inter, 300 weight, 0.85rem

### Visual Elements
- **Glassmorphism Cards:** `backdrop-filter: blur(20px)`, semi-transparent bg, subtle border
- **Islamic Geometric Patterns:** Subtle SVG backgrounds at 3-5% opacity, rotating slowly
- **Section Dividers:** Gradient fades between sections (not hard lines)
- **Glow Effects:** Soft gold/emerald glow on key statistics
- **Particle System:** Canvas-based star particles in hero and between sections

### Animations
- **Scroll Reveal:** Elements fade up (translateY: 30px → 0) with stagger, via Intersection Observer
- **Animated Counters:** Numbers count up from 0 to target when scrolled into view
- **Parallax:** Subtle depth on background elements
- **Hover States:** Cards lift slightly with enhanced glow
- **Section Transitions:** 200px gradient overlap between sections

---

## 5. FILE STRUCTURE

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
- Veri dosyalarının tam şeması için §13.9 "Yeni JSON Data Dosyası Kuralı"na bakın.

---

## 6. WEBSITE SECTIONS — NARRATIVE CATALOG

> **Kural:** Bu bölüm yalnızca section'ların **amacını ve narrative yerini** özetler. Section metinlerinin **tam içeriği** (paragraflar, ayetler, istatistikler, içerik değişiklikleri) `src/i18n/tr.json` ve `src/i18n/en.json`'da tutulur. Bu dosya ile i18n JSON'ları arasında drift olursa **i18n JSON geçerlidir.**

| # | Section | Amaç / Emosyonel Evre | Ana Mekanizma |
|---|---------|------------------------|---------------|
| 1 | **Hero** | Wonder — "Ne keşfedeceğim?" | Tam ekran parçacık arka plan + başlık reveal |
| 2 | **MathMiracle** (Sayısal Mucize) | Shock — "Bu tesadüf olamaz" | Animated counter pairs (hayat/ölüm, dünya/ahiret, melek/şeytan...) + **metodolojik nüans**: bkz. `docs/reviews/2026-04-19-leeds-verification.md` |
| 3 | **LinguisticDNA** (Dilsel DNA) | Fascination — "Dil bir şifre" | 14 mukattaa harfi, Kaf suresi, checksum analojisi |
| 4 | **ImpossibleRhythm** (İmkansız Ritim) | Fascination — "Ne şiir ne düzyazı" | Şiir / Kur'an / düzyazı karşılaştırması, 16 vezin |
| 5 | **SoundArchitecture** (Seslerin Mimarisi) | Fascination — "Sesler anlam taşır" | Azap ↔ Rahmet sesleri, amigdala/korteks analojisi |
| 6 | **HiddenArchitecture** (Gizli Simetri) | Awe — "Aynalarda ayna" | Ring composition (Farrin, 2014) + Fatiha halka diyagramı |
| 7 | **PsychologySection** | Awe — "İnsanın iç haritası" | Nefs · kalp · korku · savunma · Yusuf travma-iyileşme · sosyal · anlam · modern karşılaştırma |
| 8 | **ScientificSigns** (Bilimsel İşaretler) | Astonishment — "Nasıl bilinebilirdi?" | Demir (Hadid) · Genişleyen Evren · Denizler barajı · Embriyoloji (alaka) — **tartışmalı alanlar `criticalNote` ile işaretli** |
| 9 | **HistoricalProof** (Tarihsel Doğrulama) | Astonishment — "Arkeoloji onayladı" | Firavun bedeni · Hâmân · Rum suresi kehaneti — **yorum tartışmaları nüanslı** |
| 10 | **LivingPreservation** (Yaşayan Koruma) | Reflection — "Tek metin, sıfır varyasyon" | Birmingham elyazması (2015), huffaz zinciri, isnad |
| 11 | **ZeroRedundancy** (Sıfır Gereksizlik) | Reflection — "Her kelime görevli" | Musa hikâyesi çoklu perspektif, korpus analizi (tahmini) |
| 12 | **Highlights** / **WowFacts** | Astonishment (kompakt) | Prefrontal korteks · parmak izleri · modüler anlatı · kelime haritası · zaman esnekliği · iltifât |
| 13 | **HumanDefinition** | Reflection | İnsan tanımı — çoklu boyut (nefs, fıtrat, halife, imtihan) |
| 14 | **QuranRhetoric** | Awe | Kur'an belağatı — tezad, istiare, teşbih, iltifât |
| 15 | **QuranDua** | Reflection | Kur'anî dualar tematik koleksiyon |
| 16 | **ProphetMap** | Awe | Peygamberler zaman/mekân haritası (detaylı atlas: `ProphetAtlas` overlay) |
| 17 | **ToolsShowcase** / **ToolsHighlight** / **PathCards** / **AllTopics** | Utility | Araç (overlay) keşif kartları — kullanıcıyı graph/atlas overlay'lerine yönlendirir |
| 18 | **Conclusion** | Reflection — "Ne anlama geliyor?" | Kapanış + Nisa 4:82 ayeti |
| 19 | **Footer** | — | Metodoloji notu, kaynakça (`footer.sources`), bismillah süsü |

**Section ↔ Overlay ilişkisi:** Scroll-story içindeki section'lar (örn. MathMiracle) özet veriyi gösterir ve kullanıcıyı ilgili **overlay/tool**'a (örn. WordHeatmap, ConceptGraph, VerseGraph) yönlendirir. Overlay'ler `src/components/` altındadır; açma/kapama Navbar tarafından yönetilir (bkz. §13.4).

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, smaller fonts, stacked cards, hamburger menu |
| Tablet | 640-1024px | Two columns for comparisons, side drawer menu |
| Desktop | 1024-1440px | Full layout with sidebyside comparisons |
| Wide | > 1440px | Max-width container, larger hero text |

---

## 8. PERFORMANCE CONSIDERATIONS

- Lazy load sections below the fold
- Particle system uses requestAnimationFrame, pauses when not visible
- Intersection Observer for scroll animations (not scroll event listener)
- Images: SVG for patterns and icons (no heavy raster images)
- Font loading: `display=swap` to prevent FOIT
- Bundle: Code-split by section for faster initial load

---

## 9. ACCESSIBILITY

- Semantic HTML (header, nav, main, section, article, footer)
- Aria labels on all interactive elements
- Color contrast ratios meeting WCAG AA for body text
- Reduced motion media query to disable animations
- Arabic text with `dir="rtl"` and `lang="ar"` attributes
- Keyboard navigation for all interactive elements
- Focus visible styles

---

## 11. TYPOGRAPHY & LAYOUT RULES (ENFORCE ALWAYS)

### Text Width & Alignment Standard

These rules apply to ALL sections and must be followed consistently:

| Element | max-width | alignment | mx-auto |
|---------|-----------|-----------|---------|
| Section intro paragraph | `max-w-3xl` | `text-left` | ❌ no |
| Section headings (h2) | `max-w-4xl` | `text-left` | ❌ no |
| Closing / rhetorical italic paragraph | `max-w-3xl` | `text-left` | ❌ no |
| "Wow" closing statement (bold, centered) | unconstrained | `text-center` | ✅ yes |
| Verse intro line (before Arabic verse) | unconstrained | `text-center` | ✅ yes |
| Card body text | no constraint | `text-left` | ❌ no |

**Rules:**
- Section intro `<motion.p>`: always `className="text-silver text-lg leading-relaxed max-w-3xl mb-10"` (or mb-12)
- Never use `max-w-5xl`, `max-w-4xl`, or `max-w-2xl` for intro paragraphs
- Never use `text-center` on flowing body/intro text — only on single-line "wow" statements or verse intros
- `mx-auto` on `<p>` elements: only allowed for explicitly centered single-line emphasis text
- Exceptions: text inside glassmorphism cards, tab panels, interactive widgets — those inherit container constraints

---

## 13. IMPLEMENTATION RULES — ENFORCE ALWAYS

Bu kurallar her yeni bileşen, feature veya düzeltmede **istisnasız** uygulanır.

### 13.1 Design Token Kuralı

**Tüm renkler, fontlar ve UI sabitleri `src/tokens.js`'den import edilir.**

```js
import { COLORS, FONTS, OVERLAY_BASE, GLASS_CARD, TEXT, VERSE_BLOCK, CHIP } from '../tokens';
```

- ❌ YASAK: `color: '#d4a574'` — ham hex değer
- ❌ YASAK: `background: 'rgba(212,165,116,0.15)'` — ham rgba değer
- ✅ DOĞRU: `color: COLORS.gold`
- ✅ DOĞRU: `background: COLORS.goldAlpha15`
- **İstisna:** Tailwind class'ları (`text-gold`, `bg-cosmic-black`) token sistemiyle çakışmaz, kullanılabilir.

---

### 13.2 Arapça Font Kuralı — MUTLAK

**Kur'an metni için tek geçerli font:**

```js
fontFamily: FONTS.quran  // "'KFGQPC', 'Amiri Quran', serif"
```

- ❌ YASAK: `fontFamily: "'Amiri', serif"` (Kur'an metni için)
- ❌ YASAK: `fontFamily: "'Scheherazade', serif"`
- ❌ YASAK: `fontFamily: "'ShaykhHamdullah', serif"`
- ✅ DOĞRU: `fontFamily: FONTS.quran` — her zaman, her yerde
- Arapça UI metni (Kur'an olmayan) için `FONTS.arabic` kullanılabilir.
- Ayet içeren her blok `dir="rtl"` ve `lang="ar"` attribute'ü taşır.

---

### 13.3 Overlay / Tool Bileşeni Pattern

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

---

### 13.4 Navbar Entegrasyon Pattern

Yeni bir tool eklenirken sıra:

1. `const YeniArac = lazy(() => import('./YeniArac'))` — üste lazy import
2. `const [yeniOpen, setYeniOpen] = useState(false)` — state
3. `anyOpen` satırına `|| yeniOpen` ekle
4. `popstate` handler'ına `if (yeniOpen) { setYeniOpen(false); return; }` ekle
5. `tools` array'ine yeni obje ekle (labelTr, labelEn, descTr, descEn, icon, action)
6. `vizTools` veya `researchTools` array'ini güncelle (dropdown için)
7. JSX'in sonuna `{yeniOpen && <Suspense fallback={null}><YeniArac onClose={() => setYeniOpen(false)} /></Suspense>}` ekle

---

### 13.5 Ayet Gösterim Kuralı

Her ayet gösterimi `VERSE_BLOCK` stilini kullanır:

```jsx
import { VERSE_BLOCK, TEXT } from '../tokens';

<div style={VERSE_BLOCK}>
  <p style={{ ...TEXT.verseArabic, margin: '0 0 10px' }}>{verseAr}</p>
  <p style={{ fontSize:'0.85rem', color: COLORS.offWhite, fontStyle:'italic' }}>{verseTr}</p>
  <p style={{ ...TEXT.verseRef, margin: 0 }}>— {verseRef}</p>
</div>
```

---

### 13.6 Section Label Pattern

Her bölüm/kart başlığındaki küçük üst etiket:

```jsx
<div style={TEXT.sectionLabel}>Etiket Metni</div>
```

---

### 13.7 Glassmorphism Kart Kuralı

- Tailwind class'ı varsa: `className="glass-card"` veya `className="glass-card-strong"`
- Inline style gerekiyorsa: `style={GLASS_CARD}` veya `style={GLASS_CARD_STRONG}`
- ❌ YASAK: Her bileşen kendi `backdrop-filter + rgba` kombinasyonunu uydurmaz

---

### 13.8 Metin Hiyerarşisi

| Kullanım | Değer |
|---|---|
| Ana metin | `color: COLORS.offWhite` |
| İkincil / açıklama | `color: COLORS.silver` |
| Vurgu / etiket | `color: COLORS.gold` |
| Başlık fontu | `fontFamily: FONTS.display` |
| Gövde fontu | `fontFamily: FONTS.body` |

---

### 13.9 Yeni JSON Data Dosyası Kuralı

Her yeni tool için `public/` altına bir JSON oluşturulur. Yapı şeması:

```json
{
  "items": [
    {
      "id": "kebab-case-unique-id",
      "titleTr": "...",
      "titleEn": "...",
      "descTr": "...",
      "descEn": "...",
      "verseAr": "...",
      "verseTr": "...",
      "verseRef": "Sure X:Y"
    }
  ]
}
```

- Her metin alanı hem TR hem EN içerir
- `verseAr`: ham Arapça metin (hareke dahil) — **standart encoding** (bkz. §13.15)
- `id`: tüm JSON genelinde benzersiz, kebab-case

---

### 13.10 Overlay Başlık Stili Kuralı — OVERLAY_TITLE

**Her tool overlay'inin header'ındaki araç adı/başlık metni `OVERLAY_TITLE` token'ını kullanır.**

```jsx
import { OVERLAY_TITLE } from '../tokens';

// Header içinde:
<span style={OVERLAY_TITLE}>
  {language === 'tr' ? 'Araç Adı' : 'Tool Name'}
</span>
```

`OVERLAY_TITLE` = `{ color: COLORS.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, margin: 0 }`

- ❌ YASAK: `fontFamily: 'Playfair Display, serif'` — overlay başlıkları için display font kullanılmaz
- ❌ YASAK: `color: '#e8e6e3'` veya `color: COLORS.offWhite` — başlık her zaman altın rengindedir
- ❌ YASAK: `fontSize: '1.1rem'` veya daha büyük — başlık 0.9rem'dir
- ✅ DOĞRU: `style={OVERLAY_TITLE}` veya `style={{ ...OVERLAY_TITLE, ek: 'stil' }}`
- Tüm overlay'lerde başlık: altın renk, Inter font, 0.9rem, 700 weight — site genelinde tutarlı

---

### 13.11 Kapat Butonu Kuralı — CLOSE_BTN

**Her overlay'in header'ındaki kapat butonu `CLOSE_BTN` token'ını kullanır.**

```jsx
import { CLOSE_BTN, COLORS } from '../tokens';

<button
  onClick={onClose}
  style={{ ...CLOSE_BTN }}
  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
  onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
</button>
```

`CLOSE_BTN` = `{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:COLORS.silver, cursor:'pointer', transition:'all 0.15s', flexShrink:0 }`

- ❌ YASAK: `borderRadius: '8px'` veya `'6px'` — kapat butonu her zaman tam daire (`50%`)
- ❌ YASAK: Text `×` veya `✕` — her zaman SVG icon kullanılır
- ❌ YASAK: Inline duplicate style — `width:'36px', height:'36px', borderRadius:'50%'...` tekrar yazılmaz
- ✅ DOĞRU: `style={{ ...CLOSE_BTN }}` — token'dan spread
- ReadingMode ve VerseGraph iç panel butonları bu kural dışındadır (kendine özgü UI'ları var)

---

### 13.12 Cross-Tool Navigasyon Kuralı — Back Navigation

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

---

### 13.13 Navbar Buton Yüksekliği — Eşitlik Kuralı

Navbar sağındaki tüm butonlar aynı yükseklikte olmalıdır.

- **"Kur'an'ı Oku" CTA butonu:** `height: '32px'`
- **Dil seçici (TR/EN) butonu:** `height: '32px'`
- ❌ YASAK: Farklı yükseklikler (örn. biri 30px diğeri 36px)

---

### 13.14 Arapça Maddah Rendering Fix

KFGQPC fontunda `U+0653` (maddah above) karakterinden önce gelen hareke (U+064B–U+0652) render bozukluğuna yol açar.

**cleanArabic() fonksiyonuna eklenecek fix:**

```js
.replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
```

Bu fix, tüm Arapça metin temizleme utility'lerinde mevcut olmalıdır (`src/utils/` altındaki ilgili dosyada).

---

### 13.15 Arapça Metin Encoding & Font Kuralı — KRİTİK

**Kur'an metni ekranda gösterilirken MUTLAKA aşağıdaki kurallara uyulmalıdır.**

#### Font Zinciri

Kur'an okuma modu (`ReadingMode`, `InterlinearView`):
```js
const currentFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";
```

Diğer tüm bileşenler (overlay'ler, section'lar, kartlar):
```js
fontFamily: FONTS.quran  // "'KFGQPC', 'Amiri Quran', serif"
```

#### Arapça Metin Encoding Standardı

ShaykhHamdullah ve KFGQPC fontları **yalnızca standart Arabic Unicode** ile düzgün çalışır. Aşağıdaki Uthmani-özel karakterler **kullanılamaz** — ekranda bozuk render üretir:

| Karakter | Unicode | Sorun | Çözüm |
|----------|---------|-------|-------|
| ۡ (Uthmani sükun) | `U+06E1` | Cezm dairesi yarım görünür | `U+0652` (ْ standart sükun) ile değiştir |
| ٱ (Alef wasla) | `U+0671` | ص işareti render eder | `U+0627` (ا düz alef) ile değiştir |
| ۪ (Uthmani kasra/asar) | `U+06EA` | Asar (küçük çizgi) kasra formu | **Korunur** — font asar şeklinde render eder. Dönüştürülmez. Tecvid DIAC/HAREKE aralıklarına dahil edilmiştir. |
| ی (Farsi Yeh) | `U+06CC` | Siyah tofu üretir | `U+064A` (ي standart Yeh) ile değiştir |

#### Veri Kaynakları

- **`public/verse-graph-bgem3.json`**: Ana ayet verisi. Arapça metin **standart encoding** kullanır. Bu dosyadaki Arapça metne DOKUNMA.
- **`public/*.json`** (tüm JSON dosyaları): Standart encoding. Font-uyumlu.
- **`api.acikkuran.com`**: Uthmani encoding döndürür (`U+06E1`, `U+0671`, `U+06EA`). **Mutlaka `cleanArabic()` ile normalize edilmeli.**

#### cleanArabic() Zorunluluğu

API'den gelen veya Uthmani kaynaklı her Arapça metin, ekrana yazdırılmadan önce `cleanArabic()` fonksiyonundan geçirilmelidir. Bu fonksiyon:

```js
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')   // Uthmani kasra → standart kasra
    .replace(/\u0671/g, '\u0627')   // Alef Wasla → düz Alef
    .replace(/\u06CC/g, '\u064A')   // Farsi Yeh → Arabic Yeh
    // ... diğer normalizasyonlar
}
```

**Yeni bir JSON veri dosyası oluşturulurken veya mevcut veri güncellenirken**, Arapça metin standart encoding kullanmalıdır. Uthmani encoding'li veri asla doğrudan JSON'a yazılmamalı — önce normalize edilmeli.

#### Test Yöntemi

Bir font/encoding değişikliğinden sonra **Fatiha Suresi'ni (1:1-7) Kitap modunda açıp kontrol et:**
- Cezimlerin tam daire olduğunu doğrula (yarım daire = encoding hatası)
- Harekelerin dikey (harfin üstünde/altında) olduğunu doğrula (yatay = font hatası)
- Temmim (ـ uzatma) işaretlerinin düzgün göründüğünü doğrula
- Bismillah ile ayet metninin aynı stilde olduğunu doğrula

---

## 14. MOBİL UYUMLULUK KURALI — ENFORCE ALWAYS

**Her yeni overlay ve tool bileşeni mobil (≥ 390px) ekranda tam kullanılabilir olmalıdır.**

### 14.1 isMobile Algılama Pattern

Her overlay bileşenine şu pattern eklenir:

```jsx
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
useEffect(() => {
  const h = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

### 14.2 Sabit Genişlik Kuralı

- ❌ YASAK: `width: '220px'` gibi sabit sidebar genişlikleri (overflow yapar)
- ❌ YASAK: `gridTemplateColumns: '1fr 1fr'` (mobilde çok dar)
- ❌ YASAK: `gridTemplateColumns: '1fr auto 1fr'` (mobilde 3 sütun sığmaz)
- ✅ DOĞRU: `gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'`
- ✅ DOĞRU: Sabit sidebar'ı mobilde `display: isMobile ? 'none' : 'flex'` ile gizle

### 14.3 Sidebar Pattern (AddresseeSystem, QuranCommands vb.)

Sidebar + detail layout olan bileşenlerde:

- Mobilde sidebar gizlenir (`display: isMobile ? 'none' : 'flex'`)
- Header'a horizontally scrollable chip row eklenir (`overflowX: 'auto', scrollbarWidth: 'none'`)
- Detail panel mobilde tam genişliği alır

### 14.4 Üçlü Panel Pattern (KissaAtlas vb.)

Sol panel + orta grid + sağ detail olan bileşenlerde:

- Mobilde tab bar eklenir: Sahneler / Sure Haritası / Detay
- Her tab kendi içeriğini tam ekran gösterir
- Seçim yapıldığında ilgili tab'a otomatik geçiş yapılır

### 14.5 Header Pattern

Mobilde header'da çok sayıda buton/tab varsa:

- Row 1: Title + Close button
- Row 2: Scrollable tab/category chips

### 14.6 Padding Kuralı

- Mobilde content padding: `isMobile ? '16px' : '24px 32px'`
- Header padding: `isMobile ? '10px 16px' : '0 20px'`

---

## 15. KAYNAK DİZİN KURALI

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
