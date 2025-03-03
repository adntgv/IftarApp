import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import useEventsStore from '@/hooks/useEvents';
import useAuthStore from '@/hooks/useAuth';
import { EventLike } from '@/types/event';

export default function CalendarScreen() {
  const router = useRouter();
  const { events, invitations, fetchUserEvents, fetchUserInvitations, isLoading } = useEventsStore();
  const { isLoggedIn } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  
  // Combine events and invites for the calendar
  const allEvents: EventLike[] = [...events, ...invitations];
  
  // Fetch events and invitations on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);
  
  // Refresh events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        fetchEvents();
      }
    }, [isLoggedIn])
  );
  
  // Fetch both events and invitations
  const fetchEvents = async () => {
    try {
      await Promise.all([
        fetchUserEvents(),
        fetchUserInvitations()
      ]);
    } catch (error) {
      console.error('Error fetching events for calendar:', error);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = async () => {
    if (!isLoggedIn) return;
    
    setRefreshing(true);
    try {
      await fetchEvents();
    } catch (error) {
      console.error('Error refreshing calendar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Calendar"
        action={null}
        actionLabel="" 
      />
      
      <View style={styles.content}>
        <CalendarView 
          events={allEvents} 
          refreshing={refreshing}
          onRefresh={handleRefresh}
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