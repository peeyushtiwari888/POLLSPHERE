import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Poll from '../poll/poll.model.js';
import Response from '../response/response.model.js';

/**
 * Generate a high-level analytics overview for a specific poll
 */
export const getPollAnalyticsOverview = async (pollId, userId) => {
  // 1. Verify that the poll exists
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  // 2. Verify ownership (Only the creator should see analytics)
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to view analytics for this poll');
  }

  // 3. Determine current poll status
  const isExpired = new Date() > new Date(poll.expiryDate);
  let status = 'ACTIVE';
  if (poll.isResultsPublished) {
    status = 'PUBLISHED';
  } else if (isExpired) {
    status = 'EXPIRED';
  }

  // 4. Use MongoDB Aggregation for efficient counting in a single database round-trip
  const stats = await Response.aggregate([
    {
      // Filter responses strictly for this poll
      $match: { pollId: new mongoose.Types.ObjectId(pollId) }
    },
    {
      // Group all matched documents together to calculate sums
      $group: {
        _id: null,
        totalResponses: { $sum: 1 },
        // Count as 1 if userId is null (anonymous), else 0
        anonymousResponses: {
          $sum: { $cond: [{ $eq: ['$userId', null] }, 1, 0] }
        },
        // Count as 1 if userId is NOT null (authenticated), else 0
        authenticatedResponses: {
          $sum: { $cond: [{ $ne: ['$userId', null] }, 1, 0] }
        }
      }
    }
  ]);

  // Handle the case where there are zero responses (aggregation returns an empty array)
  const responseData = stats.length > 0 ? stats[0] : {
    totalResponses: 0,
    anonymousResponses: 0,
    authenticatedResponses: 0
  };

  // Remove the null _id field injected by the $group stage
  if (responseData._id === null) {
    delete responseData._id;
  }

  // 5. Return a clean analytics summary object
  return {
    pollMetadata: {
      title: poll.title,
      status,
      isExpired,
      isAnonymousAllowed: poll.isAnonymous,
      expiryDate: poll.expiryDate,
      createdAt: poll.createdAt
    },
    engagement: responseData
  };
};

/**
 * Generate detailed question-by-question analytics (vote distribution)
 */
export const getQuestionWiseAnalytics = async (pollId, userId) => {
  // 1. Verify poll exists and check ownership
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to view analytics for this poll');
  }

  // 2. Perform aggregation to count votes for every option across all responses
  // We unwind the answers array so each answer becomes a separate document, 
  // then we group by selectedOption and count.
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

  // Create a fast lookup map for the aggregation results O(1) lookup
  const statsMap = new Map();
  optionStats.forEach((stat) => {
    statsMap.set(stat._id.toString(), stat.voteCount);
  });

  // 3. Format the data perfectly for frontend charts and UI components
  const questionAnalytics = poll.questions.map((question) => {
    let totalVotesForQuestion = 0;

    // First pass: map options and sum up total votes for this specific question
    const formattedOptions = question.options.map((opt) => {
      const votes = statsMap.get(opt._id.toString()) || 0;
      totalVotesForQuestion += votes;

      return {
        optionId: opt._id,
        text: opt.text,
        votes,
      };
    });

    // Second pass: calculate percentage for frontend convenience
    formattedOptions.forEach((opt) => {
      opt.percentage = totalVotesForQuestion === 0
        ? 0
        : Number(((opt.votes / totalVotesForQuestion) * 100).toFixed(1));
    });

    return {
      questionId: question._id,
      text: question.text,
      totalVotes: totalVotesForQuestion,
      options: formattedOptions,
    };
  });

  return questionAnalytics;
};

/**
 * Generate public results for a published poll
 * This function does NOT require authentication, but only works if the creator has published the results.
 */
export const getPublicPollResults = async (pollId) => {
  // 1. Verify poll exists
  // We only select the fields safe for public viewing
  const poll = await Poll.findById(pollId).select('title description isResultsPublished questions');
  
  if (!poll) {
    throw new Error('Poll not found');
  }

  // 2. Verify the poll has been published by the creator
  if (!poll.isResultsPublished) {
    throw new Error('Results for this poll are private and have not been published yet');
  }

  // 3. Perform aggregation to count votes (same logic as private analytics but without user checks)
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
  optionStats.forEach((stat) => {
    statsMap.set(stat._id.toString(), stat.voteCount);
  });

  // 4. Format public analytics
  const questionAnalytics = poll.questions.map((question) => {
    let totalVotesForQuestion = 0;

    const formattedOptions = question.options.map((opt) => {
      const votes = statsMap.get(opt._id.toString()) || 0;
      totalVotesForQuestion += votes;
      return {
        optionId: opt._id,
        text: opt.text,
        votes,
      };
    });

    formattedOptions.forEach((opt) => {
      opt.percentage = totalVotesForQuestion === 0
        ? 0
        : Number(((opt.votes / totalVotesForQuestion) * 100).toFixed(1));
    });

    return {
      questionId: question._id,
      text: question.text,
      totalVotes: totalVotesForQuestion,
      options: formattedOptions,
    };
  });

  return {
    pollMetadata: {
      title: poll.title,
      description: poll.description,
    },
    results: questionAnalytics
  };
};

/**
 * Generate CSV data for export
 */
export const exportAnalyticsCSV = async (pollId, userId) => {
  const overview = await getPollAnalyticsOverview(pollId, userId);
  const questions = await getQuestionWiseAnalytics(pollId, userId);

  let csv = 'Poll Title,Total Responses,Question,Option,Votes,Percentage\n';
  
  questions.forEach(q => {
    q.options.forEach(opt => {
      // Escape commas and quotes for CSV safety
      const title = `"${overview.pollMetadata.title.replace(/"/g, '""')}"`;
      const qText = `"${q.text.replace(/"/g, '""')}"`;
      const optText = `"${opt.text.replace(/"/g, '""')}"`;
      
      csv += `${title},${overview.engagement.totalResponses},${qText},${optText},${opt.votes},${opt.percentage}%\n`;
    });
  });

  return csv;
};

/**
 * Generate PDF buffer for export
 */
export const exportAnalyticsPDF = async (pollId, userId) => {
  const overview = await getPollAnalyticsOverview(pollId, userId);
  const questions = await getQuestionWiseAnalytics(pollId, userId);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Title
      doc.fontSize(24).font('Helvetica-Bold').text(overview.pollMetadata.title, { align: 'center' });
      doc.moveDown(0.5);
      
      // Meta
      doc.fontSize(12).font('Helvetica').fillColor('#666666');
      doc.text(`Status: ${overview.pollMetadata.status} | Total Responses: ${overview.engagement.totalResponses}`, { align: 'center' });
      doc.moveDown(2);
      
      // Questions
      doc.fillColor('#000000');
      questions.forEach((q, i) => {
        doc.fontSize(16).font('Helvetica-Bold').text(`Q${i + 1}: ${q.text}`);
        doc.moveDown(0.5);
        
        q.options.forEach(opt => {
          doc.fontSize(12).font('Helvetica').text(`• ${opt.text}: ${opt.votes} votes (${opt.percentage}%)`, { indent: 20 });
        });
        doc.moveDown(1.5);
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

