import { getSocketIo } from './socket.js';

/**
 * Emit a real-time event whenever a new response is successfully submitted to a poll.
 * This notifies all clients viewing the poll that someone just voted.
 * 
 * @param {string} pollId - The ID of the poll to target the specific room
 * @param {object} responseData - The newly created response data
 */
export const emitResponseSubmitted = (pollId, responseData) => {
  try {
    const io = getSocketIo();
    // Emits the event ONLY to users connected to this specific pollId room
    io.to(pollId).emit('response-submitted', responseData);
  } catch (error) {
    console.error(`Socket error: Failed to emit responseSubmitted for poll ${pollId}`, error);
  }
};

/**
 * Emit a real-time event with freshly updated analytics.
 * This can be used to send the new aggregated data directly to the dashboard.
 * 
 * @param {string} pollId - The ID of the poll to target the specific room
 * @param {object} analyticsData - The newly calculated analytics JSON
 */
export const emitAnalyticsUpdated = (pollId, analyticsData) => {
  try {
    const io = getSocketIo();
    // Emits the event ONLY to users connected to this specific pollId room
    io.to(pollId).emit('analytics-updated', analyticsData);
  } catch (error) {
    console.error(`Socket error: Failed to emit analyticsUpdated for poll ${pollId}`, error);
  }
};

import { getLiveStats, getLiveQuestions, getLivePollDashboard } from './modules/live/live.service.js';

export const emitLiveResponseUpdate = async (pollId) => {
  try {
    const io = getSocketIo();
    const liveStats = await getLiveStats(pollId);
    io.to(pollId).emit('live-response-update', liveStats);
  } catch (error) {
    console.error(`Socket error: Failed to emit live-response-update for poll ${pollId}`, error);
  }
};

export const emitLiveQuestionUpdate = async (pollId) => {
  try {
    const io = getSocketIo();
    const liveQuestions = await getLiveQuestions(pollId);
    io.to(pollId).emit('live-question-update', liveQuestions);
  } catch (error) {
    console.error(`Socket error: Failed to emit live-question-update for poll ${pollId}`, error);
  }
};

export const emitLiveAnalyticsUpdate = async (pollId) => {
  try {
    const io = getSocketIo();
    const liveDashboard = await getLivePollDashboard(pollId);
    io.to(pollId).emit('live-analytics-update', liveDashboard);
  } catch (error) {
    console.error(`Socket error: Failed to emit live-analytics-update for poll ${pollId}`, error);
  }
};

export const emitActiveQuestionChanged = (pollId, questionId) => {
  try {
    const io = getSocketIo();
    io.to(pollId).emit('active-question-changed', questionId);
  } catch (error) {
    console.error(`Socket error: Failed to emit active-question-changed for poll ${pollId}`, error);
  }
};
