/**
 * Breakout Grid Visualizer - Methods
 * All component methods
 */

export const methods = {
  // Initialize
  init() {
    // Load saved state
    const saved = localStorage.getItem('breakoutGridVisualizerVisible');
    if (saved !== null) {
      this.isVisible = saved === 'true';
    }

    // Load config editor state
    const editorOpen = localStorage.getItem('breakoutGridEditorOpen');
    if (editorOpen === 'true') {
      this.showEditor = true;
      this.editMode = true;
      this.$nextTick(() => this.loadCurrentValues());
    }

    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('breakoutGridConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.$nextTick(() => this.applyConfig(config));
      } catch (e) {}
    }

    // Load config editor position
    const editorPos = localStorage.getItem('breakoutGridEditorPos');
    if (editorPos) {
      try {
        this.editorPos = JSON.parse(editorPos);
      } catch (e) {}
    }

    // Load spacing panel position and state
    const spacingPos = localStorage.getItem('breakoutGridSpacingPos');
    if (spacingPos) {
      try {
        this.spacingPanelPos = JSON.parse(spacingPos);
      } catch (e) {}
    }
    const spacingCollapsed = localStorage.getItem('breakoutGridSpacingCollapsed');
    if (spacingCollapsed !== null) {
      this.spacingPanelCollapsed = spacingCollapsed === 'true';
    }

    // Keyboard shortcut: Ctrl/Cmd + G
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Update viewport width, column widths, and breakpoint on resize
    window.addEventListener('resize', () => {
      this.viewportWidth = window.innerWidth;
      this.updateColumnWidths();
      this.updateCurrentBreakpoint();
      if (this.editMode) {
        this.updateGapLive();
      }
    });

    // Initialize breakpoint
    this.updateCurrentBreakpoint();

    console.log('Breakout Grid Visualizer loaded. Press Ctrl/Cmd + G to toggle.');
  },

  // Toggle visibility
  toggle() {
    this.isVisible = !this.isVisible;
    localStorage.setItem('breakoutGridVisualizerVisible', this.isVisible);
  },

  // Update column widths by querying DOM elements
  updateColumnWidths() {
    this.$nextTick(() => {
      this.gridAreas.forEach(area => {
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
      this.currentBreakpoint = 'xl';
    } else if (width >= 1024) {
      this.currentBreakpoint = 'lg';
    } else {
      this.currentBreakpoint = 'mobile';
    }
  },

  // Update --gap live based on current breakpoint and edit values
  updateGapLive() {
    const scaleKey = this.currentBreakpoint === 'mobile' ? 'default' : this.currentBreakpoint;
    const base = this.editValues.baseGap || this.configOptions.baseGap.value;
    const max = this.editValues.maxGap || this.configOptions.maxGap.value;
    const scale = this.editValues[`gapScale_${scaleKey}`] || this.gapScaleOptions[scaleKey].value;

    document.documentElement.style.setProperty('--gap', `clamp(${base}, ${scale}, ${max})`);
    this.updateColumnWidths();
  },

  // Check if content width exceeds comfortable reading width (55rem)
  getContentReadabilityWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value);
    if (contentMax > 55) {
      return `Content max (${contentMax}rem) exceeds 55rem—may be wide for reading. Ideal for prose: 45–55rem.`;
    }
    return null;
  },

  // Check if configured track widths would exceed viewport
  getTrackOverflowWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value) * 16;
    const featureMax = parseFloat(this.editValues.featureMax || this.configOptions.featureMax.value) * 16;
    const popoutWidth = parseFloat(this.editValues.popoutWidth || this.configOptions.popoutWidth.value) * 16;

    // Feature max is in rem, convert to px
    const featurePx = featureMax * 2;
    const popoutPx = popoutWidth * 2;
    const totalFixed = contentMax + featurePx + popoutPx;

    if (totalFixed > this.viewportWidth) {
      return `Tracks exceed viewport by ~${Math.round(totalFixed - this.viewportWidth)}px — outer columns will compress`;
    }
    return null;
  },

  // Get computed CSS variable value
  getCSSVariable(varName) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || 'Not set';
  },

  // Helper to load options from CSS variables
  loadOptionsFromCSS(options, prefix = '') {
    Object.keys(options).forEach(key => {
      const opt = options[key];
      const editKey = prefix ? `${prefix}_${key}` : key;
      if (opt.cssVar) {
        const computed = this.getCSSVariable(opt.cssVar);
        this.editValues[editKey] = (computed && computed !== 'Not set' && computed !== '') ? computed : opt.value;
      } else {
        this.editValues[editKey] = opt.value;
      }
    });
  },

  // Load current values from CSS variables where available
  loadCurrentValues() {
    this.loadOptionsFromCSS(this.configOptions);
    this.loadOptionsFromCSS(this.gapScaleOptions, 'gapScale');
    this.loadOptionsFromCSS(this.breakoutOptions, 'breakout');
  },

  // Generate export config object
  generateConfigExport() {
    const config = {};
    Object.keys(this.configOptions).forEach(key => {
      config[key] = this.editValues[key] || this.configOptions[key].value;
    });
    config.gapScale = {};
    Object.keys(this.gapScaleOptions).forEach(key => {
      config.gapScale[key] = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
    });
    // Add breakout values
    config.breakoutMin = this.editValues.breakout_min || this.breakoutOptions.min.value;
    config.breakoutScale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    // Add breakpoint values
    config.breakpoints = {
      lg: this.editValues.breakpoint_lg || this.breakpointOptions?.lg?.value || '1024',
      xl: this.editValues.breakpoint_xl || this.breakpointOptions?.xl?.value || '1280',
    };
    return config;
  },

  // Format config object with single quotes for values, no quotes for keys
  formatConfig(obj, indent = 2) {
    const pad = ' '.repeat(indent);
    const lines = ['{'];
    const entries = Object.entries(obj);
    entries.forEach(([key, value], i) => {
      const comma = i < entries.length - 1 ? ',' : '';
      if (typeof value === 'object' && value !== null) {
        lines.push(`${pad}${key}: ${this.formatConfig(value, indent + 2).replace(/\n/g, '\n' + pad)}${comma}`);
      } else {
        lines.push(`${pad}${key}: '${value}'${comma}`);
      }
    });
    lines.push('}');
    return lines.join('\n');
  },

  // Section definitions for partial copying
  configSections: {
    content: {
      keys: ['contentMin', 'contentBase', 'contentMax'],
      label: 'Content'
    },
    defaultCol: {
      keys: ['defaultCol'],
      label: 'Default Column'
    },
    tracks: {
      keys: ['popoutWidth', 'fullLimit'],
      label: 'Track Widths'
    },
    feature: {
      keys: ['featureMin', 'featureScale', 'featureMax'],
      label: 'Feature'
    },
    gap: {
      keys: ['baseGap', 'maxGap'],
      nested: { gapScale: ['default', 'lg', 'xl'] },
      label: 'Gap'
    },
    breakout: {
      keys: ['breakoutMin', 'breakoutScale'],
      label: 'Breakout'
    }
  },

  // Copy a specific section to clipboard
  copySection(sectionName) {
    const section = this.configSections[sectionName];
    if (!section) return;

    const config = {};

    // Add direct keys
    section.keys.forEach(key => {
      if (this.configOptions[key]) {
        config[key] = this.editValues[key] || this.configOptions[key].value;
      } else if (key === 'breakoutMin') {
        config[key] = this.editValues.breakout_min || this.breakoutOptions.min.value;
      } else if (key === 'breakoutScale') {
        config[key] = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
      }
    });

    // Add nested keys (like gapScale)
    if (section.nested) {
      Object.keys(section.nested).forEach(nestedKey => {
        config[nestedKey] = {};
        section.nested[nestedKey].forEach(subKey => {
          config[nestedKey][subKey] = this.editValues[`gapScale_${subKey}`] || this.gapScaleOptions[subKey].value;
        });
      });
    }

    const configStr = this.formatConfigFlat(config);
    navigator.clipboard.writeText(configStr).then(() => {
      this.sectionCopied = sectionName;
      setTimeout(() => this.sectionCopied = null, 1500);
    });
  },

  // Format config as flat key-value pairs (no wrapping braces)
  formatConfigFlat(obj) {
    const lines = [];
    const entries = Object.entries(obj);
    entries.forEach(([key, value], i) => {
      const comma = i < entries.length - 1 ? ',' : ',';
      if (typeof value === 'object' && value !== null) {
        lines.push(`${key}: ${this.formatConfig(value)}${comma}`);
      } else {
        lines.push(`${key}: '${value}'${comma}`);
      }
    });
    return lines.join('\n');
  },

  // Copy config to clipboard as CSS variables
  copyConfig() {
    const config = this.generateConfigExport();
    const lines = [
      ':root {',
      `  /* Content (text width) */`,
      `  --content-min: ${config.contentMin};`,
      `  --content-base: ${config.contentBase};`,
      `  --content-max: ${config.contentMax};`,
      `  /* Default column */`,
      `  --default-col: ${config.defaultCol || 'content'};`,
      `  /* Track widths */`,
      `  --popout-width: ${config.popoutWidth};`,
      `  --full-limit: ${config.fullLimit};`,
      `  /* Feature track */`,
      `  --feature-min: ${config.featureMin};`,
      `  --feature-scale: ${config.featureScale};`,
      `  --feature-max: ${config.featureMax};`,
      `  /* Outer margins */`,
      `  --base-gap: ${config.baseGap};`,
      `  --max-gap: ${config.maxGap};`,
      `  /* Responsive scale */`,
      `  --gap-scale-default: ${config.gapScale?.default || '4vw'};`,
      `  --gap-scale-lg: ${config.gapScale?.lg || '5vw'};`,
      `  --gap-scale-xl: ${config.gapScale?.xl || '6vw'};`,
      `  /* Breakout padding */`,
      `  --breakout-min: ${config.breakoutMin || '1rem'};`,
      `  --breakout-scale: ${config.breakoutScale || '5vw'};`,
      `  /* Breakpoints */`,
      `  /* --breakpoint-lg: ${config.breakpoints?.lg || '1024'}px; */`,
      `  /* --breakpoint-xl: ${config.breakpoints?.xl || '1280'}px; */`,
      '}'
    ];
    const configStr = lines.join('\n');
    navigator.clipboard.writeText(configStr).then(() => {
      this.copySuccess = true;
      this.configCopied = true;
      setTimeout(() => this.copySuccess = false, 2000);
    });
  },

  // Generate and download standalone CSS file
  downloadCSS() {
    const css = this.generateCSSExport(this.generateConfigExport());
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `_objects.breakout-grid.css`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Parse CSS value into number and unit (e.g., "4rem" -> { num: 4, unit: "rem" })
  parseValue(val) {
    const match = String(val).match(/^([\d.]+)(.*)$/);
    if (match) {
      return { num: parseFloat(match[1]), unit: match[2] || 'rem' };
    }
    return { num: 0, unit: 'rem' };
  },

  // Get the numeric part of a config value
  getNumericValue(key) {
    const val = this.editValues[key] || this.configOptions[key].value;
    return this.parseValue(val).num;
  },

  // Get the unit part of a config value
  getUnit(key) {
    const val = this.editValues[key] || this.configOptions[key].value;
    return this.parseValue(val).unit;
  },

  // Check if a field should have unit selection (rem-based fields only)
  hasUnitSelector(key) {
    const unit = this.getUnit(key);
    return unit === 'rem' || unit === 'ch' || unit === 'px';
  },

  // Available units for selection
  unitOptions: ['rem', 'ch', 'px'],

  // Update just the unit, keeping the numeric value
  updateUnit(key, newUnit) {
    const num = this.getNumericValue(key);
    this.updateConfigValue(key, num + newUnit);
  },

  // Update just the numeric part, keeping the unit
  updateNumericValue(key, num) {
    // Enforce minimums for certain fields
    if (key === 'content' && num < 1) num = 1;
    if (key === 'baseGap' && num < 0) num = 0;
    if (key === 'popoutWidth' && num < 0) num = 0;
    if ((key === 'featureMin' || key === 'featureScale' || key === 'featureMax') && num < 0) num = 0;
    const unit = this.getUnit(key);
    this.updateConfigValue(key, num + unit);
  },

  // Generic getter for prefixed options (gapScale, breakout)
  getPrefixedNumeric(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).num;
  },

  getPrefixedUnit(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).unit;
  },

  // Gap scale helpers (use generic)
  getGapScaleNumeric(key) { return this.getPrefixedNumeric('gapScale', this.gapScaleOptions, key); },
  getGapScaleUnit(key) { return this.getPrefixedUnit('gapScale', this.gapScaleOptions, key); },
  updateGapScaleNumeric(key, num) {
    this.editValues[`gapScale_${key}`] = num + this.getGapScaleUnit(key);
    this.configCopied = false;
    this.updateGapLive();
    this.saveConfigToStorage();
  },

  // Breakout helpers (use generic)
  getBreakoutNumeric(key) { return this.getPrefixedNumeric('breakout', this.breakoutOptions, key); },
  getBreakoutUnit(key) { return this.getPrefixedUnit('breakout', this.breakoutOptions, key); },
  updateBreakoutNumeric(key, num) {
    this.editValues[`breakout_${key}`] = num + this.getBreakoutUnit(key);
    this.configCopied = false;
    this.updateBreakoutLive();
    this.saveConfigToStorage();
  },

  // Update --breakout-padding live
  updateBreakoutLive() {
    const min = this.editValues.breakout_min || this.breakoutOptions.min.value;
    const scale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    const max = this.editValues.popoutWidth || this.configOptions.popoutWidth.value;
    document.documentElement.style.setProperty('--breakout-padding', `clamp(${min}, ${scale}, ${max})`);
  },

  // Save current config to localStorage
  saveConfigToStorage() {
    const config = this.generateConfigExport();
    localStorage.setItem('breakoutGridConfig', JSON.stringify(config));
  },

  // Apply a config object (used by restore and localStorage load)
  applyConfig(config) {
    this.editMode = true;

    // Apply main config values
    Object.keys(this.configOptions).forEach(key => {
      if (config[key] !== undefined) {
        this.editValues[key] = config[key];
        const opt = this.configOptions[key];
        if (opt && opt.liveVar) {
          document.documentElement.style.setProperty(opt.liveVar, config[key]);
        }
      }
    });

    // Apply track widths with minmax wrapper
    if (config.popoutWidth) {
      document.documentElement.style.setProperty('--popout', `minmax(0, ${config.popoutWidth})`);
    }
    if (config.featureMin || config.featureScale || config.featureMax) {
      const featureMin = config.featureMin || this.configOptions.featureMin.value;
      const featureScale = config.featureScale || this.configOptions.featureScale.value;
      const featureMax = config.featureMax || this.configOptions.featureMax.value;
      document.documentElement.style.setProperty('--feature', `minmax(0, clamp(${featureMin}, ${featureScale}, ${featureMax}))`);
    }

    // Apply gapScale values
    if (config.gapScale) {
      Object.keys(this.gapScaleOptions).forEach(key => {
        if (config.gapScale[key] !== undefined) {
          this.editValues[`gapScale_${key}`] = config.gapScale[key];
        }
      });
      this.updateGapLive();
    }

    // Apply breakout values
    if (config.breakoutMin !== undefined) {
      this.editValues.breakout_min = config.breakoutMin;
    }
    if (config.breakoutScale !== undefined) {
      this.editValues.breakout_scale = config.breakoutScale;
    }
    this.updateBreakoutLive();

    // Apply breakpoint values
    if (config.breakpoints) {
      if (config.breakpoints.lg !== undefined) {
        this.editValues.breakpoint_lg = config.breakpoints.lg;
      }
      if (config.breakpoints.xl !== undefined) {
        this.editValues.breakpoint_xl = config.breakpoints.xl;
      }
    }

    this.updateColumnWidths();
  },

  // Reset config to defaults and clear localStorage
  resetConfigToDefaults() {
    if (!confirm('Reset all config values to defaults?')) return;
    localStorage.removeItem('breakoutGridConfig');
    this.restoreCSSVariables();
    this.loadCurrentValues();
    this.configCopied = false;
  },

  // Update a config value (and live CSS var if applicable)
  updateConfigValue(key, value) {
    this.editValues[key] = value;
    this.configCopied = false; // Mark as unsaved
    this.saveConfigToStorage();
    const opt = this.configOptions[key];
    if (opt && opt.liveVar) {
      document.documentElement.style.setProperty(opt.liveVar, value);
    }
    // Special handling for track widths (need minmax wrapper)
    if (key === 'popoutWidth') {
      document.documentElement.style.setProperty('--popout', `minmax(0, ${value})`);
      this.updateBreakoutLive(); // Update breakout padding with new popout ceiling
    }
    if (key === 'featureMin' || key === 'featureScale' || key === 'featureMax') {
      const featureMin = this.editValues.featureMin || this.configOptions.featureMin.value;
      const featureScale = this.editValues.featureScale || this.configOptions.featureScale.value;
      const featureMax = this.editValues.featureMax || this.configOptions.featureMax.value;
      document.documentElement.style.setProperty('--feature', `minmax(0, clamp(${featureMin}, ${featureScale}, ${featureMax}))`);
    }
    if (key === 'content') {
      document.documentElement.style.setProperty('--content', `minmax(0, ${value})`);
    }
    // Update gap live when min/max change
    if (key === 'baseGap' || key === 'maxGap') {
      this.updateGapLive();
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

  // Restore all CSS variable overrides to original values
  restoreCSSVariables() {
    Object.keys(this.configOptions).forEach(key => {
      const opt = this.configOptions[key];
      if (opt.liveVar) {
        document.documentElement.style.removeProperty(opt.liveVar);
      }
    });
    // Also restore track widths (set via minmax wrapper)
    document.documentElement.style.removeProperty('--popout');
    document.documentElement.style.removeProperty('--feature');
    document.documentElement.style.removeProperty('--content');
    document.documentElement.style.removeProperty('--breakout-padding');
    document.documentElement.style.removeProperty('--popout-to-content');
    this.editValues = {};
    this.configCopied = false;
  },

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.loadCurrentValues();
    } else {
      this.restoreCSSVariables();
    }
  },

  // Check if any values have been edited and not yet copied
  hasUnsavedEdits() {
    return Object.keys(this.editValues).length > 0 && !this.configCopied;
  },

  // Open floating editor
  openEditor() {
    this.showEditor = true;
    this.editMode = true;
    this.loadCurrentValues();
    localStorage.setItem('breakoutGridEditorOpen', 'true');
  },

  // Close floating editor
  closeEditor(force = false) {
    if (!force && this.hasUnsavedEdits()) {
      this.showCloseWarningModal = true;
      return;
    }
    this.showEditor = false;
    this.editMode = false;
    this.restoreCSSVariables();
    localStorage.setItem('breakoutGridEditorOpen', 'false');
  },

  // Close warning modal actions
  closeWarningCopyAndClose() {
    this.copyConfig();
    this.showCloseWarningModal = false;
    this.closeEditor(true);
  },

  closeWarningDiscard() {
    this.showCloseWarningModal = false;
    this.closeEditor(true);
  },

  closeWarningGoBack() {
    this.showCloseWarningModal = false;
  },

  // Generic drag handling for panels
  _dragConfigs: {
    editor: { pos: 'editorPos', dragging: 'isDragging', offset: 'dragOffset', storage: 'breakoutGridEditorPos' },
    spacing: { pos: 'spacingPanelPos', dragging: 'isDraggingSpacing', offset: 'dragOffsetSpacing', storage: 'breakoutGridSpacingPos' }
  },

  startPanelDrag(e, panel) {
    const cfg = this._dragConfigs[panel];
    this[cfg.dragging] = true;
    this[cfg.offset] = { x: e.clientX - this[cfg.pos].x, y: e.clientY - this[cfg.pos].y };
  },

  onPanelDrag(e, panel) {
    const cfg = this._dragConfigs[panel];
    if (this[cfg.dragging]) {
      this[cfg.pos] = { x: e.clientX - this[cfg.offset].x, y: e.clientY - this[cfg.offset].y };
    }
  },

  stopPanelDrag(panel) {
    const cfg = this._dragConfigs[panel];
    if (this[cfg.dragging]) localStorage.setItem(cfg.storage, JSON.stringify(this[cfg.pos]));
    this[cfg.dragging] = false;
  },

  // Editor drag (shorthand)
  startDrag(e) { this.startPanelDrag(e, 'editor'); },
  onDrag(e) { this.onPanelDrag(e, 'editor'); },
  stopDrag() { this.stopPanelDrag('editor'); },

  // Spacing drag (shorthand)
  startDragSpacing(e) { this.startPanelDrag(e, 'spacing'); },
  onDragSpacing(e) { this.onPanelDrag(e, 'spacing'); },
  stopDragSpacing() { this.stopPanelDrag('spacing'); },

  // Column resize drag handling
  startColumnResize(e, columnType) {
    if (!this.editMode) return;
    e.preventDefault();
    e.stopPropagation();
    this.resizingColumn = columnType;
    this.resizeStartX = e.clientX;
    // Get current value
    const currentVal = this.editValues[columnType] || this.configOptions[columnType].value;
    this.resizeStartValue = this.parseValue(currentVal).num;
  },

  onColumnResize(e) {
    if (!this.resizingColumn) return;
    const deltaX = e.clientX - this.resizeStartX;
    const col = this.resizingColumn;
    const unit = this.getUnit(col);

    // Calculate pixels per unit
    let pxPerUnit;
    if (unit === 'vw') {
      pxPerUnit = window.innerWidth / 100;
    } else if (unit === 'rem') {
      pxPerUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else {
      pxPerUnit = 1;
    }

    // For right-edge handles (contentMax, contentBase), dragging right increases value
    // For left-edge handles (contentMin, others), dragging left increases value (inverted)
    const isRightHandle = col === 'contentMax' || col === 'contentBase';
    const delta = isRightHandle ? (deltaX / pxPerUnit) : (-deltaX / pxPerUnit);
    let newValue = this.resizeStartValue + delta;

    // Enforce minimums
    if (newValue < 0) newValue = 0;

    // Round to 1 decimal
    newValue = Math.round(newValue * 10) / 10;

    this.updateConfigValue(col, newValue + unit);
    this.updateColumnWidths();
  },

  stopColumnResize() {
    this.resizingColumn = null;
  },

  // Map column names to their config keys for resizing
  getResizeConfig(colName) {
    const map = {
      'full-limit': 'fullLimit',
      'feature': 'featureScale',
      'popout': 'popoutWidth'
      // content has its own integrated handles for min/max/base
      // feature has its own integrated handles for min/scale/max
    };
    return map[colName] || null;
  },

  // Parse a CSS variables string into a config object
  parseConfigString(input) {
    const str = input.trim();
    const config = { gapScale: {}, breakpoints: {} };

    // Map CSS variable names to config keys
    const varMap = {
      '--base-gap': 'baseGap',
      '--max-gap': 'maxGap',
      '--content-min': 'contentMin',
      '--content-max': 'contentMax',
      '--content-base': 'contentBase',
      '--popout-width': 'popoutWidth',
      '--feature-min': 'featureMin',
      '--feature-scale': 'featureScale',
      '--feature-max': 'featureMax',
      '--full-limit': 'fullLimit',
      '--breakout-min': 'breakoutMin',
      '--breakout-scale': 'breakoutScale',
      '--default-col': 'defaultCol',
    };

    const gapScaleMap = {
      '--gap-scale-default': 'default',
      '--gap-scale-lg': 'lg',
      '--gap-scale-xl': 'xl',
    };

    const breakpointMap = {
      '--breakpoint-lg': 'lg',
      '--breakpoint-xl': 'xl',
    };

    // Parse CSS variable declarations (including commented ones for breakpoints)
    // Matches: --var-name: value; OR /* --var-name: value; */
    const varRegex = /(?:\/\*\s*)?(--[\w-]+)\s*:\s*([^;*]+);?\s*(?:\*\/)?/g;
    let match;
    let foundAny = false;

    while ((match = varRegex.exec(str)) !== null) {
      const [, varName, value] = match;
      let trimmedValue = value.trim();
      foundAny = true;

      if (varMap[varName]) {
        config[varMap[varName]] = trimmedValue;
      } else if (gapScaleMap[varName]) {
        config.gapScale[gapScaleMap[varName]] = trimmedValue;
      } else if (breakpointMap[varName]) {
        // Strip 'px' suffix for breakpoints
        config.breakpoints[breakpointMap[varName]] = trimmedValue.replace(/px$/, '');
      }
    }

    if (!foundAny) {
      throw new Error('Invalid format. Paste CSS variables from "Copy Variables".');
    }

    return config;
  },

  // Open restore modal
  openRestoreModal() {
    this.showRestoreModal = true;
    this.restoreInput = '';
    this.restoreError = null;
  },

  // Close restore modal
  closeRestoreModal() {
    this.showRestoreModal = false;
    this.restoreInput = '';
    this.restoreError = null;
  },

  // Apply a parsed config to the editor
  restoreConfig() {
    this.restoreError = null;

    try {
      const config = this.parseConfigString(this.restoreInput);

      // Apply main config values
      Object.keys(this.configOptions).forEach(key => {
        if (config[key] !== undefined) {
          this.editValues[key] = config[key];
          this.updateConfigValue(key, config[key]);
        }
      });

      // Apply gapScale values
      if (config.gapScale) {
        Object.keys(this.gapScaleOptions).forEach(key => {
          if (config.gapScale[key] !== undefined) {
            this.editValues[`gapScale_${key}`] = config.gapScale[key];
          }
        });
        this.updateGapLive();
      }

      // Apply breakout values
      if (config.breakoutMin !== undefined) {
        this.editValues.breakout_min = config.breakoutMin;
      }
      if (config.breakoutScale !== undefined) {
        this.editValues.breakout_scale = config.breakoutScale;
      }
      this.updateBreakoutLive();

      // Apply breakpoint values
      if (config.breakpoints) {
        if (config.breakpoints.lg !== undefined) {
          this.editValues.breakpoint_lg = config.breakpoints.lg;
        }
        if (config.breakpoints.xl !== undefined) {
          this.editValues.breakpoint_xl = config.breakpoints.xl;
        }
      }

      // Update column widths display
      this.updateColumnWidths();

      // Close modal on success
      this.closeRestoreModal();
      this.configCopied = false;

    } catch (e) {
      this.restoreError = e.message;
    }
  },
};
