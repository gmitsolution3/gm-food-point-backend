import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = Router();

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

export const OrderRoutes = router;
