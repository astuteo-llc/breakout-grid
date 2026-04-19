# Breakout Grid

A CSS Grid layout system for content that "breaks out" of containers. No build step required—just CSS.

Inspired by [Kevin Powell's video](https://www.youtube.com/watch?v=c13gpBrnGEw), [Ryan Mulligan's Layout Breakouts](https://ryanmulligan.dev/blog/layout-breakouts/), and [Viget's Fluid Breakout Layout](https://www.viget.com/articles/fluid-breakout-layout-css-grid/).

## Features

- **Pure CSS** - No JavaScript, no build step, no dependencies
- **5 content widths** - From optimal reading width to full viewport
- **Responsive gaps** - Automatic scaling based on viewport
- **CSS variables** - Customize by overriding `:root` properties
- **Visual configurator** - Optional tool for experimenting and exporting

## Installation

Primary flow: generate the CSS you want from the visualizer, drop it into your project, and `@import` it. No runtime dependency on this package.

### 1. Generate from the visualizer (recommended)

1. Open the visualizer locally: `npm run demo` → <http://localhost:5173> → press <kbd>Cmd/Ctrl</kbd> + <kbd>G</kbd>
2. Configure content widths, gap, popout, feature track, etc.
3. Toggle **Include extras layer** on (default) if you want the advanced utilities, off for slim core only
4. Click **Download CSS** and pick Plain or Tailwind v4 flavor
5. Drop the file into your project source and import it

### 2. Copy from the repo

Pre-built combined files live in `dist/`. Copy whichever matches your stack:

| File | Purpose |
|---|---|
| `_objects.breakout-grid.css` | Plain CSS — core + extras combined |
| `_objects.breakout-grid.tw.css` | Tailwind v4 `@utility` flavor — core + extras combined |

For a slim build without the extras utilities, generate it from the visualizer with **Include extras layer** toggled off.

### 3. npm (alternative)

Also available as a package if that fits your workflow better:

```bash
npm install @astuteo/breakout-grid
```

```css
@import '@astuteo/breakout-grid';           /* plain */
/* or */
@import '@astuteo/breakout-grid/tailwind';  /* Tailwind v4 @utility flavor */
```

The same package ships the visualizer for dev-time use:

```js
if (import.meta.env.DEV) {
  await import('@astuteo/breakout-grid/visualizer')
}
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
- `.breakout-to-{content|popout|feature}` - Nested grid modifiers

#### Column Placement
- `.col-full` - Edge to edge
- `.col-feature` - Wide content (images, videos)
- `.col-popout` - Slightly wider than content
- `.col-content` - Reading width (default)

> Need a full-width block that caps on ultra-wide screens? Use Tailwind's own max-width utilities alongside `col-full`:
> ```html
> <div class="col-full max-w-[115rem] mx-auto">...</div>
> ```

#### Fine-Grained Control
- `.col-start-{full|feature|popout|content|center}`
- `.col-end-{full|feature|popout|content|center}`
- `.col-{area}-left` / `.col-{area}-right` - Asymmetric spans

#### Spacing
- `.p-gap`, `.px-gap`, `.m-gap`, etc. - Gap-based spacing
- `.p-popout`, `.m-popout`, etc. - Popout-width spacing
- `.p-breakout`, `.m-breakout`, etc. - Fluid inset padding (`clamp(1rem, 5vw, var(--popout-width))`) — collapses on mobile so edge-bleed bands stay readable
- Negative variants: `.-m-gap`, `.-m-popout`, `.-m-breakout`

> Need to align content inside a wider column with the content column edge? Compose with Tailwind arbitrary values — the grid vars (`--popout-width`, `--feature-min/scale/max`) are already available:
>
> ```html
> <!-- feature-column content aligned to content column edge -->
> <div class="col-feature px-[calc(clamp(var(--feature-min),var(--feature-scale),var(--feature-max))+var(--popout-width))]">...</div>
> ```

> Need a partial span between non-adjacent tracks — e.g. a split layout where content reaches the grid's center line? Compose `col-start-*` with `col-end-*`, or drop to an arbitrary `grid-column` value:
>
> ```html
> <!-- Symmetric split: left half ends at center, right half starts at center -->
> <section class="grid-cols-breakout">
>   <div class="col-start-feature col-end-center">Left half</div>
>   <div class="col-start-center col-end-feature">Right half</div>
> </section>
>
> <!-- Feature-wide image bleeding to the grid's midpoint -->
> <figure class="[grid-column:feature-start/center-end]">...</figure>
> ```

## Formatter Setup

The generated CSS files open with a `/* @formatter:off */` pragma, which **JetBrains-family IDEs** (WebStorm, PhpStorm, IntelliJ, etc.) honor automatically — no config needed.

**Prettier** doesn't read that pragma. Add the path to your `.prettierignore` instead so format-on-save (and `prettier --write`) skip it:

```
# .prettierignore
**/_objects.breakout-grid*.css
```

If you're loading from npm rather than copying the CSS into your source tree:

```
# .prettierignore
node_modules/@astuteo/breakout-grid/dist/
```

The Prettier VS Code extension reads `.prettierignore` too — no separate VS Code setting needed. Same for ESLint/Stylelint toolchains that use Prettier under the hood.

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
