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
- [ ] **A2 · Keşif ↔ araştırma yoğunluğunu ayır** — 🟢 M
  Başta 3 açıklayıcı örnek, ileri detayda tam tablo/grafik. "30 sn'de: neye bakıyorum / ne tıklamalıyım / ne öğreneceğim" testi.
- [x] **A3 · Grafiklerin metin karşılığı + klavye erişimi** — 🟢 M/L **✅ TAMAMLANDI**
  Ayet/kavram/diyalog/zaman ağlarında renk+konuma ek: metin-alternatifi + klavye navigasyonu. Tüm içerik mevcut veriden türetildi (uydurma yok), tarayıcıda TR+EN doğrulandı.
  - ✅ **RevelationTimeline (/graf/zaman):** görünür + erişilebilir **"Liste" görünüm modu** (semantik `<table>`) + tüm modlarda `SR_ONLY <ol>` metin-alternatifi. Ayrıca kart ipuçları (ⓘ / mushaf-fark) native `title` yerine anında açılan `HintIcon` (hover+focus+tık).
  - ✅ **ConceptGraph (/graf/kavram):** sr-only bağlantı listesi; öğeler `<button>` — Enter kavramı sabitler, âyet paneli açılır.
  - ✅ **DiyalogAgi (/graf/diyalog):** sr-only konuşmacı + diyalog-ekseni listesi; butonlar ekseni Diyaloglar sekmesinde açar.
  - ✅ **WordHeatmap (/graf/kelime-isi):** sr-only özet (hücreler zaten aria-label'lı klavye butonları).
  - ✅ **VerseGraph (/graf/ayet):** ClusterView + FullGraph (3B, masaüstü varsayılanı) + VerseView sr-only açıklama; 11 klasik sûre grubu + iki görünüm modu.
  - ➕ **Tilâvet autostart:** /graf/ayet İkra (Alak 1-5) tilâveti ilk kullanıcı jestinde otomatik başlar (tarayıcı sesli-autoplay engelini jest-yedeğiyle aşar; buton kontrolü korunur).
  - **BONUS (önceki turda):** sistemik "başlık/çip truncate" (§13.31 Mek. 2) çözüldü — `useNavbarOffset` → `--qc-nav-h` CSS değişkeni; 38 dosyada hardcoded `62px` → `var(--qc-nav-h, 84px)`; regresyon `audit-counts.mjs` push kapısında. CLAUDE.md §13.17 güncellendi.
- [ ] **A4 · Okuma ekranı: düz-yazı meal seçeneği + tipografi** — 🟢 S/M
  Sürekli italik meal için düz-yazı seçeneği, punto/satır aralığı/rahat tema kolay erişilir. Kelime/meal/tefsir/ezber/tahta/yer-imi'ni birincil/ikincil düzenle.
- [ ] **A5 · Mobilde en zor ekranları test et** — 🟢 M
  114 sütun ısı haritası, çok sekmeli ibadet, 2 sütun mushaf, uzun başlıklar. 360/390px tek sütun, yatay kaydırma açıklaması, odak görünürlüğü, 44px dokunma. (§13.31 truncated ailesiyle bağlantılı.)
- [ ] **A6 · Uzun-okuma tipografisi (tefekkür)** — 🟡 S (kısmen var, §13.29)
  Body ~18-20px, rahat satır aralığı, kontrollü satır uzunluğu. Uzun italik özetleri kısalt. *Not: yazarın metnini ezme (§13.29); tldr katmanını kullan.*
- [ ] **A7 · İçindekiler (TOC) güçlendir** — 🟡 S (kısmen var: DesktopSidebarTOC, ChapterProgress)
  Aktif bölüm, okuma ilerlemesi, başa dön, kaldığın yere devam; kaynakçaya sona kaydırmadan eriş.
- [ ] **A8 · Sekme/kart davranışını ortaklaştır + paylaşılabilir durum** — 🟡 M
  Aktif sekme belirgin, seçili durum URL'de (paylaşılabilir), geri düğmesi öngörülebilir; kaynak/nüans düğmeleri her sayfada aynı yer/ad.
- [x] **A0 · Ana sayfa 3 somut giriş** — ⚪ (UX01) — video butonu + §17 ile kısmen; ayrıca "Oku/Konu ara/Keşfet" girişleri değerlendirilebilir.
- [x] **A9 · Kontrastı ölçerek iyileştir** — ⚪ Zaten var (§13.26 `audit-contrast.mjs` + baseline; §4 scriptureText/accentPrimary token ayrımı).

## B) İçerik Güvenilirlik Sistemi (sitenin akademik farkı) — 🔵 büyük, yüksek değer

- [ ] **B1 · Her iddia için kayıt (provenance)** — 🔵 L
  İddia → ayet/korpus → kullanılan meal → klasik kaynak → çağdaş yorum → istisna/sınır → kontrol eden → güncelleme tarihi. Kitap: baskı+sayfa; makale: DOI/kalıcı bağlantı. (Şu an dağınık; §13.30 kısmen.)
- [ ] **B2 · Beş görünür bilgi türü etiketi** — 🟢 M/L
  Ayet metni · meal · rivayet/klasik görüş · veri analizi · yazar tefekkürü = ayrı görsel etiketler. "Saygıdeğer yorum ≠ zorunlu sözlük anlamı/deneysel bulgu." (C19/C22 bunun küçük örnekleriydi.)
- [ ] **B3 · Ortak sayım kuralları + "sayıya tıkla → liste"** — 🟢 M
  Hafs sürümü, besmele dahil/hariç, kelime bölme, lemma/kök/yüzey, tekrar sayımı, doğrudan/dolaylı atıf tek yerde tanımlı. Her sayıya tıklayınca sayılan ayet listesi açılsın. (C01/C07/C09'un kök-önlemi.)
- [x] **B4 · Yayın kapısı (CI) — sayım + eş-güncelleme testleri** — ✅ **YAPILDI (2026-09-07)** 🟢
  114 sûre toplamı, ayet sınırları, seri toplamları, çeviri alan kapsamı, katalog↔sitemap eşliği otomatik kontrol. Dinî dil/tecvid + bilim/psikoloji içerik uzman gözden geçirme. (C01/C07/C12/C18 bu kapı olsa yakalanırdı.)

## C) Menü & İçerik Mimarisi

- [ ] **C1 · Amaç-bazlı giriş: Oku / Öğren / Araştır / Tefekkür** — 🔵 L (nav restructure)
  Her amaca birincil giriş + net "sonraki adım". Mevcut "Tüm Araçlar" araması korunur.
- [ ] **C2 · Örtüşen araçların sınırlarını açıkla** — 🟡 S/M
  Belâgat↔Retorik, Furûk↔Yakın Anlamlı, İnsan Tanımı/Psikoloji/Nefs/Yolculuk, Kıyamet↔Ahiret sayfalarının kapsamı net anlatılsın; aynı veri kopyalanmasın, ortak veri üzerinde farklı bakış.
- [ ] **C3 · i18n yerelleştirme kapsamını genişlet** — 🟡 M (UX02 devamı)
  Kart başlıkları, motif adları, şehir/dönem açıklamaları, grafik etiketleri, alt-metin, metadata. *UX02'de amthal+ibadetler+doğa yapıldı; kalan: grafik etiketleri, alt-metin, metadata, diğer atlaslar.*

## D) Ses & Tecvid Deneyimi — 🔵 büyük proje

- [ ] **D1 · "Gör → Örneği dinle → Karşılaştır → Uygula" akışı** — 🔵 L/XL
  Her kurala ≥3 örnek (harf/hece renk+altçizgi); birincil "Örneği dinle" + ikincil "Tam ayeti dinle" (kesit öncesi/sonrası kısa pay); hız/tekrar/bekleme ayarı; aynı anda tek kayıt; kâri/kıraat/sûre:ayet/süre/kaynak künyesi; basit uygulama ("hangi harfte kural var?"). Uzman kontrolü + ses-yükleme hata mesajı.

## E) Teknik / Performans / Erişilebilirlik

- [ ] **E1 · Performansı gerçek ölçümle yönet** — 🟢 M
  Ağır grafik/ses modülleri lazy; aynı Kur'an verisi tekrar inmesin; LCP/INP/CLS saha+lab ayrı takip. (§8/§13.26 kısmen; saha ölçümü yok.)
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
