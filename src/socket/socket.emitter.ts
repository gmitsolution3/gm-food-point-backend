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
    getIO()
      .to(SOCKET_ROOMS.CASHIER)
      .emit(SOCKET_EVENTS.ORDER_CREATED, payload);
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
  },

  orderCompleted(payload: TOrderCompletedPayload) {
    getIO()
      .to(getTableRoom(payload.tableNumber))
      .emit(SOCKET_EVENTS.ORDER_COMPLETED, payload);
  },
};
