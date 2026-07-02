import api from './axios';

/**
 * Fetch paginated notifications for the logged in user
 */
export const getNotifications = async (params = { page: 1, limit: 10, unreadOnly: false }) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};
