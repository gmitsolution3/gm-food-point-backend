import { z } from "zod";

const releaseTableValidationSchema = z.object({
  params: z.object({
    tableNumber: z.coerce.number().min(1),
  }),
});

export const TableValidation = {
  releaseTableValidationSchema,
};