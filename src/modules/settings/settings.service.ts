import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import {
  DEFAULT_SETTINGS,
  SETTINGS_MESSAGES,
} from "./settings.constant";
import { Settings, TSettings } from "./settings.model";
import { TUpdateSettingsPayload } from "./settings.types";

const getSettings = async (): Promise<TSettings> => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(DEFAULT_SETTINGS);
  }

  return settings;
};

const updateSettings = async (
  payload: TUpdateSettingsPayload,
): Promise<TSettings> => {
  const settings = await Settings.findOne();

  if (!settings) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      SETTINGS_MESSAGES.NOT_FOUND,
    );
  }

  Object.assign(settings, payload);

  await settings.save();

  return settings;
};

export const SettingsService = {
  getSettings,
  updateSettings,
};
