# KATKI RAPORU — UYGULAMA LİSTESİ

> **Kaynak:** `external_resources/katki-raporu.pdf` — "QuranCodex Katkı ve
> Değerlendirme Raporu", Sürüm 1.0, 2026-10-22. Dışarıdan gelen, 10 sayfalık,
> kendi sayım betikleriyle (Tanzil Hafs/Kûfî, Python) hazırlanmış bir inceleme.
> Kapsam: ana sayfa, 15 bölüm, ~50 araç/atlas sayfası, 53 tefekkür yazısının
> tamamı. 587 Arapça âyet alıntısının hepsi tutarlı bulunmuş.
>
> **Çalışma kuralı (kullanıcı direktifi 2026-10-24):** maddeler SIRAYLA
> yapılır; her değişiklik için astra hakem turu ZORUNLU; emin olmadan
> değiştirilmez; değişiklik commit edilir, bu liste güncellenir ve `main`'e
> push edilir.

---

## 0. Raporun güvenilirliği — ÖNCE SAĞLAMASI YAPILDI

Rapor körlemesine uygulanmadı (§13.30). Kur'an metnine dayanan iddiaları
kendi kanonik kaynağımızla (`public/verse-graph-bgem3.json`, harekesiz
iskelet + kelime sınırı) yeniden sayıldı. **Test edilen 8 iddianın 8'i de
doğru çıktı:**

| iddia | rapor | bizim ölçüm | sitedeki değer |
|---|---|---|---|
| «يا رب» ile başlayan dua | var (25:30, 43:88) | var | "hiçbiri" ❌ |
| Er-Rahmân | 57 kez / 56 âyet | 57 / 56 | 60 ❌ |
| «الدودة» (ağaç kurdu) | Kur'an'da yok | 0 | 34:14'e atfedilmiş ❌ |
| «الأسد» (aslan) | yok; 74:51'de قسورة | 0 / قسورة 1 | "2 kez" ❌ |
| هدهد | 1 | 1 | "2 kez" ❌ |
| ثعبان | 2 | 2 | "4 kez" ❌ |
| 300×365,25/354,37 | 309,211 | 309,211 | 309,017 "tam olarak" ❌ |
| جنات (Secde) | 32:19 | 32:19 | 32:17 ❌ |

**Doğrulanmadı, doğrulanmadan uygulanmayacak:** hadis dereceleri ve tarih
iddiaları (Gorgan Seddi'nin Sâsânî oluşu, Tirmizî 3298'in zayıflığı, Buhârî
334'ün metni…). Raporun kendisi de "derece notları kaynaktan aktarılmıştır,
bir hüküm değildir" diyor. Her biri birincil kaynaktan teyit edilecek (§13.30).

## 0.1 Astra'nın editoryal hükmü (2026-10-24)

Dört tartışmalı maddeyi hakeme sordum; dördüne de **"değiştirerek uygula"**
dedi. Kilidi açan ayrım:

> "Kur'an'ın hakikati ile bir âyete ilişkin beşerî yorumun isabeti aynı şey
> değildir. İkincisini denetlemek, bilimi Kur'an'ın hakemi yapmak değildir."

Yani §13.24 ile rapor arasında sanılan gerilim yok. Hükümler ilgili
maddelerin altında.

---

## KADEME 1 — Düz hatalar (tartışmasız)

Hepsi veri dosyası ya da tek cümle düzeltmesi. Editoryal tartışma yok.

### 1.1 Tabiat Atlası — âyette geçmeyen Arapça ✅ TAMAM (2026-10-24)

41 kartın tamamı tarandı; rapor 4 bulmuştu, **8 kart** düzeltildi. Her biri
âyet metni okunarak elle teyit edildi. Arapça değerler elle YAZILMADI,
kanonik âyet kaynağından **kelime konumuyla** çekildi (betikte Arapça literal
yok; elle yazmak kırılgan, aynı görünen iki dizi farklı kod noktalarından
oluşabiliyor).

- [x] `agac-kurdu` — «الدُّودَة» → **دَٓابَّةُ الْاَرْضِ** (34:14). Âyet tür adı
      vermiyor; ağaç kurdu tefsir açıklaması, not buna göre yazıldı.
- [x] `aslan` — «الْأَسَد» → **قَسْوَرَةٍ** (74:51), "2 kez" → 1. Başlık
      "Kasvera (aslan veya avcılar)". Astra uyarısı uygulandı: *lafzın
      bulunmaması anlamın bulunmadığını göstermez*, "Kur'an'da aslan yok"
      sonucu çıkarılmadı.
- [x] `sarimsaklar` — «الثَّوْم» → **فُومِهَا** (2:61). Başlık "Fûm (sarımsak
      veya buğday)"; tefsir ihtilafı görünür.
- [x] `tur-agaci` — «شَجَرَةِ الطُّورِ» (uydurma tamlama) → **شَجَرَةً تَخْرُجُ
      مِنْ طُورِ سَيْنَٓاءَ** (23:20). Tîn 95:2 ve Tûr 52:1 atıftan çıkarıldı
      (orada ağaç değil DAĞ geçiyor).
- [x] `koyun` — atıf 6:143/38:23'te «الغنم» yok; 6:146, 20:18, 21:78 oldu.
      Astra notu: ganem koyunu ve keçiyi kapsar, Dâvûd kıssasındaki 99 koyun
      «نَعْجَة» lafzıyladır.
- [x] `hudhud` — "2 kez" → 1 (27:20).
- [x] `yilan` — «الثَّعْبَان» → **ثُعْبَانٌ** (âyet biçimi), "4 kez" → 2.
      Not üç kelimeyi ayırıyor: su'bân, hayye (20:20), cânn (27:10, 28:31).
- [x] `mubarek-agac` — marife «الشَّجَرَةِ الْمُبَارَكَةِ» → nekre **شَجَرَةٍ
      مُبَارَكَةٍ** (24:35). Astra notu: âyet «زَيْتُونَةٍ» ile sürüyor, yani
      Zeytin kartıyla aynı ağaç; nota yazıldı.
- [x] Sayım alanı artık **kapsamı** da söylüyor ("2 âyette 2 kez, su'bân
      lafzı") — astra: "N âyette M kez tek başına yeterli olmaz".

**Yanlış alarm, dokunulmadı:** `salatalik` (قِثَّٓائِهَا 2:61'de var),
`uzum` (اَعْنَابٍ 36:34'te var), `mercimek` (عَدَسِهَا 2:61'de var). Kendi
tarama betiğim maddah işaretini atlıyor ve kırık çoğulları kaçırıyordu;
29/41 kart "sorunlu" demişti, gerçek 8. **Ders:** oran şüpheli gelince önce
aracı sorgula (§13.26'nın aynı dersi).

**Kalan (Kademe 2'ye):** kartlardaki tefsir açıklamalarının (aslan/avcı,
sarımsak/buğday, ağaç kurdu) kaynak künyesi yok — §13.35'e göre nokta
referansı gerekiyor. Ayrıca C listesindeki sayı farkları (deve, inek, hurma…)
morfolojik çözümleme ister; mevcut betik güvenilir değil.

### 1.2 Metinle çelişen diğer ifadeler ✅ TAMAM (2026-10-24)

Dokuz maddenin tamamı astra hakem turundan geçti; astra üç yerde beni
düzeltti ve metinleri kendisi yazdı.

- [x] **Dua "yâ"** (`QuranDua.jsx`) — "hiçbir dua 'yâ' ile başlamaz" iddiası
      kalktı. «يَا رَبِّ» Furkān 25:30 ve Zuhruf 43:88'de geçiyor. Astra ayrıca
      iki şey daha düzeltti: "neredeyse tamamı" da gösterilmiş bir sayım değil
      (Mâide 5:114 "Allahümme Rabbenâ" gibi başka açılışlar var), ve "yâ edatı
      mesafe varsa kullanılır" dilbilgisi iddiası yanıltıcı — nidâ edatından
      Allah ile kul arasında fiziksel mesafe sonucu çıkarılamaz. Pencere
      başlığı da "Yâ Edatının Yokluğu" → "Nidâ Edatı Yâ" oldu.
- [x] **Kehf 18:25** (`i18n/tr+en`, `Highlights.jsx`) — 309,017 → **309,21**;
      "tam olarak" kalktı. Astra düzeltmesi: fark ~75 gün (ben 77 demiştim).
      Widget zaten canlı hesaplıyordu, yalnız elle yazılmış başlık yanlıştı.
- [x] **Esmâ yalın «الله»** (`EsmaFrekans.jsx:34`, `esma-frekans.json`) —
      1.813 → **2.155**. Astra "sayıyı takas etme, ölçütü tanımla ve yeniden
      say" dedi; öyle yapıldı ve ölçüt koda yazıldı: ön eksiz yalın biçim,
      hareke düşürülür, «اللهم» hariç, Kûfî sayımda 2-114. sûre besmeleleri
      dahil değil. Aynı metinde ön ekli biçimler 393, lafzı içeren tüm
      kelimeler 2.557. 1.813'ün hangi ölçütle çıktığı bulunamadı.
- [x] **Sebeb-i Nüzûl / Nisâ 4:15** — "İslam öncesi uygulama" çerçevesi
      kalktı. Astra'nın metni kullanıldı; "ilk hüküm" yerine "erken dönem
      hükümlerinden biri" denildi ve nesih/tahsis/tafsil terimleri
      birbirine karıştırılmadı.
- [x] **Hapax "~455"** (`i18n/tr+en`) — astra "UYGULAMA: sayıyı koruyup
      yalnız açıklamayı değiştirme" dedi. Toorawa'nın çalışmasının VARLIĞINI
      doğruladım ("Hapaxes in the Qurʾān", *New Perspectives on the Qurʾān* 2,
      2011) ama **455 rakamını doğrulayamadım**. Doğrulanmamış sayı kaldırıldı;
      yerine kendi ölçümümüz ve yöntemi kondu: yazılış düzeyinde tek kez geçen
      **8.666** biçim / toplam **14.782** yazılış. İpucu metni birimin yazılış
      olduğunu, sözlük düzeyindeki hapaksın çok daha küçük ayrı bir küme
      olduğunu söylüyor; Toorawa yalnız katalog çalışması olarak anılıyor,
      ona bir sayı atfedilmiyor.
- [x] **Yaratılış-2 "Ben/Biz"** — cümle YAZARIN metninde değil BİZİM
      özetimizdeydi (TR ve EN), kaldırıldı. Astra çerçevemi düzeltti:
      "genelleme ters" demek de yanlış, çünkü «قُلْنَا لِلْمَلَائِكَةِ»
      anlatıcı ifadesidir, meleklere söylenen sözün içeriği değil; 2:30'daki
      "Ben … yaratacağım" ise hitabın içinde. Doğrusu "bu kesin ayrım
      kurulamaz". ⏳ Yazara kısa bir düzeltme bildirimi gönderilecek.
- [x] **Halka Kompozisyon / besmele** (`HiddenArchitecture.jsx`) — "Şafiî
      mezhebi sayımı" → **Kûfî âyet sayımı**. Astra: numaralandırma âyet sayım
      geleneğine nispet edilir; besmelenin namazda okunmasına dair fıkhî
      görüşler ayrı bir konudur, ikisi aynı kategori değil.
- [x] **Zülkarneyn / Gorgan-Derbent** (`tarihsel-kanitlar.json`) — "Kiros'un
      inşa ettiği duvar" ifadesi kalktı. Yeni metin: özdeşleştirme bir
      yorumdur; bugün görülen büyük tahkimatlar genel olarak Sâsânî dönemine
      (MS 5.-6. yy) tarihlenir, Kiros'a ait gösterilemez.
- [x] **«جَنَّات» 32:17 → 32:19** (`cennet-cin-mecnun.json`) — yalnız kelime
      tablosu satırı. ⚠ Düzyazıdaki 32:17 atfı DOĞRU ve dokunulmadı: 32:17
      «مَٓا اُخْفِيَ لَهُمْ» yani gizlilik bağlamı. Astra da onayladı.

**Yan etki:** yeni canlanan humanizer kapısı (bkz. 1.1) dokunduğum satırlardaki
ESKİ borcu da yakaladı: 3 uzun tire + 4 "ℹ" emoji + 2 isim tiresi
(Râzî–Gazâlî–İbn Arabî). Hepsi temizlendi; astra da aynı şeyi önermişti.

**Kalan:** Razi/Taberî'nin 18:25 yorumu ve "klasik gelenekte mucize diye
vurgulanmaz" iddiası nokta referansı istiyor (§13.35) — Kademe 2.3'e.

### 1.3 Küçük atıf ve biçim hataları — KISMEN TAMAM (2026-10-24)

Astra turu yapıldı. Önemli bir sonuç: raporun bazı maddeleri sitede **zaten
doğru** çıktı. Rapor körlemesine uygulanmadı.

**Düzeltilenler:**
- [x] **Rûm atfı** — "Edne'l-Arz" kartı `Rûm 30:3` diyordu, alıntıladığı
      Arapça iki âyete yayılıyor: غُلِبَتِ الرُّومُ (30:2) + فِي اَدْنَى
      الْاَرْضِ (30:3). `Rûm 30:2-3` oldu.
- [x] **Sekkâkî** — "Miftâḥu'l-ʿUlûm (12. yy)" → "(ö. 1229)". Doğrulandı:
      Sirâcüddîn es-Sekkâkî 1160-1229; eser olgunluk dönemi, yani 13. yy.
      Astra önerisi: yüzyıl tartışmasına girmeden vefat yılı yazmak.
- [x] **Richelieu** — İngilizce zaten ihtiyatlıydı ("is said to have
      remarked"), Türkçe kesin konuşuyordu ("dediği gibi"). İki dil eşitlendi:
      "Richelieu'ye atfedilen söze göre".
- [x] **"Altıncı ve son yazı"** — Rahmetin Grameri serisi 7 parça ve bütün
      mercekleri birleştiren sentez yazısı 7. olanı. "Yedinci ve son" oldu
      (İngilizcesi de).
- [x] **Sicim teorisi boyutu** — "Sicim teorisindeki 11 boyutlu uzay-zaman"
      → "Süpersicim kuramındaki 10 boyutlu uzay-zaman". 11 boyut
      M-kuramınındır. Astra uyarısı: "sicim kuramları 10 boyutludur" diye
      genelleme yapma, bozonik sicim kuramında sayı farklı. Aynı yazının
      özeti ve tefekkür indeksi de hizalandı.

**Mevcut metinde bulunamadı (değişiklik yapılmadı):**
- [x] **Feynman sözü** — rapor "kesin gibi veriliyor" diyor; sitede hem TR
      hem EN zaten ihtiyatlı ("Feynman'a atfedilen" / "attributed to").
      Astra: ifade değişikliği yapma. ⚠ Sözün doğrulanabilirliği yine de ayrı
      bir konu, Kademe 2.3'e.
- [x] **Rûm 30:2-4 künyesi** — ayrı bir kartta atıf zaten 30:2-4 ve alıntı
      gerçekten üç âyeti kapsıyor. Doğru.
- [x] **Zemahşerî mükerrer kaydı** — Kaynakça sayfasında tek kayıt
      ("Mahmûd ez-Zemahşerî, el-Keşşâf"). Mükerrer bulunamadı. Astra: bu
      hükmü taranmayan sayfalara genişletme.

**Kalan (bağlam gerekiyor, astra her biri için ne isteneceğini söyledi):**
- [ ] Tuğyan tablosunda 96:6 — astra: kastedilen kelime **لَيَطْغَىٰ** ise
      fiil muzâridir; satırı görmeden tabloyu değiştirme. Tablo henüz
      bulunamadı.
- [ ] Inception Hayatlar'da boş tablo — astra: gerçekten boş mu, yoksa
      görüntüleme sorunu mu, önce ayır.
- [ ] Ana sayfada iç not gibi duran cümle — astra: tam ifade görülmeden
      karar verilemez.
- [ ] Ölüm yılları tutarsız — astra: hicrî/miladî ayrımı ve aynı adlı
      kişilerin karışması kontrol edilsin; sırf tek tip görünsün diye tarih
      seçilmesin.
- [ ] Kaynakça biçimi tek tip — astra: eksik bilgileri tahminle doldurma.
- [ ] Elmas-grafit (kömür değil) — astra: karbon allotropları
      karşılaştırılıyorsa elmas/grafit doğru; yalnızca benzetme yapan bir
      cümlede otomatik değiştirme.

### 1.4 Terim ve atıf eşleşmeleri — KISMEN TAMAM (2026-10-24)

İlk beş madde astra turundan geçti. Astra kendi önerimdeki bir tutarsızlığı
yakaladı (Köhler 1929 için doğrulamada "baluma", düzeltmede "maluma"
yazmışım) ve aritmetiğimi düzeltti (Sebe anlatı âyetleri 32, benim verdiğim
aralıklar yanlış toplanıyordu).

- [x] **Vahdet-i vücûd / şuhûd** (`sonsuzlugun-merdiveni`, editör kutusu,
      yani bizim metnimiz) — "İbn Sînâ'nın vahdet-i vücûd ↔ vahdet-i şuhûd
      nüansı" → "İbn Arabî ekolüne nisbet edilen vahdet-i vücûd ile İmam
      Rabbânî'ye nisbet edilen vahdet-i şuhûd arasındaki nüans". İngilizcesi
      de düzeltildi.
- [x] **Âyet Grafiği öbekleri** — "İslam ilmi geleneğine göre: Tıval,
      Mufassal vb." iddiası kaldırıldı. Gruplar (Büyük Medenî, Medenî İdare,
      Kelâm ve Yaratılış…) bizim kendi tematik gruplamamız. Klasik "Tıvâl"
      terimi hiç kullanılmıyor artık ("Uzun Sûreler"), böylece 6 ↔ 7 sûre
      ihtilafına da girilmiyor. Sekme adı "İlmî Gruplar" → "Tematik Gruplar".
- [x] **Bouba/kiki künyesi** — "Köhler'in bouba/kiki etkisi, 1929" yanlış.
      Doğrulandı: Köhler 1929'da takete/baluma kullandı (1947 baskısında
      maluma); bouba/kiki biçimi Ramachandran ve Hubbard (2001). Astra'nın
      güvenli metni kullanıldı: baskı farklarını nüshadan görmeden kelime
      biçimi kesinleştirilmedi, "adlandırması onlara aittir" yerine "bouba/
      kiki biçimiyle kullanılmıştır" denildi. "Modern fonetik" → "ses
      sembolizmi araştırmaları".
- [x] **Sebe geçiş sayısı** — 20 → **2** (Neml 27:22, Sebe' 34:15). Astra
      uyarısı: 20'yi "kıssa âyeti sayısı" diye açıklama, o da tutmuyor
      (27:20-44 = 25 âyet, 34:15-21 = 7, toplam 32). İkinci bir sayı alanı
      eklenmedi; anlatı bölümleri ayrı bir not olarak yazıldı.
- [x] **Ashâb-ı Uhdûd** — iki sorun vardı. Geçiş sayısı 3 → **1** (Bürûc
      85:4). Daha önemlisi kayıt kendi içinde çelişiyordu: "ateşle helâk"
      etiketliydi, oysa ateş zalimlerin müminlere karşı kullandığı araçtı ve
      Kur'an onların dünyevî âkıbetini bildirmiyor. Astra: "yanına not
      eklemek yanlış ana etiketi düzeltmez". Etiket kaldırıldı, statü
      `gizemli` yapıldı (arayüzün kabul ettiği üç değerden biri), açıklama
      "Kur'an dünyevî âkıbetlerini açıkça bildirmez" oldu. "Kutile" için
      "beddua kipi" yerine astra'nın ihtiyatlı ifadesi kullanıldı.
      ⚠ Astra İbn Kesîr'de (Rebî' b. Enes'ten) ateşin zalimleri de yaktığına
      dair bir rivayet bulunduğunu söyledi ama isnadını teyit etmediğini
      belirtti; bu yüzden metne KONMADI. Kademe 2.3'te baskıdan doğrulanacak.
      Ayrıca Arapça alıntının ortasındaki âyet numarası ("٤") temizlendi.

**İkinci tur (aynı gün, ayrı astra turu):**

- [x] **Dâru'l-Huld kartı** — Tabiat Atlası'ndakiyle aynı sınıfta ağır bir
      bulgu. Kart CENNET adı olarak «دَارُ الْخُلْدِ» gösteriyordu; bu ibare
      Kur'an'da yalnız **Fussilet 41:28**'de ve **cehennem** için geçiyor.
      Kaynak verilen iki âyette başka ibareler var: 25:15 «جَنَّةُ الْخُلْدِ»,
      35:35 «دَارَ الْمُقَامَةِ». Yani kart iki ayrı gerçek cennet adını
      birleştirip ikisine de üçüncü bir ibarenin adını vermiş.
      Astra: "mevcut hâliyle yayımlanmamalı", kart İKİYE ayrılsın.
      Uygulandı: **Cennetü'l-Huld** (25:15) ve **Dâru'l-Mukâme** (35:35).
      Ayrıca astra'nın iki uyarısı: (1) "sakinlerinin koyduğu tek cennet
      ismidir" iddiası kaldırıldı — âyette cennet ehlinin bu ifadeyi
      KULLANMASI adı onların KOYDUĞUNU göstermez, "tek" iddiası da ayrıca
      kanıt ister; (2) 41:28 ayrımı yalnız Dâru'l-Mukâme kartına kısa bir
      not olarak kondu, ana açıklamaya karıştırılmadı.
- [x] **İsrâ "Elhamdülillah sûresi" sayılmış** — ölçüm: hamd ile açılanlar
      En'âm 6, Kehf 18, Sebe' 34, Fâtır 35 (ve Fâtiha'nın 1:2'si); İsrâ
      «سُبْحَانَ» ile açılıyor. Astra üç seçenek arasından "yanlış etiketi
      kaldır"ı seçti; yazarın karşılaştırması korundu, sınıflandırma etiketi
      çıkarıldı. Aynı yazıdaki Kehf için "Elhamdülillah sûresi" nitelemesi
      DOĞRU olduğu için dokunulmadı.
- [x] **"ve cealnâ" kalıbı** — astra'nın fazladan bulgusu. 17:46 ve 6:25
      «وَجَعَلْنَا» diyor ama Kehf 18:57 «اِنَّا جَعَلْنَا». Üçüne birden
      "ve cealnâ" denemez; ifade düzeltildi (şema başlığı, dal etiketi, TR ve
      EN özetler). Ortak örüntü zaten kalıp değil, "kalplerde ekinne,
      kulaklarda vakr" anlatımı.

**Kalan 1.4 maddeleri — ÖLÇÜM HAZIR, YERİ BULUNAMADI**

Dördünü de aradım, raporun tarif ettiği metin bu arama terimleriyle
bulunamadı. Ölçümleri burada duruyor ki sonraki tur baştan başlamasın.

- [ ] **"Yedi gök" listesi** — ölçüm tamam: «سبع» + «سماوات» birlikte
      **2:29, 17:44, 23:86, 41:12, 65:12, 67:3, 71:15**. (5:3, 12:43, 12:46
      yanlış eşleşme: oradaki "seb'" yırtıcı hayvan ve yedi başak.)
      Aranan ve bulunamayan: `"Yedi Gök"`, `"yedi gök"`, `"seven heavens"`
      → yalnız `verse-metadata.json` ve `DogaAtlasi.jsx`'in genel "semâ"
      kartı çıktı, raporun tarif ettiği liste değil.
- [ ] **Mülk -îr fasılası** — aranan: `fasıla`, `fâsıla`, `îr` +
      `Mülk 67` (isimlendirme, kuran-retorigi, surah-info). Bulunamadı.
- [ ] **Secde âyeti sayısı** — aranan: `secde` (surah-info, surah-notes;
      `surah-notes.json` zaten yok). Bulunamadı.
- [ ] **"İlâhî sıfatla biten" sûreler** — aranan: `ilâhî sıfatla`,
      `sıfatla biten`, `divine attribute`. Bulunamadı.
- [ ] **Birmingham ↔ Yaşayan Koruma tutarsızlığı** — dosyalar belli
      (`tarihsel-kanitlar.json`, `KorumaZinciri.jsx`, `TarihselKanitlar.jsx`),
      iki metnin karşılaştırılması yapılmadı.

⚠ **Not:** Bu aramaları yaparken `grep -r src/` kullanmak 183 MB'lık gömme
dosyasına giriyor ve dakikalarca sürüyor. Hedefli dizin/dosya listesiyle ara.

## KADEME 2 — Kendi kurallarımızın tutarlı uygulanması

> Bu kademenin tamamı bize **yeni politika getirmiyor**; zaten yazılı olan
> kuralların henüz taranmamış alanları. En yüksek getirili iş bu.

### 2.1 Sayılar tek kaynaktan + "nasıl sayıldı?" notu (§13.28)
- [ ] Aynı ölçünün farklı sayfalarda farklı sayısı (raporun kanıtı):
      Er-Rahmân 60 ↔ 57 ↔ 48 (doğrusu **57**) · Er-Rahîm 115 ↔ 114 ·
      Bilimsel İşaretler "4 âyet" ↔ "16" · Tarihsel İzler "üç iddia" ↔
      "10 iz" · Mukattaa Mekkî 27 ↔ 26, vahiy atfı 25 ↔ 26 (aynı sayfada) ·
      Dua Dili 10 ↔ 6 peygamber profili · Kavram sayısı 65 / 78 / "100+" ·
      Rahmân sûresi Medenî ↔ "Mekkî daha yaygın".
- [ ] Bütün sayılar tek veri dosyasından üretilsin, sayfalar onu okusun.
- [ ] Her sayının yanında "ⓘ nasıl sayıldı?" notu: hangi metin, besmele dahil
      mi, kelime/lemma/kök tanımı.
- [ ] `audit-claims.mjs`'e bu sayılar için türetme kuralı eklensin (§13.28.0).

### 2.2 Esmâ frekans listesi — KISMEN TAMAM (2026-10-24)

Raporun dört iddiasını tek tek ölçtüm. **Raporu olduğu gibi uygulamak yanlış
olurdu**; astra da beni iki yerde düzeltti.

| isim | sitede | ölçüm | raporun dediği | yapılan |
|---|---|---|---|---|
| Er-Rezzâk | 43 | **1 âyet** (51:58) | 1 | **43 → 1** |
| El-Hâdî | 59 | **10 âyet** | 10 | **59 → 10** |
| Er-Rahmân | 60 | **57** | 57 | **60 → 57** |
| El-Ehad | 32 | 32 âyet (33 kez) | "hiçbir tanımla çıkmıyor" | dokunulmadı |
| El-Melik | 72 | ayrıştırılamıyor | 13 | "doğrulanmadı" işareti |
| Er-Rahîm | 115 | — | 115 ↔ 114 | "doğrulanmadı" işareti |

**Astra beni iki kez düzeltti:**
1. Hâdî'yi 9 saymıştım; **Furkān 25:31'deki هَادِيًا biçimini kaçırmışım**.
   Doğrusu 10, yani rapor haklıymış.
2. "Ehad'da site doğru" sonucum temelsizmiş: sitenin NEYİ saydığı
   belirlenmeden "doğru" denemez. Sayıya dokunmadım ama iddiayı da geri aldım.

**Dosya kendi içinde çelişiyormuş.** `metodoloji.kalibrasyon` alanı
"Rahmân 57, Rahîm 114" diyor, ama kayıtlar 60 ve 115 yazıyordu. Rahmân için
hem kendi kalibrasyon notumuz hem ölçüm 57 dediği için düzeltildi; Rahîm'de
iki değer arasında seçim yapmak için ölçüt yok, bu yüzden işaretlendi.

**114 ismi toplu yeniden saymayı denedim ve vazgeçtim.** Otomatik sayım aracı
50 isimde fark bildirdi ama kontrol edince çoğu aracın kendi hatasıydı:
harekesiz yazımda ى/ي dönüşümü yüzünden عَلَىٰ ("üzerine") ile عَلِيّ
(el-Aliyy) aynı biçime düşüyor ve El-Aliyy için 914 gibi bir sayı çıkıyor;
bileşik adlar (Rabbü'l-Âlemîn, Şedîdü'l-İkāb) tek kelime eşleşmesiyle hiç
bulunamıyor. Toplu sayım düzelttiğinden çok hata sokardı.

**Arayüz değişikliği:** doğrulanmamış sayının HEMEN YANINDA bir işaret
çıkıyor (astra: "yalnız veriye not düşmek, sayının doğrulanmış olduğu
izlenimini sürdürür"). İşaretin üzerine gelince neyin neden doğrulanmadığı
yazıyor. Sayfanın metodoloji bölümüne de sayım ölçütü eklendi.

- [ ] **Kalan:** sitede listelenen 114 ismin tam denetimi. Astra'nın notu:
      morfolojik etiketleme zorunlu değil, harekeli metin ve bağlam üzerinden
      elle de ayrıştırılabilir. El-Melik ve Er-Rahîm bu turda çözülecek.
- [ ] Üç sütun önerisi (lafzın isim olarak geçişi / Allah'a nisbet edilen
      türevler / kök toplamı) henüz uygulanmadı; ikinci sütun bağlam
      değerlendirmesi istiyor.

### 2.3 Hadis ve rivayet standardı (§13.35)
> ⚠ Raporun hadis derecelerini KENDİMİZ doğrulayacağız; rapor hüküm değil.
- [ ] **Alak 4-5** — kalem rivayeti + "[mevzû] ilk yarattığı şey akıldır" +
      "— Hadis — Tirmizî, Ebû Dâvûd, Ahmed" dizilişi okura uydurma rivayeti
      Tirmizî'ye aitmiş gibi gösteriyor. O kaynaklardaki **kalem** rivayetidir
      (Tirmizî Kader 17 no. 2155, Tefsîr no. 3319; Ebû Dâvûd Sünnet 17
      no. 4700).
- [ ] **Allahu Ekber yazısı** — "ilk yaratılan nur, hakikat-ı ahmediye" olgu
      gibi sunuluyor; isnadı tartışmalı. Aynı sitede "ilk yaratılan kalem"
      sahih kaynaklarla veriliyor → iki yazı çelişiyor.
- [ ] **Evrim-İnanç-Resimler** — namaz hadisi kaynaksız ve yorumla karışık.
      Ebû Dâvûd Salât 26 no. 494-495 metni farklı.
- [ ] **Sema-İsim, Yaratılış-2** — "es-semâü mevcun mekfûf" delil gibi
      kullanılıyor; Tirmizî no. 3298, Dârüsselâm tahkikinde zayıf.
- [ ] **Kadınlar Atlası** — "dört kadın" için Buhârî+Müslim gösteriliyor; o
      ikisi yalnız Meryem ve Âsiye'yi anar (Buhârî 3411, Müslim 2431). Dört
      kadını birlikte sayan rivayet Tirmizî 3878.
- [ ] **Sebeb-i Nüzûl / ruh sorusu (17:85)** — kart "Yahudiler Kureyş'e
      tavsiye etti" anlatısını veriyor ve Mekkî etiketliyor; gösterilen
      Buhârî 4721'de Yahudiler doğrudan soruyor (Medine sahnesi).
- [ ] **Sebeb-i Nüzûl / teyemmüm (4:43)** — "Üseyd dua edince" → Buhârî
      334'te Üseyd dua etmez, "bu sizin ilk bereketiniz değil" der; gerdanlık
      deve kaldırılınca bulunur.
- [ ] Standart: her rivayetin altında kaynak (kitap/bab/no) + durum notu
      (sahih/hasen/zayıf/isnadsız); tek bir tahkik tercih edilip sayfa sonunda
      yazılsın; "Rivayete göre…" ile "Yazarın yorumu:" ayrılsın.

### 2.4 Kur'an'a Sor — örnek soru yanlış sonuç veriyor
- [ ] Sayfanın kendi önerdiği örnek soru ("Rahmân sûresinde aynı âyet kaç kez
      tekrar eder?") sayıyı (31) vermiyor, cümle bozuk, ilk "ilgili âyet"
      Hicr 15:87 ve 55:13 listede yok, sonuçta iç kimlik görünüyor
      (`surah-summary:55`).
- [ ] Örnek sorular için beklenen cevaplı küçük bir test listesi tutulsun, her
      güncellemeden sonra koşulsun.
- [ ] Sayı soran sorularda ilgili veri sayfasındaki değer doğrudan gösterilsin.
- [ ] İç kimlikler kullanıcıya gösterilmesin.

---

## KADEME 3 — Editoryal (astra hükmüyle)

### 3.1 "Yorum sınırları ve bağlam" bölümü
> **Astra:** DEĞİŞTİREREK UYGULA. "Zor örnekler" adı kullanılmasın; başlık
> **"Yorum sınırları ve bağlam"** olsun. Konu "Kur'an'daki sorunlu ifadeler"
> değil, **âyetlere yüklenen bilimsel anlamların sınırları** olsun.
- [ ] Bilimsel İşaretler sayfası kendi 5. ilkesinde "uyum vermeyenler
      görmezden gelinmemeli" diyor, ama 16 kartın hepsi uyum veren örnek.
- [ ] 5. ilke yeniden yazılsın (astra'nın önerdiği metin): *"Bilimsel
      eşleştirmelerde seçmeci davranılmaz; önerilen yorumların dayanakları,
      sınırları ve uyuşmazlıkları açıkça belirtilir. Değerlendirilen, Kur'an'ın
      doğruluğu değil, eşleştirmenin isabetidir."*
- [ ] Kehf 18:86 ele alınacaksa tefsir kaynakları **doğrudan kontrol edilerek**
      verilsin; "klasik müfessirler böyle açıklar" diye kaynaksız genelleme
      yapılmasın.

### 3.2 Güç etiketleri
> **Astra:** DEĞİŞTİREREK UYGULA. "Güçlü/Muhtemel/Kesin" aynı düzlemde değil
> (dayanak derecesi / olasılık / kesinlik). Yerine yazılı tanımlı
> **"Doğrudan bulgu / Dolaylı ilişkilendirme / Tartışmalı yorum"**.
- [ ] Her kartta bulgu ile onunla kurulan ilişki ayrılsın.
- [ ] "Edne'l-arz = Ölü Deniz" kartı: kendi kutusu dayanağı reddediyorsa
      "Güçlü" korunamaz. "İlk itirazda düştü" ifadesi polemikçi; somut itiraz
      yazılsın.
- [ ] Birmingham: asıl nüans aralık olması değil — **radyokarbon parşömeni
      tarihler, mürekkebi veya yazıya geçirilişi değil**.
- [ ] Semûd "Güçlü" ↔ kutu "Nabatî anıtlarını bizzat yaptığı iddia
      edilmemelidir"; İrem "Muhtemel" ↔ İrem-Ubar eşlemesi akademide kabul
      görmüş değil.
- [ ] "Kanıt" kelimesi gözden geçirilsin — ama astra uyarısı: **mekanik olarak
      "örtüşme"ye çevirme**; tarihsel olgu için kullanılan "kanıt" meşru.

### 3.3 Nüans ana metne taşınsın
> **Astra:** DEĞİŞTİREREK UYGULA — ama asıl çözüm kutuya uyarı eklemek değil,
> **ana iddiayı baştan doğru kurmak**.
- [ ] Zerre (99:7-8): ana metin "'atom ölçeğinde' anlamına gelir" ↔ kutu
      "kesin bir modern iddia değil". Astra'nın önerdiği ana metin: *"'Zerre',
      çok küçük bir miktarı ifade eder; kelimeyi burada doğrudan modern atom
      kavramıyla özdeşleştirmek isabetli değildir."*
- [ ] Zümer 39:5: ana metin "düz-yer modelinde olamayacak bir olgu" ↔ kutu
      "delil kurmak hem gereksiz hem zayıftır".
- [ ] İmkânsız Ritim ana sayfa kartı: "7. yüzyılda söz ya 16 vezinden birine
      bağlı şiirdi ya da düzyazı" → aruzun 16 vezni **8. yüzyılda** Halîl b.
      Ahmed'le tasnif edildi; secî geleneği bu ikilide yok. Ayrıntı sayfası
      ikisini de doğru anlatıyor.
- [ ] Kur'an'ı Tanı: "asla rastlantı olamayacak denklikler" ve "Eksiklik
      fazlalıkla dengelendi" → kendi Sayılar sayfamızın "örüntü çıkarmaz"
      ilkesiyle çelişiyor.
- [ ] Önce başlık ve ana metin düzelsin; sonra kısa nüans kapalı görünümde de
      görünsün. Gri satır düşük kontrastla okunamaz hâle gelmesin (§13.26).

### 3.4 Tefekkür yazıları
> **Astra:** DEĞİŞTİREREK UYGULA. "İmzalı görüşe saygı, olgusal yanlışları
> düzeltmeden yayımlama muafiyeti sağlamaz." Önce **yazar onayıyla metin
> düzeltilsin**; özgün metin aynen korunacaksa hatanın **yanına** editör notu.
> §13.24'ün tefekkür muafiyeti GÖRÜŞÜ korur, OLGUYU değil.
- [ ] Bucaille evrimi kabul eden "Müslüman âlimler" listesinde → "Fransız
      hekim ve yazar". "Müslüman âlim" nitelemesi ayrı dayanak ister; evrim
      görüşü de ayrıca incelenmeli.
- [ ] Terminoloji-1: "kuantum belirsizliği kâinatın kapalı sistem olmadığını
      gösterir" → bu sonuç belirsizlikten çıkmaz.
- [ ] Terminoloji-3: ölçüm problemi "gözlemciyi ayrı bir varlık kabul etmeye
      zorlar" → dekoherans, çok-dünya ve Bohm yorumları bilinçli gözlemci
      gerektirmez.
- [ ] Kader yazısı "bilimsel zemine taşır".
- [ ] "İslâm tarihinde âlimlerin çok büyük kısmı hemfikirdir" → kaynaklandır
      ya da kapsamı daralt.
- [ ] Terminoloji-4: "Eş'arîlerin cüz-ü lâ yetecezzâsı uzayın içinde değildir"
      → klasik kelâmda cevher-i ferd tanım gereği mütehayyizdir. Çağdaş yorum
      olarak etiketlensin.
- [ ] Sema-İsim: "isim ile semâ aynı س-م-و kökünden" olgu gibi veriliyor;
      bu **Basra** dilcilerinin görüşü, Kûfeliler و-س-م'den türetir
      (İbnü'l-Enbârî, el-İnsâf).
- [ ] Rahmetin Grameri-2: "hukuk çekirdeği mimarinin tam merkezinde" →
      Bakara'nın orta âyeti 2:143; aile hukuku (2:221-242) %77-85 aralığında.
      Site içinde üç ayrı "merkez" var (Farrin'in kıble bölümü, 2:255 "kalbi").
- [ ] Rahmetin Grameri-5: İbn Arabî'ye atfedilen "üç talâk = üç kopuş" için
      Fütûhât'tan yer gösterilsin. Serinin hiçbir yazısında editör kutusu yok.
- [ ] "Editoryal hakemlik uygulanmadı" notu yazının **başına** taşınsın.
- [ ] Bilim içeren yazılara "bilim notu" — astra: **her yazıya otomatik değil,
      gerekli yerlere**.
- [ ] "Geçmiş Klasik, Gelecek Kuantum" yazısının hiç Kur'an içeriği yok →
      kategori içerik esas alınarak düzenlensin.
- [ ] Graf sayfaları (Semantik Harita, Âyet Grafiği): üstte tek cümle — "Bu
      gruplar makine hesabıdır, tefsir değildir."

---

## KADEME 4 — Gizlilik (rapor 🟠 dedi, BİZ 🔴 diyoruz)

> Raporun bilmediği bir şey var: Kur'an'a Sor sorguları KV'de **TTL'siz,
> sonsuza kadar** saklanıyor (`concierge-kv.js:15`, kod tabanında `ltrim`/
> `zrem`/`zremrangebyrank` hiç yok). Üç şey üst üste biniyor ve birlikte
> sitenin kendi beyanıyla çelişiyor.

- [ ] Ana sayfa "yaşadığın bir durumu yaz" diye **hassas** veri davet ediyor.
- [ ] Soru **adres çubuğuna** yazılıyor (`?q=…`) — tarayıcı geçmişi, referrer,
      ekran paylaşımı.
- [ ] Sayfa "hiçbir kişisel veri saklanmaz" diyor; oysa süresiz arşivleniyor.
- [ ] Kısa bir Gizlilik/KVKK sayfası: hangi veri, hangi hizmet, ne kadar süre.
- [ ] Soru adres çubuğuna yazılmasın ya da kullanıcı uyarılsın.
- [ ] **KV arşiv politikası kararı** (kullanıcıya soruldu, yanıt bekleniyor):
      (a) zset'lere tavan · (b) IP başına günlük yazım kotası — **önerilen** ·
      (c) degraded modda loglamayı atla · (d) karma.
- [ ] (Hukuki danışmanlık değildir; KVKK yükümlülükleri için uzmana danışılmalı.)

---

## KADEME 5 — Telif ve lisans (rapor §4)

> Rapor "hukuki danışmanlık değildir" diyor; biz de öyle ele alıyoruz.
> Kesin karar için ilgili kurum/yayınevi/hukukçu.

- [ ] **Mealler** (Diyanet, Suat Yıldırım, Yaşar Nuri Öztürk, Süleymaniye
      Vakfı, Edip Yüksel): telifli. Her biri için izin ayrı sorulsun, yazılı
      saklansın. Âyet altında meal adının yazılması iyi uygulama — zaten var.
- [ ] **Elmalılı**: 1942'de vefat, özgün metin büyük ihtimalle kamu malı;
      sadeleştirilmiş baskıların ayrı hakları olabilir, kullanılan baskı
      belirtilsin.
- [ ] **Kur'an Yolu** eklenirse izin gerekir (zaten metin kopyalanmadı, yalnız
      bağlantı verildi — `e779fe30`).
- [ ] **Tanzil (CC BY 3.0)**: metnin değiştirilmeden kullanılmasını şart
      koşuyor; sitede "encoding normalize edildi" yazıyor. Uyum kontrol
      edilsin, açık atıf ve bağlantı verilsin.
- [ ] **Hayrat Neşriyat mushaf görselleri**: yayınevi izni belirtilsin.
- [ ] **Quran.com API, EveryAyah, AçıkKur'an**: kullanım koşulları Kaynakça'ya
      not edilsin.
- [ ] **Tefekkür yazıları**: 53 yazı + İngilizce çeviriler + sitenin yaptığı
      düzenlemeler için sözlü izin var; kısa bir **yazılı** izin (e-posta)
      alınsın. Yazar adı tek biçimde yazılsın: ana sayfa "Sufist", yazılar
      "Felsufi".

---

## KADEME 6 — Diğer

- [ ] "Ekip ve danışmanlar" bölümü (hazırlayan / ilmî danışman bilgisi yok).
- [ ] Sayaçlar HTML'de 0 görünüyor, bazı sayfalar istemcide yükleniyor.
      ⚠ Kısmen aşılmış: `audit-ssr` kapımız var, son ölçüm eşik altı **0/26**.
      Hangi sayaçların kaldığı ayrıca taranacak.

---

## İLERLEME KAYDI

| tarih | kademe | ne yapıldı | commit |
|---|---|---|---|
| 2026-10-24 | 0 | Rapor okundu, 8 iddia kendi metnimizle doğrulandı, astra editoryal hüküm verdi, bu liste oluşturuldu | — |
| 2026-10-24 | 1.1 | Tabiat Atlası 8 kart düzeltildi (astra turu yapıldı, 12 bulgusu uygulandı) | — |
| 2026-10-24 | 1.2 | Metinle çelişen 9 ifade düzeltildi (astra turu; 3 yerde beni düzeltti) | — |
| 2026-10-24 | 1.3 | 5 küçük hata düzeltildi; 3 rapor maddesi sitede zaten doğru çıktı, dokunulmadı | — |
| 2026-10-24 | 1.4 | Terim/atıf eşleşmelerinden 5'i düzeltildi (astra önerimdeki bir tutarsızlığı yakaladı) | — |
| 2026-10-24 | — | **Üç denetim kapısının ölü olduğu bulundu ve düzeltildi** (§13.15, §13.34, §13.32): `changed.mjs` yolları repo köküne göre döndürüyordu, kapılar `^src/`/`^public/` süzüyordu, hiçbiri eşleşmiyordu | — |
