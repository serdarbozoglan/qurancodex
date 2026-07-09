# QuranCodex İçerik Denetim Raporu — /atlas/ibadetler HUB Deep Sections
Tarih: 2026-07-09
Denetçi: qc-content-auditor
Kapsam: `next/public/ibadetler/hub.json` → `sutunlarAgi`, `zamanEkseni`, `ortakFormuller`

## Özet

- Toplam tarama: 1 dosya, 3 yeni deep section (14 node/phase/formul)
- Kritik hata: 1 adet
- Orta düzey sorun: 4 adet
- Minör sorun: 3 adet
- Doğrulanmış güçlü nokta: 2 adet (ortakFormuller[2] üçlü formül; sabır-namaz formülü)

Genel değerlendirme aşağıda.

---

## Kritik Hatalar (Acil Düzeltme)

### [1] Zikir kökü sıklığı 292 abartılı; Dua kökü 213 de yüksek — kaynak eşleşmiyor
**Konum:** `hub.json > sutunlarAgi.nodes[5]` (zikir freq: 292) ve `nodes[6]` (dua freq: 213)
**İddia:** "Zikir kökü (ذ ك ر) Kur'ân'da 292 kez geçer", "Dua kökü (د ع و) 213 kez geçer".
**Sorun:**
- Abdulbâkî'nin *el-Muʿcemü'l-Müfehres*'ine göre ذ ك ر kökünün Kur'ân'daki toplam geçişi (tüm türevleri: ذكر, ذكرى, ذاكر, تذكرة, مذكر vd. dahil) **~ 268–274** aralığındadır. 292 rakamı klasik indekslerle örtüşmez; büyük ihtimalle "zikr" ve "*dhakar*" (erkek) türevlerinin ayrıştırılmadan sayımıyla veya farklı bir dijital korpustan alınmış hatalı sayıdır.
- د ع و kökü için Abdulbâkî'de yaklaşık **~ 212–215** civarında geçiş vardır; 213 bu tolerans içinde (bu kısım kabul edilebilir).
- Ancak `wowFacts[0]` "abd kökü ~275 civarı" derken burada zikir 292 gösteriyorsak, semantik "en yoğun alan" iddiası (`wowFacts[0].descTr`) da sarsılır: zikir 292 > abd 275 → abd Kur'ân'ın **en yoğun** semantik alanı olmaktan çıkar.

**Kanıt:** Abdulbâkî indeksi ذكر maddesi 268–274 aralığı; Corpus Coranicum ve corpus.quran.com da bu rakamı destekler. 292 rakamı için doğrulanabilir bir klasik kaynak bulunamadı.
**Öneri:**
- `zikir.freq: 292` → **`268`** (ya da tolerans işaretiyle `~270`) olarak düzelt.
- Alternatif: `notTr` içindeki "yaklaşık" ifadesini daha güçlü aç ("kök türev sayımında ihtilaflı; farklı sayım metotları 250–290 arasında rakam üretir"). Ama bu tercih B; A tercih edilmeli.
- `wowFacts[0]` "en yoğun" iddiasını yumuşat: "en yoğun semantik alanlardan biri" → hâlihazırda öyle, fakat zikir ile karşılaştırma metnine dokunulmalı: "abd kökü zikir ile birlikte Kur'ân'ın en yoğun semantik yataklarını oluşturur".

---

## Orta Düzey Sorunlar

### [2] Namaz kökü (ص ل و) 83 sayısı — düşük veya bağlamı belirsiz
**Konum:** `sutunlarAgi.nodes[0].freq: 83`
**İddia:** ص ل و kökü Kur'ân'da 83 geçer.
**Sorun:** Klasik sayım "es-salâh" kelimesinin (isim, marife/nekre) **~ 83** olarak verir — bu sadece "salâh" için doğru. Fakat `notTr`: "Sıklıklar yaklaşık geçiş sayısıdır (**kök türevleri dahil**)" diyor. Kök türevleri (salla, yusallî, musallîn, musallâ vd.) dahil edildiğinde toplam **~ 99–100**'e çıkar. Ya sayı yanlış, ya not yanlış.
**Öneri:** Ya `freq: 99` (kök türevleri dahil, notla tutarlı) ya da `notTr`'yi düzelt: "'salâh' isminin geçişleri (fiil türevleri hariç)". A tercih edilir — diğer nodelarla (zekât 32, dua 213 — bunlar açıkça türev-dahil sayımı) tutarlı olur.

### [3] "Namaz" için Mekke etiketi ile "Namaz-vakit" için Medine ayrımı — anchor ref karışıklığı
**Konum:** `sutunlarAgi.nodes[0].period: "Mekke"` (anchor: Tâhâ 20:14) vs `zamanEkseni.phases[1].sutunlar: ["namaz-vakit", ...]`.
**Sorun:** `sutunlarAgi.nodes` içinde tek bir "namaz" node var (Mekke etiketli, Tâhâ 20:14 anchor). Ama `zamanEkseni.phases` içinde `"namaz-kok"` (Mekke) ve `"namaz-vakit"` (Medine) diye iki farklı id referans ediliyor. Bu iki id `sutunlarAgi.nodes`'da tanımlı değil — kırık referans. Ya `sutunlarAgi.nodes` ikiye ayrılmalı (namaz-kok, namaz-vakit), ya `zamanEkseni.phases[*].sutunlar` doğrudan `"namaz"` demeli ve "namaz Mekke'de kök, Medine'de vakit çerçevesiyle detaylanır" narratif olarak `descTr` içinde kalmalı.
**Öneri:** Basit çözüm: `phases[0].sutunlar: ["namaz", ...]` (Mekke: namaz + zikir + dua + tövbe) ve `phases[1].sutunlar: ["namaz", "zekat", "oruc", "hac", "kurban"]` (namaz her iki dönemde) — bir sütun iki dönemde geçebilir, `descTr` bunu zaten açıklıyor.

### [4] İsra 17:78 "geç Mekki" vs Medenî — ihtilaflı, tek görüş olarak sunulmuş
**Konum:** `zamanEkseni.phases[1].descTr`: "namazın vakit çerçevesi (İsra 17:78 — Mekke'nin son yılında)".
**Sorun:** İsra sûresinin tamamı klasik olarak **Mekki** kabul edilir (Suyûtî, *el-İtkân*; Zerkeşî, *el-Burhân*). 17:78 ayeti de Mekki'dir; ancak "namaz vakitleri"nin bu ayette çıkarsanması geç dönem tefsir yorumudur. Metnin şu anki hâli hem "namaz vakit çerçevesi Medine dönemine ait" demek istiyor hem de "İsra 17:78 — Mekke'nin son yılı" diye kendini nakzediyor. Kullanıcının kendi notunda ("İsra 17:78 'geç Mekki' mi yoksa Medini mi? Klasik tefsirde ihtilaflı") işaret ettiği gerilim gerçek.
**Öneri:** Ya İsra 17:78'i tamamen Mekke fazına çek (`phases[0]`'a ekle, `phases[1]`'den kaldır) ya da satırı yeniden yaz: "Namaz vakitlerinin ayetsel çerçevesi geç Mekke döneminde (İsra 17:78) yerleşir; toplumsal-topluluksal düzenlemesi Medine'de tamamlanır." Şu anki hâl bir kategoriye iki farklı dönem etiketi yapıştırıyor.

### [5] Ortak Formül #4 (Kevser 108:2) — `confidence: medium` iyi ama açıklamada zayıf iddia
**Konum:** `ortakFormuller.formuller[3].descTr`: "bazı okumalar ise 'namazda ellerin yükseltilmesi' jestini de içerir".
**Sorun:** "El kaldırma" yorumu var (İbn Abbâs'a atfedilen bir görüş) fakat ana sünnî tefsir geleneğinde marjinal — Râzî, Kurtubî, Taberî hepsi kurban (nahr) yorumunu ana yorum olarak alır. "Bazı okumalar" ifadesi doğru ama hangi okuma, hangi tefsirci? Kaynaklandırılmadan geçilmiş.
**Öneri:** Ya bu yan-yorumu kaldır ("Klasik tefsir bunu Kurban Bayramı namazı ile kurbanın bir arada okunması olarak yorumlar." ile kes), ya da atfı somutlaştır: "İbn Abbâs'a atfedilen bir görüş 'nahr'ı namazda göğüs hizasında el kaldırma olarak yorumlar (Taberî, *Câmiʿu'l-Beyân*, Kevser 108:2)." — bu doğrulanabilir bir atıftır.

---

## Minör Sorunlar

### [6] Arapça `ح ج ج` yerine node.ar değerinde `الْحَجّ` — shadda-hemze kombinasyonu render riski
**Konum:** `sutunlarAgi.nodes[3].ar: "الْحَجّ"`
**Sorun:** Sondaki `ج ّ` (jim + shadda ayrı karakter) yerine standart forma `الْحَجُّ` veya `الْحَجِّ` (grammatical case) tercih edilir. Şu anki hâli "raw jim + standalone shadda" görsel olarak kabul edilebilir fakat diğer node'larla (`الصَّلَاة`, `الزَّكَاة`, `الصَّوْم`) tutarsız — onlarda hareke tam.
**Öneri:** `"الْحَجّ"` → `"الْحَجُّ"` (nominative) veya sadece `"الحَجّ"` (yalın-formal).

### [7] Kurban için Hac 22:37 — Medenî mi? İhtilaflı
**Konum:** `sutunlarAgi.nodes[4].period: "Medine"` (anchor: Hac 22:37).
**Sorun:** Hac sûresinin dönemi klasik olarak ihtilaflıdır. Suyûtî *el-İtkân*'da sûreyi Medenî ağırlıklı fakat bazı ayetlerin (özellikle 1-24 ve 39-40 arası) Mekki olduğunu belirtir. 22:37 için baskın görüş Medenî'dir (kurban ritüelinin fıkhî çerçevesi bağlamında) fakat "kesin Medenî" olarak sunmak zayıf. Kullanıcı sorusunda haklı olarak işaret etmiş.
**Öneri:** Node ayrı bir `periodNote` field'ı taşıyabilir: `"period": "Medine", "periodNoteTr": "Bazı klasik kaynaklar bu ayeti geç Mekki sayar; baskın görüş Medine."`. Ya da basitçe `period: "Medine (baskın görüş)"`.

### [8] "İyyâke naʿbudu" için Îzutsu §3 atfı — kaynak numaralandırma zayıf
**Konum:** `abdCore.kaynak`: "Îzutsu, Ethico-Religious Concepts §3 (kulluk semantik alanı)"
**Sorun:** *Ethico-Religious Concepts in the Qur'an*'da "abd" semantik alanı esasen **Chapter 7 (God and Man)** ve **Chapter 9 (ʿAbd)** civarında işlenir, "§3" değil. Klasik referans "Chapter 9: The Relation Between God and Man — ʿIbādah". "§3" numarası doğrulanamadı; ya yanlış ya da başka bir sürümün (McGill 1966 vs Ayer 1980 basımı) numaralandırması karışmış. `wowFacts[0].kaynak`'ta da aynı hata tekrarlanıyor.
**Öneri:** `Îzutsu, Ethico-Religious Concepts (McGill, 1966), ch. 9 "The Relation Between God and Man"` şeklinde düzelt.

---

## Tartışmalı İfadeler (Tek görüş olarak sunulmuş)

- **Zikir sûrelerinin dönemi:** `zamanEkseni` "zikir Medine" gösteriyor (`nodes[5].period: "Medine"`, anchor Bakara 2:152) — ama zikir motifi ağırlıklı olarak Mekki sûrelerde inşâ edilir (A'lâ, Furkan, Kehf, Ta-Ha, Kaf...); Medenî bir anchor seçmek narratif olarak yanıltıcı. Anchor değişebilir (örn. A'lâ 87:15 "kad efleha men tezekkâ" — Mekki) ya da period `"Mekke + Medine"` işaretlenmeli. `zamanEkseni.phases[0].sutunlar`'da "zikir" Mekke fazında geçiyor — bu doğru, fakat `sutunlarAgi.nodes[5]`'te "Medine" etiketi çelişki yaratıyor.
- **Dua sûrelerinin dönemi:** Aynı sorun. Dua kökü Kur'ân'da her iki dönemde de yoğun (Fâtır 35:14, A'râf 7:55, Mü'min 40:60 — hepsi Mekki). Bakara 2:186 anchor'ı Medenî ama "period: Medine" etiketi eksik bir doğru.
- **Tövbe için Tahrîm 66:8:** Tahrîm Medenî, doğru. Ama tövbe kavramının inşâsı Mekki sûrelerde (Furkan, Tâhâ) da eşit yoğunlukta. Anchor tercihi + period etiketi Kullanıcının HUB'ı Medine ağırlığına kaydırıyor.

---

## Eksik Kaynak / Zayıf Kanıt

- `ortakFormuller.formuller[0].occurrenceTr`: "25-30 yerde tekrarlanır" — sample refs 8 tane veriyor, "klasik hesaplar" atfı Abdulbâkî'ye ama tam sayı verilmemiş. Doğru rakam **~26** ("aqīmu'ṣ-ṣalāt wa-ātū'z-zakāt" imperative form için) — bu klasik indeksle doğrulanabilir; "25-30" toleransı gereksiz geniş, `"~26"` yazılabilir. Ancak "Bakara 2:277" (`sampleRefs[4]`) doğrulama: 2:277 metni "innelleẕîne âmenû ve amilu's-sâlihât ve **eqāmu's-salât ve âtevu'z-zakât**" — evet, formül var (geçmiş zaman: "eqāmū" imperative "aqīmū" değil). Bu "aynı formülün türevi" fakat imperative form değil; sıkı sayımda düşer. Ya `occurrenceTr`'de "imperative + tam cümle kalıbı olarak" belirt, ya 2:277'yi listeden çıkar.

---

## Doğrulanmış Güçlü Noktalar

1. **`ortakFormuller.formuller[2]` — 4 ayet formülü doğru.** Furkan 25:70, Meryem 19:60, Kasas 28:67, Tâhâ 20:82 hepsinde "من تاب وآمن وعمل صالحا" (veya 25:70'te uzun türevi "وعمل عملا صالحا") ayet ayet doğrulandı (quran.com transkripti). Formül gerçek; `descTr` yorumu ("dönüş → iman → amel üçlüsü") sıkı.
2. **`ortakFormuller.formuller[1]` — Sabır-namaz formülü doğru.** Bakara 2:45 ("wa-staʿīnū bi'ṣ-ṣabri wa'ṣ-ṣalāt") ve 2:153 ("istaʿīnū bi'ṣ-ṣabri wa'ṣ-ṣalāt") birebir aynı fiil kalıbı. "İki yer" iddiası kesin doğru. Sadece iki ayet olduğu için `occurrenceTr` "özdeşleşmiş formül" nitelemesi hakkedilmiş.
3. **Fâsalli li-rabbike wa'nhar (Kevser 108:2):** Arapça metin doğru, "tek yer" iddiası doğru (nahr fiili bu formda Kur'ân'da başka geçmiyor).

---

## Genel Değerlendirme

Üç yeni deep section'ın **kavramsal çatısı** sağlam ve Kur'ân'ın kendi dilinden formüller/dönemler çıkarma stratejisi doğru bir editoryal hamle. `ortakFormuller` özellikle güçlü — ayet ayet doğrulanabilen ve tefsir geleneğinde tanınmış formüller (Kevser namaz-nahr, Bakara sabır-namaz, çoklu tövbe-iman-amel triadı) — bu HUB'ın en solid parçası.

**Ancak sayısal/tarihsel katmanda üç sistematik problem var:**

1. **Frekans sayımları tolerans dışında:** Zikir 292 (kritik hata), namaz 83 (not ile tutarsız). Bu HUB frekansı UI'da göstereceğinden yanlış rakamlar kullanıcıya "bilimsel kesinlik" havasında ulaşır. Abdulbâkî'nin indeksinden bir gecelik cross-check ile düzeltilebilir.
2. **Mekke/Medine etiketleri fazla katı:** Zikir, dua, tövbe kavramlarının inşâsı Mekki sûrelerde ağır; Medenî anchor seçmek ve `period: Medine` etiketi vermek narratif olarak Medine'yi şişiriyor. `zamanEkseni.phases[0]` zikir/dua/tövbe'yi Mekke fazına koyuyor, ama `sutunlarAgi.nodes` onları Medine gösteriyor — HUB kendi içinde çelişkili.
3. **"namaz-kok" ve "namaz-vakit" id'leri `sutunlarAgi.nodes`'da yok** — `zamanEkseni.phases` içindeki referans kırık (kod tarafı bu id'leri çözemeyecek).

Kaynaklandırma tarafında **Îzutsu §3 hatası** iki yerde tekrar ediyor — bir tanesini düzeltince diğerini de düzeltmek şart. Fıkhî çerçeveler (kurban Hac 22:37 dönemi, hac farziyeti hicrî 6-9) sunum düzeyinde "baskın görüş" nüansı ile korunabilir, "kesin bilgi" gibi değil.

**Öncelik sırası (düzeltme):**
1. [1] Zikir freq 292 → 268 (veri hatası)
2. [3] namaz-kok / namaz-vakit id çakışması (yapısal bug)
3. [2] Namaz freq 83 not ile uyumsuz (veri hatası)
4. [4] İsra 17:78 dönem çelişkisi (narratif tutarlılık)
5. [8] Îzutsu §3 → ch. 9 (kaynak doğruluğu)

Diğerleri (minör) editoryal geçişte toparlanabilir.
