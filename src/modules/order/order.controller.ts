import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ORDER_MESSAGES } from "./order.constant";
import { OrderService } from "./order.service";
import { GetKitchenOrdersService } from "./services/get-kitchen-orders.service";
import { StartOrderService } from "./services/start-order.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: ORDER_MESSAGES.CREATED,
    data: result,
  });
});

const getKitchenOrders = catchAsync(async (_req, res) => {
  const result = await GetKitchenOrdersService.getKitchenOrders();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.RETRIEVED_ALL,
    data: result,
  });
});

const startOrder = catchAsync(async (req, res) => {
  const result =
    await StartOrderService.startOrder(
      req.params.orderId as string,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.ORDER_STARTED,
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getKitchenOrders,
  startOrder
};