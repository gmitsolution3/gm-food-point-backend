import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router.get(
  "/",
  validateRequest(PaymentValidation.getPaymentsSchema),
  PaymentController.getPayments,
);

router.get("/pending", PaymentController.getPendingPayments);

router.get(
  "/:paymentId",
  validateRequest(
    PaymentValidation.getPaymentSchema,
  ),
  PaymentController.getPayment,
);

router.post(
  "/cash/:paymentId/confirm",

  validateRequest(PaymentValidation.confirmCashPaymentSchema),

  PaymentController.confirmCashPayment,
);
export const PaymentRoutes = router;
