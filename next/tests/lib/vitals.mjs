// ─── Core Web Vitals ölçümü — LCP · CLS · TBT ───────────────────────────────
//
// 2026-08-13. Bu tarihe kadar sitede LCP/CLS HİÇ ölçülmemişti. "14 hydration
// adası → 1" yapısal bir kazanımdı ama kullanıcının hissettiği hız değil;
// teknik not (82) bu boşluğun üstünde duruyordu.
//
// ⚠ ÜRETİM BUILD'İNDE ÇALIŞTIR. Dev sunucusunda ölçüm anlamsız: kod bölünmesi
// yok, HMR runtime'ı var, kaynaklar sıkıştırılmıyor. `npm run build && npm run
// start` ile ayrı bir portta sunucu kaldırılır (bkz. scripts/measure-vitals.mjs).
//
// TBT tam olarak Lighthouse'un TBT'si değil — uzun görevlerin (>50ms) 50ms'i
// aşan kısımlarının toplamı. INP gerçek etkileşim gerektirdiği için burada yok;
// TBT onun en iyi laboratuvar vekili.
// ────────────────────────────────────────────────────────────────────────────

export const VITALS_INIT = `
  window.__vitals = { lcp: 0, cls: 0, longTasks: [], lcpEl: '' };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__vitals.lcp = e.startTime;
        window.__vitals.lcpEl = (e.element && (e.element.tagName + (e.element.id ? '#' + e.element.id : ''))) || e.url || '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (_) {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        // Kullanıcı girdisinden kaynaklanan kaymalar CLS'e sayılmaz
        if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (_) {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__vitals.longTasks.push(e.duration);
    }).observe({ type: 'longtask', buffered: true });
  } catch (_) {}
`;

export const VITALS_READ = `(() => {
  const v = window.__vitals || { lcp: 0, cls: 0, longTasks: [] };
  const nav = performance.getEntriesByType('navigation')[0] || {};
  const paint = performance.getEntriesByType('paint');
  const fcp = (paint.find((p) => p.name === 'first-contentful-paint') || {}).startTime || 0;
  const tbt = v.longTasks.reduce((a, d) => a + Math.max(0, d - 50), 0);
  const res = performance.getEntriesByType('resource');
  const bytes = res.reduce((a, r) => a + (r.transferSize || 0), 0);
  const js = res.filter((r) => r.initiatorType === 'script').reduce((a, r) => a + (r.transferSize || 0), 0);
  return {
    lcp: Math.round(v.lcp),
    lcpEl: v.lcpEl,
    cls: Math.round(v.cls * 1000) / 1000,
    fcp: Math.round(fcp),
    tbt: Math.round(tbt),
    ttfb: Math.round(nav.responseStart || 0),
    domInteractive: Math.round(nav.domInteractive || 0),
    reqCount: res.length,
    kb: Math.round(bytes / 1024),
    jsKb: Math.round(js / 1024),
  };
})()`;

// Google'ın "iyi" eşikleri
export const THRESHOLDS = { lcp: 2500, cls: 0.1, tbt: 200, fcp: 1800 };

export function verdict(m) {
  const bad = [];
  if (m.lcp > THRESHOLDS.lcp) bad.push(`LCP ${m.lcp}ms > ${THRESHOLDS.lcp}`);
  if (m.cls > THRESHOLDS.cls) bad.push(`CLS ${m.cls} > ${THRESHOLDS.cls}`);
  if (m.tbt > THRESHOLDS.tbt) bad.push(`TBT ${m.tbt}ms > ${THRESHOLDS.tbt}`);
  if (m.fcp > THRESHOLDS.fcp) bad.push(`FCP ${m.fcp}ms > ${THRESHOLDS.fcp}`);
  return bad;
}
