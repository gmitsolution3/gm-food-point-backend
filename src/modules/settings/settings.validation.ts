import { z } from "zod";

const updateSettingsSchema = z.object({
  body: z
    .object({
      restaurantName: z
        .string()
        .trim()
        .min(1, "Restaurant name is required.")
        .max(100, "Restaurant name cannot exceed 100 characters.")
        .optional(),

      restaurantLogo: z
        .string()
        .trim()
        .url("Restaurant logo must be a valid URL.")
        .nullable()
        .optional(),

      address: z
        .string()
        .trim()
        .min(1, "Address is required.")
        .max(255, "Address cannot exceed 255 characters.")
        .optional(),

      contactNumber: z
        .string()
        .trim()
        .min(1, "Contact number is required.")
        .max(30, "Contact number cannot exceed 30 characters.")
        .optional(),

      email: z
        .email("Please provide a valid email address.")
        .max(255, "Email cannot exceed 255 characters.")
        .optional(),

      taxPercentage: z
        .number()
        .min(0, "Tax percentage cannot be less than 0.")
        .max(100, "Tax percentage cannot exceed 100.")
        .optional(),

      serviceChargePercentage: z
        .number()
        .min(0, "Service charge cannot be less than 0.")
        .max(100, "Service charge cannot exceed 100.")
        .optional(),

      isTaxEnabled: z.boolean().optional(),

      isServiceChargeEnabled: z.boolean().optional(),

      orderNumberPrefix: z
        .string()
        .trim()
        .min(1, "Order number prefix is required.")
        .max(10, "Order number prefix cannot exceed 10 characters.")
        .optional(),

      isRestaurantOpen: z.boolean().optional(),
    })
    .strict(),
});

export const SettingsValidation = {
  updateSettingsSchema,
};