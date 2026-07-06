export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  JOIN_ROOM: "join:room",
  ORDER_CREATED: "order:created",
  ORDER_QUEUED: "order:queued",
  ORDER_COOKING: "order:cooking",
  ORDER_READY: "order:ready",
  ORDER_COMPLETED: "order:completed",

  NOTIFICATION: "notification",
} as const;
