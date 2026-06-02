'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';
import VerseInline from './VerseInline';
import PullQuote from './PullQuote';
import HierarchyTree from './HierarchyTree';
import MorphologyTable from './MorphologyTable';
import FlowChain from './FlowChain';
import ContrastDuo from './ContrastDuo';
import { renderInlineMarkdown } from './inlineMarkdown';

// ArticleRenderer — iterates blocks from JSON content and renders each.
// Phase 2 enhancements: drop cap on first paragraph, framer-motion fade-up
// per block, scroll-margin for TOC anchor jumps.

function Paragraph({ tr: trText, en: enText, language, isFirst }) {
  const tr = language === 'tr';
  const text = tr ? trText : enText;
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, i) => {
        const showDropCap = isFirst && i === 0;
        const firstChar = showDropCap ? para.charAt(0) : '';
        const rest = showDropCap ? para.slice(1) : para;
        return (
          <p key={i} style={{
            margin: '0 0 20px',
            fontSize: '1.08rem',
            color: COLORS.offWhite,
            fontFamily: FONTS.body,
            lineHeight: 1.85,
          }}>
            {showDropCap && (
              <span style={{
                float: 'left',
                fontFamily: FONTS.display,
                fontSize: '3.6rem',
                lineHeight: 0.9,
                color: COLORS.gold,
                fontWeight: 800,
                marginRight: '10px',
                marginTop: '4px',
                paddingTop: '2px',
                textShadow: `0 0 18px rgba(212,165,116,0.35)`,
              }}>
                {firstChar}
              </span>
            )}
            {renderInlineMarkdown(rest)}
          </p>
        );
      })}
    </>
  );
}

function SectionHeading({ titleTr, titleEn, id, language }) {
  const tr = language === 'tr';
  return (
    <div id={id} style={{
      margin: '44px 0 22px',
      display: 'flex', alignItems: 'center', gap: '14px',
      scrollMarginTop: '120px',
    }}>
      <div style={{
        width: '4px', height: '22px',
        background: COLORS.gold,
        borderRadius: '2px',
        boxShadow: `0 0 14px ${COLORS.gold}aa`,
        flexShrink: 0,
      }} />
      <h2 style={{
        margin: 0,
        fontFamily: FONTS.display,
        fontSize: '1.55rem',
        fontWeight: 700,
        color: COLORS.offWhite,
        lineHeight: 1.3,
      }}>
        {tr ? titleTr : titleEn}
      </h2>
    </div>
  );
}

function SourcesBlock({ titleTr, titleEn, items, language }) {
  const tr = language === 'tr';
  if (!items || items.length === 0) return null;
  const heading = (tr ? titleTr : titleEn) || (tr ? 'Kaynaklar' : 'Sources');
  return (
    <div style={{
      marginTop: '20px',
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.022)',
      border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
      borderRadius: RADIUS.md,
    }}>
      <div style={{
        fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.18em',
        color: COLORS.gold, textTransform: 'uppercase',
        fontFamily: FONTS.body, marginBottom: '10px', opacity: 0.85,
      }}>
        {heading}
      </div>
      {items.map((item, i) => {
        // Support two schemas:
        //   (a) { name, detailTr, detailEn }
        //   (b) { tr, en } — single-line citation
        const hasName = item.name || item.detailTr || item.detailEn;
        const singleLine = !hasName && (item.tr || item.en);
        return (
          <div key={i} style={{
            padding: '8px 0',
            borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            display: 'flex', alignItems: 'baseline', gap: '12px',
          }}>
            <div style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: COLORS.gold, opacity: 0.6, flexShrink: 0, alignSelf: 'center',
            }} />
            {singleLine ? (
              <span style={{
                fontSize: '0.85rem',
                color: COLORS.offWhite,
                fontFamily: FONTS.body,
                lineHeight: 1.6,
                flex: 1,
              }}>
                {renderInlineMarkdown(tr ? (item.tr || item.en) : (item.en || item.tr))}
              </span>
            ) : (
              <>
                {item.name && (
                  <span style={{
                    fontSize: '0.9rem', fontWeight: 700,
                    color: COLORS.offWhite, fontFamily: FONTS.body,
                    minWidth: '180px', flexShrink: 0,
                  }}>
                    {item.name}
                  </span>
                )}
                <span style={{
                  fontSize: '0.82rem', color: COLORS.silver,
                  fontFamily: FONTS.body, fontStyle: 'italic',
                  lineHeight: 1.55,
                }}>
                  {renderInlineMarkdown(tr ? item.detailTr : item.detailEn)}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// CriticalNote — inline alternatif okuma / tartışmalı pasaj uyarısı.
// "Felsufi'nin bu yorumu klasik tefsir tartışmaları açısından nüansa muhtaç" tarzı flag.
function CriticalNote({ tr: trText, en: enText, headingTr, headingEn, language }) {
  const tr = language === 'tr';
  const heading = (tr ? headingTr : headingEn) || (tr ? 'Alternatif okuma' : 'Alternative reading');
  const body = tr ? trText : enText;
  return (
    <div style={{
      margin: '16px 0 20px',
      padding: '14px 18px 14px 20px',
      background: 'rgba(212,165,116,0.05)',
      border: '1px solid rgba(212,165,116,0.22)',
      borderLeft: `3px solid ${COLORS.gold}`,
      borderRadius: RADIUS.sm,
      display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <span aria-hidden="true" style={{
        color: COLORS.gold, fontSize: '0.95rem',
        lineHeight: 1.55, flexShrink: 0, marginTop: '1px',
      }}>✱</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.16em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.9,
        }}>
          {heading}
        </div>
        <div style={{
          fontSize: '0.85rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.7, fontStyle: 'italic',
        }}>
          {renderInlineMarkdown(body)}
        </div>
      </div>
    </div>
  );
}

function renderBlock(block, idx, language, firstParaIdx) {
  const isFirstPara = block.type === 'paragraph' && idx === firstParaIdx;
  switch (block.type) {
    case 'section':
      return <SectionHeading key={idx} {...block} language={language} />;
    case 'paragraph':
      return <Paragraph key={idx} {...block} language={language} isFirst={isFirstPara} />;
    case 'verseInline':
      return <VerseInline key={idx} {...block} language={language} />;
    case 'pullQuote':
      return <PullQuote key={idx} {...block} language={language} />;
    case 'sources':
      return <SourcesBlock key={idx} {...block} language={language} />;
    case 'hierarchyTree':
      return <HierarchyTree key={idx} {...block} language={language} />;
    case 'morphologyTable':
      return <MorphologyTable key={idx} {...block} language={language} />;
    case 'flowChain':
      return <FlowChain key={idx} {...block} language={language} />;
    case 'contrastDuo':
      return <ContrastDuo key={idx} {...block} language={language} />;
    case 'criticalNote':
      return <CriticalNote key={idx} {...block} language={language} />;
    default:
      return null;
  }
}

export default function ArticleRenderer({ blocks, language }) {
  // Drop cap only on the FIRST paragraph block in the article
  const firstParaIdx = blocks.findIndex(b => b.type === 'paragraph');
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      style={{
        margin: '0 auto',
        padding: '0 4px',
      }}
    >
      {blocks.map((block, idx) => renderBlock(block, idx, language, firstParaIdx))}
    </motion.article>
  );
}

// Export utility: extract TOC entries from blocks for sticky sidebar
export function extractToc(blocks, language) {
  return blocks
    .filter(b => b.type === 'section')
    .map(b => ({
      id: b.id,
      title: language === 'tr' ? b.titleTr : b.titleEn,
    }));
}
