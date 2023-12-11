import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { courseService } from './coures.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  const result = await courseService.createCourseIntoDb(body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});
export const courseController = {
  createCourse,
};
