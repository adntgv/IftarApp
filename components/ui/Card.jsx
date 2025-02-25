import React from 'react';
import { View, TouchableOpacity } from 'react-native';

/**
 * A reusable Card component that can be clickable
 */
const Card = ({ 
  children, 
  onClick, 
  onPress,
  borderColor = '#3b82f6', 
  style = {},
  animate = '' 
}) => {
  // Handle either onClick or onPress (React Native)
  const handlePress = onPress || onClick;
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      disabled={!handlePress}
      activeOpacity={handlePress ? 0.7 : 1}
    >
      <View style={[
        {
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          borderLeftWidth: 4,
          borderLeftColor: borderColor,
        },
        style
      ]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default Card; 