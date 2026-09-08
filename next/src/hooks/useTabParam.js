'use client';

// ─── useTabParam — aktif sekmeyi URL'de senkronize et (ChatGPT A8) ───────────
// Sekmeli araçlarda aktif sekme yalnız React state'teydi: link paylaşılınca
// hep ilk sekme açılıyordu, geri düğmesi sekme durumunu bilmiyordu. Bu kanca,
// aktif sekme index'ini `?tab=N` sorgu parametresiyle eşitler:
//   · paylaşılabilir (birine doğrudan "…/atlas/fatiha?tab=2" gönder),
//   · geri/ileri (popstate) ile URL değişince sekme de takip eder,
//   · varsayılan sekmede parametre yazılmaz (temiz URL).
//
// NEDEN useSearchParams DEĞİL: next/navigation useSearchParams'ı statik
// prerender edilen tool sayfalarında (ör. /atlas/fatiha) kullanmak "suspense
// boundary" build hatası veriyor. window.location + history.replaceState ile
// aynı sonucu Suspense'siz, SSR-güvenli ve build-güvenli elde ederiz. İlk
// render SSR'da varsayılan sekmedir; ?tab=N mount'tan sonra uygulanır.
// replaceState geçmişe girdi eklemez → geri düğmesi aracı terk eder
// (öngörülebilir); Next re-render/veri-getirme tetiklenmez.
//
// Drop-in: `const [activeTab, setActiveTab] = useState(0)` yerine
//          `const [activeTab, setActiveTab] = useTabParam(TABS.length)`.
// index tabanlı; fonksiyonel güncelleyici (setActiveTab(i => …)) de desteklenir.

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTabParam(tabCount, { param = 'tab', defaultIndex = 0 } = {}) {
  const [activeTab, setActiveTabState] = useState(defaultIndex); // SSR-güvenli
  const activeRef = useRef(defaultIndex);
  activeRef.current = activeTab;

  const readUrl = useCallback(() => {
    try {
      const n = parseInt(new URLSearchParams(window.location.search).get(param) ?? '', 10);
      if (!Number.isNaN(n) && n >= 0 && n < tabCount) return n;
    } catch { /* window yok / erişilemez */ }
    return defaultIndex;
  }, [param, tabCount, defaultIndex]);

  // Mount: URL'den oku (client-only). Geri/ileri: popstate ile izle.
  useEffect(() => {
    const next = readUrl();
    if (next !== activeRef.current) setActiveTabState(next);
    const onPop = () => setActiveTabState(readUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [readUrl]);

  const setActiveTab = useCallback((next) => {
    const idx = typeof next === 'function' ? next(activeRef.current) : next;
    setActiveTabState(idx);
    try {
      const url = new URL(window.location.href);
      if (idx === defaultIndex) url.searchParams.delete(param);
      else url.searchParams.set(param, String(idx));
      window.history.replaceState(window.history.state, '', url);
    } catch { /* history erişilemez — state yine güncellendi */ }
  }, [param, defaultIndex]);

  return [activeTab, setActiveTab];
}
