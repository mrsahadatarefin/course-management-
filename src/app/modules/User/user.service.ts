import { JwtPayload } from 'jsonwebtoken';
import { TLoginUser, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import config from '../../config';
import { createToken } from './user.utils';

const createUserIntoDB = async (payload: TUser) => {
  const password = await bcrypt.hash(
    payload.password,
    Number(config.saltRounds),
  );
  const data = {
    ...payload,
    password,
  };
  const result = await UserModel.create(data);
  return result;
};

const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({
    username: payload.username,
  }).select('+password');

  if (!user) {
    throw new Error('user is not found !');
  }
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error('password is not correct !');
  }
  const { _id, email, role } = user;
  const JwtPayload = { userId: _id, email, role };
  const accessToken = createToken(
    JwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return {
    user,
    accessToken,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  const user = await UserModel.findOne({
    _id: userData.userId,
  }).select('+password');

  if (!user) {
    throw new Error('user is not found !');
  }
  const isPasswordCorrect = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error('password is not correct !');
  }

  const previousPasswords = user.passwordChangeHistory || [];
  const isPasswordReused = previousPasswords.some((prevPassword) =>
    bcrypt.compareSync(payload.newPassword, prevPassword.password),
  );

  if (isPasswordReused) {
    throw new Error(
      'Password change failed. Ensure the new password is unique and not among the last 2 used ',
    );
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);
  const newPasswordChange = {
    password: hashedNewPassword,
    timestamp: new Date(),
  };
  user.passwordChangeHistory = [
    newPasswordChange,
    ...previousPasswords.slice(0, 1),
  ];
  const result = await UserModel.findByIdAndUpdate(
    userData.userId,
    {
      password: hashedNewPassword,
      passwordChangeHistory: user.passwordChangeHistory,
    },
    { new: true },
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  loginUserIntoDB,
  changePasswordIntoDB,
};
