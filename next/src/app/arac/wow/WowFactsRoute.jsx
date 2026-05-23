'use client';

import { useRouter } from 'next/navigation';
import WowFacts from '@/components/WowFacts';

export default function WowFactsRoute() {
  const router = useRouter();
  return <WowFacts onClose={() => router.back()} />;
}
