/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Application color system - provides a consistent color palette for the entire app
 * These colors follow accessibility guidelines for proper contrast ratios
 */

// Primary brand colors
const primary = {
  50: '#e6f7ff',
  100: '#bae7ff',
  200: '#91d5ff',
  300: '#69c0ff',
  400: '#40a9ff',
  500: '#1890ff', // Primary color
  600: '#096dd9',
  700: '#0050b3',
  800: '#003a8c',
  900: '#002766',
};

// Accent colors for highlights and call-to-actions
const accent = {
  50: '#fff2e8',
  100: '#ffd8b8',
  200: '#ffbb96',
  300: '#ff9c6e',
  400: '#ff7a45',
  500: '#fa541c', // Accent color
  600: '#d4380d',
  700: '#ad2102',
  800: '#871400',
  900: '#610b00',
};

// Semantic colors for status indications
const semantic = {
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
};

// Grayscale for text, backgrounds, borders
const gray = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e8e8e8',
  300: '#d9d9d9',
  400: '#bfbfbf',
  500: '#8c8c8c',
  600: '#595959',
  700: '#434343',
  800: '#262626',
  900: '#141414',
};

export const Colors = {
  light: {
    text: gray[800],
    textSecondary: gray[600],
    textTertiary: gray[500],
    background: '#ffffff',
    backgroundSecondary: gray[50],
    backgroundTertiary: gray[100],
    primary: primary[500],
    primaryLight: primary[400],
    primaryDark: primary[600],
    accent: accent[500],
    accentLight: accent[400],
    accentDark: accent[600],
    border: gray[200],
    borderLight: gray[100],
    borderDark: gray[300],
    divider: gray[200],
    icon: gray[500],
    iconSelected: primary[500],
    tint: primary[500],
    tabIconDefault: gray[500],
    tabIconSelected: primary[500],
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    cardShadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    text: gray[100],
    textSecondary: gray[300],
    textTertiary: gray[400],
    background: gray[900],
    backgroundSecondary: gray[800],
    backgroundTertiary: gray[700],
    primary: primary[400],
    primaryLight: primary[300],
    primaryDark: primary[500],
    accent: accent[400],
    accentLight: accent[300],
    accentDark: accent[500],
    border: gray[700],
    borderLight: gray[600],
    borderDark: gray[800],
    divider: gray[700],
    icon: gray[400],
    iconSelected: primary[400],
    tint: primary[400],
    tabIconDefault: gray[400],
    tabIconSelected: primary[400],
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    cardShadow: 'rgba(0, 0, 0, 0.2)',
  },
};
