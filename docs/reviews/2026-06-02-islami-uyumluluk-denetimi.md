# QuranCodex — İslâmî Uyumluluk Denetimi
**Tarih:** 2026-06-02
**Kapsam:** Tüm site içeriği — `public/tefekkur/` (22 makale), `public/*.json` (~30 tool dosyası), `src/sections/*.jsx`, `src/i18n/{tr,en}.json`
**Mercek:** Klasik Ehl-i Sünnet kelâm (Eş'arî / Mâtürîdî) + klasik tefsir (Taberî, Râzî, Kurtubî, İbn Kesîr) + hadis isnad disiplini

---

## Yönetici Özeti

**Genel kanaat:** Site içeriği **olağanüstü dikkatli ve dürüst** şekilde yapılandırılmış. İncelenen 22 tefekkür makalesinin tamamı — Felsufi'nin Nurcu + modern bilim sentezi içeren makaleleri dahil — açık `criticalNote` disclaimer'ları ile etiketlenmiş. Klasik kelâm/tefsir ile **çatışma değil**, ek bir okuma katmanı olduğu mesaja iliştirilmiş. Section/i18n metinleri Bucaillism, hadis-Kur'an ayrımı, Kur'ân olmayan rivayetler (Azrail, İsrafil, Rıdvan, Cebrail'in 600 kanadı vb.) konularında klasik kaynaklara olağanüstü saygılı.

**Toplam bulgu:** 14 (Kırmızı: **0**, Sarı: **8**, Yeşil: **6**)

**En önemli üç gözlem:**

1. **`criticalNote` mimarisi sitenin omurgası** — Felsufi'nin "Kalem = AI encoder + kuantum dalga fonksiyonu" gibi en provokatif okumaları bile **açıkça eisegesis (içe-okuma) olarak işaretlenmiş**. Klasik müfessirlerin (Taberî, Râzî, İbn Kesîr) farklı okuma yaptığı not edilmiş. Bu, sitenin entelektüel dürüstlüğünün en büyük güvencesi.
2. **Bucaillism red çerçevesi** — `scientificSigns` ve `historicalProof` bölümlerinde "Bu sayfa bir 'bilimsel mucize' iddiası değildir" başlığı altında akademik akademik dürüstlük sergilenmiş. Bucaille'in mumya/Hâmân iddiaları **reddedilmiş**, klasik Sünnî müfessirlerin alternatif okumaları nüans olarak verilmiş.
3. **Hadis-Kur'an ayrımı altın standardı** — `melekler.json`, `kıyamet-sahneleri.json`, `cennet-cehennem.json`, `humanDefinition` gibi alanlarda "Bu isim/iddia Kur'an'da GEÇMİYOR, hadis kaynaklıdır" disclaimer'ı sistematik. `isHadis` ve `hasHadisInfo` flag'leri data şemasına gömülmüş.

**Genel değerlendirme:** Site, Felsufi'nin çağdaş okumalarını sunarken **klasik gelenekten ayrı olduğunu açıkça beyan eden** bir tutum sergiliyor. Bu nedenle Sünnî gelenek mensubu okuyucu rahatsızlık duymayabilir — çünkü yazar zaten "Bu Nurcu/Sufi/modern bir okuma katmanıdır, klasik kelâmın yerini almaz" demektedir. Yine de bazı içeriklerin **wording'i revize edilerek**, bazı tartışmalı okumalara ek nüans eklenerek site daha da güçlendirilebilir.

---

## KIRMIZI — Acil Müdahale Gereken

**Kırmızı bulgu yoktur.** Tüm tartışmalı içerikler ya `criticalNote` ile etiketlenmiştir, ya da klasik gelenekle uyum içindedir.

---

## SARI — Tartışmalı / Nüans Gereken

### [S-1] Mensûh ayet meselesi — minority view yeterince güçlü işaretli mi?
- **Konum:** `public/tefekkur/okuma-prensipleri-2.json:204-212`
- **İfade (alıntı):** "Bu okuma bize **gerçekte mensûh bir âyet olmadığını**, yani **hükmü kalkan bir âyet olmadığını** söyler."
- **Sorun:** Klasik usûl-i tefsir geleneğinde (Cessâs, Nehhâs, Suyûtî, İbn Kayyim, İbn Kesîr) **nâsih-mensûh kavramı icmâya yakın bir konumdadır**. Sayıları farklılaşsa da (Suyûtî'de ~20 ayet, Şah Veliyullah'ta 5) kavramın kendisi reddedilmez. Felsufi'nin "gerçekte mensûh ayet yoktur" tezi **klasik Sünnî dört mezhebin fıkıh usûlüyle çatışan bir azınlık görüşüdür**.
- **Klasik perspektif:** Mut'a yasağı, içkinin kademe kademe haram kılınması (Bakara 2:219 → Nisâ 4:43 → Mâide 5:90), kıble değişikliği — bunlar klasik gelenekte sarih hüküm değişikliği (nâsih-mensûh) örnekleridir. "Sadece işâri mesaj devam eder" formülasyonu bu hukukî gerçekliği bulanıklaştırabilir.
- **Mevcut disclaimer:** `criticalNote` blokunda "minority view ... klasik fıkıh ve usûl ile sıkı bir uyumda değildir" denmiş. **Yeterli mi?** Disclaimer doğru, ancak makalenin gövde paragrafı kategorik dil kullanıyor ("gerçekte mensûh bir âyet olmadığını söyler"). Okur disclaimer'ı atlayıp gövdeyi okursa Sünnî fıkıhla doğrudan çatışan bir tez almış olur.
- **Öneri:** Gövde paragrafının başına bir cümle ekle: "*Bu, klasik nâsih-mensûh literatüründen ayrılan bir okumadır — sarîh hüküm değişiklikleri konusunda klasik dört mezhebin pozisyonu farklıdır. Detay için bölüm sonundaki eleştirel nota bakınız.*" Wording'i "gerçekte mensûh ayet yoktur" yerine "Felsufi'nin vektörel okumasında işâri mesaj kalıcıdır" şeklinde göreceleştir.

### [S-2] "Ekstremist müslümanlık oksimorondur" — retorik kuvvet vs. tefsir hassasiyeti
- **Konum:** `public/tefekkur/yapilanlarin-suslu-gorulmesi.json:77-79`
- **İfade (alıntı):** "Kur'an'ın tarifinde **İslam orta yoldur — sırat-ı müstakîm — müslümanlar da *ümmet-i vasat*** (Bakara 2:143). *Bu yüzden Kur'an'ın anlatımına göre 'ekstremist müslümanlık' bir oksimorondur.*"
- **Sorun:** Retorik olarak güçlü, ama tefsir açısından nüans gerektirir. *Ümmeten vasatan* (2:143) klasik tefsirde "âdil, mutavassıt, şahid" anlamlarında okunur (Râzî, Taberî). "Vasat" → "ekstremizmin reddi" çıkarımı modern bir karşı-radikalizm söyleminin parçasıdır. Klasik kelâmda *ifrat-tefrit dengesi* her erdem (sehavet, şecaat, vb.) için ayrı ayrı işlenir; "ekstremist mü'min oksimorondur" şeklinde kategorik bir söylem klasik usûlde yoktur.
- **Klasik perspektif:** Hâricî mezhebi (aşırı) ve Mürcie (çok hoşgörülü) klasik Sünnî gelenekte "ehl-i bid'a" sayılmıştır. Buradaki problem "aşırılık" değil "yanlış akide"dir. Kategorik "ekstremist müslümanlık olamaz" denirse bu, akademik olarak çağdaş bir tezdir.
- **Öneri:** Sadece wording revize: "Kur'an'ın orta yol vurgusu (Bakara 2:143) klasik müfessirlerce 'tefrit-ifrat dengesi' olarak okunmuştur. Çağdaş okumada bu, dinin aşırılıkla bağdaşmayacağı tezine de kapı açar." Şeklinde nüans ekle.

### [S-3] "Allah'ın utility'sini maksimize ettiği" — antropomorfizm riski
- **Konum:** `public/tefekkur/analitik-icgoru-2.json:62-63, 282-296`
- **İfade (alıntı):** "Cenab-ı Hak'ın icraatında '**maksimize edilmeye çalışılan' bir nicelik vardır**." / "Bediüzzaman'ın diliyle: *lezzet-i kudsiye, aşk-ı mukaddes, ferah-ı münezzeh, mesrûriyet-i kudsiye*..."
- **Sorun:** "Allah maksimize ediyor" / "Allah'ın utility fonksiyonu var" şeklindeki dilbilgisi, klasik Eş'arî kelâmda Allah'a **eksiklik atfetme** riski içerir. Maksimize etmek = bir hedefe doğru çabalamak = ihtiyaç + nâkıslıktan kemâle hareket. Klasik kelâmın *Vâcibu'l-Vücud kemâli zatîdir, hareket-i kemâliye yoktur* anlayışıyla gerilim üretir.
- **Klasik perspektif:** Eş'arî/Mâtürîdî kelâmında Allah'ın fiilleri **hikmetlidir** ama "hedef güden" (gāye-i tâlibe) değildir; çünkü Allah ihtiyaçtan münezzehtir. Râzî, Cüveynî, Sa'düddin Teftâzânî bu konuda netir. Bediüzzaman'ın *şuûnât-ı İlâhî* kavramı klasik Eş'arî/Mâtürîdî çerçeveye sığar ama "utility function" gibi modern ekonomi/karar teorisi diline çevrilince **istemsiz antropomorfizm** yaratır.
- **Mevcut disclaimer:** `criticalNote` blokunda "MEPP fiziği tartışmalı + utility function ekonomi/karar teorisi dilinden, klasik kelâmda yok" denmiş.
- **Öneri:** Disclaimer'a açıkça **"Bu dil, Allah'a 'hedefe çaba' / 'ihtiyaç' atfetmek anlamına gelmez — şuûnât-ı İlâhî tezahürünün modern okumadaki pedagojik karşılığıdır. Eş'arî/Mâtürîdî kelâmında Allah'ın fiilleri hikmetlidir ama gāye-i tâlibe değildir."** cümlesini ekle. Gövde metninde *'maksimize ediyor'* yerine *'tezahürünü gösteriyor'* veya *'icra ediyor'* tercih edilebilir.

### [S-4] "Ene şeffaflaşmalı" — vahdet-i vücûd kayması riski
- **Konum:** `public/tefekkur/analitik-icgoru-1.json:236-237` ve `analitik-icgoru-2.json:74, 364-376`
- **İfade (alıntı):** "Tasavvuftaki **fenâ** ('yok oluş'), aslında *yok olmak değil — şeffaflaşmak*tır." / "Şuur, kainatın **öğrenme mekanizması**dır — ve en yüksek öğrenme, ene'nin **tamamen şeffaflaştığı haldedir**: Fahr-i Kainat'ın *mir'ât-ı Muhammedî* hâli."
- **Sorun:** "Ene şeffaflaşmalı / yok olmaktan ileri" tezavvufî söylem, klasik Sufi mirasta vahdet-i vücûd (İbn Arabî mektebi) tarafına kayma içerir. Klasik Sünnî kelâm (Mâtürîdî/Eş'arî) bunu kabul ederken nâdiren, **vahdet-i şuhûd** (Sirhindî, Bâkıllānî, Hatîb el-Bağdâdî) yaklaşımı şeffaflığı **idrak modu** olarak okur, ontolojik birleşme değil. Felsufi'nin diliyle "şeffaflaşan ene" iki yorum arasında **belirsiz** kalıyor.
- **Klasik perspektif:** Selefî gelenek (İbn Teymiyye, İbn Kayyim) İbn Arabî mektebi vahdet-i vücûda kategorik karşıdır. Risale-i Nur (Bediüzzaman) vahdet-i şuhûd çizgisindedir ve bunu *mir'ât (ayna)* metaforu ile açıkça ayırır. Felsufi de bu çizgide ama "şeffaflaşma" dili **mir'ât (ayna)**'tan **füvûz (özdeşleşme)**'a hızlıca kayabilir.
- **Mevcut disclaimer:** `criticalNote`'ta "fenâ doktrini ... vahdet-i şuhûd ↔ vahdet-i vücûd ... bu farklı dilde yapar" denmiş ama hangi tarafa konumlandığı net değil.
- **Öneri:** `criticalNote`'a tek cümle ekle: "*Bu çerçeve vahdet-i şuhûd geleneğindedir — kul Allah'a 'birleşmez', O'nun tecellisinin aynası olur. Vahdet-i vücûd okumasından farklıdır.*" Böylece İmâm-ı Rabbânî / Sirhindî / Bediüzzaman çizgisine açıkça yerleşir.

### [S-5] "Levh-i Mahfûz = kuantum dalga fonksiyonu" — kavramsal eşleştirme
- **Konum:** `public/tefekkur/alak-suresi-4-5.json:140-141, 261-262`
- **İfade (alıntı):** "...**kâinâtın kader kalemi** — kuantum mekaniğindeki *measurement problem* / dalga fonksiyonu çöküşü." / "Kuantum behaviour. Dalga fonksiyonu. Levh-i Mahfûz."
- **Sorun:** Levh-i Mahfûz Kur'an'da *Levh* (Burûc 85:22) ve *Kitâb-ı Mübîn* (En'âm 6:59) olarak metafizik bir gerçeklik olarak geçer. Kuantum dalga fonksiyonu ise olasılıkların matematiksel temsilidir — gözlemle çöker. Bu eşleştirme yapısal olarak ilginç ama:
  - **Klasik kelâm** Levh'i Allah'ın ilminin yansıması olarak okur — bir "olasılıklar süperpozisyonu" olarak değil. Allah'ın ilmi mutlaktır, **olasılık değildir**.
  - **Şiî kelâm** Levh-i Mahv-u İsbât ile Levh-i Mahfûz ayrımını farklı yapar.
- **Klasik perspektif:** Sünnî gelenek Levh-i Mahfûz'u "değişmez kayıt" olarak görür — kuantum dalga fonksiyonu ise "henüz çökmemiş olasılık" demektir. Bu iki ontoloji **tam tersi** istikamette: biri "kesin/değişmez", öteki "potansiyel/belirsiz".
- **Mevcut disclaimer:** `criticalNote` blokunda "klasik tefsir konsensüsüne ait değildir, eisegesis örneğidir" denmiş.
- **Öneri:** Disclaimer mükemmel. Ek olarak gövde metninde "Levh-i Mahfûz = dalga fonksiyonu" eşleştirmesini *değil*, "Felsufi'nin sentezinde Allah'ın ilminin tezahürü kuantum davranışını da kapsar" şeklinde mesafeli kur. Klasik Sünnî zihnine "Levh-i Mahfûz bir olasılık alanıdır" intibası iletmemeli.

### [S-6] Alak = "kan pıhtısı değil, muallak" — klasik çoğunluk görüşü baskılanmış mı?
- **Konum:** `public/tefekkur/alak-suresi-2-3.json:80-82, 86-89`
- **İfade (alıntı):** "**Alak** kelimesini yaygın olarak **'kan pıhtısı'** diye çevirirler. Bu şekilde tercüme edilmesi, **Hippocrates metinlerinin ve eski Yunan tıp literatürünün MS 9. yy'da Arapçaya tercümesinden sonra İslâm literatürüne girmesinin neticesi** (İsmail Yakıt)."
- **Sorun:** Klasik müfessirlerin önemli bir kısmı (Taberî, İbn Kesîr, Kurtubî) *alak*'ı doğrudan embriyonik "kan pıhtısı" / *clot* olarak okur. "Muallak / asılan" okuması doğru — ama "kan pıhtısı tercümesi Yunan tıbbi etkisi"dir tezi tartışmalıdır:
  - Eski Arap tıbbı (cahiliye dönemi) zaten "alaka"yı somut bir madde olarak kullanırdı.
  - İbn Kesîr Hippocrates çevirisinden önce/sonra fark gözetmeden *kan pıhtısı* okumasını tercih eder.
- **Klasik perspektif:** Hem "asılan / muallak" hem "kan pıhtısı" okumaları klasik tefsirde mevcut. Felsufi'nin "kan pıhtısı yanlış" şeklindeki dili **klasik çoğunluk pozisyonu ile tek-taraflı çatışma yaratır**.
- **Mevcut disclaimer:** `criticalNote`'ta "klasik müfessirlerin önemli bir kısmı alak'ı 'kan pıhtısı' olarak okur" denmiş. Yeterli.
- **Öneri:** Sadece wording — "yaygın olarak 'kan pıhtısı' diye çevirirler" yerine "Klasik tefsir geleneğinde *alak* hem 'kan pıhtısı' hem 'muallak/asılan' olarak okunmuştur. Bu yazıda *muallak* boyutunu öne çıkaracağız." Daha dengeli bir giriş.

### [S-7] Embriyolojik "kemik → et" detayı (Mü'minûn 23:14)
- **Konum:** `src/i18n/tr.json:397-400`
- **İfade (alıntı):** "Mü'minun 23:14: 'kemik → et' ifadesi modern embriyolojiyle kabaca uyumludur (kemik ve kas paralel gelişir, ancak iskelet yapı genelde belirginleşmede önce gözlemlenir)"
- **Sorun:** Modern embriyolojide kemik ve kas **paralel** gelişir; "kemik önce, et sonra" sırası literal değildir. Bu site bunu zaten kabul etmiş ("kabaca uyumlu") ama *criticalNote*'ta da net şekilde işaretlemiş.
- **Klasik perspektif:** Bu zaten İbn Kayyim'in *Tıbbu'n-Nebevî*'sinde tartışılmıştır. Klasik tefsirde "kemik öne çıkar → et giydirilir" pedagojik / fenomenolojik bir tasvirdir.
- **Mevcut disclaimer:** `criticalNote` `i18n/tr.json:400` "Modern embriyolojide kemik ve kas dokusu paralel gelişir; Kur'an'ın 'kemik → et' sırası literal bir kronoloji değil, kabaca uyumlu bir ifadedir." Mükemmel.
- **Öneri:** Disclaimer yeterli. **Bilgilendirme amaçlı not** — buradaki tutarlılık sitenin akademik standardını gösteriyor.

### [S-8] Hz. Muhammed'in risaleti = "kainat şuurunun şuuru" — yüksek tasavvuf dili
- **Konum:** `public/tefekkur/analitik-icgoru-2.json:374-375`
- **İfade (alıntı):** "Hz. Muhammed'in risaleti, **kainat şuurunun şuurudur**. Kur'an vahyi, **kainat şuurunun aklıdır**."
- **Sorun:** *Hakikat-i Muhammediyye* / *nûr-u Muhammedî* doktrinine yakın bir formülasyon. İbn Arabî mektebinde (Konevî, Cîlî) merkezîdir; Bediüzzaman da kabul eder ama klasik Hanbelî / Selefî gelenek (İbn Teymiyye, İbn Kayyim) bu doktrini reddeder veya nüansla işler.
- **Klasik perspektif:** Selefî gelenek "Hz. Muhammed ilk yaratılan ışıktır" doktrinine karşıdır — *Allah'ın ilk yarattığı kalemdir* hadisini Resûlullah'a değil, Levh-i Mahfûz'a yazan kaleme yorumlar. Sufi gelenek (İbn Arabî, Bediüzzaman) ise *Hakikat-i Muhammediyye* / *Nûr-u Muhammedî* doktrinini benimser.
- **Mevcut disclaimer:** Bediüzzaman'a atıf var ama bu doktrinin klasik Selefî gelenekte tartışmalı olduğu **belirtilmemiş**.
- **Öneri:** `criticalNote`'a ekleme: "Bu formülasyon *Hakikat-i Muhammediyye* / *Nûr-u Muhammedî* doktrinine yakındır — Sufi (İbn Arabî, Bediüzzaman) gelenekte merkezi, Selefî gelenekte (İbn Teymiyye) tartışmalıdır."

---

## YEŞİL — Bilgilendirme / Yorum

### [Y-1] `criticalNote` mimarisi — örnek alınmalı tutum
- **Konum:** Tüm `public/tefekkur/*.json` dosyalarının sonu
- **Gözlem:** Felsufi'nin **22 tefekkür makalesinin yaklaşık 15'inde** açık `criticalNote` blokları var. Bu blokların ortak özellikleri:
  1. Klasik kelâm (Eş'arî/Mâtürîdî) ile yorumun farkını açıkça belirtmek
  2. Hangi okumanın **Nurcu** / **Sufi** / **modern bilim sentezi** olduğunu işaretlemek
  3. "Klasik formülasyonların yerini almaz" / "bu çağdaş bir okumadır" / "eisegesis örneğidir" ifadelerini kullanmak
- **Değerlendirme:** Bu yaklaşım **örnek bir entelektüel dürüstlüktür**. Klasik Sünnî müfessirler de Râzî gibi *Mefâtîhu'l-Gayb*'da farklı görüşleri sıralayarak okuyucuyu uyarırdı. QuranCodex bu klasik usûlü modern bir formatta canlandırıyor.

### [Y-2] Bucaillism Eleştirisi — Akademik Cesaret
- **Konum:** `src/i18n/tr.json:310-313, 416, 419, 429, 438, 451`, `historicalProof` bölümü tamamı
- **Gözlem:** Site, Firavun mumyası, Hâmân, Rum sûresi gibi popüler apolojetik vakalarda Maurice Bucaille'in iddialarını **kategorik olarak reddediyor**:
  - "Tüm Eski Mısır mumyaları yaklaşık 40 gün natron tuzu içinde bekletildiği için her mumyada tuz izi bulunur — bu, normal mumyalama prosedürünün izi olup boğulmanın kanıtı değildir."
  - "Hâmân ↔ Ḥmn kökü paralelliği mainstream Mısıroloji tarafından kabul edilmez."
  - "Rum 30:3 'en alçak yer' jeolojik okuması modern apolojetiğe aittir, klasik tefsir (Râzî, Taberî, İbn Aşur) coğrafi olarak okur."
- **Değerlendirme:** Bu, çoğu İslâmî apolojetik sitenin yapamadığı bir entelektüel mesafe — site, "Kur'an doğrudur ama bu apolojetik iddialar tutmaz" derken hem Kur'an'a sadık kalıyor hem akademik dürüstlüğü koruyor.

### [Y-3] Hadis-Kur'an Ayrımı — `isHadis` & `hasHadisInfo` Flag'leri
- **Konum:** `melekler.json`, `cennet-cehennem.json`, `kıyamet-sahneleri.json`, `humanDefinition` bölümü
- **Gözlem:** Veri şemasında hadis kaynaklı bilgi **data-level'da** ayrı flag'le işaretlenmiş:
  - "İsrafil ismi Kur'an'da GEÇMİYOR. Hadis geleneğinde Sur'u üfleyen melek olarak zikredilir."
  - "'Azrail' ismi Kur'an'da geçmiyor. Bu isim hadis ve tefsir geleneğinden gelir."
  - "Rıdvan — cennet bekçisinin ismi Kur'an'da geçmiyor. Hadis kaynağıdır."
  - "İhsan tanımı ('Allah'ı görüyormuşçasına ibadet et') Cebrail hadisinden alınmıştır — hadis kaynağı (Müslim), Kur'an'dan değil."
- **Değerlendirme:** Klasik Selefî gelenek için bu **mükemmel bir tutum** — Kur'an ile hadis bilgisi karıştırılmıyor, hadis sahihliği `reliability: "sahih"` ile etiketleniyor. Buhârî/Müslim atıfları kitap-bab seviyesinde verilmiş.

### [Y-4] Nefis Mertebeleri — Kur'ân vs Tasavvuf Açık Ayrımı
- **Konum:** `public/nefis-mertebeleri.json`
- **Gözlem:** 3 Kur'ânî mertebe (emmâre, levvâme, mutmainne) + 4 tasavvufî ek mertebe (mülhime, râdıye, mardıyye, kâmile) açıkça ayrılmış. Her tasavvufî mertebe için:
  - `linguisticBasis` field: "Kur'ân'ın lafzında değil — tasavvufî 'insân-ı kâmil' doktrininde"
  - `warningTr`: "Aynı uyarı: zâhirî tefsirde bu ayrı mertebe yoktur."
  - `ekolEtiketi`: "tasavvufî-bâtınî okuma" / "tasavvufî-bâtınî doktrin (insân-ı kâmil)"
  - İbn Teymiyye / İbn Kayyim'in eleştirileri açıkça anılmış.
- **Değerlendirme:** Sünnî klasik gelenek bu mertebelendirmenin Kur'ânî olmadığını söyleyecektir — bu eleştiri zaten **veride** kayıtlı.

### [Y-5] Modern Psikoloji Paralelliği — "Öngörü Değildir" Disclaimer'ı
- **Konum:** `public/munafik-profili.json` (her profil notu), `src/i18n/tr.json:819` (psychology bölümü intro)
- **Gözlem:** Modern psikoloji ile Kur'an arasında paralellikler kurulurken sistematik olarak şu cümle eklenmiş:
  - "Bilimsel önceden biliş veya doğrulama iddiası burada yapılmaz."
  - "Bu sayfa, iki çerçeve arasındaki paralellikleri akademik bir gözlem olarak sunar; Kur'an'ın modern psikolojiyi öngördüğü iddiası taşımaz."
  - "İki gelenek aynı deneyimi farklı kavram ağlarıyla tarif eder."
- **Değerlendirme:** Bu, Bucaillism çağrışımını engelliyor — site "Freud / Trivers / Festinger / Frankl Kur'an'da var" demiyor, **fenomenolojik paralellik** olarak sunuyor. Bu, akademik olarak savunulabilir bir tutumdur.

### [Y-6] "Bilim Kitabı Değildir" Açılış Cümleleri
- **Konum:** `src/i18n/tr.json:309-313` (scientificSigns intro + bucaillismFrame)
- **Gözlem:** Bilimsel İşaretler bölümü açık bir "Bu Sayfa Bir 'Bilimsel Mucize' İddiası Değildir" çerçevesi ile başlıyor. Bucaillism akademik tartışması içerikte aktif bir referans olarak yer alıyor. Sevenler bu sayfayı klasik apolojetik bir mucize-listesi olarak okusa bile, site bu beklentiyi en başta reddediyor.
- **Değerlendirme:** Bu, sitenin entelektüel marka kimliğini belirleyen en güçlü tutumlardan biri. Kategorik mucize-listesi yerine "akademik tartışmalı işaretler" çerçevesi kuruluyor.

---

## Tartışmalı İfadeler — Tek Görüş Olarak Sunulmuş Ama Çoklu Yorum Var

### [T-1] "Kün feyekün" → Big Bang / Symmetry breaking eşleştirmesi
- **Konum:** `public/tefekkur/emrin-mahiyeti.json:62` (Bediüzzaman *şuûnât*) + analitik-içgörü-2 *symmetry breaking*
- **Sorun:** Klasik tefsirde *Kün* (Yâsîn 36:82, Bakara 2:117) Allah'ın yaratıcı iradesinin tezahürüdür — fizikteki *symmetry breaking* ile eşleştirilmez. Bu eşleştirme `criticalNote`'ta belirtilmiş ama klasik kelâm okurları için ek nüans gerekebilir.
- **Mevcut disclaimer:** Yeterli (kozmoloji kategorisi `criticalNote` mevcut).

### [T-2] "İnsan evrim ile geçti" ima (Alak 96:2-3 yorumu)
- **Konum:** `public/tefekkur/alak-suresi-2-3.json:253-254, 265-266`
- **İfade:** "*Fine Tuning of the Universe* ... şuurlu bir varlığın yani **insanın evrimine zemin** hazırlamış... İnsanı **henüz adının zikredilmeye lâyık olmadığı dehrlerden, *epoch*lardan, çok uzun süreçlerden** geçirmiş."
- **Sorun:** İnsanın evrim ile geçtiği iması klasik İslâmî yaratılış anlatısıyla (Âdem doğrudan yaratıldı, çamurdan, ruh üflendi) gerilim üretir. Salt-tahyîr (özel yaratılış) görüşü Sünnî gelenekte hâkimdir; teist evrim (Mâturîdî gelenek içinde bazı modern okumalar) azınlık görüşüdür.
- **Klasik perspektif:** İbn Teymiyye / Selefî gelenek "Âdem doğrudan yaratıldı" çizgisindedir. Mâtürîdî gelenek içinde Yusuf el-Karadâvî, Şahid el-Bütar gibi bazı çağdaş alimler teist evrime açık. Bu nokta tartışmalı.
- **Öneri:** Disclaimer yok. **Yeni `criticalNote` eklenebilir:** "*'İnsanın evrimi' ifadesi klasik İslâmî yaratılış anlatısı (Âdem'in doğrudan yaratılışı, ruh üflenmesi) ile tartışmalı bir alandadır. Bu makale insanın varoluş sürecinin uzun-zamanlı (Dehr 76:1) tasvirini öne çıkarır — klasik 'salt yaratılış' okumasını dışlamaz, onunla farklı dilde konuşur.*"

### [T-3] "Cennet de örtülü, ahiret de paralel boyut" — İşrâkî okuma
- **Konum:** `public/tefekkur/inception-hayatlar.json:131-134`
- **İfade:** "Ahiret yalnızca *'sonra'* değil — aynı zamanda **'öteki'** anlamına gelir... şu an yanı başımızda paralel akan bir boyut."
- **Sorun:** Klasik Sünnî eskatoloji (Eş'arî/Mâtürîdî) ahireti **gelecek zamansal evre** olarak okur — paralel boyut değil. İşrâkî / Sufi gelenek (Sühreverdî, İbn Arabî) bu boyutu **âlem-i misâl** olarak işler ama bu doktrin klasik kelâmda kabul görmüştür ama olağan bir formülasyon değildir.
- **Mevcut disclaimer:** `criticalNote` blokunda açıkça "işrâkî ve Sufi gelenek vurgusu, klasik kelâm temporal-eskatolojik okuma, çatışmaz ama özdeş değildir" denmiş. Yeterli.

---

## Eksik Kaynak / Zayıf Kanıt

### [E-1] "Hz. Ömer duası" / Hz. Peygamber rivayetleri için isnad eksikliği
- **Konum:** Genel olarak — `humanDefinition` bölümü Hz. Peygamber'in rivayet aktarımları
- **Mevcut tutum:** Site şu anda **çoğu** hadis için kaynak veriyor (Buhârî, Müslim, Tirmizî bölüm/numara seviyesinde). Çok az sayıda istisna var ki tüm rivayetler isnad metadata'sı taşımayabilir.
- **Öneri:** Yeni hadis/rivayet eklendikçe `reliability: "sahih"|"hasen"|"zayıf"` flag'i standardını sürdür. Mevcut altın standart.

### [E-2] "1.8 milyar müslüman, sıfır varyasyon" iddiası
- **Konum:** `src/i18n/tr.json:462` (livingPreservation intro)
- **İfade:** "Mekke'deki Kur'an = Medine'deki = İstanbul'daki = Kahire'deki = Jakarta'daki. Konsonant iskelet (rasm) harf harf aynı."
- **Mevcut disclaimer:** "*Konsonant iskelet tüm mushaflarda sabittir... On kanonik kıraat arasında vokalizasyon/okuyuş farkları mevcuttur; bunlar sözlü geleneğin bir parçasıdır, metin bozulması değildir.*" — yeterli, akademik standart.

### [E-3] Hapax legomenon sayıları yaklaşık
- **Konum:** `src/i18n/tr.json:537-538`
- **İfade:** "~455 ... Sayım yöntemine göre 400–500 arası."
- **Mevcut disclaimer:** Açıkça "yaklaşık" not edilmiş, Toorawa 2011 referansı verilmiş. Sağlam.

---

## KATEGORİK ÖZET

| Kategori | Bulgu sayısı | Mevcut disclaimer durumu |
|---|---|---|
| Akaidî (utility/şeffaflık/Hakikat-i Muhammediyye) | 3 (S-3, S-4, S-8) | Kısmi — wording revize önerildi |
| Hadis/atıf | 0 | Altın standartta — hiç sorun yok |
| Modern bilim sentezi | 4 (S-5, T-1, T-2, Y-2) | Mükemmel disclaimer mimarisi |
| Tefsir yorumu | 2 (S-6, S-7) | Yeterli — wording iyileştirme |
| Eisegesis riski | 1 (S-5 alak-suresi-4-5) | Açıkça etiketli — örnek alınmalı |
| Mezhepsel | 2 (S-1 mensûh, S-2 ekstremizm) | Belirgin disclaimer var, gövde dili revize edilebilir |

---

## ÖNCELİKLİ AKSİYON LİSTESİ

**Acil aksiyon yok.** Site içeriği halihazırda akademik dürüstlük standartlarını karşılıyor. Aşağıdaki öneriler **kalite artırıcı revizyon** niteliğinde:

1. **S-1 (Mensûh):** `okuma-prensipleri-2.json` gövdesinde "gerçekte mensûh ayet yoktur" ifadesini *"Felsufi'nin vektörel okumasında işâri mesaj kalıcıdır — sarîh hüküm değişiklikleri için klasik dört mezhebin pozisyonu farklıdır"* şeklinde göreceleştir.
2. **S-3 (Utility/maksimize):** `analitik-icgoru-2` `criticalNote`'una "*Bu dil Allah'a 'hedefe çaba/ihtiyaç' atfetmek anlamına gelmez — Eş'arî/Mâtürîdî kelâmında Allah'ın fiilleri hikmetlidir ama gāye-i tâlibe değildir*" cümlesini ekle.
3. **S-4 (Şeffaflaşan ene):** `analitik-icgoru-1` ve `analitik-icgoru-2` `criticalNote`'larına "*Bu çerçeve vahdet-i şuhûd geleneğindedir — vahdet-i vücûd okumasından farklıdır*" netleştirmesini ekle.
4. **S-8 (Hakikat-i Muhammediyye):** `analitik-icgoru-2` `criticalNote`'una "*Bu formülasyon Sufi (Bediüzzaman) gelenekte merkezi, Selefî gelenekte (İbn Teymiyye) tartışmalıdır*" notunu ekle.
5. **T-2 (İnsanın evrimi imâsı):** `alak-suresi-2-3` makalesine yeni bir `criticalNote` ekle veya mevcut alak `criticalNote`'una "*'İnsanın evrimi' ifadesi klasik 'salt yaratılış' anlatısıyla dialogda — onu dışlamaz*" cümlesini iliştir.
6. **S-2 (Ekstremist müslümanlık):** `yapilanlarin-suslu-gorulmesi` makalesindeki bu retorik cümleyi "Kur'an'ın orta yol vurgusu (Bakara 2:143) **çağdaş okumada** dinin aşırılıkla bağdaşmayacağı tezine de kapı açar" şeklinde nüanslandır.
7. **S-6 (Alak):** `alak-suresi-2-3` girişinde "Yaygın olarak 'kan pıhtısı' diye çevirirler" → "Klasik tefsir hem 'kan pıhtısı' hem 'muallak' olarak okumuştur. Bu yazıda *muallak* boyutu öne çıkacak."

---

## Genel Değerlendirme

QuranCodex, **Türk-İslâm dünyasında ender görülen bir entelektüel dürüstlük standardı** sergiliyor:

- **Eisegesis (içe-okuma) riski** ve **bilim/Kur'an spekülasyonu** tuzakları açıkça etiketleniyor.
- **Hadis ile Kur'an ayrımı** veri-şema seviyesinde flag ile yapılıyor — okur hiçbir zaman "Bu Kur'an'da mı yoksa hadiste mi geçiyor?" sorusunu sormak zorunda kalmıyor.
- **Bucaillism** açıkça reddedilirken Kur'an'a saygı korunuyor.
- **Klasik kelâm/tefsir** (Eş'arî, Mâtürîdî, Selefî, Sufi) farklı pozisyonları açıkça belirtilerek **pluralistic** bir okur kitlesine hitap ediliyor.
- **Felsufi'nin Nurcu + modern bilim sentezi** klasik geleneğin yerini almak iddiasında değil — onun yanında modern okuyucu için pedagojik bir köprü olarak sunuluyor.

**Klasik Sünnî okur perspektifinden** sitenin tek belirgin gerilim noktası, Felsufi'nin bazı çağdaş okumalarının (mensûh ayet yokluğu, kainatın utility maksimize etmesi, kalem = AI/kuantum gibi) klasik usûl-i tefsir / klasik kelâm dili ile **çatışmasa bile gerilim üretebilecek** noktalarda olması. Ancak bu okumalar zaten `criticalNote`'larda **açıkça "klasik gelenekle özdeş değildir, ona ek bir okumadır"** denerek mesafelendirilmiş.

Sonuç: **Sünnî gelenek mensubu bir okuyucu**, sitedeki tartışmalı okumaları **bir çağdaş entelektüel deneme** olarak okuyabilir; klasik akidesini koruyabilir; ve aynı zamanda modern bilim-Kur'an sentezini deneyen Felsufi'nin sesini de duyabilir. Bu, sitenin **pedagojik mükemmelliği**ne işarettir.

Önerilen 7 minör revizyon, içeriğin akademik kalitesini **mükemmel**'den **örnek-alınabilir**'e taşıyacaktır.
