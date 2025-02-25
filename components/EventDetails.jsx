import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Calendar, Clock, MapPin, Users, Edit, Send, Share2, Check, X, Moon } from 'lucide-react-native';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';

/**
 * EventDetails component for displaying detailed event information
 */
const EventDetails = ({ 
  event, 
  isOpen, 
  onClose, 
  onInvite, 
  onShare, 
  onRespond 
}) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  
  // Reset invite sent status
  useEffect(() => {
    if (inviteSent) {
      const timer = setTimeout(() => {
        setInviteSent(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inviteSent]);
  
  // Handle send invitation
  const handleSendInvite = () => {
    // In a real app, this would send an invitation
    if (onInvite && inviteEmail.trim()) {
      onInvite(inviteEmail.trim());
    }
    setInviteSent(true);
    
    // Reset state after showing success message
    setTimeout(() => {
      setShowInvite(false);
      setInviteEmail('');
    }, 1500);
  };
  
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Moon size={32} color="#3b82f6" />
            </View>
          </View>
          
          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.host}>Hosted by {event.host}</Text>
            
            <View style={styles.detailsContainer}>
              {/* Date & Time */}
              <View style={styles.detailRow}>
                <Calendar size={20} color="#6b7280" style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailText}>{event.date} at {event.time}</Text>
                </View>
              </View>
              
              {/* Location */}
              <View style={styles.detailRow}>
                <MapPin size={20} color="#6b7280" style={styles.detailIcon} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
              
              {/* Description (if any) */}
              {event.description && (
                <View style={styles.detailRow}>
                  <Edit size={20} color="#6b7280" style={styles.detailIcon} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailText}>{event.description}</Text>
                  </View>
                </View>
              )}
              
              {/* Attendees (if any) */}
              {event.attendees && (
                <View style={styles.detailRow}>
                  <Users size={20} color="#6b7280" style={styles.detailIcon} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Guests</Text>
                    <View style={styles.attendeesContainer}>
                      {event.attendees.map(attendee => (
                        <View key={attendee.id} style={styles.attendeeRow}>
                          <View style={[
                            styles.statusDot, 
                            { backgroundColor: 
                              attendee.status === 'confirmed' ? '#16a34a' : 
                              attendee.status === 'declined' ? '#dc2626' : 
                              '#ca8a04' 
                            }
                          ]} />
                          <Text style={styles.attendeeName}>{attendee.name}</Text>
                          <Badge 
                            status={attendee.status} 
                            text={
                              attendee.status === 'confirmed' ? 'Going' : 
                              attendee.status === 'declined' ? 'Not going' : 'Pending'
                            }
                            style={styles.attendeeBadge}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
            
            {/* Actions for host */}
            {!event.status && (
              <View style={styles.actionContainer}>
                {showInvite ? (
                  <View style={styles.inviteForm}>
                    <Input
                      label="Email or Name"
                      value={inviteEmail}
                      onChange={(text) => setInviteEmail(text)}
                      placeholder="friend@example.com"
                    />
                    <View style={styles.inviteButtons}>
                      <Button 
                        variant="secondary"
                        onPress={() => setShowInvite(false)}
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
                ) : (
                  <View style={styles.actionButtons}>
                    <Button 
                      variant="primary"
                      icon={<Send size={18} color="#ffffff" />}
                      onPress={() => setShowInvite(true)}
                      style={styles.actionButton}
                    >
                      Invite Guests
                    </Button>
                    <Button 
                      variant="secondary"
                      icon={<Share2 size={18} color="#4b5563" />}
                      onPress={() => {
                        onShare?.(event);
                      }}
                      style={styles.actionButton}
                    >
                      Share Link
                    </Button>
                  </View>
                )}
              </View>
            )}
            
            {/* Actions for invitee */}
            {event.status === 'pending' && (
              <View style={styles.responseButtons}>
                <Button 
                  variant="success"
                  icon={<Check size={18} color="white" />}
                  onPress={() => {
                    onRespond?.(event.id, 'confirmed');
                    onClose();
                  }}
                  style={styles.responseButton}
                >
                  Accept
                </Button>
                <Button 
                  variant="danger"
                  icon={<X size={18} color="white" />}
                  onPress={() => {
                    onRespond?.(event.id, 'declined');
                    onClose();
                  }}
                  style={styles.responseButton}
                >
                  Decline
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 0, // iOS fix
      }
    })
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 120,
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
    ...Platform.select({
      ios: {
        zIndex: 1, // Ensure proper rendering layer on iOS
      }
    })
  },
  iconCircle: {
    position: 'absolute',
    bottom: -24,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
    paddingTop: 36,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16, // Extra padding on iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  host: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
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
  attendeesContainer: {
    marginTop: 8,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  attendeeName: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  attendeeBadge: {
    marginLeft: 8,
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  inviteForm: {
    marginBottom: 8,
  },
  inviteButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  inviteButton: {
    marginLeft: 8,
  },
  inviteSuccess: {
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  inviteSuccessText: {
    color: '#047857',
    fontWeight: '500',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  responseButton: {
    flex: 0.48,
  },
});

export default EventDetails; 