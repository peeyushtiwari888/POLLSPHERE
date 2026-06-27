import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';
import { saveToken, removeToken, getToken } from '../utils/token';

// Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Authentication State on Mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a token stored from a previous session
      const token = getToken();
      
      if (token) {
        try {
          // If token exists, verify it by fetching the current user's profile
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // If fetching fails (e.g., token expired/invalid), clean up local state
          console.error('Failed to initialize session:', error);
          removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      // Stop the initial loading state regardless of success or failure
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login Function
   * Authenticates the user, saves the token, and updates global state.
   * @param {Object} credentials - e.g., { email, password }
   */
  const login = async (credentials) => {
    // 1. Call the login API
    const response = await authApi.login(credentials);
    
    // 2. Save the received JWT token securely
    if (response.token) {
      saveToken(response.token);
    }

    // 3. Update the global user state
    // We check if the backend returned the user object directly.
    // If not, we fetch it manually to ensure consistency.
    if (response.user) {
      setUser(response.user);
    } else {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    }
    
    setIsAuthenticated(true);
    
    // Return response so the calling component can show success messages or redirect
    return response;
  };

  /**
   * Logout Function
   * Clears the session on the backend and resets local state.
   */
  const logout = async () => {
    try {
      // 1. Invalidate session on the backend (if supported)
      await authApi.logout();
    } catch (error) {
      // We catch errors here because even if the backend call fails 
      // (e.g. network issue), we still want to force a local logout.
      console.warn('Backend logout failed, proceeding with local cleanup.', error);
    } finally {
      // 2. Clean up local storage and global state
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // The value object contains all state and functions we want to expose to our app
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
