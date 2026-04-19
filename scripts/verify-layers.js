/**
 * Carving-boundary checks for the core/extras split.
 *
 * Exits non-zero if:
 *   - core files contain any extras tokens (vars, classes)
 *   - extras .tw.css contains chained class selectors (breaks the
 *     `@utility` wrapper regex assumption in css-export.js)
 *
 * Run after the build as a CI / release gate.
 */

import { readFileSync } from 'fs';

const EXTRAS_TOKEN_PATTERNS = [
  /--breakout-padding-min\b/,
  /--breakout-padding-scale\b/,
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

function fail(msg) {
  console.error(`✗ ${msg}`);
  failed = true;
}

function pass(msg) {
  console.log(`✓ ${msg}`);
}

function checkCoreIsClean(path) {
  const content = readFileSync(path, 'utf8');
  // Strip header comment block so we don't false-positive on documentation
  const body = content.replace(/^\/\*![\s\S]*?\*\//, '');
  const matches = EXTRAS_TOKEN_PATTERNS.filter(re => re.test(body));
  if (matches.length > 0) {
    fail(`${path} contains extras tokens: ${matches.map(r => r.source).join(', ')}`);
  } else {
    pass(`${path} contains zero extras tokens`);
  }
}

function checkNoChainedSelectors(path) {
  const content = readFileSync(path, 'utf8');
  if (CHAINED_CLASS_PATTERN.test(content)) {
    fail(`${path} contains chained class selectors — breaks @utility wrap regex`);
  } else {
    pass(`${path} contains zero chained class selectors`);
  }
}

console.log('Verifying core/extras layer boundary...');
console.log('─'.repeat(70));

checkCoreIsClean('dist/_objects.breakout-grid.css');
checkCoreIsClean('dist/_objects.breakout-grid.tw.css');
checkNoChainedSelectors('dist/_objects.breakout-grid-extras.tw.css');

console.log('─'.repeat(70));

if (failed) {
  console.error('Layer boundary verification FAILED');
  process.exit(1);
}

console.log('All layer boundary checks passed');
