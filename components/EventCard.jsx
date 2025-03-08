import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Users, Check, X, UserCircle } from 'lucide-react-native';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { useTheme } from './ThemeProvider';

// Create styles using a function pattern
const createStyles = (colors, spacing, typography) => StyleSheet.create({
  card: {
    borderLeftWidth: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 8,
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
  },
  statusBadge: {
    marginLeft: 'auto',
  },
  content: {
    flexDirection: 'row',
  },
  detailsContainer: {
    flex: 1,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  hostText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  badgesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    padding: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attendanceControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  attendanceButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: typography.fontFamily.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptButton: {
    marginRight: 8,
  },
  declineButton: {},
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  description: {
    fontStyle: 'italic',
    color: colors.textTertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
});

/**
 * Enhanced EventCard component with animations and improved styling
 */
const EventCard = ({ 
  event, 
  isInvite = false, 
  onOpenEvent, 
  onRespond, 
  animate = '' 
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const typography = theme.typography;
  
  // Create styles with theme values
  const styles = createStyles(colors, spacing, typography);
  
  // Animation value for card
  const [scaleValue] = React.useState(new Animated.Value(1));
  
  // Animation for pulse effect
  React.useEffect(() => {
    if (animate === 'pulse') {
      theme.animations.presets.pulse(scaleValue).start();
    }
  }, [animate, scaleValue]);
  
  // Status badge color based on event status
  const getStatusBadge = () => {
    if (isInvite) {
      let variant = 'primary';
      let text = 'Pending';
      
      if (event.status === 'confirmed') {
        variant = 'success';
        text = 'Confirmed';
      } else if (event.status === 'declined') {
        variant = 'error';
        text = 'Declined';
      } else {
        variant = 'warning';
        text = 'Pending';
      }
      
      return (
        <Badge 
          text={text} 
          variant={variant} 
          size="small"
          style={styles.statusBadge}
        />
      );
    } else if (event.attendanceStatus) {
      // Display attendance status for non-invite events
      let variant = 'primary';
      let text = 'Not Attending';
      
      if (event.attendanceStatus === 'confirmed') {
        variant = 'success';
        text = 'Attending';
      } else if (event.attendanceStatus === 'pending') {
        variant = 'warning';
        text = 'Pending';
      } else {
        variant = 'neutral';
        text = 'Not Attending';
      }
      
      return (
        <Badge 
          text={text} 
          variant={variant} 
          size="small"
          style={styles.statusBadge}
        />
      );
    }
    
    return null;
  };
  
  // Host information display
  const renderHostInfo = () => {
    if (!event.isOtherUserEvent) return null;
    
    return (
      <View style={styles.hostContainer}>
        <UserCircle size={16} color={colors.textSecondary} />
        <Text 
          style={[
            styles.hostText,
            { 
              color: colors.textSecondary,
              fontFamily: typography.fontFamily.regular,
            }
          ]}
        >
          Host: {event.hostName || 'Unknown'}
        </Text>
      </View>
    );
  };
  
  return (
    <Animated.View 
      style={{ 
        transform: [{ scale: scaleValue }],
        marginBottom: spacing.spacing.md,
      }}
    >
      <Card 
        onPress={() => onOpenEvent(event)}
        elevation="sm"
        borderRadius="md"
        style={styles.card}
      >
        <View style={styles.header}>
          <Text 
            style={[
              styles.title, 
              { 
                color: colors.text,
                fontSize: typography.fontSize.lg,
                fontFamily: typography.fontFamily.medium,
              }
            ]}
          >
            {event.title}
          </Text>
          {getStatusBadge()}
        </View>
        
        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            {renderHostInfo()}
            
            <View style={styles.detailRow}>
              <Calendar size={18} color={colors.primary} />
              <Text 
                style={[
                  styles.detailText,
                  { 
                    color: colors.textSecondary,
                    fontFamily: typography.fontFamily.regular,
                  }
                ]}
              >
                {event.date}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={18} color={colors.primary} />
              <Text 
                style={[
                  styles.detailText,
                  { 
                    color: colors.textSecondary,
                    fontFamily: typography.fontFamily.regular,
                  }
                ]}
              >
                {event.time || "7:00 PM"}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={18} color={colors.primary} />
              <Text 
                style={[
                  styles.detailText,
                  { 
                    color: colors.textSecondary,
                    fontFamily: typography.fontFamily.regular,
                  }
                ]}
                numberOfLines={1}
              >
                {event.location}
              </Text>
            </View>
            
            {event.attendees && (
              <View style={styles.detailRow}>
                <Users size={18} color={colors.primary} />
                <Text 
                  style={[
                    styles.detailText,
                    { 
                      color: colors.textSecondary,
                      fontFamily: typography.fontFamily.regular,
                    }
                  ]}
                >
                  {Array.isArray(event.attendees) ? event.attendees.length : 0} attendees
                </Text>
              </View>
            )}
          </View>
          
          {isInvite && event.status === 'pending' && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.acceptButton,
                  { backgroundColor: colors.success }
                ]}
                onPress={() => onRespond(event.$id, 'confirmed')}
              >
                <Check size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.declineButton,
                  { backgroundColor: colors.error }
                ]}
                onPress={() => onRespond(event.$id, 'declined')}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
          
          {!isInvite && event.attendanceStatus && (
            <View style={styles.attendanceControlContainer}>
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { 
                    backgroundColor: event.attendanceStatus === 'confirmed' ? colors.success : 'transparent',
                    borderColor: colors.success,
                    marginRight: 8 
                  }
                ]}
                onPress={() => onRespond(event.$id, 'confirmed')}
              >
                <Check size={16} color={event.attendanceStatus === 'confirmed' ? '#FFFFFF' : colors.success} />
                <Text 
                  style={[
                    styles.attendanceButtonText,
                    { 
                      color: event.attendanceStatus === 'confirmed' ? '#FFFFFF' : colors.success,
                    }
                  ]}
                >
                  Going
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { 
                    backgroundColor: event.attendanceStatus === 'pending' ? colors.warning : 'transparent',
                    borderColor: colors.warning,
                    marginRight: 8 
                  }
                ]}
                onPress={() => onRespond(event.$id, 'pending')}
              >
                <Clock size={16} color={event.attendanceStatus === 'pending' ? '#FFFFFF' : colors.warning} />
                <Text 
                  style={[
                    styles.attendanceButtonText,
                    { 
                      color: event.attendanceStatus === 'pending' ? '#FFFFFF' : colors.warning,
                    }
                  ]}
                >
                  Maybe
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  { 
                    backgroundColor: event.attendanceStatus === 'not-attending' ? colors.error : 'transparent',
                    borderColor: colors.error 
                  }
                ]}
                onPress={() => onRespond(event.$id, 'not-attending')}
              >
                <X size={16} color={event.attendanceStatus === 'not-attending' ? '#FFFFFF' : colors.error} />
                <Text 
                  style={[
                    styles.attendanceButtonText,
                    { 
                      color: event.attendanceStatus === 'not-attending' ? '#FFFFFF' : colors.error,
                    }
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {event.description && (
          <View style={styles.footer}>
            <Text 
              style={[
                styles.description,
                { 
                  color: colors.textTertiary,
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.regular,
                }
              ]}
              numberOfLines={2}
            >
              {event.description}
            </Text>
          </View>
        )}
        
        {/* Event badges */}
        <View style={styles.badgesContainer}>
          {event.isPublic && (
            <View 
              style={[
                styles.badge, 
                { backgroundColor: colors.primary }
              ]}
            >
              <Text 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: typography.fontSize.xs,
                  fontFamily: typography.fontFamily.medium,
                }}
              >
                PUBLIC
              </Text>
            </View>
          )}
          
          {event.isAttending && (
            <View 
              style={[
                styles.badge, 
                { backgroundColor: colors.success, marginLeft: 8 }
              ]}
            >
              <Text 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: typography.fontSize.xs,
                  fontFamily: typography.fontFamily.medium,
                }}
              >
                ATTENDING
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Animated.View>
  );
};

export default EventCard; 