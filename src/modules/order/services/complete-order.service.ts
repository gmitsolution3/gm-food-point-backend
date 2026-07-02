import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import validateObjectId from "../../../utils/validateObjectId";

import { ORDER_MESSAGES } from "../order.constant";
import { EOrderStatus } from "../order.enum";
import { Order } from "../order.model";

const completeOrder = async (orderId: string) => {
  validateObjectId(orderId, "Order");

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ORDER_MESSAGES.NOT_FOUND,
    );
  }

  if (order.status === EOrderStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ORDER_MESSAGES.ORDER_ALREADY_COMPLETED,
    );
  }

  if (order.status !== EOrderStatus.READY) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ORDER_MESSAGES.ORDER_NOT_READY_FOR_COMPLETION,
    );
  }

  order.status = EOrderStatus.COMPLETED;

  await order.save();

  return order;
};

export const CompleteOrderService = {
  completeOrder,
};
