import api from './axios';

/**
 * Helper function to extract and format API errors cleanly.
 * Guarantees that UI components only receive standard Error objects with clean messages.
 */
const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  throw new Error(message);
};

/**
 * Register a new user
 * @param {Object} userData - User registration details (e.g., name, email, password)
 * @returns {Promise<Object>} Clean response data from the backend
 */
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Log in an existing user
 * @param {Object} credentials - User login details (e.g., email, password)
 * @returns {Promise<Object>} Clean response data containing token and user info
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


/**
 * Log out the current user from the server
 * @returns {Promise<Object>} Clean response data confirming logout
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetch the currently authenticated user's profile
 * The JWT token is automatically attached to this request by the axios interceptor.
 * @returns {Promise<Object>} Clean response data containing the user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Request password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Success message
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Reset password with token
 * @param {string} token - The reset token from URL
 * @param {string} password - The new password
 * @returns {Promise<Object>} Success message
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
