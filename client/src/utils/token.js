/**
 * Token Management Utility
 * 
 * Centralized helper functions for managing the authentication token in localStorage.
 * Using a constant for the token key prevents typos and keeps the code clean.
 */

const TOKEN_KEY = 'pollsphere_auth_token';

/**
 * Save the JWT token to localStorage
 * @param {string} token - The JWT string
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieve the JWT token from localStorage
 * @returns {string|null} The token string, or null if it doesn't exist
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove the JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if a token exists in localStorage
 * Note: This only checks for presence, not validity/expiration.
 * @returns {boolean} True if token exists, false otherwise
 */
export const isAuthenticated = () => {
  // We reuse getToken() and use double negation (!!) to convert it to a strict boolean
  return !!getToken();
};
