# 🎯 QURANCODEX — AÇIK İŞLER

> Bu dosyada **yalnızca yapılacaklar** durur. Tamamlananlar 13 Ağustos 2026
> akşamı silindi — kayıtları commit mesajlarında (`11c61b2..81fc1d1`, 40 commit).
> Yarım kalanlar ve emin olmadıklarım **kaldı** ve öyle işaretli.
>
> Sayfa-sayfa denetim ve **74 rotanın rota-rota açık bulguları**:
> **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)** → §7
>
> ⚠ **Aşağıdaki puan tablosu YALNIZ ANASAYFA içindir (78/100).**
> **Uygulama geneli: 74 → 82/100** (13 Ağustos gecesi, düzeltmelerden sonra) →
> bkz. **Z2** (eksen tablosu) ve **Z3** (bulgular).

**Kullanıcının 14 Ağustos'ta kuyruğa aldığı iki ayrı iş:**
- [ ] **CLAUDE.md gözden geçirme** — bugün (kontrast K1-K6, CLS, K4) ve
      bundan sonra todo'da yapılacaklar dikkate alınarak, yeni bir sayfa/
      konu üretilirken nelere dikkat edilmesi gerektiğine dair bir
      kontrol listesi/kriter bölümü eklenmeli — aynı hataların (isMobile
      SSR kalıbının CLS'e yol açması, kategori renginin AA'yı geçmemesi,
      iç mimari sızıntısı, vb.) yeniden yaşanmaması için.
- [x] **Mobilde hissedilen yavaşlık** — 14 Ağustos gecesi incelendi, GERÇEK
      ve ciddi bir kök sebep bulundu: `/graf/ayet` (Ayet Haritası) TBT'si
      **~4.7 saniye** (masaüstü, throttle'sız). Kısmi düzeltme yapıldı
      (paylaşılan geometry/material), TAM çözüm (GPU instancing) daha büyük
      bir iş — bkz. aşağıdaki "VerseGraph TBT" notu. Kalan kısım ayrı bir
      kullanıcı onayı gerektirir.

---

## 📊 MEVCUT DURUM — **78/100** (13 Ağustos 2026 gecesi, düzeltmelerden sonra)

> Gün içindeki seyir: **76 → 73 → 78.**
> 76'yı GPT bölümleri bilinmezken vermiştim. Ölçünce 73'e düştü (5 hata).
> Beşi de düzeltildi ve bir bulgunun **yanlış** olduğu ortaya çıktı → 78.

| Eksen | Sabah | Ölçüm sonrası | **Şimdi** | Kalan |
|---|---:|---:|---:|---|
| Erişilebilirlik | 68 | 58 | **76** ▲ | Kontrast **hâlâ ölçülmedi** · 2 svg etiketsiz |
| Tutarlılık | 74 | 72 | **76** ▲ | 184 token dışı renk (diğer sayfalar) · "Tefekkür ↔ Reflections" |
| Teknik | 82 | 80 | **82** | ⚠ LCP/CLS **hâlâ ölçülmedi** — bu notun temeli eksik |
| İçerik | 76 | 76 | **76** | Özet yok — 18–24 ekran kaydırmadan sitede ne olduğu anlaşılmıyor |
| Bilgi mimarisi | 80 | 80 | **80** | Rafta 15 bölüm · adlar SixGates kapı adlarıyla örtüşmüyor |
| Görsel tasarım | 72 | 72 | **72** | Tek düzen fikri tekrarlanıyor · hiç görsel yok |
| Editoryal dürüstlük | 85 | 85 | **85** | "Sıfır Varyasyon" kayıtsız şartsız duruyor |

**Neden 90 değil:** erişilebilirlikte kontrast **hiç ölçülmedi** ve teknikte
LCP/CLS **hiç ölçülmedi**. İki eksen de kısmen bilinmeyen üstünde duruyor.
Görsel tasarım 72'de çünkü asıl sorun (tek kompozisyon fikri, hiç görsel yok)
kod değil **tasarım kararı** gerektiriyor ve o karar verilmedi.

Ölçüm: 3 genişlik × 2 dil = 6 koşu + 8 dilim ekran görüntüsü gözle incelendi
+ GPT-5.4 bölümleri (L,N,O,P,S,T,V,Y) ayrı tur + düzeltme sonrası doğrulama turu.
Tekrarla: `npx playwright test tests/homepage-audit.spec.js`

---

## ✅ 13 AĞUSTOS'TA KAPANANLAR (özet — ayrıntı commit mesajlarında)

`11c61b2..84e88c2` · **50 commit**

| | |
|---|---|
| P4 · P5 | 14 anlatı kartı → tek sunucu bileşeni + üç kademeli ritim. 14 hydration adası → 1. Sayfa −25% |
| P6 | Anasayfada ham hex **15 → 0**. Tefekkür kategori paletindeki iki altın / iki mor çakışması çözüldü |
| P7 | 19 `<h2>` → 11. Başlık seviyesi kademeyi izliyor. CLAUDE.md §4 ↔ tokens sapma koruması |
| Gezinme | Yüzen `ScrollToTopFab` kaldırıldı, "başa dön" rafın içine alındı. Breakpoint başına tek kalıcı öge |
| Erişilebilirlik | Skip link odağı `<main>`'e taşıyor · gizli rafın 16 düğmesi klavyeden çıktı · mega-menü `Escape` ile kapanıyor · `/en` artık `lang="en"` ile **sunuluyor** (iki kök layout) · 26 svg etiketlendi |
| Ölçüm altyapısı | `scripts/measure-vitals.mjs` (LCP/CLS/TBT + kontrast, üretim build'i) · `tests/page-audit.spec.js` (16 kontrol × 3 genişlik × 2 dil) |
| CWV | **Dört eşiğin dördü de geçildi** — LCP 2.220ms mobil (CPU ×4), CLS 0.008 |
| Kontrast | Kesin AA ihlali **2 → 0**. Suçlu token değil **opacity**'ymiş: silver ≥.75, gold ≥.70 |
| Kanıt bölümü | Fâtiha halka kompozisyonu statik SVG + dört adımlı çerçeve (sonuncusu "neden kesin kanıt değil") |
| Hero | Âyet üzerindeki glow'lar ve nabız kaldırıldı; ışık süpürmesi yerine **yazılma açılışı** |
| 74 sayfa | Hepsi tarandı. `/arac/retorik` çöküyordu — kurtarıldı. Navbar örtüşmesi **450 → 0** |
| `/oku` | Logodaki literal boşluk · gece modunda kilitli kullanıcılar (`SETTINGS_VERSION` 3→4) |

---

## ✅ 14 AĞUSTOS'TA EK KAPANANLAR (plansız, canlı kullanıcı raporu)

> Bu ikisi önceden todo'da madde olarak yoktu — kullanıcı ekran görüntüsüyle
> canlıda yakaladı, aynı oturumda kapatıldı.

- [x] **53. tefekkür makalesi — `morphologyTable` boş görünüyordu** — **KAPANDI** `0bfe356`
      Şema uydurulmuştu (`columnsTr`/`cellsTr`), gerçek şema `rows: [{ar,
      patternTr, meaningTr, verses}]`. Beş fiilin Arapça kalıpları da hafızadan
      yazılmıştı (§13.15 ihlali) — ilgili âyetlerin gerçek metninden
      diacritic-duyarsız eşleşmeyle çekilerek düzeltildi.
- [x] **İç mimari sızıntısı — 2. kez, kökten kapatıldı** — **KAPANDI** `0bfe356`
      Aynı makalenin kaynakçasında `CLAUDE.md`, `§13.15`, dosya yolu, fonksiyon
      adı yayındaydı. 74 rota + 53 tefekkür makalesinin TAMAMI render edilmiş
      DOM üzerinden tarandı, 0 sızıntı doğrulandı. Kalıcı kural: **CLAUDE.md
      §13.27** + `scripts/audit-internal-leak.mjs --ci`, pre-merge-review
      skill'ine 4b-2 olarak eklendi (her push'tan önce zorunlu).
- [x] **`/sor` — kota mesajı + Hûd 11:24 ayet sonunda daire (U+06DF)** — **KAPANDI** `e992d9e`
      Degrade mesajı sistem iç mekaniğini gösteriyordu, kişisel/site geneli
      kota ayrımı yoktu → iki ayrı, kullanıcı diline çevrilmiş metin. Daire
      hatası: `concierge-hydrate.js`'in kendi `normalizeArabic` kopyası
      U+06DF–U+06ED aralığını içermiyordu; kopya silindi, `lib/arabic.js`'ten
      import ediliyor (§13.15 tek-kaynak ilkesi).
- [x] **B1/B3/B4/B5 — görsel tasarım, mockup turu onaylandıktan sonra uygulandı**
      Beş statik mockup (Artifact) önce onaya sunuldu, sonra koda geçirildi:
      - **B1a** — `bilimsel-card` artık `ScienceTimelineCard` — ortalı/altın
        çerçeveli panel yerine kronolojik zaman çizelgesi (4 keşif, 4 âyet).
        Âyetler `data/scienceTimeline.js`'te mekanik çekilip
        `cleanArabicForDisplay` ile doğrulandı (§13.15).
      - **B1b/B4** — `tarih-card` + `koruma-card` artık `EditorialCard` —
        sola dayalı, asılı sûre numarası, dergi düzeni. 2'li `CompactRow`
        ızgarasından çıkıp tam genişliğe alındı (dar sütunda çalışmıyordu).
        Karar: kanıt/analiz kümesi sola dayalı, devotional küme ortalı kalır.
      - **B3** — `PortalCard`'da `feature` kademesi artık `medium`'dan
        gerçekten farklı bir tipografik ölçek kullanıyor (clamp 2.2–3.4rem,
        önceden ikisi de 1.7–2.6rem'di). Yalnız 2 kalan feature kartını
        etkiler (`mukattaa-card`, `allah-kendini-tanitir`).
      - **B5** — `InventoryStrip` (yeni bölüm), Hero altındaki ~200px amaçsız
        boşluğun yerine: 62 araç · 53 tefekkür yazısı · 6.236 âyet. Sayılar
        ölçüldü (`toolCatalog.js`, `tefekkur/_index.json`, `verse-graph`).
      Doğrulama: build temiz, lint temiz (yeni dosyalarda 0), TR/EN + masaüstü/
      mobil Playwright ile görsel + metin doğrulandı, 0 konsol hatası,
      `homepage-card-text.spec.js` baseline'ı BİLEREK güncellendi (içerik
      kasıtlı değişti — âyet metinleri birebir korundu, yalnız yerleşim
      değişti), `homepage-audit.spec.js` 3/3 geçti.
      ⚠ Sayfa uzunluğu maliyeti: masaüstü 17.872 → **19.186px** (+1.314px) —
      B0d'nin aynı bilinçli tercihi: iki kartı 2'li ızgaradan tam genişliğe
      çıkarmak okunabilirliği artırdı ama sayfa uzadı. Karar onaylıydı, gizli
      değil.

- [x] **B-takip · Kullanıcı canlı incelemesinden 7 ince ayar** — kicker'dan
      "eleştirel notlarla" çıktı (gövdede zaten vardı, tekrar) · hover
      1.005→1.015 (1024/1440'ta çakışma yok, ölçüldü) · timeline âyetleri
      1.3→1.45rem, editoryal kart âyetleri 1.5→1.65rem (taşma yok, ölçüldü) ·
      `ProofSection`'da eksen (D) âyeti artık altın renkli (etiket ve şemayla
      tutarlı) · adım 4'ün üst kenarlığı kalınlaştırıldı + fazladan boşlukla
      ayrıldı (2x2 ızgarada kapatılıyor, ölçüldü).

- [x] **Fâtiha halka kompozisyonu — YANLIŞ ATIF, 3 dosyada düzeltildi**
      Kullanıcı ekran görüntüsünde "1:4 nerede?" diye sordu — araştırınca
      ciddi bir hata çıktı. Hakemli bir kitap eleştirisi (Ersin Kabakcı,
      Hitit Üniv. SBE Dergisi, 2018) doğruluyor: *"Farrin does not count the
      invocation (basmala) as a verse for it does not contribute the
      structure of the sura"* (Farrin 2014, s.3). Sitenin **üç ayrı**
      implementasyonu da Besmele'yi "A" pozisyonuna koyuyordu ve 1:4'ü
      ("Mâliki yevmi'd-dîn") hiç göstermiyordu — atfedilen kaynakla
      doğrudan çelişiyordu. Ayrıca `HiddenArchitecture.jsx` eksen olarak
      **1:4** derken `ProofSection`/`RingExtensions` **1:5** diyordu — aynı
      tool sayfasında yan yana iki çelişkili iddia.
      Düzeltilen: `data/fatihaRing.js`, `sections/ProofSection.jsx`,
      `sections/HiddenArchitecture.jsx`, `components/RingExtensions.jsx`.
      Yeni yapı: Besmele halkadan çıkarıldı, 1:4 doğru yerine eklendi
      (C pozisyonu, C'=1:6 ile eşleşiyor), eksen 1:5'te sabitlendi (üç
      dosyada tutarlı). `RingExtensions.jsx`'teki kaynağı doğrulanamayan
      alıntı ("Farrin buna 'prelude to the pivot' der") silindi — hiçbir
      aramada bu ifadeye rastlanmadı.
      **Atıf da yumuşatıldı** — kullanıcının isteğiyle: bu şema artık
      "Farrin'in TAM yapısının kopyası" değil, "sitenin kendi düzenlemesi,
      Farrin'in yönteminden esinlenilmiş" diye tanımlanıyor; Cuypers, Islahi
      ve klasik müfessirler (el-Bikâî, Süyûtî, Râzî) de metinde anılıyor —
      tek âlime atıf yapılmıyor. Gerçek Farrin yapısı daha ayrıntılı (Besmele
      hariç iki ayrı ayna + 10 alt-pozisyon) — sitenin tek-V'lik sade
      diyagramına birebir oturmuyor; bu bilinçli bir basitleştirme olarak
      metinde açıkça belirtiliyor, "budur" denmiyor.
      Doğrulama: TR/EN + masaüstü/mobil, 0 konsol hatası, iki sayfada
      (anasayfa + `/arac/halka-kompozisyon`) tutarlı.

---

# 🔴 A — ERİŞİLEBİLİRLİK (68 → en yüksek kazanç burada)

- [x] ~~**A1 · 25 Arapça öge `aria-label` taşımıyor**~~ — **BULGU YANLIŞTI, geri alındı**
      Ölçtüm: **26 ögenin 26'sında da `lang="ar"` VE `dir="rtl"` var.** Bu zaten
      standardın istediği işaretleme; ekran okuyucu `lang="ar"` görünce Arapça
      sesine geçer.
      `aria-label` eklemek **içeriği EZER** — ekran okuyucu âyeti değil etiketi
      okur. Yani "düzeltme" kör kullanıcıdan Kur'an metnini almak olurdu.
      `pre-merge-review` skill'i de bunu FAIL değil **WARN — kullanıcı takdiri**
      diye listeliyor. Mevcut işaretleme doğru; **değişiklik yapılmadı.**
      > Bu, sabah yazdığım "ölçmeden konuşma" kuralına ikinci kez takılmam.
      > "25 öge etiketsiz" doğru bir sayıydı ama **yanlış bir sonuç** çıkardım.

- [x] **A2 · Kontrast ÖLÇÜLDÜ ve düzeltildi** → `tests/lib/contrast.mjs`
      **Teşhisim yanlıştı: token'da sorun yok.** `COLORS.silver` (#94a3b8)
      cosmic-black üstünde **7.65** — AA'yı rahat geçiyor. Suçlu **opacity**.
      Ölçülen eşikler (cosmic-black zemin):
      | renk | AA (4.5) için gereken en düşük opaklık |
      |---|---|
      | silver `#94a3b8` | **0.75** (`bf`) — .70'te 4.23 ile kalıyor |
      | gold `#d4a574` | **0.70** (`b3`) — .667'de 4.26 ile kalıyor |
      Düzeltilenler: `Hero` açıklama satırı (.55 → .78) · `Hero` âyet referansı
      (.65 → .78) · `PortalCard` âyet referansı (.70 → .75) · `ProofSection`
      4 alfa · `EsmaTeaser` "N geçiş" (`aa` → `bf`).
      **Sonuç: kesin ihlal 2 → 0**, "yaklaşık" 24 → 1.
      Kalan 1 bilinen yanlış pozitif: "ÖNE ÇIKAN" rozeti — altın gradyan
      üstünde koyu metin, yani zaten YÜKSEK kontrast; probe gradyanı tek renkle
      temsil edemediği için `ratio 1` diyor.

- [x] **A3 · Klavye gezintisi test edildi** — skip link, tab sırası, gizli raf,
      `Escape` ve focus trap (A4) ölçüldü ve düzeltildi (bkz. G bölümü).
      Panellerde `role` yok (disclosure kalıbı bilinçli tercih).
- [x] ~~**A4 · Mega-menüde focus trap**~~ — **KAPANDI** (14 Ağustos)
      Üç mega-menü (Keşfet/Araçlar/Tefekkür) panel'ine ref eklendi, ortak bir
      Tab-trap efekti yazıldı: son ögeden `Tab` ilk ögeye, ilk ögeden
      `Shift+Tab` son ögeye sarıyor. `Escape` davranışı (kapat + odağı
      tetikleyiciye döndür) dokunulmadı, hâlâ çalışıyor. Doğrulama: Keşfet
      panelinde 28 odaklanabilir öge, ileri/geri sarma ve Escape sonrası
      odak canlı test edildi, 0 konsol hatası.

---

# 🟠 B — GÖRSEL TASARIM (72) — **HEDEF: 90** ⭐

> **Kullanıcı 13 Ağustos'ta açıkça istedi:** *"görsel tasarımda en az 90
> olmasını çok isterdim sitenin."*
>
> **Dürüst değerlendirmem: 72 → 90 düzeltme işi DEĞİL, tasarım kararı işi.**
> Bugün kapatılanların hepsi (ritim, renk, kontrast, kanıt bölümü) toplamda
> notu 72'de bıraktı — çünkü asıl sorun bunların hiçbiri değil.
>
> Asıl sorun: **sayfa hâlâ tek bir kompozisyon fikrini tekrarlıyor.** Ortalanmış
> kart + altın kenar + radyal parıltı. P4 ritmi ÖLÇEĞİ kademelendirdi,
> KOMPOZİSYONU değil. Kanıt bölümü o duvarda ilk gedik oldu (ilk kez farklı
> bir şey yapan bir bölüm) ama tek başına yeterli değil.
>
> GPT-5.4'ün uyarısı kayda değer: *"eksik olan foto/illüstrasyon değil,
> **epistemik arayüz**. Bunu 'şık motion' diye çözersen teşhis doğru, çözüm
> yanlış olur."* Bu yüzden Hero'ya animasyon EKLENMEDİ.
>
> **90'a giden yol (tahmini sıra):**
> 1. B1 — en az iki kart tipi farklı bir kompozisyon alsın (asimetrik /
>    tam genişlik diyagram / sola dayalı editoryal blok)
> 2. B2b — kanıt bölümünün ikinci örneği (başka bir araç, başka bir kompozisyon)
> 3. B3 — tipografik dinamik aralık (feature ile compact arasındaki fark)
> 4. B4/B5 — hizalama ve boşluk temizliği
>
> ⚠ **Her biri statik mockup ile başlamalı.** Kod yazmadan önce görsel karar.
> Bu maddeler benim tek başıma kapatabileceğim işler değil.

## ✅ Bu turda yapıldı — GPT-5.4 tasarım hakem turu sonrası

- [x] **B0 · "Kanıt bölümü" eklendi** → `src/sections/ProofSection.jsx`
      Teşhis: site "görünmeyen mimariyi görünür kılıyoruz" diyordu ama
      anasayfada **tek bir görselleştirme yoktu** — halka kompozisyonunu
      anlatıyor, hiç göstermiyordu. GPT bunu "tek hamle seçmek zorunda olsan
      bu" diye işaretledi.
      Yapılan: Fâtiha'nın A-B-C-D-C'-B'-A' yapısı **statik SVG** olarak, 7
      âyetin gerçek Arapçasıyla + **dört adımlı** editoryal çerçeve:
      örüntü ne → metinde nerede → neden anlamlı olabilir → **neden kesin
      kanıt değil.** Dördüncüsü bu bölümün varlık şartı; CSS'te bile ayrı
      kenarlıkla işaretli.
      §13.15: Arapça `verse-graph`ten mekanik çekildi + `cleanArabicForDisplay`.
      ⚠ İlk denemede normalizasyonu atlamıştım, ekranda **◉ tofu kutuları**
      çıktı — ekran görüntüsüne bakınca görüldü.

- [x] **B0b · Âyet metnindeki dekoratif efektler kaldırıldı**
      GPT'nin en sert uyarısı: *"Ayetin kendisini efekt nesnesi yapmak en
      riskli olanı; glow/particle/reveal efektleri kutsal metni ucuzlaştırır."*
      Kaldırılanlar: `PortalCard` âyet glow'u · `Hero` çıpa âyeti glow'u ·
      **`Hero` besmelesinin 2,2 sn'lik NABZI** (parlayıp sönme) ·
      `Conclusion` kapanış âyetinin çift katmanlı glow'u.
      Ölçüm: âyet ögelerinde `textShadow` **4 → 0**.

- [x] **B0c · Işık süpürmesi YAZILMA AÇILIŞI ile değiştirildi**
      Kullanıcının şartı: *"daha iyi bir efekt koyacaksan kaldır, yoksa kalsın."*
      Öncesi: besmelenin ÜZERİNDEN geçen `mixBlendMode: screen` parlaklık bandı.
      Kodun kendi yorumu "kalem ucundan harf doğar hissi" diyordu ama yaptığı
      iş bu değildi — harfler zaten oradaydı, üstlerinden parıltı geçiyordu.
      **Niyet "yazı", çıktı "parıltı".** Üzerinden geçen shimmer ayrıca yükleme
      iskeletlerinin ve parlayan CTA butonlarının deyimi.
      Şimdi: glyph'in KENDİSİ sağdan sola beliriyor (CSS maskesi) — Arapçanın
      yazılma yönü. Metnin üstüne yeni ışık kaynağı eklenmiyor, metin var oluyor.
      Hemen altındaki Alak 96:1 zaten harf harf beliriyordu; ikisi artık aynı
      şeyi söylüyor: **metin yazılıyor.**
      ⚠ İlk maske matematiğim YANLIŞTI — %25 ve %50'de glyph zaten tamamen
      görünüyordu. Kare kare ekran görüntüsü almasam fark etmeyecektim.
      Düzeltildi: `mask-size 300%`, geçiş %33→%67. Doğrulandı:
      pos 0 → tamamen gizli · pos 50 → sağ yarı görünür · pos 100 → tam.

- [ ] **B0d · Sayfa uzunluğu maliyeti** — kanıt bölümü mobilde **+2.400px**
      getirdi: 19.669 → **22.092px**. Masaüstü 15.988 → 17.872px.
      GPT: *"uzunluk tek başına problem değil, tekrarlanan argüman uzunluğu
      problem."* Bu bölüm tekrar değil — sayfanın eksik olan tek parçası.
      Yine de karar senin: kabul mü, yoksa başka yerden kısaltma mı?

## Kalan

- [x] ~~**B1 · Sayfa tek bir düzen fikrini tekrarlıyor**~~ — **KAPANDI** (14 Ağustos)
      Statik mockup önce onaya sunuldu, sonra 2 karta uygulandı:
      `bilimsel-card` → zaman çizelgesi, `tarih-card`+`koruma-card` → sola
      dayalı editoryal blok. Ayrıntı: bkz. "14 AĞUSTOS'TA EK KAPANANLAR".
      *Aşağıdaki özgün bulgu kaydı arşiv olarak duruyor:*
      Ortalanmış kart + altın kenar + radyal parıltı — 14 kartın 14'ünde aynı.
      P4 ritmi ölçeği kademelendirdi ama **kompozisyonu** değil.

- [x] ~~**B2 · Sayfada hiç görsel yok**~~ — **B0 ile karşılandı.** Sayfada artık
      bir diyagram var ve o diyagram sitenin tezini gösteriyor.
      ⚠ GPT'nin uyarısı kayda geçsin: *"eksik olan foto/illüstrasyon değil,
      **epistemik arayüz** — iddiayı denetlenebilir şekilde gösteren yapı.
      Bunu 'şık motion' diye çözersen teşhis doğru, çözüm yanlış olur."*
      Bu yüzden Hero'ya animasyon **eklenmedi**; GPT onu "en riskli madde"
      olarak işaretledi (dini metinde açılışı motion ile yapmak güveni azaltır).

- [x] ~~**B3 · Her şey aynı kontrast değerinde**~~ — **KAPANDI** (14 Ağustos)
      `PortalCard`'da `feature` artık `medium`'dan gerçekten farklı bir
      tipografik ölçek kullanıyor (clamp 2.2–3.4rem vs 1.7–2.6rem). Yalnız
      2 kalan feature kartını etkiler.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `feature` kademesi `medium`'dan yalnız dolgu ile ayrılıyordu; tipografik
      ölçek aynıydı.

- [x] ~~**B4 · `TefekkurHighlight` sola dayalı, sayfadaki her şey ortalanmış**~~ — **KAPANDI** (14 Ağustos)
      Karar verildi: rastgele değil, kümeye göre. Kanıt/analiz kümesi
      (`tarih-card`, `koruma-card`) artık `EditorialCard` ile sola dayalı;
      devotional/anlatı kümesi (mukattaa, dua, halka) ortalı kalıyor —
      `TefekkurHighlight` artık istisna değil, ikinci bir dilin parçası.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      Ölçüldü: metin çakışması **yok** (0 çakışma, 1280 ve 1440'ta) ama hiza
      kırılıyordu.

- [x] ~~**B5 · Hero altında ~200px boş bant**~~ — **KAPANDI** (14 Ağustos)
      `InventoryStrip` eklendi: 62 araç · 53 tefekkür yazısı · 6.236 âyet.
      Aynı zamanda D1'i kısmen karşılıyor (ziyaretçi kaydırmadan kapsamı görür).

---

# 🟡 C — TUTARLILIK (74)

- [ ] **C1 · "Tefekkür" ↔ "Reflections" çelişkisi**
      `TefekkurHighlight.jsx:230` → `{language === 'tr' ? 'Tefekkür' : 'Tefekkür'}`
      Bu **bilinçli** bir no-op ternary: "Tefekkür" iki dilde de özel ad sayılmış.
      Ama navbar İngilizcede **"Reflections"** diyor. İkisi de karar, ikisi çelişiyor.
      **Tek ada karar ver, iki yeri de ona göre düzelt.**

- [ ] **C2 · Site genelinde 184 token dışı renk** (anasayfa temiz, gerisi değil)
      **Göç işinin kendisi diğer sayfalara ait** → `sayfa_denetim_kontrol_listesi.md` §3.7.
      Burada duran şey yalnız **karar**:

      ⚠ **Önce karar, sonra göç — kullanıcı 13 Ağustos'ta şunu söyledi:**
      *"çok renkli olunması gereken yerler olduğuna katılıyorsan da kalsın"*
      Katılıyorum. Graf/atlas sayfalarındaki **veri paleti** UI paletiyle aynı
      kurala tabi olmamalı; bir tasarım sistemi UI rengi ile veri rengini ayrı
      yönetir (Carbon, Radix, Tailwind hepsi böyle yapar).
      - [ ] `tokens.js`'e **`VIZ` / veri paleti katmanı** ekle — kaç renk, hangi
            sırayla, renk körlüğünde ayrışıyor mu
      - [ ] `audit-colors.mjs` veri görselleştirme dosyalarını ayrı raporlasın
            (yasak değil, **adlandırılmamış** olması sorun)
      - [ ] §13.25'e "veri paleti" maddesi ekle
      - [ ] Ancak bundan sonra kalan gerçek kaçakları temizle

---

# 🟢 D — İÇERİK (76)

- [ ] **D1 · Sayfada özet yok** — ziyaretçi 18–24 ekran kaydırmadan sitede ne
      olduğunu öğrenemiyor. `SixGates` kapıları veriyor ama **envanteri** vermiyor
      (56 araç, 52 makale, 6.236 âyet). Hero'daki tek satır bunu taşıyamıyor.

- [ ] **D2 · 8 compact kart açıklama paragrafını kaybetti** (P4 kararı).
      Ritim kazandı, derinlik kaybetti. Bir tur sonra bakılmalı: bu kartların
      tıklanma oranı düştü mü? Düştüyse `kicker` metinleri güçlendirilmeli.
      *(Yarım karar — bilinçli verildi ama sonucu ölçülmedi.)*

- [x] ~~**D3 · "1.400 Yıl · 1 Metin · Sıfır Varyasyon"** anasayfada kayıtsız şartsız duruyor~~ — **KAPANDI** (14 Ağustos)
      Kontrol ettim: nüans kartın kendi blurb'ünde değil, `/arac/koruma-zinciri`
      tool sayfasında zaten vardı ("rasm sabit, mütevâtir kıraat farkları
      ayrı ve belgeli bir katman — çelişkisi değil, kanıtı"). Bu cümle
      `koruma-card` blurb'üne taşındı (yeni iddia değil, tool sayfasının
      özeti). Başlık aynı kaldı (dikkat çekici kalsın), iki cümle sonra
      nitelendiriliyor. Doğrulama: taşma yok, baseline güncellendi.

---

# 🔵 E — TEKNİK (82) — notun temeli eksik

- [x] **E1 · Core Web Vitals ÖLÇÜLDÜ** → `scripts/measure-vitals.mjs`
      Üretim build'inde, mobilde CPU ×4 kısıtıyla. **Dört eşiğin dördü de geçti:**

      | | LCP | CLS | TBT | FCP |
      |---|---:|---:|---:|---:|
      | /tr mobil-390 (CPU ×4) | 2.220ms | 0.008 | 17ms | 340ms |
      | /tr masaüstü-1440 | 1.736ms | 0 | 0ms | 88ms |
      | /en mobil-390 (CPU ×4) | 2.016ms | 0 | 0ms | 296ms |
      | /en masaüstü-1440 | 1.728ms | 0 | 0ms | 96ms |
      | **eşik** | 2.500 | 0.1 | 200 | 1.800 |

      Ağırlık: 27–33 istek · ~1.7MB toplam · **293–333KB JS**.
      LCP ögesi her koşuda bir `<P>` — yani metin, görsel değil.
      ⚠ **Bu bir LABORATUVAR ölçümü.** Gerçek kullanıcı verisi (CrUX/RUM) yok;
      canlıda CDN, gerçek cihaz ve ağ farklı davranabilir.

- [ ] **E2 · EN mobil 20.307px** — hedef <20.000. TR 19.669 ile geçiyor,
      İngilizce metin uzun olduğu için aşıyor. Küçük fark; ya hedefi dile göre
      ayarla ya da EN metinleri kısalt.

---

# ⚪ F — BİLGİ MİMARİSİ (80)

- [ ] **F1 · Rafta 15 bölüm var ve adları `SixGates` kapı adlarıyla örtüşmüyor**
      Örnek: raf "Öne Çıkanlar" diyor — bu ad tek başına ne olduğunu söylemiyor.
      Ziyaretçi kapıdan girip rafa baktığında aynı dili görmeli.


---

# ✅ G — GPT-5.4 BÖLÜMLERİ: ÖLÇÜLDÜ VE DÜZELTİLDİ

- [x] **G1 · Skip link odağı `<main>`'e taşımıyordu** → `<main id="main" tabIndex={-1}>`
      Öncesi: `Enter` → `location.hash="#main"` ama odak `<body>`.
      Sonrası ölçüm: `Enter` → odak **`MAIN#main`**. Link artık işlevini görüyor.
      > İlk ölçümde "skip link görünmüyor" da demiştim — **yanlıştı**, geçişin
      > ortasında ölçmüşüm (−44.8px = %99.5). Doğrusu: 300ms'de `translateY(0)`.

- [x] **G2 · Gizli gezinme rafının 16 düğmesi klavye sırasındaydı** → `inert`
      Öncesi: `opacity:0` + `pointerEvents:none` ama 16/16 `tabbable`.
      Sonrası: `inert=true`, `aria-hidden=true`, ilk 14 Tab'da rafa **0 durak**.
      > ⚠ **Yanlış bileşeni suçlamıştım.** İlk ölçümde `MobileSectionChipNav`
      > sandım; test seçicim `aria-label*="Bölüm"` ile aslında
      > **`DesktopSidebarTOC`**'u yakalıyormuş (1440'ta chip rafı `null` dönüyor).
      > İkisine birden eklendi.
      > İkinci hata: `inert={''}` yazmıştım — React 19 boş dizeyi **false**
      > sayıyor ve konsola uyarı basıyor. `inert={!show || undefined}` oldu.

- [x] **G3 · Mega-menü `Escape` ile kapanmıyordu** → `keydown` işleyicisi + odak iadesi
      Öncesi: açıkken panel `736×59 visible`, `Escape` sonrası **hâlâ** `736×59`.
      Sonrası: `Escape` → panel yüksekliği **0**, odak **tetikleyiciye** dönüyor.
      Ayrıca üç tetikleyiciye `aria-expanded` + `aria-haspopup` eklendi.

- [x] **G4 · İngilizce sayfa `<html lang="tr">` ile sunuluyordu** → iki kök layout
      `app/layout.js` kaldırıldı. Next.js 16 bunu ismen destekliyor: *"The root
      layout can be under a dynamic segment ... `app/[lang]/layout.js`"*
      (`docs/.../file-conventions/layout.md:146`).
      Ortak iskelet `app/_shell.jsx`'te; iki kök layout onu kullanıyor:
      `app/[locale]/layout.js` → `<Shell lang={locale}>` ·
      `app/admin/layout.js` → `<Shell lang="tr">`
      Sonrası ölçüm: `/tr` → `lang="tr"` · `/en` → **`lang="en"`** · `/admin/queries` → `lang="tr"`
      **SSG korundu** — build hâlâ 74 route'u prerender ediyor.

- [x] **G5 · 26 `<svg>` erişilebilirlik etiketi taşımıyordu** → `aria-hidden="true"`
      49'un 23'ü etiketsizdi; kaynakta 26 açılış etiketi bulundu ve düzeltildi.
      Sonrası: **2/49** kaldı · adsız buton **0** (etiket ezilmedi).

## ⏳ Bu turda da ölçülmedi

- [ ] **G6 · Hydration metin/sayı uyuşmazlığı** — `npm run build && npm run start`
      ile bakılmalı; dev sunucusu maskeliyor. Riskli çağrı: `EsmaTeaser` →
      `toLocaleString('tr-TR')` sunucuda çalışıyor (Node ICU ≠ tarayıcı ICU).
- [ ] **G7 · Bidi gözle kontrol** — otomatik tarama 2 aday buldu, ikisi de yanlış
      pozitif (`innerText` çocukları da alıyor). Gözle bakılmalı.
- [ ] **G8 · LCP / CLS / INP** — bkz. E1.

## 📌 Not: `hifz.spec.js:321` kırmızısı bu turun eseri DEĞİL

`git stash` ile kanıtlandı: **değişiklik öncesi kodda 3 koşudan 2'si kırmızı**,
değişiklik sonrası 3'te 1. Yani test **flaky** ve sorun önceden var.
Ezber panelindeki "Nasıl çalışır?" düğmesi oturum aktifken bazen gelmiyor.
- [ ] `hifz.spec.js:321` flaky — düğmenin oturum sırasında render koşulu incelenmeli

---

# 🔶 Z — SİTE GENELİ (74 rota taraması, 13 Ağustos)

> Rota-rota açık liste: **`sayfa_denetim_kontrol_listesi.md` → §7** (130 madde)
> Burada yalnız **öncelik ve karar** duruyor.

## Z1 · Kalan gerçek hatalar — öncelik sırasıyla

> **13 Ağustos akşamı: Z1a–Z1d KAPANDI.** Dört alt-ajan paralel çalıştı,
> kesişmeyen dosya kümeleriyle; her sonucu ayrıca kendim ölçtüm.

- [x] **Z1a · `/graf/kelime-isi` 114 adsız buton → 0**
      Ajan ayrıca denetimin GÖREMEDİĞİ 4 buton daha buldu (âyet panelindeki
      kapat ve sayfalama düğmeleri yalnız sûre seçilince mount oluyor).
      Etiketler anlamlı: *"2. El-Bakara sûresi — 286 âyet"*, aramada
      *"…'rahmet' 2 kez geçiyor"*. Etiketsiz svg de 1 → 0.
- [x] **Z1b · Arapça `lang`/`dir`: 260 eksik öge → 0** (9 rotanın 9'u temiz)
      Eksik olan hep `dir="rtl"` idi; RTL yalnız CSS ile veriliyordu, DOM
      niteliği yoktu. Ajan Arapça metnin değişmediğini üç bağımsız yolla
      kanıtladı (karakter sayımı · dizi eşitliği · nitelik-normalize diff).
      Kalan 46 öge `src/sections/*` altındaydı — **o sınırı ben koymuştum**,
      ajanların çakışmaması için. Ajanlar bitince altı section dosyasını
      kendim kapattım.
- [x] **Z1c · Console error 10 → 0** (`/graf/kavram` · `/graf/semantik` ·
      `/arac/kiyamet`), üretim build'inde de doğrulandı.
      Kök sebepler: `useState(() => window.innerWidth < N)` SSR'de false /
      istemcide true (§16.6'da zaten yasak) · `key={s.surah_id}` ama JSON
      alanı `surah` · `<button>` içinde `<BookmarkButton>`'ın `<button>`'ı.
- [x] **Z1c-ek · `/ayet/[s]/[a]` iki `fetch` de 400 dönüyordu**
      `/api/meal/suat_yildirim/{s}` — API sayısal `author` id bekliyor,
      gönderilen slug. Üstelik bu iki meal upstream'de **hiç yok**
      (`apiId: null`, yerel veri). İki `.catch(()=>null)` hatayı yutuyordu ve
      paylaşım sayfası sessizce **BOŞ âyet** gösteriyordu.
      Âyet artık sunucuda `verse-graph`ten okunup prop olarak geçiyor:
      400'ler bitti, metin HTML'e girdi, yükleme durumu kalktı.
- [x] **Z1d · Ekranda ham `**` → 0** (3 rota). Metin silinmedi, render yoluna
      bağlandı; `<strong>` olarak `fontWeight 700` doğrulandı.
- [x] **Z1-bonus · `/graf/semantik` sûre çipleri BOŞTU** — ajanın yan bulgusu.
      `s.surah_id` / `s.verse_count` okunuyordu, JSON alanları `surah` / `count`.
      100 kaydın 100'ünde `undefined` → ekranda `": "` görünüyordu.
      Veri kaynak sayıldı, bileşen ona uyduruldu; ayrıca sayı yerine **sûre adı**:
      `"26: 56"` → `"Eş-Şuarâ · 56"` / `"Ash-Shuara · 56"`.
- [x] **Z1h · `/kutuphanem` canonical/hreflang** — **yanlış pozitifmiş.**
      Sayfa bilerek `noindex` (kullanıcıya özgü özel sayfa); kanonik adresi
      olmaması doğru. Denetim aracına `noindex` istisnası eklendi.
- [~] **Z1e · Başlık ağacı — büyük ölçüde kapandı, ölçüldü** (13 Ağustos gecesi)
      Denetimde 29 rota. Yeniden ölçüm: örneklenen 6 rotanın **5'i temiz**,
      yalnız `/tr/atlas/kissa` (1→3) kaldı. Paralel tur kapatmış.
      - [ ] Kalan rotalarda tam sayım yapılmadı — `page-audit` ile bir tur at
      ayrıca `/oku` ve `/ayet/2/255`'te **h1 YOK**, `/tefekkur`,
      `/tefekkur/[slug]` ve `/atlas/ahiret-yolculugu`'nda **iki h1**
- [~] **Z1f · Gezinme `<button>` ile — NAVBAR tarafı kapandı** `bbbd3ec`
      Mega-menü 60/1 → **7 buton / 54 bağlantı**; mobil çekmece 25 → **78
      bağlantı**. Navbar 74 rotanın hepsinde olduğu için en büyük parça buydu.
      - [ ] **Kalan: sayfa-içi gezinme** — `/arac/tum-araclar` çözülmüştü;
            aynı kalıp diğer sayfalarda duruyor.
      ⚠ **En yoğunu `esma-frekans` DEĞİL** (Z3 turunda ölçüldü):
      `ilk-son-kelimeler` **483 buton / 9 bağlantı** · `atlas/kissa` 157/6 ·
      `graf/kelime-isi` 153/3. Ayrıca **navbar mega-menüsünün kendisi** de
      `<button>` — 74 rotanın hepsini etkiliyor, bkz. **Z3f1**.
- [x] ~~**Z1g · Etiketsiz svg (44 rota)**~~ — **KAPANDI** `f4491e0` · **166 → 0**
      Kaynak grep'i yanılttı (çok satırlı JSX). DOM'dan ölçüp parmak iziyle
      kaynağa izlendi: neredeyse hepsini **tek bileşen** üretiyordu —
      `BookmarkButton` ikonu, kart başına bir kez (ilk-son-kelimeler 114,
      kurani-tani 50, kiyamet 26, kadinlar 13). Kalan kuyruk için `{}`
      derinliği sayan bir codemod: 186 etiket / 50 dosya.
      **İki svg gizlenmedi, ETİKETLENDİ** (§A1 dersi — dekoratifi gizle,
      anlam taşıyanı etiketle): `HiddenArchitecture` prizma diyagramı ve
      `SurahComparator` benzerlik göstergesi (içindeki `<text>` yüzde taşıyor).
      `<motion.svg>` codemod'dan kaçtı, elle kapatıldı.
      Doğrulama: **0/901** etiketsiz svg · **0/888** adsız etkileşimli öge
      (asıl risk buydu) · pageerror 0 · 4 emniyet testi geçti · gözle bakıldı.

## Z1i · NAVBAR SABİTİ — "450 → 0" İDDİAM YANLIŞTI, DÜZELTİLDİ (13 Ağustos gecesi)

- [x] **Örtüşme sınıfı gerçekten kapandı — ama önce yanlış rapor verdim.**
      *"450 → 0"* demiştim; yalnız `ToolHeader` kullanan sayfalarda ölçmüş,
      bütün sınıfa genellemiştim. **Paralel tur haklı çıktı:** kullanmayan
      sayfalarda örtüşme duruyordu (`/en/graf/ayet` 62px · `/en/sor` 58px ·
      `/tr/sor` 32px · `/en/graf/diyalog` 24px · `/en/atlas/kissa` 18px —
      beşinin dördü İngilizce, çünkü EN navbar 1024px'te sarıp 134px'e çıkıyor).
      Kapatılanlar: `SorRoute` · `VerseGraph` (5 sabit) · `KissaAtlas` ·
      `DiyalogAgi` (padding **ve** minHeight). Ölçüm: dört rotada `[B]` = 0.
      **Sabit sayı bu sitede sekizinci kez aynı hatayı üretti**
      (62 · 96 · 104 · 62 · 62 · 62 · 110 · 62).

- [x] **`CrossToolCTA` başlık zinciri** — 54 dosya kullanıyor. Bölüm etiketi
      `<span>`di, kartlar `<h4>`. Sayfa `h1`/`h2`'sinden doğrudan `h4`'e
      atlıyordu; **29 rotadaki başlık bulgusunun tek kaynağı buydu.**
      Etiket `<h2>`, kartlar `<h3>` oldu. Ölçüm: 12 rotanın 8'i temizlendi.
      Kalan 4'ü sayfaya özgü (`elestirel-cerceve` · `kitap-kavrami` ·
      `neden-sonuc` 1→3 · `iblis-seytan` 2→4) — ayrı iş.

- [ ] **Kalan başlık bulguları** — yukarıdaki 4 rota + `/oku` ve `/ayet`'te
      `h1` yok, `/tefekkur` ve `/atlas/ahiret-yolculugu`'nda iki `h1`.

### ⚠ Bu turda dört kez aynı hatayı yaptım — kayda geçsin

Hepsi tek sınıf: **toplu string değişikliği yapıp eşleştiğini doğrulamamak.**
1. `ToolHeader`'a import eklenmedi → tüm araç sayfaları **500**
2. `ToolHeader`'da `top` değeri hiç değişmedi → "düzelttim" sandım, ölçüm yalanladı
3. `page-audit.spec.js`'te şablon literaline backtick'li yorum → "No tests found"
4. `SorRoute`'ta kancayı **yanlış bileşene** koydum (`SorInner` olmalıydı) →
   `/sor` boş render etti, 3 concierge testi kırmızıya döndü

**GPT-5.4 kod incelemesi beşincisini yakaladı ve o bloklayıcıydı:**
`VerseGraph.jsx`'te `navTop` üç ayrı üst-seviye bileşende (`ClusterView`,
`VerseView`, `FullGraph`) kapsam dışıydı. **Testlerim yakalayamazdı** — o üç
görünüm ancak kullanıcı tıklayınca mount oluyor, denetim varsayılan görünümü
yüklüyor. Kullanıcı ilk tıklamada çökecekti.
→ Artık statik kontrol var: her `navTop` kullanımının kapsayan bileşeninde
   kanca çağrısı olduğu tüm dosyalarda doğrulanıyor (site geneli: 0 ihlal).

---

## Z3 · TAM SİTE TARAMASI — 13 Ağustos gecesi (Claude, bağımsız tur)

> **Kapsam:** 70 statik rota × 2 dil × 3 genişlik (1440 · 1024 · 390) = **420 sayfa
> yüklemesi** + 140 sunucu HTML taraması + eslint + renk denetimi + 9 ekran
> görüntüsü gözle inceleme + 7 etkileşim testi.
> **Aşağıdakiler Z1'de ve kontrol listesinde YOK.** Z1'de belirtisi olup burada
> **sebebi** bulunanlar ayrıca işaretli.
>
> ⚠ **Bu tur, 4-ajanlı Z1 turuyla ÇAKIŞTI.** Ölçümlerim 20:26–20:55 arasında
> alındı; `3f9eed2` (20:56, 23 dosya) araya girdi. **Commit sonrası her madde
> canlı olarak yeniden kontrol edildi** — kapanmış olan 2'si `[x]` işaretli
> (Z3a2, Z3c2), kalan 23'ü **hâlâ açık ve doğrulandı**. Örtüşme rastlantı değil:
> iki bağımsız tur aynı iki hatayı buldu; kalan 23'ü yalnız bu tur buldu.
> Tekrarla: `/tmp/crawl-{1440,1024,390}.json`, `/tmp/ssr-sweep.json`, `/tmp/eslint.json`

### ✅ `Z3d1` KAPANDI — ibadetler RAG corpus'a girdi (`1d5fdd8`)

> 724 KB içerik (7 ibadet + hub) artık `/sor`'da bulunuyor.
> Canlı test: *"namaz nedir"* → `/tr/atlas/ibadetler/namaz` ·
> *"oruç neden farz kılındı"* → `.../oruc` · *"zekât kimlere verilir"* →
> `.../zekat` · EN: *"what is fasting"* → `/en/atlas/ibadetler/oruc`.
> Embedding **artımlı**: yeni 15, dokunulmayan 12.860, **2.0s, $0.0000**.
> Dosya 168.96 MB (Vercel 250 MB sınırına 81 MB marj).
>
> **İlk bulgumda iki yanlış vardı, düzeltildi:** hub zaten katalogdaydı
> (eksik olan 7 alt rota), ve `/arac/wow` katalog dışı olmalı — 307
> yönlendirme, sayfa değil.
>
> **Embed etmeden önce iki hata yakalandı** (chunk'ları gözle okuyarak):
> `hub.json`'un id'si `ibadetler-hub` olduğu için üretilen rota
> `/atlas/ibadetler/ibadetler-hub` = **404'e götüren corpus kaydı**
> (kontrol listesi §U); ve dil sızıntısı — `anchorVerse` `tr`/`en` küçük
> harf kullandığı için Türkçe chunk'ta İngilizce meal vardı.

---

### 🎯 UYGULAMA SIRASI — hangi madde neden önce

> Ölçüt sırası: **(1)** kullanıcı şu anda kırık görüyor/kullanamıyor mu ·
> **(2)** kaç sayfaya yayılıyor · **(3)** maliyet · **(4)** kaç maddeyi birden
> kapatıyor. "Önemli ama karar gerektiren" işler (renk göçü, görsel kompozisyon)
> bilinçli olarak geriye atıldı — onlar kod işi değil.

| # | Madde | Neden bu sırada |
|---:|---|---|
| **1** | **Z3a1** (+**Z3f4** ücretsiz kapanır) | **148 sayfanın hepsi.** Kullanıcı kırık **görüyor** (CTA metni kenarlığın dışında) ve `/en/graf/ayet`'te kontroller **tıklanamıyor**. Tek kök: 1024–1180'de sarma. iPad Pro 12.9" portrait = tam 1024px |
| **2** | **Z3c1** | 2 satır · 5 dk. Patlarsa sayfa **hiç açılmaz**. Tetikleyici teorik değil — alan adı sürüklenmesi bu hafta yaşandı (Z3a2) |
| **3** | **Z3b1 · Z3b2 · Z3b3** | Kullanıcı tıklıyor, **hiçbir şey olmuyor** — hata bile vermiyor. Çözüm kalıbı hazır: `routeForToolEvent` + `<Link>` (`ToolsBrowser`'da uygulandı) |
| ~~4~~ ✅ | ~~**Z3d1**~~ `1d5fdd8` | §13.22 "MUTLAK, istisna yok" diyor; `/sor` **724 KB** içeriği bilmiyor. ⚠ embedding rebuild maliyeti var, önce onay |
| **5** | **Z3c3** | Geçersiz âyet için canonical+OG üretiliyor → indekslenebilir çöp. Düzeltme: aralık kontrolü + `notFound()` |
| ~~6~~ ✅ | ~~**Z3f1**~~ `bbbd3ec` | Geniş ama zararı **SEO değil** — ölçüldü: `sitemap.xml` **458 URL** döndürüyor, keşif kayıp değil. Kalan zarar UX (orta tık / yeni sekme) + anchor-text |

**Bilerek geriye atılanlar:** `C2` (184 renk) → önce **karar**, temizlik değil ·
`B1/B3/B4` (görsel) → kod değil **tasarım kararı**, statik mockup olmadan başlama ·
`Z3g1` (541 lint) → 451'i kozmetik `no-unescaped-entities`, sinyal/gürültü düşük.

⚠ **Z3a1 düzeltilirken CLAUDE.md §13.13 de revize edilmeli** — "tüm navbar
butonları 32px" kuralı sarma ile çelişiyor; kural düzeltilmezse hata geri gelir.

### 🔴 Z3-A · Ekranda GÖRÜNEN kırıklar

- [x] ~~**Z3a1 · Navbar 1024–1180px arasında kırılıyor — HER SAYFADA**~~
      **KAPANDI 2026-08-13 gecesi.** GPT-5.2 hakem turu: *KOŞULLU ONAY* →
      itirazları ölçüldü, biri çürütüldü, biri **daha derin bir hatayı** açtı.
      Yapılan dört parça (ayrıntı: CLAUDE.md §13.13):
      `minHeight` (sabit `height` değil) + `white-space:nowrap` +
      1024–1279 kompakt katman (CSS değişkeni köprüsü, `!important` YOK) +
      `flex-wrap` emniyet ağı.
      **Teşhisim başta eksikti:** bu bir breakpoint hatası değil, **sabit
      yükseklik** hatasıymış — root font 20px'te **1440px'te bile** taşıyordu.
      Doğrulama: 7 genişlik × 2 dil × 3 root font = **22/22 geçti**;
      3 ekran görüntüsü gözle incelendi.
      ⚠ İki kez sayısal test "geçti" dedi, ekran görüntüsü hatayı gösterdi
      (kırpılan öge yatay kaydırma üretmiyor) → §13.13'e ölçüt olarak eklendi.
      *Aşağıdaki özgün bulgu kaydı arşiv olarak duruyor:*
      Ölçüldü (`nav[aria-label="Main navigation"]` yüksekliği + CTA metin kutusu):
      | genişlik | TR navH | TR taşma | EN navH | EN taşma |
      |---|---:|---:|---:|---:|
      | 1024 | **108px** | **+3px** | **134px** | **+3px** |
      | 1100 | 82 | −1 | **108px** | **+3px** |
      | 1180+ | 82 | −1 | 82 | −1 |
      "Kur'an'ı Oku" / "Read Quran" metni **iki satıra sarıyor**, buton
      `height:32px`'te sabit (§13.13) → **metin butonun kenarlığının dışına
      taşıyor.** "Esmâ-i Hüsnâ" / "The Beautiful Names" 2–3 satıra sarıyor.
      Ekran görüntüsüyle doğrulandı (`_tr_sor_1024.png`, `_en_graf_ayet_1024.png`).
      ⚠ Z1 "navbar örtüşmesi 450 → 0" diyor — o **sayfa içeriğinin** örtülmesiydi;
      bu **navbarın kendi iç düzeni**. Ayrı hata.
      → §13.13 "tüm butonlar 32px" kuralı sarma ile çelişiyor; kural revize edilmeli.

- [x] ~~**Z3a2 · `/graf/semantik` — 60 çipin 60'ı ekranda ": " diye görünüyor**~~
      **KAPANDI — `3f9eed2` (Z1-bonus ile aynı bulgu, bağımsız olarak da bulundu).**
      Sebep: `s.surah_id`/`s.verse_count` ↔ JSON `surah`/`count`.
      Doğrulama (21:0x, canlı): ilk kart artık `Eş-Şuarâ · 56 | Es-Sâffât · 37`,
      konsol hatası **0**.
      - [x] ~~**Z3a2-kalıntı · Arama indeksinde aynı sürüklenme DURUYOR**~~ — **KAPANDI** (14 Ağustos)
            `SemanticMap.jsx:91` → satır 44-45'teki aynı fallback kalıbı (`s.surah ?? s.surah_id`,
            `s.count ?? s.verse_count`) uygulandı. Doğrulama: "37" araması artık
            Sâffât'ı (sûre 37) içeren kümeleri doğru filtreliyor (önce/boş-eşleşme/37
            için metin uzunluğu 2865/673/1659 — filtre gerçekten çalışıyor).

- [x] ~~**Z3a3 · `VerseChip ref={v}`**~~ — **KAPANDI** `0767c51` → `verseRef`
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `SemanticMap.jsx:452` + `:536`. `ref` React'te ayrılmış bir addır; çipin
      metni bu yüzden boş. Detay panelindeki "Merkezî Ayetler" bloğu etkileniyor.
      Aynı sınıf eslint'te de var: **18 × `react-hooks/refs`** (aş. Z3d3).

### 🔴 Z3-B · ÖLÜ TIKLAMALAR — `/arac/tum-araclar`'da düzeltilenin kardeşleri

> Kontrol listesi A bölümü bu sınıfı "23 araç tıklaması ölü" diye kaydetmiş ve
> `ToolsBrowser` düzeltilmiş. **Aynı kalıp üç yerde daha duruyor.**

- [x] ~~**Z3b1 · `/atlas/insan-psikolojisi` — CTA tıklaması ÖLÜ**~~ — **KAPANDI** `c26c157`
      `<Link href={/tr/atlas/nefs-mertebeleri}>` oldu. Tıklama testi:
      URL gerçekten değişiyor, `<a>` (orta tık çalışır), pageerror 0.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `PsychologySection.jsx:277` → `openNefisMertebeleri` · `openProphetAtlas`,
      ikisinin de **0 dinleyicisi** var. Playwright ile tıklandı: **URL değişmedi,
      hata da vermedi.** Kullanıcı için "buton bozuk" bile değil — hiçbir şey yok.
- [x] ~~**Z3b2 · `CennetCehennem.jsx:1419` — "İlgili Araçlar" butonları ölü**~~ — **KAPANDI** `c26c157`
      ⚠ **Bulgum eksikti: 4 değil BEŞ rozet ölüymüş.** Beşincisinin
      (`İmkânsız Ritim`) `event` alanı hiç yoktu, `link.event &&` guard'ı
      sessizce yutuyordu. Hepsi `<Link>` oldu; hedefi olmayan rozet artık
      hiç render edilmiyor. Tıklama testi: "Tabiat Atlası" → `/tr/atlas/doga`.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `openNatureAtlas` · `openAddresseeSystem` · `openConceptGraph` ·
      `openQuranCommands` → hepsi 0 dinleyici.
- [x] ~~**Z3b3a · `WordPopover.jsx:432`**~~ — **KAPANDI** `c26c157`
      3 rozet (`openConceptGraph` · `openHeatmap` · `openVerseGraph`) route'a
      bağlandı. Ek kazanç: `?q=2:255` desteği `VerseGraphRoute`'a eklendi —
      rozet önceden kullanıcıyı **tıkladığı âyeti kaybederek** genel grafiğe
      düşürüyordu; durum artık URL'de (§16.9), bağlantı paylaşılabilir.
      ⚠ Rota erişilebilirliği doğrulandı (`?q=2:255` → 200) ama **rozete
      Okuma Modu içinden tıklayarak UI testi yapılmadı** — ReadingMode'da
      kelime popover'ını otomatize edemedim. Elle bakılmalı.

- [x] ~~**Z3b3b · `PathContext.jsx` — özellik ölü**~~ — **SİLİNDİ** `1f3c412`
      Karar: **SİL**. GPT-5.2 hakem turu aynı sonuca vardı: *"feature flag
      kapalı değil, FEATURE YOK; canlandırma refactor değil yeniden yazım."*
      916 satır (`PathContext` 608 + `PathCards` 212 + `paths.jsx` 96) +
      layout'taki provider kaldırıldı.
      **Kürasyon silinmedi** → `next/docs/arsiv/rehberli-yol-kurasyonu.md`.
      İleride gerekirse `/yol/[id]` **gerçek rota** olarak sıfırdan yazılmalı.
      GPT'nin S3 cevabı D1/F1 için doğrudan kullanılabilir: *"guided path"
      yerine "guided entry points"* — kapıları niyet-tabanlı yap, her kapıya
      3'lü mikro-onboarding (1 hızlı aksiyon + 1 örnek sorgu + 1 popüler araç).
      - [ ] **Bu öneri D1'e taşınacak** (anasayfada özet yok maddesi)
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      Kod düzeltmeye başlarken daha büyük bir şey çıktı: **rehberli "yol"
      özelliğinin hiçbir girişi yok.** `PathCards.jsx` duruyor ama
      `grep -rn "<PathCards"` → **0 sonuç**; `page.js`'teki nota göre
      *"PathCards + AllTopics + ToolsShowcase kaldırıldı — SixGates bunları
      konsolide eder"*. `PathProvider` hâlâ `layout.js`'te mount ediliyor,
      `usePath()` tek tüketicisi de mount edilmeyen `PathCards`.
      Ayrıca `PATH_OVERLAY_EVENTS`'in 6 hedefinden 3'ünün (`openProphetAtlas`,
      `openDogaAtlasi`, `openZamanBoyutlari`) zaten dinleyicisi yok.
      **Ölü kodu "doğru" hâle getirmek boşa iş** — önce karar:
      - [ ] Özelliği geri getir (PathCards'ı mount et) → o zaman route'a bağla
      - [ ] Ya da tamamen sil (`PathContext` + `PathCards` + `paths.jsx` +
            `layout.js`'teki provider) — şu an ölü ağırlık
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      Vite dönemi
      `dispatchOverlayEvent` kalıntısı; `PATH_OVERLAY_EVENTS` haritasının
      karşılığı kalkmış.
      Toplu doğrulama: `openIblisSatan`, `openIlkSonKelimeler`,
      `openNefisMertebeleri` → **0 dinleyici** (`grep addEventListener`).
      → Çözüm zaten var: `ToolsBrowser`'daki `routeForToolEvent` + `<Link>` kalıbı.

### 🔴 Z3-C · Gizli bombalar (bugün patlamıyor, yarın patlar)

- [x] ~~**Z3c1 · `IbadetlerHub.jsx:489` ve `:786` — KOŞULLU `useState`**~~
      **KAPANDI 2026-08-13 gecesi.** Hook'lar erken `return`'ün üstüne alındı.
      GPT-5.2 hakem turu: **ONAY** (koşulsuz). Doğrulama: `eslint
      rules-of-hooks` **2 → 0**; `/tr` + `/en` `/atlas/ibadetler` ve
      `/atlas/ibadetler/namaz` → **200**; iki bölüm de tarayıcıda render
      ediyor; konsol hatası **0**.
      *Aşağıdaki özgün bulgu kaydı arşiv olarak duruyor:*
      ```js
      function YolHaritasiSection({ data }) {
        if (!data?.yollar?.length) return null;   // ← erken return
        const [active, setActive] = useState(0);  // ← hook ALTINDA
      ```
      Aynısı `PeygamberIzleriSection`'da (`data.prophets`). JSON'dan `yollar`
      veya `prophets` düşerse **"Rendered fewer hooks than expected"** → sayfa
      hiç açılmaz. Kontrol listesi F bölümündeki `useMemo` hatasının **birebir
      aynısı**; o zaman sayfa hiç açılmamıştı.
      `eslint`: 2 × `react-hooks/rules-of-hooks`.
- [x] ~~**Z3c2 · `/arac/kiyamet` — iç içe `<button>`**~~ — **KAPANDI, `3f9eed2`**
      (Z1c ile aynı bulgu). `KiyametSahneleri.jsx:248`'de düzeltme notu duruyor;
      `BookmarkButton` akordiyon `<button>`'ın dışına alınmış.
- [x] ~~**Z3c3 · `/ayet/[surah]/[ayah]` sınır doğrulaması YOK**~~ — **KAPANDI** `414c779`
      `verse-graph` otorite alındı (6.236 kayıt, 114 sûre, boşluk 0 — doğrulandı),
      module-level `Set` + `notFound()`. Geçersiz âyette `robots: noindex`.
      Test: `115/1 · 2/300 · 2/287 · 0/1 · 2/0 · abc/1` → **404**;
      `2/255 · 1/7 · 114/6 · en/9/129` → **200** (sınırlar dahil).
      **İki yan bulgu daha çıktı ve düzeltildi:**
      - **404 sayfasının kendisi bozuktu.** Yalnız `/oku/[surah]` için özel bir
        `not-found` vardı; diğer TÜM 404'ler Next'in çıplak varsayılanına
        düşüyordu — `<html lang>` YOK, navbar yok, çıkış bağlantısı yok,
        **İngilizce sayfada Türkçe metin**. → `[locale]/not-found.jsx` eklendi
        (dilinde, navbar'lı, 3 çıkışlı).
      - `atlas/peygamber/[id]`'de `dynamicParams = false` bilinmeyen id'yi çıplak
        404'e düşürüyordu → kaldırıldı, `notFound()` zaten vardı. SSG kaybı yok.
      - [ ] **Kalan açık:** tamamen eşleşmeyen yol (`/tr/olmayan-sayfa`) hâlâ
            çıplak 404. Kök `app/not-found.js` gerekiyor, o da **G4'teki
            iki-kök-layout** düzeniyle çakışıyor (`app/layout.js` `lang` hatası
            için bilerek kaldırılmıştı). Çözüm araştırılmalı.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      ```
      /tr/ayet/115/1  → 200   <title>Sure 115 115:1 — QuranCodex | QuranCodex</title>
      /tr/ayet/2/300  → 200   <title>El-Bakara 2:300 …</title>   (Bakara 286 âyet)
      ```
      Kontrol listesi **M** bölümü tam olarak bunu soruyor. Diğer dört dinamik
      rota (`tefekkur/[slug]`, `atlas/peygamber/[id]`, `oku/[surah]`, geçersiz
      rota) **doğru 404 veriyor** — yalnız bu ikisi kaçmış. Üstelik
      `generateMetadata` var olmayan âyet için canonical + OG üretiyor →
      **indekslenebilir çöp sayfa.**
      ⚠ **`3f9eed2` sonrası yeniden ölçüldü (21:0x): hâlâ 200.** O commit
      (`Z1c-ek`) aynı rotadaki **400 dönen fetch**'leri düzeltti — sınır
      doğrulaması ayrı iş, açık kalıyor.

### 🟡 Z3-K · KONTRAST 73 SAYFADA ÖLÇÜLDÜ (14 Ağustos) — K1-K7 kapandı, uzun kuyruk açık

> **Güncelleme (14 Ağustos, K6 turu):** ilk `--full` ölçümü kendisi
> yanıltıcıydı (scroll-reveal animasyonu geçiş hâlindeyken ölçülüyordu,
> bkz. K6 aşağıda). Düzeltilince gerçek taban **1.465** çıktı, tur sonunda
> **1.095**'e indi (kissa hariç **976 → 608**, 78 sayfaya yayılmış). K4
> (kissa'nın soluk hücreleri) kullanıcı kararıyla kapandı.
>
> **Güncelleme (14 Ağustos, taze tam tarama + K7):** ayrı bir tam-site
> taramasında `/atlas/kissa`'nın **487 gerçek ihlal** taşıdığı görüldü —
> K4'ün kapsamadığı dört yeni kalıp (bkz. K7 aşağıda). K7 ile kissa
> **247+240 → 0**'a indi. Kalan: K5 (mobil ölçüm) + 608'lik uzun kuyruk
> (kissa hariç) — aynı kalıplar, artık küçük parçalar.

> Bu, gecenin başından beri "hiç ölçülmedi" diye işaretli olan iki bilinmeyenden
> biriydi. Ölçüldü ve **beklediğimden kötü çıktı**: erişilebilirlik notu bu
> boşluğun üstünde duruyordu, şimdi gerçek zemine oturdu.
> Araç: `tests/lib/contrast.mjs` (zaten yazılmıştı, 74 sayfa için tasarlanmış).
> Tekrarla: 70 rota × 2 dil × 1440px → `/tmp/contrast-desktop.json`

**Ham sayı 3.997 — ama hepsi hata değil. Ayıklanmış hâli:**

| | adet |
|---|---:|
| Ham bulgu | 3.997 |
| − gradyan rozeti (bilinen yanlış pozitif, A2'de kayıtlı) | 2 |
| − ≥24px dev/dekoratif rakam | 24 |
| − `/atlas/kissa` **kasıtlı soluk** hücreler (aş. bak) | 463 |
| **= gerçek, kazara ihlal** | **3.508** |
| bunun gradyansız (kesin) olanı | 3.035 |
| etkilenen sayfa | **134 / 140** |
| temiz sayfa | yalnız `/hakkinda` ve `/kaynakca` (tr+en) |

**Şiddet:** okunamaz (<2.0) **86** · çok zayıf (2.0–3.0) **1.174** ·
AA altı (3.0–4.5) **2.246**

**Kök sebep dar bir renk kümesi — 3.508'in %85'i altı renkten geliyor:**

| renk | oran (cosmic-black üstünde) | adet | 4.5 için gereken |
|---|---:|---:|---|
| `rgb(100,116,139)` slate-500 | **4.12** | 675 | `#697a93` |
| `rgb(74,85,104)` `#4a5568` | **2.60** | 554 | `#6a7a95` |
| `#94a3b8` @ opaklık 0.70 | **3.99** | 594 | opaklık **≥0.75** (A2'de zaten yazılı) |
| `rgba(148,163,184,0.45)` | **2.42** | 136 | opaklık ≥0.75 |
| `#94a3b8` @ 0.65 / 0.60 | 3.62 / 3.4 | 210 | opaklık ≥0.75 |
| `rgb(74,96,128)` | **3.06** | 96 | `#5e7ba3` |

> `#4a5568` **C2'de zaten "en sık token dışı renk (×34)" diye kayıtlıydı** —
> o zaman yalnız "token değil" diye işaretlenmişti; şimdi **AA'yı da geçmediği**
> ölçüldü. İki madde aynı köke bakıyormuş.
> Opaklık tarafı da yeni değil: **A2** zaten "silver ≥0.75, gold ≥0.70" eşiğini
> ölçmüştü — ama yalnız **anasayfada** uygulanmış; diğer 73 sayfa dışarıda kalmış.

**⚠ `/atlas/kissa`'nın 463'ü ayrı bir mesele — ölçüm değil KARAR gerektiriyor.**
Ekran görüntüsüyle bakıldı: sahnenin geçmediği sûre hücreleri **bilerek**
soluklaştırılmış (bir tür ısı haritası). Yani tasarım niyeti meşru — ama
uygulama oran **1.27**'ye inmiş, yani bilgi herkes için kayboluyor, sadece
az gören kullanıcı için değil. Soluklaştırma bir "yok" sinyali taşıdığı için
WCAG'ın "devre dışı öge" muafiyetine de girmiyor.
- [x] ~~Karar: soluk durum oran **≥3.0**'a çekilsin~~ — **KAPANDI** (kullanıcı
      kararı, 14 Ağustos). `KissaAtlas.jsx`'te sahnesiz sûre hücrelerinin rengi
      `#1e293b` (oran 1.27) → `#666D7A` (gerçek sayfada ölçülen: **3.57**) —
      ısı haritası etkisi ve "az gören için de değil, herkes için soluk"
      niyeti korunuyor, sadece artık okunuyor.

**Yapılacaklar (öncelik sırasıyla):**
- [x] ~~**K1 · Opaklık taban kuralı 73 sayfaya yayılsın**~~ — **KAPANDI** `5d966f7`
      **3.508 → 2.634 (−874, %25).** Tahmin ~940 idi, gerçekleşen 874.
      İki geçiş, ikisi de **AST ile** (regex değil — `opacity` çoğu zaman metin
      renginden satırlar sonra, ayrı bir prop):
      ① aynı stil nesnesinde `color` silver/gold **ve** `opacity` taban altı
      → **307 düzeltme / 93 dosya**
      ② `color: 'rgba(148,163,184,α)'` — alfa **rengin içinde** olanlar
      → **95 düzeltme / 19 dosya**. Aynı rgba dizesi `border`/`background`
      olarak da kullanılıyor; AST sayesinde yalnız `color` konumundakiler
      değişti (kenarlık metin değildir).
      Taban **0.78** seçildi: 0.75 tam sınırda (4.70), 0.78 nefes payı (~5.0).
      **0.35 altına dokunulmadı** — onlar bilinçli "neredeyse görünmez" süs,
      ayrı karar (K4 ailesi).
      Kovalar: 3.0–4.5 → 2.246'dan **1.544**'e · 2.0–3.0 → 1.174'ten **1.002**'ye.
      Gözle: `/tr/atlas/munafik` ekran görüntüsü — metin okunur, ikincil
      hiyerarşi korunmuş, solma yok.
- [x] ~~**K2 + K3 · üçüncü metin katmanı**~~ — **KAPANDI** `b142302` · **2.634 → 1.394**
      **Kök sebep literal değil TOKEN'di.** Kod tabanı üçüncü kademe için
      `COLORS.slate500/600/700/800` kullanıyordu ve **dördü de** AA'yı
      geçmiyordu (4.12 · 2.59 · 1.89 · 1.34). Sorun tek tek kullanımlarda
      değil, **katmanın olmamasındaydı**: ham palet (Tailwind slate) rol
      yerine kullanılmış — §13.25 md. 2'nin tam yasakladığı şey.
      Çözüm: `SEMANTIC.textFaint = '#70829c'` (slate tonu korunur, **5.02**).
      Üç kademe artık gerçekten üç kademe: **15.74 / 7.65 / 5.02**.
      AST ile **207 `color:` konumu / 25 dosya**.
      **Dokunulmayanlar (bilinçli):** `slate500-800` token'ları silinmedi —
      kenarlık/ayraç olarak hâlâ doğrular, AA eşiği metne aittir.
      `/atlas/kissa`'nın ham literalleri de muaf kaldı (K4'ün konusu).
      ⚠ **Kendi hatam:** import enjeksiyonum 7 dosyada `TEXT,, SEMANTIC`
      üretti, site **500** döndü; rota sağlık kontrolü yakaladı.
      **Kalan 1.394'ün kökü:** `rgba(148,163,184,0.7)` literalleri (142) ve
      **ata `opacity` zinciri** — K1'in AST'i erişemedi çünkü opaklık metnin
      stil nesnesinde değil, üstteki kapsayıcıda. Ayrı bir tur gerektirir.
- [x] ~~**K6 · Ölçüm düzeltmesi + kalan ihlallerin büyük kısmı**~~ — **KAPANDI** (14 Ağustos, bu tur)
      **Önce ölçümün kendisi yanlıştı.** `--full` ilk kez koşulunca **1.894**
      çıktı — K2+K3'ten SONRAKİ artışı "yeni bulgu" sandım, ama gerçek sebep
      probe'un `SectionWrapper`/`fadeUpItem` scroll-reveal animasyonlarını
      hâlâ geçiş hâlindeyken (1.6sn bekleme + gecikmeli/kademeli `delay`
      zincirleri 2sn'yi buluyor) ölçmesiydi. Kanıt: `/tr/arac/tekrar-anatomi`
      normal ölçümde 27, sayfa gerçekten kaydırılıp animasyon oturmaya
      bırakılınca **4**'e düşüyor. Site zaten `useReducedMotion()` ile bu
      animasyonları TAMAMEN atlıyor (bkz. `SectionWrapper.jsx`) — çözüm
      Playwright context'ini `reducedMotion: 'reduce'` ile açmak oldu:
      animasyon hiç başlamıyor, öge doğrudan son hâliyle render oluyor.
      Sekiz sayfada doğrulandı: ritim 70→7, dua-dili 52→0, insan-tanımı
      28→0, tekrar-anatomi 27→0 — ama melekler/kadınlar/kavram (53/36/32)
      **hiç değişmedi**, yani gerçek ihlaldi. **Gerçek taban: 1.465**
      (`scripts/audit-contrast.mjs`'e kalıcı olarak eklendi).
      **Sonra gerçek ihlaller tek tek kapatıldı** (`/atlas/kissa` = K4
      hariç): `/arac/melekler` **53→0** (kategori rengi çok koyuydu — kayıt
      #534AB7 ratio 2.83, gizemli #6B7280 ratio 4.05, **ikisi de tam
      opaklıkta bile AA'yı geçmiyordu**; ayrıca `isHadithOnly` kartının
      TÜMÜNE uygulanan `opacity: 0.75` zaten muted renklerle ÇİFTE
      solukluk yaratıyordu — kart-seviyesi opaklık kaldırıldı, sinyal
      zaten renk+ikon+etiketle veriliyor); `SEMANTIC.textFaint` **#70829c
      (5.02) → #7e8fa6 (5.94)** — saf siyah zemine göre hesaplanan 5.02'nin
      payı gerçek sayfalarda (iç içe yarı saydam kart katmanları) 4.12'ye
      kadar düşüyordu, tek token değişikliği birden çok sayfaya yayıldı;
      `HapaxBadge`'in İKİ ayrı kopyası (Melekler + CennetCehennem, ikisi de
      kendi mor tonunu icat etmişti) → `#a78bfa`; `CrossToolCTA` eyebrow'u
      **54 dosyada** `opacity: 0.72` idi (gold floor 0.75'in altında) →
      **0.78**; `/atlas/kadinlar` **36→0**; `/graf/kavram` **32→0**
      (`concept-graph.json`'daki 3 küme rengi AA'yı geçmiyordu — veri
      dosyası, kod değil); `/arac/esma-frekans` **32→7** (kalan 5'i
      `FADE_OPACITY=0.55` — bilinçli "vurgu dışını soluklaştır" deseni,
      zaten §13.26 md. 4'ün ≥3.0 tabanının üstünde, dokunulmadı; ayrıca bu
      sayfanın Hero'su `useReducedMotion()` hiç dinlemiyordu → eklendi, hem
      a11y açığı hem ölçüm gürültüsü kapandı); `/arac/cennet-cehennem`
      **24→0**. **Sonuç: gerçek taban 1.465 → 1.095** (kissa hariç 976 →
      608). Doğrulama: `npm run build` temiz, ilgili dosyalarda yeni eslint
      hatası yok, `npx playwright test tools-navigation concierge _a11y`
      24/26 yeşil (2 kırmızı bu turdan ÖNCE de vardı: concierge IP kotası
      + paralel turun bitmemiş navbar değişikliği — ayrıntı: bu maddenin
      commit mesajı).
      **Kalan 608 (kissa hariç), 78 sayfaya yayılmış, en büyüğü 20** — aynı
      kalıplardan (kategori rengi, `${x}alpha` idiyomu, ata-opacity) ama
      artık uzun kuyruk. Ayrı bir tur gerektirir.
- [x] ~~**K4 · `/atlas/kissa` soluk durumu**~~ — **KAPANDI** (yukarıdaki karar)
- [x] ~~**K5 · Mobilde (390px) tekrar ölç**~~ — **ÖLÇÜLDÜ** `ec5eb24`.
      `audit-contrast.mjs --mobile --full` eklendi, ayrı taban
      (`mobile-full`). Sonuç: **596** (masaüstü 1095'ten düşük — mobilde
      daha az içerik aynı anda görünür oluyor, beklenen). Ama **3 rota
      hipotezi doğruladı**: `/arac/kiyamet` (13→17), `/atlas/mesel` (0→2),
      `/atlas/insan-yolculugu` (3→4) — masaüstünde ≥24px olup "büyük metin"
      muafiyetinden (eşik 3.0) yararlanan âyet metni, mobilde `clamp()`
      ile 22.4px'e düşünce muafiyeti kaybediyor (eşik 4.5'e çıkıyor).
      Kanıt: `/arac/kiyamet`'te 17 ihlalin çoğu bu — kendi kategori
      renklerini (mavi #3B4BC8, mor #7B4FBF, kırmızı #C0392B, teşil
      #1D7A5F) Melekler/CennetCehennem'dekiyle AYNI şekilde hiç
      doğrulanmadan kullanmış, düşük opaklıkla birleşince mobilde açığa
      çıkıyor.
- [x] ~~**3 rotanın kategori renkleri**~~ — **KAPANDI** `8c6fded`.
      `KiyametSahneleri.jsx` (7 fazlık PHASE_COLORS: kırmızı/teal/mavi/mor
      açıldı), `MeselAtlasi.jsx` + **veri dosyaları**
      (`public/amthal/paired-parables.json`, `imagery-networks.json` —
      aynı renk JS fallback'inde DEĞİL, JSON'a da gömülüymüş, ikisi de
      düzeltildi) ve `InsanYolculugu.jsx` (iki fazla-soluk kapsayıcı
      opacity + iki sınırdaki gold/silver opacity).
      ⚠ **Yan bulgu:** `KiyametSahneleri.jsx`'te aynı renk hem "metin
      cosmic-black üstünde" HEM "beyaz metin rozet zemini" olarak
      kullanılıyordu — matematiksel olarak **ikisi aynı anda AA geçemez**
      (biri L≥0.216 ister, öbürü L≤0.183 — kesişim yok). Rozet metni
      beyaz yerine `COLORS.cosmicBlack` yapıldı.
      Bilerek dokunulmayan: `/atlas/insan-yolculugu`'daki "Önceki" butonu
      (ratio 2.13) — gerçekten `disabled`, WCAG metni okunması beklenmeyen
      inert ögeleri kapsamaz.
      Doğrulama: production build (ayrı port), 6 sayfa (TR+EN×3) sıfır
      ihlal (Önceki hariç), konsol hatası yok.
- [x] ~~**K7 · `/atlas/kissa` gerçek ihlalleri**~~ — **KAPANDI** `5357068`.
      14 Ağustos'un taze tam taramasında (`--full`) kissa **247 (tr) + 240
      (en) = 487** gerçek ihlal taşıdığı görüldü — K4'ün "kasıtlı soluk"
      kararı yalnız ısı haritası hücrelerini kapsıyordu, dört farklı kalıp
      hiç ölçülmemişti: ham `#666D7A` hex (171) · `COLORS.slate600` (16) ·
      `COLORS.slate500` + kapsayıcı `opacity` çarpımı (11) · peygamber
      renginin alfa-sufiksinin (`${prophet.color}80`/`cc`) `isDimmed`
      opacity ile bileşik çarpımı (46 — en çok Musa'nın mavisinde
      eşiğin altına düşüyordu, ölçülen 1.34–2.71).
      Fayans sönükleştirmesi metinden ayrıştırıldı: `isDimmed` artık
      yalnız bg/border alfasını etkiliyor, metin sabit tam opak (fayans
      zemini renk-tonlu olduğu için `cc` alfa bile eşiği geçmiyordu).
      Üç ham/slate metin katmanı `SEMANTIC.textFaint`'e bağlandı.
      Doğrulama: `CONTRAST_PROBE` (`audit-contrast.mjs` ile aynı context)
      — tr **247→0**, en **240→0**. eslint temiz, 1440+390 ekran görüntüsü
      sönük/aktif ayrımının bozulmadığını doğruladı. Kullanıcı onayıyla
      yapıldı ("2 numara, düzelt") — dosya normalde başka bir agent'ın
      alanı, bu tur idle olduğu teyit edilip elle üstlenildi.
- [x] ~~**Uzun kuyruk — ilk 4 sayfa**~~ — **KAPANDI** `7b0f83d` + `369b485` + `9f750e5`.
      `/arac/iblis-seytan` **20→0** (chip.muted çifte-solukluk deseni —
      KadinlarAtlasi'nin daha önceki fixiyle aynı kalıp — + `COLORS.violet`
      token'ının zaten düzeltilmiş olmasının otomatik kapattığı sure-rengi
      efsanesi), `/atlas/ahiret-yolculugu` **20→0** (aşama-nav butonunda
      aynı çifte-solukluk: buton `opacity` + çocuk `span`'in KENDİ `opacity`'si
      bileşik çarpıyordu), `iblis/OnIkiHileWidget.jsx` + `VesveseKanaliWidget.jsx`
      (beyaz-metin rozet zemininin biri turuncu tonda AA'yı geçmiyordu, ratio
      2.85 — koyulaştırıldı), `/atlas/nefs-mertebeleri` **17→0** ve
      `/arac/ilk-son-kelimeler` **18→0** — ikisi de aynı yeni desen: **iç içe
      "self-tint" zemin** (bir kapsayıcı `${color}NN` düşük-alfa zeminliyken
      İÇİNDEKİ öge de kendi `${color}MM` zemini ekliyor, iki ton üst üste
      binince efektif zemin saf siyahtan hafifçe açılıyor ve aynı-tonlu metnin
      oranını 4.0-4.3'e düşürüyor) — `chipStyle()`'daki gereksiz ek `opacity`
      kaldırıldı, filtre-sayacı chip'inin kendi iç-içe zemini kaldırıldı
      (dış buton zemini tek başına yeterliydi).
      ⚠ **Ayrı bulunan gerçek üretim açığı:** bu turun renkleri (KiyametSahneleri
      PHASE_COLORS, İblis kanal renkleri, MeselAtlasi domain renkleri, `softRed`)
      `tokens.js`'e hiç kaydedilmemiş, ham hex olarak kalmıştı — `audit-colors.mjs
      --ci` **182→189** ile yakaladı. Daha ciddisi: `softRed`'in token değeri
      (`#e74c3c → #EB695B`) hiç commitlenmemiş olduğu için `InsanYolculugu.jsx`'in
      ENGEL etiketi (K5 turunda opaklığı kaldırılmıştı, `8c6fded`) **production'da
      hâlâ eski, AA-altı renkle** render oluyordu — kimse fark etmemişti çünkü
      hook bu oturumda aktif değildi. 7 yeni token eklenip (`crimsonTextSafe`,
      `rustTextSafe`, `amberBadgeSafe`, `indigoTextSafe`, `sageTextSafe`,
      `orchidTextSafe`, `terracottaTextSafe`) `audit-colors --ci` 182/182'ye
      çekildi, düzeltme push edildi.
      Doğrulama: build temiz, `audit-colors.mjs --ci` geçti, 6 rota (kiyamet,
      mesel, iblis-seytan, insan-yolculugu, nefs-mertebeleri, ilk-son-kelimeler)
      masaüstü+mobil TR+EN sıfır ihlal (disabled "Önceki" butonu hariç).
      **Kalan tahmini ~530, ~74 sayfaya yayılmış** (kissa hariç; taze `--full`
      taramasıyla teyit edilmedi, bir sonraki turun ilk işi bu olmalı).
- [x] ~~**Uzun kuyruk — SIFIRLANDI**~~ — **KAPANDI** `fda9616` + `022ebc6` +
      `8b47e4e` + `1435e60` (4 ardışık tur, aynı oturum). **412 → 198 → 126 →
      74 → 48.** Kalan 48'in TAMAMI ya `/oku` (40 — CLS kök #2 ile aynı alan,
      paralel ajanla çakışmamak için bilinçli dokunulmadı) ya da 4 doğrulanmış
      `disabled` buton (Önceki/Temizle/İki sûre seçin/Sor × 2 dil, hepsi
      gerçek `disabled={...}` attribute'üyle — WCAG'ın inert-öge muafiyeti).
      **Kissa + /oku hariç: uzun kuyruk sıfırlandı.**
      En sık tekrar eden kalıplar (tek düzeltme çok sayfaya yayıldı):
      · `COLORS.silverAlpha70` metin rengi olarak kullanımı (§13.26 md.4
        ihlali — alfa token'ı metin için yasak) — 10 dosyada tek token
        değişikliğiyle (`SEMANTIC.textFaint`) kapandı.
      · "İnaktif sekme" deseni: `COLORS.slate500` veya ham `#64748b`/
        `rgba(148,163,184,0.5-0.7)` — 8+ dosyada aynı `isActive ? accent :
        X` kalıbı, hepsi `SEMANTIC.textFaint`'e bağlandı.
      · Kategori/kimlik renkleri hâlâ eski (tokenize-öncesi) hex taşıyordu
        (`#8b5cf6`, `#e74c3c`, `#9b59b6`, `#1D9E75`, `#c0392b`, `#8e44ad`) —
        JS fallback'lerinde VE JSON veri dosyalarında (aynı kalıp, K7'de
        keşfedilmişti) bu oturumda zaten açılmış karşılıklarına taşındı.
      · Kapsayıcı `opacity` + rozet/kategori kendi rengi bileşik çarpımı
        (bilimsel-isaretler + tarihsel-kanitlar'da AYNI kalıp iki ayrı
        dosyada) ve "self-tint" iç-içe zemin (renkler/nefs-mertebeleri/
        ilk-son-kelimeler) — üçüncü kez görülünce kalıp olarak tanındı.
      **Ders (regresyon, düzeltildi):** `DuaVerses.jsx`'te bir rengi hem
      RGB hem alfa yükseltmek, aynı dosyadaki `cfg.color.replace('0.8)', ...)`
      kırılgan string-eşlemesini kırdı — rozet zemini neredeyse opak aynı
      renge dönüp metni GÖRÜNMEZ yaptı (ölçülen 1.13, önceki 3.13'ten kötü).
      Alfa geri alındı, yalnız RGB açıldı. **Ders: `.replace('X)', ...)` gibi
      kırılgan string kalıpları olan dosyalarda bir rengi değiştirirken
      dosyanın TAMAMINDA o rengin başka nerede/nasıl kullanıldığını
      (grep ile) kontrol et — yalnız hedef satırı değil.**

### 🟡 Z3-V · CWV 140 SAYFADA İLK KEZ ÖLÇÜLDÜ (14 Ağustos) — kısmen kapandı

> Bu tarihe kadar CWV **yalnız anasayfada** (`/tr`, `/en`) ölçülmüştü;
> kontrastta olduğu gibi 73 sayfa tamamen bilinmeyendi. `measure-vitals.mjs`
> `--full` moduna kavuştu (`audit-contrast.mjs`'teki `allRoutes()` ile aynı
> keşif), sonuç `tests/__baseline__/vitals.json`'a yazılıyor.

**İlk tur — 280 ölçüm (140 sayfa × mobil-390 + masaüstü-1440):**
**78 ölçüm bir eşiği aşıyor — hepsi CLS (75) veya TBT (7). LCP/FCP'de SIFIR
ihlal** — yani site hızlı, sorun kayma (layout shift), yavaşlık değil.

**Kök sebep #1 — BULUNDU ve KAPATILDI:** `layout-shift` kaynak izlemesi
(`sources[].node`) 3 bağımsız sayfada aynı deseni gösterdi: `CrossToolCTA`
(54 dosyada) ve `SourcesCitation`, `grid-template-columns`'u JS `isMobile`
prop'undan alıyordu. `isMobile` her çağıran sayfada §14.1'in **zorunlu
koştuğu** `useState(false)+useEffect` kalıbıyla geliyor — yani hydration
ANINDA hep `false`. Mobilde sayfa önce 3 sütunlu masaüstü ızgarasıyla
render olup hydration'dan hemen sonra 1 sütuna yeniden diziliyordu.
- [x] ~~**Düzeltme: CSS media query'ye taşındı**~~ — **KAPANDI** `d1ca000`.
      `/atlas/kadinlar` CLS **0.191 → 0.000** (tam kapandı). Genel: **78 → 59**
      ihlal (−19). `neden-sonuc`/`kitap-kavrami`/`elestirel-cerceve`/`graf/*`
      kısmen iyileşti ama tam kapanmadı — Kök #2'nin de etkisi var (aşağı bak).

**Kök sebep #2 — BULUNDU, henüz KAPANMADI:** kalan en büyük ihlaller
(`/tr/oku` 0.918 · `/graf/karsilastir` 0.81 · `/arac/neden-sonuc` 0.76 ·
`/arac/kitap-kavrami` 0.76 · `/arac/elestirel-cerceve` 0.75 · `/graf/zaman`
0.73 · `/graf/diyalog` 0.55 · `/graf/kavram` 0.47 …) hepsi aynı mimari
kalıbı paylaşıyor: `useState(null)` + `useEffect(() => fetch(...))` ile
veri istemci tarafında çekiliyor, veri gelene kadar **ayrı bir `if (!data)
return (...)` dalı** (yükleme iskeleti) render ediliyor, veri gelince
**farklı bir ağaca** geçiliyor. Bu bir stil değişikliği değil — DOM'un
kendisi değişiyor (remount), bu yüzden CSS media query bunu çözemez.
`/tr/oku`'nun "Yükleniyor" spinner'ının meal/sûre başlığıyla değişmesi
aynı ailenin bir örneği. Gerçek çözüm ya veriyi sunucu tarafında
(RSC/`fetch` build-time) sağlamak ya da iskeletin son içerikle **aynı
boyutu** ayırması — ikisi de bu turun kapsamı dışında, kendi turunu
gerektiriyor (muhtemelen 10-15 dosya, `/oku` dahil).
- [x] ~~**`/oku` — dış iskelet (kısmi)**~~ — **KAPANDI** `5064341`. İki
      güvenli, izole düzeltme (kullanıcı onayıyla kapsam "sadece iskelet
      boyutu"na sınırlandı): (1) `ReadingModeRoute.jsx` (× iki route,
      `/oku` + `/oku/[surah]`) dynamic import'unun `loading: () => null`
      fallback'i — JS chunk inene kadar ekranda HİÇBİR ŞEY yoktu, sonra
      tam-viewport ReadingMode aniden beliriyordu (en sert sıçrama türü:
      boş→dolu). Yeni `ReadingModeSkeleton.jsx` aynı konum/boyutu
      (`position:fixed, inset:0`) ve gündüz-modu varsayılan zeminini
      (`#f4f0e0`) taklit ediyor. (2) ReadingMode'un kendi iç `loading`
      spinner'ı `height:'60vh'` sabitiydi (scroll container'ın gerçek
      yüksekliğinden farklı) → `minHeight:'100%'`.
      Ölçülen (`scratch-cls.mjs`, throttled mobil 390px): **0.918 → 0.788**
      (~%14 iyileşme, regresyon yok — build temiz, 4 rota HTTP 200 + sıfır
      konsol hatası, `audit-colors --ci` 179/182).
      **Kalan asıl büyük sıçrama (0.716) FARKLI bir kaynaktan geliyor ve
      kapsam dışı bırakıldı:** ayet-içerik sarmalayıcısı (`bookMode ? ... :
      ...` dalı) her zaman DOM'da ama `verses` verisi (`useState(null)` +
      `.then(setVerses)`) gelene kadar `.map()` boş dönüyor → 0-yükseklik;
      veri gelince `390x714px`'e aniden sıçrıyor. Bunu kapatmak
      ReadingMode'un ÇEKİRDEK render alanına (11k+ satır) sentetik
      `minHeight` eklemeyi gerektiriyor — kısa sûrelerde "boş görünme"
      riski taşıyan, daha derin bir müdahale; kullanıcı onayıyla BURADA
      DURULDU. ~~**Sonraki tur:** bu içerik-alanı minHeight'ı.~~ **14 Ağustos
      gecesi denendi, DUVARA TOSLADI — bulgular aşağıda, hiçbir kod değişikliği
      commit edilmedi (revert edildi, ölçülemeyen fayda commit'lenmez).**

#### 14 Ağustos (gece) · ReadingMode içerik-alanı minHeight — denendi, ÇÖZÜLEMEDİ

Yukarıdaki "sonraki tur" ele alındı. `.mq-box` sınıflı iki muhtemel
sarmalayıcıya (`bookMode` dış div'i `maxWidth:1800px` + içindeki "Left:
Translation" kolonu) `minHeight: '70vh'` eklendi — her ikisi de doğru
JSX konumunda, `getComputedStyle` ile DOĞRULANDI (canlı, kayma anında
`minHeight: "590.8px"` okundu, yani stil GERÇEKTEN uygulanıyordu).
**Ama ölçülen CLS bit-bir-bit AYNI kaldı: 0.705/0.776, üç ayrı testte
(öncesi, iç-kolon-fix-sonrası, iç+dış-fix-sonrası) virgülden sonra bile
değişmedi.**

**Sebep bulundu, ama çözülemedi:** `layout-shift` olayının ham
`source.previousRect` alanı **`{w:0, h:0, top:0}`** — bu, Chrome'un
"bu obje bir ÖNCEKİ karede layout ağacında HİÇ YOKTU" durumunda verdiği
imza. Yani bu bir "küçükten büyüğe BÜYÜME" değil, **sıfırdan bir anda
TAM BOYUTLU EKLEME** (fresh insertion). `minHeight`, bir elementin
VAROLDUKTAN SONRAKİ boyutunu etkiler — element henüz DOM'a hiç
girmemişse hiçbir işe yaramaz. `{bookMode ? (...) : (...)}` JSX'i kod
okumasında `loading`'den bağımsız, koşulsuz render ediliyormuş gibi
görünüyordu (kaynak satırları doğrulandı) — ama çalışma zamanı davranışı
bunun aksini gösteriyor: bu alt-ağaç GERÇEKTEN `loading` bitene kadar
DOM'da yok, sonra TAM DOLU haliyle bir anda beliriyor. Aranan `if
(!verses)`/`if (loading) return`/`display:'none'`/`key={...loading...}`
kalıplarının HİÇBİRİ bulunamadı (dosya genelinde grep edildi) — yani
gerçek mekanizma bu üç basit varsayımın DIŞINDA bir yerde (muhtemelen
`dynamic(..., {ssr:false})` ile client-only mount zincirinin kendi iç
işleyişinde, ya da React'ın reconciliation'ında henüz izole edilmemiş
bir üçüncü etken).

**Neden burada durduruldu:** Kök sebebi netleştirmek muhtemelen bu
11k+ satırlık bileşenin TAM mount/render zincirini (React DevTools
Profiler veya çok daha kapsamlı enstrümantasyon ile) izlemeyi
gerektiriyor — bu, başta kabul edilen "sadece iskelet boyutu" kapsamının
çok ötesine geçen, kendi başına büyük bir araştırma turu. Ölçülemeyen
bir "fix" commit'lenmedi; iki deneme edit'i de **revert edildi**
(kod tabanında iz yok).

**Kalan (hâlâ açık, kapsamı netleşmeden ilerlenemez):** `/tr/oku` CLS'i
0.705-0.776 aralığında kalmaya devam ediyor.

#### 15 Ağustos (gece) · İkinci tur — kullanıcı onayıyla daha derin izlendi, YİNE ÇÖZÜLEMEDİ

Kullanıcı "ReadingMode CLS'i daha derin araştır" dedi. Üç ayrı enstrümantasyon
katmanı eklendi (hiçbiri commit edilmedi — hepsi revert edildi):

1. **Render sayacı** — bileşenin HER render'ında `performance.now()` +
   `isMobile`/`loading`/`versesLen`/`bookMode` değerlerini `window`'a yazan
   senkron bir log (component body'nin en üstünde ve `return` hemen
   öncesinde). Sonuç: 6 render, t=392-791ms aralığında. İlk üçü `loading:
   true` iken (isMobile false→true geçişi dahil), son ikisi veriler
   geldikten sonra (`loading:false, versesLen:6236`) — ama **4. ve 5. render
   arasında HİÇBİR loglanan değer değişmiyor** (her ikisi de aynı state) —
   yani bileşen görünürde gereksiz yere en az 2 kez fazladan render oluyor
   (ayrı bir performans notu, CLS'in kendisi değil).
2. **Ref-callback mount log'u (İLK DENEME, YANILTICI ÇIKTI)** — inline
   `ref={el => {...}}` callback'i her render'da YENİDEN oluştuğu için React
   onu her seferinde `null` sonra `el` ile çağırıyor — bu, DOM node'unun
   GERÇEKTEN yok edilip yeniden yaratıldığı YANILGISINI verdi ("5 kez
   remount" gibi göründü). **Bu React'ın bilinen bir davranışı, benim
   ilk enstrümantasyon hatam** — inline ref callback'ler her render'da
   ateşleniyor, node kimliği değişmese bile.
3. **Düzeltilmiş node-kimlik takibi** — `el.dataset.rmSeen` bayrağıyla
   GERÇEK ilk-mount'u sahte re-invoke'lardan ayırdım. Sonuç: node **GERÇEKTEN
   TEK SEFER mount oluyor** (`isNewNode: true` yalnız ilk çağrıda), sonraki
   4 çağrı AYNI, stabil DOM node'u işaret ediyor. Yani "yok edilip yeniden
   yaratılma" teorisi YANLIŞTI — bu bir remount sorunu değil.
4. **`min-height:'70vh'` tekrar eklenip canlı doğrulandı** — `getComputedStyle`
   ile, layout-shift `PerformanceObserver` callback'inin İÇİNDE (ayrı bir
   test değil, AYNI ölçüm anında), `minHeight: "590.8px"` okundu — yani
   stil GERÇEKTEN, TAM O ANDA uygulanmış durumdaydı.

**Çelişkili sonuç:** Node stabil, min-height canlı olarak doğrulanmış
durumda uygulanmış — YİNE DE tarayıcının kendi `layout-shift` olayı
`previousRect: {w:0,h:0,top:0}` raporluyor, sanki element o ana kadar hiç
var olmamış gibi. Bu, normal CSS/kayma modeliyle AÇIKLANAMIYOR: stabil bir
node + canlı doğrulanmış min-height ile "önceki dikdörtgen sıfır" sonucu
çelişkili. Mümkün açıklamalar (doğrulanamadı): (a) tarayıcının iç layout-
shift muhasebesi ile React'ın commit zamanlaması arasında incelenmemiş bir
yarış durumu; (b) `content-visibility`/CSS containment gibi bir mekanizmanın
elementi "ölçülmemiş" saydığı bir durum; (c) Chrome DevTools Performance
trace'i (bu ortamda yok) olmadan ayırt edilemeyecek bir üçüncü etken.

**Sonuç:** İki tur, kapsamlı enstrümantasyon (6 ayrı tanı script'i,
canlı stil/rect/mount doğrulaması) sonunda kök sebep izole edilemedi.
Bu, mevcut araçlarla (Playwright + CDP, DevTools Performance trace'i
OLMADAN) makul çabayla çözülebilecek bir sorun değil — gerçek Chrome
DevTools Performance sekmesinde canlı bir trace almak (bu ortamda mevcut
değil) veya React Profiler'ın flame graph'ı gerekiyor. **Kod tabanında hiç
iz yok** (tüm deneme edit'leri revert edildi). Bir sonraki adım, kullanıcı
gerçek bir tarayıcıda DevTools Performance trace'i alıp paylaşabilirse,
ya da bu konuya ayrılmış, daha uzun bir araştırma turu olabilir.
- [x] ~~**`neden-sonuc`/`kitap-kavrami`/`elestirel-cerceve`/`graf/karsilastir`/
      `graf/kavram` ailesi**~~ — **KISMEN KAPANDI** `048414b`. Bulgu güncel
      değilmiş: bu 5 sayfa daha önceki bir turda (`f9d9e36`, "Z3f2") zaten
      `fetch()`'ten static import'a geçirilmişti — `useState(null)+useEffect
      fetch` kalıbı ARTIK yok. Taze ölçümde (`scratch-cls.mjs`, throttled
      mobil 390px) FARKLI bir kök çıktı: `padding: isMobile ? '16px' :
      '24px 32px'` — CrossToolCTA'nın 14 Ağustos'ta düzeltilen AYNI
      §14.2 kalıbı, ama bu kez §14.6'nın kendi önerdiği standart mobil-
      padding idiyomunda. Grep site genelinde **70 dosyada** gösterdi —
      kullanıcı kapsamı bugün ölçülen 5 sayfaya sınırladı (tam site
      taraması ayrı, büyük bir tur gerektiriyor, henüz yapılmadı).
      `neden-sonuc`/`kitap-kavrami`/`elestirel-cerceve` üç kardeş dosya
      aynı şablonu paylaşıyordu → `globals.css`'e `.zf2-tool-*` paylaşılan
      sınıfları: **0.116-0.178 → 0.007-0.019** (eşik altı, fiilen sıfır).
      `graf/karsilastir` (`SurahComparator.jsx`, 6 özellik) ve `graf/kavram`
      (`ConceptGraph.jsx`, 4 özellik) kendi `.sc-*`/`.cg-*` sınıflarına
      bağlandı — ama kalan büyük sıçrama (0.780 / 0.318) KAPANMADI: bu
      ikisi hâlâ GERÇEK `fetch()` kullanıyor (`verse-graph-bgem3.json`
      **12.3 MB** — static import'a taşımak JS bundle'ı şişirir, mimari
      doğru; sadece skeleton-boyutu yetersiz). ReadingMode'daki AYNI
      kategori — derin müdahale kapsam dışı bırakıldı.
      **Kalan açık:** ReadingMode içerik-minHeight'ı + SurahComparator/
      ConceptGraph'ın gerçek fetch-remount'u + 70 dosyalık site-geneli
      `padding: isMobile ?` taraması (ayrı, büyük bir tur).
- [x] ~~**Site-geneli `isMobile` YAPISAL kalıp (grid/flexDirection/display) —
      SIFIRLANDI**~~ — **KAPANDI** `d865148`..`cdc6320` (5 commit, aynı
      oturum). Kullanıcı kapsamı netleştirdi: 700+ örneklik `padding:
      isMobile ?` taraması TEK oturumda bitmeyecek kadar büyüktü (bkz.
      yukarı) — bu yüzden yalnız BÜYÜK görsel sıçrama üreten alt-küme
      hedeflendi: `gridTemplateColumns`/`flexDirection`/`display`
      (sütun sayısı, yön, görünür/gizli — küçük padding farkından çok
      daha büyük sıçrama). Grep başlangıçta **182 örnek / 69 dosya**
      gösterdi (Kissa hariç). Sonuç: **0 örnek** — yalnız iki bilinçli
      istisna kaldı: KissaAtlas.jsx (başka ajanın alanı, hiç
      dokunulmadı) ve ReadingMode.jsx'in TEK karmaşık örneği (satır
      ~8835 — `isMobile` VE `showTranslation`'a birlikte bağlı per-âyet
      satır düzeni; iki state'in birleştiği bu kalıp tek bir CSS medya
      sorgusuyla temiz ifade edilemiyor, "korunan amiral gemisi"
      dosyada riski gerekçelendirmeyen küçük bir kazanç olurdu).
      `globals.css`'e ~35 yardımcı sınıf eklendi — bazıları tek-dosyalık
      bespoke (`.cc-hero-banner`, `.ih-abdcore-grid` vb.), çoğu birden
      fazla dosyada tekrar eden kalıpları kapsayan genel-amaçlı sınıflar
      (`.g-1-2` … `.g-4-7`, `.fd-row`, `.fd-col-reverse`, `.dsp-flex`
      ailesi). Veri-bağımlı sütun sayısı (`repeat(${n}, 1fr)`) için
      YENİ bir teknik: `.g-dyn { grid-template-columns: repeat(var(
      --cols, 3), 1fr); }` + `style={{ '--cols': n }}` — CSS custom
      property, runtime hesaplamayı JS'te bırakıp yalnız SAYIYI CSS'e
      taşıyor, isMobile'a hiç dokunmuyor.
      `repeat(auto-fit/auto-fill, minmax(...))` kullanan ~26 örnekte
      (CSS sınıfı bile GEREKMEDİ) ternary'nin tamamı kaldırıldı — bu
      sözdizimi zaten container genişliğine göre kendiliğinden tepki
      veriyor.
      ⚠ **Kendi hatam, build yakaladı:** className'i `style={{...}}`'in
      kapatma `>`'sini taşıyan satırdan ayırıp yeni satıra koyarken bir
      kez `>`'yi eklemeyi unuttum (MunafikProfili.jsx) — syntax error,
      `npm run build` her dosyadan sonra çalıştırıldığı için hemen
      yakalandı. **Ders: className'i style'dan sonraki ayrı satıra
      koyarken, o satırın `>` ile bitmesi gerekiyor (bir sonraki prop
      değilse).**
      Doğrulama: 5 commit boyunca her partiden sonra `npm run build`,
      son partide tam site kontrast taraması (`--full`, 140 sayfa) —
      **taban 48 KORUNDU, regresyon yok**. `audit-colors --ci` 179/182,
      `audit-internal-leak` temiz. 26+ rota sıfır konsol hatası.
      **Kalan (bilinçli kapsam dışı, ayrı turlar):** ReadingMode içerik-
      alanı minHeight'ı.
      ~~SurahComparator/ConceptGraph fetch-remount~~ ✅ 14 Ağustos gecesi
      kapatıldı, bkz. aşağıdaki 14 Ağustos notu (`4782823`).
      ~~küçük padding farkları (~600+ örnek, 70 dosya)~~ ✅ 14 Ağustos
      gecesi kapatıldı, bkz. aşağıdaki "70-dosyalık padding taraması" notu
      (`b7850e3`..`5fd1068`).

#### 14 Ağustos (gece) · 70-dosyalık padding/margin taraması — mq-box codemod

Kullanıcı onayıyla ("70-dosyalık padding taraması") site genelinde kalan
`padding(Top|Bottom|Left|Right)`/`margin(...)`: `isMobile ? A : B` kalıbı
kapatıldı — **560 örnek / 66 dosya** (kissa hariç). Bunlar §14.2'nin
yasakladığı yapısal (`grid`/`display`/`flexDirection`) kalıptan FARKLI:
reflow üretmiyorlar, bu yüzden CLS etkisi genelde eşiğin altında — ama aynı
kök sebep (hydration anında `isMobile` her zaman `false`) kısa bir "zıplama"
hissi üretiyor ve CLAUDE.md §14.2'nin ruhuna aykırı kalıyordu.

**Yöntem — elle değil, AST tabanlı codemod:** 560 örneği tek tek Edit
tool'uyla değiştirmek pratik değildi; `@babel/parser`+`traverse` (repo'da
zaten dependency olarak mevcut) ile `next/scripts/_codemod-mq-pad.mjs`
yazıldı (kalıcı değil, bu tur için tek seferlik araç — repoda kalabilir ama
bir sonraki benzer tur için elden geçirilmeli). Kaynak metni tam parse edip
yalnız DEĞİŞEN alt-aralıkları spliceleyerek yeniden yazıyor — tüm dosyayı
yeniden formatlamıyor, diff'ler cerrahi kalıyor.

⚠ **İlk tasarımda gerçek bir CSS hatası yakalandı, push'tan önce:** `.mq-box`
class'ı önce hem shorthand (`padding: var(--p-d,unset)`) hem longhand
(`padding-top: var(--pt-d,unset)` vb.) aynı kuralda tanımlanmıştı — CSS
cascade'de aynı seçici içinde longhand her zaman SONRA gelip shorthand'ın
ürettiği expand edilmiş değeri SESSİZCE sıfırlıyor (longhand'lar `unset`
olduğu için tüm padding **0'a** düşüyordu). `getComputedStyle` ile canlı
ölçmeden fark edilmezdi. Çözüm: shorthand'ı hiç class'a koymadan, codemod
`padding`/`margin` shorthand'ını standart CSS 1/2/3/4-token açılım kuralıyla
4 longhand'a genişletiyor (`top/right/bottom/left`), class SADECE longhand
tutuyor. **Ders: bir class'ta shorthand+longhand karışığı varsa, longhand
her zaman kazanır — ikisini asla aynı seçicide birlikte custom-property
fallback ile tanımlama.**

**Güvenlik sınırları (codemod bilinçli olarak 5 örneği atladı):**
- 3 örnek nested ternary (`isFirst ? A : B` iç içe) — düz string/sayı
  değilse dönüştürmüyor.
- 1 örnek `KiraatAtlasi.jsx` marginRight/Left'te nested ternary.
- 1 örnek `ReadingMode.jsx:10720` — `max(12px, env(safe-area-inset-top,
  12px))` gibi fonksiyon-içi boşluk taşıyan shorthand; boşlukla token
  bölmek yanlış sonuç üretirdi, codemod `(` görünce reddediyor.
Bu 5'i JS-driven kaldı, ayrı ele alınabilir (düşük öncelik, tekil örnekler).

Doğrulama: `npm run build` temiz (66 dosya), her batch sonrası
`git show --stat HEAD` ile beklenen dosya listesi doğrulandı, Playwright ile
`getComputedStyle` üzerinden mobil/masaüstü değerlerin doğru switch ettiği
6 sayfada ölçüldü, `audit-colors --ci` 179/182, `audit-internal-leak --ci`
temiz, kontrast sample-mode regresyon yok, 19 rotada (tr/en) sıfır konsol
hatası, 3 sayfada CLS ölçümü (0.000–0.034, hepsi eşiğin altında — kalan
küçük değerler Arapça font reflow'undan, isMobile'dan değil).

6 batch halinde commit+push edildi: `b7850e3`..`5fd1068`.

#### 14 Ağustos (gece) · VerseGraph (/graf/ayet) TBT — kök sebep bulundu, KISMEN kapatıldı

"Mobilde hissedilen yavaşlık" (kuyruktaki iki iştenNden biri) incelendi.
CLS ile ilgisi yok — `measure-vitals.mjs` gerçek, GERÇEK bir TBT (Total
Blocking Time) buldu: `/graf/ayet` masaüstünde (throttle'sız) **TBT ~4.7
saniye**. Sayfa birkaç saniye donuyor.

**Kök sebep:** `filterSurah` varsayılan `null` → sayfa her zaman TÜM 6.236
ayeti aynı anda 3D force-graph'ta (`react-force-graph-3d` + Three.js)
render ediyor. `makeNodeObject()` (VerseGraph.jsx:494) HER düğüm için YENİ
bir `SphereGeometry` + `MeshLambertMaterial` allocate ediyordu — 6.236 × 2 =
12.472 benzersiz geometry/material, hepsi GPU'ya ayrı ayrı upload ediliyor.
CDP `Profiler` ile alınan CPU profili doğruladı: örneklenen zamanın **~%80'i
"(program)"** (native WebGL sürücü çağrıları — buffer upload, program
setup).

**Uygulanan kısmi düzeltme:** `makeNodeObject` artık modül-seviyesinde
paylaşılan 3 birim-küre geometry'si (`mesh.scale` ile yarıçapa
ölçekleniyor — görsel sonuç birebir aynı) ve küçük bir material cache
kullanıyor (`node.color` yalnız 2 değerden geliyor — Medenî/Mekkî — bu
yüzden cache çok az sayıda benzersiz material'a düşüyor). Kütüphanenin
hiçbir node objesini `.dispose()` etmediği doğrulandı (paylaşım güvenli).

**⚠ TAM çözmedi — ikinci bir profil turu bunu ortaya çıkardı:** allocation
maliyeti gitti ama toplam TBT hemen hemen aynı kaldı (~4.6-6.3s, ölçüm
gürültülü — bkz. aşağı). Profildeki attribution DEĞİŞTİ: artık
`setup`/`getUniforms`/`getParameters` (ilk-kurulum) yerine
`multiplyMatrices`/`updateMatrixWorld`/`applyMatrix4` (HER FRAME'de
6.236×2 = 12.472 ayrı Mesh objesi için matris güncellemesi + ayrı draw
call) görünüyor. Yani gerçek darboğaz allocation değil, **12.472 AYRI
WebGL draw call'un kendisi** — `nodeThreeObject` API'si (react-force-graph)
her node için bağımsız bir Object3D döndürüyor, tek bir instanced mesh
değil. Bunu tam çözmek `THREE.InstancedMesh`'e geçmek gerektirir — bu,
`nodeThreeObject` callback pattern'inden ayrılıp konumları manuel
senkronize eden çok daha büyük bir mimari değişiklik (ReadingMode'un RSC
rewrite'ı gibi — kapsamı kullanıcı onayı gerektirir, bu turda YAPILMADI).

**Ölçüm notu:** `measure-vitals.mjs` throttle'suz masaüstünde ölçüyor;
sistemde aynı anda birden fazla `next start`/`next dev` süreci (başka
agent'lara ait) çalışıyordu, bu yüzden ham TBT rakamları (4.7s → düzeltme
sonrası 6.3s) GÜRÜLTÜLÜ — düzeltme sonrası rakamın ARTMASI muhtemelen
sistem yüküdür, regresyon değil; CDP `Profiler` (CPU zamanı, wall-clock
değil) ile alınan İKİ profil karşılaştırması daha güvenilir ve yukarıdaki
attribution değişimini gösterdi.

**Doğrulama:** `npm run build` temiz, görsel karşılaştırma (öncesi/sonrası
ekran görüntüsü) — renk/parlaklık/genel görünüm aynı, sıfır konsol hatası,
hover/click etkileşimi çalışıyor.

#### 14 Ağustos (gece, devamı) · VerseGraph TBT — InstancedMesh uygulandı, kısmen çözdü

Kullanıcı onayıyla ("VerseGraph InstancedMesh — Önerilen") yukarıdaki kalan
işe devam edildi. Sonuç **beklenenden karmaşık** çıktı — iki ayrı kök sebep
daha bulundu, biri instancing'le, biri instancing'le İLGİSİZ bir GPU
darboğazıyla ilgili.

**1) Node instancing uygulandı, TBT DEĞİŞMEDİ — ikinci kök sebep: LINKLER.**
`nodeThreeObject` artık "normal" (seçili/hovered/ghost/dimmed olmayan)
düğümler için görünmez bir proxy (`makeInvisibleProxy`, raycasting için
gerekli — Three.js Raycaster `.visible`e bakmıyor, doğrulandı) döndürüyor;
gerçek görsel `react-force-graph`'ın DIŞINDA, doğrudan sahneye eklenen 4
`InstancedMesh` (Mekkî/Medenî × core/halo) üzerinden geliyor.
`renderer.info.render.calls` ile ölçüldü: **12.145 → 8 draw call.** Ama
TBT **hiç değişmedi** (~4.2-4.8s). Sebep: react-force-graph HER bağlantıyı
(10.653 tanesi) de kendi Line/Cylinder objesi olarak render ediyor —
node'lardan tamamen bağımsız, EŞ BÜYÜKLÜKTE bir draw-call kaynağı.
`linkWidth`'i 0'a çekmek yardımcı olmadı (Cylinder→Line, draw call sayısı
aynı kalıyor). Çözüm aynı desen: `linkVisibility={() => false}` (fast path
aktifken) react-force-graph'ın link/particle objesi YARATMASINI baştan
engelliyor (`visibleLinks = links.filter(visibilityAccessor)` — filtre
yaratmadan ÖNCE), yerine skor bazlı 4 kovaya (tier) bölünmüş kendi
`InstancedMesh` silindirlerimiz geliyor (pozisyon=orta nokta, quaternion
ile yön hizalama, `scale.y`=uzunluk — bkz. `fillInstancedLinks`).
**Sonuç: 8 draw call (4 node + 4 link tier'i), ama TBT YİNE hemen hemen
aynı kaldı (~4.2s).**

**2) Asıl darboğaz draw call değil, GPU fill-rate/overdraw çıktı.** CPU
profilini (CDP `Profiler`) PARENT-CHILD call tree'siyle yeniden analiz
edince "(program)" örneklerinin **%93.8'inin HİÇBİR JS call stack'i
olmadığı** görüldü — yani bu zaman JS içinde değil, GPU tarafında
(rasterizasyon/blend) geçiyor. `renderer.info.render.triangles`: **~4.9
milyon** — 6.236 düğüm × 2 (core+halo, her biri `SphereGeometry(1,16,16)`
= 512 üçgen) + 10.653 link (`CylinderGeometry` altıgen kesit) + hepsi
YARı-SAYDAM (`transparent:true`, alpha blend gerektirir — opak render'dan
çok daha pahalı, özellikle üst üste binen binlerce yarı-saydam yüzeyde/
"overdraw"). **Doğrulama deneyi:** küre segment sayısını 16×16/12×12'den
6×5'e indirmek TEK BAŞINA masaüstü TBT'yi **4.2s → 2.1s**'ye düşürdü —
draw call sayısından bağımsız, saf GEOMETRİK KARMAŞIKLIK azaltması.
Halo'ları veya linkleri TAMAMEN gizlemek (ayrı deneyler) yalnız ~150-300ms
daha kazandırdı — yani ASIL kazanç segment azaltmasından geldi, overdraw
katkısı ikincildi.

**Uygulanan nihai çözüm:** İki ayrı geometry seti — `UNIT_SPHERE_CORE_LOD`/
`UNIT_SPHERE_HALO_LOD` (6×5 segment, SADECE instanced toplu yol için,
6236 düğümün TAMAMI küçük/uzak, fark edilmiyor — bkz. ekran görüntüsü
karşılaştırması) ayrı tutuldu; `UNIT_SPHERE_CORE`/`UNIT_SPHERE_HALO`
ORİJİNAL 16×16/12×12 detayında KALDI, yalnızca `makeNodeObject`'in tek-
seferlik (seçili/hovered/ghost/dimmed) düğümleri için kullanılıyor — o
düğümler yakınlaşınca (seçilince kamera zoom yapıyor) düşük-poli fark
edilirdi, riske değmedi.

**Ölçülen nihai sonuç:** masaüstü TBT **~4.7s → ~2.1-2.6s** (sistem
yükünden kaynaklı gürültü var, bkz. yukarıdaki not — aynı anda 16
`next start`/`next dev` süreci çalışıyordu; ~%45-55 iyileşme aralığı
tutarlı ölçüldü). **Eşiğin (200ms) hâlâ üstünde — TAM çözülmedi.**
Kalan maliyet muhtemelen: (a) hâlâ ~2.5M+ üçgen + binlerce yarı-saydam
yüzeyin GPU-taraflı rasterizasyon maliyeti (segment sayısını DAHA da
düşürmek mümkün ama getirisi azalıyordu — halo/link gizleme deneyleri
küçük ek kazanç gösterdi), (b) sistem yükü gürültüsü (paylaşılan
makinede eşzamanlı ajan sayısı), (c) henüz izole edilmemiş üçüncü bir
faktör olabilir. **Daha fazla araştırma ayrı bir tur gerektirir** —
bu oturumda kapsam kasıtlı olarak burada durduruldu (azalan getiri +
zaten büyük bir iyileşme elde edildi).

**Doğrulama:** `npm run build` temiz; tüm etkileşim durumları (varsayılan
yükleme, hover, arama ile ayet seçimi → VersePanel/SurahInfoPanel açılması,
sûre filtresi) ekran görüntüsüyle doğrulandı, sıfır konsol hatası; mobil
(tr/en) 200 OK, sıfır hata; CLS 0.048 (regresyon yok); `audit-colors --ci`
179/182 (yeni `LINK_GOLD` sabiti zaten var olan bir tona denk geldiği için
taban değişmedi); `audit-internal-leak --ci` temiz.

**Ders — draw call sayısı ≠ tek performans metriği.** CPU-taraflı
optimizasyon (allocation, sonra draw call) her ikisi de GERÇEKTİ ve
DOĞRUYDU ama TBT'yi tek başına hareket ettirmedi; asıl darboğaz GPU
fill-rate'ti. Draw call profiline (`renderer.info.render.calls`) TEK
BAŞINA güvenip "8 draw call, sorun bitti" denseydi yanlış olurdu — üçgen
sayısı (`renderer.info.render.triangles`) ve CPU profilinin call-tree'si
(flat self-time değil, parent-chain) ile çapraz doğrulama gerekti.

#### 14 Ağustos (gece) · SurahComparator/ConceptGraph — sibling-position CLS kapatıldı

Kullanıcı onayıyla ("SurahComparator/ConceptGraph fetch-remount") bu iki
sayfanın gerçek fetch-remount kaynaklı CLS'i çözüldü — **kök sebep önceki
varsayımdan farklı çıktı**: sorun `LoadingOverlay`/skeleton'ın kendi boyutu
değil, **`CrossToolCTA`'nın KONUM sıçraması**. `CrossToolCTA` her iki
bileşende de loading/landing bloğunun koşulsuz render edilen KARDEŞİ;
üstteki blok küçükken (spinner) CTA'nın Y konumu yukarıda kalıyor, veri
gelip blok "gerçek içerik" boyutuna büyüyünce CTA aşağı fırlıyor — bu bir
boyut değişimi değil, bir **konum** sıçraması (Z3-V kök #2 ile aynı aile,
farklı mekanizma; teşhis `scratch-diag-sc2.mjs` ile çok-zaman-noktalı DOM
rect ölçümüyle yapıldı).

- **SurahComparator:** loading bloğuna `minHeight: '70vh'` yeterliydi —
  mobil CLS **0.768 → 0.094**, masaüstü ~0 → 0.005.
- **ConceptGraph — iki katmanlı sorun çıktı, tek `minHeight` yetmedi:**
  1. İlk `minHeight:'70vh'` denemesi CLS'i **kötüleştirdi** (0.325 → 0.519).
     Sebep: `verses`/`concepts` fetch'i bitince (`!verses||!concepts` artık
     false) loading bloğu kayboluyor, ama concept-verse map arka planda
     `setTimeout` ile chunk'lanarak hesaplanırken (`loadingData` state'i)
     bir süre daha `true` kalıyor — bu ARA PENCEREDE loading bloğunun
     koşulu (`loadingData`'ya hiç bakmıyordu) da landing bloğunun koşulu
     (`!loadingData` bekliyor) da false oluyor, **hiçbir şey render
     olmuyor**, CTA doğrudan header altına (y≈110) düşüyor — sonra gerçek
     landing gelince tekrar aşağı kayıyor. İki sıçrama, tek sıçramadan kötü.
  2. Loading bloğunun koşuluna `loadingData` eklendi (ara pencereyi de
     kapsuyor) + `minHeight:'100vh'` (gerçek landing içeriği — concept
     grid'in tam listesi — ~2757px, eşleştirmek anlamsız; bunun yerine
     skeleton'ı header+100vh > viewport yüksekliği yapıp CTA'nın başlangıç
     konumunu görünür alanın tamamen DIŞINA itmek yeterli oldu — CTA hiç
     görünür alana girmeden büyüyor, Layout Instability API görünür
     alan kesişimi sıfır olduğu için sıçramayı saymıyor).
     Sonuç: mobil CLS **~0.32 → 0.000** (8sn'lik uzun pencere ölçümüyle
     doğrulandı, standart 3sn'lik ölçüm zaten geçiyordu ama geçiş anını
     kaçırabiliyordu — kısa pencere yanlışlıkla "0.000" gösterebilir,
     ölçüm süresini içeriğin gerçekten yüklenip yerleştiği ana göre ayarla).

Doğrulama: `npm run build` temiz, `audit-colors --ci` 179/182,
`audit-internal-leak --ci` temiz, 4 rotada (tr/en × kavram/karsilastir)
sıfır konsol hatası. Commit `4782823`, push edildi.
- [ ] TBT ihlalleri (7 ölçüm) — ayrıca incelenmedi, CLS'in yanında ikincil.
- [ ] Kullanıcı notu: **"mobildeki yavaşlığı da çözelim"** — CWV'de LCP/FCP
      temiz çıktığı için bu his muhtemelen CLS'in kendisi (sayfa "zıplıyor"
      hissi) ya da TBT'nin ölçülmediği bir etkileşim senaryosu; ayrı
      incelenmeli, varsayımla kapatılmadı.

### 🔴 Z3-C2 · Z3b turunda ÇIKAN YENİ BULGULAR (2026-08-13 gecesi)

- [ ] **Z3c4 · `/arac/tum-araclar` — REGRESYON: tıklanabilir öge 68 → 66**
      `tools-navigation.spec.js:85` emniyet ağı yakaladı. **Sebep Z3a1/Z3b
      commit'leri DEĞİL**, iki yolla kanıtlandı:
      (a) kendi CSS'imi tarayıcıda açıp kapattım → sayı iki durumda da **66**;
      (b) o sayfayı besleyen üç dosya (`tools.jsx`, `toolCatalog.js`,
      `ToolsBrowser.jsx`) temel çizgi commit'inden (`901b7d5`) beri **hiç
      değişmemiş**.
      Yani regresyon `901b7d5..HEAD` arasında, paralel turda oluşmuş.
      **Temel çizgi bilerek güncellenmedi** — güncellenirse başkasının
      regresyonu silinmiş olur (kontrol listesi §J).
      ⚠ **14 Ağustos: test artık YEŞİL ama regresyon DÜZELMEDİ, MASKELENDİ.**
      Araç bağlantısı 50 → **57**, çünkü ibadetler'in 7 rotası eklendi
      (`1d5fdd8`); **+7, eksik −2'yi örttü**. Emniyet ağı artık bu kaybı
      koruyamıyor — testin sabit bir alt kümeyi sayması gerek.
      - [ ] Kaybolan 2 ögeyi bul: `git bisect` ya da ara commit'lerde ölç
- [x] ~~**Z3c6 · `Conclusion` CTA'sı kullanıcıyı EN BAŞA götürüyordu**~~ — **KAPANDI** `1f3c412`
      `handleScrollToPaths` `#path-cards`'a scroll ediyordu; o id PathCards
      anasayfadan kaldırılalı beri **hiç yoktu**, kod her seferinde fallback'e
      düşüp `scrollTo(0)` yapıyordu. Buton çalışıyor **görünüyordu** — sessiz
      bozulma. Hedef `#six-gates` oldu. (Ölü kod taraması sırasında çıktı.)
- [x] ~~**Z3c5 · `/arac/tum-araclar` katalogun tamamını göstermiyor**~~ — **KAPANDI** `afc09f2`
      **Bulgu bayatlamıştı** — 13 Ağustos'ta `ToolsBrowser` zaten `TOOL_CATALOG`'u
      `EXTRA_TOOLS` bölümüyle devreye almıştı (50/55 artık geçerli değildi;
      ölçülen: `TOOL_CATALOG.length` **62**, sayfa **57** gösteriyordu).
      Gerçek kök neden: `COVERED_ROUTES = new Set(Object.values(TOOL_ROUTES))`
      TOOL_ROUTES haritasının **tamamını** (27 rota — bazıları
      PsychologySection/CennetCehennem/iblis gibi başka sayfalardaki butonlar
      için) "üstte kart var" sayıyordu; üstteki 21 kart aslında yalnız 23
      event kullanıyordu. Fazladan 4 rota (Tabiat Atlası, Nefs Mertebeleri,
      İblis & Şeytan, İlk-Son Kelimeler) `EXTRA_TOOLS`'tan yanlışlıkla
      filtrelenip sayfada **hiç görünmüyordu**. Düzeltme: `COVERED_ROUTES`
      artık yalnız üstteki kartların gerçekten kullandığı event'lerin
      rotalarından türetiliyor.
      Doğrulama: TR+EN link sayısı **61**, başlık "61 araç" yazıyor, konsol
      hatası yok, eslint temiz.

- [x] ~~**Z3c7 · `/graf/semantik` panelinde ham `**` markdown**~~ — **KAPANDI** `0767c51`
      **Denetim taraması bunu KAÇIRMIŞTI.** Probe `/tr/graf/semantik`'te
      ham `**` = 0 diyordu; çünkü küme detay paneli **varsayılan olarak
      KAPALI** ve probe onu hiç açmadı. Ekran görüntüsüne bakınca göründü:
      özet, wow notu ve kaynaklar ham markdown basıyordu (14 örnek).
      `renderInlineMarkdown`'a bağlandı → 0, `<strong>` 9 + `<em>` 20.
      - [ ] **Ders, kontrol listesine eklenecek:** "sayfa açık" ile "her
            DURUM açık" aynı şey değil. Sekme/panel/akordiyon arkasındaki
            içerik otomatik taramada görünmez.

### 🟠 Z3-D · Sistem/kural ihlalleri

- [x] ~~**Z3d1 · §13.22 ihlali — `/atlas/ibadetler/*` RAG corpus'unda YOK**~~
      **KAPANDI** `1d5fdd8`. Ayrıntı yukarıda (Z3 başındaki blok).
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `grep -n "ibadetler" scripts/corpus-sources.mjs` → **0 sonuç.**
      8 JSON · **724 KB** içerik (namaz, oruç, zekât, hac, kurban, tövbe, zikir,
      hub) ne `TOOL_CATALOG`'da (55 giriş) ne corpus'ta. `/arac/wow` da yok.
      Sonuç: `/sor`'a "oruç nedir" diye sorulunca bu sayfalar **hiç önerilmiyor.**
      §13.22 bu pipeline'ı "MUTLAK" diye tanımlıyor ve "İstisna: Yok" diyor.
      ✅ Ters yön temiz: corpus'ta olup rotası olmayan giriş **0** (404 riski yok).
- [x] ~~**Z3d2 · §13.24 ihlali — `WowFacts.jsx:1400`**~~ — **KAPANDI** `0767c51`
      "Arkeoloji ve tarihin onayladığı" → "Kur'ânî anlatılarla tarihsel
      bulguların **temas noktaları**". Hedef sayfa 26 Temmuz'da düzeltilmiş,
      ona giden kartın metni atlanmıştı.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      > `descTr: "Arkeoloji ve tarihin **onayladığı** Kur'ânî iddialar…"`
      > `descEn: "Quranic claims **confirmed by archaeology** and history…"`
      §13.24 "confirmed by archaeology" kalıbını **isim isim** yasaklıyor
      (tasdikin öznesi arkeoloji olamaz). Hedef sayfanın (`tarihsel-kanitlar`)
      içeriği 26 Temmuz'da düzeltilmiş; **ona giden kartın metni düzeltilmemiş.**
- [x] ~~**Z3d3 · §13.15 — 9 okuma-dışı JSON'da Uthmani karakter**~~ — **KAPANDI** (14 Ağustos)
      472 JSON tarandı. `corpus/*` ve `verse-graph-bgem3` **muaf** (CSS tecvid
      overlay pipeline'ı).
      - [x] **`semantic-map.json`** (466) — normalize edildi (192 alan). Not:
            `central_verses_full.arabic/.surahName` alanları şu an **hiçbir
            yerde render edilmiyor** (ölü veri, `VerseChip` kanonik grafikten
            okuyor) — risk yoktu ama JSON yine de kirliydi, düzeltildi.
      - [x] **`kadinlar.json`** (44) — normalize edildi (14 alan). Ayrıca
            **`KadinlarAtlasi.jsx`'in kendi `normalizeAr` kopyası** kanonik
            `cleanArabicForDisplay`'den EKSİKTİ (U+06DF/06E5/06E6 yok) —
            concierge-hydrate.js'teki Hûd 11:24 hatasıyla AYNI SINIF. Kopya
            silindi, `lib/arabic.js`'ten import ediliyor (§13.15 tek-kaynak).
      - [x] **`kuranin-renkleri.json`** (2) — normalize edildi. Ayrıca
            **`KuranRenkleri.jsx`'te 5 âyet JSON'dan DEĞİL, component içine
            hardcode edilmiş** (`verseAr:` sözlük literalleri) ve hiç runtime
            koruması yoktu — bu GERÇEK, canlı bir tofu riskiydi (ölü veri
            değil). 8 render noktası (`verseAr`×4, `arabic`×4)
            `cleanArabicForDisplay` ile sarıldı. Doğrulama: "Cennet" ve
            "Kıyamet" sekmeleri canlı test edildi, 0 sorunlu karakter, 0 hata.
      - [x] **`ilk-son-kelimeler.json`** + **`-spotlights.json`** — runtime'ın
            kendi kullandığı **`cleanArabicMinimal`** ile (dosya bazında değil,
            TÜM ham metne tek geçiş regex uygulanarak — alan-alan yaklaşım
            deneme turunda substring çakışması yüzünden 74 alanı atlıyordu,
            bu yöntem o riski tamamen ortadan kaldırıyor) normalize edildi.
            ⚠ Kasıtlı: `cleanArabicMinimal` tajwid/waqf aralığını (ۖ-ۭ vb.)
            hiç temizlemiyor — bu bilinçli, hafif bir fonksiyon (bkz.
            `lib/arabic.js` başlık yorumu). Bu yüzden 545/1 karakter **kasıtlı
            olarak kaldı** — bug değil, mevcut (ölçülmüş, 0 tofu) davranışla
            birebir eşleşiyor. Daha güçlü bir fonksiyona geçmek ayrı, görsel
            doğrulama gerektiren bir karar.
      - [x] **`nefis-mertebeleri.json`** — `cleanArabicForDisplay` ile tam
            temizlendi (kalan 0). Doğrulama: `/arac/ilk-son-kelimeler`
            (275 [lang=ar] öge) ve nefis-mertebeleri sayfası canlı test
            edildi, 0 hata.
      - **`dua-arabic.json`** (71) — todo'daki "runtime: —" notu YANLIŞTI:
            `ProphetAtlas.jsx`'in kendi `cleanDuaAr` fonksiyonu var (kasıtlı,
            "lib'den FARKLI" diye belgelenmiş) — risk düşük, dokunulmadı.
      - **`verse-metadata.json`** (2) — bunlar Kur'an metni DEĞİL: "concepts"
            anahtar kelime dizisindeki bozuk Türkçe kelimeler ("nتیجe" =
            "netice", "nعیm" = "naîm" olmalı, klavye dili yanlışlıkla
            değişmiş). §13.15 kapsamı dışı, ayrı bir veri kalitesi hatası —
            düzeltilmedi, burada not edildi.
- [x] ~~**Z3d4 · `DesktopSidebarTOC.jsx:38` — `NAVBAR_HEIGHT = 62` (dördüncü kardeş)**~~ — **KAPANDI** (14 Ağustos)
      Her iki dosya da `useNavbarOffset(0, 62)` kullanacak şekilde değiştirildi
      (`ToolHeader.jsx`'teki aynı çağrı biçimi — `min=62` yalnız ilk render'da).
      `DesktopSidebarTOC.jsx`: çapa kaydırma + `maxHeight` artık ölçülen değeri
      kullanıyor. `AhiretYolculugu.jsx:200`: `HEADER_OFFSET` sabiti
      `navTop + 48 + 70`'e çevrildi, `useEffect` bağımlılığına `navTop` eklendi.
      Doğrulama: gerçek navbar altı 62-82px arasında ölçüldü (kaydırma
      durumuna göre), iki sayfada da 0 konsol hatası.

### 🟠 Z3-E · İki dillilik (Z1'de yok)

- [x] ~~**Z3e1 · `/en/oku` metadata'sı TAMAMEN Türkçe**~~ — **KAPANDI** `0767c51`
      §16.3'ün bilingual biçimine geçirildi. Artık "Read the Quran" +
      tam İngilizce açıklama.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `<title>Kur'an'ı Oku | QuranCodex</title>` ·
      `description: "Per-sure tilavet (6 kâri) + karaoke kelime senkronizasyonu +
      tajweed + Elmalılı/Ibn Kathir tefsir paneli + interlinear kelime-kelime
      çeviri."` — sitenin **amiral gemisi sayfası**, İngilizce aramada böyle çıkar.
- [x] ~~**Z3e2 · 9 EN rotasında etiket sızıntısı**~~ — **KAPANDI** `0767c51`
      Üç kök: `WowFacts.surahRef` tek dilli · `DogaAtlasi.CTX_LABELS` tek dilli
      (dosyada EN haritası zaten vardı, bağlam rozetleri unutulmuş) ·
      `DiyalogAgi` **iki katmanlı** — `getNodeLabel` hep `nameTr` okuyordu ve
      ondan önce devreye giren `NODE_LABELS` tamamen Türkçeydi.
      Ölçüm: 4 EN rotası temiz, `/tr/graf/diyalog` Türkçe korundu.
      ⚠ Sûre adlarının Türkçe transliterasyonu (`Eş-Şems`, `El-İnşirah`)
      **bilerek dokunulmadı** — ayrı bir adlandırma kararı.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      | rota | sızan dize |
      |---|---|
      | `/en/atlas/doga` | **"Sûre Adı"** (tablo başlığı) · "Kıssa" · "Arı" |
      | `/en/arac/buyruklar` | âyet **çevirileri Türkçe**: "Namazı kılın…", "Oruç sizden…" |
      | `/en/arac/wow`, `/en/arac/kurani-tani` | "Çeşitli sûreler" |
      | `/en/atlas/ibadetler` | "Oruç" |
      | `/en/graf/diyalog` | **"DiğerPeygamberler"** (ayrıca **boşluk da yok**) · "Münafıklar" |
      | `/en/arac/ilk-son-kelimeler` | "mukattaa (şifre)" · "kurtuluşa erersiniz" |
      | `/en/atlas/kadinlar` | "Mûsâ'nın annesi" |
      | `/en/arac/iblis-seytan` | "3 farklı" |
      ⚠ Not: Türkçe-karakter taraması 47 rota işaretledi ama **38'i yanlış pozitif**
      (Zemahşerî, İbn Kesîr gibi özel adlar) — GPT-5.4'ün uyarısı doğruymuş.
      Yukarıdaki 9'u cümle/etiket düzeyinde tek tek doğrulandı.
- [ ] **Z3e3 · EN'de sayı biçimi karışık — aynı satırda**
      `/en/graf/ayet`: "**6.236** verses · **10,653** similar verse pairs".
      Biri TR ayracı, öbürü EN. (Kontrol listesi E: `toLocaleString`.)
- [x] ~~**Z3e4 · 5 sayfada başlıkta çift marka**~~ — **KAPANDI** `0767c51`
      `ayet` + `kutuphanem` düzeltildi. **Paylaşım metinlerinde marka KALDI**
      (VerseShareRoute, /sor) — orası site dışına gider, sonek orada doğru.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      `Kütüphanem — QuranCodex | QuranCodex`. Sayfa `— QuranCodex` ekliyor,
      `_shell.jsx:39` `template: '%s | QuranCodex'` bir kez daha ekliyor.
      Manuel sonek kullanan 5 dosya: `grep -rl "— QuranCodex" src/app/\[locale\]`

### 🟡 Z3-F · Mimari / SEO

- [x] ~~**Z3f1 · Mega-menü ögeleri `<a>` değil `<button>`**~~ — **KAPANDI** `bbbd3ec`
      Masaüstü mega-menü **60 buton/1 bağlantı → 7 buton/54 bağlantı**;
      mobil çekmece **25 → 78 bağlantı**. Kalan butonlar bilinçli (akordiyon
      gibi gerçek eylemler).
      **Yan kazanç — sessiz bir hata daha kapandı:** "bölüm" ögeleri
      `scrollTo(id)` çağırıyordu; anasayfada çalışıyor ama **başka bir
      sayfadan tıklanınca hiçbir şey yapmıyordu** (id DOM'da yok). Artık
      gerçek çapa: `/tr/sor`'dan "Dilsel DNA" → `/tr#mukattaa-card`,
      scrollY 5522. Escape hâlâ kapatıyor.
      *Aşağıdaki özgün bulgu kaydı arşiv:*
      DOM zinciri: `SPAN < SPAN < BUTTON < DIV` (öge: "Dilsel DNA").
      Anasayfada menü kapalı 24 `<a>`, açık **yine 24** — yani 36+ keşif ögesinin
      **hiçbiri bağlantı değil.** Orta tık · "yeni sekmede aç" · URL önizlemesi ·
      arama motoru taraması **hepsi kayıp**. Z1f "31 rota" diyor ama navbar
      **74 rotanın hepsinde** var; sitenin birincil keşif yüzeyi bu.
      ✅ `Escape` kapatıyor + odak tetikleyiciye dönüyor (G3 **doğrulandı**).
- [~] **Z3f2 · 74/140 sayfa sunucuda yalnız "Yükleniyor…" döndürüyor** — **KISMEN KAPANDI** (14 Ağustos, 28/38 dosya)
      Kök sebep: `useEffect` içinde `fetch('/x.json')` — sunucu `useEffect`
      çalıştıramaz, ilk render'da veri yok. `PageHeading` SEO sinyalini
      kurtarıyor ama gövde içeriği sunucuda yoktu; JS başarısız olursa sayfa
      boş kalıyordu. Toplam **38 bileşen** bu kalıbı kullanıyor.
      Düzeltme deseni: `fetch` → build-time `import x from '../../public/x.json'`
      (AhiretYolculugu.jsx'teki 2026-07-15 audit fix'iyle aynı — o dosyada
      zaten kanıtlanmıştı). Tüm JSON'lar 8KB-204KB, bundle'a eklemek güvenli
      (`verse-graph-bgem3.json` 12MB HARİÇ — o dosyaları statik import ETMEDİM).
      - [x] **22 dosya düzeltildi**: KiraatAtlasi, BilimselIsaretler, DogaAtlasi,
            DuaVerses, ElestirelCerceve, AddresseeSystem, InsanYolculugu,
            NedenSonuc, KavimlerAtlasi, KiyametSahneleri, KuranYeminleri,
            KuranRetorigi, KitapKavrami, RetorikSorular, NefisMertebeleri,
            MunafikProfili, RevelationTimeline, MunasebatAtlasi,
            SunnetullahAtlasi, QuranCommands, TarihselKanitlar,
            YakinAnlamliNuanslar. Doğrulama: 22 rotanın 22'sinde de SSR HTML
            50-233KB gerçek içerik (50-233KB), "Yükleniyor" **0**, konsol
            hatası **0** (Playwright canlı test).
      - [x] **6 dosya daha düzeltildi** (14 Ağustos, ikinci tur — risksiz
            olanlar seçildi): `CennetCehennem`, `FurukAtlasi`, `SebebiNuzul`
            (2 fetch, biri alt-bileşende), `MeselAtlasi` (7 küçük `/amthal/*`
            JSON), `DiyalogAgi` (5 JSON), `IlkSonKelimeler` (2 JSON — bugün
            Z3d3'te normalize edilenle aynı dosyalar). Toplam kapanan: **28/38**.
            Doğrulama: 6 rotanın 6'sında SSR 63-499KB gerçek içerik,
            "Yükleniyor" 0, konsol hatası 0.
      - [ ] **10 dosya kaldı** — hepsi daha riskli/farklı bir yaklaşım istiyor:
            - `ConceptGraph`, `EsmaFrekans`, `VerseGraph`, `SurahComparator`,
              `WordHeatmap`, `ReadingMode` → `verse-graph-bgem3.json`
              (12MB) tüketiyor, statik import bundle'ı şişirir — sayfa
              seviyesinde sunucu-tarafı fetch + prop olarak geçirme gerekir
              (bkz. `/ayet/[surah]/[ayah]/page.js`'teki 2026-08-13 çözüm).
              `ReadingMode` ayrıca 11.289 satır (Z3g2) — izole risk.
            - `Navbar` → içerik değil, `/dua-verses.json` fetch ediyor, amacı
              net değil, HER sayfada render ediliyor — hata etkisi site geneli
              olur, incelemeden dokunulmadı.
            - `KissaAtlas.jsx`, `Melekler.jsx` → **dokunulmadı**, başka bir
              agent bu dosyalarda aktif çalışıyordu.
            - `KadinlarAtlasi.jsx`, `KuranRenkleri.jsx`, `SemanticMap.jsx` →
              bugün (Z3d3) farklı bir düzeltme için zaten değiştirildi, aynı
              turda ikinci kez dokunmadım — ayrı bir işlem olarak yapılmalı.
- [ ] **Z3f3 · Sekme/filtre durumu URL'ye yazılmıyor (kontrol listesi R)**
      `/tr/atlas/melekler` — sekme değiştirildi, URL sabit kaldı. Geri tuşu
      önceki sekmeye dönmez, URL paylaşılınca durum kaybolur. Atlas/graf
      sayfalarının çoğunda aynı kalıp.

### 🟠 Z3-F2 · 1024px'te kalan navbar örtüşmesi (5 rota)

- [ ] **Z3f4 · Navbar hâlâ içerik örtüyor — yalnız 1024px'te, 5 rotada**
      1440 ve 390'da **0** örtüşme; kırılma penceresi Z3a1 ile aynı (sarma).
      `document.elementFromPoint` ile doğrulandı — "görünüyor ama tıklanamıyor":
      | rota | örtüşme | örtülen öge |
      |---|---:|---|
      | `/en/graf/ayet` | **62px** | "← Surahs" butonu · "All Surahs ▾" · "Clear" |
      | `/en/sor` | **58px** | "← HOME" bağlantısı · "Press ESC to close" |
      | `/tr/sor` | **32px** | "← ANASAYFA" · "ESC ile kapat" |
      | `/en/graf/diyalog` | **24px** | 5 sekme butonu (Network Map, Dialogues…) |
      | `/en/atlas/kissa` | **18px** | 8 peygamber çipi (Moses, Joseph…) |
      **Beşinin dördü İngilizce** — tek dilde test bunu kaçırırdı (kontrol
      listesi Parti 1'in dersinin aynısı). Z3a1 düzeltilirse bu da düşer.

- [ ] **Z3f5 · Mobil sayfa uzunluğu — 8 rota 23.000px üstünde (karar gerekiyor)**
      `/en/arac/dualar` **36.755px** (~43 ekran) · `esma-frekans` 36.743 ·
      `/en/tefekkur` 32.286 · `atlas/kadinlar` 28.153 · `ilk-son-kelimeler` 25.041 ·
      `kurani-tani`/`wow` 24.370 · `/en` 23.001.
      Kontrol listesi 2.5'te eşik kaldırıldı; sorulacak soru: **atlama aracı var mı**
      (raf/ToC/çapa) ve **uzunluk artıyor mu**. Bu 8 rotada ikisi de bakılmadı.

### 🟡 Z3-G · Kod sağlığı

- [ ] **Z3g1 · eslint: 541 hata + 35 uyarı, 89 dosya**
      | kural | adet | not |
      |---|---:|---|
      | `react/no-unescaped-entities` | 451 | kozmetik, `--fix` yok |
      | `react-hooks/set-state-in-effect` | **50** | gereksiz render turu |
      | `react-hooks/refs` | **18** | render sırasında ref okuma (17'si `ReadingMode`) |
      | `react-hooks/static-components` | 7 | her renderda yeni bileşen tipi |
      | `react-hooks/rules-of-hooks` | **2** | → Z3c1 |
      | `@next/next/no-img-element` | 10 | `<img>` yerine `next/image` |
- [ ] **Z3g2 · `ReadingMode.jsx` 11.289 satır** (sonraki en büyük 3.869).
      Tek dosyada 18 `react-hooks` ihlali; sitenin en kritik sayfası.
- [ ] **Z3g3 · 4 gereksiz `'use client'`** — `FramingBadge` · `SiblingPageLink` ·
      `SourcesCitation` · `StatCard` (hook/olay/window yok).

### ✅ Z3-H · ÖLÇÜLDÜ ve TEMİZ ÇIKTI (tekrar denetlemeye gerek yok)

| Kontrol | Sonuç |
|---|---|
| HTTP durumu | **140/140 → 200** |
| Yatay kaydırma | **0** (140 sayfa × 3 genişlik) |
| Tofu / replacement karakter | **0** |
| `alt`'sız görsel | **0** |
| Adsız bağlantı | **0** |
| Navbar sayfa içeriğini örtüyor (1440 · 390) | **0** |
| Navbar örtüşmesi 1024 | ❌ **5 rota — temiz DEĞİL**, ayrı madde: **Z3f4** |
| `canonical` | 138/140 (yalnız `/kutuphanem` yok — **`noindex:true`, doğru davranış**) |
| `hreflang` tr/en/x-default | **140/140 doğru** ⚠ Next `hrefLang` (camelCase) basıyor; küçük harf arayan regex **yanlış negatif** verir — 0.1 tuzağı |
| Font zinciri (kontrol listesi T) | `kfgqpc-hafs.otf` 200 · `ShaykhHamdullah.ttf` 200 · `document.fonts` → **loaded** |
| Skip link | odakta `translateY(0)`, görünür, odağı `<main>`'e taşıyor |
| Mega-menü `Escape` | panel opacity **1 → 0**, odak **tetikleyiciye** dönüyor |
| Dinamik rota 404 | `tefekkur/olmayan-slug` · `peygamber/9999` · `oku/115` · `oku/0` · `peygamber/abc` → **404** |
| Dil değiştirici | `/tr/atlas/kissa` → `/en/atlas/kissa` — rota korunuyor |
| `/sor` iki dilde | TR + EN çalışıyor · API 200 · **576ms** · `X-Degraded` yok |
| i18n anahtar paritesi | tr 398 ↔ en 398, gerçek eksik **0** (`*Tr`/`*En` sonekleri kasıtlı) |
| Renk denetimi | taban aşılmadı (184 / 1.176) · CLAUDE.md §4 ↔ `tokens.js` uyumlu |
| `prefers-reduced-motion` | 3 kural · `:focus-visible` 5 kural |
| Mobil sayfa uzunluğu | ⚠ karar bekliyor, ayrı madde: **Z3f5** |

---

## Z2 · Uygulamanın tamamı hiç puanlanmadı

- [x] **Düzeltmelerden sonra: 74 → 82/100** (13-14 Ağustos, `038f346..1d5fdd8` push edildi)

      Ölçüldü, tahmin edilmedi — 14 rotada göstergeler yeniden okundu:

      | Gösterge | Denetimde | Şimdi |
      |---|---:|---:|
      | Adsız buton | 114 (tek sayfada) | **0** |
      | Arapça `lang`/`dir` eksik | 260 öge | **0/471** |
      | Ekranda ham `**` | 3 rota | **0** |
      | Konsol hatası | 5 rota | **0** |
      | Başlık seviyesi atlaması | 29 rota | 6 örneğin **1'i** |
      | Navbar kırılması (1024–1180) | 148 sayfa | **0** (font büyütmede de) |
      | Ölü tıklama | 10 düğme | **0** |
      | Geçersiz âyet URL'i | 200 + indekslenebilir | **404 + noindex** |
      | 404 sayfası | çıplak, dilsiz, çıkışsız | **dilinde, navbar'lı, 3 çıkışlı** |
      | Ölü kod | 916 satır + her sayfada provider | **silindi** |
      | Etiketsiz svg | 166/285 | **0/901** |
      | Gezinme `<button>` (mega-menü) | 60 buton / 1 bağlantı | **7 / 54** |
      | Gezinme `<button>` (mobil çekmece) | 25 bağlantı | **78 bağlantı** |
      | `/sor` ibadetler içeriğini biliyor mu | hayır (724 KB görünmez) | **evet** |

      | Eksen | Denetim | **Şimdi** | Kalan engel |
      |---|---:|---:|---|
      | İçerik & editoryal | 86 | **86** | §13.24 ihlali (Z3d2) hâlâ açık |
      | Teknik sağlamlık | 72 | **82** ▲10 | 538 lint · 74 sayfa SSR'da boş · Z3c4 regresyonu |
      | Görsel tasarım | 76 | **80** ▲4 | B1 (tek kompozisyon fikri) — tasarım kararı |
      | Bilgi mimarisi | 76 | **85** ▲9 | `/arac/tum-araclar` 50/55 · Z3c4 regresyonu |
      | Erişilebilirlik | 66 | **80** ▲14 | kontrast gerçek taban **1.095** (K1-K4+K6 kapandı) · kalan: K5 (mobil) + 608'lik uzun kuyruk |
      | SEO / sunucu render | 70 | **79** ▲9 | 74 sayfa SSR'da boş · kök 404 çıplak |
      | İki dillilik | 72 | **74** ▲2 | 9 rotada EN sızıntı · `/en/oku` metadata TR |
      | Tutarlılık | 70 | **74** ▲4 | 184 token dışı renk (önce **karar** gerek) |

      **85+ için sırayla gereken:** ~~① etiketsiz svg~~ ✅ `f4491e0` ·
      ~~② navbar gezinmesi~~ ✅ `bbbd3ec` · ~~③ ibadetler RAG~~ ✅ `1d5fdd8` ·
      ~~④ KONTRAST — Z3-K (K1-K4+K6)~~ ✅ `5d966f7`+`b142302`+`0a002b6`+`d44abb4`
      (1.465 gerçek taban → **1.095**; kissa hariç 976 → 608, K5 + uzun
      kuyruk hâlâ açık ama artık öncelik değil)
      ~~⑤ CWV — Z3-V (kısmen)~~ ✅ `3278f4f`+`d1ca000` (140 sayfada ilk kez
      ölçüldü: 78 ihlal, hepsi CLS/TBT, sıfır LCP/FCP; kök #1 kapandı,
      78→59; kök #2 — veri-yükleme iskeleti remount'u — sonraki tur)
      ① renk kararı + göç (C2 — K2 ile aynı kök)
      ② EN sızıntıları (Z3e2) ③ sayfa-içi gezinme `<button>`ları (Z1f kalanı)

      ⚠ **Not düştü, çünkü bilinmeyen ölçüldü.** Erişilebilirlik 86 iken 72'ye
      indi: 86 sayısı "kontrast bilinmiyor" varsayımının üstünde duruyordu.
      Gerçek zemine oturmak puanı düşürdü ama tahmini gerçeğe çevirdi.

      | Eksen | Anasayfa | **Uygulama** | Farkın sebebi |
      |---|---:|---:|---|
      | İçerik & editoryal dürüstlük | 85 | **86** | §13.24 disiplini gerçekten uygulanmış; 1 ihlal (Z3d2) |
      | Teknik sağlamlık | 82 | **72** | 140/140 200 ama Z3c1/c2/c3 gizli bombaları + 541 lint hatası |
      | Görsel tasarım | 72 | **76** | Araç sayfaları anasayfadan **daha** çeşitli; 1024 navbar kırığı düşürüyor |
      | Bilgi mimarisi | 80 | **76** | Mega-menü zengin ama 8 rota katalog/corpus dışında |
      | Tutarlılık | 76 | **70** | 184 token dışı renk + şema sürüklenmesi (Z3a2) + 4 kopya katalog |
      | İki dillilik | — | **72** | Parite tam ama EN'de 9 rota sızıntı + `/en/oku` metadata TR |
      | Erişilebilirlik | 76 | **66** | 114 adsız buton · 88 rotada etiketsiz svg · 20 rotada `lang`/`dir` eksik · gezinme `<button>` |
      | SEO / sunucu render | — | **70** | canonical+hreflang kusursuz; 74 sayfa SSR'da boş, geçersiz âyet indekslenebilir |

      **Neden 74:** iskelet sağlam (0 yatay kaydırma, 0 tofu, 140/140 200,
      hreflang kusursuz, fontlar yükleniyor, `/sor` iki dilde çalışıyor) ve
      **içerik sitenin en güçlü tarafı**. Notu düşüren şey yeni özellik eksikliği
      değil, **anasayfada çözülmüş hataların diğer sayfalarda kardeşlerinin
      durması**: ölü tıklamalar (3 yer), sabit navbar yüksekliği (4. yer),
      gezinmenin `<button>` ile yapılması (navbarın kendisi), ham `**`.
      **80'e giden en kısa yol:** Z3a1 + Z3a2 + Z3b (ölü tıklamalar) + Z3c1 —
      dördü de küçük, dördü de görünür.

- [ ] Kalan ölçülmemiş: **kontrast** ve **CWV** yalnız anasayfada ölçüldü;
      diğer 73 sayfada hiç bakılmadı (`measure-vitals.mjs` üretim build'i ister).
- [ ] Uygulama puanı için gereken: `measure-vitals.mjs` tüm rotalarda +
      her sayfa tipinden en az bir örneğin gözle incelenmesi
- [ ] ⚠ Tam tarama bir turda **10 dakikayı aşıyor** — parti parti yürütülmeli

---

# 🚀 DEPLOY DOĞRULAMASI (yapılmadı)

- [ ] Vercel'de KV ortam değişkenleri bağlı mı? (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
      Yerelde doğrulandı, **canlıda doğrulanmadı.**
- [ ] `CONCIERGE_DAILY_BUDGET=1` ile bir kez canlı test, sonra 500'e geri al

---

# 🔬 NASIL DENETLEDİM — YÖNTEM

> Diğer 73 sayfaya aynı süreci uygulamak için. Sayfa-sayfa uygulanacak
> ayrıntılı liste: **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)**

### 1 · Önce ölç, sonra konuş
Hiçbir bulgu "bence" ile başlamadı; her biri bir **sayı**, **seçici** veya
**ekran görüntüsü** taşıdı. Bu disiplini iki kez ihlal ettim, ikisinde de
yanıldım: (a) *"tüm renkler token'dan geliyor"* — ölçünce **184 token dışı
renk** çıktı; (b) *"`/arac/tum-araclar` yok"* — vardı ve 21 araç gösteriyordu.
İkincisi kullanıcının kararını değiştirebilecek bir yanlıştı.

### 2 · Değişiklikten ÖNCE gerçek temel çizgi
`git stash` ile "önce" ölçülür, sonra dokunulur. Emniyet ağları taşımadan
**önce** kurulur. Bu koruma marka adı değişikliğinde bir bağlantı kaybını
gerçekten **yakaladı**.
> ⚠ Bir kez ihlal ettim: `color-before` görüntülerini değişiklikten sonra
> yakalayıp gerçek "önce" hâlini kaybettim.

### 3 · Üç genişlik × iki dil = 6 koşu
`1440` · **`1024`** · `390`, hem `/tr` hem `/en`.
**1024 atlanamaz** — bu turdaki iki ciddi hata yalnız orada vardı: navbarın
chip rafını **31px örtmesi** ve `SixGates`'in 1.334px'e çıkması.

### 4 · DOM yetmez, render'a bak
`\"bilimsel mucize\"` diye ekranda **ters bölüler** görünüyordu; baseline testi
yeşildi çünkü yalnız âyet/başlık/bağlantı tutuyordu. Hata **ekran görüntüsüne
gözle bakınca** bulundu. Artık baseline gövde metnini de tutuyor.

### 5 · "Görünüyor" ≠ "tıklanabilir"
```js
document.elementFromPoint(x, y)   // o noktada gerçekte kim var?
```

### 6 · Sabit sayıları ölçülen gerçekle karşılaştır
Bu turun en verimli hata sınıfı: `NAVBAR_HEIGHT = 62` (gerçek 69/93) ·
`padding: 64` (navbar altı 82) · `isMobile={false}` sabit prop (mobil dal hiç
çalışmamış) · `minHeight: 320px` (kısaltma kazancını yutuyordu) ·
`PLANNED_TOTAL = 44` (52 makale → "0 planlanan").

### 7 · Kırmızı testin sebebini kanıtla
`concierge.spec.js:240` için API'ye istek atıldı → `reason: "ip"` → sebep benim
değişikliğim değildi. **Ama tersi de oldu:** `SEMANTIC is not defined` ile sayfa
500 döndü, sebep bendim.

### 8 · İçerik koruyan refactor'da git geçmişiyle karşılaştır
14 dosya silindikten sonra **210 metin alanı** `git show 1a1cd26:...` ile tek
tek karşılaştırıldı → **0 fark**.

### 9 · Her turda: build + tam test + renk denetimi
```bash
npm run build && npx playwright test && node scripts/audit-colors.mjs --ci
```
Build'in geçmesi yetmez — dev sunucusu ayrı kırılabiliyor:
`.next/dev/logs/next-development.log` okunur.

---

## 📌 Notlar

- `tests/homepage-audit.spec.js` regresyon testi değil, **ölçüm aracıdır**
- Emniyet ağları: `homepage-link-inventory` (17 bağlantı · 19 çapa) ·
  `homepage-card-text` (14 kart · TR+EN · Arapça + başlık + **gövde metni**)
  Kasıtlı güncelleme: `UPDATE_BASELINE=1`
- Tefekkür makalelerine ait açık işler ayrı dosyada: `to_do_tefekkur.md`
  (34 makalenin özetinde vurgu eksikliği — mekanik iş **değil**)
- §13.24 muafiyeti: tefekkür makaleleri yazarın kendi görüşü, GPT denetimine sokulmaz
