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
    console.log('Attempting login for:', email);
    
    // First, try to delete any existing sessions
    try {
      const sessions = await account.listSessions();
      console.log('Current sessions:', sessions);
      
      // Delete all existing sessions
      for (const session of sessions.sessions) {
        try {
          await account.deleteSession(session.$id);
          console.log('Deleted session:', session.$id);
        } catch (deleteError) {
          console.warn('Error deleting session:', deleteError);
        }
      }
    } catch (sessionError) {
      console.log('No existing sessions to delete');
    }
    
    // Now create a new session
    console.log('Creating new session...');
    const session = await account.createEmailSession(email, password);
    console.log('Session created:', session);
    
    // Get the current user account
    const currentUser = await account.get();
    console.log('Retrieved account:', currentUser);
    
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
    console.log('Getting current user...');
    
    // First check if there's an active session
    try {
      const session = await account.getSession('current');
      console.log('Current session:', session);
    } catch (sessionError) {
      console.log('No active session found:', sessionError);
      return null;
    }
    
    // Add a timeout promise to prevent hanging
    const getAccountPromise = account.get();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );
    
    // Race the account fetch against a timeout
    const currentAccount = await Promise.race([getAccountPromise, timeoutPromise]);
    console.log('Account retrieved successfully:', currentAccount);
    
    // If we get here, we have a valid account session
    // Now get the user document from database
    try {
      console.log('Retrieving user document for ID:', currentAccount.$id);
      const listDocsPromise = databases.listDocuments(
        ENV.DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', currentAccount.$id)]
      );
      
      // Race the database query against a timeout
      const userDocs = await Promise.race([
        listDocsPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000))
      ]);
      
      if (userDocs.documents.length === 0) {
        console.warn('User document not found in database, creating a new one');
        
        // Create a new user document
        try {
          const newUser = await databases.createDocument(
            ENV.DATABASE_ID,
            USERS_COLLECTION_ID,
            ID.unique(),
            {
              userId: currentAccount.$id,
              email: currentAccount.email,
              name: currentAccount.name || 'User',
              createdAt: new Date().toISOString()
            }
          );
          console.log('Created new user document:', newUser.$id);
          return { account: currentAccount, user: newUser };
        } catch (createError) {
          console.error('Error creating user document:', createError);
          // Fall back to returning just the account info
          return { 
            account: currentAccount, 
            user: {
              name: currentAccount.name || 'User',
              email: currentAccount.email,
              userId: currentAccount.$id,
              createdAt: currentAccount.registration
            } 
          };
        }
      }
      
      console.log('User document retrieved successfully');
      return { account: currentAccount, user: userDocs.documents[0] };
    } catch (dbError) {
      console.error('Error retrieving user document:', dbError);
      // Return account info as a fallback user object
      return { 
        account: currentAccount, 
        user: {
          name: currentAccount.name || 'User',
          email: currentAccount.email,
          userId: currentAccount.$id,
          createdAt: currentAccount.registration
        } 
      };
    }
  } catch (error) {
    // This will catch 401 Unauthorized errors when not logged in
    console.error('Error getting current user:', error);
    // Try to clean up any invalid session
    try {
      await account.deleteSession('current');
    } catch (deleteError) {
      console.log('No session to delete');
    }
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