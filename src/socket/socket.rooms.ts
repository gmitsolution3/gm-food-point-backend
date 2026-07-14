import { ESocketRole } from "./socket.types";

export const SOCKET_ROOMS = {
  CASHIER: "cashier",
  KITCHEN: "kitchen",
  MANAGER: "manager",
  TABLE: "table",
  GLOBAL: "global",
} as const;

export const ROLE_ROOM_MAP: Record<
  ESocketRole,
  string
> = {
  [ESocketRole.CASHIER]:
    SOCKET_ROOMS.CASHIER,

  [ESocketRole.KITCHEN]:
    SOCKET_ROOMS.KITCHEN,

  [ESocketRole.MANAGER]:
    SOCKET_ROOMS.MANAGER,
};

export const getTableRoom = (tableNumber: number) =>
  `table:${tableNumber}`;