import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Text } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import useAuthStore from '@/hooks/useAuth';
import useEventsStore from '@/hooks/useEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, account, checkSession, isLoading, error, isAuthenticated } = useAuthStore();
  const { events, invitations, fetchUserEvents, fetchUserInvitations } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const eventsCount = events.length;
  const invitesCount = invitations.length;
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted flag when component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Check auth status when component comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only redirect if explicitly not authenticated AND component is mounted
      if (isAuthenticated === false && isMounted) {
        router.replace('/(auth)/login');
      }
    }, [isAuthenticated, isMounted])
  );
  
  // Fetch events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        fetchEvents();
      }
    }, [isAuthenticated])
  );
  
  // Fetch both events and invitations
  const fetchEvents = async () => {
    try {
      await Promise.all([
        fetchUserEvents(),
        fetchUserInvitations()
      ]);
    } catch (error) {
      console.error('Error fetching events for profile:', error);
    }
  };

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
      
      const sessionCheckPromise = Promise.race([
        checkSession(),
        timeoutPromise
      ]);
      
      // Fetch events data in parallel with session check
      const refreshPromises = [
        sessionCheckPromise,
        fetchEvents()
      ];
      
      const [sessionResult] = await Promise.all(refreshPromises);
      
      if (!sessionResult) {
        // Session is no longer valid
        router.replace('/(auth)/login');
      }
      
      console.log('Profile refresh completed');
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