'use client';
import { useRouter, useParams } from 'next/navigation';
import HalkaKompozisyon from '@/components/HalkaKompozisyon';
import { closeToPrevious } from '@/lib/navOrigin';
export default function HalkaKompozisyonRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <HalkaKompozisyon onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
