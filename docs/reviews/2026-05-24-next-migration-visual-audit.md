# QuranCodex Next.js Migration — Görsel/Tasarım Denetimi (2026-05-24)

Denetçi: qc-visual-auditor
Scope: `next/src/` — homepage + 7 sample route (`/oku/2`, `/atlas/kissa`, `/atlas/peygamber`, `/graf/ayet`, `/arac/wow`, `/arac/dualar`) + Footer
Yöntem: kod tabanı statik incelemesi (token kullanımı, layout patternları, mobile-pattern denetimi, glassmorphism tutarlılığı, gradient/section ritmi)

---

## Özet

Tasarım sistemi **tokenlar açısından çok güçlü**: `src/tokens.js` mükemmel düzeyde tanımlı, sayısız `softGoldAlphaXX`, `paperX`, `arabicQuiet/Bright` gibi anlamsal renkler taşıyor; `RADIUS`, `TRANSITION`, `BLUR`, `Z_INDEX`, `BREAKPOINT_MOBILE/TABLET` scaleleri çoktan kurulu. Ne yazık ki bu disiplin **kullanıma yansımıyor**: section ve component'ler tokenı bypass eden 350+ ham hex, 1.300+ ham `rgba()`, 120+ inline `transition: 'all 0.Xs'` string ve 19 yerde inline `'KFGQPC', 'Amiri Quran'` yazımı var. KissaAtlas overlay'i `OVERLAY_BASE`/`OVERLAY_HEADER` token'larını **hiç kullanmıyor**, kendi 60px header'ını re-implement ediyor. CLAUDE.md §4'te söz verilen "section transitions: 200px gradient overlap" için CSS sınıfı (`.gradient-divider`) `globals.css`'te tanımlı ama **hiçbir yerde çağrılmıyor** — homepage'de Hero→PathCards→AllTopics→…→Conclusion arasında 19 ardışık section sert kesimle bağlanıyor; bazı yerlerde iki ardışık `dark`/`light` yan yana geliyor ve sınır okunamıyor. Tool overlay'leri (KissaAtlas, DuaVerses, WowFacts) farklı header yükseklikleri (54px/60px/64px) ve farklı `padding` ritmiyle çalışıyor — kullanıcı tool'lar arasında geçince "ufak bir sarsılma" hissi alır. Buna karşılık Navbar, Hero, PathCards, AllTopics, ToolsHighlight, Footer dörtlüsü tipografi hiyerarşisi (badge/H2/subtitle clamp) açısından gerçekten zarif: aynı `clamp(1.8rem, 4vw, 2.75rem)` H2, aynı `offWhiteAlpha78` body imzası, aynı `0.3em letter-spacing` etiket — bu konuda gerçekten tutarlı.

---

## Kritik (Hemen düzeltilmeli)

### [K1] KissaAtlas — OVERLAY_BASE/OVERLAY_HEADER token'larını bypass ediyor
**Dosya:** `next/src/components/KissaAtlas.jsx:179-200`
**Sorun:** Tüm tool overlay'ler `OVERLAY_BASE` (inset 54px / zIndex 50 / overlayBg) ve `OVERLAY_HEADER` (height 54px / padding 12px 20px / rgba(8,9,26,0.95) / blur(20px) / glassBorderSoft) tokenlarını kullanmalı (§13.10). KissaAtlas bunun yerine kendi `position: 'fixed', inset: '54px 0 0 0', background: '#06080e', padding: '0 20px', height: '60px', background: 'rgba(6,8,14,0.96)', backdropFilter: 'blur(16px)'` blokunu inline yazıyor. Sonuç: header **60px** (tokenlu overlay'ler 54px), background **#06080e** (token `#0a0a1a`), blur **16px** (token `blur(20px)` = `BLUR.md`), border `rgba(255,255,255,0.07)` (token `glassBorderSoft` = `0.06`). Görsel olarak: KissaAtlas'a girince Navbar'ın hemen altında 6px'lik içerik kayması olur, header rengi DuaVerses/WowFacts'tan biraz daha koyu görünür.
**Öneri:** `style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}` + `style={OVERLAY_HEADER}` kullan; sadece mobile-tab row için ek wrap içine al. ProphetAtlas'tan model alabilirsin (`CLOSE_BTN` zaten doğru kullanmış).

### [K2] Tool overlay header yükseklikleri tutarsız (54 / 60 / 64 / 60)
**Dosyalar:**
- `WowFacts.jsx:788` — `height: '54px'` ✓ (token uyumlu)
- `DuaVerses.jsx:391` — `height: '54px'` ✓
- `KissaAtlas.jsx:198` — `height: isMobile ? 'auto' : '60px'` ✗
- `VerseGraph.jsx:1010-1015` — header `position: absolute` + içerik padding 10px 18px, hesap edilebilir yükseklik **yok**, alt content `<input>` doğrudan SVG canvas üstüne biniyor
- `ReadingMode.jsx:2228` — `height: isMobile ? 'auto' : '64px'` (ReadingMode kendi tam ekranı olduğu için makul ama 64px'lik fark yine de hissedilir)

**Sorun:** Aynı navigation paradigması (overlay-tool route) ama 4 farklı header yüksekliği. Kullanıcı `/atlas/kissa`'dan `/arac/dualar`'a geçtiğinde içerik 6px aşağı zıplar.
**Öneri:** Tüm tool overlay header'larını **54px**'e sabitle. VerseGraph'in absolute header'ını DuaVerses tipi flex-shrink:0 normal header'a dönüştür (canvas üzerine binmeyecek, lock-state çakışmasını çözer).

### [K3] Section'lar arası geçiş "200px gradient overlap" eksik
**Dosya:** `next/src/app/globals.css:209-242` (CSS tanımlı, çağrılmıyor)
**Sorun:** CLAUDE.md §4 "Section Transitions: 200px gradient overlap between sections" net. `globals.css:209` `.gradient-divider` (96px → mobile 64px, gold mid-line ile cosmic→navy fade) ve `.gradient-divider-reverse` mevcut ama `next/src/` taramasında **hiçbir** `<div className="gradient-divider">` yok. Ana sayfada `<Hero/><PathCards/>…<Conclusion/>` 19 section sert renk kesimiyle dizilmiş. Üstelik dark/light ritmi de bozuk:
- ToolsHighlight (light) → LinguisticDNA (light) — **iki ardışık light**
- SoundArchitecture (light) → PsychologySection (light) — **iki ardışık light**
- HiddenArchitecture (dark) → ScientificSigns (dark) — **iki ardışık dark** (aynı renk: göz "bu nereden başladı" diye soruyor)
- Highlights (dark) → HumanDefinition (dark) — **iki ardışık dark**

**Öneri:**
1. `app/[locale]/page.js` içinde her section arasına `{<div className="gradient-divider" />}` veya `<div className="gradient-divider-reverse" />` ekle (önceki dark→sonraki light veya tersi).
2. Ardışık aynı-renk section'lar için (örn. ScientificSigns→HiddenArchitecture) `gradient-divider`'a yerine "soft mid-line only" mini-divider varyantı (16-24px yükseklikte sadece gold çizgi) tanımla.

### [K4] Conclusion CTA "Kur'an'ı Oku" inline gradient — `.btn-primary-gold` class'ı bypass ediliyor
**Dosya:** `next/src/sections/Conclusion.jsx:178-200`
**Sorun:** Hero'da `className="btn-primary-gold"` doğru kullanılırken, Conclusion CTA aynı görsel için inline `background: 'linear-gradient(135deg, #c9973a 0%, #b8860b 60%, #9a6f0a 100%)'`, `color: '#1c0f00'`, `boxShadow: '0 0 20px 4px rgba(180,130,40,0.3)'` yazıyor. Aynı problem `Navbar.jsx:1251` (mobile menu Oku) ve `Navbar.jsx:1097-1126` (desktop outline Oku — bu doğrudan farklı bir stil, secondary outline, ama hiçbir token taşımıyor).
**Öneri:** Conclusion ve mobile menu Oku → `className="btn-primary-gold"`. Navbar desktop outline Oku için `.btn-ghost-dark` mevcut (`globals.css:175`); onu da kullan. Hover state'leri framer `whileHover`'a bırakıp CSS-class baz'a indir.

### [K5] Inline `'KFGQPC', 'Amiri Quran', serif` 19 yerde — `FONTS.quran` token bypass'ı
**Dosyalar (sample):**
- `QuranDua.jsx:246, 300, 361, 404, 420, 560, 736, 847` (8 yer)
- `QuranRhetoric.jsx:592`
- `HiddenArchitecture.jsx:330`
- `Footer.jsx:215` (burada `fontFamily: FONTS.quran` zaten kullanılıyor — Footer doğru pattern'in örneği)

**Sorun:** §13.2 mutlak kural: Kur'an metni için **tek geçerli yazım** `fontFamily: FONTS.quran`. İnline string ile yazıldığında ilerideki bir font-değişikliği için 19 yer ayrı ayrı edit edilmek zorunda kalır. Üstelik bir kısmı `'serif'` fallback'i atlıyor.
**Öneri:** Codemod: `"'KFGQPC', 'Amiri Quran', serif"` → `FONTS.quran` (import varsa). Ayrıca `SurahComparator.jsx:214, 315, 834, 881` inline `'Amiri', serif` → `FONTS.arabic` (Kur'an dışı Arapça UI, §13.2'ye göre kabul edilir).

---

## Önemli (Yakın vadede)

### [O1] Ham renk değerleri masif — 350+ hex, 1.300+ rgba
**Dosyalar:**
- `QuranRhetoric.jsx:34-67` — `color: '#d4a574'` (= COLORS.gold), `'#3498db'` (= skyBlue), `'#2ecc71'` (= softEmerald), `'#a78bfa'` (= purple) — chip kategori renkleri inline tanımlı; token sürümleri zaten var
- `QuranDua.jsx:247, 301, 355, 394` — aynı problem
- `Navbar.jsx:738, 743, 763, 815, 818, 826` — dropdown hover renkleri `'#d4a574'`, `'#d4d8e0'`, `'rgba(212,165,116,0.45)'` inline yazılmış (COLORS.gold, COLORS.silver/COLORS.slate200, COLORS.goldAlpha45 tokenları var)
- `KissaAtlas.jsx` — `'rgba(255,255,255,0.07)'`, `'rgba(255,255,255,0.08)'`, `'rgba(255,255,255,0.15)'` (COLORS.glassBorderSoft, COLORS.glassBorder mevcut)

**Sorun:** Tasarım sistemi kurulu ama disiplin yarısında bozuluyor. Renk paletini bir gün değiştirmek (örn. gold tonunu warmer'a kaydırmak) sayısız find-replace istiyor.
**Öneri:** Codemod priority list (en sık geçen 5 değer):
- `'#d4a574'` → `COLORS.gold` (~80 yer)
- `'#94a3b8'` → `COLORS.silver` (~60 yer)
- `'#e8e6e3'` → `COLORS.offWhite` (~45 yer)
- `'rgba(212,165,116,0.15)'` → `COLORS.goldAlpha15`
- `'rgba(255,255,255,0.05/0.06/0.08/0.1)'` → `COLORS.glassBg/glassBorderSoft/glassBgStrong/glassBorder`

### [O2] 123 yerde inline `transition: 'all 0.Xs'` — TRANSITION token bypass
**Dosyalar:** `QuranRhetoric.jsx:147, 391, 405, 444, 750`, `HiddenArchitecture.jsx:263, 309, 319, 400`, `ZeroRedundancy.jsx:29`, etc.
**Sorun:** `0.15s`, `0.18s`, `0.2s`, `0.25s`, `0.3s`, `0.35s cubic-bezier(.4,0,.2,1)` — 6 farklı varyasyon, hiçbiri `TRANSITION.fast/base/slow` (0.15/0.2/0.3) tokenını kullanmıyor. Aynı tool overlay içinde header `0.18s`, chip `0.25s`, kart `0.3s` çekilirse kullanıcı animasyon ritmini tutarsız hisseder.
**Öneri:** Token üçlüsünde kal — `transition: \`all \${TRANSITION.fast}\`` veya CSS class'ı (transitions için Tailwind `transition-colors duration-150` da kabul). Custom easing gerektiren özel durumlar için `TRANSITION` token'ına `slowEase` ekle.

### [O3] borderRadius scale dışı değerler — 16px, 18px, 20px sık geçiyor
**Dosyalar:**
- `Conclusion.jsx:93` — verse box `borderRadius: '16px'` (RADIUS scale: xl=14, pillSm=20 — 16 yok)
- `PsychologySection.jsx:514`, `ScientificSigns.jsx:255`, `HumanDefinition.jsx:427`, `ProphetMap.jsx:237` — `'16px'`
- `ProphetAtlas.jsx:2906` — `'18px'` (ne sm ne md ne chip ne lg ne xl)
- `HiddenArchitecture.jsx:255`, `QuranRhetoric.jsx:441`, `ScientificSigns.jsx:272` — `'20px'` (RADIUS.pillSm doğru ama token'dan çağrılmamış)
- `ImpossibleRhythm.jsx:833, 837` — `'3px'` (xs=4'ten küçük; ya küçük yuvarlağa ya pip'e dönüştür)

**Sorun:** 16 ve 18 RADIUS scale'inde yer almıyor — geliştirici keyfine göre seçilmiş.
**Öneri:** 16 → `RADIUS.xl` (14)'a düşür veya `RADIUS.pillSm` (20)'ye yükselt. 18 → 14 veya 20. 3 → 4 (`RADIUS.xs`).

### [O4] Glassmorphism inline ve CSS-class iki ayrı kanal
**Dosyalar:**
- `Footer.jsx:130, 161` — `className="glass-card"` (CSS-class doğru)
- `PathCard.jsx:53` — `style={{...GLASS_CARD, border: undefined, borderWidth: '1px', borderStyle: 'solid', borderColor: COLORS.glassBorder}}` (animation gerekçesiyle longhand) — kabul edilebilir
- `Conclusion.jsx:90-97` — `borderRadius: '16px', border: '2px solid rgba(212,165,116,0.3)'` — **ne `glass-card` ne `GLASS_CARD`, hatta border 2px (token border 1px)** — verse box'lar için ad-hoc bir glass varyantı.
- `DuaVerses.jsx`, `WowFacts.jsx`, `KissaAtlas.jsx` — hepsi farklı `'rgba(8,10,18,0.95)' / 'rgba(8,10,18,0.96)' / 'rgba(8,9,26,0.95)'` backdrop kombinasyonları kullanıyor. Aynı tema, üç farklı renk.

**Sorun:** §13.7: "Her bileşen kendi `backdrop-filter + rgba` kombinasyonunu uydurmaz." Pratikte uydurulmuş.
**Öneri:** Tüm overlay header'lar için **tek** stil değişkeni: `OVERLAY_HEADER.background` zaten `rgba(8,9,26,0.95)` — diğer 2 yer bunu kullansın.

### [O5] Dropdown mega-menu hover renkleri Navbar.jsx içine gömülü
**Dosya:** `next/src/components/Navbar.jsx:815-816, 895-896, 999-1000`
**Sorun:** 3 ayrı dropdown (Explore, Tools, mobile) için aynı pattern (`e.currentTarget.querySelector('.si').style.color = '#d4a574'; …`) inline duplicate. Hover background `'rgba(212,165,116,0.07)'`, `'rgba(212,165,116,0.10)'` ve `'rgba(212,165,116,0.18)'` arasında değişiyor — hangisi neye karşılık geliyor belli değil.
**Öneri:** `dropdownItemHover` helper yarat; tek bir `goldAlpha07` token ekle. Veya CSS module (`.dropdown-item:hover` ile) tek bir kaynak haline getir.

### [O6] DuaVerses ve WowFacts mobile pattern yok (CLAUDE.md §14 ihlali)
**Dosyalar:**
- `WowFacts.jsx:780-820` — header `padding: '0 20px'` sabit, search input genişliği `maxWidth: '480px'` sabit, kategori chip row scroll'lu ama hiç `isMobile` kontrolü yok
- `DuaVerses.jsx:382-487` — aynı problem. Grid `minmax(min(100%, 520px), 1fr)` — mobilde 390px'de tek sütuna düşer ama gap/padding aynı.
- `WowFacts.jsx:937` — kart minmax 340px

**Sorun:** §14.1: "Her yeni bileşen ve route mobil (≥ 390px) ekranda tam kullanılabilir olmalıdır." Pattern: `BREAKPOINT_MOBILE`'a göre `isMobile` state, padding `isMobile ? '16px' : '24px 32px'`, header padding `isMobile ? '10px 16px' : '0 20px'` (§14.6). DuaVerses ve WowFacts bu pattern'i hiç uygulamamış. KissaAtlas iyi uyguluyor — örnek model alınsın.
**Öneri:** İkisine de §14.1 SSR-safe `isMobile` ekle. Body padding `isMobile ? '12px' : '20px'`, kart minmax `isMobile ? 'min(100%, 280px)' : 'min(100%, 340px)'`.

### [O7] Ardışık aynı-renk section'lar (dark/dark, light/light)
**Dosya:** `next/src/app/[locale]/page.js:52-75` (section sırası)
**Sorun:** Section sırası: PathCards(L) → AllTopics(D) → ToolsHighlight(L) → **LinguisticDNA(L)** → ImpossibleRhythm(D) → QuranRhetoric(L) → QuranDua(D) → SoundArchitecture(L) → **PsychologySection(L)** → HiddenArchitecture(D) → **ScientificSigns(D)** → HistoricalProof(L) → LivingPreservation(D) → ZeroRedundancy(L) → Highlights(D) → **HumanDefinition(D)** → ToolsShowcase → Conclusion(L). 4 yerde ardışık aynı renk var; sınır kaybolur.
**Öneri:** İki seçenek:
1. `dark` prop'larını revize et (örn. ScientificSigns → light yap).
2. Aynı-renk ardışıklarda K3'teki `gradient-divider`'ın "mid-line only" varyantını kullan — gerekirse subtle `box-shadow` ile sınır göster.

### [O8] HiddenArchitecture'da `fontFamily: "'Playfair Display', serif"` inline (FONTS.display bypass)
**Dosyalar:** `HiddenArchitecture.jsx:933`, `QuranDua.jsx:532, 601`, `SoundArchitecture.jsx:243, 405, 433, 620, 723, 738, 805, 847, 860, 1045`, `ScientificSigns.jsx:329`, `VerseGraph.jsx:1515, 2281`, `ReadingMode.jsx:5241, 6772, 6783, 6808`
**Sorun:** 16+ yer inline `"'Playfair Display', serif"` (= `FONTS.display`).
**Öneri:** Codemod ile `FONTS.display`'e çevir.

---

## İyileştirme önerileri (Polish)

### [P1] PathCard `minHeight: '215px'` — içerik kısaysa boşluk
**Dosya:** `next/src/components/PathCard.jsx:67`
4 kartın hepsi 215px sabit min-height. Steps sayısı değişken (Insan path 4 step, Peygamberler 3 step). Step pill'leri `marginTop: 'auto'` ile dibe yapışıyor — desktop'ta görsel sorunsuz. Mobilde tek sütun olduğu için minHeight overkill: 4 kart toplam 860px+ scroll alır. Mobile'da `minHeight: isMobile ? 'auto' : '215px'`.

### [P2] AllTopics legend mobilde "vertical stack" iyi ama icon hizalama hâlâ desktop
**Dosya:** `next/src/sections/AllTopics.jsx:106-191`
Legend `isMobile` koşulu ile flex-column'a düşüyor ama her item içindeki icon hala 22px circle. Mobile'da icon 18px'e indirilse hierarchy belli olur.

### [P3] ToolsHighlight "Tüm Araçları Gör" CTA — secondary imzası fade-out ediyor
**Dosya:** `next/src/sections/ToolsHighlight.jsx:233-283`
`boxShadow: \`0 0 16px ${COLORS.goldAlpha04}\`` — `goldAlpha04` çok düşük (alpha 0.04). Buton durağan halde göze çarpmıyor; hover'da `goldAlpha15`'e zıplıyor. Statik alpha'yı `goldAlpha15`'e çıkar, hover'da `goldAlpha25`'e taşı — secondary CTA kimliği daha sezilir olur.

### [P4] Hero alt boşluk — clamp(13px, 1.5vw, 15px) primary CTA padding'i Conclusion butonlarıyla farklı
**Dosya:** `Hero.jsx:118` vs `Conclusion.jsx:163, 184`
Hero CTA padding: `clamp(13px,1.5vw,15px) clamp(32px,6vw,56px)`. Conclusion CTA padding: `14px 36px` sabit. Aynı görsel tip iki farklı boyutta — Conclusion CTA'sı clamp pattern'i kullansın.

### [P5] Footer "Sayfaları Keşfet" — kolonlar dengeli, ancak içerik 5+ link'te break-line yapıyor
**Dosya:** `next/src/components/Footer.jsx:130-158`
4 kolon × 5-6 link. Mobile'da `grid-cols-1` doğru. Tablet `sm:grid-cols-2` doğru. Desktop `lg:grid-cols-4` doğru. Tek küçük detay: link metinleri uzun (örn. "Peygamberler Atlası — 25 nebi, kronoloji") — 4 kolonlu lg ekranda 280px sütun başına = 2 satıra düşüyor. Bu kabul edilebilir; ancak `text-sm` (14px) yerine `text-xs` (12px) düşürülürse 1 satıra sığar. Karar tasarım tonuna göre — okunabilirlik için 14px tut.

### [P6] Mobile menu close button (Navbar.jsx:1209-1232) — `CLOSE_BTN` kullanmıyor
**Dosya:** `next/src/components/Navbar.jsx:1209-1232`
`width: '44px', height: '44px'` (CLOSE_BTN: 36×36), `background: 'rgba(255,255,255,0.08)'`, `border: '1px solid rgba(255,255,255,0.12)'` (token: rgba 0.06/0.10). Mobile menu close, tap-target erişilebilirlik için 44px olabilir — ancak görsel olarak `CLOSE_BTN` ile farklı algoritma. Mobile için yeni token `CLOSE_BTN_LG` tanımla (44×44) veya `CLOSE_BTN`'yi spread edip sadece width/height override et.

### [P7] Section badge etiket boyutu tutarlı ama renk yarım: gold/60 vs gold/70
**Dosyalar:**
- `PathCards.jsx:138` → `opacity: 0.6` (gold/60)
- `AllTopics.jsx:58` → `opacity: 0.6`
- `ToolsHighlight.jsx:156` → `opacity: 0.6`
- `Conclusion.jsx:32-43` → `opacity: 0.6` ✓
- `HumanDefinition.jsx:328` → `className="text-gold/60"` ✓
- `HiddenArchitecture` — kontrol et
- ProphetAtlas.jsx:1609 → `opacity: 0.7` (badge gold/70)
- HumanDefinition.jsx:349 → `text-gold/70` (subtitle olarak)

Badge 0.6, subtitle 0.7 — anlamlı ayrım var. Ama `ProphetAtlas`'ın badge'i 0.7 olarak yazılmış — küçük tutarsızlık.
**Öneri:** Badge token'ı tanımla: `BADGE_LABEL = { color: COLORS.gold, opacity: 0.6, fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }`.

### [P8] ParticleBackground sadece Hero'da — Hero altındaki section'lar saf düz
**Dosya:** `Hero.jsx:24`
ParticleBackground sadece Hero'da. CLAUDE.md §4: "Particle System: Canvas-based star particles in hero **and between sections**". Şu an sadece Hero. Hero altındaki tüm section'lar cosmic-black/deep-navy düz background. Particle'ları Highlights/Conclusion gibi reflection section'larda kullanmak hikâye arkına emotional weight katacak. (Performance: §8 zaten "pauses when not visible" diyor.)

### [P9] Verse box (Conclusion) `boxShadow: '0 0 40px rgba(212,165,116,0.12), 0 0 80px rgba(212,165,116,0.06)'` — token `box-glow-gold` mevcut
**Dosya:** `Conclusion.jsx:95`
`globals.css:196`'da `.box-glow-gold` class tanımlı. Class kullan, inline yazmaktan kurtul. Aynı kural Highlights, ScientificSigns gibi gold-highlight kullanan section'ların verse box'ları için geçerli.

### [P10] HiddenArchitecture mobile sidebar pattern yok (§14.3)
**Dosya:** `next/src/sections/HiddenArchitecture.jsx` (ringInteractive layout)
Bu section ring diagram + verse panel layout'una sahip. `isMobile` koşulu çağrılıyor mu kontrol et — değilse §14.3 sidebar pattern'i uygula (mobilde sidebar gizle, chip row).

---

## İyi yapılmış

### [İ1] Token sistemi mimari olarak çok güçlü
`tokens.js` 318 satır: `softGoldAlphaXX` ailesi 16 alpha varyantıyla, `paperX` ailesi 12 reading-mode rengi, `arabicQuiet/Bright/creamQuiet/Bright/besmele`, `slate200-800` ölçeği, `RADIUS` 9 değer, `Z_INDEX` 4 katmanlı stacking model, `BLUR` 3 değer, `TRANSITION` 3 değer, `BREAKPOINT_MOBILE/TABLET` ikilisi. Bu bir senior-grade tasarım sistemidir.

### [İ2] Hero/PathCards/AllTopics/ToolsHighlight discovery layer tipografi tutarlılığı
Hepsi aynı `clamp(1.8rem, 4vw, 2.75rem)` H2, aynı `lineHeight: 1.15`, aynı `letterSpacing: '-0.01em'`, aynı `maxWidth: '60ch'`, aynı `offWhiteAlpha78` body imzası, aynı `clamp(0.95rem, 1.6vw, 1.0625rem)` subtitle font-size. **Bu rytim çok başarılı**.

### [İ3] OVERLAY_TITLE adoption — 37/56 component
56 component'ten 37'si overlay tokenlarını kullanıyor. Bu yüksek bir adoption rate (%66). KissaAtlas (K1) düzeltilirse %68'e çıkar.

### [İ4] Hero'nun gradient halo + radial glow yapısı (Hero.jsx:30-41)
Üst orta `radial-gradient(rgba(212,165,116,0.06))` + alt orta warm halo (`rgba(212,165,116,0.08)`). Particle + slow-rotating Islamic pattern + iki halo katmanı — derinlik hissi gerçekten cinematic. CLAUDE.md vision'ına sadık.

### [İ5] PathCard hover animasyonu (PathCard.jsx:43-49)
`whileHover` ile `y: -4`, `borderColor: goldAlpha45`, `boxShadow: 0 0 32px goldAlpha15`. Spring `stiffness:320, damping:24` ile yumuşak. Çok kaliteli mikro-etkileşim. `whileTap: scale 0.985` da iyi.

### [İ6] PathContext + completed badge pattern (PathCard.jsx:103-133)
Tamamlandı rozeti `goldAlpha15` background + `goldAlpha45` border + pill radius — diğer chip'lerle aynı dil. `title`/`aria-label` çift accessibility. Doğru iş.

### [İ7] Footer "Sayfaları Keşfet" — internal-link nav görsel uyum
`glass-card p-8 mb-12` ile Sources box'unun ikizi. Aynı `text-xs uppercase tracking-[0.2em]` heading. Aynı 4-col responsive grid. Bottom bar ile aralık dengeli. Mevcut footer pattern'i ile kusursuz entegre.

### [İ8] CLOSE_BTN adoption
37 yerde tutarlı `CLOSE_BTN` kullanılıyor; her birinde aynı onMouseEnter/Leave pattern (`background = COLORS.glassBorder`, `color = COLORS.offWhite`). Header-token-bypass eden KissaAtlas bile close button için doğru token kullanmış.

### [İ9] ReadingMode'un day/night palette ayrımı (tokens.js:96-148)
`arabicQuiet/Bright`, `creamQuiet/Bright`, `besmele`, `paperCream/Gold/Ink/Sepia/Red/Muted`, `paperInkBrownAlphaXX`, `paperDeepBrownAlphaXX` — modal-specific palette intent açık şekilde belgelenmiş, multi-pass tuning yorumları korunmuş. Bu, gerçek bir tasarım disiplinidir.

### [İ10] `:focus-visible` baseline (globals.css:345-348)
`outline: 2px solid var(--color-gold); outline-offset: 2px` global tanımı erişilebilirlik için doğru tabanı kuruyor. Inline `outline: none` yapan input'lar için bu baseline yine de mevcut.

---

## Section-by-section bulgular

### Homepage (`/tr`)
- Hero: özenli (İ4, İ5). Tek not — alt boş kısımda (max-w-2xl) line-height 1.7 + clamp font-size ile 3-paragraf description okunabilir. Mobile'da `tracking-[0.01em]` ile `clamp(0.95rem,1.6vw,1.0625rem)` boyut iyi.
- PathCards: 2x2 (desktop) / 1-col (mobile) grid, `BREAKPOINT_TABLET` (768) doğru breakpoint. PathCard içeriği canlı.
- AllTopics: Legend pill mobile'da column'a düşüyor; ancak içerik o pill'in altında topic-cards 1-col grid'e geçince hiyerarşi sağlam. 4 kolon (lg ≥1280) → 2 kolon (md ≥768) → 1 kolon. Doğru.
- ToolsHighlight: 3-col desktop. CTA secondary (P3) hafifçe boğuk.
- LinguisticDNA / ImpossibleRhythm / QuranRhetoric / QuranDua / SoundArchitecture / PsychologySection / HiddenArchitecture / ScientificSigns / HistoricalProof / LivingPreservation / ZeroRedundancy / Highlights / HumanDefinition: kart içerikleri zengin, tipografi seçimleri iyi. **Ana sorun K3 (gradient transitions) ve O1 (ham renkler).**
- ToolsShowcase + Conclusion: closing layer kompakt. Conclusion verse box (Nisa 4:82) en güzel "wow finale" — sadece K4 (inline gradient CTA) ve P9 (box-glow class'ı bypass) düzeltilsin.

### Reading mode (`/tr/oku/2`)
- Navbar `hideOnReadingMode` ile gizleniyor — doğru karar. Bu yüzden ReadingMode 64px kendi header'ını koruyabiliyor (K2 dışında kalır).
- `day/night` palette ayrımı kaliteli (İ9). `paperCream` tuning yorumu ışıldıyor.
- Şura tipografisinin sadakati (KFGQPC + ShaykhHamdullah fallback) §13.2'ye uyumlu.

### Tool overlays (`/atlas/kissa`, `/atlas/peygamber`, `/graf/ayet`, `/arac/wow`, `/arac/dualar`)
- **KissaAtlas (K1, K2):** OVERLAY tokenlarını bypass — kritik fix.
- **ProphetAtlas:** CLOSE_BTN doğru, ancak `section style={background: linear-gradient(180deg, cosmicBlack 0%, deepNavy 50%, cosmicBlack 100%)}` — overlay route olduğu için inset 54px **yok**, doğrudan section. Bu route'a girince Navbar görünür (hideOnReadingMode false), padding-top 100px ile navbar'ı clear ediyor. Doğru pattern.
- **VerseGraph (K2):** Header `position: absolute` ile canvas üstüne bindirilmiş — input arama sırasında force-graph mouseEvent çakışması riski (kullanıcı header tıklayınca canvas drag başlamasın diye dikkat edilmeli). Normal flex header'a dönüştürülmesi öneriliyor.
- **WowFacts, DuaVerses (O6):** Mobile pattern eksik. 54px header doğru.

### Footer
İ7'de detaylandırıldı. Tek küçük not (P6): bottom bar mailto link `text-silver/60` ve copyright `text-silver/75` farklı opacity'ler. Aynı satırda — eşitle (her ikisi 0.75 olsun). Bismillah kalimesi `text-gold/30` çok soluk; en az `gold/50` olsun (mübarek lafızın işareti olarak).

---

## Genel Değerlendirme

**Güçlü yönler:**
1. Tasarım sistemi mimarisi (tokens.js) **senior-grade** — palet, radius, transition, z-index, blur, breakpoint scaleleri eksiksiz.
2. Discovery layer (Hero/PathCards/AllTopics/ToolsHighlight) tipografi hiyerarşisi **gerçekten zarif** — bu dörtlüde sayfayı tarayan biri site dilini öğreniyor.
3. Reading mode day/night palette tuning'i **belgelenmiş ve kasıtlı** — son nüansa kadar oturmuş.
4. Accessibility baseline kurulu (`:focus-visible` global, `reduce-motion`, `aria-label`, `dir="rtl"` her Arabic blokta).

**Zayıf yönler:**
1. **Token adoption %66 civarında** — 350+ ham hex, 1.300+ ham rgba, 123 inline transition, 19 inline KFGQPC string, 16+ inline Playfair string. Sistem var, **disiplin** yarısında bozuluyor.
2. **Section transitions yok** — `.gradient-divider` CSS tanımlı, hiçbir yerde çağrılmıyor. Homepage 19 section sert kesimle dizilmiş, üstelik bazı yerlerde aynı-renk ardışıklığı var.
3. **Tool overlay'leri kendi içlerinde tutarsız** — 3 farklı header yüksekliği, 3 farklı background rgba. Kullanıcı tool'lar arası geçtiğinde "küçük bir sarsılma" hissi alır.
4. **Mobile responsive pattern bazı tool'larda eksik** — WowFacts, DuaVerses, KissaAtlas (kısmen) §14 patternını uygulamıyor.

**Eylem önceliği:**
1. K3 (gradient transitions) — sitenin cinematic ritmini geri getirir.
2. K1+K2 (overlay token bypass + header height harmonization) — tool deneyimini bütünleştirir.
3. K4+K5 (CTA + KFGQPC inline) — codemod ile 30 dakikada biter.
4. O1+O2+O8 (ham renk/transition/font codemod'u) — tek bir AST script ile bir günde temizlenebilir.
5. O6 (mobile pattern eksikleri) — DuaVerses, WowFacts'i KissaAtlas modeline taşı.

Genel olarak: bu, **çok başarılı bir tasarım sistemine sahip ama uygulama disiplini yarı yarıya bozulan** bir kod tabanı. Eksiklerin tamamı eyleme dönüştürülebilir; hiçbiri "yeniden tasarım" gerektirmiyor. Bir codemod sprint'i + 4 kritik dosya fix'i ile A+ seviyesine çıkar.
