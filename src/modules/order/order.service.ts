import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import { SettingsService } from "../settings/settings.service";

import { EOrderStatus } from "./order.enum";
import { Order, TOrder } from "./order.model";
import { TCreateOrderPayload } from "./order.types";

import { BuildOrderItemsService } from "./services/build-order-items.service";
import { KitchenEstimatorService } from "./services/kitchen-estimator.service";
import { OrderCalculatorService } from "./services/order-calculator.service";
import { OrderNumberService } from "./services/order-number.service";

import withTransaction from "../../utils/withTransaction";
import { ORDER_MESSAGES } from "./order.constant";

const createOrder = async (
  payload: TCreateOrderPayload,
): Promise<TOrder> => {
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
  return withTransaction(async (session) => {
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

    return order;
  });
};

export const OrderService = {
  createOrder,
};
