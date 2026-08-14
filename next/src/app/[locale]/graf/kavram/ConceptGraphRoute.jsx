'use client';

import { useRouter, useParams } from 'next/navigation';
import ConceptGraph from '@/components/ConceptGraph';
import { closeToPrevious } from '@/lib/navOrigin';

export default function ConceptGraphRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <ConceptGraph onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
