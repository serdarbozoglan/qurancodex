// ─── SurahPagination — Server Component — Faz 7.8 ──────────────────────────
// Renders sr-only <nav> with prev/next/home links for the surah page.
// Reading mode is a fixed inset:0 overlay that covers the page, so this nav
// is visually hidden via standard sr-only clip rules. It still exists in the
// HTML — Google's crawler reads it as an internal-linking signal, and screen
// readers expose it as supplemental navigation.

import Link from 'next/link';
import { SURAH_NAMES_TR } from '@/lib/surahNames';

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

export default function SurahPagination({ locale, surah }) {
  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114) return null;
  const isEN = locale === 'en';
  const prev = s > 1 ? s - 1 : null;
  const next = s < 114 ? s + 1 : null;
  const prevName = prev ? SURAH_NAMES_TR[prev - 1] : null;
  const nextName = next ? SURAH_NAMES_TR[next - 1] : null;
  const currentName = SURAH_NAMES_TR[s - 1];

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
