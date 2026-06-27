import api from './axios';

/**
 * Helper function to extract and format API errors cleanly.
 * Keeps UI components completely unaware of Axios-specific error structures.
 */
const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  throw new Error(message);
};

/**
 * Fetch the current user's profile details.
 * 
 * @returns {Promise<Object>} The profile data payload
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Update the current user's profile information.
 * 
 * @param {Object} profileData - The updated profile fields (e.g., name, avatar)
 * @returns {Promise<Object>} The updated profile payload
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch('/profile', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Change the user's password securely.
 * 
 * @param {Object} passwordData - Should contain { currentPassword, newPassword }
 * @returns {Promise<Object>} A success message or confirmation
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch('/profile/password', passwordData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
