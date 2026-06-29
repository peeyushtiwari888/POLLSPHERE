import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    thumbnail: {
      type: String, // URL
      required: [true, 'Event thumbnail is required'],
    },
    banner: {
      type: String, // URL
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
      required: [true, 'Event type is required'],
    },
    venue: {
      type: String,
      trim: true,
      // Required if OFFLINE or HYBRID, we will validate this in Joi/Zod or pre-save
    },
    meetingLink: {
      type: String,
      trim: true,
      // Required if ONLINE or HYBRID
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must have an organizer'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Must allow at least 1 participant'],
    },
    registrationRequired: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
    },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save validation for Dates
eventSchema.pre('save', function () {
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date.');
  }
  if (this.registrationDeadline && this.registrationDeadline > this.startDate) {
    throw new Error('Registration deadline must be before the event starts.');
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
