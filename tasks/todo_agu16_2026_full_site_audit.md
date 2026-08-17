# QuranCodex — Kapsamlı Site Denetimi (16 Ağustos 2026)

Koordinatör: Claude. Kaynak: 5 paralel CSS/sticky-bug taraması (§13.31/§13.32/tab-case ailesi, 63 araç/atlas/graf rotası) + 23 ajanlı tam-site içerik/görsellik/bug denetimi (72 sayfa + 53 Tefekkür makalesi). Tüm bulgular ajanların ham çıktısından derlenmiştir; puanlar 1-10 ölçeğinde ajan değerlendirmesidir, kesin doğru kabul edilmemeli — öncelik sıralamak için kullanın.

## Skor Lejantı
- **İçerik**: derinlik, netlik, iç tutarlılık, doğrulanamaz mutlak iddia var mı (site kuralı: "tek", "her zaman", "hiçbir", ispatsız "mucize/kanıt" dili yasak)
- **Görsellik**: sitenin kendi premium çıtasına (koyu kozmik tema, altın vurgu, Playfair Display, bol boşluk) göre
- **Buglar**: `[CSS/sticky ailesi]` = §13.31/§13.32/tab-case denetiminden; diğer etiketler (`typo`, `broken-link`, `mobile`, `non-functional`, `console-error`, `other`) = genel bug denetiminden


## Öncelik Özeti (veri odaklı, tüm denetimden derlendi)

Bu bölüm 125 sayfalık (72 araç/atlas/graf/statik + 53 tefekkür) tam taramanın en yüksek etkili bulgularını özetler. Detaylar aşağıdaki sayfa bazlı bölümlerde.

**Durum: 16 Ağustos 2026 akşamı — kullanıcı talimatıyla ("bunları sırayla çöz hemen") tüm kritik + sistemik bulgular üzerinde düzeltme çalışması başlatıldı, ilerledikçe bu bölüm güncelleniyor. ✅ = düzeltildi + canlı doğrulandı, ⏳ = düzeltme sürüyor.**

**16 Ağustos 2026 — TAM KAPSAM TURU TAMAMLANDI.** Aşağıdaki kritik/sistemik bulguların yanı sıra, kullanıcı talimatıyla ("kalan diğer sayfaları da sırayla düzelt, gerekirse paralel agentlar kullan") denetimdeki her kalan sayfa (araç/atlas/graf + tefekkür) 5 paralel ajana bölünerek tek tek gözden geçirildi. Her ajan yalnız kendi atanmış dosyasını düzeltti; dosya-kapsamı dışında kalan (veri dosyası, paylaşılan bileşen, editoryal karar gerektiren) bulgular ayrıca toplanıp koordinatör tarafından tamamlandı. Toplam bu turda: **~15 commit, 25+ dosya.** Öne çıkanlar:
- **Tefekkür — 3 paylaşılan bileşen hatası** (HierarchyTree/MorphologyTable/ArticleRenderer'daki SourcesBlock) — tek tek makale hatası değil, en az 8-10 makaleyi aynı anda etkileyen mobil taşma/örtüşme hataları, kaynakta düzeltildi (makale prose'una dokunulmadı — 52/53 makale dış yazara ait, sufist.medium.com).
- **`/arac/kurani-tani` kartı "Wow-Facts'in kapsamlı hâli" diyordu** — iç bileşen adı (WowFacts.jsx) kullanıcı metnine sızmıştı (§13.27), kullanıcı raporuyla yakalandı ve düzeltildi; `audit-internal-leak.mjs`'e bu sınıfı yakalayacak yeni desen eklendi.
- `/arac/ilk-son-kelimeler` — kullanıcının önceden sorduğu ("üst/alt sıra ne demek") soru artık sayfada yanıtlanıyor.
- `/atlas/munafik` verisinde 62 çift render edilmeyen markdown yıldızı (`*...*`) ekranda çıplak görünüyordu — temizlendi.
- Kalan ~15 küçük düzeltme: navTop dinamik ofset (Mekanizma 2, ~8 dosya), yazım hataları, doğrulanamaz mutlak iddialar, mobil taşma/kaydırma ipuçları, 2 yeni `DataDictionary` şeffaflık paneli (`/graf/ayet`).
- Ajanların "kapsam dışı, editoryal karar gerekir" diye işaretleyip dokunmadığı ~10 madde var (IA/routing kararları, yeni prose gerektiren öneriler, dış yazar içeriği) — bunlar bilinçli olarak bırakıldı, aşağıdaki sayfa bazlı bölümlerde ayrıntı yok ama commit mesajlarında listelendi.

### 🔴 Kritik — çöken/kırık işlevsellik
1. ✅ **`/atlas/sunnetullah`** — "Kavim Örüntüleri" sekmesine tıklamak sayfayı çökertiyordu (`SunnetullahAtlasi.jsx:1726`, `pattern.summaryTr` için `|| ''` fallback eksik, operatör önceliği hatası). **Düzeltildi**: `((tr ? pattern.summaryTr : pattern.summaryEn) || '').slice(0, 240)`. Canlı doğrulandı — sekme artık çökmüyor.
2. ✅ **`/arac/cennet-cehennem`** — 6 sekme düğmesi birbirinin tıklama alanına giriyordu (`.mq-box`'ın `--ml-d/--mr-d:-32px` custom property'leri düğmelere miras kalıyordu). **Düzeltildi**: her düğmeye kendi `--mt-d/--mr-d/--mb-d/--ml-d: 0` değerleri eklendi. Canlı doğrulandı — 6 düğme arası artık 0 örtüşme.
3. ✅ **`/arac/iblis-seytan`** — "Vesvese Kanalı" widget'ındaki 3 ayet linki 404 veriyordu. **Düzeltildi**: `/oku/{sure}/{ayet}` → `/oku/{sure}?ayah={ayet}` (ReadingMode'un zaten desteklediği `?ayah=` derin-link parametresi kullanılarak, sûre-only 404'a düşürmek yerine spesifik ayete atlama korunuyor). Canlı doğrulandı — 3 link de 200 dönüyor.
4. ✅ **Site geneli — eksik segment içeren dinamik rotalar** — `/tr/ayet/2` markasız 404'e düşüyordu. **Düzeltildi**: yeni `src/app/[locale]/ayet/[surah]/page.js` eklendi — geçerli sûre numarasını `/ayet/{sure}/1`'e yönlendiriyor, geçersiz sûre için `notFound()` ile sitenin temalı not-found.jsx'i tetikleniyor. Canlı doğrulandı — `/tr/ayet/2` → 200 → `/tr/ayet/2/1`.

### 🟠 Yeni sistemik CSS/sticky mekanizması (CLAUDE.md §13.31'e "Mekanizma 4" olarak eklendi) — TÜMÜ DÜZELTİLDİ ✅
5 dosyada + paylaşılan `SectionWrapper.jsx`'te aynı kök neden tekrarlanıyordu: bir sticky elemanın atası `overflow-x:hidden` ya da kendisi hiç scroll olmayan bir `overflowY:'auto'` taşıyor — CSS spesine göre bu ata yine de sticky'nin "containing block"u oluyor ve çocuk `top`'a hiç kenetlenmeden kayıp gidiyor. **Hepsi düzeltildi ve canlı doğrulandı** (ilgili `bodyRef`'ten overflow bildirimi kaldırılarak):
- ✅ `Melekler.jsx:1343,1498` — 0 örtüşme.
- ✅ `RetorikSorular.jsx:135,227` (en ciddi vaka idi) — sekme çubuğu artık görünür, 0 örtüşme, tab-uppercase de eklendi.
- ✅ `TarihselKanitlar.jsx:177,324` — 0 örtüşme.
- ✅ `DogaAtlasi.jsx:1582,1592` — sekme çubuğu scroll 3000'de bile `top:110px`'te kenetli kalıyor (önceden -1857px'e kayıyordu).
- ✅ `FurukAtlasi.jsx:181,236` — sekme çubuğu scroll 2000'de `top:110px`'te kenetli kalıyor (önceden -1581px'e kayıyordu).
- ✅ `sections/HiddenArchitecture.jsx:661` + `components/SectionWrapper.jsx:71` — `SectionWrapper`'a opt-out `clip` prop'u eklendi (varsayılan `true`, diğer ~53 section etkilenmedi). Ata zincirinde artık `overflow:visible`, ana sayfada görsel regresyon yok. *Not: prizma panelinin görsel "yapışma" penceresi kendi grid'inin (içerik yüksekliğine eşit) oranı nedeniyle dar — CSS mekanizması artık doğru, görünürlük genişliği ayrı bir içerik/layout inceliği.*

### 🟡 Mechanism 2 — hardcoded `top:'110px'` — TÜMÜ DÜZELTİLDİ ✅
`useNavbarOffset(0, 62)` + `navTop + 48` deseniyle, hepsi canlı doğrulandı (0 örtüşme):
`CennetCehennem.jsx:387`, `SunnetullahAtlasi.jsx:556`, `KuranYeminleri.jsx:361` (+ RadialViz hydration mismatch de düzeltildi), `ZamanBoyutlari.jsx:1745`, `BilimselIsaretler.jsx:255` (+ içerik kuralı ihlali de düzeltildi), `QuranCommands.jsx:408`, `DuaDili.jsx:141`, `KiyametSahneleri.jsx:696` (+ bare verse-ref de düzeltildi), `YakinAnlamliNuanslar.jsx:195` (+ tab-uppercase de düzeltildi), `IbadetlerPillar.jsx:124` (7 rota: hac/kurban/namaz/oruç/tövbe/zekât/zikir — tek merkezi dosya, hepsi kapsandı), `KiraatAtlasi.jsx:1640` (mobil, + tab-uppercase + bare verse-ref de düzeltildi), `NefisMertebeleri.jsx:365` (aynı deseni paylaşan dosyanın kendi `navTop` değişkeni yeniden kullanıldı).

**Bu bölümdeki TÜM maddeler 16 Ağustos 2026 akşamı commit `d3257d9` ile main'e push edildi** (25 dosya, lint temiz, tüm audit'ler geçti, canlı Playwright doğrulaması tamamlandı).

### 🟡 §13.32 çıplak ayet referansı — TÜMÜ DÜZELTİLDİ ✅
- ✅ `CennetCehennem.jsx:1258,1288` — tüm refler "Rahman 55:N" formatına çevrildi.
- ✅ `TefsirIhtilaflari.jsx:130,148` — `SURAH_NAMES_TR` + `surahShortName()` eklendi (ör. "Bakara 2:17-20").
- ✅ `KiyametSahneleri.jsx` TEKVER_IDHA dizisi (13 kayıt) — hepsi "Tekvir 81:N" formatına çevrildi.
- ✅ `KiraatAtlasi.jsx:673` — `{v.surahName} {v.surah}:{v.ayah}` formatına çevrildi.

### 🟡 Tab-bar büyük harf tutarsızlığı — TÜMÜ DÜZELTİLDİ ✅
`InsanYolculugu.jsx:220-238`, `TefsirIhtilaflari.jsx`, `RetorikSorular.jsx`, `YakinAnlamliNuanslar.jsx:203-231`, `KissaAtlas.jsx` (3 ayrı sekme çubuğu — masaüstü/mobil peygamber sekmeleri + Sahneler/Harita/Detay alt çubuğu), `KiraatAtlasi.jsx:1653-1667` — hepsi `textTransform:'uppercase'` aldı, canlı doğrulandı.

### 🟡 Konsol hataları (React hydration mismatch / key çakışması) — TÜMÜ DÜZELTİLDİ ✅
- ✅ `/arac/yeminler` — `RadialViz`'in `arcPath()`/`labelPos()` fonksiyonlarındaki trig-tabanlı koordinatlar artık `.toFixed(2)` ile yuvarlanıyor.
- ✅ `/arac/retorik` (gerçek dosya adı `KuranRetorigi.jsx`) — "Seçilmiş Sorular" sekmesinde 3 farklı filtre grubunun ("tip", "kalıp", "muhatap") `key="all"` çakışması `key={`${group}-${value}`}` ile çözüldü.
- ✅ `/atlas/munasebat` — `isMobile` state'i artık sunucu VE ilk istemci render'ında `false` başlıyor (SSR-safe pattern), gerçek değer yalnız mount-sonrası `useEffect`'te set ediliyor.
- ✅ `/graf/diyalog` — `TabAgHaritasi`'nin SVG düğüm/kenar koordinatları artık `.toFixed(2)` ile yuvarlanıyor.
Hepsi canlı doğrulandı — konsol temiz, her iki viewport'ta da.

### 🟡 İçerik kuralı ihlali — §13.24 "TASDİKİN YÖNÜ" — DÜZELTİLDİ ✅
`/arac/bilimsel-isaretler` — süt oluşumu kartının `criticalNoteTr`/`criticalNoteEn`'i "fizyoloji tasdik eder / physiology confirms" yerine "biz tasdik ederiz / we affirm" çerçevesine çevrildi (yön düzeltmesi — Kur'ân haber verir, BİZ teyit ederiz; bilim Kur'ân'ı tasdik ETMEZ). Canlı doğrulandı, sayfada doğru render oluyor.

### En düşük içerik puanları (10 üzerinden, ≤6)
- ✅ `/arac/alti-konu` — 4/10 → **düzeltildi** (commit `1f74931`): Highlights.jsx aynen korunarak altına 6 konunun her biri için gerçek ayet metni (verse-graph'tan doğrulanmış) + kaynakça eklendi. Canlı doğrulandı.
- ✅ `/arac/kitap-kavrami` — 6/10 → **düzeltildi** (commit `e40ffbb`): (1) faktüel hata — Furkân girişi Türkçe metinde "İbrâhim'e verilen furkân (2:53)" diyordu, doğrusu Mûsâ (Bakara 2:53 açıkça Mûsâ'dan bahseder, İngilizce versiyon zaten doğruydu); (2) sayı tutarsızlığı — giriş metni "11 farklı isim" diyordu, veri kümesi 10 kayıt içeriyor, "10"a çevrildi (TR+EN).
- ✅ `/graf/kavram` — 6/10 → **düzeltildi** (commit `53ecb3e`): kavram-ayet bağlantıları anahtar kelime alt-dizi eşleşmesiyle hesaplanıyordu ama yöntem hiç açıklanmıyordu. WordHeatmap'teki `DataDictionary` paneli eklendi, eşleştirme yöntemi + ağırlık formülü (kod okunarak doğrulandı) belgelendi.
- ✅ `/graf/semantik` — 6/10 → **düzeltildi** (commit `74da718`): (1) meta açıklama yanlışlıkla "UMAP 2D projeksiyon" diyordu, sayfa aslında kart listesi — düzeltildi; (2) Louvain/BGE-M3/eşik/28→20 küme filtrelemesi hiç açıklanmıyordu, DataDictionary eklendi; (3) mobilde "Sıra (ID)" sıralama düğmesi ekran dışına taşıyordu, flexWrap ile düzeltildi. **Not:** aynı mobil taşma deseni `/graf/kelime-isi`'de de var (audit'in kendi tespiti) — henüz dokunulmadı, ayrı bir madde olarak takip edilmeli.
- ✅ `/kutuphanem` — 6/10 içerik → içerik puanı zaten yapısal (kişisel araç, editoryal içerik gerektirmiyor); tek somut sorun (görsellik) düzeltildi, bkz. aşağı.
- ⚠️ `/tefekkur/anlam-yaratilis-senteni`, `/tefekkur/yaratilis-hikayesi-1-giris` — 6/10 → **incelendi, bilinçli olarak dokunulmadı.** Her iki makale de sitenin kendi editoryal sesi DEĞİL — `sufist.medium.com`'dan (yazar: "Felsufi") sendike edilmiş dış içerik (`canonicalUrl` alanı bunu doğruluyor). Audit'in önerileri ("bir ayet çapası ekle", "içeriği genişlet", "part 2'ye birleştir") bir dış yazarın yayınlanmış metnine editoryal müdahale gerektiriyor — bu benim tek taraflı yapabileceğim bir şey değil, ya orijinal yazarın kendisi ya da site sahibinin editoryal kararı gerekiyor. `yaratilis-hikayesi-1-giris`'in zaten `nextArticle`/`relatedVerses` metadata'sı doğru dolu; `anlam-yaratilis-senteni`'nin `relatedVerses` alanı boş ama doldurmak da hangi ayetin "doğru" çapa olduğuna dair bir yorum kararı — kullanıcı onayı olmadan eklenmedi.

### En düşük görsellik puanları (≤6)
- ✅ `/atlas/ahiret-yolculugu` — 3/10 → **düzeltildi** (commit `98b312d`): whileInView scroll-reveal geç tetikleniyordu (margin:'-80px'), hızlı scroll'da 4500px boşluk oluşuyordu. `margin:'400px 0px'` + defansif initial-opacity 0.4 ile çözüldü, canlı doğrulandı.
- ✅ `/arac/retorik-sorular` — 4/10 → **düzeltildi** (commit `18d1067`): kök neden aslında sayfaya özgü değil, paylaşılan `SectionWrapper.jsx`'in scroll-reveal'ı geç tetikleniyordu (bkz. yukarıdaki "Mekanizma 4" notu ve ayrı bulunan bu sistemik fix). Site genelinde (~54 bölüm) düzeltildi. **Açık kalan karar noktası (bug değil, IA sorusu):** bu sayfanın içeriği (istifhâm alt türleri) `/arac/retorik`'in içeriğiyle örtüşüyor — iki sayfa birleştirilmeli/yeniden kapsamlandırılmalı mı, kullanıcı kararı gerekiyor, şimdilik dokunulmadı.
- ✅ `/arac/mukattaa` — 5/10 → **düzeltildi** (commit `8f92a14`): aynı SectionWrapper scroll-reveal kökeni, otomatik çözüldü + "eşsiz" mutlak iddiası yumuşatıldı.
- ✅ `/kutuphanem` — 5/10 → **düzeltildi** (commit `f2ec567`): boş-durum ikonu ham 🔖 emojisiydi, site SVG ikon diline (BookmarkButton'daki aynı path) çevrildi; metindeki "item'ları"/"button" İngilizce karışımı temizlendi.
- ✅ `/arac/tefsir-ihtilaflari` — 5.5/10 → **düzeltildi** (commit `476d358`): (1) gerçek mobil örtüşme bug'ı — kök `paddingTop:'62px'` hardcode, gerçek navbar 84px, 22px fark tab çubuğunun ToolHeader içine başlamasına yol açıyordu, `useNavbarOffset` ile düzeltildi; (2) kardeş sayfalarda olan hero bloğu (bismillah+ayet+çerçeveleme) eklendi — Âl-i İmrân 3:7 (muhkem/müteşabih), Arapça metin verse-graph'tan birebir doğrulandı.
- ✅ `/arac/kurani-tani` — 6/10 → **düzeltildi** (commit `858fdc8`): 3 doğrulanamaz mutlak iddia yumuşatıldı ("tartışmasız" kaldırıldı, "tek kutsal kitaptır" karşılaştırması kaldırıldı, Tevrat/Tekvin 3 karşılaştırması hedge edildi). Audit'in "mobil 19.000px boşluk" bulgusu doğrudan incelendi, canlı tekrarlanamadı (50/50 kart DOM'da, normal yükseklikler) — muhtemelen audit aracının kendi yanlış-pozitifi, kod değişikliği yapılmadı.
- ✅ `/atlas/insan-psikolojisi` — 6/10 → **düzeltildi** (commit `6accb5c`): en görsel açıdan hasarlı bulgu — "Daha Derine — Psikolojik Derinliği Yüksek Sûreler" başlığından sonra 320px tamamen boş alan (aynı whileInView/margin geç-tetikleme deseni, bu kez `src/sections/PsychologySection.jsx`'te — ana sayfa bölümü bu sayfaya gömülü). Düzeltildi + masaüstü tab taşma ipucu eklendi + "Isfahânî" yazım hatası düzeltildi.

### Genel bug envanteri (26 sayfada en az 1 "diğer" bug bulundu)
Tip dağılımı: 13 typo, 6 diğer, 4 konsol hatası, 3 mobil kırılma, 2 işlevsiz UI, 2 kırık link. Typo'lar sayfa bazlı bölümlerde listelidir.

---

## Araçlar (/arac/*)

### `/arac/alti-konu`

**İçerik: 4/10** — AltiKonu is a thin wrapper: it re-renders the homepage's Highlights section verbatim (6 'wow fact' cards: prefrontal cortex, fingerprints, modular narrative, word map, time flexibility, iltifat) plus a hero and a 3-link CrossToolCTA. It has essentially zero content unique to the /arac/ route -- everything is duplicated from src/sections/Highlights.jsx, which already lives on the homepage.
- Güçlü yönler:
  - The underlying Highlights cards (pulled from tr.json highlights.cards) are properly hedged -- e.g. the prefrontal-cortex/Alak 96:15-16 claim explicitly flags it as a 'contemporary reading' and cites classical tafsir (Taberi) reading nasiya as a metaphor, not anatomy
  - Anchor verse (Muhammed 47:24) and framing are on-brand and correctly cited
- Sorunlar:
  - No original content: this route is a full duplicate of the homepage Highlights section -- a visitor who saw the homepage gets nothing new here
  - Page markets itself as 'Six Topics, Six Secrets' deep-dive but delivers only the same six short teaser cards already on '/'; no added depth, verses, or sourcing beyond the homepage version
  - CrossToolCTA sends users to 3 unrelated pages (insan-tanimi, insan-psikolojisi, kavram) instead of expanding on the six topics itself
- İyileştirme önerileri (içerik):
  - Either merge this route into the homepage (redirect) or genuinely expand each of the 6 cards with the fuller sourced treatment already written elsewhere in the codebase (WowFacts.jsx has richer Bucaillism-aware critical notes) instead of the compressed Highlights.jsx copy
  - Add a per-topic detail view (verse list, classical vs modern reading, sources) so the page justifies a standalone URL rather than being a bare re-render

**Görsellik: 8.5/10**
- Masaüstü: Strong hero (bismillah, verse quote, title), 3x2 accordion card grid for the 6 'discoveries', followed by 'ilgili ayetler' and 'ilgili araçlar' 3-col card rows. Consistent gold/dark theme, good hierarchy, generous whitespace. All content renders correctly on scroll (initial fullPage capture looked like it had a huge blank gap after the accordion grid, but that was a screenshot artifact — real scroll shows the verse-reference cards there fine).
- Mobil: Cards stack cleanly 1-col, no overlap or cramping. Accordion icon+number+chevron rows keep comfortable tap targets. No mobile-specific defects found.
- Sorunlar:
  - Accordion cards (01-06) and the 'ilgili ayetler'/'ilgili araçlar' cards below use near-identical visual treatment (same border/bg/radius), so the page reads as a long stack of similar boxes without strong visual rhythm between sections.
  - Persistent bottom-left floating 'N' widget sits close to card edges on mobile at some scroll positions (minor, site-wide chrome not unique to this page).
- İyileştirme önerileri (görsellik):
  - Differentiate the related-verse cards from the related-tool cards visually (e.g. a subtle icon or accent color per surah) so the eye can parse section boundaries faster on a long single-column scroll.
  - Consider a slightly larger/bolder treatment for the 6 accordion items' Arabic-topic icons to give the 'wow' section more visual weight relative to the rest of the page.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/bilimsel-isaretler`

**İçerik: 8/10** — 16 verses across 5 domains (astronomy, earth sciences, biology, human/embryology, meteorology), each pairing a Quranic term with a modern scientific parallel, a classical-tafsir reading, and an explicit criticalNote hedging the 'foreknowledge' claim. Intro text explicitly names and critiques Bucaillism (citing Sinai, Neuwirth) and states the tool makes no foreknowledge claim -- directly implementing the site's own CLAUDE.md 13.24 framework.
- Güçlü yönler:
  - Every single entry has a criticalNoteTr/En that explicitly pushes back on overclaiming (e.g. 'the claim the Quran foreknew Hubble overreaches', 'a Big Bang claim is exaggerated')
  - Cites specific classical exegetes (Razi, Ibn Kesir, Kurtubi, Elmalili) alongside modern academics (Guessoum, Ibn Kathir sources) for every entry
  - Explicitly separates 7th-century common knowledge (star navigation) from genuinely striking correspondences (water cycle, embryology terms), avoiding blanket overclaiming
- Sorunlar:
  - Direct violation of the site's own explicit rule (CLAUDE.md 13.24 'TASDIKIN YONU'): the sut-olusumu (milk formation) card's criticalNoteTr says 'Kur'an haber verir, fizyoloji tasdik eder' and criticalNoteEn says 'physiology confirms' -- this is precisely the forbidden framing the rule calls out (only 'we affirm' is permitted, not 'science/physiology confirms')
  - A few entries still use 'kanit'/'kanitlarindan' adjacent phrasing (e.g. yildiz-yol summary calls it one of the best proofs the Quran isn't a science book) which is fine in context but shows the hedging isn't 100% uniform across all 16 cards
  - Some sourcesTr citations (e.g. specific Razi/Ibn Kesir tafsir page pointers) are not independently verifiable from the file alone -- per the site's own 13.30 rule, this class of specific classical citation should be pre-verified before publishing
- İyileştirme önerileri (içerik):
  - Fix the sut-olusumu (milk) criticalNote to say 'we affirm' instead of 'physiology confirms/tasdik eder' -- this is a one-line, concrete, high-priority fix since it's the exact anti-pattern CLAUDE.md 13.24 names
  - Run a fresh pass replacing any remaining 'confirms/tasdik eder' language site-wide in this file per the existing house rule
  - Consider adding a short 'how to read this page' disclaimer link to the elestirel-cerceve bilim-onceleme question, since both pages cover overlapping ground (Iʿjaz Ilmi critique) and could cross-reference instead of risking drift

**Görsellik: 9/10**
- Masaüstü: Excellent long-form scholarly layout: hero with verse + framing note, an 'örtüşme okuması' pill, then 16 numbered sign cards each with icon, category label, verse block, classic-vs-modern commentary paragraph, and a collapsible 'Nüans & Kaynaklar'. Category-colored icon badges (purple/teal/etc.) add variety without breaking the gold/dark system. Ends with a classic-sources 2x2 grid and related-tools row.
- Mobil: Single column reflow is clean; long paragraph blocks remain readable at 390px; icon+badge+title header wraps gracefully. No overlap or clipping found across the full scroll.
- Sorunlar:
  - 16 cards is a long uninterrupted scroll with fairly uniform card styling — no sub-navigation/jump links or sticky category filter to skip between astronomi/biyoloji/insan/meteoroloji groups shown in the breadcrumb subtitle.
- İyileştirme önerileri (görsellik):
  - Add a sticky in-page filter/jump bar (by the 5 fields listed in the subtitle: astronomi, yer, biyoloji, insan, meteoroloji) similar to the category tabs used on /arac/buyruklar, so a 16-card list becomes scannable rather than purely linear.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `BilimselIsaretler.jsx:255` tab bar hardcodes `top:'110px'`; canlı testte ToolHeader ile 15-35px örtüşme (sticky aktivasyon noktasında).

---

### `/arac/buyruklar`

**İçerik: 7/10** — A browsable database of ~90 direct Quranic commands (emir) and prohibitions (nehiy) across 8 categories (worship, family, ethics, wealth, knowledge, prohibitions, social justice, communication). Each item is a literal verse quote with surah name + verse ref, no editorializing. A disclaimer explicitly labels the list as a curated summary, not exhaustive commentary.
- Güçlü yönler:
  - Verse references always render as 'surahName + ref' (e.g. 'Bakara 2:43'), compliant with the site's own 13.32 rule against bare numeric refs
  - Explicit 'curated selection, not comprehensive commentary' disclaimer sets correct expectations
  - Low risk: content is essentially direct verse quotation, minimal room for overclaiming
- Sorunlar:
  - The hero intro text promises a '5 hukum' (5 fiqh-ruling: vacip/mendub/mubah/mekruh/haram) classification framework, but the actual data only tags each item as binary emir/nehiy -- the 5-tier fiqh classification is described but never applied to any individual command, so the promised depth isn't delivered
  - No source/methodology note for how the ~90 commands were selected out of the many imperative verses in the Quran -- selection criteria are opaque beyond 'curated'
  - Purely a list/browse tool with no comparative or interpretive layer (e.g. no notes on abrogation, context-of-revelation, or scholarly disagreement about scope of a command) despite the site having a dedicated Sebeb-i Nuzul tool it could link into more directly per-item
- İyileştirme önerileri (içerik):
  - Either add per-item fiqh-ruling tags (vacip/mendub/mubah/mekruh/haram) to actually deliver the '5 hukum' framing promised in the intro, or soften the intro copy to just 'emir/nehiy' since that's what's shown
  - Add per-category counts/summary stats so users see distribution at a glance (e.g. worship=13, family=12...) which the data already supports but isn't surfaced
  - Consider flagging commands with well-known scholarly disagreement about literal vs. contextual application (the tool currently treats every command as flat and equally binding)

**Görsellik: 8.5/10**
- Masaüstü: Sidebar of 8 category chips (with counts) + Tümü/Emirler/Yasaklar toggle + 2-col EMİR/YASAK card grid with Arabic, translation, verse ref. Clean stat pills (57 Emir/31 Yasak/8 Kategori) under the hero. Classic-sources grid and related-tools row close the page consistently with the rest of the site.
- Mobil: Category sidebar becomes a horizontally-scrollable chip row; only ~2.5 chips are visible in the viewport with the 3rd cut off mid-label and no fade/arrow hinting more content exists off-screen. Cards themselves stack fine 1-col with no overlap.
- Sorunlar:
  - Mobile category-chip row (İbadet ve Kulluk / Aile ve Toplum / ...) has no visual affordance (edge fade, arrow, or partial-next-chip peek beyond the abrupt cut) indicating it scrolls horizontally — easy to miss the other 6 categories.
  - The 57/31/8 stat pill row sits directly above a small italic disclaimer line with tight spacing on both breakpoints, making that transition feel slightly cramped compared to the rest of the page's generous rhythm.
- İyileştirme önerileri (görsellik):
  - Add a right-edge gradient fade (or a small chevron) on the mobile category-chip scroller so users notice it's scrollable, matching a pattern this page already needs and reusing it across the other pages with the same chip pattern (/arac/dualar, /arac/ilk-son-kelimeler, /arac/dua-dili tabs).
  - Increase top margin before the '57 Emir / 31 Yasak / 8 Kategori' stat row so it doesn't feel glued to the intro paragraph above it.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `QuranCommands.jsx:408` sticky kategori kenar çubuğu `top:'110px'`; örtüşme canlı doğrulandı.

---

### `/arac/cennet-cehennem`

**İçerik: 9/10** — A structured, well-hedged Paradise/Hell reference: names, rivers, plants, inhabitants (huris, wildan, ridwan), physical attributes, Hell's foods (zaqqum, ghislin, dari), a 5-sense breakdown of Hell's descriptions, the A'raf 'in-between' region, and the 31x Rahman refrain. Every item that draws on hadith rather than Quran is explicitly flagged isHadis:true, and a global disclaimer states no claim is made that the Quran confirms hadith.
- Güçlü yönler:
  - Systematic isHadis/isHapax/isSessizlik ('silence') flags let users see exactly what's Quran-sourced vs hadith-sourced vs deliberately unmentioned by the Quran (e.g. 'the Quran does not describe the smell of Hell')
  - Genuinely nuanced items -- e.g. the huri item explicitly notes 'some scholars interpret hur differently, this is present in academic literature' rather than asserting a single reading
  - Classical + academic sources cited (Ibn Kathir, Tabari, Elmalili, Kurtubi, TDV Islam Ansiklopedisi, Corpus Quran) with a clear methodology footer
- Sorunlar:
  - Minor formatting bug: the 'gaslin' item's English description has a stray trailing comma/quote artifact ('or pus.",') suggesting an unclean string concatenation
  - The 8-gates item cites 'Zumer 39:73' as its kaynak while marking isHadis:true for the specific number 8 -- correct in substance but the single shared 'kaynak' field conflates a Quran-sourced context verse with a hadith-sourced number, which could read as implying the Quran states '8' when it doesn't
  - No cross-reference to the site's own Kiyamet/Zaman Boyutlari tools despite thematic overlap (afterlife content is scattered across multiple tool pages without a unifying nav)
- İyileştirme önerileri (içerik):
  - Fix the stray comma/quote typo in the gaslin English description
  - Split the 'kaynak' field for hadith-derived numbers (like the 8 gates) into a clearer 'Quran context + hadith source for the number' two-part citation so the boundary is unambiguous at a glance, not just via the isHadis flag
  - Add a CrossToolCTA to Kiyamet/Zaman Boyutlari at the page end, consistent with pattern used on other tool pages

**Görsellik: 9/10**
- Masaüstü: One of the strongest pages: split emerald (Cennet) vs red/orange (Cehennem) two-column layout with a center 'perde' verse card, each name card showing Arabic name, frequency badge ('X kez'), verse refs, and a short gloss, plus 'Hadis'/'Tartışmalı' tag chips for nuance. Color coding reinforces the concept instead of just decorating it.
- Mobil: Columns stack sequentially (all Cennet cards, then all Cehennem cards) which reads fine; color coding and tags carry over correctly. No clipping or overlap issues found.
- Sorunlar:
  - None significant found; the two columns have naturally different total heights (content-driven), which is expected/acceptable for this content type.
- İyileştirme önerileri (görsellik):
  - On mobile, consider a Cennet/Cehennem toggle (like the buyruklar Tümü/Emirler/Yasaklar pattern) so users can jump straight to one side instead of scrolling through all 9 cennet cards before reaching cehennem.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `CennetCehennem.jsx:387` tab bar `top:'110px'`.
  - [CSS/sticky ailesi] §13.32 çıplak ayet referansı — `CennetCehennem.jsx:1258,1288` — `{item.ref}` çıplak render ediliyor (ör. "55:46-53").
  - [non-functional] Tab bar buttons (İsimler / Cennet / Cehennem / A'râf / Rahman Simetrisi / Kaynaklar) overlap each other's clickable area by ~64px on desktop (~28px on mobile) and are unreliable to click. Root cause: the tab-bar container (#cennet-tab-bar, src/components/CennetCehennem.jsx line ~376) sets CSS custom properties --ml-d/--mr-d: -32px (--ml-m/--mr-m: -14px on mobile) via the shared `.mq-box` utility class, intended to bleed the bar to the screen edge. Each individual tab <button className="mq-box"> (same file, line ~396) does not reset these vars, so it inherits them too (CSS custom properties cascade to descendants), giving every tab button its own -32px/-32px negative margin and making adjacent tabs overlap. Confirmed with Playwright: getBoundingClientRect() of the 6 tab buttons show real horizontal overlap (e.g. 'İsimler' spans x129-265, 'Cennet' x203-339 — 62px overlap), and clicking the visible 'A'râf' label times out because document.elementFromPoint at that location actually resolves to the neighboring 'Rahman Simetrisi' button (which paints on top as it is later in DOM order). Later tabs steal clickable territory from earlier ones; only the last tab (Kaynaklar) is fully unaffected.

---

### `/arac/dua-dili`

**İçerik: 8/10** — Extends the homepage's 6-prophet Quranic-prayer section with 4 more prophet profiles (Adam, and others), a 4-layer 'anatomy of a dua' framework (vocative -> petition -> reasoning -> seal with divine names) sourced to Ibn al-Qayyim and al-Suyuti, and a response-pattern grid mapping each prophet's petition to its Quranic answer with verse refs.
- Güçlü yönler:
  - The dua-anatomy framework is explicitly attributed to a named classical source (Ibn al-Qayyim's al-Wabil al-Sayyib) rather than presented as house analysis
  - The Adam profile draws a genuinely illuminating classical contrast (Iblis blames God vs. Adam takes responsibility) with correct verse chaining (A'raf 7:23 -> Baqara 2:37) and cites multiple classical exegetes for the pattern
  - Noah's '~950 years' figure is the literal Quranic number (29:14, 1000 minus 50) rendered accurately with 'approximately' hedging
- Sorunlar:
  - This tool's content is additive to a component (QuranDua in sections/) that isn't part of this JSON file -- meaning the page's full content is split across two data sources (public/dua-dili.json + sections/QuranDua.jsx), making it hard to audit or maintain as one unit and risking drift between the 6 'existing' and 4 'new' prophet profiles in tone/depth
  - No explicit criticalNote/hedge pattern comparable to bilimsel-isaretler's -- for a page dealing with classical tafsir attributions (e.g. specific Razi/Kurtubi/Ibn Kesir claims about ẓalamna anfusana being a template phrase) there's no per-claim sourcing note beyond a general classicalSources citation
- İyileştirme önerileri (içerik):
  - Consolidate the prophet-profile content into a single data file (fold the original 6 into dua-dili.json) so the full roster is auditable and stylistically consistent in one place
  - Add page/volume-level citations for the classical-source claims (currently just 'Ibn al-Qayyim, al-Wabil al-Sayyib' with no locus) per the site's own 13.30 sourcing-verification rule

**Görsellik: 9/10**
- Masaüstü: Rich page: 4-tab sticky sub-nav (Peygamber Duaları / Dua Anatomisi / Cevap Kalıpları / Kaynaklar), color-legend-coded 'Rabbenâ' dua grid (Câmi orange / Sabır green / Bağışlanma purple / İman blue), each card with Arabic + translation + verse ref + tilâvet play icon, ending in a tag-cloud of prayer themes and related-tools row.
- Mobil: Sticky sub-nav shows only 2 of 4 tabs in the 390px viewport ('Peygamber Duaları' / 'Dua Anatomisi') with the other two ('Cevap Kalıpları', 'Kaynaklar') requiring an unsignposted horizontal scroll/swipe. Card grid itself reflows to 1-col cleanly with legend intact.
- Sorunlar:
  - Sticky 4-item tab bar on mobile has no scroll indicator, so 2 of 4 tabs are effectively hidden until a user thinks to swipe the tab bar itself.
  - Color-legend dots (Câmi/Sabır/Bağışlanma/İman) are small and rely on the left border accent of each card to reinforce meaning; on mobile the legend row can wrap awkwardly at narrow widths.
- İyileştirme önerileri (görsellik):
  - Convert the 4-tab sticky nav to a 2x2 wrap or a select/dropdown on mobile instead of horizontal scroll, since tab bars are a weaker affordance for 'more content' than card carousels.
  - Add a small trailing chevron/fade on the mobile tab bar if horizontal scroll is kept.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `DuaDili.jsx:141` tab bar `top:'110px'`; ~5px örtüşme.

---

### `/arac/dualar`

**İçerik: 7/10** — A large collection (~35+ entries) of Quranic supplications (dua-verses.json) tagged by category and prophet, each with Arabic, Turkish, English, surah/ayah ref, and an optional contextual note. Content is essentially direct verse quotation of prayers rather than editorial commentary, so factual risk is low.
- Güçlü yönler:
  - Verse text and category tagging is clean and consistent; prophet attribution (e.g. Hz. Yunus's whale prayer) is accurate and correctly referenced
  - Low editorial-claim surface area since most content is literal Quranic prayer text plus short context notes
  - The 'table from heaven' dua (5:114) is included with correct prophet attribution (Isa) and full verse text
- Sorunlar:
  - The Turkish translation of 'ayatan minka' in the Ma'ida 5:114 dua renders 'a sign from You' as 'senden bir mucize' (a miracle from You) rather than a more literal 'bir ayet/isaret' (a sign) -- a mild overtranslation toward miraculous framing given the site's general caution around unhedged miracle language elsewhere
  - No apparent thematic grouping/filter UI content audited beyond raw JSON; unclear whether users can browse by prophet vs. by need (rizik, tovbe, etc.) -- category field exists but page-level curation/intro copy wasn't found in the JSON (likely lives only in the component, not reviewed in full)
- İyileştirme önerileri (içerik):
  - Reconsider the 'mucize' translation choice for ayatan-type verses to align with the site's general house style of preferring 'isaret/ayet' over 'mucize' in verse translations, reserving 'mucize' for verses that unambiguously assert miraculousness
  - Add a short intro/methodology blurb at the top of the tool (parallel to what bilimsel-isaretler and elestirel-cerceve have) explaining how these ~35 duas were selected and how they relate to the dua-dili tool, since the two pages cover overlapping ground without cross-linking in the data

**Görsellik: 8.5/10**
- Masaüstü: Directory-style page: search box + 11 category filter chips with counts (Tümü 77, Af 10, Tevbe 5...), 2-col card grid with category/context tag, Arabic dua, translation, and a 'Tilâvet' audio-play affordance. Clean and consistent; closes with a source-disclaimer paragraph, classic-source note, and related-tools row.
- Mobil: Filter chip row is horizontally scrollable and only shows ~4 of 11 categories before cutting off mid-chip, same unsignposted-overflow pattern seen elsewhere on the site. Cards stack 1-col cleanly with 'Tilâvet' button remaining tappable.
- Sorunlar:
  - 11-category filter row on mobile has no scroll affordance, and 'Tümü 77' being the only pre-selected/visible-active state doesn't hint how many more categories exist off-screen.
  - 77 duas as a flat 2-col (desktop) / 1-col (mobile) list with no visible pagination or 'load more' — long scroll with fairly repetitive card structure once past the first ~10.
- İyileştirme önerileri (görsellik):
  - Reuse a single shared 'scrollable chip row' component with a consistent fade/arrow affordance across this, /arac/buyruklar, /arac/dua-dili, and /arac/ilk-son-kelimeler so mobile users learn the pattern once.
  - Consider paginating or lazy-loading the 77-item dua grid past the first ~12 cards to shorten the initial scroll.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/elestirel-cerceve`

**İçerik: 9/10** — A 'hard questions' tool tackling 8 genuinely contested topics (inheritance inequality, Nisa 4:34 'strike them', slavery, jizya, Noah's flood scope, scientific-miracle claims, Lut/sexuality, muhkam-mutashabih) with explicit multi-position framing: classical view + modern academic critique + named sources on both sides, and an opening principle statement that 'no claim to finality is made'.
- Güçlü yönler:
  - Genuinely balanced treatment of ethically fraught topics (e.g. Nisa 4:34) citing both classical limiting interpretations (Razi's 'symbolic, non-injurious' reading) and modern alternative-translation scholarship (Bakhtiar, Kecia Ali) without picking a side dogmatically
  - The bilim-onceleme entry is a model implementation of the site's own anti-Bucaillism policy, naming Rida/al-Najjar as the historical source of the overclaiming trend and citing Guessoum/Sardar critiques by name and year
  - Front-loads an explicit epistemic-humility principle ('the aim is not defense but seeing the question itself... no claim to finality') that sets the right tone for the whole page
- Sorunlar:
  - The Nisa 4:34 entry states 'in the Quran 58+ non-strike usages' of the d-r-b root as a specific unverifiable statistic -- per the site's own 13.30 rule against unverified specific numeric claims, this figure needs a citable source or should be softened to a qualitative claim
  - Same entry's body text names 'Mohammed Mahmoud, Ayse Gormez' as supporting the alternative reading, but neither appears in the entry's own modernSources citation list (which only lists Bakhtiar and Kecia Ali) -- a direct internal sourcing inconsistency
  - 8 questions is a fairly thin roster for a page titled 'Hard Questions' given how many other contested topics exist (e.g. abrogation, Quran's relationship to earlier scripture, gender-witness testimony 2:282) -- scope feels like a first wave rather than complete
- İyileştirme önerileri (içerik):
  - Either find a citable source for the '58+' d-r-b usage count or replace it with the qualitative claim already made just before it ('~15 meanings') and drop the specific number
  - Add Mohammed Mahmoud and Ayse Gormez to the modernSources array for nisa-4-34-dovme so every named scholar in the body text has a matching citation entry
  - Expand the question roster over time (witness testimony 2:282, abrogation/naskh, apostasy penalty) using the same balanced classical+modern format -- this is the site's strongest template for controversial content and is under-used

**Görsellik: 9/10**
- Masaüstü: Editorial-note callout box sets a scholarly, even-handed tone; category filter pills (Ahlâk & Hukuk, Tarih & Bağlam, Bilim & Kozmoloji, Metot & Yorum) wrap naturally rather than scroll; each question card has a category badge, title, 2-3 sentence balanced summary, and a 'Detaylı Okuma' expander. Classic-sources 2x2 grid + related-tools row close it out consistently.
- Mobil: Filter pills wrap into 2 rows instead of scrolling horizontally — a better mobile pattern than several other pages on this site. Cards and 'Detaylı Okuma' expanders remain fully legible and tappable at 390px.
- Sorunlar:
  - None significant found — this page's filter-pill wrap behavior is actually the pattern the other filter/tab pages (dualar, buyruklar, dua-dili, ilk-son-kelimeler) should be aligned to.
- İyileştirme önerileri (görsellik):
  - Use this page's wrapping filter-pill treatment as the site-wide standard instead of the unsignposted horizontal-scroll chip rows used elsewhere.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/esma-frekans`

**İçerik: 9/10** — The site's flagship esma tool: 114 divine names/attributes with Quranic frequency counts, calibrated against Fuad Abdulbaki's classical concordance, explicit methodology notes on homograph ambiguity, and an explicit disclaimer that counts are approximate and may differ slightly from classical concordances. Supplemented by esma-beyanlari.json (self-declaration verses), pairs, roots, triples, and a surah heatmap.
- Güçlü yönler:
  - Methodology section is a model of appropriate hedging: names the calibration reference, flags which names (Sabur, Mukaddim, Vacid, Macid) are hadith-sourced rather than Quranic, and explicitly states frequency counts are approximate
  - Correctly explains why the tool lists 114 names rather than the classical 99 (adds a 'kurani_sifat' category for Quranic compound epithets like Rabb al-Alamin beyond the classical Names list) instead of silently inflating the count
  - Large, well-structured supporting dataset (pairs, roots, triples, surah heatmap) gives genuine analytical depth rather than just a static list
- Sorunlar:
  - With 114 names each carrying example verses and explanatory text, a handful of individual name explanations were not fully spot-checked for accuracy given the file's size (156KB) -- a full per-entry theological review wasn't feasible in this pass
  - The tool sits alongside a very similar esma-beyanlari.json (self-declaration verses) and the two datasets' relationship/boundary isn't explained anywhere in the reviewed intro text, risking user confusion about what each dataset covers
- İyileştirme önerileri (içerik):
  - Add a one-line explainer distinguishing esma-frekans (frequency counts) from esma-beyanlari (self-declaration verses) directly on the page so users understand why there are two related datasets
  - Consider a periodic spot-check/audit pass (perhaps automated against a canonical concordance) given the file's size and the methodology note's own admission that small differences from classical concordances are possible

**Görsellik: 9.5/10**
- Masaüstü: Very content-rich and the most data-dense page audited: Celâl/Cemâl balance bar, 3-col categorized name grids, a full Nur âyeti block, 'İkili Geçen İsimler' paired-name cards, root-etymology (kök) cards with corpus counts, a 20-column x 20-row 'Hangi Sûre Hangi İsimleri Kümeliyor' heatmap table, and a full sortable/filterable 114-name directory. All sections use scroll-triggered fade/stagger reveal animations — verified these render correctly on real incremental scroll (a naive fullPage screenshot mis-reports large blank gaps because it doesn't trigger the IntersectionObserver-based reveals; not a real bug).
- Mobil: All sections reflow correctly to 1-col; the wide heatmap table becomes horizontally scrollable showing ~4 of 20 name-columns at a time with no scroll-affordance hint (same pattern as chip rows elsewhere). Root-word (kök) cards' staggered fade-in can leave 2 of 3 columns visibly still-fading if the user scrolls fast, but resolves within roughly half a second — not disruptive.
- Sorunlar:
  - The 'Hangi Sûre Hangi İsimleri Kümeliyor' heatmap table has no horizontal-scroll affordance on mobile/narrow desktop — with ~20 name columns, most are undiscoverable without trial-and-error swiping.
  - Per-card scroll-reveal stagger animation can be caught mid-fade during fast scrolling, briefly showing a card as invisible/outlined-only.
- İyileştirme önerileri (görsellik):
  - Add a persistent horizontal-scroll shadow/fade on the heatmap table edges, or collapse it to a top-N (e.g. top 8 names) view on mobile with a 'show all' toggle.
  - Shorten or dampen the stagger delay on the root-word card reveal animation so it completes within one scroll gesture.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (gizli/latent) — kök `paddingTop:'62px'` hardcode, gerçek navbar 82px; şu an Hero'nun kendi üst boşluğu maskeliyor, canlı hata değil ama kırılgan.

---

### `/arac/halka-kompozisyon`

**İçerik: 9/10** — Ring-composition (chiastic structure) tool: reuses the homepage's HiddenArchitecture section, adds an interactive Fatiha SVG ring diagram, and extends with 4 additional worked examples (Al-Mu'minun 23:1-11, all of Al-Baqara, Al-Ma'ida, Musa's Qasas 28 narrative), each citing a specific named scholar (Farrin or Cuypers) with book/publisher/year for the specific structural claim being made.
- Güçlü yönler:
  - Every structural (A-B-C-D-C'-B'-A') claim is tied to a specific named academic source and publication year rather than presented as the site's own analysis -- exactly the kind of per-claim sourcing discipline the rest of the site should aim for
  - SourcesCitation block lists classical (Biqai, Suyuti, Razi) alongside the modern methodological founder (Cuypers) and contemporary reference (Farrin), giving readers a clear intellectual lineage
  - The Fatiha ring diagram is interactive/accessible (aria-labelled, keyboard-focusable nodes) rather than a static image, adding genuine pedagogical value beyond the text
- Sorunlar:
  - All 4 additional ring examples and their specific 7-part outlines are sourced to Farrin/Cuypers without page-locus citations (no page numbers), so per the site's own 13.30 rule the exact verse-range boundaries proposed (e.g. Al-Baqara's ring pivot at 2:104-152) can't be independently verified from the file alone
  - Ring composition itself is a methodologically contested reading strategy in Quranic studies (not universal consensus) -- the page doesn't include a critical/dissenting-view note comparable to what elestirel-cerceve provides for other contested methodologies, despite CrossToolCTA linking to it
- İyileştirme önerileri (içerik):
  - Add page-number loci to the Farrin/Cuypers citations to meet the site's own sourcing-verification bar
  - Add a brief methodological caveat (parallel to the bilim-onceleme question in elestirel-cerceve) noting that ring/chiastic reading is one interpretive lens among several in tafsir scholarship, not a settled consensus -- currently the page presents the structures with full confidence and no dissent

**Görsellik: 9.5/10**
- Masaüstü: Standout page: bespoke animated SVG light-cone/'Mişkat' diagram illustrating the Nur verse's nested imagery, paired with a 7-tab (Fiziksel/Manevi/Bilimsel/Felsefi/İç Dünya/Tasavvufi/İlahi) reading-layer selector with colored status dots, classic-scholar quote callouts, and 'Düşünce Sorusu' reflection prompts. Fâtiha ring-composition (A-B-C-Merkez-C'-B'-A') is shown as a genuine circular/paired diagram. Closes with classic-sources grid and related-tools.
- Mobil: Ring composition is intelligently re-designed for mobile as a vertical A/A'-B/B'-C/C'-D stacked list with connector arrows and an 'A=A′, B=B′, C=C′, D=Merkez' legend at the bottom — a genuine responsive re-think rather than a squeezed-down desktop layout. No overlap or clipping found.
- Sorunlar:
  - None significant found.
- İyileştirme önerileri (görsellik):
  - This page's mobile ring-diagram adaptation (relabeled stacked list + legend) is a strong pattern other diagram-heavy tool pages on the site could reuse when a circular/radial visualization doesn't fit small screens.

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu — `sections/HiddenArchitecture.jsx:661` prizma/katman paneli (`lg:sticky lg:top-20`) hiç devreye girmiyor; kök neden `components/SectionWrapper.jsx:71`'in `overflow-hidden` sınıfı sticky'yi kırıyor. SectionWrapper ~54 paylaşılan ana sayfa bölümünde kullanılıyor — bu diğer sayfaları da etkileyebilir, ayrı takip gerekli.

---

### `/arac/iblis-seytan`

**İçerik: 9/10** — Cross-reads all 7 Quranic retellings of Iblis's refusal to prostrate (Baqara, A'raf, Hicr, Isra, Kehf, Ta-Ha, Sad) in Mushaf order, isolating what's unique to each telling (verb choice, fire-clay argument, jinn identity, lineage targeting, 'with My two hands') with precise linguistic analysis and correct classical-tafsir attributions for contested points (e.g. the zurriyye pronoun in Kehf 18:50).
- Güçlü yönler:
  - Genuinely rigorous close-reading: distinguishes what's asserted 'only' in one surah from what's shared, and each 'unique' tag is a specific, checkable linguistic claim (e.g. ihtinak appears only in 17:62) rather than a vague superlative
  - Correctly hedges the anthropomorphic 'with My two hands' (Sad 38:75) as 'read as metaphor in classical kalam' rather than asserting a literal reading
  - Correctly hedges the contested zurriyye-pronoun question in Kehf 18:50, citing Tabari for the majority reading while implicitly acknowledging it's a a grammatical point worth flagging
- Sorunlar:
  - The numeric verse-count stats (7 surahs, 16-ayah longest, 1-ayah shortest, fire-clay 'only in A'raf and Sad') are presented with full confidence but weren't independently re-verified against the Mushaf in this review beyond a plausibility check -- worth a one-time automated cross-check against verse-graph-bgem3.json given how central these counts are to the page's framing
  - 'Only' claims (ihtinak only in Isra, biyadayye/bi-izzetik only in Sad) are frequent (site style flags 'only' as a red-flag word generally) -- here they are narrow, defensible philological claims rather than sweeping ones, but the sheer density of 'tek'/'only' tags across the page is worth a final linguistic re-check before being fully comfortable
- İyileştirme önerileri (içerik):
  - Run the existing verse-graph-bgem3.json extraction against every numeric claim (ayah counts, 'only' claims) as an automated regression test so future edits can't silently break these specific, checkable claims
  - Consider softening the icon/copy that says 'the horned-skull motif was deemed unfitting' (a dev-note-style comment) to confirm it never leaked into user-facing copy -- the code comment itself is fine but worth a final internal-leak check on this page specifically given how many precise textual claims it makes

**Görsellik: 9/10**
- Masaüstü: Comparative-narrative page: hero with the 'Büyük Reddediş' verse and key-verb glossary, a 7-sûre color-coded legend (Bakara/A'râf/Hicr/İsrâ/Kehf/Tâhâ/Sâd), then a 2-col grid of analytical comparison cards (ayet aralığı, ateş-çamur argümanı, diyalog turu, yaratılış maddesi, soy hedefi, etc.) each tagged back to specific sûre:ayet chips. Classic-sources grid + related-tools row close it out.
- Mobil: Legend row and comparison cards reflow to 1-col cleanly; sûre:ayet chip groups wrap without overlap. No mobile-specific defects found.
- Sorunlar:
  - The 7-sûre color legend at the top is small text with small color dots; on mobile it's the first thing after the hero and easy to skim past, yet it's the key that decodes color meaning used throughout later cards (which mostly use plain tag chips rather than the legend colors directly, reducing its practical payoff).
- İyileştirme önerileri (görsellik):
  - Either apply the 7-sûre legend colors as accents on the comparison-card sûre:ayet chips throughout the page (to make the legend actually load-bearing), or drop it in favor of the plain chips already used.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [broken-link] The 'Vesvese Kanalı' widget (src/components/iblis/VesveseKanaliWidget.jsx, lines 57-60) links three verse references to /oku/{surah}/{ayah} deep links: /oku/16/98 (Nahl 16:98), /oku/7/201 (A'râf 7:201), /oku/25/29 (Furkân 25:29). All three 404 — verified via HTTP (curl returns 404 for http://localhost:3000/tr/oku/16/98, /tr/oku/7/201, /tr/oku/25/29) — because the reading-mode route only exists as /oku/[surah] (no [ayah] sub-route/segment exists under src/app/[locale]/oku/[surah]/). Every other working /oku link on the site uses the surah-only form (e.g. /oku/1, /oku/114). A 4th item in the same widget ('Muavvizeteyn') correctly has href:null and renders non-clickable, so the bug is specific to these 3 surah:ayah-style hrefs.

---

### `/arac/ilk-son-kelimeler`

**İçerik: 7/10** — A complete 114-surah database of first/last words with Arabic, transliteration, root, and Arabic ayah text (100% complete for Arabic text, but transliteration/root/meaning only ~36/114 surahs, i.e. partial), supplemented by an 8-spotlight set of well-sourced cross-surah connections (Fatiha->Baqara, etc.) citing Razi/Biqai/Farrin with volume/page loci.
- Güçlü yönler:
  - The 8 spotlight cards are excellent: specific, sourced (down to volume/page, e.g. 'Razi, Mefatih, II/8'), and make a genuinely illuminating literary point (Fatiha's closing prayer answered by Baqara's opening verse)
  - Meta fields honestly disclose incompleteness (dataCompleteness object states transliteration/root/meaning are 'partial ~36/114') rather than silently presenting partial data as complete
  - Correct verse-reference display pattern (surah name + number, not bare numbers) throughout the rendered UI
- Sorunlar:
  - Top-level 'patterns' and 'statistics' objects in the JSON (mukattaaOpener count, oathOpener count, mekki/medeni counts) appear to be dead/unused data -- the component actually recomputes these same figures live from per-surah flags rather than reading the stored aggregate objects, so the two could silently drift out of sync over time (a maintenance/consistency risk, not a currently-visible bug)
  - One pattern source note contradicts its own 'verified' flag: kulOpener's sources array says 'verse-graph-bgem3.json tarama (dogrulama onerilir)' [scan, verification recommended] while the same object is marked 'verified': true -- an internal self-contradiction in the data, even though this particular field isn't rendered to users
  - The meta.usage field contains raw internal build instructions ('v1.0-skeleton... Node script ile parse edip...') left in the public JSON -- not currently rendered to users (confirmed not referenced in the component), but is dev-jargon sitting in a public-facing file, which is the kind of artifact CLAUDE.md 13.27 warns should never leak
- İyileştirme önerileri (içerik):
  - Either wire the component to read from the stored patterns/statistics objects (single source of truth) or delete those objects from the JSON since they're currently dead data that can drift from the live computation
  - Resolve the kulOpener verified:true vs. 'verification recommended' self-contradiction -- either mark it unverified or complete the verification and update the source note
  - Strip the internal build-process meta fields (usage, tafsirSource dev-instructions) from the production JSON or move them to a non-public location, even though they aren't currently screen-rendered

**Görsellik: 8.5/10**
- Masaüstü: Ambitious data page: search + 8 filter chips (Mukattaa ile, 'Kul' ile, Yemin ile, 'İnnâ' ile, Emir fiili ile, 'Yâ eyyuhâ' ile, İlâhî sıfatla biten, Mekkî/Medenî), a 114-column 'kök spektrumu' mini-grid, a detailed Fâtiha-to-Nâs walkthrough, a 'Müsebbihât Ailesi' 5-sûre tesbih table, sûre-internal ring ('Sûre İçi Halka') cards reusing the halka-kompozisyon visual language, and two related-tools rows.
- Mobil: Filter-chip row cuts off mid-label ('Yemin i...') with no scroll affordance, same as other filter-chip pages. 114-column kök-spektrum grid becomes a tiny dense strip of near-illegible squares at 390px width. Ring/halka cards and tables otherwise reflow acceptably.
- Sorunlar:
  - The 114-sûre 'kök spektrumu' visualization is reduced to a very thin, low-legibility strip on mobile (390px ÷ 114 columns ≈ 3px/column) — effectively decorative rather than usable at that width.
  - Filter-chip overflow on mobile has the same unsignposted-scroll issue as /arac/buyruklar and /arac/dualar.
- İyileştirme önerileri (görsellik):
  - On mobile, either let the kök-spektrum grid scroll horizontally at a legible column width (rather than compressing all 114 columns into the viewport) or swap it for a simplified summary stat on small screens.
  - Apply the same chip-overflow fix recommended for the other filter-chip pages here too.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/kitap-kavrami`

**İçerik: 6/10** — Presents 10 self-names the Quran uses for itself (al-Kitab, al-Furqan, al-Dhikr, al-Huda, al-Nur, al-Shifa, al-Bayan, al-Tibyan, al-Maw'iza, al-Mubin), each grounded in a specific verse and expanded with classical lexicography (largely al-Raghib al-Isfahani's al-Mufradat).
- Güçlü yönler:
  - Each name's explanation is etymologically grounded (root letters, e.g. w-'-z for maw'iza) and ties to a specific anchor verse rather than a generic gloss
  - The Shifa entry correctly identifies the four-attribute sequence in Yunus 10:57 (maw'iza + shifa + huda + rahma) as a deliberate reading-process structure
  - The Tibyan entry appropriately hedges the ambitious 'Quran is a tibyan of everything' claim (16:89) by noting classical tafsir (Razi, Qurtubi) limits 'everything' to 'everything the religion requires', avoiding an overclaim
- Sorunlar:
  - Direct factual/translation inconsistency between languages: the Furqan entry's Turkish text says 'the furqan given to Ibrahim (2:53)' (Ibrahim'e verilen furkan) while the English text correctly says 'the furqan given to Moses (2:53)' -- 2:53 is unambiguously about Musa receiving the Kitab and Furqan ('wa-idh atayna Musa l-kitaba wal-furqan'), so the Turkish version contains a clear factual error misattributing the verse to a different prophet
  - Internal count inconsistency: the page's own intro text (principleTr/En) claims the Quran uses '11 different names + attributes' for itself, but the items array contains only 10 entries -- either an 11th name was dropped or the intro copy wasn't updated to match the shipped data
- İyileştirme önerileri (içerik):
  - Fix the Turkish Furqan entry to say 'Musa'ya verilen furkan (2:53)' matching the correct English version and the actual verse content -- this is a concrete, one-line, high-priority factual fix
  - Either add the missing 11th name (e.g. al-Haqq, al-'Aziz, or another attribute the Quran uses for itself) or correct the intro copy to say '10 different names' to match the actual data

**Görsellik: 8/10**
- Masaüstü: Simple, clean single-column list of 10 'Kur'ân'ın kendi isimleri' concept cards (el-Kitâb, el-Furkân, eş-Şifâ, el-Beyân, et-Tibyân, el-Mev'iza, ...), each with large display Arabic word, short etymological gloss, and a 'Detaylı Anlam' expander. Classic-sources 2x2 grid + related-tools row match the site pattern. Content-appropriate but visually the plainest of the 12 pages audited — no unique chart/diagram component.
- Mobil: Reflows cleanly to 1-col; large Arabic word display remains legible and well-sized; expanders work fine. No defects found.
- Sorunlar:
  - Single-column list stays centered at a narrow max-width even on the 1400px desktop viewport, leaving noticeably more idle side whitespace than the split/grid layouts used on most other tool pages — feels comparatively underbuilt next to pages like /arac/cennet-cehennem or /arac/halka-kompozisyon.
- İyileştirme önerileri (görsellik):
  - Consider a 2-column card grid on desktop (similar to /arac/buyruklar or /arac/iblis-seytan) instead of a single centered column, to use the extra width and give the page a stronger visual identity within the tool suite.
  - A small comparative element (e.g. a compact table cross-referencing the 10 names against 'primary function' — hüdâ=guidance, şifâ=healing, etc.) would give this page the kind of at-a-glance visualization most sibling pages have.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/kiyamet`

**İçerik: 8.5/10** — Data: public/kiyamet-sahneleri.json (26 scene entries across 7 phases + 12 per-surah profiles) rendered by src/components/KiyametSahneleri.jsx. Careful separation of Quranic text from hadith elaboration via explicit quranicStatus/isHapax/infoTr fields (e.g. the İsrafil-blows-the-trumpet detail is flagged 'İsrafil ismi Kur'an'da GEÇMİYOR — hadis geleneğine ait').
- Güçlü yönler:
  - Explicit Quran-vs-hadith flagging on nearly every scene (infoTr fields)
  - Multiple cross-referenced verses per scene (primaryRef + additionalRefs)
  - 12 surah profiles add structural/thematic analysis beyond a flat scene list
- Sorunlar:
  - Hadith-based details (e.g. angel names) are flagged as hadith but not graded/cited (no Bukhari/Muslim reference numbers) the way melekler.json does for the same figures — inconsistent rigor across sibling pages
  - Subjective editorial superlatives ('Kur'an'ın en sinematik kıyamet açılışı') are stylistic flourish, low risk but unverifiable
- İyileştirme önerileri (içerik):
  - Add hadith citation grading (source + sahih/hasan) to infoTr fields, matching melekler.json's standard
  - Cross-check İsrafil/angel entries against melekler.json for consistency between the two pages

**Görsellik: 9/10**
- Masaüstü: Excellent: gold-accent hero, clean stat tiles, colored phase timeline, heat-map süre cards, accordion Kur'an/Hadis sections all consistent with site's premium bar. No layout defects found across full page height (~7071px).
- Mobil: Full content parity with desktop, accordion and Arabic ayet blocks reflow cleanly, no cramping or overlap detected across 6 segments checked.
- Sorunlar:
  - Minor: stat-tile row wraps to 2 columns on mobile without visual regrouping, slightly loses the 6-in-a-row rhythm seen on desktop
- İyileştirme önerileri (görsellik):
  - Consider a 3-col stat grid on mobile instead of 2-col to keep pairs from splitting awkwardly across rows

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `KiyametSahneleri.jsx:696` tab bar `top:'110px'`.
  - [CSS/sticky ailesi] §13.32 çıplak ayet referansı — `KiyametSahneleri.jsx` TEKVER_IDHA dizisi (~86-98/1108) — `{item.ref}` çıplak (ör. "81:1"), oysa aynı dosyadaki KIYAMET_ISIMLERI/HAPAX_WORDS doğru şekilde sûre adını gömüyor.
  - [typo] In the Sûreler tab, the description for Hâkka (69) reads: '"El-hakka — el-hakka nedir? Ne bildirdi sana el-hakka?" — Rettorik self-definition.' "Rettorik" is a misspelling (extra "t"; Turkish word is "Retorik") and the phrase "self-definition" is left in English inside an otherwise Turkish sentence instead of being translated.

---

### `/arac/koruma-zinciri`

**İçerik: 7/10** — Wrapper (src/components/KorumaZinciri.jsx) around the homepage LivingPreservation section (src/sections/LivingPreservation.jsx), content sourced from src/i18n/tr.json's 'livingPreservation' key, plus a page-specific SourcesCitation (Suyûtî, Zerkeşî, İbnü'l-Cezerî, Zehebî) and CrossToolCTA.
- Güçlü yönler:
  - Birmingham manuscript claim carefully hedged: notes parchment carbon-date ≠ ink/writing date
  - Rasm (consonantal skeleton) vs. mütevâtir qirâʾât variation explicitly framed as 'kanıtı, çelişkisi değil' (evidence, not contradiction) — matches the site's own anti-overclaim philosophy well
  - Solid classical bibliography with correct scholar dates/works
- Sorunlar:
  - src/i18n/tr.json 'livingPreservation.experiment' contains an unhedged absolute claim: 'Bu, başka hiçbir kitap için geçerli değildir' ('This applies to no other book') — a flat 'no other X' superlative the site's own standing rule forbids, and not actually verifiable (other oral-transmission traditions exist)
  - Page content is a verbatim duplicate of the homepage section (by explicit design per code comment) — the only route-unique material is the SourcesCitation block and hero verse, so depth-per-dedicated-page is thinner than most other /arac pages
- İyileştirme önerileri (içerik):
  - Soften or cut the 'başka hiçbir kitap için geçerli değildir' line in src/i18n/tr.json and en.json
  - Add tool-exclusive deep content (e.g. an isnad-chain diagram or manuscript timeline) not already on the homepage, to justify the dedicated route

**Görsellik: 7/10**
- Masaüstü: Strong stat-card row (1400+, MS 578, 0 varyasyon), well-paired Yazılı/Canlı Koruma cards with icon accents, isnad chain chip looks great. Marred only by the blank İlgili Süreler section.
- Mobil: Same content reflows well into single column; same blank-section gap present, proportionally more noticeable on the shorter viewport.
- Sorunlar:
  - Empty 'DAHA DERİNE — İLGİLİ SÜRELER' section: heading renders but the card row beneath it is entirely blank, leaving a ~250-300px dead gap before 'KLASİK KAYNAKLAR' — happens identically on desktop and mobile
- İyileştirme önerileri (görsellik):
  - Either populate the İlgili Süreler cards or remove the section heading until content exists; a heading with no content under it reads as a bug to users
  - Add min-content check so empty sections collapse instead of reserving whitespace

**Buglar:** kayda değer bulgu yok.

---

### `/arac/kurani-tani`

**İçerik: 8/10** — src/components/WowFacts.jsx, 50 hardcoded 'FACTS' entries (numerical/structural/prophets/lesser-known categories) each with body + 'wow' one-liner + optional counter visualization; this is the site's highlights/index page linking out to deeper dedicated tools.
- Güçlü yönler:
  - Exceptional epistemic hygiene: many facts carry explicit ℹ️ notes separating Quranic text from hadith/classical-tafsir vs. 'çağdaş bir okuma' (contemporary reading) — e.g. the fingertip/forehead-neuroscience facts explicitly disclaim the fMRI/brain-lie-center link as contested and note classical tafsir reads the verses metaphorically, textbook §13.24 compliance
  - Good sourcing discipline (Leeds Quranic Arabic Corpus cited for Musa's 136-count; Sadeghi-style hedge patterns reused)
  - Genuinely wide variety of facts, low redundancy within the set
- Sorunlar:
  - 'Kur'an, nasıl okunacağını bizzat emreden tek kutsal kitaptır' (73:4 fact) — an unverifiable absolute comparative claim ('the only scripture...') about every other world scripture
  - 'En çok okunan metin — tartışmasız, her gün, her kıtada' (Fatiha-40x fact) uses the flat qualifier 'tartışmasız' (indisputably)
  - The Adam/Eve fact ('Tevrat bir suçlu arar — Kur'an ikisini de eşit tutar') simplifies the Torah's Genesis 3 narrative (which also records Adam's own confession) without a citation — an unverified claim about another scripture's content, which is the same failure mode §13.30 warns against for the site's own claims
- İyileştirme önerileri (içerik):
  - Replace 'tek kutsal kitaptır' with a hedged phrasing or cut the cross-scripture comparison entirely
  - Remove 'tartışmasız'
  - Either cite a source for the Torah comparison or soften it (e.g. 'bazı okumalarda... Kur'an'da ise açıkça ikisi birlikte...')
  - 50 facts is a lot for one scroll — consider tabs/filters by category (the UI may already do this; verify) and trim near-duplicate Rahman-related facts

**Görsellik: 6/10**
- Masaüstü: All ~50 cards render (page height 8969px), categorized tag filters and Az Bilinen/Peygamberler sections work, but card grid rows are visually uneven due to inconsistent whitespace before the CTA button.
- Mobil: Severe rendering failure: after the first ~15 cards the single-column list goes completely blank for most of the page's 23,006px height. This is the most significant visual/functional defect found in the audit.
- Sorunlar:
  - MOBILE CRITICAL: page content stops rendering after roughly the 15th fact card (mid 'Rahman' card cuts off) and is followed by ~19,000px of completely blank/empty space before the page actually ends — the remaining ~35 fact cards, 'İlgili Araçlar', and 'Klasik Kaynaklar' sections are effectively missing from the rendered mobile page
  - Desktop: card grid rows have very inconsistent internal whitespace — some cards have 2-3 lines of body text plus a large empty gap before the 'Keşfet →' button while neighboring cards in the same row are text-dense, making the grid look ragged/unfinished
- İyileştirme önerileri (görsellik):
  - Investigate whatever reveal-on-scroll/virtualization mechanism renders this fact-card grid — it appears to silently stop producing DOM/visible content partway down the list on mobile viewports
  - Normalize card body height (line-clamp + fixed footer position) so the desktop grid's Keşfet button aligns evenly per row regardless of text length
  - Long-term: the 50-card single list makes for an extremely long page (23,000px on mobile even when working) — consider pagination, 'show more', or category-filtered default view to shorten it

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/melekler`

**İçerik: 9/10** — public/melekler.json (15 angels + 7 duties + 6 narrative episodes + linguistics + sources), rendered by src/components/Melekler.jsx.
- Güçlü yönler:
  - Best-in-class hadith-grading discipline: physical descriptions (e.g. Cebrail's '600 wings') are attributed with exact source+book+chapter and 'sahih' status, explicitly separated from what the Quran itself says
  - Correctly frames identifications like Ruhul Kudüs=Cebrail as 'tefsir görüşü', not asserted as Quranic fact
  - mentionCount/indirectMentions/quranicStatus fields give checkable, well-structured data
- Sorunlar:
  - None significant found in the sampled entries
- İyileştirme önerileri (içerik):
  - Cross-check angel entries (esp. İsrafil, Cebrail) against /arac/kiyamet for consistency, since both pages describe overlapping figures
  - Use this page's citation format as the template to retrofit into kiyamet-sahneleri.json's hadith notes

**Görsellik: 9/10**
- Masaüstü: Clean stat row, well-organized tab bar (Melekler/Görevler/Kıssalar/...), category filter chips, and two-column melek cards with Arabic script, verse quotes and 'ⓘ hadis kaynağı' disclaimers all render correctly across the full ~4983px page.
- Mobil: Cards stack cleanly to single column, color-coded left borders preserved, no truncation or overlap issues across all 6 segments checked.
- İyileştirme önerileri (görsellik):
  - Nothing significant found; the color-coded left-border card system (Cebrail gold, Mikail blue, azap-melekleri red, hadis-only cards gray) is a strong reusable pattern worth applying to other multi-category tool pages

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu (kırık sticky) — `Melekler.jsx:1343,1498` — `bodyRef` ToolHeader+tab bar'ı `overflowY:'auto'` ile sarıyor; tab bar (`top:'110px'`) hiç kenetlenmiyor, ~900px scroll'dan itibaren tamamen kayboluyor.
  - [other] On the Kıssalar tab, the collapsed-card preview text is generated with naive JS logic `(tr ? k.anlatimTr : k.anlatimEn)?.split('.')[0] + '.'` (Melekler.jsx ~line 731), which grabs everything up to the FIRST period. Because Turkish text uses the abbreviation "Hz." (with its own period), 5 of the 6 story-card previews are cut off mid-sentence and read as broken fragments: "Üç melek Hz.", "Meryem 19:17 — melek Hz.", "Enfal 8:12 — 'Kâfirlerin kalplerine korku salın, boyunlarının üstüne, parmaklarının ucuna vurun." (unclosed quote), "Melekler mihrapta namaz kılan Hz.", and "Saffat sûresi meleklerin kendi sözleriyle biter: 'Bizim sıralarımız var, biz tesbih ederiz." (unclosed quote). Confirmed visually via screenshot — all 6 cards render this way by default before expansion.

---

### `/arac/muhataplar`

**İçerik: 8/10** — public/addressees.json (11 direct-address categories with counts, Meccan/Medinan percentages, themes, example verses), rendered by src/components/AddresseeSystem.jsx — purely data-driven, no hardcoded prose.
- Güçlü yönler:
  - Clean, granular categorization of Quranic address forms ('Ey İman Edenler' 89x, 'Ey İnsanlar' 20x, etc.) with concrete tagged example verses per category
  - Reasonable internal consistency (counts roughly match the surah lists given)
- Sorunlar:
  - Exact integer stats (count, medeni_percent, sure_count) are presented without a visible methodology note — unlike WowFacts' Musa-count fact, which cites the Leeds Corpus, these numbers have no attached source/counting-method explanation on screen
- İyileştirme önerileri (içerik):
  - Add a short methodology footnote (corpus used, whether pronoun-only occurrences count) similar to other pages' citation discipline
  - Consider a SourcesCitation block, which this page currently has but could expand with a counting-method note

**Görsellik: 8/10**
- Masaüstü: Two-column layout (category sidebar + detail panel) works well at the top of the page; stat tiles, tema haritası chips, örnek ayetler and klasik kaynaklar cards are all well composed.
- Mobil: Sidebar categories convert to a horizontal scrollable pill row — clean, on-brand adaptation with no wrapping issues.
- Sorunlar:
  - Desktop: left sidebar (tab list of muhatap categories) is short relative to the right content column; once scrolled past the sidebar's own height it leaves a large blank left column for the rest of the page — likely a sticky-nav pattern but worth confirming it behaves as sticky (pinned) rather than just scrolling away and leaving dead space
- İyileştirme önerileri (görsellik):
  - Confirm/enforce position:sticky on the desktop sidebar so it stays visible alongside the long content column instead of leaving blank space once its own content ends

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/mukattaa`

**İçerik: 8.5/10** — src/components/Mukattaa.jsx wraps src/sections/LinguisticDNA.jsx verbatim (4 letter-groups covering all 29 mukattaʿāt surahs with per-group thematic/pattern analysis) plus a SourcesCitation (Suyûtî, Râzî, Zamahşerî, İbn Kesîr) and CrossToolCTA.
- Güçlü yönler:
  - Rich per-group breakdown (e.g. Elif-Lâm-Mîm's 6 surahs split 4+2 into Book-references vs. faith-trial/historical-vindication, with the Rûm/Byzantine-Persia prophecy correctly hedged as 'tarihsel bir teyit/temas noktası' rather than 'proof', matching §13.24)
  - The 'digital checksum' analogy is explicitly labeled an unproven academic hypothesis, not fact
  - Strong, correctly-dated classical bibliography at page end
- Sorunlar:
  - Occasional unhedged superlatives, e.g. 'Yûsuf... Kur'an'da eşsiz' (unparalleled) — mild absolute-claim risk
  - Per an explicit code comment, content is intentionally identical to the homepage section — the dedicated route adds little beyond hero verse + sources/CTA, making it thinner as a standalone deep-dive than sibling pages
- İyileştirme önerileri (içerik):
  - Add unique tool-exclusive content (e.g. a full interactive table of all 14 letters × their 4 group memberships with counts) not present on the homepage teaser
  - Soften 'eşsiz' language

**Görsellik: 5/10**
- Masaüstü: Hero, stat tiles (14/29/25%/27-29) and intro copy look great; the 4-harf-family grid below is where the fade animation gets stuck, making most cards unreadable in the captured state.
- Mobil: Same fade issue but far more severe — large stretches of the page are entirely blank, no card content visible at all for roughly 2 viewport-heights.
- Sorunlar:
  - Scroll-reveal fade-in animation gets stuck at near-zero opacity for most harf-family cards on desktop (visible in the captured page state — cards after the first two, e.g. 'Hâ-Mîm', render almost invisible against the dark background)
  - MOBILE: two consecutive full-viewport-height segments (~3800px total) render as completely blank/black with no visible content at all, between the harf-family card intro and the 'KLASİK KAYNAKLAR' section
  - Classic-sources and related-tools cards at the bottom appear to load fine, suggesting the failure is isolated to the animated harf-family card list
- İyileştirme önerileri (görsellik):
  - Audit whatever intersection-observer/fade-in library drives the harf-family cards — it needs to guarantee content becomes fully opaque once scrolled past, not stay dependent on scroll velocity/timing
  - Add a reduced-motion / no-JS fallback that renders cards at full opacity by default, only animating the reveal as a progressive enhancement
  - Re-test on a real mobile device with normal (non-instant) scrolling to confirm whether real users hit the same blank-content state

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/neden-sonuc`

**İçerik: 8.5/10** — public/neden-sonuc.json (10 cause-effect 'chains' across nefs/toplumsal/kozmik categories, each 3-5 steps with per-step verse anchors and 'why' rationale), rendered by src/components/NedenSonuc.jsx.
- Güçlü yönler:
  - Each chain step is grounded in a specific verse with classical-lexicon backing (e.g. Râgıb's Müfredât cited for the 'şükür' triad)
  - Verse references are correctly rendered with surah names via a formatVerseRef() helper (compliant with the site's own §13.32 bare-number-ban rule)
  - Chains read as genuinely structural (e.g. Sabır→Yardım→Zafer with cross-refs to Nisa 4:104) rather than as loose associations
- Sorunlar:
  - Only 10 chains total; full read of all 10 wasn't completed so undetected absolute-claim risk in unsampled chains can't be fully ruled out
- İyileştirme önerileri (içerik):
  - Expand chain count, especially in less-represented categories, to round out coverage across nefs/toplumsal/kozmik
  - Full-text audit pass of the remaining 8 chains for the same claim-hedging standard seen in the two sampled ones

**Görsellik: 9/10**
- Masaüstü: Strong 2-column card grid with Nefsî/Toplumsal/Kozmik color coding, arrow-chain tag visualization, and clean klasik kaynaklar + ilgili araçlar sections at the bottom.
- Mobil: Cards stack cleanly to single column with no overlap; chain-tag truncation is slightly more pronounced on the narrower viewport.
- Sorunlar:
  - Some chain-tag pills truncate with '...' (e.g. 'Kara + deniz'de den...', 'Ölçüyü tam tutut') making the mid-chain label unreadable without opening the card
- İyileştirme önerileri (görsellik):
  - Widen chain-tag pills or wrap text instead of truncating, or add a tooltip/title attribute showing the full label on hover/tap

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] In the Kozmik chain 'Kâinat Bir Amaçla → Sonu Geldiğinde Geri Toplama', the Enbiyâ 21:104 translation quote reads "...Semayı yazılar sayfası gibi dürerız..." — "dürerız" is a spelling/vowel-harmony error; correct Turkish is "düreriz".

---

### `/arac/renkler`

**İçerik: 8.5/10** — public/kuranin-renkleri.json (12 colors with root-form breakdowns, hapax flags, mention counts, key verses) + a dedicated 'renkSekans' (green→yellow→dry decay motif) section, rendered by src/components/KuranRenkleri.jsx.
- Güçlü yönler:
  - Fine-grained linguistic detail per color (multiple Arabic root forms with transliteration, form type, and mention counts, e.g. green's ahdar/hudr/mudhammatân)
  - renkSekans section carefully distinguishes the full 3-stage decay pattern (Zümer 39:21, Hadîd 57:20) from the 2-stage pattern (Kehf 18:45, Yûnus 10:24) rather than flattening them into one claim
  - No overreaching interpretive claims about color 'meaning'
- Sorunlar:
  - Single use of 'mucize' describing Musa's hand/staff scene — used in the ordinary narrative sense (a prophetic sign within the story) rather than a science-proves-Quran framing, so low risk but worth a wording pass given the site's general caution around 'mucize' language
- İyileştirme önerileri (içerik):
  - Add a short counting-methodology note for mentionCount figures (root-form inclusion criteria), matching the citation rigor seen on sebebi-nuzul/melekler pages

**Görsellik: 10/10**
- Masaüstü: Color swatch cards, sequence diagram (Yeşil→Sarı→Renksiz), and FAQ callout all render flawlessly with excellent contrast handling on both light swatches (Beyaz, Kâfûr) and dark ones.
- Mobil: Swatch cards stack cleanly to single column, sequence diagram and FAQ block reflow well with no cramping across all 5 segments checked.
- İyileştirme önerileri (görsellik):
  - This is the strongest page in the set — the literal color-swatch card headers (actual rendered hex colors as the card top bar) are a distinctive, on-brand touch worth reusing as a template for other 'palette/atlas' style tools

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] In the Kıyamet Paleti section ('SİNEMATİK SIRA' list item 2 and its detail card heading), the text reads "Yüzlerin Ağarması ve Kararmasi" — "Kararmasi" should be "Kararması" (dotless ı vs dotted i, Turkish vowel-harmony error). Appears twice on the page.

---

### `/arac/retorik`

**İçerik: 7.5/10** — public/kuran-retorigi.json (5 categories, but 4 of the 5 are the same istifham sub-types — inkârî/irşâdî/tevbîhî/taaccübî — plus 'te'kîd'; 30 tagged example verses, addresseeGroups, surahDensity/topSurahs, comparativeAnalysis), rendered by src/components/KuranRetorigi.jsx.
- Güçlü yönler:
  - Precise, individually-tagged verse corpus (30 example verses with type/pattern/addressee metadata)
  - The ~1290 total-rhetorical-questions figure is explicitly hedged with a range and named scholarly sources (Na'im el-Himsi, İbn Âşûr) rather than stated as exact
  - comparativeAnalysis nicely shows the same question ('Who created the heavens and earth?') functioning differently across inkârî/irşâdî/tevbîhî framings
- Sorunlar:
  - Despite the general title 'Kur'an Retoriği', the entire dataset is actually only about rhetorical QUESTIONS (istifham) + tekid — this is the same core topic (same 4 istifham subtypes) as the QuranRhetoric section embedded in /arac/retorik-sorular, producing substantial content overlap between two differently-named tool pages
- İyileştirme önerileri (içerik):
  - Either rename this route to reflect its actual (questions-only) scope, or broaden its dataset to cover general rhetoric (currently only present on retorik-sorular via belagat-aileleri.json: iltifât, tibâk, istiâre, kinâye, cinâs) and de-duplicate against retorik-sorular

**Görsellik: 8/10**
- Masaüstü: Two-column layout (soru türleri sidebar + detail panel) with örnek ayetler cards renders cleanly across the full page; classic sources grid at the bottom is well organized.
- Mobil: Sidebar converts to horizontal pill tabs, sticky behavior confirmed working (pill bar pinned at top during scroll), content reflows without issues.
- İyileştirme önerileri (görsellik):
  - None significant; sticky sub-nav (Kategoriler & Kalıplar / Muhatap Analizi / ...) works well but could use a subtle bottom border/shadow on mobile to visually separate it from content when pinned

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [console-error] React console warning fires when interacting with the 'Seçilmiş Sorular' tab: "Encountered two children with the same key, `all`... Non-unique keys may cause children to be duplicated and/or omitted." Root cause confirmed in source (KuranRetorigi.jsx ~line 917-929): the type-filter row and the pattern/muhatap-filter row each render a pill via a shared `pill()` helper that sets `key={value}`, and both rows independently use the literal value 'all' for their "Tümü"/"All" pill while being siblings, producing duplicate React keys.

---

### `/arac/retorik-sorular`

**İçerik: 7.5/10** — src/components/RetorikSorular.jsx combines the homepage QuranRhetoric section (istifham types — same 4 subtypes as /arac/retorik) with public/belagat-aileleri.json (5 non-question rhetorical families: iltifât, tibâk, istiâre, kinâye, cinâs, each with classical + modern academic citations).
- Güçlü yönler:
  - belagat-aileleri.json portion is excellent: each of the 5 families cites both classical (İbn Kuteybe, Cürcânî's Delâʾilü'l-Iʿcâz, Zemahşerî's el-Keşşâf) and modern academic sources (Abdel Haleem, BSOAS 1992; Neuwirth) per concept, with detailed per-verse analysis (e.g. the Fâtiha 1:2-5 iltifât shift from 3rd-person to 2nd-person address)
  - Rich, non-repetitive close readings across the 5 families (22 example verses)
- Sorunlar:
  - The page's own data file states its purpose as going 'beyond istifhâm' ('Kur'ân'ın retoriği yalnızca soru sanatından ibaret değildir') — yet it's titled 'Retorik Sorular' (Rhetorical Questions), and the iltifât/tibâk/istiâre/kinâye/cinâs families are explicitly NOT questions, creating an internal title/scope mismatch
  - The QuranRhetoric-section half of this page duplicates /arac/retorik's istifham content almost one-to-one (same 4 subtypes, similar examples)
- İyileştirme önerileri (içerik):
  - Split this page cleanly: either rename it to something scope-neutral (e.g. 'Belağat/Retorik Sanatları') and move the istifham deep-dive fully to /arac/retorik, or keep this page strictly about questions and relocate belagat-aileleri content elsewhere
  - Resolve the cross-page duplication of istifham content noted for /arac/retorik

**Görsellik: 4/10**
- Masaüstü: The hero, prensip quote, and tab selector (İstifhâm/İltifat/Tibâk/İsti'âre/Kinâye/Cinâs chips) render perfectly — but the actual İstifhâm content panel that should appear below it is blank for most of its height.
- Mobil: Same defect, more severe: over half the page's total height shows no visible content at all before the footer sources section appears.
- Sorunlar:
  - CRITICAL: on desktop, a large section of the page (~2500px, roughly one full viewport height) between the tab selector and the 'KLASİK & MODERN KAYNAKLAR' footer section renders as completely blank/black — the İstifhâm detail content (alt kalıplar cards, seçilmiş örnek ayetler) that should fill this space is missing from the captured page
  - CRITICAL: on mobile the same failure is far more severe — two consecutive full-viewport-height segments (~3800px total, more than half the page) are entirely blank with zero visible content
  - This mirrors the same fade/reveal failure pattern seen on /arac/mukattaa and the content-cutoff seen on /arac/kurani-tani mobile, suggesting a shared component (likely a scroll-reveal or tab-panel animation) is the root cause across multiple tool pages
- İyileştirme önerileri (görsellik):
  - Treat this as the top-priority fix in the audit: identify the shared animation/reveal component used across mukattaa, kurani-tani, and retorik-sorular and ensure content is guaranteed visible regardless of scroll speed or capture timing
  - Add automated visual-regression screenshots (full-page) to CI for these tool pages so blank-content regressions like this are caught before deploy
  - As an interim fix, disable the fade-in animation for this page's alt-kalıplar/örnek-ayetler cards and render them at full opacity

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu (kırık sticky, en ciddi vaka) — `RetorikSorular.jsx:135,227` — `bodyRef`'in `overflowX:'hidden'`'i tarayıcı tarafından `overflow-y:auto`'ya yükseltiliyor; tab bar ~800px'ten itibaren ToolHeader arkasında TAMAMEN görünmez oluyor.
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı — `belagat-tab-bar` düğmeleri `textTransform:'uppercase'` içermiyor.

---

### `/arac/ritim`

**İçerik: 8.5/10** — src/components/Ritim.jsx wraps src/sections/ImpossibleRhythm.jsx (poetry/Quran/prose contrast, fasıla concept, Duhâ/Necm/Rahmân/Kamer examples) plus src/components/RhythmExtensions.jsx (16 classical aruz metres with correct scansion patterns + full 31-occurrence map of the Rahmân 55 refrain grouped by theme).
- Güçlü yönler:
  - Rigorously sourced: cites Halil b. Ahmed and el-Ahfeş by name for the 16-metre system, Salwa El-Awa (Routledge 2006) and Angelika Neuwirth (1981) for compositional claims
  - Frames the Quran's form as 'kendine özgü bir kategori' (its own category) rather than an absolute superiority claim, avoiding 'no other text' language
  - The Rahmân refrain widget maps all 31 actual ayah numbers to 7 thematic sections — genuinely checkable, not a vague assertion
- Sorunlar:
  - None significant found
- İyileştirme önerileri (içerik):
  - Add a citation for the fasıla claim ('ne kafiye zorunluluğuna bağlı ne de rastlantısal'), which currently reads as an asserted linguistic claim without an attached source, unlike the rest of the page

**Görsellik: 10/10**
- Masaüstü: Every section (edebî meydan okuma callout, fasıla ses imzası cards, Necm 62-square grid with legend, Rahmân 31-nakarat breakdown, 16-vezin aruz grid) renders correctly with no gaps across the full ~5771px page.
- Mobil: 62-square ayet grid reflows to a dense but legible mobile grid, all card sections stack cleanly, no cramping or overlap found across 5 segments checked.
- İyileştirme önerileri (görsellik):
  - None found; the interactive Necm-sûresi 62-ayet grid, fasıla color-coded cards, Kevser -ar rhyme scheme block, and 16-vezin aruz grid are all excellent, best-in-class interactive components — worth studying as the reference pattern for other 'atlas'-style tools

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/sebebi-nuzul`

**İçerik: 8.5/10** — Two complementary datasets: public/esbabin-nuzul.json (20 narrative 'events' timeline) and public/sebeb-i-nuzul.json (30 detailed 'occasions' with scholar attributions, hadith source + reliability grading, and aggregate stats), rendered by src/components/SebebiNuzul.jsx.
- Güçlü yönler:
  - Transparently shows only 9.1% of the Quran's 6,236 verses have a documented sabab (mostly Medinan, 72%) — actively avoids overclaiming asbab coverage rather than implying every verse has a known occasion
  - Real, checkable classical scholar bios (Vâhidî as founder, exact death dates, works-covered counts: 570 verses/83 surahs) rather than vague name-drops
  - byCategory/byPeriod percentages are explicitly labeled 'approxCount', avoiding false precision, and the underlying numbers are internally consistent (category counts sum to the stated 570 total)
  - Individual occasions cite sources with reliability grading (e.g. İfk Hadisesi: 'Buhârî, Müslim, Vâhidî' / reliability: sahih)
- Sorunlar:
  - The 'sahih'-type reliability labels attached to individual occasions carry real academic weight and weren't independently verified against hadith-science literature in this audit
- İyileştirme önerileri (içerik):
  - Run a dedicated hadith-authenticity verification pass on the reliability labels (sahih/hasan/etc.) per §13.30's source-verification standard, since these are specific scholarly claims

**Görsellik: 9/10**
- Masaüstü: Dense 30-result list with search/filter controls (Olay→Ayet, dönem, güvenilirlik chips), each card showing tags, actors, narrative, and Kaynak line — all render correctly with no blank gaps across the full ~10,190px page.
- Mobil: Filter chips wrap cleanly into rows, cards stack to single column with consistent color-bordered left edge, no truncation or overlap issues across all 6 segments checked.
- İyileştirme önerileri (görsellik):
  - None significant; the color-coded left-border system per olay category (İftira=purple, Aile Hukuku=orange, Vahiy Başlangıcı=orange-brown, etc.) combined with 'Sahih/Hasen/meşhur' reliability badges is a strong, consistent pattern

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [other] Minor data-display inconsistency: reliability badges on the search/list cards are normally capitalized ("Sahih", "Hasen") but the card 'Ebter İftirasına Kevser Sûresi' shows a lowercase badge "meşhur" instead of "Meşhur", breaking the capitalization pattern used by every other card's reliability badge.

---

### `/arac/ses-mimarisi`

**İçerik: 8/10** — Wrapper (SesMimarisi.jsx) reuses the homepage SoundArchitecture section content plus an added SoundExtensions deep-dive (4 more contrast pairs + 8-group phonetic spectrum). Content compares 'harsh' (patlayıcı) vs 'soft' (akıcı) consonant clusters in punishment vs mercy verses, ties it to classical tajwīd (tafhīm/tarqīq/qalqala) and modern sound-symbolism research (Sapir 1929, Köhler bouba/kiki).
- Güçlü yönler:
  - Explicitly disclaims that classical tafhīm/tarqīq and modern sound-symbolism are not the same phenomenon ('birebir aynı olgu değildir') — good epistemic hedging.
  - Comparison card methodology note calls itself 'sezgisel bir gösterim... kesin bir fonetik istatistik değil' rather than presenting the azap/rahmet contrast as proven fact.
  - Sourced to real named scholars/works: Bâkıllânî (İ'câzü'l-Kur'an), Ibn Sînâ (Esbâbu Hudûsi'l-Hurûf), Sibawayhi (al-Kitāb), Michael Sells (Approaching the Qur'an).
  - Interactive 'guess the sound' quiz widget is a nice pedagogical device, not just static prose.
- Sorunlar:
  - The four SoundExtensions contrast pairs (Kâfirûn/İhlâs, Fecr/Duhâ, Zakkûm/Tûbâ, Alak/Nahl) are presented with confidence:'high' but the reasoning is essentially the author's own phonaesthetic impression dressed as classical rhetoric citation ('Klasik retorik: Zemahşerî, Keşşâf... girişleri') without direct quotes — harder to verify than the tarihsel-kanitlar/tefsir-ihtilaflari pages which quote primary text directly.
  - Heavy content overlap with /arac/yeminler and /arac/ritim (both cover phonetic/rhythmic texture of the same oath surahs, e.g. Fecr, Duhâ) — cross-linked via CrossToolCTA, so intentional, but a reader visiting all three will see the same verses analyzed for sound three times.
- İyileştirme önerileri (içerik):
  - Add direct quoted-and-sourced classical text for at least one of the 4 SoundExtensions pairs the way tarihsel-kanitlar/tefsir-ihtilaflari do (quoteAr + citation), rather than a general 'Klasik retorik: X, Y girişleri' attribution.
  - Add a short note clarifying that the 'harsh vs soft' letter classification is the page author's own thematic grouping, distinct from the sourced Sibawayhi/tajwīd categories, to avoid conflating the two.

**Görsellik: 9/10**
- Masaüstü: Full hero (bismillah, ayah, subtitle), red/green contrast comparison cards, tecvid classification 3-card row, interactive quiz block, phonetic 8-group spectrum grid all render cleanly with strong hierarchy and consistent gold/dark theme. No layout defects found across the full-page scroll.
- Mobil: All sections reflow to single column cleanly: comparison cards stack, tecvid cards stack, quiz card and 8-group phonetic grid (2-col) all remain legible with no overlap or cramping. Matches desktop quality.
- İyileştirme önerileri (görsellik):
  - Consider adding a scroll-fade cue on the 'BİR ÖRNEK KARŞILAŞTIRMASI' two-column cards row on narrower desktop widths to avoid any hard edge crop as content grows

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/arac/tarihsel-kanitlar`

**İçerik: 9/10** — public/tarihsel-kanitlar.json: 10 'traces' (Pharaoh's body, Hāmān, Rūm prophecy, Iram, Aṣḥāb al-Ukhdūd, Aṣḥāb al-Kahf, Dhu'l-Qarnayn, Thamūd, 'nearest place', Qur'an preservation) each tagged with a confidence level (güçlü/muhtemel/tartışmalı), classical tafsir citations, modern academic sources, and an explicit criticalNote.
- Güçlü yönler:
  - Exemplary application of the site's own §13.24 i'jaz-framing rule: intro text states outright 'Kur'ân'ın doğruluğu hiçbir dış teyide muhtaç değildir' and 'bu tool Kur'ân bilimsel olarak öngördü iddiasında değildir'.
  - The Hāmān entry is a model of restraint: cites Bucaille (1976) by name while explicitly warning his method ('seçmecilik, önceden bilinmiyordu varsayımı') should be treated with caution, and states the linguistic identification is 'not a settled finding.'
  - Rūm prophecy entry gives real named academic sources (Nicolai Sinai 2017, Walter Kaegi 2003, Howard-Johnston 2010) with actual publication years/publishers, and separates the theological reading ('kehânet, only for believers') from the historical-consistency observation (open to all).
  - Every entry carries a distinct criticalNote that pre-empts overclaiming — no entry asserts 'science proved the Quran.'
- Sorunlar:
  - confidence field uses only 3 informal buckets (güçlü/muhtemel/tartışmalı) with no visible definition of what separates them — a reader can't tell why one item is 'güçlü' vs another 'muhtemel' without inferring from prose.
- İyileştirme önerileri (içerik):
  - Add a one-line legend defining güçlü/muhtemel/tartışmalı near the top of the page so the confidence badges are self-explanatory rather than requiring the reader to read every entry to infer the scale.
  - Consider adding 1-2 more 'tartışmalı' (contested) entries to balance the current mix, since most surfaced items lean toward güçlü/muhtemel — a slightly wider spread would reinforce the page's own stated non-apologetic stance.

**Görsellik: 8/10**
- Masaüstü: Strong hero, filter/tab row (Kanıtlar/Keşif Timeline/Akademik Görüşler/Metodoloji) and category pill legend read well. Cards have clear numbered badges, category tags, confidence labels ('MUHTEMEL'/'GÜÇLÜ') consistently styled.
- Mobil: Cards stack cleanly with numbered icon badges and tags wrapping correctly; body text remains readable at 390px. No overlap issues found.
- Sorunlar:
  - The 10-item evidence list uses near-identical card structure back-to-back for the full page length, producing a visually monotonous long scroll with little rhythm variation compared to other tool pages
- İyileştirme önerileri (görsellik):
  - Introduce occasional visual breaks (pull quotes, a mid-list stat recap, alternating card width) every 3-4 cards to break the repetition of the long evidence list
  - Consider a sticky mini-nav or 'jump to evidence #' control given the page is one of the longest in the set

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu (kırık sticky) — `TarihselKanitlar.jsx:177,324` — aynı `overflowX:'hidden'` deseni; tab bar ~1100px'ten itibaren örtüşüyor, sonra tamamen kayboluyor.

---

### `/arac/tefsir-ihtilaflari`

**İçerik: 9/10** — public/tefsir-ihtilaf.json compares 7 classical exegetes (Taberî, Zemahşerî, Râzî, Kurtubî, İbn Kesîr, İbn Kayyım, İbn Âşûr) across 8 cases of Quranic parable interpretation (e.g. Âyetü'n-Nûr, the fire/rainstorm hypocrite parables), with per-quote Arabic text, translation, and a 'confidence: confirmed' tag indicating the quote was verified against the primary text.
- Güçlü yönler:
  - Quotes are given in Arabic with citation (e.g. el-Keşşâf, Bakara 2:19-20) and marked 'confirmed' — matches the site's §13.30 source-verification rule rather than paraphrasing scholars' views without evidence.
  - Genuinely presents disagreement without picking a winner — e.g. for the Âyetü'n-Nûr axis, Taberî/Râzî favor the hidâyet (guidance) reading while Zemahşerî/İbn Âşûr favor a mecaz (figurative) reading, both given equal space.
  - The observations section notes 'mezhep, ihtilafı sanıldığı kadar belirlemiyor' — an accurate, non-obvious meta-observation (Ash'arite Râzî and modern Ibn Âşûr land on opposite sides) rather than a simplistic sectarian narrative.
- Sorunlar:
  - Only 8 cases / 7 scholars covered — page title implies broader coverage of 'tefsir ihtilafları' generally but content is scoped specifically to meseller (parables); this scope isn't obvious from the route name or title alone until reading the methodology intro.
- İyileştirme önerileri (içerik):
  - Make the parable-specific scope explicit in the page's H1/subtitle (e.g. 'Kur'an Mesellerinde 7 Müfessir' rather than the broader-sounding 'Tefsir İhtilafları') so users don't expect coverage of doctrinal/legal tafsir disputes.
  - Since near-identical scholar rosters and quote-verification method appear on other pages (ahiret-yolculugu, yakin-anlamli-nuanslar), consider a shared 'meet the mufessirs' component to avoid re-describing the same 7-8 classical figures' bios independently on each page.

**Görsellik: 5.5/10**
- Masaüstü: At 1400px the breadcrumb and tabs sit on separate non-overlapping rows so no clash occurs; mufessir comparison cards (purple/red/orange left-border accents) are well differentiated and readable. Missing-hero issue still applies.
- Mobil: Confirmed via cropped screenshot: the circular back button sits directly on top of the tab row text, occluding 'Yöntem' and 'Müfessirler' labels — a genuine overlap bug at 390px viewport.
- Sorunlar:
  - MOBILE BUG: the sticky breadcrumb bar's circular back-arrow button visually overlaps the sticky Yöntem/Vakalar/Müfessirler tab row directly beneath it, partially covering the 'Yöntem' and 'Müfessirler' tab labels
  - Page skips the rich hero pattern (bismillah calligraphy, ayah quote, descriptive subtitle, ornamental divider) that every sibling tool page uses — jumps straight from breadcrumb+tabs into body copy, making it feel like an unfinished/lower-effort page next to its peers
- İyileştirme önerileri (görsellik):
  - Add vertical clearance or z-index/position fix so the back button never overlaps the tab bar on mobile (390px verified)
  - Add the standard hero block (bismillah + relevant ayah + subtitle) used elsewhere to bring this page to visual parity with other /arac/ pages

**Buglar:**
  - [CSS/sticky ailesi] §13.32 çıplak ayet referansı — `TefsirIhtilaflari.jsx:148,130` — `{c.verseRef}` çıplak render ediliyor; `public/tefsir-ihtilaf.json` içinde "24:35", "2:17-20" gibi çıplak referanslar var. Site genelinde bu kuralın zaten düzeltildiği 4 sayfa arasında DEĞİL.
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı eksik.

---

### `/arac/tekrar-anatomi`

**İçerik: 8/10** — TekrarAnatomi.jsx wraps the homepage ZeroRedundancy section: addresses the 'Rahmân's 31x refrain isn't that redundant?' objection via classical takrîr theory (te'kîd/tafsîl/ihtimâm), Moses-narrative multi-surah examples, and corpus stats (~77,800 words, ~1,700 roots, ~455 hapax legomena).
- Güçlü yönler:
  - Explicitly frames the 31x/10x/4x literal repetitions as 'gerçek, literal tekrarlardır — inkâr edilemez' rather than denying the obvious objection, then explains the classical rhetorical answer — a fair-minded structure.
  - Stats carry sourced tooltips (Quranic Arabic Corpus/Leeds, Shawkat Toorawa 2011 for hapax count) with explicit uncertainty ranges ('Sayım yöntemine göre 400–500 arası').
  - Card-based İ'câz section cites specific classical works per claim (Zerkeşî el-Burhân, Suyûtî el-Itkân, Râzî Mefâtîhu'l-Ğayb, İbn Âşûr et-Tahrîr) rather than vague 'scholars say'.
- Sorunlar:
  - The closing 'Zemahşeri Quote' blockquote ('Kur'an'ın her kelimesi bir hazinedir. Bir kelimeyi çıkarsan, bina çöker.') is styled and cited exactly like a direct verbatim quotation, but its own attribution text says it is actually 'Klasik İ'câzu'l-Kur'an geleneğinin temel kanaati' (a paraphrased summary of the tradition attributed to Bâkıllânî/Zerkeşî) — not a literal Zemahşerî quote. The blockquote format implies direct citation; a reader has no way to tell it's a paraphrase without noticing the mismatch between the visual 'quote' framing and the prose attribution.
  - internal i18n key is literally named 'zemahseriQuote' even though the displayed attribution doesn't name Zemahşerî at all — suggests the content was edited/corrected but the citation format (blockquote+cite) wasn't adjusted to reflect that it's now a paraphrase, not a quote.
- İyileştirme önerileri (içerik):
  - Either find and cite a real verbatim Zemahşerî/Bâkıllânî quotation with page reference to keep the blockquote format honest, or change the presentation from a quotation-mark blockquote to a plain 'classical consensus' statement so it isn't visually implied to be a direct quote.
  - Rename the underlying content key/citation to match what's actually displayed (a synthesized 'kanaat', not an attributed quote) to prevent this drifting further.

**Görsellik: 7.5/10**
- Masaüstü: Hero, stat tiles, Hz. Musa story cards, and the well-argued classical-vs-modern discussion sections are all polished. The large empty gap noted above is the one real flaw, confirmed via cropped screenshot.
- Mobil: No equivalent gap found on mobile — spacing between the related-sûre cards and Klasik Kaynaklar section is tight and consistent there, so the issue appears desktop-width-specific.
- Sorunlar:
  - DESKTOP: large unexplained empty gap (~150-200px of blank dark space) between the 'Daha Derine — İlgili Sûreler' 3-card row and the 'Klasik Kaynaklar' box below it, breaking the otherwise tight rhythm of section spacing
- İyileştirme önerileri (görsellik):
  - Audit the margin/padding between the related-sûreler card row and the Klasik Kaynaklar container at desktop widths — looks like a stray large margin-top/bottom or an empty wrapper collapsing incorrectly
  - The dense literal-numbers stat row (~77,800 / ~1,700 / ~14,870 / ~455) is strong — consider replicating this stat-tile treatment on other data-heavy tool pages for consistency

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] Stat label mixes an English word into an otherwise all-Turkish set of stat labels: "UNIQUE KELİME FORMU" (should be "BENZERSİZ KELİME FORMU" to match sibling labels "TOPLAM KELİME", "BENZERSİZ KÖK", "SADECE BİR KEZ GEÇEN"). Source: next/src/i18n/tr.json line 532 (tekrarAnatomi.stats.uniqueWords.label).

---

### `/arac/tum-araclar`

**İçerik: 7.5/10** — ToolsBrowser.jsx + src/data/toolCatalog.js — a searchable/filterable directory of ~60+ site tools/atlases with one-line TR/EN titles and descriptions per tool. Not narrative content; judged as an index page.
- Güçlü yönler:
  - Descriptions are consistently factual and scoped (e.g. 'Yedi müfessirin Kur'ân mesellerindeki yorum ayrılıkları' for tefsir-ihtilaflari) rather than promotional hype.
  - No absolute-claim language found across the catalog entries scanned (no 'kanıtlar', 'tek', 'mucize' type phrasing).
  - Keywords arrays support search without cluttering the visible description text.
- Sorunlar:
  - Because it's purely a directory, 'depth' isn't applicable by design — but several descriptions are thin enough to be near-duplicates of each other in structure ('X'da Y: A, B, C' pattern repeated ~30+ times), giving the page a mechanical, templated feel rather than a curated one.
  - A few descriptions use numbers that could drift from reality without visible versioning (e.g. '99 Esmâ-i Hüsnâ', '25+ yemin', '6236 ayet') — these are presumably correct but aren't independently checkable from this page alone.
- İyileştirme önerileri (içerik):
  - Group/introduce the catalog with a short framing paragraph explaining the taxonomy (atlas vs arac vs graf) since the page is a hub — currently the value differentiation between the three tool types isn't explained anywhere in the browsing UI itself.
  - Vary the description sentence structure more (currently near-uniform '[topic]: [item], [item], [item]' pattern) so the catalog reads less like machine-generated boilerplate.

**Görsellik: 7/10**
- Masaüstü: This is a full-height internal-scroll panel (not a normal document-scroll page) — verified content by scrolling the inner container; search box, popular-search chips, and category filter pills at top are clean and functional-looking. Icon inconsistency shows up clearly once scrolled past the first ~2 sections.
- Mobil: Same internal-scroll panel pattern reproduced correctly at 390px; single-column card stack is legible. Same generic pencil-icon reuse issue is visible in the mobile list too.
- Sorunlar:
  - A large subset of listed tools (Melekler, Retorik Sorular, Ses Mimarisi, Tarihsel İzler, Tefsir İhtilafları, Tekrarların Anatomisi, Zaman Boyutları, Bilimsel İşaretler, Cennet & Cehennem, Dua Dili, etc.) all reuse the exact same generic pencil/edit-looking icon instead of a distinct icon per tool, unlike the earlier Görselleştirme/Analiz sections which have bespoke icons — breaks the curated, premium feel of the directory for roughly a third of the 62 tools
  - Card style also shifts from large 2-col icon cards to compact single-line list rows partway down the page (for the same 'placeholder icon' subset), creating an inconsistent rhythm within one 'Tümü' listing
- İyileştirme önerileri (görsellik):
  - Commission/assign unique icons for the newer tools currently sharing the pencil placeholder
  - Either keep one consistent card format (large cards) throughout the full list, or make the format shift intentional by giving the compact-row section its own clear header/section break

**Buglar:**
  - [other] Page still has a deprecated modal-style close ("×") button in the header (aria-label="Kapat"), present on both desktop and mobile — unique among the 11 audited pages. Clicking it navigates to the homepage and silently discards the active search query / filter state. Site's own CLAUDE.md (§13.11/§13.17) explicitly deprecates this CLOSE_BTN pattern for full-page tool routes in favor of route-only navigation; every other tool page checked has no such button. Source: next/src/components/ToolsBrowser.jsx.

---

### `/arac/yakin-anlamli-nuanslar`

**İçerik: 7.5/10** — public/yakin-anlamli-nuanslar.json: 10 sets of 32 Quranic near-synonyms (kalb/fu'âd/sadr, ilm/hikmet/fıkh, havf/haşyet/rehbet, etc.), each with root etymology, a distinguishing usage note, and an anchor verse, sourced primarily to er-Râgıb el-İsfahânî's al-Mufradāt plus a topic-matched second source per set.
- Güçlü yönler:
  - Consistent root-based methodology (ص-د-ر / ق-ل-ب / ف-أ-د etc.) grounded in al-Mufradāt, a real and appropriate classical lexicon for this purpose.
  - 9 of the 10 sets pair al-Mufradāt with a genuinely topic-relevant second source (e.g. İbn Kayyım's ʿUddetü's-Sâbirîn for the sabır/patience set, Hâdi'l-Ervâh for the hell-names set, Gazâlî's el-Maksadü'l-Esnâ for the divine-names set) — shows real editorial care matching source to subject.
- Sorunlar:
  - The kalb-fu'âd-sadr set (first/flagship set on the page) cites 'İbn Kayyim, et-Tıbyân' as a co-source — but et-Tıbyân fî Eymâni'l-Kur'ân is Ibn Qayyim's book specifically about Quranic OATHS (confirmed: it's the correctly-used primary source on the separate /arac/yeminler page), not about heart/soul terminology. This looks like a copy-paste misattribution — every other set in this same file correctly matches an Ibn Qayyim work to its actual topic, making this one entry stand out as likely wrong per the site's own §13.30 source-verification rule.
- İyileştirme önerileri (içerik):
  - Replace the 'İbn Kayyim, et-Tıbyân' citation on the kalb-fu'âd-sadr set with an actually relevant Ibn Qayyim work on the heart (e.g. Miftâhu Dâri's-Sa'âde or Medâricü's-Sâlikîn both discuss qalb/fu'âd distinctions) or remove the co-citation if it can't be verified, per the site's own kaynak-doğrulama rule.
  - Since this is the single misattribution found in an otherwise carefully-sourced file, a quick audit of all 10 sourceTr/sourceEn fields against their claimed works (not just this one) would be worth running before next content update.

**Görsellik: 8.5/10**
- Masaüstü: Hero, term-count stat pills (10 SET · 32 TERİM · KLASİK + İZUTSU), and the deep-dive comparison cards are all well composed with clear left-border color coding per term.
- Mobil: Sticky pill row sits cleanly below the breadcrumb without overlap (unlike tefsir-ihtilaflari); cards reflow to single column keeping ayah callouts and 'KULLANIM' notes legible.
- Sorunlar:
  - The horizontal-scrolling row of term-set pills (Kalb·Fu'âd·Sadr, İnsan·Beşer·Nâs, ...) is abruptly clipped at the right edge with no fade/gradient mask, so it visually reads as truncated/cut-off content rather than an obviously scrollable row — present on both desktop and mobile
- İyileştirme önerileri (görsellik):
  - Add a subtle edge fade-out gradient (matching background) on the pill-row container to signal horizontal scrollability, plus maybe a small chevron affordance
  - Otherwise this is one of the standout pages — the color-coded three-word comparison card format (sadr/kalb/fu'âd with distinct accent colors, ayah callouts, 'KULLANIM' footnotes) is worth reusing as a template for other nuance-comparison content

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `YakinAnlamliNuanslar.jsx:195` `#yn-set-bar` `top:'110px'`; 5px örtüşme canlı doğrulandı.
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı eksik — `:203-231`.

---

### `/arac/yeminler`

**İçerik: 8.5/10** — public/yeminler.json: 47 Quranic oaths across 7 categories (celestial, time, place, forces, human-soul, sacred-texts, eschatology), built on Ibn Qayyim al-Jawziyya's classical count in al-Tibyān fī Aqsām al-Qur'ān, including compound-oath breakdowns and per-item purpose/depth notes.
- Güçlü yönler:
  - Methodology note is unusually transparent about counting convention: explains why Sûre Şems shows '7 bileşik yemin' under this classical count vs '11' under broader classifications that count each atıf clause separately — prevents a reader from assuming the number is the only correct one.
  - meccanNote explicitly flags a minority-view exception (Tîn and Âdiyât sometimes classified Medenî) rather than presenting Meccan-only origin as flatly uncontested.
  - Correctly uses et-Tibyân fî Aksâmi'l-Kur'an as the primary source for its actual subject (oaths) — contrast with the misattributed use of the same book on /arac/yakin-anlamli-nuanslar.
- Sorunlar:
  - The 'pullQuote' attributed directly to Ibn Qayyim ('Her yemin ettiği şey, bir delildir...') is presented as a direct quotation but no specific page/volume citation is given alongside it, unlike the tefsir-ihtilaflari page's practice of tagging quotes 'confirmed' — harder for a reader to verify this is verbatim vs. paraphrase.
- İyileştirme önerileri (içerik):
  - Add a page/volume reference to the Ibn Qayyim pullQuote (or a 'confidence' tag as used in tefsir-ihtilaf.json) so it's clear whether it's verified verbatim or a summarizing paraphrase.
  - Since kalb-fuad-sadr on the nuances page mis-cites this exact book, consider a single canonical citation object for 'et-Tibyân fî Aksâmi'l-Kur'an' reused across pages to prevent future drift.

**Görsellik: 9/10**
- Masaüstü: Donut chart with 7 color-coded categories, stat tiles (47/21/7/21-21), and the 3-column bileşik-yemin fact cards are all cohesive and high-polish. Bottom 'Şems/Vakıa/Asr Süresi' related-sûre cards close the page well.
- Mobil: Smart responsive substitution: donut chart becomes a scrollable category list + compact icon-only tab bar (grid/search/chart/lightning/star/bookmark/link). Minor floating-annotation spacing issue noted above; otherwise very well adapted.
- Sorunlar:
  - On mobile, a short annotation/side-note phrase attached to one of the bileşik-yemin cards (e.g. 'Eser ile Ustayı tek yeminde birleştirme — kozmik düzenin ilahi kaynağı') floats to the right of the tag row without its own visual container, reading slightly disconnected from the card's flow
- İyileştirme önerileri (görsellik):
  - Give that inline annotation text its own small badge/box or move it below the tags on mobile so it doesn't float as loose text next to the pill row
  - The 47-yemin donut chart → mobile icon-tab-bar substitution is excellent; consider documenting this responsive pattern for reuse on other stat-heavy tool pages

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `KuranYeminleri.jsx:361-362` `top:'110px'`; 5px örtüşme canlı doğrulandı (scroll 800-3500 arası stabil).
  - [typo] Cross-tool CTA description for "Kur'an'ın Renkleri" reads "Yeminlerin ardındaki tabiat: gün, güneç, semâ." — "güneç" is not a Turkish word, should be "güneş" (sun); the English sibling string correctly says "day, sun, sky". Source: next/src/components/KuranYeminleri.jsx line 481.
  - [console-error] React hydration mismatch on every load (both desktop and mobile viewports): the RadialViz donut-chart SVG <path> "d" attribute differs between server-rendered and client-rendered markup by tiny floating-point precision (e.g. "312.58816624815677" vs "312.5881662481568"), from Math.cos/Math.sin calls in the arcPath() helper. Logged as a full React hydration-mismatch warning in the console. Component: next/src/components/KuranYeminleri.jsx (RadialViz, ~line 512-533).
  - [mobile] Horizontal page overflow at 390px width: document scrollWidth is 396px vs 390px client width (6px overflow), caused by the oath-list cards in the "Kategoriler" tab (e.g. the "وَالشَّمْسِ وَضُحَاهَا" / "وَالْقَمَرِ إِذَا تَلَاهَا" rows) each extending ~5-6px past the right edge of the viewport.

---

### `/arac/zaman-boyutlari`

**İçerik: 9/10** — ZamanBoyutlari.jsx (large inline dataset, ~1800 lines): explores Quranic time expressions (Leyletü'l-Kadr = 1000 months, 40 nights of Moses, Kehf's 300/309 years, the 1-day=1000-years and 1-day=50,000-years verses, Fussilet's 6-day creation) across tabs for scale/language/philosophy/comparison/sources.
- Güçlü yönler:
  - Near every numerically striking claim carries an explicit hedge inline: 'ℹ️ Tefsir görüşü, kesin değil', 'Gözlemsel örtüşme; yorumun bağlayıcılığı tartışmalıdır', 'Bu bir felsefi benzetmedir. Kur'an'ın bilimsel teori ileri sürdüğü iddiası değildir.'
  - The Kehf 300/309-year lunar/solar conversion is shown with the actual arithmetic (300 × 365.25 ÷ 354.37 = 309.21) so the reader can verify the claim rather than take it on faith.
  - Einstein/relativity connection (for the 50,000-year and 1000-year 'day' verses) is explicitly labeled 'bu bir yorum değil, analoji' and 'çağrışım, nedensel bir çıkarsama değil' — textbook-correct hedging against overreach, matching §13.24's spirit even outside its formally-listed pages.
  - Notes when a common popular label ('Kıyamet günü') is NOT actually in the verse text itself ('Ayette Kıyamet geçmez... etiket tefsir yorumudur') — unusually careful distinction between text and interpretive gloss.
- Sorunlar:
  - No significant issues found in the sampled content; disclaimers are dense enough that they occasionally repeat similar caveats (analoji/yorum/gözlemsel) across multiple cards, which is safe but slightly repetitive prose.
- İyileştirme önerileri (içerik):
  - Could consolidate the repeated 'this is analogy, not scientific claim' disclaimer into one persistent page-level banner (shown once) plus lighter per-item tags, to reduce redundant phrasing while keeping the same epistemic caution.

**Görsellik: 9/10**
- Masaüstü: The custom logarithmic time-scale diagram (Kadr 'one night' to Meâric '50,000 years') with labeled tick marks, color-coded milestone dots, and the '2+4+2=6 kozmik evre' formula breakdown with distinct colored number blocks are all excellent, premium execution.
- Mobil: The complex log-scale timeline re-renders at 390px with all labels still legible and non-overlapping (tick labels stack above/below the axis appropriately) — impressive responsive handling of a hard visualization.
- İyileştirme önerileri (görsellik):
  - None significant — this page (and its logarithmic timeline visualization scaling cleanly down to a legible mobile version) is one of the strongest visual executions in the set and could serve as the reference bar for other data-visualization tool pages

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `ZamanBoyutlari.jsx:1745-1746` `top:'110px'`; 5px örtüşme canlı doğrulandı.

---


## Atlaslar (/atlas/*)

### `/atlas/ahiret-yolculugu`

**İçerik: 9/10** — src/data/ahiret-yolculugu.json: 11 chronological afterlife stages (sekerât → berzah → sûr → mahşer → mîzân → havz-şefâat → sırât → cennet-cehennem → rü'yetullâh), each with anchor verse, additional refs, long-form narrationTr/En, multiple classicalTafsir entries (Râzî/Kurtubî/İbn Kayyım/etc.), and a criticalNote surfacing real sectarian disagreement.
- Güçlü yönler:
  - The rü'yetullâh (Beatific Vision) stage lays out Sunni (Ash'arî+Mâtürîdî+Hanbelî), Mu'tezile, İbâzî, and Şiî positions side by side with their respective proof-texts, framed as 'iki farklı lâfz-mânâ ilişkisi kuramının karşılaşması' rather than declaring one side simply correct — genuinely balanced treatment of a real, still-contested theological dispute.
  - Even source metadata is epistemically careful: notes uncertainty about how much of Râzî's Mefâtîh he personally finished writing vs. his students, rather than treating attribution as settled.
  - The sekerât stage's criticalNote correctly identifies that Sunni/Mu'tazila don't actually diverge sharply here (contrary to what a reader might assume), while carefully noting where an early Mu'tazilite subgroup did read 'angels stretching hands' metaphorically — precise rather than a blanket 'sects disagree' claim.
- Sorunlar:
  - At 93KB / 11 dense stages this is one of the longest single-page content sets in the audit; no navigational aid (e.g. a jump-to-stage index) was confirmed from the JSON alone — worth checking the live component for a table-of-contents.
- İyileştirme önerileri (içerik):
  - If not already present, add a sticky stage-progress indicator/jump nav given the page's length and the fact it's positioned as a 'chronological flow hub' — the content quality is high but consumability over 11 stages benefits from stronger wayfinding.
  - Consider a short 'how sects differ across all 11 stages' summary table at the end, since individual criticalNotes are strong per-stage but there's no single glance-able cross-stage comparison of where Sunni/Mu'tazila/Shia views actually diverge vs. converge.

**Görsellik: 3/10**
- Masaüstü: Hero and footer (Klasik Kaynaklar, related tools) render fine; the entire middle content area is blank in a standard full-page screenshot. A left-hand step index list ('01 Sekerât' ... '11 Rü'yetullâh') is visible but the corresponding right-hand content panel is empty at each of those scroll depths.
- Mobil: Same blank-void symptom reproduced at 390px — full-page capture shows hero, then a very long empty stretch, then the footer/kaynaklar section, with no visible step content in between.
- Sorunlar:
  - CRITICAL: the core 11-step journey content (Sekerât → Berzah → Sûr → Diriliş → Mahşer → Amel Defteri → Mîzân+Hesap → Havz-Kevser+Şefaat → Sırât → Cennet & Cehennem → Rü'yetullâh) renders as a near-total blank void in a standard full-page capture/fast-scroll pass — roughly 4500px of empty dark space on desktop (and proportionally on mobile) sits between the hero and the 'Klasik Kaynaklar' footer, with only the left step-index sidebar visible
  - Content for each step only appears after slow, deliberate incremental scrolling (confirmed by re-capturing with 150ms-paced scroll steps), indicating a scroll-triggered reveal/fade-in animation with no reliable fallback for fast scroll, print/PDF, or automated rendering — the practical visual result is a page that looks broken/empty for most of its length under normal fast-scroll browsing
- İyileştirme önerileri (görsellik):
  - Remove or relax the scroll-reveal animation's trigger threshold so content is visible by default and only animates a subtle entrance, rather than staying invisible until a slow dwell-scroll passes its observer threshold
  - Add a no-JS/no-animation fallback (content visible, animation as progressive enhancement only) so fast scrollers, screen readers, and screenshot/print tools always see the 11-step content
  - This is the single lowest-scoring page in the set purely due to this rendering gap — worth an urgent follow-up dedicated to the scroll-reveal implementation

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (gizli/latent) — `AhiretYolculugu.jsx:656` `IndexRail` `top:130` hardcode; aynı dosya zaten `useNavbarOffset` (satır 160) kullanıyor ama bu bileşende değil. Şu an 15px pay var (67px navbar'da), navbar 82-110px'e çıkarsa risk oluşur.

---

### `/atlas/doga`

**İçerik: 7/10** — public/doga-atlasi.json: 22 animals, 19 plants, plus surah-naming notes, thematic contexts, 3 short tefsirNotes, and 5 sources. Mostly short factual entries (frequency count, verse ref, 1-2 sentence note) rather than long-form narrative.
- Güçlü yönler:
  - The bee (arı) entry is a genuine standout: featured with a full 4-tier classical taxonomy of waḥy (wahy-i şer'î / ilhâm / wahy-i tabîî / vesvese) correctly sourced, explaining why the bee's 'only animal directly addressed with the verb waḥā' claim is textually accurate rather than hyperbole.
  - Correctly distinguishes the two different Quranic camels (general creation-sign camel vs. Sâlih's specific she-camel) to prevent a common conflation.
  - Ibn Abbas/Zemahşerî quotes on paradise-fruit resemblance ('isim benzerliği var, mahiyet benzerliği yok') add real depth to at least one tefsirNote.
- Sorunlar:
  - Content depth is uneven and thin relative to the other 10 pages audited: most of the 22 animal and 19 plant entries are single-sentence factoids ('Kur'an'da konuşan birkaç canlıdan biri', 'Modern tarihçiler bu olayı Habeş ordusunun yenilgisiyle ilişkilendirir') without the classical-tafsir-citation depth seen on tarihsel-kanitlar, ahiret-yolculugu, or furuk.
  - Only 3 tefsirNotes and 5 sources total for 41 flora/fauna items — most individual entries carry no scholarly citation at all, just a plain descriptive note, making it harder to judge whether claims like 'Kur'an'ın en uzun sûresi' (Bakara) or frequency counts are independently verifiable from the page itself.
- İyileştirme önerileri (içerik):
  - Add classical tafsir sourcing (even brief, one scholar) to more of the 41 flora/fauna entries — currently only the featured bee entry and a couple of tefsirNotes have named scholarly backing; the rest read as unsourced trivia by comparison to sibling pages.
  - The 'frequency' field (e.g. '~10 kez', '2 kez') should specify its counting methodology (root-form count? exact lexeme? including derived forms?) the way yeminler.json and zaman-boyutlari do, since bare frequency numbers without a stated method are a soft version of the 'invented statistic' risk the site otherwise guards against.
  - Consider merging in more content from bilimsel-isaretler-style entries (the toolCatalog description promises 'bilimsel işaretler' coverage which the current JSON schema doesn't really deliver beyond passing mentions) to close the gap between the catalog's promise and the page's actual depth.

**Görsellik: 8.5/10**
- Masaüstü: Two 'ÖZEL KART' spotlight callouts (Bal Arısının Vahyi, Sinek Meseli) followed by a clean 2-column grid of animal cards with colored category tag pills (Kıssa/Süre Adı/Hapax/Haram-Helal) — consistent, legible, well-organized by search/filter controls at top.
- Mobil: Grid reflows to single column; tag pills wrap correctly under each animal name without crowding; spotlight cards remain legible with Arabic script rendering cleanly.
- İyileştirme önerileri (görsellik):
  - Minor: could add a subtle scroll-to-top or filter-persistence affordance given the animal grid is long (22+ entries), but not a defect

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu (Mechanism 3-benzeri, kırık sticky) — `DogaAtlasi.jsx:1592/1582` — `bodyRef` `overflowY:'auto'` + `flex:1`, atasında sadece `minHeight` var (`height` yok); tab bar (`top:'110px'`) scroll 1500'de -357px'e, scroll 3000'de -1857px'e kayıyor — hero sonrası sekmeler kalıcı olarak kayboluyor.

---

### `/atlas/furuk`

**İçerik: 7/10** — public/word-groups.json: 32 near-synonym 'word family' groups (108 words, 337 sample occurrences) across 7 categories (fear, rain, wind, path, heart, sin, etc.), each word with root meaning, distinguishing note, frequency count, and a curated (non-exhaustive) list of representative verse occurrences with a computed 'dominant pattern %' tag.
- Güçlü yönler:
  - Root-based distinctions are genuinely useful and specific (e.g. havf=action-producing concrete fear vs haşye=knowledge-born stillness vs rehbe=trembling-flight vs vecel=heart-only quiver vs takvâ=protective action) sourced to İbn Kayyım's Medâricü's-Sâlikîn.
  - meta.note is honest about scope: 'Verse occurrence lists are representative key verses, not exhaustive' — the underlying data doesn't pretend to be a full concordance.
  - Frequency counts are attributed to a named source basket (Askerî, İsfahânî, İbn Kayyım, corpus.quran.com).
- Sorunlar:
  - The UI displays a 'dominant pattern %' badge (e.g. '%60 positive', '%100 divine') directly next to the word's full Quranic frequency count (e.g. '124× occurrences') — but the percentage is computed only from the ~3-5 representative sample verses in allOccurrences, not from all 124 actual occurrences. Placed side-by-side with no caveat, this reads to a user as 'in 124 Quranic occurrences, khawf is 60% positive-context' when it is really '3 of 5 hand-picked sample verses were positive' — a small, non-random sample presented adjacent to a large true total in a way that implies representativeness it doesn't have. This is close to the site's own banned category of 'invented percentages.'
- İyileştirme önerileri (içerik):
  - Either compute patternStat.dominantPercentage from the full occurrence set (all ~124 for khawf, etc.) rather than the 3-5 curated samples, or visually decouple the % badge from the frequency count and label it explicitly as 'in the N sample verses shown' so it can't be misread as corpus-wide.
  - Given meta.note already admits the occurrence lists are 'not exhaustive,' the simplest fix is to drop the misleading precise '%' badge entirely for words whose allOccurrences is a small subset of frequency, and replace it with a qualitative label only ('mostly divine-address context in sampled verses') without a numeric percentage.

**Görsellik: 8/10**
- Masaüstü: 32 categorized word-family groups render as a clean multi-column card grid, grouped under section headers (Duygular ve Ruhsal Durumlar, Tabiat ve Evren, İnsan ve Toplum, etc.) with consistent color-coded bullet legend per card. Data-dense but well organized, no overlap or crowding at 1400px.
- Mobil: Reflows to single-column card stack; each 'aile' card keeps its word list, counts, and quote legible. Sticky header/back-button doesn't overlap the tab icon row here (unlike tefsir-ihtilaflari).
- Sorunlar:
  - Page opens directly into a dense dashboard grid without the bismillah/ayah hero treatment used on most other tool pages — appropriate given its 'data explorer' nature but does create a visual tone shift within the site's pattern
- İyileştirme önerileri (görsellik):
  - Consider a lighter-weight hero (even just title + one summary ayah) to keep some visual continuity with sibling pages, since currently the transition from nav straight into the dense card grid feels abrupt
  - The color-coded legend dots (Azap/Rahmet/İlahi/Nötr) are a nice touch — could be repeated as a small always-visible key near the top of the mobile view since the list is long

**Buglar:**
  - [CSS/sticky ailesi] Yeni bulgu (Mechanism 3-benzeri, kırık sticky) — `FurukAtlasi.jsx:181/236` — `overflowX:'hidden'` otomatik `overflow-y:auto`'ya yükseliyor; tab bar scroll 600'den itibaren negatife düşüyor, scroll 2000'de -1581px.
  - [other] 8 of the 32 word-family cards have a one-sentence "principleTr" pull-quote that names a term NOT present in that group's own displayed word list (and drops one of the words that IS displayed), so the quote references an undefined term. Confirmed instances in next/public/word-groups.json (groups[].principleTr): "Günah Aileleri" (cards: Zenb/İsm/Seyyie/Fâhişe) — quote says "...fâhişe aşırılık, cürm kesintidir" (mentions 'cürm', drops 'Seyyie'); "Bilgi Aileleri" (İlm/Ma'rife/Şu'ûr/Yakîn) — quote ends "...dirâye derin kavrayıştır" (mentions 'dirâye', drops 'Yakîn'); "Üzüntü Aileleri" (Hüzn/Gamm/Kerb) — quote adds "...esef pişmanlıklı üzüntüdür" (extra term 'esef' not shown); "Öfke Aileleri" (Gadab/Sahat) — quote adds "...mekt iğrenme düzeyindedir" (extra term 'mekt' not shown); "Erkek Aileleri" (Recul/Zeker/Zevc) — quote adds "...ba'l ev efendisi..." (extra term not shown); "Ölüm Aileleri" (Mevt/Veffâ/Halake) — quote adds "...kazâ ilahi hükümdür" (extra term not shown); "Hayr Aileleri" (Hayr/Birr/Ma'rûf) — quote adds "...salâh yapısal düzgünlük..." (extra term not shown); "Yardım Aileleri" (Nasr/Avn/Te'yîd) — quote adds "...medd uzatmadır" (extra term not shown). Visible on both the Panorama tab pull-quotes and the "Prensip Kitaplığı" tab.

---

### `/atlas/ibadetler`

**İçerik: 8.8/10** — Hub page for the 8 pillars of worship (namaz, zekât, oruç, hac, kurban, zikir, dua, tevbe). Very well-built editorial hub: explicit framing note distancing itself from both fiqh-book status and Kur'aniyyun (Quranist) reductionism, a root-frequency network, a Mecca/Medina timeline, a table of recurring Qur'anic formulae, an obligation-comparison table, three persona-based reading paths, and a cross-pillar 'prophetic traces' aggregation (21 prophet/figure entries). Sourced to Râzî, Kurtubî, Elmalılı, Îzutsu.
- Güçlü yönler:
  - Explicit 'what this hub is / is not' framing (not fiqh, not Qur'aniyyun) — rare and valuable epistemic transparency
  - wowFacts and ortakFormuller entries carry claimType + confidence + kaynak fields consistently
  - karsilastirma table color-codes obligation level with an explanatory note citing the four schools + Râzî on Nisâ 4:17
  - peygamberIzleri cross-references 8 pillars against how prophets appear in each — strong synthesis, not just a list
- Sorunlar:
  - wowFacts item 'wowfact-tovbe-mercy' frames tawba as part of a small reciprocal-verb 'family' alongside dhikr (2:152) and shukr (14:7) — but the zikir pillar page's own hero subtitle calls dhikr 'Kur'ân'da tek karşılıklı fiil' (the ONLY reciprocal verb in the Qur'an), directly contradicting this hub page's own claim. Cross-page inconsistency.
  - 'ortakFormuller' occurrence count for the prayer-zakat formula is given as an approximate range ('25-30 yerde') without a precise citation list beyond 8 sample refs — reasonably hedged but the range itself is not independently verifiable from the page
  - pillars array includes 'dua' (Supplication) as an 8th pillar routing to /arac/dualar rather than an /atlas/ibadetler/* page — inconsistent route pattern for one of eight 'equal' pillars, though this is more a navigation/IA question than pure content
- İyileştirme önerileri (içerik):
  - Fix the zikir hero subtitle (see zikir page findings) so it doesn't contradict this hub's own wowFacts framing of dhikr/tawba/shukr as a reciprocal-verb family
  - Add an explicit note in ortakFormuller clarifying the '25-30' occurrence count is an approximate range from classical concordance counting, not an exact literal tally, to preempt readers treating it as precise
  - Consider a short note explaining why 'dua' lives at /arac/dualar rather than /atlas/ibadetler/dua, since seven of eight pillars are unified under the same route pattern

**Görsellik: 9/10**
- Masaüstü: Hero, 3-col 'Sekiz Sütun' card grid, karşılaştırma tablosu, zaman ekseni split-cards, peygamber izleri list (21 rows), formüller ve 'Kur'ân'ın Açtığı Pencereler' 3-col grid all render cleanly at 1400px with consistent gold-accent styling and Playfair display type. No tab-bar on this page (grid/hub layout), so the overflow bug seen on sibling sub-pages does not apply here.
- Mobil: All sections restack cleanly: 3-col card grid -> 1-col, comparison table -> stacked label/value cards, split Mekke/Medine cards -> stacked. No overlap of the floating 'N' widget with text observed on this specific route's captured segments (it sits in empty margin near the hero card).
- Sorunlar:
  - 'Kur'ân'ın Açtığı Pencereler' 3-col grid ends with a single orphan card in the last row, leaving two empty column-widths of dead space (desktop, ~y=1400 in ibseg_5)
  - The sitewide floating circular 'N' button (fixed near left edge, likely a notes/reading-progress widget) is present on this page too and is a known collision risk with content beneath it, as confirmed occluding text on every other route in this audit
- İyileştirme önerileri (görsellik):
  - Either add a 4th filler card to 'Açtığı Pencereler' or change that grid to auto-fit/centered layout so a lone trailing card doesn't leave a lopsided row
  - Give the floating 'N' widget scroll-aware collision avoidance or move it to a corner that never sits over card copy (e.g. bottom-right, or hide it while a card intersects its hitbox)

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] In the 'Zaman Ekseni — Mekke ve Medine' timeline section, the pillar badge chips are rendered by uppercasing the raw internal id/slug instead of a proper display label, so they show incorrect Turkish spellings: 'TOVBE' (should be 'TEVBE'), 'ZEKAT' (should be 'ZEKÂT'), 'ORUC' (should be 'ORUÇ'). Confirmed in src/components/IbadetlerHub.jsx (ZamanEkseniSection, `{s.replace('-', ' ')}` with CSS uppercase on data.phases[].sutunlar) and public/ibadetler/hub.json (phases[].sutunlar contains ascii slugs like 'tovbe', 'zekat', 'oruc').

---

### `/atlas/ibadetler/hac`

**İçerik: 8.7/10** — Deep treatment of hajj: 8 Qur'anic-name entries (Hajj, Umra, Iḥrām, Ṭawāf, Saʿy, ʿArafa, Mashʿar al-Ḥarām, Minā, Bayt Allāh) each with root, occurrence estimate, and 2 layered meaning notes; genelBakis ties the ritual to the Abrahamic-heritage frame; 4 claims carry explicit confidence tiers (kesin/yaygin-kabul).
- Güçlü yönler:
  - Occurrence-count objects include a transparent 'humanSpotChecked' boolean and spot-check notes — several explicitly admit the count is NOT human-verified, which is honest data-hygiene rather than presenting auto-counted numbers as certain
  - The ʿArafa entry explicitly flags its own etymological folk-explanation as 'rivayet düzeyindedir; kesin dil-tarihsel kanıt zayıftır' (narration-level, weak linguistic-historical evidence) — a model of self-aware hedging
  - Distinguishes cleanly, entry by entry, what the Qur'an itself names (e.g. ʿArafa, Kaʿba) versus what only the mutawātir sunna supplies (e.g. the seven ṭawāf circuits, the name 'Minā')
- Sorunlar:
  - Uses its own 'confidence' vocabulary (kesin/yaygin-kabul) distinct from the high/medium/low or high/null vocabularies used by other pillar pages — a site-wide taxonomy inconsistency, not wrong on this page alone but confusing if a reader compares pages
  - Some occurrence counts (e.g. Ṭawāf ~8, Umra ~4) are marked 'humanSpotChecked: false' yet are still displayed to the reader as if reasonably precise ('~8') — the caveat exists in the data but its visibility to end users on the live page was not verified
- İyileştirme önerileri (içerik):
  - Standardize the confidence-tier vocabulary across all 7 pillar JSONs (namaz/zekat/tovbe use 'high'; hac uses 'kesin'/'yaygin-kabul'; zikir/kurban/oruc have no field at all) so cross-page comparison table logic (if any) doesn't silently break
  - Surface the humanSpotChecked:false flag visibly in the UI (e.g. a small 'yaklaşık' or tooltip) wherever an occurrence count is shown, not just in the JSON metadata

**Görsellik: 7/10**
- Masaüstü: Strong hero and 'Bir Bakışta' / semantik-alan / 4-insight-card sections match the site's premium bar. However at 1400px the horizontal tab bar (GENEL BAKIŞ...KAYNAKLAR, 9 tabs) overflows the viewport and the last tab is hard-clipped mid-word ('KA...') with no fade gradient or scroll arrow indicating more tabs exist.
- Mobil: Tab row scrolls horizontally but is also clipped mid-word ('ANA AYETLE...') with no visual affordance. The floating 'N' button sits directly on top of the italic subtitle text ('İbrahim'in yükselttiği taş...'), partially occluding the first word — confirmed via crop.
- Sorunlar:
  - Desktop: 9-tab row overflows 1400px viewport, last tab label clipped with zero affordance that it's scrollable
  - Mobile: floating 'N' widget overlaps and occludes part of the page subtitle text
  - Mobile: tab row also clips a tab label at the right edge with no fade/gradient cue
- İyileştirme önerileri (görsellik):
  - Add a right-edge fade-out gradient + chevron affordance to the tab bar whenever it overflows, on both breakpoints
  - Reduce tab label length or let tabs wrap to a second row past a tab-count threshold instead of clipping
  - Reposition/z-index the floating 'N' button so it never sits over hero/subtitle text (add a content-aware offset or collapse it near text blocks)

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `IbadetlerPillar.jsx:124-125` `top:'110px'`; canlı 5px örtüşme doğrulandı.
  - [typo] Semantic-field map term list shows 'Şeâir-i Ilâhî' with a dotless capital I instead of the correct dotted Turkish İ ('Şeâir-i İlâhî'). Inconsistent within the same file (line 443 correctly has 'İlâhî işaretler') and with the equivalent term on /atlas/ibadetler/kurban which correctly reads 'Şeâir-i İlâhî'. Source: public/ibadetler/hac.json line 422 (termTr).

---

### `/atlas/ibadetler/kurban`

**İçerik: 8.3/10** — Sacrifice/kurban page anchored on Hac 22:37 ('neither flesh nor blood reaches Allah, only taqwā does'). Strong theological throughline: kurban framed as relinquishing ownership-claim over the self rather than a ritual transaction. Ties in Ibrahim-Ismail (Sâffât 37:102-107), Habil-Kabil (Maide 5:27), and universality across communities (Hac 22:34).
- Güçlü yönler:
  - Every claim's framingTr grounds the claim in a specific ayah phrase quoted in Arabic transliteration, not just paraphrase
  - Explicitly notes sacrifice is NOT unique to this community (Hac 22:34, 'her ümmete bir nüsük verdik') — actively avoids an exclusivist framing that would be easy to fall into on this topic
  - genelBakis ties kurban to namaz (Kevser 108:2) and to a whole-life framing (En'âm 6:162) coherently
- Sorunlar:
  - The 'claims' array (4 items) lacks the confidence/claimType metadata fields present on namaz/zekat/tovbe/hac — schema drift; readers can't tell if these 4 claims are meant to carry the same evidentiary weight as claims on other pillar pages
  - 'ozelNamazlar' top-level JSON key (literally 'special prayers') is present but null — leftover template field copied from namaz.json's schema, harmless if unrendered but a data-hygiene smell
- İyileştirme önerileri (içerik):
  - Add confidence/claimType fields to the 4 claims to match namaz/zekat/tovbe/hac's schema
  - Remove the dead 'ozelNamazlar: null' key or repurpose it meaningfully for kurban-specific content (e.g. udhiye vs hedy distinction) rather than leaving it as inherited dead weight

**Görsellik: 8.5/10**
- Masaüstü: 8 tabs fit cleanly within 1400px with 'KAYNAKLAR' fully visible — no overflow here, unlike hac/namaz/oruç. 4-insight-card grid, semantic map and closing sections are clean and on-brand.
- Mobil: Cards and tables restack correctly. The floating 'N' button sits at the tab-row/hero boundary; not clearly occluding legible text on this route's captured frame but sits close enough to tab underline that it reads as slightly messy.
- Sorunlar:
  - Floating 'N' button visually intrudes into the tab-bar area on mobile (sits on/near the active tab's top-left corner)
- İyileştirme önerileri (görsellik):
  - Nudge the floating widget's vertical offset so it clears the tab bar strip specifically, since that's a recurring collision zone across all ibadetler sub-pages

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — aynı dosya/satır (`IbadetlerPillar.jsx:124-125`); canlı örtüşme doğrulandı.

---

### `/atlas/ibadetler/namaz`

**İçerik: 9/10** — The flagship pillar page (explicitly billed in the hub as the most detailed, 11 tabs). 15 Qur'anic terms in kuraniIsimler, 7-item icBoyut, vakitMekan with a time-axis and qibla-history section, rakamsalMimari with an explicit 'this is not Kur'aniyyun' disclaimer, 8 ozelNamazlar variants, 8 peygamberVaryasyonlari, and a dedicated kiraatBoyutu (recitation dimension) tab.
- Güçlü yönler:
  - rakamsalMimari.tensionNote explicitly guards against sectarian misreading: 'this tab does not open a door to Qur'aniyyun discourse... the classical Sunni framework and four schools apply; this page is not a fiqh book'
  - Only page in the audited set with a populated ozelNamazlar array (5 items), matching its billed role as the deepest pillar
  - claims carry claimType across three distinct categories (quran_explicit, quran_semantic, semantic_inference) — a more granular and informative taxonomy than most sibling pages
- Sorunlar:
  - Given its stated 11-tab breadth this page was only sampled at the top-level-key/section-count level in this audit, not read tab-by-tab in full; deeper QA (e.g. every ayet reference resolves correctly) was not performed here
- İyileştirme önerileri (içerik):
  - Since this page is the reference implementation other pillars are visibly copied from (shared schema, some fields null elsewhere), consider explicitly documenting it as the 'template' page so future pillar additions inherit its full field set rather than a partial one

**Görsellik: 7/10**
- Masaüstü: Rich content (semantic map with 15 terms, 4 insight cards) is well laid out. Tab bar has 9 tabs (incl. 'ÖZEL NAMAZLAR', 'VAKİT VE MEKÂN', 'NAMAZIN SÖZÜ') and overflows 1400px — 'PEYGAMBERLER' is the last fully-visible tab, with more tabs presumably clipped off-screen and no fade/scroll cue.
- Mobil: Floating 'N' button overlaps the 'Bir Bakışta' paragraph body copy directly, obscuring part of the word 'dönen' mid-sentence — confirmed via crop.
- Sorunlar:
  - Desktop: tab row overflow, same pattern as /hac and /oruc (9-tab pages break, 7-8 tab pages don't)
  - Mobile: 'N' button occludes body paragraph text mid-word
- İyileştirme önerileri (görsellik):
  - Same fix as /hac: fade+scroll affordance for tab overflow, and content-aware repositioning for the 'N' widget
  - Consider a global tab-overflow test across the whole ibadetler template rather than per-page, since it silently breaks once a page crosses ~8 tabs

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — aynı dosya/satır; canlı örtüşme doğrulandı.

---

### `/atlas/ibadetler/oruc`

**İçerik: 8.5/10** — Fasting page anchored on Bakara 2:183-187, framed around taqwā as stated purpose, the Ramadan-Qur'an link (2:185), built-in concessions for the sick/traveler within the same obligation-verse, and the semantic widening of 'savm' to include Maryam's speech-fast (19:26).
- Güçlü yönler:
  - claims consistently frame the concession (ruhsat) for sick/traveler as inscribed IN the same obligation verse rather than a later softening — a nuanced, accurate reading
  - Zekeriyya's 'three days of silence' sign (Meryem 19:10) is explicitly labeled by classical tafsir as a miraculous sign (āya), NOT as fasting — the page is careful not to conflate it with ṣawm, only noting a 'semantic tie may be considered' with appropriate hedging ('kesin destek yok')
  - 'Ramazan is the only month named in the Qur'an' is a well-established, verifiable fact, not an invented claim
- Sorunlar:
  - claims array (4 items) again lacks confidence/claimType fields, same schema drift seen in kurban/zikir
  - 'ozelNamazlar' key present but null — same template leftover as other non-namaz pillars
- İyileştirme önerileri (içerik):
  - Add confidence/claimType metadata to the 4 claims to match namaz/zekat/tovbe/hac
  - Could add a short explicit note distinguishing Zekeriyya's 'miraculous silence' from the Ramadan fast more prominently in the UI (currently buried in a peygamberVaryasyonlari entry) to prevent readers skimming past the hedge

**Görsellik: 6.5/10**
- Masaüstü: Same 9-tab overflow issue as /hac and /namaz — last tab clipped at the 1400px edge with no affordance. Otherwise the 'Bir Bakışta', semantic map and 4-card grid sections are well executed and on-brand.
- Mobil: Floating 'N' button sits directly over the 'BİR BAKIŞTA' eyebrow label, fully covering the 'Bİ' — this is the clearest/worst instance of the sitewide overlap bug found in this audit, directly obscuring a UI label rather than body prose.
- Sorunlar:
  - Desktop: tab bar overflow, last tab clipped mid-word, no scroll affordance
  - Mobile: 'N' button fully occludes the 'BİR BAKIŞTA' section-eyebrow label (not just body text)
- İyileştirme önerileri (görsellik):
  - Highest-priority fix candidate for the 'N' widget collision — this route shows it can blot out a UI label entirely, not just prose
  - Apply the same tab-overflow fix proposed for /hac and /namaz

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — aynı dosya/satır; canlı örtüşme doğrulandı.

---

### `/atlas/ibadetler/tovbe`

**İçerik: 8.8/10** — Repentance page centered on the reciprocal verb tāba (kul döner, Allah da döner). Strong prophet-scene gallery: Adam (Bakara 2:37), Yunus (Enbiyâ 21:87), Musa (Kasas 28:16), each broken into a consistent 3-4 step structural analysis (confession/request/immediate acceptance).
- Güçlü yönler:
  - Correctly avoids claiming tawba is uniquely reciprocal — hero subtitle says only 'not one-directional... but reciprocal,' with no 'only/tek' exclusivity claim, consistent with hub.json's own framing of tawba/dhikr/shukr as a shared reciprocal-verb family
  - Hadith-sourced material (e.g. a supplication's reported efficacy) is explicitly marked as 'hadis literatürü... bildirimi' (a report from hadith literature), not asserted as Qur'anic fact
  - Structural parallel drawn between Musa's and Adam's confession language ('nefsime/nefslerimize zulmettim') is a genuinely interesting, properly-attributed (Râzî) textual observation rather than an invented pattern
- Sorunlar:
  - No major issues found in the sampled material; claims carry 'high' confidence uniformly without finer gradation (unlike hac's kesin/yaygin-kabul split) — minor missed opportunity to distinguish stronger vs weaker claims
- İyileştirme önerileri (içerik):
  - Could adopt a finer confidence gradation (as hac does) for claims like the Fetih 48:2 'zenb' interpretation, which the page itself notes has multiple classical readings — currently flattened to a single 'high' confidence despite acknowledged interpretive plurality

**Görsellik: 7/10**
- Masaüstü: 8 tabs fit within 1400px without clipping. Hero, semantic map, and 4-card insight grid are clean and consistent with the site's established pattern.
- Mobil: Floating 'N' button overlaps the italic subtitle line ('Kul döner (tâbe)...') directly, covering part of the opening word — confirmed via screenshot.
- Sorunlar:
  - Mobile: 'N' button occludes part of the page subtitle/tagline text
- İyileştirme önerileri (görsellik):
  - Same widget-repositioning fix as other routes; subtitle occlusion is especially visible since it sits in large italic serif type

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (kod düzeyinde aynı hata, `IbadetlerPillar.jsx:124-125`) — bu sayfada hero uzunluğu farkı nedeniyle canlı testte örtüşme henüz tetiklenmedi, ama kod hac/kurban/namaz/oruç ile birebir aynı — tek merkezi düzeltme (useNavbarOffset) hepsini kapsamalı.

---

### `/atlas/ibadetler/zekat`

**İçerik: 8.7/10** — Zakat page distinguishing zekât/sadaka/infâk/mâûn/'hakk-ı ma'lûm' terminology, opening with the 'purification' framing (Tevbe 9:103) and the eight-category recipient list (Tevbe 9:60). Standard fiqh percentages (1/40 = 2.5%, 1/10 for unwatered produce) are correctly cited as real, not invented, figures.
- Güçlü yönler:
  - Percentage figures (2.5%, 10%) are standard, verifiable fiqh figures, not the kind of invented statistic the site's standing rule warns against
  - Explicitly notes zakat is attested in BOTH Meccan (Meâric 70:24-25) and Medinan revelation — actively works against a common misconception that zakat is purely a Medinan/late institution
  - Musa's covenant record (Bakara 2:83) is used to show zakat is 'not unique to one ummah' — same anti-exclusivist discipline seen on the kurban page
- Sorunlar:
  - claims carry claimType across quran_explicit/quran_semantic/semantic_inference like namaz — good, but this again highlights that half the pillar pages (namaz/zekat) have this granularity and half (zikir/kurban/oruc) don't, a site-wide inconsistency rather than a fault of this page specifically
- İyileştirme önerileri (içerik):
  - None specific to this page beyond the site-wide schema-consistency fix already noted for other pillars

**Görsellik: 7/10**
- Masaüstü: 7 tabs fit comfortably within 1400px. Content sections (Bir Bakışta, 13-term semantic map, 4 insight cards) match the established premium bar with no desktop-specific issues found.
- Mobil: Floating 'N' button again fully covers the 'Bİ' of the 'BİR BAKIŞTA' eyebrow label, same as /oruc — a repeat instance of the worst variant of this bug.
- Sorunlar:
  - Mobile: 'N' button occludes the 'BİR BAKIŞTA' section label
- İyileştirme önerileri (görsellik):
  - Fix the shared floating-widget component once — this exact occlusion (eyebrow label under 'Bir Bakışta' card) recurs identically on /oruc and /zekat, suggesting a fixed viewport-relative position that happens to land on this card's top-left corner on most sub-pages

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (kod düzeyinde aynı, bkz. tövbe notu) — canlı örtüşme bu sayfada tetiklenmedi ama aynı hardcode riskli.

---

### `/atlas/ibadetler/zikir`

**İçerik: 6.5/10** — Remembrance/dhikr page, otherwise deep (15+ dhikr forms, tesbihat counts 33+33+33+1, the reciprocal Bakara 2:152 formula) but undermined by an unhedged absolute claim in its hero subtitle that both violates the site's own anti-absolutism rule and contradicts a sibling page's data.
- Güçlü yönler:
  - Body text is otherwise self-aware about overclaiming: one passage explicitly walks back a stronger version of a similar claim ('ayet zikri kalbin huzurunun tek yolu değil (o iddia çok güçlü olur), fakat en kesin... yolu olarak sunar') — showing the page's authors clearly know how to hedge when they choose to
  - Rich formal breakdown of Ahzâb 33:41 into 5 grammatical layers (fiil, meful, sıfat, etc.)
  - Distinguishes the reciprocal Bakara 2:152 formula from the merely-frequent-but-not-reciprocal usages of dhikr elsewhere
- Sorunlar:
  - Hero subtitle states dhikr is 'Kur'ân'da tek karşılıklı fiil' (THE ONLY reciprocal verb in the Qur'an) — an unhedged absolute claim of exactly the 'tek/no other' type the site's standing content rule prohibits
  - This claim directly contradicts /atlas/ibadetler (hub.json wowFacts, 'wowfact-tovbe-mercy'), which explicitly states tāba, dhikr (2:152), and shukr (14:7) belong to 'a small family' of reciprocal verbs and calls tawba 'that family's clearest instance' — i.e., the hub itself does not treat dhikr as unique
  - 'Kur'ân'da başka hiçbir ibadet için verilen bu esneklik verilmez' (no other worship in the Qur'an is given this [temporal] flexibility) is a second unhedged absolute claim in the same body paragraph, similarly unverifiable as stated
- İyileştirme önerileri (içerik):
  - Rewrite the hero subtitle to match the hedged tone used elsewhere on this same page, e.g. 'one of the Qur'an's rare reciprocal verbs' rather than 'the only reciprocal verb'
  - Reconcile with hub.json: either soften the hub's reciprocal-verb-family framing or soften zikir's exclusivity claim so the two pages agree
  - Soften 'başka hiçbir ibadet... verilmez' to something like 'stands out among Qur'anic acts of worship for its lack of temporal restriction' — preserves the interesting observation without the unfalsifiable universal negative

**Görsellik: 7/10**
- Masaüstü: 7 tabs, no overflow. Strong content: gramatik-simetri explanation, 12-term semantic map, 4-card insight grid, all well aligned and readable at 1400px.
- Mobil: Floating 'N' button overlaps the 'Bir Bakışta' body paragraph, covering the start of the word 'Zikir' in the first sentence.
- Sorunlar:
  - Mobile: 'N' button occludes the first word of the lead paragraph
- İyileştirme önerileri (görsellik):
  - Same shared-widget fix as other sub-pages

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (kod düzeyinde aynı, bkz. tövbe notu) — canlı örtüşme bu sayfada tetiklenmedi ama aynı hardcode riskli.
  - [typo] Hero eyebrow text reads 'KALBİN SUYUKATI · KUR'ÂN'IN NEFESİ' — 'SUYUKATI' is not a real Turkish word (garbled). The English counterpart is 'THE HEART'S IRRIGATION', confirming the Turkish text should say something like 'KALBİN SULANMASI' but was corrupted. Source: public/ibadetler/zikir.json line 16 (hero.eyebrowTr).

---

### `/atlas/insan-psikolojisi`

**İçerik: 8.6/10** — Maps Qur'anic ethico-psychological concepts (nefs stages, qalb typology, fear taxonomy, defense mechanisms via Yusuf/Firavun narratives, Yusuf's trauma-recovery arc, social psychology, coping tools, meaning-making, and an explicit Qur'an-vs-modern-psychology comparison) against modern psychology (Freud, Jung, Maslow, Frankl, Festinger, Seligman).
- Güçlü yönler:
  - Carries an explicit, prominent methodologyNote disclaiming the comparison as 'philosophical observation,' not a claim that 'the Qur'an foresaw this concept 1,400 years ago' — a textbook-clean application of the site's anti-Bucaillism framing rule
  - 9 substantive tabs (nefs, kalp, korku, savunma, yusuf, sosyal, araçlar, anlam, modern) each with multiple concrete items grounded in specific narrative/verse material, not vague generalities
  - Yusuf trauma-recovery arc (betrayal → enslavement/identity-stripping → false accusation/imprisonment → ...) is a genuinely well-constructed staged reading of the sura tied to specific psychological framing without overclaiming clinical equivalence
- Sorunlar:
  - Scan of all psychology-section text for risky absolute language (hiçbir, mucize, ispat, kesinlikle, en büyük) turned up only benign hits — direct ayah translations or standard academic phrasing (e.g. 'death anxiety' terminology) — no unhedged overclaim found in the sampled content
  - Content lives fully inside i18n JSON (tr.json/en.json) rather than a dedicated public/*.json, meaning any future translation drift between TR/EN must be manually kept in sync across a much larger combined file — a structural risk more than a content flaw observed here
- İyileştirme önerileri (içerik):
  - None significant found; page is a strong model for how to do a Qur'an/modern-psychology comparison without overclaiming — could be used as the internal reference pattern for future similar comparative pages

**Görsellik: 6/10**
- Masaüstü: Distinct icon+color tab styling (purple/violet active state and underline) breaks from the site's signature gold accent used everywhere else — reads as an off-brand module bolted onto the atlas. The 6-tab row (with icons) also overflows 1400px, clipping 'Psikolojik Ara...'. More seriously, there is a large unexplained empty section (~300-400px of blank space) between the 'DAHA DERİNE — PSİKOLOJİK DERİNLİĞİ YÜKSEK SÜRELER' heading and the next visible content block, suggesting a broken/missing carousel or card list for that section.
- Mobil: Tabs wrap into a clean 2-column grid on mobile (better than desktop's clipped scroll row), and the 'Klasik Nefs Psikolojisi' 6-card list stacks well. The same empty-section bug reproduces on mobile too — after the 'Daha Derine — Psikolojik Derinliği Yüksek Süreler' heading the page goes blank for most of a screen height before the next section begins. Floating 'N' button also overlaps the lead paragraph text ('Modern psikoloji, insan zihnini...').
- Sorunlar:
  - Desktop+mobile: an entire content section under the 'Psikolojik Derinliği Yüksek Süreler' heading appears empty/broken, leaving a large dead-space void on both viewports
  - Desktop: violet/purple tab accent and icon treatment is inconsistent with the site's gold-accent design language used on every other audited page
  - Desktop: 6-icon tab row overflows 1400px with a clipped last tab and no scroll affordance
  - Mobile: 'N' button overlaps the lead paragraph
- İyileştirme önerileri (görsellik):
  - Investigate why the süre-list/carousel under 'Psikolojik Derinliği Yüksek Süreler' isn't rendering — likely a data-fetch or conditional-render bug, this is the most visually damaging issue found in the whole batch
  - Restyle this page's tabs to use the standard gold active-state instead of purple, for brand consistency
  - Apply the same tab-overflow fix as the ibadetler sub-pages

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] Classical-sources card lists author as 'er-Râgıb el-Isfahânî' using a dotless capital I; every other occurrence of this scholar's name across the codebase (EsmaFrekans.jsx, KitapKavrami.jsx, KuranRenkleri.jsx) correctly uses dotted İ ('el-İsfahânî'). Source: src/components/InsanPsikolojisi.jsx line 175.

---

### `/atlas/insan-tanimi`

**İçerik: 8.8/10** — Four-tab page: core concepts (via sections/HumanDefinition, i18n-driven), the FITRAT+AKIL+İRADE+VAHY→İSTİKÂMET 'human equation,' a 6-scholar grid (Râgıb el-Isfahânî, İbn Kayyim, Râzî, Kurtubî, Gazâlî, İbn Âşûr), and sources.
- Güçlü yönler:
  - Explicitly separates the 6.236-verse Qur'anic ayah count from the traditionally-cited 6.666 figure, with a dedicated infoBody explaining where 6.666 comes from and that it is not the literal count — proactive correction of a very common popular misconception
  - Cleanly distinguishes a hadith-sourced detail (the Prophet's 'Hûd made me old' statement, the Gabriel-hadith definition of ihsan) from Qur'anic text with explicit 'this is from hadith, not Qur'an' notes
  - 4-word terminology breakdown (insân/beşer/nâs/benî Âdem) is sourced to Râgıb el-Isfahânî's al-Mufradāt with a genuine etymological point (insân linked to both ünsiyet/intimacy and nisyân/forgetfulness) rather than a generic gloss
- Sorunlar:
  - None significant found in the sampled sections; scan for absolute/miracle/proof language across insan-tanimi-ext.json returned zero hits
- İyileştirme önerileri (içerik):
  - None significant identified beyond general upkeep

**Görsellik: 7.5/10**
- Masaüstü: Distinctive asymmetric hero (bismillah/verse right-aligned, eyebrow+title left-aligned) reads as an intentional, premium variation rather than a mistake. Only 4 tabs, all fit cleanly at 1400px. Rich sections: 4-term breakdown, Mü'min Anatomisi with 7 clickable vasıf cards, contrast-pair table ('Kur'ân'ın Zıtlık Sistemi'), 'İstikâmet' word-by-word breakdown, and 3-stage dönüşüm cards — all well built and on-brand.
- Mobil: Contrast pairs convert nicely from a 2-col table to stacked vertical pairs. Tab row overflows off-screen with 'ULEMA YA...' clipped and no fade cue (expected on mobile but still lacks affordance). Floating 'N' button directly overlaps the 'Sizi Nasıl Görüyor?' subheading, covering the leading 'S'.
- Sorunlar:
  - Mobile: 'N' button occludes part of a subheading ('Sizi Nasıl Görüyor?')
  - Mobile: tab row is clipped mid-word at the right edge with no fade/scroll affordance (consistent with other routes)
- İyileştirme önerileri (görsellik):
  - Shared widget-position and tab-fade fixes as noted for other routes

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] Same scholar-name typo as on /atlas/insan-psikolojisi: 'er-Râgıb el-Isfahânî' (dotless I) should be 'el-İsfahânî' (dotted İ), per the correct spelling used elsewhere in the codebase. Source: public/insan-tanimi-ext.json lines 74 and 130 (author field, appears twice).

---

### `/atlas/insan-yolculugu`

**İçerik: 7.8/10** — A curated 10-stage spiritual-maturation model (Fıtrat → Uyanış → İman → Amel → Takvâ → İhsan → Kalb-i Selîm → Hüsn-i Hâtime → Rızâ → Cemâlullah), each stage anchored to a verse with supporting verses, an obstacle, and a practice note. Sourced to Ibn Qayyim's Madārij al-Sālikīn, Ghazâlî's Iḥyāʾ, Râzî, and Said Nursî.
- Güçlü yönler:
  - Sources are genuinely apt — Madārij al-Sālikīn is specifically a classical taxonomy of spiritual 'stations,' making it a well-chosen anchor for this page's structure rather than a generic citation
  - Final stage (Cemâlullah / ruʾyat Allāh) correctly pairs the affirming verse (Kıyâme 75:22-23) with the denial-of-vision counter-verse (Mutaffifîn 83:15) rather than presenting only the position favorable to its own framing
  - Consistently distinguishes Qur'anic anchor text from hadith-sourced practice notes (e.g. the Prophet's duʿāʾ is attributed to Nesâî, not folded into the Qur'anic material)
- Sorunlar:
  - The specific 10-stage sequence and its exact order/labels appear to be an editorial synthesis drawn from at least 4 different classical authors across centuries (Ibn Qayyim, Ghazâlî, Râzî, Said Nursî) rather than a single canonical list from one source, yet the page's title/subtitle present it as simply 'the map drawn by the Qur'an' ('Kur'ân'ın çizdiği manevî olgunlaşma haritası') without flagging that the specific 10-part sequence is a curated construction
  - Intro asserts stages proceed strictly in order and 'hiçbiri atlanmadan geçilmez' (none can be skipped) — a fairly strong sequential/mandatory-order claim about a mystical-psychological process that is not obviously falsifiable or uniformly agreed upon across the four cited authors, presented without a hedge
  - Cemâlullah/ruʾyatullah is presented as the flowchart's terminal state without noting (as the ibadetler hub does elsewhere) that this rests on the classical Sunni (Ashʿarî/Māturīdī) position specifically, versus e.g. Muʿtazilī denial of beatific vision — the page's own 'obstacle' text quotes the Muʿtazilī-adjacent counter-verse (83:15) but doesn't name the theological debate it belongs to
- İyileştirme önerileri (içerik):
  - Add a short framing note (similar to ibadetler hub's framingTr) clarifying that the 10-stage sequence is an editorial synthesis of classical Sufi/tafsir literature rather than a single verbatim Qur'anic or hadith list
  - Soften 'hiçbiri atlanmadan geçilmez' to something like 'klasik literatür bu aşamaları birbirini besleyen bir seyir olarak sunar' (classical literature presents these as a mutually-building sequence) to avoid an unfalsifiable universal claim about a spiritual process
  - Could add a one-line note that the beatific-vision (ruʾyatullah) framing follows the classical Sunni majority position, mirroring the ibadetler hub's practice of naming its own doctrinal scope explicitly

**Görsellik: 7.5/10**
- Masaüstü: Uses a distinct sidebar-stepper layout (10-aşama vertical list + detail panel) instead of horizontal tabs — this elegantly sidesteps the tab-overflow bug seen elsewhere and is a strong, purposeful design choice. However the floating 'N' button directly overlaps step node '2' (Uyanış) in the sidebar, visually merging with the numbered circle.
- Mobil: Sidebar converts to a horizontal scrolling chip row ('1. Fıtrat', '2. Uyanış'...) which works well, but the floating 'N' button sits squarely on top of the first chip ('1. Fıtrat'), the most prominent primary-navigation element on the page — the worst-positioned instance of this bug in terms of functional importance.
- Sorunlar:
  - Desktop: 'N' button overlaps/merges with sidebar step-node '2'
  - Mobile: 'N' button sits directly on the first (and default-active) step chip, obscuring primary navigation
- İyileştirme önerileri (görsellik):
  - This route makes the strongest case for fixing the floating widget's positioning logic — it's landing on interactive navigation elements, not just static text, which risks both visual confusion and mis-taps

**Buglar:**
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı eksik — `InsanYolculugu.jsx:220-238` mobil "stage chip" sticky şeridi `letterSpacing` var ama `textTransform:uppercase` yok.
  - [typo] Stat-strip badge reads 'FIṬRA → CEMÂLULLAH' (and English 'FIṬRA → JAMĀL ALLĀH') — missing the final 'T'. The sibling page /atlas/insan-tanimi uses the correctly spelled 'FIṬRAT' for the same term, so this is an inconsistent/incomplete transliteration. Source: src/components/InsanYolculugu.jsx line 197.

---

### `/atlas/kadinlar`

**İçerik: 9/10** — Catalogs 14 individually-narrated Qur'anic women (Meryem, Asiye, Havva, Saba Melikesi, Sara, Musa's mother, İmran's wife, Aziz's wife/Zelîha, Lût's wife, Nûh's wife, Yahya's mother, Şuayb's daughter, Havle, Musa's sister), each with themes, key verse, summary, and — notably — a critical note surfacing scholarly debate.
- Güçlü yönler:
  - All 14 figures carry a criticalNoteTr/En surfacing genuine classical debate (e.g. whether Meryem was a prophetess — Ibn Hazm/Qurtubî's zâhirî minority view vs. the jumhūr's ṣiddīqa classification vs. the Ashʿarî 'no female prophets' position) rather than flattening to a single received answer — a strong, consistent pattern across every entry, not just a showcase example
  - 'Only woman named by her own name in the Qur'an' (Meryem) is a well-established, verifiable scholarly fact rather than an invented superlative
  - 'Miracle' language used throughout (miraculous births, Zelîha's confession 'proving' Yusuf's innocence) refers to events the Qur'an itself narrates as miraculous within its own story, not the site's own science/archaeology-confirms-the-Qur'an framing that the standing rule targets — correctly out of scope for that particular concern
- Sorunlar:
  - No significant issues found in the sampled figures; broad grep across the full file for absolute/proof/miracle-overclaim language surfaced only one benign narrative-plot usage ('kanıtlar' = 'proves [within the story]', referring to Yusuf's innocence being established by the plot, not a real-world evidentiary claim)
- İyileştirme önerileri (içerik):
  - None significant identified; consider extending the same criticalNote pattern (already used consistently here) as the house style for any future comparably sensitive biographical/atlas content, since it is demonstrably effective at this page's scale (14/14 entries)

**Görsellik: 8/10**
- Masaüstü: Distinct left-aligned hero with filter chips and color-coded category legend (Seçilmiş Kullar / Peygamber Eşleri / Hükümdar / etc.) is a strong, purposeful design distinct from the ibadetler template. The 4-column women-profile card grid is content-rich (verse, translation, tema chips, geçtiği ayetler, tarihsel nüans) but produces visibly ragged row-bottom alignment where one card's 'Tarihsel Nüans' note is much longer than its row-mates (e.g. row with Asiye/Havva/Belkıs/Sara cards).
- Mobil: Cards, filter chips, and the 3-verse 'Çekirdek Ayet' block all restack cleanly to single-column. Floating 'N' button overlaps the edge of the Arabic verse line in the çekirdek-ayet card (partial glyph occlusion, less severe than Latin-text cases elsewhere since it's at the line's leading edge).
- Sorunlar:
  - Desktop: 4-col card grid has uneven card heights within a row due to variable 'Tarihsel Nüans' length, giving a ragged/unbalanced bottom edge
  - Mobile: 'N' button overlaps the edge of an Arabic verse line
- İyileştirme önerileri (görsellik):
  - Cap/clamp the 'Tarihsel Nüans' excerpt with a 'devamını oku' expand toggle so row heights stay consistent, or switch to CSS grid with equal-height rows and internal scroll for the overflow text
  - Standard widget-position fix as elsewhere

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [typo] In the 'Hz. Eyyûb'un Eşi' historical-nuance note, text reads 'sembolik bir darbtir' — a broken word missing a letter; should read 'darbedir' (darbe + dir). Source: public/kadinlar.json line 310 (noteTr field).

---

### `/atlas/kavim`

**İçerik: 8.5/10** — 16 destroyed/spared nations (Nuh, Âd, Semûd, Lût, Firavun, Medyen, Eyke, İbrahim's people, Karun, Ress, Tübba', İrem, Yunus's people, Sebe, Uhdud, Sebt) from public/kavimler.json, each with summary, anchor verse, geography, archaeology status, and an 'infoTr' hedging field.
- Güçlü yönler:
  - Consistently hedges archaeological/historical identification claims ('tartışmalı', 'akademik konsensüs yoktur') rather than asserting certainty — e.g. explicitly debunks Bucaille's 'salt crystal' mummy argument as rejected by Egyptology.
  - Names real, checkable scholars for disputed identifications (Christian Robin/CNRS on Himyar, Juris Zarins vs Nicholas Clapp on Ubar/Iram) rather than vague appeals to authority.
  - Distinguishes Quranic text from later legendary accretions (e.g. notes 'Sodom/Gomorrah' are Biblical, not Quranic, names).
- Sorunlar:
  - The Uhdud entry states the Quran's curse language is 'a condemnation used for no other people in the Quran' — an unhedged absolute ('no other') that is an editorial claim, not a direct verse quote, and is exactly the pattern the site's own rules ban.
  - Some 'mainSurah' verse-range citations are dense abbreviations (e.g. 'Hud 11:25-48') that could be confused with page-internal formatting if not rendered with full surah names consistently.
- İyileştirme önerileri (içerik):
  - Rephrase the Uhdud 'no other people' claim to 'one of the few/strongest condemnations' or cite it as a linguistic observation with a scholarly source rather than a flat absolute.
  - Add a short cross-reference to /atlas/kissa and /atlas/sunnetullah since kavim/helak content overlaps thematically with both (helak = sunnetullah's central case study).

**Görsellik: 9/10**
- Masaüstü: Strong hero (bismillah calligraphy, verse quote, italic pull-quote), stat-pill row (16/~70/10/7/1), filter chip row, then a clean 2-col card grid for 16 kavim with icon, title badges, geo/era meta, description, CTA. Consistent gold-accent/dark-cosmic styling throughout. Closing reflection section + related-tools cards round it out well.
- Mobil: Hero and stat pills (2x2 grid) stack cleanly. Cards go full-width single column, well-proportioned. Sub-tab row (Tümü/Helak Olan/Kurtulan/Bilgi Kısıtlı/Arkeolojik Kanıt) and the top nav tabs (Kavimler/Helak Deseni/Arkeoloji/Bölge Haritası/Karşılaştır) truncate hard at the viewport edge with no fade/scroll affordance — same pattern seen sitewide.
- Sorunlar:
  - Horizontally-scrollable tab/chip rows have no visual affordance (fade edge, arrow, partial-next-item peek) signalling more content off-screen on mobile.
- İyileştirme önerileri (görsellik):
  - Add a subtle right-edge gradient fade or a small chevron on scrollable chip/tab rows so mobile users know to swipe.
  - Consider snapping the last visible chip mid-cut intentionally (already partially done) but pair with the fade so it reads as 'more' rather than 'clipped'.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/atlas/kiraat`

**İçerik: 9/10** — public/kiraat-atlasi.json covers the 10 canonical qira'at readers with isnad/rawi/madhab data, 21 real Hafs-vs-Warsh textual variants with meaning impact, geographic distribution (modern + historical) and a 5-event historical timeline (Uthman's codification through the 1924 Cairo edition).
- Güçlü yönler:
  - Textual variants are linguistically precise (active/passive, pronoun, consonant differences) with concrete meaning-impact notes rather than vague 'reading differences'.
  - Historical timeline correctly notes contested points (Ibn Mujahid's 7-reading canon controversy, Ibn Shanabudh's trial) instead of presenting the canon as inevitable.
  - Percentages for reading distribution ('~%95', '~%3', '~%0.7') are marked with tilde as approximate, avoiding invented-precision red flags.
- Sorunlar:
  - No obvious factual-risk or absolute-claim issues found in the sampled content — this is one of the strongest sourced datasets reviewed.
- İyileştirme önerileri (içerik):
  - Add a one-line note on where the '~95%' global-usage figure for Hafs originates (e.g. UNESCO/regional Mushaf printing data) since it's a specific, checkable number currently given without attribution.
  - Consider linking directly to specific Hafs/Warsh verse pairs from /oku reading mode so users can hear/see both recitations in context.

**Görsellik: 8/10**
- Masaüstü: Excellent imam-lineage tree diagram (Peygamber → 7 ravens → 10 imams → 20 ravis) with color-coded city dots, clean node/edge rendering, followed by a well-structured 2-col imam card grid with Arabic calligraphy names, era/madhhab badges, and rawi links. Sub-nav (İmamlar/Kanonizasyon/Fark Analizi/Harita/Tecvid) reads clearly with full labels.
- Mobil: The imam-lineage tree diagram is placed inside a horizontally-scrollable container that is wider than the viewport (scrollWidth 626px vs 352px visible) and only the middle branch (3 of 7 first-gen nodes) is visible on load with zero scroll indicator — users must discover by trial that it drags/swipes sideways. Separately, the 5 sub-nav tabs collapse to icon-only glyphs with no text labels and a barely-visible active-state outline, so a first-time mobile visitor cannot tell what 'İmamlar/Kanonizasyon/Fark Analizi/Harita/Tecvid' are without tapping each one.
- Sorunlar:
  - Mobile: imam lineage tree overflows viewport with no scroll affordance — most nodes (both outer branches) are invisible until user discovers horizontal drag.
  - Mobile: sub-navigation tabs lose all text labels, becoming 5 unlabeled icons with weak active-state contrast.
- İyileştirme önerileri (görsellik):
  - Add a fade-edge + 'kaydırın →' micro-label under the tree diagram on mobile, or auto-center/scale the tree to fit viewport width like the peygamber-atlas timeline does.
  - Keep at least abbreviated text labels under the tab icons on mobile (e.g. 2-letter or icon+tiny caption) instead of icon-only, and strengthen the active-tab indicator (solid underline/bg, not just a faint ring).

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 (mobilde canlı) — `KiraatAtlasi.jsx:1640` `top:'110px'`; 390px genişlikte gerçek navbar 84px ölçüldü, tab bar 110-153px'te sticky oluyor → 22px/%51 örtüşme (hero kısa olduğu için diğer sayfalardaki gibi maskelenmiyor).
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı eksik — `:1653-1667` (İmamlar/Kanonizasyon/Fark Analizi/Harita/Tecvid).
  - [CSS/sticky ailesi] §13.32 çıplak ayet referansı — `KiraatAtlasi.jsx:673` — `{v.surah}:{v.ayah}` çıplak (ör. "2:170"); altında `v.surahName` gösteriliyor ama kural bunu geçerli istisna saymıyor.

---

### `/atlas/kissa`

**İçerik: 7.5/10** — public/kissa-atlas.json holds 12 prophets (Musa, Nuh, İbrahim, Yusuf, etc.) broken into 104 narrative scenes, each with title, description, verse reference and cross-surah references (surahRefs) showing which surahs narrate that scene.
- Güçlü yönler:
  - Scene-by-scene structure genuinely useful for showing how one story (e.g. Musa) is distributed non-linearly across many surahs — a real structural feature of the Quran, accurately represented.
  - Descriptions are concise, narratively accurate, and free of embellishment or invented dialogue beyond what verses state.
  - Page-level SourcesCitation + CrossToolCTA components exist, linking the atlas back to classical scholarship and sibling tools.
- Sorunlar:
  - Unlike kavim/kiraat/munafik/nefis/sunnetullah, individual scenes carry no per-scene classical-tafsir citation or hedging field ('infoTr'/'sourceTr') — scholarly apparatus lives only in the page-level footer, so scene-level interpretive choices (e.g. which of several tafsir readings is depicted) are not individually sourced.
  - Heavy content overlap with /atlas/peygamber (same prophets, similar scene/phase breakdowns) risks redundancy if a user visits both.
- İyileştirme önerileri (içerik):
  - Add an optional 'sourceTr' or 'infoTr' field to scenes that involve interpretive/disputed details (e.g. which son of Nuh drowned, exact identity of 'the man from the ends of the city' in Yasin) rather than only at the page footer.
  - Differentiate this page from /atlas/peygamber explicitly in copy — e.g. position kissa as 'narrative/scene view' vs peygamber as 'surah-distribution/statistical view' — and cross-link them clearly.

**Görsellik: 9/10**
- Masaüstü: Sophisticated two-pane workspace: prophet tab row, numbered scene list (left), surah/count grid with a selected-surah highlight ring, and a detail panel with checkbox filters and citation chips. Very editorial and functional, on-brand gold/dark palette throughout.
- Mobil: Adapts intelligently — the two-pane desktop layout becomes a 3-tab switcher (Sahneler / Süre Haritası / Detay) with an unread-style dot on Detay. Scene list, classic-sources cards, and related-tools cards all stack cleanly full-width. Prophet pill row scrolls horizontally (same clipped-edge pattern as other pages, minor).
- Sorunlar:
  - Prophet selector pill row on mobile clips the last pill (İsa) with no scroll affordance, consistent with the sitewide chip-row pattern.
- İyileştirme önerileri (görsellik):
  - Apply the same fade/scroll-affordance fix suggested for other atlas pages to this prophet selector row.

**Buglar:**
  - [CSS/sticky ailesi] Tab-bar büyük harf kuralı eksik — `KissaAtlas.jsx:326-441` — Mechanism 1/3 düzeltmesi (bu oturumda yapıldı) canlı doğrulandı, ama peygamber sekme çubuğunda hiç `textTransform` yok.

---

### `/atlas/mesel`

**İçerik: 8.5/10** — public/amthal/*.json (parables.json: 72 parables, imagery-networks.json: 8 imagery domains, paired-parables.json: 11 explicit paired parables, nur-zulumat.json, animals.json: 9, meta-verses.json: 6, scholars.json: 4 classical views) drives a rich taxonomy of Quranic parables by domain, type (sarih/kamin/mursel) and rhetoric.
- Güçlü yönler:
  - Correctly attributes the common sarih/kâmin/mürsel three-way classification to modern scholar Mennâ' el-Kattân rather than misattributing it to es-Süyûtî, showing careful sourcing discipline.
  - Ghazali's Nur 24:40 multi-layer reading is presented as 'can be interpreted as' rather than definitive doctrine.
  - Paired-parable structure (fire-kindler/rainstorm, slave/free) accurately mirrors a real literary feature of Quranic rhetoric.
- Sorunlar:
  - One 'sharedThemeTr' line calls the slave/free parable pair one that is 'tevhidin üstünlüğünü ispatlayan' (proving the superiority of monotheism) — 'ispatlayan' (proving) is a stronger epistemic verb than the site's usual hedged register elsewhere.
  - 72 parables is presented without a clear methodology note on how 'parable' was operationalized/counted (some classical scholars count differently) — could read as an implied precise/final number.
- İyileştirme önerileri (içerik):
  - Soften 'ispatlayan' to 'vurgulayan/örnekleyen' (emphasizing/illustrating) to stay consistent with the site's hedging register used elsewhere on this same page.
  - Add a one-line methodology note near the '72 mesel' stat explaining the counting criterion, since parable counts vary by classical source (some count fewer, treating paired ones as one).

**Görsellik: 9/10**
- Masaüstü: Clean 4-col 'İmge Evreni' grid with colored bullet-dot categories (Su/Işık/Bitki/Hayvan/İnsan Duyuları/Toplum/Toprak/Âhiret), tag chips per category, consistent card sizing. Simple, uncluttered, high polish.
- Mobil: Grid collapses to clean single column, tag chips wrap properly without overflow. Classic-sources and related-tools sections stack well. Top tab row (İmge Evreni/Mesel Kataloğu/Çift Meseller/Nûr & Zulumât/Hayvan Atlası/Bilgi) truncates off-screen with no affordance, same sitewide pattern.
- Sorunlar:
  - Top tab row overflows off the 390px viewport with no visual cue that more tabs exist to the right.
- İyileştirme önerileri (görsellik):
  - Same fade/scroll-affordance fix as other pages' tab rows.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/atlas/munafik`

**İçerik: 9/10** — public/munafik-profili.json: 12 behavioral profiles (self-deception, dual-identity, etc.) each with 2-3 core verses, classical tafsir analysis (Râzî, İbn Kesîr, Elmalılı), an explicitly hedged modern-psychology parallel (Trivers, Festinger, Goffman), and one properly-graded sahih hadith (Bukhari/Muslim triple-sign hadith) with isnad status noted.
- Güçlü yönler:
  - Best-hedged 'modern parallel' pattern on the site: every psychology comparison carries an explicit disclaimer that it is not a claim of Quranic scientific foreknowledge, and notes the frameworks are 'ontologically distinct'.
  - Hadith sourcing is rigorous — grades the hadith as 'mütefekkun aleyh' (agreed upon by Bukhari+Muslim) and separately flags a variant fourth sign as carrying a different chain.
  - Etymology section (nafak → jerboa burrow metaphor) is attributed to a specific classical source (Râgıb el-İsfahânî's al-Mufradât) rather than presented as folk etymology.
- Sorunlar:
  - One line ('modernParallelTr' for self-deception) has a visible text-garbling artifact: '...doğrulama iddiası burada yapılmaz.ir — 'bilimsel önceden biliş' değil.' — looks like a leftover/duplicated fragment ('.ir —') from an editing pass, not just a translation issue.
  - 12 profiles is a lot of very similar-structure cards; without strong visual/thematic grouping this risks feeling repetitive to a reader going through all of them sequentially.
- İyileştirme önerileri (içerik):
  - Fix the garbled sentence fragment in profiles[0].modernParallelTr ('...yapılmaz.ir — ...') — appears to be a copy-edit leftover.
  - Group the 12 profiles into 3-4 thematic clusters (e.g. 'deception patterns', 'worship-related', 'social/wartime behavior') to reduce perceived repetitiveness and aid navigation.

**Görsellik: 9/10**
- Masaüstü: Distinctive reddish-tinted hero (on-theme for the 'münafık' subject) with etymology callout box, 5-stat pill row, and a 2-col profile-card grid where each card has a unique icon + color-coded left border matching its category. Rich detail: classic-source citations, 'devamı için' cross-link banner, related-tools footer. One of the most visually distinctive pages in the set.
- Mobil: Hero, etymology box, and stat chips wrap into 2 rows cleanly (no overflow). Profile cards stack single-column with their colored left-border accents intact. Very solid adaptation overall.
- İyileştirme önerileri (görsellik):
  - None significant — this page could be a template for bringing other 'plainer' atlas pages (e.g. munasebat) up to the same visual richness.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [other] Unrendered markdown leaks into the UI: public/munafik-profili.json's etymologyTr/etymologyEn fields use markdown emphasis syntax ("Râgıb el-İsfahânî *El-Müfredât*'ta..." / "...treats this metaphor in *al-Mufradāt* as...") but MunafikProfili.jsx renders intro.etymologyTr/etymologyEn as plain text (no markdown parser, no dangerouslySetInnerHTML). Literal asterisks appear around 'El-Müfredât'/'al-Mufradāt' in both languages, on both desktop and mobile. Confirmed in rendered page text and in the JSON source (lines ~20-21).

---

### `/atlas/munasebat`

**İçerik: 7/10** — public/surah-connections.json: 7 connection types (tenâsüb, tedâdd, tenzîr, istitrâd, uslûbü'l-hakîm, intikâl, tekâmül), 8 scholars (en-Neysâbûrî through modern es-Sâmerrâî/Islâhî), and only 16 curated inter-surah connection examples with anchor verses and multi-source citations (el-Bikâî, es-Süyûtî).
- Güçlü yönler:
  - Correctly credits en-Neysâbûrî as the (lost-work) originator per az-Zarkashî rather than starting the history with a more famous name.
  - Each connection example cites specific classical works (el-Bikâî's 22-volume Nazmü'd-Dürer, es-Süyûtî's el-İtkân) rather than generic 'scholars say'.
  - Distinguishes founder/theorist/modern roles for scholars, giving useful historical texture to the discipline's development.
- Sorunlar:
  - Only 16 connections are curated versus 113 possible adjacent-surah pairs (plus many non-adjacent thematic links munâsebât scholarship also covers) — for a page framed as an 'atlas', coverage is thin/selective and this isn't disclosed to the user as a curated sample rather than a survey.
  - 'strength': 'iconic' categorization for connections implies a ranking system whose criteria aren't explained anywhere in the visible content.
- İyileştirme önerileri (içerik):
  - Add a visible note (e.g. in the intro or Info tab) that these are '16 illustrative/most-studied examples' rather than implying comprehensive surah-to-surah coverage — avoids users assuming gaps mean 'no connection exists'.
  - Expand coverage incrementally, prioritizing well-documented classical pairs (e.g. the traditional 'paired surahs' like Duha/Sharh, Fil/Quraysh) that are currently missing.
  - Explain the 'strength' (iconic/strong/etc.) rating criteria in the UI since it currently reads as an unexplained internal score.

**Görsellik: 7/10**
- Masaüstü: Functionally clean but visually the plainest page in the set relative to the site's own bar: no bismillah/hero calligraphy, no display-serif headline, no stat-pill summary row, and cards are uniform text blocks (title + 2 badges + paragraph) with no icons or color coding, unlike kavim/munafik/nefs-mertebeleri which all use icons and left-border/category colors on their cards.
- Mobil: Filter chip rows (Tür / Güç) wrap into multiple rows correctly rather than clipping — a better mobile pattern than the horizontal-scroll tabs used elsewhere. Cards stack cleanly.
- Sorunlar:
  - No hero/display-title moment at the top of the page — starts straight into filter controls, breaking the visual rhythm established by nearly every other atlas page in the set.
  - Connection cards are undifferentiated (no icon, no color accent) making the long list visually monotonous compared to munafik/kavim/peygamber card treatments.
- İyileştirme önerileri (görsellik):
  - Add the same hero pattern used elsewhere (bismillah calligraphy + representative âyet + italic thesis line) before the filter/tab bar.
  - Add a small stat-pill row (e.g. total bağlantı count, tür count, ortalama güç) mirroring kavim/munafik's summary strip.
  - Give each connection card a category icon or left-border accent keyed to its 'tür' (Tenâsüb/Tezâdd/Tenzîr/etc.) so the list reads at a glance rather than requiring reading each badge.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [console-error] Mobile viewport only: React hydration mismatch on load — 'A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.' Diff shows server-rendered padding '24px 32px' / font-size '1.2rem' vs client re-render padding '16px' / font-size '1.05rem' (also color format and letter-spacing differ), consistent with an isMobile-driven inline-style branch that differs between SSR (always desktop-sized) and client hydration. Not present on desktop viewport for this route.

---

### `/atlas/nefs-mertebeleri`

**İçerik: 9/10** — public/nefis-mertebeleri.json cleanly separates the 3 Quranic-explicit nafs stages (emmâre, levvâme, mutmainne — each with verse, classical tafsir, and a debate note on speaker attribution) from 4 Sufi-added stages, with an explicit transitionNote explaining the extension is bâtınî/esoteric and that Ibn Taymiyya and partly Ibn Qayyim kept distance from it.
- Güçlü yönler:
  - Model example of the site's own epistemic-hedging standard: explicitly labels which content is Quranic-explicit vs. later Sufi systematization, and names which classical scholars were skeptical of the extension (Ibn Taymiyya) rather than presenting all 7 stages as equally canonical.
  - Attributes the historical genealogy of the 7-stage system correctly across multiple named figures (Necmeddin Kübrâ, İbn Arabî, Cîlî, Rûmî, İmam Rabbânî) with death dates, rather than vaguely 'tasavvuf tradition says'.
  - Notes genuine scholarly disagreement even within the 3 core stages (e.g. who is speaking in Yusuf 12:53 — Yusuf himself or the Aziz's wife — with Qurtubi reporting both views).
- Sorunlar:
  - No significant factual-risk issues found; this is one of the best-hedged pages reviewed.
- İyileştirme önerileri (içerik):
  - The nefis-mertebeleri-ext.json 'comparisonMatrix' file exists separately — verify it's actually surfaced in the UI (not just fetched/unused), since it could add a useful comparison table (Quranic core vs Sufi extension side-by-side) if not already visible.
  - Cross-link to /atlas/munafik since the 'mutmainne' stage description explicitly contrasts with the hypocrite's 'mudhabdhabīn' (wavering) state — a natural thematic bridge.

**Görsellik: 9/10**
- Masaüstü: The strongest editorial card design in the set: numbered sidebar with a large numeral, Arabic name, transliteration, and Turkish label, paired with a verse card (icon + Arabic ayah + translation + audio button), body copy, a 'Klasik Görüş' scholarly callout box, and a source-citation strip. A mid-page 'Kur'ânî Çekirdek → Tasavvufi Genişleme' transition banner clearly marks the shift from the 3 core to 4 extended mertebe. Exceptional depth and hierarchy.
- Mobil: Cards restack the sidebar numeral/name above the verse card cleanly; verse card, body text, and callout boxes all remain legible and well-spaced at 390px. Long page (~12k px) but content-appropriate given the depth.
- İyileştirme önerileri (görsellik):
  - None significant.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `NefisMertebeleri.jsx:365` `#nefs-tab-bar` `top:'110px'`; canlı testte %51 dikey örtüşme yakalandı, ekran görüntüsünde "7 MERTEBE" ve diğer sekme etiketleri üstteki header tarafından kesiliyor.
  - [other] Untranslated English word hardcoded into the Turkish string: NefisMertebeleri.jsx line ~230 renders the eyebrow label as 'REFLECTION · İÇ YOLCULUK · 7 BASAMAK' when language==='tr' — 'REFLECTION' was left in English inside the TR-branch literal itself (not a missing-translation-key issue, it's baked into the tr string). Visible on both desktop and mobile.
  - [mobile] At 390px width, the 'Ekol:' chip (school/attribution tag under stage cards, e.g. for the mülhime/kâmile Sufi stages) uses whiteSpace:'nowrap' with no truncation or wrapping. For longer ekolEtiketi values the chip is measured at 435px wide against a 390px viewport (~83px overflow) and gets hard-clipped mid-word by an ancestor with overflowX:hidden — e.g. 'tasavvufî-bâtınî okuma (İbn Arabî ekolü — klasik ulemanın eleştirisi ile)' is cut off after '...klasik ulema' with no ellipsis and no way to scroll/reveal the rest. Confirmed via DOM measurement (chip.right=473 vs innerWidth=390) and visually in the mobile screenshot.

---

### `/atlas/peygamber`

**İçerik: 7/10** — src/sections/ProphetAtlas.jsx hardcodes a PROPHETS array (25 prophets with per-surah 'phase' breakdowns sourced to Abdulbâki's al-Muʿjam mention-count concordance) plus an interactive map component; narrative prose ('narrativeTr') is only written for ~5 prophets (İbrahim, Nûh, Yusuf, Musa, İsa) with the rest represented only as surah/phase lists.
- Güçlü yönler:
  - Mention counts are attributed to a specific concordance (Muhammed Fuad Abdulbâki's el-Muʿcemü'l-Müfehres) rather than presented as an unsourced number.
  - Chronological ordering note at the top of the data array documents the ordering logic transparently.
  - Phase-by-phase surah breakdown per prophet is a genuinely useful structural view distinct from kissa-atlas's scene view.
- Sorunlar:
  - Narrative depth is uneven: most of the ~25 prophets have only a title/subtitle/phase-list with no explanatory prose paragraph, while a handful get a full 'narrativeTr' — inconsistent depth across entries on the same page.
  - Significant structural overlap with /atlas/kissa (same prophets, same surah references) without a clear stated distinction in the visible copy about what makes this page different (statistical/map view vs. narrative-scene view).
- İyileştirme önerileri (içerik):
  - Write a short narrativeTr/summaryTr for all ~25 prophets, not just 5, to bring the page to the same depth standard as sibling atlas pages.
  - Add an explicit one-line framing distinguishing this page from /atlas/kissa ('this page maps geography+chronology, kissa tells the scene-by-scene story') to reduce felt redundancy.
  - TODO comments in the color definitions ('// TODO: tokenize') are developer-facing only (not rendered), so no user-facing leak — but worth flagging for cleanup per the project's own color-token rule.

**Görsellik: 9/10**
- Masaüstü: Impressive Mekki/Medeni-period timeline chart with glowing pink selected-prophet path and clustered event nodes, followed by a per-prophet narrative-comparison table, a genuinely well-styled dark-mode geographic map (gold pins, readable place labels, on-theme dark tile style — not a jarring light basemap), a 25-prophet 'vasıflar ve dualar' card grid, and a family-tree (silsile) diagram with color-coded node boxes. One of the richest pages in the whole set.
- Mobil: Prophet pill selector wraps into a clean multi-row grid (better than the horizontal-scroll pattern elsewhere). Stat cards (43/8/8-0) stack full-width. The Mekki/Medeni timeline chart compresses proportionally to fit — readable at a glance but per-node surah labels (S.54, S.7, etc.) become very small; not broken, just dense.
- Sorunlar:
  - Timeline chart node labels are very small (near-illegible) at 390px width once compressed — readable only by zooming.
- İyileştirme önerileri (görsellik):
  - On mobile, consider showing only the connector arcs + dots by default and revealing surah-number labels on tap, rather than always-on tiny text.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/atlas/sunnetullah`

**İçerik: 9/10** — public/sunnetullah-atlasi.json: 6 literal Quranic occurrences of the term 'sünnetullah' plus 12 thematic law categories (helâk, yardım, imtihan, zulüm, yaratma, etc.), each with multiple verses, classical tafsir citations (Râzî, İbn Âşûr, Kurtubî, Zemahşerî), and linguistic notes (e.g. tabdîl vs tahvîl distinction, 'len' vs 'lâ' negation strength).
- Güçlü yönler:
  - Extremely rigorous linguistic/tafsir sourcing — even distinguishes subtle grammatical forms (future-emphatic 'len tecide' vs present-tense 'lâ tecidu') and attributes the distinction to named exegetes.
  - Absolute-sounding language ('değişmez kanun', 'istisnasız') is directly grounded in the Quran's own self-description (âyāt explicitly say 'len tecide li-sünnetillâhi tebdîlâ') rather than being an unsourced site-authored claim — appropriate given the page's actual subject is the Quran's assertion of its own unchanging laws.
  - Explicitly separates the 6 lafzî (literal-term) occurrences from thematically-equivalent-but-lexically-different phrases (sünnete'l-evvelîn), showing methodological transparency about what was counted and why.
- Sorunlar:
  - No significant unhedged/factual-risk issues found in the sampled content.
- İyileştirme önerileri (içerik):
  - Since this page's 12 thematic categories link closely to /atlas/kavim's helak case studies, add explicit cross-references from each kavim entry's 'helakType' to the matching sunnetullah thematic category.
  - The kavimPatterns (10) and scholarViews (12) sections weren't fully sampled here — worth a follow-up spot-check to confirm the same rigor holds throughout, given the page's large size (138KB).

**Görsellik: 9/10**
- Masaüstü: Elegant subtle dot-grid background pattern behind the hero, followed by a genuinely striking morphological 'formula' breakdown card (4 Arabic word-segments with transliteration + meaning + a classic-belâgat note in a highlighted info box), then a 2-col verse-card grid each with tefsir/belâgat notes. Etymology-forward, scholarly-premium tone executed very well.
- Mobil: The 4-segment word-breakdown boxes stack cleanly to full-width single column; the 2-col verse-card grid also collapses to one column without any cramping. Among the best mobile adaptations in the set.
- İyileştirme önerileri (görsellik):
  - None significant.

**Buglar:**
  - [CSS/sticky ailesi] Mechanism 2 — `SunnetullahAtlasi.jsx:556` `#sunnetullah-tab-bar` `top:'110px'`; geçiş anında ~10px/%18 örtüşme yakalandı (navbar yüksekliği 67-82px arası değiştikçe risk büyüyor).
  - [non-functional] Clicking the 'Kavim Örüntüleri' tab throws an uncaught client-side TypeError and crashes the page render (confirmed via pageerror event and Next.js dev error overlay: 'Cannot read properties of undefined (reading slice)' at src/components/SunnetullahAtlasi.jsx:1726, inside KavimPatternCard). Root cause: line 1726 reads `(tr ? pattern.summaryTr : pattern.summaryEn || '').slice(0, 240)` — due to ternary/OR operator precedence this parses as `tr ? pattern.summaryTr : (pattern.summaryEn || '')`, so the Turkish branch (`pattern.summaryTr`) has no `|| ''` fallback. When a pattern item in this tab has no summaryTr, `.slice()` is called on undefined and the whole tab crashes (shown as a full error screen in dev; would be an uncaught exception / broken tab in production). Reproduced reliably on desktop viewport by clicking the tab; the other 3 tabs on this page (Lafzî Ayetler, Tematik Kanunlar, Ulema Görüşleri) work correctly.

---


## Graf Araçları (/graf/*)

### `/graf/ayet`

**İçerik: 7/10** — VerseGraph is a 3D force-graph visualization (react-force-graph-3d) of all 6,236 verses via verse-graph-bgem3.json embeddings, layered with public/surah-info.json (per-surah metadata) and public/surah-notes.json (3 factual highlight bullets per surah, all 114 surahs sampled/spot-checked as accurate) and surah-clusters.json (pure UMAP-style x/y coordinates, no editorial text).
- Güçlü yönler:
  - surah-notes.json bullets are consistently factual and specific (exact verse counts, named unique content like 'only surah to name the family of Imran') rather than generic filler.
  - The tool is primarily a data-visualization/exploration interface rather than an essay page, so the 'unverifiable claim' risk surface is smaller — most content is structured metadata (surah, ayah counts) rather than interpretive prose.
  - surah-clusters.json embedding coordinates are pure semantic-similarity data with no factual claims attached, appropriately kept separate from editorial content.
- Sorunlar:
  - Because this is the heaviest interactive/computational tool on the site (3D graph of 6,236 nodes), content quality here is largely inherited from verse-graph-bgem3.json's translation quality, which wasn't independently re-verified in this pass beyond spot checks.
  - No visible methodology note on how the semantic clustering/embedding was generated (e.g. which embedding model, what similarity metric) is presented to end users, which could read as an unexplained 'black box' visualization making implicit similarity claims.
- İyileştirme önerileri (içerik):
  - Add a brief 'how to read this graph' methodology note (embedding model used, what proximity means) since spatial clustering can otherwise be read by users as an implicit factual/semantic claim without explanation.
  - Cross-reference surah-notes.json bullets with the corresponding /atlas or /graf pages where the same fact is covered in more depth (e.g. Bakara's Ayet al-Kursi note could link to a fuller treatment) to reduce redundant restatement across the site.

**Görsellik: 7/10**
- Masaüstü: Cinematic intro (bismillah, verse, stat row, 'Haritayı keşfet' CTA) sits directly on a busy nebula/particle background image rather than a solid nav strip. The breadcrumb/sub-header bar ('Ayet Haritası · 6.236 ayet...' + ANASAYFA button) uses a fully transparent background positioned over that busy image, making its gold/slate text nearly illegible — a real contrast regression versus every other atlas page, which back their breadcrumb bar with a solid dark strip. Once through to the actual graph (after clicking the CTA), the WebGL force-directed node graph (6,236 ayet, Mekki/Medeni color-coded) is genuinely impressive and the legend/search panels there have proper solid-dark backing and good contrast.
- Mobil: Mobile skips the intro hero and opens directly on a surah 'bubble map' view (different default than desktop) — a sensible adaptation since the force-graph would be unreadable at 390px, but the divergence from desktop's entry point is a bit disorienting. The bottom instruction hint text ('Sürükle: kaydır · Tekerlek: yakınlaştır') references mouse-wheel zoom, which is meaningless on a touchscreen. The 'örn: Bismillah · Bakara 5 · 2:286 · Fatiha · i...' example text next to the sûre-select dropdown gets hard-clipped at the viewport edge mid-word.
- Sorunlar:
  - Desktop: breadcrumb/sub-header bar has a transparent background sitting on a busy hero image, making title and stat text very low-contrast/hard to read.
  - Mobile: bottom control-hint text mentions 'Tekerlek: yakınlaştır' (mouse wheel) which doesn't apply on touch devices.
  - Mobile: inline example text next to the sûre search ('örn: ... Fatiha · i') is hard-clipped at the screen edge with no ellipsis.
- İyileştirme önerileri (görsellik):
  - Give the /graf/ayet breadcrumb bar the same solid dark background strip used on every other atlas/graf page instead of a transparent overlay.
  - Write a touch-appropriate hint on mobile ('Sürükle: kaydır · Sıkıştır: yakınlaştır' or similar) instead of reusing the desktop mouse-oriented copy.
  - Truncate the placeholder example text with an ellipsis or move it below the input on narrow screens instead of letting it clip mid-word.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/graf/diyalog`

**İçerik: 8.5/10** — DiyalogAgi draws on 5 JSON files: diyalog-speakers.json (34 speakers/entities with mention counts and dialogue partners), diyalog-axes.json (31 relationship axes), diyalog-dialogues.json (23 detailed turn-by-turn dialogues with lessonTr), diyalog-afterlist.json (8 afterlife scenes), diyalog-mega.json (4 multi-surah 'saga' dialogues like the Iblis narrative across 7 surahs and Musa-Firavun across 10 surahs).
- Güçlü yönler:
  - Turn-by-turn dialogue reconstruction (speaker/addressee/keyPhrase/summary) is a genuinely novel and useful structural lens on the Quran, staying close to the actual verse content without embellishing.
  - Mega-dialogue 'phases' correctly cite the specific verse ranges for each phase across multiple surahs, letting users verify the multi-surah narrative claim directly.
  - The 'uniqueFeatureTr' framing for repeated dialogues (e.g. Iblis saga repeated across 7 surahs) is presented as a literary/structural observation ('multi-angle narration technique') rather than an inflated miracle claim.
- Sorunlar:
  - Some individual dialogue 'lessonTr' lines are quite short/generic (e.g. 'Kibir, itaatsizliğin ve ilahi rahmetten kovulmanın temelidir') compared to the richer classical-tafsir apparatus seen on munafik/nefis/sunnetullah — this page has thinner scholarly sourcing per dialogue.
  - 34 speakers vs 23 detailed dialogues means many speaker entries (with dialoguePartners listed) may not have a corresponding fleshed-out dialogue entry, creating potential dead-ends in the graph UI.
- İyileştirme önerileri (içerik):
  - Add a 'sourceTr'/classical-commentary field to at least the major dialogues (Iblis, Musa-Firavun, İbrahim debates) matching the citation depth used on /atlas/munafik and /atlas/sunnetullah.
  - Audit whether every speaker's listed 'dialoguePartners' has a matching entry in diyalog-dialogues.json, and either add the missing dialogue or remove the dangling partner reference so the graph doesn't show connections with no underlying content.

**Görsellik: 8/10**
- Masaüstü: Striking circular chord/network diagram loads immediately (no click-through needed, unlike graf/ayet) — ~25 radially-arranged colored nodes (Allah, melekler, peygamberler, kavimler, âhiret gruplari) with arced connecting lines, a clear Ezel/Dünya/Ahiret legend, and solid-backed classic-sources + related-tools sections below. Very cohesive with the site's aesthetic.
- Mobil: The circular diagram scales down but does not reserve enough horizontal margin for its radial labels: right-side node labels are hard-clipped mid-word at the viewport edge with no ellipsis ('Hz. Müs[â]', 'Hz. İbr[âhîm]', 'Hz. Mu[hammed]', 'Hz. Y[ûsuf]', 'Hz. S[üleymân]', 'Hz. Â[dem]', 'Diğer P[eygamberler]') — a genuine legibility loss versus desktop where every label reads in full.
- Sorunlar:
  - Mobile: multiple radial node labels on the right edge of the circular diagram are cut off mid-word with no truncation styling (no ellipsis), losing information present on desktop.
- İyileştirme önerileri (görsellik):
  - Shrink the circle radius further on mobile to reserve consistent label margin on both sides, or switch label placement to a leader-line/tooltip-on-tap pattern below ~480px so full names are never clipped.
  - Alternatively, abbreviate long labels intentionally (with a legend key) rather than letting the layout clip them arbitrarily.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).
  - [console-error] React hydration mismatch on both desktop and mobile viewports — 'A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.' Diff shows a floating-point precision difference in an SVG path's `d` attribute (e.g. server '226.27738625047246...' vs client '226.2773862504725...') inside the radial dialogue-network diagram (TabAgHaritasi). Cosmetically invisible but a genuine SSR/client output mismatch.
  - [mobile] At 390px width, speaker/prophet name labels on the radial network diagram are hard-truncated via `.slice(0, 7)` (DiyalogAgi.jsx line ~544, mobile-only code path — desktop uses a proper word-wrapping getNodeLabel() instead) with no ellipsis, producing illegible labels: 'Hz. Muh' (Hz. Muhammed), 'Hz. Yûs' (Hz. Yûsuf), 'Hz. Sül' (Hz. Süleyman), 'Hz. Âde' (Hz. Âdem). Additionally, some labels near the left edge of the circular layout extend past the viewport and are visually clipped ('Tüm İns', 'Nûh'un '). Confirmed via DOM inspection: 6 of 34 SVG text labels are off-screen or pre-truncated on mobile. A code comment at line ~489-493 indicates a related mobile label-clipping bug was reported and partially fixed before (SVG overflow:visible), but the 7-character hard slice was left in place and still produces unreadable names.

---

### `/graf/karsilastir`

**İçerik: 7.5/10** — SurahComparator ('Sûre DNA Karşılaştırıcı') computes structural comparisons between any two surahs from verse-graph-bgem3.json, surah-info.json and revelation-order.json (Meccan/Medinan chronological rank for all 114 surahs), framed as a 'structural fingerprint' tool with a SourcesCitation footer grounding the comparison concept in el-Bikâî's and es-Süyûtî's classical munâsabât works.
- Güçlü yönler:
  - Grounds the 'DNA/fingerprint' comparison metaphor in a real classical discipline (münâsebât) rather than presenting computed statistics as a novel unsupported claim — the SourcesCitation footer explicitly ties it to el-Bikâî's 22-volume work.
  - revelation-order.json ranking (Meccan/Medinan, numeric rank 1-114) reflects the standard scholarly chronology rather than an invented ordering.
  - Most content here is computed/quantitative (word counts, verse counts, structural stats) rather than interpretive prose, which reduces the surface area for unhedged claims.
- Sorunlar:
  - Because comparison output is largely auto-generated from statistics, the specific wording used to describe computed similarities/differences wasn't fully inspected in this pass — there's a risk that auto-generated phrasing could drift into overstated claims (e.g. 'X and Y are structurally similar') without the same hedging discipline applied to hand-written pages.
  - The revelation-order ranking (1-114) is presented as if settled, but Meccan/Medinan chronological ordering is itself a matter of scholarly reconstruction with some disputed surahs — this nuance isn't visible in the sampled data.
- İyileştirme önerileri (içerik):
  - Add a brief note that the 1-114 revelation order is 'the standard/traditional scholarly reconstruction' (not a Quran-internal fact) since a few surahs' exact chronological placement is genuinely disputed among classical and modern scholars.
  - Review the auto-generated comparison text strings (if any beyond raw stats) for absolute language ('identical', 'no other surah') that may not have gone through the same manual hedging pass as the static JSON content.

**Görsellik: 8/10**
- Masaüstü: The initial picker screen (two sûre dropdowns + 8 'önerilen karşılaştırmalar' cards with mini progress bars) is clean but comparatively plain — no hero/bismillah moment like most atlas pages, which is probably fine for a tool/utility page but reads as a step down in visual richness. Once a comparison is run, the result view is excellent: a radial 'benzerlik %' progress ring, side-by-side stat cards, a dual-band arc connection map between the two sûre's ayet timelines, comparative sliders, two-column word-frequency clouds sized by count, a Venn diagram for thematic overlap, and shared-figures chips — genuinely one of the richest visualizations in the set.
- Mobil: Both the picker and the result view adapt very well: sûre cards, similarity ring, and stat rows stack cleanly full-width; the two-column word clouds and shared-theme chips become clean stacked sections rather than cramming into columns; the Venn diagram shrinks proportionally without overlap. One of the best mobile reflows in the set despite the page's data density.
- Sorunlar:
  - Initial (pre-comparison) screen lacks the hero/hero-verse treatment used elsewhere, making the entry point feel more utilitarian than the rest of the site.
- İyileştirme önerileri (görsellik):
  - Add a short hero/intro line with a representative âyet (e.g. on münâsebât/tenâsüb) above the picker to match the visual weight of other atlas landing sections, without blocking the functional picker UI.

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/graf/kavram`

**İçerik: 6/10** — 78 Quranic concepts (10 categories, TR/EN/Arabic labels, anchor verses) from public/concept-graph.json, connected into a live network by ConceptGraph.jsx via simple lowercase-substring keyword matching against the Turkish translation text (verseMatchesConcept/normalizeTr) — not a curated or semantically verified mapping.
- Güçlü yönler:
  - Rich taxonomy: 78 concepts across 10 well-chosen categories (Temel, Erdem, İbadet, İlahi, Toplumsal, Akıl, İç Dünya, Âhiret, Kötülük, Peygamberlik), each with Arabic root + TR/EN label + anchor verses
  - Numbers on page (78 kavram, 6.236 ayet, 10 kategori) match the underlying JSON exactly — no drift
  - Fits the site's declared 'İşaretler kanıt değil, örtüşmedir' framing implicitly via its restrained, non-mystical presentation
- Sorunlar:
  - Concept–verse links are computed by plain substring matching of hand-picked Turkish keywords against verse translations (e.g. 'sabır' matches any word containing that string) — this heuristic is never disclosed to the reader, yet the UI presents resulting counts/edges as if they were precise data
  - Unlike WordHeatmap (same conceptual territory), this page has no 'Veri Sözlüğü' / methodology disclosure panel explaining how connections are derived
  - The connection weighting (shared verses / min set size, top-12 cutoff) is an editorial choice with no visible rationale to the user
- İyileştirme önerileri (içerik):
  - Add a short methodology note (or reuse the DataDictionary component pattern from WordHeatmap) explaining that links are keyword-co-occurrence in translation text, not verified thematic analysis
  - Consider footnoting that keyword matching can produce false positives/negatives given Turkish morphology, so edge weights are approximate, not exact counts

**Görsellik: 9/10**
- Masaüstü: Hero: illuminated ayah quote, gold divider, stat row (78 kavram/6.236 ayet/10 kategori), search bar, then a color-coded taxonomy of concept pills grouped by category (Temel/Erdem/İbadet/İlahi/Toplumsal/Akıl/İç Dünya/Ahiret/Kötülük/Peygamberlik) each with a distinct accent color and left-dot legend. Bottom 'related tools' 3-card row (Semantik Ağ, Ayet Grafiği, Fürûk Atlası) matches the site's card language exactly. Generous whitespace, consistent with home page bar.
- Mobil: Same structure reflows to full-width single column cleanly; category dot+label headers stack fine; pill wrapping is natural with no overlap. Back control on this and other 'tool' pages collapses to an icon-only circular arrow button (no 'ANASAYFA' label) which is a minor loss of clarity vs desktop's labeled button, but not a real problem.
- Sorunlar:
  - Icon-only back button on mobile toolbar loses the 'Anasayfa' label present on desktop, slightly ambiguous at a glance
- İyileştirme önerileri (görsellik):
  - Add a short label or tooltip-on-press for the icon-only mobile back button to keep parity with desktop's explicit 'ANASAYFA' text

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/graf/kelime-isi`

**İçerik: 7/10** — Word/phrase frequency heatmap across 114 surahs (search box + 17 concept presets + 18 recurring Arabic phrase presets with verified counts, e.g. 'غفور رحيم ×49'), defaults to a Besmele frequency heatmap; backed by a visible 'Veri Sözlüğü' methodology panel.
- Güçlü yönler:
  - Frequency counts on recurring-phrase presets look like real corpus counts (×49, ×42, ×35...) rather than invented round numbers — consistent with the site's stats-honesty rule
  - Includes an explicit 'Veri Sözlüğü' (Data Dictionary) disclosure button — the only one of the four /graf pages to do so
  - Bilingual TR/Arabic search with auto-redirect for common concepts is a genuinely useful, well-scoped feature
- Sorunlar:
  - Static/default page content is thin beyond the search UI — no narrative framing of what the tool teaches or why frequency patterns matter (contrast with the Concept Graph and Timeline pages, which both have interpretive framing)
  - Frequency numbers on preset chips are not sourced/dated anywhere visible (no citation for how the ×49 etc. were computed)
- İyileştirme önerileri (içerik):
  - Add one or two sentences of framing copy (why word-frequency matters, what patterns to look for) similar to the Timeline page's 'İlginç Fark' block
  - Surface the counting methodology (already presumably documented in the Veri Sözlüğü) inline as a one-line caption near the preset list, not only behind a click

**Görsellik: 8/10**
- Masaüstü: Search bar, 'Veri Sözlüğü' info button, two chip rows (Örnek Aramalar, Tekrarlayan Kalıplar), then a large heatmap grid (114 surah cells, blue intensity scale) with a floating tooltip card shown by default over the first cell explaining the legend ('114 SÜRE · 6.236 ÂYET · HER HÜCRE = 1 SÜRE'). Bottom legend gradient 'Az → Çok'. Clean and functional but visually the least ornamented of the graf pages (flat blue cells, no gold/illustrative touches beyond chips).
- Mobil: Heatmap grid reflows to fit 390px width correctly (10 columns intact, no horizontal scroll needed). However both the 'ÖRNEK ARAMALAR' example-query chip row and header chip rows are wider than the viewport and are hard-clipped at the right edge mid-chip (e.g. 'Hz. İsa' chip is cut in half, next chip shows only a sliver) with no fade mask, arrow, or scrollbar hint signaling there's more content to scroll to.
- Sorunlar:
  - Mobile: horizontal chip rows (Örnek Aramalar) clip mid-chip at the viewport edge with zero affordance that they scroll — reads as a layout bug, not a scrollable list
  - The instructional tooltip card ('114 SÜRE...') is shown by default sitting on top of live heatmap cells, permanently occluding part of the grid on both desktop and mobile until dismissed/hovered elsewhere
- İyileştirme önerileri (görsellik):
  - Add a right-edge fade-out gradient + small scroll-hint chevron on the mobile chip rows so users know to swipe
  - Move the default explanatory tooltip to a static caption/legend line instead of an overlay card sitting on the data grid

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/graf/semantik`

**İçerik: 6/10** — 20 verse-level semantic clusters (6,236 verses, BGE-M3 embeddings + Louvain community detection) rendered as a sortable card list with AI/editor-written titles and summaries (e.g. '#00 Âlemlerin Rabbi: Tevhidin Tebliğ Çerçevesi', 675 verses, 92 surahs); page metadata claims a '2D UMAP projection' visualization that is not what actually renders.
- Güçlü yönler:
  - Underlying JSON carries strong methodological transparency (method, threshold=0.5, resolution, seed, total_communities_found vs meaningful_communities) — the kind of rigor the site's rules ask for
  - 20/20 clusters and 6,236/6,236 verse totals on-page match the JSON exactly
  - Cluster titles read as genuinely distinct thematic groupings (tevhid framing, address-to-believers, repentance speech, etc.), not generic filler
- Sorunlar:
  - Page title/meta description ('Surelerin semantik kümeleri — UMAP projeksiyonuyla 2D görselleştirilmiş içerik akrabalığı') describes a 2D UMAP scatter plot of surahs; the actual rendered page is a sortable list of verse-clusters with no 2D projection visible anywhere — a factual mismatch between what the page promises and what it delivers
  - Cluster titles/summaries are evocative editorial synthesis ('İkrar ve Pişmanlık Söylemi', 'Kozmik Yeminler ve Açılış Vurusu') but nowhere on the page is it disclosed who wrote these labels or that they are an interpretive naming layer over an algorithmic clustering — a reader could take the titles as objective structure rather than curated interpretation
  - None of the rich methodology metadata in the JSON (Louvain, BGE-M3, threshold) is exposed to the end user — only 'anlam benzerliği ≥ 0.5' appears
- İyileştirme önerileri (içerik):
  - Fix the meta description to describe what's actually rendered (a ranked/sortable cluster list), or actually ship a 2D UMAP scatter view to match the promise
  - Add a one-line disclosure that cluster titles/summaries are the site's own descriptive naming of algorithmically-detected groups, not a claim about authorial intent in the text
  - Surface at least the embedding model name and clustering method in-page (small info icon), matching the transparency WordHeatmap already provides

**Görsellik: 8/10**
- Masaüstü: Search + 4-way sort control row, then a clean 4-column card grid of semantic clusters (#00-#15 visible), each card with title, ayet/sûre counts, similarity score, a horizontal density bar, and top-sûre tag chips. Typography and card chrome matches the site's card system precisely; good scannability.
- Mobil: Grid correctly collapses to 1 column with full card content intact and readable. But the SIRALA sort control row ('Ayet sayısı / Süre yayılımı / Yoğunluk / Sıra (ID)') is wider than 390px — the 4th button 'Sıra (ID)' is entirely cut off at the right edge with no scroll affordance, effectively hiding a sort option on mobile.
- Sorunlar:
  - Mobile: 'Sıra (ID)' sort button is pushed off-screen and inaccessible without a discoverable horizontal scroll cue
  - Same overflow-without-affordance pattern as /graf/kelime-isi — looks like a shared component issue across the graf/* toolbar
- İyileştirme önerileri (görsellik):
  - Wrap the sort-button row onto a second line on narrow viewports instead of letting it overflow horizontally, or add scroll affordance consistent with fixing the kelime-isi chip row

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---

### `/graf/zaman`

**İçerik: 9/10** — Revelation-order timeline for all 114 surahs (Mekkî/Medenî, mushaf-vs-nüzul rank delta) sourced explicitly to Suyuti's al-Itkan (via Ibn Abbas narration) and Zerkeşî's al-Burhan, with an honest discussion of the tevkîfî/ictihadî ordering debate and Uthman's role in standardizing (not authoring) the mushaf sequence.
- Güçlü yönler:
  - Best-hedged page in the sample: explicitly states 'bazı sûreler için âlimler arasında farklı görüşler mevcuttur; bu en yaygın kabul gören versiyondur' rather than presenting the ranking as settled fact
  - Correctly distinguishes verse-order-within-surah (scholarly consensus/tevkîfî) from surah-to-surah order (contested: tevkîfî vs sahâbe ictihad) rather than flattening both into one claim
  - Named, real classical sources (es-Süyûtî, Zerkeşî) plus the digital data source (tanzil.net) are cited together — exactly the layered sourcing the site's rules require
  - All internal counts are consistent: 114 total, 86 Mekkî + 28 Medenî, ranks 1–114 all present
- Sorunlar:
  - The mushaf-vs-nüzul 'delta' (▲/▼ numbers) is a derived/computed statistic but isn't flagged as 'hesaplanmış' the way §13's own house rule distinguishes canonical counts from computed ones — a minor omission given how good the rest of the sourcing is
- İyileştirme önerileri (içerik):
  - Add a one-word tag on the delta badges (e.g. small 'hesaplanan' label) to formally separate this computed statistic from the canonical rank/period data, per the site's own stats-honesty distinction

**Görsellik: 9/10**
- Masaüstü: Tümü/Mekkî/Medenî filter tabs + Kart/Zaman Çizelgesi view toggle, a clear explanatory legend box (mushaf order vs nüzul order, color key), then a dense but well-organized 9-column card grid of all 114 sûre with nüzul rank, up/down triangle indicators, and gold(Mekkî)/green(Medenî) left-border color coding. Very information-dense yet legible — strong execution.
- Mobil: Grid drops cleanly to 2 columns, legend text wraps onto extra lines but stays fully readable with no clipping, filter tabs and Kart/Zaman Çizelgesi toggle fit the width fine. Best-behaved of the graf/* pages on mobile.
- İyileştirme önerileri (görsellik):
  - Consider a sticky mini-legend or condensed color key when scrolling deep into the 114-card grid on mobile, since the up/down triangle meaning is easy to forget after scrolling past the legend

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---


## Ana Sayfa & Diğer Statik Sayfalar

### `/`

**İçerik: 9/10** — Long-form narrative homepage (hero, inventory stats, concierge prompt, methodology ribbon, six thematic 'gates', a fully worked Fâtiha ring-composition example, and 14 portal cards into deeper tools) — content lives inline in page.js/CARD_BY_ID rather than i18n JSON.
- Güçlü yönler:
  - Leads with an explicit epistemic frame before any 'wow' claim: 'İşaretler kanıt değil, örtüşmedir. Kur'ân metni esastır' — sets expectations before the reader sees a single pattern claim
  - The Fâtiha ring-composition (halka kompozisyon) walkthrough is a standout: it cites Farrin (2014) by name, explicitly says the site's diagram is its own arrangement ('kitabındaki tam yapının birebir kopyası değil'), states Besmele was excluded because Farrin himself excludes it, and has an explicit 'Neden kesin kanıt değil?' section calling the thematic pairing an interpretive act
  - Stat counters (63 araç, 53 tefekkür yazısı, 6.236 âyet) are the kind of numbers §13.28 requires to be hand-verified before push — worth a spot-check but format is correct
  - 'Örüntü — Kanıt Değil' is used as a section eyebrow, not just buried prose — the hedge is structurally foregrounded, not an afterthought
- Sorunlar:
  - Very long page with 14+ card sections risks redundancy with the dedicated tool pages it links to (by design per the site's own migration notes, but worth flagging as a general density concern)
  - Home-page stat counts (63/53/6236) are manually maintained per §13.28 in CLAUDE.md and are known to drift if a new tool/article ships without updating this file — not verifiable as currently accurate without re-running the site's own audit script
- İyileştirme önerileri (içerik):
  - None structurally needed — page already follows the site's own epistemic rules closely; only routine upkeep (stat sync) applies

**Görsellik: 9.5/10**
- Masaüstü: Exceptional long-form scrollytelling landing page. Cinematic hero (Arabic calligraphy Besmele, Alak 96:1-2 quote, minimal nav) leads into 15 numbered chapters via a sticky left sidebar table-of-contents that highlights the active section. Sections mix pull-quotes, an interactive Fâtiha ring-structure diagram (A/B/C/D mirrored nodes), a chiasmus concept map, embryology verse callouts with tajweed-colored Arabic, and card CTAs to deeper tools — every section ends in a consistent gold-outline CTA button + one-line stat caption. Closes with a full-bleed footer with the diamond Q emblem. Extremely consistent typography (Playfair display + gold accents) and pacing throughout ~19,700px of content.
- Mobil: Sidebar TOC converts to a sticky horizontal pill-tab strip under the header (with active-chapter highlight and a thin scroll-progress bar) — a well-considered adaptation, not just a squeezed sidebar. Chapter cards stack full-width with colored icon badges and tag chips (e.g. Kapı 04/05/06 cards), reading very cleanly one-handed. No overlap or cramping found across the ~15 sampled scroll positions.
- Sorunlar:
  - Horizontal chapter-pill strip on mobile has no visible edge fade indicating it scrolls sideways (same class of issue seen on graf/* mobile chip rows), though the active pill's own visibility partly compensates
- İyileştirme önerileri (görsellik):
  - Add a subtle left/right fade mask to the mobile sticky chapter-pill strip for scroll discoverability, matching the polish of the rest of the page

**Buglar:** kayda değer bulgu yok.

---

### `/sor`

**İçerik: 7/10** — Live RAG 'ask a question' concierge (semantic + keyword search modes) over verses/tools/atlases/articles; static UI copy is strongly hedged, but actual generated answers could not be tested in this environment (dev server missing DEEPINFRA_API_KEY, request errored).
- Güçlü yönler:
  - Static copy consistently disclaims interpretive authority: 'Sistem yorum katmaz — sadece rehberler', a persistent 'Sınırlar' box stating results are 'not a fıkhî ruling or fatwa', and a conditional fetva disclaimer banner for ruling-shaped questions
  - Query-language detection is independent of UI language (TR user can ask in EN and vice versa) — thoughtful bilingual design
  - Feedback/limits/timing meta are all present, giving the page an honest, non-oracular tone
- Sorunlar:
  - Could not verify the actual quality/accuracy of generated answers (verse selection, intro/closing copy, atlas suggestions) — this is the highest-stakes content on the page and is entirely dynamic/LLM-generated, so this audit could only assess the surrounding chrome, not the substance
  - Idle-state has no example of what a good answer looks like (no static sample response), so first-time visitors can't gauge quality before querying
- İyileştirme önerileri (içerik):
  - This route should get a dedicated live-response content audit once the API key is available — sample 10-15 real queries and check verse relevance, hedging in generated intro/closing text, and whether 'kanıt/mucize' language ever leaks into generated copy
  - Consider showing one static example Q&A pair on the idle state to set quality expectations

**Görsellik: 7.5/10**
- Masaüstü: Minimal, on-brand search interface: search input with sparkle icon, 'Sor' submit button, and Anlam ile ara / Anahtar kelime mode toggle. Empty state shows a small sparkle glyph + 'Yukarıdaki kutuya bir soru yaz.' centered in a very large otherwise-empty dark canvas. Typographically consistent but the empty state feels underbuilt relative to the rest of the site — no example-question chips, no recent/suggested queries, unlike the rich empty/landing treatment given to nearly every other page.
- Mobil: Same layout reflows cleanly to full width, toggle buttons and input remain comfortably tappable, no overlap. Empty space below is proportionally even larger on mobile (most of the viewport is blank dark canvas below the one line of helper text).
- Sorunlar:
  - Empty state is visually thin for a flagship search feature — just an icon and one sentence in a large void, versus the example-chip patterns used elsewhere on the site (e.g. home page CTAs, kelime-isi's 'Örnek Aramalar')
- İyileştirme önerileri (görsellik):
  - Add a row of example/suggested question chips (mirroring the 'Örnek Aramalar' pattern from /graf/kelime-isi) to the empty state so the page doesn't read as unfinished
  - Consider a subtle background illustration or reduced vertical whitespace so the empty canvas doesn't dominate the viewport before a query is entered

**Buglar:** kayda değer bulgu yok.

---

### `/kutuphanem`

**İçerik: 6/10** — Personal bookmark library (client-side localStorage list across 27 typed bookmark categories); on a fresh session it renders only the empty state, so there is minimal 'content' to assess beyond UI copy and the type taxonomy.
- Güçlü yönler:
  - 27-type taxonomy (verse, tefsir, article, atlas-kissa, sebeb-nuzul, wowfact, prophet, etc.) is thorough and mirrors the site's actual content surface, TR/EN labels are complete and consistent
  - Empty-state copy is clear and actionable ('/sor veya atlas sayfalarında 🔖 butonuyla ekle')
- Sorunlar:
  - Inherently thin as a content page — it's a personal utility with no editorial voice; nothing here is fact-checkable in the sense the other pages are
  - Type-label parity between this file and RecentBookmarksStrip.jsx is maintained by hand per its own code comment ('Yeni bir bookmark tipi eklendiğinde her iki dosyada da label ekle') — a drift risk, not directly observable without diffing both files
- İyileştirme önerileri (içerik):
  - Not a content page in the traditional sense — no editorial improvements apply; only structural/engineering suggestion is to derive the two TYPE_LABELS objects from one shared source to prevent drift

**Görsellik: 5/10**
- Masaüstü: Header/typography match the site (KİŞİSEL eyebrow, serif H1, intro paragraph). But the empty-state panel breaks brand badly: it uses a raw OS/browser default emoji (a flat gray label/tag emoji with a red ribbon, rendered in the platform's native emoji font) as the empty-state icon, clashing hard with the custom gold monoline icon system used on every other page (e.g. /hakkinda's document icon, /kaynakca's document icon). The body copy also embeds the same raw emoji glyph inline mid-sentence ('...🏷️ button ile ekle/çıkar', '...🏷️ butonuyla ekle'), which reads as placeholder/dev text that leaked into production copy rather than a deliberate UI icon reference.
- Mobil: Same emoji-icon and inline-emoji-in-copy issues reproduce identically at mobile width; layout itself doesn't break (card resizes fine), but the emoji is even more visually jarring against the otherwise refined serif type at this scale.
- Sorunlar:
  - Empty-state icon is a raw platform emoji (tag/label with red ribbon) rendered in flat default emoji style, breaking the site's custom gold-line-icon visual language
  - Body copy literally embeds the emoji glyph twice inline instead of referencing a UI element by name or icon, reading as unfinished/placeholder text
  - This is currently the weakest page on the site relative to its own premium bar — everywhere else (hakkinda, kaynakca, home) uses custom SVG icons consistently
- İyileştirme önerileri (görsellik):
  - Replace the emoji with a custom line-icon bookmark/save glyph matching the icon set used in the header's bookmark button and other tool icons
  - Rewrite the helper copy to name the UI element ('kaydet butonu' or similar) instead of embedding the raw emoji character, or replace the emoji reference with an inline rendered icon component

**Buglar:**
  - [typo] Untranslated English words mixed into Turkish copy: "Kaydettiğin ayet, tefsir, makale ve atlas item'ları burada. Her yerde 🔖 button ile ekle/çıkar." Should be Turkish (e.g. "öğeleri" / "düğme"). Reproduces on both desktop and mobile. Source: src/app/[locale]/kutuphanem/KutuphanemRoute.jsx:148 (string also literally contains 'button' where the emoji already substitutes for a bookmark icon).

---

### `/hakkinda`

**İçerik: 9/10** — About/Methodology page with 5 sections: Purpose, Epistemic Stance ('Kur'ân Hakikatin Ölçüsüdür'), Methodology & Sources, Limits & Honesty, Authorship & Contact — content is hardcoded in HakkindaRoute.jsx, bilingual, no i18n JSON.
- Güçlü yönler:
  - The Epistemic Stance section is a model instance of the site's own house rule: explicitly states no scientific/historical datum 'proves' or 'confirms' a Qur'anic statement, and that a mismatch with current science reflects either science's current limits or human interpretation, never the text
  - Methodology section lists concrete, named sources (Hafs/Âsım qira'ah, 6 named translations, Elmalılı + Ibn Kathir as base tafsirs, KFGQPC font) rather than vague claims
  - Limits & Honesty section explicitly distinguishes exact canonical counts from computed/estimated statistics — matching the site's own stats-honesty rule almost verbatim
  - Explicitly frames tafsir interpretation as plural/non-final ('bir okuma imkânıdır, tek doğru değil') and invites error reports to a real contact address
- Sorunlar:
  - No dated 'last reviewed' marker — a methodology page like this benefits from a visible revision date so readers know how current the stated sourcing/stance is
- İyileştirme önerileri (içerik):
  - Add a small 'last updated' timestamp to the page for transparency, since the underlying sourcing/tool count does change over time

**Görsellik: 9/10**
- Masaüstü: Clean editorial layout: eyebrow label, serif H1, intro line, a 'Kaynakça' CTA button with a proper custom document line-icon, then a stack of bordered content cards (Amaç, Epistemik Duruş, ...) each with its own eyebrow/H2/body copy. Matches the scholarly, restrained tone of /kaynakca and the home page perfectly.
- Mobil: Reflows to full width cleanly, card padding and line-length remain comfortable, no overlap or crowding across the header and first two cards sampled.
- İyileştirme önerileri (görsellik):
  - None significant — this page is a good reference standard for the site's icon/typography consistency (worth aligning /kutuphanem and /tefekkur's icon choices to match this page)

**Buglar:** kayda değer bulgu yok.

---

### `/kaynakca`

**İçerik: 9/10** — Categorized bibliography (6 categories: classical tafsir, modern tafsir, academic/Quranic studies, rhetoric & ulûm al-Qur'an, hadith & sira, contested science/history, software/data corpora) — ~45 entries, hardcoded in KaynakcaRoute.jsx.
- Güçlü yönler:
  - The 'Bilim & Tarih — Tartışmalı Alanlar' category is exactly the kind of honest labeling §13.24 requires: Moore's entry notes 'Moore'un Kur'ân yorumlarına ilişkin akademik tartışmalar bulunmaktadır', Bucaille's entry says outright 'iddiaları akademik mainstream'de tartışmalıdır' — the site does not launder Bucaillism as settled science
  - Mixes primary classical sources (Taberî, Zemahşerî, Râzî, Kurtubî, Buhârî, Müslim) with real modern academic scholarship (Izutsu, Neuwirth/Corpus Coranicum, Sells, Farrin, Rippin) rather than only apologetic literature
  - Page intro itself states contested areas are 'ayrı bir başlıkta kümelenmiş ve metodolojik nüansla işaretlenmiş' — explicitly telling the reader how to read the list critically
  - Cross-links back to /hakkinda for the methodology framing, avoiding redundant re-explanation
- Sorunlar:
  - Individual attributions (author names, work titles, years) are not independently re-verifiable in this session; the site's own CLAUDE.md (§13.30) documents a prior full-source verification pass (2026-08-14) that caught 11 real citation errors, which is reassuring but means today's list should be trusted only as of that audit date, not indefinitely
- İyileştirme önerileri (içerik):
  - Consider a visible 'last verified' date tied to the §13.30 audit process, so readers/maintainers know how fresh the citation-accuracy pass is

**Görsellik: 9/10**
- Masaüstü: Same editorial pattern as /hakkinda: eyebrow, serif H1, descriptive paragraph, 'Metodoloji & Çerçeve' CTA with matching document icon, then a bordered card containing a categorized bibliography (Tefsir — Klasik Dönem) with gold diamond bullets, italicized book titles, and small descriptive captions per entry. Excellent scholarly typesetting.
- Mobil: Long author/title lines wrap gracefully across 2-3 lines without breaking the gold-diamond-bullet alignment; card border and padding scale down sensibly.
- İyileştirme önerileri (görsellik):
  - Consider a jump-to-category nav for this page given it likely runs very long (only classic-tafsir category sampled) — not visible in the captured viewport, may already exist further down

**Buglar:** kayda değer bulgu yok.

---

### `/oku`

**İçerik: 8/10** — Reading Mode for Sûre 1 (El-Fatiha) — canonical Arabic text (KFGQPC-normalized), Suat Yıldırım Turkish meal by default with a meal switcher, tefsir/tajweed/word-by-word panels available via toolbar.
- Güçlü yönler:
  - Primary content is canonical Quran text + an established published translation (Suat Yıldırım) — lowest content-risk category on the site since it's not editorial synthesis
  - Multiple meal comparison ('Ayet numaralarına tıklayarak mealleri karşılaştırabilirsiniz') supports the site's stated multi-translation approach from /hakkinda rather than privileging one translator's word choices
  - Surah metadata (nüzul 5, Mekkî, 7 âyet, 1 rukû) is precise and matches standard mushaf data
- Sorunlar:
  - Extracted page text shows a stray 'قصر' token embedded mid-verse in the rendered stream (likely a tajweed pause-type tooltip label bleeding into text extraction rather than a real corruption) — worth a manual visual check to confirm this isn't user-visible in the actual rendered Arabic, since §13.15's Arabic-encoding rule is strict about exactly this class of artifact
- İyileştirme önerileri (içerik):
  - Manually verify (not just via text-extraction) that the 'قصر' waqf-label artifact seen in the Bakara reading (also present here structurally) never renders inline with the Arabic glyphs themselves

**Görsellik: 9/10**
- Masaüstü: Reading mode intentionally switches to a warm cream/paper 'day' theme (GÜN mode) rather than the dark cosmic theme — a deliberate, well-executed contrast evoking a physical mushaf. Two-page book spread with a center spine divider, gold sûre-header illumination, right-aligned Arabic Uthmani text in maroon/gold, left page showing the selected meal (Suat Yıldırım). Toolbar icons (Kelime, Meal, Tefsir, Tahta, Ezber, Gün, Ayar, Yer İmi, Kapat) are clean and consistently iconified.
- Mobil: Collapses to a single page with a condensed icon toolbar (Ara/Gün/TR/Ayar) that remains legible and tappable; sûre header and Besmele render at appropriate scale with no clipping.
- İyileştirme önerileri (görsellik):
  - None significant at this viewport/state — strong execution of a deliberate theme departure that still feels premium

**Buglar:** kayda değer bulgu yok.

---

### `/oku/2`

**İçerik: 8/10** — Reading Mode for Sûre 2 (El-Bakara), same tool/pattern as /oku, page 1 of the surah — canonical Arabic + Suat Yıldırım meal, correct nüzul/Medenî/286-âyet/40-rukû metadata, prev/next surah navigation.
- Güçlü yönler:
  - SEO description and in-page metadata are accurate and consistent (El-Bakara, sûre 2, correct prev/next surah links to El-Fatiha/Âl-i İmrân)
  - Same low-risk canonical-text content profile as /oku
- Sorunlar:
  - Same 'قصر' inline-token artifact appears in the extracted Arabic text stream here too (visible after ayah 4's 'اُو...لٰٓئِكَ' word) — recurring across pages, suggesting it's systematic to the reading component rather than a one-off, worth the same verification as /oku
  - Page shows only page 1 of a 40-rukû, 286-ayah surah — appropriate for a paginated reader, but means most of the surah's content (and any tefsir-panel richness) is unassessed in this pass
- İyileştirme önerileri (içerik):
  - Confirm visually (screenshot, not text extraction) whether the recurring 'قصر' artifact is a real rendering leak or purely a text-extraction quirk of the tajweed overlay tooltip

**Görsellik: 9/10**
- Masaüstü: Identical high-quality book-spread layout as /oku for Sûre 2 (Bakara); nüzul/type/ayet-count/rukû metadata line renders correctly, page-turn chevrons and cüz/sayfa selectors in the top toolbar are unchanged and consistent.
- Mobil: Same single-page mobile reading layout as /oku, header now shows 'Cüz 1 · S. 1' breadcrumb correctly for this sûre; no regressions from the /oku baseline.

**Buglar:** kayda değer bulgu yok.

---

### `/ayet/2`

**İçerik: 1/10** — Route does not resolve — /tr/ayet/2 returns a hard 404. The Next.js app only defines a page at the deeper /ayet/[surah]/[ayah] segment (verified working example: /tr/ayet/2/1 renders correctly with Arabic + translation + reference + share/open-in-reading-mode CTAs); there is no page.js at the /ayet/[surah] level.
- Güçlü yönler:
  - The equivalent working page (/ayet/2/1) itself is clean and accurate: correct Arabic ('الٓمٓ'), correct translation ('Elif. Lam. Mim.'), correct reference ('El-Bakara 2:1'), functional 'Open in Reading Mode' and Share CTAs
- Sorunlar:
  - /ayet/2 as a standalone route is broken (404) — there is no verse-selector or surah-level landing at this path; any external link or internal reference pointing to /ayet/{surah} without an ayah segment will 404
  - This is a routing/completeness defect, not a content-quality one, but it means the specific URL requested has zero content to evaluate
- İyileştirme önerileri (içerik):
  - Add a page.js at src/app/[locale]/ayet/[surah]/ that either redirects to ayah 1 of that surah or shows a lightweight verse-picker, so bare /ayet/{surah} URLs resolve instead of 404ing

**Görsellik: 2/10**
- Masaüstü: This exact route ('/tr/ayet/2', missing the required ayah segment) resolves to a completely unstyled default Next.js 404 page: plain white background, black system-font '404' heading, 'This page could not be found.' — zero site branding, zero dark-cosmic theme, breaks total visual continuity with the rest of the app. For comparison, the real route pattern /ayet/[surah]/[ayah] (checked at /ayet/2/255) renders a beautiful on-brand verse-share card: dark background, large gold Uthmani ayah text, italic Turkish translation, reference line, and Aç/Paylaş actions — so the underlying feature is high quality, but this specific URL falls through to the generic error page.
- Mobil: Same bare white default 404 page at mobile width — no responsive concerns since there is no custom layout at all.
- Sorunlar:
  - The literal route /tr/ayet/2 renders Next.js's completely unbranded default 404 page (white background, system font) instead of the site's dark-themed 404/error state
  - Total loss of brand continuity if any user or shared link lands on an incomplete /ayet/{surah} URL without an ayah number
- İyileştirme önerileri (görsellik):
  - Build a custom not-found.js for the [locale] (or ayet) segment that matches the dark cosmic theme, gold accent, and nav chrome used everywhere else
  - Consider redirecting an incomplete /ayet/{surah} URL to a sensible default (e.g. ayah 1) or to a sûre picker instead of erroring

**Buglar:**
  - [broken-link] GET /tr/ayet/2 (malformed ayet URL missing the [ayah] segment — real route is /ayet/[surah]/[ayah]) returns HTTP 404 but renders Next's BARE default not-found page instead of the site's own localized src/app/[locale]/not-found.jsx: no <html lang>, no navbar/site chrome, plain white background, English text 'This page could not be found.' on an otherwise all-Turkish site. Verified: document.documentElement.lang === '' and no nav/header element present. Notably, the site's own not-found.jsx contains a code comment (dated 2026-08-13) claiming this exact case ('/ayet/...' boundary check) was already fixed by adding that locale-level not-found page — but it is not actually catching this route. Reproduces identically at 1400x900 and 390x844.

---

### `/tefekkur`

**İçerik: 8/10** — Index of curated long-form reflection essays by a single external author ('Felsufi'), shared with stated verbal permission, cross-linked to Concept Graph/Verse Map/Reading Mode; dynamic stat chips (live/draft/category/author counts) computed from public/tefekkur/_index.json rather than hardcoded.
- Güçlü yönler:
  - Very explicit, prominent epistemic disclaimer block ('✍︎ Felsufi'nin kendi tefekkür denemelerinden seçmeler') stating these are the author's personal ijtihad and reading-attempts, not tafsir consensus, and that contested passages are flagged with 'alternatif okuma' callouts within articles
  - Stat counts are derived live from the index JSON (per the page's own code comment fixing a prior hardcoded-count bug) rather than manually maintained, reducing drift risk relative to other stat displays on the site
  - Attribution/gratitude footer is honest about provenance: canonical source stays on the author's own Medium/Substack, site is a respectful mirror with permission, not a claim of ownership
  - This section is explicitly and correctly exempted (per site's own CLAUDE.md §13.24) from the 'no proof/miracle language' scholarly-claim review, since it's signed personal opinion rather than editorial site content — and the on-page framing matches that exemption honestly
- Sorunlar:
  - 'Verbal permission' (sözlü/sıfahi izin) from the author is asserted but obviously unverifiable by a reader — inherent to the situation, not a fixable content flaw, but worth noting as an unverifiable-claim category
  - Category counts and 'published vs draft' distinction depend on each article's status field being accurate; not independently checked in this pass
- İyileştirme önerileri (içerik):
  - None major — this index page already models the disclosure practice other 'interpretive' pages (e.g. /graf/semantik's cluster titles) should copy

**Görsellik: 8/10**
- Masaüstü: Strong hero card: eyebrow + bullet, serif H1, intro paragraph with inline gold links (Kavram Ağı, Ayet Haritası, Okuma Modu), a nested highlight box ('Felsufi'nin kendi tefekkür denemelerinden seçmeler') with pill labels and a disclaimer about non-canonical personal readings, stat row (53 yayın/6 kategori/1 yazar), category filter tabs, and a 3-column article-card grid below. Decorative folded-book illustration sits in the hero's top-right corner on desktop without issue. One inconsistency: the highlight box's leading icon is a raw platform emoji (writing-hand/pen, ✍️ in default emoji style) rather than the site's custom gold line-icon set.
- Mobil: The decorative folded-book graphic from the hero (positioned top-right on desktop) does not reflow/hide on mobile — it renders as a large, dark, semi-transparent shape bleeding directly across and behind the H1 title text ('...Tasavvufî Düşünce'), lowering text contrast and getting hard-clipped by the card's rounded corner. This reads as a genuine mobile layout bug, not a deliberate design choice.
- Sorunlar:
  - Mobile: hero's decorative folded-book illustration overlaps and reduces contrast behind the H1 heading, and is abruptly clipped by the card border — looks broken rather than intentional
  - Raw emoji (✍️) used as an icon in the 'Felsufi'nin kendi tefekkür denemelerinden seçmeler' callout box, same off-brand pattern as /kutuphanem's emoji icon
- İyileştirme önerileri (görsellik):
  - Hide or reposition/rescale the decorative book graphic below sm/md breakpoints so it doesn't overlap the heading text on mobile
  - Swap the ✍️ emoji for a custom line-icon consistent with the rest of the site's iconography

**Buglar:**
  - [CSS/sticky ailesi] CSS/sticky/§13.32/tab-case ailesi taraması: sorun bulunmadı (bu oturumda ayrıca canlı doğrulandı).

---


## Tefekkür Makaleleri (/tefekkur/*) — 53 makale, birleşik denetim

Bu makaleler daha hafif/deneme tarzı sayfalar olduğu için içerik+görsellik+bug tek geçişte birlikte değerlendirildi.

**16 Ağustos 2026 — kullanıcı talimatı: "tefekkür yazılarına dokunma genel olarak... ama [veri/şema hatalarını] düzelt, kafana göre içerik düzeltmesi yapma."** Buna göre:
- ✅ **Düzeltildi (commit `f1d54ca`, paylaşılan bileşenler, makale metnine dokunulmadı):** `HierarchyTree.jsx`/`MorphologyTable.jsx`/`ArticleRenderer.jsx`'teki mobil taşma/örtüşme hataları — aşağıdaki tekil madde girişlerinde "Mobile..." diye geçen bulguların çoğu bununla kapandı.
- ✅ **Düzeltildi (commit `b39fcde`, yalnız veri şeması/sızmış iç referans, cümle anlamı değişmedi):** `rahmetin-grameri-1..7` previousArticle/nextArticle string→obje şema hatası (aşağıda 1-7 ayrı ayrı listeli, hepsi tek commit'te kapandı); `dusunme-fiilleri-zihnin-isletim-sistemi` author alanı; `kuran-mesajina-yabanci-kalmak` ve `yaratilis-hikayesi-2-katmanli-yaratilis`'teki sızmış "§13.15"/"​.15" kalıntısı.
- ⚠️ **Bilinçli olarak dokunulmadı (gerçek çeviri/prose değişikliği gerektiriyor):** `iki-nedensellik` (6 madde TR alanına yanlışlıkla İngilizce girilmiş, gerçek çeviri gerekir), `enerji-krizi`/`inception-hayatlar` (birer İngilizce ifade hatası, yeniden yazım gerekir), `hala-mi-evrim` (kapanış notu güncel değil, düzeltmek yazarın cümlesini değiştirmek anlamına gelir). Bunlar aşağıdaki ilgili madde girişlerinde hâlâ "issues" olarak görünüyor ama kod/veri tarafında bilerek bırakıldı.

### `/tefekkur/ala-suresi-1`

**İçerik: 9/10** — Tight etymological reading of tesbih (root sebbeha = 'to glide away') building to a genuinely interesting claim: the verse commands glorifying the Lord's 'name,' not the Lord Himself, because our observation-world only ever meets the name. Uses Wolfram's computationally-bounded-observer idea as a modern gloss on 17:44 ('you do not comprehend their glorification') — clearly marked as an analogy, not equated with tafsir. Second half (aʿlā vs ʿaẓīm/kabīr/majīd, the potter→ceramicist→artist chain) is a clean payoff. No unhedged 'proof' language; stays in reflective register throughout. Ends with an honest note that Turkish is the author's own pen and English is translation, and that the promised sequel doesn't exist yet.
- Görsellik notları: Follows the established Tefekkür pattern cleanly: gold eyebrow category label, Playfair title, italic tldr, meta row with author/reading time/date/canonical link, epistemic disclaimer box, sticky desktop TOC, hierarchyTree/contrastDuo/flowChain visual blocks, gratitude/attribution footer. Mobile hides the TOC and stacks to single column with no overflow. hierarchyTree/contrastDuo blocks use scroll-triggered fade-in (framer-motion whileInView) — a screenshot taken immediately on load can catch a branch mid-fade looking blank/low-contrast, but on a normal scroll or after ~1s dwell it renders with full contrast (verified directly on the 'Zihin' branch of the sebbeha hierarchyTree — computed opacity/colors were correct, it was a timing artifact, not a persistent bug).
- İyileştirme önerileri:
  - The article promises a second installment ('devamı henüz sitede yok') — consider a lighter-weight visual treatment (e.g. omit or grey out the 'next article' slot) rather than leaving it silently absent, so readers don't wonder if something failed to load.
  - Wolfram's computational-irreducibility claim is asserted without a citation anchor (book/talk) — a short parenthetical source would strengthen the criticalNote-style rigor seen elsewhere on the site.

---

### `/tefekkur/alak-suresi-1`

**İçerik: 9/10** — Strong opening essay of the Alak series: grounds 'iqraʾ' in the root qaraʾa ('to gather parts into a whole') via Lane's Lexicon, then builds the tilāwa/qirāʾa (manā-yi ismī / manā-yi ḥarfī) distinction into a persuasive reading of 'bismi rabbika' as declaring a metaphysical reading-frame rather than a literal reading command. The quantum-interpretation analogy (Copenhagen/Many-Worlds/Pilot-Wave as different 'physical readings') is a nice contemporary bridge and is clearly flagged as analogy. Good use of contrastDuo (tilāwa⇄qirāʾa) and biographical background on the Prophet ﷺ pre-revelation. Well within the site's hedging norms.
- Görsellik notları: Same clean essay template as the rest of the series — sticky TOC, verseInline cards, pullQuote blocks for the Alâ 87:1-7 citation. Renders correctly on both viewports; contrastDuo box (Tilâvet/Kıraat) confirmed fully legible on close inspection.
- İyileştirme önerileri:
  - Consider a 'Series' badge/breadcrumb (à la SeriesTimeline used elsewhere) since this is explicitly part 1 of a 3-part Alak sûresi reading — currently only the 'next article' card at the bottom signals the series.

---

### `/tefekkur/alak-suresi-2-3`

**İçerik: 9/10** — The strongest of the Alak series for epistemic transparency: it explicitly flags via criticalNote that the 'alaq = suspended/clinging' reading (vs. the traditional 'blood-clot') is Felsufi following İsmail Yakıt against 'a significant portion of classical exegetes' (Ṭabarī, Ibn Kathīr) — exactly the kind of alternative-vs-consensus framing the site's own rules ask for. The ontological/temporal-priority (architect/palace) analogy for karam/ikrām is original and clearly argued, well supported by a dense chain of verse cross-references (17:62, 17:70, 2:29, 2:31, 33:72, 55:3-4, 95:4, 53:9).
- Görsellik notları: Longest of the three Alak pieces (~9.6k px desktop); the two contrastDuo blocks and flowChain render correctly. TOC has more entries and works well for navigating the long page. No mobile overflow observed.
- İyileştirme önerileri:
  - Given the density of verse citations, a short 'related verses at a glance' recap near the end (the site already tracks relatedVerses) could help readers who skimmed the middle.

---

### `/tefekkur/alak-suresi-4-5`

**İçerik: 7/10** — The most speculative essay in the sample: it extends 'al-qalam' (the Pen) to the prefrontal cortex, an AI encoder, and the quantum measurement problem/wave-function collapse. This is honestly the kind of reach the site's own §13.24-style discipline exists to catch — and to the article's credit it does self-flag with an explicit criticalNote stating this reading 'does not belong to the classical exegetical consensus' and names what classical exegetes (Rāzī, Ṭabarī, Ibn Kathīr) actually said instead. Still, the chain from Qurʾanic 'Pen' to 'measurement problem' is a long analogical leap for a general reader, and the piece would benefit from tightening. The hadith about the Pen ('first thing God created') is correctly marked as being of contested/mawḍūʿ isnād, which is good practice.
- Görsellik notları: Longest single page in the set (~9.8k px desktop, dense with verseInline, contrastDuo, flowChain, and two pullQuotes). Renders cleanly; no layout issues found. TOC has three entries.
- İyileştirme önerileri:
  - Given this is the most speculative essay, consider surfacing the criticalNote disclaimer higher up (currently it appears mid-article, after the reader has already absorbed the AI/quantum framing) rather than only after the claim is made.
  - The prefrontal-cortex/AI-encoder/quantum-Pen chain could be split into a shorter core argument plus an optional 'further speculation' collapsible, to keep the strongest etymological material (qalam root, 4 Quranic occurrences) from being diluted.

---

### `/tefekkur/allahu-ekber-seyr-ilallah`

**İçerik: 9/10** — One of the strongest pieces in the set. Cleanly dismantles the naive 'Allah is bigger than everything' reading of Allāhu akbar (a thing is compared to its own kind; God has none), replaces it with 'akbar = confession of the limit of our own perspective,' and threads this through takbīr-in-prayer, Bediüzzaman's 'mevcud-u meçhul' distinction (with sourced, quoted Turkish original), and a closing meditation on 'diving into the sea of meaning' that lands on a genuinely moving point about representation/temsil. Good use of criticalNote for the 'known-unknown' nuance and a closing note that verse anchors come from the site's own verse graph, normalized for display.
- Görsellik notları: Consistent essay template; contrastDuo used twice effectively (kıyas vs perspektif; Allahu ekber vs Zikrullahi ekber), hierarchyTree for the three depth-images, flowChain for the five-stage descent to Sidretü'l-müntehâ. All render correctly given normal scroll dwell.
- İyileştirme önerileri:
  - The closing pullQuote ('Objeler önemini yitirirken fiiller kalır') is a strong line — could work as the page's tldr hook or social-share excerpt rather than being buried at the very end.

---

### `/tefekkur/analitik-icgoru-1`

**İçerik: 8/10** — Opens the 'Şuur Kavramı' (Consciousness) series with a clear two-axis definition (epistemic coarse-graining + ontological ene/window geometry) and a genuinely useful car/ulcer everyday-identification example. The 'opaque vs transparent ene' framing (Pharaoh vs Prophetic paradigm) is well-grounded in Bediüzzaman's 30th Word. The long criticalNote at the end is exemplary: it explicitly separates the Nurcu-specific vocabulary (manā-yi ismī/ḥarfī) from classical kalām's different vocabulary for similar distinctions, and flags the coarse-graining/information-theory pairing as a modern bridge, not a classical claim. This kind of self-aware framing is exactly what keeps ambitious content honest.
- Görsellik notları: Mobile screenshot confirmed clean single-column stacking, TOC correctly hidden, no horizontal overflow across the full ~9.4k px page. Desktop renders the two contrastDuo blocks and hierarchyTree without issue given normal scroll timing.
- İyileştirme önerileri:
  - Series identity (1 of 3) is only visible via the seriesNumber/seriesTotal-driven SeriesTimeline component if present — worth double-checking it actually renders at the top of all three articles for a reader landing here from search rather than from article 1.

---

### `/tefekkur/analitik-icgoru-2`

**İçerik: 8/10** — Ambitious middle piece: proposes consciousness as the mechanism aligning local utility-maximization with a 'generalized utility' of the cosmos, leans on the Maximum Entropy Production Principle (LMEP/MEPP) as a physical grounding. To its credit, the criticalNote is unusually candid for the genre: it states outright that LMEP 'is a proposition without consensus in physics,' that the pairing with the hadith qudsī of the hidden treasure is 'a pedagogical bridge' absent in classical Sufism, and that the generalized-utility/economics vocabulary is 'a contemporary Felsufi synthesis' not present in classical kalām. This is the correct posture for a site that must avoid dressing up contested physics as settled fact. The cow/human utility-horizon example is effective and concrete.
- Görsellik notları: Same clean template; contrastDuo used three times (opaque/transparent ene, cow/human, faith/disbelief) plus a flowChain and a hierarchyTree closer. No layout problems found.
- İyileştirme önerileri:
  - Given LMEP is explicitly flagged as non-consensus, consider moving that caveat from the closing criticalNote to inline right where LMEP is first introduced (section 4), so a skimming reader doesn't walk away thinking it's an established physical law.

---

### `/tefekkur/analitik-icgoru-3`

**İçerik: 8/10** — Solid capstone to the consciousness trilogy: organizes six 'opening' mechanisms and four 'closing' mechanisms around Şems 91:9-10 (falāḥ/khusrān), then maps both onto epistemic/ontological/ethical/eschatological dimensions with a dense, well-chosen verse apparatus (19 relatedVerses). The closing criticalNote again does the right thing — naming the Nurcu-specific vocabulary, crediting the 'delayed gratification' bridge to modern psychology explicitly as a bridge rather than an equivalence, and noting that the four-dimension academic-essay structure itself is a contemporary framing device, not how classical tafsir/Sufi texts are organized.
- Görsellik notları: Two large hierarchyTree blocks (six-mechanism and four-mechanism) plus a wide contrastDuo table render correctly; page is dense but well broken up by section headers and verseInline cards.
- İyileştirme önerileri:
  - The two 6-branch and 4-branch hierarchyTrees are visually similar in structure — a small connecting visual cue (e.g. consistent color between corresponding 'opening'/'closing' mechanism pairs) would help readers see the intended symmetry the text describes.

---

### `/tefekkur/anlam-yaratilis-senteni`

**İçerik: 6/10** — Well-written and internally coherent essay on genetic synteny as evidence for common descent, correctly targeting the specific rebuttal ('a resourceful creator reused good tools' explains gene similarity but not preserved gene *order*) rather than a strawman. Properly hedged as the author's personal view via criticalNote, and honest that the English text is a translation-in-progress rather than the author's own words. However, as a 'Tefekkür' (Quranic reflection) piece it is an outlier in this set: relatedVerses is empty, there is not a single verseInline block or Arabic anchor verse anywhere in the article, and 'yaratılış' is discussed only in the broad Abrahamic/Genesis-literalism sense, never engaging a specific Qur'anic text. It reads as a general theistic-evolution essay that happens to live in the Tefekkür section rather than a reflection growing out of a particular āyah, which is a weaker fit with the premise the other ten pages in this set all deliver on.
- Görsellik notları: Same visual template (hero, disclaimer, hierarchyTree/contrastDuo/flowChain, attribution footer) applies cleanly even without any verseInline content, so the page doesn't look broken — just conspicuously verse-less next to its siblings.
- İyileştirme önerileri:
  - Anchor the piece to at least one Qur'anic creation verse (e.g. 32:7-9, 23:12-14, or 71:14 'ṭawāran' — stages of creation) so it reads as Qur'anic tefekkür rather than a general science-and-faith essay; the site's own relatedVerses field is empty and could be populated.
  - The criticalNote mentions an 'evolution trilogy' and 'Yaratılış Hikâyesi 1-2' as companion pieces on the site — a RelatedToolCard-style cross-link to those would help readers place this piece in its intended reading-list context rather than encountering it as a standalone outlier.

---

### `/tefekkur/asr-suresi-prensipler`

**İçerik: 9/10** — The most structurally ambitious piece in the set: derives eight modern-management principles (time economics, human capital, four-element profitability, organizational behavior, socio-ethical sustainability, psychological resilience, narrative strategy, risk management) from the three verses of Sūrat al-ʿAṣr, consistently returning to the Arabic root (ʿaṣr = 'to press out the essence,' tawāṣī = reciprocal counsel, ṣabr = active homeostasis, not passivity). The closing criticalNote is properly modest: 'this is not a claim to exegesis but a map of practical principles.' The extensive business/management vocabulary (dashboards, buddy system, project charter, flywheel) is a deliberate register choice and is clearly framed as 'practical counterpart' callouts rather than claimed as the verse's literal meaning, but it is a lot of modern jargon layered onto three ayahs and risks feeling more like a productivity-blog exercise than tefekkür for readers expecting a devotional register.
- Görsellik notları: By far the longest page in the set (~17.8k px on mobile, ~9 sections each with their own hierarchyTree/contrastDuo/criticalNote/pullQuote combination) — reading-time estimate of 9 minutes feels understated given the density. TOC with 8+ entries is essential here and works well; no overflow or layout issues on either viewport.
- İyileştirme önerileri:
  - The readingMinutes value (9) likely undercounts actual reading time for a page this dense — worth re-timing.
  - Given eight parallel headed sections each with pullQuote + criticalNote('Pratik karşılık'), consider a jump-to-section summary card near the top (beyond the sidebar TOC) so mobile readers without the sidebar can see the eight-principle structure at a glance before committing to the full scroll.

---

### `/tefekkur/ayet-koprusu`

**İçerik: 9/10** — Clean, well-argued epistemology piece: defines āya as 'the bridge between observation and truth,' builds al-Ghazālī's cosmos/human/Qurʾān triad, mounts a four-point case against matter-as-primary (math's apparent mind-independence, quantum pre-measurement possibility-space, irreducibility of first-person experience, non-material reality of ethics), then maps the Qurʾān's own four levels of āya-readers from Sūrat al-Jāthiya (45:3-13). The criticalNote is unusually precise: it verifies that a similar triad genuinely appears in Ghazālī's Iḥyāʾ and Mishkāt al-Anwār while flagging that *this exact formulation* is Felsufi's re-articulation, and separately flags the quantum/ʿālam al-imkān pairing as pedagogical analogy rather than identity. Also honestly notes that materialism/physicalism has more nuanced variants than the reductive version being critiqued — a fair-minded touch.
- Görsellik notları: Consistent template; hierarchyTree (three manifestations, four āya-reader levels) and contrastDuo (materialist vs. proposed ontology) render correctly. Reasonably concise page (6 min read matches the actual length reasonably well, unlike asr-suresi-prensipler).
- İyileştirme önerileri:
  - The four āya-reader levels (45:3-13) are presented in a hierarchyTree but are inherently a *progression* (mü'min → yakīn → akıl → tefekkür) — a flowChain (as used elsewhere on the site for staged progressions) might communicate the ascending-order relationship more clearly than a tree, which visually implies parallel/sibling categories rather than a ladder.

---

### `/tefekkur/cennet-cin-mecnun`

**İçerik: 9/10** — Excellent semantic/etymological analysis of the ج-ن-ن root (jannah/jinn/majnun/etc). Cross-linguistic comparisons (Hebrew, Aramaic, Ugaritic, Latin 'genius'), a full morphology table, a Risale-i Nur seed metaphor, and a clean closing synthesis. Framed explicitly as the author's own scholarly reading via the standard top-of-article epistemic disclaimer; no unhedged 'proof' language. Coherent, delivers fully on its premise.
- Görsellik notları: Desktop: gorgeous — root-tree hero (ج ن ن glyphs), sticky TOC that correctly highlights the active section on scroll, series timeline (3/4), platform link, related-tools cards, prev/next nav, gratitude footer all render cleanly. Mobile: hero/body/prose all clean, but the page has confirmed horizontal scroll caused by the morphologyTable and (further down) the hierarchyTree/sources blocks not respecting the 390px viewport.
- Buglar:
  - Mobile horizontal page-scroll: MorphologyTable (src/components/tefekkur/MorphologyTable.jsx) uses gridTemplateColumns with fixed minmax pixel minimums (120/140/180px ≈ 440px content width) and no overflow-x:auto wrapper, so the '3. Kur'an'daki Kullanım Kalıpları' table pushes the whole page wider than the viewport on mobile — verse-chip column is cut off screen.
  - Mobile: HierarchyTree branch labels ('Fiziksel Örtme' / 'Ontolojik Gizlilik' / 'Epistemik Perdeleme') overlap/collide illegibly in the '2. Anlam Hiyerarşisi' diagram — BranchLabel uses whiteSpace:'nowrap' inside a shrinking grid column with no overflow clipping, so on narrow screens the three pills stack on top of each other.
  - Mobile: the 'Kaynaklar' (sources) block likely also overflows — SourcesBlock renders name (minWidth 180px, flexShrink 0) + detail in a non-wrapping flex row with no minWidth:0 on the detail span.
- İyileştirme önerileri:
  - Wrap MorphologyTable in an overflow-x:auto container OR switch to a stacked card layout below ~640px.
  - Give HierarchyTree's branch-label row `flexWrap:'wrap'` (or drop to a vertical branch list) below the same breakpoint, and remove whiteSpace:'nowrap' on BranchLabel for narrow viewports.
  - Add `flexWrap:'wrap'` and `minWidth:0` to SourcesBlock's name+detail row for mobile.

---

### `/tefekkur/dusunme-fiilleri-zihnin-isletim-sistemi`

**İçerik: 9/10** — Tight, original taxonomy of five Quranic 'thinking' verbs (tefekkuh/tefekkür/taakkul/tedebbür/tezekkür) as a three-layer 'operating system'. Explicitly self-labels as 'a proposed reading, not the text's only necessary division' — excellent epistemic hedging. Strong closing case study (Nahl 11-13) makes the thesis concrete rather than abstract. One of the strongest essays in the set.
- Görsellik notları: Desktop looks premium and complete (hero, TOC, morphology table, related tools, series nav). But the meta row under the title is missing the author name, and the closing gratitude/attribution paragraph reads as broken text because of a data bug (see bugs). Mobile has the same MorphologyTable and HierarchyTree overflow/overlap issues as cennet-cin-mecnun.
- Buglar:
  - DATA BUG: this article's JSON has `"author": "Felsufi"` as a plain string instead of the `{name, url}` object schema every other article uses. Because the route reads `article.author?.name` and `article.author?.url`, both resolve to undefined here: (1) the meta row under the title is missing the gold author name entirely (shows '· 7 dk okuma · 2026-08-14 · Medium'da görüntüle' with nothing before the first ·), and (2) the closing 'Yazara Teşekkürlerimizle' footer sentence literally reads 'Bu yazı, 'nin sıfahi izni ve cömertliğiyle...' — a grammatically broken sentence with the author name missing, and the author-name link has no href.
  - Mobile horizontal page-scroll from the '4. Beş Fiil, Tek Bakışta' MorphologyTable (same root cause as cennet-cin-mecnun).
  - Mobile: HierarchyTree ('Zihnin işletim sistemi — üç katman') branch labels overlap illegibly (DONANIM / İŞLEMLER / ÇIKTI).
- İyileştirme önerileri:
  - Fix the JSON: change `"author": "Felsufi"` to `"author": {"name": "Felsufi", "url": "https://sufist.medium.com"}` to match the rest of the corpus and restore the author name in both the meta row and the footer.
  - Same MorphologyTable/HierarchyTree mobile fixes as noted for cennet-cin-mecnun (this is a shared-component bug, not page-specific).
  - Consider a defensive fallback in the route (e.g. `typeof article.author === 'string' ? {name: article.author} : article.author`) so a future string-author JSON doesn't silently break the UI again.

---

### `/tefekkur/emrin-mahiyeti`

**İçerik: 8/10** — Dense ontological essay distinguishing khalq (being) from amr (operation) across three dimensions (imperative/operational/governing), tied to Ism al-Qayyum. Includes an unusually careful criticalNote explicitly separating what's classical kalam vs. what's 'Felsufi's own analytical ordering' (contemporary philosophical vocabulary, Polanyi's top-down causation, etc.) — a model of appropriate hedging. Fairly abstract/hard-going for a general reader compared to the more concrete essays in the set, but internally coherent and delivers on its premise.
- Görsellik notları: Desktop renders cleanly with contrastDuo (Halk⇄Emr) and a 3-branch hierarchyTree. Mobile: same systemic HierarchyTree overlap bug as the other pages using this block.
- Buglar:
  - Mobile: '2. Emrin Üç Boyutu' HierarchyTree branch labels (İmperatif / Operasyonel / İdari) overlap and are unreadable — same root cause as other pages (BranchLabel whiteSpace:nowrap + no wrap/clip in the shrinking grid column).
- İyileştirme önerileri:
  - Apply the site-wide HierarchyTree mobile fix (wrap or stack branch labels below ~640px).
  - This essay could use one more concrete, everyday illustration of Emr (beyond the house-design analogy) to make the ontology land for non-specialist readers.

---

### `/tefekkur/enerji-krizi`

**İçerik: 9/10** — One of the most practically useful essays in the corpus — reframes distraction/low motivation as 'fuel management' rather than moral failure, with a genuinely excellent criticalNote that (a) tells readers with clinical-level anger/anxiety/depression to seek professional care, and (b) explicitly flags the 'brain can't distinguish imagination from reality' neuroscience claim as popular-science shorthand, not a strict evidence-based claim. This is exactly the kind of self-aware hedging the site should want more of.
- Görsellik notları: Desktop and mobile both render cleanly — hierarchyTree with 4 branches, contrastDuo, multiple verseInline blocks, pullQuotes. No horizontal scroll detected on this page in automated testing.
- Buglar:
  - Mobile: '3. Dört Yakıt Kaynağı' HierarchyTree (4 branches: Beslenme/Uyku/İzlenimler/Meşguliyet) — branch labels overlap into an illegible pile, the worst instance of the site-wide HierarchyTree overlap bug observed in this batch (4 columns compounds the crowding).
  - EN translation typo: `"en": "Outer novelty staless out"` for `"tr": "Dış yenilik bayatlar"` — 'staless out' is not valid English (should be something like 'goes stale' or 'staleness sets in').
- İyileştirme önerileri:
  - Priority fix for HierarchyTree mobile layout here specifically, since 4 branches make the overlap worse than the 2-3 branch cases elsewhere.
  - Fix the 'staless out' typo in the English contrastDuo bullet.

---

### `/tefekkur/evrim-dinsizligi-projesi`

**İçerik: 7/10** — The title is explicitly the claim the author refutes, not endorses — flagged immediately by a top-of-article criticalNote, so it doesn't read as an unhedged assertion despite the provocative headline. Deliberately loose/unpolished 'raw tweet' style by the author's own admission, with informal asides preserved intentionally. Substantively makes a real philosophical point (essence vs. modality; science needs metaphysics) but is looser and more polemical than the other essays — reads more like a blog rant than the site's usual scholarly register, even though that's a stated authorial choice.
- Görsellik notları: Desktop and mobile render cleanly, no horizontal scroll detected. hierarchyTree (3 commitments: rationalism/naturalism/empiricism) and a second hierarchyTree (siyasal islam/milliyetçi/sosyalist) both present.
- Buglar:
  - Mobile: BOTH hierarchyTree blocks on this page show the overlapping-branch-label bug — confirmed and screenshotted for the second one ('Aynı handikaba düşenler': SİYASAL İSLAM / MİLLİYETÇİ HAREKET / TÜRK SOSYALİST HAREKETLERİ overlap into an unreadable mess).
- İyileştirme önerileri:
  - Apply the site-wide HierarchyTree mobile fix.
  - Given the deliberately casual tone is an authorial choice, consider at least a short editorial note (already partially present via the criticalNote) making clear to first-time readers why this piece reads differently from the rest of the Tefekkür catalogue, so it doesn't feel like an inconsistency in site quality.

---

### `/tefekkur/evrim-inanc-resimler`

**İçerik: 8/10** — Clear, accessible four-obstacles argument (generational lens / tafsir≠Quran / mental pictures replacing text / motivated reasoning) with a genuinely interesting closing observation (believers championed the Big Bang, non-believers championed evolution — same 'single point' logic, reversed camps). Near the end it states fairly directly 'this shows us that God created living things by means of evolution' as the 'correct' rhetorical reply to an atheist interlocutor — more assertive than the site's usual hedge-first register, though it's presented as a dialectical example rather than a flat claim.
- Görsellik notları: Clean rendering on both desktop and mobile; no hierarchyTree on this page so it avoids the overlap bug. flowChain and contrastDuo blocks render well.
- Buglar:
  - Content/attribution inconsistency: the article's `author` metadata is Felsufi (shown in the byline and in the standard 'Yazara Teşekkürlerimizle' footer, which speaks of 'yazarın şahsi tefekkürünü'), but the article's own opening criticalNote says it is 'an edited transcript of a 2019 talk by Seyeran Bey ... shared because it approaches the question from an unusual angle — Felsufi.' The page-wide authorship framing (byline, footer legal-style attribution) doesn't actually match who wrote/spoke the content.
- İyileştirme önerileri:
  - Either add a `speaker`/secondary-author field so the byline and footer can credit Seyeran Bey directly, or adjust the footer copy for this article to say 'shared with Felsufi's permission, based on a talk by Seyeran Bey' instead of the generic 'author's personal reflection' language.
  - Soften the 'this shows us that God created living things by means of evolution' line to match the more consistently hedged register used elsewhere (e.g. 'a Muslim can reasonably answer...').

---

### `/tefekkur/gecmis-klasik-gelecek-kuantum`

**İçerik: 10/10** — Outstanding piece of popular physics writing — precise, well-cited (Heisenberg 1930 p.20, Dyson 2004 ch.4, Smolin & Verde arXiv:2104.09945), fully secular (no religious claims at all — part of a physics-of-time series), and structurally elegant (double-slit experiment as the line between 'written' and 'unwritten'). Delivers completely on its premise and sets up its sequel cleanly. One of the two or three best essays in the whole Tefekkür corpus.
- Görsellik notları: Desktop is excellent — sticky TOC tracks all 7 sections correctly, flowChain/contrastDuo/hierarchyTree all render well, sources block with real citations. Confirmed mobile horizontal-scroll bug from the Kaynaklar (sources) block with long English citation names not wrapping.
- Buglar:
  - Mobile horizontal page-scroll: the closing 'Kaynaklar' SourcesBlock (Heisenberg / Dyson / Smolin & Verde entries) doesn't wrap — the fixed-width name column (minWidth:180px, flexShrink:0) plus the non-wrapping flex row pushes citation text off-screen (measured spans extending to x=706 on a 390px viewport).
  - Mobile: the 'Geçmiş nerede duruyor' hierarchyTree (Canlı/Cansız/Kozmik taşıyıcı) shows the same branch-label overlap bug as other pages.
- İyileştirme önerileri:
  - Add flexWrap:'wrap' and minWidth:0 to SourcesBlock's name+detail row for narrow viewports — this affects any tefekkür page with a long-citation sources block.
  - Apply the site-wide HierarchyTree mobile fix.

---

### `/tefekkur/hala-mi-evrim`

**İçerik: 7/10** — Solid four-perspective (scientific/logical/scriptural/maslahah) case citing real named scholars and a concrete ERV/synteny argument. The closing 'three arguments rejectionists can't answer' section reads a bit more combative/rhetorical than reflective, closer to a debate brief than tefekkür, but it's coherent and well-sourced (named scholars, Risale-i Nur reference checked against context).
- Görsellik notları: Clean rendering both viewports; hierarchyTree ('Üç Soru') has the same mobile overlap bug as elsewhere. flowChain for the evidence layers renders well.
- Buglar:
  - STALE CONTENT: the closing criticalNote ('Yazar hakkında · seri') says this essay is 'the second of three essays on evolution' and lists 'Evrim dinsizliği yayma projesidir!' as 'henüz eklenmemiş' (not yet added) — but that essay IS published on the site (audited in this same batch, at /tefekkur/evrim-dinsizligi-projesi) and, per its own publishedDate (2024-11-12 vs 2025-05-14 vs 2025-10-25) and its own previousArticle/nextArticle links, THIS article (hala-mi-evrim) is actually the FIRST of the trilogy, not the second. The note is out of date and self-contradicts the article's own series metadata.
  - Mobile: 'Üç Soru' HierarchyTree branch-label overlap (same systemic bug).
- İyileştirme önerileri:
  - Rewrite the closing criticalNote to correctly state this is essay 1 of 3 in the evolution trilogy and remove the 'henüz eklenmemiş' claim about evrim-dinsizligi-projesi, which is already live.
  - Apply the site-wide HierarchyTree mobile fix.

---

### `/tefekkur/iki-nedensellik`

**İçerik: 10/10** — Superb, entirely secular philosophy-of-science essay (retrospective vs. prospective causality, the market-pundit example, the tree/corridor/hall-of-doors metaphor). Sharp, well-argued, and sets up the next essay in the series perfectly. No religious content at all — purely conceptual/reflective, which fits the 'kavramsal' spirit of Tefekkür well.
- Görsellik notları: Clean rendering on desktop and mobile. hierarchyTree ('Ağaç') and contrastDuo both stack correctly on mobile in terms of layout, though see i18n bug below.
- Buglar:
  - I18N BUG: one contrastDuo block ('Retrospective ⇄ Prospective causality') has its Turkish bullets left completely untranslated — all six bullets have identical `tr` and `en` values (e.g. `"tr": "A walk down a corridor"`, `"tr": "The path is unique — but your story about it is not the path"`, `"tr": "Cheap: a path from leaf to trunk always exists"` and the three matching bullets on the right side). A Turkish reader sees English bullet text inside an otherwise fully-Turkish article — confirmed visually in the mobile screenshot.
  - Mobile: the 'Ağaç' HierarchyTree (only 2 branches, but with very long labels like '↑ Yapraktan gövdeye (geriye dönük)') still overlaps/overflows — confirms the bug isn't just a 3+-branch problem, it's any branch count with sufficiently long label text.
- İyileştirme önerileri:
  - Translate the six untranslated contrastDuo bullets into Turkish — this is the only piece in the entire audited batch with a clear gap in bilingual parity.
  - Apply the site-wide HierarchyTree mobile fix (needs to handle long labels, not just high branch counts).

---

### `/tefekkur/inception-hayatlar`

**İçerik: 8/10** — Creative, well-structured synthesis using the film Inception as a scaffold for nested-reality readings of dunya/akhira, with a genuinely careful criticalNote distinguishing this ishraqi/Sufi-flavored reading ('akhira = the other, a parallel dimension') from classical kalam's purely eschatological reading — good epistemic practice. Third essay of a series; delivers a clear, actionable close (inner detachment, not outward abandonment).
- Görsellik notları: Clean on both desktop and mobile — no hierarchyTree on this page (uses contrastDuo and flowChain instead), so it avoids the site's biggest mobile bug. No horizontal scroll detected.
- Buglar:
  - EN grammar bug: contrastDuo left-side description reads 'A deedless of intention remains here' — 'deedless of intention' doesn't parse as English (likely intended: 'A deed without intention remains here' or similar).
- İyileştirme önerileri:
  - Fix the 'deedless of intention' English phrasing.
  - Minor: the morphologyTable comparing luʿāb/lahwa etymology is a nice touch but slightly buried mid-article; could be pulled up closer to where 'laib'/'lehv' are first introduced in the Hadid 57:20 quote.

---

### `/tefekkur/kader`

**İçerik: 8/10** — Rich terminology essay (khalq/tesviye/qadar/hidaya) built on Al-A'la 87:1-3, with a clear progressive-resolution metaphor (the Baqarah cow example, quantum wave-function collapse) for how destiny narrows from broad to specific. Includes an explicit criticalNote flagging the quantum-wave-function / Constructor Theory synthesis as 'a contemporary essay' that classical kalam and tafsir do not use — appropriate hedging for a modern analogical reading.
- Görsellik notları: Clean rendering both viewports — flowChain (Tasarım→Takdir→Hidayet) and contrastDuo render well on mobile without issues; this page has no hierarchyTree block so it avoids that systemic bug. No horizontal scroll detected.
- İyileştirme önerileri:
  - The essay references 'the first essay of this series' (Local/Global Perspectives) by title only, without a link — since other pages use previousArticle/relatedTools for cross-navigation, consider adding that essay's slug to relatedTools or as an inline link for readers who want to follow the reference immediately.

---

### `/tefekkur/kaderin-cozunurlugu-devam`

**İçerik: 9/10** — Sequel to 'Terminoloji 7'; reframes destiny through information theory, emergent concepts and quantum wave-function collapse. Rigorous hedging throughout (computational irreducibility properly attributed to Wolfram; wave-function section explicitly says definiteness needs observer+system+environment, not overclaimed). Closing criticalNote cites hadith sources precisely and flags the continuation status honestly. Strong contrastDuo/hierarchyTree/flowChain usage to carry a genuinely abstract argument.
- Görsellik notları: Standard essay pattern renders cleanly desktop+mobile: TOC sidebar populates from headings, reading-progress bar, epistemic disclaimer box, all component types (hierarchyTree, flowChain, contrastDuo, pullQuote, criticalNote) render without breakage. previousArticle is a proper {slug,titleTr} object and its card renders correctly; nextArticle is null so no next-card shown (correct, no phantom empty box).
- İyileştirme önerileri:
  - relatedVerses is an empty array despite the topic (kader/computational limits) touching classic verse territory — could anchor with 1-2 verseInline citations for readers arriving without the prior article's context.
  - Consider a one-line 'read part 1 first' link near the top criticalNote in addition to the bottom prev-card, since the piece assumes the reader already has Terminoloji-7's setup.

---

### `/tefekkur/kainat-kuantum-1`

**İçerik: 8/10** — Pure physics exposition (measurement problem, decoherence, quantum gravity, entanglement/Bell, Wigner's Friend) framed as groundwork for a promised Quran-connected sequel. Well hedged: explicit criticalNotes distinguish 'why this is philosophical' from physics proper, and an editorial note clarifies the no-signalling clarification wasn't the author's own claim. No Quranic verses at all in this installment (by design — it's stated as scaffolding), which is fine for part 1 but means it reads as a general-science essay rather than tefekkür proper until the sequel lands.
- Görsellik notları: Clean rendering, both viewports. No previousArticle/nextArticle (both null) — correctly no broken nav cards shown here, unlike the rahmetin-grameri series.
- İyileştirme önerileri:
  - Since 'the total number of parts is not stated' per the article's own disclaimer, a short note on when/whether the sequel exists would help — right now it dead-ends with no nextArticle link even though the text promises a continuation.
  - Given zero Quranic content, the tldr/hook could set reader expectations more explicitly ('this essay is physics-only groundwork; verses arrive in part 2') to avoid disappointment for readers expecting Quran-linked reflection immediately.

---

### `/tefekkur/kaynak-yuzey`

**İçerik: 9.5/10** — One of the strongest pieces in the set: extends the muhkam/mutashabih Al-i Imran 3:7 distinction into a general 'trust in source vs trust in surface' diagnostic, applied to Uhud, academia, business, religion, and the cobra-effect/fossil-trade cases. Extremely well hedged — an explicit criticalNote flags the whole generalization as 'a contemporary reading, not classical tafsir usul' and says the classical hierarchy reading 'is not wrong, only enriched.' The Richelieu line is properly softened to 'is said to have remarked' rather than asserted as fact, consistent with the site's source-verification rule. 11 verses cited with full Arabic + Turkish/English notes.
- Görsellik notları: Verified clean on both desktop and mobile: hero, epistemic disclaimer, verseInline cards, contrastDuo, hierarchyTree, and closing attribution/related-tools all render correctly. TOC sidebar with 10 sections works.
- İyileştirme önerileri:
  - None significant — this page is close to a template example for the rest of the series.

---

### `/tefekkur/kuran-mesajina-yabanci-kalmak`

**İçerik: 8.5/10** — Root-tree template (K-N-N) tracing the Quranic imagery of hearts sealed/veiled against understanding across sura families (Alif-Lam-Ra, Ha-Mim, Alif-Lam-Mim, Alhamdulillah, Ta-Sin). Good structural insight ('they said' vs God's 'We placed') and a fair reading of the 'why not a written book / an angel' objection using 6:7-10. Closing note is honest about being Turkish-original with an English navigation translation.
- Görsellik notları: Root-tree hero renders correctly with canonicalUrl:null handled properly — no broken 'view on Medium' link or attribution footer shown (both are correctly suppressed since there's no canonical URL). Clean on mobile too.
- Buglar:
  - English criticalNote at the very end has a stray trailing artifact: '...canonical Qur'anic source.15.' — an apparent leftover reference/footnote marker not cleaned up (only visible when viewing the EN locale, not TR).
- İyileştirme önerileri:
  - relatedVerses array (8 refs) is noticeably smaller than the set of verses actually quoted in the body (includes 41:4, 6:7-10, 10:42, 30:52-53, 43:40 which aren't listed) — worth syncing if relatedVerses feeds any cross-linking/RAG feature.
  - The 'Bakara'nın Girişi' section paraphrases 2:6-15 in the author's own words without verseInline cards (unlike every other section which quotes Arabic) — a visual/format inconsistency within the same page.

---

### `/tefekkur/lehv`

**İçerik: 8.5/10** — Semantic-analysis series entry (2/5) on ل-ه-و, tracing concrete origin (mill-stopper, uvula) to abstract 'distraction'. Well-organized: hierarchy tree, 5 Quranic usages (47:36, 29:64, 102:1, 24:37, 21:3, 21:17), semantic field/opposites, and a dedicated Sources section citing Lane's Lexicon and al-Mufradat by name with quoted definitions — good attribution discipline.
- Görsellik notları: RootHero + SeriesTimeline (2/5) render correctly on desktop and mobile; previousArticle/nextArticle are proper objects (sefer / cennet-cin-mecnun) and render fine — confirms the broken-nav bug seen elsewhere is data-specific, not a template issue.
- İyileştirme önerileri:
  - The 'Kaynaklar' (Sources) section duplicates a lot of the same verse analysis already given earlier in the article nearly verbatim — could be tightened to avoid repetition fatigue in a 5-minute read.

---

### `/tefekkur/makro-mikro`

**İçerik: 7.5/10** — Terminoloji 5/7: maps complexity-science concepts (microstate/macrostate, aggregate vs emergent, phase transition) onto tesviye/takdir. Honest self-aware criticalNote: 'classical tafsir does not use emergence/phase-transition terminology... this is a contemporary reading-experiment, not verse tafsir.' Good discipline, but thinner than its neighbors — zero verseInline citations and an empty relatedVerses array, so the Quranic anchor is only two bare concept-words (tesviye, takdir) mentioned in passing rather than grounded in quoted ayat.
- Görsellik notları: Clean rendering; contrastDuo (Aggregate/Emergent) and hierarchyTree (four macrostate examples) display correctly. previousArticle/nextArticle are proper objects (Terminoloji 4 / Terminoloji 6) and their nav cards render with full titles — confirms the object format works correctly when used.
- İyileştirme önerileri:
  - Add at least one verseInline for tesviye/takdir (e.g. related to creation/design vocabulary) so the piece doesn't read as a standalone physics/complexity-science essay with a Quranic label bolted on at the end.
  - The 'Şekil-1' figure is described in prose ('mavi bölgeler mikro durumları temsil eder...') but no actual image/diagram is rendered on the page — the text refers to a visual that isn't present, which reads oddly to someone not familiar this was ported from a Medium post with an image.

---

### `/tefekkur/okuma-prensipleri-1`

**İçerik: 9/10** — First of a two-part methodology essay (5 epistemic principles: comprehensiveness, generalization, consistency, precision, modeling). Rich, concrete examples (Firavun/Melik, İblis/Şeytan, Medine/Yesrib, kavl/kelam, rain-word precision) with real Bediüzzaman quotes (attributed to Sözler, İşarat-ül-İ'caz with locations). Closing criticalNote explicitly situates the framework within the Nurcu tradition versus classical usul (Cessas, Ibn Teymiyye, Suyuti) and notes other schools may differ — excellent hedging discipline.
- Görsellik notları: Clean rendering both viewports; nextArticle object (okuma-prensipleri-2) renders correctly with full title.
- İyileştirme önerileri:
  - None significant.

---

### `/tefekkur/okuma-prensipleri-2`

**İçerik: 9.5/10** — Second half of the methodology series (4 hermeneutic principles: textual location, message vectoriality, semantic-structural web, murāqaba/muḥāsaba-sensed need). Best self-critique in the sample set: an explicit contrastDuo distinguishes the author's 'vectorial reading' from Christian 'trajectory hermeneutics' to preempt a likely misreading, and a criticalNote flags the 'no verse is truly abrogated' conclusion as a minority view that conflicts with the majority nāsikh-mansūkh position across madhhabs — textbook example of the site's own hedging rule in action.
- Görsellik notları: Long article (9 sections) renders cleanly; TOC works; previousArticle object (okuma-prensipleri-1) card renders correctly.
- İyileştirme önerileri:
  - None significant — strongest methodological rigor in the sample.

---

### `/tefekkur/rahmetin-grameri-1`

**İçerik: 8.5/10** — Opens a 5(-7)-part series asking why Baqara's cosmic register suddenly shifts into divorce/nursing/dower law; frames the detail as 'mercy rolled up its sleeves,' grounded in 2:26 (mosquito), 51:49 (pairs), 41:53 (āfāq/anfus). Clear methodological commitment ('every claim tied to a verse') stated up front. Good, accessible prose.
- Görsellik notları: Page otherwise renders cleanly (hero, verseInline cards, related tools, attribution footer all fine).
- Buglar:
  - BROKEN NEXT-ARTICLE LINK: nextArticle in the JSON is the bare string "rahmetin-grameri-2" instead of the {slug, titleTr} object every other article in the sample uses. The component reads article.nextArticle.slug/.titleTr, so this renders as an empty card with only the 'SONRAKİ →' label and no title text, linking to /tr/tefekkur/undefined (confirmed via DOM inspection and screenshot).
- İyileştirme önerileri:
  - Fix nextArticle (and check the rest of the 7-part rahmetin-grameri series, since 2 and 3 have the same bug in both previousArticle and nextArticle) to use the {slug, titleTr} object shape used everywhere else on the site.

---

### `/tefekkur/rahmetin-grameri-2`

**İçerik: 8.5/10** — Structural/maqāṣid lens on the same Baqara family-law block: precision-as-shield-for-the-vulnerable thesis, Durkheim/Weber sociology cross-reference, 'atomic theory of civilization' framing, and a real observation that the Quran's longest verse (2:282) is about debt-recording, not ritual. Good use of pull-quotes as recurring 'Kur'ânî içgörü' callouts.
- Görsellik notları: Confirmed broken on both desktop and mobile: both the 'Önceki' and 'Sonraki' cards render as empty boxes (label only, no title) and both link to /tr/tefekkur/undefined.
- Buglar:
  - Same systemic bug as rahmetin-grameri-1: previousArticle: "rahmetin-grameri-1" and nextArticle: "rahmetin-grameri-3" are bare strings, not {slug, titleTr} objects, so both the previous and next navigation cards render empty and point to a literal '/undefined' URL. Verified via Playwright on both viewports.
- İyileştirme önerileri:
  - Same fix needed as article 1 — convert previousArticle/nextArticle to object shape across the whole series.

---

### `/tefekkur/rahmetin-grameri-3`

**İçerik: 8.5/10** — Psychological/moral lens: shows every family-law clause is two-layered (measurable rule + closing spiritual seal, e.g. 2:231/2:233/2:237), develops iḥsān as the hardest ethical register to demand mid-divorce, and traces maʿrūf's semantic shift from tribal custom to divine standard via a properly cited Izutsu reference (with a real footnote block giving the 1959 original title) — good source discipline matching the site's attribution rule.
- Görsellik notları: Confirmed broken on desktop: both nav cards empty, both pointing to /tr/tefekkur/undefined. Footnote/source block renders as a distinct, well-styled box.
- Buglar:
  - Same systemic bug: previousArticle: "rahmetin-grameri-2" and nextArticle: "rahmetin-grameri-4" are bare strings rather than objects, producing two empty, broken nav cards.
- İyileştirme önerileri:
  - Same fix as articles 1-2. Given the pattern holds identically across all three checked entries, this is very likely a bug across the entire 7-part rahmetin-grameri series and should be fixed in the underlying JSON generation/build script, not per-file.

---

### `/tefekkur/rahmetin-grameri-4`

**İçerik: 8/10** — Nursian/theological lens on Baqara 2:233 (fadhlaka principle, micro-macro parity between a nursing-maintenance clause and cosmic Divine Names). Well-hedged as 'Nursî'nin merceğinden bakıyoruz' rather than an absolute claim; properly sourced Nursî quote (Yirmi Beşinci Söz) with footnote. Coherent, builds logically toward the series' backbone thesis, and explicitly teases the next essay. Assumes prior context from earlier entries in the 7-part series (opens with 'bir önceki yazıdaki vicdan mahkemesi').
- Görsellik notları: Renders cleanly on desktop and mobile: hero/eyebrow, TOC sidebar, verse blocks (KFGQPC Arabic + translation + 'Bakara 2:233' style reference badge, correctly using sûre name not bare numbers), pull quotes, section dividers, cross-tool CTA (Kavram Grafiği / Ayet Grafiği), sources/attribution footer all present and well-styled. Note for future audits: hierarchyTree/flowChain-style diagram blocks on this template use scroll-reveal (IntersectionObserver) animation — a naive full-page screenshot without incremental scrolling will falsely show them as empty; confirmed correct rendering once scrolled through normally.
- Buglar:
  - Broken 'Önceki' (previous-article) navigation box at the bottom of the page: it renders as an empty title with a link pointing to /tr/tefekkur/undefined. Root cause: rahmetin-grameri-4.json stores previousArticle as a plain string ("rahmetin-grameri-3") but TefekkurArticleRoute.jsx expects an object ({slug, titleTr}) and reads article.previousArticle.slug / .titleTr.
- İyileştirme önerileri:
  - Change previousArticle/nextArticle in rahmetin-grameri-4.json (and the rest of the series' JSON files) to the {slug, titleTr} object shape already used correctly by other series (e.g. sefer.json, sonsuzlugun-merdiveni.json) so the nav box shows a real title and a working link.

---

### `/tefekkur/rahmetin-grameri-5`

**İçerik: 8/10** — Akbari/esoteric reading of divorce/ʿidda/nursing/dower law as a 'cosmic hologram' of the soul's journey (ṭalāq=fanāʾ, ʿidda=barzakh, nursing=gnosis-transmission, dower=spiritual gifts). Consistently framed as 'İbn Arabî'nin okumasında/Ekberî bâtında' — an interpretive lens, not a literal tafsir claim — which is the right epistemic posture for this kind of esoteric reading. Genuinely well-sourced footnotes (Eric Winkel 2014 on Ibn ʿArabī's fiqh, Souad Hakim 2006, Stanford Encyclopedia of Philosophy).
- Görsellik notları: Clean rendering, verse blocks and pull quotes all correct, cross-tool CTA present. Same scroll-reveal caveat as other entries applies to diagram blocks (none of significant size here beyond the pull quotes/verse blocks, which render fine).
- Buglar:
  - Both 'Önceki' and 'Sonraki' navigation boxes at the bottom render empty (no title text) with links to /tr/tefekkur/undefined — previousArticle ("rahmetin-grameri-4") and nextArticle ("rahmetin-grameri-6") are stored as plain strings instead of the {slug, titleTr} object the render code expects.
- İyileştirme önerileri:
  - Same fix as grameri-4: convert previousArticle/nextArticle to object shape across the whole rahmetin-grameri series JSON files.

---

### `/tefekkur/rahmetin-grameri-6`

**İçerik: 8/10** — Synthesis lens combining the mosquito parable (2:26), sun/fly craft-parity (Nursî), and the cosmic 'law of pairs' (51:49, 36:36, 53:45, 30:21) into one argument. Strong, wide verse anchoring (7 verses) and a good closing footnote citing classical tafsirs (Ibn Kathīr, Mawdūdī) plus an honest aside comparing to yin-yang as 'an expression of the same reality' (kept as a light comparative note, not overclaimed). One unsourced statistic: the '~760,000 deaths/year from mosquitoes, ~100,000 from snakes' figures are stated as bare fact with no citation, inconsistent with the site's otherwise disciplined sourcing habit (e.g. Schubert 2005 elsewhere gets an explicit caveat).
- Görsellik notları: The contrastDuo 'Sivrisinek — Mikro / Güneş — Makro' card renders beautifully on both desktop and mobile (stacks correctly on mobile, accent colors and bullet lists intact). No layout issues found.
- Buglar:
  - Both 'Önceki' and 'Sonraki' navigation boxes render empty/broken (same previousArticle/nextArticle string-vs-object bug as the rest of the series) — links resolve to /tr/tefekkur/undefined with no title shown.
- İyileştirme önerileri:
  - Add a source citation or at least a rounded/approximate framing for the mosquito/snake death-toll statistic, consistent with how other numeric claims on the site (e.g. the 316 vs 191 root-count in ruhsal-cografya) get an explicit approximation caveat.
  - Fix the series-wide previousArticle/nextArticle data shape bug.

---

### `/tefekkur/rahmetin-grameri-7`

**İçerik: 8.5/10** — Strong series finale: synthesizes the five prior lenses (structural, psychological, Nursian, Akbarian, cosmic) under one unifying dynamic, takāmul (generative development/Rubūbiyya), then contrasts it with an 'ash' (corrupting/reducing) counter-dynamic, landing on 'family as the molecule of civilization.' Ambitious but well-organized, closes properly with '— Serinin Sonu —'. Good discipline throughout in framing insights as 'Kur'ânî içgörü' callouts rather than flat assertions.
- Görsellik notları: Renders cleanly; the contrastDuo 'Bahçe — Doğurgan Tekâmül / Kül — İfsad Eden İndirgeme' card and the closing verse block for 41:53 both display correctly on desktop and mobile.
- Buglar:
  - 'Önceki' navigation box at the bottom renders empty (previousArticle="rahmetin-grameri-6" stored as a string, not an object) — link goes to /tr/tefekkur/undefined. The 'Sonraki' box is correctly absent since nextArticle is null (last in series), so that half is not a bug.
- İyileştirme önerileri:
  - Fix previousArticle to the object shape so readers landing at the end of the series can still navigate back with a visible title.
  - Since this is the last entry, consider linking back to the series index or to a related standalone piece instead of leaving a dead-end 'Serinin Sonu' with a broken back-link.

---

### `/tefekkur/ruhsal-cografya`

**İçerik: 9/10** — Substantial (9 min) and well-organized essay on the istighnāʾ→ṭughyān→ṭāghūt pathology of spiritual straying, contrasted with hidāya/ṣirāṭ. Strong practical payoff: 'Beş Temel Dinamik' (modern manifestations) and 'Beş Pratik Prensip' (exit routes) ground the classical concept-map in contemporary life, which is exactly what a devotional/reflective piece should deliver on its premise. Good epistemic hygiene: the 316-vs-191 root-occurrence count is explicitly flagged as approximate/source-dependent rather than presented as precise. Personal framing ('Bu yazı nereden doğdu') adds authenticity without overclaiming.
- Görsellik notları: Long page (~9.8k px desktop / ~16.5k px mobile) renders fully and cleanly once scrolled through — flowChain ('Sapmanın üç aşaması') and two hierarchyTree blocks ('Takvânın anlam spektrumu', 'Beş temel dinamik') all populate correctly with their branch content. No prev/next boxes shown (correct, since this is a standalone piece with previousArticle/nextArticle both null).
- İyileştirme önerileri:
  - Consider linking to the companion piece it references ('Semantik Analizi-4: Tuğyan') as an inline CrossToolCTA-style link rather than only a prose mention in the closing critical note, to help readers actually navigate there.

---

### `/tefekkur/ruhun-termostati`

**İçerik: 9.5/10** — The strongest piece in this batch. Extremely well-developed central metaphor (sabr as active psychological homeostasis, not passive endurance), grounded in root etymology (ص-ب-ر = restrain, not wait), a rich chain of correctly-sourced Quranic verses and hadith (Muslim with book/number citations), and a genuinely useful practical section (anger/sadness protocols). The Frankl/neuroscience/concentration-camp material is explicitly and honestly caveated in a criticalNote as a 'modern translational layer' distinct from classical taṣawwuf's own vocabulary (nafs stations, aḥwāl/maqāmāt) — exactly the right epistemic move for this kind of cross-disciplinary synthesis. Delivers fully on its 14-minute-read premise.
- Görsellik notları: Very long page (~13k px desktop / ~22.7k px mobile) — renders correctly throughout when scrolled incrementally and spot-checked live at multiple scroll depths (confirmed via direct viewport screenshots, not just full-page capture). IMPORTANT TESTING CAVEAT: a naive Playwright full-page screenshot of this specific page produced a large false-positive blank void starting mid-page (content appeared to cut off inside a criticalNote box around the two-thirds mark, followed by ~6000px of empty space) both on a wheel-scrolled and a manually-stepped scroll pass. Live viewport screenshots at the same scroll offsets, and a DOM computed-style check (opacity:1, visibility:visible, normal position), confirmed the content actually renders fine for real users — this was purely a screenshot-stitching artifact tied to this page's unusual total height, not a product bug. Flagging this so it isn't miscounted as a rendering defect in any follow-up automated capture.
- İyileştirme önerileri:
  - None content/bug-wise — this page is in excellent shape. If anything, the length could eventually warrant a jump-to-section affordance beyond the desktop TOC sidebar (e.g. a sticky mobile section picker), given it's markedly longer than its siblings.

---

### `/tefekkur/sefer`

**İçerik: 8/10** — Solid semantic-root analysis of س-ف-ر (to uncover/travel/book), part 1 of a 5-part 'Semantik Analizi' series. Good cross-linguistic grounding (Akkadian šapārum, Aramaic/Hebrew cognates for scribe/book), clean Quranic usage survey (74:34, 80:38, 62:5, 2:184, 80:15-16), and a proper sources section (Lane's Lexicon, Rāghib al-Iṣfahānī's al-Mufradāt). Straightforward and well-scoped; doesn't overreach into speculative theological claims.
- Görsellik notları: root-tree template renders very well: the large Arabic root-letter hero card, hierarchyTree ('Anlam Ağacı') with three clean branches (görsel/mekânsal/bilgisel), contrastDuo ('Açığa Çıkarma ⇄ Örtme'), and flowChain all display correctly on desktop; mobile stacks cleanly. Progress indicator shows '1/5' correctly. Bottom nav correctly shows only a 'Sonraki →' box (previousArticle is null, correctly hidden) with the real title 'Kur'an Kavramları Semantik Analizi-2: Lehv' — confirms the nav component works fine when the JSON uses the expected object shape (unlike the rahmetin-grameri series).
- İyileştirme önerileri:
  - None significant; a short concluding synthesis paragraph (currently the piece ends at the sources list) could round off the essay the way the sema-isim/siccin pieces do with a closing pull quote.

---

### `/tefekkur/sema-isim`

**İçerik: 8.5/10** — Rich terminology piece linking ism (name) and samāʾ (sky/elevation) through the shared س-م-و root, tying it to Adam's naming of things (2:31) as a metaphor for human abstraction/categorization. Properly sourced Bediüzzaman quotes (Sözler, 31st and 20th Words) integrated as pull quotes rather than paraphrased into the author's own voice. Excellent epistemic discipline: an explicit criticalNote distinguishes the set-theory/category-theory/sheaf-theory analogies from probative tafsir evidence ('epistemik analoji, kanıt değil'), naming that classical tafsir (Rāzī, Zamakhsharī, Ibn Kathīr, Suyūṭī) doesn't use these modern concepts.
- Görsellik notları: Renders cleanly on desktop and mobile. The 'Sema · İsim · Arz · Tecellî — Analojik Eşleşmeler' hierarchyTree displays its full branch content (root 'Soyutlama ve Sınıflandırma' fanning out to 4 labeled cards with Arabic + transliteration + description) correctly once scrolled into view. Series progress bar (part 6/7) displays correctly, prev/next nav shows real titles for both directions.
- İyileştirme önerileri:
  - None significant — this is a well-executed template instance.

---

### `/tefekkur/siccin`

**İçerik: 8.5/10** — Engaging 'etymological detective story' structure across three layers (literal Arabic dungeon-sense, Semitic clay-tablet/scribal record, Hebrew-parallel geometric inversion with ʿIlliyyīn) resolving the mekân-vs-kitap paradox in Mutaffifīn 83:7-9. Properly flags its most speculative claim (the L/N ibdāl link between sijjīn and sicill) with an explicit criticalNote noting classical lexicographers (Sībawayh, al-Jawharī, Ibn Manẓūr) don't draw this connection — good epistemic hygiene for a fun but genuinely uncertain etymological hypothesis. Clean sources list at the end.
- Görsellik notları: root-tree template renders very well: hero root card, three verseInline blocks for 83:7-9, contrastDuo (Sijjīn ⇄ ʿIlliyyīn), flowChain (3 layers), and a second closing hierarchyTree ('Anlam Ağacı') all display correctly on desktop; mobile stacks cleanly with no overflow. Series progress '5/5' correct (last of the semantik-analizi series).
- İyileştirme önerileri:
  - None significant.

---

### `/tefekkur/sonsuz-nasil-bilinir`

**İçerik: 8.5/10** — Strong second entry in the 'recursive-idrak' series: frames the tanzīh-tashbīh balance through a clean X→∞ math analogy (X=100 fully known-but-bounded vs X∈ℤ vague vs X→∞ direction-known-but-unbounded), then reads 'Allāhu Akbar' as the linguistic formula of that directional cognition (comparison + transcendence). Good verse grounding (42:11, 29:45, 112:4) and an honest criticalNote distinguishing the Huxley/Wittgenstein/Aquinas/apophatic comparative synthesis from classical Islamic kalām's own bilā kayf vocabulary, explicitly noting the X→∞ analogy 'has no formal place in classical kalām.'
- Görsellik notları: Renders cleanly; the contrastDuo pairs (Absolute Unknowability ⇄ Directional Knowability; Comparison ⇄ Transcendence) and the hierarchyTree ('X'in Üç Bilgi Durumu') all display fully once scrolled through. Prev/next nav shows correct titles both directions ('İdrak 1: Sonsuzluğun Merdiveni' ← / → 'Inception Hayatlar'). Series progress '2/3' shown correctly despite seriesTotal not being an explicit field in this article's own JSON (presumably resolved from elsewhere) — not a defect, just worth noting for data-consistency purposes.
- İyileştirme önerileri:
  - None significant.

---

### `/tefekkur/sonsuzlugun-merdiveni`

**İçerik: 8/10** — Shorter (4 min) series-opener that sets up the embodied-cognition framework (Schubert 2005: social status perceived via physical-height brain regions) as a bridge into how humans reason about God analogically, then explicitly poses the anthropomorphism trap ('haritayı arazi zannetmek') and hands off cleanly to the sequel. Appropriately less dense than sonsuz-nasil-bilinir since it's the on-ramp; the single academic citation carries a proper criticalNote caveat about the post-replication-crisis contestedness of social-priming literature.
- Görsellik notları: Clean, shorter page, renders fully on both viewports. Series progress '1/3' displays correctly; 'Sonraki →' box shows the correct next title.
- İyileştirme önerileri:
  - None significant — appropriately scoped as a short series-opener.

---

### `/tefekkur/terminoloji-1-lokal-global`

**İçerik: 9/10** — Strong, tightly argued conceptual essay defining 'local' vs 'global' perspective as a reusable interpretive lens, then applying it to selfhood (ene), the problem of evil, and randomness. Claims are consistently hedged ('varsayabiliriz', 'olabilir', 'mümkün olmayabilir') rather than asserted as fact. Nicely distinguishes technical vs colloquial 'random'. Nursî citations are clearly sourced and marked as the author's own selection. Delivers well on its stated premise and closes with a clear hierarchy-tree recap.
- Görsellik notları: Renders cleanly on desktop and mobile: series timeline (1/7), sticky TOC with active-section highlighting, root-tree/contrastDuo/flowChain/hierarchyTree blocks all display correctly, disclaimer box and attribution footer intact. No layout issues found at either viewport.
- İyileştirme önerileri:
  - The 'yazıdaki şema' criticalNote explicitly says the original diagram was not carried over and the contrastDuo box substitutes for it — consider actually building the described circle+arrows diagram (per site's own 'Medium Görselliğini Yansıtma' rule in to_do_tefekkur.md) rather than settling for a substitute.
  - hierarchyTree at the end usefully teases the rest of the series (Terminoloji 5-7) but those slugs (e.g. makro-mikro) aren't in relatedTools/nextArticle beyond the immediate next — consider surfacing the full 7-part series list somewhere on the page.

---

### `/tefekkur/terminoloji-2-parcalanamaz-butunler`

**İçerik: 8/10** — Clear, well-scoped explainer on emergence vs irreducibility vs indivisibility (kull la yatajazza), using accessible everyday analogies (cake, soup) alongside Nursî citations. Appropriately hedged, no overclaiming. Slightly thinner than its siblings (5 min read) but achieves its narrow scope well and closes with a strong synthesis.
- Görsellik notları: Clean rendering at both viewports; hierarchyTree ('Aynı İlke, Dört Alan') and second hierarchyTree ('Bir Tencere Mercimek Çorbası') both display without issue; contrastDuo stacks correctly on mobile.
- İyileştirme önerileri:
  - Consider adding at least one Quranic verse reference directly (currently zero — relies entirely on Nursî citations), since the series' stated purpose is reading Qur'an-Cosmos-Human together; the criticalNote itself acknowledges 'bu yazı doğrudan ayet alıntılamaz' as if flagging a gap.

---

### `/tefekkur/terminoloji-3-fizikalizm`

**İçerik: 8/10** — Concise, focused critique of physicalism (quantum abstraction, emergence, abstract entities) that avoids straw-manning and ends on an appropriately open note ('we will treat this in more detail later') rather than a triumphant claim. Good use of flowChain to show physicalism's 'definition game' self-critique. Shortest article in the set (3 min) — more a bridge/teaser than a self-contained deep dive.
- Görsellik notları: Renders cleanly at both viewports. hierarchyTree, contrastDuo, and flowChain blocks all display correctly; series timeline shows 3/7 accurately.
- İyileştirme önerileri:
  - At 3 minutes this is the thinnest piece in the batch; could either be merged conceptually with part 4 or expanded — currently reads as a preamble more than a standalone essay.

---

### `/tefekkur/terminoloji-4-varliklarin-ayna-olusu`

**İçerik: 8/10** — Ambitious synthesis piece (meaning-priority-over-matter, syntax/semantics, Ash'ari atomism, space/time as relations) that stays appropriately speculative — ends with open questions rather than settled claims ('bu geçişin nasıl gerçekleştiği... çözülmesi gereken derin meselelerdir'). Good hedge density throughout. Closes by explicitly previewing the next essay's terminology, which works well as series scaffolding.
- Görsellik notları: Clean at both viewports; hierarchyTree ('Temsilin Katmanları'), contrastDuo (Sentaks/Semantik) all render correctly, no overflow.
- İyileştirme önerileri:
  - The nextArticle field points to 'makro-mikro' (Terminoloji 5) which is outside this audit's scope but exists on the site — good continuity; no action needed, just confirming the series chain isn't broken here.

---

### `/tefekkur/tugyan`

**İçerik: 9/10** — The richest piece in the batch: full etymological survey (cross-Semitic loanword theory), a 3-tier semantic hierarchy, a Quran-usage morphology table (~39 occurrences), a causal chain (istighna→tughyan→taghut), and a dedicated criticalNote explicitly flagging that the 'two taghuts (ENE & TABIAT)' framing is Risale-i Nur-specific rather than universal classical tafsir — exactly the kind of epistemic hedging the site's rules call for. Sources block cites al-Mufradat properly.
- Görsellik notları: Desktop rendering is excellent (root-tree hero, hierarchyTree, morphologyTable, flowChain, contrastDuo all display beautifully with correct TOC active-section tracking). Mobile has a real layout defect: the morphologyTable's fixed-width grid columns (minmax 120/140/180px) don't fit 390px width and are not wrapped in a horizontal-scroll container, causing the ENTIRE page body to scroll horizontally on mobile (measured scrollWidth 462px vs clientWidth 390px) — the verse-chip column is visibly clipped off the right edge of the screen.
- Buglar:
  - Mobile-only: MorphologyTable (src/components/tefekkur/MorphologyTable.jsx) causes horizontal page overflow at 390px viewport — grid columns use minmax(120px,...) minmax(140px,...) minmax(180px,...) with no overflow-x:auto wrapper, so the 'Ayet Örnekleri' column and its verse chips get clipped and the whole document scrolls sideways. Violates the site's own rule that wide tables must scroll inside their own container, not the page body.
- İyileştirme önerileri:
  - Give MorphologyTable a mobile breakpoint: either wrap the grid rows in overflow-x:auto with a min-width, or switch to a stacked card layout below ~640px (consistent with how ContrastDuo already stacks cleanly on mobile).
  - This is the only article in the batch using the morphologyTable block type, so the fix is localized and low-risk to ship.

---

### `/tefekkur/vicdan-evrensel-tercuman`

**İçerik: 8/10** — Engaging, well-structured piece on theoretical vs practical reason using the dragon-fruit/lychee translation metaphor, then bridging to Nursî's 'fourth proof' on conscience as isthmus between gayb and shehada. Good criticalNote clarifying divine anthropomorphic language is 'accommodation, not reduction.' One accuracy-adjacent concern: the Feynman quote ('if you can't explain it simply, you haven't understood it') is presented in a pullQuote with source simply 'Richard Feynman' — this quote is widely misattributed/unverified online, and the site's own §13.30 sourcing rule calls for hedged attribution ('attributed to') for exactly this kind of internet-famous but unverifiable quote; the tldr field does hedge it ('Feynman'a atfedilen') but the pullQuote block itself does not.
- Görsellik notları: Clean rendering at both viewports; no series-timeline shown (correct, since this article has no seriesNumber/seriesTotal — category is 'kavramsal'); contrastDuo and hierarchyTree blocks display correctly.
- İyileştirme önerileri:
  - Soften the pullQuote source attribution for the Feynman quote to 'attributed to Richard Feynman' (matching the tldr's own hedge) rather than a bare 'Richard Feynman', since this specific quote's provenance is not well documented.
  - Consider linking to the referenced sister article ('Kâinat Kitabının Kuantum Bölümü-1') mentioned in the closing criticalNote so readers can follow the cross-reference directly.

---

### `/tefekkur/yapilanlarin-suslu-gorulmesi`

**İçerik: 9/10** — Excellent, disciplined piece on tazyin (self-deception/rationalization) spanning individual, collective, and epistemic (echo-chamber) layers, with genuinely useful modern-life examples and practical questions ('Bu bana niçin mantıklı göründü?'). Notably self-critical criticalNote explicitly flags that the 'wasat = middle way only' reading is one of several classical options (Tabari/Razi/Qurtubi read it more broadly) and that the Umar prayer's isnad is disputed rather than asserting it as sound hadith — exactly the kind of nuance the site's rules ask for.
- Görsellik notları: Clean at both viewports; contrastDuo (Beyyine/Ihlas) stacks correctly on mobile with no overflow; verse blocks render properly with Arabic + translit + note.
- İyileştirme önerileri:
  - None significant — this is one of the strongest pieces in the batch both editorially and technically.

---

### `/tefekkur/yaratilis-hikayesi-1-giris`

**İçerik: 6/10** — Genuinely thin as a standalone piece (2 min read) — mostly meta/framing prose about the series' method and intentions rather than substantive exploration of Baqara 2:29-39 itself; only cites one verse reference (2:30) indirectly via relatedVerses without quoting it in the body. Reads more like a preface than an essay. The stated methodological commitment ('bilimsel bulguları destekleyici değil, açıklayıcı araç olarak kullanmak') is a good, appropriately humble framing, consistent with site rules against overclaiming scientific 'proof'.
- Görsellik notları: Clean rendering at both viewports; series timeline correctly shows 1/2; hierarchyTree and contrastDuo blocks display without issue.
- İyileştirme önerileri:
  - As an intro-only piece with almost no direct Quranic engagement, consider merging this into the opening of part 2 rather than keeping it as a separate thin article, or expand it with at least a short direct treatment of the anchor verses (2:29-30) to justify a standalone page.
  - readingMinutes: 2 is the shortest in the whole batch by a wide margin — worth a content-depth pass if the series continues.

---

### `/tefekkur/yaratilis-hikayesi-2-katmanli-yaratilis`

**İçerik: 9/10** — Ambitious, well-organized cosmology essay mapping Nur→Sama→Samawat through seven Sufi degrees of tenezzulat, with a nice linguistic observation (God addresses angels with 'I', humans with 'We') tied to specific verses (38:71 vs 23:12). The quantum-field-theory parallel is explicitly and correctly flagged in a criticalNote as 'the author's own analogical reading; classical Sufi literature does not use these modern concepts' — good epistemic hygiene, avoids the Bucaillism trap the site's rules warn about.
- Görsellik notları: Desktop and mobile both render the hierarchyTree, contrastDuo (Ene/Nahnu), and flowChain blocks correctly with proper TOC tracking; no layout overflow found.
- Buglar:
  - Final criticalNote's resolved 'tr' text ends with a garbled/broken sentence: '...Arapça metinler sitenin kanonik Kur'an kaynağından alınmıştır.15 uyarınca normalize edilmiştir.' — a stray '.15' fragment (apparent remnant of a stripped internal '§13.15' reference) breaks the sentence grammatically and is visibly rendered on the live page for both TR and EN ('...canonical Qur'anic source.15.' in English). Confirmed via source JSON (lines 412-413) and live screenshot at the page bottom. The article also carries unused 'tplTR'/'tplEN' fields with a correctly-written (but internally-referencing, §13.15-citing) version that ArticleRenderer's CriticalNote component never reads — so neither the template nor the live text is actually correct/clean.
- İyileştirme önerileri:
  - Fix the corrupted closing criticalNote sentence directly in yaratilis-hikayesi-2-katmanli-yaratilis.json (both 'tr' and 'en' fields) to read cleanly without any numeric/section-reference fragment, e.g. 'Arapça metinler sitenin kanonik Kur'an kaynağından alınıp mushaf imlâsına göre normalize edilmiştir.' — matching the reader-facing phrasing pattern used correctly in other articles' criticalNotes.
  - Since 'tplTR'/'tplEN' fields exist across multiple articles in this batch but are never consumed by the CriticalNote component (only 'tr'/'en' are), consider either wiring them in (if a '{{seri}}' templating pass was intended) or removing the dead fields to avoid future edits being made to the wrong field.

---
