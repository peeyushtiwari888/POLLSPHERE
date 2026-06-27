import { z } from 'zod';

// Reusable schema for validating an individual answer
const answerValidation = z.object({
  questionId: z
    .string({ required_error: 'Question ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Question ID format'),
  selectedOption: z
    .string({ required_error: 'Selected Option is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Option ID format'),
});

// Main schema for submitting a poll response
export const submitResponseSchema = z.object({
  body: z.object({
    pollId: z
      .string({ required_error: 'Poll ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Poll ID format'),
    answers: z
      .array(answerValidation, { required_error: 'Answers array is required' })
      .min(1, 'You must provide at least one answer to submit a response'),
  }),
});
