/**
 * Typography system for the application
 * Provides consistent text styles across the app
 */

import { Platform } from 'react-native';

// Font family configuration
const fontFamily = {
  // Use system fonts by default, but can be replaced with custom fonts
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
};

// Font sizes
const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Font weights
const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Line heights (multiplier of font size)
const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing
const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
};

// Pre-defined text styles
const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h5: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // Body text
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Other common text styles
  subtitle1: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  subtitle2: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
};

export const Typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,
};

export default Typography; 