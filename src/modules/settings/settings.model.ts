import { InferSchemaType, model, models, Schema } from "mongoose";

import { DEFAULT_SETTINGS } from "./settings.constant";
import { ECurrency } from "./settings.enum";

export const settingsSchema = new Schema(
  {
    restaurantName: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.restaurantName,
    },

    restaurantLogo: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.restaurantLogo,
    },

    address: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.address,
    },

    contactNumber: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.contactNumber,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: DEFAULT_SETTINGS.email,
    },

    currency: {
      type: String,
      enum: Object.values(ECurrency),
      required: true,
      immutable: true,
      default: DEFAULT_SETTINGS.currency,
    },

    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: DEFAULT_SETTINGS.taxPercentage,
    },

    serviceChargePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: DEFAULT_SETTINGS.serviceChargePercentage,
    },

    isTaxEnabled: {
      type: Boolean,
      required: true,
      default: DEFAULT_SETTINGS.isTaxEnabled,
    },

    isServiceChargeEnabled: {
      type: Boolean,
      required: true,
      default: DEFAULT_SETTINGS.isServiceChargeEnabled,
    },

    orderNumberPrefix: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      default: DEFAULT_SETTINGS.orderNumberPrefix,
    },

    paymentTimeoutMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
      default: DEFAULT_SETTINGS.paymentTimeoutMinutes,
    },

    isRestaurantOpen: {
      type: Boolean,
      required: true,
      default: DEFAULT_SETTINGS.isRestaurantOpen,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type TSettings = InferSchemaType<typeof settingsSchema>;

export const Settings =
  models.Settings || model<TSettings>("Settings", settingsSchema);
