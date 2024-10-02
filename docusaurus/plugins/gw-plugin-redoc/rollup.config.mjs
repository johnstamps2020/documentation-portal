import json from '@rollup/plugin-json';
import { defineConfig } from 'rollup';

const rollupConfig = defineConfig({
  context: 'window',
  input: 'src/scripts/gw.redoc.standalone.js',
  output: {
    file: './lib/scripts/gw.redoc.standalone.js',
    format: 'umd',
  },
  plugins: [json()],
});

export default rollupConfig;
