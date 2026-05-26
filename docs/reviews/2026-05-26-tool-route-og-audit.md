# Tool Route OG Image — Kapsama Denetimi & Tematizasyon Önerisi

**Tarih:** 2026-05-26
**Kapsam:** `next/src/app/[locale]/{atlas,graf,arac}/*` — tool route'larında `opengraph-image.jsx` kapsama analizi
**Mod:** Audit-only (implementation YAPILMADI)
**Önceki ilgili audit:** `docs/reviews/2026-05-26-per-prophet-og-image-audit.md`

---

## 1. Özet

| Kategori | Tool route sayısı | Özelleştirilmiş OG | Default cascade'e düşen |
|---|---|---|---|
| `atlas/*` | 12 | 1 (`peygamber/[id]`) | 12 |
| `graf/*` | 7 | 0 | 7 |
| `arac/*` | 16 | 0 | 16 |
| **TOPLAM** | **35** | **1 dinamik** | **35 statik tool route'u jenerik karta düşüyor** |

Her kategorinin **segment-level** kartı (`atlas/opengraph-image.jsx`, `graf/...`, `arac/...`) sağlam. Sosyal paylaşımda 35 tool route'u "QURAN CODEX · ATLAS / GRAF / ARAÇLAR" jenerik kartı ile görünüyor — kart başına diferansiyasyon yok.

---

## 2. Mevcut OG Image Envanteri

| Route | OG var? | Locale parity | Pre-gen / Runtime | Notlar |
|---|---|---|---|---|
| `/[locale]` (root) | EVET | TR/EN | Edge runtime + cache | Brand kartı |
| `/[locale]/oku/[surah]` | EVET | TR/EN | Edge runtime + cache | Per-surah (114) |
| `/[locale]/atlas/` (cascade) | EVET | TR/EN | Edge runtime + cache | Kategori kartı |
| `/[locale]/atlas/peygamber/[id]` | EVET | TR/EN | Edge runtime + cache | 4 peygamber, accent color per-prophet |
| `/[locale]/graf/` (cascade) | EVET | TR/EN | Edge runtime + cache | Kategori kartı |
| `/[locale]/arac/` (cascade) | EVET | TR/EN | Edge runtime + cache | Kategori kartı |

**Toplam özelleştirilmiş OG: 4** (root + oku + 3 kategori) + 1 dinamik route family (peygamber/[id]).

---

## 3. Default Cascade'e Düşen Route'lar (35)

### 3.1 `/atlas/*` — 12 route

| Route | TITLE_TR | TITLE_EN |
|---|---|---|
| `/atlas/doga` | Doğa Atlası | Atlas of Nature |
| `/atlas/furuk` | Füruk Atlası | Atlas of Semantic Distinctions |
| `/atlas/kadinlar` | Kadınlar Atlası | Atlas of Women in the Quran |
| `/atlas/kavim` | Kavimler Atlası | Atlas of Quranic Peoples |
| `/atlas/kiraat` | Kıraat Atlası | Atlas of Quranic Recitations |
| `/atlas/kissa` | Kıssa Atlası | Atlas of Quranic Narratives |
| `/atlas/mesel` | Mesel Atlası | Atlas of Quranic Parables |
| `/atlas/munafik` | Münafık Profili | Profile of the Hypocrite |
| `/atlas/munasebat` | Münasebât Atlası | Atlas of Surah Coherence |
| `/atlas/nefs-mertebeleri` | Nefs Mertebeleri | Stations of the Soul |
| `/atlas/peygamber` | Peygamberler Atlası | Atlas of the Prophets |
| `/atlas/sunnetullah` | Sünnetullah Atlası | Atlas of Divine Patterns |

> Not: `/atlas/peygamber/[id]` (dinamik 4 alt-route) özelleştirilmiş; ama parent `/atlas/peygamber` (liste) jenerik kategori kartına düşüyor.

### 3.2 `/graf/*` — 7 route

| Route | TITLE_TR | TITLE_EN |
|---|---|---|
| `/graf/ayet` | Ayet Grafiği | Verse Graph |
| `/graf/diyalog` | Diyalog Ağı | Dialogue Network |
| `/graf/karsilastir` | Sure Karşılaştırıcı | Surah Comparator |
| `/graf/kavram` | Kavram Grafiği | Concept Graph |
| `/graf/kelime-isi` | Kelime Isı Haritası | Word Heatmap |
| `/graf/semantik` | Semantik Harita | Semantic Map |
| `/graf/zaman` | Nüzul Kronolojisi | Revelation Timeline |

### 3.3 `/arac/*` — 16 route

| Route | TITLE_TR | TITLE_EN |
|---|---|---|
| `/arac/buyruklar` | Kur'an'da Emir ve Yasaklar | Commands and Prohibitions in the Quran |
| `/arac/cennet-cehennem` | Cennet & Cehennem | Paradise & Hell |
| `/arac/dualar` | Kur'an'dan Dualar | Prayers from the Quran |
| `/arac/esma-frekans` | Esmâ'ül-Hüsnâ Frekansı | Frequency of the Divine Names |
| `/arac/iblis-seytan` | İblîs & Şeytan | Iblis & Satan |
| `/arac/ilk-son-kelimeler` | İlk & Son Kelimeler | First & Last Words |
| `/arac/kiyamet` | Kıyamet Sahneleri | Scenes of the Day of Judgment |
| `/arac/melekler` | Melekler | Angels in the Quran |
| `/arac/muhataplar` | Muhataplar Sistemi | The Quranic Addressee System |
| `/arac/renkler` | Kur'an'da Renkler | Colors in the Quran |
| `/arac/retorik` | Kur'an Belâgatı | Quranic Rhetoric |
| `/arac/sebebi-nuzul` | Sebeb-i Nüzûl | Occasions of Revelation |
| `/arac/tum-araclar` | Tüm Araçlar | All Tools |
| `/arac/wow` | Şaşırtıcı Olgular | Astonishing Facts |
| `/arac/yeminler` | Kur'an'ın Yeminleri | The Oaths of the Quran |
| `/arac/zaman-boyutlari` | Zaman Boyutları | Dimensions of Time |

---

## 4. Tematik Renk + Arabic Glyph Önerileri

Renkler `src/tokens.js` paletinden — tüm tool kartları cosmic-black radial gradient arka planını korur; sadece **accent rengi** ve **Arabic glyph** route'a göre değişir. Glyph'ler ya doğrudan tool ismidir (دُعَاء, مَلَائِكَة) ya da tematik tek-kelime sembol.

### 4.1 Atlas

| Route | Accent | Arabic glyph | Justification |
|---|---|---|---|
| `/atlas/doga` | `#34d399` soft emerald | كَوْن | Kainat/doğa — yeşil canlılık |
| `/atlas/furuk` | `#a78bfa` mor | فُرُوق | Semantik ayrım — entelektüel |
| `/atlas/kadinlar` | `#fbcfe8` soft pink | نِسَاء | Nisâ suresi referansı, klasik kart |
| `/atlas/kavim` | `#fb923c` turuncu | أَقْوَام | Antik kavimler — toprak/çöl tonu |
| `/atlas/kiraat` | `#c9a227` royal gold | قِرَاءَات | Tilavet — geleneksel altın |
| `/atlas/kissa` | `#60a5fa` mavi | قَصَص | Anlatı (Kasas suresi referans) |
| `/atlas/mesel` | `#f59e0b` amber | مَثَل | Mecaz/teşbih — sıcak ton |
| `/atlas/munafik` | `#94a3b8` silver | مُنَافِق | Saklılık/iki yüzlülük — grilik |
| `/atlas/munasebat` | `#d4a574` gold | مُنَاسَبَة | Sure bütünlüğü — brand altını |
| `/atlas/nefs-mertebeleri` | `#9333ea` deep purple | نَفْس | İç dünya — derin renk |
| `/atlas/peygamber` (liste) | `#d4a574` gold | أَنْبِيَاء | Default cascade'in altın brand'i — `/[id]` zaten accent renge sahip |
| `/atlas/sunnetullah` | `#3498db` sky blue | سُنَّة | İlâhi yasa, evrensel — gök mavisi |

### 4.2 Graf

| Route | Accent | Arabic glyph | Justification |
|---|---|---|---|
| `/graf/ayet` | `#34d399` soft emerald | آيَة | Tek ayet — Kur'anî yeşil |
| `/graf/diyalog` | `#60a5fa` mavi | حِوَار | Karşılıklı konuşma — iletişim tonu |
| `/graf/karsilastir` | `#f59e0b` amber | قَارَنَ | Karşılaştırma — analitik vurgu |
| `/graf/kavram` | `#a78bfa` mor | مَفْهُوم | Kavram — soyut/entelektüel |
| `/graf/kelime-isi` | `#e74c3c` soft red | كَلِمَات | Isı haritası — sıcak gradient çağrışımı |
| `/graf/semantik` | `#2ecc71` soft emerald | دَلَالَة | Anlam — semantik yeşil |
| `/graf/zaman` | `#c9a227` royal gold | زَمَن | Nüzul kronolojisi — tarihsel altın |

### 4.3 Araç

| Route | Accent | Arabic glyph | Justification |
|---|---|---|---|
| `/arac/buyruklar` | `#1a7a4c` quranic green | أَمْر | Emir-nehiy — Kur'anî yeşil |
| `/arac/cennet-cehennem` | `#fb923c` turuncu | جَنَّة \| نَار | İki kutup — ateş/turuncu (split layout) |
| `/arac/dualar` | `#d4a574` gold | دُعَاء | Klasik altın — yakarış |
| `/arac/esma-frekans` | `#c9a227` royal gold | أَسْمَاء | Esmâ — kraliyet altını |
| `/arac/iblis-seytan` | `#e74c3c` soft red | إِبْلِيس | Düşmanlık — kırmızı uyarı |
| `/arac/ilk-son-kelimeler` | `#60a5fa` mavi | أَوَّل \| آخِر | Başlangıç ve son — derin mavi |
| `/arac/kiyamet` | `#e74c3c` soft red | قِيَامَة | Sahneler — ateş kırmızısı |
| `/arac/melekler` | `#e8e6e3` off-white | مَلَائِكَة | Melekler — nûr/saf beyaz |
| `/arac/muhataplar` | `#3498db` sky blue | يَا أَيُّهَا | "Ey..." hitabı — diyaloji mavisi |
| `/arac/renkler` | gradient (`#e74c3c → #f59e0b → #34d399 → #60a5fa`) | أَلْوَان | Renkler — gradient palette |
| `/arac/retorik` | `#a78bfa` mor | بَلَاغَة | Belâgat — edebi mor |
| `/arac/sebebi-nuzul` | `#c9a227` royal gold | نُزُول | İniş sebebi — tarihsel altın |
| `/arac/tum-araclar` | `#d4a574` gold | أَدَوَات | Index — brand altını |
| `/arac/wow` | `#34d399` soft emerald | عَجَب | Şaşırtıcı — vivid yeşil |
| `/arac/yeminler` | `#c9a227` royal gold | قَسَم | Yemin — ciddi altın |
| `/arac/zaman-boyutlari` | `#9333ea` deep purple | زَمَن | Zaman fiziği — kozmik mor |

---

## 5. Implementation Tahmini

### 5.1 Fingerprint Pattern (önerilen — uniform)

Her tool route'unun OG'si **`/atlas/opengraph-image.jsx` ile aynı iskeletten** türetilir, sadece üç değişken farklı:

```js
const ACCENT = '#34d399';
const ARABIC_GLYPH = 'كَوْن';
const TITLE_TR = 'Doğa Atlası';
const TITLE_EN = 'Atlas of Nature';
```

Layout: Top brand label → büyük Arabic glyph (accent renkte, 130px) → decorative line (gradient accent) → Latin title (88px) → bottom brand strip. Per-prophet OG (`atlas/peygamber/[id]/opengraph-image.jsx`) ile **aynı kompozisyon** — visual parity korunur.

### 5.2 Kod Hacmi

| Approach | Dosya/route | LoC/dosya | 35 route toplam |
|---|---|---|---|
| **A — Per-route standalone** | 35 yeni `opengraph-image.jsx` | ~130 | ~4,550 LoC duplicate |
| **B — Shared helper + per-route thin wrapper** (önerilen) | 35 thin + 1 helper | ~30 thin / ~120 helper | ~1,170 LoC total |

**Approach B** detayı: `next/src/lib/og-tool-card.jsx` adlı helper export eder `renderToolCard({ accent, arabicGlyph, titleTr, titleEn, locale })` → `ImageResponse` JSX'i. Her route'un `opengraph-image.jsx`'i sadece config'i çağırır:

```jsx
// next/src/app/[locale]/atlas/doga/opengraph-image.jsx
import { renderToolCard } from '@/lib/og-tool-card';
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Doğa Atlası';
export default async function Image({ params }) {
  const { locale } = await params;
  return renderToolCard({
    locale, accent: '#34d399', arabicGlyph: 'كَوْن',
    titleTr: 'Doğa Atlası', titleEn: 'Atlas of Nature',
    category: { tr: 'ATLAS', en: 'ATLAS' },
  });
}
```

### 5.3 Paralel Implementation

35 route birbirinden bağımsız → **subagent-driven parallel** uygulanabilir. Bir agent helper'ı yazıp doğrularken, paralelde 3 agent kategori başına thin wrapper batch'leri ekler. Build doğrulaması tek aşamada (`next build` → `.next/server/app/.../opengraph-image.png` artifact yok ama runtime 200 OK döner).

### 5.4 Riskler

- **Arabic font kalitesi:** `peygamber/[id]` audit'inde olduğu gibi system-ui Arabic fallback'i hareke'siz render eder. Glyph-only kartlarda (tek kelime, hareke az) kalite kabul edilebilir. Hareke-yoğun kelimeler (örn. `قِرَاءَات`) için KFGQPC subset lazy-load opsiyonu açık tutulmalı.
- **Edge runtime cold start:** 35 × locale = 70 yeni OG endpoint. `Cache-Control` 24h + SWR 7d header'ları zaten pattern; first-hit penalty kabul edilebilir (CDN warm-up sosyal paylaşımda 1 kez tetiklenir).
- **Cascade override regression:** `/atlas/peygamber/opengraph-image.jsx` eklenirse `/atlas/peygamber/[id]/opengraph-image.jsx`'in cascade'i değişmez (Next.js per-segment lookup) — risk yok ama PR test'inde 1 manuel `curl` doğrulama yeterli.

---

## 6. Önceliklendirme

| Tier | Route'lar | Justification |
|---|---|---|
| **P0 — High-traffic atlas** (5) | `peygamber` (liste), `kissa`, `kavim`, `kadinlar`, `kiraat` | Atlas anchor sayfaları; sosyal paylaşımda en sık link'leniyor (Faz 7.5 telemetry varsayım) |
| **P1 — Visual-rich graf** (4) | `ayet`, `kavram`, `kelime-isi`, `zaman` | Force-graph görselleri; SEO snippet'te jenerik OG zayıf kalıyor |
| **P2 — Thematic depth arac** (8) | `dualar`, `melekler`, `kiyamet`, `cennet-cehennem`, `esma-frekans`, `iblis-seytan`, `yeminler`, `retorik` | Kullanıcı bilinen tematik anchor terimleri; bireysel kart sosyal CTR'yi yükseltir |
| **P3 — Tail** (18) | Geri kalan tüm atlas/graf/arac route'ları | Helper varsa marjinal ek maliyet (her biri ~30 LoC) |

`/atlas/peygamber/[id]` zaten yapıldı; `/atlas/peygamber` (liste) P0'da, çünkü liste sayfasında "Peygamberler Atlası" başlığı ve grid önizleme cazip OG yapar.

---

## 7. Karar Önerisi (Audit-only)

1. **Helper + thin wrapper (Approach B)** tek seferde benimsenirse 35 route × ~30 LoC = ~1,050 LoC yeni kod (helper +120 LoC). Bir oturumda dispatchable.
2. **Pattern uyumu:** `/atlas/peygamber/[id]/opengraph-image.jsx`'in mevcut yapısı baseline; per-tool kartlar **bu iskeletten sapmaz** — top label, Arabic glyph (accent renkte), decorative line, Latin title, brand strip + cache header.
3. **Veri kaynağı:** Renkler tokens.js'tekiler; glyph'ler bu audit'ten alınır. Tool-spesifik veri (örn. stat sayısı) v1'de **dahil edilmez** — generic kart yeterli; v2'de tool JSON'larından subtitle eklenebilir.
4. **`generateImageMetadata` KULLANILMAZ** — per-prophet implementation note §9.2'deki gibi `edge runtime` ile çakışır. Her tool route tek statik OG üretir.

---

## 8. Açık Sorular

- **Arabic glyph hareke seviyesi:** Tam hareke (Bismillah pattern) mı, yalın kök harfler mi? System-ui Arabic fallback'i hareke-yoğun render'da degrade ediyor → **öneri:** kök harfler + sukun/fetha kombinasyonu, full şedde/madde'den kaçın.
- **`atlas/peygamber` liste kartı:** Peygamberler grid'ini SVG dot pattern olarak göstermek mi, sade Arabic glyph mi? Bu audit "sade glyph" tercih ediyor — implementation aşamasında karar.
- **`arac/renkler` gradient accent:** Tek-renk pattern dışına çıkar; helper'a `accent` parametresi `string | { type:'gradient', colors:[] }` union destek mi eklensin? **Öneri:** v1'de sade tek renk (`#e74c3c`); gradient v2'ye defer.
- **Cache invalidation:** Tool TITLE değişirse OG kart eski TITLE ile cache'lenmiş kalır 24h. Critical content değişikliklerinde manual purge gerekir mi? **Öneri:** TITLE değişimi nadirdir, 24h tolerans kabul edilebilir.

---

**Rapor sonu.** Implementation kararı için Faz 7.6 / Faz 8 sprint planına bu doc referans verilebilir.
