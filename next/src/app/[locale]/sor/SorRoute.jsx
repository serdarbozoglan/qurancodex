'use client';

// ─── /sor — Semantik Concierge Dedicated Experience ─────────────────────────
// Query URL param'dan gelir → /api/concierge çağrısı → curated cards render.
//
// Layout: full-screen focused UX
//   1. Sticky query bar (üstte) — kullanıcı istediği zaman yeni soru sorabilir
//   2. Loading state: shimmer + gold glow animation
//   3. Response: 4 kategoride card grid (verses / atlases / tools / articles)
//   4. Error/empty states
//   5. Feedback (thumbs up/down) — future
//
// World-class design:
//   - Framer-motion smooth reveals
//   - Ayet card: KFGQPC Arapça + gradient border + meal
//   - Tool card: gold glow hover
//   - Article card: reading time + category chip
//   - Kavim/Kissa/Esma/Dua/Kavram merged "Atlas" section
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../../i18n/LanguageContext';
import { COLORS, FONTS } from '../../../tokens';
import { detectQueryLang } from '../../../lib/query-lang';

export default function SorRoute() {
  return (
    <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 62px)', background: COLORS.cosmicBlack }} />}>
      <SorInner />
    </Suspense>
  );
}

function SorInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  const initialQuery = (searchParams.get('q') || '').trim();
  const [query, setQuery] = useState(initialQuery);
  const [pendingQuery, setPendingQuery] = useState(initialQuery);
  const [state, setState] = useState('idle'); // idle | loading | ok | error | empty
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'up' | 'down'
  const abortRef = useRef(null);

  // localStorage cache — aynı query için redundant LLM çağrısını önler.
  // 2026-07-14 update: sessionStorage → localStorage upgrade (cross-tab paylaşım,
  // bookmark hit, refresh persist). TTL 30 dk → 24 saat.
  // Cost: query başına ~$0.001 tasarruf; UX: 5-10 sn → anlık.
  // Quota: response ~5-20 KB × 100 entry ≈ 2 MB, localStorage 5 MB limit altı.
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 saat
  const cacheKey = (lang, q) => `concierge:${lang}:${q.trim().toLowerCase()}`;

  const getCachedResponse = useCallback((lang, q) => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(cacheKey(lang, q));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.cachedAt && Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
        localStorage.removeItem(cacheKey(lang, q));
        return null;
      }
      return parsed.data;
    } catch { return null; }
  }, [CACHE_TTL_MS]);

  const setCachedResponse = useCallback((lang, q, data) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(cacheKey(lang, q), JSON.stringify({ cachedAt: Date.now(), data }));
    } catch (err) {
      // Quota exceeded — evict oldest concierge entries + retry once
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('concierge:'));
        if (keys.length > 20) {
          // Read timestamps, sort ascending, drop oldest half
          const withAge = keys.map(k => {
            try { return { k, ts: JSON.parse(localStorage.getItem(k)).cachedAt || 0 }; }
            catch { return { k, ts: 0 }; }
          }).sort((a, b) => a.ts - b.ts);
          for (const { k } of withAge.slice(0, Math.floor(keys.length / 2))) {
            localStorage.removeItem(k);
          }
          localStorage.setItem(cacheKey(lang, q), JSON.stringify({ cachedAt: Date.now(), data }));
        }
      } catch { /* still failing — silently skip */ }
    }
  }, []);

  const runQuery = useCallback(async (q) => {
    if (!q || q.length < 3) return;

    // Query dilini heuristic ile tespit et — sayfa dilinden BAĞIMSIZ.
    // TR user EN sorabilir, EN user TR sorabilir. Default TR.
    const queryLang = detectQueryLang(q);

    // Cache-first (queryLang'e göre)
    const cached = getCachedResponse(queryLang, q);
    if (cached) {
      setResponse(cached);
      setState('ok');
      setErrorMsg('');
      setFeedback(null);
      return;
    }

    setState('loading');
    setResponse(null);
    setErrorMsg('');
    setFeedback(null);

    // Abort previous
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, lang: queryLang }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.message || `HTTP ${res.status}`);
        setState('error');
        return;
      }
      // Guardrails rejection — sıcak reject card + suggestion chips
      if (data.rejected) {
        setResponse(data);
        setState('rejected');
        return;
      }
      const hasContent =
        (data.response?.verses?.length || 0) +
        (data.response?.tools?.length || 0) +
        (data.response?.articles?.length || 0) +
        (data.response?.atlases?.length || 0) > 0;
      if (!hasContent) {
        setState('empty');
      } else {
        setResponse(data);
        setState('ok');
        setCachedResponse(queryLang, q, data); // Cache başarılı response
        pushHistory(q, queryLang);              // Query history — son 20
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setErrorMsg(err.message || 'Network error');
      setState('error');
    }
  }, [language, getCachedResponse, setCachedResponse]);

  // Fire on initial mount if q param present
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setPendingQuery(initialQuery);
      runQuery(initialQuery);
    } else {
      setState('idle');
    }
    return () => { abortRef.current?.abort(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC key: eğer input dolu ise clear et, yoksa anasayfaya dön
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (pendingQuery) {
        setPendingQuery('');
      } else {
        router.push(`/${language}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pendingQuery, router, language]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const q = pendingQuery.trim();
    if (q.length < 3 || q === query) return;
    setQuery(q);
    // URL güncelle (soft push, page reload yok)
    router.replace(`/${language}/sor?q=${encodeURIComponent(q)}`, { scroll: false });
    runQuery(q);
  };

  return (
    <div
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        paddingTop: '62px', // Navbar height
        color: COLORS.offWhite,
      }}
    >
      {/* Subtle background glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: '62px 0 0 0',
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% -10%, ${COLORS.gold}10 0%, transparent 40%), radial-gradient(circle at 20% 80%, ${COLORS.gold}06 0%, transparent 50%)`,
        }}
      />

      {/* Sticky query bar + Anasayfa link */}
      <div
        style={{
          position: 'sticky',
          top: '62px',
          zIndex: 40,
          background: 'rgba(10,10,26,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.gold}22`,
          padding: '14px 24px',
        }}
      >
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* Top row: Anasayfa link + hint */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}>
            <Link
              href={`/${language}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: FONTS.body,
                fontSize: '0.72rem',
                color: `${COLORS.gold}bb`,
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = `${COLORS.gold}bb`; }}
            >
              <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>←</span>
              <span>{tr ? 'Anasayfa' : 'Home'}</span>
            </Link>
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.66rem',
                color: COLORS.silver,
                opacity: 0.55,
                letterSpacing: '0.04em',
              }}
              className="hidden sm:inline"
            >
              {tr ? 'ESC ile kapat' : 'Press ESC to close'}
            </span>
          </div>

          {/* Query bar */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(13,27,42,0.7)',
              border: `1px solid ${COLORS.gold}33`,
              borderRadius: '999px',
              padding: '4px 4px 4px 20px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.75 }}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={pendingQuery}
              onChange={(e) => setPendingQuery(e.target.value)}
              placeholder={tr ? 'Yeni bir soru sor...' : 'Ask a new question...'}
              aria-label={tr ? 'Soru' : 'Question'}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: COLORS.offWhite,
                fontFamily: FONTS.body,
                fontSize: '0.95rem',
                padding: '11px 4px',
                minWidth: 0,
              }}
            />
            {/* Clear button — only visible when input has content */}
            {pendingQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setPendingQuery('')}
                aria-label={tr ? 'Temizle' : 'Clear'}
                title={tr ? 'Temizle' : 'Clear'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${COLORS.gold}22`,
                  color: `${COLORS.gold}aa`,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${COLORS.gold}18`;
                  e.currentTarget.style.color = COLORS.gold;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = `${COLORS.gold}aa`;
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={pendingQuery.trim().length < 3 || pendingQuery.trim() === query}
              style={{
                background: pendingQuery.trim().length >= 3 && pendingQuery.trim() !== query
                  ? `linear-gradient(135deg, ${COLORS.gold} 0%, #b8860b 100%)`
                  : `${COLORS.gold}22`,
                color: pendingQuery.trim().length >= 3 && pendingQuery.trim() !== query ? '#1c0f00' : `${COLORS.gold}88`,
                border: 'none',
                borderRadius: '999px',
                padding: '9px 18px',
                fontFamily: FONTS.body,
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: pendingQuery.trim().length >= 3 && pendingQuery.trim() !== query ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {tr ? 'Sor' : 'Ask'}
            </button>
          </form>
        </div>
      </div>

      {/* Main content area */}
      <main style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '32px 24px 80px',
        position: 'relative',
      }}>
        {/* Current query as displayed title */}
        {query && (
          <motion.div
            key={query}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '28px' }}
          >
            <div style={{
              color: `${COLORS.gold}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.66rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              {tr ? 'Sorulan Soru' : 'Your Question'}
            </div>
            <h1 style={{
              fontFamily: FONTS.display,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
              color: COLORS.offWhite,
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}>
              "{query}"
            </h1>
          </motion.div>
        )}

        {/* States */}
        {state === 'idle' && <IdleState language={language} onSelect={(q) => {
          setQuery(q);
          setPendingQuery(q);
          router.replace(`/${language}/sor?q=${encodeURIComponent(q)}`, { scroll: false });
          runQuery(q);
        }} />}
        {state === 'loading' && <LoadingState language={language} />}
        {state === 'empty' && <EmptyState language={language} query={query} />}
        {state === 'error' && <ErrorState language={language} message={errorMsg} onRetry={() => runQuery(query)} />}
        {state === 'rejected' && response?.rejection && (
          <RejectedState
            language={language}
            rejection={response.rejection}
            onSuggestion={(s) => { setQuery(s); setPendingQuery(s); runQuery(s); }}
          />
        )}
        {state === 'ok' && response && (
          <ResponseView
            data={response}
            language={language}
            feedback={feedback}
            setFeedback={setFeedback}
          />
        )}
      </main>
    </div>
  );
}

// ─── STATES ─────────────────────────────────────────────────────────────────

// Query history — localStorage'daki son 20 sorgu. Refresh + yeni tab'da persist.
const HISTORY_KEY = 'qurancodex_query_history';
const HISTORY_MAX = 20;

function readHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeHistory(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch { /* quota exceeded — skip */ }
}

// Public: yeni bir başarılı query'yi history'e ekle (dedup + en başa taşı)
function pushHistory(q, lang) {
  const normalized = q.trim();
  if (normalized.length < 3) return;
  const list = readHistory();
  const filtered = list.filter(e => e.q.toLowerCase() !== normalized.toLowerCase());
  filtered.unshift({ q: normalized, lang, ts: Date.now() });
  writeHistory(filtered);
}

function IdleState({ language, onSelect }) {
  const tr = language === 'tr';
  const [history, setHistory] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(readHistory());
  }, []);

  const remove = (q) => {
    const list = readHistory().filter(e => e.q !== q);
    writeHistory(list);
    setHistory(list);
  };

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.silver }}>
      <div style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '20px' }}>✨</div>
      <p style={{ fontFamily: FONTS.body, fontSize: '1rem', marginBottom: history.length ? '36px' : 0 }}>
        {tr ? 'Yukarıdaki kutuya bir soru yaz.' : 'Type a question in the box above.'}
      </p>

      {history.length > 0 && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.silver,
            opacity: 0.7,
            marginBottom: '14px',
          }}>
            {tr ? 'Son sorularınız' : 'Recent questions'}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }}>
            {history.slice(0, 20).map((entry) => (
              <div key={entry.q} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                paddingLeft: '12px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${COLORS.gold}66`;
                e.currentTarget.style.background = `${COLORS.gold}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}>
                <button
                  onClick={() => onSelect(entry.q)}
                  title={entry.q}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 4px 8px 0',
                    color: COLORS.offWhite,
                    fontFamily: FONTS.body,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    maxWidth: '240px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.q}
                </button>
                <button
                  onClick={() => remove(entry.q)}
                  aria-label={tr ? 'Sil' : 'Delete'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 10px 4px 4px',
                    color: COLORS.silver,
                    opacity: 0.5,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = COLORS.red; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = COLORS.silver; }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState({ language }) {
  const tr = language === 'tr';
  // Gerçek pipeline aşamalarını yansıtan aşamalı mesajlar — kullanıcıya
  // "sistem çalışıyor" hissi verir (fake spinner değil).
  const stages = tr
    ? [
        { text: 'Sorun BGE-M3 vektörüne dönüştürülüyor', dur: 1400 },
        { text: 'Kur\'an ve içerik havuzu taranıyor', dur: 1600 },
        { text: 'En yakın 12 aday seçildi', dur: 1200 },
        { text: 'Yanıt hazırlanıyor', dur: 3000 },
      ]
    : [
        { text: 'Encoding your query into BGE-M3 vector', dur: 1400 },
        { text: 'Scanning Quran and content pool', dur: 1600 },
        { text: 'Selecting the 12 closest candidates', dur: 1200 },
        { text: 'Composing the response', dur: 3000 },
      ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= stages.length - 1) return; // Son aşamada takıl (Claude hala çalışıyor olabilir)
    const t = setTimeout(() => setIdx((i) => Math.min(i + 1, stages.length - 1)), stages[idx].dur);
    return () => clearTimeout(t);
  }, [idx, stages]);

  return (
    <div style={{ padding: '56px 20px 40px', textAlign: 'center', position: 'relative' }}>
      {/* Center orbital — 3 gold dots orbiting a center pulse */}
      <div style={{
        width: '96px',
        height: '96px',
        margin: '0 auto 32px',
        position: 'relative',
      }}>
        {/* Outer subtle ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            border: `1px solid ${COLORS.gold}22`,
            borderRadius: '50%',
          }}
        />
        {/* Middle ring — reverse rotation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '14px',
            border: `1px dashed ${COLORS.gold}44`,
            borderRadius: '50%',
          }}
        />
        {/* 3 orbital dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
            style={{
              position: 'absolute', inset: 0,
              transformOrigin: 'center',
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              style={{
                position: 'absolute',
                top: `${8 + i * 4}px`,
                left: '50%',
                width: '6px',
                height: '6px',
                marginLeft: '-3px',
                borderRadius: '50%',
                background: COLORS.gold,
                boxShadow: `0 0 12px ${COLORS.gold}, 0 0 24px ${COLORS.gold}66`,
              }}
            />
          </motion.div>
        ))}
        {/* Center pulse */}
        <motion.div
          animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.85, 1.05, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '18px', height: '18px',
            marginTop: '-9px', marginLeft: '-9px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.gold} 0%, ${COLORS.gold}00 70%)`,
          }}
        />
      </div>

      {/* Stage progress — 4 mini pill markers */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '22px' }}>
        {stages.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: i <= idx ? 1 : 0.25,
              width: i === idx ? '24px' : '10px',
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '3px',
              borderRadius: '999px',
              background: i <= idx ? COLORS.gold : `${COLORS.gold}66`,
              boxShadow: i === idx ? `0 0 8px ${COLORS.gold}88` : 'none',
            }}
          />
        ))}
      </div>

      {/* Stage message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            color: COLORS.offWhite,
            opacity: 0.88,
            fontSize: 'clamp(0.98rem, 1.6vw, 1.08rem)',
            margin: '0 auto',
            maxWidth: '440px',
            letterSpacing: '-0.005em',
          }}
        >
          {stages[idx].text}
        </motion.p>
      </AnimatePresence>

      {/* Skeleton cards mimicking actual verse card structure */}
      <div style={{ marginTop: '44px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '760px', margin: '44px auto 0' }}>
        {[1, 2, 3].map((i) => (
          <VerseSkeleton key={i} delay={i * 0.12} />
        ))}
      </div>

      {/* Trust footer — same as ConciergePrompt */}
      <p style={{
        marginTop: '32px',
        fontFamily: FONTS.body,
        fontSize: '0.7rem',
        color: COLORS.silver,
        opacity: 0.55,
        letterSpacing: '0.06em',
      }}>
        {tr ? 'Sistem yorum katmaz — sadece rehberler.' : 'The system adds no commentary — it only guides.'}
      </p>
    </div>
  );
}

// Verse card şeklinde skeleton — sûre chip + Arapça satır + meal satırları + button
function VerseSkeleton({ delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.65, 0.3] }}
      transition={{ duration: 1.8, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        borderRadius: '16px',
        border: `1px solid ${COLORS.gold}22`,
        background: `linear-gradient(180deg, ${COLORS.gold}06 0%, rgba(255,255,255,0.012) 100%)`,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Sûre chip skeleton */}
      <div style={{
        width: '110px',
        height: '20px',
        borderRadius: '999px',
        background: `${COLORS.gold}22`,
      }} />
      {/* Arabic block skeleton — 2 lines RTL-feel (wider right side) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ width: '85%', height: '18px', borderRadius: '4px', background: `${COLORS.gold}18` }} />
        <div style={{ width: '65%', height: '18px', borderRadius: '4px', background: `${COLORS.gold}18` }} />
      </div>
      {/* Translation skeleton — 3 lines LTR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
        <div style={{ width: '95%', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ width: '88%', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ width: '60%', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)' }} />
      </div>
      {/* Button skeleton */}
      <div style={{
        width: '130px',
        height: '32px',
        borderRadius: '8px',
        background: `${COLORS.gold}18`,
        marginTop: '6px',
      }} />
    </motion.div>
  );
}

function EmptyState({ language, query }) {
  const tr = language === 'tr';
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.silver }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.4 }}>🔍</div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.4rem', margin: '0 0 8px' }}>
        {tr ? 'Bu soruya yakın içerik bulamadım' : 'No matching content found'}
      </h2>
      <p style={{ fontFamily: FONTS.body, opacity: 0.75, maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
        {tr
          ? 'Sorunu biraz farklı bir şekilde ifade etmeyi dene, veya bir kavram/durum kelimesi kullan.'
          : 'Try rephrasing your question, or use a concept or situation word.'}
      </p>
    </div>
  );
}

function ErrorState({ language, message, onRetry }) {
  const tr = language === 'tr';
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.5 }}>⚠️</div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.3rem', margin: '0 0 8px' }}>
        {tr ? 'Bir sorun oluştu' : 'Something went wrong'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.85rem', margin: '0 0 20px' }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          background: `${COLORS.gold}1a`,
          border: `1px solid ${COLORS.gold}66`,
          borderRadius: '999px',
          padding: '10px 20px',
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {tr ? 'Tekrar dene' : 'Try again'}
      </button>
    </div>
  );
}

// ─── REJECTED STATE ────────────────────────────────────────────────────────
// Guardrails K1/K2 sıcak reject → mesaj + suggestion chip'leri

function RejectedState({ language, rejection, onSuggestion }) {
  const tr = language === 'tr';
  const { message, suggestions = [] } = rejection;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '640px',
        margin: '40px auto',
        padding: '32px 28px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: `${COLORS.gold}14`,
        border: `1px solid ${COLORS.gold}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
        </svg>
      </div>
      <p style={{
        fontFamily: FONTS.body,
        fontSize: '0.95rem',
        color: COLORS.offWhite,
        lineHeight: 1.7,
        margin: '0 0 24px',
      }}>
        {message}
      </p>

      {suggestions.length > 0 && (
        <>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.silver,
            opacity: 0.7,
            margin: '0 0 12px',
          }}>
            {tr ? 'Örnek konular' : 'Example topics'}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestion(s)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  background: `${COLORS.gold}12`,
                  border: `1px solid ${COLORS.gold}44`,
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${COLORS.gold}26`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${COLORS.gold}12`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─── RESPONSE VIEW ──────────────────────────────────────────────────────────

function ResponseView({ data, language, feedback, setFeedback }) {
  const { response, meta } = data;
  const tr = language === 'tr';
  const reduced = useReducedMotion();

  return (
    <div>
      {/* Rewrite banner — kullanıcıya transparan bilgi */}
      {data.rewritten && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            color: COLORS.silver,
            lineHeight: 1.55,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '3px', opacity: 0.7 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <div>
            <div style={{ marginBottom: '4px' }}>
              {tr
                ? <>Sorgunuzu şu şekilde değerlendirdik: <span style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>&ldquo;{data.rewritten.to}&rdquo;</span></>
                : <>We interpreted your query as: <span style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>&ldquo;{data.rewritten.to}&rdquo;</span></>
              }
            </div>
            <div style={{ opacity: 0.65, fontSize: '0.76rem' }}>
              {tr ? 'Yanlış anladıysak orijinal sorunuzla tekrar arayabilirsiniz.' : 'If we got it wrong, feel free to try again with your original wording.'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Fetva disclaimer — hüküm sorusuysa üstte uyarı */}
      {data.fetvaDisclaimer && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '14px 18px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: `${COLORS.gold}0d`,
            border: `1px solid ${COLORS.gold}33`,
            fontFamily: FONTS.body,
            fontSize: '0.85rem',
            color: COLORS.offWhite,
            lineHeight: 1.6,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" style={{ flexShrink: 0, marginTop: '3px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>{data.fetvaDisclaimer}</div>
        </motion.div>
      )}

      {/* Intro whisper */}
      {response.intro && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: '1.02rem',
            color: `${COLORS.gold}cc`,
            lineHeight: 1.6,
            margin: '0 0 32px',
            padding: '14px 18px',
            borderLeft: `2px solid ${COLORS.gold}55`,
            background: `${COLORS.gold}08`,
            borderRadius: '0 8px 8px 0',
          }}
        >
          {response.intro}
        </motion.p>
      )}

      {/* Verses section */}
      {response.verses?.length > 0 && (
        <SectionBlock title={tr ? 'İlgili Ayetler' : 'Relevant Verses'} count={response.verses.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {response.verses.map((v, i) => (
              <VerseCard key={v.id} verse={v} delay={i * 0.06} language={data.lang || language} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Tools section */}
      {response.tools?.length > 0 && (
        <SectionBlock title={tr ? 'Derinleş: Sayfalar' : 'Explore: Pages'} count={response.tools.length}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {response.tools.map((t, i) => (
              <ToolCard key={t.id} tool={t} delay={i * 0.05} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Atlases section (merged) */}
      {response.atlases?.length > 0 && (
        <SectionBlock title={tr ? 'Atlas Referansları' : 'Atlas References'} count={response.atlases.length}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {response.atlases.map((a, i) => (
              <AtlasCard key={a.id} atlas={a} delay={i * 0.05} language={language} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Articles section */}
      {response.articles?.length > 0 && (
        <SectionBlock title={tr ? 'Tefekkür Yazıları' : 'Reflection Essays'} count={response.articles.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {response.articles.map((a, i) => (
              <ArticleCard key={a.id} article={a} delay={i * 0.05} language={language} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Closing whisper */}
      {response.closing && (
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: COLORS.silver,
            textAlign: 'center',
            marginTop: '48px',
            lineHeight: 1.6,
          }}
        >
          {response.closing}
        </motion.p>
      )}

      {/* Feedback */}
      <FeedbackRow
        feedback={feedback}
        setFeedback={setFeedback}
        language={language}
        queryHash={meta?.queryHash}
      />

      {/* Meta stats — subtle */}
      {meta?.timings && (
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: FONTS.body,
          fontSize: '0.68rem',
          color: COLORS.silver,
          opacity: 0.4,
          letterSpacing: '0.08em',
        }}>
          {(meta.timings.total / 1000).toFixed(1)}s · {meta.candidateCount} {language === 'tr' ? 'aday' : 'candidates'}
        </p>
      )}
    </div>
  );
}

// ─── SECTION + CARDS ────────────────────────────────────────────────────────

function SectionBlock({ title, count, children }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: '36px' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '18px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${COLORS.gold}22`,
      }}>
        <h2 style={{
          fontFamily: FONTS.body,
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          margin: 0,
        }}>
          {title}
        </h2>
        <span style={{
          fontFamily: FONTS.body,
          fontSize: '0.68rem',
          fontWeight: 700,
          color: `${COLORS.gold}dd`,
          background: `${COLORS.gold}14`,
          border: `1px solid ${COLORS.gold}33`,
          padding: '2px 9px',
          borderRadius: '999px',
          lineHeight: 1.4,
          letterSpacing: '0.04em',
        }}>
          {count}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

// Reading Mode meal ID → mealsTr/mealsEn anahtarları arasındaki köprü.
// Reading Mode `local`/`en_local` seçildiğinde base text (verse.text) gösterilir
// — bu Suat Y. (TR) ve Sahih (EN) baseline meal'lere karşılık gelir.
const MEAL_ID_TO_KEY = {
  local: null,            // → verse.text (Suat Y.)
  alibulac: 'aliBulac',
  diyanet: 'diyanet',
  en_local: null,         // → verse.text (Sahih)
  en_yusufali: 'yusufAli',
  en_asad: 'asad',
};
const MEAL_ID_TO_LABEL = {
  local: 'Suat Yıldırım',
  alibulac: 'Ali Bulaç',
  diyanet: 'Diyanet İşleri',
  en_local: 'Sahih International',
  en_yusufali: 'Abdullah Yusuf Ali',
  en_asad: 'Muhammad Asad',
};

// Hook — Reading Mode'daki seçili meal ID'sini takip eder.
// SSR-safe: initial 'local', mount sonrası localStorage okur, storage event dinler.
// Post-mount setState hydration için gerekli; SSR-güvenli lazy init olmaz
// (window server'da yok). Aynı pattern SorInner useEffect 144:7 ile aynı.
function useSelectedMealId() {
  const [id, setId] = useState('local');
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qurancodex_meal_id');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setId(stored);
    } catch { /* private mode / disabled */ }
    const onStorage = (e) => {
      if (e.key === 'qurancodex_meal_id' && e.newValue) setId(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return id;
}

function VerseCard({ verse, delay, language }) {
  const reduced = useReducedMotion();
  const tr = language === 'tr';
  const rawMealId = useSelectedMealId();

  // 2026-07-14 fix: Query lang (parent'tan gelen `language` prop)
  // Reading Mode meal ID'sini OVERRIDE eder. Query TR ise user'ın seçtiği
  // EN meal ignore edilir → default TR meal (SY) gösterilir. Query EN ise
  // TR meal ignore → default EN (Sahih).
  const mealIsEn = rawMealId.startsWith('en_');
  const langMismatch = (tr && mealIsEn) || (!tr && !mealIsEn);
  const mealId = langMismatch ? (tr ? 'local' : 'en_local') : rawMealId;

  // Seçili meal'e uygun text + label çıkar.
  // API `lang` param'ine göre verse.text zaten doğru lang'de (TR ise Suat Y.,
  // EN ise Sahih). VerseCard sadece user Reading Mode meal seçimini eşleştirir.
  let displayText = verse.text;
  let displayLabel = tr ? 'Suat Yıldırım' : 'Sahih International';
  if (mealId in MEAL_ID_TO_KEY) {
    const key = MEAL_ID_TO_KEY[mealId];
    if (key === null) {
      displayLabel = MEAL_ID_TO_LABEL[mealId] || displayLabel;
    } else {
      const map = mealId.startsWith('en_') ? verse.mealsEn : verse.mealsTr;
      if (map && map[key]) {
        displayText = map[key];
        displayLabel = MEAL_ID_TO_LABEL[mealId];
      }
    }
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={reduced ? {} : { y: -2 }}
      style={{
        background: `linear-gradient(180deg, ${COLORS.gold}08 0%, rgba(255,255,255,0.015) 100%)`,
        border: `1px solid ${COLORS.gold}26`,
        borderRadius: '16px',
        padding: '20px 22px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header: sûre ref chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{
          fontFamily: FONTS.body,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: `${COLORS.gold}cc`,
          padding: '3px 10px',
          border: `1px solid ${COLORS.gold}44`,
          borderRadius: '999px',
        }}>
          {verse.surahName} {verse.surah}:{verse.ayah}
        </span>
      </div>

      {/* Arabic */}
      {verse.arabic && (
        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 14px',
            textShadow: `0 0 12px ${COLORS.gold}18`,
          }}
        >
          {verse.arabic}
        </p>
      )}

      {/* Meal */}
      {displayText && (
        <>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.95rem',
            color: COLORS.offWhite,
            lineHeight: 1.75,
            margin: '0 0 4px',
          }}>
            {displayText}
          </p>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.7rem',
            color: COLORS.silver,
            opacity: 0.6,
            margin: '0 0 14px',
            letterSpacing: '0.04em',
          }}>
            — {displayLabel}
          </p>
        </>
      )}

      {/* Reason */}
      {verse.reason && (
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: '0.86rem',
          color: `${COLORS.gold}bb`,
          margin: '0 0 12px',
          lineHeight: 1.55,
          paddingLeft: '10px',
          borderLeft: `2px solid ${COLORS.gold}44`,
        }}>
          {verse.reason}
        </p>
      )}

      {/* CTA */}
      <Link
        href={verse.url}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: FONTS.body,
          fontSize: '0.76rem',
          color: COLORS.gold,
          textDecoration: 'none',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        {tr ? 'Sûrede aç' : 'Open in Sura'} <span>→</span>
      </Link>
    </motion.div>
  );
}

function ToolCard({ tool, delay }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={tool.url} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={reduced ? {} : { y: -3 }}
          style={{
            background: `linear-gradient(180deg, ${COLORS.gold}0a 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${COLORS.gold}22`,
            borderRadius: '14px',
            padding: '18px 20px',
            height: '100%',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${COLORS.gold}66`;
            e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.gold}18`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${COLORS.gold}22`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={{
            fontFamily: FONTS.display,
            fontSize: '1.12rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: '0 0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '-0.005em',
          }}>
            {tool.title}
            <span style={{ color: COLORS.gold, opacity: 0.8, fontSize: '0.95rem' }}>→</span>
          </h3>
          {tool.reason && (
            <p style={{
              fontFamily: FONTS.body,
              fontSize: '0.88rem',
              color: COLORS.offWhite,
              opacity: 0.78,
              lineHeight: 1.65,
              margin: 0,
            }}>
              {tool.reason}
            </p>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

function AtlasCard({ atlas, delay, language }) {
  const reduced = useReducedMotion();
  const tr = language === 'tr';
  const typeLabel = {
    'atlas-kavim': tr ? 'Kavim' : 'People',
    'atlas-kissa': tr ? 'Kıssa' : 'Story',
    'atlas-esma': tr ? 'Esma' : 'Name',
    'atlas-dua': tr ? 'Dua' : 'Prayer',
    'atlas-kavram': tr ? 'Kavram' : 'Concept',
  }[atlas.type] || '';

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link href={atlas.url} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${COLORS.gold}1a`,
            borderRadius: '12px',
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${COLORS.gold}44`;
            e.currentTarget.style.background = 'rgba(212,165,116,0.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${COLORS.gold}1a`;
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontFamily: FONTS.body,
              fontSize: '0.66rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              opacity: 0.85,
            }}>{typeLabel}</span>
          </div>
          <h4 style={{
            fontFamily: FONTS.display,
            fontSize: '1.05rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: '0 0 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '-0.005em',
          }}>
            {atlas.title}
            {atlas.arabic && (
              <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, color: COLORS.gold, opacity: 0.9, fontSize: '0.95rem' }}>
                {atlas.arabic}
              </span>
            )}
          </h4>
          {atlas.reason && (
            <p style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: `${COLORS.gold}cc`,
              opacity: 0.95,
              lineHeight: 1.55,
              margin: '0 0 6px',
            }}>
              {atlas.reason}
            </p>
          )}
          {atlas.description && (
            <p style={{
              fontFamily: FONTS.body,
              fontSize: '0.8rem',
              color: COLORS.offWhite,
              opacity: 0.68,
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {atlas.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function ArticleCard({ article, delay, language }) {
  const reduced = useReducedMotion();
  const tr = language === 'tr';
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={article.url} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: `linear-gradient(180deg, ${COLORS.gold}08 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${COLORS.gold}26`,
            borderRadius: '14px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}66`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${COLORS.gold}26`; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: FONTS.body,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              opacity: 0.85,
            }}>{tr ? 'Tefekkür' : 'Essay'}</span>
            {article.readingMinutes && (
              <span style={{
                fontFamily: FONTS.body,
                fontSize: '0.7rem',
                color: COLORS.silver,
                opacity: 0.7,
              }}>
                {article.readingMinutes} {tr ? 'dk okuma' : 'min read'}
              </span>
            )}
          </div>
          <h3 style={{
            fontFamily: FONTS.display,
            fontSize: '1.15rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: '0 0 8px',
            lineHeight: 1.35,
            letterSpacing: '-0.005em',
          }}>
            {article.title} <span style={{ color: COLORS.gold, opacity: 0.8, fontSize: '1rem' }}>→</span>
          </h3>
          {article.reason && (
            <p style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: `${COLORS.gold}cc`,
              margin: '0 0 8px',
              lineHeight: 1.6,
            }}>
              {article.reason}
            </p>
          )}
          {article.tldr && (
            <p style={{
              fontFamily: FONTS.body,
              fontSize: '0.88rem',
              color: COLORS.offWhite,
              lineHeight: 1.6,
              margin: 0,
              opacity: 0.75,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {article.tldr}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function FeedbackRow({ feedback, setFeedback, language, queryHash }) {
  const tr = language === 'tr';
  const reduced = useReducedMotion();
  // localStorage dedup — aynı queryHash için bir kere feedback yeter.
  // Sayfa yeniden mount olduğunda önceki feedback restore edilir.
  useEffect(() => {
    if (!queryHash || feedback) return;
    if (typeof window === 'undefined') return;
    try {
      const prev = localStorage.getItem(`fb:${queryHash}`);
      if (prev === 'up' || prev === 'down') setFeedback(prev);
    } catch { /* localStorage engelli */ }
  }, [queryHash, feedback, setFeedback]);

  const submit = useCallback(async (thumb) => {
    if (feedback) return; // Zaten verilmiş
    setFeedback(thumb); // Optimistic
    if (!queryHash) return;
    try {
      localStorage.setItem(`fb:${queryHash}`, thumb);
    } catch { /* localStorage engelli */ }
    try {
      await fetch('/api/concierge/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryHash, thumb, lang: language }),
      });
    } catch {
      // Silent — feedback non-critical; optimistic state korunur.
    }
  }, [feedback, queryHash, language, setFeedback]);
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: `1px solid ${COLORS.gold}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
      }}
    >
      <span style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.silver, opacity: 0.7 }}>
        {tr ? 'Bu yardımcı oldu mu?' : 'Was this helpful?'}
      </span>
      <button
        aria-label={tr ? 'Faydalı' : 'Helpful'}
        onClick={() => submit('up')}
        style={{
          background: feedback === 'up' ? `${COLORS.gold}22` : 'transparent',
          border: `1px solid ${feedback === 'up' ? COLORS.gold : COLORS.gold + '33'}`,
          borderRadius: '50%',
          width: '36px', height: '36px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: feedback === 'up' ? COLORS.gold : `${COLORS.gold}88`,
          transition: 'all 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h4V9H2v11zm20-11a2 2 0 00-2-2h-6.31l.95-4.57.03-.32a1.5 1.5 0 00-.44-1.06L13.17 0 6.59 6.59A2 2 0 006 8v10a2 2 0 002 2h9a2 2 0 001.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V9z"/></svg>
      </button>
      <button
        aria-label={tr ? 'Faydalı değil' : 'Not helpful'}
        onClick={() => submit('down')}
        style={{
          background: feedback === 'down' ? `${COLORS.gold}22` : 'transparent',
          border: `1px solid ${feedback === 'down' ? COLORS.gold : COLORS.gold + '33'}`,
          borderRadius: '50%',
          width: '36px', height: '36px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: feedback === 'down' ? COLORS.gold : `${COLORS.gold}88`,
          transition: 'all 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(180deg)' }}><path d="M2 20h4V9H2v11zm20-11a2 2 0 00-2-2h-6.31l.95-4.57.03-.32a1.5 1.5 0 00-.44-1.06L13.17 0 6.59 6.59A2 2 0 006 8v10a2 2 0 002 2h9a2 2 0 001.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V9z"/></svg>
      </button>
      {feedback && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.gold, opacity: 0.8 }}
        >
          {tr ? 'Teşekkürler ✓' : 'Thank you ✓'}
        </motion.span>
      )}
    </motion.div>
  );
}
