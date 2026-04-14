# Münasebât — Sure Bağlantıları Atlası — Design Spec
**Date:** 2026-04-14  
**Version:** 1.0  
**Status:** Draft for Approval

---

## 1. Overview

A new full-screen overlay tool ("Münasebât — Sure Bağlantıları") added to QuranCodex.com. This tool reveals the **internal coherence** of the Quran by mapping the thematic, linguistic, and structural connections between surahs. Based on the classical Islamic discipline of **ilmü'l-münâsebât** (the science of correspondences) — specifically **münâsebâtü's-süver** (connections between surahs).

**Core philosophy:** Kur'an'ın 114 suresi rastgele sıralanmış değil. Her sure önceki ve sonraki sureyle tematik, dilsel veya yapısal bağlar taşır. Bu bağlar klasik âlimler tarafından 1000 yıldır çalışılmış bir ilimdir.

**Core question:** "Bakara neden Fâtiha'dan sonra gelir? Duhâ ile İnşirâh neden ikiz sayılır? Fîl ile Kureyş neden tek soluktur?"

---

## 2. Classical Sources (Kaynaklar)

The content of this tool is derived from authoritative works in the discipline:

| Âlim | Tarih | Eser | Katkı |
|------|-------|------|-------|
| **Ebû Bekr en-Neysâbûrî** | ö. 324 H / 936 M | (eseri kayıp) | İlmin kurucusu. Ez-Zerkeşî'nin nakline göre ilk kez münâsebât meselesini sistematik olarak tartışan âlim. |
| **Fahreddîn er-Râzî** | ö. 606 H / 1210 M | *Mefâtîhu'l-Ğayb* | Tefsirinde münâsebât'ı sistematik uygulayan ilk büyük müfessir. "Kur'an'ın güzelliklerinin çoğu münâsebâtın dakikliklerine dayanır." |
| **Ebû Ca'fer Ahmed b. İbrâhîm** | ö. 807 H / 1404 M | *el-Burhân fî Münâsebeti Tertîbi Süveri'l-Kur'ân* | Sure sıralaması hakkında müstakil eser. |
| **Burhâneddîn el-Bikā'î** | ö. 885 H / 1480 M | *Nazmü'd-Dürer fî Tenâsübi'l-Âyâti ve's-Süver* | **Bu ilmin en kapsamlı eseri** — 22 cilt. Her ayet ve sure arasındaki bağı sistematik inceler. |
| **Celâleddîn es-Süyûtî** | ö. 911 H / 1505 M | *Tenâsüku'd-Dürer fî Tenâsübi's-Süver* + *Esrâru Tertîbi'l-Kur'ân* | İlmin teorik temellerini özetleyen iki eser. |
| **Ebû Hayyân el-Endelüsî** | ö. 745 H / 1344 M | *el-Bahrü'l-Muhît* (tefsir) | Münâsebât'ı tefsir metodu olarak kullanan diğer büyük müfessir. |
| **Modern: Muhammed Abduh** | ö. 1323 H / 1905 M | *Tefsîru'l-Menâr* (İkmali Reşid Rızâ) | Modern dönemin ilk sistematik uygulaması. |
| **Modern: Emîn Ahsen Islahî** | ö. 1997 M | *Tedebbür-i Kur'ân* (Urdu) | "Nazmü'l-Kur'ân" teorisiyle çift-sure sistemi savunucusu. |
| **Modern: Fâzıl Sâlih es-Sâmerrâî** | çağdaş | *Lemesât Beyâniyye* | Türkçeye çevrildi. |

### Bir Kelâm-ı Kibâr

> "Kur'an'ın güzelliklerinin çoğu münâsebâtın dakikliklerine ve tenâsübünün inceliklerinde gizlidir."  
> — Fahreddîn er-Râzî, *Mefâtîhu'l-Ğayb* (mukaddime)

> "Her surenin bir ana teması vardır ve sureler arasındaki bağlantı bu temaların örgüsüdür."  
> — el-Bikā'î, *Nazmü'd-Dürer* mukaddimesi

---

## 3. Placement & Integration

- **Type:** Full-screen overlay
- **File:** `src/components/MunasebatAtlasi.jsx`
- **Navbar location:** ANALİZ & VERİ column (Furûk'un yanı)
- **Tool entry:**
```js
{
  labelTr: 'Münasebât — Sure Bağlantıları',
  labelEn: 'Surah Connections Atlas',
  descTr: '114 sure · tematik/dilsel bağlar · ikiz sureler · münâsebât ilmi',
  descEn: '114 surahs · thematic/linguistic connections · paired surahs',
  icon: /* connected-rings or network-bond SVG icon */,
  action: () => { setMunasebatOpen(true); setToolsOpen(false); },
}
```

---

## 4. Münâsebât Türleri (Connection Types)

Klasik âlimlerin belirlediği 6 ana münâsebât türü:

| # | Tür | Arapça | Açıklama | Renk |
|---|-----|--------|----------|------|
| 1 | **Tenâsüb** | تَنَاسُب | Tematik uyum — aynı konunun farklı açıdan işlenmesi | `#2ecc71` (yeşil) |
| 2 | **Tedâdd** | تَضَادّ | Karşıtlık — iki surenin birbirinin zıt kutbunu göstermesi | `#e74c3c` (kırmızı) |
| 3 | **Tenzîr** | تَنْظِير | Benzer yapı/kalıp — paralel anlatım | `#3498db` (mavi) |
| 4 | **İstıtrâd** | اسْتِطْرَاد | Ek/detaylandırma — bir surenin diğerini tamamlaması | `#c9a227` (altın) |
| 5 | **Uslûbü'l-Hakîm** | أُسْلُوب الحَكِيم | Hikmetli geçiş — konunun inceliklerle bağlanması | `#9b59b6` (mor) |
| 6 | **İntikâl** | انْتِقَال | Doğal akış — bir sureden diğerine yumuşak geçiş | `#e67e22` (turuncu) |

---

## 5. Content — Verified Surah Connections

### 5.1 Öne Çıkan Bağlantılar (Signature Connections)

Bu bağlantılar klasik kaynaklarca **kanıtlanmış, tartışmasız** örneklerdir:

#### Bağlantı 1: Fâtiha → Bakara — "Soru ve Cevap"

| | Fâtiha (1) | Bakara (2) |
|---|-----------|----------|
| **Son ayet / İlk ayet** | "İhdinâ's-sırâta'l-mustakîm" (1:6) — "Bize dosdoğru yolu göster" | "Zâlike'l-kitâbu lâ reybe fîh — hüden li'l-muttakîn" (2:2) — "İşte bu Kitap, muttakîler için yol göstericidir" |
| **Bağlantı Türü** | Tenzîr + İntikâl | |
| **Kaynak** | Râzî (Mefâtîh), Bikā'î (Nazmü'd-Dürer), modern ittifak | |
| **Mesaj** | Kul yol istiyor (duâ), Kitap yol olduğunu söylüyor (cevap) | |

#### Bağlantı 2: Bakara ↔ Âl-i İmrân — "Zehrâvân" (İki Parlak)

| | Bakara (2) | Âl-i İmrân (3) |
|---|-----------|----------|
| **Ana Tema** | Benî İsrâîl ile diyalog (Hz. Mûsâ kavmi) | Hristiyanlarla diyalog (Hz. Îsâ ile Hz. Meryem) |
| **Ortak Kalıp** | *Elif Lâm Mîm* ile başlar | *Elif Lâm Mîm* ile başlar |
| **Ortak İsm-i Azam** | "Allâhu lâ ilâhe illâ hüve'l-Hayyü'l-Kayyûm" (2:255 — Âyetü'l-Kürsî) | "Allâhu lâ ilâhe illâ hüve'l-Hayyü'l-Kayyûm" (3:2) |
| **Bağlantı Türü** | Tenâsüb + Tenzîr | |
| **Hadis** | Peygamber (s.a.v.): "Bu iki sureyi okuyun, kıyamet günü iki bulut gibi gelip okuyanları savunurlar." (Sahih Müslim 804) | |
| **İsim** | Zehrâvân (الزَّهْرَاوَان) — "İki Parlak" | |

#### Bağlantı 3: Duhâ ↔ İnşirâh — "Teselli İkizleri"

| | Duhâ (93) | İnşirâh (94) |
|---|-----------|----------|
| **Muhatap** | Sadece Hz. Peygamber (tekil) | Sadece Hz. Peygamber (tekil) |
| **Ana Mesaj** | "Rabbin seni terk etmedi" (93:3) — geçmiş teselli | "Seninle birlikte zorlukla beraber kolaylık var" (94:5-6) — gelecek teselli |
| **Ortak Yapı** | 3 nimet hatırlatma (yetimlik, rehbersizlik, yoksulluk) | 3 nimet hatırlatma (göğüs açma, yük kaldırma, anı yüceltme) |
| **Fıkhî Hüküm** | İmâmiyye fıkhında zorunlu namazda birlikte okunur | Aynı — tek sure gibi okunur (İmam Cafer-i Sâdık rivayeti) |
| **Bağlantı Türü** | Tenâsüb (devam sure) | |
| **Kaynak** | Râzî, Bikā'î, modern müfessirler (Tedebbür-i Kur'ân) | |

#### Bağlantı 4: Fîl ↔ Kureyş — "Tek Soluk"

| | Fîl (105) | Kureyş (106) |
|---|-----------|----------|
| **Bağlantı Niteliği** | Bikā'î ve diğer bazı âlimlere göre **aslında tek sure** olarak inmiştir | |
| **Mesaj** | "Fil ordusunu helâk ettik" (105) → "Bu yüzden Kureyş emniyet buldu" (106) | |
| **Dilsel Köprü** | "Li-îlâfi Kureyş" (106:1) — "Kureyş'in alıştırılması için..." — bu cümle Fîl suresinin devamı gibi okunur |
| **Fıkhî Hüküm** | İmâmiyye fıkhında zorunlu namazda ikisi birlikte okunur, aralarında besmele olmadan | |
| **Kaynak** | Übey b. Ka'b mushafında tek sure sayılmış, Bikā'î detaylı işler | |

#### Bağlantı 5: Felak ↔ Nâs — "Muavvizeteyn" (İki Sığınak)

| | Felak (113) | Nâs (114) |
|---|-----------|----------|
| **İsim** | Muavvizeteyn — "İki Sığınma Suresi" | Aynı |
| **Ortak Kalıp** | "Kul eûzu..." (De ki: Sığınırım) | "Kul eûzu..." (De ki: Sığınırım) |
| **Sığınma Alanı** | Dış tehditlerden (karanlık, sihir, haset) | İç tehditlerden (vesvese, gizli düşman) |
| **Bağlantı Türü** | Tenâsüb + Tekâmül (tamamlayıcılık) | |
| **Hadis** | Peygamber (s.a.v.) her gece yatmadan önce ikisini birlikte okurdu (Buhârî, Fedâilü'l-Kur'ân 14) | |

#### Bağlantı 6: A'lâ ↔ Ğâşiye — "Hutbe İkizleri"

| | A'lâ (87) | Ğâşiye (88) |
|---|-----------|----------|
| **Ortak Yapı** | Kısa, ritmik, Mekkî | Kısa, ritmik, Mekkî |
| **Tema** | Allah'ın adını ululayarak uyarma | Kıyamet günü tasviri — cennet ve cehennem |
| **Fıkhî Hüküm** | Peygamber (s.a.v.) Cuma ve bayram namazlarında bu iki sureyi okurdu | Aynı — "Cuma Çifti" olarak bilinir |
| **Kaynak** | Sahih Müslim — Numân b. Beşîr hadisi | |

---

### 5.2 Tematik Bağlantı Örnekleri (Diğer Öne Çıkanlar)

#### Bakara 2:285 → Âl-i İmrân 3:1

Bakara son iki ayeti imanın içeriğini sayar ("mü'minler Allah'a, meleklerine, kitaplarına, rasullerine iman ettiler") → Âl-i İmrân direkt ilahi sıfatlarla başlar ("Allah... Hayy ve Kayyûm'dur") — **ittikâ** (takip) ilişkisi.

#### Nâs (114) → Fâtiha (1)

Kur'an'ın **döngüsel yapısı** — son sure "şeytanın vesvesesinden sığınma" ile biter, ilk sure "yol gösterilmesi duası" ile başlar. **Ebedî döngü** — Kur'an'ın biten ama bitmeyen okunuşu.

**Kaynak:** Sâmerrâî, *Lemesât Beyâniyye*; modern tefsir geleneği.

#### İsrâ (17) ↔ Kehf (18)

Her ikisi de **"hamd" ile başlar:** "el-Hamdu lillâhi..." Bu Kur'an'da sadece 5 surede olur (Fâtiha, En'âm, Kehf, Sebe', Fâtır). İsrâ ve Kehf **peş peşe** olarak bu dizide tek örnek.

#### Secde (32) ↔ Ahzâb (33)

Secde 30 ayetlik kısa Mekkî sure, Ahzâb 73 ayetlik uzun Medenî sure. Secde **akîde inşasını** tamamlayınca, Ahzâb **toplum inşasına** geçer — Mekkî/Medenî geçişin kusursuz örneği.

#### Vâkıa (56) ↔ Hadîd (57)

Vâkıa kıyamet günündeki **üç zümre**yi (sağcılar, solcular, önde gidenler) anlatır → Hadîd bu dünyadaki **servet sınamasını** işler (57:7: "Malınızdan infak edin"). **Ahiret → Dünya** köprüsü.

---

### 5.3 Dilsel/Yapısal Bağlantılar (Structural Connections)

#### Huruf-u Mukatta'a (Kesik Harfler) Grupları

29 sure muqatta'āt ile başlar. Bunların birçoğu peş peşe grupları oluşturur:

| Grup | Sureler | Ortak Harf |
|------|---------|-----------|
| **Havâmîm** (7 sure) | 40-46 (Mü'min, Fussilet, Şûrâ, Zuhruf, Duhân, Câsiye, Ahkāf) | HM (حم) |
| **Elif Lâm Râ Grubu** (5 sure) | 10-15 (Yûnus, Hûd, Yûsuf, Ra'd, İbrâhîm, Hicr) | الر / المر |
| **Elif Lâm Mîm** | 2, 3, 29, 30, 31, 32 | الم |
| **Tâsînler** | 26-28 (Şuarâ, Neml, Kasas) | طسم / طس |

**Münâsebât Türü:** Tenzîr (paralel yapı). Bu grupların içinde tematik süreklilik vardır.

#### "Secde" Ayeti Bulunduran Sureler

15 surede okuyan/dinleyenin secde etmesi gereken ayet bulunur. Bunlar rastgele değil — Kur'an'da belirli temalarda kümelenir (tevhid vurgusu, kainatın secdesi vs).

---

### 5.4 Yapısal Simetri (Structural Symmetry)

Bazı sure çiftleri **pozisyon simetrisi** taşır:

#### Fâtiha (1) ↔ Nâs (114) — Alfa-Omega

- Fâtiha: Allah'a hamd, yol isteme
- Nâs: Şerden Allah'a sığınma
- İkisi birlikte Kur'an'ın **"duâ zarfı"** — Kitap ikisinin arasında

#### Asrın Ortası: Kehf (18) ↔ Meryem (19) ↔ Tâhâ (20)

Kur'an'ın orta bölgesinde **üç sure üst üste kıssa yoğun** — Ashâb-ı Kehf, Zülkarneyn, Mûsâ-Hızır, Meryem, Îsâ, Yahyâ, Mûsâ-Firavun. **Kıssaların yoğunlaştığı bölge.**

---

## 6. Data Files

### `surah-connections.json`

```json
{
  "connections": [
    {
      "id": "fatiha-baqara-qa",
      "surahs": [1, 2],
      "titleTr": "Soru ve Cevap",
      "titleEn": "Prayer and Response",
      "connectionTypes": ["tenzir", "intikal"],
      "strength": "iconic",
      "category": "opening",
      "anchors": {
        "from": {
          "ref": "1:6",
          "arabic": "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
          "turkishTranslation": "Bize dosdoğru yolu göster",
          "role": "Kulun duâsı"
        },
        "to": {
          "ref": "2:2",
          "arabic": "ذٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ",
          "turkishTranslation": "İşte bu kitap, muttakîler için yol göstericidir",
          "role": "İlahi cevap"
        }
      },
      "summaryTr": "Fâtiha'da kul Allah'tan yol gösterme diler. Hemen ardından gelen Bakara, bu dileğe cevap olarak 'İşte yol gösteren kitap budur' der. Kur'an'daki en açık münâsebât örneği.",
      "sources": ["razi", "biqai", "suyuti"],
      "famousQuote": {
        "scholar": "Fahreddîn er-Râzî",
        "text": "Kim Fâtiha'nın son ayetini okuduğunda Bakara'nın ilk ayetlerini arka arkaya düşünürse, ilahi cevap mekanizmasını görür.",
        "source": "Mefâtîhu'l-Ğayb"
      }
    },
    {
      "id": "baqara-imran-zahrawan",
      "surahs": [2, 3],
      "titleTr": "Zehrâvân — İki Parlak",
      "titleEn": "The Two Radiant Ones",
      "connectionTypes": ["tenasub", "tenzir"],
      "strength": "iconic",
      "category": "paired-named",
      "anchors": {
        "sharedElements": [
          {
            "type": "muqattaat",
            "value": "الم",
            "ref1": "2:1",
            "ref2": "3:1"
          },
          {
            "type": "divine-name",
            "value": "اللّٰهُ لَا اِلٰهَ اِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
            "ref1": "2:255",
            "ref2": "3:2",
            "noteTr": "Aynı ism-i azam kalıbı — Bakara'da Âyetü'l-Kürsî, Âl-i İmrân'da ilk 2. ayet"
          }
        ]
      },
      "summaryTr": "Bakara yoğunlukla Yahudilerle diyalog kurar — Hz. Mûsâ kavminin tarihi, hukuku, sapmaları. Âl-i İmrân ise Hristiyanlarla diyalog kurar — Hz. Meryem, Hz. Îsâ, üçlü doktrinin düzeltilmesi. İki büyük Ehl-i Kitap cemaatiyle sistematik muhatap alma.",
      "sources": ["razi", "biqai", "suyuti"],
      "hadith": {
        "text": "Bakara ve Âl-i İmrân'ı okuyun; çünkü bu iki sure kıyamet günü iki bulut veya iki gölge gibi gelip okuyanları savunacaklardır.",
        "source": "Sahih Müslim, Kitâbu Salâti'l-Müsâfirîn, 804"
      },
      "name": {
        "arabic": "الزَّهْرَاوَان",
        "meaning": "İki Parlak Olan"
      }
    },
    {
      "id": "duha-inshirah-twins",
      "surahs": [93, 94],
      "titleTr": "Teselli İkizleri",
      "titleEn": "The Comfort Twins",
      "connectionTypes": ["tenasub", "tekamul"],
      "strength": "iconic",
      "category": "paired-recitation",
      "anchors": {
        "addresseeUniqueness": {
          "noteTr": "Kur'an'da bu iki sure, başından sonuna kadar SADECE Hz. Peygamber'e (tekil 'sen') hitap eden tek arka arkaya çifttir."
        },
        "parallels": [
          {
            "theme": "Geçmişte 3 nimet",
            "ref1": "93:6-8",
            "noteTr1": "Yetimlik, rehbersizlik, yoksulluk — ve Allah'ın cevabı"
          },
          {
            "theme": "Gelecekte 3 kolaylık",
            "ref2": "94:1-4",
            "noteTr2": "Göğüs açma, yük kaldırma, anı yüceltme"
          }
        ]
      },
      "summaryTr": "Duhâ'da Hz. Peygamber'e geçmişte verilen nimetler hatırlatılır; İnşirâh'ta aynı formatla iç dünyası (göğüs ferahlığı) ele alınır. İki sure o kadar iç içedir ki İmâmiyye fıkhında zorunlu namazda birlikte okunmaları gerekir.",
      "sources": ["razi", "biqai", "alkisa-foundation"],
      "fiqh": {
        "school": "İmâmiyye",
        "ruling": "Zorunlu namazda bu iki sure tek sure gibi birlikte okunur",
        "source": "Mecmau'l-Beyân (Tabersî)"
      }
    },
    {
      "id": "fil-quraysh-one-breath",
      "surahs": [105, 106],
      "titleTr": "Tek Soluk — Fîl ve Kureyş",
      "titleEn": "One Breath — Elephant and Quraysh",
      "connectionTypes": ["intikal", "tekamul"],
      "strength": "iconic",
      "category": "paired-possibly-one",
      "anchors": {
        "linguisticBridge": {
          "ref": "106:1",
          "arabic": "لِاِيلَافِ قُرَيْشٍ",
          "turkishTranslation": "Kureyş'in alıştırılması için...",
          "noteTr": "Bu cümle Fîl suresinin devamı olarak okunabilir — 'Fil ordusunu helâk ettik... Kureyş'in emniyet bulması için.'"
        }
      },
      "summaryTr": "Fîl Ebrehe ordusunun helâkını anlatır. Kureyş bu helâkın SONUCU olarak Kureyş kabilesinin emniyetini anlatır. İki sure sebep-sonuç ilişkisiyle tek bir argüman oluşturur. Übey b. Ka'b mushafında tek sure sayılmıştır.",
      "sources": ["biqai", "ubayy-mushaf"],
      "fiqh": {
        "school": "İmâmiyye",
        "ruling": "Zorunlu namazda ikisi birlikte okunur, aralarında besmele yoktur",
        "source": "İmâmiyye fıkıh kaynakları"
      }
    },
    {
      "id": "falaq-nas-refuge",
      "surahs": [113, 114],
      "titleTr": "Muavvizeteyn — İki Sığınma Suresi",
      "titleEn": "The Two Refuge Surahs",
      "connectionTypes": ["tenasub", "tekamul"],
      "strength": "iconic",
      "category": "paired-named",
      "anchors": {
        "sharedOpening": {
          "ref1": "113:1",
          "ref2": "114:1",
          "arabic": "قُلْ اَعُوذُ",
          "turkishTranslation": "De ki: Sığınırım...",
          "noteTr": "İki sure de 'De ki: Sığınırım' ile başlar — Kur'an'da sadece burada bu kalıp iki sure arka arkaya gelir."
        },
        "complementarity": {
          "falaq": "Dış dünyadaki tehditlerden sığınma — gece karanlığı, sihir, hased",
          "nas": "İç dünyadaki tehditlerden sığınma — şeytan vesvesesi, cin-insan etkisi"
        }
      },
      "summaryTr": "İki sure birlikte 'Muavvizeteyn' (İki Sığınak) olarak adlandırılır. Felak dış tehditleri, Nâs iç tehditleri kapsar. Peygamber (s.a.v.) her gece yatmadan önce ikisini birlikte okurdu.",
      "sources": ["razi", "biqai", "bukhari"],
      "hadith": {
        "text": "Peygamber (s.a.v.) her gece yatağına girdiğinde iki elini birleştirir, üzerine Muavvizeteyn ve İhlâs'ı okur, sonra elleriyle vücudunu sıvazlardı.",
        "source": "Buhârî, Fedâilü'l-Kur'ân, 14"
      },
      "name": {
        "arabic": "المُعَوِّذَتَان",
        "meaning": "İki Sığınma Suresi"
      }
    },
    {
      "id": "ala-ghashiya-jumah",
      "surahs": [87, 88],
      "titleTr": "Cuma Çifti",
      "titleEn": "The Friday Pair",
      "connectionTypes": ["tenzir", "tenasub"],
      "strength": "strong",
      "category": "paired-recitation",
      "summaryTr": "Peygamber (s.a.v.) Cuma ve bayram namazlarında bu iki sureyi okurdu. A'lâ Allah'ın adını ululama ve uyarma, Ğâşiye kıyamet günü tasviriyle tamamlar.",
      "hadith": {
        "text": "Peygamber (s.a.v.) Cuma ve bayram namazlarında A'lâ ve Ğâşiye'yi okurdu.",
        "source": "Sahih Müslim (Numân b. Beşîr hadisi)"
      },
      "sources": ["muslim-hadith"]
    },
    {
      "id": "nas-fatiha-cycle",
      "surahs": [114, 1],
      "titleTr": "Döngü — Son ve Başlangıç",
      "titleEn": "The Eternal Cycle",
      "connectionTypes": ["intikal"],
      "strength": "thematic",
      "category": "structural",
      "summaryTr": "Nâs (son sure) 'şeytanın vesvesesinden sığınma' ile biter. Fâtiha (ilk sure) 'yol gösterilmesi duası' ile başlar. Kur'an'ın okunuşu biten ama bitmeyen bir döngüdür — her hatim yeni bir başlangıç.",
      "sources": ["samarrai", "modern-tafsir"]
    },
    {
      "id": "isra-kahf-hamd",
      "surahs": [17, 18],
      "titleTr": "Hamd İkizi",
      "titleEn": "The Praise Pair",
      "connectionTypes": ["tenzir"],
      "strength": "structural",
      "category": "linguistic",
      "anchors": {
        "sharedPattern": {
          "value": "الْحَمْدُ لِلّٰهِ",
          "ref1": "17:111",
          "ref2": "18:1",
          "noteTr": "İsrâ hamd ile biter, Kehf hamd ile başlar. Kur'an'da sadece 5 sure hamd ile başlar (Fâtiha, En'âm, Kehf, Sebe', Fâtır) — bu iki sure peş peşe olan tek örnek."
        }
      }
    },
    {
      "id": "secde-ahzab-transition",
      "surahs": [32, 33],
      "titleTr": "Mekkî/Medenî Geçiş",
      "titleEn": "Meccan/Medinan Transition",
      "connectionTypes": ["intikal"],
      "strength": "thematic",
      "category": "structural",
      "summaryTr": "Secde 30 ayetlik kısa Mekkî — akîde (iman temelleri) inşası. Ahzâb 73 ayetlik uzun Medenî — toplum ve savaş inşası. Kur'an'ın Mekkî'den Medenî'ye geçişinin kusursuz örneği."
    },
    {
      "id": "vakiah-hadid-wealth",
      "surahs": [56, 57],
      "titleTr": "Ahiret Mahkemesi → Dünya Sınamasi",
      "titleEn": "Hereafter Court → World Test",
      "connectionTypes": ["tenasub"],
      "strength": "thematic",
      "category": "thematic",
      "summaryTr": "Vâkıa kıyamet günündeki üç zümreyi (sağcılar, solcular, önde gidenler) anlatır. Hadîd bu dünyadaki servet sınamasını işler (57:7: 'Malınızdan infak edin'). Ahiretin mahkemesi ↔ dünyanın hazırlığı."
    }
    /* ~40-50 daha */
  ]
}
```

### `connection-types.json`

```json
{
  "types": [
    {
      "id": "tenasub",
      "nameTr": "Tenâsüb",
      "nameAr": "تَنَاسُب",
      "color": "#2ecc71",
      "descriptionTr": "Tematik uyum. İki surenin aynı konuyu farklı açıdan ele alması veya birbirini tamamlaması.",
      "example": "Bakara ↔ Âl-i İmrân (Benî İsrâîl ↔ Nasârâ)"
    },
    {
      "id": "tedadd",
      "nameTr": "Tedâdd",
      "nameAr": "تَضَادّ",
      "color": "#e74c3c",
      "descriptionTr": "Karşıtlık. Surelerin birbirine zıt kutupları temsil etmesi.",
      "example": "Mü'minûn (mü'minlerin özelliği) ↔ Nûr (toplum hukuku)"
    },
    {
      "id": "tenzir",
      "nameTr": "Tenzîr",
      "nameAr": "تَنْظِير",
      "color": "#3498db",
      "descriptionTr": "Paralel yapı. Benzer kalıp, başlangıç veya kapanışla birleşme.",
      "example": "İsrâ ↔ Kehf (her ikisi de 'Elhamdulillâh' ile bağlantılı)"
    },
    {
      "id": "istitrad",
      "nameTr": "İstıtrâd",
      "nameAr": "اسْتِطْرَاد",
      "color": "#c9a227",
      "descriptionTr": "Ek, detaylandırma. Bir sureden diğerine geçerken konunun genişletilmesi.",
      "example": "Kıyâmet ↔ İnsân (kıyamet sonrası insan hesabı)"
    },
    {
      "id": "uslub-hakim",
      "nameTr": "Uslûbü'l-Hakîm",
      "nameAr": "أُسْلُوب الحَكِيم",
      "color": "#9b59b6",
      "descriptionTr": "Hikmetli geçiş. Konuyu beklenmedik ama derin bir açıdan bağlama.",
      "example": "Yûsuf sonu ↔ Ra'd başı (kıssadan kozmik işaretlere geçiş)"
    },
    {
      "id": "intikal",
      "nameTr": "İntikâl",
      "nameAr": "انْتِقَال",
      "color": "#e67e22",
      "descriptionTr": "Doğal akış. Bir sureden diğerine yumuşak, akıcı geçiş.",
      "example": "Fâtiha ↔ Bakara (duâ → cevap)"
    },
    {
      "id": "tekamul",
      "nameTr": "Tekâmül",
      "nameAr": "تَكَامُل",
      "color": "#1abc9c",
      "descriptionTr": "Tamamlayıcılık. Çift sure olarak bir bütünün iki parçası.",
      "example": "Duhâ ↔ İnşirâh (geçmiş teselli → gelecek teselli)"
    }
  ]
}
```

### `scholars.json`

```json
{
  "scholars": [
    {
      "id": "naysaburi",
      "nameTr": "Ebû Bekr en-Neysâbûrî",
      "deathH": 324,
      "deathM": 936,
      "role": "Kurucu",
      "noteTr": "Ez-Zerkeşî'ye göre ilmin ilk sistematik tartışmasını yapan âlim. Eseri kayıp."
    },
    {
      "id": "razi",
      "nameTr": "Fahreddîn er-Râzî",
      "deathH": 606,
      "deathM": 1210,
      "role": "Müfessir",
      "workTr": "Mefâtîhu'l-Ğayb",
      "noteTr": "Tefsirinde münâsebât'ı sistematik uygulayan ilk büyük müfessir. Ünlü sözü: 'Kur'an'ın güzelliklerinin çoğu münâsebâtın dakikliklerine dayanır.'"
    },
    {
      "id": "biqai",
      "nameTr": "Burhâneddîn el-Bikā'î",
      "deathH": 885,
      "deathM": 1480,
      "role": "Şehinşah",
      "workTr": "Nazmü'd-Dürer fî Tenâsübi'l-Âyâti ve's-Süver",
      "noteTr": "İlmin en kapsamlı eserinin yazarı. 22 cilt. Her ayet ve her sure arasındaki bağı sistematik olarak inceler."
    },
    {
      "id": "suyuti",
      "nameTr": "Celâleddîn es-Süyûtî",
      "deathH": 911,
      "deathM": 1505,
      "role": "Teorisyen",
      "workTr": "Tenâsüku'd-Dürer + Esrâru Tertîbi'l-Kur'ân",
      "noteTr": "İlmin teorik temellerini özetleyen iki müstakil eser. el-İtkân'ın bir bölümünü münâsebât'a ayırır."
    },
    {
      "id": "abu-hayyan",
      "nameTr": "Ebû Hayyân el-Endelüsî",
      "deathH": 745,
      "deathM": 1344,
      "role": "Müfessir",
      "workTr": "el-Bahrü'l-Muhît",
      "noteTr": "Endülüslü büyük dilbilimci-müfessir. Münâsebât'ı dilbilim metotlarıyla birleştirir."
    },
    {
      "id": "abduh",
      "nameTr": "Muhammed Abduh",
      "deathH": 1323,
      "deathM": 1905,
      "role": "Modern",
      "workTr": "Tefsîru'l-Menâr (Reşid Rızâ ile)",
      "noteTr": "Modern dönemin ilk sistematik uygulaması. 20. yüzyıl tefsir yenilenmesinin öncüsü."
    },
    {
      "id": "islahi",
      "nameTr": "Emîn Ahsen Islahî",
      "deathM": 1997,
      "role": "Modern",
      "workTr": "Tedebbür-i Kur'ân (Urdu)",
      "noteTr": "'Nazmü'l-Kur'ân' teorisi — Kur'an'ın 7 grup halinde organize olduğunu savunur. Çift-sure sisteminin modern temsilcisi."
    },
    {
      "id": "samarrai",
      "nameTr": "Fâzıl Sâlih es-Sâmerrâî",
      "role": "Çağdaş",
      "workTr": "Lemesât Beyâniyye (Türkçeye çevrildi)",
      "noteTr": "Çağdaş Iraklı âlim. Beyan ilminin münâsebât boyutunu işler."
    }
  ]
}
```

---

## 7. Component Structure

```
MunasebatAtlasi({ onClose })
├── State
│   ├── isMobile
│   ├── activeTab (0-4)
│   ├── selectedConnectionId
│   ├── connectionTypeFilter
│   └── loadedVerses Map (API cache)
├── Escape handler
│
├── OVERLAY_BASE
│   ├── OVERLAY_HEADER: "Münasebât — Sure Bağlantıları"
│   └── Tab Bar (5 tab)
│       ├── Tab 0: Ağ Haritası (114 sure radial)
│       ├── Tab 1: Öne Çıkan Bağlantılar
│       ├── Tab 2: Bağlantı Türleri
│       ├── Tab 3: İkiz Sureler (Paired Surahs)
│       └── Tab 4: Âlim Kitaplığı
```

---

## 8. Tab Specs

### Tab 0 — Ağ Haritası (114 Sure Network)

**Hero visualization: SVG radial diagram**

- 114 sure **dairesel olarak** yerleştirilmiş (clock-face layout)
- Her düğüm = sure (numarası + isim, küçük label)
- Düğüm rengi: Mekkî (gümüş) / Medenî (altın)
- Düğüm boyutu: sure uzunluğu (ayet sayısı) proportional
- **Bağlantı çizgileri:** İlgili sureler arasında — renk `connection-types.json`'den, kalınlık `strength`'e göre

**Stat bar:**
```
114 sure  ·  30+ kanıtlanmış bağlantı  ·  6 münâsebât türü  ·  9 âlim kaynağı
```

**Filtreler:**
- Bağlantı türü chip'leri (7 tür + "Tümü")
- Güç filtresi: Iconic / Strong / Thematic / Structural
- Sure seçimi: dropdown — tek sure seçince sadece onun bağlantıları parlar

**Interaktif:**
- Sure düğümüne tıkla → o sureye dair bağlantılar filtrelenir
- Bağlantı çizgisine tıkla → Tab 1'e drill down (o bağlantının detayı)
- Hover: tooltip ile bağlantı özeti

### Tab 1 — Öne Çıkan Bağlantılar

**30+ bağlantı kartı, vertical list. Her kart (GLASS_CARD):**

```
┌────────────────────────────────────────────────────┐
│ [1] Fâtiha → [2] Bakara        🟢 Tenzîr + İntikâl │
│                                                     │
│ Soru ve Cevap                                       │
│                                                     │
│ ┌──────────── FÂTİHA (1:6) ──────────────────┐     │
│ │ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ           │     │
│ │ "Bize dosdoğru yolu göster" — KUL          │     │
│ └────────────────────────────────────────────┘     │
│                   ↓                                 │
│ ┌──────────── BAKARA (2:2) ───────────────────┐    │
│ │ ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ │
│ │ "İşte yol gösteren kitap" — ALLAH          │     │
│ └────────────────────────────────────────────┘     │
│                                                     │
│ Özet: Kul yol istiyor, Kitap yol olduğunu söylüyor. │
│                                                     │
│ 📖 Kaynaklar: Râzî, Bikā'î, Süyûtî                  │
│ 💬 Râzî: "İlahi cevap mekanizmasının açık örneği." │
└────────────────────────────────────────────────────┘
```

- Her kart expandable — tıklanınca tam detay, hadis referansları, ek kaynaklar
- Arapça metinler `dir="rtl"`, `FONTS.quran`
- Türkçe meallerde hedef cümle italic + quote işaretli
- Hadis varsa ayrı hadisli kutu (hadith source badge)
- Fıkhî hüküm varsa mezhep chip'i

**Sıralama seçenekleri:**
- Kur'an sırasına göre (default)
- Strength'e göre (iconic → thematic)
- Bağlantı türüne göre

### Tab 2 — Bağlantı Türleri

**7 münâsebât türü kartı, 2 sütun grid.**

Her kart:
- Arapça terim (FONTS.quran, altın, RTL, büyük)
- Türkçe adı (offWhite, bold)
- Renk göstergesi (solda ince şerit)
- Açıklama (silver, 3-4 satır)
- "Örnekler" bölümü — ilgili 3-5 bağlantıya link (ilgili Tab 1'e zıplat)

### Tab 3 — İkiz Sureler (Paired Surahs)

**Özel bir bölüm — klasik âlimlerin "ikiz" saydığı sure çiftleri:**

```
┌─────────────────── İKİZ SURELER ──────────────────┐
│                                                    │
│ 1. Zehrâvân — İki Parlak (2-3)                    │
│ 2. Duhâ & İnşirâh — Teselli İkizleri (93-94)      │
│ 3. Fîl & Kureyş — Tek Soluk (105-106)             │
│ 4. Muavvizeteyn — İki Sığınak (113-114)           │
│ 5. Cuma Çifti — A'lâ & Ğâşiye (87-88)             │
│                                                    │
└────────────────────────────────────────────────────┘
```

Her çift için zengin kart — hadis, fıkhi hüküm, isimlerin Arapça karşılığı, ikizliklerinin delilleri.

### Tab 4 — Âlim Kitaplığı

**9 âlim kartı + İlmin Tarihçesi narrative**

Her kart:
- Türkçe + Arapça isim
- Vefat tarihi
- Eser adı (italic)
- Katkı rozeti: Kurucu / Müfessir / Teorisyen / Modern / Çağdaş
- 2-3 cümle özet

**Alt bölüm: İlmin Tarihçesi**

```
İlim 4. asırda Neysâbûrî ile başlar (eser kayıp).
↓
6. asırda Râzî tefsir metoduna dönüştürür.
↓
9. asırda Bikā'î'nin 22 ciltlik dev eseriyle zirveye ulaşır.
↓
10. asırda Süyûtî teorileştirir.
↓
19-20. asırda Muhammed Abduh ile modern dönem başlar.
↓
Günümüzde Islahî ve Sâmerrâî ile devam eder.
```

---

## 9. Arabic Text Loading

Aynı pattern diğer araçlarla — API'dan yüklenir, cache'lenir, `FONTS.quran` + `dir="rtl"` + `lang="ar"`.

Bağlantı noktalarındaki **hedef cümle** altın renkle highlight edilir (Furûk pattern'ı).

---

## 10. Cross-Tool Integration

- **Sure DNA ile:** Bağlantı kartından "Süre DNA'da karşılaştır →" linki
- **Nüzul Haritası ile:** Bağlantılı surelerin kronolojik sırasını göster
- **Kavim Atlası ile:** Benî İsrâîl (Bakara) ↔ Nasârâ (Âl-i İmrân) gibi kavim bağlantılarında link
- **Diyalog Ağı ile:** Ortak konuşan karakterler varsa link

---

## 11. Phased Content Rollout

**Phase 1 (MVP — 15 bağlantı):**
- 5 İkiz sure (Zehrâvân, Teselli İkizleri, Fîl-Kureyş, Muavvizeteyn, Cuma Çifti)
- 5 iconic bağlantı (Fâtiha-Bakara, Nâs-Fâtiha döngüsü, İsrâ-Kehf, Secde-Ahzâb, Vâkıa-Hadîd)
- 5 yapısal bağlantı (Havâmîm grubu, Elif Lâm Râ grubu, vb.)

**Phase 2 (+15 bağlantı):** Diğer güçlü bağlantılar — her Juz içi bağlantılar, mushaf ortasındaki kıssalar zinciri

**Phase 3 (30+ bağlantı tam, 22 ciltlik Bikā'î'den damıtılmış):** Her surenin önceki ile bağlantısı

---

## 12. Data Collection Methodology

**Kaynak hiyerarşisi:**

1. **Bikā'î, Nazmü'd-Dürer** (22 cilt — dijital mevcut, Altafsir.com'da)
2. **Râzî, Mefâtîhu'l-Ğayb** (tefsirin sure başları ve geçişleri)
3. **Süyûtî, el-İtkân** münâsebât bölümü
4. **Hadis kaynakları:** Sahih Müslim, Buhârî, Ebû Dâvûd — sure çifti okuma hadisleri
5. **Modern akademik makaleler** (Turkish/English, ResearchGate, Central Asian Journal of Social Sciences)

**MVP veri oluşturma maliyeti:**
- 15 bağlantı × ortalama 2 saat araştırma + yazma = 30 saat
- Veya: başlangıçta ChatGPT/Claude ile taslak + manuel doğrulama = 10-15 saat

---

## 13. Mobile Rules

- `isMobile`: `window.innerWidth < 640`
- Tab 0 SVG: responsive, 114 düğüm daha küçük, etiket hidden, tıklayınca bilgi
- Tab 1 kartları: full width, Arapça metin wrap
- Paired sureler görseli (A ↔ B): mobilde stack
- Touch targets: 44px min

---

## 14. Out of Scope

- English content (i18n placeholder)
- Âyet-ayet münâsebât (ayrı bir tool olabilir — çok geniş)
- Sûfî batini yorumlar
- Mezhep-özel fıkhi tartışmalar
- Tam 22 ciltlik Bikā'î korpusu (sadece en güçlü örnekler)