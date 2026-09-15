'use client';

import TecvidRehberi from '@/components/TecvidRehberi';

// ssr:false KALDIRILDI (2026-09-14). Gerekcesi "Audio, window ve statik JSON
// import" diye yaziliydi ama olculdugunde tutmadi:
//   · JSON zaten STATIK IMPORT, sunucuda da cozulur,
//   · window / new Audio / document erisimlerinin HEPSI useEffect ve olay
//     isleyicisi icinde; render sirasinda hicbiri calismiyor,
//   · isMobile sunucuda da istemcide de false basliyor (§14.1), hidrasyon
//     uyusmazligi yok.
// Olculen etki: ilk HTML'de sayfanin %2'si vardi. Tecvid kurallari arama
// motoruna ve yavas baglantiya hic ulasmiyordu.
export default function TecvidRehberiRoute() {
  return <TecvidRehberi />;
}
