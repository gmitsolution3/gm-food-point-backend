import { z } from "zod";

import { EFinanceRange } from "./dashboard.enum";

const getFinanceValidationSchema = z.object({
  query: z.object({
    range: z
      .enum(Object.values(EFinanceRange) as [string, ...string[]])
      .optional(),
  }),
});

export const DashboardValidation = {
  getFinanceValidationSchema,
};