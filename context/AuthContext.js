import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login, logout, createAccount } from '../utils/appwrite';
import * as SecureStore from 'expo-secure-store';

// Create the auth context
const AuthContext = createContext({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app start
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        
        if (userData) {
          console.log('User is authenticated:', userData.user);
          setUser(userData.user);
        } else {
          console.log('No authenticated user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const userData = await login(email, password);
      
      if (userData && userData.user) {
        setUser(userData.user);
        return { success: true, user: userData.user };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const handleRegister = async (email, password, name) => {
    try {
      setIsLoading(true);
      const userData = await createAccount(email, password, name);
      
      if (userData && userData.user) {
        setUser(userData.user);
        return { success: true, user: userData.user };
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 