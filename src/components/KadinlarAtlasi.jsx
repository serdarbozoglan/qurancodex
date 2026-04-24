import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';

// ── Kategori → renk eşleşmesi (semantik) ─────────────────────────────────────
const CATEGORY_COLORS = {
  secilmis:        COLORS.gold,        // seçilmiş, alemlerin kadınlarına üstün kılınanlar
  'peygamber-esi': '#a78bfa',          // peygamber eşi — purple (ortaklık)
  anne:            '#2ecc71',          // anne — emerald (yaşam)
  hukumdar:        '#e67e22',          // hükümdar — turuncu (otorite)
  diger:           COLORS.silver,      // diğer
};

// ── Shared CloseBtn (KavimlerAtlasi pattern) ─────────────────────────────────
function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

export default function KadinlarAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('tumu');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_MOBILE);
  const bodyRef = useRef(null);

  // Escape & resize
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/kadinlar.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
          </span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const meta = data.meta || {};
  const figures = data.figures || [];
  const categoryLabels = data.categories?.[language] || {};

  const filteredFigures = filter === 'tumu' ? figures : figures.filter(f => f.type === filter);

  // Filter chips: tümü + her unique tip (sırayla: secilmis, peygamber-esi, anne, hukumdar, diger)
  const types = Array.from(new Set(figures.map(f => f.type)));
  const FILTERS = [
    { id: 'tumu', labelTr: 'Tümü', labelEn: 'All' },
    ...types.map(t => ({ id: t, labelTr: categoryLabels[t] || t, labelEn: data.categories?.en?.[t] || t })),
  ];

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Anılan, seçilen, ders olarak öne çıkan' : 'Named, chosen, set forth as lessons'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── FILTER CHIPS — outside scroll ──────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '6px', padding: '10px 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(0,0,0,0.3)',
        overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          const color = f.id === 'tumu' ? COLORS.gold : (CATEGORY_COLORS[f.id] || COLORS.silver);
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: RADIUS.pill,
                border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                background: active ? `${color}1f` : 'transparent',
                color: active ? color : COLORS.silver,
                fontSize: '0.74rem',
                fontWeight: active ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                letterSpacing: '0.03em',
              }}
            >
              {language === 'tr' ? f.labelTr : f.labelEn}
            </button>
          );
        })}
      </div>

      {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Hero */}
        <Hero meta={meta} figureCount={figures.length} language={language} isMobile={isMobile} />

        {/* Cards grid */}
        <div style={{
          padding: isMobile ? '20px 16px 40px' : '28px 32px 60px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: isMobile ? '14px' : '18px',
        }}>
          {filteredFigures.map(figure => (
            <FigureCard key={figure.id} figure={figure} language={language} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ meta, figureCount, language, isMobile }) {
  const intro = meta.intro?.[language] || '';
  return (
    <div style={{
      padding: isMobile ? '28px 20px 20px' : '40px 40px 28px',
      background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    }}>
      <div style={{
        fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: COLORS.gold, marginBottom: '14px', opacity: 0.7,
      }}>
        {language === 'tr' ? 'TARİH & İNSAN' : 'HISTORY & HUMAN'}
      </div>

      <h2 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? '1.7rem' : '2.1rem',
        color: COLORS.offWhite, margin: '0 0 14px',
        lineHeight: 1.15,
      }}>
        {language === 'tr' ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
      </h2>

      <p style={{
        fontFamily: FONTS.body, fontSize: isMobile ? '0.92rem' : '1rem',
        color: COLORS.silver, margin: 0, lineHeight: 1.6,
        maxWidth: '780px',
      }}>
        {intro}
      </p>

      <div style={{ marginTop: '18px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <Stat value={figureCount} labelTr="Figür" labelEn="Figures" color={COLORS.gold} />
        <Stat value="1" labelTr="İsmi geçen" labelEn="Named" color="#a78bfa" />
        <Stat value="6" labelTr="Sıfat/akrabalıkla" labelEn="By attribute" color={COLORS.silver} />
      </div>
    </div>
  );
}

function Stat({ value, labelTr, labelEn, color }) {
  return (
    <div>
      <div style={{ fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.silver, marginTop: '2px',
        textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {labelTr /* Hero stats label kısa, TR/EN switch hero kapsamında */}
      </div>
    </div>
  );
}

// ── Figure Card ───────────────────────────────────────────────────────────────
function FigureCard({ figure, language, isMobile }) {
  const color = CATEGORY_COLORS[figure.type] || COLORS.silver;
  const name = language === 'tr' ? figure.nameTr : figure.nameEn;
  const epithet = language === 'tr' ? figure.epithetTr : figure.epithetEn;
  const summary = language === 'tr' ? figure.summaryTr : figure.summaryEn;
  const themes = (language === 'tr' ? figure.themesTr : figure.themesEn) || [];
  const criticalNote = language === 'tr' ? figure.criticalNoteTr : figure.criticalNoteEn;
  const keyVerseTr = language === 'tr' ? figure.keyVerseTr : figure.keyVerseEn;
  const keyVerseRef = figure.keyVerseRef;
  const keyVerseAr = figure.keyVerseAr;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${COLORS.glassBorder}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: RADIUS.md,
      padding: isMobile ? '16px' : '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Name + epithet */}
      <div>
        <h3 style={{
          margin: 0, fontFamily: FONTS.display, fontWeight: 700,
          fontSize: '1.15rem', color: COLORS.offWhite, lineHeight: 1.2,
        }}>
          {name}
        </h3>
        {epithet && (
          <p style={{
            margin: '4px 0 0', fontFamily: FONTS.body, fontSize: '0.78rem',
            color, opacity: 0.85, lineHeight: 1.4,
          }}>
            {epithet}
          </p>
        )}
      </div>

      {/* Key verse — Arabic + translation + ref */}
      {keyVerseAr && (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: RADIUS.sm,
          borderLeft: `2px solid ${COLORS.goldAlpha25}`,
        }}>
          <p
            dir="rtl" lang="ar"
            style={{
              margin: '0 0 8px', fontFamily: FONTS.quran,
              fontSize: '1.25rem', color: COLORS.offWhite, lineHeight: 1.7,
            }}
          >
            {keyVerseAr}
          </p>
          {keyVerseTr && (
            <p style={{
              margin: '0 0 6px', fontFamily: FONTS.body,
              fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic', lineHeight: 1.5,
            }}>
              "{keyVerseTr}"
            </p>
          )}
          {keyVerseRef && (
            <p style={{
              margin: 0, fontFamily: FONTS.body, fontSize: '0.72rem',
              color: COLORS.gold, opacity: 0.7,
            }}>
              — {keyVerseRef}
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <p style={{
          margin: 0, fontFamily: FONTS.body, fontSize: '0.86rem',
          color: COLORS.silver, lineHeight: 1.6,
        }}>
          {summary}
        </p>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {themes.map(t => (
            <span key={t} style={{
              padding: '3px 9px',
              background: `${color}1a`,
              border: `1px solid ${color}33`,
              borderRadius: RADIUS.pill,
              fontSize: '0.66rem', color, fontFamily: FONTS.body,
              letterSpacing: '0.03em',
            }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Verse refs */}
      {figure.verseRefs && figure.verseRefs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
          {figure.verseRefs.map(ref => (
            <span key={ref} style={{
              padding: '2px 7px',
              borderRadius: RADIUS.sm,
              fontSize: '0.65rem',
              color: COLORS.silver, opacity: 0.7,
              fontFamily: FONTS.body,
              border: `1px solid ${COLORS.glassBorderSoft}`,
            }}>
              {ref}
            </span>
          ))}
        </div>
      )}

      {/* Critical note */}
      {criticalNote && (
        <p style={{
          margin: 0, padding: '8px 10px',
          background: 'rgba(231,76,60,0.06)',
          border: '1px solid rgba(231,76,60,0.18)',
          borderRadius: RADIUS.sm,
          fontFamily: FONTS.body, fontSize: '0.72rem',
          color: COLORS.silver, lineHeight: 1.5, fontStyle: 'italic',
        }}>
          ⚠ {criticalNote}
        </p>
      )}
    </div>
  );
}
