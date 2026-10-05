import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_API_URL en .env del cliente:
//   - Local:      dejar vacío → usa el proxy de Vite
//   - Vercel:     https://form-with-react-my-sql-node-js-boot-mu.vercel.app
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/employees': { target: API_URL, changeOrigin: true },
      '/create':    { target: API_URL, changeOrigin: true },
      '/update':    { target: API_URL, changeOrigin: true },
      '/delete':    { target: API_URL, changeOrigin: true },
      '/api':       { target: API_URL, changeOrigin: true }
    }
  }
});
