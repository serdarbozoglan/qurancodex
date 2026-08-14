'use client';

import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import ReadingModeSkeleton from '@/components/ReadingModeSkeleton';

// ReadingMode'da 21 HIGH SSR-unsafe useState (window/localStorage doğrudan erişim).
// SSR'da render etmek hydration mismatch'e yol açar; ssr:false ile client-only render.
// SEO sinyalleri (PageHeading H1 + JsonLd) page.js server'da kalır.
// `loading: () => null` CLS'in kök nedenlerinden biriydi (14 Ağustos, Z3-V
// kök #2) — bkz. [surah]/ReadingModeRoute.jsx'teki aynı notun ayrıntısı.
const ReadingMode = dynamic(() => import('@/components/ReadingMode'), {
  ssr: false,
  loading: () => <ReadingModeSkeleton />,
});

export default function ReadingModeRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'tr';
  // Close daima QuranCodex anasayfasına gider — external referrer'dan gelen
  // kullanıcıyı Google/sosyal medyaya atmaz (user #169 2026-07-06).
  return <ReadingMode onClose={() => router.push(`/${locale}`)} />;
}
