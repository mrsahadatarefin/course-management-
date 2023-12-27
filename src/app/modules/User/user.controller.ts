import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await userService.createUserIntoDB(body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await userService.loginUserIntoDB(body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User login successfully',
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...passwordData } = req.body;
  const result = await userService.changePasswordIntoDB(user, passwordData);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const userController = { createUser, loginUser, changePassword };
