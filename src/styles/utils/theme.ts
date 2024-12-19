import { tokens } from '../tokens';

type ThemeColor = keyof typeof tokens.colors;
type ColorShade = keyof typeof tokens.colors.primary;

export const getColor = (color: ThemeColor, shade?: ColorShade) => {
  if (shade && tokens.colors[color]?.[shade]) {
    return tokens.colors[color][shade];
  }
  return tokens.colors[color] || tokens.colors.primary[500];
};

export const getSpacing = (size: keyof typeof tokens.spacing) => {
  return tokens.spacing[size] || tokens.spacing.md;
};

export const getFontSize = (size: keyof typeof tokens.typography.fontSizes) => {
  return tokens.typography.fontSizes[size] || tokens.typography.fontSizes.md;
};

export const getRadius = (size: keyof typeof tokens.borderRadius) => {
  return tokens.borderRadius[size] || tokens.borderRadius.md;
};
