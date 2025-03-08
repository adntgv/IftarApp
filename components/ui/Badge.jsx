import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../ThemeProvider';

// Create styles using a function pattern
const createStyles = () => StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});

/**
 * Badge component with theming
 */
const Badge = ({ 
  text, 
  variant = 'primary', 
  size = 'medium',
  style,
  textStyle,
  pulseOnMount = false,
  outlined = false,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const typography = theme.typography;
  
  // Create styles with theme values
  const styles = createStyles();
  
  // Animation values
  const [scaleAnim] = React.useState(new Animated.Value(1));
  
  // Pulse animation when component mounts
  React.useEffect(() => {
    if (pulseOnMount) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);
  
  // Variant colors
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      case 'neutral':
        return colors.textSecondary;
      case 'primary':
      default:
        return colors.primary;
    }
  };
  
  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: spacing.spacing.xs / 2,
      paddingHorizontal: spacing.spacing.xs,
      fontSize: typography.fontSize.xs,
      borderRadius: spacing.borderRadius.sm,
    },
    medium: {
      paddingVertical: spacing.spacing.xs,
      paddingHorizontal: spacing.spacing.sm,
      fontSize: typography.fontSize.sm,
      borderRadius: spacing.borderRadius.md,
    },
    large: {
      paddingVertical: spacing.spacing.sm,
      paddingHorizontal: spacing.spacing.md,
      fontSize: typography.fontSize.base,
      borderRadius: spacing.borderRadius.lg,
    },
  };
  
  const selectedSize = sizeStyles[size];
  const variantColor = getVariantColor();
  
  const badgeStyles = [
    styles.badge,
    {
      backgroundColor: outlined ? 'transparent' : variantColor,
      borderWidth: outlined ? 1 : 0,
      borderColor: variantColor,
      paddingVertical: selectedSize.paddingVertical,
      paddingHorizontal: selectedSize.paddingHorizontal,
      borderRadius: selectedSize.borderRadius,
    },
    style,
  ];
  
  const textStyles = [
    styles.text,
    {
      color: outlined ? variantColor : '#ffffff',
      fontSize: selectedSize.fontSize,
      fontFamily: typography.fontFamily.medium,
    },
    textStyle,
  ];
  
  return (
    <Animated.View
      style={[
        ...badgeStyles,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={textStyles}>
        {text}
      </Text>
    </Animated.View>
  );
};

export default Badge; 