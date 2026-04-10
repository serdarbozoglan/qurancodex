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
  } = usePath();

  const visible = !!activePath && !!currentStep;
  const isFirst = currentStepIndex === 0;
  const isLast  = currentStepIndex === totalSteps - 1;

  const pathTitle  = activePath ? (language === 'tr' ? activePath.titleTr : activePath.titleEn) : '';
  const stepLabel  = currentStep ? (language === 'tr' ? currentStep.labelTr : currentStep.labelEn) : '';
  const stepLabelTr = language === 'tr' ? 'Adım' : 'Step';
  const prevLabel  = language === 'tr' ? 'Önceki' : 'Previous';
  const nextLabel  = language === 'tr' ? 'Sonraki' : 'Next';
  const closeLabel = language === 'tr' ? 'Yoldan çık' : 'Exit path';

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
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(720px, calc(100vw - 32px))',
            zIndex: 50,
            background: COLORS.panelBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: '14px',
            boxShadow: `0 12px 40px ${COLORS.panelShadow}`,
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Top row: path title + step counter + close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: COLORS.gold,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {stepLabelTr} {currentStepIndex + 1}/{totalSteps}
              </span>
              <span style={{ color: COLORS.glassBorder, flexShrink: 0 }}>•</span>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.78rem',
                  color: COLORS.silverAlpha70,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                }}
              >
                {pathTitle}
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
                width: '28px',
                height: '28px',
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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current step label — bigger, the focal point */}
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: '1.15rem',
              fontWeight: 700,
              color: COLORS.offWhite,
              lineHeight: 1.25,
            }}
          >
            {stepLabel}
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
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
              {prevLabel}
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
              onClick={next}
              disabled={isLast}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '8px',
                background: isLast ? 'transparent' : COLORS.gold,
                border: `1px solid ${isLast ? COLORS.glassBorderSoft : COLORS.gold}`,
                color: isLast ? COLORS.silver : COLORS.inkBlack,
                opacity: isLast ? 0.4 : 1,
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: isLast ? 'not-allowed' : 'pointer',
                boxShadow: isLast ? 'none' : `0 0 14px ${COLORS.goldAlpha25}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (isLast) return;
                e.currentTarget.style.boxShadow = `0 0 22px ${COLORS.goldAlpha45}`;
              }}
              onMouseLeave={(e) => {
                if (isLast) return;
                e.currentTarget.style.boxShadow = `0 0 14px ${COLORS.goldAlpha25}`;
              }}
            >
              {nextLabel}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
