import * as eventService from './event.service.js';

export const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create event' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await eventService.getEvents(req.query, req.user?.id);
    res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get events' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await eventService.getEvent(req.params.idOrSlug);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message || 'Event not found' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.user.id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({ success: false, message: error.message || 'Failed to update event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const result = await eventService.deleteEvent(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes('authorized') ? 403 : 400;
    res.status(statusCode).json({ success: false, message: error.message || 'Failed to delete event' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const registration = await eventService.registerForEvent(req.user.id, req.params.id);
    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: registration,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const result = await eventService.cancelRegistration(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Cancellation failed' });
  }
};

export const getEventParticipants = async (req, res) => {
  try {
    const result = await eventService.getEventParticipants(req.user.id, req.params.id, req.query);
    res.status(200).json({
      success: true,
      data: result.participants,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to get participants' });
  }
};

export const getEventAnalyticsDashboard = async (req, res) => {
  try {
    const data = await eventService.getEventAnalyticsDashboard(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch analytics' });
  }
};
