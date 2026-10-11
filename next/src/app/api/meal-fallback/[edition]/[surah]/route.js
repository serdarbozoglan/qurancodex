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

import { ALQURAN_CLOUD_EDITIONS } from '@/lib/mealSources';

const UPSTREAM = 'https://api.alquran.cloud/v1';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { edition, surah } = await params;

  // ÜYELİK DENETİMİ (2026-10-10). Eskiden yalnız `^[a-z]{2}\.[a-z]+$` kalıbına
  // bakılıyordu; kalıba uyan ama var olmayan her edition upstream'e gidiyordu.
  // alquran.cloud bilinmeyen edition'da hata DÖNDÜRMÜYOR, sessizce varsayılana
  // düşüyor — aşağıdaki normalizer de onu geçerli bir meal gibi paketleyip 200
  // veriyordu. Canlıda ölçüldü: `tr.zzzzqqqwx` → 200, Türkçe meal yerine
  // Arapça Osmanlı hattı metin. Bir Kur'an sitesinde kabul edilemez; artık
  // yalnız karşılığı doğrulanmış 8 edition geçiyor.
  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114 || !ALQURAN_CLOUD_EDITIONS.has(edition)) {
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
      // 2026-08-20 — bkz. /api/meal/route.js'in aynı tarihli notu: 502 (5xx)
      // Vercel anomaly detection'ı yanlış tetikler, 424'e (4xx) çevrildi.
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 424,
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
      status: 424,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
