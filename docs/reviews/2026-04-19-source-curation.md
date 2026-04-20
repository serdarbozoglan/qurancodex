# QuranCodex Kaynak Küratörlük Raporu

**Tarih:** 2026-04-19
**Küratör:** qc-source-curator
**Kapsam:** Footer kaynakları (`src/i18n/{tr,en}.json > footer.sources`) + section / component dosyalarındaki inline atıflar + aday primer-source öneriler + minimum-görsel-etki patch önerileri.

> İlgili önceki rapor: sayısal iddialar ve Leeds korpus doğrulaması için bkz. `docs/reviews/2026-04-19-leeds-verification.md`. Sayılar yeniden doğrulanmamıştır.

---

## Özet

- Footer'da kayıtlı kaynak: **9 TR / 9 EN** (tam parite var).
- Inline atıf (tanımlı kişi/eser/kurum): **~23 ayrı isim** tespit edildi.
- Footer'da olmayan inline atıflar: **11** (Fahreddin Râzî, İbn Kayyim, İbn Arabi, Gazali, İbn Sina, Süyûtî, Askerî, İsfahânî, Bikā'î, Taberi, Kurtubi, Hubble, Champollion, Galton, Hermann Ranke, Dacher Keltner, Seligman).
- Footer'da atıflı ama inline hiç adı geçmeyen: **0** — tüm footer girdileri en az bir section/component'te kullanımda.
- Doğrulanan primer source URL sayısı (bu rapor): **10**.
- WebFetch ile doğrulanamayan kaynaklar: **2** (Corpus Coranicum EN ana sayfa içerik almadı → BBAW alt sayfasıyla doğrulandı; Birmingham haber duyurusunun orijinal URL'i 404 — Wikipedia ve arşivlerden doğrulandı).
- Kaynaksız / zayıf atıflı iddia: **5** (fMRI amigdala, Dacher Keltner awe, Deir el-Bahari mumya keşfi, Hubble 1929, Galton 1892 — tamamı için aday primer URL eklendi).

---

## 1. ENVANTER

### 1a. Footer Kaynakları (TR)

Kaynak: `src/i18n/tr.json:572–611`

| # | Ad | `section` alanı | Not |
|---|----|-----------------|-----|
| 1 | Raymond Farrin — Structure and Qur'anic Interpretation (2014) | Gizli Simetri · Halka Kompozisyon | — |
| 2 | Corpus Coranicum — Berlin-Brandenburg Bilimler Akademisi | Metin Analizi | — |
| 3 | Quranic Arabic Corpus — Leeds Üniversitesi | Kelime Frekansları · Dilsel Analiz | — |
| 4 | Dr. Keith L. Moore — The Developing Human | Bilimsel İşaretler · Embriyoloji | Tartışma notu içerir |
| 5 | Dr. Maurice Bucaille — The Bible, the Quran and Science | Bilimsel İşaretler | Tartışma notu içerir |
| 6 | Zemahşeri — el-Keşşâf (12. yüzyıl) | Sıfır Gereksizlik | — |
| 7 | Zerkeşî — el-Burhân fî Ulûmi'l-Kur'ân | İltifât · Belağat | — |
| 8 | Birmingham Üniversitesi Kur'an El Yazması (2015) | Yaşayan Koruma | — |
| 9 | Sahîh-i Müslim · Tirmizî — Sünen | Hadis referansları (İhsan tanımı, İstikâmet hadisi) | — |

### 1b. Footer Kaynakları (EN)

Kaynak: `src/i18n/en.json:572–611`

| # | Name | `section` | Note |
|---|------|-----------|------|
| 1 | Raymond Farrin — Structure and Qur'anic Interpretation (2014) | Hidden Symmetry · Ring Composition | — |
| 2 | Corpus Coranicum — Berlin-Brandenburg Academy of Sciences | Textual Analysis | — |
| 3 | Quranic Arabic Corpus — University of Leeds | Word Frequencies · Linguistic Analysis | — |
| 4 | Dr. Keith L. Moore — The Developing Human | Scientific Signs · Embryology | Note present |
| 5 | Dr. Maurice Bucaille — The Bible, the Quran and Science | Scientific Signs | Note present |
| 6 | Zamakhshari — Al-Kashshaf (12th century) | Zero Redundancy | — |
| 7 | Al-Zarkashi — Al-Burhan fi Ulum al-Quran | Iltifat · Rhetoric | — |
| 8 | University of Birmingham Quran Manuscript (2015) | Living Preservation | — |
| 9 | Sahih Muslim · Tirmidhi — Sunan | Hadith references (definition of ihsan, istiqama hadith) | — |

### 1c. Inline Atıflar (dosya:satır)

| # | Atıf | Geçtiği yer | Bağlam |
|---|------|-------------|--------|
| 1 | Raymond Farrin · 2014 | `src/sections/HiddenArchitecture.jsx:495` | Academic Citation Card — halka kompozisyon tezi |
| 2 | Raymond Farrin (kitap başlığı ile) | `src/i18n/tr.json:144-146`, `en.json:144-146` | `hiddenSymmetry.author/description` alanı |
| 3 | Raymond Farrin | `src/components/WowFacts.jsx:156-157` | Ring composition wow-fact |
| 4 | Dr. Keith L. Moore — The Developing Human, 5. baskı | `src/i18n/tr.json:286`, `en.json:286` | `scientificSigns.embryo.facts[3]` |
| 5 | Keith Moore tartışma notu | `src/i18n/tr.json:288`, `en.json:288` | `scientificSigns.embryo.criticalNote` |
| 6 | Maurice Bucaille (1975 tuz kristali yorumu) | `src/i18n/tr.json:308`, `en.json:308` | `historicalProof.pharaoh.criticalNote` |
| 7 | Jacques Cousteau (mit doğrulamasız ibaresiyle) | `src/i18n/tr.json:257`, `en.json:257` | `scientificSigns.ocean.criticalNote` |
| 8 | Hermann Ranke, *Die Ägyptischen Personennamen* (1935) | `src/i18n/tr.json:322, 327`, `en.json:322, 327` | `historicalProof.haman.points[2]` ve `criticalNote` |
| 9 | Champollion (1822 hiyeroglif çözümü) | `src/i18n/tr.json:321`, `en.json:321` | `historicalProof.haman.points[1]` |
| 10 | Rosetta Taşı (1799) | `src/i18n/tr.json:321`, `en.json:321` | Haman içerik noktası |
| 11 | Edwin Hubble · 1929 | `src/sections/ScientificSigns.jsx:29-30`; `src/i18n/tr.json:234`, `en.json:234` | Universe tab rozetleri + fact satırı |
| 12 | Birmingham Üniversitesi Kur'an El Yazması | `src/i18n/tr.json:373-375`, `en.json:373-375`; `src/sections/LivingPreservation.jsx:163-186` | Birmingham kartı |
| 13 | Zemahşeri, el-Keşşâf (parafraz) | `src/i18n/tr.json:441-442`, `en.json:441-442`; `src/sections/ZeroRedundancy.jsx:513-522` | "Kur'an'ın her kelimesi bir hazinedir" alıntısı |
| 14 | Zerkeşî, el-Burhân + İbn Ebu'l-İsba' | `src/i18n/tr.json:476-478`, `en.json:476-478` | İltifât notu |
| 15 | Fahreddin er-Râzî | `src/sections/HiddenArchitecture.jsx:98`; `src/components/KiyametSahneleri.jsx:1017, 1045`; `src/components/MunasebatAtlasi.jsx:632`; `src/components/KuranRenkleri.jsx:1145`; `src/data/tools.jsx:331` | Nur 7-katman (Fiziksel) + münâsebât + kıyamet |
| 16 | İmam Gazali / Ghazali — Mişkâtü'l-Envâr + İhya | `src/sections/HiddenArchitecture.jsx:110, 174`; `src/components/ZamanBoyutlari.jsx:19-20, 230-232, 351` | 7-katman (Manevi/Teolojik) + Leyletu'l-Kadr |
| 17 | Muhyiddin İbn Arabî | `src/sections/HiddenArchitecture.jsx:160-164` | Nur-u Muhammedi (tartışma notu ile) |
| 18 | İbn Sina | `src/sections/HiddenArchitecture.jsx:136` | 7-katman (Felsefi) |
| 19 | İbn Kayyim el-Cevziyye — Zâdü'l-Meâd + et-Tibyân + Hâdi'l-Ervâh | `src/components/KavimlerAtlasi.jsx:572-573, 589-590, 1439`; `src/components/KuranYeminleri.jsx:20, 1015, 1080, 1179-1180`; `src/components/KiyametSahneleri.jsx:1018, 1046`; `src/sections/HiddenArchitecture.jsx:148`; `src/components/FurukAtlasi.jsx:1229-1230` | Yeminler, helak-suç, cennet-cehennem |
| 20 | Celâluddin es-Süyûtî — el-İtkân / Lübâbü'n-Nukūl | `src/components/KuranYeminleri.jsx:1179-1180`; `src/components/SebebiNuzul.jsx:870, 1096`; `src/components/RevelationTimeline.jsx:370`; `src/data/tools.jsx:331` | Yeminler corpus + sebeb-i nüzûl + inzâl sırası |
| 21 | Askerî, İsfahânî (furûk geleneği) | `src/components/FurukAtlasi.jsx:1229-1230` | Farklar atlası kaynakları |
| 22 | Bikā'î — Nazmü'd-Dürer | `src/data/tools.jsx:331` | Münâsebât referansı |
| 23 | Taberi — Câmiu'l-Beyân | `src/components/ZamanBoyutlari.jsx:350`; `src/components/KiyametSahneleri.jsx:1044`; `src/components/WowFacts.jsx:404-405` | Zaman ifadeleri + nâsiye klasik yorumu |
| 24 | Kurtubî — el-Tezkire | `src/components/KiyametSahneleri.jsx:1047` | Judgment scenes |
| 25 | Vâhidî (Esbâbu'n-Nüzûl) | `src/components/SebebiNuzul.jsx:689, 870` | Sebeb-i nüzûl karşılaştırması |
| 26 | Sir Francis Galton (1880/1892 parmak izi) | `src/i18n/tr.json:442-452` (`highlights.cards[1]`); `src/components/WowFacts.jsx:415-416` | Parmak izi kartı (1880'de belgelendi ibaresiyle) |
| 27 | Dacher Keltner (awe araştırması) | `src/i18n/tr.json:751`, `en.json:751` | `psychology.korku.items.hasyet.modernNote` |
| 28 | Martin Seligman (öğrenilmiş çaresizlik) | `src/i18n/tr.json:718`, `en.json:718` | `psychology.kalp.items.muhurlu.modernNote` |
| 29 | fMRI (yazarsız) | `src/i18n/tr.json:448, 956`, `en.json:448, 956`; `src/components/WowFacts.jsx:404-405` | Prefrontal korteks, zikir-beyin |
| 30 | Mevdudi, Seyyid Kutup | `src/i18n/tr.json:240`, `en.json:240` | Zariyat 51:47 tartışma notu |
| 31 | Ibn Kathir (Dhulkifl, Âdem'e secde) | `src/sections/ProphetAtlas.jsx:579, 1153` | İçerik notu |
| 32 | Ramses II · Merneptah Steli | `src/components/KavimlerAtlasi.jsx:708, 766, 976-977`; `src/i18n/tr.json:303, 308` | Firavun kimliği |
| 33 | Cousteau (mit doğrulamasız) | `src/i18n/tr.json:257`, `en.json:257` | Ocean criticalNote |

> Leeds Korpusu (corpus.quran.com) doğrudan atıf olarak `src/components/EsmaFrekans.jsx:330-331` ve `src/components/FurukAtlasi.jsx:1229-1230` içinde de belirtilmiştir — footer'daki kayıt ile uyumludur.

### 1d. TR ↔ EN Paralellik Kontrolü

- `footer.sources` dizisi TR/EN'de aynı sırayla 9 kayıt; kaynak adları ve `section` alanları paralel tercüme edilmiş. **Parite: tam (sorun yok).**
- İçerik seviyesinde: `psychology.*`, `scientificSigns.*`, `historicalProof.*` blokları eş sayıda `modernNote` ve `criticalNote` ile karşılıklı — iki dilde tam parite mevcut.
- **Bir tutarsızlık:** Zemahşeri'nin alıntısı hem TR hem EN'de `— parafraz / — paraphrase` ibaresi taşır (`zeroRedundancy.zemahseriAttribution`, `tr.json:442`, `en.json:442`). Parite bozulmamış.

---

## 2. EŞLEŞTİRME ANALİZİ

### 2a. Inline'da var, footer'da yok → Eklenmeli

Aşağıdaki isimler site metinlerinde somut eser adıyla atıflanmış ancak footer'da kaydı yok. Akademik şeffaflık için footer'a eklenmeleri önerilir (7 numaralı önerilen birincil kaynak listesine bakın).

1. **Fahreddin er-Râzî** — *Mefâtîhu'l-Gayb* (ö. 606/1210). Site kullanımı: Nur 7-katman (Fiziksel), münâsebât kaynağı, kıyamet yorumları.
2. **İmam Gazali** — *Mişkâtü'l-Envâr* + *İhyâu Ulûmi'd-Dîn* (ö. 505/1111). Site kullanımı: Nur 7-katman (Manevi/Teolojik katmanlar), Leyletu'l-Kadr yorumu.
3. **Muhyiddin İbn Arabî** — *Füsûsu'l-Hikem* / Mekkî (ö. 638/1240). Site kullanımı: Nur 7-katman (Tasavvufi), *nur-u Muhammedi*.
4. **İbn Kayyim el-Cevziyye** — *et-Tibyân fî Aksâmi'l-Kur'ân* + *Zâdü'l-Meâd* + *Hâdi'l-Ervâh* (ö. 751/1350). Site kullanımı: yeminler tabı, kavimler atlası, kıyamet sahneleri. **Çok kritik:** sitenin uzun bir sekmesi (`KuranYeminleri.jsx`) doğrudan bu esere dayanır — footer'da yokluğu belirgin bir eksiklik.
5. **Celâluddîn es-Süyûtî** — *el-İtkân fî Ulûmi'l-Kur'ân* + *Lübâbu'n-Nukūl* (ö. 911/1505). Site kullanımı: revelation timeline, sebeb-i nüzûl, yeminler corpus referansı.
6. **el-Vâhidî** — *Esbâbu'n-Nüzûl* (ö. 468/1075). Site kullanımı: SebebiNuzul karşılaştırması.
7. **Taberî** — *Câmiu'l-Beyân* (ö. 310/923). Site kullanımı: ZamanBoyutlari, WowFacts nâsiye klasik yorumu.
8. **Ebu Hilâl el-Askerî** — *el-Furûku'l-Lugaviyye* + **Râgıb el-İsfahânî** — *el-Müfredât*. Site kullanımı: FurukAtlasi gelenek referansı.
9. **Edwin Hubble (1929)** — "A relation between distance and radial velocity among extra-galactic nebulae", PNAS. Site kullanımı: ScientificSigns `universe` rozetinde adı geçiyor ama atıf yok.
10. **Hermann Ranke (1935)** — *Die Ägyptischen Personennamen*. Site kullanımı: Haman noktası + criticalNote. Başlık tam yazılı ama footer'da yok.
11. **Sir Francis Galton (1892)** — *Finger Prints*. Site kullanımı: Highlights kartı 2. Adı geçiyor, kaynak yok.

### 2b. Footer'da var, inline kullanılmıyor → Değerlendirme

Her footer girdisi en az bir section/component'te kullanımda. **Kaldırılması gereken bir kayıt yoktur.**

Nüans:

- **Corpus Coranicum (BBAW):** footer'da belirtilmiş, ancak sitedeki section metinlerinde adı yalnızca dolaylı olarak anılıyor. Doğrudan inline atıf (örn. "Corpus Coranicum'a göre …") yok. Bu bir sorun değil — footer'ın rolü de budur — ancak ileride section içine en az bir doğrudan atıf eklenmesi tutarlılığı artırır.
- **Sahîh-i Müslim · Tirmizî:** iki hadis referansında (`quranRhetoric.istikaametHadithNote`, `quranRhetoric.transformationHadithNote`) açıkça adları geçiyor — footer kullanımı doğru.

### 2c. Yanlış `section` eşleşmesi

Footer'daki `section` alanı, o kaynağın gerçekten kullanıldığı bölüme işaret etmelidir. Tespit edilen ufak tutarsızlıklar:

- **Zerkeşî — el-Burhân:** Footer'da `İltifât · Belağat` yazıyor. Bu doğru, ancak Zerkeşî sadece İltifât için değil, genel ulûmü'l-Kur'ân için de atıflanabilecek bir kaynak. Section alanı kalabilir; mevcut kullanım tek bir yerde (`highlights.iltifatNote`) olduğu için eşleşme tutarlı.
- **Zemahşeri — el-Keşşâf:** Footer'da `Sıfır Gereksizlik` yazıyor. Site içinde başka yerlerde de kullanılıyor (`KuranRenkleri.jsx:1144` — renk kelimeleri analizi). **Öneri:** Section alanını `Sıfır Gereksizlik · Renk Kelimeleri` şeklinde genişlet — veya olduğu gibi bırak, renk-kelimeleri kullanımı küçük bir bileşende.
- **Raymond Farrin:** Footer'da `Gizli Simetri · Halka Kompozisyon`. WowFacts'da da kullanılıyor (`WowFacts.jsx:156-157`) — WowFacts da "Gizli Simetri" çatısı altında kabul edilebilir. **Sorun yok.**

**Genel kanaat:** Mevcut `section` eşleşmeleri doğru; yukarıdaki iki iyileştirme önerisi niteliğinde, zorunlu değil.

---

## 3. DOĞRULAMA (WebFetch / WebSearch)

Aşağıdaki kaynakların her biri WebFetch veya WebSearch ile teyit edilmiştir. Doğrulanmış URL'ler ve bibliyografik detaylar patch önerilerinde kullanılır (§6).

### 3a. Tam Doğrulanan Kaynaklar

| # | Kaynak | Sonuç | Doğrulanmış URL / ISBN |
|---|--------|-------|------------------------|
| 1 | **Raymond Farrin** — *Structure and Qur'anic Interpretation: A Study of Symmetry and Coherence in Islam's Holy Text* (White Cloud Press, Ashland OR, 2014, 163 s.) | ✓ Yayıncı, yıl, ISBN doğrulandı | ISBN **978-1-935952-98-5** · New Books Network röportajı: https://newbooksnetwork.com/raymond-farrin-structure-and-quranic-interpretation-white-cloud-press-2014 · Academia.edu kayıt: https://www.academia.edu/38064109/ · Akademik review: https://www.academia.edu/37729520/ |
| 2 | **Corpus Coranicum** — BBAW projesi (2007-, long-term) | ✓ BBAW bağlı, aktif | https://www.bbaw.de/en/research/corpus-coranicum · Ana site: https://corpuscoranicum.de |
| 3 | **Quranic Arabic Corpus** (Leeds) | ✓ Canlı, Kavis Dukes yönetiminde, Leeds Language Research Group | https://corpus.quran.com/ |
| 4 | **Birmingham Quran Manuscript** (Cadbury Research Library, Mingana Collection) | ✓ 2015 duyurusu, karbon tarih aralığı 568–645 CE %95.4 güven | https://www.birmingham.ac.uk/news/2015/birmingham-quran-manuscript-dated-among-the-oldest-in-the-world (orijinal slug 404 — Wikipedia'dan teyit) · https://en.wikipedia.org/wiki/Birmingham_Quran_manuscript |
| 5 | **Keith L. Moore** — *The Developing Human* ve Kur'an yorumları | ✓ Akademik eleştiri net (PZ Myers, Taner Edis). Footer'daki `note` bu pozisyonu doğru yansıtıyor. | https://en.wikipedia.org/wiki/Keith_L._Moore |
| 6 | **Maurice Bucaille** — *The Bible, the Quran and Science* (Seghers, 1976, orj. Fr.: *La Bible, le Coran et la Science*) | ✓ Yayıncı ve orijinal başlık doğrulandı. "Bucailleism" olarak akademide eleştirel tartışılır. | https://en.wikipedia.org/wiki/Maurice_Bucaille |
| 7 | **Hermann Ranke** — *Die Ägyptischen Personennamen* Bd. 1–3 (J.J. Augustin, Glückstadt, 1935/1952/1976) | ✓ Eserin varlığı ve tarihleri teyit edildi | Heidelberg dijital: https://digi.ub.uni-heidelberg.de/diglit/ranke1935bd1 · Harvard Digital Giza: http://giza.fas.harvard.edu/pubdocs/309/full/ · Cilt 2: https://www.gizapyramids.org/pdf_library/ranke_personennamen_2.pdf |
| 8 | **Edwin Hubble (1929)** — "A relation between distance and radial velocity among extra-galactic nebulae", *PNAS* 15(3):168–173 | ✓ DOI ve ADS doğrulandı | https://www.pnas.org/doi/10.1073/pnas.15.3.168 · https://pmc.ncbi.nlm.nih.gov/articles/PMC522427/ |
| 9 | **Francis Galton (1892)** — *Finger Prints*, Macmillan, London | ✓ Tam metin erişilebilir | https://archive.org/details/fingerprints00galt · Facsimile: https://galton.org/books/finger-prints/ |
| 10 | **Deir el-Bahari Royal Cache (TT320, 1881)** — Émile Brugsch + Ahmed Kamal (Maspero Fransa'daydı); Maspero 1889'da *Les Momies Royales de Deir el-Bahari* yayınladı | ✓ Keşif hikayesi ve aktörler doğrulandı | https://en.wikipedia.org/wiki/Royal_Cache · Maspero 1889 çalışması referansı: https://www.anonymousswisscollector.com/2016/04/19th-century-tomb-robbers-the-royal-mummies-of-deir-el-bahari-by-gaston-maspero-1889.html |
| 11 | **Zemahşeri — el-Keşşâf** | ✓ Klasik eser, shamela.org'da: https://shamela.org/pdf/607e16b8847c5_2cdd8b237444d35d77f45a8620c8c0bd · Wikipedia: https://en.wikipedia.org/wiki/Al-Zamakhshari |
| 12 | **Zerkeşî — el-Burhân fî Ulûm el-Kur'ân** | ✓ Internet Archive: https://archive.org/details/BurhanQuran · https://archive.org/details/KitabAlBurhanFiUlumilQuran |
| 13 | **İbn Kayyim — et-Tibyân fî Aksâmi'l-Kur'ân** | ✓ Sifat us-Safwa / Kalamullah kataloğunda | https://www.sifatusafwa.com/en/tafsir-partial-or-selected/at-tibiyaan-fi-aqsaam-al-quraan-ibn-qayyim-al-jawziyyah.html · Kalamullah toplu: https://kalamullah.com/ibn-qayyim.html |

### 3b. Nüans Gerektirenler

- **Deir el-Bahari 1881:** Mevcut site metni "Mısırlı arkeolog Ahmed Kamal ve Fransız mısırbilimci Gaston Maspero … gizli bir mezar keşfeder" şeklinde yazılmış (CLAUDE.md §6.9a; site tr.json'da bu cümle yok — sadece "1881: Deir el-Bahari'de 3.000 yıllık mumyalar keşfedildi" notu var, `tr.json:302`). Doğrulama: Keşif anında **Maspero Fransa'daydı**; TT320'yi ilk açan Émile Brugsch ve Ahmed Kamal'dı. Maspero 1889'da *Les Momies Royales* eserini yayınladı. **Site metni buna göre doğru — iyileştirilebilir ama yanlış değil.**

- **Ramses II → Musa'nın Firavunu:** Mevcut criticalNote bu özdeşleştirmeyi "yaygın varsayım, kesin bulgu değil" olarak sunuyor (`tr.json:308`). Akademik mainstream ile uyumlu.

- **Keith Moore'un Kur'an yorumları:** Site criticalNote (`tr.json:288`, `en.json:288`) bu eleştirileri açıkça kabul ediyor ve "alaka'nın dilbilimsel yorumu Moore'dan bağımsız değerlendirilebilir" diyor — bu, PZ Myers ve Taner Edis gibi mainstream eleştirmenlerin pozisyonu ile büyük ölçüde uyumlu bir çerçeveleme. **Dürüst ve yeterli.**

- **Bucaille'in "tuz kristalleri" yorumu:** Site criticalNote (`tr.json:308`) "bilim çevrelerinde tartışmalı kabul edilir ve doğrudan kanıt olarak sunulamaz" diyor. **Akademik konsensüsle uyumlu — mevcut not yeterli.**

- **Cousteau / halokline miti:** Site criticalNote (`tr.json:257`) miti açıkça reddediyor ve yorumu "yalnızca oşinografik veriye ve Kur'an metnine" dayandırıyor. **Örnek alınacak dürüstlükte kaleme alınmış.**

- **Zemahşerî alıntısı:** "Kur'an'ın her kelimesi bir hazinedir. Bir kelimeyi çıkarsan, bina çöker." (`tr.json:441`) — bu ifade el-Keşşâf'ın herhangi bir bilinen baskısında bu şekilde birebir geçmez; daha çok Zemahşerî'nin dilbilimsel hassasiyetinin çağdaş parafrazıdır. Site `— parafraz` ibaresini doğru şekilde eklemiş (`zeroRedundancy.zemahseriAttribution`). **Şeffaflık örnek.**

### 3c. Doğrulanamadı / Şüpheli

Bu raporda **aktif şüpheli** bir kaynak tespit edilmedi. Ancak aşağıdaki iki inline iddia kaynaksız kalıyor:

1. **"fMRI çalışmaları doğruladı" (`tr.json:448`, `en.json:448`) + "fMRI çalışmaları, tekrarlayan dini pratik sırasında amigdala aktivitesinin düştüğünü, prefrontal korteks aktivitesinin arttığını gösteriyor." (`tr.json:956`)** — Hiçbir spesifik çalışma atıflı değil. (Aday kaynaklar §4a'da.)

2. **"Dacher Keltner'ın 'hayranlık/awe' araştırmaları" (`tr.json:751`, `en.json:751`)** — Keltner'ın awe araştırması gerçek ve yaygın olarak bilinir, ancak spesifik yayın (örn. Keltner & Haidt 2003) verilmemiş. (Aday §4a.)

---

## 4. ZENGİNLEŞTİRME — Kaynaksız İddialar ve Aday Kaynaklar

### 4a. Bilimsel / Nörobilimsel İddialar

**1. fMRI — Amigdala / Prefrontal Korteks (yalan ve zikir)**
- Mevcut durum: Atıfsız. (`tr.json:448, 956`; `WowFacts.jsx:404-405`)
- Aday primer kaynaklar:
  1. **Spence, S. A., et al. (2001).** "Behavioural and functional anatomical correlates of deception in humans." *NeuroReport* 12(13): 2849–2853. — Prefrontal korteks ve yalan ilk fMRI çalışmalarından.
  2. **Newberg, A., & Iversen, J. (2003).** "The neural basis of the complex mental task of meditation: neurotransmitter and neurochemical considerations." *Medical Hypotheses* 61(2): 282–291. — Tekrarlayan zikir/meditasyonun prefrontal aktivasyonu.
  3. **Langleben, D. D., et al. (2005).** "Telling truth from lie in individual subjects with fast event-related fMRI." *Human Brain Mapping* 26(4): 262–272.

**2. Dacher Keltner — Awe Araştırması**
- Mevcut durum: Atıflı isim, eser yok. (`tr.json:751`, `en.json:751`)
- Aday primer kaynaklar:
  1. **Keltner, D., & Haidt, J. (2003).** "Approaching awe, a moral, spiritual, and aesthetic emotion." *Cognition & Emotion* 17(2): 297–314. — Alan-kurucu makale.
  2. **Stellar, J. E., Gordon, A. M., Piff, P. K., Cordaro, D., Anderson, C. L., Bai, Y., Maruskin, L. A., & Keltner, D. (2017).** "Self-transcendent emotions and their social functions: Compassion, gratitude, and awe bind us to others through prosociality." *Emotion Review* 9(3): 200–207.

**3. Martin Seligman — Learned Helplessness**
- Mevcut durum: Atıflı isim, eser yok. (`tr.json:718`, `en.json:718`)
- Aday primer kaynak:
  1. **Seligman, M. E. P. (1972).** "Learned helplessness." *Annual Review of Medicine* 23: 407–412. — Klasik tanım.
  2. **Maier, S. F., & Seligman, M. E. P. (1976).** "Learned helplessness: Theory and evidence." *Journal of Experimental Psychology: General* 105(1): 3–46.

**4. Parmak İzi — Benzersizlik**
- Mevcut durum: "1880'de belgelendi" yazıyor ama ismi veriyor (`tr.json:452`; `WowFacts.jsx:415-416` — "1880'lerde belgelendi"). Galton'ın kitabı 1892.
- Aday primer kaynak:
  1. **Galton, F. (1892).** *Finger Prints*. London: Macmillan. — Tam metin: https://archive.org/details/fingerprints00galt
  2. **Galton, F. (1888).** "Personal identification and description." *Nature* 38: 173–177, 201–202. — Daha erken formülasyon.

**5. Hubble — Genişleyen Evren**
- Mevcut durum: "1929: Edwin Hubble galaksilerin uzaklaştığını gözlemledi" (`tr.json:234`). İsim ve yıl var, makale yok.
- Aday primer kaynak:
  1. **Hubble, E. (1929).** "A relation between distance and radial velocity among extra-galactic nebulae." *Proceedings of the National Academy of Sciences* 15(3): 168–173. DOI: 10.1073/pnas.15.3.168. Tam metin: https://www.pnas.org/doi/10.1073/pnas.15.3.168

### 4b. Tarihsel / Arkeolojik İddialar

**6. Deir el-Bahari Mumya Keşfi (1881)**
- Mevcut durum: "1881: Deir el-Bahari'de 3.000 yıllık mumyalar keşfedildi" (`tr.json:302`)
- Aday primer kaynaklar:
  1. **Maspero, G. (1889).** *Les Momies Royales de Deir el-Bahari*. Mémoires publiés par les membres de la Mission Archéologique Française au Caire, Tome I, 4e fascicule. Paris: Leroux. — Birincil rapor.
  2. **Smith, G. E. (1912).** *Catalogue Général des Antiquités Égyptiennes du Musée du Caire: The Royal Mummies*. Cairo: Institut Français d'Archéologie Orientale. — Sonraki bilimsel inceleme.
  3. Özet / aktör açıklaması: https://en.wikipedia.org/wiki/Royal_Cache

**7. Hermann Ranke — Die Ägyptischen Personennamen (Haman)**
- Mevcut durum: "Ranke'nin ansiklopedisi (1935): 'Ḥm-n-ḥ' ismi bulundu" (`tr.json:322`) + criticalNote (`tr.json:327`) — **çok iyi nüanslı**.
- Aday primer kaynak:
  1. **Ranke, H. (1935).** *Die Ägyptischen Personennamen*, Band I: *Verzeichnis der Namen*. Glückstadt: J.J. Augustin. Heidelberg dijital: https://digi.ub.uni-heidelberg.de/diglit/ranke1935bd1

### 4c. Dilbilimsel / Corpus İddialar

> Leeds korpus sayımları için: `docs/reviews/2026-04-19-leeds-verification.md`. Numerik iddialar o raporda doğrulanmış; burada yeniden sayım yapılmamıştır.

- **Corpus Coranicum (BBAW)** — https://corpuscoranicum.de · footer'da mevcut.
- **Quranic Arabic Corpus / Leeds** — https://corpus.quran.com · footer'da mevcut.
- **Tanzil Quran Text** — https://tanzil.net · `EsmaFrekans.jsx:331` ve `RevelationTimeline.jsx:370`'te inline atıflı; footer'da yok. **Eklenmesi önerilir.**

### 4d. Klasik Tefsir / Belağat İddiaları

**8. Zemahşerî — el-Keşşâf (parafraz)**
- Mevcut durum: Parafraz ibaresi ile doğru sunulmuş (`tr.json:441-442`).
- Erişim / baskı önerisi:
  1. **ez-Zemahşerî, Ebu'l-Kâsım Mahmûd b. Ömer (d. 1144).** *el-Keşşâf an Hakāik Gavâmidi't-Tenzîl*. Baskı: Dâru'l-Kitâbi'l-Arabî, Beyrut (4 cilt, muhtelif tarihler). Shamela: https://shamela.org/pdf/607e16b8847c5_2cdd8b237444d35d77f45a8620c8c0bd

**9. Zerkeşî — el-Burhân fî Ulûmi'l-Kur'ân**
- Mevcut durum: Adı ve eser başlığı tam geçiyor.
- Erişim önerisi: https://archive.org/details/BurhanQuran · Semantic Scholar: https://www.semanticscholar.org/paper/Al-Burhan-Fi-Ulum-Al-Qur-An-Zarkashi-Ashli/10a74910a78cb777a87a4c50d27753484e25ec32

**10. İbn Kayyim el-Cevziyye — et-Tibyân fî Aksâmi'l-Kur'ân**
- Mevcut durum: `KuranYeminleri.jsx:1179-1180`'de yönlendirme notu; footer'da yok.
- Aday primer kaynak erişimi: https://www.sifatusafwa.com/en/tafsir-partial-or-selected/at-tibiyaan-fi-aqsaam-al-quraan-ibn-qayyim-al-jawziyyah.html · Kalamullah toplu sayfa: https://kalamullah.com/ibn-qayyim.html

**11. Süyûtî — el-İtkân fî Ulûmi'l-Kur'ân + Lübâbü'n-Nukūl**
- Mevcut durum: `RevelationTimeline.jsx:370`, `SebebiNuzul.jsx:1096`, `KuranYeminleri.jsx:1179-1180`'de inline; footer'da yok.
- Aday erişim: https://tanzil.net/docs/revelation_order (uyarı: Tanzil tefsir sunmaz; nüzûl sırası için bibliyografik kaynak).

**12. Fahreddin er-Râzî — Mefâtîhu'l-Gayb**
- Mevcut durum: Site içinde 5+ yerde adı geçer; footer'da yok.
- Klasik eser, muhtelif baskıları mevcut.

**13. Gazali — Mişkâtü'l-Envâr + İhyâu Ulûmi'd-Dîn**
- Mevcut durum: `HiddenArchitecture.jsx:110, 174`'te eser adı tam; footer'da yok.

**14. İbn Arabî — Fütühâtü'l-Mekkiyye / Fusûsu'l-Hikem**
- Mevcut durum: `HiddenArchitecture.jsx:160-164`'te tartışma notu ile sunulmuş; footer'da yok.

**15. Askerî (*el-Furûku'l-Lugaviyye*) + İsfahânî (*el-Müfredât*)**
- Mevcut durum: `FurukAtlasi.jsx:1229-1230`'de geleneğin kaynakları olarak inline; footer'da yok.

**16. Vâhidî — Esbâbu'n-Nüzûl**
- Mevcut durum: `SebebiNuzul.jsx:689, 870`'de adı geçiyor; footer'da yok.

---

## 5. Genel Değerlendirme

**Güçlü yönler:**

1. Sitenin criticalNote sistemi **örnek niteliğinde**. Cousteau miti, Bucaille tuz kristalleri, Keith Moore tartışması, Ramses II özdeşliği, Mevdudi/Seyyid Kutup yorumları — hepsi açık akademik çerçevede sunulmuş. Bu, dinî popüler içerikte nadir bir şeffaflık düzeyi.

2. Zemahşerî alıntısının `— parafraz / — paraphrase` ibaresi, klasik alıntılarda titizliğin standardı olmalı.

3. Footer'daki TR↔EN parite tam; `note` alanı Moore ve Bucaille için doğru nüans sunuyor.

4. `docs/reviews/2026-04-19-leeds-verification.md` raporu, sayısal iddiaların bazılarının siteden çıkarıldığını (yevm=365, şehr=12, salât=zekât=32) gösteriyor — ancak bu çıkarma işleminin kendisi bu rapor kapsamında doğrulanmadı; §5'te atıfla bildirilir.

**Zayıf yönler ve öncelikli aksiyonlar:**

1. **En kritik eksiklik:** Footer'da *klasik İslami literatür* kaynağı yalnızca 2 tane (Zemahşerî ve Zerkeşî). Oysa site içinde 7+ klasik âlim (İbn Kayyim, Süyûtî, Râzî, Gazali, İbn Arabî, Askerî, İsfahânî, Vâhidî, Taberî, Kurtubî, Bikā'î) yoğun şekilde kullanılıyor. **Ağırlıklı öneri:** Footer'a en az 3-4 klasik âlim ekleyerek bu dengeyi düzelt — özellikle İbn Kayyim (yeminler) ve Süyûtî (sebeb-i nüzûl).

2. **Primer source URL'leri yok.** Bir kullanıcı Farrin'in kitabını satın almak istediğinde veya Leeds korpusuna gitmek istediğinde footer'da link yok. §6'daki minimum-görsel-etki patch bu boşluğu doldurur.

3. **Kaynaksız nörobilim iddiaları.** fMRI ve Dacher Keltner atıfları eser adı verilmeden kullanılıyor. En azından kısa bir "Spence et al. 2001; Newberg & Iversen 2003" gibi parantez referans eklenebilir.

4. **Tanzil Quran Text** — iki yerde inline atıflı ama footer'da yok. Küçük bir ekleme.

---

## 6. Uygulama Önerileri — Minimum Görsel Etki

Aşağıdaki patch önerileri sitenin mevcut tipografisini ve düzenini bozmadan kaynak linklerini devreye alır. Kullanıcı onayı bekleniyor.

### (a) Schema — Footer kaynak nesnesine opsiyonel `link` alanı

Mevcut şema:
```json
{ "name": "...", "section": "...", "note": "..." }
```

Önerilen şema (geriye dönük uyumlu — `link` opsiyonel):
```json
{ "name": "...", "section": "...", "note": "...", "link": "https://..." }
```

TR ve EN'de aynı URL (çoğu kaynak zaten dil-bağımsız yayıncı/arşiv sayfasıdır).

### (b) Footer render — `src/components/Footer.jsx:38`

Mevcut satır 38:
```jsx
{name}
```

Önerilen değişiklik (yaklaşık 5 JSX satırı):
```jsx
{source.link ? (
  <a
    href={source.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-silver hover:text-gold transition-colors"
  >
    {name}
  </a>
) : (
  name
)}
```

**Görsel etki:**
- Normal durumda: sıfır değişiklik (aynı `text-silver` rengi, aynı tipografi).
- Hover durumda: isim altın (`text-gold`) olur — başka hiçbir dekoratif öğe yok (ikon, altını çizgi, "↗" sembolü yok).
- Link olmayan kaynaklar (Moore, Bucaille vb. — eğer link eklenmezse) aynen düz metin olarak kalır.
- Kullanıcı hiçbir şey değişmediğini fark edene kadar aynı sayfayı görür; ancak hover yaptığında footer canlanır.

### (c) Her footer kaynağı için önerilen URL

| # | Kaynak | Önerilen `link` |
|---|--------|-----------------|
| 1 | Raymond Farrin — Structure and Qur'anic Interpretation (2014) | https://newbooksnetwork.com/raymond-farrin-structure-and-quranic-interpretation-white-cloud-press-2014 |
| 2 | Corpus Coranicum (BBAW) | https://corpuscoranicum.de |
| 3 | Quranic Arabic Corpus (Leeds) | https://corpus.quran.com |
| 4 | Dr. Keith L. Moore — The Developing Human | https://en.wikipedia.org/wiki/Keith_L._Moore *(tartışmayı da içeren en dengeli genel-erişim sayfası)* |
| 5 | Dr. Maurice Bucaille — The Bible, the Quran and Science | https://en.wikipedia.org/wiki/Maurice_Bucaille *(mainstream eleştirel çerçeve içeren sayfa)* |
| 6 | Zemahşeri — el-Keşşâf | https://shamela.org/pdf/607e16b8847c5_2cdd8b237444d35d77f45a8620c8c0bd *(tam Arapça metin)* |
| 7 | Zerkeşî — el-Burhân fî Ulûmi'l-Kur'ân | https://archive.org/details/BurhanQuran |
| 8 | Birmingham Üniversitesi Kur'an El Yazması (2015) | https://en.wikipedia.org/wiki/Birmingham_Quran_manuscript *(üniversitenin orijinal press release URL'i 404 veriyor — Wikipedia en stabil genel-erişim özeti)* |
| 9 | Sahîh-i Müslim · Tirmizî — Sünen | https://sunnah.com |

Eğer kullanıcı Moore/Bucaille için **Wikipedia yerine** akademik tartışma kağıdı tercih ederse:
- Moore: Bigliardi, S. (2011), "The contemporary debate on the Islamic interpretation of science": https://philpapers.org/rec/BIGTCD (veya dergi DOI'si).
- Bucaille: Bigliardi, S. (2014), *Islam and the Quest for Modern Science*. Istanbul: SRII. WorldCat OCLC 893459263.

### (d) Öncelikli yeni footer girdileri (§4'e dayanarak)

TR ve EN'de paralel olarak aşağıdakilerin footer'a eklenmesi önerilir (opsiyonel — bütün görsel boyutu ~9 JSON satırı her dilde, toplam 18):

```json
{
  "name": "İbn Kayyim el-Cevziyye — et-Tibyân fî Aksâmi'l-Kur'ân + Zâdü'l-Meâd",
  "section": "Yeminler · Kıssa Analizi · Helak-Suç Bağı",
  "link": "https://kalamullah.com/ibn-qayyim.html"
},
{
  "name": "Celâluddin es-Süyûtî — el-İtkân fî Ulûmi'l-Kur'ân + Lübâbu'n-Nukūl",
  "section": "Nüzûl Sırası · Sebeb-i Nüzûl",
  "link": "https://tanzil.net/docs/revelation_order"
},
{
  "name": "Fahreddin er-Râzî — Mefâtîhu'l-Gayb",
  "section": "Tefsir · Yedi Katman · Münâsebât"
},
{
  "name": "Tanzil Quran Text + Internet Archive Kur'an El Yazmaları",
  "section": "Metin Doğrulama · Yaşayan Koruma",
  "link": "https://tanzil.net"
}
```

### (e) İnline sup-referans (opsiyonel, çok seçici)

Eğer kullanıcı daha fazla ses isterse — sadece 2-3 **yüksek öncelikli** yerde inline `<sup>` altın rakamı + footer'a hash anchor.

Örnek (`src/sections/HiddenArchitecture.jsx:495`):
```jsx
<p className="text-silver text-sm font-body">
  Raymond Farrin · 2014
  <sup style={{ color: COLORS.gold, opacity: 0.6, fontSize: '0.7em', marginLeft: '3px' }}>
    <a href="#footer-source-1" style={{ color: 'inherit', textDecoration: 'none' }}>[1]</a>
  </sup>
</p>
```

Ve `Footer.jsx`'de her `<li>`'ye `id={`footer-source-${i+1}`}` eklenir.

**Görsel etki:** `[1]` altın, opacity 0.6, 0.7em — neredeyse görünmez. Tıklanınca footer'a scroll. **Sadece 3 kritik yerde uygulanması önerilir:**
- `HiddenArchitecture.jsx:495` (Farrin)
- `ScientificSigns.jsx:30` ("Hubble · 1929" → Hubble PNAS 1929 primer)
- `ZeroRedundancy.jsx:522` (Zemahşeri parafraz — sup ile el-Keşşâf link)

Bu opsiyonel — kullanıcı "hayır, footer link yeterli" derse uygulanmayacak.

### (f) Toplam diff boyu tahmini

- `src/components/Footer.jsx`: ~8 JSX satırı (ilave link render).
- `src/i18n/tr.json > footer.sources`: 9 mevcut kayda `link` alanı ekleme ≈ 9 satır; opsiyonel 4 yeni kaynak ≈ 20 satır. Toplam ~29 satır.
- `src/i18n/en.json > footer.sources`: aynı ≈ 29 satır.
- (e) seçeneği uygulanırsa ek ~6 JSX satır × 3 dosya = ~18 satır + `Footer.jsx`'de `id` ataması 1 satır.

**Toplam (minimum paket, e dahil değil):** ~67 satır — tamamı JSON + tek JSX dosyası.
**Görsel etki:** Sıfır (link olmayan kullanıcılar fark etmez); hover durumunda altın vurgu.

---

**Rapor sonu.**
