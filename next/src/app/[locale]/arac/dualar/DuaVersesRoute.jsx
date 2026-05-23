'use client';

import { useRouter } from 'next/navigation';
import DuaVerses from '@/components/DuaVerses';

export default function DuaVersesRoute() {
  const router = useRouter();
  return <DuaVerses onClose={() => router.back()} />;
}
