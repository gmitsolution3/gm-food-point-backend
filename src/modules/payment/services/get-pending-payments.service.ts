import { EPaymentMethod, EPaymentStatus } from "../payment.enum";
import { Payment } from "../payment.model";

const getPendingPayments = async () => {
  const payments = await Payment.find(
    {
      status: EPaymentStatus.PENDING,
      paymentMethod: EPaymentMethod.CASH,
    },
    {
      amount: 1,
      paymentMethod: 1,
      orderNumber: 1,
      expiresAt: 1,
      createdAt: 1,
    },
  )
    .populate({
      path: "orderId",
      select: "tableNumber",
    })
    .sort({
      createdAt: 1,
    })
    .lean();

  const now = Date.now();

  return payments.map((payment) => ({
    paymentId: payment._id,

    orderId: payment.orderId._id,

    orderNumber: payment.orderNumber,

    tableNumber: payment.orderId.tableNumber,

    paymentMethod: payment.paymentMethod,

    amount: payment.amount,

    waitingTime: Math.floor(
      (now - new Date(payment.createdAt).getTime()) / 1000,
    ),

    createdAt: payment.createdAt,

    expiresAt: payment.expiresAt,
  }));
};

export const GetPendingPaymentsService = {
  getPendingPayments,
};
