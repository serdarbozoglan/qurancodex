# 📝 EKSİK TEFEKKÜR MAKALELERİ

> **Oluşturma:** 2026-08-12
> **Kaynak:** Kullanıcının paylaştığı `sufist.medium.com` arşiv ekran görüntüleri, sitedeki `public/tefekkur/_index.json` (35 makale) ile karşılaştırıldı.
>
> ⚠ **Neden ekran görüntüsünden:** Medium arşivi programatik olarak taranamıyor. Profil sayfası sonsuz kaydırma ile yalnız son ~10 yazıyı, RSS beslemesi (`/feed`) 9 kaydı veriyor; `/archive` 404 dönüyor. 2025 arşivi bu uçların hiçbirinde görünmüyor — kanıt: 2025-09 ve 2025-10 tarihli iki yazı feed'de yoktu.
>
> **🔧 Seri notu otomasyonu (2026-08-12):** Makale sonundaki "Seri hakkında" notunun envanter cümlesi artık ELLE yazılmıyor — `criticalNote` bloğundaki `tplTR`/`tplEN` şablonlarında `{{seri}}` yer tutucusu bulunur ve `node scripts/sync-series-notes.mjs` bunu `_index.json`'dan üretir. Yeni seri makalesi eklendikten sonra bu script'i çalıştır. (İlk sürüm metne HTML yorumu gömüyordu; renderer yorumları ayıklamadığı için işaretleyiciler sayfada görünüyordu — şablon alanına taşındı.)
>
> **Ekleme kalıbı oturdu.** Referans: `kuran-mesajina-yabanci-kalmak.json` — 44 blok, 24'ü görsel (18 `verseInline` + `root-tree` + `flowChain` + `contrastDuo` + `hierarchyTree`). Site ortancası 11 görsel blok; yeni eklemeler bunun altında kalmamalı.

---

## ✅ A — TERMİNOLOJİ SERİSİ — **TAMAMLANDI** (2026-08-12)

Seri yedi parçanın tamamıyla sitede. 1→2→3→4→5→6→7 `previousArticle`/`nextArticle` zinciri kesintisiz; her sayfa "N / 7" gösteriyor.

| # | Tarih | Başlık | Durum |
|---|---|---|---|
| 1 | 2024-10-11 | Terminoloji 1: Lokal ve Global Perspektifler | ✅ `terminoloji-1-lokal-global` |
| 2 | 2024-11-19 | Terminoloji 2: Parçalanamaz Bütünlerin Hikâyesi | ✅ `terminoloji-2-parcalanamaz-butunler` |
| 3 | 2024-11-27 | Terminoloji 3: Fizikalizmin Kırılganlığı ve Sınırları | ✅ `terminoloji-3-fizikalizm` |
| 4 | 2024-12-22 | Terminoloji 4: Varlıkların Ayna Oluşu | ✅ `terminoloji-4-varliklarin-ayna-olusu` |
| 5 | 2024-12-23 | Terminoloji 5: Makro/Mikro Durumlar, Emergence, Faz Geçişi | ✅ `makro-mikro` |
| 6 | 2025-01-10 | Terminoloji 6: Sema ve İsim Kavramları | ✅ `sema-isim` |
| 7 | 2025-04-24 | Terminoloji 7: Kaderin Çözünürlüğü, Tasarım, İrade | ✅ `kader` |

**Not:** 1, 2, 3 ve 4 eklendiğinde `seriesTotal: 7` ile seri zinciri tamamlanır; mevcut üç makalenin `previousArticle`/`nextArticle` alanları da güncellenmeli.

---

## 🟠 B — YARATILIŞ HİKÂYESİ SERİSİ (2/6 eklendi)

| Tarih | Başlık | Öneri kategori |
|---|---|---|
🔴 **YENİ BULGU (2026-08-12):** Seri **6 yazı** — Medium'un kendi liste sayfası ("Yaratılış Hikayesi · 6 stories") böyle diyor. Arşiv ekran görüntülerinde yalnız ikisi görünmüştü; **3, 4, 5 ve 6 hâlâ eksik ve arşiv taramasında hiç çıkmadı.**

| # | Tarih | Başlık | Durum |
|---|---|---|---|
| 1 | 2025-07-27 | Yaratılış Hikâyesi-1: Giriş | ✅ `yaratilis-hikayesi-1-giris` |
| 2 | 2025-07-27 | Yaratılış Hikâyesi-2: Kâinatın Katmanlı Yaratılışı | ✅ `yaratilis-hikayesi-2-katmanli-yaratilis` |
| 3-6 | ? | **Başlıkları bilinmiyor** | ❌ eksik |

`seriesTotal: 6` yazıldı (kaynak: yazarın kendi Medium listesi). `kozmoloji` kategorisi 4 makaleye çıktı.

⚠ **Bu, arşiv envanterimin eksik olduğunun kanıtı.** Ekran görüntüleri Medium'un gösterdiği kadarını veriyordu; yazarın kendi seri listeleri daha fazlasını içeriyor. Diğer seriler için de aynısı geçerli olabilir — Medium'daki **liste (list) sayfalarını** kontrol etmek envanteri tamamlamanın en güvenilir yolu.

---

## 🟡 C — EVRİM ÜÇLEMESİ (ikisi eksik)

| Tarih | Başlık | Durum |
|---|---|---|
| 2024-11-12 | Hâlâ mı Evrim? | ❌ eksik |
| 2025-05-14 | Evrim dinsizliği yayma projesidir! | ❌ eksik |
| 2025-10-25 | Evrim, İnanç ve Aklımızdaki Resimler | ✅ `evrim-inanc-resimler` |

Üçü birlikte tutarlı bir küme oluşturur. **§13.24 tefekkür istisnası geçerli** — yazarın kendi görüşü, GPT hakem turu ÇALIŞTIRILMAZ (kullanıcı kararı 2026-08-12, CLAUDE.md'ye işlendi).

---

## 🔵 D — DİĞER EKSİK TÜRKÇE YAZILAR

| Tarih | Başlık | Öneri kategori |
|---|---|---|
| 2024-10-22 | Allahu Ekber ile Seyr İlallah: Yüzeydeki Dikkat Dağıtanlardan Kurtulma | `idrak-suur` |
| 2024-12-07 | Kâinat Kitabının Kuantum Bölümü-1: Kuantum Mekaniğinin Beş Büyük Gizemi | `kozmoloji` |
| 2024-12-18 | Anlam, Yaratılış ve Sentenin Bariz İmzası | `kozmoloji` |
| 2025-04-16 | Alâ Sûresi-1: Tesbih ve Soyutlama | `sure-hermenotik` |
| ~2025-04 | Kaderin Çözünürlüğü ve Esnek Determinizm **(devam)** | `terminoloji` |
| 2025-05-31 | Kur'an'ın Ruhsal Coğrafyası: Doğru Yoldan Sapmanın Anatomisi | `kavramsal` |
| 2025-06-10 | Asr Sûresinden Çıkarılan Temel Prensipler | `sure-hermenotik` |
| 2025-11-09 | Vicdan: Evrensel Tercümanımız | `kavramsal` |

**"Kaderin Çözünürlüğü (devam)"** dikkat: sitedeki `kader` makalesinin devamı. Ayrı makale mi yoksa `kader`'in ikinci parçası mı — metni görünce karar verilecek.

---

## 🟢 E — İNGİLİZCE SÜRÜMLER (yeni makale DEĞİL)

**Bunların çoğu mevcut/eklenecek Türkçe yazıların yazar tarafından yazılmış İngilizce sürümüdür.** Ayrı makale açılmamalı; ilgili makalenin `en` alanlarına girmeli.

| İngilizce başlık | Tarih | Karşılığı | Not |
|---|---|---|---|
| Our Principles for Reading the Quran — Part 1: Epistemic | 2024-10-12 | `okuma-prensipleri-1` ✅ sitede | **Hazır kazanç** |
| Our Principles for Reading the Quran — Part 2: Hermeneutic | 2024-10-12 | `okuma-prensipleri-2` ✅ sitede | **Hazır kazanç** |
| Contemporary Quran Readings-1: Local and Global Perspectives | 2024-10-11 | Terminoloji 1 (A bölümü) | TR ile birlikte |
| Physicalism and Its Fragility | 2024-11-27 | Terminoloji 3 (A bölümü) | TR ile birlikte |
| The Five Biggest Mysteries in Quantum Mechanics | 2024-12-07 | Kuantum Bölümü-1 (D bölümü) | TR ile birlikte |
| Meaning, Creation, and the Telltale Signature of Synteny | 2024-12-18 | Anlam/Yaratılış/Synteny (D bölümü) | TR ile birlikte |
| Contemporary Quran Readings: Emergence, Irreducibility, and Meaning | — | Türkçesi görünmüyor | Bağımsız olabilir |
| A New Cosmology: Understanding Existence Through Three Worlds | 2024-12-02 | Türkçesi görünmüyor | Bağımsız olabilir |

> **Neden önemli:** `okuma-prensipleri-1/2`'nin İngilizce gövdeleri şu an ya boş ya çeviri. Yazarın kendi İngilizcesi varken çeviri kullanmak gereksiz — bu iki makale için **anında** kalite artışı.

---

## 🎯 ÖNERİLEN SIRA

1. **Okuma Prensipleri 1-2 → EN gövdeleri** — yeni makale yok, sadece `en` alanları. En ucuz, anında kazanç.
2. **Terminoloji 1-4** — yarım seriyi kapatır, seri navigasyonunu düzeltir.
3. **Yaratılış Hikâyesi 1-2** — `kozmoloji` kategorisini besler.
4. **Evrim üçlemesinin kalan ikisi** — mevcut yazıyla küme tamamlanır.
5. D bölümündeki tekil yazılar.

---

## ⚙ HER EKLEMEDE YAPILACAKLAR

- [ ] `public/tefekkur/<slug>.json` — blok yapısı, görsel blok sayısı ≥ 11 hedef
- [ ] Arapça **kanonik kaynaktan** (`public/verse-graph-bgem3.json`) çekilip §13.15 `cleanArabicForDisplay` ile normalize edilecek — hafızadan YAZILMAYACAK
- [ ] `_index.json` kaydı (`status`, kategori, tldrTr/tldrEn)
- [ ] `canonicalUrl` — Medium linki. Yoksa boş bırak, **uydurma**
- [ ] Dil notu (`criticalNote`): hangi dil yazarın kalemi, hangisi çeviri
- [ ] `node scripts/sync-series-notes.mjs` — seri makalesi eklendiyse
- [ ] **Navbar anlık görüntüsü** — `src/components/Navbar.jsx` içindeki `tefekkurStats` sabitleri (toplam + kategori sayıları). Dinamik fetch var ama ilk boyama bu sabitten geliyor
- [ ] §13.22 embedding: `npm run embed:corpus && node scripts/build-embeddings.mjs`
      ⚠ `reencode-embeddings.mjs` ÇALIŞTIRMA — build zaten base64 üretiyor, tekrar kodlamak bozar
- [ ] `/tr` + `/en` + 390px doğrulama: HTTP 200, tofu yok, yatay taşma yok, konsol hatası yok

---

## 📌 BİLİNEN AÇIK KONULAR

- **`status: "draft"`** — 35 makalenin tamamı taslak. `TefekkurIndexRoute.jsx:224` yalnız `published`/`live` sayıyor, yani sayaç 0 gösteriyor. Bilinçli mi, karar bekliyor (4 kez soruldu, cevaplanmadı).
- **`kuran-mesajina-yabanci-kalmak`** — `canonicalUrl` boş, Medium linki verilmedi.
- **Tarih tutarsızlığı** — bazı makalelerin `_index.json` tarihi Medium'daki tarihle uyuşmuyor (ör. Ruhun Termostatı: sitede 2024-11-20, Medium'da 2026-02-04). Toplu bir denetim gerekebilir.
