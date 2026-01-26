/**
 * Breakout Grid Visualizer - State
 * All state definitions, constants, and configuration options
 */

// Version injected at build time by Vite from package.json
export const VERSION = typeof __VERSION__ !== 'undefined' ? `v${__VERSION__}` : 'dev';

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

// Full plugin config structure with defaults and CSS var mappings
export const CONFIG_OPTIONS = {
  // Base measurements
  baseGap: { value: '1rem', desc: 'Minimum gap between columns. Use rem.', cssVar: '--config-base-gap', liveVar: '--base-gap' },
  maxGap: { value: '15rem', desc: 'Maximum gap cap for ultra-wide. Use rem.', cssVar: '--config-max-gap', liveVar: '--max-gap' },
  contentMin: { value: '53rem', desc: 'Min width for content column (~848px). Use rem.', cssVar: '--config-content-min', liveVar: '--content-min' },
  contentMax: { value: '61rem', desc: 'Max width for content column (~976px). Use rem.', cssVar: '--config-content-max', liveVar: '--content-max' },
  contentBase: { value: '75vw', desc: 'Preferred width for content (fluid). Use vw.', cssVar: '--config-content-base', liveVar: '--content-base' },
  // Track widths
  popoutWidth: { value: '5rem', desc: 'Popout extends beyond content. Use rem.', cssVar: '--config-popout', liveVar: null },
  featureMin: { value: '0rem', desc: 'Minimum feature track width (floor)', cssVar: '--config-feature-min', liveVar: null },
  featureScale: { value: '12vw', desc: 'Fluid feature track scaling', cssVar: '--config-feature-scale', liveVar: null },
  featureMax: { value: '12rem', desc: 'Maximum feature track width (ceiling)', cssVar: '--config-feature-max', liveVar: null },
  fullLimit: { value: '115rem', desc: 'Max width for col-full-limit. Use rem.', cssVar: '--config-full-limit', liveVar: '--full-limit' },
  // Default column
  defaultCol: { value: 'content', desc: 'Default column when no col-* class', type: 'select', options: ['content', 'popout', 'feature', 'full'], cssVar: '--config-default-col' },
};

export const GAP_SCALE_OPTIONS = {
  default: { value: '4vw', desc: 'Mobile/default gap scaling. Use vw.', cssVar: '--config-gap-scale-default' },
  lg: { value: '5vw', desc: 'Large screens (1024px+). Use vw.', cssVar: '--config-gap-scale-lg' },
  xl: { value: '6vw', desc: 'Extra large (1280px+). Use vw.', cssVar: '--config-gap-scale-xl' },
};

export const BREAKOUT_OPTIONS = {
  min: { value: '1rem', desc: 'Minimum breakout padding (floor)', cssVar: '--config-breakout-min' },
  scale: { value: '5vw', desc: 'Fluid breakout scaling', cssVar: '--config-breakout-scale' },
  // max is popoutWidth
};

export const BREAKPOINT_OPTIONS = {
  lg: { value: '1024', desc: 'Large breakpoint (px)', cssVar: '--config-breakpoint-lg' },
  xl: { value: '1280', desc: 'Extra large breakpoint (px)', cssVar: '--config-breakpoint-xl' },
};

// Initial state factory
export function createInitialState() {
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
    showEditor: false,
    showDiagram: false,
    editMode: false,
    viewportWidth: window.innerWidth,
    selectedArea: null,
    hoveredArea: null,
    editValues: {},
    copySuccess: false,
    configCopied: false,
    editorPos: { x: 20, y: 100 },
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    // Column resize drag state
    resizingColumn: null,
    resizeStartX: 0,
    resizeStartValue: 0,
    // Panel collapse state
    controlPanelCollapsed: false,
    configEditorCollapsed: false,
    // Computed column widths in pixels (pre-initialized for reactivity)
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
    // Restore config modal
    showRestoreModal: false,
    restoreInput: '',
    restoreError: null,
    // Section copy feedback
    sectionCopied: null,
  };
}
