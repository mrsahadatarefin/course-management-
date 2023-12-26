import express from 'express';
import { categoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCategoryValidationSchema } from './category.validation';
import auth from '../../middlewares/auth';
import { User_Role } from '../User/user.constent';
const route = express.Router();
route.post(
  '/',
  auth(User_Role.admin),
  validateRequest(createCategoryValidationSchema),
  categoryController.createCategory,
);
route.get('/', categoryController.getAllCategory);

export const categoryRoute = route;
