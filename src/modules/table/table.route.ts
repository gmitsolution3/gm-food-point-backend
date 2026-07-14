import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { TableController } from "./table.controller";
import { TableValidation } from "./table.validation";

const router = Router();

router.get("/", TableController.getTables);

router.patch(
  "/:tableNumber/release",
  validateRequest(
    TableValidation.releaseTableValidationSchema,
  ),
  TableController.releaseTable,
);

export const TableRoutes = router;