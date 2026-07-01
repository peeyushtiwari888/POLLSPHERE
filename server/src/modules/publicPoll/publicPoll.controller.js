import * as publicPollService from './publicPoll.service.js';

export const getParticipantStats = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    
    const stats = await publicPollService.getParticipantStats(id, participantId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('not found')) statusCode = 404;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch participant stats',
    });
  }
};

/**
 * Handle fetching a public poll by its ID
 */
export const getPublicPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.query; // Extract participation code if provided
    
    // Delegate to the service layer to get the sanitized and active poll
    const poll = await publicPollService.getPublicPollById(id, code);

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    // Determine the most appropriate HTTP status code based on the error message
    // 400 Bad Request for expired polls, 404 Not Found for non-existent polls
    // 403 Forbidden for participation code errors
    let statusCode = 500;
    if (error.message.includes('expired')) statusCode = 400;
    if (error.message.includes('not found')) statusCode = 404;
    if (error.message === 'PARTICIPATION_CODE_REQUIRED' || error.message === 'INVALID_PARTICIPATION_CODE') statusCode = 403;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch the poll',
    });
  }
};
