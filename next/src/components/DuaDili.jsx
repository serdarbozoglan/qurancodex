'use client';

// ─── DuaDili — Full Tab-Based Tool (Dalga 2.1 · 2026-07-06) ───────────────
// 4 tab: Peygamber Duaları · Dua Anatomisi · Cevap Kalıpları · Kaynaklar
// Tab 1: existing sections/QuranDua render + 4 new prophets (Âdem, Nûh, Süleyman, Muhammed ﷺ)
// Tab 2: 4-layer grammar breakdown (Nidâ · Hâcet · Gerekçe · İsim)
// Tab 3: 10-satır cevap kalıpları grid
// Tab 4: SourcesCitation (Suyûtî, İbn Kayyim, Nevevî, Gazâlî, Râzî, Kurtubî)

import { useEffect, useState } from 'react';
import QuranDua from '../sections/QuranDua';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import data from '../../public/dua-dili.json';

const TABS = [
  { id: 'prophets', labelTr: 'Peygamber Duaları', labelEn: 'Prophetic Prayers',
    icon: <path d="M12 2a5 5 0 0 0-5 5v4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z"/> },
  { id: 'anatomy', labelTr: 'Dua Anatomisi', labelEn: 'Prayer Anatomy',
    icon: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></> },
  { id: 'response', labelTr: 'Cevap Kalıpları', labelEn: 'Response Patterns',
    icon: <><path d="M3 12h18M13 6l6 6-6 6M5 6l6 6-6 6"/></> },
  { id: 'sources', labelTr: 'Kaynaklar', labelEn: 'Sources',
    icon: <><path d="M4 4h12a4 4 0 0 1 4 4v12M4 4v14a2 2 0 0 0 2 2h14M4 4l16 16"/></> },
];

// Islamic geometric pattern (subtle)
const GEOMETRIC_PATTERN = `<svg aria-hidden="true" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'>
<g fill='none' stroke='%23d4a574' stroke-width='0.4' opacity='0.5'>
<circle cx='30' cy='30' r='14'/><circle cx='30' cy='30' r='7'/>
<polygon points='30,10 40,25 50,30 40,35 30,50 20,35 10,30 20,25' opacity='0.4'/>
</g></svg>`;

export default function DuaDili({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('prophets');

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
      position: 'relative',
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8M8 6l4-4 4 4M12 22V12M16 18l-4 4-4-4"/></svg>}
        titleTr="Dua Dili — Yakarışın Gramatik Kalıbı"
        titleEn="Language of Prayer — The Grammar of Supplication"
        subtitleTr="10 peygamber · Fâtiha · Bakara 2:186 · Rabbenâ zinciri"
        subtitleEn="10 prophets · al-Fātiḥa · al-Baqara 2:186 · Rabbanā chain"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div className="mq-box" style={{
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
        background: `linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%),
                     url("data:image/svg+xml;utf8,${GEOMETRIC_PATTERN}") repeat`,
        backgroundSize: 'auto, 60px 60px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: FONTS.bismillah,
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: COLORS.gold,
          lineHeight: 2.1,
          margin: '0 0 12px',
          textShadow: `0 0 22px ${COLORS.gold}1f`,
        }}>
          وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ
        </p>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.offWhite, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65, maxWidth: '660px', margin: '0 auto 6px',
        }}>
          "{tr ? "Kullarım Beni sorarsa — Ben yakınım. Bana dua edenin duasına icabet ederim." : "When My servants ask about Me — I am near; I respond to the call of the caller."}"
        </p>
        <p style={{
          color: COLORS.silver, fontFamily: FONTS.body,
          fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          opacity: 0.78, marginBottom: '24px',
        }}>— {tr ? "Bakara 2:186" : "al-Baqara 2:186"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "YAKARIŞIN GRAMERİ · 4 KATMAN" : "GRAMMAR OF SUPPLICATION · 4 LAYERS"}
        </p>
        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 12px',
        }}>
          {tr ? "Dua Dili — Yakarışın Gramatik Kalıbı" : "Language of Prayer — The Grammar of Supplication"}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "10 peygamber profili · Nidâ + Hâcet + Gerekçe + İsim · Cevap örüntüsü" : "10 prophetic profiles · Vocative + Petition + Reasoning + Names · Response pattern"}
        </p>
      </div>

      {/* Sticky Tab Bar */}
      <div className="mq-box" id="dua-dili-tab-bar" style={{
        display: 'flex', gap: '2px',
        '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        position: 'sticky', top: '110px', zIndex: 20,
        scrollMarginTop: '120px',
        overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button className="mq-box"
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setTimeout(() => {
                  document.getElementById('dua-dili-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              style={{
                '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "24px", '--pr-m': "14px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "24px", '--pl-m': "14px",
                fontSize: isMobile ? '0.7rem' : '0.76rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: active ? 700 : 500,
                color: active ? COLORS.gold : COLORS.silver,
                border: 'none',
                borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                background: active ? COLORS.goldAlpha15 : 'transparent',
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'color 0.15s, background 0.15s',
                fontFamily: FONTS.body,
              }}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{tab.icon}</svg>
              <span>{tr ? tab.labelTr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "0", '--pr-m': "0", '--pb-d': "0", '--pb-m': "0", '--pl-d': "0", '--pl-m': "0" }}>
        {activeTab === 'prophets' && <ProphetsTab tr={tr} isMobile={isMobile} />}
        {activeTab === 'anatomy' && <AnatomyTab tr={tr} isMobile={isMobile} />}
        {activeTab === 'response' && <ResponseTab tr={tr} isMobile={isMobile} />}
        {activeTab === 'sources' && <SourcesTab language={language} isMobile={isMobile} />}
      </div>
    </div>
  );
}

// ─── Tab 1: Prophets ────────────────────────────────────────────────
function ProphetsTab({ tr, isMobile }) {
  return (
    <div>
      {/* Existing QuranDua section renders 6 prophets + Rabbenâ + linguistic */}
      <QuranDua />

      {/* 4 New Prophets */}
      <div className="mq-box" style={{
        '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "48px", '--pl-d': "32px", '--pl-m': "16px",
        maxWidth: '1180px', margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '8px' }}>
          <p style={{
            fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75,
            fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px',
          }}>
            {tr ? "4 EK PROFİL · TAMAMLANMIŞ ZİNCİR" : "4 ADDITIONAL PROFILES · COMPLETED CHAIN"}
          </p>
          <h2 style={{
            fontFamily: FONTS.display, fontSize: isMobile ? '1.5rem' : '1.9rem',
            color: COLORS.offWhite, margin: '0 0 8px',
          }}>
            {tr ? "Zincirin Diğer Halkaları" : "The Other Links of the Chain"}
          </h2>
          <p style={{
            color: COLORS.silver, fontSize: '0.9rem', maxWidth: '640px',
            margin: '0 auto', lineHeight: 1.65,
          }}>
            {tr
              ? "İbrahim, Eyyûb, Yûsuf, Mûsâ, Yûnus ve Zekeriyyâ'nın duaları yukarıdaki panelde. Aşağıda insanlık tarihini çerçeveleyen 4 profil daha: ilk (Âdem), en uzun (Nûh), en zengin (Süleymân) ve son (Muhammed ﷺ)."
              : "The prayers of Abraham, Job, Joseph, Moses, Jonah, and Zechariah are in the panel above. Below are four more profiles that frame human history: the first (Adam), the longest (Noah), the wealthiest (Solomon), and the last (Muhammad ﷺ)."}
          </p>
        </div>

        <div className="g-1-2" style={{
          display: 'grid',
          gap: '18px',
        }}>
          {data.additionalProphets.map(p => (
            <ProphetCard key={p.id} p={p} tr={tr} isMobile={isMobile} />
          ))}
        </div>
      </div>

      {/* Cross-Tool CTA */}
      <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px", maxWidth: '1180px', margin: '0 auto' }}>
        <CrossToolCTA
          language={tr ? 'tr' : 'en'}
          isMobile={isMobile}
          links={[
            { href: `/${tr ? 'tr' : 'en'}/arac/dualar`, titleTr: 'Dua Kataloğu', titleEn: 'Prayer Catalogue', descTr: "77 tematik dua · 11 kategori · ses playback.", descEn: '77 thematic prayers · 11 categories · audio playback.' },
            { href: `/${tr ? 'tr' : 'en'}/atlas/insan-psikolojisi`, titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: "Dua psikolojisi — havf, recâ, tevbe, itmi'nân.", descEn: 'Psychology of prayer — hope, fear, repentance, tranquility.' },
            { href: `/${tr ? 'tr' : 'en'}/atlas/kissa`, titleTr: 'Kıssa Atlası', titleEn: 'Story Atlas', descTr: "Peygamber duaları kıssa bağlamında.", descEn: 'Prophetic prayers within their story context.' },
          ]}
        />
      </div>
    </div>
  );
}

function ProphetCard({ p, tr, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mq-box" style={{
      background: `linear-gradient(180deg, ${p.colorHex}12 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${p.colorHex}55`,
      borderRadius: RADIUS.lg,
      '--pt-d': "24px", '--pt-m': "20px", '--pr-d': "24px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "20px", '--pl-d': "24px", '--pl-m': "18px",
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
        background: `radial-gradient(circle, ${p.colorHex}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '10px', position: 'relative' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: FONTS.display, fontSize: '1.35rem',
            color: p.colorHex, margin: '0 0 4px',
          }}>
            {tr ? p.nameTr : p.nameEn}
          </h3>
          <p style={{
            fontFamily: FONTS.body, fontSize: '0.72rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: COLORS.silver, margin: 0, opacity: 0.85,
          }}>
            {tr ? p.profileTr : p.profileEn}
          </p>
        </div>
        <span style={{
          padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700,
          background: `${p.colorHex}22`, color: p.colorHex,
          borderRadius: RADIUS.chip, whiteSpace: 'nowrap',
        }}>
          {tr ? p.countTr : p.countEn}
        </span>
      </div>

      {/* Themes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', position: 'relative' }}>
        {(tr ? p.themesTr : p.themesEn).map((t, i) => (
          <span key={i} style={{
            padding: '4px 10px', fontSize: '0.7rem',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${p.colorHex}33`,
            borderRadius: RADIUS.chip, color: COLORS.silver,
          }}>{t}</span>
        ))}
      </div>

      {/* Verse block */}
      <div style={{
        padding: '16px 18px', marginBottom: '14px',
        background: 'rgba(0,0,0,0.28)',
        border: `1px solid ${p.colorHex}33`,
        borderRadius: RADIUS.md, textAlign: 'right', position: 'relative',
      }}>
        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran, fontSize: '1.35rem',
          color: p.colorHex, lineHeight: 2, margin: '0 0 10px',
          textShadow: `0 0 12px ${p.colorHex}22`,
        }}>{p.arabic}</p>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          fontSize: '0.88rem', color: COLORS.offWhite,
          lineHeight: 1.6, margin: '0 0 6px', textAlign: 'left',
        }}>"{tr ? p.translationTr : p.translationEn}"</p>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: COLORS.silver, opacity: 0.78,
          margin: 0, textAlign: 'left',
        }}>— {tr ? p.refTr : p.refEn}</p>
      </div>

      {/* Insight (expandable) */}
      <button onClick={() => setExpanded(!expanded)} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'none', border: 'none', color: p.colorHex,
        cursor: 'pointer', padding: 0, fontSize: '0.78rem',
        fontWeight: 700, letterSpacing: '0.06em', marginBottom: expanded ? '12px' : 0,
        position: 'relative', fontFamily: FONTS.body,
      }}>
        <span>{tr ? (expanded ? 'DAHA AZ GÖSTER' : 'DAHA FAZLA GÖSTER') : (expanded ? 'SHOW LESS' : 'READ MORE')}</span>
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {expanded && (
        <div style={{ position: 'relative' }}>
          <p style={{
            fontFamily: FONTS.body, fontSize: '0.86rem',
            color: COLORS.offWhite, lineHeight: 1.7, margin: '0 0 12px',
          }}>{tr ? p.insightTr : p.insightEn}</p>
          <div style={{
            padding: '10px 14px',
            background: `${p.colorHex}0e`,
            borderLeft: `2px solid ${p.colorHex}`,
            borderRadius: '4px',
          }}>
            <p style={{
              fontFamily: FONTS.body, fontSize: '0.82rem',
              color: COLORS.silver, lineHeight: 1.65, margin: 0,
            }}>{tr ? p.responseTr : p.responseEn}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Anatomy ────────────────────────────────────────────────
function AnatomyTab({ tr, isMobile }) {
  const { layers, examples, introTr, introEn } = data.duaAnatomy;
  const [activeExample, setActiveExample] = useState(0);
  const example = examples[activeExample];

  return (
    <div className="mq-box" style={{
      '--pt-d': "48px", '--pt-m': "28px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "32px", '--pl-m': "16px",
      maxWidth: '1180px', margin: '0 auto',
    }}>
      {/* Intro */}
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "GRAMATİK KALIP · 4 KATMAN" : "GRAMMAR TEMPLATE · 4 LAYERS"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>{tr ? introTr : introEn}</p>
      </div>

      {/* Layer Legend */}
      <div className="g-1-4" style={{
        display: 'grid',
        gap: '12px', marginBottom: '32px',
      }}>
        {layers.map(l => (
          <div key={l.id} style={{
            padding: '14px 16px',
            background: `${l.color}12`,
            border: `1px solid ${l.color}55`,
            borderLeft: `3px solid ${l.color}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: l.color, marginBottom: '6px',
              fontFamily: FONTS.body,
            }}>{tr ? l.labelTr : l.labelEn}</div>
            <div style={{
              fontSize: '0.8rem', color: COLORS.silver,
              lineHeight: 1.55, fontFamily: FONTS.body,
            }}>{tr ? l.descTr : l.descEn}</div>
          </div>
        ))}
      </div>

      {/* Example Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        {examples.map((ex, i) => (
          <button key={ex.id}
            onClick={() => setActiveExample(i)}
            style={{
              padding: '10px 16px',
              background: activeExample === i ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeExample === i ? COLORS.gold : COLORS.glassBorderSoft}`,
              color: activeExample === i ? COLORS.gold : COLORS.silver,
              fontSize: '0.78rem', fontWeight: 600, fontFamily: FONTS.body,
              borderRadius: RADIUS.chip, cursor: 'pointer',
            }}
          >
            {tr ? ex.titleTr : ex.titleEn}
          </button>
        ))}
      </div>

      {/* Example Card */}
      <div className="mq-box" style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: RADIUS.lg,
        '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
      }}>
        {/* Full Arabic */}
        <div style={{
          padding: '20px 16px', marginBottom: '24px',
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${COLORS.gold}22`,
          borderRadius: RADIUS.md, textAlign: 'right',
        }}>
          <p dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.35rem' : '1.7rem',
            color: COLORS.gold, lineHeight: 2.1, margin: 0,
          }}>{example.fullArabic}</p>
        </div>

        {/* Breakdown */}
        <div style={{
          fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: COLORS.silver, marginBottom: '12px',
          fontFamily: FONTS.body, fontWeight: 700, opacity: 0.78,
        }}>
          {tr ? "KATMAN AYRIŞTIRMASI" : "LAYER BREAKDOWN"}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {example.breakdown.map((b, i) => {
            const layer = layers.find(l => l.id === b.layerId);
            return (
              <div key={i} className="dd-breakdown-grid" style={{
                display: 'grid',
                gap: '14px', alignItems: 'center',
                padding: '12px 14px',
                background: `${layer.color}0c`,
                borderLeft: `3px solid ${layer.color}`,
                borderRadius: '4px',
              }}>
                {!isMobile && (
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: layer.color,
                    fontFamily: FONTS.body,
                  }}>{tr ? layer.labelTr : layer.labelEn}</div>
                )}
                <div dir="rtl" lang="ar" style={{
                  fontFamily: FONTS.quran, fontSize: '1.15rem',
                  color: layer.color, lineHeight: 1.8,
                }}>{b.textAr}</div>
                <div style={{
                  fontSize: '0.85rem', color: COLORS.offWhite,
                  lineHeight: 1.55, fontStyle: 'italic',
                }}>
                  {isMobile && (
                    <div style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: layer.color, marginBottom: '4px',
                      fontStyle: 'normal',
                    }}>{tr ? layer.labelTr : layer.labelEn}</div>
                  )}
                  {tr ? b.labelTr : b.labelEn}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div style={{
          padding: '14px 16px',
          background: 'rgba(212,165,116,0.06)',
          borderLeft: `2px solid ${COLORS.gold}`,
          borderRadius: '4px',
        }}>
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: COLORS.gold, marginBottom: '6px',
            fontFamily: FONTS.body, fontWeight: 700,
          }}>{tr ? "NOT" : "NOTE"}</div>
          <p style={{
            fontSize: '0.86rem', color: COLORS.offWhite,
            lineHeight: 1.7, margin: 0, fontFamily: FONTS.body,
          }}>{tr ? example.notesTr : example.notesEn}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Response Patterns ────────────────────────────────────
function ResponseTab({ tr, isMobile }) {
  const { rows, introTr, introEn } = data.responsePatterns;
  return (
    <div className="mq-box" style={{
      '--pt-d': "48px", '--pt-m': "28px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "32px", '--pl-m': "16px",
      maxWidth: '1180px', margin: '0 auto',
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "İSTEK → CEVAP → SÜRE · 10 PEYGAMBER" : "PETITION → RESPONSE → TIME · 10 PROPHETS"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>{tr ? introTr : introEn}</p>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.map((r, i) => (
          <div key={i} className="dd-anatomy-grid mq-box" style={{
            display: 'grid',
            gap: '14px', alignItems: 'stretch',
            '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "14px",
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderLeft: `3px solid ${COLORS.gold}`,
            borderRadius: RADIUS.md,
          }}>
            {/* Prophet */}
            <div>
              <div style={{
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: COLORS.gold, opacity: 0.75, marginBottom: '4px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "PEYGAMBER" : "PROPHET"}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '1.05rem',
                color: COLORS.offWhite, fontWeight: 600, marginBottom: '4px',
              }}>{tr ? r.prophetTr : r.prophetEn}</div>
              <div style={{
                fontSize: '0.68rem', color: COLORS.silver, opacity: 0.78,
                fontFamily: FONTS.body,
              }}>{tr ? r.verseTr : r.verseEn}</div>
            </div>

            {/* Request */}
            <div>
              <div style={{
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#3498db', opacity: 0.85, marginBottom: '4px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "TALEP" : "REQUEST"}</div>
              <div style={{
                fontSize: '0.85rem', color: COLORS.offWhite,
                lineHeight: 1.6, fontFamily: FONTS.body, fontStyle: 'italic',
              }}>"{tr ? r.requestTr : r.requestEn}"</div>
            </div>

            {/* Response */}
            <div>
              <div style={{
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#2ecc71', opacity: 0.85, marginBottom: '4px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "CEVAP" : "RESPONSE"}</div>
              <div style={{
                fontSize: '0.85rem', color: COLORS.offWhite,
                lineHeight: 1.6, fontFamily: FONTS.body,
              }}>{tr ? r.responseTr : r.responseEn}</div>
            </div>

            {/* Time */}
            <div>
              <div style={{
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#a78bfa', opacity: 0.85, marginBottom: '4px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "SÜRE / EK" : "TIME / EXTRA"}</div>
              <div style={{
                fontSize: '0.82rem', color: COLORS.silver,
                lineHeight: 1.55, fontFamily: FONTS.body,
              }}>{tr ? r.timeTr : r.timeEn}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 4: Sources ────────────────────────────────────────────────
function SourcesTab({ language, isMobile }) {
  return (
    <div className="mq-box" style={{
      '--pt-d': "48px", '--pt-m': "28px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "32px", '--pl-m': "16px",
      maxWidth: '1180px', margin: '0 auto',
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto 24px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {language === 'tr' ? "DUA LİTERATÜRÜ · KLASİK KAYNAKLAR" : "PRAYER LITERATURE · CLASSICAL SOURCES"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>
          {language === 'tr'
            ? "Kur'ân'ın dua dilinin gramatik kalıbı ve psikolojisi üzerine yazılmış klasik kaynaklar. Nevevî doğrudan dua/zikir derler, Suyûtî'nin genel hadis külliyatı da dua rivayetlerine kaynaklık eder; İbn Kayyim ve Gazâlî ise dua psikolojisi geleneğini kurar."
            : "Classical sources on the grammar and psychology of the Qur'anic language of prayer. Nawawī compiles prayers and remembrances directly, while Suyūṭī's general hadith compilation also preserves prayer narrations; Ibn al-Qayyim and Ghazālī establish the tradition of prayer psychology."}
        </p>
      </div>
      <SourcesCitation language={language} isMobile={isMobile} sources={data.sources} />
    </div>
  );
}
