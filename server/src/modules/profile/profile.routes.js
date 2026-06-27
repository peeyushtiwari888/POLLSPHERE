import express from 'express';
import * as profileController from './profile.controller.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, profileController.getProfile);
router.patch('/', protect, profileController.updateProfile);
router.patch('/password', protect, profileController.changePassword);

export default router;
