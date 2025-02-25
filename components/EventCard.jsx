import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react-native';
import Card from './ui/Card';
import Button from './ui/Button';

/**
 * EventCard component for displaying event information
 */
const EventCard = ({ event, isInvite = false, onOpenEvent, onRespond }) => {
  const borderColor = isInvite 
    ? event.status === 'confirmed' 
      ? '#16a34a' 
      : event.status === 'declined' 
        ? '#dc2626' 
        : '#ca8a04'
    : '#3b82f6';
      
  return (
    <Card 
      borderColor={borderColor} 
      onPress={() => onOpenEvent(event)}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.host}>{isInvite ? `Invited by ${event.host}` : 'You host'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Calendar size={16} color="#4b5563" style={styles.icon} />
        <Text style={styles.infoText}>{event.date}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color="#4b5563" style={styles.icon} />
        <Text style={styles.infoText}>{event.time}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <MapPin size={16} color="#4b5563" style={styles.icon} />
        <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
      </View>
      
      {!isInvite && event.attendees && (
        <View style={styles.infoRow}>
          <Users size={16} color="#4b5563" style={styles.icon} />
          <Text style={styles.infoText}>
            {event.attendees.filter(a => a.status === 'confirmed').length} confirmed
          </Text>
        </View>
      )}
      
      {isInvite && (
        <View style={styles.buttonContainer}>
          <Button 
            variant={event.status === 'confirmed' ? 'success' : 'secondary'}
            icon={<Check size={14} color={event.status === 'confirmed' ? 'white' : '#4b5563'} />}
            onPress={(e) => {
              // Prevent event propagation
              e.stopPropagation?.();
              onRespond(event.id, 'confirmed');
            }}
            style={styles.respondButton}
          >
            Accept
          </Button>
          <Button 
            variant={event.status === 'declined' ? 'danger' : 'secondary'}
            icon={<X size={14} color={event.status === 'declined' ? 'white' : '#4b5563'} />}
            onPress={(e) => {
              // Prevent event propagation
              e.stopPropagation?.();
              onRespond(event.id, 'declined');
            }}
            style={styles.respondButton}
          >
            Decline
          </Button>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  host: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    color: '#4b5563',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  respondButton: {
    flex: 0.48,
  }
});

export default EventCard; 