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

export default router;
