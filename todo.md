# Quran Codex — Master To-Do
_Son güncelleme: 2026-03-31_

---

## ✅ Tamamlananlar

### Temel Altyapı
- [x] Ayet Haritası (VerseGraph) — 3D embedding görselleştirmesi
- [x] Tam Harita (FullGraph) — tüm 6236 ayet, sure filtresi
- [x] SurahInfoPanel — tema, fadail, notlar, Arapça render
- [x] Bilingual destek (TR/EN)
- [x] Sure navigasyon okları (‹ ›)
- [x] Mekkî/Medenî renk kodlaması
- [x] Ayet arama (Türkçe + Arapça + embedding)
- [x] Ghost node dimming (sure filtresi aktifken)
- [x] Mobile hamburger menüsüne Ayet Haritası butonu
- [x] Inline Arapça altın renk + Amiri bold render
- [x] Ses entegrasyonu — VersePanel'de Meşarî/Abdülbasit/Husarî tilâvet
- [x] Bağlam ayetleri — VersePanel'de önceki/sonraki 2 ayet
- [x] Paylaşım kartı — Arapça + meal + referans, kopyala
- [x] Matematiksel denge interaktif — sayaçlara tıklayınca Ayet Haritası'nda arama
- [x] Kelime Haritası (WordHeatmap) — sûre başına kelime frekansı ısı haritası
- [x] Nüzul Sırası Haritası (RevelationTimeline) — grid + timeline görünümü
- [x] Dua Ayetleri — 35 küratörlü dua, 8 kategori, arama, ses oynatıcı
- [x] KFGQPC font — tüm hareke/işaret desteği tam
- [x] Sayfa numaraları — Diyanet baskısı (604 sayfa)
- [x] Sure arama normalize — "vakia" → "Vâkıa"

### Okuma Modu (ReadingMode.jsx)
- [x] Tam ekran sûre okuma (kitap + ayet modu)
- [x] Kitap modu — sayfa bazlı, sûre sınırı aşan sayfalar, sayfa-merkezli navigasyon
- [x] Cüz numarası — sayfa yanında gösteriliyor
- [x] Gece/Gündüz modu (persist)
- [x] Yazı boyutu kontrolü (persist)
- [x] Tecvid renklendirme — kalkale, gunne, med, ihfâ, iklab, idgam
- [x] Meal seçici — 10 TR + 5 EN yazar, API entegrasyonu, persist
- [x] Kari seçici — 3 okuyucu, persist
- [x] Yer imi sistemi — max 7, zaman damgası, sayfa bazlı
- [x] Arama — meal metni + sure adı, 60 sonuç, highlight
- [x] Ayet seçimi + bottom player bar (play/pause/prev/next/share/kapat)
- [x] Scroll to active verse (book mode + verse mode)
- [x] localStorage persistence (tüm ayarlar + son konum)
- [x] Secde işaretçisi (verse mode)
- [x] Besmele + besmele meali gösterimi
- [x] Allah lafzı renklendirme
- [x] Vakıf işaretleri — U+06DA+U+06DB tek span, pozisyon ayarı
- [x] Maddah (U+0653) CSS absolute overlay ile render
- [x] Loading spinner
- [x] SVG play/pause ikonları (AudioBar dahil)
- [x] Klavye navigasyonu (ok tuşları, Escape)
- [x] Okuma istatistikleri kaldırıldı (gereksiz karmaşıklık)

### İçerik & UX İyileştirmeleri (2026-03-31)

- [x] ZeroRedundancy — İncil karşılaştırmasına ℹ️ dilbilimsel not
- [x] ZeroRedundancy — Kur'an `~0%` etiketi büyük/bold vurgu
- [x] ZeroRedundancy — Hz. Musa grid ile stats arasına görsel ayırıcı
- [x] HumanDefinition — 7. vasıf kartı orta boşluğu bağlantı çizgisiyle dolduruldu
- [x] HumanDefinition — Dönüşüm kartları `flex flex-col` + `mt-auto` ile eşit yükseklik
- [x] HumanDefinition — İnsân kelimesine "üns" kök alternatifi ℹ️ notu
- [x] VerseGraph — Benzerlik skoru negatif % sorunu çözüldü (`0.xx` formatı, bar `Math.max(0,...)`)
- [x] RevelationTimeline — Bar chart legend eklendi (↕ ayet sayısı, ← ilk nâzil, renk yoğunluğu)
- [x] HistoricalProof — Her 3 hikayeye (Firavun/Haman/Roma) "Neden önemli?" significance bloğu

---

## 🏗️ BÜYÜK GÖREV: Site Redesign

> **Hedef:** Profesyonel, sinematik, yayına hazır bir Quran Codex deneyimi.

### 1. Mimari & Navigasyon

- [ ] **Navbar yeniden yapılandır**
  - Yeni yapı: `Logo | Keşfet (anchor) | Araçlar ▾ | [Oku] | TR/EN`
  - **Oku** → doğrudan okuma modunu açan belirgin buton
- [ ] **Route yapısı** — React Router veya hash-based routing
  - `/` → landing + sections
  - `/oku` → reading mode
  - `/ayet-haritasi` → verse graph
  - `/araclar/*` → diğer araçlar


### 4. Genel Görsel Dil

- [ ] **Renk token sistemi** — site geneli CSS değişkenleri, section'lar arası tutarlılık (şu an her section kendi rengini icat ediyor)
- [ ] Section geçişleri — gradient overlap yerine sinematik transition
- [ ] Mobil responsive pass — tüm section'lar
- [ ] Performans — lazy loading, code splitting

---

## 🔴 Yüksek Öncelik — Yeni Özellikler

### Kavram Ağı / Semantic Map

- [ ] "Takva" yaz → anlam olarak bağlantılı kavramlar (sabır, ihsan, tevekkül) görsel ağ olarak
- [ ] Altyapı hazır: embedding verileri VerseGraph'te mevcut
- [ ] Türkçe İslami platformlarda benzeri yok — en güçlü teknik katkı potansiyeli
- [ ] Uygulama: yeni araç sayfası, force-directed graph veya radial layout

---

## 🟡 Orta Öncelik — Yeni Özellikler


---

## 🟢 Uzun Vade — Yeni Özellikler

Kesinlikle Olması Gerekenler

2. Kur'an'da Kadınlar 🏆
Bu sayfanın "wow" potansiyeli çok yüksek çünkü şaşırtıcı bir gerçek var: Kur'an'da adı geçen tek kadın Hz. Meryem — ve tüm surenin adını taşıyor. Hz. Havva, Asiye, Züleyha, Sebe Melikesi Belkıs, Hz. Musa'nın annesi ve kız kardeşi hepsi isimsiz geçiyor. Bu veri başlı başına bir analiz.
3. Kur'an'ın Coğrafyası 🏆
Harita bazlı görselleştirme. Kur'an'da geçen yerler: Mekke, Medine, Mısır, Şam, Babil, Rum, Habeşistan, Medyen, Hicr, Sinai... Her yerin Kur'an'daki rolü ve modern karşılığı. İnteraktif harita olarak görselleştirilirse çok etkileyici.
4. Kur'an'da Sayılar ve Matematik
7 gök, 19 bekçi, 300/309 yıl, 1000 yıl, 50.000 yıl, 7 kapı, 8 kapı... Kur'an'da geçen tüm sayıların analizi. Zaten Zamanın Boyutları'nda kısmen var ama bağımsız sayfa olmalı.


Güçlü Ama İkinci Öncelik
6. Kur'an'da İblis/Şeytan
İblis ismi Kur'an'da 11 kez geçiyor. Şeytan 88 kez. İblis'in Allah ile diyalogu, kibrin anatomisi, "Ben ondan daha hayırlıyım" cümlesi — Kur'an'ın en dramatik konuşmaları bunlar. Sitenin İnsan Psikolojisi sayfasıyla bağlantı kurar.

8. Kur'an'da Mucizeler Atlası
Peygamberlerin mucizelerini değil, Kur'an'ın bizzat anlattığı mucizeleri — asanın yılana dönüşmesi, denizin yarılması, Hz. İsa'nın çamurdan kuş yapması, Hz. İbrahim'in ateşi... Her mucize için ayet + dramatik tasvir.
9. Kur'an'da Şehirler ve Medeniyetler
Kavimler Atlası'yla örtüşüyor ama farklı açıdan — Mekke, Medine, Babil, Roma (Rum), Fir'avun'un Mısır'ı. Kur'an bu şehirleri nasıl anlatıyor?

Dilbilimsel Açıdan İlginç
11. Kur'an'ın İlk ve Son Kelimeleri
Her surenin ilk ve son kelimesi. İlk sure Fatiha "Bismillah" ile açılır, son sure Nas "en-nâs" ile kapanır. Bu desen görselleştirilirse çok güçlü.



### Kur'an'da Doğa (Keşfet bölümü)

- [ ] Yıldızlar, rüzgar, deniz, dağlar — "ayet" (işaret) olarak doğa
- [ ] Bilimsel İşaretler'den farklı: estetik ve teolojik, bilimsel değil
- [ ] Neden belirli doğa olayları belirli teolojik noktaları destekler?
- [ ] En uzun vadeli

---

## 🚀 Okuma Modu — Kalan İyileştirmeler

- [ ] **Tecvid genişletme** — izhar (حلق harfleri), mad-lâzım tipleri
- [ ] **Vakıf margin fine-tuning** — `left: -0.08em` onaylandı mı?

---

## 📱 Platform & Teknik (Uzun Vade)

- [ ] **PWA** — mobilde kurulabilir, çevrimdışı
- [ ] **Ses offline cache (Service Worker)** — everyayah.com stream'i offline cache
- [ ] **ZoomToFit sorunu** — Surah 31-32 cluster ekranın üstünde kalıyor
- [ ] **Mobil 3D crash** — Three.js OOM için 2D fallback
- [ ] **Interactive Coğrafya Haritası** — Kur'an'da geçen yerler

---

## 🎯 Sıradaki Aksiyon

2. **Hafıza Modu** — en yüksek kullanıcı etkileşimi, düşük efor
3. **Navbar + routing yeniden tasarımı** — okuma moduna direkt link
4. **Renk token sistemi** — site geneli tutarlılık (mimari iş)
