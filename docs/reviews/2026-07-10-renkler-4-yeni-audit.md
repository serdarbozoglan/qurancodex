# QuranCodex İçerik Denetim Raporu — 4 Yeni Renk

Tarih: 2026-07-10
Denetçi: qc-content-auditor
Dosya: `next/public/kuranin-renkleri.json`
Kapsam: son 4 öğe (safak, kafur, yakut-mercan, berk)

---

## Özet

- Toplam denetlenen öğe: 4
- Kritik hata: 1 (yakut-mercan öğesinde bir referans yanlışı; öğe çekirdeğini etkiler)
- Orta düzey sorun: 2 (etimoloji zinciri detayı, iç tutarlılık — `totalMentions` sayısı)
- Minör sorun: 5 (linguistik nüans, ifade sertliği, kaba sınıflandırma seçimi)
- Yasak terim (pasaj / ritüel / pillar): **0 tespit** — temiz.
- Arapça encoding (§13.15) ihlali: **0 tespit** — standart Unicode uyumlu.
- Halisination flag (uydurma cilt/sayfa citation): **0 tespit** — atıflar müfessir + eser adı düzeyinde, sayfa numarası yok (doğru pattern).

---

## 1) safak — Şafak / Fecr

### Kabul edilenler
- **Ayet referansları doğrulandı**:
  - 89:1 → `وَالْفَجْرِ` "By the dawn" — teyit edildi (quran.com).
  - 84:16 → `فَلَآ أُقْسِمُ بِٱلشَّفَقِ` — teyit edildi. Şafak kelimesi burada.
  - 17:78 → `قُرْآنَ الْفَجْرِ` (fecr namazı) — teyit edildi.
  - 24:58 → `صَلَاةِ الْفَجْرِ` — teyit edildi.
  - 97:5 → `مَطْلَعِ الْفَجْرِ` — teyit edildi.
  - 2:187 → "beyaz iplik / siyah iplik" ve fecr — teyit edildi.
- Fecr sûresinin isim kaynağı (89:1) doğru anlatılmış.
- `keyVerseAr = وَالْفَجْرِ` — tek kelimelik Arapça oath, standart Unicode, temiz.
- `infoTr`/`infoEn`: "şafak akşam mı sabah mı, kıyamet günü mü — müfessirler arasında tartışma var" — nüans doğru işlenmiş; İbn Abbâs "sabah", Mücâhid "akşam" görüşleri klasik gelenekte gerçekten mevcuttur.
- `mentionCount` sayıları: al-fajr = 5 (89:1, 2:187, 17:78, 24:58, 97:5) — doğru sayım; ayrıca al-şafak = 1 (84:16) hapax etiketi doğru.

### Uyarılar (⚠)
- **`totalMentions: 6` iç tutarlılık** — 5 fecr + 1 şafak = 6 doğrulandı. Ancak Kur'an'da "fecr" kökünden türeyen kelimeler (yenfeciru, tefcîr vs.) toplamda daha fazla geçer (~19+). Kart, `mentionNote`'ta "Fecr türevleri (89:1, 2:187, 17:78, 24:58, 97:5) + İnşikak 84:16'daki 'şafak' — toplam 6 geçiş" diyerek scope'u dar kestiği için sayı içsel tutarlı; okuyucu "Kur'an'daki tüm fecr geçişleri 6 imiş" yanılgısına düşebilir. **Öneri**: `mentionNote`'a "renk-vakti anlamıyla" ibaresi eklensin, "kök türevleri hariç" belirtilsin.
- **Elmalılı alıntısı** — "fecrin ışığı yayılan, şafağın ışığı çekilen" ifadesi Elmalılı'nın Hak Dini Kur'an Dili tefsirinde 84:16 bahsinde bulunan bir ayrımın parafrazıdır; kelime birebir alıntı değil. Doğru bir parafraz ama JSX'te "Elmalılı bu ayrımı açıklar" ifadesi tırnak yerine dolaylı anlatım kullandığı için etik çizgide. **Öneri**: Mevcut hâli kabul edilebilir — birebir alıntı iddiası yok.
- `senâ berqihî` (Nûr 24:43) formu **berk (id: berk)** kartına ait; buraya karışmasın diye kontrol edildi — safak kartında böyle bir sızma yok.

### Kritik hata (❌)
- Yok.

---

## 2) kafur — Kâfûr

### Kabul edilenler
- **76:5 doğrulandı**: `إِنَّ الْأَبْرَارَ يَشْرَبُونَ مِن كَأْسٍ كَانَ مِزَاجُهَا كَافُورًا` — quran.com teyit etti. Kâfûr Kur'an'da yalnızca burada geçer — **hapax etiketi doğru**.
- Kâfûrun cennet içeceğinin karışımı olduğu — doğru bilgi.
- `mizâc` (karışım) vurgusu doğru; İbn Kesîr'in "cennet nimetleri isim olarak dünyevî olanlara benzer, mahiyetleri farklıdır" ilkesi tefsir geleneğinde iyi bilinen bir prensiptir (Sahâbe-i Kirâm ve İbn Abbâs'a atfedilen "leyse fi'l-cenneti mimma fi'd-dünyâ illâ el-esmâ" rivayeti üzerinden).
- Râzî'nin Mefâtîhu'l-Ğayb'da 76:5 tefsirinde kâfûrun serinlik + koku bileşimini vurguladığı — evet, Mefâtîhu'l-Ğayb'ın Sûre-i İnsân bölümü bu vurguyu içerir. Genel yönlü doğru atıf.
- Kurtubî'nin el-Câmi'de kelime kökeni tartışmasına değindiği — el-Câmi' li-Ahkâmi'l-Kur'ân'da 76:5 açıklamasında "keyfiyeti hakkında görüşler" formatı bulunur; kelime kökeni tartışması genelde el-Câmi'deki tefsir üslubuyla uyumludur. **Kaba doğruluk kabul.** (Kesin cilt/sayfa citation olmadığı için halisination flag yok — bu doğru pattern.)
- `k-f-r` (örtmek/gizlemek) kökü açıklaması doğru — kâfûr kelimesinin bu kökle bağlantısı klasik Arap lügat geleneğinde (İbn Manzûr Lisânu'l-Arab) yer alır: "sümmiye kâfûran li-enne râihatehû tağlibu ve tugatti mâ sivâhâ" mealinde açıklama vardır. **Onaylı.**

### Uyarılar (⚠)
- **Etimoloji zinciri — "Farsça / Hint kökenli" ifadesi**: Wikipedia (`Camphor` maddesi) etimolojiyi *Arapça kâfûr → Sanskrit karpūra → Malay kapur* olarak verir; Wiktionary ise "Malay kapur → belki Orta Farsça kāpūr üzerinden Arapça" der. İki gelenek de "Farsça+Sanskrit" izini destekler. Kartın "Kurtubî el-Câmi'de kelimenin Farsça / Hint kökenli bir alıntı olabileceğine de değinir" ifadesi filolojik olarak savunulabilir; ancak Kurtubî'nin **kelimenin Farsça/Hint alıntısı olduğunu** doğrudan söylediğine dair birincil metin **doğrulanmadı**. Klasik lügatlerde (Cevherî Sıhâh, İbn Manzûr) "muarrab" (dilimize alınmış yabancı kelime) etiketi geniş yer tutar ama Kurtubî'ye özel atıf minör bir spekülasyon riskidir. **Öneri**: "Kurtubî el-Câmi'de… değinir" ifadesi "Klasik Arap lügatinde kâfûrun muarrab (dilimize geçmiş yabancı kelime) olabileceği geleneği vardır — Kurtubî de bu izle Hint/Farsça köken ihtimalini anar" gibi yumuşatılabilir. Ya da atıf kaldırılıp "klasik lügat" atfına dönüştürülebilir.
- `hexColor: #DDEAF6` — kâfûr için "soğuk saydam-beyaz" sunumu makul; ancak "kâfûr → beyaz renk" özdeşleştirmesi bir **yorum tercihidir** (Kur'an rengi belirtmez). `infoTr`'de "Rengi doğrudan söylenmez ama kâfûrun bilinen görüntüsü — soğuk, saydam-beyaz — cennet içeceklerinin görsel karakterini kurar" ifadesi bu nüansı zaten belirtmiş — kabul edilebilir. Sadece `summaryTr` içindeki "Rengi doğrudan söylenmez ama..." cümlesi doğru şekilde şerhli.

### Kritik hata (❌)
- Yok.

---

## 3) yakut-mercan — Yakut & Mercân

### Kabul edilenler
- **55:58 doğrulandı**: `كَأَنَّهُنَّ الْيَاقُوتُ وَالْمَرْجَانُ` — quran.com teyit etti. Yakut (yâqût) Kur'an'da **yalnızca burada** geçer.
- `keyVerseAr` ve `keyVerseRef: "Rahman 55:58"` — doğru eşleşme.
- Rahmân sûresinin 78 ayet olduğu ve 31 kez tekrarlanan nakaratının bulunması — Wikipedia'da doğrulandı. **Onaylı.**
- Zemahşerî el-Keşşâf'ta 55:58 tefsirinde yakut berraklığı + mercân rengi vurgusu — el-Keşşâf'ın belağat odaklı üslubuyla tutarlı ve bilinen bir vurgudur. **Genel doğruluk kabul.**
- Kurtubî'nin "yakut = ten berraklığı, mercân = yanak kızıllığı" yorumu — bu yorum el-Câmi' li-Ahkâmi'l-Kur'ân'da "vech ve haddîn" (yüz ve yanak) benzetmesi olarak yer alır; huri tasvirinde ten/yanak ikilisi klasik tefsirde yaygındır. **Kaba doğruluk kabul.**

### Uyarılar (⚠)
- **Etimoloji zinciri — "Farsça-Yunanca (hyakinthos)"**: Wiktionary'ye göre yâqût *Yunanca ὑάκινθος (huákinthos) → Sogdca yaγūt → Arapça* rotasını izler. Kartın **"Farsça-Yunanca alıntı ('hyakinthos' — Yunanca sümbül taşı) olarak dolaşıma girmiş"** ifadesi "Farsça üzerinden" implication'ı taşıyor; oysa daha muhtemel intermediate **Sogdca** (Orta Farsçadan farklı, İran dilleri ailesinden ayrı Doğu-İran kolu). "Farsça-Yunanca" ifadesi klasik doğu şarkiyat literatüründe yaygın kullanılan bir kısaltmadır ama teknik olarak "İran dilleri ailesi üzerinden" veya "Sogdca üzerinden" daha doğru. **Öneri**: "İran dilleri üzerinden Yunanca (hyakinthos) kökenli alıntı" gibi yumuşatma.
- **Hyakinthos anlamı — "sümbül taşı"**: Yunanca ὑάκινθος hem "hyacinth çiçeği (sümbül)" hem de kırmızı/mavi renkli mücevher (jacinth, aynı isimle bilinen değerli taş) anlamına gelir. "Sümbül taşı" ifadesi Türkçe filoloji geleneğinde (özellikle Osmanlı sözlük geleneğinde "yakut" için) kullanılır ama modern okuyucu için biraz muğlak. **Öneri**: "Yunanca sümbül-adlı taş (yakut)" gibi netleştirme.

### Kritik hata (❌)

- **`allRefs: ["Rahman 55:22", "Rahman 55:58"]` içinde 55:22'nin yer alması — yakut/mercân çifti için YANLIŞ REFERANS.**

  55:22'nin gerçek Arapçası `يَخْرُجُ مِنْهُمَا اللُّؤْلُؤُ وَالْمَرْجَانُ` — burada geçen çift **inci (lu'lu') + mercân**tır, **yakut değil**. quran.com ve corpus.quran.com word-by-word doğrulandı: 55:22'de dört kelime var: yakhruju, minhumā, l-lu'lu-u, wal-marjānu. Yakut (yâqût) kelimesi 55:22'de **YOKTUR**.

  Bu hata, kartın çekirdek iddiasını (yakut ve mercân yalnızca Rahmân'da ve daima çift olarak) doğrudan etkiler. Kart **iki ayrı çifti** karıştırıyor:
  - **inci + mercân çifti** → 55:22 (natural sign)
  - **yakut + mercân çifti** → 55:58 (huri simile)

  `mercân` gerçekten iki kez geçer (55:22 + 55:58) ama 55:22'deki eşi **inci**dir. `arabicTerms` içindeki `el-mercân`'ın `mentionCount: 2, primaryRef: Rahman 55:22` bilgisi mercân için doğru; ancak öğe başlığı "Yakut & Mercân" olduğu için tüm `allRefs`'in yakut-mercân çiftini yansıtması gerekir.

  **Sonuçta bozulan iddialar:**
  1. `summaryTr`: "Yakut ve mercân Kur'an'da yalnızca Rahman sûresinde ve **daima çift olarak** geçer. 55:22'de iki denizden çıkan mücevherlerdir" — YANLIŞ. 55:22'deki çift inci-mercândır; yakut orada yok. "Yakut ve mercân daima çift" iddiası da yalnızca 55:58 tek geçişte doğrulanabilir.
  2. `summaryEn`: aynı hata İngilizcede de var.
  3. `mentionNote`: "Rahman 55:22 ve 55:58'de yakut+mercan çifti" — YANLIŞ. 55:22'de yakut yok.
  4. `totalMentions: 3` — yâqût 1 kez (55:58) + mercân 2 kez (55:22 + 55:58) = 3 doğrulanır; ama bu sayının çift bütünlüğünü temsil etmediği açıklığa kavuşturulmalı.

  **Öneri düzeltmeler:**
  - Öğe adı korunabilir ("Yakut & Mercân") ama içerik yeniden düzenlenmeli:
    - `allRefs`: `["Rahman 55:22 (inci ve mercân)", "Rahman 55:58 (yakut ve mercân)"]` biçiminde etiketlensin.
    - `summaryTr` yeni sürüm (öneri): "Yakut Kur'an'da yalnızca bir kez geçer — Rahmân 55:58'de cennet hurileri 'yakut ve mercân gibidir' benzetmesinde. Mercân ise iki kez: 55:22'de doğal ayet olarak inci ile çift halinde iki denizden çıkar; 55:58'de yakut ile çift halinde cennet imgesine dönüşür. Aynı sûre içinde mercân iki farklı eşle iki farklı temaya bağlanır: doğa-tanıklık ve cennet-tasavvur."
    - `summaryEn` de paralel düzeltme.
    - `mentionNote`: "Mercân 55:22'de inci ile, 55:58'de yakut ile çift; yakut yalnızca 55:58'de." biçiminde net edilsin.
    - `arabicTerms`'e opsiyonel olarak `اللُّؤْلُؤ` (lu'lu') üçüncü terim eklenebilir, veya inci çifti dışarıda tutulup summary'de sadece imalı bırakılabilir.

---

## 4) berk — Berk / Şimşek

### Kabul edilenler
- **Ayet referansları doğrulandı**:
  - 2:19 → `وَبَرْقٌ` (yağmur bulutu içinde şimşek) — teyit edildi.
  - 2:20 → şimşek gözleri kapmak üzere → yürüme/durma temsili — teyit edildi.
  - 13:12 → şimşek + `خوفا وطمعا` (korku ve umut) — teyit edildi.
  - 30:24 → şimşek + `خوفا وطمعا` — teyit edildi.
  - 24:43 → `سَنَا بَرْقِهِ` (şimşeğinin parıltısı) — teyit edildi.
- `keyVerseRef: "Bakara 2:20"` ve `keyVerseAr` uyumlu — kartın metni "yürürler / dururlar" ayetinin doğrudan alıntısı.
- Elmalılı Hak Dini'nin Nûr 24:43 tefsirinde bulut katmanlaşması → şimşek ilişkisini modern meteorolojiye ima olarak okuduğu doğrudur; Elmalılı gerçekten "bu ayette buluttaki iç sıkışmadan şimşeğin çıkışı" yönünde bir yorum sunar. **Onaylı.**
- **En önemli ve övgüye değer** — `infoTr`: "Berkin bir 'renk' olarak sınıflandırılması yorumdur — Kur'an onu doğrudan bir renk kelimesi olarak kullanmaz." **ve** `linguisticNoteTr` sonundaki "bu okuma bir yorum, kesin bir eşleşme değildir" nüansı — bunlar tam olarak yorum-vs-Kur'an ayrımını koruyan doğru yaklaşım. Modern meteoroloji imasına kart-içi disclaimer eklenmiş: **7. denetim maddesi (halisination flag) tam karşılanmış.**
- Ra'd 13:12'deki "havfen ve tamaan" (korku ve umut) ikilisinin şimşeğin çift yönlü psikolojik etkisi olarak Râzî ve Kurtubî tarafından vurgulandığı doğru; Râzî Mefâtîhu'l-Ğayb'da Ra'd sûresi tefsirinde bunu açıkça açar (yağmur → tama' / yıldırım → havf).
- `b-r-q` kökü ve türevleri (`ibrîq`, `abraq`) doğrulandı — klasik Arap lügatinde bu köke bağlı türevler bilinen kabuldür.

### Uyarılar (⚠)
- **`mentionCount` sayımı** — el-berq `mentionCount: 4` verilmiş; primaryRef Ra'd 13:12. Kur'an'da `berq` kökü (baraqa, barq, buraq türevleri hariç sadece "şimşek" anlamında `barq`) 5 ayette geçer (2:19, 2:20, 13:12, 24:43, 30:24). Kart 5 ayrı ayet gösteriyor ama `el-berq mentionCount: 4` + `senâ berqihî: 1` = 5 toplam — matematik doğru; 2:19-20 aynı ayet olarak sayılmış ya da senâ ayrı sayılmış; ancak `allRefs`'te 5 ayet var. **İç tutarlılık**: `arabicTerms`'in `mentionCount` toplamı (4+1=5) ile `totalMentions: 5` uyuşuyor. Kabul.
- **"Berk bir renk değil, ışık-imgesidir; ama tesirinden ötürü renkler listesine giren bir 'ani parlaklık' kategorisidir"** — bu ifade zaten şeffaf bir editorial disclaimer; iyi. Ancak renk listesinde olması bir grid-decision tercihi olduğu için, öğenin `context: "doga, kiyamet"` etiketi yerine `context: "doga, kiyamet, ışık-imge"` gibi bir yan-context eklenebilir. **Öneri**: minör; opsiyonel.
- `hexColor: #7DD3FC` (parlak açık mavi) — şimşeğin gerçek rengi mavimsi-beyaz olduğu için renk seçimi makul. Ancak "berk" için görsel-standart olmadığı için subjektif bir seçim; kart bunu iddia olarak sunmuyor, sadece hexColor değer olarak veriyor. Kabul edilebilir.

### Kritik hata (❌)
- Yok.

---

## 5) Diğer Bulgular

### Yasak terim taraması
- `pasaj`: 0 tespit ✅
- `ritüel`: 0 tespit ✅
- `pillar`: 0 tespit ✅ (İngilizce "pillar" da yok)

### §13.15 Arapça encoding kontrolü
Dosya baştan sona tarandı — 4 yeni öğedeki Arapça metinler:
- `الْفَجْر`, `الشَّفَق`, `وَالْفَجْرِ`
- `كَافُور`, `إِنَّ الْأَبْرَارَ يَشْرَبُونَ مِن كَأْسٍ كَانَ مِزَاجُهَا كَافُورًا`
- `الْيَاقُوت`, `الْمَرْجَان`, `كَأَنَّهُنَّ الْيَاقُوتُ وَالْمَرْجَانُ`
- `الْبَرْق`, `سَنَا بَرْقِهِ`, `يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ...`

Hepsi standart Arabic Unicode (U+0621–U+064A) + standart hareke (U+064B–U+0652). U+06EA (Uthmani subscript kasra), U+0671 (alef wasla), U+06CC (Farsi yeh), waqf işaretleri (ۖ ۗ ۘ ۙ ۚ ۛ ۜ), ayet sonu işaretleri (۝ ۞) — **hiçbiri yok.** ✅

### Halisination denetimi (cilt/sayfa citation)
Klasik tefsir atıfları hep **müfessir + eser adı** düzeyinde: "Râzî, Mefâtîhu'l-Ğayb", "Kurtubî, el-Câmi'", "Zemahşerî, el-Keşşâf", "İbn Kesîr", "Elmalılı Hak Dini". **Hiçbir yerde cilt/sayfa numarası uydurulmamış** — halisination pattern'ı ekarte edildi. Bu doğru yaklaşım.

### Genel meal-kalite kontrolü
- 89:1: "Andolsun tan yerine (fecre)" — Diyanet mealine yakın (Diyanet: "Tan yerine andolsun"). Kabul.
- 76:5: "Şüphesiz iyiler, karışımı kâfûr olan bir kadehten içerler." — Diyanet mealine yakın (Diyanet 76:5: "Şüphesiz iyiler, karışımı kâfûr olan içecekten içerler."). Kabul.
- 55:58: "Onlar sanki yakut ve mercân gibidir." — Diyanet mealine yakın. Kabul.
- 2:20: "Şimşek neredeyse gözlerini kapıp götürecek. Onları her aydınlatınca içinde yürürler, karanlık üzerlerine çökünce dururlar." — Diyanet mealine yakın. Kabul.

Meal karşılıkları uydurma değil; klasik/Diyanet çizgisine oturuyor. ✅

---

## 6) Öncelikli Aksiyon Listesi

1. **KRİTİK — yakut-mercan öğesi düzeltilmeli** (Bölüm 3 → Kritik hata). 55:22'nin "yakut+mercân" çifti olmadığı, "inci+mercân" olduğu netleştirilmeli. `summaryTr/En`, `mentionNote`, `allRefs` etiketlemesi güncellenmeli. Bu düzeltmeden önce commit'in atılması **önerilmez** — kartın çekirdek iddiası şu haliyle yanlış.

2. **ORTA — yakut etimolojisi** (Bölüm 3 → Uyarı). "Farsça-Yunanca" ifadesi "İran dilleri üzerinden Yunanca (hyakinthos)" veya "Sogdca üzerinden Yunanca" biçiminde düzeltilebilir. Zorunlu değil, akademik netlik için önerilir.

3. **ORTA — kâfûr etimolojisi** (Bölüm 2 → Uyarı). Kurtubî'ye özel atıf ("Farsça/Hint kökenli alıntı olabileceğine değinir") birincil kaynaktan doğrulanamadı. "Klasik Arap lügatinde muarrab (yabancı alıntı) tartışması" biçimine yumuşatılabilir.

4. **MİNÖR — safak mentionNote scope netliği** (Bölüm 1 → Uyarı). "renk-vakti anlamıyla, kök türevleri hariç" ibaresi eklenebilir.

5. **MİNÖR — berk sınıflandırma etiketi** (Bölüm 4 → Uyarı). Renkler listesinde olması editorial tercih; disclaimer zaten mevcut, ek işaretleme opsiyonel.

---

## 7) Genel Değerlendirme

**4 yeni renk öğesinden 3'ü (safak, kafur, berk)** içerik kalitesi açısından yayına hazır — nüans notları doğru yerleştirilmiş, ayet referansları doğrulandı, yasak terim yok, halisination pattern'ı ekarte edilmiş, §13.15 encoding uyumu tam. Özellikle **berk** kartındaki modern-meteoroloji imasının açıkça "bir yorum, kesin bir eşleşme değildir" disclaimer'ıyla verilmesi ve **kafur** kartındaki İbn Kesîr'in "cennet nimetleri isim benzerliğine rağmen mahiyetçe farklıdır" prensibinin doğru işlenmesi övgüye değer.

**1 kart (yakut-mercan)** kritik bir referans hatasıyla malûl: 55:22'nin yakut+mercân değil, inci+mercân çifti içerdiği gerçeği kart iddiasının çekirdeğini bozuyor. Bu düzeltme yapılmadan commit edilmemeli; çünkü kart "yakut ve mercân daima çift olarak geçer" iddiasıyla açıkça yanlış bir Kur'ânî ilişki kuruyor. Düzeltme mekanik: 55:22'yi ya "mercânın diğer geçişi (inci ile)" olarak yeniden çerçevele, ya da sadece 55:58'e odaklanan bir "yakut" öğesi ve mercânı yalnızca huri benzetmesi bağlamında sun.

Sonuç: **3/4 yayına hazır, 1/4 düzeltilmeli.**
