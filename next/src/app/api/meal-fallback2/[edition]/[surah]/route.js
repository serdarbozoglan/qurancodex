// ─── Meal Fallback #2 Proxy — fawazahmed0/quran-api via jsdelivr (2026-08-19) ─
// mealCache.js zincirinde 4. ve son deneme: yerel önbellek → acikkuran →
// alquran.cloud (meal-fallback) → BU route. Kullanıcı isteği: "bir tane daha
// fallback olsa iyi olur" — hem mevcut yazarlar için yedeklilik sağlar (biri
// düşerse diğeri tutar) hem de alquran.cloud'da karşılığı olmayan Abdul
// Haleem'i (eng-abdelhaleem) yeni kapsar.
//
// Response şekli diğer ikisinden de FARKLI ({chapter:[{chapter,verse,text}]})
// — burada da acikkuran'ın şekline normalize edilir, tüketici kod değişmez.
//
// Slug'lar CANLI istekle doğrulandı (elle uydurulmadı) — editions.json'daki
// alt-çizgili anahtarların tire'li klasör karşılığı: tur_diyanetisleri →
// tur-diyanetisleri gibi.

const UPSTREAM = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { edition, surah } = await params;

  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114 || !/^[a-z]{3}-[a-z0-9]+$/.test(edition)) {
    return new Response(JSON.stringify({ error: 'invalid params' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${UPSTREAM}/${edition}/${s}.json`, {
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      // 2026-08-20 — bkz. /api/meal/route.js'in aynı tarihli notu: 502 (5xx)
      // Vercel anomaly detection'ı yanlış tetikler, 424'e (4xx) çevrildi.
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 424,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const upstream = await res.json();
    const chapter = upstream?.chapter || [];
    const normalized = {
      data: {
        verses: chapter.map(v => ({
          verse_number: v.verse,
          translation: { text: v.text },
        })),
      },
    };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
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
