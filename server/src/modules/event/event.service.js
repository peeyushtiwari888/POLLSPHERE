import Event from './event.model.js';
import EventRegistration from './eventRegistration.model.js';

/**
 * Generate a unique slug from a title
 */
const generateSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  let slug = baseSlug;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const existing = await Event.findOne({ slug });
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

/**
 * Create a new event
 */
export const createEvent = async (userId, eventData) => {
  const slug = await generateSlug(eventData.title);
  
  const event = new Event({
    ...eventData,
    slug,
    organizer: userId,
    createdBy: userId,
  });

  await event.save();
  return event;
};

/**
 * Get events with filters and pagination
 */
export const getEvents = async (query = {}, userId = null) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    visibility,
    category,
    type,
    search,
    sortBy = 'startDate',
    sortOrder = 'asc'
  } = query;

  const filter = {};

  // If user is NOT logged in or requesting public events, restrict visibility
  if (!userId || visibility === 'PUBLIC') {
    filter.visibility = 'PUBLIC';
    filter.status = 'PUBLISHED'; // Usually only published public events are shown to guests
  } else {
    // If logged in, they can see their own events + other public published events
    // But typically this endpoint is to list events for a dashboard. Let's assume dashboard list:
    filter.organizer = userId;
  }

  if (status && filter.organizer === userId) filter.status = status;
  if (category) filter.category = category;
  if (type) filter.type = type;

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const events = await Event.find(filter)
    .populate('organizer', 'name email profilePicture')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(filter);

  return {
    events,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a specific event by ID or slug
 */
export const getEvent = async (identifier) => {
  // Check if identifier is a valid MongoDB ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const event = await Event.findOne(query).populate('organizer', 'name email profilePicture bio');

  if (!event) {
    throw new Error('Event not found');
  }

  return event;
};

/**
 * Update an event
 */
export const updateEvent = async (userId, eventId, updateData) => {
  const event = await Event.findOne({ _id: eventId, organizer: userId });

  if (!event) {
    throw new Error('Event not found or you do not have permission to edit it');
  }

  // Prevent title updates from changing the slug unless explicitly handled (omitted for safety)
  if (updateData.title && updateData.title !== event.title) {
    // Optionally update slug, but it's usually bad for SEO. We'll leave the old slug.
  }

  Object.assign(event, updateData);
  event.updatedBy = userId;

  await event.save();
  return event;
};

/**
 * Delete an event
 */
export const deleteEvent = async (userId, eventId) => {
  const event = await Event.findOne({ _id: eventId, organizer: userId });

  if (!event) {
    throw new Error('Event not found or you do not have permission to delete it');
  }

  await event.deleteOne();
  return { message: 'Event successfully deleted' };
};

/**
 * Register a user for an event
 */
export const registerForEvent = async (userId, eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  if (!event.registrationRequired) {
    throw new Error('This event does not require registration');
  }

  if (event.status !== 'PUBLISHED') {
    throw new Error('Event is not open for registration');
  }

  if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
    throw new Error('Registration deadline has passed');
  }

  // Check capacity if limit exists
  if (event.maxParticipants) {
    const currentParticipants = await EventRegistration.countDocuments({ event: eventId, status: 'REGISTERED' });
    if (currentParticipants >= event.maxParticipants) {
      throw new Error('Event has reached maximum capacity');
    }
  }

  // Check for duplicate
  const existingRegistration = await EventRegistration.findOne({ event: eventId, user: userId, status: 'REGISTERED' });
  if (existingRegistration) {
    throw new Error('You are already registered for this event');
  }

  const registration = new EventRegistration({
    event: eventId,
    user: userId,
    status: 'REGISTERED',
  });

  await registration.save();
  return registration;
};

/**
 * Cancel registration for an event
 */
export const cancelRegistration = async (userId, eventId) => {
  const registration = await EventRegistration.findOne({ event: eventId, user: userId, status: 'REGISTERED' });

  if (!registration) {
    throw new Error('Active registration not found');
  }

  registration.status = 'CANCELLED';
  await registration.save();

  return { message: 'Registration successfully cancelled' };
};

/**
 * Get all participants for an event (Organizer only)
 */
export const getEventParticipants = async (organizerId, eventId, query = {}) => {
  const event = await Event.findOne({ _id: eventId, organizer: organizerId });

  if (!event) {
    throw new Error('Event not found or you do not have permission to view participants');
  }

  const { page = 1, limit = 20, status = 'REGISTERED' } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const participants = await EventRegistration.find({ event: eventId, status })
    .populate('user', 'name email profilePicture')
    .sort({ registeredAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await EventRegistration.countDocuments({ event: eventId, status });

  return {
    participants,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get Event Analytics Dashboard for an organizer
 */
export const getEventAnalyticsDashboard = async (organizerId) => {
  const mongoose = (await import('mongoose')).default;
  const ObjectId = mongoose.Types.ObjectId;

  // 1. Event Stats (Upcoming, Completed, Cancelled, Category Distribution, Capacity)
  const eventStatsPipeline = [
    { $match: { organizer: new ObjectId(organizerId) } },
    {
      $facet: {
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            }
          }
        ],
        upcomingCount: [
          {
            $match: {
              status: 'PUBLISHED',
              startDate: { $gt: new Date() }
            }
          },
          { $count: 'count' }
        ],
        categoryDistribution: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ],
        capacityStats: [
          {
            $match: {
              maxParticipants: { $exists: true, $ne: null }
            }
          },
          {
            $group: {
              _id: null,
              totalCapacity: { $sum: '$maxParticipants' }
            }
          }
        ]
      }
    }
  ];

  const eventStatsResult = await Event.aggregate(eventStatsPipeline);
  const eStats = eventStatsResult[0];

  const getCount = (arr, idMatch = null) => {
    if (!arr || arr.length === 0) return 0;
    if (!idMatch) return arr[0].count || 0;
    const item = arr.find(x => x._id === idMatch);
    return item ? item.count : 0;
  };

  const completedEvents = getCount(eStats.statusCounts, 'COMPLETED');
  const cancelledEvents = getCount(eStats.statusCounts, 'CANCELLED');
  const upcomingEvents = getCount(eStats.upcomingCount);
  const totalCapacity = eStats.capacityStats[0]?.totalCapacity || 0;

  const categoryDistribution = eStats.categoryDistribution.map(item => ({
    category: item._id,
    count: item.count
  }));

  // 2. Registration Stats
  const organizerEvents = await Event.find({ organizer: organizerId }, '_id maxParticipants');
  const eventIds = organizerEvents.map(e => e._id);
  const capacityEventIds = organizerEvents.filter(e => e.maxParticipants).map(e => e._id);

  const registrationPipeline = [
    { $match: { event: { $in: eventIds }, status: 'REGISTERED' } },
    {
      $facet: {
        totalRegistrations: [
          { $count: 'count' }
        ],
        capacityRegistrations: [
          { $match: { event: { $in: capacityEventIds } } },
          { $count: 'count' }
        ],
        monthlyRegistrations: [
          {
            $group: {
              _id: {
                year: { $year: '$registeredAt' },
                month: { $month: '$registeredAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]
      }
    }
  ];

  const regStatsResult = await EventRegistration.aggregate(registrationPipeline);
  const rStats = regStatsResult[0];

  const totalRegistrations = getCount(rStats.totalRegistrations);
  const capacityRegs = getCount(rStats.capacityRegistrations);

  // Attendance Rate Calculation
  let attendanceRate = 0;
  if (totalCapacity > 0) {
    attendanceRate = Math.round((capacityRegs / totalCapacity) * 100);
  } else if (totalRegistrations > 0) {
    // If there are registrations but no max capacity set on any event, we just assume 100% capacity utilization conceptually
    attendanceRate = 100;
  }

  const monthlyRegistrations = rStats.monthlyRegistrations.map(item => {
    const date = new Date(item._id.year, item._id.month - 1);
    return {
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      count: item.count
    };
  });

  return {
    totalRegistrations,
    upcomingEvents,
    completedEvents,
    cancelledEvents,
    attendanceRate,
    categoryDistribution,
    monthlyRegistrations
  };
};
