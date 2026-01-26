/**
 * Breakout Grid Visualizer Lite - State
 * Minimal state for read-only visualization (no config editing)
 */

// Version injected at build time by Vite from package.json
export const VERSION = typeof __VERSION__ !== 'undefined' ? `v${__VERSION__} lite` : 'dev lite';

export const LOREM_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`;

// Grid areas configuration (matches plugin)
export const GRID_AREAS = [
  { name: 'full', label: 'Full', className: '.col-full', color: 'rgba(239, 68, 68, 0.25)', borderColor: 'rgb(239, 68, 68)' },
  { name: 'full-limit', label: 'Full Limit', className: '.col-full-limit', color: 'rgba(220, 38, 38, 0.25)', borderColor: 'rgb(220, 38, 38)' },
  { name: 'feature', label: 'Feature', className: '.col-feature', color: 'rgba(6, 182, 212, 0.25)', borderColor: 'rgb(6, 182, 212)' },
  { name: 'popout', label: 'Popout', className: '.col-popout', color: 'rgba(34, 197, 94, 0.25)', borderColor: 'rgb(34, 197, 94)' },
  { name: 'content', label: 'Content', className: '.col-content', color: 'rgba(168, 85, 247, 0.25)', borderColor: 'rgb(168, 85, 247)' },
];

// Initial state factory (lite version - no edit mode, no config editor)
export function createInitialStateLite() {
  return {
    // UI State
    isVisible: false,
    showLabels: true,
    showClassNames: true,
    showMeasurements: true,
    showPixelWidths: false,
    showGapPadding: false,
    showBreakoutPadding: false,
    showAdvanced: false,
    showLoremIpsum: false,
    viewportWidth: window.innerWidth,
    selectedArea: null,
    hoveredArea: null,
    // Column widths in pixels
    columnWidths: {
      full: 0,
      'full-limit': 0,
      feature: 0,
      popout: 0,
      content: 0,
      center: 0
    },
    // Current breakpoint for gap scale (mobile, lg, xl)
    currentBreakpoint: 'mobile',
    // Spacing panel state
    spacingPanelCollapsed: false,
    spacingPanelPos: { x: 16, y: 16 },
    isDraggingSpacing: false,
    dragOffsetSpacing: { x: 0, y: 0 },
    // Control panel state
    controlPanelCollapsed: false,
  };
}
