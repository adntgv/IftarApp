import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PublicEventView from '../../components/PublicEventView';
import { getEventByShareCode } from '../../utils/eventService';
import useAuthStore from '../../hooks/useAuth';
import { getCurrentUser } from '../../utils/appwrite';
import EventDetails from '../../components/EventDetails';

// Fetch event by share code using the eventService
const fetchEventByShareCode = async (shareCode) => {
  try {
    console.log('Fetching event with share code:', shareCode);
    return await getEventByShareCode(shareCode);
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
        
        // Get event details
        const eventData = await eventService.getEvent(id);
        
        // Format date if needed
        if (eventData && eventData.date && typeof eventData.date === 'string') {
          const formattedDate = format(
            parseISO(eventData.date.includes('T') ? eventData.date : `${eventData.date}T00:00:00`), 
            'MMMM d, yyyy'
          );
          eventData.formattedDate = formattedDate;
        }
        
        setEvent(eventData);
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
    router.back();
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
    ...event,
    // Use formatted date if available
    date: event.formattedDate || event.date,
    host: event.hostName || 'Event Host'
  };
  
  return (
    <EventDetails
      event={eventDetailsData}
      isModalVisible={true}
      onClose={handleBack}
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