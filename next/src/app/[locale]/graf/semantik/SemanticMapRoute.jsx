'use client';

import { useRouter, useParams } from 'next/navigation';
import SemanticMap from '@/components/SemanticMap';
import { closeToPrevious } from '@/lib/navOrigin';

export default function SemanticMapRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <SemanticMap onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
