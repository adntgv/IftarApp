import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import Header from '@/components/Header';
import EventList from '@/components/EventList';
import EventDetails from '@/components/EventDetails';
import LoginModal from '@/components/LoginModal';
import useEventsStore from '@/hooks/useEvents';
import useAuthStore from '@/hooks/useAuth';
import { Event, Invitation } from '@/types/event';
import { EventLike } from '@/types/event';

export default function InvitesScreen() {
  const router = useRouter();
  const { 
    invitations, 
    viewMode, 
    animation, 
    isLoading,
    fetchUserInvitations,
    toggleViewMode,
    setAnimation,
    respondToInvitation
  } = useEventsStore();
  
  const { isLoggedIn, login } = useAuthStore();

  const [selectedEvent, setSelectedEvent] = useState<Invitation | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch user invitations on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserInvitations();
    }
  }, [isLoggedIn]);

  // Refresh invitations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        fetchUserInvitations();
      }
    }, [isLoggedIn])
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    if (!isLoggedIn) return;
    
    setRefreshing(true);
    try {
      await fetchUserInvitations();
    } catch (error) {
      console.error('Error refreshing invitations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle view mode between card and list
  const handleToggleViewMode = () => {
    toggleViewMode();
  };

  // Open event details
  const handleOpenEvent = (event: EventLike) => {
    setSelectedEvent(event as Invitation);
    setAnimation('open');
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Respond to invitation
  const handleRespond = async (id: string, status: string) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    
    if (!selectedEvent) return;
    
    try {
      await respondToInvitation(selectedEvent, status);
    } catch (error) {
      console.error('Error responding to invitation:', error);
    }
  };

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setShowLogin(false);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Your Invitations" 
        action={handleToggleViewMode}
        actionLabel={viewMode === 'card' ? 'List View' : 'Card View'}
      />
      
      <View style={styles.content}>
        <EventList 
          events={invitations} 
          isInvites={true}
          viewMode={viewMode} 
          onOpenEvent={handleOpenEvent}
          onRespond={handleRespond}
          animation={animation}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>

      {/* Modals */}
      <EventDetails 
        event={selectedEvent} 
        isVisible={selectedEvent !== null} 
        onClose={handleCloseEvent}
        onRespond={handleRespond}
        onShare={() => {}}
        onInvite={() => {}}
      />
      
      <LoginModal 
        isVisible={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin}
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