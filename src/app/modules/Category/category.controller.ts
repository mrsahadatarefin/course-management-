/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from './category.service';

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const body = req.body;

    const result = await categoryService.createCategoryIntoDb(userId, body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  },
);
const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategoryFromDb();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
};
