import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, Pressable, Platform } from 'react-native';
import { Home, Bell, Plus, Calendar, User } from 'lucide-react-native';
import Button from './ui/Button';
import { useTheme } from './ThemeProvider';

/**
 * Enhanced Navigation component for the bottom tab bar with animations and theme support
 */
const Navigation = ({ activeTab, onChangeTab }) => {
  const { theme } = useTheme();
  const { colors, spacing, animations } = theme;
  
  // Animation for the create button
  const scaleAnim = new Animated.Value(1);
  
  // Pulse animation effect for the create button
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
        easing: animations.easing.bounce,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: animations.easing.bounce,
      })
    ]);
    
    // Only play the animation once when component mounts
    pulseAnimation.start();
    
    return () => {
      pulseAnimation.stop();
    };
  }, []);

  // Get icon color based on active status
  const getIconColor = (tabName) => {
    return activeTab === tabName ? colors.primary : colors.textTertiary;
  };
  
  // Get background style for active tab
  const getTabStyle = (tabName) => {
    if (activeTab === tabName) {
      return {
        backgroundColor: colors.primaryLighter,
        borderRadius: spacing.borderRadius.full,
      };
    }
    return {};
  };

  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        { 
          backgroundColor: colors.background,
          borderTopColor: colors.border 
        }
      ]}
    >
      <View 
        style={[
          styles.container,
          { 
            backgroundColor: colors.background,
            paddingVertical: spacing.spacing.sm 
          }
        ]}
      >
        <Button 
          variant="icon" 
          icon={<Home size={24} color={getIconColor('home')} />} 
          onPress={() => onChangeTab('home')} 
          style={getTabStyle('home')}
        />
        <Button 
          variant="icon" 
          icon={<Bell size={24} color={getIconColor('invites')} />} 
          onPress={() => onChangeTab('invites')} 
          style={getTabStyle('invites')}
        />
        <Animated.View 
          style={{ 
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Button 
            variant="primary" 
            icon={<Plus size={24} color={colors.white} />} 
            onPress={() => onChangeTab('create')} 
            style={[
              styles.createButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              }
            ]}
          />
        </Animated.View>
        <Button 
          variant="icon" 
          icon={<Calendar size={24} color={getIconColor('calendar')} />} 
          onPress={() => onChangeTab('calendar')} 
          style={getTabStyle('calendar')}
        />
        <Button 
          variant="icon" 
          icon={<User size={24} color={getIconColor('profile')} />} 
          onPress={() => onChangeTab('profile')} 
          style={getTabStyle('profile')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderTopWidth: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 5px rgba(59, 130, 246, 0.3)' }
      : {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        }
    ),
  },
});

export default Navigation; 