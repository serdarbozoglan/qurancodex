import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS,
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  RADIUS, TRANSITION,
  BREAKPOINT_MOBILE,
} from '../tokens';

// ─── İlk ve Son Kelimeler (F-11) ──────────────────────────────────────────────
// 114 sûrenin açılış ve kapanış kelimelerini aynı ekranda gösterir.
// Veri: public/ilk-son-kelimeler.json
// Arapça metinler verse-graph-bgem3 üzerinden çekildi (standart encoding).
// Tafsir/yorum içeriği bu araçta yer almaz; "Tefsirini oku" butonu ayrı
// TafsirPanel'e (Elmalılı) yönlendirir.

const FILTERS = [
  { id: 'all',              labelTr: 'Tümü',                   labelEn: 'All',                       match: () => true },
  { id: 'mukattaaOpener',   labelTr: 'Mukattaa ile',           labelEn: 'Mukattaʿat',                match: s => s.hasMukattaa === true },
  { id: 'kulOpener',        labelTr: '"Kul" ile',              labelEn: '"Qul"',                     match: s => s.openerTags?.includes('kul-opener') },
  { id: 'oathOpener',       labelTr: 'Yemin ile',              labelEn: 'Oath',                      match: s => s.hasOath === true },
  { id: 'innaOpener',       labelTr: '"İnnâ" ile',             labelEn: '"Innā"',                    match: s => s.openerTags?.includes('inna') },
  { id: 'imperativeOpener', labelTr: 'Emir fiili ile',         labelEn: 'Imperative',                match: s => s.openerTags?.includes('imperative') && !s.openerTags?.includes('kul-opener') },
  { id: 'vocativeOpener',   labelTr: '"Yâ eyyuhâ" ile',        labelEn: 'Vocative',                  match: s => s.openerTags?.includes('vocative') },
  { id: 'divineNameCloser', labelTr: 'İlâhî sıfatla biten',    labelEn: 'Divine attribute closer',   match: s => s.closerTags?.includes('divine-name-closer') },
  { id: 'mekki',            labelTr: 'Mekkî',                  labelEn: 'Meccan',                    match: s => s.revelation === 'mekki' },
  { id: 'medeni',           labelTr: 'Medenî',                 labelEn: 'Medinan',                   match: s => s.revelation === 'medeni' },
];

// Arabic encoding normalizer — drop Uthmani-only marks and harmonize alef/yeh
// variants so KFGQPC renders correctly. See CLAUDE.md §13.14 + §13.15.
const cleanArabic = (str) => {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653');
};

export default function IlkSonKelimeler({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [spotlights, setSpotlights] = useState([]);
  const [activeFilter, setFilter] = useState('all');
  const [searchValue, setSearch]  = useState('');
  const [selected, setSelected]   = useState(null);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < BREAKPOINT_MOBILE);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/ilk-son-kelimeler.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[IlkSonKelimeler] fetch failed:', err));
  }, []);

  useEffect(() => {
    fetch('/ilk-son-kelimeler-spotlights.json')
      .then(r => r.json())
      .then(d => setSpotlights(d.spotlights || []))
      .catch(err => console.error('[IlkSonKelimeler] spotlights fetch failed:', err));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (selected) setSelected(null); else onClose(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, selected]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const fn = FILTERS.find(f => f.id === activeFilter)?.match ?? (() => true);
    let list = data.surahs.filter(fn);
    const q = searchValue.trim().toLowerCase();
    if (q.length >= 2) {
      list = list.filter(s => {
        const haystack = [
          s.nameTr, s.nameEn, s.nameAr,
          s.firstWord?.ar, s.firstWord?.translit, s.firstWord?.meaning,
          s.lastWord?.ar,  s.lastWord?.translit,  s.lastWord?.meaning,
          s.firstAyahArabic, s.lastAyahArabic,
          s.firstAyahTr, s.lastAyahTr,
          ...(s.openerTags || []), ...(s.closerTags || []),
          String(s.surah),
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [data, activeFilter, searchValue]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <Header language={language} onClose={onClose} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header language={language} onClose={onClose} />

      {/* Search + Filter chip row */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '12px 16px 0' : '14px 24px 0',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        background: 'rgba(8,10,18,0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '440px' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={language === 'tr' ? 'Sûre, kelime, anlam ara…' : 'Search surah, word, meaning…'}
            value={searchValue}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: RADIUS.md,
              color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem',
              padding: '8px 12px 8px 36px',
              outline: 'none',
              transition: `border-color ${TRANSITION.fast}`,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: '6px',
          overflowX: 'auto', flexShrink: 0, paddingBottom: '12px',
          scrollbarWidth: 'none',
        }}>
          {FILTERS.map(f => {
            const count = f.id === 'all' ? data.surahs.length : data.surahs.filter(f.match).length;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); setSelected(null); }}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px', borderRadius: RADIUS.md,
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  border: `1px solid ${isActive ? (COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)') : 'rgba(255,255,255,0.07)'}`,
                  color: isActive ? COLORS.gold : 'rgba(148,163,184,0.7)',
                  fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: `all ${TRANSITION.fast}`,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(148,163,184,0.95)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(148,163,184,0.7)';
                  }
                }}
              >
                {language === 'tr' ? f.labelTr : f.labelEn}
                <span style={{
                  background: isActive ? (COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)') : 'rgba(255,255,255,0.06)',
                  borderRadius: RADIUS.xs,
                  color: isActive ? COLORS.gold : 'rgba(148,163,184,0.5)',
                  fontSize: '0.62rem', fontWeight: 600,
                  padding: '1px 6px',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main body: grid (+ detail panel on desktop) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Grid */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: isMobile ? '14px' : '18px 24px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
          alignContent: 'start',
        }}>
          {activeFilter === 'all' && searchValue.trim().length < 2 && spotlights.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <SpotlightSection spotlights={spotlights} language={language} isMobile={isMobile} />
            </div>
          )}
          {filtered.map(s => (
            <Card key={s.surah} surah={s} onClick={() => setSelected(s)} selected={selected?.surah === s.surah} language={language} />
          ))}
          {filtered.length === 0 && (
            <div style={{ color: COLORS.silver, fontSize: '0.88rem', padding: '24px', gridColumn: '1 / -1', textAlign: 'center' }}>
              {language === 'tr' ? 'Bu filtre için sûre bulunamadı.' : 'No surahs for this filter.'}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && !isMobile && (
          <DetailPanel surah={selected} onClose={() => setSelected(null)} language={language} isMobile={false} />
        )}
      </div>

      {/* Mobile: detail as bottom sheet */}
      {selected && isMobile && (
        <DetailPanel surah={selected} onClose={() => setSelected(null)} language={language} isMobile={true} />
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ language, onClose }) {
  return (
    <div style={{ ...OVERLAY_HEADER }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span style={{ ...OVERLAY_TITLE }}>
          {language === 'tr' ? 'İlk ve Son Kelimeler' : 'First and Last Words'}
        </span>
        <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>
          {language === 'tr' ? '114 sûre · açılış-kapanış kelimesi' : '114 surahs · opening-closing word'}
        </span>
      </div>
      <button style={{ ...CLOSE_BTN }} onClick={onClose}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
        onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ surah, onClick, selected, language }) {
  const name = language === 'tr' ? surah.nameTr : (surah.nameEn || surah.nameTr);
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: selected ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.035)',
        border: `1px solid ${selected ? COLORS.goldAlpha40 : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: '10px',
        fontFamily: FONTS.body,
        minHeight: '108px',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      {/* Top: surah no + name + revelation badge */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ color: COLORS.gold, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>
          {String(surah.surah).padStart(3, '0')}
        </span>
        <span style={{ color: COLORS.offWhite, fontSize: '0.92rem', fontWeight: 600 }}>{name}</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: surah.revelation === 'medeni' ? '#8ec5a5' : COLORS.silver,
          opacity: 0.75,
        }}>
          {surah.revelation === 'medeni'
            ? (language === 'tr' ? 'Medenî' : 'Medinan')
            : (language === 'tr' ? 'Mekkî'  : 'Meccan')}
        </span>
      </div>

      {/* Middle: first word → last word */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite,
            lineHeight: 1.4, direction: 'rtl',
          }}>
            {cleanArabic(surah.firstWord?.ar) || '—'}
          </div>
          {surah.firstWord?.translit && (
            <div style={{ fontSize: '0.7rem', color: COLORS.silver, marginTop: '2px', fontStyle: 'italic' }}>
              {surah.firstWord.translit}
            </div>
          )}
        </div>
        <span style={{ color: COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)', fontSize: '1rem', opacity: 0.7 }}>←</span>
        <div style={{ textAlign: 'left' }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite,
            lineHeight: 1.4, direction: 'rtl',
          }}>
            {cleanArabic(surah.lastWord?.ar) || '—'}
          </div>
          {surah.lastWord?.translit && (
            <div style={{ fontSize: '0.7rem', color: COLORS.silver, marginTop: '2px', fontStyle: 'italic' }}>
              {surah.lastWord.translit}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {(surah.openerTags?.length > 0 || surah.hasMukattaa || surah.hasOath) && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {surah.hasMukattaa && <Tag label="mukattaa" />}
          {surah.hasOath && <Tag label="yemin" />}
          {surah.openerTags?.filter(t => t !== 'mukattaa' && t !== 'oath').map(t => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}
    </button>
  );
}

function Tag({ label }) {
  return (
    <span style={{
      padding: '2px 7px', borderRadius: '4px',
      background: 'rgba(212,165,116,0.08)',
      color: COLORS.gold, fontSize: '0.63rem',
      letterSpacing: '0.06em', fontWeight: 500,
      border: '1px solid rgba(212,165,116,0.12)',
    }}>
      {label}
    </span>
  );
}

// ─── Detail panel (right drawer on desktop, bottom sheet on mobile) ───────────
function DetailPanel({ surah, onClose, language, isMobile }) {
  const name = language === 'tr' ? surah.nameTr : (surah.nameEn || surah.nameTr);

  const panelStyle = isMobile ? {
    position: 'fixed', left: 0, right: 0, bottom: 0, top: '15%',
    background: COLORS.cosmicBlack,
    borderTop: `1px solid ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}`,
    boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
    zIndex: 50,
    display: 'flex', flexDirection: 'column',
  } : {
    width: '420px', flexShrink: 0,
    borderLeft: `1px solid ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}`,
    background: 'rgba(8,9,26,0.72)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <aside style={panelStyle} aria-label={language === 'tr' ? 'Sûre detayı' : 'Surah detail'}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: COLORS.gold, fontSize: '0.65rem', letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
            {language === 'tr' ? 'Sûre' : 'Surah'} {surah.surah} · {surah.ayahCount} {language === 'tr' ? 'ayet' : 'verses'}
          </div>
          <div style={{ color: COLORS.offWhite, fontSize: '1.05rem', fontWeight: 700, fontFamily: FONTS.body }}>{name}</div>
        </div>
        <button onClick={onClose} style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.1)'}`,
          color: COLORS.silver, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', fontFamily: FONTS.body }}>
        {/* First ayah */}
        <AyahBlock
          label={language === 'tr' ? 'İlk Ayet' : 'First Verse'}
          verseRef={surah.firstAyahRef}
          word={surah.firstWord}
          ayahAr={surah.firstAyahArabic}
          ayahTr={surah.firstAyahTr}
          language={language}
        />
        {/* Last ayah */}
        <div style={{ height: '18px' }} />
        <AyahBlock
          label={language === 'tr' ? 'Son Ayet' : 'Last Verse'}
          verseRef={surah.lastAyahRef}
          word={surah.lastWord}
          ayahAr={surah.lastAyahArabic}
          ayahTr={surah.lastAyahTr}
          language={language}
        />

        {/* Note (if present) */}
        {surah.note && (
          <div style={{
            marginTop: '18px', padding: '12px 14px',
            background: 'rgba(212,165,116,0.06)', borderLeft: `2px solid ${COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)'}`,
            borderRadius: '4px', fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6,
          }}>
            <div style={{ color: COLORS.gold, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>
              {language === 'tr' ? 'Not' : 'Note'}
            </div>
            {surah.note}
          </div>
        )}

        {/* Tafsir link */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openTafsirPanel', {
              detail: { surah: surah.surah, ayah: 1 },
            }));
          }}
          style={{
            marginTop: '20px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '9px 14px',
            background: 'rgba(212,165,116,0.08)',
            border: `1px solid ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}`,
            borderRadius: RADIUS.md,
            color: COLORS.gold,
            fontSize: '0.78rem', fontWeight: 600,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            transition: `all ${TRANSITION.fast}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.15)';
            e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.08)';
            e.currentTarget.style.borderColor = COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          {language === 'tr' ? 'Bu sûrenin tefsirini oku' : 'Read this surah\'s tafsir'}
        </button>
      </div>
    </aside>
  );
}

function AyahBlock({ label, verseRef, word, ayahAr, ayahTr, language }) {
  return (
    <div>
      <div style={{ color: COLORS.gold, fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
        {label} <span style={{ opacity: 0.65 }}>· {verseRef}</span>
      </div>

      {/* Word spotlight */}
      <div style={{
        padding: '12px 14px', marginBottom: '10px',
        background: 'rgba(212,165,116,0.05)',
        border: '1px solid rgba(212,165,116,0.15)',
        borderRadius: RADIUS.md,
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <div dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran, fontSize: '1.65rem', color: COLORS.offWhite,
          direction: 'rtl', lineHeight: 1.2,
          minWidth: '60px',
        }}>
          {cleanArabic(word?.ar) || '—'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {word?.translit && <div style={{ color: COLORS.gold, fontSize: '0.82rem', fontStyle: 'italic', fontWeight: 500 }}>{word.translit}</div>}
          {word?.meaning && <div style={{ color: COLORS.offWhite, fontSize: '0.78rem', marginTop: '2px' }}>{word.meaning}</div>}
          {word?.root && <div style={{ color: COLORS.silver, fontSize: '0.7rem', marginTop: '4px', opacity: 0.75 }}>
            {language === 'tr' ? 'kök' : 'root'}: <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>{word.root}</span>
          </div>}
        </div>
      </div>

      {/* Full ayah */}
      {ayahAr && (
        <div style={{
          padding: '14px 16px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: RADIUS.md,
          borderLeft: `3px solid ${COLORS.gold}`,
        }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.15rem', color: COLORS.offWhite,
            direction: 'rtl', lineHeight: 2.0,
            marginBottom: ayahTr ? '10px' : 0,
            textAlign: 'right',
          }}>
            {cleanArabic(ayahAr)}
          </div>
          {ayahTr && (
            <div style={{ color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.6, fontStyle: 'italic' }}>
              {ayahTr}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Spotlight Section ────────────────────────────────────────────────────────
// Münâsebât-ı Süver çerçevesinde 7 öne çıkan kelime bağı kartı.
// Bridge / ring / family / cluster / intra-bridge / intra-ring tipleri.
function SpotlightSection({ spotlights, language, isMobile }) {
  if (!spotlights || spotlights.length === 0) return null;
  const tr = language === 'tr';
  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto 32px',
      padding: isMobile ? '0 4px' : 0,
    }}>
      {/* Section header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '0.66rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.65, marginBottom: '8px',
        }}>
          {tr ? 'Münâsebât-ı Süver' : 'Munāsabāt al-Suwar'}
        </div>
        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? '1.4rem' : '1.7rem',
          color: COLORS.offWhite, margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          {tr ? 'Sûreler Arasındaki Gizli Bağ' : 'The Hidden Bond Between Surahs'}
        </h2>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.9rem' : '0.95rem',
          color: COLORS.silver, margin: 0, lineHeight: 1.7,
          maxWidth: '760px',
        }}>
          {tr
            ? 'Her sûrenin ilk ve son kelimesi tesadüf değildir. Klasik İslâm âlimliğinde bunun adı vardır: Münâsebât-ı Süver — sûreler arası ve sûre içi bağıntılar bilimi. Suyûtî, Bikâî, Râzî bu konuya ciltler ayırdı. Aşağıdaki yedi örnek, verideki saklı örüntüleri açar.'
            : 'The first and last words of every surah are no accident. Classical Islamic scholarship has a name for this: Munāsabāt al-Suwar — the science of inter- and intra-surah connections. Al-Suyūṭī, al-Biqāʿī, and al-Rāzī devoted volumes to it. The seven examples below open the patterns hidden in the data.'}
        </p>
      </div>

      {/* Spotlight cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {spotlights.map(sp => (
          <SpotlightCard key={sp.id} spotlight={sp} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function SpotlightCard({ spotlight, language, isMobile }) {
  const tr = language === 'tr';
  const isPair = ['bridge', 'ring', 'intra-bridge', 'intra-ring'].includes(spotlight.type);
  const isList = ['family', 'cluster'].includes(spotlight.type);
  const arrow  = ['ring', 'intra-ring'].includes(spotlight.type) ? '↻' : '→';

  return (
    <div style={{
      padding: isMobile ? '20px 18px' : '28px 32px',
      background: COLORS.goldAlpha04,
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: RADIUS.lg,
    }}>
      {/* Category badge */}
      <div style={{
        fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.7, marginBottom: '10px',
      }}>
        {tr ? spotlight.categoryLabelTr : spotlight.categoryLabelEn}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? '1.15rem' : '1.3rem',
        color: COLORS.offWhite, margin: '0 0 22px',
        lineHeight: 1.3,
      }}>
        {tr ? spotlight.titleTr : spotlight.titleEn}
      </h3>

      {/* Visual: pair or list */}
      {isPair && <SpotlightPair spotlight={spotlight} arrow={arrow} language={language} isMobile={isMobile} />}
      {isList && <SpotlightList spotlight={spotlight} language={language} isMobile={isMobile} />}

      {/* Thematic prose */}
      <p style={{
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.86rem' : '0.92rem',
        color: COLORS.silver, lineHeight: 1.75,
        margin: '22px 0 0',
      }}>
        {tr ? spotlight.thematicTr : spotlight.thematicEn}
      </p>

      {/* Hidden detail */}
      {(spotlight.hiddenTr || spotlight.hiddenEn) && (
        <div style={{
          marginTop: '14px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.025)',
          borderLeft: `2px solid ${COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'}`,
          borderRadius: RADIUS.sm,
        }}>
          <div style={{
            fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, marginBottom: '6px',
          }}>
            {tr ? 'Saklı Detay' : 'Hidden Detail'}
          </div>
          <p style={{
            fontFamily: FONTS.body, fontSize: isMobile ? '0.82rem' : '0.86rem',
            color: COLORS.offWhite, lineHeight: 1.65,
            margin: 0, opacity: 0.88,
          }}>
            {tr ? spotlight.hiddenTr : spotlight.hiddenEn}
          </p>
        </div>
      )}

      {/* Sources */}
      {spotlight.sources && spotlight.sources.length > 0 && (
        <div style={{
          marginTop: '14px',
          fontSize: '0.74rem', fontFamily: FONTS.body,
          color: COLORS.silver, opacity: 0.6,
          fontStyle: 'italic', letterSpacing: '0.02em',
        }}>
          — {spotlight.sources.join(' · ')}
        </div>
      )}
    </div>
  );
}

function SpotlightPair({ spotlight, arrow, language, isMobile }) {
  const { leftSurah: L, rightSurah: R } = spotlight;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
      gap: isMobile ? '10px' : '16px',
      alignItems: 'center',
    }}>
      <SpotlightSurahPanel surah={L} language={language} />
      <div style={{
        fontSize: isMobile ? '1.4rem' : '1.8rem',
        color: COLORS.gold, opacity: 0.55,
        textAlign: 'center',
        padding: isMobile ? '4px' : '0',
        userSelect: 'none',
      }}>
        {arrow}
      </div>
      <SpotlightSurahPanel surah={R} language={language} />
    </div>
  );
}

function SpotlightSurahPanel({ surah, language }) {
  const tr = language === 'tr';
  const positionLabel =
    surah.position === 'ilk'
      ? (tr ? 'İlk' : 'First')
      : (tr ? 'Son' : 'Last');
  return (
    <div style={{
      padding: '16px 14px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.08)'}`,
      borderRadius: RADIUS.md,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: COLORS.silver, opacity: 0.7, marginBottom: '10px',
      }}>
        {surah.num}. {tr ? surah.nameTr : surah.nameEn} · {positionLabel}
      </div>
      <p dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: '1.6rem',
        color: COLORS.gold,
        margin: '0 0 8px',
        lineHeight: 1.6,
      }}>
        {cleanArabic(surah.wordAr)}
      </p>
      {surah.translit && (
        <div style={{
          fontSize: '0.74rem',
          color: COLORS.offWhite, opacity: 0.65,
          fontStyle: 'italic',
          marginBottom: '4px',
        }}>
          {surah.translit}
        </div>
      )}
      {surah.meaning && (
        <div style={{
          fontSize: '0.78rem',
          color: COLORS.offWhite, opacity: 0.85,
        }}>
          {surah.meaning}
        </div>
      )}
    </div>
  );
}

function SpotlightList({ spotlight, language, isMobile }) {
  return (
    <div style={{
      padding: isMobile ? '10px 12px' : '14px 18px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.08)'}`,
      borderRadius: RADIUS.md,
    }}>
      {spotlight.items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '36px 1fr 16px 1.4fr' : '40px 1fr 24px 1.4fr',
            gap: isMobile ? '6px' : '10px',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: i < spotlight.items.length - 1
              ? '1px solid rgba(255,255,255,0.05)'
              : 'none',
          }}
        >
          {/* Surah number */}
          <div style={{
            fontSize: '0.78rem',
            color: COLORS.silver, opacity: 0.7,
            fontWeight: 600,
            fontFamily: FONTS.body,
          }}>
            {item.num}.
          </div>
          {/* First word (Arabic) */}
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            color: COLORS.gold,
            textAlign: 'right',
            lineHeight: 1.4,
          }}>
            {cleanArabic(item.firstAr)}
          </div>
          {/* Arrow */}
          <div style={{
            color: COLORS.gold, opacity: 0.45,
            fontSize: '0.85rem',
            textAlign: 'center',
            userSelect: 'none',
          }}>
            →
          </div>
          {/* Last word + meaning */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
            <span dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              color: COLORS.gold,
              lineHeight: 1.4,
            }}>
              {cleanArabic(item.lastAr)}
            </span>
            {item.lastMeaning && (
              <span style={{
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: COLORS.offWhite, opacity: 0.7,
                fontStyle: 'italic',
              }}>
                {item.lastMeaning}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
