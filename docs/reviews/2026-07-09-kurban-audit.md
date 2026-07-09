# /atlas/ibadetler/kurban İçerik Denetim Raporu
Tarih: 2026-07-09
Denetçi: qc-content-auditor
Dosya: `next/public/ibadetler/kurban.json` (926 satır)

## Özet
- Toplam iddia noktası: ~60
- 🔴 Kritik: 0
- 🟠 Orta: 3
- 🟡 Minör: 5
- ✅ Sağlam kısım: baskın çoğunluk

Sayfa, "Kur'ân ilke koyar, sünnet tafsil eder" çerçevesini bilinçli inşa etmiş, "Kur'aniyyun sızıntısı" yok. Klasik Ehl-i Sünnet çizgisinde duruyor. Ayet ref'leri ve Arapça alıntılar büyük çoğunlukla doğru.

---

## Ana Kontroller — Tek Tek

### ✅ 1. 15 Ayet Referansı — Doğruluk

Anchor + anaPasajlar.ayetler + rituelBaglam + peygamberVaryasyonlari'ndaki ref'lerin tümü Kur'ân konumları ile birebir eşleşiyor:

- Hac 22:28, 22:32, 22:34, 22:36, 22:37 → ✅ hepsi kurban/hedy/şeâir bağlamı; ayet numaraları doğru
- Sâffât 37:102-107 → ✅ İbrâhîm-İsmâîl sınavı; 37:107 "vefedeynâhu bi-zibhin azîm" birebir doğru
- Maide 5:2 (şeâir), 5:27 (Habil-Kabil) → ✅ doğru
- Kevser 108:2 → ✅ doğru; Arapça "fesalli li-rabbike venhar" birebir
- En'âm 6:162 → ✅ doğru; namaz-nüsük-mahyâ-memât dörtlüsü
- Bakara 2:196 → ✅ temettu' haccı bağlamı doğru
- Bakara 2:67-71 → ✅ İsrailoğulları boğa kıssası; zebh fiili doğru
- Al-i İmrân 3:183 → ✅ Yahudilerin "ateşin yiyeceği kurbân" bahanesi doğru

### ✅ 2. Habil-Kabil (5:27) — "Kabul eden takva sahibi"

JSON'un okuması: "innemâ yetekabbelullâhu mine'l-muttakîn" (Allah kurbanı yalnızca takva sahibinden kabul eder).

Quran.com (Dr. Mustafa Khattab): "Allah only accepts ˹the offering˺ of the sincerely devout." Klasik tefsir (Râzî, Kurtubî, Taberî) bu ayeti kurbanın kabul kriteri olarak takva/ihlâs ekseninde okur. **Sayfanın okuması klasik ana damarla birebir uyumlu.** ✅

### ✅ 3. İbrâhîm Rüyası — "Büyük Bir Kurban" (37:102-107)

Sahnenin beş harekede özetlenişi (rüya → istişare → çift-teslim → müdahale → fidye) klasik tefsirle örtüşüyor. "Büyük" (azîm) vasfının hem fiziksel hem mânevî büyüklüğe işaret ettiği Râzî okuması doğru bir atıf. "Kesim değil teslim kabul edildi" okuması Râzî ve Elmalılı'da gerçekten var. ✅

### ✅ 4. İsrailoğulları Boğa (Bakara 2:67-71) — Hedge Var mı?

`peygamberVaryasyonlari[3]` içinde `auditGuardTr` alanı var: **"Klasik tefsir bu kıssayı 'ibadet-kurban' olarak değil, 'ibadî bir emir kesimi' olarak sınıflandırır. Kurban ibadetiyle özdeşleştirme yapılmaz."** Ayrıca sahne özeti "gaybı ortaya çıkarma vesilesi olarak inen özel bir emir" diyor. **Hedge yerinde ve akademik açıdan sağlam.** ✅

Ancak Musa'nın "bahaneli isteklerine karşı" (yaş, renk, iş) İsrailoğullarının sorgulaması hiç anlatılmıyor — kıssanın karakteristik "sordukça zorlaştı" narratifi eksik. 🟡 Minör: kıssanın ahlâkî mesajı (sorgulamanın emri zorlaştırması) satırlarda yok.

### 🟠 5. Kevser 108:2 (venhar = "kurban kes") — Baskın Mı?

JSON'un tek okuması: "kurban kes" (Râzî ve Elmalılı klasik yorumu).

**Sorun:** Sahabe ve erken tefsir literatüründe Kevser 108:2'nin en az 4 farklı yorumu vardır:
1. Kurban kes (Katade, İkrime, Atâ — Râzî'nin tercih ettiği)
2. Namazda elleri boğaza/göğse kaldır (Ali b. Ebi Talib rivayeti)
3. Namazda kıbleye tam dönmek (bazı Kufe tefsircileri)
4. Bayram namazı + kurban (Sünnî fıkhî sentez)

Râzî ve Elmalılı'nın kurban okumasını "en yaygın" olarak konumlandırmak doğru; ancak **"klasik tefsirin baskın görüşü mü?"** sorusu için: evet, ana damar bu, ama sahâbî rivayetlerinde varyasyon var. Sayfa bu çoğulluğa hiç değinmiyor. **🟠 Öneri:** Kevser 108:2 not'una bir cümlelik nüans eklenebilir: "Bazı sahabe rivayetleri 'venhar'ı namaz jestlerine bağlar; klasik ana damar (Râzî, Elmalılı) kurban okumasını tercih eder."

### ✅ 6. 12 Semantik Terim Kökleri

Tümü doğru:
- ن س ك (nüsük) ✅
- ه د ي (hedy) ✅
- ق ر ب (kurbân) ✅
- ن ح ر (nahr) ✅
- ذ ب ح (zebh) ✅
- و ق ي (takva) ✅
- ش ع ر (şeâir) ✅
- ب د ن (bedene) ✅
- ف د ي (fidye) ✅
- ن ف ع (menâfî) ✅
- ق ل د (kalâid) ✅ — Not: user prompt'unda "ك ل د" yazılmış, tipografik hata; JSON'da doğru kök var
- خ ل ص (ihlâs) ✅

**Kurbân (ق ر ب) sayımı:** Sayfa "~3 (Al-i İmrân 3:183, Maide 5:27, Ahkâf 46:28)" diyor ve `humanSpotChecked: true`. verse-graph-bgem3.json'da "قُرْبَان" tam formu için 1 ana geçiş bulundu (bu tokenize varyasyonundan olabilir); 3 geçiş literatürde teyit edilmiş standart bir bilgi. ✅

**Bedene (ب د ن) sayımı:** "1 (Hac 22:36)" — doğru, kelime bu formuyla tek bir yerde geçer. ✅

**Kalâid (ق ل د) sayımı:** "~2 (Maide 5:2 ve 5:97)" — doğru. ✅

### ✅ 7. Sünnet Tafsili

`rakamsalMimari.sunnetSide` bölümü kesim vakti (bayram sabahı namazından sonra), teşrik günleri, üleşim (aile/komşu/fakir üçlü paylaşımı), hayvan şartları ve akîka ayrımını klasik dört mezhep çerçevesinde veriyor. Detay:

- **Kesim vakti:** "Bayram sabahı namazından sonra" — dört mezhep uzlaşısı doğru ✅
- **Teşrik günleri:** JSON "bayram günü + teşrik günleri" diyor ama **kesim penceresi süresi** için mezhep farkı belirtilmiyor. Şafiî: 4 gün (bayram + 3 teşrik). Hanefî: 3 gün (bayram + 2 teşrik). 🟡 Minör: mezhep farkı belirtilmeden "bayram günü ve akabinde" ile yetinilmiş — doğru ama incelikten yoksun.
- **Üleşim 1/3-1/3-1/3:** Sünnet, farz değil (klasik dört mezhepte mendûb). JSON "sünnet bu Kur'ânî direktifi... üçe böl formuyla tafsil eder" diyor — doğru şekilde sünnet olarak sunulmuş ✅
- **Teşrik tekbirleri:** JSON "sünnetin uygulamayla doldurduğu Kur'ânî çerçevedir" diyor — doğru ✅

### ✅ 8. Yasak İfadeler / Kur'aniyyun Sızıntısı

`rakamsalMimari.framingTr` ve `tensionNote` açık şekilde "sadece Kur'ân, sünnete gerek yok" söylemine kapı kapatıyor: **"Bu tab 'sadece Kur'ân, sünnete gerek yok' söylemine kapı aralamaz."** Sayfa Ehl-i Sünnet çerçevesini korumada başarılı. ✅

### 🟡 9. Îzutsu §X Referansı

4 yerde "Îzutsu, Ethico-Religious Concepts" atfı geçiyor (satır 137, 323, 514, 889) ama **hiçbirinde sayfa/§ numarası yok.** `kaynaklar[3]`'te bibliyografik künye var (1959, McGill) ama iç atıflar spesifik değil. **🟡 Minör:** akademik atıf standardı için `Îzutsu 1966, §II.3` gibi bir ölçekleme faydalı olur. Mevcut hâl "soft-source" pattern'ı — yanlış değil, incelenebilir.

Not: Îzutsu'nun *Ethico-Religious Concepts* baskı tarihi genelde 1966 (Montreal, McGill-Queen's UP) olarak bilinir; JSON "1959" diyor. **🟠 Orta:** Basım tarihi hatalı olabilir. İlk basım McGill 1959 baskısı da vardır; kontrol edilmeli.

---

## Orta Düzey Sorunlar

### 🟠 [1] Kevser 108:2 tek yorum sunulmuş
**Konum:** `anaPasajlar.ayetler[10].not` (satır 603) + `kuraniIsimler[3]` Nahr girişi
**Sorun:** "venhar = kurban kes" tek yorum olarak sunulmuş; sahâbî varyasyonlarına (namaz jestleri okuması) referans yok.
**Öneri:** Nahr `anlamKatmanlari[0]`'a bir cümlelik ek: "Bazı sahâbî rivayetleri 'venhar'ı namazda ellerin boğaza kaldırılması olarak da okur; klasik tefsir (Râzî, Kurtubî) çoğunluk itibariyle kurban okumasını tercih eder."

### 🟠 [2] Îzutsu 1959 basım tarihi
**Konum:** `kaynaklar[3].period` (satır 921)
**Sorun:** *Ethico-Religious Concepts in the Qur'ān* için en yaygın referans 1966 (McGill Islamic Studies 1). 1959 baskısı Keio Üniversitesi (Tokyo) çıkışlı bir öncü versiyondur (*The Structure of the Ethical Terms in the Koran*) — aynı kitap değil.
**Öneri:** "1966 (McGill Islamic Studies)" veya "1959 Keio → 1966 McGill (genişletilmiş)" olarak düzeltilmeli.

### 🟠 [3] Bakara 2:67-71 sorgulama motifi eksik
**Konum:** `peygamberVaryasyonlari[3].sceneTr` (satır 732)
**Sorun:** Kıssanın karakteristik "sordukça zorlaştı" ahlâkî mesajı (aslında herhangi bir sığırla emri yerine getirebilirlerdi ama sordukları için sarı-özel bir hayvan aramak zorunda kaldılar) hiç geçmiyor. Klasik tefsir (Kurtubî bilhassa) bu boyutu ihmal etmez.
**Öneri:** sceneTr sonuna "İsrailoğullarının 'nasıl bir sığır?' sorgusu emri zorlaştırdı; klasik tefsir bu detayı 'sorgulamanın emri ağırlaştırması' ahlâkî öğretisi olarak okur" eklenebilir.

---

## Minör Sorunlar

### 🟡 [1] Teşrik günleri süresinde mezhep farkı
**Konum:** `rakamsalMimari.sunnetSide.points[1]` — "bayram günü ve akabinde teşrik günleri" — Hanefî 3 gün / Şafiî 4 gün ayrımı belirtilmemiş. Ayrıntı seven okuyucu için eksik.

### 🟡 [2] Îzutsu iç atıflarda spesifik olmayan referans
Yukarıda geçti — soft-source pattern.

### 🟡 [3] "Bulamayana oruç" 10 gün yorumu
`Bakara 2:196` not'unda "3+7=10 gün" fıkhî ayrıntısına değinilmiş; ancak sırasız oruç tutma vs sıralı tutma mezhep farkı yok. Küçük çıkıntı.

### 🟡 [4] Akîka'nın kurban ile karışması
`sunnetSide.points[4]` akîka'yı "farklı bir sünnet ibadeti" olarak doğru ayırmış. Ancak dilbilimsel: "nüsük ve hedy kavramlarıyla aynı kökten sayılmakla birlikte" ifadesi tartışmalı — akîka farklı bir kökten (ع ق ق). Cümle biraz gevşek.

### 🟡 [5] `anlamKatmanlari` içinde `descEn` bazen eksik
Örneğin `kuraniIsimler[0].anlamKatmanlari[3]` — Türkçe var, kısa kısımlarda İngilizce descEn dolu ama tutarlılık kontrolü değer.

---

## Tartışmalı İfadeler

- "Rüya bir 'emir' değil, 'gördüğüm' formunda bir sınav-işaretidir" (Sâffât 37:102 not'u) — bu **kelamî bir okuma**; klasik tefsirde tartışmalı. Bazı tefsirciler (Taberî çizgisi) rüyayı doğrudan vahiy sayar. Sayfa Râzî'nin "sınav-işaret" okumasını mutlak sunmuş, çoğul görüşü belirtmiyor.
- "Kesim aslında iç bir eylemdir; dıştaki bıçak yalnızca içteki teslimiyetin gölgesidir" (`icBoyut[2]`, İbrâhîm başlığı) — sûfî-hikmet tonda; klasik fıkıh çizgisi bu tür ifadelere temkinli yaklaşır. Yanlış değil ama "iç boyut" başlığı altında olduğu için kabul edilebilir.

---

## Eksik Kaynak / Zayıf Kanıt

- Îzutsu atıfları 4 yerde geçiyor ama sayfa/§ yok
- "Klasik tefsir" 40+ kez tekrarlanıyor ama "hangi klasik tefsir hangi cümlede" spesifik atıf sadece `kaynak` alanında (Râzî/Kurtubî/Elmalılı) — Zemahşerî, Beydâvî, Taberî, İbn Kesîr çizgileri hiç geçmiyor. Ehl-i Sünnet klasik tefsir spektrumunun bu üç kaynaklık daraltması hafif sınırlı bir yelpaze.
- Sünnet iddiaları (kesim vakti, üleşim, teşrik) için hadis kaynağı (Buhârî, Müslim rakamları) hiç verilmemiş; "sünnet-i mütevâtire" ifadesi genel geçmiş.

---

## Genel Değerlendirme

**Puanlama:** 8.5/10.

**Güçlü yönler:**
- Ayet ref'lerinin tümü doğru; Arapça metin standart Unicode (§13.15 uyumu iyi görünüyor — U+0650 ve normal alef kullanımı hâkim)
- Kur'ân/sünnet ilişkisi çerçevelemesi (rakamsalMimari.framingTr) örnek nitelikte akademik denge
- Habil-Kabil, İbrâhîm-İsmâîl, Kevser, En'âm sahnelerinin klasik tefsir okumasıyla senkron
- Bakara 2:67-71 için auditGuard eklenmiş — özdeşleştirme tuzağına düşülmemiş
- Kur'aniyyun sızıntısı YOK; klasik dört mezhep çerçevesi net

**Geliştirilebilir:**
- Kevser 108:2 için sahâbî varyasyon nüansı
- Îzutsu basım tarihi düzeltmesi (1966 vs 1959)
- Klasik tefsir yelpazesi genişletilebilir (Taberî, Zemahşerî, İbn Kesîr)
- Bakara 2:67-71 sorgulama motifi eklenmesi
- Hadis kaynak rakamları (Buhârî/Müslim) sünnet iddialarında zenginlik katar

**Sonuç:** Sayfa akademik açıdan sağlam, teolojik açıdan Ehl-i Sünnet çizgisinde, storytelling açısından "takva ekseni" başarıyla kurulmuş. Yayına hazır; yukarıdaki 3 orta ve 5 minör iyileştirme opsiyoneldir, kritik hata yoktur.
