import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Button from './ui/Button';

/**
 * CalendarView component for displaying the calendar
 */
const CalendarView = ({ events = [] }) => {
  // Calendar days of the week
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generate mock days for demo
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Find days with events (for demo we'll highlight specific days)
  const eventDays = [1, 5, 10]; // March 1, 5, 10 from mock
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarCard}>
        <View style={styles.header}>
          <Button variant="icon" icon={<ChevronLeft size={20} color="#6b7280" />} />
          <Text style={styles.monthTitle}>March 2025</Text>
          <Button variant="icon" icon={<ChevronRight size={20} color="#6b7280" />} />
        </View>
        
        <View style={styles.daysGrid}>
          {/* Days of the week header */}
          {daysOfWeek.map((day, i) => (
            <View key={`header-${i}`} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
          
          {/* Calendar days */}
          {days.map((day) => (
            <TouchableOpacity 
              key={`day-${day}`} 
              style={[
                styles.dayCell,
                eventDays.includes(day) && styles.eventDay
              ]}
            >
              <Text style={[
                styles.dayText,
                eventDays.includes(day) && styles.eventDayText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.eventsContainer}>
          <View style={[styles.eventItem, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.eventTitle}>Family Iftar Gathering</Text>
            <Text style={styles.eventInfo}>March 1, 2025 at 18:30</Text>
          </View>
          
          <View style={[styles.eventItem, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.eventTitle}>Community Iftar</Text>
            <Text style={styles.eventInfo}>March 5, 2025 at 18:45</Text>
          </View>
          
          <View style={[styles.eventItem, { borderLeftColor: '#ca8a04' }]}>
            <Text style={styles.eventTitle}>Neighborhood Iftar</Text>
            <Text style={styles.eventInfo}>March 10, 2025 at 18:30</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayHeaderCell: {
    width: '14.28%',
    padding: 8,
    alignItems: 'center',
  },
  dayHeaderText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  dayCell: {
    width: '14.28%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontWeight: '400',
    color: '#1f2937',
  },
  eventDay: {
    backgroundColor: '#eff6ff',
    borderRadius: 9999,
  },
  eventDayText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  eventsContainer: {
    marginTop: 16,
  },
  eventItem: {
    padding: 8,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  eventTitle: {
    fontWeight: '500',
    color: '#1f2937',
  },
  eventInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default CalendarView; 