import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PublicEventView from '../../components/PublicEventView';
import eventService from '../../utils/eventService';
import useAuthStore from '../../hooks/useAuth';
import { getCurrentUser } from '../../utils/appwrite';
import EventDetails from '../../components/EventDetails';
import EventCard from '../../components/EventCard';

// Fetch event by share code using the eventService
const fetchEventByShareCode = async (shareCode) => {
  try {
    console.log('Fetching event with share code:', shareCode);
    return await eventService.getEventByShareCode(shareCode);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

const EventPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
        
        // Make a copy to avoid modifying the original object
        const processedEvent = { ...eventData };
        
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

  // Prepare data for EventDetails component
  const eventDetailsData = {
    // Set default values for all required fields
    title: event?.title || 'Event',
    date: event?.formattedDate || event?.date || 'Date not available',
    time: event?.time || 'Time not available',
    location: event?.location || 'Location not available',
    description: event?.description || '',
    host: event?.hostName || 'Event Host',
    // Ensure we pass any other available fields from the event
    ...event
  };
  
  // Handlers for EventDetails actions
  const handleShare = () => {
    console.log('Share event:', event.$id);
    // Share functionality would go here
  };

  const handleInvite = (email) => {
    console.log('Invite to event:', event.$id, 'Email:', email);
    // Invite functionality would go here
  };

  const handleRespond = (eventId, status) => {
    console.log('Respond to event:', eventId, 'Status:', status);
    // Respond functionality would go here
  };
  
  return (
    <PublicEventView
      event={event}
      isOpen={true}
      isVisible={true}
      onClose={handleBack}
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
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