import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanopyCore',
      formats: ['es', 'cjs'],
      fileName: (fmt) => `index.${fmt === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
  },
});
