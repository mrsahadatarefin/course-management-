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

const AllCourse = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await courseService.AllCourseFromDb(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Courses retrieved successfully',
    data: result,
  });
});
const getReviewByCourseId = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  console.log(courseId);
  const result = await courseService.getReviewByCourseIdIntoDB(courseId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});
const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const result = await courseService.updateCourseIntoDB(id, body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

export const courseController = {
  createCourse,
  getReviewByCourseId,
  updateCourse,
  AllCourse,
};
