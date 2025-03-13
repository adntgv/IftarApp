import React, { useEffect, useState } from 'react';
import { 
  View, 
  Modal as RNModal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../ThemeProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Enhanced Modal component with animations and theming
 */
const Modal = ({ 
  isVisible, 
  onClose, 
  children, 
  title,
  animationType = 'slide', // slide, fade, none
  position = 'center', // center, bottom
  closeOnBackdropPress = true,
  showCloseButton = true,
  contentContainerStyle,
  titleStyle,
  backdropOpacity = 0.5,
  maxHeight = SCREEN_HEIGHT * 0.8,
  disableScrolling = false,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  
  // Animation values
  const [backdropAnim] = useState(new Animated.Value(0));
  const [contentAnim] = useState(new Animated.Value(0));
  const [isRendered, setIsRendered] = useState(isVisible);
  
  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      
      // Animate in
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(contentAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        // After animation completes, stop rendering the modal
        setIsRendered(false);
      });
    }
  }, [isVisible]);
  
  // Position-based transforms
  const getPositionStyles = () => {
    if (position === 'bottom') {
      return {
        style: {
          justifyContent: 'flex-end',
        },
        contentTransform: {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0],
          }),
        },
        contentStyle: {
          borderTopLeftRadius: spacing.borderRadius.xl,
          borderTopRightRadius: spacing.borderRadius.xl,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          maxHeight: maxHeight,
          width: '100%',
        },
      };
    }
    
    // Default center position
    return {
      style: {
        justifyContent: 'center',
      },
      contentTransform: {
        scale: contentAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      contentStyle: {
        borderRadius: spacing.borderRadius.lg,
        width: '90%',
        maxHeight: maxHeight,
      },
    };
  };
  
  const positionStyles = getPositionStyles();
  
  if (!isRendered) {
    return null;
  }
  
  return (
    <RNModal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, positionStyles.style]}>
        {/* Backdrop */}
        <Animated.View 
          style={[
            styles.backdrop, 
            { 
              backgroundColor: colors.text, 
              opacity: backdropAnim 
            }
          ]}
        >
          {closeOnBackdropPress && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={onClose}
            />
          )}
        </Animated.View>
        
        {/* Modal Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              backgroundColor: colors.background,
              ...spacing.elevation.md,
            },
            positionStyles.contentStyle,
            { transform: [positionStyles.contentTransform] },
            contentContainerStyle,
          ]}
        >
          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text 
                  style={[
                    styles.title,
                    {
                      color: colors.text,
                      fontFamily: typography.fontFamily.medium,
                      fontSize: typography.fontSize.lg,
                    },
                    titleStyle,
                  ]}
                >
                  {title}
                </Text>
              )}
              
              {showCloseButton && (
                <TouchableOpacity 
                  onPress={onClose} 
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.backgroundSecondary }
                  ]}
                >
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Content area with optional scrolling */}
          {disableScrolling ? (
            <View style={styles.body}>
              {children}
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollViewContent: {
    padding: 16,
  },
  body: {
    padding: 16,
  }
});

export default Modal; 