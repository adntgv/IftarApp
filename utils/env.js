import Constants from 'expo-constants';

// Get the extra configuration from app.config.js
const { extra = {} } = Constants.expoConfig || {};

// Environment variables
export const ENV = {
  // Appwrite configuration
  APPWRITE_ENDPOINT: extra.APPWRITE_ENDPOINT || process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://appwrite.adntgv.com/v1',
  APPWRITE_PROJECT_ID: extra.APPWRITE_PROJECT_ID || process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '67be273b00380449cff1',
  DATABASE_ID: extra.DATABASE_ID || process.env.EXPO_PUBLIC_DATABASE_ID || '67be2835003c542ca773',
  
  // App configuration
  APP_URL: extra.APP_URL || process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
  
  // Environment
  APP_ENV: extra.appEnv || process.env.APP_ENV || 'development',
  
  // Determine if we're in development
  isDevelopment: (extra.appEnv || process.env.APP_ENV || 'development') === 'development',
  isProduction: (extra.appEnv || process.env.APP_ENV || 'development') === 'production',
};

export default ENV; 