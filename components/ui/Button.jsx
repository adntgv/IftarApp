import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../ThemeProvider';

/**
 * Enhanced Button component with animation, haptic feedback, and theming
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
  elevation = 'none',
  animateOnPress = true,
  children,
}) => {
  // Access theme
  const { theme } = useTheme();
  const { colors, spacing, typography, animations } = theme || {};

  // Animation scale value
  const [scaleValue] = React.useState(new Animated.Value(1));
  
  // Scale animation on press
  const handlePressIn = () => {
    if (animateOnPress && !disabled) {
      Animated.timing(scaleValue, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (animateOnPress && !disabled) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  // Haptic feedback
  const handlePress = () => {
    if (disabled || loading) return;
    
    // Only use haptics on native platforms (iOS/Android), not on web
    if (hapticFeedback && Platform.OS !== 'web') {
      switch (variant) {
        case 'primary':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'secondary':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        default:
          Haptics.selectionAsync();
          break;
      }
    }
    
    onPress?.();
  };
  
  // Ensure spacing is available before using it
  if (!spacing || !colors || !typography) {
    // Fallback styles if theme is not available
    return (
      <TouchableOpacity 
        style={[{ padding: 12, backgroundColor: '#1890ff', borderRadius: 6 }, style]} 
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: '#ffffff', fontSize: 16 }}>{title || children}</Text>
        )}
      </TouchableOpacity>
    );
  }
  
  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: spacing.spacing?.xs || 4,
      paddingHorizontal: spacing.spacing?.sm || 8,
      fontSize: typography.fontSize?.sm || 14,
    },
    medium: {
      paddingVertical: spacing.spacing?.sm || 8,
      paddingHorizontal: spacing.spacing?.md || 16,
      fontSize: typography.fontSize?.base || 16,
    },
    large: {
      paddingVertical: spacing.spacing?.md || 12,
      paddingHorizontal: spacing.spacing?.lg || 20,
      fontSize: typography.fontSize?.lg || 18,
    },
  };

  // Variant styles with defaults
  const defaultPrimary = {
    backgroundColor: colors?.primary || '#1890ff',
    borderColor: colors?.primary || '#1890ff',
    color: '#ffffff',
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.primary || '#1890ff'),
      borderColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.primary || '#1890ff'),
      color: disabled ? (colors?.textTertiary || '#8c8c8c') : '#ffffff',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: disabled ? (colors?.textTertiary || '#8c8c8c') : (colors?.primary || '#1890ff'),
      borderWidth: 1,
      color: disabled ? (colors?.textTertiary || '#8c8c8c') : (colors?.primary || '#1890ff'),
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: disabled ? (colors?.border || '#e8e8e8') : (colors?.border || '#e8e8e8'),
      borderWidth: 1,
      color: disabled ? (colors?.textTertiary || '#8c8c8c') : (colors?.text || '#262626'),
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? (colors?.textTertiary || '#8c8c8c') : (colors?.primary || '#1890ff'),
    },
    danger: {
      backgroundColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.error || '#f5222d'),
      borderColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.error || '#f5222d'),
      color: '#ffffff',
    },
    success: {
      backgroundColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.success || '#52c41a'),
      borderColor: disabled ? (colors?.backgroundTertiary || '#f5f5f5') : (colors?.success || '#52c41a'),
      color: '#ffffff',
    },
    icon: {
      backgroundColor: 'transparent',
      color: colors?.icon || '#8c8c8c',
      padding: spacing.spacing?.xs || 4,
    },
  };

  // Get the current variant style or default to primary if not found
  const currentVariantStyle = variantStyles[variant] || variantStyles.primary;

  // Dynamic styles based on props
  const buttonStyles = [
    styles.button,
    {
      paddingVertical: sizeStyles[size]?.paddingVertical || sizeStyles.medium.paddingVertical,
      paddingHorizontal: sizeStyles[size]?.paddingHorizontal || sizeStyles.medium.paddingHorizontal,
      backgroundColor: currentVariantStyle.backgroundColor,
      borderColor: currentVariantStyle.borderColor,
      borderWidth: currentVariantStyle.borderWidth || 0,
      opacity: disabled ? 0.6 : 1,
      ...(elevation !== 'none' && spacing.elevation && spacing.elevation[elevation] || {}),
      width: fullWidth ? '100%' : undefined,
    },
    variant !== 'icon' && styles.buttonRadius,
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: currentVariantStyle.color,
      fontSize: sizeStyles[size]?.fontSize || sizeStyles.medium.fontSize,
      fontFamily: typography.fontFamily.medium,
    },
    textStyle,
  ];

  // Render loading state
  if (loading) {
    return (
      <View style={buttonStyles}>
        <ActivityIndicator 
          size="small" 
          color={currentVariantStyle.color} 
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: (pressed && !animateOnPress && !disabled) ? 0.85 : 1 }
      ]}
    >
      <Animated.View 
        style={[
          ...buttonStyles, 
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {icon && (title ? (
          <>
            {iconPosition === 'left' && (
              <View style={styles.iconLeft}>
                {icon}
              </View>
            )}
            <Text style={textStyles}>{title}</Text>
            {iconPosition === 'right' && (
              <View style={styles.iconRight}>
                {icon}
              </View>
            )}
          </>
        ) : (
          <View>{icon}</View>
        ))}
        {typeof children === 'string' ? (
          <Text style={textStyles}>{children}</Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRadius: {
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 