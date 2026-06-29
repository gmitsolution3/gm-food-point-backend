import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { SETTINGS_MESSAGES } from "./settings.constant";
import { SettingsService } from "./settings.service";

const getSettings = catchAsync(async (_req, res) => {
  const result = await SettingsService.getSettings();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: SETTINGS_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.updateSettings(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: SETTINGS_MESSAGES.UPDATED,
    data: result,
  });
});

export const SettingsController = {
  getSettings,
  updateSettings,
};
