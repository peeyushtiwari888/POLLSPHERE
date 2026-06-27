import * as notificationService from './notification.service.js';

/**
 * Handle GET /api/notifications
 */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query; // Already parsed by Zod validator

    const data = await notificationService.getUserNotifications(userId, page, limit);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications',
    });
  }
};

/**
 * Handle PATCH /api/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(notificationId, userId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
    });
  }
};

/**
 * Handle PATCH /api/notifications/read-all
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notifications as read',
    });
  }
};
