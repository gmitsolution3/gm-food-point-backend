import { EOrderCreatedBy, EOrderType } from "./order.enum";

export type TCreateOrderItemPayload = {
  menuId: string;

  quantity: number;
};

export type TCreateOrderPayload = {
  tableNumber: number;

  createdBy: EOrderCreatedBy;

  orderType: EOrderType;

  notes?: string;

  items: TCreateOrderItemPayload[];
};