import { Router } from "express";

import { CategoryRoutes } from "../modules/category/category.route";
import { MenuRoutes } from "../modules/menu/menu.route";
import { OrderRoutes } from "../modules/order/order.route";
import { SettingsRoutes } from "../modules/settings/settings.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

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
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payments",

    route: PaymentRoutes,
}
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
