import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'force-graph': ['react-force-graph-3d', '3d-force-graph'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/website/**', '**/node_modules/**'],
    },
    proxy: {
      '/kuran-proxy': {
        target: 'https://www.kuran.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kuran-proxy/, ''),
      },
    },
  },
})
