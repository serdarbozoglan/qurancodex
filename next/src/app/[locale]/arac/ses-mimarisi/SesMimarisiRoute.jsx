'use client';
import { useRouter, useParams } from 'next/navigation';
import SesMimarisi from '@/components/SesMimarisi';
import { closeToPrevious } from '@/lib/navOrigin';
export default function SesMimarisiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <SesMimarisi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
