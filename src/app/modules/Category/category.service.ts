import { JwtPayload } from 'jsonwebtoken';
import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryIntoDb = async (userId: JwtPayload, payload: TCategory) => {
  const data = {
    ...payload,
    createdBy: userId,
  };
  const result = await CategoryModel.create(data);
  return result;
};
const getAllCategoryFromDb = async () => {
  const result = await CategoryModel.find().populate('createdBy');
  return result;
};

export const categoryService = {
  createCategoryIntoDb,
  getAllCategoryFromDb,
};
