import { ECurrency } from "./settings.enum";

export const SETTINGS_MESSAGES = {
  RETRIEVED: "Settings retrieved successfully.",
  UPDATED: "Settings updated successfully.",
  NOT_FOUND: "Settings not found.",
} as const;

export const DEFAULT_SETTINGS = {
  restaurantName: "",

  restaurantLogo: null,

  address: "",

  contactNumber: "",

  email: "",

  currency: ECurrency.CNY,

  taxPercentage: 0,

  serviceChargePercentage: 0,

  isTaxEnabled: false,

  isServiceChargeEnabled: false,

  orderNumberPrefix: "GM",

  isRestaurantOpen: true,
} as const;

export const CURRENCY_SYMBOL = {
  [ECurrency.CNY]: "¥",
} as const;
