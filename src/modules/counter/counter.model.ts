import { InferSchemaType, model, models, Schema } from "mongoose";

export const counterSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    businessDate: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

counterSchema.index(
  {
    key: 1,
    businessDate: 1,
  },
  {
    unique: true,
  },
);

export type TCounter = InferSchemaType<typeof counterSchema>;

export const Counter =
  models.Counter || model<TCounter>("Counter", counterSchema);