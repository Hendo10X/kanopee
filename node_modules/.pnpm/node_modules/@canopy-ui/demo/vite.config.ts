import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@kanopee/react': resolve(__dirname, '../react/src/index.ts'),
      '@kanopee/core': resolve(__dirname, '../core/src/index.ts'),
    },
  },
  optimizeDeps: {
    // Exclude Phosphor subpath imports — they're already ESM, no pre-bundling needed
    exclude: ['@phosphor-icons/react'],
  },
});
