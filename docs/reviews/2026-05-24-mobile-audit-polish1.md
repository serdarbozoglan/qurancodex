# Mobile UX Audit — Polish Pass 1
Tarih: 2026-05-24
Kapsam: 13 round (Hero + 18 section + 5 component) — Hero baseline tipografi imzası

## Özet

- Kritik: 2
- Yüksek: 5
- Orta: 6
- Düşük: 4

Tarama Yöntemi: 1) Hero + Navbar + ChapterProgress full read · 2) Discovery zone (PathCards/AllTopics/ToolsHighlight) + card componentleri · 3) 18 long-form section grep ile responsive pattern audit · 4) ProphetMap leaflet · 5) ReadingMode mobile path · 6) Conclusion CTA stack. Test viewport baseline: **390×844** (iPhone 14 / Galaxy S baseline). 320 (iPhone SE 1) köşe case'leri ayrıca işaretlendi.

---

## Kritik (mobile UX bozar)

### [M-K1] Navbar Top Row — 390px viewport'ta sıkışıklık, 320px'te kaçınılmaz overflow
**Dosya/Satır:** `next/src/components/Navbar.jsx:713`, `:722`, `:1129`, `:1163`
**Sorun:**
Navbar üst row sabit `max-w-7xl mx-auto px-8` (32px her iki yandan) kullanıyor. Mobile'da görünür öğeler:
- Logo "QURAN CODEX" — `fontSize:'1.05rem'` + `tracking-[0.18em]` ≈ ~175–195px text genişliği
- EN/TR toggle — `padding:'0 14px'`, height 32px ≈ ~56–62px
- Hamburger — 36×36px
- Gap: 3 × `gap:'16px'` (ana row) + iç gap'ler → en az ~40px boş alan

Toplam minimum: ~195 + 60 + 36 + 40 = **~331px**. 390px viewport'ta padding (64px) çıkınca **326px iç alan** kalıyor. Sınırda — 5–10px overlap riski yüksek. Daha küçük cihazlarda (320px) overflow garantili.

Ayrıca scrolled state `py-3` (12px) + button height 32px = ~56px navbar yüksekliği, ama `scroll-margin-top: 72px` (`globals.css:75`) — anchor link tıklandığında 16px boş alan kalıyor (cosmetic, kritik değil).

**Çözüm önerisi:**
- Mobile'da `px-8` → `px-4` (16px) düşür, ya da `px-4 lg:px-8` Tailwind formuna geç. 8px ek alan kazanılır her iki yandan.
- Logo `tracking` değerini mobilde küçült: `tracking-[0.12em] sm:tracking-[0.18em]`.
- EN/TR button padding mobile için `0 10px` (5px tasarruf).

### [M-K2] Hamburger butonu WCAG 2.5.5 (target size 44×44) altında
**Dosya/Satır:** `next/src/components/Navbar.jsx:1163-1165`
**Sorun:**
```jsx
width: '36px',
height: '36px',
```
WCAG 2.5.5 (AAA) ≥ 44×44, AA Level 2.5.8 (Mobile) ≥ 24×24 minimum / 44×44 önerilen. 36px touch target — özellikle nav'ın sağ kenarında parmak ulaşımı zor. Mobile drawer içindeki close butonu 40×40 ile zaten daha büyük (Navbar.jsx:1219); hamburger ise hâlâ 36px.

**Çözüm önerisi:**
`width: '44px', height: '44px'` (ikonu 20×20'de bırak, padding genişlesin). Toplam navbar yüksekliğine etkisi yok çünkü navbar `py-5` (40px) zaten yüksek.

---

## Yüksek (mobile rahatsız eder)

### [M-Y1] HumanDefinition — Opposition Pairs 3-panel layout mobile'da daralır
**Dosya/Satır:** `next/src/sections/HumanDefinition.jsx:852-907`, `:881` (`width: '140px'`)
**Sorun:**
Opposition pair satırı 3 sütun: positive | center divider (sabit 140px) | negative.
- Center divider 140px sabit
- Her iki yan flex-1
- `flex items-stretch`, mobile için breakpoint yok (sadece `p-4 md:p-5` padding)

Mobile (390px inner ≈ 342px):
- 342 - 140 = 202px → 2 yan panel için ≈ 101px her biri
- Yan panellerde `text-2xl md:text-3xl` Arapça (≈ 28–36px) + "Şükredici / Nankör" gibi label var. 101px alana sığmaz — Arapça yan yana label ile çakışır, text wrap kötü.

**Çözüm önerisi:**
Mobile için layout column'a düşürülmeli: `flex flex-col md:flex-row` ve center divider mobilde yatay hale getirilmeli (üst-orta-alt 3 satır). Tipik §14.4 üçlü panel pattern'i.

### [M-Y2] LinguisticDNA mukattaa harfleri 14 adet `flex-wrap`, mobile'da satır boşluğu kontrolsüz
**Dosya/Satır:** `next/src/sections/LinguisticDNA.jsx:293-326`
**Sorun:**
14 harf `flex flex-wrap justify-center gap-4 mb-4`, her harf `width:'4rem', height:'4rem'` (64×64). Mobile (390-48=342px iç):
- 4 harf × 64px = 256px + 3 × 16px gap = **304px** → tek satırda 4 harf
- 14 harf → 4 satır (4+4+4+2)
- Justify-center son satır 2 harf orta hizalı — OK
- Yine de toplam yükseklik: 4 × (64+16) = **320px** sadece harfler için, mobil'de büyük dikey alan.

**Çözüm önerisi:**
Mobile'da harf boyutunu küçült (`width:'3rem', height:'3rem'`) ya da gap'i daralt (`gap-2`). 5 harf/satır ile 3 satıra düşer.

### [M-Y3] SectionWrapper — mobile `py-10` ile section'lar arası zayıf dikey ritim
**Dosya/Satır:** `next/src/components/SectionWrapper.jsx:52`
**Sorun:**
`py-10 px-6 md:px-12 lg:px-16` — mobile padding-y 40px. 18 ardışık section'da bu mobile'da uygundur, ancak Hero ile PathCards arasındaki geçişte `<Hero>` `min-h-screen` (≈844px), sonra hemen PathCards section_label "KEŞIF YOLLARI" — Hero scroll indicator (`bottom-8`) ile PathCards üst kenar arası ~70px. Hero'nun emosyonel kapanışı net değil.

**Çözüm önerisi:**
İlk content section'a (PathCards) mobile için ekstra üst margin: `pt-14 md:pt-10`. SectionWrapper `noPadding` veya yeni `firstAfterHero` prop ile çözülebilir.

### [M-Y4] ProphetMap — sabit `height: 480px` mobil baskın, viewport'un yarısından fazlasını alır
**Dosya/Satır:** `next/src/sections/ProphetMap.jsx:231`
**Sorun:**
Mobile 390×844'te 480px harita → viewport'un %57'si. Üstte H3 başlık + altta legend/info kartları varsa, kullanıcı tek ekranda haritayı + bağlamı göremiyor. `scrollWheelZoom: false` — touch pinch çalışır ama tek parmak pan zaten harita içinde lock olur (page scroll'a interferans).

**Çözüm önerisi:**
Mobile için `height` adaptive: `height: isMobile ? '380px' : '480px'`. Ayrıca `tap: true` (leaflet default açık) + `dragging: true` zorunlu doğrulanmalı.

### [M-Y5] LinguisticDNA letter color legend (line 345) mobile'da iki etiket yan yana sıkışır
**Dosya/Satır:** `next/src/sections/LinguisticDNA.jsx:345-354`
**Sorun:**
`flex flex-wrap gap-5 text-xs` — "Mekkî-Medenî Karma" (~140px) + "Mekkî" (~60px) + 20px gap = ~220px. 342px iç alana sığar AMA tek satır; gerçek text-xs (12px) doğru render olur. Yine de chip görünümü yok, sadece dot+text — algı zayıf.

**Çözüm önerisi:**
Chip-style border + padding ekle (her span için `padding: '3px 8px', borderRadius: '999px'`).

---

## Orta (cosmetic)

### [M-O1] Hero — başlık 4 satıra çıkıyor (TR), nefes alan kompozisyon kırılır
**Dosya/Satır:** `next/src/components/Hero.jsx:47-56`, `tr.json:13`
**Sorun:**
"KUR'AN-I KERİM'İN GÖRÜNMEYEN MİMARİSİ" — 5 kelime, 35 karakter.
- Mobile font: `text-4xl` = 36px (Tailwind default)
- `leading-[1.15]` = ~41px line-height
- Container: `max-w-4xl px-6` → 342px iç alan
- 36px × 0.55 (cap+space) ≈ 20px/char (Playfair display'in geniş kerning) → satır başına ~17 char
- 35 char → **2 satır** ("KUR'AN-I KERİM'İN" / "GÖRÜNMEYEN MİMARİSİ")
- "GÖRÜNMEYEN MİMARİSİ" 18 char ≈ tam sığar; "KUR'AN-I KERİM'İN" 16 char ≈ tam sığar
- Aslında 2 satır görünür — kabul edilebilir ✓

Ancak EN için "THE INVISIBLE ARCHITECTURE OF THE QURAN" — 39 char, 7 kelime, 36px'te muhtemelen 3 satır. Mobile'da Hero başlığı satır sayısı dile göre asimetri yaratıyor.

**Çözüm önerisi:**
Mobile için `text-[2rem]` (32px) custom değer dene; ya da `tracking-tight` zaten kullanılıyor → daha negatif `tracking-[-0.015em]` ile sıkıştır.

### [M-O2] Hero CTA padding 56px sabit — text uzun çevirilerde kırılma riski
**Dosya/Satır:** `next/src/components/Hero.jsx:118`
**Sorun:**
`padding: '15px 56px'` → 112px yatay padding. "İncelemeye Başla" ≈ 145px text + 112 = 257px button. 390-48 (px-6) = 342px → sığar.

Ancak gelecekte daha uzun çeviri eklenirse (örn. "Keşfetmeye Başla" yerine "Aşağı İnerek Keşfe Başla") taşar. Polish Pass 1 değişikliği değil ama strüktürel risk.

**Çözüm önerisi:**
Padding'i clamp'a çevir: `padding: 'clamp(13px, 1.5vw, 15px) clamp(32px, 6vw, 56px)'`. Mobile darda otomatik küçülür.

### [M-O3] ChapterProgress mobile'da gizli — kullanıcının nerede olduğu belirsiz
**Dosya/Satır:** `next/src/components/ChapterProgress.jsx:83` (`className="hidden lg:flex"`)
**Sorun:**
ChapterProgress dot indicator desktop-only. Mobile'da kullanıcı 12 chapter'lık scroll-story içinde nerede olduğunu bilmiyor. Polish Pass 1'in temposunu (uzun scroll) hatırlatmak için mobil progress UI yok.

**Çözüm önerisi:**
Mobile için top'ta ince horizontal progress bar (scroll ilerlemesini gösteren) eklenebilir. Düşük öncelik — başka audit'ler de bunu söylüyor olabilir.

### [M-O4] PathCards intro Hero baseline imzasını paylaşıyor — Hero'dan ayrıştırma zayıf
**Dosya/Satır:** `next/src/sections/PathCards.jsx:170-184`
**Sorun:**
Hero description `clamp(0.95rem, 1.6vw, 1.0625rem)` + offWhite 78% + leading 1.7 + tracking 0.01em. PathCards subtitle aynı.
Polish Pass 1 hedefi "Hero baseline parity" — bilinçli karar. Ancak mobile'da Hero immediately above; aynı imza iki kere → bir DNA tekrarı hissi. Hero'nun kapanış imzasını PathCards'tan biraz ayırmak okuyucuya "yeni bir bölüm" sinyali verir.

**Çözüm önerisi (opsiyonel):**
PathCards subtitle line-height'ı 1.65'e indir, mb'i 8'e küçült, ya da italik tek satır "Yön seç →" gibi mikro-CTA ekle.

### [M-O5] AllTopics legend pill mobile'da iki satıra düşebilir
**Dosya/Satır:** `next/src/sections/AllTopics.jsx:98-179`
**Sorun:**
Legend container `display: 'inline-flex', flexWrap: 'wrap', padding: '10px 18px'`. İki span:
- "Sayfaya gider" (~115px) + icon (22px) + gap → ~145px
- "İnteraktif modülde açar" (~165px) + icon (22px) + gap → ~195px
- Divider 1px + outer gap 14px

Mobile 342 - 36 (padding) = 306px iç. 145+195+15 = 355px → **wrap'lar**. Pill kart 2 satıra çıkar, divider ortada kalır (vertical 20px height — wrap olunca yanlış yerde olur).

**Çözüm önerisi:**
Mobile'da divider'ı hide et veya legend'i column'a çevir: mobile'da `flexDirection: 'column'`, divider'ı yatay haline getir.

### [M-O6] Conclusion `فَاتَّبِعُوهُ` 2.6rem sabit — küçük viewport'ta hafif taşma riski
**Dosya/Satır:** `next/src/sections/Conclusion.jsx:120-128`
**Sorun:**
`fontSize: '2.6rem'` = 41.6px. Tek kelime ama Arapça connected — text-center mx-auto. Geniş bir kelime; mobile 390-48=342px iç alanda KFGQPC fontunda "فَاتَّبِعُوهُ" yaklaşık 250–290px genişlik. Sığar ✓ ama 320px viewport'ta hafif kırpılma riski (overflow-x: hidden html'de aktif, görsel ama bilgi kaybı yok).

**Çözüm önerisi:**
Clamp'a çevir: `fontSize: 'clamp(2.1rem, 6vw, 2.6rem)'` — küçükte 33.6px.

---

## Düşük (nice-to-have)

### [M-D1] Highlights — intro paragrafı yok, 18 section paritesi kırılıyor
**Dosya/Satır:** `next/src/sections/Highlights.jsx:194-217`
**Sorun:**
Diğer 17 section'da Hero baseline intro paragrafı (offWhite/78, clamp font, max-w-3xl) var. Highlights'ta badge → title → grid sırası, intro yok. Polish Pass 1'de bilinçli tutulmuş olabilir ama parite tartışılır.

**Çözüm önerisi:**
1-cümle intro ekle: "Sezgisel olarak çarpıcı bulduğumuz 6 keşif. Her biri ayrı bir keşfe açılıyor."

### [M-D2] Navbar drawer — close button 40×40, hamburger 36×36 — tutarsızlık
**Dosya/Satır:** `next/src/components/Navbar.jsx:1219` (40px), `:1163` (36px)
**Sorun:**
Mobile drawer içindeki close button 40×40, ama menüyü AÇAN hamburger 36×36. Aynı bağlam (drawer toggle), farklı boyut. UX tutarsızlık.

**Çözüm önerisi:**
M-K2 ile birlikte: hamburger'i 44×44'e çıkar, close'u 44×44 yap. Hem WCAG hem tutarlılık tek hamlede çözülür.

### [M-D3] ZeroRedundancy tooltip 220px, right:0 — info button sağ kenarda olunca sığmaz
**Dosya/Satır:** `next/src/sections/ZeroRedundancy.jsx:36-51`
**Sorun:**
`InfoTooltip` component `position: absolute, right: 0, width: '220px'`. Mobile'da bir kart sağ kenara dayalıysa tooltip 220px - cardWidth offset ile dış sınıra dayanır. Hidden değil ama kırpılma riski var.

**Çözüm önerisi:**
Mobile'da `width: 'min(220px, calc(100vw - 32px))'` veya `right: 0` yerine `right: 'auto', left: 0`.

### [M-D4] ScientificSigns timeline gap line (1.400 yıl) mobile'da hide ediliyor — iyi
**Dosya/Satır:** `next/src/sections/ScientificSigns.jsx:278`
**Sorun:**
Sadece pozitif not — `display: isMobile ? 'none' : 'block'` doğru kullanım, gap-line ortadan kalkınca iki badge yan yana kalıyor. Yine de mobile'da `1.400 yıl` ifadesi (timeline'ın asıl messajı) tamamen kayboluyor — başka bir yere taşınması iyi olabilir.

**Çözüm önerisi:**
Mobile'da iki badge arasına `<span>1.400 yıl</span>` text-only label ekle, gradient line yerine.

---

## Genel Değerlendirme

**Puan: 7.5/10**

**Güçlü yanlar:**
- Hero baseline tipografi imzası (clamp + offWhite/78 + leading 1.7) **18 section + 5 component'te tutarlı uygulanmış** — büyük başarı. Mobile'da tek tip okuma deneyimi var.
- ScientificSigns, PsychologySection, ReadingMode — `isMobile` pattern doğru kullanılmış, `BREAKPOINT_MOBILE` ve `BREAKPOINT_TABLET` `tokens.js` üzerinden tek kaynak.
- Discovery zone (PathCards/AllTopics/ToolsHighlight) responsive grid (`getColumnCount`) ve SSR-safe initial state — Next.js best practice.
- Conclusion CTA `flex flex-col sm:flex-row` — mobile-first stack düzgün.
- ChapterProgress `hidden lg:flex` — mobile'ı clutter'dan koruyor.

**Zayıf yanlar:**
- **Navbar mobile pixel-perfect değil** — 390px sınırda, 320px overflow. `px-4` yerine `px-8`. (K1)
- Hamburger WCAG ihlali — 36×36 (K2)
- HumanDefinition Opposition Pairs ve LinguisticDNA mukattaa harfleri **sadece desktop'a göre tasarlanmış**; CLAUDE.md §14.4 üçlü panel pattern'i ihlal ediliyor. (Y1, Y2)
- ProphetMap sabit 480px — mobile dikey yer kontrolü yok. (Y4)
- ChapterProgress mobile-eşdeğeri yok (O3) — Polish Pass 1'in 12 chapter'lık navigation hierarchisi mobile'da kullanıcıya görünmez.

**Polish Pass 1 mobile davranışı net olarak doğru yöne gidiyor** — Hero parity yaygın, font clamp her yerde, intro paragrafları paritede. Ana eksiklikler **legacy widget'larda** (HumanDefinition opposition, LinguisticDNA harfleri) ve **Navbar sıkışıklığında**. Polish Pass 2'de bu 7 yüksek-orta bulguya odaklanmak mobile UX'i 9/10'a çıkarır.

### Önerilen Polish Pass 2 sırası

1. **K1 + K2 + D2** (Navbar — tek dosya) → 1 saat
2. **Y1** (HumanDefinition opposition column layout) → 1 saat
3. **Y4** (ProphetMap height adaptive) → 30 dakika
4. **Y2 + Y5** (LinguisticDNA mukattaa + legend) → 45 dakika
5. **O1 + O2 + O6** (Hero + Conclusion clamp ölçek) → 30 dakika
6. **Y3 + O3 + O5** (SectionWrapper + ChapterProgress mobile + legend wrap) → 1 saat

Toplam tahmini effort: **~5 saat** — Polish Pass 2 ileriki bir round'a sığar.
