import { TMenu } from "./menu.model";

export type TCreateMenuPayload = Pick<
  TMenu,
  | "name"
  | "description"
  | "categoryId"
  | "image"
  | "price"
  | "discountPrice"
  | "preparationTime"
  | "suggestedItems"
  | "isAvailable"
  | "isFeatured"
>;

export type TUpdateMenuPayload = Partial<
  Pick<
    TMenu,
    | "name"
    | "description"
    | "categoryId"
    | "image"
    | "price"
    | "discountPrice"
    | "preparationTime"
    | "suggestedItems"
    | "displayOrder"
    | "isAvailable"
    | "isFeatured"
  >
>;