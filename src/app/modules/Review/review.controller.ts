import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { reviewService } from './review.server';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await reviewService.createReviewIntoDb(body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
};
