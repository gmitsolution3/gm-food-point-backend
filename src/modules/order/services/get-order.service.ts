import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import validateObjectId from "../../../utils/validateObjectId";

import { ORDER_MESSAGES } from "../order.constant";
import { Order } from "../order.model";

const getOrder = async (orderId: string) => {
  validateObjectId(orderId, "Order");

  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ORDER_MESSAGES.NOT_FOUND,
    );
  }

  return order;
};

export const GetOrderService = {
  getOrder,
};