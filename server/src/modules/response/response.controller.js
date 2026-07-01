import * as responseService from './response.service.js';
import { logActivity } from '../../common/services/activityLogger.js';

/**
 * Handle submit response request
 */
export const submitResponse = async (req, res) => {
  try {
    const { pollId, answers } = req.body;
    
    // If the route uses optional authentication, req.user will only exist for logged-in users.
    const userId = req.user ? req.user.id : null;

    // Delegate to service
    const response = await responseService.submitResponse(pollId, userId, answers);

    logActivity(userId, 'POLL_VOTE', `A vote was cast on poll ${pollId}.`, { pollId });

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: response,
    });
  } catch (error) {
    // Determine the most appropriate HTTP status code
    let statusCode = 400; // Bad Request (default for validation issues, expiry, etc.)
    const msg = error.message.toLowerCase();
    
    if (msg.includes('not found')) {
      statusCode = 404;
    } else if (msg.includes('authentication') || msg.includes('not allowed')) {
      statusCode = 403; // Forbidden
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to submit response',
    });
  }
};

/**
 * Handle submit LIVE response request (partial submission)
 */
export const submitLiveResponse = async (req, res) => {
  try {
    const { pollId, participantId, answer } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!participantId && !userId) {
      throw new Error('participantId is required for anonymous live submissions');
    }
    if (!answer) {
      throw new Error('answer is required');
    }

    const response = await responseService.submitLiveResponse(pollId, userId, participantId, answer);

    res.status(200).json({
      success: true,
      message: 'Live response recorded successfully',
      data: response,
    });
  } catch (error) {
    let statusCode = 400;
    const msg = error.message.toLowerCase();
    
    if (msg.includes('not found')) statusCode = 404;
    else if (msg.includes('authentication') || msg.includes('not allowed')) statusCode = 403;
    else if (msg.includes('time is up') || msg.includes('expired')) statusCode = 403;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to submit live response',
    });
  }
};

/**
 * Handle fetching responses for a poll
 */
export const getResponsesByPollId = async (req, res) => {
  try {
    const { pollId } = req.params;
    // This route will definitely be fully protected, so req.user.id must exist
    const userId = req.user.id;

    // Delegate to service
    const responses = await responseService.getResponsesByPollId(pollId, userId);

    res.status(200).json({
      success: true,
      data: responses,
    });
  } catch (error) {
    let statusCode = 400;
    const msg = error.message.toLowerCase();

    if (msg.includes('authorized')) {
      statusCode = 403;
    } else if (msg.includes('not found')) {
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch responses',
    });
  }
};
