'use client';

// ─── ToolsBrowser ─────────────────────────────────────────────────────────────
// Centered modal that lists all 16 interactive tools in a browse-friendly
// layout. Triggered by the "Tüm Araçları Gör" CTA on ToolsHighlight and the
// "Araçlar" CTA in the closing layer (ToolsShowcase).
//
// What makes this different from the Navbar Tools dropdown:
//   - The dropdown is a navigation tool ("go somewhere") — compact, fast.
//   - This modal is a discovery experience ("scan, compare, decide") —
//     bigger cards, multi-line descriptions, category filters.
//
// Layout:
//   - Header with title + close button
//   - Filter bar: Tümü / Görselleştirme / Analiz & Veri / Araştırma & Keşif
//   - "Tümü" view: featured "Kur'an'ı Tanı" banner on top + 2-col grid of all 15
//   - Category view: just the cards from that category, no featured banner
//   - Each card: icon + title + 2-3 sentence descLong from src/data/tools.jsx
//
// Architecture:
//   - Self-managed open state via custom event ('openToolsBrowser')
//   - ESC + backdrop click both close
//   - Body scroll locked while open (with scrollbar-width compensation
//     so the centered modal doesn't visually shift left)
//   - Clicking a card dispatches its overlay event AND closes the modal
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, CLOSE_BTN, OVERLAY_TITLE, BREAKPOINT_TABLET } from '../tokens';
import {
  FEATURED_TOOL,
  VIZ_TOOLS,
  ANALYSIS_TOOLS,
  RESEARCH_TOOLS,
} from '../data/tools';

// ── Filter definitions ──────────────────────────────────────────────────────
// Each filter knows which tools to show. 'all' renders the featured banner
// + every category combined; the others render only their own category.
const FILTERS = [
  { id: 'all',      labelTr: 'Tümü',                labelEn: 'All',                 tools: null },
  { id: 'viz',      labelTr: 'Görselleştirme',      labelEn: 'Visualization',       tools: VIZ_TOOLS },
  { id: 'analysis', labelTr: 'Analiz & Veri',       labelEn: 'Analysis & Data',     tools: ANALYSIS_TOOLS },
  { id: 'research', labelTr: 'Araştırma & Keşif',   labelEn: 'Research & Explore',  tools: RESEARCH_TOOLS },
];

const ALL_TOOLS = [...VIZ_TOOLS, ...ANALYSIS_TOOLS, ...RESEARCH_TOOLS];

// ── Component ────────────────────────────────────────────────────────────────
export default function ToolsBrowser() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  // Listen for the open event (dispatched by useQuranNav.openOverlay('allTools'))
  useEffect(() => {
    const handler = () => {
      setActiveFilter('all'); // reset filter on every open
      setOpen(true);
    };
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
  // (~15px) by adding equal paddingRight on body so page content doesn't
  // shift right and make the centered modal look off-center.
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
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const close = () => setOpen(false);

  // Click handler for any tool: dispatch its event and close the modal
  const triggerTool = (eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
    setOpen(false);
  };

  // Active tool list driven by filter
  const visibleTools = activeFilter === 'all'
    ? ALL_TOOLS
    : FILTERS.find((f) => f.id === activeFilter)?.tools ?? [];

  return (
    <AnimatePresence>
      {open && (
        // Backdrop is a flex centering container — avoids the framer-motion
        // gotcha where animate={{ scale, y }} overwrites a CSS translate.
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
          {/* Modal */}
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
              width: 'min(1080px, 92vw)',
              maxHeight: '88vh',
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

            {/* Filter bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: isMobile ? '12px 16px' : '14px 24px',
                borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                flexShrink: 0,
              }}
            >
              {FILTERS.map((f) => (
                <FilterButton
                  key={f.id}
                  active={activeFilter === f.id}
                  label={language === 'tr' ? f.labelTr : f.labelEn}
                  onClick={() => setActiveFilter(f.id)}
                />
              ))}
            </div>

            {/* Body — scrollable */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {/* Featured banner — only on "Tümü" view */}
              {activeFilter === 'all' && (
                <FeaturedBanner
                  tool={FEATURED_TOOL}
                  onClick={() => triggerTool(FEATURED_TOOL.event)}
                  language={language}
                />
              )}

              {/* Card grid
                - Filtered view: a single flat grid of that category's cards
                - "Tümü" view: each category gets its own header row spanning
                  all columns, then its cards. Headers use grid-column: 1/-1
                  so they stretch across the full grid width even on desktop.
              */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  alignItems: 'stretch',
                  gap: '14px',
                  padding: '20px 24px 24px',
                }}
              >
                {activeFilter === 'all'
                  ? FILTERS.filter((f) => f.id !== 'all').flatMap((cat, catIndex) => {
                      const odd = !isMobile && cat.tools.length % 2 === 1;
                      return [
                        <CategoryHeader
                          key={`hdr-${cat.id}`}
                          label={language === 'tr' ? cat.labelTr : cat.labelEn}
                          first={catIndex === 0}
                        />,
                        ...cat.tools.map((tool, i) => (
                          <BigToolCard
                            key={tool.id}
                            tool={tool}
                            onClick={() => triggerTool(tool.event)}
                            language={language}
                            // Last card in an odd-sized category spans both
                            // columns so it doesn't sit alone in a half-row.
                            fullWidth={odd && i === cat.tools.length - 1}
                          />
                        )),
                      ];
                    })
                  : (() => {
                      // Filtered view: same orphan handling for the last card
                      const odd = !isMobile && visibleTools.length % 2 === 1;
                      return visibleTools.map((tool, i) => (
                        <BigToolCard
                          key={tool.id}
                          tool={tool}
                          onClick={() => triggerTool(tool.event)}
                          language={language}
                          fullWidth={odd && i === visibleTools.length - 1}
                        />
                      ));
                    })()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

// Category header rendered between groups in the "Tümü" view. Spans the
// full grid width via grid-column: 1 / -1 so it sits cleanly between rows
// of cards. The first header has no top divider; later ones get one.
function CategoryHeader({ label, first }) {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: first ? '0' : '14px',
        paddingTop: first ? '0' : '14px',
        borderTop: first ? 'none' : `1px solid ${COLORS.glassBorderSoft}`,
      }}
    >
      <span
        style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: '1px',
          background: `linear-gradient(to right, ${COLORS.goldAlpha25}, transparent)`,
        }}
      />
    </div>
  );
}

function FilterButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '999px',
        border: `1px solid ${active ? COLORS.goldAlpha45 : COLORS.glassBorderSoft}`,
        background: active ? COLORS.goldAlpha15 : 'transparent',
        color: active ? COLORS.gold : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.color = COLORS.offWhite;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = COLORS.silver;
      }}
    >
      {label}
    </button>
  );
}

function FeaturedBanner({ tool, onClick, language }) {
  // tools.jsx exposes icon as a React component (takes `size` prop)
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      style={{
        width: 'calc(100% - 48px)',
        margin: '20px 24px 4px',
        padding: '18px 22px',
        background: COLORS.goldAlpha04,
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha15;
        e.currentTarget.style.borderColor = COLORS.goldAlpha45;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.borderColor = COLORS.goldAlpha25;
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            color: COLORS.gold,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: COLORS.goldAlpha15,
            border: `1px solid ${COLORS.goldAlpha25}`,
          }}
        >
          <Icon size={22} />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '1rem', fontFamily: FONTS.body, fontWeight: 700 }}>
            {language === 'tr' ? tool.titleTr : tool.titleEn}
          </span>
          <span style={{ color: COLORS.silverAlpha70, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.4 }}>
            {language === 'tr' ? tool.descLongTr : tool.descLongEn}
          </span>
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '12px' }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function BigToolCard({ tool, onClick, language, fullWidth = false }) {
  // tools.jsx exposes icon as a React component
  const Icon = tool.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        // When this card is the orphan last item of an odd-sized category,
        // span both grid columns so it doesn't sit alone in a half-row.
        gridColumn: fullWidth ? '1 / -1' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '20px 20px',
        background: COLORS.glassBgFaint,
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        height: '100%', // fill the grid cell so siblings in the same row match heights
        minHeight: '170px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.borderColor = COLORS.goldAlpha45;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.querySelector('.bti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.btl').style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.glassBgFaint;
        e.currentTarget.style.borderColor = COLORS.glassBorderSoft;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.querySelector('.bti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.btl').style.color = COLORS.offWhite;
      }}
    >
      {/* Icon badge */}
      <span
        className="bti"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.goldAlpha25}`,
          color: COLORS.gold,
          flexShrink: 0,
          transition: 'color 0.2s',
        }}
      >
        <Icon size={20} />
      </span>

      {/* Title + long description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          className="btl"
          style={{
            color: COLORS.offWhite,
            fontSize: '0.98rem',
            fontFamily: FONTS.body,
            fontWeight: 700,
            lineHeight: 1.25,
            transition: 'color 0.2s',
          }}
        >
          {language === 'tr' ? tool.titleTr : tool.titleEn}
        </span>
        <span
          style={{
            color: COLORS.silverAlpha70,
            fontSize: '0.78rem',
            fontFamily: FONTS.body,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {language === 'tr' ? tool.descLongTr : tool.descLongEn}
        </span>
      </div>
    </button>
  );
}
