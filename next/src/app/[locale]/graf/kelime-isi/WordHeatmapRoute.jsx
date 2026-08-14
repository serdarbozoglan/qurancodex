'use client';

import { useRouter, useParams } from 'next/navigation';
import WordHeatmap from '@/components/WordHeatmap';
import { closeToPrevious } from '@/lib/navOrigin';

export default function WordHeatmapRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <WordHeatmap onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
