# Kur'an Retoriği — Overlay Tool Design Spec

**Date:** 2026-04-01  
**Status:** Approved  
**Scope:** New overlay tool for QuranRhetoric enrichment

---

## 1. Problem Statement

`QuranRhetoric.jsx` (ana sayfada `/` URL) mevcut haliyle ~1.000 soru bilgisini yüzeysel veriyor: 4 kategori özeti, donut chart, 6 soru kartı, 114 sure heatmap. Kullanıcı spesifikasyonu 6 zenginleştirme talep ediyor: genişletilmiş kategori kartları, alt kalıplar, "Ve Mâ Edrâke" gibi özel kalıplar, muhatap analizi, 30 filtrelenebilir soru ve tıklanabilir heatmap. Bu içerik hacmi ana sayfa section'ına sığmıyor.

---

## 2. Proposed Solution

**Yeni overlay component:** `src/components/KuranRetorigi.jsx`  
**Pattern:** KuranYeminleri / KavimlerAtlasi ile aynı (Navbar'dan açılan tam ekran overlay)  
**Ana sayfa:** `QuranRhetoric.jsx` dokunulmaz — sadece en alta bir CTA butonu eklenir  
**Veri:** `public/kuran-retorigi.json`

---

## 3. Architecture

### 3.1 Yeni Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/components/KuranRetorigi.jsx` | Ana overlay component |
| `public/kuran-retorigi.json` | Tüm içerik verisi |

### 3.2 Değiştirilen Dosyalar

| Dosya | Değişiklik |
|-------|------------|
| `src/components/Navbar.jsx` | lazy import + state + anyOpen + popstate + tools array + JSX |
| `src/sections/QuranRhetoric.jsx` | En alta "Detaylı İncele" CTA butonu eklenir |

### 3.3 Navbar Entegrasyon Adımları

KuranYeminleri, Melekler, DogaAtlasi, KavimlerAtlasi, CennetCehennem — hepsi `exploreOpen` (Keşfet) dropdown'unda, `tools` array'inde değil. KuranRetorigi aynı pattern'i izler.

1. `const KuranRetorigi = lazy(() => import('./KuranRetorigi'))` — top-level lazy import (satır ~24 civarı)
2. `const [retorigiOpen, setRetorigiOpen] = useState(false)` — state (satır ~185 civarı)
3. `anyOpen` expression'ına `|| retorigiOpen` ekle
4. `popstate` handler'ına `if (retorigiOpen) { setRetorigiOpen(false); return; }` ekle
5. `exploreOpen` dropdown içine buton ekle (KuranYeminleri butonunun yanına, aynı sütun yapısı)
6. `window.addEventListener('openKuranRetorigi', ...)` event listener ekle (CTA butonundan tetiklemek için)
7. JSX sonuna `{retorigiOpen && <Suspense fallback={null}><KuranRetorigi onClose={() => setRetorigiOpen(false)} /></Suspense>}` ekle

---

## 4. Tab Yapısı (4 Tab)

```
Kategoriler & Kalıplar | Muhatap Analizi | 30 Soru | Sure Haritası
```

### Tab 1: Kategoriler & Kalıplar

**Layout:** Sol sidebar (sabit genişlik) + Sağ panel (scroll)

**Sidebar:**
- 4 kategori listesi — her biri kendi rengi muted (%30 opacity), aktif olan tam renk + sol border highlight
  - Erotema ~40% → amber `#d4a574`
  - İrşad ~28% → blue `#3498db`
  - Tevbih ~20% → green `#2ecc71`
  - Taaccüb ~12% → purple `#a78bfa`
- Sidebar alt bölümü: "Özel Kalıplar" başlığı + 3 kalıp butonu
  - Ve Mâ Edrâke → coral `#D85A30`
  - Efela Ta'kılûn → teal `#14b8a6`
  - Eleyse → violet `#8b5cf6`

**Sağ panel içeriği (kategori seçiliyken):**
1. Kategori başlığı + badge (oran %)
2. Tanım genişletme (uzun paragraf)
3. Alt kalıplar (3 kart — Arapça kalıp formu, Türkçe açıklama, örnek sure listesi, özellik notu)
4. Örnek ayetler (5 ayet kartı — `VERSE_BLOCK` token kullanarak: Arapça RTL + Türkçe + İngilizce + ref badge)

**Sağ panel içeriği (özel kalıp seçiliyken):**
- "Ve Mâ Edrâke": Kalıp açıklaması + 13 kullanımın tamamı (liste: Arapça kavram + sure ref + cevap özeti) + tefsir notu (edrâke vs yüdrîke farkı)
- "Efela Ta'kılûn": 5 yeti kartı (ta'kıl / tefekkür / tezekkür / basar / semi') her biri Arapça form + kaç ayette + özel rol + en güçlü örnek
- "Eleyse": Açıklama + 6 örnek

**Mobil:** Sidebar gizlenir, header altına yatay kaydırmalı chip row eklenir (`overflowX: 'auto', scrollbarWidth: 'none'`)

---

### Tab 2: Muhatap Analizi

**Title:** "Sorular Kime Soruluyor?" / "Who Is Being Asked?"

5 muhatap grubu — yatay filter pills + altında kart grid:

| Grup | Renk | Örnekler |
|------|------|----------|
| Tüm İnsanlık | amber | İnfitar 82:6 |
| Müşrikler | coral `#e74c3c` muted | Hac 22:73 |
| Ehli Kitap | teal | Bakara 2:44 |
| Münafıklar | slate | Tevbe 9:13 |
| Hz. Peygamber | purple muted | İnşirah 94:1 |

Her kart: grup badge + Arapça ayet + Türkçe/İngilizce + ref + kısa analiz notu

**Mobil:** Tek kolon kart grid, yatay chip pills

---

### Tab 3: 30 Soru

**Filtrelenebilir soru veritabanı**

Filter pills (çoklu seçim):
- Tür: Tümü / Erotema / İrşad / Tevbih / Taaccüb
- Kalıp: Ve Mâ Edrâke / Efela Ta'kılûn
- Muhatap: İnsanlık / Müşrik / Peygamber

Kart formatı (mevcut 6 kart formatını korur + eklemeler):
- Arapça büyük RTL (KFGQPC font)
- Türkçe çeviri (italic)
- İngilizce çeviri (yeni — hover'da değil, her zaman görünür küçük font)
- Sure ref
- Tür badge (kategori rengiyle)
- Kalıp badge (eğer özel kalıba aitse — coral/teal/violet)
- Muhatap badge (yeni — subtle)

**30 soru listesi (sıralı):**
1. أَفَلَا تَعْقِلُونَ — Bakara 2:44 — Erotema / İnsanlık
2. فَأَيْنَ تَذْهَبُونَ — Tekvir 81:26 — Taaccüb / İnsanlık
3. مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ — İnfitar 82:6 — Tevbih / İnsanlık
4. أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ — Nisa 4:82 — Erotema / İnsanlık
5. أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ — İnşirah 94:1 — İrşad / Peygamber
6. فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ — Rahman 55:13 — Taaccüb / İnsanlık
7. الْقَارِعَةُ مَا الْقَارِعَةُ — Karia 101:1-2 — Taaccüb / Ve Mâ Edrâke
8. وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ — Kadr 97:2 — İrşad / Ve Mâ Edrâke
9. أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ — Zümer 39:36 — Erotema / Eleyse
10. مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ — Lokman 31:25 — İrşad / İnsanlık
11. أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ — Gaşiye 88:17 — Erotema / İnsanlık
12. أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى — Kıyame 75:36 — Tevbih / İnsanlık
13. أَلَمْ يَكُ نُطْفَةً — Kıyame 75:37 — İrşad / İnsanlık
14. هَلْ أَتَى عَلَى الْإِنسَانِ — İnsan 76:1 — İrşad / İnsanlık
15. فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ — Tin 95:7 — Tevbih / İnsanlık
16. أَلَيْسَ ذَٰلِكَ بِقَادِرٍ — Kıyame 75:40 — Erotema / Eleyse
17. أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ — Yusuf 12:109 — İrşad / İnsanlık
18. أَفَأَمِنُوا مَكْرَ اللَّهِ — A'raf 7:99 — Tevbih / İnsanlık
19. وَمَا أَدْرَاكَ مَا الْعَقَبَةُ — Beled 90:12 — İrşad / Ve Mâ Edrâke
20. أَيَحْسَبُ أَن لَّمْ يَرَهُ أَحَدٌ — Beled 90:7 — Tevbih / İnsanlık
21. أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ — Fil 105:1 — İrşad / Peygamber
22. كَيْفَ تَكْفُرُونَ بِاللَّهِ — Bakara 2:28 — Tevbih / İnsanlık
23. أَيَطْمَعُ كُلُّ امْرِئٍ — Mearic 70:38 — Taaccüb / İnsanlık
24. أَفَنَجْعَلُ الْمُسْلِمِينَ كَالْمُجْرِمِينَ — Kalem 68:35 — Erotema / İnsanlık
25. هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ — Rahman 55:60 — Erotema / İnsanlık
26. مَا لَكُمْ لَا تَنَاصَرُونَ — Saffat 37:25 — Tevbih / İnsanlık
27. أَلَا يَعْلَمُ مَنْ خَلَقَ — Mülk 67:14 — Erotema / İnsanlık
28. أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ — Mü'minun 23:115 — Tevbih / İnsanlık
29. مَا لَكُمْ كَيْفَ تَحْكُمُونَ — Saffat 37:154 — Tevbih / Müşrik
30. هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ — Zümer 39:9 — Erotema / İnsanlık

**Mobil:** Tek kolon grid, yatay scroll filter pills

---

### Tab 4: Sure Haritası

**Bölüm 1 — Tıklanabilir Heatmap**

Mevcut 114 kare heatmap korunur. Hover/tap tooltip genişletilir:
- Sure adı + numarası
- O suredeki tahmini soru sayısı
- En güçlü soru örneği (Arapça kısa + ref)
- Mini kategori dağılımı (4 renkli nokta)

**Bölüm 2 — En Yoğun 5 Sure**

Heatmap altında 5 kart (yatay scroll veya grid):
1. Bakara — en uzun sure, en fazla soru
2. En'am — tevhid argümanları yoğun
3. Yasin — "Efela" ailesi çok
4. Rahman — "Febieyyi" 31 kez
5. Kıyame — kısa sure, yoğun soru ritmi

Her kart: Sure adı + tahmini soru sayısı + en belirgin kategori badge + ikonik 1 soru

**Bölüm 3 — Karşılaştırmalı Analiz**

"Bir Soru — Dört Farklı Kullanım" başlığıyla:
- Örnek: "Gökleri ve yeri kim yarattı?"
- 3 kolonlu kart (Erotema / İrşad / Tevbih bağlamları) — Taaccüb analiz notu

---

## 5. JSON Veri Yapısı (`public/kuran-retorigi.json`)

```json
{
  "meta": {
    "totalQuestions": 1000,
    "categoryCount": 4,
    "specialPatterns": 3
  },
  "categories": [
    {
      "id": "erotema",
      "color": "#d4a574",
      "pct": 40,
      "nameTr": "Erotema / Retorik",
      "nameEn": "Erotema / Rhetorical",
      "descTr": "...",
      "descEn": "...",
      "subPatterns": [
        {
          "id": "efela-takılun",
          "arabicForm": "أَفَلَا تَعْقِلُونَ",
          "nameTr": "Efela Ta'kılûn Ailesi",
          "nameEn": "Afala Taʿqilun Family",
          "countTr": "~50 ayette",
          "countEn": "~50 verses",
          "noteTr": "...",
          "noteEn": "...",
          "surahs": ["Bakara 2:44", "Yasin 36:68", "En'am 6:32"]
        }
      ],
      "exampleVerses": [
        {
          "ar": "أَفَلَا تَعْقِلُونَ",
          "tr": "Hiç aklınızı kullanmıyor musunuz?",
          "en": "Will you not use your reason?",
          "ref": "Bakara 2:44",
          "surah": 2, "ayah": 44
        }
      ]
    }
  ],
  "specialPatterns": [
    {
      "id": "ve-ma-edrake",
      "color": "#D85A30",
      "arabicForm": "وَمَا أَدْرَاكَ مَا ___",
      "nameTr": "Ve Mâ Edrâke Mâ",
      "nameEn": "And What Will Make You Know",
      "count": 13,
      "descTr": "...",
      "descEn": "...",
      "tefsirNoteTr": "...",
      "tefsirNoteEn": "...",
      "usages": [
        {
          "id": "karia",
          "conceptAr": "الْقَارِعَة",
          "conceptTr": "El-Karia",
          "ref": "Karia 101:3",
          "answerTr": "İnsanlar saçılmış pervane, dağlar atılmış yün",
          "answerEn": "People like scattered moths, mountains like fluffed wool"
        }
      ]
    }
  ],
  "addresseeGroups": [
    {
      "id": "humanity",
      "color": "#d4a574",
      "nameTr": "Tüm İnsanlık",
      "nameEn": "All of Humanity",
      "descTr": "...",
      "descEn": "...",
      "verses": []
    }
  ],
  "questions": [
    {
      "id": "bakara-2-44",
      "ar": "أَفَلَا تَعْقِلُونَ",
      "tr": "Hiç aklınızı kullanmıyor musunuz?",
      "en": "Will you not use your reason?",
      "ref": "Bakara 2:44",
      "surah": 2, "ayah": 44,
      "type": "erotema",
      "pattern": "efela-takılun",
      "addressee": "humanity"
    }
  ]
}
```

---

## 6. Ana Sayfa CTA Butonu (`QuranRhetoric.jsx`)

Mevcut cross-link kartları bloğundan **önce** (veya sonra) bir CTA butonu eklenir:

```jsx
// Navbar'ı tetiklemek için custom event
<button
  onClick={() => window.dispatchEvent(new CustomEvent('openKuranRetorigi'))}
  style={{ /* GLASS_CARD benzeri, altın border */ }}
>
  ↗ Retorik Analizi — 30 soru · kalıplar · muhatap · sure haritası
</button>
```

`Navbar.jsx`'de `openKuranRetorigi` event'ini dinle → `setRetorigiOpen(true)`

---

## 7. Design Tokens

Tüm stiller CLAUDE.md 13.1 kuralına göre `src/tokens.js`'den:
- `OVERLAY_BASE`, `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`
- `COLORS.gold`, `COLORS.silver`, `COLORS.glassBorder`
- `FONTS.quran` — tüm Arapça metinler için zorunlu
- `VERSE_BLOCK` — 5 örnek ayet kartları için

Yeni renkler (token'a eklenmesi gerekecek):
- `coral: '#D85A30'` — Ve Mâ Edrâke kalıbı
- `teal: '#14b8a6'` — Efela Ta'kılûn kalıbı
- `violet: '#8b5cf6'` — Eleyse kalıbı (a78bfa zaten var, bu daha koyu)

---

## 8. Mobil Uyumluluk (CLAUDE.md 14)

- `isMobile` hook tüm component'e eklenir (`window.innerWidth < 640`)
- Sidebar: mobilde `display: 'none'`, yerine header altına chip row
- Kart grid: mobilde `gridTemplateColumns: '1fr'`
- Heatmap: mevcut davranış korunur (zaten responsive)
- Filter pills: `overflowX: 'auto', scrollbarWidth: 'none'`

---

## 9. Cross-Link Entegrasyonları

| Tetikleyici | Hedef |
|-------------|-------|
| "Efela yenzurûn" (Gaşiye 88:17) kart | `window.dispatchEvent(new CustomEvent('openDogaAtlasi'))` |
| "Yeryüzünde gezmediler mi?" kart | `window.dispatchEvent(new CustomEvent('openKavimlerAtlasi'))` |

---

## 10. Kapsam Dışı

- Sure detay sayfaları (Phase 2)
- Ayet audio oynatma
- Soru arama (text search) — filtreler yeterli
- "Karşılaştırmalı Analiz" kendi tab'ı değil, Tab 4'ün alt bölümü
