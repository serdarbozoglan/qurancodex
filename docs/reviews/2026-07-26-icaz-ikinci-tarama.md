# İ'câz-ı İlmî / Bucaillism — İkinci ve Odaklı Site Taraması

Tarih: 2026-07-26
Denetçi: qc-content-auditor
Çerçeve: CLAUDE.md §13.24 + memory `feedback_quran_supremacy_framing`
Kapsam: (1) `public/bilimsel-isaretler.json` 7 incelenmemiş madde, (2) tool/section başlık+intro metinleri (özellikle `tarihsel-kanitlar.json`), (3) homepage teaser kartları.

> Not: Klasik tefsir/meal metinleri (tefsir-per-verse, meals-multi, verse-metadata, verse-graph-bgem3) kapsam dışı tutuldu. Zaten corrective olan içerik (elestirel-cerceve, i18n `scientificSigns.bucaillismFrame`, i18n `historicalProof` gövdesi) sorun olarak raporlanmadı — bunlar çözümün parçası.

---

## Özet
- Kritik (CİDDİ): 3 bulgu
- Rötuş (ROTUŞ): 8 bulgu
- Teyit (SORUN YOK): geniş liste (aşağıda)

**En kritik gözlem:** İlk tarama i18n `scientificSigns` ve `historicalProof` bölümlerini (HistoricalProof.jsx / ScientificSigns.jsx section'ları) çok başarılı yumuşatmış. Ancak aynı yumuşatma **iki yerde uygulanmamış ve şimdi çelişki üretiyor:**
1. `public/tarihsel-kanitlar.json` **intro/meta** (deep tool `/arac/tarihsel-kanitlar` bunu kullanıyor) — hâlâ "Tarihsel Kanıtlar / Historical Proofs" başlıklı ve "Hâmân'ın hiyeroglifik doğrulanması" gibi düzeltilen madde gövdesiyle çelişen ifadeler taşıyor.
2. `src/sections/TarihselCard.jsx` (homepage kapı kartı) — düzeltilmiş içerikten habersiz eski overclaim'ler + kaynaksız bir "Rosetta Taşı → Hâmân" iddiası.
3. i18n `conclusion.points` — "Tarihsel detayları arkeoloji ile doğrulanıyor" düz iddiası.

---

## Kritik Hatalar (CİDDİ)

### [C1] tarihsel-kanitlar.json intro — düzeltilen madde gövdeleriyle ÇELİŞEN "kanıt/doğrulama/bilinemezdi" çerçevesi
Dosya: `next/public/tarihsel-kanitlar.json > intro`

**Mevcut (TR, `intro.titleTr` + `intro.descTr`):**
> "Tarihsel Kanıtlar — Kur'ân'ın Zaman Ötesi İzleri"
> "…modern arkeoloji ve metin filolojisinin **ancak 19-20. yüzyılda erişebildiği** tarihsel gerçeklerin izlerini taşır: Firavun'un korunmuş bedeni, **Hâmân isminin hiyeroglifik doğrulanması**, Bizans'ın 622 zaferinin önceden bildirilmesi, **İrem şehrinin çöl altındaki keşfi**, Necran katliamının Sabaean yazıtlarında belgelenmesi."

**Mevcut (EN, `intro.descEn`):**
> "…historical realities that modern archaeology and textual philology **could only access in the 19-20th centuries**: Pharaoh's preserved body, **the hieroglyphic verification of Hāmān's name**, … **the discovery of the city of Iram beneath the desert**…"

**Sorun (birden çok YASAK kalıp bir arada):**
- "ancak 19-20. yüzyılda erişebildiği … izlerini taşır" = "7. yy'da bilinemezdi → önceden biliş" argümanının intro seviyesinde uygulanması.
- **"Hâmân isminin hiyeroglifik doğrulanması" doğrudan aynı dosyanın `haman-ismi` maddesiyle çelişiyor.** O madde `confidence: "muhtemel"` ve `criticalNoteTr`: *"'Hâmân = Kur'ân'ın önceden bildiği tarih' iddiası fazla ileri gider … arkeoloji bunu ne ispatlar ne çürütür."* Intro ise "doğrulanma"yı olgu gibi sunuyor.
- "İrem şehrinin çöl altındaki keşfi" — `iram-sehri` maddesi bunu açıkça *"kesin bir sonuç değil, yorum/hipotez düzeyinde"* diyor; intro "keşif" olarak kesinleştiriyor.
- Başlık "Kanıtlar / Proofs" + "Zaman Ötesi İzleri / Time-Traversing Traces" — §13.24 "Kanıt/Mucize yerine Tarihsel Bağlam/Temas Noktaları/İşaretler" yönergesine aykırı. Ayrıca i18n `historicalProof.badge`="Tarihsel İzler" ve navbar `nav.history`="Tarihsel İzler" ile de tutarsız (aynı olgu iki farklı başlıkla).
- İç tutarsızlık: hemen altındaki `intro.methodologyNoteTr` ("Bu tool 'Kur'ân bilimsel olarak öngördü' iddiasında değildir … deterministik ispat olarak değil") descTr'yi çürütüyor. Yani metodoloji notu doğru, desc yanlış.

**Öneri (yön):** `descTr/En` "kanıt/doğrulama/ancak 19-20.yy'da erişilebilen" dilini methodologyNote'un tonuna çek; "Hâmân'ın hiyeroglifik doğrulanması" → "Hâmân isminin tartışmalı bir filolojik paralelliği", "İrem'in keşfi" → "İrem ile ilişkilendirilen Şisr/Ubar buluntuları" gibi ihtimal diline indir. Başlığı "Tarihsel İzler / Temas Noktaları"na hizala (i18n ile tekleştir). Nihai metin GPT onayıyla yazılacak.
**Ciddiyet: CİDDİ.**

---

### [C2] TarihselCard.jsx — kaynaksız "Rosetta Taşı → Hâmân" iddiası + "üç doğrulama"
Dosya: `next/src/sections/TarihselCard.jsx:122` ve `:172`

**Mevcut (TR, satır 122):**
> "…**Hâmân ismi Kur'an'da Firavun'un veziri — 1799'da Rosetta Taşı'na kadar bilinmiyordu.** Rûm 30:2-4 Bizans'ın yenilgisinin ardından zaferini önceden bildirir…"

**Mevcut (EN, satır 122):**
> "…The name Hāmān as Pharaoh's minister in the Quran — **unknown until the 1799 Rosetta Stone.**…"

**Mevcut (kapanış, satır 172):**
> "Firavun · Hâmân · Bizans — üç tartışmalı iz, **üç doğrulama**" / "…three debated traces, **three confirmations**"

**Sorun:**
- **"Hâmân … 1799'da Rosetta Taşı'na kadar bilinmiyordu" iddiasının kaynağı YOK ve yanlış çağrışım kuruyor.** Ne `tarihsel-kanitlar.json > haman-ismi` (Grimme 1904 / Erman-Grapow 1926 kullanır) ne de i18n `historicalProof.haman` (satır 435: Rosetta yalnızca hiyerogliflerin *çözülmesini* sağlayan nötr bir kronoloji noktası) Rosetta Taşı'nı Hâmân'ın "doğrulanması" ile ilişkilendirir. Rosetta Taşı Hâmân ismini bulmadı/doğrulamadı; hiyeroglif okumasını mümkün kıldı. Bu cümle "arkeoloji Kur'an'ın veziri Hâmân'ı doğruladı" izlenimi veriyor — mainstream Mısıroloji'nin **reddettiği** bir iddia (i18n `historicalProof.haman.significance`: *"'tarih bunu kanıtladı' iddiası burada savunulamaz"*). Doğrulanamayan spesifik atıf + düzeltilen içerikle doğrudan çelişki.
- "üç doğrulama / three confirmations" — aynı cümlede "tartışmalı iz" derken "doğrulama" demek kendi içinde çelişik; ayrıca Firavun-kimliği ve Hâmân düzeltilmiş içerikte "doğrulama" değil.

**Öneri (yön):** Rosetta cümlesini tamamen kaldır ya da "Ester'deki Pers Hâmân ile karıştırılıp Kur'an'a anakronizm isnat edildi; bu itiraz da ikna edici değildir" gibi düzeltilmiş çerçeveye çevir. "üç doğrulama" → "üç tefekkür/temas noktası". Eyebrow ("Tarihsel İzler") ve h2 ("Üç İddia · Tarihsel İzler") zaten iyi; sadece gövde+kapanış+CTA ("Tarihsel Kanıtlar Sayfasını Keşfet" → "…Tarihsel İzler…") hizalanmalı.
**Ciddiyet: CİDDİ.**

---

### [C3] conclusion.points — "Tarihsel detayları arkeoloji ile doğrulanıyor"
Dosya: `next/src/i18n/tr.json:655` ve `next/src/i18n/en.json:655`

**Mevcut (TR):** "Tarihsel detayları arkeoloji ile doğrulanıyor"
**Mevcut (EN):** "Its historical details are confirmed by archaeology"

**Sorun:** Düz, kayıtsız-şartsız "arkeoloji doğruluyor" iddiası. §13.24 "arkeoloji Kur'an'ı ispatladı/kanıtladı" YASAK kalıbı. Aynı sitenin `historicalProof.intro`'su (satır 409) tam tersini söylüyor: *"kesin sonuçlardan çok, açık sorular ve tartışmalı paralellikler bıraktı … 'kanıt' olarak değil."* Sonuç bölümündeki bu madde, sitenin kendi düzeltilmiş çerçevesini çürütüyor. (Bir üstteki satır 654 "Bazı ayetleri modern bilimin keşifleriyle paralel okunmaktadır" doğru şekilde yumuşatılmış — kıyas için.)

**Öneri (yön):** "Bazı tarihsel referansları arkeolojik bulgularla ilginç temas noktaları taşıyor" gibi uyum/temas diline çek. TR+EN eş güncellenir.
**Ciddiyet: CİDDİ.**

---

## Orta Düzey / Rötuş Sorunları (ROTUŞ)

### [R1] bilimsel-isaretler.json intro — "ancak son 200 yılda erişebildiği fenomenlere referans içerir"
Dosya: `next/public/bilimsel-isaretler.json > intro.descTr/descEn`
**Mevcut (TR):** "…metinde geçen çok sayıda âyet-i kevniyye, **modern bilimin ancak son 200 yılda erişebildiği** fenomenlere referans içerir."
**Sorun:** Hafif "önceden biliş" çerçevesi. Kartların içinde `bucaillismNote` gömülü olduğu için etki sınırlı, ama intro cümlesi tek başına okununca §13.24 "bilinemezdi → mucize" tonuna yaklaşıyor. "referans içerir" ifadesi de temas'tan çok işaret/öngörü ima ediyor.
**Öneri (yön):** "…modern bilimin son iki yüzyılda derinleştirdiği tabiat olgularıyla temas eden âyetleri…" gibi "temas/uyum" diline indir.
**Ciddiyet: ROTUŞ.**

### [R2] iki-deniz — TEYİT (temiz)
Dosya: `bilimsel-isaretler.json > iki-deniz`
`summaryTr/criticalNoteTr` dengeli: *"Halocline … 'berzah' ifadesinin birebir bilimsel karşılığı değil, onunla uyumlu bir okumadır. 'Kanıt' değil 'uyum' seviyesinde okunmalı."* Klasik tefsir (Râzî) ayrımı korunmuş. **SORUN YOK.**

### [R3] yorunge-hareketi — TEYİT (temiz)
Dosya: `bilimsel-isaretler.json > yorunge-hareketi`
`criticalNoteTr` örnek niteliğinde dengeli: hareketin jeosentrik mi heliyosentrik mi olduğunu ayetin belirtmediğini, klasik yorumun "dönemin bilim standardına göre" olduğunu söylüyor. **SORUN YOK.**

### [R4] yildiz-yol — TEYİT (temiz, hatta anti-Bucaillist)
Dosya: `bilimsel-isaretler.json > yildiz-yol`
Bilinçli olarak overclaim'in tersini yapıyor: *"Bu ayet 'ileri bilim' değil … Kur'ân bilim kitabı olmadığının en iyi kanıtlarından."* (Buradaki "kanıt" bilim-hakem değil, meta-argüman.) **SORUN YOK.**

### [R5] yagmur-dongusu — "modern hydrolojik döngüye tam uyar — hatta yeraltı su rezerv sistemine kadar"
Dosya: `bilimsel-isaretler.json > yagmur-dongusu.summaryTr`
**Mevcut:** "Kur'ân'ın 7. yy'da tarif ettiği süreç … **modern hydrolojik döngüye tam uyar — hatta yeraltı su rezerv sistemine kadar.**"
**Sorun:** "tam uyar" (perfect match) + "hatta … rezerv sistemine kadar" kesinlik/genişletme dili. `criticalNoteTr` sonradan dengeliyor ("Kur'ân öncesi Arap kültüründe de yağmur→pınar biliniyordu") ama summary gövdesi "tam uyum" iddiasını taşıyor. EN'de "fully matches" aynı.
**Öneri (yön):** "tam uyar" → "modern hidrolojik döngüyle dikkat çekici biçimde örtüşür"; "hatta rezerv sistemine kadar" ibaresini yumuşat/çıkar.
**Ciddiyet: ROTUŞ.**

### [R6] ruzgar-dolleme — "büyük uyum" (minör)
Dosya: `bilimsel-isaretler.json > ruzgar-dolleme.summaryTr`
**Mevcut:** "…klasik tefsir 'lavâkih' … 'bulutları döllendiren' olarak yorumladı — **modern meteoroloji ile büyük uyum**." Klasik vs 18.yy botanik katmanı ayrımı `criticalNote`'ta iyi yapılmış.
**Öneri (yön):** "büyük uyum" → "belirgin uyum/örtüşme" (minör ton).
**Ciddiyet: ROTUŞ (düşük).**

### [R7] arı-navigasyonu — başlık/keşif eşleştirmesi ayetin lafzını aşıyor
Dosya: `bilimsel-isaretler.json > arı-navigasyonu`
**Gözlem:** Başlık "Sosyal Böcek Navigasyonu" + `discoveryYear`: "1927 Karl von Frisch arı dansı (waggle dance)". Ancak Nahl 16:68-69'un lafzı arıların *yuva yapması, meyveden yemesi ve yol tutması* hakkında; **arı-arı iletişimi (waggle dance) ayetin konusu değil.** Metin bunu "okumaya elverir" diyerek dikkatli tutuyor ve `criticalNote` "ilham/fıtrî içgüdü" çerçevesiyle dengeli. Yine de başlık + von Frisch keşif tarihi eşleştirmesi, ayette olmayan bir bilimsel bulguyu ("kolektif karar", "dans dili") ayetin yanına koyarak hafif geriye-yükleme yapıyor.
**Öneri (yön):** Başlık/keşif vurgusunu ayetin gerçekten değindiği "ilâhî sevkle (vahiy/ilham) yönlendirilen içgüdüsel davranış" eksenine çek; waggle-dance'i "ilgili modern gözlem" olarak yan not seviyesinde tut.
**Ciddiyet: ROTUŞ.**

### [R8] zerre-agirligi — TEYİT (temiz); minör sınıflandırma notu
Dosya: `bilimsel-isaretler.json > zerre-agirligi`
`criticalNoteTr` net: *"'Zerre = atom' kesin bir modern iddia değil — kelime tarihsel olarak 'gözle görülür en küçük şey.'"* İçerik dengeli. **SORUN YOK.**
Minör (kapsam dışı, F-tipi tutarlılık): `domainId: "astronomi"` — atom ölçeği fizik konusu, astronomi domaine atanmış; içerik doğruluğu değil taksonomi meselesi.

### [R9] LinguisticDNA.jsx — TR/EN asimetrisi: EN'de "historical proof / proven", TR'de "temas noktası / boyut"
Dosya: `next/src/sections/LinguisticDNA.jsx:84-85` (TR) ve `:91-92` (EN)
**TR (satır 84):** "Rûm (Mekkî): … modern okumayla **tarihsel bir teyit/temas noktası** olarak değerlendirilir"
**EN (satır 91):** "Ar-Rum (Meccan): Fulfillment of the Byzantine-Persian prophecy — read in modern scholarship as a **'historical proof' of revelation**"
**TR (satır 85):** "vahyin hem metin (Kitap) hem hayat (İmtihan & Tarih) **boyutu**"
**EN (satır 92):** "revelation **proven** both as text (Book) and lived reality"
**Sorun:** TR düzgün yumuşatılmış ama EN eski overclaim'i ("historical proof", "proven") koruyor — F-tipi TR/EN sapması. §13.24 "kanıt/ispat" science-hakem dili EN'de kalmış. Ayrıca "read in modern scholarship as a 'historical proof'" — modern akademinin Rûm'u "vahyin kanıtı" saydığı yanlış genelleme (akademi kehâneti teolojik değil, tarihsel-tutarlılık olarak okur; bkz. tarihsel-kanitlar.json `rum-kehaneti.criticalNoteTr`).
**Öneri (yön):** EN'i TR ile eşle: "read as a historical touchpoint/consistency" ve "revelation as text and lived reality" (proven'i kaldır).
**Ciddiyet: ROTUŞ.**

### [R10] i18n scientificSigns başlığı — "Bilimin 1.400 Yıl Sonra Keşfettikleri / What Science Discovered 1,400 Years Later"
Dosya: `next/src/i18n/tr.json:311` + `en.json:311`
**Sorun:** Başlık, bilimin Kur'an'dan 1.400 yıl sonra "keşfettiği" çerçevesini kuruyor — hafif "önceden biliş" ima. Gövde (intro + `bucaillismFrame`) bunu güçlü şekilde dengeliyor, dolayısıyla düşük etkili; ama başlık tek başına okununca overclaim tonu taşıyor. `intro` (satır 312) "modern bilimin yüzyıllar sonra keşfedeceği gerçeklere işaret eder" de aynı hafif tonu taşır ama arkasından "dürüstçe sunulmuş bir soru" ile yumuşatılıyor.
**Öneri (yön):** Başlığı "Kur'ân ve Bilim — Temas Noktaları" gibi nötr bir çerçeveye çekmek düşünülebilir (opsiyonel; gövde zaten güçlü). GPT onayına bırak.
**Ciddiyet: ROTUŞ (düşük).**

### [R11] WowFacts "Zaman Esnekliği" — content'te "tam olarak … karşılık gelir", note'ta doğru nüans
Dosya: `next/src/i18n/tr.json:636-637`
**Mevcut (content, 636):** "Ashab-ı Kehf: 300 güneş yılı = 309 ay yılı. **Fark tam olarak güneş-ay takvimi dönüşümüne karşılık gelir.**"
**Note (637):** "solar-lunar dönüşüm **modern bir okumadır**, klasik gelenekte 'mucize' olarak özel olarak vurgulanmaz."
**Sorun:** Content gövdesi "tam olarak karşılık gelir" kesinliğiyle solar-lunar okumayı olgu gibi sunuyor; note ise bunun modern/ihtilaflı olduğunu söylüyor → content/note gerilimi. Rûm kısmı ("önceden bildirdi … 628'de gerçekten galip geldi") kehânet olarak kabul edilebilir (güclü confidence), sorun sadece Ashab-ı Kehf "tam olarak" ibaresi.
**Öneri (yön):** Content'te "Fark tam olarak … karşılık gelir" → "bir yoruma göre güneş-ay yılı farkına denk getirilir" (ihtimal diline). Not zaten doğru.
**Ciddiyet: ROTUŞ.**

---

## Tartışmalı İfadeler (tek görüş olarak sunulmuş) — Ring Composition kümesi

> Bu küme i'câz-ı **ilmî** (bilim/tarih) değil, i'câz-ı **nazm** (edebî-yapısal) alanıdır — bu görevin ana hedefi değil. Ancak görev item-3 HalkaCard'ı açıkça işaretlediği için ve aynı "kesinlik → tasarım" overclaim genresini paylaştığı için rötuş düzeyinde raporlanıyor. Denge notu: ring composition Farrin/Cuypers/Douglas geleneğinde ciddi bir akademik önermedir; tümden reddedilmemeli — sadece "mükemmel/tesadüf değil" kesinliği yumuşatılmalı.

### [T1] HalkaCard.jsx — "tesadüf değil … mükemmel ayna simetrisi"
Dosya: `next/src/sections/HalkaCard.jsx:122`
**Mevcut (TR):** "Fâtiha'nın 7 ayeti **tesadüf değil** — A-B-C-D-C'-B'-A' formülünde **mükemmel ayna simetrisi**."
**Mevcut (EN):** "…are **no coincidence** — **perfect mirror symmetry**…"
**Sorun:** "tesadüf değil → tasarım" + "mükemmel/perfect" kesinlik dili. Ring composition tartışmalı-yorumsal bir yapısal okuma; "mükemmel" ve "tesadüf değil" onu ihtilafsız olgu gibi sunuyor.
**Öneri (yön):** "…dikkat çekici bir ayna simetrisi taşır; birçok araştırmacı bunu bilinçli bir halka kompozisyonu olarak okur." (Farrin atfı kalsın.)
**Ciddiyet: ROTUŞ.**

### [T2] i18n hiddenSymmetry.intro + conclusion.points — "mükemmel ayna simetrisi" / "Yapısı ayna simetrisi oluşturuyor"
Dosya: `tr.json:217` (+ `en.json:217`), `tr.json:652`
**Mevcut (217):** "…**mükemmel bir ayna simetrisi**. A-B-C-MERKEZ-C'-B'-A'." — Devamı çok iyi çerçeveli ("çerçeve yeni değil, adı yeni"; Mary Douglas, Bikaî atfı). Tek sorun açılış cümlesindeki "mükemmel" kesinliği.
**Mevcut (652):** "Yapısı ayna simetrisi oluşturuyor" — düz iddia (sonuç listesi).
**Öneri (yön):** "mükemmel" → "belirgin/çarpıcı"; conclusion maddesini "yapısında ayna simetrileri okunabiliyor" gibi yumuşat.
**Ciddiyet: ROTUŞ (düşük).**

---

## Taranan ve TEMİZ Bulunan Alanlar (teyit)

**bilimsel-isaretler.json — incelenen 7 maddeden temiz olanlar:**
- `iki-deniz` — "kanıt değil uyum" açıkça yazılı. TEMİZ.
- `yorunge-hareketi` — jeosentrik/heliyosentrik nüansı doğru. TEMİZ.
- `yildiz-yol` — bilinçli anti-overclaim. TEMİZ.
- `zerre-agirligi` — "zerre=atom değildir" nüansı net. TEMİZ.
- (`yagmur-dongusu`, `ruzgar-dolleme`, `arı-navigasyonu` → ROTUŞ, yukarıda.)

**Homepage kartları:**
- `BilimselCard.jsx` — "Bu sayfa bir 'bilimsel mucize' iddiası değil" açıkça yazılı. TEMİZ.
- `RitimCard.jsx` — i'câz-ı beyân (edebî), klasik belâgat geleneğine atıflı; bilim-hakem yok. "sui generis / 1.400 yıllık eşsizlik" teolojik-meşru. TEMİZ.
- `SesMimarisiCard.jsx` — "dikkat çekici işitsel doku … bir paralellik" iyi yumuşatılmış; hard-science (amigdala vb.) iddiası yok. TEMİZ.
- `MukattaaCard.jsx` — "anlamı 1.400 yıldır tartışılan … örüntüsü tutarlı"; dürüst, bilim-hakem yok. TEMİZ.

**i18n (çözümün parçası — teyit):**
- `scientificSigns.bucaillismFrame` + `iron/universe/ocean/embryo` tab'ları — Bucaillism eleştirisi, Jacques Cousteau efsanesinin çürütülmesi, Keith Moore bağımsızlık tartışması, "kesin doğrulama değil sınırlı paralellik" — örnek düzeyde dengeli. TEMİZ.
- `historicalProof` gövdesi (pharaoh/haman/rome) — "tuz kristali argümanı reddedilir", "mainstream Mısıroloji kabul etmez", "edna el-ard jeolojik okuması modern apolojetiğe aittir + Yeruşalim -430m değil +750m" gibi dürüst nüanslar. TEMİZ.
- `nav.history` = "Tarihsel İzler", `historicalProof.badge` = "Tarihsel İzler". TEMİZ (yalnız tarihsel-kanitlar.json başlığı bunlarla çelişiyor — bkz. C1).

**tarihsel-kanitlar.json — madde GÖVDELERİ (intro hariç):**
Tüm 10 madde (`firavun-cesedi`, `haman-ismi`, `rum-kehaneti`, `iram-sehri`, `ashabu-uhdud`, `ashabu-kehf`, `karnayn`, `semud-medaini-salih`, `en-yakin-yer`, `kuran-korunmasi`) `criticalNote`'larıyla dengeli; Bucaille metodolojisi açıkça eleştirilmiş; Herodot MÖ 5.yy mumyalama itirazı, "ha-mn-h isim mi unvan mı açık", "Ubar=İrem hipotez", Nabatî/Semûd kronoloji nüansı doğru işlenmiş. `scholars` ve `timeline` de dengeli. TEMİZ. **Yalnızca `intro` bloğu C1'de raporlanan çelişkiyi taşıyor.**

---

## Sistemik Not (yapısal, tek tek madde değil)

Her iki JSON'da da (`bilimsel-isaretler`, `tarihsel-kanitlar`) her maddede bir `discoveryYear` alanı var ve UI'da muhtemelen "ayet ↔ modern keşif tarihi" yan yana gösteriliyor. Bu **yapısal düzen** (ayeti bir keşif yılıyla eşleştirmek) doğası gereği Bucaillist "önce Kur'an söyledi, sonra bilim keşfetti" çerçevesini görsel olarak ima eder — maddeler tek tek dengeli olsa bile. Bu bir düzeltme talebi değil; ancak intro/başlık dili yumuşatılırken bu görsel eşleştirmenin de "keşif tarihi" yerine "modern gözlem/temas" gibi nötr etiketlenip etiketlenemeyeceği GPT incelemesinde değerlendirilebilir.

---

## Genel Değerlendirme

İlk tarama **section-katmanını** (i18n `scientificSigns` + `historicalProof`, ScientificSigns.jsx / HistoricalProof.jsx) örnek düzeyde temizlemiş — bu bölümler artık sitenin en güçlü, en dürüst içerikleri. Sorun, **aynı yumuşatmanın komşu üç yüzeye taşınmamış olması** ve bunun artık görünür çelişkiler üretmesi:

1. **Deep tool intro'su** (`tarihsel-kanitlar.json`) hâlâ "Kanıtlar/Proofs" başlıklı ve "hiyeroglifik doğrulanma / İrem keşfi / 19-20.yy'da erişilebilen" dilini taşıyor — kendi madde gövdeleriyle ve i18n section'ıyla çelişiyor. (C1)
2. **Homepage kapı kartı** (`TarihselCard.jsx`) düzeltmeden habersiz; üstelik kaynaksız "Rosetta → Hâmân" iddiası ve "üç doğrulama" ekliyor. (C2)
3. **Sonuç bölümü** "arkeoloji ile doğrulanıyor" düz iddiasıyla tüm çerçeveyi geri alıyor. (C3)

Bilimsel maddelerin 7'sinin 4'ü temiz, 3'ü (yağmur/rüzgâr/arı) yalnız ton rötuşu istiyor; hiçbiri kritik değil. Ring-composition kesinlik dili (HalkaCard, hiddenSymmetry) ikincil ve kolay yumuşatılır.

**Öncelik sırası:** C1 → C2 → C3 (üçü birbirine bağlı: aynı "tarihsel kanıt/doğrulama" overclaim'inin üç ayrı yüzeydeki kalıntısı; birlikte, TR+EN eş ve GPT onayıyla düzeltilmeli — §13.24 süreç kuralı). Sonra R1/R5/R9 (bilim intro + yağmur "tam uyar" + LinguisticDNA EN drift). Diğer rötuşlar opsiyonel.
