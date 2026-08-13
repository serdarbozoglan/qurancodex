# 🎯 ANASAYFA — AÇIK İŞLER

> Bu dosyada **yalnızca yapılacaklar** durur. Tamamlananlar 13 Ağustos 2026
> akşamı silindi — kayıtları commit mesajlarında (`11c61b2..81fc1d1`, 40 commit).
> Yarım kalanlar ve emin olmadıklarım **kaldı** ve öyle işaretli.
>
> Sayfa-sayfa denetim için: **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)**

---

## 📊 MEVCUT DURUM — 76/100 (13 Ağustos 2026 akşamı, sıfırdan ölçüm)

| Eksen | Not | Bu notu aşağı çeken |
|---|---:|---|
| Erişilebilirlik | **68** | 25 Arapça öge `aria-label` taşımıyor · kontrast hiç ölçülmedi |
| Görsel tasarım | **72** | Tek düzen fikri tekrarlanıyor · hiç görsel yok · her şey aynı kontrast değerinde |
| Tutarlılık | **74** | Site genelinde 184 token dışı renk · EN/TR arası "Tefekkür ↔ Reflections" çelişkisi |
| İçerik | **76** | Özet yok — 18–24 ekran kaydırmadan sitede ne olduğu anlaşılmıyor |
| Bilgi mimarisi | **80** | Rafta 15 bölüm · adlar SixGates kapı adlarıyla örtüşmüyor |
| Teknik | **82** | ⚠ LCP/CLS **hiç ölçülmedi** — bu notun temeli eksik |
| Editoryal dürüstlük | **85** | "Sıfır Varyasyon" kayıtsız şartsız duruyor |

Ölçüm: 3 genişlik × 2 dil = 6 koşu + 8 dilim ekran görüntüsü gözle incelendi.
Tekrarla: `npx playwright test tests/homepage-audit.spec.js`

---

# 🔴 A — ERİŞİLEBİLİRLİK (68 → en yüksek kazanç burada)

- [ ] **A1 · 25 Arapça öge `aria-label` taşımıyor** ← *tek maddede en yüksek etki*
      Ekran okuyucu Kur'an metnini Türkçe/İngilizce ses motoruyla okuyor.
      Ölçülen dağılım:

      | Konum | Adet |
      |---|---:|
      | `allah-kendini-tanitir` (4 isim ızgarası + âyet) | 5 |
      | 12 anlatı kartının çıpa âyeti (`PortalCard`) | 12 |
      | `conclusion` | 3 |
      | `tefekkur-highlight` (kök rozetleri) | 2 |
      | `hero-scene-1` | 1 |
      | id'siz `<span>` | 1 |

      Yapılacak: `PortalCard`'da âyet `<p>`'sine `aria-label={çeviri + " — " + referans}`.
      Tek yerde düzeltmek 12'sini birden kapatır (P5 refactoru bunu ucuzlattı).
      Kalan 13 için `EsmaTeaser`, `Conclusion`, `TefekkurHighlight`, `Hero`.
      ⚠ **Ölç:** düzeltmeden önce ve sonra sayıyı yaz (25 → ?).

- [ ] **A2 · Kontrast oranları hiç ölçülmedi** — §13.25 md. 9 AA istiyor (4.5:1
      normal, 3:1 büyük/ikon) ama **doğrulanmadı.** Şüpheli adaylar: `COLORS.silver`
      (`#94a3b8`) koyu zeminde gövde metni, `opacity: 0.7` uygulanan referans satırları,
      `${COLORS.gold}cc` eyebrow'lar.
      Araç: axe-core veya Playwright + hesaplanan `getComputedStyle` çifti.

- [ ] **A3 · Klavye gezintisi test edilmedi** — 15 bölümlü raf, mega-menü ve
      `/arac/tum-araclar` yalnız fareyle denendi. Tab sırası, focus tuzağı,
      `Escape` davranışı sınanmalı.

---

# 🟠 B — GÖRSEL TASARIM (72)

- [ ] **B1 · Sayfa tek bir düzen fikrini tekrarlıyor**
      Ortalanmış kart + altın kenar + radyal parıltı — 14 kartın 14'ünde aynı.
      P4 ritmi ölçeği kademelendirdi ama **kompozisyonu** değil.
      En az bir kart tipi farklı bir kompozisyon almalı (asimetrik, tam genişlik
      diyagram, ya da sola dayalı editoryal blok).
      ⚠ **Bu görsel bir karar — önce statik mockup, sonra kod.**

- [ ] **B2 · Sayfada hiç görsel yok** — ne fotoğraf, ne illüstrasyon, ne diyagram.
      Yalnız metin + %3 opaklıkta SVG desen. Türünün dünya standardı sayfalarda
      en az bir çarpıcı görsel an var. **Karar gerekiyor:** hangi bölüm bunu taşır?
      (Aday: Hero veya `mukattaa-card` — 14 harfin görsel haritası)

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

# 🧭 G — HİÇ BAKILMAMIŞ ALANLAR (GPT-5.4 hakem turu, 13 Ağustos akşamı)

> Bunlar **anasayfada da** hiç ölçülmedi. Puanlamada bu yüzden yer almadılar —
> yani 76/100 bu alanlar **bilinmezken** verildi. Ölçülünce not değişebilir.
> Yöntem ve komutlar: `sayfa_denetim_kontrol_listesi.md` → **L, N, P, T, V, R**

- [ ] **G1 · Hydration uyuşmazlığı hiç aranmadı.**
      Bu turdaki hydration hatamız "hook sırası" tipindeydi. **Metin/sayı**
      uyuşmazlığı tipi hiç kontrol edilmedi ve sitede riskli çağrılar var:
      `EsmaTeaser` → `n.count.toLocaleString('tr-TR')` sunucuda çalışıyor.
      Node ICU'su ile tarayıcı ICU'su farklı biçimlendirebilir.
      ⚠ `npm run build && npm run start` ile bak — **dev sunucusu maskeliyor.**

- [ ] **G2 · `canonical` / `hreflang` doğrulanmadı.**
      İki dilli sitede kullanıcı yanlış dil sayfasına düşer ve o URL'yi paylaşır.
      `pageMetadata()` bunları üretiyor ama **çıktısı hiç okunmadı.**

- [ ] **G3 · Skip link hiç test edilmedi.**
      `globals.css`'te `.skip-link` var ve `transform: translateY(-100%)` ile
      gizli. İlk `Tab`'da gerçekten görünür oluyor mu, odağı `<main>`'e taşıyor
      mu — bilinmiyor.

- [ ] **G4 · Arapça fontun yüklendiği doğrulanmadı.**
      §13.2 `KFGQPC → Amiri Quran → serif` zincirini tanımlıyor. Zincirin **ilk
      halkası yükleniyor mu**, yoksa sessizce fallback'e mi düşüyor?
      `document.fonts` ile bakılmalı. Fallback'e düşüyorsa mushaf görünümü bozuk.

- [ ] **G5 · Prefetch maliyeti ölçülmedi.**
      Anasayfada 23–24 bağlantı var; Next varsayılan olarak görünür `<Link>`leri
      prefetch eder. Ağır atlas/graf route'ları tıklanmadan indiriliyor olabilir.
      İlk 3 saniyede kaç KB indiğini ölç.

- [ ] **G6 · Bidi (Arapça+Latin karışık satır) gözle kontrol edilmedi.**
      `dir`/`lang` doğru — ama âyet + sûre adı + numara aynı satırdayken sıralama
      bozulabilir. DOM doğru görünürken ekran ters çıkabilir.

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
