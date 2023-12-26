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
  console.log(user);
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

export const userService = {
  createUserIntoDB,
  loginUserIntoDB,
};
