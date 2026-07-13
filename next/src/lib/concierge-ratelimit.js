// ─── concierge-ratelimit.js ─────────────────────────────────────────────────
// In-memory rate limit: 20 requests per IP per minute.
// MVP: node process memory (Vercel serverless — resets on cold start).
// Scale-up: Upstash Redis (persistent across instances).
// ────────────────────────────────────────────────────────────────────────────

const buckets = new Map(); // ip → { count, resetAt }
const WINDOW_MS = 60_000;   // 1 minute
const MAX_REQ = 20;         // 20 requests per window per IP

export function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    // New or expired window
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    // Housekeeping: clean up old entries every ~100 requests
    if (buckets.size > 100) cleanup(now);
    return { ok: true, remaining: MAX_REQ - 1, resetAt: now + WINDOW_MS };
  }

  if (bucket.count >= MAX_REQ) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: MAX_REQ - bucket.count, resetAt: bucket.resetAt };
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
