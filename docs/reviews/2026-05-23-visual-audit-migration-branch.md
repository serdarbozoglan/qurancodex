# QuranCodex Görsel/Tasarım Denetim Raporu — Migration Branch
**Tarih:** 2026-05-23
**Branch:** `migration-to-next.js`
**Denetçi:** qc-visual-auditor
**Kapsam:** `next/src/{app,components,sections,tokens.js}` — Faz 4 sonrası route/overlay birleşim katmanı

---

## Özet

- Taranan dosya: ~75 (`next/src/components/*.jsx`, `next/src/sections/*.jsx`, `next/src/app/[locale]/**/*.{js,jsx}`, tokens, globals.css)
- **Kritik: 5**, Yüksek: 7, Orta: 8, Düşük: 5

Migration'ın görsel etkisi tek bir kelimeyle: **yarım**. Route'lar kurulmuş ama içlerine konulan component'ler hâlâ "overlay" zihniyetinde — `position:fixed`, `inset:0`, `zIndex:9999`. Bu da navbar'ı görsel olarak yok ediyor, double layout problemine yol açıyor ve URL paylaşılabilirliği vaatlerini geçersiz kılıyor.

Tasarım tutarlılığı tarafında esas sorun: tokens.js'in çok detaylı genişletilmiş olması (slate, paper, softGold ailesi vb.) ama component'lerin **çoğunlukla ham rgba/hex değerleri kullanmaya devam etmesi**. Token kütüphanesi son 6 ayda zenginleşti; component'ler henüz yetişmedi.

---

## KRİTİK SORUNLAR

### [K1] Çift Navbar — root layout + locale layout aynı anda render eder

**Dosya:** `next/src/app/layout.js:56` + `next/src/app/[locale]/layout.js:28`
**Sorun:**
- Root layout `<Navbar />` render ediyor (layout.js:56).
- Locale layout (`[locale]/layout.js:28`) tekrar `<Navbar />` render ediyor.
- Next.js App Router'da nested layout'lar birikir — yani `/tr/oku` route'unda **iki navbar üst üste** çizilir.
- Görsel etki: çift sticky bar (54+72=126px), CTA "Kur'an'ı Oku" iki kez, dil seçici iki kez.

**Çözüm:**
- Root `app/layout.js`'ten `<Navbar />` kaldır — locale segment'i tüm sayfaları zaten kapsıyor.
- Sadece `<LanguageProvider>` ve `<PathProvider>` root'ta kalsın (gerekiyorsa); fakat dikkat — locale layout zaten LanguageProvider sarıyor.
- Net çözüm: root layout'u minimal tut (`<html><body>{children}</body></html>` + font imports + globals). Tüm Provider'lar ve Navbar `[locale]/layout.js`'e taşınsın.

---

### [K2] Overlay component'ler hâlâ `position:fixed, inset:0, zIndex:9999` — Navbar'ı tamamen örter

**Dosyalar:** 36 component (en kritikleri)
- `next/src/components/ReadingMode.jsx:2292`
- `next/src/components/ConceptGraph.jsx:302`
- `next/src/components/WowFacts.jsx:779`
- `next/src/components/VerseGraph.jsx:1026`
- `next/src/components/EsmaFrekans.jsx`, `Melekler.jsx`, `KuranYeminleri.jsx`, `QuranCommands.jsx`, vd. — **toplam 36 dosya** (`grep -rln "OVERLAY_BASE\|inset: 0, zIndex: 9999"` ile listelendi)

**Sorun:**
- Tool component'leri Vite mimarisinde "overlay" olarak tasarlanmıştı — başka bir sayfanın üstüne `<div style={position:fixed, inset:0, zIndex:9999}>` patlatıyor.
- Migration'da route page (örn. `app/[locale]/arac/wow/page.js`) bu component'i direkt mount ediyor — `<WowFacts onClose={() => router.back()} />`.
- Sonuç: route, **navbar dahil tüm viewport'u** kaplıyor. Navbar artık kullanıcıya görünmez.
- "URL paylaş, geri-ileri çalışsın" vaadi var ama kullanıcı görsel olarak **modal'da gibi hissediyor** — site navigation'a erişimi yok.

**Çözüm seçenekleri:**
1. **Tercih edilen:** Component'leri "section/main" pattern'ına çevir. `position:fixed, inset:0, zIndex:9999` → `min-height: calc(100vh - 54px)` + `padding-top: 54px`. Navbar üstte sticky kalır.
2. **Hızlı patch:** Overlay'lerin `zIndex`'ini Navbar'ın altına düşür (`zIndex: 50`) ve `top: 54px` ekle. Header'larındaki kendi başlık barını kaldır.
3. **Kabul edilemez:** Mevcut hali bırakmak — kullanıcı route'a girdiğinde navbar görünmez, ve overlay kendi "X" butonu router.back() çağırıyor → görsel olarak modal kapanır gibi ama URL değişir → kullanıcı için tutarsız mental model.

---

### [K3] `ToolsBrowser` route'ta hiç açılmıyor — boş ekran

**Dosya:** `next/src/components/ToolsBrowser.jsx:52-74` + `next/src/app/[locale]/arac/tum-araclar/ToolsBrowserRoute.jsx`
**Sorun:**
- ToolsBrowser kendi internal state `open` ile çalışır (`useState(false)`, satır 54).
- Sadece `'openToolsBrowser'` custom event'iyle `setOpen(true)` (satır 60-64).
- Route'ta ise `<ToolsBrowser onClose={() => router.back()} />` mount edilir — ama `onClose` prop'u hiç kullanılmıyor ve `open` hâlâ `false`.
- `<AnimatePresence>{open && ...}</AnimatePresence>` → hiçbir şey render edilmiyor.
- **Görsel sonuç:** `/arac/tum-araclar` sayfası **bomboş** açılır (sadece navbar görünür eğer K2 düzelirse, yoksa o da görünmez).

**Çözüm:**
- ToolsBrowser'a `defaultOpen` prop'u veya `mode='page'` ekle.
- Alternatif: `ToolsBrowserRoute.jsx` içinde `useEffect`'le `window.dispatchEvent(new Event('openToolsBrowser'))` tetikle (kirli ama hızlı).
- En temiz: route-aware bir versiyon yaz — overlay backdrop'u + modal centering yerine page-fit layout.

---

### [K4] `ProphetAtlas` `onClose` prop'unu kabul etmiyor — yine de route'tan geçiliyor

**Dosya:** `next/src/sections/ProphetAtlas.jsx:1468` + `next/src/app/[locale]/atlas/peygamber/ProphetAtlasRoute.jsx:12`
**Sorun:**
- `ProphetAtlasRoute` `<ProphetAtlas onClose={() => router.back()} />` çağırıyor.
- `export default function ProphetAtlas() { ... }` — **hiç prop almıyor**.
- Üstelik bu component bir `<section id="math">` olarak tasarlanmış (satır 1575) — yani section anchor pattern'ında (ana sayfada da render edilebiliyor). Ham `id="math"` (peygamber atlası'na "math" denmesi yanlış anchor — semantic accident).
- Görsel etki: `/atlas/peygamber` route'una giren kullanıcının görsel olarak **çıkış butonu yok** — navbar K2 nedeniyle gizli, section'da kapatma yok, sadece browser-back.

**Çözüm:**
- `function ProphetAtlas({ onClose })` parametre ekle ve header'a CLOSE_BTN ile çıkış butonu ekle (eğer onClose verildiyse).
- `id="math"` → `id="prophet-atlas"`. Diğer section'lar gerçek konularıyla eşleşiyor; bu copy-paste artığı.

---

### [K5] `useQuranNav` locale prefix'siz route'lara push ediyor — middleware redirect'le dengeleniyor ama flash yaratıyor

**Dosya:** `next/src/hooks/useQuranNav.js:19-64`
**Sorun:**
- `OVERLAY_ROUTES = { reading: '/oku', graph: '/graf/ayet', ... }` — locale prefix yok.
- `router.push('/oku')` çağrılır.
- Middleware (`next/src/middleware.js:38`) redirect ile `/tr/oku`'ya çevirir.
- Sonuç:
  1. Görsel **flash** (sayfa yüklenir, sonra redirect yenilenir → 2 frame'lik flicker).
  2. SEO için `<Link>` veya prefixli `router.push` daha sağlıklı — paylaşılan URL'ler middleware'siz çalışsın diye.
  3. Kullanıcı `language === 'en'` bile olsa `/tr/...`'ye yönlendiriliyor (middleware Accept-Language okur ama browser cache).

**Çözüm:**
- `useQuranNav` içinde mevcut `language` (`useLanguage()`) okuyarak prefix ekle:
  ```js
  const url = `/${language}${route}${detail?.search ? `?q=${...}` : ''}`;
  ```

---

## YÜKSEK ÖNCELİK

### [Y1] §13.10 ihlali — `OVERLAY_TITLE` kullanılmadığı overlay'ler var

**Dosyalar:**
- `next/src/components/VerseGraph.jsx:1035` — `fontFamily: 'Playfair Display, serif', color: '#d4a574', fontSize: '1.05rem', fontWeight: 700` (Sûre Haritası başlığı). `OVERLAY_TITLE` Inter + 0.9rem + 700 olmalı.
- `next/src/components/VerseGraph.jsx:1507` — `fontFamily: "'Playfair Display', serif", color: gold, fontSize: '1.35rem'`. Sidebar başlığı ama overlay header'da kalmış.
- `next/src/components/QuranCommands.jsx:206` — `fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.4rem' : '2rem'`. Sayfa başlığı; overlay context'inde çok büyük.
- `next/src/components/ReadingMode.jsx:4792, 5343, 6874, 6885, 6910` — birden çok yerde inline `'Playfair Display', serif` Kur'an okuma modunda başlık olarak.

**Etki:** Modal başlık tipografisi her overlay'de farklı görünüyor. Sistem yok.
**Düzeltme:** `style={OVERLAY_TITLE}` veya `style={{ ...OVERLAY_TITLE, ek: 'değer' }}` ile uniform.

---

### [Y2] §13.2 ihlali — Kur'an metni için `'Amiri'` veya inline string font

**Dosyalar:**
- `next/src/components/ConceptGraph.jsx:500` — `fontFamily: "'Amiri', serif"` ile Arapça kavram chip'i. `FONTS.quran` olmalı.
- `next/src/components/ConceptGraph.jsx:601` — SVG metin `fontFamily="'Amiri', serif"`. Aynı kural.
- `next/src/components/KissaAtlas.jsx:371` — `fontFamily: "'Amiri', serif", fontSize: '1.1rem'` peygamber adı Arapçası.

**Etki:** Aynı sayfada bazı Arapça kelimeler KFGQPC, bazıları Amiri ile çiziliyor — görsel ritm bozuluyor.
**Düzeltme:** Hepsi `fontFamily: FONTS.quran` olsun.

---

### [Y3] §13.1 ihlali — Ham `'KFGQPC', 'Amiri Quran', serif` inline kullanımı (FONTS.quran yerine)

**Dosyalar (en yoğun):**
- `next/src/components/VerseGraph.jsx:776, 1477, 1624, 2416, 2919, 3061, 3180`
- `next/src/components/ReadingMode.jsx:3121, 3451, 3560, 4503` (`'KFGQPC', 'Amiri Quran', 'Amiri', serif` — fazladan 'Amiri' fallback ekleniyor — diğer yerlerden farklı)
- `next/src/components/DuaVerses.jsx:166`
- `next/src/components/QuranCommands.jsx:487`
- `next/src/components/WordHeatmap.jsx:780, 804, 863`
- `next/src/sections/ImpossibleRhythm.jsx:293` (`fontFamily: FONTS.quran` — bu doğru, kontrast olarak verdim)

**Etki:** `FONTS.quran` değiştiğinde (örn. `'Hafs'` family eklemek istesek) bu inline string'ler güncellenmeyecek. Token vaadi geçersiz.
**Düzeltme:** Hepsi `fontFamily: FONTS.quran` olsun. Ek fallback gerekiyorsa token'ı genişlet.

---

### [Y4] Mobil katastrof — `VerseGraph` `width:480px` absolute sidebar, isMobile guard yok

**Dosya:** `next/src/components/VerseGraph.jsx:1490`
**Sorun:**
- `position: 'absolute', left: 0, top: 0, bottom: 0, width: '480px'` — 480px sabit.
- 390px ekranlarda **viewport'tan taşar** (overflow-x).
- `isMobile` kontrolü yok bu component'te.

**Düzeltme:** `width: isMobile ? '100vw' : '480px'` + mobilde tab pattern'ına geç (CLAUDE.md §14.4).

---

### [Y5] Hero CTA ham hex — `#1c0f00` token'a alınmamış

**Dosya:** `next/src/components/Navbar.jsx:1093, 1111`
**Sorun:**
- `color: '#1c0f00'` — altın butonun zemin metni rengi (koyu kahve).
- Tokens.js'te `inkBlack: '#08091a'` var ama bu farklı renk.
- `paperInk: '#1a0e00'` çok yakın bir değer var (paper/day mode için) — ama re-purpose etmek semantic olarak kafa karıştırıcı.

**Düzeltme:** Yeni token `COLORS.btnGoldText = '#1c0f00'` ekle. Tüm `btn-primary-gold` ve navbar Oku butonu bunu kullansın.

---

### [Y6] Navbar buton yüksekliği eşit (✓) — ama mobil menü açma butonu farklı yükseklikte (≈48px)

**Dosya:** `next/src/components/Navbar.jsx:1144-1162`
**Sorun:**
- "Kur'an'ı Oku" CTA: 32px ✓
- TR/EN dil butonu: 32px ✓
- Mobil hamburger butonu: `p-2` (Tailwind padding-2 = 8px her yana) + 24×24 SVG = ≈40px görsel yükseklik. Diğerlerinden ~8px yüksek.
- Bu sadece mobilde fark eder ama navbar 54px yükseklikte → 40px buton 14px dikey boşluk bırakıyor; 32px butonlar yan yana 22px boşluk bırakıyor → görsel asimetri.

**Düzeltme:** Hamburger butonu da `width:36px; height:36px` ile aynı CLOSE_BTN-benzeri stilde sabitlensin.

---

### [Y7] Hero butonu — ham rgba, lokal animasyon değerleri token'sız

**Dosya:** `next/src/components/Hero.jsx:94`
**Sorun:**
- `whileHover={{ scale: 1.05, boxShadow: '0 0 48px 12px rgba(180,130,40,0.5)' }}` — ham rgba.
- `.btn-primary-gold` CSS class'ı (`globals.css:158`) içinde de aynı renk kombinasyonu var (`#c9973a → #b8860b → #9a6f0a`). Bu renkler token'da yok — sadece CSS'te.

**Düzeltme:** "Altın CTA buton dizisi" için token kümesi tanımla: `COLORS.goldButtonStart/Mid/End` veya direkt `linear-gradient` token'ı.

---

## ORTA ÖNCELİK

### [O1] §13.1 ihlali — `#d4a574` (gold) ham hex 159 kez kullanılıyor

**Dosya:** `next/src/components/VerseGraph.jsx` (159 ham hex), `ReadingMode.jsx` (138 ham), `Melekler.jsx` (69 ham), `CennetCehennem.jsx` (59 ham), `KavimlerAtlasi.jsx` (56 ham), `KuranRenkleri.jsx` (50), `RevelationTimeline.jsx` (42), `KissaAtlas.jsx` (39), `Navbar.jsx` (38), `SurahComparator.jsx` (37) + 20+ dosya
**Toplam ham hex:** ~1.181 kullanım `src/components/` + `src/sections/` altında

**Sorun:** Token'lar var (`COLORS.gold`, `goldAlpha15` vb.) ama component'ler ham `'#d4a574'`, `'rgba(212,165,116,0.X)'` kullanıyor. Token sistemi vaadi kâğıt üzerinde.

**Düzeltme:** Codemod ile büyük dönüşüm:
- `'#d4a574'` → `COLORS.gold`
- `'rgba(212,165,116,0.15)'` → `COLORS.goldAlpha15`
- `'rgba(212,165,116,0.25)'` → `COLORS.goldAlpha25`
- `'#e8e6e3'` → `COLORS.offWhite`
- `'#94a3b8'` → `COLORS.silver`
- `'#64748b'`, `'#475569'`, `'#334155'` → tokens'te tanımlı (`slate500`, `slate600`, `slate700`)

---

### [O2] Ham rgba kullanımı 2.293 kez

**Top dosyalar:** `ReadingMode.jsx` (372), `VerseGraph.jsx` (164), `ProphetAtlas.jsx` (155), `HumanDefinition.jsx` (78), `FurukAtlasi.jsx` (67), `ImpossibleRhythm.jsx` (66), `SoundArchitecture.jsx` (63), `QuranDua.jsx` (60), `KuranRenkleri.jsx` (57), `IlkSonKelimeler.jsx` (56)

**Sorun:** `rgba(255,255,255,0.04)` (glassBgFaint), `rgba(255,255,255,0.05)` (glassBg), `rgba(255,255,255,0.1)` (glassBorder), `rgba(212,165,116,0.X)` (gold alpha'lar) sürekli ham olarak yazılıyor.

**Düzeltme:** Otomatik refactor + ESLint kuralı: "ham `rgba()` veya `#[a-f0-9]{3,6}` inline style yasak" — `tokens.js`'ten import şart.

---

### [O3] BorderRadius token coverage düşük — 592 ham, 256 RADIUS token

**Sorun:** `borderRadius: '8px'` (md), `'10px'` (chip), `'12px'` (lg), `'20px'` (pillSm), `'999px'` (pill) — token'da hepsi var ama component'lerin %70'i ham değer kullanıyor.
**Düzeltme:** Tüm `borderRadius: '8px'` → `borderRadius: RADIUS.md` (kez 5).

---

### [O4] Transition token coverage düşük — 226 ham, 25 TRANSITION token

**Sorun:** `transition: 'all 0.15s'`, `'all 0.2s'`, `'all 0.18s'`, `'all 0.3s'` — token'da `TRANSITION.fast/base/slow` var ama component'lerin %90'ı ham.
**İlave:** `'all 0.18s'` token'da yok — `fast` (0.15s) ile `base` (0.2s) arası ara değer.
**Düzeltme:** TRANSITION.subtle (0.18s) ekle veya `0.15`'e yuvarla; refactor.

---

### [O5] `text-center` body metin üzerinde (§11 ihlali)

**Dosyalar:**
- `next/src/sections/HumanDefinition.jsx:1080` — `<p className="text-silver/60 text-xs font-body text-center leading-relaxed mb-4 flex-1">` (kart içi açıklama; flow body text).
- `next/src/sections/LinguisticDNA.jsx:310` — `<p className="text-center text-silver/60 text-sm font-body">` (sayım rüzgârı altındaki yardım metni).
- `next/src/sections/LinguisticDNA.jsx:617` — `<p className="text-silver text-lg md:text-xl font-body mb-7 max-w-2xl mx-auto">` — mx-auto kullanmış (intro tarzı text-left olmalı, ama bu bir kart içi olabilir).

**Sorun:** §11 "Card body text: text-left" diyor. Kartlarda text-center kullanılması okuma akışını kırar.
**Düzeltme:** Kart içeriklerinden `text-center` kaldır.

---

### [O6] Glassmorphism — `.glass-card` CSS class ile `GLASS_CARD` token farklı değerlere sahip

**Dosya:** `next/src/app/globals.css:141-155` vs `next/src/tokens.js:208-220`
**Sorun:**
- `.glass-card` CSS: `bg: rgba(255,255,255,0.04)`, `border: rgba(255,255,255,0.08)`, `border-radius: 16px`
- `GLASS_CARD` token: `bg: COLORS.glassBg (rgba(255,255,255,0.05))`, `border: COLORS.glassBorder (rgba(255,255,255,0.1))`, `border-radius: 12px`

İki "kart" tanımı arasında **alpha 0.04 vs 0.05**, **0.08 vs 0.1**, **16px vs 12px** farkı var.
**Etki:** Tailwind class kullanan component'ler (Footer, Conclusion) ile inline token kullananlar (PathCard, ToolHighlightCard) farklı görünüyor — visible inconsistency.
**Düzeltme:** Tek bir kaynağa kilitle. Tercih: token'ı baz al, CSS class'ı token değerleriyle eşitle.

---

### [O7] `cleanArabicForGraph` her component'te kopya — drift riski

**Dosyalar:** `VerseGraph.jsx`, `ConceptGraph.jsx`, `ProphetAtlas.jsx` ve diğer 6+ component'te ayrı ayrı tanımlı `cleanArabic*()` fonksiyonları var.
**Sorun:** §13.14 ve §13.15 fix'leri (maddah, asar, alef wasla, Farsi yeh) bir yerde güncellenirse, diğerlerine taşımak elden. Halen `cleanDuaAr` (ProphetAtlas) ile `cleanArabicForGraph` (VerseGraph) **farklı regex listeleri** kullanıyor — örneğin one strip U+06D6-U+06DC, diğer strip U+06D6-U+06DB.
**Düzeltme:** `next/src/lib/arabic.js` ortak modülü; tek `cleanArabic()` export. Görsel yan etki: gelecekte bir component'te ekstra waqf rendering, başkasında değil — silent drift.

---

### [O8] `globals.css` `--color-glass-border` ≠ `tokens.js glassBorder`

**Dosya:** `next/src/app/globals.css:57` vs `tokens.js:139`
**Sorun:**
- CSS: `--color-glass-border: rgba(212, 165, 116, 0.12)` (gold-tonlu)
- JS token: `glassBorder: 'rgba(255, 255, 255, 0.1)'` (beyaz)

**Etki:** Tailwind `border-glass-border` class'ı altın tonlu bir kenarlık çizer; inline `border: 1px solid COLORS.glassBorder` beyaz tonlu çizer. **İki farklı kart kenarlığı dolaşıyor.**
**Düzeltme:** Aynı değere kilitle. Hangisi doğru: kullanıcı tercihi. Önerim: token'ı `0.1` beyaz tut, Tailwind class'ı buna eşitle. `glass-card-strong` da aynı.

---

## DÜŞÜK ÖNCELİK

### [D1] `'#e8c98a'` ve `'#d4b483'` — gold variant ham hex'leri

**Dosyalar:**
- `next/src/sections/LinguisticDNA.jsx:300` — `color: '#e8c98a'` (parlak gold variant)
- `next/src/components/VerseGraph.jsx:2416` — `color: '#d4b483'`
- `next/src/components/VerseGraph.jsx:2919` — `color: '#e8c98a'`

**Düzeltme:** `COLORS.goldBright = '#e8c98a'` token'ı ekle; `softGold` (#c9a96e) zaten var ama daha sönük.

---

### [D2] `:focus-visible` global ama component-level focus state'leri inline

**Dosya:** `next/src/app/globals.css:336-339` (`:focus-visible { outline: 2px solid var(--color-gold); }`)
**Sorun:**
- Global focus var ama her component kendi `onFocus` ile inline `borderColor` değişimi yapıyor.
- Native `outline` + inline `borderColor` çakışabilir; bazı yerlerde aynı anda iki vurgu çizimi olabilir.

**Düzeltme:** Component'ler `:focus-visible` CSS class'ına güvensin, inline `onFocus`'tan vazgeç. Veya inline yaklaşımını uniformlaştır.

---

### [D3] Inline `'#64748b'`, `'#475569'`, `'#334155'` — slate hex'leri token'a alınmamış

**Sorun:** `tokens.js`'te `slate500/600/700` zaten tanımlı ama component'ler ham hex kullanıyor.
**Örnek:** `ConceptGraph.jsx:354, 367, 409` — `'#64748b'`, `'#334155'`, `'#475569'`.
**Düzeltme:** Replace.

---

### [D4] Animasyon süreleri tutarsız — `0.15s`, `0.18s`, `0.2s`, `0.25s`, `0.3s`

**Sorun:** Token `fast/base/slow` ile uyumsuz 4-5 farklı süre dolaşıyor. Görsel tempo değişken.
**Düzeltme:** Tüm hover/focus → fast (0.15s), tüm panel/drawer → slow (0.3s).

---

### [D5] `ProphetAtlas` section id `id="math"` — yanlış anchor

**Dosya:** `next/src/sections/ProphetAtlas.jsx:1575`
**Sorun:** Bir kopya-paste artığı. Section sırasıyla "Peygamberler" konusunu işliyor ama HTML id `math` (MathMiracle'dan kalma).
**Etki:** Scroll-to-anchor (`#math`) yanlış yere götürüyor olabilir; SEO/accessibility anomalisi.
**Düzeltme:** `id="prophet-atlas"`.

---

## CROSS-CUTTING — GENEL DEĞERLENDİRME

### Tasarım dilinin tutarlılığı: orta-yüksek

- **Güçlü yönler:**
  - `tokens.js` çok kapsamlı — slate/gold/paper aileleri eksiksiz tanımlı.
  - `OVERLAY_BASE`, `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`, `GLASS_CARD`, `VERSE_DISPLAY_CARD`, `RADIUS`, `Z_INDEX`, `BLUR`, `TRANSITION` token kütüphanesi mevcut.
  - Hero, PathCard, ToolHighlightCard, ToolStub, Footer — token disiplinli yazılmış (referans örnek).
  - `cleanArabic()` ve §13.15 strip listesi her component'te uygulanmış (görsel olarak hareke render'ı temiz).
  - `globals.css` `:focus-visible`, `prefers-reduced-motion`, scrollbar styling, gradient divider — sistem düzgün.

- **Zayıf yönler:**
  - 36 ana overlay component'i hâlâ "modal" zihniyetinde — route'a taşıma yapısal olarak yarım.
  - Token kullanım disiplini büyük dosyalarda (ReadingMode 9612L, VerseGraph 3300L+, ProphetAtlas 3192L) çatlamış — ham hex/rgba %70+.
  - `app/layout.js` + `[locale]/layout.js` double-Navbar bug → en görünür hata.
  - `useQuranNav` locale-prefix'siz route'lara push → middleware redirect overhead + flash.
  - `ToolsBrowser` route'ta açılmıyor → boş ekran (silent bug).
  - `ProphetAtlas` close-button alınmadan route'a alınmış → kullanıcı çıkamaz.

### En zayıf alanlar
1. **Migration mimarisi** — overlay-to-route dönüşümü sadece dosya/route oluşturmakla yapılmış; component'ler hâlâ overlay gibi davranıyor. K2 + K3 + K4 hepsi bu kategori.
2. **Token disiplini** — kütüphane mükemmel, kullanım ortalama. ReadingMode/VerseGraph tek başına 500+ ham hex/rgba ile sürdürülebilirlik düşüyor.
3. **Mobil parite** — bazı component'ler (`AddresseeSystem`, `QuranCommands`) düzgün `display: isMobile ? 'none' : 'flex'` yapıyor, ama `VerseGraph` 480px sidebar tek bir mobile-guard'sız.

### En güçlü alanlar
1. **Yeni eklenen home component'leri** (Hero, PathCard, ToolHighlightCard, AllTopics, PathCards, ToolsHighlight) — token disiplinli, mobile-aware, hydration-safe.
2. **Arapça encoding/font sistemi** — `cleanArabic()` pipeline her component'te uygulanmış; §13.15 tam coverage.
3. **CLOSE_BTN, OVERLAY_TITLE** — referans noktası olarak iyi tasarlanmış ve çoğu yerde benimsenmiş.
4. **Section intro paragrafları** — §11 kuralı (`max-w-3xl text-left`) section'larda %90+ uyumlu.

---

## ÖNERİLEN ÖNCELİK SIRASI

1. **K1** (double Navbar) — 1 commit, 10 dakika. Anında görsel iyileşme.
2. **K4** (ProphetAtlas onClose + id fix) — 1 commit, 15 dakika.
3. **K3** (ToolsBrowser mode='page') — 1 commit, 30 dakika.
4. **K5** (useQuranNav locale-prefix) — 1 commit, 10 dakika.
5. **K2** (overlay-to-route mimarisi) — büyük refactor, 36 component, **birkaç gün**. Geçici çözüm: zIndex'leri 50'ye düşürüp `top: 54px` ekleyerek navbar görünür hale getirilebilir.
6. **Y1-Y3** (OVERLAY_TITLE + FONTS.quran disiplinli kullanım) — 1-2 gün codemod.
7. **Y4** (VerseGraph mobil) — 1 commit, 30 dakika.
8. **O1-O8** — codemod + ESLint kuralları ile pasif tutum, zaman içinde temizlenecek.
9. **D1-D5** — küçük düzeltmeler; bir araya getirip tek commit.

---

**Rapor sonu.**
