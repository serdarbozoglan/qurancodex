// ─── /api/admin/queries — admin dashboard data ────────────────────────────
// Concierge query + feedback + aggregate arşivini döner.
//
// Auth: Authorization header ile Bearer token karşılaştırması.
// Env: ADMIN_TOKEN (Vercel dashboard'da set edilecek)
//
// Query params:
//   ?view=recent    — son N sorgu (default 50)
//   ?view=top       — en çok sorulan (aggregate count sort)
//   ?view=feedback  — son N feedback
//   ?view=stats     — toplam sayılar
//   ?limit=N        — kaç kayıt döner (default 50, max 500)
//   ?offset=N       — pagination
// ────────────────────────────────────────────────────────────────────────────

import { listRecentQueries, listRecentFeedback, listTopQueries, getStats, isKvEnabled, purgeAllCache, getItemsWithFeedback } from '@/lib/concierge-kv';
import { checkRateLimit, getClientIp } from '@/lib/concierge-ratelimit';

export const runtime = 'nodejs';

// Token denemesi için hız sınırı (2026-10-10). Bearer karşılaştırması tek
// başına sınırsız tahmin hakkı veriyordu: doğru token uzun ve rastgele olsa
// bile deneme sayısını bağlamamak için bir sebep yok. Sayaç IP başına ve
// `concierge-ratelimit`'in bellek içi kovasında — bu uç noktaya meşru trafik
// yalnız yönetici panelinden geldiği için örnekler arası KV sayacına gerek
// yok; kötüye kullanımı yavaşlatmak yeterli.
const ADMIN_RL = { max: 10, windowMs: 60_000, key: 'admin' };

function checkAuth(request) {
  // Sınır AUTH'TAN ÖNCE tüketilir; aksi halde yanlış token hiç sayılmaz ve
  // kova tam da korumak istediğimiz durumda boş kalırdı.
  const rl = checkRateLimit(getClientIp(request), ADMIN_RL);
  if (!rl.ok) return { ok: false, error: 'rate_limited', status: 429, resetAt: rl.resetAt };
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return { ok: false, error: 'ADMIN_TOKEN env var not set on server', status: 401 };
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== expected) return { ok: false, error: 'invalid_token', status: 401 };
  return { ok: true };
}

// İki fiil de aynı reddi döndürür; 401 ile 429 ayrı anlam taşır.
function denied(auth) {
  return Response.json(
    { error: auth.error, ...(auth.resetAt ? { resetAt: auth.resetAt } : {}) },
    { status: auth.status || 401 }
  );
}

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.ok) return denied(auth);

  const url = new URL(request.url);
  const view = url.searchParams.get('view') || 'recent';
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 500);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  if (!isKvEnabled()) {
    return Response.json({
      view,
      kvEnabled: false,
      message: 'Vercel KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN env vars.',
      data: [],
    });
  }

  try {
    let data;
    switch (view) {
      case 'recent':
        data = await listRecentQueries({ limit, offset });
        break;
      case 'top':
        data = await listTopQueries({ limit });
        break;
      case 'feedback':
        data = await listRecentFeedback({ limit, offset });
        break;
      case 'items':
        data = await getItemsWithFeedback({ limit });
        break;
      case 'stats':
        data = await getStats();
        break;
      default:
        return Response.json({ error: 'invalid_view' }, { status: 400 });
    }
    return Response.json({ view, kvEnabled: true, data });
  } catch (err) {
    console.error('[admin] error:', err);
    return Response.json({ error: 'internal_error', message: err.message }, { status: 500 });
  }
}

// POST — admin actions (currently: cache purge)
export async function POST(request) {
  const auth = checkAuth(request);
  if (!auth.ok) return denied(auth);

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (!isKvEnabled()) {
    return Response.json({ error: 'kv_not_enabled' }, { status: 400 });
  }

  if (action === 'purge_cache') {
    const result = await purgeAllCache();
    return Response.json(result);
  }

  return Response.json({ error: 'invalid_action' }, { status: 400 });
}
