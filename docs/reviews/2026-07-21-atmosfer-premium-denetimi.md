# QuranCodex — Atmosfer / Premium / Manuscript Kimlik Denetimi

**Tarih:** 2026-07-21
**Kapsam:** Ana sayfa scroll-story (Hero → SixGates → 3 cluster → ToolsHighlight → Conclusion → Footer)
**Referans çerçeve:** DARK theme (Cosmic Black `#0a0a1a` + Deep Navy `#0d1b2a` + Antique Gold `#d4a574`). Palet kilitli — hiçbir hex önerisi verilmez.
**Ölçüt:** "steril SaaS" ↔ "el yazması / kütüphane / parşömen / taş" atmosfer ekseni.
**Yasak:** Renk (hex/rgba) değişikliği önerisi. Yalnızca doku, grain, radial-gradient katmanı, cetvel/çerçeve mimarisi, ritim, motion, spacing dokümante edilir.

---

## Yönetici Özeti (spoiler)

Site "cosmic dark + altın accent + Playfair display + Arapça KFGQPC" temel tipografik kimliğiyle **premium bir zemine** oturmuş; ancak zeminin **ÜSTÜNDE bir "doku katmanı" eksik**. Renkler ve fontlar timeless; fakat cosmic-black **düz-siyah** olarak akıyor (grain/noise/paper-vellum yok), Islamic pattern overlay'leri sadece %3-5 opacity ile ekran-scale tile (parşömen kenar/kağıt kalınlığı hissi vermiyor), section-arası "gradient bridge" iki solid tonu birbirine karıştıran teknik bir geçit (chapter break / illumine hairline hissi zayıf), kartlar aynı **böylesine tek bir template**'i tekrarlıyor (radial gold-glow + gold-border + border-radius: 20px + gold pill CTA — üç cluster boyunca 14 kartta birebir aynı).

**Sonuç:** Kimlik-katmanı ✅, atmosfer-katmanı 🟡. Site "premium bir dark SaaS"ten "manuscript codex"e yükseltilmek için **doku (grain/vellum), çerçeve (illumine border/frame), ritim (kart-şablon varyasyonu) ve section-boundary illumination** düzeyinde katmanlanmalı.

---

## 1. HERO — İlk 3 saniye izlenimi

### 1.1 Cosmic-black gerçekten "kağıt/vellum" değil, düz-siyah

**Dosya:** `next/src/components/Hero.jsx:60-85`

```jsx
<section id="hero" className="relative overflow-hidden bg-cosmic-black">
  <ParticleBackground ... />
  <div className="absolute inset-0 islamic-pattern-bg opacity-[0.04] animate-rotate-slow origin-center" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.06)_0%,transparent_65%)]" />
  <div className="absolute inset-x-0 bottom-0 ... radial-gradient(... rgba(212,165,116,0.08) 0%, ... transparent 70%)" />
```

**Gözlem:** Zemin `#0a0a1a` düz fill. Üstüne:
1. Islamic star pattern (%4, dönerken)
2. Merkezî altın radial glow (%6)
3. Alt merkezî sıcak halo (%8)

Üç katman da **düz gradient / vector overlay** — hepsi CSS-jenerik. Ne "noise", ne "grain", ne "kağıt fibril" dokusu, ne "el yazması vellum" tekstürü var. Kullanıcı ilk saniyede gördüğü şey: **matematiksel olarak temiz, monoton siyah düzlem + altın halka**. Bu "startup landing sayfası" hissini uzaklaştırmıyor — sadece daha koyu bir startup gibi hissettiriyor.

**Manuscript foto-doku argümanı:** Osmanlı hüsn-i hat sayfası, Hattat Şevki albümü, Kufi tezhib — bunlar altın-üzeri-siyah değil, altın-üzeri-**vellum-doku**. Vellum'un mikro-yüzey ışık dağılımı, gözle görmeden hissedilen bir ısı verir. Bu site sıfır grain ile bunu çıkarıyor.

**Kanıt (kod tabanında):** `grep -rn "grain\|noise\|texture\|vellum" globals.css Hero.jsx HeroGeometricBackground.jsx` → **hiçbir eşleşme yok**. Sitede grain/noise altyapısı sıfır.

**Skor:** 🔴 KIRMIZI — atmosfer boşluğunun ana kaynağı. `<div class="absolute inset-0 grain-overlay">` (SVG feTurbulence veya küçük tile PNG, %2-3 opacity, `mix-blend-mode: overlay`) sadece Hero'ya değil, `body` seviyesinde global olarak var olmalı. Bu tek katman sitenin duygu-yaşını 40 yıl geçmişe (kütüphane/parşömen) taşır.

---

### 1.2 ParticleBackground — mukattaa harfleri iyi bir semantic seçim ama davranış "startup"

**Dosya:** `next/src/components/ParticleBackground.jsx:24-53`

**Gözlem:** 40 particle (mobilde 22), %20'si mukattaa harfleri, gerisi noktalar. Yatay/dikey doğrusal drift + twinkle. Semantic yönü **çok doğru** (14 mukattaa harfi = site tezine imza), ama fizikal davranış tipik "modern web hero starfield" — noktalar yukarı süzülür, kaybolur, üstten girer. Bu pattern Vercel/Linear/Framer landing sayfalarında yüzlerce yerde var. Manuscript'in noktaları yok — manuscript'te mürekkep vardır, filigran vardır.

**Manuscript foto-doku argümanı:** Kur'an hat sayfasında "particle" yoktur; ama tezhib süsleri statik, mikro-ışıltılı, elle konumlandırılmış. Rastgele dağılmaz — simetrik/altın-oran'a oturur.

**Skor:** 🟡 SARI — mukattaa seçimi güzel (koru). Nokta partikülleri özellikle tek başlarına çok "SaaS"; %70 mukattaa + %30 nokta yerine %90 mukattaa + %10 filigree ornament (küçük statik altın 8-köşeli yıldız SVG, viewport'a sabit) daha manuscript hissi verir. Alternatif: nokta partiküllerini tamamen kaldır; sadece mukattaa harfleri kalsın (opacity zaten `0.06-0.14` → cinematic sessizlik korunuyor, sadece "nokta gürültüsü" gitsin).

---

### 1.3 Bismillah + Alak ayeti — bu blok gerçekten timeless (referans nokta)

**Dosya:** `next/src/components/Hero.jsx:105-224`

**Gözlem:** Bismillah glow-pulse + Alak char-by-char reveal (kalem yazıyor hissi) + italik meal + spaced-caps referans. Bu blok **manuscript hedefine en yakın olan yer**. Char-by-char delay `1.9s + i*0.022s` — bilinçli bir "kalem" ritmi. Referans satırı `letter-spacing: 0.18em` uppercase — kütüphane katalog kartı tipografisi. Alt bismillah'ın light-sweep'i (sağdan sola geçen 60% gradient) Arapça yön uyumlu.

**Skor:** 🟢 YEŞİL — sitenin en "codex" hissi verdiği yer. Bu blok baseline; başka her section bu ritme yaklaşmalı.

---

### 1.4 Sahne 2 (H1 "Görünmeyen Mimari") — filigree divider iyi ama H1 gövdesi jenerik-lush

**Dosya:** `next/src/components/Hero.jsx:352-397`

**Gözlem:** Sahne-2 açılışı `160px × 1px` altın-fade divider'la başlıyor — güzel. Sonra **çıplak Playfair H1** geliyor (arkasında hiçbir çerçeve/tezhib/frame yok). H1 `font-weight: 900, letter-spacing: -0.015em` — bu spek "modern editorial magazine" (New Yorker, Vanity Fair) — Playfair'ın hakkı; ama manuscript değil. Manuscript başlığı bir çerçeve içinde durur; onu illumine eden hairline veya köşe süsü olur.

**Manuscript foto-doku argümanı:** Osmanlı kitap kapağı — sure başlığı bir dörtlü altın çerçeve (kartuş) içinde, köşelerde tezhib. Playfair H1 tek başına ekranın ortasında dururken, arkasında bir **kartuş / cadre / cornice** yok. Bu H1 herhangi bir SaaS landing'e alınabilir ve fark etmez.

**Skor:** 🟡 SARI — H1 içeriği ve fontu doğru (koru). Etrafındaki kartuş eksik: H1 arkasına **çok subtle** bir SVG cadre (dört köşede 20×20 altın filigree, 0.15 opacity, sadece Sahne-2'de) manuscript aile kimliğine büyük katkı yapar. Hero'daki `HeroGeometricBackground` component'ı (tool sayfalarında kullanılıyor) buraya da uygulanabilir — sitenin kendi kütüphane deposunda hazır.

---

## 2. SECTION-ARASI GEÇİŞ

### 2.1 gradient-divider — solid tonlu boyanmış bant, chapter break değil

**Dosya:** `next/src/app/globals.css:213-238`

```css
.gradient-divider {
  height: 96px;
  background:
    linear-gradient(180deg, transparent 48%, rgba(212, 165, 116, 0.10) 50%, transparent 52%),
    linear-gradient(180deg, cosmic-black 0-18%, deep-navy 82-100%);
}
```

**Gözlem:** İki solid section rengi arasında 96px yükseklikte fade + tam ortasında %10 opacity altın hairline. Teknik uygulama iyi (CLAUDE.md §4'ün "200px gradient overlap" spesifikasyonuna sadık, mobilde 64px). Ama üretilen hissiyat: **düz gradient bant.** Manuscript "chapter break" bir bant değil — bir **ilmî** (yaprak süsü), bir **medhil** (giriş kartuşu), veya en azından bir **çift hairline** (ince altın çift çizgi + arada boşluk) olur.

Hairline'ın kendisi de "48% → 50% → 52%" ile 4px kalınlığında hafif blur — belli-belirsiz görünüyor. Ya cesur olmalı (%25 opacity, 1px keskin, üstünde ve altında spacing), ya tamamen kaldırılıp yerine ornament (CardSeam benzeri) konulmalı.

**Karşılaştırma (site içi tutarlılık):** Ana sayfada `<CardSeam />` component'ı **kart aralarında** çok güzel bir manuscript ornament çıkarıyor (8-köşeli yıldız + iki-yön filigree + variant='seal' opsiyonu). Ama section aralarında (`cluster-fascination` → `cluster-astonishment` gibi) böyle bir seam yok — sadece `linear-gradient` CSS transition. **Aynı sitede iki farklı seam felsefesi** var: kart-arası ornament (güzel), section-arası CSS-gradient (steril).

**Skor:** 🟡 SARI — hairline'ı ya kaldırıp CardSeam'i cluster arasına çıkar, ya cesurlaştır. Sitede zaten "seal" variantı olan CardSeam var (`CardSeam variant="seal"`), section-arası **major boundary** için bu tam da bekleyen ornament.

---

### 2.2 section-seam-into-deep / -into-black — pseudo-element ile 200px fade

**Dosya:** `next/src/app/globals.css:267-296`

**Gözlem:** İçerideki section'lar `::before` pseudo-element ile alttan gelen 200px transparent → solid fade uyguluyor (üstteki section'ın rengi seam üstünden akıp aşağı doğru kayboluyor). Çok temiz teknik çözüm (extra DOM yok). Ama yine **solid renkten solid renge saf düz gradient** — hiçbir manuscript sinyali yok.

**Skor:** 🟡 SARI — teknik iyi, atmosfer sıfır. Bu seam'e ekstra bir katman eklemek gerekmez ama seam'in **arkasına** 200px yüksekliğinde çok soluk (%2 opacity) bir SVG filigree strip (yatay tezhib bordürü, tekrarlanan altın kement motifi) eklenirse iki section'ı bir "kağıt yaprağı çevrilir gibi" ayırır.

---

### 2.3 cluster::before pattern overlay — tile boyutu ekran-scale, kağıt-scale değil

**Dosya:** `next/src/app/globals.css:527-546`

```css
.cluster-fascination::before {
  background-image: url("data:image/svg+xml,...width='80' height='80'...polygon...");
  background-repeat: repeat;
  opacity: 0.035;
}
```

**Gözlem:** Üç cluster'ın her birinin farklı Islamic geometric tile'ı var (fascination: 6-köşeli çokgen, astonishment: iç-içe daire+cross, reflection: 8-köşeli çift yıldız). Tile boyutu 80×80 (reflection 100×100). Semantic doğru — her cluster'ın kendi motifi olması manuscript'te "her fasıl kendi tezhibiyle" prensibine uygun.

**Problem:** %3-4 opacity **çok soluk**, tile 80px **çok küçük**, tekrar **çok tekdüze**. Ekranda bakınca fark edilmiyor — sadece "boşlukta bir hışırtı var galiba" hissi. Manuscript sayfasında motif ya belirgin (kenar bordürü) ya yok. Bu ara-doz (nesting-doz) SaaS'in "subtle dot grid" (Linear, Cursor) pattern'ıyla aynı retinal etkiyi üretiyor.

**Skor:** 🟡 SARI — iki alternatif:
1. **Bordür yaklaşımı:** Tile'ı repeat yerine sadece **sol/sağ kenarlara** dikey bir bordür olarak yerleştir (24-32px genişlikte, %8-10 opacity). Ekran-orta boşluk kalır, kenarlar tezhib gibi çerçevelenir.
2. **Watermark yaklaşımı:** Tile'ı tamamen bırak; her cluster'ın **merkezine** tek büyük (400-600px) statik motif koy (%3 opacity). Kur'an kitabı tek büyük motifle bir bölüm açar; küçük tile ile değil.

---

## 3. GLASSMORPHISM KARTLAR

### 3.1 Tüm anlatı kartları (Mukattaa/Ritim/Halka/Ses/...) birebir aynı şablon

**Dosyalar:**
- `next/src/sections/MukattaaCard.jsx:38-51`
- `next/src/sections/RitimCard.jsx:33-49` (birebir kopya)
- Diğer 12 kart aynı pattern

```jsx
background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
border: `1px solid ${COLORS.gold}33`,
borderRadius: '20px',
boxShadow: `inset 0 0 0 1px ${COLORS.gold}14, 0 30px 80px rgba(0,0,0,0.4)`,
padding: 'clamp(40px, 6vw, 64px) clamp(28px, 5vw, 56px)',
```

+ Her kart yukarısında aynı `radial-gradient(ellipse at center, gold10 0%, transparent 55%)` overlay.

**Gözlem:** 14 kart × %100 aynı gövde stili + %100 aynı eyebrow → h2 → Arapça ayet → italik meal → silver açıklama → gold pill CTA ritmi. Bu **çok tutarlı bir kimlik**, ama aynı zamanda **manuscript'in tam tersi**: bir kitabın 14 bölümünün her biri farklı bir tezhib formatına oturur. Elmalılı tefsirinin her sure girişinin başlığı farklı süslüdür. Modern SaaS'te ise "component library reuse" gereği hepsi tek bir `<Card />` component'i olur. Bu site **tam olarak SaaS component-library pattern'ını** kullanıyor.

Ek not: **`radius: 20px`** — bu radius modern web'in "friendly SaaS card" değeridir (Notion 8px, Stripe 8px, Linear 6px, Vercel 12px). Manuscript "yaprak köşesi" `0-4px` (keskin), tezhib "kartuş köşesi" `8-12px` (yumuşak-klasik). `20px` **öğrenci ödevi Bootstrap** hissi verir.

**Skor:** 🔴 KIRMIZI — atmosfer için ikinci en yüksek priority. Öneri:
1. `borderRadius: 20px` → `12px` (klasik kartuş) veya kartın üst iki köşesi `8px`, alt iki köşesi `2px` (kitap yaprağı asimetrisi). En azından bir varyans ekle.
2. Kart border'ının **yalnızca üst ve alt** (yatay hairlineler) olduğu bir alt-varyant ekle — bu manuscript "bordür" hissi verir (yan çerçeve yok, sadece yatay iki altın çizgi).
3. FeaturedWrap zaten "ÖNE ÇIKAN" pill'i ile bir varyans katmış — iyi. Ama sadece "featured" değil, "kavramsal", "matematiksel", "tarihsel" gibi alt-şablonlar da olabilir. Cluster'a göre kartın **iç mimarisi** varyanslanmalı.

---

### 3.2 SixGates 6 kartı — grid dengeli ama 6-tekrar hissi tekdüze

**Dosya:** `next/src/sections/SixGates.jsx:157-173`

**Gözlem:** 6 kapı kartı `minmax(320px, 1fr)` auto-fit grid'e serilmiş, hepsi `minHeight: 320px` + aynı `borderRadius: 16px` + aynı `padding: 26px 24px` + her biri kendi accent rengi ile aynı `${accent}10` opacity gradient bg. Kart-05 (Veriyle Keşfet) haklı bir istisna: SVG graf node arka planı ekleniyor. Bu **tek varyans** — diğer 5 kartın hepsi birebir aynı şablon farklı renkte.

**Manuscript foto-doku argümanı:** Alt-i Kapı (6 kapı) — Osmanlı külliye kapılarında her biri farklı bir tezhib motifiyle işlenir (nesih üstünde riq'a, riq'a üstünde sülüs). Tek bir "template" e sokulmaz. Burada 6 kart 6 farklı SVG icon dışında birbirinden ayırt edilemiyor.

**Skor:** 🟡 SARI — SixGates konsept olarak güzel (üstteki H2 "Nereden Başlamak İstiyorsun?" + eyebrow "Altı Kapı · Keşif Yolları" ⭐). Kart-05'e gelen graf-node SVG'si model — her kartın kendi background-SVG'si (Kapı 1: mukattaa harf, Kapı 2: yıldız gökyüzü glyph, Kapı 3: nefes/kalp glyph, Kapı 4: kitap glyph, Kapı 6: piramit-mimari glyph) olmalı. Var olan pattern'a %5 opacity SVG eklemek 6-katlı tekdüzeliği kırar.

---

### 3.3 CardSeam — sitenin en manuscript ornament'ı (koru & yay)

**Dosya:** `next/src/sections/CardSeam.jsx:38-87`

**Gözlem:** Kart aralarına gelen 8-köşeli yıldız + iki-yön filigree. `variant="seal"` daha büyük + iki diamond ilavesi. Bu tam olarak **manuscript ilmî**. Site içindeki tek gerçek "codex" ornament'ı.

**Skor:** 🟢 YEŞİL — koru. Şu anda cluster **içinde** her kart arasında var; ama cluster **arası** boşluklarda yok (yerine solid gradient). Cluster-arası boundary'lere `<CardSeam variant="seal" />` (mevcut kod, ekstra iş yok) eklenirse üç cluster'ın her biri manuscript'te "fasıl kapağı" gibi hissettirir. Şu an son CardSeam cluster'ın son kartından **sonra** var (`p:127-124-142`); doğru pozisyon. Yeni cluster **başlarken** de bir açılış-seal olmalı (klasik kitap yaprağı: fasıl bitişi ilmî, sonraki fasıl başlangıcı ilmî).

---

## 4. FOOTER — kütüphane colophon mu, site footer mı?

**Dosya:** `next/src/components/Footer.jsx:11-259`

**Gözlem:** Tepede tek 1px altın gradient hairline (güzel — colophon hairline). Ortada logo-mark PNG (120×120) + "QURANCODEX" wordmark (Playfair, `letter-spacing: 0.2em`) + "HIDDEN ARCHITECTURE OF THE QURAN" tagline (uppercase, `letter-spacing: 0.28em`). Sonra methodology paragrafı (offWhite/78, italic-less body). Sonra `glass-card p-8` içinde kaynakça (columns-2 responsive, 12+ kaynak, gold bullet).

**Colophon karşılaştırması:** Osmanlı hattat imzası "ketebehu ..." bir tarih + hattat adı + duası ile biter. Modern akademik kitap colophon'u: font, kağıt, basım yeri, tarih, matbaacı. Bu Footer **iki dünya arasında**:
- 🟢 Wordmark + tagline uppercase-spaced-caps → **colophon**
- 🟢 Kaynakça `columns-2`, gold bullet → **kütüphane**
- 🟡 `glass-card p-8` (blur+cream-transparent) → SaaS glassmorphism (colophon **kağıt üzerine yazılır**, cam üzerine değil)
- 🔴 Bottom bar (© 2026 + qurancodex.com + info@qurancodex.com) → tipik footer, colophon değil

**Skor:** 🟡 SARI — %50 kütüphane, %50 SaaS. İyileştirmek için:
1. Kaynakça `glass-card`'ını **glass'tan çıkar** — düz `background: transparent` üstüne çift hairline (üst + alt altın 1px) yeter. Colophon **cam** değildir; **açık kağıt**tır.
2. Bottom bar'ı Latince fooot-note (küçük italic Playfair) formatına dönüştür: "Hâzâ el-metâʿu ketebehu ʿabdullāh eş-Şerdâr fî sanei 1447 hicrî — qurancodex.com" (dil olarak istenirse abartısız versiyon: "Bu çalışma 2026'da qurancodex.com'da bir araya getirildi. — info@qurancodex.com"). Sadece tone-of-voice değişikliği ekleyecek çok atmosfer.
3. `logo-mark.png` üstüne ince altın 1px daire kenar (mühür hissi).

---

## 5. TOOL SAYFALARI — HeroGeometricBackground var, ana sayfa yok (ATMOSFER TUTARSIZLIĞI)

**Dosyalar:**
- `next/src/components/HeroGeometricBackground.jsx:37-99` (component)
- Kullananlar: `IblisSatan`, `IlkSonKelimeler`, `InsanPsikolojisi`, `KuranRenkleri`, `KuranYeminleri`, `Melekler`, `NefisMertebeleri` (8 tool)

**Gözlem:** Site zaten "eight-fold star + iç hexagon + merkez glow" tekrarlanan tezhib pattern'ı üreten bir `HeroGeometricBackground` component'ına sahip. `SunnetullahAtlasi`'nin inline `#sunnet-geometric` pattern'ından extract edilmiş (yorumdan). 8 tool sayfası bunu kullanıyor.

**Ama:** Ana sayfa Hero, SixGates, 14 anlatı kartı, Conclusion — **hiçbirinde yok**. Tutarsızlık: kullanıcı `/atlas/kavim` (KavimlerAtlasi) sayfasında güçlü bir tezhib deseni gördükten sonra ana sayfaya döndüğünde daha "boş" bir zeminle karşılaşıyor. Beklenti tersine dönmeli — ana sayfa (giriş) en manuscript, tool sayfaları utility ağırlıklı olmalı.

**Skor:** 🔴 KIRMIZI — **kolay kazanç.** `HeroGeometricBackground` component'ı hazır. Hero Sahne-2 arkasına, MukattaaCard'a (Featured), Conclusion arkasına eklenirse **sıfır yeni kod** ile atmosfer katmanı devreye girer. Prop'lar zaten override edilebilir (`patternOpacity`, `tileSize`, `glowOpacity`). Ana sayfa'nın atmosfer bütünlüğü tool sayfalarıyla eşleşir.

---

## 6. RİTİM VE SPACING — ne hızlı ne yavaş, "SaaS temposunda"

**Dosyalar:** Anlatı kartları (`MukattaaCard.jsx:25` `padding: '90px 24px'`), SixGates (`padding: '70px 24px 60px'`), CardSeam (`padding: '24px 24px 16px'`), ClusterWhisper (`padding: '40px 24px 50px'`).

**Gözlem:** Dikey ritim şöyle akıyor:
- 90px kart section → 24px seam → 90px kart section → 24px seam → ... → 40+50px whisper → 40px seal seam → 70px SixGates.

Bu **80-90-100 tempolu** modern web ritmi. Manuscript'in ritmi farklı: **büyük başlık boşluğu** (200px), sonra sıkı içerik (16-24px paragraf aralıkları), sonra tekrar büyük yaprak boşluğu. Site herhalde her kartı bir "bölüm" yapıp aralarını **eşit** dağıttığı için **flat rhythmical baseline** üretmiş — bu iyi hissettirir ama kitap gibi hissettirmez.

**Manuscript foto-doku argümanı:** Bir Mushaf sayfasına bakarken göz nefes alır — cüz başlangıcı süslü büyük boşluk, ayet dizilişi sıkı, ayet sonunda ilmî durur. Bu site tam tersi: kart-içi sıkı, kart-arası eşit boşluk.

**Skor:** 🟡 SARI — ritim disiplinli ama tek-tempo. Bir cluster'ın **ilk kartı** öncesinde 160-200px boşluk + büyük seal, sonra kartlar arası mevcut 24px CardSeam ritmi devam etsin. Cluster'ın **son whisper**'ından sonra 120-160px boşluk. Bu asimetri kitap-fasıl hissi verir.

---

## 7. MOTION — cinematic ama uniform (whileInView herkes için)

**Gözlem (paralel kod okuma):** Neredeyse her `motion.div` şu pattern'da:
```jsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-80px' }}
transition={{ duration: 0.9 }}
```

14 kart, SixGates başlık, ToolsHighlight başlık, TefekkurHighlight başlık, Conclusion başlık — **hepsinde aynı fade-up-24 ritmi**. Motion'ın **tek-tip** olması, atmosfer'in **düz** olmasıyla birleşince: kullanıcı 4. kartta motion'ı algılamayı bırakır — motion sinyal değil, arka plan gürültüsü olur.

Sadece Hero Sahne-1 gerçekten farklı bir motion mimarisine sahip (bismillah glow-pulse + light-sweep + char-by-char reveal). Sahne-1 **imzalı**, geri kalan sayfa **template'li**.

**Skor:** 🟡 SARI — Motion mimarisi Sahne-1'in ritmini örnek almalı. Öneriler:
1. Featured kartlar (FeaturedWrap içindekiler) için **Sahne-1 char-by-char reveal**'in redüksiyonu: Arapça ayet ilk kelime tek tek belirir, sonra çeviri fade-up.
2. Her cluster'ın **ilk kartı** için özel motion (örn. altın hairline sağdan sola çizilir), sonrakiler için standard fade-up.
3. Cluster whisper için mevcut `duration: 1.2` iyi (yavaş, contemplative) — koru.

Motion'da **hiyerarşi** yaratılmadığı için her şey aynı önemde okunuyor. Manuscript hiyerarşidir: başlığa uzun bakılır, matne akıcı bakılır, ilmî'de dinlenir. Motion bu hiyerarşiyi işitilebilir kılabilir.

---

## 8. FeaturedWrap "ÖNE ÇIKAN" badge — çok modern-badge

**Dosya:** `next/src/sections/FeaturedWrap.jsx:14-38`

```jsx
background: 'linear-gradient(135deg, rgba(212,165,116,0.95), rgba(232,184,96,0.85))',
color: '#0a0a1a',
fontSize: '0.62rem',
fontWeight: 800,
letterSpacing: '0.26em',
borderRadius: '999px',
boxShadow: '0 6px 20px rgba(212,165,116,0.45), 0 0 0 1px rgba(212,165,116,0.35)',
```

**Gözlem:** Bu badge **App Store "Bugünün Editörü Seçimi"** rozeti gibi. `999px` pill + `boxShadow`+`background: linear-gradient` altın parlak + `letter-spacing: 0.26em`. Yaparaken "önemli!" sinyalini SaaS diliyle veriyor. Manuscript'te "featured" karşılığı **süslü illumine başlık harfi** veya **köşe rozeti (mühür)**. Modern pill değil.

**Skor:** 🟡 SARI — Bir alternatif: pill'i tamamen kaldır. Yerine sağ üst köşede sabit bir **altın mühür SVG** (yuvarlak, ortada Arapça "خاص" veya 8-köşeli yıldız) `position: absolute; top: -12px; right: -12px; opacity: 0.9`. Yatay tabaka yerine mühür — kitabın önemli sayfasına konan altın çıkma etiketi.

---

## 9. Anasayfa'da glassmorphism kullanımı — yalnızca Footer sources kartında

**Gözlem (`grep`):** Anasayfada `glass-card` class'ı yalnızca `Footer.jsx:202` (kaynakça kartı) ve `Navbar.jsx:2198`'de (mobile menu drawer) kullanılıyor. Anlatı kartları glass-card kullanmıyor — kendi inline stilleri var (`background: linear-gradient(180deg, rgba(212,165,116,0.05)..., border: gold33, boxShadow: inset gold14 + drop black40`).

Bu iyi bir haber — glassmorphism (blur+transparent) sitede **çok az yerde** ve doğru yerlerde (Navbar, dropdown, mobile drawer). Anlatı kartları glassmorphism değil, "gold-tinted dark card". Bu **SaaS glass overuse** hatasına düşülmemiş.

**Skor:** 🟢 YEŞİL — glassmorphism kullanımı zaten disiplinli. Uyarı: Footer kaynakça kartını glass'tan çıkarmak §4'te önerildiği gibi (colophon = kağıt, cam değil).

---

## 10. Manuscript hedefine "kaç puan" — özet tablo

| Alan | Skor | Yön |
|---|---|---|
| Tipografi (Playfair + KFGQPC + Inter zinciri) | 🟢 | Timeless. Koru. |
| Bismillah + Alak Sahne-1 mimarisi | 🟢 | Sitenin en manuscript noktası. Baseline. |
| CardSeam ornament (8-köşeli yıldız + filigree) | 🟢 | Hazır kütüphane parçası — cluster-arası boundary'e de yay. |
| Glassmorphism kullanım disiplini | 🟢 | Overuse yok. Doğru. |
| ParticleBackground (mukattaa harfleri) | 🟡 | Semantic mükemmel; nokta partiküllerini elemin. |
| Section-arası gradient bridge (96px hairline) | 🟡 | Teknik iyi, atmosfer sıfır. CardSeam ile değiştir/pekiştir. |
| Cluster arka plan Islamic pattern | 🟡 | Ekran-scale tile; ya bordür ya watermark yap. |
| Footer colophon karakteri | 🟡 | %50 kütüphane, %50 SaaS. Glass'tan çıkar. |
| Motion mimarisi (whileInView uniform) | 🟡 | Hiyerarşi eksik; featured'a Sahne-1 ritmini uygula. |
| Ritim/spacing tek-tempo | 🟡 | Cluster açılış/kapanış boşluğu asimetrikleştir. |
| SixGates 6-kart tekdüzeliği | 🟡 | Kart-05 pattern'ı model — her kartın background-SVG'si olsun. |
| FeaturedWrap "ÖNE ÇIKAN" pill'i | 🟡 | App Store rozeti hissi; mühür SVG'ye taşı. |
| Cosmic-black düz-siyah, sıfır grain/vellum | 🔴 | En büyük eksik. Global `body` üstüne `feTurbulence` noise/grain katmanı %2-3 opacity. |
| Anlatı kartı borderRadius: 20px | 🔴 | Bootstrap-friendly değer; 12px veya asimetrik (üst 8, alt 2). |
| 14 kart birebir aynı template | 🔴 | Cluster'a göre iç mimari varyansı (yatay bordür varyantı, tam çerçeve varyantı, kartuş varyantı). |
| HeroGeometricBackground ana sayfada kullanılmıyor | 🔴 | Component hazır; Hero Sahne-2 + Featured + Conclusion'a serpiştir. |

---

## Priority sıralı 5-madde aksiyon planı (kod referanslı)

Öneri getiriyorum, uygulama kararı kullanıcıya bırakılıyor. Hiçbiri renkler paletini değiştirmez.

1. **Global grain katmanı** — `next/src/app/globals.css` sonuna:
   ```css
   body::after {
     content: '';
     position: fixed; inset: 0;
     background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.83 0 0 0 0 0.65 0 0 0 0 0.45 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
     opacity: 0.5; mix-blend-mode: overlay;
     pointer-events: none; z-index: 1;
   }
   ```
   Değerler: baseFrequency 0.9 = ince kağıt fibril. RGB 0.83/0.65/0.45 = altın tonu, palet dışı hex yok (mevcut altın renginin RGB'si). **Tek katman, tüm site.** Atmosfer'in en düşük maliyetli en yüksek getirili tek eklentisi.

2. **HeroGeometricBackground ana sayfa'ya uygula** — `Hero.jsx` Sahne-2 wrapper'ının başına, `Conclusion.jsx` SectionWrapper'ının başına, `FeaturedWrap`'in içine. Component + props var, sıfır yeni kod.

3. **Cluster-arası CardSeam seal** — `page.js`'te üç cluster arası `<CardSeam variant="seal" />` ekle (şu an sadece cluster **içi** kart araları var). Ek olarak globals.css'teki `gradient-divider` hairline'ını kaldır — hem hairline hem CardSeam olması gürültü.

4. **Anlatı kartı border-radius'unu düşür** — MukattaaCard, RitimCard, ... 14 kartın `borderRadius: '20px'` → `borderRadius: '12px'`. Tek satır × 14 dosya. Ayrıca en az 3 kartta (örn. Featured olanlarda) alternatif border pattern: `border: 'none'; borderTop: '1px solid gold33; borderBottom: '1px solid gold33` — sadece yatay hairline, cluster ritmi zenginleşir.

5. **ParticleBackground'ta nokta partikülleri kaldır** — `ParticleBackground.jsx:24` `isGlyph = Math.random() < glyphRatio` → `isGlyph = true`. Tüm partiküller mukattaa. Nokta gürültüsü yok, sadece belli-belirsiz mukattaa hışırtısı. Sesin sadeleşmesi + manuscript aidiyet.

---

## Tek Cümlelik Yönetici Özet

QuranCodex'in dark palet + tipografi zinciri hâlihazırda **timeless** bir taban; ama üstüne "grain / illumine border / kart-şablon varyansı / section-arası ornament" katmanı henüz konulmadığından, atmosfer skoru **DARK theme referans çerçevesinde ~%60-65** — "premium bir dark SaaS" ile "el yazması codex" arasındaki yolun ilk üçte ikisi bitmiş, son üçte biri (doku katmanı) beklemede.

