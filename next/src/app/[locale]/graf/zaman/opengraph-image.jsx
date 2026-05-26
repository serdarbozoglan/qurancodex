// ─── /graf/zaman OG Image — Faz 7.5 (tool-route-og audit P1) ────────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Nüzul Kronolojisi';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'CHRONOLOGY · GRAPH' : 'NÜZUL · GRAF',
    title: isEn ? 'Revelation Timeline' : 'Nüzul Kronolojisi',
    subtitle: isEn
      ? 'Meccan and Medinan ordering — the 23-year chronology of revelation'
      : 'Mekkî/Medenî sıralama — 23 yıllık nüzul kronolojisi',
    glyph: 'زَمَن',
    accentColor: '#c9a227', // audit §4.2 — tarihsel royal gold
  });
}
