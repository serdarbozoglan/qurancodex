'use client';

import { useRouter } from 'next/navigation';
import InsanYolculugu from '@/components/InsanYolculugu';

export default function InsanYolculuguRoute() {
  const router = useRouter();
  return <InsanYolculugu onClose={() => router.back()} />;
}
