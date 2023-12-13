import mongoose from 'mongoose';

export const handleCastError = (err: mongoose.Error.CastError) => {
  const errorDetails = {
    err,
  };

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
    errorDetails,
  };
};
