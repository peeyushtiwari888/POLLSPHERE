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
 * Create a new poll.
 * 
 * @param {Object} pollData - The data for the new poll (title, description, questions, expiryDate)
 * @returns {Promise<Object>} The created poll response
 */
export const createPoll = async (pollData) => {
  try {
    const response = await api.post('/polls', pollData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetch all polls created by the logged in user
 * @param {Object} params - Query parameters for pagination, filtering, searching, and sorting
 * @returns {Promise<Object>} Clean response data with pagination info
 */
export const getMyPolls = async (params = {}) => {
  try {
    const response = await api.get('/polls', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get a specific poll by its ID.
 * (This is a public endpoint on the backend, allowing responders to view it)
 * 
 * @param {string} id - The ID of the poll
 * @returns {Promise<Object>} The poll data
 */
export const getPollById = async (id) => {
  try {
    const response = await api.get(`/polls/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Update an existing poll (e.g., modifying questions before publishing).
 * 
 * @param {string} id - The ID of the poll to update
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object>} The updated poll response
 */
export const updatePoll = async (id, updateData) => {
  try {
    const response = await api.patch(`/polls/${id}`, updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Delete a specific poll.
 * 
 * @param {string} id - The ID of the poll to delete
 * @returns {Promise<Object>} Success message/response
 */
export const deletePoll = async (id) => {
  try {
    const response = await api.delete(`/polls/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Publish a poll to make it active and accept responses.
 * 
 * @param {string} id - The ID of the poll to publish
 * @param {Object} publishData - Optional payload containing publishing settings (e.g., visibility)
 * @returns {Promise<Object>} The published poll response
 */
export const publishPoll = async (id, publishData = {}) => {
  try {
    const response = await api.patch(`/polls/${id}/publish`, publishData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Archive a specific poll.
 * 
 * @param {string} id - The ID of the poll to archive
 * @returns {Promise<Object>} Success message/response
 */
export const archivePoll = async (id) => {
  try {
    const response = await api.patch(`/polls/${id}/archive`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Restore an archived poll.
 * 
 * @param {string} id - The ID of the poll to restore
 * @returns {Promise<Object>} Success message/response
 */
export const restorePoll = async (id) => {
  try {
    const response = await api.patch(`/polls/${id}/restore`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Duplicate a specific poll.
 * 
 * @param {string} id - The ID of the poll to duplicate
 * @returns {Promise<Object>} The duplicated poll response
 */
export const duplicatePoll = async (id) => {
  try {
    const response = await api.post(`/polls/${id}/duplicate`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
