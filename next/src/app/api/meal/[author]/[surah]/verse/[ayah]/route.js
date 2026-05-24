// ─── Verse-level meal proxy — Faz 6.3 ────────────────────────────────────────
// Tek ayetin meal'i. fetchMealVerse fallback'i için (whole surah hit etmedi
// veya verse yok). Çoğu çağrı whole-surah cache'e düşüp burayı çağırmaz.

const UPSTREAM = 'https://api.acikkuran.com';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { author, surah, ayah } = await params;

  const s = parseInt(surah, 10);
  const a = parseInt(ayah, 10);
  const au = parseInt(author, 10);
  if (
    Number.isNaN(s) || s < 1 || s > 114 ||
    Number.isNaN(a) || a < 1 ||
    Number.isNaN(au) || au < 1
  ) {
    return new Response(JSON.stringify({ error: 'invalid params' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${UPSTREAM}/surah/${s}/verse/${a}?author=${au}`, {
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
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
