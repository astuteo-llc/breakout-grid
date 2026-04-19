/**
 * Breakout Grid Visualizer - CSS Export
 *
 * Generates CSS output for the core layer, the optional extras layer,
 * or a combined concatenation. Tailwind-flavor wraps every single-class
 * selector in `@utility` blocks.
 *
 * Entry point:
 *   generateCSSExport(config, { layer, tailwind, version })
 *     layer:    'core' | 'extras' | 'combined'  (default 'combined')
 *     tailwind: boolean                         (default false)
 *     version:  string                          (default BUILD_VERSION)
 *
 * The core/extras split is enforced by one rule: extras may depend on
 * core; core must not depend on extras. The release build greps the
 * core output for extras tokens as a CI gate.
 */

const BUILD_VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';

export { BUILD_VERSION as CSS_EXPORT_VERSION };

export function wrapWithTailwindUtilities(css) {
  return css.replace(/^\.(-?[a-zA-Z_][\w-]*)\s*\{/gm, '@utility $1 {');
}

const TAILWIND_FLAVOR_NOTE = `/*!
 * Tailwind v4 flavor — each rule wrapped in \`@utility\` so Tailwind
 * variants work (\`md:col-feature\`, \`hover:col-full\`, etc.). Chained
 * selectors like \`.grid-cols-breakout.breakout-to-content\` stay as
 * plain classes because \`@utility\` only accepts single-class selectors.
 */
`;

// Prevents JetBrains IDEs from auto-formatting the generated file on save.
// Prettier users need a separate `.prettierignore` entry — see README.
const NO_FORMAT_PRAGMA = '/* @formatter:off */\n';

export function generateCSSExport(config, options = {}) {
  const { layer = 'combined', tailwind = false, version = BUILD_VERSION } = options;

  let css;
  if (layer === 'core') {
    css = coreCSS(config, version);
  } else if (layer === 'extras') {
    css = extrasCSS(config, version, { wrapInLayer: !tailwind });
  } else {
    css = coreCSS(config, version) + '\n' + extrasCSS(config, version, { wrapInLayer: !tailwind });
  }

  const body = tailwind ? TAILWIND_FLAVOR_NOTE + wrapWithTailwindUtilities(css) : css;
  return NO_FORMAT_PRAGMA + body;
}

/* ========================================================================
   CORE LAYER
   ======================================================================== */

function coreCSS(c, version) {
  const breakpointLg = c.breakpoints?.lg || '1024';
  const breakpointXl = c.breakpoints?.xl || '1280';

  return `/*!
 * Breakout Grid — Core
 * Version: ${version}
 * Documentation: https://github.com/astuteo-llc/breakout-grid
 *
 * Inspired by:
 *   Kevin Powell — https://www.youtube.com/watch?v=c13gpBrnGEw
 *   Ryan Mulligan, Layout Breakouts — https://ryanmulligan.dev/blog/layout-breakouts/
 *   Viget, Fluid Breakout Layout — https://www.viget.com/articles/fluid-breakout-layout-css-grid/
 *
 * For the advanced utility layer (advanced spans, breakout padding,
 * full-gap, alignment paddings, grid-escape), also import:
 *   @import '@astuteo/breakout-grid/extras';
 *
 * TABLE OF CONTENTS
 *   CONFIGURATION ........ Customizable :root variables
 *   COMPUTED ............. Auto-calculated (do not edit)
 *   GRID CONTAINERS ...... .grid-cols-breakout, subgrid, left/right, modifiers
 *   COLUMN UTILITIES ..... .col-*, .col-start-*, .col-end-*, .col-*-{left,right}
 *   SPACING .............. .p-gap, .p-popout, .m-gap, .m-popout (+ axes + negatives)
 *
 * QUICK START
 *   <main class="grid-cols-breakout">
 *     <article class="col-content">Reading width</article>
 *     <figure class="col-feature">Wider for images</figure>
 *     <div class="col-full">Edge to edge</div>
 *   </main>
 */

/* ============================================================================
   CONFIGURATION
   ============================================================================ */

:root {
  /* Content (text width) */
  --content-min: ${c.contentMin};
  --content-base: ${c.contentBase};
  --content-max: ${c.contentMax};

  /* Default column for children without col-* class */
  --default-col: ${c.defaultCol || 'content'};

  /* Track widths */
  --popout-width: ${c.popoutWidth};

  /* Feature track */
  --feature-min: ${c.featureMin};
  --feature-scale: ${c.featureScale};
  --feature-max: ${c.featureMax};

  /* Outer margins */
  --base-gap: ${c.baseGap};
  --max-gap: ${c.maxGap};

  /* Responsive scale */
  --gap-scale-default: ${c.gapScale?.default || '4vw'};
  --gap-scale-lg: ${c.gapScale?.lg || '5vw'};
  --gap-scale-xl: ${c.gapScale?.xl || '6vw'};
}

/* ============================================================================
   COMPUTED - DO NOT EDIT
   ============================================================================ */

:root {
  /* Responsive gap: scales between base and max based on viewport */
  --gap: clamp(var(--base-gap), var(--gap-scale-default), var(--max-gap));

  /* Content width: fluid between min/max, respects gap on both sides */
  --content: min(clamp(var(--content-min), var(--content-base), var(--content-max)), 100% - var(--gap) * 2);

  /* Content inset: for left/right aligned grids (single gap) */
  --content-inset: min(clamp(var(--content-min), var(--content-base), var(--content-max)), calc(100% - var(--gap)));

  /* Half content: used for center alignment */
  --content-half: calc(var(--content) / 2);

  /* Track definitions for grid-template-columns */
  --full: minmax(var(--gap), 1fr);
  --feature: minmax(0, clamp(var(--feature-min), var(--feature-scale), var(--feature-max)));
  --popout: minmax(0, var(--popout-width));
}

/* Responsive gap scaling */
@media (min-width: ${breakpointLg}px) {
  :root {
    --gap: clamp(var(--base-gap), var(--gap-scale-lg), var(--max-gap));
  }
}

@media (min-width: ${breakpointXl}px) {
  :root {
    --gap: clamp(var(--base-gap), var(--gap-scale-xl), var(--max-gap));
  }
}

/* ============================================================================
   GRID CONTAINERS
   ============================================================================ */

/* Main centered grid — all direct children default to var(--default-col) */
.grid-cols-breakout {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-half) [center-start center-end] var(--content-half) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* Default column for direct children without explicit col-* class */
[class*='grid-cols-breakout'] > *:not([class*='col-']),
[class*='grid-cols-feature'] > *:not([class*='col-']),
[class*='grid-cols-popout'] > *:not([class*='col-']),
[class*='grid-cols-content'] > *:not([class*='col-']) {
  grid-column: var(--default-col, content);
}

/* Subgrid — nested items align to parent grid's tracks (~93% support 4/2026) */
.grid-cols-breakout-subgrid {
  display: grid;
  grid-template-columns: subgrid;
}

/* ----------------------------------------------------------------------------
   Left / Right aligned variants
   ---------------------------------------------------------------------------- */

.grid-cols-feature-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end full-end];
}

.grid-cols-popout-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end full-end];
}

.grid-cols-content-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end full-end];
}

.grid-cols-feature-right {
  display: grid;
  grid-template-columns:
    [full-start feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-popout-right {
  display: grid;
  grid-template-columns:
    [full-start popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-content-right {
  display: grid;
  grid-template-columns:
    [full-start content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* ----------------------------------------------------------------------------
   Breakout modifiers (for nested grids)
   ---------------------------------------------------------------------------- */

.grid-cols-breakout.breakout-to-content {
  grid-template-columns: [full-start feature-start popout-start content-start center-start] minmax(0, 1fr) [center-end content-end popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-popout {
  grid-template-columns: [full-start feature-start popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-feature {
  grid-template-columns: [full-start feature-start] var(--feature) [popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end] var(--feature) [feature-end full-end];
}

/* ============================================================================
   COLUMN UTILITIES
   ============================================================================ */

.col-full { grid-column: full; }
.col-feature { grid-column: feature; }
.col-popout { grid-column: popout; }
.col-content { grid-column: content; }
.col-center { grid-column: center; }

/* Backward compatibility: col-narrow maps to content */
.col-narrow { grid-column: content; }

/* Start / End */
.col-start-full { grid-column-start: full-start; }
.col-start-feature { grid-column-start: feature-start; }
.col-start-popout { grid-column-start: popout-start; }
.col-start-content { grid-column-start: content-start; }
.col-start-center { grid-column-start: center-start; }
.col-start-narrow { grid-column-start: content-start; }

.col-end-full { grid-column-end: full-end; }
.col-end-feature { grid-column-end: feature-end; }
.col-end-popout { grid-column-end: popout-end; }
.col-end-content { grid-column-end: content-end; }
.col-end-center { grid-column-end: center-end; }
.col-end-narrow { grid-column-end: content-end; }

/* Left / Right spans */
.col-feature-left { grid-column: full-start / feature-end; }
.col-feature-right { grid-column: feature-start / full-end; }
.col-popout-left { grid-column: full-start / popout-end; }
.col-popout-right { grid-column: popout-start / full-end; }
.col-content-left { grid-column: full-start / content-end; }
.col-content-right { grid-column: content-start / full-end; }
.col-center-left { grid-column: full-start / center-end; }
.col-center-right { grid-column: center-start / full-end; }
.col-narrow-left { grid-column: full-start / content-end; }
.col-narrow-right { grid-column: content-start / full-end; }

/* ============================================================================
   SPACING — gap & popout only (extras layer adds breakout / full-gap / *-to-content)
   ============================================================================ */

/* Gap-based padding */
.p-gap { padding: var(--gap); }
.px-gap { padding-left: var(--gap); padding-right: var(--gap); }
.py-gap { padding-top: var(--gap); padding-bottom: var(--gap); }
.pl-gap { padding-left: var(--gap); }
.pr-gap { padding-right: var(--gap); }
.pt-gap { padding-top: var(--gap); }
.pb-gap { padding-bottom: var(--gap); }

/* Popout-width padding */
.p-popout { padding: var(--popout-width); }
.px-popout { padding-left: var(--popout-width); padding-right: var(--popout-width); }
.py-popout { padding-top: var(--popout-width); padding-bottom: var(--popout-width); }
.pl-popout { padding-left: var(--popout-width); }
.pr-popout { padding-right: var(--popout-width); }
.pt-popout { padding-top: var(--popout-width); }
.pb-popout { padding-bottom: var(--popout-width); }

/* Gap-based margins */
.m-gap { margin: var(--gap); }
.mx-gap { margin-left: var(--gap); margin-right: var(--gap); }
.my-gap { margin-top: var(--gap); margin-bottom: var(--gap); }
.ml-gap { margin-left: var(--gap); }
.mr-gap { margin-right: var(--gap); }
.mt-gap { margin-top: var(--gap); }
.mb-gap { margin-bottom: var(--gap); }

.-m-gap { margin: calc(var(--gap) * -1); }
.-mx-gap { margin-left: calc(var(--gap) * -1); margin-right: calc(var(--gap) * -1); }
.-my-gap { margin-top: calc(var(--gap) * -1); margin-bottom: calc(var(--gap) * -1); }
.-ml-gap { margin-left: calc(var(--gap) * -1); }
.-mr-gap { margin-right: calc(var(--gap) * -1); }
.-mt-gap { margin-top: calc(var(--gap) * -1); }
.-mb-gap { margin-bottom: calc(var(--gap) * -1); }

/* Popout-width margins */
.m-popout { margin: var(--popout-width); }
.mx-popout { margin-left: var(--popout-width); margin-right: var(--popout-width); }
.my-popout { margin-top: var(--popout-width); margin-bottom: var(--popout-width); }
.ml-popout { margin-left: var(--popout-width); }
.mr-popout { margin-right: var(--popout-width); }
.mt-popout { margin-top: var(--popout-width); }
.mb-popout { margin-bottom: var(--popout-width); }

.-m-popout { margin: calc(var(--popout-width) * -1); }
.-mx-popout { margin-left: calc(var(--popout-width) * -1); margin-right: calc(var(--popout-width) * -1); }
.-my-popout { margin-top: calc(var(--popout-width) * -1); margin-bottom: calc(var(--popout-width) * -1); }
.-ml-popout { margin-left: calc(var(--popout-width) * -1); }
.-mr-popout { margin-right: calc(var(--popout-width) * -1); }
.-mt-popout { margin-top: calc(var(--popout-width) * -1); }
.-mb-popout { margin-bottom: calc(var(--popout-width) * -1); }
`;
}

/* ========================================================================
   EXTRAS LAYER
   ========================================================================
   Optional advanced utilities. Extras depends on core; never the reverse.

   wrapInLayer: when true (plain .css path), wraps extras in
   `@layer breakout-extras` so import order is irrelevant. When false
   (Tailwind .tw.css path), no wrapping — Tailwind v4 handles layering
   natively and sorts @utility blocks by property count.
*/

function extrasCSS(c, version, { wrapInLayer = false } = {}) {
  const breakpointLg = c.breakpoints?.lg || '1024';
  const breakpointXl = c.breakpoints?.xl || '1280';
  const breakoutPaddingMin = c.breakoutMin || '1rem';
  const breakoutPaddingScale = c.breakoutScale || '5vw';

  const body = extrasBody(c, breakoutPaddingMin, breakoutPaddingScale, breakpointLg, breakpointXl);

  const header = `/*!
 * Breakout Grid — Extras layer
 * Version: ${version}
 *
 * Requires @astuteo/breakout-grid to be imported first.
 *
 * Adds the optional advanced utilities:
 *   advanced spans, breakout padding, full-gap, alignment paddings, grid-escape.
 */
`;

  if (wrapInLayer) {
    return `${header}
@layer breakout-extras {
${body}
}
`;
  }

  return `${header}
${body}
`;
}

function extrasBody(c, breakoutPaddingMin, breakoutPaddingScale, breakpointLg, breakpointXl) {
  return `/* ============================================================================
   EXTRAS CONFIGURATION
   ============================================================================ */

:root {
  /* Breakout-padding clamp inputs (extras only) */
  --breakout-min: ${breakoutPaddingMin};
  --breakout-scale: ${breakoutPaddingScale};
}

/* ============================================================================
   EXTRAS COMPUTED — graceful fallbacks if core is missing
   ============================================================================ */

:root {
  /* Larger gap for full-width elements */
  --computed-gap: max(var(--gap, 1rem), calc((100vw - var(--content, 50rem)) / 10));

  /* Breakout padding clamps between min and popout-width */
  --breakout-padding: clamp(var(--breakout-min, 1rem), var(--breakout-scale, 5vw), var(--popout-width, 5rem));

  /* Alignment paddings to reach the content column edge */
  --popout-to-content: clamp(var(--breakout-min, 1rem), var(--breakout-scale, 5vw), var(--popout-width, 5rem));
  --feature-to-content: calc(clamp(var(--feature-min, 0rem), var(--feature-scale, 12vw), var(--feature-max, 12rem)) + var(--popout-width, 5rem));
}

/* ============================================================================
   BREAKOUT-NONE — escape the grid entirely
   ============================================================================ */

.breakout-none { display: block; }
.breakout-none-flex { display: flex; }
.breakout-none-grid { display: grid; }

/* Reset col-* placement inside breakout-none containers */
.breakout-none > [class*='col-'],
.breakout-none-flex > [class*='col-'],
.breakout-none-grid > [class*='col-'] {
  grid-column: auto;
}

/* ============================================================================
   BREAKOUT PADDING — fluid padding matching popout track behavior
   ============================================================================ */

.p-breakout { padding: var(--breakout-padding); }
.px-breakout { padding-left: var(--breakout-padding); padding-right: var(--breakout-padding); }
.py-breakout { padding-top: var(--breakout-padding); padding-bottom: var(--breakout-padding); }
.pl-breakout { padding-left: var(--breakout-padding); }
.pr-breakout { padding-right: var(--breakout-padding); }
.pt-breakout { padding-top: var(--breakout-padding); }
.pb-breakout { padding-bottom: var(--breakout-padding); }

.m-breakout { margin: var(--breakout-padding); }
.mx-breakout { margin-left: var(--breakout-padding); margin-right: var(--breakout-padding); }
.my-breakout { margin-top: var(--breakout-padding); margin-bottom: var(--breakout-padding); }
.ml-breakout { margin-left: var(--breakout-padding); }
.mr-breakout { margin-right: var(--breakout-padding); }
.mt-breakout { margin-top: var(--breakout-padding); }
.mb-breakout { margin-bottom: var(--breakout-padding); }

.-m-breakout { margin: calc(var(--breakout-padding) * -1); }
.-mx-breakout { margin-left: calc(var(--breakout-padding) * -1); margin-right: calc(var(--breakout-padding) * -1); }
.-my-breakout { margin-top: calc(var(--breakout-padding) * -1); margin-bottom: calc(var(--breakout-padding) * -1); }
.-ml-breakout { margin-left: calc(var(--breakout-padding) * -1); }
.-mr-breakout { margin-right: calc(var(--breakout-padding) * -1); }
.-mt-breakout { margin-top: calc(var(--breakout-padding) * -1); }
.-mb-breakout { margin-bottom: calc(var(--breakout-padding) * -1); }

/* ============================================================================
   FULL-GAP — larger gap for full-width elements
   ============================================================================ */

.p-full-gap { padding: var(--computed-gap); }
.px-full-gap { padding-left: var(--computed-gap); padding-right: var(--computed-gap); }
.py-full-gap { padding-top: var(--computed-gap); padding-bottom: var(--computed-gap); }
.pl-full-gap { padding-left: var(--computed-gap); }
.pr-full-gap { padding-right: var(--computed-gap); }
.pt-full-gap { padding-top: var(--computed-gap); }
.pb-full-gap { padding-bottom: var(--computed-gap); }

.m-full-gap { margin: var(--computed-gap); }
.mx-full-gap { margin-left: var(--computed-gap); margin-right: var(--computed-gap); }
.my-full-gap { margin-top: var(--computed-gap); margin-bottom: var(--computed-gap); }
.ml-full-gap { margin-left: var(--computed-gap); }
.mr-full-gap { margin-right: var(--computed-gap); }
.mt-full-gap { margin-top: var(--computed-gap); }
.mb-full-gap { margin-bottom: var(--computed-gap); }

.-m-full-gap { margin: calc(var(--computed-gap) * -1); }
.-mx-full-gap { margin-left: calc(var(--computed-gap) * -1); margin-right: calc(var(--computed-gap) * -1); }
.-my-full-gap { margin-top: calc(var(--computed-gap) * -1); margin-bottom: calc(var(--computed-gap) * -1); }
.-ml-full-gap { margin-left: calc(var(--computed-gap) * -1); }
.-mr-full-gap { margin-right: calc(var(--computed-gap) * -1); }
.-mt-full-gap { margin-top: calc(var(--computed-gap) * -1); }
.-mb-full-gap { margin-bottom: calc(var(--computed-gap) * -1); }

/* ============================================================================
   ALIGNMENT PADDING — align content inside wider columns
   ============================================================================ */

.p-popout-to-content { padding: var(--popout-to-content); }
.px-popout-to-content { padding-left: var(--popout-to-content); padding-right: var(--popout-to-content); }
.py-popout-to-content { padding-top: var(--popout-to-content); padding-bottom: var(--popout-to-content); }
.pt-popout-to-content { padding-top: var(--popout-to-content); }
.pr-popout-to-content { padding-right: var(--popout-to-content); }
.pb-popout-to-content { padding-bottom: var(--popout-to-content); }
.pl-popout-to-content { padding-left: var(--popout-to-content); }

.p-feature-to-content { padding: var(--feature-to-content); }
.px-feature-to-content { padding-left: var(--feature-to-content); padding-right: var(--feature-to-content); }
.py-feature-to-content { padding-top: var(--feature-to-content); padding-bottom: var(--feature-to-content); }
.pt-feature-to-content { padding-top: var(--feature-to-content); }
.pr-feature-to-content { padding-right: var(--feature-to-content); }
.pb-feature-to-content { padding-bottom: var(--feature-to-content); }
.pl-feature-to-content { padding-left: var(--feature-to-content); }`;
}
