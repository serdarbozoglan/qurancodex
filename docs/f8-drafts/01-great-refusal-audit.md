# F-8 Pilot Audit — `01-great-refusal.md`

Tarih: 2026-04-22
Küratör: qc-source-curator
Kaynak: `public/verse-graph-bgem3.json` (6236 ayet, standard encoding) + doğrudan substring taraması (diakritik-strip).

---

## A. Verification summary

**Verdict: PASS_WITH_CAVEATS** — iki somut aritmetik hata dışında tüm Arapça metin alıntıları, "sadece X pasajında geçer" cinsinden yapısal iddialar, kelime benzersizliği (iḥtinâk, biyadayye, fa-bi-izzetik, ẕurriyye, dört-yön saldırı, salsāl/hamaʾ masnūn, fire-clay formülü) ve konuşma haritası birebir doğrulandı. Teolojik çerçeve güvenli (melek-cin ontolojisine girmiyor, tasavvufî İblis yok, hadis yok, Bucaille-vari spekülasyon yok). Gözlemlenen tek **yapısal hata**: en uzun pasaj iddiası (Sâd 15 ayet) yanlış — Hicr 16 ayet ile daha uzundur. İkinci hata: A'râf'ta İblis'in konuşma sayımı 4 değil 3. Her ikisi de kolayca düzeltilir; içerik çekirdeği sağlam.

---

## B. Item-by-item verification

| # | Claim (draft) | Expected | Actual (verse-graph-bgem3.json) | Status |
|---|---------------|----------|----------------------------------|--------|
| 1 | 2:34 Arapça alıntı (satır 21) | Birebir match | Birebir match | ✅ |
| 2 | 7:12 ateş-çamur alıntısı (satır 32) | Birebir match (qāla mā maneʿake… ön kısmı kısaltılmış, sadece İblis'in lafzı) | Alıntı 7:12'nin 2. yarısıdır — İblis'in lafzı. Doğru. | ✅ |
| 3 | 7:16-17 dört-yön alıntısı (satır 37) | Birebir match | Birebir match | ✅ |
| 4 | 15:28 alıntısı (satır 48) | Birebir match | Birebir match | ✅ |
| 5 | 15:33 alıntısı (satır 53) | Birebir match | Birebir match | ✅ |
| 6 | 17:61 alıntısı (satır 64) | Birebir match | Birebir match (son tanwin farkı: draft'ta `ط۪يناً`, data'da `ط۪يناًۚ` — waqf işareti; problem değil) | ✅ |
| 7 | 17:62 iḥtinâk alıntısı (satır 69) | Birebir match | Birebir match | ✅ |
| 8 | 18:50 alıntısı (satır 80) | Draft pasajın tamamı olduğunu söylüyor, aslında data'da ek cümle daha var (`afa tettakhidhūnehu wa ẕurriyyatehu awliyāʾa…`) | Draft alıntısı 18:50'nin ilk yarısıdır; tam ayet değildir. Draft "(pasajın tamamı)" demiş — **tam değil**. | ⚠️ |
| 9 | 20:116 alıntısı (satır 91) | Birebir match | Birebir match | ✅ |
| 10 | 38:75 biyadayye alıntısı (satır 102) | Birebir match | Birebir match | ✅ |
| 11 | 38:82 fa-bi-izzetik alıntısı (satır 107) | Birebir match | Birebir match | ✅ |
| 12 | "iḥtināk yalnızca 17:62'de" | 7 pasajda tek örnek | Substring `احتنك`/`حتنك` taraması: yalnızca 17:62. | ✅ |
| 13 | "biyadayye yalnızca 38:75'te" | 7 pasajda tek örnek | Substring `بيدي`: yalnızca 38:75. | ✅ |
| 14 | "fa-bi-ʿizzetik yalnızca 38:82'de" | 7 pasajda tek örnek | Substring `عزت`: yalnızca 38:82. | ✅ |
| 15 | "Ateş-çamur formülü yalnızca 7:12 ve 38:76'da" | 2 örnek | `نار + طين` kombinasyonu: yalnızca 7:12 ve 38:76. | ✅ |
| 16 | "Dört yönden saldırı yalnızca 7:16-17" | Tek örnek | `بين ايديهم` / `شمائل` kombinasyonu: yalnızca 7:17. | ✅ |
| 17 | "ẕurriyye yalnızca 17:62 ve 18:50'de (7 pasaj içinde)" | 2 örnek | Substring `ذري`: yalnızca 17:62 ve 18:50. | ✅ |
| 18 | "anẓirnī (mühlet) 3 pasajda: 7:14, 15:36, 38:79" | 3 örnek | Substring `انظر`: 7:14, 15:36, 38:79. Diğer 4 pasajda yok. | ✅ |
| 19 | "Hicr en ayrıntılı madde tarifi (ṣalṣāl min ḥamaʾin masnūn)" | 15:28 & 15:33'te | Doğrulandı; başka pasajda `حمأ مسنون` yok. | ✅ |
| 20 | **"En uzun anlatım 15 ayet (Sâd 38:71-85) ve 8 ayet (A'râf 7:11-18)"** (satır 119, 184) | Aritmetik: en uzun = Sâd (15) | **HATA:** Hicr 15:28-43 = 16 ayet, yani Sâd'dan daha uzundur. Draft cross-pasaj gözleminde Hicr'i atlıyor. | ❌ |
| 21 | **"A'râf 7:11-18'de İblis 4 kez konuşur (7:12, 7:14, 7:16-17)"** (satır 125, 190) | qāla ile başlayan İblis konuşmaları | **HATA:** İblis qāla ile başlayan konuşmaları: 7:12, 7:14, 7:16. 7:17 ayrı bir "qāla" ile başlamaz (`ثم لَاٰتِيَنَّهُمْ…`), 7:16'nın devamıdır. Yani 3, 4 değil. | ❌ |
| 22 | "Sâd'da [İblis] üç kez [konuşur] (38:76, 38:79, 38:82-83)" | qāla 38:76, 38:79, 38:82 | Doğrulandı: 3 konuşma. (38:83 `ancak onlardan ihlaslı kulların hariq` İblis ağzından ise, bu tek bir konuşmadır ve 38:82 ile birleşik.) | ✅ |
| 23 | "Hicr'de iki veya üç kez (15:33, 15:36, 15:39)" | 3 qāla | Üç qāla açıkça var: 15:33, 15:36, 15:39. "İki veya üç" belirsizliği gereksizdir — kesinlikle 3. | ⚠️ |
| 24 | "Kehf 18:50 pasajı İblis'in soyuna (ẕurriyye) işaret eder" | Ayet İblis'in soyunu mu Âdem'in soyunu mu? | **Nüans:** 18:50'deki `ذُرِّيَّتَهُٓ` bağlamı `afa tettakhidhūnehu wa ẕurriyyatehu…` (onu ve onun soyunu). Zamir muğlaktır: klasik tefsirde iki okuma var — "İblis'in soyu" VEYA "Âdem'in soyu" (Taberî her iki ihtimali kaydeder). Draft İblis'in soyu lehine kesin konuşuyor ("Kahf also confirms Iblis has a progeny") — **tefsir tartışmasını göz ardı ediyor**. | ⚠️ |
| 25 | "7 pasaj tablosundaki yerlerin Mushaf sırası" | 2 → 7 → 15 → 17 → 18 → 20 → 38 | Doğru. | ✅ |
| 26 | Teolojik güvenlik (melek-cin, tasavvufî İblis, hadis karıştırma) | Yok | Kehf nüansında `kalām/tefsir tartışmasına girmiyoruz` açıkça dendi; İblis glorifikasyonu yok; hadis yok. | ✅ |
| 27 | TR meali Diyanet türevi iddiası (satır 203) | Mealin kaynağı | `verse-graph-bgem3.json` içindeki TR alanları Diyanet meali değildir — Diyanet'in cümle kuruluşuyla farklar var (örn. 2:34 data: "Hani biz meleklere (ve cinlere): Âdem'e secde edin…" — bu parantezli ekleme Diyanet 2011'de yoktur, büyük ihtimalle Elmalılı sadeleştirilmiş). Producer "Diyanet türevi" dese de **mealin kaynağı belirsiz**. | ⚠️ |

---

## C. Specific errors to fix

### C1. Yanlış aritmetik — Hicr pasajı uzunluk sıralaması (satır 119 ve 184)

**Yanlış:**
> "En kısa anlatım tek ayettir (20:116 ve 18:50); en uzun anlatım 15 ayettir (Sâd 38:71-85) ve 8 ayettir (A'râf 7:11-18)."

**Doğru:**
> "En kısa anlatım tek ayettir (20:116 ve 18:50); en uzun anlatımlar Hicr 15:28-43 (16 ayet) ve Sâd 38:71-85 (15 ayettir); A'râf 7:11-18 ise 8 ayettir."

EN karşılığı satır 184 de aynı şekilde düzeltilmeli.

### C2. İblis'in A'râf'taki konuşma sayısı (satır 125 ve 190)

**Yanlış:**
> "A'râf 7:11-18'de İblis dört kez konuşur (7:12, 7:14, 7:16-17)."

**Doğru:**
> "A'râf 7:11-18'de İblis üç kez konuşur (7:12, 7:14, 7:16; 7:17 aynı konuşmanın devamıdır)."

Kritere — `qāla` ile başlama — göre 7:17'de qāla yok (`ثُمَّ لَاٰتِيَنَّهُمْ…`), bir önceki replikle zincirli.

### C3. Kehf 18:50 alıntısının "pasajın tamamı" ibaresi (satır 79)

Draft "**Arabic (pasajın tamamı):**" diyor; fakat 18:50 tek ayet olsa da alıntıda ayetin ikinci yarısı (`afa tettakhidhūnehu wa ẕurriyyatehu awliyāʾa min dūnī…`) eksiktir. İki seçenek:
- (a) "pasajın tamamı" ibaresini kaldır, "ilk bölüm" yaz.
- (b) Ayetin tamamını ekle (önerilen — "onu ve soyunu dost ediniyor musunuz" kısmı bizzat iddianın (`Kahf confirms Iblis has a progeny`) kaynağıdır).

### C4. Kehf ẕurriyye nüansı (satır 84 ve 169)

"Kahf also confirms Iblis has a progeny" ifadesi kesin konuşuyor; oysa `ẕurriyyatehu`'nun mercii klasik tefsirde tartışmalıdır (Taberî, Râzî, İbn Kesîr iki yorumu da kaydeder). **Öneri:** "Kahf'a göre İblis'in — ya da bazı tefsirlere göre Âdem'in — bir ẕurriyyesi vardır" gibi tarafsız formül. Veya `⚠️` işaretlenerek (zaten kalām notu var, bu noktayı da içine alabilir).

### C5. Hicr konuşma sayımı (satır 125)

"İki veya üç" belirsizdir. 15:33, 15:36, 15:39 üçü de ayrı `qāla` — sayım kriteri aynı tutulursa **3**. "İki veya üç" cümlesi kaldırılmalı.

### C6. Meal kaynağı ibaresi (satır 203)

"(Diyanet meali türevi)" iddiası doğrulanamadı — `verse-graph-bgem3.json`'daki TR metinler birebir Diyanet 2011 değildir (örn. 2:34'teki parantezli "(ve cinlere)" eklemesi). Footer/bibliografiye girecekse "kaynak belirsiz; Elmalılı sadeleştirilmiş olabilir — teyit gerekir" notu eklensin veya iddia tümden çıkarılsın.

---

## D. Recommendation

**GO** (draft yayına hazır, yukarıdaki 6 düzeltme — C1, C2, C3, C4, C5, C6 — ile).

Yapı, kanıta dayalılık, teolojik güvenlik, dil/üslup, ve `site-fit` (yapısal-karşılaştırmalı yaklaşım) tamam. Gözlem çekirdekleri (iḥtinâk, biyadayye, fa-bi-izzetik benzersizliği; dört-yön saldırı ve ateş-çamur formülünün dar dağılımı; mühlet talebinin 3/7 pasajda olması) **hepsi birebir doğrulandı**. İki aritmetik hata dikkatsizlik kaynaklı ve tek rakam düzeltmesiyle çözülür. Kehf ẕurriyye yorumu ve meal kaynak atfı iki küçük nüans gerektiriyor.

**F-8'in kalan 5 alt bölümüne devam edilmesi önerilir.** Producer pilotunda göstermiş olduğu disiplin (her iddiayı data'ya bağlama, ⚠️ ile kendi belirsizliklerini işaretleme) model olarak tutulursa denetim yükü bu seviyede kalır. Bir sonraki pilotlarda `qc-content-producer`'ın aritmetik kontrol (ayet sayısı, konuşma sayısı) için basit bir hesap tablosu tutması önerilir — bu iki tür hata tekrar etmesin.

Ek öneri: Bölümün footer kaynak girişine (`footer.sources`) kalıcı olarak girmeden önce `qc-content-auditor` (ayet encoding) taramasından da geçirilmelidir; bu audit kaynak/iddia katmanıyla sınırlıdır.

Sözcük sayısı: ~780.
