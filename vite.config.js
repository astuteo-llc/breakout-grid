import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(({ command, mode }) => {
  // Library build: npm run build
  if (command === 'build') {
    // Check if building lite version: npm run build -- --mode lite
    const isLite = mode === 'lite';

    return {
      define: {
        __VERSION__: JSON.stringify(pkg.version)
      },
      build: {
        lib: {
          entry: resolve(__dirname, isLite
            ? 'src/visualizer/index-lite.js'
            : 'src/visualizer/index.js'),
          name: 'BreakoutGridVisualizer',
          fileName: () => isLite
            ? 'breakout-grid-visualizer-lite.js'
            : 'breakout-grid-visualizer.js',
          formats: ['iife']
        },
        outDir: '.',
        emptyOutDir: false,
        minify: false
      }
    };
  }

  // Demo dev server: npm run dev
  return {
    root: 'demo',
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    },
    plugins: [tailwindcss()]
  };
});
