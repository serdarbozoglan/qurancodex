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

> ⚠ **Otorite `next/src/tokens.js`'tir, bu tablo değil.**
> 2026-08-13 denetimi: tablo 10 renk listeliyordu, `tokens.js`'te **100 token**
> var (46 düz hex + 54 rgba). Doküman koddan kopmuştu. **Renk sistemi kuralları
> için §13.25'e bak** — UI kodunda ham renk adı değil semantik token kullanılır.

**Çekirdek roller**

| Role | Token | Hex | Usage Standardı |
|------|-------|-----|---|
| Background (deep) | `SEMANTIC.surface` | `#0a0a1a` | Tüm tool sayfası body bg |
| Background (section) | `SEMANTIC.surfaceRaised` | `#0d1b2a` | Section gradient'leri |
| **Ayet / kutsal metin** | **`SEMANTIC.scriptureText`** | **`#d4a574`** | **Anchor verse, ayet metni** |
| **UI aksanı** | **`SEMANTIC.accentPrimary`** | **`#d4a574`** | **Eyebrow, aktif sekme, UI vurgusu** |
| İstatistik vurgusu | `SEMANTIC.accentStats` | `#c9a227` | **Sadece** stat sayıları — anchor verse/Hero için **YASAK** |
| Text (primary) | `SEMANTIC.textPrimary` | `#e8e6e3` | |
| Text (muted) | `SEMANTIC.textMuted` | `#94a3b8` | |
| Durum | `STATUS.{error,success,info,warning}` | — | Kategori paletinden bağımsız |
| Kategori | `CATEGORY.{emerald,blue,violet,orange,red,rose}` | — | Atlas/tefekkür/graf kategorileri |

> `scriptureText` ve `accentPrimary` **aynı hex, ayrı token**. Ayrım bilinçli:
> tek token olursa ayet rengi ayırt ediciliğini kaybeder, buton/badge/link/ayet
> aynı görünür ve hiyerarşi çöker.

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

### 13.0 YENİ SAYFA/BİLEŞEN ÜRETİRKEN — HIZLI KONTROL LİSTESİ (2026-08-14+)

**Bu bölüm, 13-14 Ağustos turlarında (kontrast, CLS, iç mimari sızıntısı,
renk sistemi) tekrar tekrar aynı hata sınıflarına düşülmesinden sonra
yazıldı.** Her biri kendi alt-bölümünde ayrıntılı anlatılıyor; burası
yalnızca **önce-oku, sonra-detaya-git** özeti. Yeni bir sayfa/bileşen
üretirken veya mevcut birini genişletirken bu listeyi tara:

1. **Metin rengi — ham hex/rgb DEĞİL, üç kademeden biri.**
   `SEMANTIC.textPrimary` (15.74) / `textMuted` (7.65) / `textFaint` (5.94).
   Silver opaklığı ≥0.78, gold ≥0.75 — altı AA'yı kırar. Büyük punto
   (`clamp()`) kullanan metni **hem masaüstünde hem mobilde** ölç —
   "büyük metin" muafiyeti mobilde kalkabilir. → §13.26 md.8

2. **Kategori/kimlik rengi de metin olacaksa AA'ya tabidir.** Bir renk
   "kategori kimliği" diye icat edildiğinde (örn. `{ accent: '#534AB7' }`
   gibi bir palet objesi) — o renk yalnızca ikon/arkaplan/kenarlık DEĞİL,
   aynı zamanda `color:` olarak da kullanılacaksa **cosmic-black üstünde
   ≥4.5 (veya kasıtlı sönük ise ≥3.0) olduğunu ÖLÇ.** 14 Ağustos'ta
   `Melekler.jsx`'in kendi kategori paleti, `CennetCehennem.jsx`'in
   `CENNET`/`CEHENNEM` sabitleri ve `concept-graph.json`'daki küme
   renklerinin **hiçbiri** doğrulanmadan eklenmişti; ikisi tam opaklıkta
   bile AA'yı geçmiyordu (violet 2.83, gray 4.05). JSON veri dosyasına
   yazılan renkler için de aynı kural geçerli — bkz. madde 5.
   → §13.26 md. 2

3. **Bir kapsayıcıya `opacity` verirken, içindeki metnin KENDİ rengiyle
   ÇARPILACAĞINI unutma.** "Bu kart/durum ikincil" demek için hem metne
   soluk bir renk vermek HEM DE kapsayıcıya `opacity:0.75` eklemek —
   iki katmanlı, ölçülmeyen bir solukluk üretir (14 Ağustos'ta
   `isHadithOnly` kartında görüldü: zaten muted renk + kart opaklığı
   birlikte AA'nın çok altına indi). Kural: solukluğu YA renkte YA
   `opacity`'de ver, ikisinde birden değil; verdiğin yerde ölç.

4. **`isMobile` YALNIZCA davranış için güvenlidir, DÜZEN için değil.**
   `useState(false)+useEffect` ile SSR-safe okunan `isMobile` (§14.1),
   hydration ANINDA her zaman `false`'tur. Bunu `gridTemplateColumns`,
   `display`, `flexDirection` gibi **düzeni değiştiren** bir CSS
   özelliğine bağlarsan, mobilde sayfa önce masaüstü düzeniyle render
   olur, hydration'dan hemen sonra yeniden dizilir — bu bir CLS (Cumulative
   Layout Shift) kaynağıdır, kozmetik değil. 14 Ağustos'ta `CrossToolCTA`
   (54 dosyada kullanılan paylaşılan bileşen) tam olarak bunu yapıyordu;
   bazı sayfalarda CLS **1.0'ı aştı** (eşik 0.1). **Düzen-kritik özellikler
   için CSS media query kullan** (`@media (max-width: 640px)`), `isMobile`
   prop'unu yalnızca JS davranışı (touch handler, koşullu render, event
   listener) için sakla. → §14.2, örnek: `CrossToolCTA.jsx` +
   `globals.css`'teki `.cross-tool-cta__*` kuralları

5. **Yeni bir JSON veri dosyasına Arapça metin VEYA renk yazıyorsan,
   yazmadan önce doğrula, yazdıktan sonra değil.** Arapça için §13.15'in
   `cleanArabicForDisplay` zorunluluğu zaten var; renk için aynı disiplin
   şimdi burada da geçerli — bir hex/rgb değeri JSON'a gömülüp `color:`
   olarak tüketilecekse, gömmeden önce cosmic-black üstünde oranını hesapla
   (bkz. madde 2). Veri dosyası koddan daha az görünür olduğu için gözden
   kaçması daha kolay — `concept-graph.json`'daki 3 küme rengi tam da bu
   yüzden aylarca fark edilmeden durdu.

6. **Client-side veri çeken bileşenlerde yükleme iskeleti, gerçek
   içerikle YAKLAŞIK AYNI boyutta olmalı.** `useState(null)` + `useEffect`
   içinde `fetch(...)` ile veri çekip `if (!data) return <Skeleton/>`
   yapan her bileşen, veri gelince FARKLI bir DOM ağacına geçer — bu bir
   stil değişikliği değil, remount'tur, CSS ile önlenemez. İskelet gerçek
   içeriğin yaklaşık yüksekliğini ayırmazsa büyük bir CLS üretir. 14
   Ağustos'ta bu, `/oku` dahil onlarca sayfada ölçülen ikinci büyük CLS
   kaynağıydı (henüz tam kapanmadı — bkz. `tasks/todo_agu13_2026.md` Z3-V).
   Mümkünse veriyi sunucu tarafında sağla (RSC/build-time fetch); istemci
   tarafı fetch şartsa, iskelete `minHeight` ile gerçekçi bir yer ayır.

7. **Sayfaya çıkan HİÇBİR metinde geliştirici jargonu olamaz.** Dosya
   yolu, fonksiyon adı, `CLAUDE.md`/`§13.x` referansı, `useState`/`commit`
   gibi kod terimleri — makale gövdesi, kaynakça, i18n dizesi FARK ETMEZ,
   ekrana çıkan hiçbir alanda olamaz. → §13.27, push öncesi zorunlu:
   `node scripts/audit-internal-leak.mjs --ci`

8. **Push'tan önce ölç, iddia etme.** Kontrast (`audit-contrast.mjs`),
   renk sistemi (`audit-colors.mjs`), iç mimari sızıntısı
   (`audit-internal-leak.mjs`) — üçü de scriptli, üçü de "bence" ile
   atlanamaz. Yeni bir sayfa/bileşen bunlardan birini büyütüyorsa
   (yeni renk, yeni metin alanı, yeni veri dosyası), ilgili script'i
   **o sayfaya karşı** çalıştır, tabanın büyümediğini doğrula.
   > **Renk sistemi ve iç mimari sızıntısı artık otomatik.** `git push`
   > denemesi `.claude/hooks/pre-push-guard.mjs` (PreToolUse hook)
   > tarafından yakalanır, ikisi de kırmızıysa push **engellenir** — agent
   > "unuttum" diyemez. Kontrast sunucu gerektirdiği için hook'un
   > kapsamı DIŞINDA, elle çalıştırılması gerekir (hook bunu hatırlatır).
   > 14 Ağustos'ta kayda değer: hook ilk çalıştığında GERÇEK bir ihlal
   > yakaladı — aynı turda eklenen 6 yeni kategori rengi token'a
   > bağlanmadan raw hex olarak kalmıştı (§13.25 taban 184→188).

9. **Bir Tefekkür makalesi ekliyor/düzenliyorsan önce
   `tasks/to_do_tefekkur.md`'yi oku.** O dosyanın kendi ENFORCE ALWAYS
   kuralları var (epistemik disclaimer sistemi, Felsufi'ye sadakat, ayet
   referans formatı, `relatedTools` dize-dizisi zorunluluğu…) — buraya
   kopyalanmadı, tek kaynak orada. → §13.29

10. **Bir kaynağa (âlim, kitap, makale, tarihî kayıt) atıf yazıyorsan,
    yazmadan ÖNCE o kaynaktan bizzat doğrula.** "Muhtemelen doğrudur"
    bir atıf için yeterli değil — WebSearch/WebFetch ile teyit
    edilmeden yazar adı, eser adı, cilt/sayfa/yıl veya alıntı metni
    yazılamaz. → §13.30

11. **Bir sayfa yüzlerce/binlerce nesne render ediyorsa (3D graf, canvas,
    büyük liste), draw call sayısını düşürmek TEK BAŞINA yetmeyebilir —
    GPU fill-rate/overdraw AYRI bir maliyet.** 14 Ağustos'ta `/graf/ayet`
    (6236 düğüm + 10653 bağlantı, `react-force-graph-3d`) TBT'si ~4.7s
    idi. Node+link'i `THREE.InstancedMesh`'e taşıyıp draw call'ı
    **12.145 → 8**'e indirmek (`renderer.info.render.calls` ile ölçüldü)
    TBT'yi **DEĞİŞTİRMEDİ.** Sebep: ~4.9M üçgen + yarı-saydam (alpha
    blend) yüzeylerin GPU-taraflı rasterizasyon maliyeti — CPU profilinin
    call-tree'sinde %93.8 örneğin **HİÇ JS stack'i yoktu** (GPU tarafı).
    Küre segment sayısını (16×16→6×5) düşürmek TEK BAŞINA TBT'yi 4.2s→2.1s
    indirdi — draw call'dan bağımsız, saf geometrik karmaşıklık. **Ders:**
    hem `renderer.info.render.calls` (draw call) HEM `.triangles` (geometri
    karmaşıklığı + overdraw riski) ölç; biri düşse de diğeri darboğaz
    olabilir. Uzak/küçük nesneler için düşük-poli (LOD) kullan, yalnız
    yakınlaşan/seçili nesnede tam detay tut. → `tasks/todo_agu13_2026.md`
    "VerseGraph TBT" notu (14-15 Ağustos, iki ayrı tur).

12. **Bir CLS fix'inin STİLİNİN uygulandığını doğrulamak, fix'in
    İŞE YARADIĞINI doğrulamak DEĞİLDİR — ikisini ayrı ölç.** 15 Ağustos'ta
    ReadingMode'da `minHeight` eklenip `getComputedStyle` ile (kaymanın
    TAM ANINDA, `PerformanceObserver` callback'i içinde) canlı doğrulandı
    — stil gerçekten uygulanmıştı. Yine de ölçülen CLS **hiç değişmedi**;
    tarayıcının `layout-shift` olayı elementin `previousRect`'ini
    `{0,0,0}` raporlamaya devam etti, normal CSS modeliyle açıklanamayan
    bir sonuç. Kök sebep bu ortamda (Playwright+CDP, gerçek DevTools
    Performance trace'i olmadan) izole edilemedi. **Ders:** "stil
    uygulandı" ≠ "kayma düzeldi" — HER ZAMAN fix sonrası gerçek CLS
    sayısını (`scratch-cls.mjs` tarzı bir `PerformanceObserver` ölçümü)
    tekrar ölç; computed-style kontrolü tek başına yeterli kanıt değildir.

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

### 13.10 Overlay/Modal Başlık Stili — OVERLAY_TITLE (⚠ DEPRECATED for tool pages)

> **2026-06-14 itibariyle tool sayfalarında DEPRECATED.** Tool sayfaları artık full-page route layout'unda `ToolHeader` component'ı kullanır (bkz. §13.17). `OVERLAY_TITLE` token'ı yalnızca **gerçek modal/dialog** UI'larında geçerlidir: settings modal, search modal, parallel/intercepting route modal'ları, in-page detail panel'ler.

Eski pattern (sadece gerçek modal için):
```jsx
import { OVERLAY_TITLE } from '../tokens';

<span style={OVERLAY_TITLE}>{language === 'tr' ? 'Modal Başlığı' : 'Modal Title'}</span>
```

`OVERLAY_TITLE` = `{ color: COLORS.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, margin: 0 }`

- ❌ YASAK: Tool sayfası ana header'ında — onun yerine `<ToolHeader />` kullan (§13.17).

---

### 13.11 Kapat Butonu — CLOSE_BTN (⚠ DEPRECATED for tool pages)

> **2026-06-14 itibariyle tool sayfalarında DEPRECATED.** Tool sayfaları full-page route'tur (modal değil), × close button gerekmez. Browser back navigation veya tool kataloğu üzerinden geri dönülür.
>
> `CLOSE_BTN` token'ı yalnızca **gerçek modal/dialog** UI'larında (in-page detail panel, settings/search modal) geçerlidir.

Eski pattern (sadece gerçek modal için):
```jsx
import { CLOSE_BTN, COLORS } from '../tokens';

<button onClick={onClose} style={{ ...CLOSE_BTN }}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
</button>
```

`CLOSE_BTN` = `{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:COLORS.silver, cursor:'pointer', transition:'all 0.15s', flexShrink:0 }`

- ❌ YASAK: Tool sayfası ana header'ında × button — route navigation yeterli.
- ❌ YASAK: `borderRadius: '8px'` veya `'6px'` (modal context'inde de) — her zaman tam daire (`50%`).
- ❌ YASAK: Text `×` veya `✕` — SVG icon kullanılır.

---

### 13.13 Navbar Buton Yüksekliği — Eşitlik Kuralı

Navbar sağındaki tüm butonlar aynı yükseklikte olmalıdır.

- **"Kur'an'ı Oku" CTA butonu:** `height: '32px'`
- **Dil seçici (TR/EN) butonu:** `height: '32px'`
- ❌ YASAK: Farklı yükseklikler (örn. biri 30px diğeri 36px)

#### ⚠ Sabit yükseklik `white-space: nowrap` OLMADAN geçerli değildir (2026-08-13)

Sabit `height:32px` + sarabilen metin = **metin butonun kenarlığının dışına
taşar.** Ölçülen: 1024px'te "Kur'an'ı Oku" / "Read Quran" iki satıra sarıyor
(metin kutusu 40px), buton 32px'te kalıyor → **+3px taşma**, navbar 82px'ten
TR 108 / EN 134px'e şişiyor. İki dilde, 74 rotanın hepsinde.

Kural bu yüzden **dört** parçalıdır — biri eksik olursa hata geri gelir:

1. **`minHeight: '32px'`** — `height` DEĞİL. Sabit yükseklik, büyüyebilen içeriği
   kutunun dışına iter. `minHeight` ile kutu içerikle birlikte büyür.
   Dikey dolgu **3px** (beş kombinasyon ölçüldü: 6px → varsayılan fontta buton
   38px olur ve eşitlik kuralı bozulur; 0px → büyütülmüş fontta kutu büyümez,
   metin 4-5px taşar; **3px → varsayılan 32px eşit, büyütmede kutu büyüyor**).
2. **`white-space: nowrap`** — navbar'daki her buton/bağlantı için zorunlu
   (`globals.css`, mega-menü panelleri hariç: orada çok satırlı açıklama var).
3. **1024–1279 kompakt ölçek** — nowrap tek başına yatay taşma üretir. Ölçülen
   ihtiyaç: nowrap ile satır TR 1.044px, EN 1.113px; masaüstü navbar `lg:`
   (1024) açılırken içeriği o genişliğe **sığmıyordu**. Uygulama: `globals.css`
   media query'si üç CSS değişkeni set eder (`--nav-trigger-pad`,
   `--nav-trigger-fs`, `--nav-cta-pad`). Inline stiller bu değişkenleri
   fallback'li okur → **`!important` gerekmez**.
4. **`flex-wrap: wrap` emniyet ağı** — içerik gerçekten sığmazsa satır sarsın,
   öge ekran dışına **taşmasın**. Kullanıcı tarayıcı fontunu 20px'e çıkarınca
   1024'te CTA ekranın sağından taşıp **kırpılıyordu**; kırpılma yatay kaydırma
   üretmediği için sayısal test kaçırdı, **ekran görüntüsü yakaladı**.
   Varsayılan fontta bu kural hiç devreye girmez.

> **Ders:** hata bir "breakpoint hatası" sanılmıştı; ölçünce **sabit-yükseklik
> hatası** olduğu görüldü — root font 20px'te 1440px'te bile taşıyordu.
> Kompakt katman yalnız 1024 vakasını örtüyordu.

**Doğrulama (her navbar değişikliğinde) — 22 koşu:**
genişlik `1024 · 1080 · 1180 · 1279 · 1280 · 1440 · 390` × dil `tr/en`
× root font `16px · 20px · 22px`
```js
nav.getBoundingClientRect().height                    // varsayılan fontta 81–82px
range.getBoundingClientRect().bottom - btn.bottom     // ≤ 2px (Arapça glif payı)
el.getBoundingClientRect().right <= innerWidth        // ← EN KRİTİK ölçüt
document.documentElement.scrollWidth === clientWidth  // true
new Set(butonYükseklikleri).size === 1                // varsayılan fontta eşitlik
```
⚠ **`scrollWidth === clientWidth` TEK BAŞINA YETMEZ.** Kırpılan öge yatay
kaydırma üretmez; iki kez bu yüzden "geçti" dedim, ikisinde de **ekran
görüntüsü** hatayı gösterdi. Sağ-kenar kapsama ölçütünü ve gözle bakmayı atlama.

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
| ۪ (Uthmani kasra/asar) | `U+06EA` | Asar (küçük çizgi) kasra formu | **BAĞLAMA BAĞLI** (mutlak değildir): ① **ReadingMode / InterlinearView** (CSS tecvid overlay pipeline VAR) → `cleanArabic()` **KORUR**; font `subscriptalef` glyph'i ile dikey küçük çizgi (asar) olarak render eder. ② **Diğer TÜM bileşenler** (section, atlas kartı, ayet listesi, graf — overlay YOK) → `cleanArabicForDisplay/Graph/Minimal` **U+0650 (ِ) standart kasra'ya DÖNÜŞTÜRÜR**; aksi halde daire/tofu görünür. Otorite = `next/src/lib/arabic.js` (kod). Build script'leri overlay'siz olduğu için **her zaman dönüştürür** (§13.15 build kuralı, satır ~365). |
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

### 13.17 ToolHeader Pattern — TOOL SAYFASI STANDART HEADER (2026-06-14+)

**Tüm tool sayfaları (`/arac/*`, `/atlas/*`, `/graf/*`) sticky `ToolHeader` component'ını kullanır.** Custom modal header (`position:fixed` + × button + `OVERLAY_TITLE`) **artık YASAK** — tool sayfaları full-page route layout'undadır.

#### Outer Wrapper

```jsx
return (
  <div style={{
    background: COLORS.cosmicBlack,
    minHeight: 'calc(100vh - 62px)',
    display: 'flex', flexDirection: 'column',
    paddingTop: '62px', // Navbar yüksekliği
  }}>
    <ToolHeader
      icon={<svg /* gold stroke SVG */ />}
      titleTr="Sayfa Adı"
      titleEn="Page Name"
      subtitleTr="Gri ton açıklayıcı alt başlık"
      subtitleEn="Gray secondary description"
      language={language}
      chip={/* opsiyonel JSX badge */}
    />
    {/* Body ve içerik */}
  </div>
);
```

#### ToolHeader Pattern Spec (read-only — bkz. `next/src/components/ToolHeader.jsx`)

- **Pozisyon:** `position: sticky; top: 62px; z-index: 40` — Navbar'a yapışır, çakışma yok
- **Yükseklik:** `48px`
- **Background:** `rgba(8,10,18,0.94)` + `backdropFilter: blur(20px)`
- **Border-bottom:** `1px solid rgba(212,165,116,0.10)`
- **Inner container:** `max-w-7xl mx-auto px-4 lg:px-8` → **Navbar logo ile birebir sol kenar hizası** (kullanıcı tutarlılık feedback'i 2026-06-14)
- **Layout:** `[icon] [OVERLAY_TITLE title] · [gri subtitle] [opsiyonel chip]`

#### YASAKLAR

- ❌ **YASAK:** `position: 'fixed', inset: '54px 0 0 0'` veya `inset: '62px 0 0 0'` modal wrapper — full-page route layout kullan.
- ❌ **YASAK:** `role="dialog"` + `aria-modal="true"` — tool sayfası modal değildir.
- ❌ **YASAK:** Custom header'da × close button (`CLOSE_BTN`) — route navigation yeterli (`onClose` prop opsiyonel; sadece Escape key handler için tutulabilir).
- ❌ **YASAK:** Custom header inline (`<div style={{padding: '0 20px', height: '54px', ...}}>` + title + close) — `<ToolHeader />` kullan.
- ❌ **YASAK:** `body+html` scroll lock — full-page route'larda gerekmez (window scroll doğal akışta).

#### Refactor Referansları

Bu pattern'a uygun sayfalar (örnek): İlk-Son Kelimeler, Münâfık Profili, Sünnetullah Atlası, Cennet & Cehennem, Melekler, Kıyâmet, Zaman Boyutları, Buyruklar, Sebebi-Nüzûl, Dualar, KissaAtlas, WordHeatmap, SurahComparator, RevelationTimeline.

**İstisna:** Interactive fullscreen canvas tool'ları (VerseGraph, ConceptGraph) — immersive UX için modal pattern korunur. EsmaFrekans — kendi flagship pattern'ında.

---

### 13.18 Cinematic Hero — PREMIUM TEMPLATE (2026-06-14+)

**Tool sayfası Hero'su standart Premium Template'i takip eder.** Sırayla:

1. **Bismillah ornament** — `﷽` Amiri Quran font, gold (#d4a574), opacity 0.82, centered
2. **Anchor verse** — KFGQPC font, gold, lineHeight 2.1, **maksimum 1 ayet**, U+0650 standart Unicode (§13.15)
3. **İtalik çeviri** — Playfair Display italic, off-white, max-w 660px
4. **Reference label** — UPPERCASE, letterSpacing 0.16em, silver, opacity 0.65 (örn: "— Bakara 2:186")
5. **Framing whisper** — Playfair italic, silver, max-w 700px, "şu sayfa neyi anlatır" cümlesi (em vurguları gold)
6. **Filigree divider** — 120px gold gradient horizontal
7. **Eyebrow** — UPPERCASE 0.3em letterSpacing, gold opacity 0.72 (örn: "İLAHÎ ÖRÜNTÜ · TARİHİN YASASI")
8. **H1 title** — Playfair, off-white, `clamp(1.6rem, 7vw, 2rem)` mobile / `clamp(2rem, 3.6vw, 2.7rem)` desktop
9. **Dramatic subtitle** — Playfair italic, gold, `clamp(1.05rem, 1.8vw, 1.18rem)`

#### Anchor Verse Renk Kuralı

- ✅ **STANDART:** `COLORS.gold` (#d4a574 antika altın — §4 Primary accent)
- ❌ **YASAK:** `COLORS.royalGold` (#c9a227) — Secondary accent, anchor verse için kullanma. Sünnetullah'ta hatalı kullanılmıştı, 2026-06-15 standartlaştırıldı.

#### Hero Container

```jsx
<div style={{
  padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
  background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
  borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
  textAlign: 'center',
}}>
  {/* 9 element yukarıdaki sırayla */}
</div>
```

---

### 13.19 Sticky Tab Bar — MELEKLER-REFERENCE PATTERN (2026-06-14+)

**Tab bar `position: sticky; top: 110px` ile Navbar+ToolHeader altına yapışır.** Background **mutlaka opak** olmalı, transparan rgba kullanmak scroll'da sızmaya yol açar.

```jsx
<div id="X-tab-bar" style={{
  display: 'flex', gap: '2px',
  padding: isMobile ? '0 8px' : '0 16px',
  borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
  background: 'rgb(6, 8, 14)',          // OPAQUE — rgba(...,0.97) DEĞİL
  backgroundColor: 'rgb(6, 8, 14)',      // Bulletproof: hem background hem backgroundColor
  isolation: 'isolate',                  // Stacking context guard
  position: 'sticky',
  top: '110px',                          // 62px Navbar + 48px ToolHeader = 110px
  zIndex: 20,
  scrollMarginTop: '120px',
  overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
}}>
  {TABS.map((tab, i) => (
    <button
      onClick={() => {
        setActiveTab(i);
        setTimeout(() => {
          document.getElementById('X-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }}
      style={{
        padding: isMobile ? '14px 16px' : '16px 26px',
        fontSize: isMobile ? '0.72rem' : '0.78rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',         // UPPERCASE site-wide standardı
        fontWeight: activeTab === i ? 700 : 500,
        color: activeTab === i ? COLORS.gold : COLORS.silver,
        borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
        background: activeTab === i ? COLORS.goldAlpha15 : 'transparent',
        // ...
      }}
    >
      {/* icon + label */}
    </button>
  ))}
</div>
```

#### YASAKLAR

- ❌ **YASAK:** `background: 'rgba(10,10,26,0.97)'` — transparan; scroll'da arkadaki kartlar sızar (user 2026-06-14'te 3 kez raporladı).
- ❌ **YASAK:** `backdropFilter: 'blur(20px)'` sticky tab bar'da — render gecikmesi + sızma.
- ❌ **YASAK:** `top: 0` — ToolHeader altında 48px boşluk yok, çakışır. Daima `top: '110px'`.
- ❌ **YASAK:** Tab label lowercase — UPPERCASE site-wide pattern.
- ❌ **YASAK:** Body container'da `padding-top` — sticky tab bar'ı padding'in altından sticky'ler, gap'ten içerik sızar. Body padding-top 0 olmalı; Hero kendi padding'ini içeride versin.

---

### 13.20 CrossToolCTA Pattern (2026-06-14+)

**Sayfa sonunda 2-3 ilgili tool linkine yönlendiren CTA strip.** Reusable component: `next/src/components/CrossToolCTA.jsx`.

```jsx
import CrossToolCTA from './CrossToolCTA';

<CrossToolCTA
  language={language}
  isMobile={isMobile}
  links={[
    { href: `/${language}/arac/X`, titleTr: 'Tool Adı', titleEn: 'Tool Name', descTr: '1 cümle açıklama.', descEn: '1 sentence description.' },
    // 2-3 link
  ]}
/>
```

#### Spec

- **Eyebrow:** "DAHA DERİNE — İLGİLİ ARAÇLAR" / "GO DEEPER — RELATED TOOLS" (opsiyonel `labelTr`/`labelEn` ile override)
- **Grid:** Mobile 1-col, Desktop `repeat(N, 1fr)` (N max 3)
- **Kart:** Gold title + → arrow + gri açıklama
- **Hover:** `translateY(-2px)` + brighten

#### Kullanım Yeri

Sayfa sonunda, ana içerik bittikten sonra. Pages: Cennet/Cehennem, Kıyâmet, Nefs Mertebeleri, Sünnetullah Atlası vd.

---

### 13.21 SourcesCitation Pattern (2026-06-15+)

**Sayfa sonunda klasik tefsir kaynaklarını listeleyen callout.** Reusable component: `next/src/components/SourcesCitation.jsx`.

```jsx
import SourcesCitation from './SourcesCitation';

<SourcesCitation
  language={language}
  isMobile={isMobile}
  sources={[
    {
      author: 'er-Râzî',
      workTr: "Mefâtîhu'l-Ğayb",
      workEn: 'Mafātīḥ al-Ghayb',
      period: '1149–1209 (Rey)',
      noteTr: 'Sayfaya özel açıklama (1 cümle).',
      noteEn: 'Page-specific note (1 sentence).',
    },
    // 2-6 kaynak
  ]}
/>
```

#### Spec

- **Eyebrow:** "KLASİK KAYNAKLAR" / "CLASSICAL SOURCES"
- **Grid:** Mobile 1-col, Desktop 2-col
- **Kart:** Gold author + italic work + gri period + opsiyonel note
- **Container:** Soft gold border + 0.03 gold tint

#### Kullanım Yeri

Sayfa sonunda (CrossToolCTA üstünde veya altında). Pages: Münâfık, Nefs, İblis (sayfaya özel klasik tefsir referansları).

**İstisna:** Zaten kendi içsel "Kaynaklar" tab'ı olan sayfalar (KavimlerAtlasi, KiyametSahneleri, Melekler, CennetCehennem, ZamanBoyutlari, KuranYeminleri, SebebiNuzul) — SourcesCitation eklenmez (duplicate).

---

### 13.22 Yeni İçerik → RAG Corpus + Embedding — MUTLAK PIPELINE (2026-07-15+)

**Her yeni content JSON (`next/public/*.json`) veya yeni tool route eklendiğinde RAG Concierge corpus'una registration + embedding rebuild MUTLAKA yapılmalıdır. Aksi halde `/sor` (Concierge) yeni içerikten haberdar olmaz, arama sonuçlarında görünmez.**

Bu kural istisnasızdır — yeni bir Atlas, arac, article, kavram data'sı eklendiğinde sıra:

#### Adım 1 — `next/scripts/corpus-sources.mjs` düzenle

**A) CONTENT_SOURCES array'ine yeni source ekle:**

```js
{
  type: 'atlas-<isim>-<alt-tur>',  // örn. atlas-ahiret-yolculugu-stage
  file: 'public/<yeni-dosya>.json',
  extract: (data) => data.<items-key> || [],  // JSON root'ta items key
  buildItem: (item) => ({
    id: `atlas-<isim>:${item.id}`,
    type: 'atlas-<isim>-<alt-tur>',
    subId: item.id,
    titleTr: item.titleTr || '',
    titleEn: item.titleEn || '',
    descTr: (item.descTr || '').slice(0, 200),
    descEn: (item.descEn || '').slice(0, 200),
    // KRİTİK: searchTextTr/En Concierge'in embedding'te aradığı ana metin.
    // Zengin olmalı: title + description + narration + anchor verse + tafsir
    // + critical note. slice(0, 5000) — 1 chunk maksimum.
    searchTextTr: `${item.titleTr}. ${item.descTr}. ${item.narrationTr || ''} ...`.slice(0, 5000),
    searchTextEn: `${item.titleEn}. ${item.descEn}. ${item.narrationEn || ''} ...`.slice(0, 5000),
  }),
},
```

**B) TOOL_CATALOG array'ine tool route entry ekle:**

```js
{
  route: '/atlas/<yeni-route>',
  titleTr: '<İsim>',
  titleEn: '<Name>',
  descTr: '<Kısa açıklama Türkçe>',
  descEn: '<Short description English>',
  keywords: ['anahtar', 'kelimeler', 'kullanıcı-arayacağı-terimler']
},
```

#### Adım 2 — Corpus rebuild

```bash
cd next && npm run embed:corpus
```

Çıktıda yeni tipin count'unu doğrula:
```
   ✓ atlas-<isim>-<alt-tur>  →     N items
```

#### Adım 3 — Embedding rebuild (INCREMENTAL — sadece yeni item'lar)

```bash
node scripts/build-embeddings.mjs
```

Log'da doğrula:
- `New/changed: N` — sadece yeni item sayısı (mevcut değil).
- `Reused ~12495 existing embeddings` — mevcut hash'ler dokunulmadı.
- `Estimated cost: $0.00XX` — trivial (yeni item × ~1000 token × $0.010/1M).

**Hash-based incremental** — `corpus-manifest.json` (SHA256 hash tracking) sayesinde mevcut ayet + tefsir + atlas embed'leri **hiç re-run olmaz**. Yalnızca yeni + değişen item'lar API'ye gider.

#### Adım 4 — Vercel size verify

```bash
wc -c next/src/lib/corpus-embeddings.json | awk '{printf "%.1f MB\n", $1/1024/1024}'
```

**Vercel function limit: 250 MB uncompressed.** Şu an ~196 MB (54 MB marj). Corpus 240 MB'a ulaşırsa `strip-meal-vectors.mjs` gibi optimizasyon script'i devreye alınmalı.

#### Adım 5 — Deploy sonrası verify

Prod'da `/tr/sor` üzerinden yeni içerikle ilgili bir query yaz — sonuçta görünmeli.

#### Neden Zorunlu

- Concierge (`/sor`) sadece embed edilmiş chunk'ları arar. Corpus'a eklenmeyen içerik "yok" gibidir.
- Kullanıcı yeni tool'u menü'de görüp içeriği okuyabilir, ama Concierge'e "sekerât nedir?" sorduğunda cevap gelmez → **kırık deneyim**.
- Sitenin RAG mimarisi (bkz. `docs/rag-architecture.html`) bu single source of truth prensibine dayanır.

#### Bilinen İstisnalar (Yok)

**Her yeni content JSON bu pipeline'a dahil edilir.** İstisna: sadece componentte hardcoded UI metinleri (menü label, footer) — bunlar Concierge kapsamında değil zaten.

**Kural ihlali sonucu:** Geçmişte esma-frekans veya doga atlas eklendiğinde bu pipeline atlanırsa `/sor` "esma nedir?" sorusuna klasik ayet sonuçları döner, tool sayfası link'i vermez. Kullanıcı deneyimi kaybı yaşanır. Bu kural 2026-07-15'te Ahiret Yolculuğu eklendikten sonra explicit yazıldı (kullanıcı hatırlatması).

---

### 13.23 Regresyon Prevention — PUSH ÖNCESİ MUTLAK VERIFY (2026-07-15+)

**Her push öncesi, yeni kodun mevcut çalışan bir özelliği bozmadığından EMIN ol. Vercel auto-deploy = live prod = kullanıcı stale tab 404 riski. Regresyon push edilirse geri alma pahalı.**

Kural: **Değişiklik scope'una göre 3 seviyeli verify pipeline'ı çalıştır.**

#### Seviye 1 — Minor edit (tek satır, string change, typo fix)

- Dev server başlat (`npm run dev`)
- Etkilenen sayfaya HTTP curl → 200 kontrolü
- Compilation warning/error yok mu?
- **Push edilebilir.**

#### Seviye 2 — Component/route değişikliği (yeni fixler, JSON edit, prop refactor)

Yukarıdakilere ek:
- Etkilenen sayfayı localhost'ta manuel gez (mobile + desktop viewport)
- Sayfada JavaScript console error var mı?
- SSR/hydration mismatch warning var mı?
- İlişkili ~3 sayfayı sample test et (menü'den erişilenler)
- Değişiklik `data/*.jsx` (menü) ise: item count değişmediğini verify et (`grep -c "titleTr:"`)
- Değişiklik `public/*.json` ise: build script rebuild + §13.15 problem chars: 0 verify

#### Seviye 3 — Cross-cutting refactor (tokens.js edit, shared component, corpus schema)

Yukarıdakilere ek:
- Etkilenen tüm tool'ları localhost'ta gez (min 5 sample tool)
- `git diff --stat` → değişen dosya sayısı ve satır sayısı ile risk assessment
- Mobile'da `~/dev-tools` viewport test (390px, 640px, 1024px)
- Screenshot al (görsel regresyon check)
- RAG değişiklik ise: `/tr/sor` test query → sonuç doğru mu?

#### Genel Kurallar

**A) Değişiklik boyutu → verify süresi:**
| Diff satır | Verify süresi | Seviye |
|---|---|---|
| < 50 | 5 dk | Seviye 1 |
| 50-500 | 15 dk | Seviye 2 |
| 500+ | 30-60 dk | Seviye 3 |

**B) Yasaklar:**
- ❌ `git push` öncesi hiç localhost test yapmadan
- ❌ `git push --force` (destructive, backup yok)
- ❌ `git push` mesai dışı (kullanıcı feedback yapamaz → sabaha kırık kalır)
- ❌ Cross-cutting refactor'ı tek commit'te push (küçük parçalara böl)
- ❌ `git push` çalıştırırken açık bir soruna dair unresolved warning varsa (log'da error, TypeScript error, missing import, hydration mismatch)

**C) Regresyon çıkarsa protokol:**
1. **Panic revert:** `git revert HEAD` + `git push` (yeni commit, geriye alır — ForcePush YASAK)
2. Root cause bul (localhost reproduce)
3. Fix + testler + tekrar push

**D) Kritik korunacak flow'lar (her değişiklikte break check et):**
- `/tr` anasayfa → tüm section'lar render oluyor mu
- `/tr/oku` → Reading Mode + Kur'an metni yükleniyor mu
- `/tr/sor` → Concierge çalışıyor mu (API 200 + result render)
- Navbar mega-menu (Keşfet + Araçlar + Tefekkür) → tüm dropdown açılıyor mu
- Mobile drawer → tüm section'lar hamburger açılınca görünüyor mu
- Bookmark button → toggle çalışıyor mu, /kutuphanem'de item görünüyor mu
- Language switcher → TR ↔ EN switch bozmuyor mu

**E) Değişiklik commit mesajında verify raporu**

Commit mesajının sonuna ekle:
```
Verify:
- Localhost tested: /tr/atlas/ahiret-yolculugu, /tr, /tr/sor
- Item count preserved: 25/25 explore, 19/19 tools
- Compilation: clean, no warnings
- HTTP: 200 all routes
- No hydration errors in server log
```

Bu rapor gelecek regresyon debugging için audit trail bırakır.

#### Bu Kural Neden Yazıldı

Geçmişte (2026-07-14) admin panel infinite render loop → 500K KV limit exceeded olmuştu. Localhost test edilmemişti; regression prod'a çıktı. Kullanıcı fark etti, tersine mühendislikle çözüldü. Bu kural 2026-07-15'te Ahiret Yolculuğu Faz 2 push sonrası kullanıcı hatırlatmasıyla explicit yazıldı.

**Prensip:** Push edilen kod → live prod → gerçek kullanıcı. Test etmeden gönderme.

---

### 13.24 İ'câz-ı İlmî / Bucaillism Çerçevesi — İÇERİK TONU (ENFORCE ALWAYS) (2026-07-26+)

**Kur'an ile bilim / tarih / arkeoloji ilişkisine değinen HER içerik** (`bilimsel-isaretler`, `tarihsel-kanitlar`, `MathMiracle` ve benzeri her yeni/mevcut madde) aşağıdaki çerçeveyle yazılır. İstisnasız.

#### İlke
Kur'an Allah kelamıdır ve harfi harfine doğrudur; hakikati **beşerî keşiflere / değişken bilime muhtaç değildir.** İçerik, bilimi/arkeolojiyi Kur'an'ın "hakemi" konumuna **koymaz.**

#### YASAK — apolojetik aşırılık (Bucaillism)
- ❌ "Bilim/arkeoloji Kur'an'ı **ispatladı/kanıtladı**" çerçevesi.
- ❌ "Bu bilgi 7. yy'da **bilinemezdi** → mucize" argümanı (çoğu kez tarihsel olarak yanlış; örn. mumyalamayı Herodot MÖ 5. yy'da anlatmış).
- ❌ Muğlak bir kelimeye modern bilimsel anlamı **geriye-yükleme** ("kesin karşılığı budur").
- ❌ Modern bulguyu/ismi (Ramesses, Hubble, Moore, Galton…) **klasik tefsirin ağzına koymak** ("klasik tefsirde de tartışıldı").
- ❌ Kur'an'ı belirli/çürük/tartışmalı bir bilimsel iddiaya **bağlamak** (bilim değişince Kur'an düşmüş görünür).
- ❌ Bucaille'ı omurga referans yapmak; "akademik olarak kabul görür" gibi **yanlış** genellemeler.
- ❌ Doğrulayamadığın spesifik atıf (sayfa no, tarih-kişi eşleştirmesi) yazmak — genel atıf ver.
- ❌ **TASDİKİN YÖNÜ — "bilim/tarih/arkeoloji tasdik eder / confirms / proves"** (bilimi/arkeolojiyi Kur'an'ın **hakemi/doğrulayanı** yapan her ifade). Tasdikin öznesi bilim/arkeoloji **olamaz**. Yalnızca şu geçerli: **"Kur'ân haber verir, BİZ tasdik ederiz; bulgu tefekküre vesiledir."** "Bilim tasdik eder" dersen Kur'an'ın doğruluğu bilimin onayına **bağımlı** hâle gelir; bilim değişince Kur'an düşmüş görünür (çürüyen bizim iddiamızdır, Kur'an değil). Aynı yasak: "confirmed by archaeology", "kanıt/proof/evidence" başlık dili, "bilimin X yıl sonra keşfettikleri" (= gizli "bilinemezdi→mucize" çerçevesi). Örtüşme ifade edilecekse **"örtüşür / coincides / aligns / dikkat çekici uyum"** kullanılır — asla "doğrular/confirms/proves". Bu incelik iki kez ihlal edildi (Kehf 300/309; "Bilim Tasdik Eder" başlık önerisi), kullanıcı 2026-07-26 explicit uyardı.

#### YASAK — ters uç (gereksiz reddediş)
- ❌ Bulguları "hiçbir şekilde ilişkilendirilemez" diye **gereksiz reddetmek.**
- ❌ Kur'an metnine/hakikatine **şüphe** düşürecek karşı-argüman **eklemek** (kesinlikle yasak — bkz. memory `feedback_quran_supremacy_framing`).

#### DOĞRU çerçeve (orta yol)
- ✅ "**Kur'an haber verir, biz tasdik ederiz; bulgular tefekküre vesiledir.**"
- ✅ Örtüşme "**kanıt**" değil, "**uyum / temas / tefekkür**" seviyesinde sunulur.
- ✅ **Klasik tefsir asıl/otoritedir**; modern okuma en fazla "bir anlam katmanı / ihtimal."
- ✅ Tartışmalı yer açıkça "ihtilaflı / kesinleşmemiş" diye işaretlenir (`criticalNote`).
- ✅ Başlık/dil "Kanıt/Mucize" yerine "Tarihsel Bağlam / Temas Noktaları / İşaretler."

> **Yön:** Bu yumuşatma **Kur'an lehinedir** — zayıf apolojetik halkaları (Bucaillism) kaldırıp Kur'an'ı değişken bilime rehin olmaktan kurtarır. **Karşı tarafa (eleştirmene) taviz DEĞİLDİR.**

#### Framing mantığı (neden bu tutum Kur'an LEHİNE — taviz değil)
1. **Bucaillism nedir:** Maurice Bucaille (1976) tezi — "Kur'an modern bilimle örtüşür ve bu 7. yy'da bilinemezdi → bilimsel mucize/ispat." Yöntemi seçmeci + geriye-yükleme; hem akademi hem birçok ehl-i ilim eleştirir.
2. **Apolojetik overclaim = Kur'an'ın zayıf karnı:** "Bilim şunu **kanıtladı**" dersen, o bilimsel iddia çürütüldüğünde (ör. embriyoloji 'kan pıhtısı' eleştirisi, Hâmân-hiyeroglif iddiasının fringe'liği) naif okuyucu **"Kur'an çürütüldü"** sanır. Çürüyen bizim iddiamızdır, Kur'an değil — ama zarar Kur'an'a yazılır. Zayıf halkayı kaldırınca eleştirmenin saldıracağı yüzey kalmaz.
3. **Rehin verme sorunu:** Kur'an'ı belirli/değişken bir bilimsel iddiaya **bağlamak**, itibarını o iddianın kaderine rehin eder. Bilim değişir; bağ düşerse Kur'an düşmüş görünür.
4. **Ayrıştırma stratejisi:** Kur'an'ı savunmak ≠ Bucaille'ı savunmak. İkisi ayrılınca, iddia/Bucaille saldırıya uğrasa bile **Kur'an sağlam kalır.** Güçlü savunma budur.
5. **Daha güçlü teolojik konum:** "Kur'an haber verir, biz tasdik ederiz; bilim olsa olsa tefekküre vesiledir" — Kur'an'ı **kendi kendine yeten hakikat** kılar, bilimin onayına muhtaç bir metin olmaktan çıkarır (yükseltir).
6. **Sıfır taviz:** Hiçbir ayet "yanlış" denmez, Kur'an'a şüphe düşürecek hiçbir karşı-argüman eklenmez. Yalnızca **bizim beşerî ispat iddiamız** uyum/tefekkür seviyesine çekilir. Kur'an'ın içeriğinde/hakikatinde taviz **yoktur.**

> Bu mantık GPT-5.2 hakem incelemesinde de teyit edildi: *"iddia seviyesini doğru ölçekliyor; Kur'an'ı zayıflatmak sayılmaz, bilakis Kur'an'ı modern teyide mahkûm etmeme ilkesi makuldür"* — ve fazla reddedişe (bulguları "hiç ilişkilendirilemez" demeye) de kaçmamak gerektiği notuyla.

#### İSTİSNA — Tefekkür bölümü (kullanıcı kararı 2026-08-12)
**`/tefekkur` altındaki yazılar bu hakem sürecinin DIŞINDADIR.** Gerekçe: bunlar
sitenin editoryal iddiaları değil, **yazarın (Felsufi) kendi imzalı görüşleridir**;
`canonicalUrl` ile özgün yayına bağlıdır ve `author` alanı taşır. Bir yazarın kendi
düşüncesini ChatGPT'ye onaylatmak anlamsızdır. Yazı bilim–din ilişkisine değse bile
(ör. `evrim-inanc-resimler`) hakem turu ÇALIŞTIRILMAZ.
Bu istisna **yalnız `/tefekkur`** içindir; `bilimsel-isaretler`, `tarihsel-kanitlar`
ve diğer tüm site içeriğinde §13.24 süreci aynen geçerlidir.

#### Süreç — MUTLAK (tefekkür hariç, yukarı bak)
Bu tür hassas içerikte (yeni veya revizyon): **GPT-5.2 hakem incelemesi (klasik tefsir + akademik) ZORUNLUDUR**; mümkünse âlim geri bildirimiyle birlikte. **TR ve EN eş güncellenir ve ChatGPT her ikisini de onaylamadan ASLA push/merge edilmez** (kullanıcı direktifi 2026-07-26). Konular tek tek, sırayla ele alınır.

#### Neden yazıldı
2026-07-26'da bir âlimin Firavun bölümü eleştirisi üzerine `tarihsel-kanitlar` (Firavun/Hâmân) ve `bilimsel-isaretler` (embriyoloji, süt, demir, genişleyen evren vd.) yeniden çerçevelendi. Bkz. `docs/reviews/` ve memory `feedback_quran_supremacy_framing`.

---

### 13.25 Renk Sistemi — ENFORCE ALWAYS (2026-08-13)

**Ölçülen sorun:** `tokens.js`'te 100 renk token'ı olmasına rağmen kod tabanında
**186 token dışı hex** kullanılıyordu (çoğu Tailwind'den ad-hoc). Yakın-tekrarlar:
**7 yeşil, 7 turkuaz, 6 kırmızı, 81 turuncu/altın tonu.** Anasayfa tek başına 18
farklı hex kullanıyordu. Kök sebep: `COLORS` ham renk adı veriyordu (`gold`,
`violet`, `orange`) ama **rolü** söylemiyordu; rol belirsiz olunca herkes kendi
tonunu uydurdu.

#### Mutlak kurallar

1. **Uygulama kodunda ham renk YASAK.** Yasaklı: `#hex` · `rgb()/rgba()` ·
   `hsl()/hsla()` · Tailwind arbitrary (`text-[#...]`, `bg-[#...]`, `border-[#...]`).
   Tek istisna: `next/src/tokens.js`'in kendisi.
2. **Rol bazlı token kullan, ham renk adı değil.**
   - ✅ `SEMANTIC.textPrimary` · `SEMANTIC.accentPrimary` · `CATEGORY.blue`
   - ❌ `COLORS.violet` · `COLORS.orange` · `'#d4a574'`
3. **Kategori rengi tek kaynaktan:** `CATEGORY` (veya sıralı dağıtım için
   `CATEGORY_SCALE`). Yeni kategori rengi **uydurulmaz**.
4. **Kategori ölçeği sert üst sınır 6, hedef 4-5.** Altıdan sonra renk tek başına
   ayırt etmez — ikon/etiket zorunlu hâle gelir.
5. **Kategori rengi tek sinyal olamaz.** Her kategori kartı renkle BİRLİKTE
   etiket veya ikon taşır (renk körlüğü).
6. **`STATUS.error` ile `CATEGORY.red` aynı ekranda kullanılmaz** — kırmızı ya
   hata demektir ya kategori, ikisi birden değil.
7. **`accentStats` (`#c9a227`) yalnız istatistik sayılarında.** Anchor verse ve
   Hero için **YASAK** (§13.18).
8. **Bir ekranda aynı anda en fazla 3 kategori aksanı.** Anasayfada bu kural
   küme başına tek renk demektir.

#### Denetim

```bash
cd next && node scripts/audit-colors.mjs          # özet
cd next && node scripts/audit-colors.mjs --list   # token dışı renklerin listesi
cd next && node scripts/audit-colors.mjs --ci     # taban aşılırsa exit 1
```

2026-08-13 taban değerleri: **184 farklı token dışı renk**, **1.195 ham hex
kullanımı**. Bu sayılar **artmamalı**; her PR'da azalmalı. Script taban aşılırsa
kırmızı yanar.

> Tek satırlık `grep` bilinçli olarak kullanılmıyor: "satır sayısı" ile "farklı
> renk sayısı" birbirine karışıyordu (1.080 vs 186 gibi tutarsız rakamlar).

#### Göç sırası (tek seferde yapma)

1. **Yeni kaçakları durdur** — yukarıdaki denetim komutu her PR'da koşulur
2. Rol katmanını kur (`SEMANTIC` / `STATUS` / `CATEGORY`) — ✅ yapıldı
3. En yüksek frekanslı renkleri map et (`#d4a574`, `#3498db`, `#2ecc71`, `#94a3b8`…)
4. **Anasayfayı temizle** — vitrin; 18 hex → 2 surface + 2 text + 1 border +
   1 scripture gold + max 3 kategori
5. Kategorileri `CATEGORY`'ye bağla
6. Status renklerini ayır
7. Kalan düşük frekanslı rogue renkleri sil

#### Gerekçe kaydı

Bu kural GPT-5.5 hakem turuyla doğrulandı. İki noktada hakemden ayrışıldı:
- Hakem `accentPrimary`'yi `royalGold`'a çevirmeyi önerdi — **uygulanmadı**;
  antika altın sitenin görsel kimliği ve §13.18 royalGold'u hero/anchor için
  ismen yasaklıyor. Hakemin kendi çıkışı kullanıldı: *"aynı hex kalabilir, aynı
  token olamaz"* → ayrım token seviyesinde, piksel değişmedi.
- Hakem turkuazı (`#1abc9c`) attırdı (→ `rose`) ve `#8b5cf6` yerine `#a78bfa`
  önerdi (küçük metinde kontrast sınırdaydı) — **ikisi de uygulandı**.

---

### 13.26 Metin Kontrastı — ENFORCE ALWAYS (2026-08-14)

**Ölçülen sorun:** kontrast bu tarihe kadar **yalnız anasayfada** ölçülmüştü.
73 sayfa ölçülünce **3.508 gerçek AA ihlali / 134 sayfa** çıktı; 140 sayfanın
yalnız 4'ü temizdi. Kök sebep tek tek kullanımlar değil, **üçüncü metin
katmanının olmamasıydı**: ham Tailwind slate paleti rol yerine kullanılmış ve
dördü de eşiğin altındaydı — `slate500` 4.12 · `slate600` 2.59 ·
`slate700` 1.89 · `slate800` **1.34** (yani neredeyse görünmez).

#### Üç metin kademesi — hepsi AA geçer

| rol | token | hex | oran (cosmic-black) |
|---|---|---|---|
| Ana metin | `SEMANTIC.textPrimary` | `#e8e6e3` | 15.74 |
| İkincil | `SEMANTIC.textMuted` | `#94a3b8` | 7.65 |
| **Üçüncül** | **`SEMANTIC.textFaint`** | **`#7e8fa6`** | **5.94** (14 Ağustos: `#70829c`'ten açıldı, bkz. tokens.js yorumu) |

#### Mutlak kurallar

1. **Metin rengi bu üç token'dan biridir.** Dördüncü, daha sönük bir kademe
   YOKTUR — ihtiyaç varsa punto/ağırlık ile ayrış, renkle değil.
2. **`COLORS.slate500-800` metin rengi OLAMAZ.** Kenarlık, ayraç ve ikon
   zemini olarak doğrudur (AA eşiği metne aittir) — bu yüzden silinmediler.
3. **Opaklık tabanı:** `silver` ≥ **0.78** · `gold` ≥ **0.75**.
   Altına inen her metin AA'yı kırar (silver 0.70 → 4.23).
   Bu, hem `opacity` prop'u hem de `rgba(...)` alfası için geçerlidir.
4. **Alfa token'ları metin rengi olarak kullanılamaz** (`silverAlpha70` = 4.23,
   `silverAlpha40` çok daha kötü). Bunlar zemin/kenarlık token'larıdır.
5. **Kasıtlı sönük durum** (devre dışı, "bu öge burada yok" gibi) oran
   **≥3.0**'ın altına inemez. Bilgi taşıyan bir sönüklük, WCAG'ın "devre dışı
   öge" muafiyetine girmez — bkz. `/atlas/kissa` ısı haritası.
6. **Kategori/kimlik renkleri de bu kurala tabidir.** Bir bileşen kendi
   kategori paletini icat ettiğinde (`{ accent: '#534AB7', ... }` gibi bir
   obje) — o `accent` değeri `color:` olarak kullanılacaksa yukarıdaki
   eşiklere **cosmic-black üstünde ölçülerek** uymalı. `SEMANTIC` üçlüsü
   yalnızca "genel metin" içindir; her yeni renk ailesi (kategori, durum,
   veri kümesi) kendi ayrı doğrulamasını ister. 14 Ağustos'ta `Melekler.jsx`,
   `CennetCehennem.jsx` ve `concept-graph.json`'daki kategori/küme renkleri
   hiç doğrulanmadan eklenmişti; birden fazlası tam opaklıkta bile AA'yı
   geçmiyordu (ör. violet `#534AB7` → 2.83). Aynı kural JSON veri
   dosyalarına gömülen renkler için de geçerli — yazmadan önce ölç.
7. **Bir kapsayıcının `opacity`'si, içindeki metnin KENDİ renk/opaklığıyla
   çarpılır.** İkisini aynı anda soluklaştırma — hangisini kullandığını
   bil ve NET oranı (çarpım sonrası) ölç, yalnız metnin kendi değerini değil.
   14 Ağustos'ta `isHadithOnly` kartında ikisi birden uygulanmış, sonuç
   ölçülmeden AA'nın çok altına inmişti.
8. **"Büyük metin" muafiyeti (≥24px veya ≥18.66px+bold → eşik 3.0 yerine
   4.5) mobilde KALKABİLİR.** `clamp(1.4rem, 4vw, 1.9rem)` gibi responsive
   font boyutları masaüstünde ≥24px'e ulaşırken mobilde 22-23px'te kalabilir
   — aynı metin masaüstünde muaf, mobilde muaf DEĞİL olur. K5'te (14
   Ağustos) `/arac/kiyamet` bu yüzden mobilde 13→17 ihlale çıktı; metin
   masaüstünde geçiyordu, mobilde eşiği kaybetti. Büyük punto + düşük
   opaklık/kategori rengi kombinasyonu kullanan her bileşen **hem
   masaüstünde hem mobilde** ölçülmeli: `node scripts/audit-contrast.mjs
   --mobile [--full]`.

#### Denetim

```bash
cd next && node scripts/audit-contrast.mjs            # örneklem (12 rota, ~40 sn)
cd next && node scripts/audit-contrast.mjs --full     # 70 rota × 2 dil (~4 dk)
cd next && node scripts/audit-contrast.mjs --ci       # taban aşılırsa exit 1
cd next && node scripts/audit-contrast.mjs --update   # tabanı bilinçli düşür
```

**Bu sayı ARTMAZ.** Taban `tests/__baseline__/contrast.json`'da.
⚠ Çalışan sunucu ister; ölçüm mantığı `tests/lib/contrast.mjs`'te.

#### Neden ham sayıya güvenilmez

Probe iki şeyi ayırt edemez: **≥24px dev dekoratif rakamlar** ve **kasıtlı
sönük durumlar**. Birincisi `audit-contrast.mjs`'te ayıklanır; ikincisi karar
gerektirir.

**Gradyan zeminler artık ELENMİYOR, ÖLÇÜLÜYOR (2026-08-31).** Önceki sürüm
gradyan gördüğünde yalnız damga vuruyor, ölçümü en yakın OPAK renge göre
yapıyordu; dolu bir gradyan butonda o renk şeffaf olduğu için yukarı yürünüp
koyu zemin bulunuyor ve koyu metin koyu zemine karşı ölçülerek oran `1.04`
çıkıyordu. Bu yüzden `audit-contrast.mjs`'te "ÖNE ÇIKAN|FEATURED" diye elle
yazılmış bir dize istisnası vardı — ölçüm değil, yama.

Probe artık gradyanın renk duraklarını ayrıştırıyor ve **en kötü durağa** göre
ölçüyor. Dize istisnası kaldırıldı; rozet kendiliğinden eşiği geçiyor. Ölçülen
etki (146 rota): ihlal **1599 → 1339**, temiz sayfa **0 → 90**, düz zeminli
ölçümlerde **0 oran değişikliği**. Değişiklik yalnız gürültüyü atmakla kalmadı,
eski probe'un yanlış zemine ölçtüğü için sakladığı gerçek bir ihlali de ortaya
çıkardı (`ProofSection` kaynak notu: silver `.75` → açık durağa karşı 4.38).

**Ölçüm artık GÖRÜNÜR ALANDA ve OTURMUŞ hâlde yapılır (2026-08-31, ikinci
tur).** Asıl şişme kaynağı gradyan değil, scroll-reveal'dı: bölümler görünür
alana girmeden önce iç içe üç kapsayıcı birden `opacity:0.5`'te duruyor
(0.5³ ≈ 0.13) ve probe bunu "1.22 kontrast" diye sayıyordu. Kanıt: aynı öge
ekrana girip reveal tamamlanınca opaklık zinciri BOŞ, oran tam. Bu yüzden:
· probe yalnız o an ekranda olan ögeyi ölçer,
· `audit-contrast.mjs` sayfayı ekran ekran gezer, her durakta IO'ya 600 ms pay
  verip soluk-öge sayısı kararlı hâle gelene kadar bekler, sonra ölçer.

**Tekilleştirme METNE göre değil STİL BAĞLAMINA göre.** Eski anahtar
`renk|punto|metin` idi ve aynı metnin farklı zeminlerdeki örneklerini tek
kayda indiriyordu — rapor yanlış yeri gösteriyordu ("İnteraktif Araçlar" 1.35
deniyordu, sayfadaki öge 8.81'di). Yeni anahtar `renk|punto|efektif zemin|
opaklık`: ölçüt "kaç ayrı DÜZELTME gerekiyor".

Birikimli etki (örneklem, 12 sayfa): **383 → 88 → 70**.

⚠ **Sayı bir MANDAL, kusur envanteri değil.** Kalan bulguların önemli kısmı
hâlâ reveal geçiş hâlleri; ön-bekleme 0/600/1200 ms denendi, sayı 28-34
arasında salınıyor ve yakınsamıyor. Somut örnek: Hero'daki "DEVAM" göstergesi
animasyon ortasında 3.09 ölçülüyordu ama dinlenme hâlinde 4.97 — yani AA'yı
geçiyor. Bu yüzden bir bulguyu düzeltmeden önce **o ögeyi tek tek, oturmuş
hâlinde doğrula**; ham listeye bakıp toplu düzeltmeye kalkma.

⚠ `--full` artık sayfa başına gezinme yaptığı için **çok daha uzun sürüyor**
(146 rota, ~15 dk). Hızlı geri bildirim için örneklem koşusunu kullan.

✅ **Ölçüm artık DETERMİNİSTİK** (aynı sayfada üç koşu: 65/65/65). İki şey
sağladı: (1) probe yalnız merkezi ekranın **%15-85 bandına** düşen ögeyi
ölçer — kenardan yeni giren öge reveal'ını bitirmemiş oluyordu; (2) betiğin
oturma kontrolü soluk öge SAYISINI değil opaklık+transform **TOPLAMINI**
izler — sayfada tasarım gereği ~180 sabit soluk öge olduğu için sayı
animasyon boyunca değişmiyor ve kontrol erken çıkıyordu.

⚠ **Kalan sınır ve KÖK SEBEBİ.** Bulguların bir kısmı hâlâ reveal geçiş
hâlleri. Mekanizma tam olarak şu: `whileInView` animasyonu öge ekrana her
girdiğinde yeniden tetikleniyor; tarama sırasında öge kaçınılmaz olarak bir
kez yarı saydam yakalanıyor; tekilleştirme anahtarı oranı içerdiği için o
geçici ölçüm kayda çakılıyor ve daha sonra oturmuş hâlde ölçülse bile o
ölçüm eşiği GEÇTİĞİ için probe onu döndürmüyor, yani geçici kaydı hiçbir şey
düzeltmiyor. Doğrulandı: "Öne Çıkan Yazılar" taramada 0.21, ortaya alınıp
3 sn beklenince **0.85**; "Semantik Seri" 0.25 → **1.0**.

**Bir bulguyu düzeltmeden önce o ögeyi tek tek doğrula:** ekranın ortasına
al, ~3 sn bekle, opaklık zincirini yeniden ölç. Ham listeye bakıp toplu
düzeltmeye kalkma.

**Asıl çözüm ayrı bir iş ve aynı zamanda erişilebilirlik borcu:** 31 bileşen
`whileInView` kullanıyor, yalnız 13'ü `useReducedMotion` dinliyor
(Conclusion, HiddenArchitecture, Highlights, HistoricalProof hiç dinlemiyor).
§9 "reduced motion ile animasyonlar kapanır" diyor — kapanmıyor. Bu
kapatılırsa hem kural gereği yerine gelir hem ölçüm tamamen deterministik
olur, çünkü denetim zaten `reducedMotion: 'reduce'` ile koşuyor.

---


### 13.27 İç Mimari Sızıntısı — ENFORCE ALWAYS (2026-08-14)

**Kullanıcıya görünen hiçbir metinde geliştirici jargonu bulunamaz.**

Yasak — makale gövdesi, kaynakça, başlık, özet, i18n dizeleri, kısacası
**ekrana çıkan her alan** için:

| Yasak | Örnek |
|---|---|
| İç doküman referansı | `CLAUDE.md`, `§13.15` |
| Dosya adı / yolu | `verse-graph-bgem3.json`, `src/lib/arabic.js` |
| Fonksiyon adı | `cleanArabicForDisplay`, `renderInlineMarkdown` |
| Kod terimi | `useState`, `localStorage`, `dispatchEvent` |
| Sürüm kontrolü jargonu | `commit`, `git push` |

**Neden bu kural var.** 2026-08-14'te yeni bir tefekkür makalesinin kaynakça
bölümünde şu cümle **yayındaydı**:

> *"Bu sayfadaki Arapça âyetler `public/verse-graph-bgem3.json`'dan mekanik
> olarak çekilmiş ve `cleanArabicForDisplay` ile normalize edilmiştir
> (CLAUDE.md §13.15). Hafızadan yazılmamıştır."*

Okuyucu için anlamsız. Kuralın kendisine uyulduğunu **kanıtlama refleksi**,
kanıtı okuyucunun önüne koymaya dönüşmüş. Kural mühendisin işidir; **okuyucu
sonucu görür, süreci değil.** Üç makalede altı alan bulundu ve temizlendi.

**Doğrusu:** aynı bilgi okuyucunun dilinde verilir —
*"Âyetlerin Arapça metni sitenin kanonik Kur'an kaynağından alınmış ve
mushaf imlâsına göre normalize edilmiştir."*

**Zorunlu kontrol — HER PUSH'TAN ÖNCE:**
```bash
node scripts/audit-internal-leak.mjs --ci
```
Sızıntı varsa **exit 1**. Yalnız ekrana çıkan alanlar taranır; `relatedTools:
["verse-graph"]` gibi **araç kimlikleri meşrudur** ve elenir.
> ⚠ İlk tarayıcım bu ayrımı yapmıyordu ve *"38/53 makale bozuk"* diye yanlış
> alarm verdi; gerçek sayı **3**'tü. Tarayıcı yazarken de ölç, varsayma.

### 13.28 Anasayfa Envanter Şeridi — Sayılar ELLE Güncellenir (2026-08-14+)

**`next/src/sections/InventoryStrip.jsx`'teki üç sayı (araç, tefekkür yazısı,
âyet) kaynaktan OTOMATİK okunmuyor — sunucu bileşeni derleme zamanında sabit
değer render ediyor.** Yeni bir araç/atlas rotası veya tefekkür makalesi
eklenip **push'tan önce** bu dosya güncellenmezse anasayfa yanlış sayı gösterir
(§13.24'ün "ölçmeden konuşma" ilkesinin ihlali — bu sefer kod tarafında).

**Push öncesi zorunlu kontrol** — üç kaynağı ölç, `InventoryStrip.jsx`'teki
`STATS` dizisiyle karşılaştır:

```bash
cd next
node -e "console.log('araç:', require('./src/data/toolCatalog.js').TOOL_CATALOG.length)"
node -e "console.log('tefekkür:', require('./public/tefekkur/_index.json').articles.length)"
node -e "console.log('âyet:', require('./public/verse-graph-bgem3.json').length)"
```

Fark varsa `STATS` dizisindeki ilgili `n` alanını güncelle. Âyet sayısı
(6.236) pratikte hiç değişmez; araç ve tefekkür sayıları her yeni rota/makale
ile artar.

**Neden bu kural var.** 2026-08-14'te `/arac/*` + `/atlas/*` + `/graf/*`
rotaları diskle karşılaştırılarak 62 olarak doğrulandı (bkz. §13.22'nin
kendi katalog güncelleme adımı) — ama bu doğrulama **elle** yapıldı. Bir
sonraki yeni rota eklendiğinde aynı elle kontrol tekrarlanmazsa şerit eski
sayıyı göstermeye devam eder; ziyaretçiye yanlış bir "kapsam" iddiası sunar.

**Kural ihlali sonucu:** Katalog 65'e çıkar, şerit hâlâ "62 Araç" der —
kullanıcının kendi ölçüp doğruladığı bir sayı sessizce yalan söylemeye başlar.

### 13.29 Tefekkür Makaleleri — Kurallar `tasks/to_do_tefekkur.md`'de (ENFORCE ALWAYS)

**Yeni bir Tefekkür makalesi eklerken veya mevcut birini düzenlerken önce
`tasks/to_do_tefekkur.md`'yi oku.** İçeriği buraya kopyalanmadı — o dosya
zaten canlı tutuluyor (her yeni makalede güncelleniyor, §10 Change Log +
en alttaki tarihli notlar), CLAUDE.md'ye kopyalarsak iki kaynak birbirinden
sürüklenir (bkz. §13.25'in aynı gerekçesi: "tabloyu üretmek yerine
doğrula"). Bu bölüm yalnız **ne var, nerede** diye işaret eder.

**`tasks/to_do_tefekkur.md`'de bulunan ENFORCE ALWAYS kurallar (§4 altında):**

| Kural | Özet |
|---|---|
| Medium Görselliğini Yansıtma | Her Medium şema/tablo/akış diyagramı site bileşeniyle (HierarchyTree, MorphologyTable, FlowChain, ContrastDuo…) yeniden inşa edilir — ham screenshot YASAK |
| Ayet Referansı Formatı | TR'de her zaman sûre adı + numara (`Bakara 2:8`), sade numara değil |
| Makale Sayım Politikası | TR+EN aynı içerik **tek** makale sayılır — "49 makale" değil "44 unique" |
| Kök Çoklu-Alomorf | Defektif kökler (`ط غ و / ط غ ي` gibi) TÜM alomorflarıyla gösterilir, tek form eksik sayılır |
| Tefekkür Tipografi | Body `1.08rem`/`1.85` line-height, H2 `≥1.55rem` — sitenin geri kalanından bilinçli büyük (uzun-form okuma) |
| "Kur'an" Yazımı | Medium'da "Kuran" geçse de site her zaman "Kur'an" (bkz. genel kural, madde aşağıda) |
| Epistemik Disclaimer Sistemi | 3 katman: her makalede uniform top disclaimer + tartışmalı pasajlarda `criticalNote` + index sayfasında banner |
| Felsufi Metnine Sadıklık | Yazarın yazmadığı hiçbir yorum/tefsir/kavram eklenmez — "bunu Felsufi mi yazdı, ben mi ekledim" testi |
| VerseInline Ref Tekrarı Yasağı | Badge zaten sûre+numara gösteriyor, `noteTr` içinde tekrar yazılmaz |

**Ayrıca en altta (§10 sonrası), her yeni makalede güncellenen iki canlı ders:**
- `relatedTools` **dize dizisi** olmalı (`["concept-graph"]`), nesne dizisi
  DEĞİL — nesne verilirse renderer `[object Object]` + duplicate-key hatası
  üretir.
- Kategori sayaçları (`TefekkurHighlight`, navbar) **elle yazılmaz**,
  `_index.json`'dan türetilir — elle yazılan sayı bayatlar (bir örnek:
  42 yazıyordu, gerçek 53'tü). Aynı hata sınıfı navbar yüksekliğinde
  sekiz kez, `InventoryStrip`'te bir kez daha yaşandı (§13.28) — üçü de
  "türetilmesi gereken sayı elle yazılmış" kalıbı.

**Genel site kuralı (CLAUDE.md'nin kendi kapsamı, tefekkür'e de uygulanır):**
Kur'an yazımı sitede daima **Kur'an** (kesme işaretiyle), Medium kaynağında
"Kuran" geçse bile migration'da normalize edilir.

**İstisna hatırlatması:** Tefekkür makaleleri §13.24'ün (İ'câz-ı İlmî hakem
süreci) **DIŞINDADIR** — yazarın kendi imzalı görüşleridir, ChatGPT
onayına sokulmaz. Bkz. §13.24'ün istisna maddesi.

### 13.30 Kaynak Atfı Doğrulama Kuralı — ENFORCE ALWAYS (2026-08-14)

**Bir kaynağa (âlim, klasik eser, akademik makale/kitap, tarihî kayıt,
dergi) dayandırılan HER iddia, sitede yazılmadan ÖNCE bizzat o kaynaktan
doğrulanır.** "Muhtemelen doğrudur" ya da "genel bilgime göre doğru
görünüyor" bir atıf yazmak için yeterli değildir — WebSearch/WebFetch ile
(ya da doğrudan erişilebilen bir birincil kaynakla) teyit edilmeden hiçbir
yazar adı, eser adı, cilt/sayfa/yıl bilgisi veya alıntı metni yazılamaz.

**Neden bu kural var.** 14 Ağustos 2026'da sitedeki **453 kaynak-atıf
iddiasının tamamı** taranıp gerçek kaynaklarıyla karşılaştırıldı (bkz.
`tasks/todo_resources.md`). **11 gerçek hata** çıktı — hiçbiri kötü niyetli
değildi, hepsi "makul görünen ama hiç doğrulanmamış" içerikti:

- Napolyon'a atfedilen bir söz aslında Kardinal Richelieu'ye aitti.
- Bir akademik dergi atfının cilt/yıl bilgisi yanlıştı (c.18/1995 yerine
  gerçeği c.XXXIX/2006).
- Gazâlî'nin İhyâ'daki dörtlü kalp modeli **iki ayrı dosyada** yanlış
  aktarılmış — şeytânî unsur atlanıp yerine uydurma bir "rahmet" boyutu
  eklenmişti (aynı hata iki kez, birbirinden habersiz iki bileşende).
- Bir istatistik ("Cuypers'ın 200+ sayfalık Bakara analizi") kitabın
  gerçek uzunluğuyla (224 sayfa, en kapsamlı örneği Mâide) doğrudan
  çelişiyordu.
- Bir Bediüzzaman alıntısı yanlış esere atfedilmişti (Mesnevî-i Nûriye
  yerine gerçeği İşârâtü'l-İ'câz).
- Feynman'a atfedilen ünlü ama kaynağı doğrulanamayan bir "internet
  vecizesi" kesin bir alıntı gibi sunulmuştu.

Bunların hiçbiri satır satır kontrol edilmeden yazılana kadar fark
edilmedi — üçü aylarca canlıda durdu.

**Kural:**
- Yeni bir kaynak atfı (`SourcesCitation` girdisi, footnote, pullQuote,
  `criticalNote`, veya satır-içi "X'e göre..." cümlesi) yazmadan önce
  doğrula: yazar adı doğru mu, eser adı doğru mu, cilt/yıl/sayfa doğru
  mu, alıntı metni birebir mi yoksa serbest parafraz mı.
- Doğrulanamıyorsa (çoğu klasik Arapça metin dijital olarak erişilemez):
  iddiayı KESİN dille yazma. "X der ki" yerine "X'e atfedilir" /
  "rivayet edilir" gibi ihtiyatlı bir dil kullan, ya da iddiayı kaldır.
- Ünlü ama kaynağı belirsiz "internet alıntıları" (Feynman, Einstein,
  Napolyon gibi isimlere atfedilen vecizeler) özellikle risklidir — genelde
  yanlış atfedilirler, doğrulamadan asla kesin bir kişiye bağlama.
- Bir sayısal/yapısal iddia (cilt sayısı, sayfa sayısı, "N mertebe/N
  basamak" gibi) kendi içinde tutarlı olmalı — yazarken hızlı bir zihinsel
  çapraz kontrol yap (14 Ağustos'ta bir "3 mertebeli... 15 basamak" iddiası
  aslında 5 mertebe listeliyordu, 3×3≠15).

### 13.31 "Truncated" Hata Ailesi — Sticky Örtüşme + Sınırsız Yükseklik (ENFORCE ALWAYS) (2026-08-16+)

**Kullanıcının "truncated" dediği görsel hata TEK bir kök sebep değil, aynı
aileden 3 AYRI mekanizma.** 15-16 Ağustos'ta aynı gün içinde 4 farklı
sayfada (Mesel Atlası, Kıssa Atlası, Sûre DNA, Kavram Ağı) bulundu —
her biri farklı mekanizmayla. Yeni bir ToolHeader-altı ikinci sticky öge
(tab bar, alt-başlık, filtre çubuğu) eklerken veya var olan birini
düzenlerken üçünü de kontrol et:

**Mekanizma 1 — İkinci sticky öge, ToolHeader ile AYNI `top`'ta.**
ToolHeader kendisi `top: navTop` ile sticky (48px yükseklik). Altındaki
ikinci sticky öge de `top: navTop` kullanırsa (offset'e +48 eklemeden),
scroll'da ikisi aynı y konumuna gelir — biri diğerinin ARKASINDA tamamen
kaybolur. *(MeselAtlasi.jsx, KissaAtlas.jsx örneği — bkz. useNavbarOffset.js
başlık yorumu.)*

**Mekanizma 2 — Sticky offset HARDCODE, navbar yüksekliği ölçülmüyor.**
`top: '110px'` (§13.19 Melekler-referans deseni, navbar 62 + ToolHeader 48
varsayımı) çoğu sayfada çalışır ama navbar yüksekliği SABİT DEĞİL (§13.13'te
belgelendiği gibi 62/82/96/104/110 arası değişir — dil, viewport genişliği,
root font boyutu, scroll durumu). Gerçek navbar 82px olan bir sayfada
`top:'110px'` sticky öge, ToolHeader'ın (82+48=130px'te biten) 20px
ÜSTÜNDE başlar → örtüşme. *(ConceptGraph.jsx örneği: navbar 82px ölçüldü,
hardcode 110 varsaydı.)* **Kural: yeni bir sticky alt-öge eklerken HER ZAMAN
`useNavbarOffset(0, 62)` ile ölç, `top: navTop + 48` kullan — `'110px'`
hardcode etme.** Var olan `top:'110px'` kullanan ~26 sayfa (§13.19 static
pattern) risk taşıyor ama tek tek doğrulanmadı — bkz. aşağıdaki tarama
komutu.

**Mekanizma 3 — Sınırsız yükseklik, flex `align-items:stretch` ile yayılır
(EN SİNSİ, EN GEÇ FARK EDİLEN).** İki-panelli bir görünümde (liste/grafik +
detay paneli) detay panelinin KENDİSİ `flex:1, overflowY:'auto'` kullanıyor
OLABİLİR ama bu yalnız panelin PARENT'ı (flex row) GERÇEK bir yükseklik
sağlıyorsa çalışır. Dış sarmalayıcı `height` DEĞİL `minHeight` kullanıyorsa
(çoğu tool sayfasının kökü böyle: `minHeight: 'calc(100vh - 62px)'`), flex
row'un kendisi CONTENT-DRIVEN kalır — `overflowY:auto` hiç devreye girmez,
panel TÜM içeriğini (ör. 150+ ayet kartı) doğal yüksekliğe sığdırır, ve
`align-items:stretch` (varsayılan) bu devasa yüksekliği KARDEŞ panele
(ör. grafik/canvas) de dayatır. Ölçülen gerçek örnek: sayfa toplam
yüksekliği 6164px'e çıktı (normali ~840px). İçerik küçük sabit
koordinatlarda kaldığından sayfanın en üstünde render olur — kullanıcı
scroll etmeden görür, ama BİRAZ kaydırınca devasa boş taşma alanına girip
her şey "kayboluyor" — kullanıcı "sadece scroll edince/etmeyince çalışıyor"
diye tarif eder, bu KAFA KARIŞTIRICIDIR çünkü hata her zaman ORADADIR,
yalnız scroll konumuna göre görünür/görünmez olur. **Kural: iki-panelli bir
görünümün dış satırına (flex row) GERÇEK `height` ver (`calc(100vh -
Npx)`, N = üstündeki tüm sticky öge yüksekliklerinin toplamı) — `flex:1`
YETMEZ eğer kendi parent'ı da content-driven'sa. `flex:1` zaten `height`
CSS özelliğini EZER (flex-basis:0% ana eksende `height`'tan önceliklidir);
`height` + `flexShrink:0` kullan, `flex:1` kullanma.**

**Doğrulama — yeni/düzenlenen HER sticky+iki-panel sayfada:**
```js
// 1) Sticky örtüşme taraması (Mekanizma 1+2)
const stickies = [...document.querySelectorAll('*')].filter(el =>
  getComputedStyle(el).position === 'sticky' && el.getBoundingClientRect().height > 10);
// rect'leri karşılaştır, >%50 dikey örtüşme varsa hata

// 2) Sınırsız yükseklik taraması (Mekanizma 3) — bir detay/panel görünümü
// AÇTIKTAN SONRA çalıştır (yalnız o zaman ortaya çıkar):
document.body.getBoundingClientRect().height  // beklenen ~viewport+makul altbilgi;
                                                 // >2000px ise şüphelen, kaynağı bul
```
Gerçek scroll ile test et (`page.mouse.wheel`), `window.scrollTo` DEĞİL —
ikisi farklı davranabilir (bkz. §16.6'nın body/html overflow dersi).

**Mekanizma 4 (2026-08-16 keşfedildi) — `overflow` != `visible` olan ata,
sticky'yi hiç scroll ETMESE BİLE onun "containing block"u olur, çocuk
`top`'a hiç kenetlenmeden kayıp gider.** CSS spesine göre bir sticky
öğenin en yakın `overflow` (hidden/auto/scroll/clip, `visible` DEĞİL) olan
atası — kendisi asla bağımsız scroll etmese bile — o sticky'nin
positioning containing block'u olur. Bu ata pratikte hiç scroll
mekanizması sağlamadığından (gerçek scroll `window`/`html` üzerinde
oluyor), sticky çocuk artık `top` değerine kenetlenmiyor: ya sabit bir
oranda scroll ile birlikte kayıp gidiyor (negatif `top`'a düşüyor, örn.
scroll 3000'de -1857px) ya da hiç konumlanmıyor. Mekanizma 1/2'den farkı:
o ikisinde hata bir sayı YANLIŞLIĞI (yanlış `top` değeri) iken, burada
sticky mekanizmasının KENDİSİ bozuluyor — hiçbir `top` değeri doğru
olmaz. Sık rastlanan tetikleyiciler: `overflowX:'hidden'` (tarayıcı bunu
otomatik `overflow-y:auto`'ya yükseltir), veya bir `bodyRef`
sarmalayıcısına konan `overflowY:'auto'` (kendisi hiç taşmasa bile).
`Melekler.jsx`, `RetorikSorular.jsx`, `TarihselKanitlar.jsx`,
`DogaAtlasi.jsx`, `FurukAtlasi.jsx`'te bulundu ve düzeltildi (ilgili
`bodyRef`'ten overflow bildirimini kaldırarak) — çözüm KuranRenkleri.jsx
ve SebebiNuzul.jsx'in zaten doğru yaptığı şeyle aynı: tab bar'ın ata
zincirinde HİÇBİR `overflow` bildirimi bırakma. Paylaşılan
`components/SectionWrapper.jsx` (ana sayfanın ~54 section'ının hepsinin
kullandığı sarmalayıcı, `overflow-hidden` Tailwind sınıfı taşıyor) de aynı
hatayı taşıyordu; global olarak kaldırmak riskli olduğundan (dekoratif
taşma-kırpma diğer section'larda gerekli olabilir) `clip={false}` prop'u
eklendi — gerçek sticky davranışı gereken section'lar bunu geçmeli,
varsayılan `true` diğer tüm section'ların mevcut davranışını korur.

**Doğrulama (Mekanizma 4):** sticky öğeden yukarı doğru TÜM atasal
zinciri gez, her birinin `getComputedStyle(el).overflow/overflowX/overflowY`
değerine bak — `visible` dışında bir şey varsa ve o ata gerçekte
bağımsız scroll ETMİYORSA (yani sayfanın asıl scroll'u `window` üzerinde
oluyorsa), o ata sticky'yi kırıyor demektir.

**Bilinen kapsam (2026-08-16 itibariyle taranıp düzeltildi — 5 paralel ajan +
23 ajanlı tam-site denetimi, ~72 araç/atlas/graf/statik sayfa):**
MeselAtlasi.jsx, KissaAtlas.jsx (Mekanizma 1/3), SurahComparator.jsx,
ConceptGraph.jsx, MunasebatAtlasi.jsx, SunnetullahAtlasi.jsx,
CennetCehennem.jsx, IlkSonKelimeler.jsx, SebebiNuzul.jsx (Mekanizma 2) —
ve Mekanizma 4: Melekler.jsx, RetorikSorular.jsx, TarihselKanitlar.jsx,
DogaAtlasi.jsx, FurukAtlasi.jsx, SectionWrapper.jsx (bkz. yukarı). Ayrıca
Mekanizma 2 için: BilimselIsaretler.jsx, QuranCommands.jsx, DuaDili.jsx,
KiyametSahneleri.jsx, YakinAnlamliNuanslar.jsx, KuranYeminleri.jsx,
ZamanBoyutlari.jsx, IbadetlerPillar.jsx (7 rota: hac/kurban/namaz/oruç/
tövbe/zekât/zikir), NefisMertebeleri.jsx, KiraatAtlasi.jsx. **Kalan
bilinmeyen kapsam:** yalnız Tefekkür makaleleri (53 adet) ve birkaç statik
sayfa (/sor, /kutuphanem, /hakkinda, /kaynakca) bu sweep'in dışında kaldı
— iki-panelli yapıları yok, düşük risk ama doğrulanmadı.

### 13.32 Ayet Referansı — ÇIPLAK NUMARA YASAK, Her Zaman Sûre Adı + Numara (ENFORCE ALWAYS) (2026-08-16+)

**Bir ayet referansı ekrana yazılırken YALNIZ "2:153" gibi çıplak sûre
numarası + ayet numarası gösterilemez — her zaman sûre ADI ile birlikte
gösterilir: "Bakara 2:153".** Kullanıcı bunu bir günde 4 ayrı sayfada
(Sûre DNA, Neden→Sonuç Atlası, Münâsebât Atlası, Sebeb-i Nüzûl) bağımsız
olarak fark edip bildirdi — aynı hata sınıfının 4. tekrarı sonrası kural
olarak yazıldı.

**Neden önemli:** çıplak "24:11" kullanıcı için anlamsız bir sayı
çiftidir; hangi sûre olduğunu bilmeden okunamaz. Sitenin kendi
`tasks/to_do_tefekkur.md`'sinde bu kural tefekkür makaleleri için zaten
ENFORCE ALWAYS'ti ("TR'de her zaman sûre adı + numara, sade numara
değil") — bu bölüm aynı kuralı SİTE GENELİNE (her component, her JSON
veri dosısından türetilen her referans) genişletir.

**Uygulama:**
- Her yeni verse-reference chip/link/etiket yazarken bir `formatVerseRef(ref,
  language)` yardımcı fonksiyonu kullan — sûre numarasını `ref.split(':')[0]`
  ile ayır, kısa-ad listesinden (`Bakara`, `A'râf`, `Şu'arâ` — "El-/Eş-/Et-"
  önekli DEĞİL, bkz. KissaAtlas.jsx/SurahComparator.jsx'teki `SURAH_NAMES_TR`
  kısa-ad dizisi) ada çevir, `${name} ${ref}` döndür.
- Veri dosyasında (`public/*.json`) referans zaten çıplak sayı olarak
  saklanabilir (`"ref": "2:153"`) — sorun DEĞİL, kural yalnız EKRANA
  YAZARKEN geçerli. Veriyi değiştirmeye gerek yok, render fonksiyonunu
  düzelt.
- İstisna: bir bileşen ZATEN sûre adını ayrı bir yerde (ör. kart başlığı,
  "Fâtiha ↔ Bakara") gösteriyorsa VE referans chip'i o bağlamdan
  KOPARILAMAZ şekilde bitişikse (ör. "1:6" doğrudan "Fâtiha" başlığının
  altında, tek satırda) yine de tercih edilen EKRANA sûre adı yazmaktır —
  "muhtemelen anlaşılır" bir istisna kabul edilmez, önceki 4 vaka da
  "bağlamdan anlaşılır" sanılmıştı ve yine de kullanıcı şikayet etti.

**Push öncesi hızlı tarama:**
```bash
grep -rn "v\.surah}:{v\.ayah\|{.*\.ref}\|surah}:\${.*ayah" src/components/*.jsx
```
Bulunan her satırı `formatVerseRef()` kullanacak şekilde gözden geçir.

### 13.33 Hakkında Sayfası "Son Güncelleme" Tarihi — HER PUSH'TA GÜNCELLE (ENFORCE ALWAYS) (2026-08-17+)

**`next/src/app/[locale]/hakkinda/HakkindaRoute.jsx`'teki `LAST_UPDATED_TR`/
`LAST_UPDATED_EN` sabitleri, o `git push` işleminin gerçekleştiği günün
tarihini taşımalıdır.** Kullanıcı direktifi (2026-08-17): "her push ile
birlikte buradaki tarih en son push edilen günün tarihi olsun."

**Uygulama — her `git push origin main`'den ÖNCE:**
1. `HakkindaRoute.jsx`'te bu push'a dahil edilen değişiklik var mı kontrol et
   (yalnız bu dosyanın kendisi değil — push edilen HERHANGİ bir değişiklik
   sayfanın "güncel" olma iddiasını etkiler).
2. Eğer bu push içerik/kod değişikliği taşıyorsa, `LAST_UPDATED_TR`/
   `LAST_UPDATED_EN` sabitlerini o günün tarihine güncelle (TR: "17 Ağustos
   2026" formatı; EN: "August 17, 2026" formatı).
3. Güncellemeyi de AYNI push'a dahil et (ayrı bir commit gerekmez, mevcut
   commit'e eklenebilir).

**Neden bu kural var:** `/hakkinda` bir metodoloji/şeffaflık sayfası;
"son güncelleme" tarihi taşıyan bir sayfanın bu tarihi bayatlaması, sayfanın
kendi güvenilirlik iddiasını zayıflatır. Sabitler dosyanın en üstünde,
bulunması kolay bir yerde tutulur — elle güncellemenin unutulma riski
düşük olsun diye.

### 13.34 Humanizer Kontrolü — YENİ İÇERİK ÜRETİMİNDE ZORUNLU, NO-GO (ENFORCE ALWAYS) (2026-09-06+)

**Kullanıcıya görünen HER yeni metin, `humanizer` skill'i (kullanıcı düzeyi
skill: `~/.claude/skills/humanizer/SKILL.md`) ile ÜRETİLİR ve commit'ten
önce aynı skill ile KONTROL EDİLİR. Kontrolden geçmemiş içerik push
edilmez; bu bir no-go koşuludur.** Kullanıcı direktifi (2026-09-06): "yeni
bir içerik üretildiğinde humanizer skill mutlaka kontrol etmeli ve ona
uygun üretilmeli; bu no-go feature, eğer uyulmazsa."

**Kapsam (hepsi):** `page.js` `TITLE_*`/`DESC_*` sabitleri, bileşen ve
section içi TR/EN dizeleri (kart açıklamaları, kaynak notları, araç
ipuçları, `aria-label`), `src/i18n/tr.json` / `en.json`, `src/data/*`
(homeCards, tools.jsx, toolCatalog, exploreCategories), tefekkür
`tldrTr`/`tldrEn` ve `_index.json`, Navbar/mega menü metinleri, hata
mesajları, OG/metadata açıklamaları, concierge sistem metinleri.

**Uygulama — üretirken ve commit'ten önce:**
1. Metni skill'in kalıp listesine göre yaz: uzun tire (—) ve kısa tire (–)
   yok; "X değil — Y" / "not X but Y" kalıbı yok; zorlanmış üçlü yok;
   satış sıfatı yok (eşsiz, çarpıcı, dikkat çekici, benzersiz / unique,
   striking, remarkable, crucial, profound); belirsiz kaynak yok ("uzmanlar",
   "çalışmalar gösteriyor"); emoji/ℹ️ yok; "asıl soru / the real question"
   yok; ok zinciri (→) düz metinde yok; kalın etiket listesi yok; "bilim
   doğrular/kanıtlar" fiili yok (§13.24 ile birlikte: "örtüşür").
2. Skill'i çalıştır (`/humanizer <metin>` ya da dosya) ve bulguları
   düzelt; düzeltilmiş hâli commit et. Değişiklikler ÖNCE→SONRA olarak
   `tasks/humanizer-changelog.md`'ye eklenir.
3. Sadece dize içeriği değişir: id, href, veri alanı adı, yapı, stil,
   `kicker` gibi render'ı etkileyen alanlar boşaltılmaz (§13.23 ile aynı
   disiplin). Bir başlık değişirse aynı başlığın geçtiği HER yer (ToolHeader,
   toolCatalog, tools.jsx, TefekkurHighlight, Navbar) aynı commit'te güncellenir.
4. `split(' — ')` gibi metne bağımlı kod var mı kontrol et; varsa ayraç
   kodu güncellenir (örnek: `AhiretYolculugu.jsx` aşama sekmeleri,
   `split(/ — |: /)`).

**İstisnalar (dokunulmaz):** âyet çevirileri ve Arapça metin; kaynak atfı
tiresi ("— Yûsuf 12:53", "— Ref"); araç adı başlık ayracı ("Furûk — Kelime
Farkları" biçimindeki `TITLE_TR/EN`, karar §9 `tasks/Todo_humanizer.md`);
diyagram etiketleri ("D — Merkez", "Yaratılış → Yaratıcı"); boş değer yer
tutucusu `'—'`; tecvid kısaltmaları; `visualMotif`, `workRef` gibi
render edilmeyen alanlar; katalog kartındaki "N · N · N" etiketi.

**Referans:** site geneli tespit ve stil kararları `tasks/Todo_humanizer.md`
(§9 tire, "değil", kalın, ok, sayı-etiketi, Türkçe başlık, satış sıfatı,
§13.24 tutarlılığı, EN ayrı geçiş); uygulanmış örnekler
`tasks/humanizer-changelog.md` §1–§17 (`humanizer` dalı, 2026-09-06).

**Neden bu kural var:** 2026-09-06 site taramasında 8.364 uzun tire, 862
"X değil — Y", 1.242 ok zinciri ve onlarca satış sıfatı bulundu; hepsi
üretim aşamasında önlenebilirdi. Sonradan temizlik 17 commit ve 241 dosya
sürdü. Yeni içerik aynı borcu yeniden biriktirmemeli.

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

#### ⚠ `gridTemplateColumns: isMobile ? '1fr' : '...'` YASAK — CLS üretir (2026-08-14)

Bu satır burada uzun süre **"✅ DOĞRU"** diye duruyordu; 14 Ağustos'ta
`CrossToolCTA.jsx`'te (54 dosyada kullanılan paylaşılan bileşen) tam bu
kalıp ölçülünce bazı sayfalarda **CLS 1.0'ı aştı** (eşik 0.1). Sebep:
`isMobile`, §14.1'in SSR-safe kalıbıyla (`useState(false)+useEffect`)
geliyor — hydration anında **her zaman `false`**. Mobilde sayfa önce
masaüstü ızgarasıyla render olur, hydration'dan hemen sonra tek sütuna
yeniden dizilir. Bu bir kozmetik gecikme değil, ölçülen bir CWV ihlalidir.

- ❌ YASAK: `gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'`
  (JS state'e bağlı **düzen-kritik** CSS özelliği)
- ✅ DOĞRU: CSS class + media query — tarayıcı JS'i beklemeden çözer:
  ```css
  .my-grid { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 640px) {
    .my-grid { grid-template-columns: 1fr; }
  }
  ```
  Sütun sayısı dinamikse (`Math.min(links.length, 3)` gibi), CSS custom
  property ile taşı: `style={{ '--cols': n }}` + CSS'te
  `repeat(var(--cols, 3), 1fr)`. Referans uygulama: `CrossToolCTA.jsx` +
  `globals.css`'teki `.cross-tool-cta__*` / `.sources-citation__*` kuralları.
- ⚠ **`display: isMobile ? 'none' : 'flex'` ile sidebar/panel gizleme de
  aynı riski taşır** (§14.3) — henüz ölçülüp düzeltilmedi. Yeni kod için
  mümkünse burada da CSS media query tercih edilmeli; mevcut kullanımlar
  bir sonraki CWV turunda gözden geçirilecek (`tasks/todo_agu13_2026.md`
  Z3-V, kök #2).
- ✅ `isMobile`'ı JS DAVRANIŞI için kullanmaya devam et — touch handler,
  koşullu render mantığı, event listener seçimi gibi düzeni DEĞİŞTİRMEYEN
  yerlerde risksizdir.

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

---

## 17. AKTİF İŞ — ANASAYFA YENİDEN YAPILANDIRMA (2026-06-15+)

**Durum:** Sürüyor. Anasayfanın 14 derin bölümü "hook + görsel + 2 satır + Keşfet →" kart formatına indiriliyor.

### 17.1 Geri Dönüş Noktası — UZUN ANASAYFA FORMATI

Kullanıcı *"UZUN ANASAYFA FORMATINA DÖN"* dediğinde, anasayfayı yeniden yapılandırma ÖNCESİ haline döndür:

```
Tag      : homepage-uzun-format-2026-06-15
Commit   : 0e78d1ad094d6bba62fd2d37f153e1af644312bc
Mesaj    : feat(tefekkur): VerseInline'a build-time Arapça inject + §13.15 normalize
Tarih    : 2026-06-15 01:18:55 -0400
```

**Tam revert komutu** (working tree dahil her şeyi geri al):
```bash
git reset --hard homepage-uzun-format-2026-06-15
```

**Sadece anasayfa dosyaları için kısmi revert:**
```bash
git checkout homepage-uzun-format-2026-06-15 -- next/src/sections/ next/src/app/\[locale\]/page.js
```

Tag local — push edilmedi. Kaybolmaması için `.git/refs/tags/` altında saklı.

### 17.2 Plan Referansı

- **Envanter mapping tablosu:** `tasks/anasayfa-envanter-2026-06-15.md` — 14 bölümün hedef tool sayfası ile derinlik eşleşmesi (TAM / KISMEN / YOK).
- **Pilot sırası:**
  1. **Pilot 1 — AllahKendiniTanitir → /arac/esma-frekans** (Katman A · TAM). Minimum kart pattern'ı kurma.
  2. **Pilot 2 — ScientificSigns → /atlas/doga (Tabiat Atlası)** (Katman B · KISMEN). İçerik göçü pattern'ı.
  3. **Pilot 3 — LinguisticDNA → yeni /arac/mukattaa** (Katman C · YOK). Yeni tool sayfası yaratma pattern'ı.
  4. Pattern oturduktan sonra kalan 11 bölüm çoğaltma.

### 17.3 Kart Pattern Referansı

Pilot 1'in sonucunda ortaya çıkan "minimum kart" formatı tüm Katman A/B/C kart-ize işlerinde **referans pattern**'dır:

- Gold-glow portal frame (max-width 760px, border `${COLORS.gold}33`)
- Eyebrow (UPPERCASE 0.24em, gold opacity 0.8)
- Hook headline (clamp 1.7→2.6rem, FONTS.display, off-white)
- Anchor verse (KFGQPC, gold, U+0650 §13.15 compliant, lineHeight 2.1) + italik çeviri + UPPERCASE referans label
- 1 cümlelik giriş (max 25-30 kelime, silver)
- CTA pill button (background `${COLORS.gold}1a` → hover `${COLORS.gold}33`)
- Closing whisper (Playfair italic, opacity 0.6, "stat özeti" formatında: "X · Y · Z")

**YASAK:**
- Anasayfa kartında 4+ teaser sub-card (hedef tool sayfasına devredilmeli — duplikasyon olur)
- 2 paragraf+ giriş metni (kart formatı tek cümle)
- Anchor verse'i çıkarmak (Wonder-ankrası — kalır)
- Hedef tool sayfasında olmayan derinliği karta sıkıştırmak (önce göç et, sonra kart-ize)

### 17.4 Çalışma Kuralı — Push Onayı

Bu yeniden yapılandırma boyunca her commit local'de kalır. **Main'e push sadece kullanıcı explicit onayıyla** (her push ayrı onay). Vercel auto-deploy + chunk hash mismatch + user stale tab 404 riski (memory: `feedback_local_test_first.md`).
