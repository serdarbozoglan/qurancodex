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
  RADIUS,
} from '../tokens';
import ToolHeader from './ToolHeader';
import useFocusTrap from '../hooks/useFocusTrap';


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
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

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

  // Fetch data
  useEffect(() => {
    fetch('/nefis-mertebeleri.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
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
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        {NEFIS_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
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
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      {NEFIS_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ─────────────────────────────── HERO ─────────────────────────────── */}
        <div style={{
          padding: isMobile ? '32px 20px 28px' : '48px 40px 36px',
          background: 'linear-gradient(180deg, rgba(139,0,0,0.05) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          <div style={sectionLabel()}>
            {language === 'tr' ? 'Reflection · İç Yolculuk' : 'Reflection · Inner Journey'}
          </div>

          {/* Playfair italic quote */}
          <h1 style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontWeight: 700,
            color: COLORS.offWhite,
            fontSize: isMobile ? '1.55rem' : '2.3rem',
            lineHeight: 1.3,
            margin: '14px 0 10px 0',
            maxWidth: '760px',
          }}>
            {language === 'tr'
              ? '"İnsan nefsi sabit bir şey değildir."'
              : '"The human self is not static."'}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: COLORS.gold,
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontFamily: FONTS.body,
            fontWeight: 600,
            margin: '0 0 20px 0',
            letterSpacing: '0.02em',
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Intro desc */}
          <p style={{
            color: COLORS.silver,
            fontSize: isMobile ? '0.92rem' : '1rem',
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
            <span style={{ color: COLORS.slate500 }}>+</span>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>4</span>
            <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'tasavvufî' : 'Sufi'}
            </span>
            <span style={{ color: COLORS.slate500 }}>=</span>
            <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>7</span>
            <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'basamak' : 'steps'}
            </span>
          </div>

          {/* Visual legend — 7-dot vertical ladder */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
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
              color: COLORS.slate500,
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

        {/* ───────────────── SECTION 1: QUR'ANIC CORE ───────────────── */}
        <SectionHeader
          label={language === 'tr' ? 'Bölüm 1' : 'Section 1'}
          title={language === 'tr' ? "Kur'ânî Çekirdek — 3 Mertebe" : "Qur'anic Core — 3 Stages"}
          subtitle={language === 'tr'
            ? "Kur'ân'da isim olarak geçen, klasik tefsirin üzerinde icmâ ettiği üç mertebe."
            : "The three stages named in the Qur'an, on which classical exegesis agrees."}
          isMobile={isMobile}
        />

        <div style={{
          padding: isMobile ? '0 16px 16px' : '0 40px 20px',
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

        <div style={{
          padding: isMobile ? '0 16px 16px' : '0 40px 20px',
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

        {/* ───────────────── SECTION 3: CLASSICAL FRAMEWORKS ───────────────── */}
        <SectionHeader
          label={language === 'tr' ? 'Bölüm 3' : 'Section 3'}
          title={language === 'tr' ? 'Klasik Çerçeveler — Dengeleyici Zâhirî Perspektif' : 'Classical Frameworks — Balancing Exoteric Perspective'}
          subtitle={language === 'tr'
            ? 'Tasavvufî genişlemeye karşı ölçü getiren iki klasik sistem.'
            : 'Two classical systems that bring measure against the Sufi extension.'}
          isMobile={isMobile}
        />

        <div style={{
          padding: isMobile ? '0 16px 32px' : '0 40px 40px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
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
        <div style={{
          padding: isMobile ? '0 20px 24px' : '0 40px 32px',
        }}>
          <button
            onClick={() => openOverlay('munafik')}
            style={{
              width: '100%',
              padding: isMobile ? '14px 16px' : '14px 22px',
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
        <div style={{
          padding: isMobile ? '24px 20px 40px' : '32px 40px 56px',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
        }}>
          <p style={{
            color: COLORS.silver,
            fontSize: isMobile ? '0.85rem' : '0.92rem',
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
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle, isMobile, faint = false }) {
  return (
    <div style={{
      padding: isMobile ? '28px 20px 14px' : '40px 40px 20px',
      borderTop: faint ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
      opacity: faint ? 0.96 : 1,
    }}>
      <div style={sectionLabel(faint ? COLORS.silver : COLORS.gold)}>{label}</div>
      <h2 style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '1.35rem' : '1.75rem',
        fontFamily: FONTS.display,
        fontWeight: 700,
        margin: '8px 0 8px 0',
        lineHeight: 1.3,
        maxWidth: '720px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          color: COLORS.silver,
          fontSize: isMobile ? '0.88rem' : '0.95rem',
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '220px 1fr',
        gap: isMobile ? '16px' : '32px',
        padding: isMobile ? '20px 18px' : '28px 32px',
        background: cardBg,
        border: `1px solid ${COLORS.glassBorder}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '14px',
        opacity: cardOpacity,
      }}>

        {/* ─── LEFT COLUMN: number + arabic + transliteration + name ─── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : 'flex-start',
          borderRight: isMobile ? 'none' : `1px solid ${COLORS.glassBorderSoft}`,
          paddingRight: isMobile ? 0 : '24px',
          paddingBottom: isMobile ? '8px' : 0,
          borderBottom: isMobile ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
        }}>
          {/* Big number */}
          <div style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '2.8rem' : '4rem',
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
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? '1.45rem' : '1.7rem',
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
          <div style={{
            color: accent,
            fontSize: isMobile ? '0.98rem' : '1.05rem',
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
          <p style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '0.95rem' : '1.02rem',
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
                <span style={{ opacity: 0.7 }}>{language === 'tr' ? 'Dayanak:' : 'Basis:'}</span>
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
          <p style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '0.9rem' : '0.95rem',
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
              <p style={{
                color: COLORS.silver,
                fontSize: isMobile ? '0.86rem' : '0.9rem',
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
              borderRadius: '8px',
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
              borderRadius: '8px',
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
              <p style={{
                color: COLORS.offWhite,
                fontSize: isMobile ? '0.86rem' : '0.9rem',
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
                <span style={{ opacity: 0.6 }}>{language === 'tr' ? 'Ekol:' : 'School:'}</span>
                <span>{stage.ekolEtiketi}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {showDividerBelow && (
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha15} 50%, transparent 100%)`,
          margin: isMobile ? '4px 40px' : '4px 120px',
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
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.3rem' : '1.5rem',
          color: COLORS.gold,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2,
          marginBottom: '10px',
        }}
      >
        {cleanArabic(verse.verseAr)}
      </div>
      <p style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '0.86rem' : '0.9rem',
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
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" opacity="0.25" />
                <path d="M21 12a9 9 0 0 1-9 9" />
              </svg>
            ) : playing ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
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
    <div style={{
      margin: isMobile ? '28px 0' : '40px 0',
      padding: isMobile ? '28px 20px' : '40px 40px',
      background: 'rgba(212,162,36,0.05)',
      borderTop: `1px solid ${COLORS.goldAlpha25}`,
      borderBottom: `1px solid ${COLORS.goldAlpha25}`,
      position: 'relative',
    }}>
      {/* Top row: arrows + title */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
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
        <h3 style={{
          color: COLORS.offWhite,
          fontSize: isMobile ? '1rem' : '1.25rem',
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
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.95rem',
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
    <div style={{
      ...GLASS_CARD,
      padding: isMobile ? '20px 18px' : '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={sectionLabel(COLORS.gold)}>
        {language === 'tr' ? 'Klasik Çerçeve' : 'Classical Framework'}
      </div>

      <h3 style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '1.1rem' : '1.25rem',
        fontFamily: FONTS.display,
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.3,
      }}>
        {language === 'tr' ? framework.titleTr : framework.titleEn}
      </h3>

      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
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
          borderRadius: '8px',
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
            <span style={{ opacity: 0.6 }}>{language === 'tr' ? 'Ekol:' : 'School:'}</span>
            <span>{framework.ekolEtiketi}</span>
          </span>
        </div>
      )}
    </div>
  );
}

