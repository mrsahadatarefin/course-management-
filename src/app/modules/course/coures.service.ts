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
  ];

  const excludeFields = [
    'searchTerm',
    'sort',
    'page',
    'limit',
    'skip',
    'minPrice',
    'maxPrice',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [];

  const searchExpressions = courseSearchableFields.map((field) => ({
    [field]: { $regex: query?.searchTerm || '', $options: 'i' },
  }));
  data.push({ $match: { $or: searchExpressions } });

  excludeFields.forEach((el) => delete queryObj[el]);

  if (Object.keys(queryObj).length > 0) {
    data.push({ $match: queryObj });
  }

  if (query.minPrice || query.maxPrice) {
    const priceQuery: Record<string, unknown> = {};
    if (query.minPrice) {
      priceQuery.$gte = parseFloat(query.minPrice as string);
    }
    if (query.maxPrice) {
      priceQuery.$lte = parseFloat(query.maxPrice as string);
    }
    data.push({ $match: { price: priceQuery } });
  }

  let sort = '-createAt';
  if (query.sort) {
    sort = query.sort as string;
  }
  data.push({ $sort: { [sort]: 1 } });

  let page = 1;
  let limit = 10;

  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
  }

  const skip = (page - 1) * limit;
  data.push({ $skip: skip }, { $limit: limit });

  const countdata = [...data];
  countdata.push({ $count: 'total' });

  const [courses, totalResult] = await Promise.all([
    CourseModel.aggregate(data),
    CourseModel.aggregate(countdata),
  ]);

  const totalDocuments = totalResult.length > 0 ? totalResult[0].total : 0;

  const result = {
    meta: {
      page,
      limit,
      total: totalDocuments,
    },
    data: courses,
  };

  return result;
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
