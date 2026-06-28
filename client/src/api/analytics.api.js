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

export const getPollAnalytics = async (pollId) => {
  try {
    const [overviewResponse, questionsResponse] = await Promise.all([
      api.get(`/analytics/${pollId}`),
      api.get(`/analytics/${pollId}/questions`)
    ]);

    const overviewData = overviewResponse.data?.data || overviewResponse.data;
    const questionsData = questionsResponse.data?.data || questionsResponse.data;

    return {
      poll: { 
        ...overviewData.pollMetadata, 
        isResultsPublished: overviewData.pollMetadata?.status === 'PUBLISHED' 
      },
      overview: {
        totalResponses: overviewData.engagement?.totalResponses || 0,
        completionRate: 100, // Assuming 100% since partial responses aren't stored currently
        isActive: overviewData.pollMetadata?.status === 'ACTIVE' || overviewData.pollMetadata?.status === 'PUBLISHED',
        isPublished: overviewData.pollMetadata?.status === 'PUBLISHED'
      },
      timeSeriesData: [], // Optional: build time series if backend supports it
      participation: {
        anonymousResponses: overviewData.engagement?.anonymousResponses || 0,
        authenticatedResponses: overviewData.engagement?.authenticatedResponses || 0,
        totalResponses: overviewData.engagement?.totalResponses || 0
      },
      questionsData: questionsData
    };
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
