import { Router } from 'express';
import { categoryRoute } from '../modules/Category/category.route';
import { courseRoute } from '../modules/course/course.route';
import { reviewRoute } from '../modules/Review/review.route';
import { userRoute } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/course',
    route: courseRoute,
  },
  {
    path: '/courses',
    route: courseRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/auth',
    route: userRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
