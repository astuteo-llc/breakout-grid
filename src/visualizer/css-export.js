/**
 * Breakout Grid Visualizer - CSS Export
 *
 * Single unified generator. Produces the full utility set (grid, columns,
 * spacing, alignment helpers) as one CSS file. Tailwind flavor
 * wraps every single-class selector in `@utility` blocks so consumers can
 * use responsive/state variants (md:col-feature, hover:col-full, etc.).
 *
 *   generateCSSExport(config, { tailwind, version })
 *     tailwind: boolean  (default false)
 *     version:  string   (default BUILD_VERSION)
 */

const BUILD_VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';

export { BUILD_VERSION as CSS_EXPORT_VERSION };

export function wrapWithTailwindUtilities(css) {
  return css.replace(/^\.(-?[a-zA-Z_][\w-]*)\s*\{/gm, '@utility $1 {');
}

/**
 * Config :root block — every user-editable value in one place. Emitted
 * at the top of the generated CSS and reused by the visualizer's "Copy
 * config" action so both outputs stay byte-for-byte identical.
 */
export function configRootCSS(c) {
  return `:root {
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

  /* Clamp inputs for --breakout-padding */
  --breakout-min: ${c.breakoutMin || '1rem'};
  --breakout-scale: ${c.breakoutScale || '5vw'};
}`;
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
  const { tailwind = false, coreOnly = false, version = BUILD_VERSION } = options;

  const css = coreOnly
    ? gridCSS(config, version)
    : gridCSS(config, version) + '\n' + spacingCSS(config) + '\n' + advancedCSS(config, version);
  const body = tailwind ? TAILWIND_FLAVOR_NOTE + wrapWithTailwindUtilities(css) : css;
  return NO_FORMAT_PRAGMA + body;
}

/* ========================================================================
   GRID — structure, columns, and popout padding (the one unique spacing unit)
   ======================================================================== */

function gridCSS(c, version) {
  const breakpointLg = c.breakpoints?.lg || '1024';
  const breakpointXl = c.breakpoints?.xl || '1280';

  return `/*!
 * Breakout Grid
 * Version: ${version}
 * Documentation: https://github.com/astuteo-llc/breakout-grid
 *
 * Inspired by:
 *   Kevin Powell — https://www.youtube.com/watch?v=c13gpBrnGEw
 *   Ryan Mulligan, Layout Breakouts — https://ryanmulligan.dev/blog/layout-breakouts/
 *   Viget, Fluid Breakout Layout — https://www.viget.com/articles/fluid-breakout-layout-css-grid/
 *
 * TABLE OF CONTENTS
 *   CONFIGURATION ........ Customizable :root variables
 *   COMPUTED ............. Auto-calculated (do not edit)
 *   GRID CONTAINERS ...... .grid-cols-breakout, subgrid, left/right, modifiers
 *   COLUMN UTILITIES ..... .col-*, .col-start-*, .col-end-*, .col-*-{left,right}
 *   POPOUT PADDING ....... .p-popout (sized to --popout-width, grid-unique)
 *
 * Full build adds:
 *   GAP SPACING .......... .p-gap, .m-gap, .m-popout (+ axes + negatives)
 *   BREAKOUT PADDING ..... .p-breakout, .m-breakout (fluid edge padding)
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

${configRootCSS(c)}

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
   POPOUT PADDING — sized to --popout-width (unique to the grid; no Tailwind equivalent)
   ============================================================================ */

.p-popout { padding: var(--popout-width); }
.px-popout { padding-left: var(--popout-width); padding-right: var(--popout-width); }
.py-popout { padding-top: var(--popout-width); padding-bottom: var(--popout-width); }
.pl-popout { padding-left: var(--popout-width); }
.pr-popout { padding-right: var(--popout-width); }
.pt-popout { padding-top: var(--popout-width); }
.pb-popout { padding-bottom: var(--popout-width); }
`;
}

/* ========================================================================
   SPACING — gap margins/padding and popout margins (tied to grid units)
   ======================================================================== */

function spacingCSS(c) {
  return `
/* ============================================================================
   GAP — sized to --gap
   ============================================================================ */

.p-gap { padding: var(--gap); }
.px-gap { padding-left: var(--gap); padding-right: var(--gap); }
.py-gap { padding-top: var(--gap); padding-bottom: var(--gap); }
.pl-gap { padding-left: var(--gap); }
.pr-gap { padding-right: var(--gap); }
.pt-gap { padding-top: var(--gap); }
.pb-gap { padding-bottom: var(--gap); }

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

/* ============================================================================
   POPOUT MARGINS — sized to --popout-width
   ============================================================================ */

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
   ADVANCED — breakout padding
   ======================================================================== */

function advancedCSS(c, version) {
  return advancedBody(c);
}

function advancedBody(c) {
  return `
/* ============================================================================
   ADVANCED COMPUTED
   ============================================================================ */

:root {
  /* Breakout padding clamps between min and popout-width */
  --breakout-padding: clamp(var(--breakout-min), var(--breakout-scale), var(--popout-width));
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
.-mb-breakout { margin-bottom: calc(var(--breakout-padding) * -1); }`;
}
