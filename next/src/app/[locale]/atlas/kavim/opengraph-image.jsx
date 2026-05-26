// ─── /atlas/kavim OG Image — Faz 7.5 (tool-route-og audit P0) ────────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kavimler Atlası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'PEOPLES · ATLAS' : 'KAVIMLER · ATLAS',
    title: isEn ? 'Atlas of Quranic Peoples' : 'Kavimler Atlası',
    subtitle: isEn
      ? 'ʿĀd, Thamūd, Madyan, Sabaʾ — geography and divine patterns'
      : 'Âd, Semûd, Medyen, Sebe’ — coğrafya ve sünnetullah örüntüleri',
    glyph: 'أَقْوَام',
    accentColor: '#fb923c', // audit §4.1 — çöl/toprak turuncusu
  });
}
