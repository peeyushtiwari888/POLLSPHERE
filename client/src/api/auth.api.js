import api from './axios';

/**
 * Authentication API Service
 * 
 * This file contains all API calls related to user authentication.
 * It uses the shared Axios instance which automatically attaches the JWT token 
 * and handles base URL configuration.
 */

/**
 * Register a new user
 * @param {Object} userData - User registration details (e.g., name, email, password)
 * @returns {Promise} Axios response promise
 */
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

/**
 * Log in an existing user
 * @param {Object} credentials - User login details (e.g., email, password)
 * @returns {Promise} Axios response promise
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Log out the current user from the server
 * Note: Client-side token removal should be handled in the Context/UI layer.
 * @returns {Promise} Axios response promise
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Fetch the currently authenticated user's profile
 * The JWT token is automatically attached to this request by the axios interceptor.
 * @returns {Promise} Axios response promise
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
