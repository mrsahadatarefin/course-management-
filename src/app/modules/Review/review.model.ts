import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  rating: Number,
  review: String,
});
export const ReviewModel = model<TReview>('review', reviewSchema);
