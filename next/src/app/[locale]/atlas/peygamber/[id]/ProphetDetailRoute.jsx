'use client';

// ─── ProphetDetailRoute — placeholder client wrapper ────────────────────────
// ProphetAtlas tool'u henüz initialProphetId prop'unu kabul etmediği için bu
// route şu an tüm atlas'ı mount eder; kullanıcı navbar'dan değil deep-link'ten
// gelirse de aynı UI'ı görür. router.back() ile kapanır → tarayıcı geçmişine
// göre ana sayfaya veya peygamberler atlas kartına döner.
//
// İleride ProphetAtlas initialProphetId prop'u eklendiğinde:
//   return <ProphetAtlas onClose={...} initialProphetId={id} />;
// olarak güncellenecek (id prop zaten alınıyor).

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// ProphetAtlas dolaylı leaflet bağımlısı (ProphetMap içinden). ssr: false ile
// yalnızca client tarafında render.
const ProphetAtlas = dynamic(() => import('@/sections/ProphetAtlas'), { ssr: false });

export default function ProphetDetailRoute({ id }) {
  const router = useRouter();
  // `id` prop'u şimdilik runtime'da kullanılmıyor; ileride ProphetAtlas
  // initialProphetId desteğiyle birlikte aktive edilir. SEO için page.js
  // tarafında metadata + JsonLd + sr-only H1 zaten id'ye özel render ediliyor.
  void id;
  return <ProphetAtlas onClose={() => router.back()} />;
}
