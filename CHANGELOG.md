# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.0] - 2026-04-19

### Primary consumption pattern

The package is now oriented around the **visualizer download** as the primary way to consume the grid. Generate the CSS once with the settings you want, drop it into your project source, and import it directly. npm install still works for loading the visualizer (and as a legacy CSS-import path), but it's no longer the intended production flow.

### ⚠ Breaking

**1. Removed `.col-full-limit` utility.** Use Tailwind's own `max-w-*` utilities with `mx-auto` on `col-full` instead. The `fullLimit` plugin config option and the `--full-limit` CSS variable are also removed.

```html
<!-- before -->
<div class="col-full-limit">...</div>

<!-- after -->
<div class="col-full max-w-[115rem] mx-auto">...</div>
```

For a reusable token, define it in your Tailwind theme (`--max-w-breakout: 115rem`) and use `max-w-breakout`.

**2. Removed `.col-*-to-*` partial-span utilities** (`col-feature-to-popout`, `col-feature-to-content`, `col-feature-to-center`, `col-popout-to-content`, `col-popout-to-center`, `col-popout-to-feature`, `col-content-to-center`, `col-content-to-popout`, `col-content-to-feature`). Compose `col-start-*` with `col-end-*`, or drop to an arbitrary `grid-column` value — the center-line patterns (the main use case) stay straightforward:

```html
<!-- before -->
<div class="col-feature-to-center">...</div>

<!-- after -->
<div class="col-start-feature col-end-center">...</div>
<!-- or -->
<div class="[grid-column:feature-start/center-end]">...</div>

<!-- Symmetric split around the grid's center line -->
<section class="grid-cols-breakout">
  <div class="col-start-feature col-end-center">Left half</div>
  <div class="col-start-center col-end-feature">Right half</div>
</section>
```

**3. Removed `.breakout-none`, `.breakout-none-flex`, `.breakout-none-grid`** and the `col-*` descendant reset. The three display classes are 1-to-1 with Tailwind's `block`, `flex`, `grid`. For sidebar-style layouts, use a native Tailwind grid on a `col-feature` (or similar) container and keep the inner content free of `col-*` classes:

```html
<main class="grid-cols-breakout">
  <div class="col-feature grid grid-cols-[250px_1fr] gap-8">
    <aside>...</aside>
    <div>...</div>
  </div>
</main>
```

**5. Removed the `.p-popout-to-content` and `.p-feature-to-content` alignment utilities** (14 rules) along with the `--popout-to-content` and `--feature-to-content` computed CSS variables. Rarely used — when you do need to align content inside a wider column with the content column edge, compose it with Tailwind arbitrary values using the grid vars that are still exposed:

```html
<!-- before -->
<div class="col-popout px-popout-to-content">...</div>

<!-- after -->
<div class="col-popout px-[var(--popout-width)]">...</div>

<!-- feature-to-content equivalent -->
<div class="col-feature px-[calc(clamp(var(--feature-min),var(--feature-scale),var(--feature-max))+var(--popout-width))]">...</div>
```

**4. Removed the `full-gap` spacing family** (`.p-full-gap`, `.m-full-gap`, `.-m-full-gap`, and all their axis variants) and the `--computed-gap` CSS variable. The "larger gap for full-width" pattern was niche and adequately served by Tailwind's arbitrary value syntax when it's actually needed:

```html
<!-- before -->
<section class="col-full py-full-gap">...</section>

<!-- after (arbitrary value) -->
<section class="col-full py-[max(var(--gap),calc((100vw-var(--content))/10))]">...</section>

<!-- or register a token in your Tailwind theme -->
<!--   @theme { --spacing-full-gap: max(var(--gap), calc((100vw - var(--content)) / 10)); } -->
<section class="col-full py-full-gap">...</section>
```

### Added

- **`/* @formatter:off */` pragma** at the top of every generated CSS file so JetBrains-family IDEs don't auto-reformat on save

### Changed

- **`.p-breakout` / `.m-breakout` are now aliases for `.p-popout` / `.m-popout`** — both emit `var(--popout-width)` (the fixed popout track width). The fluid clamp they previously used (`clamp(--breakout-min, --breakout-scale, --popout-width)`) was too close to `--popout-width` to justify carrying both systems. The `--breakout-padding`, `--breakout-min`, `--breakout-scale` CSS variables and the `breakoutMin`/`breakoutScale`/`breakoutPadding` plugin config options are removed. If you need a custom fluid clamp, drop to Tailwind's arbitrary value syntax: `p-[clamp(1rem,5vw,var(--popout-width))]`.
- **Combined CSS** is **17.9 KB raw / 3.2 KB gzip** (Tailwind flavor: 19.3 KB / 3.4 KB gzip), down from ~26 KB / 5.7 KB gzip in v5
- **dist output** collapsed from four files (core + extras × plain/Tailwind) to two (single unified output × plain/Tailwind)
- **Removed stale `style` field** from `package.json` — superseded by the `exports` map
- **CSS generator** simplified to a single parameterized `generateCSSExport(config, { tailwind })` entry point
- **Primary consumption pattern** is now the visualizer download — copy the generated file into your project source rather than importing from `node_modules`. npm install still works for loading the visualizer itself

### What ships

All utilities live in one unified layer — grid containers, column placement, and gap/popout spacing. The CSS output is section-organized (see the TOC in the generated file's header) but there's no programmatic split to opt in or out of.

## [5.0.0] - 2025-01-26

### Breaking Changes

- **Pure CSS distribution** - The package now exports standalone CSS as the primary format
- **Tailwind plugin deprecated** - `index.js` still works but is no longer the recommended approach
- **Removed config option:** `featureWidth` - replaced by `featureMin`, `featureScale`, `featureMax` for fluid behavior

### Added

- **Fluid feature track** - Feature column now uses `clamp(featureMin, featureScale, featureMax)` for responsive behavior
- **Breakout padding config** - New `breakoutMin` and `breakoutScale` options for fluid breakout padding
- **Dynamic versioning** - Visualizer version now reads from package.json at build time

### Changed

- Main package export is now `dist/_objects.breakout-grid.css`
- Visualizer available as optional imports: `@astuteo/breakout-grid/visualizer`
- TypeScript definitions updated with new config options

### Migration from v3

1. **If using Tailwind plugin:** Continue using `index.js` - it still works
2. **For new projects:** Use the CSS file directly:
   ```html
   <link rel="stylesheet" href="breakout-grid.css">
   ```
3. **Update config** if customizing feature track:
   - `featureWidth: '12vw'` → `featureMin: '0rem'`, `featureScale: '12vw'`, `featureMax: '12rem'`

## [3.0.0] - 2025-01-14

### Breaking Changes

- **Removed `narrow` column level** - Grid now has 5 levels instead of 6: `full → feature → popout → content → center`
- **Removed classes:** `col-narrow`, `col-narrow-left`, `col-narrow-right`, `col-start-narrow`, `col-end-narrow`, `grid-cols-narrow-left`, `grid-cols-narrow-right`, `breakout-to-narrow`
- **Renamed config options:** `narrowMin` → `contentMin`, `narrowMax` → `contentMax`, `narrowBase` → `contentBase`
- **Removed config option:** `content` (the old fixed 4vw rail width)
- **New default values:** `contentMin: '53rem'`, `contentMax: '61rem'`, `contentBase: '75vw'`

### Migration Guide

1. **Find and replace** in your codebase:
   - `col-narrow` → `col-content`
   - `col-narrow-left` → `col-content-left`
   - `col-narrow-right` → `col-content-right`
   - `col-start-narrow` → `col-start-content`
   - `col-end-narrow` → `col-end-content`
   - `grid-cols-narrow-left` → `grid-cols-content-left`
   - `grid-cols-narrow-right` → `grid-cols-content-right`
   - `breakout-to-narrow` → `breakout-to-content`

2. **Update config** if customizing:
   - `narrowMin` → `contentMin`
   - `narrowMax` → `contentMax`
   - `narrowBase` → `contentBase`
   - Remove `content` if present

3. **Backward compatibility:** `col-narrow` classes still work as aliases to `col-content`, but updating is recommended.

### Added

- **Pixel width readout** in visualizer - each column label now shows computed width in pixels
- **Fluid content column** - `col-content` now uses CSS clamp() like the old narrow column for optimal responsive behavior

### Changed

- Content column is now the innermost column with fluid width (previously was a fixed 4vw rail)
- Simplified grid template structure with fewer named lines
- Updated visualizer to reflect 5-column structure

## [2.2.0] - 2025-01-14

### Improved

- **Documentation** - Process for removal of narrow column documented

## [2.1.0] - 2025-01-11

### Added

- **CSS Subgrid Support:**
  - New `grid-cols-breakout-subgrid` utility for nested elements that inherit parent grid tracks
  - Enables children to align to the parent breakout grid's named lines
  - [Browser support at ~90%](https://caniuse.com/css-subgrid) as of January 2025

### Improved

- **Grid Visualizer Enhancements:**
  - Version number display in control panel
  - Floating draggable config editor window
  - Grid structure diagram (show/hide toggle)
  - Number inputs with unit suffixes and arrow key increment/decrement
  - Live editing for popoutWidth, featureWidth, and content values
  - "Requires rebuild" notes for gapScale and defaultCol
  - Content minimum validation
  - Unsaved changes warning when closing editor
  - Subgrid demo in Advanced Spans view
  - CSS Download feature (beta) - generates standalone CSS for non-Tailwind use

## [1.1.6] - 2025-10-30

### Fixed

- **Tailwind v4 Compatibility:**
  - Fixed negative margin utilities to use `matchUtilities` API instead of `addUtilities`
  - Negative margins now work properly: `-m-gap`, `-mx-breakout`, etc.
  - Follows Tailwind's built-in pattern for negative value support

## [1.1.5] - 2025-10-30

### Added

- **Margin Breakout Utilities:**
  - `m-breakout`, `mx-breakout`, `my-breakout`, `mt-breakout`, `mr-breakout`, `mb-breakout`, `ml-breakout`
  - Responsive margin utilities matching `p-breakout` pattern for consistent spacing
  - Equivalent to traditional patterns like `mx-6 md:mx-16 lg:mx-20`

- **Negative Margin Utilities:**
  - All margin utilities now have negative versions: `-m-breakout`, `-mx-breakout`, etc.
  - Negative versions for gap-based margins: `-m-gap`, `-mx-gap`, `-m-full-gap`, etc.
  - Negative versions for popout margins: `-m-popout`, `-mx-popout`, etc.
  - Useful for breaking out of padded containers

- **Configuration Validation:**
  - Built-in validation for configuration values with helpful warnings
  - Validates CSS units and provides clear error messages without breaking builds
  - Improved error handling with graceful fallbacks

### Improved

- **Grid Visualizer Enhancements:**
  - Added padding visualization overlays for `p-gap` and `p-breakout` utilities
  - Toggle controls to show/hide padding areas with dotted/dashed borders
  - Added "Show Class Names" toggle (unchecked by default) to display CSS class names
  - Reorganized control panel with "SHOW" heading for better organization
  - All toggles now grouped under clear section heading

- **Module System:**
  - Confirmed CommonJS pattern using `module.exports` for maximum compatibility
  - Follows Tailwind Labs official plugin conventions
  - Works seamlessly with both CommonJS and ESM config files

- **Debug Logging:**
  - Improved debug output to show validated template parameters
  - Better error messages throughout the plugin

## [1.1.2] - 2025-10-30

### Improved

- **Grid Visualizer Enhancements:**
  - Display class names (`.col-full`, `.col-feature`, etc.) below each label in monospace font
  - Add `col-full-limit` as a visible option in the grid overlay
  - Show selected column's class name in control panel
  - Better label styling and spacing

## [1.1.1] - 2025-10-30

### Fixed

- Fixed Tailwind v4 compatibility issue with `p-breakout` utilities
- Changed implementation to use CSS custom properties instead of nested media queries in `addUtilities()`
- Aligns with same pattern used for gap scaling for consistency

## [1.1.0] - 2025-10-30

### Added

- Fixed responsive padding utilities (`p-breakout`, `px-breakout`, etc.) for legacy project integration
- `breakoutPadding` configuration option to customize responsive padding values
- Documentation section on integrating with existing projects using `max-w-*` containers
- Comparison table mapping Tailwind max-width utilities to breakout grid columns
- Migration checklist for converting legacy layouts
- "Using p-breakout for Easy Migration" guide with before/after examples

## [1.0.0] - 2025-10-30

### Added

- Initial release of the Tailwind Breakout Grid plugin
- 6 content width levels: narrow, content, popout, feature, full, and center
- Responsive gap scaling with customizable breakpoints
- Left/right aligned nested grids for asymmetric layouts
- Spacing utilities (p-gap, m-gap, etc.) based on grid measurements
- Fine-grained column control with start/end utilities
- Alpine.js-based grid visualizer for development
- CraftCMS integration template for dev mode only
- Comprehensive documentation and demo HTML
- TypeScript type definitions for IDE support
- Full configuration options with sensible defaults

### Features

- Pure CSS Grid implementation with no JavaScript dependencies
- Fluid responsive design using CSS clamp()
- Optimal reading width constraints (40-50rem for narrow columns)
- Automatic default column assignment for child elements
- Debug mode for template generation logging

[5.0.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v5.0.0
[3.0.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v3.0.0
[2.2.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v2.2.0
[2.1.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v2.1.0
[1.1.6]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.1.6
[1.1.5]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.1.5
[1.1.2]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.1.2
[1.1.1]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.1.1
[1.1.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.1.0
[1.0.0]: https://github.com/astuteo-llc/breakout-grid/releases/tag/v1.0.0
