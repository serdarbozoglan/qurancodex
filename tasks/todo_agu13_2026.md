# ✅ ANASAYFA — YAPILACAKLAR

> Kaynak: 13 Ağustos 2026 Playwright ölçümü + GPT-5.5 hakem turu.
> Ölçümü tekrarla: `cd next && npx playwright test tests/homepage-audit.spec.js --project=desktop`

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

## 🟠 P4 — Ritim (P2 kararına bağlı, ~yarım gün)

- [ ] **Üç kademeli kart ritmi tasarla**
  - Şu an 13 kart 852–931px bandında (%9 fark), tek istisna `allah-kendini-tanitir` 1314px
  - Ağır: küme başına 1 (mevcut `FeaturedWrap`) — tam genişlik, diyagram taşısın
  - Orta: ~6 — mevcut 760px format
  - Hafif: ~5 — iki sütunlu kompakt çift
- [ ] Kademeleri önce statik mockup olarak doğrula, sonra kodla

---

## 🟠 P5 — `<PortalCard>` bileşeni (P4'e bağlı, ~1 gün)

- [ ] **Ortak bileşen çıkar — SERVER COMPONENT olarak**
  - Şu an: 14 dosya, 2.603 satır, ortak bileşen yok
  - Şu an: **14/14 kart `'use client'`** + her biri `framer-motion` → 14 hydration adası
  - Props: `{ eyebrow, title, verseAr, verseTr, blurb, href, accent, weight }`
  - Animasyonu tek bir ince client sarmalayıcıya devret (`FeaturedWrap` benzeri)
  - Hedef: 14 hydration adası → 1
- [ ] 14 dosyayı sil, yerine 14 veri nesnesi koy
- [ ] ⚠ **P4'ten önce yapma** — monoton yapıyı bileşene çimentolar

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
- [ ] **Göç adım 3:** en yüksek frekanslı renkleri `SEMANTIC`/`CATEGORY`'ye map et
- [ ] **Göç adım 4:** anasayfayı temizle — 18 hex → 2 surface + 2 text + 1 border
      + 1 scripture gold + max 3 kategori
- [ ] **Göç adım 5-7:** kategorileri `CATEGORY`'ye bağla, status ayır, kalan rogue'ları sil
- [ ] `audit-colors.mjs --ci` pre-merge kontrolüne eklensin

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
      İki yarı aralıkla değil **tonla** ayrışıyor (QURAN altın, CODEX kırık beyaz);
      harf aralığı (tracking .12–.18em) optik nefesi zaten veriyor
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

- [ ] **19 `<h2>` çok** — kart başlıklarının bir kısmını `h3`'e indir
- [ ] **CLAUDE.md §4 palet tablosu koddan kopmuş** — 10 renk listeliyor, `tokens.js`'te 48 var; tablodan üret
- [ ] P4 sonrası: `MobileSectionChipNav` / `DesktopSidebarTOC` / `ScrollToTopFab` üçü de hâlâ gerekli mi, gözden geçir

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
