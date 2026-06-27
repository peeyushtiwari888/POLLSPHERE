import Notification from './notification.model.js';

/**
 * Fetch paginated notifications for a specific user
 */
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipient: userId }),
  ]);

  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new Error('Notification not found or unauthorized');
  }

  return notification;
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );

  return { modifiedCount: result.modifiedCount };
};

/**
 * Internal Service: Create and dispatch a new notification
 * (To be called internally by other modules like Poll or Response)
 */
export const createNotification = async (notificationData) => {
  const notification = await Notification.create(notificationData);
  
  // For Real-time updates, you can integrate Socket.io here by importing your socket instance
  // and emitting to the specific user's room.
  
  return notification;
};
