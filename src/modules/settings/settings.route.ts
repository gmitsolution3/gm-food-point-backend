import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { SettingsController } from "./settings.controller";
import { SettingsValidation } from "./settings.validation";

const router = Router();

router.get("/", SettingsController.getSettings);

router.patch(
  "/",
  validateRequest(SettingsValidation.updateSettingsSchema),
  SettingsController.updateSettings,
);

export const SettingsRoutes = router;
