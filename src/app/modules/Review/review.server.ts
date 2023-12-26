import { JwtPayload } from 'jsonwebtoken';
import { TReview } from './review.interface';
import { ReviewModel } from './review.model';

const createReviewIntoDb = async (userId: JwtPayload, payload: TReview) => {
  const review = {
    ...payload,
    createdBy: userId,
  };
  const result = ReviewModel.create(review);
  return result;
};

export const reviewService = {
  createReviewIntoDb,
};
