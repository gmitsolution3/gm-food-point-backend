import { z } from "zod";

import { paginationQuerySchema } from "../../validations/paginationQuery.validation";
import { PAYMENT_MESSAGES } from "./payment.constant";
import { EPaymentMethod, EPaymentStatus } from "./payment.enum";

const confirmCashPaymentSchema = z.object({
  params: z.object({
    paymentId: z
      .string({
        error: "Payment ID is required.",
      })
      .trim()
      .min(1, "Payment ID is required."),
  }),

  body: z.object({
    amountReceived: z
      .number({
        error: "Received amount is required.",
      })
      .min(0, PAYMENT_MESSAGES.INVALID_AMOUNT),
  }),
});

const getPaymentSchema = z.object({
  params: z.object({
    paymentId: z.string(),
  }),
});

const getPaymentsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.nativeEnum(EPaymentStatus).optional(),

    paymentMethod: z.nativeEnum(EPaymentMethod).optional(),

    businessDate: z.string().optional(),
  }),
});

export const PaymentValidation = {
  confirmCashPaymentSchema,
  getPaymentSchema,
  getPaymentsSchema,
};
