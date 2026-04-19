# Migration Guide

If your project already uses traditional Tailwind max-width containers (like `max-w-7xl`), here's how to integrate the breakout grid system.

## Understanding the Conflict

**Traditional Approach:**
```html
<!-- ❌ This prevents children from breaking out -->
<div class="max-w-7xl mx-auto px-4">
  <h1>Title</h1>
  <p>Content is trapped inside the container</p>
  <img src="wide.jpg" />  <!-- Can't break out! -->
</div>
```

**Breakout Grid Approach:**
```html
<!-- ✅ Children can break out to different widths -->
<div class="grid-cols-breakout">
  <h1 class="col-content">Title</h1>
  <p class="col-content">Optimal reading width</p>
  <img class="col-feature" src="wide.jpg" />  <!-- Breaks out! -->
</div>
```

**The Problem:** Traditional max-width containers constrain ALL children. The breakout grid needs to span the full viewport to allow children to break out.

## Migration Strategies

### Strategy 1: Replace Containers with Breakout Grid

**Before:**
```html
<article class="max-w-7xl mx-auto px-4">
  <h1>Article Title</h1>
  <p>Lorem ipsum dolor sit amet...</p>
  <img src="hero.jpg" alt="Hero" />
</article>
```

**After:**
```html
<article class="grid-cols-breakout">
  <h1 class="col-content">Article Title</h1>
  <p class="col-content">Lorem ipsum dolor sit amet...</p>
  <img class="col-feature" src="hero.jpg" alt="Hero" />
</article>
```

### Strategy 2: Mix Both Approaches (Different Sections)

Use traditional containers where you don't need breakout behavior, and breakout grids where you do:

```html
<main>
  <!-- Traditional container for simple content -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <h2>Simple Section</h2>
    <p>All content same width</p>
  </section>

  <!-- Breakout grid for complex layout -->
  <article class="grid-cols-breakout py-12">
    <h2 class="col-content">Complex Article</h2>
    <p class="col-content">Body text with optimal reading width</p>
    <img class="col-feature" src="wide.jpg" />
    <div class="col-full bg-gray-100 p-gap">
      Full-width callout section
    </div>
  </article>

  <!-- Back to traditional -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <h2>Another Simple Section</h2>
  </section>
</main>
```

### Strategy 3: Full width with a max-width cap

If you need a full-width element that caps at a specific width on ultra-wide screens, combine `col-full` with Tailwind's own `max-w-*` and `mx-auto`:

```html
<div class="grid-cols-breakout">
  <!-- Normal breakout content -->
  <p class="col-content">Reading text</p>

  <!-- Full width but with max-width constraint -->
  <div class="col-full max-w-[115rem] mx-auto bg-gray-100 p-gap">
    <div class="grid grid-cols-3 gap-8">
      <!-- Complex layout that shouldn't get too wide -->
    </div>
  </div>
</div>
```

For a reusable token, define it in your Tailwind theme (`--max-w-breakout: 115rem`) and use `max-w-breakout` in place of the arbitrary value.

### Strategy 4: Nested Grids Inside Traditional Containers

For gradual migration, you can use breakout grids inside traditional containers for specific sections:

```html
<main class="max-w-7xl mx-auto px-4">
  <!-- Regular content -->
  <h1>Page Title</h1>

  <!-- Break out of the container for this section -->
  <article class="-mx-4 md:-mx-8 lg:-mx-12 grid-cols-breakout">
    <!-- Now using negative margins to escape the container padding -->
    <p class="col-content">Body text</p>
    <img class="col-feature" src="wide.jpg" />
  </article>

  <!-- Back to regular content -->
  <p>More content</p>
</main>
```

> **Note:** This requires careful management of negative margins and may not work on ultra-wide screens.

## Comparing Widths: max-w-* vs col-*

Here's how breakout grid columns map to common Tailwind max-width utilities:

| Tailwind Utility | Approx. Width | Breakout Grid Equivalent | Notes |
|------------------|---------------|--------------------------|-------|
| `max-w-prose` | ~65ch (520px) | `col-content` + custom config | Adjust contentMin/Max for narrower |
| `max-w-3xl` | 48rem (768px) | `col-content` | Close to default content min |
| `max-w-4xl` | 56rem (896px) | `col-content` | Within default content range |
| `max-w-6xl` | 72rem (1152px) | `col-popout` | Slightly wider |
| `max-w-7xl` | 80rem (1280px) | `col-feature` or `col-full max-w-[80rem] mx-auto` | Wide sections |
| `max-w-full` | 100% | `col-full` | Edge-to-edge |

## Migration Checklist

When converting an existing page:

1. **Identify sections** that need breakout behavior (articles, hero sections, image galleries)
2. **Remove wrapping containers** (`max-w-*`, `container`) from those sections
3. **Add `grid-cols-breakout`** to the parent
4. **Classify children** with appropriate `col-*` classes:
   - Body text, headlines → `col-content`
   - Images, callouts → `col-popout` or `col-feature`
   - Full-width bands → `col-full`
5. **Test responsive behavior** at different viewport sizes
6. **Adjust configuration** if needed (gap sizes, width constraints)

## Common Gotchas

**❌ Don't wrap breakout grids in containers:**
```html
<!-- BAD: Container prevents breakout -->
<div class="max-w-7xl mx-auto">
  <div class="grid-cols-breakout">
    <img class="col-full" src="wide.jpg" />  <!-- Can't reach full viewport! -->
  </div>
</div>
```

**✅ Let breakout grids span the full viewport:**
```html
<!-- GOOD: Grid can span full viewport -->
<div class="grid-cols-breakout">
  <img class="col-full" src="wide.jpg" />  <!-- Spans viewport correctly -->
</div>
```

**❌ Don't use padding on breakout grid containers:**
```html
<!-- BAD: Padding prevents full-width children -->
<div class="grid-cols-breakout px-4">
  <div class="col-full bg-gray-100">Not actually full width!</div>
</div>
```

**✅ Add padding to individual children instead:**
```html
<!-- GOOD: Use p-gap on children that need it -->
<div class="grid-cols-breakout">
  <div class="col-full bg-gray-100 p-gap">
    Actually full width with inner padding!
  </div>
</div>
```

## Using p-breakout for Easy Migration

If your legacy project uses consistent padding patterns like `p-6 md:px-16`, use `p-breakout` utilities to quickly replace them:

**Before (Legacy):**
```html
<section class="bg-blue-900 p-6 md:px-16 md:pt-12 md:pb-20 relative z-10">
  <h2>Section Title</h2>
  <p>Content here...</p>
</section>
```

**After (Quick Migration):**
```html
<section class="col-full bg-blue-900 p-breakout relative z-10">
  <h2>Section Title</h2>
  <p>Content here...</p>
</section>
```

**Customize if needed:**
```js
// tailwind.config.js - Match your existing padding patterns
breakoutGrid({
  breakoutPadding: {
    base: '1.5rem',  // Matches p-6
    md: '4rem',      // Matches md:px-16/pt-12
    lg: '5rem'       // Matches lg:px-20
  }
})
```

This approach lets you:
- Keep familiar padding values from your legacy project
- Reduce HTML verbosity (one class vs multiple responsive classes)
- Maintain design consistency across the migration
- Easily adjust all breakout padding globally via config

## Real-World Example: Converting a Blog Post

**Before (Traditional):**
```html
<article class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold mb-4">Article Title</h1>
  <p class="text-lg mb-4">Lorem ipsum...</p>
  <img class="w-full mb-4" src="hero.jpg" />
  <p class="text-lg mb-4">More content...</p>
  <blockquote class="border-l-4 pl-4 italic">Quote</blockquote>
</article>
```

**After (Breakout Grid):**
```html
<article class="grid-cols-breakout py-12 gap-y-4">
  <h1 class="col-content text-4xl font-bold">Article Title</h1>
  <p class="col-content text-lg">Lorem ipsum...</p>
  <img class="col-feature" src="hero.jpg" />
  <p class="col-content text-lg">More content...</p>
  <blockquote class="col-popout border-l-4 pl-4 italic bg-gray-50 p-gap">
    Quote
  </blockquote>
</article>
```

**Benefits of the conversion:**
- Text is optimally readable at `col-content` (53-61rem fluid)
- Hero image can break out wider for impact
- Blockquote visually distinct with `col-popout`
- More design flexibility without changing HTML structure
