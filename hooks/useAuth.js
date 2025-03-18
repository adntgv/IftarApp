import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { createAccount, login, logout, getCurrentUser } from '../utils/appwrite';
import { Platform } from 'react-native';

// Custom storage adapter with platform check for web support
const secureStorage = {
  getItem: async (name) => {
    try {
      // Handle SSR and different platforms
      if (typeof window === 'undefined') {
        // Running in SSR/Node environment
        return null;
      } else if (Platform.OS === 'web') {
        // Browser environment
        const value = window.localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      } else {
        // Native environment
        const value = await SecureStore.getItemAsync(name);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      // Make sure the value is a string
      const stringValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value);
        
      // Handle SSR and different platforms
      if (typeof window === 'undefined') {
        // Running in SSR/Node environment
        return;
      } else if (Platform.OS === 'web') {
        // Browser environment
        window.localStorage.setItem(name, stringValue);
      } else {
        // Native environment
        await SecureStore.setItemAsync(name, stringValue);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  removeItem: async (name) => {
    try {
      // Handle SSR and different platforms
      if (typeof window === 'undefined') {
        // Running in SSR/Node environment
        return;
      } else if (Platform.OS === 'web') {
        // Browser environment
        window.localStorage.removeItem(name);
      } else {
        // Native environment
        await SecureStore.deleteItemAsync(name);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },
};

// Create auth store
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      account: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isLoggedIn: false,

      // Add a variable to track last check time
      lastSessionCheck: 0,

      // Register a new user
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const result = await createAccount(email, password, name);
          set({ 
            user: result.user, 
            account: result.account, 
            isLoading: false, 
            isAuthenticated: true,
            isLoggedIn: true
          });
          return result;
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false, 
            isAuthenticated: false,
            isLoggedIn: false
          });
          throw error;
        }
      },

      // Login user
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await login(email, password);
          set({ 
            user: result.user, 
            account: result.account, 
            isLoading: false, 
            isAuthenticated: true,
            isLoggedIn: true
          });
          return result;
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false, 
            isAuthenticated: false,
            isLoggedIn: false
          });
          throw error;
        }
      },

      // Logout user
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await logout();
          set({ 
            user: null, 
            account: null, 
            isLoading: false, 
            isAuthenticated: false,
            isLoggedIn: false
          });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false
          });
          throw error;
        }
      },

      // Check current session
      checkSession: async () => {
        const now = Date.now();
        const lastCheck = get().lastSessionCheck;
        
        // Prevent checking more than once every 2 seconds (reduced from 5)
        if (now - lastCheck < 2000) {
          console.log('Skipping session check - checked recently');
          return get().account ? { account: get().account, user: get().user } : null;
        }
        
        set({ isLoading: true, error: null, lastSessionCheck: now });
        console.log('Starting session check in useAuth');
        
        try {
          const result = await getCurrentUser();
          console.log('Session check result:', { 
            success: !!result, 
            hasAccount: !!result?.account, 
            hasUser: !!result?.user 
          });
          
          if (result && result.account) {
            // Make sure we're updating the state with the latest data
            set({ 
              user: result.user, 
              account: result.account, 
              isLoading: false, 
              isAuthenticated: true,
              isLoggedIn: true,
              error: null
            });
            return result;
          } else {
            // Clear user data if no valid session
            set({ 
              user: null, 
              account: null, 
              isLoading: false, 
              isAuthenticated: false,
              isLoggedIn: false,
              error: null
            });
            return null;
          }
        } catch (error) {
          console.error('Session check failed:', error);
          // Clear auth state on error
          set({ 
            user: null,
            account: null,
            error: error.message || 'Authentication failed', 
            isLoading: false, 
            isAuthenticated: false,
            isLoggedIn: false
          });
          return null;
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // This would call an API to update the user profile
          // For now, just update the local state
          set({ 
            user: { ...get().user, ...userData }, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // Implement password reset logic
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Clear any errors
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export default useAuthStore; 