import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // The Ionic runtime alone is ~1.2 MB minified (≈290 KB gzip); this is expected.
    chunkSizeWarningLimit: 1400,
  },
  test: {
    environment: 'jsdom',
    globals: false,
  },
});
