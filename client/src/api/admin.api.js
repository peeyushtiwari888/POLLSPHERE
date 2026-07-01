import api from './axios';

/**
 * Fetch admin statistics
 */
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data.data;
};

/**
 * Fetch all users
 */
export const getAllUsers = async (limit = 100) => {
  const response = await api.get(`/admin/users?limit=${limit}`);
  return response.data.data;
};

export const toggleUserBlock = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/block`);
  return response.data;
};

export const toggleUserRole = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/role`);
  return response.data;
};

export const getAllAdminPolls = async (limit = 100) => {
  const response = await api.get(`/admin/polls?limit=${limit}`);
  return response.data.data;
};

export const getAllAdminEvents = async (limit = 100) => {
  const response = await api.get(`/admin/events?limit=${limit}`);
  return response.data.data;
};

export const deleteAdminPoll = async (pollId) => {
  const response = await api.delete(`/admin/polls/${pollId}`);
  return response.data;
};

export const deleteAdminEvent = async (eventId) => {
  const response = await api.delete(`/admin/events/${eventId}`);
  return response.data;
};

/**
 * Fetch recent activities
 */
export const getRecentActivities = async (limit = 50) => {
  const response = await api.get(`/admin/activities?limit=${limit}`);
  return response.data.data;
};

/**
 * Secret endpoint to promote self to admin (for initial setup)
 */
export const promoteToAdmin = async (userId, secret) => {
  const response = await api.post('/admin/promote', { userId, secret });
  return response.data;
};
