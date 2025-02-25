import { Client, Account, Databases, ID, Query } from 'appwrite';
import Constants from 'expo-constants';
import ENV from './env';

// Initialize Appwrite Client
const client = new Client();

// Collection IDs
export const USERS_COLLECTION_ID = 'users';
export const EVENTS_COLLECTION_ID = 'events';
export const ATTENDEES_COLLECTION_ID = 'attendees';
export const INVITATIONS_COLLECTION_ID = 'invitations';

// Initialize client
client
  .setEndpoint(ENV.APPWRITE_ENDPOINT)
  .setProject(ENV.APPWRITE_PROJECT_ID);

// Log configuration for debugging
console.log('Appwrite Configuration:', {
  endpoint: ENV.APPWRITE_ENDPOINT,
  projectId: ENV.APPWRITE_PROJECT_ID,
  databaseId: ENV.DATABASE_ID,
});

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Helper Functions
export const createAccount = async (email, password, name) => {
  try {
    console.log('Creating account with:', { email, name });
    
    // Create a user account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create a session (log in)
    await account.createEmailSession(email, password);

    // Get the current account
    const currentUser = await account.get();

    // Try to create a user document in the database
    try {
      console.log('Creating user document with database ID:', ENV.DATABASE_ID);
      const newUser = await databases.createDocument(
        ENV.DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: currentUser.$id,
          email,
          name,
          createdAt: new Date().toISOString(),
        }
      );
      
      return { account: currentUser, user: newUser };
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If we can't create the user document, still return the account
      // so that the user can at least log in
      return { account: currentUser, user: null };
    }
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // Try to delete any existing session first to prevent the 
    // "Creation of a session is prohibited when a session is active" error
    try {
      await account.deleteSession('current');
    } catch (sessionError) {
      // It's okay if there's no session to delete
      console.log('No existing session to delete');
    }
    
    // Now create a new session
    await account.createEmailSession(email, password);
    const currentUser = await account.get();
    
    // Get the user document from database
    try {
      const userDocs = await databases.listDocuments(
        ENV.DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      );
      
      if (userDocs.documents.length === 0) {
        console.warn('User not found in the database, creating user document');
        // Create user document if not exists
        const newUser = await databases.createDocument(
          ENV.DATABASE_ID,
          USERS_COLLECTION_ID,
          ID.unique(),
          {
            userId: currentUser.$id,
            email: currentUser.email,
            name: currentUser.name,
            createdAt: new Date().toISOString(),
          }
        );
        return { account: currentUser, user: newUser };
      }
      
      return { account: currentUser, user: userDocs.documents[0] };
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return just the account if we can't access the database
      return { account: currentUser, user: null };
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    
    // If we get here, we have a valid account session
    // Now get the user document from database
    try {
      const userDocs = await databases.listDocuments(
        ENV.DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', currentAccount.$id)]
      );
      
      if (userDocs.documents.length === 0) {
        console.warn('User document not found in database');
        return { account: currentAccount, user: null };
      }
      
      return { account: currentAccount, user: userDocs.documents[0] };
    } catch (dbError) {
      console.error('Error retrieving user document:', dbError);
      // Return account but no user document
      return { account: currentAccount, user: null };
    }
  } catch (error) {
    // This will catch 401 Unauthorized errors when not logged in
    console.error('Error getting current user:', error);
    return null;
  }
};

export const resetPassword = async (email) => {
  try {
    return await account.createRecovery(
      email,
      `${ENV.APP_URL}/reset-password`
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export default {
  client,
  account,
  databases,
  createAccount,
  login,
  logout,
  getCurrentUser,
  resetPassword,
}; 