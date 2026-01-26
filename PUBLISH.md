# Publishing @astuteo/breakout-grid

## The Problem

Version numbers come from `package.json` and get injected into built files during `npm run build`. If you bump the version AFTER building, the built files will have the OLD version.

## Correct Publish Flow

### Option A: Manual Steps (Recommended)

```bash
# 1. Bump version in package.json FIRST
npm version patch   # or minor/major (don't use git flags yet)

# 2. Build with new version
npm run build

# 3. Verify versions match
npm run check-version

# 4. Commit the version bump + rebuilt files
git add -A
git commit -m "5.2.0"  # use your new version

# 5. Tag and push
git tag v5.2.0
git push && git push --tags

# 6. Publish to npm
npm publish
```

### Option B: All-in-One Command

```bash
# Bump version, rebuild, commit, tag, push, publish
npm version patch --no-git-tag-version && npm run build && npm run check-version && git add -A && git commit -m "$(node -p "require('./package.json').version")" && git tag "v$(node -p "require('./package.json').version")" && git push && git push --tags && npm publish
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
