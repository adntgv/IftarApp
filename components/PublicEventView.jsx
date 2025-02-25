import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Animated, Platform, SafeAreaView } from 'react-native';
import { X, Calendar, MapPin, Edit, Info, ExternalLink, User, LogIn, Check } from 'lucide-react-native';
import Button from './ui/Button';
import Card from './ui/Card';
import * as Linking from 'expo-linking';

/**
 * PublicEventView component for publicly sharing events
 */
const PublicEventView = ({ 
  event, 
  isOpen, 
  onClose, 
  isLoggedIn, 
  onLogin, 
  onRespond 
}) => {
  // Add moon float animation
  const [floatAnim] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    // Create a floating animation for the moon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Transform the floating animation to a Y translation
  const moonTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  if (!isOpen || !event) return null;

  // Calculate days until event
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = Math.abs(eventDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate sunset time (example)
  const sunsetTime = "18:23";
  
  // Function to open maps app
  const openMaps = () => {
    const location = encodeURIComponent(event.location);
    const mapsUrl = `https://maps.google.com/?q=${location}`;
    Linking.openURL(mapsUrl).catch(err => console.error('An error occurred', err));
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header background */}
          <View style={styles.headerBackground}>
            {/* Animated moon */}
            <Animated.View 
              style={[
                styles.moonContainer, 
                { transform: [{ translateY: moonTranslateY }] }
              ]}
            >
              <View style={styles.moon} />
              <View style={styles.moonShadow} />
            </Animated.View>
            
            <View style={styles.closeButtonContainer}>
              <Button 
                variant="secondary" 
                icon={<X size={20} color="#1f2937" />}
                onPress={onClose}
                style={styles.closeButton}
              />
            </View>
          </View>
          
          {/* Event title section */}
          <View style={styles.titleContainer}>
            <View style={styles.titleCard}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.host}>Hosted by {event.host}</Text>
              
              {/* Add the countdown widgets */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Days Until Iftar</Text>
                  <Text style={styles.statValueDays}>{diffDays}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sunset</Text>
                  <Text style={styles.statValueSunset}>{sunsetTime}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Attending</Text>
                  <Text style={styles.statValueAttending}>
                    {event.attendees 
                      ? event.attendees.filter(a => a.status === 'confirmed').length 
                      : 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Event details */}
          <View style={styles.detailsContainer}>
            <Card style={styles.detailsCard} borderColor="#3b82f6">
              <View style={styles.detailsHeader}>
                <Info size={18} color="#3b82f6" style={styles.detailsIcon} />
                <Text style={styles.detailsTitle}>Event Details</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Calendar size={20} color="#6b7280" style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailText}>{event.date} at {event.time}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color="#6b7280" style={styles.infoIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.location}</Text>
                  <Button 
                    variant="link" 
                    icon={<ExternalLink size={14} color="#2563eb" />}
                    onPress={openMaps}
                    style={styles.mapLink}
                  >
                    View on Maps
                  </Button>
                </View>
              </View>
              
              {event.description && (
                <View style={styles.detailRow}>
                  <Edit size={20} color="#6b7280" style={styles.detailIcon} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailText}>{event.description}</Text>
                  </View>
                </View>
              )}
            </Card>
          </View>
          
          {/* Host information and RSVP */}
          <View style={styles.hostContainer}>
            <Card style={styles.hostCard}>
              <View style={styles.hostHeader}>
                <Text style={styles.hostHeaderText}>About the Host</Text>
              </View>
              
              <View style={styles.hostInfo}>
                <View style={styles.hostAvatar}>
                  <User size={24} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.hostName}>{event.host}</Text>
                  <Text style={styles.hostRole}>Event Organizer</Text>
                </View>
              </View>
              
              <View style={styles.rsvpContainer}>
                <Text style={styles.rsvpText}>
                  Would you like to attend this iftar event?
                </Text>
                
                {isLoggedIn ? (
                  <View style={styles.rsvpButtons}>
                    <Button 
                      variant="success" 
                      icon={<Check size={18} color="white" />}
                      onPress={() => {
                        if (event.status) {
                          onRespond(event.id, 'confirmed');
                        }
                        onClose();
                      }}
                      style={styles.rsvpButton}
                    >
                      I'll Attend
                    </Button>
                    <Button 
                      variant="danger" 
                      icon={<X size={18} color="white" />}
                      onPress={() => {
                        if (event.status) {
                          onRespond(event.id, 'declined');
                        }
                        onClose();
                      }}
                      style={styles.rsvpButton}
                    >
                      I Can't Attend
                    </Button>
                  </View>
                ) : (
                  <Button 
                    variant="primary" 
                    icon={<LogIn size={18} color="white" />}
                    onPress={onLogin}
                    style={styles.signInButton}
                  >
                    Sign in to RSVP
                  </Button>
                )}
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 50,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16, // Extra padding for iOS
  },
  headerBackground: {
    height: 240,
    backgroundColor: '#3b82f6',
    position: 'relative',
    overflow: 'hidden',
  },
  moonContainer: {
    position: 'absolute',
    top: 48,
    right: 48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fef3c7',
    opacity: 0.9,
    overflow: 'hidden',
  },
  moon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#fef3c7',
  },
  moonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: 16,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginTop: -64,
    position: 'relative',
    zIndex: 10,
  },
  titleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  host: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '32%',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValueDays: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statValueSunset: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  statValueAttending: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsIcon: {
    marginRight: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  detailIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 15,
    color: '#4b5563',
  },
  detailContent: {
    flex: 1,
  },
  hostContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  hostCard: {
    borderLeftWidth: 0,
    padding: 0,
    overflow: 'hidden',
  },
  hostHeader: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  hostHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  hostRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  rsvpContainer: {
    padding: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
  },
  rsvpText: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 16,
  },
  rsvpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rsvpButton: {
    flex: 0.48,
  },
  signInButton: {
    minWidth: 160,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#4b5563',
  },
  mapLink: {
    marginTop: 8,
  },
});

export default PublicEventView; 