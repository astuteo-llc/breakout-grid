import { PluginCreator } from 'tailwindcss/types/config';

/**
 * Configuration options for the breakout grid plugin
 */
export interface BreakoutGridConfig {
  /**
   * Minimum gap between columns on mobile
   * @default '1rem'
   */
  baseGap?: string;

  /**
   * Maximum gap between columns on ultra-wide screens
   * @default '15rem'
   */
  maxGap?: string;

  /**
   * Minimum width for content column (~848px)
   * @default '53rem'
   */
  contentMin?: string;

  /**
   * Maximum width for content column (~976px)
   * @default '61rem'
   */
  contentMax?: string;

  /**
   * Preferred width for content column (fluid)
   * @default '75vw'
   */
  contentBase?: string;

  /**
   * How far popout sections extend beyond content
   * @default '5rem'
   */
  popoutWidth?: string;

  /**
   * Minimum feature track width (floor)
   * @default '0rem'
   */
  featureMin?: string;

  /**
   * Fluid feature track scaling
   * @default '12vw'
   */
  featureScale?: string;

  /**
   * Maximum feature track width (ceiling)
   * @default '12rem'
   */
  featureMax?: string;

  /**
   * Default column for elements without a col-* class
   * @default 'content'
   */
  defaultCol?: 'content' | 'popout' | 'feature' | 'full';

  /**
   * Responsive gap scaling configuration
   * Can be a string (applied to all breakpoints) or an object with breakpoint-specific values
   * @default { default: '4vw', lg: '5vw', xl: '6vw' }
   */
  gapScale?: string | {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    [key: string]: string | undefined;
  };

  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;
}

/**
 * Tailwind CSS Breakout Grid Plugin
 *
 * Creates a flexible, fluid CSS Grid layout system that allows content to "break out"
 * of its default container while maintaining optimal readability.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import breakoutGrid from '@astuteo/tailwind-breakout-grid'
 *
 * export default {
 *   plugins: [
 *     breakoutGrid({
 *       baseGap: '1.5rem',
 *       contentMax: '50rem'
 *     })
 *   ]
 * }
 * ```
 *
 * @example
 * ```html
 * <!-- HTML usage -->
 * <div class="grid-cols-breakout">
 *   <p class="col-content">Readable text width</p>
 *   <img class="col-feature" src="wide.jpg" />
 *   <div class="col-full bg-gray-100">Full width section</div>
 * </div>
 * ```
 */
declare const breakoutGrid: {
  (config?: BreakoutGridConfig): {
    handler: PluginCreator;
  };
  __isOptionsFunction: true;
};

export = breakoutGrid;
