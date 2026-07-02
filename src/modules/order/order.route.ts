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

router.get(
  "/kitchen",
  OrderController.getKitchenOrders,
);

export const OrderRoutes = router;
