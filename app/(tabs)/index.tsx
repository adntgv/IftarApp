import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import Header from '@/components/Header';
import EventList from '@/components/EventList';
import EventDetails from '@/components/EventDetails';
import ShareModal from '@/components/ShareModal';
import PublicEventView from '@/components/PublicEventView';
import useEventsStore from '@/hooks/useEvents';
import useAuthStore from '@/hooks/useAuth';
import { Event } from '@/types/event';
import { EventLike } from '@/types/event';
import CalendarView from '@/components/CalendarView';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    events, 
    publicEvents,
    attendingEvents,
    selectedEvent,
    viewMode, 
    animation,
    isLoading,
    fetchUserEvents,
    fetchUserInvitations,
    fetchPublicEvents,
    toggleViewMode,
    setSelectedEvent,
    setAnimation,
    inviteToEvent,
    respondToInvitation
  } = useEventsStore();
  
  const { isLoggedIn } = useAuthStore();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublicView, setShowPublicView] = useState(false);
  const [publicViewEvent, setPublicViewEvent] = useState<Event | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch all user data and public events on mount
  const fetchAllData = async () => {
    try {
      if (isLoggedIn) {
        // Fetch user-specific data if logged in
        await Promise.all([
          fetchUserEvents(),
          fetchUserInvitations(),
          fetchPublicEvents(),
          useEventsStore.getState().fetchAttendingEvents()
        ]);
      } else {
        // Only fetch public events if not logged in
        await fetchPublicEvents();
      }
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchAllData();
  }, [isLoggedIn]);

  // Refresh events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAllData();
    }, [])
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Open event details
  const handleOpenEvent = (event: EventLike) => {
    router.push(`/event/${event.$id}`);
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Handle responding to an event
  const handleRespond = async (id: string, status: string) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to respond to events.',
        [
          {
            text: 'Login',
            onPress: () => router.push('/(auth)/login')
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    try {
      if (!selectedEvent) {
        setRefreshing(true);
        await useEventsStore.getState().updateAttendanceStatus(id, status);
        setRefreshing(false);
      } else {
        await respondToInvitation(
          { $id: id, eventId: selectedEvent.$id },
          status
        );
      }
    } catch (error) {
      console.error('Error responding to event:', error);
      setRefreshing(false);
    }
  };

  // Get all events for display
  const getAllEvents = () => {
    if (!isLoggedIn) {
      // Only show public events when not logged in
      return publicEvents;
    }
    
    // Show all events when logged in
    const allEvents = [...events];
    
    // Add public events that aren't already in the list
    if (publicEvents && publicEvents.length > 0) {
      publicEvents.forEach((pubEvent: EventLike) => {
        if (!allEvents.some(e => e.$id === pubEvent.$id)) {
          allEvents.push(pubEvent);
        }
      });
    }
    
    // Add attending events that aren't already in the list
    if (attendingEvents && attendingEvents.length > 0) {
      attendingEvents.forEach((attEvent: EventLike) => {
        if (!allEvents.some(e => e.$id === attEvent.$id)) {
          allEvents.push(attEvent);
        } else {
          // If the event exists, use the attending version
          const index = allEvents.findIndex(e => e.$id === attEvent.$id);
          if (index !== -1) {
            allEvents[index] = attEvent;
          }
        }
      });
    }
    
    return allEvents;
  };

  return (
    <View style={styles.container}>
      <Header 
        title={isLoggedIn ? "Your Iftar Events" : "Discover Iftar Events"} 
        action={toggleViewMode}
        actionLabel={viewMode === 'list' ? 'Calendar View' : 'List View'}
      />
      
      <View style={styles.content}>
        {viewMode === 'calendar' ? (
          <CalendarView 
            events={getAllEvents()} 
            onOpenEvent={handleOpenEvent}
            onRespond={handleRespond}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          <EventList 
            events={getAllEvents()} 
            viewMode={viewMode} 
            onOpenEvent={handleOpenEvent}
            onRespond={handleRespond}
            animation={animation}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            emptyMessage={isLoggedIn ? "No events to display" : "No public events available"}
            isLoggedIn={isLoggedIn}
          />
        )}
      </View>
    </View>
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
});
