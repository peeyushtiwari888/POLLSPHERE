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
      createdAt: poll.createdAt,
      activeQuestionId: poll.activeQuestionId,
      participationCode: poll.participationCode
    },
    engagement: responseData
  };
};

/**
 * Generate detailed question-by-question analytics (vote distribution, ratings, text)
 */
export const getQuestionWiseAnalytics = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error('Poll not found');
  if (poll.creatorId.toString() !== userId.toString()) throw new Error('Not authorized to view analytics');

  const responses = await Response.find({ pollId });

  const questionAnalytics = poll.questions.map((question) => {
    let totalVotesForQuestion = 0;
    
    // Structure depends on question type
    const result = {
      questionId: question._id,
      text: question.text,
      duration: question.duration,
      questionType: question.questionType,
      totalVotes: 0,
    };

    if (['SINGLE_CHOICE', 'MULTI_SELECT'].includes(question.questionType)) {
      // Map options to count votes
      const optionCounts = {};
      question.options.forEach(opt => optionCounts[opt._id.toString()] = 0);

      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer) {
          if (answer.selectedOption && optionCounts[answer.selectedOption.toString()] !== undefined) {
            optionCounts[answer.selectedOption.toString()]++;
            totalVotesForQuestion++;
          }
          if (answer.selectedOptions && Array.isArray(answer.selectedOptions)) {
            answer.selectedOptions.forEach(optId => {
              if (optionCounts[optId.toString()] !== undefined) {
                optionCounts[optId.toString()]++;
                totalVotesForQuestion++;
              }
            });
          }
        }
      });

      result.totalVotes = totalVotesForQuestion;
      result.options = question.options.map(opt => ({
        optionId: opt._id,
        text: opt.text,
        votes: optionCounts[opt._id.toString()],
        percentage: totalVotesForQuestion === 0 ? 0 : Number(((optionCounts[opt._id.toString()] / totalVotesForQuestion) * 100).toFixed(1))
      }));
    } else if (['OPEN_TEXT', 'WORD_CLOUD'].includes(question.questionType)) {
      const texts = [];
      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer && answer.textValue) {
          texts.push(answer.textValue);
          totalVotesForQuestion++;
        }
      });
      result.totalVotes = totalVotesForQuestion;
      result.texts = texts;
    } else if (question.questionType === 'RATING') {
      let ratingSum = 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer && answer.ratingValue) {
          ratingSum += answer.ratingValue;
          ratingDistribution[answer.ratingValue] = (ratingDistribution[answer.ratingValue] || 0) + 1;
          totalVotesForQuestion++;
        }
      });
      
      result.totalVotes = totalVotesForQuestion;
      result.averageRating = totalVotesForQuestion === 0 ? 0 : Number((ratingSum / totalVotesForQuestion).toFixed(1));
      result.ratingDistribution = ratingDistribution;
    }

    return result;
  });

  return questionAnalytics;
};

/**
 * Generate public results for a published poll
 * This function does NOT require authentication, but only works if the creator has published the results.
 */
export const getPublicPollResults = async (pollId) => {
  const poll = await Poll.findById(pollId).select('title description isResultsPublished questions');
  if (!poll) throw new Error('Poll not found');
  if (!poll.isResultsPublished) throw new Error('Results for this poll are private and have not been published yet');

  const responses = await Response.find({ pollId });

  const questionAnalytics = poll.questions.map((question) => {
    let totalVotesForQuestion = 0;
    const result = {
      questionId: question._id,
      text: question.text,
      questionType: question.questionType,
      totalVotes: 0,
    };

    if (['SINGLE_CHOICE', 'MULTI_SELECT'].includes(question.questionType)) {
      const optionCounts = {};
      question.options.forEach(opt => optionCounts[opt._id.toString()] = 0);

      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer) {
          if (answer.selectedOption && optionCounts[answer.selectedOption.toString()] !== undefined) {
            optionCounts[answer.selectedOption.toString()]++;
            totalVotesForQuestion++;
          }
          if (answer.selectedOptions && Array.isArray(answer.selectedOptions)) {
            answer.selectedOptions.forEach(optId => {
              if (optionCounts[optId.toString()] !== undefined) {
                optionCounts[optId.toString()]++;
                totalVotesForQuestion++;
              }
            });
          }
        }
      });

      result.totalVotes = totalVotesForQuestion;
      result.options = question.options.map(opt => ({
        optionId: opt._id,
        text: opt.text,
        votes: optionCounts[opt._id.toString()],
        percentage: totalVotesForQuestion === 0 ? 0 : Number(((optionCounts[opt._id.toString()] / totalVotesForQuestion) * 100).toFixed(1))
      }));
    } else if (['OPEN_TEXT', 'WORD_CLOUD'].includes(question.questionType)) {
      const texts = [];
      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer && answer.textValue) {
          texts.push(answer.textValue);
          totalVotesForQuestion++;
        }
      });
      result.totalVotes = totalVotesForQuestion;
      result.texts = texts;
    } else if (question.questionType === 'RATING') {
      let ratingSum = 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      responses.forEach(res => {
        const answer = res.answers.find(a => a.questionId.toString() === question._id.toString());
        if (answer && answer.ratingValue) {
          ratingSum += answer.ratingValue;
          ratingDistribution[answer.ratingValue] = (ratingDistribution[answer.ratingValue] || 0) + 1;
          totalVotesForQuestion++;
        }
      });
      
      result.totalVotes = totalVotesForQuestion;
      result.averageRating = totalVotesForQuestion === 0 ? 0 : Number((ratingSum / totalVotesForQuestion).toFixed(1));
      result.ratingDistribution = ratingDistribution;
    }

    return result;
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

