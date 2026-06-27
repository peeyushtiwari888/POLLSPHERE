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
    const polls = await pollService.getMyPolls(userId);

    res.status(200).json({
      success: true,
      data: polls,
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

    const poll = await pollService.publishPoll(id, userId);

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
