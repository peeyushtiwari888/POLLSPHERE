import express from 'express';
import * as publicPollController from './publicPoll.controller.js';

const router = express.Router();

// Public Poll Routes

// @route   GET /api/polls/public/:id
// @desc    Fetch a public poll by its ID for respondents
// @access  Public (No authentication required)
router.get('/:id', publicPollController.getPublicPoll);

export default router;
