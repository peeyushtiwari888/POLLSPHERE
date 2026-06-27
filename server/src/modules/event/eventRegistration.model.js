import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'CANCELLED'],
      default: 'REGISTERED',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registrations for the same user and event if they are currently REGISTERED
eventRegistrationSchema.index({ event: 1, user: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'REGISTERED' } });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;
