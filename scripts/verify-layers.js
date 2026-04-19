/**
 * Carving-boundary checks for the core/extras split.
 *
 * We no longer ship a core-only file in dist, so we verify the generator's
 * core-only output directly rather than reading dist files.
 *
 * Exits non-zero if:
 *   - the generator's core output contains any extras tokens
 *   - the generator's extras output contains chained class selectors
 *     (would break the `@utility` wrap regex in css-export.js)
 *
 * Run after the build as a CI / release gate.
 */

import { readFileSync } from 'fs';
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

const EXTRAS_TOKEN_PATTERNS = [
  /--breakout-min\b/,
  /--breakout-scale\b/,
  /--computed-gap\b/,
  /--breakout-padding\b/,
  /--popout-to-content\b/,
  /--feature-to-content\b/,
  /\.breakout-none\b/,
  /\.p-breakout\b/,
  /\.m-breakout\b/,
  /\.p-full-gap\b/,
  /\.m-full-gap\b/,
  /\.p-popout-to-content\b/,
  /\.p-feature-to-content\b/,
  /\.col-[a-z]+-to-[a-z]+\b/,
];

const CHAINED_CLASS_PATTERN = /^\.[a-zA-Z_][\w-]*\.[a-zA-Z_][\w-]*\s*\{/m;

let failed = false;
const fail = (msg) => { console.error(`✗ ${msg}`); failed = true; };
const pass = (msg) => console.log(`✓ ${msg}`);

function checkCoreIsClean(label, css) {
  // Strip header comment block so we don't false-positive on documentation
  const body = css.replace(/^\/\*![\s\S]*?\*\//, '');
  const matches = EXTRAS_TOKEN_PATTERNS.filter(re => re.test(body));
  if (matches.length > 0) {
    fail(`${label} contains extras tokens: ${matches.map(r => r.source).join(', ')}`);
  } else {
    pass(`${label} contains zero extras tokens`);
  }
}

function checkNoChainedSelectors(label, css) {
  if (CHAINED_CLASS_PATTERN.test(css)) {
    fail(`${label} contains chained class selectors — breaks @utility wrap regex`);
  } else {
    pass(`${label} contains zero chained class selectors`);
  }
}

console.log('Verifying core/extras layer boundary (via generator)...');
console.log('─'.repeat(70));

const corePlain  = generateCSSExport(defaults, { layer: 'core', tailwind: false, version: pkg.version });
const coreTw     = generateCSSExport(defaults, { layer: 'core', tailwind: true,  version: pkg.version });
const extrasTw   = generateCSSExport(defaults, { layer: 'extras', tailwind: true, version: pkg.version });

checkCoreIsClean('generator(core, plain)',    corePlain);
checkCoreIsClean('generator(core, tailwind)', coreTw);
checkNoChainedSelectors('generator(extras, tailwind)', extrasTw);

console.log('─'.repeat(70));

if (failed) {
  console.error('Layer boundary verification FAILED');
  process.exit(1);
}

console.log('All layer boundary checks passed');
