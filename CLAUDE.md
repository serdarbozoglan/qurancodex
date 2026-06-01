# KUR'AN-I KERİM'İN GÖRÜNMEYEN MİMARİSİ
## Comprehensive Website Design Document

> **Branch:** `migration-to-next.js` — Bu dosya, Next.js 16 App Router migration'ı için temizlenmiştir. Vite-spesifik patternlar (§2, §5, §13.3, §13.4, §13.12, §15) ana CLAUDE.md'den çıkarılıp `docs/legacy-vite-rules.md`'ye arşivlendi. Aşağıdaki bölüm numaraları stabil tutuldu; eksik numaralar bilinçlidir.
>
> **Migration planı:** `tasks/todo_next.js_migration.md`
> **Next.js patternları:** §16 — Faz 7-9'da implement edilip dokümante edildi (14 alt başlık).

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

## 3. BILINGUAL SUPPORT (TR + EN)

- Language switcher in navbar (TR | EN toggle)
- All content in i18n JSON files (TR + EN olarak ayrı, single source of truth)
- Arabic Quranic verses remain in Arabic in both languages
- Verse translations switch with selected language
- Language preference persists across sessions
- Default: Turkish
- URL-level locale routing tercih edilir (`/tr/...`, `/en/...`) — Next.js migration sonrası hreflang tags otomatik üretilir

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

## 6. WEBSITE SECTIONS — NARRATIVE CATALOG

> **Kural:** Bu bölüm yalnızca section'ların **amacını ve narrative yerini** özetler. Section metinlerinin **tam içeriği** (paragraflar, ayetler, istatistikler, içerik değişiklikleri) i18n JSON'larında (TR + EN) tutulur. Bu dosya ile i18n JSON'ları arasında drift olursa **i18n JSON geçerlidir.**

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
| 16 | **ProphetMap** | Awe | Peygamberler zaman/mekân haritası (detaylı atlas: ProphetAtlas tool sayfası) |
| 17 | **ToolsShowcase** / **ToolsHighlight** / **PathCards** / **AllTopics** | Utility | Araç keşif kartları — kullanıcıyı graph/atlas tool sayfalarına yönlendirir |
| 18 | **Conclusion** | Reflection — "Ne anlama geliyor?" | Kapanış + Nisa 4:82 ayeti |
| 19 | **Footer** | — | Metodoloji notu, kaynakça (`footer.sources`), bismillah süsü |

**Section ↔ Tool ilişkisi:** Scroll-story içindeki section'lar (örn. MathMiracle) özet veriyi gösterir ve kullanıcıyı ilgili **tool sayfasına** (örn. WordHeatmap, ConceptGraph, VerseGraph) yönlendirir. Migration sonrası her tool full-page route'a (`/graf/...`, `/atlas/...`, `/arac/...`) dönüşür — bkz. `tasks/todo_next.js_migration.md` Faz 4.

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
- Bundle: Code-split by section/route for faster initial load
- Next.js'te ek hedefler: LCP < 2.5s, CLS < 0.1, INP < 200ms (bkz. `tasks/todo_next.js_migration.md` Faz 7.10)

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

**Tüm renkler, fontlar ve UI sabitleri merkezi tokens dosyasından import edilir** (`src/tokens.js` Vite'ta, `next/src/tokens.js` Next.js'te).

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
- ❌ YASAK: `fontFamily: "'ShaykhHamdullah', serif"` (ReadingMode/InterlinearView dışında)
- ✅ DOĞRU: `fontFamily: FONTS.quran` — her zaman, her yerde
- Arapça UI metni (Kur'an olmayan) için `FONTS.arabic` kullanılabilir.
- Ayet içeren her blok `dir="rtl"` ve `lang="ar"` attribute'ü taşır.

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

### 13.10 Overlay/Modal Başlık Stili Kuralı — OVERLAY_TITLE

**Modal, dialog veya overlay UI'larındaki header başlık metni `OVERLAY_TITLE` token'ını kullanır.**

> Migration sonrası tool'lar full-page route'lara dönüşür ve overlay header kullanmaz; ancak settings modal, search modal, parallel/intercepting route modal'ları gibi modal/dialog UI'larında bu kural geçerliliğini korur.

```jsx
import { OVERLAY_TITLE } from '../tokens';

<span style={OVERLAY_TITLE}>
  {language === 'tr' ? 'Araç Adı' : 'Tool Name'}
</span>
```

`OVERLAY_TITLE` = `{ color: COLORS.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, margin: 0 }`

- ❌ YASAK: `fontFamily: 'Playfair Display, serif'` — modal başlıkları için display font kullanılmaz
- ❌ YASAK: `color: '#e8e6e3'` veya `color: COLORS.offWhite` — başlık her zaman altın rengindedir
- ❌ YASAK: `fontSize: '1.1rem'` veya daha büyük — başlık 0.9rem'dir
- ✅ DOĞRU: `style={OVERLAY_TITLE}` veya `style={{ ...OVERLAY_TITLE, ek: 'stil' }}`

---

### 13.11 Kapat Butonu Kuralı — CLOSE_BTN

**Modal/dialog header'larındaki kapat butonu `CLOSE_BTN` token'ını kullanır.**

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
.replace(/[ً-ْ]ٓ/gu, 'ٓ')
```

Bu fix, tüm Arapça metin temizleme utility'lerinde mevcut olmalıdır (`src/utils/` veya Next.js'te `next/src/lib/`).

---

### 13.15 Arapça Metin Encoding & Font Kuralı — KRİTİK

**Kur'an metni ekranda gösterilirken MUTLAKA aşağıdaki kurallara uyulmalıdır.**

#### ⚠ ZORUNLU: Build Script Normalizasyon Kuralı

**`next/public/*.json` dosyalarına Arapça metin yazan HER build script** (`scripts/build-*.mjs`, `scripts/extract-*.mjs`, vb.), JSON'a yazmadan **ÖNCE** mutlaka `cleanArabicForDisplay()` muadili bir normalizasyon fonksiyonu uygulamalıdır. Bu kural istisnasızdır.

**Yasaklı:** `verse-graph-bgem3.json`, `acikkuran` API veya başka bir Arapça kaynaktan ham metni doğrudan yeni JSON'a kopyalamak. Ham metin `۪` (U+06EA), `ۖ` (U+06D6 waqf), `ٱ` (U+0671) gibi karakterler içerir; bunlar CSS overlay olmayan bileşenlerde (Section component'ları, atlas kartları, ayet listeleri) **daire/tofu** olarak render olur.

**Doğru pattern (build script içinde):**

```js
// scripts/build-X.mjs
function cleanArabicForDisplay(str) {
  // next/src/lib/arabic.js cleanArabicForDisplay'in birebir kopyası.
  // ES module port: lib import edilemediği için inline tutulur.
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')   // U+06EA → U+0650 (KRİTİK — bu eksik olursa daire görünür)
    .replace(/ۡ/g, 'ْ')   // U+06E1 → U+0652
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')   // U+0671 → U+0627
    .replace(/ی/g, 'ي')   // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')        // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                    // Numara/dipnot
    .replace(/[۝۞۩]/g, '')               // ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                            // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')  // waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                    // süslü parantezler
}

// Build script: Arapça çekildiği her yerde uygulanır
out.ayetler = refs.map(r => ({
  ...byId.get(r),
  arapca: cleanArabicForDisplay(byId.get(r).arabic),  // ← MUTLAKA
}));
```

**Doğrulama komutu (her build sonrası mutlaka çalıştırılır):**

```bash
node -e "
const d = require('./next/public/<YENI-DOSYA>.json');
const PROBLEM = ['۪','ۡ','ٱ','ی','۝','۞','۩','ۖ','ۗ','ۘ','ۙ','ۚ','ۛ','ۜ'];
let h = 0;
function walk(o) {
  if (typeof o === 'string') PROBLEM.forEach(c => { if (o.includes(c)) h++; });
  else if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === 'object') Object.values(o).forEach(walk);
}
walk(d);
console.log('Problem chars:', h);
"
```

Çıktı **`Problem chars: 0`** olmalı. Sıfırdan farklı çıkarsa script'teki normalizasyon eksik veya hatalı — düzeltilip rebuild edilir.

**İstisnalar:**
- `ReadingMode`/`InterlinearView` için yazılan veri dosyaları farklı pipeline kullanır (CSS overlay tajwid render); bu rule uygulanmaz, `cleanArabic()` canonical varyant kullanılır.
- Build script `next/src/lib/arabic.js`'i ES module olarak import edebiliyorsa direkt `cleanArabicForDisplay` import edilir; edilemiyorsa (Node script bağlamı, .mjs) yukarıdaki gibi inline kopyalanır.

**Bu kural geçmişte ihlal edildiğinde** (örn. 2026-06-01 esma-beyanlari.json ilk build'i): KFGQPC fontunda `اِنَّـن۪ٓى` gibi metinlerde U+06EA noktalı daire olarak görünür ve "yarım hareke" yanılgısı oluşturur. Build-time normalizasyon bunu önler.

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
    .replace(/۪/g, 'ِ')   // Uthmani kasra → standart kasra
    .replace(/ٱ/g, 'ا')   // Alef Wasla → düz Alef
    .replace(/ی/g, 'ي')   // Farsi Yeh → Arabic Yeh
    // ... diğer normalizasyonlar
}
```

**Yeni bir JSON veri dosyası oluşturulurken veya mevcut veri güncellenirken**, Arapça metin standart encoding kullanmalıdır. Uthmani encoding'li veri asla doğrudan JSON'a yazılmamalı — önce normalize edilmeli.

#### Tam Normalizasyon Listesi — KFGQPC Glyph Eksikliği

KFGQPC font'unda glyph'i bulunmayan ek tajwid/sajdah/waqf işaretleri de strip edilmelidir. Aksi takdirde ekranda boş kare (□□) veya tofu (◯◯) olarak render olur — örn. "ف۪يهِ" → "ف◯◯يهِ".

**Strip edilmesi zorunlu Unicode aralıkları:**

```js
// 1. Standart dönüşümler
str = str.replace(/۪/g, 'ِ');   // Uthmani subscript kasra → standart kasra
str = str.replace(/ۡ/g, 'ْ');   // Uthmani sukun → standart sukun
str = str.replace(/ٱ/g, 'ا');   // Alef wasla → düz alef
str = str.replace(/ی/g, 'ي');   // Farsi yeh → Arabic yeh

// 2. Strip — KFGQPC glyph eksikliği nedeniyle
str = str.replace(/[ؐ-ؔؖؗ]/g, '');         // İslami ifade kısaltmaları (sallallahu, vb.)
str = str.replace(/[؀-؅]/g, '');                     // Quranic numara/dipnot işaretleri
str = str.replace(/[۝۞۩]/g, '');                // Ayet sonu, rub el hizb, sajda
str = str.replace(/[ؕۖ-ۜ۟-ۭۤۧۨ]/g, ''); // Waqf + tajwid (small high seen, lam-alef, jeem, three dots, rounded zero, vb.)
```

Tam referans implementasyon: `VerseGraph` bileşenindeki `cleanArabicForGraph()`.

#### Render Yöntemi (mevcut data dosyalarında)

JSON dosyaları **iki yöntemden biri** ile temizlenir:

**Yöntem A — Build-time normalizasyon (tercih edilen):**
JSON'a yazmadan önce metin normalize edilir. Veri tek seferlik temizlendiği için runtime maliyeti yok. Yeni JSON yazımı veya mevcut JSON güncellenmesinde:

```bash
python3 -c "
import json, re
with open('public/X.json') as f: data = json.load(f)
def normalize(s):
    if not isinstance(s, str): return s
    s = s.replace('۪','ِ').replace('ۡ','ْ')
    s = s.replace('ٱ','ا').replace('ی','ي')
    s = re.sub(r'[ؐ-ؔؖؗ]','',s)
    s = re.sub(r'[؀-؅]','',s)
    s = re.sub(r'[۝۞۩]','',s)
    s = re.sub(r'[ؕۖ-ۜ۟-ۭۤۧۨ]','',s)
    return s
def walk(o):
    if isinstance(o, dict): return {k: walk(v) for k,v in o.items()}
    if isinstance(o, list): return [walk(v) for v in o]
    return normalize(o)
with open('public/X.json','w') as f: json.dump(walk(data), f, ensure_ascii=False, indent=2)
"
```

**Yöntem B — Runtime cleanArabic() (canlı API'lerde):**
api.acikkuran.com gibi canlı kaynaklardan gelen Arapça metin ekrana yazılmadan önce `cleanArabic()` fonksiyonundan geçirilir.

#### Audit Komutu

Mevcut JSON'da problem karakter var mı tespit etmek için:

```bash
python3 -c "
import json
PROBLEM = {'ۡ','ٱ','۪','ی','ۜ','ۙ','ۚ','ۛ','۝','۞','۟','۠','۩','ۭ'}
with open('public/X.json') as f: data = json.load(f)
hits = 0
def walk(o):
    global hits
    if isinstance(o, dict): [walk(v) for v in o.values()]
    elif isinstance(o, list): [walk(v) for v in o]
    elif isinstance(o, str): hits += sum(1 for c in o if c in PROBLEM)
walk(data); print(f'Problem chars: {hits}')
"
```

`Problem chars: 0` çıktısı bekleniyor — herhangi bir sayı varsa Yöntem A ile normalize et.

#### Test Yöntemi

Bir font/encoding değişikliğinden sonra **Fatiha Suresi'ni (1:1-7) Kitap modunda açıp kontrol et:**
- Cezimlerin tam daire olduğunu doğrula (yarım daire = encoding hatası)
- Harekelerin dikey (harfin üstünde/altında) olduğunu doğrula (yatay = font hatası)
- Temmim (ـ uzatma) işaretlerinin düzgün göründüğünü doğrula
- Bismillah ile ayet metninin aynı stilde olduğunu doğrula

---

### 13.16 Çift Scrollbar Kuralı — Tek Scrollbar Hijyeni

**Modal/dialog veya tab'lı container'larda ekranda yalnızca bir scrollbar görünmelidir.** Birden fazla scrollbar — ya iç container'lardan ya da arka plan sayfasından sızan window scroll'undan — kullanıcıyı şaşırtır ve UX'i bozar.

> Migration sonrası tool'lar full-page route olduğu için arka plan scroll problemi azalır; ancak modal pattern'ları (settings, search, parallel routes) ve tab'lı container'lar bu kurala uymak zorundadır.

#### Pattern — Üç Katmanlı Scroll Hijyeni

**Katman 1: Body scroll lock (modal açıldığında)**

Modal mount olduğunda hem `<body>` hem `<html>` overflow'u kilitlenir:

```jsx
useEffect(() => {
  const prevBody = document.body.style.overflow;
  const prevHtml = document.documentElement.style.overflow;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = prevBody;
    document.documentElement.style.overflow = prevHtml;
  };
}, []);
```

**Katman 2: Outer container scroll'u kapatılır, her tab kendi scroll'unu yönetir**

Tab'lı UI'larda dış body container'a `overflow: auto` koymak — iç tab'ın da kendi `overflow: auto` ile scroll yapmasıyla — **çift scrollbar** üretir. Çözüm: dış body sadece flex container, scroll iç tab'ın sorumluluğu:

```jsx
{/* Outer body — no scroll, just flex layout */}
<div ref={bodyRef} style={{
  flex: 1,
  overflow: 'hidden',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
}}>
  {activeTab === 0 && <Tab1 />}
  {activeTab === 1 && <Tab2 />}
</div>
```

`minHeight: 0` flex child'ın content-based min-height'ı override etmek için **zorunlu** — yoksa flex item dış container'ı taşırır.

**Katman 3: Her tab'ın root div'i kendi scroll container'ı**

```jsx
function TabSomething({ ... }) {
  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: ...,
    }}>
      {/* tab içeriği */}
    </div>
  );
}
```

İki panelli tab'larda (sidebar + main panel) sidebar ve main panel ayrı ayrı `overflowY: auto` kullanabilir — bu **istenen davranış**.

#### Anti-pattern — Yapma

```jsx
// ❌ YANLIŞ — outer body + inner panel ikisi birden scroll
<div style={{ flex: 1, overflowY: 'auto' }}>           {/* outer scrolls */}
  <div style={{ overflowY: 'auto', height: '100%' }}>  {/* inner ALSO scrolls */}
```

Bu yapı çift scrollbar üretir. **Sadece birinde** `overflow: auto` olmalı.

#### Test Yöntemi

1. Sağ kenarda yalnızca **bir** vertical scrollbar görünüyor mu?
2. Tab'lar arası geçtiğinde scroll position sıfırlanıyor mu?
3. Modal kapatıldığında arka plan sayfası eski scroll position'ına dönüyor mu? (cleanup gerekli)
4. Mobile'da yatay scroll var mı? (overflowX: hidden gerekli)

---

## 14. MOBİL UYUMLULUK KURALI — ENFORCE ALWAYS

**Her yeni bileşen ve route mobil (≥ 390px) ekranda tam kullanılabilir olmalıdır.**

### 14.1 isMobile Algılama Pattern

```jsx
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
useEffect(() => {
  const h = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

> Next.js'te SSR-safety için `useState(false)` initial value ile başla, `useEffect` içinde `window.innerWidth` oku — hydration mismatch'ten kaçın.

### 14.2 Sabit Genişlik Kuralı

- ❌ YASAK: `width: '220px'` gibi sabit sidebar genişlikleri (overflow yapar)
- ❌ YASAK: `gridTemplateColumns: '1fr 1fr'` (mobilde çok dar)
- ❌ YASAK: `gridTemplateColumns: '1fr auto 1fr'` (mobilde 3 sütun sığmaz)
- ✅ DOĞRU: `gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'`
- ✅ DOĞRU: Sabit sidebar'ı mobilde `display: isMobile ? 'none' : 'flex'` ile gizle

### 14.3 Sidebar Pattern

Sidebar + detail layout olan bileşenlerde:

- Mobilde sidebar gizlenir (`display: isMobile ? 'none' : 'flex'`)
- Header'a horizontally scrollable chip row eklenir (`overflowX: 'auto', scrollbarWidth: 'none'`)
- Detail panel mobilde tam genişliği alır

### 14.4 Üçlü Panel Pattern

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

## 16. NEXT.JS PATTERNS

> Bu bölüm migration ilerledikçe dolduruldu. Aşağıdaki kurallar Next.js 16 App Router'da implement edilmiş ve `next/` workspace'inde production'da kullanılan pattern'lardır.

### 16.1 RSC vs Client Components Karar Matrisi

**Default: Server Component** (no directive). `'use client'` SADECE şu durumlarda:

| Trigger | Örnek |
|---|---|
| React hooks (`useState`, `useEffect`, `useRef`, custom hooks) | `Hero`, tüm interaktif section'lar |
| Browser API (`window`, `localStorage`, `document`) | `LanguageContext`, `PathContext` |
| Event handlers (`onClick`, `onChange`) | Buton-driven UI |
| Third-party client libs (framer-motion, react-leaflet, three.js) | Atlas/Graf tool component'ları |

**Server component örneği** (no directive): `PageHeading.jsx`, `SurahPagination.jsx`, `JsonLd.jsx`, `page.js` route handler'ları.

**Client component örneği** (`'use client'` ilk satır): `Navbar.jsx`, `Footer.jsx`, tüm `*Route.jsx` wrapper'ları, tüm `src/sections/*.jsx`.

### 16.2 `'use client'` Direktifi Kuralı

- Dosyanın **ilk satırı** olmalı (yorum bile önce gelmez).
- Bir client component bir server component import EDEMEZ direkt; sadece prop olarak alabilir (`children`).
- Server component → client component import: serbest; client otomatik hydrate olur.
- ❌ YASAK: `'use client'` ekledikten sonra server-only async data fetching (`await fetch(...)` top-level).
- ✅ DOĞRU: client component içinde `useEffect`+`fetch` veya server component'tan prop al.

### 16.3 `generateMetadata` Template — Module-Level Const Pattern

**Title/desc her sayfada 3 yerde kullanılır**: metadata + JSON-LD + (server-rendered H1 via `PageHeading`). Drift'ten kaçınmak için module-level const'lar:

```jsx
// page.js
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import XRoute from './XRoute';

const PATH  = '/atlas/kissa';
const TITLE = 'Kıssa Atlası';
const DESC  = "Kur'an'daki peygamber kıssaları — ..."; // Çift tırnak; apostrophe yok-içeren string'lerde tek tırnak truncation tetikler.

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
      ]} />
      <PageHeading title={TITLE} description={DESC} />
      <XRoute />
    </>
  );
}
```

- ❌ YASAK: TITLE/DESC'i her kullanım yerinde inline yazmak (drift kaynağı).
- ❌ YASAK: Apostrophe ('Kur'an') içeren string'leri tek tırnak ile yazmak — string literal erken kapanır, build broken metadata üretir (bkz. Faz 7.2 bug fix).
- ✅ DOĞRU: `const TITLE = "Kur'an'da X"` (çift tırnak).

### 16.4 Locale Routing — `[locale]` Dynamic Segment

URL pattern: `/tr/...` ve `/en/...`. Middleware (`src/middleware.js`) prefix-less URL'leri default locale'a redirect eder.

```js
// next/src/middleware.js — locale prefix garantisi
export const config = {
  matcher: [
    '/((?!_next|api|fonts|tafsir|corpus|meal-cache|audio|amthal|icons|favicon|opengraph-image|twitter-image|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
```

- `[locale]/layout.js`: `LanguageProvider initialLocale={locale}` ile context'i bootstrap eder; localStorage hydrate ETMEZ (hydration mismatch riski).
- `pageMetadata` helper'ı `alternates.languages: { tr, en, 'x-default': tr }` ile hreflang otomatik üretir.

### 16.5 Route-to-Overlay Transformation Pattern

**Eski Vite pattern (state-based overlay):** `<button onClick={() => setShowKissa(true)}>` → `{showKissa && <KissaAtlas onClose={...} />}`

**Yeni Next pattern (full-page route):**
1. `next/src/app/[locale]/atlas/kissa/page.js` — server entry (TITLE/DESC + JsonLd + PageHeading + Route wrapper)
2. `next/src/app/[locale]/atlas/kissa/KissaAtlasRoute.jsx` — client wrapper:
   ```jsx
   'use client';
   import { useRouter } from 'next/navigation';
   import KissaAtlas from '@/components/KissaAtlas';
   export default function KissaAtlasRoute() {
     const router = useRouter();
     return <KissaAtlas onClose={() => router.push('/')} />;
   }
   ```
3. Tool component'ının kendi `position: fixed; inset: 0; z-9999` overlay UI'ı korunur (visual parity).

**Navbar/menu trigger:** `setShowKissa(true)` → `router.push('/tr/atlas/kissa')`.

### 16.6 SSR-Safety Patterns

**Hydration mismatch'ten kaçınmak için:**

```jsx
// ❌ YANLIŞ — server vs client farklı initial value üretir
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

// ✅ DOĞRU — server'da güvenli default, client'ta post-mount hydrate
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  setIsMobile(window.innerWidth < 640);
  const h = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

**localStorage erişimi:** Mutlaka `typeof window !== 'undefined'` guard veya `useEffect` içinde.

**Heavy 3D / leaflet / canvas component'ları:** `dynamic(() => import('...'), { ssr: false })` ile wrap.

### 16.7 Server vs Client Data Fetching

| Veri Kaynağı | Strategy |
|---|---|
| Statik JSON (`public/*.json`) | Server component'ta `import` veya `fetch('http://...')` build-time |
| Eksternal API (acikkuran.com) | **Edge API route proxy** (`/app/api/meal/[author]/[surah]/route.js`) + `fetch` cache (`revalidate: 86400`) + `Cache-Control` headers |
| Kullanıcı interaksiyonuna bağlı veri | Client component + `useEffect` + `fetch` |

Edge runtime API route örneği: `next/src/app/api/meal/[author]/[surah]/route.js` — `export const runtime = 'edge'`; Next fetch cache + manual Cache-Control header.

### 16.8 JSON-LD Structured Data Pattern

Server component injection via `<script type="application/ld+json">`:

```jsx
// next/src/components/JsonLd.jsx — server component (no 'use client')
export default function JsonLd({ schemas }) {
  if (!schemas) return null;
  const list = Array.isArray(schemas) ? schemas : [schemas];
  return (
    <>
      {list.filter(Boolean).map((schema, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
```

Builder fonksiyonları: `next/src/lib/jsonld.js` — `buildBreadcrumb`, `buildArticle`, `buildLearningResource`, `quranBook`. Her route page.js'i kendi schema kombinasyonunu inject eder.

### 16.9 Cross-Route Navigation

```jsx
'use client';
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/tr/graf/ayet?q=2:255');  // path + searchParams
```

- `useRouter` SADECE client component'larda kullanılır.
- searchParams `useSearchParams()` hook'u ile okunur (client side).
- Server component'ta searchParams parametre olarak `Page({ params, searchParams })` üzerinden gelir.
- ❌ YASAK: `window.location.href = '...'` (full page reload tetikler, hydration kaybolur).

### 16.10 Font Loading Pattern

**Google fonts:** `next/font/google` (otomatik preload + CSS variable):
```js
import { Inter, Playfair_Display } from 'next/font/google';
const inter = Inter({ subsets: ['latin','latin-ext'], variable: '--font-inter', display: 'swap' });
```

**Local fonts (KFGQPC, ShaykhHamdullah):** Mevcut implementation hybrid:
- `@font-face` `globals.css`'te (font-family name'i `'KFGQPC'` literal'i olarak korunuyor — 53 inline reference için)
- `<link rel="preload" as="font" type="font/otf">` root layout `<head>`'inde (LCP için)
- `font-display: swap` FOIT engellemek için

**`next/font/local` migration DEFERRED:** Tüm inline `'KFGQPC'` literal'lerini `var(--font-kfgqpc)` ile değiştirmek gerekiyor — ek refactor; mevcut preload zaten LCP fayda sağlıyor.

### 16.11 Static Generation Pattern — `generateStaticParams`

```js
// /oku/[surah]/page.js
export async function generateStaticParams() {
  const params = [];
  for (let s = 1; s <= 114; s++) params.push({ surah: String(s) });
  return params;
}
```

Build sonrası: 114 sure × 2 locale = 228 statik HTML pre-rendered. Tool route'ları (atlas/graf/arac) zaten parametresiz → otomatik static.

### 16.12 SEO-Visible / Visually-Hidden Pattern (sr-only)

Tool overlay'lerinin `position: fixed; inset: 0; z-9999` UI'ı altında kalan SEO içeriği için `sr-only` style:

```jsx
const SR_ONLY = {
  position: 'absolute', width: '1px', height: '1px', padding: 0,
  margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap', borderWidth: 0,
};
```

Kullanım: `PageHeading` (H1 + DESC), `SurahPagination` (prev/next link nav). Visual parity korunur, HTML'de SEO sinyali bulunur, screen reader'lar erişebilir.

### 16.13 Module-Level Hash Drift'ten Kaçınma

Page.js'te `TITLE`/`DESC` const'larını mutlaka **module-level**'da tut. Function içine koyma — generateMetadata ile JsonLd/PageHeading scope'u farklı; kopya yazarsan drift'in başlangıcı olur.

### 16.14 Bilinen Turbopack Dev-Mode Quirk

`[locale]/oku/[surah]/opengraph-image.jsx` route'unda Turbopack `[__metadata_id__]` segment manifest'i ENOENT verebilir. Çözüm: `pkill next && next dev`. **Production `next build`** pre-generate ettiği için bu sorun production'da yok.
