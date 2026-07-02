import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import validateObjectId from "../../../utils/validateObjectId";

import { PAYMENT_MESSAGES } from "../payment.constant";
import { Payment } from "../payment.model";

const getPayment = async (paymentId: string) => {
  validateObjectId(paymentId, "Payment");

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      PAYMENT_MESSAGES.NOT_FOUND,
    );
  }

  return payment;
};

export const GetPaymentService = {
  getPayment,
};