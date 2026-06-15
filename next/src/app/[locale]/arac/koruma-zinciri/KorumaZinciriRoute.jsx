'use client';
import { useRouter } from 'next/navigation';
import KorumaZinciri from '@/components/KorumaZinciri';
export default function KorumaZinciriRoute() {
  const router = useRouter();
  return <KorumaZinciri onClose={() => router.back()} />;
}
