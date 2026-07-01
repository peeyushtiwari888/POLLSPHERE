import Poll from '../poll/poll.model.js';

export const getParticipantStats = async (pollId, participantId) => {
  const poll = await Poll.findById(pollId).lean();
  if (!poll) throw new Error('Poll not found');

  const Response = (await import('../response/response.model.js')).default;

  // 1. Fetch all responses for this poll sorted by score and time to calculate rank
  const allResponses = await Response.find({ pollId })
    .sort({ totalScore: -1, totalTimeTaken: 1 })
    .select('participantId totalScore totalTimeTaken answers')
    .lean();

  if (allResponses.length === 0) {
    return null; // No responses yet
  }

  // 2. Find the index of our participant to determine rank
  const participantIndex = allResponses.findIndex(r => r.participantId === participantId);
  
  if (participantIndex === -1) {
    throw new Error('Participant not found in this poll');
  }

  const participantResponse = allResponses[participantIndex];
  
  // Calculate average time
  const numAnswers = participantResponse.answers?.length || 1;
  const avgTimeTaken = participantResponse.totalTimeTaken / numAnswers;

  return {
    rank: participantIndex + 1,
    totalParticipants: allResponses.length,
    score: participantResponse.totalScore || 0,
    timeTaken: participantResponse.totalTimeTaken || 0,
    avgTimeTaken: Number(avgTimeTaken.toFixed(1))
  };
};

/**
 * Fetch a poll for public respondents
 * Only returns safe data required to render the poll form.
 */
export const getPublicPollById = async (pollId, providedCode) => {
  // Find the poll by ID and use Mongoose's .select() to exclude sensitive fields.
  // We exclude creatorId, isResultsPublished, and timestamp metadata.
  const poll = await Poll.findById(pollId).select(
    '-creatorId -isResultsPublished -createdAt -updatedAt -__v'
  );

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Participation Code Check
  if (poll.participationCode && poll.participationCode.trim() !== '') {
    if (!providedCode) {
      throw new Error('PARTICIPATION_CODE_REQUIRED');
    }
    if (providedCode.trim().toLowerCase() !== poll.participationCode.trim().toLowerCase()) {
      throw new Error('INVALID_PARTICIPATION_CODE');
    }
  }

  // Check if the poll has expired by comparing current time with expiryDate
  if (new Date() > new Date(poll.expiryDate)) {
    throw new Error('This poll has expired and is no longer accepting responses');
  }

  return poll;
};
