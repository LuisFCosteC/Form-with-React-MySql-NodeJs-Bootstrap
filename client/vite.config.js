import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/employees': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/create': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/update': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/delete': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
