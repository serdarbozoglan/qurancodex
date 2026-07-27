# İ'câz / Apolojetik Aşırılık — Site-Geneli Tarama Raporu

**Tarih:** 2026-07-26
**Denetçi:** qc-content-auditor
**Referans kural:** CLAUDE.md §13.24 (İ'câz-ı İlmî / Bucaillism Çerçevesi)
**Kapsam:** Yalnızca "Kur'an lehine yumuşatılması gereken apolojetik/aşırı-iddialı çerçeveler". Kur'an metni, çeviri, tefsir alıntıları, kelam/fıkıh içeriği doğru kabul edilmiş; meşru dilbilimsel/tarihsel gözlemler raporlanmamıştır.
**Not:** Aktif kod tabanı `next/` workspace'idir; bulgular oradan referanslanmıştır. Hariç tutulan dosyalar (bilimsel-isaretler.json, tarihsel-kanitlar.json, ScientificSigns.jsx + scientificSigns i18n, WowFacts besmele maddesi) taranmadı.

---

## Özet değerlendirme

Site genel olarak §13.24 kuralını **iyi içselleştirmiş**: atlas JSON'larının büyük çoğunluğu (kavimler, yeminler, sunnetullah, doga, semantic-map, historicalProof intro + Hâmân/Bucaille maddeleri, HiddenArchitecture 7-katman + Nur-u Muhammedi notu) örnek düzeyde hedge içeriyor — "kanıt değil uyum", "çağdaş okuma", "klasik tefsir asıldır", fabricated-hadith uyarısı vb. Bu bölümler **SORUN YOK / model** kabul edilebilir.

Sorunlar iki yerde yoğunlaşıyor:
1. **Hero/nav framing'i** — sitenin en görünür üst-metni Kur'an'ı "Kanıt/Proof" çerçevesine oturtuyor (§13.24'ün doğrudan yasakladığı dil).
2. **WowFacts punchline'ları** — kart gövdeleri düzgün hedge edilmiş, ama `wowTr/wowEn` kapanış cümleleri Bucaillist overclaim'i geri getiriyor ("7. yy'da bilinemezdi", "tam uyum", "tasarım").

Ayrıca birkaç section metninde "tesadüf değil → tasarım" ve "sui generis diyor" tarzı design-argument / sayısal-anlam iddiaları var.

---

## CİDDİ

### [C-1] Hero subtitle + nav — "Kanıt/Proof" çerçevesi (site-wide)
- **Dosya:alan:** `next/src/i18n/tr.json:12` (`hero.subtitle`) + `next/src/i18n/en.json:12` + `next/src/i18n/tr.json:7` (`nav.history`)
- **Sorunlu cümle:** TR: `"Dilbilimsel, Matematiksel ve Bilimsel Kanıtlarla"` · EN: `"Linguistic, Mathematical & Scientific Evidence"` · nav: `"Tarihsel Kanıtlar"`
- **Sorun tipi:** 1 + 3
- **Neden:** §13.24 açıkça "Başlık/dil 'Kanıt/Mucize' yerine 'Tarihsel Bağlam / Temas Noktaları / İşaretler'" diyor. Bu, sitenin ilk ekranda gördüğü çerçeve cümlesi; Kur'an'ı "matematiksel + bilimsel kanıt" iddiasına bağlıyor. İlginç olan, hemen altındaki `hero.description` (satır 13) çok daha dengeli ("dilbilimsel, matematiksel ve yapısal katmanlarıyla araştırılan") — subtitle kendi açıklamasıyla bile tutarsız.
- **Etiket:** CİDDİ
- **Yumuşatma yönü:** "Kanıt/Evidence" kelimesini kaldırıp "katmanları / işaretleri / mimarisi" gibi tefekkür-seviyesi bir çerçeveye çek; nav "Tarihsel Kanıtlar" → "Tarihsel İzler / Bağlam" (zaten section içi intro "kanıt olarak değil ... tarihsel izler" diyor — başlık içerikle hizalanmalı).

### [C-2] WowFacts — "Alın: Beynin Yalan Merkezi"
- **Dosya:alan:** `next/src/components/WowFacts.jsx:548-554` (`wowTr/wowEn` + `bodyTr/bodyEn`)
- **Sorunlu cümle:** wow: `"7. yüzyılda alın, beyin nörobilimi bilmeden gösterildi."` / `"In the 7th century, the forehead was pointed to without knowing neuroscience."` — body: `"prefrontal korteks (alnın hemen arkası) yalan söyleme ve ahlaki muhakeme merkezidir. fMRI çalışmalarıyla desteklenmektedir."`
- **Sorun tipi:** 1 + 5
- **Neden:** Gövdede güzel bir `ℹ` notu var (klasik tefsirde nâsiye = rezalet metaforu), ama (a) prefrontal korteksin "yalan söyleme merkezi olduğu ve fMRI'la desteklendiği" nörobilimsel olarak yerleşik bir gerçek değil — fMRI yalan-tespiti tartışmalı bir alandır; (b) `wow` cümlesi tam da §13.24'ün yasakladığı "bu 7. yy'da bilinemezdi → mucize" formülünü aynen kuruyor ve gövdedeki hedge'i geçersiz kılıyor.
- **Etiket:** CİDDİ
- **Yumuşatma yönü:** Nörobilim iddiasını "kesin/desteklenmiş" değil "tartışmalı çağdaş bir yorum" seviyesine indir; wow cümlesini "bilinemezdi → mucize" kalıbından çıkarıp tefekkür/temas noktası diline çevir.

### [C-3] WowFacts — "Parmak Uçları: Benzersiz Kimlik"
- **Dosya:alan:** `next/src/components/WowFacts.jsx:559-565` (`wowTr/wowEn`)
- **Sorunlu cümle:** `"1880'lerde belgelenen, 7. yüzyılda işaret edildi."` / `"Documented in the 1880s. Pointed to in the 7th century."`
- **Sorun tipi:** 1
- **Neden:** Klasik parmak-izi apolojetiğinin (Kıyâme 75:4) tipik Bucaillist retrofiti. Gövdede `ℹ` notu doğru (klasik tefsir: parmak uçları = incelik/yeniden yaratma gücü sembolü), ama wow cümlesi yine "7. yy'da bilim öncesi işaret edildi → mucize" kalıbını kuruyor.
- **Etiket:** CİDDİ
- **Yumuşatma yönü:** Gövdedeki hedge tonunu wow'a da taşı; "işaret edildi (bilim öncesi)" ima yükünü kaldır, gözlemi "çağdaş bir okuma çekiciliği" seviyesinde bırak.

### [C-4] WowFacts — "Ashab-ı Kehf: 300 = 309"
- **Dosya:alan:** `next/src/components/WowFacts.jsx:528-544` (`bodyTr/bodyEn` + `wowTr/wowEn`)
- **Sorunlu cümle:** body: `"300 güneş yılı ≈ 309.017 kamer yılı (yaklaşık 6 gün fark). Kur'an, iki takvimi aynı anda verir."` — wow: `"İki takvim, tek ayette, tam uyum."` / `"Two calendars. One verse. Perfect match."`
- **Sorun tipi:** 1 + 2
- **Neden:** Klasik tefsirin çoğunluğu Kehf 18:25'teki "ya da 309" ifadesini takvim-dönüşümü olarak değil, insanların/ehl-i kitabın ihtilafının aktarımı olarak okur. Güneş↔kamer yıl dönüşümü modern bir apolojetik retrofittir ve "tam uyum / perfect match" ifadesiyle kesin bir sayısal mucize gibi sunulmuş — hiçbir criticalNote yok. Bu, sayfadaki en hedge'siz i'câz-ı adadî iddiası.
- **Etiket:** CİDDİ
- **Yumuşatma yönü:** "Kur'an iki takvimi verir / tam uyum" kesinliğini kaldır; klasik tefsirin baskın okumasını (ihtilafın aktarımı) ekle, takvim paralelliğini "bir çağdaş okuma ihtimali" olarak işaretle.

---

## ROTUŞ

### [R-1] WowFacts — "Hz. Nuh'un 950 Yılı"
- **Dosya:alan:** `next/src/components/WowFacts.jsx:434-435` (`wowTr/wowEn`)
- **Sorunlu cümle:** `"950 yıl — tarihin hiçbir sözlü geleneğinde görülmeyen kesin bir sayı."` / `"a precise figure unmatched in any oral tradition of history."`
- **Sorun tipi:** 6
- **Neden:** Faktüel olarak hatalı: Tekvin/Genesis 9:29 Hz. Nuh'un ömrünü tam **950 yıl** verir — yani sayı başka bir gelenekte birebir mevcut. "Hiçbir sözlü gelenekte görülmeyen" iddiası yanlış. (Not: kart gövdesi "tebliğ süresi" yorumuyla düzgün hedge edilmiş; sorun yalnız wow cümlesinde.)
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "eşi görülmeyen/unmatched" iddiasını kaldır; sayının önceki kutsal metinlerle paralelliğini yok saymayan nötr bir ifadeye çevir.

### [R-2] WowFacts — "Halka Yapısı" wow cümlesi
- **Dosya:alan:** `next/src/components/WowFacts.jsx:248-249` (`wowTr/wowEn`)
- **Sorunlu cümle:** `"Yapı tesadüf değil, tasarım."` / `"Structure, not coincidence — design."`
- **Sorun tipi:** 3
- **Neden:** Ring composition meşru bir yapısal gözlem; ama "tesadüf değil, tasarım" düz bir design-argument sonucunu kesin gerçek gibi veriyor. Aynı konuyu işleyen HiddenArchitecture.jsx callout'u çok daha olgun ("...remains an open question / yanıtsız"). İç tutarsızlık: iki bölüm aynı olguyu farklı kesinlikte sunuyor.
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "tasarım" hükmünü HiddenArchitecture'ın "açık soru / dikkat çekici örüntü" tonuna hizala.

### [R-3] WowFacts — "En Uzun Ayet" (Bakara 2:282)
- **Dosya:alan:** `next/src/components/WowFacts.jsx:216-217` (`bodyTr/bodyEn`)
- **Sorunlu cümle:** `"Modern hukukun temel ilkeleri, 7. yüzyılda ayet olarak inmiş."` / `"The foundational principles of modern law — revealed as a verse in the 7th century."`
- **Sorun tipi:** 1 + 4
- **Neden:** Yazılı sözleşme, tanık, tarafsız kâtip ilkeleri modern hukuka özgü değil; Roma hukuku, Hammurabi vb. çok daha eskiye dayanır. "Modern hukukun temelleri 7. yy'da indi" ifadesi anakronik bir öncelik iddiası kuruyor.
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "modern hukukun temelleri" öncelik imasını kaldır; ayetin muâmelât/adalet detayına verdiği önemi vurgulayan nötr ifade.

### [R-4] SoundArchitecture — "Sesler Tesadüf Değil" + tafhîm/tarqîq eşitlemesi
- **Dosya:alan:** `next/src/i18n/tr.json:99-100` (`soundArchitecture.title` + `.intro`) ve `:201` (`perfectClosingTr`)
- **Sorunlu cümle:** başlık `"Sesler Tesadüf Değil"`; intro `"Bu kontrast tesadüf değil — modern dilbilim buna 'ses sembolizmi' der; klasik İslamî gelenek ise bunu yüzyıllar önce tafhîm ve tarqîq adıyla kodlamıştı."`; kapanış `"Kur'an'ın sesleri rastgele değil — anlamın taşıyıcısı."`
- **Sorun tipi:** 3 + 4
- **Neden:** (a) "tesadüf değil" bir estetik-fonetik gözlemi kesin tasarım hükmüne çeviriyor. (b) tafhîm/tarqîq **tecvid'de harflerin kalın/ince telaffuz kuralıdır** — "azap ayetleri sert ünsüz kullanır" tezi (ses-anlam sembolizmi) DEĞİLDİR. Modern stilistik bir tezi klasik tecvid terimine eşitlemek yanlış temsildir/anakronizmdir. (Not: `partialClosingTr` satır 202 çok güzel hedge ediyor: "Ses ve anlamın bağı her zaman bilinçli değil" — bu ton başlığa da taşınmalı.)
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** Başlık/kapanıştan kesin "tesadüf değil" hükmünü yumuşat; tafhîm/tarqîq'i "ses sembolizminin klasik karşılığı" gibi sunma — ayrı olguları ayır.

### [R-5] SesMimarisiCard — "Bu tesadüf değil"
- **Dosya:alan:** `next/src/sections/SesMimarisiCard.jsx:125`
- **Sorunlu cümle:** `"Bu tesadüf değil — ses ile anlam paralel, fonetik mimarinin parçası."` / `"This is not coincidence — sound and meaning parallel..."`
- **Sorun tipi:** 3
- **Neden:** [R-4] ile aynı design-argument punchline'ının anasayfa kartındaki kopyası.
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "tesadüf değil" kesinliğini "dikkat çekici bir örüntü / işitsel doku" seviyesine indir.

### [R-6] ImpossibleRhythm / RitimCard — "Dilbilimciler sui generis diyor"
- **Dosya:alan:** `next/src/i18n/tr.json:53` (`impossibleRhythm.intro`) + `next/src/sections/RitimCard.jsx:130`
- **Sorunlu cümle:** `"Dilbilimciler buna sui generis (eşsiz, benzersiz tür) diyor. Kur'an'ın dili, edebiyat tarihinde kendi kategorisini yarattı."`
- **Sorun tipi:** 3 (klasik i'câz-ı beyânî'nin seküler dilbilim konsensüsü gibi sunulması)
- **Neden:** "Ne şiir ne düzyazı, eşsiz form" tezi klasik i'câz doktrinidir (sitenin hakkı) — ama bunu jenerik "Dilbilimciler ... diyor" diye seküler akademik bir uzlaşıya atfetmek overclaim'dir. "sui generis" bir dilbilim konsensüs terimi olarak Kur'an için genel kabul görmüş değildir. (Bâkıllânî tanıklığı [T-1] burada zaten var — klasik çerçeveyle sunmak daha dürüst.)
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** İddiayı "seküler dilbilim konsensüsü" yerine klasik belâgat/i'câz geleneğine (Bâkıllânî, Cürcânî) atfet; "Dilbilimciler diyor" genellemesini kaldır.

### [R-7] LinguisticDNA — Havâmîm "istatistiksel anomali" olasılık iddiası
- **Dosya:alan:** `next/src/sections/LinguisticDNA.jsx:224-225` (`DISCOVERIES[1].footnote`)
- **Sorunlu cümle:** `"Rastgele 114 birimlik bir kümede, aynı işaretli 7 birimin kesintisiz dizilme olasılığı istatistiksel olarak bir anomalidir."` / `"...a statistical anomaly."`
- **Sorun tipi:** 2
- **Neden:** Mushaf sıralaması "rastgele bir küme" değildir (tevkifî kabul edilir), dolayısıyla "rastgele dizilimde olasılık" hesabı yanlış bir null-model kurar; "istatistiksel anomali" ifadesi kaynaksız sayısal-mucize imasıdır ("tesadüf olamaz → tasarım").
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "istatistiksel anomali / rastgele olasılık" çerçevesini kaldır; ardışıklığı "dikkat çekici yapısal bir örüntü" olarak nitel dille bırak.

### [R-8] tr.json — "Sabrın 90'dan fazla ayette geçmesi tesadüf değildir"
- **Dosya:alan:** `next/src/i18n/tr.json:1185`
- **Sorunlu cümle:** `"Sabrın 90'dan fazla ayette geçmesi tesadüf değildir."`
- **Sorun tipi:** 2
- **Neden:** Kelime frekansını doğrudan ilahî kasda/anlamlılığa bağlayan i'câz-ı adadî imalı bir cümle ("N kez geçer → tesadüf değil"). Sabrın Kur'an'da vurgulu olması meşru bir gözlem; ama "tesadüf değildir" hükmü frekansı kanıt gibi kullanıyor.
- **Etiket:** ROTUŞ
- **Yumuşatma yönü:** "tesadüf değildir" hükmünü kaldır; "Kur'an sabra belirgin bir ağırlık verir" gibi frekansı-anlamlılığa-çevirmeyen ifade.

### [R-9] tr.json — İnsan için 4 kelime "tesadüf değil, bilinçli sistem"
- **Dosya:alan:** `next/src/i18n/tr.json:703` (`termsSubtitle`)
- **Sorunlu cümle:** `"...bu tesadüf değil, bilinçli bir terminoloji sistemidir."`
- **Sorun tipi:** 3 (minör)
- **Neden:** Dilbilimsel gözlem büyük ölçüde savunulabilir (insân/beşer/ins/nâs nüansı), ama "tesadüf değil, bilinçli sistem" kesin hükmü yine design-argument kalıbı.
- **Etiket:** ROTUŞ (minör)
- **Yumuşatma yönü:** Gözlemi koru, "tesadüf değil" kesinliğini "her biri farklı bir anlam katmanı taşır" ifadesiyle yetinerek yumuşat.

### [R-10] neden-sonuc.json — Big Bang / ısı-ölümü zinciri
- **Dosya:alan:** `next/public/neden-sonuc.json:393` (`note`)
- **Sorunlu cümle:** `"...evren rastgele değil, başlangıcı + sonu + amacı olan bir 'senaryo'. Big Bang + termodinamik ısı-ölümü + eskatolojik yeniden yaratma modern bilimin kavramlarıyla ilişkili sıkça tartışılan bir zincir."`
- **Sorun tipi:** 1 (minör)
- **Neden:** "sıkça tartışılan" hedge'i var ama Kur'ânî kozmolojiyi Big Bang + ısı-ölümü ile "ilişkili" gösteren ve "evren rastgele değil → senaryo" design-argument'ını bilime bağlayan bir çerçeve. §13.24 "Kur'an'ı değişken bilimsel iddiaya bağlamak" uyarısına yakın.
- **Etiket:** ROTUŞ (minör)
- **Yumuşatma yönü:** Bunun "Kur'ânî anlatı + modern kozmoloji arasında kurulan çağdaş bir paralellik" olduğunu, Kur'ânî öngörü iddiası taşımadığını açıkça belirt (yeminler.json:437'deki model ifade gibi).

---

## Tartışmalı İfadeler / Teyit gerek

### [T-1] Bâkıllânî alıntısı — birebir mi, parafraz mı?
- **Dosya:alan:** `next/src/i18n/tr.json:209` (`impossibleRhythm.classicalSource.quoteTr`)
- **Sorunlu cümle:** `"Kur'an'ın nazmı, Arapların kelâmının ne şiirine ne hutbesine ne de seclerine benzer; her birinden ayrı, kendine özgü bir nizamı vardır. Sesin diziminde bile bir mucize taşır."` — atıf: Ebû Bekir el-Bâkıllânî (ö. 1013), *İ'câzü'l-Kur'an*.
- **Sorun tipi:** 6
- **Neden:** Eser adı ve genel tezi (Kur'an nazmının şiir/saj'/hutbeden farkı) doğru ve Bâkıllânî'ye ait. Ancak tırnak içinde **birebir alıntı** olarak sunulan cümlenin, özellikle "Sesin diziminde bile bir mucize taşır" kısmının Bâkıllânî'nin metninden verbatim olduğu **doğrulanamadı** — parafraz/derleme görünümünde. §13.24 "doğrulayamadığın spesifik atfı birebir alıntı gibi sunma" uyarısı geçerli.
- **Etiket:** ROTUŞ (teyit gerek)
- **Yumuşatma yönü:** Birebir kaynak teyit edilene kadar tırnak içi "alıntı" yerine "Bâkıllânî'nin ... yaklaşımı" gibi parafraz çerçevesine al; ya da verbatim pasajı kaynaktan doğrula.

### [T-2] LinguisticDNA — Rûm suresi "vahyin tarihsel ispatı"
- **Dosya:alan:** `next/src/sections/LinguisticDNA.jsx:84` (`GROUPS[0].bullets[3]`)
- **Sorunlu cümle:** `"Rûm (Mekkî): Bizans-Pers savaşı kehanetinin doğrulanması — modern okumayla 'vahyin tarihsel ispatı' olarak yorumlanır"`
- **Sorun tipi:** 1 (hafif) / 3
- **Neden:** "modern okumayla ... olarak yorumlanır" hedge'i var — bu iyi. Ancak yine de "ispat" kelimesi (tırnak içinde de olsa) tekrarlanıyor. Rûm 30:2-4'ün metinde bulunması ve tarihsel gerçekleşme meşru; "ispat" dili §13.24'ün kaçınmayı istediği kelime.
- **Etiket:** ROTUŞ (minör)
- **Yumuşatma yönü:** "ispat" kelimesini "tarihsel teyit/temas noktası" gibi bir ifadeyle değiştir; hedge zaten yeterince iyi.

---

## Model / SORUN YOK (referans için — değiştirilmemeli)

Aşağıdakiler §13.24'ün "doğru çerçeve"sinin başarılı örnekleridir; korunmalı ve diğer bulguların yumuşatılmasında **şablon** alınmalıdır:

- `next/src/sections/HiddenArchitecture.jsx:521-524` — ring composition callout; klasik münâsebât geleneğini (Bikâî, Suyûtî, Râzî) doğru anıyor, modern katkıyı "şematik dile çevirme" ile sınırlıyor, "açık soru" ile kapatıyor. Anakronizm yok.
- `next/src/sections/HiddenArchitecture.jsx:130-131, 168-169, 627-631` — 7-katman fizik notu ("çağdaş okuma, klasik tefsirde yer almaz; yaratılan ↔ Yaratıcı Nûr ayrımı"), Nur-u Muhammedi'nin uydurma hadis (mevzû) uyarısı, 4-katman klasik taksonomi disclaimer'ı.
- `next/src/i18n/tr.json:409, 432, 440` (`historicalProof.*`) — Firavun/Hâmân/Rûm'u açıkça "kanıt olarak değil, eleştirel tarihsel izler" diye sunuyor; Bucaille'ı ismen anıp akademik Mısıroloji'nin reddini belirtiyor; "tarih Kur'an'ı doğruladı" iddiasının savunulamaz olduğunu söylüyor.
- `next/src/sections/BilimselCard.jsx:122` — "Bu sayfa bir 'bilimsel mucize' iddiası değil".
- `next/public/yeminler.json:437` — "modern bilimin kavramıyla paralel kurmak çağdaş bir okumadır, Kur'ânî öngörü iddiası taşımaz."
- `next/public/semantic-map.json:6063` — "modern bilim-Kur'ân spekülasyonuna girişilmemiştir."
- `next/public/kavimler.json:423` — Uhdud/Zü Nüvâs; akademik kaynaklar + "Kur'an metninin bu spesifik olaya işareti akademik açıdan kesin değildir".
- `next/public/sunnetullah-atlasi.json:1184` — Firavun cesedi/Ramesses II mumyası; "klasik ulema ihtiyatla değerlendirir; kimlik meselesi arkeolojik tartışmaya bırakılır".
- `next/src/components/WowFacts.jsx:601-609` (Duhân/zerre/atom) — "Bu paralellikler felsefî gözlemdir; Kur'an'ın bilimsel teori öngördüğü iddiası taşımaz."
- `next/src/sections/ZeroRedundancy.jsx:224-231` — tekrîr'i doğru şekilde klasik belâgata (Zerkeşî, el-Burhân) atfediyor, anakronizm yok.
- `next/src/i18n/tr.json:202` (`partialClosingTr`) — "Ses ve anlamın bağı her zaman bilinçli değil" (bu ton [R-4]/[R-5]'e taşınmalı).

---

## Öncelik özeti

| # | Yer | Tip | Etiket |
|---|-----|-----|--------|
| C-1 | Hero subtitle + nav "Kanıt" | 1,3 | CİDDİ |
| C-2 | WowFacts "Alın / prefrontal korteks" | 1,5 | CİDDİ |
| C-3 | WowFacts "Parmak uçları" | 1 | CİDDİ |
| C-4 | WowFacts "Ashab-ı Kehf 300=309" | 1,2 | CİDDİ |
| R-1 | WowFacts "Nuh 950 yıl / eşi görülmemiş" | 6 | ROTUŞ |
| R-2 | WowFacts "Yapı tasarım" | 3 | ROTUŞ |
| R-3 | WowFacts "modern hukukun temelleri 7. yy" | 1,4 | ROTUŞ |
| R-4 | SoundArch "Sesler tesadüf değil" + tafhîm/tarqîq | 3,4 | ROTUŞ |
| R-5 | SesMimarisiCard "tesadüf değil" | 3 | ROTUŞ |
| R-6 | ImpossibleRhythm/RitimCard "sui generis diyor" | 3 | ROTUŞ |
| R-7 | LinguisticDNA "istatistiksel anomali" | 2 | ROTUŞ |
| R-8 | tr.json "sabr 90+ ayet tesadüf değil" | 2 | ROTUŞ |
| R-9 | tr.json "insan 4 kelime tesadüf değil" | 3 | ROTUŞ (minör) |
| R-10 | neden-sonuc Big Bang zinciri | 1 | ROTUŞ (minör) |
| T-1 | Bâkıllânî alıntısı verbatim mı | 6 | teyit gerek |
| T-2 | LinguisticDNA Rûm "ispat" | 1,3 | ROTUŞ (minör) |

**Tekrarlayan kalıp:** WowFacts kart gövdeleri hedge'li ama `wowTr/wowEn` punchline'ları overclaim'i geri getiriyor (C-2, C-3, R-1, R-2). Ve site genelinde "tesadüf değil → tasarım" (R-2, R-4, R-5, R-8, R-9) tek bir editoryal tercih olarak yayılmış — tek seferde bir stil kararıyla yumuşatılabilir.

**Hiçbir dosya değiştirilmedi** — bu yalnızca rapordur. Nihai metinler §13.24 süreci gereği GPT-5.2 hakem onayıyla, TR+EN eş güncellenerek yazılmalıdır.
