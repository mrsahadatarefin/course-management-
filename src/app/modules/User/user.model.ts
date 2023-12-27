import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const UserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordChangeHistory: [
      {
        password: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.passwordChangeHistory;
        return ret;
      },
    },
  },
);
export const UserModel = model<TUser>('User', UserSchema);
