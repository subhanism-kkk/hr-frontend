import { z } from "zod";

export const appointmentSchema = z.object({
  personId: z.number().int().positive(),
  staffingPlanId: z.number().int().positive(),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
});

export const dismissalSchema = z.object({
  personId: z.number().int().positive(),
  dismissalDate: z.string().min(1),
  description: z.string().max(500).optional(),
});

export const leaveSchema = z.object({
  personId: z.number().int().positive(),
  leaveTypeId: z.number().int().positive(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export const promotionSchema = z.object({
  personId: z.number().int().positive(),
  oldPositionId: z.number().int().positive(),
  newPositionId: z.number().int().positive(),
  effectiveDate: z.string().min(1),
});

export const salarySchema = z.object({
  staffingPlanId: z.number().int().positive(),
  newSalary: z.number().positive(),
  effectiveDate: z.string().min(1),
});

export const transferSchema = z.object({
  personId: z.number().int().positive(),
  oldStructureId: z.number().int().positive(),
  newStructureId: z.number().int().positive(),
  oldPositionId: z.number().int().positive(),
  newPositionId: z.number().int().positive(),
  effectiveDate: z.string().min(1),
});

export const bonusSchema = z.object({
  personId: z.number().int().positive(),
  bonusTypeId: z.number().int().positive(),
  calculationType: z.string().min(1),
  amount: z.number().positive(),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  reason: z.string().max(500).optional(),
});

export const staffingPlanSchema = z.object({
  orderId: z.number().int().positive(),
  structureId: z.number().int().positive(),
  positionId: z.number().int().positive(),
  salary: z.number().positive(),
  capacity: z.number().int().min(1),
});

export const structureSchema = z.object({
  name: z.string().min(1).max(150),
  orderId: z.number().int().positive(),
  parentStructureId: z.number().int().positive().nullable().optional(),
  isClosed: z.boolean().optional(),
});