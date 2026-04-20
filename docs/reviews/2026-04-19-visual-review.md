# QuranCodex Görsel/Tasarım Denetim Raporu
Tarih: 2026-04-19
Denetçi: qc-visual-auditor
Kapsam: `src/components/*.jsx` (42), `src/sections/*.jsx` (22), `src/App.jsx`, `src/index.css`, `src/tokens.js`

---

## Özet

- Taranan dosya: ~66
- Ham `#xxxxxx` hex kullanımı: **1.205** eşleşme / 48 dosya
- Ham `rgba(...)` kullanımı: **1.795** eşleşme / 52 dosya
- Inline `borderRadius: 'Xpx'` kullanımı: **577** eşleşme / 14 farklı değer
- Token import eden dosya: 41 / 66 (≈ %62)
- Token hiç kullanmayan dosya: **23** (çoğu büyük, "ağır" section: `ProphetAtlas`, `HumanDefinition`, `ReadingMode`, `VerseGraph`, `QuranCommands`, `Navbar`, `PsychologySection`, `Conclusion`, `HiddenArchitecture`, `HiddenSymmetry` vs.)
- Kritik bulgu: **8**, Orta: **19**, Minör: **9**

> En önemli tespit: `src/index.css` ve `src/tokens.js` paletleri **birbirinden farklı** (cosmicBlack = #0a0a1a vs #080a1e; deepNavy = #0d1b2a vs #0c0e28). Tailwind `bg-cosmic-black` ile inline `COLORS.cosmicBlack` aynı rengi üretmiyor.

---

## RENK SORUNLARI

### [K-1] index.css ve tokens.js paletleri çelişkili — TEK KAYNAK İLKESİ KIRILDI
**Dosya:** `src/index.css:9-31` vs `src/tokens.js:6-57`
**Sorun:** İki ayrı palet yaşıyor.

| Token | CLAUDE.md tanımı | tokens.js | index.css |
|---|---|---|---|
| `cosmicBlack` | `#0a0a1a` | `#0a0a1a` | `#080a1e` |
| `deepNavy` | `#0d1b2a` | `#0d1b2a` | `#0c0e28` |
| `gold` | `#d4a574` | `#d4a574` | `#d4a574` ✓ |

Tailwind `bg-cosmic-black` (CSS değişkeninden) ile inline `background: COLORS.cosmicBlack` aynı rengi vermez. Section arka planı Tailwind'den, kartlar inline'dan beslendiğinde gözle görülür bir tonlama kayması oluşur. **CLAUDE.md §4 paletini** ikisi de ihlal ediyor (CLAUDE.md deepNavy = `#0d1b2a`).
**Öneri:** `index.css @theme` bloğu `COLORS`'tan türetilmeli veya manuel senkronlanmalı. Hangi paletin doğru olduğuna karar verilmeli (CLAUDE.md'ye göre `#0a0a1a` / `#0d1b2a` doğru).

---

### [K-2] Palet dışı altın tonu: `#c9a96e`
**Dosya:** `Navbar.jsx:1010`, `QuranCommands.jsx:116/216/443`, `CennetCehennem.jsx:8`, `Melekler.jsx` (3×), `KuranRenkleri.jsx:68`
**Sorun:** Palette tanımlı `COLORS.gold (#d4a574)` ve `COLORS.royalGold (#c9a227)` varken 10+ farklı yerde üçüncü bir altın tonu (`#c9a96e`) kullanılıyor. Navbar'daki dil seçici butonu bu renkle çiziliyor → "Kur'an'ı Oku" CTA'sıyla yan yana iki farklı altın görülüyor.
**Öneri:** Tek altına indir (`COLORS.gold`) veya yeni bir `antiqueGold` tokenı ekleyip tutarlılaştır.

---

### [K-3] ProphetAtlas tokens.js'yi hiç import etmiyor
**Dosya:** `src/sections/ProphetAtlas.jsx:3100-3147` (ve dosya genelinde 45 hex + 176 rgba)
**Sorun:** 3.000+ satırlık en büyük section hiçbir token kullanmıyor. `fontFamily: "'KFGQPC', 'Amiri Quran', serif"` ile manuel yazılmış, `color: '#d4a574'` ham hex. §13.1 ihlali.
**Öneri:** `FONTS.quran` ve `COLORS.gold` geçir. Tooltip kutuları `GLASS_CARD` kullanabilir.

---

### [K-4] PsychologySection kendi özel paletini tanımlıyor
**Dosya:** `src/sections/PsychologySection.jsx:9-20`
**Sorun:** 10 kategori rengi (`#8B5CF6`, `#F43F5E`, `#F59E0B`, `#6366F1`, `#10B981`, `#0EA5E9`, `#14B8A6`, `#A855F7`, `#F97316`, `#94A3B8`) tokens.js'den bağımsız tanımlanmış. `COLORS.purple (#a78bfa)` ile `#8B5CF6` birbirine yakın ama eşit değil. `#94A3B8` ise `COLORS.silver` ile karakter karakter aynı hex — ama import edilmemiş, sadece elle yazılmış.
**Öneri:** Renk paletini `COLORS` üzerinden kur (`violet`, `softRed`, `amber`, `cyan`, `softEmerald`, ...). Eksik olanlar tokenize edilsin (`indigo`, `rose`, `lime`, `orange500`).

---

### [O-5] QuranCommands'te deepNavy yerine ham hex
**Dosya:** `src/components/QuranCommands.jsx:109/171`
```js
background: '#0d1b2a',
```
**Öneri:** `COLORS.deepNavy`. Ayrıca hiç token import etmiyor — 14 ham hex var.

---

### [O-6] VerseGraph'ta palet dışı koyu arka planlar
**Dosya:** `src/components/VerseGraph.jsx:1006/719/1042`
```js
background: '#06080e'
background: '#07091a'
background: '#080a1e'
background: '#0d1128'
```
**Sorun:** Aynı "overlay koyu arka plan" için 4 farklı hex. `COLORS.overlayBg` (`#0a0a1a`) var ama kullanılmıyor.
**Öneri:** Hepsini `COLORS.overlayBg` veya yeni bir `COLORS.panelDeep` tokenına bağla.

---

### [O-7] VerseGraph'ta palet dışı altın-sarı tonlar
**Dosya:** `src/components/VerseGraph.jsx:474/498/2369/2818/2960`
```js
'#f0c860'   // seçili düğüm altın — tokens.js'te yok
'#fff8ee'   // hover rengi — kendine özgü
'#d4b483'   // ayet Arapçası — COLORS.gold'dan türetilmiş ama farklı
'#e8c98a'   // süper altın — token yok
```
**Öneri:** `COLORS.gold` + alfa varyantı veya yeni `goldBright`, `goldDim` tokenları tanımla.

---

### [O-8] SurahComparator'da palet dışı grayscale skala
**Dosya:** `src/components/SurahComparator.jsx:218/247/281/313/317/411/437`
```js
color: '#475569', '#334155', '#1e293b', '#cbd5e1'   // Tailwind slate skalası
```
**Sorun:** 4-5 farklı slate tonu palette yok. `COLORS.silver (#94a3b8)` ve `COLORS.slate500 (#64748b)` var, ama `slate600-900` eksik.
**Öneri:** tokens.js'e `slate` skalası ekle.

---

### [O-9] HumanDefinition modal'ı tamamen ham hex/rgba
**Dosya:** `src/sections/HumanDefinition.jsx:10-80/396-410`
**Sorun:** 4 kategori kendi color + glow + border üçlüsüyle rgba literal tanımlıyor. Modal `background: '#0d1b2a'` + `color: '#64748b'` + `color: '#94a3b8'` ham hex.
**Öneri:** Kategori renkleri `COLORS.gold / skyBlue / softEmerald / purple`'dan gelebilir. Modal style'ı tokenize.

---

### [O-10] Section-local palette tanımları (tutarsız tekrar)
**Dosya:** `LivingPreservation.jsx:24-26`, `HiddenArchitecture.jsx:8-12`, `ZeroRedundancy.jsx:77/90`, `QuranDua.jsx:12/29/46/66/72/78`, `QuranRhetoric.jsx:31/39/47` ve diğerleri
**Sorun:** Altın/emerald/skyBlue üçlüsü her section'da inline hex ve rgba-glow ile yeniden tanımlanıyor. tokens.js'deki hazır değerler (goldAlpha15, goldAlpha25, goldAlpha45) kullanılmıyor.
**Öneri:** `COLORS.skyBlueAlpha15/25`, `COLORS.softEmeraldAlpha15/25`, `COLORS.softRedAlpha15/25` ekle ve bu section'larda ref et.

---

### [M-11] KuranRenkleri yarı-tokenize
**Dosya:** `src/components/KuranRenkleri.jsx:64-71`
**Sorun:** `color: COLORS.softRed` ve `color: COLORS.gold` kullanıyor ama yanında `color: '#1D9E75'`, `'#60a5fa'`, `'#f87171'`, `'#c9a96e'`, `'#f87171'` gibi ham hex de var. Aynı obje içinde iki tarz karışmış.

---

### [M-12] Çerçeve (border) rgba'lar tekrar ediyor
**Sorun:** `border: '1px solid rgba(212,165,116,0.25)'` ve `'1px solid rgba(212,165,116,0.15)'` 50+ yerde inline yazılıyor. `COLORS.goldAlpha15` / `goldAlpha25` var ama `border: '1px solid ${COLORS.goldAlpha25}'` pattern'i eşit düzeyde kullanılmıyor.
**Öneri:** `BORDER_GOLD_SOFT`, `BORDER_GOLD` gibi composite tokenlar oluştur.

---

## TİPOGRAFİ SORUNLARI

### [K-13] Kur'ân metninde `'Amiri', serif` kullanımı — §13.2 KRİTİK İHLAL
**Dosya:**
- `ConceptGraph.jsx:473` — `<span style={{ fontFamily: "'Amiri', serif" }}>{c.ar}</span>`
- `ConceptGraph.jsx:574` — SVG text `fontFamily="'Amiri', serif"` Arapça harf için
- `SurahComparator.jsx:212/313/832/879` — sure isimleri Arapça (`SURAH_NAMES_AR[...]`) `'Amiri'` ile basılıyor
- `KissaAtlas.jsx:367` — `<span style={{ fontFamily: "'Amiri', serif" }}>` nebi/ayet Arapçası

**Sorun:** CLAUDE.md §13.2 "MUTLAK" kuralı: Kur'an metni için sadece `FONTS.quran` (KFGQPC). Arapça kelime/ayet metni "Kur'ân metni"dir; sure isimleri ve kavramlar da Kur'ânî karakterleri barındırır.
**Öneri:** `fontFamily: FONTS.quran`. `FONTS.arabic` sadece Arapça UI metni (ör. breadcrumb etiketi) için kullanılır.

---

### [K-14] Inline `'KFGQPC', 'Amiri Quran', serif` stringleri — §13.1/§13.2
**Dosya:** `Conclusion.jsx:85/148`, `Navbar.jsx:993/1123`, `ProphetAtlas.jsx:3140`, `KissaAtlas.jsx:746`, `DuaVerses.jsx:119`, `WordHeatmap.jsx:510/613/715`, `QuranCommands.jsx:483`, `VerseGraph.jsx:773/1457/1604/2369/2818/2960/3079`, `ReadingMode.jsx:729/1923/2007/2147`
**Sorun:** 20+ yerde ham font stack yazılmış. `FONTS.quran` değil.
**Öneri:** Tümünü `FONTS.quran`'a geçir. Yalnızca `ReadingMode.jsx`'te çoklu-font zinciri (`'ShaykhHamdullah', 'KFGQPC', ...`) geçerli — onun için `FONTS.quranReading` adında ikinci bir token ekle.

---

### [K-15] VerseGraph'ta tırnaksız Playfair string
**Dosya:** `src/components/VerseGraph.jsx:1015`
```js
fontFamily: 'Playfair Display, serif'
```
**Sorun:** Hem `FONTS.display` kullanılmamış hem de font adı tırnaksız. `Playfair Display` boşluklu bir font adı olduğu için tırnak şart; bazı tarayıcılarda düşer.
**Öneri:** `fontFamily: FONTS.display`.

---

### [O-16] `'Playfair Display', serif` ham fontFamily
**Dosya:** `QuranCommands.jsx:202`, `HumanDefinition.jsx:402`, `ConceptGraph.jsx` (muhtemel), ProphetAtlas.jsx...
**Sorun:** `FONTS.display` token yerine elle yazılmış.
**Öneri:** Tümünde `FONTS.display`.

---

### [O-17] `'Inter', sans-serif` ham fontFamily (~15 dosya)
**Dosya:** `Conclusion.jsx:94/119/138`, `QuranCommands.jsx:173`, `HumanDefinition.jsx:410`, `CennetCehennem.jsx:109/173`, `SurahComparator.jsx:110`, `ProphetAtlas.jsx:3101/3108`, `ReadingMode.jsx` (muhtemel)
**Öneri:** `FONTS.body`.

---

### [O-18] §11 ihlali: Intro paragraph `max-w-2xl`
**Dosya:**
- `HumanDefinition.jsx:422/538/794/913` — her section intro'sunda `max-w-2xl`
- `ImpossibleRhythm.jsx:557/603/868`
- `LinguisticDNA.jsx:604` — `max-w-2xl mx-auto` + `mx-auto` ile merkezlenmiş akan paragraf
- `HiddenSymmetry.jsx:74`, `HiddenArchitecture.jsx:254` — div container'lar

**CLAUDE.md §11 kuralı:** "Section intro paragraph" → `max-w-3xl`, `text-left`, `mx-auto` YOK. Mevcut kullanımlar tam da bunu kırıyor.
**Öneri:** Hepsini `max-w-3xl` yap ve `mx-auto`'yu kaldır. `text-center` kullanılıyorsa özel bir vurgu için olmalı.

---

### [O-19] Section heading `max-w-4xl` yerine `max-w-3xl` kullanılıyor
**Dosya:** `Conclusion.jsx:52` — soru metni `max-w-4xl` (§11'e uygun)
**Sorun:** Başlıklar için `max-w-4xl` §11'e göre doğru ama birçok section başlığı hiç max-width almıyor (varsayılan `max-w-6xl` SectionWrapper'dan gelir). Tutarsız.

---

### [M-20] `color: '#fff'` ham beyaz
**Dosya:** `QuranCommands.jsx:187`, `KissaAtlas.jsx:750` (`rgba(255,255,255,0.55)`)
**Sorun:** `COLORS.offWhite (#e8e6e3)` var ama kullanılmıyor. Pure white palet dışı.

---

## SPACING / PADDING SORUNLARI

### [O-21] Header padding'i kuralı: §13.3'e göre `16px 24px` — ihlaller var
**Dosya:** `OVERLAY_HEADER` token'ı `padding: '12px 20px'` kullanıyor — CLAUDE.md §13.3 örneğiyle (`padding: '16px 24px'`) çelişiyor.
**Sorun:** tokens.js ile doc arasında fark var. Hangisi canonical?
**Öneri:** `OVERLAY_HEADER` tokenını CLAUDE.md ile eşitle (16/24), veya CLAUDE.md'yi güncelle.

---

### [O-22] Mobilde content padding tutarsız
**Dosya:** §14.6 "`isMobile ? '16px' : '24px 32px'`" ama:
- `QuranCommands.jsx:196` — `isMobile ? '56px 16px 20px' : '40px 32px 28px'`
- `AddresseeSystem.jsx` — farklı
- `KuranRenkleri.jsx` — farklı

**Öneri:** Tek composite tokenla ("CONTENT_PADDING_MOBILE", "CONTENT_PADDING_DESKTOP") standartlaştır.

---

### [M-23] Gap değerleri 8/12/16/20/24/32 dışına taşıyor
**Dosya:** Genel — `gap: '3px', '5px', '6px', '7px', '9px', '11px'` kullanımları var (ör. `SurahComparator.jsx`, `WordHeatmap.jsx`). Ritim dışı.

---

## BORDER / RADIUS SORUNLARI

### [K-24] 14 farklı `borderRadius` değeri — design system ritmi yok
**Ölçüm:** 577 inline borderRadius kullanımından kullanılan değerler:
```
146  '8px'
140  '10px'
 61  '12px'
 55  '20px'
 44  '6px'
 26  '99px'
 23  '4px'
 18  '14px'
 15  '3px'
 15  '2px'
  9  '999px'
  8  '16px'
  3  '7px'
  3  '5px'
  3  '24px'
```
**Sorun:** §11 kuralı: "kart 8-10px, overlay 12-14px". `'20px'` (55 kez) ve `'16px'` (8 kez) tanımsız; `'2px'`, `'3px'`, `'4px'`, `'5px'`, `'6px'`, `'7px'` küçük değerler rastgele seçilmiş. `'99px'` ve `'999px'` ikisi de "pill" için kullanılıyor → tek değer olmalı.
**Öneri:** tokens.js'e `RADIUS = { xs: 4, sm: 6, md: 8, lg: 12, xl: 14, pill: 999 }` skalası ekle ve zorunlu kıl.

---

### [K-25] Close button §13.11 kural dışı tekrar
**Dosya:** `QuranCommands.jsx:176-193` — 36×36 dairesel buton manuel yazılmış, `CLOSE_BTN` token'ı kullanılmamış:
```js
background: 'rgba(255,255,255,0.08)',   // CLOSE_BTN.background = 'rgba(255,255,255,0.06)'
border: '1px solid rgba(255,255,255,0.15)',   // CLOSE_BTN.border = 'rgba(255,255,255,0.1)'
```
Stil karakter karakter farklı.
**Dosya:** `HumanDefinition.jsx:407` — ✕ TEXT butonu kullanılmış, §13.11 "her zaman SVG icon" kuralına aykırı.
**Öneri:** Hepsinde `{...CLOSE_BTN}` + SVG icon.

---

### [O-26] Border tutarsızlığı: `'1px solid rgba(212,165,116,...)'` ≈ 100+ kez inline
**Sorun:** Kullanılan alfalar: 0.06, 0.07, 0.08, 0.10, 0.12, 0.15, 0.20, 0.22, 0.25, 0.28, 0.30, 0.35, 0.45, 0.5, 0.55, 0.7 — 15+ farklı alpha. `goldAlpha15/20/25/45` dışında hiçbiri tokenize değil.

---

### [O-27] VERSE_DISPLAY_CARD token'ı neredeyse kullanılmıyor
**Dosya:** tokens.js'te tanımlı, ama yalnız `KuranYeminleri.jsx` kullanıyor. Onun dışında 25+ ayet kutusu var ve hepsi kendi stilini tutuyor.
**Öneri:** QuranVerse, ReadingMode verse row, KissaAtlas verse peek, ProphetAtlas verse tooltip hepsinde VERSE_DISPLAY_CARD spread'i.

---

## COMPONENT DENGESİ

### [K-28] Overlay `zIndex` tutarsızlığı
**Dosya:** `QuranCommands.jsx:109/170` — `zIndex: 200` (OVERLAY_BASE `9999` olmalı, §13.3)
**Dosya:** `HumanDefinition.jsx:388` — `zIndex: 200` modal için
**Dosya:** `SurahComparator.jsx:266` — `zIndex: 200` dropdown
**Dosya:** `ProphetAtlas.jsx:3126` — `zIndex: 200` tooltip

Bu overlay'ler `OVERLAY_BASE` kullansaydı `zIndex: 9999` olurdu. Overlay + tooltip katmanlaşma sırası tanımsız. Tooltip bir overlay üzerinden açıldığında (ör. ProphetAtlas tooltip'i full-screen açılan KissaAtlas altına düşer) gizlenir.
**Öneri:** `Z_INDEX = { overlayBase: 9999, overlayPopup: 10000, overlayTooltip: 10001, nav: 10002 }` skalası.

---

### [O-29] Breakpoint tutarsızlığı: 640 vs 768
**Dosya:** 10+ dosya `window.innerWidth < 640`, 10+ dosya `< 768` kullanıyor
```
640 → AddresseeSystem, DogaAtlasi, KavimlerAtlasi, KiraatAtlasi, KiyametSahneleri,
      MunasebatAtlasi, PathBreadcrumb, SebebiNuzul, SurahComparator
768 → CennetCehennem, FurukAtlasi, KuranYeminleri, Melekler, ToolsBrowser,
      ZamanBoyutlari
```
CLAUDE.md §14.1 açıkça `< 640`. 768 kullanımları ihlal.
**Öneri:** Tümünü 640'a çek. Tablet için ayrı breakpoint istenirse `useBreakpoint()` hook'u aç.

---

### [O-30] Sabit sidebar genişlikleri
**Dosya:** `QuranCommands.jsx:289` (220px), `CennetCehennem.jsx:68` (220px), `KavimlerAtlasi.jsx:61` (220px), `Melekler.jsx:785` (280px), `ConceptGraph.jsx:411` (260px), `ReadingMode.jsx:1841/2201/2371` (220/260/220)
**Sorun:** §14.2 sabit sidebar yasağı. Çoğu `display: isMobile ? 'none'` ile gizliyor (iyi), ama `ConceptGraph` (260px) ve `Melekler` (280px) kontrol etmiyor — mobilde taşar.

---

### [M-31] "Info" butonu 3 farklı stilde
**Dosya:** `HumanDefinition.jsx:377` — `ⓘ` unicode
**Dosya:** `ZeroRedundancy.jsx:31` — `ℹ` unicode (daire değil)
**Dosya:** `KuranRenkleri.jsx:49` — `ℹ` unicode dairede
**Öneri:** Tek SVG info icon komponenti (ör. `InfoIcon`) + `INFO_BTN` tokenı.

---

## HOVER / FOCUS / ANİMASYON

### [O-32] `focus-visible` yalnız global CSS'te — komponentlerde override yok
**Dosya:** `index.css:253` — tek kural `outline: 2px solid var(--color-gold)`
**Sorun:** Komponentlerin tümünde `cursor: 'pointer'` butonlar var ama klavye kullanıcısı için spesifik focus stili yok. Dropdown kartlarda outline kartın içinde kalıyor — görünmüyor.
**Öneri:** Dropdown, kart-buton, tab, chip için `:focus-visible` kuralları ekle veya `outline-offset` özelleştir.

---

### [O-33] Framer Motion `useReducedMotion` hiç kullanılmıyor
**Dosya:** 0 match
**Sorun:** CLAUDE.md §9 "Reduced motion media query". CSS'te global kural var (iyi) ama JavaScript animasyonları (ör. `AnimatedCounter`'daki `requestAnimationFrame`, `BesmeleWidget`'teki 4 aşamalı timer, `VerseGraph`'taki 3B animasyon) CSS kuralını atlıyor. `prefers-reduced-motion` kullanıcıları için JS animasyonları kapalı değil.
**Öneri:** `useReducedMotion()` hook'unu entegre et.

---

### [O-34] Transition süresi tutarsızlığı
**Örnek:** `0.15s`, `0.2s`, `0.25s`, `0.3s`, `0.4s`, `0.5s`, `0.7s` — farklı dosyalarda aynı tür etkileşim için farklı süre.
**Öneri:** `TRANSITION = { fast: '0.15s', base: '0.2s', slow: '0.3s' }` tokenı.

---

### [M-35] Hover pattern tutarsızlığı
**Örnek:** Bazı kartlar `whileHover={{ scale: 1.04 }}`, bazıları `1.05`, bazıları `1.02`, bazıları hiç hover yok. Aynı kart türünde (ör. PathCard) hover davranışı beklenir — yoksa "tıklanabilir mi?" sorusunu doğurur.

---

## RESPONSIVE / MOBİL

### [K-36] KuranYeminleri, ToolsBrowser, FurukAtlasi, CennetCehennem, Melekler breakpoint hatası
**Dosya:** Yukarıdaki dosyalar `< 768` kullanıyor. Mobil telefon (iPhone 390px–428px) için değil, tablet (768+) için mobil sayıyor. §14.1 ihlali.

---

### [O-37] `ConceptGraph.jsx` ve `VerseGraph.jsx` mobil desteği yok
**Dosya:** `isMobile` state hiç yok. §14.1 pattern'i uygulanmamış. Full-screen 3D/graph render mobilde ciddi problem yaratır.
**Öneri:** `VerseGraph` zaten ağır (WebGL) — mobil için `isMobile` tespit et ve basitleştirilmiş 2D fallback sun.

---

### [M-38] `width: '260px'` dropdown maxWidth'li (doğru) ama popup'lar sabit
**Dosya:** `ProphetAtlas.jsx:3120/3126` — tooltip 260px sabit, `left` hesabıyla viewport sınırı korunuyor. Mobilde 320px viewport'ta 280+ bir şey sığmaz. Max-width kontrolü minimal.

---

## GLASSMORPHISM TUTARSIZLIĞI

### [K-39] `backdropFilter: blur(Xpx)` 5 farklı değer
**Ölçüm:** `blur(4px)`, `blur(12px)`, `blur(16px)`, `blur(20px)`, `blur(24px)` karışık.
- `GLASS_CARD` tokenı `blur(20px)` — standart
- `HumanDefinition.jsx:389` modal overlay `blur(4px)` — çok zayıf
- `SurahComparator.jsx:264` dropdown `blur(24px)` — standart dışı
- `WordHeatmap.jsx:377` chip `blur(12px)` — kendine özgü

**Öneri:** Tek `blur(20px)` veya skalalı (`blur.sm: 8`, `blur.md: 20`, `blur.lg: 24`).

---

### [O-40] Glass-card class vs inline GLASS_CARD kullanımı karışık
**Dosya:** Bazı kartlar `className="glass-card"` (Tailwind), bazıları `style={GLASS_CARD}` (inline), bazıları her ikisini birden. `glass-card` CSS'te `rgba(255,255,255,0.04)`, ama `GLASS_CARD` token'ı `COLORS.glassBg = 'rgba(255,255,255,0.05)'` — %20 fark. İkisi de aynı yerde kullanılınca belirsiz tonlama.
**Öneri:** Tek kaynak — ya CSS'ten, ya tokens.js'ten. Tek seçim yap.

---

### [M-41] `backdrop-filter` için `-webkit-` prefix bazen var bazen yok
**Dosya:** `index.css`'te var. `ProphetAtlas.jsx:3128-3129` inline `WebkitBackdropFilter` ekliyor. Çoğu inline kullanımda yok — Safari'de bozulur.
**Öneri:** Inline backdropFilter kullanılıyorsa `WebkitBackdropFilter` şart.

---

## ARAPÇA / RTL ÖZEL SORUNLAR

### [K-42] §13.15 KRİTİK ihlali: `ٱ` (Alef wasla U+0671) kullanımı
**Dosya:**
- `src/sections/HiddenArchitecture.jsx:25-33, 59-68, ve devamı` — Fatiha, Âyetel Kürsî, Meryem 4-6 sureleri tam Uthmani encoding ile yazılmış. `بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ` — ٱ harfleri KFGQPC fontunda ص olarak render ediyor.
- `src/sections/ProphetAtlas.jsx:574/637/745/778/812...` — peygamber duaları tam Uthmani: `ظَلَمۡنَآ`, `مَغۡلُوبٞ`, `تَقَبَّلۡ`, `ٱلۡعَلِيمُ` — her biri U+06E1 (sukun) + U+0671 + U+0652 kombinasyonu.
- `src/components/KiraatAtlasi.jsx:531/545` — `بِسۡمِ ٱللَّهِ` (sukun + alef wasla birlikte)

**Sorun:** §13.15 açıkça yasaklıyor: "U+0671 → U+0627 ile değiştir" ve "U+06E1 → U+0652 ile değiştir". Bu dosyalardaki JSX string literal'lerinin manuel normalize edilmesi gerekiyor.
**Öneri:** `cleanArabic()` fonksiyonu bu dosyalara uygulanmıyor çünkü veriler JSX inline; bir script ile dosya üzerinde sed/regex ile standartlaştır.

---

### [O-43] `cleanArabic()` tanımları dosyalar arası farklı
**Dosya:** `VerseGraph.jsx:49` `[أإآٱ]/g → 'ا'` çevirisi var. `ReadingMode.jsx` ve `ProphetAtlas.jsx:35-49` daha kapsamlı (10+ kural). `WordHeatmap.jsx:39` minimum. §13.14 maddah fix bazılarında var (`ReadingMode`) bazılarında yok (`VerseGraph`).
**Öneri:** `src/utils/cleanArabic.js` tek ortak modül; her dosya oradan import etsin.

---

### [O-44] `dir="rtl" lang="ar"` eksik yerler
**Dosya:** 28 dosyada `dir="rtl"` veya `lang="ar"` bulundu — 133 toplam kullanım. Ancak:
- `SurahComparator.jsx:212/313/832/879` — Arapça sure ismi gösteriyor ama `dir="rtl"` + `lang="ar"` eksik (yalnız `direction: 'rtl'` style)
- `ConceptGraph.jsx:473` — `direction: 'rtl'` ama `lang` yok
- `HumanDefinition.jsx:12/33/52/71/98/101...` — Arapça kelimeler var ama hiç `<span lang="ar" dir="rtl">` sarması yok

**Öneri:** Her inline Arapça metin `<span dir="rtl" lang="ar">`. Ekran okuyucular Arap fonetiği için dil etiketine ihtiyaç duyuyor.

---

### [M-45] `ShaykhHamdullah` yalnız ReadingMode'da — §13.15 izin veriyor
**Dosya:** `ReadingMode.jsx:729` — `currentFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif"` (ReadingMode özel)
**InterlinearView.jsx** — sadece `'Amiri'` kullanıyor, ayet numara rozetleri için. §13.2 KFGQPC şart: ayet numaraları Kur'ânî karakterdir.
**Öneri:** InterlinearView'de Arapça rakamlar için `FONTS.quran` — veya yeni `FONTS.arabicNumerals` tokenı.

---

## GENEL DEĞERLENDİRME

**Güçlü yönler:**
- tokens.js iyi tasarlanmış (CLOSE_BTN, OVERLAY_BASE, GLASS_CARD, OVERLAY_TITLE hazır). 41/66 dosya import ediyor.
- Hero, SectionWrapper, QuranVerse, ScientificSigns, MathMiracle token-first yaklaşımı uyguluyor — örnek dosyalar.
- CLAUDE.md çok detaylı — §13 ve §14 neredeyse bir style guide.

**Kritik sistem sorunları:**
1. **index.css ↔ tokens.js paletleri senkronize değil** ([K-1]). Tek kaynak prensibi kırılmış. Tasarım sistemi gerçekten iki başlı.
2. **Kur'ânî metinlerde `'Amiri'` kullanımı** ([K-13]) + **20+ yerde ham KFGQPC stringi** ([K-14]). §13.2 MUTLAK kuralı çiğnenmiş.
3. **ProphetAtlas (3.000 satır) tokens.js'yi hiç import etmiyor** ([K-3]).
4. **Uthmani encoding sızıntıları** ([K-42]) — HiddenArchitecture, ProphetAtlas, KiraatAtlasi'nde KFGQPC render bozulması.
5. **Close button / Overlay pattern tutarsızlığı** (QuranCommands `CLOSE_BTN` yok + `zIndex: 200`, HumanDefinition `✕` text kullanıyor).
6. **borderRadius 14 farklı değer** — design system ritmi yok.
7. **Breakpoint 640 ↔ 768 karışıklığı** — mobil deneyim tablet ile karıştırılmış.
8. **PsychologySection bağımsız palet** — 10 yeni renk tokens.js dışında.

**İstatistik:**
- Token kullanan / kullanmayan oranı: **%62 / %38** — sağlıklı orandan daha düşük
- Ham `rgba(...)` kullanımı: dosya başına **ortalama 28** — bu sayı `5`'in altında olmalı
- Renk palet "drift" skoru: **10+** palet dışı özel hex (dosya başına). Bu görsel tonlama tutarsızlığı ile direkt ilişkili.

**Tavsiye edilen 5 öncelikli iş:**
1. `index.css` paletini `tokens.js` ile senkronla (ya da `tokens.js`'i `--color-*` CSS değişkenlerinden türet). (K-1)
2. `ProphetAtlas`, `HumanDefinition`, `PsychologySection`, `VerseGraph`, `QuranCommands`, `Navbar`'da token import + migrate. (K-3/K-4/O-5/O-6)
3. Tüm Kur'ânî metin fontlarını `FONTS.quran`'a çek; `FONTS.arabic` sadece UI. (K-13/K-14/K-15)
4. Uthmani encoding sızıntıları — `HiddenArchitecture.jsx` + `ProphetAtlas.jsx` + `KiraatAtlasi.jsx` scriptle normalize et. (K-42)
5. `RADIUS`, `BLUR`, `Z_INDEX`, `TRANSITION` tokenları ekle. (K-24/K-28/K-39/O-34)

Site bütünü estetik olarak tutarlı görünüyor olabilir çünkü altın+koyu lacivert tema dominant; ama detayda çok sayıda ton ve tip kaymış. Her aracı tek başına açtığımızda birbirine benziyor, ama yan yana (ör. ConceptGraph → KuranYeminleri geçişi) altın tonlarının değiştiği, kartların farklı radius'larda kırıldığı, yazı tiplerinin kaydığı fark edilir.
