import express from 'express';
import * as liveController from './live.controller.js';

const router = express.Router();

// @route   GET /api/live/:pollId
// @desc    Get full live dashboard data (stats + questions)
router.get('/:pollId', liveController.getLivePollDashboard);

// @route   GET /api/live/:pollId/stats
// @desc    Get high-level live stats only
router.get('/:pollId/stats', liveController.getLiveStats);

// @route   GET /api/live/:pollId/questions
// @desc    Get live questions and option percentages only
router.get('/:pollId/questions', liveController.getLiveQuestions);

export default router;
