/**
 * Light / dark theme tokens for the portfolio.
 * Centralised so every component reads the same palette and spacing scale.
 */

export interface Theme {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceHighlight: string;
  border: string;
  borderLight: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryLight: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  gradientStart: string;
  gradientEnd: string;
}

const palette = {
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  indigoDark: '#4F46E5',
  violet: '#8B5CF6',
  purple: '#A855F7',
  cyan: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
};

export const lightTheme: Theme = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  surfaceHighlight: '#EEF2FF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#475569',
  textSubtle: '#94A3B8',
  primary: palette.indigo,
  primaryLight: palette.indigoLight,
  primarySoft: '#EEF2FF',
  onPrimary: '#FFFFFF',
  secondary: palette.violet,
  secondaryLight: '#DDD6FE',
  accent: palette.cyan,
  success: palette.emerald,
  warning: palette.amber,
  error: palette.rose,
  gradientStart: palette.indigo,
  gradientEnd: palette.violet,
};

export const darkTheme: Theme = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  surfaceHighlight: '#312E81',
  border: '#334155',
  borderLight: '#1E293B',
  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  textSubtle: '#64748B',
  primary: palette.indigoLight,
  primaryLight: '#A5B4FC',
  primarySoft: '#312E81',
  onPrimary: '#0F172A',
  secondary: palette.violet,
  secondaryLight: '#4C1D95',
  accent: palette.cyan,
  success: palette.emerald,
  warning: palette.amber,
  error: palette.rose,
  gradientStart: palette.indigoLight,
  gradientEnd: palette.violet,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const getTheme = (isDark: boolean): Theme =>
  isDark ? darkTheme : lightTheme;
