import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';
import { saveToken, removeToken, getToken } from '../utils/token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Authentication State on Mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to initialize session:', error.message);
          removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Signup Function
   * Registers user, saves token, and updates global state.
   */
  const signup = async (userData) => {
    const response = await authApi.signup(userData);
    
    if (response.token) {
      saveToken(response.token);
    }

    if (response.user) {
      setUser(response.user);
    } else {
      const fetchedUser = await authApi.getCurrentUser();
      setUser(fetchedUser);
    }
    
    setIsAuthenticated(true);
    return response;
  };

  /**
   * Login Function
   * Authenticates the user, saves the token, and updates global state.
   */
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    
    if (response.token) {
      saveToken(response.token);
    }

    if (response.user) {
      setUser(response.user);
    } else {
      const fetchedUser = await authApi.getCurrentUser();
      setUser(fetchedUser);
    }
    
    setIsAuthenticated(true);
    return response;
  };

  /**
   * Logout Function
   * Clears the session on the backend and resets local state.
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Backend logout failed, proceeding with local cleanup.', error.message);
    } finally {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
