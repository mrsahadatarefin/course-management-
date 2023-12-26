import { User_Role } from './user.constent';

export type TUser = {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};
export type TLoginUser = {
  username: string;
  password: string;
};
export type TUserRole = keyof typeof User_Role;
