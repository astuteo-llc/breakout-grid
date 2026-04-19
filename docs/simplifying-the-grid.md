# Simplifying the Grid

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
