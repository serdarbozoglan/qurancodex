# QuranCodex Görsel/Tasarım Denetim Raporu — 2026-07-12

**Denetim penceresi:** son 22 batch (`e284fa2` → `3a8099c`)
**Denetleyen:** qc-visual-auditor
**Kapsam:** Anasayfa + `/tr/atlas/ibadetler` + `/tr/atlas/ibadetler/namaz` + `/tr/arac/esma-frekans` + `/tr/arac/renkler` + `/tr/arac/dualar`
**Yöntem:** Playwright headless Chromium (390×844 mobile / 1440×900 desktop), TR + EN, kod-tabanlı grep audit (§4/§11/§13/§14/§16)
**Screenshotlar:** `docs/screenshots/2026-07-12/` — 130+ dosya (scroll'lu tarama)

---

## Özet

| Ciddiyet | Sayı | Alan |
|---|---|---|
| 🔴 **Kritik** | 3 | Escape'lenmiş çift tırnak (görünür bug), TR/EN Tefekkür kelimesi çevrilmemiş, mobil breadcrumb hero'yu ezme |
| 🟠 **Orta**   | 8 | Ellipsis drift (`...` → `…`), CTA class duplikasyonu, sticky tab hero'yu ezme, esma dark ayet renk parlaklığı, KuranRenkleri ham hex enflasyonu, CrossToolCTA çift blok, HUB emoji, non-KFGQPC bismillah fontu |
| 🟡 **Minör**  | 7 | RADIUS scale drift (52 off-scale), `fontFamily` inline literal drift, backdrop-filter inline drift, dev "1 Issue" scroll-behavior, EN Navbar "Tefekkür" tutarsız çeviri, HeroGeometricBackground opaklık, Peygamber sayfası şeması. |

**Nette güçlü alanlar:**
- Anasayfa Hero (§13.18 pattern) sağlam — hem TR hem EN mobil-desktop yerinde
- Sticky tab bar (§13.19) 10+ komponentte tutarlı — `rgb(6, 8, 14)` opaque, `top: 110px`, `isolation: isolate`, `zIndex: 20`
- ToolHeader (§13.17) hub + pillar + renkler + dualar'da doğru kullanılıyor
- EsmaFrekans flagship Hero + 9 element sırası korunmuş
- Mobil section chip nav homepage'de akıcı
- Dualar TR/EN çift kolonlu grid mobilde tek kolona iniyor — clean

---

## 1. RENK SİSTEMİ SORUNLARI

### 🔴 K-01 · `KuranRenkleri.jsx` — TR versiyonunda **escape'li literal `\"..\"`** JSX'te ekrana basılıyor
**Dosya:** `next/src/components/KuranRenkleri.jsx:3053` ve `:3073`
**Sorun:** JSX text node içinde `\"koyu yeşil\"` ve `\"vaadin baş işareti\"` yazılmış — JSX escaping gereksiz. Render'da kullanıcı ekranda `\"vaadin baş işareti\"` (ters slash görünür) okuyor. EN versiyonu doğru: `"koyu yeşil"` düzgün render oluyor.
**Kanıt:** `docs/screenshots/2026-07-12/renkler-tr-desktop-scroll-04.png` — 3. satırda `\"vaadin baş işareti\"` ters slash'li.
**Beklenen:** Standart tırnak `"..."` (JSX text içinde escape gerekmez).
**Öneri:**
```jsx
// 3053 — TR
? <>...hapax "koyu yeşil" iki bahçe — ...<em>vaadin baş harfi</em>dir.</>

// 3073 — TR
? <>Bu sayfa <strong>yeşil</strong>e "vaadin baş işareti" olarak odaklanır — ...</>
```

---

### 🟠 O-01 · `KuranRenkleri.jsx` ham hex enflasyonu — 60+ raw hex, hiçbiri token'da değil
**Dosya:** `next/src/components/KuranRenkleri.jsx` (satırlar: 71, 73, 77, 439, 695, 700–890, 1146–1180, 1191, 1468, 1478, 1491, 1504, 1517, 1523, 1632, 2148, 2154, 2160, 2220, 2231, 2242, 2852–2854, 2949, 3045–3118)
**Sorun:** Örnek: `'#1D9E75'` (yeşil), `'#B8860B'` (altın), `'#64748B'` (gümüş), `'#0F4C35'` (koyu yeşil), `'#F0F0F0'` (beyaz), `'#B91C1C'` (kırmızı), `'#CA8A04'` (sarı), `'#1E1B4B'` (indigo-siyah), `'#C8D6E5'` (soluk yüz), `'#78624A'` (kuru), `'#2ecc71'` (emerald text) vd.
**Gerekçe:** Bu tool sayfasının domain'i **renk semantiği** — 20+ farklı renk göstermesi tasarımın kendi konusu. Yine de bu paletin tekrarlanan değerleri (12 kanonik renk + karşıtları) token dosyasında `KURANI_COLORS` bloğu olarak ayrılabilir, ham değil semantik referansla kullanılabilir:
```js
// tokens.js
export const KURANI_COLORS = {
  green:     '#1D9E75', darkGreen:  '#0F4C35',
  gold:      '#B8860B', silver:     '#64748B',
  white:     '#FFFFFF', paleWhite:  '#C8D6E5',
  yellow:    '#CA8A04', ravenBlack: '#1E1B4B',
  red:       '#B91C1C', deepRed:    '#7F1D1D',
  blue:      '#2563EB', ashGray:    '#78624A',
};
```
**Etki:** Tek dosyada 60+ farklı hex — bir renk paletindeki tek değişiklik 60 satır edit gerektirir; drift'e açık.

---

### 🟠 O-02 · `QuranDua.jsx` (anasayfa section) — 20+ raw hex hardcoded
**Dosya:** `next/src/sections/QuranDua.jsx` (kanıt: 34, 53, 72, 91, 110, 140, 146, 152, 166, 172, 261–454, 482–484, 711–733, 842–844)
**Sorun:** Emoji rengi + kategori rengi olarak `'#3498db'` (skyBlue), `'#ec4899'` (pembe), `'#e67e22'` (orange), `'#2ecc71'` (green), `'#a78bfa'` (purple), `'#e74c3c'` (softRed), `'#94a3b8'` (silver) — bunların hepsi token dosyasında mevcut ama import edilmemiş.
**Beklenen:** `color: '#3498db'` yerine `color: COLORS.skyBlue`.
**Etki:** 20+ noktada aynı hex → tek nokta drift → tema değişimi tek yerden yapılamaz.

---

### 🟠 O-03 · `QuranRhetoric.jsx` (anasayfa) — inline `#d4a574`, `#3498db`, `#2ecc71`, `#a78bfa`, `#94a3b8`, `#e8e6e3` reference'ları
**Dosya:** `next/src/sections/QuranRhetoric.jsx` (satırlar: 35, 46, 57, 68, 209, 217, 225, 233, 241, 249, 439, 454, 596, 607, 686, 709, 717, 764, 767)
**Sorun:** `#d4a574` = `COLORS.gold`, `#3498db` = `COLORS.skyBlue`, `#2ecc71` = `COLORS.softEmerald`, `#a78bfa` = `COLORS.purple`, `#94a3b8` = `COLORS.silver`, `#e8e6e3` = `COLORS.offWhite`. Hepsi zaten token'da var, sadece import edilmemiş.
**Öneri:** Tek pass ile:
```js
const CATEGORIES = [
  { id: 'erotema', pct: 40, color: COLORS.gold,        Icon: IconThink },
  { id: 'irshad',  pct: 28, color: COLORS.skyBlue,     Icon: IconCompass },
  { id: 'tevbih',  pct: 20, color: COLORS.softEmerald, Icon: IconWarn },
  { id: 'taaccub', pct: 12, color: COLORS.purple,      Icon: IconStar },
];
```

---

### 🟠 O-04 · `HiddenArchitecture.jsx` — 7 rastgele renkli SVG ray
**Dosya:** `next/src/sections/HiddenArchitecture.jsx:92`
```js
const RAY_COLORS = ['#E8A020','#1AAB80','#3B8FE0','#8B5CF6','#06B6D4','#F97316','#E8D070'];
```
**Sorun:** 7 farklı ham hex — token dosyasında `orange`, `softEmerald`, `skyBlue`, `purple`, `cyan`, `amber` var, sadece son iki (`#E8A020`, `#E8D070`) yok. Adhoc gold varyantlarını da `goldWarm`, `goldBright` ile eşleyip token'a taşınabilir.
**Etki:** Halka Kompozisyon section'da 7 renkli ışık kolları — palet çeşitliliği yaratmak istenmiş ama tokenlaşmamış.

---

### 🟠 O-05 · `TefekkurHighlight.jsx` (anasayfa) — kategori accent renkleri hex literal
**Dosya:** `next/src/sections/TefekkurHighlight.jsx` (36, 50, 68, 83, 100, 115, 134, 149)
```js
categoryAccent: '#c9a227',  // royalGold — TOKEN VAR
categoryAccent: '#8b5cf6',  // purple500 — yok, ekle
accent: '#3498db',          // skyBlue — TOKEN VAR
accent: '#d4a574',          // gold — TOKEN VAR
accent: '#1D9E75',          // green — cennet paleti
accent: '#9b59b6',          // violet — TOKEN VAR
```
**Öneri:** `COLORS.royalGold`, `COLORS.skyBlue`, `COLORS.gold`, `COLORS.violet` doğrudan; `#8b5cf6` (Tailwind violet-500) ve `#1D9E75` (kur'ânî yeşil) için token ekle.

---

### 🟡 M-01 · `VerseGraph.jsx` — 8 farklı `#4a5568`, `#e2e8f0`, `#8a7355`, `#0d1128`, `#07091a` inline hex
**Dosya:** `next/src/components/VerseGraph.jsx:494, 518, 739, 749, 760, 776, 787, 793, 1072, 1079, 1290, 1324, 1339, 1956`
**Sorun:** Slate-scale tokenları (slate700 `#334155`, slate500 `#64748b`, slate200 `#e2e8f0` vd.) mevcut ama Graf tool VerseGraph özel arka plan tonu `#0d1128` gibi tek-kullanımlık değerler kullanıyor. Bu kadar özel tool için domain-lokal olabilir ama en azından local `const COLORS_GRAPH = {...}` ile isimlendirilmeli.

---

## 2. TİPOGRAFİ SORUNLARI

### 🟠 O-06 · `SesMimarisi.jsx:54` — Bismillah'ta yanlış font family formatı
**Dosya:** `next/src/components/SesMimarisi.jsx:54`
```js
fontFamily: 'Amiri Quran, serif',  // Tırnaksız — sadece yanlış syntax; CSS parse eder ama Amiri Quran ismini quote'suz kabul etmez tarayıcılar tutarsız.
```
**Beklenen:** Bismillah `﷽` render'ı için tercih edilen zincir: `"'Amiri Quran', 'Amiri', serif"` — CLAUDE.md §13.2 documented exception.
**Öneri:**
```js
fontFamily: "'Amiri Quran', 'Amiri', serif",
```
**Etki:** Muhtemelen tarayıcılar zaten toleranslı — ama font-family syntax standardı ihlali. Aynı hata `DuaDili.jsx:81`, `KorumaZinciri.jsx:53`, `InsanTanimi.jsx:71`, `AltiKonu.jsx:53`, `Ritim.jsx:57`, `TekrarAnatomi.jsx:53`, `Mukattaa.jsx:64`, `HalkaKompozisyon.jsx:54`, `InsanPsikolojisi.jsx:59`'da tekrarlanıyor. 10 komponentte aynı drift.

---

### 🟠 O-07 · `IbadetlerPillar.jsx:189` + `IbadetlerHub.jsx:67` — Bismillah'ta `FONTS.arabic` (Amiri) kullanımı
**Dosya:** `next/src/components/IbadetlerPillar.jsx:189` ve `next/src/components/IbadetlerHub.jsx:67`
```js
fontFamily: FONTS.arabic,  // = 'Amiri', serif
```
**Sorun:** Bismillah `﷽` (U+FDFD) *ligature presentation form* — yalnızca `Amiri Quran` bu ligature'u proper render eder. Amiri (base) fallback olur ama ideal değil.
**Beklenen:** Standart Bismillah stil — `"'Amiri Quran', 'Amiri', serif"` veya token eklenmiş `FONTS.bismillah`.
**Öneri:** `tokens.js` FONTS bloğuna eklenebilir:
```js
export const FONTS = {
  quran:      "'KFGQPC', 'Amiri Quran', serif",
  bismillah:  "'Amiri Quran', 'Amiri', serif",  // U+FDFD ligature
  arabic:     "'Amiri', serif",
  display:    "'Playfair Display', serif",
  body:       "'Inter', sans-serif",
};
```
Kullanım: `fontFamily: FONTS.bismillah`. Tüm bismillah render'ları normalize eder.
**Etki:** Görselde fark az (Amiri de U+FDFD render ediyor), ama font zinciri ideali kaçırıyor.

---

### 🟡 M-02 · Inline `"'KFGQPC', 'Amiri Quran', serif"` string literal — 26 nokta
**Dosyalar:** `sections/QuranRhetoric.jsx`, `sections/QuranDua.jsx` (8×), `sections/HiddenArchitecture.jsx` (3×), `sections/PsychologySection.jsx` (2×), `sections/LinguisticDNA.jsx` (4×), `sections/ImpossibleRhythm.jsx` vd.
**Sorun:** `FONTS.quran` token varken doğrudan literal `"'KFGQPC', 'Amiri Quran', serif"` yazılmış. Tam olarak aynı değer olduğu için görsel etki yok — sadece drift/maintainability.
**Öneri:** `import { FONTS }` ekle, `fontFamily: FONTS.quran`.

---

### 🟡 M-03 · `sections/` — max-w-2xl / max-w-lg drift (§11 kuralı ihlali)
**Dosyalar:**
- `AllTopics.jsx:89` — intro `max-w-2xl` (§11: `max-w-3xl` olmalı)
- `HumanDefinition.jsx:452, 571, 835, 1009` — intro/section text `max-w-2xl` (4 nokta)
- `ImpossibleRhythm.jsx:614, 679` — intro `max-w-2xl` (2 nokta)
- `PathCards.jsx:172`, `TefekkurHighlight.jsx:256`, `ToolsHighlight.jsx:186` — `max-w-2xl` (§11: 3xl)
- `HiddenArchitecture.jsx:286, 296` — `max-w-lg mx-auto` (küçük — cent'lı whisper metni; §11 istisna sayılabilir)
- `LinguisticDNA.jsx:831` — `max-w-2xl mx-auto` italic whisper (cent'lı OK ama 3xl daha uygun)

**Beklenen (§11):**
| Element | max-width |
|---|---|
| Section intro paragraph | `max-w-3xl` |
| Section headings (h2) | `max-w-4xl` |

**Etki:** Kart-içi metinler için mesele değil ama 8 üst-seviye section intro'da `2xl` kullanılmış — genişlik dar, satır sonu erken kırılıyor, sayfada beyaz alan israfı.

---

## 3. SPACING / PADDING SORUNLARI

### 🔴 K-02 · Mobilde ToolHeader (sticky) hero'yu ezerken hero eyebrow + tagline gizleniyor
**Kanıt:** `docs/screenshots/2026-07-12/ibadetler-namaz-tr-mobile.png` — üst kısımda "Namaz · KULLUĞUN AYAKTA DURAN HALİ" başlık satırı hero'nun bismillah'ı ile üst üste bindiği görülüyor.
**Neden:** `ToolHeader` sticky `top: 62px` (Navbar altı). Sayfa yüklendiği ilk state'te (scroll = 0) ToolHeader + Hero aynı viewport'ta çakışmıyor ama sticky yapıştığında Hero'nun **eyebrow satırı** (h1'in üstündeki "KULLUĞUN AYAKTA DURAN HALİ") header'da tekrarlandığı için görsel duplicate olur.
**Beklenen (mobil):** ToolHeader mobil'de subtitle'ı gizlemeli veya header yüksekliği düşmeli.
**Öneri:** `ToolHeader.jsx`'a mobil breakpoint ekle:
```jsx
{subtitleTr && !isMobile && (
  <>
    <span style={{ ... }}>·</span>
    <span style={{ ... }}>{subtitleTr}</span>
  </>
)}
```
Alternatif: mobil'de subtitle'ı gizleyip yalnız başlık göster — hero eyebrow zaten aynı bilgiyi taşıyor.

---

### 🟠 O-08 · Namaz pillar sayfası masaüstünde de sticky tab bar hero'nun italic tagline'ını yiyor
**Kanıt:** `docs/screenshots/2026-07-12/ibadetler-namaz-ana-ayetler-tab.png` — tab'a tıklayınca "Zamana bağlı, kelimelerle şekillenen kulluk" italic tagline'ı sticky tab bar arkasında yarım görünüyor.
**Neden:** Tab'a tıklanınca `scrollIntoView({ block: 'start' })` çağrısı, tab bar'ı viewport üstüne getirir; ancak `scrollMarginTop: '120px'` yalnızca hedef element için — hero tagline sticky tab bar arkasında kalır.
**Beklenen:** Tab tıklandığında hero collapsed olabilir veya scroll position hero altına snap'lenebilir.
**Öneri:** İlk tıklama sonrası, hero yükseklik + margin kadar aşağı scroll (hero'nun tamamı yukarı gitsin):
```jsx
onClick={() => {
  setActiveTab(tab.key);
  setTimeout(() => {
    // Hero'nun altına indir; tab bar zaten sticky
    const hero = document.querySelector('[data-hero]');
    const heroH = hero?.getBoundingClientRect().height ?? 0;
    window.scrollTo({ top: heroH + 62, behavior: 'smooth' });
  }, 50);
}}
```

---

### 🟡 M-04 · Renkler sayfası sonunda iki peşpeşe CrossToolCTA bloğu — visual redundancy
**Kanıt:** `docs/screenshots/2026-07-12/renkler-tr-desktop-scroll-05.png` — "İLGİLİ SÜRELER" (Fâtır Sûresi, Rahmân Sûresi, Bakara 2:187) hemen ardından "İLGİLİ ARAÇLAR" (Kur'an'ın Yeminleri, Kevni Ayetler, İlk ve Son Kelimeler) — aynı grid, aynı stil.
**Sorun:** Kullanıcı iki benzer strip'e bakıp "aynı şey mi?" diye tereddüt eder. Görsel ritim aynı — brand isim (SÛRELER vs ARAÇLAR) değişse de.
**Öneri:** İkincisini farklı visual hierarchy'e al (küçültülmüş chip stili, veya gradient bg ile ayrış).

---

## 4. BORDER / RADIUS SORUNLARI

### 🟡 M-05 · `RADIUS` scale drift — 52 nokta off-scale
**Kanıt:** `borderRadius: '2px'`, `'3px'`, `'5px'`, `'11px'` — 52 farklı yerde. En büyük ihlaller:
- `KuranRenkleri.jsx:935, 2518, 2949` — `2px` (küçük vurgu barları)
- `KuranRenkleri.jsx:1698` — `3px`
- `QuranCommands.jsx:470` — `5px`
- `ReadingMode.jsx:4795` — `11px` (toggle switch — muhtemelen kasıtlı yarım pill)
- `ReadingMode.jsx:5126, 4961, 5502, 10610` — `5px`, `3px`, `2px`

**Beklenen (§tokens.js RADIUS scale):** `xs (4) / sm (6) / md (8) / chip (10) / lg (12) / xl (14) / pillSm (20) / pill (999) / full (50%)`.
**Öneri:** `2px` → `RADIUS.xs` (4px, marjinal boyut farkı görünmez); `3px` → `RADIUS.xs`; `5px` → `RADIUS.sm`; `11px` → 10 veya 12 (toggle için `pill` kullan).
**Etki:** Kart/pill/badge tutarlılığı için gerekli — off-scale değerler drift'in habercisi.

---

## 5. COMPONENT DENGESİ

### 🟠 O-09 · İbadetler HUB — Yolculuk Önerileri kartlarında emoji ikonları (🌱, 🧭, ⚖)
**Dosya:** `next/public/ibadetler/hub.json:544, 582, 620` + `next/src/components/IbadetlerHub.jsx:526`
**Sorun:** Kartlarda "İlk Defa Gezenler 🌱", "Kavram Çalışan 🧭", "Fıkıh Çalışan ⚖" ikonları emoji rendering — OS-bağımlı, iOS'ta renkli-emoji, Chromium Linux'ta line-icon fallback.
**Kanıt:** `docs/screenshots/2026-07-12/ibadetler-hub-tr-mobile.png` — 🌱 yeşil emoji.
**Beklenen (site brand):** Cinematic, sükunetli, minimalist codex tonuna emoji'ler tarz-aykırı. SVG line-icon (24×24, gold stroke) kullanmak brand ile uyumlu olur.
**Öneri:** `IbadetlerHub.jsx`'da inline SVG icon library, veya `data.iconType: 'sprout' | 'compass' | 'scale'` → JSX ikonlarına map.

---

### 🟠 O-10 · Anasayfa 3 cluster (Nereden Başlamak) kartları — sayı badge'i tutarsız kontrast
**Kanıt:** `docs/screenshots/2026-07-12/home-tr-desktop-scroll-02.png` — "BAP 01 / 02 / 03" küçük gold label. Kart üstünde kişilik ikonu (kitap, ışık, kalp) — 3 kartın yüksekliği farklı (kart 2 en uzun, kart 1 en kısa).
**Sorun:** 3'lü grid'in yüksekliği sabit değil, kartlar farklı içerik uzunluğuyla balanced grid görünümü bozuluyor.
**Beklenen:** CSS grid `align-items: stretch` (defaultta böyle) — ama içerik `flex-column` + `justify-content: space-between` ile CTA'lar aynı hizada. Hâlâ görsel farklılık az ise `min-height: 320px` gibi hard-set gerekebilir.

---

### 🟡 M-06 · EsmaFrekans mobil — "Celal / Cemal" kartlarında sağ overflow
**Kanıt:** `docs/screenshots/2026-07-12/esma-frekans-mobile-scroll-04.png` — "Cemal" kart sağ kenarı viewport dışına 12-20px taşmış.
**Neden:** Kartın padding + width hesabı 390px viewport'a sığmamış.
**Öneri:** Kartın parent'ında `overflow-x: hidden` + kart genişliği `100%` — inline stil kontrolü.

---

## 6. HOVER / FOCUS / ANİMASYON

### 🟡 M-07 · CTA gradient duplikasyonu — `.btn-primary-gold` sınıfı varken inline gradient
**Dosya:** `next/src/components/Navbar.jsx:1785`, `next/src/sections/Conclusion.jsx:185`
```js
background: 'linear-gradient(135deg, #c9973a 0%, #b8860b 60%, #9a6f0a 100%)',
```
**Sorun:** globals.css'te `.btn-primary-gold` class tanımlı (tokens.js `btnGoldStart/Mid/End` variable'ları ile). Bu 2 nokta inline yazılmış — CSS class'ı kullanmıyor. Gradient renk değişimi 3 yerde birden gerekir.
**Öneri:** İki call-site'ı `className="btn-primary-gold"` ile değiştir, inline gradient sil.

---

### 🟡 M-08 · Dev-mode `scroll-behavior: smooth` uyarısı — Next.js issue counter'da görünen "1 Issue"
**Kanıt:** `docs/screenshots/2026-07-12/ibadetler-namaz-ana-ayetler-tab.png` — sol-altta "1 Issue" kırmızı badge.
**Log:** `[browser] Detected 'scroll-behavior: smooth' on the '<html>' element. To disable smooth scrolling during route transitions, add 'data-scroll-behavior="smooth"' to your <html> element.`
**Sorun:** Next.js 16 Turbopack dev-only uyarısı — production build'de zararsız ama dev deneyimini kirletiyor.
**Öneri:** `next/src/app/layout.js`'te root `<html>` element'ine `data-scroll-behavior="smooth"` ekle.

---

## 7. RESPONSIVE / MOBİL

### 🔴 K-03 · Anasayfa mobil: dev-server Fast Refresh'ten sonra hero'da harflerin (ك, ی, ل) etrafta serpili görünmesi
**Kanıt:** `docs/screenshots/2026-07-12/home-tr-mobile.png` — bismillah etrafında bağımsız Arap harfleri "ك" (0.4 opacity), "ي" — bu **HeroGeometricBackground** animasyonu, yeterince opaque (`0.4-0.5`) render oluyor ve mobilde Bismillah'ın etrafındaki dekoratif sessizliği bozuyor.
**Beklenen (§4 Cinematic vision):** Bg-pattern opacity 3-5% (CLAUDE.md §4 "Visual Elements").
**Öneri:** `HeroGeometricBackground.jsx`'ta harflerin CSS opacity'sini 0.08–0.10 arasına al; mobil'de daha da düşür (0.05).
**Etki:** Anasayfa ilk izlenim — cinematic wow anını korumak için kritik.

---

### 🟠 O-11 · Ana masaüstünde homepage başlangıç viewport'unda çok fazla dark alan — hero altında 3 cluster'a inmek uzun scroll
**Kanıt:** `docs/screenshots/2026-07-12/home-tr-desktop.png` (2400x900 civarı 25 screenshot).
**Sorun:** Toplam scroll height ~20,700px (14 kart + 3 cluster + Hero + SixGates + ToolsHighlight + Conclusion + Footer). Bu sayfa yüksekliği kabul edilebilir ama Hero'dan sonra "Nereden Başlamak" cluster'ına 1-1.5 viewport devam etmek gerekiyor — arada boş dark alan.
**Öneri:** Hero'dan "DEVAM" CTA'ya scroll snap veya kaldır. Alternatif olarak Hero yüksekliği `100vh` yerine `85vh` yap — cluster hint viewport altında görülür.

---

### 🟡 M-09 · İbadetler HUB mobilde ilk yükleme — ToolHeader "İbadetlerin Kur'ânî Mimarisi · KULLUĞUN SEKİZ SÜTUNU" text overflow, sağdan kırpılıyor
**Kanıt:** `docs/screenshots/2026-07-12/ibadetler-hub-tr-mobile.png` — üstte "KULLUĞUN SEKİZ SÜT..." kırpılıyor.
**Sorun:** ToolHeader inner `flex` container `overflow: hidden; text-overflow: ellipsis` uyguluyor ama title uzun olduğunda subtitle'a hiç yer kalmıyor.
**Öneri:** Mobil'de subtitle gizle (K-02 ile aynı fix) veya subtitle'ı title altına yeni satıra al.

---

## 8. ARAPÇA / RTL ÖZEL SORUNLAR

### 🟢 (Sorun yok) — Arapça encoding standardı korunuyor
- `verse-graph-bgem3.json` + `esma-*.json` + `ibadetler/*.json` — hepsi §13.15 uyumlu.
- `dir="rtl"` ve `lang="ar"` attribute'ler tarama edilen tüm ayet blocklarında mevcut.
- Bismillah `﷽` U+FDFD ligature 14+ komponentte doğru render — sadece font-family syntax (§O-06) düzeltilecek.
- KFGQPC + Amiri Quran fallback zinciri her yerde.
- Maddah render fix (§13.14 `[ً-ْ]ٓ`) `arabic.js` util'inde mevcut.

---

### 🟡 M-10 · `KuranRenkleri.jsx:2681` — Bismillah'ta KFGQPC olmadan `"'Amiri Quran', 'Amiri', serif"`
**Dosya:** `next/src/components/KuranRenkleri.jsx:2681`
**Sorun:** Yorumda §13.2 istisnası olarak documented (KFGQPC ligature'u içermez). OK. Sadece — burada nettifikasyon: neden diğer 10+ komponentte `'Amiri Quran, serif'` (M-06) yerine bu tam pattern kullanılmamış? Tutarlılık için `FONTS.bismillah` token'ı önerisi (O-07) devreye alınırsa 12 nokta tek satırda hallolur.

---

## 9. Ellipsis & Text Fix'i (M-01 audit'inden drift)

### 🟠 O-12 · `Yükleniyor...` / `Loading...` — 3 komponentte hala 3 nokta
**Dosyalar:**
- `next/src/components/VerseGraph.jsx:2694` — `'Harita yükleniyor...' : 'Loading map...'`
- `next/src/components/ReadingMode.jsx:4880` — `'Meal yükleniyor...' : 'Loading…'` (EN düzeltilmiş, TR unutulmuş!)
- `next/src/components/FurukAtlasi.jsx:1035` — `'Ayet yükleniyor...' : 'Loading verse...'`

### 🟠 O-13 · Search placeholder'lar 3 nokta — 9 yer
**Dosyalar:** `VerseGraph.jsx:1062, 2350` (2×), `WordHeatmap.jsx:764`, `DogaAtlasi.jsx:872, 924` (2×), `DuaVerses.jsx:440`, `ToolsBrowser.jsx:229`, `WowFacts.jsx:1245`, `SebebiNuzul.jsx:1383`.
**Öneri:** Tek tarama ile `sed -i 's/\.\.\.\(["'\'']\)/\1/'` **YAPILAMAZ** — kod içi spread operator karışır. Manuel edit gerekiyor:
```jsx
// Örnek:
placeholder={language === 'tr' ? 'Ayet veya dua ara…' : 'Search verses or supplications…'}
```
**Etki:** Site-wide typographic consistency. Site brand cinematic + typographic hassasiyet iddia ediyor — `...` yerine `…` unicode single-glyph farkı görsel finesse için önemli.

### 🟠 O-14 · `Navbar.jsx:625, 626` — dinamik dua count fallback `'...'`
**Dosya:** `next/src/components/Navbar.jsx:625–626`
```jsx
descTr: `Kur'an'dan ${duaCount ?? '...'} seçilmiş dua`,
descEn: `${duaCount ?? '...'} selected supplications from the Quran`,
```
**Öneri:** `?? '…'` (unicode).

---

## 10. TR/EN Çeviri Tutarsızlığı

### 🟠 O-15 · Navbar "Tefekkür" EN'de de "Tefekkür" — çeviri yok
**Dosya:** `next/src/components/Navbar.jsx:1199, 1930`
```jsx
{language === 'tr' ? 'Tefekkür' : 'Tefekkür'}
```
**Sorun:** İki durum da aynı. "Esmâ-i Hüsnâ" → "The Beautiful Names" çevrilmiş, "Keşfet" → "Discover" çevrilmiş, "Araçlar" → "Tools" çevrilmiş. Ama Tefekkür bilinçli olarak korunmuş mu? Global memory'de "İbadet terim locale-aware — Zikr → Dhikr, Rükû → Rukūʿ" prensibi belirtilmiş — Tefekkür de aynı prensiple **"Tafakkur"** transliteration olabilir, veya "Reflections" olabilir.
**Öneri:** "Reflections" (İngilizce muadili) veya "Tafakkur" (transliteration + subtitle "Reflection" tooltip). Kullanıcı tercihi.
**Etki:** EN kullanıcısı Navbar'da Türkçe kelime görüyor — brand tutarlılığı bozuk.

---

## GENEL DEĞERLENDİRME

### En güçlü alanlar
1. **Cinematic Hero pattern (§13.18)** — 4/5 tool sayfasında (renkler, dualar, hub, pillar) tam korunmuş; EsmaFrekans kendi flagship'ine sadık.
2. **Sticky tab bar (§13.19)** — 10 komponentte `rgb(6, 8, 14)` opaque, `top: 110px`, `zIndex: 20`, `isolation: isolate` normalize edilmiş. Önceki batch'lerdeki transparan drift çözülmüş — regression yok.
3. **ToolHeader (§13.17)** — 20+ tool sayfasında tutarlı; modal-style header YOK.
4. **Design token dosyası (tokens.js)** — 100+ satır kapsamlı; COLORS, FONTS, RADIUS, Z_INDEX, BLUR, TRANSITION, BREAKPOINT'ler net. Sadece kullanım disiplini bazı komponentlerde kaymış.
5. **Anasayfa Cinematic + 14 kart pattern** — SixGates 3-cluster, Öne Çıkanlar, ToolsHighlight, Conclusion tutarlı Playfair + KFGQPC + Inter zincirini koruyor.
6. **Mobil section chip nav (MobileSectionChipNav)** — akıcı, gold-glow indicator + dot separator etkileyici.

### En zayıf alanlar
1. **KuranRenkleri.jsx içinde ham hex enflasyonu (60+)** — kompleks bir tool ama tek dosyada 60 farklı raw hex → maintenance debt. Bu tool'a özel `KURANI_COLORS` token bloğu şart.
2. **Ellipsis drift (`...` vs `…`)** — 12+ noktada `...` hala mevcut. M-01 fix'inden sonra drift.
3. **Font family literal drift** — 26 nokta `"'KFGQPC', 'Amiri Quran', serif"` literal ile FONTS.quran atlıyor. Deprecated Vite-era pattern kalıntısı.
4. **TR/EN Tefekkür çevrilmemiş** — brand tutarlılığı için 2 satırlık fix.
5. **Escape'li tırnak bug (K-01)** — 2 yerde `\"` görünür render.
6. **Mobil ToolHeader'da subtitle overflow / hero eyebrow duplicate (K-02)** — bir batch işi.

### Aksiyon önceliği (2 gün tahmini)

| Ciddiyet | ID | Aksiyon | Efor |
|---|---|---|---|
| 🔴 | K-01 | KuranRenkleri.jsx:3053, 3073 — `\"` → `"` | 2 dk |
| 🔴 | K-02 | ToolHeader.jsx — mobil'de subtitle gizle | 15 dk |
| 🔴 | K-03 | HeroGeometricBackground opacity 0.4 → 0.08 (mobil 0.05) | 10 dk |
| 🟠 | O-15 | Navbar Tefekkür EN çevirisi (`'Reflections'` veya `'Tafakkur'`) | 5 dk |
| 🟠 | O-12+O-13+O-14 | Ellipsis fix — `Yükleniyor...` → `Yükleniyor…`, search placeholders, Navbar `??` fallback | 30 dk |
| 🟠 | O-06 + O-07 | `FONTS.bismillah` token ekle + 12 komponentte swap | 30 dk |
| 🟠 | O-01 | `KURANI_COLORS` token bloğu + KuranRenkleri.jsx swap | 90 dk |
| 🟠 | O-02 + O-03 + O-05 | QuranDua/QuranRhetoric/TefekkurHighlight — token import + swap | 60 dk |
| 🟠 | O-04 | HiddenArchitecture RAY_COLORS → token | 15 dk |
| 🟠 | O-08 | Namaz tab click → scroll below hero | 20 dk |
| 🟠 | O-09 | Yolculuk kart emoji → SVG line-icon | 45 dk |
| 🟠 | O-10 | Cluster kart minHeight | 10 dk |
| 🟠 | O-11 | Hero mobile 85vh + spacing | 15 dk |
| 🟡 | M-01 → M-10 | Toplam ~2 saat mikro-fix'ler | 120 dk |

**Toplam:** ~7 saat (bir çalışma günü + buffer).

---

## Screenshotlar

`docs/screenshots/2026-07-12/`:
- **Desktop (1440×900)** — 6 route × 2 dil × 2 tam-sayfa = 24 base + 60+ scroll = 84 dosya
- **Mobile (390×844)** — 6 route × 2 dil = 12 base + 30+ scroll = 42+ dosya
- **Odaklı** — `ibadetler-namaz-tabbar-detail.png`, `esma-frekans-mobile-scroll-*.png`, `renkler-mobile-palet-*.png`

**Referans en bulgu-yoğun screenshotlar:**
- Escape bug: `renkler-tr-desktop-scroll-04.png`
- Mobil hero pattern: `esma-frekans-tr-mobile.png` (iyi örnek), `home-tr-mobile.png` (K-03 opaklık sorunu)
- Sticky tab bar hero yeme: `ibadetler-namaz-ana-ayetler-tab.png`
- Renk paleti fazlalığı: `renkler-tr-desktop-scroll-01.png`, `renkler-mobile-scroll-02.png`
- ToolHeader mobil overflow: `ibadetler-hub-tr-mobile.png` (K-02 + M-09)
- EN Navbar Tefekkür: `home-en-desktop.png`, `esma-frekans-en-desktop.png`
