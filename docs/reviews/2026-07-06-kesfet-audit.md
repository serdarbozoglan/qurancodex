# Keşfet Sayfaları — İçerik & Görsel Denetim (2026-07-06)

> **Amaç:** Keşfet menüsündeki 21 sayfayı içerik derinliği ve görsel kalite açısından denetleyip her sayfa için **10/10** seviyesine götürecek somut yol haritası çıkarmak.
> **Referans standart:** Bu denetim sonrasında güncellenmiş `SunnetullahAtlasi` ve `MunafikProfili` sayfaları görsel + içerik bar'ı olarak alınıyor. Her iki sayfa da: Islamic geometric hero pattern · Bismillah + anchor verse (KFGQPC) + framing whisper + eyebrow + stat chips · FormulaBox/widget · tabbed content · rich cards with mode-icons · gradient bgs + ambient glows · scholarViews grid.
> **Skor kalibrasyonu:** Reserve `/10` skorları katı — mevcut sayfaların çoğu 5-7/10, gerçekten zenginler 8-9/10, `10` aspirasyonel hedef.
> **Not:** Sünnetullah + Münâfık zaten 10/10'a yakın (bu denetimin referansları) — audit'e dahil edilmedi.

---

## Executive Summary

**21 sayfa denetlendi. Ortalama:**
- İçerik: **7.4 / 10**
- Görsel: **7.1 / 10**

**En iyi 5 sayfa (mevcut durum):**
| # | Sayfa | İçerik | Görsel | Not |
|---|---|---|---|---|
| 1 | Kur'an'ın Renkleri | 9 | 9 | 2972 satır, 6 tab, sitedeki en akademik tool'lardan |
| 2 | Melekler | 9 | 8 | Hadis-grade badge sistemi, 4 kelâm mektebi karşılaştırması |
| 3 | Kur'an'ın Yeminleri | 9 | 8 | 47 yemin, İbn Kayyim `Aksâmü'l-Kur'ân` tab'ı |
| 4 | Kıyamet Sahneleri | 9 | 7 | 26 sahne, 7 fazlı kronoloji, densityScore heatmap potansiyeli |
| 5 | İlk & Son Kelimeler | 9 | 8 | 114 sûre × açılış+kapanış, 10 filter chip, 2000 satır tool |

**En kritik boşluklar (Content < 6 veya wrapper-only):**
| Sayfa | Sorun |
|---|---|
| Tarihsel Kanıtlar | Sadece 3 hikâye · kendi JSON'u yok · wrapper-only |
| Retorik / Retorik Sorular | Sadece istifhâm (belağatın 1/6'sı) · kaynak yok · iki karışık route |
| Bilimsel İşaretler | Sadece 4 kart · dedicated JSON yok · Doğa Atlas'ın 1/10'u |

---

## Skor Karnesi (Özet Tablo)

| Kategori | Sayfa | İçerik | Görsel | Toplam |
|---|---|---|---|---|
| **DİL & YAPI** | Dilsel DNA / Mukattaa | 8 | 6 | 14 |
| | İmkansız Ritim | 9 | 8 | 17 |
| | Ses Mimarisi | 8 | 8 | 16 |
| | Halka Kompozisyon | 9 | 8 | 17 |
| | İlk & Son Kelimeler | 9 | 8 | 17 |
| | Kur'an'ın Renkleri | 9 | 9 | **18** |
| **RETORİK & DUA** | Kur'an'ın Yeminleri | 9 | 8 | 17 |
| | Retorik Sorular | 6 | 7 | 13 |
| | Dua Dili | 7 | 7 | 14 |
| | Dualar (DuaVerses) | 9 | 8 | 17 |
| **TARİH & İNSAN** | Kavimler Atlası | 8 | 7.5 | 15.5 |
| | Tarihsel Kanıtlar | 5 | 5.5 | 10.5 |
| | Kur'an'da İnsan | 7.5 | 7 | 14.5 |
| | İnsan Psikolojisi | 8 | 7.5 | 15.5 |
| | Nefs Mertebeleri | 6.5 | 7 | 13.5 |
| | İblis / Şeytan | 8 | 7 | 15 |
| **KUR'AN'IN EVRENİ** | Doğa Atlası | 8 | 8 | 16 |
| | Bilimsel İşaretler | 6 | 6 | 12 |
| | Zaman Boyutları | 7 | 7 | 14 |
| | Melekler | 9 | 8 | 17 |
| | Kıyamet Sahneleri | 9 | 7 | 16 |
| | Cennet & Cehennem | 8 | 7 | 15 |

---

## Cross-Cutting Sorunlar (Tüm Sayfalar İçin)

Denetim sonrası ortaya çıkan **6 sistematik pattern** — her sayfayı 10/10'a götürecek ortak dil:

1. **Islamic Geometric Hero Pattern** — Sadece Sünnetullah + Münâfık'ta var. Diğer 21 sayfa hero'sunda subtle SVG pattern (60-72px grid, opacity 0.04-0.05, gold veya kategori-accent) eksik.
2. **FormulaBox tarzı Dilbilim Widget'ı** — Sünnetullah'taki `لن تجد` 4-parça breakdown pattern'ı hiçbir sayfada replicate edilmedi. Her sayfada 1 anahtar Arapça ifade için grammar-breakdown widget'ı büyük görsel wow katar.
3. **ScholarViews Grid Sistemi** — Sünnetullah'ta 8 ulema card grid (yüzyıl + eser + insight). Sadece Melekler, Kur'an Renkleri, Kavimler kısmen replicate ediyor; kalan 18 sayfa `SourcesCitation` düz listesiyle yetiniyor.
4. **Mode-Icon Sistemi** — Sünnetullah'ta 6 kavim + Münâfık'ta 12 profil için unique SVG kimlikleri. Melekler, Doğa Atlas, Zaman, Cennet-Cehennem gibi kategori-based sayfalarda gerekli ama yok.
5. **Comparison / Karşılaştırma Widget'ı** — Sünnetullah'taki `KavimComparisonGrid` (6 kavim yan yana) tek görselde derinleştirici bar. Cennet↔Cehennem, İblis↔Adem, Mü'min↔Münâfık gibi zıtlık ekseni olan tüm sayfalarda replicate edilebilir.
6. **Bar Chart / Frequency Visualization** — Münâfık'taki 8-sûrede ayet yoğunluğu bar chart pattern'ı. Yeminler, Melekler, Doğa Atlas gibi count-yoğun içeriklerde eksik.

---

## DİL & YAPI

### 1. Dilsel DNA / Mukattaa · `/arac/mukattaa`

**İçerik:** 8/10
**Görsel:** 6/10

**Mevcut Durum:**
Tool sayfası ToolHeader + Cinematic Hero + `<LinguisticDNA />` section wrapper'ı (`Mukattaa.jsx` 148 satır; kaynak `sections/LinguisticDNA.jsx` 979 satır). İçerik gerçekten zengin: 4 harf grubu (Elif-Lâm-Mîm, Elif-Lâm-Râ, Havâmîm, tek/nadir), her grup için Mekkî/Medenî ayrımı, 29 sûre listesi, tematik pattern açıklamaları (Elif-Lâm-Râ'da %100 `tilke âyâtu'l-kitâb` örüntüsü), Ra'd 13'ün `Elif-Lâm-Mîm-Râ` istisnası, 14 harf hover-panel'i, Kaf sûresi + Kaf harfi analizi, checksum analojisi. Ancak görsel katmanda FormulaBox/KavimComparisonGrid seviyesinde bir "wow-widget" yok — mukattaa deniz haritası, harf frekans donut'u veya Mekki/Medenî timeline'ı eksik. Section tabanlı düz akış; tab yok.

**10/10 Yol Haritası:**
- 29 mukattaa sûresini kronolojik/tematik zaman çubuğu üzerinde göster (4 renk = 4 aile).
- Interaktif "Harf Frekansı vs Genel Kur'an" bar-chart widget'ı: 14 mukattaa harfinin ilgili sûrede vs genel Kur'an'daki nispi frekansı (Rashad Khalifa gibi tartışmalı iddialara `criticalNote` ile karşı-perspektif).
- Klasik ulema görüşleri (Suyûtî `İtkân`, Râzî `Mefâtîh`, İbn Kesîr, Zamahşerî, Taberî) için `SourcesCitation` — mukattaa'nın 20+ farklı tefsir teorisi tablosu.
- Kaf sûresi vaka analizi tabı: sûrenin fasıla harfi, Kaf harfi frekansı, "Kaf-Kâf" ses simetrisi görselleştirmesi.
- Cross-tool link'leri (`CrossToolCTA`): SoundArchitecture, Retorik, İlk-Son Kelimeler.
- Tab yapısı: **Aileler · Harf Atlası · Kaf Vaka Çalışması · Teoriler · Kaynaklar**.

---

### 2. İmkansız Ritim · `/arac/ritim`

**İçerik:** 9/10
**Görsel:** 8/10

**Mevcut Durum:**
`Ritim.jsx` (128 satır wrapper) → `sections/ImpossibleRhythm.jsx` (1057 satır, çok zengin). 5-adımlı discovery flow (Necm sûresi tam 62 ayet fasıla haritası, deviation notu 28. ayette), Duhâ + Kevser sûrelerinin CDN fallback'li audio playback'i, `sui generis` accordion (saj', hutbe, mesel form karşılaştırması), 3 fasıla sûre kartı (Nebe' -ûn/-ân, Mülk -îr, Duhâ -â) Esmâ-i Hüsnâ cross-reference notlarıyla. Motion + AnimatePresence + SVG bolluğu + tıklanabilir ayet karesi UI'ı.

**10/10 Yol Haritası:**
- 16 vezin karşılaştırma widget'ı: klasik Arap şiirinin bahirleri (Tavîl, Basît, Kâmil, …) vs Kur'an'ın hiçbirine uymayışı — interaktif slider ile ritmik pattern görselleştirmesi.
- Ek 4-6 fasıla sûresi (Necm dışında Nâziât, Şems, Fecr, Zümer, Rahmân "fe-bi-eyyi âlâ" refrain'i) sesli önizleme ile.
- **Rahmân refrain widget'ı**: 55. sûrenin 31 kez tekrarlanan `fe-bi-eyyi âlâʾi rabbikumâ tükezzibân` ayet-listesi ile ritmik shakma efekti.
- Klasik i'câz literatüründen 5-6 ulema (Bâkıllânî `İʿcâzü'l-Kurʾân`, Câhız, Kâdî ʿAbdülcebbâr, Cürcânî `Delâʾilü'l-Iʿcâz`, Suyûtî) — `SourcesCitation`.
- Modern akademik referanslar: Angelika Neuwirth (rhymed prose), Michael Sells `Approaching the Qurʾān`, Devin Stewart (saj') — 3-4 kaynak akademik nüans için.
- Section'a bağlı olduğu için tab yapısına geçmese bile en azından üst kısımda "Ne göreceksin?" 4-adım pill navigator ekle.

---

### 3. Ses Mimarisi · `/arac/ses-mimarisi`

**İçerik:** 8/10
**Görsel:** 8/10

**Mevcut Durum:**
`SesMimarisi.jsx` (117 satır wrapper) → `sections/SoundArchitecture.jsx` (1435 satır). 4 sûre karşılaştırması (Müddessir azap ص/ق, Meryem rahmet ح/ن/م, Kâria kıyamet ق/ر, Rahmân nimet ر/ح/م/ن), her ayet için `calcHardnessScore()`, amigdala/korteks analojisi, ComparisonCard (Kâria vs Rahmân 3-4 ayet ardışık audio playback), JAGGED vs SMOOTH bar visualization. Renk-kodlu sert/yumuşak harf işaretlemesi. Zayıf noktalar: tab yok, karşılaştırma sadece 2 tema (azap vs rahmet); dile getirilen 4 sûre yeterli değil.

**10/10 Yol Haritası:**
- Fonetik interaktif spektrum: 28 Arap harfi patlayıcı/sürtünmeli/nazal/likit olarak SVG diagram (Sibeveyh `Kitâb` sınıflandırması), her harfe tıklayınca örnek ayet.
- Ek 6-8 karşılaştırma çifti: (Cehennem — Fecr 89:23; Cennet — Vâkıa 56:15-16), (Şok — Kâria 101:5; Huzur — Fetih 48:4 `sekîne`), (Fırtına — Nûh 71; Sükûn — Tûr 52:1-2).
- Klasik tefsir + fonetik: Sibeveyh, İbn Cinnî `el-Hasâʾis`, Zemahşerî iltifât + ses uyumu — `SourcesCitation`.
- Modern dilbilim referansları (Mustansir Mir, Michael Sells "sound-figure", Devin Stewart) `criticalNote` ile.
- "Ses Haritası" tab: 114 sûrenin sert/yumuşak ortalama skorunun bar grafik olarak sıralanması → hangi sûre en "sert", hangi en "yumuşak".
- Rahmân sûresinin `fe-bi-eyyi âlâʾi` refrain audio widget'ı + sesli imza analizi (Ritim ile paylaşılabilir, birbirine link ver).

---

### 4. Yapısal Mimari / Halka Kompozisyon · `/arac/halka-kompozisyon`

**İçerik:** 9/10
**Görsel:** 8/10

**Mevcut Durum:**
`HalkaKompozisyon.jsx` (117 satır wrapper) → `sections/HiddenArchitecture.jsx` (1116 satır, sansasyonel içerik). Fatiha A-B-C-D-C'-B'-A' ring composition + Ayet'el-Kürsî tek ayet içinde ring yapısı, 3 renk-kodlu pair, her pair için tefsir yorumu, TR/EN. Ayrıca **7 katmanlı Nûr Sûresi prizması** (Fiziksel/Manevi/Bilimsel/Felsefi/İç Dünya/Tasavvufi/İlahi) — her katmana bir ulema (Râzî, Gazâlî, İbn Sînâ, İbn Kayyim, İbn Arabî) + kritik notlar (Vahdetü'l-Vücûd tartışması, Nûr-u Muhammedî hadisinin mevzû olduğu uyarısı `criticalNote` ile). Klasik + modern + kritik denge kurulmuş.

**10/10 Yol Haritası:**
- Ek 3-4 halka örneği: Bakara sûresinin makro ring (Cuypers `The Composition of the Qurʾān`), Yûsuf sûresi kıssa yapısı ring, Kehf sûresinin 4 kıssa palindrom yapısı, Meryem sûresi peygamber-sıralı ring.
- Michel Cuypers `The Composition of the Qur'ān: Rhetorical Analysis` ve Raymond Farrin `Structure and Qur'anic Interpretation` referansları — `SourcesCitation`.
- Fatiha ring için animasyonlu **SVG halka diyagramı** (metin çemberi + eşleşme çizgileri).
- Tab yapısı: **Fatiha · Ayet'el-Kürsî · 7 Katman · Makro Halka · Metodoloji · Kaynaklar**.
- Interaktif "Ring Finder" widget: kullanıcı bir sûre seçer, akademik ring pattern'ları literatürde raporlanmışsa gösterir (Bakara, Kehf, Yûsuf, Fatiha, Meryem, Maûn).
- Semitic chiasmus arka-plan bilgisi (İncil-Yahudi metin geleneği ile karşılaştırma) — Farrin vurgular; `criticalNote` ile sun.

---

### 5. İlk ve Son Kelimeler · `/arac/ilk-son-kelimeler`

**İçerik:** 9/10
**Görsel:** 8/10

**Mevcut Durum:**
Standalone tool (`IlkSonKelimeler.jsx` 1995 satır). 114 sûrenin açılış+kapanış kelimesi, `ilk-son-kelimeler.json` (5043 satır) tam veri + `ilk-son-kelimeler-spotlights.json` (300 satır). 10 filter chip (Mukattaa opener, Kul opener, Yemin opener, İnnâ opener, Emir fiili, Yâ eyyuhâ vocative, İlâhî sıfat closer, Mekkî/Medenî), full-text search (Arapça + latin + anlam + tam ayet), spotlights bölümü, detail panel, Elmalılı Tefsir Panel'e cross-link. Meta çok titiz (Hanefî Fatiha 1:1 politikası, Tevbe Bismillah-sız notu, Leeds corpus ile root/translit).

**10/10 Yol Haritası:**
- **İlk ↔ Son "eşleşme" görselleştirmesi**: bir sûrenin açılış kelimesi ile kapanış kelimesi arasındaki tematik echo (örn. "hamd" → "sapanlar" antithesis) — pair-view mode; kart flip animasyonu.
- Kök (root) heatmap: 114 sûrenin açılış+kapanış kök harflerinin en sık geçen 10 kök örüntüsü.
- Ek spotlight tabları: **Sûre Grubları** (Havâmîm 40-46'nın hepsi ح م ile açılır, 3 aile-içi tematik ring), **Kul opener zinciri** (72, 109, 112, 113, 114 — sûre sonu 5 seri "Kul"), **İlâhî sıfat closer distribution** (kaç sûre `esmâ-i hüsnâ` çifti ile kapanıyor).
- Klasik tefsir referansı: Suyûtî `el-İtkân` bab-ı fevatih ve havâtim + Zerkeşî `el-Burhân` — `SourcesCitation`.
- Cross-tool link'leri: Yeminler tool'una (oath-opener sûreleri), Mukattaa tool'una (mukattaa-opener), Retorik tool'una (Kul-opener → hitap yapısı).

---

### 6. Kur'an'ın Renkleri · `/arac/renkler`

**İçerik:** 9/10
**Görsel:** 9/10

**Mevcut Durum:**
Standalone tool (`KuranRenkleri.jsx` 2972 satır!). 8 renk (Yeşil/Beyaz/Siyah/Sarı/Kırmızı/Mavi/Altın/Gümüş), her renk 1-3 Arapça form (hapax badge var — `mudhâmmatân` dual form gibi), context tag'leri (Cennet/Kıyamet/Doğa/Kıssa/Mucize/Kozmik/Cehennem), key verse + all refs listesi, transliteration + form + primary ref. **6 tam tab**: Renkler · Bağlam Haritası · Cennet Paleti · Kıyamet Renkleri · Dilbilim · Kaynaklar. Dilbilim tabı ve Kaynaklar tabı bağımsız — sitenin en akademik-derin tool'larından biri.

**10/10 Yol Haritası:**
- Interaktif "Kur'an paleti" widget: SVG halka; kullanıcı bir renk seçer, o renkle geçen tüm ayetler ekranın kenarında liste, o rengin diğer renklerle "co-occurrence" bar chart.
- Ek 4-6 renk/renk-derecesi ekle: Firavun'un `ṣafrâʾ` yeşil-sarı ineği (Bakara 2:69 tam varyant), Mûsâ'nın `beyḍāʾ` beyaz eli (Tâhâ 20:22 vs mevcut Beyaz kartı), `arjuwān` mor/erguvan (klasik Arapça'da nadir), `verd` gül-kırmızı (Rahmân 55:37 gökyüzü).
- Modern kromatoloji parallel: Berlin & Kay `Basic Color Terms` (1969) Kur'an renk envanteri ile karşılaştırma — `criticalNote` ile.
- "Kıyamet Palet Timeline" tab genişletmesi: kıyamet ayetlerinin renk sırası (siyah gök → kızıl deri → sarı yüzler → beyaz nur) SVG timeline.
- Cennet paleti için Rahmân 55 tam palet-run widget'ı (yeşil yaslanma yastıkları, beyaz eşleri, altın-gümüş bilezikleri, erguvan kürsüler) — 55. sûrenin renk-echo yapısı.
- Ek klasik kaynak: Câhız `el-Ḥayavân` (renk terminolojisi bölümü), Sîbeveyh, İbn Kuteybe — Dilbilim tabına.

---

## RETORİK & DUA

### 7. Kur'an'ın Yeminleri · `/arac/yeminler`

**İçerik:** 9/10
**Görsel:** 8/10

**Mevcut Durum:**
Standalone tool (`KuranYeminleri.jsx` 2290 satır). `yeminler.json` (1111 satır): 7 kategori (Gök Cisimleri, Zaman, Yer/Mekân, Güçler/Olaylar, İnsan/Ruh, Kutsal Metinler, Kıyamet), toplam **47 yemin item**, her item için compoundParts (bileşik yeminlerin parçalanması), subject/purpose açıklamaları, isCompound flag. 5 tab: Kategoriler · **Derinlik Analizi** (3 deep-dive: Şems 91, Fecr 89, Tîn 95) · **Sûre Dağılımı** (bar chart) · **İbn Kayyim** (Aksâmü'l-Kur'ân'dan 5 pattern) · Kaynaklar. Focus trap, SVG tab-icon'ları. Neredeyse Sünnetullah seviyesinde. Zayıf noktası: interaktif kozmoloji/tabiat visualization eksik — 47 yeminin çoğu tabiat unsuru üzerine ama harita/diyagram yok.

**10/10 Yol Haritası:**
- **Yemin kozmosu widget'ı**: SVG kosmoloji sahnesi (güneş/ay/yıldızlar/gök/incir/zeytin/dağlar), her element tıklanınca üzerine yemin edilen ayetler liste.
- Zaman kategorisinde: gün-gece-fecir-şafak-sabah-öğle-ikindi zaman-şeridi widget'ı (`subhi` vs `duhâ` vs `asr` hangi vakte ait).
- Ek klasik kaynak: Süyûtî `el-İtkân` bab-ı el-akṣâm, Râzî `Mefâtîh` (yemin bölümleri), İbn Kayyim `et-Tibyân fî Aksâmi'l-Kur'ân` — `SourcesCitation` genişletilebilir.
- Modern akademik: Angelika Neuwirth (Meccan oath series), Nicolai Sinai `The Qur'an: A Historical-Critical Introduction` (oath introductions) — `criticalNote` ile.
- **Tahaddi tab'i** eklenebilir: yeminlerin "argüman" olarak işlevi — İbn Kayyim'in `muḳsem ʿaleyh` (yemin edilen şeye) analiz sistemi görselleştirmesi.
- Kısa-Uzun-Bileşik yemin filtresi (chip): tek unsurlu yemin (`ve'l-fecr`) vs çok unsurlu zincir (`ve'ş-şemsi ve duḥâhâ · ve'l-ḳameri iẕâ telâhâ · ve'n-nehâri iẕâ cellâhâ`).

---

### 8. Kur'an'ın Retoriği / Retorik Sorular · `/arac/retorik-sorular` (ayrıca `/arac/retorik`)

**İçerik:** 6/10
**Görsel:** 7/10

**Mevcut Durum:**
`RetorikSorular.jsx` (117 satır wrapper) → `sections/QuranRhetoric.jsx` (834 satır — en kısa homepage section'lardan). İçerik dar odaklı: sadece **istifhâm (soru) retoriği** — 4 kategori (İstifhâm-ı İnkârî ~%40, İrşâdî ~%28, Tevbîhî ~%20, Taʿaccübî ~%12), 300px SVG donut chart, tıklanabilir kategori kartları + expandable descriptions + progress bar animasyonu. "Kur'an cevaplamaz, sorar" hero başlığı güzel. Ancak "Kur'an'ın retoriği" başlığı çok geniş; istifhâm dışında iltifât, tibaḳ, kinâye, teşbih, isti'âre, meċaz, mübalağa, cinas — hiçbiri yok. Kaynak yok, ulema referansı yok. `1.200 soru` istatistiği için methodology notu var (nüans ~800-1200).

**10/10 Yol Haritası:**
- **Belağat aileleri tab'ları ekle**: (a) İltifât (perspective shift) — Zemahşerî'nin ana konusu, (b) Tibâḳ/Muḳâbele (antithesis) — Kur'an'ın yeryüzü sanatı, (c) İstiʿâre/Teşbih (metaphor/simile), (d) Kinâye (allusion), (e) Mübalağa, (f) Cinâs (paronomasia). Her aile için 4-6 örnek + Arapça + i'râb + tefsir.
- **İltifât widget'ı** özellikle: "Rabbimize hamd olsun" → "Beni yaratana" gibi 1./3. şahıs geçişleri interaktif göster (Neal Robinson `Discovering the Qur'an` ve Abdel Haleem'in klasik makalesi).
- Kaynak listesi: Cürcânî `Delâʾilü'l-Iʿcâz` + `Esrârü'l-Belâġa` (kurucu), Zemahşerî `Keşşâf`, Sekkâkî `Miftâḥu'l-ʿUlûm`, Suyûtî `el-İtkân`, modern: Abdel Haleem (SOAS iltifât makalesi), Angelika Neuwirth — `SourcesCitation`.
- Ek 4-6 istifhâm örneği per kategori: mevcut 1'er örneğin çok az; her kategori için 5+ ayet-örnek ile "browse" özelliği.
- Cross-tool: İlk-Son Kelimeler'deki Kul-opener sûreleri (72, 109, 112, 113, 114) — hepsi hitap/soru öbeği; buraya link.
- Retorik-Sorular ve Retorik iki ayrı route var (`/arac/retorik-sorular` ve `/arac/retorik`) — konsolide et veya farklılaştır; şu an isim karışıklığı riski.

---

### 9. Dua Dili · `/arac/dua-dili` (ayrıca `/arac/dualar` — DuaVerses)

**İçerik:** 7/10 (`dua-dili`) · 9/10 (`dualar` browser)
**Görsel:** 7/10 (`dua-dili`) · 8/10 (`dualar`)

**Mevcut Durum:**
İki ayrı tool var. **`/arac/dua-dili`**: `DuaDili.jsx` (117 satır wrapper) → `sections/QuranDua.jsx` (1062 satır). 6 peygamber profili (İbrahim, Eyyûb, Yûsuf, Mûsâ, Yûnus, Zekeriyyâ) + `insight` + `response` + Arapça + 15+/2/3/15+/1/4 dua sayımı, RABBENA_DUAS listesi 7 ayet (Bakara 2:201, 2:286, Âl-i İmrân 3:8/3:16, Haşr 59:10, Furkan 25:74, …) — her biri hadis referanslı note ile. Hero anchor: Bakara 2:186. **`/arac/dualar`**: `DuaVerses.jsx` (537 satır) + `dua-verses.json` (**50 dua**), 11 kategori (af, tövbe, sığınma, hidayet, sabir, sıkıntı, aile, şükür, rızık, ilim, genel), category color chip'leri, audio playback CDN fallback, arama, featured badge, prophet attribution 25 duada belirli.

**10/10 Yol Haritası (DuaDili):**
- Ek peygamber profilleri: Nûh (Kavmiyle uzun mücadele + boğulma öncesi çığlığı `Kamer 54:10`), Âdem (`rabbenâ ẓalemnâ enfüsenâ` Aʿrâf 7:23), Süleymân (`rabbi evziʿnî en eşküre` Neml 27:19), Muhammed (Nasr 110:3, İsrâ 17:24 walideyn duası) — 10 peygamber toplam.
- **"Dua Anatomisi" widget'ı**: bir duayı seçince gramatik parçalanma (nidâ + hâcet + gerekçe + isim/sıfat kapatma) — Kur'ânî dua kalıbının şablonu görselleştirilir.
- Klasik kaynak: Suyûtî `el-Câmiʿu's-Saġîr` (dua bölümü), İbn Kayyim `el-Vâbilü's-Sayyib` (dua psikolojisi), Nevevî `el-Ezkâr` — `SourcesCitation`.
- Response pattern analizi: 6 peygamberin "Cevap" bölümü var — bunu "İstek → Cevap → Ne kadar sonra?" grid'ine dönüştür (Zekeriyyâ ileri yaşta, Eyyûb hastalıktan sonra, Yûsuf zindandan sonra).
- Cross-tool: DuaVerses browser'a görünür link + DuaVerses'e "narrative view" (bu sayfa) geri linki.
- Tab yapısı: **Peygamber Duaları · Rabbenâ Zinciri · Anatomi · Cevap Kalıpları · Kaynaklar**.

**10/10 Yol Haritası (DuaVerses — `/arac/dualar` — kısa notu):**
- 50 dua → 80+ hedefi (Kur'an'daki tüm dua ayetleri; `dua-arabic.json` sadece 18 satır — birleştir/genişlet).
- 25 duada prophet attribution eksik (`prophet_tr: None`) — tamamla.
- Sûre-index mode ekle (114 sûrede dua dağılımı bar chart).
- İbadet-context tab (namaz sonrası, iftar, yağmur duası, seyahat, korku anı) — hadisle bağla.

---

## TARİH & İNSAN

### 10. Kavimler Atlası · `/atlas/kavim`

**İçerik:** 8/10
**Görsel:** 7.5/10

**Mevcut Durum:**
16 kavim (id, arabic, prophet, helak tipi, mainSurah, verseAr/Tr/En, geo, mentionCount, criticalNote), 10 farklı helak biçimi, 6 tab (Kavimler / Helak Deseni / Arkeoloji / Bölge Haritası / Karşılaştır / Kaynaklar), gerçek react-leaflet interaktif harita ve klasik + arkeolojik + akademik 3 kaynak grubu — Sünnetullah'a en yakın kardeş sayfa. Hero premium template'e uygun (Yûsuf 12:109 anchor, filigree, stat grid × 5). Fakat FormulaBox tarzı bir dilbilim widget'ı ve hero'da SVG Islamic geometric pattern yok; kavimlere özgü mode-icon sistemi (rüzgar/su/ses/sarsıntı için ikonografi) semantik renk chip'lerinden ibaret. Kaynaklar tab'ı sadece isim-detay listesi — Sünnetullah tarzı "insight card" değil.

**10/10 Yol Haritası:**
- Hero'ya subtle Islamic geometric SVG pattern layer ekle (Sünnetullah `sunnet-geometric` pattern muadili — 3-5% opacity, döner).
- Her helak tipi için custom SVG mode-icon set (ruzgar/su/ses/sarsinti/tas/deniz/ates/mesh) — sadece renk değil ikon üzerinden görsel tanınma.
- Kaynaklar tab'ını "Ulema Portresi" grid'ine dönüştür — İbn Kesîr/Taberî/İbn Kayyim insight card'ları (Sünnetullah `scholarViews` pattern: yüzyıl + ana insight + eser).
- FormulaBox muadili: helak formülü ("uyarı → red → mühlet → âyet-i muîn → helak → şahit") — 6-parçalı structural breakdown widget.
- Bir "Karşılaştırma" tab'ında side-by-side kavim seçici (Âd vs Semûd vs Firavun: mahaller, mühlet süreleri, yenilme motifi, hayatta kalanlar) — KavimComparisonGrid parity.
- 2-3 yeni kavim eklemek yerine mevcut kayıtları derinleştir: her karta 1-2 klasik tefsir alıntısı ve kavim-özel etimoloji (ör. Âd "yeniden dön/tekrar" kökünden).

---

### 11. Tarihsel Kanıtlar · `/atlas/tarihsel-kanit`

**İçerik:** 5/10
**Görsel:** 5.5/10

**Mevcut Durum:**
Tool sayfası 117 satırlık ince wrapper — sadece Hero ekleyip anasayfa `HistoricalProof` section'ını AYNEN gösteriyor. İçerik yalnızca 3 hikâye: Firavun / Hâmân / Rûm suresi kehâneti. Her hikâyede title + subtitle + content + 4-5 points + significance + verse + criticalNote (kısmen düşünceli akademik nüans), timeline dot + expand/collapse UX var. Cross-tool CTA strip (Yûnus/Kasas/Rûm sûrelerine) düzgün. Fakat 3 hikâye = ince içerik; hiçbir tab yok, hiçbir kaynak grid'i yok, karşılaştırmalı arkeolojik veri yok. `criticalNote` özelliği güzel ama akademik kaynak künyeleri (Bucaille, Maspero, Prokopios) sadece paragraf içi düz metin. **Bu sayfanın kendine ait JSON'u yok — i18n'e gömülü.**

**10/10 Yol Haritası:**
- Yeni `tarihsel-kanit.json` üret — her kanıt için: kanıt tipi (arkeoloji / kehânet / metin filolojisi / demografi), tarih, keşif tarihi, ana kaynak, karşı hipotez, akademik konsensüs durumu.
- Kanıt havuzunu 3'ten 8-10'a çıkar: Firavun bedeni, Hâmân, Rûm kehâneti + İrem (Ubar), Ashâbü'l-Uhdûd (Najran katliamı, Christian Robin), Ashâbü'l-Kehf, Karnayn tesbitleri, Ad ovası, Semûd Hicr yazıtları, Habeşistan hijrası arkeolojisi.
- 3-4 tab kurgusu: Arkeolojik Örtüşme / Metin Filolojisi (Hâmân — Erman/Grimme, ilk açıklamalar) / Tarih-Öncesi Kehânet (Rûm 30:2-4 ve Bizans-Sasani) / Akademik Nüans.
- Her kanıt için "iddia gücü" scale'i (Kesin / Güçlü / Muhtemel / Tartışmalı) — chip renk kodlu.
- Klasik ve akademik kaynak (Bucaille, Reynolds, Neuwirth, Robin, Grimme, Maspero) `SourcesCitation` grid — her kaynağa "hangi kanıt için kullanıldı" atıflarıyla.
- Timeline'i harita/kronoloji karışımına çevir (MS 620 kehânet → MS 628 Bizans zaferi → 1881 Firavun mumyası → 2015 Birmingham elyazması).
- Bugün wrapper'daki 117 satırlık sayfayı gerçek bir Kanıtlar component'ına yükselt; `sections/HistoricalProof`'u özet ana sayfa versiyonu olarak koru.

---

### 12. Kur'an'da İnsan / İnsan Tanımı · `/atlas/insan-tanimi`

**İçerik:** 7.5/10
**Görsel:** 7/10

**Mevcut Durum:**
Wrapper (117 satır) + sections/HumanDefinition (1244 satır — gerçek içerik burada). İçerik zengin: 4 insan terimi (insan/beşer/nâs/benî Âdem, her biri arabik + kök notu + verse + expandable panel), 7 mü'min özelliği (Mü'minûn 23:2-11 sıralı, sıfat-fiil dilbilim nüanslarıyla), 5 karşıtlık çifti (mü'min↔kâfir, muhsin↔müfsid, ebrâr↔füccâr, şâkir↔kefûr, sâdık↔kâzib), 4 istikâmet kelimesi analizi (Hûd 11:112), 3 transformation stage (müslim→mü'min→muhsin). "6666 modal", ses playback (mü'min ayeti), termsSourceNote akademik uyarısı. Stat cards 3 adet (6.236 / ~2.500+ / 25+). Görsel olarak polished ama tek uzun scroll — tab yok, Islamic pattern yok, ulema grid'i yok.

**10/10 Yol Haritası:**
- Long-scroll'u 4-5 tab'a böl: Terimler / Mü'min Portresi / Karşıtlıklar / İstikâmet / Dönüşüm — sticky tab bar (§13.19 pattern).
- Klasik ulema grid'i ekle: Râzî (fıtrat), Gazâlî (nefs terbiyesi), İbn Kayyim (kalbin halleri), Fahrüddin er-Râzî (insan tanımı) — `SourcesCitation` pattern.
- Modern parallel: Frankl "anlam arayışı", Jung "self", Erikson "identity" — mevcut PsychologySection modern tab'ıyla parity.
- FormulaBox muadili: "İnsan denklemi" — Nefs (ruh/beden) + akıl + kalp + halife + imtihan → tek görselleştirilmiş formül.
- Islamic geometric pattern hero'da (isim-diagram: 4 terim orbit ederek merkeze "insan" kelimesini işaret eden radial layout).
- "İnsanın 30+ ismi" mini-index (halife, mükellef, mükerrem, benî Âdem, insan, beşer, nâs, cin-ins, mü'min, kâfir, münâfık, fâsık, muhsin, muflih, muhtâr, ma'sûm…) — chip cloud.
- Comparison widget: Kur'an insan tanımı vs Aristo (zoon politikon) vs Descartes (cogito) vs Darwin (biyoloji).

---

### 13. İnsan Psikolojisi · `/atlas/insan-psikolojisi`

**İçerik:** 8/10
**Görsel:** 7.5/10

**Mevcut Durum:**
Wrapper (117 satır) + sections/PsychologySection (700 satır). İçerik proje kütüphanesindeki en zengin bölümlerden biri: 9 ana tab (Nefs / Kalp / Korku / Savunma / Yusuf / Sosyal / Araclar / Anlam / Modern) + 3 appendix. Her tab TAB_META ile kendi renk kimliğine sahip, tab bar sticky ve her tab'ın kendi icon SVG'si var. i18n'de 42+ item — her item accordion (title + Arabic verse + translation + verse audio button + reference + note). Modern psikoloji ile karşılaştırma tab'ı foundational bir differentiator (Frankl, Jung, Freud, Erikson karşılıkları). Yusuf tab'ı travma-iyileşme paradigması. Ama Sünnetullah'ın sahip olduğu scholarViews grid'i, FormulaBox muadili ve Islamic geometric hero yok. Nefs Mertebeleri ayrı sayfa olarak var — bu iki sayfa arası cross-link zayıf.

**10/10 Yol Haritası:**
- Klasik ulema grid ekle: Gazâlî (`İhyâ` kalp bölümü), Mâverdî (`Edebü'd-Dünyâ`), İbn Kayyim (`Medâricu's-Sâlikîn`), Muhâsibî (`er-Riâye`), Râzî (nefs psikolojisi), İbn Sînâ (Kitâbü'n-Nefs) — her biri 1 cümle key insight.
- Modern parallel'ı derinleştir: mevcut "modern" tab ~5 item — 12-15'e çıkar (Frankl, Jung, Rogers, Maslow, Freud, Erikson, Piaget, Bowlby, Beck, CBT, mindfulness, positive psychology).
- FormulaBox muadili: "psikolojik denge denklemi" (havf ↔ recâ, tövbe ↔ musâbere, sabır ↔ şükür → itmi'nân).
- Yusuf tab'ını genişlet: travma-iyileşme arc'ının 6 aşamasını görselleştir (kaybediliş → kuyu → köle → ithâm → hapis → kavuşma → af).
- Nefs Mertebeleri sayfasına derin cross-link — mevcut tek CTA linkinin ötesine.
- Islamic geometric pattern hero'da; nefs/kalp/rûh üçlü çemberi ambient glow.
- "Vaka çalışması" mini-modal'lar: her tab'a 1 kıssa örneği (Yusuf-savunma mekanizmaları, Musâ-korku, Yûnus-öz-eleştiri).

---

### 14. Nefs Mertebeleri · `/atlas/nefs-mertebeleri`

**İçerik:** 6.5/10
**Görsel:** 7/10

**Mevcut Durum:**
JSON 277 satır: 3 quranicCore (emmâre / levvâme / mutmainne — Kur'ânî kesin) + 4 suficExtension (mülhime / râdiye / mardiyye / kâmile — tasavvufî ek) + 3 classicalFramework + intro + transitionNote. Component 1124 satır, temiz linear scroll (tab yok — 3 SectionHeader kategori). Her stage için: color, verse(s), classicalView, sourceTr, warning, ekolEtiketi. Hero premium template (Fecr 89:27-28 anchor, ladder legend widget), TransitionBand ("gate" motifi), 7-dot ladder visualization, `SourcesCitation` (Gazâlî / İbn Kayyim / Necmüddîn Kübrâ / Râzî) ve `CrossToolCTA` (Münâfık ↔ mutmainne'nin zıddı bağlantısı) düzgün kurgulu. Sayfa akademik olarak dengeli — "Kur'ânî 3 mertebe kesin, tasavvufî 4 mertebe eklemedir" transparency'si takdire değer. Ama görsel widget çeşitliliği zayıf, ScholarViews grid yok, FormulaBox yok, karşılaştırma tab'ı yok.

**10/10 Yol Haritası:**
- Sünnetullah/Münâfık'taki gibi 3-4 tab: 3 Mertebe (Kur'ânî) / 4 Ek (Tasavvufî) / Klasik Çerçeveler / Karşılaştırma. Şu an linear scroll, tab bar cognitive load'u düşürür.
- Klasik ScholarViews grid ekle — Gazâlî, İbn Kayyim, Kübrâ, Râzî halihazırda `SourcesCitation`'da; her biri için insight card'a genişlet (yüzyıl + kısa alıntı + hangi mertebeyi analiz ettiği).
- Karşılaştırma matrisi: 7 mertebe × [tetikleyici, tehlike, ilaç, kaçınılacak, sonuç] — comparative table.
- FormulaBox muadili: "nefs terbiyesi denklemi" (tövbe + zikir + mücâhede + murakabe → yükseliş).
- Yusuf 12:53 (emmâre) ↔ Kıyâme 75:2 (levvâme) ↔ Fecr 89:27 (mutmainne) → üç ayetin karşılıklı okunuş grid'i (aynı anda gösterim, farklı renk gradient'lerinde).
- Modern parallel: id/ego/superego (Freud), shadow/self (Jung), ölüm dürtüsü / yaşam dürtüsü — mevcut modern-parallel eksik, sayfaya boyut katar.
- Islamic geometric pattern hero'da (7 mertebe → 7 katmanlı radial mandalasız SVG).

---

### 15. Kur'an'da İblis / Şeytan · `/arac/iblis-seytan`

**İçerik:** 8/10
**Görsel:** 7/10

**Mevcut Durum:**
Component 1275 satır (JSON dosyası YOK — data component'a inline). 7 sûrede aynı sahnenin karşılaştırmalı analizi (Bakara / A'râf / Hicr / İsrâ / Kehf / Tâ-Hâ / Sâd) — her passage için: verse range, distinct-özellik, arabic + arabicSecondary, translation, nuance, unique-chip'ler (hapax'lar dahil: `iḥtinâk`, `salsāl + hamaʾ`, `biyadayye`, `bi-ʿizzetik`), accent color. 4 OBSERVATIONS meta-panel (uzunluk 1→16 ayet, ateş-çamur 2/7, nüzul kronoloji 38→87). "Anahtar Fiiller" callout (`ebā / istekbera / kāne mine'l-kāfirīn`). `SourcesCitation` (Râzî, Taberî, Mâturîdî, İbn Kayyim). Vesvese (Nâs 114:5) mekanizmasına derinlemesine değinilmiyor — cross-passage odaklı. Görsel: 7-marker preview şeridi, per-passage accent color scheme, chip system, motion fadeUp. Ama tab yok, Islamic pattern yok, iblis'in Kur'an'daki 40+ ayeti tam olarak taranmıyor.

**10/10 Yol Haritası:**
- İnline data'yı `iblis-seytan.json`'a çıkar (§13.15 encoding audit ile) — CLAUDE.md build script kuralına uyum.
- Vesvese Mekanizması yeni tab: Nâs 114:1-6 tam analiz + A'râf 7:200-201 + Fussilet 41:36 + Kaf 50:16-18; şeytan → nefs → kalp arasındaki 3-katman şeması, `izâze/vesvese/humezât` fark grid'i.
- Şeytan ↔ İblis terim ayrımı için dedicated panel: Şeytan (çoğul: şeyâtîn) İblis'ten farklı; ins-şeytanı vs cin-şeytanı (Nâs 114:6, En'âm 6:112) grid'i.
- Şeytanın hile arşivi: 12+ hile (tesvîl / temenniye / va'd / tezyîn / tebşîr / nezâğ / istifzâz / cünd / helâk / tahrîş) — İbn Kayyim `İğâsetü'l-Lehfân` tipolojisi görselleştirmesi.
- Kur'ân'da şeytan'a ait 30+ hâs isim/sıfat (mârid, azîm, racîm, hannâs, vesvâs, karîn, ednâ) chip'li mini-tab.
- Comparison widget: İblîs vs Adem — yaratılış maddesi (nâr vs tîn), reddediş vs tövbe, gurur vs tevazu — side-by-side.
- Islamic geometric pattern hero (dark red/carmine accent — mevcut gold'a alternatif).
- 3-4 tab'a böl: 7 Sûrede Kıssa / Kelime & Fiiller / Vesvese Mekanizması / Kaynaklar — şu an tek scroll.
- İnsanın koruyucu istiaze duaları mini-widget'ı (Felak/Nâs, Mu'avvizeteyn, sabah/akşam ezkârı) — pratik uygulama boyutu.

---

## KUR'AN'IN EVRENİ

### 16. Kevni Ayetler / Doğa Atlası · `/atlas/doga`

**İçerik:** 8/10
**Görsel:** 8/10

**Mevcut Durum:**
`doga-atlasi.json` (692 satır, ~55 kart) sitedeki en zengin veri setlerinden: 22 hayvan + 21 bitki + 6 sûre-adı + 5 bağlam + 3 tefsir notu; **3 "Featured" spotlight kartı** (arı-vahyi, sivrisinek pedagojisi, hüdhüd) klasik tefsir (Râzî/Kurtubî/Taberî) atıflarıyla dolu. Bileşen (1.463 satır) 7 tab, filter pill sistemi (counts + hapax badge + klasik terim tooltip), search input ve **inline "Gök Cisimleri"** verisi (8 cisim — Hunnes-Künnes, Târık pulsar okuması dahil) taşır. Hero, Bismillah + Ğâşiye 88:17 anchor + framing whisper + **"âyât-ı kevniyye" klasik çerçeve callout'u** ile Sünnetullah bar'ında; ancak kartlarda mode-icon veya per-item ikonografi yok, comparison/formula widget'ı yok, hero'da ambient glow/geometric pattern eksik.

**10/10 Yol Haritası:**
- Her hayvan/bitki için **kategori-based SVG icon** (paw/leaf/hoop bee/pulsar/moon) — 55 kart tek renk halka olmayacak.
- **Frequency bar chart** widget'ı ("hurma 20+ · deve ~10 · sinek 2 · yaktîn 1") — Münâfık'taki ayet-yoğunluğu bar chart eşdeğeri.
- **"Hapax Alfabesi"** özel bölüm: 10+ hapax bitki/hayvan (yaktîn, darî, ğaslîn, talh, tasnîm, kâfûr, zencebîl…) tek grid'de — her biri için etimoloji + tefsir dağılımı.
- **Compare widget** — "Cennet meyvesi ↔ Dünya meyvesi" (hurma, üzüm, nar, zencebil) split view (İbn Abbas: "isim aynı, mahiyet farklı" quote'unu görsel taşıyıcı yap).
- Hero'ya **Islamic geometric pattern SVG** (8-köşeli yıldız, 3% opacity, döner) + **ambient gold glow orbs** — Sünnetullah/Münâfık paritesi.
- Bilimsel İşaretler section'ı (615 satır scroll-story) atlasa duplike halde asılı; bu bloğu ya **ayrı bir "Kevni Delil" tabına** entegre et ya da CTA'ya indir (şu an navigation dupe).

---

### 17. Bilimsel İşaretler · `/arac/bilimsel-isaretler`

**İçerik:** 6/10
**Görsel:** 6/10

**Mevcut Durum:**
Tool sayfası (`BilimselIsaretler.jsx`, 117 satır) sadece bir **ince wrapper**: ToolHeader + Cinematic Hero (Zâriyât 51:47) + `<ScientificSigns />` anasayfa section'ının **birebir kopyası**. Asıl içerik anasayfa'da: 4 sabit tab (demir/genişleyen evren/iki deniz/embriyoloji), her tab için tek key verse + preview text + facts listesi + critical note + Bucaillism uyarı callout'u + 4 sûre CTA + 1 Doğa Atlas CTA. Ancak 6.236 ayetlik geniş "bilimsel işaretler" külliyatı sadece **4 karta indirgenmiş**: dağ direği (Nebe 78:7), yağmur döngüsü (Zümer 39:21), parmak izi (Kıyâme 75:4), yörünge (Enbiya 21:33), atmosferin katmanları, arı navigation, süt oluşumu (Nahl 16:66), gece-gündüz sarma (Zümer 39:5) hiç yok. Hero + tab pattern zaten iyi ama kart yoğunluğu Doğa Atlas'ın onda biri.

**10/10 Yol Haritası:**
- **Dedicated JSON** oluştur (`bilimsel-isaretler.json`) — minimum 15-20 kart: mevcut 4 + parmak izi, yörünge, süt oluşumu, dağ-kazık (78:7), yağmur döngüsü, arı navigation, karınca iletişimi, atom-zerre (Zilzâl 99:7), rüzgâr-döllenme (Hicr 15:22), dumansal gök (Fussilet 41:11), yıldız-yol (Nahl 16:16), gece-koza sarma (Zümer 39:5), Alaka embriyo detayı (leech + mudgha + izam).
- Her karta **"7. yy. Arabistan bilgi seviyesi ↔ modern keşif yılı" split visual** — Sünnetullah'ın "sünnet ↔ tarih paraleli" pattern'ının bilim eşdeğeri.
- **Discovery Timeline SVG** — X ekseni 570-2020 CE, ayetlerin işaret ettiği keşif yılları noktalanmış (1929 Hubble, 1957 Lyman iron, 1960s berzah, 20th c. embryo…).
- **Bucaillism carşı-ayna widget** — "iddia ↔ metnin dilbilimsel sınırı" 2-kolonu; hangi ayet doğrudan, hangi ayet metaphorik.
- **Domain icon sistemi** — astrofizik/oşinografi/embriyoloji/geoloji/biyoloji için ayrı SVG mode-icon (mevcut 4 tab icon var, 20 karta genişlet).
- Klasik müfessirlerin bu ayetleri **1.400 yıl önce nasıl okuduğu** için "Klasik ↔ Modern okuma" iki sütun (Râzî/İbn Kesir/Elmalılı quote paketi) — akademik derinlik.

---

### 18. Zaman Boyutları · `/arac/zaman-boyutlari`

**İçerik:** 7/10
**Görsel:** 7/10

**Mevcut Durum:**
Component (`ZamanBoyutlari.jsx`, 1.532 satır) inline verili: 6 timeline noktası (Kadr 97:3 → Musa 40 gece → Ashâb-ı Kehf 300/309 → 6 kozmik evre → 1 gün 1000 yıl → 50.000 yıl gün), 5 tab (Zaman Ölçeği · Dil Katmanı · Felsefe · Karşılaştırma · Kaynaklar), Meâric 50.000 vs Einstein karşılaştırması, LANG_CARDS (geçmiş/şimdi/gelecek) ve Ashâb-ı Kehf takvim örtüşmesi widget'ı. Hero premium (Hac 22:47), disclaimer disiplini iyi ("Kur'an'ın bilimsel iddiası değildir"). Ancak 6 kart aynı gold tonda, gerçek görselleştirme (**logaritmik zaman ekseni**) sadece `logValue` alanına gömülü — ekrana çıkmıyor; tab bar `top: 0` (110px değil — §13.19 ihlali), fizik-kıyas görselleri yok.

**10/10 Yol Haritası:**
- **Interactive log-scale timeline** — X ekseni 10⁰ → 10⁵ yıl arası, 6 nokta üzerine bindirilmiş (Kadr → 40 gün → 300/309 yıl → 6 evre → 1000 yıl → 50.000 yıl); mouse-hover tooltip.
- **"Bir gece 1000 aydan hayırlı"** için özel görsel: 1 küçük gold nokta ↔ 1000 küçük silver nokta (density map — anlam yoğunluğu vs saat sayısı).
- **Fussilet 41:9-12 "2+4+2=6"** için matematiksel çözüm widget'ı — cumulative reading vs additive reading iki paralel çizim.
- **Gravitational time dilation** için Einstein-quote + basit spacetime bükülme SVG (informative disclaimer'la — Bucaillism'e kaçmadan).
- Kadr/Meâric/Musa/Ashâb-ı Kehf için **4 unique mode-icon** (crescent-night, mountain-tur, cave-sleeper, angel-ascent).
- Sticky tab bar `top: 110px` (Melekler pattern), OPAK background — §13.19 fix.
- Klasik tefsir quote paketi (Gazâlî, İbn Kesir, Râzî) ayrı bir Sources tabında değil, her karta inline callout — `SourcesCitation` ile paralel.

---

### 19. Melekler · `/arac/melekler`

**İçerik:** 9/10
**Görsel:** 8/10

**Mevcut Durum:**
En zengin sayfalardan. `melekler.json` (641 satır, ~11 melek + 8 görev + 3 kıssa + dilbilim + kaynaklar) + component (1.385 satır) 6 tab (Melekler · Görevler · Kıssalar · Kur'an/Hadis · Dilbilim · Kaynaklar). Kategori renk sistemi (vahiy/yardım/azap/koruyucu/kayıt/yüceltme/gizemli), **HadisBadge + HapaxBadge + QuranicBadge + HadithGradeBadge (mütefekkun-aleyh/sahih/hasen/tartışmalı)** — sitedeki en disiplinli kaynak tasnifi. HeroStats 6 stat card (2 isim, 19 bekçi, 4 kanat, ~90 ayet…) tooltip'li Arapça referanslı. Ash'ari/Maturidi/Mu'tazila/Fârâbî 4-görüş dispatcher ve Said Nursi bölümü akademik kalite. Hero Fâtır 35:1 anchor'ı foundational. Kategoriler için icon yok (Sünnetullah'ın `LAW_ICONS` eşdeğeri eksik), kanat sistemi görsel değil.

**10/10 Yol Haritası:**
- **7 melek kategorisi için mode-icon SVG** (vahiy=kalem+ışık, yardım=el, azap=alev, koruyucu=kalkan, kayıt=parşömen, yüceltme=çember, gizemli=soru) — Sünnetullah `LAW_ICONS` paritesi.
- **Fâtır 35:1 "2/3/4 kanat"** için görsel yorum: 3 melek silueti farklı kanat sayısıyla (SVG, minimal — hadis-figuratif değil).
- **Kur'an ↔ Hadis kaynak grafiği** — her isim için bar veya venn: "sadece Kur'an" · "sadece hadis" · "her ikisi" (Azrail/Rıdvan/Münker-Nekir sadece hadis, Cebrail/Mikail/Malik hem, Zebani sadece Kur'an).
- **19 bekçi meselesi** için özel widget — Müddessir 74:30-31 tam ayet + 19'un matematiksel yorumları (Reşad Halife tartışması eleştirel çerçeveyle).
- Hero'ya subtle **Islamic 8-pointed star pattern** (görevmüzikal olarak 8 kategori).
- Her melek kartında **primary + alternate name** için "isim halkası" (Cebrail için Ruhul Kudüs/Ruhul Emin/er-Ruh 4-daire).
- `CrossToolCTA` zaten var, `SourcesCitation` eklenebilir (hadis grade breakdown için ayrı callout).

---

### 20. Kıyâmet Sahneleri · `/arac/kiyamet`

**İçerik:** 9/10
**Görsel:** 7/10

**Mevcut Durum:**
`kiyamet-sahneleri.json` (816 satır, 26 sahne + 12 sûre densityScore'lu) + component (1.263 satır) 6 tab (Kronoloji · Sûreler · Kozmik Sahneler · Hesap/Mizan · Kur'an vs Hadis · Kaynaklar). 7 faz sistemli kronoloji (Kozmik Yıkım → Diriliş → Toplanma → Hesap → Kitap → Mizan → Cennet/Cehennem), her sahne için Arapça + tercüme + linguisticNote (küvvirat/inkaderat/süccirat/infatarat kök analizi). 14 kıyamet ismi grid (Kıyame/Saa/Hakka/Karia/Tammetü'l-Kübra/Sahha…) + Eşrât-ı Sâat 3 halka callout (küçük/orta/büyük alâmetler) + Tekvir 13 "izâ" scene listesi + dağ tablosu (6 farklı imge) + hapax words + Sırat köprüsü "Kur'an'da geçmez" disclaimer. Hero İbrahim 14:48 anchor cinematic. **Sticky tab bar `top: 0`** (§13.19 ihlali — transparent bg). Timeline sadece text listesi — **kronolojik akış görselleştirilmemiş**.

**10/10 Yol Haritası:**
- **7-fazlı vertical timeline SVG** — her faz ayrı renk (PHASE_COLORS zaten tanımlı), sahneler faz halkasına asılı; scroll ile senkron animasyon.
- **12 sûre için density heatmap** — Zümer/Hakka/Vakıa/Kıyame/Naziat/Müddessir/Karia/Nebe/Meâric/Tekvir/İnfitar/İnşikâk grid'i, densityScore 1-5 gold intensity ile.
- **Sûr-üfleme dual timeline** — 1. üfleme (Zümer 39:68) → 2. üfleme (Yasin 36:51) arası bir "sessizlik" bar'ı; klasik tefsir tartışması (40 yıl mı, 40 gün mü?) inline.
- **Dağ tablosu widget** — 6 farklı Arapça fiil (suyyirat/fuddat/yansifuha/menfuş/mahil) yan yana grid + kök analizi mode-icon'la.
- **13 "izâ" cinematic list** için scroll-triggered reveal (framer-motion) — sıralı karanlıklaşan sahneler.
- Tab bar §13.19 fix: `top: 110px`, `background: rgb(6, 8, 14)`, `backdropFilter` kaldır.
- **Kıyamet isimleri "anlam radar"** — 14 isim, her biri farklı bir boyut vurguluyor (kaçınılmazlık/darbe/aldanış/pişmanlık…), radar chart veya word cloud gold intensity ile.

---

### 21. Cennet & Cehennem · `/arac/cennet-cehennem`

**İçerik:** 8/10
**Görsel:** 7/10

**Mevcut Durum:**
`cennet-cehennem.json` (680 satır, 9 cennet + 7 cehennem + 4 içecek + 3 cennet-bitkisi + hür/vildan/rıdvan + 8 cennet niteliği + 3 cehennem bitkisi + 5 duyu-cehennem-negatif + A'râf + kaynaklar) + component (1.418 satır) 6 tab (İsimler · Cennet · Cehennem · A'râf · Rahman Simetrisi · Kaynaklar). En güzel özelliği **Rahman Simetrisi tab'ı** (55. sûrede 31 tekrar "hangi nimeti yalanlıyorsunuz" — cennet/cehennem dilinin paralel yapısı) + A'râf "yer mi sûre mi" tartışması + illiyyun/siccin karşıtlığı + 31 refrain analizi. Hero Rahman 55:46 anchor cinematic, HeroBanner stat panel var. Ancak isimler basit grid kartlar; **7 cehennem katmanı için hiyerarşi görsel yok** (cahim/haviye/hutame/leza/sair/sakar), 9 cennet için de yükselen katman şeması yok. Duyu-based cehennem karşılaştırması (görüntü/işitme/tatma/koku/dokunma) sadece text listesi.

**10/10 Yol Haritası:**
- **9 cennet katmanı yükselen halka SVG** — Firdevs merkez, Adn/Naîm/Mev'a/Selâm/Huld/Mükâm-Emîn/İlliyyûn dış halkalar; klasik "cennet 8 kapı" hiyerarşisi görselleştir.
- **7 cehennem çember diagramı** — Cahim/Haviye/Hutame/Leza/Sair/Sakar/Cehennem inen 7 daire; her biri farklı kelime kökü + tefsir yorumu tooltip.
- **Rahman 31-refrain görselleştirmesi** — dikey bar chart, 31 tekrar noktasında ayet numarası + tekrar temması (nimet/oluş/nihayet); Kur'an'ın en güçlü ring composition'larından biri.
- **Duyu-based cehennem vs cennet karşılaştırma grid'i** — 5 duyu ekseni (görüntü/işitme/tatma/koku/dokunma), her satırda cennet-versiyonu ↔ cehennem-versiyonu (misk ↔ zakkum kokusu, tesnîm ↔ hamîm tatma, hûrî ↔ ateş dokunuş).
- **A'râf perdesi SVG** — cennet halkası ↔ A'râf yatay çubuğu ↔ cehennem halkası, "A'râf ehli" konumu (37:44-46) görsel taşıyıcısı.
- **İlliyyun ↔ Siccin karşıtlığı** için split view (Mutaffifîn 83:7-21 tam ayet paketi) — kitabu'l-fuccâr ↔ kitabu'l-ebrâr dilbilimsel karşıtlığı.
- Hero'ya iki-yönlü ambient glow (yeşil sol/portakal sağ) — "iki dil, iki son" görsel taşıyıcısı.

---

## Öncelik Matrisi — Nereden Başlamalı?

Toplam skora ve visual impact potansiyeline göre 4 dalga önerisi:

### 🔴 Dalga 1 — Kritik Boşluklar (yakın vadeli, en yüksek ROI)
Bu 3 sayfa **wrapper-only** veya çok ince içerikli — mevcut durumda 10.5-13 arası toplam skora sahip. Sünnetullah standardına göre ölçülü değiller.

1. **Tarihsel Kanıtlar** (10.5) — Dedicated JSON yaz, 3 → 10 kanıta çıkar, 3-4 tab kur.
2. **Bilimsel İşaretler** (12) — Dedicated JSON yaz, 4 → 20 karta çıkar, Discovery Timeline widget.
3. **Retorik Sorular** (13) — Belağat aileleri tab'ları (istifhâm dışında 5 aile), iltifât widget, kaynak grid.

### 🟡 Dalga 2 — Yapısal Genişletme (orta vadeli)
Bu 5 sayfa içerik zengin ama tab yapısı, formula widget, scholar grid gibi görsel altyapı eksik.

4. **Dua Dili** (14) — 6 → 10 peygamber, "Dua Anatomisi" widget, cevap kalıpları grid.
5. **Kur'an'da İnsan** (14.5) — Long-scroll → 4-5 tab, ScholarViews grid, "İnsan denklemi" formula.
6. **Nefs Mertebeleri** (13.5) — 3-4 tab yapısı, karşılaştırma matrisi, 3 anahtar ayet grid.
7. **Zaman Boyutları** (14) — Log-scale timeline, Fussilet formula widget, mode-icon (4 sahne).
8. **Cennet & Cehennem** (15) — 9 cennet + 7 cehennem katman SVG, Rahman refrain viz, duyu grid.

### 🟢 Dalga 3 — Polish + Widget'lar (uzun vadeli, existing zenginlik üzerine)
Bu 8 sayfa güçlü ama mode-icon sistemi, comparison widget, Islamic geometric pattern gibi cross-cutting eksikleri var.

9. **Kavimler Atlası** (15.5) — Mode-icon set, hero pattern, KavimComparisonGrid parity.
10. **İnsan Psikolojisi** (15.5) — Scholar grid, modern parallel derinleştir, Yusuf arc.
11. **İblis / Şeytan** (15) — İnline data → JSON, vesvese tab, 12 hile widget, 3-4 tab.
12. **Doğa Atlası** (16) — Mode-icon per kart, frequency bar chart, hapax alfabesi.
13. **Ses Mimarisi** (16) — Fonetik spektrum, 6-8 ek çift, ses haritası tab.
14. **Kıyamet Sahneleri** (16) — 7-fazlı vertical timeline SVG, density heatmap, §13.19 tab bar fix.
15. **İmkansız Ritim** (17) — 16 vezin widget, Rahmân refrain, akademik kaynaklar.
16. **Halka Kompozisyon** (17) — Ek 3-4 halka örneği, Cuypers/Farrin, Fatiha SVG halka.

### ⭐ Dalga 4 — Zaten 9/10 Bar'ında (marjinal iyileştirme)
Bu 5 sayfa zaten üst seviye. İnce widget eklemeleri ile 10/10'a çıkarılır.

17. **Melekler** (17) — 7 kategori mode-icon, kanat SVG, hadis breakdown.
18. **Kur'an'ın Yeminleri** (17) — Kozmoloji widget, tahaddi tab, klasik kaynak genişletme.
19. **İlk & Son Kelimeler** (17) — İlk↔Son eşleşme viz, kök heatmap, sûre grupları tab.
20. **Dualar (DuaVerses)** (17) — 50 → 80+ dua, sûre-index heatmap, ibadet-context tab.
21. **Kur'an'ın Renkleri** (18) — Interaktif palet widget, ek 4-6 renk, Rahmân palet-run.

---

## Zorluk vs Etki Matrisi

Her yol haritası maddesi yaklaşık effort/impact skoru:

| Effort | Impact | Örnek Aksiyonlar |
|---|---|---|
| **Düşük · Yüksek** | 🟢 Öncelik #1 | Islamic geometric pattern hero'ya ekle · Mode-icon SVG'leri · §13.19 tab bar fix |
| **Orta · Yüksek** | 🟡 Öncelik #2 | ScholarViews grid · FormulaBox widget · Bar chart / heatmap · Tab yapısı |
| **Yüksek · Yüksek** | 🟠 Sprint | Yeni JSON üretimi · Multi-tab component refactor · Compare widget · Timeline SVG |
| **Yüksek · Orta** | 🔵 Sonra | Section → Standalone tool refactor · Akademik derinleştirme (Cuypers, Neuwirth) |

---

## Öneri: İlk 3 Aksiyon (Fastest ROI)

1. **Cross-cutting hero pattern uygulaması** — Sünnetullah'taki `sunnet-geometric` SVG pattern'ı reusable component'a çıkar (`HeroGeometricBackground`); 21 sayfaya import ederek 15 dakikada `+0.5 görsel` skoru.
2. **Tarihsel Kanıtlar dedicated JSON + 10 kart** — En zayıf sayfa (10.5 → 16+). Bu tek sayfa iyileştirmesi %55 skor artışı sağlar.
3. **Bilimsel İşaretler dedicated JSON + Discovery Timeline** — 2. en zayıf sayfa (12 → 17+). Doğa Atlas ile paralel yapı zaten hazır, JSON'u genişletmek yeterli.

Bu 3 aksiyon toplamda ~%15 site geneli skor iyileştirmesi sağlar ve tüm sayfalar arasında **konsistan görsel dil** kurar.

---

_Denetim tarihi: 2026-07-06 · Denetleyen: 3 paralel general-purpose agent (parallel review), consolidation: main agent._
_Referans standart: `SunnetullahAtlasi` (9b564b1) + `MunafikProfili` (d2877cc)._
