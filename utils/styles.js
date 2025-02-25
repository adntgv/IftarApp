import { Platform } from 'react-native';

/**
 * Creates shadow styles that work across platforms (iOS, Android, Web)
 * @param {Object} options - Shadow options
 * @param {string} options.color - Shadow color (hex/rgba)
 * @param {number} options.opacity - Shadow opacity (0-1)
 * @param {number} options.radius - Shadow blur radius
 * @param {number} options.offsetX - Shadow horizontal offset
 * @param {number} options.offsetY - Shadow vertical offset
 * @param {number} options.elevation - Android elevation value
 * @returns {Object} Platform-specific shadow styles
 */
export const createShadow = ({
  color = '#000',
  opacity = 0.1,
  radius = 4,
  offsetX = 0,
  offsetY = 2,
  elevation = 2
} = {}) => {
  if (Platform.OS === 'web') {
    // Web shadow style
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`
    };
  } else if (Platform.OS === 'ios') {
    // iOS shadow style
    return {
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius
    };
  } else {
    // Android shadow style (using elevation)
    return {
      elevation,
      shadowColor: color,
    };
  }
};

/**
 * Common styles used throughout the app
 */
export const commonStyles = {
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    ...createShadow()
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  section: {
    marginBottom: 24
  }
}; 