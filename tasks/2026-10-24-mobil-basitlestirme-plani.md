# Basitleştirme — Anlatı Rehberliği + Niyet Girişi + Kademeli Menü (Mobil + Masaüstü)

**Tarih:** 2026-10-24 (astra ile 4 tur görüşüldü: 2. turda kapsam mobilden
mobil+masaüstüne genişletildi; 4. turda öncelik sırası B→A→C→D olarak
düzeltildi — bkz. Öncelik Sırası bölümü)
**Kaynak:** Gerçek kullanıcı geri bildirimi (mobilden test edildi: "piyasadaki
çoğu uygulamanın fevkinde ama çok karmaşık, seviyesi çok yüksek, rehberlik
istiyorum, basit ve kullanışlı hale getirilmesi lazım").
**Keşif bulguları (agent taraması, 2026-10-24):** 66 araç/atlas/graf rotası,
27 öğeli Keşfet mega-menüsü, 53 Tefekkür makalesi, Hero sonrası 15 bölümlük
tek-sayfa anlatı, sıfır onboarding/basit-mod mekanizması.
**İlişkili dosyalar:** CLAUDE.md §17 (anasayfa küçültme işi ZATEN SÜRÜYOR —
bu plan onunla birleşir, tekrar icat edilmez), `tasks/anasayfa-envanter-2026-06-15.md`
(14 bölümün hedef tool sayfası eşleşme tablosu).

## İlerleme Günlüğü (canlı güncellenir — 2026-10-25)

> ⚠ **Temel düzeltme (8. tur):** "Hero sonrası 15 bölümlük tek-sayfa anlatı"
> tespiti YANLIŞ çıktı — ilk keşif agent'ı `src/sections/*.jsx` dosyalarının
> var olmasına bakıp bunların render edildiğini varsaymış, `page.js`'i
> kontrol etmemişti. Gerçek: §17 restructuring **2026-06-15'te zaten
> tamamlanmış** — anasayfa artık Hero → küçük widget'lar → SixGates (6 kapı)
> → ProofSection → **3 cluster (14 kompakt kart)** → AlanlarPortal →
> ToolsHighlight → Kapanış. Eski `sections/*.jsx` dosyaları (ZeroRedundancy
> vb.) **ölü kod**, hiçbir yerde import edilmiyor.
>
> **Gerçek ölçüm (Playwright, 390×734, canlı sunucu):** toplam 27.254px
> (37.1 ekran). SixGates+AlanlarPortal+ToolsHighlight toplamı yalnız **%15**
> (zaten ayrı ayrı mobil-optimize edilmiş, dokunulmadı). Asıl ağırlık:
> **ProofSection (%14.1) + 3 cluster (%48.6) = %62.7.**

### Tamamlanan
- [x] `ScienceTimelineCard.jsx` (bilimsel-card): outer padding 110→80 (mobil),
  başlık/CTA boşlukları 48→24, düğümler arası 34→20 — canlıda doğrulandı
  (mobil 80px, masaüstü 110px korunmuş)
- [x] `PortalCard.jsx` (5 kart: mukattaa, ritim, dua, altı-konu,
  allah-kendini-tanıtır — feature/medium ağırlık): outer padding
  feature 110→80, medium 90→65; başlık/âyet/kicker boşlukları küçültüldü —
  canlıda doğrulandı (mobil 80px/65px, masaüstü 110px/90px korunmuş)
- [x] Mobil+masaüstü ekran görüntüsü (mukattaa, dua) — "sıkışık" hissi yok,
  masaüstü piksel piksel aynı
- [x] **Bug bulundu ve düzeltildi (1. tur):** CSS custom property miras alma
  hatası — iç `mq-box` elemanları (başlık, âyet bloğu, kicker) dış
  section'dan `--pt-d`/`--pb-d` padding değerlerini miras alıp kendi
  üstlerine de uyguluyordu (örn. `h2` 80px+80px istenmeyen padding almıştı).
  astra'nın sorduğu "iç mq-box riski" sorusu bunu yakaladı. Çözüm: yeni
  `.mq-margin` CSS sınıfı (`globals.css`) — yalnız margin longhand'larını
  okur, padding değişkenlerini hiç okumadığı için miras sorunsuz kalır.
- [x] **İkinci bug bulundu ve düzeltildi (2. tur):** İlk düzeltmeyi
  `ScienceTimelineCard.jsx`'in timeline düğümlerine de mekanik olarak
  uygularken hata yaptım — o düğümler GERÇEKTEN padding istiyordu
  (`--pb-d`/`--pb-m`), ama `mq-margin`'e çevirince bu sınıf padding
  değişkenini hiç okumadığı için düğümler arası boşluk **tamamen
  sıfırlanmıştı** (astra'nın 2. tur uyarısı bunu yakaladı). Çözüm: bu
  elemanlar `mq-box`'a geri alındı, diğer üç kenar (`--pt-*`/`--pl-*`/
  `--pr-*`) açıkça `0px`'e sabitlenerek dış section'dan sızma önlendi.
- [x] **Canlı doğrulama (3 tur, hepsi astra onaylı):** `h2`/âyet-bloğu/
  kicker padding'i 3 breakpoint'te de tam 0px; timeline düğümleri mobil
  20px/masaüstü 34px pb, diğer kenarlar 0px; mukattaa+dua kartları mobil+
  masaüstü ekran görüntüsüyle kontrol edildi (sıkışıklık yok, masaüstü
  piksel piksel korunmuş)
- [x] **astra nihai onayı alındı (2026-10-25):** "EVET, bu üç dosyalık
  kapsam (PortalCard.jsx, ScienceTimelineCard.jsx, globals.css .mq-margin)
  için tamamlandı diyebilirsin... açık kalan bulgu yok."
- [x] **Gerçek net kazanç (bug'lar düzeltildikten sonra, mobil):**
  mukattaa-card 893px, ritim-card 811px, dua-card 909px, alti-konu-card
  903px, allah-kendini-tanıtır 1256px, bilimsel-card 1917px — hepsi
  masaüstünde orantılı büyüklükte korunmuş (bug ayrıca masaüstünü de
  şişiriyormuş, düzeltme ikisine de yaradı)

### Tamamlanan (devam)
- [x] `ProofSection.jsx` (proof-fatiha, sayfanın %14.1'i): outer padding
  96→65 (mobil), 5 iç margin (44-46px → 24-26px) küçültüldü. **İçeriğe
  dokunulmadı** — §13.24'ün zorunlu kıldığı 4 adım, 7 âyetlik liste, 4
  eşleşme kartı, diyagram hepsi aynen korundu, yalnız dış boşluk.
- [x] `EditorialCard.jsx` (tarih-card, koruma-card — astonishment cluster'ın
  kalan 2 kartı): outer padding 80→55 (mobil), 3 iç margin (22→14px)
  küçültüldü.
- [x] **Canlı doğrulama + astra onayı (2026-10-25):** mobil padding
  proof-fatiha 65px/tarih-koruma 55px, masaüstü 96px/80px (korunmuş); 8 iç
  `mq-margin` elemanının tamamı padding 0/0/0/0 (sızıntı yok, önceki 2 bug
  sınıfının tekrarı yok). 4 ekran görüntüsü (mobil+masaüstü) kontrol
  edildi. Astra: "EVET — tamamlandı diyebilirsiniz."
- [x] Bu turdan itibaren rebuild/restart kullanıcı tarafından değil
  **bu ajan tarafından** çalıştırılıyor (kullanıcı izni, 2026-10-25 —
  önceki "npm run build çalıştırılmaz" kısıtı kaldırıldı)

### Beklemede
- [ ] 6 kompakt kart (retorik, ses, halka, tekrar, insan-tanımı, psikoloji)
  — `clamp()` tabanlı zaten responsive, düşük öncelik ama doğrulanmadı
- [ ] Site genelinde `mq-box` 60+ dosyada kullanılıyor — aynı iç-içe miras
  hatası başka yerlerde de olabilir; bu oturumun kapsamı DIŞINDA, projenin
  kendi `audit-layout-patterns.mjs`'ine eklenmesi önerilir (kullanıcıya
  iletildi)
- [ ] Plan maddeleri A (niyet girişi), C (menü), D (tur) — başlanmadı

## Paralel Agent Koordinasyonu (2026-10-25 — içerik-doğruluk agent'ıyla paylaşılan ağaç)

Aynı çalışma ağacında başka bir agent (§13.24/§13.30 içerik-doğruluk hakem
turunu yürütüyor, `todo_katki_raporu.md` Kademe 3) paralel çalışıyor.
Tek çalışma ağacı olduğu için (`git worktree list` tek satır) dal/worktree
izolasyonu yerine **dosya bölüşümü** ile çalışılıyor.

**Bu plan (B/A/C) için YASAK — başka agent tutuyor, serbest kalana kadar
dokunulmaz:**
- `src/components/TarihselKanitlar.jsx`
- `public/*.json` (bilimsel-isaretler, tarihsel-kanitlar, ve ilgili veri
  dosyaları)
- `src/i18n/tr.json` + `src/i18n/en.json` — içerik agent'ının Kademe 3.3'ü
  burayı kullanacak; bu planda yeni özet/eyebrow metni gerekirse YAZILMAZ,
  içerik agent'ına/kullanıcıya iletilir, o ekler
- `src/components/Hero.jsx` + `src/components/HeroRing.jsx` — içerik
  agent'ının açık bir DEVAM/"Bir konu ara" örtüşme düzeltmesi var (zaten bu
  planda da dokunulmaz kararı vardı, şimdi ayrıca kilitli)
- `src/sections/ScientificSigns.jsx` — Kademe 3.1 + 3.3 hedefi
- `src/sections/HistoricalProof.jsx` — Kademe 3.2 (güven etiketleri)
- `src/sections/ImpossibleRhythm.jsx` — Kademe 3.3 (aruz tarihlendirme)

**Serbest — bu plan şimdi çalışabilir:**
- `src/app/[locale]/page.js`
- `src/components/MobileSectionChipNav.jsx`
- `src/app/globals.css`
- `src/sections/*.jsx` — yukarıdaki üç istisna HARİÇ tümü

**Üç operasyonel kural (bu plan boyunca geçerli):**
1. **Git komutu çalıştırılmaz** (`switch`/`checkout`/`stash`/`commit`) —
   paylaşılan ağaçta herkesi etkiler. Commit merkezî yapılır (kullanıcı
   veya devralan taraf).
2. ~~`npm run build` çalıştırılmaz~~ — **2026-10-25'te kaldırıldı**
   (kullanıcı izni: "kendin çalıştır sonra"). Bu ajan artık rebuild/restart'ı
   kendi çalıştırıyor. Diğer agent'ın aynı anda build/dev sürecinde OLMADIĞI
   teyit edilmeden çalıştırılmaz — çakışma riski hâlâ geçerli, sadece
   merkezileştirme kullanıcıdan bu ajana geçti.
3. **Metin dizesine dokunulmaz, yalnız düzen.** Yeni metin gerekiyorsa
   kullanıcıya/içerik agent'ına sorulur, kendisi ekler.

**Dördüncü kural (kullanıcı direktifi, 2026-10-25) — bu plandaki TÜM kod/
düzen değişiklikleri için geçerli, yalnız metin için değil:** Hiçbir
değişiklik astra onayından geçmeden **final sayılmaz**. Bir aşama
(B/A/C'nin bir alt-maddesi) kod olarak bitince, diff astra'ya gönderilir;
onay/düzeltme alınmadan "tamamlandı" işaretlenmez.

## Kapsam Kararı — astra'nın ikinci görüşüyle düzeltildi (2026-10-24)

İlk tur bu planı "mobil-özel" kabul etmişti (sadece mobilden test edilmiş
geri bildirime dayanarak). Kullanıcı sorunca gpt-6-astra hakemine danışıldı;
hakem şunu düzeltti: **"masaüstünde düzelir" varsayımına güvenilmemeli** —
66 rota + 27 menü öğesi + sıfır rehberlik masaüstünde de seçim yükü
yaratabilir, sadece ekran genişliği onu daha az boğucu gösteriyor. İlke
(aşamalı rehberlik, zorla değil) **iki platformda da** geçerli; değişen
yalnız SUNUM biçimi:

- **Mobil:** biçim fiilen değişir (kısaltma, kart, kademeli menü) — alan
  fiziksel olarak dar.
- **Masaüstü — iki ayrı kural, karıştırılmaz (astra'nın 6. tur düzeltmesi):**
  **anlatı** (Hero-sonrası 15 bölüm) YAPISI bozulmaz, otomatik budanmaz
  (§1 Project Vision'ın cinematic hedefiyle çakışmasın) — yalnız EKLENEN bir
  rehberlik katmanı (atlama linkleri, özet) alır. **Menü** ise erişim kaybı
  OLMADAN (tam liste korunarak) göreve göre yeniden gruplanabilir — bu bir
  yapı bozma değil, mevcut yapının içinde sıralama/gruplama değişikliği.
  İkisi de zorunlu geçit değildir.

## Öncelik Sırası (kullanıcı ile görüşüldü, astra ile 4. turda mutabık kalındı)

> ⚠ **Kök sebebin üç ayrı kesinlik seviyesi var (astra + asistan 4. tur
> mutabakatı) — bunları tek bir "hipotez" torbasına koymak sinyal
> kaybettirir:**
>
> 1. **Bulgu (ampirik, doğrulanmış):** Gerçek bir kullanıcı mobilden test
>    etti ve deneyimi "çok karmaşık, rehberlik istiyorum" olarak tanımladı.
>    Bu bir gözlem değil, olmuş bir olay.
> 2. **Neden hipotezi (doğrulanmamış):** Bu karmaşıklığı "66 rota + geniş
>    menü/makale yüzeyi + 15 bölümlük anlatının hiçbir aşamalılık olmadan
>    sunulması" yaratıyor. Sorunun yaşanmış olması bu açıklamayı kanıtlamaz
>    — görev-bazlı testle doğrulanmalı (Doğrulama bölümü).
> 3. **Genelleme hipotezi (doğrulanmamış):** Aynı sorun masaüstünde veya
>    diğer kullanıcılarda da var. Bu yüzden masaüstü B/C'den muaf tutulmadı
>    ama B/C'nin masaüstü kısmı daha hafif/eklemeli tutuldu (Kapsam Kararı).

Öncelik, **B→A→C→D** (astra'nın 4. tur düzeltmesi — ilk sürümde A en
yüksek etki varsayımıyla başta tutulmuştu, bu yalnız sezgiydi):

1. **B — Hero-sonrası 15 bölüme rehberlik** (mobilde kısaltma, masaüstünde
   atlama/özet katmanı; §17'nin zaten sürdüğü işle birleşir).
   > ⚠ **astra'nın 5. tur düzeltmesi:** "doğrudan kanıtlı tek madde" ifadesi
   > abartıydı ve planın kendi bulgu/neden-hipotezi ayrımıyla çelişiyordu —
   > kullanıcının sözü genel karmaşıklık/rehberlik eksikliğini doğruluyor,
   > ama spesifik olarak "15 bölümlük anlatı" şikayetin kaynağıdır demiyor.
   > B, yapısal bulgulara göre **en güçlü aday hipotez**dir, kanıtlanmış
   > neden değil. Bu yüzden önce küçük kapsamda **test edilecek** madde
   > olarak ele alınır; A'nın gerekliliği bu testin sonucuna göre
   > yeniden değerlendirilir.
2. **A — Niyet bazlı giriş** (etkisi henüz test edilmemiş bir sezgi, B'nin
   sonuçlarına göre gerekliliği yeniden değerlendirilir; mobilde öne çıkan
   ama atlanabilir, masaüstünde opsiyonel/yan kısayol)
3. **C — Mega-menü kademeli/önceliklendirilmiş gösterim** (iki platformda da,
   düşük risk, tamamlayıcı)
4. **D — Kısa ilk-kullanım turu** (opsiyonel, en son — temel karmaşıklığı
   açıklamalarla örtme riski taşır, yapısal sorunu çözmeden üstünü örter)

## B — Hero-Sonrası 15 Bölüme Rehberlik (öncelik 1 — önce test edilecek hipotez)

> ⚠ **8. tur bulgu + astra düzeltmesi (2026-10-25):** `anasayfa-envanter-
> 2026-06-15.md`'ye göre 14 bölümün **5'inin hedef tool sayfası YOK**
> (LinguisticDNA, ImpossibleRhythm, SoundArchitecture, HiddenArchitecture,
> ZeroRedundancy) — envanterin kendi uyarısı: "katmanlama ancak alt katman
> varsa çalışır, yoksa silme olur." Ayrıca Highlights ve QuranRhetoric
> "TAM" sanılmış ama pilot sonrası "eksik" çıkmış. **Astra'nın düzeltmesi:**
> doğru ölçüt "hedef sayfa var mı" değil, **"içerik eksiksiz başka yerde
> karşılanıyor mu"** — bu yüzden kriter aşağıdaki iki yola ayrıldı:
>
> - **Kart + link-out** (§17 pattern'i): SADECE içerik hedef sayfada
>   gerçekten eksiksiz karşılanıyorsa (yeniden doğrulanmış TAM durum).
>   Şu an için **hiçbir bölüm bu şartı kesin karşılamıyor** (AllahKendini-
>   Tanitir hariç — Pilot 1 ile zaten tamamlandı, commit f98d940).
> - **Sayfa içi accordion/collapse** (içerik SİLİNMEZ, aynı sayfada kalır,
>   mobilde varsayılan kapalı, native `<details>/<summary>` veya eşdeğer
>   `aria-expanded`/`aria-controls`/klavye desteğiyle açılır): hedef sayfası
>   olmayan veya "eksik" çıkan TÜM bölümler için kullanılır.

### Mobil (biçim değişir)
- [ ] `anasayfa-envanter-2026-06-15.md` tablosundaki durumu **güncel kodla
  yeniden doğrula** (dosya 2026-06-15 tarihli, 4+ ay bayat olabilir) —
  "TAM" denen her bölüm için gerçekten hedef sayfada eksiksiz karşılığı
  var mı kontrol et, varsayma
- [ ] Doğrulanmış TAM olan bölümler için §17'nin kart pattern'ini (gold-glow
  portal frame, eyebrow, hook headline, anchor verse + çeviri + referans,
  CTA pill) kullan
- [ ] Kalanlar (hedefsiz + eksik çıkanlar) için **accordion** kullanılır:
  - [ ] İçeriğin TAMAMI ilk sunucu HTML'sinde bulunur — tıklayınca fetch
    edilmez, yalnız istemcide üretilmez (§13.31b SSR kapsamı kuralı;
    `node scripts/audit-ssr.mjs` ile doğrula)
  - [ ] Native `<details>/<summary>` tercih edilir; özel bileşen
    gerekiyorsa gerçek buton + `aria-expanded` + `aria-controls` +
    klavye desteği + görünür odak + JS hatasında erişilebilir kalma
  - [ ] Her bölümün etiketi **spesifik ve açıklayıcı** olur (örn. "Seslerin
    Mimarisini Aç") — 14 bölümde aynı jenerik "devamını oku" YASAK, astra
    uyarısı: bu yeni bir sürtünme kaynağı olur
  - [ ] Bölüme derin link gelirse (örn. `#ses-mimarisi`) ilgili panel
    otomatik açılır
- [ ] `MobileSectionChipNav` gerekirse accordion+kart karışımına göre
  güncellenir

### Masaüstü (yapı korunur, rehberlik katmanı eklenir — astra görüşü)
- [ ] 15 bölümlük anlatı **otomatik budanmaz/kartlaştırılmaz** — §1 Project
  Vision'ın cinematic hedefiyle çakışmaz
- [ ] Bunun yerine: (1) her bölüm başına kısa bir özet/eyebrow zaten var mı
  kontrol et, yoksa ekle, (2) bölümler arası atlama linkleri (masaüstü chip
  nav veya sticky TOC), (3) her bölümün sonunda ilgili araç sayfasına
  **belirgin** giriş (CrossToolCTA zaten var, görünürlüğünü doğrula)
  — hedef: anlatıyı okumadan da faydaya (araç sayfasına) ulaşılabilsin

### Ortak
- [ ] Hero'nun kendisi (besmele + halka) **hiçbir platformda dokunulmaz** —
  halka merkez formülü (`cy = 118 + 0.44W`) ve yarıçap sabit kalır (memory:
  halka dokunulmaz)
- [ ] `node scripts/audit-mobile-layout.mjs` + gerçek cihaz/390×734 ölçüm
- [ ] §13.28 `audit-counts` ile araç/tefekkür sayım şeritlerinin bozulmadığı
  doğrulanır

## A — Niyet Bazlı Giriş — ❌ ŞİMDİLİK UYGULANMAYACAK, KAPATILMADI (2026-10-25, astra ile 2. tur)

> **Sonuç (astra'nın düzeltmesiyle netleşti):** B tamamlandıktan sonra A
> yeniden değerlendirildi. Doğru çerçeve **"SixGates A'nın yerini tam
> karşılıyor" DEĞİL — "yeni bir katman eklemek için yeterli gerekçe yok."**
> Gerekçe:
> 1. **En güçlü gerekçe — navigasyon tekrarı riski:** SixGates'in üstüne
>    ayrı bir niyet girişi eklemek, Hero → [yeni blok] → SixGates (konu) →
>    ... → AlanlarPortal (disiplin) şeklinde 3. bir "yolunu seç" katmanı
>    ekler — tam da düzelttiğimiz "üst üste binen navigasyon" sorununu
>    başka bir yerde yeniden üretir. Atlanabilir olması bile kapladığı alanı
>    ve yarattığı karar yükünü sıfırlamaz (astra).
> 2. **SixGates ile A işlevsel olarak TAM eşdeğer değil — bu fark gerçek:**
>    SixGates "Neyle ilgileniyorsun?" (konu-bazlı) sorusunu yanıtlıyor, A
>    "Ne yapmak istiyorsun?" (niyet/aktivite-bazlı) sorusunu hedefliyordu.
>    Bir âyeti anlamak isteyen yeni kullanıcı hangi SixGates kapısının
>    uygun olduğunu çıkaramayabilir. **Bu fark şu an sorun yarattığı
>    gösterilmediği için** düşük öncelikli kaldı, yok sayılmadı.
> 3. **"Kanıt yok" tek başına yeterli gerekçe değildi** (astra'nın
>    düzeltmesi) — genel "çok karmaşık" şikâyeti araştırmayı haklı çıkarır,
>    ama A çözümünü ne doğrular ne çürütür. Düşük geliştirme maliyeti de
>    düşük kullanıcı maliyeti anlamına gelmez.
>
> **Kapanmadı, ertelendi:** Önce görev-bazlı mobil test yapılmalı (plan
> zaten şart koşuyordu). "Başlangıç noktasını bulamama" sorunu gerçekten
> görülürse, çözüm **yeni bir blok eklemek DEĞİL, SixGates'in kendi
> etiketlerini/yapısını niyet-bazlı bir alternatifle karşılaştırmak**
> olmalı (astra önerisi) — ayrı bir A bileşeni değil.
>
> Aşağıdaki orijinal checklist **arşiv amaçlı** bırakıldı (uygulanmadı).

<details>
<summary>Arşiv — orijinal A planı (uygulanmadı)</summary>

> ⚠ **astra'nın 2. tur düzeltmesi:** genel ilke "rehberlik zorla değil,
> atlanabilir" — bu, mobil uygulamada da geçerlidir. Aşağıdaki "zorunlu
> adım" ifadesi **sadece ön plana çıkarma** anlamındadır; mevcut içeriğe
> erişim seçim yapmaya **bağlanamaz** (her zaman bir "atla / serbestçe
> keşfet" çıkışı olmalı).

### Mobil (öne çıkan ama atlanabilir giriş katmanı)
- [ ] §17 Pilot 1/2/3 ilerlemesini kontrol et (hangi bölümler zaten karta
  indirildi, anasayfa-envanter tablosunu güncel durumla karşılaştır)
- [ ] 4-5 niyet kategorisi tasarla (örn. "Bir âyeti anlamak", "Kur'an'ı
  keşfetmek", "Araştırma yapmak", "Okumaya başlamak") — mevcut
  Keşfet/Araçlar/Tefekkür taksonomisinden **türetilir**, yeni içerik icat
  edilmez (memory: enhance don't invent)
- [ ] Her niyet mevcut rotalara haritalanır (yönlendirme katmanı, yeni sayfa
  içeriği yok)
- [ ] Mobilde ilk ekranda öne çıkar, ama **her zaman bir "Atla / Serbestçe
  keşfet" çıkışı taşır** — içeriğe erişim bu seçime bağlanamaz (astra
  düzeltmesi: "zorunlu adım" ifadesi çelişkiliydi)
- [ ] Blok **CSS media query** ile mobilde gösterilir (§14.2: `isMobile`
  JS state'i düzen-kritik CSS'e bağlanamaz, CLS riski)
- [ ] Blok hero'nun **geometrisinden bağımsız** yerleşir — halka merkez/
  yarıçap hesabını (`cy = 118 + 0.44W`) hiçbir şekilde etkilemez; eklendikten
  sonra halkayı mobilde yeniden ölç (astra düzeltmesi: "hero yanında/altında"
  ifadesi somut yerleşim garantisi vermiyordu)

### Masaüstü (opsiyonel, yan kısayol — astra görüşü)
- [ ] Aynı 4-5 niyet seçeneği masaüstünde **zorunlu geçit değil**, anlatıyı
  bozmayan bir yan kısayol olarak sunulur (örn. hero'nun yanında/altında
  küçük bir "Ne yapmak istiyorsun?" bloğu + "Serbestçe keşfet" seçeneği)
- [ ] Bu blok da hero geometrisinden bağımsız yerleşir; eklendikten sonra
  masaüstü halka/hero ekran görüntüsü karşılaştırması tekrarlanır
- [ ] Mevcut cinematic scroll-story akışı **değişmez**, bu yalnız ek bir
  giriş kapısıdır, anlatının yerini almaz

### Ortak
- [ ] i18n: `tr.json` + `en.json` **bu plan tarafından yazılmaz** (Paralel
  Agent Koordinasyonu bölümü) — niyet kategorisi metinleri taslak olarak
  hazırlanır, eklenmesi kullanıcıya/içerik agent'ına bırakılır
- [ ] Blok'un hero'nun "yanına/altına" yerleşimi `Hero.jsx` dosyasına
  dokunmayı gerektirebilir — bu dosya şu an kilitli (Paralel Agent
  Koordinasyonu). A'nın mobil/masaüstü yerleşimi, `Hero.jsx` serbest
  kalana kadar ya ayrı bir wrapper/sonraki section'a taşınarak ya da
  bekleyerek çözülür; A zaten öncelik 2 olduğu için bu B bitene kadar
  acil değil
- [ ] humanizer skill kontrolü (§13.34) — yeni metin no-go kapısı
- [ ] `node scripts/audit-mobile-layout.mjs` ile 390×734 doğrulama (mobil)

</details>

## C — Mega-Menü Kademeli/Önceliklendirilmiş Gösterim (iki platformda)

> **Gerçek sayım + canlı inceleme (2026-10-25):** Keşfet 26, Araçlar 23,
> Tefekkür 7 link (**53 değil** — o rakam toplam makale kataloğu, navbar
> zaten küratörlü). **Masaüstü mega-menüler zaten görev/konu-bazlı
> gruplanmış** (Araçlar: Görselleştirme/Analiz & Veri/Araştırma & Keşif
> sütunları, altta "TÜM ARAÇLAR →"; Keşfet: 4 tematik sütun, ikon+açıklama)
> — bu madde masaüstü için **büyük ölçüde zaten karşılanmış**, dokunmaya
> gerek yok.
>
> **Gerçek fırsat mobilde:** Hamburger menü masaüstündeki sütunlu yapıyı
> KORUMUYOR — KEŞFET (26) → ARAÇLAR (23) → TEFEKKÜR (6 kategori) hepsi tek
> uzun düz liste halinde art arda akıyor, **hiç daraltma/accordion yok**.
> Ölçülen: drawer toplam **~4.693px (~6.4 mobil ekran)**. Bu, planın
> orijinal "4-5 öne çıkan + tümünü gör" önerisinin tam uygulanabileceği
> gerçek bir yer — SixGates/AlanlarPortal/masaüstü menüler gibi "aslında
> sorun yokmuş" çıkmadı.
>
> ⚠ **Şu an `src/` kilitli** (içerik agent'ının canlı denetim zinciri
> koşuyor, ~10-16 dk, 2026-10-25) — uygulama bu pencere kapanınca başlar.

> ⚠ **astra'nın 2. tur düzeltmesi (eski not, hâlâ geçerli):** keşif turunda "66 araç/atlas/graf
> **rotası**" (toolCatalog.js'teki toplam route sayısı) ile Araçlar
> menüsündeki **öğe sayısı** (agent raporuna göre menüde görünen 16+)
> birbirine karıştırılmıştı — rota sayısı menü öğesi sayısı değildir. Bu
> madde için **ilk iş** mevcut menü envanterini (Keşfet/Araçlar/Tefekkür
> her birinin menüde GERÇEKTEN kaç öğe gösterdiğini, `src/data/tools.jsx` +
> ilgili menü bileşenlerinden) yeniden saymak; aşağıdaki sayılar bu sayım
> yapılana kadar **taslak**tır.

### Mobil (gerçek fırsat — `src/` kilidi açılınca başla)
- [x] Gerçek menü öğesi sayıları doğrulandı: Keşfet 26, Araçlar 23,
  Tefekkür 7 link + alt kategoriler (Keşfet: Dil & Yapı / Retorik & Dua /
  İnsan & Toplum / Kur'an'ın Evreni; Araçlar: Görselleştirme / Analiz &
  Veri / Araştırma & Keşif; Tefekkür: 6 kategori)
- [ ] Her üst bölüm (KEŞFET/ARAÇLAR/TEFEKKÜR) mobilde **accordion/collapse**
  olur — varsayılan kapalı veya yalnız öne çıkan banner + ilk alt kategori
  açık, geri kalanı "Tümünü gör"/dokunarak aç. Masaüstünün sütunlu
  gruplamasını (zaten var, iyi) mobilde accordion başlıkları olarak
  yeniden kullan — yeni taksonomi icat etme, var olanı katla.
- [ ] İçerik SİLİNMEZ, SSR'da kalır (§13.31b) — yalnız varsayılan görünürlük
  CSS/attribute ile kapatılır (native `<details>` tercih, §8'deki
  accordion dersleriyle tutarlı — bkz. B maddesindeki ScienceTimelineCard
  erişilebilirlik notları)
- [ ] `Navbar.jsx` mobil davranışı CSS ile yönetilir (isMobile JS state'i
  yalnız davranış için, düzen için değil — §14.2)
- [ ] Hedef: 4.693px (~6.4 ekran) → ilk açılışta ~1.500-2.000px (~2-3 ekran)

### Masaüstü (astra görüşü: muaf tutulmaz, ama büyük ölçüde zaten karşılanmış)
- [ ] Mega-menüler **göreve/niyete göre** öncelikli gruplanır — astra'nın
  3. tur düzeltmesi: "En çok kullanılan" / "Yeni" gibi etiketler görev
  grubu DEĞİLDİR, en fazla ek rozet olarak eklenebilir, görev temelli
  gruplamanın yerine geçemez
- [ ] Gerçek kullanım/navigasyon verisi varsa öne çıkanlar ona göre
  seçilir; **yoksa** seçim yöntemi açıkça yazılır (örn. "A maddesindeki
  niyet kategorilerine en çok eşlenen rotalar") — tahmine dayalı, yöntemi
  belirtilmeyen bir öne-çıkarma yapılmaz
- [ ] Tam liste gizlenmez, astra'nın 2. tur uyarısı: "kalan araçları
  bulunamaz hâle getirme"

### Ortak
- [x] Menüdeki toplam öğe sayıları (doğrulanmış gerçek sayım) değişmedi,
  yalnız gösterim sırası/kademesi değişti — kataloğun tamamı erişilebilir
  kalıyor, hiçbir öğe silinmedi (yalnız DOM'dan daraltılmış halde yok,
  tıklayınca geri geliyor)

### ✅ TAMAMLANDI (2026-10-25, Navbar.jsx + globals.css)

- [x] **Mobil accordion uygulandı:** KEŞFET(26)/ARAÇLAR(23)/TEFEKKÜR(6)
  her biri bağımsız `aria-expanded` buton + sayı rozeti + chevron.
  Varsayılan kapalı. Öne çıkan bannerlar (Kur'an'ı Tanı, Tüm Yazılar)
  daraltmaya bağlı değil, her zaman görünür.
- [x] **Ölçülen sonuç:** kapalı 870px (~1.2 ekran, önceki 4.693px'den
  **%81 azalma**), Keşfet açıkken 2.476px — hâlâ eskisinden az. Masaüstü
  piksel piksel aynı (ekran görüntüsüyle doğrulandı, mega-menüler zaten
  görev-bazlı gruplanmıştı, dokunulmadı).
- [x] **aria-controls eklendi** (astra'nın 1. tur notu) — her buton kendi
  panelinin benzersiz id'sine işaret ediyor; panel kapalıyken DOM'da hiç
  yok (yalnız görsel gizleme değil, tamamen erişilebilirlik ağacı ve Tab
  sırası dışında).
- [x] **Gerçek bir focus-kaybı bug'ı bulundu ve düzeltildi (astra'nın 2.
  tur önerisiyle — "klavye testi de otomatikleştirilebilir" demişti,
  haklı çıktı):** `MobileSectionHeader`/`MobileItem`/`MobileFeatured`
  Navbar() render'ı içindeki bir IIFE'de tanımlıydı — her render'da yeni
  bir bileşen referansı üretip React'e "farklı tür" gibi görünüyordu,
  toggle sırasında DOM düğümü unmount/remount oluyor, focus `body`'ye
  düşüyordu. Masaüstü dropdown'larında (stabil referans) bu kayıp yoktu
  — karşılaştırmalı test bunu doğruladı. Üç bileşen de modül seviyesine
  taşındı (`language`/`onAfterClick` artık prop, closure değil); Playwright
  klavye testiyle doğrulandı: focus artık aç/kapa döngüsü boyunca butonda
  kalıyor, hiç kaybolmuyor.
- [x] Rebuild + canlı doğrulama + astra onayı üç ayrı turda alındı (ilk
  yaklaşım, aria-controls eksikliği, focus-kaybı bug'ı — hepsi bulunup
  düzeltildi, sonunda "EVET, tamamlandı" onayı alındı)

## D — (Opsiyonel, en son) Kısa İlk-Kullanım Turu

- [ ] Yalnız A/B/C tamamlanıp ölçüldükten sonra değerlendirilir
- [ ] Jenerik "ürün turu" widget hissi YASAK (memory: görsel tasarım barı) —
  site görsel diline (Playfair/gold/glassmorphism) uygun özel tasarım
  gerekir

## Doğrulama (her aşamada tekrarlanır)

> ⚠ **astra'nın 8. tur eki (accordion için):** B'de accordion kullanılan
> bölümlerde pilot ölçümü yalnız "açılma oranı" değil, **içeriği bulma VE
> okuma başarısı** ölçülür — bir panel açılmış görünse de kullanıcı aradığı
> bilgiyi bulamamış/okumamış olabilir. Ayrıca "TAM" durumu yeniden
> doğrulanır (yukarı bak) — 2026-06-15 tarihli envantere güvenilmez.

> ⚠ **astra'nın 2./3./5. tur düzeltmesi:** aşağıdaki teknik denetimler
> (audit script'leri) GEÇMEK, "araçlar bulunabilir kaldı" veya "rehberlik
> işe yaradı" iddiasını KANITLAMAZ — bunlar yalnız regresyon/teknik
> sağlamlık ölçer. **Kendi kendine (taze gözle) görev testi de TEK BAŞINA
> yeterli kanıt değildir.** Önce/sonra karşılaştırması **"mümkünse"
> DEĞİL, zorunlu** (5. tur düzeltmesi: önceki metin bu şartı gevşetip
> kendisiyle çelişiyordu) — B'de ilk değişiklik yapılmadan ÖNCE, iki
> platformda da şu başlangıç ölçümü alınır: "bir âyeti anla", "öne
> çıkarılmayan bir aracı bul", "anlatıyı atlayıp doğrudan bir araca git"
> gibi somut görevlerde başarı oranı ve süre. Her aşama sonrası aynı
> görevler aynı metriklerle tekrarlanıp başlangıç ölçümüyle karşılaştırılır.
> Hedef kullanıcı yoksa en az birkaç gerçek kişiyle (ekip dışı) yapılır —
> yalnız kendi kendine test, bu karşılaştırmanın yerine geçmez. Masaüstünde
> eklenen atlama linklerinin mevcut scroll-story davranışını (reveal
> animasyonları, sticky chip nav) bozmadığı da bu sırada kontrol edilir.
>
> **astra'nın 7. tur eki (metodolojik, çelişki değil):** aynı kişilere
> aynı görevi önce/sonra tekrar ettirmek öğrenme etkisini tasarım
> iyileşmesiyle karıştırabilir — mümkünse eşdeğer alternatif görevler
> kullanılır veya katılımcı grubu dengelenir (herkes hem öncesini hem
> sonrasını test etmez); küçük örneklem sonucu kesin kanıt sayılmaz, yön
> göstergesi olarak okunur.

- [ ] `node scripts/audit-mobile-layout.mjs` (0 bulgu hedefi, §13.36)
- [ ] `npm run audit:static` + `npm run audit:live`
- [ ] humanizer skill — yeni/değişen her metin için (§13.34, no-go)
- [ ] Gerçek 390×734 ölçüm (iPhone görünür alan, svh — tam ekran yüksekliği
  değil, memory: mobilde de ölç)
- [ ] Masaüstü hero/halka ekran görüntüsü karşılaştırması — hiç değişmedi mi
- [ ] `node scripts/audit-counts.mjs` — araç/tefekkür sayıları sabit
- [ ] Görev-bazlı yürüyüş (yukarı bak): mobil + masaüstü, en az 3 somut görev

## Commit

> ⚠ **Paralel Agent Koordinasyonu kuralı (2026-10-25):** bu plan boyunca
> `git commit`/`git push`/`npm run build` BU AJAN tarafından çalıştırılmaz
> — paylaşılan çalışma ağacında başka bir agent eşzamanlı çalışıyor.
> Değişiklikler dosya üzerinde bırakılır, astra onayı alındıktan sonra
> commit/build kullanıcı tarafından (veya kullanıcının belirlediği
> merkezî süreçte) yapılır.

- [ ] Her aşama (B/A/C/D sırasıyla) kod olarak bitince astra'ya gönderilir,
  onay/düzeltme alınmadan "tamamlandı" işaretlenmez
- [ ] Commit/push/build bu ajan tarafından ÇALIŞTIRILMAZ — kullanıcıya
  teslim edilir (§17.4'teki "push onayı bekle" kuralı burada "commit/build
  de bu ajanda değil" şeklinde genişletildi)
