import Poll from '../poll/poll.model.js';

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
    if (providedCode !== poll.participationCode) {
      throw new Error('INVALID_PARTICIPATION_CODE');
    }
  }

  // Check if the poll has expired by comparing current time with expiryDate
  if (new Date() > new Date(poll.expiryDate)) {
    throw new Error('This poll has expired and is no longer accepting responses');
  }

  return poll;
};
