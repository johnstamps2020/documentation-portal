import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// vitest automatically sets NODE_ENV to 'test' when running tests
const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [
    eslint(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr(),
    !isTest && TanStackRouterVite(),
    tsconfigPaths(),
  ],
  server: {
    host: '0.0.0.0',
    port: 6006,
    strictPort: true,
    hmr: {
      clientPort: 6006,
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          '@emotion/react': ['@emotion/react'],
          '@emotion/styled': ['@emotion/styled'],
          '@mui/material': ['@mui/material'],
          '@doctools/components': ['@doctools/components'],
          '@tanstack/react-router': ['@tanstack/react-router'],
          swr: ['swr'],
          tinycolor2: ['tinycolor2'],
        },
      },
    },
    chunkSizeWarningLimit: 850,
  },
});
