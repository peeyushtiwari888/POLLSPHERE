/**
 * Token Management Utility
 * 
 * Reusable helper functions for managing the JWT access token in localStorage.
 */

const TOKEN_KEY = 'pollsphere_access_token';

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
 * Check if the user is authenticated (token exists in localStorage)
 * @returns {boolean} True if token exists, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};
