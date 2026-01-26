(function() {
  "use strict";
  const VERSION = `v${"5.0.0"}`;
  const LOREM_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`;
  const GRID_AREAS = [
    { name: "full", label: "Full", className: ".col-full", color: "rgba(239, 68, 68, 0.25)", borderColor: "rgb(239, 68, 68)" },
    { name: "full-limit", label: "Full Limit", className: ".col-full-limit", color: "rgba(220, 38, 38, 0.25)", borderColor: "rgb(220, 38, 38)" },
    { name: "feature", label: "Feature", className: ".col-feature", color: "rgba(6, 182, 212, 0.25)", borderColor: "rgb(6, 182, 212)" },
    { name: "popout", label: "Popout", className: ".col-popout", color: "rgba(34, 197, 94, 0.25)", borderColor: "rgb(34, 197, 94)" },
    { name: "content", label: "Content", className: ".col-content", color: "rgba(168, 85, 247, 0.25)", borderColor: "rgb(168, 85, 247)" }
  ];
  const CONFIG_OPTIONS = {
    // Base measurements
    baseGap: { value: "1rem", desc: "Minimum gap between columns. Use rem.", cssVar: "--config-base-gap", liveVar: "--base-gap" },
    maxGap: { value: "15rem", desc: "Maximum gap cap for ultra-wide. Use rem.", cssVar: "--config-max-gap", liveVar: "--max-gap" },
    contentMin: { value: "53rem", desc: "Min width for content column (~848px). Use rem.", cssVar: "--config-content-min", liveVar: "--content-min" },
    contentMax: { value: "61rem", desc: "Max width for content column (~976px). Use rem.", cssVar: "--config-content-max", liveVar: "--content-max" },
    contentBase: { value: "75vw", desc: "Preferred width for content (fluid). Use vw.", cssVar: "--config-content-base", liveVar: "--content-base" },
    // Track widths
    popoutWidth: { value: "5rem", desc: "Popout extends beyond content. Use rem.", cssVar: "--config-popout", liveVar: null },
    featureMin: { value: "0rem", desc: "Minimum feature track width (floor)", cssVar: "--config-feature-min", liveVar: null },
    featureScale: { value: "12vw", desc: "Fluid feature track scaling", cssVar: "--config-feature-scale", liveVar: null },
    featureMax: { value: "12rem", desc: "Maximum feature track width (ceiling)", cssVar: "--config-feature-max", liveVar: null },
    fullLimit: { value: "115rem", desc: "Max width for col-full-limit. Use rem.", cssVar: "--config-full-limit", liveVar: "--full-limit" },
    // Default column
    defaultCol: { value: "content", desc: "Default column when no col-* class", type: "select", options: ["content", "popout", "feature", "full"], cssVar: "--config-default-col" }
  };
  const GAP_SCALE_OPTIONS = {
    default: { value: "4vw", desc: "Mobile/default gap scaling. Use vw.", cssVar: "--config-gap-scale-default" },
    lg: { value: "5vw", desc: "Large screens (1024px+). Use vw.", cssVar: "--config-gap-scale-lg" },
    xl: { value: "6vw", desc: "Extra large (1280px+). Use vw.", cssVar: "--config-gap-scale-xl" }
  };
  const BREAKOUT_OPTIONS = {
    min: { value: "1rem", desc: "Minimum breakout padding (floor)", cssVar: "--config-breakout-min" },
    scale: { value: "5vw", desc: "Fluid breakout scaling", cssVar: "--config-breakout-scale" }
    // max is popoutWidth
  };
  const BREAKPOINT_OPTIONS = {
    lg: { value: "1024", desc: "Large breakpoint (px)", cssVar: "--config-breakpoint-lg" },
    xl: { value: "1280", desc: "Extra large breakpoint (px)", cssVar: "--config-breakpoint-xl" }
  };
  function createInitialState() {
    return {
      // UI State
      isVisible: false,
      showLabels: true,
      showClassNames: true,
      showMeasurements: true,
      showPixelWidths: false,
      showGapPadding: false,
      showBreakoutPadding: false,
      showAdvanced: false,
      showLoremIpsum: false,
      showEditor: false,
      showDiagram: false,
      editMode: false,
      viewportWidth: window.innerWidth,
      selectedArea: null,
      hoveredArea: null,
      editValues: {},
      copySuccess: false,
      configCopied: false,
      editorPos: { x: 20, y: 100 },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      // Column resize drag state
      resizingColumn: null,
      resizeStartX: 0,
      resizeStartValue: 0,
      // Panel collapse state
      controlPanelCollapsed: false,
      configEditorCollapsed: false,
      // Computed column widths in pixels (pre-initialized for reactivity)
      columnWidths: {
        full: 0,
        "full-limit": 0,
        feature: 0,
        popout: 0,
        content: 0,
        center: 0
      },
      // Current breakpoint for gap scale (mobile, lg, xl)
      currentBreakpoint: "mobile",
      // Spacing panel state
      spacingPanelCollapsed: false,
      spacingPanelPos: { x: 16, y: 16 },
      isDraggingSpacing: false,
      dragOffsetSpacing: { x: 0, y: 0 },
      // Restore config modal
      showRestoreModal: false,
      restoreInput: "",
      restoreError: null,
      // Section copy feedback
      sectionCopied: null
    };
  }
  const BUILD_VERSION = "5.0.0";
  function generateCSSExport(c, version = BUILD_VERSION) {
    var _a, _b, _c, _d, _e;
    const VERSION2 = version;
    const breakoutMin = c.breakoutMin || "1rem";
    const breakoutScale = c.breakoutScale || "5vw";
    const breakpointLg = ((_a = c.breakpoints) == null ? void 0 : _a.lg) || "1024";
    const breakpointXl = ((_b = c.breakpoints) == null ? void 0 : _b.xl) || "1280";
    return `/**
 * Breakout Grid - Objects Layer (ITCSS)
 * Version: ${VERSION2}
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
  --default-col: ${c.defaultCol || "content"};

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
  --gap-scale-default: ${((_c = c.gapScale) == null ? void 0 : _c.default) || "4vw"};
  --gap-scale-lg: ${((_d = c.gapScale) == null ? void 0 : _d.lg) || "5vw"};
  --gap-scale-xl: ${((_e = c.gapScale) == null ? void 0 : _e.xl) || "6vw"};

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
  const methods = {
    // Initialize
    init() {
      const saved = localStorage.getItem("breakoutGridVisualizerVisible");
      if (saved !== null) {
        this.isVisible = saved === "true";
      }
      const editorOpen = localStorage.getItem("breakoutGridEditorOpen");
      if (editorOpen === "true") {
        this.showEditor = true;
        this.editMode = true;
        this.$nextTick(() => this.loadCurrentValues());
      }
      const editorPos = localStorage.getItem("breakoutGridEditorPos");
      if (editorPos) {
        try {
          this.editorPos = JSON.parse(editorPos);
        } catch (e) {
        }
      }
      const spacingPos = localStorage.getItem("breakoutGridSpacingPos");
      if (spacingPos) {
        try {
          this.spacingPanelPos = JSON.parse(spacingPos);
        } catch (e) {
        }
      }
      const spacingCollapsed = localStorage.getItem("breakoutGridSpacingCollapsed");
      if (spacingCollapsed !== null) {
        this.spacingPanelCollapsed = spacingCollapsed === "true";
      }
      window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "g") {
          e.preventDefault();
          this.toggle();
        }
      });
      window.addEventListener("resize", () => {
        this.viewportWidth = window.innerWidth;
        this.updateColumnWidths();
        this.updateCurrentBreakpoint();
        if (this.editMode) {
          this.updateGapLive();
        }
      });
      this.updateCurrentBreakpoint();
      console.log("Breakout Grid Visualizer loaded. Press Ctrl/Cmd + G to toggle.");
    },
    // Toggle visibility
    toggle() {
      this.isVisible = !this.isVisible;
      localStorage.setItem("breakoutGridVisualizerVisible", this.isVisible);
    },
    // Update column widths by querying DOM elements
    updateColumnWidths() {
      this.$nextTick(() => {
        this.gridAreas.forEach((area) => {
          const el = document.querySelector(`.breakout-visualizer-grid .col-${area.name}`);
          if (el) {
            this.columnWidths[area.name] = Math.round(el.getBoundingClientRect().width);
          }
        });
      });
    },
    // Detect current breakpoint based on viewport width
    updateCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width >= 1280) {
        this.currentBreakpoint = "xl";
      } else if (width >= 1024) {
        this.currentBreakpoint = "lg";
      } else {
        this.currentBreakpoint = "mobile";
      }
    },
    // Update --gap live based on current breakpoint and edit values
    updateGapLive() {
      const scaleKey = this.currentBreakpoint === "mobile" ? "default" : this.currentBreakpoint;
      const base = this.editValues.baseGap || this.configOptions.baseGap.value;
      const max = this.editValues.maxGap || this.configOptions.maxGap.value;
      const scale = this.editValues[`gapScale_${scaleKey}`] || this.gapScaleOptions[scaleKey].value;
      document.documentElement.style.setProperty("--gap", `clamp(${base}, ${scale}, ${max})`);
      this.updateColumnWidths();
    },
    // Check if content width exceeds comfortable reading width (55rem)
    getContentReadabilityWarning() {
      const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value);
      if (contentMax > 55) {
        return `Content max (${contentMax}rem) exceeds 55rem—may be wide for reading. Ideal for prose: 45–55rem.`;
      }
      return null;
    },
    // Check if configured track widths would exceed viewport
    getTrackOverflowWarning() {
      const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value) * 16;
      const featureMax = parseFloat(this.editValues.featureMax || this.configOptions.featureMax.value) * 16;
      const popoutWidth = parseFloat(this.editValues.popoutWidth || this.configOptions.popoutWidth.value) * 16;
      const featurePx = featureMax * 2;
      const popoutPx = popoutWidth * 2;
      const totalFixed = contentMax + featurePx + popoutPx;
      if (totalFixed > this.viewportWidth) {
        return `Tracks exceed viewport by ~${Math.round(totalFixed - this.viewportWidth)}px — outer columns will compress`;
      }
      return null;
    },
    // Get computed CSS variable value
    getCSSVariable(varName) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return value || "Not set";
    },
    // Helper to load options from CSS variables
    loadOptionsFromCSS(options, prefix = "") {
      Object.keys(options).forEach((key) => {
        const opt = options[key];
        const editKey = prefix ? `${prefix}_${key}` : key;
        if (opt.cssVar) {
          const computed = this.getCSSVariable(opt.cssVar);
          this.editValues[editKey] = computed && computed !== "Not set" && computed !== "" ? computed : opt.value;
        } else {
          this.editValues[editKey] = opt.value;
        }
      });
    },
    // Load current values from CSS variables where available
    loadCurrentValues() {
      this.loadOptionsFromCSS(this.configOptions);
      this.loadOptionsFromCSS(this.gapScaleOptions, "gapScale");
      this.loadOptionsFromCSS(this.breakoutOptions, "breakout");
    },
    // Generate export config object
    generateConfigExport() {
      var _a, _b, _c, _d;
      const config = {};
      Object.keys(this.configOptions).forEach((key) => {
        config[key] = this.editValues[key] || this.configOptions[key].value;
      });
      config.gapScale = {};
      Object.keys(this.gapScaleOptions).forEach((key) => {
        config.gapScale[key] = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
      });
      config.breakoutMin = this.editValues.breakout_min || this.breakoutOptions.min.value;
      config.breakoutScale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
      config.breakpoints = {
        lg: this.editValues.breakpoint_lg || ((_b = (_a = this.breakpointOptions) == null ? void 0 : _a.lg) == null ? void 0 : _b.value) || "1024",
        xl: this.editValues.breakpoint_xl || ((_d = (_c = this.breakpointOptions) == null ? void 0 : _c.xl) == null ? void 0 : _d.value) || "1280"
      };
      return config;
    },
    // Format config object with single quotes for values, no quotes for keys
    formatConfig(obj, indent = 2) {
      const pad = " ".repeat(indent);
      const lines = ["{"];
      const entries = Object.entries(obj);
      entries.forEach(([key, value], i) => {
        const comma = i < entries.length - 1 ? "," : "";
        if (typeof value === "object" && value !== null) {
          lines.push(`${pad}${key}: ${this.formatConfig(value, indent + 2).replace(/\n/g, "\n" + pad)}${comma}`);
        } else {
          lines.push(`${pad}${key}: '${value}'${comma}`);
        }
      });
      lines.push("}");
      return lines.join("\n");
    },
    // Section definitions for partial copying
    configSections: {
      content: {
        keys: ["contentMin", "contentBase", "contentMax"],
        label: "Content"
      },
      defaultCol: {
        keys: ["defaultCol"],
        label: "Default Column"
      },
      tracks: {
        keys: ["popoutWidth", "fullLimit"],
        label: "Track Widths"
      },
      feature: {
        keys: ["featureMin", "featureScale", "featureMax"],
        label: "Feature"
      },
      gap: {
        keys: ["baseGap", "maxGap"],
        nested: { gapScale: ["default", "lg", "xl"] },
        label: "Gap"
      },
      breakout: {
        keys: ["breakoutMin", "breakoutScale"],
        label: "Breakout"
      }
    },
    // Copy a specific section to clipboard
    copySection(sectionName) {
      const section = this.configSections[sectionName];
      if (!section) return;
      const config = {};
      section.keys.forEach((key) => {
        if (this.configOptions[key]) {
          config[key] = this.editValues[key] || this.configOptions[key].value;
        } else if (key === "breakoutMin") {
          config[key] = this.editValues.breakout_min || this.breakoutOptions.min.value;
        } else if (key === "breakoutScale") {
          config[key] = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
        }
      });
      if (section.nested) {
        Object.keys(section.nested).forEach((nestedKey) => {
          config[nestedKey] = {};
          section.nested[nestedKey].forEach((subKey) => {
            config[nestedKey][subKey] = this.editValues[`gapScale_${subKey}`] || this.gapScaleOptions[subKey].value;
          });
        });
      }
      const configStr = this.formatConfigFlat(config);
      navigator.clipboard.writeText(configStr).then(() => {
        this.sectionCopied = sectionName;
        setTimeout(() => this.sectionCopied = null, 1500);
      });
    },
    // Format config as flat key-value pairs (no wrapping braces)
    formatConfigFlat(obj) {
      const lines = [];
      const entries = Object.entries(obj);
      entries.forEach(([key, value], i) => {
        const comma = i < entries.length - 1 ? "," : ",";
        if (typeof value === "object" && value !== null) {
          lines.push(`${key}: ${this.formatConfig(value)}${comma}`);
        } else {
          lines.push(`${key}: '${value}'${comma}`);
        }
      });
      return lines.join("\n");
    },
    // Copy config to clipboard as CSS variables
    copyConfig() {
      var _a, _b, _c, _d, _e;
      const config = this.generateConfigExport();
      const lines = [
        ":root {",
        `  /* Content (text width) */`,
        `  --content-min: ${config.contentMin};`,
        `  --content-base: ${config.contentBase};`,
        `  --content-max: ${config.contentMax};`,
        `  /* Default column */`,
        `  --default-col: ${config.defaultCol || "content"};`,
        `  /* Track widths */`,
        `  --popout-width: ${config.popoutWidth};`,
        `  --full-limit: ${config.fullLimit};`,
        `  /* Feature track */`,
        `  --feature-min: ${config.featureMin};`,
        `  --feature-scale: ${config.featureScale};`,
        `  --feature-max: ${config.featureMax};`,
        `  /* Outer margins */`,
        `  --base-gap: ${config.baseGap};`,
        `  --max-gap: ${config.maxGap};`,
        `  /* Responsive scale */`,
        `  --gap-scale-default: ${((_a = config.gapScale) == null ? void 0 : _a.default) || "4vw"};`,
        `  --gap-scale-lg: ${((_b = config.gapScale) == null ? void 0 : _b.lg) || "5vw"};`,
        `  --gap-scale-xl: ${((_c = config.gapScale) == null ? void 0 : _c.xl) || "6vw"};`,
        `  /* Breakout padding */`,
        `  --breakout-min: ${config.breakoutMin || "1rem"};`,
        `  --breakout-scale: ${config.breakoutScale || "5vw"};`,
        `  /* Breakpoints */`,
        `  /* --breakpoint-lg: ${((_d = config.breakpoints) == null ? void 0 : _d.lg) || "1024"}px; */`,
        `  /* --breakpoint-xl: ${((_e = config.breakpoints) == null ? void 0 : _e.xl) || "1280"}px; */`,
        "}"
      ];
      const configStr = lines.join("\n");
      navigator.clipboard.writeText(configStr).then(() => {
        this.copySuccess = true;
        this.configCopied = true;
        setTimeout(() => this.copySuccess = false, 2e3);
      });
    },
    // Generate and download standalone CSS file
    downloadCSS() {
      const css = this.generateCSSExport(this.generateConfigExport());
      const blob = new Blob([css], { type: "text/css" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `_objects.breakout-grid.css`;
      a.click();
      URL.revokeObjectURL(url);
    },
    // Parse CSS value into number and unit (e.g., "4rem" -> { num: 4, unit: "rem" })
    parseValue(val) {
      const match = String(val).match(/^([\d.]+)(.*)$/);
      if (match) {
        return { num: parseFloat(match[1]), unit: match[2] || "rem" };
      }
      return { num: 0, unit: "rem" };
    },
    // Get the numeric part of a config value
    getNumericValue(key) {
      const val = this.editValues[key] || this.configOptions[key].value;
      return this.parseValue(val).num;
    },
    // Get the unit part of a config value
    getUnit(key) {
      const val = this.editValues[key] || this.configOptions[key].value;
      return this.parseValue(val).unit;
    },
    // Check if a field should have unit selection (rem-based fields only)
    hasUnitSelector(key) {
      const unit = this.getUnit(key);
      return unit === "rem" || unit === "ch" || unit === "px";
    },
    // Available units for selection
    unitOptions: ["rem", "ch", "px"],
    // Update just the unit, keeping the numeric value
    updateUnit(key, newUnit) {
      const num = this.getNumericValue(key);
      this.updateConfigValue(key, num + newUnit);
    },
    // Update just the numeric part, keeping the unit
    updateNumericValue(key, num) {
      if (key === "content" && num < 1) num = 1;
      if (key === "baseGap" && num < 0) num = 0;
      if (key === "popoutWidth" && num < 0) num = 0;
      if ((key === "featureMin" || key === "featureScale" || key === "featureMax") && num < 0) num = 0;
      const unit = this.getUnit(key);
      this.updateConfigValue(key, num + unit);
    },
    // Generic getter for prefixed options (gapScale, breakout)
    getPrefixedNumeric(prefix, options, key) {
      const val = this.editValues[`${prefix}_${key}`] || options[key].value;
      return this.parseValue(val).num;
    },
    getPrefixedUnit(prefix, options, key) {
      const val = this.editValues[`${prefix}_${key}`] || options[key].value;
      return this.parseValue(val).unit;
    },
    // Gap scale helpers (use generic)
    getGapScaleNumeric(key) {
      return this.getPrefixedNumeric("gapScale", this.gapScaleOptions, key);
    },
    getGapScaleUnit(key) {
      return this.getPrefixedUnit("gapScale", this.gapScaleOptions, key);
    },
    updateGapScaleNumeric(key, num) {
      this.editValues[`gapScale_${key}`] = num + this.getGapScaleUnit(key);
      this.configCopied = false;
      this.updateGapLive();
    },
    // Breakout helpers (use generic)
    getBreakoutNumeric(key) {
      return this.getPrefixedNumeric("breakout", this.breakoutOptions, key);
    },
    getBreakoutUnit(key) {
      return this.getPrefixedUnit("breakout", this.breakoutOptions, key);
    },
    updateBreakoutNumeric(key, num) {
      this.editValues[`breakout_${key}`] = num + this.getBreakoutUnit(key);
      this.configCopied = false;
      this.updateBreakoutLive();
    },
    // Update --breakout-padding live
    updateBreakoutLive() {
      const min = this.editValues.breakout_min || this.breakoutOptions.min.value;
      const scale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
      const max = this.editValues.popoutWidth || this.configOptions.popoutWidth.value;
      document.documentElement.style.setProperty("--breakout-padding", `clamp(${min}, ${scale}, ${max})`);
    },
    // Update a config value (and live CSS var if applicable)
    updateConfigValue(key, value) {
      this.editValues[key] = value;
      this.configCopied = false;
      const opt = this.configOptions[key];
      if (opt && opt.liveVar) {
        document.documentElement.style.setProperty(opt.liveVar, value);
      }
      if (key === "popoutWidth") {
        document.documentElement.style.setProperty("--popout", `minmax(0, ${value})`);
        this.updateBreakoutLive();
      }
      if (key === "featureMin" || key === "featureScale" || key === "featureMax") {
        const featureMin = this.editValues.featureMin || this.configOptions.featureMin.value;
        const featureScale = this.editValues.featureScale || this.configOptions.featureScale.value;
        const featureMax = this.editValues.featureMax || this.configOptions.featureMax.value;
        document.documentElement.style.setProperty("--feature", `minmax(0, clamp(${featureMin}, ${featureScale}, ${featureMax}))`);
      }
      if (key === "content") {
        document.documentElement.style.setProperty("--content", `minmax(0, ${value})`);
      }
      if (key === "baseGap" || key === "maxGap") {
        this.updateGapLive();
      }
    },
    // Select a grid area
    selectArea(areaName) {
      this.selectedArea = this.selectedArea === areaName ? null : areaName;
    },
    // Check if area is selected
    isSelected(areaName) {
      return this.selectedArea === areaName;
    },
    // Restore all CSS variable overrides to original values
    restoreCSSVariables() {
      Object.keys(this.configOptions).forEach((key) => {
        const opt = this.configOptions[key];
        if (opt.liveVar) {
          document.documentElement.style.removeProperty(opt.liveVar);
        }
      });
      document.documentElement.style.removeProperty("--popout");
      document.documentElement.style.removeProperty("--feature");
      document.documentElement.style.removeProperty("--content");
      document.documentElement.style.removeProperty("--breakout-padding");
      document.documentElement.style.removeProperty("--popout-to-content");
      this.editValues = {};
      this.configCopied = false;
    },
    // Toggle edit mode
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.loadCurrentValues();
      } else {
        this.restoreCSSVariables();
      }
    },
    // Check if any values have been edited and not yet copied
    hasUnsavedEdits() {
      return Object.keys(this.editValues).length > 0 && !this.configCopied;
    },
    // Open floating editor
    openEditor() {
      this.showEditor = true;
      this.editMode = true;
      this.loadCurrentValues();
      localStorage.setItem("breakoutGridEditorOpen", "true");
    },
    // Close floating editor
    closeEditor(force = false) {
      if (!force && this.hasUnsavedEdits()) {
        if (!confirm("You have unsaved config changes. Close without copying?")) {
          return;
        }
      }
      this.showEditor = false;
      this.editMode = false;
      this.restoreCSSVariables();
      localStorage.setItem("breakoutGridEditorOpen", "false");
    },
    // Generic drag handling for panels
    _dragConfigs: {
      editor: { pos: "editorPos", dragging: "isDragging", offset: "dragOffset", storage: "breakoutGridEditorPos" },
      spacing: { pos: "spacingPanelPos", dragging: "isDraggingSpacing", offset: "dragOffsetSpacing", storage: "breakoutGridSpacingPos" }
    },
    startPanelDrag(e, panel) {
      const cfg = this._dragConfigs[panel];
      this[cfg.dragging] = true;
      this[cfg.offset] = { x: e.clientX - this[cfg.pos].x, y: e.clientY - this[cfg.pos].y };
    },
    onPanelDrag(e, panel) {
      const cfg = this._dragConfigs[panel];
      if (this[cfg.dragging]) {
        this[cfg.pos] = { x: e.clientX - this[cfg.offset].x, y: e.clientY - this[cfg.offset].y };
      }
    },
    stopPanelDrag(panel) {
      const cfg = this._dragConfigs[panel];
      if (this[cfg.dragging]) localStorage.setItem(cfg.storage, JSON.stringify(this[cfg.pos]));
      this[cfg.dragging] = false;
    },
    // Editor drag (shorthand)
    startDrag(e) {
      this.startPanelDrag(e, "editor");
    },
    onDrag(e) {
      this.onPanelDrag(e, "editor");
    },
    stopDrag() {
      this.stopPanelDrag("editor");
    },
    // Spacing drag (shorthand)
    startDragSpacing(e) {
      this.startPanelDrag(e, "spacing");
    },
    onDragSpacing(e) {
      this.onPanelDrag(e, "spacing");
    },
    stopDragSpacing() {
      this.stopPanelDrag("spacing");
    },
    // Column resize drag handling
    startColumnResize(e, columnType) {
      if (!this.editMode) return;
      e.preventDefault();
      e.stopPropagation();
      this.resizingColumn = columnType;
      this.resizeStartX = e.clientX;
      const currentVal = this.editValues[columnType] || this.configOptions[columnType].value;
      this.resizeStartValue = this.parseValue(currentVal).num;
    },
    onColumnResize(e) {
      if (!this.resizingColumn) return;
      const deltaX = e.clientX - this.resizeStartX;
      const col = this.resizingColumn;
      const unit = this.getUnit(col);
      let pxPerUnit;
      if (unit === "vw") {
        pxPerUnit = window.innerWidth / 100;
      } else if (unit === "rem") {
        pxPerUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
      } else {
        pxPerUnit = 1;
      }
      const isRightHandle = col === "contentMax" || col === "contentBase";
      const delta = isRightHandle ? deltaX / pxPerUnit : -deltaX / pxPerUnit;
      let newValue = this.resizeStartValue + delta;
      if (newValue < 0) newValue = 0;
      newValue = Math.round(newValue * 10) / 10;
      this.updateConfigValue(col, newValue + unit);
      this.updateColumnWidths();
    },
    stopColumnResize() {
      this.resizingColumn = null;
    },
    // Map column names to their config keys for resizing
    getResizeConfig(colName) {
      const map = {
        "full-limit": "fullLimit",
        "feature": "featureScale",
        "popout": "popoutWidth"
        // content has its own integrated handles for min/max/base
        // feature has its own integrated handles for min/scale/max
      };
      return map[colName] || null;
    },
    // Parse a CSS variables string into a config object
    parseConfigString(input) {
      const str = input.trim();
      const config = { gapScale: {}, breakpoints: {} };
      const varMap = {
        "--base-gap": "baseGap",
        "--max-gap": "maxGap",
        "--content-min": "contentMin",
        "--content-max": "contentMax",
        "--content-base": "contentBase",
        "--popout-width": "popoutWidth",
        "--feature-min": "featureMin",
        "--feature-scale": "featureScale",
        "--feature-max": "featureMax",
        "--full-limit": "fullLimit",
        "--breakout-min": "breakoutMin",
        "--breakout-scale": "breakoutScale",
        "--default-col": "defaultCol"
      };
      const gapScaleMap = {
        "--gap-scale-default": "default",
        "--gap-scale-lg": "lg",
        "--gap-scale-xl": "xl"
      };
      const breakpointMap = {
        "--breakpoint-lg": "lg",
        "--breakpoint-xl": "xl"
      };
      const varRegex = /(?:\/\*\s*)?(--[\w-]+)\s*:\s*([^;*]+);?\s*(?:\*\/)?/g;
      let match;
      let foundAny = false;
      while ((match = varRegex.exec(str)) !== null) {
        const [, varName, value] = match;
        let trimmedValue = value.trim();
        foundAny = true;
        if (varMap[varName]) {
          config[varMap[varName]] = trimmedValue;
        } else if (gapScaleMap[varName]) {
          config.gapScale[gapScaleMap[varName]] = trimmedValue;
        } else if (breakpointMap[varName]) {
          config.breakpoints[breakpointMap[varName]] = trimmedValue.replace(/px$/, "");
        }
      }
      if (!foundAny) {
        throw new Error('Invalid format. Paste CSS variables from "Copy Variables".');
      }
      return config;
    },
    // Open restore modal
    openRestoreModal() {
      this.showRestoreModal = true;
      this.restoreInput = "";
      this.restoreError = null;
    },
    // Close restore modal
    closeRestoreModal() {
      this.showRestoreModal = false;
      this.restoreInput = "";
      this.restoreError = null;
    },
    // Apply a parsed config to the editor
    restoreConfig() {
      this.restoreError = null;
      try {
        const config = this.parseConfigString(this.restoreInput);
        Object.keys(this.configOptions).forEach((key) => {
          if (config[key] !== void 0) {
            this.editValues[key] = config[key];
            this.updateConfigValue(key, config[key]);
          }
        });
        if (config.gapScale) {
          Object.keys(this.gapScaleOptions).forEach((key) => {
            if (config.gapScale[key] !== void 0) {
              this.editValues[`gapScale_${key}`] = config.gapScale[key];
            }
          });
          this.updateGapLive();
        }
        if (config.breakoutMin !== void 0) {
          this.editValues.breakout_min = config.breakoutMin;
        }
        if (config.breakoutScale !== void 0) {
          this.editValues.breakout_scale = config.breakoutScale;
        }
        this.updateBreakoutLive();
        if (config.breakpoints) {
          if (config.breakpoints.lg !== void 0) {
            this.editValues.breakpoint_lg = config.breakpoints.lg;
          }
          if (config.breakpoints.xl !== void 0) {
            this.editValues.breakpoint_xl = config.breakpoints.xl;
          }
        }
        this.updateColumnWidths();
        this.closeRestoreModal();
        this.configCopied = false;
      } catch (e) {
        this.restoreError = e.message;
      }
    }
  };
  const template = `
  <div x-show="isVisible"
       x-transition
       class="breakout-grid-visualizer"
       @mousemove.window="onColumnResize($event)"
       @mouseup.window="stopColumnResize()"
       style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

    <!-- Edit Mode Backdrop - fades page content -->
    <div x-show="editMode"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="position: absolute; inset: 0; background: rgba(255, 255, 255, 0.85); z-index: 1;"></div>

    <!-- Advanced Span Examples Overlay -->
    <div x-show="showAdvanced"
         class="grid-cols-breakout"
         style="position: absolute; inset: 0; height: 100%; pointer-events: auto; z-index: 5;">

      <!-- Left-anchored: full-start to feature-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'full-start / feature-end',
             background: hovered ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)' : 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
             border: '3px solid rgb(168, 85, 247)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-start',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(139, 92, 246);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: left;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → feature boundary</div>
        </div>
      </div>

      <!-- Right-anchored: feature-start to full-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature-start / full-end',
             background: hovered ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
             border: '3px solid rgb(34, 197, 94)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-end',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(34, 197, 94);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-right</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Feature boundary → right edge</div>
        </div>
      </div>

      <!-- To center point: full-start to center-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'full-start / center-end',
             background: hovered ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.6) 0%, rgba(234, 179, 8, 0.6) 100%)' : 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)',
             border: '3px solid rgb(234, 179, 8)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-end',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(234, 179, 8);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-center-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → center point</div>
        </div>
      </div>

      <!-- Nested grid example: breakout-to-feature inside col-feature -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature',
             border: '3px dashed rgb(59, 130, 246)',
             margin: '1rem 0',
             background: hovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.05)',
             transition: 'background 0.2s ease',
             padding: '0.5rem'
           }">
        <div style="font-size: 0.625rem; font-family: monospace; color: rgb(30, 64, 175); margin-bottom: 0.5rem; padding: 0.25rem;">
          Parent: .col-feature container
        </div>
        <div class="grid-cols-breakout breakout-to-feature"
             style="background: rgba(59, 130, 246, 0.1);">
          <div style="grid-column: feature;
                      background: rgba(59, 130, 246, 0.3);
                      padding: 0.5rem;
                      font-size: 0.625rem;
                      font-family: monospace;
                      color: rgb(30, 64, 175);">
            .col-feature → fills container
          </div>
          <div style="grid-column: content;
                      background: rgb(59, 130, 246);
                      color: white;
                      padding: 0.75rem 1rem;
                      font-size: 0.75rem;
                      font-weight: 700;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="font-family: monospace; margin-bottom: 0.5rem;">.col-content → has margins</div>
            <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">breakout-to-feature collapses outer tracks</div>
            <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature"&gt;
  &lt;div class="grid-cols-breakout breakout-to-feature"&gt;
    &lt;div class="col-feature"&gt;Fills container&lt;/div&gt;
    &lt;p class="col-content"&gt;Has margins&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>

      <!-- Subgrid example: child aligns to parent grid tracks -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature-start / full-end',
             display: 'grid',
             gridTemplateColumns: 'subgrid',
             border: '3px solid rgb(236, 72, 153)',
             margin: '1rem 0',
             background: hovered ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.05)',
             transition: 'background 0.2s ease'
           }">
        <!-- Parent label -->
        <div style="grid-column: 1 / -1;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);
                    padding: 0.5rem;
                    background: rgba(236, 72, 153, 0.1);">
          Parent: .col-feature-right .grid-cols-breakout-subgrid
        </div>
        <!-- Child spanning feature (wider, lighter) -->
        <div style="grid-column: feature;
                    background: rgba(236, 72, 153, 0.3);
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);">
          Child: .col-feature (aligns to feature area)
        </div>
        <!-- Child using subgrid to align to content (darker) -->
        <div style="grid-column: content;
                    background: rgb(236, 72, 153);
                    color: white;
                    padding: 0.75rem 1rem;
                    margin: 0.5rem 0;
                    font-size: 0.75rem;
                    font-weight: 700;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.5rem;">Child: .col-content</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">Subgrid lets children align to parent's named lines</div>
          <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature-right grid-cols-breakout-subgrid"&gt;
  &lt;div class="col-feature"&gt;Aligns to feature!&lt;/div&gt;
  &lt;div class="col-content"&gt;Aligns to content!&lt;/div&gt;
&lt;/div&gt;</pre>
          <div style="margin-top: 0.75rem;">
            <a href="https://caniuse.com/css-subgrid" target="_blank" rel="noopener" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">Check browser support</a>
            <span style="font-size: 0.5rem; opacity: 0.7; margin-left: 0.5rem;">(~90% as of Jan 2025)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Spacing Panel -->
    <div x-show="!showAdvanced"
         x-init="updateCurrentBreakpoint()"
         @mousemove.window="onDragSpacing($event)"
         @mouseup.window="stopDragSpacing()"
         :style="{
           position: 'fixed',
           left: spacingPanelPos.x + 'px',
           top: spacingPanelPos.y + 'px',
           zIndex: 30,
           pointerEvents: 'auto',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           width: '220px',
           fontFamily: 'system-ui, -apple-system, sans-serif',
           overflow: 'hidden'
         }">
      <!-- Header -->
      <div @mousedown="startDragSpacing($event)"
           @dblclick="spacingPanelCollapsed = !spacingPanelCollapsed; localStorage.setItem('breakoutGridSpacingCollapsed', spacingPanelCollapsed)"
           style="padding: 8px 12px; background: #1a1a2e; color: white; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px;">Spacing</span>
          <span style="font-size: 10px; font-weight: 600; color: white; background: transparent; border: 1.5px solid rgba(255,255,255,0.5); padding: 1px 6px; border-radius: 3px;" x-text="'@' + currentBreakpoint"></span>
        </div>
        <button @click.stop="spacingPanelCollapsed = !spacingPanelCollapsed; localStorage.setItem('breakoutGridSpacingCollapsed', spacingPanelCollapsed)" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 14px; line-height: 1; padding: 0;" x-text="spacingPanelCollapsed ? '+' : '−'"></button>
      </div>
      <!-- Content -->
      <div x-show="!spacingPanelCollapsed" style="padding: 12px;">
        <!-- Gap -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Gap</span>
            <span style="font-size: 9px; color: #9ca3af;">outer margins</span>
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <div style="width: var(--gap); height: 24px; background: #f97316; min-width: 20px;"></div>
            <div style="width: 24px; height: var(--gap); background: #f97316; min-height: 20px;"></div>
          </div>
          <div style="font-size: 9px; font-family: 'SF Mono', Monaco, monospace; color: #6b7280;">
            clamp(<span style="color: #10b981; font-weight: 600;" x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span style="color: #6366f1; font-weight: 600;" x-text="editValues['gapScale_' + (currentBreakpoint === 'mobile' ? 'default' : currentBreakpoint)] || gapScaleOptions[currentBreakpoint === 'mobile' ? 'default' : currentBreakpoint].value"></span>, <span style="color: #10b981; font-weight: 600;" x-text="editValues.maxGap || configOptions.maxGap.value"></span>)
          </div>
        </div>
        <!-- Breakout Padding -->
        <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Breakout</span>
            <span style="font-size: 9px; color: #9ca3af;">p-breakout / m-breakout</span>
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <div style="width: var(--breakout-padding); height: 24px; background: #8b5cf6; min-width: 20px;"></div>
            <div style="width: 24px; height: var(--breakout-padding); background: #8b5cf6; min-height: 20px;"></div>
          </div>
          <div style="font-size: 9px; font-family: 'SF Mono', Monaco, monospace; color: #6b7280;">
            clamp(<span style="color: #8b5cf6; font-weight: 600;" x-text="editValues.breakout_min || breakoutOptions.min.value"></span>, <span style="color: #8b5cf6; font-weight: 600;" x-text="editValues.breakout_scale || breakoutOptions.scale.value"></span>, <span style="color: #10b981; font-weight: 600;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span>)
          </div>
          <!-- Editable breakout values -->
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <div style="flex: 1;">
              <div style="font-size: 8px; color: #9ca3af; margin-bottom: 2px;">min</div>
              <div style="display: flex; align-items: center; gap: 2px;">
                <input type="number" :value="getBreakoutNumeric('min')" @input="updateBreakoutNumeric('min', $event.target.value)" step="0.5"
                       style="width: 100%; padding: 4px 6px; font-size: 10px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 3px; background: white; text-align: right;">
                <span style="font-size: 9px; color: #9ca3af;" x-text="getBreakoutUnit('min')"></span>
              </div>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 8px; color: #9ca3af; margin-bottom: 2px;">scale</div>
              <div style="display: flex; align-items: center; gap: 2px;">
                <input type="number" :value="getBreakoutNumeric('scale')" @input="updateBreakoutNumeric('scale', $event.target.value)" step="1"
                       style="width: 100%; padding: 4px 6px; font-size: 10px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 3px; background: white; text-align: right;">
                <span style="font-size: 9px; color: #9ca3af;" x-text="getBreakoutUnit('scale')"></span>
              </div>
            </div>
          </div>
          <div style="font-size: 8px; color: #9ca3af; font-style: italic;">max = popout width</div>
        </div>
      </div>
    </div>

    <!-- Grid Overlay (hidden in Advanced mode) -->
    <div x-show="!showAdvanced" x-init="$watch('isVisible', v => v && setTimeout(() => updateColumnWidths(), 50)); setTimeout(() => updateColumnWidths(), 100)" class="grid-cols-breakout breakout-visualizer-grid" style="height: 100%; position: relative; z-index: 2;">
      <template x-for="area in gridAreas" :key="area.name">
        <div :class="'col-' + area.name"
             @click="selectArea(area.name)"
             @mouseenter="hoveredArea = area.name"
             @mouseleave="hoveredArea = null"
             :style="{
               backgroundColor: (hoveredArea === area.name || isSelected(area.name)) ? area.color.replace('0.25', '0.6') : area.color,
               borderLeft: '1px solid ' + area.borderColor,
               borderRight: '1px solid ' + area.borderColor,
               position: 'relative',
               height: '100%',
               pointerEvents: 'auto',
               cursor: 'pointer',
               transition: 'background-color 0.2s'
             }">

          <!-- Label (centered) -->
          <div x-show="showLabels"
               :style="{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 backgroundColor: area.borderColor,
                 color: 'white',
                 padding: '0.75rem 1rem',
                 borderRadius: '0.375rem',
                 fontSize: '0.75rem',
                 fontWeight: '600',
                 textTransform: 'uppercase',
                 letterSpacing: '0.05em',
                 whiteSpace: 'nowrap',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 opacity: isSelected(area.name) ? '1' : '0.8',
                 textAlign: 'center',
                 zIndex: '10'
               }">
            <div x-text="area.label"></div>
            <div x-show="showClassNames"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '500',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.9',
              fontFamily: 'monospace'
            }" x-text="area.className"></div>
            <div x-show="showPixelWidths && columnWidths[area.name] > 0"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '600',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.75',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem'
            }" x-text="columnWidths[area.name] + 'px'"></div>
          </div>

          <!-- Lorem Ipsum Content (behind label) -->
          <div x-show="showLoremIpsum"
               :style="{
                 position: 'absolute',
                 inset: '0',
                 padding: showGapPadding ? 'var(--gap)' : (showBreakoutPadding ? 'var(--breakout-padding)' : '1.5rem 0'),
                 boxSizing: 'border-box',
                 overflow: 'hidden',
                 whiteSpace: 'pre-line',
                 fontSize: '1.125rem',
                 lineHeight: '1.75',
                 color: 'white',
                 textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                 zIndex: '1'
               }" x-text="loremContent"></div>

          <!-- p-gap / px-gap Padding Overlay -->
          <div x-show="showGapPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--gap)',
                 border: '2px dotted ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.2'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-gap</div>
          </div>

          <!-- p-breakout / px-breakout Padding Overlay -->
          <div x-show="showBreakoutPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--breakout-padding)',
                 border: '3px dashed ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.25'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-breakout</div>
          </div>

          <!-- Drag Handle - Left (edit mode only, for resizable columns) -->
          <div x-show="editMode && hoveredArea === area.name && getResizeConfig(area.name)"
               @mousedown.stop="startColumnResize($event, getResizeConfig(area.name))"
               :style="{
                 position: 'absolute',
                 left: '-4px',
                 top: '0',
                 width: '16px',
                 height: '100%',
                 cursor: 'ew-resize',
                 pointerEvents: 'auto',
                 zIndex: '100',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div :style="{
                width: '10px',
                height: '100px',
                background: area.borderColor,
                borderRadius: '5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '2px solid white'
              }"></div>
              <div :style="{
                background: area.borderColor,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }" x-text="area.name === 'content' ? '← min' : '↔'"></div>
            </div>
          </div>

          <!-- Content Min/Base/Max Visual Guides with integrated handles (edit mode only) -->
          <template x-if="editMode && area.name === 'content'">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
              <!-- Max boundary (outer, dotted) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMax || configOptions.contentMax.value,
                border: '3px dotted rgba(139, 92, 246, 0.9)',
                boxSizing: 'border-box',
                background: 'rgba(139, 92, 246, 0.05)'
              }">
                <div style="position: absolute; top: 8px; right: 8px; background: rgba(139, 92, 246, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  max: <span x-text="editValues.contentMax || configOptions.contentMax.value"></span>
                </div>
                <!-- Max drag handle on right edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMax')"
                     style="position: absolute; right: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(139, 92, 246); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Base boundary (middle, solid) - half height, inset, can overflow -->
              <div :style="{
                position: 'absolute',
                top: '25%',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentBase || configOptions.contentBase.value,
                border: '3px solid rgba(236, 72, 153, 1)',
                background: 'rgba(236, 72, 153, 0.5)',
                boxSizing: 'border-box',
                borderRadius: '4px'
              }">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(236, 72, 153, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                  base: <span x-text="editValues.contentBase || configOptions.contentBase.value"></span>
                </div>
                <!-- Base drag handle on right edge - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentBase')"
                     style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(236, 72, 153); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Min boundary (inner, dashed) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMin || configOptions.contentMin.value,
                border: '3px dashed rgba(168, 85, 247, 0.9)',
                background: 'rgba(168, 85, 247, 0.15)',
                boxSizing: 'border-box'
              }">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(168, 85, 247, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  min: <span x-text="editValues.contentMin || configOptions.contentMin.value"></span>
                </div>
                <!-- Min drag handle on left edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMin')"
                     style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(168, 85, 247); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
            </div>
          </template>

          <!-- Feature Min/Scale/Max Visual Guides with integrated handles (edit mode only) -->
          <template x-if="editMode && area.name === 'feature'">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
              <!-- Max boundary (outer, dotted) - anchored from right edge (content side) -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                right: '0',
                width: editValues.featureMax || configOptions.featureMax.value,
                border: '3px dotted rgba(6, 182, 212, 0.9)',
                boxSizing: 'border-box',
                background: 'rgba(6, 182, 212, 0.05)'
              }">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(6, 182, 212, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  max: <span x-text="editValues.featureMax || configOptions.featureMax.value"></span>
                </div>
                <!-- Max drag handle on left edge -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureMax')"
                     style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(6, 182, 212); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Scale boundary (middle, solid) - half height, inset -->
              <div :style="{
                position: 'absolute',
                top: '25%',
                bottom: '25%',
                right: '0',
                width: editValues.featureScale || configOptions.featureScale.value,
                border: '3px solid rgba(14, 165, 233, 1)',
                background: 'rgba(14, 165, 233, 0.5)',
                boxSizing: 'border-box',
                borderRadius: '4px'
              }">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(14, 165, 233, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                  scale: <span x-text="editValues.featureScale || configOptions.featureScale.value"></span>
                </div>
                <!-- Scale drag handle on left edge -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureScale')"
                     style="position: absolute; left: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(14, 165, 233); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Min boundary (inner, dashed) -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                right: '0',
                width: editValues.featureMin || configOptions.featureMin.value,
                border: '3px dashed rgba(56, 189, 248, 0.9)',
                background: 'rgba(56, 189, 248, 0.15)',
                boxSizing: 'border-box'
              }">
                <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(56, 189, 248, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  min: <span x-text="editValues.featureMin || configOptions.featureMin.value"></span>
                </div>
                <!-- Min drag handle on left edge, at bottom -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureMin')"
                     style="position: absolute; left: -8px; bottom: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(56, 189, 248); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>


    <!-- Control Panel - Ubiquiti-style -->
    <div :style="{
           position: 'fixed',
           bottom: '12px',
           right: '12px',
           pointerEvents: 'auto',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           width: '200px',
           fontFamily: 'system-ui, -apple-system, sans-serif',
           zIndex: '10000',
           overflow: 'hidden'
         }">

      <!-- Header -->
      <div @dblclick="controlPanelCollapsed = !controlPanelCollapsed"
           style="padding: 8px 12px; background: #1a1a2e; color: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px;">Grid</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);" x-text="version"></span>
          <span x-show="controlPanelCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11px; font-variant-numeric: tabular-nums; color: rgba(255,255,255,0.7);" x-text="viewportWidth + 'px'"></span>
          <button @click.stop="toggle()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">&times;</button>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div x-show="!controlPanelCollapsed">
      <!-- Action Buttons -->
      <div style="padding: 8px; background: white; border-bottom: 1px solid #e5e5e5; display: flex; gap: 6px;">
        <button @click="openEditor()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showEditor ? '#1a1a2e' : '#e5e5e5',
                  color: showEditor ? 'white' : '#374151'
                }">
          Config
        </button>
        <button @click="showDiagram = !showDiagram; if(showDiagram && Object.keys(editValues).length === 0) loadCurrentValues()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showDiagram ? '#1a1a2e' : '#e5e5e5',
                  color: showDiagram ? 'white' : '#374151'
                }">
          Diagram
        </button>
      </div>

      <!-- Display Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Display</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLabels" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Labels
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showClassNames" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Classes
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showMeasurements" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Values
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLoremIpsum" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Lorem
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showPixelWidths" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Pixels
          </label>
        </div>
      </div>

      <!-- Padding Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Padding</div>
        <div style="display: flex; gap: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showGapPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-gap
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showBreakoutPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-breakout
          </label>
        </div>
      </div>

      <!-- Advanced -->
      <div style="padding: 8px 12px; background: white;">
        <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
          <input type="checkbox" x-model="showAdvanced" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
          Advanced Spans
        </label>
      </div>

      <!-- Footer -->
      <div style="padding: 6px 12px; background: #f7f7f7; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 9px; color: #9ca3af; text-align: center;">
          <kbd style="background: #e5e5e5; padding: 1px 4px; border-radius: 2px; font-size: 9px; font-weight: 600; color: #374151;">⌘G</kbd> toggle
        </div>
      </div>

      <!-- Selected Area Info -->
      <div x-show="selectedArea" style="padding: 8px 12px; background: #f0f9ff; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 11px; color: #1a1a2e; font-weight: 600; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
      </div>
      </div><!-- End Collapsible Content -->

    </div>

    <!-- Floating Editor Window - Ubiquiti-style -->
    <div x-show="showEditor"
         @mousedown.self="startDrag($event)"
         @mousemove.window="onDrag($event)"
         @mouseup.window="stopDrag()"
         :style="{
           position: 'fixed',
           left: editorPos.x + 'px',
           top: editorPos.y + 'px',
           width: '280px',
           maxHeight: '85vh',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           pointerEvents: 'auto',
           zIndex: '10001',
           overflow: 'hidden',
           fontFamily: 'system-ui, -apple-system, sans-serif'
         }">
      <!-- Editor Header (draggable) -->
      <div @mousedown="startDrag($event)"
           @dblclick="configEditorCollapsed = !configEditorCollapsed"
           style="padding: 10px 12px; background: #1a1a2e; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px; letter-spacing: 0.3px;">Grid Config</span>
          <span x-show="configEditorCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <button @click.stop="closeEditor()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 2px 6px; cursor: pointer; font-size: 16px; line-height: 1;">&times;</button>
      </div>
      <!-- Editor Content -->
      <div x-show="!configEditorCollapsed" style="max-height: calc(85vh - 40px); overflow-y: auto;">
        <!-- Workflow tip -->
        <div style="background: #e8f4f8; padding: 8px 12px; font-size: 10px; color: #1a1a2e; line-height: 1.4; border-bottom: 1px solid #e5e5e5;">
          Start with <strong>content</strong>, then build outward: popout → feature → full
        </div>

        <!-- Track overflow warning -->
        <div x-show="getTrackOverflowWarning()"
             style="background: #fef3c7; padding: 8px 12px; font-size: 10px; color: #92400e; line-height: 1.4; border-bottom: 1px solid #fcd34d;">
          <span style="font-weight: 600;">⚠️</span> <span x-text="getTrackOverflowWarning()"></span>
        </div>

        <!-- Content Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('content')" style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;" :style="{ color: sectionCopied === 'content' ? '#10b981' : '#6b7280' }">
            <span x-text="sectionCopied === 'content' ? '✓ Copied' : 'Content (Text Width)'"></span>
          </div>
          <template x-for="key in ['contentMin', 'contentBase', 'contentMax']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('content', '').toLowerCase()"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
          <!-- Readability warning -->
          <div x-show="getContentReadabilityWarning()"
               x-data="{ expanded: false }"
               style="margin-top: 6px; padding: 6px 8px; background: #fef3c7; border-radius: 4px; border: 1px solid #fcd34d;">
            <div @click="expanded = !expanded" style="display: flex; align-items: flex-start; gap: 6px; cursor: pointer;">
              <svg style="width: 14px; height: 14px; color: #b45309; flex-shrink: 0; margin-top: 1px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-size: 10px; font-weight: 600; color: #92400e;">Wide for reading</div>
                <div x-show="!expanded" style="font-size: 9px; color: #b45309; margin-top: 2px;">Ideal: 45–55rem for prose. Click for details.</div>
                <div x-show="expanded" x-transition style="font-size: 9px; color: #78350f; margin-top: 4px; line-height: 1.4;">
                  At 16px base, 55rem+ can hit 100+ characters/line—too wide for comfortable reading.<br><br>
                  <strong>Guidelines (at 1rem/16px):</strong><br>
                  • 45ch ≈ 35–40rem (min)<br>
                  • 66ch ≈ 45–50rem (ideal)<br>
                  • 75ch ≈ 50–55rem (max)<br><br>
                  Fine for mixed layouts; consider tightening for prose-heavy pages.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Default Column Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div @click="copySection('defaultCol')" style="cursor: pointer;">
              <div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;" :style="{ color: sectionCopied === 'defaultCol' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'defaultCol' ? '✓ Copied' : 'Default Column'"></div>
              <div style="font-size: 9px; color: #9ca3af; margin-top: 2px;">For children without col-* class</div>
            </div>
            <select @change="editValues.defaultCol = $event.target.value; configCopied = false"
                    :value="editValues.defaultCol || configOptions.defaultCol.value"
                    style="padding: 6px 8px; font-size: 11px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; cursor: pointer;">
              <template x-for="opt in configOptions.defaultCol.options" :key="opt">
                <option :value="opt" :selected="(editValues.defaultCol || configOptions.defaultCol.value) === opt" x-text="opt"></option>
              </template>
            </select>
          </div>
        </div>

        <!-- Track Widths Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('tracks')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer;" :style="{ color: sectionCopied === 'tracks' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'tracks' ? '✓ Copied' : 'Track Widths'"></div>
          <template x-for="key in ['popoutWidth', 'fullLimit']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('Width', '')"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Feature Section (Track Width) -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('feature')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer;" :style="{ color: sectionCopied === 'feature' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'feature' ? '✓ Copied' : 'Feature (Track Width)'"></div>
          <!-- featureMin (locked) -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="font-size: 11px; color: #9ca3af;">min <span style="font-size: 8px;" title="Must be 0 for track to collapse">(locked)</span></span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('featureMin')" disabled
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f3f4f6; color: #9ca3af; text-align: right; cursor: not-allowed;">
              <select disabled style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f3f4f6; color: #9ca3af; width: 50px; text-align: center; cursor: not-allowed;">
                <option selected>rem</option>
              </select>
            </div>
          </div>
          <!-- featureScale and featureMax -->
          <template x-for="key in ['featureScale', 'featureMax']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('feature', '').toLowerCase()"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Gap Section (Outer Margins) -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('gap')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; cursor: pointer;" :style="{ color: sectionCopied === 'gap' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'gap' ? '✓ Copied' : 'Outer Margins'"></div>
          <div style="font-size: 9px; color: #9ca3af; margin-bottom: 8px; line-height: 1.4;">Space between viewport edge and content. Auto-centers your layout.</div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <span style="font-size: 11px; color: #374151;">min</span>
              <span style="font-size: 9px; color: #9ca3af; margin-left: 4px;">floor</span>
              <span style="font-size: 8px; color: #10b981; margin-left: 4px; font-weight: 500;">live</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('baseGap')" @input="updateNumericValue('baseGap', $event.target.value)" step="0.5"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <select @change="updateUnit('baseGap', $event.target.value)" :value="getUnit('baseGap')"
                      style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                <template x-for="u in unitOptions" :key="u">
                  <option :value="u" :selected="getUnit('baseGap') === u" x-text="u"></option>
                </template>
              </select>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <span style="font-size: 11px; color: #374151;">max</span>
              <span style="font-size: 9px; color: #9ca3af; margin-left: 4px;">ceiling</span>
              <span style="font-size: 8px; color: #10b981; margin-left: 4px; font-weight: 500;">live</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('maxGap')" @input="updateNumericValue('maxGap', $event.target.value)" step="1"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <select @change="updateUnit('maxGap', $event.target.value)" :value="getUnit('maxGap')"
                      style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                <template x-for="u in unitOptions" :key="u">
                  <option :value="u" :selected="getUnit('maxGap') === u" x-text="u"></option>
                </template>
              </select>
            </div>
          </div>

          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 10px 0 2px;">Responsive Scale <span style="font-size: 8px; color: #10b981; font-weight: 500; text-transform: none;">live preview</span></div>
          <div style="font-size: 9px; color: #9ca3af; margin-bottom: 6px; line-height: 1.4;">Fluid value (vw) that grows with viewport. Active breakpoint previews live.</div>
          <template x-for="key in Object.keys(gapScaleOptions)" :key="'ed_gs_'+key">
            <div :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 6px',
              margin: '0 -6px',
              borderBottom: '1px solid #f3f4f6',
              borderRadius: '4px',
              background: (key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              border: (key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'
            }">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 11px; color: #374151;" x-text="key === 'default' ? 'mobile' : key"></span>
                <span x-show="(key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint"
                      style="font-size: 8px; font-weight: 600; color: #f97316;">ACTIVE</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getGapScaleNumeric(key)" @input="updateGapScaleNumeric(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <span style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getGapScaleUnit(key)"></span>
              </div>
            </div>
          </template>

          <!-- Live formula preview -->
          <div style="margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 4px; font-family: 'SF Mono', Monaco, monospace; font-size: 9px; line-height: 1.6;">
            <div style="color: #6b7280; margin-bottom: 4px;">Generated CSS:</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">mobile:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_default || gapScaleOptions.default.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">lg:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_lg || gapScaleOptions.lg.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">xl:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_xl || gapScaleOptions.xl.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="padding: 10px 12px; background: #f7f7f7; display: flex; gap: 8px;">
          <button @click="copyConfig()" :style="{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '600', border: 'none', borderRadius: '4px', cursor: 'pointer', background: copySuccess ? '#10b981' : '#1a1a2e', color: 'white', transition: 'background 0.2s' }">
            <span x-text="copySuccess ? '✓ Copied' : 'Copy Variables'"></span>
          </button>
          <button @click="openRestoreModal()" style="padding: 8px 12px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;" title="Restore from CSS variables">
            Restore
          </button>
          <button @click="downloadCSS()" style="padding: 8px 12px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;">
            CSS
          </button>
        </div>
      </div>
    </div>

    <!-- Restore Config Modal -->
    <div x-show="showRestoreModal"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10002; pointer-events: auto;">
      <div @click.stop style="background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); width: 400px; max-width: 90vw; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Modal Header -->
        <div style="padding: 12px 16px; background: #1a1a2e; color: white; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 13px;">Restore Config</span>
          <button @click="closeRestoreModal()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 18px; line-height: 1;">&times;</button>
        </div>
        <!-- Modal Body -->
        <div style="padding: 16px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0; line-height: 1.5;">Paste the <code style="background: #f3f4f6; padding: 1px 4px; border-radius: 3px;">:root { }</code> block from your exported CSS file:</p>
          <p style="font-size: 10px; color: #9ca3af; margin: 0 0 12px 0;">Look for "CONFIGURATION VARIABLES" section in _objects.breakout-grid.css</p>
          <textarea x-model="restoreInput"
                    @keydown.meta.enter="restoreConfig()"
                    @keydown.ctrl.enter="restoreConfig()"
                    placeholder=":root {
  --base-gap: 1rem;
  --max-gap: 15rem;
  --content-min: 53rem;
  ...
}"
                    style="width: 100%; height: 200px; padding: 12px; font-family: 'SF Mono', Monaco, monospace; font-size: 11px; border: 1px solid #e5e5e5; border-radius: 4px; resize: vertical; box-sizing: border-box;"></textarea>
          <!-- Error message -->
          <div x-show="restoreError" x-text="restoreError" style="margin-top: 8px; padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; color: #dc2626; font-size: 11px;"></div>
          <p style="font-size: 10px; color: #9ca3af; margin: 8px 0 0 0;">Press ⌘/Ctrl + Enter to apply</p>
        </div>
        <!-- Modal Footer -->
        <div style="padding: 12px 16px; background: #f7f7f7; border-radius: 0 0 8px 8px; display: flex; justify-content: flex-end; gap: 8px;">
          <button @click="closeRestoreModal()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;">Cancel</button>
          <button @click="restoreConfig()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; background: #1a1a2e; color: white;">Apply</button>
        </div>
      </div>
    </div>

    <!-- Grid Diagram -->
    <div x-show="showDiagram"
         style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); pointer-events: auto; z-index: 10001; padding: 1.5rem; max-width: 90vw;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-weight: 700; font-size: 0.875rem; color: #111827;">Breakout Grid Structure</span>
        <button @click="showDiagram = false" style="background: #ef4444; border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; font-weight: 600;">Close</button>
      </div>
      <!-- Visual Diagram -->
      <div style="font-family: Monaco, monospace; font-size: 0.625rem; line-height: 1.8;">
        <!-- Column structure visualization -->
        <div style="display: flex; align-items: stretch; border: 2px solid #e5e7eb; border-radius: 0.25rem; overflow: hidden; min-height: 120px;">
          <!-- Full left -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
          <!-- Feature left -->
          <div style="background: rgba(6, 182, 212, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #0891b2; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="(editValues.featureMin || configOptions.featureMin.value) + ' - ' + (editValues.featureMax || configOptions.featureMax.value)"></div>
          </div>
          <!-- Popout left -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Content -->
          <div style="background: rgba(168, 85, 247, 0.2); padding: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; min-width: 80px;">
            <div style="color: #7c3aed; font-weight: 700;">content</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="'(' + (editValues.contentMin || configOptions.contentMin.value) + ' - ' + (editValues.contentMax || configOptions.contentMax.value) + ')'"></div>
          </div>
          <!-- Popout right -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Feature right -->
          <div style="background: rgba(6, 182, 212, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #0891b2; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="(editValues.featureMin || configOptions.featureMin.value) + ' - ' + (editValues.featureMax || configOptions.featureMax.value)"></div>
          </div>
          <!-- Full right -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
        </div>
        <!-- Legend -->
        <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.5625rem;">
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(239, 68, 68, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-full</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(6, 182, 212, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-feature</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(34, 197, 94, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-popout</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(168, 85, 247, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-content</div>
        </div>
        <!-- Padding explanation -->
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.25rem; font-size: 0.5625rem; color: #4b5563;">
          <div style="font-weight: 700; margin-bottom: 0.25rem;">px-breakout aligns full-width content:</div>
          <div>Uses <span style="color: #3b82f6;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span> padding so content aligns with .col-content edge</div>
        </div>
      </div>
    </div>

  </div>
`;
  (function() {
    document.addEventListener("alpine:init", () => {
      Alpine.data("breakoutGridVisualizer", () => ({
        // Constants
        version: VERSION,
        loremContent: LOREM_CONTENT,
        // Configuration
        gridAreas: GRID_AREAS,
        configOptions: CONFIG_OPTIONS,
        gapScaleOptions: GAP_SCALE_OPTIONS,
        breakoutOptions: BREAKOUT_OPTIONS,
        breakpointOptions: BREAKPOINT_OPTIONS,
        // State
        ...createInitialState(),
        // Methods
        ...methods,
        // CSS export
        generateCSSExport,
        cssExportVersion: BUILD_VERSION,
        // Template
        template
      }));
    });
    function injectVisualizer() {
      if (document.getElementById("breakout-grid-visualizer-root")) return;
      const container = document.createElement("div");
      container.id = "breakout-grid-visualizer-root";
      container.setAttribute("x-data", "breakoutGridVisualizer");
      container.setAttribute("x-html", "template");
      document.body.appendChild(container);
      console.log("Breakout Grid Visualizer injected. Press Ctrl/Cmd + G to toggle.");
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(injectVisualizer, 10);
      });
    } else {
      document.addEventListener("alpine:initialized", injectVisualizer);
      setTimeout(injectVisualizer, 100);
    }
  })();
})();
