import { z } from 'zod';

const TagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});
const DetailsValidationSchema = z.object({
  level: z.string(),
  description: z.string(),
});
export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    instructor: z.string(),
    categoryId: z.string(),
    price: z.string(),
    tags: z.array(TagsValidationSchema),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    durationInWeeks: z.number(),
    details: DetailsValidationSchema,
  }),
});
export const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    instructor: z.string().optional(),
    categoryId: z.string().optional(),
    price: z.string().optional(),
    tags: z.array(TagsValidationSchema).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    durationInWeeks: z.number().optional(),
    details: DetailsValidationSchema.optional(),
  }),
});
