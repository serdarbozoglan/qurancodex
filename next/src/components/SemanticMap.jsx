'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS,
  RADIUS, TRANSITION,
  BREAKPOINT_MOBILE,
} from '../tokens';
import LoadingOverlay from './LoadingOverlay';
import ToolHeader from './ToolHeader';
// 2026-08-14 (sınıf D): küme detay panelinde ham `**` ekrana basılıyordu
// ("**en büyük embedding kümesi**"). Denetim taraması bunu KAÇIRMIŞTI çünkü
// panel varsayılan olarak KAPALI — probe hiç açmadı, ekran görüntüsü yakaladı.
import { renderInlineMarkdown } from './tefekkur/inlineMarkdown';
import CrossToolCTA from './CrossToolCTA';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../lib/surahNames';

// ─── Semantic Map (F-2) ──────────────────────────────────────────────────────
// 6.236 ayet üzerinde BGE-M3 embedding'i ile NetworkX Louvain topluluk
// algoritmasından çıkan 20 anlamlı semantik küme.
// Veri: public/semantic-map.json (cross-surah edges; same-surah eliminated).
//
// v1: Tema alanları (tr/en/theme/summary) henüz boş — kart başlığı küme #ID
// + ipucu olarak top sûreler. Tema'lar dolduğunda otomatik görünür.

const SORT_OPTIONS = [
  { id: 'size',     labelTr: 'Ayet sayısı',  labelEn: 'Verse count',     fn: (a, b) => b.verse_count - a.verse_count },
  { id: 'spread',   labelTr: 'Sûre yayılımı', labelEn: 'Surah spread',   fn: (a, b) => b.distinct_surahs - a.distinct_surahs },
  { id: 'density',  labelTr: 'Yoğunluk',      labelEn: 'Density',         fn: (a, b) => b.avg_semantic_density - a.avg_semantic_density },
  { id: 'id',       labelTr: 'Sıra (ID)',     labelEn: 'Order (ID)',      fn: (a, b) => a.id - b.id },
];

// ─── Sûre çipi metni ────────────────────────────────────────────────────────
// 2026-08-13: bu çipler EKRANDA BOŞ görünüyordu — ": " ve " ()" basıyorlardı.
// Sebep: bileşen `s.surah_id` ve `s.verse_count` okuyordu, oysa
// `public/semantic-map.json` alanları `surah` ve `count`. 100 kaydın
// 100'ünde `surah_id` undefined'dı. React'in "unique key" uyarısı da aynı
// kökten geliyordu; uyarı düzeltilince asıl hata ortaya çıktı.
// Veri kaynak, bileşen ona uyar — JSON'a dokunulmadı.
// Ayrıca sayı yerine SÛRE ADI gösteriliyor: "26: 56" kimseye bir şey
// söylemiyordu, "Şuarâ · 56" söylüyor.
function surahChip(s, tr) {
  const n = s.surah ?? s.surah_id;
  const count = s.count ?? s.verse_count;
  const names = tr ? SURAH_NAMES_TR : SURAH_NAMES_EN;
  const name = Number.isInteger(n) ? (names?.[n - 1] || `${n}`) : null;
  return { n, count, name };
}

export default function SemanticMap({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]         = useState(null);
  const [sortBy, setSortBy]     = useState('size');
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/semantic-map.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[SemanticMap] fetch failed:', err));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (selected) setSelected(null); else onClose(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, selected]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const sortedClusters = useMemo(() => {
    if (!data) return [];
    const fn = SORT_OPTIONS.find(s => s.id === sortBy)?.fn ?? SORT_OPTIONS[0].fn;
    let list = [...data.clusters].sort(fn);
    const q = search.trim().toLowerCase();
    if (q.length >= 1) {
      list = list.filter(c => {
        const haystack = [
          String(c.id),
          c.tr, c.en, c.theme, c.summary_tr, c.summary_en,
          // 2026-08-14 (Z3a2-kalıntı) — alan adı `surah_id`/`verse_count` değil
          // `surah`/`count` (bkz. satır 44-45'teki aynı fallback). Düzeltilmeden
          // önce 20 kümenin 20'sinde haystack'e "undefined undefined" giriyordu.
          ...(c.top_surahs || []).map(s => `${s.surah ?? s.surah_id} ${s.count ?? s.verse_count}`),
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [data, sortBy, search]);

  const SEMANTIC_TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.5"/>
          <circle cx="18" cy="6" r="2.5"/>
          <circle cx="6" cy="18" r="2.5"/>
          <circle cx="18" cy="18" r="2.5"/>
          <path d="M8 6h8M6 8v8M18 8v8M8 18h8"/>
        </svg>
      }
      titleTr="Semantik Harita"
      titleEn="Semantic Map"
      subtitleTr="Anlamca yakın ayetlerin 20 kümesi"
      subtitleEn="20 clusters of verses close in meaning"
      language={language}
    />
  );

  // #202 (2026-07-16) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: 'Kavramlar arası bağlantılar — anlamsal kümelerin insan-tanımlı karşılığı.', descEn: 'Concept connections — human-defined counterpart of semantic clusters.' },
          { href: `/${language}/atlas/furuk`, titleTr: 'Füruk Atlası', titleEn: 'Semantic Distinctions Atlas', descTr: 'Yakın anlamlı kelimeler — kümelenmenin kelime düzeyindeki mekaniği.', descEn: 'Near-synonym words — the word-level mechanics of clustering.' },
          { href: `/${language}/graf/ayet`, titleTr: 'Ayet Grafiği', titleEn: 'Verse Graph', descTr: 'Tek ayet düzeyinde anlamca yakın ayetleri görselleştir.', descEn: 'Visualize the verses closest in meaning to a single verse.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        {SEMANTIC_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex' }}>
          <LoadingOverlay />
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const themedCount = data.clusters.filter(c => c.tr).length;

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      {SEMANTIC_TOOL_HEADER}

      {/* Method note + filter bar */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '12px 16px 0' : '14px 24px 0',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        background: 'rgba(8,10,18,0.92)',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {/* Methodology summary */}
        <div style={{
          fontSize: '0.7rem', color: COLORS.silver, opacity: 0.78,
          fontFamily: FONTS.body, lineHeight: 1.55,
        }}>
          {language === 'tr'
            ? `${data.total_verses.toLocaleString('tr')} ayet · ${data.meaningful_communities} anlamlı küme · anlam benzerliği ≥ ${data.threshold}`
            : `${data.total_verses.toLocaleString('en')} verses · ${data.meaningful_communities} meaningful clusters · meaning similarity ≥ ${data.threshold}`}
          {themedCount < data.clusters.length && (
            <span style={{ marginLeft: '8px', color: COLORS.gold, opacity: 0.75 }}>
              · {language === 'tr' ? `${themedCount}/${data.clusters.length} tema'lı` : `${themedCount}/${data.clusters.length} themed`}
            </span>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={language === 'tr' ? 'Tema, sûre, ID ara…' : 'Search theme, surah, ID…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: RADIUS?.md || '8px',
              color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem',
              padding: '8px 12px 8px 36px', outline: 'none',
              transition: `border-color ${TRANSITION?.fast || '0.15s ease'}`,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </div>

        {/* Sort chips */}
        <div style={{
          display: 'flex', gap: '6px',
          overflowX: 'auto', flexShrink: 0, paddingBottom: '12px',
          scrollbarWidth: 'none',
        }}>
          <span style={{
            color: COLORS.silver, opacity: 0.78, fontSize: '0.68rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: FONTS.body, alignSelf: 'center', marginRight: '6px',
          }}>
            {language === 'tr' ? 'Sırala' : 'Sort'}:
          </span>
          {SORT_OPTIONS.map(s => {
            const isActive = sortBy === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px', borderRadius: RADIUS?.md || '6px',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  border: `1px solid ${isActive ? (COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)') : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? COLORS.gold : COLORS.silver,
                  fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {language === 'tr' ? s.labelTr : s.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body: cluster grid + detail panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '14px' : '18px 24px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '12px',
          alignContent: 'start',
        }}>
          {sortedClusters.map(c => (
            <ClusterCard
              key={c.id}
              cluster={c}
              onClick={() => setSelected(c)}
              selected={selected?.id === c.id}
              language={language}
              maxVerseCount={Math.max(...data.clusters.map(x => x.verse_count))}
            />
          ))}
          {sortedClusters.length === 0 && (
            <div style={{ color: COLORS.silver, fontSize: '0.88rem', padding: '24px', gridColumn: '1 / -1', textAlign: 'center' }}>
              {language === 'tr' ? 'Aramaya uygun küme bulunamadı.' : 'No clusters match your search.'}
            </div>
          )}
        </div>

        {selected && !isMobile && (
          <DetailPanel cluster={selected} onClose={() => setSelected(null)} language={language} isMobile={false} clustersById={data.clusters} />
        )}
      </div>

      {selected && isMobile && (
        <DetailPanel cluster={selected} onClose={() => setSelected(null)} language={language} isMobile={true} clustersById={data.clusters} />
      )}
      {RELATED_CTA}
    </div>
  );
}

// ─── Cluster Card ────────────────────────────────────────────────────────────
function ClusterCard({ cluster, onClick, selected, language, maxVerseCount }) {
  const c = cluster;
  const title = language === 'tr' ? c.tr : c.en;
  const hasTheme = !!title;
  // size bar — relative width based on verse_count
  const sizeRatio = Math.max(0.06, c.verse_count / maxVerseCount);
  // Top 3 surahs (preview)
  const topPreview = (c.top_surahs || []).slice(0, 3);

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: selected ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.035)',
        border: `1px solid ${selected ? (COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)') : 'rgba(255,255,255,0.08)'}`,
        borderRadius: RADIUS?.lg || '10px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: '10px',
        fontFamily: FONTS.body,
        minHeight: '120px',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      {/* Top: cluster ID + theme/title */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', flexShrink: 0 }}>
          #{String(c.id).padStart(2, '0')}
        </span>
        <span style={{
          color: hasTheme ? COLORS.offWhite : COLORS.silver,
          fontSize: hasTheme ? '0.95rem' : '0.82rem',
          fontWeight: hasTheme ? 600 : 400,
          fontStyle: hasTheme ? 'normal' : 'italic',
          opacity: hasTheme ? 1 : 0.6,
          lineHeight: 1.35,
        }}>
          {hasTheme ? title : (language === 'tr' ? '(tema henüz tanımlanmadı)' : '(theme not yet defined)')}
        </span>
      </div>

      {/* Stat row */}
      <div style={{
        display: 'flex', gap: '14px', fontSize: '0.72rem',
        color: COLORS.silver, opacity: 0.85,
      }}>
        <span><b style={{ color: COLORS.offWhite }}>{c.verse_count}</b> {language === 'tr' ? 'ayet' : 'verses'}</span>
        <span><b style={{ color: COLORS.offWhite }}>{c.distinct_surahs}</b> {language === 'tr' ? 'sûre' : 'surahs'}</span>
        <span style={{ opacity: 0.65 }}>ρ {c.avg_semantic_density.toFixed(3)}</span>
      </div>

      {/* Size bar */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${sizeRatio * 100}%`, height: '100%',
          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)'})`,
          opacity: 0.7,
        }} />
      </div>

      {/* Top surahs preview */}
      {topPreview.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {/* key: veri dosyasında alan adı `surah`; `surah_id` fallback + son çare index
              (aksi halde key undefined olur ve React "unique key prop" uyarısı verir) */}
          {topPreview.map((s, i) => (
            <span key={s.surah ?? s.surah_id ?? `top-${i}`} style={{
              padding: '2px 7px', borderRadius: '4px',
              background: 'rgba(212,165,116,0.07)',
              color: COLORS.gold, fontSize: '0.66rem',
              fontWeight: 500,
              border: '1px solid rgba(212,165,116,0.12)',
            }}>
              {(() => { const c = surahChip(s, language === 'tr'); return `${c.name ?? '?'} · ${c.count ?? 0}`; })()}
            </span>
          ))}
          {(c.top_surahs?.length || 0) > 3 && (
            <span style={{ color: COLORS.silver, fontSize: '0.66rem', opacity: 0.78, alignSelf: 'center' }}>
              +{c.top_surahs.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Detail Panel ────────────────────────────────────────────────────────────
function DetailPanel({ cluster, onClose, language, isMobile, clustersById }) {
  const c = cluster;
  const title = language === 'tr' ? c.tr : c.en;
  const summary = language === 'tr' ? c.summary_tr : c.summary_en;
  const wowNote = language === 'tr' ? c.wow_note_tr : c.wow_note_en;

  const panelStyle = isMobile ? {
    position: 'fixed', left: 0, right: 0, bottom: 0, top: '12%',
    background: COLORS.cosmicBlack,
    borderTop: `1px solid ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}`,
    boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
    zIndex: 50,
    display: 'flex', flexDirection: 'column',
  } : {
    width: '440px', flexShrink: 0,
    borderLeft: `1px solid ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}`,
    background: 'rgba(8,9,26,0.72)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  };

  // Look up neighbor cluster names
  const neighbors = (c.neighbor_clusters || []).slice(0, 5).map(n => {
    const found = clustersById.find(cl => cl.id === n.id);
    return { ...n, label: found ? (language === 'tr' ? (found.tr || `#${found.id}`) : (found.en || `#${found.id}`)) : `#${n.id}` };
  });

  return (
    <aside style={panelStyle} aria-label={language === 'tr' ? 'Küme detayı' : 'Cluster detail'}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: COLORS.gold, fontSize: '0.65rem', letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
            {language === 'tr' ? 'Küme' : 'Cluster'} #{String(c.id).padStart(2, '0')}
          </div>
          <div style={{
            color: title ? COLORS.offWhite : COLORS.silver,
            fontSize: '1.0rem', fontWeight: 700, fontFamily: FONTS.body,
            fontStyle: title ? 'normal' : 'italic',
          }}>
            {title || (language === 'tr' ? '(tema henüz tanımlanmadı)' : '(theme not yet defined)')}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={language === 'tr' ? 'Detay panelini kapat' : 'Close detail panel'}
          style={{
            width: '30px', height: '30px', borderRadius: RADIUS.full,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.1)'}`,
            color: COLORS.silver, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', fontFamily: FONTS.body }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          <Stat label={language === 'tr' ? 'Ayet' : 'Verses'}    value={c.verse_count} />
          <Stat label={language === 'tr' ? 'Sûre' : 'Surahs'}    value={c.distinct_surahs} />
          <Stat label={language === 'tr' ? 'Yoğunluk' : 'Density'} value={c.avg_semantic_density.toFixed(3)} />
        </div>

        {/* Summary */}
        {summary && (
          <Block label={language === 'tr' ? 'Özet' : 'Summary'}>
            <div style={{ color: COLORS.offWhite, fontSize: '0.86rem', lineHeight: 1.65 }}>{renderInlineMarkdown(summary)}</div>
          </Block>
        )}

        {/* Wow note */}
        {wowNote && (
          <Block label={language === 'tr' ? 'Dikkat çekici' : 'Wow'} accent>
            <div style={{ color: COLORS.offWhite, fontSize: '0.84rem', lineHeight: 1.65, fontStyle: 'italic' }}>{renderInlineMarkdown(wowNote)}</div>
          </Block>
        )}

        {/* Sources */}
        {c.sources?.length > 0 && (
          <Block label={language === 'tr' ? 'Kaynaklar' : 'Sources'}>
            <ul style={{ margin: 0, padding: '0 0 0 18px', color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.65 }}>
              {c.sources.map((s, i) => <li key={i}>{renderInlineMarkdown(s)}</li>)}
            </ul>
          </Block>
        )}

        {/* Central verses */}
        {c.central_verses?.length > 0 && (
          <Block label={language === 'tr' ? 'Merkezi Ayetler' : 'Central Verses'}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {c.central_verses.map(v => <VerseChip key={v} verseRef={v} />)}
            </div>
          </Block>
        )}

        {/* Top surahs */}
        {c.top_surahs?.length > 0 && (
          <Block label={language === 'tr' ? 'Öne çıkan sûreler' : 'Top surahs'}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {c.top_surahs.map((s, i) => (
                <span key={s.surah ?? s.surah_id ?? `top-${i}`} style={{
                  padding: '3px 8px', borderRadius: '4px',
                  background: 'rgba(212,165,116,0.07)',
                  color: COLORS.gold, fontSize: '0.72rem',
                  border: '1px solid rgba(212,165,116,0.15)',
                }}>
                  {(() => { const c = surahChip(s, language === 'tr'); return c.name ?? '?'; })()}{' '}
                  <span style={{ opacity: 0.65 }}>({(() => surahChip(s, language === 'tr').count ?? 0)()})</span>
                </span>
              ))}
            </div>
          </Block>
        )}

        {/* Neighbor clusters */}
        {neighbors.length > 0 && (
          <Block label={language === 'tr' ? 'Komşu kümeler' : 'Neighbor clusters'}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {neighbors.map(n => (
                <li key={n.id} style={{ fontSize: '0.78rem', color: COLORS.silver }}>
                  <span style={{ color: COLORS.gold, fontWeight: 600 }}>#{String(n.id).padStart(2, '0')}</span>
                  <span style={{ marginLeft: '6px' }}>{n.label}</span>
                  {typeof n.weight === 'number' && (
                    <span style={{ marginLeft: '8px', opacity: 0.5 }}>· {n.weight.toFixed(3)}</span>
                  )}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {/* Total verse list (collapsed by default) */}
        {c.verse_ids?.length > 0 && <VerseListExpand verseIds={c.verse_ids} language={language} />}
      </div>
    </aside>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: '6px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center',
    }}>
      <div style={{ color: COLORS.gold, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: COLORS.offWhite, fontSize: '1.1rem', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Block({ label, accent, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        color: accent ? COLORS.gold : COLORS.silver,
        fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
        fontWeight: 700, marginBottom: '6px',
        opacity: accent ? 1 : 0.75,
      }}>
        {label}
      </div>
      <div style={{
        padding: accent ? '10px 12px' : '0',
        background: accent ? 'rgba(212,165,116,0.06)' : 'transparent',
        borderLeft: accent ? `2px solid ${COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)'}` : 'none',
        borderRadius: accent ? '4px' : '0',
      }}>
        {children}
      </div>
    </div>
  );
}

// `ref` React'te AYRILMIŞ bir prop adıdır — veri taşımak için kullanılamaz
// (2026-08-14). Bileşen `{ ref: verseRef }` diye yeniden adlandırsa bile React
// onu prop olarak geçirmeyi garanti etmez; çip metni boş kalıyordu.
// Prop adı `verseRef` yapıldı.
function VerseChip({ verseRef }) {
  return (
    <span style={{
      padding: '3px 8px', borderRadius: '4px',
      background: 'rgba(255,255,255,0.04)',
      color: COLORS.offWhite, fontSize: '0.72rem',
      border: '1px solid rgba(255,255,255,0.08)',
      fontFamily: FONTS.body,
    }}>
      {verseRef}
    </span>
  );
}

// Collapsed by default — expand to see all verse IDs
function VerseListExpand({ verseIds, language }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none',
          color: COLORS.silver, fontSize: '0.72rem',
          padding: '6px 0', cursor: 'pointer',
          letterSpacing: '0.08em',
          fontFamily: FONTS.body,
        }}
      >
        {open
          ? (language === 'tr' ? `▾ Tüm ${verseIds.length} ayet` : `▾ All ${verseIds.length} verses`)
          : (language === 'tr' ? `▸ Tüm ${verseIds.length} ayet ` : `▸ All ${verseIds.length} verses`)}
      </button>
      {open && (
        <div style={{
          maxHeight: '300px', overflowY: 'auto',
          padding: '8px',
          display: 'flex', flexWrap: 'wrap', gap: '4px',
          fontFamily: FONTS.body, fontSize: '0.7rem',
          color: COLORS.silver, opacity: 0.85,
          background: 'rgba(0,0,0,0.2)', borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {verseIds.map(v => <span key={v}>{v}</span>)}
        </div>
      )}
    </div>
  );
}
