/**
 * Portfolio feature — public API.
 *
 * Everything the portfolio needs lives under this folder:
 *   PortfolioScreen.tsx  the screen that ties it all together
 *   components/          ui primitives + page sections
 *   data/                portfolio content (edit this to personalize)
 *   theme/               design tokens (colors, spacing, gradients)
 *   utils/               helpers (haptics, link opener)
 *
 * Import from here, e.g. `import {PortfolioScreen} from './src/portfolio';`
 */

export {PortfolioScreen} from './PortfolioScreen';

// Convenience re-exports for consumers/tests.
export {portfolio} from './data/portfolio';
export {getTheme} from './theme/theme';
export type {Theme} from './theme/theme';
