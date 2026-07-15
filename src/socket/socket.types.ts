export enum ESocketRole {
  CASHIER = "cashier",
  KITCHEN = "kitchen",
  MANAGER = "manager",
  TABLE = "table",
}

export type TJoinRoomPayload =
  | {
      role: ESocketRole;
      tableNumber?: never;
    }
  | {
      tableNumber: number;
      role?: never;
    };
