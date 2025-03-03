import React from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { Check } from 'lucide-react-native';
import Input from './ui/Input';
import Button from './ui/Button';

/**
 * CreateEventForm component for creating new events
 */
const CreateEventForm = ({ 
  newEvent, 
  onChangeEvent, 
  onSubmit, 
  onCancel,
  loading = false
}) => {
  // Handle input changes
  const handleChange = (field, value) => {
    onChangeEvent?.({ ...newEvent, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Iftar Event</Text>
      
      <Input
        label="Event Title"
        value={newEvent.title}
        onChangeText={(text) => handleChange('title', text)}
        placeholder="Family Iftar Dinner"
        required
        editable={!loading}
      />
      
      <View style={styles.dateTimeContainer}>
        <Input
          label="Date"
          type="date"
          value={newEvent.date}
          onChangeText={(text) => handleChange('date', text)}
          required
          style={styles.dateInput}
          editable={!loading}
        />
        <Input
          label="Time"
          type="time"
          value={newEvent.time}
          onChangeText={(text) => handleChange('time', text)}
          required
          style={styles.timeInput}
          editable={!loading}
        />
      </View>
      
      <Input
        label="Location"
        value={newEvent.location}
        onChangeText={(text) => handleChange('location', text)}
        placeholder="123 Main Street"
        required
        editable={!loading}
      />
      
      <Input
        label="Description"
        type="textarea"
        value={newEvent.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Join us for a special iftar meal..."
        editable={!loading}
      />
      
      <View style={styles.switchContainer}>
        <Switch
          value={newEvent.isPublic}
          onValueChange={(value) => handleChange('isPublic', value)}
          trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
          thumbColor={newEvent.isPublic ? '#3b82f6' : '#f4f4f5'}
          disabled={loading}
        />
        <Text style={styles.switchLabel}>
          Make event publicly viewable (anyone with the link can see details)
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          variant="secondary"
          onPress={onCancel}
          style={styles.cancelButton}
          title="Cancel"
          disabled={loading}
        />
        <Button 
          variant="primary"
          icon={loading ? <ActivityIndicator size="small" color="white" /> : <Check size={18} color="white" />}
          onPress={onSubmit}
          disabled={loading || !newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location}
          style={styles.createButton}
          title={loading ? "Creating..." : "Create Event"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateInput: {
    flex: 0.48,
  },
  timeInput: {
    flex: 0.48,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 8,
  },
  createButton: {},
});

export default CreateEventForm; 