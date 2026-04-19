# Migration: v5 → v6

Everything removed or changed in v6. Feed this to an AI (or grep) against a project codebase to find usage that needs updating.

## Removed utilities (grep these class names)

| Removed class | Replacement |
|---|---|
| `col-full-limit` | `col-full max-w-[115rem] mx-auto` (or your own `max-w-*`) |
| `col-feature-to-popout` | `col-start-feature col-end-popout` |
| `col-feature-to-content` | `col-start-feature col-end-content` |
| `col-feature-to-center` | `col-start-feature col-end-center` |
| `col-popout-to-content` | `col-start-popout col-end-content` |
| `col-popout-to-center` | `col-start-popout col-end-center` |
| `col-popout-to-feature` | `col-start-popout col-end-feature` |
| `col-content-to-center` | `col-start-content col-end-center` |
| `col-content-to-popout` | `col-start-content col-end-popout` |
| `col-content-to-feature` | `col-start-content col-end-feature` |
| `breakout-none` | `block` |
| `breakout-none-flex` | `flex` |
| `breakout-none-grid` | `grid` |
| `breakout-none-inline` | `inline` |
| `p-full-gap` / `px-full-gap` / `py-full-gap` / `pt-full-gap` / `pr-full-gap` / `pb-full-gap` / `pl-full-gap` | `p-[max(var(--gap),calc((100vw-var(--content))/10))]` (or register `--spacing-full-gap` in Tailwind theme) |
| `m-full-gap` family (all axes) | same arbitrary value on `m-*` |
| `-m-full-gap` family (all axes) | negative version on `-m-*` |
| `p-popout-to-content` / axes | `p-[var(--popout-width)]` or `p-popout` |
| `p-feature-to-content` / axes | `p-[calc(clamp(var(--feature-min),var(--feature-scale),var(--feature-max))+var(--popout-width))]` |
| `grid-cols-breakout-subgrid` | `grid grid-cols-subgrid` (Tailwind) or `display: grid; grid-template-columns: subgrid;` (plain CSS) |
| `breakout-to-content` | `grid grid-cols-subgrid` (if parent is a breakout grid), or wrap child in a new `grid-cols-breakout` |
| `breakout-to-popout` | same — use subgrid |
| `breakout-to-feature` | same — use subgrid |

## Changed behavior (same class name, different value)

| Class | v5 value | v6 value |
|---|---|---|
| `p-breakout` / `px-breakout` / `py-breakout` / `pl/r/t/b-breakout` | `clamp(var(--breakout-min), var(--breakout-scale), var(--popout-width))` — configurable | `clamp(1rem, 5vw, var(--popout-width))` — hardcoded |
| `m-breakout` family (all axes) | configurable clamp | hardcoded clamp |
| `-m-breakout` family (all axes) | configurable clamp | hardcoded clamp |

`p-breakout` still exists and still scales fluidly. If you relied on configuring `breakoutMin` / `breakoutScale` / `breakoutPadding` via the plugin, those options are gone. Use Tailwind arbitrary values for a custom clamp: `p-[clamp(1.5rem,6vw,8rem)]`.

## Removed CSS variables

| Variable | Replacement |
|---|---|
| `--full-limit` | Tailwind `max-w-[115rem]` or your own theme token |
| `--computed-gap` | inline: `max(var(--gap), calc((100vw - var(--content)) / 10))` |
| `--popout-to-content` | inline: `var(--popout-width)` |
| `--feature-to-content` | inline: `calc(clamp(var(--feature-min), var(--feature-scale), var(--feature-max)) + var(--popout-width))` |
| `--breakout-min` | removed (no replacement — breakout clamp floor is now hardcoded 1rem) |
| `--breakout-scale` | removed (hardcoded 5vw) |

`--breakout-padding` still exists — it's the computed clamp used by `.p-breakout` / `.m-breakout`.

## Removed plugin config options

| Option | Notes |
|---|---|
| `fullLimit` | gone; use Tailwind `max-w-*` |
| `breakoutMin` | gone; clamp floor is now hardcoded 1rem |
| `breakoutScale` | gone; clamp scale is now hardcoded 5vw |
| `breakoutPadding` (responsive object) | gone; utility is always fluid clamp |

## Package exports

| Removed | Replacement |
|---|---|
| `@astuteo/tailwind-breakout-grid/extras` | No more core/extras split — single unified output |
| `@astuteo/tailwind-breakout-grid/extras/tailwind` | Same |
| `@astuteo/tailwind-breakout-grid/css` | Use visualizer download (primary flow) or import the single `dist/_objects.breakout-grid.css` |

`./` (plugin), `./tailwind` (generated CSS), `./visualizer`, `./visualizer-lite` are still exported.

## Dist file changes

| v5 | v6 |
|---|---|
| `_objects.breakout-grid.css` (core) | `_objects.breakout-grid.css` (combined, full output) |
| `_objects.breakout-grid.tw.css` (core, Tailwind) | `_objects.breakout-grid.tw.css` (combined, Tailwind) |
| `_objects.breakout-grid-extras.css` | removed |
| `_objects.breakout-grid-extras.tw.css` | removed |

## Still exists, unchanged

- Grid container: `grid-cols-breakout`
- Left/right variants: `grid-cols-feature-left` / `-right`, `grid-cols-popout-left` / `-right`, `grid-cols-content-left` / `-right`
- Column utilities: `col-full`, `col-feature`, `col-popout`, `col-content`, `col-center`
- Column start/end: `col-start-{full,feature,popout,content,center}`, `col-end-*`
- Asymmetric spans: `col-{area}-left` / `col-{area}-right`
- Spacing: `p-gap`, `px-gap`, `py-gap`, axes, negatives; `p-popout`, axes; `m-gap`, `m-popout`, axes, negatives
- Narrow backward-compat aliases: `col-narrow`, `col-start-narrow`, `col-end-narrow`, `col-narrow-left`, `col-narrow-right` (still map to content)
- CSS vars: `--content-min/base/max`, `--popout-width`, `--feature-min/scale/max`, `--base-gap`, `--max-gap`, `--gap-scale-{default,lg,xl}`, `--gap`, `--content`, `--content-inset`, `--content-half`, `--full`, `--feature`, `--popout`, `--breakout-padding`

## Migration grep patterns

Run these against your project to find every v5 usage:

```bash
# Removed class names
rg 'col-full-limit|col-[a-z]+-to-[a-z]+|breakout-none|[pm]-full-gap|-m-full-gap|[pm][xytblr]?-full-gap'
rg 'p-popout-to-content|p-feature-to-content|[pm][xytblr]?-popout-to-content|[pm][xytblr]?-feature-to-content'
rg 'grid-cols-breakout-subgrid|breakout-to-(content|popout|feature)'

# Removed CSS vars
rg -- '--full-limit|--computed-gap|--popout-to-content|--feature-to-content|--breakout-min|--breakout-scale'

# Removed plugin config keys
rg 'fullLimit|breakoutMin|breakoutScale|breakoutPadding'

# Removed package subpath imports
rg '@astuteo/tailwind-breakout-grid/(extras|css)'
```
