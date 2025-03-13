import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Pressable,
  Platform,
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
  
  // Handle press animations
  const handlePressIn = () => {
    if (animate && onPress) {
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (animate && onPress) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };
  
  // Get shadow styles based on platform
  const getShadowStyle = () => {
    const shadowConfig = spacing.elevation[elevation] || {};
    
    if (Platform.OS === 'web') {
      // Use boxShadow for web
      const { shadowOffset = { width: 0, height: 2 }, shadowRadius = 4, shadowOpacity = 0.1 } = shadowConfig;
      const offsetX = shadowOffset.width;
      const offsetY = shadowOffset.height;
      const blur = shadowRadius;
      const opacity = shadowOpacity;
      
      return {
        boxShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`
      };
    } else {
      // Use native shadow props for iOS/Android
      return shadowConfig;
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
      ...getShadowStyle(),
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