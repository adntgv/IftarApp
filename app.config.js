module.exports = ({ config }) => {
  // Set the environment based on the release channel
  const env = process.env.APP_ENV || 'development';

  // Get env vars
  const appwriteEndpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const appwriteProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID;

  // Default configuration (development)
  const envConfig = {
    development: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'http://localhost:8081',
    },
    staging: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'https://staging.iftarapp.com',
    },
    production: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'https://iftarapp.com',
    },
  };

  // Export the configuration for the current environment
  return {
    ...config,
    name: env === 'production' ? 'Iftar App' : `Iftar App (${env})`,
    version: '1.0.0',
    extra: {
      ...envConfig[env],
      appEnv: env,
      eas: {
        projectId: 'your-eas-project-id',
      },
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    plugins: [
      [
        'expo-router',
        {
          origin: 'https://iftarapp.com',
        },
      ],
    ],
  };
}; 