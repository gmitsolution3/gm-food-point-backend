import {
  EOrderCreatedBy,
  EOrderType,
  EPaymentMethod,
} from "./order.enum";

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
