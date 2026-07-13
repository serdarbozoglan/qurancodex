'use client';

// ─── BilimselIsaretler — Tam tool (2026-07-06 refactor: wrapper → real tool) ─
// Kaynak: bilimsel-isaretler.json (16 âyet, 5 alan).
// Denetim raporu: docs/reviews/2026-07-06-kesfet-audit.md (Dalga 1.2).
// Sorumlu Kur'ân-bilim okuma metodolojisi — Bucaillism nüansı vurgulu.

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import { COLORS, FONTS, BREAKPOINT_TABLET, RADIUS, VERSE_BLOCK, TEXT } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import useFocusTrap from '../hooks/useFocusTrap';

const DOMAIN_ICONS = {
  'astronomi': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" fill={color} opacity="0.85" />
      <ellipse cx="11" cy="11" rx="9" ry="3" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(-25 11 11)" />
      <ellipse cx="11" cy="11" rx="9" ry="3" stroke={color} strokeWidth="1.1" fill="none" transform="rotate(25 11 11)" opacity="0.6" />
      <circle cx="18" cy="4" r="0.9" fill={color} />
      <circle cx="3" cy="7" r="0.7" fill={color} opacity="0.6" />
    </svg>
  ),
  'yer': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <path d="M3 11 Q11 8 19 11 M3 11 Q11 14 19 11" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      <path d="M11 3 V19" stroke={color} strokeWidth="1.1" opacity="0.5" />
      <ellipse cx="6" cy="8" rx="1.5" ry="0.8" fill={color} opacity="0.5" />
      <ellipse cx="14" cy="14" rx="2" ry="1" fill={color} opacity="0.5" />
    </svg>
  ),
  'biyoloji': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 3 Q6 8 6 13 Q6 18 11 18 Q16 18 16 13 Q16 8 11 3" stroke={color} strokeWidth="1.4" fill={`${color}25`} />
      <path d="M11 6 V17 M8 10 Q11 12 14 10 M8 14 Q11 15.5 14 14" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  ),
  'insan': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="6" r="3" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <path d="M5 20 Q5 11 11 11 Q17 11 17 20" stroke={color} strokeWidth="1.4" fill={`${color}18`} strokeLinejoin="round" />
    </svg>
  ),
  'meteoroloji': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M5 12 Q3 12 3 9 Q3 6 6 6 Q7 3 11 3 Q15 3 15 6 Q19 6 19 10 Q19 13 16 13 L5 13 Z" stroke={color} strokeWidth="1.3" fill={`${color}22`} strokeLinejoin="round" />
      <path d="M7 15 L6 19 M11 15 L10 19 M15 15 L14 19" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),
};

function DomainIcon({ id, color, size = 24 }) {
  const IconFn = DOMAIN_ICONS[id];
  if (!IconFn) return null;
  return <span style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IconFn(color)}</span>;
}

const TABS = [
  { tr: 'İşaretler', en: 'Signs',
    icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 15 L7 18 L9 12 L4 8 L10 8 Z"/></svg>),
  },
  { tr: 'Keşif Timeline', en: 'Discovery Timeline',
    icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg>),
  },
  { tr: 'Bucaillism Nüansı', en: 'Bucaillism Nuance',
    icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>),
  },
];

export default function BilimselIsaretler({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const trapRef = useFocusTrap(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeDomainId, setActiveDomainId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  useEffect(() => {
    fetch('/bilimsel-isaretler.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [activeTab]);

  const TOOL_HEADER = (
    <ToolHeader
      icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2 A10 10 0 0 1 12 22 M2 12 A10 10 0 0 1 22 12"/></svg>}
      titleTr="Bilimsel İşaretler"
      titleEn="Scientific Signs"
      subtitleTr="16 âyet · 5 alan · astronomi · yer · biyoloji · insan · meteoroloji"
      subtitleEn="16 verses · 5 domains · astronomy · earth · biology · human · meteorology"
      language={language}
    />
  );

  if (!data) {
    return (
      <div ref={trapRef} style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', display: 'flex', flexDirection: 'column', paddingTop: '62px' }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Yükleniyor…' : 'Loading…'}</span>
        </div>
      </div>
    );
  }

  const { meta, intro, domains, isaretler } = data;
  const filtered = activeDomainId ? isaretler.filter(i => i.domainId === activeDomainId) : isaretler;

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      {TOOL_HEADER}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>
        {/* HERO */}
        <div style={{
          padding: isMobile ? '40px 20px 28px' : '56px 40px 36px',
          background: 'linear-gradient(180deg, rgba(139,92,246,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <svg aria-hidden="true" width="100%" height="100%" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 0.05, mixBlendMode: 'screen',
          }}>
            <defs>
              <pattern id="bilim-geometric" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <circle cx="36" cy="36" r="14" stroke={COLORS.gold} strokeWidth="0.5" fill="none" />
                <circle cx="36" cy="36" r="8" stroke={COLORS.gold} strokeWidth="0.4" fill="none" opacity="0.6" />
                <circle cx="36" cy="36" r="2" fill={COLORS.gold} opacity="0.5" />
                <path d="M36 6 L36 66 M6 36 L66 36" stroke={COLORS.gold} strokeWidth="0.3" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bilim-geometric)" />
          </svg>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '90%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, #8b5cf615 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{
              fontFamily: FONTS.bismillah,
              fontSize: isMobile ? '1.5rem' : '1.95rem',
              color: COLORS.gold, opacity: 0.82, lineHeight: 1,
              marginBottom: isMobile ? '28px' : '40px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}>﷽</div>
            <p dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.7rem)',
              color: COLORS.gold, lineHeight: 2.1,
              margin: '0 auto 16px', maxWidth: '820px',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}>{cleanArabic('وَالسَّمَٓاءَ بَنَيْنَاهَا بِاَيْدٍ وَاِنَّا لَمُوسِعُونَ')}</p>
            <p style={{
              color: COLORS.offWhite, fontFamily: FONTS.display, fontStyle: 'italic',
              fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
              lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '660px', opacity: 0.95,
            }}>"{tr ? 'Göğü kudretimizle biz kurduk ve şüphesiz biz onu genişleticiyiz.' : 'And the heaven We built with strength, and indeed, We are expanding it.'}"</p>
            <p style={{
              color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 36px', opacity: 0.65,
            }}>— {tr ? 'Zâriyât 51:47' : 'al-Dhāriyāt 51:47'}</p>
            <p style={{
              color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic',
              fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
              lineHeight: 1.7, margin: '0 auto 40px', maxWidth: '700px', opacity: 0.88,
            }}>{tr
              ? <>Kur'ân bir bilim kitabı değildir — ancak <em style={{ fontStyle: 'normal', color: COLORS.gold }}>kelime seçimi</em> ile modern bilim keşifleriyle <em style={{ fontStyle: 'normal', color: COLORS.gold }}>uyumlu</em> anlatım geliştirir.</>
              : <>The Qur'an is not a science book — but its <em style={{ fontStyle: 'normal', color: COLORS.gold }}>word choice</em> develops narrative that is <em style={{ fontStyle: 'normal', color: COLORS.gold }}>compatible</em> with modern scientific discoveries.</>}</p>
            <div aria-hidden="true" style={{
              width: '120px', height: '1px',
              background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
              margin: '0 auto 32px',
            }} />
            <div style={{
              fontSize: '0.68rem', letterSpacing: '0.3em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, fontWeight: 700, opacity: 0.72,
              marginBottom: '14px',
            }}>{tr ? 'ÂYÂT-I KEVNİYYE · TABİAT İŞARETLERİ' : 'ĀYĀT KAWNIYYA · SIGNS OF NATURE'}</div>
            <h1 style={{
              color: COLORS.offWhite,
              fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
              fontWeight: 700, fontFamily: FONTS.display,
              margin: '0 auto 14px', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: '760px',
            }}>{tr ? intro.titleTr : intro.titleEn}</h1>
            <p style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
              color: COLORS.gold, margin: '0 auto 28px',
              lineHeight: 1.55, fontStyle: 'italic', maxWidth: '700px', opacity: 0.92,
            }}>{tr ? intro.subtitleTr : intro.subtitleEn}</p>
            <p style={{
              color: COLORS.silver, fontSize: '0.9rem',
              fontFamily: FONTS.body, margin: '0 auto 28px',
              lineHeight: 1.75, maxWidth: '720px', opacity: 0.95, textAlign: 'left',
            }}>{tr ? intro.descTr : intro.descEn}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
              {[
                { value: meta.totalIsaretler, tr: 'işaret', en: 'signs', color: COLORS.gold },
                { value: meta.totalDomains, tr: 'alan', en: 'domains', color: COLORS.emerald },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: isMobile ? '8px 14px' : '10px 18px',
                  background: `${s.color}12`, border: `1px solid ${s.color}30`,
                  borderRadius: RADIUS.pill, display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ color: s.color, fontSize: '1rem', fontWeight: 800, fontFamily: FONTS.body, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, lineHeight: 1 }}>{tr ? s.tr : s.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div id="bilim-tab-bar" style={{
          display: 'flex', gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          position: 'sticky', top: '110px', zIndex: 20,
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {TABS.map((t, i) => {
            const isActive = activeTab === i;
            return (
              <button key={i} onClick={() => {
                setActiveTab(i);
                setTimeout(() => document.getElementById('bilim-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
                style={{
                  padding: isMobile ? '14px 14px' : '16px 22px',
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? COLORS.gold : COLORS.silver,
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{t.icon}</span>
                {tr ? t.tr : t.en}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: isMobile ? '20px 16px 48px' : '32px 40px 64px' }}>

          {activeTab === 0 && (
            <IsaretlerTab
              isaretler={filtered} domains={domains}
              activeDomainId={activeDomainId} onDomainToggle={id => setActiveDomainId(activeDomainId === id ? null : id)}
              expandedId={expandedId} onToggle={id => setExpandedId(expandedId === id ? null : id)}
              language={language} isMobile={isMobile}
            />
          )}
          {activeTab === 1 && (<TimelineTab isaretler={isaretler} domains={domains} language={language} isMobile={isMobile} />)}
          {activeTab === 2 && (<BucaillismTab intro={intro} language={language} isMobile={isMobile} />)}

          <SourcesCitation
            language={language} isMobile={isMobile}
            sources={[
              { author: 'er-Râzî',    workTr: "Mefâtîhu'l-Ğayb",              workEn: 'Mafātīḥ al-Ghayb',           period: '1149–1209 (Rey)',       noteTr: 'Kevnî ayetlerin klasik tefsirinde en zengin damar — felsefî-kelâmî çerçeve.', noteEn: 'The richest classical vein for cosmic verses — philosophical-kalāmic framework.' },
              { author: 'ez-Zamahşerî', workTr: "el-Keşşâf",                    workEn: 'al-Kashshāf',                period: '1075–1144 (Hârizm)',    noteTr: 'Belağî okuma — kevnî ayetlerin dilsel imalarının klasik referansı.',            noteEn: 'Rhetorical reading — the classical reference for the linguistic implications of cosmic verses.' },
              { author: 'İbn Kesîr',   workTr: "Tefsîru'l-Kur'âni'l-Azîm",     workEn: "Tafsīr al-Qur'ān al-ʿAẓīm",  period: '1301–1373 (Dımaşk)',    noteTr: 'Rivayet ağırlıklı tefsir — kevnî ayetlerin selef yorumu.',                        noteEn: 'Riwāya-heavy commentary — the salaf reading of cosmic verses.' },
              { author: 'el-Kurtubî',  workTr: "el-Câmiʿu li-Ahkâmi'l-Kur'ân", workEn: "al-Jāmiʿ li-Aḥkām al-Qur'ān", period: '1214–1273 (Kurtuba)', noteTr: 'Fıkhî + dilsel + kevnî — çok boyutlu klasik referans.',                          noteEn: 'Fiqh + linguistic + cosmic — a multi-dimensional classical reference.' },
            ]}
          />

          <CrossToolCTA
            language={language} isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/doga`, titleTr: 'Doğa Atlası', titleEn: 'Nature Atlas', descTr: '55 hayvan · bitki · gök cismi — Kur\'ân\'ın tabiat panelinin genişliği.', descEn: '55 animals · plants · celestial objects — the breadth of the Qur\'an\'s nature panel.' },
              { href: `/${language}/atlas/sunnetullah`, titleTr: 'Sünnetullah Atlası', titleEn: 'Sunnatullāh Atlas', descTr: 'İlâhî yasa — kâinatın işleyişinin metafizik çerçevesi.', descEn: 'Divine law — the metaphysical frame of the cosmos\'s workings.' },
              { href: `/${language}/atlas/tarihsel-kanit`, titleTr: 'Tarihsel Kanıtlar', titleEn: 'Historical Proofs', descTr: 'Kur\'ân\'ın arkeoloji + metin filolojisi ile örtüşen kanıtları.', descEn: 'Qur\'anic correspondences with archaeology and text philology.' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
function IsaretlerTab({ isaretler, domains, activeDomainId, onDomainToggle, expandedId, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 20px',
      }}>
        {tr
          ? 'Aşağıdaki 16 âyet 5 bilimsel alan altında sunulmuştur. Her âyet için klasik tefsir okuması + modern bilim keşfi + kritik nüans dengeli olarak verilmiştir.'
          : 'The 16 verses below are presented under 5 scientific domains. For each, the classical exegetical reading + modern discovery + critical nuance are balanced.'}
      </p>
      {/* Domain filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {domains.map(d => {
          const isActive = d.id === activeDomainId;
          return (
            <button key={d.id} onClick={() => onDomainToggle(d.id)}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px',
                borderRadius: RADIUS.pill,
                border: `1px solid ${isActive ? d.color : COLORS.glassBorder}`,
                background: isActive ? `${d.color}22` : 'transparent',
                color: isActive ? d.color : COLORS.silver,
                fontSize: isMobile ? '0.78rem' : '0.85rem',
                fontWeight: isActive ? 600 : 400, fontFamily: FONTS.body,
                cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}>
              <DomainIcon id={d.id} color={isActive ? d.color : COLORS.silver} size={16} />
              <span>{tr ? d.titleTr : d.titleEn}</span>
            </button>
          );
        })}
        {activeDomainId && (
          <button onClick={() => onDomainToggle(activeDomainId)}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px', borderRadius: RADIUS.pill,
              border: `1px solid ${COLORS.gold}40`, background: 'transparent',
              color: COLORS.gold, fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontFamily: FONTS.body, cursor: 'pointer',
            }}>× {tr ? 'Filtreyi kaldır' : 'Clear filter'}</button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {isaretler.map((k, i) => (
          <IsaretCard key={k.id} isaret={k} domain={domains.find(d => d.id === k.domainId)} index={i + 1}
            isOpen={expandedId === k.id} onToggle={() => onToggle(k.id)}
            language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function IsaretCard({ isaret, domain, index, isOpen, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  const dom = domain || { color: COLORS.gold };
  return (
    <div style={{
      padding: isMobile ? '20px 18px' : '26px 30px',
      background: `linear-gradient(135deg, ${dom.color}0A 0%, rgba(255,255,255,0.02) 45%)`,
      border: `1px solid ${dom.color}35`, borderLeft: `3px solid ${dom.color}`,
      borderRadius: RADIUS.md, display: 'flex', flexDirection: 'column', gap: '14px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '160px', height: '160px', pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${dom.color}22 0%, transparent 65%)`,
        filter: 'blur(2px)',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '16px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <div style={{
          flexShrink: 0,
          width: isMobile ? '46px' : '54px', height: isMobile ? '46px' : '54px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${dom.color}25 0%, ${dom.color}08 70%, transparent 100%)`,
          border: `1px solid ${dom.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px ${dom.color}22`,
        }}>
          <DomainIcon id={isaret.domainId} color={dom.color} size={isMobile ? 24 : 28} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
            color: dom.color, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.85,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '20px', height: '20px', borderRadius: '50%',
              background: `${dom.color}22`, border: `1px solid ${dom.color}55`,
              fontSize: '0.68rem', fontWeight: 800,
            }}>{index}</span>
            {tr ? domain.titleTr : domain.titleEn}
          </div>
          <h3 style={{
            margin: 0, fontFamily: FONTS.display,
            fontSize: isMobile ? '1.15rem' : '1.35rem',
            fontWeight: 700, color: COLORS.offWhite, lineHeight: 1.25,
          }}>{tr ? isaret.titleTr : isaret.titleEn}</h3>
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            marginTop: '8px', fontSize: '0.72rem',
            color: COLORS.silver, fontFamily: FONTS.body,
          }}>
            <span>📖 <strong style={{ color: dom.color, fontWeight: 600 }}>{isaret.verseRef}</strong></span>
            <span>🔬 {tr ? isaret.discoveryYear : isaret.discoveryYearEn}</span>
          </div>
        </div>
      </div>
      <div style={{ ...VERSE_BLOCK, padding: '14px 18px', position: 'relative', zIndex: 1 }}>
        <p dir="rtl" lang="ar" style={{
          ...TEXT.verseArabic,
          fontSize: isMobile ? '1.15rem' : '1.4rem',
          margin: '0 0 10px',
        }}>{cleanArabic(isaret.verseAr)}</p>
        <p style={{
          fontSize: '0.85rem', color: COLORS.offWhite, fontFamily: FONTS.body,
          lineHeight: 1.7, margin: 0, fontStyle: 'italic',
        }}>"{tr ? isaret.verseTr : isaret.verseEn}"</p>
      </div>
      <p style={{
        margin: 0, fontSize: '0.88rem', color: COLORS.offWhite,
        fontFamily: FONTS.body, lineHeight: 1.75, position: 'relative', zIndex: 1,
      }}>{tr ? isaret.summaryTr : isaret.summaryEn}</p>
      <button onClick={onToggle}
        style={{
          alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: RADIUS.pill,
          background: `${dom.color}18`, border: `1px solid ${dom.color}40`,
          color: dom.color, cursor: 'pointer',
          fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
          position: 'relative', zIndex: 1,
        }}>
        {isOpen ? (tr ? 'Nüans & Kaynakları kapat' : 'Close nuance & sources') : (tr ? 'Nüans & Kaynaklar' : 'Nuance & Sources')}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
          <div style={{
            padding: '14px 18px', background: 'rgba(212,165,116,0.05)',
            border: `1px solid ${COLORS.gold}25`, borderLeft: `2px solid ${COLORS.gold}88`,
            borderRadius: RADIUS.sm, display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <span style={{ color: COLORS.gold, fontSize: '0.95rem', flexShrink: 0 }}>✱</span>
            <div>
              <div style={{
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
                color: COLORS.gold, textTransform: 'uppercase',
                fontFamily: FONTS.body, marginBottom: '4px',
              }}>{tr ? 'Kritik Nüans' : 'Critical Nuance'}</div>
              <p style={{
                fontSize: '0.82rem', color: COLORS.offWhite,
                fontFamily: FONTS.body, lineHeight: 1.7, margin: 0, fontStyle: 'italic',
              }}>{tr ? isaret.criticalNoteTr : isaret.criticalNoteEn}</p>
            </div>
          </div>
          <div style={{
            padding: '12px 16px', background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.sm,
          }}>
            <div style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.85,
            }}>{tr ? 'Kaynaklar' : 'Sources'}</div>
            <p style={{
              fontSize: '0.78rem', color: COLORS.silver,
              fontFamily: FONTS.body, lineHeight: 1.65, margin: 0, fontStyle: 'italic',
            }}>{tr ? isaret.sourcesTr : isaret.sourcesEn}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
function TimelineTab({ isaretler, domains, language, isMobile }) {
  const tr = language === 'tr';
  // Extract year from discoveryYear (first 4-digit number)
  const items = isaretler.map(i => {
    const m = (i.discoveryYear || '').match(/(\d{4})/);
    const year = m ? parseInt(m[1]) : null;
    return { ...i, year };
  }).filter(i => i.year !== null).sort((a, b) => a.year - b.year);

  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr
          ? 'Kur\'ân âyetlerindeki fenomenlerin modern bilim tarafından ilk keşfedildiği yıllar. Her nokta, bilimsel bulgunun 7. yy Kur\'ân metnine geriye dönük bir "izafi paralellik" sağladığı anı gösterir.'
          : 'The years when modern science first discovered the phenomena referenced in Qur\'anic verses. Each point marks the moment scientific finding provided a retrospective "relative parallel" to the 7th-century Qur\'anic text.'}
      </p>
      <div style={{
        padding: isMobile ? '22px 14px' : '32px 28px',
        background: 'linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.01) 100%)',
        border: `1px solid #8b5cf640`, borderRadius: RADIUS.md,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '620px', overflowY: 'auto' }}>
          {items.map((it, i) => {
            const domain = domains.find(d => d.id === it.domainId);
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '64px 1fr' : '80px 1fr',
                gap: '14px', alignItems: 'flex-start',
                padding: '10px 12px', borderRadius: RADIUS.sm,
              }}>
                <div style={{
                  fontSize: '0.85rem', fontWeight: 800,
                  color: domain?.color || COLORS.gold, fontFamily: FONTS.body, textAlign: 'right',
                }}>{it.year}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      display: 'inline-block', width: '10px', height: '10px',
                      borderRadius: '50%', background: domain?.color || COLORS.gold,
                      boxShadow: `0 0 8px ${domain?.color || COLORS.gold}44`, flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: isMobile ? '0.85rem' : '0.92rem',
                      color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600,
                    }}>{tr ? it.titleTr : it.titleEn}</span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem', color: COLORS.silver,
                    fontFamily: FONTS.body, fontStyle: 'italic', marginLeft: '20px',
                  }}>{it.verseRef} · {tr ? it.discoveryYear : it.discoveryYearEn}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
function BucaillismTab({ intro, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{
        padding: '22px 26px',
        background: 'linear-gradient(135deg, rgba(231,76,60,0.06) 0%, rgba(255,255,255,0.02) 60%)',
        border: `1px solid ${COLORS.softRed}30`,
        borderLeft: `3px solid ${COLORS.softRed}`,
        borderRadius: RADIUS.md, marginBottom: '24px',
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.16em',
          color: COLORS.softRed, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px',
        }}>{tr ? 'Bucaillism Nedir?' : 'What Is Bucaillism?'}</div>
        <p style={{
          margin: 0, fontSize: '0.9rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.75,
        }}>{tr ? intro.bucaillismNoteTr : intro.bucaillismNoteEn}</p>
      </div>
      <div style={{
        padding: '18px 22px', background: 'rgba(52,152,219,0.06)',
        border: `1px solid rgba(52,152,219,0.22)`, borderLeft: `2px solid ${COLORS.skyBlue}`,
        borderRadius: RADIUS.sm, marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.14em',
          color: COLORS.skyBlue, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px', opacity: 0.9,
        }}>{tr ? 'Sorumlu Okuma İlkeleri' : 'Principles of Responsible Reading'}</div>
        <ul style={{
          margin: 0, paddingLeft: '20px',
          fontSize: '0.85rem', color: COLORS.silver,
          fontFamily: FONTS.body, lineHeight: 1.8,
        }}>
          {(tr ? [
            'Kur\'ân\'ın metaphorik-ahlâkî dili öncelikli, bilim referansı ikincildir.',
            'Klasik tefsir (Râzî, İbn Kesîr, Kurtubî) modern okumalardan önce okunmalı.',
            '"Kur\'ân önceden bildi" iddiası yerine "kelime seçimi uyumludur" ölçütü.',
            'Uyum-veren âyetler seçilirken, uyum vermeyenler görmezden gelinmemeli (cherry-picking eleştirisi).',
            'Bilim değişir, vahiy sabittir — bilimsel iddia bugün güçlü ise yarın çürütülebilir.'
          ] : [
            'The Qur\'an\'s metaphorical-ethical language is primary; scientific reference is secondary.',
            'Classical exegesis (Rāzī, Ibn Kathīr, Qurṭubī) should be read before modern readings.',
            'The criterion "word choice is compatible" replaces the claim "the Qur\'an foreknew."',
            'When compatible verses are chosen, incompatible ones should not be hidden (cherry-picking critique).',
            'Science changes; revelation is fixed — a strong scientific claim today may be refuted tomorrow.'
          ]).map((p, i) => <li key={i} style={{ marginBottom: '4px' }}>{p}</li>)}
        </ul>
      </div>
      <div style={{
        padding: '16px 20px', background: 'rgba(29,158,117,0.06)',
        border: `1px solid rgba(29,158,117,0.22)`,
        borderLeft: `2px solid ${COLORS.emerald}`, borderRadius: RADIUS.sm,
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.14em',
          color: COLORS.emerald, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px',
        }}>{tr ? 'Akademik Referanslar' : 'Academic References'}</div>
        <p style={{
          margin: 0, fontSize: '0.82rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.7,
        }}>
          {tr
            ? 'Nidhal Guessoum, Islam\'s Quantum Question (2011) — Bucaillism\'i eleştiren en detaylı Islamic Studies eseri. Karen Bauer, Gender Hierarchy in the Qur\'an (2015) — metod eleştirisi. Nicolai Sinai, The Qur\'an: A Historical-Critical Introduction (2017) — akademik konsensüs.'
            : 'Nidhal Guessoum, Islam\'s Quantum Question (2011) — the most detailed Islamic Studies work critiquing Bucaillism. Karen Bauer, Gender Hierarchy in the Qur\'an (2015) — methodological critique. Nicolai Sinai, The Qur\'an: A Historical-Critical Introduction (2017) — academic consensus.'}
        </p>
      </div>
    </div>
  );
}
