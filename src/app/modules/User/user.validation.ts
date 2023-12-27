import { z } from 'zod';
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const passwordErrorMessage =
  'Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*#?&)';
export const CreateUserSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is  required' }),
    email: z.string({ required_error: 'email is required' }),
    password: z.string().refine((value) => passwordRegex.test(value), {
      message: passwordErrorMessage,
    }),
    role: z.enum(['user', 'admin']),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is  required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({ required_error: 'newPassword is required' }),
  }),
});
