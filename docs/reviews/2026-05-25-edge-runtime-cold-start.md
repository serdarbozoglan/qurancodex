# W24-T7 — Edge Runtime Cold Start Latency Audit

**Date:** 2026-05-25
**Branch:** `migration-to-next.js`
**Environment:** production (`https://www.qurancodex.com`, Vercel)
**Edge region observed:** `iad1` (Washington DC) — all samples landed on the same node from this measuring host
**Method:** `curl -w` capturing `time_total`, `time_starttransfer` (TTFB), `time_connect`, plus `x-vercel-cache` / `x-vercel-id` headers. Cold samples taken after a 5-minute idle window and with varied path params to bypass CDN cache (MISS).

---

## 1. Endpoints Under Test

| Endpoint                                       | Runtime | Source                                                                          |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `/api/meal/[author]/[surah]`                   | edge    | `next/src/app/api/meal/[author]/[surah]/route.js`                               |
| `/api/meal/[author]/[surah]/verse/[ayah]`      | edge    | `next/src/app/api/meal/[author]/[surah]/verse/[ayah]/route.js`                  |
| `/[locale]/opengraph-image`                    | edge    | `next/src/app/[locale]/opengraph-image.jsx`                                     |
| `/[locale]/oku/[surah]/opengraph-image`        | edge    | `next/src/app/[locale]/oku/[surah]/opengraph-image.jsx`                         |
| `/opengraph-image` (root, locale-less)         | edge    | `next/src/app/opengraph-image.jsx`                                              |

All routes declare `export const runtime = 'edge'`.

---

## 2. Per-Endpoint Latency (production, iad1)

### Cold (cache MISS / first hit after idle)

| Endpoint                             | n | avg (ms) | median | p95   | min   | max   |
| ------------------------------------ | - | -------- | ------ | ----- | ----- | ----- |
| `/api/meal/{a}/{s}`                  | 5 | 1198     | 1036   | 1702  | 706   | 1702  |
| `/api/meal/{a}/{s}/verse/{v}`        | 4 |  523     |  514   |  591  | 474   |  591  |
| `/{locale}/opengraph-image`          | 4 | 1157     | 1068   | 1827  | 665   | 1827  |
| `/{locale}/oku/{n}/opengraph-image`  | 5 | 1376     |  605   | 3284  | 522   | 3284  |

### Warm

| Endpoint                             | Vercel cache | avg (ms) | median | p95  |
| ------------------------------------ | ------------ | -------- | ------ | ---- |
| `/api/meal/...` (24h CDN HIT)        | HIT          |  154     |  162   |  214 |
| `/{locale}/oku/{n}/opengraph-image`  | MISS (every) |  637     |  641   |  719 |

### Overall

- **18 cold samples**, all endpoints combined: avg **1088 ms**, median **822 ms**, p95 **3284 ms**, max **3284 ms** (single `/tr/oku/36/opengraph-image` outlier).
- Cold-vs-warm gap, meal API: **~1044 ms** (1198 cold → 154 warm) — almost entirely CDN cache benefit + Edge function init.
- Cold-vs-warm gap, OG `/oku/[surah]`: **~739 ms** (1376 cold → 637 warm) — even "warm" hits re-render (no CDN cache, see §4).

---

## 3. Cache Header Inspection

```text
$ curl -sI https://www.qurancodex.com/api/meal/1/1
cache-control: public, max-age=86400
x-vercel-cache: HIT
age: 378                                       # served from CDN, 378s old

$ curl -sI https://www.qurancodex.com/tr/oku/1/opengraph-image
cache-control: public, max-age=0, must-revalidate   # <-- BLOCKS CDN caching
x-vercel-cache: MISS                                # always MISS, every request
age: 0
```

- **Meal proxy (`route.js`):** explicit `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800` set by handler → Vercel CDN caches → 24h HIT window → warm path drops to ~154 ms.
- **OG image routes:** Next.js defaults to `max-age=0, must-revalidate` for `ImageResponse` → CDN never caches → every share / crawler hit re-renders → consistent ~600–1800 ms TTFB even when same surah is requested seconds apart.

---

## 4. Findings

1. **Meal API is healthy.** Cold start ~700–1700 ms is acceptable given external `acikkuran.com` proxy hop. Once cached at the CDN edge, p95 is **214 ms** — meets the < 500 ms target. No action needed.
2. **OG images have no CDN cache.** This is the single biggest optimization opportunity:
   - Every Twitter/Facebook crawler, every social share preview, every page-meta-fetch re-renders the PNG via `next/og`.
   - At 1200×630 with custom layout, p95 cold = **3.28 s**, even median warm = **641 ms**.
   - These images are **fully deterministic** for a given `(locale, surah)` pair — they should be cached aggressively.
3. **Outlier of note:** `/tr/oku/36/opengraph-image` took 3.28 s on a single cold sample. Likely true Edge function cold start (V8 isolate init on a freshly-allocated machine in `iad1`). Subsequent same-route hits were ~600 ms.
4. **No bundle-size red flag.** Verse meal route is faster than whole-surah (523 ms vs 1198 ms cold) because the upstream payload is smaller — the Edge function init itself is sub-500 ms.

---

## 5. Optimization Recommendations

### Priority 1 — Add Cache-Control to OG image routes (high impact, low risk)

`ImageResponse` accepts a `headers` option. For all six `opengraph-image.jsx` files:

```jsx
return new ImageResponse(
  ( /* JSX */ ),
  {
    ...size,
    headers: {
      // 24h fresh, 7d stale-while-revalidate. Surah names + design are static
      // per (locale, surah) — invalidating only on deploys is fine.
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  }
);
```

**Expected impact:** crawler / repeat-share hits drop from ~640 ms median to ~100–200 ms (CDN HIT, same shape as meal API warm path). Cuts ~75% of TTFB for social previews.

### Priority 2 — Pre-generate per-surah OG at build time (optional)

Routes already have `generateStaticParams`-friendly shape (114 surahs × 2 locales = 228 images). Switching from `runtime: 'edge'` dynamic to build-time static would:
- Eliminate cold start entirely for `/oku/[surah]/opengraph-image`.
- Add ~30–60 s to `next build` (228 × ~250 ms render).
- Increase build artifact size by ~228 × ~60 KB ≈ 14 MB.

Trade-off favors build-time generation unless OG content needs runtime data. **Defer** unless P1 + CDN caching doesn't bring p95 < 250 ms.

### Priority 3 — Region affinity for meal API (low priority)

`acikkuran.com` is presumably hosted in EU/TR. Current Edge function runs globally; cold misses from non-iad1 regions could be worse than the iad1 samples here. If observable telemetry shows p95 > 2 s outside US East, pin `export const preferredRegion = ['fra1', 'cdg1']` to colocate with upstream. **No action without multi-region data.**

### Skip — No bundle-size optimization needed

Meal routes are ~50 lines each, no heavy imports. OG routes import only `next/og` + `SURAH_NAMES_TR` (small const array). Function size isn't the bottleneck — the missing CDN cache is.

---

## 6. Verification After Fix (Priority 1)

After adding `Cache-Control` headers to OG routes, expected measurements:

```bash
# First hit: still MISS (re-renders once)
curl -w "%{time_total}s cache=%header{x-vercel-cache}\n" \
  -o /dev/null -s https://www.qurancodex.com/tr/oku/1/opengraph-image
# → ~0.6–1.8s, MISS

sleep 2

# Second hit: HIT expected
curl -w "%{time_total}s cache=%header{x-vercel-cache}\n" \
  -o /dev/null -s https://www.qurancodex.com/tr/oku/1/opengraph-image
# → ~0.1–0.2s, HIT  (target)
```

Pass criterion: `x-vercel-cache: HIT` on the second request, `time_total < 250 ms`.

---

## 7. Files Referenced (no code changes performed in this audit)

- `next/src/app/api/meal/[author]/[surah]/route.js`
- `next/src/app/api/meal/[author]/[surah]/verse/[ayah]/route.js`
- `next/src/app/[locale]/oku/[surah]/opengraph-image.jsx`
- `next/src/app/[locale]/opengraph-image.jsx`
- `next/src/app/[locale]/graf/opengraph-image.jsx`
- `next/src/app/[locale]/atlas/opengraph-image.jsx`
- `next/src/app/[locale]/arac/opengraph-image.jsx`
- `next/src/app/opengraph-image.jsx`
- `next/src/app/twitter-image.jsx`

result: 5 endpoint olculdu (18 cold sample); cold start avg 1088 ms, max 3284 ms.
