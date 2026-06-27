import express from 'express';
import * as eventController from './event.controller.js';
import { protect, optionalProtect } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import { createEventSchema, updateEventSchema } from './event.validation.js';

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', protect, validate(createEventSchema), eventController.createEvent);

// @route   GET /api/events
// @desc    Get all events (filtered by auth status inside service)
// @access  Public / Private
router.get('/', optionalProtect, eventController.getEvents);

// @route   GET /api/events/analytics/dashboard
// @desc    Get comprehensive event analytics for the logged-in organizer
// @access  Private
router.get('/analytics/dashboard', protect, eventController.getEventAnalyticsDashboard);

// @route   GET /api/events/:idOrSlug
// @desc    Get a specific event by ID or Slug
// @access  Public
router.get('/:idOrSlug', eventController.getEvent);

// @route   PATCH/PUT /api/events/:id
// @desc    Update an event
// @access  Private (Only Organizer)
router.patch('/:id', protect, validate(updateEventSchema), eventController.updateEvent);
router.put('/:id', protect, validate(updateEventSchema), eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Only Organizer)
router.delete('/:id', protect, eventController.deleteEvent);

// --- Registration Routes ---

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', protect, eventController.registerForEvent);

// @route   DELETE /api/events/:id/register
// @desc    Cancel registration
// @access  Private
router.delete('/:id/register', protect, eventController.cancelRegistration);

// @route   GET /api/events/:id/participants
// @desc    Get event participants
// @access  Private (Only Organizer)
router.get('/:id/participants', protect, eventController.getEventParticipants);

export default router;
