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
 * Fetch high-level aggregated statistics for the dashboard.
 * 
 * Note: If the backend does not yet have a dedicated `/dashboard/stats` route,
 * this will return a 404 until that route is implemented.
 * 
 * @returns {Promise<Object>} The aggregated stats (e.g. Total Polls, Responses)
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetch the user's most recently created polls.
 * 
 * Maps to the existing `GET /polls` endpoint. We pass a limit parameter 
 * assuming the backend can use it to return only a subset.
 * 
 * @param {number} limit - Maximum number of recent polls to retrieve
 * @returns {Promise<Object>} The list of recent polls
 */
export const getRecentPolls = async (limit = 5) => {
  try {
    const response = await api.get(`/polls?limit=${limit}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
