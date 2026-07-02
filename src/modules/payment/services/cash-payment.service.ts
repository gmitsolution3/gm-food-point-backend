import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import withTransaction from "../../../utils/withTransaction";

import { EOrderStatus } from "../../order/order.enum";
import { Order } from "../../order/order.model";

import { PAYMENT_MESSAGES } from "../payment.constant";
import { EPaymentStatus } from "../payment.enum";
import { Payment } from "../payment.model";
import {
  TCashPaymentPayload,
  TConfirmCashPaymentResponse,
} from "../payment.types";
import roundMoney from "../../../utils/roundMoney";
import { ORDER_MESSAGES } from "../../order/order.constant";

const confirmCashPayment = async ({
  paymentId,
  amountReceived,
}: TCashPaymentPayload): Promise<TConfirmCashPaymentResponse> => {
  return withTransaction(async (session) => {
    const payment =
      await Payment.findById(paymentId).session(session);

    if (!payment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        PAYMENT_MESSAGES.NOT_FOUND,
      );
    }

    if (payment.status !== EPaymentStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        PAYMENT_MESSAGES.ALREADY_PAID,
      );
    }

    if (amountReceived < payment.amount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        PAYMENT_MESSAGES.INVALID_AMOUNT,
      );
    }

    const order = await Order.findById(payment.orderId).session(
      session,
    );

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    }

    payment.amountReceived = amountReceived;

    payment.changeAmount = roundMoney(
      amountReceived - payment.amount,
    );

    payment.status = EPaymentStatus.PAID;

    payment.confirmedAt = new Date();

    await payment.save({ session });

    order.status = EOrderStatus.QUEUED;

    await order.save({ session });

    return {
      payment,
      order,
    };
  });
};

export const CashPaymentService = {
  confirmCashPayment,
};
