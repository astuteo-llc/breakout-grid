/**
 * Shared content blocks used across demo pages that sit inside a
 * `grid-cols-breakout` container. The col-* classes position each
 * block at the right width inside that grid.
 */

// Navigation component - injected into all pages
export const sharedNav = (activePage) => `
  <a href="/index.html" class="${activePage === 'index' ? 'text-amber-400' : 'hover:text-amber-400 transition-colors'}">Grid Demo</a>
  <a href="/article.html" class="${activePage === 'article' ? 'text-amber-400' : 'hover:text-amber-400 transition-colors'}">Article</a>
  <a href="/product.html" class="${activePage === 'product' ? 'text-amber-400' : 'hover:text-amber-400 transition-colors'}">Product</a>
  <a href="/sidebar.html" class="${activePage === 'sidebar' ? 'text-amber-400' : 'hover:text-amber-400 transition-colors'}">Sidebar</a>
`;

export const sharedBlocks = {

  // Info callout - uses col-popout
  infoCallout: `
    <div class="col-popout bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r mb-8">
      <p class="font-semibold text-amber-800 mb-2">Shared Component: Info Callout</p>
      <p class="text-amber-700 text-sm">This exact markup is used on both the Product page and the Docs page. On the product page, <code class="bg-amber-100 px-1 rounded">col-popout</code> makes it break out. In the docs sidebar layout, it renders as a normal block.</p>
    </div>
  `,

  // Key specs grid - uses col-content
  keySpecs: `
    <div class="col-content grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="text-center p-4 bg-gray-50 rounded">
        <p class="text-2xl font-bold text-amber-600">5</p>
        <p class="text-xs text-gray-600 mt-1">Axes</p>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded">
        <p class="text-2xl font-bold text-amber-600">40K</p>
        <p class="text-xs text-gray-600 mt-1">RPM</p>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded">
        <p class="text-2xl font-bold text-amber-600">±2μm</p>
        <p class="text-xs text-gray-600 mt-1">Accuracy</p>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded">
        <p class="text-2xl font-bold text-amber-600">60</p>
        <p class="text-xs text-gray-600 mt-1">Tools</p>
      </div>
    </div>
  `,

  // Warning callout - uses col-content
  warningCallout: `
    <div class="col-content bg-red-50 border border-red-200 rounded p-4 mb-8">
      <div class="flex gap-3">
        <div class="text-red-500 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <p class="font-semibold text-red-800">Shared Component: Safety Warning</p>
          <p class="text-sm text-red-700 mt-1">This warning block uses <code class="bg-red-100 px-1 rounded">col-content</code>. Same markup renders at content width on product page, full width in sidebar layout.</p>
        </div>
      </div>
    </div>
  `,

  // Testimonial quote - uses col-content
  testimonial: `
    <blockquote class="col-content border-l-4 border-amber-500 pl-6 py-4 mb-8">
      <p class="text-xl text-gray-700 italic leading-relaxed mb-4">
        "The CNC-5000's setup wizard had us cutting parts within 4 hours of power-on. Impressive for a 5-axis machine."
      </p>
      <footer class="text-sm text-gray-500">
        — James Morrison, Aerotech Industries
      </footer>
      <p class="text-xs text-amber-600 mt-3 font-medium">Shared component using col-content</p>
    </blockquote>
  `,

  // Specs table - uses col-popout
  specsTable: `
    <div class="col-popout mb-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Reference <span class="text-sm font-normal text-amber-600">(shared component)</span></h3>
      <div class="bg-white rounded border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Parameter</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="py-3 px-4 text-gray-600">Work Envelope</td>
              <td class="py-3 px-4 font-medium">1000 × 800 × 600 mm</td>
              <td class="py-3 px-4 text-gray-500 text-xs">X × Y × Z</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-gray-600">Max Spindle Speed</td>
              <td class="py-3 px-4 font-medium">40,000 RPM</td>
              <td class="py-3 px-4 text-gray-500 text-xs">HSK-A63 interface</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-gray-600">Rapid Traverse</td>
              <td class="py-3 px-4 font-medium">60/60/40 m/min</td>
              <td class="py-3 px-4 text-gray-500 text-xs">X/Y/Z axes</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-gray-600">Table Load</td>
              <td class="py-3 px-4 font-medium">800 kg max</td>
              <td class="py-3 px-4 text-gray-500 text-xs">Centered load</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-gray-500 mt-2">This table uses <code class="bg-gray-100 px-1 rounded">col-popout</code> — wider on product page, normal width in docs.</p>
    </div>
  `,

  // Feature cards - uses col-feature
  featureCards: `
    <div class="col-feature mb-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Related Resources <span class="text-sm font-normal text-amber-600">(shared component)</span></h3>
      <div class="grid md:grid-cols-3 gap-4">
        <a href="#" class="bg-gray-50 rounded overflow-hidden hover:shadow-md transition-shadow group">
          <img src="https://picsum.photos/400/200?random=61" alt="Installation" class="w-full h-32 object-cover">
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Installation Guide</h4>
            <p class="text-sm text-gray-600 mt-1">Site prep and placement</p>
          </div>
        </a>
        <a href="#" class="bg-gray-50 rounded overflow-hidden hover:shadow-md transition-shadow group">
          <img src="https://picsum.photos/400/200?random=62" alt="Programming" class="w-full h-32 object-cover">
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Programming Manual</h4>
            <p class="text-sm text-gray-600 mt-1">G-code reference</p>
          </div>
        </a>
        <a href="#" class="bg-gray-50 rounded overflow-hidden hover:shadow-md transition-shadow group">
          <img src="https://picsum.photos/400/200?random=63" alt="Maintenance" class="w-full h-32 object-cover">
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Maintenance</h4>
            <p class="text-sm text-gray-600 mt-1">Preventive procedures</p>
          </div>
        </a>
      </div>
      <p class="text-xs text-gray-500 mt-2">These cards use <code class="bg-gray-100 px-1 rounded">col-feature</code> — widest breakout on product page, contained in docs.</p>
    </div>
  `
};

/**
 * Injects shared blocks into placeholder elements
 * Usage: <div data-shared-block="infoCallout"></div>
 */
export function injectSharedBlocks() {
  document.querySelectorAll('[data-shared-block]').forEach(el => {
    const blockName = el.dataset.sharedBlock;
    if (sharedBlocks[blockName]) {
      el.outerHTML = sharedBlocks[blockName];
    }
  });

  document.querySelectorAll('[data-shared-nav]').forEach(el => {
    el.innerHTML = sharedNav(el.dataset.sharedNav);
  });
}
