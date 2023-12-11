import { Schema, model } from 'mongoose';
import { TCourse } from './course.interface';

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [{ name: String, isDeleted: { enum: [true, false], default: false } }],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number, required: true },
  details: {
    level: { type: String, required: true },
    description: { type: String, required: true },
  },
});
const CourseModel = model<TCourse>('Course', courseSchema);
export default CourseModel;
