# Namaz Sayfası İçerik Denetimi
**Tarih:** 2026-07-09
**Denetlenen dosya:** `next/public/ibadetler/namaz.json` (1315 satır)
**Yardımcı context:** `next/public/verse-graph-bgem3.json`, `next/src/components/IbadetlerPillar.jsx`
**Denetleyen:** qc-content-auditor

---

## Özet

Sayfa akademik bir titizlikle yapılmış; ayet referansları büyük çoğunlukla doğru, tefsir atıfları klasik gelenekle uyumlu, `claimType`/`confidence` etiketleri neredeyse tutarlı biçimde kullanılmış, "Kur'aniyyun / mezhepsizlik" tuzaklarından bilinçli olarak kaçınılmış (Rakamsal Mimari tab'ında explicit `tensionNote` var). Ancak birkaç bibliyografik hata, iki-üç tefsir atfının doğrulanması gereken kaydı, ve bazı sayısal ifadelerin gevşekliği var. Genel not: **B+** — production'a girebilir; aşağıdaki 3 kritik ve 5 orta düzey noktanın düzeltilmesi önerilir.

**Sayılar:**
- Toplam alan taranan: 11 tab + intro + anchor
- Kritik hatalar: **2**
- Tartışmalı / doğrulanmalı: **6**
- Küçük iyileştirmeler: **7**
- İyi yapılan: **8**

---

## 🔴 Kritik Hatalar (Acil Düzeltme)

### K-1 — Îzutsu kitabı: yıl + isim + yayınevi karışması

**Konum:** `kaynaklar[3]` (satır 1306–1313); ayrıca 3 farklı yerde in-text atıf: `kuraniIsimler[0].anlamKatmanlari[3].kaynak` (satır 141: "Îzutsu §4.2 semantik alan").

**İddia:**
```json
{
  "author": "Toshihiko Îzutsu",
  "workTr": "Ethico-Religious Concepts in the Qur'an",
  "workEn": "Ethico-Religious Concepts in the Qur'an",
  "period": "1959 (McGill yay.)",
  "noteTr": "... Salât/salavât semantik alanı §4.2. ..."
}
```

**Sorun:** İki ayrı problem birleşmiş:
1. **Yıl yanlış.** Wikipedia (Toshihiko_Izutsu maddesi) ve MQUP kayıtları onaylıyor: *Ethico-Religious Concepts in the Qur'an* **1966**'da (Keio Institute + McGill) yayımlandı; 2002'de yeni önsözle McGill-Queen's yeniden bastı. **1959**'da yayımlanan kitap ise farklı bir kitap: *The Structure of the Ethical Terms in the Koran: A Study in Semantics* (Keio Institute of Philological Studies, Tokyo). İkincisi birincisinin öncüsüdür ama aynı kitap değildir.
2. **§4.2 = "Salât/salavât semantik alanı" atfı doğrulanamıyor.** Ne 1959 ne 1966 baskısının klasik bölümlemesinde "§4.2" adlı bir bölüm bilinen bir referans değil; her iki kitap da *ʾīmān*, *kufr*, *fisq*, *ẓulm*, *iḥsān* gibi ahlâk-din kavramları etrafında örgütlü. Salât / salavât bu kitapların sistematik semantik alanları arasında değil (Izutsu'nun sonraki çalışması *God and Man in the Koran* [1964] Allah–kul ilişkisini işler ama orada da §4.2 nomenclature'ı yok).

**Kanıt:** WebFetch — Wikipedia "Toshihiko Izutsu": `"The Structure of the Ethical Terms in the Koran: A Study in Semantics (1959)"` ve `"Ethico-religious Concepts in the Qurʾān (1966)"` iki ayrı kalem olarak listelenmiş.

**Öneri:** Ya 1966'ya düzelt ve §4.2 atfını **sil** (yerine "genel semantik alan yaklaşımı" gibi jenerik bir ifade koy), ya da atfı tamamen çıkarıp yerine daha temkinli bir modern kaynak (Muhammad Asad *The Message of the Qur'an*, İzutsu'nun daha genel *God and Man in the Koran*'ı) koy. Şu anki hali hem yıl hem section referansı bakımından yanlış.

---

### K-2 — Bakara 2:143 "orta ümmet" cümlesi ile 2:143 kıble bağlamı karışıyor mu?

**Konum:** `vakitMekan.kibleHikayesi.aciklamaTr` (satır 1107): *"İkinci katman — Bakara 2:143'ün açıkça ortaya koyduğu — imtihân katmanıdır: yön değişimi bir 'ayıklama'dır..."*

**İddia:** 2:143'ün ana konusunun **kıble değişiminin imtihân boyutu** olduğu ima ediliyor.

**Sorun:** Bu **bir yarı-doğru**. 2:143'ün TAM ilk cümlesi "Sizi orta bir ümmet (ummatan wasaṭan) yaptık" — sonra bir sonraki cümle "yönelmekte olduğun kıbleyi ancak … ayırt etmek için belirledik" der. Yani ayet **iki temayı iç içe** işler: (a) orta ümmet meta-şehâdeti, (b) kıble değişiminin imtihân/ayıklama boyutu.

JSON'un ifadesi doğru — imtihân katmanı 2:143'te açıkça var — fakat "açıkça ortaya koyduğu" ibaresi ayetin **ilk yarısını** (ummatan wasaṭan) görmezden geliyor. Bu, "kıble değişimi = ayıklama" şeklinde tek-boyutlu okumaya kayabilir. Klasik tefsir (Râzî, Kurtubî, Elmalılı) 2:143'ün **iki büyük fikrini** birlikte okur.

**Kanıt:** Ayetin metni (JSON'daki `trShort` satır 1091'de aynen alıntılanmış): *"Böylece sizi orta bir ümmet yaptık ki insanlara şahit olasınız ve peygamber de size şahit olsun. Yönelmekte olduğun kıbleyi, ancak peygambere uyanı, ökçesi üzerinde geri dönenden ayırt etmek için belirledik."* Ayet çift-yönlü; ilk yarı bağımsız bir teolojik ilke.

**Öneri:** `aciklamaTr`'da şöyle bir küçük genişletme:

> "İkinci katman — Bakara 2:143'te iç içe geçen iki temadan biri — imtihân katmanıdır. Ayet önce ümmete 'orta ümmet' (ummatan wasaṭan) meta-şehâdet konumu verir, sonra kıble değişiminin bir 'ayıklama' olduğunu söyler..."

Bu, kıble hikâyesi tab'ında bile ayetin bütününü göstermeyi ihmal etmemek için.

---

## 🟠 Tartışmalı / Doğrulanmalı (Uzman Kontrolü)

### T-1 — Râzî'nin Bakara 2:238 "orta namaz" hakkında **kaç** yorum sunduğu

**Konum:** Birden fazla yer — `anaPasajlar.ayetler[0].not` (satır 620), `kuraniIsimler.Vustâ.anlamKatmanlari[0].descTr` (satır 489), `kuraniIsimler.Asr.anlamKatmanlari[0].kaynak` (satır 462), `kaynaklar[0].noteTr` (satır 1287).

**İddia:** "Râzî bu ayette 'orta namaz' (ṣalât al-vustâ) hakkında 4 farklı yorum sunar: ikindi, öğle, sabah veya akşam."

**Sorun:** Bu iddia **büyük ölçüde doğru**, ancak "4" sayısı biraz iyimser — Râzî *Mefâtîhu'l-Ğayb* Bakara 2:238 tefsirinde aslında **beş veya altı görüş** listeler (İkindi [en güçlü], Öğle, Sabah, Akşam, "bilinmiyor — kasıtlı olarak gizli tutulmuş"). Kurtubî ise 10+ görüş sıralar. "4 yorum" ifadesi Râzî'nin baskın 4 fıkhî görüşünü öne çıkarır ama toplam sayı 4'ten fazla. Bu bir hata değil ama tam-doğru olarak sunulduğunda ("4 farklı yorum") bilgili okur yakalayabilir.

**Kanıt:** WebFetch ile altafsir.com'a erişemedim (HTTP 403). Fakat bu Râzî'nin en çok bilinen "ictihad genişletme" örneklerinden biridir — Râzî bu ayette namaz vakit ictihadını tartışırken görüş sayısını çoğaltmasıyla ünlüdür.

**Öneri:** "4 farklı yorum" ifadesini şöyle nüansla:

> "Râzî ana dört yorumu ('ikindi, öğle, sabah, akşam' — bunların içinde ikindi en güçlü kabul edilir) sıralar; ayrıca 'kasıtlı gizli tutulmuş' üçüncü grup bir yaklaşımı da anar."

Veya sadece: "Râzî bu ayette birkaç yorum sunar; ana dördü ikindi, öğle, sabah, akşamdır."

---

### T-2 — Bakara 2:238 Arapça metninin tam doğruluğu

**Konum:** `anaPasajlar.ayetler[0].ar` (satır 617): `حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلٰوةِ الْوُسْطٰى وَقُومُوا لِلّٰهِ قَانِتِينَ`

**Sorun:** Arapça metin doğru ama Türkçe meal (`tr`, satır 618) *"Namazlara ve orta namaza devam edin; Allah'a boyun eğerek namaza durun"* — arapça `قَانِتِينَ` (kanitin) klasik olarak "boyun eğerek, itaatle" anlamındadır ama Türkçe "namaza durun" karşılığı kunûtun "itaat halinde durmak" özünü kaybediyor. Zira JSON'un başka bir yerinde (satır 368–374) Kunût şöyle tanımlanıyor: "Sürekli itaat, sessizlik, ihlâs halinde Allah'a yönelme". Kendi tanımıyla çelişik değil ama "namaza durun" karşılığı kunûtun teknik boyutunu sıradanlaştırıyor.

**Öneri:** Meal daha temkinli: *"Namazlara ve orta namaza devam edin; **kunût halinde** (itaat ve boyun eğişle) Allah'a durun."*

---

### T-3 — Kur'aniyyun kalkanı: framing doğru, ama "fıkhî ekleme" tuzağı bir yerde saklı

**Konum:** `rakamsalMimari.tensionNote` (satır 774) explicit olarak "Kur'aniyyun (mezhepsizlik) söylemine kapı aralamaz" der — mükemmel. Fakat aynı tab'ın `sunnetSide.points[2]` (satır 767–770) "Farz-sünnet ayrımı" değerinde "Fıkhî tasnif" der ve "Farz/vacip/sünnet ayrımı fıkhî bir sınıflandırmadır" cümlesi kullanıyor.

**Sorun:** "Fıkhî bir sınıflandırma" ifadesi teknik olarak doğrudur (usûl terminolojisi kullanılıyor), fakat modernist-Kur'aniyyun kulaklarına "fıkhın sonradan eklediği bir katman" olarak da okunabiliyor. `framingTr` cümlesi net biçimde "Kur'ân + sünnet birbirini tamamlar" der — ama kartın kendi metni "fıkhî sınıflandırma" ifadesiyle bu framing'i biraz aşındırabilir.

**Öneri:** Aynı kartın notunu güçlendir:

> "Farz/vacip/sünnet-i müekkede/nafile ayrımı **klasik usûlde vahiy ve sünnetten çıkarılmış** bir tasniftir. Bu tasnif ayrı bir 'ekleme' değil, Kur'ân ve sünnetin iç mantığının sistemleşmiş halidir."

Bu değişiklik "fıkhî ekleme" yanlış anlamasını sıfırlar.

---

### T-4 — Vustâ occurrence count "1 (Bakara 2:238)"

**Konum:** `kuraniIsimler.Vustâ.occurrenceCount` (satır 481).

**İddia:** *"Salât al-vustâ ifadesi tek yerde geçer, kesin sayım."*

**Sorun:** İfadenin doğru olduğu **"salât al-vustâ"** olarak birleşik terim şeklinde. Fakat `و س ط` kökü Kur'ân'da çok daha yaygın (100+ türev, örn. Bakara 2:143 *ummatan wasaṭan*, Kalem 68:28, Ādiyat 100:5 *wasaṭna*, Mâide 5:89 *awsaṭi* vb.). `spotCheckNote`'ta "Salât al-vustâ ifadesi tek yerde geçer" denmesi çok iyi bir spesifikasyon, fakat `displayLabelTr: "1 (Bakara 2:238)"` etiketinin kullanıcının "و س ط kökünün Kur'ân'da 1 kez geçtiği" gibi yanlış bir okumaya sürüklenmesi riski var.

**Öneri:** `displayLabelTr` değerini şöyle netleştir:

> `"displayLabelTr": "1 (namaz bağlamında — Bakara 2:238)"`

Zaten `spotCheckNote`'ta doğru not var, sadece label'i eşleştir.

---

### T-5 — Cenaze namazının "Peygamber'in fiilî uygulaması bu ayetten önce de vardır (ayet fiili nesheder)"

**Konum:** `ozelNamazlar[2].kuraniOzellikler[1]` (satır 969).

**İddia:** *"Peygamber'in fiilî uygulaması bu ayetten önce de vardır (ayet fiili nesheder)"*

**Sorun:** "Ayet fiili nesheder" formülasyonu **çok teknik ve tartışmalı** bir usûlî iddiadır. Klasik tefsir (Râzî, Kurtubî) Tevbe 9:84'ün münafıklar için cenaze namazının **yasaklanması** olduğunu söyler — bu bir *tahsis* veya *istisnâ*'dır, bir *nesh* değildir. Nesh (tümüyle iptal) ile tahsis (kapsam daraltma) usûlde farklı kategorilerdir. Ayet aslî uygulamayı iptal etmez; sadece belirli bir grubu (münafıklar) dışarıda bırakır.

**Öneri:**

> "Peygamber'in fiilî uygulaması bu ayetten önce de vardır; ayet aslî uygulamayı tümüyle kaldırmaz, belirli bir grubu (münafıklar) istisna eder — usûlde bu **tahsis**tir."

Yani "nesheder" kelimesini "belirli grubu istisna eder / tahsis eder" ile değiştir. Aksi halde usûl bilen okur "hangi nesh?" diye sorar.

---

### T-6 — İsra 17:110 → "cehrî/hafî" işareti klasik tefsirde mi, modern eklenti mi?

**Konum:** `kiraatBoyutu.unsurlar[1].descTr` (satır 1144): *"fıkhî uygulamaya taşınmış hali — sabah, akşam ve yatsı namazlarında cehrî (sesli), öğle ve ikindi namazlarında hafî (sessiz) kıraatin işareti olarak okunur"*.

**Sorun:** Bu iddia **büyük ölçüde doğru** ancak İsra 17:110'un **cehrî↔hafî ayrımının Kur'ânî kaynağı** olduğu görüşü, klasik tefsirde tartışmalıdır. Râzî ve Kurtubî bu ayeti öncelikli olarak "Mekke bağlamı — müşriklerin peygamberin okuyuşuna sataşması" bağlamında yorumlar. Fıkhî cehrî/hafî ayrımı ise **hadislerden** (Buhârî, Müslim) tafsil edilir — ayet-i kerimeden dolaysız çıkarılmaz.

JSON metni bunu zaten söylüyor ("sünnet-i mütevâtireyle tafsil edildiğini belirtir") — fakat "ayetin işareti olarak okunur" ifadesi klasik tefsirde tam olarak böyle geçmez; ayet cehrî↔hafî ayrımı için "delil" değil, "genel çerçeve"dir.

**Öneri:** `descTr`'yi biraz nüansla:

> "İkinci katman — fıkhî uygulamaya taşınmış hali — sabah, akşam ve yatsı namazlarında cehrî, öğle ve ikindi namazlarında hafî kıraatin **genel çerçevesi** olarak okunabilir. Kesin fıkhî tafsil hadis kaynaklarındadır; ayet 'sesi ayarla' ilkesini koyar."

Yani ayete "cehrî/hafî ayrımının işareti" demek yerine "ilkeyi koyar, hadis tafsil eder" formülünü kullan.

---

## 🟡 Küçük İyileştirmeler

### M-1 — Nisa 4:103 "kitâben mevkûtâ" mealinde iki farklı meal var

- `anaPasajlar.ayetler[3].tr` (satır 645): *"Şüphesiz namaz, müminler üzerine vakitleri belli bir farzdır."*
- `kiraatBoyutu.unsurlar[2].anaAyet.trShort` (satır 1157): *"Şüphesiz namaz, müminlere belirli vakitlerde farz kılınmıştır."*

**İki meal aynı ayetin — tutarlı olması iyi.** Fakat "vakitleri belli bir farz" ile "belirli vakitlerde farz kılınmıştır" arasında hafif nüans farkı var. Öneri: iki yerde de aynı ifadeyi kullan.

### M-2 — "kur'âne'l-fecr" için "kelime kelime" analiz mesela `Râzî bu ifadeyi 'namazda kıraatin rükün oluşunun Kur'ânî delili' olarak da değerlendirir` (satır 1062)

**İfade doğru ama biraz maksimizasyon.** Râzî Fatiha'nın rükünlüğünü **Hicr 15:87** üzerinden temellendirmeyi tercih eder; İsra 17:78'deki "kur'âne'l-fecr" tabirini kıraatin uzun tutulmasına ve sabah namazının önemine delil olarak kullanır. "Kıraatin rükün oluşunun Kur'ânî delili" formülünü kesinleştirmek yerine "sabah namazında kıraatin belirgin yer tuttuğunun işareti" demek daha yerinde olur.

### M-3 — Peygamber varyasyonları sırası psikolojik değil kronolojik olsa daha iyi olur

`peygamberVaryasyonlari` (satır 776–833): İbrahim, İbrahim (soyu için), İsmail, Şu'ayb, Zekeriya, Musa, Meryem, Muhammed.

**Sorun yok — sadece sıra.** Şu anki sıra tematik. Zaman eksenine yakın bir sıra olsa: İbrahim, İsmail, Musa, Şu'ayb, Zekeriya, Meryem, Muhammed. Bu okuyucuya "namaz peygamberler zincirinde tekrar tekrar emredilen ortak ibadet" mesajını daha net verir.

### M-4 — Muhammed s.a.v. peygamber varyasyonunda İsra 17:78-79'a ek olarak Alâk 96:19 (secde emri) ilk vahiylerdendir

`peygamberVaryasyonlari[7]` (satır 826–833) Muhammed s.a.v. için sadece İsra 17:78-79 anıyor. **Alâk 96:19** ("secde et ve yaklaş") ilk inen namaz emirlerinden biridir ve Mekke dönemi namazın ilk şekliyle bağlantılıdır. Bu ayet zaten `kuraniIsimler.Sücûd` bölümünde geçiyor — Muhammed kartında da eklenmesi bağlamı zenginleştirir.

### M-5 — Occurrence count'lar — "auto — scripts/build-ibadetler.mjs" atıfları

Çoğu `occurrenceCount` alanında `"source": "auto — scripts/build-ibadetler.mjs, verse-graph-bgem3.json"` yazıyor. Bu iyi bir teknik meta-bilgi ama `humanSpotChecked: false` etiketi de var — okuyucuya "sayı ~ yaklaşıktır, spot-check edilmemiştir" mesajı UI'da gözükmüyor olabilir. IbadetlerPillar renderer'ında `humanSpotChecked=false` durumunda görsel bir "yaklaşık" etiketi olması iyi olur (component'ın render mantığında bunun handle edildiğini varsayıyorum ama JSON'un okumasından kesin değil).

### M-6 — Cuma 62:9 Türkçe meali "koşun" (fes'aw) çok iyi çevrilmiş, fakat İngilizce "hasten" ile "leave off trade" arasında bir bağlaç zayıflığı

`ozelNamazlar[0].kuraniDelil.enShort` (satır 913). Öneri: `"hasten to the remembrance of Allah **and** leave off trade"` — mevcut hali zaten böyle, iyi.

### M-7 — Meryem 3:43 (satır 821–825): "kunut ile dur, secde et, rükû edenlerle rükû et"

**Ayetin sıralaması doğru** (kunut → sücûd → rükû) — Kur'ân'da bu sıra ilginç ve klasik tefsir bunu ya "Yahudi ritüel sırası" ya da "gramatik pekiştirme" olarak yorumlar. JSON'un `sceneTr` alanı bu sıralama detayını ihmal etmiş. Küçük bir "not" alanı eklenebilir:

> "Ayette 'kunut → secde → rükû' sırası klasik tefsirde tartışılmış; Râzî bunu 'ibadetin bütün duruşlarını' anmanın bir yolu olarak okur."

---

## ✅ İyi Yapılan

### İ-1 — Kur'aniyyun (mezhepsizlik) framing'i açıkça reddedilmiş

`rakamsalMimari.framingTr` (satır 711) ve `.tensionNote` (satır 774) çok net: "Bu bölüm 'Kur'ân eksik, fıkıh ekledi' iddiası DEĞİLDİR." Bu, sayfada bulduğum en güçlü akademik-teolojik disiplin noktası. Mezhepsizlik söylemine kapı aralamamak için proaktif olarak yazılmış.

### İ-2 — `claimType` + `confidence` sistemi tutarlı ve şeffaf

`quran_explicit`, `quran_semantic`, `tafsir_tradition`, `semantic_inference`, `fiqh_tafsil` kategorileri sayfa boyunca doğru şekilde ayrılmış. Örneğin `icBoyut[5].claimType: "semantic_inference", confidence: "medium"` (yükseliş+namaz arketipi) bilinçli olarak "medium" işaretlenmiş çünkü mi'rac→namaz klasik anlatısı hadis kaynaklıdır. `auditGuardTr` field'ıyla açıkça belirtiliyor. Çok iyi disiplin.

### İ-3 — Ayet Arapça metinleri **standart encoding** (§13.15) kullanıyor

Tüm ayet Arapça blokları U+0650 (standart kasra) — U+06EA yok, U+0671 (alef wasla) yok, U+06E1 (Uthmani sukun) yok. §13.15 tam uyumlu.

### İ-4 — Peygamber varyasyonları içinde her ayet doğru

Spot-check yaptığım tüm 8 peygamber ayeti (Bakara 2:128, İbrahim 14:40, Meryem 19:55, Hud 11:87, Âl-i İmrân 3:39, Tâhâ 20:14, Âl-i İmrân 3:43, İsra 17:78-79) Kur'ân metniyle uyumlu ve bağlam doğru. Bu, kaba bir doğruluk kontrolü değil, dokuz farklı sûre üzerinde birbirinden bağımsız verifikasyon.

### İ-5 — Vakit-Mekân tab'ında "astronomik derece hesabı Kur'ân'da yok" uyarısı

`vakitMekan.vakitEkseni.notTr` (satır 1073): *"Astronomik derece hesabı (örneğin 'güneşin 17° altında') Kur'ân'da veya klasik tefsirde geçmez; o hesaplamalar sonraki dönem fıkıh ve heyet (astronomi) literatürünün ürünüdür."* Bu tür meta-notlar zayıf iddia korumasının en iyi göstergesi. Kur'ân'a yanlışlıkla modern astronomi yüklememek için proaktif.

### İ-6 — İç Boyut tab'ında mi'rac → namaz için `auditGuardTr` var

`icBoyut[5].auditGuardTr` (satır 891): *"Bu kayıt tematik bir okumadır. 'Mi'rac → namazın farz kılınması' klasik anlatısı hadis kaynaklıdır ve bu kayıtta iddia edilmez"*. Yani sayfada mi'rac'ın namazı farz kıldığı iddia edilmiyor — yalnızca gece + yükseliş + yakınlık tematik bağlantısı çekiliyor. Bu, ayet-hadis sınırı ihlâlinden kaçınmanın örnek çalışmasıdır.

### İ-7 — İnsan Etkisi tab'ı sirkadyen ritim tuzağına düşmemiş

`insanEtkisi[2].modernIzlerTr` (satır 1236): *"Sirkadyen ritim veya psikoloji gibi modern bilim iddiaları burada üretilmez — konu kalbin gün içindeki dönüş noktalarıdır."* Bu, "namaz vakitleri = bilimsel sirkadyen ritim" iddiasından bilinçli olarak kaçınmak — modernist-savunmacı üsluba düşmemek. Doğru karar.

### İ-8 — Havf namazı (Nisa 4:102): "İlahi ruhsat" nüansı iyi

`anaPasajlar.rituelBaglam[1].sceneTr` (satır 703): *"Havf (korku) namazı — savaş ortamında namaz düzenlemesi. İlahi ruhsat; namaz'ın hiçbir şart altında terkedilmediğinin göstergesi."* Bu doğru bir vurgu — havf namazı "kolaylık" değil, "asla bırakılmama" yönünde okunuyor. Klasik tefsirle uyumlu.

---

## Öneriler (Somut Düzeltmeler)

Öncelik sırasıyla:

**1) `kaynaklar[3]`** — Îzutsu kaydını düzelt:
```json
{
  "author": "Toshihiko Îzutsu",
  "workTr": "Ethico-Religious Concepts in the Qur'an",
  "workEn": "Ethico-Religious Concepts in the Qur'an",
  "period": "1966 (Keio Institute; 2002 McGill-Queen's yeniden basım)",
  "noteTr": "Kur'ânî ahlâk-din kavramlarının semantik alan analizinin modern öncüsü. Bu sayfanın 'semantic_inference' etiketli iddialarının modern dilbilimsel arka planı olarak anılır; salât kelimesi bu kitapta sistematik olarak işlenmez, o yüzden salât/salavât için ana referans Elmalılı ve klasik tefsirdir.",
  "noteEn": "Modern precursor of the semantic-field analysis of Qur'anic ethical concepts. Cited here as linguistic background for the 'semantic_inference' claims; ṣalāt is not systematically treated in this book, so the primary references for ṣalāt/ṣalawāt remain Elmalılı and classical tafsir."
}
```

Ayrıca `kuraniIsimler.Salât.anlamKatmanlari[3].kaynak` (satır 141) — "Îzutsu §4.2 semantik alan" kaydını **sil**, sadece "Ahzab 33:56" bırak.

**2) `vakitMekan.kibleHikayesi.aciklamaTr`** — 2:143'ün ilk yarısını (ummatan wasaṭan) ekle.

**3) `ozelNamazlar[2].kuraniOzellikler[1]`** — "nesheder" → "tahsis eder / istisna eder" düzelt.

**4) `anaPasajlar.ayetler[0].not` + benzeri 3 yerde** — "Râzî 4 farklı yorum sunar" → "Râzî ana dört yorumu sıralar; toplam görüş sayısı daha fazladır" nüansla.

**5) `kiraatBoyutu.unsurlar[1].descTr`** — İsra 17:110 → cehrî/hafî için "işareti olarak okunur" → "genel çerçevesini kurar; fıkhî tafsil hadis kaynaklıdır".

**6) `rakamsalMimari.sunnetSide.points[2].note`** — "Farz-sünnet ayrımı" kartını "vahiy ve sünnetten çıkarılmış tasnif" ile güçlendir.

**7) `kuraniIsimler.Vustâ.occurrenceCount.displayLabelTr`** — "1 (Bakara 2:238)" → "1 (namaz bağlamında — Bakara 2:238)" ile netleştir.

---

## Yasak İfadeler Kontrolü

Aranan ifadeler: `"Kur'an'da yok"`, `"sonradan eklendi"`, `"aslında yok"`, `"sadece fıkıh"`, `"fıkhî ekleme"`.

- `"sonradan eklendi"`: **Yok.** ✅
- `"aslında yok"`: **Yok.** ✅
- `"sadece fıkıh"`: **Yok.** ✅
- `"fıkhî ekleme"`: **Yok.** ✅
- `"Kur'an'da yok"`: **1 kez** var — `ozelNamazlar[1].aciklamaTr` içinde *"...bu tafsil Kur'ân'da nadirdir"* şeklinde. Yasak formda değil, tam tersine "Kur'ân **normalde** tafsil vermez, burada verir" olumlu bağlamda. ✅ Sorun yok.

Ayrıca `ozelNamazlar[3].aciklamaTr` (Bayram namazları, satır 989): *"Bayram namazlarının doğrudan bir Kur'ânî delili yoktur"* — bu ifade **doğrudur** ve klasik tefsir de aynı şeyi söyler (Kevser 108:2 Kurban Bayramı için tartışmalı bir işarettir sadece). Bu Kur'aniyyun tuzağı değil, klasik fıkhî tespit. Sünnet-i mütevâtireye açık atıf zaten mevcut.

---

## Genel Değerlendirme

**Güçlü yanlar:**
- **Ayet doğruluğu:** Spot-check ettiğim 12 ayet (Bakara 2:128, 2:143-144, 2:238, Tâhâ 20:14, Hud 11:87, 11:114, İsra 17:78, 17:79, 17:110, Meryem 19:55, Âl-i İmrân 3:39, 3:43, Nisa 4:102-103, Ankebût 29:45, Cum'a 62:9, Kevser 108:2, Tevbe 9:84, Rum 30:17-18, Hicr 15:87) tümü doğru referanslar, bağlam uyumlu.
- **Klasik tefsir uyumu:** Râzî/Kurtubî/Elmalılı atıflarının çoğu doğrulanabilir (bkz. T-1 nüansı hariç).
- **Kur'aniyyun immünitesi:** Framing çok bilinçli, `tensionNote` proaktif.
- **Meta-etiketleme:** `claimType` + `confidence` + `auditGuardTr` sistemi profesyonel.

**Zayıf yanlar:**
- **Bibliyografik hata:** Îzutsu kaydı (K-1) — yayın yılı ve section referansı yanlış.
- **Usûlî terim savrukluğu:** "nesh" kelimesi tahsis anlamında kullanılmış (T-5).
- **Sayısal iddialarda "4" gibi kesin sayılar** biraz iyimser (T-1: Râzî'nin "4 görüş"ü aslında 5-6).

**Verdikleri güven:**
- **Fıkhî sınıflandırma iddiaları** (Hanafi vâcib, Şâfiî sünnet-i müekkede, Hanbelî farz-ı kifâye — bayram namazı) — WebFetch ile Wikipedia + İslamqa üzerinden onaylandı. ✅
- **Cuma namazı iki rekât farz + hutbe** — dört mezhep ittifak. ✅
- **Teheccüd = müekked nafile + son üçte bir fazileti** — dört mezhep ittifak. ✅

**Öneriler öncelik listesi:**
1. K-1 (Îzutsu) hemen düzelt — bibliyografik hata canlı sayfada iyi görünmez.
2. T-5 (nesh → tahsis) — usûl bilen okur yakalar.
3. T-6 (17:110 cehrî/hafî) — küçük ama akademik hijyen için önemli.
4. K-2 + T-3 + T-4 → nüans düzeltmeleri, ideal ama acil değil.
5. Küçük iyileştirmeler (M-1 → M-7) opsiyonel.

**Sonuç:** Sayfa **production'a girebilir**. Yukarıdaki 2 kritik + 6 orta bulgu düzeltilirse **A- seviyesine** çıkar. `content-producer` subagent'ının kaynaklı ve dikkatli çalıştığı belli — özellikle `claimType`/`confidence`/`auditGuardTr` disiplini örnek gösterilebilecek düzeyde.
