# QuranCodex — Tefsir & Yorum Kaynak Analizi (v2)

**Amaç:** Sitedeki tefsir niteliği taşıyan tüm yorum pasajlarını listelemek, mevcut yorumun nereden geldiğini belgelemek ve her yorum için doğrulanacak akademik/klasik kaynak belirlemek.

**Durum göstergesi:** `[ ]` = kaynak bağlanmadı | `[x]` = kaynak bağlandı  
**Mevcut kaynak göstergesi:**
- 🤖 = AI sentezi (Claude tarafından üretilmiş, belirli bir kaynağa dayanmıyor)
- 📚 = Klasik tefsir literatürü sentezi (genel bilgiye dayanan parafraz)
- 🔬 = Modern bilimsel literatür sentezi
- 🎓 = Belirli bir akademik kaynaktan (kısmen doğrudan)
- ⚠️ = Tartışmalı / doğrulanması gereken

---

## 1. KELİME / ANLAM YORUMLARI

### 1.1 "Enzelnâ" — Hadid 57:25
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.iron` |
| **Yorum** | "Kur'an demir için sıra dışı bir fiil seçer: enzelnâ — indirdik. Yarattık değil: indirdik. Modern astrofizik: demir ancak supernova patlamalarında sentezlenir." |
| **Mevcut kaynağı** | 🤖 AI sentezi — popüler İslami literatürden derlenmiş |
| **Uyarı** | ⚠️ Klasik müfessirlerin büyük çoğunluğu "enzelnâ"yı "lütfettik, ihsan ettik" anlamında yorumlar. Astrofizik bağlantısı 20. yy. yorumu. |
| **Bağlanacak kaynak** | [x] [Taberi — Câmiu'l-Beyân, Hadid 57:25](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=57&tAyahNo=25&LangID=2) + [ ] [Zaghloul El-Naggar, Tefsiru'l-Ayati'l-Kevniyye — Google Scholar](https://scholar.google.com/scholar?q=Zaghloul+El-Naggar+Quran+Cosmic+iron+nucleosynthesis) |

---

### 1.2 "Mûsi'ûn" — Zariyat 51:47
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.universe` |
| **Yorum** | "Mûsi'ûn kelimesi ism-i fail kalıbında, şimdiki zaman ve süreklilik bildirir — devam eden, aktif bir süreç." |
| **Mevcut kaynağı** | 📚 Genel Arapça dilbilgisi bilgisi + 🤖 AI sentezi |
| **Uyarı** | ⚠️ Klasik kullanımda "güç ve kapasite sahibi olan" anlamı da var. Her iki yorum dilbilgisel açıdan savunulabilir. |
| **Bağlanacak kaynak** | [x] [Taberi — Câmiu'l-Beyân, Zariyat 51:47](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=51&tAyahNo=47&LangID=2) + [ ] [Seyyid Kutup — Fî Zilâli'l-Kur'an, Amazon](https://www.amazon.com/s?k=Fi+Zilal+al-Quran+Sayyid+Qutb) + [ ] [Mevdudi — Tefhîmu'l-Kur'an, Amazon](https://www.amazon.com/s?k=Tafhim+ul+Quran+Maududi) |

---

### 1.3 "Ratk" ve "Fetk" — Enbiya 21:30
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.universe.facts` |
| **Yorum** | "Ratk (birleşik) ve fetk (ayrılmış) kelimeleri gökler ve yerin bir bütünden ayrıldığına işaret eder — Big Bang." |
| **Mevcut kaynağı** | 🤖 AI sentezi — popüler "ilmi i'caz" literatüründen |
| **Bağlanacak kaynak** | [x] [Taberi — Enbiya 21:30](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=21&tAyahNo=30&LangID=2) + [ ] [Fahreddin Razi — Mefâtîhu'l-Gayb, Wikipedia](https://en.wikipedia.org/wiki/Fakhr_al-Din_al-Razi) + [ ] [Big Bang — Wikipedia karşılaştırma](https://en.wikipedia.org/wiki/Big_Bang) |

---

### 1.4 "Alaka" — Mu'minun 23:14
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.embryo` |
| **Yorum** | "Bu kelime Arapçada üç anlam taşır: yapışan şey, kan pıhtısı ve sülük. Modern embriyoloji üçünü de doğruluyor." |
| **Mevcut kaynağı** | 🎓 Keith L. Moore'un çalışmalarına dayanan popüler anlatım |
| **Uyarı** | ⚠️ Moore'un atfı akademik çevrede tartışmalıdır. |
| **Bağlanacak kaynak** | [x] [İbn Kesir — Mu'minun 23:14](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=23&tAyahNo=14&LangID=2) + [ ] [Keith L. Moore — Wikipedia](https://en.wikipedia.org/wiki/Keith_L._Moore) + [ ] [Moore & Persaud, The Developing Human — Amazon](https://www.amazon.com/s?k=Moore+Persaud+The+Developing+Human+embryology) |

---

### 1.5 "Berzah" — Rahman 55:19-20
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.ocean` |
| **Yorum** | "Berzah: iki şey arasındaki geçit vermez ara bölge — halocline tanımıyla örtüşür." |
| **Mevcut kaynağı** | 🤖 AI sentezi — Bucaille türevi popüler yorumdan |
| **Bağlanacak kaynak** | [x] [Taberi — Rahman 55:19](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=55&tAyahNo=19&LangID=2) + [x] [Halocline — Wikipedia](https://en.wikipedia.org/wiki/Halocline) + [ ] [Jacques Cousteau — Mediterranean araştırması (1962)](https://en.wikipedia.org/wiki/Jacques_Cousteau) |

---

### 1.6 "Edna el-ard" — Rum 30:2-4
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `historicalProof.rome` |
| **Yorum** | "'Edna el-ard' hem 'en yakın' hem 'en alçak yer' anlamına gelir. Ölü Deniz çevresi = 430 m aşağıda." |
| **Mevcut kaynağı** | 🤖 AI sentezi — popüler "ilmi i'caz" kaynaklarından |
| **Bağlanacak kaynak** | [x] [Taberi — Rum 30:2](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=30&tAyahNo=2&LangID=2) + [x] [Ölü Deniz (dünyanın en alçak noktası) — Wikipedia](https://en.wikipedia.org/wiki/Dead_Sea) + [ ] [Zemahşeri — Wikipedia](https://en.wikipedia.org/wiki/Al-Zamakhshari) |

---

### 1.7 "Bid'i sinîn" — Rum 30:3-4
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `historicalProof.rome` |
| **Yorum** | "'Bid'i sinîn' = Arapçada 3-9 yıl. 622-628 arası = 6 yıl, tam sınırlar içinde." |
| **Mevcut kaynağı** | 📚 Klasik tefsir bilgisi (yaygın kabul gören dilbilimsel açıklama) |
| **Bağlanacak kaynak** | [x] [Taberi — Rum 30:4](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=30&tAyahNo=4&LangID=2) + [ ] [İbn Manzur, Lisânü'l-Arab — "bid'" maddesi (Archive.org)](https://archive.org/search?query=Lisan+al-Arab+Ibn+Manzur) |

---

### 1.8 "Nâsiye" (alın) — Alak 96:15-16
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `highlights.cards[0]` + `WowFacts.jsx` fact #35 |
| **Yorum** | "Yalancıyı 'alnından' yakalayacak — prefrontal korteks (alnın arkası) yalan ve ahlaki muhakeme merkezidir." |
| **Mevcut kaynağı** | 🤖 AI sentezi — nörobilim + popüler ilmi i'caz |
| **Uyarı** | ⚠️ Klasik tefsir "nâsiye"yi zillet ve rezalet sembolü olarak yorumlar (mecaz). Nörobilim bağlantısı çağdaş yorum. |
| **Bağlanacak kaynak** | [x] [Taberi — Alak 96:15](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=96&tAyahNo=15&LangID=2) + [ ] [Antonio Damasio, Descartes' Error — Amazon](https://www.amazon.com/s?k=Damasio+Descartes+Error+prefrontal+cortex) + [ ] [Prefrontal cortex & deception — fMRI, Google Scholar](https://scholar.google.com/scholar?q=prefrontal+cortex+deception+fMRI) |

---

### 1.9 "Parmak uçları" — Kıyamet 75:4
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `highlights.cards[1]` + `WowFacts.jsx` fact #36 |
| **Yorum** | "Parmak uçlarını bile düzeltmeye kadiriz — parmak izi benzersizliğine işaret." |
| **Mevcut kaynağı** | 🤖 AI sentezi — popüler anlatım |
| **Uyarı** | ⚠️ Klasik tefsir bu ayeti yeniden yaratma gücüne odaklanarak yorumlar. Parmak izi bağlantısı popüler/çağdaş okuma. |
| **Bağlanacak kaynak** | [x] [İbn Kesir — Kıyamet 75:3](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=75&tAyahNo=3&LangID=2) + [x] [Sir Francis Galton, Finger Prints (1892) — Archive.org](https://archive.org/details/fingerprints00galtuoft) + [x] [Parmak izi benzersizliği — Wikipedia](https://en.wikipedia.org/wiki/Fingerprint) |

---

### 1.10 Prophetic Perfect & Historical Present
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `highlights.cards[4]` + `ZamanBoyutlari.jsx` LANG_CARDS[2] |
| **Yorum** | "Gelecek, geçmiş zaman kipiyle anlatılır (Prophetic Perfect) — sanki zaten olmuş gibi." |
| **Mevcut kaynağı** | 🎓 Akademik dilbilim kavramı (doğru atıf, yaygın bilgi) |
| **Bağlanacak kaynak** | [x] [Neal Robinson, Discovering the Quran (2003) — Amazon](https://www.amazon.com/s?k=Neal+Robinson+Discovering+the+Quran) + [ ] [İbn Hişam, Muğni'l-Lebib — Archive.org](https://archive.org/search?query=Mughni+al-Labib+Ibn+Hisham) |

---

### 1.11 İltifat sanatı — Fatiha
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `highlights.cards[5]` |
| **Yorum** | "Fatiha 7 ayette 3 farklı bakış açısı: 3. kişi → 2. kişi → 1. kişi çoğul — polyphonic voice." |
| **Mevcut kaynağı** | 📚 Klasik belâgat bilgisi (iltifat sanatı yaygın kabul gören kavram) |
| **Bağlanacak kaynak** | [x] [Zerkeşi, el-Burhân fî Ulûmi'l-Kur'an — Wikipedia](https://en.wikipedia.org/wiki/Al-Zarkashi) + [ ] [İbn Ebu'l-İsba', Bedîu'l-Kur'an — Google Scholar](https://scholar.google.com/scholar?q=Ibn+Abi+al-Isba+Badi+al-Quran+iltifat) |

---

### 1.12 "Rahman" isminin Kur'an'ın hediyesi olması
| Alan | İçerik |
|------|--------|
| **Dosya** | `WowFacts.jsx` fact #37 |
| **Yorum** | "'Rahman' — bu isim Kur'an öncesi Arapçada Allah için kullanılmıyordu; Kur'an insanlığa bu ismi tanıttı." |
| **Mevcut kaynağı** | 🤖 AI sentezi — kısmen doğru, kısmen tartışmalı |
| **Uyarı** | ⚠️ "Rahman" Kur'an öncesinde de kullanılıyordu (bkz. Yemen kitabelerindeki "Rahman" atıfları). İddia tam doğru değil. |
| **Bağlanacak kaynak** | [x] [Râgıb el-İsfahanî — el-Müfredât (Archive.org)](https://archive.org/search?query=Raghib+al-Isfahani+al-Mufradat) + [x] [Rahman (ilah) — Wikipedia tarihsel bağlam](https://en.wikipedia.org/wiki/Rahman_(deity)) |

---

### 1.13 "Çöl" kelimesinin Kur'an'da geçmemesi
| Alan | İçerik |
|------|--------|
| **Dosya** | `WowFacts.jsx` fact #41 |
| **Yorum** | "Kur'an coğrafyayı değil mesajı konuşur — Arabistan'ın çöl ortamına özgü terimler yerine evrensel kavramlar tercih edilir." |
| **Mevcut kaynağı** | 🤖 AI sentezi — doğrulanması gerekiyor |
| **Uyarı** | ⚠️ Bu iddia corpus araştırmasıyla doğrulanmalıdır. "Sahara", "badiye" gibi kelimeler var mı kontrol edilmeli. |
| **Bağlanacak kaynak** | [x] [Corpus.quran.com — kelime araması](https://corpus.quran.com/search.jsp) + [x] [Corpus Coranicum — Berlin Üniversitesi kritik edisyon](https://corpuscoranicum.de/en) |

---

### 1.14 "4 Ayet, tüm rehber" — El-Asr
| Alan | İçerik |
|------|--------|
| **Dosya** | `WowFacts.jsx` fact #43 |
| **Yorum** | "El-Asr 3 ayette kurtuluş formülü içeriyor: iman, amel, hak tavsiyesi, sabır tavsiyesi." |
| **Mevcut kaynağı** | 📚 Klasik tefsir bilgisi (İmam Şafii'nin meşhur sözüne dayanan yaygın kabul) |
| **Bağlanacak kaynak** | [x] [İbn Kesir — Asr Suresi](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=103&tAyahNo=1&LangID=2) + [ ] [İmam Şafii — El-Asr hadisi (sunnah.com referansı)](https://sunnah.com/search?q=surah+asr) |

---

### 1.15 "Allah" lafzının 2.699 kez geçmesi
| Alan | İçerik |
|------|--------|
| **Dosya** | `WowFacts.jsx` fact #3 |
| **Yorum** | "Allah ismi Kur'an'da tam 2.699 kez geçiyor." |
| **Mevcut kaynağı** | 🔬 İstatistik — corpus araştırması |
| **Uyarı** | ⚠️ Farklı sayım metodolojileri farklı sonuçlar verebilir (zamir atıfları dahil mi?). |
| **Bağlanacak kaynak** | [x] [Corpus.quran.com — kelime frekansı](https://corpus.quran.com/wordfrequency.jsp) + [x] [Corpus Coranicum](https://corpuscoranicum.de/en) |

---

## 2. ALİM ATIFLARI

### 2.1 Raymond Farrin — Halka Kompozisyon (%70)
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `hiddenSymmetry.stat` + `HiddenArchitecture.jsx` |
| **Yorum** | "Farrin'in araştırmasına göre surelerin %70'i ring composition taşıyor." |
| **Mevcut kaynağı** | 🎓 Doğrudan kaynak — Raymond Farrin, Structure and Quranic Interpretation (2014) |
| **Bağlanacak kaynak** | [x] [Raymond Farrin, Structure and Quranic Interpretation — Amazon](https://www.amazon.com/s?k=Raymond+Farrin+Structure+Quranic+Interpretation) + [x] [Raymond Farrin — Wikipedia](https://en.wikipedia.org/wiki/Raymond_Farrin) |

---

### 2.2 Zemahşeri — "Her kelime bir hazinedir"
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `zeroRedundancy.zemahseriQuote` |
| **Yorum** | "Kur'an'ın her kelimesi bir hazinedir. Bir kelimeyi çıkarsan, bina çöker." |
| **Mevcut kaynağı** | 📚 Klasik tefsir literatüründen parafraz — kesin metin doğrulanmamış |
| **Uyarı** | ⚠️ Meşhur bir atıf ama tam metin el-Keşşâf'ta bulunup doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [Zemahşeri — Wikipedia (biyografi)](https://en.wikipedia.org/wiki/Al-Zamakhshari) + [ ] [Zemahşeri, el-Keşşâf — Archive.org](https://archive.org/search?query=Zamakhshari+al-Kashshaf) |

---

### 2.3 İbn Arabi, Gazali, Razi — Nur Ayeti
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `sevenLayers.intro` |
| **Yorum** | "İbn Arabi, Gazali, Razi — bu tek ayet üzerine ciltler yazmıştır." |
| **Mevcut kaynağı** | 📚 Klasik tefsir bilgisi (doğru genel referans) |
| **Bağlanacak kaynak** | [x] [Gazali, Mişkâtu'l-Envâr — Archive.org](https://archive.org/search?query=Ghazali+Mishkat+al-Anwar+niche+lights) + [x] [Fahreddin Razi — Nur 24:35](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=24&tAyahNo=35&LangID=2) + [x] [İbn Arabi — Wikipedia](https://en.wikipedia.org/wiki/Ibn_Arabi) |

---

### 2.4 Nur Ayeti — 7 Katmanlı Tefsir
**Dosya:** `src/sections/HiddenArchitecture.jsx` → `NUR_LAYERS`  
**Ayet:** Nur 24:35

| # | Katman | Atfedilen Alim | Mevcut Kaynağı | Uyarı | Bağlanacak Kaynak |
|---|--------|----------------|----------------|-------|-------------------|
| 1 | Fiziksel | Fahreddin Razi | 🤖 AI sentezi | — | [x] [Mefâtîhu'l-Gayb — Taberi, Nur 24:35](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=24&tAyahNo=35&LangID=2) |
| 2 | Manevi | İmam Gazali | 🤖 AI sentezi | ⚠️ Mişkâtu'l-Envâr'dan doğrudan alıntı değil | [x] [Gazali, Mişkâtu'l-Envâr — Archive.org](https://archive.org/search?query=Ghazali+Mishkat+al-Anwar) |
| 3 | Bilimsel | Modern Fizik | 🔬 Modern fizik sentezi | ⚠️ "Klasik tefsir geleneğinde yer almaz" notu sitede gösterilmeli | [x] [Işığın dalga-parçacık dualitesi — Wikipedia](https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality) |
| 4 | Felsefi | İbn Sina | 🤖 AI sentezi | ⚠️ İşârât ve Tenbîhât'tan doğrudan alıntı değil | [x] [İbn Sina — Wikipedia](https://en.wikipedia.org/wiki/Avicenna) |
| 5 | Psikolojik | İbn Kayyim | 🤖 AI sentezi | — | [x] [İbn Kayyim el-Cevziyye — Wikipedia](https://en.wikipedia.org/wiki/Ibn_Qayyim_al-Jawziyya) |
| 6 | Tasavvufi | İbn Arabi | 🤖 AI sentezi | ⚠️ **KRİTİK: Nur-u Muhammedi tartışmalı rivayet — sitede uyarı gösterilmeli** | [x] [İbn Arabi, el-Fütûhât — Archive.org](https://archive.org/search?query=Ibn+Arabi+Futuhat+al-Makkiyya) |
| 7 | İlahi | Gazali (Mişkât) | 🤖 AI sentezi | — | [x] [Mişkâtu'l-Envâr — Archive.org](https://archive.org/search?query=Ghazali+Mishkat+al-Anwar) |

---

### 2.5 Dr. Keith L. Moore — Embriyoloji
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.embryo.facts` |
| **Yorum** | "Dr. Keith L. Moore: Kur'an'daki embriyolojik tanımların modern bilimle uyumunu dikkat çekici bulmuştur." |
| **Mevcut kaynağı** | 🎓 Belirli bir kaynağa (Moore & Persaud) dayanan — ancak popülerleştirilmiş |
| **Uyarı** | ⚠️ Moore'un yorumları bilim dünyasında tartışmalıdır. Bağlamından koparılma riski yüksek. |
| **Bağlanacak kaynak** | [x] [Keith L. Moore — Wikipedia](https://en.wikipedia.org/wiki/Keith_L._Moore) + [ ] [Moore & Persaud, The Developing Human (1993) — Amazon](https://www.amazon.com/s?k=Moore+Persaud+Developing+Human+embryology) |

---

### 2.6 İmam Gazali — Nefs/Korku bölümü
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `psychology.sections.nefs` (Emmâre yorumu) + `ZamanBoyutlari.jsx` (Leyletu'l-Kadr expandTr) |
| **Yorum** | "İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.'" |
| **Mevcut kaynağı** | 🤖 AI sentezi — Gazali'nin genel görüşlerinden üretilmiş parafraz |
| **Uyarı** | ⚠️ Bu tam alıntı İhyâ'da doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [Gazali, İhyâu Ulûmi'd-Din — Archive.org (İngilizce)](https://archive.org/search?query=Ghazali+Ihya+Ulum+al-Din) + [x] [İmam Gazali — Wikipedia](https://en.wikipedia.org/wiki/Al-Ghazali) |

---

### 2.7 İbn Kesir — Zaman yorumu
| Alan | İçerik |
|------|--------|
| **Dosya** | `ZamanBoyutlari.jsx` → TIMELINE_DATA[4] (1 gün = 1.000 yıl) |
| **Yorum** | "İbn Kesir: Allah zamanla bağlı değildir; bu ifade insanın zaman algısının sınırlılığını gösterir." |
| **Mevcut kaynağı** | 🤖 AI sentezi — İbn Kesir'in genel pozisyonundan |
| **Uyarı** | ⚠️ İbn Kesir'den doğrudan alıntı değil, parafraz. Doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [İbn Kesir — Hac 22:47](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=22&tAyahNo=47&LangID=2) + [x] [İbn Kesir — Wikipedia](https://en.wikipedia.org/wiki/Ibn_Kathir) |

---

### 2.8 Mevdudi & Seyyid Kutup — Kozmik genişleme
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `scientificSigns.universe.criticalNote` |
| **Yorum** | "Kozmik genişleme yorumu özellikle Mevdudi, Seyyid Kutup ve bazı çağdaş akademisyenler tarafından desteklenmektedir." |
| **Mevcut kaynağı** | 📚 Genel bilgi (doğru atıf, yaygın bilinir) |
| **Bağlanacak kaynak** | [x] [Taberi — Zariyat 51:47](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=51&tAyahNo=47&LangID=2) + [ ] [Seyyid Kutup — Amazon](https://www.amazon.com/s?k=Fi+Zilal+al-Quran+Sayyid+Qutb+English) + [ ] [Mevdudi — Amazon](https://www.amazon.com/s?k=Tafhim+ul+Quran+Maududi+English) |

---

### 2.9 Hermann Ranke — Haman / Hiyeroglif
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `historicalProof.haman` |
| **Yorum** | "Ranke'nin 1935 ansiklopedisinde Mısır kayıtlarında 'Hm-n-h' ismi bulundu. Görevi: taş işçileri gözetmeni." |
| **Mevcut kaynağı** | 🎓 Belirli bir kaynaktan (Ranke, 1935) — doğruluğu yüksek |
| **Bağlanacak kaynak** | [x] [Hermann Ranke (mısırbilimci) — Wikipedia](https://en.wikipedia.org/wiki/Hermann_Ranke_(Egyptologist)) + [ ] [Die Ägyptischen Personennamen (1935) — Google Scholar](https://scholar.google.com/scholar?q=Hermann+Ranke+Die+Agyptischen+Personennamen+1935) + [ ] [Maurice Bucaille — Wikipedia](https://en.wikipedia.org/wiki/Maurice_Bucaille) |

---

### 2.10 Maurice Bucaille — Firavun mumyası
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `historicalProof.pharaoh` |
| **Yorum** | "1975'te Ramses II mumyası Paris'e gönderildi; tuz kristalleri bulundu (deniz suyu kanıtı)." |
| **Mevcut kaynağı** | 🎓 Bucaille'nin çalışmasına dayanan |
| **Uyarı** | ⚠️ Bucaille'nin tuz kristali yorumu tartışmalıdır. Doğrudan kanıt olarak sunulmaktan kaçınılmalı. |
| **Bağlanacak kaynak** | [x] [Maurice Bucaille — Wikipedia](https://en.wikipedia.org/wiki/Maurice_Bucaille) + [x] [Ramses II Mumyası — Wikipedia](https://en.wikipedia.org/wiki/Ramesses_II) + [ ] [Bucaille, Bible, Quran and Science — Archive.org](https://archive.org/search?query=Bucaille+Bible+Quran+Science) |

---

## 3. YAPISAL / EDEBİ YORUMLAR

### 3.1 Fatiha — Halka Kompozisyon
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `SURAHS.fatiha.pairsTr` |
| **Yorum** | A-B-C-D-C'-B'-A' yapısı; çift açıklamaları: "İlahi isimden ilahi nimet doğar", "Merhamet beyani ibadeti doğurur", "Hesap günü bilinci tüm duanın dönüm noktasıdır." |
| **Mevcut kaynağı** | 🤖 AI sentezi — Farrin'in ring composition metodunu Fatiha'ya uygulamış |
| **Bağlanacak kaynak** | [x] [Farrin, Structure and Quranic Interpretation — Amazon](https://www.amazon.com/s?k=Raymond+Farrin+Structure+Quranic+Interpretation) + [x] [Michel Cuypers, The Composition of the Quran — Amazon](https://www.amazon.com/s?k=Michel+Cuypers+Composition+Quran+Rhetorical) |

---

### 3.2 Âyetü'l-Kürsî — Halka Kompozisyon
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `SURAHS.ayetelkursi.pairsTr` |
| **Yorum** | A-B-C-D-C'-B'-A' yapısı; "Sahiplik ve ilim birbirini tamamlıyor, her ikisi de mutlak." |
| **Mevcut kaynağı** | 🤖 AI sentezi — Farrin metodunun uygulaması |
| **Bağlanacak kaynak** | [x] [Farrin, a.g.e. — Amazon](https://www.amazon.com/s?k=Raymond+Farrin+Structure+Quranic+Interpretation) + [x] [Neal Robinson, Discovering the Quran — Amazon](https://www.amazon.com/s?k=Neal+Robinson+Discovering+the+Quran) |

---

### 3.3 Hz. Musa hikayesinin modüler yapısı
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `zeroRedundancy.mosesExamples` + `highlights.cards[2]` |
| **Yorum** | "Hz. Musa'nın hikayesi 10 farklı blok halinde 30+ sureye dağıtılmış — her blok farklı tema." |
| **Mevcut kaynağı** | 🤖 AI sentezi — genel Kur'an ilimlerinden |
| **Bağlanacak kaynak** | [x] [Mustansir Mir, Coherence in the Quran — Amazon](https://www.amazon.com/s?k=Mustansir+Mir+Coherence+Quran) + [ ] [İzzet Derveze — Wikipedia](https://en.wikipedia.org/wiki/Muhammad_Izzat_Darwaza) |

---

### 3.4 Rahman 55 refreni — Retorik analizi
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ZeroRedundancy.jsx` → `refrainExamples` + inline metin |
| **Yorum** | "Kur'an'daki tekrarlar bilgi teorisindeki 'gereksiz tekrar' değil — retorik amplifikasyon, yapısal menteşe ve psikolojik içselleştirme mekanizmasıdır." |
| **Mevcut kaynağı** | 🤖 AI sentezi — edebiyat teorisi + Kur'an ilimlerinin sentezi |
| **Bağlanacak kaynak** | [x] [Seyyid Kutup — Amazon](https://www.amazon.com/s?k=Fi+Zilal+al-Quran+Sayyid+Qutb) + [x] [Angelika Neuwirth, Scripture, Poetry and the Making of a Community — Amazon](https://www.amazon.com/s?k=Angelika+Neuwirth+Scripture+Poetry+Making+Community+Quran) |

---

### 3.5 Kur'an'ın sui generis edebi formu
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ImpossibleRhythm.jsx` + `src/i18n/tr.json` → `impossibleRhythm` |
| **Yorum** | "16 Aruz vezninden hiçbirine uymaz, düzyazı da değil — dilbilimciler buna sui generis diyor." |
| **Mevcut kaynağı** | 🎓 Akademik dilbilim gerçeği (yaygın kabul) — doğru atıf |
| **Bağlanacak kaynak** | [x] [Navid Kermani, God is Beautiful — Amazon](https://www.amazon.com/s?k=Navid+Kermani+God+Beautiful+Quran) + [x] [Navid Kermani — Wikipedia](https://en.wikipedia.org/wiki/Navid_Kermani) + [ ] [A.A. Arberry, The Koran Interpreted (giriş) — Archive.org](https://archive.org/search?query=Arberry+Koran+Interpreted) |

---

### 3.6 Fasila analizi (sure ses imzaları)
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `impossibleRhythm.fasila` + `ImpossibleRhythm.jsx` |
| **Yorum** | "Her surenin kendine özgü bir bitiş sesi var — fasila — ne kafiye zorunluluğuna bağlı ne rastlantısal." |
| **Mevcut kaynağı** | 📚 Klasik belâgat bilgisi (fasila kavramı klasik literatürde var) |
| **Bağlanacak kaynak** | [x] [Zerkeşi — Wikipedia](https://en.wikipedia.org/wiki/Al-Zarkashi) + [ ] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |

---

### 3.7 Mü'minun 23:1-11 — Dilbilimsel analiz
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `MUMIN_TRAITS` |
| **Yorumlar** | "Tüm vasıflar ism-i fâil formunda — sürekli karakter hali." + "qad eflaha geçmiş zamanda ama geleceği ifade ediyor — kesinlik vurgusu." + "Sure huşu ile başlayıp namazı 'korumak' ile bitiyor." |
| **Mevcut kaynağı** | 🤖 AI sentezi — Arapça dilbilgisi bilgisinin uygulanması |
| **Bağlanacak kaynak** | [x] [İbn Âşur — Wikipedia](https://en.wikipedia.org/wiki/Ibn_Ashur) + [x] [Seyyid Kutup — Amazon](https://www.amazon.com/s?k=Fi+Zilal+al-Quran+Sayyid+Qutb) + [x] [Quran.com — Mu'minun 23:1](https://quran.com/23/1) |

---

### 3.8 İstikamet — Kelime kelime dilbilimsel analiz
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `ISTIKAMET_WORDS` |
| **Ayet** | Hud 11:112 |
| **Yorumlar** | "'Festakım' = dik dur, eğilme. 'Kemâ umirte' = vahiy standardı, kişisel standart değil. 'Men tabe meake' = cemaat meselesi. 'Lâ tatğav' = tugyan = sınırı aşmak, orta yol vurgusu." |
| **Mevcut kaynağı** | 🤖 AI sentezi — Arapça kök analizi |
| **Bağlanacak kaynak** | [x] [Râgıb el-İsfahanî, el-Müfredât — Archive.org](https://archive.org/search?query=Raghib+al-Isfahani+al-Mufradat+Quran) + [x] [Taberi — Hud 11:112](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=11&tAyahNo=112&LangID=2) |

---

### 3.9 "İnsan" teriminin dört Arapça karşılığı
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `HUMAN_TERMS` |
| **Yorumlar** | İnsân (~65 kez): "Hem iyi hem kötü potansiyel." Beşer (~36 kez): "Biyolojik boyutuyla insan." Nâs (~241 kez): "Topluluk olarak insanlık." Benî Âdem (~7 kez): "Tarihsel süreklilik ve onur." |
| **Mevcut kaynağı** | 📚 Klasik Kur'an terminolojisi bilgisi — genel doğru |
| **Uyarı** | ⚠️ Frekans sayıları corpus araştırmasıyla doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [Râgıb el-İsfahanî, el-Müfredât — Archive.org](https://archive.org/search?query=Raghib+al-Isfahani+al-Mufradat+Quran) + [x] [Corpus.quran.com — kelime arama](https://corpus.quran.com/search.jsp) |

---

### 3.10 Zıtlık sistemi (mukabele)
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/HiddenArchitecture.jsx` → `OPPOSITION_PAIRS` |
| **Yorumlar** | 5 zıt çift: Mü'min/Kâfir, Muhsin/Müfsid, Muttaki/Fâcir, Şâkir/Kefûr, Sâdık/Kâzib — "Kur'an'da mukabele (karşıtlık sanatı) sistematik kullanım." |
| **Mevcut kaynağı** | 📚 Klasik belâgat bilgisi (mukabele kavramı klasik literatürde var) |
| **Bağlanacak kaynak** | [x] [Zerkeşi, el-Burhân — Wikipedia](https://en.wikipedia.org/wiki/Al-Zarkashi) + [ ] [İbn Ebu'l-İsba', Bedîu'l-Kur'an — Google Scholar](https://scholar.google.com/scholar?q=Ibn+Abi+al-Isba+Badi+al-Quran+muqabala) |

---

### 3.11 Hurûf-u Mukatta'a — Tematik grup analizi
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/LinguisticDNA.jsx` → `GROUPS` |
| **Yorumlar** | Elif-Lam-Mim: "İmanın sınanması" teması. Elif-Lam-Ra: Peygamber kıssaları ve teselli. Ha-Mim ailesi: "Tenzil vurgusu, alimlerin aile olarak görür." Ta-Sin: "En sıkı tematik üçlü: iktidara karşı hakkın mücadelesi." |
| **Mevcut kaynağı** | 🤖 AI sentezi — huruf-u mukattaa hakkında genel bilginin tematik yoruma dönüştürülmesi |
| **Uyarı** | ⚠️ Tematik bağlantılar yoruma açık. "Alimlerin aile olarak görür" iddiası doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [Taberi — Bakara 2:1 (mukattaa tartışması)](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=1&LangID=2) + [x] [İbn Kesir — Bakara 2:1](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=2&tAyahNo=1&LangID=2) + [ ] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |

---

### 3.12 Kaf harfinin matematiği (57 × 2 = 114)
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/i18n/tr.json` → `linguisticDNA.kaf` |
| **Yorum** | "Kaf harfi, Kaf Suresi'nde tam 57 kez geçer. 57 × 2 = 114 — toplam sure sayısı." |
| **Mevcut kaynağı** | 📚 Popüler ilmi i'caz literatüründe yaygın iddia |
| **Uyarı** | ⚠️ Sayım metodolojisi (besmele dahil mi?) corpus araştırmasıyla doğrulanmalı. |
| **Bağlanacak kaynak** | [x] [Corpus.quran.com — harf frekansı](https://corpus.quran.com/wordfrequency.jsp) + [x] [Corpus Coranicum — Berlin](https://corpuscoranicum.de/en) + [ ] [Abd al-Razzaq Nawfal — Google Scholar](https://scholar.google.com/scholar?q=Abd+al-Razzaq+Nawfal+al-Ijaz+al-Adadi+Quran) |

---

### 3.13 Besmele dengesi (Tevbe eksikliği / Neml telafisi)
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/MathMiracle.jsx` → BesmeleWidget |
| **Yorum** | "Tevbe suresindeki eksiklik, Neml suresinde karşılığını bulur. Denge korunur." |
| **Mevcut kaynağı** | 📚 Klasik tefsir bilgisi (Tevbe'nin başında besmele olmaması yaygın bilinen bir konu) + 🤖 "Denge" yorumu AI sentezi |
| **Bağlanacak kaynak** | [x] [Taberi — Tevbe 9:1 (besmele yokluğu tartışması)](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=9&tAyahNo=1&LangID=2) + [ ] [Suyuti, el-İtkân (besmele bölümü) — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |

---

### 3.14 Fatiha'nın her gün 40 kez okunması
| Alan | İçerik |
|------|--------|
| **Dosya** | `WowFacts.jsx` fact #14 |
| **Yorum** | "Fatiha günde en az 5 vakit namazda 17 rekat × 2 (fatihasız olmaz) = 17 kez okunur; teravih dahil 40'a çıkar." |
| **Mevcut kaynağı** | 🤖 AI sentezi — namaz rekat hesabı |
| **Uyarı** | ⚠️ 40 rakamı mezheplere göre değişebilir (farz+sünnet+nafile). Daha dikkatli ifade edilmeli. |
| **Bağlanacak kaynak** | [x] [Fatiha'nın namazdaki yeri — islamqa.info](https://islamqa.info/en/search#q=surah+fatiha+prayer) |

---

## 4. PSİKOLOJİK YORUMLAR

### 4.1 Nefs mertebeleri — Modern psikoloji paralelleri
**Dosya:** `src/i18n/tr.json` → `psychology.sections.nefs`

| Nefis | Ayet | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|-------|------|-------|----------------|-------------------|
| Emmâre | Yusuf 12:53 | "En ham, en ilkel hal; anlık hazlar, ego tatmini. Freud'un id kavramıyla örtüşür." | 🤖 AI sentezi | [x] [Taberi — Yusuf 12:53](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=12&tAyahNo=53&LangID=2) + [x] [Gazali, İhyâ — Archive.org](https://archive.org/search?query=Ghazali+Ihya+Ulum+al-Din) |
| Levvâme | Kıyamet 75:2 | "Vicdan uyanmış. Kişi hata yapınca kendini kınar. Sağlıklı vicdan ve bilişsel çelişki." | 📚 Klasik tasavvuf bilgisi | [x] [Taberi — Kıyamet 75:2](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=75&tAyahNo=2&LangID=2) |
| Mülhime | Şems 91:8 | "Hem iyiye hem kötüye yönelme kapasitesini bilinçle taşır. Jung'un 'higher self' kavramı." | 🤖 AI sentezi | [x] [Taberi — Şems 91:7-8](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=91&tAyahNo=7&LangID=2) |
| Mutmainne | Fecr 89:27 | "İç çatışma dinmiş. Maslow'un öz-gerçekleştirme zirvesi." | 🤖 AI sentezi | [x] [İbn Kayyim — Wikipedia](https://en.wikipedia.org/wiki/Ibn_Qayyim_al-Jawziyya) + [x] [Quran.com — Fecr 89:27](https://quran.com/89/27) |
| Râdiye/Mardiyye | Fecr 89:28 | "Karşılıklı rıza. Frankl'ın transcendence kavramı." | 🤖 AI sentezi | [x] [Viktor Frankl, Man's Search for Meaning — Amazon](https://www.amazon.com/s?k=Viktor+Frankl+Man+Search+Meaning) |

---

### 4.2 Kalbin beş hali
**Dosya:** `src/i18n/tr.json` → `psychology.sections.kalp`

| Kalp Hali | Ayet | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|-----------|------|-------|----------------|-------------------|
| Kalb-i Selim | Şuara 26:89 | "Haset, kibir, ikiyüzlülükten arınmış. Psikolojik bütünleşme." | 📚 Klasik tasavvuf + 🤖 modern paralel | [x] [Taberi — Şuara 26:89](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=26&tAyahNo=89&LangID=2) |
| Kalb-i Münib | Kaf 50:33 | "Sürekli Allah'a yönelen. Psikolojik dayanıklılık (resilience)." | 🤖 AI sentezi | [x] [İbn Kesir — Kaf 50:33](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=50&tAyahNo=33&LangID=2) |
| Kalb-i Marîz | Bakara 2:10 | "Nifak, şüphe, haset. Savunma mekanizmaları, projective identification." | 🤖 AI sentezi | [x] [Taberi — Bakara 2:10](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=10&LangID=2) |
| Mühürlenmiş | Bakara 2:7 | "Uzun süreli inkar sonucu dış uyarılara tepki vermez. Seligman'ın öğrenilmiş çaresizliği." | 🤖 AI sentezi | [x] [Taberi — Bakara 2:7](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=7&LangID=2) + [x] [Martin Seligman — Wikipedia](https://en.wikipedia.org/wiki/Martin_Seligman) |
| Paslı (Rân) | Mutaffifin 83:14 | "İhmal sonucu biriken kirlilik; pas temizlenebilir. Travma katmanlaşması." | 🤖 AI sentezi | [x] [İbn Kesir — Mutaffifin 83:14](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=83&tAyahNo=14&LangID=2) |

---

### 4.3 Dört korku/duygu türü
**Dosya:** `src/i18n/tr.json` → `psychology.sections.korku`

| Duygu | Ayet | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|-------|------|-------|----------------|-------------------|
| Havf | Bakara 2:62 | "Sonuçtan doğan korku. Adaptif korku yanıtı: amigdala tabanlı." | 🤖 AI sentezi | [x] [Taberi — Bakara 2:62](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=62&LangID=2) + [x] [Gazali, İhyâ — Archive.org](https://archive.org/search?query=Ghazali+Ihya+Ulum+al-Din+fear+hope) |
| Haşyet | Fatır 35:28 | "Allah'ı tanımanın yarattığı derin saygı-korku. Keltner'in 'awe' araştırmaları." | 🤖 AI sentezi | [x] [Taberi — Fatır 35:28](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=35&tAyahNo=28&LangID=2) + [ ] [Keltner & Haidt, Approaching Awe (2003) — Google Scholar](https://scholar.google.com/scholar?q=Keltner+Haidt+awe+2003) |
| Hüzün | Yusuf 12:17 | "Hz. Yakup yıllarca ağladı. Kur'an bunu zayıflık olarak göstermez. Kübler-Ross'un yas aşamaları." | 🤖 AI sentezi | [x] [İbn Kesir — Yusuf 12:17](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=12&tAyahNo=17&LangID=2) |
| Sekînet | Fetih 48:4 | "'İndirilmiş' bir huzur — insan çabasıyla ulaşılan değil. Equanimity kavramı." | 📚 Klasik tefsir bilgisi + 🤖 modern paralel | [x] [Taberi — Fetih 48:4](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=48&tAyahNo=4&LangID=2) |

---

### 4.4 Savunma mekanizmaları
**Dosya:** `src/i18n/tr.json` → `psychology.sections.savunma`

| Mekanizma | Ayet | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|-----------|------|-------|----------------|-------------------|
| Rasyonalizasyon | Bakara 2:11 | "Yanlış eylemi meşrulaştırmak için mantıklı görünen açıklamalar üretmek." | 🤖 AI sentezi | [x] [Taberi — Bakara 2:11](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=11&LangID=2) + [x] [Anna Freud — Wikipedia](https://en.wikipedia.org/wiki/Anna_Freud) |
| Projeksiyon | Yusuf 12:18 | "Yusuf'un kardeşleri, kendi suçlarını (kıskançlık, plan) kurdurduğun kurtla örttü." | 🤖 AI sentezi | [x] [İbn Kesir — Yusuf 12:18](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=12&tAyahNo=18&LangID=2) |
| İnkâr | Neml 27:14 | "Firavun'un mucizeler karşısındaki tutumu. Gören, anlayan ama kabul etmeyen." | 📚 Klasik tefsir bilgisi | [x] [Taberi — Neml 27:14](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=27&tAyahNo=14&LangID=2) |
| Erteleme | Nisa 4:18 | "Değişimi sürekli ertelemek, hem bir savunma hem bir tuzak." | 🤖 AI sentezi | [x] [Taberi — Nisa 4:18](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=4&tAyahNo=18&LangID=2) |
| Sosyal uyum baskısı | Zuhruf 43:23 | "Her peygamberin karşılaştığı evrensel direnç: 'Atalarımız böyle yapardı.'" | 📚 Klasik tefsir bilgisi | [x] [İbn Kesir — Zuhruf 43:23](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=43&tAyahNo=23&LangID=2) |
| Kibir kalkanı | Bakara 2:206 | "'Allah'tan kork' denince kibri onu günaha sürükler." | 📚 Klasik tefsir bilgisi | [x] [Taberi — Bakara 2:206](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=2&tAyahNo=206&LangID=2) |

---

### 4.5 Müslim / Mü'min / Muhsin dönüşüm aşamaları
**Dosya:** `src/sections/HiddenArchitecture.jsx` → `TRANSFORMATION`

| Aşama | Ayet | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|-------|------|-------|----------------|-------------------|
| Müslim | Hucurat 49:14 | "Sehadet, ritüeller, İslam'ın şartlarını yerine getirmek." | 📚 Klasik tefsir bilgisi | [x] [Taberi — Hucurat 49:14](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=49&tAyahNo=14&LangID=2) |
| Mü'min | Hucurat 49:15 | "Kalbin tasdiki, iç halin amele yansıması." | 📚 Klasik tefsir bilgisi | [x] [İbn Kesir — Hucurat 49:14-15](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=49&tAyahNo=14&LangID=2) |
| Muhsin | Bakara 2:112 | "Allah'ı görüyormuş gibi ibadet etmek — en yüksek manevi hal." (İhsan hadisinden) | 📚 Hadis: Cebrail hadisi (Buhari/Müslim) — doğru referans | [x] [Sunnah.com — Cebrail (İhsan) hadisi](https://sunnah.com/bukhari:50) + [x] [İbn Kesir — Bakara 2:112](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=2&tAyahNo=112&LangID=2) |

---

## 5. ZAMAN YORUMLARI

### 5.1 Leyletu'l-Kadr — Zamanın kalitesi
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ZamanBoyutlari.jsx` → TIMELINE_DATA[0] |
| **Yorum** | "Bir gecelik ibadet 83 yıllık ibadetten değerli — zamanın kalitesi miktarından üstün. İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.'" |
| **Mevcut kaynağı** | 🤖 AI sentezi — Gazali parafrazı doğrulanmamış |
| **Bağlanacak kaynak** | [x] [Taberi — Kadr 97:3](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=97&tAyahNo=3&LangID=2) + [x] [Gazali, İhyâ — Archive.org](https://archive.org/search?query=Ghazali+Ihya+Ulum+al-Din) |

---

### 5.2 Kehf 300/309 Yılı
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ZamanBoyutlari.jsx` → TIMELINE_DATA[2] |
| **Yorum** | "Modern astronomide 300 güneş yılı = 309.017 kamer yılı. Kur'an her ikisini de doğru verir." |
| **Mevcut kaynağı** | 🔬 Astronomi hesabı — doğru. İki topluluk yorumu 🤖 AI sentezi. |
| **Bağlanacak kaynak** | [x] [İbn Kesir — Kehf 18:25](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=18&tAyahNo=25&LangID=2) + [x] [Güneş-Ay takvimi dönüşümü — Wikipedia](https://en.wikipedia.org/wiki/Solar_calendar) |

---

### 5.3 Fussilet 41:9-12 — 6 Kozmik Evre
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ZamanBoyutlari.jsx` → TIMELINE_DATA[3] |
| **Yorum** | "Toplam 2+4+2 = 8 gibi görünür ama değil... 'Yevm' burada kozmolojik evre anlamında." |
| **Mevcut kaynağı** | 🤖 AI sentezi |
| **Uyarı** | ⚠️ Dosyada disclaimer var — sitede gösteriliyor mu? Bu bölüm özellikle dikkatli ele alınmalı. |
| **Bağlanacak kaynak** | [x] [Taberi — Fussilet 41:9](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=41&tAyahNo=9&LangID=2) + [x] [Quran.com — Fussilet 41:9-12](https://quran.com/41/9) |

---

### 5.4 Einstein Göreliliği & Kur'an
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/ZamanBoyutlari.jsx` → ACCORDION_ITEMS[0] |
| **Yorum** | "Einstein göreliliği ile Kur'an'ın zaman yorumu felsefi örtüşme." |
| **Mevcut kaynağı** | 🤖 AI sentezi |
| **Uyarı** | ⚠️ Felsefi analoji olarak sunulsa da bilimsel eşdeğerlik iddiasına dönüşmemeli. |
| **Bağlanacak kaynak** | [x] [Özel görelilik — Wikipedia](https://en.wikipedia.org/wiki/Special_relativity) + [ ] [Quran and modern science — Google Scholar](https://scholar.google.com/scholar?q=Quran+time+relativity+Einstein+philosophical) |

---

## 6. SES / FONETİK YORUMLAR

### 6.1 Sure bazlı fonetik analiz
**Dosya:** `src/sections/SoundArchitecture.jsx` → `SURAS`

| Sure | Yorum | Mevcut Kaynağı | Bağlanacak Kaynak |
|------|-------|----------------|-------------------|
| Müddessir 74:26 | "Tek cümlede iki kez Qaf: azabın darbesi seste yankılanır." | 🤖 AI sentezi — fonetik sembolizm yorumu | [x] [Navid Kermani, God is Beautiful — Amazon](https://www.amazon.com/s?k=Navid+Kermani+God+Beautiful+Quran) + [x] [Quran.com — Müddessir 74:26](https://quran.com/74/26) |
| Meryem 19:13 | "Ha, Nun, Mim — nazal sesler rahmetin yumuşaklığını taşır." | 🤖 AI sentezi | [x] [Angelika Neuwirth, Scripture, Poetry — Amazon](https://www.amazon.com/s?k=Angelika+Neuwirth+Scripture+Poetry+Making+Community+Quran) |
| Kâria 101:1 | "Patlayıcı Qaf ve tınlayan Ra kıyametin sesini taşır." | 🤖 AI sentezi | [x] [Neal Robinson, Discovering the Quran — Amazon](https://www.amazon.com/s?k=Neal+Robinson+Discovering+the+Quran) |
| Rahman 55:1-2 | "Dört yumuşak ses, dört nimetin müziği." | 🤖 AI sentezi | [x] [Kermani, God is Beautiful — Amazon](https://www.amazon.com/s?k=Navid+Kermani+God+Beautiful+Quran) |

**Not:** Dosyanın içinde "Bu gösteri surenin fonetik dokusunu sezgisel olarak temsil eder; kesin bir dilbilimsel ölçüm değil" uyarısı var — bu uyarı kullanıcıya da gösterilmeli.

---

## 7. WOW FACTS — KRİTİK LİSTE

`src/components/WowFacts.jsx` dosyasında **44 hardcoded fact** var. Hepsinin mevcut kaynağı AI sentezi (🤖) olduğu değerlendirilmektedir. Özellikle dikkat edilmesi gerekenler:

| # | Başlık | Uyarı | Doğrulanacak |
|---|--------|-------|--------------|
| 2 | Her Ayette Allah — El-Mücadele | "Her ayette Allah geçer" iddiası — doğru ama nadir bir özellik | [x] [Corpus.quran.com araması](https://corpus.quran.com/search.jsp) |
| 3 | "Allah" Lafzı 2.699 Kez | Sayım metodolojisi | [x] [Corpus.quran.com frekans](https://corpus.quran.com/wordfrequency.jsp) |
| 7 | Bir Eksik Bir Fazla (114 sure, Tevbe-Neml) | Doğru klasik bilgi | [x] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |
| 8 | Fatiha Allah'ı İsmiyle Değil Sıfatlarıyla Tanıtır | Doğru gözlem | [x] [Taberi — Fatiha 1:1](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=1&tAyahNo=1&LangID=2) |
| 12 | Huruf-u Mukattaa 1.400 Yıllık Şifre | "Kesin anlam hala yalnızca Allah katında" — doğru çerçeveleme | [x] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |
| 19 | Son İnen Ayet Tartışması Hala Sürüyor | Doğru — tartışma gerçek | [x] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |
| 22 | Kur'an'da Adıyla Anılan Tek Kadın (Hz. Meryem) | Doğru | [x] [Corpus.quran.com araması](https://corpus.quran.com/search.jsp) |
| 23 | Hz. Musa En Çok Anılan Peygamber | Doğru — 136 kez | [x] [Corpus.quran.com frekans](https://corpus.quran.com/wordfrequency.jsp) |
| 24 | Hz. İsa Hz. Muhammed'den Fazla Anılır | ⚠️ Dikkatli çerçeveleme gerekli | [x] [Corpus.quran.com frekans](https://corpus.quran.com/wordfrequency.jsp) |
| 27 | Hz. Muhammed'in Adı Yalnızca 4 Kez | Doğru — 4 kez (Ahmed dahil) | [x] [Corpus.quran.com araması](https://corpus.quran.com/search.jsp) |
| 31 | Zeyd ibn Harise — Adıyla Anılan Tek Sahabe | ⚠️ "Tek" iddiası doğrulanmalı | [x] [Corpus Coranicum araması](https://corpuscoranicum.de/en) |
| 35 | "Alın" — Beynin Yalan Merkezi | ⚠️ Çağdaş yorum, klasik tefsir farklı | [x] [Taberi — Alak 96:15](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=2&tSoraNo=96&tAyahNo=15&LangID=2) |
| 36 | "Parmak Uçları" — Benzersiz Kimlik | ⚠️ Çağdaş yorum | [x] [İbn Kesir — Kıyamet 75:3](https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo=75&tAyahNo=3&LangID=2) + [x] [Galton, Finger Prints — Archive.org](https://archive.org/details/fingerprints00galtuoft) |
| 37 | "Rahman" — Kur'an'ın Hediye Ettiği İsim | ⚠️ Tarihsel açıdan tartışmalı | [x] [Rahman (ilah) — Wikipedia](https://en.wikipedia.org/wiki/Rahman_(deity)) |
| 41 | Kur'an'da "Çöl" Kelimesi Geçmez | ⚠️ Corpus araştırması yapılmalı | [x] [Corpus.quran.com araması](https://corpus.quran.com/search.jsp) |
| 44 | Kur'an'ın Kendine Verdiği 70+ İsim | ⚠️ 70+ rakamı doğrulanmalı | [x] [Suyuti, el-İtkân — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran) |

---

## 8. MATEMATİKSEL / SAYISAL YORUMLAR

### 8.1 Kelime çifti dengeleri
| Alan | İçerik |
|------|--------|
| **Dosya** | `src/sections/MathMiracle.jsx` |
| **Yorumlar** | Hayat-Ölüm (145/145), Dünya-Ahiret (115/115), Melek-Şeytan (88/88), Gün (365), Ay (12), Deniz/Kara (32/13 = %71.1/%28.9) |
| **Mevcut kaynağı** | 📚 Popüler ilmi i'caz literatüründe yaygın — Abd al-Razzaq Nawfal'a dayanan |
| **Uyarı** | ⚠️ Sayım metodolojisi (hangi kelime formları dahil, hangi dışlanır) corpus araştırmasıyla doğrulanmalı. |
| **Bağlanacak kaynak** | [ ] [Abd al-Razzaq Nawfal, al-I'jaz al-Adadi — Google Scholar](https://scholar.google.com/scholar?q=Abd+al-Razzaq+Nawfal+al-Ijaz+al-Adadi+Quran+1987) + [x] [Corpus Coranicum — Berlin Üniversitesi](https://corpuscoranicum.de/en) + [x] [Corpus.quran.com frekans](https://corpus.quran.com/wordfrequency.jsp) |

---

## 9. ÖNCELİKLİ EYLEM LİSTESİ

### 🔴 Acil — Yanlış veya Yanıltıcı Olabilecek
1. **Nur-u Muhammedi (Katman 6)** — Tartışmalı rivayet. Sitede "tartışmalı" uyarısı gösterilmeli.
2. **"Rahman" Kur'an'ın hediyesi** (WowFacts #37) — Tarihsel açıdan yanlış olabilir.
3. **Zeyd ibn Harise "tek sahabe"** (WowFacts #31) — "Tek" iddiası doğrulanmalı.
4. **Fussilet kozmik evre yorumu** (ZamanBoyutları) — Spekülatif, disclaimer gösterilmeli.
5. **"Çöl" kelimesi geçmez** (WowFacts #41) — Corpus araştırması yapılmadan iddia edilmemeli.

### 🟡 Öncelikli — Kaynak Bağlanmalı
6. **Enzelnâ/demir** — Klasik müfessir yorumu eklenmeli.
7. **Alaka/embriyoloji** — Moore tartışması dipnota alınmalı.
8. **Nâsiye/alın** — Klasik tefsir bağlamı eklenmeli.
9. **Kelime çifti istatistikleri** — Corpus doğrulaması yapılmalı.
10. **Zemahşeri alıntısı** — Tam metin bulunmalı.
11. **Huruf-u mukattaa tematik yorumlar** — "Alimlerin aile olarak görür" doğrulanmalı.
12. **Tüm İmam Gazali alıntıları** — Parafraz mı, gerçek alıntı mı netleştirilmeli.

### 🟢 Doğruluğu Yüksek — Sadece Kaynak Bağlanacak
13. Raymond Farrin atfı (ring composition)
14. "Mûsi'ûn" dilbilgisel analizi
15. Sui generis edebi form
16. İltifat sanatı
17. Hz. Muhammed'in adı 4 kez
18. Hz. Musa en çok anılan peygamber
19. Muhsin/Mü'min/Müslim — Cebrail hadisi referansı

---

## 10. ÖNERİLEN KAYNAKLAR

### Klasik Tefsir (Birincil) — altafsir.com üzerinden erişilebilir
- [**Taberi**, Câmiu'l-Beyân](https://www.altafsir.com) (tTafsirNo=2)
- [**İbn Kesir**, Tefsîru'l-Kur'âni'l-Azîm](https://www.altafsir.com) (tTafsirNo=74)
- [**Fahreddin Razi**](https://en.wikipedia.org/wiki/Fakhr_al-Din_al-Razi), Mefâtîhu'l-Gayb — felsefi/kelami
- [**Zemahşeri**](https://en.wikipedia.org/wiki/Al-Zamakhshari), el-Keşşâf — dilbilimsel
- [**Kurtubi**](https://en.wikipedia.org/wiki/Al-Qurtubi), el-Câmi' li-Ahkâmi'l-Kur'an — fıkhi
- [**İbn Âşur**](https://en.wikipedia.org/wiki/Ibn_Ashur), et-Tahrîr ve't-Tenvîr — modern klasik

### Kur'an İlimleri
- [**Suyuti**, el-İtkân fî Ulûmi'l-Kur'an — Archive.org](https://archive.org/search?query=Suyuti+al-Itqan+fi+Ulum+al-Quran)
- [**Zerkeşi**](https://en.wikipedia.org/wiki/Al-Zarkashi), el-Burhân fî Ulûmi'l-Kur'an — belâgat ağırlıklı

### Tasavvuf / Psikoloji
- [**Gazali**, İhyâu Ulûmi'd-Din — Archive.org](https://archive.org/search?query=Ghazali+Ihya+Ulum+al-Din)
- [**Gazali**, Mişkâtu'l-Envâr — Archive.org](https://archive.org/search?query=Ghazali+Mishkat+al-Anwar)
- [**İbn Kayyim**](https://en.wikipedia.org/wiki/Ibn_Qayyim_al-Jawziyya), Medâricu's-Sâlikîn — nefs mertebeleri
- [**İbn Kayyim**](https://en.wikipedia.org/wiki/Ibn_Qayyim_al-Jawziyya), İğâsetu'l-Lehfân — kalp hâlleri

### Lügat / Terminoloji
- [**Râgıb el-İsfahanî**, el-Müfredât — Archive.org](https://archive.org/search?query=Raghib+al-Isfahani+al-Mufradat+Quran)
- [**İbn Manzur**, Lisânü'l-Arab — Archive.org](https://archive.org/search?query=Lisan+al-Arab+Ibn+Manzur)

### Akademik / Modern
- [**Raymond Farrin**, Structure and Quranic Interpretation (2014) — Amazon](https://www.amazon.com/s?k=Raymond+Farrin+Structure+Quranic+Interpretation)
- [**Navid Kermani**, God is Beautiful (2015) — Amazon](https://www.amazon.com/s?k=Navid+Kermani+God+Beautiful+Quran)
- [**Angelika Neuwirth**, Scripture, Poetry and the Making of a Community (2014) — Amazon](https://www.amazon.com/s?k=Angelika+Neuwirth+Scripture+Poetry+Making+Community+Quran)
- [**Neal Robinson**, Discovering the Quran (2003) — Amazon](https://www.amazon.com/s?k=Neal+Robinson+Discovering+the+Quran)
- [**Michel Cuypers**, The Composition of the Quran (2012) — Amazon](https://www.amazon.com/s?k=Michel+Cuypers+Composition+Quran+Rhetorical)
- [**Mustansir Mir**, Coherence in the Quran (1986) — Amazon](https://www.amazon.com/s?k=Mustansir+Mir+Coherence+Quran)
- [**Abd al-Razzaq Nawfal**, al-I'jaz al-Adadi (1987) — Google Scholar](https://scholar.google.com/scholar?q=Abd+al-Razzaq+Nawfal+al-Ijaz+al-Adadi+Quran)

### Corpus / Dijital Araçlar
- [**Corpus.quran.com** — Oxford University kelime frekansı ve morfoloji](https://corpus.quran.com)
- [**Corpus Coranicum** — Berlin-Brandenburgische Akademie der Wissenschaften](https://corpuscoranicum.de/en)
- [**Tanzil.net** — Arapça metin araması](https://tanzil.net)
- [**Quran.com** — Ayet bağlamı ve çeviriler](https://quran.com)
- [**Sunnah.com** — Hadis kaynakları](https://sunnah.com)
