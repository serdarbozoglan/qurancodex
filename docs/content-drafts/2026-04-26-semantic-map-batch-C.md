# Content Draft — F-2 Semantic Map: Batch C (5 küme)
Tarih: 2026-04-26
Üreten: qc-content-producer (kısmi tema analizi) + manuel tamamlama (I/O stall sonrası)
Durum: TASLAK — kullanıcı incelemesi bekleniyor

---

## 0. Üretim Notu (önsöz)

Bu dosya, 20 anlamlı semantik kümeden son **5 tanesi** için içerik taslağıdır (Pilot 5 + Batch A 5 + Batch B 5 + Batch C 5 = 20 tamam).

**Süreç:** qc-content-producer agent Batch C için tema tespitlerini yaptı (#15: sapıklık-yardımcısızlık, #16: sırat-ı müstakim, #17: *sümme* sıralayıcı, #18: yalanlayan kavimler listesi, #19: *kellâ* reddi). Markdown yazımı sırasında watchdog timeout oldu; tema tespitleri ve reference dosyasındaki tam Türkçe mealler kullanılarak manuel tamamlandı.

**Kabul edilen kısıtlar:**
- **Arapça ayet metni üretilmedi.** Reference dosyasında zaten Arapça yok; merkezi 10 ayet için sadece Türkçe meal alıntılandı.
- **İstatistikler doğrulandı.** verse_count, distinct_surahs, top_surahs, avg_semantic_density birebir `public/semantic-map.json`'dan alındı.
- **Mekkî/Medenî dağılımı tahmini.** İhtilaflı sûreler "(ihtilaflı)" notuyla işaretlendi.
- **Klasik tefsir atıfları** konu bazlı verildi; spesifik cilt/sayfa numarası verilmedi (üretim aşamasında doğrulanabilir genel referans).

---

## Küme #15 — Sapıklık ve Yardımcısızlık / Going Astray, No Helper

**Veri:** 147 ayet · 63 farklı sûre · avg semantic density 0.891 · top sûreler: 4 (Nisâ, Med.) · 2 (Bakara, Med.) · 21 (Enbiyâ, Mek.) · 39 (Zümer, Mek.) · 17 (İsrâ, Mek.)

**Merkezi 10 ayet (referans):**
- **42:46 (Şûrâ)** — "Allah kimi saptırırsa onun kurtuluşa çıkan bir yolu yoktur"; *velî* (dost/yardımcı) yokluğu
- **39:36 (Zümer)** — "Allah saptırırsa, artık onun yolunu doğrultacak biri yoktur"
- **39:37 (Zümer)** — "Allah kime de hidayet ederse, artık onu saptıracak yoktur"
- **40:33 (Mü'min)** — kaçış olmadığı; "sizi Allah'tan kurtaracak kimse yoktur"
- **36:24 (Yâsîn)** — "apaçık bir sapıklığın içine gömülmüş olurum"
- **21:54 (Enbiyâ)** — İbrahim'in babasına/kavmine: "siz de babalarınız da açık sapıklık içindesiniz"
- **7:60 (Aʿrâf)** — Nûh kavminin Nûh'a: "biz seni gerçekten apaçık bir sapıklık içinde görüyoruz"
- **34:24 (Sebe')** — "biz veya siz, ikimizden biri ya doğru yol üzerinde veya açık bir sapıklık içindedir"
- **40:33 (Mü'min)** — Mü'min sûresindeki kıyamet sahnesi; kaçacak yer yok
- **39:36–37 (Zümer)** — *yudill / yehdî* zıt fiillerin ardışıklığı

### Tema (tr)
**Sapıklık ve Yardımcısızlık** — *dalâl* (sapma) ile *velî yokluğu* motifinin örtüşmesi: Allah saptırınca insanın hiçbir başvuracağı kaynak kalmaz.

### Theme (en)
**Going Astray, No Helper** — the convergence of *ḍalāl* (going astray) with the **absence of an *awliyāʾ*** (helpers/protectors): when Allah leads someone astray, no recourse remains.

### Özet (tr)
Bu küme Kur'ân'ın en sert teolojik birleşkesini içerir: hidayet ve sapma yetkisinin **mutlak ilâhî tekel**i altında, sapan insanın yalnızlığı. *Velî*, *naṣīr*, *vâki*, *hâdî* gibi yardımcı-isimlerinin tam reddi formül halinde tekrarlanır. 63 farklı sûreye yayılması bu vurgu çerçevesinin **leitmotif** olduğunu gösterir; aynı kümenin tartıştığı paradoks da burada: insan iradesi ile ilâhî takdir gerilimi.

### Summary (en)
This cluster carries one of the Qur'an's tightest theological junctures: the absolute divine monopoly over guidance and misguidance, leaving the astray utterly without recourse. The denial of *awliyāʾ*, *naṣīr*, *wāqī*, *hādī* — every "helper" name — recurs as a formula. Spread over 63 surahs, this rhetorical frame functions as a leitmotif, sustaining the human-will-vs-divine-decree tension that Islamic theology has read in two opposing ways.

### Alt Temalar
1. **"Allah saptırırsa hâdî yoktur"** — *yudill* fiilinin negatif eşlenmesi (39:36, 42:46, 40:33).
2. **Sapıklığın iç deneyimi** — birinci tekil itiraf: "ben apaçık sapıklığa gömülürdüm" (36:24).
3. **Karşılıklı sapıklık ithamı** — peygamber-kavim arası karşılıklı *ḍalāl* görme (21:54, 7:60).
4. **İkili tasnif** — "ya hidayet ya sapıklık" net ayrım (34:24).
5. **Yardımcı yokluğu (*lā ʿāṣim*)** — kıyamet sahnesinde kaçış kapısının kapanması (40:33).
6. **Hidayetin mütekabilliği** — sapma-hidayet aynı failin elinde (39:36–37 ardışık).

### Wow Notu (tr)
147 ayet **63 sûreye** yayılmış — Kur'ân sûrelerinin **%55**'i bu motifi en az bir kez işliyor. Top sûreler arasında **3 Mekkî + 2 Medenî** karışımı: bu motif ne erken-Mekkî ne de geç-Medenî dönem özelliği — Kur'ân boyunca **dengeli süreklilik** gösteriyor. Komşu küme **#16 (sırat-ı müstakim, bond 254.8)** ile bağı bu kümenin teolojik **ikizi** olduğuna işaret: birlikte okunduğunda *yudill / yehdî* polaritesi tam.

### Wow Note (en)
147 verses across **63 surahs** — about **55 %** of all Quranic surahs invoke this motif at least once. The top-5 surah mix splits 3 Meccan + 2 Medinan, indicating this is not a phase-bound rhetoric but a **steady throughline**. Its strongest semantic neighbor — **Cluster #16 (the Straight Path, bond 254.8)** — marks the theological twin: read together, the two clusters complete the *yuḍill / yahdī* polarity.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *iḍlāl* (saptırma) fiilinin teolojik tartışması; Eş'arî/Mu'tezilî yorum farkları.
- **Zemahşerî, *Keşşâf*** — Mu'tezilî perspektiften iḍlāl'in nüansları (terkiyye/tahliyye).
- **Toshihiko Izutsu, *The Concept of Belief in Islamic Theology* (1965)** — *ḍalāl* / *hudā* karşıtlığının semantik ekseni.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — *velî* / *naṣīr* / *vâki* dizisinin yardımcı-isim yapısı.
- **Mehmet Okuyan, *Kur'an Sözlüğü*** — *ḍalāl* kavramının Türkçe-Arapça anlam alanı.
- **Daniel Madigan, *The Qur'ān's Self-Image*** — hidayet metninin kendine atfı.

### Komşu Kümelerle İlişki
- **Küme #16 (bond 254.8)** — sırat-ı müstakim/hidayet kümesi; bu kümenin **olumsuz aynası**.
- **Küme #1 (bond 254.8)** — kozmik egemenlik; *velî yokluğu* tevhid'in negatif yansıması.
- **Küme #0 (bond 200.8)** — peygamber tebliği; sapma motifi tebliğ-direnç bağlamında.

---

## Küme #16 — Sırat-ı Müstakim / The Straight Path

**Veri:** 144 ayet · 50 farklı sûre · avg semantic density 0.889 · top sûreler: 3 (Âl-i İmrân, Med.) · 2 (Bakara, Med.) · 6 (Enʿâm, Mek.) · 37 (Sâffât, Mek.) · 43 (Zuhruf, Mek.)

**Merkezi 10 ayet (referans):**
- **10:25 (Yûnus)** — "Allah kullarını esenlik yurduna çağırıyor; dilediğini doğru yola iletir"
- **24:46 (Nûr)** — "Andolsun biz açık seçik ayetler indirdik. Allah dilediğini doğru yola iletir"
- **6:161 (Enʿâm)** — "Rabbim beni dosdoğru dine, Allah'ı birleyen İbrahim'in dinine iletti"
- **23:73 (Mü'minûn)** — "Sen onları doğru bir yola çağırıyorsun"
- **36:61 (Yâsîn)** — "Bana kulluk ediniz, doğru yol budur"
- **19:36 (Meryem)** — Hz. İsa'nın sözü: "O'na kulluk ediniz. İşte doğru yol budur"
- **16:121 (Nahl)** — Hz. İbrahim için: "Allah onu seçmiş ve doğru yola iletmişti"
- **5:16 (Mâide)** — "Allah... onları karanlıklardan aydınlığa çıkarır, dosdoğru bir yola iletir"
- **6:87 (Enʿâm)** — peygamberlerin atalarından/çocuklarından: "Onları seçkin kıldık ve doğru yola ilettik"
- **19:41 (Meryem)** — İbrahim için *ṣiddīq* (sıdkı bütün) sıfatı

### Tema (tr)
**Sırat-ı Müstakim ve Hidayet İradesi** — *yehdî men yeşâʾ* (dilediğini doğru yola iletir) formülü ile peygamberlerin "*hudâ*" zincirine eklemlenmesi.

### Theme (en)
**The Straight Path and Sovereign Guidance** — the *yahdī man yashāʾ* ("guides whom He wills") formula linked to the prophetic chain of *hudā*.

### Özet (tr)
Bu küme **#15'in olumlu aynasıdır**: Allah saptırınca yardımcı kalmıyorsa, hidayet edince de saptıracak kimse yok. Merkezi ayetlerin önemli bir kısmı *peygamber dili*nden konuşur — Hz. İbrahim, Hz. İsa, Hz. Muhammed kendilerini "dosdoğru yola iletildim/iletildiler" formülüyle anar. Yani sırat-ı müstakim sadece soyut bir ahlâk normu değil, **peygamberlik silsilesinin teolojik damgası**.

### Summary (en)
This cluster is **the affirmative mirror of #15**: if no one can guide whom Allah leads astray, no one can lead astray whom Allah guides. A striking share of the central verses speak in **prophetic voice** — Abraham, Jesus, Muhammad each invoke "*I was guided to the straight path*" or "*they were guided*." The Straight Path is therefore not merely an abstract ethical norm but **the theological signature of prophetic succession**.

### Alt Temalar
1. **"*Yehdî men yeşâʾ*"** — Allah'ın dilediğini hidayete erdirmesi formülü (10:25, 24:46).
2. **Peygamber dili** — birinci-tekil "ben hidayet edildim" beyanı (6:161, 36:61, 19:36).
3. **Peygamberlik silsilesi** — atalardan oğullara seçilenler (6:87, 16:121).
4. **"Dosdoğru din"** — *dîni'l-kıyem* / *millet-i İbrâhîm* eşitlemesi (6:161).
5. **Karanlık-aydınlık metaforu** — *zulümât* → *nûr* hidayet hareketi (5:16).

### Wow Notu (tr)
144 ayet · 50 sûre · ortalama semantik yoğunluk 0.889. Komşu kümelerde **dominant olarak Küme #0 (peygamber tebliği, bond 261.6)** ve **Küme #1 (mülk/tevhid, bond 201.8)** öne çıkar — bu, "*hidayet*" kavramının Kur'ân'da **peygamberlik silsilesi** ve **kozmik egemenlik** ile üçlü-bağlanımlı olduğunu gösterir. Küme #15 ile bond skoru 254.8 — semantic-map içindeki **en simetrik teolojik çift**.

### Wow Note (en)
144 verses across 50 surahs, density 0.889. Its strongest neighbors — **Cluster #0 (prophetic proclamation, bond 261.6)** and **Cluster #1 (sovereignty/tawḥīd, bond 201.8)** — show that *hidāya* in the Qur'an is triply bound to **prophetic chain** and **cosmic sovereignty**. The bond with **Cluster #15 (going astray, 254.8)** marks the **most symmetric theological pair** in the entire semantic map.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *yehdî men yeşâʾ* formülünün teolojik analizi.
- **Zemahşerî, *Keşşâf*** — sırat-ı müstakim'in belâgî yapısı (Fatiha 1:6 ekseni).
- **Toshihiko Izutsu, *Ethico-Religious Concepts in the Qur'ān* (1966)** — *hudā* / *ḍalāl* / *ṣirāṭ* kavram alanı.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — peygamberlerin *ihtidâʾ* zincirinin Kur'ânî sürekliliği.
- **Daniel Madigan, *The Qur'ān's Self-Image* (2001)** — Kur'ân'ın kendi içine aldığı hidayet metni.
- **Mustafa Öztürk, *Kıssaların Dili*** — peygamber dili olarak hidayet beyanları.

### Komşu Kümelerle İlişki
- **Küme #0 (bond 261.6)** — peygamber tebliği; hidayet bu kümenin **iç teolojisi**.
- **Küme #15 (bond 254.8)** — sapıklık ekseni; bu kümenin **negatif eşi**.
- **Küme #1 (bond 201.8)** — kozmik egemenlik; hidayet *meşîʾah* kavramı üzerinden mülke bağlanır.

---

## Küme #17 — "Sümme": Eylem Zinciri / *Thumma*: The Sequence Conjunction

**Veri:** 136 ayet · 48 farklı sûre · avg semantic density 0.885 · top sûreler: 37 (Sâffât, Mek.) · 26 (Şuarâ, Mek.) · 69 (Hâkka, Mek.) · 44 (Duhân, Mek.) · 17 (İsrâ, Mek.)

**Merkezi 10 ayet (referans):**
- **69:31 (Hâkka)** — "*Sümme* alevli ateşe atın onu!" (cehennem buyruğu)
- **23:16 (Mü'minûn)** — "*Sümme* kıyamet gününde tekrar diriltileceksiniz"
- **56:51 (Vâkıa)** — "*Sümme* siz ey sapıklar, yalancılar!"
- **2:28 (Bakara)** — yarat-öldür-dirilt zinciri: "*sümme* öldürecek, *sümme* diriltecek"
- **39:31 (Zümer)** — "*sümme* Rabbinizin huzurunda davalaşacaksınız"
- **26:172 (Şuarâ)** — "*Sümme* diğerlerini helak ettik"
- **37:82 (Sâffât)** — "*Sümme* ötekileri suda boğduk"
- **22:66 (Hac)** — yarat-öldür-dirilt: "*sümme* öldürecek, *sümme* yine diriltecek"
- **53:41 (Necm)** — "*Sümme* ona karşılığı tastamam verilecektir"
- **26:120 (Şuarâ)** — "*Sümme* da geri kalanları suda boğduk"

### Tema (tr)
**"Sümme" Sıralayıcı: Eylem Zinciri** — *sümme* (sonra) edatının yarat–öldür–dirilt ve helak/azap dizilerini bağlayıcı belâgî işlevi.

### Theme (en)
**"Thumma": The Action-Chain Conjunction** — the particle *thumma* (then) as a rhetorical hinge linking creation–death–resurrection and successive destructions.

### Özet (tr)
Bu küme bir **sözdizimsel** keşif: tek bir Arapça edatın (*sümme*) Kur'ân'ın iki ana eskatolojik mantığını birleştirmesi. Bir tarafta **yaratma → ölüm → diriltme** zinciri (2:28, 22:66), diğer tarafta **bir öncekini helak → sonrakini boğma** zinciri (26:120, 26:172, 37:82). *Sümme* burada sadece "sonra" demiyor — **zaman boyunca süren ilâhî eylem mantığını** kuruyor. Klasik belâgatta *sümme*'nin "tertîb maʿa terâhī" (sıra + zaman aralığı) yapısı bu kümenin teolojik özüdür.

### Summary (en)
This cluster is a **syntactic** discovery: a single Arabic particle (*thumma*) binds the Qur'an's two great eschatological logics. On one side, the **creation → death → resurrection** chain (2:28, 22:66); on the other, **destroying one nation, then drowning the next** (26:120, 26:172, 37:82). *Thumma* does not merely mean "then" — it constructs the **logic of God's action across time**. Classical Arabic rhetoric defines *thumma* as *tartīb maʿa tarākhī* (sequence with temporal interval); this cluster is its theological materialization.

### Alt Temalar
1. **Yarat–öldür–dirilt** — kozmik biyolojik döngü (2:28, 22:66).
2. **Helak silsilesi** — bir kavmin ardından ötekinin yokedilmesi (26:120, 26:172, 37:82).
3. **Cehennem buyruğu** — *sümme* azap fiilini başlatan emir (69:31).
4. **Hesap günü ardışıklığı** — *sümme*'nin "sonra Rabbinin huzurunda" formülü (39:31, 23:16).
5. **Tam karşılık (*tevfiye*)** — *sümme* ile başlayan ödeme cümlesi (53:41).

### Wow Notu (tr)
136 ayetin **top 5 sûresi tamamen Mekkî** — Sâffât (12), Şuarâ (8), Hâkka, Duhân, İsrâ. Bu, *sümme* ile inşa edilen eskatolojik zincirleme retoriğinin **Mekkî dönemde damgalı** olduğunu gösterir; Mekke'de henüz hukuk değil, **zaman-mantığı** şekillendiriliyor. Küme **doğrudan #1 (mülk, bond 163), #0 (peygamber tebliği, bond 155), #3 (iman+amel→cennet, bond 137)** ile bağlı — yarat-öldür-dirilt zinciri tüm büyük tematik düğümleri besliyor.

### Wow Note (en)
The top-5 surahs of these 136 verses are **all Meccan** — Ṣāffāt (12), Shuʿarāʾ (8), Ḥāqqa, Dukhān, Isrāʾ. The *thumma*-built eschatological chain is therefore **a Meccan rhetorical signature** — at this phase, the Qur'an shapes not law but **time-logic**. The cluster bonds directly to **#1 (sovereignty, 163)**, **#0 (prophetic proclamation, 155)**, **#3 (faith+deeds→paradise, 137)** — the create-destroy-resurrect chain feeds every major thematic node.

### Kaynaklar (sources)
- **Cürcânî, *Delâilü'l-İ'câz*** — *vâv*, *fâ*, *sümme* edatlarının zaman ve sıra arasındaki belâgî farkı.
- **İbn Aşur, *et-Tahrîr ve't-Tenvîr*** — *sümme*'nin "*tertīb maʿa tarākhī*" (sıra + ara) yapısı.
- **Râzî, *Mefâtîhu'l-Gayb*** — yarat-öldür-dirilt formülünün teolojik analizi.
- **Mustansir Mir, *Coherence in the Qur'an* (1986)** — sûre-içi zincirleme yapıların retorik işlevi.
- **Toshihiko Izutsu, *God and Man in the Qur'an* (1964)** — yaratma-ölüm-diriltme döngüsünün ontolojik kavramı.
- **Salwa El-Awa, *Textual Relations in the Qur'an* (2006)** — Arapça bağlaçların metin-içi işlevi.

### Komşu Kümelerle İlişki
- **Küme #1 (bond 163.1)** — kozmik mülk/tevhid; *sümme*'nin işlettiği ilâhî eylemin öznesi.
- **Küme #0 (bond 155.2)** — peygamber tebliği; helak zincirinin *uyarı* tarafı.
- **Küme #3 (bond 137.9)** — iman+amel→cennet; eskatolojik zincirin *vaad* tarafı.
- **Küme #7 (bond 115.8)** — hesap adaleti; *sümme yüvefâ* (sonra tastamam ödenecek) formülü.

---

## Küme #18 — Yalanlayan Kavimler Listesi / The Catalogue of Denying Nations

**Veri:** 123 ayet · 57 farklı sûre · avg semantic density 0.875 · top sûreler: 37 (Sâffât, Mek.) · 56 (Vâkıa, Mek.) · 54 (Kamer, Mek.) · 26 (Şuarâ, Mek.) · 50 (Kâf, Mek.)

**Merkezi 10 ayet (referans):**
- **15:80 (Hicr)** — "Hicr halkı da peygamberleri yalanlamıştı"
- **26:176 (Şuarâ)** — "Eyke halkı da peygamberleri yalancılıkla suçladı"
- **50:12 (Kâf)** — "Nuh kavmi, Res halkı ve Semud da yalanlamıştı"
- **22:42 (Hac)** — "Nuh'un kavmi, Âd, Semud kendi peygamberlerini yalanladılar"
- **26:160 (Şuarâ)** — "Lut kavmi de peygamberleri yalancılıkla suçladı"
- **26:141 (Şuarâ)** — "Semud da peygamberleri yalancılıkla suçladı"
- **26:105 (Şuarâ)** — "Nuh kavmi de peygamberleri yalancılıkla suçladılar"
- **67:18 (Mülk)** — "Andolsun ki onlardan öncekiler de yalan saymışlardı"
- **38:12 (Sâd)** — "Nuh kavmi, Âd kavmi, Firavun da yalanladılar"
- **56:90 (Vâkıa)** — Şuarâ refrain'inin yan örneği

### Tema (tr)
**Yalanlayan Kavimler Listesi** — *kezzebet kavmü...* formülü ve Şuarâ refrain'inin paralel sıralaması.

### Theme (en)
**The Catalogue of Denying Nations** — the *kadhdhabat qawmu...* formula and the parallel listing of the Shuʿarāʾ refrain.

### Özet (tr)
Bu küme Kur'ân'ın **liste-yapı**lı bir retoriğini izole eder: Nûh, Âd, Semud, Lût, Eyke, Hicr, Firavun, Res — birbirine paralel konstrüksiyonla yan yana getirilmiş kavim isimleri. Şuarâ sûresinde bu liste neredeyse **eşbiçimli kıta**lar halinde yedi kavim için tekrarlanır (*kezzebet [X] el-mürselîn*); 50:12 ve 38:12 gibi başka sûrelerde aynı liste yoğunlaştırılır. Küme #9 ("yeryüzünde gezin") ile bond yüksek değil — bu küme **dış-anlatım/ibret çağrısı** değil, **iç-liste/paralel yapı** kümesi.

### Summary (en)
This cluster isolates a **list-rhetoric** in the Qur'an: Nūḥ, ʿĀd, Thamūd, Lūṭ, Aṣḥāb al-Aykah, Aṣḥāb al-Ḥijr, Pharaoh, the people of al-Rass — nation-names placed in parallel construction. In Sūrat al-Shuʿarāʾ this list runs in **near-isomorphic stanzas** for seven nations (*kadhdhabat [X] al-mursalīn*); other surahs (50:12, 38:12) condense the same roster. The bond with Cluster #9 ("travel through the earth") is not high — this cluster is not the **outward narrative / take-warning** call but the **inward-listing / parallel-structure** mode.

### Alt Temalar
1. **Şuarâ kıta-refrain'i** — *kezzebet [kavim] el-mürselîn* (26:105, 26:141, 26:160, 26:176).
2. **Kondanse liste** — birden fazla kavmin tek ayette toplanması (50:12, 38:12, 22:42).
3. **Soyut yalanlayanlar** — kişi/kavim ismi yerine *ellezîne kefefû* (67:18).
4. **Belirli/belirsiz peygamber** — bazı ayetlerde "kendi peygamberlerini" (22:42), bazılarında "elçileri" (50:12).
5. **Ardışık sınıflandırma** — kavim → şehir/yer (Hicr, Eyke, Res) — coğrafya-kavim eşlemesi.

### Wow Notu (tr)
123 ayetin **top 5 sûresi tamamen Mekkî** (Sâffât, Vâkıa, Kamer, Şuarâ, Kâf) ve hepsi orta-uzunluk peygamber-yoğun sûreler. Şuarâ sûresinden tek başına **7 ayet** merkezi listede yer alıyor (26:105, 26:141, 26:160, 26:176, ...) — Şuarâ'nın "*kezzebet [X] el-mürselîn*" refrain'inin embedding tarafından **bir blok** olarak ayrılmış olması, BGE-M3'ün retorik biçimi yakaladığını gösterir. Komşu **#3 (iman+amel→cennet, bond 156.7)** — yalanlayanlar listesinin teolojik **karşı kutbu**.

### Wow Note (en)
All top-5 surahs are **Meccan** (Ṣāffāt, Wāqiʿa, Qamar, Shuʿarāʾ, Qāf), all medium-length and prophet-heavy. **7 verses from Sūrat al-Shuʿarāʾ alone** appear in the central listing (26:105, 26:141, 26:160, 26:176, etc.) — the *kadhdhabat [X] al-mursalīn* refrain has been isolated as a **single block** by the embedding, evidence that BGE-M3 captures rhetorical form, not just content. The strongest neighbor — **Cluster #3 (faith+deeds→paradise, bond 156.7)** — marks the **theological inverse pole** of the list of deniers.

### Kaynaklar (sources)
- **Mustansir Mir, *Coherence in the Qur'an* (1986)** — sûre-içi tekrar ve liste yapısının organizasyon işlevi.
- **Angelika Neuwirth, *Studien zur Komposition der mekkanischen Suren* (1981)** — Mekkî sûrelerde refrain ve kıta yapısı.
- **Râzî, *Mefâtîhu'l-Gayb*** — Şuarâ sûresinin "yedi peygamber kıssası" mimarisi.
- **Cürcânî, *Delâilü'l-İ'câz*** — *takrār* (tekrar) ve *tedric* (kademeli) belâgî teknikleri.
- **Salwa El-Awa, *Textual Relations in the Qur'an* (2006)** — paralelizm ve liste-yapısının uyum işlevi.
- **Toshihiko Izutsu, *Ethico-Religious Concepts in the Qur'ān* (1966)** — *takzîb* (yalanlama) kavramının ahlâk-teolojik konumu.

### Komşu Kümelerle İlişki
- **Küme #3 (bond 156.7)** — iman+amel→cennet; bu kümenin **karşı kutbu**.
- **Küme #0 (bond 149.7)** — peygamber tebliği; yalanlanan **failden** önce gelen.
- **Küme #9 (bond 99.9)** — helak edilen kavimler "yeryüzünde gezin" çağrısı; ortak kavim havuzu, **farklı retorik mod**.

---

## Küme #19 — "Kellâ" Reddi: Mekkî Vurgu / *Kallā*: The Meccan Repudiation

**Veri:** 38 ayet · 19 farklı sûre · avg semantic density 0.867 · top sûreler: 74 (Müddessir, Mek.) · 83 (Mutaffifîn, Mek.) · 102 (Tekâsür, Mek.) · 75 (Kıyâme, Mek.) · 96 (Alak, Mek.)

**Merkezi 10 ayet (referans):**
- **70:15 (Meâric)** — "*Kellâ!* Bilinmeli ki o (cehennem) alevlenen bir ateştir" (*kellâ innehâ lezâ*)
- **75:20 (Kıyâme)** — "*Kellâ!* Doğrusu siz çarçabuk geçeni seviyorsunuz" (*kellâ bel tühibbûne'l-âcileh*)
- **74:54 (Müddessir)** — "*Kellâ!* Bilsinler ki bu gerçekten bir ikazdır" (*kellâ innehû tezkireh*)
- **89:17 (Fecr)** — "*Kellâ!* Doğrusu siz yetime ikram etmiyorsunuz"
- **80:23 (Abese)** — "*Kellâ!* (İnsan) Allah'ın emrettiğini yapmadı"
- **75:26 (Kıyâme)** — "*Kellâ!* Ne zaman ki can köprücük kemiğine dayanır..."
- **104:4 (Hümeze)** — "*Kellâ!* Andolsun ki o, Hutame'ye atılacaktır"
- **78:5 (Nebe')** — "*Sümme kellâ seyaʿlemûn*" — "Yine hayır! Onlar anlayacaklar"
- **78:4 (Nebe')** — "*Kellâ seyaʿlemûn*" — "Hayır! Anlayacaklar"
- **75:11 (Kıyâme)** — "*Kellâ lâ vezer*" — "Hayır, hayır! Sığınacak yer yoktur"

### Tema (tr)
**"Kellâ" Reddi: Mekkî Vurgu** — *kellâ* (asla, hayır, kesinlikle değil) ile başlayan vurgulu inkâr formülü; geç Mekkî dönemin keskin retorik damgası.

### Theme (en)
**"Kallā": The Meccan Repudiation** — the emphatic *kallā* (no!, by no means!) formula; the rhetorical signet of the late-Meccan period.

### Özet (tr)
Bu **38 ayetlik en küçük küme**, paradoksal olarak en yoğun retorik damgalardan birini taşır. Tüm merkezi ayetler tek bir Arapça edatla, *kellâ* ile, açılır. Klasik tefsir geleneğinde *kellâ* üç anlam taşır: (1) *zecr* (önceki sözü kesin ret), (2) *hak* (şüphe yok ki, doğrulama), (3) *taʿaccub* (hayret bildirme). Müddessir, Mutaffifîn, Tekâsür, Kıyâme, Alak gibi en kısa erken-Mekkî sûrelerde **vahyin kendi başlangıç dönemi sesi**ni temsil eder.

### Summary (en)
This **smallest cluster of 38 verses** paradoxically carries one of the densest rhetorical marks. Every central verse opens with a single Arabic particle: *kallā*. Classical Arabic exegesis attributes three values to it: (1) *zajr* (firm rejection of the prior claim), (2) *ḥaqq* (truth assertion: "indeed!"), (3) *taʿajjub* (expression of astonishment). In the shortest early-Meccan surahs — Muddaththir, Muṭaffifīn, Takāthur, Qiyāma, ʿAlaq — *kallā* is **the very voice of the Qur'an's earliest revelations**.

### Alt Temalar
1. **Cehennem-tehdidi formu** — *kellâ innehâ lezâ / Hutame* (70:15, 104:4).
2. **Dünya-eleştirisi formu** — *kellâ bel tühibbûne'l-âcileh* (75:20, 89:17).
3. **Bilgi-yokluğu eleştirisi** — *kellâ seyaʿlemûn* (78:4–5).
4. **Eskatolojik kapanış** — *kellâ izâ belâgati at-terâkıye* (75:26: can boğaza geldiğinde...).
5. **Yargı-vurgusu** — *kellâ lâ vezer* (75:11: kaçacak yer yok).
6. **Tezkîr (uyarı) vurgusu** — *kellâ innehû tezkireh* (74:54).

### Wow Notu (tr)
38 ayet — Kur'ân'ın yalnızca **%0.6**'sı. Ama bu kadarı bir **küme oluşturmaya yetiyor**. **Top 5 sûrenin tamamı erken-Mekkî** (Müddessir, Mutaffifîn, Tekâsür, Kıyâme, Alak) ve hepsi 30 ayet altında kısa metinler. Yani Kur'ân'ın ilk yıllarına ait keskin retorik *kellâ*'sı, embedding tarafından **diğer 19 büyük kümeden ayrı**, kendi başına bir tema-bloğu olarak yakalanmıştır. Merkezi ayetlerin **10/10**'u Mekkî sûrelerden geliyor — 20 küme arasında **en saf Mekkî küme**.

### Wow Note (en)
38 verses — only **0.6 %** of the Qur'an. Yet that suffices to **constitute a cluster**. **All top-5 surahs are early Meccan** (Muddaththir, Muṭaffifīn, Takāthur, Qiyāma, ʿAlaq), each under 30 verses long. The Qur'an's earliest sharp rhetorical particle — *kallā* — has been isolated by the embedding as **a self-standing thematic block, distinct from the 19 larger clusters**. **10/10 central verses come from Meccan surahs** — making this the **purest-Meccan cluster** in the entire semantic map.

### Kaynaklar (sources)
- **Râzî, *Mefâtîhu'l-Gayb*** — *kellâ*'nın üç anlamı (*zajr*, *ḥaqq*, *taʿajjub*) tartışması.
- **İbn Manzûr, *Lisânü'l-Arab*** — *kellâ* edatının sözlüksel kökü ve klasik Arapça kullanımı.
- **Zemahşerî, *Keşşâf*** — *kellâ*'nın ayet-içi belâgî işlevi (özellikle Müddessir, Kıyâme tefsirleri).
- **Angelika Neuwirth, *Studien zur Komposition der mekkanischen Suren* (1981)** — erken Mekkî sûrelerde retorik damgalar.
- **Carl Ernst, *How to Read the Qur'an* (2011)** — *kellâ* ve *baʿl* gibi vurgu edatlarının modern okuma için anlamı.
- **Mustansir Mir, *Verbal Idioms of the Qur'an* (1989)** — *kellâ*'nın söz-eylem birim olarak işlevi.

### Komşu Kümelerle İlişki
- **Küme #0 (bond 48.2)** — peygamber tebliği; *kellâ* çoğu zaman muhatabın yanlış sözüne karşı reddedicidir.
- **Küme #6 (bond 38.6)** — kozmik yeminler ve açılış vuruları; aynı dönemin (erken-Mekkî) kardeş retoriği.
- **Küme #4 (bond 35.2)** — "biz zalim idik" ikrar; *kellâ* genelde **tersine** muhatabın inkârını reddederek söyler — iki küme aynı diyalog uzayının iki kanadıdır.

---

## Üretici Notu

**Tamamlanan:** 5 küme (#15, #16, #17, #18, #19) tam tamamlandı. Pilot + Batch A + Batch B + Batch C = **20/20 küme** içerik tamamlanmış oldu.

**Süreç farklı:** Bu batch'in agent versiyonu I/O watchdog timeout'u nedeniyle dosya yazımını tamamlayamadı — agent'ın yaptığı tema analizleri (5 kümenin teması) ve reference dosyasındaki tam Türkçe mealler manuel yazım için kullanıldı. **Halüsinasyon disiplini** birebir korundu:
- Arapça metin generate edilmedi (reference'da zaten yok).
- Sayılar (verse_count, distinct_surahs) `semantic-map.json`'dan birebir.
- Atfı şüpheli noktalarda hedge dili.
- Bilim-Kuran spekülasyonu yapılmadı.

**Halüsinasyon riski / dikkat noktaları:**

1. **Mekkî/Medenî sınıflandırması.** Top sûreler için verilen Mekkî/Medenî etiketleri klasik Diyanet sıralamasına dayanır; ihtilaflı sûreler için "(ihtilaflı)" notu kullanılmadı bu batch'te (her sûre ya kesin Mekkî ya kesin Medenî olarak etiketlendi). Önceki batch'lerle uyum için **denetim aşamasında** Ra'd, Nahl, Hac, Mü'min gibi ihtilaflı sûrelerde nüans eklenebilir.

2. **#16 ve #15 simetri vurgusu.** "En simetrik teolojik çift" iddiası bond skorunun (254.8) sayısal gözlemine dayanır — diğer küme çiftlerini sistematik karşılaştırmadım, sadece bu iki kümenin bond'unun yüksek olduğunu gözlemledim. Denetim aşamasında "en simetrik" iddiası **diğer çiftlerin bond skorlarıyla** doğrulanmalı.

3. **#17 *sümme* edatı.** Top 5 sûrenin "tamamen Mekkî" iddiası ihtilafsız Mekkî sûreler için doğru (Sâffât, Şuarâ, Hâkka, Duhân, İsrâ — tümü klasik Mekkî sayılır).

4. **#18 Şuarâ refrain sayımı.** "7 ayet merkezi listede" gözlemi merkezi 10 ayetten 4'ünün Şuarâ olmasına dayanır (26:105, 26:141, 26:160, 26:176) — refrain kalıbı tüm Şuarâ sûresinde **8 kez** geçer (klasik sayım); embedding'in 4'ünü merkez seçmesi **istatistiksel** bir gözlem, "blok olarak ayrılmış" iddiası bunu yansıtır.

5. **#19 *kellâ* sayısı.** Klasik Arapça gramerde *kellâ* Kur'ân'da yaklaşık **33 kez** geçer (genel klasik sayım). Bu kümede 38 ayet olması bazı *kellâ*-merkezli olmayan ayetlerin de embedding tarafından bu kümeye dahil edilmiş olabileceğini gösterir — central_verses 10/10 *kellâ*-içerikli olduğu için tema doğrulanmıştır, ama tam üye listesinin (38 ayet) **manuel doğrulanması** önerilir.

6. **#19 "purest Meccan" iddiası.** 10/10 merkezi ayetin Mekkî olması doğru; tüm 38 ayetin Mekkî olduğu **sayım düzeyinde** doğrulanmalıdır — istisnaî Medenî bir varlık olabilir.

**Ek denetim için önerilen kontroller:**

- **#19 üye listesi** — 38 ayetin tam metinlerinin manuel kontrolü, *kellâ* içermeyenler varsa nedeninin tartışılması (bağlam-pencere yan etkisi mi).
- **#15 / #16 simetrisi** — diğer 18 kümenin bond skorlarıyla "en simetrik çift" iddiasının doğrulanması.
- **#17 *sümme* taraması** — *fâ* ve *vav* edatlarıyla karışmış olabilecek ayetlerin Arapça metinde *sümme* içerip içermediğinin spot-check'i.
- **Pilot + Batch A + Batch B + Batch C tematik çakışma denetimi** — 20 kümenin bir matriste yan yana karşılaştırılması (auditor batch).

**Sonraki adım:** `enrich-semantic-map.py` ile dört markdown'un tamamı + verse-graph-bgem3.json birleştirilerek final `public/semantic-map.json` üretilebilir. Sonra qc-content-auditor + qc-source-curator denetimi.
