export enum EOrderType {
  DINE_IN = "dine-in",

  TAKE_OUT = "take-out",
}

export enum EOrderStatus {
  AWAITING_PAYMENT = "awaiting_payment",

  QUEUED = "queued",

  COOKING = "cooking",

  READY = "ready",

  COMPLETED = "completed",

  CANCELLED = "cancelled",
}

export enum EOrderCreatedBy {
  CUSTOMER = "customer",

  CASHIER = "cashier",

  MANAGER = "manager",
}