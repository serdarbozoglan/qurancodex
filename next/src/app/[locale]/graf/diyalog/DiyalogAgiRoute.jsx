'use client';

import { useRouter } from 'next/navigation';
import DiyalogAgi from '@/components/DiyalogAgi';

export default function DiyalogAgiRoute() {
  const router = useRouter();
  return <DiyalogAgi onClose={() => router.back()} />;
}
