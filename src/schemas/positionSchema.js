import { z } from 'zod';

export const positionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Position name cannot be blank.')
    .max(100, 'Position name cannot exceed 100 characters.'),

  description: z
    .string()
    .trim()
    .min(1, 'Position description cannot be blank.')
    .max(255, 'Position description cannot exceed 255 characters.'),
});