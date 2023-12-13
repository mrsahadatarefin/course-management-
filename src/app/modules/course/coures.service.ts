import mongoose from 'mongoose';
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
    'minPrice',
    'maxPrice',
    'minPrice',
    'maxPrice',
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

  const excludeFields = [
    'searchTerm',
    'sort',
    'page',
    'limit',
    'skip',
    'minPrice',
    'maxPrice',
  ];

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
const getReviewByCourseIdIntoDB = async (id: string) => {
  const courseId = new mongoose.Types.ObjectId(id);

  const result = await CourseModel.aggregate([
    {
      $match: { _id: courseId },
    },

    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
  ]);

  return result;
};
const getBestCorseFromDb = async () => {
  const minimumAverageRating = 2;
  const result = await CourseModel.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        averageRating: {
          $avg: '$reviews.rating',
        },
      },
    },
    {
      $match: {
        averageRating: { $gt: minimumAverageRating },
      },
    },

    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
      },
    },

    { $project: { reviews: 0, __v: 0 } },
  ]);
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

  if (tags && Array.isArray(tags)) {
    const updatedTags = tags.map((tag: Record<string, unknown>) => {
      if (tag.isDeleted) {
        return null;
      }
      return {
        name: tag.name,
        isDeleted: tag.isDeleted || false,
      };
    });

    const filteredTags = updatedTags.filter((tag) => tag !== null);

    modifiedUpdateData.tags = filteredTags;

    await CourseModel.findByIdAndUpdate(id, {
      $pull: { tags: { isDeleted: true } },
    });
  }
  const result = await CourseModel.findOneAndUpdate(
    { id },
    {
      $set: modifiedUpdateData,
    },
    { new: true, runValidators: true },
  );
  return result;
};

export const courseService = {
  createCourseIntoDb,
  getReviewByCourseIdIntoDB,
  updateCourseIntoDB,
  AllCourseFromDb,
  getBestCorseFromDb,
};
