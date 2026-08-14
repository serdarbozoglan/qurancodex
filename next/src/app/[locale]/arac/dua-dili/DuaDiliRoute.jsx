'use client';
import { useRouter, useParams } from 'next/navigation';
import DuaDili from '@/components/DuaDili';
import { closeToPrevious } from '@/lib/navOrigin';
export default function DuaDiliRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <DuaDili onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
