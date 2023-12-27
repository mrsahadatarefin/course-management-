import express from 'express';
import { courseController } from './courese.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './courese.validation';
import auth from '../../middlewares/auth';
import { User_Role } from '../User/user.constent';

const route = express.Router();
route.post(
  '/',
  auth(User_Role.admin),
  validateRequest(createCourseValidationSchema),
  courseController.createCourse,
);
route.get('/', courseController.AllCourse);
route.get('/best', courseController.getCourseByBestRating);
route.get('/:courseId/reviews', courseController.getReviewByCourseId);
route.put(
  '/:courseId',
  auth(User_Role.admin),
  validateRequest(updateCourseValidationSchema),
  courseController.updateCourse,
);

export const courseRoute = route;
