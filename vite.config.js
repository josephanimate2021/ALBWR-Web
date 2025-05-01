import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 80,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});