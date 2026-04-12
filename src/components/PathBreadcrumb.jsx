// ─── PathBreadcrumb ───────────────────────────────────────────────────────────
// Sticky bottom bar that appears when path mode is active. Shows:
//   - Path title + step counter "Adım 2/4"
//   - Current step label
//   - ◀ Önceki / Sonraki ▶ buttons (disabled at endpoints)
//   - Dot row indicating progress (clickable to jump)
//   - ✕ exit button
//
// Hidden entirely when no path is active (returns null).
// Doesn't lock body scroll — sits at the bottom and lets the page breathe.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { usePath } from '../contexts/PathContext';
import { COLORS, FONTS } from '../tokens';

export default function PathBreadcrumb() {
  const { language } = useLanguage();
  const {
    activePath,
    currentStep,
    currentStepIndex,
    totalSteps,
    next,
    prev,
    goToStep,
    exit,
    completePath,
    isCompleting,
  } = usePath();

  // Mobile detection — below 640px we collapse the breadcrumb:
  //   - path title hidden (only step label + counter)
  //   - prev/next buttons become icon-only (no text)
  //   - smaller gaps and padding
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Hide breadcrumb when ReadingMode is open (full-screen overlay, z-index clash)
  const [readingOpen, setReadingOpen] = useState(false);
  useEffect(() => {
    const onOpen  = () => setReadingOpen(true);
    const onClose = () => setReadingOpen(false);
    window.addEventListener('readingModeOpened', onOpen);
    window.addEventListener('readingModeClosed', onClose);
    return () => {
      window.removeEventListener('readingModeOpened', onOpen);
      window.removeEventListener('readingModeClosed', onClose);
    };
  }, []);

  const visible = !!activePath && !!currentStep && !readingOpen;
  const isFirst = currentStepIndex === 0;
  const isLast  = currentStepIndex === totalSteps - 1;

  const pathTitle  = activePath ? (language === 'tr' ? activePath.titleTr : activePath.titleEn) : '';
  const stepLabel  = currentStep ? (language === 'tr' ? currentStep.labelTr : currentStep.labelEn) : '';
  const stepLabelTr  = language === 'tr' ? 'Adım' : 'Step';
  const prevLabel    = language === 'tr' ? 'Önceki' : 'Previous';
  const nextLabel    = language === 'tr' ? 'Sonraki' : 'Next';
  const finishLabel  = language === 'tr' ? 'Yolu Tamamla' : 'Complete Path';
  const closeLabel   = language === 'tr' ? 'Yoldan çık' : 'Exit path';
  const completedMsg = language === 'tr'
    ? `${pathTitle} tamamlandı`
    : `${pathTitle} complete`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="path-breadcrumb"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="region"
          aria-label={language === 'tr' ? 'Keşif yolu navigasyonu' : 'Discovery path navigation'}
          style={{
            position: 'fixed',
            bottom: isMobile ? '12px' : '16px',
            // On mobile: pin to edges with 12px margin (avoids the
            // translateX(-50%) + viewport-width interaction that was
            // pushing the panel half off-screen on narrow viewports).
            // On desktop: centered with 720px max width.
            ...(isMobile
              ? { left: '12px', right: '12px' }
              : {
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'min(720px, calc(100vw - 32px))',
                }),
            // zIndex above OVERLAY_BASE (9999) so the breadcrumb stays
            // visible when an overlay step is active. Without this the
            // user loses path-mode navigation the moment they enter an
            // overlay like KissaAtlas / ProphetAtlas.
            zIndex: 10000,
            background: COLORS.panelBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: '14px',
            boxShadow: `0 12px 40px ${COLORS.panelShadow}`,
            padding: isMobile ? '9px 12px' : '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {isCompleting ? (
            /* Completion micro-moment — a single centered row with a check
               glyph + "<path> tamamlandı". Replaces the normal two-row UI
               for ~1.5s before the breadcrumb unmounts. No Next/Prev/Close
               controls: the user is done, any action would steal focus
               from the success cue. */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '6px 4px',
              }}
              role="status"
              aria-live="polite"
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: COLORS.goldAlpha15,
                  border: `1px solid ${COLORS.goldAlpha45}`,
                  color: COLORS.gold,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </span>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: COLORS.offWhite,
                  letterSpacing: '0.01em',
                }}
              >
                {completedMsg}
              </span>
            </div>
          ) : (
          <>
          {/* Top row: counter chip + path title · current step label + close.
              All-in-one row keeps the panel compact (~80px tall vs ~140px). */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              {/* Counter chip — gold pill, the most distinctive marker */}
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: COLORS.gold,
                  background: COLORS.goldAlpha15,
                  border: `1px solid ${COLORS.goldAlpha25}`,
                  borderRadius: '999px',
                  padding: '2px 9px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  letterSpacing: '0.04em',
                }}
              >
                {currentStepIndex + 1}/{totalSteps}
              </span>
              {/* Path title (muted) · current step label (bright, focal).
                  Path title is hidden on mobile (<640px) to save space —
                  the counter chip already conveys which path you're on. */}
              {!isMobile && (
                <>
                  <span
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.78rem',
                      color: COLORS.silverAlpha70,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {pathTitle}
                  </span>
                  <span style={{ color: COLORS.glassBorder, flexShrink: 0, fontSize: '0.7rem' }}>·</span>
                </>
              )}
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: COLORS.offWhite,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                }}
              >
                {stepLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={exit}
              aria-label={closeLabel}
              title={closeLabel}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'transparent',
                border: `1px solid ${COLORS.glassBorderSoft}`,
                color: COLORS.silver,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.glassBorder;
                e.currentTarget.style.color = COLORS.offWhite;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = COLORS.silver;
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Bottom row: prev / dots / next */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={prev}
              disabled={isFirst}
              aria-label={prevLabel}
              title={prevLabel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: isMobile ? '7px 10px' : '7px 14px',
                borderRadius: '8px',
                background: 'transparent',
                border: `1px solid ${isFirst ? COLORS.glassBorderSoft : COLORS.goldAlpha25}`,
                color: isFirst ? COLORS.silver : COLORS.gold,
                opacity: isFirst ? 0.4 : 1,
                fontFamily: FONTS.body,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: isFirst ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (isFirst) return;
                e.currentTarget.style.background = COLORS.goldAlpha04;
                e.currentTarget.style.borderColor = COLORS.goldAlpha45;
              }}
              onMouseLeave={(e) => {
                if (isFirst) return;
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = COLORS.goldAlpha25;
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {!isMobile && prevLabel}
            </button>

            {/* Dot row */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {activePath.steps.map((s, i) => {
                const active = i === currentStepIndex;
                const past = i < currentStepIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-label={`${stepLabelTr} ${i + 1}: ${language === 'tr' ? s.labelTr : s.labelEn}`}
                    title={language === 'tr' ? s.labelTr : s.labelEn}
                    style={{
                      width: active ? '20px' : '7px',
                      height: '7px',
                      borderRadius: active ? '4px' : '50%',
                      background: active ? COLORS.gold : (past ? COLORS.goldAlpha45 : COLORS.silverAlpha40),
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={isLast ? completePath : next}
              aria-label={isLast ? finishLabel : nextLabel}
              title={isLast ? finishLabel : nextLabel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: isMobile ? '7px 12px' : '7px 16px',
                borderRadius: '8px',
                background: COLORS.gold,
                border: `1px solid ${COLORS.gold}`,
                color: COLORS.inkBlack,
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: `0 0 14px ${COLORS.goldAlpha25}`,
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 22px ${COLORS.goldAlpha45}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 14px ${COLORS.goldAlpha25}`;
              }}
            >
              {/* Hide text label on mobile — keeps the button to an icon+chevron */}
              {!isMobile && (isLast ? finishLabel : nextLabel)}
              {isLast ? (
                // Check glyph — signals "finish" rather than "continue"
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
          </div>
          </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
