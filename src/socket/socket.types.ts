export enum ESocketRole {
  CASHIER = "cashier",
  KITCHEN = "kitchen",
  MANAGER = "manager",
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
