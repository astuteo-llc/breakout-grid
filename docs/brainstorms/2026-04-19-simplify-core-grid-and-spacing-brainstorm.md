---
date: 2026-04-19
topic: simplify-core-grid-and-spacing
---

# Simplify Core Grid and Spacing

## What We're Building

Adopt a slimmer "core" structure (ported from another project) as the default Breakout Grid output. The core keeps the same track model (`full` / `feature` / `popout` / `content` / `center`), left/right aligned variants, subgrid, `breakout-to-*` modifiers, basic `col-*` utilities, `col-start-*` / `col-end-*`, `col-*-left` / `col-*-right`, `col-full-limit`, and spacing limited to `gap` + `popout` (plus their `-m-*` negatives).

The existing "extras" (`breakout-none*`, the `col-*-to-*` advanced spans, `p-breakout` / `m-breakout`, `p-full-gap` / `m-full-gap`, `p-popout-to-content` / `p-feature-to-content` alignment utilities, and their backing computed vars `--breakout-padding` / `--computed-gap` / `--popout-to-content` / `--feature-to-content`) stay in the package but move to a separate extras layer that consumers import on top of core.

Default column remains `content` (non-breaking). The `--breakout-min` / `--breakout-scale` config variables stay exposed, but they only power the extras layer.

## Why This Approach

Three interpretations were considered:

- **Delete the extras entirely (clean v6 break).** Rejected — too aggressive for real usage that depends on `p-breakout` and `*-to-content` alignment utilities today.
- **Simplify CSS only, leave tooling alone.** Rejected — would leave the visualizer's config controls and the JS plugin emitting utilities that the default CSS output no longer contains, creating three divergent stories.
- **Split core + extras across CSS, plugin, and visualizer (chosen).** Gives a slimmer default while keeping the advanced utilities one import / option away. Consistent across the three surfaces the package ships (CSS files, Tailwind plugin, visualizer export).

Matching the target snippet verbatim (including `--default-col: feature`) was rejected because it would silently shift the default column on every existing breakout grid in consumer projects.

## Key Decisions

- **Scope**: "Only simplify the core grid + spacing" — extras are preserved, not deleted.
- **Default column**: Stay at `content`. The target snippet's `feature` default is treated as a project-specific choice, not the package default.
- **Organization**: Two CSS files — `_objects.breakout-grid.css` (core) and `_objects.breakout-grid-extras.css` (extras) — plus their `.tw.css` Tailwind-flavor counterparts. Package exports gain `./extras` and `./extras/tailwind` entries.
- **Extras depend on core**: Extras file assumes the core file is imported first (reuses core's `:root` vars and grid tracks). Extras-only computed vars (`--breakout-padding`, `--computed-gap`, `--popout-to-content`, `--feature-to-content`) live in the extras file.
- **JS Tailwind plugin (`index.js`)**: Gains an `extras: boolean` option defaulting to `true` so existing consumers get current behavior unchanged. Flipping the default to `false` is deferred to a future major.
- **Visualizer**: Grows a toggle for whether "Copy CSS" output includes extras. Default matches current behavior (combined). When off, emits the two files in sequence with clear section markers.
- **Comment / formatting style**: Core section adopts the target snippet's terser comments and section dividers. Extras retains its existing, more verbose comments for now.
- **Versioning**: Treated as a minor release — defaults don't change, surface area only grows (new export paths, new plugin option).

## Open Questions

- Exact filename for the extras file — `_objects.breakout-grid-extras.css` vs `_objects.breakout-grid.extensions.css` vs something else. Defer to planning phase; pick whatever matches naming precedent in `astuteo`'s other ITCSS packages.
- Whether the visualizer should expose the `extras` toggle in the main UI panel or tuck it under an "Advanced" section. Minor — punt to UX pass during implementation.
- Should the README's "Classes" table be reorganized into "Core" and "Extras" columns, or left as a single flat list with an (extras) marker? Defer to the docs task in the plan.
- Is there any plugin consumer relying on the current ordering of emitted CSS rules? Unlikely, but worth a quick grep of the test/demo pages during implementation.

## Next Steps

→ `/workflows:plan` for implementation details — will need to cover `css-export.js` split, `scripts/build-css.js` additions, `package.json` exports, `index.js` plugin option, visualizer state/methods/template changes, and demo/docs updates.
