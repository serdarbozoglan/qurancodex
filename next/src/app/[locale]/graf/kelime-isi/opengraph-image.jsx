// ─── /graf/kelime-isi OG Image — Faz 7.5 (tool-route-og audit P1) ───────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kelime Isı Haritası';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'WORD HEATMAP · GRAPH' : 'KELİME ISI · GRAF',
    title: isEn ? 'Word Heatmap' : 'Kelime Isı Haritası',
    subtitle: isEn
      ? 'Surah-by-surah density of any word across the Quran'
      : "Bir kelimenin sûre-sûre yoğunluk haritası — kavramların coğrafyası",
    glyph: 'كَلِمَات',
    accentColor: '#e74c3c', // audit §4.2 — ısı haritası sıcak kırmızı
  });
}
