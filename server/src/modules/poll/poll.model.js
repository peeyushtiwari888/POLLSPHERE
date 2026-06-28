import mongoose from 'mongoose';

// Nested Schema for Options
// We use a nested schema for options to automatically generate a unique `_id` for each option.
// This makes it much easier to track which exact option a user selected in the Responses collection,
// even if the creator later edits the text of the option.
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

// Nested Schema for Questions
// Questions are tightly coupled to a Poll. Nesting them avoids the need for separate collections 
// and expensive join queries ($lookup). When you load a Poll, you usually need all its questions instantly.
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  isRequired: {
    type: Boolean,
    default: true, // By default, questions are mandatory
  },
  duration: {
    type: Number,
    default: 30, // seconds
    min: [5, 'Duration must be at least 5 seconds'],
  },
  points: {
    type: Number,
    default: 10,
    min: [0, 'Points cannot be negative'],
  },
  questionType: {
    type: String,
    enum: ['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER'],
    default: 'MULTIPLE_CHOICE',
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (v) {
        return v && v.length >= 2; // A multiple-choice question must have at least 2 options
      },
      message: 'A question must have at least two options.',
    },
  },
});

// Main Poll Schema
const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Poll title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Poll must have a creator'],
    },
    isAnonymous: {
      type: Boolean,
      default: false, // If true, responders don't need to be authenticated/tracked
    },
    participationCode: {
      type: String,
      trim: true,
      default: '',
    },
    isResultsPublished: {
      type: Boolean,
      default: false, // Controls whether public users can see the analytics dashboard
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'PAUSED'],
      default: 'DRAFT',
    },
    scheduledPublishDate: {
      type: Date,
      // If status is SCHEDULED, this should be populated.
    },
    isArchived: {
      type: Boolean,
      default: false, // Soft delete/archive status
    },
    expiryDate: {
      type: Date,
      required: [true, 'Poll must have an expiry date'],
      validate: {
        validator: function (value) {
          // Ensure the expiry date is in the future when creating the poll
          return value > new Date();
        },
        message: 'Expiry date must be in the future',
      },
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (v) {
          return v && v.length >= 1; // A poll must have at least 1 question
        },
        message: 'A poll must contain at least one question.',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Helper method to check if the poll is currently expired
pollSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate;
};

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
