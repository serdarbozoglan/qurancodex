'use client';

// ─── ProphetDetailRoute — deep-link client wrapper ──────────────────────────
// /atlas/peygamber/[id] route'undan id'yi ProphetAtlas'a initialProphetId
// olarak geçirir. ProphetAtlas mount'ta selectedProphets + focusedProphet
// state'lerini bu id ile bootstrap eder; UI default browse mode'la aynıdır,
// sadece ön-seçili peygamber farklıdır.
//
// onClose: router.back() — tarayıcı geçmişine göre önceki sayfaya (genelde
// ana sayfa veya peygamberler atlas kartına) döner.

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// ProphetAtlas dolaylı leaflet bağımlısı (ProphetMap içinden). ssr: false ile
// yalnızca client tarafında render.
const ProphetAtlas = dynamic(() => import('@/sections/ProphetAtlas'), { ssr: false });

export default function ProphetDetailRoute({ id }) {
  const router = useRouter();
  return <ProphetAtlas onClose={() => router.back()} initialProphetId={id} />;
}
