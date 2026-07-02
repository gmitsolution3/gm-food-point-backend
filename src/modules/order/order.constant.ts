export const ORDER_MESSAGES = {
  CREATED: "Order created successfully.",

  RETRIEVED: "Order retrieved successfully.",

  RETRIEVED_ALL: "Orders retrieved successfully.",

  UPDATED: "Order updated successfully.",

  DELETED: "Order deleted successfully.",

  NOT_FOUND: "Order not found.",

  INVALID_MENU_ITEM: "One or more menu items are invalid.",

  EMPTY_ORDER: "At least one menu item is required.",

  DUPLICATE_MENU_ITEMS: "Duplicate menu items are not allowed.",

  MENU_ID_REQUIRED: "Menu ID is required.",

  QUANTITY_REQUIRED: "Quantity is required.",

  MINIMUM_QUANTITY: "Quantity must be at least 1.",

  MAXIMUM_QUANTITY: "Quantity cannot exceed 99.",

  TABLE_NUMBER_REQUIRED: "Table number is required.",

  SETTINGS_NOT_FOUND: "Restaurant settings not found.",

  MENU_UNAVAILABLE: "Selected menu item is currently unavailable.",

  ORDER_ALREADY_STARTED: "Order has already started cooking.",

  ORDER_NOT_READY_TO_START: "Only queued orders can be started.",

  ORDER_STARTED: "Order started successfully.",

  ORDER_ALREADY_READY: "Order is already ready.",

  ORDER_NOT_READY_TO_COMPLETE:
    "Only cooking orders can be marked as ready.",

  ORDER_READY: "Order marked as ready successfully.",

  ORDER_ALREADY_COMPLETED: "Order has already been completed.",

  ORDER_NOT_READY_FOR_COMPLETION:
    "Only ready orders can be completed.",

  ORDER_COMPLETED: "Order completed successfully.",
} as const;
