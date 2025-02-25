import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { initialEvents, initialInvites, generateShareCode } from '../utils/mockData';
import * as Clipboard from 'expo-clipboard';
import { Redirect } from 'expo-router';

// Import components
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import EventList from '../components/EventList';
import CreateEventForm from '../components/CreateEventForm';
import EventDetails from '../components/EventDetails';
import ShareModal from '../components/ShareModal';
import LoginModal from '../components/LoginModal';
import PublicEventView from '../components/PublicEventView';
import CalendarView from '../components/CalendarView';
import ProfileView from '../components/ProfileView';

/**
 * Main app component
 */
const IftarApp = () => {
  // State
  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState(initialEvents);
  const [invites, setInvites] = useState(initialInvites);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    isPublic: true
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for demo
  const [showLogin, setShowLogin] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublicView, setShowPublicView] = useState(false);
  const [publicViewEvent, setPublicViewEvent] = useState(null);
  const [animation, setAnimation] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  // Handle tab navigation
  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      setIsCreating(true);
    } else {
      setIsCreating(false);
    }
  };

  // Toggle view mode between card and list
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
    setAnimation('toggle');
  };

  // Create new event
  const handleCreateEvent = () => {
    const shareCode = generateShareCode(newEvent.title);
    const event = {
      id: events.length + invites.length + 1,
      ...newEvent,
      host: "You",
      shareCode,
      attendees: []
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      isPublic: true
    });
    setIsCreating(false);
    setActiveTab('home');
    setAnimation('create');
  };

  // Respond to invitation
  const handleRespond = (id, status) => {
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

  // Open event details
  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setAnimation('open');
  };

  // Close event details
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  // Open share modal without closing event details
  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  // Close share modal
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  // Handle login
  const handleLogin = () => {
    // In a real app, validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // Copy share link
  const handleCopyLink = async (shareCode) => {
    const shareLink = `https://iftar-app.example.com/event/${shareCode}`;
    await Clipboard.setStringAsync(shareLink);
    setLinkCopied(true);
    
    // Reset copied state after timeout
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  // Generate share link for an event
  const getShareLink = (event) => {
    if (!event) return '';
    return `https://iftar-app.example.com/event/${event.shareCode}`;
  };

  // View public event
  const handleViewPublicEvent = (event) => {
    setPublicViewEvent(event);
    setShowPublicView(true);
    // Close both the share modal and the event details modal
    handleCloseShareModal();
    setSelectedEvent(null); // Close the EventDetails modal
  };

  // Determine which content to show based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <EventList 
            events={events} 
            viewMode={viewMode} 
            onOpenEvent={handleOpenEvent}
            animation={animation}
          />
        );
      
      case 'invites':
        return (
          <EventList 
            events={invites} 
            isInvites={true} 
            viewMode={viewMode} 
            onOpenEvent={handleOpenEvent}
            onRespond={handleRespond}
            animation={animation}
          />
        );
      
      case 'create':
        return (
          <CreateEventForm 
            newEvent={newEvent}
            onChangeEvent={setNewEvent}
            onSubmit={handleCreateEvent}
            onCancel={() => {
              setIsCreating(false);
              setActiveTab('home');
            }}
          />
        );
      
      case 'calendar':
        return <CalendarView events={[...events, ...invites]} />;
      
      case 'profile':
        return <ProfileView 
          onSignOut={() => setIsLoggedIn(false)} 
          eventsCount={events.length}
          invitesCount={invites.length}
        />;
      
      default:
        return null;
    }
  };

  // Determine header title based on active tab
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home': return 'Your Iftar Events';
      case 'invites': return 'Your Invitations';
      case 'create': return 'Create Event';
      case 'calendar': return 'Calendar';
      case 'profile': return 'Profile';
      default: return 'Iftar App';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Header 
        title={getHeaderTitle()} 
        action={['home', 'invites'].includes(activeTab) ? toggleViewMode : null}
        actionLabel={viewMode === 'card' ? 'List View' : 'Card View'}
      />
      
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      <Navigation activeTab={activeTab} onChangeTab={handleChangeTab} />
      
      {/* Modals */}
      <EventDetails 
        event={selectedEvent} 
        isOpen={selectedEvent !== null} 
        onClose={handleCloseEvent} 
        onShare={() => {
          handleOpenShareModal();
        }}
        onInvite={(email) => {
          // Handle invite functionality here
          console.log(`Invited ${email} to event ${selectedEvent?.id}`);
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
      
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin}
      />
      
      <PublicEventView 
        event={publicViewEvent} 
        isOpen={showPublicView} 
        onClose={() => setShowPublicView(false)} 
        isLoggedIn={isLoggedIn}
        onLogin={() => {
          setShowPublicView(false);
          setShowLogin(true);
        }}
        onRespond={handleRespond}
      />
    </View>
  );
};

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

export default function Index() {
  // Redirect to the tabs home screen
  return <Redirect href="/(tabs)" />;
} 