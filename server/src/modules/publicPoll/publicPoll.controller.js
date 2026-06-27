import * as publicPollService from './publicPoll.service.js';

/**
 * Handle fetching a public poll by its ID
 */
export const getPublicPoll = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delegate to the service layer to get the sanitized and active poll
    const poll = await publicPollService.getPublicPollById(id);

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    // Determine the most appropriate HTTP status code based on the error message
    // 400 Bad Request for expired polls, 404 Not Found for non-existent polls
    const statusCode = error.message.includes('expired') ? 400 : 404;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch the poll',
    });
  }
};
