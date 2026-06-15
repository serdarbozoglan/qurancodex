# Anasayfa Yeniden Yapılandırma — Envanter Mapping

**Tarih:** 2026-06-15
**Amaç:** Anasayfanın 14 derin bölümünü "kart + Keşfet →" formatına indirmeden ÖNCE, her bölümün derinliğinin hedef tool sayfasında zaten karşılığı olup olmadığını ortaya koymak. Kullanıcının uyarısı: *"Katmanlama ancak alt katman varsa çalışır. Yoksa katmanlama değil, silme olur."*

---

## Mevcut Anasayfa Render Sırası

Hero + 20 bölüm. **Navigasyon/CTA bölümleri** (kart hedefi olmayan, zaten yönlendirici): `PathCards`, `AllTopics`, `ToolsHighlight`, `ToolsShowcase`, `TefekkurHighlight`, `Conclusion`. Bu altısı katmanlama tartışmasının dışında — anasayfa iskeletinin parçası, kalacak.

**Gerçek katmanlama tartışması olan 14 bölüm** aşağıdaki tabloda.

---

## Envanter Mapping Tablosu

Kısaltmalar:
- **TAM** = bölümün tüm derinliği (panel/stat/diyagram dahil) hedef sayfada zaten mevcut → karta indirmek güvenli
- **KISMEN** = konu hedef sayfada işleniyor ama anasayfadaki spesifik paneller/derinlik orada yok → karta indirmeden ÖNCE küçük içerik göçü gerekiyor
- **YOK** = konu için dedikate tool sayfası yok → karta indirmek = içerik silmek olur, ÖNCE yeni tool sayfası gerekiyor

| # | Anasayfa Bölümü | İçerik özeti (ölçülen) | Hedef sayfa | Derinlik | Pilot öncesi aksiyon |
|---|---|---|---|---|---|
| 1 | **LinguisticDNA** (`/sections/LinguisticDNA.jsx` — 880 satır) | 4 StatCard · 14 mukattaa harfi grid · 4 expand panel (Elif-Lâm-Mîm/Elif-Lâm-Râ/Havâmîm/Tâ-Sîn — her panel 5-7 sûre + örüntü + 5-6 bullet) · 3 keşif kartı (12/12 · 7/7 · 1400+) · sonda 3 ilgili sûre linki | **YOK** (yakınlar: `/atlas/munasebat`, `/graf/kelime-isi`, `/arac/ilk-son-kelimeler`) | **YOK** | Yeni tool sayfası gerek: `/arac/mukattaa` veya `/atlas/dilsel-dna`. 14 harf + 4 grup + 3 keşif paneli oraya taşınmalı. Karta indirme **yapma** — önce hedef sayfa yarat. |
| 2 | **ImpossibleRhythm** (`/sections/ImpossibleRhythm.jsx` — 1057 satır) | Şiir/Kur'an/düzyazı karşılaştırma · 16 aruz vezni tablosu · ritim örnekleri (Necm 53, Kevser 108, Duhâ 93) · 22 motion.div + 4 array | **YOK** (yakını: `/arac/yeminler` — `KuranYeminleri` ritim/aksâm tarafıyla dolaylı) | **YOK** | Yeni tool sayfası gerek: `/arac/ritim` veya `/atlas/vezin`. 16 vezin tablosu + 3 karşılaştırma orada yaşamalı. |
| 3 | **QuranRhetoric** (`/sections/QuranRhetoric.jsx` — 834 satır) | Belâgat araçları (tezad · istiare · iltifât) · 7 array · 3 sûre linki (Rahmân 55, Vâkıa 56, Yâsîn 36) | `/arac/retorik` (`KuranRetorigi` — 1191 satır) | **TAM mı KISMEN mi: doğrulanmalı** | KuranRetorigi.jsx'in section'daki tüm araçları (tezad/istiare/iltifât + benzetme/teşbih) kapsadığını **5 dakikada doğrula**. Kapsıyorsa TAM, kart-ize güvenli. Kapsamıyorsa eksik araçları ekle. |
| 4 | **QuranDua** (`/sections/QuranDua.jsx` — 1062 satır) | Tematik dua koleksiyonu · 22 motion.div · 2 array · sûre linkleri (Fâtiha 1, Bakara 2:186, Mü'min 40:60) | `/arac/dualar` (`DuaVerses` — 537 satır · subtitle "11 kategori") | **KISMEN** (kuvvetli ihtimal) | Section 1062 satır, tool 537 satır — section daha derin görünüyor. Tool'da olmayan tematik gruplar var mı diye doğrulanmalı; eksikse göç. |
| 5 | **SoundArchitecture** (`/sections/SoundArchitecture.jsx` — 1435 satır) | Azap ↔ Rahmet sesleri · amigdala/korteks analojisi · Rahmân 55, Kâria 101, Meryem 19 örnekleri · 30 motion.div · 5 array · 2 glass panel | **YOK** | **YOK** | Yeni tool: `/arac/ses-mimarisi` veya `/atlas/fonetik`. Ses-anlam paralelliği matrisi orada yaşamalı. Karta indirme = içerik silme. |
| 6 | **HiddenArchitecture** (`/sections/HiddenArchitecture.jsx` — 1116 satır) | Ring composition (Farrin 2014) · 2 detaylı halka diyagramı (Fâtiha 1 — 7 ayet A-B-C-D-C'-B'-A' · Âyetel Kürsî 2:255 — 7 bölüm simetri) · 26 motion.div · 5 array · 6 glass-card | **YOK** (yakını: `/atlas/munasebat` — sûreler arası bağ, ama halka kompozisyon yok) | **YOK** | Yeni tool: `/arac/halka-kompozisyon` veya `/atlas/simetri`. Fâtiha & Âyetel Kürsî diyagramları oraya. + Nûr 24 vb. üçüncü-dördüncü örnek eklemek için uygun zemin. |
| 7 | **ScientificSigns** (`/sections/ScientificSigns.jsx` — 615 satır) | Demir (Hadid 57) · Genişleyen evren (Zâriyât 51) · Denizler (Rahmân 55) · Embriyoloji (Mü'minûn 23) · 2 tab-toggle · `criticalNote` bağlantıları | `/atlas/doga` = **Tabiat Atlası** (`DogaAtlasi` — 1441 satır, "Kevnî ayetler · hayvan · bitki · gök · tabiat" + yeni Gök Cisimleri tab'ı) | **KISMEN** (kuvvetli ihtimal) | Tabiat Atlası geniş ama section'daki demir/embriyo nüansları (`criticalNote`'lar dahil) orada aynı derinlikte var mı kontrol edilmeli. Eksikse 4 ayet için özel kartlar ekle. |
| 8 | **HistoricalProof** (`/sections/HistoricalProof.jsx` — 343 satır) | Firavun bedeni (Yûnus 10:92) · Hâmân (Kasas 28:38) · Rûm 30:2-4 kehaneti · 12 motion.div · 1 array | `/atlas/kavim` = **Kavimler Atlası** (`KavimlerAtlasi` — 1777 satır · "Âd · Semûd · Lût · Medyen · Sebe'") | **KISMEN** | Kavimler Atlası'nda Firavun/Hâmân/Bizans bağlamı kısmen var (Firavun kavmi bağlamında); ama "tarihsel doğrulama / arkeoloji" açısı orada işlenmiyor olabilir. Doğrulanmalı; eksikse Firavun bedeni + Rûm kehaneti için "arkeolojik kanıt" mini-bölüm. |
| 9 | **LivingPreservation** (`/sections/LivingPreservation.jsx` — 360 satır) | Birmingham elyazması (2015) · hâfız zinciri · isnad · Hicr 15:9 · 14 motion.div · 1 array | `/atlas/kiraat` = **Kıraat Atlası** (`KiraatAtlasi` — 1675 satır · "10 kanonik kıraat · Hafs · Verş") | **KISMEN** | Kıraat Atlası kıraat çeşitliliği üzerinde — section "tek metin, sıfır varyasyon + Birmingham + hâfız zinciri" üzerinde. Konular **örtüşüyor ama açı farklı**. Kıraat Atlası'na "Korunma" tab'ı eklemek veya yeni `/arac/koruma-zinciri` yaratmak. |
| 10 | **ZeroRedundancy** (`/sections/ZeroRedundancy.jsx` — 564 satır) | Refrain analizi (Rahmân 31x · Mürselât 10x · Kamer 4x) · Musa kıssası çoklu perspektif · korpus analizi · 4 counter · 3 glass-card · 14 motion.div | **YOK** (yakını: `/graf/kelime-isi`, `/arac/ilk-son-kelimeler`) | **YOK** | Yeni tool: `/arac/tekrar-anatomi` veya `/atlas/refren`. 3 büyük refrain örneği + Musa kıssası çoklu okuma orada. |
| 11 | **Highlights** (`/sections/Highlights.jsx` — 474 satır) | Kompakt WowFacts (prefrontal korteks 96:15-16 · parmak izleri 75:3-4 · modüler anlatı · kelime haritası · zaman esnekliği · iltifât) · 12 motion.div · 1 array | `/arac/wow` (`WowFacts` — 1368 satır) **ve** `/arac/kurani-tani` (`WowFacts` ile aynı component'in label'i — "Kur'an'ı Tanı") | **TAM** (kuvvetli ihtimal) | Highlights, WowFacts'in özet/highlight'ı zaten — by design. Doğrulanması: Highlights'taki 6 fact'in WowFacts/Kur'an'ı Tanı'da hepsi var mı. Varsa TAM, kart-ize en kolay bölüm. Yoksa eksikleri WowFacts'e ekle. |
| 12 | **AllahKendiniTanitir** (`/sections/AllahKendiniTanitir.jsx` — 271 satır) | Esmâ'nın giriş kapısı: 99 ismin tematik giriş + 8 motion.div · 1 array | `/arac/esma-frekans` (`EsmaFrekans` — 3795 satır · flagship tool) | **TAM** | Esmâ-i Hüsnâ tool'u 99 isim · frekans · tematik gruplama hepsini barındırıyor. Section zaten kapı görevinde — kart-ize en güvenli bölüm. |
| 13 | **HumanDefinition** (`/sections/HumanDefinition.jsx` — 1244 satır) | İnsan tanımı — çoklu boyut (nefs · fıtrat · halife · imtihan · hilkat) · 32 motion.div · 5 array · 5+ h3 başlık (tab benzeri) | Kısmen `/atlas/nefs-mertebeleri` (`NefisMertebeleri` — 1124 satır · "7 mertebe") | **KISMEN** (önemli boşluk) | NefisMertebeleri sadece nefs eksenini kapsar. HumanDefinition'da olan fıtrat, halife, imtihan, hilkat boyutları **dedikate tool'da yok**. Aksiyon: ya `/atlas/insan` yeni sayfası, ya NefisMertebeleri'nin scope'unu genişlet ve "İnsan Atlası"na çevir. |
| 14 | **PsychologySection** (`/sections/PsychologySection.jsx` — 700 satır) | Nefs · kalp · korku · savunma mekanizması · Yûsuf travma-iyileşme · sosyal · anlam · modern karşılaştırma · 18 motion.div · 4 tab-toggle · 3 array | Kısmen `/atlas/nefs-mertebeleri` (nefs ekseni) ve `/atlas/kissa` (Yûsuf kıssası) | **KISMEN** | Yûsuf travma boyutu KissaAtlas'ta var; nefs boyutu NefisMertebeleri'nde var. Ama "kalp · korku · savunma mekanizması · sosyal psikoloji · modern karşılaştırma" hiçbir tool'da derinlikli işlenmiyor. Aksiyon: yeni `/atlas/psikoloji` veya HumanDefinition ile birleşik "İnsan Atlası". |

---

## Özet — Pilot Sırası Önerisi

Tablodaki **Derinlik** kolonuna göre üç katmana ayrılıyor:

### Katman A — KART-İZE GÜVENLİ (1 bölüm + 2 KISMEN'e indi)
- **#12 AllahKendiniTanitir** → `/arac/esma-frekans` (TAM) — **PILOT 1 TAMAMLANDI (commit f98d940)**
- ~~#11 Highlights → /arac/wow~~ → **KISMEN'E İNDİ** (Pilot 1 sonrası doğrulama 2026-06-15 gece): 6/3 eksik. WowFacts'te var: Prefrontal Korteks, Parmak İzleri, Zaman Esnekliği. WowFacts'te YOK: Modüler Anlatı, Kelime Haritası, İltifât. → Kart-ize öncesi 3 fact'in WowFacts'e eklenmesi gerek.
- ~~#3 QuranRhetoric → /arac/retorik~~ → **KISMEN'E İNDİ** (Pilot 1 sonrası doğrulama): Odak farkı var. Anasayfa QuranRhetoric = **retorik sorular** (QUESTION_TYPES, FAMOUS_QUESTIONS, SURAH_DENSITY arrays) — Rahmân/Vâkıa/Yâsîn soru zincirleri. Tool `/arac/retorik` = **belagat araçları** (Tezad · İstiare · İltifât). → Yeni tab "Retorik Sorular" tool'a eklenmeli veya yeni `/arac/sorular` route'u.

### Katman B — KÜÇÜK İÇERİK GÖÇÜ ÖNCE (5 bölüm)
- **#4 QuranDua** → `/arac/dualar` (KISMEN)
- **#7 ScientificSigns** → `/atlas/doga` (KISMEN)
- **#8 HistoricalProof** → `/atlas/kavim` (KISMEN — Firavun arkeolojisi + Rûm kehaneti tab/kart eklenmeli)
- **#9 LivingPreservation** → `/atlas/kiraat` veya yeni `/arac/koruma-zinciri` (KISMEN)
- **#13 HumanDefinition** + **#14 PsychologySection** → İkisini birleştir, `/atlas/insan` (KISMEN — büyük boşluk)

### Katman C — YENİ TOOL SAYFASI ÖNCE (4 bölüm — kullanıcının uyarısının kritik vurduğu yer)
- **#1 LinguisticDNA** → `/arac/mukattaa` (YENİ)
- **#2 ImpossibleRhythm** → `/arac/ritim` veya `/atlas/vezin` (YENİ)
- **#5 SoundArchitecture** → `/arac/ses-mimarisi` (YENİ)
- **#6 HiddenArchitecture** → `/arac/halka-kompozisyon` (YENİ)
- **#10 ZeroRedundancy** → `/arac/tekrar-anatomi` (YENİ)

**5 bölümün hedef sayfası yok.** Bu bölümler karta indirilirse içerik *anasayfadan değil siteden* kaybolur. Önce yeni tool sayfaları yaratılmalı.

---

## 6 Kapı Önerisi (envantere göre, gerçek route'larla)

Kullanıcının önerdiği 6 kapıyı **gerçek envantere göre** yeniden kurarsak:

| Kapı (hook) | Kapsadığı section'lar | Hedef route'lar |
|---|---|---|
| **Arapça bilmeden görebileceğin mimari** | LinguisticDNA · ImpossibleRhythm · SoundArchitecture · HiddenArchitecture · ZeroRedundancy | (5 yeni sayfa gerek — bu kapı dolu görünür ama içi şu an boş) |
| **Veriyle keşfet, görselle anla** | (data tool'ları) | `/graf/kelime-isi` · `/graf/ayet` · `/graf/zaman` · `/graf/karsilastir` · `/graf/kavram` · `/graf/diyalog` · `/graf/semantik` · `/arac/ilk-son-kelimeler` |
| **Kur'an'ın dili nasıl çalışır** | QuranRhetoric · QuranDua | `/arac/retorik` · `/arac/dualar` · `/arac/yeminler` · `/atlas/furuk` · `/atlas/mesel` · `/arac/renkler` |
| **23 yıla yayılan insan hikâyeleri** | (kıssa odaklı) | `/atlas/kissa` · `/atlas/peygamber` · `/atlas/kavim` · `/atlas/kadinlar` · `/atlas/munafik` · `/arac/iblis-seytan` · `/arac/sebebi-nuzul` |
| **1.400 yıl önceki kevnî işaretler** | ScientificSigns · HistoricalProof | `/atlas/doga` (Tabiat) · `/atlas/kavim` · `/atlas/sunnetullah` |
| **Kur'an seni nasıl tanımlıyor?** | HumanDefinition · PsychologySection · AllahKendiniTanitir | `/arac/esma-frekans` · `/atlas/nefs-mertebeleri` · `/atlas/insan` (yeni) · `/arac/wow` |

Not: İlk kapı şu an *vaad ettiği derinliği barındırmıyor* — eğer 5 yeni sayfa yaratılmazsa bu kapıyı 6 kapıdan çıkarmak gerekebilir, veya 5 yeni sayfa Pilot 0'a koyulmalı.

---

## Sonraki Adımlar

1. Bu envanter dosyasını kullanıcıyla gözden geçir.
2. Birlikte karar ver: Pilot **Katman A**'dan mı (güvenli, hızlı kazanım) yoksa **Katman C**'den (asıl mimari boşluğu kapatma) mi başlasın?
3. Karara göre tek bölümle pilot başlat → sonuç → onay → çoğalt.
