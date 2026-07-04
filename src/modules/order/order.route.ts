import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = Router();

router.get(
  "/",
  validateRequest(OrderValidation.getOrdersSchema),
  OrderController.getOrders,
);

router.post(
  "/",
  validateRequest(OrderValidation.createOrderSchema),
  OrderController.createOrder,
);

router.get("/kitchen", OrderController.getKitchenOrders);

router.patch(
  "/:orderId/start",
  validateRequest(OrderValidation.startOrderSchema),
  OrderController.startOrder,
);

router.patch(
  "/:orderId/ready",
  validateRequest(OrderValidation.readyOrderSchema),
  OrderController.readyOrder,
);

router.patch(
  "/:orderId/complete",

  validateRequest(OrderValidation.completeOrderSchema),

  OrderController.completeOrder,
);

router.get(
  "/:orderId",
  validateRequest(OrderValidation.getOrderSchema),
  OrderController.getOrder,
);

export const OrderRoutes = router;
