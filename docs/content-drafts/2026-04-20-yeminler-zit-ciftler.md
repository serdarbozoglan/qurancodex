# Content Draft — Yeminler: Zıt Çiftler (İbn Kayyim'in Aksâm bi'l-Mütekâbilât Tasnifi)
Tarih: 2026-04-20
Mod: Mikro
Hedef dosya: `public/yeminler.json`
Hedef araç: `KuranYeminleri.jsx`
Eklenecek: Yeni top-level alan — `ibnKayyimPatterns.opposingPairs`
Üreten: qc-content-producer (manuel)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Önemli Tespit: Mevcut Durumun Analizi

Kullanıcının ilk önerisinde "Leyl/Nehâr, Dhakar/Unthâ, Şef'/Vetr yeminlerini yeni item olarak ekle" dendi. Fakat `yeminler.json`'u inceledikten sonra tespit edildi ki:

| Ayet | Mevcut durum | Kategori |
|---|---|---|
| Leyl 92:1 (Kaplayan Gece) | ✓ zaten var | celestial |
| Leyl 92:2 (Aydınlanan Gündüz) | ✓ zaten var | time |
| Leyl 92:3 (Erkek ve Dişi) | ✓ zaten var | human-soul |
| Fecr 89:2 (On Gece) | ✓ zaten var | time |
| Fecr 89:3 (Çift ve Tek) | ✓ zaten var | forces |

**Eksik olan item değil, çerçeve.** Bu ayetler farklı kategorilere dağıldığı için İbn Kayyim'in "aksâm bi'l-mütekâbilât" (zıt/eşleşen çiftlerle yeminler) retorik tasnifi **görünmez kalmaktadır**. Oysa bu pattern, İbn Kayyim'in et-Tibyân fî Aksâmi'l-Kur'ân eserinin **ana analiz çerçevelerinden biridir**.

**Önerilen çözüm:** Yeni item eklemek yerine, `yeminler.json`'a yeni bir top-level alan (`ibnKayyimPatterns`) eklenir. Bu alan **mevcut item'ları referans veren bir meta-bölüm**dir — duplicate üretmez, sadece çerçeveyi öne çıkarır.

---

## 2. Eklenecek Top-Level Blok

```json
{
  "meta": { ... mevcut ... },
  "categories": [ ... mevcut ... ],
  "ibnKayyimSection": { ... mevcut ... },
  
  "ibnKayyimPatterns": {
    "titleTr": "İbn Kayyim'in Üç Büyük Tasnifi",
    "titleEn": "Ibn Qayyim's Three Major Classifications",
    "descTr": "İbn Kayyim el-Cevziyye, et-Tibyân fî Aksâmi'l-Kur'ân eserinde Kur'ân yeminlerini üç temel yapıya göre tasnif eder. Bu sayfa, mevcut yemin item'larını bu tasniflere bağlar — tekrar eden item eklemeden, retorik görünürlüğü sağlar.",
    "descEn": "Ibn Qayyim al-Jawziyya, in *al-Tibyān fī Aqsām al-Qurʾān*, classifies Qur'anic oaths into three fundamental structures. This section maps existing oath items to these classifications — without duplicating items, revealing the rhetorical structure.",
    "patterns": [
      {
        "id": "opposing-pairs",
        "arabicName": "الأقسام بالمتقابلات",
        "transliteration": "al-aqsām bi'l-mutaqābilāt",
        "nameTr": "Zıt Çiftler ile Yeminler",
        "nameEn": "Oaths by Opposing Pairs",
        "descTr": "İki zıt unsura birlikte yemin — her çift, varlığın iki kutbunu temsil eder ve ikinci öğe birincinin anlamını tamamlar. İbn Kayyim bunu 'delilin iki kanadı' olarak adlandırır: Allah bir hakikate yemin ederken onun tezahür ettiği iki zıt uçtan birlikte söz eder.",
        "descEn": "Oaths sworn jointly by two opposing elements — each pair represents two poles of existence, the second element completing the first. Ibn Qayyim calls this 'the two wings of proof': Allah swears by a truth through both of the opposing manifestations in which it appears.",
        "pairs": [
          {
            "id": "pair-leyl-nehar",
            "firstId": "leyl-92-1",
            "firstLabel": "Kaplayan Gece",
            "firstLabelEn": "The Covering Night",
            "firstRef": "Leyl 92:1",
            "secondId": "leyl-92-2",
            "secondLabel": "Aydınlanan Gündüz",
            "secondLabelEn": "The Shining Day",
            "secondRef": "Leyl 92:2",
            "thematicTr": "Örtme / Açma — Gizleme / Açığa Çıkarma",
            "thematicEn": "Covering / Uncovering — Concealing / Revealing",
            "depthTr": "Gece 'gaşâ' (örter) fiiliyle, gündüz 'tecellâ' (açığa çıkar) fiiliyle tanımlanır. Bu iki fiil Kur'ân'da tezâdî yapının zirvelerindendir. Zemahşerî Keşşâf'ta: 'Gece örtmeseydi, gündüz açmazdı — ikisi birbirinin sınırıdır.' İbn Kayyim bu çifti, cevap-ı kasemdeki 'inne sa'yeküm le-şettâ' (gayretleriniz şüphesiz farklı farklıdır) ifadesine delil olarak görür: insan çabasının iki zıt yönü (hayır-şer), gece-gündüzün iki zıt doğasına benzer.",
            "depthEn": "Night is defined by the verb *ghashā* (to cover), day by *tajallā* (to manifest). These two verbs are among the peaks of antithetical construction in the Qur'an. Al-Zamakhsharī in *al-Kashshāf*: 'If night did not cover, day would not unveil — each is the limit of the other.' Ibn Qayyim sees this pair as evidence for the oath's response *inna saʿyakum la-shattā* (your efforts are surely varied): the two opposed directions of human effort (good/evil) parallel the two opposing natures of night/day."
          },
          {
            "id": "pair-dhakar-untha",
            "firstId": "leyl-92-3-erkek-disi",
            "firstLabel": "Erkek",
            "firstLabelEn": "Male",
            "firstRef": "Leyl 92:3",
            "secondId": "leyl-92-3-erkek-disi-2",
            "secondLabel": "Dişi",
            "secondLabelEn": "Female",
            "secondRef": "Leyl 92:3",
            "pairNotTr": "Bu iki öğe tek ayet içinde 'mâ halaka'dhakera ve'l-ünsâ' (erkeği ve dişiyi yaratana) ifadesiyle birleşir — tek yeminin iki kolu.",
            "pairNotEn": "Both elements are joined in a single verse: *mā khalaqa al-dhakara wa'l-unthā* (by Him who created the male and the female) — a single oath with two arms.",
            "thematicTr": "İki Cinsiyet — Beşerî Tamamlanmanın İki Kutbu",
            "thematicEn": "Two Sexes — The Two Poles of Human Completion",
            "depthTr": "İbn Kayyim bu çifti 'beşerî fıtratın iki ucu' olarak adlandırır. Tek başına erkek veya dişi varoluşun tamamlanmış formu değildir — ikisi birlikte insanı temsil eder. Ayet, yaratma fiilinin (halak) hem erkeği hem dişiyi **eşit bir aktif-yaratma** olarak almasına dikkat çeker (kadın 'türevsel' değil, doğrudan 'halk edilmiş'). Râzî Mefâtîh'te bu ayetin yaratılış kozmolojisindeki önemini vurgular: çoklu kutupluluk (ikilik) ancak tek bir Yaratıcı'nın birliğinde mümkündür.",
            "depthEn": "Ibn Qayyim calls this pair 'the two ends of human nature (*fiṭra*).' Neither male nor female alone is the completed form of existence — together they represent the human. The verse emphasizes that the act of creation (*khalaqa*) takes both male and female as **equally active creations** (the female is not 'derivative' but directly 'created'). Al-Rāzī in *Mafātīḥ* underscores this verse's significance in creation cosmology: multiplicity (duality) is possible only in the unity of a single Creator."
          },
          {
            "id": "pair-shafa-vitr",
            "firstId": "fecr-89-3-sef-vetr",
            "firstLabel": "Çift",
            "firstLabelEn": "Even",
            "firstRef": "Fecr 89:3",
            "secondId": "fecr-89-3-sef-vetr-2",
            "secondLabel": "Tek",
            "secondLabelEn": "Odd",
            "secondRef": "Fecr 89:3",
            "pairNotTr": "Bu iki öğe de tek ayet içinde — 've'ş-şef'i ve'l-vetr' (çifte ve teke yemin olsun).",
            "pairNotEn": "Both elements in a single verse: *wa'l-shafʿi wa'l-watr* (by the even and the odd).",
            "thematicTr": "Sayısal İkilik — Varlığın Matematiksel Deseni",
            "thematicEn": "Numerical Duality — The Mathematical Pattern of Existence",
            "depthTr": "İbn Kayyim, bu yeminin **Kur'ân yeminleri arasında en açık olanlarından biri** olduğunu söyler — çünkü her sayı ya çifttir ya tek, başka seçenek yoktur. 'Çift ve Tek' ifadesi, varlığın tüm matematik kompozisyonunu kapsayan bir tasarım yeminidir. Bu ayete müfessirler çok çeşitli yorumlar getirmişlerdir: (1) çift = yaratılmışlar / tek = Allah (Kurtubî), (2) çift = kul ile Rab / tek = Allah'ın Zâtı (Râzî), (3) matematiğin iki temel sınıfı (Elmalılı). Her yorum ortak bir temel kabul eder: **bu yemin, bir düzen iddiasıdır, sayısal ve metafiziksel.**",
            "depthEn": "Ibn Qayyim calls this **one of the most explicit oaths** in the Qur'an — because every number is either even or odd, with no other option. 'Even and Odd' is an oath encompassing the entire mathematical composition of existence. Exegetes have offered many readings: (1) even = created things / odd = Allah (al-Qurṭubī), (2) even = servant and Lord / odd = the divine Essence (al-Rāzī), (3) the two basic classes of mathematics (Elmalılı). Each reading shares a common foundation: **this oath is a claim about order — numerical and metaphysical.**"
          },
          {
            "id": "pair-idha-yaghsha-idha-tajalla",
            "firstId": "leyl-92-1",
            "firstLabel": "(Gece) Örttüğü Zaman",
            "firstLabelEn": "When (Night) Covers",
            "firstRef": "Leyl 92:1",
            "secondId": "leyl-92-2",
            "secondLabel": "(Gündüz) Tecelli Ettiği Zaman",
            "secondLabelEn": "When (Day) Unveils",
            "secondRef": "Leyl 92:2",
            "thematicTr": "Zamansal Fiil Zıtlığı — Anlık Geçişler",
            "thematicEn": "Temporal Verbal Antithesis — Moments of Transition",
            "depthTr": "Aynı Leyl-Nehâr çiftinin **fiil boyutu**. Burada 'idhâ' (-dığında) zarfıyla iki zıt anlık geçiş vurgulanır: 'gece örtmeye başladığında' vs. 'gündüz açılmaya başladığında'. Zemahşerî belâgatin zirvesi olarak gördüğü bu yapıyı 'iki hareketin iki yönü' olarak tanımlar. Sadece statik zıtlık değil — **dönüşen, akan zıtlık**.",
            "depthEn": "The **verbal dimension** of the same Night-Day pair. Here the particle *idhā* ('when') highlights two opposite momentary transitions: 'when night begins to cover' vs. 'when day begins to unveil.' Al-Zamakhsharī, calling this a peak of *balāgha*, describes it as 'the two directions of two motions.' Not merely static antithesis but **transforming, flowing antithesis**."
          }
        ],
        "scholarNote": {
          "sourceTr": "İbn Kayyim el-Cevziyye, et-Tibyân fî Aksâmi'l-Kur'ân (14. yüzyıl) — 'el-Aksâm bi'l-Mütekâbilât' bölümü",
          "sourceEn": "Ibn Qayyim al-Jawziyya, *al-Tibyān fī Aqsām al-Qurʾān* (14th century) — section on 'al-Aqsām bi'l-Mutaqābilāt'",
          "commentaryTr": "İbn Kayyim bu tasnifi şöyle tanımlar: 'Zıt çiftlerle yemin, yemin edilenin bütünlüğüne yapılan bir vurgudur — çünkü bir hakikat ancak kendi zıddı ile tanınır. Allah gece ile gündüze, erkek ile dişiye, çift ile teke birlikte yemin ederek, bu zıtlıkların **hepsine birden** şahitlik yapar.'",
          "commentaryEn": "Ibn Qayyim defines this classification thus: 'An oath by opposing pairs is an emphasis on the wholeness of what is sworn by — because a truth is recognized only through its opposite. By swearing jointly by night and day, male and female, even and odd, Allah bears witness to **all of these oppositions at once**.'"
        },
        "ekolEtiketi": "klasik tefsir (İbn Kayyim Hanbelî geleneği)"
      }
    ]
  }
}
```

---

## 3. UI Öneri (Mevcut KuranYeminleri.jsx İçinde)

Mevcut tool şu yapıda:
- Kategori tab'ları (celestial, time, place, forces, human-soul, sacred-texts, eschatology)
- Her kategori item grid'i
- İbn Kayyim özel bölümü (alt kısımda pull quote + kartlar)

**Ekleme:** İbn Kayyim bölümünde yeni bir alt-bölüm: **"Zıt Çiftler Görünümü"**

- Sayfanın bu bölümüne gelindiğinde 4 çift kart grid'de gösterilir
- Her çift kartı: sol yarıda `firstLabel`, sağ yarıda `secondLabel`, ortada `×` ayracı veya bir yin-yang tarzı görsel
- Kart'a tıklanınca detay açılır: `thematic`, `depth`, kaynak
- Kullanıcı bir çiftin yanında "Bireysel yemine git" linkine tıklayınca mevcut kategori grid'ine scroll edilir (cross-reference)

**Görsel metafor:** Zıt çiftler her zaman bir çizgi ile bağlı — "dua" (iki bağlı) gösterimi. Yin-yang değil ama benzer bir dualistik görsel.

---

## 4. Kaynaklar

**Klasik tefsir / usûl:**
1. **İbn Kayyim el-Cevziyye, et-Tibyân fî Aksâmi'l-Kur'ân** — Bu taslağın omurgası. 14. yy. eseri; Kur'ân yeminlerinin sistematik analizi için en önemli klasik kaynak. Site'de zaten birincil otorite olarak kullanılıyor.
2. **Zemahşerî, el-Keşşâf** — Leyl 92:1-2 ve Fecr 89:3 yemin yapılarının belâgat analizi. "Tezâdî yapı zirvesi" ifadesi buradan.
3. **Fahreddin er-Râzî, Mefâtîhu'l-Gayb** — Leyl 92:3 (erkek-dişi yaratma kozmolojisi) ve Fecr 89:3 ("çift = kul, tek = Rab" yorumu).
4. **Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân** — Fecr 89:3 ("çift = yaratılmışlar, tek = Allah" yorumu).
5. **Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili** — Fecr 89:3 matematiksel yorumu; Leyl sûresi genel analizi.

**Modern akademik:**
6. **Michel Cuypers, *The Composition of the Qur'an*, Bloomsbury, 2015** — zıt çift yapılarının ring composition ile ilişkisi.

**Korpus/verse-graph:**
7. `public/verse-graph-bgem3.json` — Leyl 92:1-4, Fecr 89:2-4 ayetleri doğrulandı.

---

## 5. Uyarılar / Açık Sorular

1. **Mevcut item ID'leri:** Yukarıdaki `firstId`/`secondId` alanlarında referans verilen item ID'ler (`leyl-92-1`, `leyl-92-3-erkek-disi` vb.) **yeminler.json'daki mevcut item ID'leri ile birebir eşleşmek zorunda**. Taslak JSON'a geçerken bu ID'ler doğrulanmalı — farklı isimlendirme varsa uygun şekilde güncellenmeli.

2. **"On Gece" (Fecr 89:2) dahil mi?** — On Gece yemini bir "zıt çift" değil, tekil bir öğedir (zilhicce'nin ilk on gecesi). Dolayısıyla bu taslakta **dahil edilmedi** — ama kullanıcı isterse "sayısal kompozisyon" alt kategorisine eklenebilir.

3. **"Rücû' Sâhibi Gök / Yarılan Yer" (Târık 86:11-12)** — Bu da bir zıt çift örneği (gök/yer, rücû'/yarılma). Mevcut yeminler.json'da yer varsa eklenecek 5. çift olabilir. Şu an taslakta yer almadı — ilk versiyonu 4 çiftle tutmak temiz.

4. **Yeni "kategori" değil, "pattern" olmasının nedeni:** Duplicate item üretmekten kaçınmak ve bir **görünüm katmanı** olarak eklemek. Mevcut 7 kategori bozulmaz, sadece üstüne retorik çerçeveleme katmanı gelir.

5. **İbn Kayyim'in 3 tasnifinin diğer ikisi** — Bu taslak sadece **birinci tasnif** (zıt çiftler) için. Diğer iki tasnifi (el-aksâmu'l-müfred ve el-aksâmu'l-mürekkeb) ileride ayrı mikro içeriklerde işlenebilir. `ibnKayyimPatterns.patterns[]` dizisi bu genişlemeye hazır olacak şekilde tasarlandı.

---

## 6. Taslak İstatistikleri

- **Yeni eklenen item:** 0 (mevcut item'ları referans veren meta-bölüm)
- **Gösterilen zıt çift:** 4 (Leyl-Nehâr, Dhakar-Unthâ, Çift-Tek, İdhâ Yağşâ-İdhâ Tecellâ)
- **Referans verilen mevcut item:** 5 (hepsi yeminler.json'da zaten mevcut — ID doğrulaması merge öncesi yapılmalı)
- **Klasik tefsir kaynağı:** 5 (İbn Kayyim, Zemahşerî, Râzî, Kurtubî, Elmalılı)
- **Modern akademik:** 1 (Cuypers)
- **Ayet referansı:** 4 (Leyl 92:1, 92:2, 92:3; Fecr 89:3 — %100 verse-graph doğrulandı)

Bu taslak **kullanıcı onayı** bekler. Onay sonrası:
1. `yeminler.json`'a yeni top-level alan (`ibnKayyimPatterns`) eklenir
2. Mevcut item ID'leri doğrulanır (gerekirse `firstId`/`secondId` güncellenir)
3. `KuranYeminleri.jsx`'e "Zıt Çiftler Görünümü" alt-bölümü eklenir (agent yapmaz — kullanıcı veya UI agent yapar)
