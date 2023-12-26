import { Types } from 'mongoose';

export type TReview = {
  courseId: Types.ObjectId;
  createdBy: Types.ObjectId;
  rating: number;
  review: string;
};
