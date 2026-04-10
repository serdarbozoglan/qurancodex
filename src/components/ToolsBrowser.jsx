// ─── ToolsBrowser ─────────────────────────────────────────────────────────────
// Centered modal that lists all 16 interactive tools in a browse-friendly
// layout. Triggered by the "Tüm Araçları Gör" CTA on ToolsHighlight and the
// "Araçlar" CTA in the closing layer (ToolsShowcase).
//
// Why a modal and not the Navbar dropdown:
//   - The dropdown is a navigation tool ("go somewhere"); browsing all tools
//     is a discovery action ("scan, compare, decide"). Different intents.
//   - Dropdowns vanish on outside click and overlap underlying content.
//   - A centered modal is intentional, persistent, and doesn't fight the page.
//
// Architecture:
//   - Self-managed open state via custom event (`openToolsBrowser`).
//     Anywhere in the app can call useQuranNav.openOverlay('allTools').
//   - ESC key and backdrop click both close.
//   - Body scroll is locked while open.
//   - Clicking a tool dispatches its own overlay event AND closes this modal.
//
// Tool data is imported from src/data/tools.jsx (single source of truth shared
// with Navbar). Order changes propagate automatically to both consumers.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, CLOSE_BTN, OVERLAY_TITLE } from '../tokens';
import {
  FEATURED_TOOL,
  VIZ_TOOLS,
  ANALYSIS_TOOLS,
  RESEARCH_TOOLS,
} from '../data/tools';

// Tool data is imported from src/data/tools.jsx (see imports above).
// Each entry shape: { id, event, titleTr/En, descTr/En, descLongTr/En, icon }
// `icon` is a React component that takes a `size` prop.


// ── Component ────────────────────────────────────────────────────────────────
export default function ToolsBrowser() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Listen for the open event (dispatched by useQuranNav.openOverlay('allTools'))
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openToolsBrowser', handler);
    return () => window.removeEventListener('openToolsBrowser', handler);
  }, []);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  // Lock body scroll while open. Compensate for the disappearing scrollbar
  // by adding paddingRight equal to scrollbar width — otherwise the page
  // content shifts right (~15px), making the centered modal look off-center.
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow     = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow     = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Responsive: 1 column on mobile
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const close = () => setOpen(false);

  // Click handler for any tool: dispatch its event and close the modal
  const triggerTool = (eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        // Backdrop is also a flex centering container for the modal.
        // This avoids the framer-motion gotcha where animate={{ scale, y }}
        // overwrites a CSS `transform: translate(-50%, -50%)` and the modal
        // ends up positioned at its natural origin instead of centered.
        <motion.div
          key="tools-browser-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: COLORS.backdropDim,
            backdropFilter: 'blur(2px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Modal — flex-centered by the parent backdrop, no fixed positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-browser-title"
            style={{
              width: 'min(960px, 90vw)',
              maxHeight: '85vh',
              background: COLORS.cosmicBlack,
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: '16px',
              boxShadow: `0 20px 60px ${COLORS.backdropDim}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                flexShrink: 0,
              }}
            >
              <span id="tools-browser-title" style={OVERLAY_TITLE}>
                {language === 'tr' ? 'Tüm İnteraktif Araçlar' : 'All Interactive Tools'}
              </span>
              <button
                onClick={close}
                aria-label={language === 'tr' ? 'Kapat' : 'Close'}
                style={{ ...CLOSE_BTN }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.glassBorder;
                  e.currentTarget.style.color = COLORS.offWhite;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = CLOSE_BTN.background;
                  e.currentTarget.style.color = COLORS.silver;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — scrollable */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {/* Featured tool banner */}
              <FeaturedBanner tool={FEATURED_TOOL} onClick={() => triggerTool(FEATURED_TOOL.event)} language={language} />

              {/* 3-column tools grid (or 1-column on mobile) */}
              <div
                style={{
                  display: isMobile ? 'block' : 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <ToolColumn titleTr="Görselleştirme" titleEn="Visualization" tools={VIZ_TOOLS} onTrigger={triggerTool} language={language} />
                {!isMobile && <Divider />}
                <ToolColumn titleTr="Analiz & Veri" titleEn="Analysis & Data" tools={ANALYSIS_TOOLS} onTrigger={triggerTool} language={language} />
                {!isMobile && <Divider />}
                <ToolColumn titleTr="Araştırma & Keşif" titleEn="Research & Explore" tools={RESEARCH_TOOLS} onTrigger={triggerTool} language={language} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FeaturedBanner({ tool, onClick, language }) {
  // Imported tools.jsx exposes icon as a React component (takes `size` prop),
  // so we need to instantiate it here rather than render the field directly.
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 24px',
        background: COLORS.goldAlpha04,
        border: 'none',
        borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'background 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.goldAlpha15; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.goldAlpha04; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ color: COLORS.gold, flexShrink: 0 }}><Icon size={22} /></span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '0.92rem', fontFamily: FONTS.body, fontWeight: 600 }}>
            {language === 'tr' ? tool.titleTr : tool.titleEn}
          </span>
          <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? tool.descTr : tool.descEn}
          </span>
        </span>
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function ToolColumn({ titleTr, titleEn, tools, onTrigger, language }) {
  return (
    <div style={{ flex: 1, padding: '8px', minWidth: 0 }}>
      <div
        style={{
          color: COLORS.silverAlpha40,
          fontSize: '0.62rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          padding: '10px 12px 6px',
        }}
      >
        {language === 'tr' ? titleTr : titleEn}
      </div>
      {tools.map((t) => (
        <ToolItem key={t.event} tool={t} onClick={() => onTrigger(t.event)} language={language} />
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ width: '1px', alignSelf: 'stretch', background: COLORS.glassBorderSoft, margin: '12px 0' }} />;
}

function ToolItem({ tool, onClick, language }) {
  // Imported tools.jsx exposes icon as a React component
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        textAlign: 'left',
        padding: '9px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.querySelector('.ti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.tl').style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.querySelector('.ti').style.color = COLORS.goldAlpha45;
        e.currentTarget.querySelector('.tl').style.color = COLORS.offWhite;
      }}
    >
      <span className="ti" style={{ color: COLORS.goldAlpha45, flexShrink: 0, transition: 'color 0.15s' }}>
        <Icon size={16} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
        <span
          className="tl"
          style={{
            color: COLORS.offWhite,
            fontSize: '0.85rem',
            fontFamily: FONTS.body,
            fontWeight: 500,
            lineHeight: 1.3,
            transition: 'color 0.15s',
          }}
        >
          {language === 'tr' ? tool.titleTr : tool.titleEn}
        </span>
        <span
          style={{
            color: COLORS.silverAlpha70,
            fontSize: '0.7rem',
            fontFamily: FONTS.body,
            fontWeight: 400,
            lineHeight: 1.35,
            // No truncation — let descriptions wrap to 2 lines if needed.
            // Modal is wide enough that most one-liners fit; the few longer
            // ones get a second line instead of an ellipsis.
          }}
        >
          {language === 'tr' ? tool.descTr : tool.descEn}
        </span>
      </span>
    </button>
  );
}
