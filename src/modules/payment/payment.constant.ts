export const PAYMENT_MESSAGES = {
  CREATED: "Payment created successfully.",

  RETRIEVED: "Payment retrieved successfully.",

  RETRIEVED_ALL: "Payments retrieved successfully.",

  UPDATED: "Payment updated successfully.",

  PAID: "Payment completed successfully.",

  CANCELLED: "Payment cancelled successfully.",

  FAILED: "Payment failed.",

  REFUNDED: "Payment refunded successfully.",

  NOT_FOUND: "Payment not found.",

  ALREADY_PAID: "Payment has already been completed.",

  INVALID_AMOUNT:
    "Received amount cannot be less than the payable amount.",

  PAYMENT_ID_REQUIRED: "Payment ID is required.",

  AMOUNT_RECEIVED_REQUIRED: "Received amount is required.",
} as const;

export const PAYMENT_SEARCHABLE_FIELDS = ["orderNumber"];
