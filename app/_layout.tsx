import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import { ErrorProvider } from '../context/ErrorContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as NavigationBar from 'expo-navigation-bar';

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
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#ffffff',
              },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ErrorProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
