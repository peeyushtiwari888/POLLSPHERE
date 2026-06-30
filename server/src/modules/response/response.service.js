import Poll from '../poll/poll.model.js';
import Response from './response.model.js';
import { 
  emitResponseSubmitted, 
  emitAnalyticsUpdated,
  emitLiveResponseUpdate,
  emitLiveQuestionUpdate 
} from '../../emitters.js';
import { getQuestionWiseAnalytics } from '../analytics/analytics.service.js';

/**
 * Submit a response to a poll
 */
export const submitResponse = async (pollId, userId, answers) => {
  // 1. Verify poll exists
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  // 2. Verify poll has not expired
  if (new Date() > new Date(poll.expiryDate)) {
    throw new Error('This poll has expired and is no longer accepting responses');
  }

  // 3. Check response mode (anonymous vs authenticated)
  if (!poll.isAnonymous && !userId) {
    throw new Error('This poll requires authentication. Anonymous responses are not allowed.');
  }

  // Prevent multiple votes for authenticated users
  if (userId) {
    const existingResponse = await Response.findOne({ pollId, userId });
    if (existingResponse) {
      throw new Error('You have already submitted a response to this poll');
    }
  }

  // 4. Map the actual poll questions for quick validation lookups
  const questionMap = new Map();
  poll.questions.forEach((q) => {
    questionMap.set(q._id.toString(), q);
  });

  const submittedQuestionIds = new Set(answers.map((a) => a.questionId.toString()));

  // 5. Validate that all "isRequired" questions have been answered
  for (const question of poll.questions) {
    if (question.isRequired && !submittedQuestionIds.has(question._id.toString())) {
      throw new Error(`A required question is missing an answer: "${question.text}"`);
    }
  }

  // 6. Validate that the submitted answers actually belong to the poll
  for (const answer of answers) {
    const pollQuestion = questionMap.get(answer.questionId.toString());
    
    if (!pollQuestion) {
      throw new Error(`Invalid question ID provided: ${answer.questionId}`);
    }

    // Validation logic based on Question Type
    switch (pollQuestion.questionType) {
      case 'SINGLE_CHOICE': {
        if (!answer.selectedOption) throw new Error(`Missing option for single-choice question: "${pollQuestion.text}"`);
        const isValidOption = pollQuestion.options.some((opt) => opt._id.toString() === answer.selectedOption.toString());
        if (!isValidOption) throw new Error(`Invalid option selected for question: "${pollQuestion.text}"`);
        break;
      }
      case 'MULTI_SELECT': {
        if (!answer.selectedOptions || answer.selectedOptions.length === 0) {
           throw new Error(`At least one option is required for multi-select question: "${pollQuestion.text}"`);
        }
        const validOptionIds = new Set(pollQuestion.options.map(opt => opt._id.toString()));
        for (const selected of answer.selectedOptions) {
          if (!validOptionIds.has(selected.toString())) {
            throw new Error(`Invalid option selected for question: "${pollQuestion.text}"`);
          }
        }
        break;
      }
      case 'OPEN_TEXT':
      case 'WORD_CLOUD': {
        if (typeof answer.textValue !== 'string' || !answer.textValue.trim()) {
          throw new Error(`Text answer is required for question: "${pollQuestion.text}"`);
        }
        break;
      }
      case 'RATING': {
        if (typeof answer.ratingValue !== 'number' || answer.ratingValue < 1 || answer.ratingValue > 5) {
          throw new Error(`A valid rating between 1 and 5 is required for question: "${pollQuestion.text}"`);
        }
        break;
      }
      default:
        throw new Error(`Unsupported question type: ${pollQuestion.questionType}`);
    }
  }

  // 7. Save the response to the database
  const response = await Response.create({
    pollId,
    userId: userId || null,
    answers,
  });

  // 8. Fire Real-Time Socket Events (Only happens if save was successful)
  // We emit the new response directly
  emitResponseSubmitted(pollId, response);
  
  // We also recalculate the latest analytics and emit them so charts update instantly
  const updatedAnalytics = await getQuestionWiseAnalytics(pollId, poll.creatorId);
  emitAnalyticsUpdated(pollId, updatedAnalytics);

  // Emit Live Event Mode updates
  emitLiveResponseUpdate(pollId);
  emitLiveQuestionUpdate(pollId);

  return response;
};

/**
 * Submit a LIVE partial response to a single question
 */
export const submitLiveResponse = async (pollId, userId, participantId, answer) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error('Poll not found');

  // Verify poll is live and active
  if (poll.status !== 'PUBLISHED' && poll.status !== 'ACTIVE') {
    throw new Error('This poll is not currently live');
  }

  // Find the question
  const question = poll.questions.find(q => q._id.toString() === answer.questionId.toString());
  if (!question) throw new Error('Question not found in this poll');

  // Verify the question is the currently active one
  if (poll.activeQuestionId?.toString() !== question._id.toString()) {
    throw new Error('This question is not currently active');
  }

  // Timer Check & Scoring Calculations
  let elapsedMs = 0;
  if (poll.activeQuestionStartTime) {
    elapsedMs = Date.now() - new Date(poll.activeQuestionStartTime).getTime();
    const elapsedSeconds = elapsedMs / 1000;
    if (elapsedSeconds > (question.duration || 30)) {
      throw new Error('Time is up for this question');
    }
  }

  // Calculate Correctness
  let isCorrect = false;
  if (question.questionType === 'SINGLE_CHOICE') {
    const selectedOpt = question.options.find(o => o._id.toString() === answer.selectedOption?.toString());
    if (selectedOpt && selectedOpt.isCorrect) isCorrect = true;
  } else if (question.questionType === 'MULTI_SELECT') {
    const correctOptions = question.options.filter(o => o.isCorrect).map(o => o._id.toString());
    const selectedOptions = answer.selectedOptions?.map(id => id.toString()) || [];
    
    // Check if lengths match and all correct options are selected
    if (correctOptions.length > 0 && correctOptions.length === selectedOptions.length) {
      isCorrect = correctOptions.every(id => selectedOptions.includes(id));
    }
  }

  // Calculate Score (Kahoot style)
  let score = 0;
  if (isCorrect) {
    const maxPoints = question.points || 1000;
    const maxTimeMs = (question.duration || 30) * 1000;
    // Math.round(maxPoints * (1 - (elapsedMs / (maxTimeMs * 2))))
    // e.g. answer instantly -> 1000 points. Answer at 30s -> 500 points.
    score = Math.max(0, Math.round(maxPoints * (1 - (elapsedMs / (maxTimeMs * 2)))));
  }

  answer.score = score;
  answer.timeTaken = elapsedMs;
  answer.isCorrect = isCorrect;

  // Find existing response document for this user/participant
  const query = userId ? { pollId, userId } : { pollId, participantId };
  let response = await Response.findOne(query);

  if (!response) {
    // Create new if it doesn't exist
    response = new Response({
      pollId,
      userId: userId || null,
      participantId: participantId || null,
      answers: []
    });
  }

  // Check if they already answered this question
  const existingAnswerIndex = response.answers.findIndex(a => a.questionId.toString() === answer.questionId.toString());
  if (existingAnswerIndex !== -1) {
    // Override their answer
    response.answers[existingAnswerIndex] = answer;
  } else {
    // Push new answer
    response.answers.push(answer);
  }

  // Recalculate Total Score and Total Time Taken
  response.totalScore = response.answers.reduce((sum, ans) => sum + (ans.score || 0), 0);
  response.totalTimeTaken = response.answers.reduce((sum, ans) => sum + (ans.timeTaken || 0), 0);

  await response.save();

  // Recalculate Analytics
  const updatedAnalytics = await getQuestionWiseAnalytics(pollId, poll.creatorId);
  emitAnalyticsUpdated(pollId, updatedAnalytics);
  emitLiveResponseUpdate(pollId);
  emitLiveQuestionUpdate(pollId);

  // Calculate Rank
  // Rank is number of people with higher score + 1. If tied, check who has lower totalTimeTaken.
  const higherScoreCount = await Response.countDocuments({
    pollId,
    $or: [
      { totalScore: { $gt: response.totalScore } },
      { totalScore: response.totalScore, totalTimeTaken: { $lt: response.totalTimeTaken } }
    ]
  });
  
  const currentRank = higherScoreCount + 1;

  return {
    ...response.toObject(),
    scoreAwarded: score,
    isCorrect,
    currentRank
  };
};

/**
 * Fetch all responses for a specific poll
 * Only the poll creator is authorized to view these responses.
 */
export const getResponsesByPollId = async (pollId, userId) => {
  // 1. Verify poll exists
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  // 2. Verify ownership (Only the creator can see the raw responses)
  if (poll.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to view responses for this poll');
  }

  // 3. Fetch responses
  // We populate userId with just the username so we don't expose sensitive info like emails or hashed passwords.
  // Anonymous responses will just have userId as null.
  const responses = await Response.find({ pollId })
    .populate('userId', 'username')
    .sort({ createdAt: -1 });

  return responses;
};
