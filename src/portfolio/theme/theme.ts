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
  borderLight: string;

  // Text
  text: string;
  textMuted: string;
  textSubtle: string;

  // Brand
  primary: string;
  primaryLight: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  accent: string;

  // Status
  success: string;
  warning: string;
  error: string;

  // Gradients (pairs / trios for LinearGradient)
  heroGradient: string[];
  brandGradient: string[];
  accentGradient: string[];
  glowColor: string;
}

const palette = {
  // Neon brand spectrum
  violet: '#8B5CF6',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  blue: '#3B82F6',
  cyan: '#22D3EE',
  fuchsia: '#D946EF',
  pink: '#EC4899',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
};

export const darkTheme: Theme = {
  isDark: true,

  background: '#070711',
  backgroundElevated: '#0D0D1C',
  surface: 'rgba(22, 22, 42, 0.72)',
  surfaceAlt: 'rgba(40, 40, 70, 0.55)',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',

  text: '#F4F4FB',
  textMuted: '#A9AAC9',
  textSubtle: '#6E6F92',

  primary: palette.indigoLight,
  primaryLight: '#A5B4FC',
  primarySoft: 'rgba(129, 140, 248, 0.15)',
  onPrimary: '#0A0A18',
  secondary: palette.fuchsia,
  accent: palette.cyan,

  success: palette.emerald,
  warning: palette.amber,
  error: palette.rose,

  heroGradient: ['#1E1B4B', '#3B0764', '#070711'],
  brandGradient: ['#818CF8', '#C084FC', '#22D3EE'],
  accentGradient: ['#D946EF', '#8B5CF6'],
  glowColor: 'rgba(139, 92, 246, 0.45)',
};

export const lightTheme: Theme = {
  isDark: false,

  background: '#F7F7FC',
  backgroundElevated: '#FFFFFF',
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceAlt: 'rgba(243, 243, 250, 0.9)',
  glass: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(15, 23, 42, 0.08)',
  border: 'rgba(15, 23, 42, 0.10)',
  borderLight: 'rgba(15, 23, 42, 0.05)',

  text: '#0E0B1E',
  textMuted: '#4B4B66',
  textSubtle: '#8A8AA3',

  primary: palette.indigo,
  primaryLight: palette.violet,
  primarySoft: 'rgba(99, 102, 241, 0.10)',
  onPrimary: '#FFFFFF',
  secondary: palette.fuchsia,
  accent: '#0891B2',

  success: '#059669',
  warning: '#D97706',
  error: '#E11D48',

  heroGradient: ['#EEF2FF', '#FAE8FF', '#F7F7FC'],
  brandGradient: ['#6366F1', '#A855F7', '#0891B2'],
  accentGradient: ['#D946EF', '#8B5CF6'],
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
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
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
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 12,
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
