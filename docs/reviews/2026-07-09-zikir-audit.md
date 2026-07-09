# QuranCodex İçerik Denetim Raporu — Zikir

Tarih: 2026-07-09
Denetçi: qc-content-auditor
Dosya: `next/public/ibadetler/zikir.json`

## Özet

- Toplam ayet referansı taraması: 14 anahtar ayet + ek pasajlar
- Kritik hata: 0
- Orta düzey sorun: 3
- Minör sorun: 4
- Tartışmalı/hedge gerektiren: 2 (medium confidence olarak zaten işaretli)

Zikir sayfası genel olarak yüksek kaliteli bir tefsir çerçevesi sunar; Kur'ânî omurga (Bakara 2:152, Ra'd 13:28, Ankebût 29:45, Tâhâ 20:14, A'râf 7:205) doğru işlenmiş, klasik atıflar (Râzî, Kurtubî, Elmalılı, İbn Kayyim) çoğunlukla doğrulanabilir çerçevede.

---

## 1. On dört ayet referansı doğrulaması

| # | Referans | Konumsal Doğruluk | Not |
|---|----------|-------------------|-----|
| 1 | Bakara 2:152 | ✅ | `fe-zkurûnî ezkurkum` — birebir doğru anchor. |
| 2 | Bakara 2:200 | ✅ | Hac sonrası zikir emri; "atalarınızı andığınız gibi" doğru. |
| 3 | Âl-i İmrân 3:191 | ✅ | Kıyâmen, kuûden, alâ cunûbihim listesi + tefekkür — doğru. |
| 4 | Nisa 4:103 | ✅ | Namaz sonrası aynı üçlü duruş — doğru; savaş/korku namazı bağlamı ("âyetin öncesi salât-ı havf") doğru. |
| 5 | Ra'd 13:28 | ✅ | `elâ bi-zikrillâh` — birebir. |
| 6 | Kehf 18:24 | ✅ | "Unuttuğunda Rabbini an" — doğru. |
| 7 | Ahzâb 33:35 | ✅ | Zâkirîn/zâkirât 10. çift — doğru. |
| 8 | Ahzâb 33:41-42 | ✅ | "Çokça zikredin" + "sabah akşam tesbih" — doğru. |
| 9 | Cum'a 62:9 | ✅ | `fe's'av ilâ zikrillâh` — doğru. |
| 10 | Ankebût 29:45 | ✅ | "Ve le-zikru'llâhi ekber" — doğru. |
| 11 | Tâhâ 20:14 | ✅ | `ekimi's-salâte li-zikrî` — doğru. |
| 12 | A'lâ 87:14-15 | 🟡 | Ayet metni JSON'da yalnızca 87:14 (`kad efleha men tezekkâ`) verilmiş, meal "Rabbinin adını anıp namaz kılan" 87:15'i ekliyor — 87:15 metni JSON'da eksik. Ayet numarası doğru ama Arapça blok tek ayet. |
| 13 | A'râf 7:205 | ✅ | `fî nefsike + tadarru'an + khîfeten + dûne'l-cehr` dörtlüsü doğru. |
| 14 | İsrâ 17:44 | ✅ | Kâinat tesbihi ayeti doğru. |

**Ek referanslar da doğru:** Enbiyâ 21:87 (Yunus), Âl-i İmrân 3:41 (Zekeriyya), Meryem 19:26 (Meryem), Tâhâ 20:33-34 (Musa/Hârun).

---

## 2. Bulgular

### 🟠 Orta düzey — [1] A'lâ 87:14-15 Arapça metin eksikliği
- **Yer:** `anaPasajlar.ayetler` içindeki `A'lâ 87:14-15` girdisi.
- **Sorun:** `ref` "87:14-15" olarak veriliyor, `tr` alanı iki ayetin birleşik mealini içeriyor, ancak `ar` alanı yalnızca 87:14'ün Arapça metnini içeriyor (`قَدْ اَفْلَحَ مَنْ تَزَكّٰى`). 87:15 (`وَذَكَرَ اسْمَ رَبِّهٖ فَصَلّٰى`) ve tercihen 87:14-15 birleşimi eksik.
- **Öneri:** `ar` alanına 87:15 eklenmeli: `قَدْ اَفْلَحَ مَنْ تَزَكّٰى وَذَكَرَ اسْمَ رَبِّهٖ فَصَلّٰى`.

### 🟠 Orta düzey — [2] Yunus 21:87 "sübhâneke" formülünün "sübhân zikir formülü" olarak sunumu
- **Yer:** `peygamberVaryasyonlari[0].sceneTr` (Yunus).
- **Sorun:** Metin doğru; Yunus'un duasında geçen `sübhâneke` klasik olarak tesbih formülünün Kur'ânî bir örneğidir. Ancak sayfanın başka yerinde bu formül doğrudan "sübhân zikir formülü" olarak adlandırılmıyor — Enbiyâ 21:87 tesbih (`sübhâneke innî küntü mine'z-zâlimîn`) + tevhid (`lâ ilâhe illâ ente`) + itiraf üçlüsünün "Yunus'un tövbe duası" olarak (tövbe sayfasında da tekrarlanan) sunumu doğrudur. Zikir sayfası bunu "sıkıntı anı zikri prototipi" olarak konumluyor; bu makuldür.
- **Değerlendirme:** İçerik doğru; ancak Yunus 21:87'nin hem tesbih hem tövbe/dua örneği olarak iki sayfa arasında bölünmesinden dolayı bağlamsal fark açıkça belirtilmeli — zikir sayfasında bu ayet **birincil olarak tesbih/zikir prototipi**, tövbe sayfasında **tövbe duası prototipi** olarak sunulmalı. Şu anki metin bunu belirsiz bırakıyor.

### 🟠 Orta düzey — [3] Zekeriyya Âl-i İmrân 3:41 — "üç gün" ifadesinin doğruluğu
- **Yer:** `peygamberVaryasyonlari` — Zekeriyya girdisi.
- **İddia:** "Zekeriyya'ya Yahya müjdesinin işareti olarak verilen üç günlük dil bağlanması bağlamında ona söylenir: 'Üç gün insanlarla ancak işaretle konuşacaksın.'"
- **Doğrulama:** Âl-i İmrân 3:41 metni: `قَالَ رَبِّ اجْعَلْ لِيٓ اٰيَةً ۖ قَالَ اٰيَتُكَ اَلَّا تُكَلِّمَ النَّاسَ ثَلٰثَةَ اَيَّامٍ اِلَّا رَمْزًا وَاذْكُرْ رَبَّكَ كَثِيرًا وَسَبِّحْ بِالْعَشِيِّ وَالْاِبْكَارِ` — "üç gün" ifadesi (`ثَلٰثَةَ اَيَّامٍ`) doğrudur. Meryem 19:10'da aynı vaka "üç gece" (`ثَلٰثَ لَيَالٍ`) olarak geçer — iki ayet arasında klasik tefsirin işlediği bir tefavut vardır ("üç tam gün-gece"). Zikir sayfasının "üç gün" sunumu Âl-i İmrân bağlamında doğrudur. ✅
- **Not:** Sayfanın Meryem 19:10 paralelini de anmadan geçmesi kabul edilebilir; ancak dikkatli okuyucu için minör bir teyakkuz notu düşünülebilir.

### ✅ Ankebût 29:45 üç yorum
- Râzî'nin tercihi, İbn Abbâs'a nispet edilen okuma ve "namaz içi zikir" okuması net biçimde sunulmuş. Râzî'nin `Mefâtîhu'l-Ğayb`ta bu ayette gerçekten uzun bir tartışma yürüttüğü doğrulanabilir; İbn Abbâs'a nispet edilen okuma da klasik tefsir literatüründe sabittir. Sunum dengeli.

### 🟡 Minör — [4] Ra'd 13:28 "modern okuma" hedge yeterliliği
- **Yer:** `insanEtkisi[0]` — "Kalbin Sabitlenmesi — Modern Bir Yankı".
- **Değerlendirme:** `claimType: semantic_inference`, `confidence: medium` doğru işaretli. Metin de "Kur'ân'ın modern bilimin bulgularını 'önceden bildiğini' iddia etmez" hedge'i açıkça koyuyor. **Hedge yeterlidir.** ✅
- **Küçük not:** "kalp atış hızı düşmesi, kortizol seviyesinin gerilemesi, prefrontal korteks aktivitesi" iddiaları modern meditasyon literatüründe genel geçerdir ancak "belirli değişiklikler" ifadesi kaynak olmadan spesifikleştirilmemeli — sayfa iyi ki "belirli" ifadesiyle bırakıyor.

### 🟡 Minör — [5] Mindfulness paraleli semantic_inference
- **Yer:** `insanEtkisi[3]` — "Mindfulness Paraleli".
- **Değerlendirme:** `semantic_inference`, `confidence: medium`. Sunum çok dikkatli: "iki geleneği eşitlemez", "içeriksiz farkındalık ↔ içerikli farkındalık" ayrımı berrak. Kabul edilebilir. ✅
- **Küçük not:** "Ġazâlî'nin İhyâu Ulûmi'd-Dîn'de murâkabe için ayırdığı bölüm bu ayrımın klasik metnidir" — Gazâlî İhyâ'da murâkabe konusunu işler (Kitâbu'l-Murâkabe ve'l-Muhâsebe, "Rubû'u'l-Münciyât"); atıf doğrulanabilir. ✅

### 🟡 Minör — [6] Meryem 19:26 "sessiz zikir" bağlantısı
- **Yer:** `peygamberVaryasyonlari` — Meryem girdisi.
- **Değerlendirme:** `claimType: semantic_inference`, `confidence: medium` + explicit `auditGuardTr` notu ("Meryem'in adağını doğrudan 'sessiz zikir' olarak nitelemek klasik tefsirin ana çizgisi değildir; ayetin ana okuması bir 'savm-ı sükût'tur. Sessiz zikir ile bağlantı klasik ahlâk literatüründe kurulan bir semantik köprüdür — bu sayfa köprüyü açıkça belirtir, özdeşleştirmez"). **Hedge örnek düzeyde.** ✅

### 🟡 Minör — [7] İbn Kayyim el-Vâbilü's-Sayyib atfı
- **Yer:** `kaynaklar[3]`.
- **Doğrulama:** `الوابل الصيب من الكلم الطيب` (Bol Yağmur — Güzel Sözler'den) İbn Kayyim el-Cevziyye'nin (ö. 751/1350) gerçekten zikir üzerine yazdığı bir monografi/eserdir. Eserin zikrin faydalarını, biçimlerini ve psikolojik etkilerini ele aldığı doğrulanabilir. Klasik ahlâk literatüründe "zikrin faydaları" için birincil referanslardandır. ✅
- **Küçük not:** Tam başlık `الوابل الصيب من الكلم الطيب` (el-Vâbilü's-Sayyib mine'l-Kelimi't-Tayyib). Sayfada yalnızca `el-Vâbilü's-Sayyib` verilmiş — kısaltılmış hâli yaygın kullanımdır, sorun değil.

---

## 3. Genel Değerlendirme

Zikir sayfası içerik kalitesi bakımından **güçlü**dür:

**Güçlü yanlar:**
- 14 anahtar ayetin tümü doğru şekilde referanslanmış.
- Ankebût 29:45'in üç okumasının dengeli sunumu — Râzî'nin tercihi + İbn Abbâs'a nispet edilen okuma + üçüncü okuma. Bu tür tartışmalı ayetlerde çoklu-görüş sunumu örnek pattern'dır.
- Modern paralellik iddiaları (mindfulness, meditasyon, nörolinguistik) uygun `claimType: semantic_inference` + `confidence: medium` etiketleriyle işaretli, açık hedge cümleleri içeriyor.
- Meryem 19:26 gibi tartışmalı yorumda `auditGuardTr` notu ile klasik ana-çizgi ↔ semantik köprü ayrımı berrak.
- Klasik kaynaklar (Râzî, Kurtubî, Elmalılı, İbn Kayyim el-Vâbilü's-Sayyib) doğru atıflanmış.
- "Rakamsal Mimari" tab'ında "Kur'ân eksik, tasavvuf ekledi" retoriğinin açıkça reddedilmesi — Ehl-i Sünnet çizgisi güvenli.

**Düzeltilmesi gerekenler:**
1. A'lâ 87:14-15 girdisinde Arapça metnin 87:15'i de içerecek şekilde tamamlanması (Orta) — orta düzey redaksiyon işi.
2. Yunus 21:87'nin zikir ↔ tövbe sayfaları arası bağlamsal ayrımının netleştirilmesi (Orta) — bir cümlelik ek klasifikasyon notu yeterli.

**Sonuç:** Yayına uygun. Bir redaksiyon geçişiyle (87:15 Arapça ekleme) tam kabul.
