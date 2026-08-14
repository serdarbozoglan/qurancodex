'use client';

import { useRouter, useParams } from 'next/navigation';
import YakinAnlamliNuanslar from '@/components/YakinAnlamliNuanslar';
import { closeToPrevious } from '@/lib/navOrigin';

export default function YakinAnlamliNuanslarRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <YakinAnlamliNuanslar onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
