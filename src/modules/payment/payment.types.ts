import { ClientSession, Types } from "mongoose";

import { EPaymentMethod } from "./payment.enum";

import { TOrder } from "../order/order.model";
import { TPayment } from "./payment.model";

export type TCreatePaymentPayload = {
  orderId: Types.ObjectId;

  orderNumber: string;

  businessDate: string;

  paymentMethod: EPaymentMethod;

  amount: number;

  paymentTimeoutMinutes: number;

  session?: ClientSession;
};

export type TCashPaymentPayload = {
  paymentId: string;

  amountReceived: number;
};

export type TConfirmCashPaymentResponse = {
  payment: TPayment;

  order: TOrder;
};