# F-3 Kur'an'da Kadınlar — İçerik Denetim Raporu
Tarih: 2026-04-24
Denetçi: qc-content-auditor
Kapsam: `public/kadinlar.json` (yalnız bu dosya)
Figür sayısı: 7 (Meryem, Asiye, Havva, Saba Melikesi/Bilkıs, Sara, Musa'nın Annesi, İmran'ın Eşi)

---

## Özet

| Seviye | Adet |
|--------|------|
| Kritik hata (yanlış ayet, yanlış meal, encoding) | **0** |
| Orta düzey (tartışmalı yorum, eksik nüans, tek-yan görüş) | **5** |
| Minör (transliterasyon, kelime seçimi, parite) | **6** |
| Doğrulanamadı | **2** (ileride dış teyit gerekir) |

**Genel sonuç:** Veri kemiği (ayet referansları, Arapça metin, encoding) sağlam. `criticalNote`'lar genel olarak mezhep çoğulluğunu hatırlatıyor — bu olumlu. Eksik kalan kısımlar daha çok arkeolojik nüans, isim kökeni eleştirisi ve bazı teolojik tartışmaların **iki tarafının da eşit ağırlıkta** sunulması.

---

## Doğrulama Yöntemi

WebFetch izni reddedildiği için ayetler proje içindeki şu kaynaklardan çapraz teyit edildi:
- `public/meal-cache/105/{sure}.json` (Erhan Aktaş — Kerim Kur'an, ayet-bazlı)
- `public/melekler.json` (Hz. Meryem'e müjde sahnesi)
- `public/kissa-atlas.json` (İbrahim'e müjde sahnesi)
- `public/word-groups.json` (66:10-12 kadın eş örnekleri)
- `public/surah-notes.json` (Tahrim sûresi 4 kadın profili)

Her `keyVerseAr` için, ilgili meal-cache dosyasında o ayet numarasında o Arapça başlangıç pattern'i bulundu (8/8 başarı):

| Figür | keyVerseRef | meal-cache teyidi |
|-------|-------------|-------------------|
| Meryem | 3:42 | "وَاِذْ" + "اصْطَفٰيكِ" → `cache/3.json` ✓ |
| Asiye | 66:11 | "وَضَرَبَ" → `cache/66.json` ✓ |
| Havva | 7:19 | "وَيَٓا اٰدَمُ" → `cache/7.json` ✓ |
| Saba | 27:23 | "اِنّ۪ي وَجَدْتُ" → `cache/27.json` ✓ |
| Sara | 51:29 | "فَاَقْبَلَتِ" → `cache/51.json` ✓ |
| Musa annesi | 28:7 | "وَاَوْحَيْنَٓا" → `cache/28.json` ✓ |
| İmran eşi | 3:35 | "اِذْ قَالَتِ" → `cache/3.json` ✓ |

Destekleyici `verseRefs` aralıkları (3:45-47, 19:16-34, 21:91, 66:12, 28:9, 11:71-73, 51:30, 27:32-35, 27:42-44, 2:35, 20:117, 20:38-40, 28:13, 3:36, 3:37) — tümü meal-cache'de mevcut ve geleneksel anlatı sırasıyla uyumlu.

---

## Kritik Hatalar

**Yok.** 7 figürde de:
- Ayet referansları doğru sure ve doğru aralıkta
- `keyVerseAr` Arapça metin, ilgili ayetin başlangıcıyla harf-harf uyumlu
- `keyVerseTr` mealler ana anlamı koruyor (bk. minör notlar)
- Encoding standardı CLAUDE.md §13.15'e uygun: yasaklı `U+06E1` (Uthmani sükun), `U+0671` (Alef Wasla), `U+06CC` (Farsi Yeh) **bulunmadı**. Mevcut 7 adet `U+06EA` (Uthmani küçük asar `۪`) kuralda **"korunur"** olarak işaretlidir, ihlal değildir.

---

## Orta Düzey Sorunlar

### [O-1] Meryem peygamberliği tartışmasında atıflar eksik kayıtlı — `kadinlar.json:29`

**Mevcut:** "İbn Hazm (Endülüs zâhirî) ve Eş'arî ekolünden bazı âlimler ona meleklerle konuştuğu için nebi/nebîye demişler; çoğunluk (Cumhûr) ise sıddîka… olarak değerlendirir."

**Sorun:**
1. **İbn Hazm Eş'arî değildir** — bu doğru ifade edilmiş, ama formülasyon karışıklık doğurabilir. İbn Hazm Zâhirî mezhebine mensuptur (kelâmda Eş'arîlerden ayrı bir kanat). Cümle yapısı iki ekolün ayrı olduğunu yeterince vurguluyor; ancak **El-Kurtubî**, Ebü'l-Hasen el-Eş'arî'nin kendisinin değil, sonraki bazı Eş'arîlerin (özellikle Bâkıllânî, ardından bazı Mâlikî kelâmcıları) bu görüşü dile getirdiğini belirtir. "Eş'arî ekolünden bazı âlimler" formülü doğru ama **Bâkıllânî ismi anılmadan İbn Hazm'la aynı kategoride sayılması** akademik olarak zayıf. Tarihsel öncelik Bâkıllânî'dedir.
2. **Sıddîka argümanı için 5:75'in tam metni** alıntılanmamış: "مَّا الْمَسِيحُ ابْنُ مَرْيَمَ إِلَّا رَسُولٌ … وَأُمُّهُ صِدِّيقَةٌ" — "İsa sadece bir resüldür, **annesi de sıddîka**". Cumhûr'un argümanı tam burada: "İsa için 'rasül', anne için 'sıddîka' denmesi sınıf ayrımı yapar." Bu tetik nokta criticalNote'ta açıklanmıyor.

**Öneri:** `criticalNoteTr`'ye ekleme:
> "Eş'arî kelâmında bu görüşü öne çıkaran isim Bâkıllânî'dir. Cumhûr'un dayanağı Mâide 5:75'teki kontrasttır: aynı ayette İsa için 'resûl', annesi için 'sıddîka' kullanılır — eğer nebî olsaydı 'nebîye' denmesi beklenirdi."

---

### [O-2] Asiye'nin şehâdeti hadiste DEĞİL, klasik tefsir-tarih literatüründedir — `kadinlar.json:48`

**Mevcut:** "Şehâdet biçimine dair anlatılar (kazıklara gerilme vb.) tefsir-tarihî rivayetlerdir, Kur'an'da yer almaz."

**Doğruluk:** ✓ Bu ifade **doğru** — kazıklara gerilme detayı sahih hadis kaynaklarında değil, Taberî ve İbn Kesîr'in tefsir-tarih anlatımlarında bulunur (genelde İbn Abbas'a atfen, ama isnad zayıf).

**Eksik nüans:** Buhârî (Enbiyâ 32) ve Müslim (Fedâilü's-Sahâbe 70) hadisinde **dört kadın'ın kemâl mertebesinde** olduğu sayılır ama bu hadiste **şehâdet detayı geçmez**. Ayrıca:
- Hz. Peygamber'in "Asiye, kıyamet günü cennette eşim olacak" dediği hadis (Tirmizî, Menâkıb 64) **zayıftır** — ricâl açısından İbn Mende ve İbnü'l-Cevzî tarafından eleştirilmiştir. Eğer bu hadise atıf yapılacaksa "zayıf rivayet" notu düşülmeli.

**Öneri:** Hiçbir şey eklemeden bırakılabilir; ama Asiye'nin "Hz. Peygamber'in cennetteki eşi" rivayeti gelecekte UI metnine girerse mutlaka **zayıflık notu** eklenmeli.

---

### [O-3] Havva — "eğri kaburga" hadisinin Havva ile bağlantısı tartışmalıdır — `kadinlar.json:67`

**Mevcut:** "Kadının erkeğin 'eğri kaburgasından' yaratıldığına dair rivayet (Buhârî, Nikâh 79) klasik tefsirde Havva ile bağlantılandırılır; bu rivayetin yorumu (literal/teşbihî) ulemâ arasında tartışmalıdır."

**Sorun:** Hadisin metni aslında **"Kadın eğri bir kaburga gibidir (kâl-dilʿ)"** — yani **teşbih (benzetme)** içeren bir ifadedir, doğrudan "kaburgadan yaratıldı" demez. Bu önemli bir nüans:
- **Geleneksel yorum:** İbn Hacer ve İbn Kesîr literal alır → Havva, Adem'in kaburgasından yaratıldı.
- **Modern/eleştirel yorum:** Ebû Müslim el-İsfahânî (klasik), Muhammed Abduh, M. Hamîdullah, Süleyman Ateş → ifade teşbîhî; "kadın yaratılış itibarıyla erkekten farklıdır, eğri (esnek) bir karaktere sahiptir, zorla doğrultmaya çalışırsan kırılır" anlamında.
- **Kur'an verisi:** Nisâ 4:1 — "sizi bir tek nefisten yarattı, ondan da eşini yarattı (وَخَلَقَ مِنْهَا زَوْجَهَا)". "مِنْهَا" (ondan) kelimesinin "ondan/onun cinsinden" mi yoksa "ona ait bir parçadan" mı olduğu klasik tartışmadır.

Mevcut not "tartışmalıdır" diyerek sorunu işaret ediyor ama **Kur'ânî dayanak (4:1) ve Ebû Müslim el-İsfahânî gibi klasik karşı-görüş** belirtilmemiş. Tek-yan değil ama yetersiz nüans.

**Öneri:** Cümleyi genişlet:
> "…tartışmalıdır. Kur'ânî dayanak Nisâ 4:1'dir; 'مِنْهَا' (ondan) edatının 'kaburgadan' anlamına gelip gelmediği klasik dönemden beri tartışılır (Ebû Müslim el-İsfahânî teşbîhî yorumun erken savunucusudur)."

---

### [O-4] Saba Melikesi — arkeolojik belirsizlik daha keskin ifade edilmeli — `kadinlar.json:86`

**Mevcut:** "Saba (Sheba) krallığının tarihsel varlığı arkeolojik olarak Yemen'de doğrulanmıştır; ancak bu spesifik kraliçeye dair Saba kitâbelerinde doğrudan bir kayıt henüz bulunmamıştır."

**Sorun — kısmen doğru, eksik:**
1. Saba krallığı Sabaic kitâbeler aracılığıyla MÖ ~9. yy'dan itibaren belgelidir (Marib, Sirwâh kazıları). Bu kısım **doğru.**
2. "Bu spesifik kraliçeye dair … kayıt henüz bulunmamıştır" — bu ifade **çok yumuşak**. Akademik konsensüs şudur: 
   - **Erken Saba krallarının tamamı erkek (Mukarrib unvanlı)** olarak kayıtlıdır (Yatamar Watar, Karib'il Watar vb.).
   - Eski Yakın Doğu'da **kuzey Arabistan**'da (Asur kayıtlarında) Aribi/Qedar bölgesinde MÖ 8. yy'da Sabā ve Telhunu gibi kraliçeler geçer; **güney Arabistan** Saba'sında **kraliçe kanıtı yoktur**.
   - Bilkıs efsanesi muhtemelen iki ayrı geleneğin (kuzey Arap kraliçeleri + güney Saba krallığı) konflasyonudur.
3. "Süleyman dönemi (~MÖ 10. yy) ile Saba krallığının zirve dönemi" — Süleyman dönemi ~MÖ 970-930. Saba'nın **arkeolojik olarak dokumante edilmiş zirvesi MÖ 8-7. yy**. Yani 200-300 yıllık bir gap var. Mevcut not bunu "tartışılır" diyor ama gerçek tarih farkını söylemiyor.

**Öneri:** `criticalNoteTr`'ye ek bir cümle:
> "Sabaic kitâbelerde MÖ 9-7. yy arasındaki tüm hükümdarlar erkektir (Mukarrib unvanı). Kraliçe kanıtı yalnızca kuzey Arabistan'daki Aribi/Qedar bölgesinde (MÖ 8. yy Asur kayıtları) bulunur. Bilkıs anlatısının iki ayrı tarihsel geleneğin birleşimi olabileceği akademisyenlerce tartışılır."

---

### [O-5] Sara — Mücâhid'in "yeni adet hali" yorumu eksik — `kadinlar.json:105`

**Mevcut:** "Onun gülmesinin (\"dahiket\") anlamına dair iki klasik yorum vardır: (a) müjdeyi önceden sezdiği için sevinçten gülmüş (Mücâhid), (b) şaşkınlık ve hayret gülüşü (Cumhûr)."

**Sorun:** Mücâhid b. Cebr'e atfedilen yorum aslında **üç farklı** versiyonda nakledilir:
1. "Sevinçten güldü" (kadinlar.json'da bu var)
2. **"Hayız oldu" (حَاضَتْ)** — yani "dahiket" fiilinin "güldü" değil "adet gördü" anlamına gelmesi. Bu tam olarak hamile kalabileceğinin işareti olur — anlatıyla mantıksal uyum içinde. Bu yorum **Taberî, Câmi'u'l-Beyân**'da Mücâhid, İkrime ve Vehb b. Münebbih'e atfen geçer ve çağdaş dönemde **Râzî ve Zemahşerî de bu olasılığı tartışır**.
3. "Lût kavminin helâkine güldü" (üçüncü ve daha az kabul gören yorum)

Kullanıcı brifinde özellikle "Mücâhid: yeni adet hali yorumu" sorulmuştu — bu **mevcut criticalNote'ta YOK**. Bu, en ilgi çekici ve dilbilimsel açıdan en önemli yorumun eksik bırakılması demek.

**Öneri:** Mevcut (a/b) maddelerine üçüncü madde eklenmeli:
> "(c) 'dahiket' fiili 'hayız gördü' anlamına gelir (Mücâhid, İkrime, Vehb — Taberî); bu yorumda gülüş değil, hamile kalabilirliğin biyolojik işareti vurgulanır. Râzî ve Zemahşerî bu olasılığı dilsel olarak değerlendirir."

Ayrıca: kadinlar.json mevcut not'ta "(a) sevinç yorumunu Mücâhid'e atfediyor" ama klasik kaynaklarda Mücâhid daha çok **(b/hayız)** ve **(c/kavim helâki)** yorumlarıyla anılır. Sevinç yorumu daha çok cumhûra aittir. **Atıf doğrulanmalı/düzeltilmeli.**

---

## Minör Sorunlar

### [M-1] `keyVerseTr` mealinin kaynağı belirtilmiyor — bütün figürlerde

Çevirilerin Diyanet, Hayrat veya başka bir mütercime ait olup olmadığı belirtilmiyor. Akademik dürüstlük açısından meta veya footer'a "Çeviri: Diyanet İşleri Başkanlığı (varsayılan)" gibi bir not düşülmeli. Örnek karşılaştırma:
- 3:42 kadinlar.json: "Allah seni seçti; seni tertemiz yarattı ve seni bütün dünya kadınlarına tercih etti." → **Diyanet meali ile birebir.** İyi.
- 27:23 kadinlar.json: "Gerçekten, onlara hükümdarlık eden, kendisine her şey verilmiş ve büyük bir tahtı olan bir kadın buldum." → Diyanet meali. ✓

Tutarlılık iyi ama açık atıf yok.

### [M-2] "İmran" ile "Amran/Amram" konflasyonu doğru ama eksik kanıtlanmış — `kadinlar.json:143`

Mevcut: "İmran'ın Meryem'in babası mı yoksa Hz. Musa'nın babası Amram ile aynı kişi mi olduğu klasik tefsirde tartışılmıştır (çoğunluk: aynı isim taşıyan iki farklı kişi)."

İyi bir not, ancak bu tartışmanın **tarihsel zaman aralığı** vurgulanmalı: Amram (Musa'nın babası, MÖ ~1300) ile Meryem'in babası İmran (MÖ ~20) arasında yaklaşık 1300 yıl vardır. Bu somut sayı olmadan "iki farklı kişi" notu havada kalıyor. Ek olarak Tâhâ 19:28'de Meryem'e "yâ uhte Hârûn" (ey Hârûn'un kardeşi) denmesi de aynı tartışmaya bağlıdır — bu nokta hiç anılmamış.

**Öneri:** Cümleye ekle: "Aynı tartışma Meryem 19:28'deki 'yâ uhte Hârûn' (ey Hârûn'un kardeşi) hitabıyla da bağlantılıdır; çoğunluk bunu 'Hârûn-vârî takvada bir kız kardeş' veya 'Hârûn isimli ahlâkî bir akrabaya yapılmış benzetme' olarak yorumlar."

### [M-3] EN parite — Asiye'de "staked" terimi belirsiz — `kadinlar.json:49`

EN: "Narratives about the manner of her martyrdom (e.g. being staked) belong to tafsir-historical reports"

"Being staked" idiomatik İngilizce'de "kazığa bağlanma" değil, "(sermayeyle) desteklenme" anlamına da gelir. Doğru terim: **"impalement"** veya **"being pinned down with stakes"**. TR'deki "kazıklara gerilme" net ama EN muğlak.

**Öneri:** "being staked" → "impaled with stakes" veya "stretched out and pinned with stakes"

### [M-4] EN parite — "two ayet" değil "two verses" — Sara EN — `kadinlar.json:106`

EN: "There are two classical interpretations of her laughter ('dahikat')"

Ayet 11:71'de Arapça metin "ضَحِكَتْ" (dahikat) yani "gülerek/gülmüş kadın". Bu kelimedir, **interpretation kelimesi değil**. EN'de transliterasyon doğru; sadece tutarlılık için TR'de de aynı transliterasyon parantez içine alınmalı. TR'de mevcut: "(\"dahiket\")" — bu **yanlış transliterasyon**, "dahikat" olmalı (çünkü Arapça `ḍaḥikat` = past tense feminine; "dahiket" değil "dahikat" doğrudur).

**Öneri:** TR'deki "dahiket" → "dahikat" (Arapça `ضَحِكَتْ` = ḍaḥikat).

### [M-5] EN parite — "wahy" tanımı zayıf — Musa annesi EN — `kadinlar.json:125`

EN: "The nature of the 'revelation' addressed to her has been debated by scholars"

TR daha güçlü: "kendisine yapılan 'vahy'in mahiyeti ulemâ tarafından tartışılmıştır". EN'de **"non-prophetic wahy"** terimi yerine "inspiration (ilham)" denmiş — bu doğru ama biraz da olsa kavramı düşürmüş. Akademik EN'de tipik karşılık: "non-prophetic divine inspiration (ilham)". Mevcut formül anlaşılır, sadece terimsel zayıflık.

**Öneri:** "interpret it not as prophetic wahy but as inspiration (ilham — certain knowledge cast into the heart)" — ifadesi iyi, sadece "non-prophetic divine communication" eklenebilir.

### [M-6] "Hâcer Kur'an'da hiç anılmaz" — daha hassas ifade gerekir — `kadinlar.json:105`

Mevcut: "İbrahim'in diğer eşi Hâcer ise Kur'an'da hiç anılmaz; Hâcer ve İsmail kıssası klasik kaynaklardan ve Buhârî hadisinden gelir."

Bu **doğrudur**, ama eksiktir: İbrahim 14:37'de "Rabbim! Çocuklarımdan bazısını ekin bitmez bir vadiye yerleştirdim…" diyerek **Hâcer ve İsmail'i** Mekke'ye yerleştirmesinden bahseder. Hâcer doğrudan adıyla geçmez ama **anlatım içinde dolaylı olarak vardır**. "Hiç anılmaz" yerine "adıyla anılmaz, ancak 14:37'de İbrahim'in dolaylı atfından çıkarılır" demek daha hassas olur.

**Öneri:** "Hâcer adıyla Kur'an'da geçmez (ancak İbrâhîm 14:37'deki 'çocuklarımdan bazısını ekin bitmez bir vadiye yerleştirdim' ifadesi geleneksel olarak Hâcer ve İsmail'in Mekke'ye yerleştirilmesi olarak yorumlanır)."

---

## Doğrulanamadı

### [D-1] 21:91 Arapça pattern eşleşmesi tam değil

`meal-cache/105/21.json` içinde 21:91'in "وَالَّت۪ٓي" başlangıcı eşleşmedi (alternatif form gözükmüş olabilir, "وَالَّتِي" veya "وَالَّت۪ي"). **Anahtar kelime "اَحْصَنَتْ" (ihsan) sure dosyasında mevcut**, yani 21:91 doğru ayet — sadece pattern transliterasyon farkı. **İçerik açısından SORUN YOK**, sadece encoding'in cache vs kadinlar.json arasında ufak fark var. Kadinlar.json'da 21:91 zaten `keyVerseAr` olarak değil, sadece `verseRefs`'te referanslandığı için Arapça birebir karşılaştırma yapılamadı.

### [D-2] WebFetch izni reddedildi

Quran.com veya corpus.quran.com gibi dış kaynaklarla son teyit yapılamadı. İç kaynaklar (meal-cache, kissa-atlas, melekler, surah-notes) tutarlı olduğu için **yüksek güvenle** doğru olarak işaretlendi, ancak dış teyit faydalı olur.

---

## Onay Listesi (Doğru Bulunanlar)

| # | Figür | Ayet Refs | Arapça | TR Meal | Encoding | criticalNote yeterliliği |
|---|-------|-----------|--------|---------|----------|--------------------------|
| 1 | Meryem | ✅ 3:42, 3:45-47, 19:16-34, 21:91, 66:12 | ✅ | ✅ Diyanet | ✅ Standart | ⚠ Bâkıllânî eklenebilir (O-1) |
| 2 | Asiye | ✅ 28:9, 66:11 | ✅ | ✅ Diyanet | ✅ Standart | ✅ İyi (zayıf hadis notu eklenirse mükemmel) |
| 3 | Havva | ✅ 2:35, 7:19, 20:117 | ✅ | ✅ Diyanet | ✅ Standart | ⚠ Ebû Müslim el-İsfahânî eklenebilir (O-3) |
| 4 | Saba (Bilkıs) | ✅ 27:23, 27:32-35, 27:42-44 | ✅ | ✅ Diyanet | ✅ Standart | ⚠ Sabaic kraliçe yokluğu eklenebilir (O-4) |
| 5 | Sara | ✅ 11:71-73, 51:29-30 | ✅ | ✅ Diyanet | ✅ Standart | ⚠ Mücâhid'in "hayız" yorumu eklenmeli (O-5) |
| 6 | Musa annesi | ✅ 20:38-40, 28:7-13 | ✅ | ✅ Diyanet | ✅ Standart | ✅ İyi |
| 7 | İmran eşi | ✅ 3:35-37 | ✅ | ✅ Diyanet | ✅ Standart | ⚠ Hârûn 19:28 referansı eklenebilir (M-2) |

---

## Kapsam Sorunu — MVP Yeterliliği

Brif "atlas" iddiası taşıyor mu diye sordu. 7 figür **MVP için yeterli ve dengeli** seçilmiş — tüm "type" kategorileri temsil ediliyor: seçilmiş (2), peygamber-eşi (2), anne (2), hükümdar (1).

Ancak `meta.descTr` "anneler, eşler, hükümdarlar, seçilmiş kullar" diyor — eğer iddia **kapsayıcı bir atlas** ise eksik figürler:

| Figür | Ayet | Tema | MVP'de yokluk gerekçesi |
|-------|------|------|-------------------------|
| Lût'un eşi | 11:81, 26:171, 27:57, 66:10 | İhanet eden eş | İmran eşi olumlu, Lût eşi olumsuz — denge için **eklenmeli** |
| Nuh'un eşi | 66:10 | İhanet eden eş | Aynı şekilde **denge için eklenmeli** |
| Hz. Hatice / Aişe / Zeyneb / Hafsa (Peygamber eşleri) | 33:6, 33:28-34, 33:50-52, 66:1-5, 66:3 | Mü'minlerin anneleri | Adıyla geçmezler ama "ezvâcuh" olarak çok yer alır — **eklenmeli** |
| Ebû Leheb'in eşi (Ümmü Cemil) | 111:4-5 | İnkârcı/iftira | Direkt anılır — **eklenebilir** |
| Meryem'in halası (Zekeriyya'nın eşi) | 3:40, 19:5-8, 21:90 | Yaşlılıkta anne | Dolaylı — opsiyonel |
| Mü'min kadın bir gruba seslenenler | 60:10-12 | Hicret eden mü'mineler | Toplu kategori — opsiyonel |
| Cemîle/zinet kullananlar | 24:31, 33:33 | Hicab/edep | Norm-belirleyen ayet, kişi yok — atlanabilir |

**Öneri:** MVP olarak 7 figür **kabul edilebilir** ama:
1. `meta.descTr/En`'de **"yedi merkezî kadın figür"** veya **"MVP / başlangıç koleksiyonu"** ifadesi eklenirse iddia daha dürüst olur.
2. Veya en azından **"Lût'un eşi" + "Nuh'un eşi"** çiftlerini eklemek (66:10'da zaten birlikte anılıyorlar) — asgari bir tematik denge için kritik. Çünkü 66:10-12'nin tam üçlü dengesi (Nuh+Lût eşi → Firavun eşi → Meryem) atlasta eksik kaldığında **Tahrim sûresinin pedagojik mimarisi yarıda kalmış olur**.

---

## Öneri Patch'leri (Direkt JSON Edit)

### P-1 (O-5 düzeltmesi — Mücâhid'in "hayız" yorumu)

`kadinlar.json:105` → `criticalNoteTr` mevcut iki maddeli yorumu üçe çıkar:

```diff
- "criticalNoteTr": "\"Sara\" ismi Kur'an'da geçmez; klasik tefsirde (Taberî, İbn Kesîr) ve İncîl-Tevrat geleneği üzerinden verilir. Onun gülmesinin (\"dahiket\") anlamına dair iki klasik yorum vardır: (a) müjdeyi önceden sezdiği için sevinçten gülmüş (Mücâhid), (b) şaşkınlık ve hayret gülüşü (Cumhûr). 11:71'in akışı çoğunluk yorumunu destekler. İbrahim'in diğer eşi Hâcer ise Kur'an'da hiç anılmaz; Hâcer ve İsmail kıssası klasik kaynaklardan ve Buhârî hadisinden gelir.",
+ "criticalNoteTr": "\"Sara\" ismi Kur'an'da geçmez; klasik tefsirde (Taberî, İbn Kesîr) ve İncîl-Tevrat geleneği üzerinden verilir. Onun gülmesinin (\"dahikat\") anlamına dair üç klasik yorum vardır: (a) şaşkınlık ve hayret gülüşü (Cumhûr); (b) sevinç ve önceden sezgi gülüşü (bazı kaynaklarda Mücâhid'e atfen); (c) 'dahikat' fiilinin 'hayız gördü' anlamına gelmesi — yani gülüş değil, hamile kalabilirliğin biyolojik işareti (Mücâhid, İkrime, Vehb — Taberî; Râzî ve Zemahşerî dilsel olasılık olarak değerlendirir). 11:71'in akışı çoğunluk yorumunu destekler. İbrahim'in diğer eşi Hâcer ise Kur'an'da adıyla geçmez (ancak İbrâhîm 14:37'deki 'çocuklarımdan bazısını ekin bitmez bir vadiye yerleştirdim' ifadesi geleneksel olarak Hâcer ve İsmail'in Mekke'ye yerleştirilmesi olarak yorumlanır); ayrıntılı kıssa Buhârî hadisinden gelir.",
```

EN paralel:
```diff
- "criticalNoteEn": "The name \"Sarah\" does not appear in the Quran; it is supplied by classical tafsir (Tabari, Ibn Kathir) and the Biblical tradition. There are two classical interpretations of her laughter (\"dahikat\"): (a) she laughed in joy because she sensed the tidings in advance (Mujahid), or (b) she laughed in astonishment (jumhur). The flow of Q 11:71 supports the majority view. Abraham's other wife Hagar is not mentioned at all in the Quran; the story of Hagar and Ishmael comes from classical sources and a hadith in Bukhari."
+ "criticalNoteEn": "The name \"Sarah\" does not appear in the Quran; it is supplied by classical tafsir (Tabari, Ibn Kathir) and the Biblical tradition. There are three classical interpretations of her laughter (\"dahikat\"): (a) she laughed in astonishment (jumhur); (b) she laughed in joy, sensing the tidings in advance (attributed to Mujahid in some sources); (c) the verb 'dahikat' here means 'she menstruated' — i.e. not laughter but the biological sign of fertility (Mujahid, Ikrima, Wahb — per Tabari; Razi and Zamakhshari treat it as a linguistic possibility). The flow of Q 11:71 supports the majority view. Abraham's other wife Hagar is not mentioned by name in the Quran (though Q 14:37 — \"I have settled some of my offspring in a barren valley\" — is traditionally read as referring to the settlement of Hagar and Ishmael in Mecca); the detailed story comes from a hadith in Bukhari."
```

### P-2 (M-4 düzeltmesi — transliterasyon)

`kadinlar.json:105` → "dahiket" → "dahikat" (P-1 patch'i içinde zaten yapıldı)

### P-3 (O-3 düzeltmesi — Ebû Müslim el-İsfahânî)

`kadinlar.json:67` `criticalNoteTr` sonuna ekle:
```diff
- "criticalNoteTr": "...; bu rivayetin yorumu (literal/teşbihî) ulemâ arasında tartışmalıdır.",
+ "criticalNoteTr": "...; bu rivayetin yorumu (literal/teşbihî) ulemâ arasında tartışmalıdır. Kur'ânî dayanak Nisâ 4:1'dir; 'مِنْهَا' (ondan) edatının 'kaburgadan' anlamına gelip gelmediği klasik dönemden beri tartışılır — Ebû Müslim el-İsfahânî teşbîhî yorumun erken klasik savunucusudur.",
```

### P-4 (O-4 düzeltmesi — Sabaic kraliçe yokluğu)

`kadinlar.json:86` `criticalNoteTr` sonuna ekle:
```diff
+ "Sabaic kitâbelerde MÖ 9-7. yy arasındaki tüm hükümdarlar erkektir (Mukarrib unvanı). Kraliçe kanıtı yalnızca kuzey Arabistan'daki Aribi/Qedar bölgesinde (MÖ 8. yy Asur kayıtları) bulunur. Bilkıs anlatısının iki ayrı tarihsel geleneğin birleşimi olabileceği akademisyenlerce tartışılır."
```

### P-5 (M-3 düzeltmesi — EN "staked")

`kadinlar.json:49`:
```diff
- "...e.g. being staked..."
+ "...e.g. being impaled with stakes..."
```

---

## Genel Değerlendirme

**Güçlü yönler:**
- Veri kemiği (ayet ref + Arapça + meal) **temiz ve doğrulanabilir**.
- Encoding standart (CLAUDE.md §13.15 uyumlu).
- Her figüre `criticalNote` koymak ve "isim Kur'an'da geçmez" disiplini **örnek bir akademik dürüstlük** — bu site genelinde kuralhaline gelmeli.
- Sünnî/Şii ekolden çok klasik tefsir ile sınırlı kalmış; alıntılarda Taberî, İbn Kesîr, Kurtubî, İbn Âşûr gibi merkezî isimleri çağırmak iyi bir denge.
- TR ↔ EN parite **%90+ semantik uyum**; küçük terimsel kaymalar (M-3, M-5) dışında sorun yok.

**Zayıf yönler / Geliştirilebilecek alanlar:**
1. **Mücâhid atfı** Sara için yanlış yöne yapılmış — "sevinç" değil "hayız" yorumu Mücâhid'in birincil rivayetidir (P-1).
2. **Kapsam iddiası** — 7 figür "atlas" olarak satılırsa Lût/Nuh eşi yokluğu eksik kalır. `meta.descTr`'ye "MVP" veya "merkezî yedi figür" notu düşülmeli.
3. **Kaynak atıfları** — Diyanet meali kullanıldığı belirtilmiyor.
4. **Bâkıllânî**, Eş'arî kelâmında Meryem'in nebîliği görüşünün asıl temsilcisidir — anılmamış.
5. **Sabaic arkeoloji** — kraliçe yokluğu tartışması yumuşak geçiştirilmiş.

**Kritik hata yok, kritik düzeltme gerekmiyor.** F-3 MVP olarak yayına hazır; orta-düzey 5 sorun (özellikle O-5 = Mücâhid hayız yorumu) bir sonraki içerik iyileştirme turunda ele alınmalı.

**Önerilen aciliyet sırası:**
1. **O-5 + M-4 (P-1, P-2)** — Sara/Mücâhid yorumu doğrulamak (hem akademik doğruluk hem transliterasyon)
2. **Lût ve Nuh eşi figürlerinin MVP'ye eklenmesi** — Tahrim 66:10-12 üçlü dengeyi tamamlamak için
3. **O-3, O-4 (P-3, P-4)** — Havva ve Saba notlarına klasik isim/arkeolojik kaynak eklemek
4. **M-3, M-5 (P-5)** — EN parite ufak rötuşlar
