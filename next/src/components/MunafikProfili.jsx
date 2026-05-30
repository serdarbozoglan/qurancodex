'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
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


// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  {
    tr: '7 Profil', en: '7 Profiles',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        <path d="M13 20c0-3 3-5 6-5" />
      </svg>
    ),
  },
  {
    tr: 'İbn Kayyim Tipolojisi', en: 'Ibn Qayyim Typology',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    tr: 'Sahih Hadis', en: 'Authentic Hadith',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

// ─── Main overlay ────────────────────────────────────────────────────────────
export default function MunafikProfili({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProfileId, setExpandedProfileId] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);
  const trapRef = useFocusTrap(true);

  // Escape to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Mobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Data load
  useEffect(() => {
    fetch('/munafik-profili.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  // Reset body scroll on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const MUNAFIK_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="8.5" cy="12" r="1.5" fill={COLORS.gold} /><circle cx="15.5" cy="12" r="1.5" fill={COLORS.gold} /></svg>}
      titleTr="Münafık Profili"
      titleEn="Profile of the Hypocrite"
      subtitleTr="12 özellik · psikolojik portre"
      subtitleEn="12 traits · psychological portrait"
      language={language}
    />
  );

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
        {MUNAFIK_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const { intro, profiles, typologies, authenticHadith } = data;
  const typology = typologies?.[0];

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
      {MUNAFIK_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '28px 20px 24px' : '40px 40px 32px',
          background: 'linear-gradient(180deg, rgba(231,76,60,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {/* Big pull quote */}
          <h1 style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.55rem' : '2.35rem',
            fontWeight: 700,
            color: COLORS.gold,
            lineHeight: 1.25,
            margin: '0 0 14px 0',
            letterSpacing: '-0.01em',
            maxWidth: '780px',
          }}>
            {language === 'tr'
              ? '300+ ayet tek bir karakter tipine ayrıldı.'
              : '300+ verses are devoted to a single character type.'}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: COLORS.silver,
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            margin: '0 0 18px 0',
            lineHeight: 1.6,
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Description */}
          <p style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '0.92rem' : '0.98rem',
            fontFamily: FONTS.body,
            margin: '0 0 18px 0',
            lineHeight: 1.75,
            maxWidth: '720px',
          }}>
            {language === 'tr' ? intro.descTr : intro.descEn}
          </p>

          {/* Etymology — klasik Arap dilbilim çerçevesi */}
          {(intro.etymologyTr || intro.etymologyEn) && (
            <div style={{
              background: 'rgba(231,76,60,0.05)',
              border: '1px solid rgba(231,76,60,0.20)',
              borderRadius: '10px',
              padding: isMobile ? '12px 14px' : '14px 18px',
              margin: '0 0 20px 0',
              maxWidth: '720px',
            }}>
              <p style={{
                color: COLORS.softRed,
                fontSize: '0.7rem',
                fontFamily: FONTS.body,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}>
                {language === 'tr' ? 'Etimoloji' : 'Etymology'}
              </p>
              <p style={{
                color: COLORS.silver,
                fontSize: isMobile ? '0.84rem' : '0.88rem',
                fontFamily: FONTS.body,
                lineHeight: 1.7,
                margin: 0,
              }}>
                {language === 'tr' ? intro.etymologyTr : intro.etymologyEn}
              </p>
            </div>
          )}

          {/* Mini stat chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {[
              { tr: `${profiles.length} psikolojik profil`, en: `${profiles.length} psychological profiles` },
              { tr: 'İbn Kayyim tipolojisi', en: "Ibn Qayyim's typology" },
              { tr: '1 sahih hadis', en: '1 authentic hadith' },
            ].map((chip, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 12px',
                background: 'rgba(231,76,60,0.08)',
                border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: '999px',
                color: COLORS.offWhite,
                fontSize: '0.76rem',
                fontFamily: FONTS.body,
                fontWeight: 500,
              }}>
                {language === 'tr' ? chip.tr : chip.en}
              </span>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '12px 14px' : '13px 22px',
                  border: 'none',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  borderRadius: 0,
                  color: isActive ? COLORS.gold : COLORS.silver,
                  fontSize: isMobile ? '0.82rem' : '0.9rem',
                  fontFamily: FONTS.body,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                <span>{language === 'tr' ? tab.tr : tab.en}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 48px' : '28px 32px 64px' }}>

          {activeTab === 0 && (
            <ProfilesTab
              profiles={profiles}
              expandedId={expandedProfileId}
              onToggle={(id) => setExpandedProfileId(expandedProfileId === id ? null : id)}
              language={language}
              isMobile={isMobile}
            />
          )}

          {activeTab === 1 && typology && (
            <TypologyTab typology={typology} language={language} isMobile={isMobile} />
          )}

          {activeTab === 2 && authenticHadith && (
            <HadithTab hadith={authenticHadith} language={language} isMobile={isMobile} />
          )}

          {/* Cross-page CTA — Psychology section'a yönlendir */}
          <PsychologyCTA onClose={onClose} language={language} isMobile={isMobile} />

        </div>
      </div>
    </div>
  );
}

// ─── Cross-page CTA: Psychology section bağlantısı ───────────────────────────
function PsychologyCTA({ onClose, language, isMobile }) {
  const handleClick = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('psychology');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
        marginTop: '32px',
        padding: isMobile ? '14px 16px' : '16px 22px',
        background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))',
        border: `1px solid ${COLORS.gold}40`,
        borderRadius: '12px',
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.85rem' : '0.92rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(212,165,116,0.12), ${COLORS.goldAlpha04})`; e.currentTarget.style.borderColor = COLORS.gold; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))'; e.currentTarget.style.borderColor = `${COLORS.gold}40`; }}
    >
      <div>
        <div style={{
          color: COLORS.gold,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          {language === 'tr' ? '↗ Devamı için' : '↗ Continue with'}
        </div>
        <div style={{ color: COLORS.offWhite, fontWeight: 600, marginBottom: '4px' }}>
          {language === 'tr' ? 'İnsanın Psikolojisi — Bölüme Git' : 'Human Psychology — Go to Section'}
        </div>
        <div style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.5 }}>
          {language === 'tr'
            ? 'Anna Freud savunma mekanizmaları, kalp kavramı, modern psikoloji ile Kur\'ânî psikoloji köprüsü.'
            : 'Anna Freud defense mechanisms, the concept of the heart, classical Quranic psychology bridged with modern theory.'}
        </div>
      </div>
      <span style={{ color: COLORS.gold, fontSize: '1.4rem', flexShrink: 0 }}>→</span>
    </button>
  );
}

// ─── Tab 1: Profiles accordion ───────────────────────────────────────────────
function ProfilesTab({ profiles, expandedId, onToggle, language, isMobile }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '16px',
      alignItems: 'start',
    }}>
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isOpen={expandedId === profile.id}
          onToggle={() => onToggle(profile.id)}
          language={language}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

// ─── Single profile accordion card ──────────────────────────────────────────
function ProfileCard({ profile, isOpen, onToggle, language, isMobile }) {
  const title = language === 'tr' ? profile.titleTr : profile.titleEn;
  const pattern = language === 'tr' ? profile.behaviorPatternTr : profile.behaviorPatternEn;
  const classical = language === 'tr' ? profile.classicalAnalysisTr : profile.classicalAnalysisEn;
  const modern = language === 'tr' ? profile.modernParallelTr : profile.modernParallelEn;
  const source = language === 'tr' ? profile.sourceTr : profile.sourceEn;
  const info = language === 'tr' ? profile.infoTr : profile.infoEn;
  const accent = profile.color || COLORS.softRed;

  // First 110 characters of pattern for preview
  const preview = pattern.length > 110 ? pattern.slice(0, 110).trim() + '…' : pattern;

  return (
    <div style={{
      ...GLASS_CARD,
      borderLeft: `3px solid ${accent}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Header — always visible, clickable toggle */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: isMobile ? '16px 16px 14px' : '20px 22px 16px',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
          display: 'block',
        }}
      >
        {/* Key verse ref chip */}
        <div style={{
          display: 'inline-block',
          padding: '3px 9px',
          background: `${accent}14`,
          border: `1px solid ${accent}40`,
          borderRadius: '999px',
          color: accent,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
          letterSpacing: '0.02em',
          marginBottom: '10px',
        }}>
          {profile.keyVerseRef}
        </div>

        {/* Profile title */}
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.15rem' : '1.35rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 10px 0',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        {/* Preview (only when closed) */}
        {!isOpen && (
          <p style={{
            color: COLORS.silver,
            fontSize: '0.85rem',
            fontFamily: FONTS.body,
            lineHeight: 1.6,
            margin: '0 0 12px 0',
          }}>
            {preview}
          </p>
        )}

        {/* Toggle affordance */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: accent,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
        }}>
          {isOpen
            ? (language === 'tr' ? 'Kapat' : 'Close')
            : (language === 'tr' ? 'Detayı aç' : 'Open details')}
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{
          padding: isMobile ? '0 16px 18px' : '0 22px 22px',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
          paddingTop: '18px',
        }}>
          {/* Verses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {profile.verses.map((verse, vi) => (
              <VerseCard key={vi} verse={verse} language={language} />
            ))}
          </div>

          {/* Behavior pattern */}
          <SectionBlock
            label={language === 'tr' ? 'Davranış Deseni' : 'Behavioral Pattern'}
            color={accent}
          >
            <p style={{
              color: COLORS.silver,
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              lineHeight: 1.75,
              margin: 0,
            }}>
              {pattern}
            </p>
          </SectionBlock>

          {/* Classical analysis */}
          <SectionBlock
            label={language === 'tr' ? 'Klasik Analiz' : 'Classical Analysis'}
            color={COLORS.gold}
          >
            <p style={{
              color: COLORS.offWhite,
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              lineHeight: 1.75,
              margin: '0 0 10px 0',
            }}>
              {classical}
            </p>
            {/* Source names as chips */}
            <ScholarChips sourceText={source} />
          </SectionBlock>

          {/* Modern parallel — dashed warning box */}
          <div style={{
            margin: '16px 0 12px',
            padding: isMobile ? '12px 14px' : '14px 16px',
            border: `1px dashed ${COLORS.softRed}55`,
            borderRadius: '8px',
            background: 'rgba(231,76,60,0.04)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
                fontFamily: FONTS.body,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {language === 'tr' ? 'Modern Paralellik' : 'Modern Parallel'}
              </span>
            </div>
            <p style={{
              color: COLORS.offWhite,
              fontSize: '0.85rem',
              fontFamily: FONTS.body,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {modern}
            </p>
          </div>

          {/* Info note */}
          {info && (
            <p style={{
              color: COLORS.silver,
              fontSize: '0.78rem',
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              lineHeight: 1.65,
              margin: '12px 0 14px 0',
            }}>
              {info}
            </p>
          )}

          {/* Mukâbele kartı — sadece collective-network profilinde (9:67 ↔ 9:71) */}
          {profile.mukabele && (
            <MukabeleCard data={profile.mukabele} language={language} isMobile={isMobile} />
          )}

          {/* Ekol etiketi chip */}
          {profile.ekolEtiketi && (
            <div style={{ marginTop: '8px' }}>
              <EkolChip label={profile.ekolEtiketi} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mukâbele Card — 9:67 ↔ 9:71 yan yana ────────────────────────────────────
function MukabeleCard({ data, language, isMobile }) {
  const title = language === 'tr' ? data.titleTr : data.titleEn;
  const note  = language === 'tr' ? data.noteTr  : data.noteEn;
  const mirrorVerseTr = language === 'tr' ? data.mirrorVerseTr : data.mirrorVerseEn;
  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(212,165,116,0.05)',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: '10px',
      padding: isMobile ? '14px 14px' : '16px 18px',
    }}>
      <p style={{
        color: COLORS.gold,
        fontSize: '0.72rem',
        fontFamily: FONTS.body,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        margin: '0 0 6px 0',
      }}>
        ⚖ {title}
      </p>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.82rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: '0 0 14px 0',
      }}>
        {note}
      </p>

      {/* 4-pair grid — desktop'ta 2 sütun, mobilde tek sütun */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {data.pairs?.map((pair, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 24px 1fr',
            alignItems: 'center',
            gap: isMobile ? '4px' : '8px',
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontFamily: FONTS.body,
          }}>
            <span style={{ color: COLORS.softRed }}>
              <strong style={{ color: COLORS.softRed, fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Münâfık</strong>
              {language === 'tr' ? pair.munafikTr : pair.munafikEn}
            </span>
            {!isMobile && (
              <span style={{ color: COLORS.gold, textAlign: 'center', fontWeight: 700, opacity: 0.6 }}>↔</span>
            )}
            <span style={{ color: COLORS.offWhite }}>
              <strong style={{ color: COLORS.gold, fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Mü'min</strong>
              {language === 'tr' ? pair.muminTr : pair.muminEn}
            </span>
          </div>
        ))}
      </div>

      {/* Mirror verse Arabic */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: '1.15rem',
        color: COLORS.gold,
        lineHeight: 1.85,
        textAlign: 'right',
        background: 'rgba(0,0,0,0.20)',
        borderRadius: '8px',
        padding: '10px 14px',
        margin: '0 0 6px 0',
      }}>
        {cleanArabic(data.mirrorVerseAr)}
      </div>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {mirrorVerseTr}
      </p>
    </div>
  );
}

// ─── Labeled section block ───────────────────────────────────────────────────
function SectionBlock({ label, color, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        color: color || COLORS.gold,
        fontSize: '0.7rem',
        fontFamily: FONTS.body,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Verse card ──────────────────────────────────────────────────────────────
function VerseCard({ verse, language }) {
  return (
    <div style={{
      ...VERSE_DISPLAY_CARD,
      padding: '14px 16px',
    }}>
      {/* Arabic */}
      <p
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: '1.5rem',
          color: COLORS.offWhite,
          lineHeight: 2,
          textAlign: 'right',
          margin: '0 0 10px 0',
          direction: 'rtl',
        }}
      >
        {cleanArabic(verse.verseAr)}
      </p>
      {/* Translation */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        lineHeight: 1.7,
        margin: '0 0 8px 0',
      }}>
        {language === 'tr' ? verse.verseTr : verse.verseEn}
      </p>
      {/* Reference */}
      <p style={{
        color: COLORS.gold,
        fontSize: '0.75rem',
        fontFamily: FONTS.body,
        fontWeight: 600,
        margin: 0,
      }}>
        — {verse.verseRef}
      </p>
    </div>
  );
}

// ─── Scholar chips (parsed from source string) ───────────────────────────────
function ScholarChips({ sourceText }) {
  if (!sourceText) return null;
  // Split on semicolons — each entry is one source reference
  const entries = sourceText.split(/;\s*/).filter(Boolean).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {entries.map((entry, i) => {
        // Take first 40 characters as the chip label — keeps it compact
        const label = entry.length > 44 ? entry.slice(0, 44).trim() + '…' : entry.trim();
        return (
          <span key={i} style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(212,165,116,0.06)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: '999px',
            color: COLORS.offWhite,
            fontSize: '0.72rem',
            fontFamily: FONTS.body,
          }}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Ekol chip (small silver, italic) ────────────────────────────────────────
function EkolChip({ label }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      background: 'transparent',
      border: `1px solid ${COLORS.silverAlpha40}`,
      borderRadius: '999px',
      color: COLORS.silver,
      fontSize: '0.7rem',
      fontFamily: FONTS.body,
      fontStyle: 'italic',
    }}>
      {label}
    </span>
  );
}

// ─── Tab 2: Ibn Qayyim typology ──────────────────────────────────────────────
function TypologyTab({ typology, language, isMobile }) {
  const title = language === 'tr' ? typology.titleTr : typology.titleEn;
  const scholarName = language === 'tr' ? typology.scholar : typology.scholarEn;
  const workName = language === 'tr' ? typology.work : typology.workEn;
  const source = language === 'tr' ? typology.sourceTr : typology.sourceEn;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          color: COLORS.softRed,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Klasik Tipoloji' : 'Classical Typology'}
        </div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 8px 0',
          lineHeight: 1.25,
        }}>
          {title}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          margin: 0,
        }}>
          {scholarName} · <span style={{ color: COLORS.gold }}>{workName}</span>
        </p>
      </div>

      {/* Categories — 2 columns desktop, 1 column mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        gap: isMobile ? '14px' : '0',
        position: 'relative',
      }}>
        {typology.categories.map((cat, idx) => {
          const isFirst = idx === 0;
          const catLabel = language === 'tr' ? cat.labelTr : cat.labelEn;
          const catDesc = language === 'tr' ? cat.descTr : cat.descEn;
          // First category (itikadi) = harder red, second (ameli) = silver
          const catColor = isFirst ? COLORS.softRed : COLORS.silver;

          return (
            <div
              key={cat.id}
              style={{
                ...GLASS_CARD,
                flex: 1,
                padding: isMobile ? '20px 18px' : '28px 26px',
                borderLeft: `3px solid ${catColor}`,
                margin: !isMobile ? (isFirst ? '0 10px 0 0' : '0 0 0 10px') : 0,
              }}
            >
              {/* Category number */}
              <div style={{
                color: catColor,
                fontFamily: FONTS.display,
                fontSize: '2.2rem',
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: '10px',
              }}>
                {idx + 1}
              </div>

              {/* Label */}
              <h3 style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '1.15rem' : '1.3rem',
                fontWeight: 700,
                color: COLORS.offWhite,
                margin: '0 0 14px 0',
                lineHeight: 1.3,
              }}>
                {catLabel}
              </h3>

              {/* Description */}
              <p style={{
                color: COLORS.silver,
                fontSize: '0.9rem',
                fontFamily: FONTS.body,
                lineHeight: 1.8,
                margin: 0,
              }}>
                {catDesc}
              </p>
            </div>
          );
        })}

        {/* Separator for desktop — vertical line between cards */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            background: COLORS.cosmicBlack,
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontSize: '1rem',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            ×
          </div>
        )}
      </div>

      {/* Source note */}
      <div style={{
        marginTop: '28px',
        padding: isMobile ? '14px 16px' : '16px 20px',
        background: COLORS.glassBgFaint,
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: '10px',
      }}>
        <div style={{
          color: COLORS.gold,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          {language === 'tr' ? 'Kaynak' : 'Source'}
        </div>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.82rem',
          fontFamily: FONTS.body,
          lineHeight: 1.7,
          margin: '0 0 10px 0',
        }}>
          {source}
        </p>
        {typology.ekolEtiketi && <EkolChip label={typology.ekolEtiketi} />}
      </div>
    </div>
  );
}

// ─── Tab 3: Authentic hadith ─────────────────────────────────────────────────
function HadithTab({ hadith, language, isMobile }) {
  const title = language === 'tr' ? hadith.titleTr : hadith.titleEn;
  const text = language === 'tr' ? hadith.textTr : hadith.textEn;
  const source = language === 'tr' ? hadith.source : hadith.sourceEn;
  const status = language === 'tr' ? hadith.statusTr : hadith.statusEn;
  const note = language === 'tr' ? hadith.noteTr : hadith.noteEn;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Sahih hadis badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '18px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: 'rgba(212,165,116,0.08)',
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: '999px',
          color: COLORS.gold,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v6c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          {language === 'tr' ? 'Sahih Hadis · Mütefekkun Aleyh' : 'Authentic Hadith · Muttafaqun ʿAlayh'}
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: FONTS.display,
        fontSize: isMobile ? '1.5rem' : '1.95rem',
        fontWeight: 700,
        color: COLORS.offWhite,
        textAlign: 'center',
        margin: '0 0 28px 0',
        lineHeight: 1.3,
      }}>
        {title}
      </h2>

      {/* Main hadith card */}
      <div style={{
        ...GLASS_CARD,
        border: `1px solid ${COLORS.goldAlpha25}`,
        padding: isMobile ? '24px 20px' : '40px 48px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Opening quote mark */}
        <div style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '3rem' : '4rem',
          color: COLORS.goldAlpha25,
          lineHeight: 0.5,
          margin: '0 0 10px 0',
          userSelect: 'none',
        }}>
          “
        </div>

        {/* Hadith text */}
        <p style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.1rem' : '1.35rem',
          fontWeight: 400,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          lineHeight: 1.75,
          margin: '0 0 22px 0',
        }}>
          {text}
        </p>

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '10px' : '16px',
          paddingTop: '18px',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              color: COLORS.slate500,
              fontSize: '0.66rem',
              fontFamily: FONTS.body,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              {language === 'tr' ? 'Ravi' : 'Narrator'}
            </div>
            <div style={{
              color: COLORS.offWhite,
              fontSize: '0.86rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
            }}>
              {hadith.narrator}
            </div>
          </div>

          {!isMobile && (
            <div style={{
              width: '1px',
              height: '28px',
              background: COLORS.glassBorder,
            }} />
          )}

          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              color: COLORS.slate500,
              fontSize: '0.66rem',
              fontFamily: FONTS.body,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              {language === 'tr' ? 'Kaynak' : 'Source'}
            </div>
            <div style={{
              color: COLORS.offWhite,
              fontSize: '0.86rem',
              fontFamily: FONTS.body,
              fontWeight: 500,
            }}>
              {source}
            </div>
          </div>
        </div>
      </div>

      {/* Status chip */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '18px',
      }}>
        <span style={{
          display: 'inline-block',
          padding: '7px 16px',
          background: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.35)',
          borderRadius: '999px',
          color: COLORS.softEmerald,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 500,
        }}>
          {language === 'tr' ? 'Statü: ' : 'Status: '}{status}
        </span>
      </div>

      {/* Note */}
      {note && (
        <p style={{
          color: COLORS.silver,
          fontSize: '0.8rem',
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          lineHeight: 1.7,
          textAlign: 'center',
          margin: '20px auto 0',
          maxWidth: '620px',
        }}>
          {note}
        </p>
      )}

      {/* Ekol chip */}
      {hadith.ekolEtiketi && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <EkolChip label={hadith.ekolEtiketi} />
        </div>
      )}
    </div>
  );
}

