/**
 * Animation system for the application
 * Provides consistent animation presets and values throughout the app
 */

import { Animated, Easing } from 'react-native';

// Duration values in milliseconds
const duration = {
  fastest: 150,
  fast: 250,
  normal: 350,
  slow: 500,
  slowest: 750,
};

// Easing functions
const easing = {
  standard: Easing.bezier(0.4, 0, 0.2, 1), // Material Design standard
  accelerate: Easing.bezier(0.4, 0, 1, 1), // Accelerate
  decelerate: Easing.bezier(0, 0, 0.2, 1), // Decelerate
  sharp: Easing.bezier(0.4, 0, 0.6, 1), // Sharp
  bounce: Easing.bounce, // Bounce
  elastic: Easing.elastic(1), // Elastic
};

// Animation presets
const presets = {
  // Fade animations
  fadeIn: (
    value: Animated.Value, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: 1,
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  fadeOut: (
    value: Animated.Value, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: 0,
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  
  // Scale animations
  scaleIn: (
    value: Animated.Value, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: 1,
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  scaleOut: (
    value: Animated.Value, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: 0,
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  
  // Slide animations
  slideInLeft: (
    value: Animated.ValueXY, 
    distance: number = 100, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: { x: 0, y: 0 },
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  slideOutLeft: (
    value: Animated.ValueXY, 
    distance: number = 100, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: { x: -distance, y: 0 },
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  slideInRight: (
    value: Animated.ValueXY, 
    distance: number = 100, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: { x: 0, y: 0 },
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  slideOutRight: (
    value: Animated.ValueXY, 
    distance: number = 100, 
    durationTime: number = duration.normal, 
    easingFunction: (value: number) => number = easing.standard
  ) => {
    return Animated.timing(value, {
      toValue: { x: distance, y: 0 },
      duration: durationTime,
      easing: easingFunction,
      useNativeDriver: true,
    });
  },
  
  // Special effects
  pulse: (
    value: Animated.Value, 
    durationTime: number = duration.normal
  ) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1.05,
        duration: durationTime / 2,
        easing: easing.standard,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: durationTime / 2,
        easing: easing.standard,
        useNativeDriver: true,
      }),
    ]);
  },
  shake: (
    value: Animated.Value, 
    durationTime: number = duration.normal
  ) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 10,
        duration: durationTime / 5,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: -10, 
        duration: durationTime / 5,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 5,
        duration: durationTime / 5,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: -5,
        duration: durationTime / 5,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: durationTime / 5,
        useNativeDriver: true,
      }),
    ]);
  },
};

// Helper function to create an animated value
const createValue = (initialValue: number = 0): Animated.Value => new Animated.Value(initialValue);

// Helper function to create an animated ValueXY
const createValueXY = (initialValueX: number = 0, initialValueY: number = 0): Animated.ValueXY => {
  return new Animated.ValueXY({ x: initialValueX, y: initialValueY });
};

export const Animations = {
  duration,
  easing,
  presets,
  createValue,
  createValueXY,
};

export default Animations; 