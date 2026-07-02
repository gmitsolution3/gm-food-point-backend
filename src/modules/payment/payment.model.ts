import { InferSchemaType, model, models, Schema } from "mongoose";

import { EPaymentMethod, EPaymentStatus } from "./payment.enum";

export const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      immutable: true,
    },

    orderNumber: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },

    businessDate: {
      type: String,
      required: true,
      immutable: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: Object.values(EPaymentStatus),
      default: EPaymentStatus.PENDING,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      immutable: true,
    },

    amountReceived: {
      type: Number,
      min: 0,
      default: null,
    },

    changeAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    gatewayTransactionId: {
      type: String,
      trim: true,
      default: null,
    },

    gatewayPayload: {
      type: Schema.Types.Mixed,
      default: null,
      select: false,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
      immutable: true,
    },

    remarks: {
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

paymentSchema.index({
  status: 1,
});

paymentSchema.index({
  paymentMethod: 1,
});

paymentSchema.index({
  businessDate: 1,
});

paymentSchema.index({
  businessDate: 1,
  status: 1,
});

paymentSchema.index({
  expiresAt: 1,
});

export type TPayment = InferSchemaType<typeof paymentSchema>;

export const Payment =
  models.Payment || model<TPayment>("Payment", paymentSchema);
