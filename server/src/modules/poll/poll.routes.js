import express from 'express';
import * as pollController from './poll.controller.js';
import { protect } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import {
  createPollSchema,
  updatePollSchema,
  publishPollSchema,
} from './poll.validation.js';

const router = express.Router();

// Poll Routes

// @route   POST /api/polls
// @desc    Create a new poll
// @access  Private
router.post('/', protect, validate(createPollSchema), pollController.createPoll);

// @route   GET /api/polls
// @desc    Get all polls created by the logged-in user
// @access  Private
router.get('/', protect, pollController.getMyPolls);

// @route   GET /api/polls/:id
// @desc    Get a specific poll by ID
// @access  Public (So anyone can view the poll to submit a response)
router.get('/:id', pollController.getPollById);

// @route   PATCH /api/polls/:id
// @desc    Update a poll (e.g., add/remove questions before publishing)
// @access  Private (Only Creator)
router.patch('/:id', protect, validate(updatePollSchema), pollController.updatePoll);

// @route   DELETE /api/polls/:id
// @desc    Delete a poll
// @access  Private (Only Creator)
router.delete('/:id', protect, pollController.deletePoll);

// @route   PATCH /api/polls/:id/publish
// @desc    Publish a poll's results
// @access  Private (Only Creator)
router.patch('/:id/publish', protect, validate(publishPollSchema), pollController.publishPoll);

// @route   PATCH /api/polls/:id/archive
// @desc    Archive a poll
// @access  Private (Only Creator)
router.patch('/:id/archive', protect, pollController.archivePoll);

// @route   PATCH /api/polls/:id/restore
// @desc    Restore an archived poll
// @access  Private (Only Creator)
router.patch('/:id/restore', protect, pollController.restorePoll);

// @route   POST /api/polls/:id/duplicate
// @desc    Duplicate an existing poll
// @access  Private (Only Creator)
router.post('/:id/duplicate', protect, pollController.duplicatePoll);

// @route   PATCH /api/polls/:id/pause
// @desc    Pause a live poll
// @access  Private (Only Creator)
router.patch('/:id/pause', protect, pollController.pausePoll);

// @route   PATCH /api/polls/:id/resume
// @desc    Resume a paused poll
// @access  Private (Only Creator)
router.patch('/:id/resume', protect, pollController.resumePoll);

// @route   PATCH /api/polls/:id/expire
// @desc    Expire a live poll instantly
// @access  Private (Only Creator)
router.patch('/:id/expire', protect, pollController.expirePoll);

// @route   PATCH /api/polls/:id/active-question
// @desc    Set the active question for a live presenter mode poll
// @access  Private (Only Creator)
router.patch('/:id/active-question', protect, pollController.setActiveQuestion);

// @route   GET /api/polls/:id/leaderboard
// @desc    Get the leaderboard for a specific poll
// @access  Private (Only Creator)
router.get('/:id/leaderboard', protect, pollController.getLeaderboard);

export default router;
