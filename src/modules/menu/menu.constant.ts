export const MENU_MESSAGES = {
  CREATED: "Menu item created successfully.",
  RETRIEVED: "Menu item retrieved successfully.",
  RETRIEVED_ALL: "Menu items retrieved successfully.",
  UPDATED: "Menu item updated successfully.",
  DELETED: "Menu item deleted successfully.",

  NOT_FOUND: "Menu item not found.",

  SLUG_ALREADY_EXISTS: "Menu item slug already exists.",
  CATEGORY_NOT_FOUND: "Category not found.",

  INVALID_DISCOUNT_PRICE:
    "Discount price cannot be greater than the original price.",
} as const;
