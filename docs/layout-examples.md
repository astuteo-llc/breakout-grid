# Layout Examples

Real-world layout patterns using the breakout grid system.

## Complex Editorial Layout

A full-featured article layout with hero images, pull quotes, image galleries, and call-to-action sections.

```html
<article class="grid-cols-breakout gap-y-8">
  <!-- Hero section with overlay text -->
  <div class="col-full relative">
    <img src="hero.jpg" class="w-full h-96 object-cover" />
    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
      <h1 class="text-white text-5xl font-bold text-center">Article Title</h1>
    </div>
  </div>

  <!-- Intro paragraph -->
  <p class="col-content text-xl leading-relaxed">
    Introduction paragraph at content width for emphasis.
  </p>

  <!-- Body text -->
  <p class="col-content">
    Main body text at optimal reading width...
  </p>

  <!-- Pull quote spanning from content to popout -->
  <blockquote class="col-start-content col-end-popout bg-blue-50 p-gap border-l-4 border-blue-500">
    <p class="text-2xl italic">"This quote spans from content-start to popout-end for visual impact."</p>
  </blockquote>

  <!-- Image gallery -->
  <div class="col-feature grid grid-cols-2 gap-4">
    <img src="image1.jpg" class="w-full h-48 object-cover rounded" />
    <img src="image2.jpg" class="w-full h-48 object-cover rounded" />
  </div>

  <!-- Sidebar-style content using nested grid -->
  <div class="col-feature grid-cols-feature-left gap-8">
    <div class="col-feature">
      <img src="chart.jpg" class="w-full h-64 object-cover rounded" />
    </div>
    <div class="col-content bg-gray-50 p-gap rounded">
      <h3 class="font-bold mb-2">Key Insights</h3>
      <ul class="space-y-2 text-sm">
        <li>Insight one</li>
        <li>Insight two</li>
        <li>Insight three</li>
      </ul>
    </div>
  </div>

  <!-- Call-to-action -->
  <div class="col-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-gap py-16">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold">
        Learn More
      </button>
    </div>
  </div>
</article>
```

## Product Landing Page

A marketing page with asymmetric hero, feature grid, and testimonials.

```html
<main class="grid-cols-breakout">
  <!-- Hero with asymmetric layout -->
  <section class="col-feature grid-cols-feature-left gap-12 py-20">
    <div class="col-feature">
      <img src="product.jpg" class="w-full h-96 object-cover rounded-lg shadow-xl" />
    </div>
    <div class="col-content flex flex-col justify-center">
      <h1 class="text-4xl font-bold mb-4">Revolutionary Product</h1>
      <p class="col-content text-lg mb-6">
        Product description at optimal reading width within the content column.
      </p>
      <div class="flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg">Buy Now</button>
        <button class="border border-gray-300 px-6 py-3 rounded-lg">Learn More</button>
      </div>
    </div>
  </section>

  <!-- Feature grid -->
  <section class="col-feature py-16">
    <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature One</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature Two</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature Three</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
    </div>
  </section>

  <!-- Testimonial with custom span -->
  <blockquote class="col-start-content col-end-feature bg-gray-50 p-gap py-12 text-center">
    <p class="text-2xl italic mb-4">"This product changed everything for our team."</p>
    <cite class="text-gray-600">— Happy Customer</cite>
  </blockquote>
</main>
```

## Article Layout

A standard blog/article layout with optimal reading width.

```html
<article class="grid-cols-breakout">
  <h1 class="col-content text-4xl font-bold">Article Title</h1>

  <p class="col-content">
    Body paragraphs use the content column for optimal reading.
  </p>

  <img class="col-feature" src="header.jpg" alt="Header" />

  <p class="col-content">
    More readable content in the content column.
  </p>

  <blockquote class="col-popout bg-blue-50 p-gap italic">
    "Blockquotes break out slightly for visual emphasis."
  </blockquote>

  <div class="col-full bg-gray-900 text-white p-gap">
    <div class="max-w-4xl mx-auto">
      <h2>Full-width section with centered content</h2>
    </div>
  </div>
</article>
```

## Marketing Hero

A hero section with full-width background and feature grid.

```html
<section class="grid-cols-breakout">
  <div class="col-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-gap py-20">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-bold mb-4">Hero Headline</h1>
      <p class="text-xl">Compelling subheadline</p>
    </div>
  </div>

  <div class="col-feature grid grid-cols-2 gap-8 py-12">
    <div>Feature 1</div>
    <div>Feature 2</div>
  </div>
</section>
```

## Split Content Layout

Content with image on one side and text on the other.

```html
<div class="grid-cols-breakout">
  <section class="col-feature grid-cols-feature-left gap-8">
    <img class="col-feature" src="product.jpg" alt="Product" />
    <div class="col-content">
      <h2>Product Name</h2>
      <p>Description aligned to the right</p>
    </div>
  </section>
</div>
```

## Sidebar Layout with Breakout Content

Using `breakout-to-*` modifiers for nested grids inside constrained containers. See [Nested Grid Modifiers](nested-grids.md) for full documentation.

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

## Documentation Page

A docs-style layout with navigation sidebar.

```html
<div class="grid-cols-breakout">
  <div class="col-feature grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">

    <!-- Sidebar navigation -->
    <aside class="lg:sticky lg:top-4 lg:self-start bg-gray-50 p-4 rounded-lg">
      <h3 class="font-bold mb-4">Documentation</h3>
      <nav>
        <ul class="space-y-2">
          <li><a href="#intro" class="text-blue-600 hover:underline">Introduction</a></li>
          <li><a href="#install" class="text-blue-600 hover:underline">Installation</a></li>
          <li><a href="#usage" class="text-blue-600 hover:underline">Usage</a></li>
          <li><a href="#api" class="text-blue-600 hover:underline">API Reference</a></li>
        </ul>
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="grid-cols-breakout breakout-to-content">
      <h1 id="intro">Introduction</h1>
      <p>Welcome to the documentation...</p>

      <h2 id="install">Installation</h2>
      <pre class="col-content bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
        <code>npm install @astuteo/tailwind-breakout-grid</code>
      </pre>

      <h2 id="usage">Usage</h2>
      <p>Start by adding the plugin to your Tailwind config...</p>
    </main>

  </div>
</div>
```

## Sidebar Layout

Size the outer container with `col-feature`, then switch to a native Tailwind grid for the sidebar/content split. Keep the inner content free of `col-*` classes.

```html
<main class="grid-cols-breakout py-12">
  <div class="col-feature grid grid-cols-12 gap-8">

    <!-- Sidebar -->
    <aside class="col-span-12 lg:col-span-3">
      <div class="sticky top-4 bg-gray-100 rounded-lg p-4">
        <h3 class="font-bold mb-4">Navigation</h3>
        <nav class="space-y-2">
          <a href="#" class="block text-blue-600 hover:underline">Getting Started</a>
          <a href="#" class="block text-gray-600 hover:text-blue-600">Installation</a>
          <a href="#" class="block text-gray-600 hover:text-blue-600">Configuration</a>
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <div class="col-span-12 lg:col-span-9 space-y-8">

      <h1 class="text-3xl font-bold">Page Title</h1>

      <!-- Reusable component: col-popout ignored here -->
      <div class="col-popout bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r">
        <p class="font-semibold text-amber-800">Info Callout</p>
        <p class="text-amber-700 text-sm">This component uses col-popout, which works in breakout grids but is ignored here.</p>
      </div>

      <p>Body content flows normally without breakout widths...</p>

      <!-- Reusable component: col-feature ignored here -->
      <div class="col-feature grid md:grid-cols-3 gap-4">
        <div class="bg-gray-50 p-4 rounded">Card 1</div>
        <div class="bg-gray-50 p-4 rounded">Card 2</div>
        <div class="bg-gray-50 p-4 rounded">Card 3</div>
      </div>

    </div>

  </div>
</main>
```

This pattern is useful when you have a component library designed for breakout grids but need to reuse those components in constrained layouts like sidebars or dashboards.

## Image Gallery

A gallery layout with mixed image sizes.

```html
<div class="grid-cols-breakout gap-y-8">
  <h2 class="col-content text-3xl font-bold">Photo Gallery</h2>

  <!-- Full-width hero image -->
  <img class="col-full h-96 object-cover" src="hero.jpg" alt="Hero" />

  <!-- Two-column gallery at feature width -->
  <div class="col-feature grid grid-cols-2 gap-4">
    <img class="h-64 w-full object-cover rounded" src="img1.jpg" alt="" />
    <img class="h-64 w-full object-cover rounded" src="img2.jpg" alt="" />
  </div>

  <!-- Three-column gallery at feature width -->
  <div class="col-feature grid grid-cols-3 gap-4">
    <img class="h-48 w-full object-cover rounded" src="img3.jpg" alt="" />
    <img class="h-48 w-full object-cover rounded" src="img4.jpg" alt="" />
    <img class="h-48 w-full object-cover rounded" src="img5.jpg" alt="" />
  </div>

  <!-- Caption at content width -->
  <p class="col-content text-gray-600 text-center italic">
    A collection of moments captured during the event.
  </p>
</div>
```
