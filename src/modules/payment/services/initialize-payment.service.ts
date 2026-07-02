import { ClientSession } from "mongoose";

import { Payment } from "../payment.model";
import { EPaymentStatus } from "../payment.enum";
import { TCreatePaymentPayload } from "../payment.types";

const initializePayment = async ({
  session,
  paymentTimeoutMinutes,
  ...payload
}: TCreatePaymentPayload & {
  session?: ClientSession;
}) => {
  const expiresAt = new Date(
    Date.now() + paymentTimeoutMinutes * 60 * 1000,
  );

  const [payment] = await Payment.create(
    [
      {
        ...payload,

        status: EPaymentStatus.PENDING,

        expiresAt,
      },
    ],
    {
      session,
    },
  );

  return payment;
};

export const InitializePaymentService = {
  initializePayment,
};