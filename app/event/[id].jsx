import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PublicEventView from '../../components/PublicEventView';
import { getEventByShareCode } from '../../utils/eventService';
import useAuthStore from '../../hooks/useAuth';

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

export default function EventPage() {
  const params = useLocalSearchParams();
  // Get id parameter from URL
  const shareCode = params.id || '';
  
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Log all parameters for debugging
  console.log('URL Parameters:', params);
  console.log('Event Share Code:', shareCode);
  
  useEffect(() => {
    if (!shareCode) {
      setError('No event ID provided');
      setLoading(false);
      return;
    }
    
    async function loadEvent() {
      try {
        console.log('Loading event with share code:', shareCode);
        setLoading(true);
        
        const eventData = await fetchEventByShareCode(shareCode);
        console.log('Fetched event data:', eventData);
        
        if (!eventData) {
          setError('Event not found');
        } else {
          setEvent(eventData);
        }
      } catch (err) {
        setError('Failed to load event');
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [shareCode]);

  const handleRespond = (id, status) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }
    
    console.log(`Responding to event ${id} with status: ${status}`);
    // In a real app, this would call the respondToInvitation function
    // from eventService and then navigate back to the events page
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Go Home"
              onPress={() => router.push('/')}
              variant="primary"
            />
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {event ? (
        <PublicEventView 
          event={event} 
          isOpen={true}
          isVisible={true}
          onClose={() => router.push('/')}
          isLoggedIn={isLoggedIn}
          onLogin={() => router.push('/login')}
          onRespond={handleRespond}
        />
      ) : (
        <Text>No event found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
  },
  errorContent: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
}); 