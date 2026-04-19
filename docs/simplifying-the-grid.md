# Simplifying the Grid

Two ways to slim the grid down:

1. **Drop the extras layer** (v6+) — get just core grid utilities and skip the advanced `breakout-none`, `p-breakout`, `p-full-gap`, and `p-*-to-content` helpers.
2. **Collapse unused tracks** — keep all utilities but set feature/popout widths to `0` so they take no space.

## Dropping the Extras Layer

If you only need the grid, basic `col-*` placement, and gap/popout spacing, skip the extras layer entirely.

**Visualizer users** — toggle **Include extras layer** off in the export panel, then download. The resulting file contains core utilities only.

**Tailwind plugin consumers** — pass `extras: false`:

```js
import breakoutGrid from '@astuteo/breakout-grid'

export default {
  plugins: [breakoutGrid({ extras: false })]
}
```

This gives you a ~11 KB raw / 2.3 KB gzip CSS footprint without the advanced alignment helpers.

## Collapsing Unused Tracks

Set any track width to `'0px'` in your config:

```js
// tailwind.config.js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  plugins: [
    breakoutGrid({
      // Collapse popout if you only need full → feature → content
      popoutWidth: '0px',
    })
  ]
}
```

## Common Simplified Configurations

### Minimal: Just Full and Content

For simple editorial layouts that only need two widths:

```js
breakoutGrid({
  featureWidth: '0px',
  popoutWidth: '0px',
})
```

This gives you:
- `col-full` - Edge to edge
- `col-content` - Comfortable content width (53-61rem fluid)

The `col-feature` and `col-popout` classes still work—they just resolve to the same width as `col-content`.

### No Popout Level

If you want full, feature, and content but don't need popout:

```js
breakoutGrid({
  popoutWidth: '0px',
})
```

### Narrower Content Column

If you want a narrower reading column (closer to traditional ~40-50rem reading width):

```js
breakoutGrid({
  contentMin: '40rem',
  contentMax: '50rem',
  contentBase: '52vw',
})
```

## Why This Works

CSS Grid handles zero-width tracks efficiently—they're just collapsed grid lines with no performance cost. The grid-line names (`content-start`, `feature-end`, etc.) still exist, so all `col-*` utilities continue to work. They just resolve to the nearest non-zero track.

This approach is better than conditionally removing tracks because:

1. **Your utilities always work** - No need to remember which tracks exist in each project
2. **Simpler code** - The plugin doesn't need complex conditional logic
3. **Easy to expand later** - Just change `'0px'` to a real value if needs change
