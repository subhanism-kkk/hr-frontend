import { z } from 'zod';

export const contactTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Contact Type name cannot be blank.')
    .max(50, 'Contact Type name cannot exceed 50 characters.'),

  description: z
    .string()
    .max(255, 'Description cannot exceed 255 characters.')
    .optional()
    .or(z.literal('')),
});

export const leaveTypeCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Leave type code cannot be blank.')
    .max(50, 'Code must not exceed 50 characters.'),

  name: z
    .string()
    .trim()
    .min(1, 'Leave type name cannot be blank.')
    .max(100, 'Name must not exceed 100 characters.'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters.')
    .optional()
    .or(z.literal('')),
});

export const leaveTypeUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Leave type name cannot be blank.')
    .max(100, 'Name must not exceed 100 characters.'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters.')
    .optional()
    .or(z.literal('')),
});

export const orderTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Order name cannot be blank.')
    .max(100, 'Order name cannot exceed 100 characters.'),

  description: z
    .string()
    .max(255, 'Description cannot exceed 255 characters.')
    .optional()
    .or(z.literal('')),

  code: z
    .string()
    .trim()
    .min(1, 'Code is required.')
    .max(10, 'Code cannot exceed 10 characters.'),
});

export const bonusTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Bonus type name cannot be blank.')
    .max(100, 'Bonus type name cannot exceed 100 characters.'),

  description: z
    .string()
    .max(255, 'Description cannot exceed 255 characters.')
    .optional()
    .or(z.literal('')),
});