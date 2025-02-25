import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import { initialEvents, initialInvites } from '@/utils/mockData';
import { EventLike } from '@/types/event';

export default function CalendarScreen() {
  const router = useRouter();
  // Combine events and invites for the calendar
  const allEvents: EventLike[] = [...initialEvents, ...initialInvites];

  return (
    <View style={styles.container}>
      <Header 
        title="Calendar"
        action={null}
        actionLabel="" 
      />
      
      <View style={styles.content}>
        <CalendarView events={allEvents} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
}); 