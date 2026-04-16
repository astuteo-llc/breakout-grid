# Publishing @astuteo/breakout-grid

## The Problem

Version numbers come from `package.json` and get injected into built files during `npm run build`. If you bump the version AFTER building, the built files will have the OLD version.

## Publish (One-Liner)

Replace `patch` with `minor` or `major` as needed.

```bash
npm version patch --no-git-tag-version && npm run build && npm run check-version && git add -A && git commit -m "$(node -p "require('./package.json').version")" && git tag "v$(node -p "require('./package.json').version")" && git push && git push --tags && npm publish
```

## Step by Step

If you prefer to run each step individually:

**1. Bump version**

```bash
npm version patch --no-git-tag-version
```

**2. Build**

```bash
npm run build
```

**3. Verify**

```bash
npm run check-version
```

**4. Commit**

```bash
git add -A && git commit -m "$(node -p "require('./package.json').version")"
```

**5. Tag and push**

```bash
git tag "v$(node -p "require('./package.json').version")" && git push && git push --tags
```

**6. Publish**

```bash
npm publish
```

## Version Locations

The version appears in these files after build:

| File | How It's Set |
|------|--------------|
| `package.json` | Source of truth - edit this first |
| `breakout-grid-visualizer.js` | Injected by Vite from `__VERSION__` |
| `breakout-grid-visualizer-lite.js` | Injected by Vite from `__VERSION__` |
| `dist/_objects.breakout-grid.css` | Read from package.json by build script |

## Verification

After building, run:

```bash
npm run check-version
```

This verifies all built files have the version from `package.json`.

## Common Mistakes

1. **Building before bumping version** - Built files get old version
2. **Using `npm version` with default git flags** - Creates commit/tag before rebuild
3. **Forgetting to rebuild after version bump** - Old version in built files
4. **Publishing without checking** - Version mismatch shipped to npm

## Files Published to npm

Defined in `package.json` under `"files"`:

- `dist/_objects.breakout-grid.css`
- `breakout-grid-visualizer.js`
- `breakout-grid-visualizer-lite.js`
- `craft-integration.twig`
- `README.md`
- `LICENSE`
