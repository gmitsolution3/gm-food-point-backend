import { ClientSession } from "mongoose";

import { EPaymentStatus } from "./payment.enum";
import { Payment } from "./payment.model";
import { TCreatePaymentPayload } from "./payment.types";

const createPayment = async ({
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

export const PaymentService = {
  createPayment,
};
