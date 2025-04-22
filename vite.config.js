import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 80,
    allowedHosts: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  base: '/'
});