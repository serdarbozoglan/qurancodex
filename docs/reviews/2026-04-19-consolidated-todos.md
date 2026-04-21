# QuranCodex — Birleşik Bulgular ve TODO Listesi
**Tarih:** 2026-04-19 · **Son güncelleme:** 2026-04-20
**Kaynak raporlar:** `2026-04-19-content-review.md`, `2026-04-19-consistency-ux-review.md`, `2026-04-19-visual-review.md`
**Toplam bulgu:** 98 (27 kritik, 45 orta, 26 minör)

> **Format:** Her item `[ ] [Kaynak#No] Başlık` — işaretleme için kutu, kaynak raporu ve orijinal numara referansı.
> **Efor:** 🟢 ≤30dk · 🟡 30dk-2h · 🔴 2h+

---

## 📊 İLERLEME DURUMU

| Faz | Durum | İşlenen / Toplam |
|---|---|---|
| **Faz 0** — Hızlı kazançlar | ✅ Tamamlandı | 8/8 |
| **Faz 1** — İçerik doğruluğu | ✅ Tamamlandı | 27/31 (büyük çoğunluğu) |
| Faz 2 — Design System | ⏸ Bekliyor | 0/17 |
| Faz 3 — Overlay standardization | ⏸ Bekliyor | 0/9 |
| Faz 4 — Mobil uyum | ⏸ Bekliyor | 0/5 |
| Faz 5 — Erişilebilirlik | ⏸ Bekliyor | 0/7 |
| Faz 6 — i18n & DRY | ⏸ Bekliyor | 0/4 |
| Faz 7 — Arapça/encoding | ⏸ Bekliyor | 0/5 |
| Faz 8 — Fonksiyonellik | 🟡 Kısmen | 1/5 |
| Faz 9 — Görsel nüans | ⏸ Bekliyor | 0/6 |

**Toplam ilerleme:** 36/98 (~%37) · **Canlı ana sayfa içeriği akademik olarak savunulabilir durumda.**

**Bonus (TODO dışı yapılan):**
- `src/sections/MathMiracle.jsx` silindi (ölü kod, 355 satır)
- `nav.math` i18n key'i temizlendi
- `docs/reviews/2026-04-19-leeds-verification.md` (10 iddia doğrulama)
- 3 yeni agent tanımı (`qc-content-producer`, `qc-source-curator`, `qc-visual-director`)
- `tokens.js`'e `softGold` + alpha variantları eklendi
- `tokens.js`'e `VERSE_DISPLAY_CARD` eklendi

---

## 🔥 FAZ 0 — HIZLI KAZANÇLAR (aynı gün bitirilebilir)

Küçük ama belirgin etki sağlayan trivial düzeltmeler.

- [x] 🟢 **[UX K6]** `QuranCommands.jsx` zIndex 200 → 9999 (§13.3). Navbar ile çakışma bitecek.
- [x] 🟢 **[UX O11]** Navbar CTA yüksekliği 34px → 32px (`Navbar.jsx:981`, §13.13)
- [x] 🟢 **[UX O12]** "Visualisation" → "Visualization" (`Navbar.jsx:933` imla tutarlılığı)
- [x] 🟢 **[UX K14]** `AddresseeSystem` overlay'ine Escape handler ekle (§13.3 zorunlu)
- [x] 🟢 **[UX K15]** `Navbar.jsx:465-473` Mesel backref null cleanup ekle (popstate çakışması)
- [x] 🟢 **[Content M26]** Ahiret çifti kaldırıldı (`src/i18n/tr.json:34-41`)
- [x] 🟢 **[Content 27]** Rum 30:2-4 → 30:1-4 (Elif-Lâm-Mîm dahil)
- [x] 🟢 **[UX M23]** `HiddenSymmetry.jsx` orphan — silindi (onay alındı)

---

## 📚 FAZ 1 — İÇERİK DOĞRULUĞU (Akademik kredibilite)

Sayısal Mucize bölümü en kritik. 7 kritik hata yayın öncesi çözülmeli.

### Kritik Sayısal İddialar (Leeds Korpusu ile doğrulanmıyor)
- [x] 🔴 **[Content K1]** ✅ MathMiracle.jsx silindi (ölü kod) — 145/145, 115/115, 365, 12, 32/13 iddiaları tamamen kaldırıldı
- [x] 🔴 **[Content K2]** ✅ Faz 0'da çift kaldırıldı + MathMiracle silindi
- [x] 🔴 **[Content K3]** ✅ MathMiracle silindiği için otomatik çözüldü
- [x] 🔴 **[Content K4]** ✅ seaLand bloğu MathMiracle ile birlikte silindi
- [x] 🟡 **[Content K5]** LinguisticDNA: "%70 harf kapsama" → "%25 sûre oranı" (29/114). Intro revize edildi
- [x] 🟡 **[Content K6]** LivingPreservation: 10M+ hafız sayacı kaldırıldı; "milyonlarca, 3-10M tahmin" qualitative ifade
- [x] 🟡 **[Content K7]** "Varyasyon: sıfır" → "Konsonant iskelet (rasm) harf harf aynı"; on kanonik kıraat nüansı eklendi

### Kaynaksız/Tartışmalı İddialar
- [x] 🟢 **[Content 8]** "10.000'de 1 olasılık" kaldırıldı — yerine "Leeds Korpusu ile doğrulandı"
- [x] 🟡 **[Content 9]** "Bu tutarlılık tesadüf olamaz" → baseline bilgili nüans ("Kur'ân genelinde daha nadirdir; bu yoğunluk dikkat çekicidir")
- [x] 🟢 **[Content 10]** `totalQuestions: 1000` → 1290 + note. Navbar / KuranRetorigi / QuranRhetoric / donut chart (1200+) güncellendi
- [x] 🟢 **[Content 11]** Necm 62 ayet: Arap kaside geleneği kabul edildi, "katı vezin gerektirmeden" nüansı
- [x] 🟢 **[Content 12]** Duhâ "11 ayetin ilk 8'i" + son 3 ayette ses değişikliği/anlam kırılması açıklaması
- [x] 🟡 **[Content 13]** Farrin %70 — HiddenArchitecture'de zaten "Academic Citation Card (replaces 70% stat)" yapılmış; WowFacts'te "pek çok sûre" nüansı
- [x] 🟡 **[Content 14]** SoundArchitecture: "Bu gösterim sezgisel temsil, kesin dilbilimsel ölçüm değil" disclaimer zaten mevcut
- [x] 🟢 **[Content 15]** Fe-57 = Hadid 57 örtüşme iddiası fact list'ten kaldırıldı
- [x] 🟢 **[Content 16]** Haman: "doğrulandı" → "tartışmalı dilbilimsel paralellik"; subtitle, points, significance tutarlı hale getirildi
- [x] 🟢 **[Content 17]** Firavun tuz kristalleri faktası listeden kaldırıldı
- [x] 🟢 **[Content 18]** Nûh 950 yıl: "kavmi arasında kaldı (lafzen)" + klasik tefsirin tebliğ yorumu notu (WowFacts + KavimlerAtlasi TR/EN)

### Nüans/Minör
- [x] 🟢 **[Content 19]** Muhammed/Ahmed: Saff 61:6 + "klasik tefsir görüşü" etiketi eklendi
- [x] 🟢 **[Content 20]** Musa 136 kez: Leeds Üniversitesi Kur'ân Korpusu kaynağı eklendi
- [x] 🟢 **[Content 21]** Zemahşeri "— parafraz" etiketi mevcut; Şafi'i quote (Beyhaki) kaynaklı
- [x] 🟢 **[Content 22]** Birmingham: "parşömen tarihi, mürekkep sonradır, ayrıca analiz edilmemiştir" notu eklendi
- [x] 🟢 **[Content 23]** Ashab-ı Kehf: "tam 309" → "≈ 309.017 (~6 gün fark)"
- [x] 🟢 **[Content 24]** 14 secde: Hanefî (tümü vâcip) vs Şâfi'î/Mâlikî/Hanbelî (genelde sünnet) ayrımı eklendi
- [x] 🟡 **[Content 25]** Neml 27:30: Hz. Süleyman'ın Belkıs'a mektubu bağlamı + "alıntı formunda, kur'ânî açılış değil" nüansı

### Tartışmalı İfadeler (Çoklu görüş var)
- [x] 🟡 **[Content 28]** Alaka: "doğrular, Galen'i değil" → "modern embriyolojik kronoloji ile uyum dikkat çekicidir; doğrulama mı paralellik mi tartışmaya açık"
- [x] 🟡 **[Content 29]** Kalp: "fiziksel organ değil" → "sadece fiziksel organ değil" + intrinsic cardiac nervous system nüansı
- [ ] 🟡 **[Content 30]** Freud vs Kur'an nefis — çağdaş yorumlama olarak çerçevele (henüz yapılmadı)
- [x] 🟡 **[Content 31]** Maslow: "İslam 1400 yıl önce" → "tasavvufta fenâ kavramı anlamlı paralellik taşır"

### Eksik Kaynak / Zayıf Kanıt
- [x] 🟡 **[Content 32]** surah-info.json: 3 büyük sûrenin (Yâsîn, Vâkıa, Mülk) fadail'i zaten sıhhat etiketi içeriyor; diğer 111 sûre için daha geniş pass gerekir (Faz dışı)
- [ ] 🟡 **[Content 33]** `kavimler.json` `hasArchaeology: true` — arkeolojik kaynak ekle (büyük araştırma, Faz dışı)
- [ ] 🟢 **[Content 34]** `melekler.json` alternateNames — "tefsir görüşü" ibaresini netleştir (henüz yapılmadı)
- [x] 🟢 **[Content 35]** "Edna el-ard": significance yeniden yazıldı — criticalNote ile tutarlı, çelişki giderildi

---

## 🎨 FAZ 2 — DESIGN SYSTEM & TOKEN MIGRATION

Visual + UX raporların ortak ana konusu. 910 hex + 1.795 rgba + 14 farklı borderRadius.

### Tek Kaynak İlkesi
- [ ] 🔴 **[Visual K-1]** `index.css` paletini `tokens.js` ile senkronla (veya tokens.js'i CSS değişkenlerinden türet) — cosmicBlack `#0a0a1a` vs `#080a1e` drift'i düzelt
- [ ] 🔴 **[Visual K-2]** Palet dışı `#c9a96e` altını — tek altın tonuna indir (`COLORS.gold`), 10+ dosyayı migrate et
- [ ] 🔴 **[Visual K-3]** `ProphetAtlas.jsx` (3000+ satır) token import YOK — tüm dosyayı tokenize et
- [ ] 🔴 **[Visual K-4]** `PsychologySection.jsx` bağımsız 10 renk paleti — tokens.js üzerinden kur

### Token Skaları Ekle
- [ ] 🟡 **[Visual K-24]** `RADIUS = { xs:4, sm:6, md:8, lg:12, xl:14, pill:999 }` tokenı ekle — 577 inline borderRadius'u normalize et
- [ ] 🟡 **[Visual K-28]** `Z_INDEX` skalası: `overlayBase:9999, popup:10000, tooltip:10001, nav:10002`
- [ ] 🟡 **[Visual K-39]** `BLUR` skalası: `sm:8, md:20, lg:24` — 5 farklı blur değerini normalize et
- [ ] 🟢 **[Visual O-34]** `TRANSITION = { fast:0.15s, base:0.2s, slow:0.3s }` tokenı
- [ ] 🟡 **[Visual O-26]** `BORDER_GOLD_SOFT`, `BORDER_GOLD` composite tokenlar — 100+ inline border'ı normalize et

### Büyük Dosyaları Tokenize Et
- [ ] 🔴 **[UX K1]** Top 10 component'te token migration — `VerseGraph` (166 hex), `ReadingMode` (69), `CennetCehennem` (61), `Melekler` (67), `SurahComparator` (60), `KuranRenkleri` (51), `ProphetAtlas`, `HumanDefinition`, `QuranCommands`, `Navbar`
- [ ] 🟡 **[Visual O-5]** `QuranCommands.jsx:109/171` ham `#0d1b2a` → `COLORS.deepNavy`
- [ ] 🟡 **[Visual O-6]** `VerseGraph.jsx` 4 farklı overlay dark hex → `COLORS.overlayBg`
- [ ] 🟡 **[Visual O-7]** `VerseGraph.jsx` palet dışı altın-sarılar (`#f0c860`, `#e8c98a`, `#d4b483`, `#fff8ee`) → tek altın + alpha
- [ ] 🟡 **[Visual O-8]** `SurahComparator.jsx` slate skalası (`#475569`, `#334155`, `#1e293b`, `#cbd5e1`) → `tokens.js`'e slate skalası ekle
- [ ] 🟡 **[Visual O-9]** `HumanDefinition.jsx` modal tokenize + 4 kategori rengini `COLORS` üzerinden türet
- [ ] 🟡 **[Visual O-10]** Section-local palette tekrarları: `LivingPreservation`, `HiddenArchitecture`, `ZeroRedundancy`, `QuranDua`, `QuranRhetoric` — alpha variantları tokenize
- [ ] 🟢 **[Visual M-11]** `KuranRenkleri.jsx:64-71` karışık token + ham hex — tam tokenize et
- [ ] 🟢 **[Visual M-20]** `'#fff'` ham beyaz → `COLORS.offWhite` (`QuranCommands`, `KissaAtlas`)

### VERSE_DISPLAY_CARD Yayma
- [ ] 🟡 **[Visual O-27]** VERSE_DISPLAY_CARD tokeni 25+ ayet kutusuna yay (`QuranVerse`, `ReadingMode`, `KissaAtlas`, `ProphetAtlas` ayet tooltip vs.)

---

## 🪟 FAZ 3 — OVERLAY STANDARTLAŞTIRMA

27 overlay var. §13.3, §13.10, §13.11 kuralları ihlal ediliyor.

### CLOSE_BTN Migration (§13.11)
- [ ] 🟡 **[UX K4 + Visual K-25]** `VerseGraph.jsx` 3 inline close (1113, 1878, 2337) → `{...CLOSE_BTN}`
- [ ] 🟡 **[UX K4]** `ReadingMode.jsx:1494` desktop `'✕'` text karakter → SVG + `CLOSE_BTN`
- [ ] 🟡 **[UX K4]** `QuranCommands.jsx:176-193` inline close → `CLOSE_BTN`
- [ ] 🟢 **[UX K4]** `HumanDefinition.jsx:407` ✕ text → SVG + `CLOSE_BTN`
- [ ] 🟢 **[UX K4]** `Navbar.jsx:1272-1296` ProphetAtlas wrapper close → `CLOSE_BTN`
- [ ] 🟢 **[UX O33]** Navbar mobile menu 40x40 close → `CLOSE_BTN` (36x36) veya `CLOSE_BTN_LG` tanımla

### OVERLAY_TITLE Migration (§13.10)
- [ ] 🟡 **[UX K5]** `VerseGraph`, `ReadingMode`, `QuranCommands`, `Navbar/ProphetAtlas` header başlıkları → `{...OVERLAY_TITLE}`

### ProphetAtlas Mimari Düzeltme
- [ ] 🔴 **[UX M13]** `ProphetAtlas.jsx` → `src/sections/` yerine `src/components/` taşı. OVERLAY_BASE + OVERLAY_HEADER pattern'ine uyumla. Navbar wrapper'ını sil (80 satır)

### Header/Padding Standartları
- [ ] 🟡 **[Visual O-21]** `OVERLAY_HEADER` tokeni (12px 20px) vs CLAUDE.md §13.3 (16px 24px) çelişkisini gider
- [ ] 🟢 **[Visual O-22]** Mobil content padding: `CONTENT_PADDING_MOBILE` + `CONTENT_PADDING_DESKTOP` composite tokens

---

## 📱 FAZ 4 — MOBİL UYUM

§14.1 kural: `< 640`. Karışık kullanım.

### Breakpoint Düzeltmesi
- [ ] 🟡 **[UX O7 + Visual K-36]** 8 dosyada `< 768` → `< 640` düzeltmesi:
  - `CennetCehennem.jsx:147`
  - `KuranYeminleri.jsx:34`
  - `ZamanBoyutlari.jsx:383`
  - `QuranCommands.jsx:84`
  - `FurukAtlasi.jsx:100`
  - `Melekler.jsx:951`
  - `ToolsBrowser.jsx:54`
  - `sections/PathCards.jsx:118`
- [ ] 🟢 **[Tokens]** `tokens.js`'e `BREAKPOINT_MOBILE = 640` sabit ekle

### Mobile Awareness Eksik (§14.1)
- [ ] 🔴 **[UX O25 + Visual O-37]** `VerseGraph`, `ConceptGraph`, `WordHeatmap`, `EsmaFrekans`, `RevelationTimeline`, `DuaVerses`, `WowFacts` — `isMobile` state + responsive layout ekle
- [ ] 🟡 **[UX K32]** `VerseGraph.jsx:1470` 480px fixed sidebar mobilde overflow — collapse/hide pattern
- [ ] 🟡 **[Visual O-30]** `ConceptGraph.jsx` (260px) ve `Melekler.jsx` (280px) sabit sidebar mobilde overflow — `isMobile ? 'none'`

---

## ♿ FAZ 5 — ERİŞİLEBİLİRLİK

27 overlay, çoğu accessibility standartlarını karşılamıyor.

### ARIA & Role
- [ ] 🟡 **[UX K16]** 20 overlay'e `role="dialog" aria-modal="true" aria-labelledby="..."` ekle (VerseGraph, ReadingMode, QuranCommands, AddresseeSystem, ConceptGraph, KissaAtlas, SurahComparator, DogaAtlasi, KavimlerAtlasi, CennetCehennem, KuranRetorigi, KuranYeminleri, KiraatAtlasi, MeselAtlasi, WowFacts, WordHeatmap, RevelationTimeline, DuaVerses, ZamanBoyutlari, ProphetAtlas)

### Body Scroll Lock
- [ ] 🟡 **[UX K17]** `src/hooks/useBodyScrollLock.js` utility oluştur + 24 overlay'e uygula

### Focus Management
- [ ] 🟡 **[UX M26]** Focus trap — `react-focus-lock` veya manuel implementasyon, tüm overlay'lere
- [ ] 🟡 **[UX M28]** Overlay açılışta otomatik close butonuna focus (27 overlay)
- [ ] 🟢 **[UX O31]** Navbar dropdown Escape ile kapansın (mousedown + Escape handler)
- [ ] 🟢 **[Visual O-32]** `:focus-visible` dropdown/kart-buton/tab/chip için özelleştir

### Reduced Motion
- [ ] 🟡 **[UX M27 + Visual O-33]** `useReducedMotion` hook — framer-motion animasyonlarını reduce et (AnimatedCounter, BesmeleWidget, VerseGraph 3D, stagger animations)

### Arapça Dil Desteği
- [ ] 🟡 **[UX K30 + Visual O-44]** `<span dir="rtl" lang="ar">` tutarlı kullanımı — `<ArabicText>` utility component oluştur, 28 dosyada normalize et. Özellikle: `SurahComparator` (212, 313, 832, 879), `ConceptGraph:473`, `HumanDefinition` (Arapça kelimeler `<span>` içinde değil)

---

## 🌐 FAZ 6 — i18n & KOD TEKRARI

997 hardcoded ternary, 10+ cleanArabic kopya, 12 SURAH_NAMES kopya.

### i18n Migration
- [ ] 🔴 **[UX O8]** 997+ hardcoded `language === 'tr' ? ... : ...` → `t()` helper'a migrate. En azından overlay başlıkları ve tab etiketleri. Öncelik: `ReadingMode` (92), `SebebiNuzul` (82), `KiraatAtlasi` (75), `KavimlerAtlasi` (69), `VerseGraph` (69), `KiyametSahneleri` (70)
- [ ] 🟡 **[UX O10]** `src/i18n/en.json` ayet referansları karışık — tek transliterasyon sistemi (IJMES). `SURAH_NAMES_EN_TRANSLIT` array ekle

### cleanArabic Canonical
- [ ] 🔴 **[UX K3 + Visual O-43]** `src/utils/arabic.js` — tek canonical `cleanArabic()`. 10+ kopyayı sil: `ReadingMode`, `WordHeatmap`, `VerseGraph`, `ConceptGraph`, `KissaAtlas`, `KiraatAtlasi`, `DiyalogAgi`, `MeselAtlasi`, `SebebiNuzul`, `FurukAtlasi`, `InterlinearView`, `ProphetAtlas`. §13.15 Uthmani kasra kuralını doğru uygula (korunur, dönüştürülmez)

### SURAH_NAMES Canonical
- [ ] 🟡 **[UX O9]** `src/utils/surahNames.js` canonical — 12 kopya sil. İmla tutarsızlıkları gider (Mü'min vs Ğâfir, El-Fatiha vs El-Fâtiha)

### i18n Meta/ID
- [ ] 🟢 **[UX M35]** `id` alanları TR ve EN'de duplike — shared config veya sadece tr.json'dan al

---

## 🔤 FAZ 7 — ARAPÇA / ENCODING

§13.15 KRİTİK ihlaller.

### Uthmani Encoding Sızıntıları
- [ ] 🔴 **[Visual K-42]** `HiddenArchitecture.jsx`, `ProphetAtlas.jsx`, `KiraatAtlasi.jsx` — JSX string literal'lerindeki `ٱ` (U+0671), `ۡ` (U+06E1) karakterlerini script ile normalize et. Fatiha, Âyetel Kürsî, Meryem 4-6, peygamber duaları.

### Font Kuralı (§13.2)
- [ ] 🟡 **[Visual K-13]** Kur'ânî metinlerde `'Amiri', serif` → `FONTS.quran`: `ConceptGraph:473, 574`, `SurahComparator:212/313/832/879`, `KissaAtlas:367`
- [ ] 🟡 **[Visual K-14]** 20+ yerde ham `'KFGQPC', 'Amiri Quran', serif` string → `FONTS.quran`. `ReadingMode` çoklu-font zinciri için `FONTS.quranReading` ikinci token ekle
- [ ] 🟢 **[Visual K-15]** `VerseGraph.jsx:1015` tırnaksız `Playfair Display, serif` → `FONTS.display`
- [ ] 🟢 **[Visual O-16 + O-17]** Ham `'Playfair Display', serif` ve `'Inter', sans-serif` fontları → `FONTS.display` / `FONTS.body`

### Interlinear Arapça Rakamlar
- [ ] 🟢 **[Visual M-45]** `InterlinearView` ayet numara rozetleri `'Amiri'` değil `FONTS.quran` olmalı

---

## 🛠️ FAZ 8 — FONKSIYONELLİK & HATA YÖNETİMİ

### Silent Fetch Failures
- [ ] 🟡 **[UX O18]** 20+ silent `.catch(() => {})` — console.error + retry UI (DiyalogAgi pattern). Etkilenen: `VerseGraph`, `ReadingMode`, `AddresseeSystem`, `KuranYeminleri`, `FurukAtlasi`, `QuranCommands`, `KuranRetorigi`, `DogaAtlasi`, `KavimlerAtlasi`, `KiraatAtlasi`, `CennetCehennem`, `Navbar`, `ProphetMap`, `ProphetAtlas`

### Loading State / Retry
- [ ] 🟡 **[UX O24]** 6 overlay'de error state + retry butonu: `AddresseeSystem`, `KuranYeminleri`, `KuranRetorigi`, `FurukAtlasi`, `DogaAtlasi`, `CennetCehennem`

### Suspense Fallback
- [ ] 🟢 **[UX O19]** `<Suspense fallback={<OverlayLoader/>}>` — blank screen yerine spinner + "Araç yükleniyor…"

### LocalStorage Temizliği
- [ ] 🟡 **[UX O21]** VerseGraph / ReadingMode `qurancodex_graph_open`, `qurancodex_reading_open` state'i sessionStorage'a çek veya persist etme

### ChapterProgress
- [ ] 🟢 **[UX O20]** Minimize/hide butonu + `aria-label` ekle

---

## 🎭 FAZ 9 — GÖRSEL NÜANS

### Component Balance
- [ ] 🟢 **[Visual M-31]** Info butonu 3 farklı stil (`ⓘ` vs `ℹ`) — tek `<InfoIcon>` + `INFO_BTN` tokenı
- [ ] 🟢 **[Visual M-35]** Hover pattern tutarsızlığı — PathCard ailesi için tek hover scale (1.03)
- [ ] 🟢 **[Visual M-23]** Gap değerleri ritim dışı (3/5/6/7/9/11px) — 8/12/16/20/24/32 skalasına çek
- [ ] 🟢 **[Visual O-19]** Section heading `max-w-4xl` tutarsızlığı — §11'e hizala

### §11 Typography Kuralı
- [ ] 🟡 **[Visual O-18]** `HumanDefinition`, `ImpossibleRhythm`, `LinguisticDNA`, `HiddenSymmetry`, `HiddenArchitecture` — intro paragraph `max-w-2xl` → `max-w-3xl`. `mx-auto` kaldır

### Glassmorphism
- [ ] 🟡 **[Visual O-40]** `glass-card` CSS vs `GLASS_CARD` inline — tek kaynağa indir (rgba 0.04 vs 0.05 farkı)
- [ ] 🟢 **[Visual M-41]** `backdrop-filter` kullananlarda `-webkit-` prefix — Safari uyumu

---

## 📈 DURUM ÖLÇÜTLERİ (Başarı metrikleri)

Bu TODO'nun tamamlanmasıyla erişilecek hedefler:

- [ ] Ham `#xxxxxx` hex kullanımı: **1.205 → <200** (token dışı sadece SVG'ler)
- [ ] Ham `rgba()` kullanımı: **1.795 → <300**
- [ ] `borderRadius` farklı değer: **14 → 6** (xs/sm/md/lg/xl/pill)
- [ ] Tokens.js import eden dosya: **41/66 → 60+/66**
- [ ] `role="dialog"` overlay sayısı: **9/27 → 27/27**
- [ ] Body scroll lock: **3/27 → 27/27**
- [ ] Mobile awareness (isMobile state): **18/27 → 27/27**
- [ ] Breakpoint `<640` uyumu: **15/23 → 23/23**
- [ ] cleanArabic kopya: **10+ → 1 (canonical)**
- [ ] SURAH_NAMES kopya: **12 → 1 (canonical)**
- [ ] Hardcoded i18n ternary: **997 → <200** (overlay başlıkları/tab'lar hariç tam migration)
- [ ] Akademik içerik skorkuvvet: Sayısal Mucize revizyonu + 7 kritik hata düzeltmesi

---

## 📋 ÖNERİLEN UYGULAMA SIRASI (Sprint'ler)

**Sprint 1 — Hızlı kazançlar (1 gün):**
Faz 0 (tüm trivial fix'ler) + Sayısal Mucize kritik iddialarından en kötü ikisi (145/145 ve 32/13)

**Sprint 2 — İçerik doğruluğu (1 hafta):**
Faz 1 tamamı — akademik kredibiliteyi kurtarır

**Sprint 3 — Token migration foundation (1 hafta):**
Faz 2: Token skaları ekle (RADIUS, Z_INDEX, BLUR, TRANSITION) + index.css/tokens.js senkronu + ProphetAtlas + VerseGraph migration

**Sprint 4 — Overlay standardization (1 hafta):**
Faz 3 tamamı + Faz 4 breakpoint düzeltmesi

**Sprint 5 — Erişilebilirlik & DRY (2 hafta):**
Faz 5 + Faz 6 (cleanArabic canonical, SURAH_NAMES canonical)

**Sprint 6 — Encoding & nüans (1 hafta):**
Faz 7 + Faz 8 + Faz 9

**Toplam:** ~7 hafta, tek geliştirici için. 2 kişi paralel çalışırsa ~4 hafta.

---

## 🔁 Tekrar Denetim

Bu TODO'nun %80+'ı tamamlandıktan sonra 3 agent'ı tekrar çalıştır (markdown tanımları `.claude/agents/qc-*.md`'de hazır). Farkı ölç.
