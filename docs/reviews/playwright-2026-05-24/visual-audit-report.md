# Playwright Visual Audit — QuranCodex

**Tarih:** 2026-05-24
**Test edilen:** 39 route × 2 viewport = 78 screenshot
**Console errors toplam:** 10
**Başarısız route'lar:** 0

## Özet

| Viewport | OK | Hatalı | Avg load (ms) | Toplam console errors |
|---|---|---|---|---|
| desktop | 39 | 0 | 2372 | 1 |
| mobile | 39 | 0 | 977 | 9 |

## Başarısız Sayfalar

Tüm sayfalar başarıyla yüklendi.

## Console Errors Bulunan Sayfalar

### [mobile] /tr
- `PageError: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A s`

### [mobile] /en
- `PageError: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A s`

### [mobile] /tr/oku
- `PageError: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A s`

### [mobile] /tr/oku/1
- `PageError: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A s`

### [mobile] /tr/oku/2
- `PageError: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A s`

### [mobile] /tr/graf/kelime-isi
- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client bran`

### [desktop] /tr/arac/sebebi-nuzul
- `Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information. 

Check the render method of `div`.  It was passed a child from TabArama.`

### [mobile] /tr/arac/sebebi-nuzul
- `Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information. 

Check the render method of `div`.  It was passed a child from TabArama.`

### [mobile] /tr/arac/zaman-boyutlari
- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client bran`

### [mobile] /tr/arac/iblis-seytan
- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client bran`


## Network Errors

### [mobile] /tr/oku
- `https://api.qurancdn.com/api/qdc/audio/reciters/7/audio_files?chapter=1&segments=true: net::ERR_ABORTED`

### [mobile] /tr/oku/1
- `https://api.qurancdn.com/api/qdc/audio/reciters/7/audio_files?chapter=1&segments=true: net::ERR_ABORTED`

### [mobile] /tr/oku/2
- `https://api.qurancdn.com/api/qdc/audio/reciters/7/audio_files?chapter=2&segments=true: net::ERR_ABORTED`


## Performance — En yavaş 10 sayfa

| Route | Viewport | Load (ms) |
|---|---|---|
| /tr/atlas/kavim | desktop | 11755 |
| /tr/arac/cennet-cehennem | desktop | 4691 |
| /tr/arac/esma-frekans | desktop | 4664 |
| /tr/arac/iblis-seytan | desktop | 4467 |
| /tr/graf/karsilastir | desktop | 4139 |
| /tr/graf/karsilastir | mobile | 3916 |
| /tr/arac/muhataplar | desktop | 3723 |
| /tr/atlas/furuk | desktop | 3700 |
| /tr/arac/sebebi-nuzul | desktop | 3640 |
| /tr/arac/zaman-boyutlari | desktop | 3226 |

## Screenshot Dizinleri

- Desktop: `docs/reviews/playwright-2026-05-24/desktop/`
- Mobile: `docs/reviews/playwright-2026-05-24/mobile/`
- Raw JSON: `docs/reviews/playwright-2026-05-24/raw-results.json`
