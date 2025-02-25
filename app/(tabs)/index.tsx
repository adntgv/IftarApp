import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '@/components/Header';
import EventList from '@/components/EventList';
import EventDetails from '@/components/EventDetails';
import ShareModal from '@/components/ShareModal';
import PublicEventView from '@/components/PublicEventView';
import { initialEvents, generateShareCode } from '@/utils/mockData';
import { Event } from '@/types/event';
import { EventLike } from '@/types/event';

export default function HomeScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [viewMode, setViewMode] = useState('card');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublicView, setShowPublicView] = useState(false);
  const [publicViewEvent, setPublicViewEvent] = useState<Event | null>(null);
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
    setSelectedEvent(event as Event);
    setAnimation('open');
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
    return `https://iftar-app.example.com/event/${event.shareCode}`;
  };

  // View public event
  const handleViewPublicEvent = (event: EventLike) => {
    setPublicViewEvent(event as Event);
    setShowPublicView(true);
    handleCloseShareModal();
    setSelectedEvent(null);
  };

  // Placeholder for respond function (required by EventDetails)
  const handleRespond = (id: number, status: string) => {
    console.log(`Responding to event ${id} with status ${status}`);
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
          events={events} 
          viewMode={viewMode} 
          onOpenEvent={handleOpenEvent}
          onRespond={handleRespond}
          animation={animation}
        />
      </View>

      {/* Modals */}
      <EventDetails 
        event={selectedEvent} 
        isOpen={selectedEvent !== null} 
        onClose={handleCloseEvent} 
        onShare={() => {
          handleOpenShareModal();
        }}
        onInvite={(email: string) => {
          // Handle invite functionality here
          if (selectedEvent) {
            console.log(`Invited ${email} to event ${selectedEvent.id}`);
          }
        }}
        onRespond={handleRespond}
      />
      
      <ShareModal 
        event={selectedEvent} 
        isOpen={showShareModal} 
        onClose={handleCloseShareModal}
        shareLink={getShareLink(selectedEvent)}
        onPreviewPublic={handleViewPublicEvent}
      />
      
      <PublicEventView 
        event={publicViewEvent} 
        isOpen={showPublicView} 
        onClose={() => setShowPublicView(false)} 
        isLoggedIn={true}
        onLogin={() => {}}
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
