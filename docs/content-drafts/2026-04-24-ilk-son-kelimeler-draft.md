# Content Draft — F-11: İlk ve Son Kelimeler
Tarih: 2026-04-24
Mod: Makro (yeni tool önerisi)
Önerilen dosya: `public/ilk-son-kelimeler.json`
Önerilen component: `src/components/IlkSonKelimeler.jsx`
Üreten: qc-content-producer
Durum: TASLAK — Aşama 2 kullanıcı onayı bekleniyor

---

## 0. Özet

Her sûrenin **ilk kelimesi** ve **son kelimesi**ni aynı ekranda gösteren bir keşif aracı. Üç katmanlı yapı:

- **Katman 1 — Saf Veri (114 sûre):** ilk/son kelime (Arapça + transliterasyon + kısa anlam + kök — opsiyonel)
- **Katman 2 — Sistemik Pattern'ler:** agregasyon sayıları (kaç sûre "Kul" ile başlar, kaç mukattaa, kaç yemin ile, vb.) — her sayım için doğrulanabilir sûre listesi
- **Katman 3 — Kaynaklı Yorum (10–15 sûre):** klasik nazm/munâsebe geleneğinden gelen **sağlam** yorumlar; kaynak bulunamayan sûreler listeden düşer

**Temel ilke:** Her iddia doğrulanabilir. Kaynaksız yorum yok. Şüphede `🔍 doğrulanamadı` işareti. Arapça metin **asla üretilmez** — hep `verse-graph-bgem3.json` (standart encoding, tüm projede tek doğruluk kaynağı) üzerinden çekilir.

---

## 1. Konsept

Bu araç, Kur'ân'ın 114 sûresini **iki uç nokta** üzerinden okur: sûrenin nasıl başladığı ve nasıl bittiği. Mushafta görünür ama göze çarpmayan bu iki nokta, sûre boyutunda sistemik pattern'ler barındırır:

- Bazı sûre grupları **aynı kelimeyle** açılır (örn. "Kul" = "Söyle!" hitabı)
- Bazıları **ilâhî bir isimle** kapanır (Allah, Rabb, Rahmân...)
- Bazıları **yemin ile** açılır (Wa'l-Fecr, Wa'ş-Şems, Wa't-Tîn...)
- Bazıları **mukattaa harfleri** ile açılır (29 sûre — Elif Lâm Mîm, Yâ-Sîn, Kâf...)
- Bazı sûrelerin ilk ve son kelimesi **tematik bir çerçeve** (nazm / munâsebe) oluşturur — klasik tefsir geleneğinde "başlangıç-bitiş uyumu" olarak incelenir

### Site-fit

Site'nin **"Awe — aynalarda ayna"** evresine doğrudan hizmet eder. Mevcut `HiddenArchitecture` (ring composition) ve `MunasebatAtlasi` (sûreler arası bağlantılar) **dış ve makro yapıyı** gösterir; bu tool **mikro düzeyde**, her tekil sûrenin kendi iç çerçevesini açar. Kullanıcı sonuçta şunu görür: "Sûrenin nasıl başladığı ile nasıl bittiği rastgele değil — bir açılış-kapanış diyaloğu var."

---

## 2. Görselleştirme Önerisi

**Önerilen layout (açık sorudur — bkz. §7):**

- **Ana görünüm: grid + filtre.** 114 sûrenin kartları grid'de. Her kart: sûre no + adı (üst), **ilk kelime** (sol), "→" (orta), **son kelime** (sağ), altta kısa tag'ler (`kul-opener`, `oath-opener`, `divine-closer`, vs.).
- **Üstte filtre çipleri (Katman 2 pattern'leri):** "Kul ile başlayanlar (5)", "Mukattaa ile başlayanlar (29)", "İlâhî isimle bitenler (N)", "Yemin ile başlayanlar (N)", vs. Çipe tıklayınca grid filtrelenir.
- **Kart tıklaması → detay panel (sağda veya modal):** ilk ayet tam metni + son ayet tam metni + kök açılımı + (varsa) Katman 3 yorumu.
- **Mobil:** Tek sütun grid, detay aşağı açılan accordion.

Alternatif: Liste (mushaf sırasına göre) + yan panel. Kullanıcı kararına bırakıldı.

---

## 3. Veri Şeması (öneri)

```json
{
  "meta": {
    "version": "1.0",
    "generatedAt": "2026-04-24",
    "bismillahPolicy": "skip",
    "fatihaPolicy": "ayah-1-as-first",
    "transliterationScheme": "ijmes-lite",
    "rootScheme": "arabic-unicode",
    "sources": [
      "verse-graph-bgem3.json (Arapça metin)",
      "corpus.quran.com / Leeds (transliterasyon + kök)",
      "Elmalılı Hak Dini + DİB Meali (kelime-anlam)"
    ],
    "notes": "Katman 1 verisi tarama sonrası, Katman 2 sayımları verse-graph üzerinden hesaplanır. Katman 3 yorumları sınırlıdır — sadece doğrulanmış klasik kaynaklar."
  },
  "surahs": [
    {
      "surah": 1,
      "nameAr": "الفاتحة",
      "nameTr": "El-Fâtiha",
      "nameEn": "The Opening",
      "revelation": "mekki",
      "firstWord": {
        "ar": "الْحَمْدُ",
        "translit": "al-ḥamdu",
        "meaning": "hamd (övgü)",
        "root": "ح م د",
        "fromAyah": "1:1"
      },
      "lastWord": {
        "ar": "الضَّالِّينَ",
        "translit": "aḍ-ḍāllīn",
        "meaning": "sapanlar",
        "root": "ض ل ل",
        "fromAyah": "1:7"
      },
      "openerTags": ["divine-praise"],
      "closerTags": ["divine-negative"],
      "hasMukattaa": false,
      "hasOath": false,
      "note": null,
      "tafsirNotes": [
        {
          "sourceTr": "Fahruddîn er-Râzî, Mefâtîhu'l-Gayb, Fatiha tefsiri girişi",
          "sourceEn": "Fakhr al-Din al-Razi, Mafatih al-Ghayb, intro to Surah al-Fatiha",
          "textTr": "...",
          "textEn": "...",
          "verified": false,
          "notes": "Kaynak tarama tamamlandığında verified:true olur; aksi halde bu sûreden tafsirNotes düşer."
        }
      ]
    }
  ],
  "patterns": {
    "kulOpener": {
      "labelTr": "\"Kul\" (Söyle!) ile başlayanlar",
      "labelEn": "Chapters opening with \"Qul\" (Say!)",
      "count": null,
      "surahs": [],
      "descTr": "Kur'ân'ın Peygamber'e doğrudan hitap biçimi. Kısa sûrelerde yoğunlaşır.",
      "descEn": "The Qur'an's direct address to the Prophet. Clusters in short Surahs.",
      "source": "verse-graph-bgem3.json taraması"
    },
    "mukattaaOpener": { "labelTr": "Mukattaa harfleri ile başlayanlar", "count": 29, "surahs": [2,3,7,10,11,12,13,14,15,19,20,26,27,28,29,30,31,32,36,38,40,41,42,43,44,45,46,50,68], "source": "Wikipedia / Muqatta'at + doğrulama" },
    "oathOpener": { "labelTr": "Yemin (vav al-qasam) ile başlayanlar", "count": null, "surahs": [], "descTr": "..." },
    "divineNameCloser": { "labelTr": "İlâhî isim ile bitenler", "count": null, "surahs": [] },
    "innaOpener": { "labelTr": "\"İnnâ / İnne\" ile başlayanlar", "count": null, "surahs": [] },
    "imperativeOpener": { "labelTr": "Emir fiili (Kul, İkra', Sebbih, ...) ile başlayanlar", "count": null, "surahs": [] }
  }
}
```

**Şema notları:**
- `openerTags` / `closerTags`: filtreleme için (birden fazla olabilir)
- `verified: false` olan `tafsirNotes` ön kabul edilmez — Aşama 3 (JSON üretim) öncesi kaynak tarama yapılır, doğrulanmayanlar çıkarılır
- `patterns.count: null` → Aşama 3'te verse-graph taranınca doldurulur (bu draft "hipotez + doğrulama protokolü" sunar)

---

## 4. Bismillah ve Fatiha Kararı

### Bismillah (genel)

`verse-graph-bgem3.json` yapısında Bismillah Fatiha dışında **ayet 1 olarak sayılmaz**. 9. sûre Tevbe'de zaten Bismillah yoktur. Neml 27:30'daki Bismillah ayet içeriğinin parçasıdır (Süleyman'ın Sebâ melikesine mektubu), sûre girişi değildir.

**Karar (öneri):** 113 sûrede Bismillah **atlanır**; tool'un "ilk kelimesi" = ilk mushaf-içerik kelimesidir. Tevbe için ayet 9:1'in ilk kelimesi ("Barâ'etun") alınır.

### Fatiha: Özel Durum (iki seçenek — kullanıcı kararı)

Fatiha'da Bismillah (1:1) **ayet olarak sayılır mı?** Klasik fıkhî/usûlî ihtilaftır:

- **Seçenek A — Şâfiî sayımı:** Bismillah Fatiha'nın 1:1'idir. İlk kelime = **"بِسْمِ"** (bismi, "adıyla"), son kelime = "aḍ-ḍāllīn" (1:7).
- **Seçenek B — Hanefî sayımı:** Bismillah ayet-i müstakille sayılır (ayrı bir ayet, Fatiha'nın içinden değil). Fatiha'nın ilk ayeti 1:1 "al-ḥamdu lillâhi..." olur. İlk kelime = **"الْحَمْدُ"** (al-ḥamdu), son kelime = "aḍ-ḍāllīn".

**Agent önerisi:** **Seçenek B (Hanefî sayımı)**. Gerekçe:
1. `verse-graph-bgem3.json` zaten Fatiha'yı 7 ayet olarak tutar — Bismillah 1:1 olarak işaretli ama **diğer 112 sûredeki Bismillah'ın ayet sayılmadığı** tutarlı sistem düşünüldüğünde, Fatiha'yı da bu sistemle hizalamak daha temizdir.
2. "al-ḥamdu" ile "aḍ-ḍāllīn" çerçevesi klasik tefsir literatüründe **hamd açılışı + dua kapanışı** yapısı olarak incelenir.
3. Türkiye'de yaygın mezhep Hanefî — site kullanıcı kitlesine de uyar.

🔍 **Ama tool'da `bismillahPolicy` meta alanı** görülebilir bir şekilde sunulur; kullanıcı hangi sayımla bakıldığını bilir. İki seçenekli toggle de mümkündür (ileride). **Nihai karar kullanıcının.**

---

## 5. Katman 1 — Örnek Kartlar (10 sûre)

Bu 10 örnek kart, Aşama 3'te 114'ün tümü için kullanılacak formatı sabitler. Veriler:
- **Arapça:** `verse-graph-bgem3.json`'dan çekilecek (aşağıdaki örnekler Leeds + acikkuran karşılaştırmasıyla doğrulandı)
- **Transliterasyon + kök:** Leeds Corpus (corpus.quran.com/wordbyword.jsp)
- **Kısa anlam (Tr):** Elmalılı + DİB meali + Türkçe kök sözlüğü

> Not — Transliterasyon şeması: **IJMES-lite** (ṣ, ḥ, ʿ, ā, ī, ū). Leeds'in kendi kanonik formatı Buckwalter-benzeri (ör: "qwl", "rHm") olsa da, son kullanıcıya IJMES daha okunaklı. İkisi arasında **kullanıcı seçsin** — açık soru.

### 5.1 Fâtiha (1) — mekkî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | الْحَمْدُ | al-ḥamdu | hamd, övgü | ح م د | 1:1 (Hanefî) / 1:2 (Şâfiî) |
| **Son kelime** | الضَّالِّينَ | aḍ-ḍāllīn | sapanlar | ض ل ل | 1:7 |

- `openerTags`: `divine-praise`, `definite-noun`
- `closerTags`: `divine-negative`, `participle-plural`
- Not: Hanefî sayımıyla. Şâfiî sayımıyla ilk kelime "bismi" (ب س م, "adıyla").

### 5.2 Bakara (2) — medenî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | الم | alif-lām-mīm | (mukattaa — harf üçlüsü) | — | 2:1 |
| **Son kelime** | الْكَافِرِينَ | al-kāfirīn | kâfirler | ك ف ر | 2:286 |

- `openerTags`: `mukattaa`
- `closerTags`: `divine-negative`, `participle-plural`
- Not: Mukattaa harfleri için kök yoktur (tartışmalı yoruma girmez).

### 5.3 Yûsuf (12) — mekkî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | الر | alif-lām-rā | (mukattaa) | — | 12:1 |
| **Son kelime** | يُؤْمِنُونَ | yu'minūn | iman ederler | ء م ن | 12:111 |

- `openerTags`: `mukattaa`
- `closerTags`: `verb-imperfect`, `divine-positive`

### 5.4 Yâsîn (36) — mekkî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | يس | yā-sīn | (mukattaa) | — | 36:1 |
| **Son kelime** | تُرْجَعُونَ | turjaʿūn | döndürüleceksiniz | ر ج ع | 36:83 |

- `openerTags`: `mukattaa`
- `closerTags`: `verb-passive`, `eschatological`

### 5.5 Rahmân (55) — (mekkî/medenî tartışmalı; çoğunluk mekkî)

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | الرَّحْمَنُ | ar-raḥmānu | Rahmân | ر ح م | 55:1 |
| **Son kelime** | الْإِكْرَامِ | al-ikrām | ikram, yüceltme | ك ر م | 55:78 |

- `openerTags`: `divine-name`
- `closerTags`: `divine-attribute`

### 5.6 Mülk (67) — mekkî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | تَبَارَكَ | tabāraka | ne yücedir / mübarek kılındı | ب ر ك | 67:1 |
| **Son kelime** | مَعِينٍ | maʿīn | akan (su kaynağı) | ع ي ن | 67:30 |

- `openerTags`: `divine-praise`, `verb-past`
- `closerTags`: `descriptive-noun`

### 5.7 Fecr (89) — mekkî

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | وَالْفَجْرِ | wa'l-fajr | şafağa and olsun | ف ج ر | 89:1 |
| **Son kelime** | جَنَّتِي | jannatī | cennetim | ج ن ن | 89:30 |

- `openerTags`: `oath`, `cosmic-oath`
- `closerTags`: `eschatological`, `possessive-divine`

### 5.8 İhlâs (112) — (mekkî/medenî tartışmalı)

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | قُلْ | qul | söyle | ق و ل | 112:1 |
| **Son kelime** | أَحَدٌ | aḥadun | tek, bir | ء ح د | 112:4 |

- `openerTags`: `imperative`, `kul-opener`
- `closerTags`: `divine-attribute`, `tawhid`

### 5.9 Nâs (114) — (mekkî/medenî tartışmalı)

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | قُلْ | qul | söyle | ق و ل | 114:1 |
| **Son kelime** | النَّاسِ | an-nās | insanlar | ن و س | 114:6 |

- `openerTags`: `imperative`, `kul-opener`
- `closerTags`: `humanity-theme`

### 5.10 Alak (96) — mekkî (ilk vahiy)

| | Arapça | Transliterasyon | Anlam (Tr) | Kök | Ayet |
|---|---|---|---|---|---|
| **İlk kelime** | اقْرَأْ | iqra' | oku | ق ر ء | 96:1 |
| **Son kelime** | وَاقْتَرِبْ | wa'qtarib | ve yaklaş | ق ر ب | 96:19 |

- `openerTags`: `imperative`, `iqra-opener`
- `closerTags`: `imperative`, `tasavvufi-resonance` (tartışmalı tag — Katman 3 içinde hedge'lenir)

---

## 6. Katman 2 — Sistemik Pattern'ler

Aşağıdaki pattern'ler **verse-graph-bgem3.json taranarak** doğrulanır. Bu draft'taki sayılar **hipotez + güvenilir dış referans**'tır; Aşama 3'te JSON üretimi sırasında tüm 114 sûre taranıp sayılar kesinleştirilir ve her sayım için sûre listesi dondurulur.

### 6.1 Mukattaa ile başlayanlar — **29** (doğrulanmış)

Kaynak: Wikipedia "Muqatta'at" + birden fazla klasik eserde aynı sayı.

Sûreler: 2, 3, 7, 10, 11, 12, 13, 14, 15, 19, 20, 26, 27, 28, 29, 30, 31, 32, 36, 38, 40, 41, 42, 43, 44, 45, 46, 50, 68.

### 6.2 "Kul" (emri) ile başlayanlar — 🔍 doğrulama gerekiyor

Spot-test sonuçları (acikkuran API):
- 72 (Cin), 109 (Kâfirûn), 112 (İhlâs), 113 (Felak), 114 (Nâs) ← doğrulandı

Toplam "Kul" ile **mutlak başlayan** sûre sayısı için Aşama 3'te tam tarama. Hipotez: **5 sûre** (yukarıdaki liste), ama verse-graph doğrulaması şarttır. Bazı sûreler içindeyken "Kul" kelimesi defalarca geçer, bu pattern sadece ilk kelime ile ilgilidir.

### 6.3 Yemin (vav al-qasam) ile başlayanlar — 🔍 doğrulama gerekiyor

Hipotez listesi (klasik aksâmü'l-Kur'ân literatüründen — İbn Kayyim *et-Tibyân fî Aksâmi'l-Kur'ân*): Sûre 37 (Sâffât), 51 (Zâriyât), 52 (Tûr), 53 (Necm), 68 (Kalem — burada yemin "nun ve'l-kalemi"), 75 (Kıyâme — "lâ uksimu"), 77 (Mürselât), 79 (Nâziât), 85 (Bürûc), 86 (Târık), 89 (Fecr), 90 (Beled — "lâ uksimu"), 91 (Şems), 92 (Leyl), 93 (Duhâ), 95 (Tîn), 100 (Âdiyât), 103 (Asr).

Not: "Lâ uksimu" formu **olumsuzlama değil tekîd yemin** sayılır (İbn Kayyim'de tartışması var). **Kaynak tarama sırasında** doğrulanacak. Mutlak sayı Aşama 3'te.

### 6.4 Mukattaa-OLMAYAN harf açılışları — 🔍 doğrulama gerekiyor

Katman 2'de özel durum: Sûre 48 (Feth) "İnnâ", Sûre 108 (Kevser) "İnnâ" gibi **vurgu partikülü** ile başlayan sûreler. Mukattaa değil, ama dikkat çekici bir opener pattern.

### 6.5 İlâhî isim/sıfat ile biten sûreler — 🔍 doğrulama gerekiyor

Hipotez: Mülk 67 ("xabîr"), Rahmân 55 ("al-ikrām"), Hâkka 69 ("al-azîm"), Ma'âric 70 ("mâ kânû..." — değil), vb. **Tam liste için Aşama 3'te tarama.**

Bu pattern "closer pattern" olarak çok fonksiyonel: sûrenin **Allah'ın bir ismiyle mühürlenmesi**. Klasik tefsirde `hâtimetü's-sûre bi-ismin min esmâillah` olarak bilinir.

### 6.6 Emir-fiili ile açılanlar (imperative opener) — 🔍 doğrulama gerekiyor

- "Kul" (5 hipotez — bkz. 6.2)
- "İqra'" (1 — sadece 96 Alak)
- "Sebbih" (1 — 87 A'lâ) — "sebbiḥ isme rabbike..."
- "Yâ eyyuhe'n-nebiyyu / yâ eyyuhe'l-müddessir / müzzemmil" (3 — 73, 74, 33 Ahzâb) — hitap/imperative
- "İz" ile başlayanlar (örn. 99 Zelzele "İzâ zülzileti'l-arz") — hitap değil, **zaman koşulu**, ayrı kategoride

### 6.7 Genel istatistik ("başla-bitir" dağılımı)

JSON'daki `meta.statistics` alanına konacak toplam:
- Mekkî sûre sayısı: 86 (klasik)
- Medenî sûre sayısı: 28 (klasik)
- Mekkî / medenî ayrımı **gösterilecek** ama filtrelenebilirlik tartışmalı (mekkî/medenî tartışması kalın — Mücâdile 58 vs Taġâbün 64 gibi istisnalar)

### Sayım Protokolü

Aşama 3'te verse-graph üzerinden **kesin sayımlar** yapılırken, her pattern için:
1. **Regex'le algı** (örn. `/^قُلْ\s/` ← ilk kelime "Kul")
2. **Manuel doğrulama** (ilk 3-5 örnekte gözden geçir)
3. **Listeyi JSON'a dondur** (`surahs: [72, 109, 112, 113, 114]`)
4. **Pattern kartında gösterim:** "5 sûre: Cin · Kâfirûn · İhlâs · Felak · Nâs"

---

## 7. Katman 3 — Sourced Commentary (aday listesi)

Katman 3 kartlarının her biri için **doğrulanmış klasik kaynak atfı** zorunludur. Aşağıdaki liste **aday**dır — her biri için Aşama 3 öncesi kaynak tarama yapılır; doğrulanamayan sûreler listeden düşer.

🔍 **Kritik not:** Bu draft hazırlanırken `altafsir.com` üzerinden Râzî/Mefâtîh gibi kaynakların doğrudan metnine erişilemedi (site navigation sayfası döndü). Kaynak doğrulama için Aşama 3'te şu seçenekler önerilir:
- Offline klasik tefsir PDF/metin kaynakları (eğer elimizde varsa — varlığı kullanıcıdan teyit edilmeli)
- `tafsir.app`, `quran.com` (İbn Kesîr, Jalalayn — kısıtlı İngilizce özetler)
- Türkçe Elmalılı *Hak Dini Kur'ân Dili* — erişimi kolaysa birinci tercih
- Akademik eserler: Raymond Farrin (Structure and Qur'anic Interpretation), Michel Cuypers — sûre-bazında nazm analizi yapar

**Agent disiplin kuralı:** Kaynak doğrulanmazsa sûre Katman 3'ten çıkar. Onaysız tahmin yok.

### 7.1 Güçlü adaylar (klasik munâsebe literatürü zengin)

| # | Sûre | Potansiyel yorum hattı | Tahmini kaynak |
|---|---|---|---|
| 1 | **Fâtiha (1)** | Hamd (övgü) açılışı + Dâllîn (sapanlar) kapanışı: kulun Rabb'e övgü-dua çerçevesi. Sûre klasik tefsirde "el-mesel-i müsennâ" — duânın tam formu | Râzî, *Mefâtîh*, Fâtiha cildi; Elmalılı, *Hak Dini* |
| 2 | **İhlâs (112)** | "Kul" (hitap/emir) ile açılır, "ahad" (tek) ile kapanır. Hitap → ilan → nitelik → tevhid kapanışı; sûrenin kendisi bir "tekit yapısı" | Râzî, *Mefâtîh*; İbn Kesîr |
| 3 | **Nâs (114)** | "Kul" ile açılır, "nâs" (insanlar) ile kapanır. Sûrenin ilk ve son kelimesi arasında "Rabb-i nâs, Melik-i nâs, İlâh-i nâs" zinciri — "insan" hem hitap hedefi hem korunulacak şerrin kaynağı | Râzî, *Mefâtîh*; Bikâî, *Nazmu'd-Durer* |
| 4 | **Felak (113)** | "Kul" ile açılır, "ḥasad" (kıskançlık) ile kapanır (son ayet "iza ḥasad"). Sığınma formülü: Rabb'e sığın → dış şerden → ↑ içsel zulmete (hased) | Râzî, *Mefâtîh* |
| 5 | **Kevser (108)** | "İnnâ" (tekit) ile açılır, "al-abtar" (soyu kesik) ile kapanır. 3 ayetlik sûrede ilk-son zıtlığı: **vereni tanıtan açılış** + **eksileni ilan eden kapanış** | Bikâî, *Nazmu'd-Durer* |
| 6 | **Kâfirûn (109)** | "Kul" ile açılır, "dîn" (din) ile kapanır. "Size sizin dininiz, bana benim dinim" — sûrenin tematik çerçevesi ilk-son kelimeyle kurulmuş | Râzî, *Mefâtîh* |
| 7 | **Asr (103)** | "Wa'l-ʿaṣr" (yemine zamanla) açılış + "aṣ-ṣabr" (sabır) kapanış. Yemin konusu (zaman) + yemin konusunu onurlandıran insan tipinin tarifi (sabır) | İbn Kayyim, *et-Tibyân fî Aksâmi'l-Kur'ân* |
| 8 | **Mâ'ûn (107)** | "A-raayta" (sorusal/şart) ile açılır, "al-mâʿūn" (küçük yardım) ile kapanır. "Dini yalanlayan kim?" → cevap: riya yapan, küçük iyiliği engelleyen | Râzî, *Mefâtîh* |
| 9 | **Yûsuf (12)** | Mukattaa + "qaṣaṣ" (kıssa) kavramı açılır; kapanış: "yu'minūn" (iman ederler). Sûrenin kendi içi bir "iman ispatı"nın kıssasıdır — başlangıçtaki "biz anlatacağız" ile bitişteki "iman ederler" arasında bir ark | Râzî, *Mefâtîh*; Farrin, *Structure and Qur'anic Interpretation* (2014) |
| 10 | **Rahmân (55)** | "ar-Raḥmān" açılışı + "al-ikrām" (ikram) kapanışı. İlk kelime ilâhî rahmet, son kelime ilâhî cömertlik — sûrenin tüm içeriği (kainatta rahmet-ikrâm mizanı) bu iki noktayla çerçevelenir | Râzî, *Mefâtîh*; İbn Âşûr, *Tahrîr* |
| 11 | **Mülk (67)** | "tabāraka" (mübarek kılındı — mülk O'nundur) + "maʿīn" (akan su kaynağı). Sûrenin teolojik çerçevesi: ilahi mülk → ahiret yargısı → küçük detay (su) ile bağlanır. Bikâî bu tür kapanışları "incelik kapısı" olarak niteler | Bikâî, *Nazmu'd-Durer* |
| 12 | **Bakara (2)** | Mukattaa açılış + "al-kāfirīn" kapanışı. Sûrenin ilk tema: Kitap'a iman / küfür ayrımı; son dua-ayeti de (2:286) iman topluluğunun Allah'a sığınarak kâfirlere karşı yardım isteyişi. İlk tematik ayrım + son pratik dua | Râzî, *Mefâtîh*; Cuypers, *The Composition of the Qur'an* |

### 7.2 Zayıf adaylar (muhtemelen listeden çıkar)

- **Alak (96):** "İqra'" + "iqtarib" — iki emir fiili arasındaki ark (oku → yaklaş). Zayıf çünkü spesifik munâsebe literatürü az, spekülasyon riski yüksek. Kullanıcı onayıyla tutulabilir.
- **Fecr (89):** Yemin açılışı ("wa'l-fajr") + "jannatī" (cennetim) kapanışı. Güzel bir zıtlık ama munâsebe tefsirinde **net kaynak** bulunamadıysa listeden çıkar.

### 7.3 Yorum Dili Kuralları

Katman 3 kart metni **asla kesin dille** yazılmaz:
- ❌ "Sûrenin ilk ve son kelimesi bu yüzden seçilmiştir"
- ❌ "Kur'ân burada şu mucizeyi gösterir"
- ✅ "Râzî bu ilişkiyi şöyle okur: ..."
- ✅ "Klasik nazm literatüründe bu yapı `hâtimetü's-sûre` olarak bilinir — sûrenin bir ilâhî isimle mühürlenmesi."
- ✅ "Bikâî *Nazmu'd-Durer*'de bu iki kelimeyi sûrenin tematik iki direği olarak okur."

Her `textTr` / `textEn` 2–3 cümle, kaynak atfı zorunlu.

---

## 8. i18n Anahtarları Önerisi

`tr.json` ve `en.json`'a eklenecek anahtarlar (kullanıcı manuel merge edecek):

```json
"firstLastWords": {
  "nav": "İlk ve Son Kelimeler",
  "title": "Her Sûrenin İlk ve Son Kelimesi",
  "subtitle": "Kur'ân'ın 114 sûresi — nasıl başladı, nasıl bitti?",
  "intro": "Mushaftaki her sûrenin iki ucuna bakmak. İlk kelimesi ve son kelimesi. Tesadüf değil, desen.",
  "filter": {
    "all": "Tümü",
    "kulOpener": "\"Kul\" ile açılanlar",
    "mukattaaOpener": "Mukattaa ile açılanlar",
    "oathOpener": "Yemin ile açılanlar",
    "imperativeOpener": "Emir fiili ile açılanlar",
    "divineNameCloser": "İlâhî isim ile kapananlar"
  },
  "card": {
    "firstWord": "İlk kelime",
    "lastWord": "Son kelime",
    "root": "Kök",
    "openedWith": "Açılış",
    "closedWith": "Kapanış"
  },
  "detail": {
    "firstAyah": "İlk ayet",
    "lastAyah": "Son ayet",
    "tafsirNote": "Klasik yorum notu",
    "source": "Kaynak",
    "bismillahPolicy": "Bismillah sayımı"
  },
  "pattern": {
    "count": "{{n}} sûre",
    "showList": "Sûre listesini göster"
  },
  "methodology": "Arapça metin verse-graph-bgem3 kaynaklıdır. Transliterasyon Leeds Corpus. Klasik yorumlar kaynak atfıyla — kaynak bulunamayan yorum eklenmez."
}
```

EN eşdeğerleri aynı şemada, farklı dillerde.

---

## 9. Section İskeleti (Wireframe — pseudo-JSX)

Sadece yapı, stil token'ları referanslıdır.

```
<Overlay>
  <Header style={OVERLAY_TITLE}>
    İlk ve Son Kelimeler | Close
  </Header>

  <Body>
    <IntroBlock max-w-3xl>
      <SectionLabel />
      <H2 style={FONTS.display}>Her Sûrenin İki Ucu</H2>
      <P style={TEXT.muted}>Kur'ân'ın 114 sûresi — nasıl başladı, nasıl bitti?</P>
    </IntroBlock>

    <FilterChipRow overflowX=auto>
      {Object.keys(patterns).map(key => <Chip ...)}
    </FilterChipRow>

    <Grid columns={isMobile ? 1 : 3}>
      {filteredSurahs.map(s => (
        <SurahCard
          onClick={() => selectSurah(s)}
          style={GLASS_CARD}>
          <Top>{s.surah}. {s.nameTr}</Top>
          <Row>
            <FirstWordCell style={TEXT.verseArabic}>{s.firstWord.ar}</FirstWordCell>
            <Arrow>→</Arrow>
            <LastWordCell style={TEXT.verseArabic}>{s.lastWord.ar}</LastWordCell>
          </Row>
          <Tags>{s.openerTags + s.closerTags}</Tags>
        </SurahCard>
      ))}
    </Grid>

    {selectedSurah && (
      <DetailPanel (modal on mobile, side-panel on desktop)>
        <FirstAyahBlock style={VERSE_BLOCK} />
        <WordCardsRow>
          <WordCard label="İlk kelime" ar translit meaning root />
          <WordCard label="Son kelime" ar translit meaning root />
        </WordCardsRow>
        <LastAyahBlock style={VERSE_BLOCK} />
        {tafsirNote && <TafsirNoteBlock source textTr />}
      </DetailPanel>
    )}

    <PatternPanel>
      {Object.entries(patterns).map(([key, p]) => (
        <PatternCard>
          <Count>{p.count}</Count>
          <Label>{p.labelTr}</Label>
          <SurahList>{p.surahs.join(' · ')}</SurahList>
        </PatternCard>
      ))}
    </PatternPanel>
  </Body>
</Overlay>
```

---

## 10. Kaynaklar (toplu)

### Birincil
- **`public/verse-graph-bgem3.json`** — Arapça metin (standart encoding), TR/EN meal
- **Leeds Quranic Arabic Corpus** (corpus.quran.com) — transliterasyon + kök, word-by-word
- **Wikipedia: Muqatta'at** (doğrulama: 29 sûre listesi)
- **Wikipedia: Basmala** (doğrulama: 112 sûre Bismillah ile, Tevbe istisna, Neml çift)

### Katman 3 için Klasik Tefsir (kaynaklar doğrulama gerektirir)
- **Fahruddîn er-Râzî** — *Mefâtîhu'l-Gayb*
- **Burhâneddîn el-Bikâî** — *Nazmu'd-Durer fî Tenâsubi'l-Âyât ve's-Süver* (nazm/munâsebe eseri — tam konu eşleşmesi)
- **İbn Âşûr** — *et-Tahrîr ve't-Tenvîr*
- **İbn Kesîr** — *Tefsîru'l-Kur'âni'l-Azîm*
- **İbn Kayyim** — *et-Tibyân fî Aksâmi'l-Kur'ân* (yemin-açılışlı sûreler için)
- **Elmalılı Hamdi Yazır** — *Hak Dini Kur'ân Dili*

### Modern Akademi
- **Raymond Farrin** — *Structure and Qur'anic Interpretation* (2014)
- **Michel Cuypers** — *The Composition of the Qur'an* (2015)

### Kelime-Anlam Referansları
- **Elmalılı** — TR kelime anlamları
- **Diyanet İşleri Başkanlığı Meali** — TR
- **Lane's Arabic-English Lexicon** (EN kısa anlamlar için)

---

## 11. Açık Sorular — Kullanıcı Kararı

### Q1 — Fatiha sayımı
- **Seçenek A:** Şâfiî sayımı (Bismillah = 1:1, ilk kelime = "bismi")
- **Seçenek B:** Hanefî sayımı (Bismillah ayri ayet, ilk kelime = "al-ḥamdu") — **agent önerisi**

### Q2 — Transliterasyon şeması
- **Seçenek A:** IJMES-lite (ṣ, ḥ, ʿ, ā, ī, ū) — akademik, okunaklı — **agent önerisi**
- **Seçenek B:** Türkçe-dostu Latin (sâd, hâ, ayın, â, î, û) — Türkiye okuyucusuna tanıdık
- **Seçenek C:** Leeds Buckwalter (qwl, rHm) — teknik, lookup'a uygun

### Q3 — Kök verisi kapsamı
- **Seçenek A:** 114 sûrenin tamamı için kök (hem ilk hem son kelime için) — en zengin
- **Seçenek B:** Sadece Katman 3 kartlarında (10–15 sûre) — hafif — **agent önerisi (başlangıç için)**
- **Seçenek C:** Hiç kök yok, sadece Arapça + anlam — minimal

**Agent önerisi Seçenek B**: Aşama 3'te Leeds taramasının ağırlığı düşünüldüğünde başlangıçta kısıtlı tutulsun, v2'de tüm 114 sûre eklenebilir.

### Q4 — Kök formatı
- **Seçenek A:** Arapça Unicode (ح م د) — okunaklı — **agent önerisi**
- **Seçenek B:** Buckwalter transliterasyonu (Hmd) — teknik

### Q5 — Görselleştirme
- **Seçenek A:** Grid + filter + detay modal — **agent önerisi**
- **Seçenek B:** Mushaf-sırası liste + yan panel
- **Seçenek C:** Timeline (nüzûl sırası) — bağlam kaybı olabilir

### Q6 — Katman 3 kapsam
- **Seçenek A:** Sadece "güçlü adaylar" listesi (12 sûre) — **agent önerisi**
- **Seçenek B:** Tüm adaylar (14+ sûre), zayıflar hedge tag'iyle
- **Seçenek C:** Daha dar — sadece kaynak %100 doğrulanabilir olan 6–8 sûre

### Q7 — Pattern sayım kesinliği
Aşama 3 JSON üretimi sırasında verse-graph taraması yapılacak. Bu doğrulamayı agent yapsın mı (evet/hayır), yoksa kullanıcı manuel mi doğrulayacak?

---

## 12. Uyarılar / Halisinasyon Riski

- ⚠️ **Transliterasyon hatası riski:** Leeds'i esas alıyoruz ama tüm 114 sûre için **manuel spot-check** şart (özellikle hamze, şedde, madde durumları). Aşama 3'te ilk 10 sûreden sonra örnekleme kontrolü.
- ⚠️ **Kelime sınırı belirsizliği:** Arapça'da "ilk kelime" tanımı bazen tartışmalıdır (örn. prefiksli "wa'l-..." iki morfem mi tek kelime mi). **Karar: Leeds'in word boundary'sini baz alıyoruz** — "wa'l-fajr" tek "söz birimi" değil, **"wa" + "l-fajr"** iki kelime. Tool'da **"wa'l-fajr"** olarak bütün gösterilir (yemin formü), ama kök "ف ج ر" alınır.
- ⚠️ **Mekkî/Medenî etiketi:** Bazı sûreler için ihtilaf var (örn. Rahmân 55, İhlâs 112). Tool'da "mekkî" deyip geçmek riskli — ya **etiket koymayalım**, ya da `revelation: "mekki-tartismali"` gibi hedge değeri kullanalım.
- ⚠️ **Katman 3 yorum spekülasyonu:** "İlk ve son kelime bilinçli seçilmiş" iddiası **teolojik** bir iddiadır. Agent bunu asla kategorik söylemez. Her yorum "Râzî'ye göre" / "Bikâî bu ilişkiyi şöyle okur" ile başlar.
- ⚠️ **Kaynak erişim engelleri:** altafsir.com navigation page döndü. Eğer kullanıcıda offline klasik tefsir metinleri yoksa, Katman 3 çok daralır (belki 4-6 sûreye kadar). Agent risk altı çizilir, kullanıcı karar versin.
- ⚠️ **"Divine-negative" / "divine-positive" gibi tag'ler subjektiftir:** Kullanıcı bu semantiği reddedebilir. Tag sistemi alternatif: nötr kategoriler (`imperative`, `oath`, `proper-noun`, `participle`, `letter-group`) + tematik tag'ler ayrı katmanda.

---

## 13. Önerilen Aşama 3 İş Planı

Onay sonrası (Aşama 2 karar verildikten sonra):

1. **verse-graph-bgem3 tam tarama:**
   - Her 114 sûre için `firstAyah` (Bismillah skip politikasına göre) ve `lastAyah` al
   - İlk kelime / son kelime çıkar (Leeds word-boundary referansıyla)
   - Arapça metni değiştirmeden kopyala

2. **Leeds lookup (kök + transliterasyon):**
   - Katman 3 sûreleri için tam lookup
   - Diğer 100 sûre için opsiyonel (Q3 kararına göre)

3. **Pattern sayımları:**
   - 6 pattern için kesin liste (6.1–6.6)
   - Her liste JSON'a dondurulur

4. **Katman 3 kaynak doğrulama:**
   - Her 10–15 aday sûre için kaynak tarama (kullanıcı yardımıyla — offline tefsir kaynağı varsa kritik)
   - Doğrulanamayan sûreler listeden çıkarılır

5. **JSON üretimi:**
   - `public/ilk-son-kelimeler.json` yazılır
   - Duplicate kontrolü (benzer tool yok, ama tag adları diğer JSON'larla çakışmasın)

6. **i18n anahtarları:**
   - TR + EN blokları hazır, kullanıcı manuel merge

**Tahmini süre:** 1-2 saat (sıkı tarama + manuel spot-check için). Katman 3 için kaynak erişimine bağlı — en değişken kısım.

---

**Onay bekliyorum.**

Aşama 2 kararlarını (Q1–Q7) verdikten sonra Aşama 3'e geçiyorum. Kaynak erişim engeli varsa onu da bildirin — Katman 3 kapsamı ona göre ayarlanır.
