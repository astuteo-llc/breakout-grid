/**
 * Build script for generating the standalone CSS file
 * Run with: npm run build:css
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
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
  fullLimit: '115rem',
  defaultCol: 'content',
  gapScale: { default: '4vw', lg: '5vw', xl: '6vw' },
  breakoutMin: '1rem',
  breakoutScale: '5vw'
};

mkdirSync('dist', { recursive: true });
writeFileSync('dist/_objects.breakout-grid.css', generateCSSExport(defaults, pkg.version));
console.log(`Generated dist/_objects.breakout-grid.css (v${pkg.version})`);
