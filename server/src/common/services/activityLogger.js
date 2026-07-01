import ActivityLog from '../../modules/admin/activityLog.model.js';

/**
 * Log a user or guest activity asynchronously.
 * Fire and forget to avoid slowing down the main request.
 * 
 * @param {string|null} userId - The ID of the user performing the action, null if guest
 * @param {string} actionType - E.g. 'POLL_CREATE', 'USER_REGISTER'
 * @param {string} description - Human readable description
 * @param {object} metadata - Any relevant IDs or extra info (e.g. { pollId, eventId })
 * @param {string} ipAddress - Optional IP address
 */
export const logActivity = (userId, actionType, description, metadata = {}, ipAddress = null) => {
  // Fire and forget, don't await
  ActivityLog.create({
    user: userId,
    actionType,
    description,
    metadata,
    ipAddress,
  }).catch((err) => {
    console.error(`[ActivityLogger Error] Failed to log activity ${actionType}:`, err.message);
  });
};
