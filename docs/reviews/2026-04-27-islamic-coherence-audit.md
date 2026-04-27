# QuranCodex — İslamî/Teolojik Tutarlılık Denetim Raporu

**Tarih:** 2026-04-27
**Denetlenen kapsam:** `src/i18n/tr.json`, `src/i18n/en.json`, `public/*.json` (38 veri dosyası), `src/components/*.jsx` (~55 dosya), `src/sections/*.jsx` (~21 dosya)
**Hassasiyet:** Türk Müslüman akademik dindar okuyucu (TDV İslam Ansiklopedisi seviyesi)

---

## Özet Tablosu

| Kategori | Sayı |
|---|---|
| 🔴 KRİTİK | 4 |
| 🟡 ORTA | 11 |
| 🟢 DÜŞÜK | 7 |
| **TOPLAM** | **22** |

**En büyük endişe alanı:** PsychologySection (Kategori D — anachronistic öngörü iddiaları, disclaimer'sız Freud/Jung/Maslow/Frankl paralellikleri).

**En iyi korunan alanlar:** Melekler, KavimlerAtlasi, KiyametSahneleri, ScientificSigns, HistoricalProof, ZamanBoyutlari, MunafikProfili, NefisMertebeleri, Cennet/Cehennem (Hûriler) — bu sayfaların tümü açık disclaimer + akademik nüans taşıyor.

---

## A. Bucaillism Riski

### A1 — 🔴 KRİTİK — PsychologySection açılış cümlesi: "Kur'an haritanın tamamını çoktan çizmişti"

**Dosya:** `src/i18n/tr.json` (ve aynısı `en.json`'da)
**Bölüm/Anahtar:** `psychology.intro`
**İfade:**
> "Modern psikoloji, insan zihnini anlamak için yüzyıllardır çaba harcıyor. Freud benliği, Jung arketipleri, Maslow ihtiyaç hiyerarşisini, Frankl anlamı keşfetti. Kur'an 1.400 yıl önce bu haritanın tamamını çoktan çizmişti — sadece farklı bir dille."

**Endişe:** Bu, Bucaillism'in psikoloji versiyonudur — "Kur'an X bilimsel keşfi 1.400 yıl önce öngördü" iddiasının disclaimer'sız genelleştirilmesi. Klasik Sünnî pozisyon Şâtıbî'nin (El-Muvâfakât) Kur'an'ın hidayet kitabı olduğunu vurgular; "modern psikolojinin haritasını" çıkardığı iddiası selektif okuma riskidir. ScientificSigns'ın Bucaillism çerçevesinde uyguladığı disclaimer paterni burada uygulanmamış.

**Önerim:** ScientificSigns'taki `bucaillismFrame` benzeri bir akademik çerçeve eklenmeli, ya da intro yeniden yazılmalı: "Kur'an aynı insan deneyimini farklı bir dille — ahlâkî-teolojik dille — anlatır; modern psikoloji bunu biyolojik-bilişsel dille modeller."

---

### A2 — 🔴 KRİTİK — PsychologySection altındaki her madde "modernNote" içeriyor — disclaimer yok

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `psychology.sections.nefs.items[*].modernNote`, `kalp.items`, `korku.items`, `savunma.items`, `araclar.items`, `anlam.items` (toplam ~30 madde)
**İfade örnekleri:**
> Emmâre — "Freud'un id kavramıyla örtüşür"
> Levvâme — "psikolojideki sağlıklı vicdan ve bilişsel çelişki (cognitive dissonance) mekanizmasıyla paraleldir"
> Mülhime — "Jung'un 'higher self' ve transpersonal psikolojinin 'sezgisel benlik' kavramlarıyla bağlantılıdır"
> Mutmainne — "Maslow'un öz-gerçekleştirme zirvesiyle ve Frankl'ın 'anlam huzuru' kavramıyla örtüşür"
> Mühürlü Kalp — "Seligman'ın 'öğrenilmiş çaresizlik' (learned helplessness) kavramıyla yapısal benzerlik taşır"

**Endişe:** Tek tek "örtüşür / paraleldir" ifadeleri tek başına problemli değil; ancak intro'daki "Kur'an haritanın tamamını çizmişti" iddiası ile birleşince anachronistik öngörü çerçevesi pekişiyor. MunafikProfili.json'da Trivers paralelliği için açıkça `"infoTr": "Modern paralellik 'Kur'ân bilimi önceden bildi' iddiası olarak değil..."` disclaimer'ı vardır — aynı disclaimer PsychologySection'da yok.

**Önerim:** Tab veya sekme başına en az bir `methodologyNote` ekle: "Bu paralellikler farklı epistemolojik çerçevelerin aynı insan deneyimini farklı dillerde tarif etmesidir; Kur'an'ın modern psikolojiyi öngördüğü iddiası taşınmamaktadır."

---

### A3 — 🟡 ORTA — `savunma` tab intro'sunda "Kur'an 1.400 yıl önce sergiledi"

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `psychology.sections.savunma.intro`
**İfade:**
> "Freud'un kızı Anna Freud, 1936'da savunma mekanizmalarını sistematik olarak tanımladı. Kur'an, bu mekanizmaları somut insan hikayeleri üzerinden 1.400 yıl önce sergiledi — isim vermeden ama kristal netliğiyle."

**Endişe:** Aynı patern, kategori D anachronistik öngörü. "Kristal netliğiyle sergiledi" Anna Freud'un kavramsal sistemini Kur'an'a geriye yansıtır. Klasik tefsirin (Râzî, Taberî) Bakara 2:11 yorumu "ıslâh iddiası" üzerinedir — psikolojik "rasyonalizasyon" terminolojisi modern bir okumadır.

---

### A4 — 🟡 ORTA — `anlam` tab intro: "Kur'an bu cevabı 1.400 yıl önce vermişti — hem daha geniş hem daha derin"

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `psychology.sections.anlam.intro`
**İfade:**
> "Viktor Frankl, Auschwitz'de hayatta kalmayı anlamla açıkladı: '...' Kur'an bu cevabı 1.400 yıl önce vermişti — hem daha geniş hem daha derin bir çerçevede."

**Endişe:** "Daha geniş hem daha derin" karşılaştırması, modern logoterapi ile Kur'an arasında hiyerarşik bir karşılaştırma kurar — bu, dürüst akademik bir tutum yerine apolojetik bir dile kayar. Frankl'ın varoluşçu psikoterapi çerçevesi Kur'an'ın metafizik çerçevesinden farklıdır; "daha derin" yargısı uygun bir akademik dil değildir.

---

### A5 — 🟡 ORTA — `kalp` tab intro: kalp metaforunu nörobilimle birleştirme

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `psychology.sections.kalp.intro`
**İfade:**
> "Modern nörobilim kalbin karmaşık bir sinir ağına (intrinsic cardiac nervous system) sahip olduğunu göstermiştir — bu bulgu kalbin 'bilinç merkezi' olduğunu ispatlamaz, ancak Kur'ânî metaforun fiziksel dokuyla nasıl etkileşebileceğine dair ilgi çekici bir zemin sunar."

**Endişe:** Yumuşak bir disclaimer var ("ispatlamaz"), ama "fiziksel dokuyla nasıl etkileşebileceği" ifadesi Kur'ânî kalp metaforunu fizyolojiye bağlamaya kapıyı aralık tutar. Klasik Sünnî kelâmında qalb (kalp) duyusal değil ruhî/bilinçsel bir merkezdir (Gazâlî, İhya); fizyolojik "kardiyak sinir ağı" ile özdeşleştirme gereksiz.

**Önerim:** Bu cümleyi kaldır veya "Bu farklı düzlemlerin paralelliğini kurmak akademik literatürde tartışmalıdır" şeklinde nüansla.

---

### A6 — 🟡 ORTA — Hero açılışında genel Bucaillism çerçevesi (disclaimer yok)

**Dosya:** `src/i18n/tr.json` ve `en.json`
**Bölüm/Anahtar:** `hero.description`
**İfade:**
> "1.400 yıllık bir metnin derinliklerinde, çıplak gözle görülemeyen bir düzen yatıyor. Her kelimesi ölçülmüş, her sesi hesaplanmış, her hikayesi bir yapının parçası. Modern bilim bu düzeni çözmeye yeni başlıyor — ve çözülecek çok şey var."

**Endişe:** "Modern bilim bu düzeni çözmeye yeni başlıyor" ifadesi Hero'nun ilk izlenimini şekillendiriyor; sayfanın tüm akademik çerçevesini Bucaillism'e yönlendirir. ScientificSigns altında verilen disclaimer'lar bu açılış izlenimini tam dengelemez.

**Önerim:** "Modern akademik araştırma bu yapıyı incelemeye devam ediyor" gibi daha tarafsız bir formülasyon.

---

### A7 — 🟡 ORTA — PathCards "Evren ve Bilim" kartı

**Dosya:** `src/sections/PathCards.jsx`
**Bölüm/Anahtar:** `PATHS[3]` — id: `evren`
**İfade:**
> `descTr: 'Modern bilimin 1.400 yıl sonra keşfettikleri'`
> `descEn: 'What modern science only discovered 1,400 years later'`

**Endişe:** Disclaimer'sız tek-cümle Bucaillism. Kart açıldığında alt section'larda (ScientificSigns) `bucaillismFrame` var — ama keşif yolculuğunun başlangıç metnindeki bu cümle çerçeveyi öncelikli olarak Bucaillism şeklinde kuruyor.

**Önerim:** "Kur'an'da kâinat ayetleri ve bilim — paralellikler ve sınırlar" gibi bir formülasyon daha uygun.

---

### A8 — 🟡 ORTA — Conclusion bullet: "Bilimsel gerçeklere 1.400 yıl öncesinden işaret ediyor"

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `conclusion.points[4]`
**İfade:**
> "Bilimsel gerçeklere 1.400 yıl öncesinden işaret ediyor"

**Endişe:** Conclusion section'da ScientificSigns sayfasının disclaimer'lı çerçevesi olmadan bu özet madde direkt Bucaillism iddiasıdır. Conclusion akademik bir derleme olduğu için bu maddenin nüansa ihtiyacı var.

**Önerim:** "Bazı ayetleri modern bilimin keşiflerine paralel okunmaktadır" gibi disclaimer-uyumlu formülasyon.

---

### A9 — 🟡 ORTA — Highlights "Zaman Esnekliği" kartı

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `highlights.cards[4]` (Zaman Esnekliği)
**İfade:**
> "Bu tahmin değil, kesinlik bildirimi. Bizans 628'de gerçekten galip geldi."

**Endişe:** Aynı section'ın sonunda iyi bir kritik not var ama gövde metni "kesinlik bildirimi" ifadesiyle güçlü bir öngörü iddiası taşır. ScientificSigns'ın Rome bölümünde bu nüans daha iyi yönetilmiştir; Highlights kartı tek başına çok güçlü bir ifadeyle açıyor.

---

### A10 — 🟢 DÜŞÜK — WowFacts "Modern Bilim Terimleriyle Örtüşen Kelimeler"

**Dosya:** `src/components/WowFacts.jsx` (line 457-463)
**İfade:**
> "'Duhân' (duman/gaz bulutu, Fussilet 41:11) modern kozmolojide nebula ile örtüşüyor. 'Zerre' (atom boyutunda birim) modern fizik terminolojisini önceden işaret ediyor. 'Ufuk' kavramı, görelilik teorisinin sınır tanımıyla uyumlu."

**Endişe:** WowCard'ın küçük formatında bu üç paralellik disclaimer'sız sunuluyor. Bucaillism eleştirilerinin tam ortasında — "atom boyutunda birim", "görelilik teorisinin sınır tanımı" iddiaları akademik destekten yoksun. Klasik tefsirde "zerre" "karınca / küçük tanecik" anlamındadır, "atom" değil.

**Önerim:** Kartın sonuna "ℹ Klasik tefsir bağlamı: zerre = küçük tanecik; modern fizik paraleli çağdaş bir okumadır" notu eklenmeli.

---

### A11 — 🟢 DÜŞÜK — WowFacts "Modern Sosyoloji — 18 Ayette" (Hucurat)

**Dosya:** `src/components/WowFacts.jsx` (line 446-452)
**İfade:**
> "Hucurât sûresi 18 ayette şunları ele alır: ırkçılığın yasaklanması, dedikodu, lakap takma, zan, kardeşlik. 7. yüzyılda yazılan, 21. yüzyılda okunması gereken bir medeniyet programı."
> wowTr: "18 ayette bir medeniyet programı."

**Endişe:** "Modern sosyoloji — 18 ayette" başlığı disclaimer'sız öngörü iddiası. Hucurat metni gerçekten ahlâkî sosyal hükümler içerir, ancak "modern sosyolojiyi 18 ayette" ifadesi anachronistik bir çerçeve.

---

### A12 — 🟢 DÜŞÜK — yeminler.json "Modern bilim atmosferin su döngüsü"

**Dosya:** `public/yeminler.json` line 143, 437
**İfade:**
> line 143: "Modern bilim: atmosferin su döngüsü."
> line 437: "Modern bilim 'gezegen oluşumu' der; Kur'an bunu ilahi bir fiil ('طَحَا') olarak sunar."

**Endişe:** Tek cümle paralellikler, disclaimer'sız. yeminler.json'un başka yerlerinde nüanslı çerçeveler var ama bu iki nokta çıplak Bucaillism formülünde.

---

## B. Hadis-Kur'an Sınır Bulanıklığı

> **Genel değerlendirme:** Bu kategori sitenin en iyi korunan tarafıdır. Melekler, KiyametSahneleri ve diğer tüm ilgili sayfalar açık "Kur'an'da geçmez — Hadis" rozeti taşıyor; karşılaştırma tablosu (Azrail, Münker-Nekir, Rıdvan, kabir azabı, sırat köprüsü, melek nurdan, 600 kanat) örnek alınası kalitede.

### B1 — 🟢 DÜŞÜK — i18n.tr.json `humanDefinition.istikaametHadith` — Hz. Peygamber sözü açık etiketli, kontrolde

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `humanDefinition.istikaametHadithNote`
**İfade:** "Bu rivayet hadis kaynaklarından gelmektedir (Tirmizî), Kur'an'dan değil."

**Değerlendirme:** Bu **doğru** uygulama — örnek olarak listeliyorum, endişe değil.

---

## C. Klasik Sünnî Pozisyona Aykırı Reformist Okumalar

> **Genel değerlendirme:** Bu kategori de iyi yönetilmiş. Melekler.jsx 4 kelâmî pozisyonu açıkça sunuyor (Eş'arî/Mâturîdî/Mu'tezile/filozoflar) ve "Atlas çoğunluk Sünnî pozisyonu birincil sunar" notu var. İblis'in melek/cin sorunu Kur'an'dan iki yorum mümkün şeklinde tarafsız sunuluyor. Said Nursi pozisyonu klasik Sünnî olarak doğru çerçeveleniyor.

### C1 — 🟡 ORTA — sevenLayers / Nur 24:35 — "Bilimsel (Kozmolojik)" katmanı

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `sevenLayers.layers[2]`
**İfade:**
> "Bilimsel (Kozmolojik): Evrenin temel kuvveti olarak ışık, fotonlar, elektromanyetik spektrum"

**Endişe:** Nur 24:35 klasik tefsirde (Râzî, Gazâlî, İbn Arabi, İbn Kesîr) ilahî/manevî/tasavvufî katmanlarda yorumlanır; "fotonlar, elektromanyetik spektrum" yorumu klasik gelenekte yer almaz, bu yorum 20. yüzyıl Bucaillism'inin tipik örneğidir. Yedi katman içinden birinin "fizik" olması, klasik tefsiri modern fiziği "tasdik eden" bir çerçeveye sokar.

**Önerim:** "Bilimsel" katmanı ya kaldır ya da "Modern okuma (tartışmalı): bazı çağdaş yorumcular bu ayette ışığın fizik niteliklerine işaret görür" şeklinde nüansla.

---

## D. Anachronistik Modern Teori Atfı

> Bu kategori A1-A5'te zaten kapsamlı işlendi. Aşağıda kategori B/D arası kalan örnekler:

### D1 — 🟡 ORTA — Highlights "İltifât" kartı: "polyphonic voice — modern edebiyatta"

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `highlights.cards[5]`
**İfade:** Note iyi nüanslanmış: "İltifât sanatı klasik Arap belağatında tanımlanmıştır" + Suyûtî ve Zerkeşî atfı yapılmış.

**Değerlendirme:** Bu **iyi yönetilmiş** bir paralellik — kayda alıyorum, endişe değil.

### D2 — 🟢 DÜŞÜK — Highlights "Prefrontal Korteks" kartı

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `highlights.cards[0]`

**Değerlendirme:** Disclaimer ("Kur'an prefrontal korteksi gösterdi okuması selektif okuma riski taşır — Bucaillism akademik tartışmasının bir parçasıdır") **mevcut ve örnek alınası kalitede**. Bu da iyi yönetilmiş.

---

## E. Cinsiyet/Cinsellik Vurguları

### E1 — 🟢 DÜŞÜK — Hûriler kartı (cennet-cehennem.json)

**Dosya:** `public/cennet-cehennem.json` line 350-358

**Değerlendirme:** Hûri tasviri **örnek alınası şekilde sade**: fiziksel detay verilmemiş, Luxenberg tartışması akademik olarak sunulmuş, klasik tefsir pozisyonu hâkim olarak işaretlenmiş. Ekstra bir endişe yok.

### E2 — 🟢 DÜŞÜK — kuranin-renkleri.json hûri referansı

**Dosya:** `public/kuranin-renkleri.json` line 105
**İfade:**
> "Vakıa 56:23'te cennet hurisi 'saklı yumurta gibi' (beyaz)."

**Endişe:** Çok küçük bir referans, ayetin literal anlamı verilmiş — kültürel olarak hassas değil. Endişe minimum.

---

## F. Yaygın Halk İnancı vs Kur'ân

> **Genel değerlendirme:** Bu kategori de iyi korunmuş. Mehdi/Deccal, sırat köprüsü, kabir azabı gibi tüm yaygın inançlar açıkça hadis kaynaklı olarak işaretleniyor. Tek nüansa açık nokta:

### F1 — 🟢 DÜŞÜK — `surah-notes.json` Mülk sûresi notu

**Dosya:** `public/surah-notes.json` line 860
**İfade:**
> "Her gece okunması kuvvetle tavsiye edilen ve kabir azabına karşı şefaatçi olduğu rivayet edilen sûredir."

**Endişe:** "Kabir azabına karşı şefaatçi" ifadesi hadis rivayetidir; "rivayet edilir" geçmişteki notlardan farklı olarak burada hadis kaynağı (Tirmizî vb.) açıkça anılmamış. Çok küçük detay.

### F2 — 🟢 DÜŞÜK — `surah-notes.json` Kehf sûresi

**Dosya:** `public/surah-notes.json` line 208
**İfade:**
> "Her Cuma günü okunması kuvvetle tavsiye edilen sûre olup Deccal fitnesine karşı koruma sağladığı rivayet edilir."

**Endişe:** "Rivayet edilir" geçiyor, ama "Deccal fitnesi"nin Kur'ânî olmadığı hatırlatması yok. Surah-notes.json hadis kaynaklı bilgi için doğal yer; ancak hadis geleneğinin ayrı kanal olduğu hatırlatması küçük bir not yardımcı olabilir.

---

## G. Tartışmalı Tefsir Görüşlerinin Tek Görüş Olarak Sunulması

> **Genel değerlendirme:** İyi yönetilmiş. İblis'in melek mi cin mi olduğu IblisSatan ve Melekler'de açık tartışma olarak veriliyor. Hârût-Mârût'a açık bir referans bulamadım. A'râf ehli için ayrı tartışma yok.

### G1 — 🟢 DÜŞÜK — i18n.tr.json `iblisSatan.intro` — "İblis'in cin olduğu belirtilir"

**Dosya:** `src/i18n/tr.json`
**Bölüm/Anahtar:** `iblisSatan.intro`
**İfade:**
> "Bir diğerinde İblis'in cin olduğu belirtilir; bir başkasında ise Allah'ın (c.c.) 'iki elimle yarattığım' ifadesi geçer."

**Endişe:** Bu çok hafif — Kehf 18:50 ayeti gerçekten "İblis cinlerden idi" der ve A'râf 7:11'de "meleklere secde" emrinde bulunur. Karton tarafsız tutuyor. Endişe yok.

---

## H. Genel İslamî Edebe Aykırı Ton

> **Genel değerlendirme:** Saygısız üslup veya alay/şaka bağlamı tespit edilmedi. Allah'ın isimleri, peygamberler, sahâbe için tüm bağlam saygılı. Ayetler hep `verse-graph-bgem3.json`'dan birebir alınmış (CLAUDE.md kuralına uygun). Endişe yok.

---

## Yoğunlaşma Analizi

| Sayfa / Modül | Endişe Sayısı | Ana Kategori |
|---|---|---|
| **PsychologySection** (`tr.json` `psychology.*`) | 5 | A (Bucaillism) + D (anachronizm) |
| **WowFacts.jsx** | 2 | A (Bucaillism) |
| **PathCards** + **Hero** + **Conclusion** | 3 | A (Bucaillism çerçevesi) |
| **Highlights** | 1 | A (zaman esnekliği) |
| **sevenLayers** | 1 | C (Sünnî pozisyon) + A |
| **public/yeminler.json** | 1 | A (kısa paralellik) |
| **kalp** tab metaforu | 1 | A (yumuşak) |
| **WowFacts** modern bilim/sosyoloji kartları | 2 | A |
| **surah-notes.json** | 2 | F (yaygın inanç — hafif) |

---

## Özetlemek gerekirse

**Site genel olarak Türk Müslüman akademik dindar okuyucu için yüksek kalite ve hassasiyetle hazırlanmış.** Hadis-Kur'an sınırı, klasik kelâmî pozisyon kapsayıcılığı, hûri/cinsel hassasiyet, peygamber edeb'i — bu konularda sergilenen özen örnek alınası seviyede.

**Tek somut iyileştirme alanı: PsychologySection.** Bu sayfa, ScientificSigns'ın `bucaillismFrame` benzeri bir akademik çerçevesinden yoksun — ve site içinde en yoğun anachronistik öngörü dilini (Freud/Jung/Maslow/Frankl ile "Kur'an 1.400 yıl önce çizmişti" kalıbı) taşıyor. Bu sayfanın açılış cümlesinin yumuşatılması ve tab başına bir `methodologyNote` eklenmesi en yüksek ROI'li düzeltme olur.

İkinci öncelik: **Hero + PathCards + Conclusion + WowFacts'in 2-3 kartının** disclaimer'sız Bucaillism cümleleri — bunlar küçük metin değişiklikleriyle hızlıca düzeltilebilir.

Üçüncü öncelik: **sevenLayers'ın "Bilimsel (Kozmolojik)" katmanı** — klasik tefsirin Nur 24:35 yorumlama geleneğine eklenmiş bir modern fizik katmanı, ya kaldırılmalı ya da modern okuma olarak nüanslanmalı.

**Hiçbir kritik akide hatası, saygısız üslup veya açık reformist sapma tespit edilmedi.**

---

## Faze Yapısı (Önerilen Uygulama Sırası)

**Faze 1 (en yüksek ROI, ~30 dk iş):** PsychologySection'a `methodologyNote` + intro yeniden yazımı (A1, A2, A3, A4, A5). Tek sayfada 5 endişe çözülür.

**Faze 2 (~20 dk):** Hero + PathCards "Evren ve Bilim" + Conclusion[4] + sevenLayers nüansı (A6, A7, A8, C1). 4 satır metin değişikliği.

**Faze 3 (~15 dk):** WowFacts 2-3 kart + yeminler.json 2 satır + Highlights[4] + kalp.intro (A9, A10, A11, A12). Detay temizliği.
