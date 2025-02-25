import React from 'react';
import { View, Text } from 'react-native';

/**
 * A Badge component for displaying status
 */
const Badge = ({ status, text, style = {} }) => {
  const colors = {
    confirmed: {
      bg: '#dcfce7',
      text: '#16a34a'
    },
    declined: {
      bg: '#fee2e2',
      text: '#dc2626'
    },
    pending: {
      bg: '#fef9c3',
      text: '#ca8a04'
    }
  };
  
  const statusColors = colors[status] || colors.pending;
  
  return (
    <View style={[
      {
        backgroundColor: statusColors.bg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
      },
      style
    ]}><Text style={{
        color: statusColors.text,
        fontSize: 12,
        fontWeight: '500',
      }}>
        {text || status}
      </Text>
    </View>
  );
};

export default Badge; 