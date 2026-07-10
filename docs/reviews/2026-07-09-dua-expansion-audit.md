# QuranCodex Dua Verses Expansion Audit (dua-51 → dua-80)
Tarih: 2026-07-10
Denetçi: qc-content-auditor
Kapsam: `next/public/dua-verses.json` satır 704–1094 (30 yeni giriş)

**Not — Draft dosyası bulunamadı:** `docs/reviews/2026-07-09-dua-verses-expansion-draft.md` yok. Denetim doğrudan JSON içeriği + Kur'ân ayet doğrulaması + kategorizasyon mantığı üzerinden yapıldı. Confidence bayrakları ve müfessir citasyonları görülemediği için bu iki alan **spot-check** düzeyinde değil, **kategori + defensibility** ekseninde değerlendirildi.

---

## Özet

- **Toplam yeni giriş:** 30 (dua-51 → dua-80)
- **Kritik:** 4
- **Orta:** 6
- **Düşük:** 3
- **Duplikasyon:** 0 (dua-1..50 ile ayet çakışması yok — surah:ayah eşleşme tablosu doğrulandı)
- **"pasaj" / "ritüel":** 0 (grep temiz)
- **"Îzutsu" citasyonu:** 0 (grep temiz)

---

## Kritik Bulgular

### [1] dua-60 (12:22) — Yûsuf'a hikmet verildi: DUA DEĞİL, NARRATİF BEYAN
**Alıntı:** "Yûsuf olgunluk çağına eriştiğinde, ona hüküm (hikmet) ve ilim verdik."
**Sorun:** Ayet bir yakarış (duʿâʾ) değil; Allah'ın Yûsuf'a hüküm ve ilim ihsân ettiğini **anlatan** bir narrative frame. `prophet_tr` alanı da bu farkındalığı zımnen kabul ediyor: "Allah'ın Yûsuf'a verdiği hüküm ve ilim." Kategori `ilim` — ama ayet ilim isteme duası değil, Allah'ın ilim verdiğini beyan eden 3. şahıs anlatısıdır. `note_tr` "İlim istemenin zemini" formülasyonuyla açığı kapatmaya çalışıyor; bu tefsir zorlaması ve savunulması güç.
**Öneri:** Ya çıkarılsın ya da kategorisi `genel` yapılıp "dua değil, dua-eyleminin arka planı olan ilahi lütuf" notu eklensin. `duas` array'inde tutmak yanlış sinyaldir.

### [2] dua-64 (18:65) — Hızır'a ilim öğretildi: DUA DEĞİL, NARRATİF FRAME
**Alıntı:** "Derken kullarımızdan bir kul buldular ki, biz ona katımızdan bir rahmet vermiş, kendisine tarafımızdan bir ilim öğretmiştik."
**Sorun:** Bu Musa–Hızır kıssasının **açılış cümlesi**; ilim duasının değil, ilim-in-nakli olarak Hızır'ın tanıtım ayetidir. Ne 1. şahıs yakarış ne 3. şahıs adına dua. `prophet_tr` "Hz. Hızır (Allah'ın verdiği 'ledünnî ilim')" ifadesi bunu itiraf ediyor. Kategori `ilim` savunulamaz.
**Öneri:** Çıkarılsın. Ledünnî ilim konusu ayrı bir "kavram atlası" içeriği için uygundur; dua koleksiyonuna dahil değildir.

### [3] dua-63 (18:24) — "Rabbeke izâ nesîte...": kısmî alıntı sorunu
**Alıntı olarak sunulan Arapça:** "اِلَّٓا اَنْ يَشَٓاءَ اللّٰهُ وَاذْكُرْ رَبَّكَ اِذَا نَسِيتَ..."
**Sorun:** Ayetin başlangıcı **"İllâ en yeşâʾallâh"** — önceki ayetin (18:23) devamıdır, bağlamdan koparıldığında havada kalır ("Ancak Allah dilerse..."). Ayrıca ayetin ana içeriği bir dua **formülünü öğreten emir**, dua metninin kendisi değil. Yakarış kısmı sadece son cümle: "ʿasâ en yehdiyeni Rabbî li-akrabe min hâzâ raşedâ." Girişte 18:23'ün son iki kelimesi taşınmadan gösterilirse okuyucu ne dendiğini anlamaz.
**Öneri:** Ya 18:23-24 birlikte gösterilsin (`ayah_end: 24` ile başlangıç 23), ya da Arapça bloktan "İllâ en yeşâʾallâh" çıkarılıp "wezkur rabbeke izâ nesîte..." ile başlansın.

### [4] dua-71 (55:78) — Doksoloji (isim tesbihi) DUA olarak sunuluyor
**Alıntı:** "Tebâreke'smu Rabbike zi'l-celâli ve'l-ikrâm."
**Sorun:** Rahmân sûresi kapanış doksolojisi; "Rabbinin ismi ne yücedir!" bir tesbih/hamd cümlesidir, `duʿâʾ` (talep/yakarış) değildir. Note_tr'de "İsmi anmak dua etmektir" gerekçesi tasavvufî-hermenötik bir genişletme; klasik tefsir literatüründe (Râzî, Kurtubî, İbn Kesîr) 55:78 dua ayetleri arasında değil, **hâtimetü's-sûre / hamd** başlığı altında değerlendirilir. Kategori `genel` savunulamaz.
**Öneri:** Çıkarılsın veya ayrı bir "hamd/tesbih ayetleri" kategorisi kurulup oraya taşınsın.

---

## Orta Düzey Sorunlar

### [5] dua-53 (3:9) — "Ûlü'l-elbâb" duasının tam metni
`prophet_tr` = "İnananlar (Ûlü'l-elbâb)" doğru bir atıf; ancak 3:9 aslında **3:8-9 çiftinin ikinci yarısı**. 3:8 duanın kalp cümlesi ("kalplerimizi eğriltme..."), 3:9 duanın kozmolojik gerekçesi. Tek başına 3:9 gösterilirse dua-1..50 içindeki `ali-imran-8` girişiyle konseptsel çakışma oluşur (ikisi tek yakarış). Ayrıca duplicate değil ama redundant risk.
**Öneri:** `ayah_end: 9` ve başlangıç 8 yapılsın; ya da 3:9 tek başına `hidayet` yerine "tasdik/itiraf" alt-kategorisiyle işaretlensin.

### [6] dua-54 (3:191) — "ûlü'l-elbâb" atfı OK, ama ayet parçası
Doğru dua ayetidir; ancak 3:190-194 pasajının duası **3:191'de başlayıp 3:194'te biter** (klasik "Rabbenâ" zinciri). Yalnızca 3:191 alınırsa "Rabbenâ mâ halakte hâzâ bâtılâ..." kısmı işaretleniyor, sonrası kesiliyor. `ayah_end` alanı boş; dua-1..50'de `ali-imran-193` girişi zaten 3:193-194 kısmını içeriyor. Bu ikisi tamamlayıcı — kullanıcı için ayrı iki dua gibi görünmesi kafa karıştırıcı.
**Öneri:** Ya `ayah_end: 194` ile 3:191-194 birleşik gösterilsin, ya da `note_tr`'ye "3:193-194 ile birlikte okunur (bkz. ali-imran-193)" cross-ref eklensin.

### [7] dua-67 (27:40) — "hâzâ min fadli Rabbî" gerçekten `sukur`
Ayet Süleymân'ın tahtın anında getirilmesi karşısındaki tepkisi. "Bu Rabbimin lütfundandır — beni imtiḥân ediyor: şükür mü, nankörlük mü?" ifadesi klasik tefsirde (Râzî, Kurtubî) **şükrün model beyanı** olarak okunur — bu doğru bir kategorizasyon. Ancak dilbilgisel olarak bir yakarış değil, iç-monolog / hâl-i şükür. Not_tr yeterli nuance sağlıyor; kritik değil ama "dua" başlığı altına gevşek dahil edildiği not edilmeli.
**Öneri:** Kategori korunabilir; ancak koleksiyon üst-başlığında "Kur'ân'daki dua ve şükür formülleri" gibi kapsam genişlemesi yapılırsa daha dürüst olur.

### [8] dua-70 (40:60) — "udʿûnî estecib lekum": dua-eyleminin **öğretisi**
Ayet ontolojik: "Bana dua edin, cevap vereyim." Kendisi bir yakarış değil, dua-eylemini emreden ilahi bildirim. `note_tr` doğru okuma sunuyor ("dua etmemek kibirdir"). `genel` kategorisi savunulabilir çünkü Kur'ân'ın dua-teolojisinin ana ayetidir; ancak `duas` listesinde gösterildiğinde okuyucu bunu bir yakarış metni sanabilir. Prophet_tr = "Genel (Allah'ın çağrısı)" doğru işaret veriyor.
**Öneri:** Korunabilir; `note_tr`'nin "bu bir dua metni değil, duanın kendisine yapılan davettir" formulasyonu daha net yapılabilir.

### [9] dua-74 (63:10) — Reddedilen dua narrative frame'i
Ayet ölüm anındaki insanın "keşke ertelenseydim" isteğini **uyarı olarak** aktarır; bu, kabul edilmeyecek bir talebin öykülenmesidir. `duas` listesinde `genel` kategorisiyle gösterilmesi problematik: reddedileceği baştan bildirilen bir talep, "dua örneği" olarak sunulduğunda didaktik amaç ile taksonomi tutarsızlığı doğuruyor. `note_tr` bu farkı yakalamış ("cevaplanmayacak olanıdır"), ancak taksonomik konum hâlâ tuhaf.
**Öneri:** Ya ayrı bir "reddedilen dua / uyarı" alt-kategorisi eklensin, ya da bu ayet çıkarılsın. Şu anki hâliyle koleksiyonun "kabul edilecek yakarış örnekleri" varsayımını kırıyor.

### [10] dua-77 (26:118) atfı ile mevcut Nûh duaları
`prophet_tr` = "Hz. Nûh" doğru (Şuara sûresi 26:105-120 Nûh kıssası). Ancak kategori `aile` — 26:118 metninde "ehl" (aile) ifadesi geçmiyor, "benimle beraber olan mü'minler" ifadesi geçiyor. `aile` yerine `sikinit` veya `siginma` daha doğru.
**Öneri:** Kategori `sikinit` veya `siginma` yapılsın; "aile" atfı 26:169 (dua-78, Lût) ile karışıklık üretiyor.

---

## Düşük Öncelikli

### [11] dua-58 (10:88) — note_tr'de kapanmayan tırnak
`"note_tr": "...Rabbin cevabı da hazırdır: \"istikamet."` — kapanış tırnağı eksik. Aynı hata `note_en`'de de var. JSON valid ama render'da yaralı görünür.
**Öneri:** `\"istikamet.\"` olarak düzeltilsin.

### [12] dua-77 (26:118) — note_tr/en'de kapanmayan tırnak
`"salvation not for himself alone but for \"those with me."` — kapanış tırnağı eksik.
**Öneri:** `\"those with me.\"` olarak düzeltilsin.

### [13] dua-51 (2:37) — kategori seçimi
`tovbe` kategorisi doğru; ancak metin **Allah'ın Âdem'e kelimeleri öğretmesi** ve tövbeyi kabul etmesi. Âdem'in bizzat yakarışı 7:23'te (dua-15/araf-23) verilir. 2:37 bu duanın "kabul beyanı"dır. `tovbe` altında bırakılabilir ama not_tr "kelime aramak" ifadesi metin-dışı bir romantizm; klasik tefsir "kelimât"ı Âdem'in söylediği tövbe cümleleriyle (7:23) özdeşleştirir.
**Öneri:** Not_tr'ye "7:23'te verilen tövbe cümleleridir (İbn Abbâs rivayeti; Râzî, Kurtubî)" cross-ref eklensin.

---

## Duplicate Kontrolü

30 yeni ayetin hiçbiri dua-1..50 içindeki 50 ayet-referansıyla çakışmıyor. Kontrol tam surah:ayah eşleşme tablosuyla yapıldı. **Duplicate yok.**

## Turkish Bans

`pasaj` ve `ritüel` grep'i temiz — 30 girişte tek örnek yok.

## Îzutsu Citasyonu

Grep temiz. Beklenildiği gibi.

## Prophet Attribution Tutarlılığı

- **dua-54 (3:191) "Ûlü'l-elbâb":** ✓ Doğru; ayet 3:190'da "li-ûli'l-elbâb" ile açılıyor.
- **dua-56 (7:189) "Âdem & Havva":** ✓ Klasik tefsirin (Râzî, İbn Kesîr) "nefs-i vâhide"yi Âdem ile eşleştirmesi; ancak modern tefsirde (Yaşar Nuri, Muhammed Esed) "her insan çifti" olarak da okunur. `note_tr` bu ihtimali kapatıyor.
- **dua-70 (40:60), dua-79 (29:60), dua-73 (62:10):** "Genel" atıfları uygun; ancak "Genel" bir peygamber değil, bir muhatap kategorisi — data schema'sı bu ayrımı desteklemiyor (`prophet_tr` alanı hem kişi hem soyut kategoriye hizmet ediyor). Sistemik zayıflık, not düşülmeli.

---

## Genel Değerlendirme

**Güçlü yönler:** Arapça metinler §13.15 encoding standartına uygun (grep U+06EA / U+0671 / U+06E1 temiz); duplicate yok; "pasaj/ritüel" yasakları ihlal edilmedi; TR/EN paralel çevirileri sağlıklı; note metinleri edebi ve derinlikli.

**Zayıf yönler:** Koleksiyon "Kur'ân'daki dua-örnekleri" başlığı altında 4 giriş (dua-60, 64, 71, 74) taksonomik olarak zorluk çıkarıyor — bunlar dua **hakkında** ayetler veya dua-öğretisi ayetleri, dua **metni** değil. Bu genişleme kasıtlıysa koleksiyon üst-başlığı "Kur'ân'daki dua ve dua-teolojisi" olarak güncellenmeli. Değilse 4 giriş çıkarılmalı.

**Öncelikli aksiyon:** Kritik 4 madde (dua-60, 64, 71 çıkarma; dua-63 metin başlangıç fix) + 2 tırnak fix (dua-58, dua-77).

**Confidence bayrakları hakkında not:** Draft dosyası bulunamadığı için 13 "medium" işaretinin hangi girişlere ait olduğu görülemedi. Yukarıdaki kritik/orta bulgular defensibility açısından yüksek olasılıkla "medium" olarak flag'lenmiş girişlerle örtüşür (60, 64, 71, 74). Draft dosyası paylaşılırsa hedefli cross-check yapılabilir.
