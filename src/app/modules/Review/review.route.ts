import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { CreateReviewSchema } from './review.validation';
import { reviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { User_Role } from '../User/user.constent';

const route = express.Router();
route.post(
  '/',
  auth(User_Role.user),
  validateRequest(CreateReviewSchema),
  reviewController.createReview,
);

export const reviewRoute = route;
