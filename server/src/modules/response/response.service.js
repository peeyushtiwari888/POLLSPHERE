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
