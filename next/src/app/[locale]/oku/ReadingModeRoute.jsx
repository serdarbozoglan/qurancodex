'use client';

import { useRouter } from 'next/navigation';
import ReadingMode from '@/components/ReadingMode';

export default function ReadingModeRoute() {
  const router = useRouter();
  return <ReadingMode onClose={() => router.back()} />;
}
