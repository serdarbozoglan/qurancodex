'use client';

import { useRouter, useParams } from 'next/navigation';
import QuranCommands from '@/components/QuranCommands';
import { closeToPrevious } from '@/lib/navOrigin';

export default function QuranCommandsRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <QuranCommands onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
