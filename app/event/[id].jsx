import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, Platform, Clipboard, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PublicEventView from '../../components/PublicEventView';
import eventService from '../../utils/eventService';
import useAuthStore from '../../hooks/useAuth';
import useEventsStore from '../../hooks/useEvents';
import { getCurrentUser } from '../../utils/appwrite';

const EventPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isLoggedIn, user, checkSession } = useAuthStore();
  const { updateAttendanceStatus } = useEventsStore();
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
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        
        // If event is private and user is not logged in, show error
        if (!eventData.isPublic && !isLoggedIn) {
          setError('This is a private event. Please log in to view details.');
          setLoading(false);
          return;
        }
        
        setEvent(eventData);
        
        // Check if current user is the author
        if (user) {
          setIsAuthor(eventData.hostId === user.userId);
        }
        
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
  }, [id, user, isLoggedIn]);

  const handleBack = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleAttendEvent = async (eventId, status) => {
    console.log('Handling attendance for event...', eventId, status);
    try {
      if (!isLoggedIn) {
        Alert.alert('Login Required', 'You need to be logged in to track your attendance.');
        return;
      }
      
      console.log('Updating attendance status to:', status);
      await updateAttendanceStatus(eventId, user, status);
      
      // Add a small delay to ensure DB is updated
      setTimeout(async () => {
        // Fetch the updated event data
        const updatedEvent = await eventService.getEventById(id);
        console.log(`Event now has ${updatedEvent.attendees?.length || 0} attendees`);
        setEvent(updatedEvent);
        
        // Check if user is attending after update
        const isNowAttending = updatedEvent.attendees?.some(a => a.userId === user.userId);
        
        // Show success message
        Alert.alert(
          'Success', 
          isNowAttending 
            ? 'You are now attending this event!' 
            : 'You are no longer attending this event.'
        );
      }, 500);
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert('Error', 'Failed to update attendance status. Please try again.');
    }
  };

  const handleEditEvent = () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'You need to be logged in to edit events.');
      return;
    }
    router.push(`/event/edit/${event.$id}`);
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {!isLoggedIn && (
            <Button
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginButton}
            >
              Sign In
            </Button>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Show not found state
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show private event message if not logged in
  if (!event.isPublic && !isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptTitle}>Private Event</Text>
            <Text style={styles.loginPromptText}>
              This is a private event. Please sign in to view the details.
            </Text>
            <Button
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginButton}
              icon={null}
              textStyle={{}}
              variant="primary"
              fullWidth
            >
              Sign In
            </Button>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PublicEventView
        event={event}
        isAuthor={isAuthor}
        isLoggedIn={isLoggedIn}
        onAttend={handleAttendEvent}
        onEdit={handleEditEvent}
        onBack={handleBack}
        onLogin={handleLogin}
        onClose={handleBack}
        isVisible={true}
        currentUser={user ? { userId: user.userId, name: user.name } : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 20,
    width: '100%',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 12,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginPromptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  signupText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
  },
});

export default EventPage; 