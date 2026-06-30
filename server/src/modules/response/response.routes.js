import express from 'express';
import * as responseController from './response.controller.js';
import { protect, optionalProtect } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { submitResponseSchema } from './response.validation.js';

const router = express.Router();

// @route   POST /api/responses/:pollId
// @desc    Submit a response to a poll
// @access  Public (Respondents may answer anonymously)
router.post(
  '/:pollId',
  optionalProtect, // Allows anonymous access, but extracts user ID if logged in
  (req, res, next) => {
    // Since our validation and controller expect pollId in the body, 
    // we attach it here from the URL parameters to keep the flow seamless.
    req.body.pollId = req.params.pollId;
    next();
  },
  validate(submitResponseSchema),
  responseController.submitResponse
);

// @route   POST /api/responses/live/:pollId
// @desc    Submit a single live response to an active question
// @access  Public (Respondents may answer anonymously)
router.post(
  '/live/:pollId',
  optionalProtect,
  (req, res, next) => {
    req.body.pollId = req.params.pollId;
    next();
  },
  // Note: We skip the strict bulk validate(submitResponseSchema) here because it expects all answers
  responseController.submitLiveResponse
);

// @route   GET /api/responses/:pollId
// @desc    Get all responses for a specific poll
// @access  Private (Accessible only to the poll creator)
router.get(
  '/:pollId',
  protect, // Strictly requires authentication
  responseController.getResponsesByPollId
);

export default router;
