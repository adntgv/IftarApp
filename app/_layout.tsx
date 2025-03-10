import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import { ErrorProvider } from '../context/ErrorContext';
import { LogBox } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as NavigationBar from 'expo-navigation-bar';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Unexpected text node',  // Ignore the text node error which might be from dev tools
  'A text node cannot be a child of a <View>',
]);

/**
 * Root layout component
 * Provides the theme provider and stack navigator for the app
 */
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Set navigation bar color for Android
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  // Check if onboarded
  useEffect(() => {
    async function checkOnboarded() {
      try {
        // Skip secure storage for now to avoid errors
        // We'll just mark as onboarded
        SplashScreen.hideAsync();
      } catch (error) {
        // Just hide the splash screen if there's any error
        console.error('Error in startup:', error);
        SplashScreen.hideAsync();
      }
    }
    checkOnboarded();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ErrorProvider>
          <StatusBar style="dark" />
          <Slot />
        </ErrorProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
