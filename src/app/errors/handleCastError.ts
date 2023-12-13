import mongoose from 'mongoose';

export const handleCastError = (err: mongoose.Error.CastError) => {
  const errorDetails = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorDetails,
  };
};
