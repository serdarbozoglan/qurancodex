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

### 1.2 Metinle çelişen diğer ifadeler
- [ ] **Dua Dili** — "Hiçbir dua 'yâ' ile başlamaz" → «يَا رَبِّ» 25:30 ve
      43:88'de var. "Çok büyük çoğunluğu…; istisnalar 25:30, 43:88".
- [ ] **Altı Konu (18:25)** — "309,017" ve "tam olarak" → işlem 309,211.
      Zaman Boyutları sayfası doğru veriyor. Sayı düzelsin, "yaklaşık" densin.
- [ ] **Esmâ** — "yalın yüzey «الله» ~1.813" → ölçüm 2.153 (bizim sayımımız
      2.155). `EsmaFrekans.jsx:34` `ALLAH_SURFACE_COUNT` ve
      `esma-frekans.json`. Sayının neyi saydığı yazılsın.
- [ ] **Sebeb-i Nüzûl** — zina cezası: "İslam öncesi … (Nisâ 4:15)" → 4:15 bir
      Kur'an hükmüdür. "Nisâ 4:15'teki ilk hüküm…" diye düzeltilsin.
- [ ] **Sıfır Gereksizlik** — "14.870 formdan tek âyette geçen ~455" → sitenin
      kendi tanımıyla 8.820. Tanım düzeltilsin.
- [ ] **Yaratılış Hikâyesi-2** — "Allah meleklere 'Ben', insanlara 'Biz' diye
      hitap eder" → «وَإِذْ قُلْنَا لِلْمَلَائِكَةِ» 5 âyette (2:34, 7:11,
      17:61, 18:50, 20:116); insanlara "Ben" 2:152, 2:186, 51:56. Genelleme
      kaldırılsın ya da daraltılsın.
- [ ] **Halka Kompozisyon** — "Şafiî sayımı … besmele mezhep meselesidir" →
      numaralandırma fıkıh mezhebinin değil **sayım ekolünün** (Kûfî, Basrî)
      konusu. Ana sayfadaki doğru ifade buraya da konsun.
- [ ] **Tarihsel İzler (Zülkarneyn)** — "Kiros'un Gorgan/Derbent sınırına inşa
      ettiği duvar" → Gorgan Seddi ve Derbent surları Sâsânî (MS 5.-6. yy).
      ⚠ ÖNCE birincil kaynaktan doğrula.
- [ ] **Cennet, Cin, Mecnun** — «جنات» için "Secde 32:17" → 32:19.

### 1.3 Küçük atıf ve biçim hataları (🟢 listesi)
- [ ] Zemahşerî kaynakçada iki kez listelenmiş.
- [ ] Sekkâkî 12. değil **13.** yüzyıl.
- [ ] Ölüm yılları tutarsız (hangi kayıtlar olduğu taranacak).
- [ ] Tarihsel Kanıtlar «غلبت الروم في أدنى الأرض» atfı 30:3 değil **30:2-3**.
- [ ] Tuğyan tablosunda 96:6 mâzî satırında; fiil **muzâri**.
- [ ] Rahmetin Grameri-1 "altıncı ve son yazı" diyor; seri **7** parça.
- [ ] Inception Hayatlar'da boş tablo.
- [ ] Sicim teorisi **10** boyut (11 M-teorisi).
- [ ] "Bir kavramı basitçe anlatamıyorsan…" sözü Feynman'a **belgelenmemiş**.
- [ ] Richelieu sözü "atfedilen" diye verilsin.
- [ ] Elmas–grafit örneği (kömür değil).
- [ ] Ana sayfada iç not gibi duran bir cümle var (bulunacak).
- [ ] Kaynakça biçimi tek tip olsun.

### 1.4 Terim ve atıf eşleşmeleri (olgusal olanlar)
- [ ] **Sonsuzluğun Merdiveni** — "İbn Sînâ'nın vahdet-i vücûd ↔ vahdet-i
      şuhûd nüansı" → vahdet-i vücûd **İbn Arabî** ekolüne, vahdet-i şuhûd
      **İmam Rabbânî**'ye nisbet edilir.
- [ ] **Kur'an Mesajına Yabancı Kalmak** — İsrâ "Elhamdülillah sûresi"
      sayılmış; İsrâ «سبحان» ile açılır. Hamd ile açılanlar 1, 6, 18, 34, 35.
      Kendi Münâsebât sayfamız da böyle diyor.
- [ ] **Âyet Grafiği** — "klasik öbekler: Tıval (6 sûre)…" → klasik tasnif
      **Tıvâl (7) · Mieîn · Mesânî · Mufassal**. Bizim öbeklerimiz kendi
      gruplarımız, öyle adlandırılsın.
- [ ] **Bouba/kiki** — deney Köhler 1929 "takete/maluma"; "bouba/kiki"
      Ramachandran & Hubbard 2001.
- [ ] **Dâru'l-Huld** — Cennet-Cehennem'de cennet adı olarak veriliyor
      (25:15, 35:35). «دار الخلد» yalnız **41:28**'de ve **cehennem** için;
      25:15'te «جنة الخلد», 35:35'te «دار المقامة».
- [ ] **Kavimler Atlası** — Uhdûd etiketi çelişiyor; Sebe 2 kez (site 20);
      «الأخدود» 1 kez (site 3).
- [ ] **"Yedi gök" listesi** — 17:44 ve 23:86 eksik.
- [ ] **Mülk -îr fasılası** — "ilâhî sıfatlardan örülmüş" → -îr ile biten 13
      âyetin 3'ü ilâhî isim.
- [ ] **Secde âyeti sayısı** — iki sayım karışmış; secde işareti metinde 15
      yerde, sitede iki farklı 14'lü liste var.
- [ ] **"İlâhî sıfatla biten" sûreler** — site 13 ve 9 diyor; aynı tanımla
      sayım 22 veriyor.
- [ ] **Birmingham kutusu ↔ Yaşayan Koruma** — "en eski" ve "hepsi aynı
      çekirdek" ifadeleri birbirini tutmuyor.

---

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

### 2.2 Esmâ frekans listesi — ölçüt karışıyor
- [ ] Doğru çıkan sayılar (Alîm 161, Hakîm 97, Azîz 99) kelimenin **bütün**
      geçişlerini sayıyor, Allah'a nisbet edilmeyenler dahil (12:30'daki
      "aziz" unvanı, «القرآن الحكيم»).
- [ ] Hiçbir tanımla yeniden üretilemeyenler: Rezzâk 43 (lafız 1 kez, 51:58) ·
      Hâdî 59 (10 kez) · Melik 72 (13 kez) · Ehad 32 (kelime 53, ilâhî isim
      olarak yalnız 112:1).
- [ ] Her isim için üç sütun: (a) lafzın Allah'a isim olarak geçişi,
      (b) Allah'a nisbet edilen türevler, (c) kökün toplamı.
- [ ] Celâl/Cemâl oranı yalnız (a) ile hesaplansın.

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
| 2026-10-24 | — | **Üç denetim kapısının ölü olduğu bulundu ve düzeltildi** (§13.15, §13.34, §13.32): `changed.mjs` yolları repo köküne göre döndürüyordu, kapılar `^src/`/`^public/` süzüyordu, hiçbiri eşleşmiyordu | — |
