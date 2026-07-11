# Esmâ-i Hüsnâ Flagship Sayfası — Tasarım Dokümanı

**Tarih:** 2026-05-31
**Branch:** main
**Etkilenen route:** `/[locale]/arac/esma-frekans/`
**Durum:** Onay bekleniyor

---

## 1. Problem ve Vizyon

### 1.1 Mevcut sayfanın durumu

Mevcut `/arac/esma-frekans/` sayfası bir **frekans aracıdır** — 99 ismi listeler, sayım gösterir, dış doğrulama linki verir. Akademik olarak doğrudur ama:

- Sitenin "Wonder → Reflection" anlatı yayına (CLAUDE.md §1) uymaz; bir araç gibi durur
- "Yet another Esma list" hissi verir; differentiator yok
- İsim başına derin içerik (anlam katmanları, kök, ayet bağlantısı) yok
- Tematik kategori, doğrudan beyanlar, flagship pasaj analizi gibi katmanlar yok

### 1.2 Yeni vizyon

Sayfa **QuranCodex'in vitrin parçası** olacak — "Allah'ın Kur'an'da kendini tanıtması" tezini görsel ve anlatısal bir deneyime dönüştüren bir bölüm. Üç kayıt:

1. **Anlatı omurgası** — Celal ↔ Cemal dengesi (Doküman 4'ün tezi)
2. **Veri omurgası** — 114 isim (Lafza-i Celâl + 99 Esmâ + Kur'ânî sıfat/tamlama)
3. **Şeffaflık omurgası** — Klasik konkordans vs yüzey-lafız metodolojik nüansının açık gösterimi

### 1.3 Sayfa ismi (karar verildi)

**Ana başlık:** ESMÂ-İ HÜSNÂ
**Alt başlık:** Allah'ın Kur'an'da Kendini Tanıtması

**İngilizce:**
**Main:** THE BEAUTIFUL NAMES
**Sub:** How God Describes Himself in the Quran

**URL:** `/arac/esma-frekans/` — değişmez (8 yerde referans, sitemap, SEO).

---

## 2. İçerik Mimarisi — 7 Section

Sayfa tek-sayfa, scroll-driven. Section'lar sırayla:

### Section 1 — Hero (Wonder)

- Bismillah ornamenti (üst)
- Şûrâ 42:11 ayetinin merkezi gösterimi: *"O'nun benzeri hiçbir şey yoktur."* — Arapça + Türkçe + ref
- Çift-katman başlık (ESMÂ-İ HÜSNÂ + alt başlık)
- 4 temel ayet kartı: A'râf 7:180, İsrâ 17:110, Tâhâ 20:8, Haşr 59:24 — hepsi *"En güzel isimler O'nundur"* der
- Kompakt sayaç şeridi: "114 isim · 6.236 âyet · 1 mimar"
- Scroll cue ("↓ keşfetmeye başla")

**Veri kaynağı:** `temel_ayetler` (JSON'da var) + Şûrâ 42:11 (sabit ayet, ayrı sabit data).

### Section 2 — Manifesto: Celal ↔ Cemal (Awe)

Doküman 4'ün tezi.

- Sol sütun: **Celal** — El-Cebbâr, El-Kahhâr, El-Müntekim, El-Azîz, El-Mütekebbir (deeper indigo accent)
- Sağ sütun: **Cemal** — Er-Rahmân, Er-Rahîm, El-Vedûd, Er-Raûf, El-Latîf (gold/emerald accent)
- Orta: tez cümlesi
- Mobilde: dikey karşıtlık (üstte Celal, altta Cemal, ortada tez)

**İçerik kaynağı:** Doküman 4'ün özet cümlesi + Doküman 1'den 7 epistemik kategori'nin kavramsal özeti.

**Editoryal karar:** Hangi ismin hangi sütuna konulduğu kararı **yapılandırılmış olarak** belirlenir. Bu uydurma değil, **açık editoryal sınıflandırma** — kullanıcıya gizlenmez. Section sonunda küçük dipnot: "Bu sınıflandırma anlatısal bir denge gösterimi için yapılmıştır; bir isim hem celal hem cemal boyutuna sahip olabilir."

### Section 3 — Üç Flagship Pasaj (Astonishment)

Üç ayet pasajı, anatomi (annotated) gösterim:

#### ① Âyetü'l-Kürsî (Bakara 2:255)
- Arapça blok (KFGQPC font, full diakritik)
- İçerdiği isimler renkli altı çizili: **Hayy · Kayyûm · Aliyy · Azîm**
- Her isim hover'da kenarda küçük kart (Arapça + okunuş + 1 satır anlam)

#### ② Haşr 59:22-24 (en yoğun isim kümesi)
- Arapça blok
- 12 isim peş peşe altı çizili: **Melik · Kuddûs · Selâm · Mü'min · Müheymin · Azîz · Cebbâr · Mütekebbir · Hâlık · Bâri' · Musavvir** (+ Rahmân, Rahîm)
- Her isim için aynı hover pattern

#### ③ İhlâs 112:1-4 (mutlak teklik)
- Arapça blok
- Negatif tanım vurgusu — "doğurmamış, doğurulmamış, dengi yok"
- Ehad + Samed isimleri vurgulu

**Veri kaynağı:** Pasaj metni Kur'an (sabit). Hangi isimlerin altı çizileceği JSON `isimler[]` ile cross-referenced — JSON'da olmayan bir isim altı çizilmez.

### Section 4 — Frekans Manzarası (Astonishment, kompakt)

- Top 20 horizontal bar chart (Allah=2699 → Vehhâb=3'e kadar)
- Allah için özel inline nüans: bar yanında küçük ⓘ ikonu — hover'da lemma açıklaması (bkz. §6)
- Altında: 114 ismin yoğunluk şeridi (SVG dot-plot, mobile-friendly)
- Renk grade'i: gold→silver, frekansa göre opacity

**Veri kaynağı:** JSON `kuranda_gecis_sayisi` (her isimde var).

**Allah özel:** Bar chart'ta gösterilen sayı **2699** (klasik, mevcut site uyumu). Ama JSON'da `1813` yazıyor; bu yüzden component-level override yapılır: Allah satırında `displayCount=2699` ve `note="lemma-based"` flag'i.

### Section 5 — Vahyin Sesi (Reflection)

Doküman 3'ün 14 tematik ekseni.

- Scroll-snap kart dizisi (mobilde swipeable, desktop'ta grid)
- Her kart: tema başlığı + 1-3 ayet (Arapça + TR + ref)
- 14 eksen:
  1. Varlığı ve Tekliği (Tâhâ 20:14, Enbiyâ 21:25, Bakara 2:163, İhlâs 112:1-4)
  2. Yakınlığı (Bakara 2:186, Kâf 50:16, Hadîd 57:4)
  3. Rahmeti ve Affı (Hicr 15:49, Zümer 39:53, Tâhâ 20:82, A'râf 7:156)
  4. Yaratıcılığı (Zâriyât 51:56, Mü'minûn 23:12-14, Enbiyâ 21:30, Yâsîn 36:82)
  5. Bilgisi (Bakara 2:29, En'âm 6:59, Mücâdele 58:7, Âl-i İmrân 3:29)
  6. Kudreti (Bakara 2:20, Mülk 67:1, Yâsîn 36:83)
  7. Adaleti (Nisâ 4:40, Kehf 18:49, Fussilet 41:46)
  8. İşitmesi ve Görmesi (Şûrâ 42:11, Mücâdele 58:1)
  9. Hayatı ve Sürekliliği (Bakara 2:255, Hadîd 57:3)
  10. Nur Oluşu (Nûr 24:35)
  11. Koruyuculuğu (Hûd 11:57, Bakara 2:257)
  12. Hükmü (Yûsuf 12:40, Âl-i İmrân 3:26)
  13. İnsanla İlişkisi (Rahmân 55:29, Bakara 2:152)
  14. Kapsamlı pasajlar (Ayetü'l-Kürsî, Haşr 59:22-24 — geri-referans)

**Veri kaynağı:** Yeni JSON dosyası `next/public/esma-beyanlari.json` (içerik Doküman 3'ten birebir).

### Section 6 — 114 İsim Atlası (Utility)

- Header: arama kutusu + 3'lü kategori filtresi (Tümü · Lafza-i Celâl · Esmâ-i Hüsnâ · Kur'ânî Sıfat) + frekans sıralama
- Liste: isim kartları (Arapça büyük + okunuş + anlam + sayı + bar)
- Tıklayınca: detay paneli (inline expand, modal değil)

#### Detay paneli içeriği

```
   ٱلْعَلِيم
   al-Alîm · El-Alîm
   ─────────────────────────────
   "Her şeyi hakkıyla bilen"
   Gizli açık her şeyi bilen

   [Kök bilgisi varsa:]
   ع ل م → bilmek · fark etmek · kesin bilgi sahibi olmak

   161 âyette geçer
   En sık geçtiği sûreler: [hesaplandıktan sonra top 5]
   İlk geçiş: Bakara 2:29

   [Tüm ayet listesi — expandable]
   Bakara 2:29, 2:32, 2:95, 2:115, 2:127, ...

   [Corpus Quran'da ara →]
```

#### Allah için özel detay

```
   ٱللَّه
   Allah
   ─────────────────────────────
   Yüce yaratıcının özel adı (lafza-i celâl)
   İsm-i a'zam, zâtın özel adı

   Klasik konkordans: 2699 (M. Fuâd Abdülbâkî)
   ⓘ Bu sayım LEMMA esaslıdır: tüm morfolojik formlar
   (Allāhu, Allāhi, Allāha) ve önek'li türevler
   (lillāh, billāh, wallāh, fallāh) tek bir isim sayılır.

   Yalın yüzey lafzı: ~1813
   (Sadece prefiks'siz "Allah" formu)

   [Tüm ayet listesi — expandable]
```

**Kök gösterimi:** Sadece JSON'da kök bilgisi olan 8 isim için (Rahmân/Rahîm, Hâlık, Alîm, Hakîm, Nûr, Vedûd, Azîz, Kayyûm). Diğerlerinde kök section'ı gösterilmez (uydurma yok).

**Veri kaynağı:** JSON `isimler[]` — her isim için yapı zaten hazır.

### Section 7 — Metodoloji ve Kaynak (Reflection / Transparency)

Açılır panel.

- M. Fuâd Abdülbâkî · el-Mu'cemü'l-Müfehres referansı
- Uthmânî resm-i Mushaf metni
- Lemma vs yüzey-lafız metodolojik fark açıklaması (lemma örnekleri ile)
- ±5-10 kaynak varyansı uyarısı
- Es-Sabûr, El-Mukaddim, El-Vâcid, El-Mâcid gibi Kur'an'da bu lafızla geçmeyip hadis kaynaklı 4 isim için açıklama
- Dış doğrulama linkleri (Corpus Quran, Tanzil)

**Veri kaynağı:** JSON `metodoloji` objesi.

---

## 3. Veri Mimarisi

### 3.1 Birincil veri dosyası

**`next/public/esma-frekans.json`** — TAMAMEN değiştirilir.

- Eski (99 isim, basit count) → silinmez, `esma-frekans.legacy.json` olarak arşivlenir (kaynak şeffaflığı için)
- Yeni JSON (kullanıcı tarafından sağlandı, 114 isim) → birincil dosya olarak yerleştirilir
- Yapı: zaten kullanıcının verdiği yapıda kalır (`isimler[]`, `kategoriler[]`, `temel_ayetler[]`, `metodoloji`)

### 3.2 Yardımcı veri dosyaları

**`next/public/esma-beyanlari.json`** — YENİ.

Doküman 3'ün 14 tematik ekseni × 35+ ayet. Yapı:

```json
{
  "eksenler": [
    {
      "id": "varlik-teklik",
      "baslikTr": "Allah'ın Varlığı ve Tekliği",
      "baslikEn": "God's Existence and Oneness",
      "ayetler": [
        { "sure": 20, "ayet": 14, "sureAd": "Tâhâ", "mealTr": "Şüphesiz ben Allah'ım...", "mealEn": "Truly I am God..." },
        ...
      ]
    },
    ...
  ]
}
```

**İçerik kaynağı:** Doküman 3'ten BİREBİR. Yorum eklenmez, uydurma eklenmez.

**Editoryal sorumluluk:** İngilizce çevirilerin son hali user onayına sunulur (varsa eksik).

### 3.3 İçerik kararları (kayıt için)

| Karar | Değer | Gerekçe |
|---|---|---|
| Allah sayısı (görünür) | **2699** | Klasik konkordans, site genelinde tutarlılık (önceki kararla onaylı) |
| Lemma şeffaflık | Allah detay panelinde + metodoloji bölümünde | Akademik şeffaflık, kullanıcının haklı sorusuna direkt cevap |
| 114 ismin epistemik kategori atama (Celal/Cemal) | Editoryal sınıflandırma, dipnotlu | Doküman 4 tezi gereği; ama doğru-yanlış mesafesi var, dipnot şart |
| Kök analizi | Sadece elde olan 8 isim için | Uydurma yasak (kullanıcı kuralı); diğerleri için section gizlenir |
| 4 hadis-kaynak isim (Sabûr, Mukaddim, Vâcid, Mâcid) | Atlas'ta gösterilir ama "Kur'an'da bu lafızla yok" rozeti ile | JSON'da `kuranda_gecis_sayisi: 0` ve `ayetler: []` |

---

## 4. Bileşen Mimarisi

### 4.1 Yeni component dosyaları

`next/src/components/EsmaFrekans.jsx` — tamamen yeniden yazılır (mevcut 677 satır → yeni yapı).

Tek bileşen mi, alt-bileşenler mi? Önerim: **tek dosya, ama internal section bileşenleri**:

```jsx
// EsmaFrekans.jsx — yapı:
//   ├─ Hero
//   ├─ Manifesto (Celal/Cemal)
//   ├─ FlagshipVerses (3 pasaj)
//   ├─ FrequencyLandscape (chart)
//   ├─ DivineVoice (14 eksen)
//   ├─ NamesAtlas (114 isim, search/filter/detail)
//   └─ Methodology (açılır panel)
```

İlk implementasyonda hepsi aynı dosyada (≤900 satır beklenir). Eğer dosya 1000 satırı aşarsa section'lar ayrı dosyalara çıkarılır (`EsmaFrekans/Hero.jsx`, vb.) — premature optimization yok.

### 4.2 Etkilenen mevcut dosyalar

| Dosya | Değişiklik |
|---|---|
| `next/src/app/[locale]/arac/esma-frekans/page.js` | TITLE/DESC güncellenir; sub-title alanı PageHeading'e eklenir |
| `next/src/components/PageHeading.jsx` | Mevcut yapısı (title + desc) korunur; **EsmaFrekans alt başlık sayfa-içinde** render edilir (PageHeading değişmez) |
| `next/src/data/tools.jsx` (satır 297-305) | titleTr/En, descTr/En, descLongTr/En tamamen yeniden yazılır |
| `next/src/lib/jsonld.js` (satır 23, 41) | breadcrumb label güncellenir |
| `next/src/components/tefekkur/RelatedToolCard.jsx:9` | labelTr/En + descTr/En |
| `next/src/components/ToolsHighlight.jsx:14` | Yorum güncellenir |
| `next/public/esma-frekans.json` | Yeni JSON ile değiştirilir; eski `esma-frekans.legacy.json` olarak yedeklenir |
| `next/public/esma-beyanlari.json` | YENİ — Doküman 3 verisi |

### 4.3 Etkilenmeyen dosyalar (önemli)

| Dosya | Sebep |
|---|---|
| `WowFacts.jsx:71` (Allah 2699) | Korunur — site tutarlılığı kararı |
| `ReadingMode.jsx` Allah lafzı rendering | Bağımsız feature, değişmez |
| `Navbar.jsx` lazy import | `EsmaFrekans` component adı kod-içi; değişmez |
| `useQuranNav.js` esma path | URL stabil; değişmez |

---

## 5. Görsel Tasarım

### 5.1 Renk paleti (mevcut tokens ile)

| Section | Birincil | İkincil | Vurgu |
|---|---|---|---|
| Hero | cosmic-black bg | gold ✦ | Şûrâ 42:11 yazısı için soft emerald glow |
| Manifesto (Celal) | deep indigo accent (`#2d3450`) | gold | Celal isimleri |
| Manifesto (Cemal) | soft emerald (`#1a7a4c40`) | gold | Cemal isimleri |
| Flagship Pasajlar | glass-card | gold underline | Hover'da soft gold glow |
| Frekans | gold gradient bars | silver labels | Allah bar'ı ekstra parıltı |
| Vahyin Sesi | cosmic-black | soft gold | Her temaya hafif renk varyasyonu |
| Atlas | glass-card grid | silver text | Hover/açık state: gold border |
| Metodoloji | muted card | silver | — |

**Token referansları:** `COLORS.gold`, `COLORS.emerald`, `COLORS.cosmicBlack`, `COLORS.offWhite`, `COLORS.silver`, `GLASS_CARD`, `VERSE_BLOCK`, `TEXT.sectionLabel`. §13.1 token kuralı tam uygulanır.

### 5.2 Tipografi

- Hero başlığı (`ESMÂ-İ HÜSNÂ`): Playfair Display 900, 4-6rem, letter-spacing tight
- Alt başlık (sub): Playfair Display 400, italic, 1.5rem, silver
- Şûrâ 42:11 ayeti: KFGQPC 2.5rem, dir=rtl, ortalanmış (verse intro pattern, §11)
- 4 temel ayet kartları: KFGQPC 1.4rem Arapça, Inter 0.85rem TR
- Manifesto tez cümlesi: Playfair Display italic, max-w-3xl, text-left (§11 kuralı)
- Section title'lar: Playfair Display 700, 2-2.5rem
- Section labels (üst etiket): TEXT.sectionLabel (mevcut token)
- Atlas isim kartları: KFGQPC 1.4rem Arapça, Inter 0.85rem okunuş
- Body text: Inter 400, 1.1rem, line-height 1.8

§13.2 (Arapça font kuralı — sadece KFGQPC), §13.5 (verse block), §13.15 (Arapça encoding) tam uygulanır.

### 5.3 Motion (framer-motion)

| Section | Hareket |
|---|---|
| Hero | Bismillah ornamenti slow rotate (sürekli, çok yavaş); Şûrâ 42:11 fade-in + slight scale; 4 temel ayet stagger |
| Manifesto | Celal/Cemal sütunları viewport'a girince zıt yönlerden slide-in |
| Flagship | Her ayet pasajı viewport'a girince fade-up; underlines'lar 0.3s delay'le animate-in |
| Frekans | Bar chart'lar viewport'ta width: 0 → target, stagger |
| Vahyin Sesi | Scroll-snap doğal hareket; ek motion yok |
| Atlas | Filter chip'leri instant; detay paneli height transition |

`prefers-reduced-motion` honor edilir — tüm motion devre dışı, sadece fade.

### 5.4 Mobil (≥390px) — §14

- Hero: tipografi sıkıştırılır (3rem başlık); 4 temel ayet kartı 2x2 grid → mobilde 1x4 stack
- Manifesto: split-screen mobilde **dikey karşıtlık** (üst Celal, alt Cemal, orta tez)
- Flagship: her pasaj full-width, sticky tab'lı navigation (Pasaj 1 / 2 / 3)
- Frekans: top 20 bar chart kalır, yoğunluk heatmap'i scrollable horizontal
- Vahyin Sesi: scroll-snap kart dizisi mobilde tam genişlik, horizontal swipe
- Atlas: search kutusu üstte sticky, filter chip'leri scrollable row, isim kartları 1 sütun, detay paneli inline expand

### 5.5 İkonografi

- Bismillah ornamenti: SVG (mevcut tasarım sistemiyle uyumlu, kullanıcı onaylı varyant)
- Ayet referansları: `—` separator (em-dash)
- Kategori chip'leri: minimal text, ikonsuz
- Corpus Quran link: küçük external-link SVG ikonu

**Emoji yasağı:** §13 + CLAUDE.md global rule — sayfada hiçbir emoji yok.

---

## 6. Allah için Lemma Şeffaflığı — Tam Implementasyon

Allah ismi 3 yerde gösterilir, her birinde özel davranış:

### 6.1 Frekans Manzarası (Section 4)

```
Allah  ████████████████████  2699  ⓘ
```

`ⓘ` ikonuna hover/tap:
> Klasik konkordans (lemma sayımı). Tüm morfolojik formlar ve önek'li türevler dahildir. Yalın yüzey lafzı: ~1813.

### 6.2 114 İsim Atlas'ı (Section 6)

Liste satırı: "Allah · Lafza-i Celâl · 2699"

Tıklanınca açılan detay paneli (yukarıda §2 Section 6'da detaylı):
- Klasik konkordans: 2699 — kalın
- Lemma açıklaması — 2 satır, prefiks örnekleri ile
- Yalın yüzey lafzı: ~1813 — silver renkte alt-stat

### 6.3 Metodoloji Bölümü (Section 7)

Genel kural paragrafı:
> "Bu sayfa klasik konkordansa (M. Fuâd Abdülbâkî) dayanır. **Lemma sayımı:** bir ismin tüm morfolojik formları (`Allāhu`, `Allāhi`, `Allāha`) ve önek'li türevleri (`lillāh`, `billāh`, `wallāh`, `fallāh`) tek bir isim olarak sayılır. Klasik rakamlar (Allah=2699), yalın yüzey lafzına (~1813) göre daha yüksek görünür. Bu metodolojik bir tercihtir, sayım hatası değildir."

---

## 7. SEO / Metadata

### 7.1 `page.js` metadata

```js
const PATH = '/arac/esma-frekans';
const TITLE_TR = "Esmâ-i Hüsnâ — Allah'ın Kendini Tanıtması";
const TITLE_EN = "The Beautiful Names — How God Describes Himself";
const DESC_TR  = "Kur'an'da Allah'ın kendini tanıttığı 114 isim, sıfat ve doğrudan beyan. Celal ↔ Cemal dengesi, frekans haritası, kök analizi, Âyetü'l-Kürsî ve Haşr 22-24 anatomileri.";
const DESC_EN  = "The 114 names, attributes, and direct statements by which God describes Himself in the Quran. Jalāl ↔ Jamāl balance, frequency landscape, root analysis, and anatomies of Āyat al-Kursī and Ḥashr 22-24.";
```

### 7.2 JSON-LD

- `buildBreadcrumb(locale, '/arac/esma-frekans')` — labels güncellenir (`jsonld.js` satır 23, 41)
- `buildLearningResource({ locale, path, title, description })`
- Ek olarak: `Article` schema (kompozit içerik için) — optional, yatırım/değer karşılaştırması yapılarak karar verilir; ilk implementasyonda atlanır

### 7.3 PageHeading (sr-only H1)

`PageHeading` server-rendered olarak H1 + description verir. Bu yapı korunur. Alt başlık ("Allah'ın Kendini Tanıtması") sayfa-içi visual başlığın bir parçası olur; PageHeading'in H1'i ana başlığı (`Esmâ-i Hüsnâ — Allah'ın Kendini Tanıtması`) tek satırda kapsar.

---

## 8. Erişilebilirlik

- Tüm Arapça blokları: `dir="rtl"` `lang="ar"`
- Tüm interaktif element'ler: aria-label
- Hover-driven interactions (flagship pasajda isim hover'ı): klavye `Tab`/`Enter` ile de çalışır
- Bar chart'ların aria-label'ı sayıyı içerir
- `prefers-reduced-motion` honor edilir
- Color contrast: WCAG AA (silver-on-cosmic-black için kontrast hesaplaması gerekirse `#a8b5c9`'a kayılır)
- Detay paneli açma/kapatma: aria-expanded
- Kategori filter chip'leri: aria-pressed
- Şûrâ 42:11 hero ayeti: `<blockquote cite="...">` semantic markup

§9 (CLAUDE.md accessibility) tam uygulanır.

---

## 9. Performans

- Bundle hedef: sayfa-bazlı JS ≤200 KB gzipped (mevcut EsmaFrekans 25 KB; yeni yapı ile yaklaşık 60-80 KB beklenir)
- Veri: 2 JSON dosyası, toplam yaklaşık 300 KB (114 isim × ortalama 50 ayet referansı + 14 eksen × 3 ayet meali)
- Lazy load:
  - Section 5 (Vahyin Sesi) ve Section 6 (Atlas) için scroll-triggered: IntersectionObserver ile data fetch erteleme
  - Initial render'da yalnız Section 1-3 görünür durumda
- Bar chart'lar SVG (canvas yok, 3D yok)
- 114 isim atlas listesi: virtualization olmadan render edilebilir (114 öğe; performance fine)
- Detay paneli açıkken sadece 1 ismin ayet listesi render edilir (114 ismin x 50 ayet = 5700 satır asla aynı anda DOM'da olmaz)
- LCP < 2.5s, CLS < 0.1, INP < 200ms (CLAUDE.md §8 hedefleri)

---

## 10. Test Stratejisi

### 10.1 Birim testler (Vitest)

- JSON'un yeni şemada parse edildiği
- Allah için `displayCount=2699` özel davranışının çalıştığı
- Kategori filter'ın 3 tip için doğru filtrelediği
- Frekans sıralama (desc/asc/orijinal)
- Arama: Arapça + Türkçe + İngilizce eşleşmesi
- `cleanArabic()` Arapça metinde uygulanıyor (eğer yeni JSON'da problem karakter varsa)

### 10.2 Görsel/Manuel testler

- Fatiha sūresi flagship pasajı doğru render (tecvid, harekeler)
- Âyetü'l-Kürsî pasajında 4 isim doğru altı çizili
- Haşr 59:22-24 pasajında 12 isim doğru altı çizili
- İhlâs 112'de Ehad + Samed vurgulu
- Mobil ≥390px tam çalışır (sidebar gizli, tab bar visible)
- Mobil ≥768px tablet düzeni
- Desktop ≥1024px full layout
- `prefers-reduced-motion` honor

### 10.3 İçerik doğruluk testleri

- 114 ismin sayım toplamı JSON'la eşleşir
- 4 temel ayetin metni Kur'an'la eşleşir
- 14 ekseni Doküman 3 ile karşılaştırılır
- Allah için "Klasik konkordans (lemma): 2699" ve "Yalın yüzey: ~1813" iki sayı birden gösteriliyor

---

## 11. Belirsizlikler / Açık Sorular

### 11.1 İngilizce çevirileri — karar: Sahih International

Doküman 3'te 14 eksen × 35+ ayet **TR olarak** verildi. İngilizce çeviriler yeni JSON dosyası (`esma-beyanlari.json`) yazılırken **Sahih International** çevirisinden alınır:

- Her ayet altında çeviri kaynağı belirtilir (`"mealEnKaynak": "Sahih International"`)
- Uydurma çeviri yazılmaz
- Sahih International'dan alınamayan (çok rara durumlarda) ayetler için Pickthall fallback
- Bu kaynaklar Tanzil veya quran.com'dan teyit edilerek yazılır — direct fetch yapılmaz, build-time normalize

### 11.2 114 ismin epistemik kategori atama

Doküman 4'ün 7 epistemik kategorisi (ontolojik, kozmik, kudret, kozmogonik, psikolojik, siyasi, kognitif). Bu kategori atama:

- **Manifesto section'ında (Section 2)** sadece **temsili 5-10 isim** sol/sağ sütunlarda gösterilir — tüm 114 isim kategorize edilmez
- Atlas'ta (Section 6) kategori filtresi 3'lü orijinal taksonomi'ye dayanır (Lafza-i Celâl, Esmâ-i Hüsnâ, Kur'ânî Sıfat) — JSON'da hazır
- 7 epistemik kategori sadece anlatı amaçlı; atlasta filter olarak EKLENMEZ
- Bu seçim: editoryal yük az, anlatı temiz, halüsinasyon yok

### 11.3 Section 5 (Vahyin Sesi) — karar: progressive disclosure

14 eksen × ortalama 2 ayet = 28 ayet kartı bir sayfada yorgunluk yaratır. Karar:

- **İlk gösterim:** 6 ön plan ekseni (en güçlü doğrudan beyanlar):
  1. Varlığı ve Tekliği
  2. Yakınlığı
  3. Rahmeti
  4. Yaratıcılığı
  5. Kudreti
  6. Nur Oluşu
- Section sonunda buton: **"Diğer 8 ekseni göster"** — tıklayınca smooth expand
- Genişletme sonrası: kalan 8 eksen (Bilgisi, Adaleti, İşitme/Görme, Hayat/Süreklilik, Koruyuculuk, Hükmü, İnsanla İlişkisi, Kapsamlı Pasajlar)
- Her kart: scroll-snap (mobilde horizontal swipe, desktop'ta 3 sütun grid)
- Her kart kompakt: tema etiketi + 1 ayet (Arapça + TR/EN) + sure:ayet referansı

---

## 12. Implementasyon Sırası (yüksek-seviye)

Detaylı plan ayrı doküman olarak yazılacak. Yüksek-seviye sıra:

1. JSON dosyalarını hazırla (`esma-frekans.json` güncelle, `esma-beyanlari.json` oluştur)
2. `page.js` metadata güncelle
3. `tools.jsx`, `jsonld.js`, `RelatedToolCard.jsx` etiketleri güncelle
4. `EsmaFrekans.jsx` yeniden yaz — section bazlı:
   - Hero → Manifesto → Flagship → Frekans → Vahyin Sesi → Atlas → Metodoloji
5. Görsel doğrulama (3 viewport)
6. İçerik doğruluk denetimi
7. Performance check (Lighthouse)
8. Eski JSON'u `.legacy.json` olarak yedekle

---

## 13. Beklenen Sonuç (Kabul Kriterleri)

- Sayfa yüklendiğinde kullanıcı ilk ekranda Şûrâ 42:11 + 4 temel ayet + sayfa kimliğini görür
- Scroll ile 7 section anlatı sırasıyla açılır
- 114 ismin tümü atlas'ta keşfedilebilir
- Allah için lemma şeffaflığı 3 yerde de net (frekans bar, detay panel, metodoloji)
- Mobil ≥390px tam çalışır
- WowFacts, ReadingMode değişmez
- URL `/arac/esma-frekans/` aynı
- Sitenin "Esmaül Hüsna" navigasyonu tutarlı kalır
- Hiçbir Arapça karakter render hatası yok (KFGQPC fonksiyon, encoding standart)
- §13 token kuralı tam uygulanır, hardcoded hex yok
- Hiç emoji yok
- Hiçbir uydurma içerik yok (kök analizi sadece 8 isim, geri kalan section'sız)
