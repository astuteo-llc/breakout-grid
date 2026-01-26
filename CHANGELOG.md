# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- Main package export is now `dist/breakout-grid.css`
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
