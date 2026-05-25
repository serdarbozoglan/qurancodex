# SEO Post-Deploy Audit (2026-05-24)

Canlı production domain'i `https://qurancodex.com` üzerinde, deploy sonrası SSR HTML
çıktıları `curl -sL` ile çekilip parse edilerek üç başlık denetlendi:

- W23-S4 — Heading Hierarchy (H1/H2/H3 sıralaması, atlama tespiti)
- W23-S5 — hreflang URL Inspection (TR / EN / x-default üçlüsü + canonical)
- W23-S10 — Open Graph Locale (`og:locale` değeri)

Tüm fetch'ler 200 OK döndü; redirect'ler `-L` ile takip edildi.

---

## Özet

| Audit | Sonuç | Not |
|---|---|---|
| W23-S4 Heading Hierarchy | UYARI | 7/8 route temiz. Sadece `/tr` homepage'de 4 yerde H2->H4 ve 1 yerde H4->H5 atlaması; tool route'ları (overlay yapısı gereği) SSR'da yalnızca H1 sunuyor — beklendik. |
| W23-S5 hreflang | TAMAM | 8/8 route TR + EN + x-default üçlüsünü doğru URL'lerle sunuyor. Canonical URL'leri hreflang `tr` değerleriyle birebir uyuşuyor. |
| W23-S10 OG Locale | TAMAM | 8/8 sample (4 TR + 4 EN) — `/tr/*` route'ları `tr_TR`, `/en/*` route'ları `en_US` döndürüyor. `pageMetadata` helper canlı SSR çıktısında doğru çalışıyor. |

---

## S4 — Heading Hierarchy

Her route SSR HTML'i Python `html.parser` ile parse edildi, H1-H6 sayıldı ve
heading sıralarında `prev + 1 < curr` atlaması arandı.

| Route | H1 | H2 | H3 | H4 | H5 | Toplam | Atlama |
|---|---:|---:|---:|---:|---:|---:|---|
| `/tr` | 1 | 17 | 50 | 8 | 4 | 80 | H2->H4 ("Hz. İbrahim"), H3->? (yok, sadece kategorileme), H4->H5 (footer alt-kategoriler) |
| `/tr/oku/1` | 1 | 0 | 0 | 0 | 0 | 1 | yok (tool route, overlay hidrasyon ekliyor) |
| `/tr/atlas/kissa` | 1 | 0 | 0 | 0 | 0 | 1 | yok |
| `/tr/atlas/peygamber` | 1 | 0 | 0 | 0 | 0 | 1 | yok |
| `/tr/graf/ayet` | 1 | 0 | 0 | 0 | 0 | 1 | yok |
| `/tr/graf/kavram` | 1 | 0 | 0 | 0 | 0 | 1 | yok |
| `/tr/arac/wow` | 1 | 0 | 0 | 0 | 0 | 1 | yok |
| `/tr/kaynakca` | 1 | 1 | 7 | 0 | 0 | 9 | yok |

### Bulgular

- **Her route 1 ve sadece 1 H1.** Bu doğru. Tool route'larında H1 server-side
  `PageHeading` üzerinden `sr-only` olarak render ediliyor (Faz 16.12 pattern'i
  korunmuş).
- **Tool route'ları (oku / atlas / graf / arac)** SSR'da sadece H1 sunuyor;
  H2/H3 hiyerarşisi hydration sonrası client overlay'de eklenir. SEO açısından
  H1'in tek başına server-rendered olması yeterli, bu beklendik davranıştır.
- **`/tr/kaynakca`** ideal şablonu sergiliyor: 1 H1, 1 ana H2, 7 kategori H3.

### `/tr` Homepage Anormallikleri

Anasayfada heading dizisi 80 başlık içeriyor; aşağıdaki noktalarda hiyerarşi
atlama yapıyor:

1. **idx 28-29: H2 "Rabbena ile Başlayan 40+ Dua" -> H4 "Hz. İbrahim"**
   - Kaynak: `next/src/sections/QuranDua.jsx`
   - Satır 204: `<motion.h2>` — bölüm başlığı
   - Satır 532: `<h4>` — peygamber kartı (Hz. İbrahim, Hz. Eyyub, vd.)
   - Sorun: H2'den doğrudan H4'e atlanıyor; H3 ara katmanı yok.

2. **idx 39-40: H3 "Tek Ayet, Yedi Evren" -> H4 "Fiziksel"**
   - Kaynak: `HiddenArchitecture.jsx` (Nur ayeti çoklu katman kartları)
   - Sorun: Aynı şekilde H3'ten H4'e geçişten önce H4 doğrudan kart başlığı
     olarak kullanılıyor; bu *kabul edilebilir* (H3->H4 sıralı geçiş). Aslında
     burada atlama YOK; doğru sırada. Tabloda parser çıktısı bu segmenti
     `Level skips` listesinde göstermedi.

3. **idx 48-49: H3 "Yazılı Koruma" -> H4 "Birmingham El Yazması"**
   - Kaynak: `LivingPreservation.jsx`
   - Sıralı geçiş; atlama yok.

4. **idx 54-57: H3 "Tekrar: Eksiklik mi, Tasarım mı?" -> H4 (üç adet)**
   - Kaynak: `ZeroRedundancy.jsx` (klasik tefsir bölümü)
   - Sıralı geçiş; atlama yok.

5. **idx 74-78: H3 "Quran Codex" -> H4 "Sayfaları Keşfet" -> H5 (Atlas/Graf/Araçlar/Sureler)**
   - Kaynak: `Footer.jsx` (satır 112 H3, 146/177 H4, 154 H5)
   - Sıralı geçiş; atlama yok.

### Gerçek Atlama (Sadece 1 Yer)

Parser tarafından tespit edilen tek **gerçek hiyerarşi atlaması**:

```
H2 "Rabbena ile Başlayan 40+ Dua"  (QuranDua.jsx:204)
   |
   v  (H3 YOK)
H4 "Hz. İbrahim"                    (QuranDua.jsx:532)
```

### Fix Önerisi (S4)

Tek aksiyon edilebilir bulgu `QuranDua.jsx`:532 satırındaki peygamber kartı
başlığıdır. Önerilen iki seçenek:

**Seçenek A (önerilen):** Peygamber kartı başlığını `h4` -> `h3`'e çevir.

```jsx
// next/src/sections/QuranDua.jsx:532
<h3 style={{ color: p.emojiColor, fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>
  {tr ? p.nameTr : p.nameEn}
</h3>
```

Görsel boyut (1.3rem) ve stilizasyon değişmez — sadece semantik level düşer.
Bu, mevcut section'daki diğer H3 başlıklarıyla (örn. "Dua'nın Anatomisi — Dört
Aşama", satır 649) tutarlı olur.

**Seçenek B:** H4'leri korumak istiyorsan, peygamber kartlarının üstüne grup
başlığı olarak görünmez (sr-only) bir H3 ekle. Daha karmaşık ve gereksiz
markup üretir; A önerilir.

Diğer tüm H4/H5 oluşumları sıralı geçişin parçasıdır — fix gerekmez.

---

## S5 — hreflang URL Inspection

Her TR route'da `<link rel="alternate" hreflang="...">` tag'leri parse edildi.
Beklenen üçlü: `tr`, `en`, `x-default`. Ayrıca canonical link `tr` href'i ile
karşılaştırıldı.

| Route | tr | en | x-default | Canonical = tr? |
|---|---|---|---|---|
| `/tr` | OK | OK | OK | EVET |
| `/tr/oku/1` | OK | OK | OK | EVET |
| `/tr/atlas/kissa` | OK | OK | OK | EVET |
| `/tr/atlas/peygamber` | OK | OK | OK | EVET |
| `/tr/graf/ayet` | OK | OK | OK | EVET |
| `/tr/graf/kavram` | OK | OK | OK | EVET |
| `/tr/arac/wow` | OK | OK | OK | EVET |
| `/tr/kaynakca` | OK | OK | OK | EVET |

### Detaylı URL'ler (örnek)

```
/tr/atlas/kissa:
  canonical:                   https://qurancodex.com/tr/atlas/kissa
  hreflang="tr":               https://qurancodex.com/tr/atlas/kissa
  hreflang="en":               https://qurancodex.com/en/atlas/kissa
  hreflang="x-default":        https://qurancodex.com/tr/atlas/kissa
```

### Bulgular

- 8/8 route üçlü hreflang'i tam ve doğru URL ile sunuyor.
- `x-default` her sayfa için TR varyantına işaret ediyor — bu, projenin
  Türkçe-default kuralıyla (`/.claude/CLAUDE.md` ve §3) uyumlu.
- Canonical URL her sayfada `tr` hreflang değerine bire bir eşit; alternate
  ve canonical arasında çelişki yok.
- Extra/beklenmedik hreflang değeri yok (örn. `tr-TR`, `en-US` veya başka
  region varyantları).

### Fix Önerisi (S5)

Aksiyon gerekmiyor. `pageMetadata` helper (`next/src/lib/seo.js`) doğru
çalışıyor; tüm sample route'larda hreflang triple'ı eksiksiz.

---

## S10 — Open Graph Locale

`pageMetadata` helper'ı `locale === 'en' ? 'en_US' : 'tr_TR'` ile `og:locale`
set ediyor. Canlı sayfalarda gerçek meta tag'i ölçüldü.

| Route | Beklenen | Gelen | Sonuç |
|---|---|---|---|
| `/tr` | tr_TR | tr_TR | OK |
| `/tr/oku/1` | tr_TR | tr_TR | OK |
| `/tr/atlas/kissa` | tr_TR | tr_TR | OK |
| `/tr/arac/wow` | tr_TR | tr_TR | OK |
| `/en` | en_US | en_US | OK |
| `/en/oku/1` | en_US | en_US | OK |
| `/en/atlas/kissa` | en_US | en_US | OK |
| `/en/arac/wow` | en_US | en_US | OK |

### Bulgular

- 8/8 sample doğru `og:locale` değerine sahip.
- `og:locale:alternate` tag'i sample'larda gözlemlenmedi — bu opsiyonel bir
  alan; eksikliği Facebook/Twitter paylaşımlarında sorun çıkarmaz çünkü her
  iki dilin kendi sayfası kendi `og:locale`'ini doğru sunuyor ve hreflang
  cross-link'leri zaten var.
- `pageMetadata` helper'ın production'da doğru çalıştığı doğrulandı.

### Fix Önerisi (S10)

Aksiyon gerekmiyor. İsteğe bağlı bir iyileştirme: `pageMetadata`'ya
`og:locale:alternate` da eklenebilir (TR sayfada `en_US`, EN sayfada `tr_TR`).
Bu Facebook OG protokol önerisidir, kritik değildir. Şu anki implementation
kabul edilebilir.

---

## Fix Önerileri Özeti

| Bulgu | Dosya | Aksiyon | Öncelik |
|---|---|---|---|
| QuranDua peygamber kartı H4 -> H3 | `next/src/sections/QuranDua.jsx:532` | `<h4>` -> `<h3>` (görsel stil aynı kalır) | Düşük-Orta |
| og:locale:alternate eklemek | `next/src/lib/seo.js` (`pageMetadata`) | Opsiyonel iyileştirme | Düşük |

Diğer alanlarda aksiyon gerekmiyor. Heading hierarchy genelinde sağlıklı, hreflang
ve OG locale production'da düzgün üretiliyor.

---

## Audit Methodology Notu

- Tüm fetch'ler `curl -sL` ile yapıldı; HTTP 308 redirect'leri (örn. `/tr` ->
  trailing slash veya middleware redirect) takip edildi.
- Parser olarak Python stdlib `html.parser.HTMLParser` kullanıldı; `<script>`
  ve `<style>` içerikleri başlık sayımına dahil edilmedi.
- Tool route'ları (atlas/graf/arac/oku) overlay UI'ı client-side hidrasyondan
  sonra render eder — bu yüzden SSR HTML'inde yalnızca `PageHeading`'in H1'i
  görünür. Bu davranış §16.5 ve §16.12 pattern'leriyle uyumlu, kabul edilebilir.
- Live URL: `https://qurancodex.com` — production deployment 2026-05-24
  itibariyle.
