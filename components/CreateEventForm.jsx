import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Check, Calendar, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isValid, isAfter, startOfDay, parse } from 'date-fns';
import Input from './ui/Input';
import Button from './ui/Button';
import { useTheme } from './ThemeProvider';

// Import CSS for web styling
if (Platform.OS === 'web') {
  import('./CreateEventForm.css');
}

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
  const { theme } = useTheme();
  const { colors } = theme;
  
  // State for date time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  
  // Check if we're on web platform
  const isWeb = Platform.OS === 'web';
  
  // Check if browser supports date input (for web fallback)
  const [supportsDateInput, setSupportsDateInput] = useState(true);
  const [supportsTimeInput, setSupportsTimeInput] = useState(true);
  
  // Check browser support for date/time inputs on mount (web only)
  useEffect(() => {
    if (isWeb) {
      // Test for date input support
      const input = document.createElement('input');
      input.setAttribute('type', 'date');
      const notADateValue = 'not-a-date';
      input.setAttribute('value', notADateValue);
      setSupportsDateInput(input.value !== notADateValue);
      
      // Test for time input support
      input.setAttribute('type', 'time');
      const notATimeValue = 'not-a-time';
      input.setAttribute('value', notATimeValue);
      setSupportsTimeInput(input.value !== notATimeValue);
    }
  }, [isWeb]);

  // Parse date and time from string representations
  const parseEventDate = () => {
    if (!newEvent.date) return new Date();
    const parsed = new Date(newEvent.date);
    return isValid(parsed) ? parsed : new Date();
  };

  const parseEventTime = () => {
    if (!newEvent.time) return new Date();
    
    try {
      // Handle time string (HH:MM format)
      const today = new Date();
      const [hours, minutes] = newEvent.time.split(':');
      today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return today;
    } catch (error) {
      return new Date();
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    // Clear errors when input changes
    if (field === 'date') setDateError('');
    if (field === 'time') setTimeError('');
    
    onChangeEvent?.({ ...newEvent, [field]: value });
  };

  // Handle date change for native platforms
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      // Validate date is not in the past
      const today = startOfDay(new Date());
      
      if (!isAfter(selectedDate, today)) {
        setDateError('Please select a future date');
      } else {
        setDateError('');
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        handleChange('date', formattedDate);
      }
    }
  };

  // Handle time change for native platforms
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedTime) {
      const formattedTime = format(selectedTime, 'HH:mm');
      handleChange('time', formattedTime);
    }
  };
  
  // Handle web date input change
  const handleWebDateChange = (event) => {
    const dateValue = event.target.value;
    
    if (!dateValue) {
      setDateError('Date is required');
      handleChange('date', '');
      return;
    }
    
    try {
      const selectedDate = new Date(dateValue);
      const today = startOfDay(new Date());
      
      if (!isAfter(selectedDate, today)) {
        setDateError('Please select a future date');
      } else {
        setDateError('');
        handleChange('date', dateValue);
      }
    } catch (error) {
      setDateError('Invalid date format');
    }
  };
  
  // Handle web time input change
  const handleWebTimeChange = (event) => {
    const timeValue = event.target.value;
    
    if (!timeValue) {
      setTimeError('Time is required');
      handleChange('time', '');
      return;
    }
    
    handleChange('time', timeValue);
    setTimeError('');
  };

  // Handle web date input change for browsers without native support
  const handleWebDateTextChange = (text) => {
    handleChange('date', text);
    
    if (!text) {
      setDateError('Date is required');
      return;
    }
    
    // Try to parse the date (expecting YYYY-MM-DD format)
    try {
      const parts = text.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        if (isValid(date)) {
          const today = startOfDay(new Date());
          if (!isAfter(date, today)) {
            setDateError('Please select a future date');
          } else {
            setDateError('');
          }
          return;
        }
      }
      setDateError('Please use YYYY-MM-DD format');
    } catch (error) {
      setDateError('Invalid date format');
    }
  };
  
  // Handle web time input change for browsers without native support
  const handleWebTimeTextChange = (text) => {
    handleChange('time', text);
    
    if (!text) {
      setTimeError('Time is required');
      return;
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(text)) {
      setTimeError('Please use HH:MM format');
    } else {
      setTimeError('');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;
    
    // Date validation
    if (!newEvent.date) {
      setDateError('Date is required');
      isValid = false;
    } else {
      const today = startOfDay(new Date());
      const eventDate = new Date(newEvent.date);
      
      if (!isAfter(eventDate, today)) {
        setDateError('Please select a future date');
        isValid = false;
      }
    }
    
    // Time validation
    if (!newEvent.time) {
      setTimeError('Time is required');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle form submission with validation
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  // Render web date time inputs
  const renderWebDateTimeInputs = () => {
    return (
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateInput}>
          <Text style={styles.inputLabel}>Date <Text style={styles.requiredStar}>*</Text></Text>
          {supportsDateInput ? (
            <View style={[styles.webInputContainer, dateError ? styles.inputError : null]}>
              <input
                type="date"
                value={newEvent.date}
                onChange={handleWebDateChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                disabled={loading}
                style={styles.webInput}
                className="date-input"
                placeholder="YYYY-MM-DD"
              />
              <Calendar size={20} color={colors.textSecondary} style={styles.webInputIcon} />
            </View>
          ) : (
            <Input
              value={newEvent.date}
              onChangeText={handleWebDateTextChange}
              placeholder="YYYY-MM-DD"
              error={dateError}
              editable={!loading}
              rightIcon={<Calendar size={20} color={colors.textSecondary} />}
            />
          )}
          {dateError && supportsDateInput ? <Text style={styles.errorText}>{dateError}</Text> : null}
        </View>
        
        <View style={styles.timeInput}>
          <Text style={styles.inputLabel}>Time <Text style={styles.requiredStar}>*</Text></Text>
          {supportsTimeInput ? (
            <View style={[styles.webInputContainer, timeError ? styles.inputError : null]}>
              <input
                type="time"
                value={newEvent.time}
                onChange={handleWebTimeChange}
                disabled={loading}
                style={styles.webInput}
                className="time-input"
                placeholder="HH:MM"
              />
              <Clock size={20} color={colors.textSecondary} style={styles.webInputIcon} />
            </View>
          ) : (
            <Input
              value={newEvent.time}
              onChangeText={handleWebTimeTextChange}
              placeholder="HH:MM"
              error={timeError}
              editable={!loading}
              rightIcon={<Clock size={20} color={colors.textSecondary} />}
            />
          )}
          {timeError && supportsTimeInput ? <Text style={styles.errorText}>{timeError}</Text> : null}
        </View>
      </View>
    );
  };

  // Render native date time inputs
  const renderNativeDateTimeInputs = () => {
    return (
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateInput}>
          <Text style={styles.inputLabel}>Date <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity
            style={[
              styles.dateTimeButton,
              dateError ? styles.inputError : null
            ]}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateTimeText}>
              {newEvent.date ? newEvent.date : 'Select date'}
            </Text>
            <Calendar size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
        </View>
        
        <View style={styles.timeInput}>
          <Text style={styles.inputLabel}>Time <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity
            style={[
              styles.dateTimeButton,
              timeError ? styles.inputError : null
            ]}
            onPress={() => setShowTimePicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateTimeText}>
              {newEvent.time ? newEvent.time : 'Select time'}
            </Text>
            <Clock size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
        </View>
      </View>
    );
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
      
      {isWeb ? renderWebDateTimeInputs() : renderNativeDateTimeInputs()}
      
      {/* Date Picker Modal for native platforms */}
      {!isWeb && showDatePicker && (
        <DateTimePicker
          value={parseEventDate()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {/* Time Picker Modal for native platforms */}
      {!isWeb && showTimePicker && (
        <DateTimePicker
          value={parseEventTime()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
      
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
        multiline={true}
        numberOfLines={4}
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
          onPress={handleSubmit}
          disabled={loading || !newEvent.title || !newEvent.location}
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
    marginBottom: 16,
  },
  dateInput: {
    flex: 0.48,
  },
  timeInput: {
    flex: 0.48,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#ef4444',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  dateTimeText: {
    fontSize: 15,
    color: '#4b5563',
  },
  webInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    height: 42,
    overflow: 'hidden',
  },
  webInput: {
    flex: 1,
    height: '100%',
    width: '100%',
    paddingHorizontal: 12,
    paddingRight: 36, // Space for the icon
    fontSize: 15,
    color: '#4b5563',
    borderWidth: 0,
    outline: 'none',
    backgroundColor: 'transparent',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  webInputIcon: {
    position: 'absolute',
    right: 12,
    pointerEvents: 'none',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
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