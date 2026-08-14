'use client';
import { useRouter, useParams } from 'next/navigation';
import Ritim from '@/components/Ritim';
import { closeToPrevious } from '@/lib/navOrigin';
export default function RitimRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <Ritim onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
