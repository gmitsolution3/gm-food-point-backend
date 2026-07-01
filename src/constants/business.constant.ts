import "dotenv/config";

export const BUSINESS = {
  TIMEZONE: process.env.BUSINESS_TIMEZONE,

  DATE_FORMAT: "YYYY-MM-DD",

  ORDER_NUMBER_LENGTH: 4,
} as const;
