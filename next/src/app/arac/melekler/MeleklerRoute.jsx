'use client';

import { useRouter } from 'next/navigation';
import Melekler from '@/components/Melekler';

export default function MeleklerRoute() {
  const router = useRouter();
  return <Melekler onClose={() => router.back()} />;
}
