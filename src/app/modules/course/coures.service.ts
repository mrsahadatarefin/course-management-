import mongoose from 'mongoose';
import { QueryParams, TCourse } from './course.interface';
import CourseModel from './course.modal';
import { ReviewModel } from '../Review/review.model';
import { JwtPayload } from 'jsonwebtoken';

const createCourseIntoDb = async (userId: JwtPayload, payload: TCourse) => {
  const userData = {
    ...payload,
    createdBy: userId,
  };
  const result = await CourseModel.create(userData);
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AllCourseFromDb = async (queryParams: QueryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder = 'asc',
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = queryParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchCriteria: Record<string, any> = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    matchCriteria.price = {};
    if (minPrice !== undefined) matchCriteria.price.$gte = minPrice;
    if (maxPrice !== undefined) matchCriteria.price.$lte = maxPrice;
  }

  if (tags !== undefined) {
    matchCriteria['tags.name'] = tags;
  }

  if (startDate !== undefined || endDate !== undefined) {
    matchCriteria.startDate = {};
    if (startDate !== undefined) matchCriteria.startDate.$gte = startDate;
    if (endDate !== undefined) matchCriteria.startDate.$lte = endDate;
  }

  if (language !== undefined) {
    matchCriteria.language = language;
  }

  if (provider !== undefined) {
    matchCriteria.provider = provider;
  }

  if (durationInWeeks !== undefined && durationInWeeks !== null) {
    matchCriteria.durationInWeeks = durationInWeeks;
  }

  if (level !== undefined) {
    matchCriteria['details.level'] = level;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortCriteria: Record<string, any> = {};
  if (sortBy) {
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const totalCount = await CourseModel.countDocuments(matchCriteria).exec();

  const query = CourseModel.find(matchCriteria).populate('createdBy');

  if (Object.keys(sortCriteria).length > 0) {
    query.sort(sortCriteria);
  }

  const result = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const response = {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: result,
  };

  return response;
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
  const bestCourse = await ReviewModel.aggregate([
    { $match: {} },
    {
      $group: {
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        _id: '$courseId',
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    { $limit: 1 },
  ]);

  if (bestCourse && bestCourse.length > 0) {
    const { averageRating, reviewCount } = bestCourse[0];
    const courseId = bestCourse[0]._id;
    const course = await CourseModel.findById(courseId).populate('createdBy');
    const result = { course, averageRating, reviewCount };
    return result;
  }
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
