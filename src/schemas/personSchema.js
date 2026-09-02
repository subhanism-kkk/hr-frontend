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

export const addressSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, 'Address cannot be blank.')
    .max(500, 'Address cannot exceed 500 characters.'),
});

export const personalInfoSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Gender is required.' }),
  }),
  dateOfBirth: z.string().min(1, 'Date of birth is required.'),
  finCode: z
    .string()
    .regex(/^[A-Z0-9]{7}$/, 'FIN must contain exactly 7 uppercase letters or digits.'),
});

export const contactSchema = z.object({
  contactTypeId: z.coerce.number().int().positive('Contact type is required.'),
  contactValue: z.string().trim().min(1, 'Contact value cannot be blank.'),
  isPrimary: z.boolean(),
});

export const photoSchema = z.object({
  filePath: z
    .string()
    .trim()
    .min(1, 'File path cannot be blank.')
    .max(500, 'File path cannot exceed 500 characters.'),
  isMain: z.boolean(),
});
