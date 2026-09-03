'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '@/hooks/useQuranNav';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS,
  FONTS,
  VERSE_DISPLAY_CARD,
  GLASS_CARD,
  BREAKPOINT_TABLET,
  RADIUS, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import useNavbarOffset from './useNavbarOffset';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import HeroGeometricBackground from './HeroGeometricBackground';
import useFocusTrap from '../hooks/useFocusTrap';
import extData from '../../public/nefis-mertebeleri-ext.json';
// 2026-08-14 (Z3f2) — ana veri de aynı şekilde statik import edildi; fetch
// SSR'da "Yükleniyor" iskeleti döndürüyordu.
import nefisDataStatic from '../../public/nefis-mertebeleri.json';


// ─── Small helpers ────────────────────────────────────────────────────────────
const sectionLabel = (color = COLORS.gold) => ({
  color,
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontFamily: FONTS.body,
});

const chipStyle = (color = COLORS.gold) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 10px',
  borderRadius: '999px',
  background: `${color}14`,
  border: `1px solid ${color}40`,
  color,
  fontSize: '0.72rem',
  fontWeight: 600,
  fontFamily: FONTS.body,
  whiteSpace: 'nowrap',
});

// ─── Main component ───────────────────────────────────────────────────────────
export default function NefisMertebeleri({ onClose }) {
  const { language } = useLanguage();
  const { openOverlay } = useQuranNav();
  const trapRef = useFocusTrap(true);
  const [data] = useState(nefisDataStatic);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const [activeTab, setActiveTab] = useState('journey');  // Dalga 2.2 tab state
  const bodyRef = useRef(null);
  // Navbar yüksekliği sabit değil — ölç (bkz. ToolHeader.jsx / useNavbarOffset.js,
  // CLAUDE.md §13.31 Mekanizma 2). Tab bar bu değeri +48 (ToolHeader yüksekliği)
  // ile kullanır, hardcode '110px' YASAK.
  const navTop = useNavbarOffset(0, 62);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const NEFIS_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="2" x2="6" y2="22" /><line x1="18" y1="2" x2="18" y2="22" /><line x1="6" y1="6" x2="18" y2="6" /><line x1="6" y1="10" x2="18" y2="10" /><line x1="6" y1="14" x2="18" y2="14" /><line x1="6" y1="18" x2="18" y2="18" /></svg>}
      titleTr="Nefs Mertebeleri"
      titleEn="Stations of the Soul"
      subtitleTr="7 mertebe · emmâre → kâmile"
      subtitleEn="7 stations · ammāra → kāmila"
      language={language}
    />
  );

  // Loading state
  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: `calc(100vh - ${navTop}px)`,
          display: 'flex', flexDirection: 'column',
          paddingTop: `${navTop}px`,
        }}
      >
        {NEFIS_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
      </div>
    );
  }

  const { intro, quranicCore, transitionNote, suficExtension, classicalFrameworks } = data;

  // Seven-dot ladder colors (legend)
  const ladderColors = [
    ...quranicCore.map(s => s.color),
    ...suficExtension.map(s => s.color),
  ];

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: `calc(100vh - ${navTop}px)`,
        display: 'flex', flexDirection: 'column',
        paddingTop: `${navTop}px`,
      }}
    >
      {NEFIS_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1 }}>

        {/* ─────────────────────────────── HERO ─────────────────────────────── */}
        <div className="mq-box" style={{
          '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "36px", '--pb-m': "32px", '--pl-d': "40px", '--pl-m': "20px",
          background: 'linear-gradient(180deg, rgba(139,0,0,0.05) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <HeroGeometricBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Bismillah ornament */}
          <div className="mq-box"
            dir="rtl" lang="ar" aria-label="Bismillāh"
            className="mq-fs" style={{
              fontFamily: FONTS.bismillah,
              '--fs-d': '1.95rem', '--fs-m': '1.5rem',
              color: COLORS.gold,
              opacity: 0.82,
              lineHeight: 1,
              '--mb-d': '40px', '--mb-m': '28px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}
          >
            ﷽
          </div>

          {/* Anchor verse — Fecr 89:27-28 (mutmainne — the highest station) */}
          <p
            dir="rtl" lang="ar"
            className="mq-fs" style={{
              fontFamily: FONTS.quran,
              '--fs-d': 'clamp(1.25rem, 2.3vw, 1.65rem)', '--fs-m': 'clamp(1.05rem, 4.2vw, 1.4rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 auto 16px',
              maxWidth: '820px',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}
          >
            يَٓا اَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِٓي اِلٰى رَبِّكِ رَاضِيَةً مَرْضِيَّةً
          </p>

          <p className="mq-fs" style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            '--fs-d': 'clamp(0.95rem, 1.6vw, 1.05rem)', '--fs-m': '0.94rem',
            lineHeight: 1.7,
            margin: '0 auto 8px',
            maxWidth: '660px',
            opacity: 0.95,
          }}>
            &quot;{language === 'tr'
              ? 'Ey huzura ermiş nefis! Razı olmuş ve razı olunmuş olarak Rabbine dön.'
              : 'O serene soul! Return to your Lord, well-pleased and pleasing.'}&quot;
          </p>

          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            opacity: 0.78,
          }}>
            — {language === 'tr' ? 'Fecr 89:27-28' : 'Al-Fajr 89:27-28'}
          </p>

          {/* Framing whisper */}
          <p className="mq-fs" style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            '--fs-d': 'clamp(0.95rem, 1.55vw, 1.02rem)', '--fs-m': '0.92rem',
            lineHeight: 1.7,
            margin: '0 auto 40px',
            maxWidth: '700px',
            opacity: 0.88,
          }}>
            {language === 'tr'
              ? <>Nefs <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>sabit</em> değildir. Emmâreden mutmainneye uzanan bir <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>basamak sistemi</em>dir — Kur&apos;an yedi tabakanın üçünü açıkça anar.</>
              : <>The self is not <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>fixed</em>. It is a <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>graded system</em> reaching from ammāra to muṭmaʾinna — the Quran names three of the seven stations explicitly.</>}
          </p>

          {/* Filigree divider */}
          <div aria-hidden="true" style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
            margin: '0 auto 32px',
          }} />

          {/* Eyebrow */}
          <div style={{ ...sectionLabel(), marginBottom: '12px' }}>
            {language === 'tr' ? 'REFLECTION · İÇ YOLCULUK · 7 BASAMAK' : 'REFLECTION · INNER JOURNEY · 7 STATIONS'}
          </div>

          {/* Playfair italic quote */}
          <h2 className="mq-fs" style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontWeight: 700,
            color: COLORS.offWhite,
            '--fs-d': 'clamp(2rem, 3.4vw, 2.55rem)', '--fs-m': 'clamp(1.55rem, 6.5vw, 1.9rem)',
            lineHeight: 1.22,
            margin: '0 auto 12px',
            maxWidth: '780px',
            letterSpacing: '-0.01em',
          }}>
            {language === 'tr'
              ? '"İnsan nefsi sabit bir şey değildir."'
              : '"The human self is not static."'}
          </h2>

          {/* Subtitle */}
          <p className="mq-fs" style={{
            color: COLORS.gold,
            '--fs-d': '1rem', '--fs-m': '0.9rem',
            fontFamily: FONTS.body,
            fontWeight: 600,
            margin: '0 0 20px 0',
            letterSpacing: '0.02em',
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Intro desc */}
          <p className="mq-fs" style={{
            color: COLORS.silver,
            '--fs-d': '1rem', '--fs-m': '0.92rem',
            fontFamily: FONTS.body,
            lineHeight: 1.75,
            margin: '0 0 28px 0',
            maxWidth: '720px',
          }}>
            {language === 'tr' ? intro.descTr : intro.descEn}
          </p>

          {/* Stat row */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: COLORS.glassBg,
            border: `1px solid ${COLORS.glassBorder}`,
            marginBottom: '28px',
          }}>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>3</span>
            <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? "Kur'ânî" : "Qur'anic"}
            </span>
            <span style={{ color: SEMANTIC.textFaint }}>+</span>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>4</span>
            <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'tasavvufî' : 'Sufi'}
            </span>
            <span style={{ color: SEMANTIC.textFaint }}>=</span>
            <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>7</span>
            <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'basamak' : 'steps'}
            </span>
          </div>

          {/* Visual legend — 7-dot vertical ladder */}
          <div className="fd-row" style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '14px' : '24px',
            marginTop: '6px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
            }}>
              {ladderColors.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: i < 3 ? '16px' : '14px',
                    height: i < 3 ? '16px' : '14px',
                    borderRadius: RADIUS.full,
                    background: c,
                    border: i < 3 ? `2px solid ${c}` : `1px dashed ${COLORS.silver}`,
                    boxShadow: `0 0 10px ${c}55`,
                    opacity: i < 3 ? 1 : 0.82,
                    flexShrink: 0,
                  }} />
                  {i < ladderColors.length - 1 && (
                    <div style={{
                      width: '18px',
                      height: '1px',
                      background: 'rgba(148,163,184,0.25)',
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              fontSize: '0.72rem',
              color: SEMANTIC.textFaint,
              fontFamily: FONTS.body,
            }}>
              <span>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: RADIUS.full, background: COLORS.gold, marginRight: '6px', verticalAlign: 'middle' }} />
                {language === 'tr' ? "Kur'ânî çekirdek (1-3)" : "Qur'anic core (1-3)"}
              </span>
              <span>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: RADIUS.full, background: 'transparent', border: `1px dashed ${COLORS.silver}`, marginRight: '6px', verticalAlign: 'middle' }} />
                {language === 'tr' ? 'Tasavvufî ek (4-7)' : 'Sufi addition (4-7)'}
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* ───────────────── STICKY TAB BAR (Dalga 2.2) ───────────────── */}
        <div className="mq-box" id="nefs-tab-bar" style={{
          display: 'flex', gap: '2px',
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          position: 'sticky', top: `${navTop + 48}px`, zIndex: 20,
          scrollMarginTop: '120px',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {[
            { id: 'journey', labelTr: '7 Mertebe · Yolculuk', labelEn: '7 Stages · Journey' },
            { id: 'matrix', labelTr: 'Karşılaştırma Matrisi', labelEn: 'Comparison Matrix' },
            { id: 'keyverses', labelTr: 'Anahtar Ayetler', labelEn: 'Key Verses' },
            { id: 'frameworks', labelTr: 'Ulema Çerçeveleri', labelEn: 'Scholar Frameworks' },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button className="mq-box" key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setTimeout(() => document.getElementById('nefs-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                className="mq-fs" style={{
                  '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "26px", '--pr-m': "14px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "26px", '--pl-m': "14px",
                  '--fs-d': '0.76rem', '--fs-m': '0.7rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontWeight: active ? 700 : 500,
                  color: active ? COLORS.gold : COLORS.silver,
                  border: 'none',
                  borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  background: active ? COLORS.goldAlpha15 : 'transparent',
                  cursor: 'pointer', flexShrink: 0,
                  fontFamily: FONTS.body, whiteSpace: 'nowrap',
                }}>
                {language === 'tr' ? tab.labelTr : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* ═════════════════ TAB 1: JOURNEY (7 stages) ═════════════════ */}
        {activeTab === 'journey' && <>

        {/* ───────────────── SECTION 1: QUR'ANIC CORE ───────────────── */}
        <SectionHeader
          label={language === 'tr' ? 'Bölüm 1' : 'Section 1'}
          title={language === 'tr' ? "Kur'ânî Çekirdek — 3 Mertebe" : "Qur'anic Core — 3 Stages"}
          subtitle={language === 'tr'
            ? "Kur'ân'da isim olarak geçen, klasik tefsirin üzerinde icmâ ettiği üç mertebe."
            : "The three stages named in the Qur'an, on which classical exegesis agrees."}
          isMobile={isMobile}
        />

        <div className="mq-box" style={{
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "40px", '--pl-m': "16px",
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '20px' : '28px',
        }}>
          {quranicCore.map((stage, idx) => (
            <StageCard
              key={stage.id}
              stage={stage}
              number={stage.order}
              isMobile={isMobile}
              language={language}
              variant="quranic"
              showDividerBelow={idx < quranicCore.length - 1}
            />
          ))}
        </div>

        {/* ───────────────── TRANSITION BAND (GATE) ───────────────── */}
        <TransitionBand
          note={transitionNote}
          isMobile={isMobile}
          language={language}
        />

        {/* ───────────────── SECTION 2: SUFI EXTENSION ───────────────── */}
        <SectionHeader
          label={language === 'tr' ? 'Bölüm 2' : 'Section 2'}
          title={language === 'tr' ? 'Tasavvufî Genişleme — 4 Ek Mertebe' : 'Sufi Extension — 4 Added Stages'}
          subtitle={language === 'tr'
            ? "Kur'ân'da isim olarak geçmeyen; tasavvuf ekolünün bâtınî okumayla eklediği dört mertebe."
            : "Four stages not named in the Qur'an; added by the Sufi tradition through esoteric reading."}
          isMobile={isMobile}
          faint
        />

        <div className="mq-box" style={{
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "40px", '--pl-m': "16px",
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '20px' : '28px',
        }}>
          {suficExtension.map((stage, idx) => (
            <StageCard
              key={stage.id}
              stage={stage}
              number={stage.orderInSufiSystem}
              isMobile={isMobile}
              language={language}
              variant="sufi"
              showDividerBelow={idx < suficExtension.length - 1}
            />
          ))}
        </div>

        </>}
        {/* ═════════════════ END TAB 1 ═════════════════ */}

        {/* ═════════════════ TAB 2: COMPARISON MATRIX ═════════════════ */}
        {activeTab === 'matrix' && (
          <ComparisonMatrixTab language={language} isMobile={isMobile} matrix={extData.comparisonMatrix} />
        )}

        {/* ═════════════════ TAB 3: KEY VERSES ═════════════════ */}
        {activeTab === 'keyverses' && (
          <KeyVersesTab language={language} isMobile={isMobile} keyVerses={extData.keyVerses} />
        )}

        {/* ═════════════════ TAB 4: SCHOLAR FRAMEWORKS ═════════════════ */}
        {activeTab === 'frameworks' && <>

        {/* ───────────────── SECTION 3: CLASSICAL FRAMEWORKS ───────────────── */}
        <SectionHeader
          label={language === 'tr' ? 'Bölüm 3' : 'Section 3'}
          title={language === 'tr' ? 'Klasik Çerçeveler — Dengeleyici Zâhirî Perspektif' : 'Classical Frameworks — Balancing Exoteric Perspective'}
          subtitle={language === 'tr'
            ? 'Tasavvufî genişlemeye karşı ölçü getiren iki klasik sistem.'
            : 'Two classical systems that bring measure against the Sufi extension.'}
          isMobile={isMobile}
        />

        <div className="g-1-2 mq-box" style={{
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "40px", '--pb-m': "32px", '--pl-d': "40px", '--pl-m': "16px",
          display: 'grid',
          gap: isMobile ? '16px' : '20px',
        }}>
          {classicalFrameworks.map(fw => (
            <FrameworkCard
              key={fw.id}
              framework={fw}
              isMobile={isMobile}
              language={language}
            />
          ))}
        </div>

        {/* ───────────────── CROSS-LINK: Münâfık Profili ───────────────── */}
        {/* Mutmainne ↔ müzebzeb mukâbelesi — Atlas içi konseptüel diyalog */}
        <div className="mq-box" style={{
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "32px", '--pb-m': "24px", '--pl-d': "40px", '--pl-m': "20px",
        }}>
          <button className="mq-box"
            onClick={() => openOverlay('munafik')}
            style={{
              width: '100%',
              '--pt-d': "14px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "14px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "16px",
              background: 'rgba(212,165,116,0.06)',
              border: '1px solid rgba(212,165,116,0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(212,165,116,0.12)';
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(212,165,116,0.06)';
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)';
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: FONTS.body }}>
                {language === 'tr' ? '↗ MÜNÂFIK PROFİLİ' : '↗ MUNĀFIQ PROFILE'}
              </p>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5 }}>
                {language === 'tr'
                  ? "Mutmainne'nin tam zıddı: müzebzeb (bocalayan) hâli — Nisâ 4:143. İki yol, aynı insan psikolojisi, farklı sonuç."
                  : "The exact opposite of muṭmaʾinna: muzabzab ('the wavering') — Q 4:143. Two paths, the same human psychology, different outcomes."}
              </p>
            </div>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* ───────────────── FOOTER NOTE ───────────────── */}
        <div className="mq-box" style={{
          '--pt-d': "32px", '--pt-m': "24px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "56px", '--pb-m': "40px", '--pl-d': "40px", '--pl-m': "20px",
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
        }}>
          <p className="mq-fs" style={{
            color: COLORS.silver,
            '--fs-d': '0.92rem', '--fs-m': '0.85rem',
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            lineHeight: 1.75,
            margin: 0,
            maxWidth: '620px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {language === 'tr'
              ? "Bu atlas, Kur'ân'ın 3 kesin mertebesini + tasavvufî 4 eklemeyi eşit mesafeyle sunar. Birini diğerinin yerine koymaz."
              : "This atlas presents the Qur'an's 3 definitive stages + the Sufi 4 additions at equal distance. It does not substitute one for the other."}
          </p>
        </div>

        {/* Klasik Kaynaklar */}
        <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "40px", '--pl-m': "20px" }}>
          <SourcesCitation
            language={language}
            isMobile={isMobile}
            sources={[
              { author: 'İmam Gazâlî',             workTr: 'İhyâ\'u Ulûmi\'d-Dîn',     workEn: 'Iḥyāʾ ʿUlūm al-Dīn',       period: '1058–1111 (Tûs)',    noteTr: 'Nefs terbiyesi (Riyâzetü\'n-Nefs) — emmâreden mutmainneye yöntem.', noteEn: 'Discipline of the self (Riyāḍa al-Nafs) — the path from ammāra to muṭmaʾinna.' },
              { author: 'İbn Kayyim el-Cevziyye',  workTr: 'Medâricu\'s-Sâlikîn',       workEn: 'Madārij al-Sālikīn',        period: '1292–1350 (Şâm)',    noteTr: 'Kur\'ânî üç nefis mertebesinin (emmâre-levvâme-mutmainne) işlendiği tasavvufî klasik.', noteEn: 'A classical Sufi work treating the Qur\'anic three-stage nafs framework (ammāra–lawwāma–muṭmaʾinna).' },
              { author: 'Necmüddîn-i Kübrâ',       workTr: 'Fevâihu\'l-Cemâl',           workEn: 'Fawāʾiḥ al-Jamāl',          period: '1145–1221 (Hârizm)', noteTr: 'Tasavvufî 7 mertebe — Kübreviyye geleneğinin temel metni.', noteEn: 'The Sufi sevenfold stations — foundational text of the Kubrāwiyya order.' },
              { author: 'er-Râzî',                 workTr: 'Mefâtîhu\'l-Ğayb',           workEn: 'Mafātīḥ al-Ghayb',          period: '1149–1209 (Rey)',    noteTr: 'Fecr 89:27–28 tefsiri — \"mutmainne\" mertebesinin kelâmî okunuşu.', noteEn: 'Commentary on Fajr 89:27–28 — kalāmic reading of the muṭmaʾinna station.' },
            ]}
          />
        </div>

        {/* Cross-tool CTA — sayfa sonu */}
        <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "60px", '--pb-m': "36px", '--pl-d': "40px", '--pl-m': "20px" }}>
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/munafik`,        titleTr: 'Münâfık Profili',      titleEn: 'Profile of the Hypocrite', descTr: 'Nefs-i emmârenin sosyal yüzü: 300+ ayet tek karakter tipine ayrılır.', descEn: 'The social face of the commanding self: 300+ verses devoted to one character type.' },
              { href: `/${language}/arac/iblis-seytan`,    titleTr: 'İblîs & Şeytan',       titleEn: 'Iblis & Satan',             descTr: 'Nefsin baş düşmanı — vesvese kanalı (Nâs 114:5), 7 sûrede aynı sahne.',     descEn: 'The self\'s chief enemy — the waswasa channel (Nās 114:5), the same scene across 7 surahs.' },
              { href: `/${language}/arac/melekler`,        titleTr: 'Melekler',             titleEn: 'Angels',                    descTr: 'İlham ve vahy-i tabîî — nefse rağmen kalbe inen doğru sesler.',          descEn: 'Ilhām and natural revelation — voices descending into the heart despite the self.' },
            ]}
          />
        </div>

        </>}
        {/* ═════════════════ END TAB 4 ═════════════════ */}

      </div>
    </div>
  );
}

// ─── Tab: Comparison Matrix ────────────────────────────────────────
function ComparisonMatrixTab({ language, isMobile, matrix }) {
  const tr = language === 'tr';
  const { dimensions, rows, introTr, introEn, criticalNoteTr, criticalNoteEn } = matrix;
  const [selectedDim, setSelectedDim] = useState('emotion');
  const activeDim = dimensions.find(d => d.id === selectedDim);

  return (
    <div className="mq-box" style={{ '--pt-d': "48px", '--pt-m': "28px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "40px", '--pl-m': "16px" }}>
      {/* Intro */}
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "7 MERTEBE × 6 BOYUT KARŞILAŞTIRMA" : "7 STAGES × 6 DIMENSIONS COMPARISON"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>{tr ? introTr : introEn}</p>
      </div>

      {/* Dimension selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        {dimensions.map(d => (
          <button key={d.id} onClick={() => setSelectedDim(d.id)}
            style={{
              padding: '10px 16px',
              background: selectedDim === d.id ? `${d.color}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedDim === d.id ? d.color : COLORS.glassBorderSoft}`,
              color: selectedDim === d.id ? d.color : COLORS.silver,
              fontSize: '0.78rem', fontWeight: 600, fontFamily: FONTS.body,
              borderRadius: RADIUS.chip, cursor: 'pointer',
              letterSpacing: '0.06em',
            }}>
            {tr ? d.labelTr : d.labelEn}
          </button>
        ))}
      </div>

      {/* Matrix — vertical list of stage cards, showing selected dimension */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        maxWidth: '980px', margin: '0 auto',
      }}>
        {rows.map((row, i) => (
          <div key={row.stageId} className="nm-sidebar-grid mq-box" style={{
            display: 'grid',
            gap: isMobile ? '10px' : '20px',
            alignItems: 'stretch',
            '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "14px",
            background: `linear-gradient(90deg, ${row.colorHex}12 0%, rgba(255,255,255,0.03) 100%)`,
            border: `1px solid ${row.colorHex}44`,
            borderLeft: `4px solid ${row.colorHex}`,
            borderRadius: RADIUS.md,
          }}>
            {/* Stage name + badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                fontFamily: FONTS.display, fontSize: '1.1rem',
                color: row.colorHex, fontWeight: 700,
              }}>
                {tr ? row.nameTr : row.nameEn}
              </div>
              <span style={{
                display: 'inline-block', width: 'fit-content',
                padding: '3px 8px', fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                background: row.isQuranic ? `${COLORS.gold}22` : 'rgba(148,163,184,0.15)',
                color: row.isQuranic ? COLORS.gold : COLORS.silver,
                border: `1px solid ${row.isQuranic ? COLORS.gold : COLORS.silver}55`,
                borderRadius: '999px',
                fontFamily: FONTS.body,
              }}>
                {row.isQuranic ? (tr ? "Kur'ânî" : "Qur'anic") : (tr ? "Tasavvufî" : "Sufi")}
              </span>
            </div>

            {/* Value for selected dimension */}
            <div style={{
              padding: '10px 14px',
              background: `${activeDim.color}0e`,
              borderLeft: `2px solid ${activeDim.color}`,
              borderRadius: '4px',
            }}>
              <div style={{
                fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: activeDim.color, marginBottom: '4px', fontWeight: 700,
                fontFamily: FONTS.body,
              }}>{tr ? activeDim.labelTr : activeDim.labelEn}</div>
              <div style={{
                fontSize: '0.88rem', color: COLORS.offWhite,
                lineHeight: 1.6, fontFamily: FONTS.body,
              }}>
                {tr ? row.values[selectedDim].tr : row.values[selectedDim].en}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Critical note */}
      <div style={{
        marginTop: '32px', maxWidth: '820px',
        margin: '32px auto 0',
        padding: '18px 20px',
        background: 'rgba(231,76,60,0.06)',
        borderLeft: '3px solid #e74c3c',
        borderRadius: RADIUS.md,
      }}>
        <div style={{
          fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#e74c3c', fontWeight: 700, marginBottom: '8px',
          fontFamily: FONTS.body,
        }}>{tr ? "AKADEMİK NOT" : "ACADEMIC NOTE"}</div>
        <p style={{
          fontSize: '0.86rem', color: COLORS.offWhite,
          lineHeight: 1.7, margin: 0, fontFamily: FONTS.body,
        }}>{tr ? criticalNoteTr : criticalNoteEn}</p>
      </div>
    </div>
  );
}

// ─── Tab: Key Verses ────────────────────────────────────────────
function KeyVersesTab({ language, isMobile, keyVerses }) {
  const tr = language === 'tr';
  const { verses, introTr, introEn, closingWhisperTr, closingWhisperEn } = keyVerses;

  return (
    <div className="mq-box" style={{ '--pt-d': "48px", '--pt-m': "28px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "40px", '--pl-m': "16px" }}>
      {/* Intro */}
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "KUR'ÂN'IN ÜÇ KELİMESİ · ÜÇ SAHNE" : "THE QUR'AN'S THREE WORDS · THREE SCENES"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>{tr ? introTr : introEn}</p>
      </div>

      {/* 3-column grid */}
      <div className="g-1-3" style={{
        display: 'grid',
        gap: isMobile ? '18px' : '20px',
        maxWidth: '1240px', margin: '0 auto',
      }}>
        {verses.map(v => (
          <div className="mq-box" key={v.stageId} style={{
            background: `linear-gradient(180deg, ${v.colorHex}12 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${v.colorHex}55`,
            borderRadius: RADIUS.lg,
            '--pt-d': "26px", '--pt-m': "22px", '--pr-d': "22px", '--pr-m': "18px", '--pb-d': "26px", '--pb-m': "22px", '--pl-d': "22px", '--pl-m': "18px",
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
              background: `radial-gradient(circle, ${v.colorHex}22 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Label */}
            <div style={{
              fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: v.colorHex, fontWeight: 700, marginBottom: '4px',
              fontFamily: FONTS.body, position: 'relative',
            }}>{tr ? v.labelTr : v.labelEn}</div>
            <div style={{
              fontSize: '0.72rem', color: COLORS.silver, opacity: 0.78,
              marginBottom: '18px', letterSpacing: '0.06em',
              fontFamily: FONTS.body, position: 'relative',
            }}>{tr ? v.refTr : v.refEn}</div>

            {/* Arabic verse */}
            <div style={{
              padding: '18px 16px', marginBottom: '14px',
              background: 'rgba(0,0,0,0.35)',
              border: `1px solid ${v.colorHex}33`,
              borderRadius: RADIUS.md,
              textAlign: 'right', position: 'relative',
            }}>
              <p dir="rtl" lang="ar" className="mq-fs" style={{
                fontFamily: FONTS.quran,
                '--fs-d': '1.35rem', '--fs-m': '1.25rem',
                color: v.colorHex, lineHeight: 2, margin: 0,
                textShadow: `0 0 12px ${v.colorHex}33`,
              }}>{v.arabic}</p>
            </div>

            {/* Translation */}
            <p style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              fontSize: '0.9rem', color: COLORS.offWhite,
              lineHeight: 1.65, margin: '0 0 20px',
              position: 'relative',
            }}>&quot;{tr ? v.translationTr : v.translationEn}&quot;</p>

            {/* Scene */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <div style={{
                fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: v.colorHex, opacity: 0.72, marginBottom: '6px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "SAHNE" : "SCENE"}</div>
              <p style={{
                fontSize: '0.82rem', color: COLORS.offWhite,
                lineHeight: 1.65, margin: 0, fontFamily: FONTS.body,
              }}>{tr ? v.sceneTr : v.sceneEn}</p>
            </div>

            {/* Linguistic */}
            <div style={{
              padding: '12px 14px',
              background: `${v.colorHex}0e`,
              borderLeft: `2px solid ${v.colorHex}`,
              borderRadius: '4px', position: 'relative', marginTop: 'auto',
            }}>
              <div style={{
                fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: v.colorHex, marginBottom: '4px',
                fontFamily: FONTS.body, fontWeight: 700,
              }}>{tr ? "DİLBİLİM" : "LINGUISTICS"}</div>
              <p style={{
                fontSize: '0.8rem', color: COLORS.silver,
                lineHeight: 1.6, margin: 0, fontFamily: FONTS.body,
              }}>{tr ? v.linguisticTr : v.linguisticEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Closing whisper */}
      <div style={{ marginTop: '48px', textAlign: 'center', maxWidth: '820px', margin: '48px auto 0' }}>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          '--fs-d': '1.15rem', '--fs-m': '1rem',
          color: COLORS.gold, opacity: 0.85,
          lineHeight: 1.75, margin: 0,
        }}>{tr ? closingWhisperTr : closingWhisperEn}</p>
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle, isMobile, faint = false }) {
  return (
    <div className="mq-box" style={{
      '--pt-d': "40px", '--pt-m': "28px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "20px", '--pb-m': "14px", '--pl-d': "40px", '--pl-m': "20px",
      borderTop: faint ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
      opacity: faint ? 0.96 : 1,
    }}>
      <div style={sectionLabel(faint ? COLORS.silver : COLORS.gold)}>{label}</div>
      <h2 className="mq-fs" style={{
        color: COLORS.offWhite,
        '--fs-d': '1.75rem', '--fs-m': '1.35rem',
        fontFamily: FONTS.display,
        fontWeight: 700,
        margin: '8px 0 8px 0',
        lineHeight: 1.3,
        maxWidth: '720px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mq-fs" style={{
          color: COLORS.silver,
          '--fs-d': '0.95rem', '--fs-m': '0.88rem',
          fontFamily: FONTS.body,
          lineHeight: 1.65,
          margin: 0,
          maxWidth: '640px',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Stage card (used for both Qur'anic core and Sufi extension) ─────────────
function StageCard({ stage, number, isMobile, language, variant, showDividerBelow }) {
  const accent = stage.color;
  const isSufi = variant === 'sufi';

  // Card background differs between variants
  const cardBg = isSufi ? COLORS.glassBgFaint : COLORS.glassBg;
  const cardOpacity = isSufi ? 0.94 : 1;

  return (
    <>
      <div className="nm-sidebar-grid mq-box" style={{
        display: 'grid',
        gap: isMobile ? '16px' : '32px',
        '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "18px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "18px",
        background: cardBg,
        border: `1px solid ${COLORS.glassBorder}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '14px',
        opacity: cardOpacity,
      }}>

        {/* ─── LEFT COLUMN: number + arabic + transliteration + name ─── */}
        <div className="mq-box" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : 'flex-start',
          borderRight: isMobile ? 'none' : `1px solid ${COLORS.glassBorderSoft}`,
          '--pr-d': '24px', '--pr-m': 0,
          '--pb-d': 0, '--pb-m': '8px',
          borderBottom: isMobile ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
        }}>
          {/* Big number */}
          <div className="mq-fs" style={{
            fontFamily: FONTS.display,
            '--fs-d': '4rem', '--fs-m': '2.8rem',
            fontWeight: 900,
            color: accent,
            lineHeight: 1,
            textShadow: `0 0 24px ${accent}55`,
            marginBottom: '12px',
          }}>
            {number}
          </div>

          {/* Arabic noun (KFGQPC) */}
          <div
            dir="rtl"
            lang="ar"
            className="mq-fs" style={{
              fontFamily: FONTS.quran,
              '--fs-d': '1.7rem', '--fs-m': '1.45rem',
              color: COLORS.offWhite,
              lineHeight: 1.9,
              marginBottom: '6px',
              textAlign: 'right',
              width: '100%',
              direction: 'rtl',
            }}
          >
            {stage.arabicNoun}
          </div>

          {/* Transliteration */}
          <div style={{
            color: COLORS.silver,
            fontSize: '0.78rem',
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            marginBottom: '8px',
          }}>
            {stage.transliteration}
          </div>

          {/* Name */}
          <div className="mq-fs" style={{
            color: accent,
            '--fs-d': '1.05rem', '--fs-m': '0.98rem',
            fontFamily: FONTS.display,
            fontWeight: 700,
            lineHeight: 1.35,
          }}>
            {language === 'tr' ? stage.nameTr : stage.nameEn}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: meaning, verses, description, view, source ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>

          {/* Meaning */}
          <p className="mq-fs" style={{
            color: COLORS.offWhite,
            '--fs-d': '1.02rem', '--fs-m': '0.95rem',
            fontFamily: FONTS.body,
            fontWeight: 500,
            lineHeight: 1.55,
            margin: 0,
          }}>
            {language === 'tr' ? stage.meaningTr : stage.meaningEn}
          </p>

          {/* Key verse ref + linguisticBasis chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {stage.keyVerseRef && (
              <span style={chipStyle(accent)}>
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
                {stage.keyVerseRef}
              </span>
            )}
            {stage.linguisticBasis && (
              <span style={chipStyle(COLORS.silver)}>
                <span>{language === 'tr' ? 'Dayanak:' : 'Basis:'}</span>
                <span>{stage.linguisticBasis}</span>
              </span>
            )}
          </div>

          {/* Verses */}
          {stage.verses && stage.verses.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stage.verses.map((v, i) => (
                <VerseBlock key={i} verse={v} accent={accent} isMobile={isMobile} language={language} />
              ))}
            </div>
          )}

          {/* Description */}
          <p className="mq-fs" style={{
            color: COLORS.offWhite,
            '--fs-d': '0.95rem', '--fs-m': '0.9rem',
            fontFamily: FONTS.body,
            lineHeight: 1.75,
            margin: 0,
          }}>
            {language === 'tr' ? stage.descriptionTr : stage.descriptionEn}
          </p>

          {/* Classical / Sufi view */}
          {(stage.classicalViewTr || stage.sufiViewTr) && (
            <div style={{
              padding: '14px 16px',
              borderLeft: `2px solid ${accent}`,
              background: `${accent}08`,
              borderRadius: '0 8px 8px 0',
            }}>
              <div style={{ ...sectionLabel(accent), marginBottom: '8px' }}>
                {isSufi
                  ? (language === 'tr' ? 'Tasavvufî Görüş' : 'Sufi View')
                  : (language === 'tr' ? 'Klasik Görüş' : 'Classical View')}
              </div>
              <p className="mq-fs" style={{
                color: COLORS.silver,
                '--fs-d': '0.9rem', '--fs-m': '0.86rem',
                fontFamily: FONTS.body,
                fontStyle: 'italic',
                lineHeight: 1.75,
                margin: 0,
              }}>
                {isSufi
                  ? (language === 'tr' ? stage.sufiViewTr : stage.sufiViewEn)
                  : (language === 'tr' ? stage.classicalViewTr : stage.classicalViewEn)}
              </p>
            </div>
          )}

          {/* Source chip */}
          {stage.sourceTr && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(148,163,184,0.05)',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{
                ...sectionLabel(COLORS.silver),
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {language === 'tr' ? 'Kaynak' : 'Source'}
              </div>
              <p style={{
                color: COLORS.silver,
                fontSize: '0.78rem',
                fontFamily: FONTS.body,
                lineHeight: 1.55,
                margin: 0,
              }}>
                {language === 'tr' ? stage.sourceTr : stage.sourceEn}
              </p>
            </div>
          )}

          {/* Info (Qur'anic core only — small gold-flavor note) */}
          {stage.infoTr && (
            <p style={{
              color: COLORS.gold,
              fontSize: '0.78rem',
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              lineHeight: 1.65,
              margin: 0,
              opacity: 0.85,
            }}>
              {language === 'tr' ? stage.infoTr : stage.infoEn}
            </p>
          )}

          {/* Warning box (Sufi extension only) */}
          {stage.warningTr && (
            <div style={{
              padding: '14px 16px',
              background: 'rgba(231,76,60,0.04)',
              border: '1px solid rgba(231,76,60,0.3)',
              borderRadius: RADIUS.md,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.softRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{
                  color: COLORS.softRed,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: FONTS.body,
                }}>
                  {language === 'tr' ? 'Ekol Uyarısı' : 'School Caution'}
                </span>
              </div>
              <p className="mq-fs" style={{
                color: COLORS.offWhite,
                '--fs-d': '0.9rem', '--fs-m': '0.86rem',
                fontFamily: FONTS.body,
                lineHeight: 1.7,
                margin: 0,
              }}>
                {language === 'tr' ? stage.warningTr : stage.warningEn}
              </p>
            </div>
          )}

          {/* Ekol etiketi chip (bottom) */}
          {stage.ekolEtiketi && (
            <div style={{ marginTop: '2px' }}>
              <span style={{
                ...chipStyle(isSufi ? COLORS.silver : accent),
                fontSize: '0.7rem',
              }}>
                <span>{language === 'tr' ? 'Ekol:' : 'School:'}</span>
                <span>{stage.ekolEtiketi}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {showDividerBelow && (
        <div className="mq-box" style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha15} 50%, transparent 100%)`,
          '--mt-d': "4px", '--mt-m': "4px", '--mr-d': "120px", '--mr-m': "40px", '--mb-d': "4px", '--mb-m': "4px", '--ml-d': "120px", '--ml-m': "40px",
        }} />
      )}
    </>
  );
}

// ─── Verse block (Arabic + translation + ref + audio) ───────────────────────
function VerseBlock({ verse, accent, isMobile, language }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(verse.surah, verse.ayah);
  const canPlay = verse.surah && verse.ayah && !failed;
  return (
    <div style={{
      ...VERSE_DISPLAY_CARD,
      borderLeft: `3px solid ${accent}`,
      padding: '14px 16px',
    }}>
      <div
        dir="rtl"
        lang="ar"
        className="mq-fs" style={{
          fontFamily: FONTS.quran,
          '--fs-d': '1.5rem', '--fs-m': '1.3rem',
          color: COLORS.gold,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2,
          marginBottom: '10px',
        }}
      >
        {cleanArabic(verse.verseAr)}
      </div>
      <p className="mq-fs" style={{
        color: COLORS.offWhite,
        '--fs-d': '0.9rem', '--fs-m': '0.86rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        lineHeight: 1.7,
        margin: '0 0 8px 0',
      }}>
        {language === 'tr' ? verse.verseTr : verse.verseEn}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <p style={{
          color: accent,
          fontSize: '0.74rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          — {verse.verseRef}
        </p>
        {canPlay && (
          <button
            onClick={toggle}
            aria-label={playing ? (language === 'tr' ? 'Durdur' : 'Stop') : (language === 'tr' ? 'Dinle' : 'Listen')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: playing ? `${accent}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${playing ? accent + '60' : 'rgba(255,255,255,0.10)'}`,
              color: playing ? accent : COLORS.silver,
              fontSize: '0.72rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {loading ? (
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" opacity="0.25" />
                <path d="M21 12a9 9 0 0 1-9 9" />
              </svg>
            ) : playing ? (
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>{playing ? (language === 'tr' ? 'Durdur' : 'Stop') : (language === 'tr' ? 'Dinle' : 'Listen')}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Transition band (the "gate" between Qur'anic core and Sufi extension) ──
function TransitionBand({ note, isMobile, language }) {
  return (
    <div className="mq-box" style={{
      '--mt-d': "40px", '--mt-m': "28px", '--mr-d': "0", '--mr-m': "0", '--mb-d': "40px", '--mb-m': "28px", '--ml-d': "0", '--ml-m': "0",
      '--pt-d': "40px", '--pt-m': "28px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "40px", '--pb-m': "28px", '--pl-d': "40px", '--pl-m': "20px",
      background: 'rgba(212,162,36,0.05)',
      borderTop: `1px solid ${COLORS.goldAlpha25}`,
      borderBottom: `1px solid ${COLORS.goldAlpha25}`,
      position: 'relative',
    }}>
      {/* Top row: arrows + title */}
      <div className="fd-row" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '12px' : '24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        {/* Left arrow (up) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <svg aria-hidden="true" width={isMobile ? '28' : '36'} height={isMobile ? '28' : '36'} viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span style={{
            color: COLORS.gold,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? "Kur'ânî Çekirdek" : "Qur'anic Core"}
          </span>
        </div>

        {/* Central title */}
        <h3 className="mq-fs" style={{
          color: COLORS.offWhite,
          '--fs-d': '1.25rem', '--fs-m': '1rem',
          fontFamily: FONTS.display,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.4,
          maxWidth: '520px',
        }}>
          {language === 'tr' ? note.titleTr : note.titleEn}
        </h3>

        {/* Right arrow (down) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <svg aria-hidden="true" width={isMobile ? '28' : '36'} height={isMobile ? '28' : '36'} viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span style={{
            color: COLORS.silver,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? 'Tasavvufî Genişleme' : 'Sufi Extension'}
          </span>
        </div>
      </div>

      {/* Warning body — MUST be visible, NOT collapsible */}
      <p className="mq-fs" style={{
        color: COLORS.silver,
        '--fs-d': '0.95rem', '--fs-m': '0.88rem',
        fontFamily: FONTS.body,
        lineHeight: 1.8,
        margin: 0,
        maxWidth: '780px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: isMobile ? 'left' : 'center',
      }}>
        {language === 'tr' ? note.bodyTr : note.bodyEn}
      </p>
    </div>
  );
}

// ─── Framework card (classical frameworks section) ───────────────────────────
function FrameworkCard({ framework, isMobile, language }) {
  return (
    <div className="mq-box" style={{
      ...GLASS_CARD,
      '--pt-d': "24px", '--pt-m': "20px", '--pr-d': "26px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "20px", '--pl-d': "26px", '--pl-m': "18px",
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={sectionLabel(COLORS.gold)}>
        {language === 'tr' ? 'Klasik Çerçeve' : 'Classical Framework'}
      </div>

      <h3 className="mq-fs" style={{
        color: COLORS.offWhite,
        '--fs-d': '1.25rem', '--fs-m': '1.1rem',
        fontFamily: FONTS.display,
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.3,
      }}>
        {language === 'tr' ? framework.titleTr : framework.titleEn}
      </h3>

      <p className="mq-fs" style={{
        color: COLORS.silver,
        '--fs-d': '0.92rem', '--fs-m': '0.88rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: 0,
      }}>
        {language === 'tr' ? framework.descTr : framework.descEn}
      </p>

      {framework.sourceTr && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(148,163,184,0.05)',
          border: `1px solid ${COLORS.glassBorderSoft}`,
          borderRadius: RADIUS.md,
          marginTop: '4px',
        }}>
          <div style={{ ...sectionLabel(COLORS.silver), marginBottom: '4px' }}>
            {language === 'tr' ? 'Kaynak' : 'Source'}
          </div>
          <p style={{
            color: COLORS.silver,
            fontSize: '0.78rem',
            fontFamily: FONTS.body,
            lineHeight: 1.55,
            margin: 0,
          }}>
            {language === 'tr' ? framework.sourceTr : framework.sourceEn}
          </p>
        </div>
      )}

      {framework.ekolEtiketi && (
        <div>
          <span style={{ ...chipStyle(COLORS.gold), fontSize: '0.7rem' }}>
            <span>{language === 'tr' ? 'Ekol:' : 'School:'}</span>
            <span>{framework.ekolEtiketi}</span>
          </span>
        </div>
      )}
    </div>
  );
}

