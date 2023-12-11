import { z } from 'zod';
export const reviewSchema = z.object({
  courseId: z.string(),
  rating: z.number(),
  review: z.string(),
});
