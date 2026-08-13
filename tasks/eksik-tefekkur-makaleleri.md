# 📝 EKSİK TEFEKKÜR MAKALELERİ

> **Oluşturma:** 2026-08-12
> **Kaynak:** Kullanıcının paylaştığı `sufist.medium.com` arşiv ekran görüntüleri, sitedeki `public/tefekkur/_index.json` ile karşılaştırıldı.
>
> **📌 Son durum (2026-08-12):** Site **43 makale**. `833176e`'de 6 yeni makale eklendi + indekste kayıp 2 makale kurtarıldı (41'e çıktı); ardından *Hâlâ mı Evrim?* (42) ve *Evrim Dinsizliği Yayma Projesidir!* (43) eklendi. Tamamı `status: "published"`. Kategori dağılımı: sûre-hermenötik 12 · idrak-şuur 9 · terminoloji 7 · kozmoloji 6 · semantik 5 · kavramsal 4.
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

## ✅ B — YARATILIŞ HİKÂYESİ — **HATALI VARSAYIM DÜZELTİLDİ** (2026-08-12)

🔴 **Önceki kayıt yanlıştı.** "Yaratılış Hikayesi · 6 stories" ifadesini *altı bölümlük numaralı bir seri* sandım ve `seriesTotal: 6` yazdım; seri notuna da "3, 4, 5 ve 6 henüz eklenmedi" cümlesi girdi. **Bu cümle canlı sitede yanlış bilgi olarak yayımlandı.**

**Gerçek:** Medium'daki "Yaratılış Hikayesi", tematik bir **okuma listesi** (list) — numaralı bir seri değil. Kullanıcının paylaştığı liste ekran görüntüsündeki altı yazı:

| Tarih | Başlık | Durum |
|---|---|---|
| 2025-10-25 | Evrim, İnanç ve Aklımızdaki Resimler | ✅ `evrim-inanc-resimler` |
| 2024-11-12 | Hâlâ mı Evrim? | ✅ `hala-mi-evrim` |
| 2024-12-18 | **Anlam, Yaratılış ve Senteninin Bariz İmzası** | ❌ **eksik** (D bölümünde de var) |
| 2025-05-14 | Evrim dinsizliği yayma projesidir! | ✅ `evrim-dinsizligi-projesi` |
| 2025-07-27 | Yaratılış Hikayesi-2: Kâinatın Katmanlı Yaratılışı | ✅ `yaratilis-hikayesi-2-katmanli-yaratilis` |
| 2025-07-27 | Yaratılış Hikayesi-1: Giriş | ✅ `yaratilis-hikayesi-1-giris` |

**Yani listedeki altı yazının yalnız ikisi numaralı seri parçası.** `seriesTotal` 6 → **2** düzeltildi (iki makalede de), `sync-series-notes.mjs` yeniden çalıştırıldı; seri notu artık "eksik bölüm var" demiyor. Listeden gerçekten eksik olan **tek** yazı: *Anlam, Yaratılış ve Senteninin Bariz İmzası*.

⚠ **Ders:** Medium'da "N stories" ifadesi bir serinin bölüm sayısı DEĞİL, listedeki yazı sayısıdır. Liste başlığının bir seri adıyla aynı olması yanıltıcı. Bir sonraki sefere **listenin içeriğini görmeden** `seriesTotal` yazma.

---

## ✅ C — EVRİM ÜÇLEMESİ — **TAMAMLANDI** (2026-08-12)

| Tarih | Başlık | Durum |
|---|---|---|
| 2024-11-12 | Hâlâ mı Evrim? — Bir Müslümanın Bakış Açısından | ✅ `hala-mi-evrim` |
| 2025-05-14 | Evrim Dinsizliği Yayma Projesidir! | ✅ `evrim-dinsizligi-projesi` |
| 2025-10-25 | Evrim, İnanç ve Aklımızdaki Resimler | ✅ `evrim-inanc-resimler` (TR + EN çeviri) |

Üçü `previousArticle`/`nextArticle` ile kronolojik olarak zincirlendi (`seriesTotal` yok — yazarın ilan ettiği numaralı bir seri değil, tematik küme).

`evrim-dinsizligi-projesi`: 35 blok, **14'ü görsel** — iki `hierarchyTree` (bilimin üç felsefî kabulü; menfi harekete düşen üç akım), üç `contrastDuo` (fizikalizm ⇄ idealizm, iddia ⇄ fiilî tavır, bilimin sahası ⇄ metafiziğin sahası), `flowChain` (bir iddianın bilimde yol alışı), üç `pullQuote`, dört `criticalNote`. **Ayet yok** — yazı bir bilim felsefesi metni; yazarın alıntılamadığı ayet eklenmedi.

⚠ **Üslup kararı:** Yazar metni bilinçli olarak ham bıraktığını söylüyor (*"perişanlığıyla yayımlayacağım"*). Cümleler düzleştirilmedi, araya girmeler ve şakalar (bilim insanı/Fenike dili esprisi dâhil) korundu; bu tercih ilk `criticalNote`'ta okura açıklandı. **Başlık yazarın çürüttüğü iddiadır** — tldr bunu ilk cümlede belirtiyor ki listede yanlış anlaşılmasın.

Üçü birlikte tutarlı bir küme oluşturur. **§13.24 tefekkür istisnası geçerli** — yazarın kendi görüşü, GPT hakem turu ÇALIŞTIRILMAZ (kullanıcı kararı 2026-08-12, CLAUDE.md'ye işlendi).

`hala-mi-evrim`: 26 blok, 8'i görsel — `flowChain` (üç kanıt katmanı: mikro evrim → fosil kaydı → ERV), `contrastDuo` (çifte standart: ateist ⇄ bazı Müslümanlar), `hierarchyTree` (cevapsız üç soru), 36:38 `verseInline`, iki `pullQuote`, `criticalNote`. Kategori `kozmoloji` (5'e çıktı).

⚠ **Yanlış alarm kaydı (2026-08-12):** Bu makalede "Arapça render olmuyor" diye bir hata teşhis edilmişti. **Hata yoktu.** Ölçüm tabanı yanlıştı: sayfadaki `lang="ar"` sayımında navigasyonun **2** öge kattığı varsayılmıştı, gerçekte **1** katıyor. Tek `verseInline` içeren makalede beklenen sayı 1 (nav) + 1 (ayet) = 2 idi; ölçülen de 2'ydi. Doğru kontrol yöntemi: `next build` sonrası `.next/server/app/<locale>/tefekkur/<slug>.html` içinde ayetin **birebir metnini** aramak — canlı dev sunucusunda öge saymak değil (derleme sırasında yanıltıcı sonuç verir).

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

✅ **Eklendi (bu oturumda, D listesinde değildi):** *Kur'an Mesajına Yabancı Kalmak* (2025-09-05) → `kuran-mesajina-yabanci-kalmak`. 18 verseInline + ك ن ن kök ağacı; sitenin en ayet-yoğun tefekkür yazısı. ⚠ `canonicalUrl` hâlâ BOŞ — Medium linki verilmedi.

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

~~1. Okuma Prensipleri EN gövdeleri~~ · ~~2. Terminoloji 1-4~~ ✅ · ~~3. Yaratılış Hikâyesi 1-2~~ ✅ (kısmen — 3-6 kaldı)

~~Yaratılış Hikâyesi 3-6~~ ✅ (böyle bölümler yok — B bölümüne bak) · ~~Evrim üçlemesi~~ ✅

**Güncel sıra (2026-08-12):**
1. **Okuma Prensipleri 1-2 → EN gövdeleri** — yeni makale yok, sadece `en` alanları. Yazarın kendi İngilizcesi mevcut. En ucuz kazanç, hâlâ yapılmadı.
2. **Anlam, Yaratılış ve Senteninin Bariz İmzası** (2024-12-18) — hem B listesinde hem D'de; iki kümeyi birden kapatır. İngilizce sürümü de var (*Meaning, Creation, and the Telltale Signature of Synteny*), ikisi birlikte eklenebilir.
3. D bölümündeki kalan tekil yazılar (7 adet).
4. E bölümündeki İngilizce sürümler.

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

## 🔴 OPERASYONEL DERS — GIT LFS (2026-08-12, acı deneyim)

**`git-lfs` bu makinede KURULU DEĞİLDİ.** `.gitattributes` `corpus-embeddings.json`'ı LFS'e yönlendiriyor ama filtre çalışmadığı için **10 commit'e 166 MB ham JSON girdi**; GitHub 100 MB sınırıyla push'u reddetti (`pre-receive hook declined`).

**Yapılan hata:** `git check-attr filter` çıktısına (`filter: lfs`) bakıp "LFS aktif" sanmak. **Attribute'un varlığı, filtrenin çalıştığı anlamına gelmez.** Doğru kontrol: `which git-lfs`.

**Kurtarma denemesi ve sonucu:** `git lfs migrate import` çalıştırıldı → **1565 commit'i yeniden yazdı**, `origin/main` ata olmaktan çıktı, force push gerekti. YAPILMADI. Bunun yerine `git reset --soft origin/main` ile iş **tek temiz commit**e toplandı; geçmiş yeniden yazılmadı, push fast-forward oldu. Bedeli: o günün granüler commit'leri kayboldu.

**Bundan sonra — embedding çalıştırmadan ÖNCE:**
```bash
which git-lfs || brew install git-lfs   # kurulu değilse ham blob commit'lenir
git lfs install
```
Commit sonrası doğrula — pointer olmalı, JSON değil:
```bash
git cat-file -p HEAD:next/src/lib/corpus-embeddings.json | head -c 40
# beklenen: version https://git-lfs.github.com/spec/v1
```

Yedek etiket: `backup-pre-lfs-78a3b18` (migrate öncesi hâl).

---

## 📌 BİLİNEN AÇIK KONULAR

- ~~**`status: "draft"`**~~ ✅ **çözüldü** (`652bc85`) — tamamı `published` yapıldı. Sorun: `TefekkurIndexRoute.jsx:224` yalnız `published`/`live` sayıyor, ama sayı 0 olunca `published || data.articles.length` yedeğe düşüyordu; sayfa aynı anda "41 yayında" **ve** "41 taslak" gösteriyordu.
- **`kuran-mesajina-yabanci-kalmak`** — `canonicalUrl` boş, Medium linki verilmedi.
- **Tarih tutarsızlığı** — bazı makalelerin `_index.json` tarihi Medium'daki tarihle uyuşmuyor (ör. Ruhun Termostatı: sitede 2024-11-20, Medium'da 2026-02-04). Toplu bir denetim gerekebilir.
