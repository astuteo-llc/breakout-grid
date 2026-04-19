/**
 * Build script for generating standalone CSS files.
 *
 *   dist/_objects.breakout-grid.css              — core (plain)
 *   dist/_objects.breakout-grid.tw.css           — core (Tailwind @utility)
 *   dist/_objects.breakout-grid-extras.css       — extras (plain, @layer-wrapped)
 *   dist/_objects.breakout-grid-extras.tw.css    — extras (Tailwind @utility)
 *
 * Run with: npm run build:css
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { gzipSync } from 'zlib';
import { generateCSSExport } from '../src/visualizer/css-export.js';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const defaults = {
  baseGap: '1rem',
  maxGap: '15rem',
  contentMin: '53rem',
  contentMax: '61rem',
  contentBase: '75vw',
  popoutWidth: '5rem',
  featureMin: '0rem',
  featureScale: '12vw',
  featureMax: '12rem',
  defaultCol: 'content',
  gapScale: { default: '4vw', lg: '5vw', xl: '6vw' },
  breakoutMin: '1rem',
  breakoutScale: '5vw',
  breakpoints: { lg: '1024', xl: '1280' }
};

mkdirSync('dist', { recursive: true });

const targets = [
  ['dist/_objects.breakout-grid.css',    { tailwind: false }],
  ['dist/_objects.breakout-grid.tw.css', { tailwind: true  }],
];

console.log(`Breakout Grid v${pkg.version} — build output`);
console.log('─'.repeat(70));

for (const [path, options] of targets) {
  const css = generateCSSExport(defaults, { ...options, version: pkg.version });
  writeFileSync(path, css);
  const raw = Buffer.byteLength(css);
  const gz = gzipSync(css).length;
  console.log(`${path.padEnd(48)} raw=${String(raw).padStart(6)}B  gz=${String(gz).padStart(5)}B`);
}

console.log('─'.repeat(70));
