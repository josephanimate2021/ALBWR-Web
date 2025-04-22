import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 80,
    allowedHosts: ['z17randomizer.gonexus.xyz'],
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});