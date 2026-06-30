import { InferSchemaType, model, models, Schema } from "mongoose";

export const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    preparationTime: {
      type: Number,
      required: true,
      min: 1,
    },

    suggestedItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type TMenu = InferSchemaType<typeof menuSchema>;

export const Menu = models.Menu || model<TMenu>("Menu", menuSchema);
