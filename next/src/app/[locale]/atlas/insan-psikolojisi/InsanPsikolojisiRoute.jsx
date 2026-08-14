'use client';
import { useRouter, useParams } from 'next/navigation';
import InsanPsikolojisi from '@/components/InsanPsikolojisi';
import { closeToPrevious } from '@/lib/navOrigin';
export default function InsanPsikolojisiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <InsanPsikolojisi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
