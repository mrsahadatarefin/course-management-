import { TCourse } from './course.interface';
import CourseModel from './course.modal';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};
const getReviewByCourseIdIntoDB = async (courseId: string) => {
  const result = CourseModel.findById({
    _id: courseId,
  });
  return result;
};

export const courseService = {
  createCourseIntoDb,
  getReviewByCourseIdIntoDB,
};
