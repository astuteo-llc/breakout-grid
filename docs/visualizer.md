# Grid Visualizer

An Alpine.js-powered visual debugging tool that helps designers see and understand the grid structure while building layouts. The visualizer provides real-time feedback about grid behavior and measurements.

> **⚠️ DEVELOPMENT ONLY**: This tool is intended for local development only. Never include it in production builds. It adds ~124KB of JavaScript and exposes configuration internals.

> **Using standalone CSS?** See [Visualizer Lite](visualizer-lite.md) for a lightweight (~31KB) read-only version without config editing features.

## Features

- **Visual overlay** showing all grid columns with color-coded boundaries
- **Interactive column selection** - click any column to highlight and identify
- **Column labels** with both human-readable names and CSS class names
- **Live measurements** displaying current CSS variable values in real-time
- **Viewport width tracker** for responsive debugging
- **Padding visualization** for `p-gap` utility
- **Keyboard shortcut** (Ctrl/Cmd + G) to toggle visibility
- **Persistent state** remembers visibility and settings across page reloads
- **Responsive updates** automatically refreshes measurements on window resize
- **Version display** in control panel header
- **Config editor** - floating draggable window for live configuration editing
- **Grid structure diagram** - visual representation of the grid template (toggle show/hide)
- **Advanced spans view** - demonstrates start/end utilities and CSS subgrid
- **CSS download (beta)** - export standalone CSS for non-Tailwind projects

## Visual Indicators

The visualizer uses a consistent color scheme to identify different grid areas:

- **Full** (Red) - Edge-to-edge viewport width
- **Full Limit** (Dark Red) - Maximum container width
- **Feature** (Cyan) - Extra wide content areas with min/scale/max clamp
- **Popout** (Green) - Slightly wider than standard content
- **Content** (Purple) - Standard content width with min/base/max clamp

## Interactive Controls

- **Labels Toggle** - Show/hide column name labels
- **Class Names Toggle** - Display CSS class names (e.g., `.col-feature`)
- **Values Toggle** - Show/hide live CSS variable measurements
- **Lorem Toggle** - Fill columns with lorem ipsum to visualize text flow
- **p-gap Visualization** - Overlay showing `p-gap` padding areas
- **Column Selection** - Click any column to highlight and view details

## Installation

> **⚠️ CRITICAL**: The visualizer must ONLY be loaded in development environments. Use environment checks to prevent it from ever reaching production.

The visualizer auto-injects into the DOM when loaded—no manual HTML markup required. Just include the scripts conditionally based on your environment.

### Craft CMS

```twig
{# Only load in Craft's devMode #}
{% if craft.app.config.general.devMode %}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script defer src="/path/to/breakout-grid-visualizer.js"></script>
{% endif %}
```

### Laravel / Blade

```blade
{{-- Only load in local environment --}}
@if(app()->environment('local'))
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script defer src="{{ asset('js/breakout-grid-visualizer.js') }}"></script>
@endif
```

### Vite / Modern Build

```javascript
import Alpine from 'alpinejs'

async function initAlpine() {
  // Prevent double initialization during HMR
  if (window.__alpineStarted) return;

  // Load visualizer only in development (before Alpine.start)
  if (import.meta.env.DEV) {
    try {
      await import('@astuteo/tailwind-breakout-grid/breakout-grid-visualizer.js');
    } catch (e) {
      console.warn('[Alpine] Failed to load breakout-grid-visualizer:', e.message);
    }
  }

  Alpine.start();
  window.__alpineStarted = true;
}

window.Alpine = Alpine;
initAlpine();
```

### Static HTML (with manual check)

```html
<script>
  // Only load in development (check your domain or flag)
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    document.write('<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>');
    document.write('<script defer src="/breakout-grid-visualizer.js"><\/script>');
  }
</script>
```

**Key points:**
- The visualizer auto-injects—no `<div x-data="...">` needed in your HTML
- Always wrap in environment/devMode checks
- Press `Ctrl/Cmd + G` to toggle once loaded

## Usage

Once loaded, the visualizer can be controlled in three ways:

1. **Keyboard shortcut**: Press `Ctrl/Cmd + G` to toggle
2. **Toggle button**: Add a button that triggers the visualizer
3. **Programmatically**: Access via Alpine's `$data` API

```javascript
// Get the visualizer component
const visualizer = Alpine.$data(document.querySelector('[x-data*="breakoutGridVisualizer"]'));

// Toggle visibility
visualizer.toggle();

// Show/hide options
visualizer.showLabels = false;
visualizer.showClassNames = true;
visualizer.showMeasurements = false;
visualizer.showGapPadding = true;
visualizer.showBreakoutPadding = true;
```

## Controls Panel

When active, the visualizer displays a control panel with:

- **Viewport Width**: Current browser width in pixels
- **Current Values**: Live CSS variable measurements (--gap, --content, etc.)
- **Show Options**:
  - **Labels**: Toggle column name labels (e.g., "Full", "Feature", "Content")
  - **Class Names**: Toggle CSS class names (e.g., `.col-full`, `.col-feature`)
  - **Values**: Toggle measurement display
  - **p-gap**: Visualize the padding created by `p-gap`/`px-gap` utilities
- **Selected Column**: Click any column to highlight and view its class name

## Config Editor

The visualizer includes a floating config editor that allows real-time adjustment of grid values:

**Live-editable values:**
- `contentMin` / `contentBase` / `contentMax` - Content column clamp values
- `featureMin` / `featureScale` / `featureMax` - Feature track clamp values
- `popoutWidth` - Popout extension distance
- `baseGap` / `maxGap` - Gap floor and ceiling
- `gapScale` (per breakpoint) - Responsive gap scaling

To open the editor, click the "Config" button in the control panel. The editor window is draggable and includes:
- Copy button to export the modified config
- Export CSS button for standalone use
- Unsaved changes warning when closing with uncommitted edits

### Visual Drag Handles

When the config editor is open, column boundaries become interactive:

- **Hover over columns** to reveal drag handles on the edges
- **Drag left/right** to adjust track widths visually
- **Content column** shows three nested boundaries (min/base/max) with individual drag handles
- **Feature column** shows three nested boundaries (min/scale/max) with individual drag handles

This provides an intuitive way to experiment with grid proportions before copying the config.

## CSS Download (Beta)

Generate a standalone CSS file for projects not using Tailwind:

1. Click "Download CSS" in the control panel
2. A CSS file is generated with all breakout grid utilities
3. Includes CSS custom properties, grid templates, column utilities, and spacing classes

> **Note:** This feature is in beta. The generated CSS may need adjustment for production use.

## Advanced Spans View

Shows usage examples for:
- Start/end column utilities (`col-start-*`, `col-end-*`)
- Left/right span utilities (`col-*-left`, `col-*-right`)
- CSS subgrid with `grid-cols-breakout-subgrid`

The subgrid demo shows how nested elements can inherit and align to the parent grid's named tracks.

## Demo

Open `demo.html` in your browser to see the visualizer in action. Press `Ctrl/Cmd + G` to toggle it on and off.

## Files

- `breakout-grid-visualizer.js` - The full Alpine.js component (~124KB)
- `breakout-grid-visualizer-lite.js` - Lightweight read-only version (~31KB) - see [Visualizer Lite](visualizer-lite.md)
- `craft-integration.twig` - Complete CraftCMS integration example
- `demo/index.html` - Interactive demonstration (full version)
- `demo/lite.html` - Standalone CSS demonstration (lite version)

## See Also

- [Visualizer Lite](visualizer-lite.md) - Lightweight version for standalone CSS users
- [Main README](../README.md) - Complete plugin documentation
