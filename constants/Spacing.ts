/**
 * Spacing system for the application
 * Provides consistent spacing values throughout the app
 */

// Base spacing unit - all spacing values are multiples of this
const BASE_UNIT = 4;

// Spacing scale
const spacing = {
  none: 0,
  xs: BASE_UNIT, // 4
  sm: BASE_UNIT * 2, // 8
  md: BASE_UNIT * 4, // 16
  lg: BASE_UNIT * 6, // 24
  xl: BASE_UNIT * 8, // 32
  '2xl': BASE_UNIT * 12, // 48
  '3xl': BASE_UNIT * 16, // 64
  '4xl': BASE_UNIT * 24, // 96
  '5xl': BASE_UNIT * 32, // 128
};

// Layout related spacing
const layout = {
  screenPadding: spacing.md,
  cardPadding: spacing.md,
  sectionPadding: spacing.lg,
  contentSpacing: spacing.md,
  itemSpacing: spacing.sm,
};

// Element spacing (margin, padding)
const element = {
  buttonPadding: {
    vertical: spacing.sm,
    horizontal: spacing.md,
  },
  inputPadding: {
    vertical: spacing.sm,
    horizontal: spacing.md,
  },
  cardMargin: spacing.sm,
  listItemPadding: {
    vertical: spacing.sm,
    horizontal: spacing.md,
  },
  iconPadding: spacing.xs,
};

// Border radius
const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Elevation (shadow)
const elevation = {
  none: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  xs: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lg: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  }
};

export const Spacing = {
  base: BASE_UNIT,
  spacing,
  layout,
  element,
  borderRadius,
  elevation,
};

export default Spacing; 