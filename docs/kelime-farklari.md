# Furûk — Kelime Farkları Atlası — Nihai Design Spec
**Date:** 2026-04-14  
**Version:** 2.0 (Final)  
**Status:** Approved for Implementation

---

## 1. Overview

A new full-screen overlay tool ("Furûk — Kelime Farkları") added to QuranCodex.com. This tool reveals the precise semantic distinctions between Quranic words that share a common Turkish translation but carry distinctly different meanings in the original Arabic. Based on the classical Islamic discipline of **el-Furûk fi'l-Lüga** (lexical differences) and **el-Vücûh ve'n-Nezâir** (aspects and analogues).

**Core philosophy: "İddia değil, veri göster."**

The tool does not merely state "Matar is used for divine punishment." It shows the user all ~13 occurrences of Matar, colour-coded by context, with the target word highlighted in gold within each verse — so the user **sees the pattern themselves.**

**Core question:** "Türkçe çevirisi aynı ama Arapçası farklı — bu kelimeler gerçekten eş anlamlı mı?"

---

## 2. Classical Sources

- **Ebû Hilâl el-Askerî** (ö. 395 H / 1005 M) — *el-Furûk fi'l-Lüga*
- **Râgıb el-İsfahânî** (ö. 502 H / 1108 M) — *Müfredâtü Elfâzi'l-Kur'ân*
- **İbn Kayyım el-Cevziyye** (ö. 751 H / 1350 M) — *Medâricü's-Sâlikîn*
- **es-Süyûtî** (ö. 911 H / 1505 M) — *el-İtkân fî Ulûmi'l-Kur'ân*
- **Fâdıl Sâlih es-Sâmerrâî** (çağdaş) — *Lemesât Beyâniyye*
- **Bint eş-Şâtı'** (ö. 1998) — *el-İ'câzü'l-Beyânî li'l-Kur'ân*

---

## 3. Placement & Integration

- **Type:** Full-screen overlay
- **File:** `src/components/FurukAtlasi.jsx`
- **Navbar location:** ANALİZ & VERİ column
- **Tool entry:**
```js
{
  labelTr: 'Furûk — Kelime Farkları',
  labelEn: 'Word Distinctions Atlas',
  descTr: '30+ kelime grubu · aynı çeviri, farklı anlam · tüm ayetler',
  descEn: '30+ word groups · same translation, different meaning',
  icon: /* layered-words or prism SVG icon */,
  action: () => { setFurukOpen(true); setToolsOpen(false); },
}
```

---

## 4. Content — 30+ Word Groups

### KATEGORI 1: DUYGULAR VE RUHSAL DURUMLAR (8 grup)

#### 1.1 Korku Aileleri
| Kelime | Arapça | Frekans | Ayırt Edici Anlam |
|--------|--------|---------|------------------|
| Havf | خَوْف | ~124 | Somut, rasyonel korku |
| Haşye | خَشْيَة | ~48 | Bilgiden doğan saygılı korku |
| Rehbe | رَهْبَة | ~8 | Derin titreyen korku, kaçış yönlü |
| Vecel | وَجَل | ~5 | Kalbin titremesi |
| Takvâ | تَقْوَى | ~258 | Korunma korkusu, eylem üreten |
| Hayâ' | حَيَاء | ~2 | Utangaç saygı korkusu |

**Ayırt edici prensip (İbn Kayyım):** Havf hareket üretir, haşye sakinlik üretir.

#### 1.2 Umut Aileleri
Recâ' / Emel / Tama'

#### 1.3 Üzüntü Aileleri
Hüzn / Gamm / Esef / Kerb

#### 1.4 Huzur Aileleri
Sekîne / Emn / Itmi'nân

#### 1.5 Öfke Aileleri
Gadab / Sahat / Mekt

#### 1.6 Sevgi Aileleri
Hubb / Vüdd / Raġbe

#### 1.7 Kalp Aileleri
Kalb / Fu'âd / Sadr / Lübb

#### 1.8 Günah Aileleri
Zenb / Ism / Seyyi'e / Fâhişe / Cürm

---

### KATEGORI 2: DOĞA VE KOZMOS (6 grup)

#### 2.1 Yağmur Aileleri
| Kelime | Arapça | Örüntü |
|--------|--------|--------|
| Matar | مَطَر | Neredeyse her zaman azap |
| Ğays | غَيْث | Her zaman rahmet |
| Vedk | وَدْق | Nötr, doğal döngü |

#### 2.2 Rüzgâr Aileleri
Rîh (tekil → azap) / Riyâh (çoğul → rahmet)

#### 2.3 Su Aileleri
Mâ' / Vedk / Furât / Ucâc / Hamîm

#### 2.4 Ateş Aileleri (6 cehennem adı)
Nâr / Cahîm / Sa'îr / Lezâ / Hutame / Hâviye

#### 2.5 Gök Aileleri
Semâ' / Felek / Arş

#### 2.6 Yer Aileleri (5 çamur türü)
Ard / Türâb / Tîn / Salsâl / Hame'

---

### KATEGORI 3: İNSAN VE TOPLUM (5 grup)

#### 3.1 İnsan Aileleri
İnsân / Beşer / Nâs / Benî Âdem / Rical

#### 3.2 Kavim Aileleri
Kavm / Ümmet / Şa'b / Kabîle

#### 3.3 Erkek Aileleri
Recul / Zeker / Ba'l / Zevc

#### 3.4 Kadın Aileleri
İmra'e / Ünsâ / Nisâ' / Zevc

#### 3.5 Çocuk Aileleri
Veled / Ibn / Tıfl / Ğulâm / Sabî

---

### KATEGORI 4: YARATMA VE VARLIK (4 grup)

#### 4.1 Yaratma Aileleri (8 fiil)
Halk / Bed' / İbdâ' / Fatr / Bâri' / Savver / Zera'e / Enşe'e

#### 4.2 Rızık Aileleri
Rızk / Nîme / Fazl / Âlâ'

#### 4.3 Gönderme Aileleri
**Enzele (toptan) vs. Nezzele (tedrici)** / Erseltü / Beaşse

#### 4.4 Ölüm Aileleri
Mevt / Veffâ / Halake / Kazâ

---

### KATEGORI 5: BİLGİ VE İDRAK (4 grup)

#### 5.1 Bilgi Aileleri
İlm / Ma'rife / Şu'ûr / Dirâye / Yakîn / Firâse

#### 5.2 Yakîn'in Üç Derecesi
İlmü'l-Yakîn / Aynü'l-Yakîn / Hakku'l-Yakîn

#### 5.3 Düşünme Aileleri
Tefekkür / Tedebbür / Tezekkür / Akl / Lübb / Fıkh

#### 5.4 Görme Aileleri
Ra'â / Nazar / Basar / Şehide / Besîra

---

### KATEGORI 6: HAYAT VE AHİRET (3 grup)

#### 6.1 Hayat Aileleri
Hayâh / Umr / Ma'îşe / Dünyâ / Âhire

#### 6.2 Yol Aileleri
**Sırât (hep tekil, hak yol) vs. Sebîl (çoğul olabilir) / Tarîk / Minhâc**

#### 6.3 Cennet/Cehennem Aileleri
Cennet / Firdevs / Adn / Na'îm

---

### KATEGORI 7: AHLAK VE EYLEM (3 grup)

#### 7.1 Hayr Aileleri
Hayr / Salâh / Birr / Ma'rûf / Husn

#### 7.2 Şer Aileleri
Şerr / Münker / Fâhişe / Fesâd

#### 7.3 Yardım Aileleri
Nasr / Avn / Te'yîd / Medd

**Toplam: 33 grup, ~160 kelime**

---

## 5. Data Architecture — Verse Coverage + Word Highlighting

### 5.1 Core Principle

Her kelime için Kur'an'daki **tüm geçiş yerleri** veride tutulur. Her geçiş için:
1. **Ayet referansı** (sure:ayet)
2. **Bağlam türü** (azap/rahmet/nötr — color-coded)
3. **Kısa bağlam notu** (Türkçe, 1 satır)
4. **Ayet içindeki hedef kelimenin konumu** (highlighting için)

### 5.2 Word Highlighting — Teknik Yaklaşım

Kullanıcı bir ayete tıkladığında:
1. API'dan (`api.acikkuran.com`) Arapça metin yüklenir
2. JSON'da o ayet için tanımlı **kelime indeksi** kullanılarak o kelime `<span class="furuk-highlight">` ile sarılır
3. Highlighted kelime: altın renk (`COLORS.gold`), hafif underline, `font-weight: bold`

**Neden manuel indeks?** Arapça'da aynı kök farklı vezinlerde farklı anlamlar taşıyabilir (örn: `maṭar` vs `maṭaran` vs `maṭarun`). Otomatik kök eşleme yanlış vurgu yapar. Manuel veri tanımı güvenilirdir.

### 5.3 Data Schema

`word-groups.json`:

```json
{
  "groups": [
    {
      "id": "rain-family",
      "category": "nature",
      "titleTr": "Yağmur Aileleri",
      "turkishTranslation": "Yağmur",
      "principleTr": "Kelime seçimi bağlamı belirler — Matar azap, Ğays rahmet getirir.",
      "principleAr": "اختيار الكلمة يحدد السياق",
      "principleSource": "es-Süyûtî — el-İtkân",
      "words": [
        {
          "id": "matar",
          "ar": "مَطَر",
          "tr": "Matar",
          "transliteration": "maṭar",
          "meaning": "Neredeyse her zaman azap bağlamında — Lût kavmine taş yağması, müşriklere azap talebi.",
          "frequency": 13,
          "color": "#e74c3c",
          "semanticAxes": { "somut": 0.8, "bireysel": 0.3 },
          "allOccurrences": [
            {
              "ref": "7:84",
              "context": "negative",
              "note": "Lût kavmine taş yağması",
              "targetWord": "مَطَرًا",
              "targetWordIndex": 4,
              "translitWithHighlight": "wa-amṭarnā ʿalayhim **maṭaran** fa-anẓur kayfa kāna ʿāqibatu l-mujrimīn"
            },
            {
              "ref": "26:173",
              "context": "negative",
              "note": "Aynı olay",
              "targetWord": "مَطَرُ",
              "targetWordIndex": 5
            },
            {
              "ref": "27:58",
              "context": "negative",
              "note": "Uyarılanlara kötü yağmur",
              "targetWord": "مَطَرَ",
              "targetWordIndex": 6
            },
            {
              "ref": "8:32",
              "context": "negative",
              "note": "Müşriklerin taş yağması talebi",
              "targetWord": "مَطَرًا",
              "targetWordIndex": 8
            },
            {
              "ref": "4:102",
              "context": "neutral",
              "note": "Savaş ortamı — hava durumu",
              "targetWord": "مَطَرٍ",
              "targetWordIndex": 5
            }
            /* diğer 8 geçiş */
          ],
          "patternStat": {
            "negative": 11,
            "neutral": 2,
            "positive": 0,
            "dominantPattern": "negative",
            "dominantPercentage": 85
          }
        },
        {
          "id": "ghayth",
          "ar": "غَيْث",
          "tr": "Ğays",
          "transliteration": "ghayth",
          "meaning": "Her zaman rahmet bağlamında — kuraklıktan sonra bereket yağmuru.",
          "frequency": 3,
          "color": "#2ecc71",
          "allOccurrences": [
            {
              "ref": "42:28",
              "context": "positive",
              "note": "Ümit kesildiğinde inen rahmet",
              "targetWord": "الْغَيْثَ",
              "targetWordIndex": 3
            },
            {
              "ref": "31:34",
              "context": "positive",
              "note": "Yağmur bilgisi Allah katında",
              "targetWord": "الْغَيْثَ",
              "targetWordIndex": 5
            },
            {
              "ref": "57:20",
              "context": "positive",
              "note": "Dünya hayatı meseli — yağmur ürünü bitirir",
              "targetWord": "غَيْثٍ",
              "targetWordIndex": 7
            }
          ],
          "patternStat": {
            "negative": 0,
            "neutral": 0,
            "positive": 3,
            "dominantPattern": "positive",
            "dominantPercentage": 100
          }
        },
        {
          "id": "wadq",
          "ar": "وَدْق",
          "tr": "Vedk",
          "transliteration": "wadq",
          "meaning": "Nötr — bulut, şimşek, yağmur döngüsünün doğal tasviri.",
          "frequency": 2,
          "color": "#95a5a6",
          "allOccurrences": [
            {
              "ref": "24:43",
              "context": "neutral",
              "note": "Bulut-şimşek-yağmur tasviri",
              "targetWord": "الْوَدْقَ",
              "targetWordIndex": 7
            },
            {
              "ref": "30:48",
              "context": "neutral",
              "note": "Rüzgâr bulutları taşır, yağmur iner",
              "targetWord": "الْوَدْقَ",
              "targetWordIndex": 10
            }
          ],
          "patternStat": {
            "negative": 0,
            "neutral": 2,
            "positive": 0,
            "dominantPattern": "neutral",
            "dominantPercentage": 100
          }
        }
      ]
    }
  ]
}
```

### 5.4 Context Colour System

```js
const CONTEXT_COLORS = {
  negative: '#e74c3c',  // kırmızı — azap, helâk, uyarı
  positive: '#2ecc71',  // yeşil — rahmet, lütuf, bereket
  neutral:  '#95a5a6',  // gri — doğal olay, tasvir
  ritual:   '#c9a227',  // altın — ibadet, ritüel bağlam (bazı gruplar için)
  divine:   '#9b59b6',  // mor — ilahi sıfat bağlamı
};
```

### 5.5 Word Highlighting Implementation

```jsx
function HighlightedVerse({ arabicText, targetWordIndex }) {
  // Arapça metni kelimelere ayır (whitespace-based)
  const words = arabicText.split(/\s+/);
  
  return (
    <div dir="rtl" lang="ar" className="quran-text">
      {words.map((word, idx) => (
        <span
          key={idx}
          className={idx === targetWordIndex ? 'furuk-highlight' : ''}
        >
          {word}{' '}
        </span>
      ))}
    </div>
  );
}

// CSS:
// .furuk-highlight {
//   color: var(--gold);
//   font-weight: 700;
//   text-decoration: underline;
//   text-decoration-color: rgba(201, 162, 39, 0.4);
//   text-underline-offset: 4px;
//   padding: 0 2px;
// }
```

**Alternatif (daha sağlam) yaklaşım:** Bazı ayetlerde `targetWord` birden fazla kez geçebilir (hedef kelime ayet içinde tekrarlanıyorsa). Bu durumda `targetWordIndex` bir array olur: `[4]` veya `[4, 9]`. İndeks tabanlı sistem, substring match'ten daha güvenilirdir çünkü Arapça'da benzer kökler karışabilir.

---

## 6. Component Structure

```
FurukAtlasi({ onClose })
├── State
│   ├── isMobile
│   ├── activeTab (0-3)
│   ├── selectedGroupId (Tab 0 → Tab 1 için)
│   ├── expandedWordId (hangi kelimenin tüm geçişleri açık)
│   └── loadedVerses Map (API cache)
├── Escape handler
│
├── OVERLAY_BASE
│   ├── OVERLAY_HEADER: "Furûk — Kelime Farkları"
│   └── Tab Bar
│       ├── Tab 0: Panorama
│       ├── Tab 1: Grup Detayı
│       ├── Tab 2: Prensip Kitaplığı  
│       └── Tab 3: Kaynaklar
```

---

## 7. Tab Specs

### Tab 0 — Panorama

**Intro stat bar:**
```
33 kelime grubu  ·  160+ Arapça kelime  ·  1200+ ayet referansı  ·  7 kategori
```

**7 kategori sections (vertical stack):**

Her kategori için:
- Section başlığı (altın, uppercase): "DUYGULAR VE RUHSAL DURUMLAR"
- Kelime grubu kartları — 2-3 sütun grid

**Kelime grubu kartı (GLASS_CARD):**
- **Üst:** Turkish translation chip ("Korku") + kelime sayısı ("6 kelime")
- **Orta:** Her kelime için renkli nokta + Arapça + Türkçe + frekans:
  ```
  ● Havf     خَوْف     124×
  ● Haşye    خَشْيَة    48×
  ● Rehbe    رَهْبَة     8×
  ● Vecel    وَجَل      5×
  ● Takvâ    تَقْوَى   258×
  ```
- **Alt:** Küçük pull-quote "Ayırt Edici Prensip" (italic, muted)
- Hover: hafif gold glow
- Click: `selectedGroupId = groupId`, `activeTab = 1`

### Tab 1 — Grup Detayı (Hero Tab)

**Bu tab'ın içeriği `selectedGroupId`'ye göre dinamik.**

#### Hero Section

**Büyük başlık:**
```
KORKU
Kur'an'da 6 farklı kelime ile ifade edilir
```

**Ayırt Edici Prensip Box (gold border, centred):**
> "Havf hareket üretir, haşye sakinlik üretir."  
> — İbn Kayyım, Medâricü's-Sâlikîn

#### 2D Semantic Map (SVG)

Grup içindeki tüm kelimeler bir 2D harita üzerinde gösterilir:

- **X-ekseni:** Somut ↔ Soyut  
- **Y-ekseni:** Bireysel ↔ Kolektif
- Her kelime = renk kodlu nokta (`word.color`)
- Hover: nokta büyür, tooltip (Arapça + TR + frekans)
- Click: scroll to detail card

**SVG örnek (Korku ailesi):**
```
    Soyut
      ↑
      |      ● Haşye
      |           ● Vecel
      |
      |                    ● Takvâ
Bireysel ←─────────────────→ Kolektif
      |                    
      |  ● Havf        
      |       ● Rehbe
      ↓
    Somut
```

Her grup için `semanticAxes` verisi `word-groups.json`'dan okunur.

#### Kelime Detay Kartları (vertical stack)

Her kelime için tam detay kartı:

```
┌─────────────────────────────────────────────────┐
│  خَوْف          (büyük, altın, RTL, FONTS.quran) │
│  Havf · ḫawf · "fear" (kökten hawifa)            │
│                                                  │
│  Somut, rasyonel korku — yılan, düşman, fakirlik │
│  gibi karşılaşılabilen tehditlerden duyulan      │
│  korku. "Havf" kelimesinin özünde "hareket/tepki"│
│  vardır — kaçma, koruma gibi aksiyonlara götürür.│
│                                                  │
│  Kur'an'da 124 kez geçer.                        │
│                                                  │
│  ──────────── AYIRT EDİCİ NOKTA ──────────────   │
│  Haşye'den farkı: Havf hareket üretir.           │
│  (Düşmandan kaç!) Haşye bilgi ile kök salar.     │
│  (O büyüktür, O'nu sars kalmayasın!)              │
│                                                  │
│  [▼ Tüm 124 geçişi göster — Kendin Doğrula]     │
└─────────────────────────────────────────────────┘
```

**"Tüm Geçişleri Göster" expand edilince:**

##### Pattern Stat Bar

Görsel bar — örnek (Matar için):
```
Azap bağlamı: ████████████░░ 11 (85%)
Nötr:        ██░░░░░░░░░░░ 2 (15%)
Rahmet:      ░░░░░░░░░░░░░ 0 (0%)
```

**Stat cümlesi:**
> "13 geçişin 11'i azap bağlamında — %85 dominant örüntü."

##### Ayet Listesi

Her ayet için satır:

```
┌─────────────────────────────────────────────────┐
│ ● 7:84  Lût kavmine taş yağması         [↓]    │
├─────────────────────────────────────────────────┤
│ (expand sonrası)                                 │
│                                                  │
│   فَانظُرْ كَيْفَ كَانَ عَاقِبَةُ الْمُجْرِمِينَ     │
│   وَأَمْطَرْنَا عَلَيْهِم **مَطَرًا**              │
│         ↑                                        │
│   Türkçe: "Onların üzerine [yağmur] yağdırdık.   │
│           Şimdi bak, suçluların sonu ne oldu."   │
└─────────────────────────────────────────────────┘
```

- Sol renkli nokta (●) = bağlam tipi
- Arapça metin API'dan yüklenir — hedef kelime altın renk + underline
- Türkçe meal altta, italic
- Her satır expandable (tıklayınca Arapça+Türkçe açılır)

##### Filtre chip'leri

Ayet listesinin üstünde:
```
[Tümü (13)] [Azap (11)] [Nötr (2)] [Rahmet (0)]
```

Tıklayınca liste filtrelenir.

### Tab 2 — Prensip Kitaplığı

~15 furûk prensibi, pull-quote kartları:

```
┌──────────────────────────────────────────────────┐
│ "Havf hareket, haşye sakinliktir."              │
│                                                  │
│ Düşmanı gören iki tepki verir: kaçış (havf)     │
│ veya bilgiyle duruş (haşye). Birincisi          │
│ sıradan mü'minin korkusu, ikincisi âlimin.      │
│                                                  │
│              — İbn Kayyım, Medâricü's-Sâlikîn    │
│                                                  │
│ [İlgili Grup: Korku Aileleri →]                  │
└──────────────────────────────────────────────────┘
```

Her kart altında ilgili kelime grubuna link.

**15 prensip:**
1. Havf hareket, haşye sakinlik (İbn Kayyım)
2. Rîh azap, riyâh rahmet (Süyûtî)
3. Matar azap, ğays rahmet (klasik)
4. Sırât tektir, sübül çoğuldur (yapısal)
5. Enzele toptan, nezzele parça parça (Süyûtî)
6. İnsân sosyal, beşer biyolojik (İsfahânî)
7. Kalb değişken, fu'âd alevli (İsfahânî)
8. Halk ölçülü, ibdâ' modelsiz (İsfahânî)
9. Yakîn üç derece: ilm/ayn/hakk (Askerî)
10. Zenb sonuç, ism engel (Askerî)
11. Tîn/salsâl/hame' — çamurun evreleri
12. Cehennem 6 ad, her biri farklı azap boyutu
13. Zevc çift, zeker biyolojik — cinsiyet dili
14. Tefekkür zihinsel, tedebbür sonuç odaklı
15. Recâ' aktif umut, emel uzak arzu

### Tab 3 — Kaynaklar

**Âlim kartları (4 kart):**

Her kart:
- Arapça isim + Türkçe isim (altın)
- Vefat tarihi (H/M)
- Şehir
- Eser adı (italic)
- 2-3 cümle açıklama
- "Katkısı" rozeti: Kurucu / Geliştirici / Çağdaş

1. **Ebû Hilâl el-Askerî** — "Furûk ilminin kurucusu"
2. **Râgıb el-İsfahânî** — "En kapsamlı Kur'an sözlüğü"
3. **İbn Kayyım el-Cevziyye** — "Makamlar analizi"
4. **Fâdıl Sâlih es-Sâmerrâî** — "Çağdaş beyan ilmi"

**Altında: İlmin Tarihçesi narrative (3-4 paragraf)**

**Altında: Modern Türkçe Kaynaklar bölümü**
- Fâdıl Sâlih, *Lemesât Beyâniyye* (Türkçe çeviri var)
- Türkçe tefsir geleneğinde Elmalılı Hamdi Yazır'ın furûk'a yaklaşımı
- Akademik çalışmalar

---

## 8. Arabic Text Loading + Highlighting Flow

```js
// Component level cache
const verseCache = useRef(new Map());

async function loadVerse(surah, ayah) {
  const key = `${surah}:${ayah}`;
  if (verseCache.current.has(key)) {
    return verseCache.current.get(key);
  }
  
  const res = await fetch(`https://api.acikkuran.com/surah/${surah}/verse/${ayah}`);
  const data = await res.json();
  const result = {
    arabic: data.data.verse,
    turkish: data.data.translation.text,
  };
  
  verseCache.current.set(key, result);
  return result;
}

function VerseDisplay({ occurrence }) {
  const [verse, setVerse] = useState(null);
  
  useEffect(() => {
    loadVerse(
      parseInt(occurrence.ref.split(':')[0]),
      parseInt(occurrence.ref.split(':')[1])
    ).then(setVerse);
  }, [occurrence.ref]);
  
  if (!verse) return <Spinner />;
  
  const words = verse.arabic.split(/\s+/);
  
  return (
    <div className="verse-display">
      <div 
        dir="rtl" 
        lang="ar" 
        style={{ fontFamily: FONTS.quran, fontSize: '22px', lineHeight: 2 }}
      >
        {words.map((word, idx) => (
          <span
            key={idx}
            style={idx === occurrence.targetWordIndex ? {
              color: COLORS.gold,
              fontWeight: 700,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(201, 162, 39, 0.4)',
              textUnderlineOffset: '4px',
              padding: '0 2px',
            } : {}}
          >
            {cleanArabic(word)}{' '}
          </span>
        ))}
      </div>
      <p 
        style={{ 
          color: COLORS.silver, 
          fontStyle: 'italic', 
          marginTop: '12px' 
        }}
      >
        {verse.turkish}
      </p>
    </div>
  );
}
```

---

## 9. Cross-Tool Integration

- **Kelime Haritası ile bağlantı:** Bir kelimenin sure dağılımı için link
- **Nüzul Haritası ile bağlantı:** Kronolojik kullanım
- **Mesel Atlası örtüşme:** "Matar" hem burada hem Mesel Atlası'nda (su imge evreni) var — farklı açılardan aynı veri
- **Sebeb-i Nüzul:** İlgili ayetlerin nüzul sebebi varsa link

---

## 10. Phased Content Rollout

**Phase 1 (MVP — 15 grup, ~75 kelime, ~800 ayet):**
- Korku, Yağmur, Rüzgâr, İnsan, Kalp, Yaratma, Yol (sebîl/sırât), Yakîn, Ateş, Düşünme, Bilgi, İndirme (enzele/nezzele), Toprak, Günah, Çocuk

**Phase 2 (+15 grup, +85 kelime, +~400 ayet):** Kalan kategoriler

**Phase 3 (uzmanlık grupları):** Namaz terimleri (rükû/sücûd/kıyâm), mali terimler (zekât/sadaka/infâk/kerem)

---

## 11. Data Collection Methodology

**Kaynaklar (sıra önemli):**
1. **Kur'an Arabic Corpus** (corpus.quran.com) — kelime indeksleri ve geçiş listesi
2. **Askerî, el-Furûk fi'l-Lüga** — ayrım prensipleri
3. **İsfahânî, Müfredât** — kök analizleri ve anlam alanları
4. **İbn Kayyım, Medâricü's-Sâlikîn** — özellikle korku ve umut makamları
5. **Manuel doğrulama** — her ayet referansı kontrol edilir, bağlam etiketi elle atanır

**MVP veri oluşturma maliyeti:** 
- 75 kelime × ortalama 10 geçiş = ~750 ayet referansı
- Her ayet: ref + targetWordIndex + context + note = ~30 saniye
- Toplam: ~6 saat
- Her grup için ~2 cümle prensip metni: 15 × 10 dk = 2.5 saat
- **Toplam veri hazırlama: ~10 saat**

---

## 12. Mobile Rules

- `isMobile`: `window.innerWidth < 640`
- Tab bar horizontal scroll
- Panorama kategori grid: 1 sütun
- Semantic map SVG: responsive width, noktalar küçültülmüş
- Kelime detay kartları: full width
- Ayet listesi: expand edildiğinde Arapça metin wrap eder, Türkçe altta
- Highlighted kelime mobilde de belirgin (altın + underline)
- Touch targets: min 44px

---

## 13. Design Tokens

Standard `COLORS.*`, `FONTS.*` (CLAUDE.md §13.1).  
Arabic: `FONTS.quran`, `dir="rtl"`, `lang="ar"`, `cleanArabic()`.  
Custom additions:
- `CONTEXT_COLORS` object (§5.4)
- `.furuk-highlight` class (§5.5)

---

## 14. Out of Scope

- English content (i18n placeholder)
- Audio karşılaştırmaları
- AI destekli "bağlam önerisi"
- Tam Askerî korpusu (sadece Kur'an'ı ilgilendiren 30+ grup)
- Otomatik kök tespiti — manuel indeks kullanılır
- Hadis karşılaştırmaları
