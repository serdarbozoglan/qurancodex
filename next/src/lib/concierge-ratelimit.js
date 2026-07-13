// ─── concierge-ratelimit.js ─────────────────────────────────────────────────
// In-memory rate limit: 20 requests per IP per minute.
// MVP: node process memory (Vercel serverless — resets on cold start).
// Scale-up: Upstash Redis (persistent across instances).
// ────────────────────────────────────────────────────────────────────────────

const buckets = new Map(); // key → { count, resetAt }
const WINDOW_MS = 60_000;   // 1 minute default
const MAX_REQ = 20;         // 20 requests per window per IP default

// checkRateLimit(ip, opts?) — opts: { max, windowMs, key }
// `key` is a prefix so different endpoints get independent buckets
// (concierge search vs feedback have different budgets).
export function checkRateLimit(ip, opts = {}) {
  const max = opts.max ?? MAX_REQ;
  const windowMs = opts.windowMs ?? WINDOW_MS;
  const bucketKey = opts.key ? `${opts.key}:${ip}` : ip;
  const now = Date.now();
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt < now) {
    // New or expired window
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    // Housekeeping: clean up old entries every ~100 requests
    if (buckets.size > 100) cleanup(now);
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= max) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}

function cleanup(now) {
  for (const [ip, bucket] of buckets.entries()) {
    if (bucket.resetAt < now) buckets.delete(ip);
  }
}

export function getClientIp(req) {
  // Vercel deployment: x-forwarded-for or x-real-ip
  const fwd = req.headers.get?.('x-forwarded-for') || req.headers.get?.('x-real-ip');
  if (fwd) return fwd.split(',')[0].trim();
  return 'unknown';
}
