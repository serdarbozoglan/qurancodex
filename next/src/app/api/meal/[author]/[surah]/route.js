// ─── Meal API Proxy — Faz 6.3 ────────────────────────────────────────────────
// Client'ler mealCache.js üzerinden direkt api.acikkuran.com'a gidiyordu.
// Bu route Next.js sunucusunda proxy görevi görür:
//   - Next fetch cache (revalidate 24h) → çoklu kullanıcı için tek upstream call
//   - Browser cache (Cache-Control header)
//   - Origin gizler (rate limit + downtime mitigation)
//
// /meal-cache/[author]/[surah].json statik dosyaları varsa client önce onları
// dener; bu route fallback'tir (cache miss veya pre-cache'lenmemiş author için).

import { MEAL_AUTHOR_IDS } from '@/lib/mealSources';

const UPSTREAM = 'https://api.acikkuran.com';

export const runtime = 'edge'; // Edge: faster cold start, geographic distribution

export async function GET(request, { params }) {
  const { author, surah } = await params;

  // Validate inputs
  //
  // ÜST SINIR ŞART (2026-10-10). Eskiden koşul `a < 1` idi, yani üst sınır
  // yoktu: `author=99999` biçim denetimini geçip GERÇEK bir upstream isteği
  // tetikliyordu (canlıda ölçüldü, 0.67 s). Her farklı sayı ayrı bir önbellek
  // anahtarı olduğu için önbellek hiç tutmuyor, saldırgan sayıyı artırarak
  // sınırsız upstream isteği üretebiliyordu — bizi acikkuran.com'a karşı
  // yükseltici (amplifier) yapan, faturayı ve itibarı bize yazan bir açık.
  // Hız sınırı bunu çözmez; anahtar uzayını KAPATMAK çözer.
  const s = parseInt(surah, 10);
  const a = parseInt(author, 10);
  if (Number.isNaN(s) || s < 1 || s > 114 || !MEAL_AUTHOR_IDS.has(a)) {
    return new Response(JSON.stringify({ error: 'invalid params' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${UPSTREAM}/surah/${s}?author=${a}`, {
      // Next.js fetch cache: revalidate every 24h (translations rarely change)
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      // 2026-08-20 — Vercel anomaly detection kullanıcı raporuyla yakalandı:
      // api.acikkuran.com günlerdir düşük, bu route her istekte 502
      // döndürüyordu ("bizim sunucumuz bozuk" sinyali) — oysa mealCache.js
      // zaten alquran.cloud/jsdelivr fallback'lerine düşüyor, kullanıcıya
      // giden sonuç doğru. 502 (5xx) yerine 424 Failed Dependency (4xx) —
      // istemci tarafı `!res.ok` kontrolü aynı şekilde çalışır (fallback
      // zinciri bozulmaz), yalnız Vercel'in "sunucu hatası" izlemesini
      // yanlış yere tetiklemeyi durdurur.
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 424,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Browser + CDN cache: 24h fresh, 7d stale-while-revalidate
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'fetch failed', message: String(err?.message) }), {
      status: 424,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
