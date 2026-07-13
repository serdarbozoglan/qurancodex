'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';
import CrossToolCTA from './CrossToolCTA';
import HeroGeometricBackground from './HeroGeometricBackground';
import useFocusTrap from '../hooks/useFocusTrap';

// Overlay-local fadeUp — used for individual blocks; overlay has no parent stagger container.
// PASSAGES — 7 anlatım verisi src/data/iblis-passages.js'ten import edilir.
import { PASSAGES } from '../data/iblis-passages';
// OBSERVATIONS — 7 çapraz anlatım gözlemi src/data/iblis-observations.js'ten import edilir.
import { OBSERVATIONS } from '../data/iblis-observations';
// Widget'lar ayrı component dosyalarına ayrıldı (2026-07-11).
import VesveseKanaliWidget from './iblis/VesveseKanaliWidget';
import OnIkiHileWidget from './iblis/OnIkiHileWidget';

const fadeUpItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// Arabic display normalizer
// Strips Uthmani recitation marks (waqf, end-of-ayah, asar) that fall back
// to tofu in KFGQPC outside the ReadingMode tajweed pipeline. Keeps standard
// harakat (U+064B–U+0652), maddah (U+0653), dagger alef (U+0670).
// ─────────────────────────────────────────────
function normalizeAr(s) {
  if (!s) return '';
  return s
    .replace(/\u06EA/g, '\u0650')                                  // asar → kasra
    .replace(/[\u06D6-\u06DC]/g, '')                              // small high marks (waqf etc.)
    .replace(/[\u06DD\u06DE]/g, '')                                // end-of-ayah, rub el hizb
    // eslint-disable-next-line no-misleading-character-class -- Arabic combining marks intentionally stripped via escape sequence; see CLAUDE.md section 13.15.
    .replace(/[\u06E0\u06E2-\u06E4\u06E7-\u06E9\u06EB-\u06ED]/g, '') // misc Uthmani marks
    .replace(/\u0671/g, '\u0627')                                  // alef wasla → alef
    .replace(/\u06CC/g, '\u064A');                                 // farsi yeh → arabic yeh
}

// ─────────────────────────────────────────────
// DATA — 7 anlatım, Mushaf sırasında
// Arapça metinler verse-graph-bgem3.json'dan birebir doğrulanmıştır.
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 7 Çapraz Anlatım Gözlemi
// Her karta `groups` eklendi — her grup başlıklı bir chip seti.
// chip.muted === true: mat / soluk render (yokluk veya nüans).
// ─────────────────────────────────────────────
export default function IblisSatan({ onClose }) {
  const { t, language } = useLanguage();
  const lang = language;
  const passageRefs = useRef({});
  const [openIdx, setOpenIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape closes overlay (per CLAUDE.md §13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const stats = [
    { ...t('iblisSatan.stats.surahs'),  color: COLORS.gold },
    { ...t('iblisSatan.stats.longest'), color: COLORS.softEmerald },
    { ...t('iblisSatan.stats.shortest'), color: COLORS.silver },
    { ...t('iblisSatan.stats.fireClay'), color: COLORS.softRed },
  ];

  // Tolerant lookup so 'Tâhâ' / 'Tâ-Hâ' both match. Used by ref chips
  // to scroll-to + auto-open the relevant passage card.
  const openPassageBySurah = (surahName) => {
    const strip = (s) => (s || '').replace(/[\s\-']/g, '').toLowerCase();
    const target = strip(surahName);
    const idx = PASSAGES.findIndex(p => strip(p.surahName) === target);
    if (idx < 0) return;
    setOpenIdx(idx);
    const id = PASSAGES[idx].id;
    setTimeout(() => {
      passageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          /* Stylized flame — İblis was created from nâr (Hicr 15:27, Sâd 38:76).
             Replaces previous horned-skull motif (deemed unfitting). */
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5c1.6 3.2 4.8 5.4 4.8 9.4 0 3.6-2.4 6.6-4.8 6.6s-4.8-3-4.8-6.6c0-1.8 0.7-3 1.6-4.1" />
            <path d="M12 8c0.9 1.7 2.6 2.9 2.6 5.1 0 1.9-1.3 3.5-2.6 3.5s-2.6-1.6-2.6-3.5c0-1 0.4-1.6 0.9-2.2" />
          </svg>
        }
        titleTr="İblîs & Şeytan"
        titleEn="Iblis & Satan"
        subtitleTr="Yedi sûrede aynı sahne · ateşten reddediş"
        subtitleEn="Same scene in seven surahs · refusal from fire"
        language={language}
      />

      {/* ─── Scrollable Body ─────────────────────────────── */}
      <div style={{
        flex: 1,
        padding: isMobile ? '24px 16px 60px' : '40px 60px 80px',
      }}>

      {/* ─── Hero region wrapper (additive — layers HeroGeometricBackground) ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroGeometricBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ─── Bismillah ornament — Amiri Quran ligature ───── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        dir="rtl" lang="ar" aria-label="Bismillāh"
        style={{
          textAlign: 'center',
          fontFamily: FONTS.bismillah,
          fontSize: isMobile ? '1.5rem' : '1.95rem',
          color: COLORS.gold,
          opacity: 0.82,
          lineHeight: 1,
          marginBottom: isMobile ? '28px' : '40px',
          textShadow: `0 0 22px ${COLORS.gold}28`,
        }}
      >
        ﷽
      </motion.div>

      {/* ─── Eyebrow: BÜYÜK REDDEDİŞ — ÇEKİRDEK ANLATIM ─── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          textAlign: 'center',
          fontSize: '0.68rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontWeight: 700,
          opacity: 0.72,
          marginBottom: '18px',
        }}
      >
        {t('iblisSatan.subBlockLabel')} · {t('iblisSatan.anchorVerseTitle')}
      </motion.div>

      {/* ─── Anchor verse (Bakara 2:34) — Cinematic Hero pattern ───── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        dir="rtl" lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)',
          color: COLORS.gold,
          lineHeight: 2.1,
          margin: '0 auto 16px',
          maxWidth: '820px',
          textAlign: 'center',
          textShadow: `0 0 20px ${COLORS.gold}1c`,
        }}
      >
        {normalizeAr(t('iblisSatan.anchorVerseAr'))}
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
          lineHeight: 1.7,
          margin: '0 auto 8px',
          maxWidth: '680px',
          textAlign: 'center',
          opacity: 0.95,
        }}
      >
        "{t('iblisSatan.anchorVerseTr')}"
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 28px',
          textAlign: 'center',
          opacity: 0.65,
        }}
      >
        — {t('iblisSatan.anchorVerseRef')}
      </motion.p>

      {/* ─── Anahtar Fiiller (key verbs callout) — compact ──── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          textAlign: 'center',
          padding: isMobile ? '14px 16px' : '16px 24px',
          background: COLORS.goldAlpha04,
          border: `1px solid ${COLORS.goldAlpha15}`,
          borderRadius: RADIUS.md,
          maxWidth: '720px',
          margin: '0 auto 36px',
        }}
      >
        <div style={{
          fontSize: '0.6rem', color: COLORS.gold, opacity: 0.65,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700,
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Anahtar Fiiller' : 'Key Verbs'}
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isMobile ? '6px 12px' : '8px 18px',
        }}>
          {[
            { ar: 'ebā',                  tr: 'yüz çevirdi',      en: 'refused' },
            { ar: 'istekbera',            tr: 'büyüklendi',       en: 'grew arrogant' },
            { ar: "kāne mine'l-kāfirīn",  tr: 'kâfirlerden oldu', en: 'became of the disbelievers' },
          ].map((v, i, arr) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'baseline', gap: '6px',
              fontFamily: FONTS.body, fontSize: isMobile ? '0.78rem' : '0.85rem',
            }}>
              <span style={{ color: COLORS.gold, fontWeight: 600 }}>{v.ar}</span>
              <span style={{ color: COLORS.silver, opacity: 0.85 }}>
                ({language === 'tr' ? v.tr : v.en})
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: COLORS.silver, opacity: 0.4, marginLeft: '4px' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ─── Framing whisper ───────────────────────────── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
          lineHeight: 1.7,
          margin: '0 auto 40px',
          maxWidth: '700px',
          textAlign: 'center',
          opacity: 0.88,
        }}
      >
        {language === 'tr'
          ? <>Tek bir sahne, <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>yedi farklı sûrede</em> yedi farklı kameradan anlatıldı. Her anlatımda <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>başka bir ayrıntı</em> öne çıkar.</>
          : <>One scene, retold across <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>seven surahs</em> from seven angles. Each retelling foregrounds <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>a different detail</em>.</>}
      </motion.p>

      {/* ─── Filigree divider ──────────────────────────── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        aria-hidden="true"
        style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
          margin: '0 auto 36px',
        }}
      />
        </div>
      </div>
      {/* ─── End Hero region wrapper ─────────────────────── */}

      {/* ─── Header (in-body) ───────────────────────────── */}
      {/* 7-Marker Preview: her nokta = bir sûrenin accent rengi.
          Aşağıdaki passage kartlarında aynı renk başlık olarak görünür —
          okuyucu sûreye geldiğinde rengi tanır. Sûre adları isim-renk
          eşlemesini açıkça verir, ezbere bakılmaz. */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-4"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {[
            { name: 'Bakara', color: COLORS.silver },
            { name: "A'râf",  color: COLORS.softRed },
            { name: 'Hicr',   color: COLORS.softEmerald },
            { name: 'İsrâ',   color: COLORS.coral },
            { name: 'Kehf',   color: COLORS.violet },
            { name: 'Tâhâ',   color: COLORS.skyBlue },
            { name: 'Sâd',    color: COLORS.gold },
          ].map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5"
              style={{ fontFamily: FONTS.body, fontSize: '0.7rem' }}
            >
              <span
                style={{
                  width: '7px', height: '7px', borderRadius: RADIUS.full,
                  background: s.color, opacity: 0.85,
                  boxShadow: `0 0 5px ${s.color}66`,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: COLORS.silver, opacity: 0.7, letterSpacing: '0.04em' }}>
                {s.name}
              </span>
            </span>
          ))}
        </div>
        <div style={{
          marginTop: '6px',
          color: COLORS.silver, opacity: 0.4,
          fontSize: '0.6rem', letterSpacing: '0.18em',
          fontFamily: FONTS.body, textTransform: 'uppercase',
        }}>
          {language === 'tr'
            ? 'Her renk bir sûre · aşağıdaki kartlarda aynı renk başlık olarak görünür'
            : 'Each color = one surah · the same color reappears as the section heading below'}
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.badge')}
        </span>
      </motion.div>

      <motion.h2
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-3 max-w-4xl"
      >
        {t('iblisSatan.title')}
      </motion.h2>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-gold/80 text-base md:text-lg italic font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.subtitle')}
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('iblisSatan.intro')}
      </motion.p>

      {/* ─── Stats Banner ────────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-5">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.statsTitle')}
        </span>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-20"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          borderTop: `1px solid ${COLORS.goldAlpha25}`,
          borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        }}
      >
        {stats.map((s, i) => {
          const isLastCol = isMobile ? (i % 2 === 1) : (i === stats.length - 1);
          const isBottomRow = isMobile ? i >= 2 : true;
          return (
            <div
              key={i}
              style={{
                padding: isMobile ? '22px 16px' : '28px 28px',
                borderRight: isLastCol ? 'none' : `1px solid ${COLORS.goldAlpha15}`,
                borderTop: isMobile && isBottomRow && i >= 2 ? `1px solid ${COLORS.goldAlpha15}` : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: '0.62rem',
                color: COLORS.gold, opacity: 0.65,
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '2.2rem' : '3rem',
                fontWeight: 700, lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: COLORS.silver,
                fontFamily: FONTS.body,
                lineHeight: 1.5,
              }}>
                {s.desc}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ─── 7 Surah Cards ──────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.passagesTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-6 max-w-3xl"
      >
        {t('iblisSatan.passagesIntro')}
      </motion.p>

      {/* Quick-nav chip strip — click jumps to surah card */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="flex flex-wrap gap-2 mb-10"
      >
        {PASSAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => passageRefs.current[p.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px',
              borderRadius: RADIUS.pill,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              color: COLORS.offWhite,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLORS.goldAlpha15;
              e.currentTarget.style.borderColor = COLORS.goldAlpha45;
              e.currentTarget.style.color = COLORS.gold;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = COLORS.goldAlpha25;
              e.currentTarget.style.color = COLORS.offWhite;
            }}
          >
            <span style={{
              fontSize: '0.7rem', color: COLORS.silver, opacity: 0.7,
              fontFamily: FONTS.body, fontWeight: 700,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{p.surahName}</span>
          </button>
        ))}
      </motion.div>

      <div className="space-y-3 mb-20">
        {PASSAGES.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div
              key={p.id}
              ref={(el) => { passageRefs.current[p.id] = el; }}
              initial="hidden" animate="visible" variants={fadeUpItem}
              style={{
                background: isOpen ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                borderLeft: `2px solid ${isOpen ? p.accent : `${p.accent}55`}`,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                transition: 'background 0.2s, border-color 0.2s',
                scrollMarginTop: '20px',
              }}
            >
              {/* Clickable header */}
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: isMobile ? '14px' : '20px',
                  padding: isMobile ? '16px 18px' : '20px 24px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                {/* Index — minimalist, no border */}
                <span style={{
                  flexShrink: 0,
                  fontFamily: FONTS.body,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: isOpen ? p.accent : COLORS.silver,
                  opacity: isOpen ? 1 : 0.55,
                  width: '22px',
                  transition: 'all 0.2s',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title block */}
                <div className="flex-1 min-w-0">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: isMobile ? '1.05rem' : '1.2rem',
                      color: COLORS.offWhite,
                      letterSpacing: '0.005em',
                    }}>
                      {p.surahName}
                    </span>
                    <span style={{
                      color: COLORS.silver, opacity: 0.65,
                      fontSize: '0.78rem',
                      fontFamily: FONTS.body,
                      letterSpacing: '0.04em',
                    }}>
                      {p.verseRange}
                    </span>
                    <span style={{
                      color: p.accent, opacity: 0.95,
                      fontSize: '0.7rem',
                      fontFamily: FONTS.body, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                    }}>
                      {lang === 'tr' ? p.distinctTr : p.distinctEn}
                    </span>
                  </div>
                  {!isOpen && (
                    <p style={{
                      color: COLORS.silver, opacity: 0.75,
                      fontSize: '0.84rem', fontFamily: FONTS.body,
                      lineHeight: 1.55,
                      margin: '6px 0 0',
                    }}>
                      {lang === 'tr' ? p.teaserTr : p.teaserEn}
                    </p>
                  )}
                </div>

                {/* Chevron — rotates on open */}
                <span style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px',
                  color: isOpen ? COLORS.gold : COLORS.silver,
                  opacity: isOpen ? 0.9 : 0.5,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease, color 0.2s, opacity 0.2s',
                }} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="space-y-7"
                      style={{
                        padding: isMobile ? '0 18px 22px' : '4px 24px 28px',
                        marginLeft: isMobile ? '0' : '42px',
                      }}
                    >
                      {/* Teaser line at top of expanded body (since hidden in header when open) */}
                      <p style={{
                        color: COLORS.silver, opacity: 0.85,
                        fontSize: '0.92rem', fontFamily: FONTS.body,
                        lineHeight: 1.65, fontStyle: 'italic',
                        margin: 0,
                        paddingBottom: '4px',
                      }}>
                        {lang === 'tr' ? p.teaserTr : p.teaserEn}
                      </p>

                      <div style={{
                        height: '1px',
                        background: `linear-gradient(to right, ${COLORS.goldAlpha25}, transparent)`,
                      }} />

                      {/* Arabic + translation */}
                      <div className="space-y-4">
                        <p
                          dir="rtl" lang="ar"
                          style={{
                            fontFamily: FONTS.quran,
                            fontSize: isMobile ? '1.5rem' : '1.9rem',
                            lineHeight: 2,
                            color: COLORS.gold,
                            textAlign: 'right',
                            margin: 0,
                          }}>
                          {normalizeAr(p.arabic)}
                        </p>
                        {p.arabicSecondary && (
                          <p
                            dir="rtl" lang="ar"
                            style={{
                              fontFamily: FONTS.quran,
                              fontSize: isMobile ? '1.4rem' : '1.7rem',
                              lineHeight: 2,
                              color: COLORS.gold,
                              textAlign: 'right',
                              margin: 0,
                              opacity: 0.92,
                            }}>
                            {normalizeAr(p.arabicSecondary)}
                          </p>
                        )}
                        <p
                          className="font-body italic leading-relaxed whitespace-pre-wrap"
                          style={{
                            color: COLORS.silver, fontSize: '0.92rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.translationTr : p.translationEn}
                        </p>
                        <p style={{
                          color: COLORS.gold, fontSize: '0.76rem',
                          fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.06em', margin: 0,
                        }}>
                          — {lang === 'tr' ? p.referenceTr : p.referenceEn}
                        </p>
                      </div>

                      {/* Nuance */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 10px',
                        }}>
                          {lang === 'tr' ? 'Nüans' : 'Nuance'}
                        </p>
                        <p
                          className="font-body leading-relaxed"
                          style={{
                            color: 'rgba(232,230,227,0.88)',
                            fontSize: '0.95rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.nuanceTr : p.nuanceEn}
                        </p>
                      </div>

                      {/* Distinct chips */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 12px',
                        }}>
                          {lang === 'tr' ? 'Bu sûreye özgü' : 'Distinct in this surah'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {p.chips.map((chip, ci) => (
                            <span
                              key={ci}
                              style={{
                                padding: '5px 14px',
                                borderRadius: RADIUS.pill,
                                fontSize: '0.74rem',
                                fontFamily: FONTS.body,
                                fontWeight: chip.unique ? 700 : 500,
                                background: chip.unique ? COLORS.goldAlpha15 : 'rgba(148,163,184,0.08)',
                                border: `1px solid ${chip.unique ? COLORS.goldAlpha45 : 'rgba(148,163,184,0.18)'}`,
                                color: chip.unique ? COLORS.gold : COLORS.silver,
                              }}
                            >
                              {lang === 'tr' ? chip.tr : chip.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Cross-tellings observations ─────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.observationsTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.observationsIntro')}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {OBSERVATIONS.map((obs) => (
          <motion.div
            key={obs.id}
            initial="hidden" animate="visible" variants={fadeUpItem}
            style={{
              padding: '22px 24px',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md,
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {/* Top row: stat badge + label + body */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{
                flexShrink: 0,
                minWidth: '70px', maxWidth: '90px',
                textAlign: 'center',
                padding: '10px 8px',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha45}`,
                borderRadius: RADIUS.md,
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: '1.05rem', fontWeight: 700,
                  color: COLORS.gold, lineHeight: 1.1,
                }}>
                  {obs.statValue}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 style={{
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem', marginBottom: '6px',
                }}>
                  {lang === 'tr' ? obs.labelTr : obs.labelEn}
                </h4>
                <p className="text-silver text-sm font-body leading-relaxed">
                  {lang === 'tr' ? obs.bodyTr : obs.bodyEn}
                </p>
              </div>
            </div>

            {/* Ref chip groups */}
            {obs.groups && obs.groups.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                paddingTop: '14px',
                borderTop: `1px solid ${COLORS.goldAlpha15}`,
              }}>
                {obs.groups.map((g, gi) => (
                  <div key={gi} style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      color: COLORS.gold, opacity: 0.7,
                      fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
                      letterSpacing: '0.18em',
                      minWidth: '92px',
                    }}>
                      {lang === 'tr' ? g.labelTr : g.labelEn}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {g.chips.map((chip, ci) => {
                        const tag = lang === 'tr' ? chip.tag : (chip.tagEn || chip.tag);
                        const baseBg = chip.muted ? 'rgba(148,163,184,0.06)' : 'rgba(212,165,116,0.08)';
                        const baseBorder = chip.muted ? 'rgba(148,163,184,0.18)' : COLORS.goldAlpha25;
                        const hoverBg = chip.muted ? 'rgba(148,163,184,0.14)' : COLORS.goldAlpha15;
                        const hoverBorder = chip.muted ? 'rgba(148,163,184,0.32)' : COLORS.goldAlpha45;
                        return (
                          <button
                            key={ci}
                            onClick={() => openPassageBySurah(chip.surah)}
                            title={lang === 'tr' ? `${chip.surah} ${chip.verse} kartını aç` : `Open ${chip.surah} ${chip.verse} card`}
                            style={{
                              display: 'inline-flex', alignItems: 'baseline', gap: '6px',
                              padding: '4px 10px',
                              borderRadius: RADIUS.pill,
                              fontSize: '0.72rem',
                              fontFamily: FONTS.body, fontWeight: 600,
                              background: baseBg,
                              border: `1px solid ${baseBorder}`,
                              color: chip.muted ? COLORS.silver : COLORS.offWhite,
                              opacity: chip.muted ? 0.65 : 1,
                              cursor: 'pointer',
                              transition: 'background 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = hoverBg;
                              e.currentTarget.style.borderColor = hoverBorder;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = baseBg;
                              e.currentTarget.style.borderColor = baseBorder;
                            }}
                          >
                            <span style={{ color: chip.muted ? COLORS.silver : COLORS.gold }}>
                              {chip.surah}
                            </span>
                            <span style={{
                              fontSize: '0.66rem', opacity: 0.75,
                              letterSpacing: '0.02em',
                            }}>
                              {chip.verse}
                            </span>
                            {tag && (
                              <span style={{
                                fontSize: '0.62rem',
                                color: COLORS.silver, opacity: 0.7,
                                marginLeft: '2px',
                              }}>
                                · {tag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── Closing ─────────────────────────────────────── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-off-white/85 text-lg leading-relaxed italic max-w-3xl"
      >
        {t('iblisSatan.closing')}
      </motion.p>

      {/* ═══ VESVESE KANALI WIDGET (Dalga 3.3) ═══ */}
      <VesveseKanaliWidget language={language} isMobile={isMobile} />

      {/* ═══ 12 HİLE / VESVESE MEKANİZMASI WIDGET ═══ */}
      <OnIkiHileWidget language={language} isMobile={isMobile} />

      {/* ─── Klasik Kaynaklar ─────────────────────────────── */}
      <SourcesCitation
        language={language}
        isMobile={isMobile}
        sources={[
          { author: 'er-Râzî',                  workTr: 'Mefâtîhu\'l-Ğayb',           workEn: 'Mafātīḥ al-Ghayb',           period: '1149–1209 (Rey)',     noteTr: 'A\'râf 7:12 ateş-çamur diyaloğunun kelâmî analizi.',           noteEn: 'Kalāmic analysis of the fire-clay dialogue in Aʿrāf 7:12.' },
          { author: 'et-Taberî',                workTr: 'Câmiu\'l-Beyân',              workEn: 'Jāmiʿ al-Bayān',             period: '839–923 (Âmûl)',      noteTr: '7 sûrenin karşılaştırmalı tefsiri — İblis kıssasının ayrıntıları.', noteEn: 'Comparative commentary on the 7 surahs — details of the Iblis narrative.' },
          { author: 'el-Mâturîdî',              workTr: 'Te\'vîlâtu\'l-Kur\'ân',       workEn: 'Taʾwīlāt al-Qurʾān',         period: '853–944 (Semerkand)', noteTr: 'İblis\'in cin kimliği (Kehf 18:50) — yaratılış ve isyân ilişkisi.', noteEn: 'Iblis\'s jinn identity (Kahf 18:50) — creation and rebellion.' },
          { author: 'İbn Kayyim el-Cevziyye',   workTr: 'İğâsetü\'l-Lehfân',           workEn: 'Ighāthat al-Lahfān',         period: '1292–1350 (Şâm)',     noteTr: 'Şeytan\'ın hile yöntemleri — Kur\'an ve hadis kaynaklı tipoloji.',  noteEn: 'Satan\'s methods of deception — typology from Qurʾan and ḥadīth.' },
        ]}
      />

      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefis Mertebeleri', titleEn: 'Stations of the Self', descTr: 'İç yolun haritası — nefs-i emmâreden mutmainneye.', descEn: 'Map of the inner path — from the commanding self to the tranquil.' },
          { href: `/${language}/atlas/munafik`, titleTr: 'Münâfık Profili', titleEn: 'The Hypocrite Profile', descTr: "İblis'in insan yüzü.", descEn: "Iblis's human face." },
          { href: `/${language}/atlas/insan-psikolojisi`, titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'İçsel ekosistem — kalp, nefs, kalp gözü.', descEn: "Inner ecosystem — heart, self, heart's eye." },
        ]}
      />
      </div>
    </div>
  );
}

