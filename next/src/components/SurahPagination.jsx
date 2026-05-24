// ─── SurahPagination — Server Component — Faz 7.8 / W20-Ö6 ──────────────────
// Renders prev/next/home surah navigation. Dual-purpose:
//   srOnly={true}  (default) → visually hidden <nav> for SEO + screen readers.
//     Reading mode is a fixed inset:0 overlay that covers the page, so the
//     visible variant would be hidden anyway — this preserves the existing
//     internal-linking signal for Google's crawler.
//   srOnly={false}           → visible "Önceki / Sonraki" bands (glassmorphism
//     two-column row, mobile stack). Used when host route opts in via page.js.

import Link from 'next/link';
import { SURAH_NAMES_TR } from '@/lib/surahNames';
import { COLORS, FONTS } from '../tokens';

const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

// Visible variant ─ glassmorphism container styles
const VISIBLE_NAV = {
  background:     COLORS.glassBgFaint,
  border:         `1px solid ${COLORS.glassBorderSoft}`,
  borderRadius:   '12px',
  padding:        '16px 20px',
  margin:         '24px auto',
  maxWidth:       '880px',
  display:        'grid',
  gridTemplateColumns: '1fr 1fr',
  gap:            '12px',
  fontFamily:     FONTS.body,
};

// Mobile stack (single column) — applied via media query in <style> below.
// Inline styles can't host @media, so we inject a small <style> block.
const RESPONSIVE_CSS = `
  @media (max-width: 640px) {
    .qcx-surah-pagination {
      grid-template-columns: 1fr !important;
      padding: 12px 14px !important;
    }
  }
  .qcx-surah-pagination-link {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: ${COLORS.silver};
    transition: background 0.15s, color 0.15s;
  }
  .qcx-surah-pagination-link:hover {
    background: rgba(255,255,255,0.04);
    color: ${COLORS.gold};
  }
  .qcx-surah-pagination-link.is-next {
    align-items: flex-end;
    text-align: right;
  }
  .qcx-surah-pagination-label {
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${COLORS.silver};
    opacity: 0.75;
  }
  .qcx-surah-pagination-title {
    font-size: 1rem;
    font-weight: 600;
    color: ${COLORS.offWhite};
  }
  .qcx-surah-pagination-link:hover .qcx-surah-pagination-title {
    color: ${COLORS.gold};
  }
  .qcx-surah-pagination-arrow {
    color: ${COLORS.gold};
    margin-right: 6px;
  }
  .qcx-surah-pagination-arrow.is-next {
    margin-right: 0;
    margin-left: 6px;
  }
`;

export default function SurahPagination({ locale, surah, srOnly = true }) {
  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114) return null;
  const isEN = locale === 'en';
  const prev = s > 1 ? s - 1 : null;
  const next = s < 114 ? s + 1 : null;
  const prevName = prev ? SURAH_NAMES_TR[prev - 1] : null;
  const nextName = next ? SURAH_NAMES_TR[next - 1] : null;
  const currentName = SURAH_NAMES_TR[s - 1];

  // ── SEO / sr-only variant (default) ────────────────────────────────────
  if (srOnly) {
    return (
      <nav
        aria-label={isEN ? 'Surah pagination' : 'Sure gezinimi'}
        style={SR_ONLY}
      >
        <ul>
          {prev && (
            <li>
              <Link href={`/${locale}/oku/${prev}`} rel="prev">
                {isEN
                  ? `Read previous surah: ${prevName} (Surah ${prev})`
                  : `Önceki sureyi oku: ${prevName} (Sure ${prev})`}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link href={`/${locale}/oku/${next}`} rel="next">
                {isEN
                  ? `Read next surah: ${nextName} (Surah ${next})`
                  : `Sonraki sureyi oku: ${nextName} (Sure ${next})`}
              </Link>
            </li>
          )}
          <li>
            <Link href={`/${locale}`}>
              {isEN
                ? `Back to home — leave ${currentName}`
                : `Ana sayfaya dön — ${currentName} suresinden çık`}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  // ── Visible variant ────────────────────────────────────────────────────
  const prevLabel = isEN ? 'Previous' : 'Önceki';
  const nextLabel = isEN ? 'Next'     : 'Sonraki';
  const surahWord = isEN ? 'Surah'    : 'Sure';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
      <nav
        aria-label={isEN ? 'Surah pagination' : 'Sure gezinimi'}
        className="qcx-surah-pagination"
        style={VISIBLE_NAV}
      >
        {prev ? (
          <Link
            href={`/${locale}/oku/${prev}`}
            rel="prev"
            className="qcx-surah-pagination-link"
          >
            <span className="qcx-surah-pagination-label">
              <span className="qcx-surah-pagination-arrow">&larr;</span>
              {prevLabel}
            </span>
            <span className="qcx-surah-pagination-title">
              {prevName} <span style={{ color: COLORS.silver, fontWeight: 400 }}>({surahWord} {prev})</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${locale}/oku/${next}`}
            rel="next"
            className="qcx-surah-pagination-link is-next"
          >
            <span className="qcx-surah-pagination-label">
              {nextLabel}
              <span className="qcx-surah-pagination-arrow is-next">&rarr;</span>
            </span>
            <span className="qcx-surah-pagination-title">
              {nextName} <span style={{ color: COLORS.silver, fontWeight: 400 }}>({surahWord} {next})</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
