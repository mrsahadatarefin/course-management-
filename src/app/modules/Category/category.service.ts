import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryIntoDb = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};
const getAllCategoryFromDb = async () => {
  const result = await CategoryModel.find({});
  return result;
};

export const categoryService = {
  createCategoryIntoDb,
  getAllCategoryFromDb,
};
