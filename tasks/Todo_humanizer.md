# Todo — Humanizer (site geneli AI-yazım kalıpları)

Tarih: 2026-09-05
Kapsam: `next/` altındaki tüm görünür metin. Kaynak: Wikipedia "Signs of AI writing" kalıp listesi (`~/.claude/skills/humanizer`).
Durum: **Yalnızca tespit.** Hiçbir dosya değiştirilmedi.

Taranan: 354 dosya · 21.591 metin parçası · ~2,3 milyon karakter
(`src/components`, `src/sections`, `src/app`, `src/data`, `src/i18n`, `public/tefekkur`; corpus/embedding JSON'ları ve kod yorumları hariç).

---

## 0. Özet: site neden "AI gibi" okunuyor

Tek bir cümle değil, aynı 6 kalıbın her sayfada tekrar etmesi. Ziyaretçi ilk üç kartta kalıbı öğreniyor, sonrasında her şeyi "üretilmiş" okuyor.

| # | Kalıp | Site geneli sayı | En yoğun yer |
|---|---|---|---|
| 1 | Uzun tire `—` (§14) | **8.364** | tefekkür yazıları, tr/en.json, ProphetAtlas, WowFacts |
| 2 | "X değil, Y" / "not X — it is Y" (§9) | **986** | tefekkür tldr'ları, homeCards, tr.json, EsmaTanimlari |
| 3 | `**Etiket:**` kalın başlıklı liste (§15/§16) | **984 etiket, 6.914 kalın** | 53 tefekkür yazısının tamamı |
| 4 | Ok zinciri `A → B → C` | **1.242 (src) + 354 (tefekkür)** | neden-sonuç, ahiret, kartlar, tldr'lar |
| 5 | Türkçe başlıkta İngilizce Title Case (§17) | **530** | tüm sayfa başlıkları, kart başlıkları, section h2/h3 |
| 6 | "N · N · N — slogan" kicker kalıbı (§10/§31) | 38 + tüm katalog açıklamaları | homeCards, SixGates, toolCatalog, page.js DESC |

Daha seyrek ama görünür:

| Kalıp | Sayı | Örnek |
|---|---|---|
| Satış sıfatı TR (eşsiz, çarpıcı, dikkat çekici, sarsılmaz, sınırsız, sayısız, kusursuz, muhteşem) | 84 | "14 eşsiz harf", "en çarpıcı azap tasvirlerinden", "muhteşem bir açıklama gücü" |
| Satış sıfatı EN (unique, striking, crucial, profound, remarkable, underscores, fundamentally) | 83 | "Unique in the history of literature", "A crucial qualifier", "underscores this fundamental role" |
| Kırık cümle dizisi, 3+ ardışık ≤4 kelime (§31) | 82 | "Fatiha suresini düşünün. 7 ayet. Basit görünür. Ama yapısına bakın." |
| "Asıl soru / asıl mesele / özünde / fundamentally" (§27) | 30 | "asıl soru, kulun o rahmetten ne aldığıdır", "Asıl mesele şu:" |
| Belirsiz kaynak (§5): "bazı araştırmacılar", "korpus analizi", "modern bilim", "scholars note" | 33 | "Korpus analizi: Kur'an'da sıfır gereksiz kelime" |
| "Keşfet / Explore" CTA | 46 | 14 kartın 14'ünde "X Sayfasını Keşfet" |
| "yolculuk / journey" | 122 | "keşif yolculuğu", "journey of discovery", "iç yolculuğu" |

---

## 1. Öncelik sırası (nereden başlanmalı)

Etki × görünürlük sırasıyla:

- [x] **P1 · Ana sayfa** (2026-09-05, commit b77d53e1) (`src/data/homeCards.js`, `src/i18n/tr.json` → `hero`/`conclusion`, `src/sections/SixGates.jsx`, `ConciergePrompt.jsx`, `page.js` ClusterWhisper satırları, `Hero.jsx:353`). Detay: §2.
- [x] **P1 · Sayfa başlıkları ve meta açıklamaları** (2026-09-06; başlıklarda yalnız slogan yarıları değişti, Title Case tutarlılık için ertelendi, bkz. §3 notu) (80 `page.js` dosyasında `TITLE_TR/EN`, `DESC_TR/EN`). Google snippet'i ve `<h1>` altı bunlar. Detay: §3.
- [x] **P2 · Tefekkür tldr'ları ve criticalNote'lar** ✅ (2026-09-06: 53 tldr TR+EN yeniden yazıldı; criticalNote'lar bekliyor) (`public/tefekkur/_index.json` + 53 yazı). Gövde yazarın; tldr ve not kutuları sitenin. Detay: §4.
- [x] **P2 · Uzun anlatı bölümleri** ✅ (2026-09-06: 182 TR + 203 EN dize) (`src/i18n/tr.json` + `en.json`: linguisticDNA, hiddenSymmetry, scientificSigns, historicalProof, livingPreservation, zeroRedundancy, highlights, humanDefinition, psychology, impossibleRhythm, soundArchitecture). Bu bölümler Next tarafında `src/sections/*.jsx` üzerinden araç sayfalarında render ediliyor. Detay: §5.
- [ ] **P3 · Araç ve atlas bileşenleri** (`src/components/*.jsx`, `src/sections/ProphetAtlas.jsx`, `src/data/ahiret-yolculugu.json`). Detay: §6.
- [ ] **P3 · Katalog ve gezinme metinleri** (`toolCatalog.js`, `tools.jsx`, `exploreCategories.jsx`, Navbar mega menü, tum-araclar). Detay: §7.
- [ ] **P4 · Yardımcı sayfalar** (hakkında, kaynakça, sor, kütüphanem, not-found). Çoğu temiz; küçük dokunuşlar. Detay: §8.
- [ ] **P0 · Önce karar:** Uzun tire tasarım tercihi mi, alışkanlık mı? 8.364 tire "hepsini kaldır" ile çözülmez; bir stil kuralı gerekir (bkz. §9).

---

## 2. Ana sayfa (P1)

Dosyalar: `src/data/homeCards.js` · `src/i18n/tr.json` (`hero`, `conclusion`) · `src/i18n/en.json` · `src/sections/SixGates.jsx` · `src/sections/ConciergePrompt.jsx` · `src/sections/MethodologyRibbon.jsx` · `src/app/[locale]/page.js` (ClusterWhisper) · `src/components/Hero.jsx:353`

- [x] **Uzun tire**: 14 kartın 12'sinin blurb'ünde, hero taglinede, concierge'de, 3 whisper'dan 2'sinde, ProofSection'da. `homeCards.js` tek başına 50.
- [x] **"X değil — Y" 10 kez**: "Tekrar Değil — Nakarat", "retorik sorular bir didaktik araç değil, mimarinin kendisi", "Yakarış metin değil, yapı", "dua bir tek edebi formül değil", "İnsan tek bir kavramla değil", "Ne Şiir, Ne Düzyazı", "Yedi âyet düz bir liste değil", "çelişkisi değil, kanıtıdır", "bilimsel mucize iddiası değil", "Örüntü — kanıt değil". İkisi kalsın, sekizi olumlu cümleye dönsün.
- [x] **Kicker kalıbı 14/14**: "sayı · sayı · sayı — slogan". Sloganlar ("üç sütun, bir koruma", "üç ayna", "altı sır — altı keşif kapısı", "sınırsız diyalog", "1.400 yıllık derinlik", "1.400 yıllık eşsizlik") atılsın; sayı taşımayan kicker'lar boş kalsın.
- [x] **CTA 14/14 aynı**: "X Sayfasını Keşfet". Okurun orada ne yapacağını söyle: "14 harfin tablosunu aç", "31 nakaratı gör", "Halka şemasını aç", "Zaman çizelgesine bak". Yalnız blurb'de zaten geçen içeriğe dayan; yeni vaat ekleme.
- [x] **Aforizma cümleleri (§32)**: "Dil bir kapı; girene yeni bir oda açılır", "Yakarış metin değil, yapı", "İsnâd zinciri, sözel naklin bilim öncesi versiyonu", "Cevap her zaman okurun içinde", "Her boyut başka bir açıdan aynı sırrı gösterir", "Derinlere Daha Derinler". Kaf 50:16'ya bağlı whisper kalsın; diğer iki whisper ya kalksın ya somut cümleye dönsün.
- [x] **Kırık cümle dizisi**: `conclusion.summary` = "Kelimeleri dengeli. Sesleri duygusal. Yapısı simetrik. Anlamı katmanlı. 1.400 yıldır değişmemiş." → tek cümle.
- [x] **Satış sıfatları**: "eşsiz" ×3 (mukattaa, ritim ×2), "Gizemli", "sarsılmaz", "sınırsız", "sayısız iç sorgulama", "Dikkat çekici", "Sıfır Varyasyon", "sıfır gereksiz kelime". Metodoloji şeridindeki "Örtüşme ≠ kanıt" ile çelişiyor.
- [x] **Belirsiz kaynak**: "Korpus analizi: Kur'an'da sıfır gereksiz kelime" (tekrar kartı). Kaynak yoksa daraltılsın. `QuranRhetoric.jsx` bunu doğru yapıyor: "Bu yüzdeler sitenin kendi korpus analizinden türetilmiş tahminlerdir".
- [x] **Zaferci ton (§13.24 ile çelişki)**: psikoloji kartı "Kur'an modern psikolojiden 1.400 yıl önce ... isimlendirdi"; koruma kartı başlığı "1.400 Yıl · 1 Metin · Sıfır Varyasyon". İkinci whisper bu yüzden yumuşatılmıştı; bu ikisi kaldı.
- [x] **İkili karşıtlık kalıbı**: "ritmik ama vezinsiz, disiplinli ama özgür", "Sert Ünsüzler Korku · Yumuşak Akıcılar Şefkat", "Sarsılmaz kudret (Celal) ve sığınılacak şefkat (Cemal)". Bir tane yeter.
- [x] **Title Case (TR)**: "Arapça Bilmeden ✅ (SixGates başlıkları cümle düzenine alındı; kart başlıkları da) Görebileceğin Mimari", "Veriyle Keşfet, Görselle Anla", "Atlaslarda Detayda Kaybol", "Kul ile Rabbin Doğrudan Diyaloğu", "Yedi Mertebede İnsanın Haritası", "Nereden Başlamak İstiyorsun?". Türkçe başlık yalnız ilk harfi büyük yazar. Tamamı büyük harfli eyebrow'lar dışında.
- [x] **Hero'da aynı üçlü iki kez**: alt başlık "Dilbilimsel, Matematiksel ve Yapısal Katmanlarıyla" + tagline "dilsel, sayısal ve yapısal mimarisi" (`Hero.jsx:353`). Biri kalksın. "Bir metni okumak başka, yapısını görmek başkadır" sayfanın en iyi cümlesi; ona yer aç.
- [x] **Dil pürüzü**: Concierge "ayetleri ve içerikleri rehberler" → "rehberlik eder". `SorRoute.jsx` de aynı: "Sistem yorum katmaz — sadece rehberler."
- [x] **Terim tutarsızlığı**: SixGates "tool sayfasına geç", tum-araclar DESC "utility tool'lar", InventoryStrip "Araç". Tek terim.
- [x] **EN tarafı aynı kalıpları taşıyor**: "not a contradiction, but evidence of it", "Supplication is not text — it is structure", "He who knew you before you knew yourself — nearer...". TR ve EN birlikte düzeltilmeli.
- [x] **Test etkisi**: `tests/homepage-card-text.spec.js` kart metinlerini `tests/__baseline__/homepage-card-text-{tr,en}.json` ile karşılaştırıyor. Kart metni değişince `UPDATE_BASELINE=1` ile yeniden yazılmalı. `homepage-link-inventory` kart ID'lerine bağlı; ID'lere dokunma.

Bozulmaması gerekenler: `ProofSection.jsx` (kaynağı adıyla veriyor, "Neden kesin kanıt değil?" başlığıyla sınırını çiziyor; sitenin en iyi yazılmış bölümü, diğer kartlar buna yaklaşmalı), hero açıklaması, Kaf 50:16 whisper'ı, footer metodoloji paragrafı, concierge "Hiçbir kişisel veri saklanmaz".

---

## 3. Sayfa başlıkları ve meta açıklamaları (P1)

Dosyalar: 80 adet `src/app/[locale]/**/page.js` → `TITLE_TR/EN`, `DESC_TR/DESC_EN`.

- [x] **Başlık şablonu "X — Y"** ✅ (9 slogan yarısı değişti; kalanlar tanımlayıcı olduğu için kaldı): 80 başlığın ~30'u "Konu — Alt slogan" formunda: "Bilimsel İşaretler — 1.400 Yıl Sonra Keşfedilenler", "Ses Mimarisi — Sesler Tesadüf Değil", "Sıfır Gereksizlik — Her Kelime Bir Görev", "Yaşayan Koruma — Sıfır Varyasyon", "Zikir — Kalbin Suyu, Kur'ân'ın Nefesi", "Kurban — Teslimiyetin Aynası", "Tevbe — İki Taraftan Açılan Kapı", "Oruç — Takvanın Okulu", "Neden → Sonuç Atlası — Kur'ânî Zincirler". Sloganlar hem satış hem "X is the Y of Z" kalıbı (§32). Sade başlık + açıklayıcı desc daha insani.
- [x] **Desc şablonu "liste — liste; kaynak."**: 7 ibadet sayfasının 7'si aynı kalıp: "Terim, terim, terim — X'in Kur'ânî semantik alanı; ... Klasik tefsir kaynakları." Bir okur bunu ikinci sayfada fark eder. Her birine farklı bir giriş cümlesi.
- [x] **Desc'lerde uzun tire**: 80 desc'in ~65'inde. Meta description'da tire yerine nokta/virgül SERP'te de daha iyi kırılır.
- [x] **"Değil" kalıbı desc'lerde**: kitap-kavrami "yalnızca 'Kitap' değildir", ses-mimarisi "Sesler Tesadüf Değil", ritim "Ne Şiir, Ne Düzyazı", tarihsel-kanitlar "Kur'ân haber verir; bulgular tefekküre vesiledir" (bu sonuncusu iyi, kalsın).
- [x] **Sayı-nokta kicker'ları desc'te**: mukattaa "14 mukattaa harfi · 29 sûreyi açar · %25 kapsama." Meta açıklaması cümle olmalı.
- [x] **Satış dili**: kurani-tani "az bilinen, şaşırtan gerçekler" / "astonishing facts"; bilimsel-isaretler "1.400 Yıl Sonra Keşfedilenler" (site kuralı §13.24 ile çelişiyor: keşfeden bilim değil); koruma-zinciri "Sıfır Varyasyon" (aynı sayfanın kartı rasm/kıraat ayrımını zaten kabul ediyor).
- [ ] **Türkçe Title Case**: neredeyse tüm TITLE_TR'ler. "Huruf-i Mukattaâ — Kur'an'ın Dilsel DNA'sı" tamam (özel ad), ama "İsimlendirme Ekonomisi — Kur'ân Kimi Adlandırır?", "Eleştirel Çerçeve — Zorlu Sorular ve Ulemânın Cevapları", "Tefsir İhtilafları — Kur'ân Mesellerinde Müfessir Karşılaştırması" İngilizce başlık kuralıyla yazılmış.
- [x] **İngilizce kelime TR desc'te**: "refrain", "sui generis", "curated şekilde", "utility tool'lar", "Prophetic Perfect", "Historical Present". Ya Türkçesi ya italik terim olarak açıklama.
- [ ] Temiz örnekler (dokunma): `/graf/ayet` desc ("Bir ayete tıkla, ona en çok benzeyen ayetleri gör"), `/graf/karsilastir`, `/oku`, `/atlas/kissa`, `/hakkinda` gövde metni.

---

## 4. Tefekkür yazıları (P2)

Dosyalar: `public/tefekkur/_index.json` (53 tldr) · `public/tefekkur/*.json` (gövde: `blocks[]`; tipler: paragraph 636, section 331, verseInline 274, pullQuote 156, criticalNote 96, contrastDuo 72, hierarchyTree 48, flowChain 40).

Önce karar: Gövde metinleri Felsufi'nin; tefekkür sayfası "yazarın şahsi içtihad ve okuma denemeleri" diyor ve kanonik kaynak Medium/Substack. **Yazarın sesine dokunulmamalı.** Sitenin ürettiği katman ise tldr, criticalNote, contrastDuo/flowChain etiketleri ve JSON'a dönüştürme sırasında eklenen biçimlendirme. Bu katman en AI-kokulu yer.

- [x] **tldr'lar (53/53) aynı şablonda** ✅ (2026-09-06: tamamı düz cümleyle yeniden yazıldı; TefekkurHighlight'taki 2 kısa tanıtım eşlendi): "**Tez = tanım.** İki kutup: A ↔ B. Üç katman: (1)… (2)… (3)…" Örnekler:
  - "**Şuur = farkındalık dengesi.** İki yanılgı arasında: delusion ↔ blindness. Dereceli — binary değil."
  - "**Kalem = encoder + recorder** — bilgiyi soyutlayıp sembolize edip kaydeden her şey"
  - "Temel tez: **Şuur, yerel fayda maksimizasyonunu kainatın evrensel fayda maksimizasyonuna hizalayan mekanizmadır.**"
  - "Bu sadece dış aldanma değil — **zihnin kendisini ikna edebilme kudretidir**."
  tldr'lar özet değil, makine çıkarımı gibi: kalın "=" formülleri, ↔ ve → okları, "(1) (2) (3)" numaralı liste, "değil — Y". 53 tldr'nın düz Türkçe cümleyle yeniden yazılması listeleme sayfasını ve Navbar mega menüsünü (tldr oradan çekiliyor) birden düzeltir.
- [ ] **Gövdede kalın etiket enflasyonu**: 984 `**Etiket:**` + 6.914 kalın vurgu. En yoğun: tugyan (80 etiket), enerji-krizi (75), asr-suresi-prensipler (69, 341 kalın), lehv (60), kaynak-yuzey (52), ruhsal-cografya (44, 263 kalın), ruhun-termostati (43). Bir paragrafta 4-5 kalın ifade okuru yoruyor ve chatbot çıktısı gibi gösteriyor (§15/§16). Yazara sorulacak: kalınlar orijinal Medium metninde var mı, dönüştürmede mi eklendi? Dönüştürmede eklendiyse sitenin kararı.
- [ ] **Tire yoğunluğu**: en yüksek 20 dosyanın 17'si tefekkür. sefer.json 12,1/1000 karakter, lehv 10,8, tugyan 8,7, emrin-mahiyeti 8,4. Karşılaştırma: rahmetin-grameri serisi 1,3-1,6 (aynı yazar, temiz). Bu fark orijinalden değil dönüştürmeden geliyor olabilir; rahmetin-grameri'nin nasıl işlendiğine bakılmalı.
- [ ] **"X değil — Y"**: 862 hit'in ~400'ü tefekkür. lehv 12, kaynak-yuzey 19, enerji-krizi 30, ruhun-termostati 33, inception-hayatlar 21, ruhsal-cografya 29.
- [ ] **"Asıl soru / asıl mesele" (§27)**: kaynak-yuzey 5, rahmetin-grameri-4, anlam-yaratilis-senteni, yaratilis-hikayesi-1 ("Belki de asıl soru şu:"), Isimlendirme.jsx ("asıl mesele o kısalıkta").
- [ ] **EN çevirilerde AI kelimeleri**: "A crucial qualifier", "the crucial point is this", "underscores this fundamental role", "fundamentally how human comprehension works", "The unique role is never discovered". TR'de bu kelimeler yokken EN'de belirmesi çeviri katmanının makine olduğunu gösteriyor. EN gövdeleri ayrı bir geçiş ister.
- [ ] **Bilimsel ad-anma (§2/§5)**: "Nörobilim (Schubert 2005, embodied cognition) bunu doğrular", "Termodinamiğin ikonu Rod Swenson", "fMRI studies show" (en.json psychology). Kaynak varsa tamam; "doğrular" fiili §13.24 kuralına aykırı (bilim tasdik etmez).
- [ ] **Başlıklarda Title Case + "X: Y" çift başlık**: "Kur'an'ın Düşünme Fiilleri: Zihnin İşletim Sistemi", "Yapılanların Süslü Görülmesi — Tezyînin Anatomisi", "İdrak 2: Sonsuz Nasıl Bilinir — Yönelimsel İdrak" (iki ayraç birden). Bunlar yazarın başlıkları olabilir; kontrol edilmeli.

---

> Yan bulgu (2026-09-06, humanizer dışı): `/tefekkur/[slug]` sayfasında iç içe iki `<main>` var (`#main` içinde ikinci bir `<main class="jsx-…">`). HTML'de `main` tek olmalı; erişilebilirlik ve Playwright strict-mode için ayrı bir düzeltme maddesi.

## 5. Uzun anlatı bölümleri — tr.json / en.json (P2)

Dosyalar: `src/i18n/tr.json` (237 tire, 64 "değil", 51 Title Case), `src/i18n/en.json` (272 tire, 55 "not X but Y"). Render: `src/sections/LinguisticDNA.jsx`, `HiddenArchitecture.jsx`, `ScientificSigns.jsx`, `ZeroRedundancy.jsx`, `PsychologySection.jsx` ve diğer bölümler araç sayfalarında.

Genel gözlem: Bu bölümler sitenin en dengeli metinleri; kaynak adı veriyor, "akademik nüans" notu düşüyor. Sorun üslup değil, ritim: her paragraf aynı 3 hamleyle kurulmuş (şok cümle → kısa kırık cümleler → "Ama…" dönüşü).

- [x] **hiddenSymmetry**: "Fatiha suresini düşünün. 7 ayet. Basit görünür. Ama yapısına bakın: mükemmel bir ayna simetrisi." Kırık cümle dizisi (§31) + "mükemmel".
- [x] **psychology** (404 string, en büyük bölüm): "Tek bir şey değil — bir yolculuk." "Modern psikoloji bu aşamaları yeni yeni keşfederken, Kur'an onları on dört asır önce adlandırmıştı." Zaferci ton, ardından "Akademik nüans:" ile geri alınıyor. Cümleyi baştan dengeli yazmak iki cümleyi bir yapar (§24: önce abart, sonra düzelt).
- [x] **impossibleRhythm**: "Bir benzeri getirin meydan okuması 1.400 yıldır yanıtsız." EN `ImpossibleRhythm.jsx`: "A work that created its own category. Unique in the history of literature — neither poetry nor prose, beyond both, a form entirely its own. ... no one has produced its equal in 1,400 years." Dört üstünlük iddiası üst üste.
- [x] **scientificSigns**: "Yarattık değil, inşa ettik değil: indirdik." (üçlü değil), "Modern astrofizik ise bu seçimi neden dikkat çekici kıldığını gösteren…"
- [x] **livingPreservation**: "Mekke'deki Kur'an = Medine'deki = İstanbul'daki = Kahire'deki = Jakarta'daki." (eşittir zinciri; homeCards'ta da tekrar ediyor).
- [x] **humanDefinition**: "Ama bu dönüşümün hedefi belirsiz değil — çok net tanımlanmış. Mü'min kim? Muhsin kim? Muttakî ne demek? Bu terimler eş anlamlı değil; her biri…" Peş peşe üç retorik soru + iki "değil".
- [x] **highlights**: "Kur'an'da gelecek, geçmiş zaman kipiyle anlatılır (Prophetic Perfect) — sanki zaten olmuş gibi. Ve geçmiş, şimdiki zamanla anlatılır (Historical Present) — sanki şu an yaşanıyor." Simetrik cümle çifti; bir tane yeter.
- [x] **conclusion.points** (tr.json): "Bazı ayetleri modern bilimin keşifleriyle paralel okunmaktadır" dilbilgisi bozuk (ayetleri → ayetleri … okunuyor). Bu dizi Next ana sayfasında render edilmiyor ama tr.json'da duruyor; ya düzelt ya sil.
- [x] **Title Case (51)** ✅ (kısa başlıklarda tire → iki nokta yapıldı; büyük harf düzeni §9 kararına bağlı): bölüm h2/h3'leri: "Dilbilimsel Gözlemler — Dua Dilinin Üç Penceresi", "Klasik Çerçeveler — Dengeleyici Zâhirî Perspektif", "Daha Derine — İlgili Sûreler", "Klasik Tefsir Çeşitliliği".
- [x] **Belirsiz kaynak**: "Bazı araştırmacılar … checksum … ileri sürmüştür. Bu yorum akademik bir hipotezdir" (linguisticDNA). Kim? Kaynakça'da varsa adı verilsin; yoksa cümle kalksın.
- [ ] Temiz örnekler (dokunma): historicalProof'un eleştirel paragrafları (Dever, Bucaille reddi, 'Edna el-ard' notu), zeroRedundancy'nin Musa kıssası paragrafı, scientificSigns'ın alaka paragrafı. Bunlar hedef ton.

---

## 6. Araç ve atlas bileşenleri (P3)

Dosyalar: `src/components/*.jsx`, `src/sections/ProphetAtlas.jsx`, `src/data/ahiret-yolculugu.json`, `src/components/WowFacts.jsx`.

- [x] **ProphetAtlas.jsx** ✅ (2026-09-06: 231 dize): 301 tire, 18 "değil", 11 satış sıfatı, 14 kırık cümle dizisi. Tek dosyada en yüksek yük. "Kur'an'ın en çarpıcı azap tasvirlerinden biridir", "Müşrikler = Firavun. Hz. Muhammed = Hz. Musa." (KavimlerAtlasi'nde de var).
- [x] **WowFacts.jsx** ✅ (2026-09-06: 194 dize; ℹ️ → "Not:") (45k karakter, 190 tire): "Dikkat çekici bir yapısal örüntü." tek başına cümle; "hiçbir sayfa sessiz kalmıyor"; "Rabbinin merhamet sıfatı anlatı atmosferinde sürekli yankılanır" (§3 yüzeysel derinlik). Not kutularının "ℹ️" emojisi (§18) 20+ yerde; ikon bileşeniyle değişmeli.
- [x] **ahiret-yolculugu.json** ✅ (2026-09-06: 194 dize; âyet alıntıları hariç) (230 tire, 44 "değil"): "Kur'an ölümü bir olay değil, bir geçiş anı olarak resmeder." açılış cümlesi; EN "not as an event but as a moment of transition". 11 aşamanın girişleri aynı kalıpta mı, kontrol.
- [x] **KuranRenkleri.jsx** ✅ (2026-09-06: 170 dize) (164 tire), **ZamanBoyutlari.jsx** (21 "değil"), **EsmaFrekans.jsx** (15 "değil", 5 satış: "sarsılmaz kudret", "yegane sığınak"), **KuranYeminleri.jsx** ("Modern astronomi açısından da dikkat çekici"), **HumanDefinition.jsx** (23 "değil" / 53 tire), **QuranDua.jsx** (6 kicker üçlüsü), **KiraatAtlasi.jsx**, **Melekler.jsx** ("Benzersiz Melek Sıfatları"), **CennetCehennem.jsx** ("tek isimle değil … Her isim, öteki alemin ayrı bir yüzünü aydınlatır").
- [x] **KuranYeminleri.jsx, KavimlerAtlasi.jsx, QuranDua.jsx** ✅ (2026-09-06: 64 + 67 + 82 dize; âyet alıntıları hariç)
- [x] **EsmaFrekans.jsx, KiyametSahneleri.jsx, ZamanBoyutlari.jsx, IlkSonKelimeler.jsx** ✅ (2026-09-06: 68 + 74 + 72 + 52 dize)
- [x] **Melekler.jsx, LinguisticDNA.jsx, RingExtensions.jsx, HiddenArchitecture.jsx, CennetCehennem.jsx** ✅ (2026-09-06: 52 + 62 + 60 + 51 + 45 dize)
- [x] **KiraatAtlasi.jsx, HumanDefinition.jsx, ImpossibleRhythm.jsx, Isimlendirme.jsx, ProphetMap.jsx, MeselAtlasi.jsx** ✅ (2026-09-06: 39 + 44 + 32 + 36 + 29 + 26 dize; âyet çevirileri, kaynak atıfları ve kod yorumları hariç)
- [x] **ReadingMode.jsx, KadinlarAtlasi.jsx, InsanPsikolojisi.jsx, SunnetullahAtlasi.jsx** ✅ (2026-09-06: 30 + 18 + 24 + 25 dize; Okuma Modu'nda yalnız araç ipuçları/aria etiketleri; İnsan Psikolojisi'nde CBT/Freud/nörobilim iddiaları yumuşatıldı)
- [ ] **EsmaTanimlari.jsx** EN: "reads the name not as information but as a share: … the real question is what the servant takes". §9 + §27 aynı cümlede. TR'si de aynı ("asıl soru").
- [ ] **TefsirIhtilaflari.jsx**: "anlaşmazlık bir kusur değil, metnin katmanlı doğasının doğal sonucudur" (§9 + §3).
- [ ] **KorumaZinciri.jsx**: "sıfır-varyasyon prensibinin canlı manzarası" (§32 "the landscape of").
- [x] **Isimlendirme.jsx** ✅ (2026-09-06: "Cevap sanıldığından çok daha kısa; kısalığın kendisi de bir mesaj"): "Cevap, sanıldığından çok daha kısa — ve asıl mesele o kısalıkta" (§27, §28: noktayı söylemeden duyuruyor).
- [ ] **Ok zincirleri (1.242)**: neden-sonuc, ahiret, nefs, insan-yolculugu sayfalarında "A → B → C → D" gövde metninde. Diyagramda ok doğal; düz metinde "sabır → yardım → zafer" yerine "sabır yardımı, yardım zaferi getirir" okunur.
- [ ] **Hata mesajları da aynı kalıpta** (MeselAtlasi ✅ 2026-09-06; not-found bekliyor): MeselAtlasi "The verse could not be loaded right now — the source service is unreachable"; not-found "Bu adres bir sayfaya karşılık gelmiyor — bağlantı bozulmuş olabilir". Küçük ama tire her yere sızmış.

Temiz olanlar: `Navbar.jsx` (0 tire), `SebebiNuzul.jsx`, `VerseGraph.jsx`, `SorRoute.jsx`, `exploreCategories.jsx`.

---

## 7. Katalog ve gezinme metinleri (P3)

Dosyalar: `src/data/toolCatalog.js`, `src/data/tools.jsx`, `src/data/exploreCategories.jsx`, Navbar mega menü, `arac/tum-araclar`.

- [ ] Katalog açıklamaları "N · N · N" etiket formatında ("73 mesel · 8 motif alanı", "10 imam · 20 râvî · coğrafi dağılım", "88 emir ve yasak · 8 kategori"). Bunlar etiket, cümle değil; kısa kart altında kabul edilebilir. Ancak aynı format sayfa DESC'ine, kicker'a ve tldr'a taşınınca kalıp oluyor. Karar: bu format yalnız katalog/menü kartlarında kalsın, cümle beklenen yerlerden çıksın.
- [ ] "Az bilinen, şaşırtan gerçekler / Hidden gems & surprising facts" (kurani-tani) satış dili.
- [ ] "23 yıla yayılan anlatıların gizli haritası / The hidden narrative map" (peygamber) — "gizli" sitenin ana metaforu ama katalogda her ikinci kartta "gizli/görünmeyen/şifre" var: "14 gizemli harf ve şifresi", "gizli harita", "Görünmeyen Mimari". Sayı azaltılabilir.
- [ ] Navbar mega menü tefekkür tanıtımı: "Psikolojik, içsel ve pratik denemeler", "Kur'an Semantiği, Tefekkür ve Tasavvufî Düşünce", tefekkür listesi girişi "kök etimolojisinden modern epistemolojiye, sûre tahlillerinden tasavvufî psikolojiye uzanan derinlikli denemeler" (§12 sahte aralık "X'ten Y'ye", §4 "derinlikli"). `conclusion.discovery.desc` de aynı: "Kıraat farklarından diyalog ağlarına, mesellerden nüzul sebeplerine — her biri ayrı bir keşif yolculuğu."
- [ ] Tefekkür sayfası teşekkür paragrafı EN: "We extend our heartfelt gratitude to … to share these selected essays. All interpretations and syntheses reflect the author's personal reflection; QuranCodex carries these texts respectfully" — chatbot nezaketi (§20/§22). TR'si daha sade; EN TR'ye çekilsin.

---

## 8. Yardımcı sayfalar (P4)

- [ ] **Hakkında** (`src/app/[locale]/hakkinda/`): Gövde büyük ölçüde insani ve net (epistemik duruş, kaynaklar, sınırlar). Küçük: "kuru bir ders değil, bir keşif yolculuğuna dönüştürmektir" (§9 + "journey"), "yalnızca bilgilendirmeyi değil, tefekküre davet etmeyi" (§9), "sinematik ve etkileşimli araçlarla" (CLAUDE.md dilinden sızmış pazarlama kelimesi), DESC sonu "— açıkça." / "— stated openly." (kırık vurgu).
- [ ] **Kaynakça**: temiz; tek satırlık eser açıklamaları doğal. "Pinnacle of rational/theological exegesis" ("doruğu") tek satış kelimesi. Dokunma.
- [x] **Sor**: "Sistem yorum katmaz — sadece rehberler." (fiil hatası + tire; ana sayfa concierge'de de aynı). Fetva uyarısı iyi, kalsın. Örnek sorular doğal.
- [ ] **Kütüphanem**, **not-found**: yalnız tire.
- [x] **Footer** `support.description`: "Katkın hosting, API ve içerik geliştirme masraflarını karşılar — bu yolculuğu birlikte sürdürmemizi mümkün kılar." (§3 -ing uzantısı + journey). İlk cümle yeter.

---

## 9. Karar gerektiren stil kuralları (önce bunlar)

Bunlar tek tek düzeltmeyle çözülmez; bir kez karar verilip her yere uygulanır:

- [ ] **Tire politikası.** Seçenekler: (a) gövde metinde yasak, yalnız başlık ayracı "X — Y" olarak izinli; (b) tamamen yasak; (c) paragraf başına en fazla 1. Öneri: (a). 8.364 tirenin ~%70'i cümle içi ara söz; bunlar virgül/nokta olur, başlık ayraçları kalır.
- [ ] **"Değil, Y" politikası.** Sayfa başına en fazla 1-2. Olumlu cümle önce.
- [ ] **Kalın vurgu politikası (tefekkür).** Paragraf başına en fazla 1 kalın; `**Etiket:**` listeleri yalnız `section`/`contrastDuo` bloklarında, `paragraph` içinde değil.
- [ ] **Ok politikası.** `flowChain`/`hierarchyTree`/diyagram bloklarında serbest; `paragraph`, tldr, DESC, kicker içinde yasak.
- [ ] **Sayı-nokta etiketi ("N · N · N").** Yalnız katalog kartı, menü, InventoryStrip. Cümle beklenen her yerden (DESC, kicker, tldr, blurb) çıkar.
- [ ] **Türkçe başlık kuralı.** Yalnız ilk kelime + özel adlar büyük. Eyebrow'lar tamamı büyük harf (mevcut). `PageHeading`, `SectionWrapper`, kart `title` alanları.
- [ ] **Satış sıfatı listesi (yasak):** eşsiz, benzersiz, muhteşem, büyüleyici, çarpıcı, dikkat çekici, olağanüstü, kusursuz, sarsılmaz, sınırsız, sayısız, inanılmaz, mucizevi / unique, striking, stunning, crucial, profound, remarkable, groundbreaking, testament, underscores, fundamentally. Bir cümle bunlar olmadan ayakta duramıyorsa iddia zayıftır; sıfatı değil iddiayı düzelt.
- [ ] **§13.24 tutarlılığı.** "Bilim/tarih doğrular-keşfeder" fiilleri (bilimsel-isaretler başlığı, psikoloji kartı, koruma "Sıfır Varyasyon", "Nörobilim … doğrular") site kuralıyla çelişiyor; metodoloji şeridi "Örtüşme ≠ kanıt" diyor. Humanizer'dan bağımsız olarak düzeltilmeli.
- [ ] **EN ayrı geçiş.** EN metinlerde TR'de olmayan AI kelimeleri var (crucial, fundamentally, underscores, unique). EN'i TR'den çevirme; TR düzeldikten sonra EN'i TR'nin sadeliğine çek.

---

## 10. Uygulama sırası önerisi

1. §9'daki kuralları yaz (CLAUDE.md'ye kısa bir "metin stili" maddesi).
2. Ana sayfa (§2) + sayfa başlık/DESC (§3): 2 dosya + 80 sabit. En görünür, en hızlı kazanç.
3. Tefekkür tldr'ları (§4, 53 adet, `_index.json` + her yazının `tldrTr/En`): listeleme ve mega menü birden düzelir.
4. tr.json/en.json uzun bölümler (§5): bölüm bölüm, kaynaklı paragraflara dokunmadan ritim düzeltmesi.
5. Bileşen içi metinler (§6): ProphetAtlas, WowFacts, ahiret-yolculugu önce.
6. Tefekkür gövdeleri (§4 kalın/tire): yazara sorulduktan sonra.
7. Her adımda `UPDATE_BASELINE=1 npx playwright test homepage-card-text` ve `homepage-link-inventory` yeniden çalıştırılır.

Ölçüm: bu dosyadaki tablo yeniden üretilebilir; tarama scripti scratchpad'de (`scan.py`), kalıcı isteniyorsa `scripts/` altına taşınabilir.
