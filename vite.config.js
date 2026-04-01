import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
