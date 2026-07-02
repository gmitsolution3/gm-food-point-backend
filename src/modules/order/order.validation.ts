import { z } from "zod";

import { ORDER_MESSAGES } from "./order.constant";
import {
  EOrderCreatedBy,
  EOrderType,
  EPaymentMethod,
} from "./order.enum";

const createOrderItemSchema = z.object({
  menuId: z
    .string({
      error: ORDER_MESSAGES.MENU_ID_REQUIRED,
    })
    .trim()
    .min(1, ORDER_MESSAGES.MENU_ID_REQUIRED),

  quantity: z
    .number({
      error: ORDER_MESSAGES.QUANTITY_REQUIRED,
    })
    .int()
    .min(1, ORDER_MESSAGES.MINIMUM_QUANTITY)
    .max(99, ORDER_MESSAGES.MAXIMUM_QUANTITY),
});

const createOrderSchema = z.object({
  body: z
    .object({
      tableNumber: z
        .number({
          error: ORDER_MESSAGES.TABLE_NUMBER_REQUIRED,
        })
        .int()
        .min(1),

      createdBy: z.nativeEnum(EOrderCreatedBy),

      orderType: z.nativeEnum(EOrderType),

      paymentMethod: z.nativeEnum(EPaymentMethod),

      notes: z.string().trim().max(500).optional(),

      items: z
        .array(createOrderItemSchema)
        .min(1, ORDER_MESSAGES.EMPTY_ORDER),
    })
    .superRefine((data, ctx) => {
      const menuIds = data.items.map((item) => item.menuId);

      if (menuIds.length !== new Set(menuIds).size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items"],
          message: ORDER_MESSAGES.DUPLICATE_MENU_ITEMS,
        });
      }
    }),
});

const startOrderSchema = z.object({
  params: z.object({
    orderId: z.string(),
  }),
});

export const OrderValidation = {
  createOrderSchema,
  startOrderSchema
};
