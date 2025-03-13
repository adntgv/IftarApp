import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Calendar, Clock, MapPin, Users, Edit, Send, Share2, Check, X, Moon } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { useTheme } from './ThemeProvider';

// Create styles outside component with a function pattern
const createStyles = (colors, spacing) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  host: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacing.borderRadius.md,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 15,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  inviteSuccessText: {
    color: colors.success,
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

/**
 * EventDetails component for displaying detailed event information
 */
const EventDetails = ({ 
  event, 
  isOpen,
  isVisible,
  onClose, 
  onInvite, 
  onShare, 
  onRespond 
}) => {
  const isModalVisible = isVisible !== undefined ? isVisible : isOpen;
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  
  // Create styles with theme values
  const styles = createStyles(colors, spacing);
  
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
                  <Text style={styles.detailText}>
                    {(() => {
                      try {
                        if (event.date && typeof event.date === 'string') {
                          const dateStr = event.date.includes('T') ? event.date : `${event.date}T00:00:00`;
                          return format(parseISO(dateStr), 'MMMM d, yyyy');
                        }
                        return event.date || 'Date not specified';
                      } catch (err) {
                        console.error('Error formatting date in EventDetails:', err);
                        return event.date || 'Date not specified';
                      }
                    })()} at {event.time || 'Time not specified'}
                  </Text>
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
  );
};

export default EventDetails; 