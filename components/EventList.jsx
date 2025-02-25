import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  RefreshControl,
  Animated,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import EventCard from './EventCard';
import { useTheme } from './ThemeProvider';
import { Calendar, List } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Enhanced EventList component with animations and improved styling
 */
const EventList = ({ 
  events = [], 
  isInvites = false, 
  onOpenEvent, 
  onRespond,
  onRefresh,
  isRefreshing = false,
  emptyMessage,
  ListHeaderComponent,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, animations } = theme;
  
  // Animation for list items to fade in
  const [fadeAnim] = useState(new Animated.Value(0));
  const [animatedEvents, setAnimatedEvents] = useState([]);
  
  // When events change, animate new items
  useEffect(() => {
    if (events.length > 0) {
      setAnimatedEvents(events);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: animations.easing.decelerate,
      }).start();
    }
  }, [events]);
  
  // Render item with animation
  const renderItem = ({ item, index }) => {
    // Staggered animation delay based on index
    const animationDelay = index * 80;
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <EventCard
          event={item}
          isInvite={isInvites}
          onOpenEvent={onOpenEvent}
          onRespond={onRespond}
        />
      </Animated.View>
    );
  };
  
  // Empty list component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {isRefreshing ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundSecondary }]}>
            {isInvites ? (
              <Calendar size={32} color={colors.primary} />
            ) : (
              <List size={32} color={colors.primary} />
            )}
          </View>
          <Text 
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
                fontFamily: typography.fontFamily.medium,
              }
            ]}
          >
            {emptyMessage || (isInvites 
              ? "No invitations yet" 
              : "No events to display")}
          </Text>
          <Text 
            style={[
              styles.emptySubtext,
              {
                color: colors.textTertiary,
                fontFamily: typography.fontFamily.regular,
              }
            ]}
          >
            {isInvites 
              ? "When someone invites you to an iftar, it will appear here." 
              : "Create your first event by tapping the + button."}
          </Text>
        </>
      )}
    </View>
  );
  
  return (
    <FlatList
      data={animatedEvents}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[
        styles.container, 
        { padding: spacing.layout.screenPadding }
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => (
        <View style={{ height: spacing.spacing.md }} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space at the bottom
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
});

export default EventList; 