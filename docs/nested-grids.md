# Nested Grid Modifiers

When nesting a `grid-cols-breakout` grid inside another layout (such as a sidebar layout), the outer tracks of the breakout grid can create unwanted spacing since they're calculated based on viewport width, not the container width.

The `breakout-to-*` modifier classes solve this by collapsing the outer tracks, allowing the nested grid to fill its container while preserving the named grid lines so your `col-*` utilities continue to work.

## Full Reset (Nested Breakout Grid)

To nest a fresh `grid-cols-breakout` inside another without any offset, combine `col-full` with `grid-cols-breakout` on the same element:

```html
<div class="grid-cols-breakout">
  <div class="col-full grid-cols-breakout bg-white py-16">
    <!-- Fresh breakout grid, all tracks recalculated from full width -->
    <h2 class="col-content">Section title</h2>
    <p class="col-content">Content at reading width.</p>
    <img class="col-feature" src="hero.jpg" alt="" />
  </div>
</div>
```

`col-full` spans edge-to-edge of the parent grid, and `grid-cols-breakout` re-declares the full track template. No `breakout-to-*` modifier is needed since the element already occupies the full width.

This is useful for alternating background sections within a page that shares a single outer grid:

```html
<main class="grid-cols-breakout">
  <h1 class="col-content">Page title</h1>
  <p class="col-content">Intro paragraph.</p>

  <!-- White band with its own breakout grid -->
  <section class="col-full grid-cols-breakout bg-white py-16">
    <h2 class="col-content">Featured section</h2>
    <div class="col-feature">Wide content here</div>
  </section>

  <p class="col-content">Back to the outer grid.</p>
</main>
```

## Available Modifiers

| Class | Effect |
|-------|--------|
| `breakout-to-content` | Keeps `--content` margins, collapses everything outside. |
| `breakout-to-popout` | Keeps `--popout` and `--content` margins. |
| `breakout-to-feature` | Keeps `--feature`, `--popout`, and `--content` margins. |

## How It Works

The standard `grid-cols-breakout` creates a grid with tracks for each breakout level:

```
[full] [feature] [popout] [content] [center] [content] [popout] [feature] [full]
```

When nested inside a constrained container, those outer tracks (especially `--full` which uses `minmax(var(--gap), 1fr)`) still try to claim space based on viewport calculations.

The `breakout-to-*` modifiers redefine `grid-template-columns` to collapse the unwanted outer tracks to zero while stacking their grid line names at the container edges. This means:

1. The grid fills its container properly
2. All `col-*` utilities still work (the grid lines exist, they just resolve to the same position)
3. Inner tracks (`--content`, `--popout`, etc.) can optionally be preserved

## Usage Examples

### Basic Nested Grid

A two-column layout with a sidebar and a nested breakout grid:

```html
<div class="grid-cols-breakout">
  <div class="col-content grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">

    <aside>
      Sidebar content
    </aside>

    <div class="grid-cols-breakout breakout-to-content">
      <!-- This grid now fills the available space -->
      <div class="col-full bg-blue-100">
        Spans full width of the container (not viewport)
      </div>
      <p class="col-content">
        Reading content at optimal width
      </p>
    </div>

  </div>
</div>
```

### Full-Width Nested Content

When you want a nested grid to fill its container with just content margins:

```html
<div class="grid-cols-breakout">
  <section class="col-feature">
    <div class="grid-cols-breakout breakout-to-content">
      <!-- Content fills the feature column with content margins -->
      <h2 class="col-content">Section Title</h2>
      <p class="col-content">Text at reading width.</p>
      <img src="image.jpg" class="col-full" alt="Fills to feature edges" />
    </div>
  </section>
</div>
```

### Preserving Some Margins

If you want to keep content margins but collapse the outer tracks:

```html
<div class="layout-wrapper">
  <div class="grid-cols-breakout breakout-to-content">
    <!-- col-full, col-feature, col-popout all resolve to container edges -->
    <!-- col-content still has its normal margins -->

    <div class="col-full bg-gray-100 p-8">
      Full width band
    </div>

    <p class="col-content">
      Content with standard margins at optimal reading width
    </p>
  </div>
</div>
```

## Choosing the Right Modifier

- **`breakout-to-content`**: Use when you want to remove the viewport-based outer tracks but keep the `--content` margins for optimal reading width.

- **`breakout-to-popout`**: Use when you need slightly more breakout room than content but don't need the full feature/full widths.

- **`breakout-to-feature`**: Use when you only need to collapse the outermost `--full` track but want to preserve all the inner breakout levels.

## Technical Details

Each modifier redefines `grid-template-columns` with a simplified template. For example, `breakout-to-content` generates:

```css
.grid-cols-breakout.breakout-to-content {
  grid-template-columns:
    [full-start feature-start popout-start content-start]
    var(--content-half)
    [center-start]
    minmax(0, 1fr)
    [center-end]
    var(--content-half)
    [content-end popout-end feature-end full-end];
}
```

Key points:
- Outer grid line names are stacked at the edges (e.g., `full-start`, `feature-start`, etc. all at the same position)
- The center column uses `minmax(0, 1fr)` to fill available space
- Inner track variables (like `var(--content-half)`) are preserved where appropriate

## Common Patterns

### Sidebar Layout with Breakout Content

```html
<main class="grid-cols-breakout">
  <div class="col-content grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

    <nav class="lg:sticky lg:top-8 lg:self-start">
      <h2>Navigation</h2>
      <ul>
        <li><a href="#section-1">Section 1</a></li>
        <li><a href="#section-2">Section 2</a></li>
      </ul>
    </nav>

    <article class="grid-cols-breakout breakout-to-content">
      <h1 class="col-content">Article Title</h1>

      <p class="col-content">
        Body text at optimal reading width.
      </p>

      <figure class="col-full">
        <img src="diagram.jpg" alt="Full-width diagram" />
        <figcaption>Diagram caption</figcaption>
      </figure>

      <blockquote class="col-popout bg-blue-50 p-6">
        "A quote that breaks out slightly for emphasis"
      </blockquote>
    </article>

  </div>
</main>
```

### Card Grid with Breakout Interior

```html
<div class="grid-cols-breakout">
  <div class="col-feature grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="grid-cols-breakout breakout-to-content">
        <img class="col-full" src="card-image.jpg" alt="" />
        <div class="col-content p-6">
          <h3>Card Title</h3>
          <p>Card description text.</p>
        </div>
      </div>
    </div>

    <!-- More cards... -->

  </div>
</div>
```

## Disabling Breakout Grid Entirely

Sometimes you need to completely disable breakout behavior rather than just collapse tracks. The `breakout-none` utilities remove the grid display entirely, causing any `col-*` classes on child elements to be ignored.

### Use Case: Reusable Components

When you have components designed for breakout grids (with embedded `col-*` classes) but want to reuse them in sidebar layouts where those widths shouldn't apply:

```html
<!-- Main layout: breakout grid active, col-* classes work -->
<main class="grid-cols-breakout">
  <div data-component="info-card" class="col-popout bg-amber-50 p-6">
    Info callout breaks out
  </div>
</main>

<!-- Sidebar layout: breakout disabled, col-* classes ignored -->
<main class="grid-cols-breakout">
  <div class="col-feature breakout-none-grid grid-cols-12 gap-8">
    <aside class="col-span-3">Sidebar</aside>
    <div class="col-span-9">
      <!-- Same component, but col-popout is now ignored -->
      <div data-component="info-card" class="col-popout bg-amber-50 p-6">
        Renders as normal block (col-popout ignored)
      </div>
    </div>
  </div>
</main>
```

### Available Classes

| Class | Effect |
|-------|--------|
| `breakout-none` | Sets `display: block` — standard block flow |
| `breakout-none-flex` | Sets `display: flex` — use with flex utilities |
| `breakout-none-grid` | Sets `display: grid` — use with CSS grid (e.g., `grid-cols-12`) |

### Sidebar Layout Pattern

The most common pattern combines `breakout-none-grid` with a 12-column grid:

```html
<main class="grid-cols-breakout py-12">
  <div class="col-feature breakout-none-grid grid-cols-12 gap-8">

    <!-- Sidebar: 3 columns -->
    <aside class="col-span-12 lg:col-span-3">
      <nav>Sidebar navigation</nav>
    </aside>

    <!-- Content: 9 columns -->
    <div class="col-span-12 lg:col-span-9">
      <!-- Components with col-* classes render normally here -->
      <div class="col-content">This col-content is ignored</div>
      <div class="col-popout">This col-popout is ignored</div>
    </div>

  </div>
</main>
```

### When to Use Each Approach

| Scenario | Solution |
|----------|----------|
| Nested grid needs narrower breakout widths | `breakout-to-content`, `breakout-to-popout`, etc. |
| Want to preserve grid lines but fit container | `breakout-to-*` modifiers |
| Need to completely disable breakout behavior | `breakout-none`, `breakout-none-grid`, etc. |
| Reusing components with col-* in non-grid context | `breakout-none` variants |

## Browser Support

The `breakout-to-*` modifiers use the same CSS Grid features as the base plugin and work in all modern browsers.
