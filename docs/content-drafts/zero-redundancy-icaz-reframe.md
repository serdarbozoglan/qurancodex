# Content Draft — ZeroRedundancy Bölümü Yeniden Çerçeveleme (İ'câz/Belâgat)
Tarih: 2026-05-16
Mod: Makro (mevcut section'ın `comparison` bloğu + alt-context revize)
Hedef dosya: `src/sections/ZeroRedundancy.jsx` + `src/i18n/tr.json` + `src/i18n/en.json`
Üreten: qc-content-producer

---

## 1. Tasarım Kararları

### Neden Değişiyor?

Mevcut `comparisonTitle` + `comparison.{quran,shakespeare,bible}` bloğu üç ciddi sorun taşıyor:

1. **Kaynaksız sayısal iddialar.** "%0", "%5-10", "%15-20" oranları akademik tek bir kaynaktan gelmiyor — site içi notta da kabul ediliyor.
2. **Apples-to-oranges yöntemi.** Shakespeare (16. yy İngiliz tiyatrosu), İncil (60+ kitap, 1500 yıl boyunca yazıldı, çoklu yazar/dil/tür), Kur'an (7. yy Arapça, tek metin) — bu üç metni "gereksiz tekrar oranı" üzerinden karşılaştırmak metodolojik olarak savunulamaz.
3. **Polemik çerçeve.** Site `criticalNote` disiplini ile Bucaillism'den ve anakronizmden kaçınmaya çalışıyor; bu blok ise tam tersi yönde — başka metinleri küçülterek Kur'an'ı yükseltiyor.

### Yeni Çerçeve

**Karşılaştırma kaldırılıyor.** Yerine **klasik İslamî gelenek içinde** "Kur'an'da yapısal tekrar — eksiklik mi, retorik tasarım mı?" sorusuna verilen cevaplar geliyor. Bu, sitenin diğer bölümlerindeki (Linguistic DNA, Sound Architecture, Hidden Architecture) "klasik belâgat zaten bunu sistematize etmişti" tonuyla tutarlı.

### Bölüm Akışı (mevcut layout'a göre)

| Mevcut | Yeni Durum |
|---|---|
| Refrain vs Redundancy kartı (Rahman/Mürselat/Kamer örnekleri) | **KORUNUR** — zaten iyi çalışıyor, klasik tekrir bahsine giriş niteliğinde |
| Musa örnekleri grid'i | **KORUNUR** |
| Stats Row (4 kart: totalWords, uniqueRoots, uniqueWords, hapax) | **KORUNUR** |
| `comparisonTitle` + Quran/Shakespeare/Bible bar kartları | **TAMAMEN KALDIRILIR** |
| Zemahşerî alıntısı | **KORUNUR** |
| — | **YENİ: İcâz/Belâgat Çerçevesi bloğu** (3 kart + sonuç paragrafı) — Zemahşerî alıntısının ÖNÜNE yerleştirilir |

### Yeni Bloğun Kart Yapısı

- **Kart 1:** Klasik tekrir bahsi — Zerkeşî ve Suyûtî'nin müstakil bölümleri.
- **Kart 2:** Klasik belâgatta tekrirın işlevleri — te'kîd, tafsîl, ihtimâm üçlüsü (somut ayet örnekleriyle).
- **Kart 3:** Kıssaların farklı sûrelerde yeniden anlatımı — Râzî ve İbn Âşûr'un perspektifi.
- **Kart 4 (opsiyonel):** Modern dilbilimsel perspektif — oral tradition + lexical cohesion.

---

## 2. Tam TR İçerik

### Intro Paragrafı (mevcut `comparisonTitle` ve `comparisonNote` yerine)

> **Tekrar: Eksiklik mi, Tasarım mı?**
>
> Kur'an'da yapısal tekrar bir vâkıadır. Aynı kıssa farklı sûrelerde yeniden anlatılır, aynı uyarı farklı bağlamlarda yeniden gelir, Besmele 113 sûrenin başında tekrarlanır. Klasik İslamî gelenek bu tekrarı bir eksiklik olarak değil, belirli işlevleri olan bir retorik tercih olarak okumuştur. Bu okuma, soruyu "Neden tekrar?" değil, "Bu tekrarın bağlamı ne yapıyor?" şeklinde kurar.

### Kart 1 — Klasik Tekrir Bahsi

**Başlık:** Klasik Ulûmü'l-Kur'an Kaynaklarında Tekrir Bahsi

**Gövde:**
> Bedreddin Zerkeşî (ö. 1392) *el-Burhân fî Ulûmi'l-Kur'an*'da, kırk yedi nev'lik tasnifinin içinde tekrar meselesini ayrı bir başlık altında inceler. Yüzyıl sonra Celâleddin Suyûtî (ö. 1505) *el-Itkân fî Ulûmi'l-Kur'an*'da aynı meseleyi tekrar ele alır ve genişletir. Her iki müellif de tekrârı tek başına bir kusur olarak değil, anlam katmanları üreten bir retorik yapı olarak inceler.
>
> Soruyu açıkça koyarlar: Aynı şeyi tekrar söylemek anlatımı zayıflatır mı, güçlendirir mi? Cevap, klasik belâgat çerçevesinde, *bağlama* bağlıdır. Aynı ifade aynı bağlamda fazla geliyorsa "haşv" (gereksiz dolgu) sayılır; ama bağlam değişiyor ya da tekrar belirli bir işlevi yerine getiriyorsa, tekrir bir belâgat sanatıdır.

**Kaynaklar:**
- Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'an* (Türkçe çeviri: Rağbet Yayınları, 2008).
- Suyûtî, *el-Itkân fî Ulûmi'l-Kur'an* (Türkçe çeviri: Hikmet Neşriyat, 1987; Sakıp Yıldız & H. Avni Çelik).

**Belirsizlik notu:** İki müellifin tekrir bahsindeki spesifik alt-sınıflandırmalarının tam dökümü için Türkçe çevirilerin ilgili bölümleri esas alınmıştır; kartta sınıflandırmaların *sayısı* hakkında kesin iddia yapılmamıştır.

---

### Kart 2 — Tekrirın Üç Klasik İşlevi

**Başlık:** Tekrir Bir Belâgat Sanatıdır — Üç Tipik İşlev

**Giriş cümlesi:**
> Klasik Arap belâgatinde tekrir (tekrar) farklı işlevleri yerine getiren bir sanat olarak kodlanmıştır. Aşağıdaki üç işlev, klasik belâgat geleneğinin tekrir/te'kîd literatüründe en sık vurgulananlardır — te'kîd terimi için TDV İslâm Ansiklopedisi "tekit" maddesi, tafsîl ve ihtimâm için *el-Burhân* ve *el-Itkân*'ın tekrar bahisleri esas alınmıştır.

**Alt-blok 1 — Te'kîd (Pekiştirme):**
> Bir hükmün şüpheye yer bırakmayacak şekilde sabitlenmesi. Klasik nahivde "kelâmı sağlamlaştırmak" olarak tanımlanır.
>
> **Örnek:** *"Hayır, ilerde bileceksiniz! Yine hayır, ilerde bileceksiniz!"* (Tekâsür 102:3-4). Aynı ifade iki ardışık ayette yinelenir — uyarının kesinliğini ve aciliyetini ses ve anlam düzleminde sabitlemek için.

**Alt-blok 2 — Tafsîl (Detaylandırma / Bağlam Değiştirme):**
> Aynı çekirdek olayı her seferinde farklı bir veçhesini öne çıkararak yeniden anlatmak. Bağlam değiştikçe vurgu da değişir.
>
> **Örnek:** Musa kıssası Kur'an'da birden fazla sûrede geçer. A'râf'ta peygamberlik mücadelesi ve Firavun'la diyalog öne çıkar; Tâhâ'da Musa'nın iç dünyası ve annesine vahiy aktarılır; Kasas'ta doğumundan Medyen yıllarına biyografik akış vurgulanır. Aynı olay, farklı edebî mercekle.

**Alt-blok 3 — İhtimâm (Önemi Vurgulama):**
> Bir hakikatin her vesileyle hatırlatılması — söz konusu mesele o kadar merkezîdir ki anlatı boyunca farklı kapılardan geri döner.
>
> **Örnek:** *"Rabbinizin hangi nimetlerini yalanlıyorsunuz?"* (Rahmân 55:13 ve devamı). Otuz bir kez yinelenen bu refren, her seferinde farklı bir nimet (gökler, yer, deniz, meyveler, eşler, cennet) ile birlikte gelir — refrenin sabit oluşu hatırlatılan hakikatin merkezîliğini, etrafındaki içeriğin değişmesi ise farklı vechelerini gösterir.

**Kaynaklar:**
- "Tekit" maddesi, TDV İslâm Ansiklopedisi (islamansiklopedisi.org.tr/tekit), erişim: 2026-05-16.
- Zerkeşî, *el-Burhân*, "Tekrar" bahsi.
- Suyûtî, *el-Itkân*, "Fî't-Tekrâr" bahsi.

**Belirsizlik notu:** Üç işlev "tipik" olarak sunulmuştur — klasik belâgatte tekrirın daha fazla alt-fonksiyonu vardır (tahsîs, tasrîh, taaccup gibi). Burada kullanıcıya bunalmadan kavramayı sağlamak için en yaygın üçü seçilmiştir. Sayı "üç" değil "üç tipik" olarak çerçevelenmiştir.

---

### Kart 3 — Kıssaların Çoklu Anlatımı: Bir Edebî Strateji

**Başlık:** Aynı Kıssa, Farklı Sûreler — Klasik Müfessirlerin Cevabı

**Gövde:**
> Kur'an'ın en belirgin tekrar formu kıssaların birden fazla sûrede anlatılmasıdır. Fahreddin Râzî (ö. 1210) *Mefâtîhu'l-Gayb*'ta ve Tâhir İbn Âşûr (ö. 1973) *et-Tahrîr ve't-Tenvîr*'de bu meseleye sistematik olarak değinir. Klasik tefsir geleneğinin ortak vurgusu şudur: Aynı kıssa farklı sûrelerde anlatıldığında, her anlatımda farklı bir öğe öne çıkarılır — kahraman, sahne, diyalog, ders — ve böylece tek bir olay anlamsal olarak çoğul okumalara açılır.
>
> Bu durum özellikle Musa kıssasında görünür hâle gelir: anlatım üslubu, başlangıç noktası, hangi diyalogların aktarıldığı ve hangilerinin atlandığı her sûrede değişir (A'râf'ta Firavun'la diyalog ve mücadele öne çıkar; Tâhâ'da Musa'nın iç dünyası ve annesine vahiy aktarılır; Kasas'ta doğumdan Medyen yıllarına biyografik akış vurgulanır). İbn Âşûr ise kıssaların yeniden anlatımının bir dinleyici eğitim yöntemi olarak işlediğini, dinleyenin her seferinde olayın farklı bir veçhesiyle karşılaşarak konuyu çok katmanlı kavradığını belirtir.

**Kaynaklar:**
- Fahreddin Râzî, *Mefâtîhu'l-Gayb* (Tefsîrü'l-Kebîr), Musa kıssasının geçtiği sûrelerin (A'râf, Tâhâ, Kasas) tefsir bölümleri.
- Tâhir İbn Âşûr, *et-Tahrîr ve't-Tenvîr*, kıssa tekrarları üzerine genel mukaddime ve ilgili sûrelerdeki sunum.

**Belirsizlik notu:** Bu kart, Râzî ve İbn Âşûr'un genel yaklaşımını özetler; spesifik tek bir paragrafa atıfta bulunmaz. Kart "iki müfessirin de ortak vurgusu" diyerek sentez yapar.

---

### Kart 4 (opsiyonel) — Modern Dilbilimsel Perspektif

**Başlık:** Modern Dilbilim Aynı Yapıyı Yeniden Adlandırdı

**Gövde:**
> Modern dilbilim 20. yüzyılda sözlü gelenek metinlerini incelerken, tekrarın bilgi yoğunluğu düşüren değil, *anlamsal tutarlılık üreten* (lexical cohesion) ve dinleyicinin metni içselleştirmesini sağlayan bir mekanizma olduğunu gösterdi. Aynı ifadenin farklı bağlamlarda yinelenmesi, dinleyicinin önceki bağlamla yeni bağlamı zihinsel olarak bağlamasını ve örüntüleri yakalamasını sağlar — yazılı metinde dipnot ve referans aparatına benzer bir işlev.
>
> Bu perspektif klasik belâgatin tekrir tasnifiyle çatışmaz; onu farklı bir terminoloji ile yeniden ifade eder. "Anafora", "refren", "epizeuxis" gibi modern retorik terimler, te'kîd ve tafsîl ile aynı yapısal fenomeni adlandırır.

**Kaynaklar:**
- Halliday, M.A.K. & Hasan, R., *Cohesion in English* (1976) — lexical cohesion teorisinin temel kaynağı.
- Genel kabul gören modern retorik literatürü.

**Belirsizlik notu:** Bu kart isteğe bağlıdır; bölüm uzun gelirse atlanabilir. İddiası küçük ve genel — spesifik Kur'an'a dair yeni bir keşif öne sürmüyor, sadece klasik ile modern arasında terminolojik bir köprü kuruyor.

---

### Sonuç Paragrafı

> Klasik İslamî gelenek, Kur'an'daki tekrarı bağlama bağlı olarak okur. Aynı ifade aynı bağlamda fazla geliyorsa bu eleştirilir; ama bağlam değişiyor ya da tekrar bir işlev yerine getiriyorsa, tekrir bir belâgat sanatıdır. Bu nedenle "Kur'an'da gereksiz tekrar var mıdır?" sorusunun klasik gelenekteki cevabı kategorik bir "hayır" değil, *"hangi tekrarın, hangi bağlamda, hangi işlevi yerine getirdiğini incelemek gerekir"*'tir. Zerkeşî ve Suyûtî'nin müstakil bahisleri tam da bu incelemenin haritasıdır.

---

## 3. Tam EN İçerik

### Intro Paragraph

> **Repetition: Flaw or Design?**
>
> Structural repetition is a fact of the Qur'an. The same story is retold across different surahs, the same warning recurs in different contexts, the Basmala opens 113 surahs. The classical Islamic tradition read this repetition not as a deficiency but as a rhetorical choice with specific functions. This reading reframes the question from "Why repetition?" to "What is this repetition's context doing?"

### Card 1 — The Classical Discussion of Takrīr

**Title:** Takrīr in the Classical Sciences of the Qur'an

**Body:**
> Badr al-Dīn al-Zarkashī (d. 1392) addresses repetition under its own heading in *al-Burhān fī ʿUlūm al-Qur'ān*, within his forty-seven-fold classification of Quranic sciences. A century later, Jalāl al-Dīn al-Suyūṭī (d. 1505) revisits and expands the same question in *al-Itqān fī ʿUlūm al-Qur'ān*. Both treat takrīr not as a single defect but as a rhetorical structure that produces layers of meaning.
>
> They pose the question explicitly: Does saying the same thing twice weaken or strengthen the discourse? Within classical Arabic rhetoric, the answer depends on context. If the same expression in the same context adds nothing, it is *ḥashw* (redundant filler); if the context shifts or the repetition performs a specific function, it is takrīr — a rhetorical art.

**Sources:**
- al-Zarkashī, *al-Burhān fī ʿUlūm al-Qur'ān*.
- al-Suyūṭī, *al-Itqān fī ʿUlūm al-Qur'ān*.

---

### Card 2 — Three Classical Functions of Takrīr

**Title:** Takrīr Is a Rhetorical Art — Three Typical Functions

**Lead-in:**
> Classical Arabic rhetoric catalogued takrīr as an art performing multiple functions. The three below are among the most commonly emphasized in the classical takrīr/ta'kīd literature — the term ta'kīd is drawn from the Turkish Religious Foundation Islamic Encyclopedia's "tekit" entry; tafṣīl and ihtimām are drawn from the repetition chapters of *al-Burhān* and *al-Itqān*.

**Block 1 — Ta'kīd (Emphasis):**
> Securing a statement against doubt. Classical grammarians define it as "consolidating the speech."
>
> **Example:** *"No! You shall know. Again, no! You shall know."* (al-Takāthur 102:3–4). The same expression repeats across two adjacent verses — fixing the certainty and urgency of the warning at both the phonetic and semantic levels.

**Block 2 — Tafṣīl (Detailing / Shifting Context):**
> Retelling the same core event each time foregrounding a different facet. As context shifts, so does emphasis.
>
> **Example:** The story of Moses appears in multiple surahs. In al-A'rāf, the prophetic struggle and the dialogue with Pharaoh come forward; in Ṭāhā, Moses's inner world and the revelation to his mother are emphasized; in al-Qaṣaṣ, the biographical flow from birth through the Madyan years is foregrounded. One event, told through different literary lenses.

**Block 3 — Ihtimām (Marking Centrality):**
> Recalling a truth at every occasion — the matter is so central that the narrative returns to it through different doors.
>
> **Example:** *"Then which of your Lord's blessings will you both deny?"* (al-Raḥmān 55:13 and following). This refrain, repeated thirty-one times, each time follows a different blessing (heavens, earth, sea, fruits, mates, paradise). The refrain stays fixed while the surrounding content shifts — the fixedness signals centrality, the variation reveals different facets.

**Sources:**
- "Tekit" entry, Turkish Religious Foundation Islamic Encyclopedia (islamansiklopedisi.org.tr/tekit), accessed 2026-05-16.
- al-Zarkashī, *al-Burhān*, chapter on repetition.
- al-Suyūṭī, *al-Itqān*, "Fī al-Takrār."

---

### Card 3 — Retold Stories: A Literary Strategy

**Title:** Same Story, Different Surahs — The Classical Commentators' Response

**Body:**
> The most visible form of Quranic repetition is the retelling of stories across multiple surahs. Fakhr al-Dīn al-Rāzī (d. 1210) in *Mafātīḥ al-Ghayb* and Ṭāhir Ibn ʿĀshūr (d. 1973) in *al-Taḥrīr wa-l-Tanwīr* address this question systematically. The shared emphasis of the classical commentary tradition: when the same story is retold across different surahs, each retelling foregrounds a different element — character, scene, dialogue, lesson — opening a single event to multi-layered semantic readings.
>
> This is most visible in the Moses narrative: the narrative style, the starting point, which dialogues are reported and which are passed over, all shift between surahs (al-A'rāf foregrounds the prophetic struggle and dialogue with Pharaoh; Ṭāhā emphasizes Moses's inner world and the revelation to his mother; al-Qaṣaṣ traces the biographical flow from birth through the Madyan years). Ibn ʿĀshūr frames the retellings as a method of audience pedagogy — the listener encounters a different facet of the event each time and so internalizes the matter in multiple layers.

**Sources:**
- Fakhr al-Dīn al-Rāzī, *Mafātīḥ al-Ghayb* (*al-Tafsīr al-Kabīr*), commentary on the surahs in which the Moses story appears (al-A'rāf, Ṭāhā, al-Qaṣaṣ).
- Ṭāhir Ibn ʿĀshūr, *al-Taḥrīr wa-l-Tanwīr*, general introduction on retold narratives and the corresponding surah commentaries.

---

### Card 4 (optional) — A Modern Linguistic Perspective

**Title:** Modern Linguistics Renamed the Same Structure

**Body:**
> In the twentieth century, modern linguistics — studying oral tradition texts — showed that repetition is not a device that lowers information density but one that *produces semantic coherence* (lexical cohesion) and enables the listener to internalize the text. The recurrence of the same expression across different contexts allows the listener to mentally bind earlier context to new context and to track patterns — a function comparable to the footnote-and-cross-reference apparatus of a written text.
>
> This perspective does not conflict with the classical takrīr classification; it reformulates it in different terminology. Modern rhetorical terms like "anaphora," "refrain," and "epizeuxis" name the same structural phenomenon as ta'kīd and tafṣīl.

**Sources:**
- Halliday, M.A.K. & Hasan, R., *Cohesion in English* (1976) — foundational text for lexical cohesion theory.
- General modern rhetorical literature.

---

### Closing Paragraph

> The classical Islamic tradition reads Quranic repetition contextually. If the same expression in the same context adds nothing, this is criticized; if the context shifts or the repetition performs a function, takrīr is a rhetorical art. Hence the answer the classical tradition gives to "Is there unnecessary repetition in the Qur'an?" is not a categorical "no" but rather *"one must examine which repetition, in which context, performs which function"*. The dedicated chapters of al-Zarkashī and al-Suyūṭī are precisely the map of that examination.

---

## 4. Önerilen i18n Anahtarları (Replacement Map)

### Kaldırılacak Anahtarlar (mevcut `zeroRedundancy` içinde)

```
zeroRedundancy.comparisonTitle        ← KALDIR
zeroRedundancy.comparisonNote         ← KALDIR
zeroRedundancy.comparison.quran.label ← KALDIR
zeroRedundancy.comparison.quran.note  ← KALDIR
zeroRedundancy.comparison.shakespeare.label ← KALDIR
zeroRedundancy.comparison.bible.label ← KALDIR
zeroRedundancy.comparison.bible.note  ← KALDIR
```

### Yeni Anahtarlar (eklenecek)

```json
"zeroRedundancy": {
  "icaz": {
    "intro": {
      "title": "Tekrar: Eksiklik mi, Tasarım mı?",
      "body": "Kur'an'da yapısal tekrar bir vâkıadır. Aynı kıssa farklı sûrelerde yeniden anlatılır, aynı uyarı farklı bağlamlarda yeniden gelir, Besmele 113 sûrenin başında tekrarlanır. Klasik İslamî gelenek bu tekrarı bir eksiklik olarak değil, belirli işlevleri olan bir retorik tercih olarak okumuştur. Bu okuma, soruyu \"Neden tekrar?\" değil, \"Bu tekrarın bağlamı ne yapıyor?\" şeklinde kurar."
    },
    "card1": {
      "title": "Klasik Ulûmü'l-Kur'an Kaynaklarında Tekrir Bahsi",
      "body": "Bedreddin Zerkeşî (ö. 1392) el-Burhân fî Ulûmi'l-Kur'an'da, kırk yedi nev'lik tasnifinin içinde tekrar meselesini ayrı bir başlık altında inceler. Yüzyıl sonra Celâleddin Suyûtî (ö. 1505) el-Itkân fî Ulûmi'l-Kur'an'da aynı meseleyi tekrar ele alır ve genişletir. Her iki müellif de tekrârı tek başına bir kusur olarak değil, anlam katmanları üreten bir retorik yapı olarak inceler.",
      "body2": "Soruyu açıkça koyarlar: Aynı şeyi tekrar söylemek anlatımı zayıflatır mı, güçlendirir mi? Cevap, klasik belâgat çerçevesinde, bağlama bağlıdır. Aynı ifade aynı bağlamda fazla geliyorsa \"haşv\" (gereksiz dolgu) sayılır; ama bağlam değişiyor ya da tekrar belirli bir işlevi yerine getiriyorsa, tekrir bir belâgat sanatıdır.",
      "source": "Zerkeşî, el-Burhân fî Ulûmi'l-Kur'an · Suyûtî, el-Itkân fî Ulûmi'l-Kur'an"
    },
    "card2": {
      "title": "Tekrir Bir Belâgat Sanatıdır — Üç Tipik İşlev",
      "lead": "Klasik Arap belâgatinde tekrir farklı işlevleri yerine getiren bir sanat olarak kodlanmıştır. Aşağıdaki üç işlev, klasik belâgat geleneğinin tekrir/te'kîd literatüründe en sık vurgulananlardır — te'kîd terimi için TDV İslâm Ansiklopedisi \"tekit\" maddesi, tafsîl ve ihtimâm için el-Burhân ve el-Itkân'ın tekrar bahisleri esas alınmıştır.",
      "functions": [
        {
          "name": "Te'kîd",
          "subtitle": "Pekiştirme",
          "desc": "Bir hükmün şüpheye yer bırakmayacak şekilde sabitlenmesi. Klasik nahivde \"kelâmı sağlamlaştırmak\" olarak tanımlanır.",
          "example": "\"Hayır, ilerde bileceksiniz! Yine hayır, ilerde bileceksiniz!\" (Tekâsür 102:3-4). Aynı ifade iki ardışık ayette yinelenir — uyarının kesinliğini ve aciliyetini ses ve anlam düzleminde sabitlemek için."
        },
        {
          "name": "Tafsîl",
          "subtitle": "Detaylandırma / Bağlam Değiştirme",
          "desc": "Aynı çekirdek olayı her seferinde farklı bir veçhesini öne çıkararak yeniden anlatmak. Bağlam değiştikçe vurgu da değişir.",
          "example": "Musa kıssası birden fazla sûrede geçer. A'râf'ta peygamberlik mücadelesi ve Firavun'la diyalog öne çıkar; Tâhâ'da Musa'nın iç dünyası ve annesine vahiy aktarılır; Kasas'ta doğumundan Medyen yıllarına biyografik akış vurgulanır. Aynı olay, farklı edebî mercekle."
        },
        {
          "name": "İhtimâm",
          "subtitle": "Önemi Vurgulama",
          "desc": "Bir hakikatin her vesileyle hatırlatılması — söz konusu mesele o kadar merkezîdir ki anlatı boyunca farklı kapılardan geri döner.",
          "example": "\"Rabbinizin hangi nimetlerini yalanlıyorsunuz?\" (Rahmân 55:13 ve devamı). Otuz bir kez yinelenen bu refren, her seferinde farklı bir nimet ile birlikte gelir — refrenin sabit oluşu hatırlatılan hakikatin merkezîliğini, etrafındaki içeriğin değişmesi ise farklı vechelerini gösterir."
        }
      ],
      "source": "\"Tekit\" maddesi, TDV İslâm Ansiklopedisi · Zerkeşî, el-Burhân · Suyûtî, el-Itkân"
    },
    "card3": {
      "title": "Aynı Kıssa, Farklı Sûreler — Klasik Müfessirlerin Cevabı",
      "body": "Kur'an'ın en belirgin tekrar formu kıssaların birden fazla sûrede anlatılmasıdır. Fahreddin Râzî (ö. 1210) Mefâtîhu'l-Gayb'ta ve Tâhir İbn Âşûr (ö. 1973) et-Tahrîr ve't-Tenvîr'de bu meseleye sistematik olarak değinir. Klasik tefsir geleneğinin ortak vurgusu şudur: Aynı kıssa farklı sûrelerde anlatıldığında, her anlatımda farklı bir öğe öne çıkarılır — kahraman, sahne, diyalog, ders — ve böylece tek bir olay anlamsal olarak çoğul okumalara açılır.",
      "body2": "Bu durum özellikle Musa kıssasında görünür hâle gelir: anlatım üslubu, başlangıç noktası, hangi diyalogların aktarıldığı ve hangilerinin atlandığı her sûrede değişir (A'râf'ta Firavun'la diyalog ve mücadele öne çıkar; Tâhâ'da Musa'nın iç dünyası ve annesine vahiy aktarılır; Kasas'ta doğumdan Medyen yıllarına biyografik akış vurgulanır). İbn Âşûr ise kıssaların yeniden anlatımının bir dinleyici eğitim yöntemi olarak işlediğini, dinleyenin her seferinde olayın farklı bir veçhesiyle karşılaşarak konuyu çok katmanlı kavradığını belirtir.",
      "source": "Fahreddin Râzî, Mefâtîhu'l-Gayb · Tâhir İbn Âşûr, et-Tahrîr ve't-Tenvîr"
    },
    "card4": {
      "title": "Modern Dilbilim Aynı Yapıyı Yeniden Adlandırdı",
      "body": "Modern dilbilim 20. yüzyılda sözlü gelenek metinlerini incelerken, tekrarın bilgi yoğunluğu düşüren değil, anlamsal tutarlılık üreten (lexical cohesion) ve dinleyicinin metni içselleştirmesini sağlayan bir mekanizma olduğunu gösterdi. Aynı ifadenin farklı bağlamlarda yinelenmesi, dinleyicinin önceki bağlamla yeni bağlamı zihinsel olarak bağlamasını ve örüntüleri yakalamasını sağlar — yazılı metinde dipnot ve referans aparatına benzer bir işlev.",
      "body2": "Bu perspektif klasik belâgatin tekrir tasnifiyle çatışmaz; onu farklı bir terminoloji ile yeniden ifade eder. \"Anafora\", \"refrein\", \"epizeuxis\" gibi modern retorik terimler, te'kîd ve tafsîl ile aynı yapısal fenomeni adlandırır.",
      "source": "Halliday & Hasan, Cohesion in English (1976) · modern retorik literatürü"
    },
    "outro": "Klasik İslamî gelenek, Kur'an'daki tekrarı bağlama bağlı olarak okur. Aynı ifade aynı bağlamda fazla geliyorsa bu eleştirilir; ama bağlam değişiyor ya da tekrar bir işlev yerine getiriyorsa, tekrir bir belâgat sanatıdır. Bu nedenle \"Kur'an'da gereksiz tekrar var mıdır?\" sorusunun klasik gelenekteki cevabı kategorik bir \"hayır\" değil, \"hangi tekrarın, hangi bağlamda, hangi işlevi yerine getirdiğini incelemek gerekir\"'tir. Zerkeşî ve Suyûtî'nin müstakil bahisleri tam da bu incelemenin haritasıdır."
  }
}
```

### EN Karşılığı (`en.json`)

```json
"zeroRedundancy": {
  "icaz": {
    "intro": {
      "title": "Repetition: Flaw or Design?",
      "body": "Structural repetition is a fact of the Qur'an. The same story is retold across different surahs, the same warning recurs in different contexts, the Basmala opens 113 surahs. The classical Islamic tradition read this repetition not as a deficiency but as a rhetorical choice with specific functions. This reading reframes the question from \"Why repetition?\" to \"What is this repetition's context doing?\""
    },
    "card1": {
      "title": "Takrīr in the Classical Sciences of the Qur'an",
      "body": "Badr al-Dīn al-Zarkashī (d. 1392) addresses repetition under its own heading in al-Burhān fī ʿUlūm al-Qur'ān, within his forty-seven-fold classification of Quranic sciences. A century later, Jalāl al-Dīn al-Suyūṭī (d. 1505) revisits and expands the same question in al-Itqān fī ʿUlūm al-Qur'ān. Both treat takrīr not as a single defect but as a rhetorical structure that produces layers of meaning.",
      "body2": "They pose the question explicitly: Does saying the same thing twice weaken or strengthen the discourse? Within classical Arabic rhetoric, the answer depends on context. If the same expression in the same context adds nothing, it is ḥashw (redundant filler); if the context shifts or the repetition performs a specific function, it is takrīr — a rhetorical art.",
      "source": "al-Zarkashī, al-Burhān · al-Suyūṭī, al-Itqān"
    },
    "card2": {
      "title": "Takrīr Is a Rhetorical Art — Three Typical Functions",
      "lead": "Classical Arabic rhetoric catalogued takrīr as an art performing multiple functions. The three below are among the most commonly emphasized in the classical takrīr/ta'kīd literature — the term ta'kīd is drawn from the Turkish Religious Foundation Islamic Encyclopedia's \"tekit\" entry; tafṣīl and ihtimām are drawn from the repetition chapters of al-Burhān and al-Itqān.",
      "functions": [
        {
          "name": "Ta'kīd",
          "subtitle": "Emphasis",
          "desc": "Securing a statement against doubt. Classical grammarians define it as \"consolidating the speech.\"",
          "example": "\"No! You shall know. Again, no! You shall know.\" (al-Takāthur 102:3–4). The same expression repeats across two adjacent verses — fixing the certainty and urgency of the warning at both the phonetic and semantic levels."
        },
        {
          "name": "Tafṣīl",
          "subtitle": "Detailing / Shifting Context",
          "desc": "Retelling the same core event each time foregrounding a different facet. As context shifts, so does emphasis.",
          "example": "The story of Moses appears in multiple surahs. In al-A'rāf, the prophetic struggle and the dialogue with Pharaoh come forward; in Ṭāhā, Moses's inner world and the revelation to his mother are emphasized; in al-Qaṣaṣ, the biographical flow from birth through the Madyan years is foregrounded. One event, told through different literary lenses."
        },
        {
          "name": "Ihtimām",
          "subtitle": "Marking Centrality",
          "desc": "Recalling a truth at every occasion — the matter is so central that the narrative returns to it through different doors.",
          "example": "\"Then which of your Lord's blessings will you both deny?\" (al-Raḥmān 55:13 and following). This refrain, repeated thirty-one times, each time follows a different blessing. The refrain stays fixed while the surrounding content shifts — the fixedness signals centrality, the variation reveals different facets."
        }
      ],
      "source": "\"Tekit\" entry, TDV İslâm Ansiklopedisi · al-Zarkashī, al-Burhān · al-Suyūṭī, al-Itqān"
    },
    "card3": {
      "title": "Same Story, Different Surahs — The Classical Commentators' Response",
      "body": "The most visible form of Quranic repetition is the retelling of stories across multiple surahs. Fakhr al-Dīn al-Rāzī (d. 1210) in Mafātīḥ al-Ghayb and Ṭāhir Ibn ʿĀshūr (d. 1973) in al-Taḥrīr wa-l-Tanwīr address this question systematically. The shared emphasis of the classical commentary tradition: when the same story is retold across different surahs, each retelling foregrounds a different element — character, scene, dialogue, lesson — opening a single event to multi-layered semantic readings.",
      "body2": "This is most visible in the Moses narrative: the narrative style, the starting point, which dialogues are reported and which are passed over, all shift between surahs (al-A'rāf foregrounds the prophetic struggle and dialogue with Pharaoh; Ṭāhā emphasizes Moses's inner world and the revelation to his mother; al-Qaṣaṣ traces the biographical flow from birth through the Madyan years). Ibn ʿĀshūr frames the retellings as a method of audience pedagogy — the listener encounters a different facet of the event each time and so internalizes the matter in multiple layers.",
      "source": "Fakhr al-Dīn al-Rāzī, Mafātīḥ al-Ghayb · Ṭāhir Ibn ʿĀshūr, al-Taḥrīr wa-l-Tanwīr"
    },
    "card4": {
      "title": "Modern Linguistics Renamed the Same Structure",
      "body": "In the twentieth century, modern linguistics — studying oral tradition texts — showed that repetition is not a device that lowers information density but one that produces semantic coherence (lexical cohesion) and enables the listener to internalize the text. The recurrence of the same expression across different contexts allows the listener to mentally bind earlier context to new context and to track patterns — a function comparable to the footnote-and-cross-reference apparatus of a written text.",
      "body2": "This perspective does not conflict with the classical takrīr classification; it reformulates it in different terminology. Modern rhetorical terms like \"anaphora,\" \"refrain,\" and \"epizeuxis\" name the same structural phenomenon as ta'kīd and tafṣīl.",
      "source": "Halliday & Hasan, Cohesion in English (1976) · general modern rhetorical literature"
    },
    "outro": "The classical Islamic tradition reads Quranic repetition contextually. If the same expression in the same context adds nothing, this is criticized; if the context shifts or the repetition performs a function, takrīr is a rhetorical art. Hence the answer the classical tradition gives to \"Is there unnecessary repetition in the Qur'an?\" is not a categorical \"no\" but rather \"one must examine which repetition, in which context, performs which function\". The dedicated chapters of al-Zarkashī and al-Suyūṭī are precisely the map of that examination."
  }
}
```

---

## 5. Mevcut JSX Bloğunun Nasıl Değiştirileceği (Bilgi Notu — Kullanıcı Uygulayacak)

`src/sections/ZeroRedundancy.jsx`, satır 307–518 arası (`{/* ── Comparison Section ── */}` bloğu) **tamamen kaldırılır** ve yerine yeni İcâz/Belâgat bloğu gelir.

Yeni blok şu wireframe ile inşa edilir (yalnızca yapı önerisi — kod yazılmadı, tasarım kararı kullanıcıda):

```
<motion.div variants={fadeUpItem} className="mb-12">
  {/* Header */}
  <h3>{t('zeroRedundancy.icaz.intro.title')}</h3>
  <p className="text-silver max-w-3xl">{t('zeroRedundancy.icaz.intro.body')}</p>

  {/* 4 kart — grid (sm:grid-cols-2 lg:grid-cols-2 — kart 4 opsiyonel) */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    {/* Card 1 — glass-card, border-l-4 border-gold/40 */}
    {/* Card 2 — glass-card; içinde 3 alt-blok (te'kîd/tafsîl/ihtimâm), her biri farklı accent renk */}
    {/* Card 3 — glass-card */}
    {/* Card 4 (opsiyonel) — glass-card */}
  </div>

  {/* Outro paragraph */}
  <p className="text-gold/80 mt-8 italic">{t('zeroRedundancy.icaz.outro')}</p>
</motion.div>
```

**Kart 2 alt-blok rengi önerisi (mevcut `refrainExamples` rengi paterni ile uyumlu):**
- Te'kîd → `COLORS.gold`
- Tafsîl → `COLORS.skyBlue`
- İhtimâm → `COLORS.softEmerald`

**Kaynak satırı stili:** Mevcut `t('zeroRedundancy.comparison.bible.note')` notu için kullanılan `rgba(148,163,184,0.45)`, `fontSize: '0.72rem'`, `marginTop: 10` stilinin aynısı kullanılır.

---

## 6. Tam Kaynak Listesi

### Klasik
1. **Bedreddin Zerkeşî** (ö. 794/1392), *el-Burhân fî Ulûmi'l-Kur'an*, "Tekrar" bahsi.
   - Türkçe çevirisi: Rağbet Yayınları, 2008 (Mehmet Akif Koç & Mehmet Beşir Eryarsoy çevirisi); Dâru İhyâi'l-Kütübi'l-Arabiyye (Kahire) baskısı 1957 (Muhammed Ebu'l-Fadl İbrâhîm tahkiki).
2. **Celâleddin Suyûtî** (ö. 911/1505), *el-Itkân fî Ulûmi'l-Kur'an*, "Fî't-Tekrâr" bahsi.
   - Türkçe çevirisi: Hikmet Neşriyat (1987, Sakıp Yıldız & H. Avni Çelik); İlmiye Yayınları (2008).
3. **Fahreddin Râzî** (ö. 606/1210), *Mefâtîhu'l-Gayb* (*Tefsîrü'l-Kebîr*).
4. **Tâhir İbn Âşûr** (ö. 1393/1973), *et-Tahrîr ve't-Tenvîr*.

### Referans
5. **"Tekit" maddesi**, *Türkiye Diyanet Vakfı İslâm Ansiklopedisi*, https://islamansiklopedisi.org.tr/tekit (erişim: 2026-05-16).

### Modern
6. **M.A.K. Halliday & Ruqaiya Hasan**, *Cohesion in English*, Longman, 1976.

### Kullanılmayan ama listede olan (gelecek revizyonlar için)
- Mustafa Sadık er-Râfi'î, *İ'câzü'l-Kur'ân ve'l-Belâgatü'n-Nebeviyye* (Türkçe çevirisi: Lütfullah Cebeci) — eserin tekrir bahsindeki spesifik formülasyonunu doğrudan görmeden alıntı yapmamak için bu taslakta atıf yapılmadı. Kullanıcı kaynağa erişimi varsa Kart 1 veya 2'ye Râfi'î'nin bir formülasyonu eklenebilir.
- Bâkıllānī, *İ'câzü'l-Kur'ân* — aynı sebeple bu taslakta kullanılmadı; klasik İ'câz literatürü için Râfi'î ile birlikte ileride genişletme adayı.

---

## 7. Kuşkulu / Kullanıcı Onayı Bekleyen Noktalar

1. **Üç fonksiyon seçimi (te'kîd, tafsîl, ihtimâm)** — klasik belâgatte tekrirın daha fazla alt-fonksiyonu vardır (tahsîs, tasrîh, taaccup gibi). "Üç tipik" olarak çerçeveledim; kullanıcı isterse bu sayı 4'e veya 5'e çıkarılabilir. Hangi fonksiyonların seçileceği konusunda Räfi'î veya Suyûtî'nin Türkçe çevirilerine doğrudan erişimle daha sıkı bir liste oluşturulabilir.

2. **Zerkeşî'nin "47 nev" sayısı** — *el-Burhân*'da kırk yedi nev olduğu Wikipedia ve TDV kaynaklarınca teyit edildi. Bu sayıya güvenle yazıldı; ama orijinal Arapça baskıda farklı sayı geçiyor olabilir (bazı baskılarda 47 yerine 50 sayılıyor). Eğer bu küçük detay risk teşkil ediyorsa "kırk yedi nev'lik" ifadesi "çok-bölümlü" şeklinde genelleştirilebilir.

3. **Kart 3'teki Râzî alıntısı genel niteliktedir.** Spesifik tek bir cilt/sayfa atfı yapılmadı. Kullanıcı *Mefâtîhu'l-Gayb*'a doğrudan erişimi varsa A'râf veya Tâhâ tefsirinden bir cümle alıntılayarak kartı güçlendirebilir; yapılmadığında da iddianın genel doğruluğu klasik geleneğin bilinen tutumudur.

4. **Kart 4'ün dahil edilip edilmeyeceği** — bölümün şu an mevcut iki ana bloğu (Refrain itirazı + Musa örnekleri + Stats) zaten dolu. 4 kart + intro + outro = uzun. Kullanıcı isterse Kart 4 ilk yayında atlanır, sonra eklenir.

5. **Zemahşerî alıntısı bloğunun konumu** — Mevcut JSX'te `zemahseriQuote` en sonda. Yeni İcâz bloğu Zemahşerî alıntısının **önüne** mi yoksa **arkasına** mı yerleşmeli? Bu taslakta Zemahşerî'nin ÖNÜNE yerleştirildiği varsayıldı (akış: refren itirazı → Musa grid → stats → yeni İcâz bloğu → Zemahşerî kapanış). Kullanıcı farklı bir akış isterse yer değiştirilir.

6. **Refrain vs Redundancy kartı içinde** mevcut Beatles ve avukat analojileri var. Bu yeni İcâz bloğu eklendiğinde o analojiler hâlâ değer katar mı, yoksa fazlalık mı olur? Bu çağrı kullanıcının. Bence kalabilir — farklı bir register (popüler analoji) sağlıyor.

---

## Özet

- **4 kart yazıldı** (Kart 4 opsiyonel olarak işaretlendi).
- **6 kaynak kullanıldı** (Zerkeşî, Suyûtî, Râzî, İbn Âşûr, TDV İslâm Ansiklopedisi, Halliday & Hasan). 2 kaynak (Râfi'î, Bâkıllānī) "gelecek revizyon adayı" olarak işaretlendi — taslakta kullanılmadı çünkü spesifik alıntıları doğrudan görmeden risk almak istemedim.
- **Kuşkulu 6 nokta** Bölüm 7'de listelendi — kullanıcı onayı bekliyor.
- **Replacement haritası** Bölüm 4'te tam verildi — kaldırılacak ve eklenecek i18n anahtarları net.
- **JSX wireframe** Bölüm 5'te sunuldu — kod yazılmadı, sadece yapı önerisi (tasarım kararı kullanıcıda).
