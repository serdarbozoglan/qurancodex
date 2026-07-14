// ─── /api/concierge — RAG Semantik Concierge endpoint ──────────────────────
// User query → BGE-M3 embed → cosine search → Claude Haiku curate → JSON
//
// Node runtime (not edge) — corpus-embeddings.json 75 MB module-level cache.
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import { embedQuery } from '@/lib/concierge-embed';
import { conciergeSearch } from '@/lib/concierge-search';
import { runConcierge } from '@/lib/concierge-claude';
import { hydrateResponse } from '@/lib/concierge-hydrate';
import { checkRateLimit, getClientIp } from '@/lib/concierge-ratelimit';
import { runGuardrails, FETVA_DISCLAIMER } from '@/lib/concierge-guardrails';
import { logQuery } from '@/lib/concierge-kv';

// Query hash — stable identifier for feedback + cache curation. Deterministic
// SHA-256 of normalized (lowercase, trim, whitespace-collapse) query + lang.
function computeQueryHash(query, lang) {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(`${normalized}|${lang}`).digest('hex').slice(0, 16);
}

// Node runtime — corpus JSON file access + big memory
export const runtime = 'nodejs';
export const maxDuration = 25; // Vercel limit for Hobby plan

// Input validation
function validateQuery(q, lang) {
  if (typeof q !== 'string') return 'query must be a string';
  const trimmed = q.trim();
  if (trimmed.length < 3) return 'query too short (min 3 chars)';
  if (trimmed.length > 300) return 'query too long (max 300 chars)';
  if (lang && !['tr', 'en'].includes(lang)) return 'invalid lang (must be tr or en)';
  return null;
}

export async function POST(request) {
  const startTs = Date.now();

  // Rate limit
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      { error: 'rate_limited', message: 'Too many requests. Try again later.', resetAt: rl.resetAt },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetAt) } }
    );
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const query = (body?.q || body?.query || '').trim();
  const lang = body?.lang === 'en' ? 'en' : 'tr';
  const validationError = validateQuery(query, lang);
  if (validationError) {
    return Response.json({ error: 'invalid_query', message: validationError }, { status: 400 });
  }

  const timings = {};
  const originalQuery = query;

  try {
    // 0. Guardrails — 3-katmanlı adaptive pipeline
    // (regex prefilter → LLM classifier (adaptive) → LLM rewrite (adaptive))
    // Rejected queries returned early with warm message + suggestion chips.
    const tG = Date.now();
    const guard = await runGuardrails(query, lang);
    timings.guardrails = Date.now() - tG;

    if (guard.verdict === 'reject') {
      const queryHash = computeQueryHash(originalQuery, lang);
      const ipHash = ip ? ip.slice(0, 8) : null;
      // Structured log — for false-positive review (Bölüm F rejection log).
      console.log(JSON.stringify({
        type: 'concierge_rejection',
        ts: new Date().toISOString(),
        queryHash,
        category: guard.category,
        reason: guard.reason,
        regexReason: guard.meta?.regex?.reason || null,
        lang,
        ipHash,
      }));
      // KV log — admin arşivi
      logQuery({
        queryHash,
        query: originalQuery,
        lang,
        category: guard.category, // 'reject' | 'off_topic'
        rejected: true,
        rejectReason: guard.reason,
        ipHash,
        timestamp: Date.now(),
      }).catch(() => {}); // fire-and-forget
      return Response.json({
        query: originalQuery,
        lang,
        rejected: true,
        rejection: {
          category: guard.category,
          message: guard.message,
          suggestions: guard.suggestions,
        },
        meta: {
          timings,
          queryHash: computeQueryHash(originalQuery, lang),
          rateLimit: { remaining: rl.remaining, resetAt: rl.resetAt },
          guardrails: guard.meta,
        },
      }, {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rl.remaining),
          'Cache-Control': 'private, no-store',
        },
      });
    }

    // Guardrails proceed — use possibly-rewritten query for retrieval,
    // but preserve original for logging/UX.
    const effectiveQuery = guard.query;

    // 1. Embed query
    const t0 = Date.now();
    const queryEmb = await embedQuery(effectiveQuery);
    timings.embed = Date.now() - t0;

    // 2. Search
    const t1 = Date.now();
    const grouped = conciergeSearch(queryEmb, lang);
    timings.search = Date.now() - t1;

    // Count total candidates
    const candidateCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    if (candidateCount === 0) {
      return Response.json({
        error: 'no_candidates',
        message: lang === 'tr' ? 'Bu sorguya yakın içerik bulunamadı.' : 'No content matching this query.',
        timings,
      }, { status: 404 });
    }

    // 3. Claude curate
    const t2 = Date.now();
    const { parsed, usage } = await runConcierge({ query: effectiveQuery, grouped, lang });
    timings.claude = Date.now() - t2;

    // 4. Hydrate with full item details (halisinasyon guard)
    const hydrated = hydrateResponse(parsed, lang);
    timings.total = Date.now() - startTs;

    const queryHash = computeQueryHash(originalQuery, lang);
    const ipHash = ip ? ip.slice(0, 8) : null;

    // KV log — admin arşivi (async, non-blocking)
    logQuery({
      queryHash,
      query: originalQuery,
      effectiveQuery: guard.rewritten ? effectiveQuery : null,
      lang,
      category: guard.category, // 'ok' | 'rewrite' | 'fetva_talebi'
      rejected: false,
      candidateCount,
      resultsCount: {
        verses: hydrated.verses?.length || 0,
        tafsirs: hydrated.tafsirs?.length || 0,
        atlases: hydrated.atlases?.length || 0,
        articles: hydrated.articles?.length || 0,
        tools: hydrated.tools?.length || 0,
      },
      timingTotal: timings.total,
      ipHash,
      timestamp: Date.now(),
    }).catch(() => {});

    return Response.json({
      query: originalQuery,
      effectiveQuery,
      lang,
      response: hydrated,
      rewritten: guard.rewritten ? { from: originalQuery, to: effectiveQuery } : null,
      fetvaDisclaimer: guard.category === 'fetva_talebi' ? FETVA_DISCLAIMER[lang] : null,
      meta: {
        timings,
        usage,
        candidateCount,
        queryHash,
        rateLimit: { remaining: rl.remaining, resetAt: rl.resetAt },
        guardrails: { category: guard.category, reason: guard.reason },
      },
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.resetAt),
        // Prevent CDN caching (each query unique)
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[concierge] error:', err);
    return Response.json({
      error: 'internal_error',
      message: err.message || 'Unknown error',
      timings,
    }, { status: 500 });
  }
}

// Health check (GET)
export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: '/api/concierge',
    method: 'POST',
    body: { q: 'string (3-300 chars)', lang: '"tr" | "en"' },
  });
}
