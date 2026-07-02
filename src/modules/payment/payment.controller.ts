import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import validateObjectId from "../../utils/validateObjectId";
import { PAYMENT_MESSAGES } from "./payment.constant";
import { CashPaymentService } from "./services/cash-payment.service";
import { GetPendingPaymentsService } from "./services/get-pending-payments.service";
import { PaymentService } from "./payment.service";

const confirmCashPayment = catchAsync(async (req, res) => {
  const paymentId = req.params.paymentId as string;
  validateObjectId(paymentId, "Payment");

  const result = await CashPaymentService.confirmCashPayment({
    paymentId: req.params.paymentId as string,

    amountReceived: req.body.amountReceived,
  });

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: PAYMENT_MESSAGES.PAID,

    data: result,
  });
});

const getPendingPayments = catchAsync(async (_req, res) => {
  const result = await GetPendingPaymentsService.getPendingPayments();

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: PAYMENT_MESSAGES.RETRIEVED_ALL,

    data: result,
  });
});

const getPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getPayments(req.query);

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: PAYMENT_MESSAGES.RETRIEVED_ALL,

    meta: result.meta,

    data: result.data,
  });
});

export const PaymentController = {
  confirmCashPayment,
  getPendingPayments,
  getPayments,
};
