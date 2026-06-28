import Poll from './poll.model.js';
import sanitizeHtml from 'sanitize-html';
import { emitLiveAnalyticsUpdate } from '../../emitters.js';

const sanitizeOptions = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'
  ],
  allowedAttributes: {
    'a': [ 'href', 'target', 'rel' ]
  }
};

/**
 * Create a new poll
 */
export const createPoll = async (pollData, creatorId) => {
  if (pollData.description) {
    pollData.description = sanitizeHtml(pollData.description, sanitizeOptions);
  }

  const poll = await Poll.create({
    ...pollData,
    creatorId,
  });
  return poll;
};

/**
 * Fetch paginated polls created by a specific user with advanced filters
 */
export const getMyPolls = async (creatorId, queryParams = {}) => {
  const { page = 1, limit = 10, q, filter, sort } = queryParams;
  const skip = (page - 1) * limit;

  // 1. Build Query
  const query = { creatorId };

  // Search
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  // Filters
  const now = new Date();
  if (filter) {
    switch (filter) {
      case 'Expired':
        query.expiryDate = { $lt: now };
        break;
      case 'Published':
        query.status = 'PUBLISHED';
        query.expiryDate = { $gt: now };
        query.isArchived = { $ne: true };
        break;
      case 'Scheduled':
        query.status = 'SCHEDULED';
        query.isArchived = { $ne: true };
        break;
      case 'Draft':
        query.status = 'DRAFT';
        query.expiryDate = { $gt: now };
        query.isArchived = { $ne: true };
        break;
      case 'Archived':
        query.isArchived = true;
        break;
      case 'All':
      default:
        query.isArchived = { $ne: true };
        break;
    }
  } else {
    // Default: don't show archived
    query.isArchived = { $ne: true };
  }

  // 2. Build Sort
  let sortOption = { createdAt: -1 }; // Default: Latest
  if (sort) {
    switch (sort) {
      case 'Oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'Most Responses':
        sortOption = { responsesCount: -1 }; // Assuming we have this field, or it does nothing
        break;
      case 'Expiring Soon':
        sortOption = { expiryDate: 1 };
        // Might want to only sort non-expired polls, but simple sort works
        break;
      case 'Latest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }
  }

  // 3. Execute
  const [polls, totalDocuments] = await Promise.all([
    Poll.find(query).sort(sortOption).skip(skip).limit(Number(limit)).lean(),
    Poll.countDocuments(query),
  ]);

  return {
    polls,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
    }
  };
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

  // Sanitize description if it's being updated
  if (updateData.description) {
    updateData.description = sanitizeHtml(updateData.description, sanitizeOptions);
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
 * Publish poll results or Schedule for publishing
 * Only the creator can publish.
 */
export const publishPoll = async (pollId, userId, publishData = {}) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  // Verify Ownership
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to publish this poll');
  }

  if (poll.status === 'PUBLISHED' || poll.isResultsPublished) {
    throw new Error('Poll is already published');
  }

  if (publishData.scheduledPublishDate) {
    poll.scheduledPublishDate = new Date(publishData.scheduledPublishDate);
    poll.status = 'SCHEDULED';
  } else {
    poll.status = 'PUBLISHED';
    poll.isResultsPublished = true;
  }

  await poll.save();
  
  if (poll.status === 'PUBLISHED') {
    emitLiveAnalyticsUpdate(pollId);
  }

  return poll;
};

/**
 * Archive a poll (Soft Delete)
 */
export const archivePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) throw new Error('Poll not found');
  if (poll.creatorId.toString() !== userId.toString()) throw new Error('Not authorized to archive this poll');

  poll.isArchived = true;
  await poll.save();
  
  return poll;
};

/**
 * Restore an archived poll
 */
export const restorePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) throw new Error('Poll not found');
  if (poll.creatorId.toString() !== userId.toString()) throw new Error('Not authorized to restore this poll');

  poll.isArchived = false;
  await poll.save();
  
  return poll;
};

/**
 * Duplicate a poll
 */
export const duplicatePoll = async (pollId, userId) => {
  const originalPoll = await Poll.findById(pollId).lean();

  if (!originalPoll) throw new Error('Poll not found');
  
  // Create a copy without specific fields
  const newPollData = {
    title: `${originalPoll.title} (Copy)`,
    description: originalPoll.description,
    creatorId: userId,
    isAnonymous: originalPoll.isAnonymous,
    isResultsPublished: false,
    status: 'DRAFT',
    isArchived: false,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    questions: originalPoll.questions.map(q => ({
      text: q.text,
      isRequired: q.isRequired,
      options: q.options.map(opt => ({ text: opt.text }))
    }))
  };

  const newPoll = await Poll.create(newPollData);
  return newPoll;
};

/**
 * Pause a live poll
 */
export const pausePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error('Poll not found');
  if (poll.creatorId.toString() !== userId.toString()) throw new Error('Not authorized to pause this poll');
  
  if (poll.status !== 'PUBLISHED') throw new Error('Only published polls can be paused');

  poll.status = 'PAUSED';
  await poll.save();
  
  emitLiveAnalyticsUpdate(pollId);
  return poll;
};

/**
 * Resume a paused poll
 */
export const resumePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error('Poll not found');
  if (poll.creatorId.toString() !== userId.toString()) throw new Error('Not authorized to resume this poll');
  
  if (poll.status !== 'PAUSED') throw new Error('Only paused polls can be resumed');

  poll.status = 'PUBLISHED';
  await poll.save();
  
  emitLiveAnalyticsUpdate(pollId);
  return poll;
};

/**
 * Expire a live poll instantly
 */
export const expirePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error('Poll not found');
  
  // Only the creator can manually expire it via the live dashboard timer
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to expire this poll');
  }

  // Set status to expired
  poll.status = 'EXPIRED';
  
  // Ensure the expiryDate reflects that it's expired now
  poll.expiryDate = new Date();
  
  await poll.save();
  
  // Emit socket event to notify all connected clients
  emitLiveAnalyticsUpdate(pollId);
  
  return poll;
};
