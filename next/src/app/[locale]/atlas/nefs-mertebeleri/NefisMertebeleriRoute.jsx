'use client';

import { useRouter, useParams } from 'next/navigation';
import NefisMertebeleri from '@/components/NefisMertebeleri';
import { closeToPrevious } from '@/lib/navOrigin';

export default function NefisMertebeleriRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <NefisMertebeleri onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
