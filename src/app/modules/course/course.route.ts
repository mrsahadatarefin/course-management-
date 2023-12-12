import express from 'express';
import { courseController } from './courese.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCourseValidationSchema } from './courese.validation';

const route = express.Router();
route.post(
  '/',
  validateRequest(createCourseValidationSchema),
  courseController.createCourse,
);
route.get('/:courseId/reviews', courseController.getReviewByCourseId);

export const courseRoute = route;
