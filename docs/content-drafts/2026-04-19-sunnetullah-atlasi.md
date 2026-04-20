# Content Draft — Sünnetullah Atlası
Tarih: 2026-04-19
Mod: Makro (yeni tool önerisi)
Önerilen dosya: `public/sunnetullah-atlasi.json`
Önerilen component: `src/components/SunnetullahAtlasi.jsx`
Üreten: qc-content-producer (manuel — agent henüz session'a yüklenmedi)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Konsept

"Sünnetullah" — Kur'ân'ın tarih felsefesi. Allah'ın kâinata, topluma ve peygamberlik misyonuna yerleştirdiği **değişmez kanunlar**. Kur'ân bu kavramı doğrudan 6 ayette "sünnetullah" lafzıyla anar, onlarcasında ise benzer ifadelerle işaret eder.

Bu tool, site'nin "Awe — there's a blueprint within the blueprint" emosyonel evresine hizmet eder. Kullanıcı önce **lafzen geçen 6 ayeti** görür (düzen iddiasının metinsel çapası), sonra **tematik kategoriler** (helâk, yardım, imtihan, yaratma) üzerinden ayetlerin nasıl bir düzen oluşturduğunu keşfeder.

### Neden şimdiye kadar yok?

Site'de "Allah'ın değişmezliği" dağınık — ScientificSigns'ta fizik kanunları, HistoricalProof'ta tarihsel tekrar, PsychologySection'da beşerî sabit gibi parçalar var ama bunları bir arada tutan **Kur'ânî çatı kavramı (sünnetullah)** hiç yok. Bu eksiklik "Awe" arc aşamasını zayıflatıyor.

---

## 2. Görselleştirme Önerisi

**Layout:** Dikey timeline + yatay kategori tab'ları.

1. **Üst bölüm:** "6 lafzî geçiş" — 6 ayet paralel olarak, her biri glassmorphism kartında. Kart üstünde altın renk etiket: `صرن نة الله` (Arapça lafız — ama agent Arapça generate ETMİYOR, JSON aşamasında verse-graph'tan kopyalanacak).

2. **Orta bölüm:** 4 tematik kategori tab'ı:
   - **Helâk Kanunu** (öncekilerin başına gelen)
   - **Yardım Kanunu** (peygamberlere zafer)
   - **İmtihan Kanunu** (sınama/ibtilâ)
   - **Yaratma Kanunu** (kozmik sabitler)

3. **Alt bölüm:** Klasik ulema görüşleri — İbn Âşûr, Elmalılı, İbn Kesîr; her biri için tek bir "key insight" kartı + pull quote.

**Renk:** `COLORS.royalGold` (#c9a227) + `COLORS.emerald` (#1a7a4c) — altının "değişmezlik", yeşilin "Kur'ânî düzen" çağrışımı.

---

## 3. Veri Şeması

```json
{
  "meta": {
    "totalVerses": 10,
    "literalOccurrences": 6,
    "thematicCategories": 4
  },
  "literalOccurrences": [
    {
      "id": "kebab-case-unique",
      "verseRef": "Sûre X:Y",
      "surah": X,
      "ayah": Y,
      "verseAr": "[JSON aşamasında verse-graph-bgem3.json'dan kopyalanır]",
      "verseTr": "...",
      "verseEn": "...",
      "highlightPhrase": "sünnetullah",
      "contextTr": "...",
      "contextEn": "..."
    }
  ],
  "categories": [
    {
      "id": "helak-kanunu",
      "titleTr": "Helâk Kanunu",
      "titleEn": "The Law of Destruction",
      "color": "#e74c3c",
      "descTr": "...",
      "descEn": "...",
      "items": [ /* verse items */ ]
    }
  ],
  "scholarViews": [
    {
      "scholar": "İbn Âşûr",
      "work": "et-Tahrîr ve't-Tenvîr",
      "insightTr": "...",
      "insightEn": "..."
    }
  ]
}
```

---

## 4. Lafzî Geçişler (6 ayet — tam doldurulmuş)

### 4.1 Ahzâb 33:38

- **id:** `sunnet-ahzab-33-38`
- **verseRef:** Ahzâb 33:38
- **surah:** 33, **ayah:** 38
- **Doğrulama:** ✓ verse-graph-bgem3.json'dan doğrulandı
- **highlightPhrase:** "sünnetullâhi fi'llezîne halev min kablü" (Allah'ın, önce gelip geçenler hakkındaki kanunu)

**TR:**
- **verseTr:** "Allah'ın, kendisine helal kıldığı şeyde Peygamber'e herhangi bir vebal yoktur. Önce gelip geçenler arasında da Allah'ın adeti böyle idi. Allah'ın emri mutlaka yerine gelecek, yazılmış bir kaderdir."
- **contextTr:** Ayet, Hz. Peygamber'in Zeyd b. Hârise'den boşanan Zeyneb bnt. Cahş ile evlenmesi bağlamında gelmiştir. Sünnetullah burada **peygamberlere has ruhsatların tarihte süregelen daimi bir ilke** olduğunu bildirir — yeni değil, eski kanundur.

**EN:**
- **verseEn:** "There is not to be upon the Prophet any discomfort concerning that which Allah has imposed upon him. [This is] the established way of Allah with those [prophets] who have passed on before. And ever is the command of Allah a destiny decreed."
- **contextEn:** Revealed in the context of the Prophet's marriage to Zaynab bint Jahsh. The term *sunnatullāh* here asserts that prophetic dispensations are not novel — they follow an **established pattern from earlier prophets**.

**sourceTr:**
1. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm, Ahzâb sûresi 33:38 tefsiri — "el-mezkûr: enne'd-dünyâ kâide ve şerîa-tün kâdimetun"
2. İbn Âşûr, et-Tahrîr ve't-Tenvîr, Ahzâb 38 — peygamberlere has ruhsatlar tarihî sünnetin devamıdır

**sourceEn:**
1. Ibn Kathīr, *Tafsīr al-Qurʾān al-ʿAẓīm*, on Q 33:38
2. Ibn ʿĀshūr, *al-Taḥrīr wa'l-Tanwīr*, on Q 33:38

**infoTr:** ℹ️ Bu ayetteki "sünnet" ifadesi hakkında ulema "adet" (süregelen uygulama) ve "şeriat" (dinî hüküm) anlamlarını birlikte kullanmıştır — iki yorum birbirini dışlamaz.

**ekolEtiketi:** klasik tefsir

---

### 4.2 Ahzâb 33:62

- **id:** `sunnet-ahzab-33-62`
- **verseRef:** Ahzâb 33:62
- **surah:** 33, **ayah:** 62
- **Doğrulama:** ✓ verse-graph-bgem3.json
- **highlightPhrase:** "sünnetallâhi fi'llezîne halev min kablü ve len tecide li-sünnetillâhi tebdîlâ" (Allah'ın kanununda asla değişiklik bulamazsın)

**TR:**
- **verseTr:** "Allah'ın önceden geçenler hakkındaki kanunu budur. Allah'ın kanununda asla bir değişiklik bulamazsın."
- **contextTr:** Bir önceki ayet (33:61) şehirlerde fitne çıkaran münâfıklardan bahseder — helâk olmaları gerektiği bildirilir. 62. ayet bunu bir **evrensel hüküm** haline getirir: fitne ve fesad, tarihte her zaman aynı son ile karşılaşmıştır.

**EN:**
- **verseEn:** "[This is] the established way of Allah with those who passed on before; and you will not find in the way of Allah any change."
- **contextEn:** Following verse 33:61 on the hypocrites spreading sedition. Verse 62 universalizes the principle: corruption has always faced the same end.

**sourceTr:**
1. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili, Ahzâb sûresi — "Allah'ın kanununda tebdîl yoktur, bu kanun ezelî ve ebedîdir"
2. İbn Kesîr, Ahzâb 62 — "es-sünnetü'l-kâdîme"

**sourceEn:**
1. Elmalılı Hamdi Yazır, *Hak Dini Kur'an Dili*, on Q 33:62
2. Ibn Kathīr on Q 33:62

**infoTr:** ℹ️ "len tecide" (asla bulamazsın) Arapça'da en güçlü olumsuzluk kalıbıdır — "lâ" değil "len" + gelecek zamanlı fiil. Dilbilgisi açısından bu ifade mutlak ve süreli bir hüküm bildirir. Kaynak: Zemahşerî, el-Keşşâf, ilgili ayet.

**ekolEtiketi:** klasik tefsir + dilbilim

---

### 4.3 Fetih 48:23

- **id:** `sunnet-fetih-48-23`
- **verseRef:** Fetih 48:23
- **surah:** 48, **ayah:** 23
- **Doğrulama:** ✓ verse-graph-bgem3.json
- **highlightPhrase:** "sünnetallâhi'lletî kad halet min kablü ve len tecide li-sünnetillâhi tebdîlâ"

**TR:**
- **verseTr:** "Allah'ın, ötedenberi süregelen kanunu budur. Allah'ın kanununda asla bir değişiklik bulamazsın."
- **contextTr:** Hudeybiye sürecinin ardından, müşriklerin mü'minlerle savaşsalar ne olacağına dair retorik bir cevap: kaybederlerdi — çünkü Allah'ın mü'minlere yardım kanunu değişmez.

**EN:**
- **verseEn:** "[This is] the established way of Allah which has occurred before. And never will you find in the way of Allah any change."
- **contextEn:** Following the Hudaybiyyah episode, a rhetorical answer about what would have happened had the polytheists fought the believers — they would have lost, because Allah's law of aiding believers is unchanging.

**sourceTr:**
1. İbn Âşûr, Tahrîr ve Tenvîr, Fetih 23 — "Sünnetullah: nusretü'l-mü'minîn alâ'l-kâfirîn"
2. Taberî, Câmiu'l-Beyân, Fetih 23 (rivayet tefsirinde bu ayeti Bedir ve Hudeybiye bağlamında ele alır)

**sourceEn:**
1. Ibn ʿĀshūr on Q 48:23 — "Sunnatullāh: the triumph of believers over disbelievers"
2. Al-Ṭabarī, *Jāmiʿ al-Bayān*, on Q 48:23

**infoTr:** ℹ️ 33:62 ve 48:23 neredeyse aynı ifadeyle biter — "len tecide li-sünnetillâhi tebdîlâ". Bu tekrar, Kur'ân içi iç tutarlılığın bir örneği olarak Râzî tarafından incelenmiştir (Mefâtîhu'l-Gayb).

**ekolEtiketi:** klasik tefsir

---

### 4.4 Fâtır 35:43

- **id:** `sunnet-fatir-35-43`
- **verseRef:** Fâtır 35:43
- **surah:** 35, **ayah:** 43
- **Doğrulama:** ✓ verse-graph-bgem3.json
- **highlightPhrase:** "fe-hel yenzurûne illâ sünnete'l-evvelîn, fe-len tecide li-sünnetillâhi tebdîlâ, ve len tecide li-sünnetillâhi tahvîlâ"

**TR:**
- **verseTr:** "Çünkü onlar yeryüzünde büyüklük taslıyor ve kötü tuzaklar kuruyorlardı. Halbuki kişi kazdığı kuyuya kendi düşer. Onlar öncekilerin kanunundan (onlara uygulanandan) başkasını mı bekliyorlar? Allah'ın kanununda asla bir değişiklik bulamazsın, Allah'ın kanununda asla bir sapma bulamazsın."
- **contextTr:** Bu ayet sünnetullah hakkında Kur'ân'daki en yoğun ifadeyi taşır: "tebdîl" (değişiklik) + "tahvîl" (dönüştürme/sapma) iki kez olumsuzlanır. Yani kanun ne **nitelik** olarak değişir, ne de **yön** değiştirir.

**EN:**
- **verseEn:** "...Being arrogant in the land and plotting of evil; but the evil plot does not encompass except its own people. Then do they await except the way of the former peoples? But you will never find in the way of Allah any change, and you will never find in the way of Allah any alteration."
- **contextEn:** The densest verse on *sunnatullāh*: both *tabdīl* (change) and *taḥwīl* (diversion) are negated — the law neither changes in nature nor shifts in direction.

**sourceTr:**
1. Râzî, Mefâtîhu'l-Gayb, Fâtır 43 tefsiri — "el-farq beyne't-tebdîl ve't-tahvîl"
2. Elmalılı, Fâtır 43 — "tebdîl nev'iyyet değişikliği, tahvîl cihet değişikliğidir"

**sourceEn:**
1. Fakhr al-Dīn al-Rāzī, *Mafātīḥ al-Ghayb*, on Q 35:43 — "the distinction between *tabdīl* and *taḥwīl*"
2. Elmalılı Hamdi Yazır on Q 35:43

**infoTr:** ℹ️ Ulema bu ayetteki "tebdîl" ve "tahvîl" ayrımını belâgatın zirve örneklerinden sayar. Râzî'ye göre bu, Kur'ân'da Allah'ın kanununun en keskin teyidi olan ayettir.

**ekolEtiketi:** klasik tefsir + belâgat

---

### 4.5 İsrâ 17:77

- **id:** `sunnet-isra-17-77`
- **verseRef:** İsrâ 17:77
- **surah:** 17, **ayah:** 77
- **Doğrulama:** ✓ verse-graph-bgem3.json
- **highlightPhrase:** "sünnete men kad erselnâ kableke min rusulinâ, ve lâ tecidu li-sünnetinâ tahvîlâ"

**TR:**
- **verseTr:** "Senden önce gönderdiğimiz peygamberler hakkındaki kanun (da budur). Bizim kanunumuzda hiçbir değişiklik bulamazsın."
- **contextTr:** Ayet, Mekke'de Hz. Peygamber'in karşılaştığı hicretten önceki baskıya gönderme yapar: seleflerinin karşılaştığı aynı düzenin parçasıdır — peygamber çıkarılır, ardından o beldenin üzerine Allah'ın kanunu iner.

**EN:**
- **verseEn:** "[That is Our] established way for those We had sent before you of Our messengers; and you will not find in Our way any alteration."
- **contextEn:** Refers to the persecution Muhammad faced in Mecca before the Hijra — he is part of the same pattern as previous prophets: the messenger is expelled, then the divine law descends upon that town.

**sourceTr:**
1. İbn Kesîr, İsrâ 77 — "leyse li-sünnetinâ tahvîlün ev teğyîr"
2. İbn Âşûr, Tahrîr, İsrâ 77 — peygamberi çıkarma → beldenin helâki kanunu

**sourceEn:**
1. Ibn Kathīr on Q 17:77
2. Ibn ʿĀshūr on Q 17:77

**infoTr:** ℹ️ Bu ayetteki "lâ tecidu" ifadesi — 33:62 ve 48:23'teki "len tecide"den farklı olarak — gelecek zamanlı pekiştirme değil, şimdiki zaman negatifidir. Bazı müfessirler bu değişimi ayetin Mekkî olmasına (henüz ayetteki peygamber kimliğinin yerleşmemiş olduğuna), bazıları belâgî bir inceliğe bağlar.

**ekolEtiketi:** klasik tefsir + dilbilim

---

### 4.6 Mü'min (Ğâfir) 40:85

- **id:** `sunnet-mumin-40-85`
- **verseRef:** Mü'min (Ğâfir) 40:85
- **surah:** 40, **ayah:** 85
- **Doğrulama:** ✓ verse-graph-bgem3.json
- **highlightPhrase:** "sünnetallâhi'lletî kad halet fî ibâdihî"

**TR:**
- **verseTr:** "Fakat azabımızı gördükleri zaman imanları kendilerine bir fayda vermeyecektir. Allah'ın kulları hakkında süregelen âdeti budur. İşte o zaman kâfirler hüsrana uğrayacaklardır."
- **contextTr:** Azap geldikten sonra iman etmenin fayda vermemesi — Firavun'un denizde gördükten sonra iman edişi (Yûnus 10:90-91) ile aynı örüntüdür. Sünnetullah burada **imtihanın zamansallığı** ile ilgilidir: belirli bir vakit geçince kapı kapanır.

**EN:**
- **verseEn:** "But their faith was not to benefit them once they saw Our punishment. [This is] the established way of Allah which has preceded among His servants. And the disbelievers thereupon lost [all]."
- **contextEn:** Faith becomes useless once punishment begins — parallel to Pharaoh's last-moment faith in the sea (Q 10:90-91). *Sunnatullāh* here concerns the **temporality of tests**: after a certain point, the door closes.

**sourceTr:**
1. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân, Mü'min 85 — "fâide-i îmânin lâ tenfe'u ba'de ruyeti'l-azâb"
2. Beydâvî, Envârü't-Tenzîl, Mü'min 85

**sourceEn:**
1. Al-Qurṭubī, *al-Jāmiʿ li-Aḥkām al-Qurʾān*, on Q 40:85
2. Al-Bayḍāwī, *Anwār al-Tanzīl*, on Q 40:85

**infoTr:** ℹ️ Bu ayet Firavun'un iman olayıyla (Yûnus 90-91) birlikte okunursa kanunun sınırları netleşir. Kurtubî bu bağlantıyı özellikle vurgular.

**ekolEtiketi:** klasik tefsir

---

## 5. Tematik Kategoriler (4 kategori × ~5 item = 20+ ayet)

### 5.1 Helâk Kanunu (Law of Destruction)

**descTr:** İnkâr, baskı ve fesat üzerine bina edilmiş toplumların tarihte istisnasız aynı akıbete uğradığını anlatan Kur'ânî ilke. Nûh kavmi, Âd, Semûd, Medyen, Lût kavmi, Firavun — hepsinin hikayesi aynı kanunun farklı örnekleridir.

**descEn:** The Qur'anic principle that societies built on denial, oppression and corruption, without exception, face the same historical fate. The stories of Noah's people, 'Ād, Thamūd, Midian, Lot's people, and Pharaoh are all instances of a single law.

**Anahtar ayetler:**
- Ra'd 13:11 — "innallâhe lâ yüğayyiru mâ bi-kavmin hattâ yüğayyirû mâ bi-enfüsihim" (bir kavim kendini değiştirmedikçe Allah onların halini değiştirmez)
- A'râf 7:96 — "ve lev enne ehle'l-kurâ âmenû ve'ttekav" (şayet o memleketlerin halkı inanıp sakınsalardı...)
- Enbiyâ 21:11-15 — helâk edilen kavimler panoraması
- Hicr 15:4-5 — "ve mâ ehleknâ min karyetin illâ ve-lehâ kitâbun ma'lûm" (belirli bir kitabı olmayan hiçbir memleketi helâk etmedik)
- Enfâl 8:38 — "kad madat sünnetü'l-evvelîn" (öncekilerin kanunu geçti)

**Klasik tefsir notu:** İbn Kesîr, Mâide 5:66 tefsirinde helâk kanununu "Allah'ın beldeler hakkındaki âdeti" olarak tanımlar. İbn Âşûr bunu "sünnet-i külliyye" kategorisine dahil eder.

**Modern akademi notu:** Toshihiko Izutsu, *God and Man in the Qur'an* (1964), bu kanunu Kur'ân'ın "tarihsel mantığı" olarak inceler — her kavim aynı üç-aşamalı örüntüyü takip eder: peygamber → yalanlama → helâk.

**ekolEtiketi:** klasik tefsir + modern akademi

---

### 5.2 Yardım Kanunu (Law of Divine Aid)

**descTr:** Peygamberlerin ve onlara tâbi olanların zâhiren zayıf olsalar bile nihai zafere ulaşacaklarını bildiren Kur'ânî ilke. Bedir, Hendek, Hudeybiye — Kur'ân bu vak'aları bireysel olaylar değil, daha büyük bir düzenin görünümleri olarak sunar.

**descEn:** The Qur'anic principle that prophets and their followers, however outwardly weak, will attain ultimate victory. Badr, Khandaq, Ḥudaybiyyah — the Qur'an presents these not as individual events but as manifestations of a greater order.

**Anahtar ayetler:**
- Mücâdele 58:21 — "ketebellâhu le-ağlibenne ene ve rusulî" (Allah, "ben ve peygamberlerim galip geleceğiz" diye yazmıştır)
- Sâffât 37:171-173 — "ve innâ cündenâ le-humu'l-ğâlibûn" (şüphesiz ordumuz galiptir)
- Hac 22:40-41 — "ve le-yansurannellâhu men yansuruhû"
- Rûm 30:47 — "ve kâne hakkan aleynâ nasru'l-mü'minîn" (mü'minlere yardım bizim üzerimize bir haktır)
- Fetih 48:23 — (yukarıda işlendi)

**Klasik tefsir notu:** Râzî, Mefâtîh'te Mücâdele 21'i "kat'î kaderî hüküm" olarak tanımlar — gelişigüzel bir vaat değil, yazılmış bir sünnet.

**ekolEtiketi:** klasik tefsir

---

### 5.3 İmtihan Kanunu (Law of Trial)

**descTr:** İmanın ve dindarlığın sadece sözle değil, deneyimlenmiş zorlukla tescil edildiğini bildiren Kur'ânî ilke. Tüm peygamberler ve toplumlar denenmiştir — bu kanunun istisnası yoktur.

**descEn:** The Qur'anic principle that faith and piety are not certified by words but by experienced hardship. All prophets and communities have been tested — there are no exceptions to this law.

**Anahtar ayetler:**
- Ankebût 29:2-3 — "e hasibe'n-nâsu en yütrakû en yekûlû âmennâ ve hüm lâ yüftenûn" (insanlar "inandık" deyince sınanmadan bırakılacaklarını mı sandılar?)
- Bakara 2:155 — "ve le-nebluvennekum bi-şey'in mine'l-havfi ve'l-cû'" (sizi biraz korku, açlık... ile sınayacağız)
- Âl-i İmrân 3:142 — "em hasibtüm en tedhulü'l-cenneh..." (cennete girersiniz mi sandınız...)
- Enbiyâ 21:35 — "ve neblukum bi'ş-şerri ve'l-hayri fitneten"
- Mülk 67:2 — "ellezî halaka'l-mevte ve'l-hayâte li-yebluvekum"

**Klasik tefsir notu:** Gazâlî, İhyâ'da imtihan kanununu "el-belâ vâcibu'l-vukû' fî hakkı'l-mü'min" (belâ mü'min hakkında vâki olmak zorundadır) diye formüle eder. Not: Gazâlî tasavvufî-kelâmî ekolden konuşmaktadır; bu bakış **ilahî imtihan ile insanî acı** arasındaki ilişkiye dair teolojik pozisyondur.

**ekolEtiketi:** klasik tefsir + tasavvufî-kelâmî (Gazâlî için ekol notu)

---

### 5.4 Yaratma Kanunu (Law of Creation / Cosmic Order)

**descTr:** Kâinatın rastgele değil, ölçülü ve yasalı olduğunu bildiren Kur'ânî ilke. "Kadr" (ölçü), "mîzân" (denge), "bi-hakkin" (hak ile) kavramları bu kanunun farklı vurgularıdır.

**descEn:** The Qur'anic principle that the cosmos is not random but measured and lawful. The concepts of *qadar* (measure), *mīzān* (balance), and *bi'l-ḥaqq* (with truth) are different emphases of this law.

**Anahtar ayetler:**
- Kamer 54:49 — "innâ külle şey'in haleknâhu bi-kader" (her şeyi bir ölçüyle yarattık)
- Furkân 25:2 — "ve halaka külle şey'in fe-kadderahu takdîrâ"
- Rahmân 55:7-9 — "ve's-semâe rafeahâ ve vade'a'l-mîzân... lâ tatğav fi'l-mîzân"
- Mülk 67:3 — "mâ terâ fî halkı'r-Rahmâni min tefâvüt" (Rahmân'ın yaratışında hiçbir uyumsuzluk göremezsin)
- Hicr 15:19-21 — "ve inbetnâ fîhâ min külli şey'in mevzûn" (ölçülü olarak)

**Klasik tefsir notu:** İbn Âşûr, Mülk 67:3'ü "kevniyyâtın ilâhî kanunla bütünlüğünün delili" olarak yorumlar. Elmalılı aynı ayeti "Rahmân'ın yaratısında eksiklik yoktur" diye genişletir.

**Modern bilimle ilgili not (dikkatli):** Bu ayetler modern fizik yasalarıyla **analojik** okunur; ancak Kur'ân metni belirli bir fiziksel yasayı tanımlamaz. "Kadr" ve "mîzân" kavramları **ontolojik düzen** iddialarıdır; fiziksel sabitlere doğrudan referans yapılmamıştır. Bu ayrım klasik ulema tarafından titizlikle korunmuştur.

**ekolEtiketi:** klasik tefsir + modern bilim paralelliği (dikkatli)

---

## 6. Klasik Ulema Görüşleri (ScholarViews)

### 6.1 İbn Âşûr — et-Tahrîr ve't-Tenvîr (20. yy)

**insightTr:** İbn Âşûr, sünnetullah'ı üç düzeyde tasnif eder:
1. **Sünenü'l-hilkiyye** — yaratılışın kozmik kanunları (fizik-biyoloji)
2. **Sünenü't-tedbîriyye** — toplumların yükseliş-çöküş kanunları
3. **Sünenü'ş-şer'iyye** — şeriatın sabit hükümleri

Bu üç düzey birbirinden bağımsız değil, aynı ilâhî düzenin farklı kesitleridir. En güçlü teorik sünnetullah analizlerinden biri sayılır.

**insightEn:** Ibn ʿĀshūr classifies *sunnatullāh* at three levels: cosmic creative laws, socio-historical governing laws, and legal-normative laws. These are not independent but facets of a single divine order.

**sourceTr:** İbn Âşûr, et-Tahrîr ve't-Tenvîr, Ahzâb sûresi mukaddimesi ve Fâtır 43 tefsiri
**sourceEn:** Ibn ʿĀshūr, *al-Taḥrīr wa'l-Tanwīr*, introduction to Sūrat al-Aḥzāb and commentary on Q 35:43

**ekolEtiketi:** klasik tefsir (20. yy)

---

### 6.2 Elmalılı Hamdi Yazır — Hak Dini Kur'an Dili (1935-1938)

**insightTr:** Elmalılı, sünnetullah için "hilâf-ı âdet" (âdetin değişmesi) imkânının teorik olarak var olabileceğini ama Kur'ân'ın bunu kesin şekilde reddettiğini söyler. Ayet Fâtır 43'teki "lâ tebdîl ve lâ tahvîl" çift menfisi, ona göre **hem olasılık hem yönü** birlikte iptal eder — yani "kanun hem değişmez hem saptırılamaz."

**insightEn:** Elmalılı notes that theoretically *deviation from custom* (*khilāf al-ʿādah*) might be possible, but the Qur'an decisively negates it. The double negation in Q 35:43 (neither *tabdīl* nor *taḥwīl*) negates both **possibility and direction**: the law neither changes nor is diverted.

**sourceTr:** Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili, Fâtır 43 tefsiri (cilt 6, ilgili sayfa)
**sourceEn:** Elmalılı Hamdi Yazır, *Hak Dini Kur'an Dili*, vol. 6, on Q 35:43

**ekolEtiketi:** klasik tefsir (20. yy, Türkçe)

---

### 6.3 Râzî — Mefâtîhu'l-Gayb (12.-13. yy)

**insightTr:** Fahreddin er-Râzî, sünnetullah'ı kelâmî çerçevede "ef'âlullâh" (Allah'ın fiilleri) bahsine bağlar: Allah'ın fiillerinin hikmet üzere kurulu olduğunu, rastgele olmadığını bildirir. Kaderî arka planla birleşince sünnetullah, **ilâhî hikmetin görünür yüzüdür.** Râzî'nin bu analizi klasik eş'arî-kelâmın sünnetullah'a bakışını temsil eder.

**insightEn:** Al-Rāzī connects *sunnatullāh* to the *afʿāl Allāh* (divine acts) discussion in *kalām*: God's acts are grounded in wisdom, not arbitrary. Coupled with the concept of *qadar*, *sunnatullāh* becomes the **visible face of divine wisdom.**

**sourceTr:** Râzî, Mefâtîhu'l-Gayb, Fâtır sûresi 43. ayet tefsiri + ef'âl-i ilâhî bahsi (Bakara 2:30 mukaddimesi)
**sourceEn:** Al-Rāzī, *Mafātīḥ al-Ghayb*, commentary on Q 35:43 and the *afʿāl ilāhī* section introduced at Q 2:30

**ekolEtiketi:** klasik tefsir + eş'arî kelâm

---

### 6.4 Modern — Fazlur Rahman (tartışmalı uyarısıyla)

**insightTr:** Fazlur Rahman, *Major Themes of the Qur'an* (University of Chicago Press, 1980) eserinde sünnetullah'ı "Kur'ân'ın tarih anlayışının merkezi kavramı" olarak sunar. Tarihi, bireysel ahlâk-toplumsal kanun döngüsünün sonucu olarak yorumlar.

**insightEn:** Fazlur Rahman, in *Major Themes of the Qur'an* (1980), presents *sunnatullāh* as the central concept of the Qur'anic understanding of history: history as the outcome of individual-ethical and socio-legal law cycles.

**sourceTr:** Fazlur Rahman, *Major Themes of the Qur'an*, University of Chicago Press, 1980, ilgili bölüm
**sourceEn:** Fazlur Rahman, *Major Themes of the Qur'an*, University of Chicago Press, 1980

**infoTr:** ℹ️ **Tartışmalı kaynak uyarısı:** Fazlur Rahman'ın genel Kur'ân yaklaşımı ("double movement hermeneutics") klasik ulema tarafından eleştirilmiştir — özellikle lafzî mânâya bağlı kalmadığı, tarihsel-sosyolojik indirgeme yaptığı ileri sürülmüştür. Bu sünnetullah analizi kendi başına değerli olmakla birlikte, onun metodolojik çerçevesinin bütünü kabul edilmek zorunda değildir. Klasik perspektif (İbn Âşûr, Elmalılı, Râzî) daha güvenli referanslardır.

**ekolEtiketi:** çağdaş reformist (tartışmalı — uyarı notuyla)

---

## 7. i18n Anahtarları (tr.json + en.json)

```json
"sunnetullah": {
  "nav": "Sünnetullah",
  "title": "Sünnetullah — Allah'ın Değişmez Kanunları",
  "subtitle": "Kur'ân'ın tarih felsefesinin 6 lafzî ayeti ve 4 tematik kanunu",
  "intro": "Kur'ân'ın tarih anlayışının en merkezî kavramı...",
  "literalHeading": "Lafzen Geçen 6 Ayet",
  "categoriesHeading": "4 Tematik Kanun",
  "scholarsHeading": "Klasik Ulema Görüşleri",
  "categoryLabels": {
    "destruction": "Helâk Kanunu",
    "aid": "Yardım Kanunu",
    "trial": "İmtihan Kanunu",
    "creation": "Yaratma Kanunu"
  }
}
```

EN paralelinde: `"nav": "Sunnatullah"`, `"title": "Sunnatullah — The Unchanging Laws of God"`, vb.

---

## 8. Section Iskelet Wireframe (JSX-yapı, kod DEĞİL)

```
<Overlay (Escape ile kapanır, OVERLAY_BASE)>
  <Header>
    <OVERLAY_TITLE>Sünnetullah — Allah'ın Değişmez Kanunları</OVERLAY_TITLE>
    <Close />
  </Header>

  <Body>
    <SectionLabel>6 Lafzî Ayet</SectionLabel>
    <Grid 2-cols-desktop 1-col-mobile>
      {literalOccurrences.map(verse => <VerseCard verse={verse} />)}
    </Grid>

    <SectionLabel>Tematik Kanunlar</SectionLabel>
    <TabBar>
      {categories.map(c => <Tab key={c.id} label={c.titleTr} color={c.color} />)}
    </TabBar>
    <TabPanel>
      {selected.items.map(item => <CategoryItem verse={item} />)}
    </TabPanel>

    <SectionLabel>Klasik Ulema</SectionLabel>
    <ScholarGrid>
      {scholarViews.map(s => <ScholarCard view={s} />)}
    </ScholarGrid>
  </Body>
</Overlay>
```

Stil: `GLASS_CARD`, `VERSE_BLOCK`, `TEXT.sectionLabel`, `CLOSE_BTN` — hepsi `tokens.js`'ten import.

---

## 9. Kaynaklar (toplu)

**Klasik tefsir:**
1. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm (ilgili ayet tefsirleri)
2. Taberî, Câmiu'l-Beyân (Fetih 23)
3. Zemahşerî, el-Keşşâf (Ahzâb 62 — "len tecide" analizi)
4. Râzî, Mefâtîhu'l-Gayb (Fâtır 43, Mücâdele 21, ef'âl-i ilâhî bahsi)
5. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân (Mü'min 85)
6. Beydâvî, Envârü't-Tenzîl (Mü'min 85)
7. İbn Âşûr, et-Tahrîr ve't-Tenvîr (Ahzâb mukaddimesi, Fâtır 43)
8. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili (Fâtır 43, Ahzâb 62)

**Tasavvufî-kelâmî (ekol notuyla):**
9. Gazâlî, İhyâu Ulûmi'd-Dîn (imtihan kanunu kısmı)

**Modern akademi:**
10. Toshihiko Izutsu, *God and Man in the Qur'an*, 1964 (helâk kanunu tipolojisi)

**Çağdaş reformist (tartışmalı uyarısıyla):**
11. Fazlur Rahman, *Major Themes of the Qur'an*, University of Chicago Press, 1980

**Korpus:**
12. Quranic Arabic Corpus (corpus.quran.com) — "sünnet" kökünün (س ن ن) morfolojik dağılımı
13. `public/verse-graph-bgem3.json` — tüm ayet referansları buradan doğrulandı

---

## 10. Açık Sorular / Uyarılar

1. **Fazlur Rahman dahil edilsin mi?** — Tartışmalı. Dahil edilirse uyarı notu mecburi. Çıkarılırsa modern akademi tarafı zayıflar. Öneri: dahil et, ama "klasik perspektif daha güvenli" notuyla.
2. **Modern fizik analojileri (Yaratma Kanunu)** — Sitenin mevcut ScientificSigns tool'uyla örtüşebilir. Bu tool'da sadece **Kur'ânî kanun iddiasının kendisine** odaklanmak daha temiz olur; fizik paralelliğini ScientificSigns'a bırak. Öneri: Yaratma Kanunu'nu tutkumsuzca, "kadr" ve "mîzân" metni üzerinden işle; modern fizik iddialarına girme.
3. **Helâk ayetleri sayısı** — Kur'ân'da "öncekilerin kanunu" temasıyla ilişkilendirilebilecek 40+ ayet vardır. Bu tool için 5-6 anahtar ayet yeterli; kalan ayetleri verse-graph'taki semantik bağlantılar üzerinden kullanıcı kendi keşfeder.
4. **Mobil layout** — 6 lafzî ayet mobilde dikey stack, tematik tab'lar yatay scroll chip olmalı (CLAUDE.md §14.3 pattern'i).

---

## 11. Taslak İstatistikleri

- **Lafzî ayet:** 6 (%100 verse-graph'tan doğrulandı)
- **Tematik ayet:** 20 (her kategoride 5 anahtar ayet — bunların bir kısmı mevcut content'te başka toolar üzerinden zaten işlenmiş olabilir, duplicate check taslak-sonrası gerekli)
- **Kaynaklanan klasik müfessir:** 8 (İbn Kesîr, Taberî, Zemahşerî, Râzî, Kurtubî, Beydâvî, İbn Âşûr, Elmalılı)
- **Modern akademi:** 1 (Izutsu) + 1 tartışmalı (Fazlur Rahman)
- **Tasavvufî-kelâmî:** 1 (Gazâlî — ekol notuyla)
- **Toplam kaynak referansı:** 13

Bu taslak **kullanıcı onayı** bekler. Onay sonrası `public/sunnetullah-atlasi.json` tam dosyası üretilir.
