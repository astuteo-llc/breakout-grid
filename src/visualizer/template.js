/**
 * Breakout Grid Visualizer - Template
 * The HTML template string for the visualizer UI
 */

export const template = `
  <div x-show="isVisible"
       x-transition
       class="breakout-grid-visualizer"
       @mousemove.window="onColumnResize($event)"
       @mouseup.window="stopColumnResize()"
       style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

    <!-- Edit Mode Backdrop - fades page content -->
    <div x-show="editMode"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         :style="{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, ' + backdropOpacity + ')', zIndex: 1 }"></div>

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

    <!-- Spacing Panel -->
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
           width: '220px',
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
      <!-- Content -->
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
            clamp(<span style="color: #10b981; font-weight: 600;" x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span style="color: #6366f1; font-weight: 600;" x-text="editValues['gapScale_' + (currentBreakpoint === 'mobile' ? 'default' : currentBreakpoint)] || gapScaleOptions[currentBreakpoint === 'mobile' ? 'default' : currentBreakpoint].value"></span>, <span style="color: #10b981; font-weight: 600;" x-text="editValues.maxGap || configOptions.maxGap.value"></span>)
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
            clamp(<span style="color: #8b5cf6; font-weight: 600;" x-text="editValues.breakout_min || breakoutOptions.min.value"></span>, <span style="color: #8b5cf6; font-weight: 600;" x-text="editValues.breakout_scale || breakoutOptions.scale.value"></span>, <span style="color: #10b981; font-weight: 600;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span>)
          </div>
          <!-- Editable breakout values -->
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <div style="flex: 1;">
              <div style="font-size: 8px; color: #9ca3af; margin-bottom: 2px;">min</div>
              <div style="display: flex; align-items: center; gap: 2px;">
                <input type="number" :value="getBreakoutNumeric('min')" @input="updateBreakoutNumeric('min', $event.target.value)" step="0.5"
                       style="width: 100%; padding: 4px 6px; font-size: 10px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 3px; background: white; text-align: right;">
                <span style="font-size: 9px; color: #9ca3af;" x-text="getBreakoutUnit('min')"></span>
              </div>
            </div>
            <div style="flex: 1;">
              <div style="font-size: 8px; color: #9ca3af; margin-bottom: 2px;">scale</div>
              <div style="display: flex; align-items: center; gap: 2px;">
                <input type="number" :value="getBreakoutNumeric('scale')" @input="updateBreakoutNumeric('scale', $event.target.value)" step="1"
                       style="width: 100%; padding: 4px 6px; font-size: 10px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 3px; background: white; text-align: right;">
                <span style="font-size: 9px; color: #9ca3af;" x-text="getBreakoutUnit('scale')"></span>
              </div>
            </div>
          </div>
          <div style="font-size: 8px; color: #9ca3af; font-style: italic;">max = popout width</div>
        </div>
      </div>
    </div>

    <!-- Grid Overlay (hidden in Advanced mode) -->
    <div x-show="!showAdvanced" x-init="$watch('isVisible', v => v && setTimeout(() => updateColumnWidths(), 50)); setTimeout(() => updateColumnWidths(), 100)" class="grid-cols-breakout breakout-visualizer-grid" :style="{ height: '100%', position: 'relative', zIndex: 2, opacity: gridOpacity }">
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

          <!-- Drag Handle - Left (edit mode only, for resizable columns) -->
          <div x-show="editMode && hoveredArea === area.name && getResizeConfig(area.name)"
               @mousedown.stop="startColumnResize($event, getResizeConfig(area.name))"
               :style="{
                 position: 'absolute',
                 left: '-4px',
                 top: '0',
                 width: '16px',
                 height: '100%',
                 cursor: 'ew-resize',
                 pointerEvents: 'auto',
                 zIndex: '100',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div :style="{
                width: '10px',
                height: '100px',
                background: area.borderColor,
                borderRadius: '5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '2px solid white'
              }"></div>
              <div :style="{
                background: area.borderColor,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }" x-text="area.name === 'content' ? '← min' : '↔'"></div>
            </div>
          </div>

          <!-- Content Min/Base/Max Visual Guides with integrated handles (edit mode only) -->
          <template x-if="editMode && area.name === 'content'">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
              <!-- Max boundary (outer, dotted) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMax || configOptions.contentMax.value,
                border: '3px dotted rgba(139, 92, 246, 0.9)',
                boxSizing: 'border-box',
                background: 'rgba(139, 92, 246, 0.05)'
              }">
                <div style="position: absolute; top: 8px; right: 8px; background: rgba(139, 92, 246, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  max: <span x-text="editValues.contentMax || configOptions.contentMax.value"></span>
                </div>
                <!-- Max drag handle on right edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMax')"
                     style="position: absolute; right: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(139, 92, 246); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Base boundary (middle, solid) - half height, inset, can overflow -->
              <div :style="{
                position: 'absolute',
                top: '25%',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentBase || configOptions.contentBase.value,
                border: '3px solid rgba(236, 72, 153, 1)',
                background: 'rgba(236, 72, 153, 0.5)',
                boxSizing: 'border-box',
                borderRadius: '4px'
              }">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(236, 72, 153, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                  base: <span x-text="editValues.contentBase || configOptions.contentBase.value"></span>
                </div>
                <!-- Base drag handle on right edge - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentBase')"
                     style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(236, 72, 153); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Min boundary (inner, dashed) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMin || configOptions.contentMin.value,
                border: '3px dashed rgba(168, 85, 247, 0.9)',
                background: 'rgba(168, 85, 247, 0.15)',
                boxSizing: 'border-box'
              }">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(168, 85, 247, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  min: <span x-text="editValues.contentMin || configOptions.contentMin.value"></span>
                </div>
                <!-- Min drag handle on left edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMin')"
                     style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(168, 85, 247); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
            </div>
          </template>

          <!-- Feature Min/Scale/Max Visual Guides with integrated handles (edit mode only) -->
          <template x-if="editMode && area.name === 'feature'">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
              <!-- Max boundary (outer, dotted) - anchored from right edge (content side) -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                right: '0',
                width: editValues.featureMax || configOptions.featureMax.value,
                border: '3px dotted rgba(6, 182, 212, 0.9)',
                boxSizing: 'border-box',
                background: 'rgba(6, 182, 212, 0.05)'
              }">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(6, 182, 212, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  max: <span x-text="editValues.featureMax || configOptions.featureMax.value"></span>
                </div>
                <!-- Max drag handle on left edge -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureMax')"
                     style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(6, 182, 212); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Scale boundary (middle, solid) - half height, inset -->
              <div :style="{
                position: 'absolute',
                top: '25%',
                bottom: '25%',
                right: '0',
                width: editValues.featureScale || configOptions.featureScale.value,
                border: '3px solid rgba(14, 165, 233, 1)',
                background: 'rgba(14, 165, 233, 0.5)',
                boxSizing: 'border-box',
                borderRadius: '4px'
              }">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(14, 165, 233, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                  scale: <span x-text="editValues.featureScale || configOptions.featureScale.value"></span>
                </div>
                <!-- Scale drag handle on left edge -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureScale')"
                     style="position: absolute; left: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(14, 165, 233); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Min boundary (inner, dashed) -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                right: '0',
                width: editValues.featureMin || configOptions.featureMin.value,
                border: '3px dashed rgba(56, 189, 248, 0.9)',
                background: 'rgba(56, 189, 248, 0.15)',
                boxSizing: 'border-box'
              }">
                <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(56, 189, 248, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  min: <span x-text="editValues.featureMin || configOptions.featureMin.value"></span>
                </div>
                <!-- Min drag handle on left edge, at bottom -->
                <div x-show="hoveredArea === 'feature' || selectedArea === 'feature'"
                     @mousedown.stop="startColumnResize($event, 'featureMin')"
                     style="position: absolute; left: -8px; bottom: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(56, 189, 248); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>


    <!-- Control Panel - Ubiquiti-style -->
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

      <!-- Config override warning -->
      <div x-show="hasConfigOverride"
           style="padding: 6px 10px; background: #fef3c7; border-bottom: 1px solid #fcd34d; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
        <span style="font-size: 9px; font-weight: 600; color: #92400e;">localStorage override active</span>
        <button @click="resetAllStorage()"
                style="background: none; border: 1px solid #f59e0b; border-radius: 3px; font-size: 9px; font-weight: 600; color: #92400e; cursor: pointer; padding: 1px 5px; white-space: nowrap;">Clear</button>
      </div>

      <!-- Collapsible Content -->
      <div x-show="!controlPanelCollapsed">
      <!-- Action Buttons -->
      <div style="padding: 8px; background: white; border-bottom: 1px solid #e5e5e5; display: flex; gap: 6px;">
        <button @click="openEditor()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showEditor ? '#1a1a2e' : '#e5e5e5',
                  color: showEditor ? 'white' : '#374151'
                }">
          Config
        </button>
        <button @click="showDiagram = !showDiagram; if(showDiagram && Object.keys(editValues).length === 0) loadCurrentValues()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showDiagram ? '#1a1a2e' : '#e5e5e5',
                  color: showDiagram ? 'white' : '#374151'
                }">
          Diagram
        </button>
      </div>

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

      <!-- Opacity Sliders -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 28px; flex-shrink: 0;">Grid</span>
            <input type="range" x-model="gridOpacity" min="0.1" max="1" step="0.1"
                   style="flex: 1; height: 4px; cursor: pointer; accent-color: #1a1a2e;">
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 28px; flex-shrink: 0;">Page</span>
            <input type="range" x-model="backdropOpacity" min="0" max="1" step="0.05"
                   style="flex: 1; height: 4px; cursor: pointer; accent-color: #1a1a2e;">
          </div>
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
      <div style="padding: 6px 12px; background: #f7f7f7; border-top: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; gap: 8px;">
        <div style="font-size: 9px; color: #9ca3af;">
          <kbd style="background: #e5e5e5; padding: 1px 4px; border-radius: 2px; font-size: 9px; font-weight: 600; color: #374151;">⌘G</kbd> toggle
        </div>
        <button x-show="hasStoredOverrides()"
                @click="resetAllStorage()"
                style="background: none; border: none; font-size: 9px; color: #d1d5db; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 2px;"
                onmouseenter="this.style.color='#9ca3af'"
                onmouseleave="this.style.color='#d1d5db'"
                title="Clear all saved visualizer state from localStorage">reset</button>
      </div>

      <!-- Selected Area Info -->
      <div x-show="selectedArea" style="padding: 8px 12px; background: #f0f9ff; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 11px; color: #1a1a2e; font-weight: 600; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
      </div>
      </div><!-- End Collapsible Content -->

    </div>

    <!-- Floating Editor Window - Ubiquiti-style -->
    <div x-show="showEditor"
         @mousedown.self="startDrag($event)"
         @mousemove.window="onDrag($event)"
         @mouseup.window="stopDrag()"
         :style="{
           position: 'fixed',
           left: editorPos.x + 'px',
           top: editorPos.y + 'px',
           width: '280px',
           maxHeight: '85vh',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           pointerEvents: 'auto',
           zIndex: '10001',
           overflow: 'hidden',
           fontFamily: 'system-ui, -apple-system, sans-serif'
         }">
      <!-- Editor Header (draggable) -->
      <div @mousedown="startDrag($event)"
           @dblclick="configEditorCollapsed = !configEditorCollapsed"
           style="padding: 10px 12px; background: #1a1a2e; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px; letter-spacing: 0.3px;">Grid Config</span>
          <span x-show="configEditorCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <button @click.stop="closeEditor()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 2px 6px; cursor: pointer; font-size: 16px; line-height: 1;">&times;</button>
      </div>
      <!-- Editor Content -->
      <div x-show="!configEditorCollapsed" style="max-height: calc(85vh - 40px); overflow-y: auto;">
        <!-- Workflow tip -->
        <div style="background: #e8f4f8; padding: 8px 12px; font-size: 10px; color: #1a1a2e; line-height: 1.4; border-bottom: 1px solid #e5e5e5;">
          Start with <strong>content</strong>, then build outward: popout → feature → full
        </div>

        <!-- Track overflow warning -->
        <div x-show="getTrackOverflowWarning()"
             style="background: #fef3c7; padding: 8px 12px; font-size: 10px; color: #92400e; line-height: 1.4; border-bottom: 1px solid #fcd34d;">
          <span style="font-weight: 600;">⚠️</span> <span x-text="getTrackOverflowWarning()"></span>
        </div>

        <!-- Default Column Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div @click="copySection('defaultCol')" style="cursor: pointer;">
              <div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;" :style="{ color: sectionCopied === 'defaultCol' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'defaultCol' ? '✓ Copied' : 'Default Column'"></div>
              <div style="font-size: 9px; color: #9ca3af; margin-top: 2px;">For children without col-* class</div>
            </div>
            <select @change="editValues.defaultCol = $event.target.value; configCopied = false"
                    :value="editValues.defaultCol || configOptions.defaultCol.value"
                    style="padding: 6px 8px; font-size: 11px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; cursor: pointer;">
              <template x-for="opt in configOptions.defaultCol.options" :key="opt">
                <option :value="opt" :selected="(editValues.defaultCol || configOptions.defaultCol.value) === opt" x-text="opt"></option>
              </template>
            </select>
          </div>
        </div>

        <!-- Content Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('content')" style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;" :style="{ color: sectionCopied === 'content' ? '#10b981' : '#6b7280' }">
            <span x-text="sectionCopied === 'content' ? '✓ Copied' : 'Content (Text Width)'"></span>
          </div>
          <template x-for="key in ['contentMin', 'contentBase', 'contentMax']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('content', '').toLowerCase()"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
          <!-- Readability warning -->
          <div x-show="getContentReadabilityWarning()"
               x-data="{ expanded: false }"
               style="margin-top: 6px; padding: 6px 8px; background: #fef3c7; border-radius: 4px; border: 1px solid #fcd34d;">
            <div @click="expanded = !expanded" style="display: flex; align-items: flex-start; gap: 6px; cursor: pointer;">
              <svg style="width: 14px; height: 14px; color: #b45309; flex-shrink: 0; margin-top: 1px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-size: 10px; font-weight: 600; color: #92400e;">Wide for reading</div>
                <div x-show="!expanded" style="font-size: 9px; color: #b45309; margin-top: 2px;">Ideal: 45–55rem for prose. Click for details.</div>
                <div x-show="expanded" x-transition style="font-size: 9px; color: #78350f; margin-top: 4px; line-height: 1.4;">
                  At 16px base, 55rem+ can hit 100+ characters/line—too wide for comfortable reading.<br><br>
                  <strong>Guidelines (at 1rem/16px):</strong><br>
                  • 45ch ≈ 35–40rem (min)<br>
                  • 66ch ≈ 45–50rem (ideal)<br>
                  • 75ch ≈ 50–55rem (max)<br><br>
                  Fine for mixed layouts; consider tightening for prose-heavy pages.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Track Widths Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('tracks')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer;" :style="{ color: sectionCopied === 'tracks' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'tracks' ? '✓ Copied' : 'Track Widths'"></div>
          <template x-for="key in ['popoutWidth', 'fullLimit']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('Width', '')"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Feature Section (Track Width) -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('feature')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; cursor: pointer;" :style="{ color: sectionCopied === 'feature' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'feature' ? '✓ Copied' : 'Feature (Track Width)'"></div>
          <!-- featureMin (locked) -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="font-size: 11px; color: #9ca3af;">min <span style="font-size: 8px;" title="Must be 0 for track to collapse">(locked)</span></span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('featureMin')" disabled
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f3f4f6; color: #9ca3af; text-align: right; cursor: not-allowed;">
              <select disabled style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f3f4f6; color: #9ca3af; width: 50px; text-align: center; cursor: not-allowed;">
                <option selected>rem</option>
              </select>
            </div>
          </div>
          <!-- featureScale and featureMax -->
          <template x-for="key in ['featureScale', 'featureMax']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('feature', '').toLowerCase()"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <select x-show="hasUnitSelector(key)" @change="updateUnit(key, $event.target.value)" :value="getUnit(key)"
                        style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                  <template x-for="u in unitOptions" :key="u">
                    <option :value="u" :selected="getUnit(key) === u" x-text="u"></option>
                  </template>
                </select>
                <span x-show="!hasUnitSelector(key)" style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Gap Section (Outer Margins) -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div @click="copySection('gap')" style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; cursor: pointer;" :style="{ color: sectionCopied === 'gap' ? '#10b981' : '#6b7280' }" x-text="sectionCopied === 'gap' ? '✓ Copied' : 'Outer Margins'"></div>
          <div style="font-size: 9px; color: #9ca3af; margin-bottom: 8px; line-height: 1.4;">Space between viewport edge and content. Auto-centers your layout.</div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <span style="font-size: 11px; color: #374151;">min</span>
              <span style="font-size: 9px; color: #9ca3af; margin-left: 4px;">floor</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('baseGap')" @input="updateNumericValue('baseGap', $event.target.value)" step="0.5"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <select @change="updateUnit('baseGap', $event.target.value)" :value="getUnit('baseGap')"
                      style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                <template x-for="u in unitOptions" :key="u">
                  <option :value="u" :selected="getUnit('baseGap') === u" x-text="u"></option>
                </template>
              </select>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <span style="font-size: 11px; color: #374151;">max</span>
              <span style="font-size: 9px; color: #9ca3af; margin-left: 4px;">ceiling</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('maxGap')" @input="updateNumericValue('maxGap', $event.target.value)" step="1"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <select @change="updateUnit('maxGap', $event.target.value)" :value="getUnit('maxGap')"
                      style="padding: 6px 4px; font-size: 10px; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; color: #6b7280; cursor: pointer; width: 50px; text-align: center;">
                <template x-for="u in unitOptions" :key="u">
                  <option :value="u" :selected="getUnit('maxGap') === u" x-text="u"></option>
                </template>
              </select>
            </div>
          </div>

          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 10px 0 2px;">Responsive Scale (Gap)</div>
          <div style="font-size: 9px; color: #9ca3af; margin-bottom: 6px; line-height: 1.4;">Fluid value (vw) that grows with viewport.</div>
          <template x-for="key in Object.keys(gapScaleOptions)" :key="'ed_gs_'+key">
            <div :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 6px',
              margin: '0 -6px',
              borderBottom: '1px solid #f3f4f6',
              borderRadius: '4px',
              background: (key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              border: (key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'
            }">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 11px; color: #374151;" x-text="key === 'default' ? 'mobile' : key"></span>
                <span x-show="(key === 'default' && currentBreakpoint === 'mobile') || key === currentBreakpoint"
                      style="font-size: 8px; font-weight: 600; color: #f97316;">ACTIVE</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getGapScaleNumeric(key)" @input="updateGapScaleNumeric(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <span style="font-size: 10px; color: #9ca3af; width: 50px; text-align: center; display: inline-block;" x-text="getGapScaleUnit(key)"></span>
              </div>
            </div>
          </template>

          <div style="margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 4px; font-family: 'SF Mono', Monaco, monospace; font-size: 9px; line-height: 1.6;">
            <div style="color: #6b7280; margin-bottom: 4px;">Generated CSS:</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">mobile:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_default || gapScaleOptions.default.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">lg:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_lg || gapScaleOptions.lg.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
            <div style="color: #374151;"><span style="color: #9ca3af;">xl:</span> clamp(<span x-text="editValues.baseGap || configOptions.baseGap.value"></span>, <span x-text="editValues.gapScale_xl || gapScaleOptions.xl.value"></span>, <span x-text="editValues.maxGap || configOptions.maxGap.value"></span>)</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="padding: 10px 12px; background: #f7f7f7; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; gap: 8px;">
            <button @click="copyConfig()" :style="{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '500', border: '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', background: copySuccess ? '#10b981' : 'white', color: copySuccess ? 'white' : '#374151', transition: 'background 0.2s' }">
              <span x-text="copySuccess ? '✓ Copied' : 'Copy'"></span>
            </button>
            <button @click="openRestoreModal()" style="flex: 1; padding: 8px; font-size: 11px; font-weight: 500; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;" title="Restore from CSS variables">
              Restore
            </button>
            <button @click="resetConfigToDefaults()" style="flex: 1; padding: 8px; font-size: 11px; font-weight: 500; border: 1px solid #fca5a5; border-radius: 4px; cursor: pointer; background: #fef2f2; color: #dc2626;" title="Reset to defaults">
              Reset
            </button>
          </div>
          <button @click="downloadCSS()" style="width: 100%; padding: 10px 12px; font-size: 12px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; background: #1a1a2e; color: white;">
            Download CSS
          </button>
        </div>
      </div>
    </div>

    <!-- Restore Config Modal -->
    <div x-show="showRestoreModal"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10002; pointer-events: auto;">
      <div @click.stop style="background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); width: 400px; max-width: 90vw; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Modal Header -->
        <div style="padding: 12px 16px; background: #1a1a2e; color: white; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 13px;">Restore Config</span>
          <button @click="closeRestoreModal()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 18px; line-height: 1;">&times;</button>
        </div>
        <!-- Modal Body -->
        <div style="padding: 16px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0; line-height: 1.5;">Paste the <code style="background: #f3f4f6; padding: 1px 4px; border-radius: 3px;">:root { }</code> block from your exported CSS file:</p>
          <p style="font-size: 10px; color: #9ca3af; margin: 0 0 12px 0;">Look for "CONFIGURATION VARIABLES" section in _objects.breakout-grid.css</p>
          <textarea x-model="restoreInput"
                    @keydown.meta.enter="restoreConfig()"
                    @keydown.ctrl.enter="restoreConfig()"
                    placeholder=":root {
  --base-gap: 1rem;
  --max-gap: 15rem;
  --content-min: 53rem;
  ...
}"
                    style="width: 100%; height: 200px; padding: 12px; font-family: 'SF Mono', Monaco, monospace; font-size: 11px; border: 1px solid #e5e5e5; border-radius: 4px; resize: vertical; box-sizing: border-box;"></textarea>
          <!-- Error message -->
          <div x-show="restoreError" x-text="restoreError" style="margin-top: 8px; padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; color: #dc2626; font-size: 11px;"></div>
          <p style="font-size: 10px; color: #9ca3af; margin: 8px 0 0 0;">Press ⌘/Ctrl + Enter to apply</p>
        </div>
        <!-- Modal Footer -->
        <div style="padding: 12px 16px; background: #f7f7f7; border-radius: 0 0 8px 8px; display: flex; justify-content: flex-end; gap: 8px;">
          <button @click="closeRestoreModal()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;">Cancel</button>
          <button @click="restoreConfig()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; background: #1a1a2e; color: white;">Apply</button>
        </div>
      </div>
    </div>

    <!-- Close Warning Modal -->
    <div x-show="showCloseWarningModal"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10003; pointer-events: auto;">
      <div @click.stop style="background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); width: 420px; max-width: 90vw; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Modal Header -->
        <div style="padding: 12px 16px; background: #fef3c7; color: #92400e; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 10px;">
          <svg style="width: 20px; height: 20px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span style="font-weight: 600; font-size: 14px;">Unsaved Configuration</span>
        </div>
        <!-- Modal Body -->
        <div style="padding: 16px;">
          <p style="font-size: 13px; color: #374151; margin: 0 0 12px 0; line-height: 1.5;">
            Your grid configuration changes are stored in <strong>browser localStorage</strong> and will only apply while the visualizer is loaded.
          </p>
          <div style="background: #f3f4f6; border-radius: 6px; padding: 12px; margin-bottom: 12px;">
            <p style="font-size: 12px; color: #4b5563; margin: 0 0 8px 0; line-height: 1.5;">
              <strong>To make changes permanent:</strong>
            </p>
            <ol style="font-size: 11px; color: #6b7280; margin: 0; padding-left: 16px; line-height: 1.6;">
              <li>Copy the config to your clipboard</li>
              <li>Paste into your project's CSS file</li>
              <li>Remove the visualizer script from production</li>
            </ol>
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin: 0; line-height: 1.4;">
            Without copying, your changes will be lost when the visualizer is removed.
          </p>
        </div>
        <!-- Modal Footer -->
        <div style="padding: 12px 16px; background: #f7f7f7; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; gap: 8px;">
          <button @click="closeWarningDiscard()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: 1px solid #fca5a5; border-radius: 4px; cursor: pointer; background: #fef2f2; color: #dc2626;">Discard Changes</button>
          <div style="display: flex; gap: 8px;">
            <button @click="closeWarningGoBack()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;">Go Back</button>
            <button @click="closeWarningCopyAndClose()" style="padding: 8px 16px; font-size: 11px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; background: #1a1a2e; color: white;">Copy & Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Diagram -->
    <div x-show="showDiagram"
         style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); pointer-events: auto; z-index: 10001; padding: 1.5rem; max-width: 90vw;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-weight: 700; font-size: 0.875rem; color: #111827;">Breakout Grid Structure</span>
        <button @click="showDiagram = false" style="background: #ef4444; border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; font-weight: 600;">Close</button>
      </div>
      <!-- Visual Diagram -->
      <div style="font-family: Monaco, monospace; font-size: 0.625rem; line-height: 1.8;">
        <!-- Column structure visualization -->
        <div style="display: flex; align-items: stretch; border: 2px solid #e5e7eb; border-radius: 0.25rem; overflow: hidden; min-height: 120px;">
          <!-- Full left -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
          <!-- Feature left -->
          <div style="background: rgba(6, 182, 212, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #0891b2; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="(editValues.featureMin || configOptions.featureMin.value) + ' - ' + (editValues.featureMax || configOptions.featureMax.value)"></div>
          </div>
          <!-- Popout left -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Content -->
          <div style="background: rgba(168, 85, 247, 0.2); padding: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; min-width: 80px;">
            <div style="color: #7c3aed; font-weight: 700;">content</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="'(' + (editValues.contentMin || configOptions.contentMin.value) + ' - ' + (editValues.contentMax || configOptions.contentMax.value) + ')'"></div>
          </div>
          <!-- Popout right -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Feature right -->
          <div style="background: rgba(6, 182, 212, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #0891b2; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="(editValues.featureMin || configOptions.featureMin.value) + ' - ' + (editValues.featureMax || configOptions.featureMax.value)"></div>
          </div>
          <!-- Full right -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
        </div>
        <!-- Legend -->
        <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.5625rem;">
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(239, 68, 68, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-full</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(6, 182, 212, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-feature</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(34, 197, 94, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-popout</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(168, 85, 247, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-content</div>
        </div>
        <!-- Padding explanation -->
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.25rem; font-size: 0.5625rem; color: #4b5563;">
          <div style="font-weight: 700; margin-bottom: 0.25rem;">px-breakout aligns full-width content:</div>
          <div>Uses <span style="color: #3b82f6;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span> padding so content aligns with .col-content edge</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Persistent override indicator - visible even when visualizer is hidden -->
  <div x-show="hasConfigOverride && !isVisible"
       x-transition
       style="position: fixed; bottom: 12px; right: 12px; z-index: 9998; pointer-events: auto; font-family: system-ui, -apple-system, sans-serif;">
    <div style="display: flex; align-items: center; gap: 8px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 6px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <span style="font-size: 10px; font-weight: 600; color: #92400e;">Grid overridden by visualizer</span>
      <button @click="resetAllStorage()"
              style="background: none; border: 1px solid #f59e0b; border-radius: 3px; font-size: 9px; font-weight: 600; color: #92400e; cursor: pointer; padding: 2px 6px;">Clear</button>
    </div>
  </div>
`;
