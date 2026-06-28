import * as liveService from './live.service.js';

/**
 * @desc    Get full live dashboard data (stats + questions)
 * @route   GET /api/live/:pollId
 */
export const getLivePollDashboard = async (req, res) => {
  try {
    const { pollId } = req.params;
    const data = await liveService.getLivePollDashboard(pollId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to fetch live dashboard'
    });
  }
};

/**
 * @desc    Get high-level live stats only
 * @route   GET /api/live/:pollId/stats
 */
export const getLiveStats = async (req, res) => {
  try {
    const { pollId } = req.params;
    const data = await liveService.getLiveStats(pollId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to fetch live stats'
    });
  }
};

/**
 * @desc    Get live questions and option percentages only
 * @route   GET /api/live/:pollId/questions
 */
export const getLiveQuestions = async (req, res) => {
  try {
    const { pollId } = req.params;
    const data = await liveService.getLiveQuestions(pollId);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to fetch live questions'
    });
  }
};
