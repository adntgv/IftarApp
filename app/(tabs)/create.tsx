import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import Header from '@/components/Header';
import CreateEventForm from '@/components/CreateEventForm';
import { generateShareCode } from '@/utils/mockData';

export default function CreateScreen() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isPublic: true
  });

  // Create new event
  const handleCreateEvent = () => {
    const shareCode = generateShareCode(newEvent.title);
    const event = {
      id: Date.now(), // Use timestamp as temporary ID
      ...newEvent,
      host: "You",
      shareCode,
      attendees: []
    };

    // In a real app, we would save this to a database or state management store
    console.log('Event created:', event);
    
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