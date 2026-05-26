// ─── /atlas/peygamber (list) OG Image — Faz 7.5 (tool-route-og audit P0) ─────
// Liste sayfası kartı. Bireysel peygamber kartları [id]/opengraph-image.jsx
// tarafından sağlanır; bu dosya yalnızca liste-level metadata için.

import { toolOgCard } from '@/lib/og-tool-card';
import { COLORS } from '@/tokens';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Peygamberler Atlası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'PROPHETS · ATLAS' : 'PEYGAMBERLER · ATLAS',
    title: isEn ? 'Atlas of the Prophets' : 'Peygamberler Atlası',
    subtitle: isEn
      ? '25 prophets · chronology · lineage · narrative scenes'
      : '25 peygamber · kronoloji · soy zinciri · kıssa sahneleri',
    glyph: 'أَنْبِيَاء',
    accentColor: COLORS.gold,
  });
}
