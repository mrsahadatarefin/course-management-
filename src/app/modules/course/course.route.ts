import express from 'express';
import { courseController } from './courese.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './courese.validation';

const route = express.Router();
route.post(
  '/',
  validateRequest(createCourseValidationSchema),
  courseController.createCourse,
);
route.get('/', courseController.AllCourse);
route.get('/best', courseController.getCourseByBestRating);
route.get('/:courseId/reviews', courseController.getReviewByCourseId);
route.put(
  '/:courseId',
  validateRequest(updateCourseValidationSchema),
  courseController.updateCourse,
);

export const courseRoute = route;
