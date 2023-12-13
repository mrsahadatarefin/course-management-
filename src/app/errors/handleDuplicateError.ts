// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorDetails = [
    {
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorDetails,
  };
};

export default handleDuplicateError;
