import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../components/ThemeProvider';

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
  const colorScheme = useColorScheme();

  // Set navigation bar color for Android
  useEffect(() => {
    if (colorScheme === 'dark') {
      NavigationBar.setBackgroundColorAsync('#141414');
      NavigationBar.setButtonStyleAsync('light');
    } else {
      NavigationBar.setBackgroundColorAsync('#ffffff');
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, [colorScheme]);

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
    <ThemeProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#141414' : '#ffffff',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
