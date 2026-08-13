// ─── /admin kök layout'u ────────────────────────────────────────────────────
// 2026-08-13. `app/layout.js` kaldırılınca (bkz. `app/_shell.jsx`) /admin
// altındaki route'ların kök layout'u kalmamıştı. Bu dosya o boşluğu doldurur.
// Yalnız yönetim ekranı — daima Türkçe, locale segmenti yok.
// ────────────────────────────────────────────────────────────────────────────

import Shell, { sharedMetadata, sharedViewport } from '../_shell';

export const metadata = { ...sharedMetadata, robots: { index: false, follow: false } };
export const viewport = sharedViewport;

export default function AdminRootLayout({ children }) {
  return <Shell lang="tr">{children}</Shell>;
}
