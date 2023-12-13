import { ZodError } from 'zod';

export const handleZodError = (err: ZodError) => {
  const errorDetails = err.issues;
  const errorMessage = errorDetails.map((issue) => {
    return { errorMessage: issue?.path[issue.path.length - 1] };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
    errorDetails,
  };
};
