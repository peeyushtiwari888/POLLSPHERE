import Poll from '../poll/poll.model.js';

/**
 * Fetch a poll for public respondents
 * Only returns safe data required to render the poll form.
 */
export const getPublicPollById = async (pollId) => {
  // Find the poll by ID and use Mongoose's .select() to exclude sensitive fields.
  // We exclude creatorId, isResultsPublished, and timestamp metadata.
  const poll = await Poll.findById(pollId).select(
    '-creatorId -isResultsPublished -createdAt -updatedAt -__v'
  );

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Check if the poll has expired by comparing current time with expiryDate
  if (new Date() > new Date(poll.expiryDate)) {
    throw new Error('This poll has expired and is no longer accepting responses');
  }

  return poll;
};
