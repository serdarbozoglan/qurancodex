'use client';

// ─── RetorikSorular — Belağat Aileleri Tool (2026-07-06 refactor) ───
// Kaynak 1: sections/QuranRhetoric — mevcut istifhâm section
// Kaynak 2: belagat-aileleri.json — yeni: iltifât, tibâk, istiʿâre, kinâye, cinâs
// Denetim raporu: docs/reviews/2026-07-06-kesfet-audit.md (Dalga 1.3)

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import { COLORS, FONTS, BREAKPOINT_TABLET, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import QuranRhetoric from '../sections/QuranRhetoric';
import useFocusTrap from '../hooks/useFocusTrap';
import useNavbarOffset from './useNavbarOffset';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import ailelerDataStatic from '../../public/belagat-aileleri.json';

const FAMILY_ICONS = {
  'istifham': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 8 Q8 5 11 5 Q14 5 14 8 Q14 10 11 11 L11 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="11" cy="17" r="1" fill={color} />
    </svg>
  ),
  'iltifat': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 11 Q7 4 11 11 Q15 18 18 11" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M17 8 L18 11 L15 12" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="11" r="1.2" fill={color} opacity="0.7" />
    </svg>
  ),
  'tibak': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 3 V19" stroke={color} strokeWidth="1.4" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="6" cy="11" r="3" stroke={color} strokeWidth="1.4" fill={`${color}22`} />
      <circle cx="16" cy="11" r="3" stroke={color} strokeWidth="1.4" fill={`${color}22`} />
      <path d="M6 8 L6 14 M16 8 L16 14" stroke={color} strokeWidth="1.2" opacity="0.75" />
    </svg>
  ),
  'istiare': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 6 L10 6 L11 4 L12 6 L18 6 L14 12 L18 18 L12 16 L11 18 L10 16 L4 18 L8 12 Z" stroke={color} strokeWidth="1.3" fill={`${color}18`} strokeLinejoin="round" />
    </svg>
  ),
  'kinaye': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 11 Q4 6 11 6 Q18 6 18 11" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" strokeDasharray="2 2" />
      <circle cx="7" cy="14" r="1.5" fill={color} opacity="0.75" />
      <circle cx="11" cy="14" r="1.5" fill={color} opacity="0.75" />
      <circle cx="15" cy="14" r="1.5" fill={color} opacity="0.75" />
    </svg>
  ),
  'cinas': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 8 Q7 6 11 8 T18 8" stroke={color} strokeWidth="1.4" fill="none" opacity="0.85" />
      <path d="M4 14 Q7 12 11 14 T18 14" stroke={color} strokeWidth="1.4" fill="none" opacity="0.65" />
      <circle cx="6" cy="8" r="0.9" fill={color} />
      <circle cx="13" cy="8" r="0.9" fill={color} />
      <circle cx="9" cy="14" r="0.9" fill={color} opacity="0.75" />
      <circle cx="16" cy="14" r="0.9" fill={color} opacity="0.75" />
    </svg>
  ),
};

function FamilyIcon({ id, color, size = 24 }) {
  const IconFn = FAMILY_ICONS[id];
  if (!IconFn) return null;
  return <span style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IconFn(color)}</span>;
}

export default function RetorikSorular({ onClose }) {
  const { language } = useLanguage();
  const navTop = useNavbarOffset(0, 62);
  const tr = language === 'tr';
  const trapRef = useFocusTrap(true);
  const [aileler] = useState(ailelerDataStatic);
  const [activeFamilyId, setActiveFamilyId] = useState('istifham');
  const [expandedIdx, setExpandedIdx] = useState(null);
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
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    setExpandedIdx(null);
  }, [activeFamilyId]);

  const TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 8 Q9.5 5 12 5 Q14.5 5 14.5 8 Q14.5 10 12 11 L12 13"/><circle cx="12" cy="17" r="1" fill={COLORS.gold}/></svg>}
      titleTr="Kur'an'ın Belağatı"
      titleEn="Belāġa of the Qur'an"
      subtitleTr="6 belâgat ailesi · İstifhâm · İltifât · Tibâk · İstiʿâre · Kinâye · Cinâs"
      subtitleEn="6 rhetorical families · Istifhām · Iltifāt · Ṭibāq · Istiʿāra · Kināya · Jinās"
      language={language}
    />
  );

  if (!aileler) {
    return (
      <div ref={trapRef} style={{ background: COLORS.cosmicBlack, minHeight: `calc(100vh - ${navTop}px)`, display: 'flex', flexDirection: 'column', paddingTop: `${navTop}px` }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Yükleniyor…' : 'Loading…'}</span>
        </div>
      </div>
    );
  }

  const activeAile = activeFamilyId === 'istifham' ? null : aileler.aileler.find(a => a.id === activeFamilyId);
  const FAMILY_TABS = [
    { id: 'istifham', color: '#c9a227', titleTr: 'İstifhâm', titleEn: 'Istifhām' },
    ...aileler.aileler.map(a => ({ id: a.id, color: a.color, titleTr: a.titleTr.split(' —')[0], titleEn: a.titleEn.split(' —')[0] })),
  ];

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
    }}>
      {TOOL_HEADER}
      <div ref={bodyRef} style={{ flex: 1 }}>
        <div className="mq-box" style={{
          '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "40px", '--pl-m': "20px",
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <svg aria-hidden="true" width="100%" height="100%" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 0.05, mixBlendMode: 'screen',
          }}>
            <defs>
              <pattern id="belagat-geometric" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 6 L54 18 L54 42 L36 54 L18 42 L18 18 Z" stroke={COLORS.gold} strokeWidth="0.5" fill="none" />
                <path d="M36 18 L48 24 L48 36 L36 42 L24 36 L24 24 Z" stroke={COLORS.gold} strokeWidth="0.4" fill="none" opacity="0.6" />
                <circle cx="36" cy="30" r="2" fill={COLORS.gold} opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#belagat-geometric)" />
          </svg>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '90%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${COLORS.gold}0F 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="mq-box mq-fs" dir="rtl" lang="ar" aria-label="Bismillāh" style={{
              fontFamily: FONTS.bismillah,
              '--fs-d': '1.95rem', '--fs-m': '1.5rem',
              color: COLORS.gold, opacity: 0.82, lineHeight: 1,
              '--mb-d': '40px', '--mb-m': '28px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}>﷽</div>
            <p dir="rtl" lang="ar" className="mq-fs" style={{
              fontFamily: FONTS.quran,
              '--fs-d': 'clamp(1.25rem, 2.3vw, 1.7rem)', '--fs-m': 'clamp(1.05rem, 4.2vw, 1.4rem)',
              color: COLORS.gold, lineHeight: 2.1,
              margin: '0 auto 16px', maxWidth: '820px',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}>{cleanArabic('اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا')}</p>
            <p className="mq-fs" style={{
              color: COLORS.offWhite, fontFamily: FONTS.display, fontStyle: 'italic',
              '--fs-d': 'clamp(0.95rem, 1.6vw, 1.05rem)', '--fs-m': '0.94rem',
              lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '660px', opacity: 0.95,
            }}>&quot;{tr ? 'Kur\'ân\'ı tefekkür etmiyorlar mı? Yoksa kalplerin üzerinde kilitler mi var?' : 'Then do they not reflect upon the Qur\'an, or are there locks upon their hearts?'}&quot;</p>
            <p style={{
              color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 36px', opacity: 0.78,
            }}>— {tr ? 'Muhammed 47:24' : 'Muḥammad 47:24'}</p>
            <p className="mq-fs" style={{
              color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic',
              '--fs-d': 'clamp(0.95rem, 1.55vw, 1.02rem)', '--fs-m': '0.92rem',
              lineHeight: 1.7, margin: '0 auto 40px', maxWidth: '700px', opacity: 0.88,
            }}>{tr
              ? <>Kur&apos;ân&apos;ın <em style={{ fontStyle: 'normal', color: COLORS.gold }}>retoriği</em> tek bir sanat değil — istifhâm, iltifât, tibâk, istiʿâre, kinâye ve cinâs — <em style={{ fontStyle: 'normal', color: COLORS.gold }}>altı sanat ailesinin</em> ortak dansı.</>
              : <>The Qur&apos;an&apos;s <em style={{ fontStyle: 'normal', color: COLORS.gold }}>rhetoric</em> is not one art — istifhām, iltifāt, ṭibāq, istiʿāra, kināya, and jinās — the shared dance of <em style={{ fontStyle: 'normal', color: COLORS.gold }}>six art families</em>.</>}</p>
            <div aria-hidden="true" style={{
              width: '120px', height: '1px',
              background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
              margin: '0 auto 32px',
            }} />
            <div style={{
              fontSize: '0.68rem', letterSpacing: '0.3em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, fontWeight: 700, opacity: 0.75,
              marginBottom: '14px',
            }}>{tr ? "BELÂGAT · CÜRCÂNÎ'DEN NEUWIRTH'E" : "BALĀGHA · FROM AL-JURJĀNĪ TO NEUWIRTH"}</div>
            <h2 className="mq-fs" style={{
              color: COLORS.offWhite,
              '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
              fontWeight: 700, fontFamily: FONTS.display,
              margin: '0 auto 14px', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: '760px',
            }}>{tr ? "Kur'an'ın Belağatı" : "Belāġa of the Qur'an"}</h2>
            <p className="mq-fs" style={{
              fontFamily: FONTS.display,
              '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': '1rem',
              color: COLORS.gold, margin: '0 auto 28px',
              lineHeight: 1.55, fontStyle: 'italic', maxWidth: '700px', opacity: 0.92,
            }}>{tr ? '6 belâgat ailesi · 27+ âyet örneği · klasik + modern okuma' : '6 rhetorical families · 27+ verse examples · classical + modern reading'}</p>
          </div>
        </div>

        {/* FAMILY SELECTOR */}
        <div className="mq-box" id="belagat-tab-bar" style={{
          display: 'flex', gap: '4px',
          '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "16px", '--pl-m': "8px",
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          position: 'sticky', top: `${navTop + 48}px`, zIndex: 20,
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {FAMILY_TABS.map(f => {
            const isActive = f.id === activeFamilyId;
            return (
              <button className="mq-box" key={f.id} onClick={() => {
                setActiveFamilyId(f.id);
                setTimeout(() => document.getElementById('belagat-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
                className="mq-fs" style={{
                  '--pt-d': "10px", '--pt-m': "8px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "10px", '--pb-m': "8px", '--pl-d': "18px", '--pl-m': "14px",
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? f.color : COLORS.glassBorder}`,
                  background: isActive ? `${f.color}22` : 'transparent',
                  color: isActive ? f.color : COLORS.silver,
                  '--fs-d': '0.82rem', '--fs-m': '0.75rem',
                  fontWeight: isActive ? 700 : 500, fontFamily: FONTS.body,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  transition: 'all 0.18s',
                  boxShadow: isActive ? `0 0 14px ${f.color}22` : 'none',
                  flexShrink: 0,
                }}>
                <FamilyIcon id={f.id} color={isActive ? f.color : COLORS.silver} size={16} />
                <span>{tr ? f.titleTr : f.titleEn}</span>
              </button>
            );
          })}
        </div>

        <div className="mq-box" style={{ '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "48px", '--pl-d': "40px", '--pl-m': "16px" }}>
          {activeFamilyId === 'istifham' && (
            <div>
              <p className="mq-fs" style={{
                color: COLORS.silver, '--fs-d': '0.92rem', '--fs-m': '0.88rem',
                fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
              }}>
                {tr
                  ? 'İstifhâm — Kur\'ân\'ın en yaygın belâgat sanatı. 1200+ soru ayeti, 4 alt-kategori (İnkârî, İrşâdî, Tevbîhî, Taʿaccübî). Bu bölüm mevcut istifhâm analizini gösterir; diğer 5 belâgat ailesi üstteki chip\'lerden seçilebilir.'
                  : 'Istifhām — the Qur\'an\'s most widespread rhetorical art. 1200+ question verses, 4 subcategories (Inkārī, Irshādī, Tawbīkhī, Taʿajjubī). This section shows the existing istifhām analysis; the other 5 belāgha families can be selected from the chips above.'}
              </p>
              <QuranRhetoric />
            </div>
          )}

          {activeAile && (
            <FamilyView aile={activeAile}
              expandedIdx={expandedIdx} onToggle={i => setExpandedIdx(expandedIdx === i ? null : i)}
              language={language} isMobile={isMobile} />
          )}

          <div style={{
            marginTop: '40px', padding: '20px 24px',
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              fontSize: '0.66rem', letterSpacing: '0.2em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
            }}>{tr ? 'Klasik & Modern Kaynaklar' : 'Classical & Modern Sources'}</div>
            <div className="g-1-2" style={{ display: 'grid',  gap: '10px' }}>
              {aileler.kaynaklar.map((k, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${COLORS.glassBorderSoft}`,
                  borderLeft: `2px solid ${COLORS.gold}66`,
                  borderRadius: RADIUS.sm,
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body }}>{k.author}</div>
                  <div style={{ fontSize: '0.76rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: '2px 0' }}>{tr ? k.workTr : k.workEn} · {k.century}</div>
                  <div style={{ fontSize: '0.74rem', color: COLORS.offWhite, fontFamily: FONTS.body, lineHeight: 1.55, opacity: 0.85 }}>{k.note}</div>
                </div>
              ))}
            </div>
          </div>

          <CrossToolCTA
            language={language} isMobile={isMobile}
            links={[
              { href: `/${language}/arac/ilk-son-kelimeler`, titleTr: 'İlk ve Son Kelimeler', titleEn: 'First and Last Words', descTr: 'Belağatın pratik uygulaması: 114 sûrenin açılış-kapanış sanatları.', descEn: 'Belāgha in practice: opening-closing arts of 114 suras.' },
              { href: `/${language}/arac/ses-mimarisi`, titleTr: 'Ses Mimarisi', titleEn: 'Sound Architecture', descTr: 'Belağatın müzikal katmanı: seslerin anlamla dansı.', descEn: 'The musical layer of belāgha: sounds dance with meaning.' },
              { href: `/${language}/arac/ritim`, titleTr: 'İmkansız Ritim', titleEn: 'Impossible Rhythm', descTr: 'Belağatın vezin katmanı: ne şiir ne düzyazı.', descEn: 'The metrical layer of belāgha: neither poetry nor prose.' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function FamilyView({ aile, expandedIdx, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <div className="mq-box" style={{
        '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "30px", '--pr-m': "18px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "30px", '--pl-m': "18px",
        background: `linear-gradient(135deg, ${aile.color}0E 0%, rgba(255,255,255,0.02) 60%)`,
        border: `1px solid ${aile.color}35`, borderLeft: `3px solid ${aile.color}`,
        borderRadius: RADIUS.md, marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '160px', height: '160px', pointerEvents: 'none',
          background: `radial-gradient(circle at center, ${aile.color}22 0%, transparent 65%)`,
          filter: 'blur(2px)',
        }} />
        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <div style={{
            flexShrink: 0,
            width: '56px', height: '56px', borderRadius: '50%',
            background: `radial-gradient(circle at center, ${aile.color}25 0%, ${aile.color}08 70%, transparent 100%)`,
            border: `1px solid ${aile.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${aile.color}22`,
          }}>
            <FamilyIcon id={aile.id} color={aile.color} size={32} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="mq-fs" style={{
              margin: 0, fontFamily: FONTS.display,
              '--fs-d': '1.6rem', '--fs-m': '1.35rem',
              fontWeight: 700, color: aile.color, lineHeight: 1.25,
            }}>{tr ? aile.titleTr : aile.titleEn}</h2>
            <p dir="rtl" lang="ar" style={{
              margin: '4px 0 12px', fontFamily: FONTS.quran,
              fontSize: '1.35rem', color: COLORS.gold, lineHeight: 1.5,
              textAlign: 'right',
            }}>{aile.arabicName}</p>
            <p style={{
              margin: 0, fontSize: '0.92rem', color: COLORS.offWhite,
              fontFamily: FONTS.body, lineHeight: 1.75,
            }}>{tr ? aile.definitionTr : aile.definitionEn}</p>
          </div>
        </div>
      </div>

      <div className="g-1-2" style={{
        display: 'grid',
        gap: '14px', marginBottom: '24px',
      }}>
        <div style={{
          padding: '16px 20px', background: 'rgba(212,165,116,0.06)',
          border: `1px solid ${COLORS.gold}30`, borderLeft: `2px solid ${COLORS.gold}`,
          borderRadius: RADIUS.sm,
        }}>
          <div style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
            color: COLORS.gold, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '8px',
          }}>{tr ? 'Klasik Belâgat' : 'Classical Balāgha'}</div>
          <p style={{
            margin: 0, fontSize: '0.86rem', color: COLORS.offWhite,
            fontFamily: FONTS.body, lineHeight: 1.7,
          }}>{tr ? aile.classicalTr : aile.classicalEn}</p>
        </div>
        <div style={{
          padding: '16px 20px', background: 'rgba(52,152,219,0.06)',
          border: `1px solid rgba(52,152,219,0.22)`, borderLeft: `2px solid ${COLORS.skyBlue}`,
          borderRadius: RADIUS.sm,
        }}>
          <div style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
            color: COLORS.skyBlue, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '8px',
          }}>{tr ? 'Modern Akademik' : 'Modern Academic'}</div>
          <p style={{
            margin: 0, fontSize: '0.86rem', color: COLORS.offWhite,
            fontFamily: FONTS.body, lineHeight: 1.7,
          }}>{tr ? aile.modernTr : aile.modernEn}</p>
        </div>
      </div>

      <div style={{
        fontSize: '0.66rem', letterSpacing: '0.2em',
        color: aile.color, textTransform: 'uppercase',
        fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
      }}>{tr ? `${aile.ornekler.length} Âyet Örneği` : `${aile.ornekler.length} Verse Examples`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {aile.ornekler.map((o, i) => (
          <OrnekCard key={i} ornek={o} index={i + 1} color={aile.color}
            isOpen={expandedIdx === i} onToggle={() => onToggle(i)}
            language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function OrnekCard({ ornek, index, color, isOpen, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      padding: '18px 20px',
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${color}30`, borderLeft: `2px solid ${color}`,
      borderRadius: RADIUS.sm,
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: '50%',
          background: `${color}25`, border: `1px solid ${color}55`,
          color, fontSize: '0.75rem', fontWeight: 800, fontFamily: FONTS.body,
        }}>{index}</span>
        <span style={{
          fontSize: '0.8rem', fontWeight: 700, color,
          fontFamily: FONTS.body, letterSpacing: '0.04em',
        }}>{ornek.verseRef}</span>
      </div>
      <div style={{
        padding: '12px 14px', background: 'rgba(212,165,116,0.05)',
        border: `1px solid ${COLORS.gold}25`,
        borderLeft: `2px solid ${COLORS.gold}`,
        borderRadius: RADIUS.sm,
      }}>
        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran,
          '--fs-d': '1.3rem', '--fs-m': '1.1rem',
          color: COLORS.gold, lineHeight: 1.9, margin: '0 0 8px', textAlign: 'right',
        }}>{cleanArabic(ornek.verseAr)}</p>
        <p style={{
          fontSize: '0.82rem', color: COLORS.offWhite, fontFamily: FONTS.body,
          lineHeight: 1.65, margin: 0, fontStyle: 'italic',
        }}>&quot;{tr ? ornek.verseTr : ornek.verseEn}&quot;</p>
      </div>
      <button onClick={onToggle}
        style={{
          alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', borderRadius: '999px',
          background: `${color}18`, border: `1px solid ${color}40`,
          color, cursor: 'pointer',
          fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 600,
        }}>
        {isOpen ? (tr ? 'Analizi kapat' : 'Close analysis') : (tr ? 'Belâgat Analizi' : 'Rhetorical Analysis')}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {isOpen && (
        <div style={{
          padding: '14px 18px', background: 'rgba(52,152,219,0.05)',
          border: `1px solid rgba(52,152,219,0.22)`, borderLeft: `2px solid ${COLORS.skyBlue}`,
          borderRadius: RADIUS.sm,
        }}>
          <p style={{
            margin: 0, fontSize: '0.85rem', color: COLORS.offWhite,
            fontFamily: FONTS.body, lineHeight: 1.75,
          }}>{tr ? ornek.analysisTr : ornek.analysisEn}</p>
        </div>
      )}
    </div>
  );
}
