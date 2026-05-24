import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack root to this Next.js workspace; the Vite project at the
  // repo root also has a package-lock.json which would otherwise be picked
  // as the inferred root and trigger a warning on every dev/build.
  turbopack: {
    root: __dirname,
  },
  // Vite'taki `/kuran-proxy` server proxy'sinin Next.js karşılığı.
  // useInterlinearData hook'u `/kuran-proxy/kelime-meali/...` URL'lerine
  // fetch yapıyor; Vite'ta proxy CORS bypass için `https://www.kuran.com`'a
  // forward ediyordu. Next.js'te aynı davranış için rewrites() kullanılır.
  // Locale middleware'ın bu path'i locale-prefix ile redirect etmemesi için
  // `/((?!_next|api|fonts|tafsir|corpus|...).*)` matcher'inde KURAN-PROXY
  // exclusion gerekli (orada zaten dot-içeren path'ler dışlanmış; bu path
  // segments dot içermiyor — middleware.js'e ek pattern eklenebilir veya
  // rewrites() locale-aware olmalı).
  async rewrites() {
    return [
      {
        source: '/kuran-proxy/:path*',
        destination: 'https://www.kuran.com/:path*',
      },
      // Locale-prefixed varyant — middleware /tr veya /en eklediğinde
      {
        source: '/:locale(tr|en)/kuran-proxy/:path*',
        destination: 'https://www.kuran.com/:path*',
      },
    ];
  },
};

export default nextConfig;
