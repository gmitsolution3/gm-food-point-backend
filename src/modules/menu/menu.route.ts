import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { MenuController } from "./menu.controller";
import { MenuValidation } from "./menu.validation";

const router = Router();

router.post(
  "/",
  validateRequest(MenuValidation.createMenuSchema),
  MenuController.createMenu,
);

router.get("/", MenuController.getMenus);

router.get("/:id", MenuController.getMenu);

router.patch(
  "/:id",
  validateRequest(MenuValidation.updateMenuSchema),
  MenuController.updateMenu,
);

router.delete("/:id", MenuController.deleteMenu);

export const MenuRoutes = router;
