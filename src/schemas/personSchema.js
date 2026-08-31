import { z } from 'zod';

export const personSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name cannot be blank.')
    .max(100, 'First name cannot exceed 100 characters.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name cannot be blank.')
    .max(100, 'Last name cannot exceed 100 characters.'),
});