import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import useAuthStore from '@/hooks/useAuth';
import useEventsStore from '@/hooks/useEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Button } from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, account, checkSession, isLoading, error, isAuthenticated } = useAuthStore();
  const { events, invitations, fetchUserEvents, fetchUserInvitations } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const eventsCount = events.length;
  const invitesCount = invitations.length;

  // Fetch events when screen comes into focus and user is authenticated
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
    if (refreshing || !isAuthenticated) return;
    
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
      
      await Promise.all(refreshPromises);
      console.log('Profile refresh completed');
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

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Profile" action={null} actionLabel="" />
        <View style={styles.content}>
          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptTitle}>Sign in to view your profile</Text>
            <Text style={styles.loginPromptText}>
              Create and manage your events, track your invitations, and more.
            </Text>
            <Button
              title="Sign In"
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginButton}
              icon={null}
              textStyle={{}}
              variant="primary"
              fullWidth
            >
              Sign In
            </Button>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Profile" 
        action={handleSignOut}
        actionLabel="Sign Out"
      />
      <ProfileView
        userData={user}
        accountData={account}
        onSignOut={handleSignOut}
        refreshing={refreshing}
        onRefresh={refreshUserData}
      />
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginPromptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  signupText: {
    color: '#3b82f6',
    fontSize: 16,
  },
}); 