'use client';

import { useRouter } from 'next/navigation';
import WordHeatmap from '@/components/WordHeatmap';

export default function WordHeatmapRoute() {
  const router = useRouter();
  return <WordHeatmap onClose={() => router.back()} />;
}
