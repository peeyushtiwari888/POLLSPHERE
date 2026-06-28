import api from './axios';

/**
 * Fetch the complete live dashboard data.
 * @param {string} pollId
 * @returns {Promise<Object>}
 */
export const getLivePollDashboard = async (pollId) => {
  try {
    const response = await api.get(`/live/${pollId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch live dashboard');
  }
};
