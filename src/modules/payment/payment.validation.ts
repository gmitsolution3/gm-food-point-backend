import { z } from "zod";

import { PAYMENT_MESSAGES } from "./payment.constant";

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

export const PaymentValidation = {
  confirmCashPaymentSchema,
};
