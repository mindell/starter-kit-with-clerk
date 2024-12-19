import { colors } from './colors';
import { spacing } from './spacing';

export const tokens = {
  colors,
  spacing,
  typography: {
    fontSizes: {
      xs: 'var(--font-size-xs)',    // 12px
      sm: 'var(--font-size-sm)',    // 14px
      md: 'var(--font-size-md)',    // 16px
      lg: 'var(--font-size-lg)',    // 18px
      xl: 'var(--font-size-xl)',    // 20px
      '2xl': 'var(--font-size-2xl)', // 24px
      '3xl': 'var(--font-size-3xl)', // 30px
    },
    fontWeights: {
      regular: 'var(--font-weight-regular)',   // 400
      medium: 'var(--font-weight-medium)',     // 500
      semibold: 'var(--font-weight-semibold)', // 600
      bold: 'var(--font-weight-bold)',         // 700
    },
  },
  borderRadius: {
    sm: 'var(--radius-sm)',    // 4px
    md: 'var(--radius-md)',    // 6px
    lg: 'var(--radius-lg)',    // 8px
    xl: 'var(--radius-xl)',    // 12px
    full: 'var(--radius-full)', // 9999px
  },
} as const;

export type Tokens = typeof tokens;
