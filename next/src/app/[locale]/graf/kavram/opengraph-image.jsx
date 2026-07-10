// ─── /graf/kavram OG Image — Faz 7.5 (tool-route-og audit P1) ───────────────
import { toolOgCard } from '@/lib/og-tool-card';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Kavram Grafiği';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return toolOgCard({
    category: isEn ? 'CONCEPT · GRAPH' : 'KAVRAM · GRAF',
    title: isEn ? 'Concept Graph' : 'Kavram Grafiği',
    subtitle: isEn
      ? 'Quranic concepts — repentance, patience, faith, taqwa — as a network'
      : "Kur'an kavramları — tevbe, sabır, iman, takva — bağlantı ağı",
    glyph: 'مَفْهُوم',
    accentColor: '#a78bfa', // audit §4.2 — entelektüel mor
  });
}
