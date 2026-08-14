'use client';
import { useRouter, useParams } from 'next/navigation';
import InsanTanimi from '@/components/InsanTanimi';
import { closeToPrevious } from '@/lib/navOrigin';
export default function InsanTanimiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <InsanTanimi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
