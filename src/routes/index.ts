import { Router } from "express";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
