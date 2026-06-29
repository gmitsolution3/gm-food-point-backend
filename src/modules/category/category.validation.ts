import { z } from "zod";

const createCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(100, "Category name cannot exceed 100 characters."),
    })
    .strict(),
});

const updateCategorySchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(100, "Category name cannot exceed 100 characters.")
        .optional(),

      displayOrder: z
        .number()
        .int()
        .min(1, "Display order must be at least 1.")
        .optional(),

      isActive: z.boolean().optional(),
    })
    .strict(),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
