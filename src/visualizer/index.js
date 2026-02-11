/**
 * Breakout Grid Visualizer - Alpine.js Component
 *
 * ⚠️  DEVELOPMENT ONLY - Never include in production builds!
 *
 * A development tool for visualizing the breakout grid system.
 * Auto-injects into the DOM when loaded - no manual markup needed.
 * Press Ctrl/Cmd + G to toggle.
 *
 * @requires Alpine.js v3.x
 * @requires Tailwind breakout-grid plugin
 *
 * Craft CMS:
 *   {% if craft.app.config.general.devMode %}
 *     <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
 *     <script defer src="/path/to/breakout-grid-visualizer.js"></script>
 *   {% endif %}
 *
 * Laravel:
 *   @if(app()->environment('local'))
 *     <script defer src="...alpine..."></script>
 *     <script defer src="...visualizer..."></script>
 *   @endif
 *
 * Vite:
 *   if (import.meta.env.DEV) {
 *     await import('@astuteo/tailwind-breakout-grid/breakout-grid-visualizer.js')
 *   }
 *   Alpine.start()
 */

import {
  VERSION,
  LOREM_CONTENT,
  GRID_AREAS,
  CONFIG_OPTIONS,
  GAP_SCALE_OPTIONS,
  BREAKOUT_OPTIONS,
  BREAKPOINT_OPTIONS,
  createInitialState
} from './state.js';
import { generateCSSExport, generateTailwindCSSExport, CSS_EXPORT_VERSION } from './css-export.js';

import { methods } from './methods.js';
import { template } from './template.js';

(function() {
  'use strict';

  // Register Alpine.js component
  document.addEventListener('alpine:init', () => {
    Alpine.data('breakoutGridVisualizer', () => ({
      // Constants
      version: VERSION,
      loremContent: LOREM_CONTENT,

      // Configuration
      gridAreas: GRID_AREAS,
      configOptions: CONFIG_OPTIONS,
      gapScaleOptions: GAP_SCALE_OPTIONS,
      breakoutOptions: BREAKOUT_OPTIONS,
      breakpointOptions: BREAKPOINT_OPTIONS,

      // State
      ...createInitialState(),

      // Methods
      ...methods,

      // CSS export
      generateCSSExport,
      generateTailwindCSSExport,
      cssExportVersion: CSS_EXPORT_VERSION,

      // Template
      template
    }));
  });

  // Auto-inject visualizer into DOM
  function injectVisualizer() {
    // Check if already injected
    if (document.getElementById('breakout-grid-visualizer-root')) return;

    // Create container with Alpine directives
    const container = document.createElement('div');
    container.id = 'breakout-grid-visualizer-root';
    container.setAttribute('x-data', 'breakoutGridVisualizer');
    container.setAttribute('x-html', 'template');

    // Append to body
    document.body.appendChild(container);
    console.log('Breakout Grid Visualizer injected. Press Ctrl/Cmd + G to toggle.');
  }

  // Wait for Alpine and DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Give Alpine a moment to initialize
      setTimeout(injectVisualizer, 10);
    });
  } else {
    // DOM already loaded, inject after Alpine initializes
    document.addEventListener('alpine:initialized', injectVisualizer);
    // Fallback if alpine:initialized already fired
    setTimeout(injectVisualizer, 100);
  }

})();
