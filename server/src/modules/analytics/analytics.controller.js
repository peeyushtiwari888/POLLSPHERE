import * as analyticsService from './analytics.service.js';

/**
 * Handle fetching the high-level analytics overview for a poll
 */
export const getPollAnalyticsOverview = async (req, res) => {
  try {
    const { pollId } = req.params;
    // Route will be protected, so req.user.id is guaranteed
    const userId = req.user.id;

    const overview = await analyticsService.getPollAnalyticsOverview(pollId, userId);

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    // 403 for unauthorized ownership access, 404 for poll missing, 400 default
    const statusCode = error.message.includes('authorized') ? 403 : 
                      error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch analytics overview',
    });
  }
};

/**
 * Handle fetching detailed question-by-question analytics
 */
export const getQuestionWiseAnalytics = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user.id;

    const analytics = await analyticsService.getQuestionWiseAnalytics(pollId, userId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 
                      error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch question-wise analytics',
    });
  }
};

/**
 * Handle fetching public analytics for a published poll
 */
export const getPublicPollResults = async (req, res) => {
  try {
    const { pollId } = req.params;

    // Delegate to service (No userId required here since it's a public route)
    const results = await analyticsService.getPublicPollResults(pollId);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    // If the poll hasn't been published yet, throw a 403 Forbidden
    const statusCode = error.message.includes('private') ? 403 : 
                      error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch public results',
    });
  }
};

/**
 * Export analytics data to CSV
 */
export const exportAnalyticsCSV = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user.id;

    const csvData = await analyticsService.exportAnalyticsCSV(pollId, userId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=poll_${pollId}_analytics.csv`);
    res.status(200).send(csvData);
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 
                      error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to export CSV',
    });
  }
};

/**
 * Export analytics data to PDF
 */
export const exportAnalyticsPDF = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user.id;

    const pdfBuffer = await analyticsService.exportAnalyticsPDF(pollId, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=poll_${pollId}_analytics.pdf`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 
                      error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to export PDF',
    });
  }
};
