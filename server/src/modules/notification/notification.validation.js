import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Notification ID format'),
  }),
});
