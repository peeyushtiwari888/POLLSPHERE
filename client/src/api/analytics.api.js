import api from './axios';

/**
 * Helper function to extract and format API errors cleanly.
 */
const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  throw new Error(message);
};

export const getPollAnalyticsOverview = async (pollId) => {
  try {
    const response = await api.get(`/analytics/${pollId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getQuestionWiseAnalytics = async (pollId) => {
  try {
    const response = await api.get(`/analytics/${pollId}/questions`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const exportAnalyticsCSV = async (pollId) => {
  try {
    const response = await api.get(`/analytics/${pollId}/export/csv`, {
      responseType: 'blob', // Important for file downloads
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const exportAnalyticsPDF = async (pollId) => {
  try {
    const response = await api.get(`/analytics/${pollId}/export/pdf`, {
      responseType: 'blob', // Important for file downloads
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
