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

  // Only run once when component mounts with empty dependency array
  useEffect(() => {
    console.log('ProfileScreen mounted, fetching user data...');
    // Initial data load without setting state
    const initialLoad = async () => {
      try {
        await checkSession();
      } catch (error) {
        console.error('Initial data load failed:', error);
      }
    };
    initialLoad();
    // Empty dependency array ensures this only runs once
  }, []);

  // Reduce logging frequency to prevent unnecessary rerenders
  // Only log significant changes, not on every render
  useEffect(() => {
    if (error) {
      console.log('Auth error detected:', error);
    }
  }, [error]);

  // Refresh user data with timeout
  const refreshUserData = async () => {
    // Only proceed if not already refreshing
    if (refreshing) return;
    
    try {
      console.log('Refreshing user data...');
      setRefreshing(true);
      setSessionError(null);
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timed out')), 15000)
      );
      
      // Race between the actual session check and the timeout
      const result = await Promise.race([
        checkSession(),
        timeoutPromise
      ]);
      
      console.log('Session check completed');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setSessionError(error instanceof Error ? error.message : 'Unknown error');
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
    }
  };

  // Remove excessive logging to reduce render cycles
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Header 
        title="Profile"
        action={null}
        actionLabel=""
      />
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
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
}); 