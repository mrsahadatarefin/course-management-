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

export const courseRoute = route;
