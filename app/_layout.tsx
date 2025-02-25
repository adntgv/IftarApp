import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import useAuthStore from '../hooks/useAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Only check session once to prevent infinite loop
      if (!sessionChecked) {
        await checkSession();
        setSessionChecked(true);
        return;
      }
      
      // Use type assertion to avoid type errors
      const inAuthGroup = segments[0] === '(auth)' as any;
      
      if (!isLoading) {
        if (!isAuthenticated && !inAuthGroup) {
          // Redirect to the sign-in page if not authenticated and not already in the auth group
          router.replace('/(auth)/login' as any);
        } else if (isAuthenticated && inAuthGroup) {
          // Redirect to the main app if authenticated and still in the auth group
          router.replace('/(tabs)');
        }
      }
    };
    
    checkAuth();
  }, [isAuthenticated, segments, isLoading, sessionChecked]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Use the protected route hook
  useProtectedRoute();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
