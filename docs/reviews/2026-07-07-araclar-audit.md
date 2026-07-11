# Araçlar Sistemi — Kapsamlı Denetim & TODO Listesi

**Tarih:** 2026-07-07
**Kapsam:** `ToolsBrowser` modal (`/arac/tum-araclar`), Navbar "Araçlar" dropdown, `src/data/tools.jsx` katalog, `TOOL_ROUTES` mapping, tüm `/arac/*` `/atlas/*` `/graf/*` route'ları
**Amaç:** Araçlar keşif katmanının içerik envanteri, UX tutarlılığı, erişilebilirlik, tasarım hijyeni ve bilingual parity açısından tam denetimi + önceliklendirilmiş TODO listesi.

---

## 1. ROUTE ENVANTERİ vs. KATALOG — Kritik Boşluk

### 1.1 Rota Sayıları
| Klasör | Fiziksel Route Sayısı | Notlar |
|---|---|---|
| `/arac/*` | **28** | Utility / thematic tool sayfaları |
| `/atlas/*` | **14** | Atlas / harita türü sayfalar |
| `/graf/*` | **7** | Graf / network / karşılaştırma sayfaları |
| **TOPLAM** | **49** | (opengraph-image.jsx dosyaları hariç) |

### 1.2 Katalog Sayıları
| Kaynak | Görünen Tool | Notlar |
|---|---|---|
| `data/tools.jsx` FEATURED_TOOLS | **2** | Kur'an'ı Tanı, Esmâ-i Hüsnâ |
| `data/tools.jsx` VIZ_TOOLS | **6** | Ayet Haritası, Nüzul Sırası, Kelime Haritası, Kıssa Atlası, Mesel Atlası, Kıraat Atlası |
| `data/tools.jsx` ANALYSIS_TOOLS | **6** | Furûk, Kavram Ağı, Sûre DNA, Münâsebât, Muhatap Sistemi, Diyalog Ağı |
| `data/tools.jsx` RESEARCH_TOOLS | **5** | Sebeb-i Nüzul, Peygamberler, Emirler, Dualar, Kadınlar |
| **TOPLAM** | **19** | ToolsBrowser + Navbar dropdown ikisinde de aynı liste |

### 1.3 Boşluk
**49 route − 21 unique katalog route = 28 tool KEŞFEDİLEMEZ durumda.**

Bu 28 sayfa yalnızca (a) cross-tool CTA linklerinden, (b) doğrudan URL paylaşımından, (c) Google araması sonucundan erişilebilir. Ne ToolsBrowser modal'ında ne Navbar dropdown'unda ne de Anasayfa `ToolsHighlight` section'ında listelenmiyorlar. 

### 1.4 Katalog Dışı Tool Listesi (28 sayfa)
**`/arac/*` alanında katalog dışı (17 sayfa):**
- alti-konu
- bilimsel-isaretler
- cennet-cehennem
- dua-dili
- halka-kompozisyon
- iblis-seytan
- kiyamet
- koruma-zinciri
- melekler
- mukattaa
- renkler
- retorik (⚠ retorik-sorular ile duplicate şüphesi)
- ritim
- ses-mimarisi
- tarihsel-kanitlar
- tekrar-anatomi
- yeminler
- zaman-boyutlari
- wow (⚠ kurani-tani ile duplicate şüphesi)

**`/atlas/*` alanında katalog dışı (4 sayfa):**
- doga (Doğa Atlası)
- insan-psikolojisi
- insan-tanimi
- munafik (Münâfık Profili)
- nefs-mertebeleri
- sunnetullah (Sünnetullah Atlası)
- kavim (Kavimler Atlası)

**`/graf/*` alanında katalog dışı (1 sayfa):**
- semantik (Semantik Arama)

> **Not:** Bazıları menü altındaki "Tefekkür / Keşfet" gibi başka drawer'larda listelenmiş olabilir — ama Araçlar menüsündeki eksiklik gerçek. Kullanıcı "Araçlar → Tüm Araçlar" akışında yalnızca 19 kart görüyor, 28 sayfa gizli kalıyor.

---

## 2. `data/tools.jsx` — Katalog Kalite Denetimi

### 2.1 İçerik Sayı Yanılgıları
Katalog metinlerindeki bazı sayı iddiaları güncel/eski kalmış:
- `KissaAtlas` "4 peygamber" diyor — ama audit raporunda 25 peygamber olduğu belirtiliyor (yanlışlıkla küçültülmüş açıklama).
- `Kadınlar Atlası` "7 figür" diyor — Meryem/Asiye/Havva/Belkıs/Sara/Musa'nın annesi/İmran eşi. Doğru mu, listede var mı?
- `Emirler` "88 emir ve yasak" — kaynak ne, güncel mi?
- `Dua Ayetleri` "Kur'an'dan seçilmiş dualar" — DuaVerses browser'da 50 dua var; ayrıca yeni bir `/arac/dua-dili` sayfası var (Dalga 2.1'de üretildi) — katalog güncellenmedi.

### 2.2 Duplicate Route/Etki Şüphesi
- `openWowFacts` → `/arac/kurani-tani` (main route)
- **AMA** `/arac/wow` diye ayrı bir route de var. Duplicate mi, legacy mi?
- `openIblisSatan` → `/arac/iblis-seytan` (catalog dışı ama route var)
- **AMA** `/arac/retorik` vs. `/arac/retorik-sorular` — hangi tool'a hangi route? Belirsiz.

### 2.3 EKSİK Icon
Yalnızca inline SVG kullanılıyor (StarIcon, VerseGraphIcon, ...). Yeni tools için icon oluşturma pattern'i mevcut ama katalog dışı 28 tool için:
- Icon component'ı yok (tarihsel-kanitlar, bilimsel-isaretler, ses-mimarisi, ritim, halka-kompozisyon, mukattaa, tekrar-anatomi, alti-konu, cennet-cehennem, kiyamet, melekler, iblis-seytan, ...)
- Katalog'a eklenirlerse hepsi için icon üretilmeli.

---

## 3. `ToolsBrowser` Modal — UX Denetimi

### 3.1 Header × Butonu Yumuşak
Modal header'da × close button (`CLOSE_BTN`) kullanılıyor. ESC + backdrop click de kapatıyor. İyi ✓.
- ❌ ARIA-label var mı? `aria-label={language === 'tr' ? 'Kapat' : 'Close'}` — evet var ✓
- ❌ `role="dialog"` + `aria-modal="true"` + `aria-labelledby` — var ✓
- ❌ Focus trap? İncelenmedi. Eğer yok ise Tab keyboard nav modal dışına kaçabilir.

### 3.2 Search Input
Input'un yerleştirilmesi (line 218-272): iyi tasarım. Ama:
- ❌ Turkish diacritic-insensitive değil. "kissa" araması "kıssa" başlıklı tool'u bulamaz (uppercase/lowercase + `ı`↔`i` sorunu).
  - Test: `haystack.includes(q)` line 134 → basit substring match.
  - Fix: `normalizeTr(str).includes(normalizeTr(q))` kullanılmalı (ConceptGraph'ta `normalizeTr` fonksiyonu var, oradan import edilebilir).
- ❌ Empty result mesajı yok. Kullanıcı "xyz" yazınca kart alanı boş, hiçbir "eşleşen tool yok" mesajı görünmüyor.
- ❌ Search input'a `autoFocus` verilmemiş — modal açıldığında kullanıcı önce Tab veya mouse ile input'a gitmeli.

### 3.3 Popular Search Chips
`POPULAR_TR = ['dua', 'esma', 'kıssa', 'peygamber', 'ayet', 'mucize']`
- "mucize" araması `descLongTr` içinde geçen tool'ları bulmalı ama içerikte "mucize" kelimesi çok yaygın olmayabilir. Test edilmeli.
- "esma" araması yalnızca Esmâ-i Hüsnâ'yı bulur — teşvik edici değil.
- ❌ i18n JSON'a taşınmadı, hardcoded. `POPULAR_TR/EN` sabit array'ler.

### 3.4 Filter Bar
3 filtre (Tümü / Görselleştirme / Analiz / Araştırma) — sadece 3 kategori. Kullanıcı bu kategori isimlerini duyunca ne bekleyeceğini bilmiyor.
- ❌ "Görselleştirme" nedir? "Analiz & Veri" ile "Araştırma & Keşif" arasında fark nedir?
- ❌ Hover'da tooltip yok, açıklama yok.
- ❌ Kategori kartlar arasında görsel ayrım az — filtre değiştirince yalnızca kart sırası değişiyor.

### 3.5 BigToolCard — Görsel Hijyen
- ✓ Icon badge, title, descLong yerleşimi temiz.
- ❌ Hover state (`translateY(-2px) + shadow`) güzel ama title rengi `COLORS.gold`'a atlıyor — açıklamada da renk değişimi. Consistent mi?
- ❌ Kart yüksekliği: `minHeight: 170px` — açıklaması uzun tool'larda taşma? Grid `alignItems: stretch` var ✓.
- ❌ Kart tıklama alanı: tüm kart clickable ✓.
- ❌ Klavye: Tab ile geziyor mu? Card `<button>` element olduğundan ✓ evet.

### 3.6 FeaturedBanner (Vitrin)
2 featured tool (Kur'an'ı Tanı + Esmâ-i Hüsnâ) modal en üstünde belirir.
- ❌ Sadece "Tümü" view'da görünüyor (line 298). Kullanıcı Görselleştirme filtresine geçince featured'lar kayboluyor, kafa karıştırıcı.
- ❌ Featured banner'lar 2 tane ama görsel olarak ayrılmıyorlar — yan yana mı, alt alta mı? Test edilmeli.
- ❌ Görsel olarak `BigToolCard`'lardan çok farklı değil, "featured" hissi zayıf.

### 3.7 Grid Layout — Mobil
- `isMobile ? '1fr' : 'repeat(2, 1fr)'` → mobilde tek kolon ✓
- Kart yükseklik + padding + font-size mobilde küçültülmüyor. Tam ekran mobil kullanıcı için kart yığını çok uzun scroll gerektirir.
- Filter chip'leri mobilde wrap ediyor, iyi ✓.

### 3.8 Modal Boyutlandırma
- `width: min(1080px, 92vw)` ✓
- `maxHeight: 88vh` — masaüstünde OK; mobilde 88vh yeterli ama landscape (yatay) telefon için sıkışabilir.
- ❌ Body içi scroll dışında dış scroll'un lock'ı `document.body.style.overflow` ile — SSR-safe değil (window bağımlı).

### 3.9 Erişilebilirlik Rapor Kartı
| Öge | Durum | Not |
|---|---|---|
| `role="dialog"` | ✓ | Line 170 |
| `aria-modal="true"` | ✓ | Line 171 |
| `aria-labelledby` | ✓ | Line 172, `tools-browser-title` |
| Focus trap | ❓ | Kod okumaması gerekli — `useFocusTrap` hook kullanılmıyor. Muhtemel eksik. |
| Focus return on close | ❌ | Kapanınca önceki focused element'e dönmüyor. |
| Klavye navigasyon | ✓ | Tab çalışıyor, button'lar var |
| Search input autoFocus | ❌ | Yok |
| ESC to close | ✓ | Line 81 |
| Backdrop click to close | ✓ | Line 149 |
| Reduced motion | ❌ | Framer motion `prefers-reduced-motion` respect etmiyor |
| Color contrast | ❓ | `silverAlpha70` üzeri text — WCAG AA test edilmeli |

---

## 4. Navbar "Araçlar" Dropdown — UX Denetimi

### 4.1 Görünüm
Dropdown 6-column mega-menu (dropdownStyle) → 3 kategoriye yayılmış 19 tool.
- ✓ Featured tool (Kur'an'ı Tanı) yukarıda vurgulu
- ✓ 3 sütun: Görselleştirme (6), Analiz (6), Araştırma (5)

### 4.2 Sorunlar
- ❌ Featured tool sadece 1 gösteriliyor (line 1162: `dropdownFeatured = featuredTools.slice(0, 1)`) — Esmâ-i Hüsnâ vitrin listede yok!
- ❌ 19 tool listesi zaten tüm listeye eşit → "Tüm Araçlar" CTA modal'a taşımanın gerçek değeri filtreleme + search + featured emphasis. Navbar dropdown zaten tümünü gösteriyor, bu modal'ın değerini seyreltiyor.
- ❌ Dropdown çok yüksek — 19 tool + 3 header üst üste → laptop 13"ekranda alt kesim / clip riski.
- ❌ Katalog dışı 28 tool dropdown'da da yok.

---

## 5. Anasayfa `ToolsHighlight` Section — Denetim

### 5.1 Sabit Liste
`sections/ToolsHighlight.jsx` inline `FEATURED_TOOLS` array'inde 6 tool var (Esmâ, Ayet Haritası, Peygamberler, Sebeb-i Nüzul, Kıssa, ...). Bu liste `data/tools.jsx`'ten import ETMİYOR — kendi hard-coded array'i.

### 5.2 Sorun
- ❌ Drift potansiyeli: `data/tools.jsx`'te Esmâ-i Hüsnâ vitrin banner değiştirilse, `ToolsHighlight` güncellenmez. İki farklı vitrin listesi paralel.
- ❌ Section iconları inline SVG — `data/tools.jsx`'teki icon componentleri yerine tekrar tanımlanmış.
- ❌ "Tüm Araçlar" CTA link URL'i? Kontrol edilmeli.

---

## 6. Site-Wide Cross-Cutting Konular

### 6.1 URL Consistency
Bazı sayfalar `/arac/*` yerine `/atlas/*`'te olabilirdi (kavramsal olarak):
- `/arac/cennet-cehennem` — atlas hissiyatı, ama `/arac/` altında.
- `/arac/kiyamet` — sahne atlas'ı, `/atlas/` de uygun.
- `/arac/melekler` — melek atlas'ı.
- **Öneri:** Bir kural belirle: Atlas = kategori sistematik keşif; Arac = utility/tool. Şu anda karışık.

### 6.2 Bilingual Parity
Katalog metin alanları TR + EN dolu (spot check ✓).
- ❌ Rota isimleri tek dilli (Türkçe): `/tr/arac/dua-dili` — `/en/arac/dua-dili` de aynı slug. İngilizce kullanıcı için `/en/tool/language-of-prayer` olabilir mi? (Şu anki Next.js middleware pattern buna izin vermiyor — locale-agnostic slug.)
- ⚠ Slug parity: `/tr` ve `/en` her ikisi de aynı TR slug'ı kullanıyor. SEO açısından ideal değil.

### 6.3 Tefekkür Sayfası ile İlişki
Katalog Araçlar'a odaklı — Tefekkür (blog) makalelerinden Araçlar'a link var mı? Cross-navigation kalitesi denetlenmedi.

### 6.4 SEO
- Her tool sayfası kendi `<PageHeading>` (sr-only) + JSON-LD üretiyor ✓ (§16.3).
- ToolsBrowser modal'ının kendisi bir sayfa değil — SEO'da hiç görünmüyor. Ama `/arac/tum-araclar` route'u var, bu route hangi metadata veriyor? Gerçek bir "araçlar dizini" sayfası (arac katalog listesi) statik olarak render edilir mi? İncelenmedi.

---

## 7. TODO LİSTESİ — Önceliklendirilmiş

### 🔴 P0 — Kritik / Envanter (Discovery Bug)
Kullanıcı %57'sinin (28/49) sayfaya erişimi menüden yok. Bunu kapatmadan diğer polish anlamsız.

- [ ] **P0-1** `data/tools.jsx`'e 28 katalog dışı tool eklenir (isim + kısa desc + descLong + icon + event + route).
  - Her tool için icon component'ı üretilecek.
  - Category atanır: viz / analysis / research / **YENİ bir kategori** (thematic / özel?).
- [ ] **P0-2** Yeni kategori(ler) düşünülür: mevcut 3 kategori (Görselleştirme/Analiz/Araştırma) katalog dışı 28 tool'un çoğunu içermez. Öneri:
  - **"Tema Atlasları"**: cennet-cehennem, kiyamet, melekler, iblis-seytan, halka-kompozisyon, ritim, ses-mimarisi, renkler, doga, insan-psikolojisi, sunnetullah, munafik, kavim, insan-tanimi, nefs-mertebeleri
  - **"Dilbilim & Retorik"**: mukattaa, tekrar-anatomi, retorik-sorular, halka-kompozisyon, ilk-son-kelimeler, yeminler
  - **"Bilim & Tarih"**: bilimsel-isaretler, tarihsel-kanitlar, zaman-boyutlari, sunnetullah, koruma-zinciri
  - **"Ahlâk & İbadet"**: dua-dili, alti-konu, sebebi-nuzul (kısmen)
- [ ] **P0-3** Duplicate route'ları temizle:
  - `/arac/wow` → `/arac/kurani-tani` redirect (veya `wow` sil)
  - `/arac/retorik` vs `/arac/retorik-sorular` — hangisi active? Diğerini sil veya redirect.
- [ ] **P0-4** `FEATURED_TOOL_ESMA` (Esmâ-i Hüsnâ) Navbar dropdown'unda görünmüyor — `dropdownFeatured = featuredTools.slice(0, 1)` → `.slice(0, 2)` yap veya tümünü göster.
- [ ] **P0-5** `ToolsHighlight.jsx` inline `FEATURED_TOOLS` → `data/tools.jsx`'ten import (drift önle).

### 🟠 P1 — UX + Search
- [ ] **P1-1** Search input'a Turkish diacritic-insensitive normalize eklenir:
  ```js
  const normalize = s => s.toLowerCase().replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u');
  ```
- [ ] **P1-2** Search input `autoFocus` (modal açılınca odaklan).
- [ ] **P1-3** Empty result state: "Eşleşen araç yok — farklı bir terim dene." + öneri chip'leri.
- [ ] **P1-4** Popular search chips → i18n JSON'a taşı (`i18n/tr.json` → `toolsBrowser.popular`).
- [ ] **P1-5** Featured banner filtre değişince kalmalı (ya da vurgulu bir "Vitrin" chip'i eklenmeli).
- [ ] **P1-6** ESC ile kapama sonrası focus önceki tetikleyici butona döner (accessibility).
- [ ] **P1-7** `useFocusTrap` hook eklenir modal'a (kod tabanında var, örneğin `NefisMertebeleri.jsx` kullanıyor).
- [ ] **P1-8** Filter chip'lerine tooltip: her kategori kısa 1-satır açıklama.

### 🟡 P2 — Görsel & Tutarlılık
- [ ] **P2-1** BigToolCard hover state'inde background rengi çok soluk (`goldAlpha04` → `goldAlpha08` denenebilir).
- [ ] **P2-2** FeaturedBanner ile BigToolCard arasında daha güçlü görsel ayrım — banner'lar için farklı badge veya "✨ Vitrin" label.
- [ ] **P2-3** Modal mobile'da fullscreen mod: `<640px` ekranda `width: 100vw; height: 100vh; borderRadius: 0` → daha rahat.
- [ ] **P2-4** Search input'un placeholder + label uyumlu: `aria-label` var ama görsel label yok.
- [ ] **P2-5** Kategori header (`CategoryHeader`) — tool sayısını göster: "GÖRSELLEŞTIRME (6)" gibi.
- [ ] **P2-6** Icon renk hierarchy — 6+ farklı kategori icon'ı hepsi gold; kategoriye göre farklı gold-shade'e ayrılabilir (viz → gold, analysis → goldWarm, research → goldBright).

### 🟢 P3 — Yeni Özellikler & Polish
- [ ] **P3-1** "Son Ziyaret Edilen" satırı: localStorage'da son 3-5 ziyaret edilen tool → modal en üstünde "Kaldığın yerden devam et" band.
- [ ] **P3-2** "Rastgele Bir Araç Aç" butonu: keşif için.
- [ ] **P3-3** Grid alternatif view: dense list mode vs card mode toggle.
- [ ] **P3-4** Katalog dışı 28 tool eklenirken her tool'a bir **quality tier** ver (foundational / deep / experimental) → filter olarak da kullanılabilir.
- [ ] **P3-5** Anasayfa `ToolsHighlight`'a 6 sabit tool yerine "featured pool"dan rotating 6 (haftalık değişen) → engagement.
- [ ] **P3-6** ToolsBrowser modal içinde "keyboard shortcuts" satırı: ⌘/ (search focus), Escape (close), Enter (open selected), Arrow keys (nav).

### 🔵 P4 — İçerik Kalite & Copy
- [ ] **P4-1** Her tool'un `descLongTr` / `descLongEn` 2-3 cümle ile sınırlı → kullanıcı %60'ı ikinci cümleyi okumuyor. İlk cümle **kanca** (hook), ikinci **niçin buradasın** (payoff).
- [ ] **P4-2** Sayı iddialarını güncelle: "88 emir", "50 dua", "570 ayet", "4 peygamber (aslında 25)". Data JSON'dan çek: `duaCount` gibi runtime.
- [ ] **P4-3** Katalog kartlarında Arapça terimleri diakritli yaz: "Furûk", "Münâsebât" — hâlihazırda ✓ ama kontrol.
- [ ] **P4-4** İngilizce çevirilerinde Arapça terim italiği tutarlı: `*mufassal*`, `*fiṭra*`, `*ʿaql*` gibi. Şu anda inconsistent.

### 🟣 P5 — SEO + İnfra
- [ ] **P5-1** `/arac/tum-araclar` sayfasını statik render'a çevir: HTML'de `<ul>` içinde tüm tool link'leri (sr-only olabilir). Şu anda modal ile geliyor, Google indekslemez.
- [ ] **P5-2** Sitemap'te tüm 49 tool route listelenmiş mi? Kontrol.
- [ ] **P5-3** Cross-tool CTA (`CrossToolCTA`) coverage: her tool sayfası sonunda 2-3 ilgili tool linki var mı? Random spot check.
- [ ] **P5-4** Her tool sayfasının `<h1>` + description üstünde `<nav aria-label="Breadcrumb">Ana Sayfa > Araçlar > Tool Adı</nav>` olmalı.
- [ ] **P5-5** URL slug consistency: `sebebi-nuzul` (tirefsiz kısa) vs `insan-tanimi` (tireli). Convention seç: 2-kelime-ise-tireli.

---

## 8. Aksiyon Planı — Dalga Yapısı

**Dalga A — Envanter (P0):** Katalog boşluğu kapatılır. 28 tool eklenir. Duplicate temizlik. 3-5 gün.

**Dalga B — Search + a11y (P1):** Search normalize + focus trap + empty state + focus return. 1-2 gün.

**Dalga C — Görsel Polish (P2):** Card design + mobile modal + tooltip'ler. 1-2 gün.

**Dalga D — Yeni özellikler (P3):** Son ziyaret, rastgele tool, view toggle. 2-3 gün.

**Dalga E — İçerik + SEO (P4-P5):** Copy revizyon, statik render, sitemap audit. 2-3 gün.

---

## 9. Ölçütler — Tamamlandı Kabul Edilmesi İçin

- ✅ Kullanıcı ToolsBrowser'dan **49 rotanın hepsine** en fazla 2 tıkla ulaşabiliyor.
- ✅ Search Turkish-insensitive; "kissa" araması "Kıssa Atlası"nı buluyor.
- ✅ Modal fullscreen mobil'de kullanılabilir (landscape dahil).
- ✅ Focus trap aktif; ESC sonrası önceki butona focus dönüyor.
- ✅ Duplicate route yok; her tool tek bir kanonik URL'de.
- ✅ ToolsHighlight + Navbar + ToolsBrowser üçünde de aynı tool listesi (drift yok).
- ✅ Sitemap 49 tool içeriyor + tüm tool sayfaları Google Search Console'da indexed.
- ✅ Anlık A/B: kullanıcının ilk keşfettiği tool sayısı öncekine göre +100% (analytics gerekli).
