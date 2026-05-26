// ─── /atlas/kiraat OG Image — Faz 7.5 (tool-route-og audit P0) ───────────────
import { toolOgCard } from '@/lib/og-tool-card';
import { COLORS } from '@/tokens';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kıraat Atlası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'RECITATIONS · ATLAS' : 'KIRAAT · ATLAS',
    title: isEn ? 'Atlas of Quranic Recitations' : 'Kıraat Atlası',
    subtitle: isEn
      ? 'Ten canonical recitations — Hafs, Warsh, Qalun, Duri…'
      : 'On kanonik kıraat — Hafs, Verş, Kalun, Dûrî…',
    glyph: 'قِرَاءَات',
    accentColor: COLORS.royalGold, // audit §4.1 — geleneksel altın
  });
}
