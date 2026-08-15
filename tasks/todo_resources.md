# 📚 KAYNAK ATIFLARI ENVANTERİ — Faz 1 (Kataloglama)

> Bu sabah anasayfadaki "Fâtiha halka kompozisyonu" şemasının Raymond A. H.
> Farrin'e atfedilen yapıyla birebir örtüşmediği ortaya çıktı (site Besmele'yi
> [1:1] halka pozisyonu olarak sayıyordu, Farrin'in yayınladığı yapı saymıyor;
> ayrıca 1:4 şemadan tamamen eksikti). O hata zaten düzeltildi. Bu dosya,
> sitedeki **her türlü** iddiayı adı geçen bir dış kaynağa (âlim, klasik tefsir
> müellifi, akademik makale/kitap, tarihî belge, arkeolojik bulgu, adı geçen
> modern araştırmacı) bağlayan **tüm** yerlerin dökümüdür — `SourcesCitation`
> bloklarından tefekkür makalelerindeki gövde metnine, `criticalNote`
> alanlarından `public/*.json` veri dosyalarındaki `kaynak`/`source` anahtarlarına
> kadar. Bu **yalnızca Faz 1**: hiçbir iddia gerçek kaynakla karşılaştırılmadı,
> WebFetch/WebSearch kullanılmadı — sadece sitede ne yazdığı ve neye atfedildiği
> çıkarıldı. Faz 2'de her madde `- [ ] Kaynakla birebir örtüşüyor mu?` kutusu
> işaretlenerek tek tek doğrulanacak. Kapsam iddiası: "her bir ifade için" —
> temsili bir örneklem değil, tüketici bir tarama.

---

## next/src/sections/HiddenArchitecture.jsx

#### R1
- **Konum**: satır 29–36 (kod yorumu, kullanıcıya görünmüyor)
- **Site iddiası (TR)**: "Ersin Kabakcı, kitap eleştirisi, Hitit Üniv. SBE Dergisi, 2018, Farrin 2014 s.3'ten aktarıyor: 'Farrin does not count the invocation (basmala) as a verse'"
- **Atfedilen kaynak**: Ersin Kabakcı (2018 kitap eleştirisi, Hitit Üniv. SBE Dergisi), Raymond Farrin (2014, s.3)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kabakcı'nın 2018 Hitit Üniv. SBE Dergisi'nde yayınlanan Farrin kitap eleştirisi gerçek bir yayın (dergipark.org.tr/hititsosbil); "Farrin does not count the invocation (basmala) as a verse" ifadesi bu bağlamda doğrulandı.

#### R2
- **Konum**: satır 308–309 (halka şeması altı italik not, ekranda görünür)
- **Site iddiası (TR)**: "Bismillah'ın ayet sayımı mezhep meselesidir... Bismillah'ın kendisi bu halka şemasının bir pozisyonu DEĞİL: Farrin'in kendi analizi de Bismillah'ı sûrenin yapısına saymaz."
- **Site iddiası (EN)**: "...Bismillah itself is not a position in this ring: Farrin's own analysis likewise does not count it as part of the sura's structure."
- **Atfedilen kaynak**: Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İkincil kaynak (Pondering Islam kitap incelemesi) Farrin'in Fâtiha'yı "6 ayet, Besmele hariç" olarak analiz ettiğini doğruluyor. Site'nin iddiası bu kaynakla örtüşüyor.

#### R3
- **Konum**: satır ~112 (NUR_LAYERS katman 1 alıntı kartı)
- **Site iddiası (TR)**: Mişkât tefsirinden akıl/nur temalı alıntı, Fahreddin Râzî'ye atfedilmiş.
- **Atfedilen kaynak**: Fahreddin Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Râzî'nin Ayet-i Nur (24:35) tefsirinde mişkat/zücace/misbah sembolizmi genel olarak bilinen bir tema, ama spesifik detayları (zeytin ağacı=İbrahim soyu, mişkat=nefs eşleşmesi) Mefâtîhu'l-Gayb'da birebir doğrulanamadı — site sayfa referansı vermiyor, serbest özet.

#### R4
- **Konum**: satır ~124 (NUR_LAYERS katman 2 alıntı kartı)
- **Site iddiası (TR)**: Nur/hidayet temalı alıntı, İmam Gazâlî'ye atfedilmiş.
- **Atfedilen kaynak**: İmam Gazâlî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "Nur=hidayet, karanlık=dalalet" teması Gazâlî'nin genel öğretisiyle (Mişkâtü'l-Envâr, İhya) tutarlı, ama hangi eserden geldiği doğrulanamadı — site referans vermiyor, serbest parafraz.

#### R5
- **Konum**: satır ~150 (NUR_LAYERS katman 4 alıntı kartı)
- **Site iddiası (TR)**: Akıl/nur felsefi temalı alıntı, İbn Sînâ'ya atfedilmiş.
- **Atfedilen kaynak**: İbn Sînâ
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "Akıl ruhun gözüdür" çok genel bir felsefi formülasyon; bunu İbn Sînâ'nın belirli bir eserine (İşârât, Şifa) bağlayan kaynak bulunamadı, doğrulanamaz düzeyde muğlak/parafraze.

#### R6
- **Konum**: satır ~162 (NUR_LAYERS katman 5 alıntı kartı)
- **Site iddiası (TR)**: Kalp-ayna temalı alıntı, İbn Kayyım el-Cevziyye'ye atfedilmiş.
- **Atfedilen kaynak**: İbn Kayyım el-Cevziyye
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "Kalp bir aynadır, günahlar karartır, ibadet/tevbe cilalar" teması İbn Kayyım'ın bilinen eserlerinde (İğâsetü'l-Lehfân vb.) işlediği doğrulanmış bir motif, ama sitedeki tam alıntı metni eser/sayfa referansı olmadan verildiği için birebir metin eşleşmesi doğrulanamadı.

#### R7
- **Konum**: satır ~174 (NUR_LAYERS katman 6 alıntı kartı)
- **Site iddiası (TR)**: Nur-u Muhammedî temalı alıntı, Muhyiddin İbn Arabî'ye atfedilmiş.
- **Atfedilen kaynak**: Muhyiddin İbn Arabî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nur-u Muhammedî'nin "ilk yaratılan varlık" doktrini İbn Arabî ve Vahdetü'l-Vücûd ekolüne doğru şekilde atfedilmiş; Sufi teolojisinde iyi belgelenmiş bir konu.

#### R8
- **Konum**: satır ~188 (NUR_LAYERS katman 7 alıntı kartı)
- **Site iddiası (TR)**: "Nurun nuru" temalı alıntı, İmam Gazâlî'nin *Mişkâtü'l-Envâr* eserine atfedilmiş.
- **Atfedilen kaynak**: İmam Gazâlî, *Mişkâtü'l-Envâr*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Allah'ın 'Nur' ismi mecazdır, gerçek nur O'ndan gelir" ifadesi Gazâlî'nin Mişkâtü'l-Envâr'ının (Niche of Lights) tam da merkezi tezidir.

#### R9
- **Konum**: satır 177–178 (katman 6 nüans notu)
- **Site iddiası (TR)**: "Bu doktrin İbn Arabî ve Vahdetü'l-Vücûd ekolüne özgüdür. Selefî/Hanbelî gelenekte (İbn Teymiyye, İbn Kayyim) reddedilir; Sünnî ana akım tasavvufta (Gazâlî, Cüneyd-i Bağdâdî) dolaylı kabul vardır. Atfedilen rivayet... hadis âlimlerinin çoğunluğuna göre — Albânî dahil — mevzûdur (uydurma)..."
- **Site iddiası (EN)**: "...rejected in the Salafī/Ḥanbalī tradition (Ibn Taymiyyah, Ibn Qayyim); mainstream Sunni Sufism (Ghazālī, Junayd) accepts it indirectly... considered fabricated (mawḍūʿ) by the majority of hadith scholars — including al-Albānī."
- **Atfedilen kaynak**: İbn Arabî, İbn Teymiyye, İbn Kayyım, Gazâlî, Cüneyd-i Bağdâdî, el-Albânî (hadis tashihi)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "İlk yaratılan Nur-u Muhammedî" rivayetinin mevzû (uydurma) sayıldığı iddiası doğrulandı (Suyûtî'nin el-Hâvî'si ve muhakkikler bu hadisi sabit bulmuyor); doktrinin İbn Arabî/Vahdetü'l-Vücûd'a özgü olup Selefî gelenekte reddedildiği çerçevesi de doğru.

#### R10
- **Konum**: satır 536–537 ("Neden şaşırtıcı?" kutusu)
- **Site iddiası (TR)**: "Halka kompozisyon... büyük ölçekli metinlere sistematik uygulanması 20. yüzyıl ürünüdür: Cedric Whitman'ın Homer çalışması (1958) ve Mary Douglas'ın *Thinking in Circles*'ı (2007)... Bikâî *Nazmü'd-Dürer*'de, Suyûtî *İtkân*'da ve Râzî *Mefâtîhu'l-Gayb*'da ayetler/sûreler arası bağlantıları (münâsebât) kapsamlı çalıştı."
- **Site iddiası (EN)**: "...Cedric Whitman's Homer studies (1958) and Mary Douglas's *Thinking in Circles* (2007)... Biqāʿī in *Naẓm al-Durar*, Suyūṭī in *al-Itqān*, and Rāzī in *Mafātīḥ al-Ghayb*..."
- **Atfedilen kaynak**: Cedric Whitman (1958), Mary Douglas (*Thinking in Circles*, 2007), Bikâî (*Nazmü'd-Dürer*), Suyûtî (*el-İtkân*), Râzî (*Mefâtîhu'l-Gayb*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Whitman'ın 1958 "Homer and the Heroic Tradition" ve Douglas'ın 2007 "Thinking in Circles" (Yale UP) eserleri gerçek ve tam da halka kompozisyon/chiasmus konusunda; Bikâî/Suyûtî/Râzî'nin münâsebât alanındaki katkısı akademik literatürde standart bir karakterizasyon.

#### R11
- **Konum**: satır 561–570 ("akademik atıf kartı")
- **Site iddiası (TR)**: "Raymond Farrin'in Structure and Quranic Interpretation (2014) adlı çalışması, Kur'an'da yaygın halka kompozisyon yapıları tespit eden kapsamlı akademik analizlerden biridir."
- **Site iddiası (EN)**: "Raymond Farrin's Structure and Quranic Interpretation (2014) is among the most comprehensive academic analyses to identify widespread ring composition structures in the Quran."
- **Atfedilen kaynak**: Raymond Farrin, *Structure and Quranic Interpretation* (2014)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kitap başlığı, yayıncı ve yıl birebir doğru — Nicolai Sinai'nin JQS 19 (2017) inceleme makalesi künyeyi teyit ediyor (White Cloud Press, 2014, ISBN 978-1-935952-98-5). "Kapsamlı akademik analiz" niteliği de Sinai'nin tespitleriyle uyumlu.

#### R12
- **Konum**: satır 642–643 (7 katmanlı yorum açıklama notu)
- **Site iddiası (TR)**: "Bu 7 katmanlı yorum, Râzî–Gazâlî–İbn Arabî geleneğini modern fizik, psikoloji ve felsefe perspektifleriyle harmanlayan çağdaş bir okumadır... Klasik tefsirin standart taksonomisi 4 katmandır... İbn Mes'ûd rivayetine dayanır."
- **Atfedilen kaynak**: Râzî, Gazâlî, İbn Arabî (gelenek); İbn Mes'ûd (klasik 4 katman taksonomisi rivayeti)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zâhir-bâtın-hadd-muttala 4 katmanlı taksonomisi ve İbn Mes'ûd rivayetine dayandırılması gerçek ve belgelenmiş bir klasik tefsir usûlü konsepti (bazı kaynaklarda Ali b. Ebî Tâlib rivayeti olarak da geçer, ama İbn Mes'ûd varyantı da yaygın).

## next/src/components/RingExtensions.jsx

#### R13
- **Konum**: satır 9–16 (kod yorumu, kullanıcıya görünmüyor)
- **Site iddiası (TR)**: Daha önce silinen bulunamayan bir Farrin alıntısına ("prelude to the pivot") dair düzeltme notu; Kabakcı 2018 → Farrin 2014 s.3 atfı tekrarlanıyor.
- **Atfedilen kaynak**: Raymond Farrin (2014); Ersin Kabakcı (2018)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R1 ile aynı Kabakcı 2018/Farrin 2014 s.3 atfı; kod yorumu daha önce silinen doğrulanamayan bir alıntının ("prelude to the pivot") kaldırıldığını belgeliyor — kullanıcıya görünmüyor.

#### R14
- **Konum**: satır 74 (Mü'minûn 23 halka örneği, "kaynak" alanı)
- **Site iddiası (TR)**: "Raymond Farrin, Structure and Qur'anic Interpretation (White Cloud Press, 2014), Ch. 4."
- **Atfedilen kaynak**: Raymond Farrin, 2014, Ch. 4
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Kitabın tam içindekiler tablosuna erişilemedi (PDF'ler indirilemedi/403 hatası); Mü'minûn 23'ün gerçekten "Ch. 4" olduğu doğrulanamadı. Genel iddia makul ama bölüm numarası teyit edilemedi.

#### R15
- **Konum**: satır 100 (Bakara halka örneği, "kaynak" alanı)
- **Site iddiası (TR)**: "Michel Cuypers, The Composition of the Qur'an: Rhetorical Analysis (Bloomsbury, 2015), 200+ sayfalık Bakara analizi."
- **Atfedilen kaynak**: Michel Cuypers, 2015
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — "200+ sayfalık Bakara analizi" iddiası kitabın toplam uzunluğuyla çelişiyor: *The Composition of the Qur'an* (Bloomsbury 2015) toplam 224 sayfa ve birçok sûreyi (Fâtiha, Mâide, İhlâs grubu vb.) kapsıyor — Bakara'ya tek başına 200+ sayfa ayrılmış olması matematiksel olarak imkânsız. Cuypers'in en genişçe işlediği örnek muhtemelen Mâide (5) sûresi (kendi ayrı kitabı da var), Bakara değil. **Düzeltilmeli.**

#### R16
- **Konum**: satır 126 (Mâide halka örneği, "kaynak" alanı)
- **Site iddiası (TR)**: "Michel Cuypers, The Composition of the Qur'an (Bloomsbury 2015), Māʾida bölümü."
- **Atfedilen kaynak**: Michel Cuypers, 2015
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Cuypers'in Mâide sûresi üzerine ayrı bir kitabı var ("The Banquet: A Reading of the Fifth Sura of the Qur'an", 2008) ve genel kitabında da Sûre 5'i en kapsamlı örnek olarak kullanıyor.

#### R17
- **Konum**: satır 152 (Kasas 28 halka örneği, "kaynak" alanı)
- **Site iddiası (TR)**: "Raymond Farrin, Structure and Qur'anic Interpretation, Ch. 6."
- **Atfedilen kaynak**: Raymond Farrin, Ch. 6
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Aynı erişim engeli — Kasas 28'in kitapta "Ch. 6" olduğu doğrulanamadı, birincil kaynağa erişim sağlanamadı.

#### R18
- **Konum**: satır 326–328 (4 ek halka üstü alt başlık)
- **Site iddiası (TR)**: "Modern akademik çalışmalar — Cuypers ve Farrin — Kur'ân'da halka yapısını sûre-uzunluğunda ve kıssa-uzunluğunda gösterir."
- **Atfedilen kaynak**: Michel Cuypers, Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Cuypers ve Farrin modern akademide Kur'an halka kompozisyonu üzerine en çok atıf alan iki isim (örn. "Going Round in Circles", Journal of Qur'anic Studies 2017, ikisini birlikte ele alıyor).

#### R19
- **Konum**: satır 409–429 ("Academic Frame" paneli giriş metni)
- **Site iddiası (TR)**: "Klasik İslâm geleneği munâsabât... alanında büyük bir birikime sahipti: Biqâʿî'nin Nazmü'd-Dürer'i, Suyûtî'nin el-İtkân'ı, Râzî'nin Mefâtîhu'l-Ğayb'ı bu ilişkileri sistematik olarak incelemiştir."
- **Atfedilen kaynak**: Bikâî, Suyûtî, Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bikâî'nin Nazmü'd-Dürer'i, Suyûtî'nin el-İtkân'ı ve Râzî'nin Mefâtîhu'l-Ğayb'ının münâsebât (ayet/sûre ilişkileri) alanında sistematik çalışma yaptığı, Kur'an araştırmaları literatüründe standart bir karakterizasyon.

#### R20
- **Konum**: satır 409–429 (Michel Cuypers özel kartı)
- **Site iddiası (TR)**: "Michel Cuypers" → *The Composition of the Qur'an: Rhetorical Analysis* (Bloomsbury, 2015)
- **Atfedilen kaynak**: Michel Cuypers
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R16/R18 ile aynı gerekçe, kart doğru bibliyografik bilgi taşıyor.

#### R21
- **Konum**: satır 409–429 (Raymond Farrin özel kartı)
- **Site iddiası (TR)**: "Raymond Farrin" → *Structure and Qur'anic Interpretation: A Study of Symmetry and Coherence* (White Cloud Press, 2014)
- **Atfedilen kaynak**: Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R11 ile aynı, başlık/yayıncı/yıl (White Cloud Press, 2014) Sinai'nin JQS incelemesiyle birebir teyit edildi.

#### R22
- **Konum**: satır 409–429 ("Klasik: Biqâʿî · Suyûtî · Râzî" kartı)
- **Site iddiası (TR)**: Üç klasik müellifin adı geçen eserleriyle birlikte "münâsabât" alanındaki katkısı özetleniyor.
- **Atfedilen kaynak**: Bikâî, Suyûtî, Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R19 ile aynı, Bikâî/Suyûtî/Râzî üçlüsünün münâsebât ilmindeki konumu doğru özetlenmiş.

## next/src/components/TarihselKanitlar.jsx

#### R23
- **Konum**: satır 770–771 (Âlimler sekmesi giriş paragrafı)
- **Site iddiası (TR)**: "Klasik tefsir (İbn Kesîr, Elmalılı) ve modern akademik Islamic Studies (Christian Robin, Nicolai Sinai, François Déroche) alanının önde gelen 6 referansı — Tarihsel İzler araştırmasının epistemik omurgası."
- **Site iddiası (EN)**: "Six leading references from classical tafsir (Ibn Kathīr, Elmalılı) and modern academic Islamic Studies (Christian Robin, Nicolai Sinai, François Déroche)..."
- **Atfedilen kaynak**: İbn Kesîr, Elmalılı; Christian Robin, Nicolai Sinai, François Déroche
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `tarihsel-kanitlar.json`'daki `scholars` dizisinde gerçekten 6 kayıt var (İbn Kesîr, Christian Robin, Nicolai Sinai, François Déroche, Maurice Bucaille, Elmalılı) — "6 referans" sayısal olarak doğru. İntro metni yalnız 5'ini adıyla anıyor (Bucaille dışarıda), seçici örnekleme, hata değil.

#### R24
- **Konum**: satır 761–827 (`ScholarsTab` — `public/tarihsel-kanitlar.json`'dan 6 âlim kartı: scholar/work/century/insight/critical)
- **Site iddiası (TR)**: Yukarıdaki 6 isim için ayrı ayrı yapılandırılmış atıf kartları (eser adı + yüzyıl + içgörü + nüans notu) — gerçek metin `public/tarihsel-kanitlar.json` içinde, bu geçişte doğrudan okunmadı.
- **Atfedilen kaynak**: İbn Kesîr, Elmalılı, Christian Robin, Nicolai Sinai, François Déroche (+ muhtemel 6. isim)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — JSON'daki 6 kart okundu; Robin (Himyar/Yemen epigrafi uzmanı), Sinai (Oxford, "The Qur'an: A Historical-Critical Introduction" 2017 gerçek kitap), Déroche (Collège de France, "Qur'ans of the Umayyads" gerçek kitap) biyografik bilgileri doğrulandı.

#### R25
- **Konum**: satır 411, 607, 611, 630, 771 (10 "Tarihsel İzler" kanıt kartı — `scholarlyDetailTr/En`, `sourcesTr/En`, `criticalNoteTr/En` alanları)
- **Site iddiası (TR)**: Firavun'un bedeni, Hâmân, Bizans kehaneti, Birmingham elyazması vb. her kanıt kartı kendi klasik+akademik kaynak metnini ve nüans notunu taşıyor — içerik `public/tarihsel-kanitlar.json`'da, bu geçişte doğrudan okunmadı.
- **Atfedilen kaynak**: Çözülmedi — Faz 2'de `public/tarihsel-kanitlar.json` doğrudan incelenmeli
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `tarihsel-kanitlar.json`'da gerçekten 10 kanıt kartı var. İki örnek derinlemesine kontrol edildi: Birmingham (568-645 CE karbon tarihleme) ve Hâmân (Bucaille/Ranke 1935 tartışması) — ikisi de doğru ve dengeli çerçevelenmiş. Kalan 8 kart tek tek doğrulanmadı, tam doğrulama için ayrı bir tur gerekir.

## next/src/sections/HistoricalProof.jsx

#### R26
- **Konum**: dosyanın kendisinde sabit metin yok — Firavun/Hâmân/Roma kehaneti hikâyeleri ve `criticalNote` alanları `t('historicalProof.pharaoh/haman/rome')` üzerinden i18n JSON'dan geliyor (bu geçişte i18n metni incelenmedi)
- **Site iddiası (TR)**: Bayrak — i18n dizesi Faz 2'de doğrudan kontrol edilmeli (bu bileşende adı hardcode edilmiş bir kaynak yok)
- **Atfedilen kaynak**: Belirsiz — i18n içeriğine bakılmalı
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — i18n metni okundu: Firavun/Hâmân/Roma bölümlerinin `criticalNote` alanları gerçekten nüanslı (Çıkış'ın Firavun'unun kimliği konusunda akademik konsensüs olmadığı, Hâmân paralelliğinin Bucaille kaynaklı ve mainstream Mısıroloji'de kabul görmediği, "edna'l-arz" yorumunun modern bir okuma olduğu açıkça belirtiliyor) — CLAUDE.md §13.24 ile uyumlu.

## next/src/sections/ScientificSigns.jsx

#### R27
- **Konum**: `bucaillismFrame` ve sekme başı `criticalNote` metinleri i18n'den geliyor (bu dosyada hardcode isim yok)
- **Site iddiası (TR)**: Bölüm CLAUDE.md §13.24'e göre açıkça "Bucaillism" (Maurice Bucaille) eleştirisi çerçevesinde kurulmuş; isim muhtemelen i18n dizesinde geçiyor, bu geçişte doğrulanmadı.
- **Atfedilen kaynak**: Maurice Bucaille (dolaylı/i18n üzerinden) — Faz 2'de i18n metni kontrol edilmeli
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — i18n'de `bucaillismFrame` metni Maurice Bucaille'i adıyla ve *La Bible, le Coran et la Science* (1976) eserini doğru atıfla anıyor; sayfa açıkça "bu bir bilimsel mucize iddiası değildir" diyerek Bucaillism'i eleştirel çerçevede sunuyor — CLAUDE.md §13.24 ile tam uyumlu.

## next/src/sections/LivingPreservation.jsx

#### R28
- **Konum**: `t('livingPreservation.birmingham.*')` — i18n'den geliyor, bu dosyada hardcode isim yok
- **Site iddiası (TR)**: Birmingham elyazması karbon tarihleme iddiası — bu dosyada adı geçen bir akademisyen yok, i18n metni Faz 2'de kontrol edilmeli.
- **Atfedilen kaynak**: Belirsiz — i18n içeriğine bakılmalı
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Birmingham el yazmasının Oxford laboratuvarında karbon-14 testiyle %95.4 olasılıkla MS 568-645 aralığına tarihlendiği doğrulandı — sitedeki rakamlar birebir örtüşüyor.

## next/src/sections/ProofSection.jsx

#### R29
- **Konum**: satır 72–73 (adım 02 "Metinde nerede?")
- **Site iddiası (TR)**: "Besmele (1:1) dışarıda tutuldu — Farrin de kendi analizinde Besmele'yi sûrenin yapısına saymaz."
- **Atfedilen kaynak**: Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pondering Islam incelemesindeki "Farrin Fâtiha'yı Besmele hariç 6 ayet olarak ele alır" tespitiyle örtüşüyor.

#### R30
- **Konum**: satır 86–87 (adım 04 "Neden kesin kanıt değil?")
- **Site iddiası (TR)**: "Bu şema Farrin'in yönteminden esinlenen, sitenin kendi düzenlemesidir — kitabındaki tam yapının birebir kopyası değil."
- **Atfedilen kaynak**: Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Dürüst bir sınırlama notu; Sinai'nin incelemesi de Farrin'in bölümleme seçimlerinin tartışmalı/keyfi olabildiğini gösteriyor, yani "birebir kopya değildir" uyarısı akademik olarak da yerinde bir ihtiyat.

#### R31
- **Konum**: satır 91–93 (şema altı kaynak notu)
- **Site iddiası (TR)**: "Esin: Raymond Farrin, Structure and Qur'anic Interpretation (2014) — kendisi Cuypers'in retorik yönteminden besleniyor."
- **Site iddiası (EN)**: "Inspired by: Raymond Farrin, Structure and Qur'anic Interpretation (2014) — itself building on Cuypers' rhetorical method."
- **Atfedilen kaynak**: Raymond Farrin (2014); Michel Cuypers (yöntemsel etki)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nicolai Sinai'nin JQS 19 (2017) inceleme makalesi doğrudan doğruluyor: "Farrin builds on the work of Cuypers and on Mary Douglas' Thinking in Circles."

## next/src/sections/ProphetMap.jsx

#### R32
- **Konum**: satır 127–136 (Kâbe / Âdem-tepe işaretleyicileri)
- **Site iddiası (TR)**: "Bazı klasik rivayetler: Âdem yeryüzünde ilk mabedi buraya inşa etti" / "Âdem'in cennetten inişini konumlandırır"
- **Atfedilen kaynak**: Belirli bir isim yok — genel "klasik rivayetler" (sınırda madde, spesifik âlim adı geçmiyor)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (dış doğrulama açısından zayıf ama site de bunu itiraf ediyor) — Âdem'in Kâbe'yi ilk mabed olarak inşa ettiği ve cennetten inişi rivayetleri (İslam öncesi/İslami) klasik efsane geleneğinde mevcut. Site belirli bir âlim adı vermeden "bazı klasik rivayetler" diyerek doğru şekilde hedge ediyor.

## next/src/sections/PsychologySection.jsx

#### R33
- **Konum**: satır 263–264 (`TAB_CTA.nefs` açıklaması)
- **Site iddiası (TR)**: "Tasavvufî sistematik (Necmeddin Kübra) — bu sayfadaki 5'li özetin tam karşılığı"
- **Atfedilen kaynak**: Necmeddin Kübrâ
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Necmeddin Kübrâ'nın (ö. 1221) nefsin 7 mertebesini (ammâre, levvâme, mülhime, mutmainne, râdiye, mardiyye, sâfiye/kâmile) ayrıntılı biçimde sistematize ettiği doğrulandı.

## next/src/sections/QuranDua.jsx

#### R34
- **Konum**: satır 44–45 (Eyyûb profili `insightEn`)
- **Site iddiası (TR)**: TR yalnızca "Klasik tefsir..." diyor, isim vermiyor
- **Site iddiası (EN)**: "Classical exegesis (Rāzī, Qurṭubī, Ibn Kathīr): a respectful arrangement of one's state, the method of the prophet of patience." — **TR/EN arasında tutarsızlık: EN üç müfessirin adını veriyor, TR vermiyor.**
- **Atfedilen kaynak**: Râzî, Kurtubî, İbn Kesîr (yalnızca İngilizce sürümde adı geçiyor)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Katalogda zaten belirtilen TR/EN tutarsızlığı gerçek (EN üçü adıyla anıyor, TR "klasik tefsir" diyor) — i18n parity sorunu, düzeltilmeli. İçerik olarak Hz. Eyyûb'un duasının "şikâyet değil arz" okunması yaygın bir tema, ama tam olarak bu üç müfessire atfı birebir doğrulanamadı.

#### R35
- **Konum**: satır 133–134 (`RABBENA_DUAS[0].noteTr/noteEn`)
- **Site iddiası (TR)**: "Hz. Peygamber'in en sevdiği dua (Buhârî, Daavât 55; Müslim, Zikir 26 — Enes b. Mâlik'ten)..."
- **Atfedilen kaynak**: Buhârî (Daavât 55), Müslim (Zikir 26), râvi Enes b. Mâlik
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Rabbenâ âtinâ..." duasının Hz. Peygamber'in en çok okuduğu dua olduğu ve Enes b. Mâlik'ten rivayet edildiği doğrulandı (Sahih Bukhari 6389, Kitâbü'd-Deavât; Müslim 2690). Bab numarası bağımsız doğrulanamadı ama râvi ve kitap adı doğru.

#### R36
- **Konum**: satır 173–174 (`RABBENA_DUAS[6].noteTr/noteEn`)
- **Site iddiası (TR)**: "Hadiste 'Bakara'nın son iki ayetini geceleyin okuyana o iki ayet yeter' (Buhârî, Fedâilü'l-Kur'an 10)."
- **Atfedilen kaynak**: Buhârî (Fedâilü'l-Kur'an 10)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Bakara'nın son iki ayetini geceleyin okuyana o iki ayet yeter" hadisinin Buhârî Fedâilü'l-Kur'an 10'da (ayrıca 27, 34'te de) geçtiği doğrulandı.

#### R37
- **Konum**: satır 823 ("Dua'nın Anatomisi" altı kaynak notu)
- **Site iddiası (TR)**: "Kaynak: Bakara 2:201 — Hz. Peygamber'in en sevdiği dua (Buhârî, Daavât 55; Müslim, Zikir 26)."
- **Atfedilen kaynak**: Buhârî, Müslim
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R35 ile aynı hadis/kaynak, Bakara 2:201 referansıyla tekrarlanıyor — tutarlı ve doğrulandı.

## next/src/sections/SoundArchitecture.jsx

#### R38
- **Konum**: satır 926–931, 969–971, 1430 (`ClassicalSource` bileşeni — kod yorumunda "Bâkıllânî alıntı" olarak etiketlenmiş)
- **Site iddiası (TR)**: `t('soundArchitecture.classicalSource')` üzerinden gelen alıntı kartı — yazar adı, eser adı, alıntı ve not; asıl metin i18n'de, bu geçişte doğrulanmadı.
- **Atfedilen kaynak**: el-Bâkıllânî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `tr.json` satır 209'daki güncel metin artık "Bâkıllânî'ye göre..." (paraphrase/atıf) diliyle yazılmış, önceki "sesin diziminde bile bir mucize taşır" birebir alıntı ifadesi kod tabanında bulunamadı (değiştirilmiş görünüyor). Ancak `ClassicalSource` bileşeni hâlâ dev dekoratif tırnak işareti ve "Klasik Tanıklık" başlığıyla görsel olarak doğrudan-alıntı izlenimi veriyor — metin paraphrase dese de UI hâlâ "quote card" gibi tasarlanmış. İçerik i'câz-ı nazm literatüründe standart bir Bâkıllânî karakterizasyonu, ama orijinal Arapça metinle birebir karşılaştırma yapılamadı.

## next/src/sections/LinguisticDNA.jsx

#### R39
- **Konum**: satır 158–159, 166 (Hâ-Mîm grubu `bullets`)
- **Site iddiası (TR)**: "Bu hibrit yapıya rağmen Şûrâ klasik tasnifte Havâmîm yedilisine dahil edilir (Suyûtî, İtkân; Bikâî, Nazmü'd-Dürer)."
- **Atfedilen kaynak**: Suyûtî (*el-İtkân*), Bikâî (*Nazmü'd-Dürer*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Şûrâ (42) sûresinin hibrit mukattaa yapısına (حم + عسق) rağmen klasik tasnifte Havâmîm yedilisine dahil edildiği ve bu sınıflandırmanın Suyûtî'nin el-İtkân'ında yer aldığı doğrulandı.

#### R40
- **Konum**: satır 231–233 (`DISCOVERIES[2]` — mukattaât harfleri hakkında icma yokluğu)
- **Site iddiası (TR)**: "Klasik tefsir geleneğinde İbn Abbâs, Mücâhid, Râzî, Suyûtî ve diğerleri farklı yorumlar önerdi; ancak hiçbiri konsensüsa ulaşmadı."
- **Atfedilen kaynak**: İbn Abbâs, Mücâhid, Râzî, Suyûtî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Mukattaa harfleri konusunda İbn Abbâs, Mücâhid, Râzî (20'den fazla görüş kataloglayan meşhur listesi) ve Suyûtî'nin farklı yorumlar önerdiği ve hiçbirinin icmaya ulaşmadığı doğrulandı — mukattaat literatüründe standart bir bulgu.

## next/src/data/fatihaRing.js

#### R41
- **Konum**: satır 1–19 (dosya başı kod yorumu, kullanıcıya görünmüyor)
- **Site iddiası (TR)**: HiddenArchitecture.jsx'teki R1 ile aynı Farrin/Kabakcı düzeltme notu, ayrı dosyada tekrarlanmış.
- **Atfedilen kaynak**: Raymond Farrin (2014); Ersin Kabakcı (2018)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kabakcı'nın (2018) Farrin (2014, s.3) alıntısı "Farrin does not count the invocation (basmala) as a verse for it does not contribute the structure of the sura" web taramasıyla doğrulandı, yorum bunu birebir aktarıyor.

## next/src/data/homeCards.js

#### R42
- **Konum**: satır 83 (`halka-card` blurb)
- **Site iddiası (TR)**: "Farrin (2014) bunu 'ring composition' olarak tarif etti — Kur'an'ın edebî mimarisi."
- **Site iddiası (EN)**: "Farrin (2014) called this 'ring composition' — the Quran's literary architecture."
- **Atfedilen kaynak**: Raymond Farrin (2014)
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — `next/src/data/homeCards.js` satır 83'te hâlâ şu metin var: "Fâtiha'nın 7 ayeti A-B-C-D-C'-B'-A' formülünde mükemmel bir ayna simetrisi taşır." Bu, bu sabah `HiddenArchitecture.jsx`/`ProofSection.jsx`'te düzeltilen TAM O HATANIN kendisi — 7 ayetlik tek-merkezli A-B-C-D-C'-B'-A' formül ancak Besmele (1:1) sayılırsa oluşur; Farrin Fâtiha'yı Besmele hariç 6 ayet sayıyor (bkz. R2/R29). **Düzeltme diğer dosyalarda yapılmış ama homeCards.js'te unutulmuş — canlı, aktif hata. ACİL düzeltilmeli.**

#### R43
- **Konum**: satır 109 (`bilimsel-card` blurb)
- **Site iddiası (TR)**: "...evren genişlemesi (Zâriyât 51:47 · Hubble 1929)..."
- **Atfedilen kaynak**: Edwin Hubble (1929, dolaylı adlandırma)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Hubble'ın 1929'da galaksi kırmızıya kaymasından evrenin genişlediğini ortaya koyması (Hubble Yasası) tarihsel olarak doğru ve iyi belgelenmiş.

#### R44
- **Konum**: satır 125 (`tarih-card` blurb)
- **Site iddiası (TR)**: "Firavun'un bedeninin ibret için korunacağı (Yûnus 10:92) — 1881'de Maspero'nun Deir el-Bahari keşifleriyle modern literatürde daha görünür hâle gelen kraliyet mumyaları."
- **Site iddiası (EN)**: "...the royal mummies that became more visible in modern literature through Maspero's 1881 Deir el-Bahari excavation."
- **Atfedilen kaynak**: Gaston Maspero (1881, Deir el-Bahari)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Deir el-Bahari kraliyet mumyaları önbelleği ve 1889'daki Maspero yayını gerçek; ama bizzat kazıyı Maspero değil Émile Brugsch ve Ahmed Kamal yürütmüş (Maspero o sırada Fransa'daydı). "Maspero'nun keşfi" dolaylı doğru (dönemin Antikiteler Dairesi başkanı) ama bizzat kazan kişi değil.

## next/src/data/scienceTimeline.js

#### R45
- **Konum**: satır 20–21 (`SCIENCE_TIMELINE[0].discoveryTr/En` — evren genişlemesi)
- **Site iddiası (TR)**: "Hubble · 1929" — kozmik genişleme keşfi ayetle eşleştiriliyor.
- **Atfedilen kaynak**: Edwin Hubble (1929)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R43 ile aynı Hubble 1929 olgusu, doğrulandı.

## next/src/data/iblis-observations.js

#### R46
- **Konum**: satır 145–146 (`progeny` gözlem gövdesi)
- **Site iddiası (TR)**: "...zamirin kime ait olduğu klasik tefsirde tartışmalıdır (Taberî hem İblis hem Hz. Âdem yorumunu kaydeder)."
- **Atfedilen kaynak**: Taberî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Taberî'nin "zürriyye" zamirinin İblis'e mi Âdem'e mi ait olduğu konusunda iki yorumu kaydettiği iddiası doğrudan Taberî metninden teyit edilemedi; erişilebilen İngilizce kaynaklarda (Maarif-ul-Kur'an, İbn Kesîr) zamirin İblis'e ait olduğu yönünde görece net çoğunluk var, Taberî'nin özellikle ihtilaf kaydettiğine dair kanıt bulunamadı.

#### R47
- **Konum**: satır 191–192 (`chronology` gözlem gövdesi)
- **Site iddiası (TR)**: "Vahyin akışında kronolojik daralma... (Sıralama Suyûtî, el-İtkān.)"
- **Atfedilen kaynak**: Suyûtî (*el-İtkân*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — el-İtkân'ın vahiy kronolojisi/tertibi konusuna değindiği genel olarak doğru, ama "vahyin akışında kronolojik daralma" şeklindeki özel iddia klasik metinde doğrudan teyit edilemedi.

## next/src/data/iblis-passages.js

#### R48
- **Konum**: satır 119 (`kehf` pasajı `nuanceTr/En`)
- **Site iddiası (TR)**: "Ayetin ikinci yarısında geçen 'soy' (ẕurriyye) kelimesinin kime ait olduğu klasik tefsirde tartışmalıdır — Taberî hem İblis hem Âdem yorumunu kaydeder."
- **Atfedilen kaynak**: Taberî (iblis-observations.js'teki R46 ile aynı iddia, ayrı konum)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — R46 ile aynı Taberî iddiası, ayrı dosyada tekrarlanmış; aynı doğrulanamama durumu geçerli.

## next/src/data/toolCatalog.js

#### R49
- **Konum**: satır 55 (`yakin-anlamli-nuanslar` arama anahtar kelimeleri)
- **Site iddiası (TR)**: Anahtar kelimeler arasında `'isfahani', 'mufredat', 'izutsu', 'furuk'` geçiyor (arama endeksleme, düz metin değil ama iki âlimi doğrudan içeriyor).
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*Mufredât*), Toshihiko Izutsu
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Yapısal bir arama-endeksleme kaydı (dış iddia değil), ama içerdiği isimler gerçek: er-Râgıb el-İsfahânî *Mufredât*'ın yazarıdır, Toshihiko Izutsu Kur'an semantiği üzerine tanınmış akademisyendir.

#### R50
- **Konum**: satır 64 (`halka-kompozisyon` rota açıklaması)
- **Site iddiası (TR)**: "Farrin (2014) çerçevesi: kürsel simetri, ayna yapıları."
- **Site iddiası (EN)**: "Farrin (2014) framework: ring symmetry, mirror structures."
- **Atfedilen kaynak**: Raymond Farrin (2014)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Genel ve spesifik ayet eşleşmesi iddia etmiyor; Farrin'in genel tezi (parallelism/chiasm/concentrism, "ring symmetry") ile uyumlu, düşük riskli bir özet.

## next/src/data/tools.jsx

#### R51
- **Konum**: satır 407–408 (`munasebat` aracı `descLongTr/En`)
- **Site iddiası (TR)**: "...klasik âlimlerin ilmü'l-münâsebât'ı. Râzî, Bikā'î, Süyûtî kaynaklarına dayalı bağlantı atlası."
- **Site iddiası (EN)**: "...the classical discipline of ʿilm al-munāsabāt. An atlas of connections drawn from al-Rāzī, al-Biqāʿī, al-Suyūṭī."
- **Atfedilen kaynak**: Râzî, Bikâî, Suyûtî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İlmü'l-münâsebât klasik bir disiplindir; Bikâî'nin *Nazmü'd-Dürer*'i doğrudan bu konu üzerine yazılmış eserdir, Râzî ve Suyûtî de âyetler-arası bağlantıya değinmeleriyle bilinir.

#### R52
- **Konum**: satır 505 (`kitap-kavrami` aracı `descLongTr/En`)
- **Site iddiası (TR)**: "Râgıb el-İsfahânî'nin müfredâtı çerçevesinde her ismin işlevi + anlam katmanı."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*Mufredât*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — *Mufredât* kelime-anlam analizinin klasik referans eseridir, atıf standart ve doğru.

#### R53
- **Konum**: satır 513 (`yakin-anlamli-nuanslar` aracı `descLongTr/En`)
- **Site iddiası (TR)**: "Râgıb el-İsfahânî'nin Müfredât'ı + İzutsu çerçevesinde."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî, Toshihiko Izutsu
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İsfahânî *Mufredât* + Izutsu (semantik alan/yakın-anlamlılık çalışmaları) birleşimi akademik olarak makul ve yaygın bir çerçeve.

## next/src/data/ahiret-yolculugu.json

> Bu dosya taranan kapsamdaki en büyük biçimsel atıf yapısını içeriyor: hem `meta.sources[]` (SourcesCitation tarzı 6 kayıt) hem de `stages[]` içinde 40+ dağınık `source:` alanı.

#### R54
- **Konum**: satır 13–61, `meta.sources[0]`
- **Site iddiası (TR)**: er-Râzî, *Mefâtîhu'l-Ğayb* (1149–1209, Rey). Not ek bir akademik iddia içeriyor: "modern akademik araştırmalarda hangi cüzün kime ait olduğu net değildir — Ayman Shihadeh 2006."
- **Atfedilen kaynak**: er-Râzî; Ayman Shihadeh (2006, tefsirin son ciltlerinin müellifliği tartışması)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin tarihleri ve *Mefâtîhu'l-Ğayb* doğru; ancak Shihadeh'in 2006 eseri *The Teleological Ethics of Fakhr al-Din al-Razi* olup doğrudan tefsirin son ciltlerinin müellifliği tartışmasına odaklanmıyor görünüyor — atıf muhtemelen yanlış eşleştirilmiş.

#### R55
- **Konum**: satır 13–61, `meta.sources[1]`
- **Site iddiası (TR)**: el-Kurtubî — *el-Câmi' li-Ahkâmi'l-Kur'an* + *et-Tezkire fî ahvâli'l-mevtâ* (1214–1273)
- **Atfedilen kaynak**: el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Kurtubî'nin *et-Tezkire fî ahvâli'l-mevtâ* gerçek ve doğrulanmış bir eseri; tarihler de genel kabul gören aralıkta.

#### R56
- **Konum**: satır 13–61, `meta.sources[2]`
- **Site iddiası (TR)**: İbn Kesîr — *Tefsîru'l-Kur'ani'l-Azîm* (1300–1373)
- **Atfedilen kaynak**: İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr ve *Tefsîru'l-Kur'ani'l-Azîm* standart, iyi bilinen atıf; tarihler (1300–1373) doğru.

#### R57
- **Konum**: satır 13–61, `meta.sources[3]`
- **Site iddiası (TR)**: Gazâlî — *İhyâ'u Ulûmi'd-Dîn* + *ed-Durretu'l-Fâhira* (1058–1111). Not: "ed-Durretu'l-Fâhira'nın Gazâlî'ye aidiyeti modern akademide sorgulanmıştır — William McKane'in eleştirel neşrinde."
- **Atfedilen kaynak**: Gazâlî; William McKane (eleştirel neşir, aidiyet tartışması)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — *ed-Durretu'l-Fâhira*'nın Gazâlî'ye aidiyetinin tartışmalı olduğu genel olarak doğru, ama William McKane'in bilinen eleştirel neşirleri bu eser değil *Kitâbu Zikri'l-Mevt* (İhyâ, Book XL) ve *el-Havf ve'r-Recâ* üzerine — spesifik "McKane'in eleştirel neşri" atfı teyit edilemedi, muhtemelen yanlış kaynak eşleştirmesi.

#### R58
- **Konum**: satır 13–61, `meta.sources[4]`
- **Site iddiası (TR)**: İbn Kayyım el-Cevziyye — *Kitâbu'r-Rûh* (1292–1350). Not: aidiyet tartışması "Livnat Holtzman, Caterina Bori" isimleriyle destekleniyor.
- **Atfedilen kaynak**: İbn Kayyım el-Cevziyye; Livnat Holtzman, Caterina Bori
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İbn Kayyım ve *Kitâbu'r-Rûh* gerçek; Holtzman ve Bori gerçekten alanın önde gelen akademisyenleri (birlikte düzenledikleri *A Scholar in the Shadow*, 2010), ancak ikisinin özellikle *Kitâbu'r-Rûh*'un aidiyetini sorguladığına dair doğrudan kanıt bulunamadı.

#### R59
- **Konum**: satır 13–61, `meta.sources[5]`
- **Site iddiası (TR)**: es-Suyûtî — *el-Budûr es-Sâfira fî Umûri'l-Âhira* (1445–1505)
- **Atfedilen kaynak**: es-Suyûtî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — es-Suyûtî'nin *el-Budûru's-Sâfira fî Umûri'l-Âhira* gerçek bir eseri, dijital arşivlerde mevcut; tarihler doğru.

#### R60
- **Konum**: `stages[]` dizisi genelinde 40+ dağınık `source:` alanı (satır 118, 124, 209, 215, 293, 368, 374, 444, 450, 535, 541, 633, 728, 734, 740, 804, 810, 816, 892, 898, 972, 978 ve devamı)
- **Site iddiası (TR)**: 11 aşamalı âhiret atlasındaki her aşama iddiası (mîzân, sırât, cennet/cehennem, rü'yetullâh vb.) tek tek Râzî/Kurtubî/Suyûtî'den birine atfedilmiş — tam metinler tek tek çıkarılmadı, örneklem bazlı Faz 2 taraması önerilir.
- **Atfedilen kaynak**: Râzî, Kurtubî, Suyûtî (tekrarlı)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Katalog kaydının kendisi bu maddenin 40+ dağınık kaynak alanının tek tek çıkarılmadığını belirtiyor; toplu bir doğrulama yapılamaz, örneklem bazlı ayrı bir Faz 2 turu gerekiyor.

#### R61
- **Konum**: satır 183
- **Site iddiası (TR)**: "'sonra ateşe sokuldular' geçmiş zamanı klasik delil (Kurtubî, İbn Kesîr); modern bazı yorumcular bunu kıyamet sonrası olarak da okur."
- **Atfedilen kaynak**: Kurtubî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "sonra ateşe sokuldular" geçmiş zaman okumasının Kurtubî/İbn Kesîr'e atfı spesifik bir tefsir pasajı gerektiriyor; erişilebilen kaynaklarla doğrulanamadı.

#### R62
- **Konum**: satır 537
- **Site iddiası (TR)**: "Râzî bu ters-çevirmenin retorik gücünü uzunca işler." (kuş/uğur imgesi)
- **Atfedilen kaynak**: Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Râzî'nin belirli bir kuş/uğur imgesi ters-çevirme pasajını "uzunca işlediği" iddiası, Râzî'nin bilinen ayrıntılı/retorik üslubuyla tutarlı olsa da spesifik pasaj doğrulanamadı.

#### R63
- **Konum**: satır 556
- **Site iddiası (TR)**: "Klasik çoğunluk (Râzî, Kurtubî, İbn Kesîr) literal fiziksel yönleri kabul eder; bazı modern yorumcular (Muhammed Abduh çizgisi) sembolik statü imgesi olarak okur."
- **Atfedilen kaynak**: Râzî, Kurtubî, İbn Kesîr; Muhammed Abduh
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Klasik çoğunluğun literal okuması vs. Abduh'un sembolik okuma eğilimi genel olarak Abduh'un bilinen rasyonalist yorum tarzıyla tutarlı, ama bu spesifik pasaj/ayet için doğrulama yapılamadı.

#### R64
- **Konum**: satır 629–639, 654–657 (mîzân/terazi — literal-mecaz tartışması)
- **Site iddiası (TR)**: "Kurtubî'nin naklettiği çoğunluk görüşü" vs. "Râzî'nin tercihi"; mecazi mîzân görüşü **Kâdî Abdulcabbâr**'a (Mu'tezile) atfediliyor, "Ehl-i Sünnet çoğunluğu (Râzî'nin bir yorumu dahil)" karşısında.
- **Atfedilen kaynak**: Kurtubî, Râzî (Sünnî çoğunluk); Kâdî Abdulcabbâr (Mu'tezilî görüş)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mu'tezile'nin mîzân gibi âhiret imgelerini mecazi okuma eğilimi genel teolojik profille tutarlı (Kâdî Abdulcabbâr doğru bir isim), Râzî'nin Ehl-i Sünnet çoğunluk görüşünü kaydetmesi de makul, ama spesifik pasaj metniyle karşılaştırma yapılamadı.

#### R65
- **Konum**: satır 806 (sırât/köprü — "vârid" kelime analizi)
- **Site iddiası (TR)**: "...kâfirler için 'içine girme', mü'minler için 'yanından geçme' formülasyonu (Zemahşerî *el-Keşşâf*'ın da vurguladığı) yaygın kabuldür."
- **Atfedilen kaynak**: Zemahşerî (*el-Keşşâf*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Zemahşerî'nin *el-Keşşâf*'ta sırât/"vârid" formülasyonuna (kâfir için girme, mü'min için geçme) dair spesifik ifadesi doğrudan teyit edilemedi.

#### R66
- **Konum**: satır 972–974 (rü'yetullâh — Allah'ı görme)
- **Site iddiası (TR)**: "Râzî Ehl-i Sünnet pozisyonunu Mu'tezile itirazlarına karşı sistematik olarak savunur."
- **Atfedilen kaynak**: Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin Mu'tezile'ye karşı Ehl-i Sünnet rü'yetullah görüşünü savunması genel olarak bilinen bir gerçek (*Esâsü't-Takdîs* ve tefsirinde geniş yer verir), ancak "sistematik savunma" iddiasının spesifik pasajı doğrulanamadı.

## next/src/sections/QuranRhetoric.jsx

#### R67
- **Konum**: satır 545–546 (donut grafik dipnotu)
- **Site iddiası (TR)**: "Yüzde dağılımları bu sitenin korpus analizinden türetilmiş tahminlerdir; klasik literatürde (Süyûtî, Zerkeşî) net bir oran verilmez."
- **Site iddiası (EN)**: "...classical literature (Suyūṭī, Zarkashī) gives no exact ratio."
- **Atfedilen kaynak**: Suyûtî, Zerkeşî (belirli bir oran vermedikleri iddiası)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Klasik literatürün (Süyûtî, Zerkeşî) net bir yüzde oranı vermediği negatif bir iddia; makul (klasik eserler istatistiksel oran vermez) ama doğrudan teyit edilemez.

#### R68
- **Konum**: satır 256 (Sûre Yoğunluğu ısı haritası altı metodoloji notu)
- **Site iddiası (TR)**: "...klasik tefsir kaynaklarıyla (Süyûtî İtkân, Zerkeşî Burhân) çapraz kontrol edilmiştir."
- **Site iddiası (EN)**: "...cross-checked against classical tafsir." — **EN geneldir, TR iki kaynağı isimlendirir; TR/EN arasında tutarsızlık.**
- **Atfedilen kaynak**: Suyûtî (*el-İtkân*), Zerkeşî (*el-Burhân*)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Kaynakların kendisi (İtkân, Burhân) gerçek eserler; ama TR/EN arasında tutarsızlık var — TR iki kaynağı isimlendirirken EN "classical tafsir" diye genelliyor. Bu tutarsızlık ayrı bir bulgu, düzeltilmeli.

## next/src/sections/ZeroRedundancy.jsx

#### R69
- **Konum**: satır 224 (tekrîr retorik tekniği)
- **Site iddiası (TR)**: "Klasik Arap belagatı bu tekniği 1.000 yıl önce tekrîr (تكرير) olarak sistematize etmiş... Zerkeşî, el-Burhân fî Ulûmi'l-Kur'an (14. yy) tarafından..."
- **Atfedilen kaynak**: Zerkeşî (*el-Burhân fî Ulûmi'l-Kur'an*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin *el-Burhân fî Ulûmi'l-Kur'an*'ı (14. yy) gerçek bir eser ve Kur'an belagatındaki tekrar/tekrîr tekniklerini ele alan klasik kaynaklardan biridir.

#### R70
- **Konum**: satır 336–494 (İ'câz/Belâgat kartları + Zemahşerî alıntısı)
- **Site iddiası (TR)**: Kod yorumu: "Kaynaklar her kartın içinde (Zerkeşî, Suyûtî, Râzî, İbn Âşûr, TDV İslâm Ansiklopedisi)." Ayrıca ayrı bir Zemahşerî alıntı bloğu (`zemahseriQuote`/`zemahseriAttribution`).
- **Atfedilen kaynak**: Zerkeşî, Suyûtî, Râzî, İbn Âşûr, TDV İslâm Ansiklopedisi; Zemahşerî (ayrı alıntı)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Kod yorumundaki "kaynaklar her kartın içinde" iddiası dosyanın derinlemesine (satır 336–494) okunmasını gerektiriyor, bu turda açılmadı; Zemahşerî alıntı bloğunun içeriği de doğrulanmadı.

> **Kapsam notu (bu grup için)**: `public/tarihsel-kanitlar.json`, ve `HistoricalProof.jsx`/`ScientificSigns.jsx`/`SoundArchitecture.jsx`/`ZeroRedundancy.jsx`/`QuranRhetoric.jsx`/`QuranDua.jsx` bileşenlerinin arkasındaki i18n dizeleri bu geçişte doğrudan açılmadı — Faz 2 için yüksek öncelikli takip noktaları (R23–R28, R38, R70).

---

# TEFEKKÜR MAKALELERİ (next/public/tefekkur/*.json)

> Yazar her makalede "Felsufi" (site persona) — bu isim başlı başına bir iddia değil. Aşağıdakiler makale gövdesinde adı geçen dış kaynaklara (klasik âlim, modern bilim insanı, akademik makale/kitap) atfedilen iddialar.

## next/public/tefekkur/makro-mikro.json

#### R71
- **Konum**: criticalNote ("Çağdaş kavram seti — klasik kelâm değil")
- **Site iddiası (TR)**: "Bu çağdaş bir okuma denemesidir — klasik tefsir geleneği (Râzî, Kurtubî, İbn Kesîr) emergence/faz geçişi terimini kullanmaz."
- **Atfedilen kaynak**: er-Râzî, el-Kurtubî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Klasik tefsirin (Râzî, Kurtubî, İbn Kesîr) "emergence/faz geçişi" gibi modern terimleri kullanmadığı iddiası önemsiz derecede doğru (anakronistik terimler) — düşük riskli, kendi kendini doğrulayan negatif bir iddia.

## next/public/tefekkur/okuma-prensipleri-1.json

#### R72
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Kur'ân-ı Hakîm'de çok hâdisat-ı cüz'iye vardır ki her birisinin arkasında bir düstûr-u küllî saklanmış... Kur'an, sözü mutlak bırakır, tâ âmm olsun..."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî — Sözler (20. Söz; 25. Söz)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "Kâinat mescid-i kebîrinde..." ifadesinin 20. Söz'e ait olduğu web taramasıyla doğrulandı; ancak alıntının ikinci yarısı ("Kur'an sözü mutlak bırakır, tâ âmm olsun") ve 25. Söz'e atfı ayrıca teyit edilemedi.

#### R73
- **Konum**: pullQuote
- **Site iddiası (TR)**: "...terk edip, وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ gibi itnâblı bir cümleyi ihtiyar etmiştir." (Bakara 3. ayet kelime tercihi analizi)
- **Atfedilen kaynak**: Bediüzzaman — İşârâtü'l-İcâz
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İşârâtü'l-İ'câz'ın Bakara 3. ayetteki "ve mimmâ rezaknâhum yünfikûne" ifadesini itnab bağlamında ele aldığı genel olarak doğrulandı, ama alıntının birebir metni teyit edilemedi.

#### R74
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Kâinat mescid-i kebîrinde, Kur'ân, kâinâtı okuyor... Kur'ân-ı Hakîm, şu Kur'ân-ı Azîm-i Kâinât'ın en âlî bir müfessiridir..."
- **Atfedilen kaynak**: Bediüzzaman — Sözler (7. Söz; 12. Söz)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Her iki alıntı da web taramasıyla neredeyse birebir doğrulandı: "Kâinat mescid-i kebîrinde Kur'ân kâinâtı okuyor..." (7. Söz) ve "Kur'ân-ı Hakîm, şu Kur'ân-ı Azîm-i Kâinât'ın en âlî bir müfessiridir" (12. Söz, Birinci Esas).

#### R75
- **Konum**: criticalNote ("Bediüzzaman / Risale-i Nur metodolojisi")
- **Site iddiası (TR)**: "Felsufi'nin sunduğu 5 epistemik prensip... büyük ölçüde Bediüzzaman Saîd Nursî'nin Risâle-i Nûr külliyatından devraldığı epistemik ölçütlere dayanır... klasik usûl-i tefsir (Cessâs, İbn Teymiyye, Suyûtî vb.) farklı ölçütler kullanmıştır."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî; el-Cessâs, İbn Teymiyye, es-Suyûtî (karşılaştırma)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "5 epistemik prensip"in Risâle-i Nûr'dan sistematik olarak devralındığı iddiası çok geniş/sentetik bir yorum; Cessâs/İbn Teymiyye/Suyûtî ile karşılaştırma genel olarak makul ama doğrulanabilir spesifik bir kaynak metni yok.

## next/public/tefekkur/okuma-prensipleri-2.json

#### R76
- **Konum**: pullQuote ("Ek bilgi")
- **Site iddiası (TR)**: "ChatGPT'nin temelindeki yapay zeka modeli bütün metinleri... 1536 boyutlu bir anlam uzayında (semantic vector space) birer noktaya denk gelecek ayrı ayrı vektörler olarak ele alıyor."
- **Atfedilen kaynak**: "ChatGPT'nin temelindeki AI modeli" (spesifik boyut sayısı — 1536 — iddiası)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — OpenAI'nin text-embedding-ada-002 modelinin gerçekten 1536 boyutlu vektör ürettiği doğrulandı, ama bu embedding modeli teknik olarak "ChatGPT"nin kendisi değil, ayrı bir embedding API'sidir — makale bu ayrımı belirsizleştiriyor.

#### R77
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Kur'ân-ı Kerîm bu şartları... îcâzlı bir ifadeyi terk edip... itnâblı bir cümleyi ihtiyar etmiştir." / "Sözü az söyler, tâ uzun olsun…"
- **Atfedilen kaynak**: Bediüzzaman — Sözler (13. Söz)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "Sözü az söyler, tâ uzun olsun" ifadesinin 13. Söz'e ait olduğu doğrudan teyit edilemedi; R73'teki itnab temasıyla aynı aileden ama farklı esere atfedilmiş, ayrı doğrulama gerekiyor.

#### R78
- **Konum**: criticalNote ("Klasik nâsih-mensûh tartışması")
- **Site iddiası (TR)**: "Cessâs, Nehhâs, İbnü'l-Arabî, Suyûtî gibi klasik müelliflerin sayıları farklılaşsa da (200'den 5'e kadar tahminler) nâsih-mensûh konseptinin kendisi geleneğin merkezindedir."
- **Atfedilen kaynak**: el-Cessâs, en-Nehhâs, İbnü'l-Arabî, es-Suyûtî (200→5 rakam iddiası)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nâsih-mensûh sayısındaki tarihsel farklılaşma (238'den (İbn Seleme) 138'e (Nehhâs), ~20'ye (Suyûtî) ve bazı modern yazarlarda 5'e kadar) geniş bir aralıkta belgelenmiş — "200'den 5'e" ifadesi genel eğilimi doğru yansıtıyor.

## next/public/tefekkur/rahmetin-grameri-1.json

#### R79
- **Konum**: body paragraph
- **Site iddiası (TR)**: "Bediüzzaman'ın güzel bir teşbihi var: Allah bir sineğin kanadına, güneşin yörüngesine harcadığı sanatın aynısını harcar."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bediüzzaman'ın sinek kanadı ile güneşin yörüngesine aynı ilahî sanatın harcandığı teşbihi (İkinci Şua'da tevhid delili bağlamında) web taramasıyla genel temada doğrulandı.

## next/public/tefekkur/rahmetin-grameri-2.json

#### R80
- **Konum**: body paragraph ("Boşlukları Kapatmak")
- **Site iddiası (TR)**: "Klasik müfessirler, İbn Kesîr ve Kurtubî başta olmak üzere, 2:229'u nüzul ortamıyla açıklar. Cahiliyede talâk gerçek bir ayrılık değil, bir psikolojik baskı aletiydi..."
- **Atfedilen kaynak**: İbn Kesîr, el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in 2:229 tefsirinde, cahiliye döneminde erkeklerin eşlerini sınırsızca boşayıp geri alarak zarar verdiği, bu yüzden âyetin talakı sınırladığı şeklindeki esbab-ı nüzûl rivayeti doğrulandı.

#### R81
- **Konum**: body paragraph ("Teleolojik Kalkan: Makâsıd")
- **Site iddiası (TR)**: "Makâsıdü'ş-şerîa mektebi — Gazâlî'den Şâtıbî'ye — her hükmün beş zarûriyatı korumak için var olduğunu söyler: din, can, akıl, nesil ve mal."
- **Atfedilen kaynak**: Gazâlî, eş-Şâtıbî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Makâsıdü'ş-şerîa'nın beş zarûriyatı (din, can, akıl, nesil, mal) standart bir tespit; Gazâlî bunu el-Mustasfâ'da temellendirir, Şâtıbî el-Muvâfakât'ta sistematikleştirir.

#### R82
- **Konum**: body paragraph ("Medeniyetin Atom Teorisi")
- **Site iddiası (TR)**: "Durkheim'a göre bir toplumu ayakta tutan... kolektif vicdan der. Weber'e göre meşru otorite, nihayetinde en küçük birimde içselleştirilen norma dayanır."
- **Atfedilen kaynak**: Émile Durkheim, Max Weber
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Durkheim'ın "kolektif vicdan" kavramı doğru aktarılmış; Weber'in meşru otorite teorisi de doğru genel çerçevede özetlenmiş — birebir alıntı değil sentetik bir yorum, sorun yok.

## next/public/tefekkur/rahmetin-grameri-3.json

#### R83
- **Konum**: body paragraph ("Anlamın Devralınması: Ma'rûf")
- **Site iddiası (TR)**: "Toshihiko Izutsu'nun gösterdiği gibi, Kur'an çoğu zaman yeni kelimeler icat etmez; cahiliyenin kelimelerini alır ve anlam-DNA'larını değiştirir."
- **Atfedilen kaynak**: Toshihiko Izutsu
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Izutsu'nun semantik alan teorisi tam olarak budur — Kur'an'ın cahiliye kelimelerini alıp anlam yapısını dönüştürdüğü tezi, "Ethico-Religious Concepts in the Qur'an"ın merkezi argümanı.

#### R84
- **Konum**: footnote
- **Site iddiası (TR)**: "Toshihiko Izutsu, Ethico-Religious Concepts in the Qur'an (ilk basım: The Structure of the Ethical Terms in the Koran, 1959)."
- **Atfedilen kaynak**: Toshihiko Izutsu (spesifik kitap/baskı)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kitap ilk kez 1959'da "The Structure of the Ethical Terms in the Koran" adıyla yayımlanmış, 1966'da "Ethico-Religious Concepts in the Qur'an" başlığıyla revize edilmiştir; dipnot bu yayın tarihçesini doğru veriyor.

## next/public/tefekkur/rahmetin-grameri-4.json

#### R85
- **Konum**: body paragraph
- **Site iddiası (TR)**: "Bediüzzaman Said Nursî, 'kâinatı yaratan kudret neden insanın hukukî çekişmeleriyle de ilgilenir?' sorusunu Yirmi Beşinci Söz'de... ele alır."
- **Atfedilen kaynak**: Bediüzzaman — Yirmi Beşinci Söz
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Yirmi Beşinci Söz gerçekten Kur'an'ın i'câzına (Mu'cizât-ı Kur'âniye Risalesi) ayrılmıştır ve ayet sonlarındaki fezlekeler/adalet temasını işler. Alıntılanan soru birebir teyit edilemedi (parafraz olabilir) ama tematik yerleşim doğru.

#### R86
- **Konum**: pullQuote ("Küçük Cennet")
- **Site iddiası (TR)**: "Bir baharı halk etmek, bir çiçek kadar Ona ehven gelir. Bütün hayvânâtı icad etmek, bir sinek icadı kadar kudretine kolay gelir."
- **Atfedilen kaynak**: Said Nursî — Onuncu Söz
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Aramalar çelişkili sonuç verdi: "Bir baharı halk etmek..." tek cümlesi bazı kaynaklarda Onuncu Söz'e bağlanırken, pullQuote'daki iki cümlenin birleşik hali en az bir arama sonucunda açıkça **Yirmi Beşinci Söz**'e ait çıktı. Birincil metne tam erişim olmadan kesin karar verilemiyor — "Onuncu Söz" ataması hatalı olabilir, elle kontrol gerekiyor.

#### R87
- **Konum**: footnote
- **Site iddiası (TR)**: "Said Nursî, Yirmi Beşinci Söz (Mu'cizât-ı Kur'âniye Risalesi); ayet sonlarındaki fezlekelerin ve İlahî isim üslubunun taşıdığı letâife dair bölüm."
- **Atfedilen kaynak**: Said Nursî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Yirmi Beşinci Söz'ün Mu'cizât-ı Kur'âniye Risalesi olduğu ve fezleke/İlahî isim üslubunu işlediği doğrulandı.

## next/public/tefekkur/rahmetin-grameri-5.json

#### R88
- **Konum**: body paragraph ("İ'tibâr")
- **Site iddiası (TR)**: "Muhyiddin İbn Arabî... dış hukuka, yani zâhire karşı katı bir literalisttir... Onun ilkesi i'tibâr'dır: karşıya geçiş."
- **Atfedilen kaynak**: İbn Arabî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Arabî'nin zâhir hukuka literalist yaklaşımı ve i'tibâr ilkesi, akademik literatürde (bkz. Winkel, R89) tam olarak bu şekilde tanımlanır.

#### R89
- **Konum**: footnote
- **Site iddiası (TR)**: "İbn Arabî'nin fıkha literalist yaklaşımı ve i'tibâr için bkz. Eric Winkel, 'Ibn Arabi's Fiqh: Three Cases from the Futūḥāt al-Makkiyya', Journal of the Muhyiddin Ibn Arabi Society, c. 55 (2014)."
- **Atfedilen kaynak**: Eric Winkel (2014, akademik makale)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Eric Winkel'in "Ibn Arabi's Fiqh: Three Cases from the Futūḥāt al-Makkiyya" makalesi Journal of the Muhyiddin Ibn Arabi Society, Vol. 55 (2014)'te yayımlanmış — atıf doğrulandı.

#### R90
- **Konum**: footnote
- **Site iddiası (TR)**: "Kozmik 'manevî nikâh'... için bkz. Souad Hakim, 'Woman as Human Being and Cosmic Principle'... (1995); ayrıca Stanford Encyclopedia of Philosophy, 'Ibn ʿArabī' maddesi (W. Chittick)."
- **Atfedilen kaynak**: Souad Hakim (1995); W. Chittick (Stanford Encyclopedia of Philosophy)
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — İbn Arabî Cemiyeti'nin kendi sitesinden doğrudan doğrulandı: Souad Hakim'in "Woman as Human Being and Cosmic Principle" makalesi Journal of the Muhyiddin Ibn Arabi Society'de **Volume XXXIX (2006)**'da yayımlanmış — site "c. 18 (1995)" diyor. Hem cilt hem yıl yanlış; makale adı/yazarı doğru, atıf detayları hatalı. **Düzeltilmeli.**

## next/public/tefekkur/rahmetin-grameri-6.json

#### R91
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Bir baharı halk etmek, bir çiçek kadar O'na ehven gelir..." / "Sivrisineğin gözünü halk eden, güneşi dahi o halk etmiştir."
- **Atfedilen kaynak**: Said Nursî — Yirmi Beşinci Söz; Hakikat Çiçekleri, Mektubat
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İki alıntı da Yirmi Beşinci Söz / Hakikat Çekirdekleri-Mektubat kümesiyle genel olarak örtüşüyor; "Hakikat Çiçekleri" ifadesi aramalarda "Hakikat Çekirdekleri" olarak çıktı — küçük bir isim farkı olabilir, kritik değil.

#### R92
- **Konum**: footnote
- **Site iddiası (TR)**: "'Çift (zevceyn)' ayetinin bu yönde yorumu... için bkz. İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm, 51:49; Mevdûdî, Tefhîmü'l-Kur'ân, 51:49 üzerine."
- **Atfedilen kaynak**: İbn Kesîr, Mevdûdî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zâriyât 51:49 ("her şeyden çift yarattık") ayetinin İbn Kesîr ve klasik tefsir tarafından "her şey zıddıyla/çift ilkesiyle yaratılmıştır" temasıyla yorumlandığı doğrulandı; Mevdûdî'nin Tefhîm'i de bu ayete yorum yapar.

## next/public/tefekkur/ruhun-termostati.json

#### R93
- **Konum**: pullQuote (hadis)
- **Site iddiası (TR)**: "الإيمان نصفان: نصف في الصبر ونصف في الشكر — 'İman iki yarımdır: yarısı sabır, yarısı şükürdür.'"
- **Atfedilen kaynak**: Beyhakî — Şuabu'l-Îmân, 123/7
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Arapça metin ve Beyhakî/Şuabu'l-Îmân atfı doğru, ama bu söz aslında Hz. Peygamber'in değil **İbn Mesûd'un** sözüdür (mevkuf eser, merfû hadis değil) — katalogdaki "pullQuote (hadis)" etiketi bu ayrımı belirtmiyorsa yanıltıcı, tür sınıflandırması düzeltilmeli.

#### R94
- **Konum**: pullQuote (hadis)
- **Site iddiası (TR)**: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ!... 'Müminin hâline şaşılır!...'"
- **Atfedilen kaynak**: Müslim — Zühd 64
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Hadis metni ve Müslim'e (Suheyb r.a.'den, Zühd bahsi, sahih) atfı doğrulandı, ancak bulunan kaynaklar hadis numarasını "2999" olarak veriyor, site "Zühd 64" diyor — farklı numaralandırma sistemleri olabilir, bağımsız teyit edilemedi.

#### R95
- **Konum**: pullQuote (hadis)
- **Site iddiası (TR)**: "مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ — 'Hiç kimseye sabırdan daha hayırlı ve daha geniş bir ikram verilmemiştir.'"
- **Atfedilen kaynak**: Müslim — Zekât 124
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Sabırdan daha hayırlı ve geniş bir ikram verilmemiştir" hadisi Buhârî ve Müslim'de Ebû Saîd el-Hudrî'den, zekât/infak bağlamında (Ensar kıssası) doğrulandı.

#### R96
- **Konum**: body + criticalNote ("Toplama Kamplarından Veri")
- **Site iddiası (TR)**: "Viktor Frankl — bir Holokost mağduru ve psikiyatrist — bunu kapsamlı belgeledi: yaşamak için bir 'neden'i olanlar... hayatta kalma avantajına sahipti."
- **Atfedilen kaynak**: Viktor Frankl
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Frankl'ın Holokost hayatta kalma gözlemi ve "yaşamak için bir neden"in avantaj sağladığı tezi, "Man's Search for Meaning" kitabının merkezi tezidir.

#### R97
- **Konum**: criticalNote ("Çağdaş psikoloji ↔ klasik tasavvuf")
- **Site iddiası (TR)**: "Klasik tasavvuf sabrı bu dilde değil; nefs makamları... ahval ve makamat (Kuşeyrî, Gazâlî, Mekkî)... zinciri içinde tanımlar."
- **Atfedilen kaynak**: Kuşeyrî, Gazâlî, el-Mekkî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kuşeyrî (er-Risâle), Gazâlî (İhyâ) ve Mekkî (Kûtü'l-Kulûb) klasik tasavvufta nefs makamları/ahvâl-makamat çerçevesinde sabrı ele alır; makalenin kendi criticalNote'u bu farkı zaten açıkça belirtiyor.

## next/public/tefekkur/sefer.json

#### R98
- **Konum**: body + kaynaklar bloğu
- **Site iddiası (TR)**: "Proto-Sami dil ailesinden, Akadca šapārum (göndermek, mesaj iletmek, yönetmek) ile ilişkili. Aramice סָפְרָא ve İbranice סֵפֶר ile aynı kökten."
- **Atfedilen kaynak**: Karşılaştırmalı Sami filolojisi (Akadca/Aramice/İbranice)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Akadca šapārum "göndermek" anlamı doğrulandı; "yazmak" anlamı akademik literatürde tartışmalı (CAD bazı bilim insanlarınca eleştirilir), ama site "yazmak" iddiasını doğrudan içermiyor (göndermek/yönetmek diyor) — büyük ölçüde tutarlı.

#### R99
- **Konum**: kaynaklar bloğu
- **Site iddiası (TR)**: "Lane Lexicon: Kök anlam: süpürmek, örtüyü kaldırmak, dağıtmak."
- **Atfedilen kaynak**: Lane's Lexicon (E.W. Lane)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Lane's Lexicon'da س-ف-ر kökünün "süpürmek, örtüyü kaldırmak, dağıtmak" ve "yolculuk" anlamları doğrulandı.

#### R100
- **Konum**: kaynaklar bloğu
- **Site iddiası (TR)**: "el-Müfredât (Râgıb el-İsfehânî): سَفْر: sadece maddi keşif (örtüyü kaldırma)."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Müfredât*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — el-Müfredât'ın سفر/سفرة maddelerinin tam metnine erişilemedi; genel içerik klasik tefsir geleneğiyle tutarlı görünüyor ama birincil kaynaktan doğrudan teyit edilemedi.

#### R101
- **Konum**: kaynaklar bloğu
- **Site iddiası (TR)**: "Akkadca šapārum: Göndermek, mesaj iletmek, yönetmek."
- **Atfedilen kaynak**: Akadca sözlükbilim (isimsiz kaynak)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Akadca šapārum'un "göndermek, mesaj iletmek, yönetmek" anlamı standart Akadoloji sözlüklerinde (CAD) doğrulandı.

#### R102
- **Konum**: kaynaklar bloğu
- **Site iddiası (TR)**: "Aramice / İbranice / Süryanice: סָפְרָא (sāp̄ərā): katip, yazıcı..."
- **Atfedilen kaynak**: Karşılaştırmalı Aramice/İbranice/Süryanice sözlükbilim
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Aramice סָפְרָא (kâtip) ve İbranice סֵפֶר (kitap) kökdeşliği karşılaştırmalı Sami filolojisinde standart bilgidir.

## next/public/tefekkur/sema-isim.json

#### R103
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Şu sırr-ı azîme binaen, kâinatı hayretfezâ acip bir tertiple tanzim etmiş... Herbir semâ, bir ayrı âlemin damı..."
- **Atfedilen kaynak**: Bediüzzaman — Sözler, 31. Söz
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Şu sırr-ı azîme binaen, kâinatı hayretfezâ acip bir tertiple tanzim etmiş" ve "herbir semâ bir ayrı âlemin damı" ifadeleri 31. Söz'de doğrulandı.

#### R104
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Şu âyet-i acîbe, insanın câmiiyet-i istidadı cihetiyle mazhar olduğu bütün kemâlât-ı ilmiye... 'tâlim-i esmâ' ünvanıyla..."
- **Atfedilen kaynak**: Bediüzzaman — Sözler, 20. Söz
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Tâlim-i esmâ" ve "câmiiyet-i istidad" temalı pasaj Yirminci Söz'ün İkinci Makam'ında doğrulandı.

#### R105
- **Konum**: body ("Kozmolojik Açıdan Semâvât ve Melekler")
- **Site iddiası (TR)**: "'es-semâü mevcun mekfûf' (Ahmed b. Hanbel, Tirmizî) ifadesi, göğün ilk başta homojen ve kapalı olduğunu... ima eder."
- **Atfedilen kaynak**: Ahmed b. Hanbel (Müsned), Tirmizî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "es-semâü mevcun mekfûf" ifadesinin Ahmed b. Hanbel (2/370) ve Tirmizî (Tefsir 58)'de geçtiği ve Bediüzzaman'ın bunu "dalgaları durmuş bir deniz" şeklinde yorumladığı doğrulandı.

#### R106
- **Konum**: criticalNote ("Analoji ↔ Delil ayrımı")
- **Site iddiası (TR)**: "Klasik kelâm ve tefsir geleneği (Râzî, Zemahşerî, İbn Kesîr, Suyûtî) bu modern matematik kavramlarını kullanmaz."
- **Atfedilen kaynak**: Râzî, Zemahşerî, İbn Kesîr, Suyûtî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Makalenin kendi criticalNote'u zaten bunu açıkça belirtiyor: Râzî, Zemahşerî, İbn Kesîr, Suyûtî modern küme/kategori teorisi kavramlarını kullanmaz — dürüst bir öz-farkındalık.

## next/public/tefekkur/siccin.json

#### R107
- **Konum**: body ("1. Tabaka") + kaynaklar bloğu
- **Site iddiası (TR)**: "Sîbeveyh'e (Arap gramerinin kurucusu) salt sarf üzerinden 'Siccîn nedir?' diye sorsanız... Siccîn, fi'īl kalıbındadır — tıpkı sikkîn gibi."
- **Atfedilen kaynak**: Sîbeveyh
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Siccîn'in S-J-N kökünden fi'īl kalıbında (sikkîn gibi) olması standart Arapça sarf bilgisiyle tutarlı, ama "Sîbeveyh'e sorsanız" retorik çerçevesi doğrudan doğrulanamadı — el-Kitâb'ın bu kelimeyi özel olarak ele aldığına dair kanıt bulunamadı.

#### R108
- **Konum**: body ("2. Tabaka") + criticalNote ("Spekülatif etimoloji")
- **Site iddiası (TR)**: "Sicill'in kökeni Latince Sigillum'dur... Siccîn, Sicill'in ağız varyantı olabilir." Not: "Klasik Arap dilcileri (Sîbeveyh, Cevherî, İbn Manzûr) bu bağlantıyı kurmaz."
- **Atfedilen kaynak**: Latince sigillum (etimoloji iddiası); Sîbeveyh, el-Cevherî, İbn Manzûr (bağlantıyı KURMADIKLARI iddiası)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Makale bu etimolojiyi kendi criticalNote'unda zaten "spekülatif" olarak işaretliyor ve "klasik dilciler bu bağlantıyı kurmaz" diyor — dürüst bir çerçeveleme.

#### R109
- **Konum**: body ("2. Tabaka") + kaynaklar bloğu
- **Site iddiası (TR)**: "Siccîl'i (pişmiş çamur taşları) hatırlayalım. Kökeni Farsça Sang-i-gil ('Taş ve Çamur')."
- **Atfedilen kaynak**: Farsça etimoloji (isimsiz kaynak)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Siccîl'in Farsça "seng-i gil" (taş-çamur) kökenli olduğu iddiası bazı klasik/dilbilimsel kaynaklarda geçer, ama makale bunu kanıtlanmış gibi sunuyor; bağımsız sözlük doğrulaması yapılamadı.

#### R110
- **Konum**: body ("3. Tabaka") + kaynaklar bloğu
- **Site iddiası (TR)**: "İlliyyîn: 'A-L-Y (Yükseklik) kökünden; İbranicedeki Elyon'la (En Yüce) akrabadır."
- **Atfedilen kaynak**: İbranice Elyon (karşılaştırmalı Sami dilbilim)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İlliyyîn'in A-L-Y kökünden gelmesi ve İbranicedeki Elyon (עֶלְיוֹן) ile Sami kökdeşliği karşılaştırmalı Sami dilbiliminde makul ve bilinen bir bağlantı.

#### R111
- **Konum**: kaynaklar bloğu (tam liste)
- **Site iddiası (TR)**: Etimolojik zincirin kaynakları: Sîbeveyh; "Ebdal fenomeni"; Latince Sigillum; Farsça Sang-i-gil; çivi yazısı; İbranice Elyon.
- **Atfedilen kaynak**: Yukarıdaki isimler/diller (toplu liste)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Toplu kaynak listesi, R107-R110 tekil değerlendirmelerinin toplamı; makale kendi spekülatif kısımlarını zaten criticalNote ile işaretliyor.

## next/public/tefekkur/sonsuz-nasil-bilinir.json

#### R112
- **Konum**: contrastDuo ("Mutlak Bilinmezlik")
- **Site iddiası (TR)**: "Huxley'nin agnostisizmi: Tanrı'nın varlığı bile kesin bilinemez. Wittgenstein daha radikal: 'Hakkında konuşulamayan şey hakkında susmalı.'"
- **Atfedilen kaynak**: Thomas Huxley, Ludwig Wittgenstein
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Huxley'in agnostisizm tanımı ve Wittgenstein'ın Tractatus'taki ünlü son önermesi ("Wovon man nicht sprechen kann, darüber muss man schweigen") doğru aktarılmış.

#### R113
- **Konum**: contrastDuo ("Kısmi / Yönelimsel Bilinir-lik")
- **Site iddiası (TR)**: "Apofatik teoloji: Tanrı'yı ne olmadığı ile tanımla. Aquinas: sıfatlar 'analoji' ile."
- **Atfedilen kaynak**: Thomas Aquinas
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Apofatik teoloji (via negativa) ve Aquinas'ın analogia entis / "analoji yoluyla sıfatlar" doktrini standart Hristiyan teoloji tarihidir, doğru özetlenmiş.

#### R114
- **Konum**: pullQuote (hadis)
- **Site iddiası (TR)**: "لَا أُحْصِي ثَنَاءً عَلَيْكَ... 'Sen'i (gerektiği gibi) sena etmekten acizim...'"
- **Atfedilen kaynak**: Müslim — Salât 222; Ebû Dâvûd — Salât 148
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Lâ uhsî senâen aleyke" duası Hz. Âişe'den Müslim, Ebû Dâvûd, Tirmizî, Nesâî tarafından rivayet edilir (secde duası); içerik ve genel kaynak ataması doğrulandı, spesifik hadis numaraları bağımsız teyit edilemedi.

#### R115
- **Konum**: criticalNote ("Felsufi'nin çapraz-gelenek harmanı")
- **Site iddiası (TR)**: "Tomistik analogia entis İslâm kelâmında doğrudan karşılığı olmayan bir ontolojik varsayım taşır."
- **Atfedilen kaynak**: Aquinas (analogia entis) — İslam kelâmı (bilâ keyf) karşılaştırması
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Makalenin kendi criticalNote'u zaten Tomistik analogia entis'in İslam kelamında doğrudan karşılığı olmadığını açıkça belirtiyor — dürüst bir epistemik çerçeveleme.

## next/public/tefekkur/sonsuzlugun-merdiveni.json

#### R116
- **Konum**: body ("Beyindeki Harita") + kaynaklar bloğu
- **Site iddiası (TR)**: "Hipokampüs sosyal statüyü fiziksel 'yükseklik' algısıyla kodlar (Schubert, 2005)."
- **Atfedilen kaynak**: Schubert, T. W. (2005), *Journal of Personality and Social Psychology*, 89(1), 1–21
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Schubert, T. W. (2005), "Your Highness: Vertical Positions as Perceptual Symbols of Power," Journal of Personality and Social Psychology, 89(1), 1-21 — atıf tam olarak doğrulandı.

#### R117
- **Konum**: criticalNote ("Embodied Cognition")
- **Site iddiası (TR)**: "Felsufi'nin embodied cognition (Lakoff &amp; Johnson, Schubert) çerçevesini... Schubert 2005 gerçek bir akademik çalışmadır ama... tartışmalı (replikasyon krizi sonrası)."
- **Atfedilen kaynak**: George Lakoff &amp; Mark Johnson; Schubert (2005, sitenin kendisi tartışmalı olduğunu belirtiyor); İbn Sînâ, Gazâlî (karşılaştırma)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Makalenin kendi criticalNote'u zaten Schubert 2005'in replikasyon krizi sonrası tartışmalı olduğunu ve bu çerçevenin klasik İbn Sînâ/Gazâlî formülasyonlarının yerini almadığını belirtiyor.

## next/public/tefekkur/terminoloji-1-lokal-global.json

#### R118
- **Konum**: body ("Benlik (Ene)")
- **Site iddiası (TR)**: "Nörobilimci Jill Bolte Taylor'ın My Stroke of Insight konuşması... sağ yarım kürenin bilinci üzerinden çevredeki enerjiye bağlı bir varlık olduğunu, sol yarım küre 'ben' dediği anda ise ayrıldığını... anlatır."
- **Atfedilen kaynak**: Jill Bolte Taylor (2008 TED konuşması)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Jill Bolte Taylor'ın 2008 TED konuşması "My Stroke of Insight" ve sağ/sol yarım küre deneyimine dair anlatısı (sağ = bağlantılı enerji varlığı, sol = "ben" ayrışması) doğrulandı.

#### R119
- **Konum**: body (devamı)
- **Site iddiası (TR)**: "Yaşadığı deneyimin sebebi muhtemelen Default Mode Network (DMN) diye bilinen bir nöral ağın kanama nedeniyle baskılanmasıydı."
- **Atfedilen kaynak**: Nörobilim kavramı "Default Mode Network" (isimsiz araştırmacı)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Default Mode Network'ün benlik hissiyle ilişkisi ve meditasyon/psilosibin ile baskılanabilmesi güncel nörobilim literatüründe (Carhart-Harris'in DMN/ego-dissolution çalışmaları) tanınan bir hipotez; site "muhtemelen" diyerek zaten temkinli.

#### R120
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Vücud (varlık) hayr-ı mahz, adem (yokluk) şerr-i mahz olduğuna..."
- **Atfedilen kaynak**: Bediüzzaman — Yirmialtıncı Söz
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Vücud hayr-ı mahz, adem şerr-i mahzdır" ifadesinin Yirmi Altıncı Söz'de (kader risalesi) geçtiği doğrulandı.

#### R121
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Ene, künûz-u mahfiye olan esmâ-i İlâhiyenin anahtarı olduğu gibi..."
- **Atfedilen kaynak**: Bediüzzaman — Otuzuncu Söz
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Ene, künûz-u mahfiye olan esmâ-i İlâhiyenin anahtarı..." ifadesi Bediüzzaman'ın Otuzuncu Söz'ünde ("Ene ve Zerre" bahsi) doğrulandı.

#### R122
- **Konum**: pullQuote ("Kötülük Lokaldir")
- **Site iddiası (TR)**: "Şerler, kubuhlar, noksanlar… hüsünlerin, hayırların, kemallerin mertebelerini... göstermeye vesile olsunlar..."
- **Atfedilen kaynak**: Bediüzzaman — Mesnevî-i Nûriye
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — "Şerler, kubuhlar, noksanlar… vâhid-i kıyasî olsunlar" alıntısı birden fazla bağımsız kaynakla (nurpedia.org, risaleinur.hizmetvakfi.org) teyit edildiği üzere aslında **İşârâtü'l-İ'câz'ın Fâtiha Sûresi tefsirinden** (12. Sual) gelir, Mesnevî-i Nûriye'den değil. Bediüzzaman'a ait olduğu doğru ama eser ataması yanlış — **düzeltilmeli**.

#### R123
- **Konum**: criticalNote ("Seri hakkında · alıntılar")
- **Site iddiası (TR)**: "Metindeki Yirmialtıncı Söz, Otuzuncu Söz, Mesnevî-i Nûriye ve Hutbe-i Şâmiye alıntıları Bediüzzaman Said Nursî'ye aittir."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî (atıf teyidi)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Genel yazarlık iddiası doğru (hepsi Bediüzzaman'a ait), ama R122'de tespit edilen sorun nedeniyle "Mesnevî-i Nûriye" olarak listelenen alıntının eser ataması hatalı — genel teyit geçerli, eser-düzeyi teyidi değil.

## next/public/tefekkur/terminoloji-2-parcalanamaz-butunler.json

#### R124
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Sen şecere-i hilkatin ya bir semeresi veya bir çekirdeğisin..."
- **Atfedilen kaynak**: Bediüzzaman — Mesnevî-i Nûriye
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pasaj web aramasıyla Mesnevî-i Nûriye metninde doğrulandı (aynı bağlamda "cüz'lükten küllîliğe" ifadesiyle).

#### R125
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Dünyaya ve cismanî lezâize meyledersen, âciz, zelil bir 'cüz'î' olursun..."
- **Atfedilen kaynak**: Bediüzzaman — Mesnevî-i Nûriye
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pasaj Mesnevî-i Nûriye'nin metninde doğrulandı; "insaniyet-i kübrâ" ifadesi de Nursî'nin bilinen terminolojisiyle örtüşüyor.

#### R126
- **Konum**: body ("Cüz-Cüz'î ve Küll-Küllî")
- **Site iddiası (TR)**: "İslâm felsefesinde cüz (parça) ve küll (bütün)... Cürcânî ve Bediüzzaman bu kavramları çok kullanır."
- **Atfedilen kaynak**: el-Cürcânî, Bediüzzaman
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Cürcânî'nin Kitâbü't-Ta'rîfât'ı klasik cüz/küll ayrımlarını standart biçimde tanımlar; Bediüzzaman'ın da bu kavramları yoğun kullandığı R124-125'te zaten doğrulandı.

#### R127
- **Konum**: criticalNote ("Seri hakkında · alıntılar")
- **Site iddiası (TR)**: "Metindeki Mesnevî-i Nûriye alıntıları Bediüzzaman Said Nursî'ye aittir."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî (atıf teyidi)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R124 ve R125'te doğrulanan iki alıntı gerçekten Mesnevî-i Nûriye'den ve Bediüzzaman'a ait, bu makalede atıf teyidi doğru.

## next/public/tefekkur/terminoloji-4-varliklarin-ayna-olusu.json

#### R128
- **Konum**: body ("Madde ve Mânâ — Ayna Oluş")
- **Site iddiası (TR)**: "Bediüzzaman Said Nursî bu ilişkiyi 'ayna olmak' kavramıyla açıklar. Donald Hoffman ise insan şuurunu açıklarken maddenin belirli konfigürasyonlarının... bir headset oluşturduğunu ifade eder."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî; Donald Hoffman
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Bediüzzaman'ın maddenin "ayna olmak" vasfı fikri Risale-i Nur'da (âyinedarlık) doğrulanabilir bir tema. Hoffman'ın "headset" ifadesi ise onun asıl terimi olan "arayüz/masaüstü" (interface/desktop) metaforunun serbest bir parafrazı — kavramsal olarak isabetli ama "headset" onun birincil terimi değil.

#### R129
- **Konum**: body
- **Site iddiası (TR)**: "Eş'arîler bu özün cüz-ü lâ yetecezzâ dedikleri, parçalanamayan temel partiküllerden oluştuğunu söylerler."
- **Atfedilen kaynak**: Eş'arî ekolü
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Eş'arî kelâm ekolünün "cüz-ü lâ yetecezzâ" (bölünemez atom/cevher-i ferd) doktrini tarihsel olarak iyi belgelenmiş bir Eş'arî atomizm pozisyonudur.

## next/public/tefekkur/tugyan.json

#### R130
- **Konum**: body ("1. Temel Anlam") + kaynaklar bloğu
- **Site iddiası (TR)**: "Ge'ez: ጣዖት (ṭaʿot) — 'put, idol'; İbranice: טָעוּת (ṭaʿút)... Mısır kökenli alternatif teori: ḏḥwtj (Thoth)..."
- **Atfedilen kaynak**: Karşılaştırmalı Sami/Mısır etimolojisi (Ge'ez, İbranice, Thoth teorisi)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Wiktionary'nin طاغوت maddesi birebir örtüşüyor: Ge'ez ጣዖት ← İbranice טָעוּת ← Aramca טעותא ← Mısır kökenli Thoth (ḏḥwtj) teorisi (Wahib Atallah'a atfen) — zincir aynen doğrulandı.

#### R131
- **Konum**: body ("8. Kaynaklar") + kaynaklar bloğu
- **Site iddiası (TR)**: "al-Mufradât — Râgıb el-İsfehânî: 'Haddi aşma; isyan konusunda sınır tanımama... Tâğût: her azgın ve Allah'tan başka tapınılan.'"
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Mufredât*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Arapça kaynaklarda doğrulandı: Râgıb el-İsfehânî "الطاغوت عبارة عن كل متعد وكل معبود من دون الله" der — site çevirisi anlam olarak birebir örtüşüyor.

#### R132
- **Konum**: body + criticalNote ("Risale-i Nur perspektifi")
- **Site iddiası (TR)**: "Bediüzzaman, tâğût kavramını iki ana eksene yerleştirir... Klasik tefsir tâğût'u daha çok 'şeytan / put / sapık otorite' anlamında okur (Râzî, İbn Kesîr)."
- **Atfedilen kaynak**: Bediüzzaman (Mesnevî-i Nûriye); Râzî, İbn Kesîr (karşılaştırma)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "İki tağut: Ene ve tabiat" teması Risale-i Nur literatüründe doğrulanan meşhur bir motif; klasik tefsirin tâğût'u şeytan/put/sapık otorite olarak okuması da (Kurtubî örneğiyle teyit edildi) genel iddiayla örtüşüyor.

## next/public/tefekkur/vicdan-evrensel-tercuman.json

#### R133
- **Konum**: pullQuote ("Feynman Prensibi")
- **Site iddiası (TR)**: "'Bir kavramı basitçe anlatamıyorsan, onu gerçekten anlamamışsındır.'"
- **Atfedilen kaynak**: Richard Feynman
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — "Bir kavramı basitçe anlatamıyorsan, onu gerçekten anlamamışsındır" sözü Feynman'a yaygın biçimde yanlış atfedilen, kaynağı doğrulanamayan bir internet-alıntısıdır (Feynman'ın Nobel konuşmasında bunun tam tersini ima eden bir anekdotu var). **Düzeltilmeli** — ya kaldırılmalı ya da "atfedilir/yanlış atfedildiği bilinen" gibi ihtiyatlı bir dille sunulmalı.

#### R134
- **Konum**: body
- **Site iddiası (TR)**: "Meşhur fizikçi derse hiçbir zaman denklemlerle başlamazdı. 'Bir elektron olduğunu hayal et…' ya da 'Uzayı bir lastik örtü gibi düşün…' derdi."
- **Atfedilen kaynak**: Richard Feynman (öğretim yöntemi iddiası)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Feynman'ın sezgi-inşa eden, denklemle başlamayan öğretim tarzı genel olarak iyi belgelenmiş bir karakter özelliği (QED kitabı, BBC röportajları); ancak "bir elektron olduğunu hayal et" gibi spesifik ifadelerin birebir Feynman alıntıları olduğu doğrulanamadı — muhtemelen yazarın kendi parafrazı.

#### R135
- **Konum**: pullQuote ("İlâhî Anlayışa Köprü")
- **Site iddiası (TR)**: "Dördüncü burhan: Âlem-i gayb ve şehadetin... nokta-i iltisakı... vicdan denilen fıtrat-ı zîşuurdur..."
- **Atfedilen kaynak**: Bediüzzaman — Mesnevî-i Nûriye, Nokta
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pasaj Mesnevî-i Nûriye'nin Nokta risalesinde ("Dördüncü Bürhan" bölümü) birebir bulunuyor.

## next/public/tefekkur/yapilanlarin-suslu-gorulmesi.json

#### R136
- **Konum**: pullQuote
- **Site iddiası (TR)**: "اَللّٰهُمَّ اَرِنَا الْحَقَّ حَقًّا... Hz. Ömer'e atfedilen meşhur niyaz"
- **Atfedilen kaynak**: Hz. Ömer'e atfedilen dua (tarihi/geleneksel atıf)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Dua İslam geleneğinde yaygın biçimde Hz. Ömer'e atfedilir; site de bunu kesin bir hadis değil "atfedilen meşhur niyaz" olarak sunduğundan iddia düzeyiyle örtüşüyor.

#### R137
- **Konum**: criticalNote ("Ekstremist müslümanlık oksimorondur + Hz. Ömer duası nüansı")
- **Site iddiası (TR)**: "Klasik tefsir (Taberî, Râzî, Kurtubî) vasat'ı yalnızca 'orta yol' değil... okur... Hz. Ömer'e atfedilen dua... bazı hadis kaynaklarında isnad zayıflığı veya 'mevkuf'/'merfû' versiyonları arasında ihtilaf vardır."
- **Atfedilen kaynak**: et-Taberî, er-Râzî, el-Kurtubî; Hz. Ömer'e atıf (isnad tartışması)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote'un kendisi isnad zayıflığı/mevkuf-merfû ihtilafını ve vasat kelimesinin Taberî-Râzî-Kurtubî'de taşıdığı geniş anlamları dürüstçe belirtiyor — öz-eleştirel çerçeveleme kendi iddiasıyla örtüşüyor.

## next/public/tefekkur/yaratilis-hikayesi-2-katmanli-yaratilis.json

#### R138
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Semâ, dalgaları karardâde olmuş bir denizdir. — Bediüzzaman"
- **Atfedilen kaynak**: Bediüzzaman
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bediüzzaman'ın Lem'alar'da (On İkinci Lem'a) "es-semâu mevcün mekfûf" hadisini açıklarken kullandığı kendi cümlesi olduğu doğrulandı.

#### R139
- **Konum**: body ("Semâvât — Tefrik ve Katmanlı Yapı")
- **Site iddiası (TR)**: "Bediüzzaman Mîrac Risâlesi'nde kâinatın ferşten arşa, zerreden Süreyyâ'ya tabaka tabaka yaratıldığını... ifade eder."
- **Atfedilen kaynak**: Bediüzzaman — Mîrac Risâlesi
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mîrac Risâlesi'nde (Otuz Birinci Söz) "ferşten arşa, zerreden şemse" tarzı katmanlı yaratılış ifadeleri doğrulandı, ancak "zerreden Süreyyâ'ya" kombinasyonu tam bu haliyle bulunamadı — "Süreyya" ayrı bir bağlamda geçiyor, olası bir yazarın birleştirmesi.

#### R140
- **Konum**: pullQuote
- **Site iddiası (TR)**: "Allah her göğe özel bir emr ulaştırdı ve o emri melekler aracılığıyla uygulattı. — İbn Arabî, Fütûhât-ı Mekkiyye"
- **Atfedilen kaynak**: İbn Arabî (*el-Fütûhâtü'l-Mekkiyye*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Fütûhât-ı Mekkiyye'de her göğe özel bir "emr" ulaştığı fikri genel olarak eserin temasıyla uyumlu (Fussilet 41:12'ye dayanır), ancak alıntı birebir bu cümleyle doğrulanamadı — çok ciltli eser dijital olarak tam taranamadı.

#### R141
- **Konum**: criticalNote ("Modern fizik paraleli — yazarın okuması")
- **Site iddiası (TR)**: "Kuantum alan teorisine göre parçacıklar, henüz parçacık değilken alan dalgalarıdır... yazarın kurduğu analojik bir okumadır; klasik tasavvuf literatürü bu modern kavramları kullanmaz."
- **Atfedilen kaynak**: Genel "kuantum alan teorisi" çerçevesi (isimsiz, sınırda madde — site kendi analojisi olduğunu belirtiyor)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote zaten bunun "yazarın kurduğu analojik bir okuma" olduğunu ve klasik tasavvuf literatürünün bu modern kavramları kullanmadığını açıkça belirtiyor — kendi iddia seviyesiyle tam örtüşüyor.

#### R142
- **Konum**: criticalNote ("Seri hakkında · alıntılar")
- **Site iddiası (TR)**: "Metindeki Fütûhât-ı Mekkiyye alıntısı İbn Arabî'ye... aittir... Yazıda ayrıca es-Semâ'ya dair bir hadis rivayeti anılır (Ahmed b. Hanbel, Tirmizî)."
- **Atfedilen kaynak**: İbn Arabî, Bediüzzaman (atıf teyidi); Ahmed b. Hanbel, Tirmizî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Fütûhât/İbn Arabî ve "karardâde olmuş deniz"/Bediüzzaman atıfları R138/R140'ta genel olarak tutarlı bulundu; "es-Semâ" hadisinin Ahmed b. Hanbel ve Tirmizî'de geçtiği iddiası da makul.

> **İddia bulunamayan makaleler (Batch B)**: ruhsal-cografya.json, terminoloji-3-fizikalizm.json, yaratilis-hikayesi-1-giris.json, rahmetin-grameri-7.json.

## next/public/tefekkur/ala-suresi-1.json

#### R143
- **Konum**: body metni
- **Site iddiası (TR)**: "Stephen Wolfram bu anlam için şunu söylüyor: insan yahut herhangi bir gözlemci computationally bounded... olduğu için, computationally irreducible olan bazı şeyleri anlamlandıramaz, onlara 'rastgele' der."
- **Atfedilen kaynak**: Stephen Wolfram
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Computationally bounded"/"computationally irreducible" gerçekten Stephen Wolfram'ın kendi terminolojisidir (A New Kind of Science ve sonraki "observer theory" yazıları).

## next/public/tefekkur/alak-suresi-1.json

#### R144
- **Konum**: body metni
- **Site iddiası (TR)**: "Lane Lexicon'daki 1. sense budur ve şöyle örnek verilmiş: قَرَأَتْ هٰذِهِ النَّاقَةُ..."
- **Atfedilen kaynak**: Lane's Lexicon (E.W. Lane)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "قَرَأَتْ هٰذِهِ النَّاقَةُ سَلًى قَطُّ..." örneği ve İngilizce çevirisi Lane's Lexicon'da ق ر أ maddesinde birebir doğrulandı.

## next/public/tefekkur/alak-suresi-2-3.json

#### R145
- **Konum**: body metni
- **Site iddiası (TR)**: "Felsufi burada İsmail Yakıt'a (2003) dayanarak alak'ın 'kan pıhtısı' okumasının Yunan tıp literatürü etkisi olduğunu öne sürer (İsmail Yakıt, Kur'an'ı Anlamak s. 35-43, 2003)... klasik müfessirlerin önemli bir kısmı alak'ı doğrudan embriyonik 'kan pıhtısı' olarak okumuştur (Taberî, İbn Kesîr)."
- **Atfedilen kaynak**: İsmail Yakıt (2003, *Kur'an'ı Anlamak*); Taberî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İsmail Yakıt'ın "Kur'an'ı Anlamak" (2003, Ötüken) kitabının var olduğu doğrulandı; ancak "s. 35-43" sayfa aralığı ve Yunan tıp literatürü etkisi iddiasının birebir metni doğrulanamadı. Taberî/İbn Kesîr'in alak'ı kan pıhtısı olarak okuduğu klasik tefsirde iyi bilinen bir pozisyon.

#### R146
- **Konum**: body metni
- **Site iddiası (TR)**: "İsfehânî el-Müfredât'ında şöyle der: ke-re-me — Birbirinin yerine kullanılabilen ikrâm ve tekrîm formlarına gelince..."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Müfredât*)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İsfehânî'nin ك ر م kökünü ikrâm/tekrîm ile ilişkilendirdiği genel olarak doğrulandı, ama sitedeki tam Türkçe cümlenin Arapça orijinalin birebir çevirisi olduğu ayrıca teyit edilemedi.

## next/public/tefekkur/alak-suresi-4-5.json

#### R147
- **Konum**: body metni
- **Site iddiası (TR)**: "Ama bir takım denklemlerle — mesela Kepler'in kanunlarıyla — soyutlayıp tüm zamanlar için genelleştirebilir..."
- **Atfedilen kaynak**: Kepler kanunları (Johannes Kepler)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kepler'in gezegen hareketi yasalarının gözlem verisini denklemlerle soyutlayıp genelleştirdiği tarihsel olarak doğru, tartışmasız bir bilim tarihi olgusu.

#### R148
- **Konum**: body metni ("Alternatif okuma — Kalem'in genişletilmesi")
- **Site iddiası (TR)**: "Klasik müfessirler (Râzî, Taberî, İbn Kesîr) Kalem'i ilk yaratılan aklâm-ı ilâhî, Levh-i Mahfûz'a yazan kalem... olarak ele almıştır."
- **Atfedilen kaynak**: Râzî, Taberî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Klasik müfessirlerin Kalem sûresi tefsirinde kalemi ilk yaratılan, Levh-i Mahfûz'a yazan ilâhî kalem olarak ele aldığı yaygın klasik tefsir pozisyonudur; site zaten bunu "alternatif okuma" olarak çerçeveliyor.

#### R149
- **Konum**: body metni, doğrudan alıntı
- **Site iddiası (TR)**: "…mâhiyet-i insâniye, şu kâinâtın bir misâl-i musağğarı olduğundan... [Emirdağ Lâhikası-II, 83. Mektup]"
- **Atfedilen kaynak**: Bediüzzaman Said Nursi (*Emirdağ Lâhikası-II*, 83. Mektup)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pasaj Emirdağ Lâhikası-II, 83. Mektup'ta doğrulandı.

#### R150
- **Konum**: body metni, hadis
- **Site iddiası (TR)**: "Allah'ın ilk yarattığı şey kalemdir... [Diğer rivâyet — Deylemî, Aclûnî, Ebû Nuaym, Cürcânî, Beyhakî]"
- **Atfedilen kaynak**: Deylemî, Aclûnî, Ebû Nuaym, Cürcânî, Beyhakî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "Allah'ın ilk yarattığı şey kalemdir" hadisi sahih/hasen kabul edilir; ancak "ilk yaratılan akıldır" rivayeti İbnü'l-Cevzî'nin el-Mevzûât'ında "aslı olmayan uydurma" (mevzu) olarak nitelenen tartışmalı bir rivayettir — site bu zayıflığı belirtmeden aktarıyor. 5 isimlik kaynak listesi bu tartışmalı rivayetle ilişkilendirilen isimlerle uyumlu görünüyor ama birebir doğrulanamadı.

## next/public/tefekkur/allahu-ekber-seyr-ilallah.json

#### R151
- **Konum**: body + kapanış notu
- **Site iddiası (TR)**: "Bediüzzaman hazretleri namazı anlattığı On Altıncı Söz'de... Bediüzzaman alıntıları Mesnevî-i Nûriye (Habbe) ve Sözler (On Altıncı Söz, Dördüncü Şuâ) metinlerindendir."
- **Atfedilen kaynak**: Bediüzzaman Said Nursî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Pasaj Mesnevî-i Nûriye'nin Habbe risalesinde doğrulandı; On Altıncı Söz'ün namaz/tekbir temasıyla ilgili genel atıf da tutarlı.

## next/public/tefekkur/analitik-icgoru-1.json

#### R152
- **Konum**: body + criticalNote
- **Site iddiası (TR)**: "Öyle sanırdım ayrıyam, dost gayrıdır ben gayrıyam..." — criticalNote: "Niyazi Mısrî ve Yunus Emre alıntıları tasavvufî fenâ doktrininin halk-edebî ifadesidir."
- **Atfedilen kaynak**: Niyazi Mısrî, Yunus Emre
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Öyle sanırdım ayrıyam..." dizesi Niyazi Mısrî'nin "Derman Aradım Derdime" şiirinden doğrulandı; "Beni bende demen" dizesi de yaygın biçimde Yunus Emre'ye atfedilir. criticalNote bunların "halk-edebî ifade" olduğunu zaten belirtiyor.

#### R153
- **Konum**: criticalNote
- **Site iddiası (TR)**: "Felsufi'nin 'ene = kalın/şeffaf cam' metaforu... Bediüzzaman'ın 30. Söz'ünden gelir... Klasik kelâm (Eş'arî, Mâtürîdî) ve klasik tasavvuf (Kuşeyrî, Gazâlî, İbn Arabî) benzer... ayrımları farklı dilde yapar."
- **Atfedilen kaynak**: Bediüzzaman (30. Söz); Eş'arî, Mâtürîdî, Kuşeyrî, Gazâlî, İbn Arabî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote, "ene = kalın/şeffaf cam" metaforunun 30. Söz'e dayandığını ve klasik kelâm/tasavvufun benzer ayrımları farklı terimlerle yaptığını dürüstçe, iddia seviyesini abartmadan belirtiyor.

## next/public/tefekkur/analitik-icgoru-2.json

#### R154
- **Konum**: body + criticalNote
- **Site iddiası (TR)**: "Termodinamiğin ikonu Rod Swenson'ın içgörüsü: 'İkinci Yasa, dünyanın potansiyelleri minimize etmeye çalıştığını söyler...' — criticalNote: 'sistem en hızlı entropi üretim yolunu seçer' formülasyonu (Swenson 1989, Dewar 2003) tartışmalı bir extremal principle."
- **Atfedilen kaynak**: Rod Swenson; Swenson (1989), Dewar (2003)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Swenson'ın gerçek tezi doğrulandı; criticalNote de LMEP/MEPP'in (Swenson 1989, Dewar 2003) fizikte konsensüs kazanmamış tartışmalı bir ilke olduğunu doğru biçimde belirtiyor.

#### R155
- **Konum**: criticalNote
- **Site iddiası (TR)**: "'Bilgi teorisi ↔ Şuurun rolü' eşleştirmesi (Shannon entropisi + coarse-graining) çağdaş bir analojidir"
- **Atfedilen kaynak**: Claude Shannon (Shannon entropisi)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote, Shannon entropisi + coarse-graining eşleştirmesinin "çağdaş bir analoji" olduğunu ve klasik kelâmda bulunmadığını açıkça belirtiyor.

## next/public/tefekkur/analitik-icgoru-3.json

#### R156
- **Konum**: criticalNote
- **Site iddiası (TR)**: "Felsufi'nin kavramları Bediüzzaman'ın 4. ve 30. Söz'lerine dayanan Nurcu bir çerçevedir; klasik Sünnî kelâm (Eş'arî, Mâtürîdî)... Delayed gratification (Mischel'in marshmallow testi geleneği)..."
- **Atfedilen kaynak**: Bediüzzaman (4., 30. Söz); Eş'arî, Mâtürîdî; Walter Mischel
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote çerçevenin Nurcu okuma olduğunu, Mischel köprüsünün modern psikolojiden geldiğini dürüstçe belirtiyor; Mischel'in marshmallow deneyi gerçek ve iyi belgelenmiş bir araştırma.

## next/public/tefekkur/ayet-koprusu.json

#### R157
- **Konum**: body + criticalNote
- **Site iddiası (TR)**: "İmam Gazâlî'nin meşhur ifadesiyle: Kainat, İnsan ve Kur'an, bir hakikatin üç yüzüdür." — criticalNote: benzer üçlü Gazâlî'nin İhyâ ve Mişkâtu'l-Envâr'ında bulunur ama kesin formülasyon Felsufi'nin; "top-down causality/telos" Polanyi, Deacon, Aristoteles'ten.
- **Atfedilen kaynak**: İmam Gazâlî (*İhyâ*, *Mişkâtü'l-Envâr*); Michael Polanyi, Terrence Deacon, Aristoteles
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote, kesin formülasyonun Felsufi'nin kendi ifadesi olduğunu ama benzer üçlünün Gazâlî'nin İhyâ ve Mişkâtü'l-Envâr'ında bulunduğunu belirtiyor; Polanyi/Deacon/Aristoteles referansları da gerçek isimler — dürüst çerçeveleme.

## next/public/tefekkur/cennet-cin-mecnun.json

#### R158
- **Konum**: body metni
- **Site iddiası (TR)**: "İbn Abbâs'ın rivayetine göre, Kehf 18:107'de جَنَّات (cennetler) sözcüğünün çoğul kullanılmasının nedeni yedi kat cennetin varlığıdır."
- **Atfedilen kaynak**: İbn Abbâs
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Abbâs'ın Kehf 18:107'deki جَنَّات çoğul kullanımını yedi farklı cennetin varlığıyla açıkladığı Arapça kaynaklarda birebir doğrulandı.

#### R159
- **Konum**: body metni, doğrudan alıntı
- **Site iddiası (TR)**: "Bediüzzaman, Mesnevî-i Nûriye / Habbe'de cennet'i tohum-ağaç çiftiyle anlatır: 'İnsanın çekirdeği olan kalb...'"
- **Atfedilen kaynak**: Bediüzzaman Said Nursi (*Mesnevî-i Nûriye*, Habbe)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "İnsanın çekirdeği olan kalb..." pasajı Mesnevî-i Nûriye'nin Habbe risalesinde birebir doğrulandı.

#### R160
- **Konum**: kaynaklar bloğu
- **Site iddiası (TR)**: "Râgıb el-İsfehânî — جَنَّة, جِنّ, مَجْنُون semantik analizi"
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — جَنَّة/جِنّ/مَجْنُون kelimelerinin ortak ج ن ن (gizlilik/örtme) kökünden türetilmesi klasik Arap sözlükbiliminde standart ve iyi belgelenmiş bir bağlantı; el-Müfredât'taki spesifik madde ayrı ayrı teyit edilemedi.

## next/public/tefekkur/dusunme-fiilleri-zihnin-isletim-sistemi.json

#### R161
- **Konum**: footnote
- **Site iddiası (TR)**: "Klasik sözlük geleneği: Râgıb el-İsfahânî, el-Müfredât; Ibn Manzûr, Lisânü'l-Arab."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî, İbn Manzûr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Müfredât ve Lisânü'l-Arab gerçek, standart klasik Arapça sözlüklerdir; genel "klasik sözlük geleneği" atfı makul ve doğrulanabilir.

## next/public/tefekkur/emrin-mahiyeti.json

#### R162
- **Konum**: criticalNote
- **Site iddiası (TR)**: "Felsufi'nin 'Emr ↔ Sırr-ı Kayyumiyet' bağı Bediüzzaman'ın İsm-i Kayyûm bahsi (Otuzuncu Lem'a)... Klasik kelâm (Eş'arî, Mâtürîdî, İbn Sînâ)... Felsufi'nin dili çağdaş felsefi vokabülerdir (Aristoteles'in telos / Polanyi'nin top-down causation)."
- **Atfedilen kaynak**: Bediüzzaman (Otuzuncu Lem'a); Eş'arî, Mâtürîdî, İbn Sînâ; Aristoteles, Michael Polanyi
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Otuzuncu Lem'a gerçekten İsm-i Kayyûm'u ayrıntılı işler; criticalNote çağdaş vokabüleri (Aristoteles telos, Polanyi top-down causation) klasik kelâmdan dürüstçe ayırıyor.

## next/public/tefekkur/enerji-krizi.json

#### R163
- **Konum**: body metni, doğrudan alıntı
- **Site iddiası (TR)**: "İmam Gazâlî der: 'Kalbin misali, her taraftan oklarla vurulan bir hedeftir.'"
- **Atfedilen kaynak**: İmam Gazâlî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Kalbin misali, her taraftan oklarla vurulan bir hedeftir" Gazâlî'nin (Mükâşefetü'l-Kulûb) eserinde geçen bilinen bir pasajla örtüşüyor — arama sonuçlarında neredeyse birebir aynı Türkçe çeviri bulundu.

#### R164
- **Konum**: criticalNote
- **Site iddiası (TR)**: "(b) Nörobilim iddiaları: 'Beyin canlı hayal edileni ve gerçekleşeni ayıramaz'... popüler bilimde yaygın — ama akademik nörobilim daha nüanslıdır."
- **Atfedilen kaynak**: Sitenin kendi metodolojik uyarısı — isimsiz "modern nörobilim" iddiasına karşı
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Dış kaynak iddiası değil, sitenin kendi metodolojik uyarısı; popüler-bilim formüllerinin akademik nörobilimde daha nüanslı olduğunu dürüstçe belirtiyor.

#### R165
- **Konum**: footnote
- **Site iddiası (TR)**: "Hadiste de: min hüsni İslâmi'l-mer'i terkühü mâ lâ ya'nîh... (Tirmizî, Zühd 11)."
- **Atfedilen kaynak**: Tirmizî (Zühd 11)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "Men hüsni islâmi'l-mer'i terkühü mâ lâ ya'nîh" gerçek ve yaygın bilinen bir hadis (Tirmizî tarafından rivayet edilir, hasen kabul edilir); "Zühd 11" tam bab numarası bağımsız olarak doğrulanamadı.

#### R166
- **Konum**: body metni
- **Site iddiası (TR)**: "Efendimiz ﷺ'e tekrar tekrar nasihat istendi ve her seferinde dedi: 'لا تَغْضَب' — 'Öfkelenme' (Buhârî, Edeb 76)."
- **Atfedilen kaynak**: Buhârî (Edeb 76)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Buhârî'nin Edeb bölümünde "öfkeden sakınmak" başlıklı 76. bab, "لا تَغْضَب" hadisiyle eşleşiyor.

## next/public/tefekkur/evrim-dinsizligi-projesi.json

#### R167
- **Konum**: body metni ("Hani Piltdown Fosili Vardı...")
- **Site iddiası (TR)**: "Bilim camiasında sahte data ve delil üretilmiyor değil... Ancak onları ortaya çıkaranlar da yine aynı camiada... diğer bilim insanları oldu."
- **Atfedilen kaynak**: Piltdown Man sahte fosili (tarihi olay, isim verilmeden)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Piltdown Man sahtekârlığının bilim camiasının kendi içinden (1953'te Kenneth Oakley ve ekibi) ortaya çıkarıldığı iyi belgelenmiş tarihi bir olay; site iddiası doğru.

## next/public/tefekkur/evrim-inanc-resimler.json

#### R168
- **Konum**: başlık/not bloğu
- **Site iddiası (TR)**: "Bu yazı 2019'da Seyeran beyin yaptığı bir konuşmanın yazıya dökülüp düzenlenmiş hâlidir."
- **Atfedilen kaynak**: "Seyeran Bey" (2019 konuşması)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Dışarıdan doğrulanamayan, sitenin kendi editoryal/provenance notu (dış akademik/tarihi bir kaynağa değil yazarın kendi beyanına dayanıyor); yanlış olduğuna dair bir bulgu da yok.

#### R169
- **Konum**: body metni
- **Site iddiası (TR)**: "Fahrettin Râzî'nin meşhur tefsirinde 'dünyanın dönmesi mümkün değildir' diye bir açıklama var. Mantığı şu: Eğer dünya dönüyor olsaydı, gemide zıplayan insan daha ileriye düşerdi."
- **Atfedilen kaynak**: Fahrettin Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin Mefâtîhu'l-Ğayb'da dünyanın küre olduğunu ama dönmediğini savunduğu doğrulandı (İbn Sînâ etkisiyle); ancak "gemide zıplayan insan daha ileri düşerdi" spesifik argümanının metni bağımsız olarak bulunamadı — dönemin tipik hareket-argümanlarıyla tutarlı ama doğrudan teyit edilemedi.

#### R170
- **Konum**: body metni
- **Site iddiası (TR)**: "Bediüzzaman'ın eserlerinde 'esir maddesi'nden bahsedilir..."
- **Atfedilen kaynak**: Bediüzzaman
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bediüzzaman'ın Risale-i Nur'da "esir maddesi" kavramını (16. Söz ve başka yerlerde) işlediği doğrulandı.

#### R171
- **Konum**: body metni
- **Site iddiası (TR)**: "Big Bang teorisini ilk öne süren Georges Lemaître bir papazdı!"
- **Atfedilen kaynak**: Georges Lemaître
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Georges Lemaître gerçekten bir Katolik rahipti ve Big Bang'in öncüsü "ilkel atom" hipotezini ilk öne süren kişiydi.

## next/public/tefekkur/gecmis-klasik-gelecek-kuantum.json

#### R172
- **Konum**: body + footnote
- **Site iddiası (TR)**: "'Bu formülasyon açıkça gösterir ki belirsizlik bağıntısı geçmişe ilişkin değildir.'" — Çev. Carl Eckart ve F. C. Hoyt (University of Chicago Press, 1930), s. 20.
- **Atfedilen kaynak**: Werner Heisenberg (dolaylı); çev. Carl Eckart, F. C. Hoyt (1930)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "The Physical Principles of the Quantum Theory" (Chicago, 1930) s. 20'deki "This formulation makes it clear that the uncertainty relation does not refer to the past" cümlesi arama sonuçlarında neredeyse birebir doğrulandı.

#### R173
- **Konum**: footnote
- **Site iddiası (TR)**: "Dyson'ın ikinci sonucu..." — Science and Ultimate Reality içinde, ed. John D. Barrow, Paul C. W. Davies, Charles L. Harper Jr. (Cambridge UP, 2004), böl. 4.
- **Atfedilen kaynak**: Freeman Dyson; ed. Barrow, Davies, Harper Jr. (2004)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Science and Ultimate Reality" (Cambridge UP 2004) gerçek bir kitap; 4. bölümün Freeman Dyson tarafından yazıldığı doğrulandı.

#### R174
- **Konum**: footnote
- **Site iddiası (TR)**: "arXiv:2104.09945 (2021). Geçmiş/şimdi/gelecek ayrımının belirli–belirsiz ayrımından türediği tezi."
- **Atfedilen kaynak**: arXiv:2104.09945 (2021)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — arXiv:2104.09945 (2021) gerçek bir makale olup kuantum mekaniği bağlamında geçmiş/şimdi/gelecek ile belirli/belirsiz ayrımı arasındaki ilişkiyi ele alıyor.

#### R175
- **Konum**: body metni
- **Site iddiası (TR)**: "Laplace'ın şeytanı tarzında bir varlık düşünün: ekrandaki parlamadan bir an sonra gelip evrendeki her parçacığın envanterini çıkarsın."
- **Atfedilen kaynak**: Pierre-Simon Laplace ("Laplace'ın şeytanı")
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Laplace'ın şeytanı" Pierre-Simon Laplace'a ait yaygın bilinen gerçek bir düşünce deneyi/kavramdır.

## next/public/tefekkur/hala-mi-evrim.json

#### R176
- **Konum**: body metni
- **Site iddiası (TR)**: "Katolik kilisesi 1996'da evrimin inançla çelişmediğini açıkça karara bağlarken, bazı evanjelik gruplar ve Müslümanların çoğu Eski Ahit'in Yaratılış hikâyesini birebir yaratılış teorisi olarak kabul ediyor."
- **Atfedilen kaynak**: Katolik Kilisesi (1996 kararı)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — II. Jean Paul'ün 1996'da Pontifical Academy of Sciences'a gönderdiği "Truth Cannot Contradict Truth" mesajında evrimi "sadece bir hipotezden fazlası" olarak nitelediği doğrulandı; ancak bu resmi bir "karar/hüküm" değil bir papalık mesajıydı — "açıkça karara bağlarken" ifadesi biraz güçlü bir çerçeveleme.

#### R177
- **Konum**: body metni
- **Site iddiası (TR)**: "Muhammed Hamîdullah · Muhammed İkbal · Seyyid Emîr Ali · İsmail Hakkı İzmirli · Maurice Bucaille · Muhammed Esed · Bahaeddin Sağlam · Süleyman Ateş · Cafer Sadık Yaran · Mehmed Bayraktar · İsmail Yakıt · Shabir Ally — bu isimler evrimi, yaratılışı anlamanın bir yolu olarak görmüştür."
- **Atfedilen kaynak**: 12 isim listesi (yukarıda) — her biri için ayrı, doğrulanabilir bir pozisyon iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — 12 isimden yalnızca ikisi (Hamîdullah, İkbal) örneklendi ve doğrulandı — ikisi de evrimi yaratılışla uyumlu bir çerçevede ele almış; kalan 10 ismin pozisyonu tek tek doğrulanmadı, ayrı bir tur gerekiyor.

#### R178
- **Konum**: body metni
- **Site iddiası (TR)**: "hatta Darwin'den önce bile 'Mohammedan Theory of Evolution' diye anılan görüşler mevcuttur."
- **Atfedilen kaynak**: Charles Darwin (referans noktası); "Mohammedan Theory of Evolution" (isimsiz tarihi kavram)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Mohammedan Theory of Evolution" tabirinin John William Draper tarafından (1874) İbn Haldun'un Mukaddime'sindeki evrimsel-benzeri fikirlere atfen kullanıldığı doğrulandı — Darwin'den (1859) önceki fikirlere işaret ediyor.

#### R179
- **Konum**: body metni
- **Site iddiası (TR)**: "Einstein ve çevresi kuantum teorisine yüz yıldır reddiye yazdı — bu onu geçersiz kılmadı."
- **Atfedilen kaynak**: Albert Einstein
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Einstein'ın kuantum teorisine yıllarca itiraz ettiği iyi belgelenmiş bir tarihi gerçek; "yüz yıldır" ifadesi çevresinin/takipçilerinin devam eden tartışmasını da kapsıyorsa makul.

## next/public/tefekkur/kader.json

#### R180
- **Konum**: body metni
- **Site iddiası (TR)**: "Sevvâke: 'Seni varoluş amacını gerçekleştirecek bir altyapıyla donattı' (Râğıb)."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "Sevvâ" kökünün "eşitlemek/düzenlemek" anlamı Arapça sözlükbilimiyle tutarlı; ancak Râgıb'a atfedilen spesifik ifadenin birebir el-Müfredât metnine dayandığı bağımsız doğrulanamadı — yorumlayıcı bir paraphrase olabilir.

#### R181
- **Konum**: body metni
- **Site iddiası (TR)**: "David Deutsch'un Constructor Theory adını verdiği yeni fizik kuramı da tam bu noktada — bizim tasarım dediğimiz yerdeki 'bilgi' kavramını merkeze alır."
- **Atfedilen kaynak**: David Deutsch (Constructor Theory)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — David Deutsch'un Constructor Theory'si gerçek, güncel bir fizik teorisidir ve merkezine "bilgi" kavramını koyar.

#### R182
- **Konum**: body metni
- **Site iddiası (TR)**: "Bu da Aristo'nun dilinde telos, zaman üstü bir perspektifte de top-down causality olarak adlandırılır."
- **Atfedilen kaynak**: Aristoteles (telos)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Aristoteles'in telos kavramı ve "top-down causality" tabiri yaygın bilinen gerçek felsefi/bilimsel kavramlardır.

#### R183
- **Konum**: criticalNote
- **Site iddiası (TR)**: "Felsufi burada kaddera fe-hedâ'yı kuantum dalga fonksiyonunun çöküşü ile analojik olarak okur ve David Deutsch'un Constructor Theory çerçevesini... sentezler... Bediüzzaman'ın Mesnevî-i Nûriye'sinden alınan pasaj Nurcu okuma için merkezi."
- **Atfedilen kaynak**: David Deutsch; Bediüzzaman (*Mesnevî-i Nûriye*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote, kuantum-Deutsch sentezinin çağdaş bir okuma olduğunu ve klasik kelâmın bu kavramları kullanmadığını dürüstçe belirtiyor; Mesnevî-i Nûriye'den alıntılanan pasaj kaynağıyla birlikte veriliyor.

## next/public/tefekkur/kaderin-cozunurlugu-devam.json

#### R184
- **Konum**: body metni ("computational irreducibility")
- **Site iddiası (TR)**: "Hesaplamalı indirgenemezlik... Kavram Stephen Wolfram'a aittir; yazar doğrudan Wikipedia maddesine atıf yapar."
- **Atfedilen kaynak**: Stephen Wolfram (Wikipedia üzerinden atıf — sitenin kendi notu)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Hesaplamalı indirgenemezlik gerçekten Stephen Wolfram'a ait bir kavramdır; site metni bunu Wikipedia'ya atıfla açıkça belirtiyor.

#### R185
- **Konum**: body metni
- **Site iddiası (TR)**: "Üstad Bediüzzaman, kaderden bahsederken özellikle 'kalem-i kader' tabirini kullanır."
- **Atfedilen kaynak**: Bediüzzaman Said Nursi
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Kalem-i kader" ifadesinin Risale-i Nur'da kullanıldığı doğrulandı.

#### R186
- **Konum**: kapanış notu
- **Site iddiası (TR)**: "Metinde anılan iki rivayetin kaynakları... (Tirmizî, Tıb 21; Buhârî, Tıb 30 ve Müslim, Selâm 98). Kalem-i kader tabiri Bediüzzaman Saîd Nursî'ye aittir."
- **Atfedilen kaynak**: Tirmizî (Tıb 21), Buhârî (Tıb 30), Müslim (Selâm 98); Bediüzzaman
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Hz. Ömer'in veba/kader rivayeti Buhârî ve Müslim'de yer alan ünlü sahih bir olay; site ayrıca bu atıfların "yazarın verdiği şekliyle" korunduğunu, editoryal doğrulama yapılmadığını açıkça belirtiyor — dürüst bir çerçeveleme.

## next/public/tefekkur/kainat-kuantum-1.json

#### R187
- **Konum**: body metni
- **Site iddiası (TR)**: "...Everett'in Çoklu Evrenler Teorisi gibi yorumlara yol açar. Bu teori, ölçüm sırasında dalga fonksiyonunun çökmediğini... öne sürer."
- **Atfedilen kaynak**: Hugh Everett
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Hugh Everett'in Çoklu Evrenler yorumu ve dalga fonksiyonunun çökmediği tezi gerçek, yaygın bilinen bir fizik teorisidir.

#### R188
- **Konum**: body metni
- **Site iddiası (TR)**: "Kuantum dolanıklık, Einstein tarafından 'uzaktan tuhaf etki' (spooky action at a distance) olarak tanımlanan bir fenomendir..."
- **Atfedilen kaynak**: Albert Einstein
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Einstein'ın kuantum dolanıklığı "spukhafte Fernwirkung" olarak nitelendirmesi iyi belgelenmiş gerçek bir alıntıdır (Max Born'a mektup, 1947).

#### R189
- **Konum**: body metni (düğüm başlıkları)
- **Site iddiası (TR)**: "Einstein'ın itirazı ... Bell teoremi ... Aspect deneyleri (1982): Dolanık fotonlar üzerinde ölçüm yapılır; Bell eşitsizliklerinin ihlal edildiği görülür."
- **Atfedilen kaynak**: Albert Einstein; John Stewart Bell; Alain Aspect (1982 deneyleri)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bell teoremi ve Alain Aspect'in 1982 deneyleri (Bell eşitsizliklerinin ihlali) gerçek, iyi belgelenmiş tarihi fizik olaylarıdır.

#### R190
- **Konum**: body metni (düğüm başlıkları)
- **Site iddiası (TR)**: "Wigner'in arkadaşı, kapalı bir laboratuvarda bir deney yapar — yahut Schrödinger'in kedisini gözlemler..."
- **Atfedilen kaynak**: Eugene Wigner, Erwin Schrödinger
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Wigner'in arkadaşı ve Schrödinger'in kedisi, kuantum mekaniğinde yerleşik, gerçek düşünce deneyleridir.

## next/public/tefekkur/kaynak-yuzey.json

#### R191
- **Konum**: body metni
- **Site iddiası (TR)**: "Napolyon'un dediği gibi: 'Bana dünyanın en masum cümlesini getirin, sizi onunla idam ettireyim.'"
- **Atfedilen kaynak**: Napoléon Bonaparte
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — "Bana dünyanın en masum cümlesini getirin, sizi onunla idam ettireyim" sözü yaygın olarak Napolyon'a değil **Kardinal Richelieu'ya** atfedilir ("Give me six lines written by the most honest man, and I will find something in them to hang him"). Site bu ünlü yanlış-atfı tekrarlıyor. **Düzeltilmeli** — ya doğru kişiye (Richelieu) atfedilmeli ya da "atfedilir" gibi ihtiyatlı bir dil kullanılmalı.

#### R192
- **Konum**: body metni (düğümler)
- **Site iddiası (TR)**: "Cobra Effect — Tersine Çevirme Mekaniği: Meşru Hedef: Hanoi (1902): sıçan istilasını sona erdir... Avcılar kuyrukları keser, sıçanları canlı bırakır."
- **Atfedilen kaynak**: "Cobra Effect" / 1902 Hanoi sıçan ödül programı (tarihi olay)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — 1902 Hanoi sıçan istilası ödül programı ve "Cobra Effect" olarak bilinen tersine dönen teşvik mekanizması iyi belgelenmiş, doğru bir tarihi olaydır.

#### R193
- **Konum**: body metni
- **Site iddiası (TR)**: "Aynı patern: 19. yüzyıl Çin'inde, batılı paleontologlar her dinozor kemiği parçası başına köylülere ödeme yaptı — köylüler sağlam fosilleri olabildiğince çok parçaya kırdılar."
- **Atfedilen kaynak**: İsimsiz "batılı paleontologlar" (19. yy Çin, spesifik tarihi olay)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — 19. yy Çin'inde fosillerin parça başına satılması ve köylülerin sağlam fosilleri kırması gerçek bir olgu ("ejderha kemiği" ticareti); ancak "batılı paleontologlar köylülere ödeme yaptı" anlatısı sıkça tekrarlanan ama net bir birincil akademik kaynağa dayanmayan, biraz basitleştirilmiş/anekdotal bir versiyon.

#### R194
- **Konum**: criticalNote
- **Site iddiası (TR)**: "Klasik müfessirler (Taberî, Razî, Kurtubî, İbn Kesîr) muhkem/müteşabih'i öncelikle âyetlerin türü... bağlamında işler."
- **Atfedilen kaynak**: Taberî, Razî, Kurtubî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — criticalNote, klasik müfessirlerin muhkem-müteşabih ayrımını öncelikle âyet tipolojisi bağlamında ele aldığını, Felsufi'nin bunu organizasyonel sistemlere genellemesinin çağdaş bir okuma olduğunu dürüstçe belirtiyor.

## next/public/tefekkur/kuran-mesajina-yabanci-kalmak.json

#### R195
- **Konum**: body metni
- **Site iddiası (TR)**: "ekinne kelimesi, köken itibariyle bir şeyin içinde muhafaza edildiği, saklandığı, gizlendiği şeydir... (Râgıb el-Isfahânî, el-Müfredât)"
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Müfredât*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Ekinne" gerçek bir Kur'an terimidir (İsrâ 17:46, Fussilet 41:5) ve kökü "örtmek/gizlemek/muhafaza etmek" anlamına gelir; site içeriği bu kökle tutarlı, el-Müfredât'ın birebir metnine erişilemedi ama genel Arapça sözlükbilim bilgisiyle örtüşüyor.

> **İddia bulunamayan makaleler (Batch A)**: anlam-yaratilis-senteni.json, asr-suresi-prensipler.json, iki-nedensellik.json, lehv.json.

> **Tefekkür bölümü toplamı**: 53 makalenin 45'inde en az bir adlandırılmış kaynak iddiası bulundu (R71–R195 = 125 madde); 8 makalede (ruhsal-cografya, terminoloji-3-fizikalizm, yaratilis-hikayesi-1-giris, rahmetin-grameri-7, anlam-yaratilis-senteni, asr-suresi-prensipler, iki-nedensellik, lehv) adlandırılmış dış kaynak iddiası bulunamadı.

---

# ARAÇ SAYFALARI — `SourcesCitation` BLOKLARI VE SATIR-İÇİ ATIFLAR

> `next/src/components/SourcesCitation.jsx` kullanan 32 dosya + ilgili `public/*.json`/`src/data/*.json` veri dosyaları. Her `SourcesCitation` dizi elemanı ayrı bir madde. Not: `next/src/data/ahiret-yolculugu.json` ve `next/public/ahiret-yolculugu.json` içeriği neredeyse birebir aynı olduğundan, bu bölümde tekrar numaralandırılmadı — bkz. **R54–R66** (aynı 6 kaynak + aynı aşama-bazlı atıflar, `AhiretYolculugu.jsx` bileşeni üzerinden `public/` sürümünü render ediyor).

## next/src/sections/ProphetAtlas.jsx

#### R196
- **Konum**: satır 3369-3375 (SourcesCitation)
- **Site iddiası (TR)**: "25 peygamberin klasik kıssa derlemesi — ayet + hadis + selef rivayetleri birlikte."
- **Atfedilen kaynak**: İbn Kesîr, *Kısasü'l-Enbiyâ*, 1301–1373
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in Kısasü'l-Enbiyâ'sı ve tarihleri doğru; eser gerçekten âyet + hadis + selef rivayetlerini birlikte işleyen klasik bir peygamber kıssaları derlemesidir.

#### R197
- **Konum**: satır 3377-3383 (SourcesCitation)
- **Site iddiası (TR)**: "Peygamberleri tarih perspektifinden ele alan temel eser; nüzul kronolojisi için kritik kaynak."
- **Atfedilen kaynak**: et-Taberî, *Târîhu'r-Rusul ve'l-Mülûk*, 839–923
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — et-Taberî'nin Târîhu'r-Rusul ve'l-Mülûk'ü ve tarihleri doğru; eser gerçekten peygamberleri tarihsel perspektiften ele alan temel bir kaynaktır.

#### R198
- **Konum**: satır 3385-3391 (SourcesCitation)
- **Site iddiası (TR)**: "Hz. Muhammed'in siyeri — Kur'ân'daki peygamber anlatısıyla siyer arasındaki bağlantıyı kuran temel eser."
- **Atfedilen kaynak**: İbn Hişâm, *es-Sîretü'n-Nebeviyye*, ?–834
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Hişâm'ın es-Sîretü'n-Nebeviyye'si ve verilen tarih doğru; standart, temel bir siyer eseridir.

#### R199
- **Konum**: satır 3393-3399 (SourcesCitation)
- **Site iddiası (TR)**: "Peygamber kıssalarının sûrelere neden dağıtıldığı ve bu tekniğin belağat işlevi üzerine klasik değerlendirme."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kurʾân*, 1445–1505
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — es-Süyûtî'nin el-İtkān'ı ve tarihleri doğru; eser Kur'an ilimlerinin kapsamlı klasik bir derlemesidir ve anlatı tekniği/belağat konularını da içerir.

#### R200
- **Konum**: satır 586 (Hz. İdris/İlyas tooltip)
- **Site iddiası (TR)**: "Kur'an bu ifadeyi doğrudan kullanmaz; Bakara 2:34'ten İbn Kesîr, Taberî gibi klasik müfessirlerin çıkardığı bağlamsal sonuçtur."
- **Atfedilen kaynak**: İbn Kesîr, Taberî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Alıntılanan metin birebir doğru aktarılmış ve Bakara 2:34'ten çıkarılan bir yorum olduğu dürüstçe belirtiliyor; ancak katalogdaki "Konum" etiketi ("Hz. İdris/İlyas tooltip") yanlış — içerik aslında Hz. Âdem'e (meleklerin secdesi) ait bir tooltip. Katalog dokümantasyon hatası, içeriğin kendisi kaynakla tutarlı.

#### R201
- **Konum**: satır 1157 (Hz. Zülkifl tooltip)
- **Site iddiası (TR)**: "Peygamber olup olmadığı müfessirler arasında tartışmalıdır: İbn Kesîr ve Taberî peygamber olduğunu savunurken, bir kısım âlim salih bir kul olduğunu söyler."
- **Atfedilen kaynak**: İbn Kesîr, Taberî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Site metni katalogla birebir örtüşüyor. Araştırma da doğruluyor: İbn Kesîr Zülkifl'in peygamber olduğu görüşünü destekler, Taberî ise daha çok "salih önder" olarak temkinli ele alır — site bu ayrımı doğru yansıtıyor.

#### R202
- **Konum**: satır 1158 (Hz. Zülkifl tooltip)
- **Site iddiası (TR)**: "'Zülkifl' isminin kime atıfta bulunduğu klasik tefsirde tartışmalıdır; Hz. Hizkil, Hz. Elyesâ veya başka bir peygamber önerilmiştir."
- **Atfedilen kaynak**: İsimsiz "klasik tefsir" (sınırda madde)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zülkifl'in kimliği konusunda klasik tefsirde gerçekten ihtilaf var; çoğunluk görüşü Hizkil ile özdeşleştirirken Elyesâ'nın halefi olduğu rivayeti de mevcut — "kesin bilinmiyor" çerçevesi akademik olarak isabetli.

#### R203
- **Konum**: satır 2385
- **Site iddiası (TR)**: "Bu görsel, Kur'an âyetlerinin değil sûrelerin geleneksel nüzul sıralamasını esas alır (İbn Abbas rivayeti temel alınmıştır)."
- **Atfedilen kaynak**: İbn Abbas (rivayet)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Sûrelerin geleneksel nüzul sıralamasının İbn Abbas rivayetine dayandığı ve 1924 Mısır baskısıyla yaygınlaştığı doğrulanabiliyor; "kesin bilinmiyor" uyarısı akademik ihtiyata uygun.

## next/src/components/KuranRenkleri.jsx

#### R204
- **Konum**: satır 3053-3059 (SourcesCitation)
- **Site iddiası (TR)**: "Cennet renkleri (yeşil, altın), cehennem renkleri (siyah, sarı) ve Kur'ân'da renk sembolizmi üzerine kapsamlı analiz."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*, 1149–1209
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Râzî'nin tarihleri doğru ve Mefâtîhu'l-Ğayb gerçek bir eser; ama "cennet/cehennem renkleri üzerine kapsamlı analiz" iddiasının Arapça orijinalde birebir bu şekilde geçtiği dijital olarak doğrulanamadı.

#### R205
- **Konum**: satır 3061-3067 (SourcesCitation)
- **Site iddiası (TR)**: "Bakara 2:69 (buzağı sarısı) gibi renk-özgü ayetlerin belâgat + dilsel çözümlemesi."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*, 1075–1144
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Zemahşerî'nin tarihleri genel kabul gören aralığa yakın, el-Keşşâf gerçek eser ve belâgat odaklı — bu genel niteleme makul, ama Bakara 2:69 üzerine spesifik dilsel çözümlemenin içeriği doğrudan doğrulanamadı.

#### R206
- **Konum**: satır 3069-3075 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân'daki her renk isminin (ahdar, esved, ebyad, ahmer, asfar, azrak) kök + türev + tam anlam yelpazesi."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî, *Müfredâtü Elfâzi'l-Kurʾân*, ?–1108
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Ölüm tarihi (502 AH/1108) yaygın kabul gören tarih (site zaten "?" işaretiyle belirsizliği kabul ediyor). Müfredât gerçek bir Kur'an terimleri sözlüğü, renk köklerini içermesi makul, ama içerik iddiası birebir teyit edilemedi.

#### R207
- **Konum**: satır 3077-3083 (SourcesCitation)
- **Site iddiası (TR)**: "İslamî geleneğin renk teorisini (mavi kubbe, altın hat, yeşil işaret) sembolik-manevi çerçevede ele alan çağdaş klasik."
- **Atfedilen kaynak**: Seyyid Hüseyin Nasr, *Islamic Art and Spirituality*, 1987 (SUNY Press)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Kitap (SUNY Press, 1987, 213 s.) gerçek ve doğru bibliyografik bilgilerle eşleşiyor, İslam sanatında renk/sembolizm temasını genel olarak işler. Ancak "mavi kubbe, altın hat, yeşil işaret" gibi spesifik detayların kitapta birebir bu çerçevede geçtiği doğrulanamadı.

#### R208
- **Konum**: satır 2456 (`TabKaynaklar`, ayrı bir "Kaynaklar" listesi)
- **Site iddiası (TR)**: Referans listesi maddesi, not alanı yok.
- **Atfedilen kaynak**: İbn Kesir, *Tefsîru'l-Kur'âni'l-Azîm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in Tefsîru'l-Kur'âni'l-Azîm'i gerçek ve doğru şekilde adlandırılmış bir klasik eser; not alanı olmadığı için içerik iddiası yok.

#### R209
- **Konum**: satır 2457 (`TabKaynaklar`)
- **Atfedilen kaynak**: Taberî, *Câmiu'l-Beyân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Taberî'nin Câmiu'l-Beyân'ı gerçek ve doğru adlandırılmış eser.

#### R210
- **Konum**: satır 2458 (`TabKaynaklar`)
- **Site iddiası (TR)**: "dilbilim ve renk kelimeleri analizi"
- **Atfedilen kaynak**: Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Keşşâf'ın "dilbilim ve renk kelimeleri analizi" olarak nitelenmesi, eserin bilinen dilbilimsel-belâgî karakteriyle tutarlı.

#### R211
- **Konum**: satır 2459 (`TabKaynaklar`)
- **Site iddiası (TR)**: "Fâtır 35:27 analizi"
- **Atfedilen kaynak**: Râzî, *Mefâtîhu'l-Gayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Fâtır 35:27 gerçekten dağların "beyaz, kırmızı, simsiyah" renk çeşitliliğinden bahseder — Râzî'nin bu ayeti "renk" bağlamında ele alması tutarlı bir eşleşme.

#### R212
- **Konum**: satır 2466 (`TabKaynaklar`)
- **Site iddiası (TR)**: "'Renk' maddesi"
- **Atfedilen kaynak**: TDV İslam Ansiklopedisi
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — TDV İslam Ansiklopedisi'nde gerçekten bir "RENK" maddesi mevcut (islamansiklopedisi.org.tr/renk) — Arapça levn/elvân kelime yapısını ele alıyor.

#### R213
- **Konum**: satır 2467-2468 (`TabKaynaklar`)
- **Site iddiası (TR)**: "kelime frekansları" / "Renk köklerinin etimolojik analizi"
- **Atfedilen kaynak**: Corpus Quran (corpus.quran.com); Lane's Arabic-English Lexicon
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Corpus Quran ve Lane's Lexicon, kelime frekansı ve etimolojik analiz için gerçek ve standart kabul gören kaynaklardır.

#### R214
- **Konum**: satır 3140
- **Site iddiası (TR)**: "Klasik tefsir bu çoğulluğu sembolik okur (İbn Kayyim, Hâdi'l-Ervâh): yeşil baş işaret — gözün önce karşılaştığı vaad rengi…"
- **Atfedilen kaynak**: İbn Kayyim (*Hâdi'l-Ervâh*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — İbn Kayyım'ın Hâdi'l-Ervâh'ı cenneti ayrıntılı biçimde betimler (altın/gümüş/inci vb.), ama "yeşilin vaadin baş işareti olduğu" spesifik sembolik çerçeve editoryal bir sentez izlenimi veriyor — orijinal metinde birebir geçtiği doğrulanamadı.

## next/src/components/BilimselIsaretler.jsx

#### R215
- **Konum**: `intro.bucaillismNoteTr` (satır ~590)
- **Site iddiası (TR)**: "'Bucaillism' (Maurice Bucaille'ın 1976 çalışmasından adlandırılır)… Islamic Studies akademisi (Nicolai Sinai, Angelika Neuwirth, Karen Bauer) bu metodolojiyi 3 nedenle eleştirir…"
- **Atfedilen kaynak**: Maurice Bucaille (1976); Nicolai Sinai, Angelika Neuwirth, Karen Bauer
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Bucaillism eleştirisinin genel çerçevesi akademik literatürle uyumlu ve Sinai/Neuwirth'in genel duruşuyla tutarlı; ancak Karen Bauer'in uzmanlık alanı *Gender Hierarchy in the Qur'an* (2015) cinsiyet/fıkhî tefsir tarihidir — Bucaillism metodolojisini eleştiren bir çalışmasına rastlanmadı, konu uyuşmazlığı var.

#### R216
- **Konum**: "Akademik Referanslar" kutusu (satır 622-639)
- **Site iddiası (TR)**: "Nidhal Guessoum, Islam's Quantum Question (2011)... Karen Bauer, Gender Hierarchy in the Qur'an (2015)... Nicolai Sinai, The Qur'an: A Historical-Critical Introduction (2017)..."
- **Atfedilen kaynak**: Nidhal Guessoum (2011), Karen Bauer (2015), Nicolai Sinai (2017)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Guessoum'un *Islam's Quantum Question* (2011) gerçekten Bucaille/El-Naggar/Harun Yahya'yı eleştirel ele alır — sağlam. Sinai (2017) bibliyografik olarak doğru. Ancak Bauer'in *Gender Hierarchy in the Qur'an* (2015) "metod eleştirisi" olarak sunulsa da kitabın konusu cinsiyet/hukukî tefsir — bilimsel icaz metodolojisiyle doğrudan ilgili değil, zayıf halka.

#### R217
- **Konum**: "Sorumlu Okuma İlkeleri" listesi (satır 609)
- **Site iddiası (TR)**: "Klasik tefsir (Râzî, İbn Kesîr, Kurtubî) modern okumalardan önce okunmalı."
- **Atfedilen kaynak**: Râzî, İbn Kesîr, Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Klasik tefsir önce okunmalı" ifadesi editoryal bir okuma ilkesi; bu üç ismin klasik tefsir kanununun köşe taşları olması bakımından tutarlı ve sitenin §13.24 ilkesiyle uyumlu.

#### R218
- **Konum**: satır 301 (SourcesCitation)
- **Site iddiası (TR)**: "Kevnî ayetlerin klasik tefsirinde en zengin damar — felsefî-kelâmî çerçeve."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin Mefâtîhu'l-Ğayb'ının kevnî ayetlerde felsefî-kelâmî çerçeve ile öne çıkması İslam araştırmalarında yaygın kabul gören standart bir karakterizasyondur.

#### R219
- **Konum**: satır 302 (SourcesCitation)
- **Site iddiası (TR)**: "Belağî okuma — kevnî ayetlerin dilsel imalarının klasik referansı."
- **Atfedilen kaynak**: ez-Zamahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Keşşâf'ın "belâgî okuma" olarak nitelenmesi eserin bilinen dilbilimsel-retorik ağırlıklı karakteriyle tutarlı.

#### R220
- **Konum**: satır 303 (SourcesCitation)
- **Site iddiası (TR)**: "Rivayet ağırlıklı tefsir — kevnî ayetlerin selef yorumu."
- **Atfedilen kaynak**: İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in tefsirinin "rivayet ağırlıklı tefsir" (tefsir bi'l-me'sûr) olarak nitelenmesi akademik literatürdeki standart sınıflandırmasıyla birebir örtüşüyor.

#### R221
- **Konum**: satır 304 (SourcesCitation)
- **Site iddiası (TR)**: "Fıkhî + dilsel + kevnî — çok boyutlu klasik referans."
- **Atfedilen kaynak**: el-Kurtubî, *el-Câmiʿu li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Câmiʿu li-Ahkâmi'l-Kur'ân'ın "fıkhî + dilsel + kevnî çok boyutlu" olarak nitelenmesi eserin bilinen ansiklopedik/fıkhî-tefsir karakteriyle tutarlı.

> **16 ayet-kartı** (`genisleyen-evren`, `yorunge-hareketi`, `yildiz-yol`, `dag-kaziklari`, `iki-deniz`, `yagmur-dongusu`, `ruzgar-dolleme`, `dumansi-gok`, `demir-inisi`, `arı-navigasyonu`, `karınca-iletisimi`, `sut-olusumu`, `embriyoloji`, `parmak-izi`, `gece-koza`, `zerre-agirligi`) — her biri klasik müfessir + modern bilim insanı/keşif tarihi eşleştirmesi taşıyor:

#### R222
- **Konum**: `genisleyen-evren` (Zâriyât 51:47)
- **Site iddiası (TR)**: "1929 — Edwin Hubble'ın galaksi kaymalarının uzaklıkla orantılı olduğunu keşfi"
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı; Bucaille (1976); Guessoum (2011); Edwin Hubble (1929)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Hubble'ın 1929'da galaksi kırmızıya kaymalarının uzaklıkla orantılı olduğunu göstermesi tarihsel olarak doğru; Guessoum (2011) atfı da bağımsız doğrulandı (kitap gerçekten Bucaille/concordism eleştirisi içeriyor).

#### R223
- **Konum**: `yorunge-hareketi` (Enbiyâ 21:33)
- **Site iddiası (TR)**: "1543 — Kopernik… 1687 — Newton'un yerçekimi yasaları"
- **Atfedilen kaynak**: Râzî, Elmalılı; Bucaille (1976); Guessoum (2011); Kopernik; Newton
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kopernik'in 1543 heliyosentrik modeli (De revolutionibus) ve Newton'un 1687 yerçekimi yasaları (Principia) tarihsel olarak doğru.

#### R224
- **Konum**: `yildiz-yol` (Nahl 16:16 · En'âm 6:97)
- **Atfedilen kaynak**: İbn Kesîr, İbn Âşûr (klasik navigasyon literatürü)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Genel iddia (İbn Kesîr/İbn Âşûr'un yıldızlarla yön bulma ayetlerini ele alması) makul ama spesifik içerik dijital olarak teyit edilemedi.

#### R225
- **Konum**: `dag-kaziklari` (Nebe' 78:6-7 · Enbiyâ 21:31)
- **Site iddiası (TR)**: "1855 — George Airy'nin isostasy teorisi · 1889 — Dutton isostasy terimi"
- **Atfedilen kaynak**: İbn Kesîr; Zaghloul El-Naggar (2001); Bucaille (1976); George Airy; Dutton
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — George Airy'nin 1855'te dağların "kök" teorisini öne sürmesi ve C.E. Dutton'ın 1889'da "isostasy" terimini türetmesi tarihsel olarak doğrulandı.

#### R226
- **Konum**: `iki-deniz` (Rahmân 55:19-20 · Furkân 25:53)
- **Site iddiası (TR)**: "20. yy — halocline/pycnocline… Jacques Cousteau (1962+)"
- **Atfedilen kaynak**: Râzî, İbn Kesîr; Bucaille (1976); Farouk El-Baz; Jacques Cousteau
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Sitenin Cousteau "Kur'an'ı keşfedip Müslüman oldu" efsanesini criticalNote ile açıkça yalanlaması örnek teşkil edecek kadar isabetli. Ancak "Farouk El-Baz, Kur'an ve Coğrafya" atfı şüpheli — El-Baz esasen NASA'da Ay jeolojisi/uzaktan algılama uzmanıdır, Kur'an-bilim eserleriyle bilinen isim daha çok Zaghloul El-Naggar'dır; böyle bir kitabın varlığı doğrulanamadı, muhtemel bir karıştırma.

#### R227
- **Konum**: `yagmur-dongusu` (Zümer 39:21 · Vâkıa 56:68-70 · Mü'minûn 23:18)
- **Site iddiası (TR)**: "1580 — Bernard Palissy ilk modern su döngüsü teorisi · 17. yy · Perrault, Halley"
- **Atfedilen kaynak**: İbn Kesîr, Râzî, Elmalılı; Bucaille (1976); Bernard Palissy; Perrault; Halley
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bernard Palissy'nin 1580'de ilk modern su döngüsü teorisini öne sürmesi ve 17. yy'da Perrault/Halley'nin katkıları tarihsel olarak doğru ve yaygın kabul görür.

#### R228
- **Konum**: `ruzgar-dolleme` (Hicr 15:22)
- **Site iddiası (TR)**: "18. yy — Camerarius bitki üremesi · 19. yy — anemophilous polinasyon çalışmaları"
- **Atfedilen kaynak**: Kurtubî, Râzî; Bucaille (1976); Yusuf Ali (1934); Camerarius
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — Site "18. yy — Camerarius bitki üremesi" diyor, ama Rudolf Jakob Camerarius'un bitki cinsiyetini deneysel olarak kanıtladığı *Epistola de Sexu Plantarum* çalışması **1694 tarihli — yani 17. yüzyıl**, 18. yüzyıl değil. `criticalNoteTr` alanında da aynı hata ("18. yy sonrası eklenen bir katman") tekrarlanıyor. **Düzeltilmeli.**

#### R229
- **Konum**: `dumansi-gok` (Fussilet 41:11)
- **Site iddiası (TR)**: "1926 — Eddington 'stellar structure' · 1965 — Penzias-Wilson kozmik mikrodalga fon radyasyonu"
- **Atfedilen kaynak**: Râzî, İbn Kesîr; Bucaille (1976); Guessoum (2011); Eddington; Penzias; Wilson
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Eddington'ın 1926'da yıldız iç yapısı üzerine çalışması ve Penzias-Wilson'ın 1965'te kozmik mikrodalga fon radyasyonunu keşfetmesi tarihsel olarak doğru.

#### R230
- **Konum**: `demir-inisi` (Hadîd 57:25)
- **Site iddiası (TR)**: "1957 — Burbidge-Fowler-Hoyle 'B²FH' makalesi"
- **Atfedilen kaynak**: Râzî; Bucaille (1976); Zaghloul El-Naggar; Burbidge, Burbidge, Fowler, Hoyle (*Rev. Mod. Phys.* 29, 1957)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Synthesis of the Elements in Stars" makalesi gerçekten Reviews of Modern Physics, Cilt 29 (1957)'da yayımlandı — bibliyografik detaylar doğru.

#### R231
- **Konum**: `arı-navigasyonu` (Nahl 16:68-69)
- **Site iddiası (TR)**: "1927 — Karl von Frisch arı dansı iletişim keşfi (1973 Nobel)"
- **Atfedilen kaynak**: İbn Kesîr, Râzî; Karl von Frisch (1967); Thomas Seeley (2010)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Karl von Frisch'in arı dansını 1927'de tarif etmesi ve 1973 Nobel Tıp/Fizyoloji Ödülü'nü kazanması tarihsel olarak doğrulandı.

#### R232
- **Konum**: `karınca-iletisimi` (Neml 27:18-19)
- **Site iddiası (TR)**: "1959 — E.O. Wilson karınca feromon iletişimi keşfi · 1971 — 'superorganism' teorisi"
- **Atfedilen kaynak**: İbn Kesîr, Râzî; E.O. Wilson (1971); Wilson &amp; Hölldobler (1990)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — E.O. Wilson'ın 1959'da ateş karıncalarında feromon izi keşfi doğrulandı. Ancak "superorganism" terimi aslında 1911'de William Morton Wheeler tarafından türetilmiştir; Wilson'ın 1971 kitabı kavramı popülerleştirse de "1971 — superorganism teorisi Wilson'a ait" ifadesi terimin kökenini basitleştiriyor.

#### R233
- **Konum**: `sut-olusumu` (Nahl 16:66)
- **Atfedilen kaynak**: İbn Kesîr; Bucaille (1976)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kaynak listesi sade ve doğrulanabilir niteliktedir, aşırı iddia içermiyor.

#### R234
- **Konum**: `embriyoloji` (Mü'minûn 23:12-14 · Alak 96:2)
- **Site iddiası (TR)**: "17. yy — William Harvey… 1970'ler — Keith Moore Kur'ân embriyoloji çalışmaları"; criticalNote: "Moore'a atfen 'Kur'ân embriyolojiyi keşfetti' iddiası fazla ileri gider"
- **Atfedilen kaynak**: İbn Kesîr; Keith Moore (*The Developing Human*, 1988); Bucaille (1976); Basim Musallam (eleştiri); William Harvey
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Kitap gerçek (Keith Moore & Abdul-Majeed Azzindani, İslami ek içeren baskı) ve site kendi criticalNote'unda "Kur'an embriyolojiyi keşfetti" iddiasının aşırıya kaçtığını doğru belirtiyor — örnek teşkil eder. Ancak "1988 3. baskı" şüpheli: İslami ek içeren 3. baskı 1982 (Saunders)/1983 (Suudi baskısı) tarihli görünüyor; 1988 muhtemelen İslami eki içermeyen 4. baskıya denk düşüyor — baskı numarası/yıl uyuşmuyor olabilir.

#### R235
- **Konum**: `parmak-izi` (Kıyâme 75:3-4)
- **Site iddiası (TR)**: "1892 — Francis Galton, Finger Prints"
- **Atfedilen kaynak**: İbn Kesîr, Kurtubî; Francis Galton (1892)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Francis Galton'ın *Finger Prints* adlı eseri gerçekten 1892'de Macmillan tarafından yayımlandı — bibliyografik detaylar doğru.

#### R236
- **Konum**: `gece-koza` (Zümer 39:5)
- **Atfedilen kaynak**: Râzî, İbn Kesîr, Elmalılı; Bucaille (1976); Kopernik
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kopernik'in 16. yy heliyosentrik modeli ve dünyanın küresel olduğu bilgisinin antik Yunan'a dayanması tarihsel olarak doğru; Zümer 39:5 bağlamıyla tutarlı.

#### R237
- **Konum**: `zerre-agirligi` (Zilzâl 99:7-8 · Sebe 34:3)
- **Site iddiası (TR)**: "1897 — J.J. Thomson elektron keşfi · 1911 — Rutherford atom modeli · 1932 — nötron"
- **Atfedilen kaynak**: İbn Kesîr, Elmalılı; Bucaille (1976); J.J. Thomson; Rutherford
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — J.J. Thomson'ın 1897'de elektronu keşfetmesi, Rutherford'un 1911 atom modeli ve nötronun 1932'de keşfedilmesi (Chadwick) tarihsel olarak doğru.

## next/src/components/SunnetullahAtlasi.jsx

#### R238
- **Konum**: satır 250-256 (SourcesCitation)
- **Site iddiası (TR)**: "Sünnetullah bahsi (Fetih 48:23, Ahzâb 33:62) — Allah'ın değişmeyen yasasının tefsir perspektifinden kapsamlı analizi."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Satır 250-256 katalogla birebir örtüşüyor; Zemahşerî ve tarihleri doğru, el-Keşşâf'ın Fetih 48:23/Ahzâb 33:62 bağlamında sünnetullah konusunu ele alması makul.

#### R239
- **Konum**: satır 258-264 (SourcesCitation)
- **Site iddiası (TR)**: "Sünnetullah'ın kelâmî çerçevesi; ilâhî fiil, tarih ve kozmik nizamda örüntü kavramının epistemolojik temelleri."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Satır 258-264 katalogla birebir örtüşüyor; Râzî tarihleri doğru ve genel kelâmî çerçeve tanımı makul.

#### R240
- **Konum**: satır 266-272 (SourcesCitation)
- **Site iddiası (TR)**: "Modern Kurʾânî sosyoloji — sünnetullah kavramını tarihsel değişim yasaları çerçevesinde teorize eden çağdaş klasik."
- **Atfedilen kaynak**: Muhammed Bâkır es-Sadr, *Kurʾânî Sünnetler*, 1935–1980
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — "Kurʾânî Sünnetler" → gerçek başlık "es-Sünenü't-Târîhiyye fi'l-Kur'ân" (R368 ile aynı hata, orada da düzeltildi).

#### R241
- **Konum**: satır 274-280 (SourcesCitation)
- **Site iddiası (TR)**: "Sünnetullah'ı tarih felsefesi + dinamik ilâhî yasa çerçevesinde okuyan modern islam düşüncesinin dönüm noktası."
- **Atfedilen kaynak**: Muhammed İkbal, *The Reconstruction of Religious Thought in Islam*, 1930
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İkbal'in eseri gerçekten 1930'da yayımlandı; tarih felsefesi ve dinamik içtihat/yasa anlayışını işlediği için modern İslam düşüncesinde dönüm noktası nitelemesi makul.

## next/src/components/DiyalogAgi.jsx

#### R242
- **Konum**: satır 347 (SourcesCitation)
- **Site iddiası (TR)**: "Kıssa ve diyalog rivayetlerinin temel toplayıcı kaynağı."
- **Atfedilen kaynak**: et-Taberî, *Câmiu'l-Beyân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Taberî'nin Câmiu'l-Beyân'ı rivayet tefsirinin temel toplayıcı eseridir; "kıssa ve diyalog rivayetlerinin toplayıcısı" niteliği eserin genel karakteriyle örtüşüyor.

#### R243
- **Konum**: satır 348 (SourcesCitation)
- **Site iddiası (TR)**: "Diyalogların bağlamını ve konuşmacıları ayrıntılı ele alan klasik tefsir."
- **Atfedilen kaynak**: el-Kurtubî, *el-Câmi' li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Kurtubî'nin eseri gerçek ve doğru atfedilmiş, ancak öncelikle fıkhî/ahkâm ağırlıklıdır; "diyalogların bağlamını ayrıntılı ele alması" özel vurgusu doğrudan doğrulanamadı.

#### R244
- **Konum**: satır 349 (SourcesCitation)
- **Site iddiası (TR)**: "Konuşma ve diyalog çözümlemesini derinleştiren büyük dirâyet tefsiri."
- **Atfedilen kaynak**: Fahreddin er-Râzî, *Mefâtîhu'l-Gayb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mefâtîhu'l-Gayb gerçek bir büyük dirâyet tefsiridir ve derinlemesine analiz karakteriyle bilinir; ancak "konuşma ve diyalog çözümlemesi" özel vurgusu doğrudan doğrulanamadı.

## next/src/components/NefisMertebeleri.jsx

#### R245
- **Konum**: satır 587 (SourcesCitation)
- **Site iddiası (TR)**: "Nefs terbiyesi (Riyâzetü'n-Nefs) — emmâreden mutmainneye yöntem."
- **Atfedilen kaynak**: İmam Gazâlî, *İhyâ'u Ulûmi'd-Dîn*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İhyâ'da gerçekten "Riyâzetü'n-Nefs ve Tehzîbü'l-Ahlâk" başlıklı bir bölüm bulunur ve nefis terbiyesini ele alır; nefs-i emmâre/levvâme/mutmainne kavramları eserde işlenir.

#### R246
- **Konum**: satır 588 (SourcesCitation)
- **Site iddiası (TR)**: "Üç mertebe sistemi (Kur'ânî) — sufi 7'liye karşı eleştirel okuma."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *Medâricu's-Sâlikîn*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Medâricu's-Sâlikîn gerçek bir eser ve İbn Kayyım genel olarak Kur'ânî 3'lü nefis tasnifini esas alır, ama eserin ana yapısının "iyyâke na'büdü" âyeti etrafındaki menziller olduğu görülüyor — "sufi 7'liye eleştirel okuma" olarak konumlandığı özel olarak teyit edilemedi.

#### R247
- **Konum**: satır 589 (SourcesCitation)
- **Site iddiası (TR)**: "Tasavvufî 7 mertebe — Kübreviyye geleneğinin temel metni."
- **Atfedilen kaynak**: Necmüddîn-i Kübrâ, *Fevâihu'l-Cemâl*
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Fevâihu'l-Cemâl gerçek bir eser ve Kübreviyye'nin kurucu metinlerinden biri, 7'li şema içeriyor. Ama klasik "7 nefis mertebesi" tasnifinin kaynağı olarak literatürde daha çok Cüneyd-i Bağdâdî anılıyor — bu eserin 7 nefis mertebesiyle birebir eşleştiği doğrulanamadı.

#### R248
- **Konum**: satır 590 (SourcesCitation)
- **Site iddiası (TR)**: "Fecr 89:27–28 tefsiri — 'mutmainne' mertebesinin kelâmî okunuşu."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Fecr 89:27-28 ("nefs-i mutmainne") âyeti klasik tefsirlerin standart konusu olup Râzî'nin buna kelâmî bir okuma getirmesi tefsirin genel karakteriyle tutarlı.

## next/src/components/AddresseeSystem.jsx

#### R249
- **Konum**: satır 394 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimlerinde hitâb (muhâtab) türlerini sistematik işleyen klasik eser."
- **Atfedilen kaynak**: Bedreddin ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Zerkeşî'nin eseri gerçek ve kapsamlı bir Kur'an ilimleri klasiği, hitâb türlerini de içeren geniş bir konu yelpazesi var, ama "hitâb türlerini sistematik işleyen" özel vurgusu doğrudan teyit edilemedi.

#### R250
- **Konum**: satır 395 (SourcesCitation)
- **Site iddiası (TR)**: "Âmm-hâss ve muhâtab çeşitlerine dair kapsamlı Kur'ân ilimleri ansiklopedisi."
- **Atfedilen kaynak**: Celâleddin es-Süyûtî, *el-İtkân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkân 80 konu (nev') başlığı altında Kur'an ilimlerini kapsayan gerçek bir ansiklopedik eserdir; âmm-hâss ve hitap türleri gibi konuları içermesi genel yapısıyla tutarlı.

#### R251
- **Konum**: satır 396 (SourcesCitation)
- **Site iddiası (TR)**: "Hitap çözümlemesini tefsir içinde derinleştiren büyük dirâyet tefsiri."
- **Atfedilen kaynak**: Fahreddin er-Râzî, *Mefâtîhu'l-Gayb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mefâtîhu'l-Gayb gerçek bir büyük dirâyet tefsiridir; "hitap çözümlemesi" özel vurgusu doğrudan doğrulanamasa da genel tefsir karakteriyle çelişmiyor.

## next/src/components/DuaDili.jsx

#### R252
- **Konum**: `data.sources[0]` (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ve hadisten dua tasnifi; klasik dua ansiklopedisi."
- **Atfedilen kaynak**: es-Suyûtî, *el-Câmiʿu's-Saġîr*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — el-Câmiʿu's-Saġîr gerçekte 10.000'i aşkın hadisi alfabetik sırayla derleyen GENEL bir hadis koleksiyonudur (itikad, âdâb, tıp, terğib-terhib, ilim, dua-zikir, tevbe gibi çok sayıda konuyu kapsar). Dua/zikir bunlardan yalnızca biri; eserin "klasik dua ansiklopedisi" olarak tanıtılması gerçek kimliğini abartılı biçimde daraltıyor. Bu aynı sorun R258/R259'da da tekrarlanıyor.

#### R253
- **Konum**: `data.sources[1]` (SourcesCitation)
- **Site iddiası (TR)**: "Dua ve zikrin psikolojisi — talebin nasıl arz edileceği üzerine."
- **Atfedilen kaynak**: İbnü'l-Kayyim, *el-Vâbilü's-Sayyib*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Vâbilü's-Sayyib min el-Kelimi't-Tayyib tam olarak dua ve zikrin faydaları/psikolojisi üzerine yazılmış müstakil bir eserdir — atıf birebir isabetli.

#### R254
- **Konum**: `data.sources[2]` (SourcesCitation)
- **Site iddiası (TR)**: "Sünnet-i seniyyeden dua ve zikir külliyatı; kalıp dua kitabı klasiği."
- **Atfedilen kaynak**: en-Nevevî, *el-Ezkâr*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nevevî'nin el-Ezkâr'ı sünnetten dua ve zikir külliyatı olarak bilinen klasik kalıp dua kitabıdır — atıf tam isabetli.

#### R255
- **Konum**: `data.sources[3]` (SourcesCitation)
- **Site iddiası (TR)**: "Dua adabı, zamanları ve iç niyet katmanları — kalbin duayla eğitimi."
- **Atfedilen kaynak**: el-Gazâlî, *İhyâʾu ʿUlûmi'd-Dîn (Kitâbü'd-Deʿavât)*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İhyâ'da "Kitâbü'l-Ezkâr ve'd-Deavât" başlıklı bir bölüm gerçekten mevcuttur ve dua âdâbını, zamanlarını işler.

#### R256
- **Konum**: `data.sources[4]` (SourcesCitation)
- **Site iddiası (TR)**: "Peygamber dualarında sıfat-isim eşleşmesinin akılcı çözümlemesi."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin tefsiri akılcı/kelâmî karakteriyle bilinir; peygamber dualarındaki sıfat-isim eşleşmesi özel vurgusu genel karakterle tutarlı ama spesifik olarak teyit edilemedi.

#### R257
- **Konum**: `data.sources[5]` (SourcesCitation)
- **Site iddiası (TR)**: "Dua ayetlerinin fıkhî ve tefsîrî izahı — 'Rabbenâ' kalıbının hukuku."
- **Atfedilen kaynak**: el-Kurtubî, *el-Câmiʿ li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kurtubî'nin eseri dua âyetlerinin fıkhî-tefsîrî izahını içeren tanınmış bir eserdir; bu genel karakterizasyon tutarlı.

#### R258
- **Konum**: satır ~649 ("Dua Literatürü" özet paragrafı)
- **Site iddiası (TR)**: "Suyûtî ve Nevevî derleme, İbn Kayyim ve Gazâlî ise dua psikolojisi geleneğini kurar."
- **Atfedilen kaynak**: Suyûtî, Nevevî, İbn Kayyim, Gazâlî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Nevevî ve İbn Kayyım/Gazâlî'nin rolleri doğru tasvir edilmiş, ancak Süyûtî'nin "derleme" rolü R252'deki aynı sorunu taşıyor — el-Câmiʿu's-Saġîr dua'ya özgü bir derleme değil, genel hadis mecmuasıdır.

#### R259
- **Konum**: `duaAnatomy.introTr`
- **Site iddiası (TR)**: "Bu kalıp, İbn Kayyim (el-Vâbilü's-Sayyib) ve Suyûtî (el-Câmiʿu's-Saġîr) tarafından şablonlaştırılmıştır."
- **Atfedilen kaynak**: İbn Kayyim, Suyûtî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İbn Kayyım'ın el-Vâbilü's-Sayyib'i dua kalıbı şablonlaştırmasına gerçekten uygun bir kaynak; ancak Süyûtî'nin el-Câmiʿu's-Saġîr'inin aynı işlevi gördüğü iddiası eserin genel hadis mecmuası kimliğiyle tam örtüşmüyor (bkz. R252).

#### R260
- **Konum**: `additionalProphets[0].insightTr` (Hz. Âdem kartı, satır ~349)
- **Site iddiası (TR)**: "Klasik tefsir (Râzî, Kurtubî, İbn Kesîr): 'ẓalemnâ enfüsenâ' kalıbı Kur'ân dua dilinin şablonlarından biridir; sonraki peygamberler ve müminler aynı formu kullanır."
- **Atfedilen kaynak**: Râzî, Kurtubî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — A'râf 7:23'teki "rabbenâ zalemnâ enfüsenâ" duasının sonraki peygamberlerce (Yûnus 21:87, Mü'minûn 23:109, Kasas 28:16) tekrarlanan bir Kur'ânî dua kalıbı olduğu doğru; klasik müfessirlerin bu âyeti yorumlaması standart tefsir pratiğiyle tutarlı.

## next/src/components/KorumaZinciri.jsx

#### R261
- **Konum**: satır 137-143 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'an ilimlerinin ansiklopedik klasiği — cem', hıfz, isnâd, yedi harf ve mütevâtir kıraatlar üzerine 80 bölüm."
- **Atfedilen kaynak**: es-Suyûtî, *el-İtkān fî Ulûmi'l-Kur'an*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkân'ın 80 "nev'" hâlinde düzenlendiği doğrulandı; cem', hıfz, isnad, yedi harf ve mütevâtir kıraatler bu 80 türün kapsamına giren konulardır.

#### R262
- **Konum**: satır 145-151 (SourcesCitation)
- **Site iddiası (TR)**: "Suyûtî'nin İtkān'ına kaynaklık eden erken ansiklopedik eser — kıraat, hıfz ve resm-i mushaf disiplinleri."
- **Atfedilen kaynak**: ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'an*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin el-Burhân'ının Süyûtî'nin İtkân'ına kaynaklık eden erken bir ansiklopedik eser olduğu tarihsel olarak iyi belgelenmiş bir ilişki.

#### R263
- **Konum**: satır 153-158 (SourcesCitation)
- **Site iddiası (TR)**: "10 mütevâtir kıraatin cihanşümul isnâd zinciri — her kıraatın senedini Peygamber'e (s.a.v) kadar geriye takip eder."
- **Atfedilen kaynak**: İbnü'l-Cezerî, *en-Neşr fi'l-Kırâati'l-Aşr*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — en-Neşr, on mütevâtir kıraatin isnad zincirlerini Hz. Peygamber'e kadar sistematik olarak takip eden, alanın kesin referans eseridir.

#### R264
- **Konum**: satır 161-166 (SourcesCitation)
- **Site iddiası (TR)**: "Erken hâfız ve kıraat imamlarının biyografik zinciri — nesillerin isnâd köprüsünü belgeler."
- **Atfedilen kaynak**: ez-Zehebî, *Ma'rifetu'l-Kurrâi'l-Kibâr*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zehebî'nin eseri erken dönem hafız ve kıraat imamlarının biyografilerini içeren tanınmış bir tabakat eseridir — atıf isabetli.

## next/src/components/IbadetlerPillar.jsx (7 ibadet sayfası — namaz/oruc/hac/zekat/kurban/tovbe/zikir)

#### R265
- **Konum**: `public/ibadetler/namaz.json` `kaynaklar[]`
- **Site iddiası (TR)**: Râzî ("Bakara 2:238 'orta namaz'"), Kurtubî ("namaz vakti ayetleri"), Elmalılı ("salât kök anlamı"), Îzutsu ("îmān–kufr eksenli semantik alan analizi").
- **Atfedilen kaynak**: Fahruddîn er-Râzî, Kurtubî, Elmalılı Hamdi Yazır, Toshihiko Îzutsu
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `namaz.json` doğrudan okundu: Râzî'nin Bakara 2:238 "orta namaz" için dört görüş sunması, Kurtubî'nin namaz vakti fıkhı, Elmalılı'nın "salât" kökü açılımı ve Îzutsu'nun (1966, McGill) îmân-küfr semantik alan analizi — dördü de doğru eşleşme.

#### R266
- **Konum**: `public/ibadetler/oruc.json` `kaynaklar[]`
- **Site iddiası (TR)**: Aynı 4 kaynak, oruç-özel notlarla (örn. Kurtubî: "Bakara 2:187'deki 'beyaz iplik — siyah iplik' metaforu").
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, Îzutsu
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `oruc.json` doğrudan okundu; Kurtubî'nin Bakara 2:187 "beyaz iplik — siyah iplik" metaforu yorumu bilinen ve doğru bir tefsir referansı, diğer üç kaynağın notları da tutarlı ve isabetli.

#### R267
- **Konum**: `public/ibadetler/hac.json` `kaynaklar[]`
- **Site iddiası (TR)**: Aynı 4 kaynak, hac-özel notlarla (örn. Râzî: "'Şeâirullah' kavramının tefsiri").
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, Îzutsu
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `hac.json` doğrudan okundu; Râzî'nin "Şeâirullah" yorumu ve diğer notlar içerik olarak tutarlı ve makul, ancak her âyet referansının klasik metinlerle birebir teyidi yapılmadı — örneklem bazlı değerlendirme.

#### R268
- **Konum**: `public/ibadetler/zekat.json` `kaynaklar[]`
- **Site iddiası (TR)**: Aynı 4 kaynak, zekât-özel notlarla (örn. Râzî: "Tevbe 9:60'ın sekiz alacaklı kategorisi").
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, Îzutsu
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `zekat.json` doğrudan okundu; Râzî'nin Tevbe 9:60 "sekiz alacaklı kategorisi" yorumu bilinen ve doğru bir referans, diğer notlar da tutarlı; tam klasik metin karşılaştırması yapılmadı.

#### R269
- **Konum**: `public/ibadetler/kurban.json` `kaynaklar[]`
- **Site iddiası (TR)**: Aynı 4 kaynak, kurban-özel notlarla (örn. Râzî: "Hac 22:34-37 kurban ayetleri").
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, Îzutsu
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `kurban.json` doğrudan okundu; Râzî'nin Hac 22:34-37 kurban âyetleri yorumu doğru referans, diğer notlar tutarlı; örneklem bazlı doğrulama, tam metin karşılaştırması yapılmadı.

#### R270
- **Konum**: `public/ibadetler/tovbe.json` `kaynaklar[]`
- **Site iddiası (TR)**: Râzî, Kurtubî, Elmalılı + İbn Kayyim el-Cevziyye (*Medâricü's-Sâlikîn* — "tevbenin ahlâki-tasavvufî derinliği için birincil referans").
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, İbn Kayyim el-Cevziyye
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `tovbe.json` doğrudan okundu; Râzî/Kurtubî/Elmalılı notları tutarlı, İbn Kayyım'ın Medâricü's-Sâlikîn'i tevbenin ahlâkî-tasavvufî derinliği için makul bir referans (R246'daki aynı eserin genel yapısına dair belirsizlik notu burada da geçerli); tam doğrulama yapılmadı.

#### R271
- **Konum**: `public/ibadetler/zikir.json` `kaynaklar[]`
- **Site iddiası (TR)**: Râzî, Kurtubî, Elmalılı + İbn Kayyim el-Cevziyye (*el-Vâbilü's-Sayyib*).
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, İbn Kayyim el-Cevziyye
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `zikir.json` doğrudan okundu; İbn Kayyım'ın el-Vâbilü's-Sayyib'inin "zikir üzerine müstakil klasik eser" olarak tanıtılması doğru ve isabetli (R253'te de teyit edildi), diğer kaynakların notları da tutarlı.

#### R272
- **Konum**: 7 sayfanın tamamında "Kur'ânî İsimler" (anlam katmanları) sekmesi — her katman kısa bir `kaynak` etiketi taşıyor (sayfa başına ~15-45 tekrar, örn. `"kaynak": "Râzî, Bakara 2:43 tefsiri"`)
- **Site iddiası (TR)**: Yüzlerce ayet-seviyesi kısa atıf etiketi — hepsi yukarıdaki aynı 4-5 isme çözülüyor, tek tek çıkarılmadı (örneklem bazlı Faz 2 taraması önerilir).
- **Atfedilen kaynak**: Râzî, Kurtubî, Elmalılı, Îzutsu/İbn Kayyim (kalıp)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `next/public/ibadetler/zikir.json`'daki yapı doğrudan okundu: her katman gerçekten bir `kaynak` etiketi taşıyor (ör. "Râzî, Bakara 2:152 tefsiri"; "Kurtubî, Kehf 18:24 tefsiri; Elmalılı, A'râf 7:205") ve ayet referansları konuyla tutarlı. Yapı iddiayla örtüşüyor, ama yalnızca 1 sayfa (zikir) ve 1 terim örneklendi — 7 sayfa × ~15-45 tekrar tam taranmadı, kapsamlı bir Faz 2 turu hâlâ gerekli.

## next/src/components/QuranCommands.jsx

#### R273
- **Konum**: satır 552 (SourcesCitation)
- **Site iddiası (TR)**: "Hanefî fıkhı zemininde âyet-i ahkâm tefsirinin temel eseri."
- **Atfedilen kaynak**: Ebû Bekr el-Cessâs, *Ahkâmü'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Cessâs'ın Ahkâmü'l-Kur'ân'ı Hanefî fıkhı zemininde âyet-i ahkâm tefsirinin en temel/öncü eseridir — atıf tam isabetli.

#### R274
- **Konum**: satır 553 (SourcesCitation)
- **Site iddiası (TR)**: "Mâlikî fıkhı açısından Kur'ân'ın hüküm âyetlerini sistematik inceler."
- **Atfedilen kaynak**: Ebû Bekr İbnü'l-Arabî, *Ahkâmü'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbnü'l-Arabî'nin Ahkâmü'l-Kur'ân'ı Mâlikî fıkhı açısından hüküm âyetlerini inceleyen tanınmış bir eserdir; bu kişinin ünlü sûfî Muhyiddin İbnü'l-Arabî'den doğru şekilde ayrıştırılmış olması ("Ebû Bekr" ön adıyla) önemli bir doğruluk detayı.

#### R275
- **Konum**: satır 554 (SourcesCitation)
- **Site iddiası (TR)**: "Ahkâm âyetlerini mezhepler-arası karşılaştırmayla ele alan klasik ansiklopedik tefsir."
- **Atfedilen kaynak**: el-Kurtubî, *el-Câmi' li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kurtubî'nin eseri ahkâm âyetlerini mezhepler-arası karşılaştırmayla ele alan klasik ansiklopedik tefsir olarak tanınır — atıf isabetli.

## next/src/components/IblisSatan.jsx

#### R276
- **Konum**: satır 918 (SourcesCitation)
- **Site iddiası (TR)**: "A'râf 7:12 ateş-çamur diyaloğunun kelâmî analizi."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — A'râf 7:12'deki İblis'in "ateşten yaratıldım, çamurdan yarattın" diyaloğu klasik tefsirlerin standart konusudur; Râzî'nin kelâmî analiz karakteriyle uyumlu bir atıf.

#### R277
- **Konum**: satır 919 (SourcesCitation)
- **Site iddiası (TR)**: "7 sûrenin karşılaştırmalı tefsiri — İblis kıssasının ayrıntıları."
- **Atfedilen kaynak**: et-Taberî, *Câmiu'l-Beyân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Taberî'nin Câmiu'l-Beyân'ı İblis kıssasının farklı sûrelerdeki (Bakara, A'râf, Hicr, İsrâ, Kehf, Tâhâ, Sâd) anlatımlarını rivayetlerle bir araya getiren temel kaynaktır — "7 sûrenin karşılaştırmalı tefsiri" niteliği genel karakteriyle tutarlı.

#### R278
- **Konum**: satır 920 (SourcesCitation)
- **Site iddiası (TR)**: "İblis'in cin kimliği (Kehf 18:50) — yaratılış ve isyân ilişkisi."
- **Atfedilen kaynak**: el-Mâturîdî, *Te'vîlâtu'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mâturîdî'nin Te'vîlâtu'l-Kur'ân'ının Kehf sûresini kapsayan bir bölümü mevcut ve İblis'in cin kimliği (Kehf 18:50) mainstream tefsir konusu; ancak Mâturîdî'nin bu âyete özel yorumunun içeriği web araştırmasıyla doğrudan teyit edilemedi.

#### R279
- **Konum**: satır 921 (SourcesCitation)
- **Site iddiası (TR)**: "Şeytan'ın hile yöntemleri — Kur'an ve hadis kaynaklı tipoloji."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *İğâsetü'l-Lehfân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İğâsetü'l-Lehfân min Mesâyidi'ş-Şeytân ("Şeytan'ın Tuzaklarından Kurtuluş") tam olarak Şeytan'ın hile/tuzak yöntemleri tipolojisi üzerinedir — başlık ve içerik iddiasıyla birebir örtüşen isabetli bir atıf.

## next/src/components/InsanYolculugu.jsx

#### R280
- **Konum**: `data.sources[0-3]` (SourcesCitation, not yok)
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye (*Medâricü's-Sâlikîn*); Gazâlî (*İhyâu ʿUlûmi'd-Dîn*); Fahreddin er-Râzî (*Mefâtîhu'l-Ğayb*); Bediüzzaman Said Nursî (*Sözler*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `insan-yolculugu.json` doğrudan okundu; dört kaynağın yazar-eser-tarih eşleşmeleri (İbn Kayyım 1292-1350, Gazâlî 1058-1111, Râzî 1149-1209, Said Nursî 1878-1960) bibliyografik olarak doğru.

#### R281
- **Konum**: aşama 1 "Uyanış" `obstacleTr`
- **Site iddiası (TR)**: "Râzî: gaflet, uyanışın en büyük perdesidir."
- **Atfedilen kaynak**: Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Eser/sayfa referansı olmadan verilmiş bir vecize. Râzî'nin Mefâtîhu'l-Ğayb'ında gaflet teması işlenir, ama bu tam ifadenin Râzî'ye ait olduğu doğrulanamadı — büyük olasılıkla modern bir parafraz.

#### R282
- **Konum**: aşama 2 "İman" `practiceTr`
- **Site iddiası (TR)**: "İbn Kayyim: iman iki kanatlıdır — kalbin tasdiki + amelin doğrulaması."
- **Atfedilen kaynak**: İbn Kayyim
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — İbn Kayyım'ın imanın tasdik+amel ikilisini savunduğu bilinir (Kitâbü'l-Îmân, Medâricü's-Sâlikîn), ama "iman iki kanatlıdır" metaforunun birebir ona ait olduğu doğrulanamadı; eser/sayfa atfı yok.

#### R283
- **Konum**: aşama 3 "Sâlih Amel" `practiceTr`
- **Site iddiası (TR)**: "Nursî Sözler'de: sâlih amel imanın 'hayat suyu'dur; onsuz iman 'kurumuş' kalır."
- **Atfedilen kaynak**: Nursî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — "Sâlih amel imanın 'hayat suyu'dur" ifadesinin Sözler'de birebir bu şekilde geçtiğine dair arama sonucu bulunamadı; eser/cilt/sayfa atfı yok.

#### R284
- **Konum**: aşama 4 "Takvâ" `practiceTr`
- **Site iddiası (TR)**: "Râzî: takvâ, Allah ile kul arasında bir 'siperdir'..."
- **Atfedilen kaynak**: Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Takvânın "siper" olarak tanımlanması yaygın bir tasavvufi/kelâmî tema; Râzî'ye özgü birebir alıntı olduğunu gösteren kaynak bulunamadı, eser/sayfa atfı yok.

#### R285
- **Konum**: aşama 5 "İhsan" `practiceTr`
- **Site iddiası (TR)**: "Gazâlî İhyâ'da bunu 'sürekli huzûr hâli' diye adlandırır."
- **Atfedilen kaynak**: Gazâlî
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Gazâlî İhyâ'da murâkabe/ihsan kavramını geniş işler, tema uyumlu; ama "sürekli huzûr hâli" ifadesinin birebir Gazâlî'ye ait olduğu doğrulanamadı, sayfa/bölüm atfı yok.

#### R286
- **Konum**: aşama 8 "Rızâ" `practiceTr`
- **Site iddiası (TR)**: "İbn Kayyim: rızâ 'kalbin başka bir tercih arzu etmediği' hâldir."
- **Atfedilen kaynak**: İbn Kayyim
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — İbn Kayyım Medâricü's-Sâlikîn'de rızâyı bir makam olarak ele alır, tema uyumlu; ama "kalbin başka bir tercih arzu etmediği hâl" ifadesinin birebir alıntı olduğu doğrulanamadı.

## next/src/components/KitapKavrami.jsx

#### R287
- **Konum**: satır 153-158 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân'daki her kelimenin kök + türev + tam anlam yelpazesi... beyân, tibyân, mübîn ayrımı buradan."
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî, *el-Müfredât fî Garîbi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Müfredât fî Ğarîbi'l-Kurʾân, Kur'ân kelimelerinin kök+türev analizine adanmış standart klasik sözlüktür; iddia ile uyumlu.

#### R288
- **Konum**: satır 160-167 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimleri kompendyumu; Kur'ân'ın esmâsı, sıfatları, isim çeşitliliği bahsi kapsamlı ele alınır."
- **Atfedilen kaynak**: ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin el-Burhân'ı gerçek bir Kur'ân ilimleri kompendyumudur ve Kur'ân'ın isim/sıfatları konusunu içerir; iddia genel hatlarıyla doğru.

#### R289
- **Konum**: satır 169-175 (SourcesCitation)
- **Site iddiası (TR)**: "Nev'i 17 'Kur'ân'ın isim ve künyeleri' — 55 farklı isim ve sıfat inventarize eder."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkān'ın "en-Nev'u's-sâbi' aşer" (17. tür) tam olarak "Kur'ân'ın ve sûrelerinin isimlerini bilmek" başlığını taşır — teyit edildi. "55 farklı isim" rakamı bağımsız doğrulanamadı ama konu eşleşmesi kesin.

#### R290
- **Konum**: satır 177-183 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân'ı bir mücevher hazinesi olarak okur — nûr, şifâ, hüdâ gibi isimleri deneyimsel çerçevede işler."
- **Atfedilen kaynak**: Gazâlî, *Cevâhirü'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Gazâlî'nin Cevâhirü'l-Kurʾân'ı gerçek bir eserdir ve Kur'ân'ı nûr/şifâ/hüdâ gibi isimler üzerinden mücevher metaforuyla ele alır; iddia ile uyumlu.

## next/src/components/InsanTanimi.jsx

#### R291
- **Konum**: `sources[0]` (SourcesCitation)
- **Site iddiası (TR)**: "İnsân, beşer, nâs, benî Âdem — kelime köklerinin klasik referansı."
- **Atfedilen kaynak**: er-Râgıb el-Isfahânî, *el-Müfredât fî Ğarîbi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — er-Râgıb el-İsfahânî'nin Müfredât'ı insân/beşer/nâs kök analizlerinin standart klasik referansıdır.

#### R292
- **Konum**: `sources[1]` (SourcesCitation)
- **Site iddiası (TR)**: "İnsan denklemi (fıtrat + akıl + irade + vahy → istikâmet) kurucu metin."
- **Atfedilen kaynak**: İbnü'l-Kayyim, *Miftâhu Dâri's-Saʿâde*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Miftâhu Dâri's-Saʿâde gerçek bir eserdir ve fıtrat-akıl-irade-vahiy temalarını işler, ancak "insan denklemi" çerçevesi modern bir yeniden-kurgu/parafraz — eserde bu şekilde formülize edilmiş bir "denklem" olduğu doğrulanamadı.

#### R293
- **Konum**: `sources[2]` (SourcesCitation)
- **Site iddiası (TR)**: "'Ahsen-i takvîm' ↔ 'esfel-i sâfilîn' paradoksunun kelâmî çözümü."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin Mefâtîhu'l-Ğayb'ı, Tîn 95:4-5'teki "ahsen-i takvîm/esfel-i sâfilîn" paradoksunu kelâmî derinlikte işlemesiyle tanınır; iddia ile uyumlu.

#### R294
- **Konum**: `sources[3]` (SourcesCitation)
- **Site iddiası (TR)**: "Halifelik kavramının fıkhî temellendirmesi (Bakara 2:30)."
- **Atfedilen kaynak**: el-Kurtubî, *el-Câmiʿ li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kurtubî'nin eseri fıkhî ağırlıklıdır; Bakara 2:30 halifelik ayetinin fıkhî temellendirmesi bu eserin doğal kapsamına girer.

#### R295
- **Konum**: `sources[4]` (SourcesCitation)
- **Site iddiası (TR)**: "Kalbin dört boyutu — iç ekosistem modeli."
- **Atfedilen kaynak**: el-Gazâlî, *İhyâʾu ʿUlûmi'd-Dîn*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Gazâlî İhyâ'da (Şerhu Acâibi'l-Kalb bölümü) kalbin çoklu boyutlarını işler; genel "iç ekosistem" iddiası eserin gerçek içeriğiyle uyumlu.

#### R296
- **Konum**: `sources[5]` (SourcesCitation)
- **Site iddiası (TR)**: "Modern tefsir: fıtrat ↔ kültür dengesi."
- **Atfedilen kaynak**: İbn Âşûr, *et-Tahrîr ve't-Tenvîr*
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — İbn Âşûr'un et-Tahrîr ve't-Tenvîr'i gerçek ve modern yaklaşımlı bir tefsirdir; ancak "fıtrat-kültür dengesi" ifadesinin eserde bu şekilde geçtiği doğrulanamadı, spesifik atıf yok.

#### R297
- **Konum**: `ScholarsTab` kart 1
- **Site iddiası (TR)**: "İnsanı adlandıran 4 kelimenin kök analizini yapan klasik: insân — 'ünsiyet' ile 'nisyân' köklerini yan yana koyar."
- **Atfedilen kaynak**: er-Râgıb el-Isfahânî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Müfredât'ta "insân" kökünün "üns/ünsiyet" ile "nisyân" arasındaki tartışması gerçekten yer alan klasik bir dilbilimsel ayrımdır.

#### R298
- **Konum**: `ScholarsTab` kart 2
- **Site iddiası (TR)**: "İnsan denklemi hâline getirir: fıtrat + akıl + irade + vahy. Bu 4 boyutun uyumu 'saâdet'..."
- **Atfedilen kaynak**: İbnü'l-Kayyim
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — R292 ile aynı içerik — Miftâhu Dâri's-Saʿâde gerçek eser, ancak "insan denklemi" formülasyonu modern bir parafraz, eserde birebir bu şekilde yok.

#### R299
- **Konum**: `ScholarsTab` kart 3
- **Site iddiası (TR)**: "İnsanın 'ahsen-i takvîm' ve 'esfel-i sâfilîn' arasındaki paradoksunu kelâmî bir sistemle çözer."
- **Atfedilen kaynak**: er-Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R293 ile aynı — Râzî'nin ahsen-i takvîm/esfel-i sâfilîn paradoksunu kelâmî sistemle çözme girişimi doğru bir karakterizasyon.

#### R300
- **Konum**: `ScholarsTab` kart 4
- **Site iddiası (TR)**: "'Halifelik' (Bakara 2:30) kavramını fıkhî temellendirir…"
- **Atfedilen kaynak**: el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — R294 ile aynı — Kurtubî'nin fıkhî temellendirme yaklaşımı doğru.

#### R301
- **Konum**: `ScholarsTab` kart 5
- **Site iddiası (TR)**: "İnsan psikolojisinin 'kalbin dört boyutu' modeli: akıl (dimâğ), gazap (kelb), şehvet (hınzîr), rahmet (melek)."
- **Atfedilen kaynak**: el-Gazâlî
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — Gazâlî'nin İhyâ'daki (Şerhu Acâibi'l-Kalb) gerçek dörtlü kalp modeli: behîmî (domuz=şehvet), sebüî (köpek=gazap), **şeytânî (şeytan=hile/vesvese)**, rabbânî/melekî (melek=akıl/hikmet). Sitenin verdiği "akıl(dimağ)-gazap(kelb)-şehvet(hınzır)-rahmet(melek)" listesi **şeytânî unsuru tamamen atlıyor** ve "rahmet"i uydurma bir dördüncü boyut olarak ekliyor — klasik modelin yanlış aktarımı. **Düzeltilmeli.**

#### R302
- **Konum**: `ScholarsTab` kart 6
- **Site iddiası (TR)**: "Modern tefsir: 'ahsen-i takvîm' kavramını çağdaş insanbilim ile buluşturur."
- **Atfedilen kaynak**: İbn Âşûr
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — R296 ile aynı — İbn Âşûr'un et-Tahrîr ve't-Tenvîr'i gerçek eser, "çağdaş insanbilim" ile buluşturma iddiası spesifik olarak doğrulanamadı.

## next/src/components/KissaAtlas.jsx

#### R303
- **Konum**: satır 196-202 (SourcesCitation)
- **Site iddiası (TR)**: "Peygamber kıssalarının en kapsamlı klasik derlemesi; ayet + hadis + selef rivayetleri birleştirir."
- **Atfedilen kaynak**: İbn Kesîr, *Kısasü'l-Enbiyâ*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in Kısasü'l-Enbiyâ'sı, peygamber kıssalarının ayet+hadis+selef rivayetlerini birleştiren standart klasik derlemedir; iddia doğru.

#### R304
- **Konum**: satır 204-210 (SourcesCitation)
- **Site iddiası (TR)**: "Kıssaları tarih perspektifinden ele alan temel kaynak; farklı rivayetleri isnadıyla verir."
- **Atfedilen kaynak**: et-Taberî, *Târîhu'r-Rusul ve'l-Mülûk*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Taberî'nin eseri isnad zincirli rivayetleriyle tanınan temel tarihsel kaynaktır; iddia doğru.

#### R305
- **Konum**: satır 212-218 (SourcesCitation)
- **Site iddiası (TR)**: "Kıssaların Kur'ân'da neden dağıtılarak anlatıldığı ve bu tekniğin belağat değeri üzerine klasik değerlendirme."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — el-İtkān kıssalarla ilgili bir "nev'" içerir, ancak "kıssaların dağıtılarak anlatılmasının belâgat değeri" spesifik çerçevesinin bu eserde bu şekilde işlendiği bağımsız olarak doğrulanamadı.

#### R306
- **Konum**: satır 220-226 (SourcesCitation)
- **Site iddiası (TR)**: "Kıssaların belağat + lisân boyutunu detaylıca inceler; her ayetin dilsel katmanını açar."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ı belâgat/dil odaklı tefsirin zirvesi olarak tanınır; her ayetin dilsel katmanını incelemesi iddiayla uyumlu.

## next/src/components/TekrarAnatomi.jsx

#### R307
- **Konum**: satır 122 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimlerinin klasik özeti — iltifât ve tekrarın belağî çerçevesi."
- **Atfedilen kaynak**: ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin el-Burhân'ı iltifât dahil belâgî konuları içeren gerçek bir Kur'ân ilimleri özetidir.

#### R308
- **Konum**: satır 123 (SourcesCitation)
- **Site iddiası (TR)**: "Zerkeşî'nin geliştirilmiş halefi — tekrarın türleri (tekrîr, iltifât, tavdih) sistemli katalog."
- **Atfedilen kaynak**: es-Suyûtî, *el-İtkân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Süyûtî'nin el-İtkān'ının Zerkeşî'nin Burhân'ını temel alıp genişlettiği tarihsel olarak bilinen bir gerçektir; tekrar türlerini kataloglaması iddiayla uyumlu.

#### R309
- **Konum**: satır 124 (SourcesCitation)
- **Site iddiası (TR)**: "Belağî tefsirin zirvesi — iltifâtın klasik örneklerinin analizi."
- **Atfedilen kaynak**: ez-Zamahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ı iltifât dahil belâgî örneklerin klasik analiziyle tanınır; iddia doğru.

#### R310
- **Konum**: satır 125 (SourcesCitation)
- **Site iddiası (TR)**: "Rahmân sûresindeki refrenin (31 kez) klasik yorumu — vurgu ve hitap anlamları."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsiri Rahman sûresindeki tekrarlanan ayeti (31 kez) geniş şekilde yorumlar; klasik tefsirler arasında bu konuda en kapsamlısı olarak bilinir.

## next/src/components/SurahComparator.jsx

#### R311
- **Konum**: satır 1085-1091 (SourcesCitation)
- **Site iddiası (TR)**: "Sûreler-arası münâsebât ilminin temel eseri — her sûrenin bir öncekiyle bağını sistematik ayet-ayet inceler."
- **Atfedilen kaynak**: el-Bikâî, *Nazmü'd-Dürer fî Tenâsübi'l-Âyi ve's-Süver*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Bikâî'nin Nazmü'd-Dürer'i, sûreler-arası münasebat ilminin gerçekten temel/öncü eseridir; iddia doğru.

#### R312
- **Konum**: satır 1093-1099 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimleri ansiklopedisi; sûrelerin başlangıç-son münâsebeti, fâsıla ilişkisi..."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkān münasebat/fâsıla konularını içeren kapsamlı bir Kur'ân ilimleri ansiklopedisidir; iddia ile uyumlu.

#### R313
- **Konum**: satır 1101-1107 (SourcesCitation)
- **Site iddiası (TR)**: "Tenâsüb bahsi — sûrelerin nüzul sırasında değil mushaf tertibinde neden bu düzende olduğunu belağat perspektifinden savunur."
- **Atfedilen kaynak**: ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin el-Burhân'ı mushaf tertibinin tevkifi/belâgî savunusunu içeren konuları barındırır; iddia genel olarak doğru.

#### R314
- **Konum**: satır 1109-1115 (SourcesCitation)
- **Site iddiası (TR)**: "Modern akademik münâsebât çalışması — Michel Cuypers ve Neuwirth'in yanında sûre iç-yapısı + sûreler-arası bağların çağdaş sistematik analizini yapar."
- **Atfedilen kaynak**: Neal Robinson, *Discovering the Qur'an*, 1996 (isim geçen: Michel Cuypers, Angelika Neuwirth)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Neal Robinson'ın Discovering the Qur'an (1996, SCM Press) kitabı gerçek ve sûre iç/dış tutarlılığını ele alan bir çalışma — bibliyografik bilgi doğru. Ancak Cuypers'in en bilinen halka-kompozisyon çalışmaları Robinson'ın kitabından SONRA yayımlandı; "Cuypers'ın yanında" ifadesi eş-zamanlı bir akademik konum çağrıştırıyorsa yanıltıcı olabilir.

## next/src/components/ElestirelCerceve.jsx

#### R315
- **Konum**: satır 190-196 (SourcesCitation)
- **Site iddiası (TR)**: "Maksadî (amaç-odaklı) yorum çerçevesi — hükmün tarihsel bağlamı ile çağdaş uygulaması arasındaki mesafeyi işaret eden modern klasik."
- **Atfedilen kaynak**: Fazlur Rahman, *İslâm ve Modernite*, 1982
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — Türkçe başlık "İslâm ve Modernite"den resmî çeviri başlığı "İslam ve Çağdaşlık"a (Ankara Okulu Yayınları, 2010) değiştirildi.

#### R316
- **Konum**: satır 198-204 (SourcesCitation)
- **Site iddiası (TR)**: "Klasik hukuk ile çağdaş etik arasında entelektüel dürüst bir köprü kurar."
- **Atfedilen kaynak**: Khaled Abou El Fadl, *Vasat İslâm*, 2006
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — Uydurma/yanıltıcı "Vasat İslâm" başlığı kaldırıldı, birebir çeviri "İslam'da Güzellik Arayışı" kullanıldı.

#### R317
- **Konum**: satır 206-212 (SourcesCitation)
- **Site iddiası (TR)**: "İslâmî metin geleneğinin nasıl aktarıldığını + çağdaş yanlış anlamalarını akademik olarak çözümler."
- **Atfedilen kaynak**: Jonathan A. C. Brown, *Kur'ân'ı Yanlış Alıntılamak*, 2014
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — Konu-değiştiren "Kur'ân'ı Yanlış Alıntılamak" başlığı "Muhammed'i Yanlış Alıntılamak"a düzeltildi (kitabın gerçek konusu Hz. Muhammed/hadis, Kur'ân değil).

#### R318
- **Konum**: satır 214-220 (SourcesCitation)
- **Site iddiası (TR)**: "Modern eleştirel Kur'ân okuması — apolojetik değil bir okumadır."
- **Atfedilen kaynak**: Ziauddin Sardar, *Kur'ân'ı Okumak*, 2011
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Sardar'ın Reading the Qur'an (2011, Oxford UP) kitabı gerçek; "Kur'ân'ı Okumak" Türkçe başlığı doğru ve sadık bir çeviridir, apolojetik olmayan eleştirel okuma iddiasıyla da uyumlu.

## next/src/components/MeselAtlasi.jsx

#### R319
- **Konum**: satır 1433-1439 (SourcesCitation)
- **Site iddiası (TR)**: "Kurʾânî meselerin ilk müstakil derlemesi; her meselin yapısını, hikmetini ve retorik amacını tek tek çözümler."
- **Atfedilen kaynak**: el-Mâverdî, *Emsâlü'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mâverdî'ye ait "Emsâlü'l-Kurʾân" adlı bir yazma eser var olduğu doğrulandı, ama daha ünlü "el-Emsâl ve'l-Hikem" eseri Kur'ân'a özgü değil genel Arap atasözleri kitabıdır — karıştırma riski var. "İlk müstakil derleme" üstünlük iddiası bağımsız olarak doğrulanamadı.

#### R320
- **Konum**: satır 1441-1447 (SourcesCitation)
- **Site iddiası (TR)**: "Meselin belâgat mimarisi (teşbih, temsil, istiare) üzerine klasik tefsirin zirvesi."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ı teşbih/temsil/istiare gibi belâgat unsurlarının incelenmesinde klasik tefsirin zirvesi olarak akademik konsensüsle tanınır; iddia doğru.

#### R321
- **Konum**: satır 1449-1455 (SourcesCitation)
- **Site iddiası (TR)**: "Emsâl bahsi — meselin Kurʾân retoriği içindeki yerini konumlandırır."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkān'da meseller (emsâl) için ayrılmış müstakil bir "nev" (tür) bölümü olduğu klasik Kur'an ilimleri literatüründe iyi bilinir; atıf türü ve konumu tutarlıdır.

#### R322
- **Konum**: satır 1457-1463 (SourcesCitation)
- **Site iddiası (TR)**: "Meselleri kelâmî hikmetle birleştiren tefsir; sivrisinek, örümcek gibi metaforların anlam katmanlarını açar."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsiri sivrisinek (Bakara 2:26) ve örümcek (Ankebût 29:41) mesellerini kelâmî/felsefî derinlikte işlemesiyle tanınır; site iddiası eserin bilinen karakteriyle örtüşüyor.

#### R323
- **Konum**: satır 1225-1254, "Âlim Görüşleri" paneli (`public/amthal/scholars.json`)
- **Site iddiası (TR)**: "Meseller salt benzetme değil, gerçeğin insan zihninin kavrayabileceği formdaki tezahürüdür — ilahi bir delil (burhan)."
- **Atfedilen kaynak**: İbn Kayyım el-Cevziyye (*el-Emsâl fi'l-Kur'âni'l-Kerîm*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kayyım'ın el-Emsâl fi'l-Kur'âni'l-Kerîm adlı eseri gerçekten var ve doğrudan Kur'an'daki meseller üzerine yazılmıştır; "meseller ilahî delil/burhan" çerçevesi eserin bilinen didaktik amacıyla uyumlu.

#### R324
- **Konum**: aynı panel
- **Site iddiası (TR)**: "Nûr 24:40'taki derin deniz meselini çok katmanlı okur: Derin okyanus = dünya, birinci dalga = nefsin arzuları..."
- **Atfedilen kaynak**: İmam Gazzâlî (*Mişkâtü'l-Envâr*)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Gazâlî'nin Mişkâtü'l-Envâr'ı Nûr 24:35'i "kandil/nûr" alegorisiyle beş ruh mertebesi üzerinden çok katmanlı okur — bu iyi belgelenmiş. Ama sitenin iddia ettiği spesifik dörtlü eşleme (derin okyanus=dünya, dalgalar=nefs/öfke, bulut=cehalet) kaynaklarda bu haliyle doğrulanamadı — muhtemelen modern bir parafraz.

#### R325
- **Konum**: aynı panel
- **Site iddiası (TR)**: "Meselleri Kur'an ilimlerinin müstakil bir dalı olarak üç türe ayırır: Sarîh, Kâmin, Mürsel."
- **Atfedilen kaynak**: es-Süyûtî (*el-İtkân*)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — es-Süyûtî'nin el-İtkān'ında emsâli Sarîh, Kâmin, Mürsel olarak üçe ayırması Kur'an ilimleri literatüründe standart ve iyi bilinen bir tasniftir.

#### R326
- **Konum**: aynı panel
- **Site iddiası (TR)**: "Mesellerin amacını 'soyut olanı somutlaştırma' ve 'gayb'ı şehâdet'le köprüleme' olarak tanımlar."
- **Atfedilen kaynak**: eş-Şinkîtî (*Edvâu'l-Beyân*)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — eş-Şinkîtî'nin Edvâu'l-Beyân'ı gerçek ve tanınmış bir tefsirdir, ancak "soyut olanı somutlaştırma" tanımının doğrudan metinden teyidi yapılamadı — eser büyük ölçüde dijitalleşmemiş/aranabilir değil.

#### R327
- **Konum**: satır 1264-1281
- **Site iddiası (TR)**: "Nursi'ye göre kâinat 'açık bir Kur'ân'dır — her atom, her hücre, her gezegen Yaratıcı'nın hikmetinin temsîlî bir aynasıdır.'"
- **Atfedilen kaynak**: Said Nursi (*Risâle-i Nur Külliyatı*, Yirmi İkinci Söz)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nursî'nin Yirmi İkinci Söz'de "kâinat açık bir Kur'an'dır" temsilî yaklaşımı Risâle-i Nur'un bilinen içeriğiyle uyumlu; site bunu açıkça "modern bir uzantı" olarak çerçeveliyor — §13.24 ruhuna uygun temkinli dil.

## next/src/components/KuranRetorigi.jsx

#### R328
- **Konum**: satır 69-75 (SourcesCitation)
- **Site iddiası (TR)**: "Kurʾânî belâgat teorisinin temel eseri; nazım teorisini kuran metin. Modern belâgatın temeli."
- **Atfedilen kaynak**: Abdülkâhir el-Cürcânî, *Delâʾilü'l-İʿcâz*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Cürcânî'nin Delâʾilü'l-İʿcâz'ı nazım teorisinin kurucu metni olarak akademik literatürde evrensel kabul görür; tarih aralığı (öl. 471H/1078) da doğru.

#### R329
- **Konum**: satır 77-83 (SourcesCitation)
- **Site iddiası (TR)**: "Belâgat perspektifinden Kurʾân tefsirinin klasik zirvesi."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ı belâgat perspektifinden Kur'an tefsirinin klasik zirvesi olarak yaygın biçimde kabul edilir; iddia doğru.

#### R330
- **Konum**: satır 85-91 (SourcesCitation)
- **Site iddiası (TR)**: "Belâgatı sistematize eden ilk büyük ansiklopedik eser; meʿânî · beyân · bedî üçlü tasnifi buradan gelir."
- **Atfedilen kaynak**: es-Sekkâkî, *Miftâhu'l-Ulûm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Web araştırması es-Sekkâkî'nin Miftâhu'l-Ulûm'unun belâgatı meʿânî-beyân-bedî üçlü tasnifiyle sistemleştiren öncü/standart eser olduğunu doğruluyor; tarih aralığı (1160–1229) de doğru.

#### R331
- **Konum**: satır 93-99 (SourcesCitation)
- **Site iddiası (TR)**: "Retorik soru, muhatap değişimi ve iltifat gibi figürleri kelâmî hikmetle birleştiren tefsir."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsirinin retorik soru, muhatap değişimi, iltifat gibi figürleri kelâmî hikmetle harmanlaması eserin bilinen üslubuyla tutarlı.

## next/src/components/KadinlarAtlasi.jsx

#### R332
- **Konum**: satır 142-148 (SourcesCitation)
- **Site iddiası (TR)**: "Meryem, Âsiye, Belkıs, Havva ve Kur'an'daki tüm kadın figürler hakkındaki temel tefsir kaynağı."
- **Atfedilen kaynak**: İbn Kesîr, *Tefsîru'l-Kurʾâni'l-Azîm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in tefsiri Meryem, Âsiye, Belkıs, Havva gibi figürleri klasik rivayet ağırlıklı biçimde ayrıntılı işler; "temel kaynak" niteliği makul bir genel değerlendirme.

#### R333
- **Konum**: satır 150-156 (SourcesCitation)
- **Site iddiası (TR)**: "Meryem'in 'sıddîka' makamı, Belkıs'ın hikmeti ve Âsiye'nin duası üzerine derin kelâmî çözümlemeler."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin tefsirinin genel kelâmî derinliği bilinir, ama "Meryem'in sıddîka makamı, Belkıs'ın hikmeti, Âsiye'nin duası" gibi spesifik üçlü çözümlemeyi doğrudan metinden teyit edilemedi — makul ama doğrulanamayan bir özet.

#### R334
- **Konum**: satır 158-164 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'an'daki kadın figürlerin dilsel + belâgat perspektifinden analizi."
- **Atfedilen kaynak**: ez-Zemahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ının dilsel/belâgat perspektifinden kadın figürleri işlemesi eserin genel karakteriyle (her ayette retorik figürleri işaretleme) tutarlı.

#### R335
- **Konum**: satır 166-172 (SourcesCitation)
- **Site iddiası (TR)**: "Modern gender hermeneutiği; kadın figürlerin klasik tefsir okumasına eleştirel çağdaş perspektif."
- **Atfedilen kaynak**: Amina Wadud, *Kurʾân ve Kadın*, 1992
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Wadud'un Qur'an and Woman'ı gerçekten 1992'de (Malezya, Fajar Bakti) ilk baskısını yapmıştır (1999'da Oxford UP genişletilmiş baskı) — tarih ve içerik doğru.

#### R336
- **Konum**: satır 934 (`OBSERVATIONS`)
- **Site iddiası (TR)**: "Kur'an'da kendisine doğrudan وحي lafzıyla bildirimde bulunulan tek kadın Hz. Mûsâ'nın annesidir (Kasas 28:7)... Klasik tefsir (Râzî, Kurtubî) bu ayrımı dikkatle korur."
- **Atfedilen kaynak**: er-Râzî, el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Musa'nın annesine "vahy" edilmesinin ilham mı nübüvvet mi olduğu tartışması gerçek ve bilinen bir klasik konu, ama Râzî ve Kurtubî'nin bu spesifik ayrımı "dikkatle koruduğu" iddiası birebir metinden teyit edilemedi.

#### R337
- **Konum**: satır 1087 (`OBSERVATIONS`)
- **Site iddiası (TR)**: "Esbâbu'n-nüzûl literatüründe (Vâhidî, Buhârî) zıhar hükmünün bu olay üzerine indiği belgelenir."
- **Atfedilen kaynak**: el-Vâhidî, İmam el-Buhârî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Vâhidî'nin Esbâbu'n-Nüzûl'ü ve Buhârî, Havle bint Sa'lebe'nin zıhar şikâyetinin Mücâdele sûresinin inişine sebep olduğunu belgeleyen standart kaynaklardır.

#### R338
- **Konum**: satır 1101 (`OBSERVATIONS`)
- **Site iddiası (TR)**: "'Kemâl' hadisi (Buhârî, Enbiyâ 32; Müslim, Fedâilü's-Sahâbe) — 'erkeklerden birçoğu kemâle erdi; kadınlardan ise Hz. Meryem ile Hz. Âsiye'den başkası kemâle ermedi'..."
- **Atfedilen kaynak**: İmam el-Buhârî (Enbiyâ 32), Müslim (Fedâilü's-Sahâbe)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Kemâl" hadisi (Buhârî 3411, Müslim 2431) — "Asiye ve Meryem'den başkası kemâle ermedi" — doğrulandı. Kaynak dosya ayrıca bu hadisi "cennet kadınlarının en faziletlileri" hadisinden bilinçli olarak ayırt ediyor, titiz bir doğruluk göstergesi.

> **`public/kadinlar.json` `figures[].criticalNoteTr`** — 14 kadın figürü, çoğunlukla Taberî + İbn Kesîr'e atfedilen isim/anlatı doğrulaması:

#### R339
- **Konum**: `figures[id=meryem].criticalNoteTr`
- **Site iddiası (TR)**: "Hz. Meryem'in peygamber olup olmadığı klasik tefsirde tartışmalıdır. İbn Hazm ve Kurtubî gibi bazı Mâlikî âlimleri ona nebî/nebîye demişler; çoğunluk sıddîka olarak değerlendirir."
- **Atfedilen kaynak**: İbn Hazm, el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Web araştırması İbn Hazm'ın (Zâhirî) ve Kurtubî'nin (Mâlikî) Hz. Meryem'i nebiyye kabul ettiğini doğruluyor; çoğunluğun sıddîka görüşünde olduğu iddiası da doğru.

#### R340
- **Konum**: `figures[id=asiye].criticalNoteTr`
- **Site iddiası (TR)**: "'Asiye bint Müzâhim' ismi Kur'an'da geçmez; klasik tefsirde (Taberî, İbn Kesîr) verilir. Hadiste (Buhârî, Enbiyâ 32; Müslim, Fedâilü's-Sahâbe 70)..."
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr, Buhârî, Müslim
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Asiye bint Müzâhim" adının Kur'an'da geçmediği, klasik tefsir kaynaklı olduğu ve "kemâl" hadisinin Buhârî/Müslim'de yer aldığı doğru; kaynak dosya şehadet rivayetlerinin Kur'an dışı olduğunu ayrıca not ederek titizlik gösteriyor.

#### R341
- **Konum**: `figures[id=havva].criticalNoteTr`
- **Site iddiası (TR)**: "'Havva' ismi Kur'an'da hiç geçmez... 'eğri kaburgasından' yaratıldığına dair rivayet (Buhârî, Nikâh 79)..."
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr, Buhârî (Nikâh 79)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Havva" isminin Kur'an'da geçmediği ve "eğri kaburgadan yaratılma" rivayetinin Buhârî (Nikâh 79) kaynaklı olduğu doğru; kaynak dosya tartışmalı yorumu (Ebû Müslim el-İsfahânî'nin teşbihî okuması) ekleyerek nüans katıyor.

#### R342
- **Konum**: `figures[id=saba-melikesi].criticalNoteTr`
- **Site iddiası (TR)**: "'Belkıs' ismi Kur'an'da geçmez... Saba krallığının tarihsel varlığı arkeolojik olarak Yemen'de doğrulanmıştır..."
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr; isimsiz arkeolojik doğrulama iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Belkıs" adının Kur'an'da geçmediği ve Saba krallığının Yemen'de arkeolojik olarak doğrulandığı genel bilgiyle örtüşüyor; kaynak dosya kraliçe kaydının Saba'da bulunamadığını da ekleyerek §13.24'ün istediği temkinli çerçeveye uyuyor.

#### R343
- **Konum**: `figures[id=sara].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr; "bazı kaynaklarda Mücâhid'e atfen"
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kaynak dosyada Sara'nın gülüşüne dair üç görüş (şaşkınlık, sevinç/Mücâhid'e atfen, "hayız" yorumu) ayrıntılı ve nüanslı biçimde veriliyor; "bazı kaynaklarda Mücâhid'e atfen" ifadesi bilinçli bir temkin taşıyor.

#### R344
- **Konum**: `figures[id=musa-annesi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr, el-Kurtubî, İbn Âşûr
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Musa'nın annesine yapılan "vahy"in ilham mı nübüvvet mi olduğu tartışmasının Kurtubî ve İbn Âşûr'a atfedilmesi klasik tefsir geleneğiyle uyumlu, makul bir genel atıf.

#### R345
- **Konum**: `figures[id=imran-esi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî ("Hanne" ismi); Hristiyan apokrif *Protoevangelium of James*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Yakub Protoincili gerçekten Meryem'in annesini "Anna/Hanne" olarak adlandırır — bu tarihsel/edebi bilgi doğru.

#### R346
- **Konum**: `figures[id=aziz-esi].criticalNoteTr`
- **Site iddiası (TR)**: "'Zelîha'... İsrâiliyyât kaynaklıdır — Taberî ve Sâlebî bu isimleri kaydeder; sonradan Fars edebiyatında (Câmî'nin 'Yûsuf u Zelîha' mesnevisi) klasikleşir."
- **Atfedilen kaynak**: et-Taberî, es-Sâlebî, Câmî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Zelîha" isminin İsrâiliyyat kaynaklı olup Taberî/Sâlebî'de kayıtlı olduğu ve Câmî'nin "Yûsuf u Zelîha" mesnevisinde klasikleştiği tarihsel-edebi bir gerçek; iddia doğru.

#### R347
- **Konum**: `figures[id=lut-esi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, el-Kurtubî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — Lût'un eşinin isminin ("Vâila"/"Vâhile") ve "hıyanet" kelimesinin dini yorumunun Taberî, Kurtubî, İbn Kesîr'e atfedilmesi genel olarak bilinir ama tam metin karşılaştırması yapılamadı.

#### R348
- **Konum**: `figures[id=nuh-esi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, Mukātil b. Süleyman
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Nuh'un eşinin isim atfının Taberî ve Mukātil b. Süleyman'a dayandırılması, ikisinin de İsrâiliyyat içerikli isim nakleden müfessirler olması bakımından makul; ama Mukātil'in bu spesifik ismi verdiği birebir doğrulanamadı.

#### R349
- **Konum**: `figures[id=yahya-annesi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr; Luka 1:5-25 paraleli
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Yeni Ahit'teki Elizabeth ile Luka 1:5-25 paraleli doğru bir İncil referansıdır; Yahya'nın annesinin isminin Kur'an'da geçmediği de doğru.

#### R350
- **Konum**: `figures[id=suayb-kizi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî ("Safûra"/"Lîya"); Çıkış 2:21 (Tsipporah) paraleli
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Çıkış 2:21'de Musa'nın Midyanlı rahibin kızı Tsipporah (Zippora) ile evlendiği doğru bir Tevrat referansı; Şuayb'ın kızının isminin Kur'an'da geçmediği de doğru.

#### R351
- **Konum**: `figures[id=havle].criticalNoteTr`
- **Site iddiası (TR)**: "'Havle bint Sa'lebe'... sahih hadis ve klasik tefsir kaynaklarında (Buhârî, Vâhidî'nin Esbâbu'n-Nüzûl'ü, Taberî) verilir."
- **Atfedilen kaynak**: İmam el-Buhârî, el-Vâhidî, et-Taberî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Havle bint Sa'lebe'nin hikâyesinin Buhârî, Vâhidî'nin Esbâbu'n-Nüzûl'ü ve Taberî'de yer aldığı doğrulandı; Mücâdele sûresinin adını ondan aldığı da doğru.

#### R352
- **Konum**: `figures[id=musa-ablasi].criticalNoteTr`
- **Atfedilen kaynak**: et-Taberî, İbn Kesîr
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Musa'nın ablasının isminin (Tevrat'taki Miriam ile özdeşleştirilerek "Meryem") Taberî ve İbn Kesîr'e atfedilmesi klasik tefsir geleneğiyle genel olarak uyumlu, ama spesifik "iki ayrı İmran" notunun Taberî'ye ait olduğu birebir teyit edilemedi.

## next/src/components/Mukattaa.jsx

#### R353
- **Konum**: satır 153 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimlerinin ansiklopedik özeti — mukattaʿâta özel bölüm ve klasik yorum katalogu."
- **Atfedilen kaynak**: es-Suyûtî, *el-İtkân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — es-Süyûtî'nin el-İtkān'ının Kur'an ilimlerini ansiklopedik biçimde özetlediği ve mukattaʿâta özel bölüm ayırdığı doğru, iyi bilinen bir olgu.

#### R354
- **Konum**: satır 154 (SourcesCitation)
- **Site iddiası (TR)**: "Mukattaa harfleri üzerine 20+ klasik görüşü sıralayan en kapsamlı klasik tefsir."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsirinin mukattaa harfleri üzerine çok sayıda (genellikle 20 civarı) klasik görüşü sıraladığı yaygın olarak bilinen bir özelliğidir.

#### R355
- **Konum**: satır 155 (SourcesCitation)
- **Site iddiası (TR)**: "Muʿtezilî belağî okuma — mukattaʿâtın dilsel işaret olarak yorumu."
- **Atfedilen kaynak**: ez-Zamahşerî, *el-Keşşâf*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin Mu'tezilî kimliği ve el-Keşşâf'ının mukattaʿâtı dilsel/belâgî işaret olarak okuması doğru bir karakterizasyon.

#### R356
- **Konum**: satır 156 (SourcesCitation)
- **Site iddiası (TR)**: "Selef görüşü — 'Allah bilir' tavrı ve rivayet ağırlıklı yaklaşım."
- **Atfedilen kaynak**: İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in mukattaa harfleri konusunda selef ("Allah bilir") tavrını benimsemesi ve rivayet ağırlıklı yaklaşımı, tefsirinin genel karakteriyle tutarlıdır.

## next/src/components/MunafikProfili.jsx

#### R357
- **Konum**: satır 658 (SourcesCitation)
- **Site iddiası (TR)**: "Münâfık tipolojisi — nifâkın küçük/büyük ayrımı."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *Medâricu's-Sâlikîn*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Web araştırması İbn Kayyım'ın Medâricu's-Sâlikîn'de nifakı büyük (itikadî) ve küçük (amelî) olarak ikiye ayırdığını doğruluyor; iddia doğru.

#### R358
- **Konum**: satır 659 (SourcesCitation)
- **Site iddiası (TR)**: "Münâfikûn sûresi tefsiri — esbâbu'n-nüzûl detayları."
- **Atfedilen kaynak**: el-Begavî, *Meâlimu't-Tenzîl*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Begavî'nin Meâlimu't-Tenzîl'inin Münâfikûn sûresi için esbâbu'n-nüzûl detayları içerdiği makul, ama sitenin verdiği tarih aralığı (1044–1117) yaygın kabul gören ölüm tarihiyle (516H/1122) tam örtüşmüyor — kesin hata denemez ama teyit belirsiz.

#### R359
- **Konum**: satır 660 (SourcesCitation)
- **Site iddiası (TR)**: "Münafık alâmetleri hadis-i şerifi (3 ayrı versiyon)."
- **Atfedilen kaynak**: İmam el-Buhârî, *Sahîh — Kitâbu'l-Îmân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Buhârî'nin Sahîh'inde Kitâbu'l-Îmân'da münafığın alâmetlerine dair üç işaretli (Hadis 33) ve dört işaretli varyantlar dahil birden fazla versiyon bulunduğu doğrulandı.

#### R360
- **Konum**: satır 661 (SourcesCitation)
- **Site iddiası (TR)**: "Münâfik psikolojisi — küfür vs nifâk arasındaki incelik."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsirinin küfür ile nifak arasındaki kelâmî inceliği işlemesi, eserin genel derin teolojik analiz karakteriyle tutarlıdır.

#### R361
- **Konum**: `public/munafik-profili.json` `typologies[0]` (satır 637-638)
- **Site iddiası (TR)**: "İbn Kayyim'e göre bu gerçek nifaktır... aynı tasnif Siracüddin el-Bulkînî ve İbn Receb el-Hanbelî'de de vardır."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye; Sirâceddin el-Bulkînî, İbn Receb el-Hanbelî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İbn Kayyım'ın Medâricü's-Sâlikîn'de nifâk-ı i'tikâdî/amelî ayrımı yapması doğru; "aynı tasnif Bulkînî ve İbn Receb'de de vardır" ek atfı bağımsız olarak doğrulanamadı.

## next/src/components/HalkaKompozisyon.jsx

> Bu bileşen ince bir rota sarmalayıcısı — 4 atıf, sayfanın **tüm** ana içeriğidir; asıl ring-kompozisyon iddiaları `RingExtensions.jsx`/`HiddenArchitecture.jsx`'te (bkz. R13–R22, R41-R42, R50).

#### R362
- **Konum**: satır 126 (SourcesCitation)
- **Site iddiası (TR)**: "Klasik münâsebât + sûre-içi tenâsüb — halka/simetri okumasının klasik zirvesi."
- **Atfedilen kaynak**: el-Bikâî, *Nazmü'd-Dürer fî Tenâsübi'l-Âyi ve's-Süver*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bikâî'nin eseri klasik tenâsüb/münâsebât literatüründeki en kapsamlı ve en çok atıf yapılan eserdir; "klasik zirve" nitelemesi akademik literatürle örtüşüyor.

#### R363
- **Konum**: satır 127 (SourcesCitation)
- **Site iddiası (TR)**: "Sûreler arası ve içi tenâsüb üzerine özel monografi."
- **Atfedilen kaynak**: es-Suyûtî, *Tenâsuku'd-Dürer fî Tenâsübi's-Süver*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Süyûtî'nin eseri gerçek ve tanınmış, esasen Bikâî'nin büyük eserinin sûreler-arası tenâsübe odaklanan bir özeti niteliğinde — "özel monografi" tasviri makul.

#### R364
- **Konum**: satır 128 (SourcesCitation)
- **Site iddiası (TR)**: "Klasik tefsirde tenâsübün ilk sistemli işleyicilerinden — halka yaklaşımının erken izleri."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin tefsiri âyetler arası münasebet konusuna sistemli biçimde eğilen erken klasik tefsirlerden biri olarak akademik literatürde (Neal Robinson) sıkça anılır; "erken izler" ifadesi ölçülü.

#### R365
- **Konum**: satır 129 (SourcesCitation)
- **Site iddiası (TR)**: "Halka kompozisyonun çağdaş metodolojik referansı — Fâtiha ve Bakara üzerine analiz."
- **Atfedilen kaynak**: Raymond Farrin, *Structure and Qur'anic Interpretation*, 2014
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Doğru: kitap araştırmasına göre Farrin'in 1. bölümü Fâtiha'yı ("Framing the Qur'an"), 2. bölümü Bakara'yı ("The Chapter as Unity") ele alıyor — bunlar kitabın açılış vakaları.

## next/src/components/NedenSonuc.jsx

#### R366
- **Konum**: satır 191-197 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ânî neden-sonuç zincirlerinin kelâmî çerçevesi; 'sünnetullah' bahsi ve ahlâki-teolojik zincirler."
- **Atfedilen kaynak**: er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Râzî'nin kelâmî derinliği ve sünnetullah temalarına değinmesi genel olarak doğru, ancak spesifik âyet/bölüm belirtmeden genel bir karakterizasyon; bağımsız doğrulaması zor.

#### R367
- **Konum**: satır 199-205 (SourcesCitation)
- **Site iddiası (TR)**: "Nefsî zincirlerin (sabır, şükür, tövbe, kibir) tasavvuf perspektifinden derin analizi."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *Medâricü's-Sâlikîn*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Medâricü's-Sâlikîn doğrudan sabır, şükür, tövbe gibi nefsî/tasavvufî makamları ele alan bir eserdir — kibir bahsi de mezmum sıfatlar kısmında işlenir. Atıf isabetli.

#### R368
- **Konum**: satır 207-213 (SourcesCitation)
- **Site iddiası (TR)**: "Toplumsal + tarihsel zincirlerin modern Kur'ânî sosyoloji çerçevesinden okunması."
- **Atfedilen kaynak**: Muhammed Bâkır es-Sadr, *Kurʾânî Sünnetler*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — "Kurʾânî Sünnetler" → gerçek başlık "es-Sünenü't-Târîhiyye fi'l-Kur'ân" (R240 ile aynı hata, orada da düzeltildi).

#### R369
- **Konum**: satır 215-221 (SourcesCitation)
- **Site iddiası (TR)**: "Rûm 30:41 çevresel ifsat zinciri için modern çevre-teolojik referans."
- **Atfedilen kaynak**: Seyyid Hüseyin Nasr, *İnsan ve Doğa*, 1968
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nasr'ın Man and Nature: The Spiritual Crisis of Modern Man (1968) doğru yazar/tarih; konu (çevre-teoloji) uyumlu.

## next/src/components/WowFacts.jsx

#### R370
- **Konum**: satır 1432-1438 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimlerinin klasik ansiklopedisi — sayısal örüntüler, dil özellikleri, retorik incelikler için temel başvuru."
- **Atfedilen kaynak**: es-Süyûtî, *el-İtkān fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-İtkān Kur'an ilimlerinin standart klasik ansiklopedisi olarak evrensel kabul görür; sayısal örüntü, dil, retorik konularını kapsar.

#### R371
- **Konum**: satır 1440-1446 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân ilimlerinin bir diğer klasik kompendyumu — mucize, tenâsüb, münâsebet ve dilsel örüntüler."
- **Atfedilen kaynak**: ez-Zerkeşî, *el-Burhân fî Ulûmi'l-Kurʾân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin eseri İtkān'dan önce gelen, i'câz/tenâsüb/münâsebet konularını içeren bir diğer klasik kompendyumdur.

#### R372
- **Konum**: satır 1448-1454 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân'ın geç antikite bağlamında tarihsel-edebi yapısını inceleyen çağdaş akademik referans."
- **Atfedilen kaynak**: Angelika Neuwirth, *The Qur'an and Late Antiquity*, 2019
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Neuwirth'in eseri (Oxford UP, 2019, 2010 Almanca orijinalinin çevirisi) tarih ve yayınevi tam örtüşüyor.

#### R373
- **Konum**: satır 1456-1462 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ân'ın halka-yapılı (ring) kompozisyonu, simetri ve chiasmus örüntüleri üzerine modern strukturel analiz."
- **Atfedilen kaynak**: Michel Cuypers, *The Composition of the Quran*, 2015
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Cuypers'in eseri (2015) halka kompozisyon/simetri/chiasmus konusu doğru tasvir edilmiş.

#### R374
- **Konum**: satır 600
- **Site iddiası (TR)**: "Hadis-i kudsîde Allah şöyle buyurur: 'Namazı kulumla aramda paylaştırdım; yarısı benim, yarısı kulumun...' (Müslim)."
- **Atfedilen kaynak**: Sahîh Müslim (hadis-i kudsî)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — "Namazı kulumla aramda paylaştırdım" hadis-i kudsîsi Sahîh Müslim'de yer alan, çok iyi bilinen sahih bir metindir.

#### R375
- **Konum**: satır 654
- **Site iddiası (TR)**: "İmam Şafii şöyle buyurdu: 'İnsanlar bu sûreyi iyice düşünseydi, bu onlara yeterdi.' (Beyhaki, Şuabu'l-İman)"
- **Atfedilen kaynak**: İmam eş-Şâfiî (el-Beyhakî'nin naklettiği)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Şâfiî'nin el-Asr sûresi sözü, Beyhakî'nin Şuabu'l-İman'ında nakledilen, İslâmî literatürde son derece yaygın ve tanınan bir alıntıdır.

#### R376
- **Konum**: satır 262-263
- **Site iddiası (TR)**: "Raymond Farrin'in araştırması pek çok sûrenin ring composition (halka) yapısına sahip olduğunu göstermektedir: A-B-C-Merkez-C'-B'-A'."
- **Atfedilen kaynak**: Raymond Farrin
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Genel, sayı iddia etmeyen bir ifade; Sinai'nin incelemesi Farrin'in tezini doğruluyor ("the entirety of Qur'an is organized according to... concentrism"). R449'daki gibi çürütülmüş bir "%70" istatistiği içermediği için savunulabilir.

#### R377
- **Konum**: satır 610
- **Site iddiası (TR)**: "Klasik tefsirde (Râzî, Kurtubî) ahlâkî bir çerçeve olarak okunmuştur; modern sosyoloji terminolojisiyle paralellik kurmak çağdaş bir okumadır." (Hucurât sûresi)
- **Atfedilen kaynak**: er-Râzî, el-Kurtubî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İddia zaten temkinli kurgulanmış — Râzî ve Kurtubî'nin Hucurât'ı ahlâkî çerçevede okuduğunu söylüyor, modern sosyoloji paralelinin çağdaş bir okuma olduğunu açıkça belirtiyor.

#### R378
- **Konum**: satır 566
- **Site iddiası (TR)**: "Klasik tefsirde 'nâsiye' rezalet ve zilletin mecazi sembolüdür — Taberi ve diğer müfessirler bu ifadeyi anatomiyle ilişkilendirmez." (alın/prefrontal korteks iddiası)
- **Atfedilen kaynak**: et-Taberî
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Taberî ve diğer klasik müfessirlerin "nâsiye"yi rezalet/zillet mecazı olarak okuduğu, anatomik bağlantı kurmadığı doğru; site prefrontal korteks iddiasını açıkça "çağdaş okuma" olarak ayırıyor.

#### R379
- **Konum**: satır 721
- **Site iddiası (TR)**: TR "Klasik tefsir (Kurtubî, Râzî) bu şifayı iki katmanda okur..." / EN "Classical exegesis (al-Qurṭubī, al-Rāzī) reads this healing at two levels..."
- **Atfedilen kaynak**: el-Kurtubî, er-Râzî
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Kurtubî ve Râzî'nin İsrâ 17:82'deki şifâyı ruhî-ahlâkî + bedensel olmak üzere iki katmanda okuması klasik tefsir geleneğinde genel olarak bilinen bir yaklaşım, ancak bu ikili çerçevenin bu iki müfessire özgü bir tasnif olduğu bağımsız olarak teyit edilemedi.

## next/src/components/EsmaFrekans.jsx

#### R380
- **Konum**: satır 3626-3632 (SourcesCitation)
- **Site iddiası (TR)**: "Esmâyı iştikak ve anlam tahlilleriyle ele alan erken dönem müstakil çalışmalardan biri."
- **Atfedilen kaynak**: ez-Zeccâc, *Tefsîru esmâillâhi'l-hüsnâ*, ö. 923
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Zeccâc'ın esmâ-i hüsnâ üzerine bir tefsir eseri olduğu doğru ama Wikipedia'nın eser listesinde bu başlık yer almıyor (liste eksik olabilir); ölüm tarihi kaynaklarda 922-928 arası değişiyor, "923" makul bir yuvarlama.

#### R381
- **Konum**: satır 3634-3640 (SourcesCitation)
- **Site iddiası (TR)**: "İsim ve sıfat bahislerini hadis rivayetleriyle derleyen erken dönem kaynaklardandır."
- **Atfedilen kaynak**: el-Beyhakî, *el-Esmâ ve's-sıfât*, ö. 1066
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Beyhakî'nin ölüm tarihi (1066/458H) doğrulandı; el-Esmâ ve's-sıfât'ın hadis-ağırlıklı, isim/sıfat bahislerini derleyen bir eser olduğu tasviri onun hadis hafızı kimliğiyle örtüşüyor.

#### R382
- **Konum**: satır 3642-3648 (SourcesCitation)
- **Site iddiası (TR)**: "Esmâ şerhi literatürünün en yaygın ve etkili klasiklerinden."
- **Atfedilen kaynak**: el-Gazâlî, *el-Maksadü'l-esnâ fî şerhi esmâillâhi'l-hüsnâ*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Gazâlî'nin el-Maksadü'l-esnâ'sı esmâ-i hüsnâ şerhi literatüründe en yaygın/etkili klasiklerden biri olarak evrensel kabul görür.

#### R383
- **Konum**: satır 3650-3656 (SourcesCitation)
- **Site iddiası (TR)**: "Müstakil bir esmâ şerhi değildir; ancak bazı bölümlerinde isim–sıfat–fiil ilişkisine dair kapsamlı tartışmalar yer alır."
- **Atfedilen kaynak**: İbnü'l-Kayyim el-Cevziyye, *Bedâi'u'l-fevâid*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Bedâi'u'l-fevâid'in müstakil bir esmâ şerhi olmadığı ama çeşitli teolojik/linguistik konuları ele alan bir derleme olduğu makul, ancak spesifik "isim-sıfat-fiil" tartışmasının bu eserde yer aldığı bağımsız doğrulanamadı.

#### R384
- **Konum**: satır 1388-1391, 3758-3761 ("Bu sayı nereden geliyor?")
- **Site iddiası (TR)**: "Klasik konkordans (M. Fuâd Abdülbâkî, el-Mu'cemü'l-Müfehres) lemma sayımı esas alır..." — sitenin "Allah" isminin 2.699 kez geçtiği iddiasının dayanağı.
- **Atfedilen kaynak**: Muhammed Fuâd Abdülbâkî, *el-Mu'cemü'l-Müfehres li-Elfâzi'l-Kur'âni'l-Kerîm*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Abdülbâkî'nin el-Mu'cemü'l-Müfehres'i klasik konkordans olarak doğru atıf; site "Allah=2.699" rakamının lemma-sayımı metodolojisinden kaynaklandığını doğru ve şeffaf biçimde izah ediyor.

## next/src/components/IbadetlerHub.jsx

#### R385
- **Konum**: `public/ibadetler/hub.json` `kaynaklar[0]`
- **Site iddiası (TR)**: "Sekiz sütunun klasik tefsir çerçevesi için ana referans. Fâtiha 1:5 'iyyâke naʿbudu' tefsirinde kulluğun semantik alanı..."
- **Atfedilen kaynak**: Fahruddîn er-Râzî, *Mefâtîhu'l-Ğayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin Fâtiha 1:5 "iyyâke na'budu" tefsirinde kulluğun semantik alanını genişçe işlediği bilinen bir gerçek.

#### R386
- **Konum**: `kaynaklar[1]`
- **Site iddiası (TR)**: "Sekiz sütunun fıkhî ahkâmı için başlıca kaynak. Klasik dört mezhep karşılaştırması ve icma noktaları."
- **Atfedilen kaynak**: Kurtubî, *el-Câmi' li-Ahkâmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kurtubî'nin eseri klasik dört mezhep karşılaştırmalı fıkhî tefsirlerin en tanınmışıdır — "fıkhî ahkâm için başlıca kaynak" tasviri isabetli.

#### R387
- **Konum**: `kaynaklar[2]`
- **Site iddiası (TR)**: "Modern Türkçe okuyucu için pedagojik çerçeve. İbadet kavramının felsefî-teolojik değerlendirmesi."
- **Atfedilen kaynak**: Elmalılı Hamdi Yazır, *Hak Dini Kur'ân Dili*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Elmalılı'nın eseri modern Türkçe tefsir geleneğinin standart referans eseridir; pedagojik/felsefî-teolojik çerçeve tasviri doğru.

#### R388
- **Konum**: `kaynaklar[3]`
- **Site iddiası (TR)**: "Kur'ân'ın ahlâkî-dinî terminolojisinin semantik alan çözümlemesi; 'God and Man' bölümünde ʿabd/ʿibāda ilişkisine değinir."
- **Atfedilen kaynak**: Toshihiko Îzutsu, *Ethico-Religious Concepts in the Qur'an*, 1966
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İzutsu'nun eseri (1966) gerçek ve konusu doğru, ANCAK "'God and Man' bölümünde ʿabd/ʿibāda ilişkisine değinir" ifadesi şüpheli — "God and Man in the Koran" (1964) bu kitaptan AYRI, bağımsız bir eserdir; bir bölüm olarak sunulması olası bir karıştırma.

## next/src/components/YakinAnlamliNuanslar.jsx

#### R389
- **Konum**: `public/yakin-anlamli-nuanslar.json` `sources[0]`
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî, *el-Müfredât fî Ğarîbi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — el-Müfredât Kur'an kelimelerinin semantik nüanslarını ele alan standart klasik sözlüktür — "yakın anlamlı nüanslar" aracı için doğal ve isabetli referans.

#### R390
- **Konum**: `sources[1]`
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *et-Tıbyân fî Eymâni'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kayyım'ın et-Tıbyân fî Eymâni'l-Kur'ân'ı Kur'an'daki yeminler üzerine gerçek ve tanınmış müstakil bir eserdir.

#### R391
- **Konum**: `sources[2]`
- **Atfedilen kaynak**: Fahreddin er-Râzî, *Mefâtîhu'l-Ğayb (Tefsîr-i Kebîr)*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Mefâtîhu'l-Ğayb'in "Tefsîr-i Kebîr" olarak da anıldığı doğru bir bilgi.

#### R392
- **Konum**: `sources[3]`
- **Atfedilen kaynak**: Toshihiko İzutsu, *God and Man in the Qurʾān / Ethico-Religious Concepts*, 1959-1966
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — "God and Man in the Koran" 1964'te, "Ethico-Religious Concepts" 1966'da yayımlandı; site "1959-1966" tarih aralığı veriyor — 1959 aslında üçüncü bir öncül esere ("The Structure of the Ethical Terms in the Koran") ait, iki başlığı tam temsil etmiyor.

## next/src/components/InsanPsikolojisi.jsx

#### R393
- **Konum**: satır 159-165 (SourcesCitation)
- **Site iddiası (TR)**: "İslâm ahlâk psikolojisinin klasik anıtı — nefsin hastalıkları + iyileşme yolları sistematik olarak."
- **Atfedilen kaynak**: Gazâlî, *İhyâ'u Ulûmi'd-Dîn*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İhyâ'u Ulûmi'd-Dîn (Rub'u'l-Mühlikât + Rub'u'l-Munciyât bölümleri) nefis hastalıkları ve iyileşme yollarını sistematik ele alan, İslâm ahlâk psikolojisinin en bilinen klasik eseridir.

#### R394
- **Konum**: satır 167-173 (SourcesCitation)
- **Site iddiası (TR)**: "Kalp hastalıkları ve manevî iyileşmenin adım-adım yolculuğu — 100+ makam üzerinden nefs analizi."
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *Medâricü's-Sâlikîn + Emrâzü'l-Kulûb*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Medâricü's-Sâlikîn'in İbn Kayyım'a ait olması doğru, ancak "Emrâzü'l-Kulûb ve Şifâuhâ" adlı kısa risalenin klasik bibliyografyada genellikle İbn Teymiyye'ye (hocasına) atfedildiği hatırlanıyor — bu bir olası yanlış-atıf şüphesi taşıyor, tam teyit edilemedi, insan doğrulaması önerilir.

#### R395
- **Konum**: satır 175-181 (SourcesCitation)
- **Site iddiası (TR)**: "Kur'ânî ahlâk kavramlarının felsefî-psikolojik açılımı — Gazâlî'nin doğrudan kaynaklarından biri."
- **Atfedilen kaynak**: er-Râgıb el-Isfahânî, *ez-Zerî'a ilâ Mekârimi'ş-Şerî'a*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İsfahânî'nin ez-Zerî'a'sının Gazâlî'nin doğrudan kaynaklarından biri olduğu İslâm ahlâk tarihi literatüründe iyi belgelenmiş bir bilgidir.

#### R396
- **Konum**: satır 183-189 (SourcesCitation)
- **Site iddiası (TR)**: "Aristo etik + Kur'ânî fıtrat sentezi — İslâm ahlâk psikolojisinin ilk sistemli eseri."
- **Atfedilen kaynak**: İbn Miskeveyh, *Tehzîbü'l-Ahlâk*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Miskeveyh'in Tehzîbü'l-Ahlâk'ı Aristo etiği ile İslâmî unsurları sentezleyen, İslâm ahlâk felsefesinin ilk sistemli eseri olarak yaygın biçimde tanımlanır.

#### R397
- **Konum**: satır 201-205 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "Kalp muhâsebesinin 4 aşamalı yöntemi — modern CBT'nin öz-gözlem katmanına 12 asır önce paralel."
- **Atfedilen kaynak**: el-Muhâsibî, *er-Riâye li-Ḥuḳûḳillâh*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Muhâsibî'nin eseri ve "muhâsebe" kavramı doğru, ancak "4 aşama: durum→düşünce→duygu→tepki" formülasyonu modern CBT terminolojisinin geri-yansıtılmış bir versiyonu gibi görünüyor — Muhâsibî'nin kendi aşamalandırmasının bu modern dörtlüyle birebir örtüştüğü doğrulanamadı.

#### R398
- **Konum**: satır 206-210 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "Kalbin 4 boyutu modeli: akıl + gazap + şehvet + rahmet — iç ekosistem."
- **Atfedilen kaynak**: el-Gazâlî, *İhyâʾu ʿUlûmi'd-Dîn*
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — R301 ile AYNI hata, farklı bir dosyada tekrarlanmış. Gazâlî'nin İhyâ'daki (Şerhu Acâibi'l-Kalb) gerçek dörtlü modeli: akıl/hikmet (**melek**), gazap (**köpek**), şehvet (**domuz**), ve kışkırtma/hile (**şeytan**). Site **şeytânî unsuru tamamen düşürmüş** ve yerine icat edilmiş bir "rahmet" unsuru koymuş. **Düzeltilmeli** — bu artık site genelinde tekrarlanan bir hata sınıfı (bkz. R301).

#### R399
- **Konum**: satır 211-215 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "3 mertebeli iyileşme yol haritası... modern pozitif psikolojinin 'flourishing' aşamalarına eşdeğer 15 basamak."
- **Atfedilen kaynak**: İbn Kayyim, *Medâricu's-Sâlikîn*
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR — Metnin kendi içinde tutarsızlık var: "3 mertebeli" deniyor ama 5 ayrı aşama sayılıyor (tevbe→sabr→şükür→rızâ→itmi'nân); "her mertebede 3 alt katman" ile "15 basamak" iddiası 5×3=15 ile tutarlı olur, 3×3=9 ile değil — sayılar birbirini tutmuyor. Ayrıca Medâricü's-Sâlikîn'in bilinen yapısı (Ensârî'nin Menâzilü's-Sâirîn şerhi) 100 makamdan oluşur; "15 basamak" çerçevesi kitabın gerçek yapısını yansıtmıyor. **Düzeltilmeli.**

#### R400
- **Konum**: satır 216-220 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "Nefs psikolojisinin kelâmî sistematiği... modern Freud'un id/ego/superego yapısına konsept-eş."
- **Atfedilen kaynak**: er-Râzî, *Kitâbu'n-Nefs ve'r-Rûh*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kitâbu'n-Nefs ve'r-Rûh'un Râzî'ye atfedilen bir eser olduğu doğrulandı; kuvve-i akliyye/gadabiyye/şehvâniyye üçlü nefs teorisi bilinen klasik bir çerçevedir. Freud analojisi açıkça modern analoji olarak sunulmuş, birebir eşitlik iddiası değil.

#### R401
- **Konum**: satır 221-225 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "İnsan nefsinin 5 içsel duyu (havâss-ı bâtına) analizi... modern nörobilim 'working memory + executive function' aynı katmanları tanımlar."
- **Atfedilen kaynak**: İbn Sînâ, *Kitâbu'n-Nefs (Şifâ)*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — İbn Sînâ'nın "5 iç duyu" kavramı gerçek ve doğru atfedilmiş, ancak sitenin listesi (hafıza, hayâl, vehm, tefekkür, muhâkeme) standart Avicennacı beşliyle (hiss-i müşterek, hayâl, vehm, hâfıza, mütehayyile) tam örtüşmüyor — "hiss-i müşterek" eksik, "muhâkeme" standart terminolojide yok.

#### R402
- **Konum**: satır 226-230 (`UlemaPsikolojiGrid`)
- **Site iddiası (TR)**: "Sosyal psikolojinin klasik metni: birey ↔ toplum + öz ↔ ideal etkileşim çerçeveleri."
- **Atfedilen kaynak**: Mâverdî, *Edebü'd-Dünyâ ve'd-Dîn*
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — Mâverdî'nin eseri gerçek ve sosyal davranış konularını içeriyor, ama doğrudan "sosyal psikolojinin klasik metni" diye nitelemek anakronistik — kitap esasen bir ahlâk/edeb risalesidir, teknik psikoloji literatürü değil.

---

# FOOTER, KAMU JSON DOSYALARI VE DENETİM DOKÜMANLARI

## next/src/i18n/tr.json ve en.json — `footer.sources[]` (satır ~790)

> Sitenin alt bilgisindeki 13 maddelik genel kaynakça — her madde bir bölümün "bu kaynağa dayanıyor" iddiası. Bazıları yukarıdaki bileşen içi atıflarla örtüşüyor (Farrin, Zemahşerî, Zerkeşî, Râzî), bazıları yalnız burada geçiyor (Corpus Coranicum, Leeds Corpus, Keith Moore, Bucaille, Birmingham elyazması, Tanzil).

#### R403
- **Konum**: `footer.sources[0]`
- **Site iddiası (TR)**: "Gizli Simetri · Halka Kompozisyon" bölümü bu esere dayanır.
- **Atfedilen kaynak**: Raymond Farrin, *Structure and Qur'anic Interpretation* (2014)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Farrin'in eseri gerçek; "Gizli Simetri · Halka Kompozisyon" bölümüyle ilişkilendirilmesi doğru ve site içinde tutarlı biçimde kullanılıyor.

#### R404
- **Konum**: `footer.sources[1]`
- **Site iddiası (TR)**: "Metin Analizi" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Corpus Coranicum — Berlin-Brandenburg Bilimler Akademisi (BBAW)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Corpus Coranicum, BBAW tarafından yürütülen gerçek bir akademik proje; "Metin Analizi" ile ilişkilendirilmesi makul.

#### R405
- **Konum**: `footer.sources[2]`
- **Site iddiası (TR)**: "Kelime Frekansları · Dilsel Analiz" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Quranic Arabic Corpus — University of Leeds
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Quranic Arabic Corpus, Leeds Üniversitesi'nde geliştirilmiş gerçek bir kaynak; "Kelime Frekansları · Dilsel Analiz" ile ilişkilendirilmesi doğru.

#### R406
- **Konum**: `footer.sources[3]`
- **Site iddiası (TR)**: "Bilimsel İşaretler · Embriyoloji" bölümü; not akademik tartışmayı işaret ediyor.
- **Atfedilen kaynak**: Dr. Keith L. Moore, *The Developing Human*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Moore'un The Developing Human'ı gerçek bir embriyoloji ders kitabı; footer notu akademik tartışmayı açıkça işaretliyor — apolojetik aşırılığa düşmüyor.

#### R407
- **Konum**: `footer.sources[4]`
- **Site iddiası (TR)**: "Bilimsel İşaretler" bölümü; not iddiaların ana akım bilimde tartışmalı olduğunu belirtiyor.
- **Atfedilen kaynak**: Dr. Maurice Bucaille, *The Bible, the Quran and Science*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bucaille'ın eseri gerçek; footer notu "akademik mainstream'de tartışmalıdır" diyerek doğru şekilde hedge ediyor.

#### R408
- **Konum**: `footer.sources[5]`
- **Site iddiası (TR)**: "Sıfır Gereksizlik" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Zemahşerî, *el-Keşşâf* (12. yy)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zemahşerî'nin el-Keşşâf'ı (öl. 1144) gerçek ve doğru tarihli; "Sıfır Gereksizlik" ile ilişkilendirilmesi makul.

#### R409
- **Konum**: `footer.sources[6]`
- **Site iddiası (TR)**: "İltifât · Belağat" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Zerkeşî, *el-Burhân fî Ulûmi'l-Kur'ân*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Zerkeşî'nin eseri iltifât dahil belâgat konularını kapsamlı işler — "İltifât · Belağat" atfı doğru.

#### R410
- **Konum**: `footer.sources[7]`
- **Site iddiası (TR)**: "Yaşayan Koruma" bölümü — elyazması metin istikrarı.
- **Atfedilen kaynak**: University of Birmingham Kur'ân Elyazması (2015)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Birmingham Üniversitesi Kur'an el yazması (2015, Codex Mingana 1572a) iyi belgelenmiş gerçek bir keşif; "Yaşayan Koruma" bağlamı doğru.

#### R411
- **Konum**: `footer.sources[8]`
- **Site iddiası (TR)**: "Hadis referansları (İhsan tanımı, İstikâmet hadisi)"
- **Atfedilen kaynak**: Sahîh-i Müslim; Tirmizî, *Sünen*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İhsan tanımı hadisi (Cibril hadisi) hem Buhârî hem Müslim'de geçer; İstikamet hadisi Müslim'de, benzer tema Tirmizî'de bulunur — atıf isabetli.

#### R412
- **Konum**: `footer.sources[9]`
- **Site iddiası (TR)**: "Yeminler · Kıssa Analizi · Helak-Suç Bağı" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: İbn Kayyim el-Cevziyye, *et-Tibyân fî Aksâmi'l-Kur'ân* + *Zâdü'l-Meâd*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kayyım'ın et-Tibyân'ı ve Zâdü'l-Meâd'ı gerçek eserler; "Yeminler · Kıssa Analizi · Helak-Suç Bağı" ile ilişkilendirilmesi tutarlı.

#### R413
- **Konum**: `footer.sources[10]`
- **Site iddiası (TR)**: "Nüzûl Sırası · Sebeb-i Nüzûl" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Celâluddin es-Süyûtî, *el-İtkân* + *Lübâbu'n-Nukūl*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Süyûtî'nin el-İtkân ve Lübâbü'n-Nukūl'ü "Nüzûl Sırası · Sebeb-i Nüzûl" konusunun standart klasik kaynaklarıdır.

#### R414
- **Konum**: `footer.sources[11]`
- **Site iddiası (TR)**: "Tefsir · Yedi Katman · Münâsebât" bölümü bu kaynağa dayanır.
- **Atfedilen kaynak**: Fahreddin er-Râzî, *Mefâtîhu'l-Gayb*
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Râzî'nin Mefâtîhu'l-Gayb'ı "Tefsir" bağlamında en tanınmış klasik kapsamlı tefsirlerden biridir; genel atıf isabetli.

#### R415
- **Konum**: `footer.sources[12]`
- **Site iddiası (TR)**: "Metin Doğrulama · Yaşayan Koruma" bölümü bu kaynaklara dayanır.
- **Atfedilen kaynak**: Tanzil Quran Text + Internet Archive Quran Manuscripts
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Tanzil Quran Text ve Internet Archive'daki Kur'an el yazmaları gerçek, yaygın kullanılan kaynaklardır; "Metin Doğrulama · Yaşayan Koruma" ile ilişkilendirilmesi doğru.

## next/public/tarihsel-kanitlar.json (10 kanıt + 6 âlim — bkz. ayrıca R23-R25)

#### R416
- **Konum**: `kanitlar[0]` id `firavun-cesedi` (Yûnus 10:92)
- **Site iddiası (TR)**: Firavun'un cesedinin ibret için korunması klasik tefsirde anlatılır; Deir el-Bahari kraliyet mumyaları (1881, Maspero) bu bağlamda anılır ama ayet belirli bir mumyayı işaret etmez; "kimse mumyalamayı bilmiyordu" argümanı yanlıştır — Herodot MÖ 5. yy'da zaten tarif etmişti.
- **Atfedilen kaynak**: İbn Kesîr; Maurice Bucaille (1976); Gaston Maspero (1889); Zahi Hawass — Sahar Saleem (2016); Herodot
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `firavun-cesedi` girdisi doğrudan okundu; sourcesTr katalogla birebir örtüşüyor, criticalNoteTr Herodot'un MÖ 5. yy'da mumyalamayı tarif ettiğini belirterek "kimse bilmiyordu" argümanını doğru şekilde çürütüyor.

#### R417
- **Konum**: `kanitlar[1]` id `haman-ismi` (Kasas 28:6,38; Ğâfir 40:24,36-37)
- **Site iddiası (TR)**: Hâmân'ın hiyeroglif metinlerdeki tartışmalı bir formla ("ha-mn-h") fonetik benzerliği bazı araştırmacılarca öne sürülmüştür — ispatlanmamış, tartışmalı hipotez.
- **Atfedilen kaynak**: İbn Kesîr; Hubert Grimme (1904); Erman-Grapow (1926-53); Elmalılı; Maurice Bucaille (1976)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `haman-ismi` girdisi okundu; Grimme/Erman-Grapow/Elmalılı/Bucaille atıfları JSON'da birebir mevcut, tartışmalı hipotez olduğu açıkça belirtiliyor.

#### R418
- **Konum**: `kanitlar[2]` id `rum-kehaneti` (Rûm 30:2-4)
- **Site iddiası (TR)**: Rûm sûresi ~615'te Bizans'ın yenik durumdayken "birkaç yıl içinde" galip geleceğini bildirir; 622-628 Herakleios karşı saldırısı ve 627 Ninova zaferiyle gerçekleşti.
- **Atfedilen kaynak**: İbn Kesîr; Taberî; Nicolai Sinai (2017); Walter Kaegi (2003); James Howard-Johnston (2010)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `rum-kehaneti` girdisinin sourcesTr'si katalogla eşleşiyor; ~615 nüzul tarihi, Herakleios'un 622-628 karşı saldırısı tarihsel olarak doğru.

#### R419
- **Konum**: `kanitlar[3]` id `iram-sehri` (Fecr 89:6-8)
- **Site iddiası (TR)**: 1990'larda Nicholas Clapp + arkeolog Juris Zarins ekibi Umman'daki Şisr'de bir kervan durağı buldu (yerel adı "Ubar") — "Ubar = İrem" özdeşliği hipotezdir, kesinleşmemiştir.
- **Atfedilen kaynak**: İbn Kesîr; Nicholas Clapp (1998); Juris Zarins raporları (1990'lar); Ranulph Fiennes (1992)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `iram-sehri` — Clapp (1998), Zarins raporları, Fiennes (1992) doğru başlık/yıllarla eşleşiyor; "Ubar = İrem" özdeşliğinin hipotez düzeyinde olduğu criticalNote'ta açıkça belirtiliyor.

#### R420
- **Konum**: `kanitlar[4]` id `ashabu-uhdud` (Bürûc 85:4-8)
- **Site iddiası (TR)**: MS 523'te Yemen kralı Zû Nuvâs döneminde Necran Hristiyanlarının katledilmesiyle ilişkilendirilir; Sabaean epigrafisi (Ry 507, Ry 508, Ja 1028) ve Süryani/Bizans kaynakları (Prokopios, Simeon of Beth Arsham) bağımsız olarak doğrular.
- **Atfedilen kaynak**: İbn Kesîr; İbn İshâk; Christian Robin (2003, 2013); Iwona Gajda (2009)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `ashabu-uhdud` — Robin (2003, 2013) ve Gajda (2009) atıfları gerçek akademik yayınlar; MS 523 Necran katliamı tarihsel olarak iyi belgelenmiş.

#### R421
- **Konum**: `kanitlar[5]` id `ashabu-kehf` (Kehf 18:9-26)
- **Site iddiası (TR)**: 5. yy Bizans-Süryani "Efes'in Yedi Uyuyanları" geleneğiyle belgelidir; 1927'de Avusturyalı arkeologlar Efes'te ilgili mağara-mezarlığı kazdı.
- **Atfedilen kaynak**: İbn Kesîr; Elmalılı; Gregory of Tours (594); Sidney Griffith (2013); Karl Reber kazı raporları (1927+); Michael Marx (2005)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `ashabu-kehf` — Efes'in Yedi Uyuyanları geleneği, 1927 Avusturya kazıları gerçek; Griffith (2013) doğru atıf.

#### R422
- **Konum**: `kanitlar[6]` id `karnayn` (Kehf 18:83-101) — güven düzeyi "tartışmalı"
- **Site iddiası (TR)**: Zülkarneyn'in kimliği tartışmalıdır: klasik çoğunluk (Taberî, Kurtubî, İbn Kesîr) Büyük İskender'le özdeşleştirir; 20. yy modern müfessirler (Mevdûdî, Elmalılı, Abul Kalam Azad) Kiros'u önerir.
- **Atfedilen kaynak**: İbn Kesîr, Elmalılı, Mevdûdî, Abul Kalam Azad (1930'lar); Kevin van Bladel (2008)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `karnayn` — confidence="tartismali" doğru etiketlenmiş; İskender/Kiros ayrımı ve van Bladel (2008) atfı akademik literatürle uyumlu, iki tarafı da dayatmıyor.

#### R423
- **Konum**: `kanitlar[7]` id `semud-medaini-salih` (A'râf 7:73-79; Fecr 89:9)
- **Site iddiası (TR)**: Meda'in Salih'teki kaya-mezarlar görsel paralellik sunar — ancak Nabatîler tarafından (MÖ 1.-MS 1. yy) inşa edilmiştir; "Semûd → Nabatî" kültürel süreklilik olarak yorumlanmalı, birebir inşa iddiası değil.
- **Atfedilen kaynak**: İbn Kesîr; Charles Doughty (1888); Alois Musil (1926); UNESCO (2008); Michael Macdonald (2010)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `semud-medaini-salih` — Meda'in Salih'in Nabatî dönemine ait olduğu, "Semûd bizzat inşa etti" değil kültürel paralellik iddiası criticalNote'ta doğru belirtilmiş; UNESCO 2008 kaydı doğru.

#### R424
- **Konum**: `kanitlar[8]` id `en-yakin-yer` (Rûm 30:3)
- **Site iddiası (TR)**: "Edne'l-ard" kelimesi hem "en yakın" hem "en alçak" anlamı taşır (tevriye); savaş bölgesi hem Bizans'ın Mekke'ye en yakın toprağı hem Ölü Deniz ile dünyanın en alçak kara noktası.
- **Atfedilen kaynak**: İbn Kesîr; Elmalılı; Zemahşerî; Maurice Bucaille (1976)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `en-yakin-yer` — "edne'l-ard" ikili anlamı klasik belâgat kapsamında savunulabilir; "Kur'an topografyayı önceden biliyordu" aşırı iddiası criticalNote'ta açıkça reddediliyor.

#### R425
- **Konum**: `kanitlar[9]` id `kuran-korunmasi` (Hicr 15:9) — güven düzeyi "kesin"
- **Site iddiası (TR)**: 2015'te bulunan Birmingham Kur'ân folyoları (Codex Mingana 1572a), Oxford Radiocarbon Accelerator Unit tarafından %95 güvenle MS 568-645'e tarihlendi.
- **Atfedilen kaynak**: David Thomas — Alba Fedeli (2015); Behnam Sadeghi — Uwe Bergmann (2010); François Déroche (2014); Nicolai Sinai (2017)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Birmingham el yazması MS 568-645 tarihlemesi (%95 güven) iyi belgelenmiş gerçek bir bulgu; Sadeghi-Bergmann (2010, Arabica 57) ve Déroche (2014) atıfları doğru bibliyografik detaylarla eşleşiyor.

#### R426
- **Konum**: `scholars[0]` id `ibn-kesir`
- **Atfedilen kaynak**: İbn Kesîr, *Tefsîru'l-Kur'âni'l-Azîm* — "Tarihsel İzler" için geleneksel otorite
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — İbn Kesîr'in (1301-1373) klasik tefsir otoritesi olarak konumlandırılması ve tarihlerin doğruluğu doğrulandı; JSON'daki insightTr katalog iddiasıyla birebir örtüşüyor.

#### R427
- **Konum**: `scholars[1]` id `christian-robin`
- **Atfedilen kaynak**: Christian Robin — "geç antik Yemen/Kuzey Arabistan epigrafisinde dünya çapında uzman" iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Christian Robin gerçek ve tanınmış bir Fransız epigrafist/Yemen-Arabistan uzmanı; "dünya çapında uzman" iddiası akademik itibariyle tutarlı.

#### R428
- **Konum**: `scholars[2]` id `nicolai-sinai`
- **Atfedilen kaynak**: Nicolai Sinai, *The Qur'an: A Historical-Critical Introduction* (2017) — "Batı akademik konsensüsü"nü temsil ettiği iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Nicolai Sinai, Oxford'da Islamic Studies profesörü ve eseri gerçek, tanınmış bir akademik kitap; "batı akademik konsensüsü" temsili makul.

#### R429
- **Konum**: `scholars[3]` id `francois-deroche`
- **Atfedilen kaynak**: François Déroche, *Qur'ans of the Umayyads* — Kur'ân paleografisinin öncüsü iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Déroche, Collège de France'da Kur'an paleografisi profesörü, gerçek ve alanın önde gelen ismi; eseri gerçek.

#### R430
- **Konum**: `scholars[4]` id `maurice-bucaille`
- **Site iddiası (TR)**: Bucaille'ın (1976) metodolojisi Neuwirth &amp; Sinai tarafından zayıf/tartışmalı olarak eleştirildiği açıkça belirtiliyor.
- **Atfedilen kaynak**: Maurice Bucaille (1976) — sitenin kendisi metodolojik zayıflığı işaretliyor
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `maurice-bucaille` scholar girdisinin criticalTr alanı doğrudan okundu — Neuwirth ve Sinai'nin "Kur'ân önceden bildi" argümanını reddettiği açıkça yazılı; katalog iddiası birebir doğrulandı.

#### R431
- **Konum**: `scholars[5]` id `elmalili`
- **Atfedilen kaynak**: Elmalılı Hamdi Yazır, *Hak Dini Kur'an Dili* (1935-38) — klasik tefsir ile modern arkeolojiyi köprüleyen figür iddiası
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Elmalılı'nın eseri (1935-1938) gerçek ve doğru tarihli; "klasik-modern köprü" karakterizasyonu JSON'daki diğer girdilerle tutarlı.

## Diğer public/*.json dosyaları

#### R432
- **Konum**: `next/public/yakin-anlamli-nuanslar.json` `sets[]` (10 küme: kalb-fuâd-sadr, insan-beşer-nâs, ilm-hikmet-fıkh, havf-haşyet-rehbet, rızık-rahmet-bereket, hidayet-rüşd-tevfik, gafûr-afüvv-halîm, sabr-cemîl-musâbere, takvâ-birr-ihsan, cehennemin-beş-ismi)
- **Site iddiası (TR)**: Her yakın-anlamlı kelime kümesinin nüans iddiası (örn. "Sadr en dış, kalb orta, fu'âd en iç") ayrı ayrı klasik sözlük/tefsir maddelerine atfediliyor.
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Müfredât*, kök-bazlı), İbn Kayyim (*et-Tıbyân*, *ed-Dâʾ ve'd-Devâ*, *Medâricü's-Sâlikîn* vd.), Gazâlî (*İhyâ*, *el-Maksadü'l-Esnâ*), Râzî (*Mefâtîh*), Toshihiko İzutsu (insân/beşer/nâs kümesi için)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (örneklem bazlı) — `yakin-anlamli-nuanslar.json` doğrudan okundu; üst-seviye `sources[]` katalogla eşleşiyor, spesifik küme içi `sourceTr` alanlarında (kalb-fuâd-sadr, gafûr-afüvv-halîm) doğrulandı. Tüm 10 kümenin klasik alıntılarının birebir kaynak metinle örtüştüğü doğrulanmadı.

#### R433
- **Konum**: `next/public/belagat-aileleri.json` `kaynaklar[]` (8 kayıt)
- **Site iddiası (TR)**: Sitenin belâgat ailesi taksonomisinin dayandığı 8 klasik/modern referans.
- **Atfedilen kaynak**: Câhız (*el-Beyân ve't-Tebyîn*), Cürcânî (*Delâʾilü'l-Iʿcâz*), Zemahşerî (*el-Keşşâf*), Sekkâkî (*Miftâḥu'l-ʿUlûm*), Fahreddin er-Râzî; Abdul Haleem (BSOAS 1992), Angelika Neuwirth (1981/2007), Michael Sells (1999)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `belagat-aileleri.json` `kaynaklar[]` doğrudan okundu — 8 kayıt tarih ve eser adları bibliyografik olarak doğru; Abdul Haleem'in makalesi gerçek ve iltifâtı akademiye yeniden tanıtan öncü çalışma olarak bilinir.

#### R434
- **Konum**: `next/public/belagat-aileleri.json` `aileler[]` (5 aile: iltifât, tibâk/muḳâbele, istiʿâre/teşbih, kinâye, cinâs)
- **Site iddiası (TR)**: örn. "İbn Kuteybe iltifâtı 'kelâmın en belâgatlı özelliği' diye niteler"; "İbnu'l-Muʿtezz cinâsı 5 kategoriye ayırır."
- **Atfedilen kaynak**: İbn Kuteybe, Cürcânî, Zemahşerî, Sekkâkî, Câhız, İbnu'l-Muʿtezz, Râzî (klasik); Abdul Haleem, Angelika Neuwirth, Mustansir Mir (1986), Lakoff &amp; Johnson (1980), Kevin van Bladel, Karen Bauer, Michael Sells (modern)
- [x] Kaynakla birebir örtüşüyor mu? → ❓ DOĞRULANAMADI — İbn Kuteybe'nin iltifâtı öne çıkardığı genel olarak *Te'vîlü Müşkili'l-Kur'ân*'daki bilgiyle uyumlu ama tam alıntı doğrulanamadı. İbnu'l-Mu'tezz'in cinâsı 5 kategoriye ayırdığı iddiası teyit edilemedi — bu tasnif klasik literatürde daha çok sonraki sistemleştiricilere (Sekkâkî/Kazvînî) ait olabilir; klasik Arapça birincil kaynağa erişim sınırlı.

#### R435
- **Konum**: `next/public/sebeb-i-nuzul.json` `scholars[]` (3 kayıt)
- **Atfedilen kaynak**: Alî b. Ahmed el-Vâhidî (*Esbâbu'n-Nüzûl*, ö. 1075, "disiplinin kurucusu"); Celâleddîn es-Süyûtî (*Lübâbü'n-Nukūl*, ö. 1505); İbn Cerîr et-Taberî (*Câmiʿu'l-Beyân*, ö. 923)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `sebeb-i-nuzul.json` `scholars[]` doğrudan okundu — Vâhidî, Süyûtî, Taberî tarihleri doğru; Taberî'nin müstakil bir esbâb-ı nüzûl eseri yazmadığı ama tefsirinde zengin materyal barındırdığı ayrıntısı tarihsel olarak isabetli ve dürüst bir nüans.

#### R436
- **Konum**: `next/public/sebeb-i-nuzul.json` `occasions[]` (30 kayıt, her biri `source` + `reliability` alanı taşıyor — İfk Hadisesi, Kıble değişimi, Zıhâr, Âbese, içki yasağı, hicâb, miras, cizye, faiz yasağı, Âyetü'l-Kürsî bağlamı, ilk/son vahiy, Tebbet, Kevser-abtar, Zeyneb evliliği, Fetih, Mâide 5:3, hilâl sorusu, zina cezası vb.)
- **Site iddiası (TR)**: Her nüzul sebebi anlatısı belirli hadis koleksiyonlarına/klasik esbâb eserlerine atfedilip sahih/hasan/meşhur olarak derecelendiriliyor.
- **Atfedilen kaynak**: Buhârî, Müslim, Tirmizî, Vâhidî, Süyûtî, İbn Abbâs, Taberî, İbn Merdûye, İbn İshâk, Râzî, Zemahşerî, Kurtubî (30 kayıt boyunca dağılmış)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (örneklem bazlı) — `occasions[]`'ın tam listesi (30 kayıt) çıkarıldı; her kayıt `source` + `reliability` taşıyor ve dereceler mantıklı dağılmış (ör. Kevser-Ebter → Vâhidî+Râzî+Zemahşerî → "meşhur", İfk Hadisesi → Buhârî+Müslim+Vâhidî → "sahih"). Yapı iddiayla birebir örtüşüyor; tek tek hadis metinlerinin isnad seviyesi doğrulanmadı.

#### R437
- **Konum**: `next/public/surah-connections.json` `scholars[]` (8 kayıt)
- **Atfedilen kaynak**: Ebû Bekr en-Neysâbûrî (kurucu, ö. 936); Fahreddîn er-Râzî (ö. 1210, "münâsebâtı sistematik uygulayan ilk büyük müfessir" iddiası); Ebû Hayyân el-Endelüsî (ö. 1344); Burhâneddîn el-Bikā'î (ö. 1480); Celâleddîn es-Süyûtî (ö. 1505); Muhammed Abduh (ö. 1905); Emîn Ahsen Islahî (ö. 1997); Fâzıl Sâlih es-Sâmerrâî (çağdaş)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `surah-connections.json` `scholars[]` doğrudan okundu — 8 kayıt tarihleri ve eser adları doğru; Bikâ'î'nin Nazmü'd-Dürer'inin 22 cilt olması ve Islâhî'nin 7 grup teorisi bibliyografik olarak isabetli.

#### R438
- **Konum**: `next/public/surah-connections.json` `connections[]` (16 sûre-çifti bağlantısı, örn. Fâtiha-Bakara, Hicr-Nahl, Zümer-Mümin, Rahmân-Vâkıa, Mülk-Kalem, Nebe-Naziat trio)
- **Site iddiası (TR)**: Her yapısal sûre bağlantısı belirli bir klasik âlime (bazen doğrudan alıntıyla) atfediliyor, örn. Fâtiha-Bakara bağlantısı Râzî/Bikā'î/Süyûtî'ye, Hicr-Nahl Bikā'î'nin *Nazmü'd-Dürer*'ine.
- **Atfedilen kaynak**: Râzî, Bikā'î, Süyûtî (16 bağlantı boyunca tekrarlanan doğrudan alıntılarla)
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — `connections[]` (16 kayıt) doğrudan okundu; her bağlantı `sources[]` taşıyor, 6 kaydın doğrudan bir `quote` alanı var (ör. Fâtiha-Bakara bağlantısı için Râzî'ye atfedilen alıntı, kaynak: Mefâtîhu'l-Ğayb). Yapı ve atıf mantığı tutarlı ve makul, ama doğrudan alıntıların birebir Mefâtîhu'l-Ğayb/Nazmü'd-Dürer metniyle örtüştüğü doğrulanamadı — klasik Arapça kaynaklara dijital erişim sınırlı.

#### R439
- **Konum**: `next/public/munafik-profili.json` satır ~641 (`authenticHadith.source`)
- **Site iddiası (TR)**: "Münâfığın alâmeti üçtür: konuştuğunda yalan söyler, vaad verdiğinde sözünde durmaz, emanet edildiğinde hıyanet eder" — Ebû Hüreyre'den, müttefakun aleyh.
- **Atfedilen kaynak**: Buhârî (Îmân 24, #33); Müslim (Îmân 107, #59); Tirmizî (Îmân 14)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — `munafik-profili.json` `authenticHadith` alanı doğrudan okundu — hadis Ebû Hüreyre'den, Buhârî (Îmân 24, #33) ve Müslim (Îmân 107, #59)'de gerçekten geçen, müttefekun aleyh olarak bilinen sahih bir hadis.

#### R440
- **Konum**: `next/public/word-groups.json` `principles[]` (32 kayıt — yakın-anlamlı kelime çiftleri arası nüans iddiaları)
- **Site iddiası (TR)**: örn. "Havf hareket üretir, haşye sakinlik üretir" → İbn Kayyım; "Rîh (tekil) azap, riyâh (çoğul) rahmet" → Süyûtî; "Sırât tektir, sübül çoktur" → Râgıb el-İsfahânî.
- **Atfedilen kaynak**: er-Râgıb el-İsfahânî (*el-Müfredât*, en sık), es-Süyûtî (*el-İtkân*), Ebû Hilâl el-Askerî (*el-Furûk fi'l-Lüga*), İbn Kayyım el-Cevziyye (32 kayıt boyunca dağılmış)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (örneklem bazlı) — `principles[]` (32 kayıt) tam listesi çıkarıldı; dağılım katalogdaki iddiayla örtüşüyor (baskın kaynak İsfahânî ~13 kayıt, ardından el-Askerî, Süyûtî, İbn Kayyım, birkaçı isimsiz "klasik gelenek" — dürüst bir belirsizlik kabulü). Örnek kayıtlar tutarlı; tek tek 32 iddianın kaynak metinle birebir örtüştüğü doğrulanmadı.

## next/public/elestirel-cerceve.json — `questions[]` (8 hassas/apolojetik konu)

> `ElestirelCerceve.jsx`'in SourcesCitation bloğu (R315-318) yalnızca 4 genel eseri listeliyor; bu dosyadaki her soru kendi klasik+modern kaynak çiftini taşıyor — çok daha yüksek yoğunlukta adlandırılmış modern akademik kaynak içeriyor.

#### R441
- **Konum**: `questions[0]` id `miras-esitsizligi` (Nisâ 4:11)
- **Site iddiası (TR)**: "Kadına neden yarım miras payı?" sorusunun klasik+modern kaynak çifti.
- **Atfedilen kaynak**: Klasik: er-Râzî, el-Kurtubî. Modern: Fazlur Rahman (1982); Khaled Abou El Fadl (2006)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — R315/R316 ile aynı hatalar burada da vardı (elestirel-cerceve.json'daki paralel kayıt); ikisi de aynı oturumda düzeltildi.

#### R442
- **Konum**: `questions[1]` id `nisa-4-34-dovme`
- **Site iddiası (TR)**: Nisâ 4:34'teki "dövme" ifadesinin nasıl okunacağı sorusu.
- **Atfedilen kaynak**: Klasik: er-Râzî, İbn Kesîr. Modern: Laleh Bakhtiar (2007, ḍ-r-b'yi "uzaklaşmak" olarak çevirir); Kecia Ali (2006)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Bakhtiar'ın The Sublime Quran (2007) çevirisinde ḍ-r-b'yi "go away" olarak çevirdiği iyi belgelenmiş, tanınan bir çeviri tercihidir; Kecia Ali (2006) doğru bibliyografik detay.

#### R443
- **Konum**: `questions[2]` id `kolelik-tedrici`
- **Site iddiası (TR)**: Kölelik neden doğrudan kaldırılmadı sorusu.
- **Atfedilen kaynak**: Klasik: eş-Şâfiî. Modern: Jonathan A. C. Brown (2019); Bernard K. Freamon (2019); William Clarence-Smith (2006)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Brown'un Slavery and Islam (2019), Freamon'ın Possessed by the Right Hand (2019), Clarence-Smith'in Islam and the Abolition of Slavery (2006) — üçü de gerçek, doğru yıl/yayınevi ile eşleşen akademik eserler.

#### R444
- **Konum**: `questions[3]` id `cizye-vatandaslik`
- **Site iddiası (TR)**: Cizye — Ehl-i Kitap ikinci sınıf mı sorusu.
- **Atfedilen kaynak**: Klasik: Ebû Yûsuf. Modern: Mark R. Cohen (1994); Yohanan Friedmann (2003)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Ebû Yûsuf'un Kitâbü'l-Harâc'ı ve Hârûn Reşîd döneminde başkadılık yaptığı doğru; Cohen'in Under Crescent and Cross (1994) ve Friedmann'ın Tolerance and Coercion in Islam (2003) gerçek eserler.

#### R445
- **Konum**: `questions[4]` id `nuh-tufani-global-mi`
- **Site iddiası (TR)**: Nuh tufanı küresel mi bölgesel mi sorusu; Leonard Woolley'nin Ur kazılarındaki 3.5m alüvyon katmanı bölgesel-tufan kanıtı olarak anılıyor.
- **Atfedilen kaynak**: Klasik: el-Kurtubî, es-Süyûtî. Modern: Süleyman Ateş (1988); Leonard Woolley (1929-34)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Süleyman Ateş'in Yüce Kur'ân'ın Çağdaş Tefsiri (1988) ve Leonard Woolley'nin Ur kazıları (1929-1934) doğru; "~3.5m alüvyon" rakamı Woolley'nin raporlarındaki (2.5-3.5m aralığı) değerlerle tutarlı.

#### R446
- **Konum**: `questions[5]` id `bilim-onceleme`
- **Site iddiası (TR)**: Kur'an bilimi önceden mi haber verdi — İ'câzü'l-İlmî eleştirisi.
- **Atfedilen kaynak**: Klasik: er-Râzî. Modern: Nidhal Guessoum (2011); Ziauddin Sardar (2011); Fazlur Rahman (1980)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Guessoum'un Islam's Quantum Question (2011), Sardar'ın Reading the Qur'an (2011), Fazlur Rahman'ın Major Themes of the Qur'an (1980) — üçü de gerçek, doğru bibliyografik eşleşme.

#### R447
- **Konum**: `questions[6]` id `cinsel-yonelim-lut`
- **Site iddiası (TR)**: Cinsel yönelim ve Lut kavmi sorusu.
- **Atfedilen kaynak**: Klasik: İbn Kesîr. Modern: Scott Siraj al-Haqq Kugle (2010); Kecia Ali (2006)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR — Kugle'nin Homosexuality in Islam (2010) ve Ali'nin Sexual Ethics and Islam (2006) gerçek, doğru yıl/yayınevi ile eşleşen akademik eserler.

#### R448
- **Konum**: `questions[7]` id `muhkem-mutesabih-hangisi`
- **Site iddiası (TR)**: Muhkem-müteşâbih ayrımı hangi ayete uygulanır sorusu.
- **Atfedilen kaynak**: Klasik: er-Râzî, ez-Zerkeşî. Modern: Mohammed Arkoun (1994); Farid Esack (1997)
- [x] Kaynakla birebir örtüşüyor mu? → ✅ **DÜZELTİLDİ** — "Rethinking the Qur'an" başlığı Arkoun'un gerçek 1994 eseri "Rethinking Islam: Common Questions, Uncommon Answers" ile değiştirildi (Türkçe başlık da "İslam'ı Yeniden Düşünmek" olarak düzeltildi).

# DENETİM DOKÜMANLARINDAN GÜNCEL/AÇIK BULGULAR (docs/reviews/)

> `docs/reviews/*.md` çoğunlukla iç süreç/checklist belgeleri; ancak birkaçı sitede hâlâ yaşayabilecek somut atıf sorunlarını belgeliyor. Bunlar Faz 2 için özellikle önceliklendirilmeli.

#### R449
- **Konum**: `docs/reviews/2026-04-19-content-review.md` bulgusu — hangi sayfada olduğu doğrulanmalı (muhtemelen HiddenArchitecture.jsx/homeCards.js civarı)
- **Site iddiası (TR)**: "Ring composition — Kur'an surelerinin %70'i bu yapıyı taşıyor" iddiası Raymond Farrin'e atfedilmiş.
- **Atfedilen kaynak**: Raymond Farrin — **denetim raporu bu istatistiğin Farrin'in 2014 kitabında GEÇMEDİĞİNİ, yani muhtemelen uydurma olduğunu belirtiyor.** Sitede hâlâ var mı kontrol edilmeli.
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (iddia zaten kaldırılmış) — `grep -rn "70%"` ile next/src ve next/public'te Farrin/ring/halka bağlamında hiçbir "%70" ifadesi bulunamadı — uydurma istatistik kod tabanından çıkarılmış. Sinai'nin akademik incelemesi de böyle bir yüzdeyi hiç zikretmiyor. Faz 2 için ek aksiyon gerekmiyor.

#### R450
- **Konum**: `TarihselCard.jsx:122` (anasayfa kartı) — `docs/reviews/2026-07-26-icaz-ikinci-tarama.md` bulgusu
- **Site iddiası (TR)**: "Hâmân ismi... 1799'da Rosetta Taşı'na kadar bilinmiyordu."
- **Atfedilen kaynak**: **Hiçbir kaynak verilmiyor** — ve kodda Hâmân'la ilgili asıl atıf (Grimme 1904 / Erman-Grapow 1926) Rosetta Taşı/Champollion ile değil, farklı bir hipoteze dayanıyor; iddia kendi kaynağıyla çelişiyor.
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (sorun giderilmiş) — `TarihselCard.jsx` artık kod tabanında yok (muhtemelen TarihselKanitlar.jsx'e refactor edildi). Güncel i18n metni ("Rosetta Taşı (1799) → Champollion (1822) ile hiyeroglifler çözüldü") 1799'u (taşın bulunuşu) 1822'den (Champollion'un çözümü) doğru ayırıyor. Hâmân paralelliği artık Grimme (1904)/Erman-Grapow (1926) kaynaklı ve mainstream Mısıroloji'nin reddettiği açıkça belirtilerek sunuluyor — çelişki artık yok.

#### R451
- **Konum**: `next/public/tarihsel-kanitlar.json` giriş bloğu — `docs/reviews/2026-07-26-icaz-ikinci-tarama.md` bulgusu
- **Site iddiası (TR)**: Giriş bloğu "Hâmân isminin hiyeroglifik doğrulanması" ve "İrem şehrinin çöl altındaki keşfi" gibi kesinlik ifade eden dille yazılmış — ama aynı dosyanın madde-seviyesi `criticalNote`'ları (R417, R419) bu iki iddiayı "muhtemel"/"hipotez" olarak nitelendiriyor.
- **Atfedilen kaynak**: İç tutarsızlık — giriş bloğu vs. madde detayları
- [x] Kaynakla birebir örtüşüyor mu? → ✅ EŞLEŞİYOR (sorun giderilmiş) — `tarihsel-kanitlar.json` giriş bloğu incelendi: "Kur'ân'ın doğruluğu hiçbir dış teyide muhtaç değildir" gibi net hedge'ler var. Madde seviyesinde Hâmân "muhtemel", İrem "muhtemel", Karnayn "tartışmalı" güven etiketleri taşıyor — R451'in tarif ettiği çelişki artık gözlenmiyor.

#### R452
- **Konum**: `next/src/sections/SoundArchitecture.jsx` — bkz. **R38** — `docs/reviews/2026-07-26-icaz-apolojetik-site-taramasi.md` bulgusu
- **Site iddiası (TR)**: "Kur'an'ın nazmı... Sesin diziminde bile bir mucize taşır" el-Bâkıllânî'ye doğrudan alıntı olarak sunuluyor.
- **Atfedilen kaynak**: Ebû Bekir el-Bâkıllânî, *İ'câzü'l-Kur'an* — **denetim raporu bu alıntının birebir mi yoksa parafraz mı olduğunun teyit edilmediğini belirtiyor.**
- [x] Kaynakla birebir örtüşüyor mu? → ⚠️ KISMEN EŞLEŞİYOR — R38 ile aynı bulgu. `soundArchitecture.classicalSource` alanı artık "Bâkıllânî'ye göre" dili kullanıyor (birebir alıntı iddiası değil), ama görsel sunum (dev tırnak işareti + "Klasik Tanıklık" etiketi) hâlâ doğrudan-alıntı izlenimi bırakıyor; orijinal Arapça metinle karşılaştırma yapılamadı.

#### R453
- **Konum**: `next/public/tafsir/elmalili/*.json` (114 sûrenin tamamı, `TafsirPanel.jsx` üzerinden render ediliyor) — `docs/reviews/2026-05-11-tafsir-elmalili-audit.md`
- **Site iddiası (TR)**: Sitedeki ayet-başına-tefsir özelliğinin tamamı bu tek esere dayanıyor (enfal.de'den kazınmış).
- **Atfedilen kaynak**: Elmalılı Hamdi Yazır, *Hak Dini Kur'an Dili*
- [x] Kaynakla birebir örtüşüyor mu? → ❌ UYUŞMUYOR (katalog iddiası artık güncel değil) — `TafsirPanel.jsx` incelendiğinde site artık TEK esere değil, İKİ tefsir kaynağına dayanıyor: Elmalılı (TR) VE Ibn Kathir (İngilizce özet, `public/tafsir/ibnkathir-en/`) — ikisi de 114/114 sûre için tam veri içeriyor, canlı bir kaynak seçici üzerinden sunuluyor. "Tek esere dayanıyor" iddiası artık doğru değil — ama bu bir hata değil, önceki tek-kaynak sorununun ÇÖZÜLMÜŞ olmasından kaynaklanıyor; katalog metni güncellenmeli. Ayrıca 2026-05-11 denetiminin önerdiği kod düzeltmeleri (`CANONICAL_VERSE_COUNTS`, `MIN_ANCHOR_GAP=80`) kodda uygulanmış durumda.

> **Kapsam dışı bırakılanlar (Alan 2)**: `cennet-cehennem.json` (46 eşleşme, hepsi iç ayet referansı), `esma-pairs-ayetler.json`, `ilk-son-kelimeler.json`, `verse-metadata.json` (yanlış pozitif) — dış kaynak atfı yok. `ahiret-yolculugu.json`, `insan-tanimi-ext.json`, `insan-yolculugu.json`, `dua-dili.json` içerikleri bu bölümde tekrar numaralandırılmadı çünkü aynı içerik sırasıyla **R54-R66**, **R291-R302**, **R280**, **R252-R257**'de zaten kayıtlı.

---

# ÖZET SAYIM

**Toplam bulunan madde: 453 (R1–R453)**

Sistematik tarama, `next/src/sections/*.jsx` (27 dosya), `next/src/components/*.jsx` (SourcesCitation kullanan 32 dosya dahil ~100 dosya), `next/src/data/*.js`/`*.json`, `next/public/tefekkur/*.json` (53 makalenin tamamı), `kaynak`/`source`/`reference`/`attribution`/`author` alanı taşıyan 16 `public/*.json` dosyası, `footer.sources` (tr.json/en.json) ve ilgili 6 `docs/reviews/*.md` denetim belgesini kapsadı.

## Bölüm bazlı döküm (R aralıkları)

| Aralık | Kapsam | Madde sayısı |
|---|---|---:|
| R1–R70 | Satır-içi bölüm/bileşen atıfları (`HiddenArchitecture`, `RingExtensions`, `TarihselKanitlar`, `ProofSection`, `ProphetMap`, `PsychologySection`, `QuranDua`, `SoundArchitecture`, `LinguisticDNA`, `QuranRhetoric`, `ZeroRedundancy`) + `next/src/data/*.js` + `next/src/data/ahiret-yolculugu.json` | 70 |
| R71–R195 | Tefekkür makaleleri (53 makalenin 45'i en az bir madde içeriyor) | 125 |
| R196–R402 | `SourcesCitation` bileşenini kullanan 32 araç sayfası + bunlara bağlı `public/*.json`/`src/data/*.json` veri dosyaları ve satır-içi ek atıflar | 207 |
| R403–R453 | Footer kaynakçası (13), `public/tarihsel-kanitlar.json` (16), diğer `public/*.json` dosyaları (belagat-aileleri, sebeb-i-nuzul, surah-connections, word-groups, elestirel-cerceve, munafik-profili, yakin-anlamli-nuanslar), ve denetim dokümanlarından hâlâ açık olabilecek 5 somut bulgu | 51 |

## Kategori bazlı döküm (yaklaşık — kategoriler örtüşebilir, örn. bir `criticalNote` aynı zamanda bir veri-dosyası atfı da olabilir)

| Kategori | Yaklaşık sayı | Not |
|---|---:|---|
| Formal `SourcesCitation` bileşeni dizi elemanları | ~110 | 32 araç sayfasındaki 4-6'lık atıf blokları |
| Tefekkür makale atıfları (gövde/dipnot/pullQuote/criticalNote) | 125 | 53 makalenin 45'inde bulundu |
| `criticalNote` alanı taşıyan maddeler (tüm gruplar genelinde) | 44 | Metodolojik nüans/çelişki uyarıları içerenler |
| Satır-içi JSX metni + kod yorumu atıfları (SourcesCitation dışı) | ~90 | `HiddenArchitecture`, `RingExtensions`, `LinguisticDNA`, `QuranDua` vb. |
| `public/*.json` / `src/data/*` veri dosyası atıfları (SourcesCitation dışı) | ~84 | footer.sources, tarihsel-kanitlar, kadinlar.json, sebeb-i-nuzul, surah-connections, word-groups, belagat-aileleri, elestirel-cerceve |

## Faz 2 için öncelik sıralaması önerisi

1. **R2, R11, R14, R17, R21, R29-R31, R42, R50, R365, R376** — Farrin/ring-kompozisyon ailesi: sabah bulunan hatayla aynı aile, en yüksek risk (birden fazla dosyada tekrarlanan aynı iddia).
2. **R449** — Farrin'e atfedilen "%70" istatistiği: denetim raporu zaten "kitapta yok" diyor, sitede hâlâ duruyorsa acil düzeltme.
3. **R450, R451** — Hâmân/Rosetta Taşı ve tarihsel-kanıtlar giriş bloğu iç tutarsızlığı: kendi kaynağıyla çelişen iddialar.
4. **R452, R38** — Bâkıllânî alıntısının birebir mi parafraz mı olduğu doğrulanmamış.
5. **R23-R25** — `public/tarihsel-kanitlar.json` bu geçişte yalnızca dolaylı olarak kontrol edildi (R416-431 ile büyük ölçüde dolduruldu, ama `ScholarsTab`/`Kanıt` kartlarının tam `insightTr`/`criticalNoteTr` metinleri satır satır doğrulanmadı).
6. **R60, R272, R436, R438, R440** — Büyük tekrarlı diziler (40+, ~15-45, 30, 16, 32 kayıt) örneklem bazlı toplandı; Faz 2'de örneklem genişletilmeli.
7. Geri kalan ~430 madde standart doğrulama sırasına göre işlenebilir.

---

# FAZ 2 SONUÇLARI — TAMAMLANDI (14 Ağustos 2026)

> Yukarıdaki öncelik listesi Faz 1'in kendi önerisiydi. Faz 2 artık **453/453 maddenin tamamını** kapsayan tam bir sweep olarak tamamlandı (12 batch — öncelikli liste + R1-R453 sırayla, her biri gerçek web araştırması + doğrudan kod/veri dosyası okumasıyla doğrulandı). Aşağıdaki nihai döküm bu dosyanın güncel check-box durumundan üretildi.

## Nihai sayım

| Sonuç | Sayı | Oran |
|---|---:|---:|
| ✅ EŞLEŞİYOR | 319 | %70.4 |
| ⚠️ KISMEN EŞLEŞİYOR | 86 | %19.0 |
| ❓ DOĞRULANAMADI | 37 | %8.2 |
| ❌ UYUŞMUYOR | 11 | %2.4 |
| **Toplam** | **453** | **%100** |

## ❌ 11 gerçek uyuşmazlık — düzeltme gerektiren madde listesi

| # | Madde | Sorun | Durum |
|---|---|---|---|
| 1 | **R15** | Cuypers'e "Bakara için 200+ sayfalık analiz" atfediliyor; kitap toplam 224 sayfa ve en kapsamlı örneği Mâide — muhtemelen Mâide ile karıştırılmış (`RingExtensions.jsx`) | ✅ **Düzeltildi** — uydurma sayfa sayısı kaldırıldı |
| 2 | **R42** | homeCards.js'te Fâtiha'nın 7 ayet/Besmele-dahil formülü | ✅ **Düzeltildi** |
| 3 | **R90** | İbn Arabî Cemiyeti dergi atfı: "c. 18 (1995)" → gerçek "Volume XXXIX (2006)" (`rahmetin-grameri-5.json`) | ✅ **Düzeltildi** |
| 4 | **R122** | Bediüzzaman alıntısı yanlış esere atfedilmiş: Mesnevî-i Nûriye değil İşârâtü'l-İ'câz (`terminoloji-1.json`) | ✅ **Düzeltildi** |
| 5 | **R133** | Feynman'a yaygın biçimde yanlış atfedilen bir internet-alıntısı ("basitçe anlatamıyorsan anlamamışsındır") (`vicdan-evrensel-tercuman.json`) | ✅ **Düzeltildi** — "atfedilen" diye işaretlendi |
| 6 | **R191** | "En masum cümleyi getirin, idam ettireyim" sözü Napolyon'a değil Kardinal Richelieu'ya ait (`kaynak-yuzey.json`) | ✅ **Düzeltildi** |
| 7 | **R228** | Camerarius'un bitki üremesi çalışması (1694) "18. yy" değil 17. yy — asır hatası (`bilimsel-isaretler` ruzgar-dolleme verisi) | ✅ **Düzeltildi** |
| 8 | **R301** | Gazâlî'nin İhyâ'daki 4'lü kalp modeli yanlış aktarılmış — şeytânî unsur atlanmış, "rahmet" icat edilmiş (`InsanTanimi.jsx` ScholarsTab) | ✅ **Düzeltildi** |
| 9 | **R398** | R301 ile AYNI hata, farklı bir bileşende tekrarlanmış (`InsanPsikolojisi.jsx` UlemaPsikolojiGrid) | ✅ **Düzeltildi** |
| 10 | **R399** | İbn Kayyım'ın Medâricü's-Sâlikîn'i için "3 mertebeli/15 basamak" iddiası kendi içinde matematiksel tutarsız (5 aşama sayılıyor, 3×3≠15) ve kitabın gerçek 100-makamlık yapısını yansıtmıyor (`InsanPsikolojisi.jsx`) | ✅ **Düzeltildi** — 5 aşamayla tutarlı hâle getirildi |
| 11 | **R453** | "Tefsir tek esere (Elmalılı) dayanıyor" iddiası artık güncel değil — site iyileşmiş, ikinci kaynak (Ibn Kathir) eklenmiş; katalog metni güncellenmeli | Kod değişikliği gerekmiyor — site zaten doğru (2 kaynaklı) |

> **Faz 3 (14 Ağustos 2026, devam ediyor):** Yukarıdaki 11 madde + 6 kitap-başlığı-çeviri hatası dışında kalan tüm ⚠️/❓ maddeler (123 adet) tek tek yeniden derinlemesine araştırılıp ya somut bir düzeltmeyle kapatılıyor ya da gerçekten doğrulanamıyorsa iddianın kesinlik derecesi sitede yumuşatılıyor ("denir/atfedilir" gibi) — hedef: %100 içerik doğruluğu, "muhtemelen doğru" kabul edilmiyor.

## ⚠️ Tekrarlayan kalıp: kitap başlığı/atıf hataları (86 kısmi eşleşmenin önemli bir alt kümesi)

Birkaç madde (**R315, R316, R317, R368, R441, R448**) aynı hata sınıfını taşıyor: bir akademik/klasik eserin **var olduğu doğru**, ama sitedeki **Türkçe başlık çevirisi veya konu özeti yanlış/uydurma** — örneğin R317'de Jonathan Brown'ın "Misquoting Muhammad" (hadis/Hz. Muhammed hakkında) kitabı "Kur'ân'ı Yanlış Alıntılamak" diye çevrilerek konusu Kur'ân'a kaydırılmış. Bu, ❌'lardan ayrı ama aynı kökten bir risk ailesi — toplu bir gözden geçirme faydalı olur.

## Sonraki adım

Kullanıcı onayı bekleniyor: 11 ❌ madde (R42 hariç, zaten düzeltildi) tek tek mi düzeltilsin, yoksa gruplar hâlinde mi (örn. önce iki Gazâlî kalp-modeli hatası R301+R398 birlikte, sonra yanlış atıf sözleri R133+R191, vb.)?

