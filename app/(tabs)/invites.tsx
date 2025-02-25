import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '@/components/Header';
import EventList from '@/components/EventList';
import EventDetails from '@/components/EventDetails';
import LoginModal from '@/components/LoginModal';
import { initialInvites } from '@/utils/mockData';
import { Invite } from '@/types/event';
import { EventLike } from '@/types/event';

export default function InvitesScreen() {
  const router = useRouter();
  const [invites, setInvites] = useState<Invite[]>(initialInvites);
  const [viewMode, setViewMode] = useState('card');
  const [selectedEvent, setSelectedEvent] = useState<Invite | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [animation, setAnimation] = useState('');
  
  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  // Toggle view mode between card and list
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
    setAnimation('toggle');
  };

  // Open event details
  const handleOpenEvent = (event: EventLike) => {
    setSelectedEvent(event as Invite);
    setAnimation('open');
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Respond to invitation
  const handleRespond = (id: number, status: string) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    
    const updatedInvites = invites.map(invite => 
      invite.id === id ? { ...invite, status } : invite
    );
    setInvites(updatedInvites);
    setAnimation('respond');
  };

  // Handle login
  const handleLogin = () => {
    // In a real app, validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Your Invitations" 
        action={() => toggleViewMode()}
        actionLabel={viewMode === 'card' ? 'List View' : 'Card View'}
      />
      
      <View style={styles.content}>
        <EventList 
          events={invites} 
          isInvites={true}
          viewMode={viewMode} 
          onOpenEvent={handleOpenEvent}
          onRespond={handleRespond}
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