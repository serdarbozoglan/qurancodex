# Tefekkür — Felsufi/Sufist Makale Migration Plan

> **📌 DURUM (2026-08-13): 52 makale yayında.** Kategori dağılımı:
> sûre-hermenötik 14 · idrak-şuur 11 · kozmoloji 8 · terminoloji 8 ·
> kavramsal 6 · semantik 5. Tamamı `status: "published"`.
>
> **Kaynak platform artık tek değil:** 50 makale Medium'da, 2 makale
> **Substack**'te (`iki-nedensellik`, `gecmis-klasik-gelecek-kuantum`).
> Atıf metinlerindeki platform adı artık `canonicalUrl`'den türetiliyor
> (`platformName()` — TefekkurArticleRoute). Sabit "Medium" yazımı kaldırıldı.
>
> **Yeni seri:** *Yazılan ve Yazılmayan* (`seriesId: yazilan-yazilmayan`) —
> İngilizce asıllı, 2 parça yayında, toplam sayı yazar tarafından ilân edilmedi.
> ⚠ Bu seride **dil yönü terstir**: İngilizce asıl, Türkçe çeviri.
>
> **Markdown render kuralı (2026-08-13'te düzeltildi):** `tldr` ve blok alt
> alanları markdown içerir. Görünür her yer `renderInlineMarkdown`'dan geçmeli;
> metadata / JSON-LD / sr-only başlık ise `stripMarkdown()` kullanır.
> Bir kez kaçırılan yerler: indeks kartı tldr'ı, `contrastDuo` caption+bridge,
> `criticalNote` heading, makale metadata'sı.


> **Bağlam:** QuranCodex'e 3. top-level navigation: **Tefekkür** (Keşfet · Araçlar · **Tefekkür**)
> **Toplam korpus:** 49 makale — 41 Türkçe + 8 İngilizce
> **Yazar:** Felsufi (https://sufist.medium.com/)
> **Kaynak:** Yazarın kanonik master listesi (2026-05-30 doğrulamalı)
> **Hedef route:** `/tefekkur` (index) + `/tefekkur/[slug]` (article page)
> **Bilingual stratejisi:** TR-default, EN versiyonu varsa `?lang=en` veya `/en/tefekkur/[slug]`

---

## ⚙️ Migration Workflow — her makale için adımlar

- [ ] **A.** Tam metin extract (Medium'dan veya yazardan)
- [ ] **B.** Markdown taslağa çevir (`tasks/tefekkur-drafts/[slug].md`)
- [ ] **C.** Proofread: typo / Türkçe orthography / Arapça encoding (her düzeltme §10 Change Log'a yazılır)
- [ ] **D.** Site formatına uyarla — template'e göre MDX dosyası (§4 Visualization Strategy)
- [ ] **E.** İç cross-reference link'leri site-içi URL'lere çevir (`/tefekkur/[slug]`)
- [ ] **F.** Dış cross-link'leri ekle (mevcut tool/section)
- [ ] **G.** Görsel inceleme — desktop + mobile
- [ ] **H.** Yayına alındı (commit + push)

---

## 📚 Kategori Yapısı

Yazarın kendi 7-kategori tematik bölümlemesi taban alınıyor:

| ID | Kategori | Sayı | Renk teması | Template |
|---|---|---|---|---|
| `kavramsal` | **Kavramsal Tahlil** | 5 | Sky blue (psikoloji/içsel) | Quote-Driven Read |
| `terminoloji` | **Terminoloji Serisi** | 9 (1-7 + 2 devam) | Royal gold (ana eser) | Series Hero + Diagram |
| `sure-hermenotik` | **Sûre & Hermenötik** | 10 | Gold (brand primary) | Sûre Tefsir |
| `semantik` | **Semantik Seri** | 5 (1-4 + Siccin) | Purple (semantic accent) | Root Tree |
| `idrak-suur` | **İdrak & Şuur** | 6 | Emerald (idrak/aydınlık) | Quote-Driven Long Read |
| `kozmoloji` | **Kozmoloji & Yaratılış** | 7 | Cosmic purple (kuantum/uzay) | Series Diagram |
| `english` | **İngilizce (paralel)** | 8 | Soft cream (bilingual) | Same as TR counterpart + lang toggle |

---

## 1️⃣ Kavramsal Tahlil

Kısa-orta uzunlukta psikolojik / pratik / spiritüel essay'ler.

| # | Status | Başlık | URL | Tarih | Süre |
|---|---|---|---|---|---|
| K-01 | ⬜ | Ruhun Termostatı | [link](https://sufist.medium.com/ruhun-termostat%C4%B1-4a41bd9f8ea7) | 2026-02-04 | 12 dk |
| K-02 | ⬜ | Enerji Krizi: Odaklanmayı Yakıt Yönetimi Olarak Anlamak | [link](https://sufist.medium.com/enerji-krizi-odaklanmay%C4%B1-yak%C4%B1t-y%C3%B6netimi-olarak-anlamak-f7c8f9db19b5) | 2026-01-28 | 12 dk |
| K-03 | ⬜ | Yapılanların Süslü Görülmesi | [link](https://sufist.medium.com/yap%C4%B1lanlar%C4%B1n-s%C3%BCsl%C3%BC-g%C3%B6r%C3%BClmesi-4b47a9693c04) | 2025-11-27 | 6 dk |
| K-04 | ⬜ | Vicdan: Evrensel Tercümanımız | [link](https://sufist.medium.com/vicdan-evrensel-terc%C3%BCman%C4%B1m%C4%B1z-e89c66917637) | 2025-11-09 | 3 dk |
| K-05 | ⬜ | Kur'an Mesajına Yabancı Kalmak | [link](https://sufist.medium.com/kuran-mesaj%C4%B1na-yabanc%C4%B1-kalmak-5d75cb450a8a) | 2025-09-05 | 5 dk |

---

## 2️⃣ Terminoloji Serisi

> **Seri yapısı:** 7 numaralı seri + 1 "devam" + Pinned status'lu Terminoloji 7. Yazar bahsetti: seri max 20 parçaya çıkabilir.

| # | Status | Başlık | URL | Tarih | Süre |
|---|---|---|---|---|---|
| T-07p | ⬜ ⭐ | **Terminoloji 7: Kaderin Çözünürlüğü, Tasarım, İrade ve Esnek Determinizm** _(Pinned)_ | [link](https://sufist.medium.com/i%CC%87nsan-kainat-ve-kuran-terminolojisi-7-kaderin-%C3%A7%C3%B6z%C3%BCn%C3%BCrl%C3%BC%C4%9F%C3%BC-tasar%C4%B1m-i%CC%87rade-ve-esnek-determinizm-cf6204c0ecdf) | 2025-04-24 | 7 dk |
| T-07d | ⬜ | Kaderin Çözünürlüğü ve Esnek Determinizm (devam) | [link](https://sufist.medium.com/kaderin-%C3%A7%C3%B6z%C3%BCn%C3%BCrl%C3%BC%C4%9F%C3%BC-ve-esnek-determinizm-devam-ee43e622ef7a) | 2025-04-27 | 4 dk |
| T-06 | ⬜ | Terminoloji 6: Sema ve İsim Kavramları | [link](https://sufist.medium.com/i%CC%87nsan-k%C3%A2inat-ve-kur%C3%A2n%C4%B1-okuma-terminolojisi-6-sema-ve-i%CC%87sim-kavramlar%C4%B1-a4b57cc981cc) | 2025-01-10 | 6 dk |
| T-05 | ⬜ | Terminoloji 5: Makro ve Mikro Durumlar, Emergence ve Faz Geçişi | [link](https://sufist.medium.com/i%CC%87nsan-k%C3%A2inat-ve-kur%C3%A2n%C4%B1-okuma-terminolojisi-5-makro-ve-mikro-durumlar-emergence-ve-faz-ge%C3%A7i%C5%9Fi-90a4be29837a) | 2024-12-23 | 4 dk |
| T-04 | ⬜ | Terminoloji 4: Varlıkların Ayna Oluşu | [link](https://sufist.medium.com/i%CC%87nsan-k%C3%A2inat-ve-kur%C3%A2n%C4%B1-okuma-terminolojisi-4-varl%C4%B1klar%C4%B1n-ayna-olu%C5%9Fu-df99859fbe94) | 2024-12-22 | 5 dk |
| T-03 | ⬜ | Terminoloji 3: Fizikalizmin Kırılganlığı ve Sınırları | [link](https://sufist.medium.com/i%CC%87nsan-kainat-ve-kuran%C4%B1-okuma-terminolojisi-3-fizikalizmin-k%C4%B1r%C4%B1lganl%C4%B1%C4%9F%C4%B1-ve-s%C4%B1n%C4%B1rlar%C4%B1-026cc967ff33) | 2024-11-27 | 3 dk |
| T-02 | ⬜ | Terminoloji 2: Parçalanamaz Bütünlerin Hikayesi | [link](https://sufist.medium.com/i%CC%87nsan-kainat-ve-kuran%C4%B1-okuma-terminolojisi-2-par%C3%A7alanamaz-b%C3%BCt%C3%BCnlerin-hikayesi-698fdf0b01c1) | 2024-11-19 | TBD |
| T-01 | ⬜ | Terminoloji 1: Lokal ve Global Perspektifler | [link](https://sufist.medium.com/i%CC%87nsan-kainat-ve-kuran%C4%B1-okuma-terminolojisi-1-lokal-ve-global-perspektifler-2e76f9d3bdfd) | 2024-10-11 | TBD |

---

## 3️⃣ Sûre & Hermenötik Analizleri

Belirli sûre/ayet temelli tahliller + hermenötik denemeler.

| # | Status | Başlık | URL | Tarih | Süre |
|---|---|---|---|---|---|
| S-01p | ⬜ ⭐ | **Alak Suresi 1: İlk Besmele, Büyük Resim, ve Metafizik Paradigma** _(Pinned)_ | [link](https://sufist.medium.com/alak-suresi-1-i%CC%87lk-besmele-b%C3%BCy%C3%BCk-resim-ve-metafizik-paradigma-54bbd52cb3bd) | 2024-09-21 | 4 dk |
| S-02 | ⬜ | Alak Suresi 2-3: Fetus ve Ontolojik Öncelik | [link](https://sufist.medium.com/alak-suresi-2-3-fetus-ve-ontolojik-%C3%B6ncelik-1f81dff90e5f) | 2024-09-28 | TBD |
| S-03 | ⬜ | Alak Suresi 4-5: Prefrontal korteks, yapay zeka, Kuantum Dalga Fonksiyonu | [link](https://sufist.medium.com/alak-suresi-4-5-prefrontal-korteks-yapay-zeka-ve-kuantum-dalga-fonksiyonu-3b3fb3ffb076) | 2024-10-02 | TBD |
| S-04 | ⬜ | Ala Suresi 1: Tesbih ve Soyutlama | [link](https://sufist.medium.com/ala-suresi-1-tesbih-ve-soyutlama-d050517406a4) | 2025-04-16 | 3 dk |
| S-05 | ⬜ | Asr Suresinden Çıkarılan Temel Prensipler | [link](https://sufist.medium.com/asr-suresinden-%C3%A7%C4%B1kar%C4%B1lan-temel-prensipler-03ec7bfe7571) | 2025-06-10 | 5 dk |
| S-06 | ⬜ | Allahu Ekber ile Seyr İlallah: Yüzeydeki Dikkat Dağıtanlardan Kurtulma | [link](https://sufist.medium.com/allahu-ekber-ile-seyr-i%CC%87lallah-y%C3%BCzeydeki-dikkat-da%C4%9F%C4%B1tanlardan-kurtulma-48b8b9ef5ea8) | 2024-10-22 | TBD |
| S-07 | ⬜ | Kaynak ve Yüzey — Başarısız Olan Her Sistemin Ortak Yönü | [link](https://sufist.medium.com/kaynak-ve-y%C3%BCzey-ba%C5%9Far%C4%B1s%C4%B1z-olan-her-sistemin-ortak-y%C3%B6n%C3%BC-fbe8249b6b71) | 2026-02-15 | 9 dk |
| S-08 | ⬜ | Ayet: Gözlemden Hakikate Köprü | [link](https://sufist.medium.com/ayet-g%C3%B6zlemden-hakikate-k%C3%B6pr%C3%BC-398df9037c77) | 2025-12-26 | 3 dk |
| S-09 | ⬜ | Emrin Ontolojik Mahiyeti: Aktualizasyon ve İşleyiş Prensibi | [link](https://sufist.medium.com/emrin-ontolojik-mahiyeti-aktualizasyon-ve-i%C5%9Fleyi%C5%9F-prensibi-94dbf0d1a499) | 2025-12-11 | 3 dk |
| S-10 | ⬜ | Kur'an'ın Ruhsal Coğrafyası: Doğru Yoldan Sapmanın Anatomisi | [link](https://sufist.medium.com/kuran%C4%B1n-ruhsal-co%C4%9Frafyas%C4%B1-do%C4%9Fru-yoldan-sapman%C4%B1n-anatomisi-8f5ec2781b4d) | 2025-05-31 | 6 dk |
| S-11 | ⬜ | Kuran Okuma Prensiplerimiz-2 | [link](https://sufist.medium.com/kuran-okuma-prensiplerimiz-2-8e100f793b82) | 2024-09-25 | TBD |

---

## 4️⃣ Semantik Seri

Arapça kök etimoloji + Kur'ani semantik haritalama.

| # | Status | Başlık | Kök | URL | Tarih | Süre |
|---|---|---|---|---|---|---|
| L-01 | ⬜ | Semantik Analizi-1: Sefer | س ف ر | [link](https://sufist.medium.com/kuran-kavramlar%C4%B1-semantik-analizi-1-sefer-14e39ec2f8b5) | 2025-12-30 | 2 dk |
| L-02 | ⬜ | Semantik Analizi-2: Lehv | ل ه و | [link](https://sufist.medium.com/kuran-kavramlar%C4%B1-semantik-analizi-2-lehv-a4b0d061c5bd) | 2025-12-30 | 4 dk |
| L-03 | ⬜ | Semantik Analizi-3: Cennet, Cin, Mecnun | ج ن ن | [link](https://sufist.medium.com/kuran-kavramlar%C4%B1-semantik-analizi-3-cennet-cin-mecnun-60d7ee85e492) | 2026-01-01 | 4 dk |
| L-04 | ⬜ | Semantik Analizi-4: Tuğyan | ط غ و | [link](https://sufist.medium.com/kuran-kavramlar%C4%B1-semantik-analizi-4-tu%C4%9Fyan-dc65c527027b) | 2026-01-17 | 3 dk |
| L-05 | ⬜ | Siccin Nedir? Hapis mi Kitap mı? | س ج ن | [link](https://sufist.medium.com/siccin-nedir-hapis-mi-kitap-m%C4%B1-9bf6786c636f) | 2025-12-31 | TBD |

---

## 5️⃣ İdrak & Şuur

Epistemoloji + metafizik + recursive thinking + şuur kavramı serisi.

| # | Status | Başlık | URL | Tarih | Süre |
|---|---|---|---|---|---|
| I-01 | ⬜ | Inception Hayatlar: Recursive Düşüncenin Pratiği | [link](https://sufist.medium.com/inception-hayatlar-recursive-d%C3%BC%C5%9F%C3%BCncenin-prati%C4%9Fi-062dfc9c22e4) | 2026-01-08 | 4 dk |
| I-02 | ⬜ | Sonsuz Nasıl Bilinir: Yönelimsel İdrak | [link](https://sufist.medium.com/sonsuz-nas%C4%B1l-bilinir-y%C3%B6nelimsel-idrak-46bc5604100c) | 2026-01-07 | 3 dk |
| I-03 | ⬜ | Sonsuzluğun Merdiveni: Analojilerden Hakikate Yolculuk | [link](https://sufist.medium.com/sonsuzlu%C4%9Fun-merdiveni-analojilerden-hakikate-yolculuk-47bf1b2c4e9f) | 2026-01-06 | 2 dk |
| I-04 | ⬜ | Analitik İçgörü: Şuur Kavramı-3 | [link](https://sufist.medium.com/analitik-i%CC%87%C3%A7g%C3%B6r%C3%BC-%C5%9Fuur-kavram%C4%B1-3-030491b41c96) | 2025-12-27 | 5 dk |
| I-05 | ⬜ | Analitik İçgörü: Şuur Kavramı-2 | [link](https://sufist.medium.com/analitik-i%CC%87%C3%A7g%C3%B6r%C3%BC-%C5%9Fuur-kavram%C4%B1-2-19bc306fa029) | 2025-12-14 | 7 dk |
| I-06 | ⬜ | Analitik İçgörü: Şuur Kavramı-1 | [link](https://sufist.medium.com/analitik-i%CC%87%C3%A7g%C3%B6r%C3%BC-%C5%9Fuur-kavram%C4%B1-1-e407dbb34ba8) | 2025-12-14 | 4 dk |

---

## 6️⃣ Kozmoloji & Yaratılış

Yaratılış serisi + kuantum + evrim tartışmaları + kozmik tasarım.

| # | Status | Başlık | URL | Tarih | Süre |
|---|---|---|---|---|---|
| C-01 | ⬜ | Anlam, Yaratılış ve Senteninin Bariz İmzası | [link](https://sufist.medium.com/anlam-yarat%C4%B1l%C4%B1%C5%9F-ve-senteninin-bariz-imzas%C4%B1-7603c6258d4a) | 2024-12-18 | 4 dk |
| C-02 | ⬜ | Kainat Kitabının Kuantum Bölümü-1: Kuantum Mekaniğinin Beş Büyük Gizemi | [link](https://sufist.medium.com/kainat-kitab%C4%B1n%C4%B1n-kuantum-b%C3%B6l%C3%BCm%C3%BC-1-kuantum-mekani%C4%9Finin-be%C5%9F-b%C3%BCy%C3%BCk-gizemi-da8b2a32c69e) | 2024-12-07 | TBD |
| C-03 | ⬜ | Yaratılış Hikayesi-2: Kainatın Katmanlı Yaratılışı | [link](https://sufist.medium.com/yarat%C4%B1l%C4%B1%C5%9F-hikayesi-2-kainat%C4%B1n-katmanl%C4%B1-yarat%C4%B1l%C4%B1%C5%9F%C4%B1-d0092bf22e39) | 2025-07-27 | 5 dk |
| C-04 | ⬜ | Yaratılış Hikayesi-1: Giriş | [link](https://sufist.medium.com/yarat%C4%B1l%C4%B1%C5%9F-hikayesi-1-giri%C5%9F-7815b3c43fa9) | 2025-07-27 | 2 dk |
| C-05 | ⬜ | Evrim, İnanç ve Aklımızdaki Resimler | [link](https://sufist.medium.com/evrim-i%CC%87nan%C3%A7-ve-akl%C4%B1m%C4%B1zdaki-resimler-4e897972ba7e) | 2025-10-25 | 4 dk |
| C-06 | ⬜ | Evrim dinsizliği yayma projesidir! | [link](https://sufist.medium.com/evrim-dinsizli%C4%9Fi-yayma-projesidir-bd6e09e1e90d) | 2025-05-14 | 4 dk |
| C-07 | ⬜ | Hala mı Evrim? | [link](https://sufist.medium.com/hala-m%C4%B1-evrim-e8e19c3bdae9) | 2024-11-12 | TBD |

---

## 7️⃣ İngilizce Yayınlanan Çalışmalar

Türkçe karşılığı varsa **bilingual çift**, yoksa standalone English makale.

| # | Status | Başlık | URL | Tarih | TR eşi |
|---|---|---|---|---|---|
| E-01 | ⬜ | Contemporary Quran Readings: Emergence, Irreducibility, and Meaning | [link](https://sufist.medium.com/contemporary-quran-readings-emergence-irreducibility-and-meaning-a03bece5d9e8) | 2024-12-21 | — (yeni İngilizce sentez) |
| E-02 | ⬜ | Meaning, Creation, and the Telltale Signature of Synteny | [link](https://sufist.medium.com/meaning-creation-and-the-telltale-signature-of-synteny-dd38b009e4bf) | 2024-12-18 | C-01 (Anlam Yaratılış Senteni) |
| E-03 | ⬜ | The Five Biggest Mysteries in Quantum Mechanics | [link](https://sufist.medium.com/the-five-biggest-mysteries-in-quantum-mechanics-exploring-realitys-deepest-questions-9db3732b2707) | 2024-12-07 | C-02 (Kuantum Beş Gizemi) |
| E-04 | ⬜ | A New Cosmology: Understanding Existence Through Three Worlds | [link](https://sufist.medium.com/a-new-cosmology-understanding-existence-through-three-worlds-834410a56e07) | 2024-12-02 | T-04 (Varlıkların Ayna Oluşu) yakın |
| E-05 | ⬜ | Physicalism and Its Fragility | [link](https://sufist.medium.com/physicalism-and-its-fragility-7977a4a9b6c0) | 2024-11-27 | T-03 (Fizikalizmin Kırılganlığı) |
| E-06 | ⬜ | Our Principles for Reading the Quran — Part 2: Hermeneutic | [link](https://sufist.medium.com/our-principles-for-reading-the-quran-part-2-hermeneutic-d7ec6be130a1) | 2024-10-12 | S-11 (Okuma Prensipleri 2) |
| E-07 | ⬜ | Our Principles for Reading the Quran — Part 1: Epistemic | [link](https://sufist.medium.com/our-principles-for-reading-the-quran-part-1-epistemic-32ef2f8cd62e) | 2024-10-12 | — (Part 1 TR eşi yok?) |
| E-08 | ⬜ | Contemporary Quran Readings-1: Local and Global Perspectives | [link](https://sufist.medium.com/contemporary-quran-readings-1-local-and-global-perspectives-324c4e09e1e3) | 2024-10-11 | T-01 (Terminoloji 1) |

> Not: 6 İngilizce makalede Türkçe eş tespit edildi. Site i18n pattern'ı: makale slug aynı, content TR/EN sürümü.

---

## 4. 🎨 Visualization Strategy — Per-Template Sistem

> ### 🔑 ANA PRENSİP — Medium'daki Görselliği DAHA İYİSİ İLE Yansıtmak (ENFORCE ALWAYS)
>
> Felsufi'nin Medium makalelerindeki **şemalar, ağaç diyagramları, kalıp tabloları,
> akış grafikleri, karşılaştırma kutuları metnin entelektüel omurgasıdır**.
> Bunları sadece metin olarak özetlemek = makaleyi **yarım taşımak**.
>
> Kural: Bir makaleyi migrate ederken Medium'da bulunan **her görsel yapıyı**
> (tree, table, flowchart, ikili karşılaştırma, halka diyagram, infografik) Quran
> Codex'in **brand-içi karşılığı ile** zenginleştirilmiş hâlde yeniden inşâ et.
> Hiçbir koşulda Medium'dan ham resim/screenshot kopyala-yapıştır YAPMA.
>
> **Yaklaşım — 3 Strateji:**
>
> 1. **Dinamik/Canlı Veri Grafikleri** — kavram zincirleri, semantik ilişkiler için
>    interaktif SVG flowchart'lar (hover-parlama, framer-motion stagger reveal).
>    Örn: *İstiğnâ → Tuğyân → Tâğût* zinciri → `FlowChain` component.
> 2. **Premium Bilgi Kartları** — Medium'daki düz tabloları glassmorphism +
>    altın çerçeveli "Analitik Odak Kutuları" olarak yeniden tasarla. Verse
>    referansları chip-pill (verse-graph link'li). Örn: 7-row tuğyan morfoloji
>    tablosu → `MorphologyTable` component.
> 3. **Dark-Mode Şemalar** — açık-renk Medium grafiklerini site paletine
>    (cosmic-black + gold + purple) uyarlanmış minimalist SVG tree olarak yeniden
>    çiz. Örn: Anlam Hiyerarşisi ağacı → `HierarchyTree` component.
>
> **Component Library (Phase 3'te eklendi):**
>
> | Component | Kullanım | Veri şekli |
> |---|---|---|
> | `HierarchyTree` | Kök kavramdan dallanan anlam ağacı | `root + branches[{children[{subChildren}]}]` |
> | `MorphologyTable` | Arapça kalıp + anlam + ayet kalıp tablosu | `rows[{ar, patternTr, meaningTr, verses[]}]` |
> | `FlowChain` | Yatay 3+ node nedensellik akışı | `nodes[{ar?, titleTr, tone}]` (trigger/state/outcome) |
> | `ContrastDuo` | İki-kutuplu karşılaştırma (ENE↔TABİAT, Kalp↔Kuru çekirdek) | `left + right + bridge?` |
> | `RootHero` | Semantik makaleler için kök display | `root + derivatives[]` |
> | `SeriesTimeline` | Seri içi pozisyon | `seriesLabel + currentNumber + total` |
> | `VerseInline` | Tek ayet inline kartı | `ref + noteTr/En` |
> | `PullQuote` | Vurgu alıntısı | `tr + en + source` |
>
> **Test:** Bir makale Medium'da N görsel içeriyorsa, Quran Codex versiyonu da
> N veya N+1 görsel block içermelidir (matching rule). Görsel sayısı kontrol
> edilmeden makale "tam" sayılmaz. `_index.json`'da `mediumVisualsMatched: N/N`
> alanı opsiyonel — eksik makaleler kolay tespit için.

> ### 🔑 KURAL — Ayet Referansı Formatı (ENFORCE ALWAYS)
>
> Tüm görsel block'larda ve inline ayet kartlarında, ayet referansları
> **sûre adı + numara** formatında gösterilmelidir.
>
> **TR (Türkçe sayfa):**
> - ✅ DOĞRU: `Bakara 2:8`, `Nâziât 79:17`, `Hâkka 69:11`
> - ❌ YANLIŞ: `2:8`, `79:17`, `69:11` (sadece numerik — okuyucu sûre adını bilmek zorunda)
>
> **EN (İngilizce sayfa):**
> - Kabul: `2:8`, `79:17` (numerik — İngilizce sûre-isim listesi şu an yok)
> - Gelecek: `next/src/lib/surahNames.js`'e `SURAH_NAMES_EN` eklendiğinde
>   format → `Al-Baqarah 2:8`
>
> **Implementasyon (helper):**
> ```js
> import { surahNameTr } from '@/lib/surahNames';
> function formatVerseRef(ref, language) {
>   if (language !== 'tr') return ref;
>   const m = /^(\d+):/.exec(ref);
>   if (!m) return ref;
>   const fullName = surahNameTr(parseInt(m[1], 10));
>   const short = fullName.replace(/^E[lnstrz]-/i, '').replace(/^Eş-/i, ''); // artikelsiz
>   return `${short} ${ref}`;
> }
> ```
>
> Kullanan komponentler: `MorphologyTable.jsx`, `VerseInline.jsx`. Yeni
> ayet-içeren komponent eklenirken bu helper kullanılmalıdır.

> ### 🔑 KURAL — Makale Sayım Politikası (Bilingual)
>
> **Bir makaleyi sayarken TR + EN versiyonları AYRI sayılmaz.** Aynı içeriğin
> iki dildeki versiyonu **tek bir makale**dir.
>
> **Mevcut durum (master listeye göre):**
>
> | Kategori | TR | EN-only | Toplam unique |
> |---|---|---|---|
> | Kavramsal Tahlil | 5 | 0 | 5 |
> | Terminoloji Serisi | 8 | 0 | 8 |
> | Sûre & Hermenötik | 11 | 0 | 11 |
> | Semantik Seri | 5 | 0 | 5 |
> | İdrak & Şuur | 6 | 0 | 6 |
> | Kozmoloji & Yaratılış | 7 | 0 | 7 |
> | **EN-only** (TR çifti yok) | — | 2 (E-01, E-07) | 2 |
> | **TOPLAM** | **42 TR** | **2 EN-only** | **44 unique** |
>
> Ayrıca 6 bilingual çift mevcut: C-01↔E-02, C-02↔E-03, T-03↔E-05, T-01↔E-08,
> T-04↔E-04, S-11↔E-06. Bu çiftler bir kez sayılır.
>
> **Navbar / Index banner gösterimi:**
> - ✅ "44 makale" (unique kavram sayısı)
> - ❌ "49 makale" (TR + EN ayrı sayım = yanlış)
> - ❌ "50 makale" (her ID ayrı sayım)
>
> Yeni makale eklendiğinde: `_index.json`'a entry eklenir; Navbar'daki
> `tefekkurCategories` count'ları manuel güncellenir; bilingual eş varsa
> `englishVersion: "E-XX-slug"` frontmatter alanı kullanılır (gelecek).

> ### 🔑 KURAL — Kök Çoklu-Alomorf Gösterimi
>
> Arapça **defektif kökler** (lām hareketli — son harfi و/ي arası değişen)
> birden fazla alomorf formunda görünür. Felsufi'nin Medium analizleri her iki
> formu da gösterir. JSON'da `root.letters` alanı **tüm alomorfları** içermelidir.
>
> **Örnekler:**
> - ط غ و / ط غ ي (tuğyan kökü — ṭ-ḡ-w / ṭ-ḡ-y)
> - س ع ي / س ع و (sefer/saʿy potansiyel alomorf)
> - ر م ي / ر م و (atma fiili)
>
> **DOĞRU:**
> ```json
> "root": {
>   "letters": "ط غ و / ط غ ي",
>   "transliteration": "ṭ-ḡ-w / ṭ-ḡ-y",
>   ...
> }
> ```
>
> **YANLIŞ:**
> ```json
> "letters": "ط غ و",         // tek alomorf — eksik
> "transliteration": "ṭ-ḡ-w / ṭ-ḡ-y"  // translit'te iki ama Arapça'da tek
> ```
>
> Hem `RootHero` (sayfa üstü büyük kök) hem `HierarchyTree` (root node)
> aynı alomorf string'ini kullanmalı (drift yok).
>
> Üçlü kökler (sahih) için bu kural geçersizdir — tek form yeterli (ج ن ن, ر ح م, vb.).

> ### 🔑 KURAL — Tefekkür Tipografi Değerleri (ENFORCE ALWAYS)
>
> Tefekkür makaleleri uzun-form okuma için optimize edildiğinden, font değerleri
> sitenin geri kalanından **bilinçli olarak biraz daha büyük** kullanılır.
> CLAUDE.md §4 body spec'i (1.1rem, line-height 1.8) baz alınmış; tek-sütun
> essay layout için micro-adjusment yapılmıştır.
>
> **Doğrulanmış değerler (2026-05-31 audit):**
>
> | Element | Değer | Bileşen | Karşılaştırma — site geri kalanı |
> |---|---|---|---|
> | **Body paragraph** | `fontSize: 1.08rem` · `lineHeight: 1.85` | `ArticleRenderer.Paragraph` | Hero subtitle `clamp(0.95-1.06rem)`, lineHeight 1.7 — Tefekkür ~%2 büyük + %8 daha açık satır |
> | **H1 (article title)** | `fontSize: clamp(1.8rem, 4vw, 2.6rem)` · weight 700 | `TefekkurArticleRoute h1` | ToolsHighlight heading `clamp(1.8rem, 4vw, 2.75rem)` — pratik olarak aynı |
> | **H2 (section heading)** | `fontSize: 1.55rem` · weight 700 | `ArticleRenderer.SectionHeading` | Yok — Tefekkür'e özgü (long-form section breaks) |
> | **TLDR (italic)** | `fontSize: 1.05rem` · italic · silver | `TefekkurArticleRoute tldr p` | Uyumlu, Hero subtitle ile aynı bant |
> | **Drop cap (ilk paragraf)** | `fontSize: 3.6rem` · gold · Playfair | `ArticleRenderer.Paragraph isFirst` | Yok — uzun-form ritüel |
> | **Disclaimer / criticalNote body** | `fontSize: 0.82-0.85rem` · italic | `TefekkurArticleRoute disclaimer` + `CriticalNote` | Card body ile aynı bant (`0.82rem`) |
>
> **Yeni Tefekkür component'i eklerken:**
>
> - Body paragraph **`1.08rem`**'i geçmemeli (long-read upper bound)
> - Section heading **`1.55rem`**'in altına düşmemeli (visual hiyerarşi)
> - Drop cap SADECE ilk paragrafta uygulanır (per article)
> - Mobil için clamp veya `@media` ile shrink: H1 zaten `clamp` kullanıyor; body için ekstra shrink gereksiz (1.08rem mobilde ~17.3px = WCAG min'in 9px üstünde)
>
> **Sebep:** Medium ortalaması ~1.125rem (18px); biz ondan biraz altta ama site
> ortalamasından üstte — uzun-form ile kart yoğunluğu arası bir denge.

> ### 🔑 KURAL — "Kur'an" Yazımı (ENFORCE ALWAYS)
>
> Site genelinde "Kur'an" **her zaman kesme işaretiyle** yazılır. Felsufi metninde
> "Kuran" (apostrofsuz) geçse de migration sırasında "Kur'an" olarak yazılır.
>
> - ✅ DOĞRU: "Kur'an'da", "Kur'an mesajı", "Kur'an kavramları"
> - ❌ YANLIŞ: "Kuran'da", "Kuran mesajı", "Kuran kavramları"
>
> İngilizce metinlerde: "the Quran" veya "the Qur'an" — site standardı **"Quran"**
> (apostrofsuz, EN). Bu yalnızca Türkçe için bağlayıcıdır.
>
> Uygulama: Felsufi metninden alıntı yaparken bile bu transliterasyon
> normalize edilir — yazarın orijinal başlığında "Kuran Kavramları Semantik
> Analizi" yazsa da JSON title alanı **"Kur'an Kavramları Semantik Analizi"**
> olur. Bu içerik bozma değil, site içi tutarlılık kuralı (CLAUDE.md §11 ile
> uyumlu).

> ### 🔑 KURAL — Epistemic Disclaimer Sistemi (ENFORCE ALWAYS)
>
> Site brand integrity'sini koruyup Felsufi'nin **özgün okumalarını klasik tefsir
> konsensüsü ile karıştırmamak** için 3 katmanlı şeffaflık sistemi:
>
> #### Katman 1 — Uniform Top Disclaimer (HER MAKALEDE)
>
> Her Tefekkür makalesinin TLDR + meta-row'undan sonra, ana içerik başlamadan
> önce silver bordürlü kutu otomatik render edilir. Kaynak:
> `next/src/app/[locale]/tefekkur/[slug]/TefekkurArticleRoute.jsx`
>
> Metin (TR):
> > ⓘ *Bu makale **Felsufi'nin özgün bir okuma denemesi**dir. Klasik tefsir
> > geleneğinden farklı yaklaşımlar — tasavvufî yorum, modern bilim ile sentez,
> > Risale-i Nur perspektifi — içerebilir. Alternatif yorumlar mevcuttur; bu
> > metin tek doğru okuma iddiasında değildir.*
>
> **Bu route-level olduğundan JSON'a eklenmez** — her yeni makale otomatik alır.
> Disclaimer'ı bir makaleden gizlemek istersek route'a explicit flag eklenir
> (`article.skipDisclaimer === true`). Default: **her makale disclaimer alır.**
>
> #### Katman 2 — Inline `criticalNote` Block (TARTIŞMALI PASAJLARDA)
>
> Felsufi'nin **klasik tefsirden açıkça ayrışan** ya da **modern eisegesis** içeren
> pasajları için, ilgili paragraph'tan sonra `criticalNote` block'u eklenir:
>
> ```json
> {
>   "type": "criticalNote",
>   "headingTr": "Alternatif okuma — <konu>",
>   "headingEn": "Alternative reading — <topic>",
>   "tr": "Felsufi burada <X> önerir. Ancak <klasik konsensüs> <Y> der. <referans>...",
>   "en": "Here Felsufi proposes <X>. However, <classical consensus> says <Y>. <reference>..."
> }
> ```
>
> Görsel: altın sol-bordür + ✱ ikon + uppercase başlık + italic body
> (`CriticalNote` component — `ArticleRenderer.jsx`).
>
> **`criticalNote` ne zaman eklenir?**
>
> - **Eisegesis** (metne dışarıdan modern kavram sokma) — örn. "prefrontal korteks
>   = Kalem", "kuantum wave function = Levh-i Mahfûz"
> - **Spekülatif etimoloji** — klasik dilciler kurmadığı bağlantı (örn. *Sicill ↔
>   Siccîn* L/N ebdâl)
> - **Sect-specific framework** — Risale-i Nur / Nurcu perspektifi olduğu açık olan
>   pasajlar (diğer İslâmî ekoller paylaşmayabilir)
> - **Minority interpretive view** — klasik müfessir çoğunluğundan ayrılan modern
>   görüş (örn. *alak ≠ kan pıhtısı*, İsmail Yakıt 2003)
> - **Modern bilim sentezi** — Constructor Theory, machine learning vb. kavramların
>   Kur'ânî terimlere bağlanması
>
> **`criticalNote` ne zaman eklenmez?**
>
> - Klasik Lane / Mufradât etimolojisi
> - Mainstream tefsir konsensüsü
> - Tartışmasız Quranic referanslar
> - Felsufi'nin sadece **sunum** yaptığı (yorumlama içermeyen) pasajlar
>
> #### Katman 3 — Index Banner Epistemic Callout (/tefekkur)
>
> Index sayfasında, hero callout subtitle'ından sonra **altın bordürlü standalone
> kutu** — 3 chip (`Kişisel sentezler` · `Alternatif okumalar` · `Tasavvufî
> perspektif`) + açıklama satırı. Kullanıcı **makaleye girmeden önce** sitenin
> epistemik tutumunu görür.
>
> #### Bu Kural Neden Var?
>
> Sitenin geri kalanı (MathMiracle, ScientificSigns, HistoricalProof) `criticalNote`
> ve metodolojik nüans flag'leri ile inşâ edilmiş (bkz. CLAUDE.md §6). Tefekkür
> makaleleri **aynı epistemik disiplini** sürdürmeli — yoksa Felsufi'nin
> spekülatif tezleri site brand'inin akademik kalitesini geriye çeker.
> Disclaimer + criticalNote sistemi bu disiplini sağlar.

> ### 🔑 KURAL — Felsufi Metnine Sadıklık (No Hallucination — ENFORCE ALWAYS)
>
> Yazara ait makalede **bulunmayan yorum, tefsir, veya açıklama eklenmez.**
> Migration sürecinde her JSON alanı için:
>
> - **VerseInline `noteTr/noteEn`**: SADECE Felsufi'nin kullandığı meal + (varsa)
>   Felsufi'nin o ayet için yazdığı yorum. Genel Kur'an retoriği bilgisi (örn.
>   *kallā* formülü, *vemâ edrâke* kalıbı), klasik tefsir notu, "dikey ayna" gibi
>   bizim framing'imiz **eklenmez**.
> - **sources**: SADECE Felsufi'nin metninde referans verdiği eser/kavram/kişiler.
>   Klasik müfessir veya lexicon ekleme yasak (örn. Felsufi al-Mufradât'a referans
>   vermiyorsa, biz de eklemeyiz).
> - **tldr**: Felsufi'nin **açılış cümlesi + kendi tezinin özeti**nden türetilir;
>   bizim sentez/reframing'imizle değil.
> - **Görsel block'lar** (hierarchyTree, flowChain, contrastDuo, morphologyTable):
>   görsel yapı brand uyumu için bizim olabilir — AMA içindeki tüm
>   label / subtitle / bullet / bridge metinleri **Felsufi'nin kelime dağarcığından**
>   çıkmalıdır. "Kayıt Kozmolojisi" gibi bizim sentezimiz olan üst-kavramlar
>   kullanılmaz; Felsufi "çift anlamlı ifade" diyorsa biz de onu kullanırız.
> - **section başlıkları**: Felsufi'nin başlık formülasyonunu birebir korur —
>   numara + ":" formatına da müdahale etmez (örn. "1. Tabaka: Arapça Literal").
>
> **Test**: Bir JSON alanı için "bunu Felsufi mi yazdı, yoksa ben mi ekledim?"
> sorusunun cevabı **"ben ekledim"** ise → kaldır veya Felsufi'nin sözüne dönüştür.
>
> **Pratik akış (Playwright extraction yapıldıktan sonra):**
> 1. `next/qc-fetch-medium.mjs <URL>` ile tam metni çek (36+ blok)
> 2. Her JSON alanı için kaynak metinde **anchor cümle** bul
> 3. Anchor yoksa → alanı boş bırak veya çıkar
> 4. Görsel block'lar sadece **kategorize eder**, yorum ÜRETMEZ
>
> **Sebep:** WebFetch fair-use kısıtlamasıyla özet veriyor → Playwright tam metin
> getiriyor. Özet üzerinden JSON üretmek halüsinasyon riski taşır; Playwright
> sonrası tam metne sadıklık zorunlu.

> ### 🔑 KURAL — VerseInline'da Ref Tekrar Yasağı
>
> `VerseInline` kartında badge zaten sûre adı + numarayı gösterir
> (örn. "Hâkka 69:11"). **Not metninde aynı referansı tekrar yazmak redundant'tır.**
>
> ❌ YANLIŞ:
> ```json
> "ref": "69:11",
> "noteTr": "Hâkka 69:11 — 'Su tuğyan ettiğinde...' Burada tuğyan fiziksel..."
> ```
>
> ✅ DOĞRU (üç seçenek):
> ```json
> // Seçenek A — direkt ayet alıntısıyla başla
> "noteTr": "'Su tuğyan ettiğinde (taşıp haddi aşınca) sizi gemide taşıdık.' Burada tuğyan fiziksel..."
>
> // Seçenek B — context cümlesi
> "noteTr": "Hz. İbrâhîm kıssasında gece, örten/saklayan bir perde olarak janna fiiliyle ifade edilir..."
>
> // Seçenek C — sadece yorum
> "noteTr": "Nuh tufanında suyun doğal sınırını aşması. Tuğyan kavramı fiziksel taşkınlık anlamında..."
> ```
>
> **Component-level fix (Phase 3):** `VerseInline.jsx` artık note başındaki
> `<sûre-adı> <ref> — ` prefix'ini regex ile otomatik strip eder. Mevcut JSON'ları
> değiştirmeye gerek yok; gelecekteki note'lar yine de prefix'siz yazılmalı (clean data).

Frontend renderer makale MDX frontmatter'ındaki `template` alanına göre uygun layout'u seçer.

### Template A — **Quote-Driven Long Read** (Kavramsal + İdrak)
Uygulanan makaleler: K-01..K-05, I-01..I-06

**Hero:**
- Eyebrow: kategori adı + makale numarası
- Title: Playfair display 2-2.5rem
- Subtitle italic (varsa tldr)
- Decorative Islamic geometric pattern arka planda (%5 opacity)
- Meta row: yazar · okuma süresi · yayın tarihi · Medium kanonik link

**Body:**
- Section dividers: gold gradient stripe + section title
- **Pull-quote dividers:** Büyük italic statement'lar — gold border, Playfair italic 1.5-1.8rem
- **Analogy infographics:** Spesifik analojiler için inline SVG (termostat, yakıt göstergesi, X→∞)
- **Ayet inline cards:** Her ayet referansı → emerald-bordered card, Arapça + meal + "Reading Mode'da aç" link
- **Practical checklist:** Makale pratik adım veriyorsa highlighted box
- **Hadith quote cards:** Farklı border rengi (Quranic'ten ayrı)

**Sidebar (desktop):**
- "Bu yazıda geçen N ayet" — ayet collection card
- Related tools cross-link
- Series prev/next

### Template B — **Series Hero + Diagram** (Terminoloji + Kozmoloji)
Uygulanan: T-01..T-07d, C-01..C-07

**Hero:**
- **Series indicator badge:** "TERMİNOLOJİ SERİSİ · 4/7" — büyük, gold border, progress dot indicator
- Title: Playfair display + serial subtitle
- Meta + reading time + Medium link
- **Series timeline mini:** Sayfa üstünde 7-dot timeline gösterimi (aktif olan yanar)

**Body:**
- **Conceptual diagram hero:** İlgili kavram için inline SVG (örn. Terminoloji 4 "Varlıklar Ayna" için mirror diagram)
- Section dividers
- **Cross-reference series cards:** "Bu seride şu kavramlar geçti →" prev sections linkler
- **Forward refs:** "Sonraki: Markov Blanket" sneak peek

**End-of-article:**
- **Series navigation:** Büyük prev/next kartları (full title preview)
- Series index page link

### Template C — **Sûre Tefsir** (Sûre & Hermenötik)
Uygulanan: S-01..S-11

**Hero:**
- Eyebrow: "SÛRE TEFSİRİ · ALAK 96"
- Title: Playfair display
- **Büyük Arapça ayet hero:** Sûrenin merkez ayeti — 2.5-3rem KFGQPC, gold-bordered elevated card
- Meal italic altta
- **"Tam sûreyi oku" gold pill CTA** → Reading Mode deep link (`/oku/96`)
- Meta row + sûre position ("Sûre 96 / 30. cüz / Mekkî / 19 ayet")

**Body:**
- **Verse-by-verse breakdown:** Her ele alınan ayet → elevated card pattern (TabBaglam'da kullanılan), Arabic + meal + tefsir
- **Cross-surah reference:** "Bu konu şu sûrede de geçer →" diğer sûrelere kart link
- **Bilimsel/tarihsel callout box** (Alak 4-5'te prefrontal korteks gibi)
- **Concept badge:** Key kavramlar → ConceptGraph deep link

**Sidebar:**
- "Reading Mode'da bu sûre" — direct link
- "Sebebi Nüzul" → SebebiNuzul deep link
- "Bu sûre Bilimsel İşaretler'de" (ScientificSigns)
- Diğer Sûre Tefsirleri (S kategorisi başkalarına link)

### Template D — **Root Tree** (Semantik Seri)
Uygulanan: L-01..L-05

**Hero:**
- Eyebrow: "SEMANTİK ANALİZ · #4"
- Title: Playfair display
- **Büyük root hero:** 3-letter Arabic root (örn. ج ن ن) — 5-6rem KFGQPC, gold + glow + decorative islamic frame
- Altta derived form chips (cennet · cin · mecnun) — emerald accent
- Meta row

**Body:**
- **Etymology branching diagram:** Inline SVG showing root → derivatives, interactive (hover highlight)
- **Verse occurrence bar chart:** "Tuğyan N ayette geçer" mini görsel
- **Semitic cognates compare table:** Hebrew / Aramaic / Ugaritic karşılaştırma
- **Quranic citation cards:** Inline elevated card pattern
- **Concept badge:** İnline kavram → ConceptGraph deep link
- **Risale-i Nur quote** (varsa) → distinguished left-bordered block

**Sidebar:**
- "Bu kökü ConceptGraph'ta gör" CTA
- "Semantik Serisinde diğer kökler" — L kategorisi navigation
- Lane Lexicon / al-Mufradat referansları

### Universal patterns (her template'te ortak)

1. **Reading progress bar** — sayfa üstü gold gradient (mevcut `ScrollProgress.jsx` reuse)
2. **Inline ayet preview** — `<VerseInline ref="96:6-7" />` → hover/tap WordPopover (mevcut pattern)
3. **Sticky TOC sidebar** (desktop only) — sol kolon, current section highlighted
4. **Related tools cross-link** — sonunda "Bu makale şu araçlarla zenginleşir" 3-card grid
5. **Series navigation** — seri ise üstte "Seri N/M" + alt prev/next
6. **Theme/typography toggle** — fontsize, day/night
7. **Decorative Islamic geometric** — background %5 opacity (mevcut design system)
8. **Bottom actions** — paylaş, Medium kanonik git, Tefekkür index'e dön

### MDX Format

```mdx
---
slug: tugyan
title: "Semantik Analizi-4: Tuğyan"
category: semantik
seriesId: semantik-analizi
seriesNumber: 4
seriesTotal: 4
template: root-tree
publishedDate: 2026-01-17
readingMinutes: 3
author: { name: "Felsufi", url: "https://sufist.medium.com" }
canonicalUrl: "https://sufist.medium.com/kuran-kavramlar%C4%B1-semantik-analizi-4-tu%C4%9Fyan-e08920551065"
relatedTools: ["concept-graph", "verse-graph"]
relatedVerses: ["96:6-7", "55:8", "69:11"]
crossRefs:
  - { type: "previous", slug: "cennet-cin-mecnun" }
  - { type: "series", slug: "sefer" }
tldr: "Tuğyan: kök etimoloji + Kur'ani örüntü + epistemoloji"
englishVersion: null  # E-XX slug'ı varsa
---

<RootHero root="ط-غ-و" forms={["taga", "tugyan", "tagi"]} />

## Kök Etimoloji
<VerseInline ref="69:11" />
Tuğyan kelimesi...

<PullQuote author="Risale-i Nur">
  Tuğyanın sebebi gaflettir.
</PullQuote>
```

---

## 5. 🚀 Pilot Seçim Önerisi (4 + 2)

**4 template, 6 pilot** — her template için 1, en yüksek-impact makaleler:

| Pilot | ID | Template | Neden seçildi |
|---|---|---|---|
| **Tuğyan** | L-04 | Root Tree | Semantik prototip; ConceptGraph entegrasyonu test |
| **Alak Suresi 1** | S-01p | Sûre Tefsir | Pinned status, Reading Mode deep link test |
| **Ruhun Termostatı** | K-01 | Quote-Driven | En uzun makale (12 dk), long-read layout stress test |
| **Terminoloji 7 (Kader)** | T-07p | Series Hero | Pinned + series indicator test |
| **Sonsuz Nasıl Bilinir** | I-02 | Quote-Driven (kısa) | En kısa makale (3 dk), short-form test |
| **Yaratılış Hikayesi 1** | C-04 | Series Hero (Kozmoloji) | Yaratılış serisi entry-point, kozmoloji template test |

Bu 6 canlıya alındıktan sonra kalan 43 makale batch-import scripti ile MDX'e dönüştürülür.

---

## 6. 🛠️ Frontend Infrastructure To-Do

- [ ] **Navbar update** — 3. menu item "Tefekkür" eklenmesi (`Navbar.jsx`)
  - Dropdown: 7 kategori + "Tüm Yazılar" + "Yazar Hakkında"
- [ ] **`/tefekkur` route** — index page (kategori filter + makale grid)
- [ ] **`/tefekkur/[slug]` route** — article page (MDX rendering)
- [ ] **MDX setup** — `@next/mdx` veya `next-mdx-remote` kurulum
- [ ] **JSON-LD schemas** — Article + Breadcrumb + Author (Person schema for Felsufi)
- [ ] **Sitemap güncelleme** — 49 makale URL'i
- [ ] **i18n pattern** — `/tr/tefekkur/[slug]` + `/en/tefekkur/[slug]` (bilingual destek)
- [ ] **Inline JSX components:**
  - `<VerseInline ref="X:Y" />` — hover ayet preview
  - `<RootHero root="ج-ن-ن" forms={...} />` — büyük root display
  - `<RootTree root="..." derivatives={[...]} />` — branching diagram
  - `<PullQuote author="..." source="...">...</PullQuote>` — museum quote
  - `<CalloutBox type="caveat|info|warning|hadith">...</CalloutBox>`
  - `<RelatedToolCard tool="concept-graph" />`
  - `<SeriesNav seriesId="..." position={4} total={7} />`
  - `<SurahCTA surah={96} />` — Reading Mode pill button
  - `<ConceptDiagram concept="..." />` — interactive concept map
- [ ] **Sticky TOC component** — desktop sidebar
- [ ] **Reading progress bar** — mevcut `ScrollProgress.jsx` reuse
- [ ] **Theme/typography toggle** — fontsize + day/night
- [ ] **Author profile page** — `/tefekkur/yazar/felsufi` (bio + tüm makaleleri)

---

## 7. ⚖️ Yazar İzni & Lisans (Mutlaka)

Migration başlamadan önce yazardan açık izin alınmalı:

- [ ] Yazılı izin (`docs/permissions/felsufi-tefekkur-license.md`)
- [ ] Lisans modeli seçimi: CC BY-SA / kişisel atıf / publisher agreement
- [ ] Her makale altında "İlk olarak Medium'da yayımlandı" badge (görünür)
- [ ] HTML `<link rel="canonical" href="medium-url">` (SEO)
- [ ] Yazar profil sayfası: bio + Medium / X / kişisel site linkleri

---

## 8. 🔗 Cross-Reference Haritası

Makaleler arası iç bağlantılar — site-içi URL'lere çevirilirken referans:

### Terminoloji serisi (sırayla)
T-01 → T-02 → T-03 → T-04 → T-05 → T-06 → T-07p → T-07d

### Semantik serisi (sırayla)
L-01 (Sefer) → L-02 (Lehv) → L-03 (Cennet-Cin-Mecnun) → L-04 (Tuğyan)

### Şuur serisi (sırayla)
I-06 (Şuur 1) → I-05 (Şuur 2) → I-04 (Şuur 3)

### Sonsuzluk üçlemesi (sırayla)
I-03 (Sonsuzluğun Merdiveni) → I-02 (Sonsuz Nasıl Bilinir) → I-01 (Inception Hayatlar)

### Yaratılış serisi
C-04 (Yaratılış 1) → C-03 (Yaratılış 2)

### Alak Suresi serisi
S-01p (Alak 1) → S-02 (Alak 2-3) → S-03 (Alak 4-5)

### Kader serisi
T-07p (Kader Terminoloji 7) → T-07d (Kader devam)

### Evrim grubu (içerik bağlantılı)
C-05 (Evrim İnanç) · C-06 (Evrim Dinsizlik) · C-07 (Hala mı Evrim?)

### Bilingual çiftler
- C-01 ↔ E-02 (Synteny)
- C-02 ↔ E-03 (Kuantum Gizemler)
- T-03 ↔ E-05 (Physicalism)
- T-01 ↔ E-08 (Local/Global)
- T-04 ↔ E-04 (yakın: 3 Worlds)
- S-11 ↔ E-06 (Hermeneutic)

---

## 9. 📊 Migration Tracking Summary

| Toplam | Status | Dağılım |
|---|---|---|
| **49 makale** | ⬜ Tümü beklemede | TR: 41 · EN: 8 · Series: 32 · Standalone: 17 |
| **Tahmini süre** | ~50 saat | Pilot 4-6 makale (15h) + kalan 43 batch import (20h) + infra (15h) |

---

## 10. 📝 Change Log per Article

> Bu bölümde her makale için yapılan düzeltmeler (typo, dilbilgisi, Arapça encoding, kavram düzeltme) biriktirilecek.

### K-01 Ruhun Termostatı
_(taslak henüz hazırlanmadı)_

### K-02 Enerji Krizi
_(taslak henüz hazırlanmadı)_

### K-03 Yapılanların Süslü Görülmesi
_(taslak henüz hazırlanmadı — Web fetch sırasında: minor em-dash inconsistency)_

### K-04 Vicdan: Evrensel Tercümanımız
_(taslak henüz hazırlanmadı)_

### K-05 Kur'an Mesajına Yabancı Kalmak
_(taslak henüz hazırlanmadı)_

### T-07p Terminoloji 7: Kader
_(taslak henüz hazırlanmadı)_

### T-07d Kaderin Çözünürlüğü devam
_(taslak henüz hazırlanmadı)_

### T-06 Terminoloji 6: Sema ve İsim
_(taslak henüz hazırlanmadı)_

### T-05 Terminoloji 5: Makro Mikro
_(taslak henüz hazırlanmadı)_

### T-04 Terminoloji 4: Varlıkların Ayna Oluşu
_(taslak henüz hazırlanmadı)_

### T-03 Terminoloji 3: Fizikalizm
_(taslak henüz hazırlanmadı)_

### T-02 Terminoloji 2: Parçalanamaz Bütünler
_(taslak henüz hazırlanmadı)_

### T-01 Terminoloji 1: Lokal/Global
_(taslak henüz hazırlanmadı)_

### S-01p Alak Suresi 1
_(taslak henüz hazırlanmadı)_

### S-02 Alak Suresi 2-3
_(taslak henüz hazırlanmadı)_

### S-03 Alak Suresi 4-5
_(taslak henüz hazırlanmadı)_

### S-04 Ala Suresi 1: Tesbih
_(taslak henüz hazırlanmadı)_

### S-05 Asr Suresi Prensipleri
_(taslak henüz hazırlanmadı)_

### S-06 Allahu Ekber ile Seyr İlallah
_(taslak henüz hazırlanmadı)_

### S-07 Kaynak ve Yüzey
_(taslak henüz hazırlanmadı)_

### S-08 Ayet: Gözlemden Hakikate
_(taslak henüz hazırlanmadı)_

### S-09 Emrin Ontolojik Mahiyeti
_(taslak henüz hazırlanmadı)_

### S-10 Kur'an Ruhsal Coğrafyası
_(taslak henüz hazırlanmadı)_

### S-11 Kuran Okuma Prensipleri 2
_(taslak henüz hazırlanmadı)_

### L-01 Semantik 1: Sefer
_(taslak henüz hazırlanmadı)_

### L-02 Semantik 2: Lehv
_(taslak henüz hazırlanmadı)_

### L-03 Semantik 3: Cennet-Cin-Mecnun
_(taslak henüz hazırlanmadı)_

### L-04 Semantik 4: Tuğyan
_(taslak henüz hazırlanmadı)_

### L-05 Siccin Nedir?
_(taslak henüz hazırlanmadı)_

### I-01 Inception Hayatlar
_(taslak henüz hazırlanmadı)_

### I-02 Sonsuz Nasıl Bilinir
_(taslak henüz hazırlanmadı)_

### I-03 Sonsuzluğun Merdiveni
_(taslak henüz hazırlanmadı)_

### I-04 Şuur 3
_(taslak henüz hazırlanmadı)_

### I-05 Şuur 2
_(taslak henüz hazırlanmadı)_

### I-06 Şuur 1
_(taslak henüz hazırlanmadı)_

### C-01 Anlam Yaratılış Senteni
_(taslak henüz hazırlanmadı — Web fetch sırasında: "senteninin" → muhtemelen "synteny'nin" — kontrol edilecek)_

### C-02 Kuantum Beş Gizemi
_(taslak henüz hazırlanmadı)_

### C-03 Yaratılış 2: Katmanlı
_(taslak henüz hazırlanmadı — Web fetch sırasında: "Cem'den Fark'a" tutarsız punctuation)_

### C-04 Yaratılış 1: Giriş
_(taslak henüz hazırlanmadı)_

### C-05 Evrim İnanç Aklımızdaki Resimler
_(taslak henüz hazırlanmadı)_

### C-06 Evrim Dinsizliği Yayma
_(taslak henüz hazırlanmadı — yazar notu: "deliberately unpolished" — minimal edit önerilir)_

### C-07 Hala mı Evrim?
_(taslak henüz hazırlanmadı)_

### E-01 Contemporary Quran Readings (Emergence)
_(taslak henüz hazırlanmadı)_

### E-02 Synteny (EN)
_(taslak henüz hazırlanmadı)_

### E-03 Five Mysteries (EN)
_(taslak henüz hazırlanmadı)_

### E-04 New Cosmology (EN)
_(taslak henüz hazırlanmadı)_

### E-05 Physicalism Fragility (EN)
_(taslak henüz hazırlanmadı)_

### E-06 Hermeneutic (EN)
_(taslak henüz hazırlanmadı)_

### E-07 Epistemic (EN)
_(taslak henüz hazırlanmadı)_

### E-08 Contemporary 1: Local/Global (EN)
_(taslak henüz hazırlanmadı)_

---

## 11. ⚠️ Açık Sorular (Karar Bekleyen)

1. **Yazar izni:** Felsufi sen mi (yazar sen misin), yoksa ayrı yazar mı? Yazılı izin var mı?
2. **MDX vs JSON:** Yukarıda MDX önerdim (inline JSX component'ler için) — onaylıyor musun?
3. **Bilingual scope:** TR-only / TR+EN parallel / TR-default + EN-where-exists?
4. **Pilot scope:** §5'teki 6 pilot mantıklı mı, farklı seçim mi tercih edersin?
5. **Visualization detayı:** §4'teki 4 template prototip onayı — daha fazla detay ister misin?
6. **Navbar konumu:** "Tefekkür" sağa mı (EN/Kur'an'ı Oku öncesi) sola mı (Keşfet/Araçlar yanına)?

Onayını alır almaz infra to-do'ya geçiyorum (§6).

---

## 🎯 AÇIK İŞ — 34 makalenin özetinde vurgu yok (2026-08-13)

Kartlardaki `tldr` metinleri markdown'ı **artık render ediyor** (önce ham
basılıyordu, literal `**` görünüyordu). Render düzelince tutarsızlık ortaya çıktı:

| Durum | Adet |
|---|---|
| Kalın vurgu **hiç yok** | **34** |
| 3+ vurgu (iyi) | 18 |
| Arada (1-2) | 0 |

Ya tamamen var ya tamamen yok — çünkü vurgulu olan 18'i son dönemde yazıldı,
kalan 34'ü daha eski ve o dönem `tldr`'lar düz metin yazılmış. **Bilinçli bir
tercih değil, biriken tutarsızlık.**

- [ ] 34 makalenin `tldrTr` + `tldrEn` metinlerine vurgu ekle
- [ ] ⚠ **Bu mekanik bir dönüşüm DEĞİL** — her özette hangi 3-4 kavramın öne
      çıkacağına karar vermek gerekir. Yanlış kelimeyi vurgulamak hiç
      vurgulamamaktan kötüdür. Toplu regex ile yapılmamalı.
- [ ] Vurgusuz olanlar: `yapilanlarin-suslu-gorulmesi`, `emrin-mahiyeti`,
      `ayet-koprusu`, `analitik-icgoru-1..3`, `sonsuzlugun-merdiveni`,
      `okuma-prensipleri-1..2`, `alak-suresi-1`, `alak-suresi-2-3`,
      `sonsuz-nasil-bilinir` … (tam liste için:
      `node -e` ile `_index.json` üzerinde `tldrTr` içinde `**` araması)
