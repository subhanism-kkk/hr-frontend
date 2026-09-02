import { z } from 'zod';

export const statusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Status name cannot be blank.')
    .max(100, 'Status name cannot exceed 100 characters.'),

  code: z
    .string()
    .trim()
    .min(1, 'Status code cannot be blank.'),
});