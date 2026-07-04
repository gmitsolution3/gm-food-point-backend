import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import { SocketEmitter } from "../../socket/socket.emitter";
import { EPaymentMethod } from "./order.enum";

const router = Router();

router.get("/test", (req, res) => {
  SocketEmitter.orderCreated({
    orderId: "test-id",
    orderNumber: 1,
    tableNumber: 5,
    paymentMethod: EPaymentMethod.CASH,
    amount: 120,
  });

  res.status(200).json({
    success: true,
    message: "Order route is working",
  });
});

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
