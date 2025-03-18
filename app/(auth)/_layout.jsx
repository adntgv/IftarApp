import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import useAuthStore from '../../hooks/useAuth';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated, checkSession, isLoading } = useAuthStore();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await checkSession();
        if (result) {
          // User is authenticated, redirect to the app
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  // If we're still checking authentication, we can show a splash screen
  if (isLoading) {
    return null; // This will keep the splash screen visible
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen 
          name="forgot-password" 
          options={{
            title: 'Reset Password',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </View>
  );
} 