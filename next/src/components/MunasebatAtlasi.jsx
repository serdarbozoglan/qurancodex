'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE,
} from '../tokens';
import { SURAH_NAMES_TR } from '../lib/surahNames';

const SURAH_NAMES_EN = [
  'Al-Fātiḥa','Al-Baqara','Āl ʿImrān','An-Nisāʾ','Al-Māʾida',
  'Al-Anʿām','Al-Aʿrāf','Al-Anfāl','At-Tawba','Yūnus',
  'Hūd','Yūsuf','Ar-Raʿd','Ibrāhīm','Al-Ḥijr','An-Naḥl',
  'Al-Isrāʾ','Al-Kahf','Maryam','Ṭā-Hā','Al-Anbiyāʾ','Al-Ḥajj',
  'Al-Muʾminūn','An-Nūr','Al-Furqān','Ash-Shuʿarāʾ','An-Naml',
  'Al-Qaṣaṣ','Al-ʿAnkabūt','Ar-Rūm','Luqmān','As-Sajda','Al-Aḥzāb',
  'Sabaʾ','Fāṭir','Yā-Sīn','Aṣ-Ṣāffāt','Ṣād','Az-Zumar','Ghāfir',
  'Fuṣṣilat','Ash-Shūrā','Az-Zukhruf','Ad-Dukhān','Al-Jāthiya','Al-Aḥqāf',
  'Muḥammad','Al-Fatḥ','Al-Ḥujurāt','Qāf','Adh-Dhāriyāt','Aṭ-Ṭūr',
  'An-Najm','Al-Qamar','Ar-Raḥmān','Al-Wāqiʿa','Al-Ḥadīd','Al-Mujādila',
  'Al-Ḥashr','Al-Mumtaḥana','Aṣ-Ṣaff','Al-Jumuʿa','Al-Munāfiqūn',
  'At-Taghābun','Aṭ-Ṭalāq','At-Taḥrīm','Al-Mulk','Al-Qalam','Al-Ḥāqqa',
  'Al-Maʿārij','Nūḥ','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyāma',
  'Al-Insān','Al-Mursalāt','An-Nabaʾ','An-Nāziʿāt','ʿAbasa','At-Takwīr',
  'Al-Infiṭār','Al-Muṭaffifīn','Al-Inshiqāq','Al-Burūj','Aṭ-Ṭāriq','Al-Aʿlā',
  'Al-Ghāshiya','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Aḍ-Ḍuḥā',
  'Ash-Sharḥ','At-Tīn','Al-ʿAlaq','Al-Qadr','Al-Bayyina','Az-Zalzala',
  'Al-ʿĀdiyāt','Al-Qāriʿa','At-Takāthur','Al-ʿAṣr','Al-Humaza','Al-Fīl',
  'Quraysh','Al-Māʿūn','Al-Kawthar','Al-Kāfirūn','An-Naṣr','Al-Masad',
  'Al-Ikhlāṣ','Al-Falaq','An-Nās',
];

function surahLabel(num, lang) {
  const arr = lang === 'en' ? SURAH_NAMES_EN : SURAH_NAMES_TR;
  const name = arr[num - 1];
  if (!name) return String(num);
  if (lang === 'en') return name;
  return name.replace(/^(El-|En-|Et-|Eş-|Ez-|Er-|Ed-|Al-)/, '');
}

const STRENGTH_LABEL = {
  iconic:     { tr: 'İkonik',     en: 'Iconic' },
  strong:     { tr: 'Güçlü',      en: 'Strong' },
  thematic:   { tr: 'Tematik',    en: 'Thematic' },
  structural: { tr: 'Yapısal',    en: 'Structural' },
};

const STRENGTH_COLOR = {
  iconic:     COLORS.gold,
  strong:     COLORS.softEmerald,
  thematic:   COLORS.skyBlue,
  structural: COLORS.silver,
};

const TABS = [
  { id: 'connections', tr: 'Bağlantılar',    en: 'Connections' },
  { id: 'types',       tr: 'Bağlantı Türleri', en: 'Connection Types' },
  { id: 'groups',      tr: 'Harf Grupları',  en: 'Letter Groups' },
  { id: 'scholars',    tr: 'Âlim Kitaplığı', en: 'Scholars' },
];

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ language, onClose }) {
  return (
    <div style={OVERLAY_HEADER}>
      <span style={OVERLAY_TITLE}>
        {language === 'tr'
          ? 'Münâsebât — Sure Bağlantıları'
          : 'Munāsabāt — Surah Connections'}
      </span>
      <button
        onClick={onClose}
        style={{ ...CLOSE_BTN }}
        aria-label={language === 'tr' ? 'Kapat' : 'Close'}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ language, isMobile, activeTab, setActiveTab }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        padding: isMobile ? '10px 12px' : '12px 20px',
        background: 'rgba(8,9,26,0.85)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}
    >
      {TABS.map((t, i) => {
        const active = activeTab === i;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: `1px solid ${active ? COLORS.goldAlpha45 : 'transparent'}`,
              background: active ? COLORS.goldAlpha15 : 'transparent',
              color: active ? COLORS.gold : COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.82rem',
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {language === 'tr' ? t.tr : t.en}
          </button>
        );
      })}
    </div>
  );
}

// ── Type Chip ────────────────────────────────────────────────────────────────
function TypeChip({ type, language }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: '10px',
        background: `${type.color}22`,
        border: `1px solid ${type.color}66`,
        color: type.color,
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {language === 'tr' ? type.nameTr : type.nameEn}
    </span>
  );
}

// ── Connection Card ──────────────────────────────────────────────────────────
function ConnectionCard({ conn, typesById, scholarsById, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [s1, s2] = conn.surahs;
  const strengthKey = conn.strength || 'thematic';
  const strengthColor = STRENGTH_COLOR[strengthKey] || COLORS.silver;

  return (
    <div
      style={{
        ...GLASS_CARD,
        padding: isMobile ? '16px' : '20px 22px',
        marginBottom: '14px',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            letterSpacing: '0.01em',
          }}
        >
          {surahLabel(s1, language)}
          <span style={{ margin: '0 8px', color: COLORS.gold }}>↔</span>
          {surahLabel(s2, language)}
        </span>
        <span
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            color: strengthColor,
            background: `${strengthColor}18`,
            padding: '2px 8px',
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {language === 'tr'
            ? STRENGTH_LABEL[strengthKey]?.tr
            : STRENGTH_LABEL[strengthKey]?.en}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          color: COLORS.gold,
          fontWeight: 600,
          marginBottom: '4px',
        }}
      >
        {language === 'tr' ? conn.nameTr : conn.nameEn}
        {conn.nameAr && (
          <span style={{
            marginLeft: '10px', fontFamily: FONTS.quran, color: COLORS.silver,
            fontSize: '0.9rem', fontWeight: 400,
          }} dir="rtl" lang="ar">
            {conn.nameAr}
          </span>
        )}
      </div>

      {/* Type chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
        {conn.types?.map((tid) => {
          const type = typesById[tid];
          if (!type) return null;
          return <TypeChip key={tid} type={type} language={language} />;
        })}
      </div>

      {/* Summary */}
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: '0.92rem',
          color: COLORS.offWhite,
          lineHeight: 1.7,
          margin: '6px 0 0',
        }}
      >
        {language === 'tr' ? conn.summaryTr : conn.summaryEn}
      </p>

      {/* Expand/collapse — only if there's anchors, hadith or quote */}
      {(conn.anchors?.length || conn.hadith || conn.quote) && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop: '12px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: `1px solid ${COLORS.goldAlpha25}`,
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.goldAlpha15; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {expanded
            ? (language === 'tr' ? '▾ Detayı gizle' : '▾ Hide details')
            : (language === 'tr' ? '▸ Ayet ve kaynakları göster' : '▸ Show verses & sources')}
        </button>
      )}

      {expanded && (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {conn.anchors?.map((a, i) => (
            <div
              key={i}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(212,165,116,0.05)',
                border: `1px solid ${COLORS.goldAlpha15}`,
              }}
            >
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.3rem',
                  color: COLORS.offWhite,
                  textAlign: 'right',
                  margin: '0 0 8px',
                  lineHeight: 1.9,
                }}
              >
                {a.arabic}
              </p>
              <p
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.85rem',
                  color: COLORS.silver,
                  fontStyle: 'italic',
                  margin: '0 0 4px',
                }}
              >
                {language === 'tr' ? a.tr : a.en}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '0.75rem',
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                }}
              >
                <span>— {a.ref}</span>
                <span style={{ color: COLORS.silver, fontStyle: 'italic' }}>
                  {language === 'tr' ? a.roleTr : a.roleEn}
                </span>
              </div>
            </div>
          ))}

          {conn.hadith && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(46,204,113,0.06)',
                border: '1px solid rgba(46,204,113,0.25)',
              }}
            >
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: COLORS.softEmerald, marginBottom: '6px',
                fontFamily: FONTS.body,
              }}>
                {language === 'tr' ? 'Hadîs' : 'Hadīth'}
              </div>
              <p style={{
                fontSize: '0.87rem', color: COLORS.offWhite, lineHeight: 1.65,
                margin: '0 0 6px', fontFamily: FONTS.body,
              }}>
                "{language === 'tr' ? conn.hadith.textTr : conn.hadith.textEn}"
              </p>
              <p style={{
                fontSize: '0.75rem', color: COLORS.silver, fontStyle: 'italic',
                margin: 0, fontFamily: FONTS.body,
              }}>
                — {conn.hadith.source}
              </p>
            </div>
          )}

          {conn.quote && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(155,89,182,0.07)',
                border: '1px solid rgba(155,89,182,0.3)',
              }}
            >
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: COLORS.violet, marginBottom: '6px',
                fontFamily: FONTS.body,
              }}>
                {scholarsById[conn.quote.scholar]?.nameTr || conn.quote.scholar}
              </div>
              <p style={{
                fontSize: '0.87rem', color: COLORS.offWhite, lineHeight: 1.65,
                margin: '0 0 6px', fontFamily: FONTS.body, fontStyle: 'italic',
              }}>
                "{language === 'tr' ? conn.quote.textTr : conn.quote.textEn}"
              </p>
              <p style={{
                fontSize: '0.75rem', color: COLORS.silver, margin: 0, fontFamily: FONTS.body,
              }}>
                — {conn.quote.source}
              </p>
            </div>
          )}

          {conn.sources?.length > 0 && (
            <div style={{
              fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
              marginTop: '2px',
            }}>
              <span style={{ color: COLORS.gold, fontWeight: 600 }}>
                {language === 'tr' ? 'Kaynaklar: ' : 'Sources: '}
              </span>
              {conn.sources.map((sid) => scholarsById[sid]?.nameTr || sid).join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Type List ────────────────────────────────────────────────────────────────
function TypeList({ types, language, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
      {types.map((t) => (
        <div
          key={t.id}
          style={{
            ...GLASS_CARD,
            padding: '18px 20px',
            borderLeft: `3px solid ${t.color}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700,
              color: COLORS.offWhite,
            }}>
              {language === 'tr' ? t.nameTr : t.nameEn}
            </span>
            <span
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: '1rem',
                color: t.color,
              }}
            >
              {t.nameAr}
            </span>
          </div>
          <p style={{
            fontFamily: FONTS.body, fontSize: '0.88rem', color: COLORS.offWhite,
            lineHeight: 1.6, margin: 0,
          }}>
            {language === 'tr' ? t.descriptionTr : t.descriptionEn}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Group List ───────────────────────────────────────────────────────────────
function GroupList({ groups, language, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {groups.map((g) => (
        <div key={g.id} style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: FONTS.display, fontSize: '1.15rem', fontWeight: 700,
              color: COLORS.offWhite,
            }}>
              {language === 'tr' ? g.nameTr : g.nameEn}
            </span>
            {g.lettersAr && (
              <span dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold,
              }}>
                {g.lettersAr}
              </span>
            )}
          </div>
          <div style={{
            fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body,
            marginBottom: '8px',
          }}>
            {g.surahs.map((n) => `${n}. ${surahLabel(n, language)}`).join(' · ')}
          </div>
          <p style={{
            fontFamily: FONTS.body, fontSize: '0.9rem', color: COLORS.offWhite,
            lineHeight: 1.65, margin: 0,
          }}>
            {language === 'tr' ? g.descriptionTr : g.descriptionEn}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Scholar List ─────────────────────────────────────────────────────────────
function ScholarList({ scholars, language, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
      {scholars.map((s) => (
        <div key={s.id} style={{ ...GLASS_CARD, padding: '16px 20px' }}>
          <div style={{
            fontFamily: FONTS.display, fontSize: '1.1rem', fontWeight: 700,
            color: COLORS.offWhite, marginBottom: '2px',
          }}>
            {s.nameTr}
          </div>
          <div style={{
            fontSize: '0.74rem', color: COLORS.gold, fontFamily: FONTS.body,
            marginBottom: '8px', fontWeight: 600,
          }}>
            {(language === 'tr' ? s.roleTr : s.roleEn) || s.roleTr}
            {s.deathH != null && ` · ö. ${s.deathH} H / ${s.deathM} M`}
            {s.deathH == null && s.deathM != null && ` · ö. ${s.deathM}`}
          </div>
          {s.workTr && (
            <div style={{
              fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic',
              marginBottom: '6px', fontFamily: FONTS.body,
            }}>
              {s.workTr}
            </div>
          )}
          <p style={{
            fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.offWhite,
            lineHeight: 1.6, margin: 0,
          }}>
            {language === 'tr' ? s.noteTr : (s.noteEn || s.noteTr)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MunasebatAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < BREAKPOINT_MOBILE);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [strengthFilter, setStrengthFilter] = useState(null);

  // Responsive
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ESC handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/surah-connections.json')
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error('Münâsebât data load failed', err));
  }, []);

  const typesById = useMemo(() => {
    if (!data?.types) return {};
    return Object.fromEntries(data.types.map((t) => [t.id, t]));
  }, [data]);

  const scholarsById = useMemo(() => {
    if (!data?.scholars) return {};
    return Object.fromEntries(data.scholars.map((s) => [s.id, s]));
  }, [data]);

  const filteredConnections = useMemo(() => {
    if (!data?.connections) return [];
    return data.connections.filter((c) => {
      if (typeFilter && !c.types?.includes(typeFilter)) return false;
      if (strengthFilter && c.strength !== strengthFilter) return false;
      return true;
    });
  }, [data, typeFilter, strengthFilter]);

  if (!data) {
    return (
      <div style={OVERLAY_BASE} role="dialog" aria-modal="true">
        <Header language={language} onClose={onClose} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 'calc(100vh - 54px)', color: COLORS.silver, fontFamily: FONTS.body,
        }}>
          {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
        </div>
      </div>
    );
  }

  const contentPadding = isMobile ? '16px' : '24px 32px';

  return (
    <div style={OVERLAY_BASE} role="dialog" aria-modal="true">
      <Header language={language} onClose={onClose} />
      <TabBar language={language} isMobile={isMobile} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{
        height: 'calc(100vh - 54px - 54px)',
        overflowY: 'auto',
        padding: contentPadding,
      }}>
        {/* ── Intro on first tab only ────────────────────────────────────── */}
        {activeTab === 0 && (
          <>
            <div style={{
              maxWidth: '780px',
              marginBottom: '18px',
            }}>
              <p style={{
                fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.95rem',
                lineHeight: 1.75, margin: '0 0 10px',
              }}>
                {language === 'tr'
                  ? 'Kur\'an\'ın 114 suresi rastgele dizilmiş değil. Her sure önceki ve sonraki sureyle tematik, dilsel veya yapısal bağ taşır — bu, klasik âlimlerin 1.000 yıldır işlediği ilmü\'l-münâsebât\'tır.'
                  : 'The 114 surahs are not arranged at random. Each surah carries thematic, linguistic or structural ties to its neighbours — the discipline of ʿilm al-munāsabāt, studied for over 1,000 years.'}
              </p>
              <p style={{
                fontFamily: FONTS.body, color: COLORS.gold, fontSize: '0.88rem',
                fontStyle: 'italic', lineHeight: 1.7, margin: 0,
              }}>
                {language === 'tr'
                  ? '"Kur\'an\'ın güzelliklerinin çoğu münâsebâtın dakikliklerine dayanır." — Fahreddîn er-Râzî'
                  : '"Most of the Qurʾān\'s beauties rest on the subtleties of munāsabāt." — Fakhr al-Dīn al-Rāzī'}
              </p>
            </div>

            {/* Filters */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '6px',
              }}>
                {language === 'tr' ? 'Tür:' : 'Type:'}
              </span>
              <button
                onClick={() => setTypeFilter(null)}
                style={filterChipStyle(!typeFilter, COLORS.gold)}
              >
                {language === 'tr' ? 'Tümü' : 'All'}
              </button>
              {data.types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id === typeFilter ? null : t.id)}
                  style={filterChipStyle(typeFilter === t.id, t.color)}
                >
                  {language === 'tr' ? t.nameTr : t.nameEn}
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '6px',
              }}>
                {language === 'tr' ? 'Güç:' : 'Strength:'}
              </span>
              <button
                onClick={() => setStrengthFilter(null)}
                style={filterChipStyle(!strengthFilter, COLORS.gold)}
              >
                {language === 'tr' ? 'Tümü' : 'All'}
              </button>
              {Object.keys(STRENGTH_LABEL).map((key) => (
                <button
                  key={key}
                  onClick={() => setStrengthFilter(key === strengthFilter ? null : key)}
                  style={filterChipStyle(strengthFilter === key, STRENGTH_COLOR[key])}
                >
                  {language === 'tr' ? STRENGTH_LABEL[key].tr : STRENGTH_LABEL[key].en}
                </button>
              ))}
            </div>

            {/* Connection list */}
            {filteredConnections.length === 0 ? (
              <div style={{
                padding: '40px 20px', textAlign: 'center', color: COLORS.silver,
                fontFamily: FONTS.body,
              }}>
                {language === 'tr' ? 'Bu filtreyle bağlantı yok.' : 'No connections match this filter.'}
              </div>
            ) : (
              filteredConnections.map((c) => (
                <ConnectionCard
                  key={c.id}
                  conn={c}
                  typesById={typesById}
                  scholarsById={scholarsById}
                  language={language}
                  isMobile={isMobile}
                />
              ))
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            <p style={{
              fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.95rem',
              lineHeight: 1.75, maxWidth: '780px', margin: '0 0 20px',
            }}>
              {language === 'tr'
                ? 'Klasik âlimlerin belirlediği başlıca 7 münâsebât türü. Her bağlantı, bu türlerden birini veya birkaçını birden taşır.'
                : 'The seven classical categories of munāsabāt. Each connection carries one or several of these types at once.'}
            </p>
            <TypeList types={data.types} language={language} isMobile={isMobile} />
          </>
        )}

        {activeTab === 2 && (
          <>
            <p style={{
              fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.95rem',
              lineHeight: 1.75, maxWidth: '780px', margin: '0 0 20px',
            }}>
              {language === 'tr'
                ? 'Kur\'an\'da huruf-u mukatta\'a ile başlayan 29 sure ve kıssa yoğun bölgeler, peş peşe gruplar oluşturur. Bu gruplar içinde sureler arasında sistematik tematik süreklilik vardır.'
                : 'The 29 surahs opening with disconnected letters, and story-dense regions, form consecutive clusters. Within each cluster, the surahs share systematic thematic continuity.'}
            </p>
            <GroupList groups={data.groups || []} language={language} isMobile={isMobile} />
          </>
        )}

        {activeTab === 3 && (
          <>
            <p style={{
              fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.95rem',
              lineHeight: 1.75, maxWidth: '780px', margin: '0 0 20px',
            }}>
              {language === 'tr'
                ? 'İlmü\'l-münâsebât\'ı klasik dönemden bugüne taşıyan âlimler ve temel eserleri.'
                : 'The scholars who carried the discipline of munāsabāt from the classical period to today, and their foundational works.'}
            </p>
            <ScholarList scholars={data.scholars} language={language} isMobile={isMobile} />
          </>
        )}
      </div>
    </div>
  );
}

function filterChipStyle(active, color) {
  return {
    padding: '5px 11px',
    borderRadius: '12px',
    background: active ? `${color}22` : 'transparent',
    border: `1px solid ${active ? color : COLORS.glassBorder}`,
    color: active ? color : COLORS.silver,
    fontFamily: FONTS.body,
    fontSize: '0.75rem',
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  };
}
