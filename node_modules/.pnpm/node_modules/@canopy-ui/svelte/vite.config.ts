import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess(), emitCss: false })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['svelte', '@kanopee/core'],
      output: {
        assetFileNames: 'styles.css',
      },
    },
    cssCodeSplit: false,
  },
});
