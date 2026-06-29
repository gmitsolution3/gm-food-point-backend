import { TCategory } from "./category.model";

export type TCreateCategoryPayload = Pick<TCategory, "name">;

export type TUpdateCategoryPayload = Partial<
  Pick<TCategory, "name" | "displayOrder" | "isActive">
>;
