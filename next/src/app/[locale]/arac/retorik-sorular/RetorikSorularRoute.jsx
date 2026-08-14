'use client';
import { useRouter, useParams } from 'next/navigation';
import RetorikSorular from '@/components/RetorikSorular';
import { closeToPrevious } from '@/lib/navOrigin';
export default function RetorikSorularRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <RetorikSorular onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
