'use client';

import { useRouter, useParams } from 'next/navigation';
import AddresseeSystem from '@/components/AddresseeSystem';
import { closeToPrevious } from '@/lib/navOrigin';

export default function AddresseeSystemRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <AddresseeSystem onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
