import { z } from "zod";

export const structureResponseSchema = z.object({
  id: z.number(),

  name: z.string(),

  orderId: z.number().nullable().optional(),

  parentStructureId: z.number().nullable().optional(),

  parentStructureName: z.string().nullable().optional(),

  isClosed: z.boolean().nullable().optional(),

  createdAt: z.string().nullable().optional(),

  updatedAt: z.string().nullable().optional(),

  statusId: z.number().nullable().optional(),

  statusName: z.string().nullable().optional(),
});

export const structurePageSchema = z.object({
  content: z.array(structureResponseSchema),

  page: z.number(),

  size: z.number(),

  totalElements: z.number(),

  totalPages: z.number(),

  first: z.boolean(),

  last: z.boolean(),
});

export const structureColumns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Structure",
    sortable: true,
  },
  {
    key: "parentStructureName",
    label: "Parent Structure",
    sortable: true,
  },
  {
    key: "isClosed",
    label: "Closed",
    sortable: true,
  },
  {
    key: "statusName",
    label: "Status",
    sortable: true,
  },
];