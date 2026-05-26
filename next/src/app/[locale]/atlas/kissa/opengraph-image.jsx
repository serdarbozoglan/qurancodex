// ─── /atlas/kissa OG Image — Faz 7.5 (tool-route-og audit P0) ────────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kıssa Atlası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'NARRATIVES · ATLAS' : 'KISSA · ATLAS',
    title: isEn ? 'Atlas of Quranic Narratives' : 'Kıssa Atlası',
    subtitle: isEn
      ? 'Prophet narratives across surahs — scenes, contexts, parallels'
      : 'Peygamber kıssaları — sahneler, bağlamlar, paralellikler',
    glyph: 'قَصَص',
    accentColor: '#60a5fa', // audit §4.1 — anlatı mavisi
  });
}
