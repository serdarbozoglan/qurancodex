// ─── /api/concierge — RAG Semantik Concierge endpoint ──────────────────────
// User query → BGE-M3 embed → cosine search → Claude Haiku curate → JSON
//
// Node runtime (not edge) — corpus-embeddings.json 75 MB module-level cache.
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import { embedQuery } from '@/lib/concierge-embed';
import { conciergeSearch, applyQualityBoost, extractItemIds } from '@/lib/concierge-search';
import { conciergeKeywordSearch } from '@/lib/concierge-keyword-search';
import { runConcierge } from '@/lib/concierge-claude';
import { hydrateResponse } from '@/lib/concierge-hydrate';
import { checkRateLimit, getClientIp } from '@/lib/concierge-ratelimit';
import { consumeBudget, checkRateLimitKv } from '@/lib/concierge-budget';
import { runGuardrails, FETVA_DISCLAIMER } from '@/lib/concierge-guardrails';
import { logQuery, getResponseCache, setResponseCache, getItemQualityScores } from '@/lib/concierge-kv';

// Query hash — stable identifier for feedback + cache curation. Deterministic
// SHA-256 of normalized (lowercase, trim, whitespace-collapse) query + lang.
function computeQueryHash(query, lang) {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(`${normalized}|${lang}`).digest('hex').slice(0, 16);
}

// Günlük bütçe dolduğunda LLM'siz sonuç üretir. `grouped` (retrieval çıktısı)
// doğrudan hydrateResponse'un beklediği şemaya çevrilir; Claude çağrılmaz.
// Sıralama retrieval skorundan gelir, bu yüzden "curate" edilmemiş ama alâkalı
// sonuçlar döner. `reason` alanı boş bırakılır — uydurma gerekçe yazmıyoruz.
const DEGRADED_BUCKETS = {
  verses: ['verse'],
  tafsirs: ['tefsir'],
  articles: ['article', 'article-section'],
  tools: ['tool'],
  atlases: ['atlas-kissa', 'atlas-kissa-scene', 'atlas-kavim', 'atlas-esma',
    'atlas-dua', 'atlas-kavram', 'atlas-ahiret-yolculugu-stage'],
};

function buildDegradedResult(grouped, lang, reason) {
  const out = { intro: '', closing: '' };
  for (const [field, types] of Object.entries(DEGRADED_BUCKETS)) {
    const seen = new Set();
    out[field] = types
      .flatMap(t => grouped[t] || [])
      .map(entry => entry?.item?.id)
      .filter(id => id && !seen.has(id) && seen.add(id))
      .slice(0, 5)
      .map(id => ({ id, reason: '' }));
  }
  // Degrade metni (2026-08-14 yeniden yazıldı — kullanıcı geri bildirimi).
  //
  // Öncesi: "Bugünkü yapay zekâ kotası doldu; ... Yarın tekrar deneyebilirsin."
  // Üç sorun vardı:
  //   1. Sistemin iç mekaniğini ("yapay zekâ kotası") kullanıcının önüne
  //      koyuyordu — okuyan "site bozuldu" sanıyor.
  //   2. KİŞİSEL kota ile SİTE GENELİ bütçeyi ayırt etmiyordu; oysa çoğu
  //      durumda dolan yalnız o kullanıcının günlük payı (`reason === 'ip'`).
  //   3. Kaybedileni söylüyordu, VERİLENİ değil. Oysa degrade modda âyetler
  //      hâlâ gerçek arama sonucudur; eksik olan yalnız yorum/giriş metni —
  //      ki sitenin kendi duruşu zaten "sistem yorum katmaz, rehberlik eder".
  const personal = reason === 'ip';
  out.intro = lang === 'tr'
    ? (personal
        ? 'Bugünlük rehber notların tamamlandı — aşağıdakiler doğrudan âyet ve içerik eşleşmeleri. Arama tam çalışıyor; yalnız yorum katmanı yarın yenileniyor.'
        : 'Rehber notları şu an yoğunluk nedeniyle kapalı — aşağıdakiler doğrudan âyet ve içerik eşleşmeleri. Arama tam çalışıyor.')
    : (personal
        ? "You've used today's guided notes — the results below are direct verse and content matches. Search is fully working; the commentary layer refreshes tomorrow."
        : 'Guided notes are paused due to load — the results below are direct verse and content matches. Search is fully working.');
  return out;
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

  // Rate limit — önce KV (örnekler arası GERÇEK limit), KV yoksa in-memory.
  // In-memory Map her serverless örneğinde ayrı yaşadığı ve cold start'ta
  // sıfırlandığı için tek başına yeterli değildi (2026-08-13).
  const ip = getClientIp(request);
  const rlKv = await checkRateLimitKv(ip, { max: 20, windowSeconds: 60, prefix: 'rl:concierge' });
  const rl = rlKv.enabled ? rlKv : checkRateLimit(ip);
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
  // #178 (2026-07-17) — search modu: 'semantic' (default, BGE-M3 cosine) veya
  // 'keyword' (klasik anahtar-kelime tam metin arama). Keyword modu embed
  // atlar → daha hızlı (~50 ms) + Claude curate aynı pipeline'a bağlanır.
  const mode = body?.mode === 'keyword' ? 'keyword' : 'semantic';
  const validationError = validateQuery(query, lang);
  if (validationError) {
    return Response.json({ error: 'invalid_query', message: validationError }, { status: 400 });
  }

  const timings = {};
  const originalQuery = query;
  // Query hash mode-aware: aynı query keyword vs semantic'te farklı cache
  // key üretir — sonuç setleri farklı olabilir.
  const preHash = computeQueryHash(`${mode}:${query}`, lang);

  try {
    // 0a. Server-side response cache lookup (Faz 2)
    // Aynı sorgu daha önce cache'lendiyse LLM pipeline'ı skip et.
    // TTL 7 gün; corpus/prompt update sonrası doğal invalidation.
    const tC = Date.now();
    const cached = await getResponseCache(preHash);
    timings.cacheLookup = Date.now() - tC;
    if (cached) {
      timings.total = Date.now() - startTs;
      // Cache hit'i de query log'a yaz — await ile safe (Vercel fire-and-forget değil)
      try {
        await logQuery({
          queryHash: preHash,
          query: originalQuery,
          lang,
          mode,
          category: cached.meta?.guardrails?.category || 'ok',
          rejected: false,
          cacheHit: true,
          candidateCount: cached.meta?.candidateCount || 0,
          timingTotal: timings.total,
          ipHash: ip ? ip.slice(0, 8) : null,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error('[concierge] cache-hit logQuery failed:', err.message);
      }
      return Response.json({
        ...cached,
        cached: true,
        meta: {
          ...cached.meta,
          timings,
          rateLimit: { remaining: rl.remaining, resetAt: rl.resetAt },
        },
      }, {
        headers: {
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-Cache': 'HIT',
          'Cache-Control': 'private, no-store',
        },
      });
    }

    // 0b. Bütçe — bu noktaya gelen istek cache'te YOK, yani para harcayacak.
    // Sayaç tam burada artırılır; cache hit'lerde artırılmaz (bedava istek
    // ücretli sayılmasın). Guardrails'ten ÖNCE olmalı: K2/K3 katmanları da
    // Anthropic çağırıyor. Tavan dolduysa istek reddedilmez — LLM'siz
    // anahtar kelime moduna düşer. Kullanıcı sonuç alır, fatura büyümez.
    const budget = await consumeBudget(ip);
    const degraded = !budget.ok;
    if (degraded) {
      console.warn(`[concierge] budget exhausted (${budget.reason}) — degrading to keyword. global=${budget.globalUsed}/${budget.limit} ip=${budget.ipUsed}/${budget.ipLimit}`);
    }

    // 0c. Guardrails — 3-katmanlı adaptive pipeline
    // (regex prefilter → LLM classifier (adaptive) → LLM rewrite (adaptive))
    // Rejected queries returned early with warm message + suggestion chips.
    const tG = Date.now();
    const guard = await runGuardrails(query, lang, { skipLlm: degraded });
    timings.guardrails = Date.now() - tG;

    if (guard.verdict === 'reject') {
      const queryHash = computeQueryHash(`${mode}:${originalQuery}`, lang);
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
      // KV log — admin arşivi (await ile safe)
      try {
        await logQuery({
          queryHash,
          query: originalQuery,
          lang,
          mode,
          category: guard.category, // 'reject' | 'off_topic'
          rejected: true,
          rejectReason: guard.reason,
          ipHash,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error('[concierge] reject logQuery failed:', err.message);
      }
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

    const effectiveMode = degraded ? 'keyword' : mode;

    // 1. Embed query (semantic mode only) — degraded modda embed de atlanır
    let queryEmb = null;
    if (effectiveMode === 'semantic') {
      const t0 = Date.now();
      queryEmb = await embedQuery(effectiveQuery);
      timings.embed = Date.now() - t0;
    } else {
      timings.embed = 0;
    }

    // 2. Search — mode branch
    const t1 = Date.now();
    let grouped;
    if (effectiveMode === 'keyword') {
      grouped = conciergeKeywordSearch(effectiveQuery, lang);
    } else {
      grouped = conciergeSearch(queryEmb, lang);
    }
    timings.search = Date.now() - t1;

    // 2b. Faz 3 — item quality boost/demote (feedback-driven reranking)
    // KV'de itemler için upCount/downCount aggregate var; retrieval sonrası
    // final_score = cosine * (1 + 0.3 * (quality - 0.5)) uygulanır.
    // Sadece feedback ≥ 20 olan itemlerde etkili (cold start protection).
    const tQ = Date.now();
    const candidateIds = extractItemIds(grouped);
    if (candidateIds.length > 0) {
      const qualityScores = await getItemQualityScores(candidateIds);
      if (Object.keys(qualityScores).length > 0) {
        grouped = applyQualityBoost(grouped, qualityScores);
      }
    }
    timings.qualityBoost = Date.now() - tQ;

    // Count total candidates
    const candidateCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    if (candidateCount === 0) {
      return Response.json({
        error: 'no_candidates',
        message: lang === 'tr' ? 'Bu sorguya yakın içerik bulunamadı.' : 'No content matching this query.',
        timings,
      }, { status: 404 });
    }

    // 3. Claude curate — bütçe dolmuşsa ATLANIR.
    // Maliyetin tamamı bu adımda; degraded modda retrieval sonuçları
    // doğrudan hydrate şemasına çevrilip döndürülür (LLM çağrısı yok).
    const t2 = Date.now();
    let parsed, usage = null;
    if (degraded) {
      parsed = buildDegradedResult(grouped, lang, budget.reason);
      timings.claude = 0;
    } else {
      ({ parsed, usage } = await runConcierge({ query: effectiveQuery, grouped, lang }));
      timings.claude = Date.now() - t2;
    }

    // 4. Hydrate with full item details (halisinasyon guard)
    const hydrated = hydrateResponse(parsed, lang);
    timings.total = Date.now() - startTs;

    const queryHash = computeQueryHash(`${mode}:${originalQuery}`, lang);
    const ipHash = ip ? ip.slice(0, 8) : null;

    // KV log — Vercel serverless fire-and-forget güvenli DEĞİL (response
    // sonrası eventLoop task'lar drop olur). Await ile try/catch içinde
    // bloklayan yazım — latency ~30-50 ms artar ama data garantili yazılır.
    try {
      await logQuery({
        queryHash,
        query: originalQuery,
        effectiveQuery: guard.rewritten ? effectiveQuery : null,
        lang,
        mode,
        category: guard.category,
        rejected: false,
        cacheHit: false,
        degraded,
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
      });
    } catch (err) {
      console.error('[concierge] logQuery failed:', err.message);
    }

    const responsePayload = {
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
        degraded,
        budget: budget.enabled
          ? { used: budget.globalUsed, limit: budget.limit, reason: budget.reason || null }
          : null,
      },
    };

    // Faz 2: cache'e yaz (sadece ok + fetva_talebi, TTL 7 gün) — await ile safe.
    // DEGRADED sonuç ASLA cache'lenmez: 7 gün boyunca LLM'siz cevabı servis
    // etmek, bütçe ertesi gün sıfırlansa bile kaliteyi kalıcı düşürürdü.
    if (!degraded && (guard.category === 'ok' || guard.category === 'fetva_talebi')) {
      try {
        await setResponseCache(preHash, responsePayload);
      } catch (err) {
        console.error('[concierge] setResponseCache failed:', err.message);
      }
    }

    return Response.json(responsePayload, {
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.resetAt),
        'X-Cache': 'MISS',
        'X-Degraded': degraded ? '1' : '0',
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
