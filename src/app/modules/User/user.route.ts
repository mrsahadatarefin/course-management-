import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { CreateUserSchema, loginValidationSchema } from './user.validation';
import { userController } from './user.controller';

const route = express.Router();
route.post(
  '/register',

  validateRequest(CreateUserSchema),
  userController.createUser,
);
route.post(
  '/login',
  validateRequest(loginValidationSchema),
  userController.loginUser,
);

export const userRoute = route;
