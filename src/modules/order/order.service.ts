import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import { InitializePaymentService } from "../payment/services/initialize-payment.service";
import { SettingsService } from "../settings/settings.service";

import { EOrderStatus } from "./order.enum";
import { Order } from "./order.model";
import {
  TCreateOrderPayload,
  TCreateOrderResponse,
} from "./order.types";

import { BuildOrderItemsService } from "./services/build-order-items.service";
import { KitchenEstimatorService } from "./services/kitchen-estimator.service";
import { OrderCalculatorService } from "./services/order-calculator.service";
import { OrderNumberService } from "./services/order-number.service";

import { QueryBuilder } from "../../utils/QueryBuilder";
import withTransaction from "../../utils/withTransaction";
import {
  ORDER_MESSAGES,
  ORDER_SEARCHABLE_FIELDS,
} from "./order.constant";
import { SocketEmitter } from "../../socket/socket.emitter";

const createOrder = async (
  payload: TCreateOrderPayload,
): Promise<TCreateOrderResponse> => {
  /**
   * Restaurant Settings
   */
  const settings = await SettingsService.getSettings();

  if (!settings) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      ORDER_MESSAGES.SETTINGS_NOT_FOUND,
    );
  }

  /**
   * Build Order Items
   */
  const { items, orderPreparationTime } =
    await BuildOrderItemsService.buildOrderItems(payload.items);

  /**
   * Financial Calculation
   */
  const calculation = OrderCalculatorService.calculateOrder({
    items,
    settings: {
      taxPercentage: settings.taxPercentage,
      isTaxEnabled: settings.isTaxEnabled,
      serviceChargePercentage: settings.serviceChargePercentage,
      isServiceChargeEnabled: settings.isServiceChargeEnabled,
    },
  });

  /**
   * ETA
   */
  const estimatedCompletionAt =
    await KitchenEstimatorService.calculateEstimatedCompletionAt(
      orderPreparationTime,
    );

  /**
   * Critical Writes
   */
  const writeResult = await withTransaction(async (session) => {
    /**
     * Order Number
     */
    const { orderNumber, businessDate } =
      await OrderNumberService.generateOrderNumber(session);

    /**
     * Create Order
     */
    const [order] = await Order.create(
      [
        {
          orderNumber,

          businessDate,

          tableNumber: payload.tableNumber,

          createdBy: payload.createdBy,

          orderType: payload.orderType,

          paymentMethod: payload.paymentMethod,

          status: EOrderStatus.AWAITING_PAYMENT,

          items,

          ...calculation,

          orderPreparationTime,

          estimatedCompletionAt,

          notes: payload.notes,
        },
      ],
      {
        session,
      },
    );

    const payment = await InitializePaymentService.initializePayment({
      orderId: order._id,

      orderNumber: order.orderNumber,

      businessDate: order.businessDate,

      paymentMethod: order.paymentMethod,

      amount: order.grandTotal,

      paymentTimeoutMinutes: settings.paymentTimeoutMinutes,

      session,
    });

    return {
      order,
      payment,
    };
  });

  SocketEmitter.orderCreated({
    orderId: writeResult.order._id.toString(),
    orderNumber: writeResult.order.orderNumber,
    tableNumber: writeResult.order.tableNumber,
    paymentMethod: writeResult.payment.paymentMethod,
    amount: writeResult.payment.amount,
  });

  return writeResult;
};

const getOrders = async (query: Record<string, unknown>) => {
  if (query.tableNumber) {
    query.tableNumber = Number(query.tableNumber);
  }

  const queryBuilder = new QueryBuilder(Order.find(), query);

  queryBuilder.search(ORDER_SEARCHABLE_FIELDS);

  queryBuilder.filter();

  queryBuilder.sort();

  queryBuilder.paginate();

  const data = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data,
  };
};

export const OrderService = {
  createOrder,
  getOrders,
};
