import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import Typography from '../constants/Typography';
import Spacing from '../constants/Spacing';
import Animations from '../constants/Animations';

// Create theme context
const ThemeContext = createContext();

/**
 * Custom hook to use the theme throughout the app
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider component
 * Provides theme values to all child components
 */
export const ThemeProvider = ({ children }) => {
  // Get system color scheme
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState({
    colorScheme: colorScheme || 'light',
    colors: Colors[colorScheme || 'light'],
    typography: Typography,
    spacing: Spacing,
    animations: Animations,
  });
  
  // Update theme when system color scheme changes
  useEffect(() => {
    setTheme(prevTheme => ({
      ...prevTheme,
      colorScheme: colorScheme || 'light',
      colors: Colors[colorScheme || 'light'],
    }));
  }, [colorScheme]);
  
  // Toggle dark/light mode manually
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newColorScheme = prevTheme.colorScheme === 'dark' ? 'light' : 'dark';
      return {
        ...prevTheme,
        colorScheme: newColorScheme,
        colors: Colors[newColorScheme],
      };
    });
  };
  
  // Global styles based on the current theme
  const globalStyles = {
    // Common styles
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.spacing.borderRadius.md,
      padding: theme.spacing.spacing.md,
      marginBottom: theme.spacing.spacing.md,
      ...theme.spacing.elevation.sm,
    },
    text: {
      ...theme.typography.textStyles.body1,
      color: theme.colors.text,
    },
    heading: {
      ...theme.typography.textStyles.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.spacing.sm,
    },
    subheading: {
      ...theme.typography.textStyles.subtitle1,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: theme.spacing.spacing.md,
    },
    // Icons
    icon: {
      color: theme.colors.icon,
    },
    iconSelected: {
      color: theme.colors.iconSelected,
    },
    // Buttons
    button: {
      primary: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.spacing.sm,
        borderRadius: theme.spacing.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        padding: theme.spacing.spacing.sm,
        borderRadius: theme.spacing.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: theme.colors.primary,
        ...theme.typography.textStyles.button,
      },
    },
  };
  
  const value = {
    theme,
    toggleTheme,
    globalStyles,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 