import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', port: 5173,
    allowedHosts: true, // izinkan domain tunnel (trycloudflare/ngrok berganti tiap restart)
    proxy: {
      // samakan dengan nginx: strip prefix /api agar /api/auth/login -> backend /auth/login
      '/api': { target: 'http://localhost:3000', rewrite: (p) => p.replace(/^\/api/, '') || '/' },
      '/uploads': 'http://localhost:3000'
    }
  }
});
