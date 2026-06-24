/**
 * Design system for the portfolio — dark-first, neon-gradient aesthetic.
 *
 * The app is designed for dark mode first (where the gradients and glows
 * shine), with a carefully tuned light theme as a fallback. Every component
 * reads from these tokens so the look stays consistent and tunable.
 */

export interface Theme {
  isDark: boolean;

  // Surfaces
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceAlt: string;
  glass: string;
  glassBorder: string;
  border: string;

  // Text
  text: string;
  textMuted: string;
  textSubtle: string;

  // Brand
  primary: string;
  primaryLight: string;
  primarySoft: string;
  accent: string;

  // Status
  success: string;

  // Gradients (trios for LinearGradient)
  heroGradient: string[];
  brandGradient: string[];
  glowColor: string;
}

const palette = {
  // Neon brand spectrum
  violet: '#8B5CF6',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  cyan: '#22D3EE',
  emerald: '#10B981',
};

const darkTheme: Theme = {
  isDark: true,

  background: '#070711',
  backgroundElevated: '#0D0D1C',
  surface: 'rgba(22, 22, 42, 0.72)',
  surfaceAlt: 'rgba(40, 40, 70, 0.55)',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  border: 'rgba(255, 255, 255, 0.08)',

  text: '#F4F4FB',
  textMuted: '#A9AAC9',
  textSubtle: '#6E6F92',

  primary: palette.indigoLight,
  primaryLight: '#A5B4FC',
  primarySoft: 'rgba(129, 140, 248, 0.15)',
  accent: palette.cyan,

  success: palette.emerald,

  heroGradient: ['#1E1B4B', '#3B0764', '#070711'],
  brandGradient: ['#818CF8', '#C084FC', '#22D3EE'],
  glowColor: 'rgba(139, 92, 246, 0.45)',
};

const lightTheme: Theme = {
  isDark: false,

  background: '#F7F7FC',
  backgroundElevated: '#FFFFFF',
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceAlt: 'rgba(243, 243, 250, 0.9)',
  glass: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(15, 23, 42, 0.08)',
  border: 'rgba(15, 23, 42, 0.10)',

  text: '#0E0B1E',
  textMuted: '#4B4B66',
  textSubtle: '#8A8AA3',

  primary: palette.indigo,
  primaryLight: palette.violet,
  primarySoft: 'rgba(99, 102, 241, 0.10)',
  accent: '#0891B2',

  success: '#059669',

  heroGradient: ['#EEF2FF', '#FAE8FF', '#F7F7FC'],
  brandGradient: ['#6366F1', '#A855F7', '#0891B2'],
  glowColor: 'rgba(139, 92, 246, 0.22)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
} as const;

export const radius = {
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 21,
  xxl: 26,
  xxxl: 34,
  display: 46,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const shadow = {
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
};

/** Colored glow used to make brand elements pop on dark backgrounds. */
export const glow = (color: string) => ({
  shadowColor: color,
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 0.9,
  shadowRadius: 22,
  elevation: 10,
});

export const getTheme = (isDark: boolean): Theme =>
  isDark ? darkTheme : lightTheme;
