import { EOrderStatus } from "../order.enum";
import { Order, TOrderItem } from "../order.model";

import httpStatus from "http-status";
import AppError from "../../../errors/AppError";

import { KITCHEN_ORDER_STATUSES } from "../order.enum";

const getKitchenOrders = async (query: Record<string, unknown>) => {
  const status =
    (query.status as EOrderStatus) ?? EOrderStatus.QUEUED;

  if (!KITCHEN_ORDER_STATUSES.includes(status as any)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid kitchen order status.",
    );
  }

  const orders = await Order.find(
    {
      status,
    },
    {
      orderNumber: 1,
      tableNumber: 1,
      status: 1,
      orderPreparationTime: 1,
      estimatedCompletionAt: 1,
      notes: 1,
      items: 1,
    },
  )
    .sort({
      estimatedCompletionAt: 1,
    })
    .lean();

  return orders.map((order) => ({
    orderId: order._id,

    orderNumber: order.orderNumber,

    tableNumber: order.tableNumber,

    status: order.status,

    orderPreparationTime: order.orderPreparationTime,

    estimatedCompletionAt: order.estimatedCompletionAt,

    notes: order.notes,

    items: order.items.map((item: TOrderItem) => ({
      name: item.menuName,

      quantity: item.quantity,
    })),
  }));
};

export const GetKitchenOrdersService = {
  getKitchenOrders,
};
