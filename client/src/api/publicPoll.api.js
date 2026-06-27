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
 * Fetch a public poll by its ID.
 * Allows respondents to view the poll details and questions.
 * 
 * @param {string} pollId - The ID of the poll
 * @returns {Promise<Object>} The poll data payload
 */
export const getPublicPoll = async (pollId) => {
  try {
    const response = await api.get(`/polls/public/${pollId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Submit a response (votes) to a public poll.
 * 
 * @param {string} pollId - The ID of the poll being answered
 * @param {Object} payload - The responses data (e.g., array of selected option IDs)
 * @returns {Promise<Object>} The success confirmation payload
 */
export const submitPollResponse = async (pollId, payload) => {
  try {
    const response = await api.post(`/responses/${pollId}`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetch the aggregated results for a specific poll.
 * Only returns data if the poll's isResultsPublished flag is true (enforced by backend).
 * 
 * @param {string} pollId - The ID of the poll
 * @returns {Promise<Object>} The aggregated results payload
 */
export const getPublishedPollResults = async (pollId) => {
  try {
    const response = await api.get(`/polls/${pollId}/results`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
