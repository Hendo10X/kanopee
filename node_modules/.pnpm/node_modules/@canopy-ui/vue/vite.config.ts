import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', '@kanopee/core'],
      output: {
        assetFileNames: 'styles.css',
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: false,
  },
});
