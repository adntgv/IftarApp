import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import useAuthStore from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { initialEvents, initialInvites } from '@/utils/mockData';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, account, checkSession, isLoading, error } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const eventsCount = initialEvents.length;
  const invitesCount = initialInvites.length;

  // Check auth status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await checkSession();
        if (!result) {
          // No valid session found, redirect to auth
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, []);

  // Refresh user data with timeout
  const refreshUserData = async () => {
    if (refreshing) return;
    
    try {
      console.log('Refreshing user data...');
      setRefreshing(true);
      setSessionError(null);
      
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timed out')), 15000)
      );
      
      const result = await Promise.race([
        checkSession(),
        timeoutPromise
      ]);
      
      if (!result) {
        // Session is no longer valid
        router.replace('/(auth)/login');
      }
      
      console.log('Session check completed');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setSessionError(error instanceof Error ? error.message : 'Unknown error');
      // Redirect to login if session is invalid
      router.replace('/(auth)/login');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout fails
      router.replace('/(auth)/login');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Profile" action={null} actionLabel="" />
        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Header title="Profile" action={null} actionLabel="" />
      <View style={styles.content}>
        <ProfileView 
          onSignOut={handleSignOut}
          userData={user}
          accountData={account}
          refreshing={refreshing}
          onRefresh={refreshUserData}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
}); 