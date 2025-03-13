import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
  
  // Fetch all user data on mount
  const fetchAllUserData = async () => {
    const authState = useAuthStore.getState();
    console.log(`Fetching data with auth state: isLoggedIn=${authState.isLoggedIn}, isAuthenticated=${authState.isAuthenticated}`);
    
    if (!authState.isLoggedIn) {
      console.log('Not fetching data - user not logged in');
      return;
    }
    
    try {
      await Promise.all([
        fetchUserEvents(),
        fetchUserInvitations(),
        useEventsStore.getState().fetchPublicEvents(),
        useEventsStore.getState().fetchAttendingEvents()
      ]);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user events on mount
  useEffect(() => {
    const authState = useAuthStore.getState();
    if (authState.isLoggedIn) {
      fetchAllUserData();
    }
  }, []);

  // Refresh events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const authState = useAuthStore.getState();
      if (authState.isLoggedIn) {
        fetchAllUserData();
      }
    }, [])
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    const authState = useAuthStore.getState();
    if (!authState.isLoggedIn) return;
    
    setRefreshing(true);
    try {
      await fetchAllUserData();
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Open event details
  const handleOpenEvent = (event: EventLike) => {
    // Instead of opening the event in the current view, redirect to the event detail page
    router.push(`/event/${event.$id}`);
    
    // Keep the existing functionality commented in case you want to revert back
    // setSelectedEvent(event as Event);
    // setAnimation('open');
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Open share modal
  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  // Close share modal
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  // Generate share link for an event
  const getShareLink = (event: Event | null) => {
    if (!event) return '';
    
    // Get the base URL from environment variables or use the current domain
    const appUrl = process.env.EXPO_PUBLIC_APP_URL || 
      (typeof window !== 'undefined' ? 
        `${window.location.protocol}//${window.location.host}` : 
        'https://iftar-app.example.com');
    
    return `${appUrl}/event/${event.shareCode}`;
  };

  // View public event
  const handleViewPublicEvent = (event: EventLike) => {
    setPublicViewEvent(event as Event);
    setShowPublicView(true);
    handleCloseShareModal();
    setSelectedEvent(null);
  };

  // Handle inviting a user to an event
  const handleInvite = async (eventId: string, email: string) => {
    try {
      await inviteToEvent(eventId, email);
      return true;
    } catch (error) {
      console.error('Error inviting user:', error);
      return false;
    }
  };

  // Handle responding to an event
  const handleRespond = async (id: string, status: string) => {
    try {
      if (!selectedEvent) {
        // This is a direct response from the EventCard, not an invitation
        // Show some loading indication
        setRefreshing(true);
        
        await useEventsStore.getState().updateAttendanceStatus(id, status);
        
        // Hide loading indication
        setRefreshing(false);
      } else {
        // This is a response to an invitation
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

  // Combine all events for display
  const getAllEvents = () => {
    // Use the getAllEvents function from the hook
    return useEventsStore.getState().getAllEvents();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Your Iftar Events" 
        action={toggleViewMode}
        actionLabel={viewMode === 'card' ? 'List View' : 'Card View'}
      />
      
      <View style={styles.content}>
        <EventList 
          events={getAllEvents()} 
          viewMode={viewMode} 
          onOpenEvent={handleOpenEvent}
          onRespond={handleRespond}
          animation={animation}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>

      {/* Modals */}
      <EventDetails 
        event={selectedEvent} 
        isVisible={selectedEvent !== null} 
        onClose={handleCloseEvent}
        onRespond={handleRespond}
        onShare={handleOpenShareModal}
        onInvite={(email) => selectedEvent && handleInvite(selectedEvent.$id, email)}
      />
      
      <ShareModal 
        event={selectedEvent} 
        isOpen={showShareModal}
        isVisible={showShareModal} 
        onClose={handleCloseShareModal}
        shareLink={getShareLink(selectedEvent)}
        onPreviewPublic={handleViewPublicEvent}
      />
      
      <PublicEventView 
        event={publicViewEvent} 
        isOpen={showPublicView}
        isVisible={showPublicView}
        onClose={() => setShowPublicView(false)} 
        isLoggedIn={isLoggedIn}
        onLogin={() => router.push('/login')}
        onRespond={handleRespond}
      />
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
