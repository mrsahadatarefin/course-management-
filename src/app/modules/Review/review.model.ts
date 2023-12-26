import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    review: String,
  },

  {
    timestamps: true,
  },
);
export const ReviewModel = model<TReview>('review', reviewSchema);
