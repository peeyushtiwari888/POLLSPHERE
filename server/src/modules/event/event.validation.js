import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).trim().min(1).max(150),
    shortDescription: z.string({ required_error: 'Short description is required' }).trim().min(1).max(300),
    description: z.string({ required_error: 'Description is required' }).trim().min(1).max(10000),
    thumbnail: z.string({ required_error: 'Thumbnail URL is required' }).url('Invalid thumbnail URL'),
    banner: z.string().url('Invalid banner URL').optional(),
    category: z.string({ required_error: 'Category is required' }).trim().min(1),
    type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID'], { required_error: 'Type must be ONLINE, OFFLINE, or HYBRID' }),
    venue: z.string().trim().optional(),
    meetingLink: z.string().url('Invalid meeting link URL').optional(),
    startDate: z.string({ required_error: 'Start date is required' }).datetime({ message: 'Invalid start date format' }),
    endDate: z.string({ required_error: 'End date is required' }).datetime({ message: 'Invalid end date format' }),
    maxParticipants: z.number().int().positive().optional(),
    registrationRequired: z.boolean().optional(),
    registrationDeadline: z.string().datetime({ message: 'Invalid registration deadline format' }).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED']).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    tags: z.array(z.string()).optional(),
  }).refine((data) => {
    if (data.type === 'OFFLINE' || data.type === 'HYBRID') {
      return !!data.venue && data.venue.trim().length > 0;
    }
    return true;
  }, {
    message: "Venue is required for OFFLINE or HYBRID events",
    path: ["venue"],
  }).refine((data) => {
    if (data.type === 'ONLINE' || data.type === 'HYBRID') {
      return !!data.meetingLink && data.meetingLink.trim().length > 0;
    }
    return true;
  }, {
    message: "Meeting link is required for ONLINE or HYBRID events",
    path: ["meetingLink"],
  }).refine((data) => {
    return new Date(data.endDate) > new Date(data.startDate);
  }, {
    message: "End date must be after start date",
    path: ["endDate"],
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format'),
  }),
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
    shortDescription: z.string().trim().min(1).max(300).optional(),
    description: z.string().trim().min(1).max(10000).optional(),
    thumbnail: z.string().url('Invalid thumbnail URL').optional(),
    banner: z.string().url('Invalid banner URL').optional(),
    category: z.string().trim().min(1).optional(),
    type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).optional(),
    venue: z.string().trim().optional(),
    meetingLink: z.string().url('Invalid meeting link URL').optional(),
    startDate: z.string().datetime({ message: 'Invalid start date format' }).optional(),
    endDate: z.string().datetime({ message: 'Invalid end date format' }).optional(),
    maxParticipants: z.number().int().positive().optional(),
    registrationRequired: z.boolean().optional(),
    registrationDeadline: z.string().datetime({ message: 'Invalid registration deadline format' }).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED']).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    tags: z.array(z.string()).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  }),
});
