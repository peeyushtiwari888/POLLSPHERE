import Poll from './poll.model.js';

/**
 * Create a new poll
 */
export const createPoll = async (pollData, creatorId) => {
  const poll = await Poll.create({
    ...pollData,
    creatorId,
  });
  return poll;
};

/**
 * Fetch all polls created by a specific user
 */
export const getMyPolls = async (creatorId) => {
  // Sort by newest first
  return await Poll.find({ creatorId }).sort({ createdAt: -1 });
};

/**
 * Fetch a single poll by its ID
 */
export const getPollById = async (pollId) => {
  const poll = await Poll.findById(pollId);
  
  if (!poll) {
    throw new Error('Poll not found');
  }
  
  return poll;
};

/**
 * Update a poll
 * Only the creator can update the poll.
 * We prevent updating polls that are already published to preserve data integrity.
 */
export const updatePoll = async (pollId, updateData, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Verify Ownership
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this poll');
  }

  // Prevent modifying a published poll
  if (poll.isResultsPublished) {
    throw new Error('Cannot update a poll whose results are already published');
  }

  // Apply updates
  Object.assign(poll, updateData);
  await poll.save();
  
  return poll;
};

/**
 * Delete a poll
 * Only the creator can delete the poll.
 */
export const deletePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Verify Ownership
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this poll');
  }

  await poll.deleteOne();
  return { id: pollId };
};

/**
 * Publish poll results
 * Only the creator can publish.
 */
export const publishPoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Verify Ownership
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to publish this poll');
  }

  if (poll.isResultsPublished) {
    throw new Error('Poll results are already published');
  }

  poll.isResultsPublished = true;
  await poll.save();
  
  return poll;
};
