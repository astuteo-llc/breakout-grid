# Grid Visualizer Lite

A lightweight, read-only version of the Grid Visualizer for projects using standalone CSS instead of the Tailwind plugin.

> **⚠️ DEVELOPMENT ONLY**: Like the full visualizer, this tool is for local development only. Never include it in production builds.

## When to Use Lite vs Full

| Feature | Full Visualizer | Lite Visualizer |
|---------|----------------|-----------------|
| Grid overlay | Yes | Yes |
| Column labels & measurements | Yes | Yes |
| Lorem ipsum toggle | Yes | Yes |
| Advanced spans demo | Yes | Yes |
| Spacing panel (gap/breakout) | Yes | Yes |
| Keyboard toggle (Ctrl/Cmd+G) | Yes | Yes |
| Config editor | Yes | No |
| CSS export/download | Yes | No |
| Drag handles for editing | Yes | No |
| File size | ~124 KB | ~31 KB |

**Use the full visualizer** when using the Tailwind plugin and you want to experiment with configuration values.

**Use the lite visualizer** when using exported/standalone CSS and you only need to visualize the grid structure.

## Download

### Option 1: Direct Download from GitHub

Download the latest `breakout-grid-visualizer-lite.js` directly from the repository:

```
https://raw.githubusercontent.com/astuteo-llc/tailwind-breakout-grid/master/breakout-grid-visualizer-lite.js
```

Or clone/download from the [GitHub repository](https://github.com/astuteo-llc/tailwind-breakout-grid).

### Option 2: From npm Package

If you have the npm package installed (even if not using the Tailwind plugin):

```bash
npm install @astuteo/tailwind-breakout-grid
```

The file is located at:
```
node_modules/@astuteo/tailwind-breakout-grid/breakout-grid-visualizer-lite.js
```

Copy it to your project's public/assets directory.

## Installation

The lite visualizer requires:
1. Alpine.js v3.x
2. Your standalone breakout grid CSS (inline or external file)
3. The lite visualizer script

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Your standalone breakout grid CSS -->
  <style>
    :root {
      --base-gap: 1rem;
      --max-gap: 15rem;
      --content-min: 53rem;
      --content-max: 61rem;
      /* ... rest of breakout grid CSS variables and rules */
    }
    /* ... grid templates and utilities */
  </style>

  <!-- Only load in development -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script defer src="/path/to/breakout-grid-visualizer-lite.js"></script>
</head>
<body>
  <div class="grid-cols-breakout">
    <p class="col-content">Your content here</p>
  </div>
</body>
</html>
```

### With Environment Check

```html
<script>
  // Only load in development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    document.write('<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>');
    document.write('<script defer src="/breakout-grid-visualizer-lite.js"><\/script>');
  }
</script>
```

### Craft CMS

```twig
{% if craft.app.config.general.devMode %}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script defer src="/assets/js/breakout-grid-visualizer-lite.js"></script>
{% endif %}
```

### Laravel / Blade

```blade
@if(app()->environment('local'))
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script defer src="{{ asset('js/breakout-grid-visualizer-lite.js') }}"></script>
@endif
```

## Usage

Once loaded, press **Ctrl/Cmd + G** to toggle the visualizer.

The visualizer auto-injects into the DOM—no manual HTML markup required.

### Available Controls

- **Labels** - Toggle column name labels (Full, Feature, Popout, Content)
- **Class Names** - Show CSS class names (`.col-full`, `.col-feature`, etc.)
- **Values** - Display live CSS variable measurements
- **Lorem** - Fill columns with lorem ipsum text
- **p-gap** - Visualize padding utilities
- **Advanced Spans** - Show start/end utility examples

### Column Selection

Click any column in the overlay to highlight it and see its details in the control panel.

## Getting Standalone CSS

The lite visualizer is designed for use with standalone CSS. There are several ways to get the CSS:

### 1. Export from Full Visualizer

Use the full visualizer's "Download CSS" feature to export your configured grid as standalone CSS.

### 2. Copy from Demo

The [demo/lite.html](../demo/lite.html) file contains a complete standalone CSS example you can use as a starting point.

### 3. Generate Manually

The CSS variables and grid templates follow a predictable pattern. See the main [README](../README.md) for configuration options and adapt them to CSS custom properties.

## Example: Complete Standalone Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Breakout Grid - Standalone</title>

  <style>
    :root {
      /* Base measurements */
      --base-gap: 1rem;
      --max-gap: 15rem;
      --content-min: 53rem;
      --content-max: 61rem;
      --content-base: 75vw;

      /* Computed values */
      --gap: clamp(var(--base-gap), 4vw, var(--max-gap));
      --computed-gap: max(var(--gap), calc((100vw - var(--content)) / 10));
      --content: min(clamp(var(--content-min), var(--content-base), var(--content-max)), 100% - var(--gap) * 2);
      --content-half: calc(var(--content) / 2);

      /* Track widths */
      --full: minmax(var(--gap), 1fr);
      --feature: minmax(0, clamp(0rem, 12vw, 12rem));
      --popout: minmax(0, 5rem);
    }

    .grid-cols-breakout {
      display: grid;
      grid-template-columns:
        [full-start] var(--full)
        [feature-start] var(--feature)
        [popout-start] var(--popout)
        [content-start] var(--content-half)
        [center]
        var(--content-half) [content-end]
        var(--popout) [popout-end]
        var(--feature) [feature-end]
        var(--full) [full-end];
    }

    .grid-cols-breakout > * { grid-column: content; }
    .col-full { grid-column: full; }
    .col-feature { grid-column: feature; }
    .col-popout { grid-column: popout; }
    .col-content { grid-column: content; }

    .p-gap { padding: var(--gap); }
  </style>

  <!-- Development only -->
  <script>
    if (location.hostname === 'localhost') {
      document.write('<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>');
      document.write('<script defer src="/breakout-grid-visualizer-lite.js"><\/script>');
    }
  </script>
</head>
<body>
  <main class="grid-cols-breakout">
    <h1 class="col-content">Hello World</h1>
    <p class="col-content">Content at comfortable reading width.</p>
    <img class="col-feature" src="hero.jpg" alt="Wide image">
    <div class="col-full bg-gray-100 p-gap">Full width section</div>
  </main>
</body>
</html>
```

## Files

- `breakout-grid-visualizer-lite.js` - The lightweight Alpine.js visualizer component (~31 KB)
- `demo/lite.html` - Complete standalone demo with inline CSS

## See Also

- [Full Visualizer Documentation](visualizer.md) - For projects using the Tailwind plugin
- [Main README](../README.md) - Complete plugin documentation
