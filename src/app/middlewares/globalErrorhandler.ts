/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { handleZodError } from '../errors/handleValidationError';
import { handleCastError } from '../errors/handleCastError';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong!';
  let errorMessage = '';
  let errorDetails = {};

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
    errorDetails = simplifiedError.errorDetails;
  }
  //else if (err?.name === 'CastError') {
  //   const simplifiedError = handleCastError(err);
  //   statusCode = simplifiedError.statusCode;
  //   message = simplifiedError.message;
  //   errorMessage = simplifiedError.errorMessage;
  //   errorDetails = simplifiedError.errorDetails;
  // }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err,
    err: err.name,

    stack: err?.stack,
  });
};
