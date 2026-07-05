import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ORDER_MESSAGES } from "./order.constant";
import { OrderService } from "./order.service";
import { CompleteOrderService } from "./services/complete-order.service";
import { GetKitchenOrdersService } from "./services/get-kitchen-orders.service";
import { GetOrderService } from "./services/get-order.service";
import { ReadyOrderService } from "./services/ready-order.service";
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

const getKitchenOrders = catchAsync(async (req, res) => {
  const result =
  await GetKitchenOrdersService.getKitchenOrders(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.RETRIEVED_ALL,
    data: result,
  });
});

const startOrder = catchAsync(async (req, res) => {
  const result = await StartOrderService.startOrder(
    req.params.orderId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.ORDER_STARTED,
    data: result,
  });
});

const readyOrder = catchAsync(async (req, res) => {
  const result = await ReadyOrderService.readyOrder(
    req.params.orderId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.ORDER_READY,
    data: result,
  });
});

const completeOrder = catchAsync(async (req, res) => {
  const result = await CompleteOrderService.completeOrder(
    req.params.orderId as string,
  );

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: ORDER_MESSAGES.ORDER_COMPLETED,

    data: result,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const result = await GetOrderService.getOrder(
    req.params.orderId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: ORDER_MESSAGES.RETRIEVED,
    data: result,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getOrders(req.query);

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: ORDER_MESSAGES.RETRIEVED_ALL,

    meta: result.meta,

    data: result.data,
  });
});

export const OrderController = {
  createOrder,
  getKitchenOrders,
  startOrder,
  readyOrder,
  completeOrder,
  getOrder,
  getOrders,
};
