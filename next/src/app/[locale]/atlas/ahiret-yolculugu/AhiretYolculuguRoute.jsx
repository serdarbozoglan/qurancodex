'use client';

import { useRouter } from 'next/navigation';
import AhiretYolculugu from '@/components/AhiretYolculugu';

export default function AhiretYolculuguRoute() {
  const router = useRouter();
  return <AhiretYolculugu onClose={() => router.back()} />;
}
