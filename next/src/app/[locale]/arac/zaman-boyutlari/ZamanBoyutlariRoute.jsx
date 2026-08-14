'use client';

import { useRouter, useParams } from 'next/navigation';
import ZamanBoyutlari from '@/components/ZamanBoyutlari';
import { closeToPrevious } from '@/lib/navOrigin';

export default function ZamanBoyutlariRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <ZamanBoyutlari onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
