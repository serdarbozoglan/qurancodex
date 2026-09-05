# TODO — QuranCodex v2.0 (Anasayfa Yeniden Tasarımı + Site Geneli Uyum)

> **Kaynak mock:** https://claude.ai/code/artifact/a8dc800d-add4-425c-bed8-6c472d62adb5
> **Kapsam:** Yeni hero + hareket katmanı + rafine renk/kart dilini anasayfaya
> getirmek VE bu dili sitenin geri kalanına (80 route, 35 section, 120 component)
> tutarlı biçimde yaymak.
> **Çalışma kuralı:** Her faz local'de test edilir, ekran görüntüsüyle doğrulanır;
> `main`'e push YALNIZCA kullanıcı explicit onayıyla (bkz. CLAUDE.md §17.4,
> memory `feedback_local_test_first`). Her faz ayrı onay.

---

## DURUM (2026-09-05)

- ✅ **Faz 1 (token temeli)** — TAMAM. `SEMANTIC.accentGlow`, `GRADIENTS.statNumber`,
  `HOME_CLUSTER_ACCENT` (CATEGORY.blue/emerald), `goldAmberMid` eklendi;
  globals'a `.glass-panel-v2` · `.lift-hover` · `.depth-gold/lapis` (color-mix,
  ham renk yok). Renk denetimi katkı +0.
- ✅ **Faz 2 (hero halkası)** — TAMAM. `HeroRing.jsx` (client, ssr:false) +
  Hero.jsx entegrasyonu. Canlı 6.236 âyet halkası, mukattaa bulut, hover→sûre,
  tıkla→/oku/N, reduced-motion, IO-pause. Desktop+mobil doğrulandı, 0 hata.
- ✅ **Faz 3 (anasayfa çekirdek)** — TAMAM (seçici). Yapılan: envanter stat
  gradyanı (3.2), İNTERAKTİF Fâtiha şeması `FatihaRingDiagram.jsx` (3.6), küme
  eyebrow aksanları — reflection zümrüt / astonishment lapis (3.7).
  **Bilinçli DOKUNULMADI** (canlı zaten iyi, basitleştirmek gerileme olurdu):
  Tefekkür vitrini (3.10 — zaten gerçek makale kartlı), Concierge hapları
  (3.3 — zaten var), SixGates kategori renkleri (3.5 — korundu), Sonuç/
  Metodoloji (fine). Rail cetveli (3.11) — opsiyonel, ertelendi.
- ◑ **Faz 4 (site geneli uyum)** — ÇEKİRDEK TAMAM. Yapılan: `.stat-gradient`
  utility (tek kaynak, @theme değişkenli), radyal derinlik anasayfa Kapılar
  (altın) + Araçlar (lapis). **Bilinçli yapılmadı:** CrossToolCTA/tool kartlarına
  mass hover-rewrite (§13.23 riski, mevcut hover'lar çalışıyor), ikon dili
  değişimi (Phosphor korunur), 80 tool sayfasına toptan glass/depth cascade
  (tarafsız değerlendirme: canlı tool sayfaları zaten iyi, yüksek risk/düşük
  değer). Navbar/footer dokunulmadı → zaten tutarlı.
- ✅ **Faz 5 (QA)** — anasayfa full sweep TAMAM: desktop + mobil (390) baştan
  sona, 0 console/pageerror, 0 yatay taşma, kümeler/aksan/hero/Fâtiha/envanter
  hepsi doğrulandı. Denetimler: renk katkı +0, iç-sızıntı temiz.

### CESUR GÖRSEL TUR + NAV/CTA/HERO İNCE AYAR (2026-09-05, ikinci oturum)

Kullanıcı "değişiklikler çok ince, mock'a benzemedi" geri bildirimi üzerine
görünürlük artırıldı (yine ölçülerek, 0 hata):

- **Anlatı kartları görünür dönüştü** (`PortalCard.jsx`): faint gold-tint →
  **glass navy panel** (blur 14px) + küme-renkli KENARLIK & CTA (eyebrow'dan
  öte) + `.lift-hover`. `accent` prop'u (varsayılan gold) — reflection zümrüt,
  astonishment lapis. `EditorialCard.jsx` eyebrow'u da accent aldı.
- **Tool kartları** (`ToolHighlightCard.jsx`): navy glass + altın kenarlık —
  anlatı kartlarıyla tutarlı.
- **Nav tam elden geçti** (`Navbar.jsx`): TR|EN **segmentli pill** (aktif
  vurgulu), Sor **pill**, bookmark **daire**, Kur'an'ı Oku **pill** — hepsi
  tutarlı pill dili. `⌘K`/Ctrl+K → /sor **gerçek kısayolu** eklendi (görsel
  rozet İngilizce menülerle sarma yaptığı için kaldırıldı, kısayol kalır).
  **Sarma bug'ı çözüldü**: wordmark-gizleme 1099→1179 genişletildi; TR+EN,
  1024-1920 hepsi tek satır. Nav **full-width** yapıldı (`max-w-[1720px]`,
  kullanıcı tercihi — ultra-geniş ekranda ortada sıkışma yok; §13.17 logo-
  içerik hizası bilinçli gevşetildi).
- **CTA rengi birleştirildi**: koyu btnGold (#c9973a→#b8860b) → **açık antika
  altın** (goldBright→gold, kullanıcı tercihi #27). `.btn-primary-gold` TEK
  KAYNAK güncellendi (radius 6px→999px pill) → Hero "İlk Kapıyı Aç", Sonuç
  CTA'ları, nav CTA hepsi otomatik tutarlı.
- **Hero metni** (`Hero.jsx`): çeviri iki AYETE karşılık **iki satıra** bölündü
  + font büyütüldü (çeviri 1.3→1.55rem, açıklama 0.8→1.05rem); **halka etkileşim
  ipucu** eklendi ("Arkada dönen halka: 114 sûre — üstüne gel, keşfet");
  **İngilizce overlap** düzeltildi (halka R ayarı). **DEVAM** göstergesi halka
  İÇİNE taşındı (bottom %11). Halka boyut/konum kullanıcıyla ince ayarlandı
  (son: R=0.41, merkez H/2+16). **Hero kullanıcı tarafından onaylandı.**

**Kontrast denetimi (2026-09-05, ikinci oturum):** örneklem 65→30 (−35),
TABANIN ALTINDA — bu oturumun ~25 değişikliği kontrastı bozmadı, iyileştirdi.
Renk katkısı hâlâ +0. İç-sızıntı temiz. Tüm rotalar (tr/en/oku/sor/tool/atlas)
HTTP 200.

**Bu oturumda değişen ek dosyalar:** Navbar.jsx, ToolHighlightCard.jsx,
globals.css (.btn-primary-gold, .stat-gradient, wordmark media query),
Conclusion.jsx, Hero.jsx, HeroRing.jsx, PortalCard.jsx, EditorialCard.jsx,
SixGates.jsx, ToolsHighlight.jsx, InventoryStrip.jsx.

### ⚠ Olay kaydı (2026-09-05)
Renk denetimini izole etmek için `EsmaFrekans.jsx` (benden olmayan, commit'lenmemiş
"Esmâ kök haritası" özelliği) tekrar tekrar `git stash`'lendi; bir pop başarısız
olunca working-tree hâli HEAD'e döndü. Dangling git nesnesinden (untracked
`esma-*.json` + `EsmaTanimlari.jsx` ile uyumlu versiyon) geri yüklendi, sayfa
HTTP 200. Ders: başkasının commit'lenmemiş dosyası ölçüm için stash'lenmez.

**Değişen dosyalarım:** tokens.js, globals.css, Hero.jsx, InventoryStrip.jsx,
ProofSection.jsx, PortalCard.jsx, EditorialCard.jsx, page.js + yeni HeroRing.jsx,
FatihaRingDiagram.jsx. **Push YAPILMADI.**

---

## 0. İLKELER — Bu Plan Boyunca Geçerli

- **Mevcut sistem otoritedir, mock değil.** Mock bir görsel hedef; uygulamada
  `next/src/tokens.js` + CLAUDE.md kuralları bağlayıcıdır. Çelişki olursa token/kural kazanır.
- **Kutsal metin dokunulmaz:** Kur'an fontu her yerde `FONTS.quran` (KFGQPC).
  ✅ Mock artık gerçek KFGQPC'yi kullanıyor (`kfgqpc-hafs.subset.woff2` base64
  gömülü) — Amiri Quran'dan vazgeçildi (kullanıcı kararı). Gerçek sitede zaten
  `@font-face KFGQPC` var (§16.10), ek iş yok. Arapça encoding §13.15
  (`cleanArabicForDisplay`).
- **Logo:** Mock artık gerçek marka logosunu (`logo-mark.png`) kullanıyor,
  uydurma SVG değil. Top-nav yerleşimi (logo · menü · Sor · TR|EN · Oku CTA)
  kullanıcı onaylı — bu düzen korunur.
- **Renk uydurma yok (§13.25):** Mock'un "lapis"/"zümrüt"ü token'da YOK. Karşılıkları:
  - mock lapis `#7fa8d4` → **`CATEGORY.blue` `#3498DB`** (küme aksanı)
  - mock zümrüt `#63b89e` → **`CATEGORY.emerald` `#1D9E75`** (küme aksanı)
  - stat gradyanı → taban **`accentStats` `#c9a227`** kalır; gradyan yalnız dekoratif
    katman (aşağıda Faz 1'de token'lanacak).
- **Ölçmeden iddia yok (§13.26, §13.28):** Her yeni renk/metin `audit-colors.mjs`,
  `audit-contrast.mjs`, `audit-internal-leak.mjs`'ten geçer.
- **Yeni içerik yok:** Anasayfa yapısı/içeriği birebir korunur (memory
  `feedback_enhance_dont_invent`). Değişen yalnız SUNUM.

---

## FAZ 1 — Tasarım Sistemi Temeli (tokens + globals)  ⟶ önce bu, gerisi buna dayanır

**Amaç:** Mock'taki görsel yenilikleri token seviyesinde tanımla ki tüm site tek
kaynaktan tüketsin. Bu faz olmadan renkler sayfalara dağılıp §13.25'i ihlal eder.

- [ ] **1.1 — Sıcak altın parlaklık token'ı.** Mock hover/parıltısı `#e8c08a`
  kullanıyor. `COLORS.goldBright = '#e8c08a'` ekle; `SEMANTIC.accentGlow` rolü ver.
  AA notu: metin rengi olarak DEĞİL, yalnız hover/gradyan/ışıltı için.
- [ ] **1.2 — Stat gradyanı token'ı.** `#e8c08a → #d8b15f → #c9a227` gradyanını
  `GRADIENTS.statNumber` gibi tek yerde tanımla. Kural: yalnız istatistik
  sayılarında (§4/§13.25 md.7). Düz erişilebilir taban rengi `accentStats` korunur
  (gradyan desteklenmeyen bağlamda fallback).
- [ ] **1.3 — Küme aksan eşlemesi.** Anasayfa 3 kümesi için resmi eşleme:
  Hayranlık = gold (accentPrimary), Hayret = `CATEGORY.blue`, İçe Bakış =
  `CATEGORY.emerald`. Bunu `next/src/data/homeCards.js` veya yeni bir
  `homeClusters.js`'te sabitle — component içinde hardcode etme.
  ⚠ Ölç: `CATEGORY.blue`/`emerald` eyebrow/CTA olarak cosmic-black üstünde
  AA ≥ 4.5 mi? (§13.26 md.6). Değilse metin için AA-güvenli açık varyant ekle
  (örn. `#5aa9e6`), border/ikon için koyu tonu kullan.
- [ ] **1.4 — Glass panel sınıfı.** Mock'un "havada asılı" kart hissi:
  `rgba(13,27,42,.38)` + `backdrop-filter:blur(12-14px)` + altın tonlu kenarlık
  `${gold}14`. `globals.css`'te tek `.glass-panel-v2` sınıfı (mevcut `.glass-card`
  §13.7 ile çakışmasın — ya onu güncelle ya yeni sınıf). Karar gerekli: mevcut
  `glass-card`'ı mı güncelliyoruz yoksa yeni sınıf mı? (site geneli etki — Faz 4).
- [ ] **1.5 — Radyal derinlik yardımcıları.** Bölüm zeminlerine %3-5 radyal ışık
  (`gates`, `tools`, `proof`, `concierge`). `globals.css`'te utility sınıfları;
  renkler token'dan (`gold`, `CATEGORY.blue`).
- [ ] **1.6 — Doğrula:** `node scripts/audit-colors.mjs --ci` (taban artmamalı),
  `audit-contrast.mjs` (yeni token'lar metin bağlamında geçiyor mu).

---

## FAZ 2 — Hero (yeni: canlı âyet halkası + harf bulutu)  ⟶ tek gerçek "sıfırdan" iş

**Amaç:** Mock'un asıl kazancı. Yeni bir client component + mevcut veri.

- [ ] **2.1 — `HeroRing.jsx` (client component).** Canvas tabanlı:
  - Veri: `public/verse-graph-bgem3.json` zaten var — 6.236 âyet, sûre başına
    sayım (kod tarafında `COUNTS` üret, mock'taki gibi). Ayrı JSON GEREKMEZ.
  - Katman 1: 114 sûre yayı (gerçek uzunluk), noktalar. Katman 2 (arkada): 14
    mukattaa harfinden bulut, 1/3 hız ters yön (paralaks). Merkez "clear-zone":
    kutsal metin sütununa hiçbir parçacık girmez (mock'ta çözüldü).
  - Hover: sûre adı + âyet sayısı + (mukattaa sûresiyse) imza harfi tooltip.
    Tooltip üstte kesilmesin (imleç yukarıdaysa alta aç).
  - Tıkla: o sûrenin okuma sayfasına git (`/{locale}/oku/{n}`) — mock'taki
    "sûreyi oku" bildirimi yerine gerçek `router.push`.
  - `useReducedMotion` DİNLE (§9, §13.26 sonu): reduced motion'da statik render.
  - Performans (§8, §13.26 md.11): `heroVisible` IntersectionObserver ile
    ekran dışında rAF durur. Nokta sayısı 6.236 → gerekiyorsa LOD/örnekleme.
    TBT ölç.
- [ ] **2.2 — Hero metin bloğu.** Mevcut `Hero.jsx` içeriğini koru (Alak 96:1-2,
  başlık `hero.title`, alt-başlık `hero.subtitle`, açıklama). Kur'an metni
  `FONTS.quran` + §13.15 normalize. Dikey ritim mock'taki ferahlıkta.
  Metin arkası radyal maske (merkez temiz).
- [ ] **2.3 — SSR-safety (§16.6):** `dynamic(() => import('./HeroRing'), { ssr:false })`
  canvas için. `isMobile` düzen-kritik değil, yalnız davranış (§14.2). Mobilde
  harf bulutu seyrek + nav CTA kompakt (mock'ta çözüldü).
- [ ] **2.4 — Doğrula:** desktop + mobil (390/640/1024) ekran görüntüsü; halka
  metni kesmiyor mu; CLS (§13.26 md.6 — canvas remount CLS'i); tooltip nav
  altında kalmıyor mu.

---

## FAZ 3 — Anasayfa Bölümleri (mevcut içerik, yeni sunum)

> Yapı ve içerik AYNEN korunur (page.js sırası). Değişen: sunum katmanı.

- [ ] **3.1 — Kaldığın Yerden Devam.** Mock'taki rozet zaten gerçek bileşene
  karşılık geliyor: `ReadingProgressCard` + `RecentBookmarksStrip` +
  `RecentQueriesStrip` (page.js'te var). Bunları Hero'nun hemen altına, mock'taki
  glass rozet stiline getir. Yeni state YOK — mevcut localStorage okuması.
- [ ] **3.2 — Envanter şeridi (`InventoryStrip.jsx`).** Sayaç count-up animasyonu +
  yeni gradyan stat rengi (Faz 1.2) + etiket vurgu çizgisi. ⚠ Sayılar ELLE
  güncellenir (§13.28): araç/tefekkür/âyet sayısını push öncesi doğrula.
- [ ] **3.3 — Concierge (`ConciergePrompt.jsx`).** Zaten daktilo placeholder +
  öneri hapları VAR. Mock'tan eklenecek: hapa tıklayınca **iskelet cevap
  önizlemesi** (shimmer). ⚠ Sahte içerik yok — yalnız BİÇİM iskeleti (§13.24
  ruhu: yanıltıcı vaat verme). Gerçek RAG çıktısı değişmez.
- [ ] **3.4 — Metodoloji şeridi (`MethodologyRibbon.jsx`).** İçerik aynı; yalnız
  glass panel + radyal derinlik dokunuşu.
- [ ] **3.5 — Altı Kapı (`SixGates.jsx`).** ⚠ ÖNEMLİ UZLAŞMA: Canlı site kapıları
  ZATEN kategori renkli (dişli/altın, küre/mavi, kişi/mavi, dosya/yeşil...).
  Mock kapıları tek renk (altın) yaptı — bu bir GERİLEME. **Karar: canlının
  kategori renklerini KORU**, mock'tan yalnız 3D-tilt + spot-ışık + chip
  düzenini al. İkonlar mevcut kalır.
- [ ] **3.6 — Kanıt bölümü (`ProofSection.jsx`) → interaktif Fâtiha.** Mock'un
  en güçlü ikinci parçası. Statik şema yerine SVG interaktif düğüm haritası
  (A-B-C-D-C'-B'-A', hover → aynadaki eş yanar, yan panel güncellenir). Mevcut
  4 açıklama kartı (Örüntü ne/nerede/anlamlı/kesin değil) KORUNUR. `useReducedMotion`.
- [ ] **3.7 — 14 anlatı kartı (`PortalCard`/`EditorialCard` + `homeCards.js`).**
  İçerik birebir. Sunum: glass panel v2 + küme aksan rengi (Faz 1.3). Kart
  tipografisi/ferahlığı canlının VAKARINI koru (mock fazla sıkıştırmıştı —
  unbiased değerlendirme notu). Feature kartların altın çerçevesi kalır.
  Opsiyonel mikro-görseller (ses kartı dalga, bilimsel kart zaman çizgisi) —
  düşük öncelik, `useReducedMotion`'a tabi.
- [ ] **3.8 — Araçlar (`ToolsHighlight.jsx`).** İçerik aynı; glass panel + hover.
- [ ] **3.9 — Sonuç (`Conclusion.jsx`).** Mock'taki `✦` 8 maddelik grid
  düz metin bloğundan daha okunur — bunu uygula (içerik `conclusion.points`
  aynen). Kapanış âyeti Nisâ 4:82, `FONTS.quran` + §13.15.
- [ ] **3.10 — Tefekkür vitrini (`TefekkurHighlight.jsx`).** Tek şerit yerine 3
  kartlı grid. ⚠ Kartlar `public/tefekkur/_index.json`'dan TÜRETİLİR (elle
  yazma — §13.29 dersi): başlık, kategori, `readingMinutes`, tldr gerçek veriden.
- [ ] **3.11 — Rail (`DesktopSidebarTOC.jsx`).** İlerleme cetveli (dikey dolum) +
  aktif bölümün küme rengini alması + etiketlerin hover'sız da okunur olması
  (mock'ta çözüldü — kontrast §13.26).
- [ ] **3.12 — Dil switcher.** Navbar'da TR|EN zaten var mı doğrula; mock'taki
  konum/stil ile hizala (canlıda mevcut, sadece görsel uyum).

---

## FAZ 4 — SİTE GENELİ UYUM (kullanıcının vurguladığı kritik faz)

> Anasayfa yeni dili alınca, 80 route + tool sayfaları eski görünürse **tutarsızlık**
> doğar. Bu faz onu kapatır. Riskli (cross-cutting §13.23 Seviye 3) — küçük
> partilere böl, her parti ayrı test+onay.

- [ ] **4.1 — Glass panel kararının yayılması.** Faz 1.4'te `glass-card` mı
  güncellendi yoksa yeni sınıf mı? Eğer `glass-card` güncellendiyse, onu kullanan
  TÜM sayfalar (CrossToolCTA 54 dosyada, SourcesCitation, ToolHeader...) otomatik
  değişir — bu İSTENEN ama **her birini görsel doğrula** (regresyon riski).
- [ ] **4.2 — Stat/sayaç gradyanı.** `AnimatedCounter` ve stat gösteren tüm
  bileşenler (tool sayfaları, atlaslar) yeni gradyan token'ını alsın — TEK
  kaynaktan (Faz 1.2). Elle her sayfaya değil.
- [ ] **4.3 — Kategori renk tutarlılığı.** Anasayfa kümelerine atanan
  blue/emerald ile tool sayfalarındaki mevcut CATEGORY kullanımının ÇAKIŞMADIĞINI
  doğrula (§13.25 md.8: bir ekranda max 3 kategori aksanı). Atlas/graf
  sayfalarının kendi kategori renkleri korunur.
- [ ] **4.4 — İkon dili.** Mock stroke-SVG ikon seti kullanıyor. Canlı sitenin
  `@phosphor-icons/react` seti var. **Karar gerekli:** ikonları birleştir mi?
  Öneri: Phosphor'u KORU (tutarlı, bakımlı), mock ikonlarını Phosphor
  karşılıklarıyla değiştir. Anasayfaya özel custom SVG üretme.
- [ ] **4.5 — Hover/etkileşim dili.** Mock'un translateY(-2/-4px) + glow hover'ı
  bir "hareket dili" tanımlıyor. `globals.css`'te tek utility (`.lift-hover`)
  yapıp tool kartlarına, CrossToolCTA'ya, atlas kartlarına yay — böylece tüm
  site aynı fizik hissini verir.
- [ ] **4.6 — Radyal derinlik yayılması.** Faz 1.5 utility'lerini uzun tool
  sayfalarının bölüm zeminlerine uygula (tekdüzelik kırma — renk değerlendirmesi
  notu). Ölçülü, %3-5.
- [ ] **4.7 — Navbar/footer.** Anasayfa navbar'ı değiştiyse (dil switcher konumu,
  CTA stili) 80 route'ta aynı navbar render olduğundan hepsinde doğrula.

---

## FAZ 5 — KALİTE KAPILARI (her fazın sonunda, push öncesi zorunlu)

- [ ] **5.1 — Renk sistemi:** `cd next && node scripts/audit-colors.mjs --ci`
  (taban 184 artmamalı; ham hex yok).
- [ ] **5.2 — Kontrast:** `node scripts/audit-contrast.mjs --full --ci` +
  `--mobile` (§13.26; yeni renkler metin bağlamında AA geçmeli).
- [ ] **5.3 — İç mimari sızıntısı:** `node scripts/audit-internal-leak.mjs --ci`
  (ekrana kod/dosya adı sızmasın — §13.27).
- [ ] **5.4 — Arapça encoding:** yeni/değişen Arapça metin `Problem chars: 0`
  (§13.15 audit).
- [ ] **5.5 — Mobil:** 390/640/1024 — yatay taşma yok, CLS < 0.1 (§13.26 md.4/6,
  §14). Canvas hero CLS'i özel ölç.
- [ ] **5.6 — CWV:** LCP < 2.5s, INP < 200ms, hero canvas TBT (§8, §13.26 md.11).
- [ ] **5.7 — Kritik akışlar (§13.23 D):** `/`, `/oku`, `/sor`, mega-menü,
  bookmark, dil switch — hepsi bozulmamış.
- [ ] **5.8 — pre-merge-review skill'i** çalıştır (PASS/FAIL).
- [ ] **5.9 — RAG:** yeni içerik EKLENMEDİĞİ için corpus rebuild GEREKMEZ
  (§13.22); yalnız sunum değişti. Yine de `/sor` çalışıyor mu doğrula.
- [ ] **5.10 — FİNAL MOBİL KONTROL (tüm değişikliklerden SONRA, zorunlu son adım).**
  Her faz kendi mobil testini yapar (5.5) ama v2.0'ın TAMAMI bittikten sonra
  anasayfa + en az 5 örnek tool sayfası için baştan sona mobil sweep:
  - Genişlik 390 / 414 / 640 / 768 — her birinde: yatay taşma YOK
    (`scrollWidth === clientWidth`), CTA/nav kırpılmıyor (§13.13 sağ-kenar
    ölçütü + ekran görüntüsü), hero halkası ve harf bulutu mobilde temiz,
    kartlar tek sütun düzgün, rail gizli, dokunmatik hedefler ≥ 44px.
  - Ekran görüntüsüyle doğrula (sayısal test tek başına yetmez — §13.13 dersi).
  - CLS < 0.1 mobilde (canvas hero + client-fetch bileşenleri özellikle).

---

## KARAR BEKLEYEN NOKTALAR (kullanıcı onayı gerek)

1. **Glass sınıfı:** mevcut `.glass-card`'ı güncelle (site geneli otomatik yayılır,
   riskli) mı, yeni `.glass-panel-v2` (kademeli, güvenli) mi?
2. **İkonlar:** Phosphor'da kal + mock ikonlarını eşle (önerilen) mi, yoksa mock'un
   custom SVG dilini mi benimseyelim?
3. **Kart yoğunluğu:** Anasayfa kartları mock'un kompakt "bento"su mu, canlının
   ferah vakarı mı, yoksa ortası mı? (unbiased değerlendirmede canlının vakarı
   öne çıkmıştı; Gemini bento'yu övdü — senin kararın.)
4. **Küme aksan tonları:** `CATEGORY.blue/emerald` AA'da sınırda kalırsa metin için
   açık varyant eklemeye onay.
5. **Faz sırası:** Hero'yu (Faz 2) tek başına önce canlıya alıp geri kalanı sonra mı,
   yoksa tüm anasayfayı (Faz 1-3) tek pakette mi?

---

## ÖNERİLEN SIRA (risk-minimize)

```
Faz 1 (token temeli)  →  Faz 2 (hero, izole, yüksek değer)  →  onay/deploy
   →  Faz 3 (anasayfa bölümleri)  →  onay/deploy
   →  Faz 4 (site geneli, küçük partiler)  →  her parti onay/deploy
   →  Faz 5 sürekli (her fazda)
```

Hero tek başına deploy edilebilir (izole client component) ve en yüksek görsel
kazancı verir — "quick win" olarak ilk o çıkabilir.
