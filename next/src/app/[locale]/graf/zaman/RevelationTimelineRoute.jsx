'use client';

import { useRouter } from 'next/navigation';
import RevelationTimeline from '@/components/RevelationTimeline';

export default function RevelationTimelineRoute() {
  const router = useRouter();
  return <RevelationTimeline onClose={() => router.back()} />;
}
