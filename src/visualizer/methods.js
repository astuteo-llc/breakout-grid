export const methods = {
  init() {
    const saved = localStorage.getItem('breakoutGridVisualizerVisible');
    if (saved !== null) {
      this.isVisible = saved === 'true';
    }

    const editorOpen = localStorage.getItem('breakoutGridEditorOpen');
    if (editorOpen === 'true') {
      this.showEditor = true;
      this.editMode = true;
      this.$nextTick(() => this.loadCurrentValues());
    }

    const savedConfig = localStorage.getItem('breakoutGridConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.hasConfigOverride = true;
        this.$nextTick(() => this.applyConfig(config));
      } catch (e) {}
    }

    const editorPos = localStorage.getItem('breakoutGridEditorPos');
    if (editorPos) {
      try {
        this.editorPos = JSON.parse(editorPos);
      } catch (e) {}
    }

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

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        this.toggle();
      }
    });

    window.addEventListener('resize', () => {
      this.viewportWidth = window.innerWidth;
      this.updateColumnWidths();
      this.updateCurrentBreakpoint();
      if (this.editMode) {
        this.updateGapLive();
      }
    });

    this.updateCurrentBreakpoint();
    console.log('Breakout Grid Visualizer loaded. Press Ctrl/Cmd + G to toggle.');
  },

  toggle() {
    this.isVisible = !this.isVisible;
    localStorage.setItem('breakoutGridVisualizerVisible', this.isVisible);
  },

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

  updateGapLive() {
    const scaleKey = this.currentBreakpoint === 'mobile' ? 'default' : this.currentBreakpoint;
    const base = this.editValues.baseGap || this.configOptions.baseGap.value;
    const max = this.editValues.maxGap || this.configOptions.maxGap.value;
    const scale = this.editValues[`gapScale_${scaleKey}`] || this.gapScaleOptions[scaleKey].value;

    document.documentElement.style.setProperty('--gap', `clamp(${base}, ${scale}, ${max})`);
    this.updateColumnWidths();
  },

  getContentReadabilityWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value);
    if (contentMax > 55) {
      return `Content max (${contentMax}rem) exceeds 55rem—may be wide for reading. Ideal for prose: 45–55rem.`;
    }
    return null;
  },

  getTrackOverflowWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value) * 16;
    const featureMax = parseFloat(this.editValues.featureMax || this.configOptions.featureMax.value) * 16;
    const popoutWidth = parseFloat(this.editValues.popoutWidth || this.configOptions.popoutWidth.value) * 16;

    const featurePx = featureMax * 2;
    const popoutPx = popoutWidth * 2;
    const totalFixed = contentMax + featurePx + popoutPx;

    if (totalFixed > this.viewportWidth) {
      return `Tracks exceed viewport by ~${Math.round(totalFixed - this.viewportWidth)}px — outer columns will compress`;
    }
    return null;
  },

  getCSSVariable(varName) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || 'Not set';
  },

  loadOptionsFromCSS(options, prefix = '') {
    Object.keys(options).forEach(key => {
      const opt = options[key];
      const editKey = prefix ? `${prefix}_${key}` : key;
      // Check liveVar first (what users typically set), then cssVar, then default
      let computed = null;
      if (opt.liveVar) {
        computed = this.getCSSVariable(opt.liveVar);
      }
      if ((!computed || computed === 'Not set' || computed === '') && opt.cssVar) {
        computed = this.getCSSVariable(opt.cssVar);
      }
      this.editValues[editKey] = (computed && computed !== 'Not set' && computed !== '') ? computed : opt.value;
    });
  },

  loadCurrentValues() {
    this.loadOptionsFromCSS(this.configOptions);
    this.loadOptionsFromCSS(this.gapScaleOptions, 'gapScale');
    this.loadOptionsFromCSS(this.breakoutOptions, 'breakout');
  },

  generateConfigExport() {
    const config = {};
    Object.keys(this.configOptions).forEach(key => {
      config[key] = this.editValues[key] || this.configOptions[key].value;
    });
    config.gapScale = {};
    Object.keys(this.gapScaleOptions).forEach(key => {
      config.gapScale[key] = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
    });
    config.breakoutMin = this.editValues.breakout_min || this.breakoutOptions.min.value;
    config.breakoutScale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    config.breakpoints = {
      lg: this.editValues.breakpoint_lg || this.breakpointOptions?.lg?.value || '1024',
      xl: this.editValues.breakpoint_xl || this.breakpointOptions?.xl?.value || '1280',
    };
    return config;
  },

  configSections: {
    content: { keys: ['contentMin', 'contentBase', 'contentMax'], label: 'Content' },
    defaultCol: { keys: ['defaultCol'], label: 'Default Column' },
    tracks: { keys: ['popoutWidth', 'fullLimit'], label: 'Track Widths' },
    feature: { keys: ['featureMin', 'featureScale', 'featureMax'], label: 'Feature' },
    gap: { keys: ['baseGap', 'maxGap'], nested: { gapScale: ['default', 'lg', 'xl'] }, label: 'Gap' },
    breakout: { keys: ['breakoutMin', 'breakoutScale'], label: 'Breakout' }
  },

  copySection(sectionName) {
    const section = this.configSections[sectionName];
    if (!section) return;

    const lines = [];

    section.keys.forEach(key => {
      let value, varName;
      if (this.configOptions[key]) {
        value = this.editValues[key] || this.configOptions[key].value;
        varName = this.configOptions[key].liveVar;
      } else if (key === 'breakoutMin') {
        value = this.editValues.breakout_min || this.breakoutOptions.min.value;
        varName = this.breakoutOptions.min.liveVar;
      } else if (key === 'breakoutScale') {
        value = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
        varName = this.breakoutOptions.scale.liveVar;
      }
      if (varName) {
        lines.push(`${varName}: ${value};`);
      }
    });

    if (section.nested) {
      Object.keys(section.nested).forEach(nestedKey => {
        section.nested[nestedKey].forEach(subKey => {
          const opt = this.gapScaleOptions[subKey];
          const value = this.editValues[`gapScale_${subKey}`] || opt.value;
          lines.push(`${opt.liveVar}: ${value};`);
        });
      });
    }

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      this.sectionCopied = sectionName;
      setTimeout(() => this.sectionCopied = null, 1500);
    });
  },

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

  downloadCSS(format = 'plain') {
    const config = this.generateConfigExport();
    const css = format === 'tailwind'
      ? this.generateTailwindCSSExport(config)
      : this.generateCSSExport(config);
    const filename = format === 'tailwind'
      ? '_objects.breakout-grid.tw.css'
      : '_objects.breakout-grid.css';
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  parseValue(val) {
    const match = String(val).match(/^([\d.]+)(.*)$/);
    if (match) {
      return { num: parseFloat(match[1]), unit: match[2] || 'rem' };
    }
    return { num: 0, unit: 'rem' };
  },

  getNumericValue(key) {
    const val = this.editValues[key] || this.configOptions[key].value;
    return this.parseValue(val).num;
  },

  getUnit(key) {
    const val = this.editValues[key] || this.configOptions[key].value;
    return this.parseValue(val).unit;
  },

  hasUnitSelector(key) {
    const unit = this.getUnit(key);
    return unit === 'rem' || unit === 'ch' || unit === 'px';
  },

  unitOptions: ['rem', 'ch', 'px'],

  updateUnit(key, newUnit) {
    const num = this.getNumericValue(key);
    this.updateConfigValue(key, num + newUnit);
  },

  updateNumericValue(key, num) {
    if (key === 'content' && num < 1) num = 1;
    if (key === 'baseGap' && num < 0) num = 0;
    if (key === 'popoutWidth' && num < 0) num = 0;
    if ((key === 'featureMin' || key === 'featureScale' || key === 'featureMax') && num < 0) num = 0;
    const unit = this.getUnit(key);
    this.updateConfigValue(key, num + unit);
  },

  getPrefixedNumeric(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).num;
  },

  getPrefixedUnit(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).unit;
  },

  getGapScaleNumeric(key) { return this.getPrefixedNumeric('gapScale', this.gapScaleOptions, key); },
  getGapScaleUnit(key) { return this.getPrefixedUnit('gapScale', this.gapScaleOptions, key); },
  updateGapScaleNumeric(key, num) {
    this.editValues[`gapScale_${key}`] = num + this.getGapScaleUnit(key);
    this.configCopied = false;
    this.updateGapLive();
    this.saveConfigToStorage();
  },

  getBreakoutNumeric(key) { return this.getPrefixedNumeric('breakout', this.breakoutOptions, key); },
  getBreakoutUnit(key) { return this.getPrefixedUnit('breakout', this.breakoutOptions, key); },
  updateBreakoutNumeric(key, num) {
    this.editValues[`breakout_${key}`] = num + this.getBreakoutUnit(key);
    this.configCopied = false;
    this.updateBreakoutLive();
    this.saveConfigToStorage();
  },

  updateBreakoutLive() {
    const min = this.editValues.breakout_min || this.breakoutOptions.min.value;
    const scale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    const max = this.editValues.popoutWidth || this.configOptions.popoutWidth.value;
    document.documentElement.style.setProperty('--breakout-padding', `clamp(${min}, ${scale}, ${max})`);
  },

  saveConfigToStorage() {
    const config = this.generateConfigExport();
    localStorage.setItem('breakoutGridConfig', JSON.stringify(config));
    this.hasConfigOverride = true;
  },

  applyConfig(config) {
    this.editMode = true;

    Object.keys(this.configOptions).forEach(key => {
      if (config[key] !== undefined) {
        this.editValues[key] = config[key];
        const opt = this.configOptions[key];
        if (opt && opt.liveVar) {
          document.documentElement.style.setProperty(opt.liveVar, config[key]);
        }
      }
    });

    // Track widths need minmax wrapper for CSS grid
    if (config.popoutWidth) {
      document.documentElement.style.setProperty('--popout', `minmax(0, ${config.popoutWidth})`);
    }
    if (config.featureMin || config.featureScale || config.featureMax) {
      const featureMin = config.featureMin || this.configOptions.featureMin.value;
      const featureScale = config.featureScale || this.configOptions.featureScale.value;
      const featureMax = config.featureMax || this.configOptions.featureMax.value;
      document.documentElement.style.setProperty('--feature', `minmax(0, clamp(${featureMin}, ${featureScale}, ${featureMax}))`);
    }

    if (config.gapScale) {
      Object.keys(this.gapScaleOptions).forEach(key => {
        if (config.gapScale[key] !== undefined) {
          this.editValues[`gapScale_${key}`] = config.gapScale[key];
        }
      });
      this.updateGapLive();
    }

    if (config.breakoutMin !== undefined) {
      this.editValues.breakout_min = config.breakoutMin;
    }
    if (config.breakoutScale !== undefined) {
      this.editValues.breakout_scale = config.breakoutScale;
    }
    this.updateBreakoutLive();

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

  resetConfigToDefaults() {
    if (!confirm('Reset all config values to defaults?')) return;
    localStorage.removeItem('breakoutGridConfig');
    this.restoreCSSVariables();
    this.loadCurrentValues();
    this.configCopied = false;
    this.hasConfigOverride = false;
  },

  updateConfigValue(key, value) {
    this.editValues[key] = value;
    this.configCopied = false;
    this.saveConfigToStorage();
    const opt = this.configOptions[key];
    if (opt && opt.liveVar) {
      document.documentElement.style.setProperty(opt.liveVar, value);
    }
    // Track widths need minmax wrapper for CSS grid
    if (key === 'popoutWidth') {
      document.documentElement.style.setProperty('--popout', `minmax(0, ${value})`);
      this.updateBreakoutLive();
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
    if (key === 'baseGap' || key === 'maxGap') {
      this.updateGapLive();
    }
  },

  selectArea(areaName) {
    this.selectedArea = this.selectedArea === areaName ? null : areaName;
  },

  isSelected(areaName) {
    return this.selectedArea === areaName;
  },

  restoreCSSVariables() {
    Object.keys(this.configOptions).forEach(key => {
      const opt = this.configOptions[key];
      if (opt.liveVar) {
        document.documentElement.style.removeProperty(opt.liveVar);
      }
    });
    document.documentElement.style.removeProperty('--popout');
    document.documentElement.style.removeProperty('--feature');
    document.documentElement.style.removeProperty('--content');
    document.documentElement.style.removeProperty('--breakout-padding');
    document.documentElement.style.removeProperty('--popout-to-content');
    this.editValues = {};
    this.configCopied = false;
  },

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.loadCurrentValues();
    } else {
      this.restoreCSSVariables();
    }
  },

  hasUnsavedEdits() {
    return Object.keys(this.editValues).length > 0 && !this.configCopied;
  },

  openEditor() {
    this.showEditor = true;
    this.editMode = true;
    this.loadCurrentValues();
    localStorage.setItem('breakoutGridEditorOpen', 'true');
  },

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

  startDrag(e) { this.startPanelDrag(e, 'editor'); },
  onDrag(e) { this.onPanelDrag(e, 'editor'); },
  stopDrag() { this.stopPanelDrag('editor'); },

  startDragSpacing(e) { this.startPanelDrag(e, 'spacing'); },
  onDragSpacing(e) { this.onPanelDrag(e, 'spacing'); },
  stopDragSpacing() { this.stopPanelDrag('spacing'); },

  startColumnResize(e, columnType) {
    if (!this.editMode) return;
    e.preventDefault();
    e.stopPropagation();
    this.resizingColumn = columnType;
    this.resizeStartX = e.clientX;
    const currentVal = this.editValues[columnType] || this.configOptions[columnType].value;
    this.resizeStartValue = this.parseValue(currentVal).num;
  },

  onColumnResize(e) {
    if (!this.resizingColumn) return;
    const deltaX = e.clientX - this.resizeStartX;
    const col = this.resizingColumn;
    const unit = this.getUnit(col);

    let pxPerUnit;
    if (unit === 'vw') {
      pxPerUnit = window.innerWidth / 100;
    } else if (unit === 'rem') {
      pxPerUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else {
      pxPerUnit = 1;
    }

    // Right-edge handles: drag right = increase; left-edge: drag left = increase
    const isRightHandle = col === 'contentMax' || col === 'contentBase';
    const delta = isRightHandle ? (deltaX / pxPerUnit) : (-deltaX / pxPerUnit);
    let newValue = this.resizeStartValue + delta;

    if (newValue < 0) newValue = 0;
    newValue = Math.round(newValue * 10) / 10;

    this.updateConfigValue(col, newValue + unit);
    this.updateColumnWidths();
  },

  stopColumnResize() {
    this.resizingColumn = null;
  },

  getResizeConfig(colName) {
    const map = {
      'full-limit': 'fullLimit',
      'feature': 'featureScale',
      'popout': 'popoutWidth'
    };
    return map[colName] || null;
  },

  parseConfigString(input) {
    const str = input.trim();
    const config = { gapScale: {}, breakpoints: {} };

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
        config.breakpoints[breakpointMap[varName]] = trimmedValue.replace(/px$/, '');
      }
    }

    if (!foundAny) {
      throw new Error('Invalid format. Paste CSS variables from "Copy Variables".');
    }

    return config;
  },

  openRestoreModal() {
    this.showRestoreModal = true;
    this.restoreInput = '';
    this.restoreError = null;
  },

  closeRestoreModal() {
    this.showRestoreModal = false;
    this.restoreInput = '';
    this.restoreError = null;
  },

  hasStoredOverrides() {
    return ['breakoutGridConfig', 'breakoutGridEditorOpen', 'breakoutGridEditorPos', 'breakoutGridSpacingPos', 'breakoutGridSpacingCollapsed']
      .some(key => localStorage.getItem(key) !== null);
  },

  resetAllStorage() {
    ['breakoutGridVisualizerVisible', 'breakoutGridEditorOpen', 'breakoutGridConfig', 'breakoutGridEditorPos', 'breakoutGridSpacingPos', 'breakoutGridSpacingCollapsed']
      .forEach(key => localStorage.removeItem(key));
    this.restoreCSSVariables();
    this.showEditor = false;
    this.editMode = false;
    this.editorPos = { x: 20, y: 100 };
    this.spacingPanelPos = { x: 16, y: 16 };
    this.spacingPanelCollapsed = false;
    this.hasConfigOverride = false;
    this.configCopied = false;
  },

  restoreConfig() {
    this.restoreError = null;

    try {
      const config = this.parseConfigString(this.restoreInput);

      Object.keys(this.configOptions).forEach(key => {
        if (config[key] !== undefined) {
          this.editValues[key] = config[key];
          this.updateConfigValue(key, config[key]);
        }
      });

      if (config.gapScale) {
        Object.keys(this.gapScaleOptions).forEach(key => {
          if (config.gapScale[key] !== undefined) {
            this.editValues[`gapScale_${key}`] = config.gapScale[key];
          }
        });
        this.updateGapLive();
      }

      if (config.breakoutMin !== undefined) {
        this.editValues.breakout_min = config.breakoutMin;
      }
      if (config.breakoutScale !== undefined) {
        this.editValues.breakout_scale = config.breakoutScale;
      }
      this.updateBreakoutLive();

      if (config.breakpoints) {
        if (config.breakpoints.lg !== undefined) {
          this.editValues.breakpoint_lg = config.breakpoints.lg;
        }
        if (config.breakpoints.xl !== undefined) {
          this.editValues.breakpoint_xl = config.breakpoints.xl;
        }
      }

      this.updateColumnWidths();
      this.closeRestoreModal();
      this.configCopied = false;

    } catch (e) {
      this.restoreError = e.message;
    }
  },
};
