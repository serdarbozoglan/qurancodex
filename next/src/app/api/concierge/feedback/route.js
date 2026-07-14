// ─── /api/concierge/feedback — kullanıcı thumbs feedback endpoint ───────────
// Concierge sonuç kartlarındaki 👍/👎 butonlarından POST alır.
// MVP: structured JSON logging (Vercel Logs'ta görünür). Faz 1b'de Vercel KV
// persistence eklenir; şimdilik sadece observability + rate limit.
//
// Body: { queryHash: string, itemId: string, thumb: 'up' | 'down', lang?: 'tr'|'en' }
// ────────────────────────────────────────────────────────────────────────────

import { checkRateLimit, getClientIp } from '@/lib/concierge-ratelimit';
import { logFeedback } from '@/lib/concierge-kv';

export const runtime = 'nodejs';
export const maxDuration = 5;

// Validation
const VALID_THUMBS = new Set(['up', 'down']);
function validate(body) {
  if (!body || typeof body !== 'object') return 'body_required';
  const { queryHash, itemId, thumb } = body;
  if (typeof queryHash !== 'string' || queryHash.length < 4 || queryHash.length > 64) {
    return 'invalid_queryHash';
  }
  // itemId opsiyonel — verilmezse "response" (page-level feedback)
  if (itemId !== undefined && (typeof itemId !== 'string' || itemId.length < 2 || itemId.length > 128)) {
    return 'invalid_itemId';
  }
  if (!VALID_THUMBS.has(thumb)) return 'invalid_thumb';
  if (body.lang && !['tr', 'en'].includes(body.lang)) return 'invalid_lang';
  return null;
}

export async function POST(request) {
  // Rate limit — feedback endpoint kendi limit'ini kullanır (concierge ile ayrı).
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, { max: 60, windowMs: 60_000, key: 'concierge_fb' });
  if (!rl.ok) {
    return Response.json(
      { error: 'rate_limited', resetAt: rl.resetAt },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const err = validate(body);
  if (err) return Response.json({ error: err }, { status: 400 });

  const { queryHash, thumb } = body;
  const itemId = body.itemId || 'response'; // Page-level feedback için varsayılan
  const lang = body.lang === 'en' ? 'en' : 'tr';

  const ipHash = ip ? ip.slice(0, 8) : null;
  const ts = Date.now();

  // Structured log — Vercel Logs Query ile grep + aggregate mümkün.
  console.log(JSON.stringify({
    type: 'concierge_feedback',
    ts: new Date(ts).toISOString(),
    queryHash,
    itemId,
    thumb,
    lang,
    ipHash,
  }));

  // KV log — admin arşivi + aggregate feedback güncelle (async, non-blocking)
  logFeedback({
    queryHash,
    itemId,
    thumb,
    lang,
    ipHash,
    timestamp: ts,
  }).catch(() => {});

  return Response.json(
    { ok: true },
    { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } }
  );
}

// Health check
export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: '/api/concierge/feedback',
    method: 'POST',
    body: { queryHash: 'string (4-64)', itemId: 'string (2-128)', thumb: '"up" | "down"', lang: '"tr" | "en"' },
  });
}
