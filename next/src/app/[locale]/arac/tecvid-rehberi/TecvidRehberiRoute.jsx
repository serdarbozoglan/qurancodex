'use client';

import dynamic from 'next/dynamic';

// TecvidRehberi ses (Audio), window ve statik JSON import kullanır → ssr:false.
const TecvidRehberi = dynamic(() => import('@/components/TecvidRehberi'), { ssr: false });

export default function TecvidRehberiRoute() {
  return <TecvidRehberi />;
}
