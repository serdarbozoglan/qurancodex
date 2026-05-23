'use client';

import { useRouter } from 'next/navigation';
import MunafikProfili from '@/components/MunafikProfili';

export default function MunafikProfiliRoute() {
  const router = useRouter();
  return <MunafikProfili onClose={() => router.back()} />;
}
