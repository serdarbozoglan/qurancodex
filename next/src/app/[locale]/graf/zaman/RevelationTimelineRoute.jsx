'use client';

import { useRouter, useParams } from 'next/navigation';
import RevelationTimeline from '@/components/RevelationTimeline';
import { closeToPrevious } from '@/lib/navOrigin';

export default function RevelationTimelineRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <RevelationTimeline onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
