import api from './axios';

/**
 * Get all events with filters, pagination, and sorting
 * @param {Object} params - Query parameters (page, limit, status, visibility, category, type, search, sortBy, sortOrder)
 */
export const getEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch events' };
  }
};

/**
 * Get a single event by ID or Slug
 */
export const getEvent = async (idOrSlug) => {
  try {
    const response = await api.get(`/events/${idOrSlug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch event details' };
  }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create event' };
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update event' };
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete event' };
  }
};

/**
 * Get event analytics dashboard
 */
export const getEventAnalyticsDashboard = async () => {
  try {
    const response = await api.get('/events/analytics/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch event analytics' };
  }
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register for event' };
  }
};

/**
 * Cancel event registration
 */
export const cancelRegistration = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel registration' };
  }
};

/**
 * Get participants of an event
 */
export const getEventParticipants = async (eventId, params = {}) => {
  try {
    const response = await api.get(`/events/${eventId}/participants`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch participants' };
  }
};
