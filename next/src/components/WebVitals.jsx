'use client';

// ─── WebVitals — Core Web Vitals saha ölçümü (ChatGPT E1) ────────────────────
// "Performansı gerçek ölçümle yönet": LCP / INP / CLS (+ FCP / TTFB) her gerçek
// ziyarette ölçülür. Next'in yerleşik useReportWebVitals kancası kullanılır —
// EK BAĞIMLILIK YOK (web-vitals paketi Next içinde gömülü). Raporlama:
//   · Geliştirme: konsola okunur özet (renkli eşik: iyi / geliştirilebilir / zayıf).
//   · Üretim: NEXT_PUBLIC_VITALS_ENDPOINT ayarlıysa navigator.sendBeacon ile
//     oraya JSON gönderilir (saha RUM). Ayarlı değilse sessiz — konsolu kirletmez.
// Böylece lab (Lighthouse) yanında SAHA verisi de toplanabilir hâle gelir.
//
// Eşikler: web.dev/vitals resmi sınırları.
//   LCP  iyi ≤2500ms  zayıf >4000ms
//   INP  iyi ≤200ms   zayıf >500ms
//   CLS  iyi ≤0.1     zayıf >0.25
//   FCP  iyi ≤1800ms  zayıf >3000ms
//   TTFB iyi ≤800ms   zayıf >1800ms

import { useReportWebVitals } from 'next/web-vitals';

const THRESHOLDS = {
  LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25],
  FCP: [1800, 3000], TTFB: [800, 1800],
};

function rating(name, value) {
  const t = THRESHOLDS[name];
  if (!t) return 'unknown';
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'needs-improvement';
  return 'poor';
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const { name, value, id, rating: metricRating } = metric;
    const r = metricRating || rating(name, value);

    // Üretim: yapılandırılmış endpoint'e gönder (saha RUM).
    const endpoint = process.env.NEXT_PUBLIC_VITALS_ENDPOINT;
    if (endpoint) {
      try {
        const body = JSON.stringify({
          name, value: Math.round(name === 'CLS' ? value * 1000 : value),
          rating: r, id, path: window.location.pathname,
          ts: Date.now(),
        });
        if (navigator.sendBeacon) navigator.sendBeacon(endpoint, body);
        else fetch(endpoint, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
      } catch { /* ölçüm başarısızlığı sayfayı etkilemesin */ }
    }

    // Geliştirme: okunur konsol özeti.
    if (process.env.NODE_ENV !== 'production') {
      const shown = name === 'CLS' ? value.toFixed(3) : `${Math.round(value)}ms`;
      const icon = r === 'good' ? '🟢' : r === 'poor' ? '🔴' : '🟡';
      // eslint-disable-next-line no-console
      console.log(`${icon} [web-vitals] ${name} = ${shown} (${r})`);
    }
  });

  return null;
}
