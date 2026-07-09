import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { DashboardController } from "./dashboard.controller";
import { DashboardValidation } from "./dashboard.validation";

const router = Router();

router.get(
  "/finance",
  validateRequest(
    DashboardValidation.getFinanceValidationSchema,
  ),
  DashboardController.getFinance,
);

export const DashboardRoutes = router;