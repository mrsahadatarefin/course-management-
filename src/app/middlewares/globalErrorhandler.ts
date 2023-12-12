import { path } from 'path';
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.massage || 'Validation Error';
  // let errorMessage = err.issues[0].path[1];

  // type TErrorDetails = {
  //   path: string | number;
  //   message: string;
  // }[];

  // let errorDetails: TErrorDetails = [
  //   {
  //     path: '',
  //     message: 'Validation Error',
  //   },
  // ];
  // if (err instanceof ZodError) {
  //   statusCode: 400;
  // }
  return res.status(statusCode).json({
    success: false,
    message,
    // errorMessage: `${errorMessage} is required`,
    errorDetails: err,
    stack: err?.stack,
  });
};
