import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * A reusable Button component with multiple variants
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  iconPosition = 'left',
  hapticFeedback = true,
  size = 'medium',
}) => {
  // Style configuration
  const sizeStyles = {
    small: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 14,
    },
    medium: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    large: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 18,
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
      color: '#374151',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: '#3b82f6',
      color: '#3b82f6',
    },
    danger: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
      color: '#ffffff',
    },
    success: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: '#ffffff',
    },
    text: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: '#3b82f6',
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    link: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: '#3b82f6',
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
  };

  // Handler with haptic feedback
  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress && onPress();
    }
  };

  // Get the correct styles based on props
  const buttonVariantStyle = variantStyles[variant] || variantStyles.primary;
  const buttonSizeStyle = sizeStyles[size] || sizeStyles.medium;
  
  const buttonStyle = {
    ...styles.button,
    ...buttonVariantStyle,
    ...buttonSizeStyle,
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
    ...(variant !== 'text' && variant !== 'link' && styles.buttonWithBorder),
    ...style,
  };
  
  const buttonTextStyle = {
    ...styles.text,
    color: buttonVariantStyle.color,
    fontSize: buttonSizeStyle.fontSize,
    ...(disabled && styles.disabledText),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
        {title && <Text style={buttonTextStyle}>{title}</Text>}
        {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWithBorder: {
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 