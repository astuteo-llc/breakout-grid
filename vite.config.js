/**
 * Vite build configuration for Breakout Grid visualizers
 * 
 * This config generates two visualizer files in the project root:
 *   - breakout-grid-visualizer.js (full version with config editor)
 *   - breakout-grid-visualizer-lite.js (read-only version)
 * 
 * IMPORTANT: These files should NEVER be manually edited. They are build outputs
 * that are regenerated from source files in src/visualizer/. The version number
 * is automatically injected from package.json via the __VERSION__ define.
 * 
 * To update these files, run: npm run build
 */
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
        // Version from package.json is injected at build time
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
