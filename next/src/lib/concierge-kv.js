// ─── concierge-kv.js ───────────────────────────────────────────────────────
// Vercel KV (Upstash Redis) wrapper — concierge query + feedback log.
//
// KV env vars yoksa (dev / KV kurulmamışsa) no-op (crash yok, log warn).
// Kod her deploy'da güvenli — user Vercel dashboard'da KV bağlayınca live olur.
//
// Data model:
//   query:{ts}          → { queryHash, query, lang, category, timestamp, ipHash, meta }
//   feedback:{ts}       → { queryHash, itemId, thumb, lang, timestamp, ipHash }
//   agg:query:{hash}    → aggregate stats
//   ZSET queries:by-time   score=ts, member=`query:{ts}`
//   ZSET feedback:by-time  score=ts, member=`feedback:{ts}`
//   ZSET agg:by-count      score=count, member=queryHash
//
// TTL: YOK (sonsuz arşiv — kullanıcı A opsiyonunu seçti 2026-07-14)
// ────────────────────────────────────────────────────────────────────────────

import { kv } from '@vercel/kv';

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export function isKvEnabled() {
  return KV_ENABLED;
}

// ── Query log
export async function logQuery(entry) {
  if (!KV_ENABLED) return;
  try {
    const ts = entry.timestamp || Date.now();
    const key = `query:${ts}`;
    await Promise.all([
      kv.set(key, entry),
      kv.zadd('queries:by-time', { score: ts, member: key }),
      updateQueryAggregate(entry, ts),
    ]);
  } catch (err) {
    console.error('[kv] logQuery failed:', err.message);
  }
}

async function updateQueryAggregate(entry, ts) {
  const aggKey = `agg:query:${entry.queryHash}`;
  try {
    const existing = (await kv.get(aggKey)) || {
      queryHash: entry.queryHash,
      query: entry.query,
      lang: entry.lang,
      count: 0,
      firstSeen: ts,
      lastSeen: ts,
      upCount: 0,
      downCount: 0,
      categories: {},
    };
    existing.count += 1;
    existing.lastSeen = ts;
    if (entry.category) {
      existing.categories[entry.category] = (existing.categories[entry.category] || 0) + 1;
    }
    // Query text update — son gelen ile refresh (rewrite'ları da yakalamak için)
    if (entry.query) existing.query = entry.query;
    await Promise.all([
      kv.set(aggKey, existing),
      kv.zadd('agg:by-count', { score: existing.count, member: entry.queryHash }),
    ]);
  } catch (err) {
    console.error('[kv] updateQueryAggregate failed:', err.message);
  }
}

// ── Feedback log
export async function logFeedback(entry) {
  if (!KV_ENABLED) return;
  try {
    const ts = entry.timestamp || Date.now();
    const key = `feedback:${ts}`;
    await Promise.all([
      kv.set(key, entry),
      kv.zadd('feedback:by-time', { score: ts, member: key }),
      updateAggregateFeedback(entry),
      updateItemAggregate(entry),  // Faz 3: item quality için
    ]);
  } catch (err) {
    console.error('[kv] logFeedback failed:', err.message);
  }
}

// Faz 3 — item bazlı feedback aggregate (verse:2:255, tefsir:2:255, atlas-kavram:iman gibi ID'ler)
async function updateItemAggregate(entry) {
  if (!entry.itemId || entry.itemId === 'response') return; // page-level feedback item boost'a girmez
  const itemKey = `item:${entry.itemId}`;
  try {
    const existing = (await kv.get(itemKey)) || { up: 0, down: 0, lastUpdated: Date.now() };
    if (entry.thumb === 'up') existing.up += 1;
    else if (entry.thumb === 'down') existing.down += 1;
    existing.lastUpdated = Date.now();
    await Promise.all([
      kv.set(itemKey, existing),
      kv.zadd('items:with-feedback', { score: (existing.up + existing.down), member: entry.itemId }),
    ]);
  } catch (err) {
    console.error('[kv] updateItemAggregate failed:', err.message);
  }
}

async function updateAggregateFeedback(entry) {
  const aggKey = `agg:query:${entry.queryHash}`;
  try {
    const existing = (await kv.get(aggKey)) || {
      queryHash: entry.queryHash,
      query: null,
      lang: entry.lang,
      count: 0,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      upCount: 0,
      downCount: 0,
      categories: {},
    };
    if (entry.thumb === 'up') existing.upCount += 1;
    else if (entry.thumb === 'down') existing.downCount += 1;
    await kv.set(aggKey, existing);
  } catch (err) {
    console.error('[kv] updateAggregateFeedback failed:', err.message);
  }
}

// ── Server-side response cache (Faz 2)
// Aynı sorgu bir daha geldiğinde LLM çağrısı YAPMADAN cache'ten döner.
// TTL 7 gün — corpus + prompt update'ler sonrası doğal invalidation.
// Sadece 'ok' + 'fetva_talebi' cache'lenir; reject/rewrite cache'lenmez.

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 gün

export async function getResponseCache(queryHash) {
  if (!KV_ENABLED) return null;
  try {
    const key = `cache:${queryHash}`;
    return await kv.get(key);
  } catch (err) {
    console.error('[kv] getResponseCache failed:', err.message);
    return null;
  }
}

export async function setResponseCache(queryHash, response) {
  if (!KV_ENABLED) return;
  try {
    const key = `cache:${queryHash}`;
    await kv.set(key, response, { ex: CACHE_TTL_SECONDS });
    // Track cache count via sorted set
    await kv.zadd('cache:by-time', { score: Date.now(), member: queryHash });
  } catch (err) {
    console.error('[kv] setResponseCache failed:', err.message);
  }
}

export async function getCacheStats() {
  if (!KV_ENABLED) return { count: 0 };
  try {
    const count = await kv.zcard('cache:by-time');
    return { count: count || 0 };
  } catch (err) {
    return { count: 0, error: err.message };
  }
}

// ── Admin read APIs
export async function listRecentQueries({ limit = 50, offset = 0 } = {}) {
  if (!KV_ENABLED) return [];
  try {
    // Reverse order — most recent first
    const keys = await kv.zrange('queries:by-time', offset, offset + limit - 1, { rev: true });
    if (!keys || keys.length === 0) return [];
    const values = await kv.mget(...keys);
    return values.filter(Boolean);
  } catch (err) {
    console.error('[kv] listRecentQueries failed:', err.message);
    return [];
  }
}

export async function listRecentFeedback({ limit = 50, offset = 0 } = {}) {
  if (!KV_ENABLED) return [];
  try {
    const keys = await kv.zrange('feedback:by-time', offset, offset + limit - 1, { rev: true });
    if (!keys || keys.length === 0) return [];
    const values = await kv.mget(...keys);
    return values.filter(Boolean);
  } catch (err) {
    console.error('[kv] listRecentFeedback failed:', err.message);
    return [];
  }
}

export async function listTopQueries({ limit = 50 } = {}) {
  if (!KV_ENABLED) return [];
  try {
    // Sorted by count desc
    const hashes = await kv.zrange('agg:by-count', 0, limit - 1, { rev: true });
    if (!hashes || hashes.length === 0) return [];
    const keys = hashes.map(h => `agg:query:${h}`);
    const values = await kv.mget(...keys);
    return values.filter(Boolean);
  } catch (err) {
    console.error('[kv] listTopQueries failed:', err.message);
    return [];
  }
}

export async function getStats() {
  if (!KV_ENABLED) return { kvEnabled: false };
  try {
    const [totalQueries, totalFeedback, totalUnique, cacheEntries, itemsFeedback] = await Promise.all([
      kv.zcard('queries:by-time'),
      kv.zcard('feedback:by-time'),
      kv.zcard('agg:by-count'),
      kv.zcard('cache:by-time'),
      kv.zcard('items:with-feedback'),
    ]);
    return {
      kvEnabled: true,
      totalQueries: totalQueries || 0,
      totalFeedback: totalFeedback || 0,
      totalUniqueQueries: totalUnique || 0,
      cacheEntries: cacheEntries || 0,
      itemsWithFeedback: itemsFeedback || 0,
    };
  } catch (err) {
    console.error('[kv] getStats failed:', err.message);
    return { kvEnabled: true, error: err.message };
  }
}

// ── Item quality (Faz 3 retrieval reranking)
// Bayesian smoothing with prior 3 up + 3 down (neutral).
// Cold start: total < MIN_FEEDBACK_FOR_BOOST → quality = 0.5 (no effect).
const MIN_FEEDBACK_FOR_BOOST = 20;
const PRIOR_UP = 3;
const PRIOR_DOWN = 3;

function computeQualityScore(up, down) {
  const total = up + down;
  if (total < MIN_FEEDBACK_FOR_BOOST) return 0.5; // neutral — no boost
  const smoothedUp = up + PRIOR_UP;
  const smoothedDown = down + PRIOR_DOWN;
  return smoothedUp / (smoothedUp + smoothedDown);
}

// Batch fetch — search'te top-N candidate için tek KV mget call
export async function getItemQualityScores(itemIds) {
  if (!KV_ENABLED || !itemIds || itemIds.length === 0) return {};
  try {
    const keys = itemIds.map(id => `item:${id}`);
    const values = await kv.mget(...keys);
    const scores = {};
    for (let i = 0; i < itemIds.length; i++) {
      const v = values[i];
      if (v) {
        const q = computeQualityScore(v.up || 0, v.down || 0);
        // Only return non-neutral scores (skip cold start)
        if (q !== 0.5) scores[itemIds[i]] = q;
      }
    }
    return scores;
  } catch (err) {
    console.error('[kv] getItemQualityScores failed:', err.message);
    return {};
  }
}

// Admin: top boosted + demoted items
export async function getItemsWithFeedback({ limit = 50, minFeedback = MIN_FEEDBACK_FOR_BOOST } = {}) {
  if (!KV_ENABLED) return [];
  try {
    // Items with most feedback (any direction)
    const ids = await kv.zrange('items:with-feedback', 0, -1, { rev: true, withScores: true });
    if (!ids || ids.length === 0) return [];
    // zrange with withScores returns flat array [member, score, member, score, ...]
    const pairs = [];
    for (let i = 0; i < ids.length; i += 2) {
      pairs.push({ id: ids[i], totalFeedback: Number(ids[i + 1]) });
    }
    const filtered = pairs.filter(p => p.totalFeedback >= 1); // en az 1 feedback
    if (filtered.length === 0) return [];
    const keys = filtered.map(p => `item:${p.id}`);
    const values = await kv.mget(...keys);
    const items = filtered.map((p, i) => {
      const v = values[i] || {};
      const up = v.up || 0;
      const down = v.down || 0;
      const total = up + down;
      const quality = computeQualityScore(up, down);
      const boosted = total >= minFeedback;
      return {
        itemId: p.id,
        up,
        down,
        total,
        quality: Number(quality.toFixed(3)),
        boost: boosted ? Number((0.3 * (quality - 0.5)).toFixed(3)) : 0,
        lastUpdated: v.lastUpdated || null,
      };
    });
    // Sort: boosted items first (by quality delta magnitude)
    items.sort((a, b) => Math.abs(b.boost) - Math.abs(a.boost));
    return items.slice(0, limit);
  } catch (err) {
    console.error('[kv] getItemsWithFeedback failed:', err.message);
    return [];
  }
}

// ── Cache purge (admin action)
export async function purgeAllCache() {
  if (!KV_ENABLED) return { purged: 0 };
  try {
    const hashes = await kv.zrange('cache:by-time', 0, -1);
    if (!hashes || hashes.length === 0) return { purged: 0 };
    const cacheKeys = hashes.map(h => `cache:${h}`);
    await kv.del(...cacheKeys);
    await kv.del('cache:by-time');
    return { purged: hashes.length };
  } catch (err) {
    return { purged: 0, error: err.message };
  }
}
