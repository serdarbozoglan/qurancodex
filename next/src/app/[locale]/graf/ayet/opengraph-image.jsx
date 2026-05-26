// ─── /graf/ayet OG Image — Faz 7.5 (tool-route-og audit P1) ─────────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Ayet Grafiği';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'VERSE · GRAPH' : 'AYET · GRAF',
    title: isEn ? 'Verse Graph' : 'Ayet Grafiği',
    subtitle: isEn
      ? '6,236 verses on a 3D semantic similarity graph (bgem3 embeddings)'
      : '6.236 ayet — 3B semantik benzerlik grafiği (bgem3 embeddings)',
    glyph: 'آيَة',
    accentColor: '#34d399', // audit §4.2 — Kur'anî soft emerald
  });
}
