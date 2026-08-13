# ✅ ANASAYFA — YAPILACAKLAR

> Kaynak: 13 Ağustos 2026 Playwright ölçümü + GPT-5.5 hakem turu.
> Ölçümü tekrarla: `cd next && npx playwright test tests/homepage-audit.spec.js --project=desktop`

---

# 📊 TARAFSIZ YENİDEN PUANLAMA — 13 Ağustos 2026, akşam

> **Yöntem:** Dünkü not referans ALINMADI. Sıfırdan ölçüldü:
> 3 genişlik × 2 dil = 6 koşu + 8 dilim ekran görüntüsü gözle incelendi.
> "Değişiklik yaptım, o hâlde iyileşmiştir" varsayımı kurulmadı.

**GENEL: 76 / 100**

| Eksen | Not | Neden bu not |
|---|---:|---|
| İçerik | **76** | Anlatı gerçek ve 14 kartın 14'ü de gerçek bir âyete bağlı. Ama sayfa hâlâ 18–24 ekran ve **özet yok** — ziyaretçi kaydırmadan sitede ne olduğunu öğrenemiyor. Compact kademede 8 konu artık yalnız âyet + tek satır alıyor: ritim kazandı, derinlik kaybetti. |
| Görsel tasarım | **72** | Kimlik tutarlı (koyu/altın, Playfair+Inter, KFGQPC). Ritim artık var. **Ama tek bir düzen fikri tekrarlanıyor:** ortalanmış kart + altın kenar + radyal parıltı. Hiç görsel yok — ne fotoğraf ne illüstrasyon. Her şey aynı kontrast değerinde: hiçbir şey gerçekten yüksek sesli olmadığı için hiçbir şey gerçekten sessiz değil. |
| Bilgi mimarisi | **80** | SixGates iyi bir giriş aygıtı. Artık breakpoint başına tek raf + içinde "başa dön". 17 araç bağlantısının hepsi yerinde. Ama raftaki 15 bölüm çok ve adları SixGates kapı adlarıyla birebir örtüşmüyor. |
| Teknik | **82** | 14 hydration adası → 1, framer-motion kartlardan çıktı, 6 kombinasyonda **0 console error**, hiçbir yerde yatay kaydırma yok, build temiz. ⚠ **Uyarı: LCP/CLS ÖLÇMEDİM** — "hızlı" diyemem, yalnız "hydration yüzeyi küçüldü" diyebilirim. |
| Erişilebilirlik | **68** | h1=1, seviye atlaması yok, etiketsiz buton 0, boş bağlantı 0, alt'sız görsel 0, `prefers-reduced-motion` karşılanıyor. **AMA: 25 Arapça öge `aria-label` taşımıyor** — ekran okuyucu Arapça metni Türkçe/İngilizce sesle okuyor. En büyük açık ve hiç dokunulmadı. Kontrast oranları da formel ölçülmedi. |
| Tutarlılık | **74** | Token katmanı + CI kapısı + §13.25 + anasayfada 0 ham hex + kategori paleti ayıklandı. Ama site genelinde **184 token dışı renk** duruyor ve İngilizce sayfada **"TEFEKKÜR"** çevrilmemiş (navbar "Reflections" diyor). |
| Editoryal dürüstlük | **85** | Sitenin en güçlü yanı. §13.24 disiplini ("bilim doğrular" yasak), "örtüşme ≠ kanıt", klasik+modern+eleştirel not yan yana. Türünde nadir. Tek çekince: "1.400 Yıl · 1 Metin · **Sıfır Varyasyon**" anasayfada kayıtsız şartsız duruyor. |

### Bu turda ölçülen yeni bulgular

- [ ] **25 Arapça öge `aria-label` taşımıyor** — en yüksek etkili açık kalem
- [ ] **İngilizce sayfada "TEFEKKÜR"** — navbar "Reflections" diyor, bölüm başlığı Türkçe
- [ ] **EN mobil 20.307px** — TR 19.669px; İngilizce metin uzun, hedefi aşıyor
- [ ] **`TefekkurHighlight` sola dayalı**, sayfadaki her şey ortalanmış — hizasız duruyor
- [ ] **Hero altında ~200px boş bant** (ConciergePrompt'tan önce)
- [ ] LCP / CLS **hiç ölçülmedi** — puanın teknik ayağı bu yüzden eksik temelli

### Doğrulanan (ölçüldü, sorun yok)
`\"` ters bölü 0 · ekranda `**` 0 · yatay kaydırma yok (6/6) · console error 0 (6/6)
etiketsiz buton 0 · boş bağlantı 0 · alt'sız görsel 0 · reveal 14/14 açılıyor

---

# 🔬 NASIL DENETLEDİM — YÖNTEM

> Bu bölüm diğer 73 sayfaya aynı süreci uygulamak için yazıldı.
> Sayfa-sayfa uygulanacak **ayrıntılı kontrol listesi** ayrı dosyada:
> **[`sayfa_denetim_kontrol_listesi.md`](./sayfa_denetim_kontrol_listesi.md)**
> Aşağıdaki 9 adım o listenin *nasıl* çalıştırılacağını anlatır.

### 1 · Önce ölç, sonra konuş
Hiçbir bulgu "bence" ile başlamadı. Her biri bir **sayı**, bir **seçici** veya
bir **ekran görüntüsü** taşıdı. Bu disiplini iki kez ihlal ettim ve ikisinde de
yanıldım: (a) *"tüm renkler token'dan geliyor"* dedim — ölçünce **184 token
dışı renk** çıktı; (b) *"`/arac/tum-araclar` yok"* dedim — vardı ve 21 araç
gösteriyordu. İkincisi kullanıcının kararını değiştirebilecek bir yanlıştı.

### 2 · Değişiklikten ÖNCE gerçek temel çizgi
`git stash` ile "önce" değeri ölçüldü, sonra değişiklik uygulandı. Emniyet
ağları (`homepage-link-inventory`, `homepage-card-text`) taşımadan **önce**
kuruldu. Bu koruma marka adı değişikliğinde bir bağlantı kaybını gerçekten
**yakaladı**; kasıtlı olduğu doğrulanıp temel çizgi güncellendi.
> ⚠ Bir kez bunu ihlal ettim: `color-before` görüntülerini değişiklikten sonra
> yakalayıp gerçek "önce" halini kaybettim.

### 3 · Üç genişlik × iki dil = 6 koşu
`1440` · **`1024`** · `390`, hem `/tr` hem `/en`.
**1024 atlanamaz** — bu turda bulunan iki ciddi hata yalnız orada vardı:
navbarın chip rafını **31px örtmesi** ve SixGates'in 1.334px'e çıkması.

### 4 · DOM yetmez, render'a bak
`\"bilimsel mucize\"` diye ekranda **ters bölüler** görünüyordu; baseline testi
yeşildi çünkü yalnız âyet/başlık/bağlantı tutuyordu. Hata **ekran görüntüsüne
gözle bakınca** bulundu. Artık her sayfada en az bir tam ekran görüntüsü
gözle inceleniyor ve baseline gövde metnini de tutuyor.

### 5 · "Görünüyor" ≠ "tıklanabilir"
`getBoundingClientRect` chip rafını görünür gösteriyordu; gerçekte üst yarısı
navbarın (`z-9999`) altındaydı. Kanıt aracı:
```js
document.elementFromPoint(x, y)   // o noktada gerçekte kim var?
```

### 6 · Sabit sayıları ölçülen gerçekle karşılaştır
Bu tur **en verimli** hata sınıfı buydu: `NAVBAR_HEIGHT = 62` (gerçek 69/93),
`padding: 64` (navbar altı 82), `isMobile={false}` sabit prop (mobil dal hiç
çalışmamış), `minHeight: 320px` (kısaltma kazancını yutuyordu),
`PLANNED_TOTAL = 44` (52 makale → "0 planlanan").

### 7 · Kırmızı testin sebebini kanıtla
`concierge.spec.js:240` kırmızıydı. Değişikliğimi suçlamadan önce API'ye istek
atıldı: `meta.budget = {"reason":"ip"}` + `X-Degraded: 1` → sebep kendi test
koşularımın IP kotasını (50/gün) tüketmesiydi.
**Ama tersi de oldu:** `SEMANTIC is not defined` ile sayfa 500 döndü, sebep
bendim — toplu düzenleme `FeaturedWrap`'e import eklemeden kullanmıştı.

### 8 · İçerik koruyan refactor'da git geçmişiyle karşılaştır
14 kart dosyası silindikten sonra **210 metin alanı** `git show 1a1cd26:...`
ile tek tek karşılaştırıldı → **0 fark**. Böylece "bozulan tek şey `\"`
kaçışıydı" cümlesi tahmin değil, ölçüm oldu.

### 9 · Her turda: build + tam test + renk denetimi
```bash
npm run build
npx playwright test
node scripts/audit-colors.mjs --ci
```
Build'in geçmesi yetmez — dev sunucusu ayrı kırılabiliyor:
`.next/dev/logs/next-development.log` okunur.

---

## ✅ TAMAMLANDI (2026-08-13)

- [x] **Okuma modu sûre araması: "Ala" yazınca A'lâ çıkmıyordu**
  `next/src/components/ReadingMode.jsx` — sorun eşleşmede değil **sıradaydı**.
  "ala" 17 sûre eşleştiriyordu (İngilizce `Al-` öneki → `Al-Anam` = `alanam` ⊃ `ala`),
  El-A'lâ 11. sıraya düşüyordu. Alâka sıralaması eklendi: harf-i tarif atıldıktan
  sonra ad sorguyla başlıyorsa öne çıkar. Canlı doğrulandı → `El-A'lâ · El-Alak · El-En'âm`
- [x] **Emniyet ağı: anasayfa bağlantı envanteri**
  `next/tests/homepage-link-inventory.spec.js` + `tests/__baseline__/homepage-links.json`
  17 araç bağlantısı · 19 sayfa-içi çapa kilitlendi. Taşıma sırasında bir tanesi
  düşerse test kırmızı yanar. Kasten güncelleme: `UPDATE_BASELINE=1`

---

## 🔴 P0 — ARAÇ KATALOĞU (anasayfa değişikliğinin ÖNKOŞULU)

> **Neden önce bu:** Anasayfadan kart indirmeden önce ziyaretçinin gidebileceği
> çalışan bir "tüm araçlar" yüzeyi olmalı. Şu an yok — ve bozuk.

**Tespit:** Araç kataloğu **dört ayrı yerde** tutuluyor, hiçbiri tam değil:

| Kaynak | Kapsam | Durum |
|---|---|---|
| `src/data/tools.jsx` → `/arac/tum-araclar` | 21/56 | **23 event'ten 17'sinin dinleyicisi yok** |
| `src/data/exploreCategories.jsx` → navbar | 31/56 | çalışıyor |
| `scripts/corpus-sources.mjs` → `TOOL_CATALOG` | 43/56 | çalışıyor, §13.22 ile zorunlu bakımlı |
| Diskteki gerçek rotalar | 56 | — |

- [x] **`TOOL_CATALOG`'u 43 → 55'e tamamla** ✅ (13 araç eklendi) — `scripts/corpus-sources.mjs`
  Eksik 14: `/arac/elestirel-cerceve` · `/arac/kitap-kavrami` · `/arac/neden-sonuc` ·
  `/arac/ses-mimarisi` · `/arac/tarihsel-kanitlar` · `/arac/wow` · `/arac/yeminler` ·
  `/arac/zaman-boyutlari` · `/graf/diyalog` · `/graf/karsilastir` · `/graf/kelime-isi` ·
  `/graf/semantik` · `/graf/zaman` · (`/arac/tum-araclar` katalog sayfasının kendisi — hariç)
  Yan fayda: `/sor` bu 13 aracı da bulmaya başladı. `/arac/wow` (legacy 308 redirect)
  ve `/arac/tum-araclar` (katalog sayfasının kendisi) bilinçli olarak dışarıda → 55 giriş, 0 mükerrer.
- [x] **`/arac/tum-araclar` canlı hatası: tıklamalar ölü** ✅ **düzeltildi**
  `src/components/ToolsBrowser.jsx:115` → `window.dispatchEvent(new CustomEvent(eventName))`
  Vite döneminden kalma; araçlar §16.5 ile route'a dönüşünce dinleyiciler kalkmış.
  Canlı test: "Peygamber" ve "Kitap Kavramı" tıklandı → URL değişmedi, hata da yok
  - [x] `event` tabanlı gezinme `router.push(route)` ile değiştirildi.
        Navbar'ın `TOOL_ROUTES` haritası `src/lib/toolRoutes.js`'e taşındı; iki tüketici
        de aynı kaynağı kullanıyor. Eşleşme yoksa eski davranışa düşer (geriye dönük güvenli).
  - [x] **Katalog ortak dosyaya ayrıldı** — `src/data/toolCatalog.js` (55 giriş).
        Önceden yalnız `corpus-sources.mjs` içindeydi, tarayıcı erişemiyordu.
        `corpus-sources.mjs` artık oradan import ediyor; corpus birebir aynı (55 item, 12.851 toplam).
  - [ ] **Sayfayı bu katalogdan besle (21 → 55)** — sıradaki iş.
        Mevcut 21 araç ikon + gruplu zengin kartlarla geliyor; onları KALDIRMA
        (kayıp olur). Kalan 34'ü ek bölüm olarak ekle.
- [x] **Regresyon koruması kuruldu** — `next/tests/tools-navigation.spec.js`
      Değişiklik öncesi/sonrası `git stash` ile gerçek baseline alındı:
      navbar **22 → 22** · mobil çekmece (390px) **71 → 71** · tum-araclar **38 → 38** ·
      tıklama **kırık → `/atlas/kissa`**. 42 Playwright testi yeşil.

---

## ✅ P1 — TAMAMLANDI (`9a5c827`)

- [x] **§13.24 ihlali düzeltildi**
  `next/src/app/[locale]/page.js` → `cluster-astonishment` içindeki `ClusterWhisper`
  - Şu an: `"Bilim bir gün gelir, doğrular."` / `"Science arrives one day and confirms."`
  - Kural: tasdikin öznesi bilim olamaz; `confirms/proves` yasak
  - Yeni TR: `"Bulgular örtüşebilir, izler çoğalabilir; hüküm metne değil, tefekküre aittir. Metin değişmez."`
  - Yeni EN: `"Findings may align and traces may multiply; the verdict belongs not to the text but to reflection..."`
  - [x] `"Tarih bir gün gelir, eğilir"` de aynı cümlede yumuşatıldı

- [x] **Hero'ya "burası ne" satırı eklendi**
  `next/src/components/Hero.jsx`
  - Sorun: ilk ekranda `<h1>` görünmüyor, ziyaretçi sitenin ne olduğunu anlamıyor
  - Âyet referansı ile `DEVAM` arasına tek satır: `0.8rem`, `COLORS.silver`, letterSpacing
  - Eklendi: *"Kur'an'ın dilsel, sayısal ve yapısal mimarisi — 6.236 âyet, interaktif görsellerle."*
  - Başlık değil, âyet referansının altında sessiz tek satır (0.72–0.8rem, silver, opacity .55)
  - Canlı doğrulandı 1440px + 390px; mobilde iki satıra sarıyor, yatay taşma yok

---

## 🟠 P2 — Karar gerektiren (kod yazmadan önce)

- [x] **IA kararı verildi: C — 3 kart kalsın, kapılar tutarlı olsun**
  - Küme başına 1 ağır kart (Mukattaa · Bilimsel · Esmâ — `page.js` zaten bu üçünü
    `FeaturedWrap` ile sarmış, karar mevcut niyeti güçlendiriyor)
  - Kalan 11 kart mini satıra iner; altı kapının altısı da link olur
  - Beklenen: ~21.300px → ~11.000px
  - ⚠ **Önkoşul: P0.** Kart indirmeden önce `/arac/tum-araclar` çalışır ve 56 araç
    göstermeli — yoksa "hepsini gör" diyecek yer bozuk kalır
  - ⚠ **Önkoşul 2:** Kapı chip'leri `<span>`, tıklanamıyor. Mini satırlar gerçek
    link olmalı, yoksa envanter testi kırmızı yanar

---

## 🟡 P3 — MOBİL UZUNLUK — BÖLÜMLER KÜÇÜLDÜ, SAYFA HEDEFİ P4'E BAĞLI

- [x] **`SixGates` mobilde 2.395px → 1.859px** (−22%)
      - `desc` satırı mobilde gizlendi: chip'lerle **aynı bilgiyi** veriyordu
        (desc "14 mukattaa harfi · 16 vezin…", chip'ler "Dilsel DNA", "İmkânsız Ritim"…)
      - ⚠ Yol boyunca bir hata bulundu: `Gate`'e `isMobile={false}` **sabit**
        geçiliyordu — bileşenin mobil dalı hiç çalışmıyormuş. SSR-safe state eklendi.
      - `minHeight: 320px` mobilde kaldırıldı; desc gizlenince boşalan yeri
        chip'lerin `flexGrow`'u yutuyordu, kart yine 320px kalıyordu
- [x] **`ToolsHighlight` mobilde 1.580px → 1.119px** (−29%)
      - Kart sayısını azaltmak yerine **sütun sayısı** 1 → 2 yapıldı;
        hiçbir araç bağlantısı kaybolmadı (envanter 17 → 17)
- [ ] **Sayfa hedefi (<20.000px) TUTMADI:** 24.912 → **23.915px** (−4%)
      Kalan yığın 14 kartta (mobilde her biri ~950-1.050px). Bu **P4'ün işi** —
      ritim kademelenmesi yapılmadan sayfa hedefi tutmaz.

**Masaüstü etkilenmedi:** six-gates 1.006px, tools-highlight 889px — aynı.

---

## ✅ P4 — RİTİM — TAMAMLANDI (2026-08-13)

- [x] **Üç kademeli kart ritmi**
  Kademe her kümede aynı cümleyi kuruyor: **ÇIPA → YANKI → IZGARA**.

  | Kademe | Kart | Ne değişti |
  |---|---|---|
  | `feature` (3) | Mukattaa · Bilimsel · Esmâ köprüsü | Değişmedi, `FeaturedWrap` rozeti kaldı |
  | `medium` (3) | Ritim · Dua Dili · Öne Çıkanlar | Eski 760px format, aynen |
  | `compact` (8) | Retorik · Ses · Halka · Tekrar · Tarihsel · Koruma · İnsan Tanımı · Psikoloji | `CompactRow` ızgarasında 2 sütun |

  **Compact'te düşen tek şey uzun blurb paragrafı.** Eyebrow · başlık · **Arapça
  âyet** · çeviri · referans · kicker · CTA duruyor. Derin metin zaten CTA'nın
  gittiği araç sayfasında — kapı mantığı bu.
  ⚠ Hiçbir kart TAŞINMADI. Esmâ köprüsü hâlâ reflection kümesinin ortasında,
  yazarın kurduğu "dua → öne çıkanlar → Yaratıcı → insan → nefis" sırası duruyor.
  Hayret kümesi 3 kartlı olduğu için araya `medium` sığmadı — bilinçli istisna.

- [x] **Ölçüm (Playwright, ölçülen gerçek render):**

  | | önce | sonra | fark |
  |---|---:|---:|---:|
  | masaüstü 1440 | 21.363px | **15.988px** | −25% |
  | dizüstü 1024 | 21.381px | **16.059px** | −25% |
  | **mobil 390** | 23.704px | **19.547px** | **−18% — <20.000 hedefi TUTTU** |

  Yatay kaydırma yok · console error 0 · h1=1, h2=19 (değişmedi) · araç bağlantısı 17 → 17

- [x] `auto-fit` ilk denemede 1440px'de **3+1 asimetrisi** üretti (ekran
      görüntüsüyle görüldü). Sütun sayısı artık `CompactRow`'a prop olarak
      veriliyor, CSS yalnız daraltıyor (≤1023px → 2, ≤719px → 1).

---

## ✅ P5 — `<PortalCard>` — TAMAMLANDI (2026-08-13)

- [x] **Ortak bileşen çıkarıldı — SUNUCU BİLEŞENİ**
  - `src/data/homeCards.js` — 14 veri nesnesi
  - `src/components/PortalCard.jsx` — sunucu; `locale` prop'u, `useLanguage()` yok
  - `src/components/CompactRow.jsx` · `EsmaTeaser.jsx` — ikisi de sunucu
  - `src/sections/FeaturedWrap.jsx` — client → **sunucu**
  - `src/components/ScrollRevealRoot.jsx` — TEK IntersectionObserver
  - **14 hydration adası → 1.** Anasayfa kartlarında framer-motion kalmadı.
- [x] **14 dosya silindi** (2.742 satır). Silmeden önce emniyet ağı kuruldu:
      `tests/homepage-card-text.spec.js` — TR+EN, 14 kartın **Arapça âyetleri**,
      `<h2>` başlıkları ve bağlantı hedefleri baseline'a alındı. Refactor sonrası
      **birebir eşleşiyor** (§13.15: âyetler dosyalardan mekanik çıkarıldı,
      elle yazılmadı — `scratchpad/extract-cards.mjs`).

### Yol boyunca bulunan iki ölü/çift kod

- [x] **Kart hover efekti sitede HİÇ çalışmıyormuş.** `globals.css` seçicisi
      `section[id$="-card"] > div > div[style*="border-radius: 20px"]` idi;
      14 kartın 14'ü de `12px` yarıçap kullanıyordu **ve** panel `section > div`
      seviyesindeydi, `section > div > div` değil. İki ayrı sebeple ölü.
      Artık gerçek sınıf adı: `.portal-card:hover .portal-card__panel`.
- [x] **"ÖNE ÇIKAN" rozeti iki kez basılıyormuş.** `globals.css`'teki
      `.featured-card-wrap::before` ile `FeaturedWrap.jsx`'in inline rozeti aynı
      konumda (top:70px, left:50%) üst üste geliyordu — ve pseudo-element
      **İngilizce sayfada da Türkçe** "ÖNE ÇIKAN" yazıyordu. CSS rozeti kaldırıldı;
      EN ekran görüntüsüyle doğrulandı: tek "FEATURED".

---

## ✅ P5b — METODOLOJİ ↔ KAYNAKÇA GEÇİŞİ — TAMAMLANDI

Anasayfadaki `MethodologyRibbon` **"Metodoloji & Kaynaklar"** diyor ama yalnız
`/hakkinda`'ya götürüyor. Ölçüm:

| Sayfa | Uzunluk | Karşı sayfaya link |
|---|---|---|
| `/tr/hakkinda` | 2.387px | **1 tane** — `y=1530px` (sayfanın %64'ü), gövde metni içinde gömülü: *"Tam ve kategorize kaynakça için **Kaynakça sayfası**"* |
| `/tr/kaynakca` | 5.039px | **HİÇ YOK** ✖ çıkmaz sokak |

- [x] Yeni bileşen `src/components/SiblingPageLink.jsx` — iki sayfada da başlığın altında
- [x] `/kaynakca` → `/hakkinda`: **yoktu**, eklendi (y=383px)
- [x] `/hakkinda` → `/kaynakca`: y=1530px'ten **y=226px**'e taşındı
- [x] Eski satır içi atıf korundu (y=1596) — içerik kaybı yok
- [x] Doğrulandı: iki yön × iki viewport (1440px + 390px), dördü de tıklanıp gidiyor

---

## 🟡 P6 — RENK SİSTEMİ — TEMEL ATILDI, GÖÇ SÜRÜYOR

- [x] **Gerçek durum ölçüldü** (ilk raporda yanlış söylemiştim: "hepsi token'dan
      geliyor, §13.1 ihlali yok" demiştim — **yanlıştı**):
      `tokens.js`'te 100 token var ama kodda **184 token dışı renk** kullanılıyor.
      Yakın tekrarlar: **7 yeşil, 7 turkuaz, 6 kırmızı, 81 turuncu/altın tonu.**
      Anasayfa tek başına 18 farklı hex kullanıyor.
- [x] **Rol katmanı kuruldu** — `tokens.js`'e `SEMANTIC` / `STATUS` / `CATEGORY` eklendi
      - `scriptureText` ve `accentPrimary` aynı hex, **ayrı token** (ayet rengi
        ayırt ediciliğini kaybetmesin)
      - `CATEGORY`: emerald · blue · violet · orange · red · rose (sert sınır 6)
      - Turkuaz `#1abc9c` **atıldı** (emerald'a fazla yakındı), `#8b5cf6` yerine
        `#a78bfa` (küçük metinde kontrast sınırdaydı)
- [x] **Kural yazıldı** — CLAUDE.md **§13.25**, 8 mutlak madde + göç sırası
- [x] **Denetim script'i** — `next/scripts/audit-colors.mjs` (`--list`, `--ci`)
      Taban: 184 farklı renk / 1.195 kullanım. Artmamalı.
- [x] GPT-5.5 hakem turu; iki noktada ayrışıldı, gerekçeler §13.25'te yazılı
- [x] **Göç adım 3–5 TAMAM (2026-08-13)** — anasayfa katmanı + tefekkür kategorileri

  **Anasayfa: 15 farklı ham hex → 0.** (P5'ten sonra 18 değil 15'ti; 14 kart
  dosyası silinince üçü zaten gitmişti.) Anasayfayı besleyen 22 dosyada
  yorumlar hariç **tek bir ham hex kalmadı.**

  | Dosya | Önce | Sonra |
  |---|---|---|
  | `SixGates` | 6 kapı accent'i + gradyan, hepsi ham | `SEMANTIC.accentPrimary` + `CATEGORY.*` |
  | `ConciergePrompt` · `Conclusion` | `#c9973a #b8860b #9a6f0a #1c0f00` | `COLORS.btnGold*` (zaten vardı, kullanılmıyordu) |
  | `PortalCard` · `CompactRow` · `FeaturedWrap` | `#0a0a1a` `#0d1b2a` | `SEMANTIC.surface` / `surfaceRaised` |
  | `ReadingProgressCard` | `#e74c3c` | `STATUS.error` |
  | `TefekkurHighlight` | 6 ham kategori rengi | `CATEGORY.*` |

  **Tefekkür kategori paleti — 4'ü değişti** (`public/tefekkur/_index.json`):

  | Kategori | Önce | Sonra | Neden |
  |---|---|---|---|
  | Kavramsal | `#3498db` | `CATEGORY.blue` | aynı hex |
  | Terminoloji | `#d4a574` | `CATEGORY.orange` `#E67E22` | **iki altın vardı**, ayırt edilemiyordu |
  | Sûre & Hermenötik | `#c9a227` | `SEMANTIC.accentPrimary` `#d4a574` | çekirdek kategori altın kalıyor |
  | Semantik | `#8b5cf6` | `CATEGORY.violet` `#A78BFA` | §13.25: küçük metinde kontrast sınırda |
  | İdrak & Şuur | `#1D9E75` | `CATEGORY.emerald` | aynı hex |
  | Kozmoloji | `#9b59b6` | `CATEGORY.rose` `#F472B6` | **iki mor vardı** (semantik ile ikiz) |

  **Canlı doğrulandı** — filtre pilleri tıklanıp `getComputedStyle().color`
  okundu, altı ton da birbirinden ayrı:
  `rgb(52,152,219)` · `rgb(230,126,34)` · `rgb(212,165,116)` ·
  `rgb(167,139,250)` · `rgb(29,158,117)` · `rgb(244,114,182)`
  ⚠ **Geri almak kolay:** `_index.json` içindeki 6 `accent` alanı + `TefekkurHighlight.jsx`.

- [x] **`audit-colors.mjs --ci` pre-merge kontrolüne eklendi**
      `.claude/skills/pre-merge-review/SKILL.md` §4b artık grep değil script
      çağırıyor. Taban güncellendi: **1.195 → 1.176 kullanım** (184 farklı renk
      değişmedi — ayıklanan renkler site genelinde başka dosyalarda da geçiyor).
- [ ] **Göç adım 6–7 (kalan):** anasayfa dışındaki ~180 rogue renk.
      En sık geçenler: `#4a5568` ×34 · `#f87171` ×16 · `#60a5fa` ×14 ·
      `#f39c12` ×14 · `#c084fc` ×14. `node scripts/audit-colors.mjs --list`

---

## ✅ MARKA ADI TUTARLILIĞI — TAMAMLANDI (2026-08-13)

Kullanıcı sordu: *"QuranCodex mi Quran Codex mi, tutarsızlık var"*. Sayım:

| Biçim | Kullanım |
|---|---|
| `QuranCodex` (tek kelime) | **78** ← baskın |
| `QURAN CODEX` (logo, versal) | 25 |
| `Quran Codex` (boşluklu) | 6 ← azınlık, tutarsız |

- [x] 6 boşluklu kullanım `QuranCodex`e çevrildi (tr.json ×2, en.json ×3, OG görseli ×1)
- [x] Logo kelime markasından literal boşluk kaldırıldı → **QURANCODEX**
      İki yarıyı tonla ayırmak denendi (QURAN altın / CODEX kırık beyaz),
      **kullanıcı tek renk istedi** → tamamı `#d4a574`. Harf aralığı
      (tracking .12–.18em) optik ayrımı zaten veriyor.
- [x] Envanter testi bu değişikliği **kayıp olarak yakaladı** — kasıtlı olduğu
      doğrulanıp temel çizgi güncellendi (koruma çalışıyor)

---

## ❌ KAPAT BUTONU — /hakkinda ve /kaynakca'ya EKLENMEYECEK

Kullanıcı sordu. Cevap: hayır. CLAUDE.md §13.11 ismen yasaklıyor —
*"Tool sayfaları full-page route'tur (modal değil), × close button gerekmez."*
Bu ikisi de içerik sayfası, modal değil.

Somut gerekçe: bugün `/arac/tum-araclar`'da tam bu yüzden hata yaşandı — kapat
butonu *"nereye kapatacak?"* sorusunu doğuruyor ve geçmiş yoksa boş sayfa
kalıyordu. Navbar + tarayıcı geri + yeni eklenen kardeş sayfa bağlantısı yeterli.

---

## 🟡 P7 — Küçükler

- [x] **19 `<h2>` → 11.** Başlık SEVİYESİ artık P4 kademesini izliyor:
      `feature`/`medium` → `h2`, `compact` → `h3`. Ölçülen: h2 19→11, h3 15→23.
      Her `h3` kendinden önce gelen bir `h2`yi takip ediyor — **seviye atlaması yok.**
      Görsel değişiklik yok (font boyutu inline, etiketten bağımsız).
      `homepage-card-text` baseline'ı yenilenmedi; yalnız seçici `h2` → `h2, h3`
      oldu — başlık METİNLERİ değişmedi, temel çizgi hâlâ eşleşiyor.
- [x] **CLAUDE.md §4 ↔ `tokens.js` sapma koruması.** Tabloyu koddan üretmek
      yerine (100 satır mükerrer olurdu) tablodaki 7 hex'in tokens.js'teki
      değerle aynı olduğu `audit-colors.mjs` içinde doğrulanıyor. `--ci`'de
      sapma varsa exit 1. Şu an: **7/7 uyumlu.**
      > §4 tablosu bu turdan önce zaten rol tabanlıya çevrilmişti (madde bayattı);
      > eksik olan tek şey **kontroldü** — o eklendi.
- [ ] P4 sonrası: `MobileSectionChipNav` / `DesktopSidebarTOC` / `ScrollToTopFab`
      üçü de hâlâ gerekli mi? **İnceleme yapıldı, karar KULLANICIYA bırakıldı:**
      sayfa 23.704 → 19.547px'e indi ama hâlâ ~23 ekran. Üç bileşen de farklı
      iş yapıyor (mobil çip = yatay atlama, masaüstü TOC = konum göstergesi,
      FAB = başa dön) ve hiçbiri diğerinin yerini tutmuyor. **Silmedim** —
      görsel yoğunluk kararı, ölçüm kararı değil.

---

## 🔵 P8 — BEŞ SAYFA DETAYLANDIRILACAK (kullanıcı talebi 2026-08-13)

> **Öncelik kararı (2026-08-13):** Kullanıcı bu maddenin **en sona** alınmasını,
> önce denetimden çıkan kendi bulgularımızın (P2–P7) kapatılmasını istedi.

Bu beş sayfa mevcut hâliyle yetersiz; içerik ve etkileşim olarak **belirgin
şekilde derinleştirilecek.**

| Sayfa | Rota | Bileşen | Veri |
|---|---|---|---|
| Semantik Harita | `/graf/semantik` | `SemanticMap.jsx` — 585 satır | UMAP projeksiyonu |
| Münâsebât Atlası | `/atlas/munasebat` | `MunasebatAtlasi.jsx` — 795 satır | — |
| Diyalog Ağı | `/graf/diyalog` | `DiyalogAgi.jsx` — 1.253 satır | 5 JSON · ~81 KB |
| Kitap Kavramı | `/arac/kitap-kavrami` | `KitapKavrami.jsx` — 382 satır | `kitap-kavrami.json` 18 KB |
| Sûre DNA | `/graf/karsilastir` | `SurahComparator.jsx` | — |

- [ ] Her sayfa için önce **içerik envanteri** çıkar: şu an ne gösteriyor, ne eksik
- [ ] `KitapKavrami` (382 satır) ve `SemanticMap` (585 satır) en zayıf ikisi — önce onlar
- [ ] ⚠ **Adlandırma tutarsızlığı:** menüde *"Sûre DNA"*, rota `/graf/karsilastir`,
      bileşen `SurahComparator`, katalogda *"Sûre Karşılaştırıcı"*. Aynı şey üç
      farklı adla anılıyor — detaylandırma sırasında tek ada karar verilmeli.
- [ ] Detaylandırma sonrası `TOOL_CATALOG` açıklamalarını güncelle (`/sor` bunları okuyor)

---

## 📌 Notlar

- Ölçüm dosyası `next/tests/homepage-audit.spec.js` regresyon testi değil, ölçüm aracıdır — istenirse silinebilir
- Ekran görüntüleri: `next/test-results/home-{desktop-1440,laptop-1024,mobile-390}[-full].png`
- Doğrulanan ve **sorun olmayan** alanlar: 0 console error, 0 yatay kaydırma (3 viewport), etiketsiz buton yok, `<main>` landmark mevcut, reduced-motion desteği var, 26/26 Arapça blokta `lang`+`dir` doğru

---

## 🧪 TEST DURUMU (2026-08-13)

| Spec | Durum |
|---|---|
| `homepage-audit.spec.js` | ✅ 3/3 — ölçüm aracı |
| `homepage-link-inventory.spec.js` | ✅ 17 bağlantı · 19 çapa kilitli |
| `tools-navigation.spec.js` | ✅ 4/4 |
| `hifz.spec.js` | ✅ |
| `concierge.spec.js` | ⚠ 20/21 — aşağıya bak |

- [ ] **`concierge.spec.js:112` bayat assertion** — düzeltilmeli
  Test `tarıyorum|scanning|matching|arıyor` dönen yükleme metnini bekliyor;
  bu kelimeler `/sor` sayfasının kaynağında **hiç yok** (grep: 0 dosya).
  Yükleme arayüzünün metni bir noktada değişmiş, test güncellenmemiş.
  **Bugünkü değişikliklerle ilgisi yok** — concierge dosyaları `74b9ccf`'te commit'li ve temiz.

**Yerel test için gereken anahtarlar** (`/Users/serdar/Developer/01_qurancodex/.env`):
`ANTHROPIC_API_KEY` · `DEEPINFRA_API_KEY` · `KV_REST_API_URL` · `KV_REST_API_TOKEN`
Dev sunucusu bunlar yüklenmeden başlatılırsa 7 concierge testi ortam yüzünden kırılır.
Doğru başlatma:
```bash
set -a && . /Users/serdar/Developer/01_qurancodex/.env && set +a && npm run dev
```

- [x] **Bütçe koruması yerelde doğrulandı** — `74b9ccf`'te "yerelde doğrulanamadı" notu düşülmüştü.
      KV artık yerelde bağlı; canlı istek `meta.budget = {"used":14,"limit":500,"reason":null}`
      döndürüyor, sayaç çalışıyor.

- [ ] **`concierge.spec.js` degrade moduna dayanıklı değil** (P4/P5 turunda ortaya çıktı)
  `tests/concierge.spec.js:240` ("EN /sor page çalışıyor") kırmızıya döndü.
  **Sebep bulundu, anasayfa refactor'ıyla ilgisi yok:** günün test koşuları
  IP başına 50'lik kotayı tüketmiş. Canlı kanıt:
  `meta.budget = {"used":65,"limit":500,"reason":"ip"}` · `X-Degraded: 1`
  Yani koruma **tasarlandığı gibi çalışıyor** — kırmızı yanan şey testin
  varsayımı. Test, degrade modda anlamlı sonuç bekliyor.
  Seçenekler: (a) test kendi IP kotasını bypass eden bir başlık kullansın,
  (b) `X-Degraded: 1` gelirse test `skip` etsin, (c) degrade modda İngilizce
  anahtar kelime aramasının niye 0 sonuç döndüğü ayrıca incelensin.
- [ ] **Degrade/hata metni İngilizce sayfada Türkçe** — aynı ekran görüntüsünde:
  başlık "Something went wrong", altındaki satır **"Bu sorguya yakın içerik
  bulunamadı."** i18n'e bağlanmamış bir dize var.
