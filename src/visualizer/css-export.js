/**
 * Breakout Grid Visualizer - CSS Export
 * Generates standalone CSS from visualizer configuration
 */

// Version injected at build time by Vite, or passed as parameter
const BUILD_VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';

export { BUILD_VERSION as CSS_EXPORT_VERSION };

export function generateCSSExport(c, version = BUILD_VERSION) {
  const VERSION = version;
  // Extract config with fallbacks
  const breakoutMin = c.breakoutMin || '1rem';
  const breakoutScale = c.breakoutScale || '5vw';
  const breakpointLg = c.breakpoints?.lg || '1024';
  const breakpointXl = c.breakpoints?.xl || '1280';

  return `/**
 * Breakout Grid - Objects Layer (ITCSS)
 * Version: ${VERSION}
 *
 * Documentation: https://github.com/astuteo-llc/breakout-grid
 *
 * ============================================================================
 * TABLE OF CONTENTS
 * ============================================================================
 *
 * CONFIGURATION
 *   - Configuration Variables ........... Customizable :root variables
 *   - Computed Values ................... Auto-calculated (do not edit)
 *
 * GRID CONTAINERS
 *   - Grid Container - Main ............. .grid-cols-breakout
 *   - Subgrid ........................... .grid-cols-breakout-subgrid
 *   - Left/Right Aligned Variants ....... .grid-cols-{area}-{left|right}
 *   - Breakout Modifiers ................ .breakout-to-{content|popout|feature}
 *   - Breakout None ..................... .breakout-none, .breakout-none-flex
 *
 * COLUMN UTILITIES
 *   - Basic ............................. .col-{full|feature|popout|content|center}
 *   - Start/End ......................... .col-start-*, .col-end-*
 *   - Left/Right Spans .................. .col-*-left, .col-*-right
 *   - Advanced Spans .................... .col-*-to-*
 *   - Full Limit ........................ .col-full-limit
 *
 * SPACING UTILITIES
 *   - Padding ........................... .p-breakout, .p-gap, .p-*-to-content
 *   - Margins ........................... .m-breakout, .m-gap, .-m-*
 *
 * ============================================================================
 * INTEGRATION (ITCSS + Tailwind v4)
 * ============================================================================
 *
 * Add this file to your Objects layer. In your main CSS file:
 *
 *   @import 'tailwindcss';
 *
 *   @import './_settings.fonts.css';
 *   @import './_objects.breakout-grid.css';   <-- Add here (Objects layer)
 *   @import './_utilities.global.css';
 *
 *   @layer components {
 *       @import './_components.hero.css';
 *       ...
 *   }
 *
 * ============================================================================
 * QUICK START
 * ============================================================================
 *
 *   <main class="grid-cols-breakout">
 *     <article class="col-content">Reading width</article>
 *     <figure class="col-feature">Wider for images</figure>
 *     <div class="col-full">Edge to edge</div>
 *   </main>
 *
 */

/* ============================================================================
   CONFIGURATION VARIABLES
   ============================================================================
   To restore this grid in the visualizer, copy from here to END CONFIGURATION.
   Paste into the "Restore" dialog at:
   https://github.com/astuteo-llc/breakout-grid
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
  --full-limit: ${c.fullLimit};

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

  /* Breakout padding */
  --breakout-min: ${breakoutMin};
  --breakout-scale: ${breakoutScale};

  /* Breakpoints (used in media queries below) */
  /* --breakpoint-lg: ${breakpointLg}px; */
  /* --breakpoint-xl: ${breakpointXl}px; */
}

/* ============================================================================
   END CONFIGURATION
   ============================================================================ */


/* ============================================================================
   COMPUTED VALUES - DO NOT EDIT
   ============================================================================
   These are calculated from the customizable variables above.
   Editing these directly will break the grid calculations.
   ============================================================================ */

:root {
  /* Responsive gap: scales between base and max based on viewport */
  --gap: clamp(var(--base-gap), var(--gap-scale-default), var(--max-gap));

  /* Computed gap: larger value for full-width spacing */
  --computed-gap: max(var(--gap), calc((100vw - var(--content)) / 10));

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

  /* Alignment padding: for aligning content inside wider columns */
  --breakout-padding: clamp(var(--breakout-min), var(--breakout-scale), var(--popout-width));
  --popout-to-content: clamp(var(--breakout-min), var(--breakout-scale), var(--popout-width));
  --feature-to-content: calc(clamp(var(--feature-min), var(--feature-scale), var(--feature-max)) + var(--popout-width));
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

/* ========================================
   Grid Container - Main
   ========================================

   The primary grid container. Apply to any element that should use
   the breakout grid system. All direct children default to the
   content column unless given a col-* class.

   Basic usage:
   <main class="grid-cols-breakout">
     <article>Default content width</article>
     <figure class="col-feature">Wider for images</figure>
     <div class="col-full">Edge to edge</div>
   </main>
*/
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

/* ----------------------------------------
   Subgrid - Nested Alignment
   ----------------------------------------

   Use subgrid when you need children of a spanning element to align
   with the parent grid's tracks. The child inherits the parent's
   column lines.

   Example - Card grid inside a feature-width container:
   <div class="col-feature grid-cols-breakout-subgrid">
     <h2 class="col-content">Title aligns with content</h2>
     <div class="col-feature">Full width of parent</div>
   </div>

   Browser support: ~93% (check caniuse.com/css-subgrid)
*/
.grid-cols-breakout-subgrid {
  display: grid;
  grid-template-columns: subgrid;
}

/* ========================================
   Grid Container - Left/Right Aligned Variants
   ========================================

   Use these when content should anchor to one side instead of centering.
   Common for asymmetric layouts, sidebars, or split-screen designs.

   Left variants: Content anchors to left edge, right side has outer tracks
   Right variants: Content anchors to right edge, left side has outer tracks

   Example - Image left, text right:
   <section class="grid-cols-feature-left">
     <figure class="col-feature">Image anchored left</figure>
     <div class="col-content">Text in content area</div>
   </section>

   Example - Sidebar layout:
   <div class="grid-cols-content-right">
     <aside class="col-full">Sidebar fills left</aside>
     <main class="col-content">Main content right-aligned</main>
   </div>
*/
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

/* ========================================
   Grid Container - Right Aligned Variants
   ======================================== */
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

/* ========================================
   Breakout Modifiers (for nested grids)
   ========================================

   When you nest a grid inside another element (like inside col-feature),
   the nested grid doesn't know about the parent's constraints. Use these
   modifiers to "reset" the grid to fit its container.

   breakout-to-content: Collapses all tracks - nested grid fills container
   breakout-to-popout:  Keeps popout tracks, collapses feature/full
   breakout-to-feature: Keeps feature+popout tracks, collapses full

   Example - Full-width hero with nested content grid:
   <div class="col-full bg-blue-500">
     <div class="grid-cols-breakout breakout-to-content">
       <h1>This h1 fills the blue container</h1>
       <p class="col-content">But content still works!</p>
     </div>
   </div>

   Example - Feature-width card with internal grid:
   <article class="col-feature">
     <div class="grid-cols-breakout breakout-to-feature">
       <img class="col-feature">Full width of card</img>
       <p class="col-content">Padded text inside</p>
     </div>
   </article>
*/
.grid-cols-breakout.breakout-to-content {
  grid-template-columns: [full-start feature-start popout-start content-start center-start] minmax(0, 1fr) [center-end content-end popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-popout {
  grid-template-columns: [full-start feature-start popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-feature {
  grid-template-columns: [full-start feature-start] var(--feature) [popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end] var(--feature) [feature-end full-end];
}

/* ----------------------------------------
   Breakout None - Disable Grid
   ----------------------------------------

   Use when you need to escape the grid entirely. Useful for:
   - Sidebar layouts where one column shouldn't use grid
   - Components that manage their own layout
   - CMS blocks that shouldn't inherit grid behavior

   Example - Two-column layout with sidebar:
   <div class="grid grid-cols-[300px_1fr]">
     <aside class="breakout-none">Sidebar - no grid here</aside>
     <main class="grid-cols-breakout">Main content uses grid</main>
   </div>
*/
.breakout-none { display: block; }
.breakout-none-flex { display: flex; }
.breakout-none-grid { display: grid; }

/* ========================================
   Column Utilities - Basic
   ========================================

   Place elements in specific grid tracks. These are the core utilities
   you'll use most often.

   col-full:    Edge to edge (viewport width minus gap)
   col-feature: Wide content (images, videos, heroes)
   col-popout:  Slightly wider than content (pull quotes, callouts)
   col-content: Standard reading width (articles, text)
   col-center:  Centered within content (rare, for precise centering)
*/
.col-full { grid-column: full; }
.col-feature { grid-column: feature; }
.col-popout { grid-column: popout; }
.col-content { grid-column: content; }
.col-center { grid-column: center; }

/* Backward compatibility: col-narrow maps to content */
.col-narrow { grid-column: content; }

/* ========================================
   Column Utilities - Start/End
   ========================================

   Fine-grained control for custom spans. Combine start and end
   utilities to create any span you need.

   Example - Span from popout to feature on right:
   <div class="col-start-popout col-end-feature">
     Custom span
   </div>
*/
.col-start-full { grid-column-start: full-start; }
.col-start-feature { grid-column-start: feature-start; }
.col-start-popout { grid-column-start: popout-start; }
.col-start-content { grid-column-start: content-start; }
.col-start-center { grid-column-start: center-start; }

/* Backward compatibility */
.col-start-narrow { grid-column-start: content-start; }

.col-end-full { grid-column-end: full-end; }
.col-end-feature { grid-column-end: feature-end; }
.col-end-popout { grid-column-end: popout-end; }
.col-end-content { grid-column-end: content-end; }
.col-end-center { grid-column-end: center-end; }

/* Backward compatibility */
.col-end-narrow { grid-column-end: content-end; }

/* ========================================
   Column Utilities - Left/Right Spans
   ========================================

   Asymmetric spans that anchor to one edge. Perfect for:
   - Split layouts (image left, text right)
   - Overlapping elements
   - Pull quotes that bleed to one edge

   Pattern: col-{track}-left  = full-start → {track}-end
            col-{track}-right = {track}-start → full-end

   Example - Image bleeds left, caption stays in content:
   <figure class="col-content-left">
     <img class="w-full">Spans from left edge to content</img>
   </figure>

   Example - Quote pulls right:
   <blockquote class="col-popout-right">
     Spans from popout through to right edge
   </blockquote>
*/
.col-feature-left { grid-column: full-start / feature-end; }
.col-feature-right { grid-column: feature-start / full-end; }
.col-popout-left { grid-column: full-start / popout-end; }
.col-popout-right { grid-column: popout-start / full-end; }
.col-content-left { grid-column: full-start / content-end; }
.col-content-right { grid-column: content-start / full-end; }
.col-center-left { grid-column: full-start / center-end; }
.col-center-right { grid-column: center-start / full-end; }

/* Backward compatibility */
.col-narrow-left { grid-column: full-start / content-end; }
.col-narrow-right { grid-column: content-start / full-end; }

/* ========================================
   Column Utilities - Advanced Spans
   ========================================

   Partial spans between non-adjacent tracks. Use when you need
   elements that span from an inner track outward but not all
   the way to the edge.

   Example - Card that spans feature to content (not to edge):
   <div class="col-feature-to-content">
     Wide but doesn't bleed to viewport edge
   </div>
*/
/* Feature to other columns */
.col-feature-to-popout { grid-column: feature-start / popout-end; }
.col-feature-to-content { grid-column: feature-start / content-end; }
.col-feature-to-center { grid-column: feature-start / center-end; }

/* Popout to other columns */
.col-popout-to-content { grid-column: popout-start / content-end; }
.col-popout-to-center { grid-column: popout-start / center-end; }
.col-popout-to-feature { grid-column: popout-start / feature-end; }

/* Content to other columns */
.col-content-to-center { grid-column: content-start / center-end; }
.col-content-to-popout { grid-column: content-start / popout-end; }
.col-content-to-feature { grid-column: content-start / feature-end; }

/* ----------------------------------------
   Full Limit - Capped Full Width
   ----------------------------------------

   Goes edge-to-edge like col-full, but caps at --full-limit on
   ultra-wide screens. Prevents content from becoming too wide
   on large monitors while still being full-width on normal screens.

   Example - Hero that doesn't get absurdly wide:
   <section class="col-full-limit">
     Full width up to ${c.fullLimit}, then centered
   </section>
*/
.col-full-limit {
  grid-column: full;
  width: 100%;
  max-width: var(--full-limit);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* ========================================
   Padding Utilities
   ========================================

   Match padding to grid measurements for alignment. These utilities
   help content inside non-grid elements align with the grid.

   --breakout-padding: Fluid padding that matches popout track behavior
   --gap:              Matches the outer grid gap
   --computed-gap:     Larger gap for full-width elements
   --popout-to-content: Align edges with content track from popout
   --feature-to-content: Align edges with content track from feature

   Example - Full-width section with content-aligned padding:
   <section class="col-full bg-gray-100 px-feature-to-content">
     <p>This text aligns with content column above/below</p>
   </section>

   Example - Card with consistent internal spacing:
   <div class="col-popout p-breakout">
     Padding scales with the grid
   </div>
*/
.p-breakout { padding: var(--breakout-padding); }
.px-breakout { padding-left: var(--breakout-padding); padding-right: var(--breakout-padding); }
.py-breakout { padding-top: var(--breakout-padding); padding-bottom: var(--breakout-padding); }
.pl-breakout { padding-left: var(--breakout-padding); }
.pr-breakout { padding-right: var(--breakout-padding); }
.pt-breakout { padding-top: var(--breakout-padding); }
.pb-breakout { padding-bottom: var(--breakout-padding); }

/* Gap-based padding */
.p-gap { padding: var(--gap); }
.px-gap { padding-left: var(--gap); padding-right: var(--gap); }
.py-gap { padding-top: var(--gap); padding-bottom: var(--gap); }
.pl-gap { padding-left: var(--gap); }
.pr-gap { padding-right: var(--gap); }
.pt-gap { padding-top: var(--gap); }
.pb-gap { padding-bottom: var(--gap); }

/* Full-gap padding (computed, for full-width elements) */
.p-full-gap { padding: var(--computed-gap); }
.px-full-gap { padding-left: var(--computed-gap); padding-right: var(--computed-gap); }
.py-full-gap { padding-top: var(--computed-gap); padding-bottom: var(--computed-gap); }
.pl-full-gap { padding-left: var(--computed-gap); }
.pr-full-gap { padding-right: var(--computed-gap); }
.pt-full-gap { padding-top: var(--computed-gap); }
.pb-full-gap { padding-bottom: var(--computed-gap); }

/* Popout-width padding */
.p-popout { padding: var(--popout); }
.px-popout { padding-left: var(--popout); padding-right: var(--popout); }
.py-popout { padding-top: var(--popout); padding-bottom: var(--popout); }
.pl-popout { padding-left: var(--popout); }
.pr-popout { padding-right: var(--popout); }
.pt-popout { padding-top: var(--popout); }
.pb-popout { padding-bottom: var(--popout); }

/* Alignment padding - align content inside wider columns */
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
.pl-feature-to-content { padding-left: var(--feature-to-content); }

/* ========================================
   Margin Utilities
   ========================================

   Same values as padding utilities, but for margins. Includes
   negative variants for pulling elements outside their container.

   Example - Pull image outside its container:
   <div class="col-content">
     <img class="-mx-breakout">Bleeds into popout area</img>
   </div>

   Example - Overlap previous section:
   <section class="-mt-gap">
     Pulls up into the section above
   </section>
*/
.m-breakout { margin: var(--breakout-padding); }
.mx-breakout { margin-left: var(--breakout-padding); margin-right: var(--breakout-padding); }
.my-breakout { margin-top: var(--breakout-padding); margin-bottom: var(--breakout-padding); }
.ml-breakout { margin-left: var(--breakout-padding); }
.mr-breakout { margin-right: var(--breakout-padding); }
.mt-breakout { margin-top: var(--breakout-padding); }
.mb-breakout { margin-bottom: var(--breakout-padding); }

/* Negative margins */
.-m-breakout { margin: calc(var(--breakout-padding) * -1); }
.-mx-breakout { margin-left: calc(var(--breakout-padding) * -1); margin-right: calc(var(--breakout-padding) * -1); }
.-my-breakout { margin-top: calc(var(--breakout-padding) * -1); margin-bottom: calc(var(--breakout-padding) * -1); }
.-ml-breakout { margin-left: calc(var(--breakout-padding) * -1); }
.-mr-breakout { margin-right: calc(var(--breakout-padding) * -1); }
.-mt-breakout { margin-top: calc(var(--breakout-padding) * -1); }
.-mb-breakout { margin-bottom: calc(var(--breakout-padding) * -1); }

/* Gap-based margins */
.m-gap { margin: var(--gap); }
.mx-gap { margin-left: var(--gap); margin-right: var(--gap); }
.my-gap { margin-top: var(--gap); margin-bottom: var(--gap); }
.ml-gap { margin-left: var(--gap); }
.mr-gap { margin-right: var(--gap); }
.mt-gap { margin-top: var(--gap); }
.mb-gap { margin-bottom: var(--gap); }

/* Negative margins */
.-m-gap { margin: calc(var(--gap) * -1); }
.-mx-gap { margin-left: calc(var(--gap) * -1); margin-right: calc(var(--gap) * -1); }
.-my-gap { margin-top: calc(var(--gap) * -1); margin-bottom: calc(var(--gap) * -1); }
.-ml-gap { margin-left: calc(var(--gap) * -1); }
.-mr-gap { margin-right: calc(var(--gap) * -1); }
.-mt-gap { margin-top: calc(var(--gap) * -1); }
.-mb-gap { margin-bottom: calc(var(--gap) * -1); }

/* Full-gap margins */
.m-full-gap { margin: var(--computed-gap); }
.mx-full-gap { margin-left: var(--computed-gap); margin-right: var(--computed-gap); }
.my-full-gap { margin-top: var(--computed-gap); margin-bottom: var(--computed-gap); }
.ml-full-gap { margin-left: var(--computed-gap); }
.mr-full-gap { margin-right: var(--computed-gap); }
.mt-full-gap { margin-top: var(--computed-gap); }
.mb-full-gap { margin-bottom: var(--computed-gap); }

/* Negative margins */
.-m-full-gap { margin: calc(var(--computed-gap) * -1); }
.-mx-full-gap { margin-left: calc(var(--computed-gap) * -1); margin-right: calc(var(--computed-gap) * -1); }
.-my-full-gap { margin-top: calc(var(--computed-gap) * -1); margin-bottom: calc(var(--computed-gap) * -1); }
.-ml-full-gap { margin-left: calc(var(--computed-gap) * -1); }
.-mr-full-gap { margin-right: calc(var(--computed-gap) * -1); }
.-mt-full-gap { margin-top: calc(var(--computed-gap) * -1); }
.-mb-full-gap { margin-bottom: calc(var(--computed-gap) * -1); }

/* Popout-width margins */
.m-popout { margin: var(--popout); }
.mx-popout { margin-left: var(--popout); margin-right: var(--popout); }
.my-popout { margin-top: var(--popout); margin-bottom: var(--popout); }
.ml-popout { margin-left: var(--popout); }
.mr-popout { margin-right: var(--popout); }
.mt-popout { margin-top: var(--popout); }
.mb-popout { margin-bottom: var(--popout); }

/* Negative margins */
.-m-popout { margin: calc(var(--popout) * -1); }
.-mx-popout { margin-left: calc(var(--popout) * -1); margin-right: calc(var(--popout) * -1); }
.-my-popout { margin-top: calc(var(--popout) * -1); margin-bottom: calc(var(--popout) * -1); }
.-ml-popout { margin-left: calc(var(--popout) * -1); }
.-mr-popout { margin-right: calc(var(--popout) * -1); }
.-mt-popout { margin-top: calc(var(--popout) * -1); }
.-mb-popout { margin-bottom: calc(var(--popout) * -1); }
`;
}
