import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Pressable 
} from 'react-native';
import { useTheme } from '../ThemeProvider';

/**
 * Card component with theming and animation support
 */
const Card = ({ 
  children, 
  style, 
  onPress, 
  borderColor,
  elevation = 'sm',
  animate = true,
  padding = true,
  borderRadius = 'md',
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  
  // Animation values
  const [scaleValue] = React.useState(new Animated.Value(1));
  const [shadowOpacity] = React.useState(new Animated.Value(1));
  
  // Handle press animations
  const handlePressIn = () => {
    if (animate && onPress) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.98,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacity, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  const handlePressOut = () => {
    if (animate && onPress) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  // Card styles
  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius[borderRadius],
      borderColor: borderColor || colors.borderLight,
      borderWidth: borderColor ? 1 : 0,
      ...(padding && { padding: spacing.spacing.md }),
      ...spacing.elevation[elevation],
    },
    style,
  ];
  
  // If no onPress, render as a simple View
  if (!onPress) {
    return <View style={cardStyles}>{children}</View>;
  }
  
  // With onPress handler, render as touchable with animation
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        { opacity: (pressed && !animate) ? 0.9 : 1 }
      ]}
    >
      <Animated.View
        style={[
          ...cardStyles,
          {
            transform: [{ scale: scaleValue }],
            shadowOpacity: Animated.multiply(
              shadowOpacity,
              new Animated.Value(spacing.elevation[elevation].shadowOpacity || 0.1)
            ),
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card; 