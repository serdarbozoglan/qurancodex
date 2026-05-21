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
};

export default nextConfig;
