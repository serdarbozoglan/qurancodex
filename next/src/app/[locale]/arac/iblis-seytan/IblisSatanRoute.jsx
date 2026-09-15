'use client';

import { useRouter, useParams } from 'next/navigation';
import IblisSatan from '@/components/IblisSatan';
import { closeToPrevious } from '@/lib/navOrigin';

export default function IblisSatanRoute({ adlandirmaData }) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <IblisSatan onClose={() => closeToPrevious(router, `/${locale}`)} adlandirmaData={adlandirmaData} />;
}
