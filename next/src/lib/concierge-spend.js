// ─── concierge-spend — GÜNLÜK HARCAMAYI DOLARLA SINIRLA ─────────────────────
//
// `concierge-budget.js` günlük LLM ÇAĞRISI sayar (varsayılan 500) ve bunun
// "kabaca 5 $" ettiğini varsayar. Varsayım kırılgan: bir sorgunun maliyeti
// bağlam uzunluğuna göre kat kat değişir, ayrıca guardrails katmanı da ayrı
// çağrılar yapar. Kullanıcı direktifi (2026-09-18): "5 $ geçmesin günlük
// toplam bütçe" — o yüzden sınır artık TAHMİN edilen çağrı sayısına değil,
// GERÇEKLEŞEN jeton kullanımına bağlı.
//
// Nasıl çalışır: her LLM çağrısından SONRA gerçek `usage` (input/output
// token) dolara çevrilip günlük sayaca eklenir. Bir sonraki istek, çağrıdan
// ÖNCE bu sayaca bakar; tavan aşılmışsa LLM atlanır ve düşük kapasite moduna
// geçilir (istek reddedilmez — kullanıcı yine âyet, tefsir ve araç sonuçlarını
// alır, yalnız üstteki giriş/kapanış cümleleri gelmez).
//
// Sayaç KV'de (Upstash Redis) tutulur: Vercel kaç örnek açarsa açsın tek bir
// gerçek sayaç olsun diye. KV yoksa (yerel geliştirme) sınır uygulanmaz ama
// bu durum AÇIKÇA bildirilir — sessizce sınırsız çalışmasın.
//
// Fiyatlar 1M jeton başına dolar. Model değişirse burası güncellenir;
// env ile de ezilebilir ki fiyat değişince deploy beklenmesin.
import { kv } from '@vercel/kv';

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Günlük üst sınır (USD). Kullanıcı direktifi: 5 $.
export const DAILY_USD_CAP = Number(process.env.CONCIERGE_DAILY_USD || 5);

// claude-haiku-4-5 — 1M jeton başına USD.
const PRICE_IN = Number(process.env.CONCIERGE_PRICE_IN_PER_M || 1);
const PRICE_OUT = Number(process.env.CONCIERGE_PRICE_OUT_PER_M || 5);

const TTL_SECONDS = 48 * 60 * 60;
const dayKey = () => new Date().toISOString().slice(0, 10);
const spendKey = () => `budget:usd:${dayKey()}`;

export function usdOf(usage) {
  if (!usage) return 0;
  const i = Number(usage.input_tokens || 0);
  const o = Number(usage.output_tokens || 0);
  return (i * PRICE_IN + o * PRICE_OUT) / 1_000_000;
}

// Bugün ne kadar harcandı? Tavan aşıldıysa ok:false.
let uyarildi = false;
export async function peekSpend() {
  if (!KV_ENABLED) {
    // SESSİZ KALMAZ: KV bağlı değilken günlük tavan UYGULANMIYOR demektir.
    // Sayaç paylaşılan bir yerde tutulmadan sunucusuz örnekler arasında
    // gerçek bir sınır kurulamaz. Süreç başına bir kez, açıkça yazılır.
    if (!uyarildi) {
      uyarildi = true;
      console.warn('[concierge-spend] KV YOK — günlük $' + DAILY_USD_CAP
        + ' tavanı UYGULANMIYOR. Vercel\'de KV_REST_API_URL ve KV_REST_API_TOKEN ayarlanmalı.');
    }
    return { enabled: false, ok: true, spent: 0, cap: DAILY_USD_CAP, note: 'kv-yok' };
  }
  try {
    const v = await kv.get(spendKey());
    const spent = Number(v || 0);
    return { enabled: true, ok: spent < DAILY_USD_CAP, spent, cap: DAILY_USD_CAP };
  } catch (err) {
    // KV okunamıyorsa servisi kilitleme — fail-open, ama işaretle.
    console.warn('[concierge-spend] peek failed:', err?.message);
    return { enabled: true, ok: true, spent: 0, cap: DAILY_USD_CAP, degradedRead: true };
  }
}

// Gerçekleşen kullanımı günlük sayaca ekler. Çağrıdan SONRA çağrılır.
// Sayaç kuruşun binde biri hassasiyetinde tam sayı olarak tutulur; Redis'in
// float artışında yuvarlama sürüklenmesi olmasın diye (mikro-dolar = 1e-6 $).
export async function addSpend(usage) {
  const usd = usdOf(usage);
  if (!KV_ENABLED || usd <= 0) return usd;
  try {
    const micro = Math.round(usd * 1_000_000);
    const total = await kv.incrby(`${spendKey()}:micro`, micro);
    await kv.set(spendKey(), total / 1_000_000, { ex: TTL_SECONDS });
    if (total === micro) await kv.expire(`${spendKey()}:micro`, TTL_SECONDS);
  } catch (err) {
    console.warn('[concierge-spend] add failed:', err?.message);
  }
  return usd;
}
