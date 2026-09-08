# ChatGPT Stratejik Önerileri — Uygulama ToDo'su

> Kaynak: `QuranCodex-Kapsamli-Inceleme.html` — ChatGPT'nin **28 somut bulgu dışındaki** üst-düzey tavsiyeleri.
> 28 bulgu ayrı dosyada (`todo_kapsamli_inceleme_bulgular.md`) — hepsi düzeltildi/push edildi.
> Bu dosya: bulgu-todo'da **yer almayan** stratejik öneriler + **benim "yapalım mı" değerlendirmem**.
> Verdikt anahtarı: 🟢 yapalım (yüksek değer) · 🟡 kısmi/orta · 🔵 büyük proje (ayrı faz) · ⚪ zaten var/kapsandı · ⛔ önermem.
> Efor: S (saat) · M (gün) · L (hafta) · XL (haftalar).

---

## A) Görsellik & Kullanım (9 öneri)

- [x] **A1 · Araç sayfası girişini kısalt** — 🟢 S/M **✅ TAMAMLANDI**
  §13.18 hero (9 elemanlı) asıl aracı aşağı itiyordu. Yeni `CollapsibleHero` sarmalayıcı: ilk ziyarette hero açık (§13.18 korunur), kullanıcı "Girişi gizle" derse kapanır + localStorage'da hatırlanır → dönüş ziyaretlerinde çipler+sekmeler+içerik üstte. İçerik birebir korunur.
  - Pilot: Fâtiha Atlası. Yayım: **40 hero-first araç/atlas** sayfası.
  - Atlanan (kasıtlı): IblisSatan (parçalı hero), EsmaFrekans (flagship istisna §13.17/§17.2), IlkSonKelimeler (zaten tool-first).
  - Doğrulama: 40 rota × TR/EN = **80/80** (HTTP 200 + katlama butonu render + runtime hata yok); denetimler yeşil.
- [~] **A2 · Keşif ↔ araştırma yoğunluğunu ayır** — 🟢 M **(pilot yapıldı)**
  Başta birkaç örnek, tam tablo "Tümünü göster" ardında. "30 sn'de: ne görüyorsun / ne tıklarsın / ne öğrenirsin" yönlendirmesi.
  - ✅ **Pilot: Füruk Atlası Panorama** — 30-sn yönlendirme şeridi + kategori başına önce 3 kart, gerisi "Tümünü göster (N)". TR+EN doğrulandı.
  - ⬜ Yayım (içerik-hassas — her araç için **doğru** yönlendirme metni gerekir, A1 gibi mekanik değil): diğer yoğun-tablo araçları (MunasebatAtlasi, YakinAnlamliNuanslar, TefsirIhtilaflari vb.). Not: WordHeatmap'te preset örnekleri zaten var.
- [x] **A3 · Grafiklerin metin karşılığı + klavye erişimi** — 🟢 M/L **✅ TAMAMLANDI**
  Ayet/kavram/diyalog/zaman ağlarında renk+konuma ek: metin-alternatifi + klavye navigasyonu. Tüm içerik mevcut veriden türetildi (uydurma yok), tarayıcıda TR+EN doğrulandı.
  - ✅ **RevelationTimeline (/graf/zaman):** görünür + erişilebilir **"Liste" görünüm modu** (semantik `<table>`) + tüm modlarda `SR_ONLY <ol>` metin-alternatifi. Ayrıca kart ipuçları (ⓘ / mushaf-fark) native `title` yerine anında açılan `HintIcon` (hover+focus+tık).
  - ✅ **ConceptGraph (/graf/kavram):** sr-only bağlantı listesi; öğeler `<button>` — Enter kavramı sabitler, âyet paneli açılır.
  - ✅ **DiyalogAgi (/graf/diyalog):** sr-only konuşmacı + diyalog-ekseni listesi; butonlar ekseni Diyaloglar sekmesinde açar.
  - ✅ **WordHeatmap (/graf/kelime-isi):** sr-only özet (hücreler zaten aria-label'lı klavye butonları).
  - ✅ **VerseGraph (/graf/ayet):** ClusterView + FullGraph (3B, masaüstü varsayılanı) + VerseView sr-only açıklama; 11 klasik sûre grubu + iki görünüm modu.
  - ➕ **Tilâvet autostart:** /graf/ayet İkra (Alak 1-5) tilâveti ilk kullanıcı jestinde otomatik başlar (tarayıcı sesli-autoplay engelini jest-yedeğiyle aşar; buton kontrolü korunur).
  - **BONUS (önceki turda):** sistemik "başlık/çip truncate" (§13.31 Mek. 2) çözüldü — `useNavbarOffset` → `--qc-nav-h` CSS değişkeni; 38 dosyada hardcoded `62px` → `var(--qc-nav-h, 84px)`; regresyon `audit-counts.mjs` push kapısında. CLAUDE.md §13.17 güncellendi.
- [x] **A4 · Okuma ekranı: düz-yazı meal seçeneği + tipografi** — 🟢 S/M **✅ ZATEN YAPILMIŞ (2026-09-07)**
  Doğrulandı ([ReadingMode.jsx:1436](next/src/components/ReadingMode.jsx#L1436)): meal artık **her zaman düz-yazı** (italic toggle kaldırıldı — "uzun Türkçe meal düz dizgide daha okunur"). Meal Yazı Boyutu + Arapça Yazı Boyutu kontrolleri (reset dahil), gündüz/gece teması mevcut. Ayar paneli **kasıtlı sadeleştirilmiş** → satır-aralığı slider'ı bu kararla çelişeceği için eklenmedi. A4'ün özü karşılanıyor.
- [~] **A5 · Mobilde en zor ekranları test et** — 🟢 M **(denetlendi + site-geneli fix)**
  Playwright 360/390px denetimi: en zor ekranlarda (114-sütun ısı haritası, çok-sekmeli ibadet, mushaf, uzun başlıklar, 3B graf, kavim haritası) **yatay taşma YOK** — düzen zaten sağlam.
  - ✅ **Dokunma hedefi:** ToolHeader "Anasayfaya dön" pill'i 36×24px → **40×40** (site-geneli, ~65 araç).
  - ⬜ Kalan (küçük/tekil): WowFacts yer-imi ikonu 26×26, okuma-ekranı ayet rozetleri 27×27 (yoğun bağlam; opsiyonel).
- [x] **A6 · Uzun-okuma tipografisi (tefekkür)** — 🟡 S **✅ TAMAMLANDI**
  Makale gövde puntosu 1.08rem(~17px) → **1.15rem(~18px)**; satır aralığı 1.85 + max-width 760px ile kontrollü satır uzunluğu. Hero/meta kasıtlı küçük; yazarın metni ezilmedi (§13.29).
- [x] **A7 · İçindekiler (TOC) güçlendir** — 🟡 S **✅ TAMAMLANDI**
  Aktif bölüm (IntersectionObserver), ilerleme çubuğu, başa dön zaten vardı. Eklenen: **"kaldığın yere devam"** — okuma konumu makale bazında hatırlanır (pagehide/unmount/visibilitychange'de kaydet), dönüşte "Kaldığın yerden devam et" pill'i (tıkla→kay, manuel kaydırmada gizlen, sonda temizlen). Bonus: ilerleme çubuğu offset'i `var(--qc-nav-h)` (§13.31). TR+EN doğrulandı.
- [x] **A8 · Sekme/kart davranışını ortaklaştır + paylaşılabilir durum** — 🟡 M **✅ TAMAMLANDI**
  Yeni `useTabParam` kancası aktif sekmeyi URL'e bağlar (`?tab=N` veya `?tab=<key>`): paylaşılabilir + geri düğmesi öngörülebilir. `window.location`+`history.replaceState` (useSearchParams DEĞİL → statik-prerender Suspense hatası yok, SSR/build-güvenli).
  - **24 sekmeli araç**: 18 index + 6 string-key (+ ibadetler/pillar zaten ?tab= slug).
  - Doğrulama: production build temiz, runtime + URL-sync doğrulandı.
- [x] **A0 · Ana sayfa 3 somut giriş** — ⚪ (UX01) — video butonu + §17 ile kısmen; ayrıca "Oku/Konu ara/Keşfet" girişleri değerlendirilebilir.
- [x] **A9 · Kontrastı ölçerek iyileştir** — ⚪ Zaten var (§13.26 `audit-contrast.mjs` + baseline; §4 scriptureText/accentPrimary token ayrımı).

## B) İçerik Güvenilirlik Sistemi (sitenin akademik farkı) — 🔵 büyük, yüksek değer

- [ ] **B1 · Her iddia için kayıt (provenance)** — 🔵 L
  İddia → ayet/korpus → kullanılan meal → klasik kaynak → çağdaş yorum → istisna/sınır → kontrol eden → güncelleme tarihi. Kitap: baskı+sayfa; makale: DOI/kalıcı bağlantı. (Şu an dağınık; §13.30 kısmen.)
- [ ] **B2 · Beş görünür bilgi türü etiketi** — 🟢 M/L
  Ayet metni · meal · rivayet/klasik görüş · veri analizi · yazar tefekkürü = ayrı görsel etiketler. "Saygıdeğer yorum ≠ zorunlu sözlük anlamı/deneysel bulgu." (C19/C22 bunun küçük örnekleriydi.)
- [~] **B3 · Ortak sayım kuralları + "sayıya tıkla → liste"** — 🟢 M **(büyük ölçüde var + slice eklendi)**
  "Sayım kuralları" zaten `DataDictionary` ile sayım-yoğun araçlarda belgeleniyor. "Sayıya tıkla → liste": WordHeatmap'te (sûre→âyetler) + artık **ana sayfa InventoryStrip** (65 Araç→/arac/tum-araclar · 53 Tefekkür→/tefekkur · 6.236 Âyet→/graf/ayet). ⬜ Kalan: tam site-geneli tıkla→liste + tek kanonik sayım-kuralları referansı (ayrı faz).
  Hafs sürümü, besmele dahil/hariç, kelime bölme, lemma/kök/yüzey, tekrar sayımı, doğrudan/dolaylı atıf tek yerde tanımlı. Her sayıya tıklayınca sayılan ayet listesi açılsın. (C01/C07/C09'un kök-önlemi.)
- [x] **B4 · Yayın kapısı (CI) — sayım + eş-güncelleme testleri** — ✅ **YAPILDI (2026-09-07)** 🟢
  114 sûre toplamı, ayet sınırları, seri toplamları, çeviri alan kapsamı, katalog↔sitemap eşliği otomatik kontrol. Dinî dil/tecvid + bilim/psikoloji içerik uzman gözden geçirme. (C01/C07/C12/C18 bu kapı olsa yakalanırdı.)

## C) Menü & İçerik Mimarisi

- [ ] **C1 · Amaç-bazlı giriş: Oku / Öğren / Araştır / Tefekkür** — 🔵 L (nav restructure) **★ ÖNERİLEN SONRAKİ BÜYÜK İŞ (veri sonrası)**
  Her amaca birincil giriş + net "sonraki adım". Mevcut "Tüm Araçlar" araması korunur.
  - **Somut tasarım:** Ana sayfada hero altına **4 "kapı"** (araç ismi değil, niyet): 📖 Oku / 🧭 Öğren / 🔬 Araştır / 🌙 Tefekkür. Her kapı = ikon + "ne yapacaksın" + 2-3 seçili örnek giriş + "→ sonraki adım". Kapı → o niyete filtreli iniş (veya filtrelenmiş "Tüm Araçlar").
  - **Niyet eşlemesi (65 düz araç → 4 kova):** Oku→`/oku`,Fâtiha (mushaf/meal/ezber/karaoke) · Öğren→atlaslar (kissa, ibadetler, insan-*, kavim, doga, mesel) · Araştır→graflar (graf/ayet, kavram, kelime-isi, zaman, diyalog) + furuk/munasebat/retorik · Tefekkür→`/tefekkur`.
  - **Gerektirir:** `toolCatalog`'a `intent` alanı (65 aracı etiketle — katalog tek kaynak, SEO02) + 4-kapı bileşeni (A1/C2 gibi paylaşılan, düşük risk) + isteğe bağlı filtreli Tüm Araçlar.
  - **ÖN KOŞUL (kritik):** körlemesine yapma. Önce **saha analitiği 2-3 hafta** (aşağıya bak) → hangi araçlar hiç açılmıyor gör. Veri ya kapıların keşfi açacağını ya da **65 aracın fazla** olup bazılarının birleştirilmesi/emekliye ayrılması gerektiğini gösterir (azaltma > ekleme olabilir). C1'i veriyle kur.
  - **NOT:** E1'in web-vitals'ı yalnız *performans* ölçer (LCP/INP/CLS), *ziyaret sayısı/hangi sayfa* DEĞİL. C1 için gereken sayfa-popülerliği verisi ayrı bir analitik ürünü ister (Vercel Web Analytics önerilir — cookieless, hazır dashboard).
- [x] **C2 · Örtüşen araçların sınırlarını açıkla** — 🟡 S/M **✅ TAMAMLANDI**
  Yeni `ToolScopeNote` (hero altı, varışta yönlendirir; CrossToolCTA sayfa-dibi ile tamamlayıcı): "Bu sayfa neye odaklanır + komşu araçların ayırıcı farkı". 4 küme, **11 araç**:
  - İnsan: Tanım · Psikoloji · Nefs Mertebeleri · Yolculuk
  - Ahiret: Ahiret Yolculuğu (tüm yolculuk) · Kıyâmet (başlangıç sahneleri) · Cennet & Cehennem (varış)
  - Belâgat: Kur'ân Belâgatı (genel) · Retorik Sorular (İstifhâm/soru ekseni)
  - Sinonim: Füruk Atlası (34-aile atlas) · Yakın Anlamlı Nüanslar (seçili çift nüansları)
  Ayrımlar her aracın kendi kapsamından türetildi (uydurma yok). 11 araç TR/EN doğrulandı.
- [x] **C3 · i18n yerelleştirme kapsamını genişlet** — 🟡 M **✅ TAMAMLANDI (denetim + boşluk kapatma)**
  Denetim: kapsam zaten mükemmel — tr/en.json parite (399=399), metadata lokalize (`locale==='en'`), tüm araçlar `language` ternary'siyle çift-dilli, grafik etiketleri/CLASSICAL_GROUPS/WordHeatmap presetleri EN'li. Kod tabanındaki **tek gerçek boşluk** iki Navbar menü aria-label'ıydı → lokalize edildi.

## D) Ses & Tecvid Deneyimi — 🔵 büyük proje

- [ ] **D1 · "Gör → Örneği dinle → Karşılaştır → Uygula" akışı** — 🔵 L/XL
  Her kurala ≥3 örnek (harf/hece renk+altçizgi); birincil "Örneği dinle" + ikincil "Tam ayeti dinle" (kesit öncesi/sonrası kısa pay); hız/tekrar/bekleme ayarı; aynı anda tek kayıt; kâri/kıraat/sûre:ayet/süre/kaynak künyesi; basit uygulama ("hangi harfte kural var?"). Uzman kontrolü + ses-yükleme hata mesajı.

## E) Teknik / Performans / Erişilebilirlik

- [x] **E1 · Performansı gerçek ölçümle yönet** — 🟢 M **✅ TAMAMLANDI (saha ölçümü etkinleştirildi)**
  Yeni `WebVitals` (Next `useReportWebVitals`, ek bağımlılık yok): LCP/INP/CLS/FCP/TTFB her ziyarette ölçülür — dev'de eşik dereceli konsol, üretimde `NEXT_PUBLIC_VITALS_ENDPOINT` ayarlıysa `sendBeacon` ile sahaya. Root layout'ta. Böylece lab (Lighthouse) yanında **saha** verisi toplanabilir. Not: 3D graf lazy-load'u ForceGraph3D ref forwarding'i bozacağı için atlandı; meal verisi zaten `mealCache` ile tekrar inmiyor (Hero de ağır modülleri `next/dynamic` ile lazy). Production build temiz.
- [~] **E2 · Görev-bazlı klavye erişilebilirlik denetimi** — 🟢 M **(grafikler A3'te kapsandı)**
  Yalnız klavyeyle: sûre aç, ayet seç, filtre, grafik detayı, sesi durdur, geri dön. "Ana içeriğe geç" korunur; modal odak yönetimi + görünür odak.
  - ✅ Grafik detayı/metin-alternatifi + klavye: A3'te dört graf için yapıldı; tilâvet butonu zaten klavye-erişilebilir.
  - ⬜ Kalan: tam görev-bazlı denetim (filtre/modal odak/görünür odak) diğer araç sayfalarında.
- [x] **E3 · Host tutarlılığı** — ⚪ (SEO03) Kod apex-tutarlı; Vercel www→apex ayarı bekliyor.
- [x] **E4 · Katalog/sitemap tek kaynak** — ⚪ (SEO02) Yapıldı — sitemap TOOL_CATALOG'dan besleniyor.
- [x] **E5 · Anlamlı ilk HTML (SSR)** — 🔵 (SEO01) Büyük/mimari; §16.12 kısmen. Ayrı faz.
- [x] **E6 · Geçişte yanlış etiket-metni** — ⚪ (UX03) Yapıldı — meal yükleme dim'i.

---

## Önerilen sıra (benim önceliğim)

1. **B4 (Yayın kapısı/CI sayım testleri)** — 🟢 en yüksek kaldıraç; C01/C07/C12/C18 sınıfı hataların bir daha girmesini engeller.
2. **A3 + E2 (grafik metin-alternatifi + klavye a11y)** — gerçek erişilebilirlik boşluğu.
3. **B3 (sayım kuralları + tıkla→liste)** ve **B2 (5 bilgi türü etiketi)** — akademik farkı güçlendirir.
4. **A1, A2, A4, A5** (araç girişi, keşif/araştırma, okuma meal, mobil) — orta efor, görünür UX kazanımı.
5. **C2, C3, E1** — sınır açıklamaları, i18n devamı, performans ölçümü.
6. **Büyük projeler (ayrı faz):** D1 (ses/tecvid), C1 (amaç-bazlı menü), B1 (provenance), E5 (SSR).

> Not (kullanıcı çıtası): görsel/UX işlerinde artımlı cila değil redesign-düzeyi ambisyon bekleniyor ([[feedback_visual_design_bar]]); ama gerçek içerik 1:1 korunur ([[feedback_enhance_dont_invent]]).
