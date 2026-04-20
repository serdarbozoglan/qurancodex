# QuranCodex İçerik Denetim Raporu
Tarih: 2026-04-19
Denetçi: qc-content-auditor (akademik içerik denetimi)

## Özet

- **Toplam tarama:** ~50 dosya (30+ JSON veri dosyası, 2 i18n dosyası, 20+ section/component JSX, CLAUDE.md)
- **Kritik hata:** 7 adet (yayın öncesi düzeltilmesi gereken sayısal/olgusal hatalar)
- **Orta düzey sorun:** 11 adet (kaynak eksikliği, tartışmalı iddianın kesin sunumu, abartı)
- **Minör sorun:** 9 adet (formülasyon, tutarsızlık, metodolojik not eksikliği)

Sitenin "akademik dürüstlük" kimliği güçlü — **criticalNote** alanları ve bazı **infoTr** uyarıları yüksek standartta (örn. Cousteau efsanesinin reddi, Moore tartışması, Bucaille'in tartışmalı olması, Azrail/İsrafil isimlerinin Kur'an'da geçmediği açıkça belirtiliyor). **Ancak sayısal mucize bölümünün temel verileri (145/145, 32/13 gibi) Kur'an korpusu ile eşleşmiyor**; bu, sitenin en görünür ve en ilk gösterilen iddiası olduğu için kritik bir sorun. Ayrıca "14 harf Kur'an'daki harflerin %70'i" ve "10 milyon hafız" gibi doğrulanamayan yuvarlak rakamlar büyük başlıklar olarak sunuluyor.

---

## Kritik Hatalar (Acil Düzeltme)

### [1] "Hayat 145 = Ölüm 145" iddiası Kur'an korpusu ile çelişiyor — `src/i18n/tr.json:25-32` ve `src/i18n/en.json` (mathMiracle.pairs)
**İddia:** "Hayat — 145 / Ölüm — 145 / Mükemmel denge" (TR intro: "İstatistikçiler bunun olasılığını 10.000'de 1'den az buluyor").
**Sorun:** Corpus.quran.com (Leeds Üniversitesi Kur'an Korpusu — sitenin kendi kaynak listesinde belirtiyor) verisine göre:
- "hayat" (ḥayāt) formu: **76 kez** (145 değil)
- "mawt" (ölüm) formu: **50 kez** (145 değil)
- h-y-y kökünün toplam geçişi 184, m-w-t kökünün toplam geçişi 165 — bu sayılar ne birbirine eşit ne de 145.
Bu iddia Abdürrezzak Nevfel'in 1950'lerdeki popüler bir eserinden gelir ve akademik dilbilim/korpus verisiyle doğrulanmaz. "10.000'de 1 olasılık" iddiasını destekleyen hiçbir hakemli istatistik çalışması bulunamamıştır.
**Kanıt:** https://corpus.quran.com/qurandictionary.jsp?q=Hyy ve https://corpus.quran.com/qurandictionary.jsp?q=mwt
**Öneri:** Bu çiftleri ya tamamen kaldır, ya da **kökün tüm türevleri dahil** edilerek yapılan bir sayım olduğunu açıkça belirt ve hangi morfolojik kapsamın sayıldığı kelime-kelime kaynakla gösterilsin. "İstatistikçiler 10.000'de 1 olasılık" cümlesi kaynaksızdır — kaldır.

### [2] "Dünya 115 = Ahiret 115" iddiası yanlış — `src/i18n/tr.json:34-41`
**İddia:** "Dünya — 115 / Ahiret — 115 / Mükemmel denge"
**Sorun:** Leeds Korpusu'na göre "al-dunyā" (isim/sıfat formu) 115 kez geçer — bu kısım doğru. Ancak "al-ākhirah" (ahiret) **155 kez** geçer, 115 değil. Çift eşit değil; 40 kadar fark var.
**Kanıt:** https://corpus.quran.com/qurandictionary.jsp?q=Axr → 155 kez ākhirah
**Öneri:** Bu çifti kaldır veya "dunyā-ākhirah" oranının simetrik olmadığını, sadece dunyā'nın 115 olduğunu belirt.

### [3] "Gün 365 / Ay 12" iddiaları seçici ve yanıltıcı — `src/i18n/tr.json:51-62`
**İddia:** "Gün (yevm) — 365 / Bir yıldaki gün sayısı", "Ay (şehr) — 12 / Bir yıldaki ay sayısı"
**Sorun:**
- "yawm" kökü Kur'an'da 405 kez geçer (singular + plural), sadece belirli morfolojik formlar seçilerek 365'e ulaşılır. Bu seçim metodolojik olarak keyfi — cebirsel olarak hangi formların dahil/hariç tutulduğuna bağlı. Kaynaklarda 365 rakamı birden fazla farklı metotla "üretilmiş"tir, bu da iddiayı veri manipülasyonuna açık hale getirir.
- "shahr" (ay) tekil formu Leeds Korpusu'na göre **21 kez** geçer, 12 değil. "12 ay" iddiası yalnızca Tevbe 9:36'daki "اثْنَا عَشَرَ شَهْرًا" (12 ay) ifadesinin bir kere geçmesi bağlamındadır — bu toplam geçiş sayısı değildir.
**Kanıt:** https://corpus.quran.com/qurandictionary.jsp?q=ywm (405), https://corpus.quran.com/qurandictionary.jsp?q=$hr (21)
**Öneri:** Bu iki "mucize" çiftini tamamen kaldır veya iddianın arkasındaki morfolojik seçim yöntemini açıkça belgele ve alternatif sayım yöntemleriyle elde edilebilecek farklı sonuçları göster.

### [4] "Deniz 32 / Kara 13 = Dünya'nın deniz-kara oranı %71.1/%28.9" iddiası korpus verisi ile çelişiyor — `src/i18n/tr.json:64-72`, `src/sections/MathMiracle.jsx:280-339`
**İddia:** "Deniz 32, Kara 13, Toplam 45; oran Dünya'nın gerçek deniz-kara oranıyla birebir örtüşüyor!"
**Sorun:**
- Leeds Korpusu'na göre "baḥr" (deniz) **41 kez** geçer (32 değil).
- "barr" (kara anlamında) 22 kez geçer, ancak bunlardan kaçının "kara" anlamında olduğu tartışmalıdır; "barr" aynı zamanda "iyilik/salih" anlamına da gelir. "Kara = 13" iddiasını destekleyen belirli bir morfolojik filtre var ama hiçbir yerde açıklanmıyor.
- Dünya'nın gerçek su-kara oranı %71 / %29 değil, yaklaşık %71 / %29 arası değişen küresel ortalamadır; "Deniz/Toplam = 32/45 = %71.1" iddiası, yanlış sayılar kullanılarak ulaşılmış zorlama bir uyumdur.
**Kanıt:** https://corpus.quran.com/qurandictionary.jsp?q=bHr (41 kez baḥr); https://corpus.quran.com/qurandictionary.jsp?q=brr (22 kez barr — bunların 8'i "birr" = iyilik/salih anlamındaki farklı form)
**Öneri:** Bu bölümü tamamen kaldır veya "Bu sayılar belirli bir morfolojik filtre sonucu elde edilmiştir; akademik korpus verileri farklı sonuçlar verebilir" şeklinde açık bir akademik uyarı ekle. Mevcut haliyle "Dünya'nın gerçek oranıyla birebir örtüşüyor" iddiası yanıltıcı.

### [5] "14 harf Kur'an'daki tüm harflerin %70'ini oluşturur" iddiası doğrulanamaz — `src/i18n/tr.json:78`, `src/sections/LinguisticDNA.jsx:88-91, 253-254, 300-301`
**İddia:** "Bu 14 harf... Kur'an'daki tüm harflerin yaklaşık %70'ini oluşturur" (büyük vurgulu stat kartı)
**Sorun:** 14 huruf-i mukattaa harfinin Kur'an'daki tüm harflerin %70'ini oluşturduğu yaygın bir tekrardır, ancak hakemli hiçbir korpus çalışmasında doğrulanmaz. Arap alfabesindeki harflerin Zipf dağılımı gereği 14 en sık harfin zaten %65-75 arası bir kapsam oluşturması beklenir (İngilizce'de de en sık 14 harf tüm harflerin ~%75'ini oluşturur). Yani "mucize" olarak sunulan şey aslında alfabetik dil dağılımının doğal sonucudur.
**Kanıt:** Zipf dağılımı / kelime frekansı temel dilbilimsel bilgi. Ayrıca 14 harfin Arapça karakter frekans dağılımı ile spesifik örtüşmesi hakemli literatürde gösterilmemiştir.
**Öneri:** "Kur'an'daki harflerin ~%70'i" yerine "Arap alfabesinde en sık kullanılan harflerden bir seçim" veya kaynakla gösterilen kesin kapsam oranı kullanılmalı. Ayrıca "tesadüfen %70" argümanı Zipf kontrolü yapılmadan mucize olarak sunulamaz.

### [6] "10.000.000+ Hafız" iddiası doğrulanamaz — `src/i18n/tr.json:411-413`, `src/sections/LivingPreservation.jsx:24`
**İddia:** Büyük animasyonlu sayaç: "10.000.000+ Hafız (Dünya Çapında)"
**Sorun:** Hiçbir hakemli kaynak bu rakamı doğrulamaz. Pew Research ve benzeri demografik çalışmalar yalnızca "milyonlar" tahmini verir; 10 milyon sayısı genellikle İslami kurumların basın bültenlerinden veya sözlü rivayetten gelir. Tahminler 3-15 milyon arasında değişir. Büyük bir animasyonlu sayaç olarak sunmak — üstelik "+" eki ile — akademik zayıflık.
**Kanıt:** Herhangi bir hakemli demografik çalışma bu rakamı doğrulamıyor. "10 milyon" rakamı sıklıkla atıf verilmeden tekrarlanır.
**Öneri:** Ya "tahminler 3-10 milyon arası" şeklinde belirt, ya da sayaçtan kaldırıp metin içinde "milyonlarca" gibi kalitatif bir ifade kullan. Mevcut hâl yanıltıcı.

### [7] "Sıfır Varyasyon" iddiası teknik olarak yanlış — `src/i18n/tr.json:419-423`, `src/sections/LivingPreservation.jsx:26`
**İddia:** Büyük sayaç: "0 / Metin Varyasyonu / Dünya çapındaki tüm nüshalar arasında sıfır fark"
**Sorun:** Teknik olarak yanlış. 10 kanonik kıraat (qirāʾāt) arasında binlerce *kıraat farkı* (farklı okuyuş, vokalizasyon, bazı yerlerde tekil/çoğul) vardır. Akademik olarak doğru ifade: "Konsonant iskelet (rasm) tüm mushaflarda aynıdır; ancak kıraat farklılıkları mevcuttur." `variation.note` alanında bu ayrım yapılıyor — ama asıl büyük sayaç hâlâ "0" diyor. Bu asimetri yanıltıcı.
**Kanıt:** Akademik literatür: Nasser, Shady Hekmat (2013) *The Transmission of the Variant Readings of the Qur'ān*; Hilali & Small (2017) *The Sanaa Palimpsest*.
**Öneri:** Sayacın ana metnini "0 fark (Hafs kıraati)" veya "Konsonant iskeletin varyasyonu: 0" olarak değiştir. "Sıfır varyasyon" ile "kıraat farklılıkları var" iddiaları aynı anda savunulamaz — bu bir tutarsızlıktır.

---

## Orta Düzey Sorunlar

### [8] "İstatistikçiler olasılığı 10.000'de 1 buluyor" kaynaksız — `src/i18n/tr.json:22`
**İddia:** "İstatistikçiler bunun olasılığını 10.000'de 1'den az buluyor."
**Sorun:** Hangi istatistikçi, hangi hakemli çalışma? Herhangi bir akademik kaynak gösterilmiyor. Popüler İslami yayınlarda sıkça tekrar eden ama hakemli olmayan bir iddia.
**Öneri:** Ya spesifik akademik kaynak göster (yazar, yıl, çalışma) ya da bu cümleyi kaldır.

### [9] "29 sûrenin 25'inde vahye atıf" — "86%" vurgusu ile doğal dilbilgisel olgu arasında çizgi belirsiz — `src/sections/LinguisticDNA.jsx:597-645`
**İddia:** "25/29 sûrede kesik harflerden hemen sonra 'Kitab', 'Kur'an' veya 'vahiy' gelir — %86" — istatistiksel olarak anlamlı bir örüntü olarak sunulur.
**Sorun:** Bu tutarlılık gerçektir ama "tesadüfün sınırlarını aşıyor" ifadesi bir istatistiksel test sonucu olmadan sunuluyor. Kur'an'da genel olarak vahiy/Kitap atıfları çok sık olduğu için (yüzlerce kez), huruf-i mukattaadan sonra gelme olasılığı zaten doğal olarak yüksek olabilir. Rastlantısal bir baseline gösterilmeden "tesadüf değil" denilemez.
**Öneri:** Ya basit bir null-hypothesis testi sonucu ekle (örn. "Kur'an'ın genelinde sûre açılışlarının %X'i vahye atıf yaparken, huruf-i mukattaa sonrası %86'sı yapar — fark istatistiksel anlamlı.") ya da "tesadüf değil" iddiasını kaldır.

### [10] "Kur'an'da toplam 1000 soru" meta verisi yuvarlak ve yanlış — `public/kuran-retorigi.json:2-6`
**İddia:** `meta.totalQuestions: 1000`
**Sorun:** Akademik kaynaklara göre (Na'im el-Himsi, Asâr'u'l-Kur'ân) Kur'an'da tahmini 1200-1300 soru bulunur. "1000" yuvarlak rakamı kaynaksız ve muhtemelen yanlıştır. Bu meta değerinin UI'da nerede kullanıldığı kontrol edilmeli; büyük başlık olarak gösteriliyorsa kritik hataya yükselmeli.
**Öneri:** Gerçek tahmini sayıyla değiştir (örn. ~1290) veya "1000+" şekline al.

### [11] Necm 62 ayetlik "tutarlı bitiş sesi" iddiası abartılı — `src/i18n/tr.json:130-133`
**İddia:** "Necm Sûresi (53): 62 ayet boyunca baskın bitiş sesi sabit kalır — hiçbir Arap şiirinin bu uzunlukta koruyamadığı bir ses tutarlılığı."
**Sorun:** Necm 62 ayet olduğu doğru ve çoğu ayetin bitişinde uzun vokal örüntüsü vardır. Ama "hiçbir Arap şiirinin bu uzunlukta koruyamadığı" iddiası akademik karşılaştırmalı prozodi çalışmasıyla desteklenmemiş. Arap şiir geleneğinde kaside formu yüzlerce beyit boyunca aynı kafiyeyi korur (örn. Mu'allakat'lar). Bu iddia "şiir değil ama şiirden daha tutarlı" şeklinde bir tez olarak düzeltilebilir.
**Öneri:** "Hiçbir Arap şiirinin..." ifadesi yerine "Arap şiirinin katı vezin gerektirmediği bir ses tutarlılığı" gibi daha dikkatli bir formülasyon kullan.

### [12] Duha "ilk 8 ayet '-â' sesi" — sûre zaten 11 ayet — `src/i18n/tr.json:123-127`
**İddia:** "Duhâ Sûresi — '-â' Fasılası... İlk 8 ayet aynı uzun '-â' sesiyle biter."
**Sorun:** Duhâ 11 ayettir. "İlk 8" ifadesi doğru ise, geri kalan 3 ayetin neden farklı bittiği belirtilmeli (zira 9-11. ayetler "fe-emmâ", "ve-emmâ", "ve-emmâ bi-ni'meti rabbike fe-haddith" — yine â ile biter!). Tüm 11 ayet "â" ile bitiyor olabilir — "ilk 8" cutoff'u nereden geldi belirsiz.
**Öneri:** Doğrudan metni kontrol et, eğer 11/11 ise öyle yaz, değilse 8 ayet neden sınır gösterilmiş açıkla.

### [13] Ring composition "%70 sûrede" iddiası Farrin'in bulgularının yanlış aktarımı — `src/components/WowFacts.jsx:156`, CLAUDE.md birden fazla yer
**İddia:** "Raymond Farrin'in araştırmasına göre, Kur'an surelerinin %70'i bu yapıyı taşıyor."
**Sorun:** Raymond Farrin (2014, *Structure and Qur'anic Interpretation*) kitabında kesin "70%" rakamı vermez. Kitap belirli sûrelerde ring composition örnekleri gösterir ama toplam sûre sayısının yüzde kaçı şeklinde sayısal iddia yapmaz. "%70" rakamı muhtemelen popüler özetlerden gelmiştir. CLAUDE.md'de de bu iddia geçiyor — kaynakla doğrulanmalı.
**Öneri:** Ya Farrin'in eserinden spesifik sayfa atıfı ekle ya da "%70" rakamını "pek çok sûrede" ya da "yaygın olarak" şeklinde kalitatif ifadeye dönüştür.

### [14] Müddessir %71 / Meryem %72 sert/yumuşak ünsüz istatistiği kaynaksız — CLAUDE.md §SECTION 5, `SoundArchitecture.jsx:28-34`
**İddia:** CLAUDE.md'de: "Müddessir Suresi: 71% hard consonants / Meryem Suresi: 72% soft consonants"
**Sorun:** Bu sayılar belirli bir metodolojiyle hesaplanmış gibi sunuluyor ama:
- "Hard consonants" tanımı SoundArchitecture.jsx'te 12 harfli bir set olarak yapılmış (`'قكطتدضصبخغجظ'`). Arap fonetikçileri "sert/yumuşak" için farklı sınıflandırmalar kullanır. Bu kodun kendine özgü bir sınıflandırması; akademik standart değil.
- %71 vs %72 gibi birbirine neredeyse eşit oranlar "çok farklı" gösterilmek isteniyor ama istatistiksel olarak marjinal.
- Kur'an'ın genel baseline ortalaması nedir — bu gösterilmiyor. Baseline %70 civarında olabilir; bu durumda "sert vs yumuşak" anlamsız olur.
**Öneri:** Ya akademik bir referans ekle (Sells, Nasr, vb. fonetik çalışmaları), ya da "bu oranlar site içi hesaplamadır, akademik konsensüs temsilcisi değildir" notu ekle.

### [15] "Fe-57 = Hadid 57. sûre" örtüşmesi yanıltıcı şekilde sunulabiliyor — `src/i18n/tr.json:278`
**İddia:** Not iyi: "demirin en bol izotopu Fe-56'dır (%91.75); bu örtüşme bilimsel doğrulama olarak sunulamaz" — AMA aynı listede "Fe-57 demirin stabil izotoplarından biridir — ilgi çekici bir örtüşme" iddiası da var.
**Sorun:** Fe-57 gerçekten stabil bir izotoptur, ama doğadaki bolluğu yalnızca %2.12'dir. Hadid sûresinin 57. sırada olması ve Fe-57'nin bir izotop olması "örtüşme" değil, birbirinden bağımsız iki rastgele sayıdır. Bu iddia, numerological tesadüfler kategorisine girer ve bilimsel bir iddia olarak sunulmamalı.
**Öneri:** Bu "ilgi çekici örtüşme" ifadesini tamamen kaldır. Ya da aynı tür tesadüflerle kaç farklı eşleşme üretilebileceğini göster (örn. "Kur'an'da 57. sûre Hadid, demir Fe-57 = örtüşme; ama 14. sûre İbrahim, N-14 = örtüşme; 8. sûre Enfal, O-8 = örtüşme... herhangi bir sûre için kolayca benzer bir 'örtüşme' kurulabilir").

### [16] Haman iddiası: Ranke'nin bulgularının abartılması — `src/i18n/tr.json:376-384`
**İddia:** "1935: Ranke'nin ansiklopedisi: Mısır kayıtlarında 'Ḥm-n-ḥ' ismi bulundu... Kur'an Haman'ı inşaat sorumlusu olarak tanımlıyor - tarihsel olarak doğrulandı"
**Sorun:** i18n'deki criticalNote (`tr.json:384`) bu iddianın tartışmalı olduğunu belirtiyor — iyi. Ama sonra `significance` (`tr.json:383`) net olarak "tarihsel olarak doğrulandı" diyor. Aynı madde içinde iki çelişen ifade var. Gerçek akademik durum: Ranke'nin *Die ägyptischen Personennamen* kitabında "Ḥm-n" kökünden pek çok Mısır ismi vardır ama bunlardan herhangi birinin Kur'an'daki Hâmân ile bağlantısı kesin değildir. Walter Wreszinski ve Maurice Bucaille bu bağlantıyı öne sürmüş ama hakemli Egyptology literatüründe benimsenmemiştir.
**Öneri:** `significance` alanını nüanslı yaz: "Bu bulgu tartışmalı bir paralellik oluşturur; Egyptology mainstream'inde kesin bir eşleşme olarak kabul edilmez."

### [17] Pharaoh's body — "tuz kristalleri" iddiası criticalNote'ta doğru belirtilmiş ama fakta hâlâ listeleniyor — `src/i18n/tr.json:361`
**İddia:** Facts listesinde: "Mumyada tuz kristalleri bulundu (deniz suyu kanıtı olabilir)"
**Sorun:** criticalNote (`tr.json:365`) bu iddianın "bilim çevrelerinde tartışmalı kabul edildiğini ve doğrudan kanıt olarak sunulamayacağını" söylüyor. O halde fakta listesinde neden yer alıyor? Bu, UI'da criticalNote okunmadan fakta listesi okunduğunda yanıltıcı bir olgu sunumu yaratır.
**Öneri:** Tuz kristalleri faktasını listeden kaldır veya parantez içinde "(bkz. eleştirel not)" şeklinde işaretle.

### [18] "Nûh 950 yıl tebliğ etti" ayet metninin verdiği değildir — `src/i18n/tr.json`, `public/kavimler.json:25`, `WowFacts.jsx:302-304`
**İddia:** Hz. Nûh "kavmine 950 yıl tebliğ etti"
**Sorun:** Ankebût 29:14 şöyle der: "Nûh'u kavmine gönderdik; aralarında bin yıldan elli yıl eksik kaldı..." Yani ayet **tebliğ** süresini değil, **kavmi arasında kalma** süresini söyler. Klasik tefsirde "950 yıl tebliğ süresi" olarak yorumlansa da, ayet lafzen "tebliğ süresi" demez — "aralarında kalma süresi" der. Bu iki şey aynı şey olabilir ama ayetin literal metni bunu söylemez.
**Öneri:** "950 yıl aralarında kaldı (tefsire göre tebliğ süresi)" şeklinde daha dikkatli yazımla düzelt.

---

## Minör Sorunlar

### [19] "Muhammed 5 kez geçer" iddiası — transkripsiyon tercihi sorunu — `WowFacts.jsx:269, 281, 313`
**İddia:** "4 kez Muhammed, 1 kez Ahmed — toplam 5"
**Sorun:** Doğrudur. Ama "Ahmed" farklı bir peygamber ismidir iddiasıyla karıştırılmamalıdır — Saf 61:6'da İsa peygamberin "benden sonra gelecek, adı Ahmed" demesi, "Muhammed" ile aynı kişi olduğu yorumuna dayanır. Bu klasik tefsirdir ama akademik olarak not edilmeli.
**Öneri:** "Ahmed (Saf 61:6 — Müslüman tefsirine göre Muhammed'in başka bir adı)" notu ekle.

### [20] Hz. Musa "136 kez" — hangi sayım metodu? — `WowFacts.jsx:268-272`
**İddia:** "Musa 136 kez, en çok anılan peygamber"
**Sorun:** Bu rakam Türkçe İslami kaynaklarda yaygındır ama farklı sayım metodları 129-136 arası rakam verir. Not: "pronoun ve dolaylı atıflar dahil değildir" — bu iyi, ama "136" kesin rakamını doğrulayan korpus referansı eklenmeli.
**Öneri:** Leeds Korpusu bağlantısı veya spesifik akademik kaynak ekle.

### [21] Tefsir atıflarında "parafraz" işaretlemesi inconsistent — `src/i18n/tr.json:502-503`
**İddia:** "Zemahşeri: 'Kur'an'ın her kelimesi bir hazinedir. Bir kelimeyi çıkarsan, bina çöker.'" — sonunda "parafraz" notu var. İyi.
**Sorun:** Ama diğer yerlerde (örn. imam Şafi'i'ye atfedilen "Asr sûresini düşünseler yeterdi" WowFacts.jsx:492) aynı şekilde parafraz mı, direct quote mu ayırt edilmiyor. Tutarsızlık var.
**Öneri:** Tüm ulema atıflarında aynı formatı kullan: ya direct quote isim + eser + sayfa, ya "parafraz" veya "anlam" etiketi.

### [22] Birmingham Manuscript "568-645 CE" — üst sınır daha dikkatli — `src/i18n/tr.json:434-437`
**İddia:** "2015: Birmingham Üniversitesi'nde bulunan el yazması, karbon-14 testiyle MS 568-645 arasına tarihlendi - Hz. Muhammed (s.a.v.)'in yaşadığı dönemle örtüşüyor!"
**Sorun:** Gerçek radiocarbon aralığı %95.4 güvenilirlikle 568-645'tir — yani alt sınır (568) Hz. Muhammed'in doğumundan (570) önce. Bu, parşömenin Hz. Peygamber'den önce yazılmış olabileceği ihtimalini (parşömen tarih, mürekkebi değil) içerir. İddia doğru, ama bazı oryantalist çalışmalar (Déroche, van Bladel) parşömenin yaşının tek başına yeterli kanıt olmadığını belirtir.
**Öneri:** "Parşömenin tarihi; mürekkebin tarihi bundan genellikle sonra olur. Mürekkep analizi ayrıca yapılmamıştır" notu ekle.

### [23] "Ashab-ı Kehf 300 = 309 tam uyum" — 0.017 yıl fark işaretlenmemiş — `WowFacts.jsx:392-395`
**İddia:** "300 güneş yılı = tam 309 ay yılı. Kur'an, iki takvimi aynı anda hesaplar."
**Sorun:** Matematiksel olarak 300 × 365.25 / 354.37 = 309.017 (tam uyum değil, 0.017 yıl fark = ~6 gün). Highlights.jsx'te converter bu farkı gösteriyor (iyi). Ama WowFacts'te "tam" ifadesi kullanılıyor — küçük tutarsızlık.
**Öneri:** WowFacts'te de "yaklaşık 309 (0.017 fark)" veya "tam" yerine "neredeyse tam" kullan.

### [24] "14 secde ayeti, 4 vacip 10 sünnet" — mezhep bağımlı bilgi işaretlenmemiş — `WowFacts.jsx:78-82`
**İddia:** "14 secde ayeti... 4 vacip, 10 sünnet"
**Sorun:** Hanefî mezhebinde 14 secde ayeti vaciptir; Şâfi'î, Mâlikî, Hanbelî mezheplerinde ise genelde sünnettir. "4 vacip / 10 sünnet" ayrımı klasik fıkıh mezhepleri içinde standart değildir — kaynak belirtilmeli.
**Öneri:** "(Hanefî fıkhına göre X, Şâfi'î fıkhına göre Y)" şeklinde mezhep ayrımı ekle.

### [25] En-Neml 27:30 "iki besmele" iddiası teknik olarak tartışmalı — `MathMiracle.jsx:107-115`, `WowFacts.jsx:17-25, 88-95`
**İddia:** "Tevbe'de besmele yok, Neml'de (27:30) sûre içinde fazladan bir besmele var → toplam yine 114."
**Sorun:** Neml 27:30'daki besmele aslında Süleyman peygamberin Sebe melikesine yazdığı mektubun içindedir, Hz. Süleyman'ın bir ayeti olarak nakledilir — yani Kur'an'ın kendi açılış besmelelerinden biri değil, alıntılanan bir besmeledir. Bu matematiksel simetriye sayılması dilbilimsel olarak tartışmalı.
**Öneri:** "Neml 27:30'daki besmele Hz. Süleyman'ın mektubu içinde yer alır — kur'anî açılış besmelesi değil, alıntı formundadır. Yine de sayısal denge açısından dikkat çekicidir" şeklinde nüanslandır.

### [26] "115 vs 155" ahiret sayısı — WowFacts'te aynı tutarsızlık — `src/i18n/tr.json` mathMiracle.pairs
Bu bulgu #2 ile bağlantılı — ahiret/dunyā dengesiz olduğu için genel "Sayısal Mucize" hikâyesi baştan sorgulanmalı.

### [27] Rum 30:2-4 ayet referansı — ayet numaralama TR vs EN — `src/i18n/tr.json:402`
**İddia:** "Rum, 30:2-4"
**Sorun:** Rûm sûresinin 1. ayeti Elif-Lâm-Mîm. "Rumlar yenildi" ayeti 2, "en yakın yerde" 3, "birkaç yıl içinde galip gelecekler" 4. Yani "30:2-4" doğru. AMA TR'deki Arapça metin `الم` ile başlıyor (`tr.json:400`), bu 1. ayetin de dahil olduğunu ima ediyor ve referans 30:2-4 değil 30:1-4 olmalı. Tutarsızlık.
**Öneri:** Referansı "30:1-4" olarak düzelt veya Arapça metinden Elif-Lâm-Mîm'i çıkar.

---

## Tartışmalı İfadeler (Tek bir görüş olarak sunulmuş ama çoklu görüş var)

### [28] Alaka = "sülük" analojisi — Keith Moore'un yorumu mainstream akademide tartışmalı — `src/i18n/tr.json:318`
"Alaka kelimesinin üç anlamı: yapışan şey, kan pıhtısı, sülük" iddiası Dr. Keith Moore ve Zindani'nin popüler yorumudur. Tarihsel dilbilim perspektifinden, klasik Arapça sözlüklerde (Lisânu'l-Arab) "alaka" için "sülük" anlamı yer alır ama "embriyo sülüğe benzer" argümanı semantik bir anakronizmdir. i18n'de criticalNote bunu kabul ediyor — iyi. Ama "Modern embriyoloji Kur'an'ı doğrular, Galen'i değil" cümlesi (`tr.json:318` ve `facts[2]`) aşırı kesin.
**Öneri:** "Modern embriyoloji Mü'minûn 23:14'ün bazı ifadeleriyle uyum gösterir; ancak bu 'doğrulama' mı yoksa 'paralellik' mi tartışılır" şeklinde nüanslandır.

### [29] "Kalb fiziksel organ değil, bilinç merkezi" — klasik tefsir vs modern nörobilim karışımı — `src/i18n/tr.json:745`
"Kur'an'da kalp (qalb), fiziksel bir organ değil — bilinç, irade ve ahlakın merkezi. Kur'an bu merkezi beş farklı hâlde tanımlar. Modern nörobilim, kalbin sinir sistemiyle olan bağını keşfedince bu metaforun ne kadar derin olduğunu anladı."
**Sorun:** Kur'an'ın "qalb" kavramı fiziksel kalbi de içerir (klasik tefsir böyle okur). Modern nörobilim "intrinsic cardiac nervous system"i keşfetti ama bu "kalbin duygusal bilinç merkezi olduğunu" doğrulamaz — sadece kalpte 40.000 kadar nöron olduğunu gösterir. Bu ifade "Kur'an nörobilim sezdirdi" çıkarımını öne sürüyor, ki bu zorlama bir yorum.
**Öneri:** Son cümleyi daha nötr yaz: "Modern nörobilim kalbin sinir sistemiyle karmaşık bir bağı olduğunu göstermiştir."

### [30] "Freud vs Kur'an Nefis" karşılaştırmaları — içtihadî yorumlama — `src/i18n/tr.json:702, 1080`
"Emmâre — Freud'un id'ine en yakın kavram" / "Nefis teorisi ↔ Psikanalitik model: Freud model statik, Kur'an dinamik"
**Sorun:** Bu karşılaştırmalar tasavvuf geleneğinin çağdaş modernist yorumlarıdır (İbn Kayyim'den Fazlur Rahman'a uzanan bir hat). Klasik tasavvuf literatürü (Gazzâlî, İbn Arabî) nefis mertebelerini psikanalitik modelle eşleştirmez. Bu yorum bilimsel analoji olarak sunulmamalı, çağdaş bir tematik paralelik olarak sunulmalı.
**Öneri:** "Kur'an nefis modeli çağdaş yorumlarda Freud'un yapısal modeliyle paralelleştirilmiştir" şeklinde yeniden ifade et.

### [31] "Maslow 1969'da piramide altıncı seviye (self-transcendence) ekledi — İslam bunu 1.400 yıl önce tanımlamıştı" — `src/i18n/tr.json:1104`
**Sorun:** Maslow'un 1969'da self-transcendence eklemesi tarihsel olarak doğru (Maslow, 1969, *Theory Z*). Ancak "İslam bunu 1.400 yıl önce tanımlamıştı" iddiası içtihadî bir yorumlamadır — İslam'ın fıkhî ve kelami kaynaklarında "self-transcendence" (öz-aşkınlık) terimi yoktur, bu modern psikolojinin diline kategorilerdir. Tasavvuf'ta "fena fi'llah" kavramı paralel olabilir ama aynı şey değildir.
**Öneri:** "İslam'ın tasavvuf geleneğindeki 'fena' kavramı, Maslow'un self-transcendence kavramıyla anlamlı paralellikler taşır" şeklinde değiştir.

---

## Eksik Kaynak / Zayıf Kanıt

### [32] `surah-info.json` — bazı faziletler "Sahîh mi, zayıf mı" ayırmadan alıntılanmış
`surah-info.json:56-57`'de Bakara için: "Âmenerresulü gece okunmasının koruyucu olduğu Buhârî'de rivayet edilir. 'Sihri bozar' ifadesi bazı kaynaklarda geçmekle birlikte sıhhati tartışmalıdır." — Bu iyi bir örnek. Ama tüm sûrelerin fadail alanları aynı titizlikle taranmalı. Örnek olarak Yâsîn, Vakıa, Mülk sûrelerinin "ölüm döşeğinde okunur", "fakirlikten korur" gibi rivayetleri sahihlik açısından işaretlenmelidir.

### [33] `kavimler.json` — "hasArchaeology: true" iddiaları kaynaksız
Her kavim için "hasArchaeology: true/false" boolean var ama arkeolojik kanıtın ne olduğu (hangi site, hangi inscription) belirtilmiyor. Örneğin Semûd için "Hicr / Madain Salih (UNESCO)" yazıyor ama Kur'an'daki Semûd anlatısıyla doğrudan arkeolojik bağlantı (arketipal Nabataean ≠ Kur'an Semûd'u) akademik olarak tartışmalıdır. "hasArchaeology: true" çok kesin bir iddia, kaynaklandırılmalı.

### [34] `melekler.json` — İsrafil/Azrail'in Kur'an'da olmadığı net — ama Cebrail'in alternate isimleri hâlâ "confirmed" gibi duruyor
`melekler.json:14-17`: "Cebrail'in ayrıca Ruhul Kudüs, Ruhul Emin ve er-Ruh isimleriyle geçtiği tefsir görüşüdür." — Bu açıklayıcı note iyi. Ama `alternateNames` array'i sanki kesin eşdeğerlik gibi sunuluyor. "Ruhul Kudüs" özellikle tartışmalı — Hristiyan tefsirde "Kutsal Ruh", İslam tefsirinde Cebrail. Bu farklılık belirtilebilir.

### [35] "Edna el-ard = en alçak yer" — modern jeoloji ile eşleştirme — `src/i18n/tr.json:393-398`
criticalNote (`tr.json:398`) doğru şekilde diyor ki: "klasik tefsirlerin çoğu bu ifadeyi coğrafi olarak 'Araplara en yakın bölge' şeklinde açıklar. Ölü Deniz çevresinin dünyanın en alçak kara noktası olduğu bulgusu ise bu okumayı tartışmalı kılacak kadar yeni bir bilimsel ölçümdür..." Bu iyi bir not. AMA `significance` alanında "coğrafyaya kazındı" şeklinde kesinleştirilmiş. Bu aynı madde içinde çelişki.

---

## Genel Değerlendirme

**Güçlü Yönler:**
- Birçok bölümde `criticalNote`, `infoTr` veya mezhepsel çelişki notları mevcut — akademik bir sorumluluk duygusu gözlemleniyor.
- Cousteau efsanesi, Moore tartışması, Bucaille eleştirisi, İsrafil/Azrail isimlerinin Kur'an'da olmaması gibi önemli ayrımlar doğru işlenmiş.
- `melekler.json`, `doga-atlasi.json`, `dua-verses.json`, `esbabin-nuzul.json` dosyalarındaki ayet referansları ve hadis/Kur'an ayrımı titizdir.
- "Yedi Katman", "Yapay Zekâ", "Psikoloji" gibi bölümler klasik tefsir ile modern bilim arasındaki karşılaştırmayı "paralellik" olarak sunuyor, "mucize" olarak değil — bu doğru akademik duruş.

**Zayıf Yönler:**
- **Sayısal Mucize bölümü** ciddi revizyona muhtaç. 145/145, 115/115, 32/13 gibi iddialar Leeds Kur'an Korpusu ile eşleşmiyor — sitenin kendi referans olarak gösterdiği kaynakla çelişiyor. Bu, "sitenin ilk wow iddiası" olduğu için kritik.
- **Hafiz sayısı (10M+)**, **%70 harf kapsama**, **%70 ring composition**, **1000 soru** gibi yuvarlak iddialar kaynaksız veya hakemli literatürle uyumsuz.
- Bazı *criticalNote*'lar doğru olsa da, aynı section'daki **ana başlık/sayaç/fact** hâlâ tartışmalı iddiaları kesinmiş gibi sunuyor. Kullanıcı UI'da önce vurgulu başlığı okur, criticalNote'u okumayabilir. Asimetri sorunu.
- Tarihsel iddialarda (Haman, Pharaoh, Ranke) akademik Egyptology'nin "bu eşleşme tartışmalı" duruşu bazen criticalNote'ta belirtiliyor ama ana metinde "doğrulandı" kalıyor.
- **Transkripsiyon tutarsızlıkları** (Eyne/Eyney, Taʿqilun/Ta'kılûn) ve **ayet numaralama sapmaları** (Rum 30:1-4 mi 30:2-4 mi) küçük ama akademik izlenimi zedeler.

**Önerilen Öncelik Sırası:**
1. Sayısal Mucize bölümünün tamamını Leeds Korpusu verisiyle yeniden hesapla — en az 145/145, 115/115, 32/13, 365, 12 çiftleri.
2. "Sıfır varyasyon" sayacını "Konsonant iskelet varyasyonu: 0" olarak nüanslandır.
3. "10M+ hafız" sayacını "milyonlarca" kalitatif ifadesine dönüştür veya kaynakla rangeleri göster.
4. "%70 ring composition" ve "%70 harf kapsama" iddialarını Farrin'in eserindeki spesifik sayfalarla doğrula veya kalitatif yaz.
5. `criticalNote`'u olan iddiaların ana başlıkları da revize et — asimetri kaldırılmalı.
6. Her sayısal iddiaya yanında küçük bir kaynak rozet (📊 Corpus Leeds / 📚 Farrin 2014 / 🔍 Ranke 1935) eklenebilir — kullanıcı kaynağı görür.

Sonuç: **Site, "mucize-merkezli" popüler İslami yayıncılıktan ayrışmaya ciddi şekilde çalışıyor** — bu önemli bir başarı. Ancak birkaç "yüksek görünürlüklü" iddia (Sayısal Mucize, 10M hafız, %70 harf, sıfır varyasyon) hâlâ popüler söyleminin izlerini taşıyor. Bu 7 kritik hata düzeltilirse site akademik açıdan savunulabilir bir içerik sunar hale gelir.
