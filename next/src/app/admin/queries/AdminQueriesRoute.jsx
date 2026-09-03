'use client';

// ─── Admin Queries Dashboard ────────────────────────────────────────────────
// Concierge query + feedback + aggregate arşivini gösterir. Vercel KV'den okur.
//
// Auth: İlk mount'ta ADMIN_TOKEN prompt. sessionStorage'da saklanır.
// URL: /admin/queries (locale-independent, direct route)
//
// Tabs:
//   Recent  — son 50 sorgu
//   Top     — en çok sorulan (aggregate)
//   Feedback— son thumbs
//   Stats   — toplam sayılar
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

const COLORS = {
  bg: '#0a0a1a',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  gold: '#d4a574',
  offWhite: '#e8e6e3',
  silver: '#94a3b8',
  green: '#2ecc71',
  red: '#e74c3c',
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "'JetBrains Mono', 'SF Mono', Menlo, monospace";

function useAdminToken() {
  const [token, setToken] = useState('');
  const [prompted, setPrompted] = useState(false);
  useEffect(() => {
    let t = '';
    try {
      const saved = sessionStorage.getItem('qurancodex_admin_token');
      if (saved) {
        t = saved;
      } else {
        const input = window.prompt('Admin token:');
        if (input) {
          sessionStorage.setItem('qurancodex_admin_token', input);
          t = input;
        }
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(t);
    setPrompted(true);
  }, []);
  // useCallback ile sar — reference stable olsun, load useCallback tetiklenmesin
  const clear = useCallback(() => {
    try { sessionStorage.removeItem('qurancodex_admin_token'); } catch { /* ignore */ }
    setToken('');
  }, []);
  return { token, prompted, clear };
}

async function fetchAdmin(view, token, limit = 50, offset = 0) {
  const res = await fetch(`/api/admin/queries?view=${view}&limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function formatTs(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'medium' });
}

function copyCsv(rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[,"\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\n');
  navigator.clipboard.writeText(csv).then(
    () => alert('CSV kopyalandı — Sheets/Excel\'e yapıştır'),
    () => alert('Kopyalama başarısız')
  );
}

export default function AdminQueriesRoute() {
  const { token, prompted, clear } = useAdminToken();
  const [view, setView] = useState('recent'); // recent | top | feedback | stats
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kvEnabled, setKvEnabled] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  // Load data: view veya token değişince tek sefer çağrılır.
  // useCallback deps loop'a sebep olabildiği için useEffect body içinde
  // async IIFE + cancelled flag ile clean pattern.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const r = await fetchAdmin(view, token, 200);
        if (cancelled) return;
        setKvEnabled(r.kvEnabled !== false);
        if (view === 'stats') {
          setStats(r.data);
          setRows([]);
        } else {
          setRows(Array.isArray(r.data) ? r.data : []);
          setStats(null);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        if (err.message.includes('invalid_token')) clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [view, token, clear, reloadTick]);

  // Manuel refresh button — tick artırarak useEffect tetikle
  const load = useCallback(() => setReloadTick(t => t + 1), []);

  const purgeCache = useCallback(async () => {
    if (!window.confirm('Tüm response cache silinsin mi? (KV disk temizlenir, sonraki query\'ler LLM\'e gider)')) return;
    try {
      const res = await fetch('/api/admin/queries?action=purge_cache', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      alert(`${j.purged || 0} cache entry silindi`);
      load();
    } catch (err) {
      alert(`Purge hatası: ${err.message}`);
    }
  }, [token, load]);

  const tabs = [
    { id: 'recent', label: 'Son Sorgular' },
    { id: 'top', label: 'En Çok Sorulan' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'items', label: 'Item Boost' },
    { id: 'stats', label: 'İstatistik' },
  ];

  if (!prompted) return <div style={{ background: COLORS.bg, minHeight: '100vh' }} />;
  if (!token) {
    return (
      <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.offWhite, padding: '40px', textAlign: 'center', fontFamily: FONT }}>
        <p>Admin token gerekli.</p>
        <button onClick={() => window.location.reload()} style={btnStyle()}>Tekrar dene</button>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.offWhite, fontFamily: FONT, padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: COLORS.gold }}>
              Concierge Admin
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: COLORS.silver }}>
              Query + feedback arşivi
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} disabled={loading} style={btnStyle()}>
              {loading ? '...' : 'Yenile'}
            </button>
            <button onClick={clear} style={btnStyle('danger')}>Çıkış</button>
          </div>
        </div>

        {!kvEnabled && (
          <div style={{ padding: 16, background: `${COLORS.red}22`, border: `1px solid ${COLORS.red}66`, borderRadius: 8, marginBottom: 16 }}>
            ⚠ Vercel KV yapılandırılmamış. Vercel dashboard → Storage → Upstash Redis oluştur.
          </div>
        )}

        {error && (
          <div style={{ padding: 12, background: `${COLORS.red}22`, border: `1px solid ${COLORS.red}44`, borderRadius: 8, marginBottom: 16, color: COLORS.red }}>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              padding: '10px 18px',
              background: view === t.id ? `${COLORS.gold}22` : 'transparent',
              border: 'none',
              borderBottom: view === t.id ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              color: view === t.id ? COLORS.gold : COLORS.silver,
              fontFamily: FONT,
              fontSize: '0.85rem',
              fontWeight: view === t.id ? 700 : 500,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              {t.label}
            </button>
          ))}
          {rows.length > 0 && (
            <button
              onClick={() => copyCsv(rows, Object.keys(rows[0]))}
              style={{ ...btnStyle('ghost'), marginLeft: 'auto' }}
            >
              CSV Kopyala
            </button>
          )}
        </div>

        {/* Content */}
        {view === 'stats' && stats && (
          <StatsView stats={stats} onPurgeCache={purgeCache} />
        )}
        {view === 'recent' && <RecentQueriesTable rows={rows} />}
        {view === 'top' && <TopQueriesTable rows={rows} />}
        {view === 'feedback' && <FeedbackTable rows={rows} />}
        {view === 'items' && <ItemsTable rows={rows} />}

        {rows.length === 0 && view !== 'stats' && !loading && kvEnabled && (
          <p style={{ padding: 40, textAlign: 'center', color: COLORS.silver }}>Kayıt yok.</p>
        )}
      </div>
    </div>
  );
}

function StatsView({ stats, onPurgeCache }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Toplam Sorgu" value={stats.totalQueries || 0} />
        <StatCard label="Toplam Feedback" value={stats.totalFeedback || 0} />
        <StatCard label="Benzersiz Sorgu" value={stats.totalUniqueQueries || 0} />
        <StatCard label="Cache Entry" value={stats.cacheEntries || 0} />
        <StatCard label="Feedback Item" value={stats.itemsWithFeedback || 0} />
      </div>
      {(stats.cacheEntries || 0) > 0 && (
        <div style={{ padding: 16, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: COLORS.offWhite, marginBottom: 4 }}>
                Response Cache
              </div>
              <div style={{ fontSize: '0.72rem', color: COLORS.silver }}>
                {stats.cacheEntries} cached response · TTL 7 gün · corpus/prompt update sonrası purge önerilir
              </div>
            </div>
            <button
              onClick={onPurgeCache}
              style={{ ...btnStyle('danger'), whiteSpace: 'nowrap' }}
            >
              Tümünü Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ padding: 20, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
      <div style={{ fontSize: '0.72rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: COLORS.gold }}>
        {value.toLocaleString('tr-TR')}
      </div>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: COLORS.silver, borderBottom: `1px solid ${COLORS.border}`, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, style = {} }) {
  return (
    <td style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.offWhite, ...style }}>
      {children}
    </td>
  );
}

function langBadge(lang) {
  const bg = lang === 'tr' ? '#d4a57422' : '#3498db22';
  const color = lang === 'tr' ? COLORS.gold : '#3498db';
  return (
    <span style={{ padding: '2px 8px', borderRadius: 4, background: bg, color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
      {(lang || 'tr').toUpperCase()}
    </span>
  );
}

function catBadge(cat, rejected) {
  const map = {
    ok: { bg: '#2ecc7122', c: COLORS.green, label: 'OK' },
    rewrite: { bg: '#d4a57422', c: COLORS.gold, label: 'REWRITE' },
    fetva_talebi: { bg: '#9b59b622', c: '#9b59b6', label: 'FETVA' },
    reject: { bg: '#e74c3c22', c: COLORS.red, label: 'REJECT' },
    off_topic: { bg: '#e74c3c22', c: COLORS.red, label: 'OFF-TOPIC' },
  };
  const style = map[cat] || { bg: '#94a3b822', c: COLORS.silver, label: cat || (rejected ? 'REJECTED' : '—') };
  return (
    <span style={{ padding: '2px 8px', borderRadius: 4, background: style.bg, color: style.c, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
      {style.label}
    </span>
  );
}

function RecentQueriesTable({ rows }) {
  return (
    <Table headers={['Zaman', 'Sorgu', 'Dil', 'Durum', 'Cache', 'Sonuç', 'IP']}>
      {rows.map((r, i) => (
        <tr key={i}>
          <Td style={{ fontFamily: MONO, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{formatTs(r.timestamp)}</Td>
          <Td style={{ maxWidth: 400, wordBreak: 'break-word' }}>{r.query || '—'}</Td>
          <Td>{langBadge(r.lang)}</Td>
          <Td>{catBadge(r.category, r.rejected)}</Td>
          <Td style={{ fontSize: '0.7rem' }}>
            {r.cacheHit ? (
              <span style={{ padding: '2px 8px', borderRadius: 4, background: `${COLORS.green}22`, color: COLORS.green, fontWeight: 700, letterSpacing: '0.05em' }}>HIT</span>
            ) : (
              <span style={{ color: COLORS.silver }}>miss</span>
            )}
          </Td>
          <Td style={{ fontSize: '0.75rem', color: COLORS.silver }}>
            {r.resultsCount
              ? `V:${r.resultsCount.verses} T:${r.resultsCount.tafsirs} At:${r.resultsCount.atlases}`
              : r.rejected ? '—' : ''}
            {r.timingTotal && <span> · {(r.timingTotal / 1000).toFixed(1)}s</span>}
          </Td>
          <Td style={{ fontFamily: MONO, fontSize: '0.7rem', color: COLORS.silver }}>{r.ipHash || '—'}</Td>
        </tr>
      ))}
    </Table>
  );
}

function TopQueriesTable({ rows }) {
  return (
    <Table headers={['Sorgu', 'Sayı', 'Dil', 'İlk', 'Son', '👍', '👎']}>
      {rows.map((r, i) => {
        const total = (r.upCount || 0) + (r.downCount || 0);
        return (
          <tr key={i}>
            <Td style={{ maxWidth: 400, wordBreak: 'break-word' }}>{r.query || '—'}</Td>
            <Td style={{ fontWeight: 700, color: COLORS.gold }}>{r.count || 0}</Td>
            <Td>{langBadge(r.lang)}</Td>
            <Td style={{ fontFamily: MONO, fontSize: '0.72rem' }}>{formatTs(r.firstSeen)}</Td>
            <Td style={{ fontFamily: MONO, fontSize: '0.72rem' }}>{formatTs(r.lastSeen)}</Td>
            <Td style={{ color: COLORS.green, fontWeight: 700 }}>{r.upCount || 0}</Td>
            <Td style={{ color: total > 0 && (r.downCount || 0) / total > 0.4 ? COLORS.red : COLORS.silver, fontWeight: 700 }}>{r.downCount || 0}</Td>
          </tr>
        );
      })}
    </Table>
  );
}

function ItemsTable({ rows }) {
  return (
    <div>
      <div style={{ marginBottom: 12, padding: 12, background: `${COLORS.gold}0d`, border: `1px solid ${COLORS.gold}22`, borderRadius: 8, fontSize: '0.78rem', color: COLORS.silver }}>
        ℹ Feedback ≥ 20 olan itemler retrieval&apos;da boost/demote alır. Boost formülü:
        <code style={{ fontFamily: MONO, marginLeft: 6 }}>cosine × (1 + 0.3 × (quality − 0.5))</code> · max ±%15
      </div>
      <Table headers={['Item ID', '👍', '👎', 'Total', 'Quality', 'Boost', 'Son Güncelleme']}>
        {rows.map((r, i) => {
          const boostPct = (r.boost * 100).toFixed(1);
          const boostColor = r.boost > 0.02 ? COLORS.green : r.boost < -0.02 ? COLORS.red : COLORS.silver;
          const active = r.total >= 20;
          return (
            <tr key={i} style={{ opacity: active ? 1 : 0.55 }}>
              <Td style={{ fontFamily: MONO, fontSize: '0.75rem', maxWidth: 320, wordBreak: 'break-word' }}>{r.itemId}</Td>
              <Td style={{ color: COLORS.green, fontWeight: 700 }}>{r.up}</Td>
              <Td style={{ color: COLORS.red, fontWeight: 700 }}>{r.down}</Td>
              <Td>{r.total}</Td>
              <Td style={{ fontWeight: 700, color: r.quality > 0.7 ? COLORS.green : r.quality < 0.3 ? COLORS.red : COLORS.silver }}>
                {(r.quality * 100).toFixed(0)}%
              </Td>
              <Td style={{ color: boostColor, fontWeight: 700 }}>
                {active ? `${r.boost >= 0 ? '+' : ''}${boostPct}%` : 'cold-start'}
              </Td>
              <Td style={{ fontFamily: MONO, fontSize: '0.72rem', color: COLORS.silver }}>{formatTs(r.lastUpdated)}</Td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

function FeedbackTable({ rows }) {
  return (
    <Table headers={['Zaman', 'Query Hash', 'Item ID', 'Thumb', 'Dil', 'IP']}>
      {rows.map((r, i) => (
        <tr key={i}>
          <Td style={{ fontFamily: MONO, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{formatTs(r.timestamp)}</Td>
          <Td style={{ fontFamily: MONO, fontSize: '0.75rem' }}>{r.queryHash || '—'}</Td>
          <Td style={{ fontFamily: MONO, fontSize: '0.75rem', maxWidth: 300 }}>{r.itemId || '—'}</Td>
          <Td>
            <span style={{ color: r.thumb === 'up' ? COLORS.green : COLORS.red, fontSize: '1.1rem' }}>
              {r.thumb === 'up' ? '👍' : '👎'}
            </span>
          </Td>
          <Td>{langBadge(r.lang)}</Td>
          <Td style={{ fontFamily: MONO, fontSize: '0.7rem', color: COLORS.silver }}>{r.ipHash || '—'}</Td>
        </tr>
      ))}
    </Table>
  );
}

function btnStyle(variant) {
  const base = {
    padding: '8px 16px',
    borderRadius: 6,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    color: COLORS.offWhite,
    fontFamily: FONT,
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };
  if (variant === 'danger') return { ...base, borderColor: `${COLORS.red}66`, color: COLORS.red };
  if (variant === 'ghost') return { ...base, background: 'transparent', color: COLORS.silver };
  return base;
}
