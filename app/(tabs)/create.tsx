import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

import Header from '@/components/Header';
import CreateEventForm from '@/components/CreateEventForm';
import { createEvent } from '@/utils/eventService';
import { useAuth } from '../../context/AuthContext';

// Define user type to fix TypeScript errors
interface User {
  userId: string;
  name: string;
  email: string;
  [key: string]: any; // Allow for other properties
}

export default function CreateScreen() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isPublic: true
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to create events.',
        [
          {
            text: 'Login',
            onPress: () => router.navigate('/(auth)/login')
          },
          {
            text: 'Cancel',
            onPress: () => router.navigate('/(tabs)'),
            style: 'cancel'
          }
        ]
      );
    }
  }, [isAuthenticated]);

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
      
      // Reset form and navigate back to home
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        isPublic: true
      });
      
      // Navigate to home tab
      router.navigate('/(tabs)');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Create Event"
        action={null}
        actionLabel="" 
      />
      
      <View style={styles.content}>
        <CreateEventForm 
          newEvent={newEvent}
          onChangeEvent={setNewEvent}
          onSubmit={handleCreateEvent}
          onCancel={() => router.navigate('/(tabs)')}
          loading={loading}
        />
      </View>
    </View>
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