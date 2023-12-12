import { z } from 'zod';
export const CreateReviewSchema = z.object({
  body: z.object({
    course: z.string(),
    rating: z.number(),
    review: z.string(),
  }),
});
