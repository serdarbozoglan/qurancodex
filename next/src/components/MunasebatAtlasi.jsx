'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS, CATEGORY_SCALE, CATEGORY,
} from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import HeroGeometricBackground from './HeroGeometricBackground';
import useNavbarOffset from './useNavbarOffset';
import { SURAH_NAMES_TR } from '../lib/surahNames';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import munasebatDataStatic from '../../public/surah-connections.json';

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
  return name.replace(/^(El-|En-|Et-|Eş-|Es-|Ez-|Er-|Ed-|Al-)/, '');
}

// "1:6" → "Fâtiha 1:6" — ayet referansları çıplak numarayla gösteriliyordu,
// site-wide kurala aykırı (bkz. Sûre DNA / Neden-Sonuç'ta aynı düzeltme).
function formatVerseRef(ref, lang) {
  if (!ref) return ref;
  const surahNum = parseInt(ref.split(':')[0], 10);
  const name = surahLabel(surahNum, lang);
  return name ? `${name} ${ref}` : ref;
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
  { id: 'connections', tr: 'Sûreler Arası Bağlar', en: 'Between Surahs' },
  { id: 'types',       tr: 'Bağlantı Türleri', en: 'Connection Types' },
  { id: 'groups',      tr: 'Harf Grupları',  en: 'Letter Groups' },
  { id: 'intraSurah',  tr: 'Sûre İçi Tutarlılık', en: 'Within a Surah' },
  { id: 'scholars',    tr: 'Âlim Kitaplığı', en: 'Scholars' },
];

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ language }) {
  return (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7" /></svg>}
      titleTr="Münasebât Atlası"
      titleEn="Atlas of Surah Coherence"
      subtitleTr="Razi geleneği · sûreler arası bağ"
      subtitleEn="Razi tradition · inter-surah coherence"
      language={language}
    />
  );
}

// ── Cinematic Hero — CLAUDE.md §13.18 Premium Template ──────────────────────
function Hero({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div className="mq-box" style={{
      position: 'relative', overflow: 'hidden',
      '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      <HeroGeometricBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div aria-hidden="true" className="mq-fs" style={{
          fontFamily: FONTS.bismillah, '--fs-d': '2.3rem', '--fs-m': '1.9rem',
          color: COLORS.gold, opacity: 0.82, marginBottom: '22px', lineHeight: 1.2,
        }}>﷽</div>

        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran, color: COLORS.gold,
          '--fs-d': 'clamp(1.5rem, 2.6vw, 1.85rem)', '--fs-m': '1.3rem',
          lineHeight: 2.1, margin: '0 0 14px',
        }}>
          اللَّهُ نَزَّلَ أَحْسَنَ الْحَدِيثِ كِتَابًا مُتَشَابِهًا مَثَانِيَ
        </p>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '1.05rem', '--fs-m': '0.95rem', lineHeight: 1.6,
          maxWidth: '660px', margin: '0 auto 8px',
        }}>
          {tr
            ? '"Allah, sözün en güzelini; ayetleri birbiriyle uyumlu, tekrarlı bir Kitap olarak indirdi."'
            : '"Allah has sent down the best statement: a consistent Book wherein there is repetition."'}
        </p>
        <p style={{
          fontFamily: FONTS.body, color: COLORS.silver, opacity: 0.7,
          fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          margin: '0 0 24px',
        }}>— {tr ? 'Zümer 39:23' : 'Az-Zumar 39:23'}</p>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver,
          '--fs-d': '1rem', '--fs-m': '0.92rem', lineHeight: 1.75,
          maxWidth: '700px', margin: '0 auto 24px',
        }}>
          {tr
            ? <>Kur&apos;an&apos;ın 114 sûresi rastgele dizilmiş değildir. Her sûre, komşularına <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>köprülerle</em> bağlanır — ve her sûrenin kendi içinde, onu bir arada tutan görünmez <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>çıpalar</em> vardır.</>
            : <>The Quran&apos;s 114 surahs are not arranged at random. Each surah is joined to its neighbours by <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>bridges</em> — and within each surah, invisible <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>anchors</em> hold it together.</>}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          color: COLORS.gold, fontSize: '0.72rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', opacity: 0.72, fontWeight: 700, margin: '0 0 12px',
        }}>{tr ? 'İLMÜ\'L-MÜNÂSEBÂT · TUTARLILIĞIN MİMARİSİ' : "ʿILM AL-MUNĀSABĀT · THE ARCHITECTURE OF COHERENCE"}</p>
        <h1 className="mq-fs" style={{
          fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, margin: '0 0 10px',
        }}>{tr ? 'Münâsebât Atlası' : 'Atlas of Surah Coherence'}</h1>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>{tr ? 'Sûreler arası köprüler · bir sûrenin kendi çıpaları' : 'Bridges between surahs · a surah\'s own anchors'}</p>
      </div>
    </div>
  );
}

// ── Tab Bar ──────────────────────────────────────────────────────────────────
// top artık navTop (üstteki useNavbarOffset ölçümü) + 48 (ToolHeader'ın kendi
// yüksekliği) — önceden hardcode '110px' idi (navbar 62 varsayımı); bu sayfada
// gerçek navbar 82px ölçüldü, ToolHeader 82+48=130'da bitiyordu, tab bar 110'da
// başlayınca 20px örtüşme oluşuyordu (§13.31 Mekanizma 2, kullanıcı bildirdi).
function TabBar({ language, isMobile, activeTab, setActiveTab, navTop }) {
  return (
    <div className="mq-box" id="munasebat-tab-bar"
      style={{
        display: 'flex',
        gap: '4px',
        '--pt-d': "12px", '--pt-m': "10px", '--pr-d': "20px", '--pr-m': "12px", '--pb-d': "12px", '--pb-m': "10px", '--pl-d': "20px", '--pl-m': "12px",
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
        position: 'sticky',
        top: `${navTop + 48}px`,
        zIndex: 20,
        scrollMarginTop: '120px',
      }}
    >
      {TABS.map((t, i) => {
        const active = activeTab === i;
        return (
          <button
            key={t.id}
            onClick={() => { setActiveTab(i); setTimeout(() => { const _tb = document.getElementById('munasebat-tab-bar'); if (_tb) _tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '8px 14px',
              borderRadius: RADIUS.md,
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
    <div className="mq-box"
      style={{
        ...GLASS_CARD,
        '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "16px",
        marginBottom: '14px',
        borderLeft: `3px solid ${strengthColor}`,
      }}
    >
      {/* Header row — bridge motif: numbered badges + connecting line, centered as one compact cluster */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
        <span
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.7rem',
            color: strengthColor,
            background: `${strengthColor}18`,
            padding: '2px 8px',
            borderRadius: RADIUS.md,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <div className="mq-fs" style={{
          width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: '50%',
          border: `1.5px solid ${strengthColor}`, background: `${strengthColor}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontFamily: FONTS.display, fontWeight: 700, color: strengthColor, '--fs-d': '0.85rem', '--fs-m': '0.78rem',
        }}>{s1}</div>
        <span className="mq-fs" style={{
          fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem',
          fontWeight: 700, color: COLORS.offWhite, letterSpacing: '0.01em',
        }}>
          {surahLabel(s1, language)}
        </span>
        <div style={{ width: isMobile ? '28px' : '48px', height: '1px', flexShrink: 0, background: `linear-gradient(90deg, ${strengthColor}88, ${strengthColor}88)` }} />
        <div className="mq-fs" style={{
          width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: '50%',
          border: `1.5px solid ${strengthColor}`, background: `${strengthColor}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontFamily: FONTS.display, fontWeight: 700, color: strengthColor, '--fs-d': '0.85rem', '--fs-m': '0.78rem',
        }}>{s2}</div>
        <span className="mq-fs" style={{
          fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem',
          fontWeight: 700, color: COLORS.offWhite, letterSpacing: '0.01em',
        }}>
          {surahLabel(s2, language)}
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
            marginLeft: '10px', fontFamily: FONTS.arabic, color: COLORS.silver,
            fontSize: '1.05rem', fontWeight: 400,
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
            borderRadius: RADIUS.md,
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
                <span>— {formatVerseRef(a.ref, language)}</span>
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
                &quot;{language === 'tr' ? conn.hadith.textTr : conn.hadith.textEn}&quot;
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
                &quot;{language === 'tr' ? conn.quote.textTr : conn.quote.textEn}&quot;
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
    <div className="g-1-2" style={{ display: 'grid',  gap: '14px' }}>
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
                fontFamily: FONTS.arabic,
                fontSize: '1.05rem',
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
    <div className="g-1-2" style={{ display: 'grid', gap: '16px' }}>
      {groups.map((g, gi) => {
        const accent = CATEGORY_SCALE[gi % CATEGORY_SCALE.length];
        return (
          <div className="mq-box" key={g.id} style={{
            ...GLASS_CARD,
            '--pt-d': "20px", '--pt-m': "18px", '--pr-d': "22px", '--pr-m': "18px", '--pb-d': "20px", '--pb-m': "18px", '--pl-d': "22px", '--pl-m': "18px",
            borderTop: `2px solid ${accent}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              {g.lettersAr && (
                <div style={{
                  minWidth: '52px', height: '52px', borderRadius: RADIUS.xl, flexShrink: 0,
                  background: `${accent}14`, border: `1.5px solid ${accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 10px', whiteSpace: 'nowrap',
                }}>
                  <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: accent }}>
                    {g.lettersAr}
                  </span>
                </div>
              )}
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: '1.15rem', fontWeight: 700, color: COLORS.offWhite }}>
                  {language === 'tr' ? g.nameTr : g.nameEn}
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: accent, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {g.surahs.length} {language === 'tr' ? 'ardışık sûre' : 'consecutive surahs'}
                </div>
              </div>
            </div>

            {/* Sequence chain — connected pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              {g.surahs.map((n, i) => (
                <span key={n} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: FONTS.body, fontSize: '0.74rem', fontWeight: 600, color: COLORS.offWhite,
                    background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}44`,
                    borderRadius: RADIUS.chip, padding: '4px 9px', whiteSpace: 'nowrap',
                  }}>
                    <span style={{ color: accent, marginRight: '4px' }}>{n}</span>
                    {surahLabel(n, language)}
                  </span>
                  {i < g.surahs.length - 1 && (
                    <span style={{ color: accent, opacity: 0.6, fontSize: '0.7rem', margin: '0 2px' }}>—</span>
                  )}
                </span>
              ))}
            </div>

            <p style={{
              fontFamily: FONTS.body, fontSize: '0.86rem', color: COLORS.silver,
              lineHeight: 1.65, margin: 0,
            }}>
              {language === 'tr' ? g.descriptionTr : g.descriptionEn}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Section heading badge — numbered circle + title, used by IntraSurahTab ──
function SectionHeading({ num, isMobile, children }) {
  const accent = CATEGORY_SCALE[num - 1];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
        background: `${accent}18`, border: `1.5px solid ${accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONTS.display, fontWeight: 700, color: accent, fontSize: '0.85rem',
      }}>{num}</div>
      <h3 className="mq-fs" style={{
        fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
        '--fs-d': '1.35rem', '--fs-m': '1.15rem', margin: 0,
      }}>{children}</h3>
    </div>
  );
}

// ── Intra-Surah Coherence Tab — "Çıpa" (anchor) kavramı, Bakara halkası ─────
function IntraSurahTab({ data, language, isMobile }) {
  const tr = language === 'tr';
  if (!data) return null;

  const citationStyle = {
    marginTop: '16px', paddingTop: '12px', borderTop: `1px dashed ${COLORS.goldAlpha25}`,
    color: COLORS.silver, fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.85,
  };
  const accents = CATEGORY_SCALE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <p style={{
        fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.95rem',
        lineHeight: 1.75, maxWidth: '780px', margin: 0,
      }}>
        {tr ? data.introTr : data.introEn}
      </p>

      {/* Çıpa kavramı */}
      <div className="mq-box" style={{ ...GLASS_CARD, '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "20px", borderTop: `2px solid ${accents[0]}` }}>
        <SectionHeading num={1} isMobile={isMobile}>{tr ? data.anchorConcept.titleTr : data.anchorConcept.titleEn}</SectionHeading>
        <p style={{ fontFamily: FONTS.body, color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 16px' }}>
          {tr ? data.anchorConcept.bodyTr : data.anchorConcept.bodyEn}
        </p>
        <div style={{
          padding: '14px 18px', background: 'rgba(212,165,116,0.06)',
          borderLeft: `2px solid ${COLORS.gold}`, borderRadius: RADIUS.md,
        }}>
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold, fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            {tr ? data.anchorConcept.quoteTr : data.anchorConcept.quoteEn}
          </p>
        </div>
        <div style={citationStyle}>— {data.anchorConcept.citation}</div>
      </div>

      {/* Nâziât örneği */}
      <div className="mq-box" style={{ ...GLASS_CARD, '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "20px", borderTop: `2px solid ${accents[1]}` }}>
        <SectionHeading num={2} isMobile={isMobile}>{tr ? data.naziatExample.titleTr : data.naziatExample.titleEn}</SectionHeading>
        <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 16px' }}>
          {tr ? data.naziatExample.introTr : data.naziatExample.introEn}
        </p>
        <div className="g-1-2" style={{ display: 'grid', gap: '14px' }}>
          {data.naziatExample.anchors.map((a, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md, padding: '16px 18px',
            }}>
              <div dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.3rem',
                textAlign: 'right', marginBottom: '8px',
              }}>{a.rootAr}</div>
              <div style={{ fontFamily: FONTS.body, color: COLORS.offWhite, fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                {tr ? a.labelTr : a.labelEn}
              </div>
              <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                {tr ? a.noteTr : a.noteEn}
              </p>
            </div>
          ))}
        </div>
        <div style={citationStyle}>— {data.naziatExample.citation}</div>
      </div>

      {/* Bakara'nın tam halkası */}
      <div className="mq-box" style={{ ...GLASS_CARD, '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "20px", borderTop: `2px solid ${accents[2]}` }}>
        <SectionHeading num={3} isMobile={isMobile}>{tr ? data.bakaraRing.titleTr : data.bakaraRing.titleEn}</SectionHeading>
        <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
          {tr ? data.bakaraRing.introTr : data.bakaraRing.introEn}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.bakaraRing.sections.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: '12px',
              padding: s.center ? '14px 16px' : '10px 16px',
              background: s.center ? 'rgba(212,165,116,0.09)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${s.center ? COLORS.goldAlpha45 : COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <span style={{
                fontFamily: FONTS.display, fontWeight: 700, flexShrink: 0,
                color: s.center ? COLORS.gold : COLORS.silver,
                fontSize: s.center ? '1.15rem' : '0.95rem', minWidth: isMobile ? '26px' : '34px',
              }}>{s.label}</span>
              <span style={{ fontSize: '0.72rem', color: COLORS.goldAlpha45, fontFamily: FONTS.body, flexShrink: 0, minWidth: isMobile ? '52px' : '64px' }}>
                {s.range}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontFamily: FONTS.body, fontWeight: s.center ? 700 : 600,
                  color: s.center ? COLORS.gold : COLORS.offWhite, fontSize: '0.85rem',
                }}>{tr ? s.titleTr : s.titleEn}</span>
                {!isMobile && (
                  <span style={{ color: COLORS.silver, fontSize: '0.78rem', marginLeft: '8px' }}>
                    — {tr ? s.noteTr : s.noteEn}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '16px', padding: '14px 18px', background: 'rgba(212,165,116,0.06)',
          borderLeft: `2px solid ${COLORS.gold}`, borderRadius: RADIUS.md,
        }}>
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold, fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
            {tr ? data.bakaraRing.quoteTr : data.bakaraRing.quoteEn}
          </p>
        </div>
        <div style={citationStyle}>— {data.bakaraRing.citation}</div>
      </div>

      {/* Seçilme-Talimat-Sınama motifi */}
      <div className="mq-box" style={{ ...GLASS_CARD, '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "20px", borderTop: `2px solid ${accents[3]}` }}>
        <SectionHeading num={4} isMobile={isMobile}>{tr ? data.etiMotif.titleTr : data.etiMotif.titleEn}</SectionHeading>
        <p style={{ fontFamily: FONTS.body, color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 18px' }}>
          {tr ? data.etiMotif.bodyTr : data.etiMotif.bodyEn}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.etiMotif.sequence.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
              padding: '12px 16px',
              background: s.center ? 'rgba(212,165,116,0.09)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${s.center ? COLORS.goldAlpha45 : COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <span style={{
                fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem',
                color: s.center ? COLORS.gold : COLORS.silver,
                background: s.center ? `${COLORS.gold}18` : 'rgba(255,255,255,0.05)',
                padding: '3px 8px', borderRadius: RADIUS.sm, flexShrink: 0,
              }}>{s.code}</span>
              <span style={{
                fontFamily: FONTS.body, fontWeight: s.center ? 700 : 600, fontSize: '0.85rem',
                color: s.center ? COLORS.gold : COLORS.offWhite, flexShrink: 0,
              }}>{tr ? s.figureTr : s.figureEn}</span>
              <span style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.8rem' }}>
                {tr ? s.order : s.orderEn}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.65, margin: '16px 0 0', fontStyle: 'italic' }}>
          {tr ? data.etiMotif.noteTr : data.etiMotif.noteEn}
        </p>
        <div style={citationStyle}>— {data.etiMotif.citation}</div>
      </div>

      {/* Bakara Bölüm 1 çıpaları */}
      <div className="mq-box" style={{ ...GLASS_CARD, '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "20px", borderTop: `2px solid ${accents[4]}` }}>
        <SectionHeading num={5} isMobile={isMobile}>{tr ? data.section1Anchors.titleTr : data.section1Anchors.titleEn}</SectionHeading>
        <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
          {tr ? data.section1Anchors.introTr : data.section1Anchors.introEn}
        </p>
        <div className="g-2-4" style={{ display: 'grid', gap: '10px' }}>
          {data.section1Anchors.items.map((it, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md, padding: '12px 14px', textAlign: 'center',
            }}>
              <div dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.15rem', marginBottom: '6px' }}>
                {it.termAr}
              </div>
              <div style={{ fontFamily: FONTS.body, color: COLORS.offWhite, fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                {tr ? it.termTr : it.termEn}
              </div>
              <div style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.72rem', opacity: 0.85 }}>
                {tr ? `Bakara ${it.verses}` : `Al-Baqara ${it.verses}`}
              </div>
            </div>
          ))}
        </div>
        <div style={citationStyle}>— {data.section1Anchors.citation}</div>
      </div>
    </div>
  );
}

// ── Scholar List ─────────────────────────────────────────────────────────────
const ROLE_COLOR = {
  Kurucu: COLORS.silver, Founder: COLORS.silver,
  Müfessir: COLORS.gold, Exegete: COLORS.gold,
  Sistemleştirici: COLORS.softEmerald, Systematizer: COLORS.softEmerald,
  Teorisyen: COLORS.skyBlue, Theorist: COLORS.skyBlue,
  Modern: COLORS.orange,
  Çağdaş: CATEGORY.violet, Contemporary: CATEGORY.violet,
};

function ScholarList({ scholars, language, isMobile }) {
  return (
    <div className="g-1-2" style={{ display: 'grid',  gap: '14px' }}>
      {scholars.map((s) => {
        const roleLabel = (language === 'tr' ? s.roleTr : s.roleEn) || s.roleTr;
        const accent = ROLE_COLOR[s.roleEn] || ROLE_COLOR[roleLabel] || COLORS.gold;
        return (
          <div key={s.id} className="mq-box" style={{
            ...GLASS_CARD, '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px",
            borderLeft: `3px solid ${accent}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: FONTS.display, fontSize: '1.1rem', fontWeight: 700,
                color: COLORS.offWhite,
              }}>
                {s.nameTr}
              </span>
              <span style={{
                fontSize: '0.66rem', color: accent, background: `${accent}18`,
                border: `1px solid ${accent}45`, borderRadius: RADIUS.md,
                padding: '2px 7px', fontFamily: FONTS.body, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {roleLabel}
              </span>
            </div>
            <div style={{
              fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
              marginBottom: '8px', opacity: 0.85,
            }}>
              {s.deathH != null && `${language === 'tr' ? 'ö.' : 'd.'} ${s.deathH} H / ${s.deathM} M`}
              {s.deathH == null && s.deathM != null && `${language === 'tr' ? 'ö.' : 'd.'} ${s.deathM}`}
            </div>
            {s.workTr && (
              <div style={{
                fontSize: '0.82rem', color: COLORS.gold, fontStyle: 'italic',
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
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MunasebatAtlasi({ onClose }) {
  const { language } = useLanguage();
  const navTop = useNavbarOffset(0, 62);
  // SSR-safe: server render ve client'ın ilk (hydration) render'ı window'a
  // erişemez/erişmemelidir, ikisi de `false` ile eşleşmeli — gerçek değer
  // yalnızca mount sonrası effect içinde okunur (bkz. CLAUDE.md §16.6).
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [data] = useState(munasebatDataStatic);
  const [typeFilter, setTypeFilter] = useState(null);
  const [strengthFilter, setStrengthFilter] = useState(null);

  // Responsive
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ESC handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

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
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: `calc(100vh - ${navTop}px)`,
        display: 'flex', flexDirection: 'column',
        paddingTop: `${navTop}px`,
      }}>
        <Header language={language} />
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: COLORS.silver, fontFamily: FONTS.body,
        }}>
          {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
        </div>
      </div>
    );
  }

  const contentPadding = isMobile ? '16px' : '24px 32px';

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
    }}>
      <Header language={language} />
      <Hero language={language} isMobile={isMobile} />
      <TabBar language={language} isMobile={isMobile} activeTab={activeTab} setActiveTab={setActiveTab} navTop={navTop} />

      <div style={{
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
                  ? 'Kur\'an\'ın 114 sûresi rastgele dizilmiş değil. Her sûre önceki ve sonraki sûreyle tematik, dilsel veya yapısal bağ taşır — bu, klasik âlimlerin 1.000 yıldır işlediği ilmü\'l-münâsebât\'tır.'
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

            {/* Stat strip */}
            <div className="g-2-4" style={{ display: 'grid', gap: '10px', marginBottom: '22px' }}>
              {[
                { value: data.connections.length, labelTr: 'Bağlantı', labelEn: 'Connections', color: COLORS.gold },
                { value: data.connections.filter(c => c.strength === 'iconic').length, labelTr: 'İkonik', labelEn: 'Iconic', color: STRENGTH_COLOR.iconic },
                { value: data.connections.filter(c => c.strength === 'strong').length, labelTr: 'Güçlü', labelEn: 'Strong', color: STRENGTH_COLOR.strong },
                { value: data.connections.filter(c => c.strength === 'thematic').length, labelTr: 'Tematik', labelEn: 'Thematic', color: STRENGTH_COLOR.thematic },
              ].map((s, i) => (
                <div key={i} style={{
                  background: `${s.color}0d`, border: `1px solid ${s.color}30`,
                  borderRadius: RADIUS.md, padding: '12px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.5rem', color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: FONTS.body, fontSize: '0.68rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {language === 'tr' ? s.labelTr : s.labelEn}
                  </div>
                </div>
              ))}
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
                ? 'Kur\'an\'da huruf-u mukatta\'a ile başlayan 29 sûre ve kıssa yoğun bölgeler, peş peşe gruplar oluşturur. Bu gruplar içinde sûreler arasında sistematik tematik süreklilik vardır.'
                : 'The 29 surahs opening with disconnected letters, and story-dense regions, form consecutive clusters. Within each cluster, the surahs share systematic thematic continuity.'}
            </p>
            <GroupList groups={data.groups || []} language={language} isMobile={isMobile} />
          </>
        )}

        {activeTab === 3 && (
          <IntraSurahTab data={data.intraSurah} language={language} isMobile={isMobile} />
        )}

        {activeTab === 4 && (
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

        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/arac/halka-kompozisyon`, titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Sûre-içi ayna simetrisi — münâsebâtın mikro karşılığı.', descEn: 'Intra-surah mirror symmetry — the micro counterpart of munāsabāt.' },
            { href: `/${language}/arac/mukattaa`, titleTr: 'Huruf-i Mukattaâ', titleEn: 'Mukattaʿāt', descTr: '29 sûrede paylaşılan 14 harflik açılış imzası — münâsebâtın dilsel izleri.', descEn: '14 opening letters shared by 29 suras — linguistic traces of munāsabāt.' },
            { href: `/${language}/arac/ilk-son-kelimeler`, titleTr: 'İlk-Son Kelimeler', titleEn: 'First-Last Words', descTr: 'Sûrelerin açılış-kapanış mimarîsi — bağın kelime düzeyinde tezahürü.', descEn: 'The opening-closing architecture of suras — the connection at the word level.' },
          ]}
        />
      </div>
    </div>
  );
}

function filterChipStyle(active, color) {
  return {
    padding: '5px 11px',
    borderRadius: RADIUS.lg,
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
