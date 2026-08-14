'use client';
import { useRouter, useParams } from 'next/navigation';
import KorumaZinciri from '@/components/KorumaZinciri';
import { closeToPrevious } from '@/lib/navOrigin';
export default function KorumaZinciriRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KorumaZinciri onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
