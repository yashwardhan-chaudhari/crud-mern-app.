import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // ─── Vite Proxy (Lesson 3.4) ───────────────────────────────────────────
    // All /api requests are forwarded to the Express server
    // This avoids CORS issues during development and lets us use relative URLs
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
