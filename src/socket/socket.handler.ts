import { Server } from "socket.io";

import { SOCKET_EVENTS } from "./socket.events";
import { ROLE_ROOM_MAP, getTableRoom } from "./socket.rooms";
import { TJoinRoomPayload } from "./socket.types";

export const registerSocketHandler = (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(
      SOCKET_EVENTS.JOIN_ROOM,
      (payload: TJoinRoomPayload) => {
        console.log(payload);
        if (payload.role) {
          socket.join(ROLE_ROOM_MAP[payload.role]);
        }

        if (payload.tableNumber !== undefined) {
          socket.join(getTableRoom(payload.tableNumber));
        }
      },
    );

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
