import {
  EOrderCreatedBy,
  EOrderType,
  EPaymentMethod,
} from "./order.enum";

import { TPayment } from "../payment/payment.model";
import { TOrder } from "./order.model";

export type TCreateOrderResponse = {
  order: TOrder;

  payment: TPayment;
};

export type TCreateOrderItemPayload = {
  menuId: string;

  quantity: number;
};

export type TCreateOrderPayload = {
  tableNumber: number;

  createdBy: EOrderCreatedBy;

  orderType: EOrderType;

  paymentMethod: EPaymentMethod;

  notes?: string;

  items: TCreateOrderItemPayload[];
};
