import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getCategories);

router.get("/:id", CategoryController.getCategory);

router.patch(
  "/:id",
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory,
);

router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
