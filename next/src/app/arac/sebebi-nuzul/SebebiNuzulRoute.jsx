'use client';

import { useRouter } from 'next/navigation';
import SebebiNuzul from '@/components/SebebiNuzul';

export default function SebebiNuzulRoute() {
  const router = useRouter();
  return <SebebiNuzul onClose={() => router.back()} />;
}
