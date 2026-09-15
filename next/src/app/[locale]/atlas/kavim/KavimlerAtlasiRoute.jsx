'use client';

import { useRouter, useParams } from 'next/navigation';
import KavimlerAtlasi from '@/components/KavimlerAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

// ssr:false KALDIRILDI (2026-09-14). Gerekcesi dogruydu ama COZUMU fazla
// genisti: react-leaflet modul duzeyinde window'a dokunuyor diye SAYFANIN
// TAMAMI istemciye birakilmisti ve ilk HTML'de iceriginin yalnizca %4'u
// kaliyordu. Leaflet artik KavimHaritasi.jsx icinde izole ve yalniz o bilesen
// dinamik olarak (ssr:false) yukleniyor; atlasin metni sunucuda render edilir.
export default function KavimlerAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KavimlerAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
