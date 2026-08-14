# 🎯 QURANCODEX — AÇIK İŞLER

> Bu dosyada **yalnızca yapılacaklar** durur. Tamamlananlar 13 Ağustos 2026
> akşamı silindi — kayıtları commit mesajlarında (`11c61b2..81fc1d1`, 40 commit).
> Yarım kalanlar ve emin olmadıklarım **kaldı** ve öyle işaretli.
>
> Sayfa-sayfa denetim ve **74 rotanın rota-rota açık bulguları**:
> **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)** → §7
>
> ⚠ **Aşağıdaki puan tablosu YALNIZ ANASAYFA içindir.** Uygulamanın tamamı
> hiç puanlanmadı — bkz. **Z2**.

---

## 📊 MEVCUT DURUM — **78/100** (13 Ağustos 2026 gecesi, düzeltmelerden sonra)

> Gün içindeki seyir: **76 → 73 → 78.**
> 76'yı GPT bölümleri bilinmezken vermiştim. Ölçünce 73'e düştü (5 hata).
> Beşi de düzeltildi ve bir bulgunun **yanlış** olduğu ortaya çıktı → 78.

| Eksen | Sabah | Ölçüm sonrası | **Şimdi** | Kalan |
|---|---:|---:|---:|---|
| Erişilebilirlik | 68 | 58 | **76** ▲ | Kontrast **hâlâ ölçülmedi** · mega-menüde focus trap yok · 2 svg etiketsiz |
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

- [x] **A3 · Klavye gezintisi test edildi** — skip link, tab sırası, gizli raf
      ve `Escape` ölçüldü ve düzeltildi (bkz. G bölümü). **Kalan:** mega-menüde
      hâlâ **focus trap yok** — `Escape` kapatıyor ama `Tab` menüden dışarı
      kaçıyor. Panellerde `role` da yok (disclosure kalıbı bilinçli tercih).
- [ ] **A4 · Mega-menüde focus trap** — açıkken `Tab` panel içinde dönmeli.

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

- [ ] **B1 · Sayfa tek bir düzen fikrini tekrarlıyor**
      Ortalanmış kart + altın kenar + radyal parıltı — 14 kartın 14'ünde aynı.
      P4 ritmi ölçeği kademelendirdi ama **kompozisyonu** değil.
      En az bir kart tipi farklı bir kompozisyon almalı (asimetrik, tam genişlik
      diyagram, ya da sola dayalı editoryal blok).
      ⚠ **Bu görsel bir karar — önce statik mockup, sonra kod.**

- [x] ~~**B2 · Sayfada hiç görsel yok**~~ — **B0 ile karşılandı.** Sayfada artık
      bir diyagram var ve o diyagram sitenin tezini gösteriyor.
      ⚠ GPT'nin uyarısı kayda geçsin: *"eksik olan foto/illüstrasyon değil,
      **epistemik arayüz** — iddiayı denetlenebilir şekilde gösteren yapı.
      Bunu 'şık motion' diye çözersen teşhis doğru, çözüm yanlış olur."*
      Bu yüzden Hero'ya animasyon **eklenmedi**; GPT onu "en riskli madde"
      olarak işaretledi (dini metinde açılışı motion ile yapmak güveni azaltır).

- [ ] **B3 · Her şey aynı kontrast değerinde** — hiçbir şey gerçekten yüksek sesli
      olmadığı için hiçbir şey gerçekten sessiz değil. `feature` kademesi
      `medium`'dan yalnız dolgu ile ayrılıyor; tipografik ölçek aynı.

- [ ] **B4 · `TefekkurHighlight` sola dayalı, sayfadaki her şey ortalanmış**
      Ölçüldü: metin çakışması **yok** (0 çakışma, 1280 ve 1440'ta) ama hiza
      kırılıyor. Ya ortala ya da sola dayalılığı bilinçli bir bölüm dili yap.

- [ ] **B5 · Hero altında ~200px boş bant** (`ConciergePrompt`'tan önce).
      Nefes payı mı, artık boşluk mu — karar ver.

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

- [ ] **D3 · "1.400 Yıl · 1 Metin · Sıfır Varyasyon"** anasayfada kayıtsız şartsız
      duruyor. Sayfanın kendi §13.24 disiplinine göre kayıt gerekiyor — kart
      içeriğinde nüans var (`koruma-card` blurb'ü kıraat farklarına değiniyor)
      ama **başlık** mutlak konuşuyor.

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

- [ ] **Z1a · `/graf/kelime-isi` — 114 adsız buton**
      Tek sayfada 114 öge; ekran okuyucu hepsini "button" diye okur.
      Sitedeki en yoğun tekil erişilebilirlik açığı.
- [ ] **Z1b · `/atlas/furuk` — 109 Arapça ögenin 108'inde `lang`/`dir` eksik**
      §13.15 ile doğrudan ilgili. Diğerleri: `ses-mimarisi` 58/75 ·
      `melekler` 27/30 · `insan-tanimi` 25/28 · `ritim` 24/27 (toplam 9 rota)
- [ ] **Z1c · Console error'lar (5 rota)**
      `/graf/kavram` hydration uyuşmazlığı · `/graf/semantik` eksik `key` prop ·
      `/arac/kiyamet` geçersiz HTML iç içeliği · `/ayet/[s]/[a]` 400 dönen istek
- [ ] **Z1d · Ekranda ham `**` (3 rota)** — `halka-kompozisyon` ·
      `iblis-seytan` · `atlas/kadinlar`. Anasayfada aynı hata vardı, düzeltildi;
      bu üçü kaçmış.
- [ ] **Z1e · Başlık ağacı (32 rota)** — seviye atlaması (2→4, 1→3, 1→4);
      ayrıca `/oku` ve `/ayet/2/255`'te **h1 YOK**, `/tefekkur`,
      `/tefekkur/[slug]` ve `/atlas/ahiret-yolculugu`'nda **iki h1**
- [ ] **Z1f · Gezinme `<button>` ile (31 rota)** — `/arac/tum-araclar`'da
      çözüldü, aynı kalıp diğer sayfalarda duruyor. En yoğunu
      `esma-frekans` 91 buton / 7 bağlantı
- [ ] **Z1g · Etiketsiz svg (46 rota)** — en yoğunu `bilimsel-isaretler` 20/50
- [ ] **Z1h · `/kutuphanem` canonical + hreflang yok**

## Z2 · Uygulamanın tamamı hiç puanlanmadı

- [ ] **Bugüne kadar verilen HER puan yalnız anasayfaydı** (76 → 73 → 78).
      Diğer 73 sayfa ilk kez bugün tarandı ve o tarama yalnız otomatik
      kontrolleri kapsıyor — kontrast, CWV, görsel inceleme ve içerik
      kalitesi 73 sayfada **hiç** ölçülmedi.
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
