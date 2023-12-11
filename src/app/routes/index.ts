import { Router } from 'express';
import { categoryRoute } from '../modules/Category/category.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: categoryRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
