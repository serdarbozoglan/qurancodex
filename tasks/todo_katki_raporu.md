# KATKI RAPORU — UYGULAMA LİSTESİ

> **Kaynak:** `external_resources/katki-raporu.pdf` — "QuranCodex Katkı ve
> Değerlendirme Raporu", Sürüm 1.0, 2026-10-22. Dışarıdan gelen, 10 sayfalık,
> kendi sayım betikleriyle (Tanzil Hafs/Kûfî, Python) hazırlanmış bir inceleme.
> Kapsam: ana sayfa, 15 bölüm, ~50 araç/atlas sayfası, 53 tefekkür yazısının
> tamamı. 587 Arapça âyet alıntısının hepsi tutarlı bulunmuş.
>
> **Paralel çalışma (kullanıcı direktifi 2026-10-24):** iş, dosya kümeleri
KESİŞMEYEN ajanlara bölünebilir; aynı dosyada iki ajan çalışmaz. Ajanlar
git komutu çalıştırmaz (indeks yarışı olmasın), commit tek elden atılır.
Her ajan astra hakem turundan geçmek zorundadır.

**Çalışma kuralı (kullanıcı direktifi 2026-10-24):** maddeler SIRAYLA
> yapılır; her değişiklik için astra hakem turu ZORUNLU; emin olmadan
> değiştirilmez; değişiklik commit edilir, bu liste güncellenir ve `main`'e
> push edilir.
>
> **Bu dosya SÜREKLİ güncellenir (kullanıcı direktifi 2026-10-24):** bir madde
> astra turundan geçip COMMIT EDİLDİKTEN sonra, aynı turda bu listeye işlenir.
> Sıra: ölç → astra → uygula → doğrula → commit → **todo** → push.
> Bir maddenin kutusu, commit'i atılmadan işaretlenmez.

---

## DURUM ÖZETİ (2026-10-24)

| kademe | konu | durum |
|---|---|---|
| 1.1 | Tabiat Atlası: âyette geçmeyen Arapça | ✅ bitti (8 kart) |
| 1.2 | Metinle çelişen dokuz ifade | ✅ bitti |
| 1.3 | Küçük atıf ve biçim hataları | ◐ 5 düzeltildi, 4 madde bağlam bekliyor |
| 1.4 | Terim ve atıf eşleşmeleri | ✅ bitti (13 madde) |
| 2.1 | Sayılar tek kaynaktan + "nasıl sayıldı" | ○ başlamadı |
| 2.2 | Esmâ frekans listesi | ◐ 3 düzeltildi, 2 işaretlendi, 114'ün denetimi kaldı |
| 2.3 | Hadis ve rivayet standardı | ◐ 7 künye doğrulandı, 2 madde kaldı |
| 2.4 | Kur'an'a Sor örnek sorusu | ✅ bitti |
| 3.1-3.4 | Editoryal (astra hükümleri hazır) | ○ başlamadı |
| 4 | Gizlilik + KV arşiv politikası | ✅ bitti (3 yeni madde açıldı) |
| 5 | Telif ve lisans | ⛔ kullanıcı: şimdilik dokunma |
| 6 | Diğer | ○ başlamadı |

**Yan kazanç:** Kademe 1 sırasında **üç denetim kapısının ölü olduğu** bulundu
ve düzeltildi (§13.15 Arapça, §13.34 humanizer, §13.32 âyet referansı).
Aylardır hiçbir şey taramadan yeşil yanıyorlardı.

**Tekrarlayan ders:** bu çalışmada kendi ölçüm araçlarıma **dört kez**
güvenemedim (Tabiat Atlası taraması 29/41 sahte bulgu, maddah işareti, kırık
çoğul, ve ى/ي dönüşümünün عَلَىٰ ile عَلِيّ'i birleştirip El-Aliyy'e 914
vermesi). Oran şüpheli geldiğinde önce aracı sorgulamak gerekiyor (§13.26'nın
aynı dersi).

**Raporun kendisi de her zaman haklı değil.** Üç maddesi sitede zaten doğru
çıktı (Feynman atfı, Rûm 30:2-4 künyesi, Zemahşerî mükerrer kaydı), bir
maddesi tutmadı (Ehad 32), bir maddesinde ne rapor ne site doğruydu (Melik).
Buna karşılık iki kez rapor haklıydı ve ben yanılmıştım (Hâdî'de Furkān
25:31'i kaçırmıştım).

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

**Kalan 1.4 maddeleri — TAMAM (2026-10-25, paralel ajanla)**

Beşinin de yeri bulundu. Astra ajanı altı yerde düzeltti.

- [x] **Yedi gök listesi** (`kuran-sayilar.json`) — ölçüm: «sebʿ»+«semâvât»
      birlikte tam 7 âyet (2:29, 17:44, 23:86, 41:12, 65:12, 67:3, 71:15);
      beşi nekre, 17:44 ve 23:86 marife. Sitede 17:44 ve 23:86 EKSİKTİ;
      buna karşılık listede olan 78:12 ve 23:17'de "semâvât" lafzı geçmiyor.
      Astra: tek liste ver, nekre/marife ayrımını nota bırak; beş nekre
      örneğini "yedi gök yarattı" diye açıklama (2:29 ve 41:12 farklı
      fiiller); 78:12 ve 23:17 tutulabilir ama o âyetlerin göklerle ilgili
      yorumunu dışlayan bir hükme dönüştürülmeden.
- [x] **Mülk "-îr" fasılası** (`ImpossibleRhythm.jsx`) — "üçü de Esmâ-i
      Hüsnâ, fasıla mührü ilâhî sıfatlardan örülmüştür" sonucu seçilen
      örneklerden üretilmişti. 13 âyetin son kelimesi tek tek okundu:
      yalnız 3'ü Allah'a nisbet edilen sıfat. Astra'nın metni kullanıldı,
      ölçüt ses temelli kuruldu, örnekler çeşitlendirildi.
- [x] **"İlâhî sıfatla biten" sûreler** (`ilk-son-kelimeler.json` +
      `IlkSonKelimeler.jsx`) — dosya kendi içinde çelişiyordu: `count` 9,
      `closerTags` 13 sûre; bileşen sayıyı etiketlerden türetip 13
      gösterirken düzyazı sabit "9" yazıyordu. Raporun gördüğü "13 ve 9"
      buydu. 114 sûrenin son kelimesi bağlamında okundu: **19**. Raporun
      22'si de yeniden üretildi ve dosyanın beyan ettiği yöntemin sonucu
      olduğu görüldü. Astra iki metin hatası düzeltti: 110:3 "tevvâben"
      ("et-Tevvâb" değil), ve 112:4'teki "ahad" "denk" diye çevrilemez.
- [x] **Birmingham ↔ Yaşayan Koruma** — çelişki ajanın kendi dosyalarında
      değil, `homeCards.js` ("en eski parça") ve i18n Sana sayacında
      ("EN ERKEN KARBON TARİHİ") çıktı. İki üstünlük iddiası birbirini
      dışlıyordu ve aralıklar örtüşüyor (568-645 ↔ 578-669). İkisi de
      kaldırıldı, tarihin parşömene ait olduğu ve 2015'in duyuru yılı
      olduğu belirtildi.
- [~] **Secde âyeti sayısı** — kısmen. ⚠ Kanonik metnimizde secde işareti
      HİÇ YOK (U+06E9, U+06DD, U+06DE: üçü de 0), yani raporun "15"i bizim
      verimizden türetilemez; hiçbir yere yazılmadı. Raporun dediği "iki
      farklı 14'lü liste"den yalnız BİRİ bulundu (`ReadingMode.jsx:691`).
      Bulunan gerçek karışma `surah-info.json`'daki Hac notuydu ("içinde
      iki secde ayeti bulunan nadir sûrelerden biri"), düzeltildi.

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

### 2.3 Hadis ve rivayet standardı — BAŞLADI (2026-10-24)

> ⚠ Raporun hadis dereceleri körlemesine uygulanmıyor; rapor da "derece
> notları aktarılmıştır, bir hüküm değildir" diyor. Her künye kaynağından
> doğrulanıyor (§13.30).
>
> **Erişim notu:** sunnah.com doğrudan isteklerimizi engelliyor (403).
> Doğrulama arşivlenmiş nüshalar üzerinden yapıldı. Astra: "arşivlenmiş
> sayfa o sayfanın içeriğini belgelemek için kullanılabilir; doğrudan neşir
> kontrolüyle aynı şey değildir" — sınırlılık olarak kaydedildi.

- [x] **Kadınlar Atlası, "dört kadın" rivayeti** — künyelerden doğrulandı:
      · **Buhârî 3411** (Enbiyâ, 32. bab): "kadınlardan Firavun'un karısı
        Âsiye ve İmrân kızı Meryem dışında kimse kemâle ermemiştir"; ayrıca
        Âişe'nin tiride benzetilen üstünlüğü.
      · **Müslim 2431** (Fedâilü's-Sahâbe, Hz. Hatice babı): aynı muhteva,
        yine yalnız Meryem ve Âsiye.
      · **Tirmizî 3878** (Menâkıb 62; kitap içi 49/278): "Meryem bint İmrân,
        Hatice bint Huveylid, Fâtıma bint Muhammed ve Firavun'un karısı
        Âsiye yeter" — dört kadın BİRLİKTE burada. Tirmizî: "hadîs sahîh".
      Rapor haklıymış. Site iki yerde dört kadını Buhârî ve Müslim'e
      atfediyordu; ikisi de düzeltildi (TR ve EN).
      Astra'nın üç düzeltmesi uygulandı: (1) "Buhârî ve Müslim'de yok"
      diye genelleme yapma, "verilen atıflar bu ifadeyi desteklemiyor" de;
      (2) "yalnız Meryem ile Âsiye'yi anıyor" yanıltıcı, aynı rivayette
      Âişe de var, "kemâle erme ifadesinde" de; (3) Sahihayn için ayrıca
      "sahih" yazmaya gerek yok, Tirmizî için yeterli.

**Kalan rivayet maddeleri (her biri kaynaktan doğrulanacak):**
- [x] **Alak 4-5: kalem ve "akıl" rivayetlerinin karışması** — tek alıntı
      kutusunda iki ayrı rivayet vardı ve kaynak satırı en altta durduğu için
      okur onu, kendi parantezi "uydurma" diyen son cümleye ait sanıyordu.
      İngilizcesinde uydurma uyarısı HİÇ yoktu.
      Künyeler doğrulandı: **Tirmizî 2155** (Kader, kitap içi 32/23, Ubâde b.
      Sâmit'ten, Dârüsselâm: Sahih) ve **Ebû Dâvûd 4700** (Sünne, Kader babı,
      42/105, aynı râvi, Elbânî: Sahih).
      Yapılan: kalem rivayeti künyesiyle birlikte kendi kutusunda kaldı;
      "akıl" rivayeti ayrı bir editör notuna taşındı. Astra'nın üç şartı
      uygulandı: (1) doğrulayamadığım **Ahmed b. Hanbel** kaynak satırından
      çıkarıldı; (2) isimsiz "hadis âlimlerinin çoğunluğunca" iddiası
      kaldırıldı ("birkaç isim sıralamak çoğunluk iddiasını doğrulamaz");
      (3) yerine İbn Teymiyye ve İbn Hacer adları §13.30 gereği ihtiyatlı
      dille verildi ve "burada dinî delil olarak kullanılmamaktadır" cümlesi
      eklendi.
      **Yan bulgu:** `PullQuote` bileşeni İngilizce künye desteklemiyordu,
      Türkçe kaynak satırı İngilizce sayfada da görünüyordu. `sourceEn`
      eklendi; `sourceEn` vermeyen eski bloklar aynı şekilde çalışıyor.
      ⏳ Astra'nın ayrıca not ettiği bir nokta yazarla konuşulacak: Alak 4-5
      kalemle öğretmeyi zikreder, kalemin ya da aklın ilk yaratılan olduğunu
      söylemez; rivayet tartışması âyetin doğrudan beyanı gibi sunulmamalı.
- [x] **Allahu Ekber: "ilk yaratılan nur"** — ifade kaldırıldı, "yazarın
      temsilinde" çerçevesine alındı. Künyesi, isnad durumu ve Musannef'te
      bulunmadığı iddiası DOĞRULANAMADI; hiçbiri yazılmadı, yalnız
      "doğrulanmış bir hadis künyesi veremiyoruz" denildi (astra onayladı).
      Karşılaştırma için kalem rivayetinin doğrulanmış künyeleri konuldu.
      Astra iki ek: Necm 53:9 referansı ve "Allah'a mekân/mesafe nispet eden
      bir anlatım gibi bırakılmamalı" kaydı. Yazım: "hakikat-ı ahmediye" →
      "hakikat-i Ahmediye".
- [x] **Evrim-İnanç-Resimler: namaz hadisi** — Ebû Dâvûd **494** (2/104,
      Sebre) ve **495** (2/105, Abdullah b. Amr), 26. bab, Elbânî: hasen
      sahih. Doğrulandı: yedi yaş namaz EMRİ, on yaş vurma; ne "bir daha
      dövmeyin" ne "yedi yaşında vurma" kaydı var. Yanlış lafız tırnaktan
      çıkarıldı, künye notu eklendi, fıkhî hüküm vermediği yazıldı.
- [x] **Sema-İsim + Yaratılış-2: "es-semâü mevcun mekfûf"** — Tirmizî 3298
      doğrulandı (Tefsîr 47, Hadîd babı, kitap içi 47/350; Katâde → el-Hasan →
      Ebû Hüreyre). Dârüsselâm: **zayıf**. Tirmizî: "garîb"; ayrıca el-Hasan'ın
      Ebû Hüreyre'den işitmediği kaydı var. Astra uyarısı üzerine üçü AYRI
      AYRI verildi ("garîb tek başına zayıf demek değildir").
      **İki yeni bulgu (raporda yoktu):** (1) lafız "es-semâü mevcun mekfûf"
      değil; metin «الرَّقِيعُ سَقْفٌ مَحْفُوظٌ وَمَوْجٌ مَكْفُوفٌ» diyor.
      (2) rivayet göğün "önce homojen sonra katmanlı" olduğunu söylemiyor.
      Yaratılış-2'de gövdede hiç alıntılanmayan bir hadise atıf yapan cümle
      astra'nın hükmüyle TAMAMEN kaldırıldı ("olmayan bir alıntıyı notta
      varmış gibi açıklamak yanıltıcı").
- [x] **Sebeb-i Nüzûl: teyemmüm ve ruh sorusu** (`65e0b352`) — iki künye
      arşivlenmiş sunnah.com üzerinden doğrulandı.
      · **Teyemmüm (Buhârî 334,** Hz. Âişe'den, Mâlik → Abdurrahman b.
        el-Kāsım → babası → Âişe**)**: site "Üseyd b. Hudayr dua edince deve
        kalktı ve gerdanlık bulundu" diyordu. Rivayette Üseyd DUA ETMİYOR;
        "Ey Ebû Bekir ailesi, bu sizin ilk bereketiniz değildir" diyor.
        Gerdanlık, devenin kaldırılmasından SONRA altında bulunuyor.
      · **Ruh sorusu (Buhârî 4721,** Abdullah b. Mes'ûd'dan**)**: site
        "Yahudiler Kureyş'e üç soru sormalarını tavsiye etti" anlatısını
        verip kaynak olarak Buhârî gösteriyordu. Buhârî 4721'de Yahudiler
        soruyu DOĞRUDAN Hz. Peygamber'e soruyor.
      Astra üç yerde düzeltti: (1) rivayet "teyemmüm âyeti" diyor, numara
      vermiyor ve Mâide 5:6 da teyemmüm hükmü içerir, bu yüzden Nisâ 4:43'e
      doğrudan bağlanmadı ve başlık "Teyemmüm Âyetinin Nüzûlü" oldu;
      (2) "sıra tersine çevrilmiş" iddiam fazla kesindi, eksik olan âyetin
      inişinin hiç anılmamasıydı; (3) "tarla" tasviri tek başına şehir
      belirlemez, sûrenin tasnifi ile âyetin nüzûl dönemi ayrı şeylerdir.
      "Kureyş'e tavsiye" anlatısı kaldırılmadı, kaynağı doğrulanmadığı
      belirtilerek anıldı (astra: "muhtemelen Vâhidî'de" yayımlanacak bir
      künye olamaz). Her iki kayda görünür `hadithRefs` künyesi eklendi;
      görünmeyen not alanı kaldırılıp metin özete taşındı.
- [ ] **Bediüzzaman pull-quote künyesi** (astra'nın açtığı YENİ madde):
      yaratilis-hikayesi-2, blok 10'daki "Semâ, dalgaları karardâde olmuş
      bir denizdir" alıntısının eser ve yer künyesi yok. Doğrulanmadı,
      dokunulmadı.
- [ ] **`single-divine-name` etiketi 63. sûrede** (ajanın beşin dışında
      bulduğu veri hatası): 63'ün son kelimesi «تَعْمَلُونَ», ilâhî isim
      değil. Etiket arayüzde çip olarak basılıyor.
- [ ] **Secde listesi âyet numaraları** (`ReadingMode.jsx:691`): yaygın
      Hanefî/Diyanet işaretlemesi 16:50, 17:109, 27:26, 41:38 kullanıyor;
      listede 16:49, 17:107, 27:25, 41:37 var. Ayrıca "(Hanafi)" kaydı
      yalnız kod yorumunda, arayüzde rozet sadece "Secde" diyor.
- [ ] **Birmingham kaynağı Wikipedia** (`tr.json:834`) — §13.35 bunu
      künye saymıyor.
- [ ] Ashâb-ı Uhdûd: İbn Kesîr'de Rebî' b. Enes'ten nakledilen rivayet
      (Kademe 1.4'ten devredildi).
- [ ] Standart: her rivayetin altında kaynak + durum notu; tek tahkik
      tercihi sayfa sonunda; "Rivayete göre…" ile "Yazarın yorumu:" ayrımı.

### 2.4 Kur'an'a Sor — TAMAM (2026-10-25, paralel ajanla)

- [x] Sayfanın kendi örnek sorusu ("Rahmân sûresinde aynı âyet kaç kez
      tekrar eder?") canlıda birebir üretildi; raporun dört kusuru da
      doğrulandı ve kapatıldı: sayı yok → **31**; cümle bozuk → ölçülmüş
      cümle; ilk âyet Hicr 15:87 → **verse:55:13**; `surah-summary:55`
      sızıntısı → yok.
- [x] **Raporda olmayan beşinci kusur:** bozuk cevap KV önbelleğinde 7 gün
      duruyordu, yani düzeltme yapılsa bile eski metin servis edilmeye
      devam edecekti. Önbellek anahtarı sürümlendi.
- [x] Üç kök sebep ayrı ayrı çözüldü: iç kimlik sızıntısında hem istem
      kuralı yoktu hem çıktı süzülmüyordu (kalkan kondu); sayı adaylarda
      hiç yazılı olmadığı için model uydurma cümleyle dolduruyordu
      (`direct-answer.js` sayıyı korpustan sayıyor); anlam araması
      "tekrardan bahseden" âyeti buluyordu (sayı sorularında nakarat âyeti
      başa alınıyor).
- [x] Regresyon betiği: `scripts/test-concierge.mjs`, 7 vaka, beklentiler
      dosyada yazılı, sunucusuz kipte de koşuyor.
- [ ] **Kalan:** anlam aramasının sıralaması değişmedi; sayı sorusu olmayan
      "Rahmân'daki tekrar âyeti hangisi?" gibi bir soruda hâlâ 15:87 öne
      geçebilir. Gerçek çözüm korpus tarafında (nakarat âyetlerine tekrar
      bilgisini arama metnine katmak) ve embedding rebuild gerektiriyor.

## KADEME 3 — Editoryal (astra hükmüyle)

### 3.1 "Yorum sınırları ve bağlam" bölümü
> **Astra:** DEĞİŞTİREREK UYGULA. "Zor örnekler" adı kullanılmasın; başlık
> **"Yorum sınırları ve bağlam"** olsun. Konu, **âyetlere yüklenen bilimsel
> anlamların sınırlarıdır**: değerlendirilen şey Kur'an değil, insanların
> kurduğu eşleştirmedir.
>
> ⚠ **Bu bölümde Kur'an'a kusur atfeden bir çerçeve KURULMAZ** (§13.24).
> Kur'an kesin hakikattir; sınırı olan, ona dışarıdan yüklenen beşerî
> yorumdur. Planlama notlarında bile Kur'an'ı özne yapan bir ifade
> kullanılmaz.
- [x] Bilimsel İşaretler sayfası kendi ilkesinde "uyum vermeyenler görmezden
      gelinmemeli" diyor, ama 16 kartın hepsi uyum veren örnek (`c318fa21`).
      ⚠ Künye düzeltmesi: rapor "5. ilke" diyor, o cümle listenin
      **DÖRDÜNCÜ** maddesiymiş. İlkeler artık bileşende sabit metin değil,
      veri dosyasında.
- [x] İlke yeniden yazıldı (`c318fa21`). Astra 1. ve 3. ilkeyi de düzeltti:
      "Kur'ân'ın metaforik dili" nitelemesi hakiki anlatımları da mecaza
      sokuyordu; 3. ilkede ölçünün neye uygulandığı belirsizdi. 5. ilke için
      "çelişmiyor, kalsın" dedi.
- [x] "Yorum sınırları ve bağlam" bölümü eklendi, Kehf 18:86 örneğiyle
      (`c318fa21`). İki tefsir **birinci elden okundu**: İbn Kesîr'in muhtasar
      metni ve Elmalılı (sitenin kendi arşivinden). Râzî, Zemahşerî ve
      Kurtubî'nin 18:86 sözleri doğrulanamadı, **hiçbiri anılmadı**;
      "klasik müfessirler böyle açıklar" genellemesi kurulmadı. Baskı ve
      yayınevi bilgisi elde olmadığı için uydurulmadı, künyede bu durum
      yazılı. Astra'nın ısrarıyla çalışan bir iç bağlantı kondu.

### 3.2 Güç etiketleri
> **Astra:** DEĞİŞTİREREK UYGULA. "Güçlü/Muhtemel/Kesin" aynı düzlemde değil
> (dayanak derecesi / olasılık / kesinlik). Yerine yazılı tanımlı
> **"Doğrudan bulgu / Dolaylı ilişkilendirme / Tartışmalı yorum"**.
- [x] Bulgu ile ilişki ayrıldı (`1aae37f4`). Tek `summary` alanı yerine
      "Bulgu" ve "Âyetle kurulan ilişki" ayrı etiketli bloklar. Etiket
      üçlüsü de değişti: astra benim "doğrudan bulgu" ve "tartışmalı yorum"
      adlarımı düzeltti → **"doğrudan ilişkilendirme"** (ölçülen şey
      bulgunun doğrudanlığı değil, ilişkinin niteliği) ve **"tartışmalı
      eşleştirme"** (tartışmalı olan, önerilen özdeşleştirme).
      Dağılım: 6 dolaylı, 4 tartışmalı, **0 doğrudan**. Astra "kartları
      kategoriye zorlamayın" dedi; etiket tanımlı duruyor ve
      "kullanılmamıştır" notu veriden hesaplanıyor, bayatlamaz.
- [x] Edne'l-arz (`1aae37f4`). **Astra beni burada düzeltti:** ben "dolaylı"
      demiştim, oysa sorun kelime anlamı değil, savaş coğrafyasının Ölü Deniz
      havzasıyla özdeşleştirilmesi → **tartışmalı eşleştirme**. Polemikçi
      ifade kaldırıldı, somut itiraz yazıldı.
- [x] Birmingham (`1aae37f4`). Nüans buna çevrildi. Etiket "Kesin" → dolaylı:
      yazmanın varlığı ile Hicr 15:9'un bildirdiği koruma arasındaki bağ bir
      çıkarım. Radyokarbon **yüzdesi kaldırıldı**: duyurunun %95 mi %95,4 mü
      verdiği doğrulanamadı, astra yuvarlamayı yasakladı; aralık duruyor.
      Doğrulanamadığı için silinenler: "batı akademisyenlerinin geniş
      uzlaşısı", "Wansbrough teorisi terk edilmiştir", "250+ elyazması".
      Yerine Sadeghi (2010) ve Sinai (2017) kendi iddialarıyla anılıyor.
      ⚠ **Bende kalan:** `src/i18n/tr.json` ve `en.json` 834. satır
      Birmingham için Wikipedia künyesi veriyor (§13.35 Wikipedia künye
      saymıyor). B ajanının alanı dışındaydı, dokunulmadı.
- [x] Semûd ve İrem (`1aae37f4`). Semûd kutusuyla uyumlandı (dolaylı);
      İrem iki basamaklı bir eşleştirme olduğu için tartışmalı. Başlık da
      değişti: "İrem Şehri" İrem'in şehir olduğunu peşinen sabitliyordu →
      "İrem (Zâtü'l-İmâd) ve Ubar Eşleştirmesi". Semûd kartından
      doğrulanamayan iki iddia **silindi**: UNESCO'nun bağı "kültürel
      süreklilik" çerçevesinde kabul ettiği ve "3000+ Thamūdic yazıt" sayısı.
      Astra silmeyi onayladı: "kaynak bekleniyor işaretiyle yayımlamak
      iddiayı dolaşımda tutar."
      Dinî bakımdan iki başlık daha değişti: "Rûm Sûresi Kehâneti" → "Rûm
      Sûresinde Bildirilen Galibiyet", kategori "Tarih-Öncesi Kehânet" →
      "Geleceğe Dair Haberler".
- [x] "Kanıt" geçişleri **tek tek** değerlendirildi, toplu değiştirme
      yapılmadı (`1aae37f4`): 7'si değişti, 6'sı korundu. Korunanların
      hepsinde kelimenin nesnesi ya bir argüman ya da olumsuzlama ("ispat
      olarak konulmamıştır"). Sekme adı "Kanıtlar" → "İzler" (§13.24 başlık
      dili yasağı; sayfanın adı zaten "Tarihsel İzler").

### 3.3 Nüans ana metne taşınsın
> **Astra:** DEĞİŞTİREREK UYGULA — ama asıl çözüm kutuya uyarı eklemek değil,
> **ana iddiayı baştan doğru kurmak**.
- [x] Zerre (`c318fa21`). Ana metin kutuyla uyumlandı; **başlık da** değişti,
      çünkü eski başlık tam reddedilen özdeşleştirmeyi ilan ediyordu.
      Astra üç bulgu daha verdi: Zilzâl ile Sebe'nin vurguları ayrı (biri
      amelin karşılıksız kalmaması, öteki Allah'ın ilminden gizli kalmaması),
      lügat iddiası kaynaklandı, "mutlak ret"e kaçılmadı.
      **Doğrulanan yan bulgu:** Elmalılı Sebe 34:3'te atom ve elektronu
      zerreden KÜÇÜK olanlar arasında anıyor, yani müfessirin kendisi zerre
      ile atomu özdeşleştirmiyor. Kart Keşif Çizelgesi'nden çıkarıldı:
      1897'ye yerleştirmek reddedilen eşleştirmeyi görsel olarak yeniden
      kuruyordu (12 → 11 kart). Kart ayrıca yeni açılan **"Dil ve Yorum"**
      alanına taşındı; "astronomi" etiketinde durması astra'ya göre
      "yayımdan önce düzeltilmeli"ydi (kullanıcı onayıyla altıncı alan).
- [x] Zümer 39:5 (`c318fa21`). "Düz-yer modelinde olamayacak olgu" ve
      "sarma fiili küresel modelle uyumludur" kalktı. Astra kutuyu da
      düzeltti: "küresel bir tasavvura uygundur" dışlayıcı, "ilk itirazda
      düşer" polemikçiydi. Dilbilgisi düzeltmesi: `kevvera` kök değil,
      âyetteki biçim **yükevviru**, kök k-v-r.
      **İbn Kesîr'in muhtasar metni 39:5 için okundu:** vurgu gece ile
      gündüzün aralıksız nöbetleşmesi (A'râf 7:54 ile birlikte). Kart artık
      klasik okumanın bu olduğunu, küresellik ilişkisinin ise ayrıca
      gerekçelendirilmesi gereken bir yorum olduğunu söylüyor.
      Doğrulanamayan Râzî ve Elmalılı atıfları kaynak satırından çıkarıldı.
      "1543'ten önce biliniyordu" önermesi de çıkarıldı (astra: bu, nüzul
      döneminde biliniyordu önermesini temellendirmez) ve kaynaksız "Antik
      Yunan'a kadar geri" ibaresiyle Kopernik satırı silindi (güneş
      merkezlilik ile yerin biçimi aynı mesele değil).
- [x] **Aruzun 16 vezni artık 7. yüzyıla tarihlenmiyor** (`751dcd17`).
      Rapor tek yeri bildirdi, ölçünce iddia **beş** yerde çıktı; bölümün
      giriş metni ise iki dilde de ZATEN doğruydu, yani sayfa kendi içinde
      çelişiyordu. Kalıplar şiirle birlikte daha eski, 16 bahirlik tasnif
      8. yüzyıl sistemleştirmesi. Doğrulanan kaynak hakemli ve DOI'li
      (10.3389/frai.2025.1523336): kalıpların "analyzed" edildiğini söylüyor,
      yani icat değil tasnif. Halîl b. Ahmed'in adı ve 15+1 dağılımı sayfaya
      YAZILMADI; eldeki kaynak bunu tek başına desteklemiyor.
      Âyet referansları korpustan birebir doğrulandı (Hâkka 69:41-42,
      İsrâ 17:88).

      **Astra iki turda beş yerde düzeltti, ikisi raporda hiç yoktu:**
      1. "Hece sayısı ve **vurgu** düzeni sabit" teknik olarak hatalıydı.
         Arap aruzu vurguya değil kısa/uzun hece düzenine dayanır ve izin
         verilen vezin değişiklikleri vardır; "katı yapı" da fazla iddialıydı.
      2. Türkçede "onu" kişiyi, İngilizcede "it" metni gösteriyordu; iki dil
         aynı şeyi söylemiyordu.
      3. Kart özeti bütün belâgat geleneğine tek bir tasnif atfediyordu
         ("başka örneği olmayan bir tür sayar"), kaynağı yok.
      4. "Bir benzeri getirin" tırnak içinde doğrudan âyet alıntısı gibiydi,
         oysa serbest özet.
      5. Alt etiket "16 vezin" diyordu ama sayfa hiç vezin adı listelemiyor.

      ⚠ **Kendi hatam, kayda geçsin:** astra'ya birinci turda "sayfada 16
      veznin listesi var" diye yanlış bir öncül verdim ve o buna dayanarak
      alt etiketi ONAYLADI. Ölçünce sayfada hiç vezin adı olmadığı çıktı.
      Öncülü düzeltip geri döndüm, astra kararını değiştirdi. Hakem hatası
      değil, ona verilen önermenin hatasıydı (§13.24'ün kendi notu).
      Astra'nın reddettiği bir çıkarımım: "aruzu kuranlar Kur'an'ı önlerinde
      buldu, yine hiçbir vezne yerleştirmediler" → metne erişim, onu
      inceleyip bilerek dışarıda bıraktığının belgesi değildir. Yazılmadı.
- [ ] Kur'an'ı Tanı: "asla rastlantı olamayacak denklikler" ve "Eksiklik
      fazlalıkla dengelendi" → kendi Sayılar sayfamızın "örüntü çıkarmaz"
      ilkesiyle çelişiyor.
- [x] Nüans kapalı görünümde de görünüyor (`c318fa21`). "Kritik Nüans"
      açılır bölümden çıkarılıp kart gövdesine alındı; düğmenin arkasında
      yalnız Kaynaklar kaldı. Kutu adı "Yorum Notu". Metin kart ana metin
      renginde ve **tam opak**: §13.26 gereği opaklık verilmedi, kademe
      seçildi. Kısaltma veya ilk-cümle kesme yapılmadı.

### 3.4 Tefekkür yazıları
> **Astra:** DEĞİŞTİREREK UYGULA. "İmzalı görüşe saygı, olgusal yanlışları
> düzeltmeden yayımlama muafiyeti sağlamaz." Önce **yazar onayıyla metin
> düzeltilsin**; özgün metin aynen korunacaksa hatanın **yanına** editör notu.
> §13.24'ün tefekkür muafiyeti GÖRÜŞÜ korur, OLGUYU değil.
- [x] Bucaille evrimi kabul eden "Müslüman âlimler" listesinde → "Fransız
      hekim ve yazar". "Müslüman âlim" nitelemesi ayrı dayanak ister; evrim
      görüşü de ayrıca incelenmeli.
- [x] Terminoloji-1: "kuantum belirsizliği kâinatın kapalı sistem olmadığını
      gösterir" → bu sonuç belirsizlikten çıkmaz.
- [x] Terminoloji-3: ölçüm problemi "gözlemciyi ayrı bir varlık kabul etmeye
      zorlar" → dekoherans, çok-dünya ve Bohm yorumları bilinçli gözlemci
      gerektirmez.
- [x] Kader yazısı "bilimsel zemine taşır".
- [x] "İslâm tarihinde âlimlerin çok büyük kısmı hemfikirdir" → kaynaklandır
      ya da kapsamı daralt.
- [x] Terminoloji-4: "Eş'arîlerin cüz-ü lâ yetecezzâsı uzayın içinde değildir"
      → klasik kelâmda cevher-i ferd tanım gereği mütehayyizdir. Çağdaş yorum
      olarak etiketlensin.
- [x] Sema-İsim: "isim ile semâ aynı س-م-و kökünden" olgu gibi veriliyor;
      bu **Basra** dilcilerinin görüşü, Kûfeliler و-س-م'den türetir
      (İbnü'l-Enbârî, el-İnsâf).
- [x] Rahmetin Grameri-2: "hukuk çekirdeği mimarinin tam merkezinde" →
      Bakara'nın orta âyeti 2:143; aile hukuku (2:221-242) %77-85 aralığında.
      Site içinde üç ayrı "merkez" var (Farrin'in kıble bölümü, 2:255 "kalbi").
- [x] Rahmetin Grameri-5: İbn Arabî'ye atfedilen "üç talâk = üç kopuş" için
      Fütûhât'tan yer gösterilsin. Serinin hiçbir yazısında editör kutusu yok.
- [x] "Editoryal hakemlik uygulanmadı" notu yazının **başına** taşınsın.
- [x] Bilim içeren yazılara "bilim notu" — astra: **her yazıya otomatik değil,
      gerekli yerlere**.
- [x] "Geçmiş Klasik, Gelecek Kuantum" yazısının hiç Kur'an içeriği yok →
      kategori içerik esas alınarak düzenlensin.
- [ ] Graf sayfaları (Semantik Harita, Âyet Grafiği): üstte tek cümle — "Bu
      gruplar makine hesabıdır, tefsir değildir."

**Sonuç (`2485422e`): yazarın tek bir cümlesi değişmedi.** Kullanıcı kararı
(2026-10-25): metne dokunulmaz, olgusal hatanın YANINA site imzalı editör
notu konur. Doğruladım: silinen her satır site metniydi (şema etiketi,
disclaimer kutusu, kategori alanı); yazarın blokları olduğu gibi duruyor.
Yeni desen icat edilmedi, `criticalNote` bloğu ve "Editör notu" imzası
zaten vardı.

**Astra iki tur döndü ve beni şurada düzeltti:**
- Dekoherans hakkında fazla güçlü yazmışım ("çevreyle etkileşim yeterlidir");
  doğrusu girişimin bastırılmasını açıklar, ölçüm problemini tek başına
  çözmez.
- Bilim notu ölçütüm yanlıştı: "âyet bloğu yok" elemeyi haklı çıkarmaz.
  Ölçüt değişti, liste 1'den **7 yazıya** çıktı. ⚠ Astra ölçütü onayladı
  ama listeyi TASDİK ETMEDİ (tam metinleri görmedi).
- "Nisbet edilir" dili bile doğrulanmış bir atıf geleneği izlenimi veriyor
  → "kaynağı doğrulanamamıştır".
- %77-85 "son çeyreğe yakın" değil, son çeyreğin **içinde**.
- "Editoryal hakemlik uygulanmamıştır" cümlesi yaptığımız olgusal
  incelemeyle ÇELİŞİYOR → kutu yeniden yazıldı.

**Ölçümle çıkan iki şey:**
- "Site editoryal bir hakemlik uygulamamıştır" cümlesi yalnız **3 yazıda**
  ve hepsinde **sonda** duruyordu; kalan 50 yazıda hiç yoktu. Cümle o üç
  kutudan çıkarıldı, her yazının başında zaten duran şeffaflık kutusu
  yeniden yazıldı; artık 53 yazının hepsi başta görüyor. Yeni metin şunu da
  diyor: editör notu bulunmaması, yazının bütünüyle incelendiği anlamına
  gelmez.
- "Geçmiş Klasik, Gelecek Kuantum" iki parçalı serinin ikincisiymiş; yalnız
  birini taşımak seriyi bölerdi, **ikisi birlikte** taşındı (astra onayladı).
  idrak-suur 9, kavramsal 8, toplam 53 değişmedi.

**Doğrulanamadığı için YAZILMAYANLAR (uydurulmadı):**
- Bucaille'ın mesleki künyesi: tek dayanak ansiklopediydi, astra "kaynak
  değil" dedi (§13.35 Wikipedia künye saymıyor).
- İbnü'l-Enbârî el-İnsâf'ın baskı ve sayfası: metin birinci elden okundu,
  basılı tahkik doğrulanamadı.
- Cevher-i ferd için nokta referansı: astra görünür kaynak istedi,
  karşılanamadı; §13.30'un öngördüğü genel atıfla bırakıldı.
- Fütûhât'ta "üç talâk = üç kopuş" eşleştirmesinin yeri bulunamadı.

**Birinci elden okunan iki kaynak:** İbnü'l-Enbârî, el-İnsâf (Basra س-م-و
görüşü, Kûfe و-س-م görüşü; İbnü'l-Enbârî Kûfe'yi "mânâ bakımından doğru,
lafız bakımından bozuk" diye reddediyor) ve Farrin'in kendi bölüm tablosu
(merkez E 142-152; hukuk bölümü merkez değil, C 40-103'ün aynası).

---

## KADEME 4 — Gizlilik ✅ TAMAM (2026-10-25)

Rapor "gizlilik sayfası yok" diyordu. İncelerken daha ağır üç şey çıktı.

- [x] **Site kendi beyanıyla çelişiyordu.** Kur'an'a Sor bölümü "Hiçbir
      kişisel veri saklanmaz" diyordu; oysa sorulan her soru metniyle
      birlikte kalıcı kayda yazılıyor. Beyan düzeltildi ve soru alanının
      yanına hassas bilgi uyarısı kondu (astra isteği).
- [x] **`ipHash` aslında hash değilmiş.** Kod `ip.slice(0, 8)` yapıyordu,
      yani IP'nin ilk 8 karakterini DÜZ METİN saklıyordu
      (`85.105.123.45` → `85.105.1`). Alan adı "ipHash" olduğu için hash
      sanılıyordu. Aynı pakette zaten gerçek bir `hashIp()` vardı ama kayıt
      yolu onu kullanmıyordu. Dört yerde düzeltildi.
- [x] **Arşivin büyümesi sınırlandırılmamıştı.** Hız sınırı yazım HIZINI
      bağlıyor, TOPLAMI bağlamıyordu: tek IP günde ~28.800 kayıt yazabilirdi,
      LLM bütçesi de durdurmuyordu (degraded istekler de yazıyor). IP başına
      günlük 300 kayıt tavanı kondu; tavan aşılınca soru yine cevaplanıyor,
      yalnız kayda yazılmıyor.
- [x] **`/tr/gizlilik` ve `/en/gizlilik`** yazıldı. Yedi bölüm. Her satır
      koddan okunarak yazıldı: saklanan alanlar `logQuery` çağrılarından,
      süreler `CACHE_TTL_SECONDS` ve `COUNTER_TTL_SECONDS`'tan, IP işleme
      biçimi `hashIp`'ten.

**Astra bir güvenlik iddiamı çürüttü ve yedi düzeltme yaptı:**
1. **"Bu karşılıktan adres geri elde edilemez" geçerli bir güvence DEĞİL** —
   hash kısa, kriptografik değil, gizli anahtar yok, IPv4 uzayı sonlu.
   "Bu işlem anonimlik garantisi sağlamaz" oldu.
2. "Ağ adresin olduğu gibi saklanmaz" fazla kapsamlı; barındırma ve güvenlik
   hizmetlerinin ham IP tutmadığını göstermez. Kapsam soru kayıtlarıyla
   sınırlandı.
3. "Site kayıtlarına yazılır" istisnayı gizliyordu; "günlük kayıt sınırı
   aşılmadıkça" eklendi.
4. Günlük 300 tavanı toplam arşivi sınırlamaz, yalnız kaynak başına büyümeyi
   yavaşlatır; sayfada bu açıkça yazılı.
5. Hassas veri uyarısı "göz önünde bulundur" diye zayıftı; açık bir "yazma"
   oldu ve soru alanının yanına da kondu.
6. Adres çubuğu uyarısı eksikti: metin erişim kayıtlarına ve yönlendiren
   adres bilgisine de yansıyabilir.
7. Geri bildirim düğmesi gerçek bir silme iş akışı başlatmıyorsa "silme yolu"
   diye sunulmamalı; dürüst hâliyle yazıldı, hesap olmadığı için sahipliğin
   her zaman doğrulanamayacağı söylendi. "Hukuki bir metin değildir" cümlesi
   sorumluluk sınırı çizmediği için kaldırıldı.

**Astra'nın açık bıraktığı iki iş (yeni madde):**
- [ ] Kısa ve kriptografik olmayan hash yerine gizli anahtarlı bir yöntem
      değerlendirilmeli. Astra: bu da tek başına anonimleştirme sayılmaz.
- [ ] Her veri türü için amaç, gereklilik ve saklama süresi ayrı
      belirlenmeli; hukuki değerlendirme uzmanla yapılmalı. Sonsuz arşiv
      bilinçli bir ürün kararıydı ama astra "ürün kararı olması tek başına
      süresiz saklamayı gerekçelendirmez" dedi.
- [ ] Soruyu adres çubuğunda taşımak ayrıca gözden geçirilmeli.

## KADEME 5 — Telif ve lisans (rapor §4)

> ⛔ **KULLANICI: "telif ve lisans kısmına şimdilik dokunma" (2026-10-24).**
> Bu kademe beklemede. Aşağısı kayıt amaçlı duruyor, uygulanmayacak.

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
- [ ] **Bilimsel İşaretler kart künyeleri doğrulanmadı** (astra bulgusu,
      2026-10-25). Astra: "künyeler bu paketle doğrulanmış değil."
      Tek tek kontrol edilecek: El-Naggar'ın eser adı ve yılı; Moore'un
      yayınevi, baskı yılı, baskı numarası ve ek bölüm bilgisi; "Basim
      Musallam, akademik eleştiri" ulaşılabilir bir kaynak göstermiyor
      (eser/makale adı, yayın bilgisi ve sayfa gerekli); "Cambridge
      tarihçisi" nitelemesi. Ayrıca A ajanının devrettiği künyeler:
      "modern fizyoloji ders kitapları", yalnız "Zaghloul El-Naggar",
      "Mefâtîh" kısaltması.
      ⚠ Bağlı bulgu, ASTRA'YA UYULMADI: astra "dikkatli okunmalıdır"
      uyarısının belirsiz olduğunu, hangi iddiaya neden ihtiyat gerektiğinin
      yazılmasını ya da notun kaldırılmasını istedi. Uyarı BIRAKILDI;
      gerekçe: doğrulanmamış bir kaynağı uyarısız sunmak sayfayı daha az
      dürüst yapar, nedeni yazmak ise kaynağı doğrulamayı gerektiriyor.
      Künye doğrulandığında bu not da ya somutlaşacak ya kalkacak.
- [ ] **Yöntem notu gövdesindeki atıflar** (A ajanının devrettiği):
      Bediüzzaman Muhâkemât, Şâtıbî el-Muvâfakât, Sinai/Neuwirth/Guessoum.
      Astra ayrıca "klasik usûlün kendi kaidesidir" iddiasının belirli bir
      dayanağının gösterilmesini istedi.
- [ ] **Kart başlıklarındaki 📖 ve 🔬 emojileri** (§13.34 yasağı, eski borç).
      Diff'e girmediği için kapı yakalamıyor.
- [ ] **Astra'nın yapısal uyarısı:** 16 âyetin tamamı için topluca "uyum"
      demek, yorumların kesinlik ve kapsam farklarını örtebilir; ilişki her
      kartta ayrıca açıklanmalı. Kartlarda nüans kutuları var ama bu açıdan
      bütün olarak gözden geçirilmedi.
- [ ] **Üç ajanın birleşik sonucu astra'ya bütün olarak gösterilmedi.**
      Her ajan kendi paketinde onay aldı; nihai hâli kimse göstermedi.
      Astra: "gösterilmeyen bütüne onay veremem." Bakılacak başlıklar
      (astra'nın verdiği liste): âyet meali ile yorumun ayrılması; kelimelere
      modern teknik anlamların kesin anlam gibi yüklenmemesi; bilimsel veya
      arkeolojik bulguların Kur'an'ın hakikatine ölçüt yapılmaması; Türkçe ve
      İngilizcede aynı ihtiyat düzeyinin korunması.
- [ ] **`audit-arabic-json` kapısının kör noktası.** Kapı yeşil yanıyor ama
      `cleanArabicForDisplay` ile ölçünce tefekkür dosyalarında **4 dosyada
      7 dize** normalize değil: `emrin-mahiyeti` ve `kaynak-yuzey` (U+0653),
      `terminoloji-1-lokal-global` (U+06E0, U+06DF),
      `yaratilis-hikayesi-2-katmanli-yaratilis` (U+06DF). Sebep: kapı elle
      yazılmış bir problem-karakter listesi tarıyor ve bu üç karakter listede
      yok. **Doğru ölçüt `cleanArabicForDisplay(s) === s`**; kapı buna
      çevrilmeli. Ayrıca §13.14'ün notu gereği, eski kuralla yazılmış veriyi
      fonksiyondan geçirmek yetmez, kaynaktan YENİDEN ÜRETMEK gerekir.
      (2026-10-25'te bulundu; aynı hata sınıfı daha önce de yaşandı.)
- [ ] **Birmingham künyesi Wikipedia'ya dayanıyor** (§13.35: Wikipedia künye
      sayılmaz). `src/i18n/tr.json` ve `en.json` 834. satır. İyi haber: aynı
      dosyaların 493. satırında parşömen/mürekkep nüansı zaten doğru yazılı.
- [ ] **CLAUDE.md kendi içinde çelişiyor.** §13.24 örtüşme için "dikkat
      çekici uyum" ifadesini ONAYLI sayıyor, §13.34 ise "dikkat çekici" ve
      "striking"i satış sıfatı olarak YASAKLIYOR; otomatik kapı §13.34'ü
      uyguluyor. Bu turda sade "uyum" kullanıldı, ama dokümandaki çelişki
      duruyor ve bir sonraki yazan yine takılır. §13.24'ün örnek listesi
      düzeltilmeli.
- [ ] Sayaçlar HTML'de 0 görünüyor, bazı sayfalar istemcide yükleniyor.
      ⚠ Kısmen aşılmış: `audit-ssr` kapımız var, son ölçüm eşik altı **0/26**.
      Hangi sayaçların kaldığı ayrıca taranacak.

---

## İLERLEME KAYDI

| tarih | kademe | ne yapıldı | commit |
|---|---|---|---|
| 2026-10-24 | 0 | Rapor okundu, 8 iddia kendi metnimizle doğrulandı, astra editoryal hüküm verdi, bu liste oluşturuldu | — |
| 2026-10-24 | 1.1 | Tabiat Atlası 8 kart düzeltildi; astra 12 bulgu verdi, hepsi uygulandı | `59c7277b` |
| 2026-10-24 | — | **Üç denetim kapısının ölü olduğu bulundu ve düzeltildi** (§13.15, §13.34, §13.32): `changed.mjs` yolları repo köküne göre döndürüyordu, kapılar `^src/`/`^public/` süzüyordu, hiçbiri eşleşmiyordu | `59c7277b` |
| 2026-10-24 | 1.2 | Metinle çelişen 9 ifade düzeltildi; astra 3 yerde beni düzeltti | `60319a7e` |
| 2026-10-24 | 1.3 | 5 küçük hata düzeltildi; 3 rapor maddesi sitede zaten doğru çıktı, dokunulmadı | `a83e4741` |
| 2026-10-24 | 1.4 | Terim/atıf eşleşmelerinden 5'i düzeltildi; astra önerimdeki bir tutarsızlığı yakaladı | `e9157b12` |
| 2026-10-24 | 1.4 | Dâru'l-Huld kartı ikiye ayrıldı, İsrâ'nın yanlış sınıflandırması, "ve cealnâ" kalıbı | `cd1ca5aa` |
| 2026-10-24 | — | Kalan 1.4 maddeleri için ölçümler ve arama kaydı | `d22f63b3` |
| 2026-10-24 | — | Kademe 1 damgaları; `audit:live` 154 rota sorunsuz | `da1457fc` **push edildi** |
| 2026-10-24 | 2.2 | Esmâ: Rezzâk 43→1, Hâdî 59→10, Rahmân 60→57; Melik ve Rahîm "doğrulanmadı" işaretiyle gösteriliyor | `a0b9508e` |
| 2026-10-24 | 2.3 | "Dört kadın" rivayetinin künyesi kaynaktan doğrulandı; iki yerde düzeltildi | `fe3fc12a` |
| 2026-10-24 | 2.3 | Alak 4-5: kalem ve "akıl" rivayetleri ayrıldı; PullQuote'a `sourceEn` eklendi | `25eeed03` |
| 2026-10-24 | 2.3 | Sebeb-i Nüzûl: teyemmüm ve ruh sorusu Buhârî metnine göre düzeltildi | `65e0b352` |
| 2026-10-24 | — | Kademe 5 beklemeye alındı (kullanıcı); paralel çalışma kuralı yazıldı | `51f78525` |
| 2026-10-24 | — | **Üç paralel ajan başlatıldı**, dosya kümeleri kesişmiyor: A tefekkür rivayetleri · B araç JSON ölçümleri · C Kur'an'a Sor | — |
| 2026-10-25 | 2.3 | Ajan A: üç rivayet künyesi kaynaktan doğrulandı; astra 10 bulgu verdi | `e8ac6ed2` |
| 2026-10-25 | 2.4 | Ajan C: örnek sorunun cevabı ölçümden geliyor, iç kimlik sızıntısı kapandı | `2a30cb86` |
| 2026-10-25 | 1.3/1.4 | Ajan B: yedi gök, ilâhî sıfatla kapanan sûreler, Hac secde notu | `535ecce4` |
| 2026-10-25 | 1.4 | Ajanın devrettiği işler: Mülk fasılası, "9 sûre" sabiti, Birmingham üstünlük iddiaları | `f4c7f272` |
| 2026-10-25 | — | Hero: DEVAM göstergesi CTA satırıyla örtüşmüyor | `240d0c35` |
| 2026-10-25 | 4 | Gizlilik sayfası, yanlış beyan, gerçek IP hash'i, arşiv tavanı | `86e70065` |
| 2026-10-25 | — | **Dal açıldı: `feat-kademe3-editoryal`.** Kademe 3 işi bu dalda, main'e ayrı onayla merge | — |
| 2026-10-25 | 3 | Aruzun 16 vezni 8. yüzyıl tasnifi; beş yerde düzeltildi, astra iki turda beş bulgu verdi | `751dcd17` |
| 2026-10-25 | — | **Üç Kademe 3 ajanı başlatıldı**, dosya kümeleri kesişmiyor: A bilimsel-isaretler (3.1 + 3.3) · B tarihsel-kanitlar (3.2 güç etiketleri) · C tefekkür (3.4) | — |
| 2026-10-25 | 3.1/3.3 | Ajan A: seçmecilik ilkesi, yorum sınırları bölümü, Zerre ve Zümer nüansı ana metne; astra 7 tur | `c318fa21` |
| 2026-10-25 | 3.2 | Ajan B: güç etiketleri ilişki türüne, bulgu ile ilişki ayrıldı; astra eşlemede 4 kartta düzeltti | `1aae37f4` |
| 2026-10-25 | 3.4 | Ajan C: 14 editör notu, yazarın metni değişmedi; astra 2 tur | `2485422e` |
| 2026-10-25 | — | §13.22 korpus ve gömme: 88 kalem, 0,0002 dolar; alan adı değişikliğinin kırdığı bağ doğrulandı | `57491841` |

### Sıradaki iş

1. `audit:live` yeşil gelince `a0b9508e` ve `fe3fc12a` push edilecek.
2. **Kademe 2.3'ün kalan altı rivayeti** — her biri künyesinden doğrulanacak.
   sunnah.com doğrudan erişime kapalı (403); arşivlenmiş nüshalar üzerinden
   çalışılıyor ve bu sınırlılık kaydediliyor.
3. **Kademe 2.1** (sayılar tek kaynaktan) ve **2.4** (Kur'an'a Sor örnek
   sorusu testi).
4. **Kademe 4** kullanıcı kararı bekliyor: KV arşiv politikası için önerilen
   seçenek (b), IP başına günlük 300 kayıt tavanı.
