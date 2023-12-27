import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import {
  CreateUserSchema,
  changePasswordValidationSchema,
  loginValidationSchema,
} from './user.validation';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { User_Role } from './user.constent';

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
route.post(
  '/change-password',
  auth(User_Role.admin, User_Role.user),
  validateRequest(changePasswordValidationSchema),
  userController.changePassword,
);

export const userRoute = route;
