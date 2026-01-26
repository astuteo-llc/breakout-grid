# Breakout Grid

A CSS Grid layout system for content that "breaks out" of containers. No build step required—just CSS.

Inspired by [Viget's Fluid Breakout Layout](https://www.viget.com/articles/fluid-breakout-layout-css-grid/).

## Features

- **Pure CSS** - No JavaScript, no build step, no dependencies
- **5 content widths** - From optimal reading width to full viewport
- **Responsive gaps** - Automatic scaling based on viewport
- **CSS variables** - Customize by overriding `:root` properties
- **Visual configurator** - Optional tool for experimenting and exporting

## Installation

### CDN / Direct Download

Download the CSS file and include it directly:

```html
<link rel="stylesheet" href="_objects.breakout-grid.css">
```

### npm

```bash
npm install github:astuteo-llc/breakout-grid
```

Import the CSS in your build:

```js
import '@astuteo/breakout-grid'
// or
import '@astuteo/breakout-grid/css'
```

For the visualizer:

```js
import '@astuteo/breakout-grid/visualizer'
// or lite version
import '@astuteo/breakout-grid/visualizer-lite'
```

## Quick Start

1. Add the CSS (see Installation above)

2. Use the grid:
```html
<main class="grid-cols-breakout">
  <article class="col-content">Reading width (optimal for text)</article>
  <figure class="col-feature">Wider for images</figure>
  <div class="col-full">Edge to edge</div>
</main>
```

## Column Widths

From narrowest to widest:

```
┌─────────────────────────────────────────┐
│ ╔══════════col-full════════════╗        │  Full width (with gap)
│ ╚══════════════════════════════╝        │
│     ╔════col-feature═══════╗            │  Extra wide
│     ╚══════════════════════╝            │
│       ╔═══col-popout══════╗             │  Slightly wider
│       ╚═══════════════════╝             │
│         ╔══col-content═══╗              │  Reading width (default)
│         ╚════════════════╝              │
└─────────────────────────────────────────┘
```

## Classes

### Grid Containers
- `.grid-cols-breakout` - Main centered grid
- `.grid-cols-breakout-subgrid` - CSS subgrid for nested alignment
- `.grid-cols-{feature|popout|content}-{left|right}` - Asymmetric layouts

### Column Placement
- `.col-full` - Edge to edge
- `.col-feature` - Wide content (images, videos)
- `.col-popout` - Slightly wider than content
- `.col-content` - Reading width (default)
- `.col-full-limit` - Full width with max-width cap

### Fine-Grained Control
- `.col-start-{full|feature|popout|content|center}`
- `.col-end-{full|feature|popout|content|center}`
- `.col-{area}-left` / `.col-{area}-right` - Asymmetric spans

### Spacing
- `.p-gap`, `.px-gap`, `.m-gap`, etc. - Gap-based spacing
- `.p-breakout`, `.px-breakout` - Responsive padding
- `.-mx-gap`, `.-mx-breakout` - Negative margins

## Customization

Override CSS variables in your own stylesheet:

```css
:root {
  --base-gap: 1.5rem;
  --content-max: 50rem;
  --popout: minmax(0, 3rem);
}
```

### All Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--base-gap` | `1rem` | Minimum gap (mobile) |
| `--max-gap` | `15rem` | Maximum gap |
| `--content-min` | `53rem` | Min content width |
| `--content-max` | `61rem` | Max content width |
| `--content-base` | `75vw` | Preferred content width |
| `--full-limit` | `115rem` | Max width for col-full-limit |

See the CSS file header for the complete list.

## Visual Configurator

Want to experiment with values before committing? Use the visualizer:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script defer src="breakout-grid-visualizer.js"></script>
```

Press `Ctrl+G` / `Cmd+G` to toggle. Adjust values interactively, then click **Export CSS** to download your customized stylesheet.

### With Alpine.js (Vite)

If your project already uses Alpine, import the visualizer before `Alpine.start()`:

```js
import Alpine from 'alpinejs'

if (import.meta.env.DEV) {
  await import('@astuteo/breakout-grid/visualizer')
}

Alpine.start()
```

Two versions available:

| Version | Size | Use Case |
|---------|------|----------|
| `breakout-grid-visualizer.js` | ~124 KB | Config editing + CSS export |
| `breakout-grid-visualizer-lite.js` | ~31 KB | Read-only debugging |

## Common Patterns

### Article Layout
```html
<article class="grid-cols-breakout">
  <h1 class="col-content">Article Title</h1>
  <p class="col-content">Body text at comfortable reading width.</p>
  <img class="col-feature" src="hero.jpg" alt="Hero" />
  <blockquote class="col-popout">Pull quote with slight emphasis.</blockquote>
  <div class="col-full bg-gray-100 px-gap py-8">
    Full-width section
  </div>
</article>
```

### Split Layout
```html
<section class="col-feature grid-cols-feature-left">
  <img class="col-feature" src="product.jpg" />
  <div class="col-content">
    <h2>Product Title</h2>
    <p>Description on the right side.</p>
  </div>
</section>
```

## Browser Support

Requires CSS Grid + `clamp()`:
- Chrome 79+
- Firefox 75+
- Safari 13.1+
- Edge 79+

## Migration from Tailwind Plugin

If you were using the Tailwind plugin:

1. Remove from `tailwind.config.js`:
```diff
- import breakoutGrid from '@astuteo/tailwind-breakout-grid'
plugins: [
-   breakoutGrid({ ... })
]
```

2. Add the CSS file:
```html
<link rel="stylesheet" href="breakout-grid.css">
```

3. All class names are identical—no HTML changes needed.

4. If you had custom config, use the visualizer to export matching CSS.

## Documentation

- [Visualizer](docs/visualizer.md) - Full configurator with CSS export
- [Visualizer Lite](docs/visualizer-lite.md) - Lightweight read-only version
- [Migration Guide](docs/migration-guide.md) - Integrating with existing projects
- [Nested Grids](docs/nested-grids.md) - `breakout-to-*` modifiers
- [Layout Examples](docs/layout-examples.md) - Real-world patterns

## License

MIT
