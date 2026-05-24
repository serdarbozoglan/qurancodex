'use client';

import { useRouter } from 'next/navigation';
import ZamanBoyutlari from '@/components/ZamanBoyutlari';

export default function ZamanBoyutlariRoute() {
  const router = useRouter();
  return <ZamanBoyutlari onClose={() => router.back()} />;
}
