import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Button } from '@/components/ui';
import CreateEventForm from '@/components/CreateEventForm';
import useEventsStore from '@/hooks/useEvents';
import { createEvent } from '@/utils/eventService';
import useAuthStore from '@/hooks/useAuth';

// Define User type inline
interface User {
  userId: string;
  name: string;
  email: string;
  [key: string]: any;
}

export default function CreateScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { fetchUserEvents } = useEventsStore();
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isPublic: true
  });

  // Create new event
  const handleCreateEvent = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an event');
      router.navigate('/(auth)/login');
      return;
    }

    try {
      setLoading(true);
      
      // Use the actual createEvent function from eventService
      const event = await createEvent(
        newEvent,
        (user as User).userId,
        (user as User).name
      );
      
      console.log('Event created successfully:', event);
      
      // Reset form
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        isPublic: true
      });
      
      // Fetch updated events to refresh the list
      await fetchUserEvents();
      
      // Navigate to event details page
      router.navigate(`/event/${event.$id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Create Event" action={null} actionLabel="" />
        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Create Event" action={null} actionLabel="" />
        <View style={styles.content}>
          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptTitle}>Sign in to create events</Text>
            <Text style={styles.loginPromptText}>
              Create and manage your own Iftar events by signing in to your account.
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
      <Header title="Create Event" action={null} actionLabel="" />
      <CreateEventForm
        newEvent={newEvent}
        onChangeEvent={setNewEvent}
        onSubmit={handleCreateEvent}
        onCancel={() => router.navigate('/(tabs)')}
        loading={loading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
}); 