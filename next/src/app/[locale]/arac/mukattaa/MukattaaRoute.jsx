'use client';

import { useRouter } from 'next/navigation';
import Mukattaa from '@/components/Mukattaa';

export default function MukattaaRoute() {
  const router = useRouter();
  return <Mukattaa onClose={() => router.back()} />;
}
