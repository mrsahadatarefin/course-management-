import { TCourse } from './course.interface';
import CourseModel from './course.modal';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

export const courseService = {
  createCourseIntoDb,
};
