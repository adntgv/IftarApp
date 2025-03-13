module.exports = ({ config }) => {
  // Set the environment based on the release channel
  const env = process.env.APP_ENV || 'development';

  // Get env vars
  const appwriteEndpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const appwriteProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID;
  const appwriteApiKey = process.env.EXPO_PUBLIC_APPWRITE_API_KEY;
  // Default configuration (development)
  const envConfig = {
    development: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'http://localhost:8081',
      APPWRITE_API_KEY: appwriteApiKey || 'standard_df8d69847f90013bb64aa168a41496606244b06cd9db6afc685081909702b2cd20ba7bf55caf2b6d1c62b3c1620a18aeaeb18b1d566d795a78a7ebf90d91027df98d586c73ad8264182fba1c57a22e735b003e12b9adf562b09c36960d3368b6133f36cbe9dff9674762ea7dfcd101d5a3d02ad3379d374fa574e8cd5dfe79e4'
    },
    staging: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'https://staging.iftarapp.com',
      APPWRITE_API_KEY: appwriteApiKey || 'standard_df8d69847f90013bb64aa168a41496606244b06cd9db6afc685081909702b2cd20ba7bf55caf2b6d1c62b3c1620a18aeaeb18b1d566d795a78a7ebf90d91027df98d586c73ad8264182fba1c57a22e735b003e12b9adf562b09c36960d3368b6133f36cbe9dff9674762ea7dfcd101d5a3d02ad3379d374fa574e8cd5dfe79e4'
    },
    production: {
      APPWRITE_ENDPOINT: appwriteEndpoint || 'https://appwrite.adntgv.com/v1',
      APPWRITE_PROJECT_ID: appwriteProjectId || '67be273b00380449cff1',
      DATABASE_ID: databaseId || '67be2835003c542ca773',
      APP_URL: 'https://iftarapp.com',
      APPWRITE_API_KEY: appwriteApiKey || 'standard_df8d69847f90013bb64aa168a41496606244b06cd9db6afc685081909702b2cd20ba7bf55caf2b6d1c62b3c1620a18aeaeb18b1d566d795a78a7ebf90d91027df98d586c73ad8264182fba1c57a22e735b003e12b9adf562b09c36960d3368b6133f36cbe9dff9674762ea7dfcd101d5a3d02ad3379d374fa574e8cd5dfe79e4'
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
        projectId: '880abff3-65d8-48a7-b468-fa0e9c74a547',
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