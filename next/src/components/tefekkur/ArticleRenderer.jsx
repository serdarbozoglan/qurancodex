'use client';

import { COLORS, FONTS, RADIUS } from '../../tokens';
import VerseInline from './VerseInline';
import PullQuote from './PullQuote';

// ArticleRenderer — iterates blocks from JSON content and renders each via
// the appropriate inline component. Block-based content model — extensible
// (add new block types by adding a case to renderBlock).

function Paragraph({ tr: trText, en: enText, language }) {
  const tr = language === 'tr';
  const text = tr ? trText : enText;
  // Split paragraphs by \n\n, render markdown-light **bold**
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} style={{
          margin: '0 0 18px',
          fontSize: '1.05rem',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          lineHeight: 1.85,
        }}>
          {renderInlineMarkdown(para)}
        </p>
      ))}
    </>
  );
}

// Tiny markdown: **bold** + line breaks
function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: COLORS.gold, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    // Handle line breaks within a paragraph
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

function SectionHeading({ titleTr, titleEn, id, language }) {
  const tr = language === 'tr';
  return (
    <div id={id} style={{
      margin: '36px 0 18px',
      display: 'flex', alignItems: 'center', gap: '14px',
      scrollMarginTop: '80px',
    }}>
      <div style={{
        width: '4px', height: '20px',
        background: COLORS.gold,
        borderRadius: '2px',
        boxShadow: `0 0 12px ${COLORS.gold}aa`,
        flexShrink: 0,
      }} />
      <h2 style={{
        margin: 0,
        fontFamily: FONTS.display,
        fontSize: '1.5rem',
        fontWeight: 700,
        color: COLORS.offWhite,
        lineHeight: 1.3,
      }}>
        {tr ? titleTr : titleEn}
      </h2>
    </div>
  );
}

function SourcesBlock({ items, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      marginTop: '20px',
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.022)',
      border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
      borderRadius: RADIUS.md,
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: '8px 0',
          borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          display: 'flex', alignItems: 'baseline', gap: '12px',
        }}>
          <div style={{
            width: '4px', height: '4px', borderRadius: '50%',
            background: COLORS.gold, opacity: 0.6, flexShrink: 0, alignSelf: 'center',
          }} />
          <span style={{
            fontSize: '0.9rem', fontWeight: 700,
            color: COLORS.offWhite, fontFamily: FONTS.body,
            minWidth: '180px', flexShrink: 0,
          }}>
            {item.name}
          </span>
          <span style={{
            fontSize: '0.82rem', color: COLORS.silver,
            fontFamily: FONTS.body, fontStyle: 'italic',
            lineHeight: 1.55,
          }}>
            {tr ? item.detailTr : item.detailEn}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderBlock(block, idx, language) {
  switch (block.type) {
    case 'section':
      return <SectionHeading key={idx} {...block} language={language} />;
    case 'paragraph':
      return <Paragraph key={idx} {...block} language={language} />;
    case 'verseInline':
      return <VerseInline key={idx} {...block} language={language} />;
    case 'pullQuote':
      return <PullQuote key={idx} {...block} language={language} />;
    case 'sources':
      return <SourcesBlock key={idx} {...block} language={language} />;
    default:
      return null;
  }
}

export default function ArticleRenderer({ blocks, language }) {
  return (
    <article style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '0 4px',
    }}>
      {blocks.map((block, idx) => renderBlock(block, idx, language))}
    </article>
  );
}
