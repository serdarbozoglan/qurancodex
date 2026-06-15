'use client';
import { useRouter } from 'next/navigation';
import TarihselKanitlar from '@/components/TarihselKanitlar';
export default function TarihselKanitlarRoute() {
  const router = useRouter();
  return <TarihselKanitlar onClose={() => router.back()} />;
}
