import Constants from 'expo-constants';

// Get the extra configuration from app.config.js
const { extra = {} } = Constants.expoConfig || {};

// Environment variables
export const ENV = {
  // Appwrite configuration
  APPWRITE_ENDPOINT: extra.APPWRITE_ENDPOINT || process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://appwrite.adntgv.com/v1',
  APPWRITE_PROJECT_ID: extra.APPWRITE_PROJECT_ID || process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '67be273b00380449cff1',
  DATABASE_ID: extra.DATABASE_ID || process.env.EXPO_PUBLIC_DATABASE_ID || '67be2835003c542ca773',
  APPWRITE_API_KEY: extra.APPWRITE_API_KEY || process.env.EXPO_PUBLIC_APPWRITE_API_KEY || 'standard_df8d69847f90013bb64aa168a41496606244b06cd9db6afc685081909702b2cd20ba7bf55caf2b6d1c62b3c1620a18aeaeb18b1d566d795a78a7ebf90d91027df98d586c73ad8264182fba1c57a22e735b003e12b9adf562b09c36960d3368b6133f36cbe9dff9674762ea7dfcd101d5a3d02ad3379d374fa574e8cd5dfe79e4',
  // App configuration
  APP_URL: extra.APP_URL || process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
  
  // Environment
  APP_ENV: extra.appEnv || process.env.APP_ENV || 'development',
  
  // Determine if we're in development
  isDevelopment: (extra.appEnv || process.env.APP_ENV || 'development') === 'development',
  isProduction: (extra.appEnv || process.env.APP_ENV || 'development') === 'production',
};

export default ENV; 