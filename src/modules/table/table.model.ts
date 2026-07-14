import { InferSchemaType, model, models, Schema } from "mongoose";

import { ETableStatus } from "./table.enum";

export const tableSchema = new Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(ETableStatus),
      required: true,
      default: ETableStatus.AVAILABLE,
    },

    activeOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    occupiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type TTable = InferSchemaType<typeof tableSchema>;

export const Table =
  models.Table || model<TTable>("Table", tableSchema);
