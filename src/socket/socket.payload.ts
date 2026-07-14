import { EPaymentMethod } from "../modules/payment/payment.enum";

export type TOrderCreatedPayload = {
  orderId: string;
  orderNumber: number;
  tableNumber: number;
  paymentMethod: EPaymentMethod;
  amount: number;
};

export type TOrderQueuedPayload = {
  orderId: string;
  orderNumber: number;
  tableNumber: number;
  estimatedCompletionAt: Date;
};

export type TOrderCookingPayload = {
  orderId: string;
  orderNumber: number;
  tableNumber: number;
};

export type TOrderReadyPayload = {
  orderId: string;
  orderNumber: number;
  tableNumber: number;
};

export type TOrderCompletedPayload = {
  orderId: string;
  orderNumber: number;
  tableNumber: number;
};

export type TTableUpdatedPayload = {
  tableNumber: number;
  status: string;
  occupiedAt: Date | null;
  activeOrderId: string | null;
};
