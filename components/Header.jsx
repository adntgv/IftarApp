import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Moon, Menu, Search } from 'lucide-react-native';
import Button from './ui/Button';
import { useTheme } from './ThemeProvider';

/**
 * Enhanced Header component for the top bar of the app with animations and theme support
 * @param {object} props
 * @param {string} props.title - The title to display
 * @param {Function|null} [props.action=null] - Optional action for the right button
 * @param {string} [props.actionLabel=''] - Label for the action button
 * @param {boolean} [props.showMenu=false] - Whether to show the menu button
 * @param {Function} [props.onMenuPress=()=>{}] - Function to call when menu is pressed
 * @param {boolean} [props.showSearch=false] - Whether to show the search button
 * @param {Function} [props.onSearchPress=()=>{}] - Function to call when search is pressed
 * @param {string} [props.viewMode='card'] - Current view mode (card, list, or calendar)
 */
const Header = ({ 
  title, 
  action = null, 
  actionLabel = '', 
  showMenu = false,
  onMenuPress = () => {},
  showSearch = false,
  onSearchPress = () => {},
  viewMode = 'card',
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, animations } = theme;
  
  // Animation for the title
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(10)).current;
  
  // Animation for the icon
  const iconRotate = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate title and icon when component mounts
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: animations.easing.emphasize,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: animations.easing.emphasize,
      }),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: animations.easing.emphasize,
      })
    ]).start();
  }, []);
  
  // Interpolate the rotation animation
  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView 
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }
      ]}
    >
      <View 
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingHorizontal: spacing.layout.screenPadding,
            paddingVertical: spacing.spacing.md,
          }
        ]}
      >
        <View style={styles.left}>
          {showMenu && (
            <Button 
              variant="icon" 
              icon={<Menu size={24} color={colors.textPrimary} />} 
              onPress={onMenuPress} 
              style={styles.menuButton}
            />
          )}
          
          <View style={styles.titleContainer}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.primaryLighter,
                  transform: [{ rotate: spin }],
                }
              ]}
            >
              <Moon size={22} color={colors.primary} />
            </Animated.View>
            
            <Animated.Text 
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.fontFamily.bold,
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                }
              ]}
            >
              {title}
            </Animated.Text>
          </View>
        </View>
        
        <View style={styles.right}>
          {showSearch && (
            <Button 
              variant="icon" 
              icon={<Search size={20} color={colors.textSecondary} />} 
              onPress={onSearchPress} 
              style={styles.actionButton}
            />
          )}
          
          {action && (
            <Button 
              variant="link" 
              onPress={action}
              style={{
                color: colors.primary,
                fontFamily: typography.fontFamily.medium,
              }}
            >
              {actionLabel || (viewMode === 'card' ? 'List View' : viewMode === 'list' ? 'Calendar View' : 'Card View')}
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  menuButton: {
    marginRight: 12,
  },
  actionButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
  },
});

export default Header; 