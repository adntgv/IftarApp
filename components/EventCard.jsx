import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react-native';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { useTheme } from './ThemeProvider';

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
  const { colors, spacing, typography, animations } = theme;
  
  // Animation value for card
  const [scaleValue] = React.useState(new Animated.Value(1));
  
  // Animation for pulse effect
  React.useEffect(() => {
    if (animate === 'pulse') {
      animations.presets.pulse(scaleValue).start();
    }
  }, [animate, scaleValue]);
  
  // Status badge color based on event status
  const getStatusBadge = () => {
    if (!isInvite) return null;
    
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
        
        {event.isPublic && (
          <View 
            style={[
              styles.publicBadge, 
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
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
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
  },
  publicBadge: {
    position: 'absolute',
    top: 16,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
});

export default EventCard; 