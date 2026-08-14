'use client';
import { useRouter, useParams } from 'next/navigation';
import BilimselIsaretler from '@/components/BilimselIsaretler';
import { closeToPrevious } from '@/lib/navOrigin';
export default function BilimselIsaretlerRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <BilimselIsaretler onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
