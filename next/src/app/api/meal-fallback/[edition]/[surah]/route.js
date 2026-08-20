// ─── Meal Fallback Proxy — alquran.cloud (2026-08-19) ───────────────────────
// api.acikkuran.com'un DNS'i çözülmediği bir dönemde (kullanıcı raporu)
// eklendi. mealCache.js önce /api/meal (acikkuran) dener; o başarısız
// olursa BU route'a düşer. Yalnız ALQURAN_CLOUD_FALLBACK haritasında (bkz.
// mealCache.js) karşılığı olan yazarlar için çağrılır — haritada olmayan
// yazarlar (İslamoğlu, Bayraktar, Okuyan, Haleem) bu route'u hiç görmez.
//
// Response şekli acikkuran'dan FARKLI (data.ayahs[] vs data.verses[]) —
// burada acikkuran'ın şekline normalize edilir ki mealCache.js/ReadingMode.jsx
// tüketici kodu (v.verse_number, v.translation.text) DEĞİŞMEDEN çalışsın.

const UPSTREAM = 'https://api.alquran.cloud/v1';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { edition, surah } = await params;

  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114 || !/^[a-z]{2}\.[a-z]+$/.test(edition)) {
    return new Response(JSON.stringify({ error: 'invalid params' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${UPSTREAM}/surah/${s}/${edition}`, {
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const upstream = await res.json();
    const ayahs = upstream?.data?.ayahs || [];
    // acikkuran şekline normalize et — mealCache.js tüketicisi bunu bekliyor.
    const normalized = {
      data: {
        verses: ayahs.map(a => ({
          verse_number: a.numberInSurah,
          translation: { text: a.text },
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
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
