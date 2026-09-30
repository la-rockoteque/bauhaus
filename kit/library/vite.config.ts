import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

// Library build: one ES entry, React as a peer. Tokens are built by `npm run tokens` into dist/,
// so the build must not empty that folder.
export default defineConfig({
  plugins: [react(), dts({ include: ['index.ts', 'foundations', 'themes', 'primitives', 'components', 'patterns'], exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.rules.ts'] })],
  build: {
    emptyOutDir: false,
    cssFileName: 'style',
    lib: { entry: 'index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
  test: { environment: 'jsdom', globals: true, include: ['**/*.test.tsx'], exclude: ['node_modules', 'dist'] },
});
