import mongoose from 'mongoose';

// Nested Schema for Individual Answers
// We set `_id: false` because we don't need MongoDB to generate a unique ID 
// for every single answer inside the array.
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Question ID is required'],
    },
    // We store the ID of the selected option to keep it linked accurately,
    // even if the poll creator changes the option text later.
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Selected option is required'],
    },
  },
  { _id: false }
);

// Main Response Schema
const responseSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: [true, 'Poll ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional because polls can be anonymous. 
      // If the respondent is not logged in, this will be null.
      default: null,
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A response must contain at least one answer',
      },
    },
  },
  {
    timestamps: true, // Adds createdAt (when the vote was cast)
  }
);

// Compound index to prevent authenticated users from voting twice on the same poll.
// partialFilterExpression ensures this rule only applies to logged-in users (where userId exists).
responseSchema.index(
  { pollId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $ne: null } },
  }
);

const Response = mongoose.model('Response', responseSchema);

export default Response;
