# 🎯 ANASAYFA — AÇIK İŞLER

> Bu dosyada **yalnızca yapılacaklar** durur. Tamamlananlar 13 Ağustos 2026
> akşamı silindi — kayıtları commit mesajlarında (`11c61b2..81fc1d1`, 40 commit).
> Yarım kalanlar ve emin olmadıklarım **kaldı** ve öyle işaretli.
>
> Sayfa-sayfa denetim için: **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)**

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

- [ ] **A2 · Kontrast oranları hiç ölçülmedi** — §13.25 md. 9 AA istiyor (4.5:1
      normal, 3:1 büyük/ikon) ama **doğrulanmadı.** Şüpheli adaylar: `COLORS.silver`
      (`#94a3b8`) koyu zeminde gövde metni, `opacity: 0.7` uygulanan referans satırları,
      `${COLORS.gold}cc` eyebrow'lar.
      Araç: axe-core veya Playwright + hesaplanan `getComputedStyle` çifti.

- [x] **A3 · Klavye gezintisi test edildi** — skip link, tab sırası, gizli raf
      ve `Escape` ölçüldü ve düzeltildi (bkz. G bölümü). **Kalan:** mega-menüde
      hâlâ **focus trap yok** — `Escape` kapatıyor ama `Tab` menüden dışarı
      kaçıyor. Panellerde `role` da yok (disclosure kalıbı bilinçli tercih).
- [ ] **A4 · Mega-menüde focus trap** — açıkken `Tab` panel içinde dönmeli.

---

# 🟠 B — GÖRSEL TASARIM (72)

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

- [ ] **B0c · KARAR GEREKİYOR: Hero'daki ışık süpürmesi (light sweep)**
      Besmelenin üzerinden sağ→sol bir kez geçen parıltı **duruyor.**
      Aynı gerekçeyle kaldırılabilir ama bu senin kurduğun giriş anı —
      tek başıma silmedim. `Hero.jsx` → `showIntro && !reduced` dalı.

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

- [ ] **E1 · LCP / CLS / INP hiç ölçülmedi** ← *bu ölçülmeden teknik not güvenilmez*
      "14 hydration adası → 1" yapısal bir kazanım ama **kullanıcının hissettiği
      hız değil.** Lighthouse veya `web-vitals` ile üç metrik ölçülmeli,
      P4/P5 öncesi ile karşılaştırılamıyorsa en azından taban kaydedilmeli.

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
