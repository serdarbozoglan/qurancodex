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
// İKİ MOD:
//  · index modu: `useTabParam(TABS.length)` → [index, setIndex]  (?tab=2)
//    Drop-in: `const [activeTab, setActiveTab] = useState(0)` yerine.
//  · key modu:   `useTabParam(['a','b','c'], { defaultKey: 'a' })` → [key, setKey]
//    Drop-in: `const [activeTab, setActiveTab] = useState('a')` yerine.  (?tab=b)
// Fonksiyonel güncelleyici (setActiveTab(v => …)) her iki modda desteklenir.

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTabParam(tabsOrCount, { param = 'tab', defaultIndex = 0, defaultKey } = {}) {
  const isKeyMode = Array.isArray(tabsOrCount);
  const keys = isKeyMode ? tabsOrCount : null;
  const count = isKeyMode ? tabsOrCount.length : tabsOrCount;
  const def = isKeyMode ? (defaultKey ?? keys[0]) : defaultIndex;

  const [active, setActiveState] = useState(def); // SSR-güvenli
  const activeRef = useRef(def);
  activeRef.current = active;

  const readUrl = useCallback(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get(param);
      if (raw == null) return def;
      if (isKeyMode) return keys.includes(raw) ? raw : def;
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 0 && n < count) return n;
    } catch { /* window yok / erişilemez */ }
    return def;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, count, def]);

  // Mount: URL'den oku (client-only). Geri/ileri: popstate ile izle.
  useEffect(() => {
    const next = readUrl();
    if (next !== activeRef.current) setActiveState(next);
    const onPop = () => setActiveState(readUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [readUrl]);

  const setActive = useCallback((next) => {
    const val = typeof next === 'function' ? next(activeRef.current) : next;
    setActiveState(val);
    try {
      const url = new URL(window.location.href);
      if (val === def) url.searchParams.delete(param);
      else url.searchParams.set(param, String(val));
      window.history.replaceState(window.history.state, '', url);
    } catch { /* history erişilemez — state yine güncellendi */ }
  }, [param, def]);

  return [active, setActive];
}
