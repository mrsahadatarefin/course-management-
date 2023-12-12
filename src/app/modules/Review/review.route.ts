import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { CreateReviewSchema } from './review.validation';
import { reviewController } from './review.controller';

const route = express.Router();
route.post(
  '/',
  validateRequest(CreateReviewSchema),
  reviewController.createReview,
);

export const reviewRoute = route;
