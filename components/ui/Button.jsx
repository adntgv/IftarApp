import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

/**
 * A reusable Button component with multiple variants
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  onPress,
  disabled, 
  className = '', 
  fullWidth = false,
  style = {}
}) => {
  const baseClasses = "rounded-lg transition-all duration-200 flex items-center justify-center";
  const sizeClasses = icon && !children ? "p-2" : "px-4 py-2";
  const widthClass = fullWidth ? "w-full" : "";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    link: "text-blue-600 hover:underline bg-transparent",
    icon: "text-gray-500 hover:bg-gray-100 rounded-full p-2"
  };

  // Handle either onClick or onPress (React Native)
  const handlePress = onPress || onClick;
  
  return (
    <TouchableOpacity 
      onPress={handlePress} 
      disabled={disabled}
      style={[
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style
      ]}
      activeOpacity={0.7}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: 
          variant === 'primary' ? '#2563eb' : 
          variant === 'success' ? '#16a34a' : 
          variant === 'danger' ? '#dc2626' : 
          variant === 'icon' ? 'transparent' : 
          'transparent',
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: variant === 'secondary' ? '#d1d5db' : 'transparent',
      }}>
        {icon && (
          <View style={{ marginRight: children ? 8 : 0 }}>
            {icon}
          </View>
        )}
        {children && (
          <Text style={{ 
            color: 
              variant === 'primary' || variant === 'success' || variant === 'danger' 
                ? 'white' 
                : variant === 'link' 
                  ? '#2563eb' 
                  : '#374151',
            fontWeight: '500',
          }}>
            {children}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button; 