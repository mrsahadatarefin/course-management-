import { TReview } from './review.interface';
import { ReviewModel } from './review.model';

const createReviewIntoDb = async (payload: TReview) => {
  const result = ReviewModel.create(payload);
  return result;
};

export const reviewService = {
  createReviewIntoDb,
};
