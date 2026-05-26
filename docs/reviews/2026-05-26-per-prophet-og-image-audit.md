# Per-Prophet OG Image — Fizibilite & Tasarım Audit

**Tarih:** 2026-05-26
**Kapsam:** `/atlas/peygamber/[id]` dynamic route + per-prophet OG image üretimi
**Karar:** Fizibıl — pre-generate önerilir, **kısmi (4 peygamber)** uygulanır; 25 hedef için veri zenginleştirme gerekir
**Status:** IMPLEMENTED 2026-05-25 — 8 statik route (4 peygamber × 2 locale) pre-rendered; OG image edge runtime'da on-demand üretiliyor

---

## 1. Mevcut Peygamber Veri Envanteri

**Tek veri kaynağı:** `next/public/kissa-atlas.json` → `prophets[]`
**Mevcut peygamber sayısı: 4** (CLAUDE.md'deki "25 peygamber" hedefi henüz tamamlanmamış)

| id | nameTr | nameAr | color | surahCount | scenes |
|---|---|---|---|---|---|
| `musa` | Hz. Musa | سيدنا موسى | `#60a5fa` (mavi) | 32 | 18 |
| `yusuf` | Hz. Yusuf | سيدنا يوسف | `#a78bfa` (mor) | 3 | 18 |
| `ibrahim` | Hz. İbrahim | سيدنا إبراهيم | `#fb923c` (turuncu) | 15 | 18 |
| `isa` | Hz. İsa | سيدنا عيسى | `#34d399` (yeşil) | 9 | 14 |

**Önemli notlar:**
- Her peygamberin **tematik renk** (`color`) alanı zaten mevcut → OG image accent color olarak doğrudan kullanılabilir
- Her peygamberin `surahs[]` array'i mevcut → subtitle'da "X sure" sayısı gösterilebilir
- `nameEn` alanı da var (örn. `"Prophet Moses"`) → locale-aware başlık
- `scenes[].verseRef` ile en önemli sahnenin ayet referansı çıkarılabilir (örn. ilk scene)
- 25-peygamber hedefi için ayrıca: Adem, Nuh, Hud, Salih, Lut, İsmail, İshak, Yakub, Eyyub, Şuayb, Harun, Davud, Süleyman, İlyas, Elyesa, Zülkifl, Yunus, Zekeriyya, Yahya, İdris, Muhammed (s.a.v.) — veri eklenmeli

---

## 2. Önerilen Route Şeması

```
next/src/app/[locale]/atlas/peygamber/[id]/
├── page.js               # generateStaticParams + generateMetadata + JsonLd + PageHeading
├── ProphetDetailRoute.jsx # client wrapper (router.push fallback)
└── opengraph-image.jsx   # Edge ImageResponse — per-id render
```

URL'ler:
- `/tr/atlas/peygamber/musa` → OG: "Hz. Musa · 32 Sure"
- `/en/atlas/peygamber/musa` → OG: "Prophet Moses · 32 Surahs"
- Her `[id]` × `[locale]` kombinasyonu için **statik PNG** pre-generate

---

## 3. OG Image Tasarım Layout (1200×630)

Mevcut `/atlas/opengraph-image.jsx` ve `/oku/[surah]/opengraph-image.jsx` pattern'larıyla **görsel parity** korunur (cosmic-black radial gradient + altın brand metni + alt brand striple).

```
┌────────────────────────────────────────────────────────────┐
│  QURAN CODEX · PEYGAMBER  (gold, 24px, letter-spaced)      │  ← top label
│                                                              │
│              سيدنا موسى   (Arabic, 130px, KFGQPC-fallback,  │  ← prophet Arabic
│                            color: prophet.color, RTL)        │
│                                                              │
│              ━━━━━━━━━━━ (decorative line, prophet.color)   │
│                                                              │
│              Hz. Musa     (88px, off-white, bold)            │  ← Turkish/En name
│                                                              │
│              32 Sure · 18 Kıssa Sahnesi  (28px, silver)      │  ← stats subtitle
│                                                              │
│  QURAN CODEX (bottom-left)              qurancodex.com (br) │  ← brand strip
└────────────────────────────────────────────────────────────┘
```

**Renk stratejisi:**
- Arka plan: `radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)` (atlas pattern ile aynı)
- Arabic isim: `prophet.color` (her peygamberin kendi tematik rengi)
- Decorative line: `linear-gradient(to right, transparent, ${prophet.color}, transparent)`
- Latin isim: `#e8e6e3` (off-white, sure-page pattern ile aynı)
- Subtitle: `#94a3b8` (silver)
- Brand: `#d4a574` (gold, sabit)

**Font notu:** `ImageResponse` font yüklemesi runtime'da `ArrayBuffer` ile manuel yapılır. KFGQPC için `next/public/fonts/` ağırlığı 200KB+ → Edge runtime'da maliyetli. **Öneri:** Arapça için system-ui fallback (Edge'in CJK/Arabic fallback fontları render eder, glyph kalitesi düşük ama OG için kabul edilebilir). Kaliteli render istenirse `fetch('/fonts/...')` ile lazy load + `ImageResponse({ fonts: [...] })`.

---

## 4. Implementation Skeleton

### 4.1 Veri helper'ı

```js
// next/src/lib/prophets.js — server-safe (RSC import OK)
import data from '../../public/kissa-atlas.json';
export const PROPHETS = data.prophets;
export const PROPHET_IDS = PROPHETS.map(p => p.id);
export function getProphet(id) {
  return PROPHETS.find(p => p.id === id) ?? null;
}
```

### 4.2 OG image route

```jsx
// next/src/app/[locale]/atlas/peygamber/[id]/opengraph-image.jsx
import { ImageResponse } from 'next/og';
import { PROPHETS, getProphet } from '@/lib/prophets';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Peygamber';

// Build-time pre-generation — her (locale, id) kombinasyonu için PNG
export async function generateImageMetadata({ params }) {
  const { id } = await params;
  const p = getProphet(id);
  if (!p) return [{ id: 'default', alt: 'QuranCodex' }];
  return [{ id, alt: `${p.nameTr} — QuranCodex`, contentType: 'image/png', size }];
}

export default async function Image({ params }) {
  const { locale, id } = await params;
  const p = getProphet(id);
  if (!p) {
    // 404 fallback — generic atlas card
    return new ImageResponse(<div>QuranCodex</div>, size);
  }
  const isEN = locale === 'en';
  const accent = p.color || '#d4a574';
  const nameLatin = isEN ? p.nameEn : p.nameTr;
  const sceneCount = p.scenes?.length || 0;
  const subtitle = isEN
    ? `${p.surahCount} Surahs · ${sceneCount} Narrative Scenes`
    : `${p.surahCount} Sure · ${sceneCount} Kıssa Sahnesi`;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)',
        color: '#e8e6e3', padding: '60px', fontFamily: 'system-ui',
      }}>
        <div style={{ color: '#d4a574', fontSize: 22, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 28, fontWeight: 600 }}>
          QURAN CODEX · {isEN ? 'PROPHET' : 'PEYGAMBER'}
        </div>
        <div dir="rtl" lang="ar" style={{ fontSize: 130, fontWeight: 700, lineHeight: 1.1, color: accent, marginBottom: 24, textAlign: 'center' }}>
          {p.nameAr}
        </div>
        <div style={{ width: 220, height: 2, background: `linear-gradient(to right, transparent, ${accent}, transparent)`, marginBottom: 28 }} />
        <div style={{ fontSize: 88, fontWeight: 800, color: '#e8e6e3', marginBottom: 20, textAlign: 'center', letterSpacing: '-0.01em' }}>
          {nameLatin}
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', textAlign: 'center', fontWeight: 400 }}>
          {subtitle}
        </div>
        <div style={{ position: 'absolute', bottom: 36, left: 60, color: '#d4a574', fontSize: 24, letterSpacing: '0.18em', fontWeight: 600 }}>QURAN CODEX</div>
        <div style={{ position: 'absolute', bottom: 36, right: 60, color: '#94a3b8', opacity: 0.6, fontSize: 20, letterSpacing: '0.18em' }}>qurancodex.com</div>
      </div>
    ),
    { ...size, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' } }
  );
}
```

### 4.3 Page route (skeleton)

```jsx
// next/src/app/[locale]/atlas/peygamber/[id]/page.js
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import { PROPHETS, getProphet } from '@/lib/prophets';
import ProphetDetailRoute from './ProphetDetailRoute';

export async function generateStaticParams() {
  return PROPHETS.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const p = getProphet(id);
  if (!p) return {};
  const isEn = locale === 'en';
  return pageMetadata({
    params, path: `/atlas/peygamber/${id}`,
    titleTr: `${p.nameTr} — Kıssalar ve Sureler`,
    titleEn: `${p.nameEn} — Narratives and Surahs`,
    descTr: `${p.nameTr} ile ilgili ${p.surahCount} sure, ${p.scenes?.length || 0} kıssa sahnesi ve ayet referansları.`,
    descEn: `${p.scenes?.length || 0} narrative scenes from ${p.surahCount} surahs about ${p.nameEn}.`,
  });
}

export default async function Page({ params }) {
  const { id, locale } = await params;
  const p = getProphet(id);
  if (!p) notFound();
  // ... PageHeading + JsonLd + ProphetDetailRoute
}
```

---

## 5. Pre-Generate vs Runtime Tercih

**Karar: PRE-GENERATE** (`generateImageMetadata` + `generateStaticParams`).

| Kriter | Pre-Generate | Runtime Edge |
|---|---|---|
| **Build artifact (4 peygamber × 2 locale)** | ~3.2 MB (8 × 400 KB PNG) | 0 MB |
| **Build artifact (25 peygamber × 2 locale)** | ~20 MB (50 × 400 KB PNG) | 0 MB |
| **Cold request latency** | ~50ms (CDN hit) | ~500-1500ms (edge cold start) |
| **Vercel function invocation cost** | 0 (static asset) | 50 invocations/build × edge price |
| **Crawler reliability (Twitter/FB cache)** | Yüksek (statik URL) | Orta (edge fallback flake riski) |
| **Update-on-data-change** | Build retetiklenmesi gerekir | Anında |

25 peygamber hedefi için bile 20MB build artifact kabul edilebilir (mevcut `next/.next/static` boyutu bunun çok üstünde). W24-T7 audit'inde de benzer öneri var.

**ImageResponse + generateImageMetadata pattern**, Next 16 App Router'da `export const dynamic = 'force-static'` benzeri davranır.

---

## 6. Mevcut `/atlas/opengraph-image.jsx` ile Entegrasyon

Next.js OG image cascade kuralı: **daha derin segment, üst segmenti override eder.**

- `/atlas/*` → mevcut generic atlas kartı (kalır, fallback rolü)
- `/atlas/peygamber` → **kategori kartı eklemeli** (öneri: `/atlas/peygamber/opengraph-image.jsx` — "Peygamberler Atlası" başlığı + 25 peygamber griddeki nokta-deseni)
- `/atlas/peygamber/[id]` → per-prophet kart (bu doc'un kapsamı)

Mevcut `/atlas/opengraph-image.jsx` **dokunulmaz** — `/atlas/peygamber/[id]` deeper segment olduğu için otomatik override eder.

**Diğer atlas alt route'ları için precedent oluşur:** Aynı pattern `/atlas/kavim/[id]`, `/atlas/kissa/[id]`, `/atlas/mesel/[id]` için tekrarlanabilir.

---

## 7. Risk & Açık Sorular

1. **Arabic font kalitesi:** `ImageResponse` system-ui ile Arapça render eder ama hareke (tashkeel) glyph'leri eksik kalabilir. **Mitigasyon:** `next/public/fonts/KFGQPC-Uthman-Taha.otf` (200KB) sadece bu route için `fetch + ArrayBuffer + ImageResponse({ fonts })` ile lazy load. Edge cold start +200ms maliyeti var. **Alternatif:** Arabic kısmı küçültüp Latin ismi öne çıkar.
2. **Veri tutarlılığı:** `kissa-atlas.json` aynı dosya birden fazla amaç için kullanılıyor (atlas detail UI + OG). Şema değişirse OG kırılır. **Mitigasyon:** `lib/prophets.js`'te explicit schema typing/defensive defaults.
3. **25 peygamber tamamlanma:** Şu an sadece 4 peygamber var. Route oluşturulursa 4'le başlar; sonradan veri eklendikçe `generateStaticParams` otomatik genişler.
4. **404 handling:** Geçersiz `[id]` için `notFound()` çağrılır → Next default 404 sayfası. OG image'i için generic atlas kartı fallback dönsün.

---

## 8. Önerilen Sıralama (Eğer Implement Edilirse)

1. `next/src/lib/prophets.js` oluştur (JSON wrapper)
2. `/atlas/peygamber/[id]/page.js` + `ProphetDetailRoute.jsx` skeleton
3. `/atlas/peygamber/[id]/opengraph-image.jsx` (system-ui fallback ile başla)
4. Local test: `curl http://localhost:3000/tr/atlas/peygamber/musa/opengraph-image` → PNG indirilebiliyor mu?
5. `next build` sonrası `.next/server/app/[locale]/atlas/peygamber/[id]/opengraph-image.png` artifact'leri verify
6. Twitter Card Validator + FB Sharing Debugger ile manuel test
7. (opsiyonel) KFGQPC font lazy-load upgrade

---

result: per-prophet OG image fizibilite + tasarim + 4 peygamber pre-gen onerisi

---

## 9. Implementation Notes (2026-05-25)

Audit'in 8. bölümündeki sıralama büyük ölçüde takip edildi; ufak sapmalar:

### 9.1 Oluşturulan dosyalar

```
next/src/app/[locale]/atlas/peygamber/[id]/
├── page.js                  # generateStaticParams + generateMetadata + JsonLd + PageHeading
├── ProphetDetailRoute.jsx   # 'use client' wrapper (ProphetAtlas dynamic ssr:false mount)
└── opengraph-image.jsx      # Edge ImageResponse — per-id render
```

`next/src/lib/prophets.js` helper'ı **oluşturulmadı**; bunun yerine her iki route dosyası da `import data from '../../../../../../public/kissa-atlas.json'` ile JSON'u doğrudan import ediyor (yazma izni sadece 3 route dosyasıydı). Helper extraction defer edildi — şu an drift riski düşük çünkü id listesi tek yerden (`PROPHETS.find(...)`) okunuyor.

### 9.2 `generateImageMetadata` KULLANILMADI — edge runtime ile uyumsuz

İlk implementasyonda `generateImageMetadata` denendi, ama Next 16 build hatası verdi:

> Error: Edge runtime is not supported with `generateStaticParams`.
> Failed to collect page data for /[locale]/atlas/peygamber/[id]/opengraph-image/[__metadata_id__]

`generateImageMetadata`'nın dahili olarak `generateStaticParams` benzeri pre-rendering attempt yaptığı ve `runtime = 'edge'` ile çakıştığı anlaşıldı. **Çözüm:** `generateImageMetadata` kaldırıldı; sibling `page.js`'in `generateStaticParams`'ı zaten her `(id, locale)` kombinasyonunu pre-render ettiği için OG image edge runtime'da on-demand üretiliyor (mevcut `/oku/[surah]/opengraph-image.jsx` ile aynı pattern). Bu, audit §5'teki "PRE-GENERATE" hedefinden ufak bir sapma: HTML pre-render edilir, OG PNG ilk talepte üretilir + 24h CDN cache'lenir.

### 9.3 ProphetAtlas — `initialProphetId` prop yok

ProphetAtlas signature: `export default function ProphetAtlas({ onClose })`. Deep-link id'ye odaklı UI henüz yok; `ProphetDetailRoute.jsx` şu an tüm atlas'ı mount ediyor (`router.back()` ile kapanır). `id` prop'u alınıyor ama `void id` ile no-op — ileride ProphetAtlas'a `initialProphetId` eklendiğinde aktive edilir. SEO faydası tam: page.js'in `generateMetadata` + `JsonLd` + `PageHeading` her id için unique HTML üretiyor.

### 9.4 Build doğrulaması

```
├ ● /[locale]/atlas/peygamber/[id]
│ ├ /tr/atlas/peygamber/musa
│ ├ /tr/atlas/peygamber/yusuf
│ ├ /tr/atlas/peygamber/ibrahim
│ └ [+5 more paths]
├ ƒ /-/atlas/peygamber/-/opengraph-image
```

8 statik HTML artifact (`.next/server/app/{tr,en}/atlas/peygamber/{musa,yusuf,ibrahim,isa}.html`) oluştu. Generated meta tag örnekleri (TR/musa):

- `<title>Hz. Musa — Kıssalar ve Sureler | QuranCodex</title>`
- `og:image content="https://qurancodex.com/tr/atlas/peygamber/musa/opengraph-image?<hash>"`
- `twitter:description content="Hz. Musa ile ilgili 32 sure, 18 kıssa sahnesi..."`

EN/isa için: `<title>Prophet Jesus — Narratives and Surahs | QuranCodex</title>`.

### 9.5 dynamicParams = false

`page.js`'e `export const dynamicParams = false;` eklendi — geçersiz id (örn. `/atlas/peygamber/adem`) gelirse runtime'da yeni route oluşturulmaz, Next 404 döner. 25-peygamber hedefi için veri eklendikçe `PROPHETS` listesi otomatik büyür, başka koda dokunmaya gerek yok.

### 9.6 Sapan/atlanan adımlar

- `lib/prophets.js` helper: yazılmadı (write permission scope) — JSON inline import yeterli oldu
- KFGQPC font lazy-load: defer edildi (system-ui fallback Arabic'i render ediyor; visual parity OG audit §3'teki tasarımla uyumlu)
- Twitter Card Validator / FB Debugger manuel test: production deploy sonrası yapılacak
- `/atlas/peygamber/opengraph-image.jsx` kategori kartı: bu PR scope'unda değil; `/atlas/opengraph-image.jsx` cascade'i halen tutarlı
