// ─── concierge-budget.js ────────────────────────────────────────────────────
// LLM harcaması için üst sınır. KV (Upstash Redis) tabanlı — bu yüzden
// Vercel'in kaç serverless örneği açtığından bağımsız olarak GERÇEK bir sınır.
//
// Neden gerekliydi (2026-08-13):
//   concierge-ratelimit.js limiti process belleğinde bir Map'te tutar. Vercel'de
//   her örneğin kendi belleği vardır ve yük altında örnek sayısı artar; ayrıca
//   cold start'ta sayaç sıfırlanır. Dolayısıyla "IP başına 20 istek/dakika"
//   pratikte "IP başına 20 istek/dakika × örnek sayısı" demekti — kötüye
//   kullanıma karşı anlamlı bir engel değil. Fatura kullanıcının cebinden
//   çıktığı için harcamayı ÜSTTEN bağlayan bir sayaç şarttı.
//
// Üç katman:
//   1. Günlük global tavan   — bütün sitede toplam LLM çağrısı (varsayılan 500)
//   2. IP başına günlük tavan — tek kişinin bütün kotayı yemesini engeller
//   3. IP başına dakikalık     — mevcut in-memory limiter'ın KV'li muadili
//
// Tavan dolduğunda istek REDDEDİLMEZ: çağıran taraf `degraded` moda geçip
// LLM'siz (anahtar kelime) sonuç döndürür. Kullanıcı bir şey alır, para gitmez.
//
// KV yoksa (local dev / KV bağlı değilse) hepsi `ok:true` döner — mevcut
// in-memory limiter devrede kalır, davranış bozulmaz.
// ────────────────────────────────────────────────────────────────────────────

import { kv } from '@vercel/kv';

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Günlük global LLM çağrısı tavanı. Sorgu başına kabaca $0.01 (Haiku 4.5
// curate + BGE-M3 embed) → 500 çağrı ≈ günde $5 üst sınır.
// Env ile override edilebilir ki tavanı değiştirmek için deploy gerekmesin.
export const DAILY_LLM_BUDGET = Number(process.env.CONCIERGE_DAILY_BUDGET || 500);

// Tek bir IP'nin günde tüketebileceği LLM çağrısı. Global tavanın %10'u.
export const IP_DAILY_QUOTA = Number(process.env.CONCIERGE_IP_DAILY_QUOTA || 50);

// Sayaç anahtarları iki gün sonra düşsün — gün dönümünde yarış olmasın.
const COUNTER_TTL_SECONDS = 48 * 60 * 60;

// UTC gün damgası. Sunucu saat dilimi değişse de anahtar kaymasın diye UTC.
function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// IP'yi düz metin saklamıyoruz — KV'de yalnız kısa hash duruyor.
function hashIp(ip) {
  let h = 0;
  const s = String(ip || 'unknown');
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

// INCR + ilk yazımda EXPIRE. Hata durumunda null döner (fail-open).
async function bumpCounter(key) {
  try {
    const n = await kv.incr(key);
    if (n === 1) await kv.expire(key, COUNTER_TTL_SECONDS);
    return n;
  } catch (err) {
    console.warn('[concierge-budget] counter bump failed:', key, err?.message);
    return null;
  }
}

// ── Okuma — sayacı ARTIRMADAN mevcut durumu döndürür ────────────────────────
// Cache hit'lerde bütçe tüketilmediği için önce bununla bakılır.
export async function peekBudget(ip) {
  if (!KV_ENABLED) {
    return { enabled: false, ok: true, globalUsed: 0, ipUsed: 0, limit: DAILY_LLM_BUDGET };
  }
  const day = todayKey();
  try {
    const [g, p] = await Promise.all([
      kv.get(`budget:llm:${day}`),
      kv.get(`budget:ip:${hashIp(ip)}:${day}`),
    ]);
    const globalUsed = Number(g || 0);
    const ipUsed = Number(p || 0);
    return {
      enabled: true,
      ok: globalUsed < DAILY_LLM_BUDGET && ipUsed < IP_DAILY_QUOTA,
      reason: globalUsed >= DAILY_LLM_BUDGET ? 'global'
        : ipUsed >= IP_DAILY_QUOTA ? 'ip'
        : null,
      globalUsed,
      ipUsed,
      limit: DAILY_LLM_BUDGET,
      ipLimit: IP_DAILY_QUOTA,
    };
  } catch (err) {
    // KV okunamıyorsa servisi kilitleme — fail-open.
    console.warn('[concierge-budget] peek failed:', err?.message);
    return { enabled: true, ok: true, globalUsed: 0, ipUsed: 0, limit: DAILY_LLM_BUDGET, degradedRead: true };
  }
}

// ── Tüketim — LLM çağrısı YAPILMADAN HEMEN ÖNCE çağrılır ───────────────────
// Cache hit'te ÇAĞIRMA; yoksa bedava isteği ücretli saymış olursun.
export async function consumeBudget(ip) {
  if (!KV_ENABLED) {
    return { enabled: false, ok: true, globalUsed: 0, ipUsed: 0, limit: DAILY_LLM_BUDGET };
  }
  const day = todayKey();
  const [globalUsed, ipUsed] = await Promise.all([
    bumpCounter(`budget:llm:${day}`),
    bumpCounter(`budget:ip:${hashIp(ip)}:${day}`),
  ]);

  // Sayaç yazılamadıysa (KV hatası) isteği geçir — fail-open.
  if (globalUsed === null || ipUsed === null) {
    return { enabled: true, ok: true, globalUsed: 0, ipUsed: 0, limit: DAILY_LLM_BUDGET, degradedWrite: true };
  }

  return {
    enabled: true,
    ok: globalUsed <= DAILY_LLM_BUDGET && ipUsed <= IP_DAILY_QUOTA,
    reason: globalUsed > DAILY_LLM_BUDGET ? 'global'
      : ipUsed > IP_DAILY_QUOTA ? 'ip'
      : null,
    globalUsed,
    ipUsed,
    limit: DAILY_LLM_BUDGET,
    ipLimit: IP_DAILY_QUOTA,
  };
}

// ── KV tabanlı dakikalık limit ─────────────────────────────────────────────
// concierge-ratelimit.js'in örnek-başına çalışan Map'inin muadili. KV yoksa
// çağıran taraf eski limiter'a düşer.
export async function checkRateLimitKv(ip, { max = 20, windowSeconds = 60, prefix = 'rl' } = {}) {
  if (!KV_ENABLED) return { enabled: false, ok: true, remaining: max };
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `${prefix}:${hashIp(ip)}:${bucket}`;
  try {
    const n = await kv.incr(key);
    if (n === 1) await kv.expire(key, windowSeconds * 2);
    return {
      enabled: true,
      ok: n <= max,
      remaining: Math.max(0, max - n),
      resetAt: (bucket + 1) * windowSeconds * 1000,
    };
  } catch (err) {
    console.warn('[concierge-budget] kv rate limit failed:', err?.message);
    return { enabled: true, ok: true, remaining: max, degraded: true };
  }
}
