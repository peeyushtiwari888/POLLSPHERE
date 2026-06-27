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

// @route   GET /api/responses/:pollId
// @desc    Get all responses for a specific poll
// @access  Private (Accessible only to the poll creator)
router.get(
  '/:pollId',
  protect, // Strictly requires authentication
  responseController.getResponsesByPollId
);

export default router;
