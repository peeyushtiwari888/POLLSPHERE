import { z } from 'zod';

// Reusable Nested Schemas

const optionValidation = z.object({
  text: z
    .string({ required_error: 'Option text is required' })
    .trim()
    .min(1, 'Option text cannot be empty'),
});

const questionValidation = z.object({
  text: z
    .string({ required_error: 'Question text is required' })
    .trim()
    .min(1, 'Question text cannot be empty'),
  isRequired: z.boolean().optional(),
  options: z
    .array(optionValidation)
    .min(2, 'Each question must have at least two options'),
});

// Request Validation Schemas

export const createPollSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Poll title is required' })
      .trim()
      .min(1, 'Poll title cannot be empty')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
    isAnonymous: z.boolean().optional(),
    expiryDate: z
      .string({ required_error: 'Expiry date is required' })
      .datetime({ message: 'Invalid datetime format. Expected ISO 8601 string.' })
      .refine((val) => new Date(val) > new Date(), {
        message: 'Expiry date must be in the future',
      }),
    questions: z
      .array(questionValidation)
      .min(1, 'A poll must contain at least one question'),
  }),
});

export const updatePollSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Poll ID format'),
  }),
  body: z.object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    isAnonymous: z.boolean().optional(),
    expiryDate: z
      .string()
      .datetime({ message: 'Invalid datetime format. Expected ISO 8601 string.' })
      .refine((val) => new Date(val) > new Date(), {
        message: 'Expiry date must be in the future',
      })
      .optional(),
    questions: z.array(questionValidation).min(1).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  }),
});

export const publishPollSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Poll ID format'),
  }),
});
