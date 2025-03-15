import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, Platform, Clipboard, TouchableOpacity, Alert } from 'react-native';
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

  const handleAttendEvent = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to attend events.',
        [
          {
            text: 'Login',
            onPress: handleLogin
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    try {
      await eventService.attendEvent(event.$id, user.userId);
      // Refresh event data
      const updatedEvent = await eventService.getEvent(id);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Error attending event:', error);
      Alert.alert('Error', 'Failed to attend event. Please try again.');
    }
  };

  const handleEditEvent = () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'You need to be logged in to edit events.');
      return;
    }
    router.push(`/event/edit/${event.$id}`);
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
              icon={null}
              textStyle={{}}
              variant="primary"
              fullWidth
            >
              Back to Events
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    );
  }


  // If the event is not public and user is not logged in, show login prompt
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
});

export default EventPage; 