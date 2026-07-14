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

import { listRecentQueries, listRecentFeedback, listTopQueries, getStats, isKvEnabled, purgeAllCache } from '@/lib/concierge-kv';

export const runtime = 'nodejs';

function checkAuth(request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return { ok: false, error: 'ADMIN_TOKEN env var not set on server' };
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== expected) return { ok: false, error: 'invalid_token' };
  return { ok: true };
}

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: 401 });
  }

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
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });

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
