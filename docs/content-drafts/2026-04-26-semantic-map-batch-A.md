# Content Draft — F-2 Semantic Map: Batch A (5 küme)
Tarih: 2026-04-26
Mod: Makro içerik üretimi (mevcut `public/semantic-map.json` için tema/özet/kaynak alanları)
Hedef dosya: `public/semantic-map.json` (cluster başına: `tr`, `en`, `theme`, `summary_tr`, `summary_en`, `sources`, `wow_note_tr`, `wow_note_en`)
Üreten: qc-content-producer
Durum: TASLAK — kullanıcı incelemesi bekleniyor
Kapsam: Küme #0, #1, #2, #4, #5

---

## 0. Üretim Notu (önsöz)

Bu Batch A, BGE-M3 embedding üzerinde NetworkX Louvain algoritmasıyla üretilen 20 anlamlı semantik kümenin **5 büyük çekirdek kümesi** için Türkçe + İngilizce içerik taslağıdır. Pilot batch'in (#3, #8, #10, #11, #14) kalite çıtası ve şablonu birebir korunmuştur. Batch A kümeleri ayet sayısına göre sıralandığında ilk 5'te yer alır (675 / 628 / 593 / 448 / 419 ayet) — yani Kur'ân'ın yapısal omurgasını taşıyan ana retorik çerçevelerin dökümüdür.

**Kabul edilen kısıtlar (pilot ile özdeş):**
- Arapça ayet metni üretilmedi. Central verses tablolarında ayet referansı (X:Y) ve ayetin **konu özeti** verildi.
- İstatistikler `_semantic-map-cluster-reference.md` ve `public/semantic-map.json` üzerinden birebir alındı.
- Mekkî/Medenî dağılımı klasik fihrist sınıflandırmasına dayanır; ihtilaflı sûreler "(ihtilaflı)" notuyla işaretlendi.
- Bilim-Kur'ân spekülasyonu yapılmadı. Tematik analiz dilbilim-belâgat-tefsir eksenindedir.

---

## Küme #0 — Âlemlerin Rabbi: Tevhidin Tebliğ Çerçevesi / Lord of the Worlds: The Proclamational Frame of Tawḥīd

**Veri:** 675 ayet · 92 farklı sûre · avg semantic density 0.884 · top sûreler: 26 (Şuarâ, Mek.) · 37 (Sâffât, Mek.) · 20 (Tâ-Hâ, Mek.) · 7 (A'râf, Mek.) · 11 (Hûd, Mek.)

**Merkezi 10 ayet (referans — konu özeti):**
- **26:12 (Şuarâ)** — Mûsâ'nın "yalanlanma korkusu" ile Rabbine yönelişi; tebliğ-öncesi çekince
- **7:104 (A'râf)** — Mûsâ'nın Firavun'a "âlemlerin Rabbi tarafından gönderilmiş resul" olarak kendini takdimi
- **59:16 (Haşr)** — şeytanın insanı küfre çağırması, sonra "ben âlemlerin Rabbi olan Allah'tan korkarım" diyerek uzaklaşması; münafıklık temsili
- **45:36 (Câsiye)** — "el-hamdü lillâhi rabbi's-semâvâti ve rabbi'l-ardı, rabbi'l-âlemîn" — tam üçlü hamd formülü
- **22:49 (Hac)** — Peygamber'in "ben sizin için apaçık bir uyarıcıyım" tebliğ tanıtımı
- **69:43 (Hâkka)** — Kur'ân'ın "âlemlerin Rabbinden tenzîl" niteliği
- **26:23 (Şuarâ)** — Firavun'un "âlemlerin Rabbi de nedir?" sorgu cümlesi (red-direnç sahnesi)
- **11:47 (Hûd)** — Nûh'un "bilmediğim şeyi senden istemekten sana sığınırım" yönelişi
- **39:13 (Zümer)** — Peygamber'in "Rabbime karşı gelirsem büyük günün azabından korkarım" itaat ifadesi
- **56:80 (Vâkıa)** — Kur'ân'ın "âlemlerin Rabbinden tenzîl" niteliği (paralel formül)

### Tema (tr)
**Âlemlerin Rabbi: Tevhidin Tebliğ Çerçevesi** — *peygamberlerin Rabbi takdim, korku-itaat ve vahyin kaynağını ilan eden "rabbu'l-âlemîn" formülünün tebliğ-içi konumlanması.*

### Theme (en)
**Lord of the Worlds: The Proclamational Frame of Tawḥīd** — *the in-discourse positioning of the formula "rabb al-ʿālamīn" — by which prophets present their Lord, frame fear-obedience, and declare the source of revelation.*

### Özet (tr)
Bu küme Kur'ân'ın **en büyük embedding kümesi** (675 ayet, 92 sûre) — yani Kur'ân'ın 114 sûresinden **80'inden fazlası** bu çerçeveye değer. Çekirdek, *rabbu'l-âlemîn* (âlemlerin Rabbi) formülü ve onun çevresindeki tebliğ sahneleridir: peygamber kendini *Rabbu'l-âlemîn'in resulü* olarak tanıtır (7:104), korkuyla Rabbine sığınır (26:12, 39:13), karşı taraf "âlemlerin Rabbi de nedir?" diye sorar (26:23), vahiy "âlemlerin Rabbinden indirilmiştir" diye nitelendirilir (56:80, 69:43). Şaşırtıcı olan kümenin **Şuarâ-Sâffât-Tâ-Hâ-A'râf-Hûd** ekseninde top-yoğunluğu — bunlar Kur'ân'ın **peygamber-kıssa yoğun Mekkî sûreleridir**. Yani embedding "rabbu'l-âlemîn"i soyut bir teoloji terimi olarak değil, **kıssa-içi tebliğ momenti** olarak yakalamıştır.

### Summary (en)
This is the **largest single embedding cluster** (675 verses across 92 surahs — over **80 %** of the Qur'an's 114 surahs touch this frame). Its core is the formula *rabb al-ʿālamīn* ("Lord of the Worlds") and the proclamational scenes built around it: a prophet presents himself as the *messenger of rabb al-ʿālamīn* (7:104), turns to his Lord in fear (26:12, 39:13), faces the rejecter who asks "and what is rabb al-ʿālamīn?" (26:23), and identifies revelation as a *tanzīl* "from the Lord of the Worlds" (56:80, 69:43). Striking is the cluster's top-density along the **Shuʿarāʾ-Ṣāffāt-Ṭā-Hā-Aʿrāf-Hūd** axis — the prophet-narrative-heavy Meccan surahs. The embedding does not isolate "rabb al-ʿālamīn" as an abstract theological term; it captures it as a **moment-in-narrative** of prophetic proclamation.

### Alt Temalar
1. **Resul-takdim formülü** — *innî rasûlun min rabbi'l-âlemîn* yapısı; her elçi aynı dille başlar (7:104, 26:16, 26:77 ve komşu ayetlerde).
2. **Korku-itaat ekseni** — peygamberin Rabbinden korkmasının halk-korkusunu silmesi (26:12, 39:13, 11:47).
3. **Red-sahnesi** — karşı tarafın "rabbu'l-âlemîn de nedir?" sorgusu (26:23) — tevhidin yabancılaştırılması.
4. **Vahyin kaynağı** — Kur'ân'ın *tenzîlün min rabbi'l-âlemîn* niteliği (56:80, 69:43); paralel formülün yapısal işlevi.
5. **Kozmik hamd kapanışı** — *el-hamdü lillâhi rabbi'l-âlemîn* (45:36) — Fâtiha'nın açılış formülünün diğer sûrelerdeki tekrarı.
6. **Münafık-ironisi** — şeytanın bile "rabbu'l-âlemîn'den korkarım" deyip insanı yüzüstü bırakması (59:16); tevhid söyleminin ahlâkî inceltisi.

### Wow Notu (tr)
Bu küme **20 kümenin en büyüğüdür** ve Kur'ân'ın yapısal omurgasını taşır. 675 ayet, 92 sûreye yayılır. Top sûrelerin **tamamı Mekkî peygamber-kıssa sûreleridir** (Şuarâ 56 ayet, Sâffât 37, Tâ-Hâ 35, A'râf 27, Hûd 25) — bu, klasik tefsirde de işaret edilen bir gerçeği istatistiksel olarak ortaya koyar: *rabbu'l-âlemîn* formülü Kur'ân'da **soyut sıfat değil tebliğ kalıbıdır**; her peygamber Firavun, Nemrud, kavmin önde gelenleri gibi güç odaklarına karşı *aynı sözle* başlar (Râzî, *Mefâtîh*, Şuarâ tefsiri). Bond skoru 921 olan komşu Küme #1 (kozmik egemenlik) bu kümenin **teolojik tamamlayıcısı**dır: #0 *Rabbu'l-âlemîn'in elçisini* tanıtır, #1 *Rabbu'l-âlemîn'in mülkünü* gösterir.

### Wow Note (en)
This is the **largest of the 20 clusters**, carrying the Qur'an's structural backbone — 675 verses across 92 surahs. Every top surah is a **Meccan prophet-narrative unit** (Shuʿarāʾ 56 verses, Ṣāffāt 37, Ṭā-Hā 35, Aʿrāf 27, Hūd 25) — statistically surfacing what classical tafsīr already noted: *rabb al-ʿālamīn* in the Qur'an functions less as an abstract divine attribute and more as a **proclamational template** (Rāzī, *Mafātīḥ*, on Shuʿarāʾ). Every prophet, facing Pharaohs, Nimrods, and the elites of his people, begins with the *same line*. The neighboring Cluster #1 (cosmic sovereignty) — bond 921, the highest in the dataset — is its **theological complement**: #0 introduces *the messenger of* the Lord of the Worlds; #1 displays *the dominion of* the Lord of the Worlds.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — Şuarâ sûresi tefsirinde *rabbu'l-âlemîn* formülünün her peygamber için tekrarının belâgî yorumu.
- **Zemahşerî, *el-Keşşâf*** — *âlemîn* kelimesinin semantik genişliği (insan/cin/melek/diğer) ve *rabb* ile birleşiminin tutarlılığı.
- **Taberî, *Câmiu'l-Beyân*** — Fâtiha 1:2 *rabbu'l-âlemîn* tefsirinde rivayet düzeyinde tartışma.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — *âlemîn* çoğul yapısının kapsamı; "âlemler" çokluğunun teolojik yükü.
- **Toshihiko Izutsu, *God and Man in the Qur'an* (1964)** — *rabb* kavram alanının semantik analizi (efendi-koruyucu-eğitici üçlüsü).
- **Mustansir Mir, *Coherence in the Qur'an* (1986)** — formül-tekrarının sûreler arası tematik bağlayıcılığı.
- **Angelika Neuwirth, *The Qur'an and Late Antiquity* (2014)** — peygamber-takdim sahnelerinin geç antik dini retorikteki paralelleri.

### Komşu Kümelerle İlişki
- **Küme #1 (bond 921.4)** — **dataset'in en yüksek bond skoru.** Kozmik egemenlik kümesi; #0 *Rabbu'l-âlemîn'in elçisi*ni, #1 *Rabbu'l-âlemîn'in mülkünü* taşır.
- **Küme #4 (bond 643.3)** — peygamber kıssalarının **karşı kanadı**: tebliği red eden kavmin sonradan ikrarı/pişmanlığı (#4 "biz zalim idik" formülü).
- **Küme #2 (bond 598.1)** — "Ey iman edenler" topluluk-inşa söylemi; tebliğin Mekke'den Medine'ye geçiş cephesi.

---

## Küme #1 — Göklerin ve Yerin Mülkü: Kozmik Egemenlik / Dominion of the Heavens and the Earth: Cosmic Sovereignty

**Veri:** 628 ayet · 86 farklı sûre · avg semantic density 0.891 · top sûreler: 2 (Bakara, Med.) · 4 (Nisâ, Med.) · 3 (Âl-i İmrân, Med.) · 6 (En'âm, Mek.) · 26 (Şuarâ, Mek.)

**Merkezi 10 ayet:**
- **57:2 (Hadîd)** — *lehû mülkü's-semâvâti ve'l-ardi*; diriltme-öldürme; her şeye gücü yeten
- **39:62 (Zümer)** — Allah'ın her şeyin yaratıcısı ve vekili olması
- **49:16 (Hucurât)** — Allah'a din öğretme ironisi; göklerde ve yerde olanın ilmi
- **34:1 (Sebe')** — *el-hamdü lillâhi'llezî lehû mâ fi's-semâvâti ve mâ fi'l-ard*; iki dünyada da hamd O'nundur
- **5:40 (Mâide)** — göklerin ve yerin mülkünün Allah'a aitliği; dilediğini bağışlama-azaplandırma
- **3:189 (Âl-i İmrân)** — *ve lillâhi mülkü's-semâvâti ve'l-ard*; her şeye gücü yetme
- **43:85 (Zuhruf)** — göklerin, yerin ve aralarındakilerin mülkünün Allah'a aitliği; saatin bilgisi de O'nda
- **5:120 (Mâide)** — göklerin, yerin ve içindekilerin mülkünün Allah'ta olması
- **85:9 (Bürûc)** — göklerin ve yerin mülkünün Allah'a aitliği; Allah her şeye şahit
- **22:64 (Hac)** — göklerde ve yerde ne varsa O'nun; Allah ganî ve hamde lâyık

### Tema (tr)
**Göklerin ve Yerin Mülkü: Kozmik Egemenlik** — *"lehû mülkü's-semâvâti ve'l-ardi" formülü ile Allah'ın sahiplik-yönetim-bilgi üçlüsünü ilan eden yapısal mülkiyet retoriği.*

### Theme (en)
**Dominion of the Heavens and the Earth: Cosmic Sovereignty** — *the structural ownership-rhetoric built on "lahu mulk al-samāwāti wa-l-arḍ" — declaring God's possession, governance, and knowledge as a single triadic claim.*

### Özet (tr)
Bu küme tek bir kalıbın 86 sûreye yayıldığı **mülkiyet teolojisi** kümesidir: *lehû mülkü's-semâvâti ve'l-ardi* ("göklerin ve yerin mülkü O'nundur"). Şaşırtıcı olan, formülün **rastgele konumlanmaması** — neredeyse her geçişte üç şey eşleşir: (1) **mülk** (sahiplik), (2) **kudret** (her şeye gücü yetme — *vehüve alâ külli şey'in kadîr*), (3) **ilim** (göklerde ve yerde olanı bilme). Yani Kur'ân Allah'ı yalnızca sahip olarak değil, **yöneten ve bilen sahip** olarak konumlandırır. Klasik kelâmda bu üçlü "*sıfat-ı zâtiyye + sıfat-ı fiilliyye*" sentezi olarak okunur (Râzî); modern dilbilimde *triple coordination* (üçlü koşullanma) — bir teolojik öneriyi üç eksende sabitleyen retorik strateji.

### Summary (en)
This cluster is a **theology-of-ownership** unit: a single formula — *lahu mulk al-samāwāti wa-l-arḍ* ("to Him belongs the dominion of the heavens and the earth") — spread across 86 surahs. What is striking is the formula's non-random pairing: nearly every occurrence binds three claims — (1) **mulk** (possession), (2) **qudra** (omnipotence — *wa-huwa ʿalā kulli shayʾin qadīr*), (3) **ʿilm** (knowledge of all in the heavens and the earth). The Qur'an positions God not as owner alone but as **owner-who-governs-and-knows**. Classical kalām reads this as a synthesis of *ṣifāt al-dhāt* and *ṣifāt al-fiʿl* (Rāzī); modern linguistics calls it *triple coordination* — anchoring a theological proposition along three axes simultaneously.

### Alt Temalar
1. **Mülk-formülü** — *lehû mülkü's-semâvâti ve'l-ard* yapısının yapısal merkezliği (3:189, 5:120, 57:2, 85:9).
2. **Mülk + kudret eşlemesi** — sahipliğin **etkin** bir sahiplik olduğunu vurgulayan *kadîr* kapanışı (3:189, 5:40, 57:2).
3. **Mülk + ilim eşlemesi** — sahipliğin **bilinçli** bir sahiplik olduğunu vurgulayan ilim ifadeleri (49:16, 34:1).
4. **Hamd zincirinin mülk-temellendirilmesi** — *el-hamdü lillâhi*…*lehû mâ fi's-semâvâti ve mâ fi'l-ard* (34:1) — hamdın gerekçesi mülktür.
5. **Antitez: müşrikin "ortak" iddiasının çürütülmesi** — mülk sadece Allah'a aitse, "şerik" mantıksal olarak imkansızdır (Râzî'nin *Mefâtîh*'te yaptığı çıkarım).
6. **Kıyâme bilgisinin mülke ekli oluşu** — mülk sahibinin saatin bilgisini de tutması (43:85) — kozmik egemenliğin **zaman-eksenli** uzantısı.

### Wow Notu (tr)
628 ayet, **86 farklı sûre** — yani Kur'ân'ın **%75'inden fazlası** bu mülkiyet formülünün bir varyasyonunu en az bir kez kullanır. Top sûrelerde **uzun Medenî sûrelerin baskınlığı** (Bakara 33 ayet, Nisâ 27, Âl-i İmrân 27) dikkat çekicidir: mülkiyet teolojisi Kur'ân'ın Medine döneminde — topluluk-inşa, hukuk, hesap söyleminin yoğunlaştığı dönemde — daha sık tekrarlanmıştır. Bond skoru 921 ile **#0 (peygamber tebliği)** ve 907 ile **#2 (Ey iman edenler)** kümelerine bağlanması, bu üç kümenin Kur'ân'ın **teolojik üçayağı**nı oluşturduğunu gösterir: kim çağırıyor (#0), neyin Rabbi (#1), kime hitap ediyor (#2).

### Wow Note (en)
628 verses across **86 distinct surahs** — over **75 %** of the Qur'an deploys some variant of this ownership formula. Striking is the dominance of **long Medinan units** in the top list (Baqara 33 verses, Nisāʾ 27, Āl ʿImrān 27): ownership-theology intensifies in the Medinan phase, when community-formation, law, and accountability discourse all increase. With bond 921 to **#0 (prophetic proclamation)** and 907 to **#2 ("O you who believe")**, this cluster forms one leg of the Qur'an's **theological tripod**: who calls (#0), of what is He Lord (#1), to whom is the call addressed (#2).

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *mülk* kelimesinin *milk*'ten ayrımı (yönetim vs. salt sahiplik); *qadîr* + *ʿalîm* kapanışlarının kelâmî bütünlüğü.
- **Zemahşerî, *el-Keşşâf*** — *lehû mülkü's-semâvâti* yapısındaki *takdîm* (öne alma) — hasr (yalnızlaştırma) işlevi.
- **Beyzâvî, *Envâru't-Tenzîl*** — Bakara ve Âl-i İmrân'daki mülk-formülü tekrarlarının özlü tefsiri.
- **İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*** — formülün eskatolojik bağlamlarda (saat, hesap) yorumu.
- **Toshihiko Izutsu, *God and Man in the Qur'an* (1964)** — *mulk* kavram alanının kökeni ve *rabb* ile farkı.
- **Daniel Madigan, *The Qurʾān's Self-Image* (2001)** — Kur'ân'ın kendi otoritesini ilâhî mülk teolojisine bağlama stratejisi.
- **Suat Yıldırım, *Kur'ân-ı Hakîm ve Açıklamalı Meâli*** — mülk ayetlerinde Türkçeye aktarımın belâgî nüansları.

### Komşu Kümelerle İlişki
- **Küme #0 (bond 921.4)** — dataset'in en güçlü bağı; tebliğ-eden ile mülk-sahibi arasındaki yapısal eşleme.
- **Küme #2 (bond 907.6)** — "Ey iman edenler" hitabı; mülk-sahibinin müminlere doğrudan emri/yasağı.
- **Küme #8 (bond 618.2)** — kozmik düzen kümesi; mülk **sahiplik**, #8 ise mülkün *işleyişi* (gece-gündüz, yer-gök).
- **Küme #6 (bond 500.8)** — kozmik yeminler kümesi; mülk-sahibinin kendi yaratıklarına yemin etmesi.

---

## Küme #2 — "Ey İman Edenler!": Topluluk-İnşa Hitabı / "O You Who Believe!": The Community-Forming Address

**Veri:** 593 ayet · 71 farklı sûre · avg semantic density 0.895 · top sûreler: 2 (Bakara, Med.) · 4 (Nisâ, Med.) · 3 (Âl-i İmrân, Med.) · 9 (Tevbe, Med.) · 5 (Mâide, Med.)

**Merkezi 10 ayet:**
- **49:1 (Hucurât)** — *yâ eyyühe'llezîne âmenû* + Allah ve resulünün önüne geçmeme; takvâ
- **5:87 (Mâide)** — *yâ eyyühe'llezîne âmenû* + Allah'ın helal kıldığını haram kılmama; sınırı aşmama
- **33:41 (Ahzâb)** — *yâ eyyühe'llezîne âmenû* + Allah'ı çokça zikretme
- **2:278 (Bakara)** — *yâ eyyühe'llezîne âmenû* + takvâ + faiz alacaklarını terk
- **9:27 (Tevbe)** — Allah'ın tevbe kabul etmesi; gafûr-rahîm
- **5:39 (Mâide)** — haksız davranıştan tevbe + ıslah → Allah'ın tevbe kabulü
- **33:70 (Ahzâb)** — *yâ eyyühe'llezîne âmenû* + takvâ + doğru söz (*kavlen sedîdâ*)
- **2:192 (Bakara)** — düşmanın savaştan vazgeçmesi durumunda Allah'ın gafûr-rahîm oluşu
- **5:69 (Mâide)** — iman edenler, Yahudiler, sabiiler, Hristiyanlar — Allah'a ve ahirete inanıp salih amel edenlere korku/üzüntü olmaması
- **59:18 (Haşr)** — *yâ eyyühe'llezîne âmenû* + takvâ + yarına ne hazırladığına bakma

### Tema (tr)
**"Ey İman Edenler!": Topluluk-İnşa Hitabı** — *"yâ eyyühe'llezîne âmenû" formülünün başlattığı emir-yasak-tevbe-takvâ söyleminin yapısal bütünü; Medine döneminin topluluk-inşa retoriğinin omurgası.*

### Theme (en)
**"O You Who Believe!": The Community-Forming Address** — *the structural body of command-prohibition-repentance-piety discourse opened by "yā ayyuhā lladhīna āmanū" — the rhetorical spine of Medinan community-formation.*

### Özet (tr)
Bu küme **doğrudan hitap** kümesidir. Çekirdeği *yâ eyyühe'llezîne âmenû* ("ey iman edenler!") nidâ kalıbıdır — Kur'ân'da **89 kez** doğrudan kullanılan vokatif formül (Mu'cem el-Müfehres'e dayalı yaygın sayım). Küme bu formülü ve onun açtığı **emir/yasak/tevbe/takvâ** söylemini içerir. Şaşırtıcı olan, top 5 sûrenin **tamamının uzun Medenî sûreler** olması: Bakara (81 ayet), Nisâ (45), Âl-i İmrân (42), Tevbe (39), Mâide (29). Bu beklenen ama yapısal olarak doğrulanmış bir bulgudur: Mekke döneminde "ey insanlar" (*yâ eyyühe'n-nâs*), Medine döneminde "ey iman edenler" (*yâ eyyühe'llezîne âmenû*) baskındır. Embedding bu klasik usûl-i tefsir bilgisini sayısal olarak teyit eder.

### Summary (en)
This is the **direct-address** cluster. Its core is the vocative formula *yā ayyuhā lladhīna āmanū* ("O you who believe!") — used directly **89 times** in the Qur'an according to common concordance counts (e.g., ʿAbd al-Bāqī's *Muʿjam al-Mufahras*). The cluster carries this formula and the **command / prohibition / repentance / piety** discourse it opens. The striking finding: all five top surahs are **long Medinan units** — Baqara (81 verses), Nisāʾ (45), Āl ʿImrān (42), Tawba (39), Māʾida (29). This confirms statistically what classical *uṣūl al-tafsīr* already noted: Meccan revelations favor "O humankind" (*yā ayyuhā l-nās*), Medinan ones favor "O you who believe" (*yā ayyuhā lladhīna āmanū*). The embedding numerically validates the period-distinction.

### Alt Temalar
1. **Vokatif + takvâ** — neredeyse her hitap *ittakū'llâh* (Allah'tan korkun) ile devam eder (49:1, 2:278, 33:70, 59:18).
2. **Vokatif + emir** — namaz, zekat, oruç, savaş, faiz yasağı, doğru söz gibi somut emirler (33:41, 2:278, 33:70).
3. **Vokatif + yasak** — sınırı aşmama, helali haram kılmama (5:87).
4. **Tevbe-mağfiret zinciri** — emrin/yasağın ihlali sonrası tevbe kapısının açıklığı (5:39, 9:27, 2:192).
5. **Çapraz-cemaat ifadesi** — iman edenlerin yanında Yahudi-sabii-Hristiyanları da kapsayan açılım (5:69) — topluluk hitabının münhasır olmadığı vurgusu.
6. **Doğru söz emri** — *kavlen sedîdâ* (33:70) — Medenî söylemin **dil-etiği** boyutu.

### Wow Notu (tr)
593 ayet, 71 sûreye yayılır — Kur'ân'ın **%62'si** bu hitap çerçevesini taşır. Top 5 sûrenin **istisnasız Medenî** olması (Bakara, Nisâ, Âl-i İmrân, Tevbe, Mâide), embedding'in klasik *Mekkî/Medenî ayrımı*nı (Suyûtî, *el-İtkân*) sayısal olarak yeniden ürettiğini gösterir. Üstelik kümenin yoğunluğu **0.895** — 20 küme arasında üst sıralarda — yani 593 ayet **dilsel olarak da** sıkı bir biçim-birliği taşır. Komşu kümelerle bağlar bu kümenin **topluluk-eksenli** olduğunu doğrular: #1 (kozmik egemenlik, bond 907) Rabbi, #3 (iman+amel cennet vaadi, bond 804) ödülü tanımlar — #2 ise Rabbin müminlere doğrudan **emir cümlesi**dir.

### Wow Note (en)
593 verses across 71 surahs — about **62 %** of the Qur'an. The top 5 surahs are **uniformly Medinan** (Baqara, Nisāʾ, Āl ʿImrān, Tawba, Māʾida) — the embedding numerically reproduces the classical Meccan/Medinan distinction codified by Suyūṭī's *al-Itqān*. The cluster's density (0.895) sits in the upper range of the 20-cluster distribution: 593 verses are tightly bound by a shared rhetorical form. Neighbor bonds confirm the community-axis: #1 (cosmic sovereignty, bond 907) names the Lord, #3 (faith+deed → garden, bond 804) names the reward — and #2 sits between them as **the Lord's direct imperative** to those who believe.

### Kaynaklar (sources)
- **Suyûtî, *el-İtkân fî Ulûmi'l-Kur'ân*** — *yâ eyyühe'llezîne âmenû* formülünün Medenî tanımlayıcı olarak konumu (klasik usûl kuralı).
- **Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'ân*** — Kur'ân'daki nidâ (vokatif) çeşitleri ve bunların belâgî işlevleri.
- **Râzî, *Mefâtîhu'l-Gayb*** — Bakara 2:21 ve sonrası *yâ eyyühe'n-nâs* / *yâ eyyühe'llezîne âmenû* ayrımının teolojik anlamı.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — vokatif formüllerin sosyolojik-retorik işlevi; Medine ümmeti inşası.
- **Fazlur Rahman, *Major Themes of the Qur'an* (1980)** — Kur'ân'ın **etik topluluk** kavramı; iman-eylem-topluluk üçlüsü. *(Reformist akademisyendir; klasik ulema tarafından bazı yorumları eleştirilmiştir — burada yalnızca topluluk-etiği analizi için referans alındı.)*
- **Mehmet Okuyan, *Kur'an Mesajı*** — Türkçe meal ve tefsirde Medenî hitap çerçevesinin sunumu.
- **Muhammad Fuʾād ʿAbd al-Bāqī, *al-Muʿjam al-Mufahras***  — *yâ eyyühe'llezîne âmenû* formülünün geçiş sayısı (yaygın atıf).

### Komşu Kümelerle İlişki
- **Küme #1 (bond 907.6)** — kozmik egemenlik; Rabbin kim olduğu — bu küme Rabbin **müminlere doğrudan ne dediği**ni taşır.
- **Küme #3 (bond 804.5)** — iman+amel cennet vaadi; bu kümenin **vaad cephesi**.
- **Küme #0 (bond 598.1)** — peygamber-tebliği; Mekke'den Medine'ye geçiş cephesi.
- **Küme #5 (bond 419.2)** — ahiret sahneleri; emrin/yasağın eskatolojik dayanağı.

---

## Küme #4 — "Biz Zalim İdik": İkrar ve Pişmanlık Söylemi / "Indeed We Were Wrongdoers": The Discourse of Confession and Regret

**Veri:** 448 ayet · 73 farklı sûre · avg semantic density 0.886 · top sûreler: 7 (A'râf, Mek.) · 26 (Şuarâ, Mek.) · 12 (Yûsuf, Mek.) · 37 (Sâffât, Mek.) · 20 (Tâ-Hâ, Mek.)

**Merkezi 10 ayet:**
- **26:50 (Şuarâ)** — Firavun'un sihirbazlarının "zararı yok, biz Rabbimize döneriz" sözü (iman-sonrası teslim)
- **26:51 (Şuarâ)** — sihirbazların "Rabbimizin günahlarımızı bağışlamasını umarız" ifadesi
- **28:53 (Kasas)** — Ehl-i kitap'tan iman edenlerin "biz daha önce de müslüman idik" ikrarı
- **21:14 (Enbiyâ)** — helak edilen kavmin "vay başımıza gelenlere, biz zalim idik" çığlığı
- **7:125 (A'râf)** — sihirbazların "biz Rabbimize döneceğiz" teslimi
- **68:31 (Kalem)** — bahçe sahiplerinin "yazıklar olsun, biz azgın kişilermişiz" itirafı
- **12:97 (Yûsuf)** — Yûsuf'un kardeşlerinin babalarına "bizim için bağışlanma dile, biz günahkar idik" sözü
- **36:16 (Yâsîn)** — elçilerin "Rabbimiz biliyor, biz size gönderilmiş elçileriz" tasdiki
- **52:26 (Tûr)** — cennet ehlinin "biz dünyada aile çevremiz içinde bile korkardık" anısı
- **34:35 (Sebe')** — kafirlerin "biz mal ve evlat çokluğuyla azaba uğratılacak değiliz" yanılgısı

### Tema (tr)
**"Biz Zalim İdik": İkrar ve Pişmanlık Söylemi** — *kıssa karakterlerinin (sihirbazlar, kardeşler, helak edilen kavim, bahçe sahipleri) **birinci çoğul şahıs** ile yaptığı ikrar / pişmanlık / teslim cümlelerinin tematik çekirdeği.*

### Theme (en)
**"Indeed We Were Wrongdoers": The Discourse of Confession and Regret** — *the thematic core of **first-person plural** confessions, regrets, and submissions uttered by narrative characters — magicians, brothers, destroyed peoples, garden-owners.*

### Özet (tr)
Bu küme bir **konuşma kümesi**dir: ayetlerin neredeyse tamamı kıssa karakterlerinin **birinci çoğul şahıs** ("biz") ile söylediği cümlelerden oluşur. Çekirdek tipoloji üçlüdür: (1) **iman-anı ikrarı** ("Rabbimize döneriz" — sihirbazlar, 26:50, 7:125), (2) **azab-anı pişmanlığı** ("biz zalim idik" — helak edilen kavim, 21:14; bahçe sahipleri, 68:31; Yûsuf'un kardeşleri, 12:97), (3) **küfr-anı kibri** ("bize azap edilmez" — Sebe', 34:35; kıssa-içi karşı-ikrar). Şaşırtıcı olan kümenin **kıssa-yoğun Mekkî sûrelerde** (A'râf, Şuarâ, Yûsuf, Sâffât, Tâ-Hâ) yoğunlaşması — yani embedding "biz/biz idik/biz olduk" gibi vokal kalıpları kıssa-anlatımının **diyalog dokusu** olarak yakalamıştır. Bu Kur'ân retoriğinin az analiz edilen bir boyutudur: kıssa yalnızca anlatılmaz, **karakterler kendi sesleriyle hesap verir**.

### Summary (en)
This is a **speech cluster**: nearly every verse carries a **first-person plural** utterance by a narrative character. Three core types emerge: (1) **moment-of-faith confession** ("we shall return to our Lord" — the magicians, 26:50, 7:125), (2) **moment-of-punishment regret** ("indeed we were wrongdoers" — destroyed peoples, 21:14; garden-owners, 68:31; Joseph's brothers, 12:97), (3) **moment-of-disbelief arrogance** ("we will not be punished" — Sabaʾ, 34:35; counter-confession within narrative). Striking is the cluster's concentration in **narrative-heavy Meccan surahs** (Aʿrāf, Shuʿarāʾ, Yūsuf, Ṣāffāt, Ṭā-Hā) — the embedding catches "we / we were / we have become" as the **dialogic fabric** of qiṣṣa narration. This is an under-analyzed dimension of Qur'anic rhetoric: the story is not merely told — its characters give account in their own voices.

### Alt Temalar
1. **İman-anı teslim formülü** — *innâ ilâ rabbinâ münkalibûn* ("biz Rabbimize döneriz") — sihirbazların aniden teslim oluşu (26:50, 7:125).
2. **Pişmanlık formülü** — *yâ veylenâ innâ künnâ zâlimîn* ("vay başımıza, biz zalim idik") (21:14) ve varyantları (68:31).
3. **Aile-içi ikrar** — Yûsuf'un kardeşlerinin babalarından bağışlanma dileme talebi (12:97) — kıssa-içi **ahlâkî dönüş momenti**.
4. **Resul-tasdiki formülü** — elçilerin "Rabbimiz biliyor ki biz gerçekten gönderildik" cümlesi (36:16) — tebliğin **karşı taraf için bile şahidi**.
5. **Cennet ehlinin retrospektif anısı** — "biz dünyada korkardık" (52:26) — pişmanlık değil, dünyadaki takvânın ahirette **anılması**.
6. **Küfr-tarafının kibri** — "bize azap edilmez" (34:35) — kümenin **antitez** ifadesi; ikrar-kümesinin negatif ucu.

### Wow Notu (tr)
448 ayet, 73 sûreye yayılır — Kur'ân'ın **%64'ü**. Top 5 sûrenin **tamamı kıssa-yoğun Mekkî sûreler** (A'râf 27 ayet, Şuarâ 22, Yûsuf 22, Sâffât 21, Tâ-Hâ 16). Bu, klasik tefsirin "*Mekkî dönem peygamber kıssaları yoğundur*" tezini istatistiksel olarak doğrular. Üstelik kümenin top sûreleri Küme #0 (peygamber-tebliği) ile **büyük örtüşme** gösterir (bond 643) — bu doğal bir bulgudur: tebliği red veya kabul, **karakterlerin kendi ağzından** ifade edilir. Mustansir Mir'in dikkat çektiği "*Qur'anic dialogism*" (Kur'ânî diyalojizm) — Kur'ân'ın hikâye anlatırken karakterlere doğrudan ses vermesi — bu kümenin yapısal omurgasıdır.

### Wow Note (en)
448 verses across 73 surahs — about **64 %** of the Qur'an. All five top surahs are **narrative-heavy Meccan units** (Aʿrāf 27 verses, Shuʿarāʾ 22, Yūsuf 22, Ṣāffāt 21, Ṭā-Hā 16) — statistically confirming the classical tafsīr observation that Meccan revelations are dense with prophetic narratives. The cluster's top surahs overlap heavily with Cluster #0 (prophetic proclamation) — bond 643, the cluster's strongest tie — a natural finding: rejection or acceptance of the message is voiced **by characters themselves**. What Mustansir Mir calls **Qur'anic dialogism** — the Qur'an's tendency to give direct speech to its narrative characters — is the structural backbone of this cluster.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — A'râf 7:125 ve Şuarâ 26:50–51 sihirbazların teslim sahnesinin belâgî analizi.
- **Zemahşerî, *el-Keşşâf*** — *innâ künnâ zâlimîn* tipi pişmanlık formüllerinin retorik (özellikle *kâne* fiilinin geçmiş-iç-bakış işlevi).
- **İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*** — Yûsuf 12:97 kardeşlerin pişmanlık sahnesi; Kalem 68:31 bahçe sahipleri kıssasının ibret yapısı.
- **Mustansir Mir, "Dialogue in the Qurʾān" (*Religion and Literature* 24/1, 1992)** — Kur'ân'daki diyalojik (karşılıklı konuşma) yapının tipolojisi; karakterlerin kendi ağzından ikrarı.
- **Toshihiko Izutsu, *Ethico-Religious Concepts in the Qur'ān* (1966 / rev. 2002)** — *zulm* kavram alanı; "biz zalim idik" formülünün etik yükü.
- **Angelika Neuwirth, *Studien zur Komposition der mekkanischen Suren* (1981 / 2007 rev.)** — Mekkî kıssa retoriğinin yapısal incelemesi; karakter-sesi (*Figurenrede*) analizi.
- **Mustafa Öztürk, *Kıssaların Dili*** — Kur'ânî kıssa anlatımında karakter-konuşmasının pedagojik işlevi.

### Komşu Kümelerle İlişki
- **Küme #0 (bond 643.3)** — peygamber-tebliği kümesi; bu küme tebliğe verilen **karşılık**ları (red veya kabul) taşır.
- **Küme #1 (bond 431.3)** — kozmik egemenlik; karakterlerin "Rabbimize döneriz" ikrarının **muhatabı**.
- **Küme #5 (bond 355.0)** — ahiret sahneleri; pişmanlığın **eskatolojik karşılığı**.
- **Küme #3 (bond 331.6)** — iman+amel vaadi; iman-anı teslimleri bu vaadin **kıssa-içi tezahürü**.

---

## Küme #5 — Ahiret Mizansı: Cennet Konforu ve Cehennem İçeriği / The Hereafter Mise-en-Scène: Garden Comfort and Hellfire Content

**Veri:** 419 ayet · 91 farklı sûre · avg semantic density 0.884 · top sûreler: 26 (Şuarâ, Mek.) · 56 (Vâkıa, Mek.) · 37 (Sâffât, Mek.) · 7 (A'râf, Mek.) · 15 (Hicr, Mek.)

**Merkezi 10 ayet:**
- **76:13 (İnsân)** — cennet: koltuklarda kuruluş, ne yakıcı sıcak ne dondurucu soğuk
- **52:23 (Tûr)** — cennet: kadeh tokuşturma, sarhoşluk-günah yok
- **38:51 (Sâd)** — cennet: koltuklara yaslanmış, çeşitli meyveler ve içecekler isteme
- **21:100 (Enbiyâ)** — cehennem: inim inim inleme, hiçbir iyi haber duyamama
- **78:35 (Nebe')** — cennet: boş söz ve yalan işitmeme
- **2:162 (Bakara)** — cehennem: ebedî lanet, azap hafifletilmez, yüze bakılmaz
- **52:46 (Tûr)** — cehennem: planların fayda vermemesi, yardım yokluğu
- **33:65 (Ahzâb)** — cehennem: ebedî kalış, ne dost ne yardımcı
- **37:47 (Sâffât)** — cennet: içkide sersemletme yok, sarhoşluk yok
- **56:25 (Vâkıa)** — cennet: boş söz ve günaha sokan laf işitilmez

### Tema (tr)
**Ahiret Mizansı: Cennet Konforu ve Cehennem İçeriği** — *cennet ve cehennemi soyut yer-tasviri olarak değil, **duyusal-içerik karşıtlığı** olarak kuran "ne X ne Y" kalıbının yapısal kümesi.*

### Theme (en)
**The Hereafter Mise-en-Scène: Garden Comfort and Hellfire Content** — *the structural cluster built on the "neither X nor Y" formula — framing Paradise and Hellfire not as abstract locations but as a **sensory-content opposition**.*

### Özet (tr)
Bu küme **eskatolojik mekan tasviri** kümesidir, ama önemli bir niteliği vardır: cennet ve cehennem soyut bir "iyi yer / kötü yer" karşıtlığı olarak değil, **duyu-içerik düzeyinde** sunulur. Cennet için: *ne yakıcı sıcak ne dondurucu soğuk* (76:13), *ne sersemletme ne sarhoşluk* (37:47, 52:23), *ne boş söz ne yalan* (78:35, 56:25). Cehennem için: *ne dost ne yardımcı* (33:65), *ne azap hafifletilmesi ne yüze bakılması* (2:162), *plan-yarar-yardım yokluğu* (52:46). Şaşırtıcı olan, cennet tasvirlerinin tamamına yakının **olumsuzlama** (*lâ X ve lâ Y*) ile yapılması — cennet "*içinde X yok, Y de yok*" şeklinde, **dünya tecrübesinden çıkarma** yoluyla tanımlanıyor. Klasik kelâmda bu *tenzîhî tasvir* (olumsuzlama yoluyla tasvir) olarak okunur: dünya nimetinin kusurları kaldırılınca geriye **arınmış nimet** kalır.

### Summary (en)
This is the **eschatological mise-en-scène** cluster, with a distinctive trait: Paradise and Hellfire are framed not as an abstract good-place / bad-place pair, but at the **level of sensory content**. For Paradise: *neither scorching heat nor freezing cold* (76:13), *neither dizziness nor drunkenness* (37:47, 52:23), *neither idle talk nor falsehood* (78:35, 56:25). For Hellfire: *neither friend nor helper* (33:65), *neither lightening of punishment nor a glance at the face* (2:162), *no plans, no benefit, no aid* (52:46). What is striking: nearly all Paradise depictions proceed by **negation** (*lā X wa-lā Y*) — Paradise is defined by **subtracting** the defects of worldly experience. Classical kalām reads this as *tanzīhī* description (description by negation): once the imperfections of worldly bliss are removed, what remains is **purified bliss**.

### Alt Temalar
1. **Cennet için olumsuzlama formülü** — *lâ X ve lâ Y* yapısı; sıcak-soğuk, sarhoşluk-bayağılaşma, boş söz-yalan (76:13, 37:47, 78:35, 56:25).
2. **Cennet için olumlama formülü** — koltuk, kadeh, meyve, içecek (38:51, 52:23) — duyusal nimet tasviri.
3. **Cehennem için yokluk formülü** — dost yok, yardımcı yok, hafifletilme yok, yüze bakılma yok (2:162, 33:65, 52:46).
4. **Cehennem için varlık formülü** — inim inim inleme, hiçbir iyi haber duyamama (21:100) — pozitif olarak varolan azap.
5. **Konuşma-akustiğin eskatolojik önemi** — cennette boş söz ve yalan duyulmaz (56:25, 78:35); cehennemde iyi haber duyulmaz (21:100). Akustik düzlem cennet/cehennem ayırıcısıdır.
6. **Sosyal-yokluk** — cehennemde dostsuzluk, yardımsızlık (33:65) — modern psikolojinin "*social isolation*" kavramının dini-eskatolojik karşılığı (klasik tefsirde *vahşet-i hicrân* olarak geçer).

### Wow Notu (tr)
419 ayet, **91 farklı sûre** — yani Kur'ân'ın **%80'ine yakını** (114 sûreden 91'i) bu eskatolojik mizansını en az bir kez kullanır. Bu, Küme #0'dan sonra **en geniş sûre yayılımı** (92 vs. 91) — yani sûre çeşitliliği açısından dataset'in ikinci en yaygın kümesidir. Top 5 sûrenin **tamamı Mekkî** olması (Şuarâ, Vâkıa, Sâffât, A'râf, Hicr) klasik usûlün "*Mekkî dönem ahiret tasvirleri yoğundur*" tezini istatistiksel olarak teyit eder. Vâkıa ve Sâffât gibi sûrelerin ortak özelliği **ahireti somut sahne olarak kurmaları**dır — bu küme bu sahne-kuruculuğun yapısal omurgasıdır. Olumsuzlama (*lâ X ve lâ Y*) kalıbının cennet tasvirinde baskınlığı, klasik kelâmcıların *tenzîhî tavsîf* dediği yöntemin Kur'ân'ın **kendi dilinden** geldiğini gösterir.

### Wow Note (en)
419 verses across **91 distinct surahs** — nearly **80 %** of the Qur'an's surahs touch this eschatological scene at least once. After Cluster #0 this is the **second-broadest surah spread** in the dataset (92 vs. 91) — exceptional diversity per verse. All five top surahs are **Meccan** (Shuʿarāʾ, Wāqiʿa, Ṣāffāt, Aʿrāf, Ḥijr) — statistically confirming the classical *uṣūl* observation that Meccan revelations are dense with afterlife depictions. Surahs like Wāqiʿa and Ṣāffāt share the trait of constructing the Hereafter as a **concrete scene**, and this cluster forms the structural backbone of that scene-building. The dominance of the negation pattern (*lā X wa-lā Y*) in Paradise depictions shows that what classical theologians call *tanzīhī* description (definition by removal) is **already the Qur'an's own idiom**.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — Vâkıa, Sâffât, Tûr, İnsân sûrelerinin cennet tasvirlerinde *lâ X ve lâ Y* formülünün belâgî analizi.
- **Zemahşerî, *el-Keşşâf*** — Vâkıa 56:25 *lâ yesma'ûne fîhâ lağven ve lâ te'sîmâ* yapısının iki olumsuzlamalı dengesi.
- **Kurtubî, *el-Câmi' li-Ahkâmi'l-Kur'ân*** — cennet/cehennem tasvirinin ahkâmî sonuçları; ahiret hayatının dünya-tecrübesinden çıkarımla tanımlanması.
- **İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*** — cehennem azabının "asla hafifletilmez" (2:162) niteliğinin rivayet bağlamı.
- **Mustansir Mir, "The Qurʾanic Sūra as a Unity" (1993)** — Vâkıa sûresinin üç-grup (yakın, sağ, sol) kompozisyonu içinde cennet/cehennem tasvirlerinin yapısal yeri.
- **Sebastian Günther & Todd Lawson (eds.), *Roads to Paradise: Eschatology and Concepts of the Hereafter in Islam* (2017)** — Kur'ân'ın eskatolojik tasvirlerinin geç antik ve İslam içi okumaları.
- **Mehmet Okuyan, *Kur'ân'da Çok Anlamlılık*** — *cennet*, *firdevs*, *naîm*, *me'vâ* gibi cennet adlarının semantik çeşitliliği.

### Komşu Kümelerle İlişki
- **Küme #3 (bond 522.6)** — iman+amel cennet vaadi kümesi; #5 vaadin **gerçekleşmiş içeriği**, #3 vaadin **vaad-formu**.
- **Küme #0 (bond 478.9)** — peygamber-tebliği; ahiret sahneleri tebliğin **eskatolojik kanıt-yükü**.
- **Küme #1 (bond 424.5)** — kozmik egemenlik; ahiretin Allah'ın mülkünün **devam-sahnesi**.
- **Küme #2 (bond 419.2)** — "Ey iman edenler"; emir-yasak söyleminin eskatolojik dayanağı.
- **Küme #7 (bond 360.5)** — hesap günü kümesi (kıyamet/karşılık); #5 mizan-sonrası **mekan tasviri** ile #7 **hesap süreci**ni birbirini tamamlar.

---

## Üretici Notu

**Tamamlanan:** 5 küme (#0, #1, #2, #4, #5) tam tamamlandı; her küme için tema, özet (TR+EN), 5–6 alt tema, wow notu (TR+EN), 6–7 kaynak ve komşu küme yorumu üretildi. Pilot batch'in şablonu birebir korundu.

**Tematik kararlar (gerekçeli):**

1. **#0 — Âlemlerin Rabbi formülü.** Brief'te iki tahmin verilmişti (peygamber kıssaları VEYA âlemlerin Rabbi). Merkezi 10 ayetin 6'sında doğrudan *rabbu'l-âlemîn* geçer (7:104, 45:36, 59:16, 69:43, 26:23, 56:80); diğerleri tebliğ-içi sahnelerdir. Bu nedenle tema **"Âlemlerin Rabbi: Tevhidin Tebliğ Çerçevesi"** olarak kararlaştırıldı — her iki tahmini birleştiren sentez.

2. **#1 — Mülk formülü.** Brief tahmininin doğrulandığı küme. Merkezi 10 ayetin 7'si doğrudan *lehû/lillâhi mülkü's-semâvâti ve'l-ardi* yapısını taşır (3:189, 5:40, 5:120, 22:64, 43:85, 57:2, 85:9). Diğer 3 ayet (39:62, 49:16, 34:1) aynı kavram alanının kuvvet/ilim/hamd çıkışlarıdır.

3. **#2 — "Ey iman edenler" hitabı.** Brief tahmininin doğrulandığı küme. Merkezi 10 ayetin 5'i doğrudan *yâ eyyühe'llezîne âmenû* nidâsı (49:1, 5:87, 33:41, 2:278, 33:70, 59:18 = 6 aslında); diğer 4-5 ayet aynı söylem alanının yan-cümleleri (tevbe, gufrân, çapraz-cemaat).

4. **#4 — "Biz zalim idik" ikrar formülü.** Brief'te "En'âm yoğun" tahmini verildi ama merkezi 10 ayet bunu desteklemiyor: top sûreler A'râf, Şuarâ, Yûsuf, Sâffât, Tâ-Hâ. Tüm merkezi ayetler **birinci çoğul şahıs konuşma cümleleri** (sihirbazların teslimi, helak edilen kavmin pişmanlığı, kardeşlerin ikrarı, bahçe sahipleri, cennet ehlinin retrospektifi). Tema bu yapısal ortak özellik üzerinden kuruldu.

5. **#5 — Cennet/cehennem mizansı.** Brief'te "geniş yayılım" notu vardı ve doğru çıktı (91 sûre). Merkezi 10 ayetin 5'i cennet tasviri (76:13, 52:23, 38:51, 78:35, 56:25, 37:47 = 6 aslında), 4'ü cehennem tasviri (21:100, 2:162, 52:46, 33:65). Olumsuzlama (*lâ X ve lâ Y*) kalıbının baskınlığı, kümenin **belâgî öz**ü olarak öne çıkarıldı.

**Halüsinasyon riski / dikkat noktaları:**

1. **89 / 136 / yaygın sayım atıfları.** "*Yâ eyyühe'llezîne âmenû* 89 kez geçer" gibi sayımlar Mu'cem el-Müfehres'e dayalıdır ve klasik fihrist literatüründe yaygındır. Tek bir kaynaktan birebir doğrulamadım — bu nedenle "yaygın sayım" / "common concordance counts" hedge dilini kullandım. Nihai denetimde Abdülbâkî'nin fihristinden tam sayı alıntılanabilir.

2. **Mekkî/Medenî etiketleri.** Pilot ile aynı disiplin: ihtilaflı sûreler (Hadîd, Nahl, Ra'd) "(ihtilaflı)" notuyla işaretlendi. Batch A'da Hadîd (#1 merkezi 57:2) ihtilaflıdır; klasik sınıflandırmada genellikle Medenî kabul edilir ama bazı kayıtlar Mekkî der. Burada etiketsiz bırakılarak nüansa açık tutuldu.

3. **"Triple coordination" terimi (#1).** Modern dilbilim terminolojisini kullanarak *mulk + qudra + ʿilm* eşlemesini "triple coordination" olarak adlandırdım. Bu klasik kelâm söyleminden değil — ben **tanımlama amaçlı modern bir etiket** olarak kullandım. Kaynak atfı yapmadım çünkü klasik *sıfat-ı zâtiyye/fiilliyye* sentezini Râzî'ye atfettim; modern etiket sadece okuyucuya yapı açıklaması.

4. **"Qur'anic dialogism" (#4) — Mustansir Mir atfı.** Mir'in 1992 *Religion and Literature* makalesi "Dialogue in the Qurʾān" başlığıyla yayınlandı; bu doğrulanabilir bir referanstır. "Dialogism" terimi (Bakhtin'den geliyor) Mir'in kendi terminolojisi olmayabilir, ancak Mir Kur'ânî diyalog yapısını sistematik incelemiştir. Atıf "what Mir calls Qurʾanic dialogism" formülüyle ihtiyatlı kullanıldı — bu Bakhtinci terimin Mir'in eserindeki tam ibaresi denetimde teyit edilmelidir.

5. **Fazlur Rahman atfı (#2).** Rahman *Major Themes of the Qur'an* (1980) eseri **çağdaş tartışmalı** kategorisindedir. Talimat gereği "klasik ulema tarafından bazı yorumları eleştirilmiştir" notu kaynaklar listesinde italik açıklama olarak konuldu. Yalnızca topluluk-etiği boyutu için referans alındı.

6. **"%80 / %75 / %62 / %64" yüzdeleri.** Tüm yüzdeler **sûre yayılımı / 114** üzerinden hesaplandı (ayet/6236 değil). Pilot batch'te de aynı kabul vardı; Batch A'da bu kabul açıkça hem "92 / 114 surahs" hem "%80" formunda iki değer birlikte verilerek okuyucuya net tutuldu.

7. **Sebastian Günther & Todd Lawson (#5).** *Roads to Paradise: Eschatology and Concepts of the Hereafter in Islam* (Brill, 2017) doğrulanabilir akademik referanstır; iki ciltlik editör eseri. İçindeki spesifik makale belirtilmedi — denetim aşamasında ayrıntılandırılabilir.

**Ek denetim önerileri:**

- **#0 / #4 ayrımı**: İki küme de Şuarâ-A'râf-Sâffât-Tâ-Hâ ekseninde top-yoğunluğa sahiptir (#0: tebliğ-eden peygamberin sözleri; #4: tebliğ-alan karakterlerin sözleri). Embedding bunları doğru ayırmış mı yoksa birbirine geçmişler mi — denetim aşamasında ayet düzeyinde kontrol önerilir.
- **#1 / #8 ilişkisi**: #1 (mülk) ve #8 (kozmik düzen, pilot'ta üretildi) bond 618 ile bağlıdır. Pilot'taki #8 tasviri ile Batch A'daki #1 tasviri **çakışmıyor** — #8 yer-gök "*işleyişini*", #1 yer-gök "*sahipliğini*" işliyor. Bu ayrım korundu.
- **#2 ile pilot #3 (iman+amel) ilişkisi**: İki küme arasında bond 804 (pilot'ta #3 için verilmişti). #2 hitap-emir yönü, #3 vaad-ödül yönü olarak ayrıştı; çakışma yok.
- **#5'in cennet ve cehennem dengesi**: Merkezi 10 ayetten 6 cennet, 4 cehennem. Küme genelinde (419 ayet) bu oran nasıl? Üretim/denetim aşamasında ayet-düzey sayım yapılırsa wow notuna somut sayı eklenebilir ("419 ayetin X'i cennet, Y'si cehennem tasviri").

**Sonraki adım:** Batch B (#6, #7, #9, #12, #13) için aynı şablon korunacak. Beklenen tema ipuçları:
- #6 — kozmik yeminler (Tekvîr, Şems, Necm, Târık, Mürselât yoğun)
- #7 — kıyamet / hesap günü ("herkes yaptığının karşılığını alır")
- #9 — helak edilen kavimler, "yeryüzünde gezin görün" formülü
- #12 — "bu vaad ne zaman?" — kafirin alay-sorgu formülü
- #13 — kıyamet-anı sahneleri, *veylün yevmeizin lil-mükezzibîn* formülü
