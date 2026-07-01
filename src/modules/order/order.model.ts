import { InferSchemaType, model, models, Schema } from "mongoose";

import {
  EOrderCreatedBy,
  EOrderStatus,
  EOrderType,
  EPaymentMethod,
} from "./order.enum";

const orderItemSchema = new Schema(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },

    menuName: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    originalUnitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    effectiveUnitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

export const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    businessDate: {
      type: String,
      required: true,
      index: true,
    },

    tableNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    createdBy: {
      type: String,
      enum: Object.values(EOrderCreatedBy),
      required: true,
      default: EOrderCreatedBy.CUSTOMER,
    },

    orderType: {
      type: String,
      enum: Object.values(EOrderType),
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(EOrderStatus),
      required: true,
      default: EOrderStatus.AWAITING_PAYMENT,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
    },

    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
    },

    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceChargePercentage: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceChargeAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    orderPreparationTime: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedCompletionAt: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type TOrderItem = InferSchemaType<typeof orderItemSchema>;

export type TOrder = InferSchemaType<typeof orderSchema>;

export const Order =
  models.Order || model<TOrder>("Order", orderSchema);
