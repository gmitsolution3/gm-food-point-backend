import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import validateObjectId from "../../../utils/validateObjectId";

import { ORDER_MESSAGES } from "../order.constant";
import { EOrderStatus } from "../order.enum";
import { Order } from "../order.model";

import { SocketEmitter } from "../../../socket/socket.emitter";

const startOrder = async (orderId: string) => {
  validateObjectId(orderId, "Order");

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ORDER_MESSAGES.NOT_FOUND,
    );
  }

  if (order.status === EOrderStatus.COOKING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ORDER_MESSAGES.ORDER_ALREADY_STARTED,
    );
  }

  if (order.status !== EOrderStatus.QUEUED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ORDER_MESSAGES.ORDER_NOT_READY_TO_START,
    );
  }

  order.status = EOrderStatus.COOKING;

  await order.save();

  SocketEmitter.orderCooking({
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    tableNumber: order.tableNumber,
  });

  return order;
};

export const StartOrderService = {
  startOrder,
};
