import { Router } from "express";

import { CategoryRoutes } from "../modules/category/category.route";
import { SettingsRoutes } from "../modules/settings/settings.route";

const router = Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/settings",
    route: SettingsRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
