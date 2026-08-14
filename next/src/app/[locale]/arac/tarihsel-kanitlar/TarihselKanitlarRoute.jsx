'use client';
import { useRouter, useParams } from 'next/navigation';
import TarihselKanitlar from '@/components/TarihselKanitlar';
import { closeToPrevious } from '@/lib/navOrigin';
export default function TarihselKanitlarRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <TarihselKanitlar onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
