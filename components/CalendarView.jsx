import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { useTheme } from './ThemeProvider';

/**
 * CalendarView component for displaying events in a calendar format
 * @param {Object} props
 * @param {Array} props.events - List of events to display
 * @param {Function} props.onOpenEvent - Function to call when an event is opened
 * @param {Function} props.onRespond - Function to call when responding to an event
 * @param {Function} props.onRefresh - Function to call when the list is pulled to refresh
 * @param {boolean} props.refreshing - Whether the list is currently refreshing
 */
const CalendarView = ({ 
  events = [], 
  onOpenEvent,
  onRespond,
  onRefresh,
  refreshing = false,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventsModal, setShowEventsModal] = useState(false);
  
  // Get the first and last day of the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days in the current month
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  // Handle day press
  const handleDayPress = (date) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length > 0) {
      setSelectedDate(date);
      setShowEventsModal(true);
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.calendarCard}>
        <View style={styles.header}>
          <Button 
            variant="icon" 
            icon={<ChevronLeft size={20} color={colors.textSecondary} />} 
            onPress={goToPreviousMonth}
          />
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {format(currentDate, 'MMMM yyyy')}
          </Text>
          <Button 
            variant="icon" 
            icon={<ChevronRight size={20} color={colors.textSecondary} />} 
            onPress={goToNextMonth}
          />
        </View>
        
        <View style={styles.daysGrid}>
          {/* Days of the week header */}
          {daysOfWeek.map((day, i) => (
            <View key={`header-${i}`} style={styles.dayHeaderCell}>
              <Text style={[styles.dayHeaderText, { color: colors.textSecondary }]}>{day}</Text>
            </View>
          ))}
          
          {/* Calendar days */}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <TouchableOpacity 
                key={`day-${format(day, 'yyyy-MM-dd')}`} 
                style={[
                  styles.dayCell,
                  !isSameMonth(day, currentDate) && styles.otherMonthDay,
                  isToday(day) && styles.today,
                  hasEvents && styles.eventDay
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[
                  styles.dayText,
                  !isSameMonth(day, currentDate) && styles.otherMonthText,
                  isToday(day) && styles.todayText,
                  hasEvents && styles.eventDayText
                ]}>
                  {format(day, 'd')}
                </Text>
                {hasEvents && (
                  <View style={[styles.eventDot, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Events Modal */}
      <Modal
        isVisible={showEventsModal}
        onClose={() => setShowEventsModal(false)}
        title={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
      >
        <View style={styles.eventsList}>
          {selectedDate && getEventsForDay(selectedDate).map((event) => (
            <TouchableOpacity
              key={event.$id}
              style={[styles.eventItem, { borderLeftColor: colors.primary }]}
              onPress={() => {
                setShowEventsModal(false);
                onOpenEvent(event);
              }}
            >
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
                {event.attendanceStatus && (
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: event.attendanceStatus === 'confirmed' ? colors.success : colors.warning }
                  ]}>
                    <Text style={styles.statusText}>
                      {event.attendanceStatus === 'confirmed' ? 'Attending' : 'Pending'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.eventInfo}>
                <View style={styles.eventInfoRow}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={[styles.eventInfoText, { color: colors.textSecondary }]}>
                    {format(parseISO(event.date), 'MMMM d, yyyy')}
                  </Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={[styles.eventInfoText, { color: colors.textSecondary }]}>
                    {event.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayHeaderCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  today: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  eventDay: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  otherMonthText: {
    color: '#9ca3af',
  },
  todayText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  eventDayText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  eventsList: {
    padding: 16,
  },
  eventItem: {
    backgroundColor: '#f9fafb',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  eventInfo: {
    gap: 4,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventInfoText: {
    fontSize: 14,
  },
});

export default CalendarView; 