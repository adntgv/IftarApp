import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../ThemeProvider';

/**
 * ErrorOverlay component for displaying application errors
 * @param {Object} props
 * @param {boolean} props.visible - Whether the overlay is visible
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Function to call when retry button is pressed
 * @param {Function} props.onDismiss - Function to call when dismissing the error
 */
const ErrorOverlay = ({ 
  visible = false, 
  message = 'Something went wrong', 
  onRetry, 
  onDismiss 
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  
  if (!visible) return null;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.overlay, { backgroundColor: colors.errorBackground || 'rgba(239, 68, 68, 0.9)' }]}>
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.errorBackgroundDarker || 'rgba(220, 38, 38, 0.8)' }]}>
            <AlertTriangle size={32} color="#fff" />
          </View>
          
          <Text style={[styles.title, { 
            color: colors.white || '#fff',
            fontFamily: typography.fontFamily.bold
          }]}>
            Error
          </Text>
          
          <Text style={[styles.message, { 
            color: colors.white || '#fff',
            fontFamily: typography.fontFamily.regular
          }]}>
            {message}
          </Text>
          
          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity 
                style={[styles.button, styles.retryButton, { backgroundColor: colors.white || '#fff' }]} 
                onPress={onRetry}
              >
                <RefreshCw size={16} color={colors.error || '#ef4444'} style={styles.buttonIcon} />
                <Text style={[styles.buttonText, { 
                  color: colors.error || '#ef4444',
                  fontFamily: typography.fontFamily.medium
                }]}>
                  Retry
                </Text>
              </TouchableOpacity>
            )}
            
            {onDismiss && (
              <TouchableOpacity 
                style={[styles.button, styles.dismissButton]} 
                onPress={onDismiss}
              >
                <Text style={[styles.buttonText, styles.dismissText, { 
                  color: colors.white || '#fff',
                  fontFamily: typography.fontFamily.medium
                }]}>
                  Dismiss
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  retryButton: {
    backgroundColor: '#fff',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dismissText: {
    color: '#fff',
  },
  buttonIcon: {
    marginRight: 8,
  }
});

export default ErrorOverlay; 