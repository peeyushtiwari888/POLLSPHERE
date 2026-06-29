import * as pollService from './poll.service.js';

/**
 * Handle Create Poll Request
 */
export const createPoll = async (req, res) => {
  try {
    const userId = req.user.id;
    const poll = await pollService.createPoll(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: poll,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create poll',
    });
  }
};

/**
 * Handle Get My Polls Request
 */
export const getMyPolls = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pollService.getMyPolls(userId, req.query);

    res.status(200).json({
      success: true,
      data: result.polls,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your polls',
    });
  }
};

/**
 * Handle Get Poll By ID Request
 */
export const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await pollService.getPollById(id);

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Poll not found',
    });
  }
};

/**
 * Handle Update Poll Request
 */
export const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const updatedPoll = await pollService.updatePoll(id, updateData, userId);

    res.status(200).json({
      success: true,
      message: 'Poll updated successfully',
      data: updatedPoll,
    });
  } catch (error) {
    // If the error message mentions authorization, return 403 Forbidden
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update poll',
    });
  }
};

/**
 * Handle Delete Poll Request
 */
export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pollService.deletePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll deleted successfully',
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to delete poll',
    });
  }
};

/**
 * Handle Publish Poll Request
 */
export const publishPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const publishData = req.body || {};

    const poll = await pollService.publishPoll(id, userId, publishData);

    res.status(200).json({
      success: true,
      message: 'Poll published successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to publish poll',
    });
  }
};

/**
 * Handle Archive Poll Request
 */
export const archivePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.archivePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll archived successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to archive poll',
    });
  }
};

/**
 * Handle Restore Poll Request
 */
export const restorePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.restorePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll restored successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to restore poll',
    });
  }
};

/**
 * Handle Duplicate Poll Request
 */
export const duplicatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.duplicatePoll(id, userId);

    res.status(201).json({
      success: true,
      message: 'Poll duplicated successfully',
      data: poll,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to duplicate poll',
    });
  }
};

/**
 * Handle Pause Poll Request
 */
export const pausePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.pausePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll paused successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to pause poll',
    });
  }
};

/**
 * Handle Resume Poll Request
 */
export const resumePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.resumePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll resumed successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to resume poll',
    });
  }
};

/**
 * Handle Expire Poll Request
 */
export const expirePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const poll = await pollService.expirePoll(id, userId);

    res.status(200).json({
      success: true,
      message: 'Poll expired successfully',
      data: poll,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to expire poll',
    });
  }
};

/**
 * Handle Set Active Question Request (Live Presenter Mode)
 */
export const setActiveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { questionId } = req.body;

    const poll = await pollService.setActiveQuestion(id, userId, questionId);

    res.status(200).json({
      success: true,
      message: 'Active question updated successfully',
      data: { activeQuestionId: poll.activeQuestionId },
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update active question',
    });
  }
};

/**
 * Handle Get Leaderboard Request
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const leaderboard = await pollService.getLeaderboard(id, userId);

    res.status(200).json({
      success: true,
      message: 'Leaderboard fetched successfully',
      data: leaderboard,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch leaderboard',
    });
  }
};
