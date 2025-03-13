import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, Platform, Clipboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PublicEventView from '../../components/PublicEventView';
import eventService from '../../utils/eventService';
import useAuthStore from '../../hooks/useAuth';
import { getCurrentUser } from '../../utils/appwrite';

const EventPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isLoggedIn, user, checkSession } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  // Check session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        await checkSession();
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    initSession();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Get current user
        const userResult = await getCurrentUser();
        setCurrentUser(userResult);
        
        console.log('Fetching event with ID:', id);
        // Get event details
        const eventData = await eventService.getEventById(id);
        console.log('Event data received:', JSON.stringify(eventData));
        
        // Get attendees for this event
        const attendees = await eventService.getEventAttendees(id);
        console.log('Attendees data received:', JSON.stringify(attendees));
        
        // Make a copy to avoid modifying the original object
        const processedEvent = { ...eventData, attendees };
        
        // Check if current user is the author
        if (userResult && userResult.account && processedEvent.hostId === userResult.account.$id) {
          setIsAuthor(true);
        }
        
        // Format date if needed
        try {
          if (processedEvent.date && typeof processedEvent.date === 'string') {
            const dateStr = processedEvent.date.includes('T') 
              ? processedEvent.date 
              : `${processedEvent.date}T00:00:00`;
            
            console.log('Parsing date:', dateStr);
            const parsedDate = parseISO(dateStr);
            console.log('Parsed date object:', parsedDate);
            
            const formattedDate = format(parsedDate, 'MMMM d, yyyy');
            console.log('Formatted date:', formattedDate);
            
            processedEvent.formattedDate = formattedDate;
          }
        } catch (dateError) {
          console.error('Error formatting date:', dateError);
          // Continue without formatted date if there's an error
        }
        
        setEvent(processedEvent);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Could not load event details. Please try again later.');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Card style={styles.errorCard}>
            <Text style={styles.errorTitle}>Event Not Found</Text>
            <Text style={styles.errorMessage}>{error || 'The event you are looking for does not exist or may have been removed.'}</Text>
            <Button
              title="Back to Events"
              onPress={handleBack}
              style={styles.backButton}
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }
 
  // Handlers for EventDetails actions
  const handleShare = async () => {
    try {
      // Generate the share URL
      const shareUrl = `${window.location.origin}/event/${event.$id}`;
      
      if (Platform.OS === 'web') {
        // Web platform
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: `Join me for ${event.title} on ${event.formattedDate} at ${event.time}`,
            url: shareUrl
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert('Share link copied to clipboard!');
        }
      } else {
        // Mobile platforms
        await Clipboard.setString(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const handleInvite = async (email) => {
    try {
      if (!currentUser?.account?.$id) {
        throw new Error('User not logged in');
      }

      await eventService.createInvitation(
        event.$id,
        currentUser.account.$id,
        email
      );
      
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleRespond = async (eventId, status) => {
    try {
      if (!currentUser?.account?.$id) {
        throw new Error('User not logged in');
      }

      // Add the attendee
      await eventService.addAttendee(
        eventId,
        currentUser.account.$id,
        currentUser.user.name || 'Guest',
        status,
        event.hostId
      );
      
      // Get updated attendees list
      const attendees = await eventService.getEventAttendees(eventId);
      
      // Update the event state with new attendees
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees
      }));
      
      alert('Attendance updated successfully!');
    } catch (error) {
      console.error('Error responding to event:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };
  
  return (
    <PublicEventView
      event={event}
      isOpen={true}
      isVisible={true}
      onClose={handleBack}
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
      isAuthor={isAuthor}
      onShare={handleShare}
      onInvite={handleInvite}
      onRespond={handleRespond}
      currentUser={currentUser}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 24,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    minWidth: 180,
  },
});

export default EventPage; 