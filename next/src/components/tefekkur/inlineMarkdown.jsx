'use client';

// Inline markdown parser for Tefekkür content fields.
// Handles: ***bold-italic***, **bold**, *italic*, and \n line breaks.
// Bold uses gold token color; italic preserves the inherited color.
//
// Usage: {renderInlineMarkdown(text, { boldColor: COLORS.gold })}

import { COLORS } from '../../tokens';

const TOKEN_RE = /(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*?\*)/g;

export function renderInlineMarkdown(text, opts = {}) {
  if (text == null) return null;
  const boldColor = opts.boldColor || COLORS.gold;
  const parts = String(text).split(TOKEN_RE);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <strong key={i} style={{ color: boldColor, fontStyle: 'italic', fontWeight: 700 }}>
          {part.slice(3, -3)}
        </strong>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} style={{ color: boldColor, fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    // Plain text segment — strip any residual unbalanced asterisks so they
    // never leak into the rendered output.
    const clean = part.replace(/\*+/g, '');
    return clean.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}
