import { ReviewModel } from '../Review/review.model';
import { TCourse } from './course.interface';
import CourseModel from './course.modal';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const AllCourseFromDb = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };
  const courseSearchableFields = [
    'title',
    'tags.name',
    'startDate',
    'endDate',
    'language',
    'provider',
    'details.level',
  ];
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = CourseModel.find({
    $or: courseSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'skip'];
  excludeFields.forEach((el) => delete queryObj[el]);
  const filterQuery = searchQuery.find(queryObj);
  let sort = '-createAt';
  if (query.sort) {
    sort = query.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);
  let page = 1;
  let limit = 1;
  let skip = 0;
  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  return limitQuery;
};
const getReviewByCourseIdIntoDB = async (course: string) => {
  const result = await ReviewModel.find({
    course,
  }).populate('course');

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { tags, details, ...data } = payload;
  const modifiedUpdateData: Record<string, unknown> = {
    ...data,
  };
  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      modifiedUpdateData[`details.${key}`] = value;
    }
  }
  if (tags && tags.length) {
    const deleteTags = tags
      .filter((el) => el.name && el.isDeleted)
      .map((el) => el.name);
    const deleteTag = await CourseModel.findByIdAndUpdate(id, {
      $pull: { tags: { $in: deleteTags } },
    });
    const newTags = tags?.filter((el) => el.name && !el.isDeleted);
    const newFilterTags = await CourseModel.findByIdAndUpdate(id, {
      $addToSet: { tags: { $each: newTags } },
    });
  }

  const result = await CourseModel.findOneAndUpdate(
    { id },
    modifiedUpdateData,
    { new: true, runValidators: true },
  );
  return result;
};

export const courseService = {
  createCourseIntoDb,
  getReviewByCourseIdIntoDB,
  updateCourseIntoDB,
  AllCourseFromDb,
};
