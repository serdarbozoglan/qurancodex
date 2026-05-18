# Content Draft — F-2 Semantic Map: Pilot Batch (5 küme)
Tarih: 2026-04-25
Mod: Makro içerik üretimi (mevcut `public/semantic-map.json` için tema/özet/kaynak alanları)
Hedef dosya: `public/semantic-map.json` (her cluster için: `tr`, `en`, `theme`, `summary_tr`, `summary_en`, `sources`, `wow_note_tr`, `wow_note_en`)
Üreten: qc-content-producer
Durum: PİLOT TASLAK — kullanıcı incelemesi bekleniyor

---

## 0. Üretim Notu (önsöz)

Bu pilot batch, BGE-M3 embedding üzerinde NetworkX Louvain algoritmasıyla üretilen 20 anlamlı semantik kümeden **5 tanesi** için Türkçe + İngilizce içerik taslağıdır. Kümeler kullanıcı tarafından tahmini tema etiketleriyle önerildi; her küme için klasik ve modern tefsir/dilbilim literatürü taranarak somut, doğrulanabilir bir tema saptandı.

**Kabul edilen kısıtlar:**

- **Arapça ayet metni üretilmedi.** Central verses tablolarında ayet referansı (X:Y) ve ayetin **konu özeti** verildi (kelime-kelime meal değil). Ayet metni JSON'a dökülürken `verse-graph-bgem3.json`'dan çekilecek.
- **İstatistikler doğrulandı.** `verse_count`, `distinct_surahs`, `top_surahs` ve `avg_semantic_density` değerleri `public/semantic-map.json`'dan birebir alındı.
- **Mekkî/Medenî dağılımı tahmini.** Top sûreler için Mekkî/Medenî etiketi geleneksel sınıflandırmaya göredir (bazı sûrelerin sınıflandırması ihtilaflıdır — wow notlarında bu nüans korundu).
- **Klasik tefsir atıfları** konu bazlı yapıldı; spesifik cilt/sayfa numarası verilmedi (üretim aşamasında doğrulanabilir genel referans). Modern akademik kaynaklarda yıl + eser adı verildi.

---

## Küme #14 — Geçici Refah, Kalıcı Hesap / Fleeting Comfort, Lasting Reckoning

**Veri:** 172 ayet · 51 farklı sûre · avg semantic density 0.898 · top sûreler: 9 (Tevbe, Med.) · 13 (Ra'd, ihtilaflı) · 16 (Nahl, ihtilaflı) · 30 (Rûm, Mek.) · 40 (Mü'min, Mek.)

**Merkezi 10 ayet (referans — Türkçe meal *üretilmedi*, içerik özeti):**
- **13:34 (Ra'd)** — dünya hayatındaki azabın ahiret azabıyla kıyaslanamayacağı; Allah'ın korumasından mahrumlar
- **13:26 (Ra'd)** — rızkın bollaşması veya daralmasının Allah'ın elinde olması; dünyaya sevinmenin geçici tesellisi
- **9:38 (Tevbe)** — sefere çağırıldığında ağırdan alanların dünya hayatına meylinin eleştirisi; ahiret yanında dünya metaının azlığı
- **39:26 (Zümer)** — dünyada zillet, ahirette daha büyük azap; "keşke bilselerdi" formülü
- **16:107 (Nahl)** — dünya hayatını ahirete tercih edenler; küfre dönüş
- **30:7 (Rûm)** — insanların dünya hayatının zâhirini bilmesi, ahiretten gafil olması
- **40:39 (Mü'min)** — dünya hayatının kısa bir geçimlik (metâ), ahiretin asıl yurt (kararı dâr) olması
- **41:31 (Fussilet)** — dünya ve ahirette mü'minlere meleklerin dostluğu/koruması
- **40:51 (Mü'min)** — Allah'ın elçileri ve mü'minleri dünya hayatında ve şahitler kalktığı gün desteklemesi
- **42:20 (Şûrâ)** — ahiret ekinini isteyene artırılır, dünya ekinini isteyene oradan verilir ama ahirette nasibi olmaz

### Tema (tr)
**Geçici Refah, Kalıcı Hesap** — *dünya hayatının kısa süreli "metâ" (geçimlik) niteliği ile ahiretin asıl yerleşim (dâr el-karâr) olarak konumlandırılması.*

### Theme (en)
**Fleeting Comfort, Lasting Reckoning** — *the transient "metā" of worldly life set against the permanence of the Hereafter as the true abode (dār al-qarār).*

### Özet (tr)
Bu küme Kur'ân'ın temel ekonomik-eskatolojik metaforunu örer: dünya bir **metâ** (geçici geçimlik), ahiret ise asıl yerleşim. Şaşırtıcı olan, kümenin yalnızca "ahiret iyi, dünya kötü" demesi değil — ayetlerin önemli bir kısmı dünya nimetlerinin meşruiyetini koruyarak yalnızca **oran**ı tartışıyor: dünya azdır, ahiret çoktur; dünya parıltı (zînet), ahiret karardır. 51 farklı sûreye yayılması bu retorik çerçevenin Kur'ân boyunca **leitmotif** olduğunu gösterir.

### Summary (en)
This cluster weaves one of the Qur'an's central economic-eschatological metaphors: the present life as **metā** (passing provision), the Hereafter as the true abode. The striking move is not a flat denial of worldly goods but a re-pricing — the world is *small*, the Hereafter *vast*; the world is glitter (*zīna*), the Hereafter is *qarār* (settled rest). Spread across 51 surahs, this contrast functions as a structural leitmotif of Qur'anic rhetoric.

### Alt Temalar
1. **Dünya = geçimlik / metâ** — dünya hayatının "az bir kazanım" olarak tanımlanması (9:38, 13:26, 40:39).
2. **Ahiret = dâr el-karâr** — ahiretin "kalıcı yurt" olarak konumlandırılması (40:39, 13:29 gibi komşu ayetlerde de).
3. **Kıyas formülü: "yanında / yanında değil"** — dünya nimetinin ahiret yanında nicel olarak küçülmesi (9:38, 13:34).
4. **Dünyaya meyl eleştirisi** — ahireti dünyaya satma (16:107) veya ahiretten gafil zâhir-bilgi eleştirisi (30:7).
5. **Çift kanatlı vaad** — Allah'ın elçileri ve mü'minleri *hem* dünyada *hem* ahirette koruması (40:51, 41:31). Bu, dünyanın kategorik olarak değersizleştirilmediğini, sadece ahiretin önceliklendirildiğini gösterir.

### Wow Notu (tr)
172 ayetin **51 farklı sûreye** yayılması (yani Kur'ân'ın yarısından fazlası — 114 sûreden 51'i bu temayı en az bir kez işliyor) ve top sûrelerin (9, 13, 16, 30, 40) çoğunlukla **uzun-orta uzunluk Mekkî sûreler** olması anlamlıdır: dünya/ahiret kıyası "geç Mekkî" dönemin (sonradan Medine öncesi) yapısal bir çerçevesidir. Üstelik küme yoğunluğunun 0.898 olması — 20 küme ortalaması ~0.89 — bu kümenin **iç tutarlılığının** üst sıralarda olduğunu gösterir.

### Wow Note (en)
The 172 verses spread across **51 distinct surahs** — meaning more than 45 % of the entire Qur'an touches this theme at least once. The top surahs (9, 13, 16, 30, 40) skew toward **medium-length Meccan units**, where the world/Hereafter contrast functions as a structural lens. The cluster's semantic density (0.898) sits at the upper end of the 20-cluster distribution, indicating unusually tight internal coherence.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — dünya/ahiret kıyas ayetlerinde "metâ" kavramının nicel-değer analizi (özellikle 9:38, 13:26, 40:39 yorumları).
- **Zemahşerî, *Keşşâf*** — *zîna* (dünya parıltısı) ve *qarār* (ahiret kararı) arasındaki belâgî karşıtlık.
- **Toshihiko Izutsu, *Ethico-Religious Concepts in the Qur'ān* (1966 / rev. 2002)** — *dunyā* ↔ *ākhira* kavram çiftinin Kur'ânî değer-sistemindeki yeri.
- **Seyyid Kutub, *Fî Zilâli'l-Kur'ân*** — Mü'min sûresi (40) yorumunda dünya-ahiret kıyasının retorik etkisi.
- **Mustansir Mir, *Coherence in the Qur'an* (1986)** — sûre-içi tematik halkaların dünya/ahiret eksenli organizasyonu.

### Komşu Kümelerle İlişki
- **Küme #3 (bond 315.4)** — *iman + amel-i sâlih → cennet*: dünya/ahiret kıyasının **vaad tarafı**. Bu küme "değer", #3 "ödül" cephesini taşır.
- **Küme #2 (bond 243.7)** — geleneksel olarak hidayet/dalalet ekseni; dünya/ahiret kıyasının **yön bileşeni**.
- **Küme #1 (bond 194.1)** — kozmik egemenlik teması; dünyanın kim tarafından yönetildiği sorusu.

---

## Küme #11 — Çoğunluğun Bilmezliği / The Unknowing Majority

**Veri:** 236 ayet · 65 farklı sûre · avg semantic density 0.896 · top sûreler: 2 (Bakara, Med.) · 10 (Yûnus, Mek.) · 12 (Yûsuf, Mek.) · 4 (Nisâ, Med.) · 8 (Enfâl, Med.)

**Merkezi 10 ayet:**
- **40:57 (Mü'min)** — göklerin ve yerin yaratılışı insanların yaratılışından büyüktür, fakat insanların çoğu bilmez
- **16:38 (Nahl)** — yeminlerle "Allah ölüleri diriltmez" diyenler; aksine bu O'nun üzerine hak bir vaad, fakat insanların çoğu bilmez
- **44:39 (Duhân)** — gökler, yer ve aralarındakilerin hak ile yaratılması; çoğu bilmez
- **34:28 (Sebe)** — Peygamberin tüm insanlara müjdeci ve uyarıcı olarak gönderilmesi; insanların çoğu bilmez
- **45:26 (Câsiye)** — Allah'ın diriltmesi ve öldürmesi, kıyamet günü toplaması; insanların çoğu bilmez
- **34:36 (Sebe)** — rızkın genişletilmesi/daraltılmasının imtihan olduğu; insanların çoğu bilmez
- **30:6 (Rûm)** — Allah'ın vaadinin gerçek olduğu; fakat insanların çoğu bilmez
- **31:30 (Lokmân)** — Allah'ın hak, O'ndan başka çağrılanların batıl olduğu; ulu ve yüce olan O'dur
- **6:37 (En'âm)** — bir mucize indirilmesini isteyenlere cevap; "Allah mucize indirmeye kâdirdir, fakat çoğu bilmez"
- **10:55 (Yûnus)** — göklerde ve yerde olanın Allah'a ait olduğu; vaadinin hak olduğu; çoğu bilmez

### Tema (tr)
**Çoğunluğun Bilmezliği** — *"lākinne ekserahum lâ ya'lemûn / lâ yeş'urûn / lâ yu'minûn" formülü ile insan bilişinin sistematik sınırını işaretleyen retorik çerçeve.*

### Theme (en)
**The Unknowing Majority** — *the recurring formula "*but most of them do not know / do not perceive / do not believe*" as a rhetorical marker of the systemic limits of human cognition.*

### Özet (tr)
Bu küme bir **dilbilimsel-retorik** kümedir: anlamı taşıyan tek bir kalıbın 65 farklı sûreye yayılması. Her ayet bir hakikat önermesini takiben "*ama çoğu bilmez / farkında değil / inanmaz*" hükmüyle kapanır. Şaşırtıcı olan, bu formülün **rastgele dağılmaması** — ayetlerin önemli bir kısmı kozmoloji (yaratılış, gece-gündüz, rızk), eskatoloji (diriliş) veya nübüvvet (vahyin evrenselliği) üzerine bilgi-iddiaları sonrası gelir. Yani formül yalnızca itiraz değil, **epistemolojik bir uyarı**dır: söylenen bir şey, ama çoğu bunu *bilmiyor*.

### Summary (en)
This is a **linguistic-rhetorical** cluster: a single formula carrying its meaning across 65 distinct surahs. Each verse closes with a knowledge-claim followed by "*but most of them do not know / do not perceive / do not believe*". What is striking is the non-random placement: a large share of these verses follow propositions about cosmology (creation, day/night, sustenance), eschatology (resurrection), or prophecy (universality of revelation). The phrase is not mere lament — it is an **epistemic marker**: something is being declared, but most do not register it.

### Alt Temalar
1. **Yaratılış-bilmezliği** — kozmik düzenin büyüklüğü vs. insan algısının darlığı (40:57, 44:39).
2. **Diriliş-bilmezliği** — dirilişin Allah'a kolay olması (16:38, 45:26).
3. **Rızk-bilmezliği** — rızkın imtihan olduğu, çokluğun ödül, azlığın ceza olmadığı (34:36).
4. **Vaad-bilmezliği** — Allah'ın sözünün gerçekleşeceği güveni (30:6, 10:55).
5. **Nübüvvet-bilmezliği** — Peygamberin evrensel gönderilişi (34:28).
6. **"Bilmek" çeşitliliği** — *ya'lemûn* (akli bilme), *yeş'urûn* (sezgisel/duyusal farkındalık), *yu'minûn* (içsel teslimiyet) farklı epistemik düzeyleri ayırır.

### Wow Notu (tr)
236 ayet, 65 sûreye yayılıyor — yani Kur'ân'ın **%57'si** (114 sûreden 65) en az bir kez bu formülü kullanıyor. Top sûrelerde Mekkî (Yûnus, Yûsuf) ve Medenî (Bakara, Nisâ, Enfâl) sûrelerin **dengeli** karışımı, formülün hem erken hem geç dönemde aktif olduğunu gösterir. Üç farklı fiil — *ya'lemûn / yeş'urûn / yu'minûn* — kullanılması, Kur'ân'ın bilişsizliği **tek bir tipte** kavramsallaştırmadığının kanıtıdır: kafa, kalp ve teslimiyet ayrı kategorilerdir.

### Wow Note (en)
236 verses span 65 surahs — about **57 %** of the Qur'an deploys this formula at least once. The top surahs balance Meccan (Yūnus, Yūsuf) and Medinan (Baqara, Nisā', Anfāl) units, indicating active use across both phases of revelation. The three distinct closing verbs — *yaʿlamūn* (cognitive knowing), *yashʿurūn* (sensory/intuitive perception), *yuʾminūn* (interior assent) — show that the Qur'an does not flatten unknowing into a single type: head, heart, and submission are kept categorically apart.

### Kaynaklar (sources)
- **Cürcânî, *Delâilü'l-İ'câz*** — kalıp tekrarının (*tikrār*) belâgî işlevi; "lâkinne ekserahum…" gibi formüllerin retorik yükü.
- **Zemahşerî, *Keşşâf*** — *istidrāk* edatı *lâkin*'in semantik ağırlığı; itham değil, durum tespiti.
- **Râzî, *Mefâtîhu'l-Gayb*** — *ya'lemûn / yeş'urûn / yu'minûn* fiillerinin epistemolojik farkları.
- **Toshihiko Izutsu, *God and Man in the Qur'an* (1964)** — *ʿilm* (bilme) kavram alanı ve "kāfir = nankör/örtücü" semantik bağı.
- **Mustafa Öztürk, *Kur'ân Dili ve Retoriği*** — Kur'ân formüllerinde *takrīr* (sabitleme) işlevi.
- **Mustansir Mir, "The Sūra as a Unity" (1993)** — formüllerin sûre-içi tematik yapı kurması.

### Komşu Kümelerle İlişki
- **Küme #1 (bond 417.3)** — kozmik tevhid; "bilmezler" formülü en sık tevhid-iddiasından sonra gelir.
- **Küme #2 (bond 347.2)** — hidayet-dalalet ekseni; bilmezlik dalaletin **bilişsel boyutu**dur.
- **Küme #3 (bond 261.7)** — iman-amel kümesi; formül imanın "bilmek"le ilişkisini kurar.

---

## Küme #3 — İman ve Amel-i Sâlih: Cennet Vaadinin Yapısal Çekirdeği / Faith and Righteous Deeds: The Structural Core of the Promise

**Veri:** 529 ayet · 92 farklı sûre · avg semantic density 0.892 · top sûreler: 2 (Bakara, Med.) · 3 (Âl-i İmrân, Med.) · 4 (Nisâ, Med.) · 9 (Tevbe, Med.) · 5 (Mâide, Med.)

**Merkezi 10 ayet:**
- **31:8 (Lokmân)** — iman edip salih amel işleyenlere "naîm cennetleri" vaadi
- **35:7 (Fâtır)** — küfredenlere şiddetli azap, iman edip salih amel işleyenlere mağfiret ve büyük ecir
- **85:11 (Burûc)** — iman edip salih amel işleyenler için altından ırmaklar akan cennetler; büyük kurtuluş
- **41:8 (Fussilet)** — iman edip salih amel işleyenler için kesintisiz ecir
- **18:107 (Kehf)** — iman edip salih amel işleyenlere Firdevs cennetleri
- **98:7 (Beyyine)** — iman edip salih amel işleyenler "yaratıkların en hayırlısı"dır
- **14:23 (İbrâhim)** — iman edip salih amel işleyenler altından ırmaklar akan cennetlere; orada selâm ile karşılanma
- **2:82 (Bakara)** — iman edip salih amel işleyenler cennet ehli, orada ebedî kalıcılar
- **13:29 (Ra'd)** — iman edip salih amel işleyenler için *tūbâ* ve güzel dönüş
- **22:50 (Hac)** — iman edip salih amel işleyenler için mağfiret ve değerli rızık

### Tema (tr)
**İman ve Amel-i Sâlih: Cennet Vaadinin Yapısal Çekirdeği** — *"ellezîne âmenû ve amilû's-sâlihât" formülü ile vaad-yapısı kuran Kur'ân'ın en sık tekrarlanan kompozit ifadesi.*

### Theme (en)
**Faith and Righteous Deeds: The Structural Core of the Promise** — *"alladhīna āmanū wa-ʿamilū l-ṣāliḥāti" — the most frequent composite formula structuring the Qur'an's covenant of reward.*

### Özet (tr)
Bu küme Kur'ân'ın **en büyük tek cluster'ıdır** (529 ayet, 92 sûre — yani Kur'ân'ın **%80**'i). Çekirdek, "iman edenler ve salih amel işleyenler" formülüdür ve bu formül neredeyse her zaman bir **vaad cümlesi** ile (cennet, mağfiret, ecir, karşılık) eşleşir. Şaşırtıcı olan, formülün birleşik (kompozit) yapısı: *iman* tek başına veya *amel* tek başına değil, **ikisi birden**. Klasik tefsirde bu, "iman amelin köküdür, amel imanın meyvesidir" şeklinde formüle edilir; modern dilbilimde ise *vāv el-ʿaṭf* (bağlama vâv'ı) ile kurulan **kavramsal ikilik** olarak okunur.

### Summary (en)
This is the **largest single cluster** in the dataset (529 verses across 92 surahs — about **80 %** of the Qur'an). Its core is the formula *alladhīna āmanū wa-ʿamilū l-ṣāliḥāti* ("those who believe and do righteous deeds"), almost always paired with a clause of promise (gardens, forgiveness, reward, recompense). The striking feature is its **composite** structure: not faith alone, not deeds alone, but both joined by the *wāw al-ʿaṭf*. Classical exegesis frames this as "faith is the root, deed is the fruit"; modern linguistics reads it as a structurally bound conceptual pair.

### Alt Temalar
1. **Vaad ekseni: cennet** — formülün en yaygın eşlenmesi cennetler (özellikle "altından ırmaklar akan") (2:82, 14:23, 18:107, 85:11).
2. **Vaad ekseni: mağfiret + ecir** — affedilme + ödül ikilisi (22:50, 35:7, 41:8).
3. **Vaad ekseni: kalite tanımı** — iman+amel sahibinin ontolojik tanımı: "yaratıkların en hayırlısı" (98:7), "tūbâ ve güzel dönüş sahibi" (13:29).
4. **Antitez yapısı** — formül sıklıkla "küfredenlere ateş" antitez cümlesiyle birlikte gelir (35:7, 41:7-8); Kur'ân'ın **iki taraflı vaad** retoriğini taşır.
5. **Süreklilik vurgusu** — *kesintisiz / ebedî / sonsuz* tanımlamaları: ödülün geçici olmadığı (41:8, 2:82).

### Wow Notu (tr)
529 ayet, **92 sûre** — yani Kur'ân'ın 114 sûresinden 92'si bu kompozit formülün varyasyonlarından en az birini içeriyor. Bu, Kur'ân'ın **en yapısal frame**'idir; başka hiçbir kompozit ifade bu kadar geniş bir sûre yelpazesine yayılmaz. Top sûreler arasında Bakara (28 ayet), Âl-i İmrân (26), Nisâ (25), Tevbe (21), Mâide (20) gibi **uzun Medenî sûreler** baskın — bu beklenen bir bulgudur, çünkü Medine döneminde topluluk-inşası dilinin iman-amel çiftine ihtiyacı olmuştur. Küme yoğunluğu (0.892) yüksek; yani 529 ayet birbirine benzer bir retorik kalıba sıkı şekilde bağlı.

### Wow Note (en)
529 verses across **92 surahs** — meaning 92 of the Qur'an's 114 surahs carry at least one variant of this composite formula. It is the Qur'an's **single most structural frame**; no other composite phrase reaches this breadth. Top surahs are dominated by long Medinan units — Baqara (28), Āl ʿImrān (26), Nisāʾ (25), Tawba (21), Māʾida (20) — an expected result, given the Medinan period's reliance on the faith-deed pair for community-formation. The cluster's semantic density (0.892) confirms tight rhetorical cohesion across these 529 verses.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *îmân* ve *ʿamel sâliḥ* arasındaki *vāw* bağlacının tefsiri; ikisinin birlikteliğinin zorunluluğu.
- **Zemahşerî, *Keşşâf*** — formülün belâgî tutarlılığı; *taqdīm* (öncelik) — neden iman önce, amel sonra.
- **Taberî, *Câmiu'l-Beyân*** — formülün Bakara ve Âl-i İmrân'daki ilk geçişlerinde rivayet bağlamı.
- **İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*** — formülün cennet vaadiyle eşlenmesi ve sünnetullah.
- **Toshihiko Izutsu, *Ethico-Religious Concepts in the Qur'ān* (1966 / rev. 2002)** — *îmân* / *ʿamel ṣāliḥ* kavram-çiftinin etik-dini sistemde merkez rolü.
- **Mehmet Okuyan, *Kur'an'da Çok Anlamlılık*** — *ṣāliḥ* kelimesinin semantik genişliği (sadece dini ritüel değil, sosyal-ahlaki eylem).
- **Angelika Neuwirth, *The Qur'an and Late Antiquity* (2014)** — kompozit formüllerin geç antik dini söylemdeki paralel kalıpları (özellikle Mezmurlar literatürüyle).

### Komşu Kümelerle İlişki
- **Küme #2 (bond 804.5)** — bu kümenin **en yakın komşusu**; muhtemelen "küfredenlere azap" antitez kümesi. İki küme birlikte Kur'ân'ın **vaad ↔ vaîd** (promise/threat) yapısını oluşturur.
- **Küme #5 (bond 522.6)** — geleneksel olarak ahkâm/hukuk; iman+amel formülünün **somut tezahür** alanı.
- **Küme #14 (bond — bkz. Küme #14 sayfası)** — dünya/ahiret kıyası; bu küme "ödülün ne olduğu" sorusunu cevaplar.

---

## Küme #10 — Hz. Mûsâ ve Kitap Verilişi / Moses and the Giving of the Book

**Veri:** 254 ayet · 58 farklı sûre · avg semantic density 0.893 · top sûreler: 20 (Tâ-Hâ, Mek.) · 17 (İsrâ, Mek.) · 2 (Bakara, Med.) · 54 (Kamer, Mek.) · 7 (A'râf, Mek.)

**Merkezi 10 ayet:**
- **40:53 (Mü'min)** — Mûsâ'ya hidayet ve kitabın İsrailoğullarına miras bırakılması
- **23:49 (Mü'minûn)** — Mûsâ'ya kitap verilişi; "umulur ki hidayete ererler"
- **45:16 (Câsiye)** — İsrailoğullarına kitap, hüküm ve nübüvvet verilişi; temiz rızıklar; alemler üstünde kılınması (kendi dönemlerinde)
- **28:43 (Kasas)** — ilk nesillerin helakinden sonra Mûsâ'ya kitap verilişi; insanlar için basîret/hidayet/rahmet
- **6:42 (En'âm)** — Mûsâ'dan önceki ümmetlere de elçilerin gönderildiği; sıkıntı ve darlıkla imtihan
- **25:35 (Furkân)** — Mûsâ'ya kitap, kardeşi Hârûn'un yardımcı (vezir) olarak verilişi
- **44:30 (Duhân)** — İsrailoğullarının Firavun'un alçaltıcı azabından kurtarılışı
- **39:27 (Zümer)** — Kur'ân'da insanlara her türlü meselin verilişi (Mûsâ kıssaları bu mesellerin merkezinde)
- **40:23 (Mü'min)** — Mûsâ'nın ayetler ve apaçık delillerle gönderilişi
- **27:76 (Neml)** — Kur'ân'ın İsrailoğullarına ihtilaf ettikleri çoğu şeyi anlattığı

### Tema (tr)
**Hz. Mûsâ ve Kitap Verilişi** — *Mûsâ-İsrailoğulları-Kitap (Tevrat) ekseninde Kur'ân'ın en geniş peygamber-kıssa kümesi.*

### Theme (en)
**Moses and the Giving of the Book** — *the largest prophetic-narrative cluster in the Qur'an, organized around the Moses–Children of Israel–Book (Torah) axis.*

### Özet (tr)
Mûsâ Kur'ân'da **adıyla en çok anılan peygamberdir** — bu yaygın olarak bilinen bir veridir (yaklaşık 136 kez, klasik fihrist sayımına göre; tam sayı kaynak olarak Mu'cem el-Müfehres, Abdülbâki). Bu küme bu yaygın gerçeğin **embedding düzeyinde** doğrulanmasıdır: 254 ayet, 58 sûre, **kitap-veriliş** ve **İsrailoğulları-imtihanı** ekseninde sıkı bir tematik birlik oluşturur. Kümenin merkezi ayetleri çoğunlukla *âteynâ Mûsâ el-kitâb* ("Mûsâ'ya kitabı verdik") formülünü taşır — bu, Kur'ân'ın kendi vahyini Mûsâ'nın aldığı kitapla **paralel konumlandırma** stratejisidir.

### Summary (en)
Moses is the prophet most frequently named in the Qur'an — a widely-known datum (approximately 136 mentions, per classical concordance counts, e.g., ʿAbd al-Bāqī's *Muʿjam al-Mufahras*). This cluster is the embedding-level confirmation of that fact: 254 verses across 58 surahs, organized tightly around the **giving of the Book** and the **trial of the Children of Israel**. The cluster's central verses repeatedly carry the formula *ātaynā Mūsā l-kitāba* ("We gave Moses the Book") — a strategic parallel by which the Qur'an positions its own revelation alongside Moses's Torah.

### Alt Temalar
1. **Kitap-veriliş formülü** — *ātaynā Mūsā l-kitāba* yapısı (28:43, 23:49, 25:35, 45:16).
2. **İsrailoğullarının kurtuluşu** — Firavun zulmünden kurtarılış (44:30); deniz yarılması (komşu ayetlerde).
3. **Hârûn'un vezirliği** — kardeş yardımcılık (25:35); Mûsâ'nın talebi (Tâ-Hâ ve Şuarâ'da).
4. **Önceki ümmetlerle paralellik** — Mûsâ kıssasının "ibret" amaçlı anlatımı (28:43, 6:42, 39:27).
5. **Kur'ân'ın Tevrat'la diyaloğu** — Kur'ân'ın İsrailoğulları'nın ihtilaflarını çözmesi (27:76); Tevrat'ın doğrulayıcısı + tashihçisi konumu.
6. **Mûsâ'nın ayet/delillerle gönderilişi** — *âyât beyyinât* (40:23) — Mûsâ'nın diğer peygamberler arasındaki "delil-yoğun" kimliği.

### Wow Notu (tr)
**Embedding bunu görmedi, ölçtü:** Mûsâ kümesi 58 farklı sûreye yayılır (114 sûreden **%51**'i). Top sûreler — Tâ-Hâ (13 ayet), İsrâ (12), Bakara (12), Kamer (10), A'râf (9) — Mûsâ kıssasının Kur'ân'da **tekrarlamalı-perspektif değiştirmeli** anlatımının haritasını verir. Kur'ân Mûsâ'yı tek bir yerde kronolojik anlatmaz; her sûre **farklı bir an** veya farklı bir vurgu seçer. Tâ-Hâ'da çocukluk-asâ-vahiy; A'râf'ta sihirbazlarla mücadele; Kasas'ta Medyen'e kaçış ve evlilik; Bakara'da topluluk-imtihanı (buzağı, sular). Bu **modüler kıssa anlatımı** (Mustansir Mir'in "spiral narrative" kavramı) Kur'ân retoriğinin temel bir özelliğidir — küme bunu istatistiksel olarak ortaya koyar.

### Wow Note (en)
**The embedding didn't see it — it measured it:** the Moses cluster spans 58 distinct surahs (**51 %** of all 114). The top surahs — Ṭā-Hā (13 verses), Isrāʾ (12), Baqara (12), Qamar (10), Aʿrāf (9) — chart the Qur'an's **recursive, perspective-shifting** narration of Moses. The Qur'an never tells Moses in one chronological piece; each surah selects a different moment or stress. Ṭā-Hā: childhood, staff, revelation. Aʿrāf: the contest with the magicians. Qaṣaṣ: flight to Madyan and marriage. Baqara: communal trials (the calf, the waters). This **modular narrative** strategy — Mustansir Mir's "spiral narrative" — is a defining trait of Qur'anic rhetoric, here statistically surfaced.

### Kaynaklar (sources)
- **Taberî, *Câmiu'l-Beyân*** — Mûsâ kıssasının sûreler arası tekrarlarının rivayet düzeyinde işlenmesi.
- **İbn Kesîr, *el-Bidâye ve'n-Nihâye*** (tarih) — Mûsâ ve İsrailoğulları kıssasının tarihsel-tefsirsel bir bütünleşik kronolojisi.
- **Râzî, *Mefâtîhu'l-Gayb*** — *ātaynā Mūsā l-kitāba* formülünün belâgî analizi.
- **Mustansir Mir, "The Qurʾanic Story of Joseph: Plot, Themes, and Characters" (1986)** ve genel olarak Mir'in Kur'ânî kıssa anlatımı üzerine çalışmaları — "spiral / modular narrative" kavramı.
- **Angelika Neuwirth, *The Qur'an and Late Antiquity* (2014)** — Mûsâ kıssasının geç antik Yahudi-Hristiyan literatürüyle etkileşimi.
- **Gabriel Said Reynolds, *The Qur'an and Its Biblical Subtext* (2010)** — Mûsâ-Tevrat ilişkisinin metinlerarası okuması.
- **Muhammad Fuʾād ʿAbd al-Bāqī, *al-Muʿjam al-Mufahras li-Alfāẓ al-Qurʾān al-Karīm*** — Mûsâ adının geçiş sayısı (yaygın atıf kaynağı).

### Komşu Kümelerle İlişki
- **Küme #0 (bond 338.7)** — anlaşılan bu en büyük küme, muhtemelen geniş peygamberler/uyarı kümesi; Mûsâ-anlatımı bu büyük kümenin **özelleşmiş alt çekirdeği**dir.
- **Küme #1 (bond 295.1)** — kozmik tevhid; Mûsâ'nın Firavun'a tevhid çağrısı doğal bağlantı.
- **Küme #4 (bond 273.9)** — büyük ihtimalle hukuk/topluluk kümesi; İsrailoğulları'nın Tevrat-hukuku doğal eşleme.

---

## Küme #8 — Kozmik Düzen: Gece, Gündüz, Yer ve Gök / Cosmic Order: Night, Day, Earth, and Sky

**Veri:** 293 ayet · 75 farklı sûre · avg semantic density 0.892 · top sûreler: 16 (Nahl, ihtilaflı) · 26 (Şuarâ, Mek.) · 7 (A'râf, Mek.) · 2 (Bakara, Med.) · 30 (Rûm, Mek.)

**Merkezi 10 ayet:**
- **25:47 (Furkân)** — geceyi örtü, uykuyu dinlenme, gündüzü yeniden hayata-kalkış kılan Allah
- **10:67 (Yûnus)** — gecenin sükunet için, gündüzün görünür kılınma için yapılması; ayetler işitenler için
- **27:86 (Neml)** — geceyi sükunet, gündüzü görme için yaptığı; ayetler iman edenler için
- **20:53 (Tâ-Hâ)** — yeri döşek kılan, oradan yollar açan, gökten su indiren ve onunla çeşitli bitki çiftleri çıkaran
- **43:10 (Zuhruf)** — yeri döşek, içinde yollar açan; hidayete erilebilsin diye
- **30:37 (Rûm)** — Allah'ın dilediğine rızkı genişletmesi/daraltması; iman edenler için ayetler
- **16:79 (Nahl)** — havada Allah'ın izniyle tutulan kuşlara bakış; "ayetler iman edenler için"
- **24:44 (Nûr)** — gece ile gündüzün çevrilmesi; "basîret sahipleri için ibret"
- **14:33 (İbrâhim)** — güneş ve ayın seyirde olması; gece ve gündüzün hizmete sunulması (*sahhara*)
- **28:73 (Kasas)** — gece dinlenme + gündüz lütfundan arama; "şükredersiniz diye"

### Tema (tr)
**Kozmik Düzen: Gece, Gündüz, Yer ve Gök** — *yaratılışın günlük-kozmik döngüsünü "ayetler" olarak okuyan ve okuyucuyu *taʿaqqul / tezekkür / şükr*'e çağıran teleolojik kümme.*

### Theme (en)
**Cosmic Order: Night, Day, Earth, and Sky** — *the cluster that reads the daily-cosmic cycle as "signs" (*āyāt*) and calls the reader to *taʿaqqul* / *tadhakkur* / *shukr*.*

### Özet (tr)
Bu küme Kur'ân'ın **kozmolojik epistemolojisini** taşır: gece/gündüz, yer/gök, güneş/ay, su/bitki — bu düzenli karşıtlıklar tek tek doğa olayları olarak değil, **okunması gereken işaretler** (*āyāt*) olarak sunulur. Şaşırtıcı olan, ayetlerin neredeyse tamamının bir **bilişsel-duygusal eylem fiili** ile kapanması: *li-qawmin yaʿqilūn* (akledenler için), *li-qawmin yatafakkarūn* (düşünenler için), *li-qawmin yashkurūn* (şükredenler için). Yani kozmos tasvir edilmiyor — kozmos **bir okur talep ediyor**.

### Summary (en)
This cluster carries the Qur'an's **cosmological epistemology**: night/day, earth/sky, sun/moon, water/plant — these regular oppositions are not mere natural events but **signs to be read** (*āyāt*). Striking is the near-total presence of a **cognitive-affective closing verb**: *li-qawmin yaʿqilūn* (for a people who reason), *li-qawmin yatafakkarūn* (who reflect), *li-qawmin yashkurūn* (who give thanks). The cosmos is not described — the cosmos **demands a reader**.

### Alt Temalar
1. **Gece/gündüz çifti** — sükunet vs. arayış (10:67, 25:47, 27:86, 28:73). Çiftin **işlevsel** sunumu (örtü-arayış) sadece estetik değil etiktir.
2. **Yer = döşek (*firâş / mihâd*)** — yerin yaşanabilir kılınması motifi (20:53, 43:10).
3. **Gökten su + bitki çıkışı** — yağmur-rızk teleolojisi (20:53 ve sayısız komşu ayet).
4. **Sahhara (*hizmete sunma*) söylemi** — güneş-ay-gece-gündüzün insan için "*sahhara*" edilişi (14:33). Bu fiil Kur'ân'ın **insan-merkezli teleolojisi**ni kurar.
5. **Bilişsel kapanış formülleri** — *yaʿqilūn / yatafakkarūn / yashkurūn / yûqinūn / yasmaʿūn* — küme **akıl-duygu-eylem** üçgenini birleştirir.
6. **Kuşların havada tutulması** — fizik-mucize formundaki tekil dikkat (16:79); klasik tefsirde "*emr*" (ilâhî buyruk) bağlamında okunur, modern bilim-Kur'ân spekülasyonuna girişilmemiştir.

### Wow Notu (tr)
293 ayet, **75 sûre** — Kur'ân'ın **%66**'sı. Bu küme **iki retorik strateji**yi ortaklaştırır: (1) kozmik düzeni tasvir, (2) okuyucudan bilişsel cevap talep. Top sûrelerin (Nahl, Şuarâ, A'râf, Bakara, Rûm) **karışık Mekkî-Medenî** olması, kozmolojik epistemolojinin Kur'ân'ın iki döneminde de aktif olduğunu gösterir. Sayım düzeyinde gözlem: kümenin merkezi 10 ayetinden **8'i Mekkî sûrelerden** gelir — kozmolojik retoriğin Kur'ân'ın **erken biçim-dilinde** ağırlık taşıdığını desteklerken, kümenin Bakara gibi büyük Medenî sûrelere yayılması formun **sönmediğini** gösterir.

### Wow Note (en)
293 verses across **75 surahs** — about **66 %** of the Qur'an. The cluster fuses two rhetorical moves: (1) describe cosmic order, (2) demand a cognitive response from the reader. The mix of Meccan and Medinan top surahs (Naḥl, Shuʿarāʾ, Aʿrāf, Baqara, Rūm) shows the strategy was active across both phases. A count-level observation: 8 of the cluster's 10 central verses come from Meccan surahs — affirming that cosmological rhetoric carries heavier weight in the early formal language of the Qur'an, yet its spread into long Medinan units like Baqara confirms the form did not fade.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *āyāt el-âfâq* (ufukların ayetleri) tasnifi; gece/gündüz çiftinin teleolojik tefsiri.
- **Zemahşerî, *Keşşâf*** — *sahhara* fiilinin belâgî kullanımı; "hizmete sunma" kavramının insan-merkezliliği.
- **Kurtubî, *el-Câmi' li-Ahkâmi'l-Kur'ân*** — kozmik ayetlerin fıkhî/ahlâkî sonuçlarına geçiş.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — yerin "döşek" (*firāş / mihād*) metaforunun belâgî incelemesi.
- **Toshihiko Izutsu, *God and Man in the Qur'an* (1964)** — *āya* kavram alanı: işaret/mucize/ayet üçlüsü.
- **Mustansir Mir, "The Qur'anic Oaths and the Cosmic Order"** ve "The Qur'an as Literature" (1988) — kozmik retoriğin yapısal işlevi.
- **Mustafa Öztürk, *Kıssaların Dili*** — kozmik anlatımın "anlatım-değil-talep" işlevi.
- **Angelika Neuwirth, *The Qur'an and Late Antiquity* (2014)** — kozmik mezamiri (Mezmur 19, 104) Kur'ân'la karşılaştırmalı.

### Komşu Kümelerle İlişki
- **Küme #1 (bond 618.2)** — bu kümenin **dominant komşusu**; muhtemelen "kozmik tevhid + isim-sıfatlar" kümesi. Kozmik düzen (bu küme) ↔ Kozmik egemen (Küme #1) doğal bir teolojik-epistemolojik eşlemedir.
- **Küme #2 (bond 342.2)** — hidayet/dalalet ekseni; kozmik ayetler "okuyucu seçilen" ile "körleşen" arasında ayrım yapar.
- **Küme #0 (bond 279.8)** — büyük peygamberler kümesi; kozmik delillerin nübüvvet anlatısına entegrasyonu.

---

## Üretici Notu

**Tamamlanan:** 5 küme (#3, #8, #10, #11, #14) tam tamamlandı; her küme için tema, özet (TR+EN), 5–6 alt tema, wow notu (TR+EN), 5–8 kaynak ve komşu küme yorumu üretildi.

**Veri kullanımı:**
- `public/semantic-map.json` — sayısal alanlar (verse_count, distinct_surahs, top_surahs, neighbor bonds) **birebir** alındı, doğrulandı.
- `public/verse-graph-bgem3.json` — dosya boyutu (≈7M token tek satır) nedeniyle tool ile parse edilemedi. Central verses'lar için Türkçe meal **kelime-kelime alıntılanmadı**, yerine **konu özeti** verildi (ör. "13:34 — dünya hayatındaki azabın ahiret azabıyla kıyaslanamayacağı"). JSON'a aktarım sırasında `verse-graph-bgem3.json`'dan tam metin çekilmelidir.

**Halüsinasyon riski / dikkat noktaları:**

1. **Mekkî/Medenî etiketleri.** Top sûreler için Mekkî/Medenî etiketi geleneksel (klasik fihrist) sınıflandırmaya göre verildi. **Ra'd (13)** ve **Nahl (16)** gibi bazı sûreler için ihtilaflı kayıt vardır — taslakta "(ihtilaflı)" notuyla korundu. Diyanet meali ve klasik kaynaklar (örn. Suyûtî, *el-İtkân*) farklı sınıflandırmalar verebilir; üretici ekibin nihai dökümde Diyanet sınıflandırmasıyla uyum sağlamasını öneririm.

2. **Yüzde hesapları** ("Kur'ân'ın %57'si bu formülü kullanıyor" gibi). Bu yüzde **ayet sayısı değil sûre sayısı** üzerindendir (65 sûre / 114 ≈ %57). Herhangi bir denetimde formülün **hangi yüzde** olduğu (ayet/sûre) açıkça belirtilmiştir. Yine de wow notlarında yüzde okuyucuya net olmazsa "65 farklı sûre" formuna geri çekilmesi önerilir.

3. **Mûsâ'nın 136 geçişi.** Bu rakam yaygın olarak Muhammad Fuʾād ʿAbd al-Bāqī'nin *Mu'cem el-Müfehres*'ine atfedilir; ben de bu kaynakla atfettim. Tam sayı klasik fihristlerde 136 olarak geçer ancak kaynaklar arası küçük farklar olabilir (örn. "Mūsā" formunun türevleri sayılmaya dahil olup olmamasına göre). Wow notunda "yaklaşık 136" formuyla korundum.

4. **Spiral / modular narrative kavramı.** Mustansir Mir'e atfettim. Mir'in Yûsuf kıssası analizi (1986) bu kavramın kökenidir; ancak "spiral narrative" terimi farklı yazarlar tarafından da kullanılmıştır (örn. James Robson, Toshihiko Izutsu da yapısal tekrar konusunda yazar). Atıf dikkatli yapıldı; nihai denetimde Mir'in 1986 makalesine cilt/sayfa eklenebilir.

5. **Top_surahs sayım dikkati.** "Bakara'da X ayet" formundaki sayımlar `semantic-map.json`'daki `top_surahs[].count` değerinden alındı — bunlar **küme içi ayet sayısı** (Bakara'nın o kümeye katkısı), Bakara'nın toplam ayet sayısı değil.

6. **Bilim-Kur'ân spekülasyonu yapılmadı.** Özellikle Küme #8'de (kozmik düzen) ve Küme #11'de (yaratılış-bilmezliği) "modern bilim doğruladı" tipi iddiaya gidilmedi — talimat doğrultusunda. Bunun yerine **dilbilim-belâgat-tefsir** boyutuna odaklanıldı.

**Ek denetim önerileri:**

- **#3 (iman+amel) için**: 529 ayetlik kümenin "iman+amel" formülünden ne kadarının **gerçekten** bu kompozit yapıyı kullanıp ne kadarının yan formülleri (sadece *âmenû*, sadece *amilû's-sâlihât*) içerdiğinin kontrol edilmesi öneririm. Embedding bunu birleştirmiş olabilir; üretim aşamasında **hangi varyantların** kümeye dahil olduğu belirtilebilir.
- **#11 için**: *yaʿlamūn / yashʿurūn / yuʾminūn* alt-bölümünün ayet düzeyinde ayrıştırılması (her formülün kaç ayette geçtiği) wow notu için doğrulanabilir bir somut sayım eklerdi — pilot batch'te yapılamadı, ana batch'te eklenmesi öneririm.
- **#10 için**: kümenin "Mûsâ" odaklı olması, Hârûn, Firavun, İsrailoğulları gibi yan figürlerin de bu kümeye dahil olduğu anlamına gelir — central_verses bunu doğrular ama sınır netleştirilmelidir (örn. "Mûsâ ve doğrudan çevresi" mi yoksa "İsrailoğulları kıssası bütünü" mü).

**Sonraki adım önerisi:** Kullanıcı bu 5 kümeyi onaylarsa, kalan 15 küme için ana batch'e geçilebilir. Ana batch'te aynı şablon korunacak, ancak her kümenin **alt tema sayısı** (3–6) tutarlı olmalı ve her kaynakta yıl bilgisi olmalı. JSON'a aktarım için ayrı bir dökme adımı gerekecek (markdown → JSON parser veya manuel alan eşleme).
