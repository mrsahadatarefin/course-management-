import { Router } from 'express';
import { categoryRoute } from '../modules/Category/category.route';
import { courseRoute } from '../modules/course/course.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/course',
    route: courseRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
