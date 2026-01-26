/**
 * Verify that built visualizer files have the correct version from package.json
 * This helps catch cases where files were manually edited instead of rebuilt
 */

import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const expectedVersion = pkg.version;

const files = [
  { path: 'breakout-grid-visualizer.js', pattern: /const VERSION = `v\$\{"([^"]+)"\}`/ },
  { path: 'breakout-grid-visualizer.js', pattern: /const BUILD_VERSION = "([^"]+)"/ },
  { path: 'breakout-grid-visualizer-lite.js', pattern: /const VERSION = `v\$\{"([^"]+)"\} lite`/ }
];

let hasError = false;

for (const { path, pattern } of files) {
  try {
    const content = readFileSync(path, 'utf-8');
    const match = content.match(pattern);
    
    if (!match) {
      console.error(`❌ ${path}: Could not find version pattern`);
      hasError = true;
      continue;
    }
    
    const foundVersion = match[1];
    if (foundVersion !== expectedVersion) {
      console.error(`❌ ${path}: Version mismatch!`);
      console.error(`   Expected: ${expectedVersion}`);
      console.error(`   Found:    ${foundVersion}`);
      console.error(`   Please run: npm run build`);
      hasError = true;
    } else {
      console.log(`✅ ${path}: v${foundVersion}`);
    }
  } catch (err) {
    console.error(`❌ ${path}: ${err.message}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\n⚠️  Built files are out of sync. Run "npm run build" to regenerate them.');
  process.exit(1);
} else {
  console.log('\n✅ All built files have the correct version.');
}
