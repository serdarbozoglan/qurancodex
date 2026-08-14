'use client';

import { useRouter, useParams } from 'next/navigation';
import DuaVerses from '@/components/DuaVerses';
import { closeToPrevious } from '@/lib/navOrigin';

export default function DuaVersesRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <DuaVerses onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
