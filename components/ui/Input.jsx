import React from 'react';
import { View, TextInput, Text } from 'react-native';

/**
 * A reusable Input component that supports text inputs and textareas
 */
const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  onChangeText,
  placeholder, 
  required = false,
  style = {}
}) => {
  // Handle either onChange or onChangeText (React Native)
  const handleChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
    } else if (onChange) {
      onChange({ target: { value: text } });
    }
  };

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text style={{ 
          marginBottom: 4, 
          fontSize: 14, 
          fontWeight: '500', 
          color: '#374151' 
        }}>
          {label}
          {required && <Text style={{ color: 'red' }}> *</Text>}
        </Text>
      )}
      
      {type === 'textarea' ? (
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          multiline
          numberOfLines={3}
          style={{
            width: '100%',
            padding: 8,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            fontSize: 16,
            color: '#374151',
            textAlignVertical: 'top'
          }}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          secureTextEntry={type === 'password'}
          keyboardType={
            type === 'email' ? 'email-address' : 
            type === 'number' ? 'numeric' : 
            'default'
          }
          style={{
            width: '100%',
            padding: 8,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            fontSize: 16,
            color: '#374151'
          }}
        />
      )}
    </View>
  );
};

export default Input; 