import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8080',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
  clearScreen: false,
});
