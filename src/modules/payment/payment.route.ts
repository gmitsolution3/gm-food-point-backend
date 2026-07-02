import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router.get("/pending", PaymentController.getPendingPayments);

router.post(
  "/cash/:paymentId/confirm",

  validateRequest(PaymentValidation.confirmCashPaymentSchema),

  PaymentController.confirmCashPayment,
);export const PaymentRoutes = router;
