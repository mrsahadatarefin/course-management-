import { Schema, model } from 'mongoose';
import { TCourse } from './course.interface';

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
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
  tags: [{ name: String, isDeleted: Boolean }],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number },
  details: {
    level: { type: String, required: true },
    description: { type: String, required: true },
  },
});
courseSchema.pre('save', function (next) {
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  const durationInMilliseconds = endDate.getTime() - startDate.getTime();
  const durationInWeeksFIND =
    durationInMilliseconds / (7 * 24 * 60 * 60 * 1000);

  this.durationInWeeks = Math.ceil(durationInWeeksFIND);

  next();
});
const CourseModel = model<TCourse>('Course', courseSchema);
export default CourseModel;
