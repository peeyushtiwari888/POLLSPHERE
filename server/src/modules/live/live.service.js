import mongoose from 'mongoose';
import Poll from '../poll/poll.model.js';
import Response from '../response/response.model.js';

/**
 * Calculates current poll status based on expiry and publish status.
 */
const computePollStatus = (poll) => {
  if (poll.isResultsPublished) return 'PUBLISHED';
  if (new Date() > new Date(poll.expiryDate)) return 'EXPIRED';
  return 'ACTIVE';
};

/**
 * Calculates time remaining in milliseconds.
 */
const computeTimeRemaining = (expiryDate) => {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return diff > 0 ? diff : 0;
};

/**
 * High-level Live Stats (Optimized for top-bar in presentation)
 */
export const getLiveStats = async (pollId) => {
  const poll = await Poll.findById(pollId).select('title expiryDate isResultsPublished creatorId status activeQuestionId activeQuestionStartTime participationCode');
  if (!poll) throw new Error('Poll not found');

  // Aggregation for quick high-level response counts and timeline
  const stats = await Response.aggregate([
    { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalResponses: { $sum: 1 },
              totalParticipants: { $sum: 1 } 
            }
          }
        ],
        timelineData: [
          {
            $group: {
              // Group by formatting createdAt to HH:MM (minutes)
              _id: { $dateToString: { format: "%H:%M", date: "$createdAt" } },
              votes: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              time: "$_id",
              votes: 1
            }
          }
        ]
      }
    }
  ]);

  const { totalResponses = 0, totalParticipants = 0 } = stats[0]?.totals[0] || {};
  const timeline = stats[0]?.timelineData || [];

  return {
    title: poll.title,
    creatorId: poll.creatorId,
    status: poll.status === 'PAUSED' ? 'PAUSED' : computePollStatus(poll),
    totalParticipants,
    totalResponses,
    timeline,
    liveResponseCount: totalResponses, // Synonymous in this context
    activeUsers: 0, // Mocked for now; can be integrated with Redis later
    pollExpiryTime: poll.expiryDate,
    timeRemaining: computeTimeRemaining(poll.expiryDate),
    isResultsPublished: poll.isResultsPublished,
    activeQuestionId: poll.activeQuestionId,
    activeQuestionStartTime: poll.activeQuestionStartTime,
    participationCode: poll.participationCode
  };
};

/**
 * Live Questions & Option Counts (Optimized for real-time charting)
 */
export const getLiveQuestions = async (pollId) => {
  const poll = await Poll.findById(pollId).select('questions');
  if (!poll) throw new Error('Poll not found');

  // Aggregation to count votes for every option across all responses
  const optionStats = await Response.aggregate([
    { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
    { $unwind: '$answers' },
    {
      $group: {
        _id: '$answers.selectedOption',
        voteCount: { $sum: 1 }
      }
    }
  ]);

  const statsMap = new Map();
  optionStats.forEach(stat => statsMap.set(stat._id.toString(), stat.voteCount));

  const questionsData = poll.questions.map(question => {
    let totalVotesForQuestion = 0;

    const formattedOptions = question.options.map(opt => {
      const votes = statsMap.get(opt._id.toString()) || 0;
      totalVotesForQuestion += votes;
      return {
        optionId: opt._id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        votes
      };
    });

    formattedOptions.forEach(opt => {
      opt.percentage = totalVotesForQuestion === 0
        ? 0
        : Number(((opt.votes / totalVotesForQuestion) * 100).toFixed(1));
    });

    return {
      questionId: question._id,
      text: question.text,
      duration: question.duration,
      totalVotes: totalVotesForQuestion,
      options: formattedOptions
    };
  });

  return questionsData;
};

/**
 * Combined Live Dashboard (Returns everything in one shot)
 */
export const getLivePollDashboard = async (pollId) => {
  const [stats, questions] = await Promise.all([
    getLiveStats(pollId),
    getLiveQuestions(pollId)
  ]);

  return {
    ...stats,
    questions
  };
};
