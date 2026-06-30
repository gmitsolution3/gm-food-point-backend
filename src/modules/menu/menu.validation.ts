import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

const createMenuSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Menu item name is required.")
        .max(100, "Menu item name cannot exceed 100 characters."),

      description: z
        .string()
        .trim()
        .min(1, "Description is required.")
        .max(1000, "Description cannot exceed 1000 characters."),

      categoryId: objectIdSchema,

      image: z.string().trim().url("Image must be a valid URL."),

      price: z.number().min(0, "Price cannot be negative."),

      discountPrice: z
        .number()
        .min(0, "Discount price cannot be negative.")
        .nullable()
        .optional(),

      preparationTime: z
        .number()
        .int()
        .min(1, "Preparation time must be at least 1 minute."),

      suggestedItems: z.array(objectIdSchema).optional().default([]),

      isAvailable: z.boolean().optional(),

      isFeatured: z.boolean().optional(),
    })
    .strict(),
});

const updateMenuSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(100).optional(),

      description: z.string().trim().min(1).max(1000).optional(),

      categoryId: objectIdSchema.optional(),

      image: z.string().trim().url().optional(),

      price: z.number().min(0).optional(),

      discountPrice: z.number().min(0).nullable().optional(),

      preparationTime: z.number().int().min(1).optional(),

      suggestedItems: z.array(objectIdSchema).optional(),

      displayOrder: z.number().int().min(1).optional(),

      isAvailable: z.boolean().optional(),

      isFeatured: z.boolean().optional(),
    })
    .strict(),
});

export const MenuValidation = {
  createMenuSchema,
  updateMenuSchema,
};
