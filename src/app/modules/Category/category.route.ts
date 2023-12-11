import express from 'express';
import { categoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCategoryValidationSchema } from './category.validation';
const route = express.Router();
route.post(
  '/',
  validateRequest(createCategoryValidationSchema),
  categoryController.createCategory,
);
route.get('/', categoryController.getAllCategory);

export const categoryRoute = route;
