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
  50: '#e8f4ff',
  100: '#d1e9ff',
  200: '#a3d3ff',
  300: '#75bcff',
  400: '#47a6ff',
  500: '#1a90ff', // Primary color
  600: '#0066cc',
  700: '#004d99',
  800: '#003366',
  900: '#001a33',
};

// Accent colors for highlights and call-to-actions
const accent = {
  50: '#fff5e6',
  100: '#ffe0b3',
  200: '#ffcc80',
  300: '#ffb84d',
  400: '#ffa31a',
  500: '#ff8c00', // Accent color
  600: '#cc7000',
  700: '#995400',
  800: '#663800',
  900: '#331c00',
};

// Semantic colors for status indications
const semantic = {
  success: '#2ecc71',
  warning: '#f1c40f',
  error: '#e74c3c',
  info: '#3498db',
};

// Grayscale for text, backgrounds, borders
const gray = {
  50: '#ffffff',
  100: '#f8f9fa',
  200: '#e9ecef',
  300: '#dee2e6',
  400: '#ced4da',
  500: '#adb5bd',
  600: '#6c757d',
  700: '#495057',
  800: '#343a40',
  900: '#212529',
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
    icon: gray[600],
    iconSelected: primary[500],
    tint: primary[500],
    tabIconDefault: gray[600],
    tabIconSelected: primary[500],
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    cardShadow: 'rgba(0, 0, 0, 0.1)',
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
