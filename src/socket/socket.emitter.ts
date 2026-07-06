import { getIO } from ".";
import { SOCKET_EVENTS } from "./socket.events";
import {
  TOrderCompletedPayload,
  TOrderCookingPayload,
  TOrderCreatedPayload,
  TOrderQueuedPayload,
  TOrderReadyPayload,
} from "./socket.payload";
import { SOCKET_ROOMS, getTableRoom } from "./socket.rooms";

export const SocketEmitter = {
  orderCreated(payload: TOrderCreatedPayload) {
    const io = getIO();

    io.to(SOCKET_ROOMS.CASHIER).emit(
      SOCKET_EVENTS.ORDER_CREATED,
      payload,
    );

    io.to(SOCKET_ROOMS.CASHIER).emit(
      SOCKET_EVENTS.NOTIFICATION,
      "New Payment Request Received! Please check the payment request.",
    );
  },

  orderQueued(payload: TOrderQueuedPayload) {
    const io = getIO();

    io.to(SOCKET_ROOMS.KITCHEN).emit(
      SOCKET_EVENTS.ORDER_QUEUED,
      payload,
    );

    io.to(getTableRoom(payload.tableNumber)).emit(
      SOCKET_EVENTS.ORDER_QUEUED,
      payload,
    );
  },

  orderCooking(payload: TOrderCookingPayload) {
    const io = getIO();

    io.to(SOCKET_ROOMS.KITCHEN).emit(
      SOCKET_EVENTS.ORDER_COOKING,
      payload,
    );

    io.to(getTableRoom(payload.tableNumber)).emit(
      SOCKET_EVENTS.ORDER_COOKING,
      payload,
    );
  },

  orderReady(payload: TOrderReadyPayload) {
    const io = getIO();

    io.to(getTableRoom(payload.tableNumber)).emit(
      SOCKET_EVENTS.ORDER_READY,
      payload,
    );

    io.to(SOCKET_ROOMS.KITCHEN).emit(
      SOCKET_EVENTS.ORDER_READY,
      payload,
    );

    io.to(SOCKET_ROOMS.MANAGER).emit(
      SOCKET_EVENTS.ORDER_READY,
      payload,
    );

    io.to(SOCKET_ROOMS.CASHIER).emit(
      SOCKET_EVENTS.NOTIFICATION,
      `Order no: ${payload.orderId} is now ready to serve! Please check the ready orders section.`,
    );
  },

  orderCompleted(payload: TOrderCompletedPayload) {
    getIO()
      .to(getTableRoom(payload.tableNumber))
      .emit(SOCKET_EVENTS.ORDER_COMPLETED, payload);
  },

  castNotification(message: string) {
    getIO()
      .to(SOCKET_ROOMS.GLOBAL)
      .emit(SOCKET_EVENTS.NOTIFICATION, { message });
  },
};
