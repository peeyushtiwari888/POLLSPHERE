import express from 'express';
import { protect, isAdmin } from '../../common/middleware/auth.middleware.js';
import * as adminController from './admin.controller.js';

const router = express.Router();

// Public/secret route to promote a user to admin (Requires knowing the secret)
router.post('/promote', adminController.promoteToAdmin);

// Protect all routes below this middleware
router.use(protect);
router.use(isAdmin);

router.get('/stats', adminController.getStats);
router.get('/activities', adminController.getActivities);
router.get('/users', adminController.getUsers);
router.put('/users/:id/block', adminController.toggleBlockUser);
router.put('/users/:id/role', adminController.toggleAdminRole);
router.get('/polls', adminController.getAllPolls);
router.get('/events', adminController.getAllEvents);
router.delete('/polls/:id', adminController.deletePoll);
router.delete('/events/:id', adminController.deleteEvent);

export default router;
