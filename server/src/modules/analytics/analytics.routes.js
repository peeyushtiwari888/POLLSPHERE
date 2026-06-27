import express from 'express';
import * as analyticsController from './analytics.controller.js';
import { protect } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/analytics/public/:pollId
// @desc    Get public analytics for a published poll
// @access  Public
// * Note: This route must be placed before `/:pollId` so that Express 
// doesn't mistakenly treat the word "public" as a pollId parameter.
router.get('/public/:pollId', analyticsController.getPublicPollResults);

// @route   GET /api/analytics/:pollId
// @desc    Get the high-level analytics overview for a poll
// @access  Private (Only Poll Creator)
router.get('/:pollId', protect, analyticsController.getPollAnalyticsOverview);

// @route   GET /api/analytics/:pollId/questions
// @desc    Get detailed question-by-question vote distribution
// @access  Private (Only Poll Creator)
// * Note: I added this route so your getQuestionWiseAnalytics function can be accessed!
router.get('/:pollId/questions', protect, analyticsController.getQuestionWiseAnalytics);

export default router;
