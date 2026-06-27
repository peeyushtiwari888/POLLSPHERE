import express from 'express';
import * as notificationController from './notification.controller.js';
import { getNotificationsSchema, markAsReadSchema } from './notification.validation.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// All notification routes must be protected
router.use(protect);

// @route   GET /api/notifications
// @desc    Get paginated notifications for logged in user
// @access  Private
router.get(
  '/',
  validate(getNotificationsSchema),
  notificationController.getMyNotifications
);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all unread notifications as read
// @access  Private
// Important: This route must come BEFORE /:id/read so 'read-all' isn't treated as an ID
router.patch(
  '/read-all',
  notificationController.markAllNotificationsAsRead
);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Private
router.patch(
  '/:id/read',
  validate(markAsReadSchema),
  notificationController.markNotificationAsRead
);

export default router;
