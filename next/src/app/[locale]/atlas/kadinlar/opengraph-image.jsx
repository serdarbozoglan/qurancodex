// ─── /atlas/kadinlar OG Image — Faz 7.5 (tool-route-og audit P0) ─────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kadınlar Atlası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'WOMEN · ATLAS' : 'KADINLAR · ATLAS',
    title: isEn ? 'Atlas of Women in the Quran' : 'Kadınlar Atlası',
    subtitle: isEn
      ? 'Mary, Asiya, Hagar, Bilqis — named and exemplified'
      : 'Meryem, Âsiye, Hâcer, Belkıs — anılan ve örnek kılınan',
    glyph: 'نِسَاء',
    accentColor: '#fbcfe8', // audit §4.1 — soft pink (Nisâ klasik refleksi)
  });
}
