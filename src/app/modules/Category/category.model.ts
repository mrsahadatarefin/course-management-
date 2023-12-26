import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const courseSchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);
export const CategoryModel = model<TCategory>('Category', courseSchema);
