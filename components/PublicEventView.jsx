import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Animated, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { X, Calendar, MapPin, Edit, Info, ExternalLink, User, LogIn, Check, Share2, Send } from 'lucide-react-native';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import * as Linking from 'expo-linking';

/**
 * PublicEventView component for publicly sharing events
 */
const PublicEventView = ({ 
  event, 
  isOpen, 
  isVisible,
  onClose, 
  isLoggedIn, 
  onLogin,
  isAuthor,
  onShare,
  onInvite,
  onRespond,
  currentUser 
}) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  
  // Get current user's attendance status
  const currentUserAttendance = event?.attendees?.find(
    attendee => attendee.userId === currentUser?.account?.$id
  );
  
  // Reset invite sent status
  React.useEffect(() => {
    if (inviteSent) {
      const timer = setTimeout(() => {
        setInviteSent(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inviteSent]);

  // Handle send invitation
  const handleSendInvite = async () => {
    if (onInvite && inviteEmail.trim()) {
      await onInvite(inviteEmail.trim());
      setInviteSent(true);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  // Use either isVisible or isOpen prop, preferring isVisible if provided
  const isModalVisible = isVisible !== undefined ? isVisible : isOpen;
  
  // Add moon float animation
  const [floatAnim] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    // Create a floating animation for the moon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);
  
  // Transform the floating animation to a Y translation
  const moonTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  if (!isModalVisible || !event) return null;

  // Calculate days until event
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = Math.abs(eventDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Format the date using date-fns
  const formattedDate = event.date && typeof event.date === 'string'
    ? format(parseISO(event.date.includes('T') ? event.date : `${event.date}T00:00:00`), 'MMMM d, yyyy')
    : event.date;
    
  // Calculate sunset time (example)
  const sunsetTime = "18:23";
  
  // Function to open maps app
  const openMaps = (location) => {
    const query = encodeURIComponent(location);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      web: `https://maps.google.com/?q=${query}`,
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  
  // Check if maps can be opened
  const [canOpenMaps, setCanOpenMaps] = React.useState(false);
  
  React.useEffect(() => {
    if (event && event.location) {
      const query = encodeURIComponent(event.location);
      const url = Platform.select({
        ios: `maps:0,0?q=${query}`,
        android: `geo:0,0?q=${query}`,
        web: `https://maps.google.com/?q=${query}`,
      });
      
      Linking.canOpenURL(url).then(supported => {
        setCanOpenMaps(supported);
      });
    }
  }, [event]);
  
  return (
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
              <Text style={styles.host}>Hosted by {event.hostName || event.host}</Text>
              
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
                  <Text style={styles.detailText}>{formattedDate} at {event.time}</Text>
                  <Text style={styles.detailSubtext}>
                    {formatDistanceToNow(eventDate, { addSuffix: true })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin size={20} color="#6b7280" style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailText}>{event.location}</Text>
                  {canOpenMaps && (
                    <Button 
                      variant="link" 
                      icon={<ExternalLink size={14} color="#2563eb" />}
                      onPress={() => openMaps(event.location)}
                      style={styles.mapLink}
                      title="View on Maps"
                    />
                  )}
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
          
          {/* Call to action */}
          <View style={styles.actionContainer}>
            {!isLoggedIn ? (
              <Button
                variant="primary"
                title="Log in to Respond"
                icon={<LogIn size={18} color="white" />}
                onPress={onLogin}
                style={styles.actionButton}
              />
            ) : isAuthor ? (
              <View style={styles.actionButtons}>
                <Button 
                  variant="primary"
                  icon={<Share2 size={18} color="#ffffff" />}
                  onPress={() => onShare?.(event)}
                  style={styles.actionButton}
                >
                  Share Event
                </Button>
                <Button 
                  variant="secondary"
                  icon={<Send size={18} color="#4b5563" />}
                  onPress={() => setShowInviteForm(true)}
                  style={styles.actionButton}
                >
                  Invite Guests
                </Button>
              </View>
            ) : currentUserAttendance?.status === 'confirmed' ? (
              <Button
                variant="secondary"
                title="Revoke Attendance"
                icon={<X size={18} color="#4b5563" />}
                onPress={() => onRespond && onRespond(event.$id, 'not-attending')}
                style={styles.actionButton}
              />
            ) : (
              <Button
                variant="primary"
                title="I'm Attending"
                icon={<Check size={18} color="white" />}
                onPress={() => onRespond && onRespond(event.$id, 'confirmed')}
                style={styles.actionButton}
              />
            )}
          </View>

          {/* Invite Form Modal */}
          <Modal
            isVisible={showInviteForm}
            onClose={() => setShowInviteForm(false)}
            title="Invite Guests"
          >
            <View style={styles.inviteForm}>
              <Input
                label="Email Address"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="friend@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.inviteButtons}>
                <Button 
                  variant="secondary"
                  onPress={() => setShowInviteForm(false)}
                  style={styles.inviteButton}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  icon={<Send size={16} color="#ffffff" />}
                  onPress={handleSendInvite}
                  disabled={!inviteEmail.trim()}
                  style={styles.inviteButton}
                >
                  Send Invite
                </Button>
              </View>
              {inviteSent && (
                <View style={styles.inviteSuccess}>
                  <Text style={styles.inviteSuccessText}>
                    Invitation sent successfully!
                  </Text>
                </View>
              )}
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
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
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }
    ),
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
  actionContainer: {
    padding: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
  },
  actionButton: {
    minWidth: 160,
  },
  detailSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inviteForm: {
    padding: 16,
  },
  inviteButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  inviteButton: {
    marginLeft: 8,
  },
  inviteSuccess: {
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  inviteSuccessText: {
    color: '#16a34a',
    fontWeight: '500',
  },
});

export default PublicEventView; 