(function() {
  "use strict";
  const VERSION = `v${"5.1.3"} lite`;
  const LOREM_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`;
  const GRID_AREAS = [
    { name: "full", label: "Full", className: ".col-full", color: "rgba(239, 68, 68, 0.25)", borderColor: "rgb(239, 68, 68)" },
    { name: "full-limit", label: "Full Limit", className: ".col-full-limit", color: "rgba(220, 38, 38, 0.25)", borderColor: "rgb(220, 38, 38)" },
    { name: "feature", label: "Feature", className: ".col-feature", color: "rgba(6, 182, 212, 0.25)", borderColor: "rgb(6, 182, 212)" },
    { name: "popout", label: "Popout", className: ".col-popout", color: "rgba(34, 197, 94, 0.25)", borderColor: "rgb(34, 197, 94)" },
    { name: "content", label: "Content", className: ".col-content", color: "rgba(168, 85, 247, 0.25)", borderColor: "rgb(168, 85, 247)" }
  ];
  function createInitialStateLite() {
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
        "full-limit": 0,
        feature: 0,
        popout: 0,
        content: 0,
        center: 0
      },
      // Current breakpoint for gap scale (mobile, lg, xl)
      currentBreakpoint: "mobile",
      // Spacing panel state
      spacingPanelCollapsed: false,
      spacingPanelPos: { x: 16, y: 16 },
      isDraggingSpacing: false,
      dragOffsetSpacing: { x: 0, y: 0 },
      // Control panel state
      controlPanelCollapsed: false
    };
  }
  const methodsLite = {
    // Initialize
    init() {
      const saved = localStorage.getItem("breakoutGridVisualizerVisible");
      if (saved !== null) {
        this.isVisible = saved === "true";
      }
      const spacingPos = localStorage.getItem("breakoutGridSpacingPos");
      if (spacingPos) {
        try {
          this.spacingPanelPos = JSON.parse(spacingPos);
        } catch (e) {
        }
      }
      const spacingCollapsed = localStorage.getItem("breakoutGridSpacingCollapsed");
      if (spacingCollapsed !== null) {
        this.spacingPanelCollapsed = spacingCollapsed === "true";
      }
      window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "g") {
          e.preventDefault();
          this.toggle();
        }
      });
      window.addEventListener("resize", () => {
        this.viewportWidth = window.innerWidth;
        this.updateColumnWidths();
        this.updateCurrentBreakpoint();
      });
      this.updateCurrentBreakpoint();
      console.log("Breakout Grid Visualizer (Lite) loaded. Press Ctrl/Cmd + G to toggle.");
    },
    // Toggle visibility
    toggle() {
      this.isVisible = !this.isVisible;
      localStorage.setItem("breakoutGridVisualizerVisible", this.isVisible);
    },
    // Update column widths by querying DOM elements
    updateColumnWidths() {
      this.$nextTick(() => {
        this.gridAreas.forEach((area) => {
          const el = document.querySelector(`.breakout-visualizer-grid .col-${area.name}`);
          if (el) {
            this.columnWidths[area.name] = Math.round(el.getBoundingClientRect().width);
          }
        });
      });
    },
    // Detect current breakpoint based on viewport width
    updateCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width >= 1280) {
        this.currentBreakpoint = "xl";
      } else if (width >= 1024) {
        this.currentBreakpoint = "lg";
      } else {
        this.currentBreakpoint = "mobile";
      }
    },
    // Select a grid area
    selectArea(areaName) {
      this.selectedArea = this.selectedArea === areaName ? null : areaName;
    },
    // Check if area is selected
    isSelected(areaName) {
      return this.selectedArea === areaName;
    },
    // Spacing panel drag handling
    startDragSpacing(e) {
      this.isDraggingSpacing = true;
      this.dragOffsetSpacing = {
        x: e.clientX - this.spacingPanelPos.x,
        y: e.clientY - this.spacingPanelPos.y
      };
    },
    onDragSpacing(e) {
      if (this.isDraggingSpacing) {
        this.spacingPanelPos = {
          x: e.clientX - this.dragOffsetSpacing.x,
          y: e.clientY - this.dragOffsetSpacing.y
        };
      }
    },
    stopDragSpacing() {
      if (this.isDraggingSpacing) {
        localStorage.setItem("breakoutGridSpacingPos", JSON.stringify(this.spacingPanelPos));
      }
      this.isDraggingSpacing = false;
    }
  };
  const templateLite = `
  <div x-show="isVisible"
       x-transition
       class="breakout-grid-visualizer"
       style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

    <!-- Advanced Span Examples Overlay -->
    <div x-show="showAdvanced"
         class="grid-cols-breakout"
         style="position: absolute; inset: 0; height: 100%; pointer-events: auto; z-index: 5;">

      <!-- Left-anchored: full-start to feature-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'full-start / feature-end',
             background: hovered ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)' : 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
             border: '3px solid rgb(168, 85, 247)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-start',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(139, 92, 246);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: left;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → feature boundary</div>
        </div>
      </div>

      <!-- Right-anchored: feature-start to full-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature-start / full-end',
             background: hovered ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
             border: '3px solid rgb(34, 197, 94)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-end',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(34, 197, 94);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-right</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Feature boundary → right edge</div>
        </div>
      </div>

      <!-- To center point: full-start to center-end -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'full-start / center-end',
             background: hovered ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.6) 0%, rgba(234, 179, 8, 0.6) 100%)' : 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)',
             border: '3px solid rgb(234, 179, 8)',
             margin: '1rem 0',
             padding: '1rem',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'flex-end',
             transition: 'background 0.2s ease'
           }">
        <div style="background: rgb(234, 179, 8);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-center-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → center point</div>
        </div>
      </div>

      <!-- Nested grid example: breakout-to-feature inside col-feature -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature',
             border: '3px dashed rgb(59, 130, 246)',
             margin: '1rem 0',
             background: hovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.05)',
             transition: 'background 0.2s ease',
             padding: '0.5rem'
           }">
        <div style="font-size: 0.625rem; font-family: monospace; color: rgb(30, 64, 175); margin-bottom: 0.5rem; padding: 0.25rem;">
          Parent: .col-feature container
        </div>
        <div class="grid-cols-breakout breakout-to-feature"
             style="background: rgba(59, 130, 246, 0.1);">
          <div style="grid-column: feature;
                      background: rgba(59, 130, 246, 0.3);
                      padding: 0.5rem;
                      font-size: 0.625rem;
                      font-family: monospace;
                      color: rgb(30, 64, 175);">
            .col-feature → fills container
          </div>
          <div style="grid-column: content;
                      background: rgb(59, 130, 246);
                      color: white;
                      padding: 0.75rem 1rem;
                      font-size: 0.75rem;
                      font-weight: 700;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="font-family: monospace; margin-bottom: 0.5rem;">.col-content → has margins</div>
            <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">breakout-to-feature collapses outer tracks</div>
            <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature"&gt;
  &lt;div class="grid-cols-breakout breakout-to-feature"&gt;
    &lt;div class="col-feature"&gt;Fills container&lt;/div&gt;
    &lt;p class="col-content"&gt;Has margins&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>

      <!-- Subgrid example: child aligns to parent grid tracks -->
      <div x-data="{ hovered: false }"
           @mouseenter="hovered = true"
           @mouseleave="hovered = false"
           :style="{
             gridColumn: 'feature-start / full-end',
             display: 'grid',
             gridTemplateColumns: 'subgrid',
             border: '3px solid rgb(236, 72, 153)',
             margin: '1rem 0',
             background: hovered ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.05)',
             transition: 'background 0.2s ease'
           }">
        <!-- Parent label -->
        <div style="grid-column: 1 / -1;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);
                    padding: 0.5rem;
                    background: rgba(236, 72, 153, 0.1);">
          Parent: .col-feature-right .grid-cols-breakout-subgrid
        </div>
        <!-- Child spanning feature (wider, lighter) -->
        <div style="grid-column: feature;
                    background: rgba(236, 72, 153, 0.3);
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);">
          Child: .col-feature (aligns to feature area)
        </div>
        <!-- Child using subgrid to align to content (darker) -->
        <div style="grid-column: content;
                    background: rgb(236, 72, 153);
                    color: white;
                    padding: 0.75rem 1rem;
                    margin: 0.5rem 0;
                    font-size: 0.75rem;
                    font-weight: 700;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.5rem;">Child: .col-content</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">Subgrid lets children align to parent's named lines</div>
          <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature-right grid-cols-breakout-subgrid"&gt;
  &lt;div class="col-feature"&gt;Aligns to feature!&lt;/div&gt;
  &lt;div class="col-content"&gt;Aligns to content!&lt;/div&gt;
&lt;/div&gt;</pre>
          <div style="margin-top: 0.75rem;">
            <a href="https://caniuse.com/css-subgrid" target="_blank" rel="noopener" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">Check browser support</a>
            <span style="font-size: 0.5rem; opacity: 0.7; margin-left: 0.5rem;">(~90% as of Jan 2025)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Spacing Panel (read-only, shows current CSS values) -->
    <div x-show="!showAdvanced"
         x-init="updateCurrentBreakpoint()"
         @mousemove.window="onDragSpacing($event)"
         @mouseup.window="stopDragSpacing()"
         :style="{
           position: 'fixed',
           left: spacingPanelPos.x + 'px',
           top: spacingPanelPos.y + 'px',
           zIndex: 30,
           pointerEvents: 'auto',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           width: '200px',
           fontFamily: 'system-ui, -apple-system, sans-serif',
           overflow: 'hidden'
         }">
      <!-- Header -->
      <div @mousedown="startDragSpacing($event)"
           @dblclick="spacingPanelCollapsed = !spacingPanelCollapsed; localStorage.setItem('breakoutGridSpacingCollapsed', spacingPanelCollapsed)"
           style="padding: 8px 12px; background: #1a1a2e; color: white; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px;">Spacing</span>
          <span style="font-size: 10px; font-weight: 600; color: white; background: transparent; border: 1.5px solid rgba(255,255,255,0.5); padding: 1px 6px; border-radius: 3px;" x-text="'@' + currentBreakpoint"></span>
        </div>
        <button @click.stop="spacingPanelCollapsed = !spacingPanelCollapsed; localStorage.setItem('breakoutGridSpacingCollapsed', spacingPanelCollapsed)" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 14px; line-height: 1; padding: 0;" x-text="spacingPanelCollapsed ? '+' : '−'"></button>
      </div>
      <!-- Content (read-only display) -->
      <div x-show="!spacingPanelCollapsed" style="padding: 12px;">
        <!-- Gap -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Gap</span>
            <span style="font-size: 9px; color: #9ca3af;">outer margins</span>
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <div style="width: var(--gap); height: 24px; background: #f97316; min-width: 20px;"></div>
            <div style="width: 24px; height: var(--gap); background: #f97316; min-height: 20px;"></div>
          </div>
          <div style="font-size: 9px; font-family: 'SF Mono', Monaco, monospace; color: #6b7280;">
            var(--gap)
          </div>
        </div>
        <!-- Breakout Padding -->
        <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Breakout</span>
            <span style="font-size: 9px; color: #9ca3af;">p-breakout / m-breakout</span>
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <div style="width: var(--breakout-padding); height: 24px; background: #8b5cf6; min-width: 20px;"></div>
            <div style="width: 24px; height: var(--breakout-padding); background: #8b5cf6; min-height: 20px;"></div>
          </div>
          <div style="font-size: 9px; font-family: 'SF Mono', Monaco, monospace; color: #6b7280;">
            var(--breakout-padding)
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Overlay (hidden in Advanced mode) -->
    <div x-show="!showAdvanced" x-init="$watch('isVisible', v => v && setTimeout(() => updateColumnWidths(), 50)); setTimeout(() => updateColumnWidths(), 100)" class="grid-cols-breakout breakout-visualizer-grid" style="height: 100%; position: relative; z-index: 2;">
      <template x-for="area in gridAreas" :key="area.name">
        <div :class="'col-' + area.name"
             @click="selectArea(area.name)"
             @mouseenter="hoveredArea = area.name"
             @mouseleave="hoveredArea = null"
             :style="{
               backgroundColor: (hoveredArea === area.name || isSelected(area.name)) ? area.color.replace('0.25', '0.6') : area.color,
               borderLeft: '1px solid ' + area.borderColor,
               borderRight: '1px solid ' + area.borderColor,
               position: 'relative',
               height: '100%',
               pointerEvents: 'auto',
               cursor: 'pointer',
               transition: 'background-color 0.2s'
             }">

          <!-- Label (centered) -->
          <div x-show="showLabels"
               :style="{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 backgroundColor: area.borderColor,
                 color: 'white',
                 padding: '0.75rem 1rem',
                 borderRadius: '0.375rem',
                 fontSize: '0.75rem',
                 fontWeight: '600',
                 textTransform: 'uppercase',
                 letterSpacing: '0.05em',
                 whiteSpace: 'nowrap',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 opacity: isSelected(area.name) ? '1' : '0.8',
                 textAlign: 'center',
                 zIndex: '10'
               }">
            <div x-text="area.label"></div>
            <div x-show="showClassNames"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '500',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.9',
              fontFamily: 'monospace'
            }" x-text="area.className"></div>
            <div x-show="showPixelWidths && columnWidths[area.name] > 0"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '600',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.75',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem'
            }" x-text="columnWidths[area.name] + 'px'"></div>
          </div>

          <!-- Lorem Ipsum Content (behind label) -->
          <div x-show="showLoremIpsum"
               :style="{
                 position: 'absolute',
                 inset: '0',
                 padding: showGapPadding ? 'var(--gap)' : (showBreakoutPadding ? 'var(--breakout-padding)' : '1.5rem 0'),
                 boxSizing: 'border-box',
                 overflow: 'hidden',
                 whiteSpace: 'pre-line',
                 fontSize: '1.125rem',
                 lineHeight: '1.75',
                 color: 'white',
                 textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                 zIndex: '1'
               }" x-text="loremContent"></div>

          <!-- p-gap / px-gap Padding Overlay -->
          <div x-show="showGapPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--gap)',
                 border: '2px dotted ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.2'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-gap</div>
          </div>

          <!-- p-breakout / px-breakout Padding Overlay -->
          <div x-show="showBreakoutPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--breakout-padding)',
                 border: '3px dashed ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.25'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-breakout</div>
          </div>
        </div>
      </template>
    </div>


    <!-- Control Panel - Simplified (no Config/Diagram buttons) -->
    <div :style="{
           position: 'fixed',
           bottom: '12px',
           right: '12px',
           pointerEvents: 'auto',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           width: '200px',
           fontFamily: 'system-ui, -apple-system, sans-serif',
           zIndex: '10000',
           overflow: 'hidden'
         }">

      <!-- Header -->
      <div @dblclick="controlPanelCollapsed = !controlPanelCollapsed"
           style="padding: 8px 12px; background: #1a1a2e; color: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px;">Grid</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);" x-text="version"></span>
          <span x-show="controlPanelCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11px; font-variant-numeric: tabular-nums; color: rgba(255,255,255,0.7);" x-text="viewportWidth + 'px'"></span>
          <button @click.stop="toggle()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">&times;</button>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div x-show="!controlPanelCollapsed">
      <!-- Display Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Display</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLabels" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Labels
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showClassNames" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Classes
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showMeasurements" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Values
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLoremIpsum" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Lorem
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showPixelWidths" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Pixels
          </label>
        </div>
      </div>

      <!-- Padding Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Padding</div>
        <div style="display: flex; gap: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showGapPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-gap
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showBreakoutPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-breakout
          </label>
        </div>
      </div>

      <!-- Advanced -->
      <div style="padding: 8px 12px; background: white;">
        <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
          <input type="checkbox" x-model="showAdvanced" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
          Advanced Spans
        </label>
      </div>

      <!-- Footer -->
      <div style="padding: 6px 12px; background: #f7f7f7; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 9px; color: #9ca3af; text-align: center;">
          <kbd style="background: #e5e5e5; padding: 1px 4px; border-radius: 2px; font-size: 9px; font-weight: 600; color: #374151;">⌘G</kbd> toggle
        </div>
      </div>

      <!-- Selected Area Info -->
      <div x-show="selectedArea" style="padding: 8px 12px; background: #f0f9ff; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 11px; color: #1a1a2e; font-weight: 600; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
      </div>
      </div><!-- End Collapsible Content -->

    </div>

  </div>
`;
  (function() {
    document.addEventListener("alpine:init", () => {
      Alpine.data("breakoutGridVisualizer", () => ({
        // Constants
        version: VERSION,
        loremContent: LOREM_CONTENT,
        // Configuration (read-only)
        gridAreas: GRID_AREAS,
        // State
        ...createInitialStateLite(),
        // Methods
        ...methodsLite,
        // Template
        template: templateLite
      }));
    });
    function injectVisualizer() {
      if (document.getElementById("breakout-grid-visualizer-root")) return;
      const container = document.createElement("div");
      container.id = "breakout-grid-visualizer-root";
      container.setAttribute("x-data", "breakoutGridVisualizer");
      container.setAttribute("x-html", "template");
      document.body.appendChild(container);
      console.log("Breakout Grid Visualizer (Lite) injected. Press Ctrl/Cmd + G to toggle.");
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(injectVisualizer, 10);
      });
    } else {
      document.addEventListener("alpine:initialized", injectVisualizer);
      setTimeout(injectVisualizer, 100);
    }
  })();
})();
