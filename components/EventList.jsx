import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import EventCard from './EventCard';

/**
 * EventList component for displaying events in card or list view
 */
const EventList = ({ 
  events, 
  isInvites = false, 
  viewMode = 'card',
  onOpenEvent,
  onRespond 
}) => {

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}><Text style={styles.emptyText}>
          {isInvites ? "No invitations yet" : "No events yet"}
        </Text>
      </View>
    );
  }

  // Card View Renderer
  const renderCardItem = ({ item }) => (
    <EventCard 
      event={item} 
      isInvite={isInvites} 
      onOpenEvent={onOpenEvent}
      onRespond={onRespond}
    />
  );

  // List View Renderer
  const renderListItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => onOpenEvent(item)}
    >
      <View><Text style={styles.listItemTitle}>{item.title}</Text>
        <Text style={styles.listItemSubtitle}>{item.date} • {item.time}</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={viewMode === 'card' ? renderCardItem : renderListItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={viewMode === 'list' ? Separator : null}
      />
    </View>
  );
};

// Separator component for list view
const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

export default EventList; 