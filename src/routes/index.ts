import { Router } from "express";

import { CategoryRoutes } from "../modules/category/category.route";
import { SettingsRoutes } from "../modules/settings/settings.route";
import { MenuRoutes } from "../modules/menu/menu.route";

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
   {
    path: "/menus",
    route: MenuRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
